import { Link, useParams } from "react-router-dom";
import { ArrowLeft, FlaskConical } from "lucide-react";
import { moduleById } from "@/content/modules";
import { lessonsByModule } from "@/content";
import type { ModuleId } from "@/content/types";
import { Badge, EmptyState, PageHeader } from "@/components/ui/primitives";
import { LessonCard } from "./LessonCard";
import { VISUALIZERS } from "@/features/visualizers/registry";

export default function ModulePage() {
  const { moduleId } = useParams();
  const mod = moduleById(moduleId ?? "");
  if (!mod) return <EmptyState title="Module not found">Check the URL or go back to <Link className="text-primary" to="/learn">Master Core</Link>.</EmptyState>;
  const lessons = lessonsByModule(mod.id as ModuleId);
  const vizIds = new Set(lessons.flatMap((l) => l.visualizers ?? []));
  const viz = VISUALIZERS.filter((v) => vizIds.has(v.id));
  return (
    <div>
      <Link to="/learn" className="mb-4 inline-flex items-center gap-1 text-xs text-fg-2 hover:text-primary"><ArrowLeft size={13} /> Master Core</Link>
      <PageHeader
        eyebrow={`Module ${mod.number}`}
        title={mod.title}
        description={mod.description}
        actions={<>{mod.examCritical && <Badge tone="warning">Exam-critical</Badge>}<Badge>{mod.priority}</Badge></>}
      />
      {lessons.length === 0 ? (
        <EmptyState title="Lessons for this module are not available yet">This module's content is still being prepared. Its topics are covered in the question bank and revision center.</EmptyState>
      ) : (
        <div className="grid gap-2.5 md:grid-cols-2">
          {lessons.map((l, i) => <LessonCard key={l.id} lesson={l} index={i} />)}
        </div>
      )}
      {viz.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 text-sm font-semibold">Interactive labs for this module</h2>
          <div className="flex flex-wrap gap-2">
            {viz.map((v) => (
              <Link key={v.id} to={`/lab/visual/${v.id}`} className="inline-flex items-center gap-1.5 rounded-md border border-line bg-surface px-3 py-1.5 text-xs text-fg-2 hover:border-primary hover:text-primary">
                <FlaskConical size={13} /> {v.title}
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
