/*
  Cards shown in the "Craft in Motion" ribbon.
  - Give a card a `video` (e.g. "/videos/hawky-reel.mp4", placed in /public/videos) to play real footage.
  - Without a video, the card renders a live animated design drawn on a canvas (`painter`).
*/

export type Painter = "pixel" | "chart" | "orbs" | "type" | "ui" | "waves";

export const motionCards: { painter: Painter; video?: string }[] = [
  { painter: "type" }, { painter: "chart" }, { painter: "pixel" }, { painter: "orbs" },
  { painter: "ui" }, { painter: "waves" }, { painter: "pixel" }, { painter: "type" },
  { painter: "orbs" }, { painter: "chart" }, { painter: "waves" }, { painter: "ui" },
  { painter: "type" }, { painter: "pixel" }, { painter: "chart" }, { painter: "orbs" },
  { painter: "ui" }, { painter: "waves" }, { painter: "type" }, { painter: "pixel" },
  { painter: "orbs" }, { painter: "chart" }, { painter: "ui" }, { painter: "waves" },
];

// "Five Orbs" palette
const C = {
  paper: "#F3EEE8",
  ink: "#13201F",
  night: "#0B3532",
  coral: "#FF6845", peach: "#FF9478", pink: "#FFC2B0", violet: "#E04E2C",
  haze: "#7DB3AC", cobalt: "#17645F", deep: "#0F4A46",
  sky: "#2C807A", mint: "#CFE3DF", cream: "#F3EEE8",
  amber: "#FFB199", lime: "#2C807A", forest: "#17645F",
  navy: "#0B3532", dviolet: "#2C807A", dpink: "#FF9478", blush: "#FBE0D6",
};

function grad(ctx: CanvasRenderingContext2D, w: number, h: number, stops: [number, string][], angle = 160) {
  const a = (angle * Math.PI) / 180;
  const dx = Math.sin(a) * w * 0.6, dy = -Math.cos(a) * h * 0.6;
  const g = ctx.createLinearGradient(w / 2 - dx, h / 2 - dy, w / 2 + dx, h / 2 + dy);
  stops.forEach(([o, c]) => g.addColorStop(o, c));
  return g;
}

let displayFont = "serif";
export function setDisplayFont(f: string) {
  if (f) displayFont = f;
}

const words = ["Craft", "Motion", "Design", "Systems", "Detail"];

export function paint(kind: Painter, ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  ctx.save();
  switch (kind) {
    case "pixel": {
      // Aurora cream with citrus + aurora pixels
      ctx.fillStyle = C.cream;
      ctx.fillRect(0, 0, w, h);
      const cell = 24;
      for (let y = 0; y < h / cell; y++)
        for (let x = 0; x < w / cell; x++) {
          const n = Math.sin(x * 0.35 + t * 0.9) + Math.cos(y * 0.45 - t * 0.7) + Math.sin((x + y) * 0.18 + t * 0.4);
          if (n > 1.4) ctx.fillStyle = C.forest;
          else if (n > 0.9) ctx.fillStyle = C.lime;
          else if (n > 0.4) ctx.fillStyle = x % 3 === 0 ? C.sky : C.amber;
          else if (n > 0.0) ctx.fillStyle = C.mint;
          else continue;
          ctx.fillRect(x * cell, y * cell, cell, cell);
        }
      break;
    }
    case "chart": {
      // Electric orb with a mint line
      ctx.fillStyle = grad(ctx, w, h, [[0, C.navy], [0.55, C.deep], [1, C.cobalt]], 120);
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = "rgba(255,255,255,0.08)";
      ctx.lineWidth = 1;
      for (let i = 1; i < 6; i++) {
        ctx.beginPath(); ctx.moveTo(0, (h / 6) * i); ctx.lineTo(w, (h / 6) * i); ctx.stroke();
      }
      const prog = (t * 0.25) % 1;
      ctx.beginPath();
      for (let i = 0; i <= 60 * prog; i++) {
        const x = (i / 60) * w;
        const y = h * 0.72 - (i / 60) * h * 0.4 + Math.sin(i * 0.5) * 14 + Math.sin(i * 0.17 + 2) * 18;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = C.mint;
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.fillStyle = "#ffffff";
      ctx.font = `600 34px system-ui, sans-serif`;
      ctx.fillText(`₹ ${(4 + prog * 1.8).toFixed(2)}L`, 30, 56);
      ctx.fillStyle = C.mint;
      ctx.font = `500 20px system-ui, sans-serif`;
      ctx.fillText(`▲ ${(prog * 12.4).toFixed(1)}%`, 30, 86);
      break;
    }
    case "orbs": {
      // Sunset orb with floating electric / aurora / citrus spheres
      ctx.fillStyle = grad(ctx, w, h, [[0, C.peach], [0.45, C.coral], [0.75, C.pink], [1, C.violet]], 165);
      ctx.fillRect(0, 0, w, h);
      const orb = (x: number, y: number, r: number, a: string, b: string) => {
        const g = ctx.createLinearGradient(x, y - r, x, y + r);
        g.addColorStop(0, a); g.addColorStop(1, b);
        ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill();
      };
      orb(w * 0.42 + Math.sin(t) * 40, h * 0.45 + Math.cos(t * 0.8) * 20, h * 0.3, C.amber, C.forest);
      orb(w * 0.62 + Math.cos(t * 0.9) * 50, h * 0.58 + Math.sin(t * 1.1) * 25, h * 0.22, C.haze, C.deep);
      orb(w * 0.5 + Math.sin(t * 1.3 + 1) * 60, h * 0.55, h * 0.13, C.sky, C.cream);
      break;
    }
    case "type": {
      // Dusk orb with kinetic type
      ctx.fillStyle = grad(ctx, w, h, [[0, C.navy], [0.4, C.dviolet], [0.75, C.dpink], [1, C.blush]], 170);
      ctx.fillRect(0, 0, w, h);
      const k = (t * 0.45) % words.length;
      const i = Math.floor(k);
      const f = k - i;
      const ease = f < 0.75 ? 0 : (f - 0.75) / 0.25;
      ctx.font = `italic 140px ${displayFont}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.beginPath(); ctx.rect(0, 0, w, h); ctx.clip();
      ctx.fillStyle = "#ffffff";
      ctx.fillText(words[i], w / 2, h / 2 - ease * h);
      ctx.fillStyle = C.blush;
      ctx.fillText(words[(i + 1) % words.length], w / 2, h / 2 + (1 - ease) * h);
      break;
    }
    case "ui": {
      // Light product UI with cobalt + coral accents
      ctx.fillStyle = C.paper;
      ctx.fillRect(0, 0, w, h);
      const rr = (x: number, y: number, ww: number, hh: number, r: number, c: string | CanvasGradient) => {
        ctx.beginPath(); ctx.roundRect(x, y, ww, hh, r); ctx.fillStyle = c; ctx.fill();
      };
      const s = (t * 0.6) % 1;
      for (let i = 0; i < 4; i++) {
        const y = 30 + i * 70 - s * 70;
        rr(30, y, w * 0.55, 54, 14, i % 2 ? "#EBE4DB" : "#DDD3C7");
        rr(46, y + 16, 80, 10, 5, [C.coral, C.cobalt, C.lime, C.dviolet][i]);
        rr(46, y + 32, 140, 8, 4, "#D8CFC4");
      }
      rr(w * 0.66, 30, w * 0.28, h - 60, 18, grad(ctx, w, h, [[0, C.night], [1, C.navy]], 180));
      const on = Math.sin(t * 2) > 0;
      rr(w * 0.72, h * 0.7, 70, 36, 18, on ? C.coral : "#2A5652");
      ctx.beginPath(); ctx.arc(w * 0.72 + (on ? 52 : 18), h * 0.7 + 18, 13, 0, Math.PI * 2); ctx.fillStyle = "#ffffff"; ctx.fill();
      rr(w * 0.7, 60, w * 0.2, 12, 6, C.mint);
      rr(w * 0.7, 84, w * 0.14, 10, 5, "#2A5652");
      break;
    }
    case "waves": {
      // Night sky with lines in every orb colour
      ctx.fillStyle = C.night;
      ctx.fillRect(0, 0, w, h);
      ctx.lineWidth = 2.5;
      const cols = [C.coral, C.pink, C.violet, C.cobalt, C.sky, C.mint, C.lime, C.amber, C.dpink];
      for (let j = 0; j < 9; j++) {
        ctx.beginPath();
        for (let x = 0; x <= w; x += 8) {
          const y = h / 2 + Math.sin(x * 0.012 + t * 1.4 + j * 0.45) * (20 + j * 7) + (j - 4) * 10;
          if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = cols[j];
        ctx.globalAlpha = 0.55 + j * 0.05;
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      break;
    }
  }
  ctx.restore();
}
