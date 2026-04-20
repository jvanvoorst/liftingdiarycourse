# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## IMPORTANT: Docs-First Rule

**Before generating any code, Claude Code MUST first read the relevant documentation file in the `/docs` directory.** Every feature, route, component, or concept in this project has a corresponding doc. Always locate and read the relevant `/docs` file before writing or modifying any code:

- /docs/ui.md
- /docs/data-fetching.md
- /docs/data-mutations.md
- /docs/auth.md
- /docs/server-components.md
- /docs/routing.md

## Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

No test runner is configured yet.

## Architecture

**Stack**: Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS v4

**Routing**: File-based via `src/app/`. All routes go under `src/app/`, with `layout.tsx` and `page.tsx` as entry points.

**Components**: Server Components by default. Add `"use client"` directive only when needed (event handlers, browser APIs, hooks).

**Path alias**: `@/*` maps to `src/*`.

**Styling**: Tailwind CSS v4 via PostCSS. Global CSS variables for light/dark theming are defined in `src/app/globals.css`. Dark mode uses `dark:` Tailwind variants.

**Fonts**: Geist and Geist Mono loaded via `next/font/google` in the root layout, injected as CSS variables (`--font-geist-sans`, `--font-geist-mono`).
