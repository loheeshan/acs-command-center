import { Suspense, useEffect, useMemo, useState, type ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import {
  AlertTriangle, ArrowLeft, ArrowRight, Bug, CheckCircle2, ChevronRight, Code2, ExternalLink, Eye, FlaskConical,
  Lightbulb, ListChecks, Puzzle, Repeat, Target, BookOpen, Wrench,
} from "lucide-react";
import { LESSONS, lessonById, BANK, CHALLENGES } from "@/content";
import { moduleById } from "@/content/modules";
import type { CodeSample, Lesson, SourceKind } from "@/content/types";
import { Badge, Button, Callout, Card, EmptyState, Segmented } from "@/components/ui/primitives";
import { Markdown } from "@/components/ui/Markdown";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { useUiStore } from "@/stores/uiStore";
import { useProgressStore } from "@/stores/progressStore";
import { visualizerById } from "@/features/visualizers/registry";
import { openInPlayground } from "@/features/playground/handoff";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/cn";

const SOURCE_TONE: Record<SourceKind, "primary" | "warning" | "violet" | "success" | "neutral"> = {
  university: "primary",
  mock: "warning",
  supplementary: "violet",
  "best-practice": "success",
  optional: "neutral",
};
const SOURCE_LABEL: Record<SourceKind, string> = {
  university: "University material",
  mock: "Mock ICT",
  supplementary: "Supplementary",
  "best-practice": "Professional practice",
  optional: "Optional / advanced",
};

const SECTIONS = [
  { id: "why", label: "Why", icon: Target },
  { id: "understand", label: "Understand", icon: BookOpen },
  { id: "visualize", label: "Visualize", icon: Eye },
  { id: "trace", label: "Trace", icon: ListChecks },
  { id: "code", label: "Code", icon: Code2 },
  { id: "mistakes", label: "Mistakes", icon: AlertTriangle },
  { id: "debug", label: "Debug", icon: Bug },
  { id: "quiz", label: "Quiz", icon: Lightbulb },
  { id: "apply", label: "Apply", icon: Puzzle },
  { id: "revise", label: "Revise", icon: Repeat },
] as const;

function Section({ id, title, icon, children, step }: { id: string; title: string; icon: ReactNode; children: ReactNode; step: number }) {
  return (
    <section id={id} className="scroll-mt-20">
      <div className="mb-3 flex items-center gap-2">
        <span className="grid h-6 w-6 place-items-center rounded bg-primary-soft text-primary">{icon}</span>
        <span className="font-mono text-[11px] text-fg-3">{String(step).padStart(2, "0")}</span>
        <h2 className="text-base font-semibold">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function parseLines(spec: string): number[] {
  const [a, b] = spec.split("-").map((n) => parseInt(n.trim(), 10));
  if (Number.isNaN(a)) return [];
  const end = Number.isNaN(b) || b === undefined ? a : b;
  return Array.from({ length: Math.max(0, end - a + 1) }, (_, i) => a + i);
}

/** Code with a clickable line-by-line walkthrough that highlights the explained lines. */
function TracedExample({ sample }: { sample: CodeSample }) {
  const [step, setStep] = useState(0);
  const walkthrough = sample.walkthrough ?? [];
  const highlight = useMemo(() => new Set(walkthrough[step] ? parseLines(walkthrough[step].lines) : []), [walkthrough, step]);
  return (
    <div className="grid gap-3 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
      <CodeBlock code={sample.code} language={sample.language} title={sample.title} highlightLines={walkthrough.length ? highlight : undefined} />
      {walkthrough.length > 0 && (
        <div className="flex flex-col">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium text-fg-2">Line-by-line ({step + 1}/{walkthrough.length})</span>
            <div className="flex gap-1">
              <Button size="sm" variant="ghost" disabled={step === 0} onClick={() => setStep((s) => s - 1)} aria-label="Previous step"><ArrowLeft size={13} /></Button>
              <Button size="sm" variant="ghost" disabled={step >= walkthrough.length - 1} onClick={() => setStep((s) => s + 1)} aria-label="Next step"><ArrowRight size={13} /></Button>
            </div>
          </div>
          <ol className="space-y-1.5 overflow-y-auto lg:max-h-96">
            {walkthrough.map((w, i) => (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => setStep(i)}
                  className={cn("w-full rounded-md border px-3 py-2 text-left text-[13px] transition-colors", i === step ? "border-primary/50 bg-primary-soft text-fg" : "border-line bg-surface text-fg-2 hover:bg-hover")}
                >
                  <span className="mr-2 font-mono text-[11px] text-primary">L{w.lines}</span>
                  {w.text}
                </button>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

function Reveal({ label, children, onReveal }: { label: string; children: ReactNode; onReveal?: () => void }) {
  const [open, setOpen] = useState(false);
  return open ? (
    <div className="mt-2">{children}</div>
  ) : (
    <Button size="sm" className="mt-2" onClick={() => { setOpen(true); onReveal?.(); }}>{label}</Button>
  );
}

function ChallengeBlock({ lesson }: { lesson: Lesson }) {
  const [hints, setHints] = useState(0);
  const c = lesson.challenge;
  return (
    <Card className="p-4">
      <Markdown>{c.prompt}</Markdown>
      {c.starterCode && <CodeBlock className="mt-3" code={c.starterCode} language={c.language} title="Starter code" />}
      <div className="mt-3 space-y-2">
        {c.hints.slice(0, hints).map((h, i) => (
          <Callout key={i} tone="neutral" title={`Hint ${i + 1}`}><Markdown>{h}</Markdown></Callout>
        ))}
        <div className="flex flex-wrap gap-2">
          {hints < c.hints.length && <Button size="sm" onClick={() => setHints((h) => h + 1)}><Lightbulb size={13} /> Reveal hint {hints + 1}/{c.hints.length}</Button>}
        </div>
      </div>
      <p className="mt-3 text-xs text-fg-3">Attempt it yourself (e.g. in the playground) before opening the reference solution.</p>
      <Reveal label="I've attempted it — show the reference solution">
        <CodeBlock code={c.solution} language={c.language} title="Reference solution" />
        <Markdown className="mt-3">{c.explanation}</Markdown>
      </Reveal>
    </Card>
  );
}

export default function LessonPage() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const lesson = lessonById(lessonId ?? "");
  const level = useUiStore((s) => s.explanationLevel);
  const setLevel = useUiStore((s) => s.setExplanationLevel);
  const done = useProgressStore((s) => (lesson ? !!s.completedLessons[lesson.id] : false));
  const markComplete = useProgressStore((s) => s.markLessonComplete);
  const visit = useProgressStore((s) => s.visitLesson);
  const completedMap = useProgressStore((s) => s.completedLessons);

  useEffect(() => {
    if (lesson) visit(lesson.id);
  }, [lesson, visit]);

  if (!lesson) {
    return (
      <EmptyState title="Lesson not found" action={<Link to="/learn" className="text-sm text-primary">Back to Master Core</Link>}>
        This lesson id doesn't exist or its content is still being prepared.
      </EmptyState>
    );
  }

  const mod = moduleById(lesson.moduleId);
  const idx = LESSONS.findIndex((l) => l.id === lesson.id);
  const prev = LESSONS[idx - 1];
  const next = LESSONS[idx + 1];
  const visualizers = (lesson.visualizers ?? []).map((id) => visualizerById(id)).filter((v): v is NonNullable<typeof v> => !!v);
  const practiceCount = BANK.filter((q) => q.lessonId === lesson.id).length;
  const challenges = CHALLENGES.filter((c) => c.lessonId === lesson.id);
  const tryCode = (s: CodeSample) => {
    openInPlayground({ code: s.code, language: s.language, title: s.title ?? lesson.title });
    navigate("/lab/playground");
  };

  return (
    <article className="pb-16">
      <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-1 text-xs text-fg-2">
        <Link to="/learn" className="hover:text-primary">Master Core</Link>
        <ChevronRight size={12} />
        {mod && <Link to={`/learn/${mod.id}`} className="hover:text-primary">{mod.number} · {mod.title}</Link>}
      </nav>

      <header className="mb-6">
        <div className="mb-2 flex flex-wrap gap-1.5">
          {lesson.examCritical && <Badge tone="warning">Exam-critical</Badge>}
          <Badge>{lesson.priority}</Badge>
          <Badge>{lesson.minutes} min</Badge>
          {done && <Badge tone="success"><CheckCircle2 size={11} /> Completed</Badge>}
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">{lesson.title}</h1>
        <p className="mt-1.5 max-w-3xl text-sm text-fg-2">{lesson.summary}</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <Card className="p-3.5">
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-fg-3">Learning objectives</h2>
            <ul className="space-y-1 text-sm text-fg-2">
              {lesson.objectives.map((o) => <li key={o} className="flex gap-2"><CheckCircle2 size={14} className="mt-0.5 shrink-0 text-primary" />{o}</li>)}
            </ul>
          </Card>
          <Card className="p-3.5">
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-fg-3">Prerequisites</h2>
            {lesson.prerequisites.length === 0 ? <p className="text-sm text-fg-2">None — a good starting point.</p> : (
              <ul className="flex flex-wrap gap-1.5">
                {lesson.prerequisites.map((id) => {
                  const p = lessonById(id);
                  return (
                    <li key={id}>
                      {p ? (
                        <Link to={`/lesson/${id}`} className="inline-flex items-center gap-1 rounded border border-line bg-elevated px-2 py-1 text-xs text-fg-2 hover:border-primary hover:text-primary">
                          {completedMap[id] ? <CheckCircle2 size={11} className="text-ok" /> : null}{p.title}
                        </Link>
                      ) : <span className="rounded border border-dashed border-line px-2 py-1 text-xs text-fg-3">{id}</span>}
                    </li>
                  );
                })}
              </ul>
            )}
            <h2 className="mb-1.5 mt-3 text-xs font-semibold uppercase tracking-wide text-fg-3">Sources</h2>
            <ul className="space-y-1">
              {lesson.sources.map((s, i) => (
                <li key={i} className="flex flex-wrap items-center gap-1.5 text-xs text-fg-2">
                  <Badge tone={SOURCE_TONE[s.kind]}>{SOURCE_LABEL[s.kind]}</Badge>
                  <span>{s.label}{s.detail && <span className="text-fg-3"> — {s.detail}</span>}</span>
                  {s.url && <a href={s.url} target="_blank" rel="noreferrer noopener" className="text-primary" aria-label={`Open ${s.label}`}><ExternalLink size={11} /></a>}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </header>

      <div className="sticky top-0 z-10 -mx-1 mb-6 flex gap-1 overflow-x-auto border-y border-line bg-bg/95 px-1 py-1.5 backdrop-blur">
        {SECTIONS.map((s) => (
          <a key={s.id} href={`#${s.id}`} className="inline-flex shrink-0 items-center gap-1 rounded px-2 py-1 text-xs text-fg-2 hover:bg-hover hover:text-fg">
            <s.icon size={12} /> {s.label}
          </a>
        ))}
      </div>

      <div className="space-y-10">
        <Section id="why" step={1} title="Why does this exist?" icon={<Target size={14} />}>
          <Markdown>{lesson.why}</Markdown>
          <Callout tone="violet" title="Analogy" icon={<Lightbulb size={14} />}><Markdown>{lesson.analogy}</Markdown></Callout>
        </Section>

        <Section id="understand" step={2} title="Understand" icon={<BookOpen size={14} />}>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Segmented
              label="Explanation level"
              value={level}
              onChange={setLevel}
              options={[{ value: "beginner", label: "Level 1 · Beginner" }, { value: "developer", label: "Level 2 · Developer" }, { value: "deep", label: "Level 3 · Deep dive" }]}
            />
          </div>
          <Card className="p-5"><Markdown>{lesson.explain[level]}</Markdown></Card>
        </Section>

        <Section id="visualize" step={3} title="Visualize the mechanism" icon={<Eye size={14} />}>
          <Markdown>{lesson.mechanism}</Markdown>
          {visualizers.map((V) => (
            <Card key={V.id} className="mt-4 overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-2.5">
                <div>
                  <h3 className="text-sm font-semibold">{V.title}</h3>
                  <p className="text-xs text-fg-2">{V.description}</p>
                </div>
                <Badge tone={V.kind === "live" ? "success" : "violet"}>{V.kind === "live" ? "Live — real code/CSS" : "Educational simulation"}</Badge>
              </div>
              <div className="p-4">
                <Suspense fallback={<p className="text-sm text-fg-2">Loading visualizer…</p>}><V.component /></Suspense>
              </div>
            </Card>
          ))}
        </Section>

        <Section id="trace" step={4} title="Trace a simple example" icon={<ListChecks size={14} />}>
          <TracedExample sample={lesson.simpleExample} />
        </Section>

        <Section id="code" step={5} title="Realistic application example" icon={<Code2 size={14} />}>
          <TracedExample sample={lesson.realExample} />
          <div className="mt-3 flex flex-wrap gap-2">
            <Button size="sm" variant="primary" onClick={() => tryCode(lesson.realExample)}><FlaskConical size={13} /> Experiment in the playground</Button>
            <Button size="sm" onClick={() => tryCode(lesson.simpleExample)}>Open the simple example</Button>
          </div>
        </Section>

        <Section id="mistakes" step={6} title="Common mistakes" icon={<AlertTriangle size={14} />}>
          <div className="grid gap-2.5 md:grid-cols-2">
            {lesson.mistakes.map((m, i) => (
              <Card key={i} className="p-3.5">
                <div className="flex gap-2 text-sm"><span className="text-err">✗</span><Markdown className="text-sm">{m.mistake}</Markdown></div>
                <div className="mt-2 flex gap-2 border-t border-line pt-2 text-sm"><span className="text-ok">✓</span><Markdown className="text-sm">{m.fix}</Markdown></div>
              </Card>
            ))}
          </div>
        </Section>

        <Section id="debug" step={7} title="Debugging exercise" icon={<Bug size={14} />}>
          <Card className="p-4">
            <Markdown>{lesson.debug.prompt}</Markdown>
            <CodeBlock className="mt-3" code={lesson.debug.buggyCode} language={lesson.debug.language} title="Buggy code" />
            <Reveal label="Show hint"><Callout tone="neutral" title="Hint"><Markdown>{lesson.debug.hint}</Markdown></Callout></Reveal>
            <Reveal label="Show the fix">
              <CodeBlock code={lesson.debug.fixedCode} language={lesson.debug.language} title="Fixed code" />
              <Markdown className="mt-3">{lesson.debug.explanation}</Markdown>
            </Reveal>
          </Card>
        </Section>

        <Section id="quiz" step={8} title="Exam-style questions" icon={<Lightbulb size={14} />}>
          <div className="space-y-2.5">
            {lesson.examQuestions.map((q, i) => (
              <Card key={i} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <Markdown className="flex-1">{q.question}</Markdown>
                  {q.marks && <Badge>{q.marks} mark{q.marks > 1 ? "s" : ""}</Badge>}
                </div>
                <p className="mt-2 text-xs text-fg-3">Answer it in your head or on paper first.</p>
                <Reveal label="Reveal model answer"><Callout tone="success" title="Model answer"><Markdown>{q.answer}</Markdown></Callout></Reveal>
              </Card>
            ))}
          </div>
          {practiceCount > 0 && (
            <Link to={`/assess/quiz?lesson=${lesson.id}`} className="mt-3 inline-flex items-center gap-1.5 text-sm text-primary hover:underline">
              Take a scored quiz on this lesson ({practiceCount} questions) <ArrowRight size={14} />
            </Link>
          )}
        </Section>

        <Section id="apply" step={9} title="Practical challenge" icon={<Puzzle size={14} />}>
          <ChallengeBlock lesson={lesson} />
          {challenges.length > 0 && (
            <div className="mt-3">
              <p className="mb-2 text-xs font-medium text-fg-2">Auto-graded challenges for this topic</p>
              <div className="flex flex-wrap gap-2">
                {challenges.map((c) => (
                  <Link key={c.id} to={`/assess/challenges/${c.id}`} className="inline-flex items-center gap-1.5 rounded-md border border-line bg-surface px-3 py-1.5 text-xs text-fg-2 hover:border-primary hover:text-primary">
                    <Wrench size={12} /> {c.title}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </Section>

        <Section id="revise" step={10} title="Revision summary" icon={<Repeat size={14} />}>
          <Card className="p-4">
            <ul className="space-y-1.5">
              {lesson.revision.map((r, i) => (
                <li key={i} className="flex gap-2 text-sm"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" /><Markdown className="text-sm">{r}</Markdown></li>
              ))}
            </ul>
          </Card>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
            <Button variant={done ? "success" : "primary"} onClick={() => markComplete(lesson.id, !done)}>
              <CheckCircle2 size={15} /> {done ? "Completed — mark as not done" : "Mark lesson complete"}
            </Button>
            <div className="flex gap-2">
              {prev && <Link to={`/lesson/${prev.id}`} className="inline-flex items-center gap-1 rounded-md border border-line px-3 py-1.5 text-xs text-fg-2 hover:text-primary"><ArrowLeft size={13} /> {prev.title}</Link>}
              {next && <Link to={`/lesson/${next.id}`} className="inline-flex items-center gap-1 rounded-md border border-line px-3 py-1.5 text-xs text-fg-2 hover:text-primary">{next.title} <ArrowRight size={13} /></Link>}
            </div>
          </div>
        </Section>
      </div>
    </article>
  );
}
