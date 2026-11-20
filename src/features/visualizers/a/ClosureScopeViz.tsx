import { useMemo, useState } from "react";
import { Badge, Callout, Segmented } from "@/components/ui/primitives";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { cn } from "@/lib/cn";
import { Panel, StepControls } from "./StepControls";
import { useStepper } from "./useStepper";

type Status = "active" | "retained" | "gone";
interface Env {
  id: string;
  title: string;
  parent: string | null;
  vars: [string, string][];
  status: Status;
}
interface Frame {
  line: number;
  envs: Env[];
  out: string[];
  note: string;
}

function builder() {
  const envs: Env[] = [];
  const out: string[] = [];
  const frames: Frame[] = [];
  const get = (id: string) => envs.find((e) => e.id === id);
  return {
    env(id: string, title: string, parent: string | null, vars: [string, string][] = [], status: Status = "active") {
      envs.push({ id, title, parent, vars, status });
    },
    set(id: string, k: string, v: string) {
      const e = get(id);
      if (!e) return;
      const f = e.vars.find((x) => x[0] === k);
      if (f) f[1] = v;
      else e.vars.push([k, v]);
    },
    status(id: string, st: Status) {
      const e = get(id);
      if (e) e.status = st;
    },
    drop(id: string) {
      envs.splice(envs.findIndex((e) => e.id === id), 1);
    },
    log(s: string) {
      out.push(s);
    },
    snap(line: number, note: string) {
      frames.push({ line, note, out: [...out], envs: envs.map((e) => ({ ...e, vars: e.vars.map((v) => [...v] as [string, string]) })) });
    },
    frames,
  };
}

type Mode = "counter" | "var" | "let";
const CODE: Record<Mode, string> = {
  counter: `function makeCounter() {
  let count = 0;
  return function increment() {
    count++;
    return count;
  };
}
const a = makeCounter();
const b = makeCounter();
a(); // 1
a(); // 2
b(); // 1`,
  var: `for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
// later: 3 3 3`,
  let: `for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
// later: 0 1 2`,
};

function buildCounter() {
  const b = builder();
  b.env("g", "Global", null, [["makeCounter", "ƒ"]]);
  b.snap(1, "The function declaration is stored in the global scope. Nothing inside runs yet.");
  b.env("m1", "makeCounter() call #1", "g");
  b.snap(8, "Calling makeCounter creates a NEW environment for this call.");
  b.set("m1", "count", "0");
  b.snap(2, "count = 0 lives in call #1's environment.");
  b.snap(3, "increment is created here. A function remembers the environment it was CREATED in (its lexical scope).");
  b.status("m1", "retained");
  b.set("g", "a", "ƒ increment → env #1");
  b.snap(8, "makeCounter returned, but its environment is NOT garbage-collected: a's function still references it. That retained environment is the closure.");
  b.env("m2", "makeCounter() call #2", "g", [["count", "0"]]);
  b.snap(9, "A second call creates a separate environment with its own count.");
  b.status("m2", "retained");
  b.set("g", "b", "ƒ increment → env #2");
  b.snap(9, "b closes over env #2. a and b do not share state.");
  b.env("c1", "a() call", "m1");
  b.status("m1", "active");
  b.snap(10, "Calling a(): its own (empty) call scope's parent is env #1.");
  b.set("m1", "count", "1");
  b.snap(4, "count is not local, so lookup walks outward to env #1 and increments it there.");
  b.log("a() → 1");
  b.drop("c1");
  b.status("m1", "retained");
  b.snap(5, "Returns 1. The call scope disappears; env #1 stays with count = 1.");
  b.env("c2", "a() call", "m1");
  b.set("m1", "count", "2");
  b.log("a() → 2");
  b.snap(4, "Second a(): the SAME env #1 is reused, so the value persisted: count becomes 2.");
  b.drop("c2");
  b.env("c3", "b() call", "m2");
  b.status("m2", "active");
  b.set("m2", "count", "1");
  b.log("b() → 1");
  b.snap(4, "b() touches only env #2: 1. Each factory call produced private, independent state.");
  b.drop("c3");
  b.status("m2", "retained");
  b.snap(12, "This is how private state works without classes — and how React hooks' callbacks capture values.");
  return b.frames;
}

function buildLoop(kind: "var" | "let") {
  const b = builder();
  b.env("g", kind === "var" ? "Global / function scope" : "Global", null);
  if (kind === "var") {
    b.set("g", "i", "0");
    b.snap(1, "var is function-scoped (here: global). There is exactly ONE binding i for the whole loop.");
    for (let n = 0; n < 3; n++) {
      b.set("g", `timer cb ${n}`, "→ reads global i");
      b.snap(2, `Iteration ${n}: the arrow function captures the variable i itself, not its current value (${n}).`);
      b.set("g", "i", String(n + 1));
      b.snap(1, `i++ → ${n + 1}${n + 1 === 3 ? " — condition fails, loop ends." : ""}`);
    }
    for (let n = 0; n < 3; n++) {
      b.log("3");
      b.snap(2, `Later, timer callback ${n} runs and looks up i: the single shared binding is 3.`);
    }
  } else {
    for (let n = 0; n < 3; n++) {
      b.env(`it${n}`, `iteration ${n} scope`, "g", [["i", String(n)]], "active");
      if (n > 0) b.status(`it${n - 1}`, "retained");
      b.snap(1, n === 0 ? "let is block-scoped: each iteration gets a FRESH binding of i." : `New iteration environment, i copied from the previous one and incremented → ${n}.`);
      b.set(`it${n}`, "timer cb", `→ reads this i (${n})`);
      b.snap(2, `This iteration's callback closes over its own i = ${n}.`);
    }
    b.status("it2", "retained");
    b.snap(1, "i++ → 3 in a new binding; condition fails and the loop ends. The three iteration scopes stay alive because callbacks reference them.");
    for (let n = 0; n < 3; n++) {
      b.log(String(n));
      b.status(`it${n}`, "gone");
      b.snap(2, `Timer callback ${n} runs and reads its own i: ${n}. Afterwards nothing references this scope, so it can be collected.`);
    }
  }
  return b.frames;
}

const statusTone = { active: "primary", retained: "violet", gone: "neutral" } as const;

export default function ClosureScopeViz() {
  const [mode, setMode] = useState<Mode>("counter");
  const frames = useMemo(() => (mode === "counter" ? buildCounter() : buildLoop(mode)), [mode]);
  const s = useStepper(frames.length, "closure-scope");
  const f = frames[s.step];
  const depth = (e: Env): number => (e.parent ? 1 + depth(f.envs.find((x) => x.id === e.parent) ?? { ...e, parent: null }) : 0);

  return (
    <div className="space-y-4">
      <Segmented label="Example" value={mode} onChange={(m) => { setMode(m); s.reset(); }} options={[{ value: "counter", label: "Counter factory" }, { value: "var", label: "Loop with var" }, { value: "let", label: "Loop with let" }]} />
      <div className="grid gap-4 lg:grid-cols-2">
        <CodeBlock code={CODE[mode]} language="js" title="closure.js" highlightLines={new Set([f.line])} runnable={false} />
        <div className="space-y-3">
          <Panel title="Scopes / lexical environments">
            <ul className="space-y-1.5">
              {f.envs.map((e) => (
                <li
                  key={e.id}
                  style={{ marginLeft: `${depth(e) * 16}px` }}
                  className={cn("rounded border px-2 py-1.5 text-xs", e.status === "active" ? "border-primary bg-primary-soft" : e.status === "retained" ? "border-violet/50 bg-violet-soft" : "border-dashed border-line opacity-60")}
                >
                  <div className="mb-1 flex flex-wrap items-center gap-1.5">
                    <span className="font-semibold text-fg">{e.title}</span>
                    <Badge tone={statusTone[e.status]}>{e.status === "retained" ? "kept alive by closure" : e.status}</Badge>
                  </div>
                  {e.vars.map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-2 font-mono text-[11px]">
                      <span className="text-fg-2">{k}</span>
                      <span className="text-fg">{v}</span>
                    </div>
                  ))}
                </li>
              ))}
            </ul>
          </Panel>
          <Panel title="Output" tone="ok">
            <p className="font-mono text-xs text-fg">{f.out.length ? f.out.join("  ") : "—"}</p>
          </Panel>
        </div>
      </div>
      <Callout tone="primary" title={`Step ${s.step + 1}`}>
        <span aria-live="polite">{f.note}</span>
      </Callout>
      <StepControls s={s} />
    </div>
  );
}
