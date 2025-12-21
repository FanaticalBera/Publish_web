import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { makeGenericAPIRouteHandler } from '@keystatic/core/api/generic'
import keystaticConfig from './keystatic.config'

// Helper to convert Node request to Web Request
async function toWebRequest(req: any): Promise<Request> {
  const url = `http://${req.headers.host}${req.originalUrl || req.url}`;
  const allowBody = ['POST', 'PUT', 'PATCH'].includes(req.method);

  let body = null;
  if (allowBody) {
    const buffers = [];
    for await (const chunk of req) {
      buffers.push(chunk);
    }
    body = Buffer.concat(buffers);
  }

  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (typeof value === 'string') {
      headers.set(key, value);
    } else if (Array.isArray(value)) {
      value.forEach(v => headers.append(key, v));
    }
  }

  return new Request(url, {
    method: req.method,
    headers,
    body,
    // @ts-ignore - duplex is needed for Node environments in some versions but Request init types might complain
    duplex: 'half'
  });
}

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'keystatic-middleware',
      configureServer(server) {
        const handler = makeGenericAPIRouteHandler({ config: keystaticConfig });

        server.middlewares.use('/api/keystatic', async (req, res) => {
          try {
            const webReq = await toWebRequest(req);
            const webRes: any = await handler(webReq);

            // Keystatic returns a plain object { status, body }, not a Web Response
            res.statusCode = webRes.status || 200;

            // Write the body directly
            if (webRes.body) {
              if (typeof webRes.body === 'string') {
                res.write(webRes.body);
              } else {
                // body is Buffer/Uint8Array
                res.write(webRes.body);
              }
            }
            res.end();
          } catch (e) {
            console.error('Keystatic Middleware Error:', e);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: 'Internal Server Error', details: String(e) }));
          }
        });
      }
    }
  ],
  resolve: {
    alias: {
      react: 'react',
      'react-dom': 'react-dom',
      '@': path.resolve(__dirname, 'src')
    }
  },
  server: {
    host: '0.0.0.0', // localhost/127/내부망 모두 허용
    port: 5176,      // 원하면 고정 포트
  },
})
