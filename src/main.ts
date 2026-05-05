import './styles/index.css';
import { startRouter } from '@/router';
import { startCursor } from '@/ui/cursor';
import { startSmoothScroll } from '@/motion/scroll';
import { startNavMobile } from '@/ui/navMobile';

const dismissBoot = () => {
  const boot = document.getElementById('boot-loader');
  if (!boot) return;
  setTimeout(() => boot.classList.add('is-done'), 320);
  boot.addEventListener(
    'transitionend',
    () => boot.remove(),
    { once: true }
  );
};

const ready = () => {
  startSmoothScroll();
  startNavMobile();
  startCursor();
  startRouter();
  dismissBoot();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', ready, { once: true });
} else {
  ready();
}

// Hide the cursor if a touch interaction happens on a hybrid device.
window.addEventListener(
  'touchstart',
  () => {
    document.documentElement.dataset.touch = '1';
  },
  { once: true, passive: true }
);
