import { useEffect, useMemo, useState } from "react";
import { Database, Eye, EyeOff, Pause, Play, RefreshCw, Server, WifiOff } from "lucide-react";
import { Badge, Button, Callout, Card, CardHeader, Stat } from "@/components/ui/primitives";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { cn } from "@/lib/cn";
import { SimBanner, Toggle, inputCls, labelCls, useMarkOnce } from "./shared";

type KeyId = '["events"]' | '["events",1]' | '["categories"]';
const KEYS: KeyId[] = ['["events"]', '["events",1]', '["categories"]'];
const RESOURCE: Record<KeyId, string[]> = { '["events"]': ["events"], '["events",1]': ["event-1"], '["categories"]': ["categories"] };

interface Entry {
  key: KeyId;
  dataVersion: number | null;
  dataUpdatedAt: number | null;
  status: "pending" | "success" | "error";
  fetchStatus: "fetching" | "idle";
  fetchDoneAt: number | null;
  invalidated: boolean;
  inactiveSince: number | null;
  failureCount: number;
  updates: number;
}
interface Cfg { staleTime: number; gcTime: number }
interface Comp { id: string; name: string; key: KeyId }
interface Sim {
  clock: number;
  server: Record<string, number>;
  cache: Partial<Record<KeyId, Entry>>;
  mounted: string[];
  requests: number;
  log: { t: number; msg: string; tone: "info" | "ok" | "warn" | "err" }[];
}

const COMPONENTS: Comp[] = [
  { id: "list", name: "<EventsPage />", key: '["events"]' },
  { id: "side", name: "<UpcomingSidebar />", key: '["events"]' },
  { id: "detail", name: "<EventDetails id={1} />", key: '["events",1]' },
  { id: "cats", name: "<CategoryFilter />", key: '["categories"]' },
];
const LATENCY = 1000;
const STALE_OPTS = [0, 10_000, 30_000, 60_000, Infinity];
const GC_OPTS = [0, 10_000, 30_000, 60_000, 300_000];
const fmt = (ms: number) => (ms === Infinity ? "Infinity" : ms >= 60_000 ? `${ms / 60_000}min` : `${ms / 1000}s`);
const clockFmt = (ms: number) => `${String(Math.floor(ms / 60000)).padStart(2, "0")}:${String(Math.floor((ms % 60000) / 1000)).padStart(2, "0")}`;

const initial = (): Sim => ({ clock: 0, server: { events: 1, "event-1": 1, categories: 1 }, cache: {}, mounted: [], requests: 0, log: [] });

export default function QueryCacheViz() {
  const mark = useMarkOnce("query-cache");
  const [sim, setSim] = useState<Sim>(initial);
  const [cfg, setCfg] = useState<Record<KeyId, Cfg>>({
    '["events"]': { staleTime: 30_000, gcTime: 60_000 },
    '["events",1]': { staleTime: 0, gcTime: 300_000 },
    '["categories"]': { staleTime: Infinity, gcTime: 300_000 },
  });
  const [offline, setOffline] = useState(false);
  const [retry, setRetry] = useState(3);
  const [playing, setPlaying] = useState(false);
  const [lastAction, setLastAction] = useState<"mount" | "focus" | "invalidate" | "mutate" | "refetch" | "none">("none");

  const isStale = (e: Entry, now: number) => e.dataUpdatedAt === null || e.invalidated || now - e.dataUpdatedAt >= cfg[e.key].staleTime;
  const observers = (key: KeyId, mounted: string[]) => COMPONENTS.filter((c) => mounted.includes(c.id) && c.key === key).length;

  // pure helpers operating on a draft copy
  const log = (d: Sim, msg: string, tone: Sim["log"][number]["tone"] = "info") => d.log.unshift({ t: d.clock, msg, tone });
  const startFetch = (d: Sim, key: KeyId, reason: string) => {
    const e = d.cache[key];
    if (!e || e.fetchStatus === "fetching") return;
    d.cache[key] = { ...e, fetchStatus: "fetching", fetchDoneAt: d.clock + LATENCY };
    log(d, `${key} fetch started (${reason})${e.dataVersion !== null ? " — background refetch, cached data still shown" : ""}`, "info");
  };
  const advanceTo = (d: Sim, target: number) => {
    while (d.clock < target) {
      d.clock = Math.min(target, d.clock + 1000);
      for (const key of KEYS) {
        const e = d.cache[key];
        if (e && e.fetchStatus === "fetching" && e.fetchDoneAt !== null && e.fetchDoneAt <= d.clock) {
          if (offline) {
            const attempts = 1 + retry;
            d.requests += attempts;
            d.cache[key] = { ...e, fetchStatus: "idle", fetchDoneAt: null, status: "error", failureCount: attempts };
            log(d, `${key} failed after ${attempts} attempt(s) (1 + retry ${retry}) → status 'error'${e.dataVersion !== null ? ", previous data kept" : ""}`, "err");
          } else {
            d.requests += 1;
            const v = d.server[RESOURCE[key][0]];
            d.cache[key] = { ...e, fetchStatus: "idle", fetchDoneAt: null, status: "success", dataVersion: v, dataUpdatedAt: d.clock, invalidated: false, failureCount: 0, updates: e.updates + 1 };
            log(d, `${key} success → data v${v} cached, fresh for ${fmt(cfg[key].staleTime)}`, "ok");
          }
        }
      }
      for (const key of KEYS) {
        const e = d.cache[key];
        if (e && e.inactiveSince !== null && e.fetchStatus === "idle" && d.clock - e.inactiveSince >= cfg[key].gcTime) {
          delete d.cache[key];
          log(d, `${key} garbage-collected (inactive for gcTime ${fmt(cfg[key].gcTime)})`, "warn");
        }
      }
    }
  };
  const apply = (fn: (d: Sim) => void, action?: typeof lastAction) => {
    if (action) setLastAction(action);
    setSim((s) => {
      const d: Sim = { ...s, cache: { ...s.cache }, server: { ...s.server }, mounted: [...s.mounted], log: [...s.log] };
      fn(d);
      d.log = d.log.slice(0, 60);
      return d;
    });
    mark();
  };

  const toggleMount = (c: Comp) =>
    apply((d) => {
      if (d.mounted.includes(c.id)) {
        d.mounted = d.mounted.filter((m) => m !== c.id);
        log(d, `${c.name} unmounted`);
        const e = d.cache[c.key];
        if (e && observers(c.key, d.mounted) === 0) {
          d.cache[c.key] = { ...e, inactiveSince: d.clock };
          log(d, `${c.key} now INACTIVE (0 observers) → gc countdown ${fmt(cfg[c.key].gcTime)} starts`, "warn");
        }
        return;
      }
      d.mounted.push(c.id);
      log(d, `${c.name} mounted → observes ${c.key}`);
      const e = d.cache[c.key];
      if (!e) {
        d.cache[c.key] = { key: c.key, dataVersion: null, dataUpdatedAt: null, status: "pending", fetchStatus: "idle", fetchDoneAt: null, invalidated: false, inactiveSince: null, failureCount: 0, updates: 0 };
        startFetch(d, c.key, "no cache entry — initial request, isPending");
      } else {
        d.cache[c.key] = { ...e, inactiveSince: null };
        if (isStale(e, d.clock)) startFetch(d, c.key, "refetchOnMount: data is stale");
        else log(d, `${c.key} is FRESH → served from cache, no request`, "ok");
      }
    }, sim.mounted.includes(c.id) ? undefined : "mount");

  const advance = (ms: number) => apply((d) => advanceTo(d, d.clock + ms));
  const focus = () =>
    apply((d) => {
      log(d, "window focus event");
      for (const k of KEYS) {
        const e = d.cache[k];
        if (!e) continue;
        if (observers(k, d.mounted) === 0) continue;
        if (isStale(e, d.clock)) startFetch(d, k, "refetchOnWindowFocus: active & stale");
        else log(d, `${k} fresh → focus ignored`);
      }
    }, "focus");
  const refetch = (k: KeyId) =>
    apply((d) => {
      if (!d.cache[k]) return;
      startFetch(d, k, "refetch() called — ignores staleTime");
    }, "refetch");
  const mutate = (what: "create" | "update1") =>
    apply((d) => {
      d.requests += 1;
      if (what === "create") d.server.events += 1;
      else {
        d.server.events += 1;
        d.server["event-1"] += 1;
      }
      log(d, `useMutation ${what === "create" ? "POST /api/events → 201" : "PUT /api/events/1 → 204"}: SERVER changed, cache NOT updated`, "warn");
    }, "mutate");
  const invalidate = (prefix: unknown[]) =>
    apply((d) => {
      const p = JSON.stringify(prefix).slice(0, -1);
      log(d, `invalidateQueries({ queryKey: ${JSON.stringify(prefix)} })`);
      for (const k of KEYS) {
        const e = d.cache[k];
        if (!e || !(k.startsWith(p) && (k.length === p.length + 1 || k[p.length] === "," || k[p.length] === "]"))) continue;
        d.cache[k] = { ...e, invalidated: true };
        if (observers(k, d.mounted) > 0) startFetch(d, k, "invalidated & active");
        else log(d, `${k} marked stale (inactive → refetched on next mount)`, "warn");
      }
    }, "invalidate");

  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => setSim((s) => {
      const d: Sim = { ...s, cache: { ...s.cache }, log: [...s.log] };
      advanceTo(d, d.clock + 1000);
      return d;
    }), 1000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, offline, retry, cfg]);

  const [selKey, setSelKey] = useState<KeyId>('["events"]');
  const sel = sim.cache[selKey];
  const phase = !sel ? -1 : sel.dataVersion === null ? 0 : sel.fetchStatus === "fetching" ? 3 : isStale(sel, sim.clock) ? 2 : sel.updates > 1 ? 4 : 1;
  const PHASES = ["Initial request", "Cached & fresh", "Stale", "Background refetch", "Updated & fresh"];

  const code = useMemo(() => {
    const c = cfg[selKey];
    return `function useEventsQuery() {
  return useQuery({
    queryKey: ${selKey},
    queryFn: () => fetchJson(${selKey === '["events"]' ? '"/api/events"' : selKey === '["events",1]' ? '"/api/events/1"' : '"/api/categories"'}),
    staleTime: ${c.staleTime === Infinity ? "Infinity" : c.staleTime},   // fresh window
    gcTime: ${c.gcTime},      // inactive entries kept this long
    retry: ${retry},
  });
}

const createEvent = useMutation({
  mutationFn: (dto: CreateEventDto) => api.post("/events", dto),
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ["events"] }),
});`;
  }, [cfg, selKey, retry]);
  const hl = new Set<number>(lastAction === "mount" ? [2, 3] : lastAction === "focus" ? [5] : lastAction === "mutate" ? [12, 13] : lastAction === "invalidate" ? [14] : lastAction === "refetch" ? [4] : []);

  return (
    <div className="space-y-4">
      <SimBanner>A simulated QueryClient with a virtual clock that follows TanStack Query v5 defaults and rules. Each fetch takes 1 simulated second.</SimBanner>

      <Card>
        <CardHeader icon={<Database size={16} />} title="Clock & environment" subtitle={`Virtual time ${clockFmt(sim.clock)}`} action={<Badge tone="primary">t = {clockFmt(sim.clock)}</Badge>} />
        <div className="flex flex-wrap items-center gap-2 p-3">
          <Button size="sm" variant="primary" onClick={() => setPlaying((p) => !p)}>{playing ? <Pause size={14} /> : <Play size={14} />} {playing ? "Pause clock" : "Play clock"}</Button>
          {[1000, 5000, 30_000, 60_000].map((ms) => (
            <Button key={ms} size="sm" onClick={() => advance(ms)}>+{fmt(ms)}</Button>
          ))}
          <Button size="sm" onClick={focus}><Eye size={14} /> Window focus</Button>
          <Toggle checked={offline} onChange={setOffline} label={<span className="inline-flex items-center gap-1"><WifiOff size={12} /> Network failure</span>} />
          <label className="flex items-center gap-1 text-xs text-fg-2">retry
            <input type="number" min={0} max={5} value={retry} onChange={(e) => setRetry(Math.max(0, Math.min(5, Number(e.target.value) || 0)))} className={cn(inputCls, "w-14")} />
          </label>
          <Button size="sm" variant="ghost" onClick={() => { setSim(initial()); setPlaying(false); setLastAction("none"); }}>Reset</Button>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Components (observers)" subtitle="Mount = useQuery subscribes. Unmount = observer removed." />
          <div className="grid gap-2 p-3 sm:grid-cols-2">
            {COMPONENTS.map((c) => {
              const on = sim.mounted.includes(c.id);
              const e = sim.cache[c.key];
              return (
                <button key={c.id} type="button" onClick={() => toggleMount(c)} aria-pressed={on}
                  className={cn("rounded-md border p-2 text-left text-xs transition-colors", on ? "border-primary/40 bg-primary-soft" : "border-dashed border-line hover:bg-hover")}>
                  <div className="flex items-center justify-between gap-1 font-mono font-medium text-fg">{c.name}{on ? <Eye size={12} /> : <EyeOff size={12} className="text-fg-3" />}</div>
                  <div className="font-mono text-fg-3">{c.key}</div>
                  <div className="mt-1 text-fg-2">{!on ? "Unmounted — click to mount" : !e || e.dataVersion === null ? (e?.status === "error" ? "Error UI" : "isPending → spinner") : `Shows data v${e.dataVersion}${e.fetchStatus === "fetching" ? " (isFetching…)" : ""}`}</div>
                </button>
              );
            })}
          </div>
          <div className="border-t border-line p-3">
            <div className={labelCls}>Per-query options</div>
            <div className="space-y-2">
              {KEYS.map((k) => (
                <div key={k} className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="w-28 font-mono text-fg">{k}</span>
                  <label className="flex items-center gap-1 text-fg-2">staleTime
                    <select className={cn(inputCls, "h-7 w-24")} value={String(cfg[k].staleTime)} onChange={(e) => setCfg((c) => ({ ...c, [k]: { ...c[k], staleTime: Number(e.target.value) } }))}>
                      {STALE_OPTS.map((o) => <option key={o} value={String(o)}>{fmt(o)}</option>)}
                    </select>
                  </label>
                  <label className="flex items-center gap-1 text-fg-2">gcTime
                    <select className={cn(inputCls, "h-7 w-24")} value={cfg[k].gcTime} onChange={(e) => setCfg((c) => ({ ...c, [k]: { ...c[k], gcTime: Number(e.target.value) } }))}>
                      {GC_OPTS.map((o) => <option key={o} value={o}>{fmt(o)}</option>)}
                    </select>
                  </label>
                  <Button size="sm" variant="ghost" onClick={() => refetch(k)} disabled={!sim.cache[k]}><RefreshCw size={12} /> refetch</Button>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader icon={<Server size={16} />} title="Server vs actions" subtitle="Mutations change the server only — the cache learns about it via invalidation or setQueryData." />
          <div className="grid grid-cols-3 gap-3 p-3">
            <Stat label="server events" value={`v${sim.server.events}`} hint={`cache: ${sim.cache['["events"]']?.dataVersion ? "v" + sim.cache['["events"]']?.dataVersion : "—"}`} />
            <Stat label="server event 1" value={`v${sim.server["event-1"]}`} hint={`cache: ${sim.cache['["events",1]']?.dataVersion ? "v" + sim.cache['["events",1]']?.dataVersion : "—"}`} />
            <Stat label="HTTP requests" value={sim.requests} hint="incl. mutations & retries" />
          </div>
          <div className="flex flex-wrap gap-2 border-t border-line p-3">
            <Button size="sm" onClick={() => mutate("create")}>Mutation: create event</Button>
            <Button size="sm" onClick={() => mutate("update1")}>Mutation: update event 1</Button>
          </div>
          <div className="flex flex-wrap gap-2 border-t border-line p-3">
            <span className="w-full text-xs text-fg-2">invalidateQueries (prefix match):</span>
            <Button size="sm" variant="primary" onClick={() => invalidate(["events"])}>["events"]</Button>
            <Button size="sm" onClick={() => invalidate(["events", 1])}>["events", 1]</Button>
            <Button size="sm" onClick={() => invalidate(["categories"])}>["categories"]</Button>
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader title="Query cache" subtitle="What the QueryClient holds right now" />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-xs">
            <thead className="bg-elevated text-fg-2">
              <tr>{["queryKey", "data", "dataUpdatedAt", "status", "fetchStatus", "fresh/stale", "observers", "isPending / isFetching / isLoading", "gc"].map((h) => <th key={h} className="px-2 py-1.5 font-medium">{h}</th>)}</tr>
            </thead>
            <tbody>
              {KEYS.filter((k) => sim.cache[k]).length === 0 && (
                <tr><td colSpan={9} className="px-2 py-4 text-center text-fg-3">Cache is empty — mount a component to create an entry.</td></tr>
              )}
              {KEYS.map((k) => {
                const e = sim.cache[k];
                if (!e) return null;
                const obs = observers(k, sim.mounted);
                const stale = isStale(e, sim.clock);
                const freshLeft = e.dataUpdatedAt !== null && cfg[k].staleTime !== Infinity ? Math.max(0, e.dataUpdatedAt + cfg[k].staleTime - sim.clock) : null;
                return (
                  <tr key={k} onClick={() => setSelKey(k)} className={cn("cursor-pointer border-t border-line", selKey === k && "bg-primary-soft")}>
                    <td className="px-2 py-1.5 font-mono text-fg">{k}</td>
                    <td className="px-2 py-1.5 font-mono">{e.dataVersion === null ? "undefined" : `v${e.dataVersion}`}{e.dataVersion !== null && e.dataVersion !== sim.server[RESOURCE[k][0]] && <Badge tone="warning" className="ml-1">behind server</Badge>}</td>
                    <td className="px-2 py-1.5 font-mono">{e.dataUpdatedAt === null ? "—" : clockFmt(e.dataUpdatedAt)}</td>
                    <td className="px-2 py-1.5"><Badge tone={e.status === "success" ? "success" : e.status === "error" ? "error" : "primary"}>{e.status}</Badge>{e.failureCount > 0 && <span className="ml-1 text-err">×{e.failureCount}</span>}</td>
                    <td className="px-2 py-1.5"><Badge tone={e.fetchStatus === "fetching" ? "violet" : "neutral"}>{e.fetchStatus}</Badge></td>
                    <td className="px-2 py-1.5">{stale ? <Badge tone="warning">stale{e.invalidated ? " (invalidated)" : ""}</Badge> : <Badge tone="success">fresh{freshLeft !== null ? ` ${Math.ceil(freshLeft / 1000)}s` : " ∞"}</Badge>}</td>
                    <td className="px-2 py-1.5 tabular-nums">{obs}{obs === 0 && <span className="ml-1 text-fg-3">(inactive)</span>}</td>
                    <td className="px-2 py-1.5 font-mono">{String(e.status === "pending")} / {String(e.fetchStatus === "fetching")} / {String(e.status === "pending" && e.fetchStatus === "fetching")}</td>
                    <td className="px-2 py-1.5 tabular-nums">{e.inactiveSince === null ? <span className="text-fg-3">— (active)</span> : `${Math.max(0, Math.ceil((e.inactiveSince + cfg[k].gcTime - sim.clock) / 1000))}s left`}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="flex flex-wrap items-center gap-1 border-t border-line p-3 text-xs" aria-label="Lifecycle of selected query">
          <span className="mr-1 font-mono text-fg-2">{selKey}:</span>
          {PHASES.map((p, i) => (
            <span key={p} className={cn("rounded px-2 py-1", i === phase ? "bg-primary text-on-primary" : "bg-elevated text-fg-3")}>{p}{i < PHASES.length - 1 && " →"}</span>
          ))}
          {phase === -1 && <span className="text-fg-3">(no entry)</span>}
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <CodeBlock code={code} language="tsx" title="Selected query — highlighted lines relate to your last action" highlightLines={hl} runnable={false} />
        <Card>
          <CardHeader title="Event log" subtitle="Newest first" />
          <ul className="max-h-72 space-y-1 overflow-y-auto p-3 font-mono text-[11px]" aria-live="polite">
            {sim.log.length === 0 && <li className="text-fg-3">Mount &lt;EventsPage /&gt; to begin.</li>}
            {sim.log.map((l, i) => (
              <li key={i} className={cn(l.tone === "ok" && "text-ok", l.tone === "warn" && "text-warn", l.tone === "err" && "text-err", l.tone === "info" && "text-fg-2")}>
                [{clockFmt(l.t)}] {l.msg}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Callout tone="primary" title="Rules this simulator follows (v5)">
        Fresh while age &lt; staleTime → mounting serves cache with no request. Stale → refetch on mount / window focus / reconnect for <em>active</em> queries.
        gcTime only counts down when observers = 0. invalidateQueries marks prefix matches stale and refetches the active ones; inactive ones refetch on next mount.
        isPending = no data yet; isFetching = any request in flight (including background refetches); a mutation by itself never touches the cache.
        Real retries back off exponentially (1s, 2s, 4s…) — here they are collapsed into one step but counted.
      </Callout>
    </div>
  );
}
