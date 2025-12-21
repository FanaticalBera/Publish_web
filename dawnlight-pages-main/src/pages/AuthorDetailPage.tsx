import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import SEOHead from "@/components/seo/SEOHead";
import AuthorAvatar from "@/components/authors/AuthorAvatar";
import BookCard from "@/components/books/BookCard";
import PurchaseModal from "@/components/books/PurchaseModal";
import { getAuthorBySlug, getBooksByAuthor } from "@/data/mockData";
import { Book } from "@/types/content";

export default function AuthorDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const author = slug ? getAuthorBySlug(slug) : undefined;
  const authorBooks = slug ? getBooksByAuthor(slug) : [];

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
        description={author.shortBio || author.bio.slice(0, 160)}
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
              {author.shortBio && (
                <p className="text-muted-foreground mt-2">{author.shortBio}</p>
              )}
            </div>
          </header>

          {/* Bio */}
          <section className="mb-12">
            <h2 className="font-heading text-xl font-semibold mb-4">소개</h2>
            <div className="text-foreground/80 leading-[1.85] whitespace-pre-line">
              {author.bio}
            </div>
          </section>

          {/* Author's Books */}
          {authorBooks.length > 0 && (
            <section>
              <h2 className="font-heading text-xl font-semibold mb-6">
                {author.name}의 도서
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {authorBooks.map((book) => (
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
