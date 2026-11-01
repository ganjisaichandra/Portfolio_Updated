"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");

  useEffect(() => {
    if (!window.matchMedia("(hover: hover)").matches) return;
    const xDot = gsap.quickTo(dot.current, "x", { duration: 0.1 });
    const yDot = gsap.quickTo(dot.current, "y", { duration: 0.1 });
    const xRing = gsap.quickTo(ring.current, "x", { duration: 0.5, ease: "power3" });
    const yRing = gsap.quickTo(ring.current, "y", { duration: 0.5, ease: "power3" });

    const move = (e: PointerEvent) => {
      xDot(e.clientX); yDot(e.clientY); xRing(e.clientX); yRing(e.clientY);
      document.body.classList.add("has-cursor");
    };
    const over = (e: PointerEvent) => {
      const t = (e.target as HTMLElement).closest<HTMLElement>("a, button, [data-cursor]");
      ring.current?.classList.toggle("hover", !!t);
      setLabel(t?.dataset.cursor ?? "");
    };
    const leave = () => document.body.classList.remove("has-cursor");

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerover", over);
    document.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      document.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <>
      <div ref={dot} className="c-dot" aria-hidden="true" />
      <div ref={ring} className={`c-ring ${label ? "labelled" : ""}`} aria-hidden="true">
        <span>{label}</span>
      </div>
    </>
  );
}
