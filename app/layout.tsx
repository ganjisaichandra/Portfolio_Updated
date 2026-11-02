import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";

// One family for the whole site: Plus Jakarta Sans (variable weight 200–800, with italics)
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta", style: ["normal", "italic"], display: "swap" });

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
    <html lang="en" className={jakarta.variable}>
      <body>{children}</body>
    </html>
  );
}
