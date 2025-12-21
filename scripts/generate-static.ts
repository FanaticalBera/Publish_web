
// Scripts usually run in Node.js, so we can use FS
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { render } from '../src/entry-server';
import {
    getAllBooks, getAllAuthors, getAllNews,
    getHomepage, getAbout, getContact, getLegal,
    getLatestBooks, getLatestNews,
    getBookWithAuthors, getAuthorWithBooks, getNewsBySlug
} from '../src/utils/reader';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.resolve(__dirname, '../dist');

async function generate() {
    console.log('Starting Static Site Generation...');

    if (!fs.existsSync(DIST_DIR)) {
        console.error('Dist directory not found. Run "npm run build" first.');
        process.exit(1);
    }

    const template = fs.readFileSync(path.join(DIST_DIR, 'index.html'), 'utf-8');

    // Define Routes and Data Fetchers
    const routes: Array<{ path: string, dataFetcher: () => Promise<any> }> = [];

    // 1. Static Pages
    routes.push({
        path: '/', dataFetcher: async () => {
            const [hero, books, news] = await Promise.all([
                getHomepage(), getLatestBooks(4), getLatestNews(3)
            ]);
            return { hero: hero?.heroSection, latestBooks: books, latestNews: news };
        }
    });

    routes.push({ path: '/books', dataFetcher: getAllBooks });
    routes.push({ path: '/authors', dataFetcher: getAllAuthors });
    routes.push({ path: '/news', dataFetcher: getAllNews });
    routes.push({ path: '/about', dataFetcher: getAbout });
    routes.push({ path: '/contact', dataFetcher: getContact });
    routes.push({ path: '/privacy', dataFetcher: getLegal });

    // 2. Dynamic Pages (Books)
    const books = await getAllBooks();
    for (const book of books) {
        routes.push({
            path: `/books/${book.slug}`,
            dataFetcher: () => getBookWithAuthors(book.slug)
        });
    }

    // 3. Dynamic Pages (Authors)
    const authors = await getAllAuthors();
    for (const author of authors) {
        routes.push({
            path: `/authors/${author.slug}`,
            dataFetcher: () => getAuthorWithBooks(author.slug)
        });
    }

    // 4. Dynamic Pages (News)
    const newsList = await getAllNews();
    for (const news of newsList) {
        routes.push({
            path: `/news/${news.slug}`,
            dataFetcher: () => getNewsBySlug(news.slug)
        });
    }

    // Generate HTML for each route
    const sitemapUrls: string[] = [];

    for (const route of routes) {
        console.log(`Generating ${route.path}...`);

        try {
            const data = await route.dataFetcher();
            const preloadedPayload = { path: route.path, data };
            const { app, helmetContext } = render(route.path, preloadedPayload); // Using our entry-server render function
            const appHtml = ReactDOMServer.renderToString(app);

            // Inject into template
            // We can simple inject into <div id="root"> or similar
            // But since we are using client-side hydration, we usually need to preserve the ID.
            // Vite's index.html has <div id="root"></div> and <script type="module" src="/src/main.tsx"></script>
            // We replace <div id="root"></div> with <div id="root">${appHtml}</div>

            // Also inject "window.__PRELOADED_DATA__ = ..." script for hydration if we were partial hydrating
            // But here we are just pre-rendering. If we want client to NOT fetch again, we need to pass data.
            // For now, let's just render HTML for SEO. 
            // Client side currently checks "usePreloadedData()". This context is empty on client start unless we serialize it.
            // To make it perfect, we should inject JSON.

            const serializedData = JSON.stringify(preloadedPayload).replace(/</g, '\\u003c');
            const scriptTag = `<script>window.__PRELOADED_DATA__ = ${serializedData}</script>`;

            // Replace <title> if needed (Helmet handles it inside App but static render might result in helmet data separate)
            // React Helmet Async requires creating helmetContext on server
            // For simplicity, we trust Helmet to rendering tags, but we need to extract them.
            // Our entry-server.tsx doesn't export helmetContext. Let's assume basic rendering first.

            let html = template.replace(
                '<div id="root"></div>',
                `<div id="root">${appHtml}</div>${scriptTag}`
            );
            const helmet = (helmetContext as any).helmet;
            if (helmet) {
                const helmetTags = [
                    helmet.title?.toString() || '',
                    helmet.meta?.toString() || '',
                    helmet.link?.toString() || '',
                    helmet.script?.toString() || ''
                ].join('');
                if (helmetTags) {
                    html = html.replace('</head>', `${helmetTags}</head>`);
                }
            }

            // We need to extract Head tags. 
            // But our current render function just returns JSX. 
            // We need to modify entry-server to handle helmet data extraction if strict SEO title is needed in pure HTML before JS loads.
            // For now, content body is most important.

            // Save file
            const filePath = route.path === '/'
                ? path.join(DIST_DIR, 'index.html')
                : path.join(DIST_DIR, route.path, 'index.html');

            const dir = path.dirname(filePath);
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

            fs.writeFileSync(filePath, html);
            sitemapUrls.push(`https://dongtl.com${route.path}`);

        } catch (e) {
            console.error(`Failed to generate ${route.path}:`, e);
        }
    }

    // Generate Sitemap
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.map(url => `  <url>
    <loc>${url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </url>`).join('\n')}
</urlset>`;

    fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), sitemap);
    console.log('Sitemap generated.');
    console.log('SSG Complete.');
}

generate();
