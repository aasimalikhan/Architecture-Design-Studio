import * as THREE from 'three';
import { env, isMobile } from '@/store';
import { publicUrl } from '@/util/publicUrl';

type Uniforms = {
  uTime: { value: number };
  uTex: { value: THREE.Texture | null };
  uHasTex: { value: number };
  uMouse: { value: THREE.Vector2 };
  uScroll: { value: number };
};

const makeShaderMaterial = (uniforms: Uniforms) =>
  new THREE.ShaderMaterial({
    uniforms,
    vertexShader: `
      varying vec2 vUv;
      varying float vWave;
      uniform float uTime;
      uniform vec2 uMouse;
      uniform float uScroll;

      void main() {
        vUv = uv;
        float t = uTime * 0.55;
        float w =
          sin(uv.x * 11.0 + t * 0.9) * 0.045 +
          sin(uv.y * 14.0 - t * 0.7) * 0.038 +
          sin((uv.x + uv.y) * 9.0 + t * 0.5) * 0.022;
        float mx = (uMouse.x - 0.5) * 0.07;
        float my = (uMouse.y - 0.5) * 0.06;
        vWave = w + mx * 0.5 + my * 0.5 + uScroll * 0.04;
        vec3 pos = position + normal * (vWave * 0.85);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D uTex;
      uniform float uHasTex;
      uniform float uTime;
      varying vec2 vUv;
      varying float vWave;

      float vignette(vec2 uv) {
        vec2 q = uv * 2.0 - 1.0;
        return 1.0 - dot(q, q) * 0.42;
      }

      void main() {
        vec2 uv = vUv + vec2(uMouse.x - 0.5, uMouse.y - 0.5) * 0.014;
        vec3 col = vec3(0.07, 0.075, 0.09);
        if (uHasTex > 0.5) {
          col = texture2D(uTex, uv).rgb;
        } else {
          float n = sin(uv.x * 22.0 + uTime * 0.4) * sin(uv.y * 18.0 - uTime * 0.35);
          col += vec3(0.04, 0.055, 0.07) * (0.5 + n * 0.5);
        }

        col *= 0.36 + 0.64 * vignette(vUv);
        float scan = sin(vUv.y * 420.0 + uTime * 11.0) * 0.028 + 0.97;
        col *= scan;
        float lum = dot(col, vec3(0.25, 0.58, 0.17));
        col = mix(col, vec3(lum), 0.48);
        vec3 accent = vec3(0.0, 0.898, 1.0);
        float glow = pow(max(0.0, 0.55 - length(vUv - vec2(0.35, 0.45))), 2.2);
        col += accent * glow * 0.11;
        col += accent * vWave * 0.22;
        col = mix(col, vec3(0.02, 0.03, 0.04), 0.18);
        gl_FragColor = vec4(col, 1.0);
      }
    `,
  });

const blueprintLines = () => {
  const segs: number[] = [];
  const z = 0.22;
  const span = 4.2;
  const step = 0.28;
  for (let x = -span; x <= span; x += step) {
    segs.push(x, -1.2, z, x, 1.2, z);
  }
  for (let y = -1.2; y <= 1.2; y += step * 1.2) {
    segs.push(-span, y, z, span, y, z);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(segs, 3));
  const m = new THREE.LineBasicMaterial({
    color: 0x00e5ff,
    transparent: true,
    opacity: 0.11,
    depthWrite: false,
  });
  return new THREE.LineSegments(g, m);
};

const grainCloud = (count: number) => {
  const pos = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  for (let i = 0; i < count; i += 1) {
    const u = Math.random() * Math.PI * 2;
    const v = Math.random();
    const r = 0.15 + Math.random() * 1.85;
    pos[i * 3] = Math.cos(u) * r * 1.15;
    pos[i * 3 + 1] = (v - 0.45) * 1.45;
    pos[i * 3 + 2] = Math.sin(u) * 0.55 + 0.15;
    sizes[i] = 0.6 + Math.random() * 1.4;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('aSize', new THREE.Float32BufferAttribute(sizes, 1));
  const m = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
    },
    vertexShader: `
      attribute float aSize;
      uniform float uTime;
      varying float vA;
      void main() {
        vA = 0.35 + 0.65 * sin(uTime * 0.8 + position.x * 4.0 + position.y * 3.0);
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = aSize * (220.0 / -mv.z);
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: `
      varying float vA;
      void main() {
        vec2 c = gl_PointCoord - 0.5;
        float d = 1.0 - smoothstep(0.0, 0.5, length(c) * 2.0);
        vec3 col = mix(vec3(0.7, 0.95, 1.0), vec3(0.0, 0.55, 0.78), 0.55);
        gl_FragColor = vec4(col, d * vA * 0.35);
      }
    `,
  });
  return new THREE.Points(g, m);
};

/**
 * Full-bleed WebGL field for the home typologies strip: textured relief plane,
 * additive grain, blueprint grid, scroll + pointer parallax.
 */
export const mountTagsStageField = (host: HTMLElement, imageUrl?: string) => {
  if (env.reduced) {
    host.classList.add('tags-stage__field--static');
    return () => {
      host.classList.remove('tags-stage__field--static');
    };
  }

  const canvas = document.createElement('canvas');
  canvas.className = 'tags-stage__field-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  host.appendChild(canvas);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: !isMobile(),
    alpha: false,
    powerPreference: 'high-performance',
  });
  const dpr = isMobile() ? 1 : Math.min(window.devicePixelRatio, 2);
  renderer.setPixelRatio(dpr);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setClearColor(0x0a0a0b, 1);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 60);
  camera.position.set(0, 0.05, 1.55);

  const uniforms: Uniforms = {
    uTime: { value: 0 },
    uTex: { value: null },
    uHasTex: { value: 0 },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uScroll: { value: 0 },
  };

  const geo = new THREE.PlaneGeometry(4.2, 1.75, 96, 64);
  const mat = makeShaderMaterial(uniforms);
  const plane = new THREE.Mesh(geo, mat);
  plane.rotation.x = -0.11;
  scene.add(plane);

  const grid = blueprintLines();
  grid.rotation.x = -Math.PI / 2;
  grid.position.set(0, -0.95, 0.12);
  scene.add(grid);

  const nPts = isMobile() ? 480 : 1100;
  const points = grainCloud(nPts);
  points.position.set(0, 0, 0.35);
  scene.add(points);

  const stage = host.closest('.tags-stage');
  const onMove = (e: PointerEvent) => {
    if (!stage) return;
    const r = stage.getBoundingClientRect();
    const x = (e.clientX - r.left) / Math.max(1, r.width);
    const y = (e.clientY - r.top) / Math.max(1, r.height);
    uniforms.uMouse.value.set(
      THREE.MathUtils.clamp(x, 0, 1),
      THREE.MathUtils.clamp(y, 0, 1)
    );
  };
  window.addEventListener('pointermove', onMove, { passive: true });

  if (imageUrl) {
    const loader = new THREE.TextureLoader();
    loader.load(
      publicUrl(imageUrl),
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;
        uniforms.uTex.value = tex;
        uniforms.uHasTex.value = 1;
      },
      undefined,
      () => {
        uniforms.uHasTex.value = 0;
      }
    );
  }

  const ro = new ResizeObserver(() => {
    const { width, height } = host.getBoundingClientRect();
    const w = Math.max(1, Math.floor(width));
    const h = Math.max(1, Math.floor(height));
    renderer.setSize(w, h, false);
    camera.aspect = w / Math.max(h, 1);
    camera.updateProjectionMatrix();
  });
  ro.observe(host);
  const ib = host.getBoundingClientRect();
  renderer.setSize(Math.max(1, Math.floor(ib.width)), Math.max(1, Math.floor(ib.height)), false);
  camera.aspect = Math.max(ib.width / Math.max(ib.height, 1), 0.001);
  camera.updateProjectionMatrix();

  let rafId = 0;
  const loop = () => {
    rafId = requestAnimationFrame(loop);
    const t = performance.now() * 0.001;
    uniforms.uTime.value = t;
    const pm = points.material as THREE.ShaderMaterial;
    if (pm.uniforms.uTime) pm.uniforms.uTime.value = t;
    if (stage) {
      const r = stage.getBoundingClientRect();
      const vh = window.innerHeight;
      const vis = 1 - Math.min(1, Math.max(0, r.top / (vh + r.height)));
      uniforms.uScroll.value = vis;
    }
    plane.rotation.z =
      Math.sin(t * 0.08) * 0.012 + (uniforms.uMouse.value.x - 0.5) * 0.042;
    grid.position.z = 0.1 + Math.sin(t * 0.15) * 0.02;
    renderer.render(scene, camera);
  };
  loop();

  return () => {
    cancelAnimationFrame(rafId);
    window.removeEventListener('pointermove', onMove);
    ro.disconnect();
    mat.dispose();
    geo.dispose();
    grid.geometry.dispose();
    (grid.material as THREE.Material).dispose();
    points.geometry.dispose();
    (points.material as THREE.Material).dispose();
    if (uniforms.uTex.value) uniforms.uTex.value.dispose();
    renderer.dispose();
    canvas.remove();
    host.classList.remove('tags-stage__field--static');
  };
};
