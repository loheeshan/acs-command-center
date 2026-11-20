import type { Breakdown } from "@/features/assessment/scoring";
import { cn } from "@/lib/cn";

/** Horizontal bar list. Values come only from recorded attempts. */
export function Bars({ rows, label }: { rows: (Breakdown & { label: string })[]; label: string }) {
  return (
    <ul aria-label={label} className="space-y-2">
      {rows.map((r) => (
        <li key={r.key} className="grid grid-cols-[minmax(0,9rem)_1fr_auto] items-center gap-3 text-sm">
          <span className="truncate text-fg-2" title={r.label}>{r.label}</span>
          <div className="h-2 overflow-hidden rounded-full bg-elevated">
            <div className={cn("h-full rounded-full", r.pct >= 80 ? "bg-ok" : r.pct >= 65 ? "bg-primary" : r.pct >= 40 ? "bg-warn" : "bg-err")} style={{ width: `${r.pct}%` }} />
          </div>
          <span className="w-28 text-right font-mono text-xs tabular-nums text-fg-2">{r.pct}% <span className="text-fg-3">({r.awarded}/{r.available})</span></span>
        </li>
      ))}
    </ul>
  );
}
