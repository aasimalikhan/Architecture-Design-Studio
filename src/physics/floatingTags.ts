import Matter from 'matter-js';
import { env } from '@/store';

export type FloatingTagDescriptor = { label: string; accent?: boolean };

/**
 * Perimeter slots so springs keep chips off the centred `.tags-stage__heading` copy
 * (nothing anchored in the interior band where the headline sits).
 */
const perimeterAnchors = (stageW: number, stageH: number) => {
  const mx = Math.min(48, stageW * 0.07);
  const my = Math.min(40, stageH * 0.08);
  const ix = Math.max(56, stageW - 2 * mx);
  const iy = Math.max(48, stageH - 2 * my);
  const xr = [0.08, 0.92, 0.06, 0.94, 0.16, 0.84];
  const yrUpper = [0.12, 0.12, 0.24, 0.24, 0.06, 0.06];
  const yrLower = [0.88, 0.88, 0.76, 0.76, 0.94, 0.94];

  const toPx = (xrn: number, yrn: number) => ({
    x: mx + xrn * ix,
    y: my + yrn * iy,
  });

  const slots: { x: number; y: number }[] = [];
  for (let i = 0; i < xr.length; i += 1) {
    slots.push(toPx(xr[i]!, yrUpper[i]!));
    slots.push(toPx(xr[i]!, yrLower[i]!));
  }
  return slots;
};

const anchorForIndex = (i: number, _n: number, stageW: number, stageH: number) => {
  const slots = perimeterAnchors(stageW, stageH);
  if (slots.length === 0) {
    return { x: stageW * 0.5, y: stageH * 0.15 };
  }
  return slots[i % slots.length]!;
};

type TagItem = {
  el: HTMLElement;
  body: Matter.Body;
  w: number;
  h: number;
  anchor: { x: number; y: number };
};

export const mountFloatingTags = (host: HTMLElement, descriptors: FloatingTagDescriptor[]) => {
  if (env.reduced) return () => {};
  if (descriptors.length === 0) return () => {};

  const { Engine, World, Bodies, Body, Composite, Mouse, MouseConstraint, Runner, Events } =
    Matter;

  const engine = Engine.create({
    gravity: { x: 0, y: 0, scale: 0 },
    enableSleeping: false,
  });
  const world = engine.world;
  engine.world.gravity.y = 0;

  // Container walls.
  const rect = host.getBoundingClientRect();
  let w = rect.width;
  let h = rect.height;

  const wallThickness = 80;
  const walls = [
    Bodies.rectangle(w / 2, -wallThickness / 2, w * 2, wallThickness, { isStatic: true }),
    Bodies.rectangle(w / 2, h + wallThickness / 2, w * 2, wallThickness, { isStatic: true }),
    Bodies.rectangle(-wallThickness / 2, h / 2, wallThickness, h * 2, { isStatic: true }),
    Bodies.rectangle(w + wallThickness / 2, h / 2, wallThickness, h * 2, { isStatic: true }),
  ];
  Composite.add(world, walls);

  // Tag DOM elements + their bodies, kept in sync.
  const items: TagItem[] = [];
  const n = descriptors.length;
  // Pull each chip gently toward its row slot so motion stays playful but composition stays legible.
  const springK = 0.000014;

  descriptors.forEach((t, i) => {
    const el = document.createElement('div');
    el.className = `tag-body${t.accent ? ' tag-body--accent' : ''}`;
    el.textContent = t.label;
    host.appendChild(el);

    // Measure after attach.
    const r = el.getBoundingClientRect();
    const tw = r.width;
    const th = r.height;

    const anchor = anchorForIndex(i, n, w, h);
    const jx = Math.sin(i * 2.17) * 10;
    const jy = Math.cos(i * 1.83) * 8;
    const x = Math.min(Math.max(tw / 2 + 8, anchor.x + jx), w - tw / 2 - 8);
    const y = Math.min(Math.max(th / 2 + 8, anchor.y + jy), h - th / 2 - 8);

    const body = Bodies.rectangle(x, y, tw, th, {
      restitution: 0.38,
      frictionAir: 0.055,
      density: 0.0012,
      chamfer: { radius: th / 2 },
    });
    Body.setInertia(body, Infinity);
    Body.setAngle(body, 0);
    Body.setVelocity(body, {
      x: Math.sin(i * 1.41) * 0.42,
      y: Math.cos(i * 1.09) * 0.42,
    });
    Composite.add(world, body);
    items.push({ el, body, w: tw, h: th, anchor });

    // Tiny stagger-in transform.
    el.style.opacity = '0';
    el.style.transform = `translate3d(${x - tw / 2}px, ${y - th / 2}px, 0)`;
    setTimeout(() => {
      el.style.transition = 'opacity .6s cubic-bezier(.16,1,.3,1)';
      el.style.opacity = '1';
    }, 80 + i * 40);
  });

  // Mouse drag.
  const mouse = Mouse.create(host);
  const mouseConstraint = MouseConstraint.create(engine, {
    mouse,
    constraint: {
      stiffness: 0.18,
      damping: 0.05,
      render: { visible: false },
    },
  });
  Composite.add(world, mouseConstraint);

  // Allow native page scroll over the stage when the user isn't grabbing a tag.
  // Matter.js by default swallows wheel events on the mouse element.
  // @ts-expect-error mousewheel is non-standard but recognised by Matter.
  if (mouse.element && mouse.mousewheel) {
    // @ts-expect-error see above
    mouse.element.removeEventListener('mousewheel', mouse.mousewheel);
    // @ts-expect-error see above
    mouse.element.removeEventListener('DOMMouseScroll', mouse.mousewheel);
  }

  const runner = Runner.create();
  Runner.run(runner, engine);

  const applySprings = () => {
    for (const it of items) {
      const dx = it.anchor.x - it.body.position.x;
      const dy = it.anchor.y - it.body.position.y;
      const m = it.body.mass;
      Body.applyForce(it.body, it.body.position, {
        x: dx * springK * m,
        y: dy * springK * m,
      });
    }
  };
  Events.on(engine, 'beforeUpdate', applySprings);

  const sync = () => {
    for (const it of items) {
      const px = it.body.position.x - it.w / 2;
      const py = it.body.position.y - it.h / 2;
      it.el.style.transform = `translate3d(${px}px, ${py}px, 0)`;
    }
  };
  Events.on(engine, 'afterUpdate', sync);

  // Resize: re-place walls.
  const ro = new ResizeObserver(() => {
    const nr = host.getBoundingClientRect();
    w = nr.width;
    h = nr.height;
    Body.setPosition(walls[0]!, { x: w / 2, y: -wallThickness / 2 });
    Body.setPosition(walls[1]!, { x: w / 2, y: h + wallThickness / 2 });
    Body.setPosition(walls[2]!, { x: -wallThickness / 2, y: h / 2 });
    Body.setPosition(walls[3]!, { x: w + wallThickness / 2, y: h / 2 });
    items.forEach((it, i) => {
      it.anchor = anchorForIndex(i, n, w, h);
    });
  });
  ro.observe(host);

  return () => {
    ro.disconnect();
    Events.off(engine, 'beforeUpdate', applySprings);
    Events.off(engine, 'afterUpdate', sync);
    Runner.stop(runner);
    World.clear(world, false);
    Engine.clear(engine);
    items.forEach((it) => it.el.remove());
  };
};
