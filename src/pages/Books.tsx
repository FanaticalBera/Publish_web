import { useEffect, useMemo, useState } from "react";
import Layout from "@/components/layout/Layout";
import SEOHead from "@/components/seo/SEOHead";
import BookCard from "@/components/books/BookCard";
import PurchaseModal from "@/components/books/PurchaseModal";
import { usePreloadedData } from "@/context/PreloadContext";
import { getAllBooks } from "@/utils/reader";
import { getFirstParagraphText, mapPurchaseLinks } from "@/utils/content-adapters";
import type { Book } from "@/types/content";

type BooksPayload = { slug: string; entry: any }[];

export default function BooksPage() {
  const preloaded = usePreloadedData() as BooksPayload | null;
  const [items, setItems] = useState<BooksPayload>(preloaded ?? []);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  useEffect(() => {
    if (preloaded) return;
    getAllBooks()
      .then((data) => setItems(data))
      .catch((err) => {
        console.error(err);
        setItems([]);
      });
  }, [preloaded]);

  const books = useMemo(() => {
    return items.map((item) => {
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
  }, [items]);

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
