import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import SEOHead from "@/components/seo/SEOHead";
import BookCover from "@/components/books/BookCover";
import PurchaseModal from "@/components/books/PurchaseModal";
import AuthorAvatar from "@/components/authors/AuthorAvatar";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CleanDocumentRenderer } from "@/components/content/CleanDocumentRenderer";
import { usePreloadedData } from "@/context/PreloadContext";
import { getBookWithAuthors } from "@/utils/reader";
import { formatDate } from "@/lib/utils";
import { getFirstParagraphText, mapPurchaseLinks } from "@/utils/content-adapters";

export default function BookDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const preloaded = usePreloadedData();
  const [book, setBook] = useState<any>(preloaded || null);
  const [loading, setLoading] = useState(!preloaded);
  const [isPurchaseOpen, setIsPurchaseOpen] = useState(false);
  const resolvedAuthors = book?.resolvedAuthors || [];
  const primaryAuthor = resolvedAuthors[0];

  useEffect(() => {
    if (preloaded || !slug) return;
    getBookWithAuthors(slug)
      .then((data) => {
        setBook(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setBook(null);
        setLoading(false);
      });
  }, [preloaded, slug]);

  if (loading) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <p>Loading...</p>
        </div>
      </Layout>
    );
  }

  if (!book) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <h1 className="font-heading text-2xl font-semibold">
            도서를 찾을 수 없습니다
          </h1>
          <Link to="/books" className="text-primary hover:underline mt-4 inline-block">
            도서 목록으로 돌아가기
          </Link>
        </div>
      </Layout>
    );
  }

  const purchaseLinks = mapPurchaseLinks(book.buyLinks);
  const hasPurchaseLinks = purchaseLinks.length > 0;
  const logline = book.summary || getFirstParagraphText(book.description);
  const descriptionNode = <CleanDocumentRenderer document={book.description} />;
  const coverImage = book.coverImage || "";
  const subtitle = book.originalTitle || "";
  const authorName =
    primaryAuthor?.name ||
    (Array.isArray(book.authors) ? book.authors[0] : "");
  const authorSlug =
    primaryAuthor?.slug ||
    (Array.isArray(book.authors) ? book.authors[0] : "");
  const authorPhoto = primaryAuthor?.photo;
  const authorShortBio = primaryAuthor?.shortBio || "";

  return (
    <Layout>
      <SEOHead
        title={book.title}
        description={logline}
        ogImage={coverImage || undefined}
        ogType="book"
      />

      <article className="container py-8 md:py-16">
        <div className="max-w-4xl mx-auto">
          {/* Mobile Layout */}
          <div className="md:hidden space-y-6">
            {/* 1. Cover + Title */}
            <div className="flex flex-col items-center text-center">
              <div className="w-48 shadow-lifted rounded-xl overflow-hidden">
                <BookCover src={coverImage} alt={book.title} />
              </div>
              <h1 className="font-heading text-2xl font-semibold mt-6">
                {book.title}
              </h1>
              {subtitle && (
                <p className="text-muted-foreground mt-2">{subtitle}</p>
              )}
            </div>

            {/* 2. Logline */}
            <p className="text-lg text-center text-foreground/90 leading-relaxed">
              {logline}
            </p>

            {/* 3. Purchase Button */}
            <Button
              variant="purchase"
              size="lg"
              className="w-full"
              onClick={() => setIsPurchaseOpen(true)}
              disabled={!hasPurchaseLinks}
            >
              {hasPurchaseLinks ? "구매하기" : "구매처 준비중"}
            </Button>

            {/* 4. Description */}
            <div className="prose-magazine">
              <h2 className="font-heading text-xl font-semibold mb-4">책 소개</h2>
              <div className="rich-text text-foreground/80">
                {descriptionNode}
              </div>
            </div>

            {/* 5. Accordion: Info & TOC */}
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="info" className="border-border">
                <AccordionTrigger className="font-heading text-lg font-semibold">
                  서지정보
                </AccordionTrigger>
                <AccordionContent>
                  <dl className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">출간일</dt>
                      <dd>{book.publishDate ? formatDate(book.publishDate) : "-"}</dd>
                    </div>
                    {book.isbn && (
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">ISBN</dt>
                        <dd>{book.isbn}</dd>
                      </div>
                    )}
                    {book.pages && (
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">쪽수</dt>
                        <dd>{book.pages}쪽</dd>
                      </div>
                    )}
                    {book.price && (
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">정가</dt>
                        <dd>{book.price}</dd>
                      </div>
                    )}
                  </dl>
                </AccordionContent>
              </AccordionItem>

              {book.tableOfContents && book.tableOfContents.length > 0 && (
                <AccordionItem value="toc" className="border-border">
                  <AccordionTrigger className="font-heading text-lg font-semibold">
                    목차
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2 text-sm">
                      {book.tableOfContents.map((item: string, idx: number) => (
                        <li key={idx} className="text-foreground/80">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>

            {/* 6. Author Card */}
            {authorName && (
              <Link
                to={authorSlug ? `/authors/${authorSlug}` : "/authors"}
                className="block p-5 rounded-xl bg-muted/50 border border-border"
              >
                <div className="flex items-center gap-4">
                  <AuthorAvatar name={authorName} photo={authorPhoto} size="md" />
                  <div>
                    <p className="text-sm text-muted-foreground">저자</p>
                    <p className="font-heading font-semibold">{authorName}</p>
                  </div>
                </div>
              </Link>
            )}
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:grid md:grid-cols-[280px_1fr] lg:grid-cols-[320px_1fr] gap-10 lg:gap-16">
            {/* Left: Cover & Quick Info */}
            <div className="space-y-6">
              <div className="shadow-lifted rounded-xl overflow-hidden sticky top-24">
                <BookCover src={coverImage} alt={book.title} />
              </div>
            </div>

            {/* Right: Content */}
            <div className="space-y-8">
              {/* Title */}
              <div>
                <h1 className="font-heading text-3xl lg:text-4xl font-semibold">
                  {book.title}
                </h1>
                {subtitle && (
                  <p className="text-lg text-muted-foreground mt-2">
                    {subtitle}
                  </p>
                )}
              </div>

              {/* Logline */}
              <p className="text-xl text-foreground/90 leading-relaxed">
                {logline}
              </p>

              {/* Purchase Button */}
              <Button
                variant="purchase"
                size="lg"
                onClick={() => setIsPurchaseOpen(true)}
                disabled={!hasPurchaseLinks}
              >
                {hasPurchaseLinks ? "구매하기" : "구매처 준비중"}
              </Button>

              {/* Description */}
              <div className="pt-6 border-t border-border">
                <h2 className="font-heading text-xl font-semibold mb-4">책 소개</h2>
                <div className="rich-text text-foreground/80">
                  {descriptionNode}
                </div>
              </div>

              {/* Info & TOC Accordion */}
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="info" className="border-border">
                  <AccordionTrigger className="font-heading text-lg font-semibold">
                    서지정보
                  </AccordionTrigger>
                  <AccordionContent>
                    <dl className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <dt className="text-muted-foreground">출간일</dt>
                        <dd className="mt-1">
                          {book.publishDate ? formatDate(book.publishDate) : "-"}
                        </dd>
                      </div>
                      {book.isbn && (
                        <div>
                          <dt className="text-muted-foreground">ISBN</dt>
                          <dd className="mt-1">{book.isbn}</dd>
                        </div>
                      )}
                      {book.pages && (
                        <div>
                          <dt className="text-muted-foreground">쪽수</dt>
                          <dd className="mt-1">{book.pages}쪽</dd>
                        </div>
                      )}
                      {book.price && (
                        <div>
                          <dt className="text-muted-foreground">정가</dt>
                          <dd className="mt-1">{book.price}</dd>
                        </div>
                      )}
                    </dl>
                  </AccordionContent>
                </AccordionItem>

                {book.tableOfContents && book.tableOfContents.length > 0 && (
                  <AccordionItem value="toc" className="border-border">
                    <AccordionTrigger className="font-heading text-lg font-semibold">
                      목차
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-2 text-sm">
                        {book.tableOfContents.map((item: string, idx: number) => (
                          <li key={idx} className="text-foreground/80">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                )}
              </Accordion>

              {/* Author Card */}
              {authorName && (
                <Link
                  to={authorSlug ? `/authors/${authorSlug}` : "/authors"}
                  className="block p-6 rounded-xl bg-muted/50 border border-border hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-5">
                    <AuthorAvatar name={authorName} photo={authorPhoto} size="lg" />
                    <div>
                      <p className="text-sm text-muted-foreground">저자</p>
                      <p className="font-heading text-xl font-semibold mt-1">
                        {authorName}
                      </p>
                      {authorShortBio && (
                        <p className="text-muted-foreground mt-2">
                          {authorShortBio}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              )}
            </div>
          </div>
        </div>
      </article>

      {/* Purchase Modal */}
      <PurchaseModal
        isOpen={isPurchaseOpen}
        onClose={() => setIsPurchaseOpen(false)}
        bookTitle={book.title}
        purchaseLinks={purchaseLinks}
      />
    </Layout>
  );
}
