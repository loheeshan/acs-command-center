import { useState } from "react";
import { Check, GitBranch, X } from "lucide-react";
import { Badge, Button, Callout, Card, CardHeader, ProgressBar } from "@/components/ui/primitives";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { cn } from "@/lib/cn";
import { useMarkOnce } from "./shared";

type Choice = "useState" | "context" | "zustand" | "query" | "url" | "derived" | "formlib";
const CHOICES: { id: Choice; label: string }[] = [
  { id: "useState", label: "Local useState" },
  { id: "context", label: "React Context" },
  { id: "zustand", label: "Zustand store" },
  { id: "query", label: "TanStack Query" },
  { id: "url", label: "URL search params" },
  { id: "derived", label: "Derived value" },
  { id: "formlib", label: "Form library (RHF)" },
];
interface Scenario { q: string; best: Choice; ok?: Choice[]; why: string }
const SCENARIOS: Scenario[] = [
  { q: "The text a user is typing into a single search input inside one component.", best: "useState", ok: ["formlib"], why: "Owned by one component and short-lived. Local state is simplest; lift it only when another component needs it." },
  { q: "Light/dark theme used by almost every component, rarely changes.", best: "context", ok: ["zustand"], why: "App-wide, low-frequency client state. Context is fine (re-renders are rare); a small Zustand store with persist also works well." },
  { q: "The list of events loaded from GET /api/events.", best: "query", why: "Server state: it lives on the server, can go stale and needs caching, loading/error states and refetching. That's TanStack Query's job — don't copy it into useState/Zustand." },
  { q: "Search filters (category=tech&sort=date) that users should be able to bookmark and share.", best: "url", why: "If it must survive reload, back/forward and be shareable, the URL is the source of truth: useSearchParams()." },
  { q: "Shopping cart items added from many pages, kept across navigation.", best: "zustand", ok: ["context"], why: "Client-owned global state, updated often from many places. A Zustand store (optionally persisted) with selectors avoids re-rendering everything." },
  { q: "Basket total price.", best: "derived", why: "Compute it from the cart items during render (or in a selector). Storing it separately creates two sources of truth that can drift apart." },
  { q: "The logged-in user's info and token after login.", best: "zustand", ok: ["context"], why: "Global client state needed by the API client, guards and navbar. A Zustand auth store (or AuthContext) is typical; remember the server is still the authority." },
  { q: "Whether the sidebar is open.", best: "zustand", ok: ["context", "useState"], why: "UI state shared between the toggle button (header) and the sidebar. A small UI store (or lifted state/context) — local state if only one component cares." },
  { q: "Which tab is selected inside a single EventDetails component.", best: "useState", ok: ["url"], why: "Local to one component. Use URL params only if the tab should be linkable." },
  { q: "The current user's bookings from GET /api/bookings/my-bookings.", best: "query", why: "Server state again. useQuery({ queryKey: ['bookings', 'mine'] }) and invalidate after booking/cancelling." },
  { q: "A confirmation modal that can be opened from anywhere in the app.", best: "zustand", ok: ["context"], why: "Global UI state triggered from many places — a tiny store with open(content)/close() actions works well." },
  { q: "A 3-step event creation wizard with validation on each step.", best: "formlib", ok: ["zustand", "useState"], why: "Complex form state, validation and touched/dirty tracking is what React Hook Form (+ Zod) is built for. Keep wizard progress in the form or a small store." },
];

const FLOW = `Is it data from the server (API)?
 ├─ yes → TanStack Query (cache, stale, refetch, invalidate)
 └─ no ↓
Can it be calculated from other state/props?
 ├─ yes → Derived value (compute during render)
 └─ no ↓
Should it be in the link / survive reload / be shareable?
 ├─ yes → URL (useParams / useSearchParams)
 └─ no ↓
Is it a form with validation?
 ├─ yes → Form library (React Hook Form + Zod) or local state
 └─ no ↓
Used by one component (or a parent + a few children)?
 ├─ yes → useState (lift up if needed)
 └─ no → global client state:
          rarely changes → Context
          changes often / many consumers → Zustand (selectors)`;

export default function StateDecisionViz() {
  const mark = useMarkOnce("state-decision");
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, Choice>>({});
  const sc = SCENARIOS[idx];
  const picked = answers[idx];
  const verdict = (i: number, c: Choice) => (c === SCENARIOS[i].best ? "best" : SCENARIOS[i].ok?.includes(c) ? "ok" : "wrong");
  const done = Object.keys(answers).length;
  const score = Object.entries(answers).reduce((n, [i, c]) => n + (verdict(Number(i), c) === "wrong" ? 0 : 1), 0);

  const pick = (c: Choice) => {
    if (picked) return;
    const next = { ...answers, [idx]: c };
    setAnswers(next);
    if (Object.keys(next).length === SCENARIOS.length) mark();
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border border-violet/30 bg-violet-soft px-3 py-2 text-xs text-violet"><strong>Decision lab (simulation):</strong> there is often more than one defensible answer — the feedback explains the trade-off.</div>
      <div className="flex flex-wrap items-center gap-3">
        <div className="w-48"><ProgressBar value={done} max={SCENARIOS.length} label="Scenarios answered" /></div>
        <span className="text-xs text-fg-2">{done}/{SCENARIOS.length} answered · score {score}</span>
        <Button size="sm" variant="ghost" onClick={() => { setAnswers({}); setIdx(0); }}>Restart</Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
        <Card>
          <CardHeader title={`Scenario ${idx + 1} of ${SCENARIOS.length}`} subtitle="Where should this state live?" />
          <div className="space-y-4 p-4">
            <p className="text-base text-fg">{sc.q}</p>
            <div className="grid gap-2 sm:grid-cols-2" role="group" aria-label="Choices">
              {CHOICES.map((c) => {
                const v = picked ? verdict(idx, c.id) : null;
                return (
                  <button key={c.id} type="button" disabled={!!picked} onClick={() => pick(c.id)}
                    className={cn("flex items-center justify-between rounded-md border px-3 py-2 text-left text-sm transition-colors",
                      !picked && "border-line hover:bg-hover",
                      picked && v === "best" && "border-ok/50 bg-ok-soft text-ok",
                      picked && v === "ok" && "border-warn/50 bg-warn-soft text-warn",
                      picked && v === "wrong" && picked === c.id && "border-err/50 bg-err-soft text-err",
                      picked && v === "wrong" && picked !== c.id && "border-line text-fg-3")}>
                    {c.label}
                    {picked && v === "best" && <Check size={14} />}
                    {picked === c.id && v === "wrong" && <X size={14} />}
                  </button>
                );
              })}
            </div>
            {picked && (
              <Callout tone={verdict(idx, picked) === "best" ? "success" : verdict(idx, picked) === "ok" ? "warning" : "error"}
                title={verdict(idx, picked) === "best" ? "Best fit" : verdict(idx, picked) === "ok" ? "Acceptable — but consider the best fit" : `Not ideal — best fit: ${CHOICES.find((c) => c.id === sc.best)!.label}`}>
                {sc.why}
              </Callout>
            )}
            <div className="flex gap-2">
              <Button size="sm" onClick={() => setIdx((i) => Math.max(0, i - 1))} disabled={idx === 0}>Previous</Button>
              <Button size="sm" variant="primary" onClick={() => setIdx((i) => Math.min(SCENARIOS.length - 1, i + 1))} disabled={idx === SCENARIOS.length - 1}>Next</Button>
            </div>
          </div>
        </Card>
        <Card>
          <CardHeader title="Your answers" />
          <ol className="space-y-1 p-3 text-xs">
            {SCENARIOS.map((s, i) => {
              const a = answers[i];
              const v = a ? verdict(i, a) : null;
              return (
                <li key={i}>
                  <button type="button" onClick={() => setIdx(i)} className={cn("flex w-full items-center justify-between gap-2 rounded px-2 py-1 text-left hover:bg-hover", i === idx && "bg-primary-soft")}>
                    <span className="truncate text-fg-2">{i + 1}. {s.q}</span>
                    {v && <Badge tone={v === "best" ? "success" : v === "ok" ? "warning" : "error"}>{v}</Badge>}
                  </button>
                </li>
              );
            })}
          </ol>
        </Card>
      </div>

      <Card>
        <CardHeader icon={<GitBranch size={16} />} title="Decision flowchart" subtitle="Ask these questions in order" />
        <div className="p-3"><CodeBlock code={FLOW} language="text" title="where-does-state-live.txt" runnable={false} /></div>
      </Card>
    </div>
  );
}
