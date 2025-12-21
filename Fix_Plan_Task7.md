# Task 7 이슈 수정 계획 (Correction Plan)

본 문서는 Task 7(SSG & Optimization) 진행 후 발생한 **홈페이지 화이트 스크린 및 콘텐츠 로딩 오류**를 해결하기 위한 상세 계획입니다.

**진단 결과 요약**: `src/utils/reader.ts`에서 Node.js 전용 모듈(`@keystatic/core/reader`)을 정적으로 import하여, 브라우저 환경에서 실행 시 런타임 에러(Crash)가 발생함.

---

## Phase 1: 런타임 에러 긴급 수정 (Runtime Error Hotfix)
> **목표**: 브라우저에서 사이트가 다시 렌더링되도록 런타임 충돌 원인을 제거한다.

- [ ] **1.1. Reader 유틸리티 동적 임포트 전환** (`src/utils/reader.ts`)
    - [ ] `import { createReader } ...` (Static Import) 제거
    - [ ] `getAllBooks`, `getHomepage` 등 함수 내부 또는 초기화 로직에서 `if (process) await import(...)` 패턴 적용
    - [ ] Node.js 환경이 아닐 때(브라우저)는 해당 코드가 번들에 포함되거나 실행되지 않도록 격리
- [ ] **1.2. 브라우저 로딩 정상화 확인**
    - [ ] 화이트 스크린 없이 홈 화면이 렌더링되는지 확인 (Mock 데이터 또는 DevReader 데이터)
    - [ ] 브라우저 콘솔에 `fs`, `path` 관련 에러가 사라졌는지 확인

---

## Phase 2: 데이터 로딩 안정화 (Data Loading Stabilization)
> **목표**: 개발 환경(Mock/DevReader)과 배포 환경(SSG Reader) 모두에서 데이터가 안전하게 로드되도록 한다.

- [ ] **2.1. 개발 모드 Reader(DevReader) 점검**
    - [ ] `createDevReader` 함수가 Vite의 `import.meta.glob`을 통해 `.mdoc` 파일을 정상적으로 파싱하는지 검증
    - [ ] `parseMdoc` 함수가 Frontmatter가 없는 경우 등 예외 상황을 잘 처리하는지 확인
- [ ] **2.2. UI 컴포넌트 방어 코드 추가** (`src/components/**`)
    - [ ] `Home.tsx`: `hero` 데이터가 `null`일 경우 기본 Placeholder 또는 로딩 상태 표시 강화
    - [ ] `Layout.tsx`: `GlobalAnnouncement` 데이터 로딩 실패 시 UI 전체가 깨지지 않도록 처리

---

## Phase 3: 검증 및 빌드 테스트 (Verification)
> **목표**: 수정 사항이 Keystatic CMS 기능과 최종 SSG 빌드에 악영향을 주지 않는지 검증한다.

- [ ] **3.1. Keystatic 콘텐츠 생성 및 반영 테스트**
    - [ ] `/keystatic` 접속 및 관리자 로드 확인
    - [ ] 새로운 News 아이템 생성 (`Create`)
    - [ ] 홈 화면(`/`)으로 돌아와 새로고침 시, 화이트 스크린 없이 새 글이 "최신 소식"에 반영되는지 확인
- [ ] **3.2. SSG 빌드 정합성 테스트** (`npm run build`)
    - [ ] `npm run prerender` (또는 build) 실행 시, 동적 임포트된 Reader가 Node 실행 시점에는 정상 작동하여 HTML을 생성하는지 확인
    - [ ] `dist/` 폴더 내 결과물 확인

---
**비고**: 작업은 위 순서대로 진행하며, 각 Task 완료 시마다 커밋을 권장합니다.
