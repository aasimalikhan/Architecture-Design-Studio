import type { RouteContext } from '@/router';
import { findProject, adjacentProjects } from '@/data/loader';
import { splitReveal } from '@/motion/splitReveal';
import { mountCarousel } from '@/webgl/carousel';
import { schedulePopupsForProject } from '@/physics/popupQueue';
import { rasterPictureHtml } from '@/ui/projectPicture';

export const renderProjectDetail = async ({ main, params }: RouteContext) => {
  const slug = params.slug ?? '';
  const project = await findProject(slug);

  if (!project) {
    main.innerHTML = `<section class="error"><h1>Project not found.</h1><p><a href="/projects" data-link>Back to projects</a></p></section>`;
    return;
  }

  const { prev, next } = await adjacentProjects(slug);

  main.innerHTML = `
    <article class="project">
      <section class="project-hero" id="project-hero" data-slug="${project.slug}">
        <div class="project-hero__media">
          ${rasterPictureHtml({
            fallbackUrl: project.hero,
            variants: project.heroVariants,
            alt: project.title,
            loading: 'eager',
            fetchPriority: 'high',
            sizes: '100vw',
          })}
        </div>
        <div class="project-hero__overlay">
          <div>
            <div class="project-hero__eyebrow">${project.category.join(' / ') || 'Project'}</div>
            <h1 class="project-hero__title" data-split="lines">${project.title}</h1>
          </div>
          <div class="project-hero__loc">
            <dl>
              <dt>Location</dt>
              <dd>${project.location.city}, ${project.location.state}</dd>
              ${project.year ? `<dt>Year</dt><dd>${project.year}</dd>` : ''}
              ${project.client ? `<dt>Client</dt><dd>${project.client}</dd>` : ''}
              ${project.coordinates ? `<dt>Coords</dt><dd>${project.coordinates[0].toFixed(4)}&deg; / ${project.coordinates[1].toFixed(4)}&deg;</dd>` : ''}
            </dl>
          </div>
        </div>
      </section>

      <section class="project-body">
        <div class="project-body__grid">
          <p class="project-body__summary" data-reveal>${project.summary}</p>
          <div class="project-body__copy">
            ${project.body.map((para) => `<p data-reveal>${para}</p>`).join('')}
          </div>
        </div>
      </section>

      <section class="project-carousel" id="project-carousel" aria-label="Project gallery">
        <div class="project-carousel__track" id="project-carousel-track">
          ${project.renders
            .map(
              (r) => `
            <figure class="project-carousel__slide">
              ${rasterPictureHtml({
                fallbackUrl: r.base,
                variants: r.variants,
                alt: r.alt,
                loading: 'lazy',
                sizes: '(max-width: 900px) 100vw, 85vw',
              })}
              ${r.caption ? `<figcaption class="project-carousel__caption">${r.caption}</figcaption>` : ''}
            </figure>
          `
            )
            .join('')}
        </div>
      </section>

      <nav class="project-adjacent" aria-label="Project navigation">
        ${
          prev
            ? `<a class="prev" href="/projects/${prev.slug}" data-link data-magnetic>
                <div class="eyebrow">Previous</div>
                <div class="project-adjacent__title">${prev.title}</div>
                <div class="meta">${prev.location.city}, ${prev.location.state}</div>
              </a>`
            : '<span></span>'
        }
        ${
          next
            ? `<a class="next" href="/projects/${next.slug}" data-link data-magnetic>
                <div class="eyebrow">Next</div>
                <div class="project-adjacent__title">${next.title}</div>
                <div class="meta">${next.location.city}, ${next.location.state}</div>
              </a>`
            : '<span></span>'
        }
      </nav>
    </article>
  `;

  splitReveal(main);

  const track = main.querySelector<HTMLElement>('#project-carousel-track');
  const stage = main.querySelector<HTMLElement>('#project-carousel');
  const cleanupCarousel = track && stage ? mountCarousel(stage, track) : null;

  const cleanupPopups = schedulePopupsForProject(project);

  return () => {
    cleanupCarousel?.();
    cleanupPopups?.();
  };
};
