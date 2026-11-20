import { Link } from "react-router-dom";
import { MODULES } from "@/content/modules";
import { LESSONS } from "@/content";
import { Badge, Card, PageHeader, ProgressBar } from "@/components/ui/primitives";
import { useProgressStore } from "@/stores/progressStore";

export default function MasterCorePage() {
  const completed = useProgressStore((s) => s.completedLessons);
  return (
    <div>
      <PageHeader
        eyebrow="Path A"
        title="Master Core"
        description="The full curriculum ordered by conceptual prerequisites — from how the web works to professional React architecture. Progress is shared with the University Academy path."
      />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {MODULES.map((m) => {
          const lessons = LESSONS.filter((l) => l.moduleId === m.id);
          const done = lessons.filter((l) => completed[l.id]).length;
          return (
            <Link key={m.id} to={`/learn/${m.id}`} className="block">
              <Card className="h-full p-4 transition-colors hover:border-line-strong hover:bg-hover">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-fg-3">MODULE {m.number}</span>
                  <div className="flex gap-1">
                    {m.examCritical && <Badge tone="warning">Exam</Badge>}
                    <Badge tone={m.priority === "P0" ? "error" : m.priority === "P1" ? "primary" : "neutral"}>{m.priority}</Badge>
                  </div>
                </div>
                <h3 className="mt-2 font-semibold text-fg">{m.title}</h3>
                <p className="mt-1 text-xs text-fg-2">{m.description}</p>
                <div className="mt-4">
                  <div className="mb-1 flex justify-between text-[11px] text-fg-3">
                    <span>{lessons.length ? `${done}/${lessons.length} lessons` : "Lessons in preparation"}</span>
                    {lessons.length > 0 && <span>{Math.round((done / lessons.length) * 100)}%</span>}
                  </div>
                  <ProgressBar value={done} max={Math.max(1, lessons.length)} tone="success" label={`${m.title} progress`} />
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
