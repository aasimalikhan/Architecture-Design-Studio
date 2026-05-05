import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { env } from '@/store';

gsap.registerPlugin(ScrollTrigger);

// Split a single text node into per-word spans wrapped in line clip masks.
// We avoid the licensed SplitText plugin by doing a lightweight per-word split.
const splitIntoLines = (el: HTMLElement) => {
  if (el.dataset.splitDone === '1') return;
  const html = el.innerHTML;
  // Replace explicit <br> with line breaks; treat each line independently.
  const lines = html.split(/<br\s*\/?>(?:\s*)/i);
  el.innerHTML = lines
    .map((line) => {
      // Per-word wrap inside per-line mask.
      const words = line
        .split(/(\s+)/)
        .map((tok) =>
          /\S/.test(tok)
            ? `<span class="split-line__inner"><span class="word">${tok}</span></span>`
            : tok
        )
        .join('');
      return `<span class="split-line">${words}</span>`;
    })
    .join('<br>');
  el.dataset.splitDone = '1';
};

export const animateHero = (root: HTMLElement) => {
  const title = root.querySelector<HTMLElement>('[data-split="lines"]');
  if (!title) return;

  if (env.reduced) {
    title.style.opacity = '1';
    return;
  }

  splitIntoLines(title);
  const inners = title.querySelectorAll<HTMLElement>('.split-line__inner');
  gsap.set(inners, { yPercent: 110 });
  gsap.to(inners, {
    yPercent: 0,
    duration: 1.1,
    ease: 'expo.out',
    stagger: 0.06,
    delay: 0.15,
  });

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

  // Headings with data-split="lines" — clip-mask line stagger on enter.
  root.querySelectorAll<HTMLElement>('[data-split="lines"]').forEach((title) => {
    splitIntoLines(title);
    const inners = title.querySelectorAll<HTMLElement>('.split-line__inner');
    gsap.set(inners, { yPercent: 110 });
    ScrollTrigger.create({
      trigger: title,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(inners, {
          yPercent: 0,
          duration: 1.0,
          ease: 'expo.out',
          stagger: 0.05,
        });
      },
    });
  });

  // Generic data-reveal — fade + lift on enter.
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
