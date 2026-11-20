import { useState } from "react";
import { Link, NavLink, Route, Routes } from "react-router-dom";
import { CheckCircle2, Circle, Plus, Trash2 } from "lucide-react";
import { useProgressStore, type CourseworkRequirement } from "@/stores/progressStore";
import { Badge, Button, Callout, Card, PageHeader, ProgressBar } from "@/components/ui/primitives";
import { useNow } from "@/hooks/useNow";
import { DATES, formatCountdown } from "@/lib/dates";
import { cn } from "@/lib/cn";

/** Recommended (NOT confirmed) checklists — the coursework specification was not supplied. */
const CHECKLISTS: { id: string; title: string; lesson?: string; items: string[] }[] = [
  { id: "arch", title: "Architecture", lesson: "arch-project-structure", items: [
    "Folders separated by responsibility (pages, components, services, hooks, stores, types)",
    "API base URL read from import.meta.env (VITE_API_URL), not hard-coded in components",
    "One service module per backend resource (events, categories, bookings, reviews, auth)",
    "TypeScript interfaces match the backend DTOs (string? → string | null, DateTime → string)",
  ]},
  { id: "routing", title: "Routing", lesson: "router-nested-layouts-outlet", items: [
    "Shared layout with <Outlet /> for navbar/footer",
    "Dynamic routes (e.g. /events/:id) validate and convert params",
    "Catch-all * not-found route",
    "Protected routes redirect to /login and back after login",
    "Admin-only routes check role (UX only — server still enforces)",
  ]},
  { id: "state", title: "State management", lesson: "state-kinds", items: [
    "Server data via TanStack Query with sensible query keys",
    "Mutations invalidate the affected queries",
    "Shared client state (auth/theme/cart) in Zustand with selectors",
    "Derived values computed, not duplicated in state",
    "Search/filter state in the URL where it should be shareable",
  ]},
  { id: "auth", title: "Authentication", lesson: "sec-401-403-expiry", items: [
    "Register → login flow (register returns no token in CampusEvents)",
    "Authorization: Bearer header on protected requests",
    "401 clears auth state and redirects to login; 403 shows a permission message",
    "Token expiry (exp) handled",
    "Logout clears all user-specific cached data",
  ]},
  { id: "forms", title: "Forms & CRUD", lesson: "crud-post-put-delete", items: [
    "Create/edit share a reusable form",
    "Client-side validation with clear, accessible messages",
    "Server 400 messages shown to the user",
    "Submit disabled while pending (no duplicate submissions)",
    "Delete asks for confirmation and handles 'has bookings' 400",
    "204 responses are not parsed as JSON",
  ]},
  { id: "ui", title: "Responsive & accessible UI", lesson: "a11y-focus-keyboard", items: [
    "Layout works from 375px to desktop",
    "All inputs have associated labels",
    "Keyboard navigation works; visible :focus-visible styles",
    "Loading, empty and error states on every data view",
    "Colour is not the only indicator of state; adequate contrast",
  ]},
  { id: "testing", title: "Testing", lesson: "testing-vitest-rtl", items: [
    "Unit tests for validation and pure helpers",
    "Component tests with React Testing Library (queries by role/label)",
    "API calls mocked (fetch mock or MSW)",
    "Tests for loading, error and form-submission flows",
  ]},
  { id: "submit", title: "Submission readiness", items: [
    "npm run build succeeds with no TypeScript errors",
    "README explains setup (backend URL, env vars, scripts)",
    "No secrets committed; .env.example provided",
    "Re-read the official specification and marking criteria against your app",
    "Submitted on Blackboard before 7 Jan 2027, 1:00 PM",
  ]},
];

const PLANNER: { key: string; title: string; hint: string }[] = [
  { key: "routes", title: "Route planner", hint: "One line per route: path → page component (layout? protected? role?)\n/ → Home\n/events → EventsPage\n/events/:id → EventDetails\n/admin/events/new → EventNew (ADMIN)" },
  { key: "endpoints", title: "API endpoint mapping", hint: "Endpoint → service function → hook → component\nGET /api/events → getEvents() → useEvents() → EventsPage" },
  { key: "components", title: "Component planner", hint: "Reusable components and their props\nEventCard { title, location, price }\nEventForm { initialValues, onSubmit }" },
  { key: "state", title: "State management plan", hint: "Which state lives where and why\nevents list → TanStack Query ['events']\nauth user/token → Zustand (persist?)\nsearch filters → URL" },
];

function Checklists() {
  const checked = useProgressStore((s) => s.checklist);
  const toggle = useProgressStore((s) => s.toggleChecklist);
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {CHECKLISTS.map((c) => {
        const ids = c.items.map((_, i) => `${c.id}-${i}`);
        const done = ids.filter((id) => checked[id]).length;
        return (
          <Card key={c.id} className="p-4">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-semibold">{c.title}</h3>
              <span className="text-xs text-fg-3">{done}/{ids.length}</span>
            </div>
            <ProgressBar value={done} max={ids.length} tone="success" label={c.title} />
            <ul className="mt-3 space-y-1">
              {c.items.map((item, i) => (
                <li key={i}>
                  <button type="button" onClick={() => toggle(ids[i])} className="flex w-full items-start gap-2 rounded px-1 py-1 text-left text-sm hover:bg-hover">
                    {checked[ids[i]] ? <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-ok" /> : <Circle size={15} className="mt-0.5 shrink-0 text-fg-3" />}
                    <span className={cn(checked[ids[i]] ? "text-fg-3 line-through" : "text-fg-2")}>{item}</span>
                  </button>
                </li>
              ))}
            </ul>
            {c.lesson && <Link to={`/lesson/${c.lesson}`} className="mt-2 inline-block text-xs text-primary hover:underline">How to implement this →</Link>}
          </Card>
        );
      })}
    </div>
  );
}

function Requirements() {
  const reqs = useProgressStore((s) => s.requirements);
  const { upsertRequirement, deleteRequirement } = useProgressStore.getState();
  const [text, setText] = useState("");
  const [source, setSource] = useState("");
  const add = () => {
    if (!text.trim()) return;
    upsertRequirement({ id: `req-${Date.now()}`, text: text.trim(), source: source.trim(), status: "todo" });
    setText("");
    setSource("");
  };
  const cycle = (r: CourseworkRequirement) => upsertRequirement({ ...r, status: r.status === "todo" ? "in-progress" : r.status === "in-progress" ? "done" : "todo" });
  return (
    <div>
      <Callout tone="warning" title="Only confirmed requirements belong here">
        Copy each requirement from the official coursework specification (with its section reference) so this list stays source-linked. The app never invents assessment criteria.
      </Callout>
      <Card className="mt-4 p-4">
        <div className="grid gap-2 sm:grid-cols-[1fr_10rem_auto]">
          <label className="sr-only" htmlFor="req-text">Requirement</label>
          <input id="req-text" value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && add()} placeholder="Requirement text from the specification" className="h-9 rounded-md border border-line bg-elevated px-3 text-sm text-fg" />
          <label className="sr-only" htmlFor="req-src">Source</label>
          <input id="req-src" value={source} onChange={(e) => setSource(e.target.value)} placeholder="Spec section" className="h-9 rounded-md border border-line bg-elevated px-3 text-sm text-fg" />
          <Button variant="primary" onClick={add}><Plus size={14} /> Add</Button>
        </div>
        {reqs.length === 0 ? <p className="mt-4 text-sm text-fg-3">No requirements added yet.</p> : (
          <ul className="mt-4 divide-y divide-line">
            {reqs.map((r) => (
              <li key={r.id} className="flex items-center gap-3 py-2 text-sm">
                <button type="button" onClick={() => cycle(r)} aria-label={`Status: ${r.status}. Click to change.`}>
                  <Badge tone={r.status === "done" ? "success" : r.status === "in-progress" ? "warning" : "neutral"}>{r.status}</Badge>
                </button>
                <span className="flex-1">{r.text}</span>
                {r.source && <span className="text-xs text-fg-3">{r.source}</span>}
                <Button size="sm" variant="ghost" aria-label="Delete requirement" onClick={() => deleteRequirement(r.id)}><Trash2 size={13} /></Button>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

function Planner() {
  const planner = useProgressStore((s) => s.planner);
  const setPlanner = useProgressStore((s) => s.setPlanner);
  return (
    <div className="grid gap-3 lg:grid-cols-2">
      {PLANNER.map((p) => (
        <Card key={p.key} className="p-4">
          <label htmlFor={`pl-${p.key}`} className="text-sm font-semibold">{p.title}</label>
          <textarea id={`pl-${p.key}`} rows={9} value={planner[p.key] ?? ""} placeholder={p.hint} onChange={(e) => setPlanner(p.key, e.target.value)} className="mt-2 w-full rounded-md border border-line bg-elevated p-3 font-mono text-xs text-fg placeholder:text-fg-3" />
        </Card>
      ))}
    </div>
  );
}

export default function CourseworkPage() {
  const now = useNow(60_000);
  const deadline = new Date(DATES.courseworkDeadline).getTime();
  const tab = (to: string, label: string) => (
    <NavLink to={to} end className={({ isActive }) => cn("-mb-px border-b-2 px-3 py-2 text-sm", isActive ? "border-primary font-medium text-fg" : "border-transparent text-fg-2 hover:text-fg")}>{label}</NavLink>
  );
  return (
    <div>
      <PageHeader
        eyebrow="Coursework · 60% · qualifying mark 30/100"
        title="Coursework Workspace"
        description={`Final practical web application — due 7 January 2027 at 1:00 PM (${now < deadline ? `${formatCountdown(deadline - now)} left` : "deadline passed"}). Holiday 14 Dec – 1 Jan.`}
      />
      <Callout tone="neutral" title="Specification not supplied">
        The coursework specification wasn't in the uploaded materials. Checklists below are <strong>recommendations</strong> based on the module's teaching (CampusEvents backend, Weeks 1–5) and professional practice — not confirmed academic requirements. Add the official requirements in the Requirements Tracker.
      </Callout>
      <nav className="mb-4 mt-4 flex gap-1 overflow-x-auto border-b border-line">
        {tab("/coursework", "Recommended checklists")}
        {tab("/coursework/requirements", "Requirements tracker")}
        {tab("/coursework/planner", "Application planner")}
      </nav>
      <Routes>
        <Route index element={<Checklists />} />
        <Route path="requirements" element={<Requirements />} />
        <Route path="planner" element={<Planner />} />
      </Routes>
      <p className="mt-6 text-xs text-fg-3">Need to see the progressive build? The <Link to="/lab/campus-events" className="text-primary">CampusEvents Lab</Link> walks through every stage with guided TODOs.</p>
    </div>
  );
}
