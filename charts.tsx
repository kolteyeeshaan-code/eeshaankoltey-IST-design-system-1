import { useEffect, useId, useState } from "react";
import { cn } from "../utils/cn";

/* ---------- helpers ---------- */

export function smooth(pts: [number, number][], t = 1) {
  if (pts.length < 2) return "";
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1x = p1[0] + ((p2[0] - p0[0]) / 6) * t;
    const c1y = p1[1] + ((p2[1] - p0[1]) / 6) * t;
    const c2x = p2[0] - ((p3[0] - p1[0]) / 6) * t;
    const c2y = p2[1] - ((p3[1] - p1[1]) / 6) * t;
    d += ` C ${c1x.toFixed(2)} ${c1y.toFixed(2)}, ${c2x.toFixed(2)} ${c2y.toFixed(2)}, ${p2[0].toFixed(2)} ${p2[1].toFixed(2)}`;
  }
  return d;
}

const map = (v: number, w: number, h: number, i: number, n: number, pad = 6): [number, number] => [
  (i / (n - 1)) * w,
  pad + (1 - v / 100) * (h - pad * 2),
];

/* ==========================================================
   TrendArea — Market Price Index / Rate Volatility
   Solid history band + hatched forecast tail with node dot
   ========================================================== */

export function TrendArea({
  history,
  forecast,
  tone = "amber",
  fill = "above",
  height = 96,
  className,
}: {
  history: number[];
  forecast: number[];
  tone?: "amber" | "coral";
  fill?: "above" | "below";
  height?: number;
  className?: string;
}) {
  const uid = useId().replace(/:/g, "");
  const W = 300;
  const H = 100;
  const split = 0.56;
  const hw = W * split;
  const fw = W - hw;

  const hPts = history.map((v, i) => map(v, hw, H, i, history.length, 10));
  const last = hPts[hPts.length - 1];
  const fPts: [number, number][] = [
    last,
    ...forecast.map((v, i) => {
      const p = map(v, fw, H, i + 1, forecast.length + 1, 10);
      return [hw + p[0], p[1]] as [number, number];
    }),
  ];

  const hLine = smooth(hPts);
  const fLine = smooth(fPts);
  const base = fill === "above" ? 2 : H - 2;
  const hArea = `${hLine} L ${last[0]} ${base} L 0 ${base} Z`;
  const fArea = `${fLine} L ${fPts[fPts.length - 1][0]} ${base} L ${last[0]} ${base} Z`;

  const c1 = tone === "amber" ? "#F6D45C" : "#FA6C5D";
  const c2 = tone === "amber" ? "#FBE9A8" : "#FCBFB6";

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      style={{ height }}
      className={cn("w-full overflow-visible", className)}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`g${uid}`} x1="0" y1={fill === "above" ? "1" : "0"} x2="0" y2={fill === "above" ? "0" : "1"}>
          <stop offset="0%" stopColor={c1} stopOpacity="0.55" />
          <stop offset="70%" stopColor={c2} stopOpacity="0.28" />
          <stop offset="100%" stopColor={c2} stopOpacity="0.05" />
        </linearGradient>
        <pattern id={`h${uid}`} width="7" height="7" patternTransform="rotate(-35)" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="0" y2="7" stroke="rgba(22,24,28,0.13)" strokeWidth="0.9" />
        </pattern>
      </defs>

      <path d={hArea} fill={`url(#g${uid})`} />
      <path d={fArea} fill={`url(#h${uid})`} opacity="0.8" />
      <path
        d={hLine}
        fill="none"
        stroke={c1}
        strokeWidth="2.4"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        className="draw"
        style={{ strokeDasharray: 600, strokeDashoffset: 600 }}
      />
      <path
        d={fLine}
        fill="none"
        stroke="rgba(22,24,28,0.22)"
        strokeWidth="1.1"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
      <circle cx={last[0]} cy={last[1]} r="4" fill={c1} stroke="#fff" strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export function AxisLabels({ items, className }: { items: string[]; className?: string }) {
  return (
    <div className={cn("flex justify-between px-0.5 text-[11px] font-light text-[#c2c6cc]", className)}>
      {items.map((l, i) => (
        <span key={i}>{l}</span>
      ))}
    </div>
  );
}

/* ==========================================================
   Gauge — Total Pipeline Volume (% of monthly goal)
   ========================================================== */

export function Gauge({ percent, size = 240 }: { percent: number; size?: number }) {
  const uid = useId().replace(/:/g, "");
  const [p, setP] = useState(0);
  useEffect(() => {
    const t = requestAnimationFrame(() => setP(percent));
    return () => cancelAnimationFrame(t);
  }, [percent]);

  const W = 240;
  const H = 136;
  const cx = W / 2;
  const cy = 124;
  const r = 104;
  const len = Math.PI * r;
  const a = Math.PI * (1 - percent / 100);
  const ex = cx + r * Math.cos(a);
  const ey = cy - r * Math.sin(a);
  const arc = `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`;
  const off = len * (1 - p / 100);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: size }} className="overflow-visible" aria-hidden="true">
      <defs>
        <linearGradient id={`ga${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FBE9A8" />
          <stop offset="45%" stopColor="#F6C94F" />
          <stop offset="100%" stopColor="#EF9A34" />
        </linearGradient>
        <filter id={`gl${uid}`} x="-40%" y="-40%" width="180%" height="200%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
      </defs>

      <path d={arc} fill="none" stroke="rgba(22,24,28,0.05)" strokeWidth="1.2" strokeLinecap="round" />
      <path
        d={arc}
        fill="none"
        stroke={`url(#ga${uid})`}
        strokeWidth="9"
        strokeLinecap="round"
        filter={`url(#gl${uid})`}
        opacity="0.5"
        strokeDasharray={`${len} ${len}`}
        strokeDashoffset={off}
        style={{ transition: "stroke-dashoffset 1.1s cubic-bezier(.16,1,.3,1)" }}
      />
      <path
        d={arc}
        fill="none"
        stroke={`url(#ga${uid})`}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeDasharray={`${len} ${len}`}
        strokeDashoffset={off}
        style={{ transition: "stroke-dashoffset 1.1s cubic-bezier(.16,1,.3,1)" }}
      />
      <g
        style={{
          opacity: p > 0 ? 1 : 0,
          transition: "opacity .5s .5s linear",
        }}
      >
        <circle cx={ex} cy={ey} r="5.5" fill="#EF9A34" opacity="0.28" />
        <circle cx={ex} cy={ey} r="3.4" fill="#EF9A34" />
      </g>
    </svg>
  );
}

/* ==========================================================
   RangeBar — Avg. Closing Time
   ========================================================== */

export function RangeBar({ height = 96 }: { height?: number }) {
  const uid = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 300 100" preserveAspectRatio="none" style={{ height }} className="w-full overflow-visible" aria-hidden="true">
      <defs>
        <linearGradient id={`rb${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F6CE52" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#FBE9A8" stopOpacity="0.04" />
        </linearGradient>
      </defs>
      <rect x="14" y="24" width="272" height="72" rx="4" fill={`url(#rb${uid})`} />
      <line x1="14" y1="24" x2="286" y2="24" stroke="#F0B93F" strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
      <circle cx="14" cy="24" r="4" fill="#F0B93F" vectorEffect="non-scaling-stroke" />
      <circle cx="286" cy="24" r="4" fill="#F0B93F" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

/* ==========================================================
   Sankey — Pipeline Flow
   ========================================================== */

type Node = { label: string; value: string; weight: number; tone?: "amber" | "coral" };

function ribbon(x1: number, y1: number, h1: number, x2: number, y2: number, h2: number) {
  const mx = (x1 + x2) / 2;
  return [
    `M ${x1} ${y1}`,
    `C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`,
    `L ${x2} ${y2 + h2}`,
    `C ${mx} ${y2 + h2}, ${mx} ${y1 + h1}, ${x1} ${y1 + h1}`,
    "Z",
  ].join(" ");
}

export function Sankey({
  sources,
  stages,
  outcomes,
  height = 250,
}: {
  sources: Node[];
  stages: Node[];
  outcomes: Node[];
  height?: number;
}) {
  const uid = useId().replace(/:/g, "");
  const W = 880;
  const H = 260;
  const NW = 116;
  const colX = [0, 382, 764];
  const gap = 22;

  const stack = (nodes: Node[]) => {
    const total = nodes.reduce((s, n) => s + n.weight, 0);
    const space = H - gap * (nodes.length - 1);
    let y = 0;
    return nodes.map((n) => {
      const h = Math.max(38, (n.weight / total) * space);
      const box = { y, h };
      y += h + gap;
      return box;
    });
  };

  const a = stack(sources);
  const b = stack(stages);
  const c = stack(outcomes);

  const flows: { d: string; from: number; to: number; kind: "ab" | "bc" }[] = [];
  sources.forEach((_, i) => {
    stages.forEach((__, j) => {
      const h1 = a[i].h / stages.length;
      const h2 = b[j].h / sources.length;
      flows.push({
        d: ribbon(colX[0] + NW, a[i].y + h1 * j, h1, colX[1], b[j].y + h2 * i, h2),
        from: i,
        to: j,
        kind: "ab",
      });
    });
  });
  stages.forEach((_, i) => {
    outcomes.forEach((__, j) => {
      const h1 = b[i].h / outcomes.length;
      const h2 = c[j].h / stages.length;
      flows.push({
        d: ribbon(colX[1] + NW, b[i].y + h1 * j, h1, colX[2], c[j].y + h2 * i, h2),
        from: i,
        to: j,
        kind: "bc",
      });
    });
  });

  const srcFill = ["#F6CE52", "#B9C8EE", "#C9D5F2"];
  const midY = (arr: { y: number; h: number }[], i: number) => arr[i].y + arr[i].h / 2;
  const dash = `M ${colX[0] + NW} ${midY(a, 0)} C 260 ${midY(a, 0)}, 260 ${midY(b, 0)}, ${colX[1]} ${midY(b, 0)} L ${colX[1] + NW} ${midY(b, 1)} C 640 ${midY(b, 1)}, 640 ${midY(c, 1)}, ${colX[2]} ${midY(c, 1)}`;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid meet"
      style={{ height }}
      className="w-full overflow-visible"
      role="img"
      aria-label="Loan pipeline flow"
    >
      <defs>
        {srcFill.map((f, i) => (
          <linearGradient key={i} id={`f${uid}${i}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={f} stopOpacity="0.55" />
            <stop offset="55%" stopColor={f} stopOpacity="0.22" />
            <stop offset="100%" stopColor="#F6CE52" stopOpacity="0.3" />
          </linearGradient>
        ))}
        <linearGradient id={`fo${uid}0`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#F6CE52" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#F3A94A" stopOpacity="0.42" />
        </linearGradient>
        <linearGradient id={`fo${uid}1`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#F8C6A0" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#FA6C5D" stopOpacity="0.45" />
        </linearGradient>
        <linearGradient id={`n${uid}a`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="62%" stopColor="#FBE3A0" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#F3B740" />
        </linearGradient>
        <linearGradient id={`n${uid}b`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#C9D5F2" stopOpacity="0.75" />
          <stop offset="65%" stopColor="#DCE4F6" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#F3C24C" />
        </linearGradient>
        <linearGradient id={`n${uid}c`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FBD9C4" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#F5C24F" />
        </linearGradient>
        <linearGradient id={`n${uid}d`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FBC7BF" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#FA6C5D" />
        </linearGradient>
      </defs>

      <g>
        {flows.map((f, i) => (
          <path
            key={i}
            d={f.d}
            fill={f.kind === "ab" ? `url(#f${uid}${f.from})` : `url(#fo${uid}${f.to})`}
            className="transition-opacity duration-500 ease-out-expo"
            opacity={f.kind === "ab" ? 0.62 : 0.5}
          />
        ))}
      </g>

      <path
        d={dash}
        fill="none"
        stroke="#E8A93F"
        strokeWidth="1.2"
        strokeDasharray="6 7"
        opacity="0.75"
        className="dash-flow"
        vectorEffect="non-scaling-stroke"
      />

      {sources.map((n, i) => (
        <g key={n.label}>
          <rect x={colX[0]} y={a[i].y} width={NW} height={a[i].h} rx="3" fill={`url(#n${uid}a)`} />
          <text x={colX[0] + 2} y={a[i].y + 18} fontSize="13" fill="#3d4147" fontWeight="400">
            {n.value}
          </text>
          <text x={colX[0] + 2} y={a[i].y + 34} fontSize="12" fill="#a4a9b0" fontWeight="300">
            {n.label}
          </text>
        </g>
      ))}

      {stages.map((n, i) => (
        <g key={n.label}>
          <rect x={colX[1]} y={b[i].y} width={NW} height={b[i].h} rx="3" fill={`url(#n${uid}b)`} />
          <text x={colX[1] + 8} y={b[i].y + 20} fontSize="13" fill="#3d4147" fontWeight="400">
            {n.value}
          </text>
          <text x={colX[1] + 8} y={b[i].y + 36} fontSize="12" fill="#8e949c" fontWeight="300">
            {n.label}
          </text>
        </g>
      ))}

      {outcomes.map((n, i) => (
        <g key={n.label}>
          <rect
            x={colX[2]}
            y={c[i].y}
            width={NW}
            height={c[i].h}
            rx="3"
            fill={`url(#n${uid}${n.tone === "coral" ? "d" : "c"})`}
          />
          <text x={colX[2] + 8} y={c[i].y + 20} fontSize="13" fill="#3d4147" fontWeight="400">
            {n.value}
          </text>
          <text x={colX[2] + 8} y={c[i].y + 36} fontSize="12" fill="#8e949c" fontWeight="300">
            {n.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

/* ==========================================================
   RateCurve — Analytics exponential rate chart
   ========================================================== */

export function RateCurve({
  series,
  months,
  height = 230,
}: {
  series: number[];
  months: string[];
  height?: number;
}) {
  const uid = useId().replace(/:/g, "");
  const W = 560;
  const H = 210;
  const L = 44;
  const R = 26;
  const T = 18;
  const B = 26;
  const maxV = 8;
  const yOf = (v: number) => T + (1 - v / maxV) * (H - T - B);
  const xOf = (i: number) => L + (i / (series.length - 1)) * (W - L - R);
  const pts = series.map((v, i) => [xOf(i), yOf(v)] as [number, number]);
  const line = smooth(pts, 0.7);
  const area = `${line} L ${xOf(series.length - 1)} ${H - B} L ${L} ${H - B} Z`;

  const grid = [8, 4, 1];
  const mk = [
    { i: 1, v: series[1], tone: "#FA6C5D", text: "1,75% E. L.", dir: "down" as const, dy: -34 },
    { i: 3, v: series[3], tone: "#F3C24C", text: "6,91% S. R.", dir: "up" as const, dy: 16 },
  ];
  const endIdx = series.length - 1;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ height }} className="w-full overflow-visible" role="img" aria-label="Rate analytics curve">
      <defs>
        <linearGradient id={`rc${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FA6C5D" />
          <stop offset="62%" stopColor="#F5934A" />
          <stop offset="100%" stopColor="#F5C64D" />
        </linearGradient>
        <linearGradient id={`ra${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F7C24F" stopOpacity="0.32" />
          <stop offset="100%" stopColor="#F7C24F" stopOpacity="0" />
        </linearGradient>
        <filter id={`rg${uid}`} x="-20%" y="-40%" width="140%" height="200%">
          <feGaussianBlur stdDeviation="8" />
        </filter>
      </defs>

      {grid.map((g) => (
        <g key={g}>
          <line
            x1={L}
            y1={yOf(g)}
            x2={W - R}
            y2={yOf(g)}
            stroke="rgba(22,24,28,0.12)"
            strokeWidth="1"
            strokeDasharray="3 4"
          />
          <text x={L - 10} y={yOf(g) + 4} fontSize="11" textAnchor="end" fill="#b6bbc2" fontWeight="300">
            {g.toFixed(2)}%
          </text>
        </g>
      ))}

      <line x1={xOf(endIdx)} y1={T} x2={xOf(endIdx)} y2={H - B} stroke="rgba(22,24,28,0.12)" strokeWidth="1" strokeDasharray="3 4" />

      <path d={area} fill={`url(#ra${uid})`} />
      <path d={line} fill="none" stroke={`url(#rc${uid})`} strokeWidth="7" opacity="0.32" filter={`url(#rg${uid})`} />
      <path
        d={line}
        fill="none"
        stroke={`url(#rc${uid})`}
        strokeWidth="2.6"
        strokeLinecap="round"
        className="draw"
        style={{ strokeDasharray: 900, strokeDashoffset: 900 }}
      />

      {mk.map((m) => (
        <g key={m.i}>
          <line x1={xOf(m.i)} y1={yOf(m.v)} x2={xOf(m.i)} y2={H - B} stroke="rgba(22,24,28,0.1)" strokeWidth="1" strokeDasharray="3 4" />
          <circle cx={xOf(m.i)} cy={yOf(m.v)} r="4" fill={m.tone} stroke="#fff" strokeWidth="1.6" />
        </g>
      ))}

      <circle cx={xOf(endIdx)} cy={yOf(series[endIdx])} r="12" fill="#F7C24F" opacity="0.2" />
      <circle cx={xOf(endIdx)} cy={yOf(series[endIdx])} r="5" fill="#F3B740" stroke="#fff" strokeWidth="1.8" />

      {months.map((m, i) => (
        <text key={m + i} x={xOf(i)} y={H - 6} fontSize="11" textAnchor="middle" fill="#b6bbc2" fontWeight="300">
          {m}
        </text>
      ))}
    </svg>
  );
}

/* ==========================================================
   MiniWave — Prospective Clients / Clients in Processing
   ========================================================== */

export function MiniWave({ series, tone, height = 58 }: { series: number[]; tone: "amber" | "coral"; height?: number }) {
  const uid = useId().replace(/:/g, "");
  const W = 200;
  const H = 62;
  const pts = series.map((v, i) => map(v, W, H, i, series.length, 12));
  const line = smooth(pts);
  const c = tone === "amber" ? "#F3C24C" : "#FA6C5D";
  const mid = pts[Math.floor(pts.length / 2) - 1];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ height }} className="w-full overflow-visible" aria-hidden="true">
      <defs>
        <filter id={`mw${uid}`} x="-20%" y="-60%" width="140%" height="240%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>
      <path d={line} fill="none" stroke={c} strokeWidth="8" opacity="0.28" filter={`url(#mw${uid})`} />
      <path d={line} fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      <circle cx={mid[0]} cy={mid[1]} r="3.6" fill={c} stroke="#fff" strokeWidth="1.4" vectorEffect="non-scaling-stroke" />
      <line x1={mid[0]} y1={mid[1] + 6} x2={mid[0]} y2={H} stroke="rgba(22,24,28,0.14)" strokeWidth="1" strokeDasharray="2 3" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

/* ==========================================================
   RankTrack — Your Rank slider
   ========================================================== */

export function RankTrack({ percent }: { percent: number }) {
  return (
    <div className="relative h-6 w-full select-none" aria-hidden="true">
      <div className="absolute inset-x-0 top-[7px] h-[3px] rounded-full bg-[rgba(22,24,28,0.08)]" />
      <div
        className="absolute top-[7px] left-0 h-[3px] origin-left rounded-full bg-gradient-to-r from-[#FBE39F] to-[#F3C24C] transition-transform duration-[700ms] ease-out-expo"
        style={{ width: "100%", transform: `scaleX(${percent / 100})` }}
      />
      <div className="absolute inset-x-0 top-[12px]">
        <div
          className="w-full transition-transform duration-[700ms] ease-out-expo"
          style={{ transform: `translate3d(${percent}%, 0, 0)`, willChange: "transform" }}
        >
          <svg width="11" height="9" viewBox="0 0 11 9" className="-translate-x-1/2" aria-hidden="true">
            <path d="M5.5 0 11 9H0z" fill="#16181c" />
          </svg>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================
   ShuffleArc — Shuffle Status
   ========================================================== */

export function ShuffleArc({ percent = 26, height = 150 }: { percent?: number; height?: number }) {
  const uid = useId().replace(/:/g, "");
  const W = 320;
  const H = 160;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ height }} className="w-full overflow-visible" aria-hidden="true">
      <defs>
        <linearGradient id={`sa${uid}`} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#FBE9A8" stopOpacity="0.2" />
          <stop offset="60%" stopColor="#F5CE5C" />
          <stop offset="100%" stopColor="#EF9A34" />
        </linearGradient>
        <filter id={`sg${uid}`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>
      <path d="M10 156 C 70 150, 190 132, 250 52 C 272 22, 288 8, 310 2" fill="none" stroke={`url(#sa${uid})`} strokeWidth="9" opacity="0.35" filter={`url(#sg${uid})`} />
      <path d="M10 156 C 70 150, 190 132, 250 52 C 272 22, 288 8, 310 2" fill="none" stroke={`url(#sa${uid})`} strokeWidth="2" strokeLinecap="round" />
      <line x1="60" y1="118" x2="252" y2="118" stroke="rgba(22,24,28,0.14)" strokeWidth="1" strokeDasharray="3 4" />
      <circle cx="60" cy="118" r="4" fill="#F3C24C" />
      <circle cx="252" cy="118" r="4" fill="#EF9A34" />
      <g transform={`translate(${60 + (percent / 100) * 192 - 22}, 84)`}>
        <rect width="46" height="22" rx="11" fill="#F6CE52" />
        <text x="23" y="15" fontSize="11.5" textAnchor="middle" fill="#16181c">
          {percent}%
        </text>
      </g>
    </svg>
  );
}
