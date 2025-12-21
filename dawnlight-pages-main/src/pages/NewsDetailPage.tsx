import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Layout from "@/components/layout/Layout";
import SEOHead from "@/components/seo/SEOHead";
import { getNewsArticleBySlug } from "@/data/mockData";
import { formatDate } from "@/lib/utils";

export default function NewsDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const article = slug ? getNewsArticleBySlug(slug) : undefined;

  if (!article) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <h1 className="font-heading text-2xl font-semibold">
            소식을 찾을 수 없습니다
          </h1>
          <Link to="/news" className="text-primary hover:underline mt-4 inline-block">
            소식 목록으로 돌아가기
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEOHead
        title={article.title}
        description={article.excerpt}
        ogImage={article.thumbnail || undefined}
        ogType="article"
      />

      <article className="container py-8 md:py-16">
        {/* Back Link */}
        <Link
          to="/news"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          소식 목록
        </Link>

        {/* Article Header */}
        <header className="max-w-[720px] mx-auto mb-8 md:mb-12 text-center">
          {article.category && (
            <span className="inline-block px-3 py-1.5 text-sm font-medium bg-secondary text-secondary-foreground rounded-full mb-4">
              {article.category}
            </span>
          )}
          <h1 className="font-heading text-2xl md:text-3xl lg:text-4xl font-semibold text-foreground leading-tight">
            {article.title}
          </h1>
          <time className="block mt-4 text-muted-foreground">
            {formatDate(article.publishDate)}
          </time>
        </header>

        {/* Thumbnail */}
        {article.thumbnail && (
          <div className="max-w-[720px] mx-auto mb-8 md:mb-12">
            <div className="aspect-[16/9] rounded-xl overflow-hidden">
              <img
                src={article.thumbnail}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Article Content - Magazine Style */}
        <div className="prose-magazine">
          <div className="text-foreground/80 whitespace-pre-line">
            {article.content}
          </div>
        </div>

        {/* Back to List */}
        <div className="max-w-[720px] mx-auto mt-12 pt-8 border-t border-border">
          <Link
            to="/news"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            소식 목록으로 돌아가기
          </Link>
        </div>
      </article>
    </Layout>
  );
}
