"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Photo from "../Photo";

const lead =
  "A mechanical engineer turned designer — I care about clarity, consistency and the small interactions that make products feel alive.";
const highlight = new Set(["clarity,", "consistency", "alive."]);

export default function About() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Words light up one by one as you scroll
      gsap.fromTo(
        ".about-lead .w",
        { opacity: 0.12 },
        {
          opacity: 1, stagger: 0.1, ease: "none",
          scrollTrigger: { trigger: ".about-lead", start: "top 80%", end: "bottom 45%", scrub: true },
        }
      );
      gsap.from(".about-body > *", {
        y: 40, opacity: 0, stagger: 0.12, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: ".about-body", start: "top 80%" },
      });
      // Count-up stats
      gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
        const obj = { v: 0 };
        gsap.to(obj, {
          v: +el.dataset.count!, duration: 1.6, ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 90%" },
          onUpdate: () => (el.textContent = Math.round(obj.v) + (obj.v >= +el.dataset.count! ? el.dataset.suffix ?? "" : "")),
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={root} className="section about">
      <div className="section-label">
        <span>01</span> About
      </div>
      <div className="about-grid">
        <Photo
          src="/images/portrait.png"
          alt="Illustrated portrait of Sai Chandra"
          caption="Sai Chandra — AI Graphic & UI Designer"
          className="about-photo"
          sizes="(max-width: 900px) 100vw, 34vw"
        />
        <div className="about-content">
        <h2 className="about-lead">
          {lead.split(" ").map((w, i) => (
            <span key={i} className={`w ${highlight.has(w) ? "hl" : ""}`}>
              {w}{" "}
            </span>
          ))}
        </h2>
        <div className="about-body glass">
          <p>
            I graduated from <strong>NIT Andhra Pradesh</strong> and have since designed fintech trading experiences
            across mobile, web and tablet, built reusable design systems, and now craft AI-driven creatives and motion
            at <strong>Hawky.ai</strong>.
          </p>
          <p>
            I work closely with product managers, marketers and developers — and I write code too (React, Next.js,
            Three.js), so designs ship the way they were imagined.
          </p>
          <div className="stats">
            <div>
              <b data-count="3">0</b>
              <span>Platforms designed for</span>
            </div>
            <div>
              <b data-count="5" data-suffix="+">0</b>
              <span>Fintech modules shipped</span>
            </div>
            <div>
              <b data-count="30" data-suffix="+">0</b>
              <span>Tools &amp; skills in my kit</span>
            </div>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
