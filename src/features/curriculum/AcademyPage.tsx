import { Link } from "react-router-dom";
import { ACADEMY } from "@/content/modules";
import { lessonById } from "@/content";
import { Badge, Card, PageHeader, ProgressBar } from "@/components/ui/primitives";
import { useProgressStore } from "@/stores/progressStore";
import { formatDate, todayColombo } from "@/lib/dates";
import { CheckCircle2, Circle } from "lucide-react";

const MATERIAL_TONE = { supplied: "success", partial: "warning", missing: "error", none: "neutral" } as const;
const MATERIAL_LABEL = { supplied: "Materials supplied", partial: "Partially supplied", missing: "Lecture not supplied — supplementary lessons", none: "No teaching" };

export default function AcademyPage() {
  const completed = useProgressStore((s) => s.completedLessons);
  const today = todayColombo();
  return (
    <div>
      <PageHeader
        eyebrow="Path B"
        title="University Academy"
        description="Follows the official 5COSC026W teaching roadmap (v1 2026/27, marked tentative by the module team). Lessons are shared with Master Core, so completing one counts in both paths."
      />
      <ol className="relative space-y-3 border-l border-line pl-5">
        {ACADEMY.map((w) => {
          const lessons = w.lessonIds.map((id) => ({ id, lesson: lessonById(id) }));
          const available = lessons.filter((l) => l.lesson);
          const done = available.filter((l) => completed[l.id]).length;
          const current = today >= w.dateCommencing && today < new Date(new Date(w.dateCommencing).getTime() + 7 * 864e5).toISOString().slice(0, 10);
          return (
            <li key={w.id} className="relative">
              <span className={`absolute -left-[27px] top-4 h-3 w-3 rounded-full border-2 ${current ? "border-primary bg-primary" : today > w.dateCommencing ? "border-ok bg-ok" : "border-line-strong bg-bg"}`} />
              <Card className={`p-4 ${current ? "border-primary/60" : ""}`}>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-semibold text-primary">{w.week}</span>
                  <span className="text-xs text-fg-3">w/c {formatDate(w.dateCommencing, { day: "numeric", month: "short", year: "numeric" })}</span>
                  {current && <Badge tone="primary">This week</Badge>}
                  <Badge tone={MATERIAL_TONE[w.materials]}>{MATERIAL_LABEL[w.materials]}</Badge>
                  {w.assessment && <Badge tone="warning">{w.assessment}</Badge>}
                </div>
                <h3 className="mt-2 text-sm font-semibold">{w.lecture}</h3>
                <p className="text-xs text-fg-2">{w.tutorial}</p>
                <p className="mt-1 text-xs text-fg-3">{w.materialNotes}</p>
                {lessons.length > 0 && (
                  <>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {lessons.map(({ id, lesson }) =>
                        lesson ? (
                          <Link key={id} to={`/lesson/${id}`} className="inline-flex items-center gap-1 rounded border border-line bg-elevated px-2 py-1 text-xs text-fg-2 hover:border-primary hover:text-primary">
                            {completed[id] ? <CheckCircle2 size={12} className="text-ok" /> : <Circle size={12} />}
                            {lesson.title}
                          </Link>
                        ) : (
                          <span key={id} className="rounded border border-dashed border-line px-2 py-1 text-xs text-fg-3" title="Lesson in preparation">{id}</span>
                        ),
                      )}
                    </div>
                    {available.length > 0 && <div className="mt-3 max-w-xs"><ProgressBar value={done} max={available.length} tone="success" label={`${w.week} progress`} /></div>}
                  </>
                )}
              </Card>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
