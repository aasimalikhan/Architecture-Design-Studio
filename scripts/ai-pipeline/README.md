# AI render-processing pipeline

Offline, build-time pipeline that decomposes a flat architectural render into
layered, optimised web assets. Run once per project and commit the outputs.
The website itself never calls these tools at runtime.

## Why offline?

- Static deploy target — no server-side image processing in production.
- Deterministic outputs that can be code-reviewed and version-controlled.
- The expensive AI APIs (Magnific, Topaz, Krea, ArchiVinci) are run by a human
  with credentials, not by the website.

## Pipeline stages

```
Raw render
   │
   ▼
[01] Upscale 2x–4x   ─→ AI texture / detail enhancement
   │
   ▼
[02] Semantic split  ─→ base.png / context.png / sky.png  (transparent layers)
   │
   ▼
[03] Outline         ─→ outline.svg  (cyan blueprint silhouette)
   │
   ▼
[04] Encode          ─→ webp + avif at 1280 / 1920 / 3840 widths
   │
   ▼
public/assets/projects/<slug>/...   (committed to git)
```

## Tool selection by stage

| Stage | Tool | When |
|---|---|---|
| 01 — Photoreal upscale | **Topaz Gigapixel AI** (desktop) | Renders that already look final and just need pixels |
| 01 — Texture-injected upscale | **Magnific AI** / **Krea.ai Enhance** | Conceptual renders that need realism |
| 01 — Architecture-tuned | **ArchiVinci** Generative 2x | Heavy material / lighting injection |
| 02 — Background remove | **BiRefNet** / **RMBG-2.0** (open source) | Single-subject buildings |
| 02 — Semantic split | **Segment Anything (SAM 2)** | Multi-object scenes |
| 03 — Vector outline | OpenCV Canny → **potrace** | Run locally, no API needed |
| 04 — Encode | **sharp** (Node) | All output goes through sharp |

## The drop-in ChatGPT prompt

Paste the prompt below into ChatGPT (image-capable) or any agentic tool that
accepts vision + multi-stage instructions. Pair it with one render at a time.

```text
Role: You are an AI Image Architect and Web-Asset Processor for an architecture
studio's portfolio website. You decompose a single architectural render into
optimized, layered web assets ready for a Three.js + GSAP front end.

Inputs: One architectural render (jpg/png). The studio is NCD International.
Aesthetic target: minimalist, futuristic, dark-mode-first, cyan accent (#00E5FF).

Required deterministic output (do NOT skip stages, do NOT improvise filenames):

STAGE 1 — UPSCALE
- Upscale to 4K on the longer edge (min 3840 px).
- Sharpen geometric lines (mullions, structural beams, cladding seams).
- Denoise sky and uniform surfaces.
- DO NOT alter building geometry, proportions, materials, or camera angle.

STAGE 2 — SEMANTIC LAYERS (transparent PNGs, identical resolution)
- 01_base.png         : building only. Remove ALL people, vehicles, vegetation,
                        sky, ground, and props.
- 02_context.png      : the people, vehicles, and trees from the original.
- 03_environment.png  : distant hills, foliage masses (not individual trees).
- 04_sky.png          : sky only.
Each layer must align pixel-perfect to the upscaled original; stacking them
recreates the scene losslessly.

STAGE 3 — OUTLINE
- 05_outline.svg      : monochrome (#00E5FF on transparent), single-stroke
                        vector silhouette of the building from 01_base.png.
                        Stroke width 1.5px at 1920px reference. Suitable for a
                        DrawSVG blueprint reveal animation.

STAGE 4 — VARIANT (only if requested)
- 06_variant_neon.png : the building from 01_base.png placed in a futuristic
                        neon-grid cityscape. Geometry, proportions, materials,
                        windows, and camera angle MUST be byte-identical to
                        01_base. Only the environment changes.

DELIVERY
- Return all files as a numbered set in a single zip or folder.
- Name files exactly as above. No alternative names.
- If a stage cannot be completed (e.g. no people in source), output an empty
  transparent PNG of the correct dimensions and a one-line note.
- Reject the job if Stage 1 alters geometry; do not return that file.
```

## Running the local stages

The `01-upscale.mjs` and `02-segment.mjs` scripts are stubs — they document the
expected input/output contract but require an API key for the AI provider you
choose. The `03-outline.mjs` and `04-encode.mjs` scripts run locally and are
ready to use once you `npm install sharp` (and optionally `canvas` + `potrace`
for outline extraction).

### One-shot per project

1. Drop the raw render into `public/assets/projects/<slug>/_raw/`.
2. Either:
   - Use the ChatGPT prompt above with vision, save outputs back into the
     project folder using the documented filenames, or
   - Run `node scripts/ai-pipeline/run.mjs <slug>` once the API stubs are
     wired to your provider of choice.
3. Run `npm run data:projects` to pick up the new layered paths.
4. Commit the outputs.

## Naming conventions for layered assets

For each render index `NN`:

```
NN.webp                    final upscaled flat (used as carousel base)
NN_base.webp / .png        building only, transparent
NN_context.webp / .png     people / vehicles / trees, transparent
NN_environment.webp / .png distant hills / foliage masses, transparent
NN_sky.webp / .png         sky, transparent
NN_outline.svg             cyan single-stroke silhouette
NN_variant_neon.webp       optional context-swap variant
```

The TS schema in `src/types/project.ts → ProjectRender.layers` is built around
exactly this naming.
