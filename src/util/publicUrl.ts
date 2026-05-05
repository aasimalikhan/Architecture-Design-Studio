/** Resolve a `public/` asset path for the current Vite `base` (e.g. GitHub Pages subpath). */
export function publicUrl(path: string): string {
  if (!path) return path;
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  const b = (import.meta.env.BASE_URL || '/').trim();
  const base = b.endsWith('/') ? b : `${b}/`;
  const trimmed = path.startsWith('/') ? path.slice(1) : path;
  return `${base}${trimmed}`;
}

/** Rewrite a comma-separated srcset so each URL is base-prefixed. */
export function publicSrcset(srcset: string): string {
  return srcset
    .split(',')
    .map((part) => {
      const t = part.trim();
      const spaceIdx = t.indexOf(' ');
      if (spaceIdx === -1) return publicUrl(t);
      return `${publicUrl(t.slice(0, spaceIdx))}${t.slice(spaceIdx)}`;
    })
    .join(', ');
}
