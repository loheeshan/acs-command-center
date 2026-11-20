import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight, FlaskConical, Pause, Play, RotateCcw } from "lucide-react";
import { Button, Segmented } from "@/components/ui/primitives";
import { useProgressStore } from "@/stores/progressStore";
import { cn } from "@/lib/cn";

/** Banner shown on every simulated visualizer. */
export function SimBanner({ children }: { children?: ReactNode }) {
  return (
    <div className="flex items-start gap-2 rounded-md border border-violet/30 bg-violet-soft px-3 py-2 text-xs text-violet">
      <FlaskConical size={14} className="mt-0.5 shrink-0" aria-hidden />
      <span>
        <strong>Simulation — no real requests.</strong> {children ?? "Everything here is an educational model running in your browser."}
      </span>
    </div>
  );
}

/** Calls markVisualizer(id) once; returns a function to call on meaningful interaction. */
export function useMarkOnce(id: string) {
  const done = useRef(false);
  return useCallback(() => {
    if (done.current) return;
    done.current = true;
    useProgressStore.getState().markVisualizer(id);
  }, [id]);
}

export type Speed = "slow" | "normal" | "fast";
const SPEED_MS: Record<Speed, number> = { slow: 2200, normal: 1300, fast: 650 };

/** Generic step-through controller with autoplay. */
export function useStepper(total: number, onFinish?: () => void) {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState<Speed>("normal");
  const finishRef = useRef(onFinish);
  useEffect(() => {
    finishRef.current = onFinish;
  });

  useEffect(() => {
    if (step >= total - 1 && total > 0) finishRef.current?.();
  }, [step, total]);

  useEffect(() => {
    if (!playing) return;
    if (step >= total - 1) {
      setPlaying(false);
      return;
    }
    const t = setTimeout(() => setStep((s) => Math.min(total - 1, s + 1)), SPEED_MS[speed]);
    return () => clearTimeout(t);
  }, [playing, step, total, speed]);

  return {
    step,
    total,
    playing,
    speed,
    setSpeed,
    setStep: (n: number) => setStep(Math.max(0, Math.min(total - 1, n))),
    next: () => setStep((s) => Math.min(total - 1, s + 1)),
    back: () => setStep((s) => Math.max(0, s - 1)),
    restart: () => {
      setPlaying(false);
      setStep(0);
    },
    toggle: () => {
      if (step >= total - 1) setStep(0);
      setPlaying((p) => !p);
    },
  };
}

export type Stepper = ReturnType<typeof useStepper>;

export function StepControls({ s, label = "Step" }: { s: Stepper; label?: string }) {
  return (
    <div
      className="flex flex-wrap items-center gap-2"
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") s.next();
        if (e.key === "ArrowLeft") s.back();
      }}
    >
      <Button size="sm" onClick={s.restart} aria-label="Restart">
        <RotateCcw size={14} />
      </Button>
      <Button size="sm" onClick={s.back} disabled={s.step === 0} aria-label="Previous step">
        <ChevronLeft size={14} /> Back
      </Button>
      <Button size="sm" variant="primary" onClick={s.toggle} aria-label={s.playing ? "Pause" : "Play"}>
        {s.playing ? <Pause size={14} /> : <Play size={14} />} {s.playing ? "Pause" : "Play"}
      </Button>
      <Button size="sm" onClick={s.next} disabled={s.step >= s.total - 1} aria-label="Next step">
        Next <ChevronRight size={14} />
      </Button>
      <Segmented<Speed>
        size="sm"
        label="Playback speed"
        value={s.speed}
        onChange={s.setSpeed}
        options={[
          { value: "slow", label: "0.5×" },
          { value: "normal", label: "1×" },
          { value: "fast", label: "2×" },
        ]}
      />
      <span className="text-xs text-fg-3 tabular-nums" aria-live="polite">
        {label} {s.step + 1} / {s.total}
      </span>
    </div>
  );
}

/** Vertical list of steps, current highlighted, clickable. */
export function StepList({ steps, s }: { steps: { title: string; detail?: ReactNode }[]; s: Stepper }) {
  return (
    <ol className="space-y-1">
      {steps.map((st, i) => (
        <li key={i}>
          <button
            type="button"
            onClick={() => s.setStep(i)}
            aria-current={i === s.step ? "step" : undefined}
            className={cn(
              "flex w-full items-start gap-2 rounded-md border px-2.5 py-1.5 text-left text-xs transition-colors",
              i === s.step ? "border-primary/40 bg-primary-soft text-fg" : i < s.step ? "border-line bg-elevated text-fg-2" : "border-transparent text-fg-3 hover:bg-hover",
            )}
          >
            <span className={cn("mt-px inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold", i <= s.step ? "bg-primary text-on-primary" : "bg-elevated text-fg-3")}>
              {i + 1}
            </span>
            <span>
              <span className="font-medium">{st.title}</span>
              {i === s.step && st.detail && <span className="mt-0.5 block text-fg-2">{st.detail}</span>}
            </span>
          </button>
        </li>
      ))}
    </ol>
  );
}

export const inputCls =
  "h-8 w-full rounded-md border border-line bg-bg px-2 text-sm text-fg outline-none focus:border-primary focus:ring-2 focus:ring-primary/30";
export const textareaCls =
  "w-full rounded-md border border-line bg-bg px-2 py-1.5 font-mono text-xs text-fg outline-none focus:border-primary focus:ring-2 focus:ring-primary/30";
export const labelCls = "mb-1 block text-xs font-medium text-fg-2";

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: ReactNode }) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2 text-xs text-fg-2">
      <input type="checkbox" className="h-4 w-4 accent-[var(--primary)]" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      {label}
    </label>
  );
}

export function Pre({ children, className }: { children: ReactNode; className?: string }) {
  return <pre className={cn("overflow-x-auto whitespace-pre-wrap break-words rounded-md border border-line bg-code p-2.5 font-mono text-[11.5px] leading-relaxed text-fg", className)}>{children}</pre>;
}

export function statusTone(status: number): "success" | "warning" | "error" | "neutral" {
  if (status >= 200 && status < 300) return "success";
  if (status >= 400 && status < 500) return "warning";
  if (status >= 500) return "error";
  return "neutral";
}
