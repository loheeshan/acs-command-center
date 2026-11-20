import type { LabStage } from "./types";

/*
 * CampusEvents Project Lab — 8 stages.
 *
 * Each stage has a runnable STARTER (previous stage's reference + clearly marked "// TODO:" gaps)
 * and a complete REFERENCE. Both run in the sandbox playground (Sucrase TS/JSX → CommonJS) against
 * the in-preview MOCK CampusEvents API at /api/*. File contents that are identical across projects
 * are shared constants (Fnnn_*) to keep this file manageable.
 *
 * Sandbox notes: the preview is an isolated srcdoc iframe, so routing uses MemoryRouter (a real app
 * uses BrowserRouter) and API_URL is "/api" (a real app uses http://localhost:5229/api from .env).
 */

/* ------------------------------ shared file contents ------------------------------ */

const F001_main_tsx = `import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";

// StrictMode runs extra checks in development (e.g. it runs effects twice
// to help you spot missing clean-up functions).
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
`;

const F002_App_tsx = `import Navbar from "./components/Navbar";
// TODO 1: import Footer from "./components/Footer";
import Events from "./pages/Events";

function App() {
  return (
    <>
      <Navbar />
      <main>
        <h2>Welcome to CampusEvents</h2>
        <Events />
      </main>
      {/* TODO 1: render <Footer /> here, below <main> */}
    </>
  );
}

export default App;
`;

const F003_components_EventCard_tsx = `// The props interface describes exactly what a parent must pass in.
interface EventCardProps {
  title: string;
  location: string;
  price: number;
}

function EventCard({ title }: EventCardProps) {
  return (
    <article>
      <h3>{title}</h3>
      {/* TODO 2: also destructure location and price, then render
          the location in a <p className="muted"> and the price as £{price}. */}
    </article>
  );
}

export default EventCard;
`;

const F004_components_Footer_tsx = `function Footer() {
  // TODO 1: return a <footer> element containing a <p> with the text "CampusEvents".
  return null;
}

export default Footer;
`;

const F005_components_Navbar_tsx = `// Week 02: the links are placeholders (href="#"). Real routing arrives in Stage 4.
function Navbar() {
  return (
    <header className="site-header">
      <h1>CampusEvents</h1>
      <nav className="menu" aria-label="Main">
        <a href="#">Home</a>
        <a href="#">Events</a>
        <a href="#">Login</a>
        <a href="#">Register</a>
      </nav>
    </header>
  );
}

export default Navbar;
`;

const F006_components_TicketCounter_tsx = `// TODO 3: import { useState } from "react";

function TicketCounter() {
  // TODO 3: const [tickets, setTickets] = useState(1);
  // The "-" button must never go below 1: setTickets(Math.max(1, tickets - 1))
  return (
    <div className="counter">
      <button>-</button>
      <span>1</span>
      <button>+</button>
    </div>
  );
}

export default TicketCounter;
`;

const F007_pages_Events_tsx = `import EventCard from "../components/EventCard";
// TODO 5: import TicketCounter from "../components/TicketCounter";

// Week 02: temporary hard-coded data. Week 03 (Stage 3) loads it from the API.
interface Event {
  id: number;
  title: string;
  location: string;
  price: number;
}

const events: Event[] = [
  { id: 1, title: "Campus Tech Conference", location: "Main Campus Hall", price: 15 },
  { id: 2, title: "Sports Day", location: "University Sports Centre", price: 5 },
  { id: 3, title: "Winter Music Festival", location: "Student Union", price: 12 },
];

function Events() {
  return (
    <section>
      <h2>Events</h2>
      {/* One card written by hand to show props. */}
      <div className="card">
        <EventCard title="Campus Tech Conference" location="Main Campus Hall" price={15} />
      </div>
      {/* TODO 4: replace the card above with events.map(...) that renders one
          <div className="card" key={event.id}> per event, passing title/location/price. */}
      {/* TODO 5: render a <TicketCounter /> inside each card, below the EventCard. */}
      <p className="muted">{events.length} events in the array.</p>
    </section>
  );
}

export default Events;
`;

const F008_pages_Home_tsx = `function Home() {
  return (
    <section>
      <h2>Welcome to CampusEvents</h2>
      <p>Discover events happening on campus.</p>
    </section>
  );
}

export default Home;
`;

const F009_pages_Login_tsx = `function Login() {
  return (
    <section>
      <h2>Login</h2>
      <p>The login page will be developed later.</p>
    </section>
  );
}

export default Login;
`;

const F010_pages_Register_tsx = `function Register() {
  return (
    <section>
      <h2>Register</h2>
      <p>The registration page will be developed later.</p>
    </section>
  );
}

export default Register;
`;

const F011_styles_css = `* { box-sizing: border-box; }
body { margin: 0; font-family: system-ui, "Segoe UI", sans-serif; color: #18181b; background: #fafafa; line-height: 1.5; }
.site-header { background: #312e81; color: #fff; padding: 10px 16px; }
.site-header h1 { margin: 0; font-size: 1.4rem; }
.menu { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 6px; align-items: center; }
.menu a { color: #e0e7ff; text-decoration: none; padding: 2px 10px; border: 1px solid #6366f1; border-radius: 999px; }
.menu a.active { background: #fff; color: #312e81; font-weight: 600; }
main { display: block; padding: 12px 16px; max-width: 960px; margin: 0 auto; }
footer { padding: 12px 16px; color: #71717a; border-top: 1px solid #e4e4e7; text-align: center; }
.card { background: #fff; border: 1px solid #e4e4e7; border-radius: 10px; padding: 12px 14px; margin: 10px 0; }
.card h3 { margin: 0 0 4px; }
.card p { margin: 2px 0; }
.muted { color: #71717a; }
.error { color: #b91c1c; }
.badge { display: inline-block; font-size: 0.75rem; padding: 1px 8px; border-radius: 999px; background: #e0e7ff; color: #3730a3; }
.badge.sold-out { background: #fee2e2; color: #991b1b; }
button, .button { font: inherit; padding: 4px 12px; border: 1px solid #a1a1aa; border-radius: 6px; background: #f4f4f5; color: inherit; text-decoration: none; cursor: pointer; display: inline-block; }
button:disabled { opacity: 0.5; cursor: not-allowed; }
button.primary, .button.primary { background: #4f46e5; border-color: #4f46e5; color: #fff; }
button.danger { background: #dc2626; border-color: #dc2626; color: #fff; }
.counter { display: inline-flex; align-items: center; gap: 10px; margin-top: 6px; }
.row { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; margin: 6px 0; }
.sandbox-tools { margin: 8px 16px; padding: 6px 10px; border: 1px dashed #a1a1aa; border-radius: 8px; font-size: 0.85rem; }
form.stack { display: grid; gap: 10px; max-width: 520px; }
form.stack label { display: grid; gap: 4px; font-weight: 600; }
input, select, textarea { font: inherit; padding: 6px 8px; border: 1px solid #a1a1aa; border-radius: 6px; }
input[aria-invalid="true"], select[aria-invalid="true"], textarea[aria-invalid="true"] { border-color: #b91c1c; }
.field-error { color: #b91c1c; font-size: 0.85rem; font-weight: 400; }
.menu button { padding: 2px 10px; border-radius: 999px; background: transparent; color: #e0e7ff; border-color: #6366f1; }
.current-path { margin: 4px 16px 0; font-size: 0.8rem; }
`;

const F012_App_tsx = `import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Events from "./pages/Events";

function App() {
  return (
    <>
      <Navbar />
      <main>
        <h2>Welcome to CampusEvents</h2>
        <Events />
      </main>
      <Footer />
    </>
  );
}

export default App;
`;

const F013_components_EventCard_tsx = `// The props interface describes exactly what a parent must pass in.
interface EventCardProps {
  title: string;
  location: string;
  price: number;
}

function EventCard({ title, location, price }: EventCardProps) {
  return (
    <article>
      <h3>{title}</h3>
      <p className="muted">{location}</p>
      <p>£{price}</p>
    </article>
  );
}

export default EventCard;
`;

const F014_components_Footer_tsx = `function Footer() {
  return (
    <footer>
      <p>CampusEvents</p>
    </footer>
  );
}

export default Footer;
`;

const F015_components_TicketCounter_tsx = `import { useState } from "react";

function TicketCounter() {
  // Local state: each TicketCounter instance remembers its own number.
  const [tickets, setTickets] = useState(1);

  // click → handler runs → state setter schedules a re-render → React shows the new value
  return (
    <div className="counter">
      <button onClick={() => setTickets(Math.max(1, tickets - 1))}>-</button>
      <span>{tickets}</span>
      <button onClick={() => setTickets(tickets + 1)}>+</button>
    </div>
  );
}

export default TicketCounter;
`;

const F016_pages_Events_tsx = `import EventCard from "../components/EventCard";
import TicketCounter from "../components/TicketCounter";

// Week 02: temporary hard-coded data. Week 03 (Stage 3) loads it from the API.
interface Event {
  id: number;
  title: string;
  location: string;
  price: number;
}

const events: Event[] = [
  { id: 1, title: "Campus Tech Conference", location: "Main Campus Hall", price: 15 },
  { id: 2, title: "Sports Day", location: "University Sports Centre", price: 5 },
  { id: 3, title: "Winter Music Festival", location: "Student Union", price: 12 },
];

function Events() {
  return (
    <section>
      <h2>Events</h2>
      {events.map((event) => (
        // key: a stable, unique id so React can match items between renders
        <div className="card" key={event.id}>
          <EventCard title={event.title} location={event.location} price={event.price} />
          <TicketCounter />
        </div>
      ))}
    </section>
  );
}

export default Events;
`;

const F017_components_EventCard_tsx = `// TODO 1: change the props to { event: Event; children?: ReactNode }
//   import type { ReactNode } from "react";
//   import type { Event } from "../types/Event";
// and render: title, "categoryName · location", the start date
// (new Date(event.startDate).toLocaleString()), £price.toFixed(2),
// a badge "n left" or "Sold out" (availableTickets === 0) and {children}.
interface EventCardProps {
  title: string;
  location: string;
  price: number;
}

function EventCard({ title, location, price }: EventCardProps) {
  return (
    <article>
      <h3>{title}</h3>
      <p className="muted">{location}</p>
      <p>£{price}</p>
    </article>
  );
}

export default EventCard;
`;

const F018_components_TicketCounter_tsx = `import { useState } from "react";

// TODO 2: add a typed props interface: { price: number; max: number }
// - disable "-" at 1 and "+" at max
// - use functional updates: setTickets((t) => Math.min(max, t + 1))
// - show "Total: £…" computed from tickets * price (derived — do NOT store it in state)
function TicketCounter() {
  const [tickets, setTickets] = useState(1);

  return (
    <div className="counter">
      <button onClick={() => setTickets(Math.max(1, tickets - 1))}>-</button>
      <span>{tickets}</span>
      <button onClick={() => setTickets(tickets + 1)}>+</button>
    </div>
  );
}

export default TicketCounter;
`;

const F019_data_sampleEvents_ts = `import type { Event } from "../types/Event";

// Still temporary local data (Stage 3 replaces it with GET /api/events).
export const sampleEvents: Event[] = [
  { id: 1, title: "Campus Tech Conference 2026", description: "Talks on web development and AI.", imageUrl: null, startDate: "2026-12-02T09:00:00", endDate: "2026-12-02T17:00:00", location: "Main Campus Hall", price: 15, capacity: 200, availableTickets: 120, categoryId: 1, categoryName: "Technology" },
  { id: 2, title: "Sports Day", description: "Inter-faculty athletics.", imageUrl: null, startDate: "2026-12-05T10:00:00", endDate: "2026-12-05T16:00:00", location: "University Sports Centre", price: 5, capacity: 500, availableTickets: 480, categoryId: 2, categoryName: "Sports" },
  { id: 3, title: "Winter Music Festival", description: "Student bands and DJs.", imageUrl: null, startDate: "2026-12-10T18:00:00", endDate: "2026-12-10T23:00:00", location: "Student Union", price: 12, capacity: 300, availableTickets: 0, categoryId: 3, categoryName: "Music" },
];
`;

const F020_pages_Events_tsx = `import EventCard from "../components/EventCard";
import TicketCounter from "../components/TicketCounter";
import { sampleEvents } from "../data/sampleEvents";

function Events() {
  // TODO 3: add two pieces of local state:
  //   const [search, setSearch] = useState("");
  //   const [availableOnly, setAvailableOnly] = useState(false);
  // and render a controlled <input> (value + onChange) and a controlled checkbox (checked + onChange).
  // Derive the visible list with filter() during render — don't copy it into another state.
  const visible = sampleEvents;

  return (
    <section>
      <h2>Events</h2>
      {/* TODO 4: when visible is empty, render <p>No events match.</p> instead of the list. */}
      {visible.map((event) => (
        <div className="card" key={event.id}>
          {/* TODO 1: pass event={event} and the TicketCounter as children instead */}
          <EventCard title={event.title} location={event.location} price={event.price} />
          {/* TODO 2: pass price and max={Math.min(20, event.availableTickets)}; hide it when sold out */}
          <TicketCounter />
        </div>
      ))}
    </section>
  );
}

export default Events;
`;

const F021_types_Event_ts = `// Matches the backend's EventDto (camelCase JSON).
// TypeScript types are erased at compile time: they describe data, they do not check it at runtime.
export interface Event {
  id: number;
  title: string;
  description: string;
  imageUrl: string | null;
  startDate: string; // ISO date-time string, e.g. "2026-12-02T09:00:00"
  endDate: string;
  location: string;
  price: number;
  capacity: number;
  availableTickets: number;
  categoryId: number;
  categoryName: string;
}
`;

const F022_components_EventCard_tsx = `import type { ReactNode } from "react";
import type { Event } from "../types/Event";

interface EventCardProps {
  event: Event;
  /** Optional extra content rendered inside the card (composition). */
  children?: ReactNode;
}

function EventCard({ event, children }: EventCardProps) {
  const soldOut = event.availableTickets === 0; // derived value, no state needed

  return (
    <article className="card">
      <h3>{event.title}</h3>
      <p className="muted">
        {event.categoryName} · {event.location}
      </p>
      <p>{new Date(event.startDate).toLocaleString()}</p>
      <p>
        £{event.price.toFixed(2)}{" "}
        {soldOut ? (
          <span className="badge sold-out">Sold out</span>
        ) : (
          <span className="badge">{event.availableTickets} left</span>
        )}
      </p>
      {children}
    </article>
  );
}

export default EventCard;
`;

const F023_components_TicketCounter_tsx = `import { useState } from "react";

interface TicketCounterProps {
  price: number;
  /** Highest allowed value (the API allows 1–20 tickets per booking). */
  max: number;
}

function TicketCounter({ price, max }: TicketCounterProps) {
  const [tickets, setTickets] = useState(1);
  const total = tickets * price; // derived from state + props on every render

  // Functional updates always start from the latest queued value.
  const decrease = () => setTickets((t) => Math.max(1, t - 1));
  const increase = () => setTickets((t) => Math.min(max, t + 1));

  return (
    <div className="counter">
      <button type="button" onClick={decrease} disabled={tickets <= 1} aria-label="Remove one ticket">
        -
      </button>
      <span aria-live="polite">{tickets}</span>
      <button type="button" onClick={increase} disabled={tickets >= max} aria-label="Add one ticket">
        +
      </button>
      <span className="muted">Total: £{total.toFixed(2)}</span>
    </div>
  );
}

export default TicketCounter;
`;

const F024_pages_Events_tsx = `import { useState } from "react";
import EventCard from "../components/EventCard";
import TicketCounter from "../components/TicketCounter";
import { sampleEvents } from "../data/sampleEvents";

function Events() {
  const [search, setSearch] = useState("");
  const [availableOnly, setAvailableOnly] = useState(false);

  // Derived data: recomputed from the source list + state on each render.
  const term = search.trim().toLowerCase();
  const visible = sampleEvents.filter(
    (e) => e.title.toLowerCase().includes(term) && (!availableOnly || e.availableTickets > 0)
  );

  return (
    <section>
      <h2>Events</h2>
      <div className="row">
        <label>
          Search{" "}
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="e.g. music" />
        </label>
        <label>
          <input
            type="checkbox"
            checked={availableOnly}
            onChange={(e) => setAvailableOnly(e.target.checked)}
          />{" "}
          Only events with tickets
        </label>
      </div>
      <p className="muted">
        Showing {visible.length} of {sampleEvents.length} events
      </p>

      {visible.length === 0 ? (
        <p>No events match.</p>
      ) : (
        visible.map((event) => (
          <EventCard key={event.id} event={event}>
            {event.availableTickets > 0 && (
              <TicketCounter price={event.price} max={Math.min(20, event.availableTickets)} />
            )}
          </EventCard>
        ))
      )}
    </section>
  );
}

export default Events;
`;

const F025_App_tsx = `import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SandboxTools from "./components/SandboxTools";
import Events from "./pages/Events";

function App() {
  return (
    <>
      <Navbar />
      <main>
        <h2>Welcome to CampusEvents</h2>
        <Events />
      </main>
      <Footer />
      <SandboxTools />
    </>
  );
}

export default App;
`;

const F026_components_SandboxTools_tsx = `// Sandbox-only helper. The playground's mock API exposes window.mockApi so you can
// test your error state. It does not exist in a real project — delete this component there.
interface MockApi {
  failNextRequest: () => void;
}

function SandboxTools() {
  function failNext() {
    const api = (window as unknown as { mockApi?: MockApi }).mockApi;
    api?.failNextRequest();
    console.info("Mock API: the next request will answer HTTP 500.");
  }

  return (
    <aside className="sandbox-tools">
      <span className="muted">Sandbox tools:</span>{" "}
      <button type="button" onClick={failNext}>
        Make the next API request fail (500)
      </button>
    </aside>
  );
}

export default SandboxTools;
`;

const F027_hooks_useEvents_ts = `import { useEffect, useState } from "react";
import { getEvents } from "../services/eventService";
import type { Event } from "../types/Event";

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // TODO 3: const controller = new AbortController();
    // pass controller.signal to getEvents(...) and add:  return () => controller.abort();
    async function load() {
      try {
        const data = await getEvents();
        setEvents(data);
      } catch (err) {
        // TODO 3: if (controller.signal.aborted) return;  // cancelled on purpose: not an error
        setError(err instanceof Error ? err.message : "Unable to load events.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // TODO 5: implement reload(): keep a \`reloadKey\` number in state, add it to the
  // effect's dependency array and increment it here.
  function reload() {
    console.log("TODO 5: reload() is not implemented yet");
  }

  return { events, loading, error, reload };
}
`;

const F028_pages_Events_tsx = `import { useState } from "react";
import EventCard from "../components/EventCard";
import TicketCounter from "../components/TicketCounter";
import { useEvents } from "../hooks/useEvents";

function Events() {
  const { events } = useEvents();
  const [search, setSearch] = useState("");
  const [availableOnly, setAvailableOnly] = useState(false);

  // TODO 4: also read loading and error from useEvents() and return early, in this order:
  //   loading → <p role="status">Loading events…</p>
  //   error   → <div role="alert"><p className="error">{error}</p> + a "Try again" button (TODO 5)</div>
  //   empty   → <p>No events found.</p>
  // (Hooks such as useState must stay ABOVE these early returns.)

  const term = search.trim().toLowerCase();
  const visible = events.filter(
    (e) => e.title.toLowerCase().includes(term) && (!availableOnly || e.availableTickets > 0)
  );

  return (
    <section>
      <h2>Events</h2>
      <div className="row">
        <label>
          Search <input value={search} onChange={(e) => setSearch(e.target.value)} />
        </label>
        <label>
          <input type="checkbox" checked={availableOnly} onChange={(e) => setAvailableOnly(e.target.checked)} />{" "}
          Only events with tickets
        </label>
      </div>
      {visible.length === 0 ? (
        <p>No events match.</p>
      ) : (
        visible.map((event) => (
          <EventCard key={event.id} event={event}>
            {event.availableTickets > 0 && (
              <TicketCounter price={event.price} max={Math.min(20, event.availableTickets)} />
            )}
          </EventCard>
        ))
      )}
    </section>
  );
}

export default Events;
`;

const F029_services_eventService_ts = `import type { Event } from "../types/Event";

// Real project: "http://localhost:5229/api" (later read from import.meta.env.VITE_API_URL).
// Sandbox: the mock CampusEvents API answers relative "/api/..." URLs.
const API_URL = "/api";

// TODO 2: add a parameter \`signal?: AbortSignal\` and pass it to fetch: fetch(url, { signal })
export async function getEvents(): Promise<Event[]> {
  const response = await fetch(\`\${API_URL}/events\`);
  // TODO 1: fetch only rejects on network failure/abort — NOT on HTTP 404/500.
  // Check response.ok and throw new Error(\`Failed to fetch events: \${response.status}\`) when false.
  return (await response.json()) as Event[];
}
`;

const F030_hooks_useEvents_ts = `import { useEffect, useState } from "react";
import { getEvents } from "../services/eventService";
import type { Event } from "../types/Event";

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await getEvents(controller.signal);
        setEvents(data);
      } catch (err) {
        if (controller.signal.aborted) return; // cancelled on purpose — not an error
        setError(err instanceof Error ? err.message : "Unable to load events.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    load();

    // Clean-up runs before the next effect run and on unmount. In development,
    // StrictMode mounts → cleans up → mounts again, so the first request is aborted.
    return () => controller.abort();
  }, [reloadKey]);

  const reload = () => setReloadKey((k) => k + 1);

  return { events, loading, error, reload };
}
`;

const F031_pages_Events_tsx = `import { useState } from "react";
import EventCard from "../components/EventCard";
import TicketCounter from "../components/TicketCounter";
import { useEvents } from "../hooks/useEvents";

function Events() {
  const { events, loading, error, reload } = useEvents();
  const [search, setSearch] = useState("");
  const [availableOnly, setAvailableOnly] = useState(false);

  // The four UI states of remote data. Hooks are all called above this point.
  if (loading) return <p role="status">Loading events…</p>;
  if (error) {
    return (
      <div role="alert">
        <p className="error">{error}</p>
        <button type="button" onClick={reload}>
          Try again
        </button>
      </div>
    );
  }
  if (events.length === 0) return <p>No events found.</p>;

  const term = search.trim().toLowerCase();
  const visible = events.filter(
    (e) => e.title.toLowerCase().includes(term) && (!availableOnly || e.availableTickets > 0)
  );

  return (
    <section>
      <h2>Events</h2>
      <div className="row">
        <label>
          Search <input value={search} onChange={(e) => setSearch(e.target.value)} />
        </label>
        <label>
          <input type="checkbox" checked={availableOnly} onChange={(e) => setAvailableOnly(e.target.checked)} />{" "}
          Only events with tickets
        </label>
        <button type="button" onClick={reload}>
          Refresh
        </button>
      </div>
      {visible.length === 0 ? (
        <p>No events match.</p>
      ) : (
        visible.map((event) => (
          <EventCard key={event.id} event={event}>
            {event.availableTickets > 0 && (
              <TicketCounter price={event.price} max={Math.min(20, event.availableTickets)} />
            )}
          </EventCard>
        ))
      )}
    </section>
  );
}

export default Events;
`;

const F032_services_eventService_ts = `import type { Event } from "../types/Event";

// Real project: "http://localhost:5229/api" (later read from import.meta.env.VITE_API_URL).
// Sandbox: the mock CampusEvents API answers relative "/api/..." URLs.
const API_URL = "/api";

export async function getEvents(signal?: AbortSignal): Promise<Event[]> {
  const response = await fetch(\`\${API_URL}/events\`, { signal });

  // fetch only rejects on network failure or abort. HTTP errors (404, 500…) still
  // resolve, so we must check response.ok ourselves.
  if (!response.ok) {
    throw new Error(\`Failed to fetch events: \${response.status}\`);
  }

  // "as Event[]" is a promise to the compiler, not a runtime check of the JSON.
  return (await response.json()) as Event[];
}
`;

const F033_main_tsx = `import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import App from "./App";
import "./styles.css";

// A real Vite app uses <BrowserRouter> here: it reads and updates the browser's address bar.
// The playground preview is an isolated srcdoc iframe without a usable URL, so we use
// <MemoryRouter>, which keeps the history in memory. Routes, Link, useParams… work the same.
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MemoryRouter initialEntries={["/"]}>
      <App />
    </MemoryRouter>
  </StrictMode>
);
`;

const F034_App_tsx = `import { Route, Routes } from "react-router-dom";
// TODO 1: import Layout from "./components/Layout";
// TODO 2: import EventDetails, Login, Register and NotFound from "./pages/…"
import Home from "./pages/Home";
import Events from "./pages/Events";

function App() {
  return (
    <Routes>
      {/* TODO 1: wrap all routes in a pathless layout route: <Route element={<Layout />}> … </Route> */}
      <Route path="/" element={<Home />} />
      <Route path="/events" element={<Events />} />
      {/* TODO 2: add /events/:id → <EventDetails />, /login, /register and path="*" → <NotFound /> */}
    </Routes>
  );
}

export default App;
`;

const F035_components_EventCard_tsx = `import type { ReactNode } from "react";
// TODO 5: import { Link } from "react-router-dom";
import type { Event } from "../types/Event";

interface EventCardProps {
  event: Event;
  /** Optional extra content rendered inside the card (composition). */
  children?: ReactNode;
}

function EventCard({ event, children }: EventCardProps) {
  const soldOut = event.availableTickets === 0; // derived value, no state needed

  return (
    <article className="card">
      <h3>{event.title}</h3>
      <p className="muted">
        {event.categoryName} · {event.location}
      </p>
      <p>{new Date(event.startDate).toLocaleString()}</p>
      <p>
        £{event.price.toFixed(2)}{" "}
        {soldOut ? (
          <span className="badge sold-out">Sold out</span>
        ) : (
          <span className="badge">{event.availableTickets} left</span>
        )}
      </p>
      {/* TODO 5: add <Link to={\`/events/\${event.id}\`}>View details</Link> */}
      {children}
    </article>
  );
}

export default EventCard;
`;

const F036_components_Layout_tsx = `import { useLocation } from "react-router-dom";
// TODO 1: also import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import SandboxTools from "./SandboxTools";

// Shared layout: rendered once for every page; the matched child route goes into <Outlet />.
function Layout() {
  const location = useLocation();
  return (
    <>
      <Navbar />
      {/* Sandbox only: the preview has no address bar, so we show the current path. */}
      <p className="muted current-path">
        Current path: <code>{location.pathname}{location.search}</code>
      </p>
      <main>
        {/* TODO 1: replace this paragraph with <Outlet /> */}
        <p className="muted">TODO 1: the matched child route will appear here.</p>
      </main>
      <Footer />
      <SandboxTools />
    </>
  );
}

export default Layout;
`;

const F037_components_Navbar_tsx = `// TODO 3: import { NavLink } from "react-router-dom" and replace every <a href="#"> with
// <NavLink to="/…">. NavLink adds class="active" + aria-current="page" to the matching link.
// Routes: "/" (add the \`end\` prop), "/events", "/login", "/register".
function Navbar() {
  return (
    <header className="site-header">
      <h1>CampusEvents</h1>
      <nav className="menu" aria-label="Main">
        <a href="#">Home</a>
        <a href="#">Events</a>
        <a href="#">Login</a>
        <a href="#">Register</a>
      </nav>
    </header>
  );
}

export default Navbar;
`;

const F038_hooks_useEvent_ts = `import type { Event } from "../types/Event";

/**
 * Loads one event. Pass null to skip the request (e.g. when the URL id is invalid).
 *
 * TODO 4: implement it like useEvents.ts:
 *  - state: event (Event | null), loading, error (string | null), notFound (boolean)
 *  - useEffect(..., [id]): if id is null return; create an AbortController,
 *    call getEvent(id, controller.signal) from "../services/eventService",
 *    set notFound when the error is an ApiError with status 404, and abort in the clean-up.
 */
export function useEvent(id: number | null) {
  void id; // remove when implemented
  const event: Event | null = null;
  return { event, loading: false, error: null as string | null, notFound: false };
}
`;

const F039_pages_EventDetails_tsx = `import { Link, useParams } from "react-router-dom";
// TODO 4: import { useEvent } from "../hooks/useEvent";

function EventDetails() {
  // Route params are ALWAYS strings (or undefined): "/events/2" → { id: "2" }
  const { id } = useParams<{ id: string }>();

  // TODO 4:
  //  const eventId = Number(id);
  //  const validId = Number.isInteger(eventId) && eventId > 0;
  //  const { event, loading, error, notFound } = useEvent(validId ? eventId : null);
  // Then render, in order: invalid id → loading → not found → error → the event details
  // (category, title, description, location, start/end, £price, available/capacity).

  return (
    <section>
      <h2>Event details</h2>
      <p>
        URL parameter id = "{id}" (typeof: {typeof id})
      </p>
      <Link to="/events">Back to events</Link>
    </section>
  );
}

export default EventDetails;
`;

const F040_pages_Home_tsx = `import { Link } from "react-router-dom";

function Home() {
  return (
    <section>
      <h2>Welcome to CampusEvents</h2>
      <p>Discover events happening on campus.</p>
      <p>
        <Link to="/events" className="button primary">
          Browse events
        </Link>
      </p>
      <h3>Try these routes</h3>
      <ul>
        <li>
          <Link to="/events/1">/events/1</Link> — details of event 1
        </li>
        <li>
          <Link to="/events/999">/events/999</Link> — a valid id, but the API answers 404
        </li>
        <li>
          <Link to="/events/abc">/events/abc</Link> — an invalid id (no request should be sent)
        </li>
        <li>
          <Link to="/does-not-exist">/does-not-exist</Link> — no route matches → NotFound
        </li>
      </ul>
    </section>
  );
}

export default Home;
`;

const F041_pages_NotFound_tsx = `import { Link } from "react-router-dom";

// Rendered by the catch-all route: <Route path="*" element={<NotFound />} />
function NotFound() {
  return (
    <section>
      <h2>Page not found</h2>
      <p>The page you requested does not exist.</p>
      <Link to="/" className="button primary">
        Return home
      </Link>
    </section>
  );
}

export default NotFound;
`;

const F042_services_eventService_ts = `import type { Event } from "../types/Event";

// Real project: "http://localhost:5229/api" (later read from import.meta.env.VITE_API_URL).
// Sandbox: the mock CampusEvents API answers relative "/api/..." URLs.
const API_URL = "/api";

/** An HTTP error that remembers the status code (so the UI can treat 404 differently). */
export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function getJson<T>(path: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(\`\${API_URL}\${path}\`, { signal });
  if (!response.ok) {
    throw new ApiError(response.status, \`Request failed (HTTP \${response.status}).\`);
  }
  return (await response.json()) as T;
}

export function getEvents(signal?: AbortSignal): Promise<Event[]> {
  return getJson<Event[]>("/events", signal);
}

export function getEvent(id: number, signal?: AbortSignal): Promise<Event> {
  return getJson<Event>(\`/events/\${id}\`, signal);
}
`;

const F043_App_tsx = `import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Routes>
      {/* Pathless layout route: Layout renders once; the matched child appears in its <Outlet />. */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
`;

const F044_components_EventCard_tsx = `import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import type { Event } from "../types/Event";

interface EventCardProps {
  event: Event;
  /** Optional extra content rendered inside the card (composition). */
  children?: ReactNode;
}

function EventCard({ event, children }: EventCardProps) {
  const soldOut = event.availableTickets === 0; // derived value, no state needed

  return (
    <article className="card">
      <h3>{event.title}</h3>
      <p className="muted">
        {event.categoryName} · {event.location}
      </p>
      <p>{new Date(event.startDate).toLocaleString()}</p>
      <p>
        £{event.price.toFixed(2)}{" "}
        {soldOut ? (
          <span className="badge sold-out">Sold out</span>
        ) : (
          <span className="badge">{event.availableTickets} left</span>
        )}
      </p>
      <p>
        {/* Link changes the route without reloading the page (client-side navigation). */}
        <Link to={\`/events/\${event.id}\`}>View details</Link>
      </p>
      {children}
    </article>
  );
}

export default EventCard;
`;

const F045_components_Layout_tsx = `import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import SandboxTools from "./SandboxTools";

// Shared layout: rendered once for every page; the matched child route goes into <Outlet />.
function Layout() {
  const location = useLocation();
  return (
    <>
      <Navbar />
      {/* Sandbox only: the preview has no address bar, so we show the current path. */}
      <p className="muted current-path">
        Current path: <code>{location.pathname}{location.search}</code>
      </p>
      <main>
        <Outlet />
      </main>
      <Footer />
      <SandboxTools />
    </>
  );
}

export default Layout;
`;

const F046_components_Navbar_tsx = `import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <header className="site-header">
      <h1>CampusEvents</h1>
      <nav className="menu" aria-label="Main">
        {/* NavLink adds class="active" and aria-current="page" when its path matches.
            \`end\` = only active on an exact match (otherwise "/events" stays active on "/events/1"). */}
        <NavLink to="/" end>
          Home
        </NavLink>
        <NavLink to="/events">Events</NavLink>
        <NavLink to="/login">Login</NavLink>
        <NavLink to="/register">Register</NavLink>
      </nav>
    </header>
  );
}

export default Navbar;
`;

const F047_hooks_useEvent_ts = `import { useEffect, useState } from "react";
import { ApiError, getEvent } from "../services/eventService";
import type { Event } from "../types/Event";

/** Loads one event. Pass null to skip the request (e.g. when the URL id is invalid). */
export function useEvent(id: number | null) {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(id !== null);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (id === null) return; // nothing to load
    const controller = new AbortController();

    async function load(eventId: number) {
      setLoading(true);
      setError(null);
      setNotFound(false);
      setEvent(null);
      try {
        setEvent(await getEvent(eventId, controller.signal));
      } catch (err) {
        if (controller.signal.aborted) return;
        if (err instanceof ApiError && err.status === 404) setNotFound(true);
        else setError(err instanceof Error ? err.message : "Unable to load the event.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    load(id);
    // Navigating /events/1 → /events/2 re-runs the effect: the old request is aborted first.
    return () => controller.abort();
  }, [id]);

  return { event, loading, error, notFound };
}
`;

const F048_pages_EventDetails_tsx = `import { Link, useParams } from "react-router-dom";
import { useEvent } from "../hooks/useEvent";

function EventDetails() {
  // Route params are ALWAYS strings (or undefined): "/events/2" → { id: "2" }
  const { id } = useParams<{ id: string }>();
  const eventId = Number(id);
  const validId = Number.isInteger(eventId) && eventId > 0;

  // Skip the request entirely for "/events/abc".
  const { event, loading, error, notFound } = useEvent(validId ? eventId : null);

  if (!validId) {
    return (
      <p className="error" role="alert">
        Invalid event id: "{id}".
      </p>
    );
  }
  if (loading) return <p role="status">Loading event…</p>;
  if (notFound) {
    return (
      <section>
        <h2>Event not found</h2>
        <p>There is no event with id {eventId}.</p>
        <Link to="/events">Back to events</Link>
      </section>
    );
  }
  if (error) {
    return (
      <p className="error" role="alert">
        {error}
      </p>
    );
  }
  if (!event) return null;

  return (
    <article className="card">
      <p className="muted">{event.categoryName}</p>
      <h2>{event.title}</h2>
      <p>{event.description}</p>
      <p>
        <strong>Location:</strong> {event.location}
      </p>
      <p>
        <strong>Starts:</strong> {new Date(event.startDate).toLocaleString()}
      </p>
      <p>
        <strong>Ends:</strong> {new Date(event.endDate).toLocaleString()}
      </p>
      <p>
        <strong>Price:</strong> £{event.price.toFixed(2)}
      </p>
      <p>
        <strong>Available tickets:</strong> {event.availableTickets} / {event.capacity}
      </p>
      <div className="row">
        <Link to="/events" className="button">
          Back to events
        </Link>
      </div>
    </article>
  );
}

export default EventDetails;
`;

const F049_App_tsx = `import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import EventNew from "./pages/EventNew";
import EventEdit from "./pages/EventEdit";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        {/* Static segments ("new") rank above dynamic ones (":id"), so order does not matter. */}
        <Route path="/events/new" element={<EventNew />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/events/:id/edit" element={<EventEdit />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
`;

const F050_components_EventForm_tsx = `import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useCategories } from "../hooks/useCategories";
import type { EventDto } from "../types/EventDto";
import { emptyEventForm, toDto, validateEvent } from "../utils/eventFormValues";
import type { EventFormErrors, EventFormValues } from "../utils/eventFormValues";

interface EventFormProps {
  initialValues?: EventFormValues;
  submitLabel: string;
  /** Receives a valid DTO. Throw (e.g. an ApiError) to show a server error inside the form. */
  onSubmit: (dto: EventDto) => Promise<void>;
}

type FieldElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

// Reusable for both "create" and "edit": the page decides what happens on submit.
export default function EventForm({ initialValues = emptyEventForm, submitLabel, onSubmit }: EventFormProps) {
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories();
  const [values, setValues] = useState<EventFormValues>(initialValues);
  const [errors, setErrors] = useState<EventFormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  function handleChange(e: ChangeEvent<FieldElement>) {
    const { name, value } = e.target;
    const next = { ...values, [name]: value };
    setValues(next);
    if (submitted) setErrors(validateEvent(next)); // after the first submit, re-validate while typing
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); // stop the browser's full-page form submission
    setSubmitted(true);
    const found = validateEvent(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);
    setServerError(null);
    try {
      await onSubmit(toDto(values));
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Unexpected error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  // Shared props for each field: controlled value, and aria attributes linking it to its error.
  const field = (name: keyof EventFormValues) => ({
    id: name,
    name,
    value: values[name],
    onChange: handleChange,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? \`\${name}-error\` : undefined,
  });

  const errorFor = (name: keyof EventFormValues) =>
    errors[name] ? (
      <span id={\`\${name}-error\`} className="field-error">
        {errors[name]}
      </span>
    ) : null;

  return (
    <form className="stack" onSubmit={handleSubmit} noValidate>
      {serverError && (
        <p className="error" role="alert">
          {serverError}
        </p>
      )}

      <label htmlFor="title">
        Title
        <input {...field("title")} />
        {errorFor("title")}
      </label>

      <label htmlFor="description">
        Description
        <textarea {...field("description")} rows={3} />
        {errorFor("description")}
      </label>

      <label htmlFor="location">
        Location
        <input {...field("location")} />
        {errorFor("location")}
      </label>

      <label htmlFor="startDate">
        Starts
        <input type="datetime-local" {...field("startDate")} />
        {errorFor("startDate")}
      </label>

      <label htmlFor="endDate">
        Ends
        <input type="datetime-local" {...field("endDate")} />
        {errorFor("endDate")}
      </label>

      <label htmlFor="price">
        Price (£)
        <input type="number" min={0} step="0.01" {...field("price")} />
        {errorFor("price")}
      </label>

      <label htmlFor="capacity">
        Capacity
        <input type="number" min={1} step={1} {...field("capacity")} />
        {errorFor("capacity")}
      </label>

      <label htmlFor="categoryId">
        Category
        <select {...field("categoryId")} disabled={categoriesLoading}>
          <option value="">{categoriesLoading ? "Loading categories…" : "Choose a category…"}</option>
          {categories.map((c) => (
            <option key={c.id} value={String(c.id)}>
              {c.name}
            </option>
          ))}
        </select>
        {errorFor("categoryId")}
        {categoriesError && <span className="field-error">{categoriesError}</span>}
      </label>

      <label htmlFor="imageUrl">
        Image URL (optional)
        <input type="url" {...field("imageUrl")} placeholder="https://…" />
        {errorFor("imageUrl")}
      </label>

      <div className="row">
        <button type="submit" className="primary" disabled={submitting}>
          {submitting ? "Saving…" : submitLabel}
        </button>
      </div>
    </form>
  );
}
`;

const F051_components_Navbar_tsx = `import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <header className="site-header">
      <h1>CampusEvents</h1>
      <nav className="menu" aria-label="Main">
        {/* NavLink adds class="active" and aria-current="page" when its path matches.
            \`end\` = only active on an exact match (otherwise "/events" stays active on "/events/1"). */}
        <NavLink to="/" end>
          Home
        </NavLink>
        <NavLink to="/events" end>
          Events
        </NavLink>
        <NavLink to="/events/new">New event</NavLink>
        <NavLink to="/login">Login</NavLink>
        <NavLink to="/register">Register</NavLink>
      </nav>
    </header>
  );
}

export default Navbar;
`;

const F052_hooks_useCategories_ts = `import { useEffect, useState } from "react";
import { categoryService } from "../services/categoryService";
import type { Category } from "../types/Category";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    categoryService
      .list(controller.signal)
      .then(setCategories)
      .catch((err: unknown) => {
        if (!controller.signal.aborted) setError(err instanceof Error ? err.message : "Unable to load categories.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, []);

  return { categories, loading, error };
}
`;

const F053_hooks_useEvent_ts = `import { useEffect, useState } from "react";
import { ApiError } from "../services/api";
import { eventService } from "../services/eventService";
import type { Event } from "../types/Event";

/** Loads one event. Pass null to skip the request (e.g. when the URL id is invalid). */
export function useEvent(id: number | null) {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(id !== null);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (id === null) return;
    const controller = new AbortController();

    async function load(eventId: number) {
      setLoading(true);
      setError(null);
      setNotFound(false);
      setEvent(null);
      try {
        setEvent(await eventService.get(eventId, controller.signal));
      } catch (err) {
        if (controller.signal.aborted) return;
        if (err instanceof ApiError && err.status === 404) setNotFound(true);
        else setError(err instanceof Error ? err.message : "Unable to load the event.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    load(id);
    return () => controller.abort();
  }, [id]);

  return { event, loading, error, notFound };
}
`;

const F054_hooks_useEvents_ts = `import { useEffect, useState } from "react";
import { eventService } from "../services/eventService";
import type { Event } from "../types/Event";

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      setLoading(true);
      setError(null);
      try {
        setEvents(await eventService.list(controller.signal));
      } catch (err) {
        if (controller.signal.aborted) return; // cancelled on purpose — not an error
        setError(err instanceof Error ? err.message : "Unable to load events.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, [reloadKey]);

  const reload = () => setReloadKey((k) => k + 1);

  return { events, loading, error, reload };
}
`;

const F055_pages_EventDetails_tsx = `import { Link, useParams } from "react-router-dom";
import { useEvent } from "../hooks/useEvent";
// TODO 4: import { useState } from "react", useNavigate, and { eventService } from "../services/eventService";

function EventDetails() {
  const { id } = useParams<{ id: string }>();
  const eventId = Number(id);
  const validId = Number.isInteger(eventId) && eventId > 0;
  const { event, loading, error, notFound } = useEvent(validId ? eventId : null);
  // TODO 4: add state for \`deleting\` (boolean) and \`deleteError\` (string | null) HERE — above the early returns.

  async function handleDelete() {
    // TODO 4: if (!window.confirm(...)) return; then await eventService.remove(event.id)  (DELETE → 204)
    // and navigate("/events", { replace: true }). On failure show the error message and re-enable the button.
    console.log("TODO 4: delete event", event?.id);
  }

  if (!validId) {
    return (
      <p className="error" role="alert">
        Invalid event id: "{id}".
      </p>
    );
  }
  if (loading) return <p role="status">Loading event…</p>;
  if (notFound) {
    return (
      <section>
        <h2>Event not found</h2>
        <p>There is no event with id {eventId}.</p>
        <Link to="/events">Back to events</Link>
      </section>
    );
  }
  if (error) {
    return (
      <p className="error" role="alert">
        {error}
      </p>
    );
  }
  if (!event) return null;

  return (
    <article className="card">
      <p className="muted">{event.categoryName}</p>
      <h2>{event.title}</h2>
      <p>{event.description}</p>
      <p>
        <strong>Location:</strong> {event.location}
      </p>
      <p>
        <strong>Starts:</strong> {new Date(event.startDate).toLocaleString()}
      </p>
      <p>
        <strong>Ends:</strong> {new Date(event.endDate).toLocaleString()}
      </p>
      <p>
        <strong>Price:</strong> £{event.price.toFixed(2)}
      </p>
      <p>
        <strong>Available tickets:</strong> {event.availableTickets} / {event.capacity}
      </p>
      <div className="row">
        <Link to={\`/events/\${event.id}/edit\`} className="button primary">
          Edit event
        </Link>
        <button type="button" className="danger" onClick={handleDelete}>
          Delete event
        </button>
        <Link to="/events" className="button">
          Back to events
        </Link>
      </div>
    </article>
  );
}

export default EventDetails;
`;

const F056_pages_EventEdit_tsx = `import { Link, useParams } from "react-router-dom";
import { useEvent } from "../hooks/useEvent";
// TODO 3: import EventForm, useNavigate, eventService, toFormValues and the EventDto type.

function EventEdit() {
  const { id } = useParams<{ id: string }>();
  const eventId = Number(id);
  const validId = Number.isInteger(eventId) && eventId > 0;
  const { event, loading, error, notFound } = useEvent(validId ? eventId : null);

  if (!validId) return <p className="error" role="alert">Invalid event id.</p>;
  if (loading) return <p role="status">Loading event…</p>;
  if (notFound) return <p>Event not found. <Link to="/events">Back to events</Link></p>;
  if (error) return <p className="error" role="alert">{error}</p>;
  if (!event) return null;

  // TODO 3: write handleUpdate(dto): await eventService.update(eventId, dto) (PUT → 204 No Content),
  // then navigate(\`/events/\${eventId}\`). Render
  // <EventForm key={event.id} initialValues={toFormValues(event)} submitLabel="Save changes" onSubmit={handleUpdate} />
  return (
    <section>
      <h2>Edit "{event.title}"</h2>
      <p className="muted">TODO 3: the pre-filled EventForm goes here.</p>
      <p>
        <Link to={\`/events/\${eventId}\`}>Cancel</Link>
      </p>
    </section>
  );
}

export default EventEdit;
`;

const F057_pages_EventNew_tsx = `import { Link } from "react-router-dom";
// TODO 2: import { useNavigate } from "react-router-dom"; and { eventService } from "../services/eventService";
import EventForm from "../components/EventForm";
import type { EventDto } from "../types/EventDto";

function EventNew() {
  async function handleCreate(dto: EventDto) {
    // TODO 2: const created = await eventService.create(dto);   // POST → 201 + the new event
    //         navigate(\`/events/\${created.id}\`, { replace: true });
    console.log("TODO 2: send this DTO with POST /api/events:", dto);
  }

  return (
    <section>
      <h2>Create event</h2>
      <EventForm submitLabel="Create event" onSubmit={handleCreate} />
      <p>
        <Link to="/events">Cancel</Link>
      </p>
    </section>
  );
}

export default EventNew;
`;

const F058_services_api_ts = `// Real project: import.meta.env.VITE_API_URL ("http://localhost:5229/api"). Sandbox: "/api" (mock API).
export const API_URL = "/api";

// Classroom shortcut (the Frontend guide puts VITE_DEMO_ADMIN_TOKEN in .env): a fixed admin token.
// The sandbox mock accepts "fake-admin-token" for POST/PUT/DELETE ("fake-user-token" → 403, none → 401).
// Stage 6 replaces this constant with the token returned by a real login.
const DEMO_ADMIN_TOKEN = "fake-admin-token";

/** An HTTP error that remembers the status code. */
export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export interface RequestOptions extends Omit<RequestInit, "body"> {
  /** Any value: it is sent as JSON. */
  body?: unknown;
  /** Attach the admin bearer token. */
  requiresAdmin?: boolean;
}

/** Reads a body that may be JSON, plain text (ASP.NET BadRequest("…")) or empty. */
async function readBody(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function getErrorMessage(data: unknown, status: number): string {
  if (typeof data === "string" && data.trim()) return data;
  if (data && typeof data === "object") {
    const value = data as { message?: string; detail?: string; title?: string; errors?: Record<string, string[] | string> };
    // Validation problems first, so the user sees the field message rather than a generic title.
    if (value.errors) {
      const first = Object.values(value.errors)[0];
      if (Array.isArray(first) && first[0]) return first[0];
      if (typeof first === "string") return first;
    }
    if (value.message) return value.message;
    if (value.detail) return value.detail;
    if (value.title) return value.title;
  }
  if (status === 401) return "You need to log in (HTTP 401).";
  if (status === 403) return "You do not have permission to do this (HTTP 403).";
  return \`Request failed (HTTP \${status}).\`;
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, headers, requiresAdmin = false, ...rest } = options;
  const requestHeaders = new Headers(headers);
  if (body !== undefined) requestHeaders.set("Content-Type", "application/json");
  if (requiresAdmin) requestHeaders.set("Authorization", \`Bearer \${DEMO_ADMIN_TOKEN}\`);

  const response = await fetch(\`\${API_URL}\${path}\`, {
    ...rest,
    headers: requestHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new ApiError(response.status, getErrorMessage(await readBody(response), response.status));
  }

  // TODO 5: PUT and DELETE answer 204 No Content — there is NO body, so response.json() throws
  // ("Unexpected end of JSON input"). Return undefined as T when response.status === 204,
  // otherwise return (await readBody(response)) as T.
  return (await response.json()) as T;
}
`;

const F059_services_categoryService_ts = `import { request } from "./api";
import type { Category } from "../types/Category";

export const categoryService = {
  list: (signal?: AbortSignal) => request<Category[]>("/categories", { signal }),
};
`;

const F060_services_eventService_ts = `import { request } from "./api";
import type { Event } from "../types/Event";
import type { EventDto } from "../types/EventDto";

// One method per EventsController endpoint.
export const eventService = {
  list: (signal?: AbortSignal) => request<Event[]>("/events", { signal }),
  get: (id: number, signal?: AbortSignal) => request<Event>(\`/events/\${id}\`, { signal }),
  /** POST → 201 Created + the new EventDto */
  create: (dto: EventDto) => request<Event>("/events", { method: "POST", body: dto, requiresAdmin: true }),
  /** PUT → 204 No Content */
  update: (id: number, dto: EventDto) =>
    request<void>(\`/events/\${id}\`, { method: "PUT", body: dto, requiresAdmin: true }),
  /** DELETE → 204 No Content (real API: 400 if the event has bookings or reviews) */
  remove: (id: number) => request<void>(\`/events/\${id}\`, { method: "DELETE", requiresAdmin: true }),
};
`;

const F061_types_Category_ts = `export interface Category {
  id: number;
  name: string;
  description?: string | null;
}
`;

const F062_types_EventDto_ts = `// Body for POST /api/events and PUT /api/events/{id} (the backend's CreateEventDto / UpdateEventDto).
// No id, categoryName or availableTickets: the server owns those.
export interface EventDto {
  title: string;
  description: string;
  imageUrl: string | null;
  startDate: string;
  endDate: string;
  location: string;
  price: number;
  capacity: number;
  categoryId: number;
}
`;

const F063_utils_eventFormValues_ts = `import type { Event } from "../types/Event";
import type { EventDto } from "../types/EventDto";

/** Inputs always give us strings, so the form state is all strings; we convert on submit. */
export interface EventFormValues {
  title: string;
  description: string;
  imageUrl: string;
  location: string;
  startDate: string; // "YYYY-MM-DDTHH:mm" from <input type="datetime-local">
  endDate: string;
  price: string;
  capacity: string;
  categoryId: string;
}

export type EventFormErrors = Partial<Record<keyof EventFormValues, string>>;

export const emptyEventForm: EventFormValues = {
  title: "",
  description: "",
  imageUrl: "",
  location: "",
  startDate: "",
  endDate: "",
  price: "0",
  capacity: "100",
  categoryId: "",
};

/** Mirrors the backend's CreateEventDto rules (client-side validation is for UX; the server still validates). */
export function validateEvent(v: EventFormValues): EventFormErrors {
  const errors: EventFormErrors = {};
  if (!v.title.trim()) errors.title = "Title is required.";
  if (!v.startDate) errors.startDate = "Start date is required.";
  if (!v.endDate) errors.endDate = "End date is required.";
  // TODO 1: add the remaining rules:
  //  - title at most 150 characters
  //  - description and location required (after trim)
  //  - end date must be AFTER the start date (compare new Date(...) values)
  //  - price: a number between 0 and 100000
  //  - capacity: a whole number between 1 and 10000
  //  - categoryId: a category must be chosen
  //  - imageUrl (optional): if present, must start with http:// or https://
  return errors;
}

/** "2026-12-02T09:00:00" → "2026-12-02T09:00" (local time, the format datetime-local expects). */
export function toDateTimeLocal(value: string): string {
  const d = new Date(value);
  const pad = (n: number) => String(n).padStart(2, "0");
  return \`\${d.getFullYear()}-\${pad(d.getMonth() + 1)}-\${pad(d.getDate())}T\${pad(d.getHours())}:\${pad(d.getMinutes())}\`;
}

export function toFormValues(event: Event): EventFormValues {
  return {
    title: event.title,
    description: event.description,
    imageUrl: event.imageUrl ?? "",
    location: event.location,
    startDate: toDateTimeLocal(event.startDate),
    endDate: toDateTimeLocal(event.endDate),
    price: String(event.price),
    capacity: String(event.capacity),
    categoryId: String(event.categoryId),
  };
}

export function toDto(v: EventFormValues): EventDto {
  return {
    title: v.title.trim(),
    description: v.description.trim(),
    imageUrl: v.imageUrl.trim() || null,
    location: v.location.trim(),
    startDate: new Date(v.startDate).toISOString(),
    endDate: new Date(v.endDate).toISOString(),
    price: Number(v.price),
    capacity: Number(v.capacity),
    categoryId: Number(v.categoryId),
  };
}
`;

const F064_pages_EventDetails_tsx = `import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEvent } from "../hooks/useEvent";
import { eventService } from "../services/eventService";

function EventDetails() {
  const { id } = useParams<{ id: string }>();
  const eventId = Number(id);
  const validId = Number.isInteger(eventId) && eventId > 0;
  const navigate = useNavigate();
  const { event, loading, error, notFound } = useEvent(validId ? eventId : null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  async function handleDelete() {
    if (!event) return;
    if (!window.confirm(\`Delete "\${event.title}"? This cannot be undone.\`)) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await eventService.remove(event.id); // DELETE → 204 (real API: 400 if bookings/reviews exist)
      navigate("/events", { replace: true });
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Failed to delete the event.");
      setDeleting(false);
    }
  }

  if (!validId) {
    return (
      <p className="error" role="alert">
        Invalid event id: "{id}".
      </p>
    );
  }
  if (loading) return <p role="status">Loading event…</p>;
  if (notFound) {
    return (
      <section>
        <h2>Event not found</h2>
        <p>There is no event with id {eventId}.</p>
        <Link to="/events">Back to events</Link>
      </section>
    );
  }
  if (error) {
    return (
      <p className="error" role="alert">
        {error}
      </p>
    );
  }
  if (!event) return null;

  return (
    <article className="card">
      <p className="muted">{event.categoryName}</p>
      <h2>{event.title}</h2>
      <p>{event.description}</p>
      <p>
        <strong>Location:</strong> {event.location}
      </p>
      <p>
        <strong>Starts:</strong> {new Date(event.startDate).toLocaleString()}
      </p>
      <p>
        <strong>Ends:</strong> {new Date(event.endDate).toLocaleString()}
      </p>
      <p>
        <strong>Price:</strong> £{event.price.toFixed(2)}
      </p>
      <p>
        <strong>Available tickets:</strong> {event.availableTickets} / {event.capacity}
      </p>
      {deleteError && (
        <p className="error" role="alert">
          {deleteError}
        </p>
      )}
      <div className="row">
        <Link to={\`/events/\${event.id}/edit\`} className="button primary">
          Edit event
        </Link>
        <button type="button" className="danger" onClick={handleDelete} disabled={deleting}>
          {deleting ? "Deleting…" : "Delete event"}
        </button>
        <Link to="/events" className="button">
          Back to events
        </Link>
      </div>
    </article>
  );
}

export default EventDetails;
`;

const F065_pages_EventEdit_tsx = `import { Link, useNavigate, useParams } from "react-router-dom";
import EventForm from "../components/EventForm";
import { useEvent } from "../hooks/useEvent";
import { eventService } from "../services/eventService";
import type { EventDto } from "../types/EventDto";
import { toFormValues } from "../utils/eventFormValues";

function EventEdit() {
  const { id } = useParams<{ id: string }>();
  const eventId = Number(id);
  const validId = Number.isInteger(eventId) && eventId > 0;
  const navigate = useNavigate();
  const { event, loading, error, notFound } = useEvent(validId ? eventId : null);

  if (!validId) return <p className="error" role="alert">Invalid event id.</p>;
  if (loading) return <p role="status">Loading event…</p>;
  if (notFound) return <p>Event not found. <Link to="/events">Back to events</Link></p>;
  if (error) return <p className="error" role="alert">{error}</p>;
  if (!event) return null;

  async function handleUpdate(dto: EventDto) {
    await eventService.update(eventId, dto); // PUT → 204 No Content (nothing to read)
    navigate(\`/events/\${eventId}\`);
  }

  return (
    <section>
      <h2>Edit "{event.title}"</h2>
      {/* The form is rendered only after the event has loaded, so its initial state is correct.
          key: a different event id gives a fresh form instance (fresh state). */}
      <EventForm key={event.id} initialValues={toFormValues(event)} submitLabel="Save changes" onSubmit={handleUpdate} />
      <p>
        <Link to={\`/events/\${eventId}\`}>Cancel</Link>
      </p>
    </section>
  );
}

export default EventEdit;
`;

const F066_pages_EventNew_tsx = `import { Link, useNavigate } from "react-router-dom";
import EventForm from "../components/EventForm";
import { eventService } from "../services/eventService";
import type { EventDto } from "../types/EventDto";

function EventNew() {
  const navigate = useNavigate();

  async function handleCreate(dto: EventDto) {
    const created = await eventService.create(dto); // POST → 201 Created + the new EventDto
    // replace: the "new" form is not left in history, so Back does not re-open it.
    navigate(\`/events/\${created.id}\`, { replace: true });
  }

  return (
    <section>
      <h2>Create event</h2>
      <EventForm submitLabel="Create event" onSubmit={handleCreate} />
      <p>
        <Link to="/events">Cancel</Link>
      </p>
    </section>
  );
}

export default EventNew;
`;

const F067_services_api_ts = `// Real project: import.meta.env.VITE_API_URL ("http://localhost:5229/api"). Sandbox: "/api" (mock API).
export const API_URL = "/api";

// Classroom shortcut (the Frontend guide puts VITE_DEMO_ADMIN_TOKEN in .env): a fixed admin token.
// The sandbox mock accepts "fake-admin-token" for POST/PUT/DELETE ("fake-user-token" → 403, none → 401).
// Stage 6 replaces this constant with the token returned by a real login.
const DEMO_ADMIN_TOKEN = "fake-admin-token";

/** An HTTP error that remembers the status code. */
export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export interface RequestOptions extends Omit<RequestInit, "body"> {
  /** Any value: it is sent as JSON. */
  body?: unknown;
  /** Attach the admin bearer token. */
  requiresAdmin?: boolean;
}

/** Reads a body that may be JSON, plain text (ASP.NET BadRequest("…")) or empty. */
async function readBody(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function getErrorMessage(data: unknown, status: number): string {
  if (typeof data === "string" && data.trim()) return data;
  if (data && typeof data === "object") {
    const value = data as { message?: string; detail?: string; title?: string; errors?: Record<string, string[] | string> };
    // Validation problems first, so the user sees the field message rather than a generic title.
    if (value.errors) {
      const first = Object.values(value.errors)[0];
      if (Array.isArray(first) && first[0]) return first[0];
      if (typeof first === "string") return first;
    }
    if (value.message) return value.message;
    if (value.detail) return value.detail;
    if (value.title) return value.title;
  }
  if (status === 401) return "You need to log in (HTTP 401).";
  if (status === 403) return "You do not have permission to do this (HTTP 403).";
  return \`Request failed (HTTP \${status}).\`;
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, headers, requiresAdmin = false, ...rest } = options;
  const requestHeaders = new Headers(headers);
  if (body !== undefined) requestHeaders.set("Content-Type", "application/json");
  if (requiresAdmin) requestHeaders.set("Authorization", \`Bearer \${DEMO_ADMIN_TOKEN}\`);

  const response = await fetch(\`\${API_URL}\${path}\`, {
    ...rest,
    headers: requestHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new ApiError(response.status, getErrorMessage(await readBody(response), response.status));
  }

  // 204 No Content (PUT/DELETE in CampusEvents): there is no body, so response.json() would throw.
  if (response.status === 204) return undefined as T;
  return (await readBody(response)) as T;
}
`;

const F068_utils_eventFormValues_ts = `import type { Event } from "../types/Event";
import type { EventDto } from "../types/EventDto";

/** Inputs always give us strings, so the form state is all strings; we convert on submit. */
export interface EventFormValues {
  title: string;
  description: string;
  imageUrl: string;
  location: string;
  startDate: string; // "YYYY-MM-DDTHH:mm" from <input type="datetime-local">
  endDate: string;
  price: string;
  capacity: string;
  categoryId: string;
}

export type EventFormErrors = Partial<Record<keyof EventFormValues, string>>;

export const emptyEventForm: EventFormValues = {
  title: "",
  description: "",
  imageUrl: "",
  location: "",
  startDate: "",
  endDate: "",
  price: "0",
  capacity: "100",
  categoryId: "",
};

/** Mirrors the backend's CreateEventDto rules (client-side validation is for UX; the server still validates). */
export function validateEvent(v: EventFormValues): EventFormErrors {
  const errors: EventFormErrors = {};

  const title = v.title.trim();
  if (!title) errors.title = "Title is required.";
  else if (title.length > 150) errors.title = "Title must be 150 characters or fewer.";

  if (!v.description.trim()) errors.description = "Description is required.";
  if (!v.location.trim()) errors.location = "Location is required.";

  if (!v.startDate) errors.startDate = "Start date is required.";
  if (!v.endDate) errors.endDate = "End date is required.";
  else if (v.startDate && new Date(v.endDate) <= new Date(v.startDate)) {
    errors.endDate = "End date must be after the start date.";
  }

  const price = Number(v.price);
  if (v.price.trim() === "" || !Number.isFinite(price) || price < 0 || price > 100000) {
    errors.price = "Price must be a number between 0 and 100000.";
  }

  const capacity = Number(v.capacity);
  if (v.capacity.trim() === "" || !Number.isInteger(capacity) || capacity < 1 || capacity > 10000) {
    errors.capacity = "Capacity must be a whole number between 1 and 10000.";
  }

  if (!v.categoryId) errors.categoryId = "Choose a category.";

  const imageUrl = v.imageUrl.trim();
  if (imageUrl && !/^https?:\\/\\//i.test(imageUrl)) {
    errors.imageUrl = "Image URL must start with http:// or https://";
  }

  return errors;
}

/** "2026-12-02T09:00:00" → "2026-12-02T09:00" (local time, the format datetime-local expects). */
export function toDateTimeLocal(value: string): string {
  const d = new Date(value);
  const pad = (n: number) => String(n).padStart(2, "0");
  return \`\${d.getFullYear()}-\${pad(d.getMonth() + 1)}-\${pad(d.getDate())}T\${pad(d.getHours())}:\${pad(d.getMinutes())}\`;
}

export function toFormValues(event: Event): EventFormValues {
  return {
    title: event.title,
    description: event.description,
    imageUrl: event.imageUrl ?? "",
    location: event.location,
    startDate: toDateTimeLocal(event.startDate),
    endDate: toDateTimeLocal(event.endDate),
    price: String(event.price),
    capacity: String(event.capacity),
    categoryId: String(event.categoryId),
  };
}

export function toDto(v: EventFormValues): EventDto {
  return {
    title: v.title.trim(),
    description: v.description.trim(),
    imageUrl: v.imageUrl.trim() || null,
    location: v.location.trim(),
    startDate: new Date(v.startDate).toISOString(),
    endDate: new Date(v.endDate).toISOString(),
    price: Number(v.price),
    capacity: Number(v.capacity),
    categoryId: Number(v.categoryId),
  };
}
`;

const F069_App_tsx = `import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
// TODO 3: import RequireAuth and RequireAdmin from "./components/…"
import Home from "./pages/Home";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import EventNew from "./pages/EventNew";
import EventEdit from "./pages/EventEdit";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* TODO 3: wrap /profile in <Route element={<RequireAuth />}> … </Route> */}
        <Route path="/profile" element={<Profile />} />

        {/* TODO 3: wrap the admin pages in <Route element={<RequireAdmin />}> … </Route> */}
        <Route path="/events/new" element={<EventNew />} />
        <Route path="/events/:id/edit" element={<EventEdit />} />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
`;

const F070_components_Navbar_tsx = `import { NavLink } from "react-router-dom";

// TODO 5: read user, selectIsAuthenticated, selectIsAdmin and logout from useAuthStore.
//  - show "New event" only to admins
//  - logged out: Login + Register links; logged in: a Profile link with the first name + a "Log out"
//    button that calls logout() and navigate("/", { replace: true })
function Navbar() {
  return (
    <header className="site-header">
      <h1>CampusEvents</h1>
      <nav className="menu" aria-label="Main">
        <NavLink to="/" end>
          Home
        </NavLink>
        <NavLink to="/events" end>
          Events
        </NavLink>
        <NavLink to="/events/new">New event</NavLink>
        <NavLink to="/profile">Profile</NavLink>
        <NavLink to="/login">Login</NavLink>
        <NavLink to="/register">Register</NavLink>
      </nav>
    </header>
  );
}

export default Navbar;
`;

const F071_components_RequireAdmin_tsx = `import { Outlet } from "react-router-dom";

// Guard for admin-only pages (create/edit events).
export default function RequireAdmin() {
  // TODO 3: not authenticated → <Navigate to="/login" replace state={{ from: location.pathname }} />
  //         authenticated but not admin → a "403 – Admins only" message with a link back to /events
  return <Outlet />;
}
`;

const F072_components_RequireAuth_tsx = `import { Outlet } from "react-router-dom";
// TODO 3: import { Navigate, useLocation } from "react-router-dom";
// and { selectIsAuthenticated, useAuthStore } from "../store/authStore";

// Layout-style guard: <Route element={<RequireAuth />}> …protected routes… </Route>
export default function RequireAuth() {
  // TODO 3: if the user is not authenticated, return
  //   <Navigate to="/login" replace state={{ from: location.pathname }} />
  return <Outlet />;
}
`;

const F073_pages_EventDetails_tsx = `import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEvent } from "../hooks/useEvent";
import { eventService } from "../services/eventService";

function EventDetails() {
  const { id } = useParams<{ id: string }>();
  const eventId = Number(id);
  const validId = Number.isInteger(eventId) && eventId > 0;
  const navigate = useNavigate();
  const { event, loading, error, notFound } = useEvent(validId ? eventId : null);
  // TODO 5: const isAdmin = useAuthStore(selectIsAdmin); and render Edit/Delete only when isAdmin.
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  async function handleDelete() {
    if (!event) return;
    if (!window.confirm(\`Delete "\${event.title}"? This cannot be undone.\`)) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await eventService.remove(event.id); // DELETE → 204 (real API: 400 if bookings/reviews exist)
      navigate("/events", { replace: true });
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Failed to delete the event.");
      setDeleting(false);
    }
  }

  if (!validId) {
    return (
      <p className="error" role="alert">
        Invalid event id: "{id}".
      </p>
    );
  }
  if (loading) return <p role="status">Loading event…</p>;
  if (notFound) {
    return (
      <section>
        <h2>Event not found</h2>
        <p>There is no event with id {eventId}.</p>
        <Link to="/events">Back to events</Link>
      </section>
    );
  }
  if (error) {
    return (
      <p className="error" role="alert">
        {error}
      </p>
    );
  }
  if (!event) return null;

  return (
    <article className="card">
      <p className="muted">{event.categoryName}</p>
      <h2>{event.title}</h2>
      <p>{event.description}</p>
      <p>
        <strong>Location:</strong> {event.location}
      </p>
      <p>
        <strong>Starts:</strong> {new Date(event.startDate).toLocaleString()}
      </p>
      <p>
        <strong>Ends:</strong> {new Date(event.endDate).toLocaleString()}
      </p>
      <p>
        <strong>Price:</strong> £{event.price.toFixed(2)}
      </p>
      <p>
        <strong>Available tickets:</strong> {event.availableTickets} / {event.capacity}
      </p>
      {deleteError && (
        <p className="error" role="alert">
          {deleteError}
        </p>
      )}
      <div className="row">
        <Link to={\`/events/\${event.id}/edit\`} className="button primary">
          Edit event
        </Link>
        <button type="button" className="danger" onClick={handleDelete} disabled={deleting}>
          {deleting ? "Deleting…" : "Delete event"}
        </button>
        <Link to="/events" className="button">
          Back to events
        </Link>
      </div>
    </article>
  );
}

export default EventDetails;
`;

const F074_pages_Home_tsx = `import { Link } from "react-router-dom";

function Home() {
  return (
    <section>
      <h2>Welcome to CampusEvents</h2>
      <p>Discover events happening on campus.</p>
      <p>
        <Link to="/events" className="button primary">
          Browse events
        </Link>
      </p>
      <h3>Try these routes</h3>
      <ul>
        <li>
          <Link to="/events/1">/events/1</Link> — details of event 1
        </li>
        <li>
          <Link to="/events/999">/events/999</Link> — a valid id, but the API answers 404
        </li>
        <li>
          <Link to="/events/abc">/events/abc</Link> — an invalid id (no request should be sent)
        </li>
        <li>
          <Link to="/does-not-exist">/does-not-exist</Link> — no route matches → NotFound
        </li>
        <li>
          <Link to="/profile">/profile</Link> — any logged-in user (RequireAuth)
        </li>
        <li>
          <Link to="/events/new">/events/new</Link> — ADMIN only (RequireAdmin)
        </li>
      </ul>
    </section>
  );
}

export default Home;
`;

const F075_pages_Login_tsx = `import { useState } from "react";
import type { FormEvent } from "react";
// TODO 2: import useLocation/useNavigate, authService and useAuthStore.

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO 2: setSubmitting(true); const auth = await authService.login({ email, password });
    //         login(auth) (from the store); navigate(from ?? "/events", { replace: true })
    //         where from = (location.state as { from?: string } | null)?.from
    //         On error: setError(err.message) — the API answers 401 "Invalid email or password."
    setSubmitting(false);
    setError(\`TODO 2: log in \${email} with POST /api/auth/login\`);
  }

  return (
    <section>
      <h2>Login</h2>
      <p className="muted">
        Sandbox demo accounts: <code>admin@example.com</code> or <code>user@example.com</code>, password{" "}
        <code>Password123</code>.
      </p>
      <form className="stack" onSubmit={handleSubmit} noValidate>
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
        <label htmlFor="email">
          Email
          <input id="email" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label htmlFor="password">
          Password
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <div className="row">
          <button type="submit" className="primary" disabled={submitting}>
            {submitting ? "Logging in…" : "Log in"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default Login;
`;

const F076_pages_Profile_tsx = `import { useState } from "react";
import { ApiError, request } from "../services/api";
import { useAuthStore } from "../store/authStore";

// Protected page (wrapped in <RequireAuth /> in App.tsx).
function Profile() {
  const user = useAuthStore((s) => s.user);
  const expiresAt = useAuthStore((s) => s.expiresAt);
  const [probe, setProbe] = useState<string | null>(null);

  // Shows that the SERVER enforces roles, whatever the UI hides:
  // an empty POST /api/events → ADMIN: 400 (validation), USER: 403, no token: 401.
  async function probeAdminEndpoint() {
    setProbe("Sending…");
    try {
      await request<unknown>("/events", { method: "POST", body: {} });
      setProbe("Unexpected success");
    } catch (err) {
      setProbe(err instanceof ApiError ? \`HTTP \${err.status}: \${err.message}\` : String(err));
    }
  }

  // Pretend the token expired a minute ago: the guards re-render and send you to /login.
  function simulateExpiry() {
    useAuthStore.setState({ expiresAt: new Date(Date.now() - 60000).toISOString() });
  }

  if (!user) return <p>You are not logged in.</p>;

  return (
    <section className="card">
      <h2>
        {user.firstName} {user.lastName}
      </h2>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <p>
        <strong>Role (from the login response):</strong> {user.role}
      </p>
      <p>
        <strong>Token expires:</strong> {expiresAt ? new Date(expiresAt).toLocaleString() : "—"}
      </p>
      <div className="row">
        <button type="button" onClick={probeAdminEndpoint}>
          Probe POST /api/events (empty body)
        </button>
        <button type="button" onClick={simulateExpiry}>
          Simulate token expiry
        </button>
      </div>
      {probe && <p className="muted">{probe}</p>}
    </section>
  );
}

export default Profile;
`;

const F077_services_api_ts = `// Real project: import.meta.env.VITE_API_URL ("http://localhost:5229/api"). Sandbox: "/api" (mock API).
export const API_URL = "/api";

// Classroom shortcut (the Frontend guide puts VITE_DEMO_ADMIN_TOKEN in .env): a fixed admin token.
// The sandbox mock accepts "fake-admin-token" for POST/PUT/DELETE ("fake-user-token" → 403, none → 401).
// Stage 6 replaces this constant with the token returned by a real login.
const DEMO_ADMIN_TOKEN = "fake-admin-token";
// TODO 4: delete DEMO_ADMIN_TOKEN and requiresAdmin. Instead, in request():
//   const token = useAuthStore.getState().token;      // getState(): read the store outside React
//   if (token) requestHeaders.set("Authorization", \`Bearer \${token}\`);
// and when the response is 401 while a token was sent, call useAuthStore.getState().logout().
// (Then remove requiresAdmin: true from services/eventService.ts.)

/** An HTTP error that remembers the status code. */
export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export interface RequestOptions extends Omit<RequestInit, "body"> {
  /** Any value: it is sent as JSON. */
  body?: unknown;
  /** Attach the admin bearer token. */
  requiresAdmin?: boolean;
}

/** Reads a body that may be JSON, plain text (ASP.NET BadRequest("…")) or empty. */
async function readBody(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function getErrorMessage(data: unknown, status: number): string {
  if (typeof data === "string" && data.trim()) return data;
  if (data && typeof data === "object") {
    const value = data as { message?: string; detail?: string; title?: string; errors?: Record<string, string[] | string> };
    // Validation problems first, so the user sees the field message rather than a generic title.
    if (value.errors) {
      const first = Object.values(value.errors)[0];
      if (Array.isArray(first) && first[0]) return first[0];
      if (typeof first === "string") return first;
    }
    if (value.message) return value.message;
    if (value.detail) return value.detail;
    if (value.title) return value.title;
  }
  if (status === 401) return "You need to log in (HTTP 401).";
  if (status === 403) return "You do not have permission to do this (HTTP 403).";
  return \`Request failed (HTTP \${status}).\`;
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, headers, requiresAdmin = false, ...rest } = options;
  const requestHeaders = new Headers(headers);
  if (body !== undefined) requestHeaders.set("Content-Type", "application/json");
  if (requiresAdmin) requestHeaders.set("Authorization", \`Bearer \${DEMO_ADMIN_TOKEN}\`);

  const response = await fetch(\`\${API_URL}\${path}\`, {
    ...rest,
    headers: requestHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new ApiError(response.status, getErrorMessage(await readBody(response), response.status));
  }

  // 204 No Content (PUT/DELETE in CampusEvents): there is no body, so response.json() would throw.
  if (response.status === 204) return undefined as T;
  return (await readBody(response)) as T;
}
`;

const F078_services_authService_ts = `import { request } from "./api";
import type { AuthResponse, LoginDto } from "../types/Auth";

export const authService = {
  /** 200 + AuthResponse, or 401 { message: "Invalid email or password." } */
  login: (dto: LoginDto) => request<AuthResponse>("/auth/login", { method: "POST", body: dto }),
};
`;

const F079_store_authStore_ts = `import { create } from "zustand";
import type { AuthResponse, AuthUser } from "../types/Auth";

// Client state: who is logged in. Kept in memory only (a page reload logs you out):
//  - the sandbox preview has an opaque origin, so localStorage would throw here;
//  - a real app could add persist(...) from "zustand/middleware", but any token that JavaScript can
//    read can also be stolen by an XSS bug (httpOnly cookies avoid that, if the backend supports them).
export interface AuthState {
  token: string | null;
  expiresAt: string | null;
  user: AuthUser | null;
  login: (auth: AuthResponse) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  token: null,
  expiresAt: null,
  user: null,
  // TODO 1: login: (auth) => set({ token: auth.token, expiresAt: auth.expiresAt,
  //                                  user: { id: auth.userId, email: …, firstName: …, lastName: …, role: … } })
  login: (auth) => {
    void set;
    console.log("TODO 1: store the login response", auth);
  },
  // TODO 1: logout: () => set({ token: null, expiresAt: null, user: null })
  logout: () => {
    console.log("TODO 1: clear the session");
  },
}));

// TODO 1: true when there is a token AND expiresAt is in the future (Date.parse(expiresAt) > Date.now()).
export const selectIsAuthenticated = (s: AuthState): boolean => {
  void s;
  return false;
};

// TODO 1: authenticated AND s.user?.role is "ADMIN".
export const selectIsAdmin = (s: AuthState): boolean => {
  void s;
  return false;
};
`;

const F080_types_Auth_ts = `export interface LoginDto {
  email: string;
  password: string;
}

/** POST /api/auth/login → 200 AuthResponseDto */
export interface AuthResponse {
  token: string;
  expiresAt: string;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  /** Only the user's FIRST role in the real backend (an admin may come back as "USER"). */
  role: string;
}

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}
`;

const F081_App_tsx = `import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import RequireAdmin from "./components/RequireAdmin";
import RequireAuth from "./components/RequireAuth";
import Home from "./pages/Home";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import EventNew from "./pages/EventNew";
import EventEdit from "./pages/EventEdit";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Any logged-in user */}
        <Route element={<RequireAuth />}>
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* ADMIN only (UX guard — the API enforces the same rule with 401/403) */}
        <Route element={<RequireAdmin />}>
          <Route path="/events/new" element={<EventNew />} />
          <Route path="/events/:id/edit" element={<EventEdit />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
`;

const F082_components_Navbar_tsx = `import { NavLink, useNavigate } from "react-router-dom";
import { selectIsAdmin, selectIsAuthenticated, useAuthStore } from "../store/authStore";

function Navbar() {
  // One selector per value: Navbar re-renders only when one of these values changes.
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const isAdmin = useAuthStore(selectIsAdmin);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/", { replace: true });
  }

  return (
    <header className="site-header">
      <h1>CampusEvents</h1>
      <nav className="menu" aria-label="Main">
        <NavLink to="/" end>
          Home
        </NavLink>
        <NavLink to="/events" end>
          Events
        </NavLink>
        {isAdmin && <NavLink to="/events/new">New event</NavLink>}
        {isAuthenticated && user ? (
          <>
            <NavLink to="/profile">
              {user.firstName} ({user.role})
            </NavLink>
            <button type="button" onClick={handleLogout}>
              Log out
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/register">Register</NavLink>
          </>
        )}
      </nav>
    </header>
  );
}

export default Navbar;
`;

const F083_components_RequireAdmin_tsx = `import { Link, Navigate, Outlet, useLocation } from "react-router-dom";
import { selectIsAdmin, selectIsAuthenticated, useAuthStore } from "../store/authStore";

// Guard for admin-only pages. Mirrors the API: not logged in ≈ 401, logged in without the role ≈ 403.
export default function RequireAdmin() {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const isAdmin = useAuthStore(selectIsAdmin);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
  }
  if (!isAdmin) {
    return (
      <section>
        <h2>403 – Admins only</h2>
        <p>You are logged in, but your account is not allowed to manage events.</p>
        <Link to="/events">Back to events</Link>
      </section>
    );
  }
  return <Outlet />;
}
`;

const F084_components_RequireAuth_tsx = `import { Navigate, Outlet, useLocation } from "react-router-dom";
import { selectIsAuthenticated, useAuthStore } from "../store/authStore";

// Layout-style guard: <Route element={<RequireAuth />}> …protected routes… </Route>
// UX only: it stops logged-out users from SEEING the page. The API must still reject
// requests without a valid token (and it does: 401).
export default function RequireAuth() {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    // replace: don't leave the protected URL in history; state.from: return here after logging in.
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
  }
  return <Outlet />;
}
`;

const F085_pages_EventDetails_tsx = `import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEvent } from "../hooks/useEvent";
import { eventService } from "../services/eventService";
import { selectIsAdmin, useAuthStore } from "../store/authStore";

function EventDetails() {
  const { id } = useParams<{ id: string }>();
  const eventId = Number(id);
  const validId = Number.isInteger(eventId) && eventId > 0;
  const navigate = useNavigate();
  const { event, loading, error, notFound } = useEvent(validId ? eventId : null);
  // Hiding the buttons is UX only: a USER calling the API directly still gets 403.
  const isAdmin = useAuthStore(selectIsAdmin);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  async function handleDelete() {
    if (!event) return;
    if (!window.confirm(\`Delete "\${event.title}"? This cannot be undone.\`)) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await eventService.remove(event.id); // DELETE → 204 (real API: 400 if bookings/reviews exist)
      navigate("/events", { replace: true });
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Failed to delete the event.");
      setDeleting(false);
    }
  }

  if (!validId) {
    return (
      <p className="error" role="alert">
        Invalid event id: "{id}".
      </p>
    );
  }
  if (loading) return <p role="status">Loading event…</p>;
  if (notFound) {
    return (
      <section>
        <h2>Event not found</h2>
        <p>There is no event with id {eventId}.</p>
        <Link to="/events">Back to events</Link>
      </section>
    );
  }
  if (error) {
    return (
      <p className="error" role="alert">
        {error}
      </p>
    );
  }
  if (!event) return null;

  return (
    <article className="card">
      <p className="muted">{event.categoryName}</p>
      <h2>{event.title}</h2>
      <p>{event.description}</p>
      <p>
        <strong>Location:</strong> {event.location}
      </p>
      <p>
        <strong>Starts:</strong> {new Date(event.startDate).toLocaleString()}
      </p>
      <p>
        <strong>Ends:</strong> {new Date(event.endDate).toLocaleString()}
      </p>
      <p>
        <strong>Price:</strong> £{event.price.toFixed(2)}
      </p>
      <p>
        <strong>Available tickets:</strong> {event.availableTickets} / {event.capacity}
      </p>
      {deleteError && (
        <p className="error" role="alert">
          {deleteError}
        </p>
      )}
      <div className="row">
        {isAdmin && (
          <>
            <Link to={\`/events/\${event.id}/edit\`} className="button primary">
              Edit event
            </Link>
            <button type="button" className="danger" onClick={handleDelete} disabled={deleting}>
              {deleting ? "Deleting…" : "Delete event"}
            </button>
          </>
        )}
        <Link to="/events" className="button">
          Back to events
        </Link>
      </div>
    </article>
  );
}

export default EventDetails;
`;

const F086_pages_Login_tsx = `import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import { selectIsAuthenticated, useAuthStore } from "../store/authStore";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  // Where RequireAuth/RequireAdmin sent us from (or the events list by default).
  const from = (location.state as { from?: string } | null)?.from ?? "/events";

  const login = useAuthStore((s) => s.login);
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const user = useAuthStore((s) => s.user);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError("Enter your email and password.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const auth = await authService.login({ email: email.trim(), password });
      login(auth);
      navigate(from, { replace: true });
    } catch (err) {
      // 401 → "Invalid email or password." (same message for unknown email and wrong password)
      setError(err instanceof Error ? err.message : "Login failed.");
      setSubmitting(false);
    }
  }

  if (isAuthenticated && user) {
    return (
      <section>
        <h2>Login</h2>
        <p>
          You are logged in as {user.email} ({user.role}).
        </p>
        <Link to="/events">Go to events</Link>
      </section>
    );
  }

  return (
    <section>
      <h2>Login</h2>
      <p className="muted">
        Sandbox demo accounts: <code>admin@example.com</code> or <code>user@example.com</code>, password{" "}
        <code>Password123</code>.
      </p>
      <form className="stack" onSubmit={handleSubmit} noValidate>
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
        <label htmlFor="email">
          Email
          <input id="email" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label htmlFor="password">
          Password
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <div className="row">
          <button type="submit" className="primary" disabled={submitting}>
            {submitting ? "Logging in…" : "Log in"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default Login;
`;

const F087_services_api_ts = `import { selectIsAuthenticated, useAuthStore } from "../store/authStore";

// Real project: import.meta.env.VITE_API_URL ("http://localhost:5229/api"). Sandbox: "/api" (mock API).
export const API_URL = "/api";

/** An HTTP error that remembers the status code. */
export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export interface RequestOptions extends Omit<RequestInit, "body"> {
  /** Any value: it is sent as JSON. */
  body?: unknown;
}

/** Reads a body that may be JSON, plain text (ASP.NET BadRequest("…")) or empty. */
async function readBody(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function getErrorMessage(data: unknown, status: number): string {
  if (typeof data === "string" && data.trim()) return data;
  if (data && typeof data === "object") {
    const value = data as { message?: string; detail?: string; title?: string; errors?: Record<string, string[] | string> };
    if (value.errors) {
      const first = Object.values(value.errors)[0];
      if (Array.isArray(first) && first[0]) return first[0];
      if (typeof first === "string") return first;
    }
    if (value.message) return value.message;
    if (value.detail) return value.detail;
    if (value.title) return value.title;
  }
  if (status === 401) return "Your session is missing or has expired. Please log in (HTTP 401).";
  if (status === 403) return "You do not have permission to do this (HTTP 403).";
  return \`Request failed (HTTP \${status}).\`;
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, headers, ...rest } = options;
  const requestHeaders = new Headers(headers);
  if (body !== undefined) requestHeaders.set("Content-Type", "application/json");

  // Outside components we read the store with getState() — no hook, no subscription.
  const auth = useAuthStore.getState();
  if (auth.token && !selectIsAuthenticated(auth)) auth.logout(); // expired locally: don't send it
  const token = useAuthStore.getState().token;
  if (token) requestHeaders.set("Authorization", \`Bearer \${token}\`); // only ever sent to OUR API

  const response = await fetch(\`\${API_URL}\${path}\`, {
    ...rest,
    headers: requestHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    // 401 = the server did not accept our credentials (missing/invalid/expired) → end the session.
    // 403 = logged in but not allowed → keep the session and just show the message.
    if (response.status === 401 && token) useAuthStore.getState().logout();
    throw new ApiError(response.status, getErrorMessage(await readBody(response), response.status));
  }

  // 204 No Content (PUT/DELETE in CampusEvents): there is no body, so response.json() would throw.
  if (response.status === 204) return undefined as T;
  return (await readBody(response)) as T;
}
`;

const F088_services_eventService_ts = `import { request } from "./api";
import type { Event } from "../types/Event";
import type { EventDto } from "../types/EventDto";

// One method per EventsController endpoint. request() attaches the logged-in user's token;
// the server decides (401/403) — the frontend never "grants" permission.
export const eventService = {
  list: (signal?: AbortSignal) => request<Event[]>("/events", { signal }),
  get: (id: number, signal?: AbortSignal) => request<Event>(\`/events/\${id}\`, { signal }),
  /** ADMIN. POST → 201 Created + the new EventDto */
  create: (dto: EventDto) => request<Event>("/events", { method: "POST", body: dto }),
  /** ADMIN. PUT → 204 No Content */
  update: (id: number, dto: EventDto) => request<void>(\`/events/\${id}\`, { method: "PUT", body: dto }),
  /** ADMIN. DELETE → 204 No Content (real API: 400 if the event has bookings or reviews) */
  remove: (id: number) => request<void>(\`/events/\${id}\`, { method: "DELETE" }),
};
`;

const F089_store_authStore_ts = `import { create } from "zustand";
import type { AuthResponse, AuthUser } from "../types/Auth";

// Client state: who is logged in. Kept in memory only (a page reload logs you out):
//  - the sandbox preview has an opaque origin, so localStorage would throw here;
//  - a real app could add persist(...) from "zustand/middleware", but any token that JavaScript can
//    read can also be stolen by an XSS bug (httpOnly cookies avoid that, if the backend supports them).
export interface AuthState {
  token: string | null;
  expiresAt: string | null;
  user: AuthUser | null;
  login: (auth: AuthResponse) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  token: null,
  expiresAt: null,
  user: null,
  login: (auth) =>
    set({
      token: auth.token,
      expiresAt: auth.expiresAt,
      user: {
        id: auth.userId,
        email: auth.email,
        firstName: auth.firstName,
        lastName: auth.lastName,
        role: auth.role,
      },
    }),
  logout: () => set({ token: null, expiresAt: null, user: null }),
}));

// Selectors: components re-render only when the selected value changes (compared with Object.is).
export const selectIsAuthenticated = (s: AuthState): boolean =>
  s.token !== null && s.expiresAt !== null && Date.parse(s.expiresAt) > Date.now();

// The real CampusEvents login returns only the user's FIRST role, so an admin can come back as "USER";
// a robust app reads all role claims from the token or asks the server. The mock returns "ADMIN" for
// admin@example.com. Either way this only drives the UI — [Authorize(Roles = "ADMIN")] is the real check.
export const selectIsAdmin = (s: AuthState): boolean =>
  selectIsAuthenticated(s) && s.user?.role.toUpperCase() === "ADMIN";
`;

const F090_main_tsx = `import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import App from "./App";
import "./styles.css";

// TODO 1: import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// Create ONE client outside any component, e.g.
//   const queryClient = new QueryClient({
//     defaultOptions: { queries: { staleTime: 30000, retry: (failureCount, error) => … } },
//   });
// and wrap <MemoryRouter> in <QueryClientProvider client={queryClient}>.

// A real Vite app uses <BrowserRouter> here: it reads and updates the browser's address bar.
// The playground preview is an isolated srcdoc iframe without a usable URL, so we use
// <MemoryRouter>, which keeps the history in memory. Routes, Link, useParams… work the same.
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MemoryRouter initialEntries={["/"]}>
      <App />
    </MemoryRouter>
  </StrictMode>
);
`;

const F091_hooks_eventKeys_ts = `// Query keys identify cached data. Keys are arrays and match by PREFIX:
// invalidating ["events"] also matches ["events", 3].
export const eventKeys = {
  all: ["events"] as const,
  detail: (id: number) => ["events", id] as const,
};

export const categoryKeys = {
  all: ["categories"] as const,
};
`;

const F092_hooks_useCategories_ts = `import { useEffect, useState } from "react";
import { categoryService } from "../services/categoryService";
import type { Category } from "../types/Category";

// (Optional) Same refactor for categories: useQuery({ queryKey: categoryKeys.all, …, staleTime: 5 * 60 * 1000 })
export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    categoryService
      .list(controller.signal)
      .then(setCategories)
      .catch((err: unknown) => {
        if (!controller.signal.aborted) setError(err instanceof Error ? err.message : "Unable to load categories.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, []);

  return { categories, loading, error };
}
`;

const F093_hooks_useEvent_ts = `import { useEffect, useState } from "react";
import { ApiError } from "../services/api";
import { eventService } from "../services/eventService";
import type { Event } from "../types/Event";

// TODO 3: replace this hook with
//   return useQuery({ queryKey: eventKeys.detail(id ?? 0),
//                     queryFn: ({ signal }) => eventService.get(id as number, signal),
//                     enabled: id !== null });       // invalid id → no request
// Callers then use { data, isPending, error } and detect 404 with error instanceof ApiError.
/** Loads one event. Pass null to skip the request (e.g. when the URL id is invalid). */
export function useEvent(id: number | null) {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(id !== null);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (id === null) return;
    const controller = new AbortController();

    async function load(eventId: number) {
      setLoading(true);
      setError(null);
      setNotFound(false);
      setEvent(null);
      try {
        setEvent(await eventService.get(eventId, controller.signal));
      } catch (err) {
        if (controller.signal.aborted) return;
        if (err instanceof ApiError && err.status === 404) setNotFound(true);
        else setError(err instanceof Error ? err.message : "Unable to load the event.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    load(id);
    return () => controller.abort();
  }, [id]);

  return { event, loading, error, notFound };
}
`;

const F094_hooks_useEventMutations_ts = `import { useMutation, useQueryClient } from "@tanstack/react-query";
import { eventService } from "../services/eventService";
import type { EventDto } from "../types/EventDto";
import { eventKeys } from "./eventKeys";

/** POST /api/events. Example of the pattern: mutate, then update/invalidate the cache. */
export function useCreateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: EventDto) => eventService.create(dto),
    onSuccess: (created) => {
      // We already have the new event (201 body): seed its detail cache entry…
      queryClient.setQueryData(eventKeys.detail(created.id), created);
      // …and mark the list stale so it refetches when it is next shown.
      return queryClient.invalidateQueries({ queryKey: eventKeys.all, exact: true });
    },
  });
}

// TODO 4: export function useUpdateEvent(id: number)
//   mutationFn: (dto: EventDto) => eventService.update(id, dto)   (PUT → 204, no data)
//   onSuccess: () => queryClient.invalidateQueries({ queryKey: eventKeys.all })  // list + detail (prefix)
//
// TODO 4: export function useDeleteEvent()
//   mutationFn: (id: number) => eventService.remove(id)
//   onSuccess: (_data, id) => { queryClient.removeQueries({ queryKey: eventKeys.detail(id), exact: true });
//                               return queryClient.invalidateQueries({ queryKey: eventKeys.all, exact: true }); }
`;

const F095_hooks_useEvents_ts = `import { useEffect, useState } from "react";
import { eventService } from "../services/eventService";
import type { Event } from "../types/Event";

// TODO 2: replace this whole hook with
//   return useQuery({ queryKey: eventKeys.all, queryFn: ({ signal }) => eventService.list(signal) });
// TanStack Query then owns loading/error/caching/cancellation — no useState/useEffect needed.
export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      setLoading(true);
      setError(null);
      try {
        setEvents(await eventService.list(controller.signal));
      } catch (err) {
        if (controller.signal.aborted) return; // cancelled on purpose — not an error
        setError(err instanceof Error ? err.message : "Unable to load events.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, [reloadKey]);

  const reload = () => setReloadKey((k) => k + 1);

  return { events, loading, error, reload };
}
`;

const F096_pages_EventDetails_tsx = `import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEvent } from "../hooks/useEvent";
import { eventService } from "../services/eventService";
import { selectIsAdmin, useAuthStore } from "../store/authStore";

// TODO 3: use { data: event, isPending, error } from the new useEvent (404 → error instanceof ApiError && error.status === 404).
// TODO 4: const deleteEvent = useDeleteEvent(); deleteEvent.mutate(event.id, { onSuccess: () => navigate("/events", { replace: true }) })
//         and use deleteEvent.isPending / deleteEvent.error instead of the local deleting/deleteError state.
function EventDetails() {
  const { id } = useParams<{ id: string }>();
  const eventId = Number(id);
  const validId = Number.isInteger(eventId) && eventId > 0;
  const navigate = useNavigate();
  const { event, loading, error, notFound } = useEvent(validId ? eventId : null);
  // Hiding the buttons is UX only: a USER calling the API directly still gets 403.
  const isAdmin = useAuthStore(selectIsAdmin);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  async function handleDelete() {
    if (!event) return;
    if (!window.confirm(\`Delete "\${event.title}"? This cannot be undone.\`)) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await eventService.remove(event.id); // DELETE → 204 (real API: 400 if bookings/reviews exist)
      navigate("/events", { replace: true });
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Failed to delete the event.");
      setDeleting(false);
    }
  }

  if (!validId) {
    return (
      <p className="error" role="alert">
        Invalid event id: "{id}".
      </p>
    );
  }
  if (loading) return <p role="status">Loading event…</p>;
  if (notFound) {
    return (
      <section>
        <h2>Event not found</h2>
        <p>There is no event with id {eventId}.</p>
        <Link to="/events">Back to events</Link>
      </section>
    );
  }
  if (error) {
    return (
      <p className="error" role="alert">
        {error}
      </p>
    );
  }
  if (!event) return null;

  return (
    <article className="card">
      <p className="muted">{event.categoryName}</p>
      <h2>{event.title}</h2>
      <p>{event.description}</p>
      <p>
        <strong>Location:</strong> {event.location}
      </p>
      <p>
        <strong>Starts:</strong> {new Date(event.startDate).toLocaleString()}
      </p>
      <p>
        <strong>Ends:</strong> {new Date(event.endDate).toLocaleString()}
      </p>
      <p>
        <strong>Price:</strong> £{event.price.toFixed(2)}
      </p>
      <p>
        <strong>Available tickets:</strong> {event.availableTickets} / {event.capacity}
      </p>
      {deleteError && (
        <p className="error" role="alert">
          {deleteError}
        </p>
      )}
      <div className="row">
        {isAdmin && (
          <>
            <Link to={\`/events/\${event.id}/edit\`} className="button primary">
              Edit event
            </Link>
            <button type="button" className="danger" onClick={handleDelete} disabled={deleting}>
              {deleting ? "Deleting…" : "Delete event"}
            </button>
          </>
        )}
        <Link to="/events" className="button">
          Back to events
        </Link>
      </div>
    </article>
  );
}

export default EventDetails;
`;

const F097_pages_EventEdit_tsx = `import { Link, useNavigate, useParams } from "react-router-dom";
import EventForm from "../components/EventForm";
import { useEvent } from "../hooks/useEvent";
import { eventService } from "../services/eventService";
import type { EventDto } from "../types/EventDto";
import { toFormValues } from "../utils/eventFormValues";

// TODO 3: adapt to the new useEvent ({ data: event, isPending, error }).
// TODO 4: const updateEvent = useUpdateEvent(eventId); in handleUpdate: await updateEvent.mutateAsync(dto); then navigate.
function EventEdit() {
  const { id } = useParams<{ id: string }>();
  const eventId = Number(id);
  const validId = Number.isInteger(eventId) && eventId > 0;
  const navigate = useNavigate();
  const { event, loading, error, notFound } = useEvent(validId ? eventId : null);

  if (!validId) return <p className="error" role="alert">Invalid event id.</p>;
  if (loading) return <p role="status">Loading event…</p>;
  if (notFound) return <p>Event not found. <Link to="/events">Back to events</Link></p>;
  if (error) return <p className="error" role="alert">{error}</p>;
  if (!event) return null;

  async function handleUpdate(dto: EventDto) {
    await eventService.update(eventId, dto); // PUT → 204 No Content (nothing to read)
    navigate(\`/events/\${eventId}\`);
  }

  return (
    <section>
      <h2>Edit "{event.title}"</h2>
      {/* The form is rendered only after the event has loaded, so its initial state is correct.
          key: a different event id gives a fresh form instance (fresh state). */}
      <EventForm key={event.id} initialValues={toFormValues(event)} submitLabel="Save changes" onSubmit={handleUpdate} />
      <p>
        <Link to={\`/events/\${eventId}\`}>Cancel</Link>
      </p>
    </section>
  );
}

export default EventEdit;
`;

const F098_pages_EventNew_tsx = `import { Link, useNavigate } from "react-router-dom";
import EventForm from "../components/EventForm";
import { eventService } from "../services/eventService";
import type { EventDto } from "../types/EventDto";

// TODO 4: const createEvent = useCreateEvent(); const created = await createEvent.mutateAsync(dto);
function EventNew() {
  const navigate = useNavigate();

  async function handleCreate(dto: EventDto) {
    const created = await eventService.create(dto); // POST → 201 Created + the new EventDto
    // replace: the "new" form is not left in history, so Back does not re-open it.
    navigate(\`/events/\${created.id}\`, { replace: true });
  }

  return (
    <section>
      <h2>Create event</h2>
      <EventForm submitLabel="Create event" onSubmit={handleCreate} />
      <p>
        <Link to="/events">Cancel</Link>
      </p>
    </section>
  );
}

export default EventNew;
`;

const F099_pages_Events_tsx = `import { useState } from "react";
import EventCard from "../components/EventCard";
import TicketCounter from "../components/TicketCounter";
import { useEvents } from "../hooks/useEvents";

// TODO 2: after rewriting useEvents: const { data: events = [], isPending, isError, error, refetch, isFetching } = useEvents();
//         isPending → loading, isError → error.message + "Try again" (refetch()), Refresh button → refetch().
// TODO 5: show <span role="status">Refreshing…</span> while isFetching is true but data is already shown.
function Events() {
  const { events, loading, error, reload } = useEvents();
  const [search, setSearch] = useState("");
  const [availableOnly, setAvailableOnly] = useState(false);

  // The four UI states of remote data. Hooks are all called above this point.
  if (loading) return <p role="status">Loading events…</p>;
  if (error) {
    return (
      <div role="alert">
        <p className="error">{error}</p>
        <button type="button" onClick={reload}>
          Try again
        </button>
      </div>
    );
  }
  if (events.length === 0) return <p>No events found.</p>;

  const term = search.trim().toLowerCase();
  const visible = events.filter(
    (e) => e.title.toLowerCase().includes(term) && (!availableOnly || e.availableTickets > 0)
  );

  return (
    <section>
      <h2>Events</h2>
      <div className="row">
        <label>
          Search <input value={search} onChange={(e) => setSearch(e.target.value)} />
        </label>
        <label>
          <input type="checkbox" checked={availableOnly} onChange={(e) => setAvailableOnly(e.target.checked)} />{" "}
          Only events with tickets
        </label>
        <button type="button" onClick={reload}>
          Refresh
        </button>
      </div>
      {visible.length === 0 ? (
        <p>No events match.</p>
      ) : (
        visible.map((event) => (
          <EventCard key={event.id} event={event}>
            {event.availableTickets > 0 && (
              <TicketCounter price={event.price} max={Math.min(20, event.availableTickets)} />
            )}
          </EventCard>
        ))
      )}
    </section>
  );
}

export default Events;
`;

const F100_main_tsx = `import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import { ApiError } from "./services/api";
import "./styles.css";

// ONE QueryClient (= the server-state cache) for the whole app, created outside any component.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000, // data counts as fresh for 30 s (default 0 = stale immediately)
      // Default: 3 retries with exponential backoff. A 4xx (404, 401…) will not fix itself,
      // so don't retry it; retry other failures once.
      retry: (failureCount, error) => !(error instanceof ApiError && error.status < 500) && failureCount < 1,
    },
  },
});

// A real Vite app uses <BrowserRouter> here: it reads and updates the browser's address bar.
// The playground preview is an isolated srcdoc iframe without a usable URL, so we use
// <MemoryRouter>, which keeps the history in memory. Routes, Link, useParams… work the same.
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    </QueryClientProvider>
  </StrictMode>
);
`;

const F101_hooks_useCategories_ts = `import { useQuery } from "@tanstack/react-query";
import { categoryService } from "../services/categoryService";
import { categoryKeys } from "./eventKeys";

export function useCategories() {
  const query = useQuery({
    queryKey: categoryKeys.all,
    queryFn: ({ signal }) => categoryService.list(signal),
    staleTime: 5 * 60 * 1000, // categories rarely change
  });
  // Keep the shape EventForm already uses.
  return {
    categories: query.data ?? [],
    loading: query.isPending,
    error: query.error ? query.error.message : null,
  };
}
`;

const F102_hooks_useEvent_ts = `import { useQuery } from "@tanstack/react-query";
import { eventService } from "../services/eventService";
import { eventKeys } from "./eventKeys";

/** One event. Pass null (invalid URL id) to disable the query: no request is sent. */
export function useEvent(id: number | null) {
  return useQuery({
    queryKey: eventKeys.detail(id ?? 0),
    queryFn: ({ signal }) => eventService.get(id as number, signal),
    enabled: id !== null,
  });
}
`;

const F103_hooks_useEventMutations_ts = `import { useMutation, useQueryClient } from "@tanstack/react-query";
import { eventService } from "../services/eventService";
import type { EventDto } from "../types/EventDto";
import { eventKeys } from "./eventKeys";

/** POST /api/events → 201 + the created event. */
export function useCreateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: EventDto) => eventService.create(dto),
    onSuccess: (created) => {
      // We already have the new event (201 body): seed its detail cache entry…
      queryClient.setQueryData(eventKeys.detail(created.id), created);
      // …and mark the list stale (it refetches when shown). Returning the promise makes
      // mutateAsync wait for it.
      return queryClient.invalidateQueries({ queryKey: eventKeys.all, exact: true });
    },
  });
}

/** PUT /api/events/{id} → 204 No Content. */
export function useUpdateEvent(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: EventDto) => eventService.update(id, dto),
    // Prefix match: ["events"] AND ["events", id] become stale; active ones refetch now.
    onSuccess: () => queryClient.invalidateQueries({ queryKey: eventKeys.all }),
  });
}

/** DELETE /api/events/{id} → 204 No Content. */
export function useDeleteEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => eventService.remove(id),
    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: eventKeys.detail(id), exact: true }); // it no longer exists
      return queryClient.invalidateQueries({ queryKey: eventKeys.all, exact: true });
    },
  });
}
`;

const F104_hooks_useEvents_ts = `import { useQuery } from "@tanstack/react-query";
import { eventService } from "../services/eventService";
import { eventKeys } from "./eventKeys";

// Server state lives in the TanStack Query cache — not in useState and not in Zustand.
export function useEvents() {
  return useQuery({
    queryKey: eventKeys.all,
    // The signal is aborted if the query is cancelled (e.g. no component needs it any more).
    queryFn: ({ signal }) => eventService.list(signal),
  });
}
`;

const F105_pages_EventDetails_tsx = `import { Link, useNavigate, useParams } from "react-router-dom";
import { useEvent } from "../hooks/useEvent";
import { useDeleteEvent } from "../hooks/useEventMutations";
import { ApiError } from "../services/api";
import { selectIsAdmin, useAuthStore } from "../store/authStore";

function EventDetails() {
  const { id } = useParams<{ id: string }>();
  const eventId = Number(id);
  const validId = Number.isInteger(eventId) && eventId > 0;
  const navigate = useNavigate();
  const { data: event, isPending, error } = useEvent(validId ? eventId : null);
  const deleteEvent = useDeleteEvent();
  // Client state (who is logged in) still comes from Zustand. Hiding buttons is UX only.
  const isAdmin = useAuthStore(selectIsAdmin);

  if (!validId) {
    return (
      <p className="error" role="alert">
        Invalid event id: "{id}".
      </p>
    );
  }
  if (isPending) return <p role="status">Loading event…</p>;
  if (error) {
    if (error instanceof ApiError && error.status === 404) {
      return (
        <section>
          <h2>Event not found</h2>
          <p>There is no event with id {eventId}.</p>
          <Link to="/events">Back to events</Link>
        </section>
      );
    }
    return (
      <p className="error" role="alert">
        {error.message}
      </p>
    );
  }

  function handleDelete() {
    if (!event) return;
    if (!window.confirm(\`Delete "\${event.title}"? This cannot be undone.\`)) return;
    deleteEvent.mutate(event.id, {
      onSuccess: () => navigate("/events", { replace: true }),
    });
  }

  return (
    <article className="card">
      <p className="muted">{event.categoryName}</p>
      <h2>{event.title}</h2>
      <p>{event.description}</p>
      <p>
        <strong>Location:</strong> {event.location}
      </p>
      <p>
        <strong>Starts:</strong> {new Date(event.startDate).toLocaleString()}
      </p>
      <p>
        <strong>Ends:</strong> {new Date(event.endDate).toLocaleString()}
      </p>
      <p>
        <strong>Price:</strong> £{event.price.toFixed(2)}
      </p>
      <p>
        <strong>Available tickets:</strong> {event.availableTickets} / {event.capacity}
      </p>
      {deleteEvent.error && (
        <p className="error" role="alert">
          {deleteEvent.error.message}
        </p>
      )}
      <div className="row">
        {isAdmin && (
          <>
            <Link to={\`/events/\${event.id}/edit\`} className="button primary">
              Edit event
            </Link>
            <button type="button" className="danger" onClick={handleDelete} disabled={deleteEvent.isPending}>
              {deleteEvent.isPending ? "Deleting…" : "Delete event"}
            </button>
          </>
        )}
        <Link to="/events" className="button">
          Back to events
        </Link>
      </div>
    </article>
  );
}

export default EventDetails;
`;

const F106_pages_EventEdit_tsx = `import { Link, useNavigate, useParams } from "react-router-dom";
import EventForm from "../components/EventForm";
import { useEvent } from "../hooks/useEvent";
import { useUpdateEvent } from "../hooks/useEventMutations";
import { ApiError } from "../services/api";
import type { EventDto } from "../types/EventDto";
import { toFormValues } from "../utils/eventFormValues";

function EventEdit() {
  const { id } = useParams<{ id: string }>();
  const eventId = Number(id);
  const validId = Number.isInteger(eventId) && eventId > 0;
  const navigate = useNavigate();
  const { data: event, isPending, error } = useEvent(validId ? eventId : null);
  const updateEvent = useUpdateEvent(eventId);

  if (!validId) return <p className="error" role="alert">Invalid event id.</p>;
  if (isPending) return <p role="status">Loading event…</p>;
  if (error) {
    if (error instanceof ApiError && error.status === 404) {
      return <p>Event not found. <Link to="/events">Back to events</Link></p>;
    }
    return <p className="error" role="alert">{error.message}</p>;
  }

  async function handleUpdate(dto: EventDto) {
    await updateEvent.mutateAsync(dto); // PUT → 204; onSuccess invalidates ["events"]
    navigate(\`/events/\${eventId}\`);
  }

  return (
    <section>
      <h2>Edit "{event.title}"</h2>
      <EventForm key={event.id} initialValues={toFormValues(event)} submitLabel="Save changes" onSubmit={handleUpdate} />
      <p>
        <Link to={\`/events/\${eventId}\`}>Cancel</Link>
      </p>
    </section>
  );
}

export default EventEdit;
`;

const F107_pages_EventNew_tsx = `import { Link, useNavigate } from "react-router-dom";
import EventForm from "../components/EventForm";
import { useCreateEvent } from "../hooks/useEventMutations";
import type { EventDto } from "../types/EventDto";

function EventNew() {
  const navigate = useNavigate();
  const createEvent = useCreateEvent();

  async function handleCreate(dto: EventDto) {
    // mutateAsync throws on failure → EventForm catches it and shows the message.
    const created = await createEvent.mutateAsync(dto);
    navigate(\`/events/\${created.id}\`, { replace: true });
  }

  return (
    <section>
      <h2>Create event</h2>
      <EventForm submitLabel="Create event" onSubmit={handleCreate} />
      <p>
        <Link to="/events">Cancel</Link>
      </p>
    </section>
  );
}

export default EventNew;
`;

const F108_pages_Events_tsx = `import { useState } from "react";
import EventCard from "../components/EventCard";
import TicketCounter from "../components/TicketCounter";
import { useEvents } from "../hooks/useEvents";

function Events() {
  const { data: events = [], isPending, isError, error, refetch, isFetching } = useEvents();
  // Search/filter values are CLIENT state (UI only) — plain useState is right for them.
  const [search, setSearch] = useState("");
  const [availableOnly, setAvailableOnly] = useState(false);

  // isPending: no data yet (first load). isFetching: any request in flight, including background refetches.
  if (isPending) return <p role="status">Loading events…</p>;
  if (isError) {
    return (
      <div role="alert">
        <p className="error">{error.message}</p>
        <button type="button" onClick={() => refetch()}>
          Try again
        </button>
      </div>
    );
  }
  if (events.length === 0) return <p>No events found.</p>;

  const term = search.trim().toLowerCase();
  const visible = events.filter(
    (e) => e.title.toLowerCase().includes(term) && (!availableOnly || e.availableTickets > 0)
  );

  return (
    <section>
      <h2>Events</h2>
      <div className="row">
        <label>
          Search <input value={search} onChange={(e) => setSearch(e.target.value)} />
        </label>
        <label>
          <input type="checkbox" checked={availableOnly} onChange={(e) => setAvailableOnly(e.target.checked)} />{" "}
          Only events with tickets
        </label>
        <button type="button" onClick={() => refetch()}>
          Refresh
        </button>
        {isFetching && (
          <span className="muted" role="status">
            Refreshing…
          </span>
        )}
      </div>
      {visible.length === 0 ? (
        <p>No events match.</p>
      ) : (
        visible.map((event) => (
          <EventCard key={event.id} event={event}>
            {event.availableTickets > 0 && (
              <TicketCounter price={event.price} max={Math.min(20, event.availableTickets)} />
            )}
          </EventCard>
        ))
      )}
    </section>
  );
}

export default Events;
`;

const F109_components_EventForm_tsx = `import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useCategories } from "../hooks/useCategories";
import type { EventDto } from "../types/EventDto";
import { emptyEventForm, toDto, validateEvent } from "../utils/eventFormValues";
import type { EventFormErrors, EventFormValues } from "../utils/eventFormValues";

interface EventFormProps {
  initialValues?: EventFormValues;
  submitLabel: string;
  /** Receives a valid DTO. Throw (e.g. an ApiError) to show a server error inside the form. */
  onSubmit: (dto: EventDto) => Promise<void>;
}

type FieldElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

// TODO 4: when validation fails, move focus to the FIRST invalid field
// (e.g. document.getElementById(firstInvalidName)?.focus()) so keyboard users land on the problem.
// Reusable for both "create" and "edit": the page decides what happens on submit.
export default function EventForm({ initialValues = emptyEventForm, submitLabel, onSubmit }: EventFormProps) {
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories();
  const [values, setValues] = useState<EventFormValues>(initialValues);
  const [errors, setErrors] = useState<EventFormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  function handleChange(e: ChangeEvent<FieldElement>) {
    const { name, value } = e.target;
    const next = { ...values, [name]: value };
    setValues(next);
    if (submitted) setErrors(validateEvent(next)); // after the first submit, re-validate while typing
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); // stop the browser's full-page form submission
    setSubmitted(true);
    const found = validateEvent(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);
    setServerError(null);
    try {
      await onSubmit(toDto(values));
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Unexpected error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  // Shared props for each field: controlled value, and aria attributes linking it to its error.
  const field = (name: keyof EventFormValues) => ({
    id: name,
    name,
    value: values[name],
    onChange: handleChange,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? \`\${name}-error\` : undefined,
  });

  const errorFor = (name: keyof EventFormValues) =>
    errors[name] ? (
      <span id={\`\${name}-error\`} className="field-error">
        {errors[name]}
      </span>
    ) : null;

  return (
    <form className="stack" onSubmit={handleSubmit} noValidate>
      {serverError && (
        <p className="error" role="alert">
          {serverError}
        </p>
      )}

      <label htmlFor="title">
        Title
        <input {...field("title")} />
        {errorFor("title")}
      </label>

      <label htmlFor="description">
        Description
        <textarea {...field("description")} rows={3} />
        {errorFor("description")}
      </label>

      <label htmlFor="location">
        Location
        <input {...field("location")} />
        {errorFor("location")}
      </label>

      <label htmlFor="startDate">
        Starts
        <input type="datetime-local" {...field("startDate")} />
        {errorFor("startDate")}
      </label>

      <label htmlFor="endDate">
        Ends
        <input type="datetime-local" {...field("endDate")} />
        {errorFor("endDate")}
      </label>

      <label htmlFor="price">
        Price (£)
        <input type="number" min={0} step="0.01" {...field("price")} />
        {errorFor("price")}
      </label>

      <label htmlFor="capacity">
        Capacity
        <input type="number" min={1} step={1} {...field("capacity")} />
        {errorFor("capacity")}
      </label>

      <label htmlFor="categoryId">
        Category
        <select {...field("categoryId")} disabled={categoriesLoading}>
          <option value="">{categoriesLoading ? "Loading categories…" : "Choose a category…"}</option>
          {categories.map((c) => (
            <option key={c.id} value={String(c.id)}>
              {c.name}
            </option>
          ))}
        </select>
        {errorFor("categoryId")}
        {categoriesError && <span className="field-error">{categoriesError}</span>}
      </label>

      <label htmlFor="imageUrl">
        Image URL (optional)
        <input type="url" {...field("imageUrl")} placeholder="https://…" />
        {errorFor("imageUrl")}
      </label>

      <div className="row">
        <button type="submit" className="primary" disabled={submitting}>
          {submitting ? "Saving…" : submitLabel}
        </button>
      </div>
    </form>
  );
}
`;

const F110_components_Layout_tsx = `import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import SandboxTools from "./SandboxTools";

// TODO 4: add a "Skip to main content" link as the first element, give <main> id="main",
// ref={mainRef} and tabIndex={-1}, and move focus to it when location.pathname changes
// (useEffect + a ref that remembers the previous path, so the first render does not steal focus).
// Shared layout: rendered once for every page; the matched child route goes into <Outlet />.
function Layout() {
  const location = useLocation();
  return (
    <>
      <Navbar />
      {/* Sandbox only: the preview has no address bar, so we show the current path. */}
      <p className="muted current-path">
        Current path: <code>{location.pathname}{location.search}</code>
      </p>
      <main>
        <Outlet />
      </main>
      <Footer />
      <SandboxTools />
    </>
  );
}

export default Layout;
`;

const F111_components_Pagination_tsx = `interface PaginationProps {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}

// TODO 3: render <nav aria-label="Pagination"> with a "‹ Previous" button (disabled on page 1),
// the text "Page {page} of {pageCount}", and a "Next ›" button (disabled on the last page).
export default function Pagination({ page, pageCount, onPageChange }: PaginationProps) {
  void onPageChange;
  return (
    <p className="muted">
      TODO 3: pagination (page {page} of {pageCount})
    </p>
  );
}
`;

const F112_pages_Events_tsx = `import { useState } from "react";
import EventCard from "../components/EventCard";
import TicketCounter from "../components/TicketCounter";
import { useEvents } from "../hooks/useEvents";

// TODO 1: move search + "available" into the URL with useSearchParams (?q=…&available=1).
//         Write an updateParam(key, value) helper using setSearchParams(prev => …, { replace: key === "q" })
//         that deletes "page" whenever a filter changes.
// TODO 2: add a category <select> (useCategories) that filters by categoryId (?category=…).
// TODO 3: paginate on the client: const PAGE_SIZE = 2; clamp ?page, slice the filtered list,
//         and render <Pagination page pageCount onPageChange /> (components/Pagination.tsx).
// TODO 4: label every control with htmlFor/id and announce the result count with aria-live="polite".
function Events() {
  const { data: events = [], isPending, isError, error, refetch, isFetching } = useEvents();
  // Search/filter values are CLIENT state (UI only) — plain useState is right for them.
  const [search, setSearch] = useState("");
  const [availableOnly, setAvailableOnly] = useState(false);

  // isPending: no data yet (first load). isFetching: any request in flight, including background refetches.
  if (isPending) return <p role="status">Loading events…</p>;
  if (isError) {
    return (
      <div role="alert">
        <p className="error">{error.message}</p>
        <button type="button" onClick={() => refetch()}>
          Try again
        </button>
      </div>
    );
  }
  if (events.length === 0) return <p>No events found.</p>;

  const term = search.trim().toLowerCase();
  const visible = events.filter(
    (e) => e.title.toLowerCase().includes(term) && (!availableOnly || e.availableTickets > 0)
  );

  return (
    <section>
      <h2>Events</h2>
      <div className="row">
        <label>
          Search <input value={search} onChange={(e) => setSearch(e.target.value)} />
        </label>
        <label>
          <input type="checkbox" checked={availableOnly} onChange={(e) => setAvailableOnly(e.target.checked)} />{" "}
          Only events with tickets
        </label>
        <button type="button" onClick={() => refetch()}>
          Refresh
        </button>
        {isFetching && (
          <span className="muted" role="status">
            Refreshing…
          </span>
        )}
      </div>
      {visible.length === 0 ? (
        <p>No events match.</p>
      ) : (
        visible.map((event) => (
          <EventCard key={event.id} event={event}>
            {event.availableTickets > 0 && (
              <TicketCounter price={event.price} max={Math.min(20, event.availableTickets)} />
            )}
          </EventCard>
        ))
      )}
    </section>
  );
}

export default Events;
`;

const F113_styles_css = `* { box-sizing: border-box; }
body { margin: 0; font-family: system-ui, "Segoe UI", sans-serif; color: #18181b; background: #fafafa; line-height: 1.5; }
.site-header { background: #312e81; color: #fff; padding: 10px 16px; }
.site-header h1 { margin: 0; font-size: 1.4rem; }
.menu { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 6px; align-items: center; }
.menu a { color: #e0e7ff; text-decoration: none; padding: 2px 10px; border: 1px solid #6366f1; border-radius: 999px; }
.menu a.active { background: #fff; color: #312e81; font-weight: 600; }
main { display: block; padding: 12px 16px; max-width: 960px; margin: 0 auto; }
footer { padding: 12px 16px; color: #71717a; border-top: 1px solid #e4e4e7; text-align: center; }
.card { background: #fff; border: 1px solid #e4e4e7; border-radius: 10px; padding: 12px 14px; margin: 10px 0; }
.card h3 { margin: 0 0 4px; }
.card p { margin: 2px 0; }
.muted { color: #71717a; }
.error { color: #b91c1c; }
.badge { display: inline-block; font-size: 0.75rem; padding: 1px 8px; border-radius: 999px; background: #e0e7ff; color: #3730a3; }
.badge.sold-out { background: #fee2e2; color: #991b1b; }
button, .button { font: inherit; padding: 4px 12px; border: 1px solid #a1a1aa; border-radius: 6px; background: #f4f4f5; color: inherit; text-decoration: none; cursor: pointer; display: inline-block; }
button:disabled { opacity: 0.5; cursor: not-allowed; }
button.primary, .button.primary { background: #4f46e5; border-color: #4f46e5; color: #fff; }
button.danger { background: #dc2626; border-color: #dc2626; color: #fff; }
.counter { display: inline-flex; align-items: center; gap: 10px; margin-top: 6px; }
.row { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; margin: 6px 0; }
.sandbox-tools { margin: 8px 16px; padding: 6px 10px; border: 1px dashed #a1a1aa; border-radius: 8px; font-size: 0.85rem; }
form.stack { display: grid; gap: 10px; max-width: 520px; }
form.stack label { display: grid; gap: 4px; font-weight: 600; }
input, select, textarea { font: inherit; padding: 6px 8px; border: 1px solid #a1a1aa; border-radius: 6px; }
input[aria-invalid="true"], select[aria-invalid="true"], textarea[aria-invalid="true"] { border-color: #b91c1c; }
.field-error { color: #b91c1c; font-size: 0.85rem; font-weight: 400; }
.menu button { padding: 2px 10px; border-radius: 999px; background: transparent; color: #e0e7ff; border-color: #6366f1; }
.current-path { margin: 4px 16px 0; font-size: 0.8rem; }

/* TODO 5: responsive layout & focus styles:
   - .event-grid { list-style: none; padding: 0; display: grid; gap: 12px;
                   grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); }
   - .filters (a grid of labelled controls), .pagination, .skip-link (visible only when focused)
   - :focus-visible { outline: 3px solid …; outline-offset: 2px; }
   - @media (max-width: 600px) { … smaller header, tighter padding … } */
`;

const F114_components_EventForm_tsx = `import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useCategories } from "../hooks/useCategories";
import type { EventDto } from "../types/EventDto";
import { emptyEventForm, toDto, validateEvent } from "../utils/eventFormValues";
import type { EventFormErrors, EventFormValues } from "../utils/eventFormValues";

interface EventFormProps {
  initialValues?: EventFormValues;
  submitLabel: string;
  /** Receives a valid DTO. Throw (e.g. an ApiError) to show a server error inside the form. */
  onSubmit: (dto: EventDto) => Promise<void>;
}

type FieldElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

// Visual order of the fields (used to focus the first invalid one).
const FIELD_ORDER: (keyof EventFormValues)[] = [
  "title", "description", "location", "startDate", "endDate", "price", "capacity", "categoryId", "imageUrl",
];

// Reusable for both "create" and "edit": the page decides what happens on submit.
export default function EventForm({ initialValues = emptyEventForm, submitLabel, onSubmit }: EventFormProps) {
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories();
  const [values, setValues] = useState<EventFormValues>(initialValues);
  const [errors, setErrors] = useState<EventFormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  function handleChange(e: ChangeEvent<FieldElement>) {
    const { name, value } = e.target;
    const next = { ...values, [name]: value };
    setValues(next);
    if (submitted) setErrors(validateEvent(next)); // after the first submit, re-validate while typing
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); // stop the browser's full-page form submission
    setSubmitted(true);
    const found = validateEvent(values);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      // Move focus to the first invalid field: keyboard and screen-reader users land on the problem,
      // and aria-describedby makes the error message part of the field's description.
      const firstInvalid = FIELD_ORDER.find((name) => found[name]);
      if (firstInvalid) document.getElementById(firstInvalid)?.focus();
      return;
    }

    setSubmitting(true);
    setServerError(null);
    try {
      await onSubmit(toDto(values));
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Unexpected error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  // Shared props for each field: controlled value, and aria attributes linking it to its error.
  const field = (name: keyof EventFormValues) => ({
    id: name,
    name,
    value: values[name],
    onChange: handleChange,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? \`\${name}-error\` : undefined,
  });

  const errorFor = (name: keyof EventFormValues) =>
    errors[name] ? (
      <span id={\`\${name}-error\`} className="field-error">
        {errors[name]}
      </span>
    ) : null;

  return (
    <form className="stack" onSubmit={handleSubmit} noValidate>
      {serverError && (
        <p className="error" role="alert">
          {serverError}
        </p>
      )}

      <label htmlFor="title">
        Title
        <input {...field("title")} />
        {errorFor("title")}
      </label>

      <label htmlFor="description">
        Description
        <textarea {...field("description")} rows={3} />
        {errorFor("description")}
      </label>

      <label htmlFor="location">
        Location
        <input {...field("location")} />
        {errorFor("location")}
      </label>

      <label htmlFor="startDate">
        Starts
        <input type="datetime-local" {...field("startDate")} />
        {errorFor("startDate")}
      </label>

      <label htmlFor="endDate">
        Ends
        <input type="datetime-local" {...field("endDate")} />
        {errorFor("endDate")}
      </label>

      <label htmlFor="price">
        Price (£)
        <input type="number" min={0} step="0.01" {...field("price")} />
        {errorFor("price")}
      </label>

      <label htmlFor="capacity">
        Capacity
        <input type="number" min={1} step={1} {...field("capacity")} />
        {errorFor("capacity")}
      </label>

      <label htmlFor="categoryId">
        Category
        <select {...field("categoryId")} disabled={categoriesLoading}>
          <option value="">{categoriesLoading ? "Loading categories…" : "Choose a category…"}</option>
          {categories.map((c) => (
            <option key={c.id} value={String(c.id)}>
              {c.name}
            </option>
          ))}
        </select>
        {errorFor("categoryId")}
        {categoriesError && <span className="field-error">{categoriesError}</span>}
      </label>

      <label htmlFor="imageUrl">
        Image URL (optional)
        <input type="url" {...field("imageUrl")} placeholder="https://…" />
        {errorFor("imageUrl")}
      </label>

      <div className="row">
        <button type="submit" className="primary" disabled={submitting}>
          {submitting ? "Saving…" : submitLabel}
        </button>
      </div>
    </form>
  );
}
`;

const F115_components_Layout_tsx = `import { useEffect, useRef } from "react";
import type { MouseEvent } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import SandboxTools from "./SandboxTools";

function Layout() {
  const location = useLocation();
  const mainRef = useRef<HTMLElement>(null);
  const previousPath = useRef(location.pathname);

  // After client-side navigation, move focus to <main> so keyboard and screen-reader users
  // start at the new content (a full page load would have reset focus for them).
  // Only when the PATH changes — not on every ?q= change while typing in the search box.
  useEffect(() => {
    if (previousPath.current !== location.pathname) {
      previousPath.current = location.pathname;
      mainRef.current?.focus();
    }
  }, [location.pathname]);

  function skipToContent(e: MouseEvent<HTMLAnchorElement>) {
    e.preventDefault(); // just move focus; no fragment navigation needed
    mainRef.current?.focus();
  }

  return (
    <>
      {/* First focusable element: lets keyboard users jump over the navigation. */}
      <a href="#main" className="skip-link" onClick={skipToContent}>
        Skip to main content
      </a>
      <Navbar />
      {/* Sandbox only: the preview has no address bar, so we show the current path. */}
      <p className="muted current-path">
        Current path: <code>{location.pathname}{location.search}</code>
      </p>
      {/* tabIndex={-1}: focusable from code, but not added to the Tab order. */}
      <main id="main" ref={mainRef} tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
      <SandboxTools />
    </>
  );
}

export default Layout;
`;

const F116_components_Pagination_tsx = `interface PaginationProps {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ page, pageCount, onPageChange }: PaginationProps) {
  return (
    <nav className="pagination" aria-label="Pagination">
      <button type="button" onClick={() => onPageChange(page - 1)} disabled={page <= 1}>
        ‹ Previous
      </button>
      <span>
        Page {page} of {pageCount}
      </span>
      <button type="button" onClick={() => onPageChange(page + 1)} disabled={page >= pageCount}>
        Next ›
      </button>
    </nav>
  );
}
`;

const F117_pages_Events_tsx = `import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import EventCard from "../components/EventCard";
import Pagination from "../components/Pagination";
import TicketCounter from "../components/TicketCounter";
import { useCategories } from "../hooks/useCategories";
import { useEvents } from "../hooks/useEvents";

const PAGE_SIZE = 2; // small on purpose: the mock API only has 3 events

function Events() {
  const { data: events = [], isPending, isError, error, refetch, isFetching } = useEvents();
  const { categories } = useCategories();

  // Filters live in the URL (?q=music&category=3&available=1&page=2): shareable, bookmarkable,
  // and Back/Forward work. Search param values are always strings (or null).
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const category = searchParams.get("category") ?? "";
  const availableOnly = searchParams.get("available") === "1";
  const requestedPage = Number(searchParams.get("page") ?? "1");

  function updateParam(key: string, value: string) {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value) next.set(key, value);
        else next.delete(key);
        if (key !== "page") next.delete("page"); // a new filter starts again at page 1
        return next;
      },
      // Typing should not create one history entry per keystroke.
      { replace: key === "q" }
    );
  }

  // Derived data (the API has no search/paging parameters, so we filter on the client).
  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return events.filter(
      (e) =>
        e.title.toLowerCase().includes(term) &&
        (!category || e.categoryId === Number(category)) &&
        (!availableOnly || e.availableTickets > 0)
    );
  }, [events, q, category, availableOnly]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  // Never trust the URL: clamp ?page=99 or ?page=abc to a valid page.
  const page = Number.isInteger(requestedPage) ? Math.min(Math.max(1, requestedPage), pageCount) : 1;
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (isPending) return <p role="status">Loading events…</p>;
  if (isError) {
    return (
      <div role="alert">
        <p className="error">{error.message}</p>
        <button type="button" onClick={() => refetch()}>
          Try again
        </button>
      </div>
    );
  }

  return (
    <section aria-labelledby="events-heading">
      <h2 id="events-heading">Events</h2>

      <div className="filters">
        <label htmlFor="search">
          Search
          <input
            id="search"
            type="search"
            value={q}
            onChange={(e) => updateParam("q", e.target.value)}
            placeholder="Event title…"
          />
        </label>
        <label htmlFor="category">
          Category
          <select id="category" value={category} onChange={(e) => updateParam("category", e.target.value)}>
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={String(c.id)}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label htmlFor="available" className="checkbox">
          <input
            id="available"
            type="checkbox"
            checked={availableOnly}
            onChange={(e) => updateParam("available", e.target.checked ? "1" : "")}
          />
          Only events with tickets
        </label>
        <button type="button" onClick={() => refetch()}>
          Refresh
        </button>
      </div>

      {/* aria-live: screen readers announce the new count when the filters change. */}
      <p className="muted" aria-live="polite">
        {filtered.length} {filtered.length === 1 ? "event" : "events"} found
        {isFetching ? " · refreshing…" : ""}
      </p>

      {events.length === 0 ? (
        <p>No events found.</p>
      ) : pageItems.length === 0 ? (
        <p>No events match these filters.</p>
      ) : (
        <ul className="event-grid">
          {pageItems.map((event) => (
            <li key={event.id}>
              <EventCard event={event}>
                {event.availableTickets > 0 && (
                  <TicketCounter price={event.price} max={Math.min(20, event.availableTickets)} />
                )}
              </EventCard>
            </li>
          ))}
        </ul>
      )}

      {pageCount > 1 && (
        <Pagination page={page} pageCount={pageCount} onPageChange={(p) => updateParam("page", String(p))} />
      )}
    </section>
  );
}

export default Events;
`;

const F118_styles_css = `* { box-sizing: border-box; }
body { margin: 0; font-family: system-ui, "Segoe UI", sans-serif; color: #18181b; background: #fafafa; line-height: 1.5; }
.site-header { background: #312e81; color: #fff; padding: 10px 16px; }
.site-header h1 { margin: 0; font-size: 1.4rem; }
.menu { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 6px; align-items: center; }
.menu a { color: #e0e7ff; text-decoration: none; padding: 2px 10px; border: 1px solid #6366f1; border-radius: 999px; }
.menu a.active { background: #fff; color: #312e81; font-weight: 600; }
main { display: block; padding: 12px 16px; max-width: 960px; margin: 0 auto; }
footer { padding: 12px 16px; color: #71717a; border-top: 1px solid #e4e4e7; text-align: center; }
.card { background: #fff; border: 1px solid #e4e4e7; border-radius: 10px; padding: 12px 14px; margin: 10px 0; }
.card h3 { margin: 0 0 4px; }
.card p { margin: 2px 0; }
.muted { color: #71717a; }
.error { color: #b91c1c; }
.badge { display: inline-block; font-size: 0.75rem; padding: 1px 8px; border-radius: 999px; background: #e0e7ff; color: #3730a3; }
.badge.sold-out { background: #fee2e2; color: #991b1b; }
button, .button { font: inherit; padding: 4px 12px; border: 1px solid #a1a1aa; border-radius: 6px; background: #f4f4f5; color: inherit; text-decoration: none; cursor: pointer; display: inline-block; }
button:disabled { opacity: 0.5; cursor: not-allowed; }
button.primary, .button.primary { background: #4f46e5; border-color: #4f46e5; color: #fff; }
button.danger { background: #dc2626; border-color: #dc2626; color: #fff; }
.counter { display: inline-flex; align-items: center; gap: 10px; margin-top: 6px; }
.row { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; margin: 6px 0; }
.sandbox-tools { margin: 8px 16px; padding: 6px 10px; border: 1px dashed #a1a1aa; border-radius: 8px; font-size: 0.85rem; }
form.stack { display: grid; gap: 10px; max-width: 520px; }
form.stack label { display: grid; gap: 4px; font-weight: 600; }
input, select, textarea { font: inherit; padding: 6px 8px; border: 1px solid #a1a1aa; border-radius: 6px; }
input[aria-invalid="true"], select[aria-invalid="true"], textarea[aria-invalid="true"] { border-color: #b91c1c; }
.field-error { color: #b91c1c; font-size: 0.85rem; font-weight: 400; }
.menu button { padding: 2px 10px; border-radius: 999px; background: transparent; color: #e0e7ff; border-color: #6366f1; }
.current-path { margin: 4px 16px 0; font-size: 0.8rem; }

/* ---- Stage 8: responsive layout & accessibility ---- */
.event-grid { list-style: none; padding: 0; margin: 0; display: grid; gap: 12px; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); }
.event-grid .card { margin: 0; height: 100%; }
.filters { display: grid; gap: 10px; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); align-items: end; margin-bottom: 8px; }
.filters label { display: grid; gap: 4px; font-weight: 600; }
.filters label.checkbox { display: flex; align-items: center; gap: 6px; font-weight: 400; }
.pagination { display: flex; gap: 12px; align-items: center; justify-content: center; margin: 16px 0; }
:focus-visible { outline: 3px solid #f59e0b; outline-offset: 2px; }
main:focus { outline: none; } /* programmatic focus target only, not an interactive control */
.skip-link { position: absolute; left: 8px; top: -48px; background: #fff; color: #312e81; padding: 6px 10px; border-radius: 6px; z-index: 10; }
.skip-link:focus { top: 8px; }
@media (max-width: 600px) {
  .site-header h1 { font-size: 1.15rem; }
  main { padding: 8px 12px; }
  .menu { gap: 6px; }
}
`;

/* ------------------------------ projects ------------------------------ */

const S1S: Record<string, string> = {
  "main.tsx": F001_main_tsx,
  "App.tsx": F002_App_tsx,
  "components/EventCard.tsx": F003_components_EventCard_tsx,
  "components/Footer.tsx": F004_components_Footer_tsx,
  "components/Navbar.tsx": F005_components_Navbar_tsx,
  "components/TicketCounter.tsx": F006_components_TicketCounter_tsx,
  "pages/Events.tsx": F007_pages_Events_tsx,
  "pages/Home.tsx": F008_pages_Home_tsx,
  "pages/Login.tsx": F009_pages_Login_tsx,
  "pages/Register.tsx": F010_pages_Register_tsx,
  "styles.css": F011_styles_css,
};

const S1R: Record<string, string> = {
  "main.tsx": F001_main_tsx,
  "App.tsx": F012_App_tsx,
  "components/EventCard.tsx": F013_components_EventCard_tsx,
  "components/Footer.tsx": F014_components_Footer_tsx,
  "components/Navbar.tsx": F005_components_Navbar_tsx,
  "components/TicketCounter.tsx": F015_components_TicketCounter_tsx,
  "pages/Events.tsx": F016_pages_Events_tsx,
  "pages/Home.tsx": F008_pages_Home_tsx,
  "pages/Login.tsx": F009_pages_Login_tsx,
  "pages/Register.tsx": F010_pages_Register_tsx,
  "styles.css": F011_styles_css,
};

const S2S: Record<string, string> = {
  "main.tsx": F001_main_tsx,
  "App.tsx": F012_App_tsx,
  "components/EventCard.tsx": F017_components_EventCard_tsx,
  "components/Footer.tsx": F014_components_Footer_tsx,
  "components/Navbar.tsx": F005_components_Navbar_tsx,
  "components/TicketCounter.tsx": F018_components_TicketCounter_tsx,
  "data/sampleEvents.ts": F019_data_sampleEvents_ts,
  "pages/Events.tsx": F020_pages_Events_tsx,
  "pages/Home.tsx": F008_pages_Home_tsx,
  "pages/Login.tsx": F009_pages_Login_tsx,
  "pages/Register.tsx": F010_pages_Register_tsx,
  "styles.css": F011_styles_css,
  "types/Event.ts": F021_types_Event_ts,
};

const S2R: Record<string, string> = {
  "main.tsx": F001_main_tsx,
  "App.tsx": F012_App_tsx,
  "components/EventCard.tsx": F022_components_EventCard_tsx,
  "components/Footer.tsx": F014_components_Footer_tsx,
  "components/Navbar.tsx": F005_components_Navbar_tsx,
  "components/TicketCounter.tsx": F023_components_TicketCounter_tsx,
  "data/sampleEvents.ts": F019_data_sampleEvents_ts,
  "pages/Events.tsx": F024_pages_Events_tsx,
  "pages/Home.tsx": F008_pages_Home_tsx,
  "pages/Login.tsx": F009_pages_Login_tsx,
  "pages/Register.tsx": F010_pages_Register_tsx,
  "styles.css": F011_styles_css,
  "types/Event.ts": F021_types_Event_ts,
};

const S3S: Record<string, string> = {
  "main.tsx": F001_main_tsx,
  "App.tsx": F025_App_tsx,
  "components/EventCard.tsx": F022_components_EventCard_tsx,
  "components/Footer.tsx": F014_components_Footer_tsx,
  "components/Navbar.tsx": F005_components_Navbar_tsx,
  "components/SandboxTools.tsx": F026_components_SandboxTools_tsx,
  "components/TicketCounter.tsx": F023_components_TicketCounter_tsx,
  "hooks/useEvents.ts": F027_hooks_useEvents_ts,
  "pages/Events.tsx": F028_pages_Events_tsx,
  "pages/Home.tsx": F008_pages_Home_tsx,
  "pages/Login.tsx": F009_pages_Login_tsx,
  "pages/Register.tsx": F010_pages_Register_tsx,
  "services/eventService.ts": F029_services_eventService_ts,
  "styles.css": F011_styles_css,
  "types/Event.ts": F021_types_Event_ts,
};

const S3R: Record<string, string> = {
  "main.tsx": F001_main_tsx,
  "App.tsx": F025_App_tsx,
  "components/EventCard.tsx": F022_components_EventCard_tsx,
  "components/Footer.tsx": F014_components_Footer_tsx,
  "components/Navbar.tsx": F005_components_Navbar_tsx,
  "components/SandboxTools.tsx": F026_components_SandboxTools_tsx,
  "components/TicketCounter.tsx": F023_components_TicketCounter_tsx,
  "hooks/useEvents.ts": F030_hooks_useEvents_ts,
  "pages/Events.tsx": F031_pages_Events_tsx,
  "pages/Home.tsx": F008_pages_Home_tsx,
  "pages/Login.tsx": F009_pages_Login_tsx,
  "pages/Register.tsx": F010_pages_Register_tsx,
  "services/eventService.ts": F032_services_eventService_ts,
  "styles.css": F011_styles_css,
  "types/Event.ts": F021_types_Event_ts,
};

const S4S: Record<string, string> = {
  "main.tsx": F033_main_tsx,
  "App.tsx": F034_App_tsx,
  "components/EventCard.tsx": F035_components_EventCard_tsx,
  "components/Footer.tsx": F014_components_Footer_tsx,
  "components/Layout.tsx": F036_components_Layout_tsx,
  "components/Navbar.tsx": F037_components_Navbar_tsx,
  "components/SandboxTools.tsx": F026_components_SandboxTools_tsx,
  "components/TicketCounter.tsx": F023_components_TicketCounter_tsx,
  "hooks/useEvent.ts": F038_hooks_useEvent_ts,
  "hooks/useEvents.ts": F030_hooks_useEvents_ts,
  "pages/EventDetails.tsx": F039_pages_EventDetails_tsx,
  "pages/Events.tsx": F031_pages_Events_tsx,
  "pages/Home.tsx": F040_pages_Home_tsx,
  "pages/Login.tsx": F009_pages_Login_tsx,
  "pages/NotFound.tsx": F041_pages_NotFound_tsx,
  "pages/Register.tsx": F010_pages_Register_tsx,
  "services/eventService.ts": F042_services_eventService_ts,
  "styles.css": F011_styles_css,
  "types/Event.ts": F021_types_Event_ts,
};

const S4R: Record<string, string> = {
  "main.tsx": F033_main_tsx,
  "App.tsx": F043_App_tsx,
  "components/EventCard.tsx": F044_components_EventCard_tsx,
  "components/Footer.tsx": F014_components_Footer_tsx,
  "components/Layout.tsx": F045_components_Layout_tsx,
  "components/Navbar.tsx": F046_components_Navbar_tsx,
  "components/SandboxTools.tsx": F026_components_SandboxTools_tsx,
  "components/TicketCounter.tsx": F023_components_TicketCounter_tsx,
  "hooks/useEvent.ts": F047_hooks_useEvent_ts,
  "hooks/useEvents.ts": F030_hooks_useEvents_ts,
  "pages/EventDetails.tsx": F048_pages_EventDetails_tsx,
  "pages/Events.tsx": F031_pages_Events_tsx,
  "pages/Home.tsx": F040_pages_Home_tsx,
  "pages/Login.tsx": F009_pages_Login_tsx,
  "pages/NotFound.tsx": F041_pages_NotFound_tsx,
  "pages/Register.tsx": F010_pages_Register_tsx,
  "services/eventService.ts": F042_services_eventService_ts,
  "styles.css": F011_styles_css,
  "types/Event.ts": F021_types_Event_ts,
};

const S5S: Record<string, string> = {
  "main.tsx": F033_main_tsx,
  "App.tsx": F049_App_tsx,
  "components/EventCard.tsx": F044_components_EventCard_tsx,
  "components/EventForm.tsx": F050_components_EventForm_tsx,
  "components/Footer.tsx": F014_components_Footer_tsx,
  "components/Layout.tsx": F045_components_Layout_tsx,
  "components/Navbar.tsx": F051_components_Navbar_tsx,
  "components/SandboxTools.tsx": F026_components_SandboxTools_tsx,
  "components/TicketCounter.tsx": F023_components_TicketCounter_tsx,
  "hooks/useCategories.ts": F052_hooks_useCategories_ts,
  "hooks/useEvent.ts": F053_hooks_useEvent_ts,
  "hooks/useEvents.ts": F054_hooks_useEvents_ts,
  "pages/EventDetails.tsx": F055_pages_EventDetails_tsx,
  "pages/EventEdit.tsx": F056_pages_EventEdit_tsx,
  "pages/EventNew.tsx": F057_pages_EventNew_tsx,
  "pages/Events.tsx": F031_pages_Events_tsx,
  "pages/Home.tsx": F040_pages_Home_tsx,
  "pages/Login.tsx": F009_pages_Login_tsx,
  "pages/NotFound.tsx": F041_pages_NotFound_tsx,
  "pages/Register.tsx": F010_pages_Register_tsx,
  "services/api.ts": F058_services_api_ts,
  "services/categoryService.ts": F059_services_categoryService_ts,
  "services/eventService.ts": F060_services_eventService_ts,
  "styles.css": F011_styles_css,
  "types/Category.ts": F061_types_Category_ts,
  "types/Event.ts": F021_types_Event_ts,
  "types/EventDto.ts": F062_types_EventDto_ts,
  "utils/eventFormValues.ts": F063_utils_eventFormValues_ts,
};

const S5R: Record<string, string> = {
  "main.tsx": F033_main_tsx,
  "App.tsx": F049_App_tsx,
  "components/EventCard.tsx": F044_components_EventCard_tsx,
  "components/EventForm.tsx": F050_components_EventForm_tsx,
  "components/Footer.tsx": F014_components_Footer_tsx,
  "components/Layout.tsx": F045_components_Layout_tsx,
  "components/Navbar.tsx": F051_components_Navbar_tsx,
  "components/SandboxTools.tsx": F026_components_SandboxTools_tsx,
  "components/TicketCounter.tsx": F023_components_TicketCounter_tsx,
  "hooks/useCategories.ts": F052_hooks_useCategories_ts,
  "hooks/useEvent.ts": F053_hooks_useEvent_ts,
  "hooks/useEvents.ts": F054_hooks_useEvents_ts,
  "pages/EventDetails.tsx": F064_pages_EventDetails_tsx,
  "pages/EventEdit.tsx": F065_pages_EventEdit_tsx,
  "pages/EventNew.tsx": F066_pages_EventNew_tsx,
  "pages/Events.tsx": F031_pages_Events_tsx,
  "pages/Home.tsx": F040_pages_Home_tsx,
  "pages/Login.tsx": F009_pages_Login_tsx,
  "pages/NotFound.tsx": F041_pages_NotFound_tsx,
  "pages/Register.tsx": F010_pages_Register_tsx,
  "services/api.ts": F067_services_api_ts,
  "services/categoryService.ts": F059_services_categoryService_ts,
  "services/eventService.ts": F060_services_eventService_ts,
  "styles.css": F011_styles_css,
  "types/Category.ts": F061_types_Category_ts,
  "types/Event.ts": F021_types_Event_ts,
  "types/EventDto.ts": F062_types_EventDto_ts,
  "utils/eventFormValues.ts": F068_utils_eventFormValues_ts,
};

const S6S: Record<string, string> = {
  "main.tsx": F033_main_tsx,
  "App.tsx": F069_App_tsx,
  "components/EventCard.tsx": F044_components_EventCard_tsx,
  "components/EventForm.tsx": F050_components_EventForm_tsx,
  "components/Footer.tsx": F014_components_Footer_tsx,
  "components/Layout.tsx": F045_components_Layout_tsx,
  "components/Navbar.tsx": F070_components_Navbar_tsx,
  "components/RequireAdmin.tsx": F071_components_RequireAdmin_tsx,
  "components/RequireAuth.tsx": F072_components_RequireAuth_tsx,
  "components/SandboxTools.tsx": F026_components_SandboxTools_tsx,
  "components/TicketCounter.tsx": F023_components_TicketCounter_tsx,
  "hooks/useCategories.ts": F052_hooks_useCategories_ts,
  "hooks/useEvent.ts": F053_hooks_useEvent_ts,
  "hooks/useEvents.ts": F054_hooks_useEvents_ts,
  "pages/EventDetails.tsx": F073_pages_EventDetails_tsx,
  "pages/EventEdit.tsx": F065_pages_EventEdit_tsx,
  "pages/EventNew.tsx": F066_pages_EventNew_tsx,
  "pages/Events.tsx": F031_pages_Events_tsx,
  "pages/Home.tsx": F074_pages_Home_tsx,
  "pages/Login.tsx": F075_pages_Login_tsx,
  "pages/NotFound.tsx": F041_pages_NotFound_tsx,
  "pages/Profile.tsx": F076_pages_Profile_tsx,
  "pages/Register.tsx": F010_pages_Register_tsx,
  "services/api.ts": F077_services_api_ts,
  "services/authService.ts": F078_services_authService_ts,
  "services/categoryService.ts": F059_services_categoryService_ts,
  "services/eventService.ts": F060_services_eventService_ts,
  "store/authStore.ts": F079_store_authStore_ts,
  "styles.css": F011_styles_css,
  "types/Auth.ts": F080_types_Auth_ts,
  "types/Category.ts": F061_types_Category_ts,
  "types/Event.ts": F021_types_Event_ts,
  "types/EventDto.ts": F062_types_EventDto_ts,
  "utils/eventFormValues.ts": F068_utils_eventFormValues_ts,
};

const S6R: Record<string, string> = {
  "main.tsx": F033_main_tsx,
  "App.tsx": F081_App_tsx,
  "components/EventCard.tsx": F044_components_EventCard_tsx,
  "components/EventForm.tsx": F050_components_EventForm_tsx,
  "components/Footer.tsx": F014_components_Footer_tsx,
  "components/Layout.tsx": F045_components_Layout_tsx,
  "components/Navbar.tsx": F082_components_Navbar_tsx,
  "components/RequireAdmin.tsx": F083_components_RequireAdmin_tsx,
  "components/RequireAuth.tsx": F084_components_RequireAuth_tsx,
  "components/SandboxTools.tsx": F026_components_SandboxTools_tsx,
  "components/TicketCounter.tsx": F023_components_TicketCounter_tsx,
  "hooks/useCategories.ts": F052_hooks_useCategories_ts,
  "hooks/useEvent.ts": F053_hooks_useEvent_ts,
  "hooks/useEvents.ts": F054_hooks_useEvents_ts,
  "pages/EventDetails.tsx": F085_pages_EventDetails_tsx,
  "pages/EventEdit.tsx": F065_pages_EventEdit_tsx,
  "pages/EventNew.tsx": F066_pages_EventNew_tsx,
  "pages/Events.tsx": F031_pages_Events_tsx,
  "pages/Home.tsx": F074_pages_Home_tsx,
  "pages/Login.tsx": F086_pages_Login_tsx,
  "pages/NotFound.tsx": F041_pages_NotFound_tsx,
  "pages/Profile.tsx": F076_pages_Profile_tsx,
  "pages/Register.tsx": F010_pages_Register_tsx,
  "services/api.ts": F087_services_api_ts,
  "services/authService.ts": F078_services_authService_ts,
  "services/categoryService.ts": F059_services_categoryService_ts,
  "services/eventService.ts": F088_services_eventService_ts,
  "store/authStore.ts": F089_store_authStore_ts,
  "styles.css": F011_styles_css,
  "types/Auth.ts": F080_types_Auth_ts,
  "types/Category.ts": F061_types_Category_ts,
  "types/Event.ts": F021_types_Event_ts,
  "types/EventDto.ts": F062_types_EventDto_ts,
  "utils/eventFormValues.ts": F068_utils_eventFormValues_ts,
};

const S7S: Record<string, string> = {
  "main.tsx": F090_main_tsx,
  "App.tsx": F081_App_tsx,
  "components/EventCard.tsx": F044_components_EventCard_tsx,
  "components/EventForm.tsx": F050_components_EventForm_tsx,
  "components/Footer.tsx": F014_components_Footer_tsx,
  "components/Layout.tsx": F045_components_Layout_tsx,
  "components/Navbar.tsx": F082_components_Navbar_tsx,
  "components/RequireAdmin.tsx": F083_components_RequireAdmin_tsx,
  "components/RequireAuth.tsx": F084_components_RequireAuth_tsx,
  "components/SandboxTools.tsx": F026_components_SandboxTools_tsx,
  "components/TicketCounter.tsx": F023_components_TicketCounter_tsx,
  "hooks/eventKeys.ts": F091_hooks_eventKeys_ts,
  "hooks/useCategories.ts": F092_hooks_useCategories_ts,
  "hooks/useEvent.ts": F093_hooks_useEvent_ts,
  "hooks/useEventMutations.ts": F094_hooks_useEventMutations_ts,
  "hooks/useEvents.ts": F095_hooks_useEvents_ts,
  "pages/EventDetails.tsx": F096_pages_EventDetails_tsx,
  "pages/EventEdit.tsx": F097_pages_EventEdit_tsx,
  "pages/EventNew.tsx": F098_pages_EventNew_tsx,
  "pages/Events.tsx": F099_pages_Events_tsx,
  "pages/Home.tsx": F074_pages_Home_tsx,
  "pages/Login.tsx": F086_pages_Login_tsx,
  "pages/NotFound.tsx": F041_pages_NotFound_tsx,
  "pages/Profile.tsx": F076_pages_Profile_tsx,
  "pages/Register.tsx": F010_pages_Register_tsx,
  "services/api.ts": F087_services_api_ts,
  "services/authService.ts": F078_services_authService_ts,
  "services/categoryService.ts": F059_services_categoryService_ts,
  "services/eventService.ts": F088_services_eventService_ts,
  "store/authStore.ts": F089_store_authStore_ts,
  "styles.css": F011_styles_css,
  "types/Auth.ts": F080_types_Auth_ts,
  "types/Category.ts": F061_types_Category_ts,
  "types/Event.ts": F021_types_Event_ts,
  "types/EventDto.ts": F062_types_EventDto_ts,
  "utils/eventFormValues.ts": F068_utils_eventFormValues_ts,
};

const S7R: Record<string, string> = {
  "main.tsx": F100_main_tsx,
  "App.tsx": F081_App_tsx,
  "components/EventCard.tsx": F044_components_EventCard_tsx,
  "components/EventForm.tsx": F050_components_EventForm_tsx,
  "components/Footer.tsx": F014_components_Footer_tsx,
  "components/Layout.tsx": F045_components_Layout_tsx,
  "components/Navbar.tsx": F082_components_Navbar_tsx,
  "components/RequireAdmin.tsx": F083_components_RequireAdmin_tsx,
  "components/RequireAuth.tsx": F084_components_RequireAuth_tsx,
  "components/SandboxTools.tsx": F026_components_SandboxTools_tsx,
  "components/TicketCounter.tsx": F023_components_TicketCounter_tsx,
  "hooks/eventKeys.ts": F091_hooks_eventKeys_ts,
  "hooks/useCategories.ts": F101_hooks_useCategories_ts,
  "hooks/useEvent.ts": F102_hooks_useEvent_ts,
  "hooks/useEventMutations.ts": F103_hooks_useEventMutations_ts,
  "hooks/useEvents.ts": F104_hooks_useEvents_ts,
  "pages/EventDetails.tsx": F105_pages_EventDetails_tsx,
  "pages/EventEdit.tsx": F106_pages_EventEdit_tsx,
  "pages/EventNew.tsx": F107_pages_EventNew_tsx,
  "pages/Events.tsx": F108_pages_Events_tsx,
  "pages/Home.tsx": F074_pages_Home_tsx,
  "pages/Login.tsx": F086_pages_Login_tsx,
  "pages/NotFound.tsx": F041_pages_NotFound_tsx,
  "pages/Profile.tsx": F076_pages_Profile_tsx,
  "pages/Register.tsx": F010_pages_Register_tsx,
  "services/api.ts": F087_services_api_ts,
  "services/authService.ts": F078_services_authService_ts,
  "services/categoryService.ts": F059_services_categoryService_ts,
  "services/eventService.ts": F088_services_eventService_ts,
  "store/authStore.ts": F089_store_authStore_ts,
  "styles.css": F011_styles_css,
  "types/Auth.ts": F080_types_Auth_ts,
  "types/Category.ts": F061_types_Category_ts,
  "types/Event.ts": F021_types_Event_ts,
  "types/EventDto.ts": F062_types_EventDto_ts,
  "utils/eventFormValues.ts": F068_utils_eventFormValues_ts,
};

const S8S: Record<string, string> = {
  "main.tsx": F100_main_tsx,
  "App.tsx": F081_App_tsx,
  "components/EventCard.tsx": F044_components_EventCard_tsx,
  "components/EventForm.tsx": F109_components_EventForm_tsx,
  "components/Footer.tsx": F014_components_Footer_tsx,
  "components/Layout.tsx": F110_components_Layout_tsx,
  "components/Navbar.tsx": F082_components_Navbar_tsx,
  "components/Pagination.tsx": F111_components_Pagination_tsx,
  "components/RequireAdmin.tsx": F083_components_RequireAdmin_tsx,
  "components/RequireAuth.tsx": F084_components_RequireAuth_tsx,
  "components/SandboxTools.tsx": F026_components_SandboxTools_tsx,
  "components/TicketCounter.tsx": F023_components_TicketCounter_tsx,
  "hooks/eventKeys.ts": F091_hooks_eventKeys_ts,
  "hooks/useCategories.ts": F101_hooks_useCategories_ts,
  "hooks/useEvent.ts": F102_hooks_useEvent_ts,
  "hooks/useEventMutations.ts": F103_hooks_useEventMutations_ts,
  "hooks/useEvents.ts": F104_hooks_useEvents_ts,
  "pages/EventDetails.tsx": F105_pages_EventDetails_tsx,
  "pages/EventEdit.tsx": F106_pages_EventEdit_tsx,
  "pages/EventNew.tsx": F107_pages_EventNew_tsx,
  "pages/Events.tsx": F112_pages_Events_tsx,
  "pages/Home.tsx": F074_pages_Home_tsx,
  "pages/Login.tsx": F086_pages_Login_tsx,
  "pages/NotFound.tsx": F041_pages_NotFound_tsx,
  "pages/Profile.tsx": F076_pages_Profile_tsx,
  "pages/Register.tsx": F010_pages_Register_tsx,
  "services/api.ts": F087_services_api_ts,
  "services/authService.ts": F078_services_authService_ts,
  "services/categoryService.ts": F059_services_categoryService_ts,
  "services/eventService.ts": F088_services_eventService_ts,
  "store/authStore.ts": F089_store_authStore_ts,
  "styles.css": F113_styles_css,
  "types/Auth.ts": F080_types_Auth_ts,
  "types/Category.ts": F061_types_Category_ts,
  "types/Event.ts": F021_types_Event_ts,
  "types/EventDto.ts": F062_types_EventDto_ts,
  "utils/eventFormValues.ts": F068_utils_eventFormValues_ts,
};

const S8R: Record<string, string> = {
  "main.tsx": F100_main_tsx,
  "App.tsx": F081_App_tsx,
  "components/EventCard.tsx": F044_components_EventCard_tsx,
  "components/EventForm.tsx": F114_components_EventForm_tsx,
  "components/Footer.tsx": F014_components_Footer_tsx,
  "components/Layout.tsx": F115_components_Layout_tsx,
  "components/Navbar.tsx": F082_components_Navbar_tsx,
  "components/Pagination.tsx": F116_components_Pagination_tsx,
  "components/RequireAdmin.tsx": F083_components_RequireAdmin_tsx,
  "components/RequireAuth.tsx": F084_components_RequireAuth_tsx,
  "components/SandboxTools.tsx": F026_components_SandboxTools_tsx,
  "components/TicketCounter.tsx": F023_components_TicketCounter_tsx,
  "hooks/eventKeys.ts": F091_hooks_eventKeys_ts,
  "hooks/useCategories.ts": F101_hooks_useCategories_ts,
  "hooks/useEvent.ts": F102_hooks_useEvent_ts,
  "hooks/useEventMutations.ts": F103_hooks_useEventMutations_ts,
  "hooks/useEvents.ts": F104_hooks_useEvents_ts,
  "pages/EventDetails.tsx": F105_pages_EventDetails_tsx,
  "pages/EventEdit.tsx": F106_pages_EventEdit_tsx,
  "pages/EventNew.tsx": F107_pages_EventNew_tsx,
  "pages/Events.tsx": F117_pages_Events_tsx,
  "pages/Home.tsx": F074_pages_Home_tsx,
  "pages/Login.tsx": F086_pages_Login_tsx,
  "pages/NotFound.tsx": F041_pages_NotFound_tsx,
  "pages/Profile.tsx": F076_pages_Profile_tsx,
  "pages/Register.tsx": F010_pages_Register_tsx,
  "services/api.ts": F087_services_api_ts,
  "services/authService.ts": F078_services_authService_ts,
  "services/categoryService.ts": F059_services_categoryService_ts,
  "services/eventService.ts": F088_services_eventService_ts,
  "store/authStore.ts": F089_store_authStore_ts,
  "styles.css": F118_styles_css,
  "types/Auth.ts": F080_types_Auth_ts,
  "types/Category.ts": F061_types_Category_ts,
  "types/Event.ts": F021_types_Event_ts,
  "types/EventDto.ts": F062_types_EventDto_ts,
  "utils/eventFormValues.ts": F068_utils_eventFormValues_ts,
};

/* ------------------------------ stages ------------------------------ */

export const LAB_STAGES: LabStage[] = [
  {
    id: "stage-01",
    number: 1,
    title: "Static application shell",
    basedOn: "Week 02 tutorial guide — React Application Shell (Steps 3–9)",
    sourceKind: "university",
    summary: `Build the CampusEvents shell exactly as the Week 02 tutorial does: a \`Navbar\`, a \`Footer\`, page components, a reusable \`EventCard\` that receives props, a \`TicketCounter\` with local state, and an Events page that renders a temporary hard-coded array with \`map()\` and keys. No API yet — that is Week 03.`,
    objectives: [
      `Split the UI into small function components (\`Navbar\`, \`Footer\`, \`EventCard\`, \`TicketCounter\`, pages) and compose them in \`App\`.`,
      `Pass data from parent to child with props described by a TypeScript interface.`,
      `Use \`useState\` for local state and update it from click handlers.`,
      `Render an array with \`map()\` and a stable \`key\`.`,
    ],
    architecture: `\`\`\`text
main.tsx ──render──▶ <App>
                        ├── <Navbar>          (static links, href="#")
                        ├── <main>
                        │     └── <Events>    (pages/Events.tsx)
                        │           │  events: Event[]  (hard-coded array)
                        │           └── events.map(event ⇒
                        │                 <div key={event.id}>
                        │                   <EventCard title location price />  ◀── props
                        │                   <TicketCounter />                   ◀── own state
                        └── <Footer>
\`\`\`
Data flows **down** as props (Events → EventCard). Each \`TicketCounter\` owns its own \`tickets\` state, so the counters are independent.

Folder structure (Week 02 §12):

\`\`\`text
src/
├── components/  Navbar.tsx  Footer.tsx  EventCard.tsx  TicketCounter.tsx
├── pages/       Home.tsx  Events.tsx  Login.tsx  Register.tsx
├── App.tsx
├── main.tsx
└── styles.css   (index.css / App.css in the Vite template)
\`\`\``,
    steps: [
      {
        title: `1. Compose the shell (Navbar + Footer)`,
        body: `A component is a function that returns JSX. \`App\` composes the shell: header, main content and footer. A fragment (\`<>…</>\`) groups siblings without adding a DOM element.

\`\`\`tsx
// components/Footer.tsx
function Footer() {
  return (
    <footer>
      <p>CampusEvents</p>
    </footer>
  );
}

export default Footer;
\`\`\`

Then import it in \`App.tsx\` and render \`<Footer />\` after \`</main>\`.`,
      },
      {
        title: `2. A reusable EventCard with typed props`,
        body: `Props are the component's inputs. The interface tells TypeScript (and your teammates) exactly what a parent must pass.

\`\`\`tsx
interface EventCardProps {
  title: string;
  location: string;
  price: number;
}

function EventCard({ title, location, price }: EventCardProps) {
  return (
    <article>
      <h3>{title}</h3>
      <p className="muted">{location}</p>
      <p>£{price}</p>
    </article>
  );
}
\`\`\`

Strings can be passed as \`title="…"\`; anything else (numbers, objects, expressions) goes in braces: \`price={15}\`.`,
      },
      {
        title: `3. State and events: TicketCounter`,
        body: `\`useState(1)\` returns the current value and a setter. Calling the setter **schedules** a re-render; the next render sees the new value.

\`\`\`tsx
import { useState } from "react";

function TicketCounter() {
  const [tickets, setTickets] = useState(1);
  return (
    <div className="counter">
      <button onClick={() => setTickets(Math.max(1, tickets - 1))}>-</button>
      <span>{tickets}</span>
      <button onClick={() => setTickets(tickets + 1)}>+</button>
    </div>
  );
}
\`\`\`

Pass a **function** to \`onClick\` (\`onClick={() => …}\`), not the result of calling one.`,
      },
      {
        title: `4. Render the list with map() and keys`,
        body: `\`\`\`tsx
{events.map((event) => (
  <div className="card" key={event.id}>
    <EventCard title={event.title} location={event.location} price={event.price} />
    <TicketCounter />
  </div>
))}
\`\`\`

The \`key\` goes on the **outermost element returned by map**. Use a stable id from the data, not the array index, so React can match items correctly when the list changes.`,
      },
    ],
    todos: [
      `Complete \`Footer.tsx\` and render \`<Footer />\` below \`<main>\` in \`App.tsx\`.`,
      `Finish \`EventCard\`: destructure \`location\` and \`price\` and render them (\`£{price}\`).`,
      `Make \`TicketCounter\` work with \`useState(1)\`; the − button must never go below 1.`,
      `In \`pages/Events.tsx\`, replace the single hand-written card with \`events.map(...)\` using \`key={event.id}\`.`,
      `Render one \`<TicketCounter />\` inside each event card.`,
    ],
    expectedBehavior: `- The page shows the CampusEvents header with four (non-functional) links, a welcome heading, three event cards and a footer.
- Each card shows title, location and price (e.g. **£15**).
- Each card has its own counter: clicking + on one card does not change the others; − stops at 1.
- No warnings about missing keys in the console.`,
    mistakes: [
      {
        mistake: `Writing \`onClick={setTickets(tickets + 1)}\` — the setter is called **during render**, causing an infinite re-render loop.`,
        fix: `Pass a function: \`onClick={() => setTickets(tickets + 1)}\`.`,
      },
      {
        mistake: `Putting \`key\` on the inner \`<EventCard>\` instead of the outer \`<div>\` returned by \`map()\` (or using the array index as the key).`,
        fix: `Put \`key={event.id}\` on the outermost element returned from the \`map\` callback, and use a stable id from the data.`,
      },
      {
        mistake: `Changing the variable directly (\`tickets = tickets + 1\` or mutating an object) and expecting the UI to update.`,
        fix: `Only the state setter tells React to re-render. Always call \`setTickets(...)\` with the new value.`,
      },
      {
        mistake: `Passing a number as a string: \`price="15"\` — TypeScript reports that \`string\` is not assignable to \`number\`.`,
        fix: `Use braces for non-string values: \`price={15}\`.`,
      },
    ],
    starter: { files: S1S, entry: "main.tsx", open: "pages/Events.tsx" },
    reference: { files: S1R, entry: "main.tsx", open: "pages/Events.tsx" },
    knowledgeCheck: [
      {
        question: `Why does each TicketCounter keep its own number?`,
        answer: `State belongs to a component **instance**. Each \`<TicketCounter />\` rendered by \`map()\` is a separate instance with its own \`useState\` slot, so updating one does not affect the others.`,
      },
      {
        question: `What is the difference between props and state?`,
        answer: `Props are inputs passed in by the parent (read-only for the child). State is data a component owns and changes over time with its setter; changing state re-renders that component.`,
      },
      {
        question: `Why does React need a key when rendering a list?`,
        answer: `Keys let React match list items between renders. With a stable key (an id), React keeps the right component (and its state) attached to the right item when items are added, removed or reordered.`,
      },
    ],
    lessons: ["react-components-jsx", "react-props", "react-state-events", "react-lists-keys", "arch-project-structure"],
  },
  {
    id: "stage-02",
    number: 2,
    title: "React + TypeScript components",
    basedOn: "Lecture 02 — React + TypeScript + modern JavaScript (components, props, state, events, lists)",
    sourceKind: "university",
    summary: `Make the shell properly typed. Introduce a shared \`Event\` interface that matches the API's \`EventDto\`, pass whole objects and \`children\` as props, give \`TicketCounter\` typed props with limits and a derived total, and add controlled search/filter inputs whose result list is **derived** during render.`,
    objectives: [
      `Model the API data with a shared \`Event\` interface in \`types/Event.ts\` and use \`import type\`.`,
      `Design component props interfaces, including optional \`children?: ReactNode\` for composition.`,
      `Use functional state updates and derived values instead of duplicated state.`,
      `Build controlled inputs (text + checkbox) and derive a filtered list with keys and an empty state.`,
    ],
    architecture: `\`\`\`text
types/Event.ts ── interface Event (id, title, …, availableTickets, categoryName)
        ▲ import type
data/sampleEvents.ts ── sampleEvents: Event[]
        │
pages/Events.tsx
  state: search (string), availableOnly (boolean)        ◀── controlled inputs
  derived: visible = sampleEvents.filter(…)             (computed every render)
        │
        └── visible.map(e ⇒ <EventCard key={e.id} event={e}>
                               <TicketCounter price max />   ◀── children
                             </EventCard>)

TicketCounter
  state: tickets          derived: total = tickets × price
\`\`\`
Rule of thumb: store the **minimum** state (\`search\`, \`availableOnly\`, \`tickets\`); compute everything else (\`visible\`, \`total\`, \`soldOut\`) during render.`,
    steps: [
      {
        title: `1. A shared type for API data`,
        body: `\`\`\`ts
// types/Event.ts
export interface Event {
  id: number;
  title: string;
  description: string;
  imageUrl: string | null;
  startDate: string;
  endDate: string;
  location: string;
  price: number;
  capacity: number;
  availableTickets: number;
  categoryId: number;
  categoryName: string;
}
\`\`\`

Import it with \`import type { Event } from "../types/Event";\` — a type-only import is erased completely at compile time.`,
      },
      {
        title: `2. Props: whole objects and children`,
        body: `\`\`\`tsx
import type { ReactNode } from "react";
import type { Event } from "../types/Event";

interface EventCardProps {
  event: Event;
  children?: ReactNode; // optional slot for extra content
}

function EventCard({ event, children }: EventCardProps) {
  const soldOut = event.availableTickets === 0;
  return (
    <article className="card">
      <h3>{event.title}</h3>
      <p className="muted">{event.categoryName} · {event.location}</p>
      <p>
        £{event.price.toFixed(2)}{" "}
        {soldOut ? <span className="badge sold-out">Sold out</span> : <span className="badge">{event.availableTickets} left</span>}
      </p>
      {children}
    </article>
  );
}
\`\`\``,
      },
      {
        title: `3. Typed TicketCounter with limits and a derived total`,
        body: `\`\`\`tsx
interface TicketCounterProps {
  price: number;
  max: number;
}

function TicketCounter({ price, max }: TicketCounterProps) {
  const [tickets, setTickets] = useState(1);
  const total = tickets * price; // derived — never stored in state

  return (
    <div className="counter">
      <button type="button" onClick={() => setTickets((t) => Math.max(1, t - 1))} disabled={tickets <= 1}>-</button>
      <span>{tickets}</span>
      <button type="button" onClick={() => setTickets((t) => Math.min(max, t + 1))} disabled={tickets >= max}>+</button>
      <span className="muted">Total: £{total.toFixed(2)}</span>
    </div>
  );
}
\`\`\`

The functional form \`setTickets((t) => t + 1)\` uses the latest queued value, which matters when several updates happen before the next render.`,
      },
      {
        title: `4. Controlled inputs and a derived list`,
        body: `\`\`\`tsx
const [search, setSearch] = useState("");
const [availableOnly, setAvailableOnly] = useState(false);

const term = search.trim().toLowerCase();
const visible = sampleEvents.filter(
  (e) => e.title.toLowerCase().includes(term) && (!availableOnly || e.availableTickets > 0)
);

<input value={search} onChange={(e) => setSearch(e.target.value)} />
<input type="checkbox" checked={availableOnly} onChange={(e) => setAvailableOnly(e.target.checked)} />

{visible.length === 0 ? <p>No events match.</p> : visible.map((event) => (
  <EventCard key={event.id} event={event}>
    {event.availableTickets > 0 && <TicketCounter price={event.price} max={Math.min(20, event.availableTickets)} />}
  </EventCard>
))}
\`\`\`

A checkbox is controlled with \`checked\`, not \`value\`. The API limits a booking to 1–20 tickets, hence \`Math.min(20, …)\`.`,
      },
    ],
    todos: [
      `Refactor \`EventCard\` to props \`{ event: Event; children?: ReactNode }\` and show category, location, start date, \`£price.toFixed(2)\` and a "n left" / "Sold out" badge.`,
      `Give \`TicketCounter\` typed props \`{ price: number; max: number }\`, use functional updates, disable − at 1 and + at \`max\`, and show a derived total.`,
      `In \`Events.tsx\`, add a controlled search \`<input>\` and an "only events with tickets" checkbox with \`useState\`, and derive \`visible\` with \`filter()\`.`,
      `Render \`visible\` with \`key={event.id}\` and show "No events match." when it is empty.`,
    ],
    expectedBehavior: `- Three typed cards; "Winter Music Festival" shows a **Sold out** badge and no counter.
- Counters stop at 1 and at \`min(20, availableTickets)\`; the total updates instantly (e.g. 3 × £15 = £45.00).
- Typing "sport" leaves one card; ticking the checkbox hides sold-out events; a search with no match shows "No events match."
- The "Showing x of 3" text always agrees with the list.`,
    mistakes: [
      {
        mistake: `Storing the filtered list or the total in another \`useState\` and syncing it with \`useEffect\`.`,
        fix: `Derive it during render (\`const visible = events.filter(...)\`, \`const total = tickets * price\`). Duplicated state goes stale and causes extra renders.`,
      },
      {
        mistake: `Using \`value={availableOnly}\` on a checkbox, or reading \`e.target.value\` for it.`,
        fix: `Checkboxes are controlled with \`checked={availableOnly}\` and \`e.target.checked\`.`,
      },
      {
        mistake: `Expecting \`setTickets(tickets + 1); setTickets(tickets + 1);\` to add 2.`,
        fix: `Both calls see the same render snapshot. Use the functional form \`setTickets((t) => t + 1)\` when the next value depends on the previous one.`,
      },
      {
        mistake: `Believing the \`Event\` interface validates the data at runtime.`,
        fix: `Types are erased when TypeScript compiles. They help while you write code; real API data must be checked separately (e.g. with Zod) if you need runtime guarantees.`,
      },
    ],
    starter: { files: S2S, entry: "main.tsx", open: "components/EventCard.tsx" },
    reference: { files: S2R, entry: "main.tsx", open: "pages/Events.tsx" },
    knowledgeCheck: [
      {
        question: `Why is \`total\` not stored in state?`,
        answer: `It can always be computed from \`tickets\` (state) and \`price\` (prop). Storing it would duplicate information that could go out of sync.`,
      },
      {
        question: `What does \`children?: ReactNode\` enable?`,
        answer: `Composition: the parent can nest any JSX inside \`<EventCard>…</EventCard>\`, and the card decides where to render it with \`{children}\`.`,
      },
      {
        question: `What makes an input "controlled"?`,
        answer: `React state is the single source of truth: the input's \`value\` (or \`checked\`) comes from state, and \`onChange\` updates that state.`,
      },
    ],
    lessons: ["react-components-jsx", "react-props", "react-state-events", "react-lists-keys", "forms-controlled-inputs", "state-kinds"],
  },
  {
    id: "stage-03",
    number: 3,
    title: "Backend integration (GET /api/events)",
    basedOn: "Week 03 lecture — Consuming REST APIs; supplied campus-events-frontend (Week 03 state)",
    sourceKind: "university",
    summary: `Replace the hard-coded array with real data from \`GET /api/events\`. Follow the supplied Week 03 project structure — \`types/Event.ts\`, \`services/eventService.ts\`, \`hooks/useEvents.ts\` — and improve it: check \`response.ok\`, cancel requests with \`AbortController\` in the effect clean-up, and render all four UI states (loading, error, empty, success) with a retry.`,
    objectives: [
      `Put HTTP code in a service module and keep components free of \`fetch\` details.`,
      `Understand that \`fetch\` rejects only on network failure/abort, so \`response.ok\` must be checked.`,
      `Load data in a custom hook with \`useEffect\`, and cancel in-flight requests in the clean-up.`,
      `Render loading, error (with retry), empty and success states.`,
    ],
    architecture: `\`\`\`text
Events.tsx ──calls──▶ useEvents()  (hooks/useEvents.ts)
   ▲                     │ useEffect([reloadKey])
   │ { events, loading,  │   controller = new AbortController()
   │   error, reload }   │   getEvents(controller.signal) ──▶ services/eventService.ts
   │                     │                                      fetch("/api/events", { signal })
   │                     │                                      if (!response.ok) throw …
   │                     │   clean-up: controller.abort()        return response.json()
   └─────────────────────┘
                                             ▼
                              Mock CampusEvents API (sandbox) / ASP.NET Core API (real)
\`\`\`
Real app: \`API_URL = "http://localhost:5229/api"\` and the backend's CORS policy must allow \`http://localhost:5173\`. Sandbox: \`API_URL = "/api"\` is answered by the mock API (~0.5 s latency).`,
    steps: [
      {
        title: `1. Service module with response.ok`,
        body: `\`\`\`ts
const API_URL = "/api"; // real app: "http://localhost:5229/api"

export async function getEvents(signal?: AbortSignal): Promise<Event[]> {
  const response = await fetch(\`\${API_URL}/events\`, { signal });
  if (!response.ok) {
    throw new Error(\`Failed to fetch events: \${response.status}\`);
  }
  return (await response.json()) as Event[];
}
\`\`\`

A 500 response still **resolves** the fetch promise — only the \`ok\`/\`status\` check turns it into an error.`,
      },
      {
        title: `2. A custom hook with AbortController`,
        body: `\`\`\`ts
export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      setLoading(true);
      setError(null);
      try {
        setEvents(await getEvents(controller.signal));
      } catch (err) {
        if (controller.signal.aborted) return; // cancelled on purpose
        setError(err instanceof Error ? err.message : "Unable to load events.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    load();
    return () => controller.abort();
  }, [reloadKey]);

  return { events, loading, error, reload: () => setReloadKey((k) => k + 1) };
}
\`\`\`

In development, StrictMode mounts, cleans up and mounts again — you will see the first request **aborted** in the network log. That is the clean-up working, not a bug.`,
      },
      {
        title: `3. The four UI states`,
        body: `\`\`\`tsx
const { events, loading, error, reload } = useEvents();
// …other hooks here, BEFORE any early return…

if (loading) return <p role="status">Loading events…</p>;
if (error) {
  return (
    <div role="alert">
      <p className="error">{error}</p>
      <button type="button" onClick={reload}>Try again</button>
    </div>
  );
}
if (events.length === 0) return <p>No events found.</p>;
// success: render the list
\`\`\`

Hooks must run in the same order on every render, so all \`useState\` calls stay above the early returns.`,
      },
      {
        title: `4. Test the error path`,
        body: `Click **Make the next API request fail (500)** (sandbox tools under the footer), then **Refresh**. You should see the error message and the **Try again** button; clicking it loads the list again. Watch the network panel for the 500 and the following 200.`,
      },
    ],
    todos: [
      `In \`getEvents\`, check \`response.ok\` and throw an \`Error\` that includes \`response.status\` when it is false.`,
      `Add a \`signal?: AbortSignal\` parameter to \`getEvents\` and pass it to \`fetch\`.`,
      `In \`useEvents\`, create an \`AbortController\`, pass its signal, return \`() => controller.abort()\` as the clean-up, and ignore errors caused by aborting.`,
      `In \`Events.tsx\`, render loading (\`role="status"\`), error (\`role="alert"\`), empty and success states — hooks above the early returns.`,
      `Implement \`reload()\` (a \`reloadKey\` in the effect's dependencies) and a "Try again" button; test it with the sandbox "fail next request" button.`,
    ],
    expectedBehavior: `- "Loading events…" appears for about half a second, then the three events from the mock API.
- In the network log, GET /api/events appears (in development an aborted first request from StrictMode is normal).
- After "Make the next API request fail (500)" + Refresh, the error "Failed to fetch events: 500" and a **Try again** button appear; Try again recovers.
- Search and the "only events with tickets" filter still work on the loaded data.`,
    mistakes: [
      {
        mistake: `Relying on \`try/catch\` alone: \`fetch\` does not throw for 404/500, so the code calls \`response.json()\` on an error body and shows nonsense.`,
        fix: `Check \`if (!response.ok) throw new Error(...)\` before parsing.`,
      },
      {
        mistake: `Making the effect callback itself \`async\` (\`useEffect(async () => …)\`).`,
        fix: `An async function returns a promise, but React expects the effect to return nothing or a clean-up function. Define an inner \`async function load()\` and call it.`,
      },
      {
        mistake: `Forgetting the dependency array (\`useEffect(() => { … })\`) so the request runs after every render — and \`setEvents\` triggers another render, looping forever.`,
        fix: `Add the dependency array: \`[]\` to run once on mount, or \`[reloadKey]\` to re-run when you ask for a reload.`,
      },
      {
        mistake: `Showing "Failed to fetch" when a request was aborted by the clean-up (unmount, StrictMode, a newer request).`,
        fix: `In \`catch\`, return early when \`controller.signal.aborted\` is true — an abort is intentional, not an error.`,
      },
    ],
    starter: { files: S3S, entry: "main.tsx", open: "services/eventService.ts" },
    reference: { files: S3R, entry: "main.tsx", open: "hooks/useEvents.ts" },
    knowledgeCheck: [
      {
        question: `Why must we check response.ok?`,
        answer: `\`fetch\` rejects only on network failure or abort. HTTP error statuses (400, 404, 500…) resolve normally with \`ok === false\`, so the code must check and throw itself.`,
      },
      {
        question: `What problem does the AbortController clean-up solve?`,
        answer: `If the component unmounts or the effect re-runs before the response arrives, the old request is cancelled, so a stale response cannot overwrite newer state or update an unmounted component.`,
      },
      {
        question: `Name the four UI states of remote data.`,
        answer: `Loading, error, empty (success with no items) and success with data.`,
      },
      {
        question: `Why put fetch code in services/eventService.ts?`,
        answer: `Separation of concerns: components describe UI, the service knows URLs and HTTP details. The same function can be reused (and tested or replaced) without touching components.`,
      },
    ],
    lessons: ["http-fetch-response-ok", "http-four-ui-states", "http-abortcontroller", "http-service-modules", "react-useeffect", "react-custom-hooks"],
  },
  {
    id: "stage-04",
    number: 4,
    title: "Routing: layout, details page and 404",
    basedOn: "Week 05 deck — Routing (slides on BrowserRouter, Routes/Route, Outlet, useParams); Campus Event Frontend guide §15–17, §21–24",
    sourceKind: "university",
    summary: `Turn the single page into a routed app: a shared \`Layout\` with \`<Outlet />\`, routes for \`/\`, \`/events\`, \`/events/:id\`, login/register placeholders and a catch-all \`NotFound\`, \`NavLink\` navigation, and an \`EventDetails\` page that reads the id with \`useParams\`, validates it and loads \`GET /api/events/{id}\`. The sandbox uses \`MemoryRouter\`; your real app uses \`BrowserRouter\`.`,
    objectives: [
      `Configure \`Routes\`/\`Route\` with a pathless layout route and render children through \`<Outlet />\`.`,
      `Navigate with \`Link\` and \`NavLink\` (active styling) instead of \`<a href>\` page reloads.`,
      `Read a dynamic segment with \`useParams\`, convert and validate it (params are strings).`,
      `Load one resource by id and handle invalid id, loading, 404 and error states, plus a catch-all 404 route.`,
    ],
    architecture: `\`\`\`text
main.tsx:  <MemoryRouter>  (real app: <BrowserRouter>)
             └── <App>  ── <Routes>
                             └── <Route element={<Layout/>}>          (pathless layout route)
                                   ├── /             → <Home>
                                   ├── /events       → <Events>    ── EventCard ── <Link to="/events/2">
                                   ├── /events/:id   → <EventDetails>
                                   │                      useParams() → { id: "2" }  (string!)
                                   │                      Number(id) → validate → useEvent(2)
                                   │                                        └─ GET /api/events/2
                                   ├── /login, /register (placeholders)
                                   └── *             → <NotFound>

<Layout> = <Navbar (NavLink…)/>  <main><Outlet/></main>  <Footer/>
\`\`\`
The router matches the current location against the route tree; the layout renders once and the matched child is rendered where \`<Outlet />\` is.`,
    steps: [
      {
        title: `1. Router at the root (MemoryRouter in the sandbox)`,
        body: `\`\`\`tsx
// main.tsx (sandbox)
<StrictMode>
  <MemoryRouter initialEntries={["/"]}>
    <App />
  </MemoryRouter>
</StrictMode>
\`\`\`

In your Vite project use \`<BrowserRouter>\` exactly here (Frontend guide §24). The preview is an isolated \`srcdoc\` iframe without a usable address bar, so the sandbox keeps history in memory instead. Everything inside (\`Routes\`, \`Link\`, \`useParams\`, \`useNavigate\`) is identical. The Layout prints the current path so you can see where you are.`,
      },
      {
        title: `2. Layout route + Outlet`,
        body: `\`\`\`tsx
// App.tsx
<Routes>
  <Route element={<Layout />}>
    <Route path="/" element={<Home />} />
    <Route path="/events" element={<Events />} />
    <Route path="/events/:id" element={<EventDetails />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="*" element={<NotFound />} />
  </Route>
</Routes>
\`\`\`

\`\`\`tsx
// components/Layout.tsx
function Layout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
\`\`\``,
      },
      {
        title: `3. NavLink instead of <a href>`,
        body: `\`\`\`tsx
<nav className="menu" aria-label="Main">
  <NavLink to="/" end>Home</NavLink>
  <NavLink to="/events">Events</NavLink>
  <NavLink to="/login">Login</NavLink>
  <NavLink to="/register">Register</NavLink>
</nav>
\`\`\`

\`NavLink\` adds \`class="active"\` and \`aria-current="page"\` to the matching link. A plain \`<a href="/events">\` would make the browser load a whole new document (losing all React state); \`Link\`/\`NavLink\` change the route on the client.`,
      },
      {
        title: `4. Details page: useParams → validate → load`,
        body: `\`\`\`tsx
const { id } = useParams<{ id: string }>();     // "/events/2" → { id: "2" }
const eventId = Number(id);
const validId = Number.isInteger(eventId) && eventId > 0;
const { event, loading, error, notFound } = useEvent(validId ? eventId : null);

if (!validId) return <p role="alert">Invalid event id: "{id}".</p>;
if (loading) return <p role="status">Loading event…</p>;
if (notFound) return <p>Event not found.</p>;
if (error) return <p role="alert">{error}</p>;
\`\`\`

\`useEvent(id)\` follows the same pattern as \`useEvents\` (AbortController, \`[id]\` dependency) and maps an \`ApiError\` with status 404 to \`notFound\`. Passing \`null\` for an invalid id means **no request is sent** (the Frontend guide's version still calls the API with \`NaN\`).`,
      },
      {
        title: `5. Test every route`,
        body: `Use the links on the Home page: \`/events/1\` (details), \`/events/999\` (valid id → API 404 → "Event not found"), \`/events/abc\` (invalid id, no request in the network log), \`/does-not-exist\` (catch-all \`NotFound\`). Then click between two events' details and watch the network log: the previous request is aborted if it is still in flight.`,
      },
    ],
    todos: [
      `In \`App.tsx\`, nest all routes inside a pathless \`<Route element={<Layout />}>\` and render \`<Outlet />\` in \`Layout.tsx\`.`,
      `Add routes for \`/events/:id\`, \`/login\`, \`/register\` and a catch-all \`path="*"\` → \`NotFound\`.`,
      `Replace the \`<a href="#">\` links in \`Navbar\` with \`NavLink\` (with \`end\` on Home).`,
      `Implement \`useEvent(id)\` (AbortController, 404 → \`notFound\`) and finish \`EventDetails\`: \`Number(id)\`, validate, render invalid/loading/not-found/error/details.`,
      `Add a "View details" \`Link\` to each \`EventCard\`.`,
    ],
    expectedBehavior: `- The navbar, footer and "Current path" line stay on screen for every page; only the \`<main>\` content changes.
- The active nav link is highlighted.
- "View details" opens \`/events/{id}\` with description, dates, price and tickets.
- \`/events/999\` shows "Event not found" (after a 404), \`/events/abc\` shows "Invalid event id" without any request, \`/anything-else\` shows the NotFound page.`,
    mistakes: [
      {
        mistake: `Using \`<a href="/events">\` for internal navigation.`,
        fix: `Use \`<Link to="/events">\` or \`<NavLink>\`; a plain anchor makes the browser request a new document and resets the React app.`,
      },
      {
        mistake: `Forgetting \`<Outlet />\` in the layout, so the nav shows but the page content never appears.`,
        fix: `A layout route renders its matched child **only** where \`<Outlet />\` is placed.`,
      },
      {
        mistake: `Treating \`useParams().id\` as a number: \`event.id === id\` is always false, and \`/events/abc\` sends \`GET /api/events/abc\`.`,
        fix: `Params are strings (or undefined). Convert with \`Number(id)\`, validate with \`Number.isInteger(n) && n > 0\`, and skip the request when invalid.`,
      },
      {
        mistake: `Using \`BrowserRouter\` inside the sandbox preview (or \`MemoryRouter\` in the real app).`,
        fix: `Sandbox: \`MemoryRouter\` (no real URL in a srcdoc iframe). Real Vite app: \`BrowserRouter\` in \`main.tsx\`.`,
      },
    ],
    starter: { files: S4S, entry: "main.tsx", open: "App.tsx" },
    reference: { files: S4R, entry: "main.tsx", open: "pages/EventDetails.tsx" },
    knowledgeCheck: [
      {
        question: `What does a pathless layout route (\`<Route element={<Layout />}>\`) do?`,
        answer: `It wraps its child routes in a shared UI without adding a URL segment. The layout renders once and the matched child appears in its \`<Outlet />\`.`,
      },
      {
        question: `What type does \`useParams()\` return for \`/events/:id\`?`,
        answer: `An object of strings: \`{ id: "2" }\` (values can be \`undefined\` if the segment is missing). Convert and validate before using it as a number.`,
      },
      {
        question: `Why is the catch-all route \`path="*"\` useful?`,
        answer: `It matches any URL that no other route matches, so the user sees a friendly NotFound page instead of an empty layout.`,
      },
      {
        question: `What is the difference between Link and NavLink?`,
        answer: `Both navigate on the client. \`NavLink\` also knows whether it matches the current location and adds \`active\` styling and \`aria-current="page"\`.`,
      },
    ],
    lessons: ["router-basics", "router-nested-layouts-outlet", "router-dynamic-params", "router-navigation", "http-four-ui-states", "http-abortcontroller"],
  },
  {
    id: "stage-05",
    number: 5,
    title: "CRUD: create, edit and delete events",
    basedOn: "Week 05 deck — Forms, Validation and CRUD; Campus Event Frontend guide §3–8, §14, §19–21",
    sourceKind: "university",
    summary: `Add admin CRUD in the style of the Frontend guide: a central \`request<T>()\` helper with \`ApiError\` and 204 handling, an \`eventService\` (list/get/create/update/remove), a reusable \`EventForm\` with controlled inputs and **manual** validation (the sandbox has no React Hook Form), \`EventNew\` (POST → 201), \`EventEdit\` (load, then PUT → 204) and delete with confirmation. For now an admin token constant stands in for login (like \`VITE_DEMO_ADMIN_TOKEN\`).`,
    objectives: [
      `Centralise HTTP in \`request<T>()\`: JSON body, \`Authorization\` header, \`ApiError\`, and no \`response.json()\` on 204.`,
      `Build one reusable, controlled \`EventForm\` with client-side validation that mirrors the backend DTO rules.`,
      `Create (POST → 201), update (PUT → 204) and delete (DELETE → 204) events, then navigate with \`useNavigate\`.`,
      `Show server errors (400/401/403) to the user instead of failing silently.`,
    ],
    architecture: `\`\`\`text
EventNew ──┐                        EventEdit ── useEvent(id) ── toFormValues(event)
           ▼                                 ▼
        <EventForm initialValues onSubmit submitLabel>
           │ values (strings) ─ validateEvent() ─ errors → aria-invalid / aria-describedby
           │ submit: toDto(values) → onSubmit(dto)   (throws ApiError → shown in the form)
           ▼
eventService.create(dto)  ─ POST   /api/events        → 201 + EventDto → navigate(/events/{id})
eventService.update(id,d) ─ PUT    /api/events/{id}   → 204 (no body)  → navigate(/events/{id})
eventService.remove(id)   ─ DELETE /api/events/{id}   → 204 (no body)  → navigate(/events)
           │
        request<T>()  Content-Type: application/json
                      Authorization: Bearer fake-admin-token   (Stage 6: real login token)
                      !ok → ApiError(status, message);  204 → undefined
\`\`\``,
    steps: [
      {
        title: `1. A central request<T>() helper`,
        body: `\`\`\`ts
export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, headers, requiresAdmin = false, ...rest } = options;
  const requestHeaders = new Headers(headers);
  if (body !== undefined) requestHeaders.set("Content-Type", "application/json");
  if (requiresAdmin) requestHeaders.set("Authorization", \`Bearer \${DEMO_ADMIN_TOKEN}\`);

  const response = await fetch(\`\${API_URL}\${path}\`, {
    ...rest,
    headers: requestHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  if (!response.ok) {
    throw new ApiError(response.status, getErrorMessage(await readBody(response), response.status));
  }
  if (response.status === 204) return undefined as T; // No Content: nothing to parse
  return (await readBody(response)) as T;
}
\`\`\`

\`readBody\` reads text first, so empty bodies, JSON and ASP.NET's plain-string \`BadRequest("…")\` messages are all handled. In the sandbox the mock accepts \`fake-admin-token\`; try \`fake-user-token\` to see a 403.`,
      },
      {
        title: `2. Form values are strings: validate, then convert`,
        body: `\`\`\`ts
export function validateEvent(v: EventFormValues): EventFormErrors {
  const errors: EventFormErrors = {};
  const title = v.title.trim();
  if (!title) errors.title = "Title is required.";
  else if (title.length > 150) errors.title = "Title must be 150 characters or fewer.";
  if (!v.description.trim()) errors.description = "Description is required.";
  if (!v.location.trim()) errors.location = "Location is required.";
  if (!v.startDate) errors.startDate = "Start date is required.";
  if (!v.endDate) errors.endDate = "End date is required.";
  else if (v.startDate && new Date(v.endDate) <= new Date(v.startDate)) errors.endDate = "End date must be after the start date.";
  const price = Number(v.price);
  if (v.price.trim() === "" || !Number.isFinite(price) || price < 0 || price > 100000) errors.price = "Price must be a number between 0 and 100000.";
  const capacity = Number(v.capacity);
  if (v.capacity.trim() === "" || !Number.isInteger(capacity) || capacity < 1 || capacity > 10000) errors.capacity = "Capacity must be a whole number between 1 and 10000.";
  if (!v.categoryId) errors.categoryId = "Choose a category.";
  return errors;
}
\`\`\`

The rules mirror \`CreateEventDto\`. Client validation is for **user experience**; the server validates again (and the mock returns 400 for an empty title). \`toDto()\` trims strings, converts numbers and turns \`datetime-local\` values into ISO strings.`,
      },
      {
        title: `3. Create: POST → 201 → navigate`,
        body: `\`\`\`tsx
function EventNew() {
  const navigate = useNavigate();
  async function handleCreate(dto: EventDto) {
    const created = await eventService.create(dto); // 201 Created + the new event
    navigate(\`/events/\${created.id}\`, { replace: true });
  }
  return <EventForm submitLabel="Create event" onSubmit={handleCreate} />;
}
\`\`\`

If \`create\` throws, \`EventForm\`'s \`try/catch\` shows the message in a \`role="alert"\` paragraph.`,
      },
      {
        title: `4. Edit: load first, then PUT → 204`,
        body: `\`\`\`tsx
const { event, loading, error, notFound } = useEvent(validId ? eventId : null);
// …early returns for invalid / loading / not found / error…
async function handleUpdate(dto: EventDto) {
  await eventService.update(eventId, dto); // 204 No Content
  navigate(\`/events/\${eventId}\`);
}
return <EventForm key={event.id} initialValues={toFormValues(event)} submitLabel="Save changes" onSubmit={handleUpdate} />;
\`\`\`

The form is rendered only after the event has loaded, so \`useState(initialValues)\` starts with the right values. \`toFormValues\` converts the API date to the \`YYYY-MM-DDTHH:mm\` format that \`datetime-local\` needs.`,
      },
      {
        title: `5. Delete with confirmation`,
        body: `\`\`\`tsx
async function handleDelete() {
  if (!event) return;
  if (!window.confirm(\`Delete "\${event.title}"? This cannot be undone.\`)) return;
  setDeleting(true);
  setDeleteError(null);
  try {
    await eventService.remove(event.id); // 204 (real API: 400 if bookings/reviews exist)
    navigate("/events", { replace: true });
  } catch (err) {
    setDeleteError(err instanceof Error ? err.message : "Failed to delete the event.");
    setDeleting(false);
  }
}
\`\`\``,
      },
    ],
    todos: [
      `Complete \`validateEvent()\` in \`utils/eventFormValues.ts\` (title ≤150, description, location, end after start, price 0–100000, capacity 1–10000, category, optional http(s) image URL).`,
      `In \`EventNew\`, call \`eventService.create(dto)\` (POST → 201) and navigate to \`/events/{id}\` with \`replace\`.`,
      `In \`EventEdit\`, render the pre-filled \`EventForm\` (\`toFormValues(event)\`) and save with \`eventService.update\` (PUT → 204), then navigate to the details page.`,
      `In \`EventDetails\`, implement delete: \`window.confirm\`, \`eventService.remove\`, navigate to \`/events\`; show the error and re-enable the button on failure.`,
      `In \`request<T>()\`, return \`undefined\` for **204 No Content** instead of calling \`response.json()\` (try an edit before fixing it to see the error).`,
    ],
    expectedBehavior: `- Submitting an empty form shows an error under each invalid field; fixing a field clears its message as you type.
- Creating an event redirects to its new details page (id 4, 5, …) and it appears in the list.
- Editing saves (network log: PUT 204) and returns to the updated details page.
- Delete asks for confirmation, then returns to the list without the event.
- Changing \`DEMO_ADMIN_TOKEN\` to \`"fake-user-token"\` makes saves fail with a visible 403 message; an empty string gives 401.`,
    mistakes: [
      {
        mistake: `Calling \`response.json()\` after a successful PUT/DELETE: "Unexpected end of JSON input".`,
        fix: `204 means **No Content**. Check \`response.status === 204\` (or read text first) and return without parsing.`,
      },
      {
        mistake: `Forgetting \`e.preventDefault()\` in the submit handler, so the browser performs a full-page form submission.`,
        fix: `Call \`e.preventDefault()\` first in \`onSubmit\`, then validate and send the request yourself.`,
      },
      {
        mistake: `Sending form strings straight to the API (\`price: "15"\`, \`categoryId: ""\`, \`startDate: "2026-12-02T09:00"\`).`,
        fix: `Convert in one place (\`toDto\`): \`Number(...)\` for numbers, \`new Date(...).toISOString()\` for dates, \`trim()\` for text, \`null\` for an empty optional URL.`,
      },
      {
        mistake: `Relying on client validation or hidden buttons as protection.`,
        fix: `Client checks improve UX only. The API validates again and enforces \`[Authorize(Roles = "ADMIN")]\` (401/403), so always display server errors.`,
      },
      {
        mistake: `Using \`useState(initialValues)\` in the edit form before the event has loaded, so the form stays empty.`,
        fix: `Render the form only after loading (and give it \`key={event.id}\`), or reset the state when the loaded values change.`,
      },
    ],
    starter: { files: S5S, entry: "main.tsx", open: "utils/eventFormValues.ts" },
    reference: { files: S5R, entry: "main.tsx", open: "components/EventForm.tsx" },
    knowledgeCheck: [
      {
        question: `Which status codes does the CampusEvents API return for create, update and delete?`,
        answer: `POST → 201 Created with the new EventDto (and a Location header); PUT → 204 No Content; DELETE → 204 No Content (400 if the event has bookings or reviews).`,
      },
      {
        question: `Why does EventForm receive \`onSubmit\` as a prop instead of calling the API itself?`,
        answer: `So the same form can be reused: the create page passes a POST handler, the edit page a PUT handler. The form only collects, validates and converts data.`,
      },
      {
        question: `What is the difference between 401 and 403?`,
        answer: `401: not authenticated (missing, invalid or expired credentials). 403: authenticated, but this user is not allowed (e.g. not ADMIN).`,
      },
      {
        question: `Why use \`navigate(..., { replace: true })\` after creating an event?`,
        answer: `It replaces the "new event" form in the history, so pressing Back does not return to a form that was already submitted.`,
      },
    ],
    lessons: ["forms-controlled-inputs", "forms-validation", "crud-post-put-delete", "http-service-modules", "router-navigation", "sec-401-403-expiry"],
  },
  {
    id: "stage-06",
    number: 6,
    title: "Authentication & role-based routes",
    basedOn: "Supplementary (Lecture 6 / Tutorial 6 on authentication were not supplied); grounded in the backend's AuthController, JWTService and AuthResponseDto",
    sourceKind: "supplementary",
    summary: `Replace the hard-coded admin token with a real login. \`POST /api/auth/login\` returns \`{ token, expiresAt, userId, email, firstName, lastName, role }\`; a small Zustand store keeps it, \`request<T>()\` attaches \`Authorization: Bearer <token>\` and logs out on 401, and \`RequireAuth\` / \`RequireAdmin\` route guards redirect with \`<Navigate>\`. The guards are **UX only** — the server's \`[Authorize]\` attributes remain the real security.`,
    objectives: [
      `Log in with \`POST /api/auth/login\`, store the token, expiry and user in a Zustand store, and log out.`,
      `Attach the bearer token in one place (the request helper) and react to 401 by ending the session.`,
      `Protect routes with layout-style guards (\`<Navigate replace state={{ from }} />\`) and return the user afterwards.`,
      `Show or hide admin UI by role while understanding that only the server enforces authorisation.`,
    ],
    architecture: `\`\`\`text
Login page ── authService.login({email,password}) ── POST /api/auth/login
     │                                             ◀── 200 { token, expiresAt, role, … } | 401
     └── useAuthStore.login(auth) ──▶ ┌──────────── authStore (Zustand, memory) ───────────┐
                                      │ token, expiresAt, user{…, role}, login(), logout() │
                                      └───────▲──────────────────────────▲─────────────────┘
          selectors (re-render on change)     │                          │ getState() (outside React)
Navbar / EventDetails / RequireAuth / RequireAdmin               request<T>()
                                                                   Authorization: Bearer <token>
Routes:                                                            401 → logout()   403 → show message
  <Route element={<RequireAuth/>}>   /profile
  <Route element={<RequireAdmin/>}>  /events/new, /events/:id/edit
     not logged in → <Navigate to="/login" replace state={{ from }} />
     logged in, not ADMIN → "403 – Admins only"

Real security boundary: ASP.NET Core [Authorize(Roles = "ADMIN")] on the API.
\`\`\``,
    steps: [
      {
        title: `1. The auth store (client state)`,
        body: `\`\`\`ts
export const useAuthStore = create<AuthState>()((set) => ({
  token: null,
  expiresAt: null,
  user: null,
  login: (auth) =>
    set({
      token: auth.token,
      expiresAt: auth.expiresAt,
      user: { id: auth.userId, email: auth.email, firstName: auth.firstName, lastName: auth.lastName, role: auth.role },
    }),
  logout: () => set({ token: null, expiresAt: null, user: null }),
}));

export const selectIsAuthenticated = (s: AuthState) =>
  s.token !== null && s.expiresAt !== null && Date.parse(s.expiresAt) > Date.now();
export const selectIsAdmin = (s: AuthState) => selectIsAuthenticated(s) && s.user?.role.toUpperCase() === "ADMIN";
\`\`\`

The store lives in memory, so a reload logs you out. A real app may add \`persist\` (from \`zustand/middleware\`), but a token that JavaScript can read can also be stolen through XSS; and inside the sandbox's opaque-origin iframe \`localStorage\` is not available at all. Note: the real backend's \`role\` field holds only the user's **first** role, so an admin can come back as \`"USER"\`.`,
      },
      {
        title: `2. Login page`,
        body: `\`\`\`tsx
const from = (location.state as { from?: string } | null)?.from ?? "/events";
const login = useAuthStore((s) => s.login);

async function handleSubmit(e: FormEvent<HTMLFormElement>) {
  e.preventDefault();
  setSubmitting(true);
  setError(null);
  try {
    const auth = await authService.login({ email: email.trim(), password });
    login(auth);
    navigate(from, { replace: true });
  } catch (err) {
    setError(err instanceof Error ? err.message : "Login failed."); // 401: "Invalid email or password."
    setSubmitting(false);
  }
}
\`\`\`

Sandbox accounts: \`admin@example.com\` / \`Password123\` (ADMIN) and \`user@example.com\` / \`Password123\` (USER).`,
      },
      {
        title: `3. Route guards with Navigate`,
        body: `\`\`\`tsx
export default function RequireAuth() {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
  }
  return <Outlet />;
}
\`\`\`

\`\`\`tsx
<Route element={<RequireAuth />}>
  <Route path="/profile" element={<Profile />} />
</Route>
<Route element={<RequireAdmin />}>
  <Route path="/events/new" element={<EventNew />} />
  <Route path="/events/:id/edit" element={<EventEdit />} />
</Route>
\`\`\`

\`RequireAdmin\` additionally renders a "403 – Admins only" message for logged-in users without the ADMIN role.`,
      },
      {
        title: `4. Attach the token; handle 401`,
        body: `\`\`\`ts
const auth = useAuthStore.getState();             // read the store outside React
if (auth.token && !selectIsAuthenticated(auth)) auth.logout(); // expired locally
const token = useAuthStore.getState().token;
if (token) requestHeaders.set("Authorization", \`Bearer \${token}\`);
// …fetch…
if (!response.ok) {
  if (response.status === 401 && token) useAuthStore.getState().logout(); // rejected → end session
  throw new ApiError(response.status, getErrorMessage(await readBody(response), response.status));
}
\`\`\`

401 means "who are you?" — the session is gone, so log out. 403 means "I know you, but no" — keep the session and show the message.`,
      },
      {
        title: `5. Prove that the server is the real guard`,
        body: `Log in as \`user@example.com\`, open **Profile** and click **Probe POST /api/events**: the API answers **403** even though the UI never offered that action. As admin the same empty request returns **400** (validation). Then click **Simulate token expiry**: the guard immediately redirects you to \`/login\`.`,
      },
    ],
    todos: [
      `Complete \`authStore\`: \`login(auth)\` stores token/expiresAt/user, \`logout()\` clears them, and implement \`selectIsAuthenticated\` / \`selectIsAdmin\`.`,
      `In \`Login.tsx\`, call \`authService.login\`, store the result with \`login(auth)\`, navigate back to \`state.from\` (or \`/events\`), and show the 401 message.`,
      `Implement \`RequireAuth\` (\`<Navigate to="/login" replace state={{ from }} />\`) and \`RequireAdmin\` (403 message for non-admins) and wrap the routes in \`App.tsx\`.`,
      `In \`request<T>()\`, replace \`DEMO_ADMIN_TOKEN\` with the store's token via \`useAuthStore.getState()\` and call \`logout()\` on a 401; remove \`requiresAdmin\` from \`eventService\`.`,
      `In \`Navbar\` show Login/Register or "name (role)" + Log out, show "New event" only to admins, and hide Edit/Delete in \`EventDetails\` for non-admins.`,
    ],
    expectedBehavior: `- Opening \`/profile\` or \`/events/new\` (links on the Home page) while logged out redirects to \`/login\`; after logging in you return to the page you wanted.
- Wrong password shows "Invalid email or password." (401).
- As \`user@example.com\`: no "New event", no Edit/Delete; the \`/events/new\` link on the Home page shows "403 – Admins only"; the API probe returns 403.
- As \`admin@example.com\`: create/edit/delete work with the real token (check the request headers).
- Log out (or simulate expiry) and the admin UI disappears immediately.`,
    mistakes: [
      {
        mistake: `Treating the route guard or hidden buttons as security.`,
        fix: `Anyone can call the API directly. Guards only improve UX; the backend's \`[Authorize]\`/\`[Authorize(Roles = "ADMIN")]\` must reject the request (401/403).`,
      },
      {
        mistake: `Calling a hook (\`useAuthStore(...)\`) inside \`request()\` or another non-component function.`,
        fix: `Hooks only run in components/custom hooks. Outside React use \`useAuthStore.getState()\`.`,
      },
      {
        mistake: `Logging the user out on **403** as well as 401.`,
        fix: `403 means the user is authenticated but not allowed; keep the session and show a message. Only 401 indicates missing/invalid/expired credentials.`,
      },
      {
        mistake: `Trusting decoded JWT data or the \`role\` field as proof of identity.`,
        fix: `A JWT is signed, not encrypted: anyone can decode (and a client can fake) it; only the server verifies the signature. Also, the CampusEvents login \`role\` field is just the first role.`,
      },
      {
        mistake: `Redirecting with \`<Navigate to="/login" />\` without \`replace\`, so Back returns to the protected page and immediately redirects again.`,
        fix: `Use \`replace\` and pass \`state={{ from }}\` so the login page can send the user back afterwards.`,
      },
    ],
    starter: { files: S6S, entry: "main.tsx", open: "store/authStore.ts" },
    reference: { files: S6R, entry: "main.tsx", open: "components/RequireAdmin.tsx" },
    knowledgeCheck: [
      {
        question: `Are frontend route guards a security feature?`,
        answer: `No. They only decide what the UI shows. Security is enforced by the server, which must validate the token and role on every protected request.`,
      },
      {
        question: `Why read the token with \`useAuthStore.getState()\` in \`request()\`?`,
        answer: `\`request()\` is a plain function, not a component, so it cannot call hooks. \`getState()\` reads the current store value directly without subscribing.`,
      },
      {
        question: `What should the app do on 401 vs 403?`,
        answer: `401: the credentials are missing/invalid/expired, so clear the session and ask the user to log in. 403: the user is logged in but lacks permission, so keep the session and show "not allowed".`,
      },
      {
        question: `Why does the login page read \`location.state.from\`?`,
        answer: `The guard stored the page the user tried to open; after a successful login the app navigates back there instead of always going to a default page.`,
      },
    ],
    lessons: ["sec-authn-authz", "sec-401-403-expiry", "sec-trust-boundaries", "router-protected-routes", "zustand-basics", "zustand-selectors"],
  },
  {
    id: "stage-07",
    number: 7,
    title: "Modern state management (TanStack Query + Zustand)",
    basedOn: "Supplementary (Lecture 7 on state management was not supplied; Week 03 slides only preview a TanStack Query refactor)",
    sourceKind: "supplementary",
    summary: `Replace the hand-written \`useEffect\` data hooks with TanStack Query v5. Server state (events, categories) moves into the query cache with keys like \`['events']\` and \`['events', id]\`; create/update/delete become \`useMutation\`s that invalidate those keys. Zustand keeps only **client** state (who is logged in). Search inputs stay in plain \`useState\`.`,
    objectives: [
      `Distinguish server state (cached copy of API data) from client/UI state, and choose a tool for each.`,
      `Provide one \`QueryClient\` and read data with \`useQuery({ queryKey, queryFn })\` (including \`enabled\` and the abort \`signal\`).`,
      `Write mutations with \`useMutation\` and keep the cache correct with \`invalidateQueries\`, \`setQueryData\` and \`removeQueries\`.`,
      `Use \`isPending\`, \`isError\`, \`isFetching\` and \`refetch\` for UI states.`,
    ],
    architecture: `\`\`\`text
                    QueryClientProvider (one QueryClient = cache)
                                   │
   ┌────────── query cache ─────────────────────────────┐
   │ ["events"]        → Event[]   (list)               │
   │ ["events", 1]     → Event     (detail)             │
   │ ["categories"]    → Category[] (staleTime 5 min)   │
   └─────▲───────────────────────────────▲──────────────┘
         │ useQuery                      │ invalidateQueries / setQueryData / removeQueries
 useEvents(), useEvent(id), useCategories()     useCreateEvent / useUpdateEvent / useDeleteEvent
         │                                       │ mutationFn → eventService.create/update/remove
   Events / EventDetails / EventEdit / EventForm ┘

 Zustand authStore  → token, user, role   (CLIENT state: not from the server cache)
 useState           → search text, checkbox, form fields (local UI state)
\`\`\`
\`invalidateQueries({ queryKey: ["events"] })\` matches by prefix: it marks \`["events"]\` **and** \`["events", 1]\` stale and refetches the ones currently in use.`,
    steps: [
      {
        title: `1. One QueryClient for the app`,
        body: `\`\`\`tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000, // default is 0: data is stale immediately
      retry: (failureCount, error) => !(error instanceof ApiError && error.status < 500) && failureCount < 1,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    </QueryClientProvider>
  </StrictMode>
);
\`\`\`

Defaults in v5: \`staleTime\` 0, \`gcTime\` 5 minutes (how long **unused** cache entries are kept), 3 retries with backoff, refetch on window focus. Retrying a 404 is pointless, so the custom \`retry\` skips 4xx.`,
      },
      {
        title: `2. Queries replace useEffect hooks`,
        body: `\`\`\`ts
export const eventKeys = {
  all: ["events"] as const,
  detail: (id: number) => ["events", id] as const,
};

export function useEvents() {
  return useQuery({ queryKey: eventKeys.all, queryFn: ({ signal }) => eventService.list(signal) });
}

export function useEvent(id: number | null) {
  return useQuery({
    queryKey: eventKeys.detail(id ?? 0),
    queryFn: ({ signal }) => eventService.get(id as number, signal),
    enabled: id !== null, // invalid id → no request
  });
}
\`\`\`

No \`useState\`, no \`useEffect\`, no manual AbortController: the library passes a \`signal\`, de-duplicates requests and caches results by key.`,
      },
      {
        title: `3. Read the query state in components`,
        body: `\`\`\`tsx
const { data: events = [], isPending, isError, error, refetch, isFetching } = useEvents();

if (isPending) return <p role="status">Loading events…</p>;      // no data yet
if (isError) return <p role="alert">{error.message} <button onClick={() => refetch()}>Try again</button></p>;
// …render events; isFetching is also true during background refetches:
{isFetching && <span role="status">Refreshing…</span>}
\`\`\`

In details pages, a 404 is now \`error instanceof ApiError && error.status === 404\`.`,
      },
      {
        title: `4. Mutations + invalidation`,
        body: `\`\`\`ts
export function useUpdateEvent(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: EventDto) => eventService.update(id, dto), // PUT → 204
    onSuccess: () => queryClient.invalidateQueries({ queryKey: eventKeys.all }),
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => eventService.remove(id),
    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: eventKeys.detail(id), exact: true });
      return queryClient.invalidateQueries({ queryKey: eventKeys.all, exact: true });
    },
  });
}
\`\`\`

\`\`\`tsx
const updateEvent = useUpdateEvent(eventId);
async function handleUpdate(dto: EventDto) {
  await updateEvent.mutateAsync(dto); // throws on error → EventForm shows it
  navigate(\`/events/\${eventId}\`);
}
\`\`\`

Returning the invalidation promise from \`onSuccess\` makes \`mutateAsync\` wait until the refetch has finished, so the next page shows fresh data.`,
      },
      {
        title: `5. Keep Zustand for client state only`,
        body: `The auth store from Stage 6 is unchanged: who is logged in is **client** state that the server does not send on every request. Do not copy \`events\` into Zustand or \`useState\`: you would have two sources of truth and would need to keep them in sync by hand. Search text and checkboxes stay in local \`useState\` (Stage 8 moves them into the URL).`,
      },
    ],
    todos: [
      `In \`main.tsx\`, create one \`QueryClient\` (staleTime, no retry for 4xx) and wrap the app in \`QueryClientProvider\`.`,
      `Rewrite \`useEvents\` with \`useQuery({ queryKey: eventKeys.all, queryFn: ({ signal }) => … })\` and update \`Events.tsx\` to \`isPending\` / \`isError\` / \`data\` / \`refetch\`.`,
      `Rewrite \`useEvent(id)\` with \`eventKeys.detail(id)\` and \`enabled: id !== null\`; update \`EventDetails\`/\`EventEdit\` (404 via \`ApiError.status\`).`,
      `Finish \`useUpdateEvent\` and \`useDeleteEvent\` (invalidate/remove queries) and use the mutation hooks in \`EventNew\`, \`EventEdit\` and \`EventDetails\`.`,
      `Show a "Refreshing…" indicator from \`isFetching\` (background refetch) separately from the first-load \`isPending\`.`,
    ],
    expectedBehavior: `- The first visit to Events shows "Loading events…"; going to a details page and back shows the list **instantly** from the cache (no loading text while the data is fresh).
- Clicking Refresh shows "Refreshing…" while the old list stays visible.
- After editing an event, both the details page and the list show the new values without a manual reload.
- After deleting, the event disappears from the list; \`/events/{deleted id}\` shows "Event not found".
- "Make the next API request fail" + Refresh: the failure is retried once automatically (500 then 200 in the network log).`,
    mistakes: [
      {
        mistake: `Creating \`new QueryClient()\` inside a component, so every render gets an empty cache.`,
        fix: `Create it once at module level (or with \`useState(() => new QueryClient())\`) and pass it to \`QueryClientProvider\`.`,
      },
      {
        mistake: `Copying query data into \`useState\`/Zustand ("so I can change it").`,
        fix: `Keep one source of truth: read from \`useQuery\`, change the server with \`useMutation\`, then invalidate or update the cache.`,
      },
      {
        mistake: `Using a key that does not include the variables the query depends on, e.g. \`["event"]\` for every id.`,
        fix: `Include every input in the key: \`["events", id]\`. Different keys = different cache entries.`,
      },
      {
        mistake: `Expecting \`isLoading\` to mean "no data yet" (v4 habit), or confusing \`cacheTime\`/\`gcTime\` with \`staleTime\`.`,
        fix: `In v5 use \`isPending\` for "no data yet" (\`isLoading\` = \`isPending && isFetching\`). \`staleTime\` = how long data counts as fresh; \`gcTime\` = how long unused data stays cached.`,
      },
    ],
    starter: { files: S7S, entry: "main.tsx", open: "main.tsx" },
    reference: { files: S7R, entry: "main.tsx", open: "hooks/useEventMutations.ts" },
    knowledgeCheck: [
      {
        question: `What is the difference between server state and client state?`,
        answer: `Server state is a cached copy of data owned by the backend (it can change elsewhere and needs fetching, caching and refetching). Client state exists only in the browser (logged-in user, UI toggles, form input).`,
      },
      {
        question: `What does \`invalidateQueries({ queryKey: ["events"] })\` do?`,
        answer: `It marks every query whose key starts with \`["events"]\` as stale and refetches the ones that are currently active (observed); inactive ones refetch when they are used again.`,
      },
      {
        question: `Why is \`enabled: id !== null\` used in \`useEvent\`?`,
        answer: `It disables the query for invalid ids, so no request is sent until there is a valid id.`,
      },
      {
        question: `\`isPending\` vs \`isFetching\`?`,
        answer: `\`isPending\`: the query has no data yet. \`isFetching\`: a request is in flight right now — including background refetches while old data is shown.`,
      },
    ],
    lessons: ["state-kinds", "tq-usequery-keys", "tq-mutations-invalidation", "zustand-basics", "zustand-selectors", "react-custom-hooks"],
  },
  {
    id: "stage-08",
    number: 8,
    title: "Professional refinement: URL filters, pagination, a11y, tests",
    basedOn: "Supplementary (Lectures 8–9 on responsive/accessible UI and search/filter were not supplied; Week 05 asks for labelled, described form errors)",
    sourceKind: "supplementary",
    summary: `Polish the app the way a professional team would. Search, category and "available only" filters move into the URL with \`useSearchParams\`, the list is paginated on the client (the API has no paging parameters), controls are properly labelled with a live result count, focus moves sensibly (skip link, \`<main>\` after navigation, first invalid form field), the layout becomes a responsive CSS grid, and you learn how to test it with Vitest + React Testing Library.`,
    objectives: [
      `Store shareable view state (search, filters, page) in the URL with \`useSearchParams\` and treat it as untrusted input.`,
      `Implement client-side filtering and pagination as derived data.`,
      `Apply accessibility basics: labels, \`aria-live\`, skip link, focus management and visible focus styles.`,
      `Make the layout responsive with CSS grid and media queries.`,
      `Write component tests with Vitest and React Testing Library (outside the sandbox).`,
    ],
    architecture: `\`\`\`text
URL  /events?q=fest&category=3&available=1&page=2
        │ useSearchParams()  (strings or null — validate!)
        ▼
Events  q, category, availableOnly, requestedPage
        events (useQuery ["events"]) ──filter(q, category, available)──▶ filtered   (useMemo)
        pageCount = ceil(filtered.length / PAGE_SIZE);  page = clamp(requestedPage)
        pageItems = filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE)
        ├── <div class="filters"> labelled input / select / checkbox ──updateParam()──▶ setSearchParams
        ├── <p aria-live="polite">3 events found</p>
        ├── <ul class="event-grid"> <li><EventCard/></li>…   (CSS grid, auto-fill minmax(220px,1fr))
        └── <Pagination page pageCount onPageChange/>

Layout: [Skip to main content] → <Navbar/> → <main id="main" tabIndex={-1}> (focused on path change)
\`\`\``,
    steps: [
      {
        title: `1. Filters in the URL with useSearchParams`,
        body: `\`\`\`tsx
const [searchParams, setSearchParams] = useSearchParams();
const q = searchParams.get("q") ?? "";
const category = searchParams.get("category") ?? "";
const availableOnly = searchParams.get("available") === "1";
const requestedPage = Number(searchParams.get("page") ?? "1");

function updateParam(key: string, value: string) {
  setSearchParams(
    (prev) => {
      const next = new URLSearchParams(prev);
      if (value) next.set(key, value);
      else next.delete(key);
      if (key !== "page") next.delete("page"); // new filter → back to page 1
      return next;
    },
    { replace: key === "q" } // no history entry per keystroke
  );
}
\`\`\`

The URL is now the single source of truth for the view: links can be shared, and Back/Forward restore filters. In the sandbox you can watch the query string in the "Current path" line.`,
      },
      {
        title: `2. Derived filtering and client-side pagination`,
        body: `\`\`\`tsx
const PAGE_SIZE = 2;

const filtered = useMemo(() => {
  const term = q.trim().toLowerCase();
  return events.filter(
    (e) =>
      e.title.toLowerCase().includes(term) &&
      (!category || e.categoryId === Number(category)) &&
      (!availableOnly || e.availableTickets > 0)
  );
}, [events, q, category, availableOnly]);

const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
const page = Number.isInteger(requestedPage) ? Math.min(Math.max(1, requestedPage), pageCount) : 1;
const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
\`\`\`

The CampusEvents API returns all events and has no search/paging parameters, so this is done on the client. With thousands of rows you would add server-side paging (and put \`page\`/\`q\` into the query key).`,
      },
      {
        title: `3. Accessibility: labels, live region and focus`,
        body: `\`\`\`tsx
<label htmlFor="category">
  Category
  <select id="category" value={category} onChange={(e) => updateParam("category", e.target.value)}>
    <option value="">All categories</option>
    {categories.map((c) => <option key={c.id} value={String(c.id)}>{c.name}</option>)}
  </select>
</label>

<p className="muted" aria-live="polite">{filtered.length} events found</p>
\`\`\`

\`\`\`tsx
// Layout.tsx — move focus to <main> when the path changes (not on the first render)
const mainRef = useRef<HTMLElement>(null);
const previousPath = useRef(location.pathname);
useEffect(() => {
  if (previousPath.current !== location.pathname) {
    previousPath.current = location.pathname;
    mainRef.current?.focus();
  }
}, [location.pathname]);
// <a href="#main" className="skip-link" onClick={skipToContent}>Skip to main content</a>
// <main id="main" ref={mainRef} tabIndex={-1}><Outlet /></main>
\`\`\`

\`EventForm\` also focuses the first invalid field after a failed submit; each error is linked to its input with \`aria-describedby\` and the input gets \`aria-invalid\`.`,
      },
      {
        title: `4. Responsive grid and visible focus`,
        body: `\`\`\`css
.event-grid {
  list-style: none;
  padding: 0;
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
}
:focus-visible { outline: 3px solid #f59e0b; outline-offset: 2px; }
.skip-link { position: absolute; left: 8px; top: -48px; }
.skip-link:focus { top: 8px; }
@media (max-width: 600px) {
  main { padding: 8px 12px; }
}
\`\`\`

\`auto-fill\` + \`minmax(220px, 1fr)\` creates as many columns as fit, so the grid works from phone to desktop without breakpoints. Resize the preview pane to see it reflow.`,
      },
      {
        title: `5. How to test this with Vitest + React Testing Library`,
        body: `Tests are **not run in the sandbox**; add them to your Vite project (\`npm i -D vitest jsdom @testing-library/react @testing-library/user-event @testing-library/jest-dom\`, and set \`test: { environment: "jsdom" }\` in the Vite config).

\`\`\`tsx
// src/components/EventCard.test.tsx
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import EventCard from "./EventCard";
import type { Event } from "../types/Event";

const base: Event = {
  id: 3, title: "Winter Music Festival", description: "", imageUrl: null,
  startDate: "2026-12-10T18:00:00", endDate: "2026-12-10T23:00:00", location: "Student Union",
  price: 12, capacity: 300, availableTickets: 0, categoryId: 3, categoryName: "Music",
};

describe("EventCard", () => {
  it("shows Sold out and a details link", () => {
    render(<MemoryRouter><EventCard event={base} /></MemoryRouter>);
    expect(screen.getByRole("heading", { name: "Winter Music Festival" })).toBeTruthy();
    expect(screen.getByText("Sold out")).toBeTruthy();
    expect(screen.getByRole("link", { name: "View details" }).getAttribute("href")).toBe("/events/3");
  });
});
\`\`\`

\`\`\`tsx
// src/pages/Events.test.tsx — mock fetch, then filter like a user
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import { afterEach, expect, it, vi } from "vitest";
import Events from "./Events";

afterEach(() => vi.restoreAllMocks());

it("filters by search text", async () => {
  vi.spyOn(globalThis, "fetch").mockImplementation(async (input) => {
    const url = String(input);
    const body = url.endsWith("/categories")
      ? [{ id: 1, name: "Technology" }]
      : [
          { id: 1, title: "Tech Conference", categoryId: 1, availableTickets: 5, price: 15, startDate: "2026-12-02T09:00:00", location: "Hall", categoryName: "Technology" },
          { id: 2, title: "Sports Day", categoryId: 2, availableTickets: 5, price: 5, startDate: "2026-12-05T10:00:00", location: "Centre", categoryName: "Sports" },
        ];
    return new Response(JSON.stringify(body), { status: 200, headers: { "Content-Type": "application/json" } });
  });
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={["/events"]}>
        <Events />
      </MemoryRouter>
    </QueryClientProvider>
  );

  expect(await screen.findByText("2 events found")).toBeTruthy();
  await userEvent.type(screen.getByLabelText("Search"), "sport");
  expect(await screen.findByText("1 event found")).toBeTruthy();
  expect(screen.queryByText("Tech Conference")).toBeNull();
});
\`\`\`

Query by **role and label** (what users perceive), give each test a fresh \`QueryClient\` with \`retry: false\`, and use \`findBy…\` for anything that appears asynchronously. With \`@testing-library/jest-dom\` you can write \`toBeInTheDocument()\` instead of \`toBeTruthy()\`.`,
      },
    ],
    todos: [
      `Move search and "available only" into the URL with \`useSearchParams\` (\`?q=…&available=1\`); use \`replace\` while typing and reset \`page\` when a filter changes.`,
      `Add a category \`<select>\` (from \`useCategories\`) that filters by \`categoryId\` (\`?category=…\`).`,
      `Paginate on the client (\`PAGE_SIZE = 2\`, clamp \`?page\`, \`slice\`) and finish \`Pagination\` (Previous/Next disabled at the ends, "Page x of y").`,
      `Accessibility: \`htmlFor\`/\`id\` on every control, \`aria-live\` result count, a skip link, focus \`<main>\` on route change and the first invalid field in \`EventForm\`.`,
      `Responsive CSS: \`.event-grid\` with \`repeat(auto-fill, minmax(220px, 1fr))\`, a visible \`:focus-visible\` outline and a narrow-screen media query.`,
      `(In your Vite project) write Vitest + RTL tests for \`EventCard\` and the Events search filter, as in step 5.`,
    ],
    expectedBehavior: `- Typing "fest" changes the path line to \`/events?q=fest\` and shows 1 result; clearing it removes \`q\`.
- Choosing a category or ticking "Only events with tickets" updates the URL and resets to page 1.
- With 3 events and \`PAGE_SIZE = 2\`: "Page 1 of 2"; Previous is disabled on page 1 and Next on page 2. \`?page=99\` is clamped to the last page.
- Cards form a grid that becomes one column in a narrow preview.
- Pressing Tab first shows the "Skip to main content" link; after clicking a nav link, focus moves to the main content; submitting an invalid form focuses the first invalid field.`,
    mistakes: [
      {
        mistake: `Trusting search params: \`Number(searchParams.get("page"))\` can be \`NaN\`, 0 or 99.`,
        fix: `Treat the URL as user input: validate and clamp (\`Number.isInteger\`, \`Math.min/Math.max\`) before using it.`,
      },
      {
        mistake: `Copying URL params into \`useState\` and syncing them with \`useEffect\`.`,
        fix: `Read values straight from \`useSearchParams\` and write with \`setSearchParams\` — the URL is the single source of truth.`,
      },
      {
        mistake: `Keeping the old page number when the filter changes, so the user lands on an empty page 3 of 1.`,
        fix: `Delete \`page\` whenever another filter changes, and clamp the page to \`pageCount\`.`,
      },
      {
        mistake: `Using placeholders instead of labels, removing focus outlines (\`outline: none\` on everything), or clickable \`<div>\`s.`,
        fix: `Every control needs a programmatic label (\`<label htmlFor>\`), interactive elements must be real \`<button>\`/\`<a>\`, and focus must stay visible (\`:focus-visible\`).`,
      },
      {
        mistake: `Testing implementation details (state values, class names) or calling the real API in tests.`,
        fix: `Test what users see and do (roles, labels, text, \`userEvent\`), and mock \`fetch\` (or use MSW) so tests are fast and deterministic.`,
      },
    ],
    starter: { files: S8S, entry: "main.tsx", open: "pages/Events.tsx" },
    reference: { files: S8R, entry: "main.tsx", open: "pages/Events.tsx" },
    knowledgeCheck: [
      {
        question: `Why put filters in the URL instead of \`useState\`?`,
        answer: `The URL survives reloads, can be shared or bookmarked, and works with Back/Forward. Local state disappears when the component unmounts.`,
      },
      {
        question: `Why is pagination done on the client here?`,
        answer: `The CampusEvents API returns the full list and has no paging or search parameters. Client-side paging is fine for small lists; large data sets need server-side paging.`,
      },
      {
        question: `What does \`aria-live="polite"\` do on the result count?`,
        answer: `Screen readers announce changes to that text when the user pauses, so they hear "1 event found" after filtering without moving focus.`,
      },
      {
        question: `Why does \`<main>\` get \`tabIndex={-1}\`?`,
        answer: `It can then receive focus from code (after navigation or via the skip link) without becoming an extra stop in the normal Tab order.`,
      },
    ],
    lessons: ["router-search-params", "arch-search-filter-pagination", "a11y-focus-keyboard", "testing-vitest-rtl", "forms-validation", "state-kinds"],
  },
];
