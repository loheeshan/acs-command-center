import { Link, useNavigate } from "react-router-dom";
import { BookOpenCheck, Code2, FileCheck2, Gauge, Infinity as InfinityIcon, ShieldCheck, Sprout, Target, Timer } from "lucide-react";
import type { ReactNode } from "react";
import { PAPERS } from "@/content";
import { Badge, Button, Callout, Card, PageHeader } from "@/components/ui/primitives";
import { useExamSessionStore, type GeneratedPaper } from "@/stores/examSessionStore";
import { useProgressStore } from "@/stores/progressStore";
import { weakTopics, missedQuestionIds } from "@/features/assessment/scoring";
import { TOPIC_LABELS } from "@/content/types";
import { beginnerMock, missedPaper, programmingOnly, securityOnly, topicPaper } from "./generate";

function ModeCard({ icon, title, description, children, badge }: { icon: ReactNode; title: string; description: string; children: ReactNode; badge?: ReactNode }) {
  return (
    <Card className="flex flex-col p-4">
      <div className="flex items-start justify-between gap-2">
        <span className="grid h-8 w-8 place-items-center rounded-md bg-primary-soft text-primary">{icon}</span>
        {badge}
      </div>
      <h3 className="mt-3 text-sm font-semibold">{title}</h3>
      <p className="mt-1 flex-1 text-xs text-fg-2">{description}</p>
      <div className="mt-4 flex flex-wrap gap-2">{children}</div>
    </Card>
  );
}

export default function ExamSelectPage() {
  const navigate = useNavigate();
  const session = useExamSessionStore((s) => s.session);
  const start = useExamSessionStore((s) => s.start);
  const end = useExamSessionStore((s) => s.end);
  const attempts = useProgressStore((s) => s.attempts);
  const weak = weakTopics(attempts);
  const missed = missedQuestionIds(attempts);
  const original = PAPERS.find((p) => p.kind === "original-mock");
  const pm1 = PAPERS.find((p) => p.id === "practice-mock-1");
  const pm2 = PAPERS.find((p) => p.id === "practice-mock-2");

  const startGenerated = (id: string, g: GeneratedPaper | null, minutes: number | null) => {
    if (!g) return;
    if (session && !window.confirm("This will discard your in-progress exam. Continue?")) return;
    end();
    start(id, minutes, g);
    navigate(`/assess/exam/${id}`);
  };

  return (
    <div>
      <PageHeader eyebrow="Assessment" title="Exam Simulator" description="Blackboard-style timed papers with a question navigator, flags and auto-save. The timer is based on an absolute deadline, so refreshing the page never resets it." />
      {session && (
        <Callout tone="warning" title="Exam in progress">
          You have an unfinished attempt. <Link className="text-primary underline" to={`/assess/exam/${session.paperId}`}>Resume it</Link>
        </Callout>
      )}
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {original && (
          <ModeCard icon={<FileCheck2 size={16} />} title="1 · Original university mock" description="The supplied MOCK ICT preserved verbatim — 100 marks, sections A–E." badge={<Badge tone="warning">Original</Badge>}>
            <Button size="sm" variant="primary" onClick={() => navigate(`/assess/exam/${original.id}`)}>Open</Button>
          </ModeCard>
        )}
        <ModeCard icon={<Sprout size={16} />} title="2 · Beginner guided mock" description="Same section shape using beginner/intermediate practice questions. Good first diagnostic.">
          <Button size="sm" onClick={() => startGenerated("gen-beginner", beginnerMock(), null)}>Start untimed</Button>
          <Button size="sm" onClick={() => startGenerated("gen-beginner", beginnerMock(), 60)}>Timed 60 min</Button>
        </ModeCard>
        {pm1 && (
          <ModeCard icon={<Gauge size={16} />} title="3 · Moderate mock" description={`${pm1.title} — original practice paper, different scenarios, full 100-mark structure.`} badge={<Badge>Practice</Badge>}>
            <Button size="sm" onClick={() => navigate(`/assess/exam/${pm1.id}`)}>Open</Button>
          </ModeCard>
        )}
        {pm2 && (
          <ModeCard icon={<Target size={16} />} title="4 · Difficult mock" description={`${pm2.title} — output prediction, bug finding and harder Section D tasks.`} badge={<Badge tone="error">Advanced</Badge>}>
            <Button size="sm" onClick={() => navigate(`/assess/exam/${pm2.id}`)}>Open</Button>
          </ModeCard>
        )}
        <ModeCard icon={<Timer size={16} />} title="5 · Full 90-minute ICT simulation" description="Pick any full paper and choose the timed option (90 min, or 115 min with RAF).">
          {PAPERS.map((p) => <Button key={p.id} size="sm" onClick={() => navigate(`/assess/exam/${p.id}`)}>{p.kind === "original-mock" ? "Original" : p.id.replace("practice-mock-", "Practice ")}</Button>)}
        </ModeCard>
        <ModeCard icon={<Code2 size={16} />} title="6 · Programming-only" description="Section D-style questions: routing, API consumption, forms/CRUD, state management. Self-assessed with rubrics.">
          <Button size="sm" onClick={() => startGenerated("gen-programming", programmingOnly(), 80)}>Timed 80 min</Button>
          <Button size="sm" onClick={() => startGenerated("gen-programming", programmingOnly(), null)}>Untimed</Button>
        </ModeCard>
        <ModeCard icon={<ShieldCheck size={16} />} title="7 · Security-only" description="Section E-style security questions plus deeper practice items.">
          <Button size="sm" onClick={() => startGenerated("gen-security", securityOnly(), 25)}>Timed 25 min</Button>
          <Button size="sm" onClick={() => startGenerated("gen-security", securityOnly(), null)}>Untimed</Button>
        </ModeCard>
        <ModeCard
          icon={<BookOpenCheck size={16} />}
          title="8 · Weak-topic practice"
          description={weak.length ? `Built from your measured weak topics: ${weak.map((w) => TOPIC_LABELS[w.key]).join(", ")}.` : "Available once your attempts show a topic below 65% (with at least 3 answered questions). Take a quiz or mock first."}
        >
          <Button size="sm" disabled={!weak.length} onClick={() => startGenerated("gen-weak", topicPaper(weak.map((w) => w.key), "Weak-topic practice", "Questions from topics where your recorded accuracy is lowest.", 25), null)}>Start</Button>
          <Button size="sm" disabled={!missed.length} onClick={() => startGenerated("gen-missed", missedPaper(missed), null)}>Retry my mistakes ({missed.length})</Button>
        </ModeCard>
        <ModeCard icon={<InfinityIcon size={16} />} title="9 · Unlimited untimed revision" description="Any paper without a clock — open a paper and choose 'Untimed revision mode', or use the Quiz Arena for instant feedback per question.">
          <Button size="sm" onClick={() => navigate("/assess/quiz")}>Quiz Arena</Button>
        </ModeCard>
      </div>
    </div>
  );
}
