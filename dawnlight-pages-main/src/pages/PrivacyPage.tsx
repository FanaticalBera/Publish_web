import Layout from "@/components/layout/Layout";
import SEOHead from "@/components/seo/SEOHead";

export default function PrivacyPage() {
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
            <section className="space-y-4">
              <h2 className="font-heading text-xl font-semibold text-foreground">
                1. 개인정보의 수집 및 이용 목적
              </h2>
              <p>
                도서출판 동틀녘(이하 "회사")은 다음의 목적을 위하여 개인정보를 처리합니다.
                처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며,
                이용 목적이 변경되는 경우에는 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>문의사항 접수 및 회신</li>
                <li>출간 문의 및 원고 검토</li>
                <li>뉴스레터 발송 (동의한 경우에 한함)</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="font-heading text-xl font-semibold text-foreground">
                2. 수집하는 개인정보의 항목
              </h2>
              <p>회사는 다음과 같은 개인정보 항목을 수집합니다.</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>필수항목: 이름, 이메일 주소</li>
                <li>선택항목: 연락처, 소속</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="font-heading text-xl font-semibold text-foreground">
                3. 개인정보의 보유 및 이용 기간
              </h2>
              <p>
                회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를
                수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>문의사항 처리: 처리 완료 후 1년</li>
                <li>출간 문의: 검토 완료 후 3년</li>
                <li>뉴스레터: 구독 해지 시까지</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="font-heading text-xl font-semibold text-foreground">
                4. 개인정보의 파기
              </h2>
              <p>
                회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게
                되었을 때에는 지체없이 해당 개인정보를 파기합니다.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="font-heading text-xl font-semibold text-foreground">
                5. 정보주체의 권리·의무
              </h2>
              <p>
                정보주체는 회사에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를
                행사할 수 있습니다.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>개인정보 열람 요구</li>
                <li>오류 등이 있을 경우 정정 요구</li>
                <li>삭제 요구</li>
                <li>처리정지 요구</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="font-heading text-xl font-semibold text-foreground">
                6. 문의처
              </h2>
              <p>
                개인정보 보호 관련 문의사항이 있으신 경우 아래 연락처로 문의해 주시기 바랍니다.
              </p>
              <p>
                이메일:{" "}
                <a href="mailto:hello@dongtulnyeok.com" className="text-primary hover:underline">
                  hello@dongtulnyeok.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
}
