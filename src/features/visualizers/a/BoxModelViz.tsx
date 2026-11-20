import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { Callout, Segmented, Stat } from "@/components/ui/primitives";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { Panel, RangeField } from "./StepControls";
import { useMarkOnce } from "./useStepper";

type Sizing = "content-box" | "border-box";

function Layer({ label, value, className, children }: { label: string; value: string; className: string; children?: ReactNode }) {
  return (
    <div className={`relative rounded border border-dashed px-6 pb-6 pt-6 text-center ${className}`}>
      <span className="absolute left-1.5 top-1 text-[10px] font-semibold uppercase tracking-wider">{label}</span>
      <span className="absolute right-1.5 top-1 font-mono text-[10px]">{value}</span>
      {children}
    </div>
  );
}

export default function BoxModelViz() {
  const [w, setW] = useState(200);
  const [h, setH] = useState(80);
  const [p, setP] = useState(16);
  const [b, setB] = useState(4);
  const [m, setM] = useState(16);
  const [sizing, setSizing] = useState<Sizing>("content-box");
  const mark = useMarkOnce("box-model");
  const ref = useRef<HTMLDivElement>(null);
  const [measured, setMeasured] = useState({ w: 0, h: 0 });

  const set = (fn: (v: number) => void) => (v: number) => { fn(v); mark(); };

  const contentW = sizing === "content-box" ? w : Math.max(0, w - 2 * p - 2 * b);
  const contentH = sizing === "content-box" ? h : Math.max(0, h - 2 * p - 2 * b);
  const borderBoxW = contentW + 2 * p + 2 * b;
  const borderBoxH = contentH + 2 * p + 2 * b;
  const spaceW = borderBoxW + 2 * m;
  const spaceH = borderBoxH + 2 * m;
  const clamped = sizing === "border-box" && (w < 2 * p + 2 * b || h < 2 * p + 2 * b);

  useLayoutEffect(() => {
    if (ref.current) setMeasured({ w: ref.current.offsetWidth, h: ref.current.offsetHeight });
  }, [w, h, p, b, m, sizing]);

  const css = `.box {
  box-sizing: ${sizing};
  width: ${w}px;
  height: ${h}px;
  padding: ${p}px;
  border: ${b}px solid;
  margin: ${m}px;
}
/* rendered (border-box) size: ${borderBoxW} × ${borderBoxH}px
   space taken incl. margin:    ${spaceW} × ${spaceH}px */`;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <div className="space-y-3">
          <Segmented label="box-sizing" value={sizing} onChange={(v) => { setSizing(v); mark(); }} options={[{ value: "content-box", label: "content-box (default)" }, { value: "border-box", label: "border-box" }]} />
          <RangeField label="width" value={w} min={0} max={320} onChange={set(setW)} />
          <RangeField label="height" value={h} min={0} max={200} onChange={set(setH)} />
          <RangeField label="padding" value={p} min={0} max={48} onChange={set(setP)} />
          <RangeField label="border-width" value={b} min={0} max={20} onChange={set(setB)} />
          <RangeField label="margin" value={m} min={0} max={48} onChange={set(setM)} />
          <CodeBlock code={css} language="css" title="box.css" runnable={false} />
        </div>
        <div className="space-y-3">
          <Panel title="Box model diagram">
            <Layer label="margin" value={`${m}px`} className="border-warn/60 bg-warn-soft text-warn">
              <Layer label="border" value={`${b}px`} className="border-fg-3 bg-elevated text-fg-2">
                <Layer label="padding" value={`${p}px`} className="border-ok/60 bg-ok-soft text-ok">
                  <div className="rounded border border-primary/60 bg-primary-soft px-2 py-3 font-mono text-xs text-primary">
                    content {contentW} × {contentH}
                  </div>
                </Layer>
              </Layer>
            </Layer>
          </Panel>
          <Panel title="Real element rendered by your browser">
            <div className="overflow-x-auto rounded border border-dashed border-line" style={{ backgroundImage: "repeating-linear-gradient(45deg, var(--surface-elevated) 0 6px, transparent 6px 12px)" }}>
              <div className="inline-block">
                <div
                  ref={ref}
                  style={{ boxSizing: sizing, width: w, height: h, padding: p, borderWidth: b, borderStyle: "solid", margin: m }}
                  className="overflow-hidden border-fg-2 bg-primary-soft bg-clip-content text-[11px] text-fg"
                >
                  content
                </div>
              </div>
            </div>
            <p className="mt-1 text-[11px] text-fg-3">Stripes = the margin area (margin is always transparent). Blue = content area.</p>
          </Panel>
          <div className="grid grid-cols-3 gap-3">
            <Stat label="Content box" value={`${contentW}×${contentH}`} />
            <Stat label="Border box" value={`${borderBoxW}×${borderBoxH}`} hint={`measured: ${measured.w}×${measured.h}`} />
            <Stat label="With margin" value={`${spaceW}×${spaceH}`} />
          </div>
        </div>
      </div>
      <Callout tone={clamped ? "warning" : "primary"} title={sizing === "content-box" ? "content-box: width = content only" : "border-box: width = content + padding + border"}>
        {sizing === "content-box"
          ? `Total width = ${w} + 2×${p} padding + 2×${b} border = ${borderBoxW}px. Adding padding makes the box grow.`
          : clamped
            ? "Padding + border are larger than the width, so the content shrinks to 0 and the box grows to fit them."
            : `The box stays ${w}px wide; padding and border eat into the content, which is now ${contentW}px. This is why many resets use *, *::before, *::after { box-sizing: border-box; }.`}
        {" "}Margin never counts toward width; it is space outside the border (and vertical margins between blocks can collapse).
      </Callout>
    </div>
  );
}
