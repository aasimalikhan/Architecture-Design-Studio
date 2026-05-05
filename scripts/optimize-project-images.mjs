// Build-time WebP derivatives for portfolio rasters (Sharp).
// Reads:  public/assets/projects/<folder>/*.{jpg,jpeg,png}
// Writes: public/assets/projects-webp/<slug>/<stem>-w960.webp and -w1920.webp
// Also:    public/assets/ui/earth-hero-1024.webp from earth-atmos-2048.jpg when present
//
// Run: npm run images:optimize
// Flags: --force  re-encode even if outputs are newer than sources

import { mkdirSync, readdirSync, statSync, existsSync } from 'node:fs';
import { basename, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const SRC_PROJECTS = join(ROOT, 'public', 'assets', 'projects');
const OUT_WEBP = join(ROOT, 'public', 'assets', 'projects-webp');
const UI_DIR = join(ROOT, 'public', 'assets', 'ui');

const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png']);
const force = process.argv.includes('--force');

const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const needsEncode = (srcPath, outPath) => {
  if (force) return true;
  if (!existsSync(outPath)) return true;
  return statSync(outPath).mtimeMs < statSync(srcPath).mtimeMs;
};

const processRaster = async (slug, srcPath, stem) => {
  const slugDir = join(OUT_WEBP, slug);
  mkdirSync(slugDir, { recursive: true });
  const out960 = join(slugDir, `${stem}-w960.webp`);
  const out1920 = join(slugDir, `${stem}-w1920.webp`);

  const do960 = needsEncode(srcPath, out960);
  const do1920 = needsEncode(srcPath, out1920);
  if (!do960 && !do1920) {
    return 'skip';
  }

  const img = sharp(srcPath, { failOn: 'none' }).rotate();

  if (do1920) {
    await img
      .clone()
      .resize({ width: 1920, height: 1920, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 90, effort: 5, smartSubsample: true })
      .toFile(out1920);
  }

  if (do960) {
    await img
      .clone()
      .resize({ width: 960, height: 960, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 86, effort: 5, smartSubsample: true })
      .toFile(out960);
  }

  return 'ok';
};

const optimizeEarth = async () => {
  const src = join(UI_DIR, 'earth-atmos-2048.jpg');
  const out = join(UI_DIR, 'earth-hero-1024.webp');
  if (!existsSync(src)) {
    console.warn('[optimize] skip globe helper: missing', src);
    return;
  }
  if (!needsEncode(src, out)) {
    console.log('[optimize] skip globe texture (up to date):', out);
    return;
  }
  await sharp(src, { failOn: 'none' })
    .resize({ width: 1024, height: 1024, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 90, effort: 5, smartSubsample: true })
    .toFile(out);
  console.log('[optimize] wrote', out);
};

const main = async () => {
  let ok = 0;
  let skip = 0;
  let err = 0;

  const folders = readdirSync(SRC_PROJECTS).filter((name) =>
    statSync(join(SRC_PROJECTS, name)).isDirectory()
  );

  for (const folder of folders) {
    const slug = slugify(folder);
    const abs = join(SRC_PROJECTS, folder);
    const files = readdirSync(abs).filter((f) => IMAGE_EXT.has(extname(f).toLowerCase()));

    for (const file of files) {
      const stem = basename(file, extname(file));
      const srcPath = join(abs, file);
      try {
        const r = await processRaster(slug, srcPath, stem);
        if (r === 'ok') ok++;
        else skip++;
      } catch (e) {
        err++;
        console.error('[optimize] failed', srcPath, e);
      }
    }
  }

  await optimizeEarth();

  console.log(
    `[optimize] projects-webp done: ${ok} encoded, ${skip} skipped, ${err} errors → ${OUT_WEBP}`
  );
};

await main();
