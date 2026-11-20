import { useEffect, useRef, useState } from "react";
import { Pencil, Plus, Trash2, ListOrdered } from "lucide-react";
import { Badge, Button, Callout, Card, CardHeader } from "@/components/ui/primitives";
import { cn } from "@/lib/cn";
import { Pre, SimBanner, StepControls, inputCls, labelCls, useMarkOnce, useStepper } from "./shared";

interface Ev { id: number; title: string; location: string; capacity: number; hasBookings: boolean }
type Force = "none" | "400" | "401" | "403" | "404" | "500";
type Op = { kind: "create" | "update" | "delete"; id?: number; data?: Omit<Ev, "id" | "hasBookings"> };
interface PStep { label: string; text: string; tone: "primary" | "success" | "error" | "warning" }

const SEED: Ev[] = [
  { id: 1, title: "Intro to React Workshop", location: "Cavendish C1.04", capacity: 40, hasBookings: false },
  { id: 2, title: "Campus Hackathon", location: "Marylebone Hall", capacity: 120, hasBookings: true },
  { id: 3, title: "Careers Fair", location: "Regent St Atrium", capacity: 300, hasBookings: false },
];
const HANDLE: Record<number, string> = {
  400: "Show the server's validation errors next to the fields; keep the form open with the user's input.",
  401: "Token missing/expired → clear auth state and navigate('/login').",
  403: "Show 'You don't have permission'. Don't retry, don't log out.",
  404: "The event no longer exists → show a message and refresh the list.",
  500: "Show a generic error toast ('Something went wrong, try again'). Keep the form data.",
};

function validate(d: { title: string; location: string; capacity: string }) {
  const e: Record<string, string> = {};
  if (!d.title.trim()) e.title = "Title is required";
  if (!d.location.trim()) e.location = "Location is required";
  const n = Number(d.capacity);
  if (!Number.isInteger(n) || n < 1) e.capacity = "Capacity must be a positive whole number";
  return e;
}

export default function CrudSimulatorViz() {
  const mark = useMarkOnce("crud-simulator");
  const [events, setEvents] = useState<Ev[]>(SEED);
  const [form, setForm] = useState({ title: "", location: "", capacity: "" });
  const [editing, setEditing] = useState<number | null>(null);
  const [force, setForce] = useState<Force>("none");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pipeline, setPipeline] = useState<PStep[]>([{ label: "Idle", text: "Create, edit or delete an event to see each step.", tone: "primary" }]);
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const pending = useRef<(() => void) | null>(null);
  const s = useStepper(pipeline.length, mark);

  // UI update happens only once the pipeline reaches its last step (= the response has arrived)
  useEffect(() => {
    if (s.step === pipeline.length - 1 && pending.current) {
      pending.current();
      pending.current = null;
    }
  }, [s.step, pipeline.length]);

  const run = (op: Op) => {
    const method = op.kind === "create" ? "POST" : op.kind === "update" ? "PUT" : "DELETE";
    const url = `/api/events${op.id ? `/${op.id}` : ""}`;
    const steps: PStep[] = [];
    if (op.kind !== "delete") steps.push({ label: "1. Client validation", text: "Passed — fields filled, capacity is a positive integer (UX only; the server validates again).", tone: "success" });
    else steps.push({ label: "1. Confirm", text: `window.confirm("Delete event #${op.id}?") → OK`, tone: "success" });
    steps.push({ label: "2. Request", text: `${method} ${url} HTTP/1.1\nAuthorization: Bearer <admin token>${op.data ? `\nContent-Type: application/json\n\n${JSON.stringify({ ...op.data }, null, 2)}` : ""}`, tone: "primary" });
    const target = op.id ? events.find((e) => e.id === op.id) : undefined;
    let status = op.kind === "create" ? 201 : 204;
    if (force !== "none") status = Number(force);
    else if (op.kind === "delete" && target?.hasBookings) status = 400;
    const ok = status < 300;
    const body = status === 201 ? JSON.stringify({ id: Math.max(...events.map((e) => e.id), 0) + 1, ...op.data }, null, 2)
      : status === 400 && op.kind === "delete" ? `{ "message": "Cannot delete an event that has bookings or reviews." }`
        : status === 400 ? `{ "title": "One or more validation errors occurred.", "status": 400,\n  "errors": { "Title": ["The Title field is required."] } }`
          : status === 204 ? "(empty — don't call response.json())" : status >= 400 ? "(error body / problem details)" : "";
    steps.push({ label: "3. Response", text: `HTTP/1.1 ${status}\n\n${body}`, tone: ok ? "success" : "error" });
    if (ok) {
      steps.push({
        label: "4. UI update (only after success)",
        text: op.kind === "create" ? "Add/refresh the list (or navigate to the new event's page). Clear the form."
          : op.kind === "update" ? "204 has no body → refetch the list (or navigate back to the detail page)."
            : "Remove the row / refetch the list. Never remove it before the server confirms.",
        tone: "success",
      });
      pending.current = () => {
        setEvents((evs) => op.kind === "create" ? [...evs, { id: Math.max(...evs.map((e) => e.id), 0) + 1, hasBookings: false, ...op.data! }]
          : op.kind === "update" ? evs.map((e) => (e.id === op.id ? { ...e, ...op.data! } : e)) : evs.filter((e) => e.id !== op.id));
        if (op.kind !== "delete") { setForm({ title: "", location: "", capacity: "" }); setEditing(null); }
      };
    } else {
      steps.push({ label: "4. Handle the error", text: (status === 400 && op.kind === "delete" ? "Explain that events with bookings can't be deleted. " : "") + HANDLE[status] + " The list is NOT changed.", tone: "warning" });
      pending.current = null;
    }
    setPipeline(steps);
    s.restart();
    setTimeout(() => s.toggle(), 0);
    mark();
  };

  const submit = () => {
    const e = validate(form);
    setErrors(e);
    if (Object.keys(e).length) {
      setPipeline([{ label: "1. Client validation", text: `Failed: ${Object.values(e).join("; ")}. No request is sent.`, tone: "error" }]);
      s.restart();
      mark();
      return;
    }
    const data = { title: form.title.trim(), location: form.location.trim(), capacity: Number(form.capacity) };
    run(editing ? { kind: "update", id: editing, data } : { kind: "create", data });
  };

  const visible = pipeline.slice(0, s.step + 1);

  return (
    <div className="space-y-4">
      <SimBanner>The CampusEvents admin API is simulated; force an error status to practise handling it.</SimBanner>
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-fg-2">Force server response:</span>
        {(["none", "400", "401", "403", "404", "500"] as Force[]).map((f) => (
          <Button key={f} size="sm" variant={force === f ? "primary" : "secondary"} onClick={() => setForce(f)}>{f === "none" ? "Normal" : f}</Button>
        ))}
        <Button size="sm" variant="ghost" onClick={() => { setEvents(SEED); setPipeline([{ label: "Idle", text: "Reset.", tone: "primary" }]); }}>Reset data</Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Events (admin view)" subtitle="Event #2 has bookings" />
          <ul className="divide-y divide-line">
            {events.map((e) => (
              <li key={e.id} className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 text-sm">
                <span>#{e.id} <strong>{e.title}</strong> <span className="text-fg-3">· {e.location} · {e.capacity}</span>{e.hasBookings && <Badge tone="warning" className="ml-1">bookings</Badge>}</span>
                {confirmId === e.id ? (
                  <span className="flex items-center gap-1 text-xs">Delete?
                    <Button size="sm" variant="danger" onClick={() => { setConfirmId(null); run({ kind: "delete", id: e.id }); }}>Yes</Button>
                    <Button size="sm" onClick={() => setConfirmId(null)}>Cancel</Button>
                  </span>
                ) : (
                  <span className="flex gap-1">
                    <Button size="sm" variant="ghost" aria-label={`Edit ${e.title}`} onClick={() => { setEditing(e.id); setForm({ title: e.title, location: e.location, capacity: String(e.capacity) }); setErrors({}); }}><Pencil size={14} /></Button>
                    <Button size="sm" variant="ghost" aria-label={`Delete ${e.title}`} onClick={() => setConfirmId(e.id)}><Trash2 size={14} /></Button>
                  </span>
                )}
              </li>
            ))}
          </ul>
          <form className="space-y-2 border-t border-line p-3" onSubmit={(ev) => { ev.preventDefault(); submit(); }} noValidate>
            <div className="text-sm font-semibold text-fg">{editing ? `Edit event #${editing}` : "Create event"}</div>
            {(["title", "location", "capacity"] as const).map((f) => (
              <label key={f} className="block"><span className={labelCls}>{f[0].toUpperCase() + f.slice(1)}</span>
                <input className={cn(inputCls, errors[f] && "border-err")} value={form[f]} inputMode={f === "capacity" ? "numeric" : undefined}
                  onChange={(e) => setForm((x) => ({ ...x, [f]: e.target.value }))} aria-invalid={!!errors[f]} />
                {errors[f] && <span className="text-xs text-err">{errors[f]}</span>}
              </label>
            ))}
            <div className="flex gap-2">
              <Button type="submit" variant="primary">{editing ? <><Pencil size={14} /> Save (PUT)</> : <><Plus size={14} /> Create (POST)</>}</Button>
              {editing && <Button onClick={() => { setEditing(null); setForm({ title: "", location: "", capacity: "" }); }}>Cancel</Button>}
            </div>
          </form>
        </Card>

        <Card>
          <CardHeader icon={<ListOrdered size={16} />} title="What happened" subtitle="validate → request → status → UI update" />
          <div className="space-y-3 p-3">
            <StepControls s={s} />
            <ol className="space-y-2" aria-live="polite">
              {visible.map((p, i) => (
                <li key={i} className="rounded-md border border-line p-2.5">
                  <Badge tone={p.tone}>{p.label}</Badge>
                  {p.text.includes("\n") ? <Pre className="mt-1.5">{p.text}</Pre> : <p className="mt-1 text-sm text-fg-2">{p.text}</p>}
                </li>
              ))}
            </ol>
          </div>
        </Card>
      </div>
      <Callout tone="primary" title="The pattern">
        Validate → send → check <code>response.ok</code> → only then update the UI (refresh the list or navigate). On failure, keep the user's data and show a message that matches the status.
      </Callout>
    </div>
  );
}
