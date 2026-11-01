"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { projects } from "@/lib/data";

function Visual({ kind }: { kind: string }) {
  if (kind === "fintech")
    return (
      <div className="vis vis-fintech">
        <div className="phone" data-depth="40">
          <div className="ph-top" />
          <div className="ph-chart">
            <svg viewBox="0 0 200 80" preserveAspectRatio="none">
              <defs>
                <linearGradient id="g" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0" stopColor="#c1ead6" stopOpacity=".5" />
                  <stop offset="1" stopColor="#c1ead6" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0 60 L20 52 L40 58 L60 40 L80 45 L100 28 L120 34 L140 18 L160 24 L180 10 L200 14 V80 H0Z" fill="url(#g)" />
              <path className="draw" d="M0 60 L20 52 L40 58 L60 40 L80 45 L100 28 L120 34 L140 18 L160 24 L180 10 L200 14" fill="none" stroke="#c1ead6" strokeWidth="2.5" />
            </svg>
          </div>
          <div className="ph-row" /><div className="ph-row hl" /><div className="ph-row" />
        </div>
        <div className="chip c1" data-depth="80">IPO ↑ 12.4%</div>
        <div className="chip c2" data-depth="60">Wealth ₹ 4.2L</div>
      </div>
    );
  if (kind === "fest")
    return (
      <div className="vis vis-fest">
        <div className="fest-word" data-depth="50">
          <span>TECH</span>
          <span className="o">KRIYA</span>
        </div>
        <div className="ring r1" data-depth="20" />
        <div className="ring r2" data-depth="70" />
      </div>
    );
  return (
    <div className="vis vis-ai">
      <div className="orbs" data-depth="40"><i /><i /><i /></div>
      <div className="prompt" data-depth="80">
        <span>&gt; generate</span> motion_asset --style=brand
      </div>
    </div>
  );
}

export default function Work() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // Desktop: pin the section and scroll the cards horizontally
      mm.add("(min-width: 901px)", () => {
        const el = track.current!;
        const dist = () => el.scrollWidth - window.innerWidth;
        const tween = gsap.to(el, {
          x: () => -dist(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => "+=" + dist(),
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
        // Each card rotates in 3D as it travels across the screen
        gsap.utils.toArray<HTMLElement>(".project").forEach((card) => {
          gsap.fromTo(card, { rotateY: -18, z: -120 }, {
            rotateY: 18, z: -120, ease: "none",
            scrollTrigger: { trigger: card, containerAnimation: tween, start: "left right", end: "right left", scrub: true },
          });
        });
        const bar = root.current!.querySelector(".work-progress i");
        gsap.to(bar, { scaleX: 1, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: () => "+=" + dist(), scrub: true } });
      });

      mm.add("(max-width: 900px)", () => {
        gsap.utils.toArray<HTMLElement>(".project").forEach((card) => {
          gsap.from(card, { y: 80, opacity: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: card, start: "top 85%" } });
        });
      });

      // Draw the chart line when it enters
      gsap.fromTo(".draw", { strokeDasharray: 400, strokeDashoffset: 400 }, { strokeDashoffset: 0, duration: 2, ease: "power2.out", scrollTrigger: { trigger: root.current, start: "top 60%" } });
    }, root);
    return () => ctx.revert();
  }, []);

  // Mouse tilt + parallax layers inside each card
  const onMove = (e: React.PointerEvent<HTMLAnchorElement>) => {
    const card = e.currentTarget;
    const r = card.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    gsap.to(card.querySelector(".project-inner"), { rotateX: -py * 12, rotateY: px * 12, duration: 0.6, ease: "power3.out" });
    card.querySelectorAll<HTMLElement>("[data-depth]").forEach((l) => {
      const d = +l.dataset.depth!;
      gsap.to(l, { x: px * d, y: py * d, duration: 0.8, ease: "power3.out" });
    });
    card.style.setProperty("--mx", `${(px + 0.5) * 100}%`);
    card.style.setProperty("--my", `${(py + 0.5) * 100}%`);
  };
  const onLeave = (e: React.PointerEvent<HTMLAnchorElement>) => {
    const card = e.currentTarget;
    gsap.to(card.querySelector(".project-inner"), { rotateX: 0, rotateY: 0, duration: 1, ease: "elastic.out(1, 0.5)" });
    gsap.to(card.querySelectorAll("[data-depth]"), { x: 0, y: 0, duration: 1, ease: "elastic.out(1, 0.5)" });
  };

  return (
    <section id="work" ref={root} className="work">
      <div className="work-head">
        <div className="section-label">
          <span>03</span> Selected Work
        </div>
        <h2 className="work-title">
          Things I&apos;ve <em>designed</em>
          <br /> &amp; shipped.
        </h2>
        <div className="work-progress"><i /></div>
      </div>
      <div ref={track} className="work-track">
        {projects.map((p, i) => (
          <a
            key={p.title}
            href={p.href}
            target="_blank"
            rel="noopener noreferrer"
            className="project"
            data-cursor="View ↗"
            style={{ ["--accent-c" as string]: p.color }}
            onPointerMove={onMove}
            onPointerLeave={onLeave}
          >
            <div className="project-inner">
              <div className="project-visual">
                <Visual kind={p.visual} />
                <div className="shine" />
              </div>
              <div className="project-info">
                <span className="project-num">0{i + 1}</span>
                <span className="project-kicker">{p.kicker}</span>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
                <div className="project-tags">
                  {p.tags.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </a>
        ))}
        <div className="project-end">
          <p>More on</p>
          <a href="https://www.behance.net/saichandraganji1" target="_blank" rel="noopener noreferrer">Behance ↗</a>
          <a href="https://www.figma.com/@Postify" target="_blank" rel="noopener noreferrer">Figma ↗</a>
        </div>
      </div>
    </section>
  );
}
