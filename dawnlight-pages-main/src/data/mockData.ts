import { Book, Author, NewsArticle } from "@/types/content";
import bookCover1 from "@/assets/book-cover-1.jpg";
import bookCover2 from "@/assets/book-cover-2.jpg";
import bookCover3 from "@/assets/book-cover-3.jpg";
import bookCover4 from "@/assets/book-cover-4.jpg";

export const authors: Author[] = [
  {
    slug: "kim-seorin",
    name: "김서린",
    photo: "",
    bio: "서울에서 태어나 문학과 철학을 공부했습니다. 일상의 작은 순간들에서 깊은 의미를 발견하는 글을 씁니다. 첫 소설집 《새벽의 언어》로 문단의 주목을 받았으며, 현재 서울에서 글을 쓰고 있습니다.",
    shortBio: "일상의 작은 순간들에서 깊은 의미를 발견하는 작가",
  },
  {
    slug: "park-jiwon",
    name: "박지원",
    photo: "",
    bio: "어린이와 청소년을 위한 이야기를 씁니다. 아이들의 눈높이에서 세상을 바라보며, 따뜻하고 유쾌한 이야기로 독자들과 만나고 있습니다. 《꿈꾸는 정원》 시리즈로 많은 사랑을 받고 있습니다.",
    shortBio: "아이들의 눈높이에서 세상을 바라보는 동화작가",
  },
  {
    slug: "lee-haneul",
    name: "이하늘",
    photo: "",
    bio: "자연과 환경에 대한 깊은 관심을 가진 논픽션 작가입니다. 과학적 사실을 아름다운 문체로 풀어내는 것으로 알려져 있습니다. 《지구의 속삭임》으로 환경문학상을 수상했습니다.",
    shortBio: "자연과 환경에 대한 이야기를 전하는 논픽션 작가",
  },
];

export const books: Book[] = [
  {
    slug: "dawn-language",
    title: "새벽의 언어",
    subtitle: "어둠이 빛으로 변하는 순간의 기록",
    logline: "밤과 낮 사이, 가장 고요한 시간에 피어나는 내밀한 이야기",
    cover: bookCover1,
    description: `새벽은 가장 정직한 시간입니다. 어둠도 빛도 아닌 그 사이에서 우리는 진짜 자신을 마주합니다.

이 소설집은 새벽에만 들리는 언어로 쓰였습니다. 잠들지 못하는 밤, 불현듯 찾아오는 깨달음, 그리고 아침을 기다리는 마음까지.

열두 편의 이야기가 새벽빛처럼 은은하게 당신의 마음을 비춥니다.`,
    authorSlug: "kim-seorin",
    publishDate: "2024-03-15",
    isbn: "979-11-XXXXX-XX-X",
    pages: 248,
    price: "16,000원",
    tableOfContents: [
      "프롤로그: 새벽 4시의 고백",
      "1. 잠들지 못하는 이유",
      "2. 별이 지는 시간",
      "3. 창문 너머의 세계",
      "4. 고요 속의 대화",
      "5. 첫 번째 빛",
      "에필로그: 아침이 오기 전에",
    ],
    purchaseLinks: [
      { name: "교보문고", url: "https://www.kyobobook.co.kr" },
      { name: "예스24", url: "https://www.yes24.com" },
      { name: "알라딘", url: "https://www.aladin.co.kr" },
    ],
  },
  {
    slug: "dreaming-garden",
    title: "꿈꾸는 정원",
    subtitle: "식물들의 비밀스러운 밤",
    logline: "밤마다 열리는 마법의 정원에서 펼쳐지는 따뜻한 모험",
    cover: bookCover2,
    description: `밤이 되면 정원의 식물들은 깨어납니다. 꽃들은 속삭이고, 나무들은 춤을 추며, 작은 씨앗은 꿈을 꿉니다.

열 살 소녀 하나는 우연히 이 비밀의 정원을 발견합니다. 그곳에서 만난 친구들과 함께 펼쳐지는 따뜻하고 유쾌한 모험!

아이들의 상상력을 키워주는 동화 시리즈의 첫 번째 이야기입니다.`,
    authorSlug: "park-jiwon",
    publishDate: "2024-01-20",
    isbn: "979-11-XXXXX-XX-X",
    pages: 156,
    price: "13,000원",
    tableOfContents: [
      "1장. 이상한 씨앗",
      "2장. 밤의 정원사",
      "3장. 말하는 해바라기",
      "4장. 숲속 대모험",
      "5장. 씨앗의 비밀",
      "6장. 새벽의 선물",
    ],
    purchaseLinks: [
      { name: "교보문고", url: "https://www.kyobobook.co.kr" },
      { name: "예스24", url: "https://www.yes24.com" },
    ],
  },
  {
    slug: "earth-whisper",
    title: "지구의 속삭임",
    subtitle: "자연이 들려주는 생명의 이야기",
    logline: "우리가 미처 듣지 못했던 지구의 목소리에 귀 기울이다",
    cover: bookCover3,
    description: `지구는 끊임없이 우리에게 말을 걸고 있습니다. 바람 소리로, 물결로, 새들의 노래로.

이 책은 과학자의 눈과 시인의 감성으로 자연을 관찰한 기록입니다. 작은 이끼부터 거대한 숲까지, 생명의 경이로움을 담았습니다.

지구와 함께 살아가는 법을 다시 생각하게 하는 에세이.`,
    authorSlug: "lee-haneul",
    publishDate: "2023-11-10",
    isbn: "979-11-XXXXX-XX-X",
    pages: 312,
    price: "18,000원",
    tableOfContents: [
      "들어가며: 귀 기울이기",
      "1부. 숲의 시간",
      "2부. 물의 기억",
      "3부. 바람의 여행",
      "4부. 흙의 지혜",
      "나가며: 함께 살아가기",
    ],
    purchaseLinks: [
      { name: "알라딘", url: "https://www.aladin.co.kr" },
    ],
  },
  {
    slug: "morning-star",
    title: "샛별을 따라",
    subtitle: "길 위의 청춘 이야기",
    logline: "스무 살, 길을 잃어도 괜찮은 이유",
    cover: bookCover4,
    description: `대학을 그만두고 무작정 떠난 여행. 그 끝에서 만난 것은 새로운 시작이었습니다.

스무 살 청년의 시선으로 담아낸 성장 에세이. 낯선 곳에서 만난 사람들, 예상치 못한 사건들, 그리고 자신에 대한 발견.

길을 잃어본 적 없다면 어떻게 자신만의 길을 찾을 수 있을까요?`,
    authorSlug: "kim-seorin",
    publishDate: "2023-08-25",
    isbn: "979-11-XXXXX-XX-X",
    pages: 224,
    price: "15,000원",
    tableOfContents: [
      "프롤로그: 떠나는 아침",
      "1. 첫 번째 역",
      "2. 낯선 도시에서",
      "3. 밤하늘 아래",
      "4. 돌아오지 않는 길",
      "에필로그: 다시, 시작",
    ],
    purchaseLinks: [],
  },
];

export const newsArticles: NewsArticle[] = [
  {
    slug: "new-release-dawn-language",
    title: "김서린 작가의 신작 《새벽의 언어》 출간",
    excerpt: "밤과 낮 사이, 가장 고요한 시간에 피어나는 내밀한 이야기를 담은 소설집이 출간되었습니다.",
    content: `동틀녘에서 김서린 작가의 새 소설집 《새벽의 언어》를 출간했습니다.

이번 소설집은 새벽이라는 특별한 시간대를 배경으로 한 열두 편의 단편을 담고 있습니다. 작가는 "새벽은 가장 솔직해질 수 있는 시간"이라며 작품에 담긴 의미를 전했습니다.

김서린 작가는 데뷔작부터 일상의 작은 순간들에서 깊은 의미를 찾아내는 섬세한 문체로 주목받아 왔습니다. 이번 작품에서도 그 특유의 서정적인 문체가 돋보입니다.

《새벽의 언어》는 전국 서점에서 만나볼 수 있습니다.`,
    thumbnail: "",
    publishDate: "2024-03-15",
    category: "신간 소식",
  },
  {
    slug: "spring-reading-event",
    title: "2024 봄맞이 독서 이벤트 안내",
    excerpt: "따스한 봄을 맞아 동틀녘 도서와 함께하는 특별한 독서 이벤트를 준비했습니다.",
    content: `봄의 시작과 함께 동틀녘에서 특별한 독서 이벤트를 준비했습니다.

**이벤트 기간**: 2024년 3월 20일 ~ 4월 30일

**참여 방법**:
1. 동틀녘 도서를 구매하세요
2. 책과 함께 찍은 사진을 SNS에 #동틀녘과함께 해시태그와 함께 업로드
3. 추첨을 통해 다양한 선물을 드립니다

**경품 안내**:
- 1등: 동틀녘 전 도서 세트 (3명)
- 2등: 스타벅스 커피 기프티콘 (10명)
- 3등: 북마크 세트 (50명)

많은 참여 부탁드립니다!`,
    thumbnail: "",
    publishDate: "2024-03-10",
    category: "이벤트",
  },
  {
    slug: "author-talk-april",
    title: "4월 저자와의 만남 일정 안내",
    excerpt: "《꿈꾸는 정원》 박지원 작가와 함께하는 특별한 시간을 마련했습니다.",
    content: `동틀녘에서 준비한 저자와의 만남에 여러분을 초대합니다.

**일시**: 2024년 4월 13일 토요일 오후 3시
**장소**: 서울 마포구 독립서점 '책과 새벽'
**참가비**: 무료 (사전 신청 필수)

《꿈꾸는 정원》으로 많은 어린이 독자들의 사랑을 받고 있는 박지원 작가님이 직접 찾아옵니다. 작가님과 함께 책 속 이야기를 나누고, 사인회도 진행될 예정입니다.

어린이 독자 여러분의 많은 참여를 기다립니다.

**신청 방법**: 이메일(hello@dongtulnyeok.com)로 이름, 연락처, 참가 인원을 보내주세요.`,
    thumbnail: "",
    publishDate: "2024-03-05",
    category: "이벤트",
  },
];

export function getBookBySlug(slug: string): Book | undefined {
  return books.find((book) => book.slug === slug);
}

export function getAuthorBySlug(slug: string): Author | undefined {
  return authors.find((author) => author.slug === slug);
}

export function getNewsArticleBySlug(slug: string): NewsArticle | undefined {
  return newsArticles.find((article) => article.slug === slug);
}

export function getBooksByAuthor(authorSlug: string): Book[] {
  return books.filter((book) => book.authorSlug === authorSlug);
}
