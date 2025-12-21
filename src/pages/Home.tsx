import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import SEOHead from "@/components/seo/SEOHead";
import BookCard from "@/components/books/BookCard";
import NewsCard from "@/components/news/NewsCard";
import PurchaseModal from "@/components/books/PurchaseModal";
import { usePreloadedData } from "@/context/PreloadContext";
import { getHomepage, getLatestBooks, getLatestNews } from "@/utils/reader";
import { getFirstParagraphText, mapNewsTypeLabel, mapPurchaseLinks } from "@/utils/content-adapters";
import type { Book, NewsArticle } from "@/types/content";

type HomePayload = {
  hero?: any;
  latestBooks?: { slug: string; entry: any }[];
  latestNews?: { slug: string; entry: any }[];
};

export default function Home() {
  const preloaded = usePreloadedData() as HomePayload | null;
  const [data, setData] = useState<HomePayload>(
    preloaded ?? { hero: null, latestBooks: [], latestNews: [] },
  );
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  useEffect(() => {
    if (preloaded) return;
    Promise.all([getHomepage(), getLatestBooks(4), getLatestNews(3)])
      .then(([homeData, books, news]) => {
        setData({
          hero: homeData?.heroSection || null,
          latestBooks: books,
          latestNews: news,
        });
      })
      .catch((err) => {
        console.error(err);
        setData({ hero: null, latestBooks: [], latestNews: [] });
      });
  }, [preloaded]);

  const featuredBooks = useMemo(() => {
    return (data.latestBooks ?? []).map((item) => {
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
  }, [data.latestBooks]);

  const latestNews = useMemo(() => {
    return (data.latestNews ?? []).map((item) => {
      const entry = item.entry || {};
      return {
        slug: item.slug,
        title: entry.title || item.slug,
        excerpt: entry.excerpt || "",
        content: "",
        thumbnail: entry.coverImage || "",
        publishDate: entry.publishedAt || "",
        category: mapNewsTypeLabel(entry.type),
      } as NewsArticle;
    });
  }, [data.latestNews]);

  const hero = data.hero || {};

  return (
    <Layout>
      <SEOHead
        title="동틀녘"
        description="아침을 여는 시작, 새로운 꿈을 꾸다. 도서출판 동틀녘은 어둠을 깨고 빛이 드러나는 시간처럼 새로운 이야기를 전합니다."
      />

      {/* Hero Section */}
      <section
        className="relative min-h-[70vh] md:min-h-[80vh] flex items-center gradient-dawn-subtle overflow-hidden"
        style={
          hero.image
            ? {
              backgroundImage: `url(${hero.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
            : undefined
        }
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/50" />

        <div className="container relative z-10 py-16 md:py-24">
          <div className="max-w-2xl mx-auto text-center space-y-6 animate-fade-up">
            <p className="text-sm md:text-base text-primary font-medium tracking-wide opacity-0 animate-fade-up animation-delay-100" style={{ animationFillMode: 'forwards' }}>
              도서출판 동틀녘
            </p>

            <h1
              className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground leading-tight text-balance opacity-0 animate-fade-up animation-delay-200"
              style={{ animationFillMode: 'forwards' }}
              dangerouslySetInnerHTML={{ __html: hero.headline || "" }}
            />

            <p className="text-lg md:text-xl text-muted-foreground opacity-0 animate-fade-up animation-delay-300" style={{ animationFillMode: 'forwards' }}>
              {hero.subheadline || ""}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 opacity-0 animate-fade-up animation-delay-300" style={{ animationFillMode: 'forwards', animationDelay: '400ms' }}>
              <Button variant="hero" size="lg" asChild>
                <Link to="/books">
                  도서 둘러보기
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/about">
                  동틀녘 소개
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Featured Books */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="flex items-end justify-between mb-8 md:mb-12">
            <div>
              <h2 className="font-heading text-2xl md:text-3xl font-semibold text-foreground">
                도서
              </h2>
              <p className="text-muted-foreground mt-2">
                동틀녘이 펴낸 책들
              </p>
            </div>
            <Link
              to="/books"
              className="text-sm font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
            >
              전체보기
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {featuredBooks.map((book) => (
              <BookCard
                key={book.slug}
                book={book}
                onPurchaseClick={() => setSelectedBook(book)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Latest News */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container">
          <div className="flex items-end justify-between mb-8 md:mb-12">
            <div>
              <h2 className="font-heading text-2xl md:text-3xl font-semibold text-foreground">
                소식
              </h2>
              <p className="text-muted-foreground mt-2">
                새로운 이야기와 이벤트
              </p>
            </div>
            <Link
              to="/news"
              className="text-sm font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
            >
              전체보기
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestNews.map((article) => (
              <NewsCard key={article.slug} article={article} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="max-w-xl mx-auto text-center space-y-6">
            <h2 className="font-heading text-2xl md:text-3xl font-semibold text-foreground">
              함께 만들어가는 이야기
            </h2>
            <p className="text-muted-foreground">
              동틀녘과 함께 새로운 시작을 준비하고 계신가요?
              출간 문의나 제안을 보내주세요.
            </p>
            <Button variant="default" size="lg" asChild>
              <Link to="/contact">문의하기</Link>
            </Button>
          </div>
        </div>
      </section>

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
