import type { RasterVariants } from '@/types/project';

const escAttr = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

export type PictureLoading = 'eager' | 'lazy';

export type RasterPictureOpts = {
  fallbackUrl: string;
  variants?: RasterVariants;
  alt: string;
  loading?: PictureLoading;
  fetchPriority?: 'high' | 'low' | 'auto';
  sizes?: string;
  className?: string;
};

/** Responsive WebP via `<picture>` when `variants` exist; otherwise a single `<img>`. */
export const rasterPictureHtml = (opts: RasterPictureOpts): string => {
  const alt = escAttr(opts.alt);
  const loading = opts.loading ?? 'lazy';
  const fp =
    opts.fetchPriority === 'high' || opts.fetchPriority === 'low' || opts.fetchPriority === 'auto'
      ? ` fetchpriority="${opts.fetchPriority}"`
      : '';
  const sizes = escAttr(opts.sizes ?? '(max-width: 768px) 100vw, 45vw');
  const cls = opts.className ? ` class="${escAttr(opts.className)}"` : '';

  const v = opts.variants;
  if (v?.thumb && v?.srcset) {
    return `<picture${cls}><source type="image/webp" srcset="${escAttr(v.srcset)}" sizes="${sizes}" /><img src="${escAttr(v.thumb)}" alt="${alt}" loading="${loading}" decoding="async"${fp} /></picture>`;
  }
  return `<img src="${escAttr(opts.fallbackUrl)}" alt="${alt}" loading="${loading}" decoding="async"${fp}${cls} />`;
};
