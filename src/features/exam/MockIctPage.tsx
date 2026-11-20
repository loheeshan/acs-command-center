import { Link } from "react-router-dom";
import { originalMock } from "@/content/exams/original-mock";
import { paperQuestions, lessonById } from "@/content";
import { Badge, Callout, Card, PageHeader } from "@/components/ui/primitives";
import { TOPIC_LABELS } from "@/content/types";
import { useProgressStore } from "@/stores/progressStore";
import { totals } from "@/features/assessment/scoring";
import { formatDate } from "@/lib/dates";

export default function MockIctPage() {
  const items = paperQuestions(originalMock);
  const attempts = useProgressStore((s) => s.attempts).filter((a) => a.paperId === originalMock.id);
  return (
    <div>
      <PageHeader
        eyebrow="Mock ICT · 19 Nov 2026 · real ICT 25 Nov, 15:30–17:30"
        title="Original university mock"
        description="Preserved exactly as supplied (questions, options and marks unchanged). The actual ICT on 25 Nov (15:30–17:30) will appear on Blackboard and is not guaranteed to match this paper."
        actions={<Link to={`/assess/exam/${originalMock.id}`} className="inline-flex h-9 items-center rounded-md bg-primary px-3.5 text-sm font-medium text-on-primary hover:bg-primary-strong">Take this paper</Link>}
      />
      <Callout tone="neutral" title="Answer key">
        The supplied paper has no official answer key. Answers, explanations and rubrics here were written for this platform — treat them as a study aid, not as the module's official marking scheme.
      </Callout>
      {attempts.length > 0 && (
        <Card className="mt-4 p-4">
          <h2 className="mb-2 text-sm font-semibold">Your attempts</h2>
          <ul className="space-y-1 text-sm">
            {attempts.map((a) => {
              const t = totals(a.results);
              return <li key={a.id}><Link className="text-primary hover:underline" to={`/assess/results/${a.id}`}>{formatDate(a.finishedAt, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</Link> — {t.awarded}/{t.available} ({t.pct}%)</li>;
            })}
          </ul>
        </Card>
      )}
      <h2 className="mb-3 mt-6 text-sm font-semibold">Concept map — every question linked to its lesson</h2>
      <div className="overflow-x-auto rounded-lg border border-line">
        <table className="w-full text-sm">
          <thead className="bg-elevated text-left text-xs text-fg-2">
            <tr><th className="px-3 py-2">Q</th><th className="px-3 py-2">Marks</th><th className="px-3 py-2">Topic</th><th className="px-3 py-2">Concept</th><th className="px-3 py-2">Revise</th><th className="px-3 py-2">Misconception tested</th></tr>
          </thead>
          <tbody>
            {items.map(({ section, question: q }, i) => {
              const n = items.slice(0, i + 1).filter((x) => x.section === section).length;
              const lesson = q.lessonId ? lessonById(q.lessonId) : undefined;
              return (
                <tr key={q.id} className="border-t border-line align-top">
                  <td className="px-3 py-2 font-mono text-xs font-semibold text-primary">{section}{n}</td>
                  <td className="px-3 py-2">{q.marks}</td>
                  <td className="px-3 py-2"><Badge tone="violet">{TOPIC_LABELS[q.topic]}</Badge></td>
                  <td className="px-3 py-2 text-fg-2">{q.subtopic}</td>
                  <td className="px-3 py-2">{lesson ? <Link className="text-primary hover:underline" to={`/lesson/${lesson.id}`}>{lesson.title}</Link> : <span className="text-fg-3">{q.lessonId ?? "—"}</span>}</td>
                  <td className="px-3 py-2 text-xs text-fg-3">{q.misconception ?? "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
