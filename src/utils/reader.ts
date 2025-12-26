import keystaticConfig from '../../keystatic.config';
import * as jsyaml from 'js-yaml';

// Fix TS error "process is not defined" without installing @types/node globally
declare var process: any;

// Helper to normalize Date objects to ISO strings for consistent rendering/sorting
function normalizeDates(value: any): any {
    if (value instanceof Date) return value.toISOString().split('T')[0];
    if (Array.isArray(value)) return value.map(normalizeDates);
    if (value && typeof value === 'object') {
        const out: any = {};
        for (const [k, v] of Object.entries(value)) out[k] = normalizeDates(v);
        return out;
    }
    return value;
}

// Fallback parser when YAML frontmatter is malformed (e.g., duplicated keys)
function parseLooseFrontmatter(raw: string, contentField: string) {
    const lines = raw.replace(/\r\n/g, '\n').split('\n');
    const data: Record<string, any> = {};
    let currentKey: string | null = null;

    for (const line of lines) {
        const trimmed = line.trim();
        const keyMatch = trimmed.match(/^([A-Za-z0-9_-]+):\s*$/);
        const isTopLevel = line.length === trimmed.length;
        if (keyMatch && isTopLevel) {
            const key = keyMatch[1];
            if (key !== 'children') {
                currentKey = key;
                if (!data[currentKey]) data[currentKey] = [];
            }
            continue;
        }
        const textMatch = line.match(/^\s*-\s*text:\s*(.*)$/);
        if (textMatch && currentKey) {
            data[currentKey].push({
                type: 'paragraph',
                children: [{ text: textMatch[1] }]
            });
        }
    }

    if (Object.keys(data).length === 0) {
        return { [contentField]: raw.trim() };
    }

    return data;
}

// Helper to parse frontmatter + content
function parseMdoc(content: string, contentField: string = 'content') {
    // Normalize line endings (CRLF -> LF) for consistent parsing
    const normalized = content.replace(/\r\n/g, '\n');
    const parts = normalized.split('---\n');
    if (parts.length < 3) return { [contentField]: content }; // No frontmatter/body split

    try {
        const frontmatter = jsyaml.load(parts[1]) as any;
        const body = parts.slice(2).join('---\n').trim();
        return {
            ...normalizeDates(frontmatter),
            [contentField]: body
        };
    } catch (e) {
        console.warn('Failed to parse frontmatter, using loose parser:', e);
        return parseLooseFrontmatter(parts[1], contentField);
    }
}

function swapExtension(path: string, ext: string) {
    return path.replace(/\.[^.]+$/, `.${ext}`);
}

function parseContentFile(path: string, raw: string, contentField: string) {
    if (path.endsWith('.yaml') || path.endsWith('.yml')) {
        try {
            const data = jsyaml.load(raw) as any;
            return normalizeDates(data) || {};
        } catch (e) {
            console.warn('Failed to parse yaml:', e);
            return {};
        }
    }
    return parseMdoc(raw, contentField);
}

// Dev Reader Implementation
function createDevReader() {
    // Eagerly load all content files
    const contentFiles = import.meta.glob('/content/**/*.{mdoc,yaml,yml}', { query: '?raw', eager: true });

    // Helper to list collection items
    const listCollection = (pathPrefix: string, contentField: string) => {
        return Object.entries(contentFiles)
            .filter(([path]) => path.startsWith(pathPrefix))
            .map(([path, mod]: [string, any]) => {
                const slug = path.split('/').pop()?.replace(/\.(mdoc|yaml|yml)$/, '') || '';
                const raw = mod.default || mod;
                const entry = parseContentFile(path, raw, contentField);
                return { slug, entry };
            });
    };

    // Helper to read single item
    const readItem = (path: string, contentField: string) => {
        const candidates = [
            path,
            swapExtension(path, 'yaml'),
            swapExtension(path, 'yml')
        ];
        const foundPath = candidates.find(candidate => contentFiles[candidate]);
        if (!foundPath) return null;
        const file = contentFiles[foundPath];
        const raw = (file as any).default || (file as any);
        return parseContentFile(foundPath, raw, contentField);
    };

    const readSingletonFlex = (basePath: string, contentField: string) => {
        // 1) folder with individual fields (e.g., /content/about/mission.mdoc)
        const folderPrefix = `${basePath}/`;
        const entries = Object.entries(contentFiles).filter(([path]) => path.startsWith(folderPrefix));
        if (entries.length) {
            const data: Record<string, any> = {};
            for (const [path, mod] of entries) {
                const raw = (mod as any).default || (mod as any);
                const key = path.replace(folderPrefix, '').replace(/\.(mdoc|yaml|yml)$/, '');
                const parsed = parseContentFile(path, raw, key);
                if (parsed && typeof parsed === 'object' && key in parsed && Object.keys(parsed).length === 1) {
                    data[key] = (parsed as any)[key];
                } else {
                    data[key] = parsed;
                }
            }
            return data;
        }

        // 2) direct file (prefer yaml/yml since Keystatic singletons typically store there)
        const directYaml = readItem(`${basePath}.yaml`, contentField);
        if (directYaml) return directYaml;
        const directYml = readItem(`${basePath}.yml`, contentField);
        if (directYml) return directYml;
        const directMdoc = readItem(`${basePath}.mdoc`, contentField);
        if (directMdoc) return directMdoc;
        return null;
    };

    return {
        collections: {
            books: {
                all: async () => listCollection('/content/books/', 'description'),
                read: async (slug: string) => readItem(`/content/books/${slug}.mdoc`, 'description')
            },
            authors: {
                all: async () => listCollection('/content/authors/', 'bio'),
                read: async (slug: string) => readItem(`/content/authors/${slug}.mdoc`, 'bio')
            },
            news: {
                all: async () => listCollection('/content/news/', 'content'),
                read: async (slug: string) => readItem(`/content/news/${slug}.mdoc`, 'content')
            },
            dataroom: {
                all: async () => listCollection('/content/dataroom/', 'description'),
                read: async (slug: string) => readItem(`/content/dataroom/${slug}.mdoc`, 'description')
            },
            referenceNotes: {
                all: async () => listCollection('/content/reference-notes/', 'content'),
                read: async (slug: string) => readItem(`/content/reference-notes/${slug}.mdoc`, 'content')
            }
        },
        singletons: {
            settings: { read: async () => readSingletonFlex('/content/settings', 'content') },
            homepage: { read: async () => readSingletonFlex('/content/homepage', 'content') },
            about: { read: async () => readSingletonFlex('/content/about', 'content') },
            contact: { read: async () => readSingletonFlex('/content/contact', 'content') },
            legal: { read: async () => readSingletonFlex('/content/legal', 'privacyPolicy') }
        }
    };
}

// Helper to get reader instance safely
async function getReader() {
    const isServer = typeof window === 'undefined';
    if (isServer) {
        // Node / SSG Environment - Dynamic Import
        try {
            const { createReader } = await import('@keystatic/core/reader');
            return createReader(process.cwd(), keystaticConfig);
        } catch (e) {
            console.warn("Failed to load Keystatic reader (Node):", e);
            return null;
        }
    }
    // Browser / Dev Environment
    return createDevReader();
}

export interface BookEntry {
    slug: string;
    entry: any;
}

export async function getAllBooks() {
    const reader = await getReader();
    if (!reader) return [];
    const books = await reader.collections.books.all();
    return books.sort((a: any, b: any) => {
        const dateA = new Date(a.entry.publishDate || 0).getTime();
        const dateB = new Date(b.entry.publishDate || 0).getTime();
        return dateB - dateA;
    });
}

export async function getBookBySlug(slug: string) {
    const reader = await getReader();
    if (!reader) return null;
    return await reader.collections.books.read(slug);
}

export async function getBookWithAuthors(slug: string) {
    const reader = await getReader();
    if (!reader) return null;
    const book = await reader.collections.books.read(slug);
    if (!book) return null;

    const authorSlugs = book.authors || [];
    const authorsData = (await Promise.all(
        authorSlugs.filter((slug: any): slug is string => !!slug).map(async (authorSlug: string) => {
            const author = await reader.collections.authors.read(authorSlug);
            if (!author) return null;
            return {
                slug: authorSlug,
                ...author
            };
        })
    )).filter((author): author is { slug: string } => !!author);

    return {
        ...book,
        resolvedAuthors: authorsData
    };
}

export async function getAllAuthors() {
    const reader = await getReader();
    if (!reader) return [];
    return await reader.collections.authors.all();
}

export async function getAuthorWithBooks(slug: string) {
    const reader = await getReader();
    if (!reader) return null;
    const author = await reader.collections.authors.read(slug);
    if (!author) return null;

    const authorBooks = (await reader.collections.books.all())
        .filter((book: any) => {
            return book.entry.authors?.includes(slug);
        })
        .sort((a: any, b: any) => {
            return new Date(b.entry.publishDate || 0).getTime() - new Date(a.entry.publishDate || 0).getTime();
        });

    return {
        ...author,
        books: authorBooks
    };
}

export async function getAllNews() {
    const reader = await getReader();
    if (!reader) return [];
    try {
        const news = await reader.collections.news.all();
        // Filter out items without valid entries and sort safely
        return news
            .filter((item: any) => item.entry && item.entry.publishedAt)
            .sort((a: any, b: any) => {
                const dateA = new Date(a.entry.publishedAt).getTime();
                const dateB = new Date(b.entry.publishedAt).getTime();
                return (isNaN(dateB) ? 0 : dateB) - (isNaN(dateA) ? 0 : dateA);
            });
    } catch (e) {
        console.warn("Failed to fetch news:", e);
        return [];
    }
}

export async function getNewsBySlug(slug: string) {
    const reader = await getReader();
    if (!reader) return null;
    const newsItem = await reader.collections.news.read(slug);
    if (!newsItem) return null;

    const relatedBookSlugs = newsItem.relatedBooks || [];
    const relatedBooks = (await Promise.all(
        relatedBookSlugs.filter((s: any) => !!s).map(async (bookSlug: string) => {
            const book = await reader.collections.books.read(bookSlug);
            if (!book) return null;
            return {
                slug: bookSlug,
                ...book
            };
        })
    )).filter((book): book is { slug: string } => !!book);

    return {
        ...newsItem,
        resolvedRelatedBooks: relatedBooks
    };
}

export async function getAllDataRoom() {
    const reader = await getReader();
    if (!reader) return [];
    try {
        const items = await reader.collections.dataroom.all();
        return items
            .filter((item: any) => item.entry && item.entry.publishedAt)
            .sort((a: any, b: any) => {
                const dateA = new Date(a.entry.publishedAt).getTime();
                const dateB = new Date(b.entry.publishedAt).getTime();
                return (isNaN(dateB) ? 0 : dateB) - (isNaN(dateA) ? 0 : dateA);
            });
    } catch (e) {
        console.warn("Failed to fetch dataroom items:", e);
        return [];
    }
}

export async function getDataRoomBySlug(slug: string) {
    const reader = await getReader();
    if (!reader) return null;
    return await reader.collections.dataroom.read(slug);
}

export async function getAllReferenceNotes() {
    const reader = await getReader();
    if (!reader) return [];
    try {
        const items = await reader.collections.referenceNotes.all();
        return items
            .filter((item: any) => item.entry && item.entry.publishedAt)
            .sort((a: any, b: any) => {
                const dateA = new Date(a.entry.publishedAt).getTime();
                const dateB = new Date(b.entry.publishedAt).getTime();
                return (isNaN(dateB) ? 0 : dateB) - (isNaN(dateA) ? 0 : dateA);
            });
    } catch (e) {
        console.warn("Failed to fetch reference notes:", e);
        return [];
    }
}

export async function getReferenceNoteBySlug(slug: string) {
    const reader = await getReader();
    if (!reader) return null;
    return await reader.collections.referenceNotes.read(slug);
}

export async function getSettings() {
    const reader = await getReader();
    if (!reader) return null;
    return await reader.singletons.settings.read();
}

export async function getHomepage() {
    const reader = await getReader();
    if (!reader) return null;
    return await reader.singletons.homepage.read();
}

export async function getAbout() {
    const reader = await getReader();
    if (!reader) return null;
    return await reader.singletons.about.read();
}

export async function getContact() {
    const reader = await getReader();
    if (!reader) return null;
    return await reader.singletons.contact.read();
}

export async function getLegal() {
    const reader = await getReader();
    if (!reader) return null;
    return await reader.singletons.legal.read();
}

export async function getLatestBooks(limit: number = 4) {
    const books = await getAllBooks();
    return books.slice(0, limit);
}

export async function getLatestNews(limit: number = 3) {
    const news = await getAllNews();
    return news.slice(0, limit);
}
