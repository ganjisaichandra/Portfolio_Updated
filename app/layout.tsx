import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";

const display = Instrument_Serif({ subsets: ["latin"], variable: "--font-display", weight: "400", style: ["normal", "italic"] });
const body = Inter({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  title: "G. S. V. Sai Chandra — AI Graphic & UI Designer",
  description:
    "Portfolio of G. S. V. Sai Chandra — AI Graphic & UI Designer crafting product experiences, design systems and AI-driven motion.",
  openGraph: {
    title: "G. S. V. Sai Chandra — AI Graphic & UI Designer",
    description: "Product design, design systems and AI-driven motion.",
    type: "website",
  },
};

export const viewport: Viewport = { themeColor: "#fafaf8" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
