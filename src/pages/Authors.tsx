import { useEffect, useMemo, useState } from "react";
import Layout from "@/components/layout/Layout";
import SEOHead from "@/components/seo/SEOHead";
import AuthorCard from "@/components/authors/AuthorCard";
import { usePreloadedData } from "@/context/PreloadContext";
import { getAllAuthors } from "@/utils/reader";
import { getFirstParagraphText } from "@/utils/content-adapters";
import type { Author } from "@/types/content";

export default function AuthorsPage() {
  const preloaded = usePreloadedData() as { slug: string; entry: any }[] | null;
  const [items, setItems] = useState<{ slug: string; entry: any }[]>(
    preloaded ?? [],
  );

  useEffect(() => {
    if (preloaded) return;
    getAllAuthors()
      .then((data) => setItems(data))
      .catch((err) => {
        console.error(err);
        setItems([]);
      });
  }, [preloaded]);

  const authors = useMemo(() => {
    return items.map((item) => {
      const entry = item.entry || {};
      return {
        slug: item.slug,
        name: entry.name || item.slug,
        photo: entry.photo || "",
        bio: entry.bio || "",
        shortBio: getFirstParagraphText(entry.bio),
      } as Author;
    });
  }, [items]);

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
