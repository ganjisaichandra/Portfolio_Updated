"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { store } from "@/lib/store";

gsap.registerPlugin(ScrollTrigger);
// mobile browsers resize the viewport when the address bar hides — don't recalculate pins for that
ScrollTrigger.config({ ignoreMobileResize: true });

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Phones scroll on a separate thread, so pinned sections (Hero, Motion) jitter/flash as they
    // lock and unlock. normalizeScroll runs touch scrolling in sync with the animations instead.
    const touch = window.matchMedia("(pointer: coarse)").matches;
    if (touch) ScrollTrigger.normalizeScroll(true);
    const lenis = new Lenis({ lerp: reduce ? 1 : 0.09, smoothWheel: !reduce });
    store.lenis = lenis;
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    lenis.on("scroll", (l: Lenis) => {
      store.velocity = l.velocity;
      ScrollTrigger.update();
    });
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    const onMove = (e: PointerEvent) => {
      store.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      store.mouse.y = -((e.clientY / window.innerHeight) * 2 - 1);
      store.mousePx.x = e.clientX;
      store.mousePx.y = e.clientY;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    // Fonts & images change the page height after load; recalculate every pin when they do.
    let t: ReturnType<typeof setTimeout> | undefined;
    const refresh = () => {
      clearTimeout(t);
      t = setTimeout(() => ScrollTrigger.refresh(), 150);
    };
    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh);
    let lastH = 0;
    const ro = new ResizeObserver(([entry]) => {
      const h = Math.round(entry.contentRect.height);
      if (Math.abs(h - lastH) > 4) { lastH = h; refresh(); }
    });
    ro.observe(document.querySelector("main") ?? document.body);

    return () => {
      gsap.ticker.remove(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("load", refresh);
      ro.disconnect();
      clearTimeout(t);
      if (touch) ScrollTrigger.normalizeScroll(false);
      lenis.destroy();
      store.lenis = null;
    };
  }, []);

  return <>{children}</>;
}
