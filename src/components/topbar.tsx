import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { cn } from "../utils/cn";
import { NAV, avatars, type ViewId } from "../data";
import { Avatar, PillBtn, RoundBtn, useToast } from "./ui";
import { ArrowLeft, Bell, Logo, Mail, Plus, Refresh, Search, Target } from "./icons";

/* ---------------- sliding pill nav ---------------- */

function NavPills({ active, onNavigate }: { active: ViewId; onNavigate: (v: ViewId) => void }) {
  const wrap = useRef<HTMLDivElement>(null);
  const items = useRef<Partial<Record<ViewId, HTMLButtonElement | null>>>({});
  const [ind, setInd] = useState({ x: 0, w: 0, ready: false });

  const measure = useCallback(() => {
    const el = items.current[active];
    const box = wrap.current;
    if (!el || !box) return;
    setInd({ x: el.offsetLeft, w: el.offsetWidth, ready: true });
  }, [active]);

  useLayoutEffect(measure, [measure]);
  useEffect(() => {
    const ro = new ResizeObserver(measure);
    if (wrap.current) ro.observe(wrap.current);
    window.addEventListener("resize", measure, { passive: true });
    const t = window.setTimeout(measure, 300);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
      window.clearTimeout(t);
    };
  }, [measure]);

  return (
    <nav
      ref={wrap}
      aria-label="Primary"
      className="no-scrollbar relative flex max-w-full items-center gap-0.5 overflow-x-auto rounded-full bg-white/45 p-1"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-1 left-0 h-[calc(100%-8px)] w-[100px] rounded-full bg-white shadow-[0_2px_10px_-3px_rgba(22,24,28,0.18)]"
        style={{
          transform: `translate3d(${ind.x}px,0,0) scaleX(${ind.w / 100})`,
          transformOrigin: "left center",
          opacity: ind.ready ? 1 : 0,
          willChange: "transform",
          transition:
            "transform .55s cubic-bezier(.16,1,.3,1), opacity .3s linear",
        }}
      />
      {NAV.map((n) => (
        <button
          key={n.id}
          ref={(el) => {
            items.current[n.id] = el;
          }}
          type="button"
          aria-current={active === n.id ? "page" : undefined}
          onClick={() => onNavigate(n.id)}
          className={cn(
            "relative z-10 rounded-full px-4 py-2 text-[13.5px] whitespace-nowrap transition-colors duration-[350ms] ease-out-expo",
            active === n.id ? "text-ink" : "text-ink-2 hover:text-ink",
          )}
        >
          {n.label}
        </button>
      ))}
    </nav>
  );
}

/* ---------------- top bar ---------------- */

function useScrolled(threshold = 14) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    let ticking = false;
    const handle = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        setOn(window.scrollY > threshold);
      });
    };
    handle();
    window.addEventListener("scroll", handle, { passive: true });
    return () => window.removeEventListener("scroll", handle);
  }, [threshold]);
  return on;
}

export function TopBar({
  active,
  onNavigate,
  onOpenPanel,
}: {
  active: ViewId;
  onNavigate: (v: ViewId) => void;
  onOpenPanel: (p: "notifications" | "messages" | "profile") => void;
}) {
  const elevated = useScrolled();

  return (
    <header className="sticky top-0 z-40 flex items-center gap-4 px-4 pt-4 pb-3 sm:px-7 sm:pt-6">
      <div
        aria-hidden="true"
        style={{ willChange: "opacity" }}
        className={cn(
          "ease-out-expo pointer-events-none absolute inset-x-0 top-0 bottom-0 -z-10 border-b border-[rgba(22,24,28,0.06)] bg-[rgba(238,241,245,0.72)] backdrop-blur-xl transition-opacity duration-[450ms]",
          elevated ? "opacity-100" : "opacity-0",
        )}
      />
      <button
        type="button"
        onClick={() => onNavigate("dashboard")}
        className="press flex shrink-0 items-center gap-3"
        aria-label="Lendora home"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-[0_4px_14px_-6px_rgba(22,24,28,0.35)]">
          <Logo className="h-[22px] w-[22px] text-ink" />
        </span>
        <span className="text-[15px] font-medium tracking-[-0.01em] text-ink">Lendora ®</span>
      </button>

      <div className="mx-auto hidden min-w-0 lg:block">
        <NavPills active={active} onNavigate={onNavigate} />
      </div>

      <div className="ml-auto flex items-center gap-1.5 rounded-full bg-white/70 p-1.5 pr-1.5 shadow-[0_4px_16px_-10px_rgba(22,24,28,0.4)] lg:ml-0">
        <IconDot icon={<Bell />} label="Notifications" onClick={() => onOpenPanel("notifications")} dot />
        <IconDot icon={<Mail />} label="Messages" onClick={() => onOpenPanel("messages")} dot />
        <button
          type="button"
          onClick={() => onOpenPanel("profile")}
          aria-label="Your profile"
          className="press rounded-full"
        >
          <Avatar src={avatars.me} name="Daniel Okoro" size={34} ring />
        </button>
      </div>
    </header>
  );
}

function IconDot({
  icon,
  label,
  onClick,
  dot,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  dot?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="press relative flex h-9 w-9 items-center justify-center rounded-full text-ink hover:bg-[rgba(22,24,28,0.05)]"
    >
      <span className="h-[18px] w-[18px] [&>svg]:h-full [&>svg]:w-full">{icon}</span>
      {dot && (
        <i className="absolute top-1.5 right-2 h-[6px] w-[6px] rounded-full bg-coral ring-2 ring-white" />
      )}
    </button>
  );
}

/* ---------------- mobile nav strip ---------------- */

export function MobileNav({ active, onNavigate }: { active: ViewId; onNavigate: (v: ViewId) => void }) {
  return (
    <div className="no-scrollbar -mx-4 mt-3 flex gap-1.5 overflow-x-auto px-4 pb-0.5 lg:hidden">
      {NAV.map((n) => (
        <button
          key={n.id}
          type="button"
          onClick={() => onNavigate(n.id)}
          aria-current={active === n.id ? "page" : undefined}
          className={cn(
            "press shrink-0 rounded-full px-3.5 py-1.5 text-[12.5px] whitespace-nowrap",
            active === n.id ? "bg-white text-ink shadow-[0_2px_10px_-4px_rgba(22,24,28,0.25)]" : "bg-white/45 text-ink-2",
          )}
        >
          {n.label}
        </button>
      ))}
    </div>
  );
}

/* ---------------- page header ---------------- */

export function PageHeader({
  title,
  onBack,
  onSearch,
  onAddTools,
}: {
  title: string;
  onBack: () => void;
  onSearch: () => void;
  onAddTools: () => void;
}) {
  const toast = useToast();
  const [spin, setSpin] = useState(false);

  return (
    <div className="flex flex-wrap items-center gap-3 px-4 pt-4 pb-4 sm:px-7 sm:pt-5 sm:pb-5">
      <RoundBtn
        icon={<ArrowLeft />}
        label="Back"
        onClick={onBack}
        size={42}
        tone="outline"
        className="border-transparent bg-white shadow-[0_4px_14px_-8px_rgba(22,24,28,0.4)]"
      />
      <h1 className="text-[30px] leading-none font-normal tracking-[-0.035em] text-ink sm:text-[38px]">
        {title}
      </h1>

      <div className="ml-auto flex items-center gap-2">
        <div className="flex items-center gap-1 rounded-full bg-white/75 p-1.5 shadow-[0_4px_16px_-12px_rgba(22,24,28,0.4)]">
          <button
            type="button"
            aria-label="Refresh data"
            title="Refresh data"
            onClick={() => {
              setSpin(true);
              toast("Pipeline data refreshed");
              window.setTimeout(() => setSpin(false), 720);
            }}
            className="press flex h-8 w-8 items-center justify-center rounded-full text-ink hover:bg-[rgba(22,24,28,0.05)]"
          >
            <Refresh className={cn("h-[17px] w-[17px]", spin && "spin-once")} />
          </button>
          <PillBtn tone="ghost" icon={<Plus />} onClick={onAddTools} className="px-2 py-1.5">
            <span className="hidden sm:inline">Add Tools</span>
          </PillBtn>
        </div>
        <PillBtn tone="dark" onClick={onSearch} className="px-5 py-2.5">
          <Search className="h-4 w-4 sm:hidden" />
          <span className="hidden sm:inline">Search</span>
        </PillBtn>
      </div>
    </div>
  );
}

export const HeaderIcons = { Target, Mail, Bell };
