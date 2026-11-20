import { Link } from "react-router-dom";
import { CHEAT_SHEETS } from "@/content/references";
import { FLASHCARDS } from "@/content";
import { Callout, Card, PageHeader } from "@/components/ui/primitives";
import { Markdown } from "@/components/ui/Markdown";

export default function LastMinutePage() {
  const sheets = CHEAT_SHEETS.filter((s) => s.highPriority);
  const cards = FLASHCARDS.filter((c) => c.highPriority);
  return (
    <div>
      <PageHeader eyebrow="Exam day" title="Last-minute ICT revision" description="Only the high-priority concepts. No new topics — skim, recall, stay calm." actions={<Link to="/flashcards?deck=priority" className="text-sm text-primary">Drill {cards.length} priority flashcards →</Link>} />
      <Callout tone="warning" title="Reminder">The actual ICT is on Blackboard and may differ from the mock. Read each question fully; for code questions, logically correct solutions receive credit.</Callout>
      <div className="mt-4 columns-1 gap-4 lg:columns-2">
        {sheets.map((s) => (
          <Card key={s.id} className="mb-4 break-inside-avoid p-4">
            <h2 className="mb-2 text-sm font-semibold text-primary">{s.title}</h2>
            <Markdown className="text-[13px]">{s.body}</Markdown>
          </Card>
        ))}
      </div>
    </div>
  );
}
