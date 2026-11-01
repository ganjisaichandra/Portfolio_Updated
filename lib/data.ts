export const profile = {
  name: "G. S. V. Sai Chandra",
  short: "Sai Chandra",
  role: "AI Graphic & UI Designer",
  email: "saichandra38ganji@gmail.com",
  links: {
    linkedin: "https://www.linkedin.com/in/ganji-sri-vijaya-sai-chandra/",
    behance: "https://www.behance.net/saichandraganji1",
    figma: "https://www.figma.com/@Postify",
  },
};

export const experience: {
  company: string; role: string; date: string; current?: boolean;
  art: "ai" | "fintech" | "engineering";
  image?: { src: string; alt: string; caption: string };
  points: string[];
}[] = [
  {
    company: "Hawky.ai",
    role: "Creative Strategist",
    date: "Aug 2026 — Present",
    current: true,
    art: "ai",
    points: [
      "Write LLM instructions for AI-driven creative workflows.",
      "Collaborate with Product & Marketing teams on creative concepts.",
      "Create scalable motion graphics using AI-assisted workflows.",
      "Integrate AI-generated creatives and motion assets into Hawky.",
    ],
  },
  {
    company: "Zanskar",
    role: "AI Product Focused UI/UX Designer",
    date: "Jan — Jul 2026",
    art: "fintech",
    points: [
      "Designed mobile, web and tablet experiences for a fintech trading platform — Orders, Wealth Dashboard, IPO, Mutual Funds and Commodities.",
      "Created wireframes, high-fidelity UI, prototypes, reusable design-system components and visual assets with PMs and developers.",
      "Improved user flows, information architecture and dashboards for usability, consistency and engagement.",
    ],
  },
  {
    company: "NIT Andhra Pradesh",
    role: "Mechanical Engineering",
    date: "Graduated 2026",
    art: "engineering",
    image: { src: "/images/graduation.png", alt: "Sai Chandra receiving his degree certificate", caption: "Receiving my degree — NIT Andhra Pradesh, 2026" },
    points: [
      "Led design for the institute's official tech fest website, Techkriya.",
    ],
  },
];

export const projects = [
  {
    title: "Fintech Trading Platform",
    kicker: "Zanskar · Product Design · 2026",
    desc: "Orders, Wealth Dashboard, IPO, Mutual Funds & Commodities across mobile, web and tablet — backed by a reusable design system.",
    tags: ["Product Design", "Design System", "Dashboards"],
    href: profile.links.behance,
    visual: "fintech",
    color: "#3152d0",
  },
  {
    title: "Techkriya Tech Fest",
    kicker: "NIT AP · UI/UX + Dev · 2025",
    desc: "Lead designer for the official tech fest website — hero sections, event cards, navigation flows and interaction animations.",
    tags: ["UI/UX", "Interaction", "Web"],
    href: profile.links.behance,
    visual: "fest",
    color: "#7463ab",
  },
  {
    title: "AI Creative Workflows",
    kicker: "Hawky.ai · AI Motion · 2026",
    desc: "Scalable motion graphics and AI-generated creatives powered by carefully engineered LLM instructions.",
    tags: ["AI", "Motion", "Prompting"],
    href: profile.links.figma,
    visual: "ai",
    color: "#e2574a",
  },
];

export const skills = {
  Design: [
    "Product Design", "UI/UX Design", "User Research", "Wireframing", "Prototyping",
    "Design Systems", "Interaction Design", "Information Architecture", "User Flows",
    "Visual Design", "Responsive Design", "Usability Testing",
  ],
  Tools: [
    "Figma", "FigJam", "Photoshop", "Illustrator", "Canva", "Framer", "Rive",
    "Cursor", "Claude", "Stitch", "Lovable",
  ],
  Development: [
    "HTML", "CSS", "JavaScript", "React.js", "Next.js", "Three.js", "Tailwind CSS", "GitHub", "Vercel",
  ],
};

export const sphereWords = [
  "Figma", "UI/UX", "Three.js", "Next.js", "React", "Framer", "Rive", "Prototyping",
  "Design Systems", "Motion", "Claude", "Cursor", "Photoshop", "Illustrator", "Wireframing",
  "User Research", "Tailwind", "Interaction", "Visual Design", "IA", "Lovable", "FigJam",
  "Canva", "GitHub", "Vercel", "User Flows", "Usability", "Responsive", "Stitch", "AI Workflows",
];
