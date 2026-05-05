# NCD International — portfolio

Static SPA portfolio for NCD International. Vite + TypeScript + Three.js +
Matter.js + GSAP + Lenis. No backend, no database — content lives in
`public/data/projects.json`, regenerated from `public/assets/projects/` by a
local script.

```
npm install
npm run dev          # http://localhost:5173
npm run build        # dist/
npm run preview      # preview the production build
npm run typecheck
npm run data:projects  # regenerate public/data/projects.json from /assets
```

## Structure (short)

- `public/assets/` — all images, served at `/assets/*`
- `public/assets/ui/earth-atmos-2048.jpg` — day map for the home hero globe (from three.js examples; **commit this file** or run `npm run fetch:earth` if it is missing). The app also paints a **procedural fallback** so the globe is never a blank sphere while the image loads or if the file 404s.
- `public/data/projects.json` — portfolio source of truth
- `src/views/*` — one file per route
- `src/webgl/` — Three.js (`globeHero`, `carousel`) + GLSL (`shaders/*.glsl`, reserved for transitions)
- `src/physics/` — Matter.js floating tags + ephemeral metric pop-ups
- `src/motion/` — Lenis smooth scroll, GSAP ScrollTrigger reveals
- `src/styles/` — design tokens + page styles
- `scripts/build-projects-json.mjs` — folder scanner with curated copy overrides
- `scripts/ai-pipeline/` — offline render-processing pipeline (provider stubs + ChatGPT prompt)

For the locked stack, directory contract, agent roles, and forbidden actions,
see [`AGENTS.md`](AGENTS.md). For strategy, see [`docs/details.md`](docs/details.md)
and [`docs/deep_research_implementation.txt`](docs/deep_research_implementation.txt).

## Adding a project

1. Drop a folder under `public/assets/projects/<your-folder>/` with images.
2. (Optional) Add a curated entry to the `OVERRIDES` map in
   [`scripts/build-projects-json.mjs`](scripts/build-projects-json.mjs).
3. Run `npm run data:projects`.
4. Open `/projects/<slug>` to confirm.

## AI render pipeline

Offline only — see [`scripts/ai-pipeline/README.md`](scripts/ai-pipeline/README.md)
for the master ChatGPT prompt and the recommended providers (Topaz, Magnific,
Krea, ArchiVinci, BiRefNet, RMBG-2.0, potrace).

## Performance budget

- JS gzipped: < 220 KB (current build: ~206 KB)
- CSS initial: < 18 KB (current: ~5 KB)
- Mobile fallbacks: physics off, particle hero count 28k → 6k, native scroll, no pop-ups during transitions.
