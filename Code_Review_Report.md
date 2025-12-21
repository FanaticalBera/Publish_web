# Code Review Report

## High Priority
1. Global preloaded data is reused for every route, so client-side navigation can render stale or incompatible data.
   - Evidence: `src/main.tsx:9-17`, `src/pages/Home.tsx:11-21`, `src/pages/About.tsx:8-13`, `src/pages/News.tsx:8-13`.
   - Risk: wrong content or runtime errors after navigation (e.g., About page tries to read fields from Home payload).
   - Fix: include the route in preloaded payload and validate against `location.pathname`, or clear preloaded data after initial hydration.
2. `StaticRouter` import is incorrect for React Router v7 server rendering.
   - Evidence: `src/entry-server.tsx:2`.
   - Risk: SSG/SSR crash or incorrect routing during build.
   - Fix: import from `react-router-dom/server` or use the v7 server API.
3. Author links schema mismatch (strings vs objects).
   - Evidence: `keystatic.config.ts:90-93` defines `links` as `fields.array(fields.url(...))`, but `src/pages/AuthorDetail.tsx:59-63` expects `{ url, title }`.
   - Risk: links render as `undefined` and are not clickable.
   - Fix: treat links as string array in UI or change schema to an object with `url/title`.
4. Relationship resolution assumes related items exist and spreads possibly null values.
   - Evidence: `src/utils/reader.ts:223-226`, `src/utils/reader.ts:289-293`.
   - Risk: runtime crash when a referenced author/book is missing.
   - Fix: filter out null reads or guard before spreading.

## Medium Priority
5. Book detail pages do not consume preloaded data, so SSG outputs only the loading state.
   - Evidence: `src/pages/BookDetail.tsx:11-45` (no `usePreloadedData` usage).
   - Risk: empty static HTML and content jump on hydration.
   - Fix: use `usePreloadedData` like other pages or inject data via props.
6. Static build does not inject Helmet head tags.
   - Evidence: `scripts/generate-static.ts:103-111` comments and `src/entry-server.tsx` not returning `helmetContext`.
   - Risk: SEO meta tags missing until client JS runs.
   - Fix: extract Helmet data on the server and inject into `index.html` template.
7. Data model gaps: fields referenced by UI are not editable in Keystatic.
   - Evidence: `src/pages/Contact.tsx:40-41` expects `phone/address` but `keystatic.config.ts:205-211` does not define them.
   - Evidence: `src/pages/Home.tsx:67` expects `hero.ctaButton` but `keystatic.config.ts:175-177` has no CTA field.
   - Risk: these UI sections will stay empty in real content.
   - Fix: add fields to schema or remove usage in UI.

## Low Priority / Maintainability
8. Frontmatter parsing splits on every `---\n`, which can break when content includes horizontal rules.
   - Evidence: `src/utils/reader.ts:57`.
   - Fix: use a dedicated frontmatter parser or split only on the first two delimiters.
9. Multiple `@ts-ignore` directives around `react-helmet-async` imports.
   - Evidence: `src/App.tsx:3-5`, `src/entry-server.tsx:3-6`, `src/components/common/SEOHead.tsx:1-6`.
   - Fix: import `Helmet`/`HelmetProvider` via named exports and use official types.

## Notes
- Mock fallbacks are useful in dev, but consider gating them behind `import.meta.env.DEV` to avoid accidental production exposure.
