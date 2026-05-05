// Downloads the globe day texture into public/assets/ui/ (Node 18+ fetch).
// Run: npm run fetch:earth

import { mkdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const OUT = join(ROOT, 'public', 'assets', 'ui', 'earth-atmos-2048.jpg');
const TEX_URL =
  'https://raw.githubusercontent.com/mrdoob/three.js/r169/examples/textures/planets/earth_atmos_2048.jpg';

mkdirSync(dirname(OUT), { recursive: true });
const res = await fetch(TEX_URL);
if (!res.ok) throw new Error(`fetch ${TEX_URL}: ${res.status}`);
writeFileSync(OUT, Buffer.from(await res.arrayBuffer()));
console.log(`Wrote ${OUT} (${statSync(OUT).size} bytes)`);
