import { useEffect, useMemo, useState } from "react";
import Layout from "@/components/layout/Layout";
import SEOHead from "@/components/seo/SEOHead";
import NewsCard from "@/components/news/NewsCard";
import { Button } from "@/components/ui/button";
import { usePreloadedData } from "@/context/PreloadContext";
import { getAllReferenceNotes } from "@/utils/reader";
import type { ReferenceNote, NewsArticle } from "@/types/content";

export default function ReferenceNotes() {
    const preloaded = usePreloadedData() as { slug: string; entry: any }[] | null;
    const [items, setItems] = useState<{ slug: string; entry: any }[]>(
        preloaded ?? [],
    );

    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [currentPage, setCurrentPage] = useState(1);

    const categories = [
        { value: "all", label: "전체" },
        { value: "guide", label: "독서 가이드" },
        { value: "research", label: "연구 자료" },
        { value: "education", label: "교육 자료" },
        { value: "other", label: "기타" },
    ];

    useEffect(() => {
        if (preloaded) return;
        getAllReferenceNotes()
            .then((data) => setItems(data))
            .catch((err) => {
                console.error(err);
                setItems([]);
            });
    }, [preloaded]);

    const articles = useMemo(() => {
        return items.map((item) => {
            const entry = item.entry || {};
            // Map ReferenceNote to NewsArticle structure for reusing NewsCard
            return {
                slug: item.slug,
                title: entry.title || item.slug,
                excerpt: entry.excerpt || "",
                content: "",
                thumbnail: entry.coverImage || "",
                publishDate: entry.publishedAt || "",
                // Map internal values to readable labels if needed, or use as is
                category: categories.find(c => c.value === entry.category)?.label || "기타",
                // Additional field for internal logic if needed
                _rawCategory: entry.category
            } as NewsArticle & { _rawCategory?: string };
        });
    }, [items]);

    const filteredArticles = useMemo(() => {
        if (selectedCategory === "all") return articles;
        // Compare with raw value or label depending on what matches
        // Here we compare with raw value 'guide', 'research' etc.
        return articles.filter((article) => article._rawCategory === selectedCategory);
    }, [articles, selectedCategory]);

    const ITEMS_PER_PAGE = 12;
    const paginatedArticles = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredArticles.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredArticles, currentPage]);

    const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE);

    // Reset to page 1 when category changes
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategory]);

    return (
        <Layout>
            <SEOHead
                title="참고노트"
                description="동틀녘 도서의 이해를 돕기 위한 다양한 참고 자료와 읽을거리를 제공합니다."
            />

            <div className="container py-8 md:py-16">
                {/* Header */}
                <header className="mb-8 md:mb-12 text-center md:text-left">
                    <h1 className="font-heading text-3xl md:text-4xl font-semibold text-foreground">
                        참고노트
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        책을 더 깊이 이해하는 데 도움이 되는 자료들입니다
                    </p>
                </header>

                {/* Category Filter */}
                <div className="flex flex-wrap gap-2 mb-8 md:mb-12">
                    {categories.map((category) => (
                        <button
                            key={category.value}
                            onClick={() => {
                                setSelectedCategory(category.value);
                            }}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === category.value
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground hover:bg-muted/80"
                                }`}
                        >
                            {category.label}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                {articles.length > 0 ? (
                    <>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {paginatedArticles.map((article) => (
                                // We are reusing NewsCard but we need to adjust the link path inside
                                // NewsCard usually links to /news/:slug. We might need to customize NewsCard 
                                // or wrap it. For now, let's see if NewsCard accepts base path prop.
                                // If not, we should probably duplicate NewsCard as NoteCard or make it flexible.
                                // Let's check NewsCard first.
                                <NewsCard
                                    key={article.slug}
                                    article={article}
                                    basePath="/reference-notes" // Assuming we will add this prop to NewsCard
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        {filteredArticles.length > ITEMS_PER_PAGE && (
                            <div className="mt-12 flex justify-center items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={currentPage === 1}
                                    onClick={() => {
                                        setCurrentPage(p => Math.max(1, p - 1));
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                >
                                    이전
                                </Button>
                                <div className="flex items-center gap-1 mx-2">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => {
                                                setCurrentPage(page);
                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                            }}
                                            className={`w-8 h-8 flex items-center justify-center rounded-md text-sm transition-colors ${currentPage === page
                                                ? "bg-primary text-primary-foreground font-medium"
                                                : "hover:bg-muted text-foreground"
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={currentPage === totalPages}
                                    onClick={() => {
                                        setCurrentPage(p => Math.min(totalPages, p + 1));
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                >
                                    다음
                                </Button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-20 bg-muted/30 rounded-xl">
                        <p className="text-muted-foreground">등록된 참고노트가 없습니다.</p>
                    </div>
                )}
            </div>
        </Layout>
    );
}
