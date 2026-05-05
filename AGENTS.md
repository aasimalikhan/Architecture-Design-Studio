# AGENTS.md — NCD International portfolio

Read this file before editing. It locks decisions so agentic tools (Cursor, Claude, Devin, Copilot Workspaces) stay on rails.

## Stack (locked)

- Build: **Vite 5 + TypeScript (strict)** — no Next.js, no React, no SSR.
- Renderer: **Three.js (raw)** — no React Three Fiber.
- Animation core: **GSAP 3** (free since 2024) — uses `ScrollTrigger`, `Flip`, `SplitText`.
- Smooth scroll: **Lenis** (`lenis` package, formerly `@studio-freight/lenis`).
- Data: **flat-file `public/data/projects.json`** — no backend, no DB.
- Routing: custom `pushState` SPA router in `src/router.ts`.

## Directory contract (do not invent paths)

```
public/
  data/projects.json          ← source of truth for portfolio
  assets/                     ← fonts, projects, team, references, about, ui
  assets/projects-webp/       ← generated WebP derivatives (960w / 1920w); not hand-edited
src/
  main.ts router.ts store.ts
  types/project.ts            ← shape lives here, update before editing JSON
  data/loader.ts
  views/{home,about,projects,projectDetail,references,team,contact}.ts
  webgl/{renderer,plane,globeHero}.ts + shaders/*.glsl
  physics/popupQueue.ts
  motion/{splitReveal,flipDeepDive,scroll}.ts
  ui/{cursor,nav,loader,popupCard}.ts
  styles/{index,tokens,reset,base,layout}.css + pages/*.css
scripts/
  build-projects-json.mjs     ← scans assets/ and emits projects.json (+ heroVariants when webp exist)
  optimize-project-images.mjs ← Sharp: writes projects-webp/ + earth-hero-1024.webp (devDependency only)
  ai-pipeline/                ← offline render-processing scripts
docs/                         ← authoring source (markdown)
```

## Type contract

Defined in [`src/types/project.ts`](src/types/project.ts). Update **before** changing `projects.json`. Never widen to `any`.

## Agent roles

- **Design Agent** — owns `src/styles/`, design tokens, type scale, motion language. Forbidden: introducing new colors outside tokens, new font sources, magic numbers in CSS.
- **Code Agent** — owns `src/` (non-styles). Implements WebGL shaders, physics, GSAP timelines. Forbidden: `any`, inline styles in TS, `<img>` for project renders (use Three.js plane), CDN font/script tags.
- **Content Agent** — owns `docs/` and `public/data/projects.json`. Updates copy, metrics, captions. Forbidden: editing TypeScript or shaders.

## Forbidden actions (any agent)

- No CDN-hosted fonts. Self-host woff2 in `public/assets/fonts/`.
- No `any`, no `@ts-ignore` without a one-line reason comment.
- No new dependencies without updating `package.json` and noting bundle impact.
- No editing `projects.json` schema without updating `src/types/project.ts` first.
- No new top-level routes; the five pillars (`/about /projects /references /team /contact`) plus `/projects/:slug` are final.
- No emojis in code, comments, or copy.

## Adding a new project

1. Drop folder under `public/assets/projects/<kebab-slug>/` with at least one image.
2. (Optional) Run `npm run pipeline` to upscale + layer.
3. Run `npm run images:optimize` to emit WebP under `public/assets/projects-webp/` (skipped by mtime unless `--force`).
4. Run `npm run data:projects` to regenerate `projects.json` (preserves your manual `summary`/`body`/`metrics` overrides if you've added an entry to `scripts/build-projects-json.mjs`'s overrides map). `npm run build` runs optimize + data via `prebuild`.
5. Verify with `npm run dev` and visit `/projects/<slug>`.

## Performance budget

| Metric | Budget |
|---|---|
| JS gzipped | < 220 KB |
| CSS initial | < 18 KB |
| LCP @ 4G | < 1.8 s |
| Hero webp | < 280 KB at 1920px |

## When in doubt

Read [`docs/details.md`](docs/details.md) and [`docs/deep_research_implementation.txt`](docs/deep_research_implementation.txt). Those are the strategic source documents.
