"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import Magnetic from "../Magnetic";
import Photo from "../Photo";
import { profile } from "@/lib/data";
import { scrollToTarget } from "@/lib/store";

export default function Contact() {
  const root = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".contact-title .ln > span", {
        yPercent: 110, stagger: 0.12, duration: 1.2, ease: "expo.out",
        scrollTrigger: { trigger: ".contact-title", start: "top 80%" },
      });
      gsap.from(".contact-row > *", {
        y: 30, opacity: 0, stagger: 0.1, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: ".contact-row", start: "top 90%" },
      });
    }, root);
    // wordmark rises into place as you reach the very bottom of the page
    const footerCtx = gsap.context(() => {
      gsap.fromTo(
        ".footer-word p",
        { yPercent: 45, opacity: 0.4 },
        { yPercent: 0, opacity: 1, ease: "none", scrollTrigger: { trigger: ".footer", start: "top bottom", end: "bottom bottom", scrub: true } }
      );
    });
    return () => {
      ctx.revert();
      footerCtx.revert();
    };
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <>
      <section id="contact" ref={root} className="section contact">
        <div className="section-label">
          <span>05</span> Contact
        </div>
        <div className="contact-grid">
        <h2 className="contact-title">
          <span className="ln"><span>Have a project</span></span>
          <span className="ln"><span>in mind?</span></span>
          <span className="ln"><span><em>Let&apos;s talk.</em></span></span>
        </h2>
        <div className="contact-photo-wrap">
        <Photo
          src="/images/mountains.png"
          alt="Sai Chandra looking out over misty mountains"
          caption="Off the screen — chasing mist & mountains."
          className="contact-photo"
          sizes="(max-width: 900px) 100vw, 28vw"
        />
        <div className="contact-cta">
          <Magnetic strength={0.5}>
            <a href={`mailto:${profile.email}`} className="big-circle" data-cursor="Say hi">
              Get in<br />touch
            </a>
          </Magnetic>
        </div>
        </div>
        </div>
        <div className="contact-row">
          <button className="email" onClick={copy} data-cursor={copied ? "Copied!" : "Copy"}>
            {profile.email}
            <small>{copied ? "✓ Copied to clipboard" : "Click to copy"}</small>
          </button>
          <div className="socials">
            <Magnetic><a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a></Magnetic>
            <Magnetic><a href={profile.links.behance} target="_blank" rel="noopener noreferrer">Behance ↗</a></Magnetic>
            <Magnetic><a href={profile.links.figma} target="_blank" rel="noopener noreferrer">Figma ↗</a></Magnetic>
            <Magnetic><a href="/resume.pdf" download>Résumé ↓</a></Magnetic>
          </div>
        </div>
      </section>
      <footer className="footer">
        <div className="footer-row">
          <span>© {new Date().getFullYear()} {profile.name}</span>
          <span>Built with Next.js &amp; Three.js</span>
          <button onClick={() => scrollToTarget(0)}>Back to top ↑</button>
        </div>
        {/* Giant faded wordmark, cropped by the bottom edge; a soft spotlight follows the cursor */}
        <div
          className="footer-word"
          aria-hidden="true"
          onPointerMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            e.currentTarget.style.setProperty("--x", `${e.clientX - r.left}px`);
            e.currentTarget.style.setProperty("--y", `${e.clientY - r.top}px`);
          }}
        >
          <p>Sai Chandra</p>
        </div>
      </footer>
    </>
  );
}
