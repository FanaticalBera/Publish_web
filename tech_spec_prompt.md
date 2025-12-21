# Tech Spec Generation Prompt

You are an expert Technical Architect and Engineering Lead. Your task is to write a detailed **Technical Specification Document (Tech Spec)** for a publisher website based on the provided PRD.

**Context:**
- **Project**: Single-person publisher website (Book listing, Author intro, News).
- **Stack**: Vite + React (TypeScript).
- **CMS**: **Keystatic** (Git-based, Code-First, Local Mode).
- **Deployment**: SSG (Static Site Generation) on Netlify/Vercel.
- **Styling**: Vanilla CSS (Modern CSS3) or CSS Modules. (Do NOT use Tailwind unless necessary, prioritize Vanilla CSS/Variables for comprehensive design control).

**Input Data:**
- Please refer to the attached `publisher_site_PRD_v1_1.md` for all functional and data requirements.

**Output Requirement:**
Generate a single markdown file named `publisher_site_TechSpec.md`.
**DO NOT generate the actual code implementations.** Focus on architecture, data structures, and strategies.

**The Tech Spec MUST include the following sections:**

## 1. Executive Summary
- Brief technical overview of the architecture (Vite + React + Keystatic).

## 2. Architecture & Design
- **System Diagram**: Mermaid diagram showing the flow (Admin(Local/Git) -> GitHub -> CI/CD Build -> CDN).
- **Directory Structure**: precise file tree layout.
    - `src/content/...` (Keystatic content files)
    - `keystatic.config.ts` location
    - `src/components`, `src/pages`, `src/styles`
- **Routing Strategy**: How `react-router-dom` handles dynamic slugs (`/books/:slug`, `/authors/:slug`) with Static Generation.

## 3. Data Modeling (Keystatic Schema)
- Define the exact schema structure for:
    - **Collections**: `books`, `authors`, `news`
    - **Singletons**: `homepage`, `about`, `contact`
- Detail fields including the "Publisher Specifics" mentioned in PRD (Translator, Series, Original Title, Preview Link).
- Detail relationships (e.g., How to link an Author to a Book).

## 4. Component Architecture
- List of key Reusable Components (e.g., `BookCard`, `AuthorCard`, `Pagination`, `Layout`).
- **Page Components**: Breakdown of props and data fetching requirements for each page.

## 5. Styling Strategy
- **Design Tokens**: Define CSS Variables (`:root`) for colors, typography, spacing (e.g., `--color-primary`, `--font-main`).
- **Global Styles**: Reset and base typography.
- **Responsive Strategy**: Breakpoints (Mobile First).

## 6. Build & Deployment Pipeline
- **Local Development**: Commands to run Vite + Keystatic admin.
- **Production Build**: How SSG is triggered.
- **CI/CD**: Steps for automated deployment on push to `main`.

## 7. Performance & SEO Strategy
- **Image Optimization**: Handling images uploaded via Keystatic.
- **SEO**: Meta tags, Open Graph implementation strategy (using `react-helmet-async` or similar).

---
**Goal:** This document will be given to a Junior Developer to implement the site. It must be specific enough that they don't need to ask clarifying questions about "Where does this file go?" or "What fields are in the Author schema?".
