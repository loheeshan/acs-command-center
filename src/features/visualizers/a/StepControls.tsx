import { ChevronLeft, ChevronRight, Pause, Play, RotateCcw } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/primitives";
import type { Stepper } from "./useStepper";

export function StepControls({ s, label = "Step" }: { s: Stepper; label?: string }) {
  return (
    <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Simulation controls">
      <Button size="sm" onClick={s.reset} disabled={s.atStart && !s.playing} aria-label="Restart">
        <RotateCcw size={14} /> Restart
      </Button>
      <Button size="sm" onClick={s.prev} disabled={s.atStart} aria-label="Step back">
        <ChevronLeft size={14} /> Back
      </Button>
      <Button size="sm" variant="primary" onClick={s.toggle} aria-label={s.playing ? "Pause" : "Play"}>
        {s.playing ? <Pause size={14} /> : <Play size={14} />} {s.playing ? "Pause" : s.atEnd ? "Replay" : "Play"}
      </Button>
      <Button size="sm" onClick={s.next} disabled={s.atEnd} aria-label="Step forward">
        Next <ChevronRight size={14} />
      </Button>
      <label className="flex items-center gap-1.5 text-xs text-fg-2">
        Speed
        <select
          value={s.speed}
          onChange={(e) => s.setSpeed(Number(e.target.value))}
          className="h-8 rounded-md border border-line bg-elevated px-1.5 text-xs text-fg"
        >
          <option value={1600}>Slow</option>
          <option value={900}>Normal</option>
          <option value={400}>Fast</option>
        </select>
      </label>
      <span className="ml-auto text-xs tabular-nums text-fg-3" aria-live="polite">
        {label} {s.step + 1} / {Math.max(1, s.total)}
      </span>
    </div>
  );
}

/** Small labelled panel used by many visualizers. */
export function Panel({ title, children, className = "", tone }: { title: string; children: ReactNode; className?: string; tone?: "primary" | "ok" | "warn" | "violet" | "err" }) {
  const toneCls = tone ? { primary: "text-primary", ok: "text-ok", warn: "text-warn", violet: "text-violet", err: "text-err" }[tone] : "text-fg-2";
  return (
    <section className={`min-w-0 rounded-md border border-line bg-elevated/60 p-2.5 ${className}`} aria-label={title}>
      <h4 className={`mb-1.5 text-[11px] font-semibold uppercase tracking-wider ${toneCls}`}>{title}</h4>
      {children}
    </section>
  );
}

export const inputCls = "h-8 rounded-md border border-line bg-surface px-2 text-sm text-fg focus:border-primary focus:outline-none";

/** Labelled range slider with numeric readout. */
export function RangeField({ label, value, min, max, step = 1, unit = "px", onChange }: { label: string; value: number; min: number; max: number; step?: number; unit?: string; onChange: (v: number) => void }) {
  return (
    <label className="flex flex-col gap-1 text-xs text-fg-2">
      <span className="flex justify-between gap-2">
        <span>{label}</span>
        <span className="font-mono text-fg">
          {value}
          {unit}
        </span>
      </span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="accent-[var(--primary)]" />
    </label>
  );
}
