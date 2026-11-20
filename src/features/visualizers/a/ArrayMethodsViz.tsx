import { useMemo, useState } from "react";
import { Badge, Callout } from "@/components/ui/primitives";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { cn } from "@/lib/cn";
import { Panel, StepControls } from "./StepControls";
import { useStepper } from "./useStepper";

interface Product {
  name: string;
  price: number;
  tags: string[];
}
const DATA: Product[] = [
  { name: "Laptop", price: 900, tags: ["tech", "work"] },
  { name: "Mug", price: 8, tags: ["kitchen"] },
  { name: "Phone", price: 600, tags: ["tech"] },
  { name: "Lamp", price: 35, tags: ["home"] },
];

const isProduct = (v: unknown): v is Product => typeof v === "object" && v !== null && "name" in v && "price" in v;
function fmt(v: unknown): string {
  if (isProduct(v)) return `{${v.name}, £${v.price}}`;
  if (Array.isArray(v)) return `[${v.map(fmt).join(", ")}]`;
  if (typeof v === "string") return JSON.stringify(v);
  return String(v);
}

interface Step {
  focus: string[]; // product names highlighted
  call: string;
  ret: string;
  partial: string;
  note: string;
  line: number;
}
interface Run {
  code: string;
  steps: Step[];
  result: unknown;
  mutates: boolean;
  after: Product[];
}

type MethodId = "map" | "filter" | "find" | "findIndex" | "some" | "every" | "reduce" | "sort" | "slice" | "splice" | "includes" | "flatMap";
const METHODS: MethodId[] = ["map", "filter", "find", "findIndex", "some", "every", "reduce", "sort", "slice", "splice", "includes", "flatMap"];

/** Runs the REAL array method on a fresh copy with an instrumented callback, recording each call. */
function simulate(method: MethodId): Run {
  const arr: Product[] = DATA.map((p) => ({ ...p, tags: [...p.tags] }));
  const steps: Step[] = [];
  const push = (s: Omit<Step, "line"> & { line?: number }) => steps.push({ line: 2, ...s });
  let result: unknown;
  let code = "";
  let built: unknown[] = [];

  switch (method) {
    case "map":
      code = `const result = products.map((p, i) => {\n  return p.name;\n});`;
      result = arr.map((p, i) => {
        const r = p.name;
        built = [...built, r];
        push({ focus: [p.name], call: `cb(${fmt(p)}, ${i})`, ret: fmt(r), partial: fmt(built), note: `map always produces one output per element; element ${i} becomes ${fmt(r)}.` });
        return r;
      });
      break;
    case "filter":
      code = `const result = products.filter((p, i) => {\n  return p.price > 50;\n});`;
      result = arr.filter((p, i) => {
        const r = p.price > 50;
        if (r) built = [...built, p];
        push({ focus: [p.name], call: `cb(${fmt(p)}, ${i})`, ret: String(r), partial: fmt(built), note: r ? "Truthy → the SAME object reference is kept in the new array." : "Falsy → element skipped." });
        return r;
      });
      break;
    case "find":
    case "findIndex": {
      const test = (p: Product) => p.price < 50;
      code = `const result = products.${method}((p, i) => {\n  return p.price < 50;\n});`;
      const cb = (p: Product, i: number) => {
        const r = test(p);
        push({ focus: [p.name], call: `cb(${fmt(p)}, ${i})`, ret: String(r), partial: r ? "match → stop" : "keep looking", note: r ? `First truthy return: ${method} stops immediately — later elements are never visited.` : "Falsy → move to the next element." });
        return r;
      };
      result = method === "find" ? arr.find(cb) : arr.findIndex(cb);
      break;
    }
    case "some":
    case "every": {
      code = `const result = products.${method}((p) => {\n  return ${method === "some" ? "p.price > 800" : "p.price > 10"};\n});`;
      const cb = (p: Product, i: number) => {
        const r = method === "some" ? p.price > 800 : p.price > 10;
        const stop = method === "some" ? r : !r;
        push({ focus: [p.name], call: `cb(${fmt(p)}, ${i})`, ret: String(r), partial: stop ? `short-circuit → ${method === "some"}` : "continue", note: stop ? `${method} can already answer, so it stops (short-circuit).` : "Not decided yet — check the next element." });
        return r;
      };
      result = method === "some" ? arr.some(cb) : arr.every(cb);
      break;
    }
    case "reduce":
      code = `const result = products.reduce((sum, p, i) => {\n  return sum + p.price;\n}, 0);`;
      result = arr.reduce((sum, p, i) => {
        const r = sum + p.price;
        push({ focus: [p.name], call: `cb(sum=${sum}, ${fmt(p)}, ${i})`, ret: String(r), partial: `acc = ${r}`, note: `The returned value becomes the accumulator for the next call.` });
        return r;
      }, 0);
      break;
    case "sort":
      code = `const result = products.sort((a, b) => {\n  return a.price - b.price;\n});`;
      result = arr.sort((a, b) => {
        const r = a.price - b.price;
        push({ focus: [a.name, b.name], call: `cmp(${fmt(a)}, ${fmt(b)})`, ret: String(r), partial: r < 0 ? "a before b" : r > 0 ? "b before a" : "keep order", note: "Comparator: negative → a first, positive → b first, 0 → keep. Which pairs get compared depends on the engine's algorithm." });
        return r;
      });
      break;
    case "slice":
      code = `const result = products.slice(1, 3);\n// start index 1, end index 3 (exclusive)\n`;
      result = arr.slice(1, 3);
      push({ focus: ["Mug", "Phone"], call: "slice(1, 3)", ret: fmt(result), partial: "copies indices 1, 2", note: "slice has no callback. It returns a NEW shallow-copied array; the original is untouched.", line: 1 });
      break;
    case "splice":
      code = `const result = products.splice(1, 1);\n// remove 1 element at index 1\n`;
      push({ focus: ["Mug"], call: "splice(1, 1)", ret: "…", partial: "removing index 1", note: "splice edits the original array IN PLACE.", line: 1 });
      result = arr.splice(1, 1);
      push({ focus: [], call: "splice(1, 1)", ret: fmt(result), partial: "original now has 3 items", note: "It returns an array of the REMOVED elements, not the new array.", line: 1 });
      break;
    case "includes": {
      code = `const phone = products[2];\nconst result = products.includes(phone);\n// products.includes({ ...phone }) would be false!`;
      const target = arr[2];
      for (let i = 0; i < arr.length; i++) {
        const eq = arr[i] === target;
        push({ focus: [arr[i].name], call: `products[${i}] === phone`, ret: String(eq), partial: eq ? "found → true" : "not yet", note: eq ? "Same reference → includes returns true and stops." : "Different object reference → not equal (includes uses SameValueZero, not deep equality).", line: 2 });
        if (eq) break;
      }
      result = arr.includes(target);
      break;
    }
    case "flatMap":
      code = `const result = products.flatMap((p) => {\n  return p.tags;\n});`;
      result = arr.flatMap((p, i) => {
        const r = p.tags;
        built = [...built, ...r];
        push({ focus: [p.name], call: `cb(${fmt(p)}, ${i})`, ret: fmt(r), partial: fmt(built), note: "flatMap = map then flatten ONE level: the returned array's items are spread into the result." });
        return r;
      });
      break;
  }
  const lastLine = code.split("\n").length;
  steps.unshift({ focus: [], call: "—", ret: "—", partial: "—", note: `Calling products.${method}(…).`, line: 1 });
  steps.push({ focus: [], call: "—", ret: fmt(result), partial: fmt(result), note: `Final return value: ${fmt(result)}.`, line: Math.min(lastLine, 3) });
  return { code, steps, result, mutates: method === "sort" || method === "splice", after: arr };
}

export default function ArrayMethodsViz() {
  const [method, setMethod] = useState<MethodId>("map");
  const run = useMemo(() => simulate(method), [method]);
  const s = useStepper(run.steps.length, "array-methods");
  const st = run.steps[s.step];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label="Array method">
        {METHODS.map((m) => (
          <button
            key={m}
            type="button"
            role="radio"
            aria-checked={m === method}
            onClick={() => { setMethod(m); s.reset(); }}
            className={cn("rounded-md border px-2.5 py-1 font-mono text-xs", m === method ? "border-primary bg-primary-soft text-primary" : "border-line bg-elevated text-fg-2 hover:text-fg")}
          >
            .{m}()
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-3">
          <CodeBlock code={run.code} language="js" title={`${method}.js`} highlightLines={new Set([st.line])} runnable={false} />
          <Panel title="products (original, before the call)">
            <ul className="grid grid-cols-2 gap-1.5">
              {DATA.map((p, i) => (
                <li key={p.name} className={cn("rounded border px-2 py-1 font-mono text-[11px]", st.focus.includes(p.name) ? "border-primary bg-primary-soft text-primary" : "border-line bg-surface text-fg-2")}>
                  [{i}] {p.name} £{p.price} <span className="text-fg-3">{JSON.stringify(p.tags)}</span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
        <div className="space-y-3">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <Panel title="Current call"><p className="break-words font-mono text-xs text-fg">{st.call}</p></Panel>
            <Panel title="Callback returns" tone="violet"><p className="break-words font-mono text-xs text-fg">{st.ret}</p></Panel>
            <Panel title="Result so far" tone="ok"><p className="break-words font-mono text-xs text-fg">{st.partial}</p></Panel>
          </div>
          <Callout tone="primary" title={s.atEnd ? "Done" : `Step ${s.step + 1}`}>
            <span aria-live="polite">{st.note}</span>
          </Callout>
          {s.atEnd && (
            <Panel title="Original array after the call" tone={run.mutates ? "err" : "ok"}>
              <div className="mb-1.5">
                <Badge tone={run.mutates ? "error" : "success"}>{run.mutates ? "Mutates original" : "Does not mutate"}</Badge>
              </div>
              <p className="break-words font-mono text-xs text-fg">{fmt(run.after)}</p>
              {method === "sort" && <p className="mt-1 text-xs text-fg-2">sort returns the same array it sorted (result === products). Use toSorted() or [...products].sort() to avoid mutating — important for React state.</p>}
            </Panel>
          )}
        </div>
      </div>
      <StepControls s={s} label="Call" />
    </div>
  );
}
