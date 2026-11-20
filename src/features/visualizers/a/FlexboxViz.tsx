import { useState, type CSSProperties } from "react";
import { Callout } from "@/components/ui/primitives";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { cn } from "@/lib/cn";
import { Panel, RangeField } from "./StepControls";
import { useMarkOnce } from "./useStepper";

type Prop = "flex-direction" | "justify-content" | "align-items" | "flex-wrap" | "gap" | "flex-grow";
const OPTIONS = {
  "flex-direction": ["row", "row-reverse", "column", "column-reverse"],
  "justify-content": ["flex-start", "center", "flex-end", "space-between", "space-around", "space-evenly"],
  "align-items": ["stretch", "flex-start", "center", "flex-end", "baseline"],
  "flex-wrap": ["nowrap", "wrap", "wrap-reverse"],
} as const;

const EXPLAIN: Record<Prop, string> = {
  "flex-direction": "Sets the MAIN axis. row → main axis is horizontal; column → vertical. Every other property is defined relative to these axes.",
  "justify-content": "Distributes free space along the MAIN axis. It only has a visible effect when items don't already fill the line (no free space when an item has flex-grow).",
  "align-items": "Aligns items on the CROSS axis within their line. stretch (default) fills the cross size when the item has no fixed cross size.",
  "flex-wrap": "nowrap squeezes all items onto one line (they may shrink or overflow). wrap starts new lines along the cross axis.",
  gap: "Space between items (and between lines when wrapping). Unlike margins, no extra space appears at the edges.",
  "flex-grow": "How an item shares POSITIVE free space on its line. grow 2 gets twice the extra space of grow 1 — not twice the size.",
};

const heights = [40, 64, 32, 52, 44, 36, 58, 30];

export default function FlexboxViz() {
  const [dir, setDir] = useState<string>("row");
  const [justify, setJustify] = useState<string>("flex-start");
  const [align, setAlign] = useState<string>("stretch");
  const [wrap, setWrap] = useState<string>("nowrap");
  const [gap, setGap] = useState(8);
  const [count, setCount] = useState(4);
  const [grow, setGrow] = useState<number[]>(Array(8).fill(0));
  const [focus, setFocus] = useState<Prop>("flex-direction");
  const mark = useMarkOnce("flexbox");

  const isRow = dir.startsWith("row");
  const touch = (p: Prop) => { setFocus(p); mark(); };

  const select = (p: keyof typeof OPTIONS, value: string, set: (v: string) => void) => (
    <label className="flex flex-col gap-1 text-xs text-fg-2">
      {p}
      <select value={value} onFocus={() => setFocus(p)} onChange={(e) => { set(e.target.value); touch(p); }} className="h-8 rounded-md border border-line bg-surface px-2 font-mono text-xs text-fg">
        {OPTIONS[p].map((o) => <option key={o}>{o}</option>)}
      </select>
    </label>
  );

  const items = Array.from({ length: count }, (_, i) => i);
  const growCss = items.filter((i) => grow[i] > 0).map((i) => `.item:nth-child(${i + 1}) { flex-grow: ${grow[i]}; }`).join("\n");
  const css = `.container {
  display: flex;
  flex-direction: ${dir};
  justify-content: ${justify};
  align-items: ${align};
  flex-wrap: ${wrap};
  gap: ${gap}px;
}${growCss ? `\n${growCss}` : ""}`;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)]">
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {select("flex-direction", dir, setDir)}
            {select("justify-content", justify, setJustify)}
            {select("align-items", align, setAlign)}
            {select("flex-wrap", wrap, setWrap)}
          </div>
          <RangeField label="gap" value={gap} min={0} max={32} onChange={(v) => { setGap(v); touch("gap"); }} />
          <RangeField label="number of items" value={count} min={1} max={8} unit="" onChange={(v) => { setCount(v); mark(); }} />
          <fieldset className="rounded-md border border-line p-2">
            <legend className="px-1 text-xs text-fg-2">flex-grow per item</legend>
            <div className="grid grid-cols-4 gap-2">
              {items.map((i) => (
                <label key={i} className="flex flex-col gap-0.5 text-[11px] text-fg-2">
                  item {i + 1}
                  <input type="number" min={0} max={5} value={grow[i]} onFocus={() => setFocus("flex-grow")} onChange={(e) => { const v = Math.max(0, Math.min(5, Number(e.target.value) || 0)); setGrow((g) => g.map((x, j) => (j === i ? v : x))); touch("flex-grow"); }} className="h-7 w-full rounded border border-line bg-surface px-1.5 font-mono text-xs text-fg" />
                </label>
              ))}
            </div>
          </fieldset>
        </div>
        <div className="space-y-3">
          <Panel title="Live flex container">
            <div className="relative">
              <div className="pointer-events-none absolute -top-0.5 left-1 z-10 flex gap-3 text-[10px] font-semibold" aria-hidden>
                <span className="text-primary">main axis {isRow ? (dir === "row" ? "→" : "←") : dir === "column" ? "↓" : "↑"}</span>
                <span className="text-violet">cross axis {isRow ? (wrap === "wrap-reverse" ? "↑" : "↓") : wrap === "wrap-reverse" ? "←" : "→"}</span>
              </div>
              <div
                className={cn("mt-4 overflow-auto rounded-md border-2 border-dashed border-primary/50 bg-bg p-1", isRow ? "h-56" : "h-80")}
                style={{ display: "flex", flexDirection: dir as CSSProperties["flexDirection"], justifyContent: justify, alignItems: align, flexWrap: wrap as CSSProperties["flexWrap"], gap }}
              >
                {items.map((i) => (
                  <div
                    key={i}
                    style={{ flexGrow: grow[i], ...(isRow ? { minWidth: 56, height: align === "stretch" ? undefined : heights[i] } : { minHeight: 32, width: align === "stretch" ? undefined : 40 + heights[i] }) }}
                    className={cn("flex items-center justify-center rounded border px-2 font-mono text-xs", grow[i] > 0 ? "border-ok/50 bg-ok-soft text-ok" : "border-primary/40 bg-primary-soft text-primary")}
                  >
                    {i + 1}
                    {grow[i] > 0 && <span className="ml-1 text-[10px]">g{grow[i]}</span>}
                  </div>
                ))}
              </div>
            </div>
          </Panel>
          <Callout tone="primary" title={focus}>
            <span aria-live="polite">{EXPLAIN[focus]}</span>
          </Callout>
          <CodeBlock code={css} language="css" title="flex.css" runnable={false} />
        </div>
      </div>
    </div>
  );
}
