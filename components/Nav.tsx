"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import Magnetic from "./Magnetic";
import { scrollToTarget, store } from "@/lib/store";
import { profile } from "@/lib/data";

const links = [
  ["About", "#about"],
  ["Experience", "#experience"],
  ["Work", "#work"],
  ["Graphics", "#graphics"],
  ["Motion", "#motion"],
  ["Skills", "#skills"],
  ["Contact", "#contact"],
] as const;

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const menu = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? window.scrollY / max : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Full-screen menu: lock scrolling + stagger the links in
  useEffect(() => {
    if (open) {
      store.lenis?.stop();
      document.body.style.overflow = "hidden";
      gsap.fromTo(
        ".menu-link",
        { yPercent: 110 },
        { yPercent: 0, duration: 0.9, stagger: 0.05, ease: "expo.out", delay: 0.15 }
      );
      gsap.fromTo(".menu-foot", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.45, ease: "power3.out" });
    } else {
      store.lenis?.start();
      document.body.style.overflow = "";
    }
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // close the menu if the screen grows to desktop size
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1025px)");
    const onChange = () => mq.matches && setOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const go = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    setOpen(false);
    // wait a tick so scrolling is unlocked before we scroll
    setTimeout(() => scrollToTarget(href), 50);
  };

  return (
    <>
      <header className={`nav ${open ? "open" : ""}`}>
        <div className="nav-pill">
          <a href="#top" className="logo" onClick={(e) => go(e, "#top")} aria-label="Home">
            <span className="logo-mark">SC</span>
          </a>
          <nav className="nav-links" aria-label="Primary">
            {links.slice(0, 6).map(([label, href]) => (
              <a key={href} href={href} onClick={(e) => go(e, href)}>
                {label}
              </a>
            ))}
          </nav>
          <button
            className="menu-btn"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen((o) => !o)}
          >
            <span className="menu-label">{open ? "Close" : "Menu"}</span>
            <span className="menu-icon" aria-hidden="true">
              <i />
              <i />
            </span>
          </button>
          <i className="nav-progress" style={{ transform: `scaleX(${progress})` }} />
        </div>
        <div className="nav-right">
          <Magnetic>
            <a href="#contact" className="nav-cta" onClick={(e) => go(e, "#contact")}>
              Let&apos;s talk
            </a>
          </Magnetic>
          <Magnetic>
            <a href="#contact" className="nav-arrow" aria-label="Contact" onClick={(e) => go(e, "#contact")}>
              →
            </a>
          </Magnetic>
        </div>
      </header>

      {/* Rendered outside the header so nothing can trap its fixed positioning */}
      <div id="site-menu" ref={menu} className={`menu ${open ? "open" : ""}`} aria-hidden={!open}>
        <nav className="menu-list" aria-label="Menu">
          {links.map(([label, href], i) => (
            <a key={href} href={href} onClick={(e) => go(e, href)} tabIndex={open ? 0 : -1}>
              <span className="menu-link">
                <sup>0{i + 1}</sup>
                {label}
              </span>
            </a>
          ))}
        </nav>
        <div className="menu-foot">
          <a href={`mailto:${profile.email}`} tabIndex={open ? 0 : -1}>{profile.email}</a>
          <div>
            <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer" tabIndex={open ? 0 : -1}>LinkedIn ↗</a>
            <a href={profile.links.behance} target="_blank" rel="noopener noreferrer" tabIndex={open ? 0 : -1}>Behance ↗</a>
            <a href="/resume.pdf" download tabIndex={open ? 0 : -1}>Résumé ↓</a>
          </div>
        </div>
      </div>
    </>
  );
}
