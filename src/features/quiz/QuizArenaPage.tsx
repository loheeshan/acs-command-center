import { useMemo, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowRight, Play, Timer } from "lucide-react";
import { BANK, lessonById } from "@/content";
import { TOPIC_LABELS, type Difficulty, type Question, type QuestionType, type TopicId } from "@/content/types";
import { Badge, Button, Callout, Card, PageHeader, ProgressBar } from "@/components/ui/primitives";
import { QuestionFeedback, QuestionView } from "@/features/exam/QuestionView";
import { Markdown } from "@/components/ui/Markdown";
import { useProgressStore } from "@/stores/progressStore";
import { missedQuestionIds, scoreQuestion, shuffle, weakTopics, isAnswered } from "@/features/assessment/scoring";
import { useNow } from "@/hooks/useNow";
import { formatDuration } from "@/lib/dates";

interface Config {
  topics: TopicId[];
  difficulty: Difficulty | "any";
  types: QuestionType[];
  count: number;
  timed: boolean;
}

const ALL_TYPES: QuestionType[] = ["mcq", "tf", "short", "code"];
const TYPE_LABEL: Record<QuestionType, string> = { mcq: "Multiple choice", tf: "True/False", short: "Short answer", code: "Code" };

function QuizRunner({ questions, title, timed, onExit }: { questions: Question[]; title: string; timed: boolean; onExit: () => void }) {
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [self, setSelf] = useState<Record<string, Record<number, number>>>({});
  const startedAt = useRef(Date.now());
  const deadline = useRef(timed ? Date.now() + questions.reduce((s, q) => s + q.minutes, 0) * 60_000 : null);
  const now = useNow(1000);
  const addAttempt = useProgressStore((s) => s.addAttempt);
  const navigate = useNavigate();
  const q = questions[i];
  const remaining = deadline.current ? deadline.current - now : null;
  const isChecked = !!checked[q.id];

  const finish = () => {
    const results = questions.map((qq) => scoreQuestion(qq, answers[qq.id], self[qq.id]));
    const id = `att-${Date.now()}`;
    addAttempt({ id, kind: "quiz", title, startedAt: startedAt.current, finishedAt: Date.now(), durationSec: Math.round((Date.now() - startedAt.current) / 1000), results, answers });
    navigate(`/assess/results/${id}`);
  };

  if (remaining !== null && remaining <= 0) {
    return (
      <Card className="p-6 text-center">
        <p className="font-semibold">Time is up.</p>
        <Button className="mt-3" variant="primary" onClick={finish}>See results</Button>
      </Card>
    );
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold">{title}</h2>
          <p className="text-xs text-fg-3">Question {i + 1} of {questions.length}</p>
        </div>
        <div className="flex items-center gap-2">
          {remaining !== null && <Badge tone={remaining < 60_000 ? "error" : "neutral"}><Timer size={11} /> {formatDuration(remaining / 1000)}</Badge>}
          <Button size="sm" variant="ghost" onClick={() => window.confirm("Leave this quiz? Progress in it will be lost.") && onExit()}>Exit</Button>
        </div>
      </div>
      <ProgressBar value={i + (isChecked ? 1 : 0)} max={questions.length} label="Quiz progress" />
      <Card className="mt-4 p-5">
        <QuestionView key={q.id} question={q} value={answers[q.id]} reveal={isChecked} onChange={(v) => setAnswers((a) => ({ ...a, [q.id]: v }))} />
        {isChecked && <QuestionFeedback question={q} value={answers[q.id]} />}
        {isChecked && (q.type === "short" || q.type === "code") && (
          <div className="mt-4 space-y-3">
            <div className="rounded-md border border-line bg-surface p-3">
              <p className="mb-1 text-xs font-semibold text-fg-2">Model answer</p>
              <Markdown className="text-sm">{q.modelAnswer}</Markdown>
            </div>
            <Markdown className="text-sm">{q.explanation}</Markdown>
            <div className="rounded-md border border-violet/40 bg-violet-soft p-3">
              <p className="mb-2 text-xs font-semibold text-violet">Self-assess against the rubric (guided self-assessment, not automatic marking)</p>
              {q.rubric.map((r, ri) => (
                <label key={ri} className="flex items-center justify-between gap-3 border-t border-line/60 py-1.5 text-sm first:border-t-0">
                  <span className="text-fg-2">{r.criterion}</span>
                  <span className="shrink-0">
                    <input
                      type="number" min={0} max={r.marks} step={0.5}
                      disabled={!isAnswered(q, answers[q.id])}
                      value={self[q.id]?.[ri] ?? 0}
                      onChange={(e) => setSelf((s) => ({ ...s, [q.id]: { ...s[q.id], [ri]: Math.min(r.marks, Math.max(0, Number(e.target.value) || 0)) } }))}
                      className="h-7 w-14 rounded border border-line bg-elevated px-1.5 text-right text-fg"
                    /> <span className="text-xs text-fg-3">/ {r.marks}</span>
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}
        {isChecked && q.lessonId && lessonById(q.lessonId) && (
          <Link to={`/lesson/${q.lessonId}`} className="mt-3 inline-block text-xs text-primary hover:underline">Revise: {lessonById(q.lessonId)!.title}</Link>
        )}
        <div className="mt-5 flex justify-end gap-2 border-t border-line pt-4">
          {!isChecked ? (
            <Button variant="primary" onClick={() => setChecked((c) => ({ ...c, [q.id]: true }))}>{isAnswered(q, answers[q.id]) ? "Check answer" : "Skip & show answer"}</Button>
          ) : i < questions.length - 1 ? (
            <Button variant="primary" onClick={() => setI(i + 1)}>Next <ArrowRight size={14} /></Button>
          ) : (
            <Button variant="primary" onClick={finish}>Finish & see results</Button>
          )}
        </div>
      </Card>
    </div>
  );
}

export default function QuizArenaPage() {
  const [params] = useSearchParams();
  const lessonParam = params.get("lesson");
  const attempts = useProgressStore((s) => s.attempts);
  const weak = weakTopics(attempts);
  const [cfg, setCfg] = useState<Config>({ topics: [], difficulty: "any", types: ["mcq", "tf"], count: 10, timed: false });
  const [running, setRunning] = useState<{ questions: Question[]; title: string; timed: boolean } | null>(null);

  const pool = useMemo(
    () =>
      BANK.filter((q) =>
        (cfg.topics.length === 0 || cfg.topics.includes(q.topic)) &&
        (cfg.difficulty === "any" || q.difficulty === cfg.difficulty) &&
        cfg.types.includes(q.type),
      ),
    [cfg],
  );
  const topicCounts = useMemo(() => {
    const m: Partial<Record<TopicId, number>> = {};
    for (const q of BANK) m[q.topic] = (m[q.topic] ?? 0) + 1;
    return m;
  }, []);

  const begin = (questions: Question[], title: string, timed = cfg.timed) => questions.length && setRunning({ questions, title, timed });

  if (running) return <QuizRunner {...running} onExit={() => setRunning(null)} />;

  const lessonQs = lessonParam ? BANK.filter((q) => q.lessonId === lessonParam) : [];
  const missed = missedQuestionIds(attempts).map((id) => BANK.find((q) => q.id === id)).filter((q): q is Question => !!q);

  return (
    <div>
      <PageHeader eyebrow="Assessment" title="Quiz Arena" description={`${BANK.length} original practice questions with instant feedback and explanations of every wrong option.`} />

      {lessonParam && lessonQs.length > 0 && (
        <Callout tone="primary" title={`Quiz for: ${lessonById(lessonParam)?.title ?? lessonParam}`}>
          {lessonQs.length} questions linked to this lesson.{" "}
          <Button size="sm" variant="primary" className="ml-2" onClick={() => begin(shuffle(lessonQs), `Lesson quiz · ${lessonById(lessonParam)?.title ?? lessonParam}`, false)}><Play size={13} /> Start</Button>
        </Callout>
      )}

      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_18rem]">
        <Card className="p-4">
          <h2 className="mb-3 text-sm font-semibold">Build a quiz</h2>
          <fieldset>
            <legend className="mb-2 text-xs font-medium text-fg-2">Topics (none selected = mixed)</legend>
            <div className="flex flex-wrap gap-1.5">
              {(Object.keys(TOPIC_LABELS) as TopicId[]).filter((t) => topicCounts[t]).map((t) => {
                const on = cfg.topics.includes(t);
                return (
                  <button key={t} type="button" aria-pressed={on} onClick={() => setCfg((c) => ({ ...c, topics: on ? c.topics.filter((x) => x !== t) : [...c.topics, t] }))}
                    className={`rounded-md border px-2.5 py-1 text-xs ${on ? "border-primary bg-primary-soft text-primary" : "border-line text-fg-2 hover:bg-hover"}`}>
                    {TOPIC_LABELS[t]} <span className="text-fg-3">{topicCounts[t]}</span>
                  </button>
                );
              })}
            </div>
          </fieldset>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <label className="text-xs text-fg-2">Difficulty
              <select value={cfg.difficulty} onChange={(e) => setCfg((c) => ({ ...c, difficulty: e.target.value as Config["difficulty"] }))} className="mt-1 h-9 w-full rounded-md border border-line bg-elevated px-2 text-sm text-fg">
                <option value="any">Any</option><option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option><option value="exam">Exam</option>
              </select>
            </label>
            <label className="text-xs text-fg-2">Questions
              <select value={cfg.count} onChange={(e) => setCfg((c) => ({ ...c, count: Number(e.target.value) }))} className="mt-1 h-9 w-full rounded-md border border-line bg-elevated px-2 text-sm text-fg">
                {[5, 10, 15, 20, 30].map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </label>
            <label className="flex items-end gap-2 pb-2 text-sm text-fg-2"><input type="checkbox" checked={cfg.timed} onChange={(e) => setCfg((c) => ({ ...c, timed: e.target.checked }))} className="accent-[var(--primary)]" /> Timed</label>
          </div>
          <fieldset className="mt-4">
            <legend className="mb-2 text-xs font-medium text-fg-2">Question types</legend>
            <div className="flex flex-wrap gap-3">
              {ALL_TYPES.map((t) => (
                <label key={t} className="flex items-center gap-1.5 text-sm text-fg-2">
                  <input type="checkbox" className="accent-[var(--primary)]" checked={cfg.types.includes(t)} onChange={(e) => setCfg((c) => ({ ...c, types: e.target.checked ? [...c.types, t] : c.types.filter((x) => x !== t) }))} /> {TYPE_LABEL[t]}
                </label>
              ))}
            </div>
          </fieldset>
          <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
            <span className="text-xs text-fg-3">{pool.length} matching questions</span>
            <Button variant="primary" disabled={!pool.length} onClick={() => begin(shuffle(pool).slice(0, cfg.count), cfg.topics.length === 1 ? `${TOPIC_LABELS[cfg.topics[0]]} quiz` : "Mixed-topic quiz")}><Play size={14} /> Start quiz</Button>
          </div>
        </Card>
        <div className="space-y-3">
          <Card className="p-4">
            <h3 className="text-sm font-semibold">Weak-topic quiz</h3>
            <p className="mt-1 text-xs text-fg-2">{weak.length ? weak.map((w) => TOPIC_LABELS[w.key]).join(", ") : "No weak topics detected yet (needs at least 3 answered questions per topic)."}</p>
            <Button size="sm" className="mt-3" disabled={!weak.length} onClick={() => begin(shuffle(BANK.filter((q) => weak.some((w) => w.key === q.topic))).slice(0, 15), "Weak-topic quiz")}>Start</Button>
          </Card>
          <Card className="p-4">
            <h3 className="text-sm font-semibold">Retry my mistakes</h3>
            <p className="mt-1 text-xs text-fg-2">{missed.length} practice questions answered incorrectly before.</p>
            <Button size="sm" className="mt-3" disabled={!missed.length} onClick={() => begin(missed.slice(0, 20), "Mistake review")}>Start</Button>
          </Card>
          <Card className="p-4">
            <h3 className="text-sm font-semibold">Output prediction & find-the-bug</h3>
            <p className="mt-1 text-xs text-fg-2">Code-reading questions across JavaScript, React and HTTP.</p>
            <Button size="sm" className="mt-3" onClick={() => begin(shuffle(BANK.filter((q) => /```/.test(q.prompt) && (q.type === "mcq" || q.type === "tf"))).slice(0, 12), "Code reading quiz")}>Start</Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
