const MQ = '(max-width: 720px)';

let applyMenuOpen: ((open: boolean) => void) | null = null;

export const closeMobileNav = (): void => {
  applyMenuOpen?.(false);
};

export const startNavMobile = (): void => {
  const nav = document.getElementById('nav');
  const toggle = document.getElementById('nav-menu-toggle');
  const backdrop = document.getElementById('nav-backdrop');
  const menu = document.getElementById('primary-nav');
  if (!nav || !toggle || !backdrop || !menu) return;

  const mq = window.matchMedia(MQ);
  const links = Array.from(menu.querySelectorAll<HTMLAnchorElement>('a'));

  const syncFocusability = (open: boolean) => {
    if (!mq.matches) {
      links.forEach((a) => a.removeAttribute('tabindex'));
      return;
    }
    if (open) {
      links.forEach((a) => a.removeAttribute('tabindex'));
    } else {
      links.forEach((a) => a.setAttribute('tabindex', '-1'));
    }
  };

  const setOpen = (open: boolean) => {
    if (!mq.matches) {
      nav.classList.remove('is-menu-open');
      backdrop.classList.remove('is-visible');
      backdrop.setAttribute('aria-hidden', 'true');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open menu');
      document.body.style.removeProperty('overflow');
      syncFocusability(false);
      return;
    }

    nav.classList.toggle('is-menu-open', open);
    backdrop.classList.toggle('is-visible', open);
    backdrop.setAttribute('aria-hidden', open ? 'false' : 'true');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.style.overflow = open ? 'hidden' : '';
    syncFocusability(open);

    if (open) {
      window.setTimeout(() => links[0]?.focus(), 0);
    }
  };

  applyMenuOpen = setOpen;

  syncFocusability(false);

  toggle.addEventListener('click', () => {
    const next = !nav.classList.contains('is-menu-open');
    setOpen(next);
    if (!next) {
      toggle.focus();
    }
  });

  backdrop.addEventListener('click', () => {
    setOpen(false);
    toggle.focus();
  });

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'Escape') return;
    if (!mq.matches || !nav.classList.contains('is-menu-open')) return;
    setOpen(false);
    toggle.focus();
  };
  window.addEventListener('keydown', onKeyDown);

  const onMqChange = () => {
    setOpen(false);
  };
  mq.addEventListener('change', onMqChange);
};
