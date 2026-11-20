import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, CalendarClock, Code2, Eye, FileCheck2, Library, ListChecks, Sparkles } from "lucide-react";
import { LESSONS, lessonById, FLASHCARDS, CHALLENGES } from "@/content";
import { MODULES } from "@/content/modules";
import { TOPIC_LABELS, type TopicId } from "@/content/types";
import { Badge, Card, CardHeader, EmptyState, ProgressBar, Stat } from "@/components/ui/primitives";
import { useProgressStore } from "@/stores/progressStore";
import { useExamSessionStore } from "@/stores/examSessionStore";
import { totals, weakTopics } from "@/features/assessment/scoring";
import { STUDY_PLAN, scheduleDay } from "@/features/roadmap/plan";
import { TaskRow } from "@/features/roadmap/RoadmapPage";
import { DATES, formatCountdown, formatDate, todayColombo } from "@/lib/dates";
import { ExamClockHero } from "@/components/layout/ExamClock";
import { useNow } from "@/hooks/useNow";
import { VISUALIZERS } from "@/features/visualizers/registry";

export default function DashboardPage() {
  const now = useNow(60_000);
  const p = useProgressStore();
  const examSession = useExamSessionStore((s) => s.session);
  const today = todayColombo();
  const cwTarget = new Date(DATES.courseworkDeadline).getTime();

  const examCritical = LESSONS.filter((l) => l.examCritical);
  const doneCritical = examCritical.filter((l) => p.completedLessons[l.id]).length;
  const last = p.lastLessonId ? lessonById(p.lastLessonId) : undefined;
  const nextLesson = examCritical.find((l) => !p.completedLessons[l.id]) ?? LESSONS.find((l) => !p.completedLessons[l.id]);
  const day = STUDY_PLAN.find((d) => d.date === today);
  const sched = day ? scheduleDay(day, p.studyAvailability[day.date] ?? day.defaultHours) : null;
  const weak = weakTopics(p.attempts);
  const recentExams = [...p.attempts].sort((a, b) => b.finishedAt - a.finishedAt).slice(0, 4);
  const dueCards = FLASHCARDS.filter((c) => (p.flashcards[c.id]?.due ?? 0) <= now).length;
  const recentChallenges = Object.entries(p.challenges).sort((a, b) => b[1].lastRunAt - a[1].lastRunAt).slice(0, 3);
  const isNew = p.attempts.length === 0 && Object.keys(p.completedLessons).length === 0;

  const recommendation = examSession
    ? { title: "Resume your in-progress exam", to: `/assess/exam/${examSession.paperId}`, why: "You have an unfinished timed attempt." }
    : isNew
      ? { title: "Take a 15-minute diagnostic quiz", to: "/assess/quiz", why: "A quick baseline shows where to focus before the ICT." }
      : weak.length
        ? { title: `Repair weak topic: ${TOPIC_LABELS[weak[0].key]}`, to: "/assess/results", why: `Your recorded accuracy is ${weak[0].pct}%.` }
        : nextLesson
          ? { title: `Continue: ${nextLesson.title}`, to: `/lesson/${nextLesson.id}`, why: nextLesson.examCritical ? "Next unfinished exam-critical lesson." : "Next unfinished lesson." }
          : { title: "Take a full timed mock", to: "/assess/exams", why: "All lessons are complete — test under exam conditions." };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-primary">{formatDate(Date.now(), { weekday: "long", day: "numeric", month: "long" })}</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">ACS Command Center</h1>
          <p className="mt-1 text-sm text-fg-2">Understand. Visualize. Experiment. Master.</p>
        </div>
      </div>

      <ExamClockHero />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4"><Stat label="ICT Fast Track" value={<Link to="/fast-track" className="text-primary hover:underline">Open timeline →</Link>} hint="Essentials only, by marks" /></Card>
        <Card className="p-4"><Stat label="Coursework (60%)" value={now < cwTarget ? formatCountdown(cwTarget - now) : "Deadline passed"} hint="7 Jan 2027, 1:00 PM" /></Card>
        <Card className="p-4">
          <Stat label="Exam-critical lessons" value={`${doneCritical}/${examCritical.length}`} />
          <div className="mt-2"><ProgressBar value={doneCritical} max={Math.max(1, examCritical.length)} tone="success" label="Exam-critical progress" /></div>
        </Card>
        <Card className="p-4"><Stat label="Flashcards due" value={dueCards} hint={<Link to="/flashcards" className="text-primary">Review →</Link>} /></Card>
      </div>

      <Card className="border-primary/40 bg-primary-soft p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <Sparkles size={18} className="mt-0.5 text-primary" />
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-primary">Recommended next</p>
              <p className="font-semibold">{recommendation.title}</p>
              <p className="text-xs text-fg-2">{recommendation.why}</p>
            </div>
          </div>
          <Link to={recommendation.to} className="inline-flex h-9 items-center gap-1 rounded-md bg-primary px-3.5 text-sm font-medium text-on-primary hover:bg-primary-strong">Go <ArrowRight size={14} /></Link>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        <Card>
          <CardHeader icon={<CalendarClock size={15} />} title={day ? `Today: ${day.theme}` : "Today's study plan"} subtitle={day && sched ? `${Math.round(sched.usedMinutes / 6) / 10}h planned of ${p.studyAvailability[day.date] ?? day.defaultHours}h available` : undefined} action={<Link to="/roadmap" className="text-xs text-primary">Roadmap</Link>} />
          <div className="p-2">
            {day && sched ? <ul>{sched.planned.map((t) => <TaskRow key={t.id} {...t} />)}</ul> : (
              <p className="p-3 text-sm text-fg-2">{today > "2026-11-25" ? "The ICT plan has finished — switch focus to the Coursework Workspace." : "The ICT plan runs 20–25 November."}</p>
            )}
          </div>
        </Card>
        <div className="space-y-4">
          <Card>
            <CardHeader icon={<BookOpen size={15} />} title="Continue learning" />
            <div className="p-4 text-sm">
              {last ? (
                <Link to={`/lesson/${last.id}`} className="font-medium text-primary hover:underline">{last.title}</Link>
              ) : <p className="text-fg-2">You haven't opened a lesson yet. Start with <Link className="text-primary" to="/learn">Master Core</Link> or the <Link className="text-primary" to="/academy">University Academy</Link>.</p>}
              <div className="mt-3 space-y-2">
                {MODULES.filter((m) => m.examCritical).slice(0, 6).map((m) => {
                  const ls = LESSONS.filter((l) => l.moduleId === m.id);
                  if (!ls.length) return null;
                  const d = ls.filter((l) => p.completedLessons[l.id]).length;
                  return (
                    <Link key={m.id} to={`/learn/${m.id}`} className="grid grid-cols-[8rem_1fr_auto] items-center gap-2 text-xs text-fg-2 hover:text-fg">
                      <span className="truncate">{m.title}</span><ProgressBar value={d} max={ls.length} tone="success" label={m.title} /><span className="font-mono">{d}/{ls.length}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </Card>
          <Card>
            <CardHeader icon={<ListChecks size={15} />} title="Weak topics" action={<Link to="/assess/results" className="text-xs text-primary">Analysis</Link>} />
            <div className="p-4">
              {weak.length ? <div className="flex flex-wrap gap-1.5">{weak.map((w) => <Badge key={w.key} tone="error">{TOPIC_LABELS[w.key as TopicId]} · {w.pct}%</Badge>)}</div>
                : <p className="text-sm text-fg-2">{p.attempts.length ? "No weak topics with enough evidence yet." : "Complete a quiz or mock — weak topics are calculated from your answers, never guessed."}</p>}
            </div>
          </Card>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader icon={<FileCheck2 size={15} />} title="Practice exam results" action={<Link to="/assess/exams" className="text-xs text-primary">Exam Simulator</Link>} />
          <div className="p-4">
            {recentExams.length === 0 ? <EmptyState title="No attempts yet">Start with the <Link to="/assess/mock" className="text-primary">original mock ICT</Link>.</EmptyState> : (
              <ul className="space-y-2">
                {recentExams.map((a) => {
                  const t = totals(a.results);
                  return (
                    <li key={a.id} className="flex items-center gap-3 text-sm">
                      <Link to={`/assess/results/${a.id}`} className="flex-1 truncate hover:text-primary">{a.title}</Link>
                      <span className="w-24"><ProgressBar value={t.pct} tone={t.pct >= 70 ? "success" : t.pct >= 40 ? "warning" : "error"} label={a.title} /></span>
                      <span className="w-20 text-right font-mono text-xs">{t.awarded}/{t.available}</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </Card>
        <Card>
          <CardHeader icon={<Code2 size={15} />} title="Recent challenges" action={<Link to="/assess/challenges" className="text-xs text-primary">All {CHALLENGES.length}</Link>} />
          <div className="p-4">
            {recentChallenges.length === 0 ? <p className="text-sm text-fg-2">No challenges attempted yet. They're auto-graded with real tests.</p> : (
              <ul className="space-y-1.5 text-sm">
                {recentChallenges.map(([id, r]) => (
                  <li key={id} className="flex justify-between gap-2">
                    <Link to={`/assess/challenges/${id}`} className="truncate hover:text-primary">{CHALLENGES.find((c) => c.id === id)?.title ?? id}</Link>
                    <Badge tone={r.passed ? "success" : "warning"}>{r.bestPassed}/{r.total}</Badge>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Card>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { to: "/lab/visual", icon: Eye, title: "Visual Lab", sub: `${VISUALIZERS.length} interactive visualizers` },
          { to: "/lab/playground", icon: Code2, title: "Code Playground", sub: "Real React, Router, Query & Zustand" },
          { to: "/flashcards", icon: Library, title: "Flashcards", sub: `${FLASHCARDS.length} cards · spaced repetition` },
        ].map((q) => (
          <Link key={q.to} to={q.to}>
            <Card className="flex items-center gap-3 p-4 transition-colors hover:border-line-strong hover:bg-hover">
              <q.icon size={18} className="text-primary" />
              <div><div className="text-sm font-medium">{q.title}</div><div className="text-xs text-fg-2">{q.sub}</div></div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
