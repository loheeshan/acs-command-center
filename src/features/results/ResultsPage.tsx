import { Link } from "react-router-dom";
import { BarChart3, Trash2 } from "lucide-react";
import { useProgressStore } from "@/stores/progressStore";
import { strongTopics, topicPerformance, totals, weakTopics } from "@/features/assessment/scoring";
import { TOPIC_LABELS, type TopicId } from "@/content/types";
import { Badge, Button, Card, EmptyState, PageHeader } from "@/components/ui/primitives";
import { Bars } from "./Bars";
import { recommendedLessons } from "./recommend";
import { formatDate, formatDuration } from "@/lib/dates";

export default function ResultsPage() {
  const attempts = useProgressStore((s) => s.attempts);
  const confidence = useProgressStore((s) => s.confidence);
  const del = useProgressStore((s) => s.deleteAttempt);
  if (attempts.length === 0) {
    return (
      <div>
        <PageHeader eyebrow="Assessment" title="Results & Analysis" />
        <EmptyState icon={<BarChart3 size={28} />} title="No attempts recorded yet" action={<Link to="/assess/mock" className="text-sm text-primary">Start with the original mock</Link>}>
          Your scores, topic accuracy and weak topics will be calculated from real quiz and exam attempts. Nothing is shown until you have evidence.
        </EmptyState>
      </div>
    );
  }
  const perf = topicPerformance(attempts);
  const weak = weakTopics(attempts);
  const strong = strongTopics(attempts);
  const recs = recommendedLessons(attempts, weak.map((w) => w.key));
  const sorted = [...attempts].sort((a, b) => b.finishedAt - a.finishedAt);

  return (
    <div>
      <PageHeader eyebrow="Assessment" title="Results & Analysis" description="Every number here is calculated from your recorded attempts. Self-assessed rubric marks are included and labelled on each attempt." />
      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Card className="p-4">
          <h2 className="mb-1 text-sm font-semibold">Demonstrated performance by topic</h2>
          <p className="mb-3 text-xs text-fg-3">Across all attempts · answered questions only</p>
          <Bars label="Topic performance" rows={perf.map((p) => ({ ...p, label: TOPIC_LABELS[p.key as TopicId] }))} />
        </Card>
        <div className="space-y-4">
          <Card className="p-4">
            <h2 className="mb-2 text-sm font-semibold">Weak topics <span className="font-normal text-fg-3">(&lt;65%, ≥3 questions)</span></h2>
            {weak.length ? <div className="flex flex-wrap gap-1.5">{weak.map((w) => <Badge key={w.key} tone="error">{TOPIC_LABELS[w.key]} · {w.pct}%</Badge>)}</div> : <p className="text-sm text-fg-3">None detected with enough evidence.</p>}
            <h2 className="mb-2 mt-4 text-sm font-semibold">Strong topics <span className="font-normal text-fg-3">(≥80%)</span></h2>
            {strong.length ? <div className="flex flex-wrap gap-1.5">{strong.map((w) => <Badge key={w.key} tone="success">{TOPIC_LABELS[w.key as TopicId]} · {w.pct}%</Badge>)}</div> : <p className="text-sm text-fg-3">Not enough evidence yet.</p>}
          </Card>
          <Card className="p-4">
            <h2 className="mb-1 text-sm font-semibold">Confidence vs performance</h2>
            <p className="mb-2 text-xs text-fg-3">Self-rated confidence (set in Progress) shown beside demonstrated accuracy.</p>
            <ul className="space-y-1 text-sm">
              {perf.map((p) => (
                <li key={p.key} className="flex justify-between gap-2">
                  <span className="text-fg-2">{TOPIC_LABELS[p.key as TopicId]}</span>
                  <span className="font-mono text-xs">{confidence[p.key as TopicId] ? `${confidence[p.key as TopicId]}/5 conf` : "—"} · {p.pct}%</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>

      {recs.length > 0 && (
        <Card className="mt-4 p-4">
          <h2 className="mb-2 text-sm font-semibold">Revision plan from your mistakes</h2>
          <ol className="list-decimal space-y-1 pl-5 text-sm">
            {recs.map(({ lesson, misses }) => (
              <li key={lesson.id}><Link to={`/lesson/${lesson.id}`} className="text-primary hover:underline">{lesson.title}</Link>{misses > 0 && <span className="text-fg-3"> — {misses} missed question(s)</span>}</li>
            ))}
          </ol>
          <p className="mt-2 text-xs text-fg-3">Then retry with Exam Simulator → Weak-topic practice / Retry my mistakes.</p>
        </Card>
      )}

      <h2 className="mb-3 mt-8 text-sm font-semibold">Attempt history</h2>
      <div className="overflow-x-auto rounded-lg border border-line">
        <table className="w-full text-sm">
          <thead className="bg-elevated text-left text-xs text-fg-2"><tr><th className="px-3 py-2">Date</th><th className="px-3 py-2">Attempt</th><th className="px-3 py-2">Score</th><th className="px-3 py-2">Time</th><th className="px-3 py-2" /></tr></thead>
          <tbody>
            {sorted.map((a) => {
              const t = totals(a.results);
              return (
                <tr key={a.id} className="border-t border-line">
                  <td className="px-3 py-2 text-fg-2">{formatDate(a.finishedAt, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</td>
                  <td className="px-3 py-2"><Link className="text-primary hover:underline" to={`/assess/results/${a.id}`}>{a.title}</Link> <Badge>{a.kind}</Badge></td>
                  <td className="px-3 py-2 font-mono">{t.awarded}/{t.available} <span className="text-fg-3">({t.pct}%)</span></td>
                  <td className="px-3 py-2 font-mono text-fg-2">{formatDuration(a.durationSec)}</td>
                  <td className="px-3 py-2 text-right"><Button size="sm" variant="ghost" aria-label="Delete attempt" onClick={() => window.confirm("Delete this attempt from your history?") && del(a.id)}><Trash2 size={13} /></Button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
