import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;

function S({ children, ...p }: P & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...p}
    >
      {children}
    </svg>
  );
}

/* ---------------- brand ---------------- */
export const Logo = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M12 2.4c1.9 0 3.4 1.5 3.4 3.4 0 .8-.26 1.5-.7 2.1.6-.44 1.32-.7 2.1-.7 1.9 0 3.4 1.53 3.4 3.4 0 1.9-1.5 3.4-3.4 3.4-.78 0-1.5-.26-2.1-.7.44.6.7 1.32.7 2.1 0 1.9-1.5 3.4-3.4 3.4s-3.4-1.5-3.4-3.4c0-.78.26-1.5.7-2.1-.6.44-1.32.7-2.1.7-1.87 0-3.4-1.5-3.4-3.4 0-1.87 1.53-3.4 3.4-3.4.78 0 1.5.26 2.1.7a3.37 3.37 0 0 1-.7-2.1c0-1.9 1.5-3.4 3.4-3.4Z" />
  </svg>
);

/* ---------------- arrows / chevrons ---------------- */
export const ArrowLeft = (p: P) => (
  <S {...p}>
    <path d="M19 12H5m0 0 6-6m-6 6 6 6" />
  </S>
);
export const ArrowUpRight = (p: P) => (
  <S {...p}>
    <path d="M7 17 17 7m0 0h-8m8 0v8" />
  </S>
);
export const ArrowUp = (p: P) => (
  <S {...p}>
    <path d="M12 19V5m0 0-6 6m6-6 6 6" />
  </S>
);
export const ArrowDown = (p: P) => (
  <S {...p}>
    <path d="M12 5v14m0 0 6-6m-6 6-6-6" />
  </S>
);
export const ChevronDown = (p: P) => (
  <S {...p}>
    <path d="m6 9 6 6 6-6" />
  </S>
);
export const ChevronRight = (p: P) => (
  <S {...p}>
    <path d="m9 6 6 6-6 6" />
  </S>
);
export const Expand = (p: P) => (
  <S {...p}>
    <path d="M14 4h6v6M20 4l-7 7M10 20H4v-6M4 20l7-7" />
  </S>
);

/* ---------------- header ---------------- */
export const Bell = (p: P) => (
  <S {...p}>
    <path d="M18 8.6a6 6 0 1 0-12 0c0 5-2 6.4-2 6.4h16s-2-1.4-2-6.4" />
    <path d="M13.7 19a2 2 0 0 1-3.46 0" />
  </S>
);
export const Mail = (p: P) => (
  <S {...p}>
    <rect x="2.6" y="5" width="18.8" height="14" rx="3.4" />
    <path d="m3.6 8 7.05 4.6a2.5 2.5 0 0 0 2.7 0L20.4 8" />
  </S>
);
export const Search = (p: P) => (
  <S {...p}>
    <circle cx="11" cy="11" r="6.4" />
    <path d="m20 20-3.6-3.6" />
  </S>
);
export const Refresh = (p: P) => (
  <S {...p}>
    <path d="M20.5 12a8.5 8.5 0 1 1-2.6-6.1" />
    <path d="M20.6 4.3v5h-5" />
  </S>
);
export const Plus = (p: P) => (
  <S {...p}>
    <path d="M12 5v14M5 12h14" />
  </S>
);
export const Minus = (p: P) => (
  <S {...p}>
    <path d="M5 12h14" />
  </S>
);
export const Close = (p: P) => (
  <S {...p}>
    <path d="M18 6 6 18M6 6l12 12" />
  </S>
);
export const Check = (p: P) => (
  <S {...p}>
    <path d="m5 12.5 4.6 4.5L19 7.5" />
  </S>
);
export const Gear = (p: P) => (
  <S {...p}>
    <path d="M12.9 2.6h-1.8a1.7 1.7 0 0 0-1.7 1.7 1.7 1.7 0 0 1-2.55 1.47 1.7 1.7 0 0 0-2.32.62l-.9 1.56a1.7 1.7 0 0 0 .62 2.32 1.7 1.7 0 0 1 0 2.94 1.7 1.7 0 0 0-.62 2.32l.9 1.56a1.7 1.7 0 0 0 2.32.62A1.7 1.7 0 0 1 9.4 19.7a1.7 1.7 0 0 0 1.7 1.7h1.8a1.7 1.7 0 0 0 1.7-1.7 1.7 1.7 0 0 1 2.55-1.47 1.7 1.7 0 0 0 2.32-.62l.9-1.56a1.7 1.7 0 0 0-.62-2.32 1.7 1.7 0 0 1 0-2.94 1.7 1.7 0 0 0 .62-2.32l-.9-1.56a1.7 1.7 0 0 0-2.32-.62A1.7 1.7 0 0 1 14.6 4.3a1.7 1.7 0 0 0-1.7-1.7Z" />
    <circle cx="12" cy="12" r="2.6" />
  </S>
);
export const Dots = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
    <circle cx="5.5" cy="12" r="1.7" />
    <circle cx="12" cy="12" r="1.7" />
    <circle cx="18.5" cy="12" r="1.7" />
  </svg>
);

/* ---------------- map / filters ---------------- */
export const Sliders = (p: P) => (
  <S {...p}>
    <path d="M4 8h9m3.5 0H20M4 16h3.5m3 0H20" />
    <circle cx="14.8" cy="8" r="2.1" />
    <circle cx="8.9" cy="16" r="2.1" />
  </S>
);
export const ShieldCheck = (p: P) => (
  <S {...p}>
    <path d="M12 3 5 5.8v5.5c0 4.3 2.9 7.6 7 9.2 4.1-1.6 7-4.9 7-9.2V5.8L12 3Z" />
    <path d="m9.2 11.9 2 2 3.6-3.9" />
  </S>
);
export const Nodes = (p: P) => (
  <S {...p}>
    <circle cx="6" cy="17.5" r="2.4" />
    <circle cx="18.2" cy="6.4" r="2.2" />
    <path d="M8.2 15.7c1.6-1.5 2.1-3.5 2.4-5 .3-1.7 1.3-3 3.3-3.4" />
    <path d="M14.4 17.6h4.8m-2.4-2.4v4.8" />
  </S>
);
export const Pencil = (p: P) => (
  <S {...p}>
    <path d="M16.4 3.9a2.3 2.3 0 0 1 3.3 3.3L7.6 19.3 3 20.6l1.3-4.6L16.4 3.9Z" />
  </S>
);
export const Ruler = (p: P) => (
  <S {...p}>
    <rect x="2.4" y="8.4" width="19.2" height="7.2" rx="2" />
    <path d="M6.6 8.4v2.7m3.6-2.7v3.9m3.6-3.9v2.7m3.6-2.7v3.9" />
  </S>
);
export const Layers = (p: P) => (
  <S {...p}>
    <path d="m12 3.4 8.4 4.1L12 11.6 3.6 7.5 12 3.4Z" />
    <path d="m3.6 12.3 8.4 4.1 8.4-4.1M3.6 16.7l8.4 4.1 8.4-4.1" />
  </S>
);

/* ---------------- charts ---------------- */
export const ChartLine = (p: P) => (
  <S {...p}>
    <path d="M3.5 17.4 9 11.2l3.6 3.3 7.4-8.1" />
    <path d="M20 6.4h-3.6m3.6 0V10" />
  </S>
);
export const ChartBar = (p: P) => (
  <S {...p}>
    <path d="M5 19.5V11m4.7 8.5V5.5m4.6 14v-6m4.7 6V9" />
  </S>
);
export const Calendar = (p: P) => (
  <S {...p}>
    <rect x="3.2" y="5" width="17.6" height="16" rx="3.4" />
    <path d="M3.2 10h17.6M8.2 3v3.6m7.6-3.6v3.6" />
    <circle cx="8.6" cy="14.6" r=".9" fill="currentColor" stroke="none" />
    <circle cx="12" cy="14.6" r=".9" fill="currentColor" stroke="none" />
  </S>
);
export const Funnel = (p: P) => (
  <S {...p}>
    <path d="M3.6 5h16.8l-6.6 7.8v6.3l-3.6 1.9v-8.2L3.6 5Z" />
  </S>
);

/* ---------------- actions ---------------- */
export const Phone = (p: P) => (
  <S {...p}>
    <path d="M8.3 3.7 10 7.2l-1.9 2a11.4 11.4 0 0 0 6.7 6.7l2-1.9 3.5 1.7-.5 3.3c-.2 1-1.1 1.6-2.1 1.4C10.3 19.2 4.8 13.7 3.6 6.3c-.2-1 .4-1.9 1.4-2.1l3.3-.5Z" />
  </S>
);
export const Chat = (p: P) => (
  <S {...p}>
    <path d="M20.4 11.6c0 4.1-3.8 7.4-8.4 7.4-1 0-2-.15-2.9-.44L4 20.2l1.5-3.6A7.05 7.05 0 0 1 3.6 11.6c0-4.1 3.76-7.4 8.4-7.4s8.4 3.3 8.4 7.4Z" />
    <path d="M9.2 11.5h5.6" />
  </S>
);
export const Target = (p: P) => (
  <S {...p}>
    <path d="M14.9 17.6a6.3 6.3 0 1 1 2.9-4" />
    <path d="M13.5 14.6a3.1 3.1 0 1 1 .6-2.3" />
    <path d="M20.4 12a8.4 8.4 0 1 0-3.4 6.7" />
  </S>
);
export const Dollar = (p: P) => (
  <S {...p}>
    <circle cx="12" cy="12" r="8.4" />
    <path d="M14.4 9.4a2.5 2.5 0 0 0-2.4-1.5c-1.4 0-2.4.8-2.4 1.9 0 2.7 5 1.4 5 4.2 0 1.2-1.1 2-2.6 2a2.6 2.6 0 0 1-2.5-1.6M12 6.6v1.3m0 8.2v1.3" />
  </S>
);
export const Sparkles = (p: P) => (
  <S {...p}>
    <path d="M11 4.2 12.4 8 16 9.4 12.4 10.8 11 14.6 9.6 10.8 6 9.4 9.6 8 11 4.2Z" />
    <path d="M17.6 14.2 18.4 16.4 20.6 17.2 18.4 18 17.6 20.2 16.8 18 14.6 17.2 16.8 16.4 17.6 14.2Z" />
  </S>
);
export const Doc = (p: P) => (
  <S {...p}>
    <path d="M13.6 3.4H7.6a2.6 2.6 0 0 0-2.6 2.6v12a2.6 2.6 0 0 0 2.6 2.6h8.8a2.6 2.6 0 0 0 2.6-2.6V8.6l-5.4-5.2Z" />
    <path d="M13.4 3.6v4.6H19M8.8 13.8h6m-6 3.2h3.6" />
  </S>
);
export const Upload = (p: P) => (
  <S {...p}>
    <rect x="3.4" y="3.4" width="17.2" height="17.2" rx="4.4" />
    <path d="M12 16.2V8.6m0 0-2.8 2.8M12 8.6l2.8 2.8" />
  </S>
);
export const Bookmark = (p: P) => (
  <S {...p}>
    <path d="M6.4 4.6h11.2v15.8L12 16.6l-5.6 3.8V4.6Z" />
  </S>
);
export const Bed = (p: P) => (
  <S {...p}>
    <path d="M3 18v-8.5m0 4.5h18m0 4v-6.2a2.3 2.3 0 0 0-2.3-2.3H8.4" />
    <circle cx="6.6" cy="10.6" r="1.7" />
  </S>
);

export const Icons = {
  Logo,
  ArrowLeft,
  ArrowUpRight,
  ArrowUp,
  ArrowDown,
  ChevronDown,
  ChevronRight,
  Expand,
  Bell,
  Mail,
  Search,
  Refresh,
  Plus,
  Minus,
  Close,
  Check,
  Gear,
  Dots,
  Sliders,
  ShieldCheck,
  Nodes,
  Pencil,
  Ruler,
  Layers,
  ChartLine,
  ChartBar,
  Calendar,
  Funnel,
  Phone,
  Chat,
  Target,
  Dollar,
  Sparkles,
  Doc,
  Upload,
  Bookmark,
  Bed,
};
