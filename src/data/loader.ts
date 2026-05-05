import type { Project, ProjectsPayload } from '@/types/project';

let cache: ProjectsPayload | null = null;
let inFlight: Promise<ProjectsPayload> | null = null;

export const loadProjects = async (): Promise<ProjectsPayload> => {
  if (cache) return cache;
  if (inFlight) return inFlight;

  inFlight = fetch('/data/projects.json', { cache: 'force-cache' })
    .then((r) => {
      if (!r.ok) throw new Error(`projects.json ${r.status}`);
      return r.json() as Promise<ProjectsPayload>;
    })
    .then((data) => {
      cache = data;
      return data;
    })
    .finally(() => {
      inFlight = null;
    });

  return inFlight;
};

export const findProject = async (slug: string): Promise<Project | undefined> => {
  const { projects } = await loadProjects();
  return projects.find((p) => p.slug === slug);
};

export const adjacentProjects = async (slug: string) => {
  const { projects } = await loadProjects();
  const i = projects.findIndex((p) => p.slug === slug);
  if (i < 0) return { prev: undefined, next: undefined };
  return {
    prev: projects[(i - 1 + projects.length) % projects.length],
    next: projects[(i + 1) % projects.length],
  };
};
