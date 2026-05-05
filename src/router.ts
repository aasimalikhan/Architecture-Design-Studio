import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { scrollToTop } from '@/motion/scroll';
import { closeMobileNav } from '@/ui/navMobile';
import { renderHome } from '@/views/home';
import { renderAbout } from '@/views/about';
import { renderProjects } from '@/views/projects';
import { renderProjectDetail } from '@/views/projectDetail';
import { renderReferences } from '@/views/references';
import { renderTeam } from '@/views/team';
import { renderContact } from '@/views/contact';

export type RouteContext = {
  path: string;
  params: Record<string, string>;
  main: HTMLElement;
};

export type RouteHandler = (ctx: RouteContext) => Promise<(() => void) | void>;

type Route = {
  pattern: RegExp;
  keys: string[];
  handler: RouteHandler;
};

const routes: Route[] = [
  route('/', renderHome),
  route('/about', renderAbout),
  route('/projects', renderProjects),
  route('/projects/:slug', renderProjectDetail),
  route('/references', renderReferences),
  route('/team', renderTeam),
  route('/contact', renderContact),
];

const baseUrl = (() => {
  const b = (import.meta.env.BASE_URL || '/').trim();
  // Ensure trailing slash, no double slashes.
  return b.endsWith('/') ? b : `${b}/`;
})();

const toAppPath = (input: string) => {
  // Accept absolute URLs, base-prefixed paths, and plain app paths.
  try {
    const u = new URL(input, window.location.origin);
    const path = u.pathname + u.search + u.hash;
    if (baseUrl !== '/' && u.pathname.startsWith(baseUrl)) {
      const stripped = u.pathname.slice(baseUrl.length - 1) + u.search + u.hash;
      return stripped || '/';
    }
    if (u.origin === window.location.origin) return path || '/';
  } catch {
    // fall through
  }
  if (baseUrl !== '/' && input.startsWith(baseUrl)) {
    const stripped = input.slice(baseUrl.length - 1);
    return stripped || '/';
  }
  return input || '/';
};

const toBrowserPath = (appPath: string) => {
  const p = appPath.startsWith('/') ? appPath : `/${appPath}`;
  if (baseUrl === '/') return p;
  return `${baseUrl.replace(/\/$/, '')}${p}`;
};

function route(path: string, handler: RouteHandler): Route {
  const keys: string[] = [];
  const pattern = new RegExp(
    '^' +
      path.replace(/:([^/]+)/g, (_m, key) => {
        keys.push(key);
        return '([^/]+)';
      }) +
      '/?$'
  );
  return { pattern, keys, handler };
}

let currentCleanup: (() => void) | void = undefined;

const match = (path: string) => {
  for (const r of routes) {
    const m = path.match(r.pattern);
    if (m) {
      const params: Record<string, string> = {};
      r.keys.forEach((k, i) => (params[k] = decodeURIComponent(m[i + 1] ?? '')));
      return { handler: r.handler, params };
    }
  }
  return null;
};

const transitionOut = (main: HTMLElement) =>
  new Promise<void>((resolve) => {
    main.classList.add('is-leaving');
    const onEnd = () => {
      main.removeEventListener('transitionend', onEnd);
      resolve();
    };
    main.addEventListener('transitionend', onEnd);
    window.setTimeout(resolve, 320);
  });

const transitionIn = (main: HTMLElement) => {
  main.classList.remove('is-leaving');
  main.classList.add('is-entering');
  requestAnimationFrame(() => {
    main.classList.remove('is-entering');
  });
};

export const navigate = async (path: string, replace = false) => {
  closeMobileNav();
  const appPath = toAppPath(path);
  const main = document.getElementById('main') as HTMLElement | null;
  if (!main) return;

  const target = match(appPath) ?? match('/');
  if (!target) return;

  if (!replace) {
    const browserPath = toBrowserPath(appPath);
    if (location.pathname + location.search + location.hash !== browserPath) {
      history.pushState({}, '', browserPath);
    }
  }

  document.documentElement.dataset.route = appPath;

  if (currentCleanup) {
    try {
      currentCleanup();
    } catch (e) {
      console.error('route cleanup failed', e);
    }
    currentCleanup = undefined;
  }

  await transitionOut(main);
  main.innerHTML = '';
  scrollToTop();

  try {
    currentCleanup = await target.handler({ path: appPath, params: target.params, main });
  } catch (e) {
    console.error('route render failed', e);
    main.innerHTML = `<section class="error"><h1>Something went wrong.</h1><p>${String(e)}</p></section>`;
  }

  transitionIn(main);

  // Refresh ScrollTrigger after the new view is in the DOM.
  ScrollTrigger.refresh();

  // Update active nav links.
  document.querySelectorAll<HTMLAnchorElement>('.nav__links a').forEach((a) => {
    const href = a.dataset.route ?? toAppPath(a.getAttribute('href') ?? '');
    const active =
      href === appPath || (href !== '/' && appPath.startsWith(href));
    a.classList.toggle('is-active', active);
  });

  main.focus({ preventScroll: true });
};

const onClick = (e: MouseEvent) => {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const a = (e.target as HTMLElement | null)?.closest<HTMLAnchorElement>('a[data-link], a[href^="/"]');
  if (!a) return;
  const href = a.getAttribute('href');
  if (!href || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('#')) return;
  if (a.target === '_blank') return;
  e.preventDefault();
  navigate(a.dataset.route ?? toAppPath(href));
};

const onPop = () => {
  navigate(location.pathname + location.search + location.hash, true);
};

export const startRouter = () => {
  document.addEventListener('click', onClick);
  window.addEventListener('popstate', onPop);
  navigate(location.pathname + location.search + location.hash, true);
};
