// Scans public/assets/projects/* and emits public/data/projects.json.
// Curated copy lives in OVERRIDES; folders not listed get auto-generated placeholders.
// Run: npm run data:projects

import { readdirSync, statSync, mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { join, extname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const PROJECTS_DIR = join(ROOT, 'public', 'assets', 'projects');
const WEBP_DIR = join(ROOT, 'public', 'assets', 'projects-webp');
const DATA_DIR = join(ROOT, 'public', 'data');
const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif']);
const HERO_HINTS = ['hero', 'cover', 'main', '1', '01', 'entrance', 'partial west view 01'];

// Respect Vite base path (needed for GitHub Pages project sites).
// This script runs during `prebuild`, so it receives the same env vars as `vite build`.
const BASE = (() => {
  const b = (process.env.VITE_BASE ?? '/').trim();
  if (b === '') return '/';
  return b.endsWith('/') ? b : `${b}/`;
})();
const withBase = (p) => `${BASE}${p.replace(/^\/+/, '')}`;

const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

// Curated project metadata. Add / edit here when content is ready.
// Keys are folder slugs (slugified folder names).
const OVERRIDES = {
  '214-burgess-street': {
    title: '214 Burgess Street',
    location: { city: 'Fayetteville', state: 'NC', country: 'USA' },
    coordinates: [35.0527, -78.8784],
    year: 2023,
    client: 'Regional arts council',
    category: ['Cultural'],
    summary:
      'A multi-use arts venue housing rehearsal halls, conference rooms, and a singular open-air auditorium.',
    body: [
      'A cultural anchor on a storied civic street—the building reorganises a deep urban lot around a central, sky-open auditorium — a quiet civic room held by brick, light, and air.',
      'Programming threads vertically: rehearsal volumes overlook the courtyard, conference rooms tuck into the street wall, and a rooftop terrace returns the audience to the city after a performance.',
    ],
    metrics: [
      { label: 'Open-air seats', value: '420' },
      { label: 'Rehearsal halls', value: '3' },
      { label: 'Footprint', value: '38,500 sf' },
      { label: 'Year', value: '2023' },
    ],
  },
  'bladen-auditorium': {
    title: 'Bladen Auditorium',
    location: { city: 'Bladen County', state: 'NC', country: 'USA' },
    coordinates: [34.6044, -78.6052],
    year: 2024,
    category: ['Cultural', 'Education'],
    summary:
      'A black-clad performance volume cut by a single luminous blade — light becomes structure.',
    body: [
      'Bladen reads as one decisive geometric move: a sheer, dark mass sliced by a glazed “blade” that releases the lobby toward the parking forecourt.',
      'Inside, the blade becomes a daylit promenade that organises ticketing, gathering, and the auditorium beyond — the building’s exterior gesture is its interior wayfinding.',
    ],
    metrics: [
      { label: 'Seats', value: '780' },
      { label: 'Acoustic clouds', value: '14' },
      { label: 'Blade height', value: '54 ft' },
    ],
  },
  'cape-fear-botanical-garden': {
    title: 'Cape Fear Botanical Garden',
    location: { city: 'Fayetteville', state: 'NC', country: 'USA' },
    coordinates: [35.0612, -78.8718],
    category: ['Cultural', 'Master Plan'],
    summary:
      'An eighty-acre botanical campus whose visitor pavilion negotiates between built and grown.',
    body: [
      'The pavilion is sited on the seam between cultivated grounds and the riverine woodland. A long, low roof gathers the gardens’ paths and releases them onto a broad porch oriented to the Cape Fear River.',
      'Material choices defer to the garden — local masonry, weathering steel, and timber soffits — letting the planting strategy carry the figure of the place.',
    ],
    metrics: [
      { label: 'Site area', value: '80 acres' },
      { label: 'Pavilion', value: '14,200 sf' },
      { label: 'River frontage', value: '1,800 ft' },
    ],
  },
  'cape-fear-regional-theatre': {
    title: 'Cape Fear Regional Theatre',
    location: { city: 'Fayetteville', state: 'NC', country: 'USA' },
    coordinates: [35.055, -78.8845],
    year: 2024,
    category: ['Cultural'],
    summary:
      'A regional theatre reimagined as a vertical civic stack — studio, mainstage, rooftop.',
    body: [
      'The expansion preserves the beloved mainstage and lifts new program above it: a flexible studio for new work, education suites, and a rooftop terrace for the company and the city.',
      'Façade rhythms reference the proscenium order while the rooftop dissolves into a softer, lantern-like reading at dusk.',
    ],
    metrics: [
      { label: 'Mainstage', value: '320 seats' },
      { label: 'Studio', value: '120 seats' },
      { label: 'Rooftop', value: '4,800 sf' },
    ],
  },
  'cashiers-housing': {
    title: 'Cashiers Housing',
    location: { city: 'Cashiers', state: 'NC', country: 'USA' },
    coordinates: [35.1117, -83.1005],
    category: ['Residential'],
    summary:
      'A cantilevered five-bedroom retreat carried into the tree canopy on a black timber sleeve.',
    body: [
      'Sited on a ridge, the house reaches into the forest on a structural cantilever — a dark cedar volume above, a quiet stone plinth below.',
      'Interiors continue the contrast: a calm, open social level wrapped in glass, with private rooms drawn back into the shadow of the canopy.',
    ],
    metrics: [
      { label: 'Bedrooms', value: '5' },
      { label: 'Cantilever', value: '24 ft' },
      { label: 'Living area', value: '6,400 sf' },
    ],
  },
  'city-gateway': {
    title: 'City Gateway',
    location: { city: 'Raleigh', state: 'NC', country: 'USA' },
    coordinates: [35.7796, -78.6382],
    year: 2025,
    category: ['Civic', 'Master Plan'],
    summary:
      'A ten-storey, energy-positive civic gateway anchoring a dense urban edge.',
    body: [
      'City Gateway is conceived as a building that gives back — engineered to produce more renewable energy across a year than it consumes.',
      'A K-8 charter school occupies the lower volumes, with workplace and civic floors stacked above. A continuous public plaza weaves through the base and threads the campus to the surrounding street grid.',
    ],
    metrics: [
      { label: 'Stories', value: '10' },
      { label: 'Energy', value: 'Net positive' },
      { label: 'Plaza', value: '38,000 sf' },
      { label: 'Year', value: '2025' },
    ],
  },
  'robeson-ctec': {
    title: 'Robeson CTEC',
    location: { city: 'Lumberton', state: 'NC', country: 'USA' },
    coordinates: [34.6182, -79.0086],
    category: ['Education'],
    summary:
      'A career and technology campus organised around a daylit central commons.',
    body: [
      'CTEC threads workshops, classrooms, and labs around a generous commons — a flexible interior “street” that bridges trades and disciplines.',
      'The exterior reads quietly civic: a deep brick base, a brighter teaching volume, and a continuous canopy that gathers students into the building.',
    ],
    metrics: [
      { label: 'Commons', value: '11,200 sf' },
      { label: 'Programs', value: '12' },
    ],
  },
  'sagamore-house': {
    title: 'Sagamore House',
    location: { city: 'Cashiers', state: 'NC', country: 'USA' },
    coordinates: [35.1068, -83.0882],
    category: ['Residential'],
    summary:
      'A long house pulled along the contour, opening to a deep western view.',
    body: [
      'Sagamore is composed as a single low gesture along its ridge — the house seems to grow from its plinth and release toward the western view.',
      'A continuous porch threads the public rooms; the bedrooms step into the slope, each with its own quiet aspect into the trees.',
    ],
    metrics: [
      { label: 'Length', value: '186 ft' },
      { label: 'Porch', value: '1,640 sf' },
    ],
  },
  'washington-county-school-pk-12': {
    title: 'Washington County School',
    location: { city: 'Plymouth', state: 'NC', country: 'USA' },
    coordinates: [35.8667, -76.7485],
    category: ['Education'],
    summary:
      'A consolidated PK-12 campus organised around a generous, daylit central commons.',
    body: [
      'A single building hosts three communities — early years, middle, and upper school — each with its own front door and outdoor room, all tied together by a commons that doubles as the town’s civic stage.',
    ],
    metrics: [
      { label: 'Grades', value: 'PK-12' },
      { label: 'Commons', value: '14,800 sf' },
    ],
  },
};

const pickHero = (files) => {
  const lc = files.map((f) => ({ name: f, key: f.toLowerCase() }));
  for (const hint of HERO_HINTS) {
    const match = lc.find(({ key }) => key.includes(hint));
    if (match) return match.name;
  }
  return files[0];
};

const captionFromFile = (f) =>
  basename(f, extname(f))
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

/** @returns {{ thumb: string, srcset: string } | undefined} */
const rasterVariants = (slug, stem) => {
  const enc = encodeURIComponent(stem);
  const p960 = join(WEBP_DIR, slug, `${stem}-w960.webp`);
  const p1920 = join(WEBP_DIR, slug, `${stem}-w1920.webp`);
  if (!existsSync(p960) || !existsSync(p1920)) return undefined;
  const base = withBase(`/assets/projects-webp/${slug}`);
  return {
    thumb: `${base}/${enc}-w960.webp`,
    srcset: `${base}/${enc}-w960.webp 960w, ${base}/${enc}-w1920.webp 1920w`,
  };
};

const main = () => {
  if (!statSync(PROJECTS_DIR).isDirectory()) {
    throw new Error(`Missing ${PROJECTS_DIR}`);
  }

  const folders = readdirSync(PROJECTS_DIR).filter((name) =>
    statSync(join(PROJECTS_DIR, name)).isDirectory()
  );

  const projects = folders
    .map((folder) => {
      const slug = slugify(folder);
      const folderAbs = join(PROJECTS_DIR, folder);
      const files = readdirSync(folderAbs)
        .filter((f) => IMAGE_EXT.has(extname(f).toLowerCase()))
        .sort((a, b) => a.localeCompare(b, 'en', { numeric: true, sensitivity: 'base' }));

      if (files.length === 0) return null;

      const heroFile = pickHero(files);
      const heroStem = basename(heroFile, extname(heroFile));
      const carouselFiles = files; // include hero in carousel for continuity
      const baseUrl = withBase(`/assets/projects/${encodeURI(folder)}`);

      const override = OVERRIDES[slug] ?? {};
      const fallbackTitle = folder
        .replace(/[-_]+/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());

      return {
        slug,
        title: override.title ?? fallbackTitle,
        location: override.location ?? { city: '', state: '', country: 'USA' },
        coordinates: override.coordinates,
        year: override.year,
        client: override.client,
        category: override.category ?? [],
        summary: override.summary ?? '',
        body: override.body ?? [],
        metrics: override.metrics ?? [],
        hero: `${baseUrl}/${encodeURIComponent(heroFile)}`,
        heroVariants: rasterVariants(slug, heroStem),
        renders: carouselFiles.map((f) => {
          const stem = basename(f, extname(f));
          return {
            base: `${baseUrl}/${encodeURIComponent(f)}`,
            variants: rasterVariants(slug, stem),
            alt: `${override.title ?? fallbackTitle} — ${captionFromFile(f)}`,
            caption: captionFromFile(f),
          };
        }),
      };
    })
    .filter(Boolean);

  // Stable, curated display order: civic + master plan first, then cultural, then residential, then education.
  const ORDER = [
    'city-gateway',
    'cashiers-housing',
    'bladen-auditorium',
    'cape-fear-regional-theatre',
    '214-burgess-street',
    'cape-fear-botanical-garden',
    'sagamore-house',
    'robeson-ctec',
    'washington-county-school-pk-12',
  ];
  projects.sort((a, b) => {
    const ai = ORDER.indexOf(a.slug);
    const bi = ORDER.indexOf(b.slug);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });

  mkdirSync(DATA_DIR, { recursive: true });
  const out = {
    generatedAt: new Date().toISOString(),
    count: projects.length,
    projects,
  };
  writeFileSync(join(DATA_DIR, 'projects.json'), JSON.stringify(out, null, 2));

  console.log(`Wrote ${projects.length} projects to public/data/projects.json`);
  for (const p of projects) {
    console.log(`  - ${p.slug.padEnd(36)} ${p.renders.length} images`);
  }
};

main();
