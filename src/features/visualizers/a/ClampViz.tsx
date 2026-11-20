import { useState } from "react";
import { Badge, Callout, Stat } from "@/components/ui/primitives";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { cn } from "@/lib/cn";
import { Panel, RangeField, inputCls } from "./StepControls";
import { useMarkOnce } from "./useStepper";

const VW_MIN = 320;
const VW_MAX = 1600;
const ROOT = 16;

export default function ClampViz() {
  const [minPx, setMinPx] = useState(20);
  const [vw, setVw] = useState(4);
  const [remAdd, setRemAdd] = useState(1);
  const [maxPx, setMaxPx] = useState(56);
  const [viewport, setViewport] = useState(800);
  const mark = useMarkOnce("clamp");

  const preferred = (w: number) => (vw * w) / 100 + remAdd * ROOT;
  // CSS spec: clamp(MIN, VAL, MAX) = max(MIN, min(VAL, MAX)) — MIN wins if MIN > MAX
  const clampAt = (w: number) => Math.max(minPx, Math.min(preferred(w), maxPx));
  const pref = preferred(viewport);
  const value = clampAt(viewport);
  const active = minPx > maxPx ? "min (min > max, so min wins)" : pref < minPx ? "min" : pref > maxPx ? "max" : "preferred";

  // SVG plot
  const W = 520, H = 200, PAD = 32;
  const yMax = Math.max(maxPx, minPx, preferred(VW_MAX)) * 1.1;
  const x = (w: number) => PAD + ((w - VW_MIN) / (VW_MAX - VW_MIN)) * (W - PAD * 1.5);
  const y = (v: number) => H - PAD + 4 - (v / yMax) * (H - PAD * 1.5);
  const samples = Array.from({ length: 65 }, (_, i) => VW_MIN + (i * (VW_MAX - VW_MIN)) / 64);
  const line = (f: (w: number) => number) => samples.map((w, i) => `${i ? "L" : "M"}${x(w).toFixed(1)},${y(f(w)).toFixed(1)}`).join(" ");

  const num = (label: string, v: number, set: (n: number) => void, step = 1) => (
    <label className="flex flex-col gap-1 text-xs text-fg-2">
      {label}
      <input type="number" step={step} className={cn(inputCls, "w-full font-mono")} value={v} onChange={(e) => { set(Number(e.target.value) || 0); mark(); }} />
    </label>
  );

  const prefSrc = remAdd ? `${vw}vw + ${remAdd}rem` : `${vw}vw`;
  const css = `h1 {\n  font-size: clamp(${minPx}px, ${prefSrc}, ${maxPx}px);\n}\n/* at ${viewport}px viewport: ${prefSrc} = ${pref.toFixed(1)}px → ${value.toFixed(1)}px */`;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {num("MIN (px)", minPx, setMinPx)}
            {num("MAX (px)", maxPx, setMaxPx)}
            {num("preferred: vw", vw, setVw, 0.5)}
            {num("preferred: + rem", remAdd, setRemAdd, 0.25)}
          </div>
          <RangeField label="simulated viewport width" value={viewport} min={VW_MIN} max={VW_MAX} step={10} onChange={(v) => { setViewport(v); mark(); }} />
          <div className="grid grid-cols-3 gap-3">
            <Stat label="1vw" value={`${(viewport / 100).toFixed(1)}px`} />
            <Stat label="preferred" value={`${pref.toFixed(1)}px`} />
            <Stat label="result" value={`${value.toFixed(1)}px`} />
          </div>
          <div className="flex flex-wrap gap-1.5">
            <Badge tone={active.startsWith("min") ? "warning" : "neutral"}>MIN active</Badge>
            <Badge tone={active === "preferred" ? "success" : "neutral"}>preferred active</Badge>
            <Badge tone={active === "max" ? "error" : "neutral"}>MAX active</Badge>
          </div>
          <CodeBlock code={css} language="css" title="fluid-type.css" runnable={false} />
        </div>
        <div className="space-y-3">
          <Panel title="Result across viewport widths">
            <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={`Plot of the clamped value from ${VW_MIN}px to ${VW_MAX}px viewport width`}>
              <line x1={PAD} y1={y(0)} x2={W - PAD / 2} y2={y(0)} stroke="var(--border-strong)" />
              <line x1={PAD} y1={y(0)} x2={PAD} y2={PAD / 2} stroke="var(--border-strong)" />
              <line x1={PAD} x2={W - PAD / 2} y1={y(minPx)} y2={y(minPx)} stroke="var(--warning)" strokeDasharray="4 4" />
              <line x1={PAD} x2={W - PAD / 2} y1={y(maxPx)} y2={y(maxPx)} stroke="var(--error)" strokeDasharray="4 4" />
              <path d={line(preferred)} fill="none" stroke="var(--text-muted)" strokeDasharray="2 3" />
              <path d={line(clampAt)} fill="none" stroke="var(--primary)" strokeWidth={2.5} />
              <line x1={x(viewport)} x2={x(viewport)} y1={y(0)} y2={PAD / 2} stroke="var(--text-secondary)" strokeWidth={0.75} />
              <circle cx={x(viewport)} cy={y(value)} r={5} fill="var(--primary)" />
              <text x={PAD + 4} y={y(minPx) - 4} fontSize={10} fill="var(--warning)">min {minPx}px</text>
              <text x={PAD + 4} y={y(maxPx) - 4} fontSize={10} fill="var(--error)">max {maxPx}px</text>
              <text x={PAD} y={H - 8} fontSize={10} fill="var(--text-muted)">{VW_MIN}px</text>
              <text x={W - PAD / 2} y={H - 8} fontSize={10} fill="var(--text-muted)" textAnchor="end">{VW_MAX}px viewport</text>
            </svg>
            <p className="text-[11px] text-fg-3">Blue = clamp() result · dotted grey = preferred value alone · dashed = bounds</p>
          </Panel>
          <Panel title="Live text at the computed size">
            <p className="overflow-hidden font-semibold leading-tight text-fg" style={{ fontSize: `${value}px` }}>Campus Events</p>
          </Panel>
          <Callout tone="primary" title={`Active: ${active}`}>
            <span aria-live="polite">
              clamp(MIN, PREFERRED, MAX) returns the preferred value but never less than MIN or more than MAX. Adding a rem term
              (e.g. <code>4vw + 1rem</code>) keeps text responsive to the user's font-size setting; pure vw ignores that preference and scales badly with zoom (an accessibility issue).
            </span>
          </Callout>
        </div>
      </div>
    </div>
  );
}
