"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { gsap } from "gsap";
import { skills } from "@/lib/data";

const SkillSphere = dynamic(() => import("../three/SkillSphere"), { ssr: false });

export default function Skills() {
  const root = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Only mount the second WebGL canvas when the section is near the viewport
    const io = new IntersectionObserver(([e]) => {
      setVisible(e.isIntersecting);
      if (e.isIntersecting) setMounted(true);
    }, { rootMargin: "200px" });
    if (root.current) io.observe(root.current);

    const ctx = gsap.context(() => {
      gsap.from(".skill-group", {
        y: 50, opacity: 0, stagger: 0.15, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: ".skills-list", start: "top 80%" },
      });
    }, root);
    return () => {
      io.disconnect();
      ctx.revert();
    };
  }, []);

  return (
    <section id="skills" ref={root} className="section skills">
      <div className="section-label">
        <span>06</span> Skills &amp; Tools
      </div>
      <div className="skills-grid">
        <div className="sphere-wrap" data-cursor="Drag">
          {mounted && <SkillSphere active={visible} />}
          <p className="sphere-hint">Drag to spin · hover a skill</p>
        </div>
        <div className="skills-list">
          {Object.entries(skills).map(([group, items]) => (
            <div className="skill-group" key={group}>
              <h4>{group}</h4>
              <ul className="chips">
                {items.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
