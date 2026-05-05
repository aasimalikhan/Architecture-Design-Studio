import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { env } from '@/store';

gsap.registerPlugin(ScrollTrigger);

const markHeadingRevealDone = (title: HTMLElement) => {
  title.dataset.headingRevealDone = '1';
};

const playHeadingReveal = (title: HTMLElement) => {
  if (title.dataset.headingRevealDone === '1') return;
  markHeadingRevealDone(title);
  gsap.fromTo(
    title,
    { opacity: 0, y: 36 },
    {
      opacity: 1,
      y: 0,
      duration: 1.05,
      ease: 'expo.out',
    }
  );
};

/** If the heading is already on screen, run the reveal without waiting for scroll. */
const scheduleScrollHeadingReveal = (title: HTMLElement) => {
  const tryPlayIfVisible = () => {
    if (title.dataset.headingRevealDone === '1') return;
    const r = title.getBoundingClientRect();
    const vh = window.innerHeight;
    if (r.bottom > 0 && r.top < vh + 100) {
      playHeadingReveal(title);
    }
  };

  ScrollTrigger.create({
    trigger: title,
    start: 'top bottom',
    once: true,
    onEnter: () => playHeadingReveal(title),
  });

  queueMicrotask(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(tryPlayIfVisible);
    });
  });
};

export const animateHero = (root: HTMLElement) => {
  const title = root.querySelector<HTMLElement>('.home-hero [data-split="lines"]');
  if (!title) return;

  if (env.reduced) {
    title.style.opacity = '1';
    return;
  }

  markHeadingRevealDone(title);
  gsap.fromTo(
    title,
    { opacity: 0, y: 40 },
    {
      opacity: 1,
      y: 0,
      duration: 1.1,
      ease: 'expo.out',
      delay: 0.15,
    }
  );

  const lede = root.querySelector<HTMLElement>('[data-reveal]');
  if (lede) {
    gsap.from(lede, {
      opacity: 0,
      y: 18,
      duration: 0.9,
      ease: 'expo.out',
      delay: 0.6,
    });
  }
};

export const splitReveal = (root: HTMLElement) => {
  if (env.reduced) {
    root.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
      el.style.opacity = '1';
    });
    return;
  }

  root.querySelectorAll<HTMLElement>('[data-split="lines"]').forEach((title) => {
    if (title.closest('.home-hero')) return;
    scheduleScrollHeadingReveal(title);
  });

  root.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
    if (el.dataset.revealReady === '1') return;
    el.dataset.revealReady = '1';
    gsap.set(el, { opacity: 0, y: 16 });
    ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      once: true,
      onEnter: () =>
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'expo.out',
        }),
    });
  });
};
