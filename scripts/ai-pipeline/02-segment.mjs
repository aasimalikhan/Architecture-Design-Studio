// Stage 02 — Semantic segmentation into stackable layers (provider stub).
// Inputs:  public/assets/projects/<slug>/_upscaled/*
// Outputs: <basename>_base.png, <basename>_context.png, <basename>_sky.png, <basename>_environment.png
//
// Recommended providers / models:
//   - BiRefNet (open source) via Replicate or local Python
//   - RMBG-2.0 (open source) via Replicate or HuggingFace
//   - Segment Anything (SAM 2) for multi-object splits
//
// The intent is that stacking the four output PNGs back together reconstructs
// the original upscaled image losslessly.

export const segment = async (slug) => {
  const provider = process.env.REPLICATE_API_TOKEN
    ? 'replicate'
    : process.env.HUGGINGFACE_TOKEN
      ? 'huggingface'
      : null;

  if (!provider) {
    console.warn(
      `[02-segment] no provider configured. Set REPLICATE_API_TOKEN or ` +
      `HUGGINGFACE_TOKEN. Skipping segmentation for ${slug}.`
    );
    return;
  }

  throw new Error(
    `[02-segment] provider "${provider}" stub: implement the API call before running.`
  );
};
