// Orchestrates the four pipeline stages for one project slug.
// Usage: node scripts/ai-pipeline/run.mjs <slug>
//
// Stages 01 and 02 are PROVIDER-SHAPED STUBS that throw with a helpful message
// until you wire your chosen API key (Magnific, Topaz, Krea, Replicate, etc.).
// Stages 03 and 04 run locally once `sharp` (and optionally `potrace`) are
// installed as devDependencies.

import { argv } from 'node:process';
import { upscale } from './01-upscale.mjs';
import { segment } from './02-segment.mjs';
import { outline } from './03-outline.mjs';
import { encode } from './04-encode.mjs';

const slug = argv[2];
if (!slug) {
  console.error('Usage: node scripts/ai-pipeline/run.mjs <slug>');
  process.exit(1);
}

console.log(`[pipeline] starting for ${slug}`);
await upscale(slug);
await segment(slug);
await outline(slug);
await encode(slug);
console.log('[pipeline] done');
