type Env = {
  KEYSTATIC_BASIC_AUTH_USER?: string;
  KEYSTATIC_BASIC_AUTH_PASS?: string;
};

type MiddlewareContext<E> = {
  request: Request;
  env: E;
  next: () => Promise<Response>;
};

function unauthorized(realm = 'Keystatic') {
  return new Response('Unauthorized', {
    status: 401,
    headers: {
      'WWW-Authenticate': `Basic realm="${realm}", charset="UTF-8"`,
    },
  });
}

function parseBasicAuth(header: string) {
  if (!header.toLowerCase().startsWith('basic ')) return null;
  const encoded = header.slice(6).trim();
  let decoded: string;
  try {
    decoded = atob(encoded);
  } catch {
    return null;
  }
  const colon = decoded.indexOf(':');
  if (colon === -1) return null;
  return { user: decoded.slice(0, colon), pass: decoded.slice(colon + 1) };
}

export const onRequest = async (context: MiddlewareContext<Env>) => {
  const url = new URL(context.request.url);
  const pathname = url.pathname;

  const protectingKeystatic =
    pathname === '/keystatic' ||
    pathname.startsWith('/keystatic/') ||
    pathname === '/api/keystatic' ||
    pathname.startsWith('/api/keystatic/');

  if (!protectingKeystatic) return context.next();

  // Must be publicly reachable for GitHub OAuth redirect.
  if (pathname === '/api/keystatic/github/oauth/callback') return context.next();

  const user = context.env.KEYSTATIC_BASIC_AUTH_USER;
  const pass = context.env.KEYSTATIC_BASIC_AUTH_PASS;
  if (!user || !pass) return context.next(); // opt-in via env vars

  const auth = parseBasicAuth(context.request.headers.get('authorization') || '');
  if (!auth) return unauthorized();

  if (auth.user !== user || auth.pass !== pass) return unauthorized();
  return context.next();
};

