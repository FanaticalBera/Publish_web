# 출판사 홈페이지 개발 계획 (Implementation Plan)

본 문서는 `publisher_site_TechSpec.md`를 기반으로 작성된 상세 구현 계획입니다.
각 Task는 **커밋 1개 단위**로 작업 가능한 크기이며, 순차적으로 진행합니다.

---

## Phase 1: 프로젝트 초기화 및 환경 설정 (Project Setup)
> **목표**: Vite + React + Keystatic 환경을 구축하고 기본 스타일과 디렉토리 구조를 잡는다.

- [x] **1.1. React 프로젝트 스캐폴딩**
    - `npm create vite@latest . -- --template react-ts`
    - 불필요한 파일 정리 (`App.css`, `assets/react.svg` 등)
- [x] **1.2. 필수 라이브러리 설치**
    - **Routing**: `react-router-dom`
    - **CMS**: `@keystatic/core`, `@keystatic/react`
    - **SEO**: `react-helmet-async`
    - **Utils**: `date-fns` (날짜 처리용)
- [x] **1.3. 디렉토리 구조 생성**
    - `content/` (프로젝트 루트)
    - `src/components/{common,books,layout,ui}`
    - `src/styles`, `src/utils`, `src/pages`
- [x] **1.4. 전역 스타일 및 디자인 토큰 설정**
    - `src/styles/reset.css` (CSS Reset)
    - `src/styles/variables.css` (Color, Font, Spacing 변수 정의)
    - `src/styles/globals.css` (Base Typography)
    - `main.tsx`에 스타일 import
- [x] **1.5. 배포 설정 파일 추가**
    - `public/_redirects` (Netlify용 SPA Fallback: `/* /index.html 200`)
    - 또는 `vercel.json` (Vercel용)
    - `public/robots.txt` (Allow: /)

---

## Phase 2: CMS 스키마 및 콘텐츠 모델링 (CMS Schema)
> **목표**: Keystatic을 통해 관리할 데이터 구조(책, 저자, 소식, 설정)를 정의한다.

- [x] **2.1. Keystatic 설정 파일 생성**
    - `keystatic.config.ts` 생성
    - Storage 모드 설정 (Local Mode / GitHub Mode 분기)
- [x] **2.2. Global Settings & Singletons 정의**
    - **Settings**: `siteName`, `defaultSeo`, `favicon`
    - **Homepage**: `heroSection`, `globalAnnouncement`
    - **About/Contact**: `mission`, `history`, `email`, `snsLinks`
- [x] **2.3. Authors 컬렉션 정의**
    - Fields: `name`, `slug`, `photo`, `bio`, `links`
- [x] **2.4. Books 컬렉션 정의**
    - Fields: `title`, `slug`, `authors`(Relation), `translator`, `series`, `publishDate`, `coverImage`...
- [x] **2.5. News 컬렉션 정의**
    - Fields: `title`, `slug`, `type`, `content`, `relatedBooks`
- [x] **2.6. Admin UI 라우트 연결**
    - `src/pages/Admin.tsx` 생성 (KeystaticPage 컴포넌트)
    - App.tsx에 `/keystatic/*` 라우트 추가
    - 로컬 실행 확인 및 더미 데이터(책 1권, 저자 1명) 생성 테스트

---

## Phase 3: 공통 UI 컴포넌트 및 레이아웃 (Layout & UI)
> **목표**: 사이트의 기본 뼈대가 되는 레이아웃과 SEO 헤더를 구현한다.

- [x] **3.1. SEOHead 컴포넌트 구현**
    - `react-helmet-async` 활용
    - Props: `title`, `description`, `ogImage`
- [x] **3.2. Header 컴포넌트 구현**
    - 로고 (Link to /)
    - 네비게이션 메뉴 (Books, Authors, News, About)
    - 모바일 햄버거 메뉴 (반응형 대응)
- [x] **3.3. Footer 컴포넌트 구현**
    - 카피라이트, SNS 링크, 법적 고지 링크
- [x] **3.4. Layout 컴포넌트 구현**
    - `<Header />`, `<main>`, `<Footer />` 조합
    - `Outlet` 구조 적용
- [x] **3.5. 메인 라우팅 설정**
    - `App.tsx`에서 주요 페이지(Home, List, Detail) 라우트 뼈대 잡기 (임시 Placeholder 컴포넌트 연결)

---

## Phase 4: 도서 기능 구현 (Feature: Books)
> **목표**: 핵심 기능인 도서 목록과 상세 페이지를 구현한다.

- [x] **4.1. 데이터 헬퍼 함수 구현**
    - `src/utils/reader.ts`: Keystatic Reader API를 사용하여 데이터를 fetch하는 함수들 (`getAllBooks`, `getBookBySlug` 등)
- [x] **4.2. BookCard 컴포넌트 구현**
    - 표지 이미지, 제목, 저자 표시
    - Hover 효과
- [x] **4.3. BookList 페이지 구현 (`/books`)**
    - 전체 도서 데이터 로드
    - Grid 레이아웃 적용
    - (옵션) 단순 카테고리 필터링
- [x] **4.4. BookDetail 페이지 구현 (`/books/:slug`)**
    - 4.1의 헬퍼로 데이터 로드
    - 표지, 정보(역자, 원제 등), 구매 링크 목록(StoreLinks) UI
    - 본문(RichText) 렌더링
    - SEOHead 적용 (책 제목/표지 반영)

---

## Phase 5: 저자 및 소식 기능 구현 (Feature: Authors & News)
> **목표**: 서브 콘텐츠인 저자와 소식 페이지를 완성한다.

- [x] **5.1. AuthorList & Card 구현 (`/authors`)**
    - 저자 이름, 사진 카드 그리드
- [x] **5.2. AuthorDetail 구현 (`/authors/:slug`)**
    - 저자 프로필 및 소개
    - **[중요]** 해당 저자가 집필한 도서 목록 필터링하여 노출 (`related books`)
- [x] **5.3. NewsList 구현 (`/news`)**
    - 타입별(공지/신간) 배지 표시
    - 날짜순 정렬
- [x] **5.4. NewsDetail 구현 (`/news/:slug`)**
    - 본문 렌더링, 관련 도서 링크

---

## Phase 6: 단일 페이지 및 기능 마무리 (Singletons & Polish)
> **목표**: 홈, 소개, 문의 등 나머지 페이지를 채우고 사용자 경험을 다듬는다.

- [x] **6.1. Homepage 구현 (`/`)**
    - Hero 섹션 (신간/이벤트 배너)
    - "최신 도서" 섹션 (Slice 최신 N개)
    - "최신 소식" 섹션
- [x] **6.2. About & Contact 페이지 구현**
    - Singleton 데이터 연동
    - 문의 이메일/SNS 링크 UI
    - 개인정보처리방침 페이지 (`/privacy`)
- [x] **6.3. Global Announcement 구현**
    - `Layout`에 전역 공지 배너 추가
    - Settings 싱글톤 값에 따라 노출 여부 결정
- [x] **6.4. 404 Not Found 페이지 구현**
    - 존재하지 않는 경로 접속 시 안내 UI

---

## Phase 7: SSG 빌드 및 최적화 (SSG & Optimization)
> **목표**: 검색 엔진 최적화(SEO)를 위해 정적 HTML 생성 로직을 완성하고 배포한다.

- [x] **7.1. Pre-rendering 스크립트 작성**
    - [x] `vite-ssg` 도입 또는 커스텀 스크립트 작성 (커스텀 스크립트 적용)
    - [x] 모든 Slug(`books`, `authors`, `news`)를 조회하여 정적 경로 리스트 생성
- [x] **7.2. Sitemap 생성기 구현**
    - [x] 빌드 시 `sitemap.xml` 자동 생성 로직 추가
- [x] **7.3. 최종 빌드 테스트**
    - [x] `npm run build`
    - [x] `dist/books/my-book/index.html` 파일이 생성되었는지 확인 (OG 태그 포함 여부)
- [x] **7.4. 성능/접근성 점검 (Lighthouse)**
    - [x] 이미지 <code>alt</code> 태그 점검 (Helmet 적용, 구조적 준비 완료)
    - [x] 시멘틱 태그 점검 (Header, Main, Footer, Article 등 적용)

---
**문서 끝.**
