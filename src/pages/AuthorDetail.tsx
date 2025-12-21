import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import SEOHead from "@/components/seo/SEOHead";
import AuthorAvatar from "@/components/authors/AuthorAvatar";
import BookCard from "@/components/books/BookCard";
import PurchaseModal from "@/components/books/PurchaseModal";
import { CleanDocumentRenderer } from "@/components/content/CleanDocumentRenderer";
import { usePreloadedData } from "@/context/PreloadContext";
import { getAuthorWithBooks } from "@/utils/reader";
import { getFirstParagraphText, mapPurchaseLinks } from "@/utils/content-adapters";
import type { Book } from "@/types/content";

export default function AuthorDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const preloaded = usePreloadedData();
  const [author, setAuthor] = useState<any>(preloaded || null);
  const [loading, setLoading] = useState(!preloaded);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  useEffect(() => {
    if (preloaded || !slug) return;
    getAuthorWithBooks(slug)
      .then((data) => {
        setAuthor(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setAuthor(null);
        setLoading(false);
      });
  }, [preloaded, slug]);

  const authorShortBio = author?.shortBio || getFirstParagraphText(author?.bio);
  const authorBooks = useMemo(() => {
    return (author?.books ?? []).map((item: any) => {
      const entry = item.entry || {};
      return {
        slug: item.slug,
        title: entry.title || item.slug,
        subtitle: entry.originalTitle || "",
        logline: getFirstParagraphText(entry.description),
        cover: entry.coverImage || "",
        description: getFirstParagraphText(entry.description),
        publishDate: entry.publishDate || "",
        purchaseLinks: mapPurchaseLinks(entry.buyLinks),
        authors: entry.authors || [],
      } as Book;
    });
  }, [author]);

  if (loading) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <p>Loading...</p>
        </div>
      </Layout>
    );
  }

  if (!author) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <h1 className="font-heading text-2xl font-semibold">
            저자를 찾을 수 없습니다
          </h1>
          <Link to="/authors" className="text-primary hover:underline mt-4 inline-block">
            저자 목록으로 돌아가기
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEOHead
        title={author.name}
        description={authorShortBio || ""}
        ogImage={author.photo || undefined}
        ogType="profile"
      />

      <article className="container py-8 md:py-16">
        <div className="max-w-4xl mx-auto">
          {/* Author Header */}
          <header className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10 mb-12">
            <AuthorAvatar name={author.name} photo={author.photo} size="lg" />
            <div className="text-center md:text-left">
              <h1 className="font-heading text-3xl md:text-4xl font-semibold">
                {author.name}
              </h1>
              {authorShortBio && (
                <p className="text-muted-foreground mt-2">{authorShortBio}</p>
              )}
            </div>
          </header>

          {/* Bio */}
          <section className="mb-12">
            <h2 className="font-heading text-xl font-semibold mb-4">소개</h2>
            <div className="rich-text text-foreground/80">
              <CleanDocumentRenderer document={author.bio} />
            </div>
          </section>

          {/* Author's Books */}
          {authorBooks.length > 0 && (
            <section>
              <h2 className="font-heading text-xl font-semibold mb-6">
                {author.name}의 도서
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {authorBooks.map((book: Book) => (
                  <BookCard
                    key={book.slug}
                    book={book}
                    onPurchaseClick={() => setSelectedBook(book)}
                  />
                ))}
              </div>
            </section>
          )}
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
