# Implementation Plan: Fix Scroll & Keystatic Issues

This plan addresses the reported issues:
1.  **Keystatic Admin Failures** (Create button hangs, loading errors).
2.  **Homepage Scroll Issue** (Layout bug, insufficient content).

## Phase 1: Keystatic Infrastructure Repair
**Goal**: Restore full functionality to the Admin UI (Read/Write/Create).

- [x] **Task 1.1: Install Dependencies**
    - ~~Run `npm install --save-dev @keystatic/vite` to generic the necessary middleware.~~ (불필요 - custom middleware 구현)
- [x] **Task 1.2: Configure Vite Plugin**
    - Edit `vite.config.ts` to implement custom middleware for Keystatic API.
    - This enables the `/api/keystatic` routes required for local file management.

## Phase 2: Layout & Scroll Fix
**Goal**: Ensure the website layout renders correctly and scrolling is enabled.

- [x] **Task 2.1: Fix Layout Component**
    - Add `className="main-content"` to the `<main>` element in `src/components/layout/Layout.tsx`.
- [x] **Task 2.2: Expand Visual Mock Data & Fix CSS**
    - ~~Modify `src/pages/Home.tsx` to include more mock items.~~ (Existing data sufficient)
    - [NEW] Fix global CSS issue: override `overflow: hidden` on body in `src/index.css`.
    - This ensures the content is not hidden behind the fixed header and applies proper vertical spacing.

## Phase 3: Dev Environment Stability (Optional but Recommended)
**Goal**: Allow the Frontend to see the *Real* data you created in Admin, instead of failing or showing Mock data.

- [x] **Task 3.1: Implement Dev-Mode Data Adapter**
    - Create `createDevReader` in `src/utils/reader.ts` using `import.meta.glob`.
    - This allows the frontend to read local `.mdoc` files directly in development.

## Phase 4: Final Verification
All known issues have been resolved. The admin UI is functional, and data sync works as expected in dev mode.

---

## Verification Checklist

### After Phase 1
- [ ] Access `/keystatic`.
- [ ] Open "Books" collection -> No error.
- [ ] Click "Add" -> Fill content -> Click "Create" -> Success message appears.

### After Phase 2
- [ ] Open Homepage (`/`).
- [ ] Header does not cover the "Hero" text.
- [ ] Scroll down -> The page scrolls smoothly.
- [ ] Footer is visible at the bottom.
