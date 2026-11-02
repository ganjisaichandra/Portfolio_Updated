"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { RibbonProgress } from "../three/MotionRibbon";
import { motionCards } from "@/lib/motionCards";

const MotionRibbon = dynamic(() => import("../three/MotionRibbon"), { ssr: false });

// "Craft in Motion": pinned dark section. The headline halves slide in opposite
// directions while a ribbon of live cards spirals around the viewer in 3D.
export default function Motion() {
  const root = useRef<HTMLElement>(null);
  const progress = useRef<RibbonProgress>({ target: 0, value: 0 });
  const [near, setNear] = useState(false);
  const [count, setCount] = useState(1);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setNear(e.isIntersecting), { rootMargin: "150% 0px" });
    if (root.current) io.observe(root.current);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "+=320%",
          pin: true,
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (st) => {
            setCount(Math.min(motionCards.length, 1 + Math.floor(st.progress * motionCards.length)));
          },
        },
      });
      // slide each line at most 28% of its width, but never past the screen edge (phones)
      const shift = (sel: string) => () => {
        const el = root.current?.querySelector<HTMLElement>(sel);
        if (!el) return 0;
        const w = el.offsetWidth;
        const room = (window.innerWidth - w) / 2 - window.innerWidth * 0.04;
        return Math.max(0, Math.min(28, (room / w) * 100));
      };
      const s1 = shift(".m-line-1"), s2 = shift(".m-line-2");
      tl.fromTo(".m-line-1", { xPercent: () => s1() }, { xPercent: () => -s1(), ease: "none" }, 0)
        .fromTo(".m-line-2", { xPercent: () => -s2() }, { xPercent: () => s2(), ease: "none" }, 0)
        .fromTo(".motion-bar i", { scaleX: 0 }, { scaleX: 1, ease: "none" }, 0);

      // The ribbon starts flying as soon as the section enters the screen (not only once pinned),
      // so cards are already moving in while you scroll towards it.
      const pinEnd = tl.scrollTrigger!;
      ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: () => pinEnd.end,
        invalidateOnRefresh: true,
        onUpdate: (st) => { progress.current.target = st.progress; },
      });
    }, root);

    return () => {
      io.disconnect();
      ctx.revert();
    };
  }, []);

  return (
    <section id="motion" ref={root} className="motion">
      <div className="motion-head" aria-label="Craft in motion">
        <div className="m-line m-line-1" aria-hidden="true">CRAFT IN</div>
        <div className="m-line m-line-2" aria-hidden="true"><em>MOTION</em></div>
      </div>

      <div className="motion-canvas">{near && <MotionRibbon progress={progress.current} />}</div>

      <div className="motion-meta">
        <div className="section-label"><span>05</span> Motion</div>
        <p>AI-assisted motion &amp; creatives — scroll to fly through the reel.</p>
      </div>
      <div className="motion-count">
        <span>{String(count).padStart(2, "0")}</span> / {String(motionCards.length).padStart(2, "0")}
        <div className="motion-bar"><i /></div>
      </div>
    </section>
  );
}
