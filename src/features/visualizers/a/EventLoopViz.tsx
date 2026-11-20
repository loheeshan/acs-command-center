import { useMemo, useState } from "react";
import { Badge, Button, Callout, Segmented } from "@/components/ui/primitives";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { cn } from "@/lib/cn";
import { Panel, StepControls } from "./StepControls";
import { useStepper } from "./useStepper";

interface Frame {
  line: number;
  stack: string[];
  web: string[];
  micro: string[];
  tasks: string[];
  out: string[];
  note: string;
}

/** Tiny trace builder: mutate the model, then snapshot it with a note. */
function tracer() {
  const m = { stack: [] as string[], web: [] as string[], micro: [] as string[], tasks: [] as string[], out: [] as string[] };
  const frames: Frame[] = [];
  const snap = (line: number, note: string) =>
    frames.push({ line, note, stack: [...m.stack], web: [...m.web], micro: [...m.micro], tasks: [...m.tasks], out: [...m.out] });
  const rm = (arr: string[], v: string) => arr.splice(arr.indexOf(v), 1);
  return { m, frames, snap, rm };
}

interface Preset {
  id: string;
  label: string;
  code: string;
  build: () => Frame[];
}

const PRESETS: Preset[] = [
  {
    id: "basic",
    label: "timeout vs then",
    code: `console.log("A");
setTimeout(() => {
  console.log("B");
}, 0);
Promise.resolve().then(() => {
  console.log("C");
});
console.log("D");`,
    build: () => {
      const { m, frames, snap, rm } = tracer();
      m.stack.push("script (main task)");
      snap(1, "The whole script runs as one task. The call stack now holds the top-level script.");
      m.out.push("A");
      snap(1, 'console.log("A") runs synchronously and prints immediately.');
      m.web.push("timer 0ms → () => log B");
      snap(2, "setTimeout hands the callback to the browser's timer (a Web API). JS does not wait for it.");
      rm(m.web, "timer 0ms → () => log B");
      m.tasks.push("timeout cb (B)");
      snap(2, "The 0 ms timer expires; the callback is queued in the TASK queue. It cannot run while the stack is busy.");
      m.micro.push("then cb (C)");
      snap(5, "The promise is already fulfilled, so its .then reaction is queued as a MICROTASK right away.");
      m.out.push("D");
      snap(8, 'console.log("D") — still synchronous code, so it runs before any queued callback.');
      m.stack.pop();
      snap(8, "Script finished; the call stack is empty. The event loop now drains ALL microtasks before taking another task.");
      rm(m.micro, "then cb (C)");
      m.stack.push("then cb (C)");
      m.out.push("C");
      snap(6, "Microtask runs: prints C. Microtasks always beat tasks queued earlier.");
      m.stack.pop();
      snap(6, "Microtask queue empty. (The browser may render here.) Next: take ONE task from the task queue.");
      rm(m.tasks, "timeout cb (B)");
      m.stack.push("timeout cb (B)");
      m.out.push("B");
      snap(3, "The timeout callback finally runs: prints B. Even a 0 ms timer waits for sync code + microtasks.");
      m.stack.pop();
      snap(3, "All queues empty. Final order: A, D, C, B.");
      return frames;
    },
  },
  {
    id: "async",
    label: "async / await",
    code: `async function run() {
  console.log("run start");
  await null;
  console.log("after await");
}
console.log("script start");
setTimeout(() => console.log("timeout"), 0);
run();
Promise.resolve().then(() => console.log("then"));
console.log("script end");`,
    build: () => {
      const { m, frames, snap, rm } = tracer();
      m.stack.push("script (main task)");
      snap(1, "Declaring run() just creates the function; nothing inside it executes yet.");
      m.out.push("script start");
      snap(6, "Synchronous log.");
      m.web.push("timer 0ms → log timeout");
      snap(7, "setTimeout registers a timer with the browser.");
      rm(m.web, "timer 0ms → log timeout");
      m.tasks.push("timeout cb");
      snap(7, "Timer expires → callback waits in the task queue.");
      m.stack.push("run()");
      snap(8, "Calling an async function runs its body SYNCHRONOUSLY up to the first await.");
      m.out.push("run start");
      snap(2, '"run start" prints synchronously — async does not mean "later" for this part.');
      m.stack.pop();
      m.micro.push("resume run() after await");
      snap(3, "await pauses run(): the rest of the function is scheduled as a microtask, and run() returns a pending promise to the caller.");
      m.micro.push("then cb");
      snap(9, "The .then reaction is queued as a microtask BEHIND the run() continuation (FIFO).");
      m.out.push("script end");
      snap(10, "Last synchronous line.");
      m.stack.pop();
      snap(10, "Stack empty → drain the microtask queue completely.");
      rm(m.micro, "resume run() after await");
      m.stack.push("run() (resumed)");
      m.out.push("after await");
      snap(4, "run() resumes after await and prints. Its returned promise now fulfils.");
      m.stack.pop();
      rm(m.micro, "then cb");
      m.stack.push("then cb");
      m.out.push("then");
      snap(9, "Next microtask: the .then callback.");
      m.stack.pop();
      snap(9, "Microtasks drained. Now one task may run.");
      rm(m.tasks, "timeout cb");
      m.stack.push("timeout cb");
      m.out.push("timeout");
      snap(7, "The timeout callback runs last.");
      m.stack.pop();
      snap(7, "Done: script start, run start, script end, after await, then, timeout.");
      return frames;
    },
  },
  {
    id: "nested",
    label: "microtasks between tasks",
    code: `setTimeout(() => {
  console.log("T1");
  Promise.resolve().then(() => console.log("M-in-T1"));
}, 0);
setTimeout(() => console.log("T2"), 0);
Promise.resolve()
  .then(() => console.log("M1"))
  .then(() => console.log("M2"));
console.log("sync");`,
    build: () => {
      const { m, frames, snap, rm } = tracer();
      m.stack.push("script (main task)");
      m.web.push("timer → T1 cb");
      snap(1, "First timer registered.");
      m.web.push("timer → T2 cb");
      snap(5, "Second timer registered.");
      rm(m.web, "timer → T1 cb");
      rm(m.web, "timer → T2 cb");
      m.tasks.push("T1 cb", "T2 cb");
      snap(5, "Both timers expire in order; their callbacks queue as two separate TASKS.");
      m.micro.push("then M1");
      snap(7, "First .then is queued (the promise is already resolved). The second .then waits on the promise returned by the first — nothing queued for it yet.");
      m.out.push("sync");
      snap(9, "Synchronous log.");
      m.stack.pop();
      snap(9, "Script done. Drain microtasks.");
      rm(m.micro, "then M1");
      m.stack.push("then M1");
      m.out.push("M1");
      snap(7, "M1 prints. When this callback returns, its promise fulfils…");
      m.stack.pop();
      m.micro.push("then M2");
      snap(8, "…so the M2 reaction is queued NOW. The loop keeps draining, including microtasks added during draining.");
      rm(m.micro, "then M2");
      m.stack.push("then M2");
      m.out.push("M2");
      snap(8, "M2 prints before any timer callback.");
      m.stack.pop();
      snap(8, "Microtask queue empty → run ONE task.");
      rm(m.tasks, "T1 cb");
      m.stack.push("T1 cb");
      m.out.push("T1");
      snap(2, "Task T1 runs and prints.");
      m.micro.push("then M-in-T1");
      snap(3, "Inside the task, a new microtask is queued.");
      m.stack.pop();
      snap(3, "T1 finished. Before the next task (T2), ALL microtasks are drained again.");
      rm(m.micro, "then M-in-T1");
      m.stack.push("then M-in-T1");
      m.out.push("M-in-T1");
      snap(3, "M-in-T1 prints — it jumps ahead of T2 even though T2 was queued long before.");
      m.stack.pop();
      rm(m.tasks, "T2 cb");
      m.stack.push("T2 cb");
      m.out.push("T2");
      snap(5, "Finally task T2 runs.");
      m.stack.pop();
      snap(5, "Order: sync, M1, M2, T1, M-in-T1, T2.");
      return frames;
    },
  },
];

function Column({ title, items, tone, empty = "empty" }: { title: string; items: string[]; tone?: "primary" | "ok" | "warn" | "violet"; empty?: string }) {
  return (
    <Panel title={title} tone={tone} className="min-h-28">
      {items.length === 0 ? (
        <p className="text-xs italic text-fg-3">{empty}</p>
      ) : (
        <ul className="space-y-1">
          {items.map((it, i) => (
            <li key={i} className="rounded border border-line bg-surface px-2 py-1 font-mono text-[11px] text-fg">
              {it}
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}

export default function EventLoopViz() {
  const [presetId, setPresetId] = useState(PRESETS[0].id);
  const preset = PRESETS.find((p) => p.id === presetId) ?? PRESETS[0];
  const frames = useMemo(() => preset.build(), [preset]);
  const s = useStepper(frames.length, "event-loop");
  const f = frames[s.step];
  const finalOut = frames[frames.length - 1].out;

  const [quiz, setQuiz] = useState(false);
  const [guess, setGuess] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const pool = useMemo(() => [...finalOut].sort(), [finalOut]);
  const revealed = !quiz || checked;
  const correct = checked && guess.join("|") === finalOut.join("|");

  const choose = (id: string) => {
    setPresetId(id);
    setGuess([]);
    setChecked(false);
    s.reset();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Segmented label="Code sample" value={presetId} onChange={choose} options={PRESETS.map((p) => ({ value: p.id, label: p.label }))} />
        <label className="flex items-center gap-2 text-xs text-fg-2">
          <input type="checkbox" checked={quiz} onChange={(e) => { setQuiz(e.target.checked); setGuess([]); setChecked(false); }} />
          Predict the output first
        </label>
      </div>

      {quiz && (
        <Callout tone="violet" title="Your prediction">
          <p className="mb-2 text-xs">Click the logs in the order you think they print.</p>
          <div className="mb-2 flex flex-wrap gap-1.5">
            {pool.map((p) => (
              <Button key={p} size="sm" disabled={guess.includes(p) || checked} onClick={() => setGuess((g) => [...g, p])}>
                {p}
              </Button>
            ))}
          </div>
          <div className="mb-2 font-mono text-xs text-fg">{guess.length ? guess.join(" → ") : "—"}</div>
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" variant="primary" disabled={guess.length !== finalOut.length || checked} onClick={() => setChecked(true)}>
              Check
            </Button>
            <Button size="sm" variant="ghost" onClick={() => { setGuess([]); setChecked(false); }}>
              Clear
            </Button>
            {checked && <Badge tone={correct ? "success" : "error"}>{correct ? "Correct!" : `Actual: ${finalOut.join(" → ")}`}</Badge>}
          </div>
        </Callout>
      )}

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
        <CodeBlock code={preset.code} language="js" title="snippet.js" highlightLines={new Set([f.line])} runnable={false} />
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          <Column title="Call stack" items={[...f.stack].reverse()} tone="primary" />
          <Column title="Web APIs (timers)" items={f.web} />
          <Column title="Microtask queue" items={f.micro} tone="violet" />
          <Column title="Task queue" items={f.tasks} tone="warn" />
          <Panel title="Console" tone="ok" className="col-span-2 min-h-28">
            {revealed ? (
              <ol className="space-y-0.5 font-mono text-xs text-fg">
                {f.out.map((o, i) => (
                  <li key={i} className={cn(i === f.out.length - 1 && "text-ok")}>
                    &gt; {o}
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-xs italic text-fg-3">Hidden until you check your prediction.</p>
            )}
          </Panel>
        </div>
      </div>

      <Callout tone="primary" title={`Step ${s.step + 1}`}>
        <span aria-live="polite">{f.note}</span>
      </Callout>
      <StepControls s={s} />
      <p className="text-xs text-fg-3">
        Rule: run synchronous code until the stack is empty → drain every microtask (including ones queued while draining) → take one task → repeat.
      </p>
    </div>
  );
}
