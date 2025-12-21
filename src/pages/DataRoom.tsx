import { useEffect, useMemo, useState } from "react";
import Layout from "@/components/layout/Layout";
import SEOHead from "@/components/seo/SEOHead";
import { usePreloadedData } from "@/context/PreloadContext";
import { getAllDataRoom } from "@/utils/reader";
import type { DataRoomItem } from "@/types/content";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function DataRoom() {
    const preloaded = usePreloadedData() as { slug: string; entry: any }[] | null;
    const [items, setItems] = useState<{ slug: string; entry: any }[]>(
        preloaded ?? [],
    );
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        if (preloaded) return;
        getAllDataRoom()
            .then((data) => setItems(data))
            .catch((err) => {
                console.error(err);
                setItems([]);
            });
    }, [preloaded]);

    const dataItems = useMemo(() => {
        if (!Array.isArray(items)) return [];
        return items.map((item) => {
            const entry = item?.entry || {};
            return {
                slug: item.slug,
                title: entry.title || item.slug,
                description: "",
                file: entry.file || "",
                publishDate: entry.publishedAt || "",
            } as DataRoomItem;
        });
    }, [items]);

    return (
        <Layout>
            <SEOHead
                title="자료실"
                description="동틀녘의 보도자료, 카탈로그, 포스터 등 다양한 자료를 확인하고 다운로드할 수 있습니다."
            />

            <div className="container py-8 md:py-16">
                {/* Header */}
                <header className="mb-8 md:mb-12">
                    <h1 className="font-heading text-3xl md:text-4xl font-semibold text-foreground">
                        자료실
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        동틀녘의 다양한 자료를 만나보세요
                    </p>
                </header>

                {/* Data List */}
                <div className="flex flex-col border-t border-border">
                    {dataItems.slice((currentPage - 1) * 10, currentPage * 10).map((item) => (
                        <div
                            key={item.slug}
                            className="group flex flex-col md:flex-row md:items-center justify-between p-4 md:px-6 md:py-5 border-b border-border hover:bg-muted/30 transition-colors"
                        >
                            {/* Left: Title */}
                            <div className="flex-1 min-w-0 pr-4">
                                <Link
                                    to={`/dataroom/${item.slug}`}
                                    className="block font-medium text-foreground text-lg hover:text-primary transition-colors truncate"
                                    title={item.title}
                                >
                                    {item.title}
                                </Link>
                            </div>

                            {/* Right: Date */}
                            <div className="mt-2 md:mt-0 flex items-center justify-end md:min-w-[100px]">
                                <span className="text-sm text-muted-foreground whitespace-nowrap">
                                    {item.publishDate ? new Date(item.publishDate).toLocaleDateString() : ""}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {dataItems.length === 0 && (
                    <div className="py-20 text-center text-muted-foreground">
                        등록된 자료가 없습니다.
                    </div>
                )}

                {/* Pagination */}
                {dataItems.length > 10 && (
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
                            {Array.from({ length: Math.ceil(dataItems.length / 10) }, (_, i) => i + 1).map((page) => (
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
                            disabled={currentPage === Math.ceil(dataItems.length / 10)}
                            onClick={() => {
                                setCurrentPage(p => Math.min(Math.ceil(dataItems.length / 10), p + 1));
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                        >
                            다음
                        </Button>
                    </div>
                )}
            </div>
        </Layout>
    );
}
