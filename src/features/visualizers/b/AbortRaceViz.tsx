import { useEffect, useRef, useState } from "react";
import { Shuffle, Timer, Unplug } from "lucide-react";
import { Badge, Button, Callout, Card, CardHeader, Segmented } from "@/components/ui/primitives";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { cn } from "@/lib/cn";
import { SimBanner, inputCls, useMarkOnce } from "./shared";

type Strategy = "none" | "abort" | "ignore";
interface Req { id: number; query: string; start: number; latency: number; status: "pending" | "done" | "aborted" | "ignored" | "applied"; endAt?: number }

const CODE: Record<Strategy, string> = {
  none: `useEffect(() => {
  fetch(\`/api/events?search=\${query}\`)
    .then((r) => r.json())
    .then((data) => setResults(data)); // whoever finishes LAST wins
}, [query]);`,
  abort: `useEffect(() => {
  const controller = new AbortController();
  fetch(\`/api/events?search=\${query}\`, { signal: controller.signal })
    .then((r) => r.json())
    .then((data) => setResults(data))
    .catch((err) => {
      if (err.name !== "AbortError") setError(err);
    });
  return () => controller.abort(); // cancel previous request
}, [query]);`,
  ignore: `useEffect(() => {
  let ignore = false;
  fetch(\`/api/events?search=\${query}\`)
    .then((r) => r.json())
    .then((data) => {
      if (!ignore) setResults(data); // stale responses dropped
    });
  return () => { ignore = true; };
}, [query]);`,
};
const HL: Record<Strategy, number[]> = { none: [4], abort: [2, 3, 7, 9], ignore: [2, 6, 8] };

const WORDS = ["r", "re", "rea", "reac", "react"];

export default function AbortRaceViz() {
  const mark = useMarkOnce("abort-race");
  const [strategy, setStrategy] = useState<Strategy>("none");
  const [reqs, setReqs] = useState<Req[]>([]);
  const [now, setNow] = useState(0);
  const [query, setQuery] = useState("");
  const [shown, setShown] = useState<string | null>(null);
  const [mounted, setMounted] = useState(true);
  const t0 = useRef(performance.now());
  const nextId = useRef(1);
  const latestId = useRef(0);

  // clock
  useEffect(() => {
    const t = setInterval(() => setNow(performance.now() - t0.current), 50);
    return () => clearInterval(t);
  }, []);

  // resolve requests whose latency has elapsed
  useEffect(() => {
    let changed = false;
    let newShown = shown;
    const next = reqs.map((r) => {
      if (r.status !== "pending" || now < r.start + r.latency) return r;
      changed = true;
      const latest = r.id === latestId.current && mounted;
      if (strategy === "none") {
        if (!mounted) return { ...r, status: "applied" as const, endAt: now }; // setState on unmounted component — wasted / bug
        newShown = r.query;
        return { ...r, status: "applied" as const, endAt: now };
      }
      // abort/ignore: only the request belonging to the current effect run is applied
      if (latest) { newShown = r.query; return { ...r, status: "applied" as const, endAt: now }; }
      return { ...r, status: "ignored" as const, endAt: now };
    });
    if (changed) { setReqs(next); setShown(newShown); }
  }, [now, reqs, query, strategy, mounted, shown]);

  const type = (q: string) => {
    const start = performance.now() - t0.current;
    setQuery(q);
    const id = nextId.current++;
    latestId.current = id;
    setReqs((rs) => {
      const updated = strategy === "abort" ? rs.map((r) => (r.status === "pending" ? { ...r, status: "aborted" as const, endAt: start } : r)) : rs;
      return [...updated, { id, query: q, start, latency: 300 + Math.random() * 1700, status: "pending" }];
    });
    mark();
  };
  const runBurst = () => {
    reset();
    WORDS.forEach((w, i) => setTimeout(() => type(w), i * 180));
  };
  const reset = () => {
    t0.current = performance.now();
    setReqs([]); setQuery(""); setShown(null); setNow(0); setMounted(true);
  };
  const unmount = () => {
    setMounted(false);
    if (strategy === "abort") setReqs((rs) => rs.map((r) => (r.status === "pending" ? { ...r, status: "aborted", endAt: now } : r)));
    mark();
  };

  const maxT = Math.max(2500, ...reqs.map((r) => r.start + r.latency + 100), now);
  const allSettled = reqs.length > 0 && reqs.every((r) => r.status !== "pending");
  const stale = allSettled && mounted && shown !== null && shown !== query;

  return (
    <div className="space-y-4">
      <SimBanner>Requests and latencies are simulated (random 300–2000 ms) so responses can come back out of order.</SimBanner>
      <div className="flex flex-wrap items-center gap-3">
        <Segmented label="Cleanup strategy" value={strategy} onChange={(v) => { setStrategy(v); reset(); }} options={[
          { value: "none", label: "No cleanup" }, { value: "abort", label: "AbortController" }, { value: "ignore", label: "Ignore flag" },
        ]} />
        <Button size="sm" variant="primary" onClick={runBurst}><Shuffle size={14} /> Type “react” fast</Button>
        <Button size="sm" onClick={unmount} disabled={!mounted}><Unplug size={14} /> Unmount component</Button>
        <Button size="sm" variant="ghost" onClick={reset}>Reset</Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_380px]">
        <Card>
          <CardHeader icon={<Timer size={16} />} title="Request timeline" subtitle="Each bar = one fetch. Bars end when the response arrives." />
          <div className="space-y-3 p-3">
            <label className="block text-xs text-fg-2">Search box (each keystroke changes <code>query</code> → effect re-runs)
              <input className={cn(inputCls, "mt-1")} value={query} disabled={!mounted} onChange={(e) => type(e.target.value)} placeholder="type here or use the button" />
            </label>
            <div className="space-y-1.5">
              {reqs.length === 0 && <p className="text-xs text-fg-3">No requests yet.</p>}
              {reqs.map((r) => {
                const end = r.endAt ?? Math.min(now, r.start + r.latency);
                return (
                  <div key={r.id} className="flex items-center gap-2 text-xs">
                    <span className="w-14 shrink-0 font-mono text-fg-2">"{r.query}"</span>
                    <div className="relative h-5 flex-1 rounded bg-elevated">
                      <div className={cn("absolute top-0 h-5 rounded", r.status === "pending" ? "bg-primary/40" : r.status === "applied" ? "bg-ok/60" : r.status === "aborted" ? "bg-err/50" : "bg-fg-3/40")}
                        style={{ left: `${(r.start / maxT) * 100}%`, width: `${Math.max(1, ((end - r.start) / maxT) * 100)}%` }} />
                    </div>
                    <Badge tone={r.status === "applied" ? "success" : r.status === "aborted" ? "error" : r.status === "ignored" ? "neutral" : "primary"}>
                      {r.status === "applied" ? (mounted || strategy !== "none" ? "setResults()" : "setState after unmount") : r.status}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
        <div className="space-y-3">
          <Card className="p-3" aria-live="polite">
            <div className="text-xs text-fg-2">Component state</div>
            <div className="mt-1 text-sm">query = <code className="font-mono">"{query}"</code></div>
            <div className="text-sm">results shown for = <code className="font-mono">{shown === null ? "—" : `"${shown}"`}</code></div>
            <div className="mt-2">
              {!mounted ? <Badge tone={strategy === "abort" ? "success" : "warning"}>{strategy === "abort" ? "Unmounted — pending requests aborted" : strategy === "ignore" ? "Unmounted — late responses ignored (request still ran)" : "Unmounted — late responses still call setState"}</Badge>
                : stale ? <Badge tone="error">STALE RESULT BUG: shows "{shown}" but query is "{query}"</Badge>
                  : allSettled && shown !== null ? <Badge tone="success">Correct: results match the query</Badge> : <Badge>waiting…</Badge>}
            </div>
          </Card>
          <CodeBlock code={CODE[strategy]} language="tsx" title="SearchEvents.tsx" highlightLines={new Set(HL[strategy])} runnable={false} />
        </div>
      </div>
      <Callout tone="primary" title="Why it happens">
        Each keystroke starts a new request, but the network doesn't promise ordering. Without cleanup, the last response to <em>arrive</em> wins, not the last one <em>sent</em>.
        AbortController cancels the old request (fetch rejects with an AbortError, which you ignore); the ignore flag lets it finish but drops its result. TanStack Query handles this for you by keying data by query.
      </Callout>
    </div>
  );
}
