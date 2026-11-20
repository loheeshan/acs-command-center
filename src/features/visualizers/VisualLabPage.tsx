import { Link } from "react-router-dom";
import { CheckCircle2, FlaskConical } from "lucide-react";
import { VISUALIZERS } from "./registry";
import { TOPIC_LABELS, type TopicId } from "@/content/types";
import { Badge, Card, EmptyState, PageHeader } from "@/components/ui/primitives";
import { useProgressStore } from "@/stores/progressStore";

export default function VisualLabPage() {
  const done = useProgressStore((s) => s.completedVisualizers);
  const topics = [...new Set(VISUALIZERS.map((v) => v.topic))] as TopicId[];
  return (
    <div>
      <PageHeader eyebrow="Laboratory" title="Visual Lab" description="Interactive, step-through models of how things work internally. Each lab says whether it runs real code/CSS (live) or is an educational simulation of real semantics." />
      {VISUALIZERS.length === 0 && <EmptyState icon={<FlaskConical size={28} />} title="Visualizers are being built">They will appear here automatically.</EmptyState>}
      {topics.map((t) => (
        <section key={t} className="mb-6">
          <h2 className="mb-2 text-sm font-semibold text-fg-2">{TOPIC_LABELS[t]}</h2>
          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {VISUALIZERS.filter((v) => v.topic === t).map((v) => (
              <Link key={v.id} to={`/lab/visual/${v.id}`}>
                <Card className="h-full p-3.5 transition-colors hover:border-line-strong hover:bg-hover">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-medium">{v.title}</h3>
                    {done[v.id] && <CheckCircle2 size={15} className="shrink-0 text-ok" aria-label="Explored" />}
                  </div>
                  <p className="mt-1 text-xs text-fg-2">{v.description}</p>
                  <Badge className="mt-2" tone={v.kind === "live" ? "success" : "violet"}>{v.kind === "live" ? "Live" : "Simulation"}</Badge>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
