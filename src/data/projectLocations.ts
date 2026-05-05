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

/** Unique city, state labels in portfolio order (no duplicate chips for the same place). */
export const floatingTagsFromProjectLocations = (projects: Project[]): FloatingLocationTag[] => {
  const seen = new Set<string>();
  const tags: FloatingLocationTag[] = [];
  let i = 0;
  for (const p of projects) {
    const key = `${p.location.city}|${p.location.state}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const accent = i === 0 || i === 3;
    tags.push({ label: `${p.location.city}, ${p.location.state}`, accent });
    i += 1;
  }
  return tags;
};

export type GlobeLegendSite = { city: string; state: string; lat: number; lon: number };

/** One legend row per distinct city/state, first project in list supplies coordinates. */
export const globeLegendSites = (projects: Project[]): GlobeLegendSite[] => {
  const out: GlobeLegendSite[] = [];
  const seen = new Set<string>();
  for (const p of projects) {
    const c = p.coordinates;
    if (!c || c.length !== 2) continue;
    const [lat, lon] = c;
    if (typeof lat !== 'number' || typeof lon !== 'number') continue;
    const key = `${p.location.city}|${p.location.state}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ city: p.location.city, state: p.location.state, lat, lon });
  }
  return out;
};

export const formatLatLonLine = (lat: number, lon: number): string => {
  const ns = lat >= 0 ? 'N' : 'S';
  const ew = lon >= 0 ? 'E' : 'W';
  const la = Math.abs(lat).toFixed(4);
  const lo = Math.abs(lon).toFixed(4);
  return `${la}\u00b0 ${ns} / ${lo}\u00b0 ${ew}`;
};
