import { gsap } from 'gsap';
import type { Project, ProjectMetric } from '@/types/project';
import { env, isMobile } from '@/store';

const STAGE_ID = 'popup-stage';
const HOLD_MS = 4200;

let activeTimer: number | undefined;
let activeRunning = false;

const showCard = (
  project: Project,
  metric: ProjectMetric,
  stage: HTMLElement
): Promise<void> => {
  return new Promise((resolve) => {
    const card = document.createElement('div');
    card.className = 'popup-card';
    card.setAttribute('role', 'status');
    card.innerHTML = `
      <div class="popup-card__eyebrow">${project.title}</div>
      <div class="popup-card__label">${metric.label}</div>
      <div class="popup-card__value">${metric.value}</div>
      <div class="popup-card__project">${project.location.city}, ${project.location.state}</div>
    `;
    stage.appendChild(card);
    gsap.fromTo(
      card,
      { opacity: 0, x: 60 },
      { opacity: 1, x: 0, duration: 0.7, ease: 'expo.out' }
    );
    setTimeout(() => {
      gsap.to(card, {
        opacity: 0,
        x: 30,
        duration: 0.5,
        ease: 'power2.in',
        onComplete: () => {
          card.remove();
          resolve();
        },
      });
    }, HOLD_MS);
  });
};

export const schedulePopupsForProject = (project: Project) => {
  const stage = document.getElementById(STAGE_ID);
  if (!stage || env.reduced) return () => {};
  if (project.metrics.length === 0) return () => {};

  let cancelled = false;
  let i = 0;

  const tick = async () => {
    if (cancelled || activeRunning) return;
    activeRunning = true;
    const metric = project.metrics[i % project.metrics.length]!;
    i++;
    await showCard(project, metric, stage);
    activeRunning = false;
    if (cancelled) return;
    const delay = isMobile() ? 9000 : 5500;
    activeTimer = window.setTimeout(tick, delay);
  };

  // First card after a polite initial delay.
  activeTimer = window.setTimeout(tick, 2400);

  return () => {
    cancelled = true;
    if (activeTimer) {
      clearTimeout(activeTimer);
      activeTimer = undefined;
    }
    // Sweep any in-flight cards.
    stage.querySelectorAll<HTMLElement>('.popup-card').forEach((c) => {
      gsap.to(c, {
        opacity: 0,
        x: 20,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => c.remove(),
      });
    });
  };
};
