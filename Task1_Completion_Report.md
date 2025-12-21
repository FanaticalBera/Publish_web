# Task 1 수정 완료 보고서

## 문제 원인 (Root Cause)

제가 처음에 진단한 "Node.js 모듈의 static import" 문제는 **일부만 맞았습니다**. 실제로는 **두 가지 문제**가 복합적으로 발생했습니다:

### 1. Static Import 문제 (✅ 해결됨)
- **문제**: `import { createReader } from '@keystatic/core/reader'`가 브라우저 번들에 포함되어 잠재적 충돌 위험
- **해결**: Dynamic import (`await import(...)`)로 전환하여 Node.js 모듈이 브라우저에서 로드되지 않도록 수정

### 2. **Windows CRLF 줄바꿈 문제** (✅ 해결됨 - 진짜 원인)
- **문제**: `parseMdoc` 함수가 `---\n` (LF)로만 split하고 있었는데, Windows 파일은 `---\r\n` (CRLF)를 사용
- **결과**: Frontmatter가 파싱되지 않고 통째로 문자열로 반환됨
  ```javascript
  // Before fix:
  { content: "---\r\nheroSection:\n  headline: ..." }  // ❌ 파싱 실패
  
  // After fix:
  { heroSection: { headline: "...", subheadline: "..." } }  // ✅ 정상
  ```
- **해결**: `content.replace(/\r\n/g, '\n')`로 줄바꿈 정규화 추가

## 수정 내용

### `src/utils/reader.ts`
1. **Static import 제거** (Line 1)
   ```diff
   - import { createReader } from '@keystatic/core/reader';
   ```

2. **`getReader()` 함수 추가** (Dynamic Import)
   ```typescript
   async function getReader() {
       if (typeof process !== 'undefined' && process.cwd) {
           const { createReader } = await import('@keystatic/core/reader');
           return createReader(process.cwd(), keystaticConfig);
       } else {
           return createDevReader();
       }
   }
   ```

3. **`parseMdoc` 함수 수정** (CRLF 처리)
   ```typescript
   function parseMdoc(content: string, contentField: string = 'content') {
       const normalized = content.replace(/\r\n/g, '\n');  // ← 핵심 수정
       const parts = normalized.split('---\n');
       // ...
   }
   ```

## 검증 결과 (Browser Test)

### ✅ 홈페이지 콘텐츠 정상 표시
- **Hero Section**: "Task 3 Verification Headline" 표시됨
- **Subheadline**: "Real Data Works!" 표시됨
- **Announcement Bar**: 정상 작동

### ✅ 데이터 파싱 정상화
```javascript
// Console test:
getHomepage() => {
  heroSection: { headline: "...", subheadline: "...", image: "..." },  
  globalAnnouncement: { enabled: true, message: "..." }
}
```

### ✅ 콘솔 에러 없음
- JavaScript 런타임 에러 없음
- 데이터 fetch 정상

## 다음 단계

Task 1은 완료되었으나, 브라우저 테스트 중 다음 문제들이 추가로 발견되었습니다:

1. **About 페이지 크래시** (흰 화면)
2. **Books의 "Invalid Date"** (publishDate 필드 누락)
3. **News 데이터 없음** (content/news 디렉토리 비어있음)

→ Phase 2.2 (UI 방어 코드 추가)에서 처리 예정
