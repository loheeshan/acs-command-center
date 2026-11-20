import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle2, Circle, Code2, Lock } from "lucide-react";
import type { LabStage } from "./types";
import { Badge, Button, Callout, Card, EmptyState, PageHeader, Tabs } from "@/components/ui/primitives";
import { Markdown } from "@/components/ui/Markdown";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { useProgressStore } from "@/stores/progressStore";
import { openInPlayground } from "@/features/playground/handoff";
import { lessonById } from "@/content";
import { cn } from "@/lib/cn";

const mods = import.meta.glob<{ LAB_STAGES: LabStage[] }>("./stages.ts", { eager: true });
const STAGES: LabStage[] = Object.values(mods)[0]?.LAB_STAGES ?? [];

function langOf(path: string) {
  return path.split(".").pop() ?? "tsx";
}

export default function CampusEventsLabPage() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const checklist = useProgressStore((s) => s.checklist);
  const toggle = useProgressStore((s) => s.toggleChecklist);
  const [tab, setTab] = useState<"guide" | "starter" | "reference" | "check">("guide");
  const [refUnlocked, setRefUnlocked] = useState<Record<string, boolean>>({});

  if (!STAGES.length) {
    return (
      <div>
        <PageHeader eyebrow="Laboratory" title="CampusEvents Project Lab" />
        <EmptyState title="Stages are being prepared">The 8 progressive stages will appear here automatically.</EmptyState>
      </div>
    );
  }

  const stage = STAGES.find((s) => s.id === params.get("stage")) ?? STAGES[0];
  const todoIds = stage.todos.map((_, i) => `lab-${stage.id}-${i}`);
  const todosDone = todoIds.filter((id) => checklist[id]).length;
  const stageDone = (s: LabStage) => s.todos.every((_, i) => checklist[`lab-${s.id}-${i}`]);
  const open = (proj: LabStage["starter"], which: string) => {
    openInPlayground({ code: "", language: "tsx", title: `CampusEvents · Stage ${stage.number} (${which})`, files: proj.files, entry: proj.entry, open: proj.open, instructions: `### Stage ${stage.number}: ${stage.title}\n\n${stage.todos.map((t) => `- [ ] ${t}`).join("\n")}\n\nThe sandbox's **mock CampusEvents API** answers \`/api/*\`. Admin login: \`admin@example.com\` / \`Password123\`.` });
    navigate("/lab/playground");
  };

  return (
    <div>
      <PageHeader eyebrow="Laboratory" title="CampusEvents Project Lab" description="Build the module's running example step by step — from a static shell to an authenticated, cached, tested application. Each stage runs in the sandbox against a mock CampusEvents API." />
      <div className="grid gap-4 lg:grid-cols-[15rem_1fr]">
        <nav aria-label="Stages" className="space-y-1">
          {STAGES.map((s) => (
            <button key={s.id} type="button" onClick={() => { setParams({ stage: s.id }); setTab("guide"); }} aria-current={s.id === stage.id}
              className={cn("flex w-full items-start gap-2 rounded-md px-3 py-2 text-left text-sm", s.id === stage.id ? "bg-primary-soft text-primary" : "text-fg-2 hover:bg-hover")}>
              {stageDone(s) ? <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-ok" /> : <Circle size={15} className="mt-0.5 shrink-0" />}
              <span><span className="font-mono text-[11px]">STAGE {String(s.number).padStart(2, "0")}</span><br />{s.title}</span>
            </button>
          ))}
        </nav>
        <div className="min-w-0">
          <Card className="p-4">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-semibold">Stage {stage.number}: {stage.title}</h2>
              <Badge tone={stage.sourceKind === "university" ? "primary" : "violet"}>{stage.sourceKind === "university" ? "University-derived" : "Supplementary"}</Badge>
            </div>
            <p className="mt-1 text-xs text-fg-3">Based on: {stage.basedOn}</p>
            <p className="mt-2 text-sm text-fg-2">{stage.summary}</p>
            <ul className="mt-3 list-disc space-y-0.5 pl-5 text-sm text-fg-2">{stage.objectives.map((o) => <li key={o}>{o}</li>)}</ul>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button variant="primary" onClick={() => open(stage.starter, "starter")}><Code2 size={14} /> Open starter in playground</Button>
              <span className="self-center text-xs text-fg-3">{todosDone}/{stage.todos.length} TODOs done</span>
            </div>
          </Card>

          <Tabs className="mt-4" value={tab} onChange={setTab} tabs={[
            { id: "guide", label: "Guided implementation" },
            { id: "starter", label: "Starter files" },
            { id: "reference", label: <span className="inline-flex items-center gap-1">{!refUnlocked[stage.id] && <Lock size={12} />} Reference</span> },
            { id: "check", label: "Knowledge check" },
          ]} />

          <div className="mt-4 space-y-4">
            {tab === "guide" && (
              <>
                <Card className="p-4"><h3 className="mb-2 text-sm font-semibold">Architecture</h3><Markdown>{stage.architecture}</Markdown></Card>
                {stage.steps.map((st, i) => (
                  <Card key={i} className="p-4">
                    <h3 className="mb-2 text-sm font-semibold"><span className="mr-2 font-mono text-primary">{i + 1}</span>{st.title}</h3>
                    <Markdown>{st.body}</Markdown>
                  </Card>
                ))}
                <Card className="p-4">
                  <h3 className="mb-2 text-sm font-semibold">Your TODOs</h3>
                  <ul className="space-y-1">
                    {stage.todos.map((t, i) => (
                      <li key={i}>
                        <button type="button" onClick={() => toggle(todoIds[i])} className="flex w-full items-start gap-2 rounded px-1 py-1 text-left text-sm hover:bg-hover">
                          {checklist[todoIds[i]] ? <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-ok" /> : <Circle size={15} className="mt-0.5 shrink-0 text-fg-3" />}
                          <Markdown className="text-sm">{t}</Markdown>
                        </button>
                      </li>
                    ))}
                  </ul>
                </Card>
                <Card className="p-4"><h3 className="mb-2 text-sm font-semibold">Expected behaviour</h3><Markdown>{stage.expectedBehavior}</Markdown></Card>
                <Card className="p-4">
                  <h3 className="mb-2 text-sm font-semibold">Common mistakes</h3>
                  <ul className="space-y-2">{stage.mistakes.map((m, i) => <li key={i} className="text-sm"><span className="text-err">✗</span> <Markdown className="inline text-sm">{m.mistake}</Markdown><div className="pl-4 text-fg-2"><span className="text-ok">✓</span> <Markdown className="inline text-sm">{m.fix}</Markdown></div></li>)}</ul>
                </Card>
              </>
            )}
            {tab === "starter" && Object.entries(stage.starter.files).map(([path, code]) => <CodeBlock key={path} title={path} code={code} language={langOf(path)} runnable={false} />)}
            {tab === "reference" && (
              refUnlocked[stage.id] ? (
                <>
                  <Button onClick={() => open(stage.reference, "reference")}><Code2 size={14} /> Run the reference in the playground</Button>
                  {Object.entries(stage.reference.files).map(([path, code]) => <CodeBlock key={path} title={path} code={code} language={langOf(path)} runnable={false} />)}
                </>
              ) : (
                <Callout tone="neutral" title="Try the stage first">
                  The reference implementation is hidden while you work on the TODOs.{" "}
                  <Button size="sm" className="ml-2" onClick={() => setRefUnlocked((r) => ({ ...r, [stage.id]: true }))}>I've attempted it — show reference</Button>
                </Callout>
              )
            )}
            {tab === "check" && (
              <>
                {stage.knowledgeCheck.map((k, i) => (
                  <Card key={i} className="p-4">
                    <Markdown>{k.question}</Markdown>
                    <details className="mt-2"><summary className="cursor-pointer text-sm text-primary">Show answer</summary><Markdown className="mt-2 text-sm">{k.answer}</Markdown></details>
                  </Card>
                ))}
                <div className="flex flex-wrap gap-2">
                  {stage.lessons.map((id) => lessonById(id) && <Link key={id} to={`/lesson/${id}`} className="rounded border border-line px-2 py-1 text-xs text-fg-2 hover:border-primary hover:text-primary">{lessonById(id)!.title}</Link>)}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
