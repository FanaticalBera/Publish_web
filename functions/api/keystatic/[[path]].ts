import { makeGenericAPIRouteHandler } from '@keystatic/core/api/generic';
import keystaticConfig from '../../../keystatic.config';

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
