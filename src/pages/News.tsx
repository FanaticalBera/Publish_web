import { useEffect, useMemo, useState } from "react";
import Layout from "@/components/layout/Layout";
import SEOHead from "@/components/seo/SEOHead";
import NewsCard from "@/components/news/NewsCard";
import { usePreloadedData } from "@/context/PreloadContext";
import { getAllNews } from "@/utils/reader";
import { mapNewsTypeLabel } from "@/utils/content-adapters";
import type { NewsArticle } from "@/types/content";

export default function NewsPage() {
  const preloaded = usePreloadedData() as { slug: string; entry: any }[] | null;
  const [items, setItems] = useState<{ slug: string; entry: any }[]>(
    preloaded ?? [],
  );

  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = [
    { value: "all", label: "전체" },
    { value: "공지", label: "공지" },
    { value: "신간", label: "신간" },
    { value: "이벤트", label: "이벤트" },
    { value: "칼럼", label: "칼럼" },
  ];

  useEffect(() => {
    if (preloaded) return;
    getAllNews()
      .then((data) => setItems(data))
      .catch((err) => {
        console.error(err);
        setItems([]);
      });
  }, [preloaded]);

  const articles = useMemo(() => {
    return items.map((item) => {
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
  }, [items]);

  const filteredArticles = useMemo(() => {
    if (selectedCategory === "all") return articles;
    return articles.filter((article) => article.category === selectedCategory);
  }, [articles, selectedCategory]);

  return (
    <Layout>
      <SEOHead
        title="소식"
        description="동틀녘의 새로운 소식과 이벤트를 확인하세요. 신간 안내, 저자와의 만남, 다양한 이벤트 소식을 전합니다."
      />

      <div className="container py-8 md:py-16">
        {/* Header */}
        <header className="mb-8 md:mb-12 text-center md:text-left">
          <h1 className="font-heading text-3xl md:text-4xl font-semibold text-foreground">
            소식
          </h1>
          <p className="text-muted-foreground mt-2">
            동틀녘의 새로운 소식을 전합니다
          </p>
        </header>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8 md:mb-12">
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === category.value
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* News Grid */}
        {articles.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <NewsCard key={article.slug} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-muted/30 rounded-xl">
            <p className="text-muted-foreground">등록된 소식이 없습니다.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
