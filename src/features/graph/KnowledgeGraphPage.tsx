import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ReactFlow, Background, Controls, MiniMap, type Edge, type Node, MarkerType } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { LESSONS, lessonById, CHALLENGES } from "@/content";
import { MODULES } from "@/content/modules";
import { TOPIC_LABELS } from "@/content/types";
import { Badge, Card, PageHeader } from "@/components/ui/primitives";
import { useProgressStore } from "@/stores/progressStore";
import { useUiStore } from "@/stores/uiStore";
import { weakTopics } from "@/features/assessment/scoring";
import { visualizerById } from "@/features/visualizers/registry";

const COL_W = 250;
const ROW_H = 64;

export default function KnowledgeGraphPage() {
  const completed = useProgressStore((s) => s.completedLessons);
  const attempts = useProgressStore((s) => s.attempts);
  const theme = useUiStore((s) => s.theme);
  const [selected, setSelected] = useState<string | null>(null);
  const weak = useMemo(() => new Set(weakTopics(attempts).map((w) => w.key)), [attempts]);

  const { nodes, edges } = useMemo(() => {
    const nodes: Node[] = [];
    const placed = new Set<string>();
    let col = 0;
    for (const m of MODULES) {
      const ls = LESSONS.filter((l) => l.moduleId === m.id);
      if (!ls.length) continue;
      nodes.push({ id: `mod-${m.id}`, position: { x: col * COL_W, y: 0 }, data: { label: `${m.number} · ${m.title}` }, selectable: false, draggable: false,
        style: { background: "transparent", border: "none", color: "var(--text-secondary)", fontSize: 11, fontWeight: 600, width: 220, textTransform: "uppercase" } });
      ls.forEach((l, i) => {
        const done = !!completed[l.id];
        const isWeak = weak.has(m.topic);
        placed.add(l.id);
        nodes.push({
          id: l.id,
          position: { x: col * COL_W, y: 50 + i * ROW_H },
          data: { label: l.title },
          style: {
            width: 220, fontSize: 12, padding: 8, borderRadius: 8,
            background: done ? "var(--success-soft)" : "var(--surface)",
            color: "var(--text-primary)",
            border: `1.5px solid ${selected === l.id ? "var(--primary)" : isWeak ? "var(--error)" : l.examCritical ? "var(--warning)" : "var(--border-strong)"}`,
          },
        });
      });
      col++;
    }
    const edges: Edge[] = [];
    for (const l of LESSONS) for (const p of l.prerequisites) {
      if (!placed.has(p)) continue;
      const highlight = selected === l.id || selected === p;
      edges.push({ id: `${p}->${l.id}`, source: p, target: l.id, animated: highlight, markerEnd: { type: MarkerType.ArrowClosed },
        style: { stroke: highlight ? "var(--primary)" : "var(--border-strong)", strokeWidth: highlight ? 2 : 1, opacity: selected && !highlight ? 0.25 : 1 } });
    }
    return { nodes, edges };
  }, [completed, weak, selected]);

  const lesson = selected ? lessonById(selected) : undefined;
  const mod = lesson ? MODULES.find((m) => m.id === lesson.moduleId) : undefined;
  const dependents = lesson ? LESSONS.filter((l) => l.prerequisites.includes(lesson.id)) : [];

  return (
    <div>
      <PageHeader eyebrow="Command" title="Knowledge Graph" description="Every lesson and its prerequisites. Click a node to see what it depends on and what it unlocks. Green = completed · amber border = exam-critical · red border = weak topic (from your results)." />
      <div className="grid gap-4 lg:grid-cols-[1fr_20rem]">
        <Card className="h-[70vh] min-h-[480px] overflow-hidden">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            className={theme === "dark" ? "dark" : ""}
            fitView
            minZoom={0.2}
            nodesConnectable={false}
            onNodeClick={(_, n) => !n.id.startsWith("mod-") && setSelected(n.id)}
            onPaneClick={() => setSelected(null)}
            proOptions={{ hideAttribution: true }}
          >
            <Background />
            <Controls showInteractive={false} />
            <MiniMap pannable zoomable />
          </ReactFlow>
        </Card>
        <Card className="p-4">
          {!lesson ? <p className="text-sm text-fg-2">Select a lesson node to see its details.</p> : (
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-xs text-fg-3">{mod?.title}</p>
                <h2 className="font-semibold">{lesson.title}</h2>
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {completed[lesson.id] ? <Badge tone="success">Completed</Badge> : <Badge>Not completed</Badge>}
                  {lesson.examCritical && <Badge tone="warning">Exam-critical</Badge>}
                  {mod && weak.has(mod.topic) && <Badge tone="error">Weak topic: {TOPIC_LABELS[mod.topic]}</Badge>}
                </div>
              </div>
              <p className="text-fg-2">{lesson.summary}</p>
              <div>
                <h3 className="mb-1 text-xs font-semibold uppercase text-fg-3">Prerequisites</h3>
                {lesson.prerequisites.length ? lesson.prerequisites.map((p) => <button key={p} type="button" onClick={() => setSelected(p)} className="mr-1 mb-1 rounded border border-line px-2 py-0.5 text-xs hover:border-primary">{lessonById(p)?.title ?? p}</button>) : <p className="text-xs text-fg-3">None</p>}
              </div>
              <div>
                <h3 className="mb-1 text-xs font-semibold uppercase text-fg-3">Unlocks</h3>
                {dependents.length ? dependents.map((d) => <button key={d.id} type="button" onClick={() => setSelected(d.id)} className="mr-1 mb-1 rounded border border-line px-2 py-0.5 text-xs hover:border-primary">{d.title}</button>) : <p className="text-xs text-fg-3">—</p>}
              </div>
              <div>
                <h3 className="mb-1 text-xs font-semibold uppercase text-fg-3">Labs & practice</h3>
                <ul className="space-y-0.5 text-xs">
                  {(lesson.visualizers ?? []).map(visualizerById).filter(Boolean).map((v) => <li key={v!.id}><Link className="text-primary hover:underline" to={`/lab/visual/${v!.id}`}>{v!.title}</Link></li>)}
                  {CHALLENGES.filter((c) => c.lessonId === lesson.id).map((c) => <li key={c.id}><Link className="text-primary hover:underline" to={`/assess/challenges/${c.id}`}>Challenge: {c.title}</Link></li>)}
                </ul>
              </div>
              <Link to={`/lesson/${lesson.id}`} className="inline-flex h-8 items-center rounded-md bg-primary px-3 text-xs font-medium text-on-primary">Open lesson</Link>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
