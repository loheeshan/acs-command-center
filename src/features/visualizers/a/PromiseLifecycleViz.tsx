import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Badge, Button, Callout, Segmented } from "@/components/ui/primitives";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { cn } from "@/lib/cn";
import { StepControls, inputCls } from "./StepControls";
import { useStepper } from "./useStepper";

interface Task {
  name: string;
  ms: number;
  ok: boolean;
}
type Combo = "all" | "allSettled" | "race" | "any" | "sequential";
interface Sched {
  name: string;
  start: number | null; // null = never started
  end: number | null;
  ok: boolean;
}
interface Outcome {
  at: number | null; // null = never settles
  ok: boolean;
  value: string;
  why: string;
}

const TICK = 250;
const val = (t: Task) => (t.ok ? `"${t.name} data"` : `Error("${t.name} failed")`);

function schedule(tasks: Task[], combo: Combo): Sched[] {
  if (combo !== "sequential") return tasks.map((t) => ({ name: t.name, start: 0, end: t.ms, ok: t.ok }));
  let clock = 0;
  let stopped = false;
  return tasks.map((t) => {
    if (stopped) return { name: t.name, start: null, end: null, ok: t.ok };
    const s = { name: t.name, start: clock, end: clock + t.ms, ok: t.ok };
    clock += t.ms;
    if (!t.ok) stopped = true;
    return s;
  });
}

function outcome(tasks: Task[], sch: Sched[], combo: Combo): Outcome {
  // order by settle time; ties resolve in input order (timers registered in that order)
  const byTime = sch.map((s, i) => ({ s, i })).filter((x) => x.s.end !== null).sort((a, b) => (a.s.end ?? 0) - (b.s.end ?? 0) || a.i - b.i);
  const last = Math.max(...sch.map((s) => s.end ?? 0));
  const firstRej = byTime.find((x) => !x.s.ok);
  switch (combo) {
    case "all":
      if (firstRej) return { at: firstRej.s.end, ok: false, value: val(tasks[firstRej.i]), why: `Promise.all rejects as soon as ANY input rejects (${firstRej.s.name}). The other operations are NOT cancelled — they keep running, their results are just ignored.` };
      return { at: last, ok: true, value: `[${tasks.map(val).join(", ")}]`, why: "Every input fulfilled, so all() fulfils when the SLOWEST finishes, with values in INPUT order (not finish order)." };
    case "allSettled":
      return { at: last, ok: true, value: `[${tasks.map((t) => (t.ok ? `{fulfilled}` : `{rejected}`)).join(", ")}]`, why: "allSettled never rejects: it waits for every input and reports each one's status and value/reason." };
    case "race": {
      const w = byTime[0];
      return { at: w.s.end, ok: w.s.ok, value: val(tasks[w.i]), why: `race settles like the FIRST input to settle (${w.s.name}) — whether that is a fulfilment or a rejection.` };
    }
    case "any": {
      const w = byTime.find((x) => x.s.ok);
      if (w) return { at: w.s.end, ok: true, value: val(tasks[w.i]), why: `any fulfils with the first FULFILLED input (${w.s.name}); earlier rejections are ignored.` };
      return { at: last, ok: false, value: "AggregateError: All promises were rejected", why: "Every input rejected, so any() rejects with an AggregateError once the last one fails." };
    }
    case "sequential": {
      const failed = sch.find((s) => !s.ok && s.end !== null);
      const end = Math.max(...sch.map((s) => s.end ?? 0));
      if (failed) return { at: failed.end, ok: false, value: `Error("${failed.name} failed")`, why: `await throws on the rejection of ${failed.name}; the loop stops, so later tasks never even START. Total time is the SUM of durations — no parallelism.` };
      return { at: end, ok: true, value: `[${tasks.map(val).join(", ")}]`, why: "Each await waits for the previous task, so total time = sum of durations. Use Promise.all when tasks are independent." };
    }
  }
}

const CODE: Record<Combo, string> = {
  all: `const promises = tasks.map((t) => t());   // all start now\nconst result = await Promise.all(promises);`,
  allSettled: `const promises = tasks.map((t) => t());\nconst result = await Promise.allSettled(promises);`,
  race: `const promises = tasks.map((t) => t());\nconst result = await Promise.race(promises);`,
  any: `const promises = tasks.map((t) => t());\nconst result = await Promise.any(promises);`,
  sequential: `const result = [];\nfor (const t of tasks) {\n  result.push(await t());  // waits before starting the next\n}`,
};

export default function PromiseLifecycleViz() {
  const [tasks, setTasks] = useState<Task[]>([
    { name: "A", ms: 1000, ok: true },
    { name: "B", ms: 2000, ok: false },
    { name: "C", ms: 1500, ok: true },
  ]);
  const [combo, setCombo] = useState<Combo>("all");
  const sch = useMemo(() => schedule(tasks, combo), [tasks, combo]);
  const out = useMemo(() => outcome(tasks, sch, combo), [tasks, sch, combo]);
  const horizon = Math.max(...sch.map((s) => s.end ?? 0), out.at ?? 0);
  const ticks = Math.ceil(horizon / TICK) + 1;
  const s = useStepper(ticks, "promise-lifecycle");
  const now = s.step * TICK;
  const pct = (ms: number) => `${(ms / Math.max(horizon, 1)) * 100}%`;
  const settled = out.at !== null && now >= out.at;

  const update = (i: number, patch: Partial<Task>) => {
    setTasks((ts) => ts.map((t, j) => (j === i ? { ...t, ...patch } : t)));
    s.reset();
  };

  const stateAt = (x: Sched) => (x.start === null || now < x.start ? "not started" : x.end !== null && now >= x.end ? (x.ok ? "fulfilled" : "rejected") : "pending");

  return (
    <div className="space-y-4">
      <Segmented label="Combinator" value={combo} onChange={(c) => { setCombo(c); s.reset(); }} options={[{ value: "all", label: "all" }, { value: "allSettled", label: "allSettled" }, { value: "race", label: "race" }, { value: "any", label: "any" }, { value: "sequential", label: "sequential await" }]} />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="space-y-3">
          <ul className="space-y-2" aria-label="Simulated tasks">
            {tasks.map((t, i) => (
              <li key={i} className="flex flex-wrap items-center gap-2 rounded-md border border-line bg-elevated/60 p-2 text-xs">
                <span className="w-5 font-mono font-semibold text-fg">{t.name}</span>
                <label className="flex items-center gap-1 text-fg-2">
                  duration
                  <input type="number" min={250} max={4000} step={250} value={t.ms} className={cn(inputCls, "w-20")} onChange={(e) => update(i, { ms: Math.min(4000, Math.max(250, Number(e.target.value) || 250)) })} />
                  ms
                </label>
                <Segmented size="sm" label={`Task ${t.name} outcome`} value={t.ok ? "ok" : "fail"} onChange={(v) => update(i, { ok: v === "ok" })} options={[{ value: "ok", label: "resolve" }, { value: "fail", label: "reject" }]} />
                <Button size="sm" variant="ghost" aria-label={`Remove task ${t.name}`} disabled={tasks.length <= 1} onClick={() => { setTasks((ts) => ts.filter((_, j) => j !== i)); s.reset(); }}>
                  <Trash2 size={13} />
                </Button>
              </li>
            ))}
          </ul>
          <Button size="sm" disabled={tasks.length >= 5} onClick={() => { setTasks((ts) => [...ts, { name: String.fromCharCode(65 + ts.length), ms: 750, ok: true }]); s.reset(); }}>
            <Plus size={13} /> Add task
          </Button>
          <CodeBlock code={CODE[combo]} language="js" title="combine.js" highlightLines={new Set([settled ? CODE[combo].split("\n").length : 1])} runnable={false} />
        </div>

        <div className="space-y-2 rounded-md border border-line bg-elevated/40 p-3">
          <div className="flex justify-between text-[11px] text-fg-3">
            <span>0 ms</span>
            <span className="font-mono text-fg">t = {now} ms (simulated)</span>
            <span>{horizon} ms</span>
          </div>
          {sch.map((x) => {
            const st = stateAt(x);
            const visibleEnd = x.start === null ? 0 : Math.min(now, x.end ?? now);
            return (
              <div key={x.name} className="grid grid-cols-[2rem_minmax(0,1fr)_6rem] items-center gap-2 text-xs">
                <span className="font-mono text-fg">{x.name}</span>
                <div className="relative h-5 rounded bg-surface">
                  {x.start !== null && x.end !== null && <div className="absolute inset-y-0 rounded border border-dashed border-line-strong" style={{ left: pct(x.start), width: pct(x.end - x.start) }} />}
                  {x.start !== null && now > x.start && (
                    <div className={cn("absolute inset-y-0 rounded", st === "fulfilled" ? "bg-ok/70" : st === "rejected" ? "bg-err/70" : "bg-primary/50")} style={{ left: pct(x.start), width: pct(visibleEnd - x.start) }} />
                  )}
                  <div className="absolute inset-y-[-4px] w-px bg-fg" style={{ left: pct(now) }} aria-hidden />
                </div>
                <Badge tone={st === "fulfilled" ? "success" : st === "rejected" ? "error" : st === "pending" ? "primary" : "neutral"}>{st}</Badge>
              </div>
            );
          })}
          <div className="grid grid-cols-[2rem_minmax(0,1fr)_6rem] items-center gap-2 border-t border-line pt-2 text-xs">
            <span className="font-semibold text-fg">⇒</span>
            <span className="truncate font-mono text-fg-2">combined promise</span>
            <Badge tone={!settled ? "primary" : out.ok ? "success" : "error"}>{!settled ? "pending" : out.ok ? "fulfilled" : "rejected"}</Badge>
          </div>
        </div>
      </div>

      <Callout tone={!settled ? "primary" : out.ok ? "success" : "error"} title={settled ? `Settled at ${out.at} ms → ${out.value}` : "Waiting…"}>
        <span aria-live="polite">{settled ? out.why : "Pending promises have no value yet. Step the simulated clock forward."}</span>
      </Callout>
      <StepControls s={s} label="Tick" />
    </div>
  );
}
