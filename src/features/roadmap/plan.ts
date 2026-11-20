export interface StudyTask {
  id: string;
  title: string;
  minutes: number;
  priority: 1 | 2 | 3;
  kind: "lesson" | "practice" | "exam" | "revision" | "break";
  to: string;
}
export interface StudyDay {
  date: string;
  theme: string;
  defaultHours: number;
  note?: string;
  tasks: StudyTask[];
}

const L = (id: string, title: string, minutes: number, priority: 1 | 2 | 3 = 1): StudyTask => ({ id: `l:${id}`, title, minutes, priority, kind: "lesson", to: `/lesson/${id}` });
const P = (id: string, title: string, minutes: number, to: string, priority: 1 | 2 | 3 = 1, kind: StudyTask["kind"] = "practice"): StudyTask => ({ id, title, minutes, priority, kind, to });

export const STUDY_PLAN: StudyDay[] = [
  { date: "2026-11-20", theme: "Web, HTML, CSS & JavaScript", defaultHours: 4, tasks: [
    P("d1-diag", "Baseline diagnostic: 15-question mixed quiz", 20, "/assess/quiz"),
    L("web-how-the-web-works", "How the web works (HTTP, URLs)", 25, 2),
    L("css-grid", "CSS Grid: template areas & minmax()", 30),
    L("css-responsive-clamp", "Responsive CSS & clamp()", 25),
    L("a11y-focus-keyboard", ":focus-visible & accessibility", 20),
    L("js-spread-rest-destructuring", "Modern JS syntax", 30),
    L("js-array-methods", "Array methods (find vs filter)", 35),
    L("js-array-reduce", "reduce() — basket totals", 30),
    L("html-semantic-forms", "Semantic HTML & forms", 20, 3),
  ]},
  { date: "2026-11-21", theme: "JavaScript & TypeScript", defaultHours: 5, tasks: [
    L("js-promises-async", "Promises, async/await, Promise.all", 40),
    L("js-event-loop", "Event loop & output prediction", 30),
    L("ts-basics-interfaces", "Interfaces, type aliases, optional props", 35),
    L("ts-unions-narrowing", "Union types & narrowing", 30),
    L("ts-typed-api-data", "Typing API data", 25, 2),
    P("d2-ch", "Coding challenges: JS + TS (3–4)", 45, "/assess/challenges"),
    L("js-references-copies", "References & shallow copies", 25, 2),
    L("ts-generics-utility", "Generics & utility types", 25, 3),
  ]},
  { date: "2026-11-22", theme: "React & React Router", defaultHours: 5, tasks: [
    L("react-state-events", "State & events", 30),
    L("react-conditional-rendering", "Conditional rendering", 20),
    L("react-useeffect", "useEffect, dependencies & cleanup", 40),
    L("react-custom-hooks", "Custom hooks & Rules of Hooks", 25),
    L("router-nested-layouts-outlet", "Nested layouts & Outlet", 30),
    L("router-dynamic-params", "useParams & dynamic routes", 20),
    L("router-navigation", "useNavigate & Link", 20),
    L("router-search-params", "useSearchParams", 15),
    P("d3-d1", "Section D1 practice: write the student-management routes", 25, "/lab/playground?preset=router-layout"),
    L("react-rendering-snapshots", "Rendering & state snapshots", 25, 2),
  ]},
  { date: "2026-11-23", theme: "REST APIs, Forms, CRUD + state management", defaultHours: 7, tasks: [
    L("http-methods-status", "HTTP methods & status codes (A5, A13, B5, B10, C5)", 30),
    L("http-fetch-response-ok", "fetch & response.ok", 20),
    L("http-abortcontroller", "AbortController & cleanup (D2)", 30),
    L("http-service-modules", "API service modules (A19, D2c)", 15),
    L("forms-validation", "Validation functions (D3a)", 30),
    L("crud-post-put-delete", "POST vs PUT vs DELETE (D3b/c)", 25),
    P("d4-d2", "Section D2/D3 drill in the playground", 40, "/lab/playground?preset=forms-create-event"),
    L("state-kinds", "Client vs server state (D4a)", 20),
    L("zustand-basics", "Zustand stores (A12)", 20),
    L("zustand-selectors", "Zustand selectors (B7, D4d)", 15),
    L("tq-stale-gc", "staleTime vs gcTime (A11)", 20),
    L("tq-mutations-invalidation", "invalidateQueries (A15, C4, D4c)", 20),
    L("tq-usequery-keys", "useQuery & query keys", 20, 2),
    L("forms-controlled-inputs", "Controlled inputs", 15, 2),
    L("http-cors", "CORS", 15, 3),
  ]},
  { date: "2026-11-24", theme: "Security + full timed mock + repair", defaultHours: 7, tasks: [
    L("sec-authn-authz", "Authentication vs authorisation (E2)", 15),
    L("sec-401-403-expiry", "401 vs 403 & expired JWTs (E1, B15)", 20),
    L("sec-trust-boundaries", "Trust boundaries, HTTPS, untrusted data (E3–E5)", 20),
    P("d5-mock", "Original mock ICT — timed 90 min, exam conditions", 95, "/assess/mock", 1, "exam"),
    P("d5-break", "Break", 15, "/", 1, "break"),
    P("d5-review", "Review every mistake in Results; revise linked lessons", 45, "/assess/results", 1, "revision"),
    P("d5-weak", "Weak-topic quiz", 30, "/assess/quiz", 1),
    P("d5-mock2", "Practice mock 1 — timed (if energy allows)", 95, "/assess/exams", 2, "exam"),
    L("sec-jwt-anatomy", "JWT anatomy", 15, 2),
  ]},
  { date: "2026-11-25", theme: "EXAM DAY — ICT 15:30–17:30 · light revision until 14:30", defaultHours: 3, note: "No new topics. Stop revising by 14:30, eat, and arrive early.", tasks: [
    P("d6-last", "Last-minute ICT sheet", 30, "/revision/last-minute", 1, "revision"),
    P("d6-flash", "Flashcards: ICT priority deck", 25, "/flashcards?deck=priority", 1, "revision"),
    P("d6-patterns", "Write from memory: route config, fetch+useEffect+AbortController, validation fn, useQuery+invalidate, Zustand store", 40, "/revision", 1, "revision"),
    P("d6-status", "HTTP status codes & security terms", 15, "/revision", 1, "revision"),
    P("d6-mistakes", "Re-read your mock mistakes", 20, "/assess/results", 2, "revision"),
  ]},
];

/** Fit tasks into the available minutes, highest priority first, keeping plan order within a priority. */
export function scheduleDay(day: StudyDay, hours: number) {
  const budget = hours * 60;
  const ordered = [...day.tasks].map((t, i) => ({ t, i })).sort((a, b) => a.t.priority - b.t.priority || a.i - b.i);
  let used = 0;
  const planned = new Set<string>();
  for (const { t } of ordered) if (used + t.minutes <= budget) { used += t.minutes; planned.add(t.id); }
  return {
    planned: day.tasks.filter((t) => planned.has(t.id)),
    overflow: day.tasks.filter((t) => !planned.has(t.id)),
    usedMinutes: used,
  };
}
