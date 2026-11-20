import { lazy, Suspense } from "react";
import type { Question } from "@/content/types";
import { Markdown } from "@/components/ui/Markdown";
import { Badge } from "@/components/ui/primitives";
import { TOPIC_LABELS } from "@/content/types";
import { cn } from "@/lib/cn";

const CodeEditor = lazy(() => import("@/features/playground/CodeEditor"));

const TYPE_LABEL = { mcq: "Multiple choice", tf: "True / False", short: "Short answer", code: "Programming" } as const;

/** Renders a question with its answer control. `reveal` shows correctness for objective questions. */
export function QuestionView({
  question: q,
  value,
  onChange,
  reveal = false,
  number,
  showMeta = true,
}: {
  question: Question;
  value: unknown;
  onChange?: (v: number | boolean | string) => void;
  reveal?: boolean;
  number?: string;
  showMeta?: boolean;
}) {
  const disabled = !onChange || reveal;
  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-1.5">
        {number && <span className="font-mono text-sm font-semibold text-primary">{number}</span>}
        <Badge>{TYPE_LABEL[q.type]}</Badge>
        <Badge>{q.marks} mark{q.marks === 1 ? "" : "s"}</Badge>
        {showMeta && <Badge tone="violet">{TOPIC_LABELS[q.topic]}</Badge>}
        {showMeta && q.source === "original-mock" && <Badge tone="warning">Original mock</Badge>}
      </div>
      <Markdown>{q.prompt}</Markdown>

      {q.type === "mcq" && (
        <fieldset className="mt-4 space-y-2" disabled={disabled}>
          <legend className="sr-only">Choose one answer</legend>
          {q.options.map((opt, i) => {
            const selected = value === i;
            const correct = reveal && i === q.answer;
            const wrong = reveal && selected && i !== q.answer;
            return (
              <label
                key={i}
                className={cn(
                  "flex cursor-pointer items-start gap-3 rounded-md border px-3.5 py-2.5 text-sm transition-colors",
                  selected ? "border-primary bg-primary-soft" : "border-line bg-surface hover:bg-hover",
                  correct && "border-ok bg-ok-soft",
                  wrong && "border-err bg-err-soft",
                  disabled && "cursor-default",
                )}
              >
                <input type="radio" name={q.id} className="mt-1 accent-[var(--primary)]" checked={selected} onChange={() => onChange?.(i)} />
                <span className="font-mono text-xs text-fg-3">{String.fromCharCode(65 + i)}.</span>
                <Markdown className="flex-1 text-sm">{opt}</Markdown>
              </label>
            );
          })}
        </fieldset>
      )}

      {q.type === "tf" && (
        <fieldset className="mt-4 flex gap-2" disabled={disabled}>
          <legend className="sr-only">True or false</legend>
          {[true, false].map((v) => {
            const selected = value === v;
            const correct = reveal && v === q.answer;
            const wrong = reveal && selected && v !== q.answer;
            return (
              <label
                key={String(v)}
                className={cn(
                  "flex min-w-28 cursor-pointer items-center gap-2 rounded-md border px-4 py-2.5 text-sm font-medium",
                  selected ? "border-primary bg-primary-soft" : "border-line bg-surface hover:bg-hover",
                  correct && "border-ok bg-ok-soft",
                  wrong && "border-err bg-err-soft",
                )}
              >
                <input type="radio" name={q.id} checked={selected} onChange={() => onChange?.(v)} className="accent-[var(--primary)]" />
                {v ? "True" : "False"}
              </label>
            );
          })}
        </fieldset>
      )}

      {q.type === "short" && (
        <div className="mt-4">
          <label htmlFor={`ans-${q.id}`} className="mb-1 block text-xs text-fg-2">Your answer</label>
          <textarea
            id={`ans-${q.id}`}
            value={typeof value === "string" ? value : ""}
            onChange={(e) => onChange?.(e.target.value)}
            readOnly={disabled}
            rows={6}
            className="w-full rounded-md border border-line bg-surface p-3 text-sm text-fg"
            placeholder="Write your answer…"
          />
        </div>
      )}

      {q.type === "code" && (
        <div className="mt-4">
          <p className="mb-1 text-xs text-fg-2">Your answer (code and/or written explanation)</p>
          <div className="h-80 overflow-hidden rounded-md border border-line">
            <Suspense fallback={<div className="p-3 text-sm text-fg-2">Loading editor…</div>}>
              <CodeEditor
                path={`answers/${q.id}.${q.language === "ts" || q.language === "tsx" ? "tsx" : q.language === "js" || q.language === "jsx" ? "jsx" : "txt"}`}
                value={typeof value === "string" ? value : q.starterCode ?? ""}
                onChange={(v) => onChange?.(v)}
                readOnly={disabled}
              />
            </Suspense>
          </div>
        </div>
      )}
    </div>
  );
}

/** Explanation panel shown after answering / in review. */
export function QuestionFeedback({ question: q, value }: { question: Question; value: unknown }) {
  if (q.type === "mcq") {
    const chosen = typeof value === "number" ? value : null;
    const note = chosen !== null && chosen !== q.answer ? q.distractorNotes?.[chosen] : undefined;
    return (
      <div className="mt-4 space-y-2">
        <div className={cn("rounded-md border px-3.5 py-2.5 text-sm", chosen === q.answer ? "border-ok/40 bg-ok-soft" : "border-err/40 bg-err-soft")}>
          <strong>{chosen === null ? "Not answered." : chosen === q.answer ? "Correct." : "Incorrect."}</strong> The answer is {String.fromCharCode(65 + q.answer)}.
        </div>
        {note && <div className="rounded-md border border-line bg-surface px-3.5 py-2.5 text-sm"><strong className="text-err">Why your choice is wrong:</strong> <Markdown className="inline text-sm">{note}</Markdown></div>}
        <Markdown className="text-sm">{q.explanation}</Markdown>
        {q.misconception && <p className="text-xs text-fg-3">Misconception tested: {q.misconception}</p>}
      </div>
    );
  }
  if (q.type === "tf") {
    const ok = value === q.answer;
    return (
      <div className="mt-4 space-y-2">
        <div className={cn("rounded-md border px-3.5 py-2.5 text-sm", ok ? "border-ok/40 bg-ok-soft" : "border-err/40 bg-err-soft")}>
          <strong>{value === undefined ? "Not answered." : ok ? "Correct." : "Incorrect."}</strong> The statement is {q.answer ? "TRUE" : "FALSE"}.
        </div>
        <Markdown className="text-sm">{q.explanation}</Markdown>
      </div>
    );
  }
  return null;
}
