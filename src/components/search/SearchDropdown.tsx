import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Book, User, Newspaper, FileText } from "lucide-react";
import {
    getAllAuthors,
    getAllBooks,
    getAllDataRoom,
    getAllNews,
} from "@/utils/reader";
import { getFirstParagraphText, mapNewsTypeLabel } from "@/utils/content-adapters";
import { formatDate } from "@/lib/utils";

type SearchType = "book" | "author" | "news" | "dataroom";

type SearchItem = {
    id: string;
    type: SearchType;
    title: string;
    href: string;
    description?: string;
    meta?: string;
    date?: string;
    image?: string;
    searchText: string;
};

type SearchDropdownProps = {
    query: string;
    onClose: () => void;
};

const GROUPS: { key: SearchType; label: string; icon: any }[] = [
    { key: "book", label: "도서", icon: Book },
    { key: "author", label: "작가", icon: User },
    { key: "news", label: "소식", icon: Newspaper },
    { key: "dataroom", label: "자료실", icon: FileText },
];

const MAX_ITEMS_PER_GROUP = 3;

function normalizeValue(value: string) {
    return value.toLowerCase().replace(/\s+/g, "").trim();
}

function buildSearchText(parts: Array<string | undefined | null>) {
    return normalizeValue(parts.filter(Boolean).join(" "));
}

function safeFormatDate(value?: string) {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return formatDate(value);
}

export default function SearchDropdown({ query, onClose }: SearchDropdownProps) {
    const [index, setIndex] = useState<SearchItem[]>([]);
    const [hasLoaded, setHasLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (hasLoaded || isLoading) return;

        let isMounted = true;
        setIsLoading(true);
        setError(null);

        Promise.all([
            getAllBooks(),
            getAllAuthors(),
            getAllNews(),
            getAllDataRoom(),
        ])
            .then(([books, authors, news, dataroom]) => {
                if (!isMounted) return;

                const authorMap = new Map<string, { name?: string; photo?: string; shortBio?: string }>();
                authors.forEach((item: any) => {
                    const entry = item.entry || {};
                    authorMap.set(item.slug, {
                        name: entry.name || item.slug,
                        photo: entry.photo,
                        shortBio: entry.shortBio || "",
                    });
                });

                const items: SearchItem[] = [];

                books.forEach((item: any) => {
                    const entry = item.entry || {};
                    const authorNames = (entry.authors || [])
                        .map((slug: string) => authorMap.get(slug)?.name || slug)
                        .filter(Boolean);
                    const description =
                        entry.summary || getFirstParagraphText(entry.description) || "";
                    const seriesName = entry.series?.name;
                    const categories = Array.isArray(entry.categories)
                        ? entry.categories
                        : [];
                    const title = entry.title || item.slug;
                    const publishDate = entry.publishDate || "";
                    items.push({
                        id: `book-${item.slug}`,
                        type: "book",
                        title,
                        href: `/books/${item.slug}`,
                        description,
                        meta: authorNames.join(", "),
                        date: publishDate,
                        image: entry.coverImage || "",
                        searchText: buildSearchText([
                            title,
                            entry.isbn,
                            entry.originalTitle,
                            seriesName,
                            description,
                            authorNames.join(" "),
                            categories.join(" "),
                        ]),
                    });
                });

                authors.forEach((item: any) => {
                    const entry = item.entry || {};
                    const title = entry.name || item.slug;
                    const description = entry.shortBio || getFirstParagraphText(entry.bio) || "";
                    items.push({
                        id: `author-${item.slug}`,
                        type: "author",
                        title,
                        href: `/authors/${item.slug}`,
                        description,
                        image: entry.photo || "",
                        searchText: buildSearchText([title, description]),
                    });
                });

                news.forEach((item: any) => {
                    const entry = item.entry || {};
                    const title = entry.title || item.slug;
                    const description = entry.excerpt || getFirstParagraphText(entry.content) || "";
                    const category = mapNewsTypeLabel(entry.type);
                    const publishDate = entry.publishedAt || "";
                    items.push({
                        id: `news-${item.slug}`,
                        type: "news",
                        title,
                        href: `/news/${item.slug}`,
                        description,
                        meta: category,
                        date: publishDate,
                        image: entry.coverImage || "",
                        searchText: buildSearchText([title, description, category]),
                    });
                });

                dataroom.forEach((item: any) => {
                    const entry = item.entry || {};
                    const title = entry.title || item.slug;
                    const description = getFirstParagraphText(entry.description) || "";
                    const publishDate = entry.publishedAt || "";
                    items.push({
                        id: `dataroom-${item.slug}`,
                        type: "dataroom",
                        title,
                        href: `/dataroom/${item.slug}`,
                        description,
                        date: publishDate,
                        image: entry.coverImage || "",
                        searchText: buildSearchText([title, description]),
                    });
                });

                setIndex(items);
            })
            .catch((err) => {
                console.error(err);
                if (isMounted) {
                    setError("검색 데이터를 불러오는 중 문제가 발생했습니다.");
                }
            })
            .finally(() => {
                if (isMounted) {
                    setIsLoading(false);
                    setHasLoaded(true);
                }
            });

        return () => {
            isMounted = false;
        };
    }, [hasLoaded, isLoading]);

    const filtered = useMemo(() => {
        const trimmed = query.trim();
        if (!trimmed) return [];
        const tokens = trimmed
            .toLowerCase()
            .split(/\s+/)
            .map((token) => normalizeValue(token))
            .filter(Boolean);

        if (!tokens.length) return [];
        return index.filter((item) =>
            tokens.every((token) => item.searchText.includes(token)),
        );
    }, [index, query]);

    const grouped = useMemo(() => {
        const groups: Record<SearchType, SearchItem[]> = {
            book: [],
            author: [],
            news: [],
            dataroom: [],
        };
        filtered.forEach((item) => {
            groups[item.type].push(item);
        });
        return groups;
    }, [filtered]);

    const totalCount = filtered.length;
    const hasResults = totalCount > 0;

    if (!query.trim()) {
        return (
            <div className="absolute top-full right-0 mt-2 w-full md:w-[400px] bg-card border border-border rounded-2xl shadow-2xl p-6 animate-fade-in z-50">
                <p className="text-sm text-muted-foreground text-center">
                    검색어를 입력하세요
                </p>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="absolute top-full right-0 mt-2 w-full md:w-[400px] bg-card border border-border rounded-2xl shadow-2xl p-6 animate-fade-in z-50">
                <p className="text-sm text-muted-foreground text-center">
                    검색 중...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="absolute top-full right-0 mt-2 w-full md:w-[400px] bg-card border border-border rounded-2xl shadow-2xl p-6 animate-fade-in z-50">
                <p className="text-sm text-destructive text-center">{error}</p>
            </div>
        );
    }

    if (!hasResults) {
        return (
            <div className="absolute top-full right-0 mt-2 w-full md:w-[400px] bg-card border border-border rounded-2xl shadow-2xl p-6 animate-fade-in z-50">
                <p className="text-sm font-medium text-foreground text-center">
                    검색 결과가 없습니다
                </p>
                <p className="text-xs text-muted-foreground text-center mt-1">
                    다른 키워드로 다시 검색해 보세요
                </p>
            </div>
        );
    }

    return (
        <div className="absolute top-full right-0 mt-2 w-full md:w-[400px] bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-fade-in max-h-[70vh] overflow-y-auto z-50">
            <div className="p-4 border-b border-border">
                <p className="text-sm text-muted-foreground">
                    검색 결과 <span className="font-semibold text-foreground">{totalCount}</span>건
                </p>
            </div>

            <div className="p-4 space-y-6">
                {GROUPS.map((group) => {
                    const items = grouped[group.key] ?? [];
                    if (items.length === 0) return null;

                    const visibleItems = items.slice(0, MAX_ITEMS_PER_GROUP);
                    const Icon = group.icon;

                    return (
                        <section key={group.key}>
                            <div className="flex items-center gap-2 mb-3">
                                <Icon className="h-4 w-4 text-muted-foreground" />
                                <h3 className="font-heading text-sm font-semibold text-foreground">
                                    {group.label}
                                </h3>
                                <span className="text-xs text-muted-foreground">
                                    ({items.length})
                                </span>
                            </div>
                            <div className="space-y-2">
                                {visibleItems.map((item) => (
                                    <Link
                                        key={item.id}
                                        to={item.href}
                                        onClick={onClose}
                                        className="flex gap-3 rounded-xl border border-border p-3 hover:bg-muted/50 transition-colors"
                                    >
                                        {item.image && (
                                            <div className="w-10 h-14 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                                                <img
                                                    src={item.image}
                                                    alt={item.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        )}
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-start justify-between gap-2">
                                                <p className="font-medium text-sm text-foreground truncate">
                                                    {item.title}
                                                </p>
                                                {item.date && (
                                                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                                                        {safeFormatDate(item.date)}
                                                    </span>
                                                )}
                                            </div>
                                            {item.meta && (
                                                <p className="text-xs text-muted-foreground mt-0.5 truncate">
                                                    {item.meta}
                                                </p>
                                            )}
                                            {item.description && (
                                                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                                    {item.description}
                                                </p>
                                            )}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    );
                })}
            </div>
        </div>
    );
}
