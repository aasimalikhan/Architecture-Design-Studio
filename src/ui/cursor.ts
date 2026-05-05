import { gsap } from 'gsap';
import { env } from '@/store';

let active: { destroy: () => void } | null = null;

export const startCursor = () => {
  if (env.coarse) return;
  if (active) return;

  const ring = document.getElementById('cursor');
  const dot = document.getElementById('cursor-dot');
  if (!ring || !dot) return;

  const ringX = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'expo.out' });
  const ringY = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'expo.out' });
  const dotX = gsap.quickTo(dot, 'x', { duration: 0.12, ease: 'expo.out' });
  const dotY = gsap.quickTo(dot, 'y', { duration: 0.12, ease: 'expo.out' });

  let raf = 0;
  let mx = 0;
  let my = 0;
  const onMove = (e: MouseEvent) => {
    mx = e.clientX;
    my = e.clientY;
    if (!raf) {
      raf = requestAnimationFrame(() => {
        ringX(mx);
        ringY(my);
        dotX(mx);
        dotY(my);
        raf = 0;
      });
    }
  };

  const onDown = () => ring.classList.add('is-pressed');
  const onUp = () => ring.classList.remove('is-pressed');

  // Magnetic attraction: pull cursor + transform target toward the magnet's center.
  const magnetState = new WeakMap<
    HTMLElement,
    { x: gsap.QuickToFunc; y: gsap.QuickToFunc }
  >();

  const onOver = (e: Event) => {
    const t = (e.target as HTMLElement | null)?.closest<HTMLElement>('[data-magnetic]');
    if (!t) return;
    ring.classList.add('is-magnetic');
    if (!magnetState.has(t)) {
      magnetState.set(t, {
        x: gsap.quickTo(t, 'x', { duration: 0.45, ease: 'expo.out' }),
        y: gsap.quickTo(t, 'y', { duration: 0.45, ease: 'expo.out' }),
      });
    }
    const onMagMove = (ev: MouseEvent) => {
      const r = t.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = (ev.clientX - cx) * 0.18;
      const dy = (ev.clientY - cy) * 0.18;
      const s = magnetState.get(t)!;
      s.x(dx);
      s.y(dy);
    };
    const onLeave = () => {
      ring.classList.remove('is-magnetic');
      const s = magnetState.get(t)!;
      s.x(0);
      s.y(0);
      t.removeEventListener('mousemove', onMagMove);
      t.removeEventListener('mouseleave', onLeave);
    };
    t.addEventListener('mousemove', onMagMove);
    t.addEventListener('mouseleave', onLeave, { once: true });
  };

  document.addEventListener('mousemove', onMove, { passive: true });
  document.addEventListener('mouseover', onOver);
  document.addEventListener('mousedown', onDown);
  document.addEventListener('mouseup', onUp);

  active = {
    destroy: () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('mouseup', onUp);
      if (raf) cancelAnimationFrame(raf);
    },
  };
};

// Project-card light sweep follows the cursor inside the element.
export const attachLightSweep = (el: HTMLElement) => {
  const onMove = (e: MouseEvent) => {
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    el.style.setProperty('--mx', `${x}%`);
    el.style.setProperty('--my', `${y}%`);
  };
  el.addEventListener('mousemove', onMove);
  return () => el.removeEventListener('mousemove', onMove);
};
