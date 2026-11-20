import { useMemo } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, CheckCircle2, Circle, Coffee, Flag, Rocket } from "lucide-react";
import { STUDY_PLAN, type StudyTask } from "./plan";
import { ExamClockHero, useIctState } from "@/components/layout/ExamClock";
import { Badge, Callout, Card, PageHeader, ProgressBar } from "@/components/ui/primitives";
import { useProgressStore } from "@/stores/progressStore";
import { PAPERS, paperQuestions, LESSONS } from "@/content";
import { MODULES } from "@/content/modules";
import { TOPIC_LABELS, type TopicId } from "@/content/types";
import { colomboToEpoch, formatDate, todayColombo } from "@/lib/dates";
import { cn } from "@/lib/cn";

interface Slot {
  key: string;
  date: string;
  start: number;
  end: number;
  task: StudyTask | null; // null = auto break
}

const EXAM_DAY_CUTOFF = "14:30";
const BREAK_EVERY_MIN = 90;
const BREAK_MIN = 10;

/** Lay the essential (priority-1) tasks of each remaining day onto real clock times. */
function buildTimeline(startHHMM: string, today: string): Slot[] {
  const slots: Slot[] = [];
  for (const day of STUDY_PLAN.filter((d) => d.date >= today)) {
    let t = colomboToEpoch(`${day.date}T${startHHMM}`);
    const cutoff = day.date === "2026-11-25" ? colomboToEpoch(`${day.date}T${EXAM_DAY_CUTOFF}`) : Infinity;
    let sinceBreak = 0;
    for (const task of day.tasks.filter((x) => x.priority === 1)) {
      if (task.kind !== "break" && sinceBreak >= BREAK_EVERY_MIN) {
        slots.push({ key: `${day.date}-auto-${t}`, date: day.date, start: t, end: t + BREAK_MIN * 60_000, task: null });
        t += BREAK_MIN * 60_000;
        sinceBreak = 0;
      }
      if (t + task.minutes * 60_000 > cutoff) break;
      slots.push({ key: task.id, date: day.date, start: t, end: t + task.minutes * 60_000, task });
      t += task.minutes * 60_000;
      sinceBreak = task.kind === "break" ? 0 : sinceBreak + task.minutes;
    }
  }
  return slots;
}

function useMarksMap() {
  return useMemo(() => {
    const paper = PAPERS.find((p) => p.kind === "original-mock");
    if (!paper) return [];
    const by = new Map<TopicId, number>();
    for (const { question } of paperQuestions(paper)) by.set(question.topic, (by.get(question.topic) ?? 0) + question.marks);
    return [...by.entries()].sort((a, b) => b[1] - a[1]);
  }, []);
}

export default function FastTrackPage() {
  const { now, start: examStart } = useIctState();
  const completed = useProgressStore((s) => s.completedLessons);
  const tasksDone = useProgressStore((s) => s.studyTasksDone);
  const toggle = useProgressStore((s) => s.toggleStudyTask);
  const startHHMM = useProgressStore((s) => s.planner.fastTrackStart) || "09:00";
  const setPlanner = useProgressStore((s) => s.setPlanner);
  const today = todayColombo();
  const slots = useMemo(() => buildTimeline(startHHMM, today), [startHHMM, today]);
  const marks = useMarksMap();

  const isDone = (t: StudyTask) => (t.id.startsWith("l:") ? !!completed[t.id.slice(2)] : !!tasksDone[t.id]);
  const work = slots.filter((s) => s.task && s.task.kind !== "break");
  const doneCount = work.filter((s) => isDone(s.task!)).length;
  const current = slots.find((s) => now >= s.start && now < s.end);
  const behind = work.filter((s) => s.end <= now && !isDone(s.task!));
  const nextUp = work.find((s) => !isDone(s.task!));
  const days = [...new Set(slots.map((s) => s.date))];

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="ICT only · fastest path"
        title="ICT Fast Track"
        description="Only what the ICT tests, ordered by marks, laid onto a real timeline that ends at 14:30 on exam day. Optional extras live in the Study Roadmap."
      />
      <ExamClockHero />

      <div className="grid gap-4 lg:grid-cols-[1fr_20rem]">
        <Card className="p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-sm font-semibold">Where the 100 marks are <span className="font-normal text-fg-3">(original mock, by topic)</span></h2>
          </div>
          <ul className="space-y-2">
            {marks.map(([topic, m]) => {
              const mods = MODULES.filter((x) => x.topic === topic).map((x) => x.id);
              const ls = LESSONS.filter((l) => mods.includes(l.moduleId) && l.examCritical);
              const d = ls.filter((l) => completed[l.id]).length;
              return (
                <li key={topic} className="grid grid-cols-[8.5rem_1fr_4rem_5.5rem] items-center gap-2 text-sm">
                  <span className="truncate text-fg-2">{TOPIC_LABELS[topic]}</span>
                  <div className="h-2 overflow-hidden rounded-full bg-elevated"><div className="h-full rounded-full bg-primary" style={{ width: `${m}%` }} /></div>
                  <span className="text-right font-mono text-xs">{m} marks</span>
                  <span className="text-right text-[11px] text-fg-3">{ls.length ? `${d}/${ls.length} lessons` : "—"}</span>
                </li>
              );
            })}
          </ul>
          <p className="mt-3 text-xs text-fg-3">The real ICT may weight topics differently; the mock is the best available signal.</p>
        </Card>
        <Card className="space-y-3 p-4">
          <div>
            <div className="mb-1 flex justify-between text-xs text-fg-2"><span>Fast-track progress</span><span>{doneCount}/{work.length}</span></div>
            <ProgressBar value={doneCount} max={Math.max(1, work.length)} tone="success" label="Fast track progress" />
          </div>
          {nextUp?.task && (
            <div className="rounded-md border border-primary/40 bg-primary-soft p-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-primary">Do this next</p>
              <Link to={nextUp.task.to} className="text-sm font-medium hover:underline">{nextUp.task.title}</Link>
              <p className="text-[11px] text-fg-3">{nextUp.task.minutes} min</p>
            </div>
          )}
          {behind.length > 0 && now < examStart && (
            <Callout tone="warning" title={`${behind.length} block(s) behind schedule`} icon={<AlertTriangle size={14} />}>
              Don't try to catch up everything — do the next unfinished block. Sections D (40 marks) and A (20) matter most.
            </Callout>
          )}
          <label className="flex items-center justify-between gap-2 text-xs text-fg-2">
            I start studying each day at
            <input type="time" value={startHHMM} onChange={(e) => setPlanner("fastTrackStart", e.target.value || "09:00")} className="h-8 rounded border border-line bg-elevated px-2 text-fg" />
          </label>
        </Card>
      </div>

      {days.map((date) => (
        <section key={date}>
          <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold">
            {formatDate(date, { weekday: "long", day: "numeric", month: "short" })}
            {date === today && <Badge tone="primary">Today</Badge>}
            {date === "2026-11-25" && <Badge tone="error"><Flag size={11} /> ICT 15:30–17:30</Badge>}
            <span className="font-normal text-fg-3">· {STUDY_PLAN.find((d) => d.date === date)?.theme}</span>
          </h2>
          <ol className="relative space-y-1 border-l border-line pl-4">
            {slots.filter((s) => s.date === date).map((s) => {
              const isCurrent = current?.key === s.key;
              const done = s.task ? isDone(s.task) : now >= s.end;
              const late = s.task && s.task.kind !== "break" && s.end <= now && !done;
              return (
                <li key={s.key} className={cn("relative flex items-center gap-3 rounded-md px-2 py-1.5", isCurrent && "bg-primary-soft ring-1 ring-primary/50")}>
                  <span className={cn("absolute -left-[21px] h-2.5 w-2.5 rounded-full border-2", isCurrent ? "border-primary bg-primary" : done ? "border-ok bg-ok" : late ? "border-warn bg-warn" : "border-line-strong bg-bg")} />
                  <span className="w-24 shrink-0 font-mono text-[11px] text-fg-3">{formatDate(s.start, { hour: "2-digit", minute: "2-digit" })}–{formatDate(s.end, { hour: "2-digit", minute: "2-digit" })}</span>
                  {s.task === null ? (
                    <span className="flex items-center gap-2 text-xs text-fg-3"><Coffee size={13} /> Break — stand up, water, no screens</span>
                  ) : (
                    <>
                      <button type="button" aria-label={done ? "Mark not done" : "Mark done"} onClick={() => !s.task!.id.startsWith("l:") && toggle(s.task!.id)} title={s.task.id.startsWith("l:") ? "Ticks automatically when you complete the lesson" : undefined}>
                        {done ? <CheckCircle2 size={16} className="text-ok" /> : s.task.kind === "break" ? <Coffee size={16} className="text-fg-3" /> : <Circle size={16} className="text-fg-3" />}
                      </button>
                      <Link to={s.task.to} className={cn("flex-1 text-sm", done ? "text-fg-3 line-through" : "hover:text-primary")}>{s.task.title}</Link>
                      {isCurrent && <Badge tone="primary">Now</Badge>}
                      {late && <Badge tone="warning">Behind</Badge>}
                      {s.task.kind === "exam" && <Badge tone="violet">Timed</Badge>}
                    </>
                  )}
                </li>
              );
            })}
          </ol>
        </section>
      ))}

      <Card className="p-4">
        <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold"><Rocket size={15} className="text-primary" /> Exam-day checklist (25 Nov)</h2>
        <ul className="list-disc space-y-1 pl-5 text-sm text-fg-2">
          <li>Stop revising at 14:30. Arrive early for the 15:30 start (lab-based ICT on Blackboard).</li>
          <li>Plan your 90 minutes: A ≈15 min, B ≈10, C ≈15, D ≈40, E ≈10. If you have RAF, you get 25 extra minutes.</li>
          <li>Answer every question in Sections A–E — the mock states all sections are mandatory; don't leave anything blank.</li>
          <li>Section D: logically correct code gets credit; write the structure first (route config, useEffect + AbortController, validation function, fetch POST), then the details.</li>
        </ul>
      </Card>
    </div>
  );
}
