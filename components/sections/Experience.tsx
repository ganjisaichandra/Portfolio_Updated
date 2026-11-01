"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { experience } from "@/lib/data";
import Photo from "../Photo";

// Sticky stacking cards: each card pins, then shrinks & dims as the next slides over it.
export default function Experience() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".job");
      cards.forEach((card, i) => {
        if (i === cards.length - 1) return;
        gsap.to(card.querySelector(".job-inner"), {
          scale: 0.9 - (cards.length - i) * 0.02,
          opacity: 0.35,
          filter: "blur(2px)",
          ease: "none",
          scrollTrigger: { trigger: cards[i + 1], start: "top bottom", end: "top 20%", scrub: true },
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="experience" ref={root} className="section experience">
      <div className="section-label">
        <span>02</span> Experience
      </div>
      <div className="stack">
        {experience.map((job, i) => (
          <article className="job" key={job.company} style={{ top: `calc(14vh + ${i * 28}px)` }}>
            <div className={`job-inner glass ${"image" in job ? "has-photo" : ""}`}>
              <div className="job-text">
              <div className="job-head">
                <span className="job-num">0{i + 1}</span>
                <span className="job-date">{job.date}</span>
                {job.current && <span className="tag-live">● Current</span>}
              </div>
              <h3>
                {job.role}
                <span> @ {job.company}</span>
              </h3>
              <ul>
                {job.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
              </div>
              {"image" in job && job.image && (
                <Photo src={job.image.src} alt={job.image.alt} caption={job.image.caption} className="job-photo" sizes="(max-width: 900px) 100vw, 30vw" />
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
