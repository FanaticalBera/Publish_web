import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Layout from "@/components/layout/Layout";
import SEOHead from "@/components/seo/SEOHead";
import { CleanDocumentRenderer } from "@/components/content/CleanDocumentRenderer";
import { usePreloadedData } from "@/context/PreloadContext";
import { getReferenceNoteBySlug } from "@/utils/reader";
import { formatDate } from "@/lib/utils";

export default function ReferenceNoteDetail() {
    const { slug } = useParams<{ slug: string }>();
    const preloaded = usePreloadedData();
    const [note, setNote] = useState<any>(preloaded || null);
    const [loading, setLoading] = useState(!preloaded);

    useEffect(() => {
        if (preloaded || !slug) return;
        getReferenceNoteBySlug(slug)
            .then((data) => {
                setNote(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setNote(null);
                setLoading(false);
            });
    }, [preloaded, slug]);

    const categoryLabels: Record<string, string> = {
        guide: "독서 가이드",
        research: "연구 자료",
        education: "교육 자료",
        other: "기타"
    };

    const categoryLabel = note?.category ? categoryLabels[note.category] : "참고노트";

    const contentNode = note?.content ? (
        <CleanDocumentRenderer document={note.content} />
    ) : null;

    if (loading) {
        return (
            <Layout>
                <div className="container py-16 text-center">
                    <p>Loading...</p>
                </div>
            </Layout>
        );
    }

    if (!note) {
        return (
            <Layout>
                <div className="container py-16 text-center">
                    <h1 className="font-heading text-2xl font-semibold">
                        참고노트를 찾을 수 없습니다
                    </h1>
                    <Link to="/reference-notes" className="text-primary hover:underline mt-4 inline-block">
                        참고노트 목록으로 돌아가기
                    </Link>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <SEOHead
                title={note.title}
                description={note.excerpt || note.title}
                ogImage={note.coverImage || undefined}
                ogType="article"
            />

            <article className="container py-8 md:py-16">
                {/* Back Link */}
                <Link
                    to="/reference-notes"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
                >
                    <ArrowLeft className="h-4 w-4" />
                    참고노트 목록
                </Link>

                {/* Article Header */}
                <header className="max-w-[720px] mx-auto mb-8 md:mb-12 text-center">
                    {categoryLabel && (
                        <span className="inline-block px-3 py-1.5 text-sm font-medium bg-secondary text-secondary-foreground rounded-full mb-4">
                            {categoryLabel}
                        </span>
                    )}
                    <h1 className="font-heading text-2xl md:text-3xl lg:text-4xl font-semibold text-foreground leading-tight">
                        {note.title}
                    </h1>
                    <time className="block mt-4 text-muted-foreground">
                        {formatDate(note.publishedAt || note.publishDate)}
                    </time>
                </header>

                {/* Thumbnail */}
                {note.coverImage && (
                    <div className="max-w-[720px] mx-auto mb-8 md:mb-12">
                        <div className="aspect-[16/9] rounded-xl overflow-hidden">
                            <img
                                src={note.coverImage}
                                alt={note.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                )}

                {/* Article Content - Magazine Style */}
                <div className="prose-magazine">
                    {contentNode}
                </div>

                {/* Back to List */}
                <div className="max-w-[720px] mx-auto mt-12 pt-8 border-t border-border">
                    <Link
                        to="/reference-notes"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        참고노트 목록으로 돌아가기
                    </Link>
                </div>
            </article>
        </Layout>
    );
}
