export interface PlaygroundPreset {
  id: string;
  title: string;
  group: "JavaScript" | "TypeScript" | "React" | "React Router" | "REST & Forms" | "State" | "HTML & CSS";
  description: string;
  /** Markdown instructions / challenge shown in the left panel. */
  instructions: string;
  files: Record<string, string>;
  entry: string;
  /** Render the entry's default export into #root if the code does not render itself. */
  autoRender: boolean;
  /** Initially open file. */
  open?: string;
}

const MAIN = (component = "App") => `import { createRoot } from "react-dom/client";
import ${component} from "./${component}";
import "./styles.css";

createRoot(document.getElementById("root")!).render(<${component} />);
`;

const BASE_CSS = `body { font-family: system-ui, sans-serif; }
button { padding: 4px 10px; border: 1px solid #ccc; border-radius: 6px; background: #f4f4f5; }
button:hover { background: #e4e4e7; }
.card { border: 1px solid #e4e4e7; border-radius: 8px; padding: 10px 12px; margin: 8px 0; }
.error { color: #b91c1c; }
.muted { color: #71717a; }
`;

export const PRESETS: PlaygroundPreset[] = [
  {
    id: "js-array-methods",
    title: "Array methods & reduce()",
    group: "JavaScript",
    description: "map / filter / find / reduce on one product list. Watch which methods mutate.",
    instructions: `### Goal
Run the code and read the console output. Then:

1. Change \`find\` to \`filter\` and explain the difference in the output (mock B3).
2. Remove the \`0\` initial value from \`reduce\` — what changes? Why is the initial value important for an **empty** basket?
3. Notice that \`sort()\` **mutates** the original array while \`toSorted()\` does not.`,
    files: {
      "index.js": `const products = [
  { id: 1, name: "Keyboard", category: "tech", price: 45 },
  { id: 2, name: "Hoodie", category: "clothing", price: 30 },
  { id: 3, name: "Mouse", category: "tech", price: 25 },
  { id: 4, name: "Notebook", category: "stationery", price: 5 },
];

const names = products.map((p) => p.name);
console.log("map →", names);

const tech = products.filter((p) => p.category === "tech");
console.log("filter →", tech.map((p) => p.name));

const firstTech = products.find((p) => p.category === "tech");
console.log("find → first match only:", firstTech);

const total = products.reduce((sum, p) => sum + p.price, 0);
console.log("reduce → total:", total);

const emptyTotal = [].reduce((sum, p) => sum + p.price, 0);
console.log("reduce on empty basket:", emptyTotal);

const cheapestFirst = products.toSorted((a, b) => a.price - b.price);
console.log("toSorted (copy):", cheapestFirst.map((p) => p.price), "original:", products.map((p) => p.price));

products.sort((a, b) => b.price - a.price);
console.log("sort() mutated the original:", products.map((p) => p.price));
`,
    },
    entry: "index.js",
    autoRender: false,
  },
  {
    id: "js-event-loop",
    title: "Event loop: predict the order",
    group: "JavaScript",
    description: "Synchronous code, microtasks (promises) and tasks (setTimeout).",
    instructions: `### Predict before you run
Write down the order of the logs **before** pressing Run.

- Synchronous code runs first (call stack).
- Then **all** microtasks (promise reactions, code after \`await\`).
- Then the next task (e.g. a \`setTimeout\` callback).

Open **Visual Lab → Event loop** to step through it.`,
    files: {
      "index.js": `console.log("1: script start");

setTimeout(() => console.log("6: setTimeout callback (task)"), 0);

Promise.resolve()
  .then(() => console.log("3: promise.then (microtask)"))
  .then(() => console.log("5: second then (microtask)"));

async function load() {
  console.log("2: inside load(), before await");
  await null;
  console.log("4: after await (microtask)");
}
load();

console.log("2b: script end");
`,
    },
    entry: "index.js",
    autoRender: false,
  },
  {
    id: "ts-types",
    title: "Interfaces, unions & narrowing",
    group: "TypeScript",
    description: "Real TypeScript diagnostics appear under the editor. Types are erased before running.",
    instructions: `### Tasks
1. Look at the **Problems** list below the editor: TypeScript flags \`product.cost\` — fix it.
2. Add an optional \`description?: string\` to \`Product\` (mock C2).
3. In \`formatId\`, narrow the union with \`typeof\` so both branches type-check.

Note: the code still *runs* even with type errors — TypeScript checks at compile time only.`,
    files: {
      "index.ts": `interface Product {
  id: number;
  name: string;
  price: number;
}

type Id = string | number;

function formatId(id: Id): string {
  if (typeof id === "number") {
    return "#" + id.toFixed(0);
  }
  return id.toUpperCase();
}

const product: Product = { id: 1, name: "Keyboard", price: 45 };

console.log(formatId(42), formatId("abc"));
console.log("Cost:", product.cost); // ❌ TypeScript error: property does not exist

// Types are erased: this JSON is NOT validated at runtime.
const fromApi = JSON.parse('{"id":"oops","name":7}') as Product;
console.log("typeof fromApi.id at runtime:", typeof fromApi.id);
`,
    },
    entry: "index.ts",
    autoRender: false,
  },
  {
    id: "react-counter",
    title: "TicketCounter (state & events)",
    group: "React",
    description: "The CampusEvents TicketCounter from Week 02 — state, events and re-rendering.",
    instructions: `### Tasks
1. Add a maximum of 10 tickets (disable **+** at the limit).
2. Show the total price (\`price × tickets\`) as **derived state** — don't store it in another \`useState\`.
3. Click **Mutate directly** — the number doesn't update. Why? (React only re-renders when you call the state setter with a new value.)`,
    files: {
      "App.tsx": `import { useState } from "react";

interface TicketCounterProps {
  price: number;
}

function TicketCounter({ price }: TicketCounterProps) {
  const [tickets, setTickets] = useState(1);
  const state = { tickets };

  return (
    <div className="card">
      <button onClick={() => setTickets(Math.max(1, tickets - 1))}>-</button>
      <span style={{ margin: "0 12px" }}>{tickets}</span>
      <button onClick={() => setTickets(tickets + 1)}>+</button>
      <p className="muted">Price per ticket: £{price}</p>
      <button
        onClick={() => {
          state.tickets = state.tickets + 1; // ❌ mutation: no re-render
          console.log("Mutated local object to", state.tickets, "— but React did not re-render");
        }}
      >
        Mutate directly
      </button>
    </div>
  );
}

export default function App() {
  return (
    <main>
      <h2>Campus Tech Conference</h2>
      <TicketCounter price={15} />
    </main>
  );
}
`,
      "main.tsx": MAIN(),
      "styles.css": BASE_CSS,
    },
    entry: "main.tsx",
    autoRender: false,
    open: "App.tsx",
  },
  {
    id: "react-batching",
    title: "State snapshots & batching",
    group: "React",
    description: "Why setCount(count + 1) three times only adds one.",
    instructions: `### Experiment
- **+3 (snapshot)** calls \`setCount(count + 1)\` three times. Each call reads the **same snapshot** of \`count\`, so the result is +1.
- **+3 (updater)** queues \`c => c + 1\` three times; React applies them in order → +3.
- The render counter shows that all three updates are **batched** into one re-render.`,
    files: {
      "App.tsx": `import { useRef, useState } from "react";

export default function App() {
  const [count, setCount] = useState(0);
  const renders = useRef(0);
  renders.current += 1;

  function addThreeSnapshot() {
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
    console.log("count inside handler is still", count, "(snapshot)");
  }

  function addThreeUpdater() {
    setCount((c) => c + 1);
    setCount((c) => c + 1);
    setCount((c) => c + 1);
  }

  return (
    <main>
      <h2>Count: {count}</h2>
      <button onClick={addThreeSnapshot}>+3 (snapshot)</button>{" "}
      <button onClick={addThreeUpdater}>+3 (updater)</button>{" "}
      <button onClick={() => setCount(0)}>Reset</button>
      <p className="muted">Component has rendered {renders.current} time(s).</p>
    </main>
  );
}
`,
      "main.tsx": MAIN(),
      "styles.css": BASE_CSS,
    },
    entry: "main.tsx",
    autoRender: false,
    open: "App.tsx",
  },
  {
    id: "react-useeffect-fetch",
    title: "Service → Hook → Component (mock API)",
    group: "REST & Forms",
    description: "The Week 03 architecture with loading, error and empty states plus AbortController.",
    instructions: `### What's here
- \`eventService.ts\` — talks HTTP, checks \`response.ok\`.
- \`useEvents.ts\` — owns state + effect + **abort on cleanup**.
- \`App.tsx\` — only renders the four UI states.

The sandbox answers \`/api/events\` with a **mock API** (≈0.5 s latency).

### Try
1. Click **Simulate 500** then **Reload** → error state.
2. Click **Unmount** quickly after Reload → the request is aborted (see the Network tab).
3. Change the URL to \`/api/missing\` → 404 → how does \`response.ok\` handle it?`,
    files: {
      "types.ts": `export interface Event {
  id: number;
  title: string;
  location: string;
  price: number;
  availableTickets: number;
}
`,
      "eventService.ts": `import type { Event } from "./types";

const API_BASE_URL = "/api";

export async function getEvents(signal?: AbortSignal): Promise<Event[]> {
  const response = await fetch(\`\${API_BASE_URL}/events\`, { signal });
  if (!response.ok) {
    throw new Error(\`Failed to fetch events: \${response.status}\`);
  }
  return response.json();
}
`,
      "useEvents.ts": `import { useEffect, useState } from "react";
import { getEvents } from "./eventService";
import type { Event } from "./types";

export function useEvents(reloadKey: number) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");

    getEvents(controller.signal)
      .then(setEvents)
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === "AbortError") {
          console.log("Request aborted — no state update after unmount");
          return;
        }
        setError(err instanceof Error ? err.message : "Unknown error");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [reloadKey]);

  return { events, loading, error };
}
`,
      "EventList.tsx": `import { useEvents } from "./useEvents";

export default function EventList({ reloadKey }: { reloadKey: number }) {
  const { events, loading, error } = useEvents(reloadKey);

  if (loading) return <p>Loading events…</p>;
  if (error) return <p className="error" role="alert">{error}</p>;
  if (events.length === 0) return <p>No events found.</p>;

  return (
    <ul>
      {events.map((e) => (
        <li key={e.id} className="card">
          <strong>{e.title}</strong> — {e.location} — £{e.price}
          {e.availableTickets === 0 && <span className="error"> (sold out)</span>}
        </li>
      ))}
    </ul>
  );
}
`,
      "App.tsx": `import { useState } from "react";
import EventList from "./EventList";

export default function App() {
  const [show, setShow] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);
  return (
    <main>
      <h2>CampusEvents</h2>
      <button onClick={() => setReloadKey((k) => k + 1)}>Reload</button>{" "}
      <button onClick={() => mockApi.failNextRequest()}>Simulate 500</button>{" "}
      <button onClick={() => setShow((s) => !s)}>{show ? "Unmount" : "Mount"}</button>
      {show && <EventList reloadKey={reloadKey} />}
    </main>
  );
}
`,
      "main.tsx": MAIN(),
      "styles.css": BASE_CSS,
    },
    entry: "main.tsx",
    autoRender: false,
    open: "useEvents.ts",
  },
  {
    id: "router-layout",
    title: "Nested layout, Outlet & useParams",
    group: "React Router",
    description: "Mock D1: shared layout, /students/:studentId, programmatic navigation.",
    instructions: `### Mock ICT D1 in practice
- \`Layout\` renders the nav once and an \`<Outlet />\` where the matched child route appears.
- \`/students/:studentId\` → \`useParams()\` returns \`{ studentId: "42" }\` (a **string**).
- Settings uses \`useNavigate()\` to go back home after "saving".

> The sandbox uses **MemoryRouter** because the preview is an isolated document without a real address bar. In your app you use **BrowserRouter** — the \`Routes\`/\`Route\`/\`Outlet\` code is identical.`,
    files: {
      "App.tsx": `import { MemoryRouter, Routes, Route, Link, NavLink, Outlet, useParams, useNavigate, useLocation } from "react-router-dom";

function Layout() {
  const location = useLocation();
  return (
    <div>
      <div className="muted" style={{ fontFamily: "monospace" }}>URL: {location.pathname}{location.search}</div>
      <nav style={{ display: "flex", gap: 12, margin: "8px 0" }}>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/students">Students</NavLink>
        <NavLink to="/settings">Settings</NavLink>
      </nav>
      <hr />
      <Outlet />
    </div>
  );
}

function Home() {
  return <h2>Home</h2>;
}

function StudentList() {
  const students = [{ id: 42, name: "Ada" }, { id: 7, name: "Grace" }];
  return (
    <ul>
      {students.map((s) => (
        <li key={s.id}><Link to={\`/students/\${s.id}\`}>{s.name}</Link></li>
      ))}
    </ul>
  );
}

function StudentDetails() {
  const { studentId } = useParams();
  return <h2>Student ID: {studentId} (typeof: {typeof studentId})</h2>;
}

function Settings() {
  const navigate = useNavigate();
  function save() {
    console.log("Preferences saved");
    navigate("/");
  }
  return <button onClick={save}>Save preferences</button>;
}

export default function App() {
  return (
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="students" element={<StudentList />} />
          <Route path="students/:studentId" element={<StudentDetails />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<h2>Page not found</h2>} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}
`,
      "main.tsx": MAIN(),
      "styles.css": BASE_CSS + "a.active { font-weight: 700; }\n",
    },
    entry: "main.tsx",
    autoRender: false,
    open: "App.tsx",
  },
  {
    id: "forms-create-event",
    title: "Validated create-event form (mock D3)",
    group: "REST & Forms",
    description: "Controlled inputs, a validation function and a POST with JSON to the mock API.",
    instructions: `### Mock ICT D3
- \`validateEvent\` returns an **errors object** (empty = valid).
- \`createEvent\` sends \`POST /api/events\` with \`Content-Type: application/json\` and \`JSON.stringify\`.
- The mock API requires \`Authorization: Bearer …admin…\` (like CampusEvents' ADMIN role). Change the token to \`fake-user-token\` and observe **403**; remove the header and observe **401**.

Try submitting: empty name, \`0\` attendees, \`2.5\` attendees, then a valid event.`,
    files: {
      "validation.ts": `export interface EventForm {
  eventName: string;
  location: string;
  maxAttendees: string;
}

export type EventErrors = Partial<Record<keyof EventForm, string>>;

export function validateEvent(form: EventForm): EventErrors {
  const errors: EventErrors = {};
  if (!form.eventName.trim()) errors.eventName = "Event name is required.";
  if (!form.location.trim()) errors.location = "Location is required.";
  const n = Number(form.maxAttendees);
  if (!Number.isInteger(n) || n <= 0) errors.maxAttendees = "Maximum attendees must be a positive whole number.";
  return errors;
}
`,
      "eventService.ts": `export async function createEvent(payload: { title: string; location: string; capacity: number }) {
  const response = await fetch("/api/events", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer fake-admin-token",
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(\`Could not create event (HTTP \${response.status})\`);
  }
  return response.json();
}
`,
      "App.tsx": `import { useState, type FormEvent } from "react";
import { validateEvent, type EventForm, type EventErrors } from "./validation";
import { createEvent } from "./eventService";

export default function App() {
  const [form, setForm] = useState<EventForm>({ eventName: "", location: "", maxAttendees: "" });
  const [errors, setErrors] = useState<EventErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  function update(field: keyof EventForm, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const found = validateEvent(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    setStatus("submitting");
    try {
      const created = await createEvent({ title: form.eventName.trim(), location: form.location.trim(), capacity: Number(form.maxAttendees) });
      setStatus("success");
      setMessage(\`Created event #\${created.id}\`);
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Unknown error");
    }
  }

  const field = (name: keyof EventForm, label: string, type = "text") => (
    <div style={{ marginBottom: 10 }}>
      <label htmlFor={name} style={{ display: "block" }}>{label}</label>
      <input id={name} type={type} value={form[name]} onChange={(e) => update(name, e.target.value)}
        aria-invalid={!!errors[name]} aria-describedby={errors[name] ? name + "-error" : undefined} />
      {errors[name] && <div id={name + "-error"} className="error">{errors[name]}</div>}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h2>Create event</h2>
      {field("eventName", "Event name")}
      {field("location", "Location")}
      {field("maxAttendees", "Maximum attendees", "number")}
      <button type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? "Saving…" : "Create"}
      </button>
      {status === "success" && <p role="status">{message}</p>}
      {status === "error" && <p className="error" role="alert">{message}</p>}
    </form>
  );
}
`,
      "main.tsx": MAIN(),
      "styles.css": BASE_CSS + "input { padding: 4px 6px; border: 1px solid #ccc; border-radius: 4px; }\n",
    },
    entry: "main.tsx",
    autoRender: false,
    open: "validation.ts",
  },
  {
    id: "tanstack-query",
    title: "TanStack Query: cache & invalidation",
    group: "State",
    description: "Real @tanstack/react-query v5 against the mock API — staleTime, isFetching, invalidateQueries.",
    instructions: `### Mock ICT D4 in practice
- Toggle the list off and on: with \`staleTime: 10_000\` the cached data shows **instantly** and no request is made while fresh.
- After 10 s the data is **stale** — remounting shows cached data *and* refetches in the background (\`isFetching\`).
- **Rename event 1** runs a mutation (PUT) and then \`invalidateQueries({ queryKey: ["events"] })\` so the list refetches.

Watch the **Network** tab to count real requests.`,
    files: {
      "App.tsx": `import { QueryClient, QueryClientProvider, useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

const queryClient = new QueryClient();

interface Event { id: number; title: string; price: number }

async function fetchEvents(): Promise<Event[]> {
  const res = await fetch("/api/events");
  if (!res.ok) throw new Error("HTTP " + res.status);
  return res.json();
}

async function renameEvent(id: number, title: string): Promise<void> {
  const res = await fetch("/api/events/" + id, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: "Bearer fake-admin-token" },
    body: JSON.stringify({ title }),
  });
  if (!res.ok) throw new Error("HTTP " + res.status);
  // 204 No Content → nothing to parse
}

function EventList() {
  const { data, isPending, isFetching, error } = useQuery({
    queryKey: ["events"],
    queryFn: fetchEvents,
    staleTime: 10_000,
  });
  if (isPending) return <p>Loading (no cached data yet)…</p>;
  if (error) return <p className="error">{error.message}</p>;
  return (
    <div>
      {isFetching && <p className="muted">Refreshing in background…</p>}
      <ul>{data!.map((e) => <li key={e.id}>{e.title}</li>)}</ul>
    </div>
  );
}

function RenameButton() {
  const qc = useQueryClient();
  const mutation = useMutation({
    mutationFn: (title: string) => renameEvent(1, title),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["events"] }),
  });
  return (
    <button disabled={mutation.isPending} onClick={() => mutation.mutate("Tech Conference (updated " + new Date().toLocaleTimeString() + ")")}>
      {mutation.isPending ? "Saving…" : "Rename event 1"}
    </button>
  );
}

export default function App() {
  const [show, setShow] = useState(true);
  return (
    <QueryClientProvider client={queryClient}>
      <button onClick={() => setShow((s) => !s)}>{show ? "Unmount list" : "Mount list"}</button>{" "}
      <RenameButton />
      {show && <EventList />}
    </QueryClientProvider>
  );
}
`,
      "main.tsx": MAIN(),
      "styles.css": BASE_CSS,
    },
    entry: "main.tsx",
    autoRender: false,
    open: "App.tsx",
  },
  {
    id: "zustand-store",
    title: "Zustand: theme, cart & selectors",
    group: "State",
    description: "A real Zustand v5 store shared by components, with render counters.",
    instructions: `### Selectors and re-renders
Each component shows how many times it rendered.

- \`ThemeLabel\` selects **only** \`theme\` → adding to the cart does not re-render it.
- \`WholeStoreSpy\` calls \`useShop()\` with **no selector** → it re-renders on **every** change.
- \`CartCount\` selects a derived number.

Try: toggle the theme, add items, and compare the counters.`,
    files: {
      "store.ts": `import { create } from "zustand";

interface CartItem { id: number; name: string; qty: number }

interface ShopState {
  theme: "light" | "dark";
  cart: CartItem[];
  toggleTheme: () => void;
  addToCart: (item: { id: number; name: string }) => void;
  clearCart: () => void;
}

export const useShop = create<ShopState>()((set) => ({
  theme: "light",
  cart: [],
  toggleTheme: () => set((s) => ({ theme: s.theme === "light" ? "dark" : "light" })),
  addToCart: (item) =>
    set((s) => {
      const existing = s.cart.find((c) => c.id === item.id);
      return {
        cart: existing
          ? s.cart.map((c) => (c.id === item.id ? { ...c, qty: c.qty + 1 } : c))
          : [...s.cart, { ...item, qty: 1 }],
      };
    }),
  clearCart: () => set({ cart: [] }),
}));
`,
      "App.tsx": `import { useRef } from "react";
import { useShop } from "./store";

function useRenderCount() {
  const r = useRef(0);
  r.current += 1;
  return r.current;
}

function ThemeLabel() {
  const theme = useShop((s) => s.theme);
  const n = useRenderCount();
  return <div className="card">Theme: <b>{theme}</b> <span className="muted">renders: {n}</span></div>;
}

function CartCount() {
  const count = useShop((s) => s.cart.reduce((sum, i) => sum + i.qty, 0));
  const n = useRenderCount();
  return <div className="card">Items in cart: <b>{count}</b> <span className="muted">renders: {n}</span></div>;
}

function WholeStoreSpy() {
  const state = useShop();
  const n = useRenderCount();
  return <div className="card">Whole-store subscriber (theme={state.theme}) <span className="muted">renders: {n}</span></div>;
}

function Controls() {
  const toggleTheme = useShop((s) => s.toggleTheme);
  const addToCart = useShop((s) => s.addToCart);
  const clearCart = useShop((s) => s.clearCart);
  return (
    <div>
      <button onClick={toggleTheme}>Toggle theme</button>{" "}
      <button onClick={() => addToCart({ id: 1, name: "Keyboard" })}>Add keyboard</button>{" "}
      <button onClick={clearCart}>Clear cart</button>
    </div>
  );
}

export default function App() {
  return (
    <main>
      <Controls />
      <ThemeLabel />
      <CartCount />
      <WholeStoreSpy />
    </main>
  );
}
`,
      "main.tsx": MAIN(),
      "styles.css": BASE_CSS,
    },
    entry: "main.tsx",
    autoRender: false,
    open: "store.ts",
  },
  {
    id: "html-css-grid",
    title: "Grid template areas, minmax() & clamp()",
    group: "HTML & CSS",
    description: "A responsive page layout using named grid areas and fluid type.",
    instructions: `### Tasks
1. Resize the preview with the **device** buttons — the layout switches to one column below 700px.
2. Change \`clamp(1.5rem, 4vw, 3rem)\` and observe the heading.
3. Tab through the links: \`:focus-visible\` shows a ring for keyboard users.`,
    files: {
      "index.html": `<div class="page">
  <header class="header"><h1>CampusEvents</h1></header>
  <nav class="sidebar"><a href="#">Events</a> <a href="#">Bookings</a></nav>
  <main class="main">
    <div class="cards">
      <article>Tech Conference</article>
      <article>Sports Day</article>
      <article>Music Festival</article>
      <article>Hackathon</article>
    </div>
  </main>
  <footer class="footer">© University</footer>
</div>
`,
      "styles.css": `.page {
  display: grid;
  grid-template-columns: 200px 1fr;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
  gap: 12px;
}
.header { grid-area: header; }
.sidebar { grid-area: sidebar; display: flex; flex-direction: column; gap: 6px; }
.main { grid-area: main; }
.footer { grid-area: footer; color: #71717a; }

h1 { font-size: clamp(1.5rem, 4vw, 3rem); margin: 0; }

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 10px;
}
.cards article { border: 1px solid #ddd; border-radius: 8px; padding: 16px; }

a:focus-visible { outline: 3px solid #2563eb; outline-offset: 2px; }

@media (max-width: 700px) {
  .page {
    grid-template-columns: 1fr;
    grid-template-areas: "header" "sidebar" "main" "footer";
  }
}
`,
      "script.js": `console.log("Viewport width:", window.innerWidth);
window.addEventListener("resize", () => console.log("Viewport width:", window.innerWidth));
`,
    },
    entry: "script.js",
    autoRender: false,
    open: "styles.css",
  },
  {
    id: "blank-react",
    title: "Blank React + TypeScript",
    group: "React",
    description: "An empty component to experiment with.",
    instructions: "Write any React component. The default export of `App.tsx` is rendered.",
    files: {
      "App.tsx": `export default function App() {
  return <h1>Hello ACS</h1>;
}
`,
      "main.tsx": MAIN(),
      "styles.css": BASE_CSS,
    },
    entry: "main.tsx",
    autoRender: false,
    open: "App.tsx",
  },
];

export const presetById = (id: string) => PRESETS.find((p) => p.id === id);
