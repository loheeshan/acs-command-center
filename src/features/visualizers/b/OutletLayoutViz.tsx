import { useEffect, useRef, useState, type ReactNode } from "react";
import { LayoutTemplate, MousePointerClick } from "lucide-react";
import { Badge, Button, Callout, Card, CardHeader } from "@/components/ui/primitives";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { cn } from "@/lib/cn";
import { SimBanner, Toggle, useMarkOnce } from "./shared";

type PageId = "Home" | "About" | "Overview" | "Bookings" | "DashSettings";
interface Branch { path: string; layouts: ("RootLayout" | "DashboardLayout")[]; page: PageId; index: boolean; lines: number[] }
const BRANCHES: Branch[] = [
  { path: "/", layouts: ["RootLayout"], page: "Home", index: true, lines: [1, 2] },
  { path: "/about", layouts: ["RootLayout"], page: "About", index: false, lines: [1, 3] },
  { path: "/dashboard", layouts: ["RootLayout", "DashboardLayout"], page: "Overview", index: true, lines: [1, 4, 5] },
  { path: "/dashboard/bookings", layouts: ["RootLayout", "DashboardLayout"], page: "Bookings", index: false, lines: [1, 4, 6] },
  { path: "/dashboard/settings", layouts: ["RootLayout", "DashboardLayout"], page: "DashSettings", index: false, lines: [1, 4, 7] },
];
const CODE = `<Route path="/" element={<RootLayout />}>
  <Route index element={<Home />} />
  <Route path="about" element={<About />} />
  <Route path="dashboard" element={<DashboardLayout />}>
    <Route index element={<Overview />} />
    <Route path="bookings" element={<Bookings />} />
    <Route path="settings" element={<DashSettings />} />
  </Route>
</Route>`;

type Logger = (msg: string) => void;

/** A REAL React component: its useState survives as long as it stays mounted. */
function Box({ name, tone, log, header, footer, children }: { name: string; tone: string; log: Logger; header?: ReactNode; footer?: ReactNode; children?: ReactNode }) {
  const [clicks, setClicks] = useState(0);
  const mountedAt = useRef(new Date().toLocaleTimeString());
  useEffect(() => {
    log(`mount   <${name} />`);
    return () => log(`unmount <${name} />`);
  }, [name, log]);
  return (
    <div className={cn("rounded-lg border-2 p-2.5", tone)}>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <span className="font-mono text-xs font-semibold text-fg">&lt;{name} /&gt;</span>
        <span className="flex items-center gap-1.5 text-[11px] text-fg-2">
          mounted {mountedAt.current}
          <Button size="sm" variant="ghost" onClick={() => setClicks((c) => c + 1)} aria-label={`Increment local state of ${name}`}>
            <MousePointerClick size={12} /> local state: {clicks}
          </Button>
        </span>
      </div>
      {header}
      {children}
      {footer}
    </div>
  );
}

const PAGE_TEXT: Record<PageId, string> = {
  Home: "Index route of / — renders at exactly '/'.",
  About: "About page.",
  Overview: "Index route of /dashboard — the default child when the URL is exactly /dashboard.",
  Bookings: "Your bookings list.",
  DashSettings: "Dashboard settings.",
};

export default function OutletLayoutViz() {
  const mark = useMarkOnce("outlet-layout");
  const [path, setPath] = useState("/");
  const [noOutletRoot, setNoOutletRoot] = useState(false);
  const [noOutletDash, setNoOutletDash] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const logRef = useRef<Logger>((m) => setLog((l) => [`${new Date().toLocaleTimeString()}  ${m}`, ...l].slice(0, 30)));
  const branch = BRANCHES.find((b) => b.path === path)!;
  const inDash = branch.layouts.includes("DashboardLayout");

  const page = (
    <Box key={branch.page} name={branch.page} tone="border-ok/50 bg-ok-soft" log={logRef.current}>
      <p className="text-xs text-fg-2">{PAGE_TEXT[branch.page]}</p>
    </Box>
  );
  const outletSlot = (content: ReactNode, broken: boolean, label: string) =>
    broken ? (
      <div className="rounded-md border-2 border-dashed border-err/50 bg-err-soft p-3 text-center text-xs text-err">No &lt;Outlet /&gt; in {label} — the matched child route has nowhere to render.</div>
    ) : (
      <div className="rounded-md border border-dashed border-line p-1.5">
        <div className="mb-1 text-[10px] uppercase tracking-wide text-fg-3">&lt;Outlet /&gt;</div>
        {content}
      </div>
    );

  const dash = (
    <Box key="DashboardLayout" name="DashboardLayout" tone="border-violet/50 bg-violet-soft" log={logRef.current}
      header={<div className="mb-2 flex flex-wrap gap-1 text-[11px]">{["/dashboard", "/dashboard/bookings", "/dashboard/settings"].map((p) => <span key={p} className={cn("rounded px-1.5 py-0.5", p === path ? "bg-violet text-white" : "bg-elevated text-fg-2")}>{p.replace("/dashboard", "") || "overview"}</span>)}</div>}>
      {outletSlot(page, noOutletDash, "DashboardLayout")}
    </Box>
  );

  return (
    <div className="space-y-4">
      <SimBanner>The routing is modelled, but the boxes below are real React components with real local state — so what stays mounted is genuine React behaviour (same component type at the same position is preserved).</SimBanner>

      <Card>
        <CardHeader icon={<LayoutTemplate size={16} />} title="Navigate" subtitle="Click local-state buttons, then change URL — which counters survive?" />
        <div className="space-y-3 p-3">
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="URLs">
            {BRANCHES.map((b) => (
              <Button key={b.path} size="sm" variant={b.path === path ? "primary" : "secondary"} onClick={() => { setPath(b.path); mark(); }} aria-current={b.path === path ? "page" : undefined}>
                <span className="font-mono">{b.path}</span>
              </Button>
            ))}
          </div>
          <div className="flex flex-wrap gap-4">
            <Toggle checked={noOutletRoot} onChange={(v) => { setNoOutletRoot(v); mark(); }} label="Bug: RootLayout forgets <Outlet />" />
            <Toggle checked={noOutletDash} onChange={(v) => { setNoOutletDash(v); mark(); }} label="Bug: DashboardLayout forgets <Outlet />" />
          </div>
          <div className="flex flex-wrap items-center gap-1 text-xs">
            <span className="text-fg-2">Matched branch:</span>
            {[...branch.layouts, branch.page].map((n, i) => <span key={n} className="font-mono">{i > 0 && " → "}<Badge tone={i === branch.layouts.length ? "success" : "primary"}>{n}</Badge></span>)}
            {branch.index && <Badge tone="warning">index route</Badge>}
          </div>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
        <Box name="RootLayout" tone="border-primary/50 bg-primary-soft" log={logRef.current}
          header={<div className="mb-2 rounded bg-elevated px-2 py-1 text-xs text-fg-2">Navbar: Home · About · Dashboard</div>}
          footer={<div className="mt-2 rounded bg-elevated px-2 py-1 text-xs text-fg-2">Footer © CampusEvents</div>}>
          {outletSlot(inDash ? dash : page, noOutletRoot, "RootLayout")}
        </Box>
        <Card>
          <CardHeader title="Mount log" subtitle="Newest first" action={<Button size="sm" variant="ghost" onClick={() => setLog([])}>Clear</Button>} />
          <ul className="max-h-80 space-y-0.5 overflow-y-auto p-3 font-mono text-[11px]" aria-live="polite">
            {log.map((l, i) => <li key={i} className={l.includes("unmount") ? "text-err" : "text-ok"}>{l}</li>)}
          </ul>
          <p className="border-t border-line px-3 py-2 text-[11px] text-fg-3">Dev StrictMode mounts → unmounts → re-mounts once on first render; that extra pair is expected.</p>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <CodeBlock code={CODE} language="tsx" title="Nested routes (highlighted = active branch)" highlightLines={new Set(branch.lines)} runnable={false} />
        <div className="space-y-2">
          <Callout tone="primary" title="Layouts persist">Moving between /dashboard/bookings and /dashboard/settings keeps RootLayout and DashboardLayout mounted (their local state survives); only the Outlet content is swapped.</Callout>
          <Callout tone="warning" title="Index routes">An <code>index</code> route has no path of its own: it renders in the parent's Outlet when the URL matches the parent exactly (/dashboard → Overview).</Callout>
          <Callout tone="error" title="Forgot the Outlet?">The URL still matches and the child route is still selected, but nothing renders it — a classic "my page is blank" bug.</Callout>
        </div>
      </div>
    </div>
  );
}
