import { useMemo, useState } from "react";
import { Badge, Callout, Segmented } from "@/components/ui/primitives";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { cn } from "@/lib/cn";
import { Panel, StepControls, inputCls } from "./StepControls";
import { useStepper } from "./useStepper";

/** An update is either a replacement value or an updater function n => n + k. */
type Update = { kind: "value"; expr: string; value: (snap: number) => number } | { kind: "fn"; expr: string; fn: (n: number) => number };

interface Variant {
  id: string;
  label: string;
  updates: Update[];
}
const inc: Update = { kind: "fn", expr: "c => c + 1", fn: (n) => n + 1 };
const VARIANTS: Variant[] = [
  { id: "value", label: "count + 1 ×3", updates: [0, 1, 2].map(() => ({ kind: "value", expr: "count + 1", value: (s: number) => s + 1 })) },
  { id: "fn", label: "c => c + 1 ×3", updates: [inc, inc, inc] },
  { id: "mixed", label: "count + 5, then c => c + 1", updates: [{ kind: "value", expr: "count + 5", value: (s) => s + 5 }, inc] },
  { id: "mixed2", label: "+5, c => c+1, 42", updates: [{ kind: "value", expr: "count + 5", value: (s) => s + 5 }, inc, { kind: "value", expr: "42", value: () => 42 }] },
];

interface Frame {
  line: number | null;
  phase: "event" | "render" | "done";
  queue: { label: string; status: "queued" | "processing" | "done"; result?: number }[];
  snapshot: number;
  working: number | null;
  logs: string[];
  rendered: number;
  note: string;
}

function build(v: Variant, start: number): Frame[] {
  const frames: Frame[] = [];
  const queue: Frame["queue"] = [];
  const logs: string[] = [];
  const push = (f: Omit<Frame, "queue" | "logs" | "snapshot">) => frames.push({ ...f, snapshot: start, queue: queue.map((q) => ({ ...q })), logs: [...logs] });

  push({ line: 1, phase: "event", working: null, rendered: start, note: `Click! The handler runs with the state SNAPSHOT from the last render: count = ${start}. It stays ${start} for the whole handler.` });
  v.updates.forEach((u, i) => {
    const label = u.kind === "value" ? `replace with ${u.value(start)}  (${u.expr} → ${u.value(start)})` : `updater ${u.expr}`;
    queue.push({ label, status: "queued" });
    push({
      line: i + 2,
      phase: "event",
      working: null,
      rendered: start,
      note: u.kind === "value"
        ? `setCount(${u.expr}) — ${u.expr} is evaluated NOW using the snapshot (${start}), so React queues “replace with ${u.value(start)}”. count itself does not change.`
        : `setCount(${u.expr}) — React queues the FUNCTION. It will be called later with the pending state.`,
    });
  });
  logs.push(String(start));
  push({ line: v.updates.length + 2, phase: "event", working: null, rendered: start, note: `console.log(count) prints ${start}: setState never changes the variable in the current render. Updates are batched.` });
  push({ line: null, phase: "event", working: null, rendered: start, note: "Handler finished. React batches all queued updates and schedules ONE re-render." });

  let n = start;
  push({ line: null, phase: "render", working: n, rendered: start, note: `Next render: useState(…) processes the queue in order, starting from the current state ${n}.` });
  v.updates.forEach((u, i) => {
    const before = n;
    n = u.kind === "value" ? u.value(start) : u.fn(n);
    queue[i] = { ...queue[i], status: "done", result: n };
    push({
      line: null,
      phase: "render",
      working: n,
      rendered: start,
      note: u.kind === "value" ? `“replace with ${n}”: ignores the pending value ${before} → ${n}.` : `Call (${u.expr})(${before}) → ${n}. Updaters receive the latest pending value.`,
    });
  });
  push({ line: null, phase: "done", working: n, rendered: n, note: `Render uses count = ${n}; the UI now shows ${n}. One click, one re-render, ${v.updates.length} queued updates.` });
  return frames;
}

export default function StateQueueViz() {
  const [vid, setVid] = useState(VARIANTS[0].id);
  const [start, setStart] = useState(0);
  const v = VARIANTS.find((x) => x.id === vid) ?? VARIANTS[0];
  const frames = useMemo(() => build(v, start), [v, start]);
  const s = useStepper(frames.length, "react-state-queue");
  const f = frames[s.step];

  const code = `function handleClick() {\n${v.updates.map((u) => `  setCount(${u.expr});`).join("\n")}\n  console.log(count);\n}`;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <Segmented label="Handler variant" value={vid} onChange={(x) => { setVid(x); s.reset(); }} options={VARIANTS.map((x) => ({ value: x.id, label: x.label }))} />
        <label className="flex flex-col gap-1 text-xs text-fg-2">
          count before click
          <input type="number" className={cn(inputCls, "w-24")} value={start} onChange={(e) => { setStart(Number(e.target.value) || 0); s.reset(); }} />
        </label>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-3">
          <CodeBlock code={code} language="jsx" title="Counter.jsx" highlightLines={new Set(f.line ? [f.line] : [])} runnable={false} />
          <div className="flex flex-wrap gap-2">
            <Badge tone={f.phase === "event" ? "primary" : "neutral"}>1. event handler</Badge>
            <Badge tone={f.phase === "render" ? "violet" : "neutral"}>2. re-render processes queue</Badge>
            <Badge tone={f.phase === "done" ? "success" : "neutral"}>3. committed</Badge>
          </div>
        </div>
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-2">
            <Panel title="Snapshot (count)"><p className="font-mono text-lg text-fg">{f.snapshot}</p></Panel>
            <Panel title="Pending value" tone="violet"><p className="font-mono text-lg text-fg">{f.working ?? "—"}</p></Panel>
            <Panel title="On screen" tone="ok"><p className="font-mono text-lg text-fg">{f.rendered}</p></Panel>
          </div>
          <Panel title="Update queue" tone="primary">
            {f.queue.length === 0 ? (
              <p className="text-xs italic text-fg-3">empty</p>
            ) : (
              <ol className="space-y-1">
                {f.queue.map((q, i) => (
                  <li key={i} className={cn("flex items-center justify-between gap-2 rounded border px-2 py-1 font-mono text-[11px]", q.status === "done" ? "border-ok/40 bg-ok-soft" : "border-line bg-surface")}>
                    <span className="text-fg">{i + 1}. {q.label}</span>
                    {q.result !== undefined && <span className="text-ok">→ {q.result}</span>}
                  </li>
                ))}
              </ol>
            )}
          </Panel>
          <Panel title="Console"><p className="font-mono text-xs text-fg">{f.logs.length ? `> ${f.logs.join("\n> ")}` : "—"}</p></Panel>
        </div>
      </div>
      <Callout tone={f.phase === "done" ? "success" : "primary"} title={f.phase === "done" ? `Final state: ${f.rendered}` : `Step ${s.step + 1}`}>
        <span aria-live="polite">{f.note}</span>
      </Callout>
      <StepControls s={s} />
    </div>
  );
}
