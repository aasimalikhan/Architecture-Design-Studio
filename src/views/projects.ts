import type { RouteContext } from '@/router';
import { loadProjects } from '@/data/loader';
import { projectTypologyLine } from '@/data/projectUi';
import { splitReveal } from '@/motion/splitReveal';
import { attachLightSweep } from '@/ui/cursor';
import { rasterPictureHtml } from '@/ui/projectPicture';

const SIZE_CYCLE: ('lg' | 'md' | 'sm' | 'wide')[] = [
  'lg',
  'md',
  'wide',
  'wide',
  'sm',
  'sm',
  'md',
  'lg',
  'wide',
];

export const renderProjects = async ({ main }: RouteContext) => {
  const { projects } = await loadProjects();

  main.innerHTML = `
    <section class="projects-page">
      <header class="projects-head">
        <h1 class="projects-head__title" data-split="lines">All projects.<br>Selected work.</h1>
        <div class="projects-head__count">${String(projects.length).padStart(2, '0')} works &middot; 2018&mdash;present</div>
      </header>
      <h2 class="projects-grid-heading">Project index</h2>
      <div class="projects-grid" id="projects-grid">
        ${projects
          .map((p, i) => {
            const size = SIZE_CYCLE[i % SIZE_CYCLE.length];
            return `
          <a class="project-card project-card--${size}" href="/projects/${p.slug}" data-link data-magnetic data-card>
            <div class="project-card__media">
              ${rasterPictureHtml({
                fallbackUrl: p.hero,
                variants: p.heroVariants,
                alt: p.title,
                loading: i < 4 ? 'eager' : 'lazy',
                sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw',
              })}
            </div>
            <div class="project-card__overlay"></div>
            <div class="project-card__sweep" aria-hidden="true"></div>
            <div class="project-card__meta">
              <div>
                <div class="project-card__title">${p.title}</div>
                <div class="project-card__loc">${projectTypologyLine(p)}</div>
              </div>
              <div class="project-card__index">${String(i + 1).padStart(2, '0')}</div>
            </div>
          </a>`;
          })
          .join('')}
      </div>
    </section>
  `;

  splitReveal(main);

  const sweepCleanup: (() => void)[] = [];
  main.querySelectorAll<HTMLElement>('[data-card]').forEach((card) => {
    sweepCleanup.push(attachLightSweep(card));
  });

  return () => {
    for (const c of sweepCleanup) c();
  };
};
