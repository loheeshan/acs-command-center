import { useNavigate } from "react-router-dom";
import { Play, Trash2 } from "lucide-react";
import { useProgressStore } from "@/stores/progressStore";
import { Button, Card, EmptyState, PageHeader } from "@/components/ui/primitives";
import { openInPlayground } from "@/features/playground/handoff";
import { formatDate } from "@/lib/dates";

export default function SavedPage() {
  const snippets = useProgressStore((s) => s.snippets);
  const del = useProgressStore((s) => s.deleteSnippet);
  const navigate = useNavigate();
  const open = (code: string, title: string) => {
    try {
      const proj = JSON.parse(code) as { files: Record<string, string>; entry: string };
      openInPlayground({ code: "", language: "tsx", title, files: proj.files, entry: proj.entry, instructions: `Saved project **${title}** restored with all its files.` });
    } catch {
      openInPlayground({ code, language: "tsx", title });
    }
    navigate("/lab/playground");
  };
  return (
    <div>
      <PageHeader eyebrow="Personal" title="Saved Examples" description="Projects saved from the Code Playground (stored locally)." />
      {snippets.length === 0 ? <EmptyState title="Nothing saved yet">Use <strong>Save</strong> in the Code Playground to keep an experiment.</EmptyState> : (
        <div className="grid gap-3 md:grid-cols-2">
          {snippets.map((s) => {
            let files: string[] = [];
            try { files = Object.keys((JSON.parse(s.code) as { files: Record<string, string> }).files); } catch { /* plain snippet */ }
            return (
              <Card key={s.id} className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div><h3 className="font-medium">{s.title}</h3><p className="text-[11px] text-fg-3">{formatDate(s.updatedAt, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}{files.length ? ` · ${files.join(", ")}` : ""}</p></div>
                  <div className="flex gap-1">
                    <Button size="sm" onClick={() => open(s.code, s.title)}><Play size={12} /> Open</Button>
                    <Button size="sm" variant="ghost" aria-label="Delete" onClick={() => window.confirm("Delete this saved example?") && del(s.id)}><Trash2 size={13} /></Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
