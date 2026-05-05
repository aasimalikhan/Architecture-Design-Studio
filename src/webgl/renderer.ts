import * as THREE from 'three';

let renderer: THREE.WebGLRenderer | null = null;

export const getRenderer = (canvas?: HTMLCanvasElement) => {
  if (renderer) return renderer;
  renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  return renderer;
};

export const disposeRenderer = () => {
  renderer?.dispose();
  renderer = null;
};
