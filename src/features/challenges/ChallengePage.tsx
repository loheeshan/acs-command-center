import { lazy, Suspense, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, EyeOff, Lightbulb, Lock, Play, RotateCcw, XCircle } from "lucide-react";
import { challengeById, lessonById } from "@/content";
import { TOPIC_LABELS } from "@/content/types";
import { Badge, Button, Callout, Card, EmptyState, Tabs } from "@/components/ui/primitives";
import { Markdown } from "@/components/ui/Markdown";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { useProgressStore } from "@/stores/progressStore";
import { runTests, type RunReport } from "@/features/playground/testRunner";
import { cn } from "@/lib/cn";

const CodeEditor = lazy(() => import("@/features/playground/CodeEditor"));

export default function ChallengePage() {
  const { challengeId } = useParams();
  const c = challengeById(challengeId ?? "");
  const savedCode = useProgressStore((s) => (c ? s.challengeCode[c.id] : undefined));
  const record = useProgressStore((s) => (c ? s.challenges[c.id] : undefined));
  const { saveChallengeCode, recordChallenge, revealChallenge } = useProgressStore.getState();
  const [code, setCode] = useState(() => savedCode ?? c?.starterCode ?? "");
  const [report, setReport] = useState<RunReport | null>(null);
  const [running, setRunning] = useState(false);
  const [hints, setHints] = useState(0);
  const [tab, setTab] = useState<"tests" | "solution">("tests");

  if (!c) return <EmptyState title="Challenge not found" action={<Link to="/assess/challenges" className="text-sm text-primary">All challenges</Link>} />;

  const run = async () => {
    setRunning(true);
    saveChallengeCode(c.id, code);
    const r = await runTests(code, c.language, c.tests);
    setReport(r);
    setRunning(false);
    if (!r.compileError) recordChallenge(c.id, r.outcomes.filter((o) => o.passed).length, c.tests.length);
  };

  const attempted = !!record && record.attempts > 0;
  const canSeeSolution = attempted || record?.solutionRevealed;
  const passedCount = report?.outcomes.filter((o) => o.passed).length ?? 0;
  const lesson = c.lessonId ? lessonById(c.lessonId) : undefined;

  return (
    <div className="pb-10">
      <Link to="/assess/challenges" className="mb-4 inline-flex items-center gap-1 text-xs text-fg-2 hover:text-primary"><ArrowLeft size={13} /> Challenges</Link>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <h1 className="text-xl font-semibold">{c.title}</h1>
        <Badge tone="violet">{TOPIC_LABELS[c.topic]}</Badge>
        <Badge>{c.difficulty}</Badge>
        {record?.passed && <Badge tone="success"><CheckCircle2 size={11} /> Passed</Badge>}
      </div>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
        <div className="space-y-4">
          <Card className="p-4">
            <Markdown>{c.scenario}</Markdown>
            <h2 className="mb-1.5 mt-4 text-xs font-semibold uppercase tracking-wide text-fg-3">Requirements</h2>
            <ul className="list-disc space-y-1 pl-5 text-sm text-fg-2">{c.requirements.map((r) => <li key={r}><Markdown className="text-sm">{r}</Markdown></li>)}</ul>
            {c.examples && <><h2 className="mb-1.5 mt-4 text-xs font-semibold uppercase tracking-wide text-fg-3">Examples</h2><Markdown>{c.examples}</Markdown></>}
            {lesson && <Link to={`/lesson/${lesson.id}`} className="mt-3 inline-block text-xs text-primary hover:underline">Related lesson: {lesson.title}</Link>}
          </Card>
          <Card className="p-4">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-sm font-semibold">Hints</h2>
              <span className="text-xs text-fg-3">{hints}/{c.hints.length}</span>
            </div>
            {c.hints.slice(0, hints).map((h, i) => <Callout key={i} tone="neutral" title={`Hint ${i + 1}`}><Markdown className="text-sm">{h}</Markdown></Callout>)}
            {hints < c.hints.length && <Button size="sm" className="mt-2" onClick={() => setHints(hints + 1)}><Lightbulb size={13} /> Reveal next hint</Button>}
          </Card>
        </div>

        <div className="space-y-3">
          <Card className="overflow-hidden">
            <div className="flex items-center justify-between border-b border-line px-3 py-1.5">
              <span className="font-mono text-xs text-fg-2">solution.{c.language}</span>
              <div className="flex gap-1.5">
                <Button size="sm" variant="ghost" onClick={() => window.confirm("Reset to the starter code?") && setCode(c.starterCode)}><RotateCcw size={13} /> Reset</Button>
                <Button size="sm" variant="primary" onClick={run} disabled={running}><Play size={13} /> {running ? "Running…" : "Run tests"}</Button>
              </div>
            </div>
            <div className="h-96" onKeyDown={(e) => { if ((e.ctrlKey || e.metaKey) && e.key === "Enter") { e.preventDefault(); void run(); } }}>
              <Suspense fallback={<div className="p-3 text-sm text-fg-2">Loading editor…</div>}>
                <CodeEditor path={`challenges/${c.id}.${c.language}`} value={code} onChange={setCode} />
              </Suspense>
            </div>
          </Card>

          <Card>
            <Tabs className="px-2" value={tab} onChange={setTab} tabs={[{ id: "tests", label: "Test results" }, { id: "solution", label: <span className="inline-flex items-center gap-1">{!canSeeSolution && <Lock size={12} />} Reference solution</span> }]} />
            <div className="p-3">
              {tab === "tests" && (
                <>
                  {!report && <p className="text-sm text-fg-3">Run the tests to see results. {c.tests.filter((t) => !t.hidden).length} visible and {c.tests.filter((t) => t.hidden).length} hidden edge-case tests.</p>}
                  {report?.compileError && <Callout tone="error" title="Your code could not run">{report.compileError}</Callout>}
                  {report?.timedOut && <Callout tone="error" title="Stopped">Execution exceeded the time limit — check for infinite loops or unresolved promises.</Callout>}
                  {report && !report.compileError && (
                    <>
                      <p className={cn("mb-2 text-sm font-semibold", passedCount === c.tests.length ? "text-ok" : "text-warn")}>{passedCount}/{c.tests.length} tests passed</p>
                      <ul className="space-y-1">
                        {report.outcomes.map((o, i) => (
                          <li key={i} className={cn("rounded border px-2.5 py-1.5 text-sm", o.passed ? "border-ok/30 bg-ok-soft" : "border-err/30 bg-err-soft")}>
                            <div className="flex items-center gap-2">
                              {o.passed ? <CheckCircle2 size={14} className="text-ok" /> : <XCircle size={14} className="text-err" />}
                              <span className="flex-1">{o.hidden ? <span className="inline-flex items-center gap-1 text-fg-2"><EyeOff size={12} /> Hidden test {o.passed ? "" : `— ${o.name}`}</span> : o.name}</span>
                              <span className="font-mono text-[10px] text-fg-3">{o.durationMs.toFixed(0)}ms</span>
                            </div>
                            {!o.passed && o.message && <pre className="mt-1 whitespace-pre-wrap font-mono text-[11px] text-err">{o.message}</pre>}
                          </li>
                        ))}
                      </ul>
                      {report.logs.length > 0 && (
                        <details className="mt-3"><summary className="cursor-pointer text-xs text-fg-2">Console output ({report.logs.length})</summary>
                          <pre className="mt-1 max-h-40 overflow-auto rounded bg-code p-2 font-mono text-[11px]">{report.logs.join("\n")}</pre>
                        </details>
                      )}
                    </>
                  )}
                </>
              )}
              {tab === "solution" && (
                canSeeSolution ? (
                  <>
                    <CodeBlock code={c.solution} language={c.language} title="Reference solution" runnable={false} />
                    <Markdown className="mt-3 text-sm">{c.explanation}</Markdown>
                  </>
                ) : (
                  <div className="text-sm text-fg-2">
                    <p>The reference solution unlocks after you run the tests at least once — try first, it's how the learning sticks.</p>
                    <Button size="sm" className="mt-2" onClick={() => window.confirm("Reveal without attempting? This is recorded in your progress.") && revealChallenge(c.id)}>Reveal anyway</Button>
                  </div>
                )
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
