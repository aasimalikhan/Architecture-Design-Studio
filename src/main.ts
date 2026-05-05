import './styles/index.css';
import { startRouter } from '@/router';
import { startCursor } from '@/ui/cursor';
import { startSmoothScroll } from '@/motion/scroll';

const applySpaRedirect = () => {
  const url = new URL(location.href);
  const p = url.searchParams.get('p');
  if (!p) return;
  url.searchParams.delete('p');

  const base = import.meta.env.BASE_URL.endsWith('/')
    ? import.meta.env.BASE_URL.slice(0, -1)
    : import.meta.env.BASE_URL;

  const decoded = decodeURIComponent(p);
  const target = decoded.startsWith(base) ? decoded.slice(base.length) : decoded;
  const normalized = target.startsWith('/') ? target : `/${target}`;

  history.replaceState({}, '', base + normalized);
};

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
  applySpaRedirect();
  startSmoothScroll();
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
