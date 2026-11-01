"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { store } from "@/lib/store";

const items = ["Product Design", "UI/UX", "Design Systems", "Motion Graphics", "AI Workflows", "Prototyping", "Three.js"];

// Infinite marquee whose speed & direction react to scroll velocity.
export default function Marquee() {
  const track = useRef<HTMLDivElement>(null);
  const skew = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let x = 0;
    let dir = -1;
    const tick = () => {
      const el = track.current;
      if (!el) return;
      const v = store.velocity;
      if (v > 0.5) dir = -1;
      else if (v < -0.5) dir = 1;
      x += dir * (0.6 + Math.min(Math.abs(v) * 0.25, 12));
      const w = el.scrollWidth / 2;
      if (x <= -w) x += w;
      if (x > 0) x -= w;
      el.style.transform = `translate3d(${x}px,0,0)`;
      if (skew.current) skew.current.style.transform = `skewX(${gsap.utils.clamp(-10, 10, -v * 0.6)}deg)`;
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, []);

  const row = [...items, ...items];
  return (
    <div className="marquee" aria-hidden="true">
      <div ref={skew} className="marquee-skew">
        <div ref={track} className="marquee-track">
          {[...row, ...row].map((t, i) => (
            <span key={i}>
              {t}
              <i>✦</i>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
