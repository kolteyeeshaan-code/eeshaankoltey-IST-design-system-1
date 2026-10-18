import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { cn } from "../utils/cn";
import { ArrowUpRight, ChevronDown, Check, Close } from "./icons";

/* ============================ Card ============================ */

export function Card({
  className,
  variant = "plain",
  children,
  ...rest
}: {
  className?: string;
  variant?: "plain" | "cream" | "flat";
  children: ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative rounded-[24px] gpu",
        variant === "plain" && "surface",
        variant === "cream" && "surface-cream",
        variant === "flat" && "surface-flat",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

export function CardHead({
  title,
  sub,
  right,
  className,
  compact,
}: {
  title: string;
  sub?: string;
  right?: ReactNode;
  className?: string;
  compact?: boolean;
}) {
  return (
    <div className={cn("flex items-start justify-between gap-3", className)}>
      <div className="min-w-0">
        <h3
          className={cn(
            "truncate font-medium tracking-[-0.01em] text-ink",
            compact ? "text-[14px]" : "text-[15.5px]",
          )}
        >
          {title}
        </h3>
        {sub && <p className="mt-0.5 truncate text-[12.5px] font-light text-muted">{sub}</p>}
      </div>
      {right && <div className="flex shrink-0 items-center gap-2">{right}</div>}
    </div>
  );
}

/* ============================ Buttons ============================ */

export function RoundBtn({
  icon,
  label,
  onClick,
  size = 40,
  className,
  tone = "outline",
}: {
  icon?: ReactNode;
  label: string;
  onClick?: () => void;
  size?: number;
  className?: string;
  tone?: "outline" | "solid" | "soft" | "ghost";
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      style={{ width: size, height: size }}
      className={cn(
        "press inline-flex shrink-0 items-center justify-center rounded-full",
        tone === "outline" &&
          "border border-[rgba(22,24,28,0.12)] bg-white/50 text-ink hover:bg-white",
        tone === "solid" && "bg-ink text-white shadow-[0_8px_20px_-8px_rgba(22,24,28,0.7)]",
        tone === "soft" && "bg-[rgba(22,24,28,0.045)] text-ink-2 hover:bg-[rgba(22,24,28,0.09)]",
        tone === "ghost" && "text-ink-2 hover:bg-[rgba(22,24,28,0.06)] hover:text-ink",
        className,
      )}
    >
      <span
        className="pointer-events-none flex items-center justify-center"
        style={{ width: size * 0.42, height: size * 0.42 }}
      >
        {icon ?? <ArrowUpRight width="100%" height="100%" />}
      </span>
    </button>
  );
}

export function PillBtn({
  children,
  onClick,
  tone = "soft",
  className,
  icon,
  active,
}: {
  children: ReactNode;
  onClick?: () => void;
  tone?: "soft" | "dark" | "ghost" | "white";
  className?: string;
  icon?: ReactNode;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "press inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-normal whitespace-nowrap",
        tone === "soft" && "bg-white/55 text-ink-2 hover:bg-white hover:text-ink",
        tone === "white" && "bg-white text-ink shadow-[0_2px_10px_-4px_rgba(22,24,28,0.2)]",
        tone === "dark" && "bg-ink text-white shadow-[0_10px_24px_-12px_rgba(22,24,28,0.9)]",
        tone === "ghost" && "text-ink-2 hover:text-ink",
        active && "bg-ink text-white",
        className,
      )}
    >
      {icon && <span className="h-4 w-4 [&>svg]:h-full [&>svg]:w-full">{icon}</span>}
      {children}
    </button>
  );
}

/* ============================ Badge ============================ */

export type Tone = "amber" | "coral" | "neutral" | "mint" | "plain";

export function Badge({
  children,
  tone = "neutral",
  dot,
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  dot?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-[5px] text-[12px] leading-none font-normal whitespace-nowrap",
        tone === "amber" && "bg-amber text-ink",
        tone === "coral" && "bg-coral text-white",
        tone === "neutral" && "bg-[rgba(22,24,28,0.055)] text-ink-2",
        tone === "mint" && "bg-mint text-[#2f4a39]",
        tone === "plain" && "text-ink-2",
        className,
      )}
    >
      {dot && (
        <i
          className={cn(
            "h-[6px] w-[6px] shrink-0 rounded-full",
            tone === "amber" && "bg-amber",
            tone === "coral" && "bg-coral",
            tone === "neutral" && "bg-faint",
            tone === "mint" && "bg-[#7bb694]",
          )}
        />
      )}
      {children}
    </span>
  );
}

export function StageDot({ tone }: { tone: Tone }) {
  return (
    <i
      className={cn(
        "h-[7px] w-[7px] shrink-0 rounded-full",
        tone === "amber" && "bg-amber",
        tone === "coral" && "bg-coral",
        tone === "mint" && "bg-[#7bb694]",
        (tone === "neutral" || tone === "plain") && "bg-faint",
      )}
    />
  );
}

/* ============================ BigStat ============================ */

/** Two-tone numeral: integer part in ink, fraction in faint grey — exactly as the mockups. */
export function BigStat({
  prefix,
  value,
  unit,
  size = 56,
  className,
  light,
}: {
  prefix?: string;
  value: string;
  unit?: string;
  size?: number;
  className?: string;
  light?: boolean;
}) {
  const m = value.match(/^([^.,]*[.,])(.*)$/);
  const head = m ? m[1] : value;
  const tail = m ? m[2] : "";
  return (
    <span className={cn("inline-flex items-start leading-none", className)}>
      {prefix && (
        <span
          className={cn("font-light", light ? "text-white/80" : "text-ink-2")}
          style={{ fontSize: size * 0.3, marginTop: size * 0.14, marginRight: size * 0.045 }}
        >
          {prefix}
        </span>
      )}
      <span
        className={cn("font-light tracking-[-0.045em]", light ? "text-white" : "text-ink")}
        style={{ fontSize: size, lineHeight: 0.92 }}
      >
        {head}
        <span className={light ? "text-white/55" : "text-[#c6cad0]"}>{tail}</span>
      </span>
      {unit && (
        <span
          className={cn("font-light", light ? "text-white/55" : "text-[#c6cad0]")}
          style={{ fontSize: size * 0.34, marginTop: size * 0.45, marginLeft: size * 0.02 }}
        >
          {unit}
        </span>
      )}
    </span>
  );
}

export function Trend({ dir, className }: { dir: "up" | "down"; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-label={dir === "up" ? "trending up" : "trending down"}
      className={cn("h-4 w-4", dir === "up" ? "text-amber" : "text-coral", className)}
    >
      {dir === "up" ? <path d="M12 19V5m0 0-5 5m5-5 5 5" /> : <path d="M12 5v14m0 0 5-5m-5 5-5-5" />}
    </svg>
  );
}

/* ============================ Dropdown ============================ */

export function Dropdown({
  label,
  value,
  options,
  onChange,
  className,
  align = "left",
  tone = "soft",
}: {
  label?: string;
  value: string;
  options: readonly string[];
  onChange: (v: string) => void;
  className?: string;
  align?: "left" | "right";
  tone?: "soft" | "outline";
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "press inline-flex w-full items-center gap-1.5 rounded-full px-4 py-2.5 text-[13px] whitespace-nowrap",
          tone === "soft" ? "bg-white/55 hover:bg-white" : "border border-[rgba(22,24,28,0.1)] bg-white/40 hover:bg-white",
        )}
      >
        {label && <span className="font-light text-muted">{label}:</span>}
        <span className="text-ink">{value}</span>
        <ChevronDown
          className="ml-auto h-4 w-4 shrink-0 text-ink-2 transition-transform duration-[450ms] ease-out-expo"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>

      {open && (
        <ul
          id={id}
          role="listbox"
          className={cn(
            "anim-pop absolute z-50 mt-2 min-w-full origin-top overflow-hidden rounded-[18px] border border-white/80 bg-white/95 p-1.5 shadow-[0_24px_60px_-20px_rgba(22,24,28,0.35)] backdrop-blur-xl",
            align === "right" ? "right-0" : "left-0",
          )}
        >
          {options.map((o) => (
            <li key={o}>
              <button
                type="button"
                role="option"
                aria-selected={o === value}
                onClick={() => {
                  onChange(o);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center gap-2 rounded-[13px] px-3 py-2 text-left text-[13px] whitespace-nowrap transition-colors duration-200",
                  o === value ? "bg-[rgba(22,24,28,0.055)] text-ink" : "text-ink-2 hover:bg-[rgba(22,24,28,0.035)]",
                )}
              >
                <Check
                  className={cn("h-3.5 w-3.5 shrink-0", o === value ? "opacity-100" : "opacity-0")}
                />
                {o}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ============================ Tabs ============================ */

export function UnderlineTabs<T extends string>({
  tabs,
  value,
  onChange,
  className,
}: {
  tabs: readonly T[];
  value: T;
  onChange: (t: T) => void;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-5", className)} role="tablist">
      {tabs.map((t) => (
        <button
          key={t}
          role="tab"
          aria-selected={t === value}
          type="button"
          onClick={() => onChange(t)}
          className={cn(
            "relative pb-1.5 text-[13px] whitespace-nowrap transition-colors duration-[350ms] ease-out-expo",
            t === value ? "text-ink" : "text-muted hover:text-ink-2",
          )}
        >
          {t}
          <span
            className="absolute inset-x-0 bottom-0 h-[1.5px] origin-left rounded-full bg-ink transition-transform duration-[450ms] ease-out-expo"
            style={{ transform: t === value ? "scaleX(1)" : "scaleX(0)" }}
          />
        </button>
      ))}
    </div>
  );
}

/* ============================ Toast ============================ */

type ToastMsg = { id: number; text: string; icon?: "check" | "star" };
const ToastCtx = createContext<(text: string, icon?: "check" | "star") => void>(() => {});
export const useToast = () => useContext(ToastCtx);

export function ToastHost({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastMsg[]>([]);
  const seq = useRef(0);

  const push = useCallback((text: string, icon: "check" | "star" = "check") => {
    const id = ++seq.current;
    setItems((prev) => [...prev.slice(-2), { id, text, icon }]);
    window.setTimeout(() => setItems((prev) => prev.filter((i) => i.id !== id)), 2600);
  }, []);

  const ctx = useMemo(() => push, [push]);

  return (
    <ToastCtx.Provider value={ctx}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[90] flex flex-col items-center gap-2 px-4">
        {items.map((t) => (
          <div
            key={t.id}
            role="status"
            className="anim-toast gpu flex items-center gap-2.5 rounded-full bg-ink/95 py-2.5 pr-5 pl-3 text-[13px] text-white shadow-[0_20px_50px_-18px_rgba(22,24,28,0.9)] backdrop-blur-xl"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber text-ink">
              <Check className="h-3 w-3" strokeWidth={2.6} />
            </span>
            {t.text}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

/* ============================ Modal ============================ */

export function Modal({
  open,
  onClose,
  title,
  sub,
  children,
  footer,
  width = 520,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  sub?: string;
  children: ReactNode;
  footer?: ReactNode;
  width?: number;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-6">
      <div
        className="anim-veil absolute inset-0 bg-[rgba(22,24,28,0.3)] backdrop-blur-[6px]"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        style={{ maxWidth: width, willChange: "transform, opacity" }}
        className="anim-pop gpu relative max-h-[86vh] w-full overflow-hidden rounded-[28px] border border-white/80 bg-white/90 shadow-[0_40px_90px_-30px_rgba(22,24,28,0.5)] backdrop-blur-2xl"
      >
        <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-4">
          <div>
            <h2 className="text-[19px] font-medium tracking-[-0.02em] text-ink">{title}</h2>
            {sub && <p className="mt-0.5 text-[13px] font-light text-muted">{sub}</p>}
          </div>
          <RoundBtn icon={<Close />} label="Close" onClick={onClose} size={34} tone="soft" />
        </div>
        <div className="scroll-thin max-h-[58vh] overflow-y-auto px-6 pb-2">{children}</div>
        {footer && <div className="flex justify-end gap-2 px-6 py-5">{footer}</div>}
      </div>
    </div>
  );
}

/* ============================ Avatar ============================ */

export function Avatar({
  src,
  name,
  size = 32,
  ring,
  className,
}: {
  src: string;
  name: string;
  size?: number;
  ring?: boolean;
  className?: string;
}) {
  return (
    <span
      style={{ width: size, height: size }}
      className={cn(
        "relative inline-block shrink-0 overflow-hidden rounded-full bg-[rgba(22,24,28,0.07)]",
        ring && "ring-2 ring-white",
        className,
      )}
    >
      <img
        src={src}
        alt={name}
        loading="lazy"
        decoding="async"
        width={size}
        height={size}
        className="h-full w-full object-cover"
      />
    </span>
  );
}

