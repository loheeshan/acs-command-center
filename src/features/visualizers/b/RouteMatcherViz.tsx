import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Plus, Route as RouteIcon, Trash2 } from "lucide-react";
import { Button, Callout, Card, CardHeader } from "@/components/ui/primitives";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { cn } from "@/lib/cn";
import { SimBanner, Toggle, inputCls, labelCls, useMarkOnce } from "./shared";

interface ChildRoute { id: number; path: string; index?: boolean; element: string; protected?: boolean }
const DEFAULT_CHILDREN: ChildRoute[] = [
  { id: 1, path: "", index: true, element: "Home" },
  { id: 2, path: "students", element: "StudentsPage" },
  { id: 3, path: "students/:studentId", element: "StudentDetail" },
  { id: 4, path: "settings", element: "Settings" },
  { id: 5, path: "login", element: "Login" },
  { id: 6, path: "dashboard", element: "Dashboard", protected: true },
  { id: 7, path: "*", element: "NotFound" },
];

/** Ranking modelled on React Router: static 10, dynamic 3, splat -2, index +2. */
function score(r: ChildRoute) {
  if (r.index) return 2;
  const segs = r.path.split("/").filter(Boolean);
  let s = segs.length;
  if (segs.includes("*")) s -= 2;
  for (const seg of segs) s += seg === "*" ? 0 : seg.startsWith(":") ? 3 : 10;
  return s;
}
function matchRoute(r: ChildRoute, pathname: string): Record<string, string> | null {
  const urlSegs = pathname.split("/").filter(Boolean);
  if (r.index) return urlSegs.length === 0 ? {} : null;
  const segs = r.path.split("/").filter(Boolean);
  const params: Record<string, string> = {};
  for (let i = 0; i < segs.length; i++) {
    const seg = segs[i];
    if (seg === "*") { params["*"] = urlSegs.slice(i).map(decodeURIComponent).join("/"); return params; }
    const u = urlSegs[i];
    if (u === undefined) return null;
    if (seg.startsWith(":")) params[seg.slice(1)] = decodeURIComponent(u);
    else if (seg.toLowerCase() !== u.toLowerCase()) return null;
  }
  return urlSegs.length === segs.length ? params : null;
}
function navLinkActive(to: string, pathname: string) {
  const p = pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname;
  if (p === to) return true;
  const endSlash = to === "/" ? 1 : to.length;
  return p.startsWith(to) && p.charAt(endSlash) === "/";
}

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/students", label: "Students" },
  { to: "/students/42?tab=grades#top", label: "Student 42" },
  { to: "/settings", label: "Settings" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/nope/deep/link", label: "Broken link" },
];

export default function RouteMatcherViz() {
  const mark = useMarkOnce("route-matcher");
  const [routes, setRoutes] = useState<ChildRoute[]>(DEFAULT_CHILDREN);
  const [history, setHistory] = useState<string[]>(["/"]);
  const [idx, setIdx] = useState(0);
  const [typed, setTyped] = useState("/students/42?tab=grades&sort=name#top");
  const [loggedIn, setLoggedIn] = useState(false);
  const [note, setNote] = useState<string>("");

  const current = history[idx];
  const url = new URL(current, "http://localhost:5173");
  const pathname = url.pathname;

  const ranked = useMemo(
    () => routes.map((r) => ({ r, score: score(r), params: matchRoute(r, pathname) })).sort((a, b) => b.score - a.score),
    [routes, pathname],
  );
  const winner = ranked.find((x) => x.params !== null) ?? null;
  const redirected = winner?.r.protected && !loggedIn;

  const push = (to: string, how: "push" | "replace" = "push") => {
    const next = history.slice(0, idx + 1);
    if (how === "replace") next[idx] = to; else next.push(to);
    setHistory(next);
    setIdx(how === "replace" ? idx : next.length - 1);
    setNote(`${how === "push" ? "navigate(to) — PUSH" : "navigate(to, { replace: true }) — REPLACE"} ${to}`);
    mark();
  };
  // Protected route: <Navigate to="/login" replace />
  const go = (to: string, how: "push" | "replace" = "push") => {
    const p = new URL(to, "http://localhost:5173").pathname;
    const m = [...routes].sort((a, b) => score(b) - score(a)).find((r) => matchRoute(r, p));
    if (m?.protected && !loggedIn) {
      const next = history.slice(0, idx + 1);
      if (how === "replace") next[idx] = "/login"; else next.push("/login");
      setHistory(next);
      setIdx(how === "replace" ? idx : next.length - 1);
      setNote(`${to} is protected and you're logged out → <Navigate to="/login" replace /> replaced the entry (Back won't loop to /dashboard).`);
      mark();
      return;
    }
    push(to, how);
  };

  const { code, lineOf } = useMemo(() => {
    const lines = ["<BrowserRouter>", "  <Routes>", '    <Route path="/" element={<RootLayout />}>'];
    const lineOf: Record<number, number> = {};
    for (const r of routes) {
      lineOf[r.id] = lines.length + 1;
      const el = r.protected ? `<RequireAuth><${r.element} /></RequireAuth>` : `<${r.element} />`;
      lines.push(r.index ? `      <Route index element={${el}} />` : `      <Route path="${r.path}" element={${el}} />`);
    }
    lines.push("    </Route>", "  </Routes>", "</BrowserRouter>");
    return { code: lines.join("\n"), lineOf };
  }, [routes]);
  const hl = new Set<number>(winner ? [3, lineOf[winner.r.id]] : [3]);

  const qp = [...url.searchParams.entries()];
  const update = (id: number, patch: Partial<ChildRoute>) => setRoutes((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  return (
    <div className="space-y-4">
      <SimBanner>This is a simplified model of React Router 7's matching (static &gt; dynamic &gt; splat ranking, nested layout + Outlet). No real navigation happens.</SimBanner>

      <Card>
        <CardHeader icon={<RouteIcon size={16} />} title="Browser" subtitle={note || "Type a URL or click a link"} />
        <div className="space-y-3 p-3">
          <form className="flex flex-wrap gap-2" onSubmit={(e) => { e.preventDefault(); go(typed.startsWith("/") ? typed : "/" + typed); }}>
            <Button size="sm" onClick={() => { if (idx > 0) { setIdx(idx - 1); setNote("navigate(-1) — back"); mark(); } }} disabled={idx === 0} aria-label="Back"><ArrowLeft size={14} /></Button>
            <Button size="sm" onClick={() => { if (idx < history.length - 1) { setIdx(idx + 1); setNote("navigate(1) — forward"); } }} disabled={idx >= history.length - 1} aria-label="Forward"><ArrowRight size={14} /></Button>
            <div className="flex min-w-0 flex-1 items-center rounded-md border border-line bg-bg px-2 font-mono text-xs">
              <span className="text-fg-3">localhost:5173</span>
              <input aria-label="URL path" className="h-8 min-w-0 flex-1 bg-transparent px-1 text-fg outline-none" value={typed} onChange={(e) => setTyped(e.target.value)} />
            </div>
            <Button size="sm" variant="primary" type="submit">Go (push)</Button>
            <Button size="sm" onClick={() => go(typed.startsWith("/") ? typed : "/" + typed, "replace")}>Replace</Button>
          </form>
          <nav className="flex flex-wrap gap-1.5" aria-label="Simulated NavLinks">
            {LINKS.map((l) => {
              const toPath = l.to.split(/[?#]/)[0];
              const active = navLinkActive(toPath, pathname);
              return (
                <button key={l.to} type="button" onClick={() => { setTyped(l.to); go(l.to); }}
                  className={cn("rounded-md border px-2.5 py-1 text-xs", active ? "border-primary bg-primary-soft font-semibold text-primary" : "border-line text-fg-2 hover:bg-hover")}>
                  {l.label}{active && " (active)"}
                </button>
              );
            })}
          </nav>
          <Toggle checked={loggedIn} onChange={setLoggedIn} label="Logged in (for the RequireAuth guard on /dashboard)" />
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Match result" subtitle={`location: ${current}`} />
          <div className="space-y-3 p-3 text-sm">
            <div className="rounded-md border border-line p-2">
              <div className="text-xs text-fg-2">RootLayout (path "/") — navbar + &lt;Outlet /&gt;</div>
              <div className="mt-2 rounded-md border-2 border-dashed border-primary/50 bg-primary-soft p-3 text-center">
                <span className="text-xs text-fg-2">&lt;Outlet /&gt; renders → </span>
                <strong className="font-mono">{winner ? (redirected ? "Navigate → /login" : `<${winner.r.element} />`) : "nothing (no match)"}</strong>
              </div>
            </div>
            <div>
              <div className={labelCls}>useParams()</div>
              <pre className="rounded-md bg-code p-2 font-mono text-xs">{JSON.stringify(winner?.params ?? {}, null, 0)}</pre>
              {winner && Object.keys(winner.params ?? {}).length > 0 && <p className="mt-1 text-xs text-warn">Params are always strings: convert with Number(studentId) and handle NaN.</p>}
            </div>
            <div>
              <div className={labelCls}>useSearchParams() / location.hash</div>
              {qp.length ? (
                <table className="w-full text-xs"><tbody>{qp.map(([k, v], i) => <tr key={i} className="border-t border-line"><td className="py-1 font-mono text-fg-2">{k}</td><td className="font-mono">"{v}"</td></tr>)}</tbody></table>
              ) : <p className="text-xs text-fg-3">No query string. (Query and hash never affect which route matches.)</p>}
              <p className="mt-1 font-mono text-xs text-fg-2">hash: {url.hash || "(none)"}</p>
            </div>
            <div>
              <div className={labelCls}>Ranking (higher score wins among matches)</div>
              <ul className="space-y-0.5 text-xs">
                {ranked.map(({ r, score: sc, params }) => (
                  <li key={r.id} className={cn("flex justify-between rounded px-1.5 py-0.5 font-mono", winner?.r.id === r.id ? "bg-ok-soft text-ok" : params ? "text-fg" : "text-fg-3")}>
                    <span>{r.index ? "(index)" : r.path || '""'}</span><span>{sc} {params ? (winner?.r.id === r.id ? "✓ winner" : "matches") : "✗"}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
        <div className="space-y-4">
          <CodeBlock code={code} language="tsx" title="Route config (highlighted = matched branch)" highlightLines={hl} runnable={false} />
          <Card>
            <CardHeader title="History stack" subtitle="push adds, replace overwrites, back/forward move the pointer" />
            <ol className="space-y-1 p-3 font-mono text-xs">
              {history.map((h, i) => (
                <li key={i} className={cn("rounded px-2 py-1", i === idx ? "bg-primary text-on-primary" : i > idx ? "text-fg-3" : "text-fg-2")}>{i}: {h}{i === idx && "  ← current"}</li>
              ))}
            </ol>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader title="Edit child routes of RootLayout" subtitle="Change paths and watch the matcher re-rank" action={<Button size="sm" onClick={() => setRoutes((rs) => [...rs, { id: Date.now(), path: "students/new", element: "NewStudent" }])}><Plus size={14} /> Add</Button>} />
        <div className="space-y-2 p-3">
          {routes.map((r) => (
            <div key={r.id} className="flex flex-wrap items-center gap-2">
              <input aria-label="Route path" className={cn(inputCls, "w-48 font-mono")} disabled={r.index} value={r.index ? "(index)" : r.path} onChange={(e) => update(r.id, { path: e.target.value.replace(/^\//, "") })} />
              <input aria-label="Element name" className={cn(inputCls, "w-40 font-mono")} value={r.element} onChange={(e) => update(r.id, { element: e.target.value.replace(/[^\w]/g, "") || "Page" })} />
              <Toggle checked={!!r.protected} onChange={(v) => update(r.id, { protected: v })} label="protected" />
              <Button size="sm" variant="ghost" aria-label={`Remove ${r.path}`} onClick={() => setRoutes((rs) => rs.filter((x) => x.id !== r.id))}><Trash2 size={14} /></Button>
            </div>
          ))}
          <Button size="sm" variant="ghost" onClick={() => setRoutes(DEFAULT_CHILDREN)}>Reset routes</Button>
        </div>
      </Card>

      <Callout tone="primary" title="Things to try">
        Visit <code>/students/new</code> before and after adding that route — static beats <code>:studentId</code> regardless of order. Remove the <code>*</code> route and visit a broken link.
        Go to /dashboard while logged out, then press Back.
      </Callout>
    </div>
  );
}
