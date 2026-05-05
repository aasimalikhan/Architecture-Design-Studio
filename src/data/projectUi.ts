import type { Project } from '@/types/project';

/** Card and hero metadata: typology and year — no city or region. */
export const projectTypologyLine = (p: Project): string => {
  const typ = p.category.join(' · ');
  return p.year ? `${typ} · ${p.year}` : typ;
};
