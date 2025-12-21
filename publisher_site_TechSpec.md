# 출판사 홈페이지 기술 명세서 (Technical Specification)

- **작성일**: 2025-12-19
- **기반 문서**: `publisher_site_PRD_v1_1.md`
- **프로젝트**: 1인 출판사 웹사이트 구축

---

## 1. 개요 (Executive Summary)

본 프로젝트는 1인 출판사를 위한 정적 웹사이트를 구축하는 것을 목표로 한다. **Vite + React (TypeScript)** 를 기반으로 하여 빠른 성능과 개발 효율성을 확보하며, **Keystatic**을 도입하여 별도의 DB/API 서버 없이 **Git 기반의 CMS** 환경을 제공한다. 이를 통해 운영 비용을 0원으로 유지하고, 운영자가 로컬 또는 배포 환경에서 직관적인 UI로 콘텐츠를 관리할 수 있도록 한다.

**핵심 기술 스택:**
- **Frontend**: Vite, React, TypeScript
- **CMS**: Keystatic (Local/Git-based)
- **Styling**: Vanilla CSS (CSS Variables)
- **Routing**: React Router v6
- **Build/Deploy**: Static Site Generation (SSG), Netlify/Vercel Auto-deploy

---

## 2. 아키텍처 및 설계 (Architecture & Design)

### 2.1 시스템 다이어그램 (System Flow)

```mermaid
graph LR
    User[운영자/편집자] -- "1. 콘텐츠 작성 (Local/Web)" --> AdminUI[Keystatic Admin UI]
    AdminUI -- "2. Markdown 저장" --> GitRepo[(GitHub Repository)]
    GitRepo -- "3. Push Event" --> CICD[Netlify/Vercel Build]
    CICD -- "4. Build (Vite SSG)" --> StaticAssets[정적 파일 (HTML/CSS/JS)]
    StaticAssets -- "5. Deploy" --> CDN[Global CDN]
    Visitor[방문자] -- "6. 웹사이트 접속" --> CDN
```

### 2.2 디렉토리 구조 (Directory Structure)

Vite 프로젝트 루트에 `content/` 폴더를 두어 관리를 명확히 한다.

```
/
├── public/                 # 정적 리소스 (favicon, robots.txt, _redirects)
├── content/                # Keystatic Content (Root Level 권장)
│   ├── books/              # 도서별 폴더/파일 (.mdoc)
│   ├── authors/            
│   └── news/               
├── src/
│   ├── assets/             
│   ├── components/         
│   ├── pages/              
│   ├── styles/             
│   ├── utils/              
│   ├── App.tsx             
│   └── main.tsx            
├── keystatic.config.ts     
├── vite.config.ts          
└── package.json
```

### 2.3 라우팅 및 렌더링 전략 (Routing & Rendering)

**핵심 전략: SSG (Static Site Generation / Pre-rendering)**

카카오톡, 트위터 등의 SNS 공유 시 **OG 태그(Open Graph)**가 정상적으로 보이려면 크롤러가 읽을 수 있는 **실제 HTML 파일**이 필수적이다. 따라서 단순 SPA(Single Page Application)가 아닌, **빌드 시점에 모든 상세 페이지(`/:slug`)에 대한 HTML을 미리 생성**하는 방식을 채택한다.

- **표준**: Vite SSG 플러그인 (`vite-plugin-ssr` 혹은 `vite-ssg`) 사용
- **HTML 생성 대상**:
    - `/` (Home)
    - `/books`, `/books/:slug` (모든 도서 상세)
    - `/authors`, `/authors/:slug` (모든 저자 상세)
    - `/news`, `/news/:slug` (모든 소식 상세)
    - `/about`, `/contact`, `/404`

> **Note**: 이 방식을 통해 별도의 서버 사이드 렌더링(SSR) 서버 없이도 완벽한 SEO 및 OG 태그 지원이 가능하다.

---

## 3. 데이터 모델링 (Keystatic Schema)

PRD의 요구사항을 반영하여 `keystatic.config.ts`에 정의할 스키마 구조이다.

### 3.1 Collections (반복되는 콘텐츠)

#### **1. Books (`books`)**
- `title` (text): 도서명
- `slug` (slug): URL 식별자
- `coverImage` (image): 표지 이미지
- `authors` (relationship): `authors` 컬렉션 다중 참조 (필수)
- `translator` (text, optional): 역자
- `originalTitle` (text, optional): 원제
- `series` (object, optional):
    - `name` (text): 시리즈명
    - `volume` (text/number): 권호
- `publishDate` (date): 출간일
- `isbn` (text, optional): ISBN
- `description` (document): 책 소개 (Rich Text)
- `previewLink` (url, optional): 미리보기 링크
- `buyLinks` (array):
    - `storeName` (select): 교보, 예스24, 알라딘 등
    - `url` (url): 구매 링크

#### **2. Authors (`authors`)**
- `name` (text): 저자명
- `slug` (slug): URL 식별자
- `photo` (image, optional): 프로필 사진
- `bio` (document, optional): 저자 소개
- `links` (array, optional): 홈페이지, SNS 등

#### **3. News (`news`)**
- `title` (text): 제목
- `slug` (slug): URL 식별자
- `type` (select): 공지 / 신간 / 이벤트 / 칼럼
- `coverImage` (image, optional): 대표 이미지
- `publishedAt` (date): 발행일
- `content` (document): 본문
- `relatedBooks` (relationship, optional): 관련 도서 참조

### 3.2 Singletons (단일 페이지 관리)

#### **1. Global Settings (`settings`) - [NEW]**
- `siteName` (text): 사이트명 (예: 도서출판 동틀녘)
- `defaultSeo` (object): 기본 메타 제목, 설명, 대표 OG 이미지
- `favicon` (image)
- `analyticsId` (text, optional): GA4 ID 등

#### **2. Homepage (`homepage`)**
- `heroSection`: 메인 배너 설정 등 (옵션)
- `globalAnnouncement`: 팝업/배너 공지사항 (활성화 여부, 내용, 링크)

#### **3. About (`about`)**
- `mission` (document): 출판사 미션
- `history` (document): 연혁

#### **4. Contact (`contact`)**
- `email` (text): 대표 이메일
- `snsLinks` (array): SNS 링크 목록

#### **5. Legal Pages - [NEW]**
- `privacyPolicy` (document): 개인정보처리방침 (간단 버전)

---

## 4. 컴포넌트 아키텍처 (Component Architecture)

### 4.1 공통 컴포넌트 (`src/components/common`)
- **Header**: 로고, GNB(메뉴), 모바일 햄버거 메뉴
- **Footer**: 사업자 정보, 카피라이트, 소셜 링크
- **SEOHead**: `react-helmet-async`를 래핑하여 메타태그(Title, Description, OG) 관리
- **Button**: 공통 버튼 스타일 (Primary, Secondary, Ghost)

### 4.2 도서 관련 (`src/components/books`)
- **BookCard**: 목록 페이지용 카드 (표지+제목+저자)
- **BookMeta**: 상세 페이지용 메타 정보 테이블 (출간일, ISBN, 역자 등)
- **StoreLinks**: 구매처 버튼 리스트

### 4.3 기타 (`src/components/ui`)
- **Pagination**: 페이지네이션 UI
- **Tag**: 카테고리/소식 타입 표시 태그
- **Modal/Banner**: 공지사항 팝업용

---

## 5. 스타일링 전략 (Styling Strategy)

**Vanilla CSS + CSS Variables** 방식을 채택하여 라이브러리 의존성을 제거하고 커스터마이징을 용이하게 한다.

### 5.1 디자인 토큰 (`variables.css`)
```css
:root {
  /* Colors */
  --color-primary: #333333;   /* 메인 텍스트/브랜드 컬러 */
  --color-secondary: #0055AA; /* 링크/포인트 컬러 */
  --color-bg-body: #FFFFFF;
  --color-bg-light: #F7F7F7;
  
  /* Typography */
  --font-main: "Pretendard", sans-serif;
  --text-size-base: 16px;
  --text-size-h1: 2rem;
  
  /* Spacing */
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 32px;
  
  /* Layout */
  --container-width: 1200px;
}
```

### 5.2 반응형 전략 (Responsive)
- **Mobile First**: 기본 CSS를 모바일 기준으로 작성하고, `@media (min-width: 768px)` 등으로 데스크탑 스타일을 덮어쓴다.

---

## 6. 빌드 및 배포 파이프라인 (Build & Pipeline)

### 6.1 로컬 개발 (Local Development)
- `npm run dev`: Vite 개발 서버 + Keystatic 로컬 모드 실행
- Keystatic Admin 접근: `http://localhost:5173/keystatic`

### 6.2 프로덕션 빌드 (Production)
- **SSG Build**: `npm run build`
    - Vite 빌드 수행
    - **Pre-rendering**: 정의된 라우트(모든 글/책)를 순회하며 `index.html`을 복사해 각 경로의 `index.html`로 생성.
    - 결과: `/books/my-book/index.html` (여기에 OG 태그가 박혀있어야 함)

### 6.3 배포 설정 (Deployment Config) - [필수]
Netlify/Vercel 등에서 React Router의 새로고침 404 오류를 방지하고 SSG 파일을 올바르게 서빙하기 위한 설정.

- **Netlify**: `public/_redirects` 생성
  ```text
  /*  /index.html  200
  ```
- **Vercel**: `vercel.json` 생성
  ```json
  { "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
  ```

### 6.4 이미지 정책 (Image Policy)
- **규격**: 표지는 **3:4 비율** 권장 (예: 600x800px). 용량은 장당 300KB 이하.
- **파일명**: 영문/숫자/하이픈(-)만 사용 권장.

### 6.5 CMS 운영 정책 (Admin Policy)
- **1인 운영 원칙**: **"로컬 편집 Only"**
    1. 운영자는 로컬(`localhost`)에서 Keystatic으로 글 작성 및 수정.
    2. 확인 후 Git Commit & Push.
    3. CI/CD가 자동으로 빌드 및 배포.
    - *이유: 별도 인증 서버 구축 없이 가장 안전하고 비용 효율적임.*

---

## 7. 성능 및 SEO 전략 (Performance & SEO)

### 7.1 성능 최적화
- **이미지**: Keystatic 업로드 시 적절한 포맷 사용 권장. 렌더링 시 `lazy-loading` 속성 적극 활용.
- **번들링**: Vite의 기본 코드 분할(Code Splitting) 활용.

### 7.2 SEO (검색 최적화)
- **Meta Tags**: 모든 페이지마다 고유의 Title, Description 설정.
- **Open Graph**: 카카오톡, 슬랙 등 공유 시 노출될 `og:image`, `og:title` 설정 필수.
- **Sitemap**: 빌드 스크립트 등을 통해 `sitemap.xml` 생성.
- **robots.txt**: 모든 검색 엔진 허용 (`Allow: /`).

---
**문서 끝.**
