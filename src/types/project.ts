export type Country = 'USA' | 'India';

export type ProjectCategory =
  | 'Civic'
  | 'Cultural'
  | 'Education'
  | 'Residential'
  | 'Master Plan';

export interface RenderLayers {
  base?: string;
  context?: string;
  sky?: string;
  outline?: string;
}

/** Emitted by `npm run images:optimize` + `data:projects` when WebP derivatives exist. */
export interface RasterVariants {
  thumb: string;
  srcset: string;
}

export interface ProjectRender {
  base: string;
  variants?: RasterVariants;
  layers?: RenderLayers;
  caption?: string;
  alt: string;
}

export interface ProjectMetric {
  label: string;
  value: string;
}

export interface ProjectLocation {
  city: string;
  state: string;
  country: Country;
}

export interface Project {
  slug: string;
  title: string;
  location: ProjectLocation;
  coordinates?: [number, number];
  year?: number;
  client?: string;
  category: ProjectCategory[];
  summary: string;
  body: string[];
  metrics: ProjectMetric[];
  hero: string;
  heroVariants?: RasterVariants;
  renders: ProjectRender[];
}

export interface ProjectsPayload {
  generatedAt: string;
  count: number;
  projects: Project[];
}
