import Layout from "@/components/layout/Layout";
import SEOHead from "@/components/seo/SEOHead";

export default function AboutPage() {
  return (
    <Layout>
      <SEOHead
        title="소개"
        description="동틀녘은 어둠을 깨고 빛이 드러나는 시간의 때입니다. 아침을 여는 시작, 새로운 꿈을 꾸는 출판사를 소개합니다."
      />

      {/* Hero */}
      <section className="gradient-dawn-subtle py-16 md:py-24">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground leading-tight">
              동틀녘은<br />
              어둠을 깨고 빛이 드러나는<br />
              시간의 때입니다.
            </h1>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="container py-16 md:py-24">
        <div className="max-w-[720px] mx-auto space-y-12">
          <div className="space-y-6">
            <h2 className="font-heading text-2xl font-semibold text-foreground">
              아침을 여는 시작
            </h2>
            <div className="text-foreground/80 leading-[1.85] space-y-6">
              <p>
                동틀녘은 밤과 낮이 만나는 경계, 가장 고요하면서도 가장 역동적인 순간입니다.
                어둠 속에서 첫 번째 빛이 스며들 때, 세상은 조용히 깨어나기 시작합니다.
              </p>
              <p>
                우리는 그 순간의 설렘을 담은 이야기를 만들고자 합니다.
                새로운 하루를 시작하는 독자들에게 영감이 되고, 위로가 되며,
                함께 성장할 수 있는 책을 펴냅니다.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="font-heading text-2xl font-semibold text-foreground">
              새로운 꿈을 꾸다
            </h2>
            <div className="text-foreground/80 leading-[1.85] space-y-6">
              <p>
                동틀녘은 작가들의 새로운 시작을 함께합니다.
                첫 작품을 세상에 내놓는 신인 작가부터, 새로운 도전을 준비하는 작가까지,
                모든 이야기가 빛을 받을 수 있도록 함께 걷습니다.
              </p>
              <p>
                소설, 에세이, 동화, 그림책 등 다양한 장르에서 독자의 마음을 움직이는
                책을 만들어갑니다. 우리가 만드는 책 한 권 한 권이 누군가에게는
                새로운 아침이 되기를 바랍니다.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="font-heading text-2xl font-semibold text-foreground">
              함께하는 여정
            </h2>
            <div className="text-foreground/80 leading-[1.85] space-y-6">
              <p>
                동틀녘은 책을 만드는 모든 과정을 소중히 여깁니다.
                원고를 다듬고, 디자인을 고민하고, 독자에게 전달되는 순간까지
                정성을 다합니다.
              </p>
              <p>
                작가, 독자, 그리고 책을 사랑하는 모든 분들과 함께
                따뜻한 이야기를 나누고 싶습니다.
                동틀녘의 여정에 함께해 주세요.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
