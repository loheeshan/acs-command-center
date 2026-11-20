import { useState } from "react";
import { Link } from "react-router-dom";
import { Zap } from "lucide-react";
import { CHEAT_SHEETS } from "@/content/references";
import { TOPIC_LABELS } from "@/content/types";
import { Badge, Card, PageHeader } from "@/components/ui/primitives";
import { Markdown } from "@/components/ui/Markdown";
import { cn } from "@/lib/cn";

export default function RevisionPage() {
  const [active, setActive] = useState(CHEAT_SHEETS[0].id);
  const sheet = CHEAT_SHEETS.find((s) => s.id === active)!;
  return (
    <div>
      <PageHeader eyebrow="Personal" title="Revision Center" description="Concise reference sheets for every exam-critical area." actions={<Link to="/revision/last-minute" className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3.5 text-sm font-medium text-on-primary"><Zap size={14} /> Last-minute ICT mode</Link>} />
      <div className="grid gap-4 md:grid-cols-[14rem_1fr]">
        <nav aria-label="Reference sheets" className="flex gap-1 overflow-x-auto md:flex-col">
          {CHEAT_SHEETS.map((s) => (
            <button key={s.id} type="button" onClick={() => setActive(s.id)} aria-current={active === s.id}
              className={cn("shrink-0 rounded-md px-3 py-2 text-left text-sm", active === s.id ? "bg-primary-soft font-medium text-primary" : "text-fg-2 hover:bg-hover")}>
              {s.title}
            </button>
          ))}
        </nav>
        <Card className="min-w-0 p-5">
          <div className="mb-3 flex items-center gap-2"><h2 className="text-lg font-semibold">{sheet.title}</h2><Badge tone="violet">{TOPIC_LABELS[sheet.topic]}</Badge></div>
          <Markdown>{sheet.body}</Markdown>
        </Card>
      </div>
    </div>
  );
}
