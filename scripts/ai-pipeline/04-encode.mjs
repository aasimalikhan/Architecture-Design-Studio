// Stage 04 — Encode to webp + avif at multiple widths.
// Inputs:  any PNG/JPG in public/assets/projects/<slug>/
// Outputs: same names, .webp + .avif, generated for 1280, 1920, 3840 widths.
//
// Stub form. Once `sharp` is installed:
//
//   import sharp from 'sharp';
//   const widths = [1280, 1920, 3840];
//   for (const w of widths) {
//     await sharp(input).resize({ width: w }).webp({ quality: 82 }).toFile(out + '.webp');
//     await sharp(input).resize({ width: w }).avif({ quality: 60 }).toFile(out + '.avif');
//   }

export const encode = async (slug) => {
  console.warn(
    `[04-encode] stub. Install \`sharp\` and implement webp+avif transcode ` +
    `for ${slug}.`
  );
};
