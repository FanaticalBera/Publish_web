import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
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

type SearchModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const GROUPS: { key: SearchType; label: string }[] = [
  { key: "book", label: "도서" },
  { key: "author", label: "작가" },
  { key: "news", label: "소식" },
  { key: "dataroom", label: "자료실" },
];

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

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const isMobile = useIsMobile();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    {},
  );
  const [index, setIndex] = useState<SearchItem[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setExpandedGroups({});
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const timer = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || hasLoaded || isLoading) return;

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
  }, [hasLoaded, isLoading, isOpen]);

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
  const recommendedBooks = useMemo(() => {
    return index
      .filter((item) => item.type === "book")
      .slice(0, 3);
  }, [index]);

  if (!isOpen) return null;

  return (
    <>
      <div className="drawer-overlay animate-fade-in" onClick={onClose} aria-hidden="true" />
      <div
        className={
          isMobile
            ? "fixed inset-0 z-50 bg-card flex flex-col"
            : "fixed inset-0 z-50 flex items-start justify-center p-4 md:p-8"
        }
        role="dialog"
        aria-modal="true"
      >
        <div
          className={
            isMobile
              ? "flex flex-col h-full"
              : "bg-card w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden animate-fade-in"
          }
        >
          <div className="px-5 md:px-6 pt-5 md:pt-6 pb-4 border-b border-border">
            <div className="flex items-center gap-3">
              <Search className="h-5 w-5 text-muted-foreground" />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="검색어를 입력하세요"
                className="flex-1 bg-transparent text-lg outline-none placeholder:text-muted-foreground"
                aria-label="검색어 입력"
              />
              {query && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuery("")}
                  aria-label="검색어 지우기"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
              <Button variant="ghost" size="icon" onClick={onClose} aria-label="검색 닫기">
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="mt-3 text-sm text-muted-foreground">
              {query.trim() ? `검색 결과 ${totalCount}건` : "검색어를 입력하면 결과가 표시됩니다"}
            </div>
          </div>

          <div className={isMobile ? "flex-1 overflow-y-auto px-5 pb-6" : "max-h-[70vh] overflow-y-auto px-6 pb-6"}>
            {error && (
              <div className="py-10 text-center text-destructive">
                {error}
              </div>
            )}

            {!isLoading && !error && query.trim() && totalCount === 0 && (
              <div className="py-10 text-center">
                <p className="text-lg font-medium text-foreground">
                  검색 결과가 없습니다
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  다른 키워드로 다시 검색해 보세요.
                </p>
                {recommendedBooks.length > 0 && (
                  <div className="mt-6">
                    <p className="text-sm font-medium text-foreground mb-3">
                      추천 도서
                    </p>
                    <div className="grid gap-3">
                      {recommendedBooks.map((item) => (
                        <Link
                          key={item.id}
                          to={item.href}
                          onClick={onClose}
                          className="flex items-center gap-3 rounded-xl border border-border p-3 hover:bg-muted/50 transition-colors"
                        >
                          <div className="w-10 h-14 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                            {item.image ? (
                              <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                            ) : null}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                              {item.title}
                            </p>
                            {item.meta && (
                              <p className="text-xs text-muted-foreground truncate">
                                {item.meta}
                              </p>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {!isLoading && !error && query.trim() && totalCount > 0 && (
              <div className="space-y-8 pt-6">
                {GROUPS.map((group) => {
                  const items = grouped[group.key] ?? [];
                  if (query.trim() && items.length === 0) return null;
                  const isExpanded = expandedGroups[group.key];
                  const visibleItems = query.trim()
                    ? isExpanded
                      ? items
                      : items.slice(0, 5)
                    : items.slice(0, 5);

                  return (
                    <section key={group.key}>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-heading text-lg font-semibold text-foreground">
                          {group.label}
                        </h3>
                        {query.trim() && items.length > 5 && !isExpanded && (
                          <button
                            type="button"
                            className="text-sm text-primary hover:underline"
                            onClick={() =>
                              setExpandedGroups((prev) => ({
                                ...prev,
                                [group.key]: true,
                              }))
                            }
                          >
                            더 보기
                          </button>
                        )}
                      </div>
                      <div className="grid gap-3">
                        {visibleItems.map((item) => (
                          <Link
                            key={item.id}
                            to={item.href}
                            onClick={onClose}
                            className="flex gap-4 rounded-2xl border border-border p-4 hover:bg-muted/50 transition-colors"
                          >
                            <div className="w-14 h-20 rounded-xl bg-muted overflow-hidden flex-shrink-0">
                              {item.image ? (
                                <img
                                  src={item.image}
                                  alt={item.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-dawn-glow to-dawn-end/30" />
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-2">
                                <p className="font-medium text-foreground truncate">
                                  {item.title}
                                </p>
                                {item.date && (
                                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                                    {safeFormatDate(item.date)}
                                  </span>
                                )}
                              </div>
                              {item.meta && (
                                <p className="text-xs text-muted-foreground mt-1 truncate">
                                  {item.meta}
                                </p>
                              )}
                              {item.description && (
                                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
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
            )}
          </div>
        </div>
      </div>
    </>
  );
}
