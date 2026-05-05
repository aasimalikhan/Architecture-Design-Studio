import type { Project } from '@/types/project';

export type GlobePin = { lat: number; lon: number };

/** One pin per project that has map coordinates (WGS84, lat then lon). */
export const globePinsFromProjects = (projects: Project[]): GlobePin[] => {
  const out: GlobePin[] = [];
  for (const p of projects) {
    const c = p.coordinates;
    if (!c || c.length !== 2) continue;
    const [lat, lon] = c;
    if (typeof lat !== 'number' || typeof lon !== 'number') continue;
    out.push({ lat, lon });
  }
  return out;
};

export type FloatingLocationTag = { label: string; accent?: boolean };

/** Unique portfolio typologies as floating chips (not tied to geography). */
export const floatingTagsFromProjectLocations = (projects: Project[]): FloatingLocationTag[] => {
  const seen = new Set<string>();
  const tags: FloatingLocationTag[] = [];
  let i = 0;
  for (const p of projects) {
    for (const cat of p.category) {
      if (seen.has(cat)) continue;
      seen.add(cat);
      tags.push({
        label: cat.toUpperCase(),
        accent: i === 0 || i === 3,
      });
      i += 1;
    }
  }
  return tags;
};

export type GlobeLegendSite = { title: string };

/** Short list of labelled works for the hero legend (titles only). */
export const globeLegendSites = (projects: Project[]): GlobeLegendSite[] => {
  const out: GlobeLegendSite[] = [];
  const seenSlug = new Set<string>();
  for (const p of projects) {
    const c = p.coordinates;
    if (!c || c.length !== 2) continue;
    const [lat, lon] = c;
    if (typeof lat !== 'number' || typeof lon !== 'number') continue;
    if (seenSlug.has(p.slug)) continue;
    seenSlug.add(p.slug);
    out.push({ title: p.title });
    if (out.length >= 8) break;
  }
  return out;
};
