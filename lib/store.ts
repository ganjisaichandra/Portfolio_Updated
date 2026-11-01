import type Lenis from "lenis";

// Mutable, non-reactive store shared between DOM and the WebGL scene.
// Read inside useFrame / rAF loops — never triggers React re-renders.
export const store = {
  mouse: { x: 0, y: 0 }, // normalised -1..1
  mousePx: { x: -9999, y: -9999 }, // CSS pixels
  velocity: 0,
  lenis: null as Lenis | null,
  // Driven by GSAP in the Hero, read by the PixelField shader
  pixel: {
    intro: 1, // 1 = field fully dissolved (before load), 0 = fully built
    dissolve: 0, // scroll: outer cloud breaks apart
    reveal: 0, // scroll: central square fills in
    morph: 0, // scroll: square flies into the inline headline slot
  },
};

export function scrollToTarget(target: string | number) {
  if (store.lenis) store.lenis.scrollTo(target, { duration: 1.6 });
  else if (typeof target === "string") document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
}
