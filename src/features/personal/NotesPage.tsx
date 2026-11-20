import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useProgressStore, type Note } from "@/stores/progressStore";
import { Button, Card, EmptyState, PageHeader } from "@/components/ui/primitives";
import { Markdown } from "@/components/ui/Markdown";
import { formatDate } from "@/lib/dates";

export default function NotesPage() {
  const notes = useProgressStore((s) => s.notes);
  const { upsertNote, deleteNote } = useProgressStore.getState();
  const [editing, setEditing] = useState<Note | null>(null);
  const [preview, setPreview] = useState(false);

  const save = () => {
    if (!editing) return;
    upsertNote({ ...editing, title: editing.title.trim() || "Untitled note", updatedAt: Date.now() });
    setEditing(null);
  };

  return (
    <div>
      <PageHeader eyebrow="Personal" title="Notes" description="Your own notes (markdown supported). Stored locally in this browser and included in progress export." actions={<Button variant="primary" onClick={() => setEditing({ id: `note-${Date.now()}`, title: "", body: "", updatedAt: Date.now() })}><Plus size={14} /> New note</Button>} />
      {editing && (
        <Card className="mb-4 p-4">
          <label className="text-xs text-fg-2" htmlFor="note-title">Title</label>
          <input id="note-title" value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="mb-3 mt-1 h-9 w-full rounded-md border border-line bg-elevated px-3 text-sm text-fg" />
          <div className="mb-1 flex items-center justify-between"><label className="text-xs text-fg-2" htmlFor="note-body">Note</label><button type="button" className="text-xs text-primary" onClick={() => setPreview((p) => !p)}>{preview ? "Edit" : "Preview"}</button></div>
          {preview ? <div className="min-h-40 rounded-md border border-line p-3"><Markdown>{editing.body || "_Empty_"}</Markdown></div> :
            <textarea id="note-body" rows={10} value={editing.body} onChange={(e) => setEditing({ ...editing, body: e.target.value })} className="w-full rounded-md border border-line bg-elevated p-3 font-mono text-sm text-fg" />}
          <div className="mt-3 flex justify-end gap-2"><Button onClick={() => setEditing(null)}>Cancel</Button><Button variant="primary" onClick={save}>Save</Button></div>
        </Card>
      )}
      {notes.length === 0 && !editing ? <EmptyState title="No notes yet">Capture explanations in your own words — it's one of the best ways to remember.</EmptyState> : (
        <div className="grid gap-3 md:grid-cols-2">
          {notes.map((n) => (
            <Card key={n.id} className="p-4">
              <div className="flex items-start justify-between gap-2">
                <button type="button" className="text-left font-medium hover:text-primary" onClick={() => setEditing(n)}>{n.title}</button>
                <Button size="sm" variant="ghost" aria-label="Delete note" onClick={() => window.confirm("Delete this note?") && deleteNote(n.id)}><Trash2 size={13} /></Button>
              </div>
              <p className="text-[11px] text-fg-3">{formatDate(n.updatedAt, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</p>
              <div className="mt-2 max-h-40 overflow-hidden"><Markdown className="text-sm">{n.body}</Markdown></div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
