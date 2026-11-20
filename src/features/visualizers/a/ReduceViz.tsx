import { useMemo, useState } from "react";
import { Callout, Segmented } from "@/components/ui/primitives";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { cn } from "@/lib/cn";
import { StepControls, inputCls } from "./StepControls";
import { useStepper } from "./useStepper";

type Mode = "numbers" | "basket";
type Op = "sum" | "product" | "max";

interface Row {
  iter: number;
  index: number;
  acc: string;
  current: string;
  returned: string;
}
interface Plan {
  code: string;
  rows: Row[];
  result: string;
  error?: string;
  start: string;
}

const BASKET = [
  { item: "Ticket", price: 12.5, qty: 2 },
  { item: "Hoodie", price: 30, qty: 1 },
  { item: "Badge", price: 2, qty: 5 },
];

const OP_EXPR: Record<Op, string> = { sum: "acc + n", product: "acc * n", max: "Math.max(acc, n)" };
const apply = (op: Op, a: number, b: number) => (op === "sum" ? a + b : op === "product" ? a * b : Math.max(a, b));
const r2 = (n: number) => String(Math.round(n * 100) / 100);

function planNumbers(nums: number[], op: Op, useInit: boolean, init: number): Plan {
  const code = `const nums = [${nums.join(", ")}];\nconst result = nums.reduce((acc, n) => {\n  return ${OP_EXPR[op]};\n}${useInit ? `, ${init}` : ""});`;
  if (!useInit && nums.length === 0)
    return { code, rows: [], result: "—", start: "—", error: "TypeError: Reduce of empty array with no initial value" };
  let acc = useInit ? init : nums[0];
  const startIdx = useInit ? 0 : 1;
  const start = useInit ? `initialValue = ${init}` : `no initialValue → acc = nums[0] = ${nums[0]}, start at index 1`;
  const rows: Row[] = [];
  for (let i = startIdx; i < nums.length; i++) {
    const next = apply(op, acc, nums[i]);
    rows.push({ iter: rows.length + 1, index: i, acc: r2(acc), current: String(nums[i]), returned: r2(next) });
    acc = next;
  }
  return { code, rows, result: r2(acc), start };
}

function planBasket(): Plan {
  const code = `const total = basket.reduce((acc, line) => {\n  return acc + line.price * line.qty;\n}, 0);`;
  let acc = 0;
  const rows = BASKET.map((l, i) => {
    const next = acc + l.price * l.qty;
    const row = { iter: i + 1, index: i, acc: r2(acc), current: `${l.item}: ${l.price} × ${l.qty}`, returned: r2(next) };
    acc = next;
    return row;
  });
  return { code, rows, result: r2(acc), start: "initialValue = 0 (essential with objects — otherwise acc starts as the first OBJECT)" };
}

export default function ReduceViz() {
  const [mode, setMode] = useState<Mode>("numbers");
  const [text, setText] = useState("4, 8, 15, 16");
  const [op, setOp] = useState<Op>("sum");
  const [useInit, setUseInit] = useState(true);
  const [init, setInit] = useState(0);

  const nums = useMemo(() => text.split(",").map((t) => t.trim()).filter((t) => t !== "" && !Number.isNaN(Number(t))).map(Number), [text]);
  const plan = useMemo(() => (mode === "basket" ? planBasket() : planNumbers(nums, op, useInit, init)), [mode, nums, op, useInit, init]);
  // step 0 = setup; steps 1..rows = iterations; final = result
  const total = plan.rows.length + 2;
  const s = useStepper(total, "reduce-accumulator");
  const shown = Math.min(Math.max(s.step, 0), plan.rows.length);
  const finished = s.step === total - 1;
  const current = s.step >= 1 && s.step <= plan.rows.length ? plan.rows[s.step - 1] : null;
  const codeLines = plan.code.split("\n").length;
  const hl = s.step === 0 ? codeLines : finished ? codeLines : mode === "basket" ? 2 : 3;

  const note = plan.error && s.step >= 1
    ? "With an empty array and no initial value there is nothing to start the accumulator with, so reduce throws."
    : s.step === 0
      ? `Setup: ${plan.start}.`
      : current
        ? `Call ${current.iter}: acc = ${current.acc}, current = ${current.current} → callback returns ${current.returned}, which becomes the next acc.`
        : plan.rows.length === 0
          ? `No elements to visit: reduce returns the initial value ${plan.result} without calling the callback.`
          : `No more elements: reduce returns the last accumulator, ${plan.result}.`;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <Segmented label="Mode" value={mode} onChange={(m) => { setMode(m); s.reset(); }} options={[{ value: "numbers", label: "Numbers" }, { value: "basket", label: "Basket (price × qty)" }]} />
        {mode === "numbers" && (
          <>
            <label className="flex flex-col gap-1 text-xs text-fg-2">
              Numbers (comma separated)
              <input className={inputCls} value={text} onChange={(e) => { setText(e.target.value); s.reset(); }} />
            </label>
            <Segmented label="Operation" value={op} onChange={(o) => { setOp(o); s.reset(); }} options={[{ value: "sum", label: "sum" }, { value: "product", label: "product" }, { value: "max", label: "max" }]} />
            <label className="flex items-center gap-1.5 text-xs text-fg-2">
              <input type="checkbox" checked={useInit} onChange={(e) => { setUseInit(e.target.checked); s.reset(); }} /> initial value
            </label>
            {useInit && (
              <label className="flex flex-col gap-1 text-xs text-fg-2">
                initialValue
                <input type="number" className={cn(inputCls, "w-24")} value={init} onChange={(e) => { setInit(Number(e.target.value) || 0); s.reset(); }} />
              </label>
            )}
          </>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <CodeBlock code={plan.code} language="js" title="reduce.js" highlightLines={new Set([hl])} runnable={false} />
        <div className="overflow-x-auto rounded-md border border-line">
          <table className="w-full text-left text-xs">
            <caption className="sr-only">Reduce iterations</caption>
            <thead className="bg-elevated text-fg-2">
              <tr>
                <th className="px-2 py-1.5">#</th>
                <th className="px-2 py-1.5">index</th>
                <th className="px-2 py-1.5">acc (in)</th>
                <th className="px-2 py-1.5">current</th>
                <th className="px-2 py-1.5">returned → next acc</th>
              </tr>
            </thead>
            <tbody className="font-mono">
              {plan.rows.slice(0, shown).map((r) => (
                <tr key={r.iter} className={cn("border-t border-line", current?.iter === r.iter && "bg-primary-soft")}>
                  <td className="px-2 py-1 text-fg-3">{r.iter}</td>
                  <td className="px-2 py-1 text-fg-2">{r.index}</td>
                  <td className="px-2 py-1 text-fg">{r.acc}</td>
                  <td className="px-2 py-1 text-fg">{r.current}</td>
                  <td className="px-2 py-1 text-ok">{r.returned}</td>
                </tr>
              ))}
              {shown === 0 && (
                <tr><td colSpan={5} className="px-2 py-3 text-center text-fg-3">No calls yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {plan.error && s.step >= 1 ? (
        <Callout tone="error" title={plan.error}><span aria-live="polite">{note}</span></Callout>
      ) : (
        <Callout tone={finished ? "success" : "primary"} title={finished ? `Result: ${plan.result}` : `Step ${s.step + 1}`}>
          <span aria-live="polite">{note}</span>
        </Callout>
      )}
      <StepControls s={s} />
      <p className="text-xs text-fg-3">Try clearing the list with and without an initial value, and see how “no initial value” skips index 0.</p>
    </div>
  );
}
