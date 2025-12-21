import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import SEOHead from "@/components/seo/SEOHead";
import { CleanDocumentRenderer } from "@/components/content/CleanDocumentRenderer";
import { getDataRoomBySlug } from "@/utils/reader";
import { Button } from "@/components/ui/button";
import { Download, ArrowLeft, FileText } from "lucide-react";
import { usePreloadedData } from "@/context/PreloadContext";
import { formatDate } from "@/lib/utils";

export default function DataRoomDetail() {
    const { slug } = useParams();
    const preloaded = usePreloadedData() as { entry: any } | null;

    // If preloaded data exists and matches the current slug context (simplified check), use it
    const [data, setData] = useState<any>(preloaded?.entry || null);
    const [loading, setLoading] = useState(!preloaded);

    useEffect(() => {
        if (preloaded || !slug) return;

        setLoading(true);
        getDataRoomBySlug(slug)
            .then((res) => {
                setData(res);
            })
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }, [slug, preloaded]);

    const descriptionNode = data?.description ? (
        <CleanDocumentRenderer document={data.description} />
    ) : null;

    if (loading) {
        return (
            <Layout>
                <div className="min-h-screen container py-20 flex justify-center">
                    <div className="animate-pulse text-muted-foreground">Loading...</div>
                </div>
            </Layout>
        );
    }

    if (!data) {
        return (
            <Layout>
                <div className="min-h-screen container py-20 text-center">
                    <h2 className="text-2xl font-bold mb-4">자료를 찾을 수 없습니다</h2>
                    <Link to="/dataroom"><Button>목록으로 돌아가기</Button></Link>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <SEOHead
                title={data.title}
                description={data.title}
                ogImage={data.coverImage}
            />

            <article className="container py-8 md:py-16">
                {/* Back Link */}
                <Link
                    to="/dataroom"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
                >
                    <ArrowLeft className="h-4 w-4" />
                    자료실 목록
                </Link>

                <header className="max-w-[720px] mx-auto mb-8 md:mb-12 text-center">
                    <h1 className="font-heading text-2xl md:text-3xl lg:text-4xl font-semibold text-foreground leading-tight">
                        {data.title}
                    </h1>
                    <time className="block mt-4 text-muted-foreground">
                        {formatDate(data.publishedAt)}
                    </time>
                </header>

                {/* Thumbnail */}
                {data.coverImage && (
                    <div className="max-w-[720px] mx-auto mb-8 md:mb-12">
                        <div className="aspect-[16/9] rounded-xl overflow-hidden">
                            <img
                                src={data.coverImage}
                                alt={data.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                )}

                {/* Content - Magazine Style */}
                <div className="prose-magazine">
                    {descriptionNode}
                </div>

                {/* File Attachment */}
                {data.file && (
                    <div className="max-w-[720px] mx-auto mt-12 pt-8 border-t border-border">
                        <h3 className="font-heading text-xl font-semibold mb-4">첨부 파일</h3>
                        <div className="flex items-center gap-4 p-5 bg-muted/50 rounded-xl border border-border hover:bg-muted transition-colors">
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <FileText className="w-6 h-6 text-primary" />
                                </div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-foreground truncate">
                                    첨부 파일
                                </p>
                            </div>
                            <a href={data.file} download target="_blank" rel="noopener noreferrer">
                                <Button variant="outline" size="sm" className="gap-2">
                                    <Download className="w-4 h-4" />
                                    다운로드
                                </Button>
                            </a>
                        </div>
                    </div>
                )}

                {/* Back to List */}
                <div className="max-w-[720px] mx-auto mt-12 pt-8 border-t border-border">
                    <Link
                        to="/dataroom"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        자료실 목록으로 돌아가기
                    </Link>
                </div>
            </article>
        </Layout>
    );
}
