import type { RouteContext } from '@/router';
import { loadProjects } from '@/data/loader';
import {
  globeLegendSites,
  globePinsFromProjects,
} from '@/data/projectLocations';
import { projectTypologyLine } from '@/data/projectUi';
import { mountGlobeHero } from '@/webgl/globeHero';
import { mountTagsStageField } from '@/webgl/tagsStageField';
import { mountHeroCarousel } from '@/motion/heroCarousel';
import { animateHero, splitReveal } from '@/motion/splitReveal';
import { isMobile } from '@/store';
import { rasterPictureHtml } from '@/ui/projectPicture';

export const renderHome = async ({ main }: RouteContext) => {
  const { projects } = await loadProjects();
  const featured = projects.slice(0, 4);
  const carouselSlides = projects.slice(0, 5);
  const showGlobe = !isMobile();
  const globePins = showGlobe ? globePinsFromProjects(projects) : [];
  const legendSites = showGlobe ? globeLegendSites(projects) : [];
  const legendPinsHtml = legendSites
    .map(
      (site, idx) => `
          <div class="home-hero__globe-pin">
            <span class="home-hero__globe-dot${
              idx % 4 === 1 ? ' home-hero__globe-dot--accent' : ''
            }" aria-hidden="true"></span>
            <div>
              <strong>${site.title}</strong>
            </div>
          </div>`
    )
    .join('');

  main.innerHTML = `
    <section class="home-hero">
      <div class="home-hero__carousel" id="hero-carousel" aria-label="Featured project imagery">
        ${carouselSlides
          .map(
            (p, idx) => `
        <div class="home-hero__slide${idx === 0 ? ' is-active' : ''}" data-hero-slide role="img" aria-hidden="${idx === 0 ? 'false' : 'true'}">
          ${rasterPictureHtml({
            fallbackUrl: p.hero,
            variants: p.heroVariants,
            alt: p.title,
            loading: idx === 0 ? 'eager' : 'lazy',
            fetchPriority: idx === 0 ? 'high' : undefined,
            sizes: '(max-width: 768px) 100vw, 42vw',
          })}
          <a class="home-hero__slide-cta" href="/projects/${p.slug}" data-link data-magnetic>
            <span class="home-hero__slide-eyebrow">Featured</span>
            <span class="home-hero__slide-title">${p.title}</span>
            <span class="home-hero__slide-meta">${projectTypologyLine(p)}</span>
          </a>
        </div>`
          )
          .join('')}
      </div>
      <div class="home-hero__veil" aria-hidden="true"></div>

      ${
        showGlobe
          ? `
      <div class="home-hero__globe-panel" aria-label="Portfolio on the globe">
        <div class="home-hero__globe-host" id="hero-globe-host"></div>
        <div class="home-hero__globe-legend">
          ${legendPinsHtml}
        </div>
      </div>`
          : ''
      }

      <div class="home-hero__content">
        <h1 class="home-hero__title" data-split="lines">
          Civic, cultural<br>&amp; residential<br><em>architecture.</em>
        </h1>
        <p class="home-hero__lede" data-reveal>
          NCD International is a design studio for civic, cultural, and
          residential work &mdash; approached with restraint, precision, and care.
        </p>
      </div>
      <div class="home-hero__scroll">Scroll</div>
    </section>

    <section class="tags-stage" id="tags-stage" aria-label="Project typologies">
      <div class="tags-stage__field" id="tags-stage-field" aria-hidden="true"></div>
      <div class="tags-stage__heading">
        Master planning, civic, cultural,<br>
        residential <em>&mdash;</em> at every scale.
      </div>
    </section>

    <section class="featured" aria-labelledby="featured-heading">
      <div class="featured__head">
        <h2 id="featured-heading" class="featured__title">Selected work, recent.</h2>
        <a href="/projects" data-link data-magnetic class="meta">All projects &rarr;</a>
      </div>
      <div class="featured__list">
        ${featured
          .map(
            (p, i) => `
          <a class="featured__card" href="/projects/${p.slug}" data-link data-magnetic style="grid-column: ${i % 2 === 0 ? 'span 1' : 'span 1'};">
            ${rasterPictureHtml({
              fallbackUrl: p.hero,
              variants: p.heroVariants,
              alt: p.title,
              loading: i < 2 ? 'eager' : 'lazy',
              sizes: '(max-width: 720px) 100vw, 50vw',
            })}
            <div class="featured__card-meta">
              <div>
                <div class="featured__card-title">${p.title}</div>
                <div class="meta">${projectTypologyLine(p)}</div>
              </div>
              <div class="meta">${String(i + 1).padStart(2, '0')} / ${String(featured.length).padStart(2, '0')}</div>
            </div>
          </a>
        `
          )
          .join('')}
      </div>
    </section>

    <section class="pull-quote">
      <blockquote class="pull-quote__text" data-reveal cite="/references">
        <p>
          &ldquo;I have known Hashim Naqui for over 20 years; as a professional colleague and as a friend.
          He is smart, talented and skilled at his trade. He has been keenly instrumental as a consulting
          architect in assisting O&rsquo;Brien Atkins Associates with the production of construction documents
          on sizable projects under our commission. Most importantly, he is honest and maintains the highest
          integrity in all that he does.&rdquo;
        </p>
      </blockquote>
      <div class="pull-quote__attr">
        John Atkins, FAIA &mdash; Chairman &amp; CEO, O&rsquo;Brien Atkins Associates
        <a href="/references" data-link class="pull-quote__more">Full references</a>
      </div>
    </section>
  `;

  animateHero(main);
  splitReveal(main);

  const tagsStageField = main.querySelector<HTMLElement>('#tags-stage-field');
  const tagsFieldTexture =
    carouselSlides[0]?.heroVariants?.thumb ?? carouselSlides[0]?.hero;
  const cleanupTagsField = tagsStageField
    ? mountTagsStageField(tagsStageField, tagsFieldTexture ?? undefined)
    : null;

  const carouselRoot = main.querySelector<HTMLElement>('#hero-carousel');
  const cleanupCarousel =
    carouselRoot && carouselSlides.length > 0
      ? mountHeroCarousel(
          carouselRoot,
          carouselSlides.map((p) => ({
            src: p.heroVariants?.thumb ?? p.hero,
            alt: p.title,
            slug: p.slug,
            title: p.title,
          }))
        )
      : null;

  const globeHost = main.querySelector<HTMLElement>('#hero-globe-host');
  const cleanupGlobe =
    showGlobe && globeHost ? mountGlobeHero(globeHost, globePins) : null;

  return () => {
    cleanupTagsField?.();
    cleanupCarousel?.();
    cleanupGlobe?.();
  };
};
