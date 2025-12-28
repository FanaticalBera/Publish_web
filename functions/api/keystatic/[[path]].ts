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

    let githubTokenExchangeDebug: string | undefined;
    const originalFetch = globalThis.fetch.bind(globalThis);
    let fetchPatched = false;
    try {
      try {
        globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
          const urlStr =
            typeof input === 'string'
              ? input
              : input instanceof URL
                ? input.toString()
                : input.url;
          const res = await originalFetch(input, init);

          if (urlStr === 'https://github.com/login/oauth/access_token') {
            try {
              const clone = res.clone();
              const contentType = clone.headers.get('content-type') || '';
              if (contentType.includes('application/json')) {
                const data = await clone.json();
                if (data && typeof data === 'object' && 'error' in data) {
                  const err = (data as any).error;
                  const desc = (data as any).error_description;
                  githubTokenExchangeDebug = `GitHub token exchange error: ${String(err)}${
                    desc ? ` (${String(desc)})` : ''
                  }`;
                }
              } else if (!res.ok) {
                const text = await clone.text();
                githubTokenExchangeDebug = `GitHub token exchange HTTP ${res.status}: ${text.slice(0, 200)}`;
              }
            } catch {
              if (!res.ok) githubTokenExchangeDebug = `GitHub token exchange HTTP ${res.status}`;
            }
          }

          return res;
        };
        fetchPatched = true;
      } catch {
        // Ignore if runtime disallows overriding fetch.
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
      if (
        result.status === 401 &&
        typeof body === 'string' &&
        body.startsWith('Authorization failed') &&
        githubTokenExchangeDebug
      ) {
        body = `${body}\n\n${githubTokenExchangeDebug}`;
      }
      return new Response(toResponseBody(body), {
        status: result.status ?? 200,
        headers: result.headers,
      });
    } finally {
      if (fetchPatched) globalThis.fetch = originalFetch;
    }
  } catch (error) {
    console.error('Keystatic API route error:', error);
    return new Response(`Keystatic API route error: ${String(error)}`, { status: 500 });
  }
};
