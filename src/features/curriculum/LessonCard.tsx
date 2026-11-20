import { Link } from "react-router-dom";
import { CheckCircle2, Circle, Clock } from "lucide-react";
import type { Lesson } from "@/content/types";
import { Badge } from "@/components/ui/primitives";
import { useProgressStore } from "@/stores/progressStore";

export function LessonCard({ lesson, index }: { lesson: Lesson; index?: number }) {
  const done = useProgressStore((s) => !!s.completedLessons[lesson.id]);
  const uni = lesson.sources.some((s) => s.kind === "university");
  return (
    <Link
      to={`/lesson/${lesson.id}`}
      className="group flex items-start gap-3 rounded-lg border border-line bg-surface p-3.5 transition-colors hover:border-line-strong hover:bg-hover"
    >
      <span className="mt-0.5 shrink-0" aria-label={done ? "Completed" : "Not completed"}>
        {done ? <CheckCircle2 size={18} className="text-ok" /> : <Circle size={18} className="text-fg-3" />}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          {index !== undefined && <span className="font-mono text-[11px] text-fg-3">{String(index + 1).padStart(2, "0")}</span>}
          <h3 className="text-sm font-medium text-fg group-hover:text-primary">{lesson.title}</h3>
        </div>
        <p className="mt-0.5 line-clamp-2 text-xs text-fg-2">{lesson.summary}</p>
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          {lesson.examCritical && <Badge tone="warning">Exam-critical</Badge>}
          <Badge tone={uni ? "primary" : "violet"}>{uni ? "University-derived" : "Supplementary"}</Badge>
          <span className="inline-flex items-center gap-1 text-[11px] text-fg-3"><Clock size={11} /> {lesson.minutes} min</span>
        </div>
      </div>
    </Link>
  );
}
