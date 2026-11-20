import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { CheckCircle2, Circle, CircleDot } from "lucide-react";
import { CHALLENGES } from "@/content";
import { TOPIC_LABELS, type TopicId } from "@/content/types";
import { Badge, Card, PageHeader, Segmented } from "@/components/ui/primitives";
import { useProgressStore } from "@/stores/progressStore";

export default function ChallengesPage() {
  const records = useProgressStore((s) => s.challenges);
  const [topic, setTopic] = useState<TopicId | "all">("all");
  const topics = useMemo(() => [...new Set(CHALLENGES.map((c) => c.topic))], []);
  const list = CHALLENGES.filter((c) => topic === "all" || c.topic === topic);
  const passed = CHALLENGES.filter((c) => records[c.id]?.passed).length;
  return (
    <div>
      <PageHeader
        eyebrow="Assessment"
        title="Programming Challenges"
        description={`${CHALLENGES.length} auto-graded challenges. Your code runs in an isolated Web Worker against visible and hidden tests. ${passed} passed so far.`}
      />
      <div className="mb-4 overflow-x-auto">
        <Segmented label="Filter by topic" value={topic} onChange={setTopic} options={[{ value: "all" as const, label: "All" }, ...topics.map((t) => ({ value: t, label: TOPIC_LABELS[t] }))]} />
      </div>
      <div className="grid gap-2.5 md:grid-cols-2">
        {list.map((c) => {
          const r = records[c.id];
          return (
            <Link key={c.id} to={`/assess/challenges/${c.id}`}>
              <Card className="flex h-full items-start gap-3 p-3.5 transition-colors hover:border-line-strong hover:bg-hover">
                {r?.passed ? <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-ok" /> : r ? <CircleDot size={18} className="mt-0.5 shrink-0 text-warn" /> : <Circle size={18} className="mt-0.5 shrink-0 text-fg-3" />}
                <div className="min-w-0">
                  <h3 className="text-sm font-medium">{c.title}</h3>
                  <p className="mt-0.5 line-clamp-2 text-xs text-fg-2">{c.scenario}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <Badge tone="violet">{TOPIC_LABELS[c.topic]}</Badge>
                    <Badge>{c.difficulty}</Badge>
                    <Badge>{c.language.toUpperCase()}</Badge>
                    {r && <Badge tone={r.passed ? "success" : "warning"}>{r.bestPassed}/{r.total} tests · {r.attempts} run{r.attempts === 1 ? "" : "s"}</Badge>}
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
