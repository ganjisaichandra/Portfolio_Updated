"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { store } from "@/lib/store";

/*
  Full-screen dithered pixel cloud.
  - Outer cloud: animated noise quantised into 4 levels of blue, framed as a vignette.
  - uDissolve breaks the cloud apart cell by cell.
  - uRect is a square (in px) that holds its own scaled-down pixel pattern; it starts
    as a big square in the centre and morphs into the inline slot in the headline.
*/

const fragment = /* glsl */ `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform float uCell;
uniform float uDpr;
uniform float uDissolve;
uniform float uReveal;
uniform vec4 uRect;      // x, y (bottom-left), w, h in device px
uniform vec2 uMouse;     // device px, bottom-left origin
uniform vec3 uBg;      // raw sRGB values (no colour management)

// The five orbs from the palette: strong + light tone of each.
const vec3 S0 = vec3(0.992, 0.443, 0.388); const vec3 L0 = vec3(0.996, 0.753, 0.659); // sunset  #fd7163 / #fec0a8
const vec3 S1 = vec3(0.290, 0.439, 0.925); const vec3 L1 = vec3(0.635, 0.749, 0.914); // electric #4a70ec / #a2bfe9
const vec3 S2 = vec3(0.294, 0.588, 0.886); const vec3 L2 = vec3(0.757, 0.918, 0.839); // aurora  #4b96e2 / #c1ead6
const vec3 S3 = vec3(0.659, 0.733, 0.322); const vec3 L3 = vec3(0.988, 0.761, 0.271); // citrus  #a8bb52 / #fcc245
const vec3 S4 = vec3(0.455, 0.388, 0.671); const vec3 L4 = vec3(0.941, 0.561, 0.686); // dusk    #7463ab / #f08faf

// k in [0,5): blends smoothly around the colour wheel sunset → electric → aurora → citrus → dusk → sunset
void orb(float k, out vec3 s, out vec3 l){
  float f = fract(k); float i = floor(mod(k, 5.0));
  vec3 sa, la, sb, lb;
  if (i < 0.5)      { sa = S0; la = L0; sb = S1; lb = L1; }
  else if (i < 1.5) { sa = S1; la = L1; sb = S2; lb = L2; }
  else if (i < 2.5) { sa = S2; la = L2; sb = S3; lb = L3; }
  else if (i < 3.5) { sa = S3; la = L3; sb = S4; lb = L4; }
  else              { sa = S4; la = L4; sb = S0; lb = L0; }
  f = smoothstep(0.0, 1.0, f);
  s = mix(sa, sb, f); l = mix(la, lb, f);
}

float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  float a = hash(i), b = hash(i + vec2(1,0)), c = hash(i + vec2(0,1)), d = hash(i + vec2(1,1));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(a,b,u.x), mix(c,d,u.x), u.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++){ v += a * noise(p); p = p * 2.03 + 17.1; a *= 0.5; }
  return v;
}

// level 0 = empty, 1 = light dither, 2 = light solid, 3 = strong dither, 4 = strong solid
vec4 shade(float level, vec2 frag, float px, vec3 uSolid, vec3 uLight){
  vec2 c = floor(frag / px);
  float checker = mod(c.x + c.y, 2.0);
  if (level < 0.5) return vec4(0.0);
  if (level < 1.5) return checker > 0.5 ? vec4(uLight, 1.0) : vec4(uBg, 1.0);
  if (level < 2.5) return vec4(uLight, 1.0);
  if (level < 3.5) return checker > 0.5 ? vec4(uSolid, 1.0) : vec4(uLight, 1.0);
  return vec4(uSolid, 1.0);
}

void main(){
  vec2 frag = gl_FragCoord.xy;
  vec2 uv = frag / uRes;
  float t = uTime;

  // ---- inline square (rect) ----
  vec2 rp = (frag - uRect.xy) / uRect.zw;
  if (uRect.z > 1.0 && rp.x >= 0.0 && rp.x <= 1.0 && rp.y >= 0.0 && rp.y <= 1.0){
    vec2 rc = floor(rp * 14.0);
    float n = fbm(rc * 0.22 + vec2(t * 0.25, -t * 0.12));
    float lvl = clamp(floor(n * 5.0 + 0.9), 1.0, 4.0);
    float h = hash(rc + 3.1);
    if (h < uReveal){
      float px = max(uRect.z / 14.0 / 8.0, uDpr);
      vec3 s, l;
      orb((rp.x * 0.6 + rp.y * 0.9 + n * 0.8) * 2.5 + t * 0.15, s, l);
      gl_FragColor = shade(lvl, frag, px, s, l);
      return;
    }
  }

  // ---- outer cloud ----
  vec2 cell = floor(frag / uCell);
  vec2 cuv = (cell + 0.5) * uCell / uRes;
  vec2 q = (cuv - 0.5) * vec2(uRes.x / uRes.y, 1.0);
  float edge = length(q * vec2(0.6, 1.1)) * 2.0;             // 0 centre -> >1 edges
  float warp = fbm(cell * 0.05 - t * 0.04);
  float n = fbm(cell * 0.11 + vec2(t * 0.07, t * 0.04) + warp * 1.6);
  float mask = smoothstep(0.42, 1.3, edge + (warp - 0.5) * 0.45);
  float v = (n - 0.5) * 2.2 + mask * 1.45 - 0.32;

  // cursor makes pixels bloom around it
  vec2 cellCenter = (cell + 0.5) * uCell;
  float md = length(cellCenter - uMouse) / (uCell * 6.0);
  v += 0.55 * exp(-md * md);

  float lvl = clamp(floor(v * 3.2), 0.0, 4.0);
  float h = hash(cell);
  if (h < uDissolve) lvl = 0.0;

  // colour drifts across the screen through all five orbs
  vec3 s, l;
  orb((cuv.x * 0.8 + cuv.y * 0.35 + warp * 0.9) * 5.0 + t * 0.06, s, l);
  gl_FragColor = shade(lvl, frag, 2.0 * uDpr, s, l);
}
`;

const vertex = /* glsl */ `void main(){ gl_Position = vec4(position.xy, 0.0, 1.0); }`;

function rectOf(el: Element | null, dpr: number, h: number) {
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return { x: r.left * dpr, y: (h - r.bottom) * dpr, w: r.width * dpr, h: r.height * dpr };
}
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function Field() {
  const { gl } = useThree();
  const mat = useRef<THREE.ShaderMaterial>(null);
  const initial = useMemo(
    () => ({
      uRes: { value: new THREE.Vector2(1, 1) },
      uTime: { value: 0 },
      uCell: { value: 22 },
      uDpr: { value: 1 },
      uDissolve: { value: 1 },
      uReveal: { value: 0 },
      uRect: { value: new THREE.Vector4(0, 0, 0, 0) },
      uMouse: { value: new THREE.Vector2(-9999, -9999) },
      uBg: { value: new THREE.Vector3(250 / 255, 250 / 255, 248 / 255) }, // off-white #fafaf8
    }),
    []
  );

  useFrame((state) => {
    if (!mat.current) return;
    const uniforms = mat.current.uniforms as typeof initial;
    const dpr = gl.getPixelRatio();
    const w = window.innerWidth;
    const h = window.innerHeight;
    const p = store.pixel;

    uniforms.uRes.value.set(w * dpr, h * dpr);
    uniforms.uDpr.value = dpr;
    uniforms.uCell.value = Math.round((w < 700 ? 16 : 22) * dpr);
    uniforms.uTime.value = state.clock.elapsedTime;
    uniforms.uDissolve.value = Math.max(p.intro, p.dissolve);
    uniforms.uReveal.value = p.reveal;

    // mouse (smoothed)
    const m = uniforms.uMouse.value;
    const tx = store.mousePx.x * dpr;
    const ty = (h - store.mousePx.y) * dpr;
    if (m.x < -9000) m.set(tx, ty);
    else m.set(lerp(m.x, tx, 0.12), lerp(m.y, ty, 0.12));

    // rect: centre square -> inline headline slot (both measured live from the DOM)
    const a = rectOf(document.querySelector(".pixel-anchor"), dpr, h);
    const b = rectOf(document.querySelector(".pixel-slot"), dpr, h);
    if (a && b) {
      const k = easeInOut(p.morph);
      uniforms.uRect.value.set(lerp(a.x, b.x, k), lerp(a.y, b.y, k), lerp(a.w, b.w, k), lerp(a.h, b.h, k));
    }
  });

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial ref={mat} vertexShader={vertex} fragmentShader={fragment} uniforms={initial} transparent depthTest={false} />
    </mesh>
  );
}

export default function PixelField() {
  // Pause the full-screen shader when the hero isn't visible, so it never competes
  // with the Motion ribbon / Skills sphere for the GPU further down the page.
  const [active, setActive] = useState(true);
  useEffect(() => {
    const hero = document.getElementById("hero");
    if (!hero) return;
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { rootMargin: "100px" });
    io.observe(hero);
    return () => io.disconnect();
  }, []);

  return (
    <div className="webgl" aria-hidden="true" style={{ visibility: active ? "visible" : "hidden" }}>
      <Canvas
        frameloop={active ? "always" : "never"}
        dpr={typeof window !== "undefined" && window.innerWidth < 760 ? 1 : [1, 2]}
        resize={{ debounce: { scroll: 0, resize: 200 }, scroll: false }}
        gl={{ antialias: false, alpha: true, premultipliedAlpha: false, powerPreference: "high-performance" }}
        orthographic
        camera={{ position: [0, 0, 1] }}
      >
        <Field />
      </Canvas>
    </div>
  );
}
