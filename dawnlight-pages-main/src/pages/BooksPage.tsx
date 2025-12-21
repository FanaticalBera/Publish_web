import { useState } from "react";
import Layout from "@/components/layout/Layout";
import SEOHead from "@/components/seo/SEOHead";
import BookCard from "@/components/books/BookCard";
import PurchaseModal from "@/components/books/PurchaseModal";
import { books } from "@/data/mockData";
import { Book } from "@/types/content";

export default function BooksPage() {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  return (
    <Layout>
      <SEOHead
        title="도서"
        description="동틀녘이 펴낸 모든 책들을 만나보세요. 소설, 에세이, 동화 등 다양한 장르의 도서를 소개합니다."
      />

      <div className="container py-8 md:py-16">
        {/* Header */}
        <header className="mb-8 md:mb-12">
          <h1 className="font-heading text-3xl md:text-4xl font-semibold text-foreground">
            도서
          </h1>
          <p className="text-muted-foreground mt-2">
            동틀녘이 펴낸 책들을 만나보세요
          </p>
        </header>

        {/* Book Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {books.map((book) => (
            <BookCard
              key={book.slug}
              book={book}
              onPurchaseClick={() => setSelectedBook(book)}
            />
          ))}
        </div>
      </div>

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
