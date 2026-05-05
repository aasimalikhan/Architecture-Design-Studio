import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { env, isMobile } from '@/store';

gsap.registerPlugin(ScrollTrigger);

let lenis: Lenis | null = null;

export const startSmoothScroll = () => {
  if (env.reduced || isMobile()) {
    // Native scrolling on mobile / reduced-motion. Wire ScrollTrigger to window.
    return null;
  }

  const instance = new Lenis({
    // Snappier than 1.2 / 0.08 so long pinned sections (project carousel) need less wheel travel.
    duration: 0.95,
    lerp: 0.12,
    smoothWheel: true,
    wheelMultiplier: 1.2,
    touchMultiplier: 1.4,
  });
  lenis = instance;

  // Sync ScrollTrigger with Lenis whenever the smoothed scroll position changes.
  instance.on('scroll', ScrollTrigger.update);

  // Lenis drives scroll via rAF; ScrollTrigger must read/write through the proxy
  // or pin scrub math drifts and the viewport can go blank (e.g. project carousel pin).
  ScrollTrigger.scrollerProxy(document.documentElement, {
    scrollTop(value) {
      if (arguments.length && typeof value === 'number') {
        instance.scrollTo(value, { immediate: true });
      }
      return instance.scroll;
    },
    getBoundingClientRect() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      return { top: 0, left: 0, width: w, height: h, bottom: h, right: w } as DOMRect;
    },
    pinType: 'transform',
  });
  ScrollTrigger.defaults({ scroller: document.documentElement });

  // Keep Lenis scroll limits in sync when ST recalculates (images, fonts, route content).
  ScrollTrigger.addEventListener('refresh', () => {
    instance.resize();
  });

  gsap.ticker.add((time) => {
    instance.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  ScrollTrigger.refresh();

  return lenis;
};

export const getLenis = () => lenis;

/** Use after route changes; `window.scrollTo` does not move Lenis's virtual scroll. */
export const scrollToTop = () => {
  if (lenis) {
    lenis.scrollTo(0, { immediate: true });
  } else {
    window.scrollTo(0, 0);
  }
  ScrollTrigger.update();
};

export const scrollTo = (target: string | number | HTMLElement, offset = 0) => {
  if (lenis) {
    lenis.scrollTo(target as string | HTMLElement | number, { offset });
    return;
  }
  if (typeof target === 'number') {
    window.scrollTo({ top: target + offset, behavior: 'smooth' });
    return;
  }
  const el =
    typeof target === 'string'
      ? document.querySelector<HTMLElement>(target)
      : target;
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

export { ScrollTrigger };
