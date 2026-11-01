"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Magnetic from "../Magnetic";
import { scrollToTarget, store } from "@/lib/store";

gsap.registerPlugin(ScrollTrigger);

const headlineA = ["Designing products", "that feel effortless"];
// "▢" marks where the pixel square lands
const headlineB = [["AI", "▢", "Designer"], ["for", "products", "&", "motion"]];

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const p = store.pixel;
    const ctx = gsap.context(() => {
      // ---------- Intro: pixel cloud assembles, headline rises ----------
      gsap.set(".ha .char", { yPercent: 110 });
      gsap.set(".hero-fade", { y: 24, opacity: 0 });
      gsap.set(".hb .txt", { clipPath: "inset(0 100% 0 0)" });
      gsap.set(".hb .tile", { opacity: 0, scale: 1 });

      const intro = gsap.timeline({ delay: 0.15 });
      intro
        .fromTo(p, { intro: 1 }, { intro: 0, duration: 1.8, ease: "power2.out" }, 0)
        .to(".ha .char", { yPercent: 0, duration: 1.1, stagger: 0.018, ease: "expo.out" }, 0.25)
        .to(".hero-fade", { y: 0, opacity: 1, duration: 0.9, stagger: 0.08, ease: "power3.out" }, 0.7);

      // ---------- Scroll: cloud collapses into a square that lands in the new headline ----------
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "+=220%",
          pin: true,
          scrub: 0.8,
        },
      });
      tl.to(".ha .char", { opacity: 0, color: "#b3b3b3", stagger: 0.012, duration: 0.25, ease: "none" }, 0)
        .to(p, { dissolve: 1, duration: 0.45, ease: "power1.in" }, 0.08)
        .to(p, { reveal: 1, duration: 0.3, ease: "none" }, 0.22)
        .to(".hero-actions", { opacity: 0, y: 20, duration: 0.2 }, 0.1)
        .to(p, { morph: 1, duration: 0.45, ease: "none" }, 0.62);

      // each word wipes in behind a small pixel tile
      gsap.utils.toArray<HTMLElement>(".hb .bw").forEach((w, i) => {
        const at = 0.78 + i * 0.05;
        tl.to(w.querySelector(".tile"), { opacity: 1, duration: 0.02 }, at)
          .to(w.querySelector(".txt"), { clipPath: "inset(0 0% 0 0)", duration: 0.16, ease: "power2.out" }, at)
          .fromTo(w.querySelector(".tile"), { left: "0%" }, { left: "100%", duration: 0.16, ease: "power2.out" }, at)
          .to(w.querySelector(".tile"), { scale: 0, opacity: 0, duration: 0.06 }, at + 0.16);
      });
      tl.to({}, { duration: 0.2 }); // hold before unpinning
    }, root);

    return () => {
      ctx.revert();
      Object.assign(p, { intro: 1, dissolve: 0, reveal: 0, morph: 0 });
    };
  }, []);

  return (
    <section id="hero" ref={root} className="hero">
      <div className="hero-stage">
        <div className="pixel-anchor" aria-hidden="true" />

        <h1 className="headline ha" aria-label={headlineA.join(" ")}>
          {headlineA.map((line, li) => (
            <span className="line" key={li} aria-hidden="true">
              {line.split(" ").map((word, wi) => (
                <span className="word" key={wi}>
                  {word.split("").map((c, ci) => (
                    <span className="char-wrap" key={ci}>
                      <span className="char">{c}</span>
                    </span>
                  ))}
                </span>
              ))}
            </span>
          ))}
        </h1>

        <h2 className="headline hb" aria-label="AI Designer for products and motion">
          {headlineB.map((line, li) => (
            <span className="line" key={li} aria-hidden="true">
              {line.map((w, wi) =>
                w === "▢" ? (
                  <span className="pixel-slot" key={wi} />
                ) : (
                  <span className="bw" key={wi}>
                    <span className="txt">{w}</span>
                    <i className="tile" />
                  </span>
                )
              )}
            </span>
          ))}
        </h2>
      </div>

      <p className="hero-sub hero-fade">
        I&apos;m Sai Chandra, crafting intuitive product experiences, design systems and AI-driven motion — from
        first sketch to shipped pixels.
      </p>
      <div className="hero-actions hero-fade">
        <Magnetic>
          <a href="#work" className="btn btn-dark" onClick={(e) => { e.preventDefault(); scrollToTarget("#work"); }}>
            View my work
          </a>
        </Magnetic>
        <Magnetic>
          <a href="/resume.pdf" className="btn btn-light" download>
            Résumé ↓
          </a>
        </Magnetic>
      </div>
    </section>
  );
}
