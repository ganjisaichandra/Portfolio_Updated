"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { experience } from "@/lib/data";
import Photo from "../Photo";
import JobArt from "../JobArt";

// Sticky stacking cards: each card pins, then shrinks & dims as the next slides over it.
export default function Experience() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".job-art").forEach((art) => {
        gsap.fromTo(art, { clipPath: "inset(100% 0% 0% 0% round 22px)" }, {
          clipPath: "inset(0% 0% 0% 0% round 22px)", duration: 1.3, ease: "expo.inOut",
          scrollTrigger: { trigger: art, start: "top 85%" },
        });
      });
      gsap.utils.toArray<HTMLElement>(".job-badge").forEach((b) => {
        gsap.fromTo(b, { scale: 0, rotate: -120 }, {
          scale: 1, rotate: 0, duration: 1.2, ease: "back.out(1.6)",
          scrollTrigger: { trigger: b, start: "top 90%" },
        });
      });

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
            <div className="job-inner glass has-photo">
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
              {job.image ? (
                <div className="job-photo-wrap">
                  <Photo src={job.image.src} alt={job.image.alt} caption={job.image.caption} className="job-photo" sizes="(max-width: 900px) 100vw, 30vw" />
                  <JobArt kind={job.art} />
                </div>
              ) : (
                <JobArt kind={job.art} />
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
