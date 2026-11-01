"use client";

import dynamic from "next/dynamic";
import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/Cursor";
import Nav from "@/components/Nav";
import Hero from "@/components/sections/Hero";
import Marquee from "@/components/sections/Marquee";
import About from "@/components/sections/About";
import Experience from "@/components/sections/Experience";
import Work from "@/components/sections/Work";
import Motion from "@/components/sections/Motion";
import Skills from "@/components/sections/Skills";
import Contact from "@/components/sections/Contact";

const PixelField = dynamic(() => import("@/components/three/PixelField"), { ssr: false });

export default function Home() {
  return (
    <SmoothScroll>
      <Cursor />
      <PixelField />
      <Nav />
      <main id="top">
        <Hero />
        <Marquee />
        <About />
        <Experience />
        <Work />
        <Motion />
        <Skills />
        <Contact />
      </main>
    </SmoothScroll>
  );
}
