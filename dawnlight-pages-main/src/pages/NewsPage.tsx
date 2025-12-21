import Layout from "@/components/layout/Layout";
import SEOHead from "@/components/seo/SEOHead";
import NewsCard from "@/components/news/NewsCard";
import { newsArticles } from "@/data/mockData";

export default function NewsPage() {
  return (
    <Layout>
      <SEOHead
        title="소식"
        description="동틀녘의 새로운 소식과 이벤트를 확인하세요. 신간 안내, 저자와의 만남, 다양한 이벤트 소식을 전합니다."
      />

      <div className="container py-8 md:py-16">
        {/* Header */}
        <header className="mb-8 md:mb-12">
          <h1 className="font-heading text-3xl md:text-4xl font-semibold text-foreground">
            소식
          </h1>
          <p className="text-muted-foreground mt-2">
            동틀녘의 새로운 소식을 전합니다
          </p>
        </header>

        {/* News Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsArticles.map((article) => (
            <NewsCard key={article.slug} article={article} />
          ))}
        </div>
      </div>
    </Layout>
  );
}
