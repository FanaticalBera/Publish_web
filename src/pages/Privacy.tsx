import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import SEOHead from "@/components/seo/SEOHead";
import { CleanDocumentRenderer } from "@/components/content/CleanDocumentRenderer";
import { usePreloadedData } from "@/context/PreloadContext";
import { getLegal } from "@/utils/reader";

export default function PrivacyPage() {
  const preloaded = usePreloadedData();
  const [data, setData] = useState<any>(preloaded || null);
  const [loading, setLoading] = useState(!preloaded);

  useEffect(() => {
    if (preloaded) return;
    getLegal()
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setData(null);
        setLoading(false);
      });
  }, [preloaded]);

  if (loading) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <p>Loading...</p>
        </div>
      </Layout>
    );
  }

  if (!data) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <p>Privacy policy unavailable.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEOHead
        title="개인정보처리방침"
        description="도서출판 동틀녘의 개인정보처리방침입니다."
      />

      <div className="container py-8 md:py-16">
        <div className="max-w-[720px] mx-auto">
          {/* Header */}
          <header className="mb-8 md:mb-12">
            <h1 className="font-heading text-3xl md:text-4xl font-semibold text-foreground">
              개인정보처리방침
            </h1>
            <p className="text-muted-foreground mt-2">
              최종 수정일: 2024년 1월 1일
            </p>
          </header>

          {/* Content */}
          <div className="prose-magazine text-foreground/80 space-y-8">
            <CleanDocumentRenderer document={data.privacyPolicy} />
          </div>
        </div>
      </div>
    </Layout>
  );
}
