"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { gsap } from "gsap";
import { graphics } from "@/lib/data";
import { store } from "@/lib/store";

// Each design appears twice so the oval always looks full.
const SLOTS = graphics.length * 2;
const TAU = Math.PI * 2;

/*
  "Oval scroll" gallery: cards orbit an ellipse in 3D.
  - spins on its own (auto-scroll)
  - page scrolling pushes it faster in the scroll direction
  - drag / swipe to spin it by hand, with inertia
  - the card at the front is captioned; click any card to open it full screen
*/
export default function Graphics() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLButtonElement | null)[]>([]);
  const [front, setFront] = useState(0);
  const [open, setOpen] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const moved = useRef(0);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let angle = 0; // current rotation of the ring
    let spin = 0; // extra angular velocity from drag inertia / scroll
    let hover = false;
    let visible = false;
    let appear = 0; // 0 -> 1 entrance (cards fan out from the centre)
    let started = false;
    let last = performance.now();
    let raf = 0;
    let frontIdx = -1;
    let dragging = false;
    let lastX = 0;

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      if (started && appear < 1) appear = Math.min(1, appear + dt / 1.6);
      const e = 1 - Math.pow(1 - appear, 3);

      // auto-spin, slowed while hovering so cards are easy to click
      const auto = reduce ? 0 : hover ? 0.05 : 0.16;
      // scrolling adds momentum in the scroll direction
      if (!reduce && !dragging) spin += gsap.utils.clamp(-40, 40, store.velocity) * 0.0009;
      spin *= Math.pow(0.04, dt); // friction
      angle += (auto + spin) * dt + (1 - e) * dt * 2.4;

      const w = el.clientWidth;
      const h = el.clientHeight;
      const mobile = w < 700;
      // phones show each design once; larger screens fill the oval with two rounds
      const n = mobile ? graphics.length : SLOTS;
      const card = cards.current[0]?.offsetHeight ?? 220;
      const rx = (mobile ? w * 0.3 : Math.min(w * 0.4, 620)) * (0.25 + 0.75 * e);
      // tall enough that the front cards pass below the headline instead of over it
      const ry = (mobile ? Math.min(h * 0.3, card * 1.2) : Math.min(h * 0.33, card * 0.5 + 120)) * (0.25 + 0.75 * e);

      let best = 0, bestD = -2;
      for (let i = 0; i < SLOTS; i++) {
        const c = cards.current[i];
        if (!c) continue;
        if (i >= n) { c.style.display = "none"; continue; }
        c.style.display = "";
        const a = angle + (i / n) * TAU;
        const x = Math.cos(a) * rx;
        const y = Math.sin(a) * ry;
        const d = (Math.sin(a) + 1) / 2; // 0 = back of the oval, 1 = front
        const s = 0.52 + 0.5 * d;
        c.style.transform = `translate(-50%, -50%) translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotateY(${(-Math.cos(a) * 24).toFixed(2)}deg) scale(${s.toFixed(3)})`;
        c.style.zIndex = String(Math.round(d * 100));
        c.style.opacity = String(((0.28 + 0.72 * d) * e).toFixed(3));
        c.style.setProperty("--shade", (1 - d).toFixed(3));
        c.tabIndex = d > 0.75 ? 0 : -1;
        if (d > bestD) { bestD = d; best = i % graphics.length; }
      }
      if (best !== frontIdx) { frontIdx = best; setFront(best); }

      if (visible) raf = requestAnimationFrame(frame);
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) {
        if (entry.intersectionRatio > 0.2) started = true;
        last = performance.now();
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(frame);
      }
    }, { threshold: [0, 0.2, 0.4] });
    io.observe(el);
    raf = requestAnimationFrame(frame); // lay the cards out once

    // drag / swipe
    const down = (ev: PointerEvent) => { dragging = true; lastX = ev.clientX; moved.current = 0; };
    const move = (ev: PointerEvent) => {
      if (!dragging) return;
      const dx = ev.clientX - lastX;
      lastX = ev.clientX;
      moved.current += Math.abs(dx);
      angle += dx * 0.006;
      spin = dx * 0.35; // carries on after release
    };
    const up = () => { dragging = false; };
    const enter = () => { hover = true; };
    const leave = () => { hover = false; dragging = false; };
    el.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    el.addEventListener("pointerenter", enter);
    el.addEventListener("pointerleave", leave);

    const ctx = gsap.context(() => {
      gsap.from(".gfx-head > *", {
        y: 40, opacity: 0, stagger: 0.12, duration: 1.1, ease: "power3.out",
        scrollTrigger: { trigger: root.current, start: "top 75%" },
      });
    }, root);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      el.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      el.removeEventListener("pointerenter", enter);
      el.removeEventListener("pointerleave", leave);
      ctx.revert();
    };
  }, []);

  // ----- full-screen viewer -----
  const close = useCallback(() => setOpen(null), []);
  const step = useCallback((dir: number) => setOpen((o) => (o === null ? o : (o + dir + graphics.length) % graphics.length)), []);

  useEffect(() => {
    if (open === null) return;
    store.lenis?.stop();
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      store.lenis?.start();
      document.body.style.overflow = "";
    };
  }, [open, close, step]);

  const g = graphics[front];

  return (
    <section id="graphics" ref={root} className="section gfx">
      <div className="gfx-head">
        <div className="section-label"><span>04</span> AI Graphic Design</div>
        <p className="gfx-sub">Generative visuals for campaigns, products &amp; brands — prompted, art-directed and refined.</p>
      </div>

      <div ref={stage} className="gfx-stage" data-cursor="Drag">
        <h2 className="gfx-title" aria-label="AI Graphic Design">
          <span>AI Graphic</span>
          <em>Design</em>
        </h2>
        {Array.from({ length: SLOTS }, (_, i) => {
          const item = graphics[i % graphics.length];
          return (
            <button
              key={i}
              ref={(n) => { cards.current[i] = n; }}
              className="gfx-card"
              aria-label={`Open ${item.title}`}
              aria-hidden={i >= graphics.length ? true : undefined}
              onClick={() => { if (moved.current < 8) setOpen(i % graphics.length); }}
            >
              <Image src={item.src} alt={item.alt} fill sizes="(max-width: 700px) 45vw, 300px" draggable={false} />
            </button>
          );
        })}
      </div>

      <div className="gfx-caption" aria-live="polite">
        <span className="gfx-count">{String(front + 1).padStart(2, "0")} <i>/ {String(graphics.length).padStart(2, "0")}</i></span>
        <div>
          <h3 key={g.title}>{g.title}</h3>
          <p>{g.kind} · AI generated</p>
        </div>
        <span className="gfx-hint">Drag to spin · click to view</span>
      </div>

      {mounted && open !== null && createPortal(
        <div className="gfx-lightbox" role="dialog" aria-modal="true" aria-label={graphics[open].title} onClick={close}>
          <figure onClick={(e) => e.stopPropagation()}>
            <div className="gfx-lightbox-img">
              <Image src={graphics[open].src} alt={graphics[open].alt} fill sizes="(max-width: 900px) 92vw, 80vh" priority />
            </div>
            <figcaption>
              <span>{String(open + 1).padStart(2, "0")} / {String(graphics.length).padStart(2, "0")}</span>
              <strong>{graphics[open].title}</strong>
              <em>{graphics[open].kind} · AI generated</em>
            </figcaption>
          </figure>
          <button className="gfx-nav prev" aria-label="Previous" onClick={(e) => { e.stopPropagation(); step(-1); }}>←</button>
          <button className="gfx-nav next" aria-label="Next" onClick={(e) => { e.stopPropagation(); step(1); }}>→</button>
          <button className="gfx-close" aria-label="Close" onClick={close}>✕</button>
        </div>,
        document.body
      )}
    </section>
  );
}
