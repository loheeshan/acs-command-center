import { useRef, useState } from "react";
import { Download, Upload } from "lucide-react";
import { exportProgress, useProgressStore, type ProgressData } from "@/stores/progressStore";
import { LESSONS, CHALLENGES, FLASHCARDS } from "@/content";
import { MODULES } from "@/content/modules";
import { TOPIC_LABELS, type TopicId } from "@/content/types";
import { Button, Callout, Card, PageHeader, ProgressBar, Stat } from "@/components/ui/primitives";
import { VISUALIZERS } from "@/features/visualizers/registry";

export default function ProgressPage() {
  const s = useProgressStore();
  const fileRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState<{ tone: "success" | "error"; text: string } | null>(null);

  const doExport = () => {
    const blob = new Blob([JSON.stringify({ app: "acs-command-center", version: 1, exportedAt: new Date().toISOString(), progress: exportProgress() }, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `acs-progress-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const doImport = async (file: File) => {
    try {
      const data = JSON.parse(await file.text()) as { app?: string; progress?: Partial<ProgressData> };
      if (data.app !== "acs-command-center" || !data.progress || typeof data.progress !== "object") throw new Error("This is not an ACS Command Center progress file.");
      if (!Array.isArray(data.progress.attempts ?? []) || typeof (data.progress.completedLessons ?? {}) !== "object") throw new Error("The file is malformed.");
      if (!window.confirm("Replace your current progress with the imported file?")) return;
      s.importState(data.progress);
      setMsg({ tone: "success", text: "Progress imported." });
    } catch (e) {
      setMsg({ tone: "error", text: e instanceof Error ? e.message : "Import failed." });
    }
  };

  const topics = Object.keys(TOPIC_LABELS) as TopicId[];
  return (
    <div>
      <PageHeader eyebrow="Personal" title="Progress" description="Everything is stored locally in this browser (no account, no server). Export a backup or move it to another device." actions={<>
        <Button onClick={doExport}><Download size={14} /> Export</Button>
        <Button onClick={() => fileRef.current?.click()}><Upload size={14} /> Import</Button>
        <input ref={fileRef} type="file" accept="application/json" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) void doImport(f); e.target.value = ""; }} />
      </>} />
      {msg && <div className="mb-4"><Callout tone={msg.tone} title={msg.text}>{" "}</Callout></div>}
      <Card className="grid grid-cols-2 gap-4 p-4 md:grid-cols-5">
        <Stat label="Lessons completed" value={`${Object.keys(s.completedLessons).length}/${LESSONS.length}`} />
        <Stat label="Attempts recorded" value={s.attempts.length} />
        <Stat label="Challenges passed" value={`${Object.values(s.challenges).filter((c) => c.passed).length}/${CHALLENGES.length}`} />
        <Stat label="Flashcards reviewed" value={`${Object.keys(s.flashcards).length}/${FLASHCARDS.length}`} />
        <Stat label="Visualizers explored" value={`${Object.keys(s.completedVisualizers).length}/${VISUALIZERS.length}`} />
      </Card>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card className="p-4">
          <h2 className="mb-3 text-sm font-semibold">Module completion</h2>
          <div className="space-y-2">
            {MODULES.map((m) => {
              const ls = LESSONS.filter((l) => l.moduleId === m.id);
              if (!ls.length) return null;
              const d = ls.filter((l) => s.completedLessons[l.id]).length;
              return <div key={m.id} className="grid grid-cols-[10rem_1fr_3rem] items-center gap-2 text-xs"><span className="truncate text-fg-2">{m.title}</span><ProgressBar value={d} max={ls.length} tone="success" label={m.title} /><span className="text-right font-mono">{d}/{ls.length}</span></div>;
            })}
          </div>
        </Card>
        <Card className="p-4">
          <h2 className="mb-1 text-sm font-semibold">Self-rated confidence</h2>
          <p className="mb-3 text-xs text-fg-3">Kept separate from demonstrated performance (see Results).</p>
          <div className="space-y-1.5">
            {topics.map((t) => (
              <div key={t} className="flex items-center justify-between gap-2 text-sm">
                <span className="text-fg-2">{TOPIC_LABELS[t]}</span>
                <div role="radiogroup" aria-label={`Confidence in ${TOPIC_LABELS[t]}`} className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((v) => (
                    <button key={v} type="button" role="radio" aria-checked={s.confidence[t] === v} onClick={() => s.setConfidence(t, v)}
                      className={`h-6 w-6 rounded text-[11px] ${(s.confidence[t] ?? 0) >= v ? "bg-primary text-on-primary" : "bg-elevated text-fg-3"}`}>{v}</button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <div className="mt-6 border-t border-line pt-4">
        <Button variant="danger" onClick={() => window.confirm("Permanently erase ALL local progress (lessons, attempts, notes, flashcards)? Export first if unsure.") && s.reset()}>Reset all progress</Button>
      </div>
    </div>
  );
}
