import { Link, useParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { ArrowLeft, BookOpen } from "lucide-react";
import { useProgressStore } from "@/stores/progressStore";
import { questionById } from "@/content";
import { TOPIC_LABELS, type TopicId } from "@/content/types";
import { bySection, byTopic, totals } from "@/features/assessment/scoring";
import { Badge, Callout, Card, EmptyState, PageHeader, Segmented, Stat } from "@/components/ui/primitives";
import { QuestionFeedback, QuestionView } from "@/features/exam/QuestionView";
import { Markdown } from "@/components/ui/Markdown";
import { Bars } from "./Bars";
import { recommendedLessons } from "./recommend";
import { formatDate, formatDuration } from "@/lib/dates";

export default function AttemptReviewPage() {
  const { attemptId } = useParams();
  const attempt = useProgressStore((s) => s.attempts.find((a) => a.id === attemptId));
  const [filter, setFilter] = useState<"all" | "incorrect" | "unanswered" | "self">("incorrect");
  const t = useMemo(() => (attempt ? totals(attempt.results) : null), [attempt]);
  if (!attempt || !t) return <EmptyState title="Attempt not found" action={<Link to="/assess/results" className="text-sm text-primary">All results</Link>} />;

  const sections = bySection(attempt.results);
  const topics = byTopic(attempt.results.filter((r) => r.correct !== null));
  const weak = topics.filter((x) => x.pct < 65).map((x) => x.key as TopicId);
  const recs = recommendedLessons([attempt], weak);
  const shown = attempt.results.filter((r) =>
    filter === "all" ? true : filter === "incorrect" ? r.correct === false : filter === "unanswered" ? r.correct === null : r.selfAssessed,
  );
  const sectionCount: Record<string, number> = {};
  const labels = new Map(attempt.results.map((r) => {
    const s = r.section ?? "Q";
    sectionCount[s] = (sectionCount[s] ?? 0) + 1;
    return [r.questionId, `${s}${sectionCount[s]}`];
  }));

  return (
    <div>
      <Link to="/assess/results" className="mb-4 inline-flex items-center gap-1 text-xs text-fg-2 hover:text-primary"><ArrowLeft size={13} /> Results</Link>
      <PageHeader eyebrow={attempt.kind === "exam" ? "Exam result" : "Quiz result"} title={attempt.title} description={`${formatDate(attempt.finishedAt, { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}${attempt.timedOut ? " · auto-submitted when time expired" : ""}`} />
      <Card className="grid grid-cols-2 gap-4 p-4 sm:grid-cols-3 lg:grid-cols-6">
        <Stat label="Total score" value={`${t.awarded}/${t.available}`} hint={`${t.pct}%`} />
        <Stat label="Correct" value={t.correct} />
        <Stat label="Incorrect" value={t.incorrect} />
        <Stat label="Unanswered" value={t.unanswered} />
        <Stat label="Time spent" value={formatDuration(attempt.durationSec)} />
        <Stat label="Self-assessed marks" value={t.selfAssessedMarks} hint="from rubrics" />
      </Card>
      {t.selfAssessedMarks > 0 && <p className="mt-2 text-xs text-fg-3">Objective marks are exact. {t.selfAssessedMarks} mark(s) came from your own rubric self-assessment.</p>}

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {sections.length > 0 && (
          <Card className="p-4">
            <h2 className="mb-3 text-sm font-semibold">Score by section</h2>
            <Bars label="Score by section" rows={sections.map((s) => ({ ...s, label: `Section ${s.key}` }))} />
          </Card>
        )}
        <Card className="p-4">
          <h2 className="mb-3 text-sm font-semibold">Accuracy by topic (answered questions)</h2>
          {topics.length ? <Bars label="Accuracy by topic" rows={topics.map((x) => ({ ...x, label: TOPIC_LABELS[x.key as TopicId] ?? x.key }))} /> : <p className="text-sm text-fg-3">No answered questions.</p>}
        </Card>
      </div>

      {recs.length > 0 && (
        <Card className="mt-4 p-4">
          <h2 className="mb-2 text-sm font-semibold">Recommended revision</h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {recs.map(({ lesson, misses }) => (
              <li key={lesson.id}>
                <Link to={`/lesson/${lesson.id}`} className="flex items-center gap-2 rounded-md border border-line px-3 py-2 text-sm hover:border-primary hover:text-primary">
                  <BookOpen size={14} /> <span className="flex-1">{lesson.title}</span>
                  {misses > 0 && <Badge tone="error">{misses} missed</Badge>}
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <div className="mb-3 mt-8 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-semibold">Review answers</h2>
        <Segmented label="Filter questions" value={filter} onChange={setFilter} options={[{ value: "incorrect", label: "Incorrect" }, { value: "unanswered", label: "Unanswered" }, { value: "self", label: "Self-marked" }, { value: "all", label: "All" }]} />
      </div>
      {shown.length === 0 && <Callout tone="success" title="Nothing here">No questions match this filter.</Callout>}
      <div className="space-y-4">
        {shown.map((r) => {
          const q = questionById(r.questionId);
          if (!q) return null;
          const ans = attempt.answers[q.id];
          return (
            <Card key={q.id} className="p-4">
              <div className="mb-2 flex justify-end"><Badge tone={r.marksAwarded === r.marksAvailable ? "success" : r.marksAwarded > 0 ? "warning" : "error"}>{r.marksAwarded}/{r.marksAvailable}{r.selfAssessed ? " · self-assessed" : ""}</Badge></div>
              <QuestionView question={q} number={labels.get(q.id)} value={ans} reveal />
              <QuestionFeedback question={q} value={ans} />
              {(q.type === "short" || q.type === "code") && (
                <div className="mt-4 space-y-3">
                  <details className="rounded-md border border-line p-3"><summary className="cursor-pointer text-sm font-medium">Model answer</summary><Markdown className="mt-2 text-sm">{q.modelAnswer}</Markdown></details>
                  <Markdown className="text-sm">{q.explanation}</Markdown>
                </div>
              )}
              {q.lessonId && <Link to={`/lesson/${q.lessonId}`} className="mt-3 inline-flex items-center gap-1 text-xs text-primary hover:underline"><BookOpen size={12} /> Revise the lesson</Link>}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
