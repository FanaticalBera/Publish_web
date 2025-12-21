import Layout from "@/components/layout/Layout";
import SEOHead from "@/components/seo/SEOHead";
import AuthorCard from "@/components/authors/AuthorCard";
import { authors } from "@/data/mockData";

export default function AuthorsPage() {
  return (
    <Layout>
      <SEOHead
        title="저자"
        description="동틀녘의 작가들을 소개합니다. 새벽빛처럼 따뜻한 이야기를 들려주는 작가들을 만나보세요."
      />

      <div className="container py-8 md:py-16">
        {/* Header */}
        <header className="mb-8 md:mb-12">
          <h1 className="font-heading text-3xl md:text-4xl font-semibold text-foreground">
            저자
          </h1>
          <p className="text-muted-foreground mt-2">
            동틀녘과 함께하는 작가들을 소개합니다
          </p>
        </header>

        {/* Author Grid */}
        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
          {authors.map((author) => (
            <AuthorCard key={author.slug} author={author} />
          ))}
        </div>
      </div>
    </Layout>
  );
}
