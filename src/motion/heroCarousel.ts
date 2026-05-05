import { gsap } from 'gsap';

export type HeroSlide = { src: string; alt: string; slug: string; title: string };

export const mountHeroCarousel = (
  root: HTMLElement,
  slides: HeroSlide[]
): (() => void) => {
  if (slides.length === 0) return () => {};

  const els = Array.from(root.querySelectorAll<HTMLElement>('.home-hero__slide'));
  if (els.length === 0) return () => {};

  let i = 0;
  const setActive = (idx: number) => {
    els.forEach((el, j) => {
      const on = j === idx;
      el.classList.toggle('is-active', on);
      el.setAttribute('aria-hidden', on ? 'false' : 'true');
    });
  };

  gsap.set(els, { opacity: 0 });
  gsap.set(els[0]!, { opacity: 1 });
  setActive(0);

  if (slides.length < 2) return () => {};

  let timer: number | undefined;
  const advance = () => {
    const prev = i;
    i = (i + 1) % els.length;
    const prevEl = els[prev]!;
    const nextEl = els[i]!;
    setActive(i);
    gsap.to(prevEl, {
      opacity: 0,
      duration: 1.15,
      ease: 'power2.inOut',
    });
    gsap.fromTo(
      nextEl,
      { opacity: 0 },
      { opacity: 1, duration: 1.15, ease: 'power2.inOut' }
    );
  };

  timer = window.setInterval(advance, 5200);

  return () => {
    if (timer) clearInterval(timer);
    gsap.killTweensOf(els);
  };
};
