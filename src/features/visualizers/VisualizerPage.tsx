import { Suspense } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { visualizerById } from "./registry";
import { LESSONS } from "@/content";
import { Badge, Card, EmptyState, PageHeader } from "@/components/ui/primitives";

export default function VisualizerPage() {
  const { vizId } = useParams();
  const v = visualizerById(vizId ?? "");
  if (!v) return <EmptyState title="Visualizer not found" action={<Link to="/lab/visual" className="text-sm text-primary">Visual Lab</Link>} />;
  const related = LESSONS.filter((l) => l.visualizers?.includes(v.id));
  return (
    <div>
      <Link to="/lab/visual" className="mb-4 inline-flex items-center gap-1 text-xs text-fg-2 hover:text-primary"><ArrowLeft size={13} /> Visual Lab</Link>
      <PageHeader title={v.title} description={v.description} actions={<Badge tone={v.kind === "live" ? "success" : "violet"}>{v.kind === "live" ? "Live — real code/CSS" : "Educational simulation"}</Badge>} />
      <Card className="p-4"><Suspense fallback={<p className="text-sm text-fg-2">Loading…</p>}><v.component /></Suspense></Card>
      {related.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-fg-2">
          Related lessons:
          {related.map((l) => <Link key={l.id} to={`/lesson/${l.id}`} className="rounded border border-line px-2 py-1 hover:border-primary hover:text-primary">{l.title}</Link>)}
        </div>
      )}
    </div>
  );
}
