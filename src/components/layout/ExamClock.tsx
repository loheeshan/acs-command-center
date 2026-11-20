import { Link } from "react-router-dom";
import { Timer } from "lucide-react";
import { useNow } from "@/hooks/useNow";
import { useProgressStore } from "@/stores/progressStore";
import { formatDate, ictWindow, splitDuration } from "@/lib/dates";
import { cn } from "@/lib/cn";

const pad = (n: number) => String(n).padStart(2, "0");

export function useIctState() {
  const now = useNow(1000);
  const override = useProgressStore((s) => s.ictStartTime);
  const { start, end } = ictWindow(override);
  const phase: "before" | "during" | "after" = now < start ? "before" : now < end ? "during" : "after";
  return { now, start, end, phase, remaining: phase === "before" ? start - now : phase === "during" ? end - now : 0 };
}

/** Compact live countdown for the top bar. */
export function ExamClockCompact() {
  const { phase, remaining } = useIctState();
  const { d, h, m, s } = splitDuration(remaining);
  return (
    <Link
      to="/fast-track"
      title="ICT: 25 Nov 2026, 15:30–17:30 (Asia/Colombo)"
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-1 font-mono text-xs tabular-nums",
        phase === "during" ? "border-err/50 bg-err-soft text-err" : d === 0 && phase === "before" ? "border-warn/50 bg-warn-soft text-warn" : "border-line bg-elevated text-fg",
      )}
    >
      <Timer size={13} />
      {phase === "before" && <><span className="hidden font-sans text-fg-2 sm:inline">ICT in</span>{d > 0 && `${d}d `}{pad(h)}:{pad(m)}:{pad(s)}</>}
      {phase === "during" && <>ICT live · {pad(h)}:{pad(m)}:{pad(s)} left</>}
      {phase === "after" && <>ICT finished</>}
    </Link>
  );
}

/** Large countdown for the dashboard / fast-track page. */
export function ExamClockHero() {
  const { phase, remaining, start, end } = useIctState();
  const { d, h, m, s } = splitDuration(remaining);
  const units = [
    { v: d, l: "days" },
    { v: h, l: "hours" },
    { v: m, l: "minutes" },
    { v: s, l: "seconds" },
  ];
  return (
    <div className={cn("rounded-lg border p-4 sm:p-5", phase === "during" ? "border-err/50 bg-err-soft" : "border-primary/40 bg-primary-soft")}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            {phase === "before" ? "Countdown to ICT (40%)" : phase === "during" ? "ICT in progress — time remaining" : "ICT complete"}
          </p>
          <p className="mt-0.5 text-sm text-fg-2">
            {formatDate(start, { weekday: "long", day: "numeric", month: "long" })} · {formatDate(start, { hour: "2-digit", minute: "2-digit" })}–{formatDate(end, { hour: "2-digit", minute: "2-digit" })} (Asia/Colombo) · qualifying mark 30/100
          </p>
        </div>
        {phase !== "after" && (
          <div role="timer" aria-label="Time until the ICT" className="flex gap-2">
            {units.map((u) => (
              <div key={u.l} className="min-w-14 rounded-md border border-line bg-surface px-2 py-1.5 text-center">
                <div className="font-mono text-2xl font-semibold tabular-nums text-fg">{pad(u.v)}</div>
                <div className="text-[10px] uppercase tracking-wide text-fg-3">{u.l}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
