import { Link } from "react-router-dom";
import { CheckCircle2, Circle, Coffee } from "lucide-react";
import { STUDY_PLAN, scheduleDay } from "./plan";
import { Badge, Card, PageHeader, ProgressBar } from "@/components/ui/primitives";
import { useProgressStore } from "@/stores/progressStore";
import { formatDate, todayColombo } from "@/lib/dates";
import { cn } from "@/lib/cn";

export function TaskRow({ id, title, minutes, to, kind, compact = false }: { id: string; title: string; minutes: number; to: string; kind: string; compact?: boolean }) {
  const lessonId = id.startsWith("l:") ? id.slice(2) : null;
  const lessonDone = useProgressStore((s) => (lessonId ? !!s.completedLessons[lessonId] : false));
  const manual = useProgressStore((s) => !!s.studyTasksDone[id]);
  const toggle = useProgressStore((s) => s.toggleStudyTask);
  const done = lessonDone || manual;
  return (
    <li className={cn("flex items-center gap-2.5 rounded-md px-2 py-1.5 hover:bg-hover", compact && "py-1")}>
      <button type="button" onClick={() => !lessonDone && toggle(id)} aria-label={done ? "Mark not done" : "Mark done"} title={lessonDone ? "Completed via the lesson" : undefined} className="shrink-0">
        {done ? <CheckCircle2 size={16} className="text-ok" /> : kind === "break" ? <Coffee size={16} className="text-fg-3" /> : <Circle size={16} className="text-fg-3" />}
      </button>
      <Link to={to} className={cn("flex-1 text-sm", done ? "text-fg-3 line-through" : "text-fg hover:text-primary")}>{title}</Link>
      <span className="shrink-0 font-mono text-[11px] text-fg-3">{minutes}m</span>
    </li>
  );
}

export default function RoadmapPage() {
  const availability = useProgressStore((s) => s.studyAvailability);
  const setAvailability = useProgressStore((s) => s.setAvailability);
  const tasksDone = useProgressStore((s) => s.studyTasksDone);
  const completed = useProgressStore((s) => s.completedLessons);
  const today = todayColombo();
  return (
    <div>
      <PageHeader eyebrow="ICT preparation" title="Study Roadmap · 20–25 Nov" description="Set how many hours you really have each day. Tasks are fitted in priority order; anything that doesn't fit is listed under 'if time permits'. Lesson tasks tick themselves when you complete the lesson." />
      <div className="space-y-3">
        {STUDY_PLAN.map((day) => {
          const hours = availability[day.date] ?? day.defaultHours;
          const { planned, overflow, usedMinutes } = scheduleDay(day, hours);
          const isDone = (id: string) => (id.startsWith("l:") ? !!completed[id.slice(2)] : !!tasksDone[id]);
          const doneCount = planned.filter((t) => isDone(t.id)).length;
          const isToday = day.date === today;
          const past = day.date < today;
          return (
            <Card key={day.date} className={cn("p-4", isToday && "border-primary/60")}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-semibold">{formatDate(day.date, { weekday: "short", day: "numeric", month: "short" })}</h2>
                    {isToday && <Badge tone="primary">Today</Badge>}
                    {past && <Badge>Past</Badge>}
                    {day.date === "2026-11-25" && <Badge tone="error">ICT 15:30</Badge>}
                  </div>
                  <p className="text-sm text-fg-2">{day.theme}</p>
                  {day.note && <p className="mt-1 text-xs text-warn">{day.note}</p>}
                </div>
                <label className="flex items-center gap-2 text-xs text-fg-2">
                  Hours available
                  <input type="number" min={0} max={14} step={0.5} value={hours} onChange={(e) => setAvailability(day.date, Math.max(0, Math.min(14, Number(e.target.value) || 0)))} className="h-8 w-16 rounded border border-line bg-elevated px-2 text-right text-fg" />
                </label>
              </div>
              <div className="mt-3 flex items-center gap-3">
                <div className="flex-1"><ProgressBar value={doneCount} max={Math.max(1, planned.length)} tone="success" label={`${day.date} progress`} /></div>
                <span className="text-xs text-fg-3">{doneCount}/{planned.length} · {Math.round(usedMinutes / 6) / 10}h planned{planned.length > 4 ? " · take a 10-min break every hour" : ""}</span>
              </div>
              <ul className="mt-2">{planned.map((t) => <TaskRow key={t.id} {...t} />)}</ul>
              {overflow.length > 0 && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-xs text-fg-3">If time permits ({overflow.length})</summary>
                  <ul className="mt-1 opacity-80">{overflow.map((t) => <TaskRow key={t.id} {...t} compact />)}</ul>
                </details>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
