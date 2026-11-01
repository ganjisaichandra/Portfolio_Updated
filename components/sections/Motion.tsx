"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { gsap } from "gsap";
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
    const io = new IntersectionObserver(([e]) => setNear(e.isIntersecting), { rootMargin: "300px" });
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
            progress.current.target = st.progress;
            setCount(Math.min(motionCards.length, 1 + Math.floor(st.progress * motionCards.length)));
          },
        },
      });
      tl.fromTo(".m-line-1", { xPercent: 28 }, { xPercent: -28, ease: "none" }, 0)
        .fromTo(".m-line-2", { xPercent: -28 }, { xPercent: 28, ease: "none" }, 0)
        .fromTo(".motion-bar i", { scaleX: 0 }, { scaleX: 1, ease: "none" }, 0);
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
        <div className="section-label"><span>04</span> Motion</div>
        <p>AI-assisted motion &amp; creatives — scroll to fly through the reel.</p>
      </div>
      <div className="motion-count">
        <span>{String(count).padStart(2, "0")}</span> / {String(motionCards.length).padStart(2, "0")}
        <div className="motion-bar"><i /></div>
      </div>
    </section>
  );
}
