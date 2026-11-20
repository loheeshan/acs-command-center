import { useMemo, useState } from "react";
import { Badge, Button, Callout } from "@/components/ui/primitives";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { Panel, RangeField, inputCls } from "./StepControls";
import { useMarkOnce } from "./useStepper";

interface Preset {
  name: string;
  areas: string;
  cols: string;
  rows: string;
  cards: number;
}
const PRESETS: Preset[] = [
  { name: "Page layout (mock)", areas: `header  header\nsidebar main\nfooter  footer`, cols: "200px 1fr", rows: "auto 1fr auto", cards: 0 },
  { name: "Holy grail", areas: `header header header\nnav    main   aside\nfooter footer footer`, cols: "minmax(80px, 160px) 1fr minmax(80px, 160px)", rows: "auto 1fr auto", cards: 0 },
  { name: "Card grid (auto-fit)", areas: "", cols: "repeat(auto-fit, minmax(120px, 1fr))", rows: "", cards: 7 },
  { name: "Broken (L-shape)", areas: `header header\nmain   header\nfooter footer`, cols: "1fr 1fr", rows: "", cards: 0 },
];

const COLORS = ["bg-primary-soft text-primary border-primary/40", "bg-violet-soft text-violet border-violet/40", "bg-ok-soft text-ok border-ok/40", "bg-warn-soft text-warn border-warn/40", "bg-err-soft text-err border-err/40"];

interface Parsed {
  rows: string[][];
  names: string[];
  error: string | null;
}

/** Parse + validate grid-template-areas the way the spec requires: equal column counts and rectangular named areas. */
function parseAreas(src: string): Parsed {
  const rows = src
    .split("\n")
    .map((l) => l.trim().replace(/^"|"$/g, "").trim())
    .filter(Boolean)
    .map((l) => l.split(/\s+/));
  if (rows.length === 0) return { rows, names: [], error: null };
  const bad = rows.find((r) => r.length !== rows[0].length);
  if (bad) return { rows, names: [], error: `Every row must have the same number of columns (row 1 has ${rows[0].length}, another row has ${bad.length}).` };
  const invalidTok = rows.flat().find((t) => !/^(\.+|[A-Za-z_][\w-]*)$/.test(t));
  if (invalidTok) return { rows, names: [], error: `"${invalidTok}" is not a valid area name (use identifiers or "." for an empty cell).` };
  const names = [...new Set(rows.flat().filter((t) => !t.startsWith(".")))];
  for (const n of names) {
    let r0 = Infinity, r1 = -1, c0 = Infinity, c1 = -1, count = 0;
    rows.forEach((r, ri) => r.forEach((t, ci) => {
      if (t === n) { r0 = Math.min(r0, ri); r1 = Math.max(r1, ri); c0 = Math.min(c0, ci); c1 = Math.max(c1, ci); count++; }
    }));
    if (count !== (r1 - r0 + 1) * (c1 - c0 + 1)) return { rows, names, error: `Area "${n}" is not a rectangle. Named areas must form a single filled rectangle, so the browser ignores the whole grid-template-areas declaration.` };
  }
  return { rows, names, error: null };
}

const supports = (prop: string, v: string) => v.trim() === "" || (typeof CSS === "undefined" || typeof CSS.supports !== "function" || CSS.supports(prop, v));

export default function GridAreasViz() {
  const [areas, setAreas] = useState(PRESETS[0].areas);
  const [cols, setCols] = useState(PRESETS[0].cols);
  const [rowsT, setRowsT] = useState(PRESETS[0].rows);
  const [cards, setCards] = useState(PRESETS[0].cards);
  const [gap, setGap] = useState(8);
  const [width, setWidth] = useState(100);
  const mark = useMarkOnce("grid-areas");

  const parsed = useMemo(() => parseAreas(areas), [areas]);
  const colsOk = supports("grid-template-columns", cols);
  const rowsOk = supports("grid-template-rows", rowsT);
  const areaStr = parsed.rows.map((r) => `"${r.join(" ")}"`).join("\n    ");
  const usesAreas = parsed.rows.length > 0 && !parsed.error;
  const autoRepeat = /repeat\(\s*auto-(fit|fill)/.test(cols);

  const load = (p: Preset) => { setAreas(p.areas); setCols(p.cols); setRowsT(p.rows); setCards(p.cards); mark(); };

  const css = `.layout {
  display: grid;${parsed.rows.length ? `\n  grid-template-areas:\n    ${areaStr};` : ""}
  grid-template-columns: ${cols || "none"};${rowsT ? `\n  grid-template-rows: ${rowsT};` : ""}
  gap: ${gap}px;
}${parsed.names.map((n) => `\n.${n} { grid-area: ${n}; }`).join("")}`;

  const cells = usesAreas ? parsed.names : Array.from({ length: cards || parsed.rows.flat().length || 0 }, (_, i) => `item ${i + 1}`);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-1.5" aria-label="Presets">
        {PRESETS.map((p) => <Button key={p.name} size="sm" onClick={() => load(p)}>{p.name}</Button>)}
      </div>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <div className="space-y-3">
          <label className="flex flex-col gap-1 text-xs text-fg-2" htmlFor="ga-areas">
            grid-template-areas (one row per line; “.” = empty cell)
          </label>
          <textarea id="ga-areas" rows={4} spellCheck={false} value={areas} onChange={(e) => { setAreas(e.target.value); mark(); }} className="w-full rounded-md border border-line bg-code p-2 font-mono text-xs text-fg focus:border-primary focus:outline-none" />
          <label className="flex flex-col gap-1 text-xs text-fg-2">
            <span className="flex items-center gap-2">grid-template-columns {!colsOk && <Badge tone="error">invalid</Badge>}</span>
            <input className={`${inputCls} font-mono`} value={cols} onChange={(e) => { setCols(e.target.value); mark(); }} />
          </label>
          <label className="flex flex-col gap-1 text-xs text-fg-2">
            <span className="flex items-center gap-2">grid-template-rows (optional) {!rowsOk && <Badge tone="error">invalid</Badge>}</span>
            <input className={`${inputCls} font-mono`} value={rowsT} onChange={(e) => { setRowsT(e.target.value); mark(); }} />
          </label>
          {!usesAreas && <RangeField label="items (when no areas)" value={cards} min={0} max={12} unit="" onChange={setCards} />}
          <RangeField label="gap" value={gap} min={0} max={24} onChange={setGap} />
          <RangeField label="container width" value={width} min={30} max={100} unit="%" onChange={setWidth} />
        </div>
        <div className="space-y-3">
          <Panel title="Live CSS grid">
            <div
              className="min-h-56 rounded-md border-2 border-dashed border-primary/40 bg-bg p-1"
              style={{
                width: `${width}%`,
                display: "grid",
                gridTemplateAreas: usesAreas ? parsed.rows.map((r) => `"${r.join(" ")}"`).join(" ") : undefined,
                gridTemplateColumns: colsOk ? cols : undefined,
                gridTemplateRows: rowsOk && rowsT ? rowsT : undefined,
                gap,
              }}
            >
              {cells.map((n, i) => (
                <div key={n} style={usesAreas ? { gridArea: n } : undefined} className={`flex min-h-12 items-center justify-center rounded border px-2 py-3 font-mono text-xs ${COLORS[i % COLORS.length]}`}>
                  {n}
                </div>
              ))}
            </div>
          </Panel>
          {parsed.error ? (
            <Callout tone="error" title="Invalid grid-template-areas">{parsed.error}</Callout>
          ) : !colsOk || !rowsOk ? (
            <Callout tone="error" title="Invalid track list">Your browser's CSS.supports() rejected the value, so the declaration would be dropped.</Callout>
          ) : (
            <Callout tone="primary" title="How it works">
              {usesAreas
                ? `Each quoted row is a grid row; repeating a name across cells makes that area span them. Elements are placed with grid-area: <name>. ${autoRepeat ? "Combining auto-fit with named areas is fragile: the column count changes with width." : `There are ${parsed.rows[0].length} columns and ${parsed.rows.length} rows.`}`
                : "repeat(auto-fit, minmax(120px, 1fr)) creates as many columns as fit (each at least 120px) and stretches them to fill the row — responsive without media queries. Shrink the container width to see it."}
            </Callout>
          )}
          <CodeBlock code={css} language="css" title="grid.css" runnable={false} />
        </div>
      </div>
    </div>
  );
}
