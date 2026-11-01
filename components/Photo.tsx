"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";

type Props = {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
  sizes?: string;
};

// Greyscale photo that wipes up into view on scroll, drifts with parallax,
// and blooms into full colour on hover (always colour on touch devices).
export default function Photo({ src, alt, caption, className = "", sizes = "(max-width: 900px) 100vw, 40vw" }: Props) {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".photo-frame",
        { clipPath: "inset(100% 0% 0% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "expo.inOut", scrollTrigger: { trigger: el, start: "top 85%" } }
      );
      // gentle zoom-out anchored to the top edge, so faces/heads are never cropped
      gsap.fromTo(
        ".photo-img",
        { scale: 1.12, transformOrigin: "50% 0%" },
        { scale: 1, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "center center", scrub: true } }
      );
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <figure ref={root} className={`photo ${className}`} data-cursor="Colour">
      <div className="photo-frame">
        <div className="photo-img">
          <Image src={src} alt={alt} fill sizes={sizes} style={{ objectFit: "cover", objectPosition: "50% 0%" }} />
        </div>
      </div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}
