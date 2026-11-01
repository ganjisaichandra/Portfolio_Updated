// Role illustrations for the Experience cards — hand-built SVG, animated with CSS (see .art-* in globals.css).

export type ArtKind = "ai" | "fintech";

function AiCreative() {
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label="Illustration: an AI prompt generating creatives and a motion timeline">
      <defs>
        <linearGradient id="ai-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#21225c" />
          <stop offset="1" stopColor="#5a4c96" />
        </linearGradient>
        <radialGradient id="ai-orb" cx="0.35" cy="0.3" r="0.75">
          <stop offset="0" stopColor="#fec0a8" />
          <stop offset="0.45" stopColor="#fd7163" />
          <stop offset="1" stopColor="#b966ac" />
        </radialGradient>
        <linearGradient id="ai-t1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fe9a74" /><stop offset="1" stopColor="#b966ac" /></linearGradient>
        <linearGradient id="ai-t2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#a2bfe9" /><stop offset="1" stopColor="#3152d0" /></linearGradient>
        <linearGradient id="ai-t3" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#edfbda" /><stop offset="1" stopColor="#4b96e2" /></linearGradient>
      </defs>
      <rect width="400" height="300" fill="url(#ai-bg)" />
      <circle cx="330" cy="70" r="90" fill="#f08faf" opacity="0.18" className="art-pulse" />

      {/* AI orb + sparkle */}
      <g className="art-float">
        <circle cx="328" cy="72" r="40" fill="url(#ai-orb)" />
        <path d="M328 52 L333 67 L348 72 L333 77 L328 92 L323 77 L308 72 L323 67 Z" fill="#fff" opacity="0.92" className="art-twinkle" />
      </g>
      <path d="M288 84 C 270 96, 262 100, 252 104" stroke="#f7d2cc" strokeWidth="2" strokeDasharray="4 6" fill="none" className="art-flow" />

      {/* prompt window */}
      <g>
        <rect x="26" y="34" width="232" height="112" rx="14" fill="#fafaf8" />
        <circle cx="44" cy="52" r="4" fill="#fd7163" /><circle cx="57" cy="52" r="4" fill="#fcc245" /><circle cx="70" cy="52" r="4" fill="#a8bb52" />
        <text x="44" y="82" fontSize="11" fill="#7463ab" letterSpacing="1.5">✦ PROMPT</text>
        <text x="44" y="104" fontSize="14" fill="#0b0b14">Create a 6s motion ad…</text>
        <rect x="203" y="93" width="2" height="15" fill="#4a70ec" className="art-blink" />
        <rect x="44" y="118" width="150" height="6" rx="3" fill="#e6e6e1" />
        <rect x="44" y="130" width="96" height="6" rx="3" fill="#e6e6e1" />
      </g>

      {/* generated creatives */}
      <g>
        <g className="art-pop" style={{ animationDelay: "0s" }}>
          <rect x="26" y="162" width="72" height="58" rx="10" fill="url(#ai-t1)" />
          <circle cx="62" cy="191" r="13" fill="#fff" opacity="0.5" />
        </g>
        <g className="art-pop" style={{ animationDelay: "0.35s" }}>
          <rect x="106" y="162" width="72" height="58" rx="10" fill="url(#ai-t2)" />
          <path d="M116 206 L134 188 L148 200 L168 178" stroke="#c1ead6" strokeWidth="3" fill="none" strokeLinecap="round" />
        </g>
        <g className="art-pop" style={{ animationDelay: "0.7s" }}>
          <rect x="186" y="162" width="72" height="58" rx="10" fill="url(#ai-t3)" />
          <rect x="198" y="176" width="40" height="7" rx="3.5" fill="#3152d0" opacity="0.7" />
          <rect x="198" y="189" width="26" height="7" rx="3.5" fill="#3152d0" opacity="0.4" />
        </g>
        <rect x="270" y="162" width="104" height="58" rx="10" fill="none" stroke="#f7d2cc" strokeOpacity="0.45" strokeDasharray="5 5" />
        <text x="322" y="196" fontSize="12" fill="#f7d2cc" textAnchor="middle" opacity="0.8">+ variants</text>
      </g>

      {/* motion timeline */}
      <g>
        <rect x="26" y="234" width="348" height="44" rx="10" fill="#ffffff" fillOpacity="0.08" stroke="#ffffff" strokeOpacity="0.12" />
        <rect x="40" y="245" width="170" height="8" rx="4" fill="#fd7163" opacity="0.85" />
        <rect x="120" y="260" width="210" height="8" rx="4" fill="#4a70ec" opacity="0.85" />
        {[64, 150, 200, 250, 318].map((x, i) => (
          <rect key={x} x={x - 4} y={i % 2 ? 260 : 245} width="8" height="8" fill="#f7d2cc" transform={`rotate(45 ${x} ${i % 2 ? 264 : 249})`} />
        ))}
        <g className="art-playhead">
          <rect x="38" y="230" width="2" height="52" fill="#fcc245" />
          <circle cx="39" cy="230" r="4" fill="#fcc245" />
        </g>
      </g>
    </svg>
  );
}

function Fintech() {
  const candles = [
    [40, 62, 70, 1], [56, 58, 74, 0], [72, 50, 66, 1], [88, 46, 60, 1], [104, 52, 68, 0],
    [120, 40, 56, 1], [136, 36, 50, 1], [152, 42, 58, 0], [168, 30, 46, 1], [184, 24, 40, 1],
  ];
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label="Illustration: a fintech wealth dashboard on a tablet and a trading app on a phone">
      <defs>
        <linearGradient id="fx-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#eef3fd" />
          <stop offset="1" stopColor="#a2bfe9" />
        </linearGradient>
        <linearGradient id="fx-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4a70ec" stopOpacity="0.28" />
          <stop offset="1" stopColor="#4a70ec" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="fx-donut" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#4a70ec" /><stop offset="1" stopColor="#4b96e2" /></linearGradient>
      </defs>
      <rect width="400" height="300" fill="url(#fx-bg)" />
      <circle cx="60" cy="270" r="110" fill="#4a70ec" opacity="0.1" className="art-pulse" />

      {/* tablet: wealth dashboard */}
      <g>
        <rect x="22" y="26" width="258" height="190" rx="16" fill="#ffffff" />
        <text x="40" y="54" fontSize="11" fill="#6f6f7d" letterSpacing="1.2">WEALTH</text>
        <text x="40" y="78" fontSize="22" fill="#0b0b14" fontWeight="600">₹5.32L</text>
        <text x="122" y="78" fontSize="12" fill="#257e3e">▲ 9.1%</text>
        {/* donut */}
        <circle cx="240" cy="64" r="20" fill="none" stroke="#e6e6e1" strokeWidth="8" />
        <circle cx="240" cy="64" r="20" fill="none" stroke="url(#fx-donut)" strokeWidth="8" strokeDasharray="88 126" strokeLinecap="round" transform="rotate(-90 240 64)" className="art-donut" />
        {/* chart */}
        <g transform="translate(0 100)">
          <path d="M36 70 L60 62 L84 66 L108 48 L132 52 L156 36 L180 40 L204 22 L228 26 L262 10 L262 96 L36 96 Z" fill="url(#fx-area)" />
          <path d="M36 70 L60 62 L84 66 L108 48 L132 52 L156 36 L180 40 L204 22 L228 26 L262 10" fill="none" stroke="#3152d0" strokeWidth="2.5" strokeLinejoin="round" className="art-draw" />
          <circle cx="262" cy="10" r="4" fill="#3152d0" className="art-blink" />
        </g>
        {/* tabs */}
        {["Orders", "IPO", "MF", "Commodities"].map((t, i) => (
          <g key={t}>
            <rect x={36 + [0, 58, 98, 136][i]} y="190" width={[50, 32, 30, 84][i]} height="16" rx="8" fill={i === 0 ? "#0e0f2e" : "#f0f0ec"} />
            <text x={36 + [0, 58, 98, 136][i] + [50, 32, 30, 84][i] / 2} y="201.5" fontSize="8.5" textAnchor="middle" fill={i === 0 ? "#fff" : "#2d2d3a"}>{t}</text>
          </g>
        ))}
      </g>

      {/* phone: trading app */}
      <g className="art-float-slow">
        <rect x="262" y="62" width="118" height="222" rx="20" fill="#0e0f2e" />
        <rect x="302" y="70" width="38" height="6" rx="3" fill="#2a2b6e" />
        <text x="276" y="100" fontSize="9" fill="#9a9cc4" letterSpacing="1">NIFTY 50</text>
        <text x="276" y="118" fontSize="15" fill="#fff" fontWeight="600">24,318</text>
        <g transform="translate(0 6)">
          {candles.map(([x, top, bottom, up], i) => {
            const cx = 276 + (x - 40) * 0.58;
            const y0 = 120 + top * 0.55, y1 = 120 + bottom * 0.55;
            return (
              <g key={i} className="art-candle" style={{ animationDelay: `${i * 0.12}s` }}>
                <line x1={cx} y1={y0 - 3} x2={cx} y2={y1 + 3} stroke={up ? "#c1ead6" : "#fc9ba3"} strokeWidth="1" />
                <rect x={cx - 3} y={y0} width="6" height={y1 - y0} rx="1" fill={up ? "#c1ead6" : "#fd7163"} />
              </g>
            );
          })}
        </g>
        <rect x="276" y="186" width="42" height="20" rx="10" fill="#257e3e" />
        <text x="297" y="199.5" fontSize="9" fill="#fff" textAnchor="middle" fontWeight="600">BUY</text>
        <rect x="324" y="186" width="42" height="20" rx="10" fill="#fd7163" />
        <text x="345" y="199.5" fontSize="9" fill="#fff" textAnchor="middle" fontWeight="600">SELL</text>
        {[0, 1, 2].map((r) => (
          <g key={r}>
            <rect x="276" y={218 + r * 18} width="56" height="6" rx="3" fill="#2a2b6e" />
            <rect x={346} y={218 + r * 18} width="20" height="6" rx="3" fill={r === 1 ? "#fc9ba3" : "#c1ead6"} opacity="0.8" />
          </g>
        ))}
      </g>

      {/* design-system components */}
      <g>
        <rect x="22" y="232" width="226" height="50" rx="12" fill="#ffffff" fillOpacity="0.7" />
        <rect x="36" y="248" width="56" height="20" rx="10" fill="#4a70ec" />
        <text x="64" y="261.5" fontSize="9" fill="#fff" textAnchor="middle">Button</text>
        <rect x="104" y="250" width="32" height="16" rx="8" fill="#a8bb52" />
        <circle cx="128" cy="258" r="6" fill="#fff" className="art-toggle" />
        <rect x="148" y="250" width="16" height="16" rx="4" fill="#7463ab" />
        <path d="M151.5 258 L155 261.5 L161 254.5" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" />
        <rect x="176" y="250" width="58" height="16" rx="8" fill="none" stroke="#a2bfe9" />
        <rect x="182" y="256" width="30" height="4" rx="2" fill="#a2bfe9" />
      </g>
    </svg>
  );
}

export default function JobArt({ kind }: { kind: ArtKind }) {
  return (
    <figure className={`job-art job-art-${kind}`}>
      {kind === "ai" ? <AiCreative /> : <Fintech />}
    </figure>
  );
}
