import type { TopicId } from "./types";

export interface CheatSheet {
  id: string;
  title: string;
  topic: TopicId;
  /** Shown in last-minute ICT mode. */
  highPriority: boolean;
  body: string;
}

const F = "```";

export const CHEAT_SHEETS: CheatSheet[] = [
  {
    id: "array-methods", title: "Array methods", topic: "javascript", highPriority: true,
    body: `| Method | Returns | Mutates? |
|---|---|---|
| \`map(fn)\` | new array, same length | no |
| \`filter(fn)\` | new array of matches (maybe empty) | no |
| \`find(fn)\` | **first** match or \`undefined\` | no |
| \`findIndex(fn)\` | index or \`-1\` | no |
| \`some(fn)\` / \`every(fn)\` | boolean | no |
| \`includes(v)\` | boolean (uses SameValueZero) | no |
| \`reduce(fn, init)\` | single accumulated value | no |
| \`sort(cmp)\` | the **same** array, sorted | **yes** (use \`toSorted\` / \`[...a].sort\`) |
| \`slice(s, e)\` | shallow copy of a range | no |
| \`splice(i, n, ...items)\` | removed items | **yes** |
| \`flatMap(fn)\` | mapped then flattened one level | no |

${F}js
const total = prices.reduce((sum, p) => sum + p, 0); // mock C1
const basket = items.reduce((sum, i) => sum + i.price * i.qty, 0);
const byPrice = [...products].sort((a, b) => a.price - b.price); // numeric sort needs a comparator
${F}
Always give \`reduce\` an initial value — without it an empty array throws a \`TypeError\`.`,
  },
  {
    id: "promises", title: "Promises & async", topic: "javascript", highPriority: true,
    body: `- States: **pending → fulfilled | rejected** (settled = fulfilled or rejected; settles once).
- \`await\` pauses only the async function; code after it runs as a **microtask**.
- Order: synchronous code → **all** microtasks (promise callbacks) → next task (\`setTimeout\`).

| Combinator | Resolves when | Rejects when |
|---|---|---|
| \`Promise.all\` | all fulfil (array of values, in order) | **first** rejection |
| \`Promise.allSettled\` | all settle (\`{status, value/reason}\`) | never |
| \`Promise.race\` | first to settle (either way) | first to settle rejects |
| \`Promise.any\` | first to fulfil | all reject (AggregateError) |

${F}js
// concurrent (fast): start both, then await both
const [users, courses] = await Promise.all([getUsers(), getCourses()]);
// sequential (slow): second request starts after first finishes
const a = await getUsers(); const b = await getCourses();
${F}`,
  },
  {
    id: "typescript", title: "TypeScript types", topic: "typescript", highPriority: true,
    body: `${F}ts
interface Product {          // mock C2
  id: number;
  name: string;
  price: number;
  description?: string;      // optional → string | undefined
  readonly sku?: string;     // cannot be reassigned
}
type Id = string | number;   // union: one OF the types (mock A14)
type Status = "idle" | "loading" | "error";   // literal union
type WithTimestamps = Product & { createdAt: string }; // intersection: ALL of them
type CreateProduct = Omit<Product, "id">;
type ProductPatch = Partial<Product>;
const [events, setEvents] = useState<Event[]>([]);
function first<T>(items: T[]): T | undefined { return items[0]; }
${F}
- \`type\` keyword defines an alias (mock A3); \`interface\` describes an object's shape (mock A8).
- Narrow unions with \`typeof\`, \`in\`, equality or a discriminant field.
- \`unknown\` must be narrowed before use; \`any\` turns checking off.
- **Types are erased at compile time** — they never validate API data at runtime (use Zod for that).`,
  },
  {
    id: "hooks", title: "React Hooks", topic: "react", highPriority: true,
    body: `| Hook | Use for | Remember |
|---|---|---|
| \`useState\` | local state that affects rendering | setter schedules a re-render; use \`set(prev => …)\` when based on previous |
| \`useEffect\` | sync with external systems (fetch, subscriptions, timers) | deps \`[]\` = after mount; \`[id]\` = when id changes; none = after every render; return cleanup |
| \`useRef\` | mutable value / DOM node without re-render | changing \`.current\` does not re-render |
| \`useContext\` | read a value provided higher up | all consumers re-render when the value changes |
| \`useReducer\` | complex state transitions | \`dispatch(action)\` → \`reducer(state, action)\` |
| \`useMemo\` / \`useCallback\` | memoise expensive values / stable functions | optimisation only — measure first |

**Rules of Hooks:** call hooks only at the top level of a component or custom hook — never in loops, conditions or nested functions. Custom hooks must start with \`use\`.

${F}tsx
useEffect(() => {
  const controller = new AbortController();
  load(controller.signal);
  return () => controller.abort(); // cleanup on unmount / before re-run
}, [id]);
${F}`,
  },
  {
    id: "router", title: "React Router (v7, react-router-dom)", topic: "router", highPriority: true,
    body: `${F}tsx
<BrowserRouter>
  <Routes>
    <Route path="/" element={<Layout />}>          {/* shared layout */}
      <Route index element={<Home />} />            {/* "/" */}
      <Route path="students" element={<StudentList />} />
      <Route path="students/:studentId" element={<StudentDetails />} />
      <Route path="settings" element={<Settings />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  </Routes>
</BrowserRouter>

function Layout() { return (<><nav>…</nav><Outlet /></>); } // child route renders here
const { studentId } = useParams();          // always a string | undefined
const navigate = useNavigate(); navigate("/settings"); navigate(-1);
const [searchParams, setSearchParams] = useSearchParams(); searchParams.get("q"); // string | null
const location = useLocation();
${F}
- \`<Link to>\` for user-chosen navigation; \`useNavigate()\` after an action (e.g. a successful save).
- \`<Navigate to="/login" replace />\` redirects while rendering (protected routes).
- Client-side routing changes the view **without a full page reload**; the server must serve \`index.html\` for deep links.`,
  },
  {
    id: "http", title: "HTTP methods & status codes", topic: "http-api", highPriority: true,
    body: `| Method | Purpose | Safe | Idempotent |
|---|---|---|---|
| GET | read | ✓ | ✓ |
| POST | create | ✗ | ✗ |
| PUT | replace/update a known resource | ✗ | ✓ |
| PATCH | partial update | ✗ | not guaranteed |
| DELETE | remove | ✗ | ✓ |

| Code | Meaning | Frontend should… |
|---|---|---|
| 200 | OK | use the body |
| 201 | Created | use returned resource / Location, refresh list |
| 204 | No Content | **don't** call \`response.json()\` |
| 400 | Bad Request | show validation messages, keep form data |
| 401 | Unauthenticated (missing/invalid/expired credentials) | clear auth, ask to log in again |
| 403 | Authenticated but not permitted | show "not allowed"; don't retry with same user |
| 404 | Not found | show not-found state |
| 409 | Conflict | explain conflict, refresh data |
| 422 | Unprocessable content | show field errors |
| 429 | Too many requests | back off, retry later |
| 500 | Server error | generic error + retry option |
| 503 | Service unavailable | retry later |`,
  },
  {
    id: "fetch", title: "Fetch patterns", topic: "http-api", highPriority: true,
    body: `${F}ts
export async function getCourses(signal?: AbortSignal): Promise<Course[]> {
  const res = await fetch("https://example.com/api/courses", { signal });
  if (!res.ok) throw new Error(\`HTTP \${res.status}\`); // fetch does NOT reject on 4xx/5xx
  return res.json();
}

export async function createEvent(data: NewEvent) {
  const res = await fetch("/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: \`Bearer \${token}\` },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Could not create event");
  return res.json(); // 201 + body
}
${F}
- \`fetch\` rejects only on network failure or abort (\`AbortError\`).
- Four UI states: **loading, error, empty, success** — an empty list is not an error.
- Service → Hook → Component: the service owns URLs/HTTP; the hook owns state; the component renders.`,
  },
  {
    id: "forms", title: "Form validation", topic: "forms-crud", highPriority: true,
    body: `${F}ts
function validateEvent(f: { eventName: string; location: string; maxAttendees: string }) {
  const errors: Record<string, string> = {};
  if (!f.eventName.trim()) errors.eventName = "Event name is required";
  if (!f.location.trim()) errors.location = "Location is required";
  const n = Number(f.maxAttendees);
  if (!Number.isInteger(n) || n <= 0) errors.maxAttendees = "Must be a positive whole number";
  return errors; // empty object = valid
}
${F}
- Controlled input: \`value={state}\` + \`onChange={e => set(e.target.value)}\`.
- \`e.preventDefault()\` in \`onSubmit\`; disable the button while submitting.
- Client validation = fast feedback; **server validation is mandatory** (users can bypass the browser).
- Navigate / show success only **after** the request succeeds.`,
  },
  {
    id: "tanstack", title: "TanStack Query (v5)", topic: "tanstack-query", highPriority: true,
    body: `${F}tsx
const { data, isPending, isFetching, error } = useQuery({
  queryKey: ["products"],          // cache identity
  queryFn: fetchProducts,
  staleTime: 60_000,               // fresh for 60 s → no refetch on mount while fresh
});
const qc = useQueryClient();
const mutation = useMutation({
  mutationFn: updateProduct,
  onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }), // refresh after update
});
${F}
- **staleTime**: how long data counts as fresh (default 0).
- **gcTime** (was \`cacheTime\` in v4): how long an **inactive** (unobserved) entry stays cached (default 5 min).
- Stale data is still shown while a background refetch runs (\`isFetching\`). \`isPending\` = no data yet.
- \`invalidateQueries\` marks matching queries stale and refetches active ones. Mutations don't update queries by themselves.
- Server state → TanStack Query; client/UI state → Zustand or local state.`,
  },
  {
    id: "zustand", title: "Zustand (v5)", topic: "zustand", highPriority: true,
    body: `${F}ts
import { create } from "zustand";
interface ThemeState { theme: "light" | "dark"; toggle: () => void }
export const useThemeStore = create<ThemeState>()((set) => ({
  theme: "light",
  toggle: () => set((s) => ({ theme: s.theme === "light" ? "dark" : "light" })),
}));
// in a component — select only what you need:
const theme = useThemeStore((s) => s.theme);
${F}
- \`create\` returns a **hook**; call it with a selector to read a slice (mock A12).
- A component re-renders only when its **selected value** changes (\`Object.is\`). Selecting the whole store re-renders on every change.
- Selecting several values as an object → wrap with \`useShallow\`.
- \`set\` shallow-merges; \`get()\` reads current state inside actions; \`persist\` middleware saves to storage.`,
  },
  {
    id: "jwt-security", title: "JWT & frontend security", topic: "security", highPriority: true,
    body: `- **Authentication** = who you are; **authorisation** = what you may do (mock E2).
- JWT = \`header.payload.signature\`, Base64URL-encoded — **readable by anyone, not encrypted**. Decoding ≠ verifying; only the server verifies the signature.
- \`exp\` is in **seconds** since epoch: expired if \`exp * 1000 <= Date.now()\`. Expired → clear auth state and re-authenticate (or refresh) (mock E1).
- 401 → not authenticated; 403 → authenticated but forbidden.
- Route guards and hidden buttons are **UX only**; the **server must enforce** permissions (mock E3).
- HTTPS protects data **in transit** (mock E4) — not against XSS or a compromised device.
- Treat API data as **untrusted** even after a 200 (mock E5): validate, and never render it as raw HTML.
- \`VITE_*\` variables are bundled into public JS — never put secrets there.
- React escapes text by default; \`dangerouslySetInnerHTML\` needs sanitisation (e.g. DOMPurify).`,
  },
  {
    id: "css-layout", title: "CSS Grid, Flexbox & responsive", topic: "html-css", highPriority: true,
    body: `${F}css
.page {
  display: grid;
  grid-template-columns: 200px 1fr;
  grid-template-areas:            /* named areas (mock A9) */
    "header header"
    "sidebar main";
  gap: 1rem;
}
.header { grid-area: header; }
.cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); } /* minmax: track min & max (B12) */
h1 { font-size: clamp(1.5rem, 4vw, 3rem); }  /* min, preferred, max (A16) */
.row { display: flex; justify-content: space-between; align-items: center; gap: 8px; }
a:focus-visible { outline: 2px solid; }      /* keyboard focus ring (A20) */
@media (min-width: 768px) { /* mobile-first: add rules for wider screens */ }
${F}
- Flexbox = one dimension (row **or** column); Grid = two dimensions.
- \`auto-fit\` collapses empty tracks; \`auto-fill\` keeps them.
- Bootstrap breakpoints: sm 576, md 768, lg 992, xl 1200, xxl 1400 — \`.container > .row > .col-md-6\`.`,
  },
  {
    id: "state-decision", title: "Where does this state belong?", topic: "state-architecture", highPriority: true,
    body: `| State | Tool |
|---|---|
| Input value in one form | \`useState\` / React Hook Form |
| Value computable from other state (basket total) | **derive** it — no extra state |
| Theme, sidebar, cart, preferences shared app-wide | **Zustand** (or Context) |
| Data from an API (products, events) | **TanStack Query** |
| Search filters / page that should be shareable | **URL** (\`useSearchParams\`) |
| Auth session | depends on the server design — server is the authority |

Zustand and TanStack Query are **complementary**, not interchangeable (mock B14, D4a).`,
  },
  {
    id: "a11y", title: "Accessibility", topic: "html-css", highPriority: false,
    body: `- Use semantic elements (\`button\`, \`nav\`, \`main\`, \`label\`) before ARIA.
- Every input needs a \`<label htmlFor>\`; link errors with \`aria-describedby\` and \`aria-invalid\`.
- All functionality must work with a keyboard; never remove focus outlines without a visible replacement (\`:focus-visible\`).
- Don't rely on colour alone; meet contrast ratios (4.5:1 for body text).
- Respect \`prefers-reduced-motion\`.`,
  },
  {
    id: "testing", title: "Vitest & React Testing Library", topic: "testing", highPriority: false,
    body: `${F}tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
test("shows an error when the name is empty", async () => {
  render(<EventForm />);
  await userEvent.click(screen.getByRole("button", { name: /create/i }));
  expect(screen.getByText(/name is required/i)).toBeInTheDocument();
});
${F}
- Query by role/label (what users perceive), not by class names.
- \`findBy…\` waits for async UI; mock \`fetch\` or use MSW for API calls.`,
  },
];
