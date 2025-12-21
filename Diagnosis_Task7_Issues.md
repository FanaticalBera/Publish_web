# Diagnosis of Homepage White Screen & Missing Content

## Root Cause Analysis

The primary issue is a **Runtime Error in the Browser** caused by importing a Node.js-only module in client-side code.

### 1. Invalid Import in `src/utils/reader.ts`
The file `src/utils/reader.ts` contains the following top-level import:
```typescript
import { createReader } from '@keystatic/core/reader';
```
*   **The Problem**: `@keystatic/core/reader` relies on Node.js native modules (like `fs`, `path`) to read files from the disk. Browsers do not have access to these file system modules.
*   **Why it breaks**: Even though the usage of `createReader` is wrapped in a conditional check (`if (typeof process ...)`), the **static import** at the top of the file forces the bundler (Vite) to include this module in the client bundle.
*   **Result**: When the browser tries to execute the code, it encounters references to Node.js built-ins (like `fs`), causing the script to crash.

### 2. "Deleted" Content & White Screen
*   **"Deleted" Content**: Because the `reader` fails to initialize properly in the browser (due to the crash or being undefined), functions like `getHomepage()` return `null`.
    *   In `Home.tsx`, if `data.hero` is null, the Hero section is simply not rendered. This looks like the content has been deleted/reset.
*   **White Screen**: When you create a News item, the application likely attempts to fetch the new data. The runtime error caused by the `createReader` import (or the fallback logic failing unexpectedly) propagates up, causing React to unmount the component tree or display a white screen (crash).

## Recommended Fix (Plan)

We need to ensure that Node.js-only code is **never** imported or executed in the browser.

1.  **Dynamic Import**: Modify `src/utils/reader.ts` to import `@keystatic/core/reader` dynamically, only when we are sure we are in a Node.js environment.
2.  **Separate Files (Alternative)**: Split the reader logic into `reader.client.ts` and `reader.server.ts` to strictly separate concerns, though dynamic import is often sufficient.

### Code Change Preview (Do not apply yet)
Instead of:
```typescript
import { createReader } from '@keystatic/core/reader'; // ❌ Crashes Browser
...
if (isNode) reader = createReader(...);
```

Use:
```typescript
// ✅ Safe
if (isNode) {
    const { createReader } = await import('@keystatic/core/reader');
    reader = createReader(...);
}
```
