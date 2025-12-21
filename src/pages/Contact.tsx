import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import SEOHead from "@/components/seo/SEOHead";
import { Mail } from "lucide-react";
import { usePreloadedData } from "@/context/PreloadContext";
import { getContact } from "@/utils/reader";

export default function ContactPage() {
  const preloaded = usePreloadedData();
  const [data, setData] = useState<any>(preloaded || null);
  const [loading, setLoading] = useState(!preloaded);

  useEffect(() => {
    if (preloaded) return;
    getContact()
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
          <p>Contact data unavailable.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEOHead
        title="문의하기"
        description="도서출판 동틀녘에 문의하세요. 출간 문의, 제휴 제안, 기타 문의사항을 환영합니다."
      />

      <div className="container py-8 md:py-16">
        <div className="max-w-xl mx-auto">
          {/* Header */}
          <header className="text-center mb-8 md:mb-12">
            <h1 className="font-heading text-3xl md:text-4xl font-semibold text-foreground">
              문의하기
            </h1>
            <p className="text-muted-foreground mt-2">
              동틀녘에 궁금한 점이 있으시면 언제든 연락해 주세요
            </p>
          </header>

          {/* Contact Info */}
          <div className="space-y-8">
            <div className="p-6 md:p-8 rounded-xl bg-card border border-border shadow-card text-center">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <h2 className="font-heading text-xl font-semibold mb-2">
                이메일 문의
              </h2>
              <p className="text-muted-foreground mb-4">
                출간 문의, 제휴 제안, 기타 문의사항을 보내주세요.
              </p>
              <a
                href={`mailto:${data.email}`}
                className="text-lg font-medium text-primary hover:underline"
              >
                {data.email}
              </a>
            </div>

            <div className="p-6 md:p-8 rounded-xl bg-muted/50 border border-border">
              <h3 className="font-heading text-lg font-semibold mb-4">
                문의 시 참고사항
              </h3>
              <ul className="space-y-3 text-sm text-foreground/80">
                <li className="flex gap-3">
                  <span className="text-primary">•</span>
                  <span>출간 문의 시 원고 개요와 연락처를 함께 보내주세요.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary">•</span>
                  <span>업무일 기준 3-5일 내에 답변드립니다.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary">•</span>
                  <span>대량 구매 문의는 별도로 안내드립니다.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
