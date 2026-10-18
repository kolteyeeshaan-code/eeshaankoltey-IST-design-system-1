import { useCallback, useEffect, useMemo, useState } from "react";
import { cn } from "./utils/cn";
import { CLIENTS, LOANS, PROPERTIES, VIEW_TITLE, avatars, type ViewId } from "./data";
import { MobileNav, PageHeader, TopBar } from "./components/TopBar";
import {
  Avatar,
  Badge,
  Card,
  Modal,
  PillBtn,
  RoundBtn,
  StageDot,
  ToastHost,
  useToast,
} from "./components/ui";
import {
  Bell,
  Chat,
  Check,
  Close,
  Doc,
  Dollar,
  Gear,
  Layers,
  Logo,
  Mail,
  Ruler,
  Search,
  Sparkles,
  Target,
} from "./components/icons";
import LoanCenter from "./views/LoanCenter";
import PropertyMap from "./views/PropertyMap";
import Dashboard from "./views/Dashboard";
import Analytics from "./views/Analytics";
import { Applications, Management, Reports } from "./views/Workspace";

type PanelId = "notifications" | "messages" | "profile" | null;

const TOOLS = [
  { id: "sankey", name: "Flow Explorer", desc: "Interactive stage-by-stage volume", icon: <Layers /> },
  { id: "calc", name: "Rate Calculator", desc: "Amortisation & escrow modelling", icon: <Dollar /> },
  { id: "ai", name: "AI Underwriter", desc: "Draft conditions automatically", icon: <Sparkles /> },
  { id: "measure", name: "Parcel Measure", desc: "Lot dimensions on the map", icon: <Ruler /> },
  { id: "docs", name: "Doc Vault", desc: "Shared borrower file room", icon: <Doc /> },
  { id: "track", name: "Lead Tracker", desc: "Activity scoring per applicant", icon: <Target /> },
];

const NOTIFICATIONS = [
  { t: "Missing documents", d: "Michael Chen · #LN-9105 needs 2 files", tone: "coral" as const, time: "10m" },
  { t: "Appraisal complete", d: "David Smith · Pacific Coast valued at $615,000", tone: "amber" as const, time: "1h" },
  { t: "Loan funded", d: "Emma Davis · #LN-6620 cleared to close", tone: "amber" as const, time: "3h" },
  { t: "Rate change", d: "30-year fixed moved to 6.12%", tone: "neutral" as const, time: "5h" },
  { t: "New application", d: "Olivia Brown submitted #LN-4409", tone: "amber" as const, time: "1d" },
];

const THREADS = [
  { name: "Sarah Jenkins", msg: "Just uploaded the bank statements — let me know.", time: "9:42", unread: true, avatar: avatars.sarah },
  { name: "Michael Chen", msg: "Can we push the closing to the 29th?", time: "9:05", unread: true, avatar: avatars.michael },
  { name: "Marcus Bell", msg: "Sunset Boulevard is still available.", time: "Yest.", unread: false, avatar: avatars.agent },
  { name: "Emma Davis", msg: "Thank you! Everything looks good.", time: "Yest.", unread: false, avatar: avatars.emma },
  { name: "David Smith", msg: "Appraisal report attached.", time: "Mon", unread: false, avatar: avatars.david },
];

export default function App() {
  return (
    <ToastHost>
      <Shell />
    </ToastHost>
  );
}

function Shell() {
  const toast = useToast();
  const [view, setView] = useState<ViewId>("loan-center");
  const [stack, setStack] = useState<ViewId[]>([]);
  const [panel, setPanel] = useState<PanelId>(null);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState("");
  const [enabled, setEnabled] = useState<string[]>(["sankey", "ai"]);

  const navigate = useCallback(
    (v: ViewId) => {
      if (v === view) return;
      setStack((s) => [...s, view]);
      setView(v);
      setPanel(null);
    },
    [view],
  );

  const back = useCallback(() => {
    setStack((s) => {
      if (!s.length) return s;
      setView(s[s.length - 1]);
      return s.slice(0, -1);
    });
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === "Escape") setPanel(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.title = `Lendora ® — ${VIEW_TITLE[view]}`;
  }, [view]);

  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return { loans: LOANS.slice(0, 3), props: PROPERTIES.slice(0, 3), people: CLIENTS.slice(0, 3) };
    return {
      loans: LOANS.filter((l) => (l.id + l.applicant + l.type).toLowerCase().includes(s)),
      props: PROPERTIES.filter((p) => (p.address + p.price).toLowerCase().includes(s)),
      people: CLIENTS.filter((c) => c.name.toLowerCase().includes(s)),
    };
  }, [q]);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      {/* ---------- ambient background ---------- */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(1200px 700px at 12% -6%, #f3f5f8 0%, #eaedf2 42%, #e6e9ef 70%), linear-gradient(170deg, #eef0f4 0%, #e9ecf1 55%, #eceade 100%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed -bottom-40 left-[-10%] -z-10 h-[520px] w-[620px] rounded-full opacity-45 blur-[90px]"
        style={{ background: "radial-gradient(circle, #f7eccc 0%, rgba(247,236,204,0) 70%)" }}
      />

      <TopBar active={view} onNavigate={navigate} onOpenPanel={setPanel} />

      <div className="px-4 sm:px-7 lg:hidden">
        <MobileNav active={view} onNavigate={navigate} />
      </div>

      <PageHeader
        title={VIEW_TITLE[view]}
        onBack={() => (stack.length ? back() : navigate("dashboard"))}
        onSearch={() => setSearchOpen(true)}
        onAddTools={() => setToolsOpen(true)}
      />

      <main key={view} className="px-4 pb-10 sm:px-7">
        {view === "loan-center" && <LoanCenter />}
        {view === "property-map" && <PropertyMap />}
        {view === "dashboard" && <Dashboard />}
        {view === "analytics" && <Analytics />}
        {view === "applications" && <Applications />}
        {view === "management" && <Management />}
        {view === "reports" && <Reports />}
      </main>

      <footer className="px-4 pb-8 sm:px-7">
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[rgba(22,24,28,0.07)] pt-5 text-[12px] font-light text-muted">
          <span className="flex items-center gap-2">
            <Logo className="h-4 w-4 text-ink/40" /> Lendora ® — mortgage pipeline intelligence
          </span>
          <span>Press ⌘K to search · Data refreshed 12/15/24 at 9:00 AM</span>
        </div>
      </footer>

      {/* ---------- right drawer ---------- */}
      <Drawer open={panel !== null} onClose={() => setPanel(null)} title={
        panel === "notifications" ? "Notifications" : panel === "messages" ? "Messages" : "Your profile"
      }>
        {panel === "notifications" && (
          <ul className="space-y-1.5">
            {NOTIFICATIONS.map((n) => (
              <li key={n.t + n.time} className="surface-flat rounded-[18px] p-3.5">
                <div className="flex items-start gap-2.5">
                  <StageDot tone={n.tone} />
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] text-ink">{n.t}</p>
                    <p className="mt-0.5 text-[12px] leading-[1.5] font-light text-muted">{n.d}</p>
                  </div>
                  <span className="text-[11px] font-light text-faint">{n.time}</span>
                </div>
              </li>
            ))}
          </ul>
        )}

        {panel === "messages" && (
          <ul className="space-y-1">
            {THREADS.map((t) => (
              <li key={t.name}>
                <button
                  type="button"
                  onClick={() => toast(`Opened chat with ${t.name}`)}
                  className="press flex w-full items-center gap-3 rounded-[18px] px-2 py-2.5 text-left transition-colors duration-300 hover:bg-white/80"
                >
                  <Avatar src={t.avatar} name={t.name} size={38} />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="truncate text-[13.5px] text-ink">{t.name}</span>
                      {t.unread && <i className="h-[6px] w-[6px] shrink-0 rounded-full bg-coral" />}
                      <span className="ml-auto shrink-0 text-[11px] font-light text-faint">{t.time}</span>
                    </span>
                    <span className="mt-0.5 block truncate text-[12px] font-light text-muted">{t.msg}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}

        {panel === "profile" && (
          <div>
            <Card variant="cream" className="p-4">
              <div className="flex items-center gap-3">
                <Avatar src={avatars.me} name="Daniel Okoro" size={52} ring />
                <div className="min-w-0">
                  <p className="text-[15px] text-ink">Daniel Okoro</p>
                  <p className="text-[12px] font-light text-muted">Senior Loan Officer · California</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {[
                  ["Rank", "No. 26"],
                  ["Volume", "$12.4M"],
                  ["Goal", "82%"],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-2xl bg-white/75 px-3 py-2.5 text-center">
                    <p className="text-[11px] font-light text-muted">{k}</p>
                    <p className="mt-0.5 text-[13.5px] text-ink">{v}</p>
                  </div>
                ))}
              </div>
            </Card>

            <ul className="mt-3 space-y-1">
              {[
                { i: <Gear />, t: "Account settings" },
                { i: <Bell />, t: "Notification rules" },
                { i: <Mail />, t: "Email templates" },
                { i: <Chat />, t: "Support & help" },
              ].map((m) => (
                <li key={m.t}>
                  <button
                    type="button"
                    onClick={() => toast(m.t)}
                    className="press flex w-full items-center gap-3 rounded-[18px] px-3 py-3 text-left transition-colors duration-300 hover:bg-white/80"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(22,24,28,0.05)] text-ink-2 [&>svg]:h-[17px] [&>svg]:w-[17px]">
                      {m.i}
                    </span>
                    <span className="text-[13.5px] text-ink">{m.t}</span>
                  </button>
                </li>
              ))}
            </ul>

            <PillBtn tone="dark" className="mt-4 w-full py-2.5" onClick={() => toast("Signed out of this device")}>
              Sign out
            </PillBtn>
          </div>
        )}
      </Drawer>

      {/* ---------- add tools ---------- */}
      <Modal
        open={toolsOpen}
        onClose={() => setToolsOpen(false)}
        title="Add tools"
        sub="Pin modules to your workspace"
        width={560}
        footer={
          <>
            <PillBtn tone="soft" className="px-5 py-2.5" onClick={() => setToolsOpen(false)}>
              Cancel
            </PillBtn>
            <PillBtn
              tone="dark"
              className="px-5 py-2.5"
              onClick={() => {
                setToolsOpen(false);
                toast(`${enabled.length} tools pinned to workspace`);
              }}
            >
              Save workspace
            </PillBtn>
          </>
        }
      >
        <div className="grid grid-cols-1 gap-2 pb-4 sm:grid-cols-2">
          {TOOLS.map((t) => {
            const on = enabled.includes(t.id);
            return (
              <button
                key={t.id}
                type="button"
                aria-pressed={on}
                onClick={() =>
                  setEnabled((s) => (s.includes(t.id) ? s.filter((x) => x !== t.id) : [...s, t.id]))
                }
                className={cn(
                  "press flex items-start gap-3 rounded-[18px] border p-3.5 text-left transition-colors duration-300",
                  on
                    ? "border-transparent bg-[rgba(244,199,75,0.22)]"
                    : "border-[rgba(22,24,28,0.08)] bg-white/55 hover:bg-white",
                )}
              >
                <span
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full [&>svg]:h-[17px] [&>svg]:w-[17px]",
                    on ? "bg-ink text-white" : "bg-[rgba(22,24,28,0.05)] text-ink-2",
                  )}
                >
                  {on ? <Check /> : t.icon}
                </span>
                <span className="min-w-0">
                  <span className="block text-[13.5px] text-ink">{t.name}</span>
                  <span className="mt-0.5 block text-[11.5px] leading-[1.45] font-light text-muted">{t.desc}</span>
                </span>
              </button>
            );
          })}
        </div>
      </Modal>

      {/* ---------- global search ---------- */}
      <Modal open={searchOpen} onClose={() => setSearchOpen(false)} title="Search Lendora" sub="Loans, properties and clients" width={520}>
        <div className="pb-5">
          <div className="flex items-center gap-2.5 rounded-2xl bg-[rgba(22,24,28,0.04)] px-4 py-3">
            <Search className="h-[18px] w-[18px] text-muted" />
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Try “LN-8442”, “Sunset” or “Sarah”"
              aria-label="Search everything"
              className="w-full bg-transparent text-[14px] placeholder:text-faint focus:outline-none"
            />
            {q && (
              <button type="button" aria-label="Clear" onClick={() => setQ("")} className="press text-muted hover:text-ink">
                <Close className="h-4 w-4" />
              </button>
            )}
          </div>

          <SearchGroup title="Loans">
            {results.loans.map((l) => (
              <SearchRow
                key={l.id}
                title={`${l.id} · ${l.type}`}
                sub={`${l.applicant} — ${l.amount}`}
                badge={l.stage}
                onClick={() => {
                  navigate("loan-center");
                  setSearchOpen(false);
                }}
              />
            ))}
          </SearchGroup>

          <SearchGroup title="Properties">
            {results.props.map((p) => (
              <SearchRow
                key={p.id}
                title={p.address}
                sub={`${p.beds} · ${p.space}`}
                badge={p.price}
                onClick={() => {
                  navigate("property-map");
                  setSearchOpen(false);
                }}
              />
            ))}
          </SearchGroup>

          <SearchGroup title="Clients">
            {results.people.map((c) => (
              <SearchRow
                key={c.name}
                title={c.name}
                sub={c.role}
                badge={c.amount}
                onClick={() => {
                  navigate("applications");
                  setSearchOpen(false);
                }}
              />
            ))}
          </SearchGroup>

          {!results.loans.length && !results.props.length && !results.people.length && (
            <p className="py-10 text-center text-[13px] font-light text-muted">No results for “{q}”.</p>
          )}
        </div>
      </Modal>
    </div>
  );
}

/* ---------------- drawer ---------------- */

function Drawer({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <div
        aria-hidden="true"
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-[70] bg-[rgba(22,24,28,0.28)] backdrop-blur-[4px] transition-opacity duration-[420ms] ease-out-expo",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={title}
        aria-hidden={!open}
        style={{ willChange: "transform" }}
        className={cn(
          "gpu ease-out-expo fixed top-0 right-0 z-[75] flex h-full w-[min(390px,92vw)] flex-col border-l border-white/70 bg-white/85 shadow-[-30px_0_70px_-30px_rgba(22,24,28,0.45)] backdrop-blur-2xl transition-transform duration-[560ms]",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-between gap-3 px-5 pt-6 pb-4">
          <h2 className="text-[19px] font-medium tracking-[-0.02em] text-ink">{title}</h2>
          <RoundBtn icon={<Close />} label="Close panel" size={34} tone="soft" onClick={onClose} />
        </div>
        <div className="scroll-thin flex-1 overflow-y-auto px-4 pb-8">{children}</div>
      </aside>
    </>
  );
}

/* ---------------- search helpers ---------------- */

function SearchGroup({ title, children }: { title: string; children: React.ReactNode }) {
  const arr = Array.isArray(children) ? children : [children];
  if (!arr.filter(Boolean).length) return null;
  return (
    <section className="mt-4">
      <p className="px-1 pb-1.5 text-[11.5px] font-light tracking-wide text-muted uppercase">{title}</p>
      <ul className="space-y-0.5">{children}</ul>
    </section>
  );
}

function SearchRow({
  title,
  sub,
  badge,
  onClick,
}: {
  title: string;
  sub: string;
  badge: string;
  onClick: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        className="press flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-colors duration-300 hover:bg-[rgba(22,24,28,0.04)]"
      >
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13.5px] text-ink">{title}</span>
          <span className="block truncate text-[11.5px] font-light text-muted">{sub}</span>
        </span>
        <Badge tone="neutral">{badge}</Badge>
      </button>
    </li>
  );
}
