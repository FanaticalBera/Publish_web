import { useEffect, useMemo, useState } from "react";
import Layout from "@/components/layout/Layout";
import SEOHead from "@/components/seo/SEOHead";
import { usePreloadedData } from "@/context/PreloadContext";
import { getAllDataRoom } from "@/utils/reader";
import type { DataRoomItem } from "@/types/content";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default function DataRoom() {
    const preloaded = usePreloadedData() as { slug: string; entry: any }[] | null;
    const [items, setItems] = useState<{ slug: string; entry: any }[]>(
        preloaded ?? [],
    );

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
                coverImage: entry.coverImage || "",
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

                {/* Data Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {dataItems.map((item) => (
                        <div key={item.slug} className="group flex flex-col bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300">
                            {/* Clickable Area for Detail Page */}
                            <Link to={`/dataroom/${item.slug}`} className="flex-1 block">
                                <div className="aspect-[16/9] relative overflow-hidden">
                                    {item.coverImage ? (
                                        <img
                                            src={item.coverImage}
                                            alt={item.title}
                                            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex flex-col items-center justify-center p-6 text-center">
                                            <span className="font-heading text-lg font-semibold text-foreground/70">
                                                {item.title}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="p-6 flex flex-col gap-3">
                                    <div className="text-sm text-primary font-medium">
                                        {item.publishDate ? new Date(item.publishDate).toLocaleDateString() : ""}
                                    </div>
                                    <h3 className="font-heading text-xl font-semibold group-hover:text-primary transition-colors line-clamp-2">
                                        {item.title}
                                    </h3>
                                </div>
                            </Link>

                            {/* Footer with Download */}
                            <div className="px-6 pb-6 mt-auto">
                                {item.file ? (
                                    <a href={item.file} download target="_blank" rel="noopener noreferrer" className="w-full">
                                        <Button variant="outline" className="w-full gap-2">
                                            <Download className="w-4 h-4" />
                                            다운로드
                                        </Button>
                                    </a>
                                ) : (
                                    <Button variant="outline" disabled className="w-full gap-2 opacity-50 cursor-not-allowed">
                                        <Download className="w-4 h-4" />
                                        다운로드 불가
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {dataItems.length === 0 && (
                    <div className="py-20 text-center text-muted-foreground">
                        등록된 자료가 없습니다.
                    </div>
                )}
            </div>
        </Layout>
    );
}
