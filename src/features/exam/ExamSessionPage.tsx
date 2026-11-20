import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AlertTriangle, ArrowLeft, ArrowRight, CheckCircle2, Clock, Flag, Send } from "lucide-react";
import { useExamSessionStore } from "@/stores/examSessionStore";
import { useProgressStore } from "@/stores/progressStore";
import { resolvePaper, type ResolvedPaper } from "./resolve";
import { QuestionView } from "./QuestionView";
import { Badge, Button, Callout, Card, EmptyState } from "@/components/ui/primitives";
import { Markdown } from "@/components/ui/Markdown";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { isAnswered, scoreQuestion } from "@/features/assessment/scoring";
import { useNow } from "@/hooks/useNow";
import { formatDuration } from "@/lib/dates";
import { cn } from "@/lib/cn";

function numbering(paper: ResolvedPaper) {
  const counts: Record<string, number> = {};
  return paper.items.map((it) => {
    counts[it.section] = (counts[it.section] ?? 0) + 1;
    return `${it.section}${counts[it.section]}`;
  });
}

function StartScreen({ paper }: { paper: ResolvedPaper }) {
  const start = useExamSessionStore((s) => s.start);
  const existing = useExamSessionStore((s) => s.session);
  const end = useExamSessionStore((s) => s.end);
  const navigate = useNavigate();
  const other = existing && existing.paperId !== paper.id;
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link to="/assess/exams" className="mb-4 inline-flex items-center gap-1 text-xs text-fg-2 hover:text-primary"><ArrowLeft size={13} /> Exam Simulator</Link>
      <h1 className="text-2xl font-semibold">{paper.title}</h1>
      <p className="mt-1 text-sm text-fg-2">{paper.description}</p>
      <div className="mt-4 flex flex-wrap gap-2 text-xs">
        <Badge>{paper.items.length} questions</Badge>
        <Badge>{paper.totalMarks} marks</Badge>
        <Badge>{paper.durationMinutes} min{paper.rafExtraMinutes ? ` (+${paper.rafExtraMinutes} RAF)` : ""}</Badge>
      </div>
      <Card className="mt-5 p-4">
        <h2 className="mb-2 text-sm font-semibold">Instructions</h2>
        <ol className="list-decimal space-y-1 pl-5 text-sm text-fg-2">{paper.instructions.map((i) => <li key={i}>{i}</li>)}</ol>
        {paper.sections.some((s) => s.suggestedMinutes) && (
          <table className="mt-4 w-full text-sm">
            <thead><tr className="text-left text-xs text-fg-3"><th className="py-1">Section</th><th>Questions</th><th>Marks</th><th>Suggested time</th></tr></thead>
            <tbody>
              {paper.sections.map((s) => {
                const qs = paper.items.filter((i) => i.section === s.id);
                return (
                  <tr key={s.id} className="border-t border-line">
                    <td className="py-1.5">{s.id} — {s.title}</td>
                    <td>{qs.length}</td>
                    <td>{qs.reduce((a, b) => a + b.question.marks, 0)}</td>
                    <td>{s.suggestedMinutes ? `${s.suggestedMinutes} min` : "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </Card>
      <Callout tone="neutral" title="How marking works">
        Multiple-choice and true/false answers are marked exactly and automatically. Short-answer and programming answers are marked by <strong>guided self-assessment</strong>: after submitting you compare your answer with a model answer and award rubric marks yourself. Those marks are labelled as self-assessed in your results.
      </Callout>
      {other && (
        <div className="mt-4">
          <Callout tone="warning" title="Another exam is in progress" icon={<AlertTriangle size={14} />}>
            Starting this paper will discard your in-progress attempt.{" "}
            <button type="button" className="text-primary underline" onClick={() => navigate(`/assess/exam/${existing.paperId}`)}>Resume it instead</button>
          </Callout>
        </div>
      )}
      <div className="mt-6 flex flex-wrap gap-2">
        <Button variant="primary" onClick={() => { if (other) end(); start(paper.id, paper.durationMinutes); }}><Clock size={14} /> Start timed ({paper.durationMinutes} min)</Button>
        {paper.rafExtraMinutes > 0 && <Button onClick={() => { if (other) end(); start(paper.id, paper.durationMinutes + paper.rafExtraMinutes); }}>Start with RAF ({paper.durationMinutes + paper.rafExtraMinutes} min)</Button>}
        <Button onClick={() => { if (other) end(); start(paper.id, null); }}>Untimed revision mode</Button>
      </div>
    </div>
  );
}

function MarkingScreen({ paper }: { paper: ResolvedPaper }) {
  const session = useExamSessionStore((s) => s.session)!;
  const setSelfMark = useExamSessionStore((s) => s.setSelfMark);
  const end = useExamSessionStore((s) => s.end);
  const addAttempt = useProgressStore((s) => s.addAttempt);
  const navigate = useNavigate();
  const nums = numbering(paper);
  const rubricItems = paper.items.map((it, i) => ({ ...it, num: nums[i] })).filter((x) => x.question.type === "short" || x.question.type === "code");

  const finalise = () => {
    const results = paper.items.map((it) => scoreQuestion(it.question, session.answers[it.question.id], session.selfMarks[it.question.id], it.section));
    const id = `att-${Date.now()}`;
    const finishedAt = session.submittedAt ?? Date.now();
    addAttempt({
      id,
      kind: "exam",
      paperId: paper.id,
      title: paper.title,
      startedAt: session.startedAt,
      finishedAt,
      durationSec: Math.round((Math.min(finishedAt, session.deadline ?? finishedAt) - session.startedAt) / 1000),
      timedOut: session.timedOut,
      results,
      answers: { ...session.answers, __generated: session.generated ?? null },
    });
    end();
    navigate(`/assess/results/${id}`);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-semibold">Mark your written answers</h1>
      <p className="mt-1 text-sm text-fg-2">
        {session.timedOut ? "Time expired — your answers were submitted automatically. " : "Submitted. "}
        Objective questions are already marked. For each written / code answer, compare with the model answer and award marks per rubric criterion. Be honest — these marks drive your weak-topic analysis.
      </p>
      {rubricItems.length === 0 && <Callout tone="success" title="Nothing to self-mark">This paper has only objective questions.</Callout>}
      <div className="mt-6 space-y-6">
        {rubricItems.map(({ question: q, num }) => {
          if (q.type !== "short" && q.type !== "code") return null;
          const ans = session.answers[q.id];
          const awarded = q.rubric.reduce((s, _r, i) => s + (session.selfMarks[q.id]?.[i] ?? 0), 0);
          return (
            <Card key={q.id} className="p-4">
              <div className="flex items-center justify-between">
                <span className="font-mono font-semibold text-primary">{num}</span>
                <Badge tone="violet">Self-assessed · {awarded}/{q.marks}</Badge>
              </div>
              <details className="mt-2">
                <summary className="cursor-pointer text-xs text-fg-2">Show question</summary>
                <Markdown className="mt-2 text-sm">{q.prompt}</Markdown>
              </details>
              <div className="mt-3 grid gap-3 lg:grid-cols-2">
                <div>
                  <p className="mb-1 text-xs font-medium text-fg-2">Your answer</p>
                  {isAnswered(q, ans) ? <CodeBlock code={String(ans)} language={q.type === "code" ? q.language : "text"} runnable={false} /> : <p className="rounded border border-dashed border-line p-3 text-sm text-fg-3">Not answered — 0 marks.</p>}
                </div>
                <div>
                  <p className="mb-1 text-xs font-medium text-fg-2">Model answer</p>
                  <div className="max-h-96 overflow-y-auto rounded-md border border-line bg-surface p-3"><Markdown className="text-sm">{q.modelAnswer}</Markdown></div>
                </div>
              </div>
              <table className="mt-3 w-full text-sm">
                <thead><tr className="text-left text-xs text-fg-3"><th className="py-1">Rubric criterion</th><th className="w-28 text-right">Marks</th></tr></thead>
                <tbody>
                  {q.rubric.map((r, i) => (
                    <tr key={i} className="border-t border-line">
                      <td className="py-2 pr-3 text-fg-2">{r.criterion}</td>
                      <td className="text-right">
                        <label className="sr-only" htmlFor={`m-${q.id}-${i}`}>Marks for criterion {i + 1}</label>
                        <input
                          id={`m-${q.id}-${i}`}
                          type="number"
                          min={0}
                          max={r.marks}
                          step={0.5}
                          disabled={!isAnswered(q, ans)}
                          value={session.selfMarks[q.id]?.[i] ?? 0}
                          onChange={(e) => setSelfMark(q.id, i, Math.min(r.marks, Math.max(0, Number(e.target.value) || 0)))}
                          className="h-8 w-16 rounded border border-line bg-elevated px-2 text-right text-fg"
                        />{" "}
                        <span className="text-xs text-fg-3">/ {r.marks}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          );
        })}
      </div>
      <div className="mt-6 flex justify-end">
        <Button variant="primary" onClick={finalise}><CheckCircle2 size={15} /> Finalise and view results</Button>
      </div>
    </div>
  );
}

function ExamRunner({ paper }: { paper: ResolvedPaper }) {
  const session = useExamSessionStore((s) => s.session)!;
  const { answer, toggleFlag, goTo, submit, clearAnswer } = useExamSessionStore.getState();
  const now = useNow(1000);
  const nums = useMemo(() => numbering(paper), [paper]);
  const [confirming, setConfirming] = useState(false);
  const idx = Math.min(session.currentIndex, paper.items.length - 1);
  const current = paper.items[idx];
  const remaining = session.deadline ? session.deadline - now : null;

  useEffect(() => {
    if (remaining !== null && remaining <= 0 && !session.submittedAt) submit(true);
  }, [remaining, session.submittedAt, submit]);

  const answeredCount = paper.items.filter((it) => isAnswered(it.question, session.answers[it.question.id])).length;
  const flaggedCount = Object.values(session.flags).filter(Boolean).length;
  const section = paper.sections.find((s) => s.id === current.section);

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-surface px-4 py-2.5">
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold">{paper.title}</div>
          <div className="text-xs text-fg-3">{answeredCount}/{paper.items.length} answered · {flaggedCount} flagged · answers save automatically</div>
        </div>
        <div className="flex items-center gap-3">
          {remaining !== null ? (
            <div
              role="timer"
              aria-live="off"
              className={cn("rounded-md border px-3 py-1 font-mono text-lg tabular-nums", remaining < 5 * 60_000 ? "border-err/50 bg-err-soft text-err" : remaining < 15 * 60_000 ? "border-warn/50 bg-warn-soft text-warn" : "border-line bg-elevated text-fg")}
            >
              {formatDuration(Math.max(0, remaining) / 1000)}
            </div>
          ) : <Badge>Untimed</Badge>}
          <Button variant="primary" onClick={() => setConfirming(true)}><Send size={14} /> Submit</Button>
        </div>
      </div>

      {confirming && (
        <div className="border-b border-warn/40 bg-warn-soft px-4 py-3 text-sm">
          <strong>Submit your exam?</strong> {paper.items.length - answeredCount} unanswered{flaggedCount ? `, ${flaggedCount} flagged for review` : ""}. You cannot change answers afterwards.
          <span className="ml-3 inline-flex gap-2">
            <Button size="sm" variant="primary" onClick={() => submit(false)}>Yes, submit</Button>
            <Button size="sm" onClick={() => setConfirming(false)}>Keep working</Button>
          </span>
        </div>
      )}

      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        <nav aria-label="Question navigator" className="max-h-40 shrink-0 overflow-y-auto border-b border-line p-3 md:max-h-none md:w-60 md:border-b-0 md:border-r">
          {paper.sections.map((s) => (
            <div key={s.id} className="mb-3">
              <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-fg-3">Section {s.id} · {s.title}</div>
              <div className="flex flex-wrap gap-1">
                {paper.items.map((it, i) => it.section !== s.id ? null : (
                  <button
                    key={it.question.id}
                    type="button"
                    onClick={() => goTo(i)}
                    aria-current={i === idx ? "step" : undefined}
                    aria-label={`${nums[i]}${isAnswered(it.question, session.answers[it.question.id]) ? ", answered" : ", unanswered"}${session.flags[it.question.id] ? ", flagged" : ""}`}
                    className={cn(
                      "relative h-8 min-w-9 rounded border px-1 font-mono text-[11px]",
                      i === idx ? "border-primary ring-1 ring-primary" : "border-line",
                      isAnswered(it.question, session.answers[it.question.id]) ? "bg-primary-soft text-primary" : "bg-surface text-fg-2",
                    )}
                  >
                    {nums[i]}
                    {session.flags[it.question.id] && <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-warn" />}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <div className="mt-2 space-y-1 text-[11px] text-fg-3">
            <div><span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm bg-primary-soft ring-1 ring-primary/40" />Answered</div>
            <div><span className="mr-1 inline-block h-2.5 w-2.5 rounded-full bg-warn" />Flagged for review</div>
          </div>
        </nav>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="mx-auto max-w-3xl px-4 py-6">
            {section?.instructions && <p className="mb-4 text-xs text-fg-3">Section {section.id}: {section.instructions}</p>}
            <QuestionView
              key={current.question.id}
              question={current.question}
              number={nums[idx]}
              showMeta={false}
              value={session.answers[current.question.id]}
              onChange={(v) => answer(current.question.id, v)}
            />
            <div className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-4">
              <div className="flex gap-2">
                <Button size="sm" variant={session.flags[current.question.id] ? "secondary" : "ghost"} onClick={() => toggleFlag(current.question.id)}>
                  <Flag size={13} className={session.flags[current.question.id] ? "text-warn" : ""} /> {session.flags[current.question.id] ? "Flagged" : "Flag for review"}
                </Button>
                {isAnswered(current.question, session.answers[current.question.id]) && <Button size="sm" variant="ghost" onClick={() => clearAnswer(current.question.id)}>Clear answer</Button>}
              </div>
              <div className="flex gap-2">
                <Button size="sm" disabled={idx === 0} onClick={() => goTo(idx - 1)}><ArrowLeft size={13} /> Previous</Button>
                <Button size="sm" variant="primary" disabled={idx >= paper.items.length - 1} onClick={() => goTo(idx + 1)}>Next <ArrowRight size={13} /></Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ExamSessionPage() {
  const { paperId } = useParams();
  const session = useExamSessionStore((s) => s.session);
  const paper = useMemo(() => resolvePaper(paperId ?? "", session), [paperId, session?.sessionId]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!paper || paper.items.length === 0) {
    return <div className="p-8"><EmptyState title="Exam paper not found" action={<Link className="text-sm text-primary" to="/assess/exams">Choose an exam</Link>}>The paper may have been removed, or a generated paper's session ended.</EmptyState></div>;
  }
  if (!session || session.paperId !== paper.id) return <StartScreen paper={paper} />;
  if (session.submittedAt) return <MarkingScreen paper={paper} />;
  return <ExamRunner paper={paper} />;
}
