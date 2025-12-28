import { makeGenericAPIRouteHandler } from '@keystatic/core/api/generic';
import keystaticConfig from '../../../keystatic.config';
import * as cookie from 'cookie';

type Env = {
  KEYSTATIC_GITHUB_CLIENT_ID?: string;
  KEYSTATIC_GITHUB_CLIENT_SECRET?: string;
  KEYSTATIC_SECRET?: string;
};

type PagesContext<E> = {
  request: Request;
  env: E;
};

function toResponseBody(body: string | Uint8Array | null): BodyInit | null {
  if (body === null) return null;
  if (typeof body === 'string') return body;
  return body as unknown as BodyInit;
}

function ensureProcessEnv() {
  const globalAny = globalThis as unknown as { process?: { env?: Record<string, string> } };
  if (!globalAny.process) globalAny.process = {};
  if (!globalAny.process.env) globalAny.process.env = {};
  if (!globalAny.process.env.NODE_ENV) globalAny.process.env.NODE_ENV = 'production';
}

const keystaticRouteRegex =
  /^branch\/[^]+(\/collection\/[^/]+(|\/(create|item\/[^/]+))|\/singleton\/[^/]+)?$/;

function getKeystaticPathname(req: Request) {
  const url = new URL(req.url);
  return url.pathname.replace(/^\/api\/keystatic\/?/, '');
}

function redirect(location: string, headers?: Headers) {
  const out = headers ?? new Headers();
  out.set('Location', location);
  return new Response(null, { status: 307, headers: out });
}

function cookieHeader(value: string) {
  return ['Set-Cookie', value] as const;
}

function appendSetCookie(headers: Headers, value: string) {
  headers.append(...cookieHeader(value));
}

function sameSiteLaxCookieBase() {
  return {
    sameSite: 'lax' as const,
    secure: true,
    path: '/',
  };
}

async function handleGitHubOauthCallback(args: {
  request: Request;
  clientId: string;
  clientSecret: string;
}): Promise<Response> {
  const url = new URL(args.request.url);
  const searchParams = url.searchParams;

  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');
  if (typeof errorDescription === 'string') {
    return new Response(
      `An error occurred when trying to authenticate with GitHub:\n${errorDescription}${error ? `\n\nerror=${error}` : ''}`,
      { status: 400 }
    );
  }

  const code = searchParams.get('code');
  const state = searchParams.get('state');
  if (typeof code !== 'string') return new Response('Bad Request', { status: 400 });

  const cookies = cookie.parse(args.request.headers.get('cookie') ?? '');
  const fromCookie = state ? cookies['ks-' + state] : undefined;
  const from = typeof fromCookie === 'string' && keystaticRouteRegex.test(fromCookie) ? fromCookie : undefined;

  const tokenUrl = new URL('https://github.com/login/oauth/access_token');
  tokenUrl.searchParams.set('client_id', args.clientId);
  tokenUrl.searchParams.set('client_secret', args.clientSecret);
  tokenUrl.searchParams.set('code', code);

  const tokenRes = await fetch(tokenUrl, {
    method: 'POST',
    headers: { Accept: 'application/json' },
  });

  const contentType = tokenRes.headers.get('content-type') ?? '';
  const tokenJson = contentType.includes('application/json') ? await tokenRes.json().catch(() => null) : null;

  if (!tokenRes.ok) {
    const extra =
      tokenJson && typeof tokenJson === 'object' && 'error' in tokenJson
        ? `\n\nGitHub token exchange error: ${(tokenJson as any).error}${(tokenJson as any).error_description ? ` (${(tokenJson as any).error_description})` : ''}`
        : '';
    return new Response(`Authorization failed${extra}`, { status: 401 });
  }

  const accessToken = tokenJson && typeof tokenJson === 'object' ? (tokenJson as any).access_token : undefined;
  if (typeof accessToken !== 'string' || !accessToken) {
    return new Response(
      `Authorization failed\n\nGitHub token exchange response missing access_token.\ncontent-type=${contentType || 'none'}`,
      { status: 401 }
    );
  }

  const headers = new Headers();

  // GitHub may return non-expiring tokens (no refresh token). Keystatic upstream expects refresh tokens,
  // so we store the access token and treat refresh as a no-op in our route handler below.
  appendSetCookie(
    headers,
    cookie.serialize('keystatic-gh-access-token', accessToken, {
      ...sameSiteLaxCookieBase(),
      // keep it long-lived; if token is expiring, user can re-login
      maxAge: 60 * 60 * 24 * 365,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
    })
  );
  appendSetCookie(
    headers,
    cookie.serialize('keystatic-gh-refresh-token', '', {
      ...sameSiteLaxCookieBase(),
      httpOnly: true,
      maxAge: 0,
      expires: new Date(),
    })
  );

  if (state === 'close') {
    headers.set('Content-Type', 'text/html');
    return new Response(
      "<script>localStorage.setItem('ks-refetch-installations', 'true');window.close();</script>",
      { status: 200, headers }
    );
  }

  return redirect(`/keystatic${from ? `/${from}` : ''}`, headers);
}

function handleGitHubRefreshToken(request: Request): Response {
  const cookies = cookie.parse(request.headers.get('cookie') ?? '');
  const accessToken = cookies['keystatic-gh-access-token'];
  if (typeof accessToken !== 'string' || !accessToken) {
    return new Response('Authorization failed', { status: 401 });
  }
  return new Response('', { status: 200 });
}

async function debugGitHubTokenExchange(args: {
  code: string;
  clientId: string;
  clientSecret: string;
}): Promise<string | undefined> {
  try {
    const url = new URL('https://github.com/login/oauth/access_token');
    url.searchParams.set('client_id', args.clientId);
    url.searchParams.set('client_secret', args.clientSecret);
    url.searchParams.set('code', args.code);

    const res = await fetch(url, {
      method: 'POST',
      headers: { Accept: 'application/json' },
    });

    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await res.json().catch(() => null);
      if (data && typeof data === 'object' && 'error' in data) {
        const err = (data as any).error;
        const desc = (data as any).error_description;
        const uri = (data as any).error_uri;
        return `GitHub token exchange error: ${String(err)}${desc ? ` (${String(desc)})` : ''}${uri ? `\n${String(uri)}` : ''}`;
      }
      return `GitHub token exchange returned HTTP ${res.status} but not an error JSON.`;
    }

    const text = await res.text().catch(() => '');
    return `GitHub token exchange returned HTTP ${res.status} (${contentType || 'no content-type'}): ${text.slice(0, 200)}`;
  } catch (error) {
    return `GitHub token exchange debug failed: ${String(error)}`;
  }
}

function maybeExpandAuthError(requestUrl: string, status: number | undefined, body: string | Uint8Array | null) {
  if (status !== 401) return body;
  if (typeof body !== 'string') return body;
  if (body.trim() !== 'Authorization failed') return body;

  const url = new URL(requestUrl);
  const origin = url.origin;
  const expectedCallback = `${origin}/api/keystatic/github/oauth/callback`;

  return [
    'Authorization failed while completing GitHub OAuth.',
    '',
    `Expected callback URL: ${expectedCallback}`,
    '',
    'Most common causes:',
    `- GitHub OAuth App callback URL mismatch`,
    '- GitHub OAuth App token expiration disabled (Keystatic expects `expires_in` + `refresh_token` in the access token response)',
    '- Wrong `KEYSTATIC_GITHUB_CLIENT_ID` / `KEYSTATIC_GITHUB_CLIENT_SECRET` values (must be from a GitHub *OAuth App*, not a GitHub App)',
    '- Cloudflare Pages env vars not set for this environment (Production vs Preview)',
    '',
    'Check Cloudflare Pages -> Functions/Logs for the `/api/keystatic/github/oauth/callback` request and the GitHub OAuth App settings.',
  ].join('\n');
}

export const onRequest = async (context: PagesContext<Env>): Promise<Response> => {
  const { KEYSTATIC_GITHUB_CLIENT_ID, KEYSTATIC_GITHUB_CLIENT_SECRET, KEYSTATIC_SECRET } =
    context.env;

  if (!KEYSTATIC_GITHUB_CLIENT_ID || !KEYSTATIC_GITHUB_CLIENT_SECRET || !KEYSTATIC_SECRET) {
    return new Response(
      'Missing Keystatic env vars: KEYSTATIC_GITHUB_CLIENT_ID, KEYSTATIC_GITHUB_CLIENT_SECRET, KEYSTATIC_SECRET',
      { status: 500 }
    );
  }
  if (KEYSTATIC_SECRET.length < 32) {
    return new Response('KEYSTATIC_SECRET must be at least 32 characters long', { status: 500 });
  }

  try {
    ensureProcessEnv();

    const pathname = getKeystaticPathname(context.request);
    if (pathname === 'github/oauth/callback') {
      return handleGitHubOauthCallback({
        request: context.request,
        clientId: KEYSTATIC_GITHUB_CLIENT_ID,
        clientSecret: KEYSTATIC_GITHUB_CLIENT_SECRET,
      });
    }
    if (pathname === 'github/refresh-token') {
      return handleGitHubRefreshToken(context.request);
    }

    const handler = makeGenericAPIRouteHandler({
      config: keystaticConfig,
      clientId: KEYSTATIC_GITHUB_CLIENT_ID,
      clientSecret: KEYSTATIC_GITHUB_CLIENT_SECRET,
      secret: KEYSTATIC_SECRET,
    });

    const result = await handler(context.request);
    let body: string | Uint8Array | null = maybeExpandAuthError(
      context.request.url,
      result.status,
      result.body
    );

    if (result.status === 401 && typeof body === 'string' && body.includes('Authorization failed')) {
      const url = new URL(context.request.url);
      if (url.pathname === '/api/keystatic/github/oauth/callback') {
        const code = url.searchParams.get('code');
        if (typeof code === 'string') {
          const debug = await debugGitHubTokenExchange({
            code,
            clientId: KEYSTATIC_GITHUB_CLIENT_ID,
            clientSecret: KEYSTATIC_GITHUB_CLIENT_SECRET,
          });
          if (debug) body = `${body}\n\n${debug}`;
        }
      }
    }

    return new Response(toResponseBody(body), {
      status: result.status ?? 200,
      headers: result.headers,
    });
  } catch (error) {
    console.error('Keystatic API route error:', error);
    return new Response(`Keystatic API route error: ${String(error)}`, { status: 500 });
  }
};
