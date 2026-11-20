import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { RotateCw } from "lucide-react";
import { FLASHCARDS, lessonById } from "@/content";
import { TOPIC_LABELS, type TopicId } from "@/content/types";
import { Badge, Button, Card, EmptyState, PageHeader, Segmented } from "@/components/ui/primitives";
import { Markdown } from "@/components/ui/Markdown";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { useProgressStore } from "@/stores/progressStore";

type Deck = "due" | "priority" | "revise" | "all";

export default function FlashcardsPage() {
  const [params, setParams] = useSearchParams();
  const deck = (params.get("deck") as Deck) ?? "due";
  const [topic, setTopic] = useState<TopicId | "all">("all");
  const states = useProgressStore((s) => s.flashcards);
  const { rateFlashcard, setFlashcardStatus } = useProgressStore.getState();
  const [flipped, setFlipped] = useState(false);
  const [sessionNow] = useState(() => Date.now());
  const [seen, setSeen] = useState<string[]>([]);

  const queue = useMemo(() => FLASHCARDS.filter((c) => {
    if (topic !== "all" && c.topic !== topic) return false;
    if (seen.includes(c.id)) return false;
    const st = states[c.id];
    if (deck === "due") return (st?.due ?? 0) <= sessionNow;
    if (deck === "priority") return !!c.highPriority;
    if (deck === "revise") return st?.status === "revise";
    return true;
  }), [deck, topic, states, seen, sessionNow]);
  const card = queue[0];
  const topics = [...new Set(FLASHCARDS.map((c) => c.topic))];
  const understood = FLASHCARDS.filter((c) => states[c.id]?.status === "understood").length;

  const rate = (q: 0 | 3 | 4 | 5) => {
    rateFlashcard(card.id, q);
    setSeen((s) => [...s, card.id]);
    setFlipped(false);
  };

  return (
    <div>
      <PageHeader eyebrow="Personal" title="Flashcards" description={`${FLASHCARDS.length} cards with spaced repetition (SM-2 style intervals). ${understood} marked as understood.`} />
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Segmented label="Deck" value={deck} onChange={(d) => { setParams({ deck: d }); setSeen([]); setFlipped(false); }} options={[{ value: "due", label: "Due now" }, { value: "priority", label: "ICT priority" }, { value: "revise", label: "Marked for revision" }, { value: "all", label: "All" }]} />
        <select aria-label="Topic" value={topic} onChange={(e) => { setTopic(e.target.value as TopicId | "all"); setSeen([]); }} className="h-8 rounded-md border border-line bg-elevated px-2 text-xs text-fg">
          <option value="all">All topics</option>
          {topics.map((t) => <option key={t} value={t}>{TOPIC_LABELS[t]}</option>)}
        </select>
        <span className="text-xs text-fg-3">{queue.length} in queue</span>
      </div>
      {!card ? (
        <EmptyState title="Nothing left in this deck" action={<Button onClick={() => setSeen([])}><RotateCw size={13} /> Restart deck</Button>}>Come back later — cards reappear when they're due.</EmptyState>
      ) : (
        <div className="mx-auto max-w-2xl">
          <Card className="min-h-64 p-6">
            <div className="mb-3 flex items-center justify-between">
              <Badge tone="violet">{TOPIC_LABELS[card.topic]}</Badge>
              {card.highPriority && <Badge tone="warning">ICT priority</Badge>}
            </div>
            <Markdown className="text-base">{card.front}</Markdown>
            {flipped && (
              <div className="mt-5 border-t border-line pt-4">
                <Markdown>{card.back}</Markdown>
                {card.code && <CodeBlock className="mt-3" code={card.code} language="tsx" runnable={false} />}
                {card.lessonId && lessonById(card.lessonId) && <Link to={`/lesson/${card.lessonId}`} className="mt-3 inline-block text-xs text-primary hover:underline">Lesson: {lessonById(card.lessonId)!.title}</Link>}
              </div>
            )}
          </Card>
          {!flipped ? (
            <div className="mt-4 flex justify-center"><Button variant="primary" onClick={() => setFlipped(true)}>Show answer</Button></div>
          ) : (
            <div className="mt-4 space-y-3">
              <p className="text-center text-xs text-fg-3">How well did you recall it?</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                <Button variant="danger" onClick={() => rate(0)}>Forgot</Button>
                <Button onClick={() => rate(3)}>Hard</Button>
                <Button onClick={() => rate(4)}>Good</Button>
                <Button variant="success" onClick={() => rate(5)}>Easy</Button>
              </div>
              <div className="flex justify-center gap-2">
                <Button size="sm" variant="ghost" onClick={() => setFlashcardStatus(card.id, "understood")}>Mark understood</Button>
                <Button size="sm" variant="ghost" onClick={() => setFlashcardStatus(card.id, "revise")}>Mark for revision</Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
