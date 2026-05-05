// Image-to-image displacement transition (uProgress 0..1).
// Inspired by gl-transitions "directionalwarp" with an additional luminance
// guard so warps follow the displacement texture but never tear past it.

uniform sampler2D uTexA;
uniform sampler2D uTexB;
uniform sampler2D uDisp;
uniform float uProgress;
uniform float uIntensity;
uniform vec2 uResA;     // intrinsic aspect of A
uniform vec2 uResB;     // intrinsic aspect of B
uniform vec2 uPlane;    // current plane size in px

varying vec2 vUv;

// Cover (object-fit: cover) UV for a given image / plane aspect.
vec2 coverUv(vec2 uv, vec2 imageRes, vec2 planeRes) {
  float planeAspect = planeRes.x / max(planeRes.y, 1.0);
  float imageAspect = imageRes.x / max(imageRes.y, 1.0);
  vec2 scale = vec2(1.0);
  if (imageAspect > planeAspect) {
    scale.x = planeAspect / imageAspect;
  } else {
    scale.y = imageAspect / planeAspect;
  }
  return (uv - 0.5) * scale + 0.5;
}

void main() {
  float d = texture2D(uDisp, vUv).r;
  float p = clamp(uProgress, 0.0, 1.0);

  // Asymmetric remap: A pushes out, B pulls in.
  float pa = smoothstep(0.0, 1.0, p + d * uIntensity);
  float pb = smoothstep(0.0, 1.0, p - (1.0 - d) * uIntensity);

  vec2 uvA = coverUv(vUv + vec2(d * uIntensity, 0.0) * pa, uResA, uPlane);
  vec2 uvB = coverUv(vUv - vec2((1.0 - d) * uIntensity, 0.0) * (1.0 - pb), uResB, uPlane);

  vec4 ca = texture2D(uTexA, clamp(uvA, vec2(0.0), vec2(1.0)));
  vec4 cb = texture2D(uTexB, clamp(uvB, vec2(0.0), vec2(1.0)));

  // Accent edge — a thin cyan line marches across the displacement front.
  float edge = smoothstep(0.02, 0.0, abs(d - p));
  vec3 accent = vec3(0.0, 0.9, 1.0) * edge * 0.35 * (1.0 - abs(p - 0.5) * 2.0);

  vec3 mixed = mix(ca.rgb, cb.rgb, smoothstep(0.0, 1.0, p));
  gl_FragColor = vec4(mixed + accent, 1.0);
}
