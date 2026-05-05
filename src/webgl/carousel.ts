import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { env, isMobile } from '@/store';

gsap.registerPlugin(ScrollTrigger);

// Horizontal scroll-driven gallery. The track moves left as the user scrolls
// past the section; the section is pinned for the duration of the pan.
// Mobile / reduced-motion fall back to native horizontal swipe.
export const mountCarousel = (stage: HTMLElement, track: HTMLElement) => {
  if (env.reduced || isMobile()) {
    track.style.overflowX = 'auto';
    stage.style.overflow = 'visible';
    track.style.scrollSnapType = 'x mandatory';
    track.querySelectorAll<HTMLElement>('.project-carousel__slide').forEach((s) => {
      s.style.scrollSnapAlign = 'start';
    });
    return () => {};
  }

  const ctx = gsap.context(() => {
    const compute = () => {
      const total = track.scrollWidth - window.innerWidth;
      return Math.max(0, total);
    };

    const tween = gsap.to(track, {
      x: () => -compute(),
      ease: 'none',
      scrollTrigger: {
        trigger: stage,
        pin: true,
        start: 'top top',
        end: () => `+=${compute()}`,
        // true = scroll-linked with no extra smoothing (scrub: N adds noticeable lag).
        scrub: true,
        invalidateOnRefresh: true,
        anticipatePin: 1,
      },
    });

    // Keep ScrollTrigger sized to the track even after image loads.
    track.querySelectorAll<HTMLImageElement>('img').forEach((img) => {
      if (img.complete) return;
      img.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
    });

    return tween;
  }, stage);

  return () => ctx.revert();
};
