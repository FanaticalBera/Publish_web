import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Layout from "@/components/layout/Layout";
import SEOHead from "@/components/seo/SEOHead";
import BookCard from "@/components/books/BookCard";
import PurchaseModal from "@/components/books/PurchaseModal";
import { CleanDocumentRenderer } from "@/components/content/CleanDocumentRenderer";
import { usePreloadedData } from "@/context/PreloadContext";
import { getNewsBySlug } from "@/utils/reader";
import { formatDate } from "@/lib/utils";
import { mapNewsTypeLabel, getFirstParagraphText, mapPurchaseLinks } from "@/utils/content-adapters";
import type { Book } from "@/types/content";

export default function NewsDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const preloaded = usePreloadedData();
  const [article, setArticle] = useState<any>(preloaded || null);
  const [loading, setLoading] = useState(!preloaded);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  useEffect(() => {
    if (preloaded || !slug) return;
    getNewsBySlug(slug)
      .then((data) => {
        setArticle(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setArticle(null);
        setLoading(false);
      });
  }, [preloaded, slug]);

  const categoryLabel = mapNewsTypeLabel(article?.type);
  const contentNode = article?.content ? (
    <CleanDocumentRenderer document={article.content} />
  ) : null;

  const relatedBooks = useMemo(() => {
    return (article?.resolvedRelatedBooks ?? []).map((book: any) => {
      return {
        slug: book.slug,
        title: book.title || book.slug,
        subtitle: book.originalTitle || "",
        logline: getFirstParagraphText(book.description),
        cover: book.coverImage || "",
        description: getFirstParagraphText(book.description),
        publishDate: book.publishDate || "",
        purchaseLinks: mapPurchaseLinks(book.buyLinks),
        authors: book.authors || [],
      } as Book;
    });
  }, [article]);

  if (loading) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <p>Loading...</p>
        </div>
      </Layout>
    );
  }

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
        description={article.excerpt || article.title}
        ogImage={article.coverImage || undefined}
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
          {categoryLabel && (
            <span className="inline-block px-3 py-1.5 text-sm font-medium bg-secondary text-secondary-foreground rounded-full mb-4">
              {categoryLabel}
            </span>
          )}
          <h1 className="font-heading text-2xl md:text-3xl lg:text-4xl font-semibold text-foreground leading-tight">
            {article.title}
          </h1>
          <time className="block mt-4 text-muted-foreground">
            {formatDate(article.publishedAt || article.publishDate)}
          </time>
        </header>

        {/* Thumbnail */}
        {article.coverImage && (
          <div className="max-w-[720px] mx-auto mb-8 md:mb-12">
            <div className="aspect-[16/9] rounded-xl overflow-hidden">
              <img
                src={article.coverImage}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Article Content - Magazine Style */}
        <div className="prose-magazine">
          {contentNode}
        </div>

        {/* Related Books */}
        {relatedBooks.length > 0 && (
          <div className="max-w-[720px] mx-auto mt-12 pt-8 border-t border-border">
            <h2 className="font-heading text-xl font-semibold mb-6">
              관련 도서
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {relatedBooks.map((book: Book) => (
                <BookCard
                  key={book.slug}
                  book={book}
                  onPurchaseClick={() => setSelectedBook(book)}
                />
              ))}
            </div>
          </div>
        )}

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

      {/* Purchase Modal */}
      {selectedBook && (
        <PurchaseModal
          isOpen={!!selectedBook}
          onClose={() => setSelectedBook(null)}
          bookTitle={selectedBook.title}
          purchaseLinks={selectedBook.purchaseLinks}
        />
      )}
    </Layout>
  );
}
