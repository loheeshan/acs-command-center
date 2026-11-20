import { useMemo, useState } from "react";
import { Callout, Segmented } from "@/components/ui/primitives";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { cn } from "@/lib/cn";
import { Panel, StepControls } from "./StepControls";
import { useStepper } from "./useStepper";

/** A value is either a primitive (shown as text) or a reference to a heap object id. */
type Val = { prim: string } | { ref: string };
interface HeapObj {
  id: string;
  kind: "object" | "array";
  fields: [string, Val][];
}
interface Frame {
  line: number;
  stack: [string, Val][];
  heap: HeapObj[];
  changed?: string; // heap id or var name that just changed
  note: string;
}

const P = (s: string | number): Val => ({ prim: typeof s === "string" ? JSON.stringify(s) : String(s) });
const R = (id: string): Val => ({ ref: id });

function builder() {
  const stack: [string, Val][] = [];
  const heap: HeapObj[] = [];
  const frames: Frame[] = [];
  const clone = (): Pick<Frame, "stack" | "heap"> => ({
    stack: stack.map(([k, v]) => [k, { ...v }]),
    heap: heap.map((h) => ({ ...h, fields: h.fields.map(([k, v]) => [k, { ...v }] as [string, Val]) })),
  });
  return {
    setVar(name: string, v: Val) {
      const e = stack.find((s) => s[0] === name);
      if (e) e[1] = v;
      else stack.push([name, v]);
    },
    alloc(id: string, kind: HeapObj["kind"], fields: [string, Val][]) {
      heap.push({ id, kind, fields });
    },
    setField(id: string, key: string, v: Val) {
      const o = heap.find((h) => h.id === id);
      if (!o) return;
      const f = o.fields.find((x) => x[0] === key);
      if (f) f[1] = v;
      else o.fields.push([key, v]);
    },
    snap(line: number, note: string, changed?: string) {
      frames.push({ line, note, changed, ...clone() });
    },
    frames,
  };
}

interface Scenario {
  id: string;
  label: string;
  code: string;
  build: () => Frame[];
}

const SCENARIOS: Scenario[] = [
  {
    id: "prim",
    label: "Primitives",
    code: `let a = 5;\nlet b = a;\nb = 10;\nconsole.log(a, b); // 5 10`,
    build: () => {
      const b = builder();
      b.setVar("a", P(5));
      b.snap(1, "Primitives (number, string, boolean, null, undefined, bigint, symbol) live directly in the variable.", "a");
      b.setVar("b", P(5));
      b.snap(2, "b = a COPIES the value 5. a and b are now independent.", "b");
      b.setVar("b", P(10));
      b.snap(3, "Reassigning b changes only b.", "b");
      b.snap(4, "a is still 5. Copy-by-value: nothing is shared.");
      return b.frames;
    },
  },
  {
    id: "alias",
    label: "Alias mutation",
    code: `const user = { name: "Ana" };\nconst alias = user;\nalias.name = "Ben";\nconsole.log(user.name);      // "Ben"\nconsole.log(alias === user); // true`,
    build: () => {
      const b = builder();
      b.alloc("#1", "object", [["name", P("Ana")]]);
      b.setVar("user", R("#1"));
      b.snap(1, "The object lives on the heap; the variable holds a REFERENCE (an arrow) to it.", "#1");
      b.setVar("alias", R("#1"));
      b.snap(2, "Assignment copies the reference, not the object. Both arrows point at #1.", "alias");
      b.setField("#1", "name", P("Ben"));
      b.snap(3, "Mutating through alias changes the ONE shared object.", "#1");
      b.snap(4, "So user.name is \"Ben\" too.");
      b.snap(5, "=== on objects compares references: same object → true.");
      return b.frames;
    },
  },
  {
    id: "spread",
    label: "Spread (shallow)",
    code: `const user = { name: "Ana", address: { city: "London" } };\nconst copy = { ...user };\ncopy.name = "Ben";\ncopy.address.city = "Paris";\nconsole.log(user.name, user.address.city); // "Ana" "Paris"`,
    build: () => {
      const b = builder();
      b.alloc("#2", "object", [["city", P("London")]]);
      b.alloc("#1", "object", [["name", P("Ana")], ["address", R("#2")]]);
      b.setVar("user", R("#1"));
      b.snap(1, "Two heap objects: user (#1) and its nested address (#2). #1 holds a reference to #2.");
      b.alloc("#3", "object", [["name", P("Ana")], ["address", R("#2")]]);
      b.setVar("copy", R("#3"));
      b.snap(2, "Spread creates a NEW top-level object #3, copying each property. address is copied as a reference — still pointing at #2!", "#3");
      b.setField("#3", "name", P("Ben"));
      b.snap(3, "Changing a top-level primitive on the copy does not affect user.", "#3");
      b.setField("#2", "city", P("Paris"));
      b.snap(4, "copy.address IS user.address (#2). Mutating it changes what user sees.", "#2");
      b.snap(5, "Result: \"Ana\" \"Paris\" — a shallow copy shares nested objects.");
      return b.frames;
    },
  },
  {
    id: "deep",
    label: "structuredClone",
    code: `const user = { name: "Ana", address: { city: "London" } };\nconst deep = structuredClone(user);\ndeep.address.city = "Paris";\nconsole.log(user.address.city); // "London"`,
    build: () => {
      const b = builder();
      b.alloc("#2", "object", [["city", P("London")]]);
      b.alloc("#1", "object", [["name", P("Ana")], ["address", R("#2")]]);
      b.setVar("user", R("#1"));
      b.snap(1, "Same starting point: user → #1 → address #2.");
      b.alloc("#4", "object", [["city", P("London")]]);
      b.alloc("#3", "object", [["name", P("Ana")], ["address", R("#4")]]);
      b.setVar("deep", R("#3"));
      b.snap(2, "structuredClone copies recursively: new #3 AND a new nested #4. Nothing is shared. (It cannot clone functions or DOM nodes.)", "#3");
      b.setField("#4", "city", P("Paris"));
      b.snap(3, "Only the clone's nested object changes.", "#4");
      b.snap(4, "user.address.city is still \"London\".");
      return b.frames;
    },
  },
  {
    id: "react",
    label: "Why React needs new refs",
    code: `const prev = { items: ["pen"] };\n// ❌ mutation keeps the same reference\nprev.items.push("book");\nconst same = prev;\nconsole.log(Object.is(prev, same)); // true → React bails out\n// ✅ new object + new array\nconst next = { ...prev, items: [...prev.items, "ink"] };\nconsole.log(Object.is(prev, next)); // false → re-render`,
    build: () => {
      const b = builder();
      b.alloc("#2", "array", [["0", P("pen")]]);
      b.alloc("#1", "object", [["items", R("#2")]]);
      b.setVar("prev", R("#1"));
      b.snap(1, "Imagine prev is the current state value in a component.");
      b.setField("#2", "1", P("book"));
      b.snap(3, "push mutates the existing array #2 in place.", "#2");
      b.setVar("same", R("#1"));
      b.snap(4, "Passing the same object to setState (e.g. setCart(prev))…", "same");
      b.snap(5, "React compares old and new state with Object.is. Same reference → it assumes nothing changed and may skip the re-render, so the UI goes stale.");
      b.alloc("#4", "array", [["0", P("pen")], ["1", P("book")], ["2", P("ink")]]);
      b.alloc("#3", "object", [["items", R("#4")]]);
      b.setVar("next", R("#3"));
      b.snap(7, "Immutable update: a new object #3 AND a new array #4 along the changed path.", "#3");
      b.snap(8, "Different reference → React knows state changed and re-renders. Memoised children can also cheaply detect the change.");
      return b.frames;
    },
  },
];

const COLORS = ["text-primary", "text-violet", "text-ok", "text-warn"];
const colorOf = (id: string) => COLORS[(Number(id.slice(1)) - 1) % COLORS.length];

function ValView({ v }: { v: Val }) {
  if ("prim" in v) return <span className="text-fg">{v.prim}</span>;
  return <span className={cn("font-semibold", colorOf(v.ref))}>→ {v.ref}</span>;
}

export default function ReferenceCopyViz() {
  const [id, setId] = useState(SCENARIOS[0].id);
  const sc = SCENARIOS.find((x) => x.id === id) ?? SCENARIOS[0];
  const frames = useMemo(() => sc.build(), [sc]);
  const s = useStepper(frames.length, "reference-copy");
  const f = frames[s.step];

  return (
    <div className="space-y-4">
      <Segmented label="Scenario" value={id} onChange={(v) => { setId(v); s.reset(); }} options={SCENARIOS.map((x) => ({ value: x.id, label: x.label }))} />
      <div className="grid gap-4 lg:grid-cols-2">
        <CodeBlock code={sc.code} language="js" title="copy.js" highlightLines={new Set([f.line])} runnable={false} />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <Panel title="Stack (variables)" tone="primary">
            <ul className="space-y-1">
              {f.stack.map(([k, v]) => (
                <li key={k} className={cn("flex justify-between gap-2 rounded border px-2 py-1 font-mono text-xs", f.changed === k ? "border-primary bg-primary-soft" : "border-line bg-surface")}>
                  <span className="text-fg-2">{k}</span>
                  <ValView v={v} />
                </li>
              ))}
              {f.stack.length === 0 && <li className="text-xs italic text-fg-3">empty</li>}
            </ul>
          </Panel>
          <Panel title="Heap (objects)" tone="violet">
            <ul className="space-y-1.5">
              {f.heap.map((h) => (
                <li key={h.id} className={cn("rounded border px-2 py-1 font-mono text-xs", f.changed === h.id ? "border-warn bg-warn-soft" : "border-line bg-surface")}>
                  <div className={cn("mb-0.5 font-semibold", colorOf(h.id))}>
                    {h.id} <span className="font-normal text-fg-3">{h.kind}</span>
                  </div>
                  {h.fields.map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-2 pl-2">
                      <span className="text-fg-2">{h.kind === "array" ? `[${k}]` : k}</span>
                      <ValView v={v} />
                    </div>
                  ))}
                </li>
              ))}
              {f.heap.length === 0 && <li className="text-xs italic text-fg-3">no objects</li>}
            </ul>
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
