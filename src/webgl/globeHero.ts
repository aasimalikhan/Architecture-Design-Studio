import * as THREE from 'three';
import { env, isMobile } from '@/store';

export type GlobeProjectPin = { lat: number; lon: number };

// y-up Three.js: north pole +Y. Longitude east positive.
const latLonToVector3 = (lat: number, lon: number, radius: number) => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
};

/** Equirectangular-style procedural map (2:1) so the globe is never empty while / after loading fails. */
const makeFallbackEarthTexture = (): THREE.CanvasTexture => {
  const W = 1024;
  const H = 512;
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const g = c.getContext('2d');
  if (!g) {
    const t = new THREE.CanvasTexture(document.createElement('canvas'));
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }
  const img = g.createImageData(W, H);
  const d = img.data;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const lon = (x / W) * Math.PI * 2;
      const lat = (y / H - 0.5) * Math.PI;
      const n =
        Math.sin(lon * 3 + lat * 2) * 0.5 +
        Math.sin(lon * 8 + lat * 5) * 0.22 +
        Math.sin(lon * 1.7 - lat * 3) * 0.32 +
        Math.sin(lon * 15 + lat * 11) * 0.08;
      const land = n > 0.12;
      const i = (y * W + x) * 4;
      if (land) {
        const v = 0.55 + n * 0.25;
        d[i] = 35 + v * 55;
        d[i + 1] = 70 + v * 70;
        d[i + 2] = 45 + v * 35;
      } else {
        d[i] = 8;
        d[i + 1] = 22 + n * 18;
        d[i + 2] = 38 + n * 25;
      }
      d[i + 3] = 255;
    }
  }
  g.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.userData = { fallback: true as const };
  return tex;
};

const EARTH_WEBP = '/assets/ui/earth-hero-1024.webp';
const EARTH_JPG = '/assets/ui/earth-atmos-2048.jpg';

export const mountGlobeHero = (host: HTMLElement, pins: GlobeProjectPin[]) => {
  if (env.reduced) {
    host.innerHTML = '<div class="globe-fallback" aria-hidden="true"></div>';
    return () => {
      host.innerHTML = '';
    };
  }

  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'display:block;width:100%;height:100%;';
  host.appendChild(canvas);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  });
  const dpr = isMobile() ? 1 : Math.min(window.devicePixelRatio, 2);
  renderer.setPixelRatio(dpr);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.02;

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 0.12, 2.32);

  const group = new THREE.Group();
  scene.add(group);

  const hemi = new THREE.HemisphereLight(0x6a8caf, 0x0a0a0c, 0.55);
  scene.add(hemi);

  const ambient = new THREE.AmbientLight(0xffffff, 0.12);
  scene.add(ambient);

  const sun = new THREE.DirectionalLight(0xfff4e8, 1.45);
  sun.position.set(3.2, 2.4, 4.2);
  sun.castShadow = true;
  const sm = isMobile() ? 1024 : 2048;
  sun.shadow.mapSize.set(sm, sm);
  sun.shadow.camera.near = 0.4;
  sun.shadow.camera.far = 9;
  sun.shadow.camera.left = -2.2;
  sun.shadow.camera.right = 2.2;
  sun.shadow.camera.top = 2.2;
  sun.shadow.camera.bottom = -2.2;
  sun.shadow.bias = -0.00025;
  sun.shadow.normalBias = 0.02;
  scene.add(sun);
  sun.target.position.set(0, 0, 0);
  scene.add(sun.target);

  const rim = new THREE.DirectionalLight(0x4a9aaa, 0.22);
  rim.position.set(-2.8, -0.6, -1.8);
  rim.castShadow = false;
  scene.add(rim);

  const backdropGeom = new THREE.PlaneGeometry(4.2, 4.2);
  const backdropMat = new THREE.MeshStandardMaterial({
    color: 0x060607,
    roughness: 1,
    metalness: 0,
  });
  const backdrop = new THREE.Mesh(backdropGeom, backdropMat);
  backdrop.position.set(0, 0, -1.42);
  backdrop.receiveShadow = true;
  scene.add(backdrop);

  const sphereGeom = new THREE.SphereGeometry(1, 96, 96);
  const fallbackMap = makeFallbackEarthTexture();
  fallbackMap.anisotropy = renderer.capabilities.getMaxAnisotropy();
  const sphereMat = new THREE.MeshStandardMaterial({
    map: fallbackMap,
    roughness: 0.68,
    metalness: 0.06,
  });

  const loader = new THREE.TextureLoader();
  const applyEarth = (tex: THREE.Texture) => {
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
    const prev = sphereMat.map;
    sphereMat.map = tex;
    sphereMat.needsUpdate = true;
    if (prev?.userData?.fallback) {
      prev.dispose();
    }
  };
  loader.load(
    EARTH_WEBP,
    applyEarth,
    undefined,
    () => {
      loader.load(
        EARTH_JPG,
        applyEarth,
        undefined,
        () => {
          /* keep procedural map */
        }
      );
    }
  );

  const earth = new THREE.Mesh(sphereGeom, sphereMat);
  earth.castShadow = true;
  earth.receiveShadow = true;
  group.add(earth);

  const atmoGeom = new THREE.SphereGeometry(1.04, 64, 64);
  const atmoMat = new THREE.MeshBasicMaterial({
    color: 0x1a4a6a,
    transparent: true,
    opacity: 0.1,
    side: THREE.BackSide,
    depthWrite: false,
  });
  const atmo = new THREE.Mesh(atmoGeom, atmoMat);
  atmo.castShadow = false;
  atmo.receiveShadow = false;
  group.add(atmo);

  const accent = new THREE.Color(0x00e5ff);
  const pinMat = new THREE.MeshStandardMaterial({
    color: accent,
    emissive: accent,
    emissiveIntensity: 1.25,
    roughness: 0.28,
    metalness: 0.22,
  });
  const pinMeshes: THREE.Mesh[] = [];
  const pinRadius = pins.length > 7 ? 0.028 : 0.034;
  for (const o of pins) {
    const geom = new THREE.SphereGeometry(pinRadius, 24, 24);
    const mesh = new THREE.Mesh(geom, pinMat);
    mesh.position.copy(latLonToVector3(o.lat, o.lon, 1.018));
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
    pinMeshes.push(mesh);
  }

  const resize = () => {
    const r = host.getBoundingClientRect();
    const w = Math.max(1, r.width);
    const h = Math.max(1, r.height);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    sun.shadow.camera.updateProjectionMatrix();
  };
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(host);

  let dragging = false;
  let lx = 0;
  let ly = 0;
  const onDown = (e: PointerEvent) => {
    dragging = true;
    lx = e.clientX;
    ly = e.clientY;
    host.setPointerCapture(e.pointerId);
  };
  const onUp = (e: PointerEvent) => {
    dragging = false;
    try {
      host.releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
  };
  const onMove = (e: PointerEvent) => {
    if (!dragging) return;
    const dx = e.clientX - lx;
    const dy = e.clientY - ly;
    lx = e.clientX;
    ly = e.clientY;
    group.rotation.y += dx * 0.005;
    group.rotation.x += dy * 0.003;
    group.rotation.x = Math.max(-0.55, Math.min(0.55, group.rotation.x));
  };
  host.style.touchAction = 'none';
  host.addEventListener('pointerdown', onDown);
  host.addEventListener('pointerup', onUp);
  host.addEventListener('pointerleave', onUp);
  host.addEventListener('pointermove', onMove);

  const clock = new THREE.Clock();
  let raf = 0;
  const tick = () => {
    const t = clock.getElapsedTime();
    if (!dragging) {
      group.rotation.y += isMobile() ? 0.0011 : 0.0017;
    }
    pinMeshes.forEach((m, idx) => {
      const s = 1 + 0.22 * Math.sin(t * 2.3 + idx * 1.4);
      m.scale.setScalar(s);
    });
    renderer.render(scene, camera);
    raf = requestAnimationFrame(tick);
  };
  tick();

  return () => {
    cancelAnimationFrame(raf);
    ro.disconnect();
    host.removeEventListener('pointerdown', onDown);
    host.removeEventListener('pointerup', onUp);
    host.removeEventListener('pointerleave', onUp);
    host.removeEventListener('pointermove', onMove);
    sphereGeom.dispose();
    if (sphereMat.map) sphereMat.map.dispose();
    sphereMat.dispose();
    atmoGeom.dispose();
    atmoMat.dispose();
    backdropGeom.dispose();
    backdropMat.dispose();
    pinMeshes.forEach((m) => m.geometry.dispose());
    pinMat.dispose();
    renderer.dispose();
    canvas.remove();
  };
};
