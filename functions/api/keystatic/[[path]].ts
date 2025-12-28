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
    'Most common causes:',
    `- GitHub OAuth App callback URL mismatch (expected: ${expectedCallback})`,
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
    const handler = makeGenericAPIRouteHandler({
      config: keystaticConfig,
      clientId: KEYSTATIC_GITHUB_CLIENT_ID,
      clientSecret: KEYSTATIC_GITHUB_CLIENT_SECRET,
      secret: KEYSTATIC_SECRET,
    });

    const result = await handler(context.request);
    const body = maybeExpandAuthError(context.request.url, result.status, result.body);
    return new Response(toResponseBody(body), {
      status: result.status ?? 200,
      headers: result.headers,
    });
  } catch (error) {
    console.error('Keystatic API route error:', error);
    return new Response(`Keystatic API route error: ${String(error)}`, { status: 500 });
  }
};
