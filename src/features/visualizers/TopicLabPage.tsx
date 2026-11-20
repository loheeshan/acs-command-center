import { Suspense } from "react";
import { Link, useParams } from "react-router-dom";
import { Code2 } from "lucide-react";
import { visualizerById } from "./registry";
import { Badge, Card, EmptyState, PageHeader } from "@/components/ui/primitives";

const LABS: Record<string, { title: string; description: string; viz: string[]; presets: { id: string; label: string }[] }> = {
  api: {
    title: "API Lab",
    description: "Build HTTP requests, inspect responses and status codes, and see how fetch, CORS, cancellation and race conditions behave. Network behaviour here is simulated against a mock CampusEvents API — no real requests are sent.",
    viz: ["http-lab", "url-anatomy", "cors-preflight", "abort-race", "crud-simulator", "architecture-flow"],
    presets: [{ id: "react-useeffect-fetch", label: "Service → Hook → Component (runs real fetch against the sandbox mock API)" }, { id: "forms-create-event", label: "Validated POST form" }],
  },
  security: {
    title: "Security Lab",
    description: "Isolated, fictional environments for authentication, JWTs, 401 vs 403 and trust boundaries. No real credentials, tokens or external targets are used.",
    viz: ["jwt-explorer", "auth-flow", "trust-boundary"],
    presets: [],
  },
  state: {
    title: "State Management Lab",
    description: "Where state belongs, how TanStack Query caches server state, and how Zustand selectors control re-renders.",
    viz: ["state-decision", "query-cache", "zustand-selectors", "react-state-queue"],
    presets: [{ id: "tanstack-query", label: "Real TanStack Query v5 against the mock API" }, { id: "zustand-store", label: "Real Zustand v5 store with render counters" }],
  },
};

export default function TopicLabPage() {
  const { topicLab } = useParams();
  const lab = LABS[topicLab ?? ""];
  if (!lab) return <EmptyState title="Lab not found" action={<Link to="/lab/visual" className="text-sm text-primary">Visual Lab</Link>} />;
  const viz = lab.viz.map(visualizerById).filter((v): v is NonNullable<typeof v> => !!v);
  return (
    <div>
      <PageHeader eyebrow="Laboratory" title={lab.title} description={lab.description} />
      {lab.presets.length > 0 && (
        <div className="mb-5 flex flex-wrap gap-2">
          {lab.presets.map((p) => (
            <Link key={p.id} to={`/lab/playground?preset=${p.id}`} className="inline-flex items-center gap-1.5 rounded-md border border-line bg-surface px-3 py-1.5 text-xs text-fg-2 hover:border-primary hover:text-primary"><Code2 size={13} /> {p.label}</Link>
          ))}
        </div>
      )}
      {viz.length === 0 && <EmptyState title="Labs are being built">The interactive labs for this area will appear here automatically.</EmptyState>}
      <div className="space-y-5">
        {viz.map((v) => (
          <Card key={v.id} className="overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-2.5">
              <div><h2 className="text-sm font-semibold">{v.title}</h2><p className="text-xs text-fg-2">{v.description}</p></div>
              <Badge tone={v.kind === "live" ? "success" : "violet"}>{v.kind === "live" ? "Live" : "Simulation"}</Badge>
            </div>
            <div className="p-4"><Suspense fallback={<p className="text-sm text-fg-2">Loading…</p>}><v.component /></Suspense></div>
          </Card>
        ))}
      </div>
    </div>
  );
}
