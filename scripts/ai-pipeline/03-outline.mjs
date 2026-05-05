// Stage 03 — Edge → SVG silhouette outline.
// Inputs:  <basename>_base.png  (transparent building-only layer from stage 02)
// Outputs: <basename>_outline.svg
//
// Strategy (no AI required):
//   1. Read alpha channel of _base.png.
//   2. Threshold to binary mask.
//   3. Trace contour with `potrace` (npm i -D potrace) → SVG path.
//   4. Stroke at 1.5px width with #00E5FF on transparent.
//
// This file is a stub that documents the contract; implement when potrace
// and sharp are added to devDependencies.

export const outline = async (slug) => {
  console.warn(
    `[03-outline] stub. Install \`sharp\` + \`potrace\` to implement contour ` +
    `tracing for ${slug}.`
  );
};
