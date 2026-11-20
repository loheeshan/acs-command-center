import type {
  CodeQuestion,
  Difficulty,
  ExamPaper,
  ExamSection,
  McqQuestion,
  Question,
  ShortQuestion,
  TrueFalseQuestion,
} from "../types";

/**
 * Two ORIGINAL practice papers with exactly the same structure, marks and
 * concept coverage as the supplied MOCK ICT, but with new scenarios and
 * wording. Practice mock 2 is harder and leans on output prediction,
 * find-the-bug and code-reading items.
 */

type Auto = "type" | "source";

const mcq = (q: Omit<McqQuestion, Auto>): McqQuestion => ({ ...q, type: "mcq", source: "practice" });
const tf = (q: Omit<TrueFalseQuestion, Auto>): TrueFalseQuestion => ({ ...q, type: "tf", source: "practice" });
const short = (q: Omit<ShortQuestion, Auto>): ShortQuestion => ({ ...q, type: "short", source: "practice" });
const code = (q: Omit<CodeQuestion, Auto>): CodeQuestion => ({ ...q, type: "code", source: "practice" });

const INSTRUCTIONS = [
  "Answer all questions in Sections A-E.",
  "The examination is worth 100 marks.",
  "Select one answer for each multiple-choice question.",
  "Select True or False for each statement.",
  "Use React with TypeScript or JavaScript and JSX for programming questions, as specified.",
  "Logically correct solutions receive credit.",
  "Show your reasoning where requested.",
  "All questions are based on client-side development. Backend implementation is outside the scope of this examination.",
];

function buildSections(a: Question[], b: Question[], c: Question[], d: Question[], e: Question[]): ExamSection[] {
  return [
    {
      id: "A",
      title: "Section A - Multiple Choice (20 marks)",
      instructions: "Choose ONE answer for each question. Each question is worth 1 mark.",
      suggestedMinutes: 15,
      questionIds: a.map((q) => q.id),
    },
    {
      id: "B",
      title: "Section B - True/False (15 marks)",
      instructions: "Select True or False for each statement. Each question is worth 1 mark.",
      suggestedMinutes: 10,
      questionIds: b.map((q) => q.id),
    },
    {
      id: "C",
      title: "Section C - Short Answer (15 marks)",
      instructions: "Answer all five questions. Each question is worth 3 marks.",
      suggestedMinutes: 15,
      questionIds: c.map((q) => q.id),
    },
    {
      id: "D",
      title: "Section D - Programming, Explanation and Code Analysis (40 marks)",
      instructions: "Answer all four questions. Each question is worth 10 marks.",
      suggestedMinutes: 40,
      questionIds: d.map((q) => q.id),
    },
    {
      id: "E",
      title: "Section E - Front-End Security (10 marks)",
      instructions: "Answer all five questions. Each question is worth 2 marks.",
      suggestedMinutes: 10,
      questionIds: e.map((q) => q.id),
    },
  ];
}

/* ================================================================== */
/* PRACTICE MOCK 1 — mixed (moderate)                                  */
/* ================================================================== */

const M: Difficulty = "intermediate";

const pm1A: McqQuestion[] = [
  mcq({
    id: "pm1-A1",
    topic: "javascript",
    subtopic: "Array reduce",
    difficulty: M,
    marks: 1,
    minutes: 0.75,
    prompt: `A food-delivery basket is stored as \`items: { price: number; qty: number }[]\`. Which expression correctly calculates the order total?`,
    options: [
      "`items.map((i) => i.price * i.qty)`",
      "`items.reduce((sum, i) => sum + i.price * i.qty)`",
      "`items.reduce((sum, i) => sum + i.price * i.qty, 0)`",
      "`items.forEach((sum, i) => sum + i.price * i.qty, 0)`",
    ],
    answer: 2,
    explanation:
      "`reduce` with an initial value of `0` starts the accumulator as a number and adds each line total, returning a single number (and `0` for an empty basket).",
    distractorNotes: {
      0: "`map` returns an **array** of line totals, not their sum.",
      1: "Without an initial value, the first **item object** becomes the accumulator, so `sum + ...` concatenates `\"[object Object]\"` with numbers. On an empty array it throws a TypeError.",
      3: "`forEach` always returns `undefined`; its callback parameters are `(element, index)`, not an accumulator.",
    },
    lessonId: "js-array-reduce",
    misconception: "Omitting reduce's initial value with an array of objects",
  }),
  mcq({
    id: "pm1-A2",
    topic: "router",
    subtopic: "useNavigate with replace",
    difficulty: M,
    marks: 1,
    minutes: 0.75,
    prompt:
      "After a gym member books a class, the app should go to `/bookings` and the browser Back button should NOT return to the booking form. Which is correct?",
    options: [
      "Render `<Navigate to=\"/bookings\" />` inside the submit handler",
      "Set `window.location.href = \"/bookings\"` in the submit handler",
      "Call `useNavigate(\"/bookings\")` inside the submit handler",
      "Call `const navigate = useNavigate()` at the top of the component, then `navigate(\"/bookings\", { replace: true })` in the handler",
    ],
    answer: 3,
    explanation:
      "`useNavigate` is called at the top level and returns a function; calling it with `{ replace: true }` replaces the current history entry, so Back skips the form.",
    distractorNotes: {
      0: "`<Navigate />` is a component — it only redirects when **rendered** as part of JSX, not when created inside an event handler.",
      1: "This triggers a full page reload (losing in-memory state) and pushes a new history entry, so Back returns to the form.",
      2: "Hooks cannot be called inside event handlers, and `useNavigate` takes no path argument.",
    },
    lessonId: "router-navigation",
    misconception: "Calling Hooks inside event handlers",
  }),
  mcq({
    id: "pm1-A3",
    topic: "typescript",
    subtopic: "Type aliases",
    difficulty: M,
    marks: 1,
    minutes: 0.75,
    prompt: "Which line creates a type alias for the allowed hospital appointment statuses?",
    options: [
      "`interface Status = \"booked\" | \"cancelled\";`",
      "`type Status = \"booked\" | \"cancelled\";`",
      "`enum type Status { booked, cancelled }`",
      "`let Status: type = \"booked\" | \"cancelled\";`",
    ],
    answer: 1,
    explanation:
      "`type Name = ...` declares a type alias. Here it is a union of string literal types, so only those two strings are assignable.",
    distractorNotes: {
      0: "Interfaces use `interface Name { ... }` with a body, and cannot be unions.",
      2: "`enum type` is not valid syntax.",
      3: "`let` declares a runtime variable; `type` cannot be used as a value's type like this.",
    },
    lessonId: "ts-basics-interfaces",
  }),
  mcq({
    id: "pm1-A4",
    topic: "react",
    subtopic: "Conditional rendering",
    difficulty: M,
    marks: 1,
    minutes: 0.75,
    prompt:
      "A hospital page must show `<Spinner />` while `isLoading` is true and `<AppointmentList />` otherwise. Which JSX is correct?",
    options: [
      "`{if (isLoading) <Spinner /> else <AppointmentList />}`",
      "`{isLoading ? <Spinner /> }`",
      "`{isLoading ? <Spinner /> : <AppointmentList />}`",
      "`<Spinner if={isLoading} /><AppointmentList />`",
    ],
    answer: 2,
    explanation:
      "JSX curly braces accept **expressions**, so the ternary operator is the standard way to choose between two elements.",
    distractorNotes: {
      0: "`if` is a statement, not an expression — it's a syntax error inside `{}` in JSX.",
      1: "A ternary needs both branches (`? a : b`); this is a syntax error.",
      3: "React has no `if` prop; this always renders both components.",
    },
    lessonId: "react-conditional-rendering",
  }),
  mcq({
    id: "pm1-A5",
    topic: "http-api",
    subtopic: "Status codes — 401",
    difficulty: M,
    marks: 1,
    minutes: 0.75,
    prompt:
      "A library app calls `GET /api/loans` with an **expired** JWT. Which status code should a correctly configured API return?",
    options: ["400 Bad Request", "401 Unauthorized", "403 Forbidden", "404 Not Found"],
    answer: 1,
    explanation:
      "An expired token is no longer valid authentication, so the request is unauthenticated → 401. The frontend should clear the session and ask the user to log in (or refresh the token).",
    distractorNotes: {
      0: "400 means the request itself is malformed/invalid (e.g. failed validation).",
      2: "403 means the user *is* authenticated but lacks permission — an expired token doesn't authenticate anyone.",
      3: "The endpoint exists; 404 would be wrong.",
    },
    lessonId: "sec-401-403-expiry",
    misconception: "Using 403 for expired/missing credentials",
  }),
  mcq({
    id: "pm1-A6",
    topic: "router",
    subtopic: "Outlet",
    difficulty: M,
    marks: 1,
    minutes: 0.75,
    prompt:
      "In a food-delivery admin area, `/admin` renders `<AdminLayout />` with nested routes `orders` and `menu`. The sidebar appears at `/admin/orders`, but the orders page never shows. What is most likely missing?",
    options: [
      "An `<Outlet />` inside `AdminLayout` where child pages should appear",
      "The `exact` prop on the parent `<Route>`",
      "A separate `<BrowserRouter>` around each child route",
      "A `key` prop on `<Routes>`",
    ],
    answer: 0,
    explanation:
      "The parent element is rendered, but it must contain `<Outlet />` to tell React Router where to render the matched child element.",
    distractorNotes: {
      1: "`exact` was a React Router v5 prop; v6/v7 routes match exactly by default and it no longer exists.",
      2: "You need one router for the whole app; nesting routers is an error.",
      3: "A key on `<Routes>` doesn't make child elements appear.",
    },
    lessonId: "router-nested-layouts-outlet",
  }),
  mcq({
    id: "pm1-A7",
    topic: "javascript",
    subtopic: "Promise.all rejection",
    difficulty: M,
    marks: 1,
    minutes: 0.75,
    prompt:
      "A gym dashboard runs `await Promise.all([getClasses(), getTrainers(), getMembers()])`. `getTrainers()` rejects after 100 ms; the other two fulfil after 2 s. What happens?",
    options: [
      "It waits 2 s and fulfils with `[classes, undefined, members]`",
      "It waits 2 s and fulfils with an array of `{ status, value | reason }` objects",
      "The other two requests are cancelled automatically",
      "The `await` throws after about 100 ms with getTrainers' error",
    ],
    answer: 3,
    explanation:
      "`Promise.all` rejects as soon as **any** input rejects (fail-fast), with that reason. The other requests keep running in the background but their results are ignored.",
    distractorNotes: {
      0: "`Promise.all` never fills failed slots with `undefined` — it rejects.",
      1: "That is the behaviour of `Promise.allSettled`.",
      2: "Promises can't be cancelled by `Promise.all`; aborting fetches needs an `AbortController`.",
    },
    lessonId: "js-promises-async",
    misconception: "Confusing Promise.all with Promise.allSettled",
  }),
  mcq({
    id: "pm1-A8",
    topic: "typescript",
    subtopic: "Interfaces are compile-time",
    difficulty: M,
    marks: 1,
    minutes: 0.75,
    prompt:
      "Which statement about `interface Book { isbn: string; title: string; available: boolean }` is correct?",
    options: [
      "It checks the JSON returned by the library API at runtime",
      "It can be instantiated with `new Book()`",
      "It describes the expected shape of objects for the compiler and is erased from the emitted JavaScript",
      "It makes all properties read-only automatically",
    ],
    answer: 2,
    explanation:
      "Interfaces are a compile-time contract. After compilation nothing of them remains, so they can't validate runtime data.",
    distractorNotes: {
      0: "Types are erased; runtime validation needs code (e.g. a Zod schema).",
      1: "Interfaces aren't classes and have no runtime value.",
      3: "Properties are only read-only if marked `readonly`.",
    },
    lessonId: "ts-basics-interfaces",
    misconception: "Believing types exist at runtime",
  }),
  mcq({
    id: "pm1-A9",
    topic: "html-css",
    subtopic: "grid-area",
    difficulty: M,
    marks: 1,
    minutes: 0.75,
    prompt: `A hospital dashboard uses \`grid-template-areas: "header header" "sidebar main";\`. Which rule places the \`<nav>\` in the sidebar area?`,
    options: [
      "`nav { grid-area: \"sidebar\"; }`",
      "`nav { grid-area: sidebar; }`",
      "`nav { grid-template-areas: sidebar; }`",
      "`nav { area: sidebar; }`",
    ],
    answer: 1,
    explanation:
      "Children are assigned to a named area with `grid-area` and an **unquoted** identifier matching the name used in `grid-template-areas`.",
    distractorNotes: {
      0: "Area names in `grid-area` are identifiers, not strings — the quoted value is invalid and ignored.",
      2: "`grid-template-areas` is set on the **container** to define the map, not on items.",
      3: "There is no `area` property.",
    },
    lessonId: "css-grid",
  }),
  mcq({
    id: "pm1-A10",
    topic: "router",
    subtopic: "useParams values",
    difficulty: M,
    marks: 1,
    minutes: 0.75,
    prompt:
      "Route: `/doctors/:doctorId/appointments/:apptId`. URL: `/doctors/7/appointments/19`. What does `useParams()` return?",
    options: [
      "`{ doctorId: 7, apptId: 19 }`",
      "`[\"7\", \"19\"]`",
      "`{ doctorId: \"7\", apptId: \"19\" }`",
      "`\"?doctorId=7&apptId=19\"`",
    ],
    answer: 2,
    explanation: "`useParams` returns an object keyed by param name; every value is a **string** taken from the URL.",
    distractorNotes: {
      0: "Params are never converted to numbers — use `Number(doctorId)` yourself.",
      1: "It returns an object, not an array.",
      3: "That looks like a query string; path params are not query parameters.",
    },
    lessonId: "router-dynamic-params",
    misconception: "Expecting numeric params",
  }),
  mcq({
    id: "pm1-A11",
    topic: "tanstack-query",
    subtopic: "staleTime",
    difficulty: M,
    marks: 1,
    minutes: 0.75,
    prompt:
      "The `[\"books\"]` query has `staleTime: 60_000`. A component using it mounts again 30 seconds after the last successful fetch. What happens?",
    options: [
      "The cached books are shown and no request is made, because the data is still fresh",
      "A refetch starts immediately because data is always refetched on mount",
      "The cache was deleted, so a loading spinner shows while it refetches",
      "Nothing now, but the query will poll the API every 60 seconds",
    ],
    answer: 0,
    explanation:
      "Data younger than `staleTime` is **fresh**: TanStack Query serves it from cache and skips refetch-on-mount/focus.",
    distractorNotes: {
      1: "Refetch on mount happens only for **stale** data; here it's fresh.",
      2: "Cache removal is governed by `gcTime` and only for inactive queries; nothing was deleted.",
      3: "Polling is `refetchInterval`; `staleTime` doesn't trigger requests.",
    },
    lessonId: "tq-stale-gc",
    misconception: "Thinking staleTime is a polling interval",
  }),
  mcq({
    id: "pm1-A12",
    topic: "zustand",
    subtopic: "Selectors",
    difficulty: M,
    marks: 1,
    minutes: 0.75,
    prompt:
      "`useCartStore` holds `{ items, addItem, clear }`. Which line subscribes a component ONLY to the number of items?",
    options: [
      "`const { items } = useCartStore(); const count = items.length;`",
      "`const count = useCartStore((s) => s.items.length);`",
      "`const count = useCartStore.items.length;`",
      "`const count = useContext(useCartStore).items.length;`",
    ],
    answer: 1,
    explanation:
      "Passing a selector returns just that number; the component re-renders only when the count changes (`Object.is`).",
    distractorNotes: {
      0: "Calling the hook with no selector subscribes to the whole store, so any change re-renders the component.",
      2: "The hook is a function; state isn't available as a property like this (that would be `useCartStore.getState()`).",
      3: "Zustand stores are not React contexts.",
    },
    lessonId: "zustand-selectors",
  }),
  mcq({
    id: "pm1-A13",
    topic: "http-api",
    subtopic: "204 No Content",
    difficulty: M,
    marks: 1,
    minutes: 0.75,
    prompt:
      "The hospital API answers `DELETE /api/appointments/12` with `204 No Content`. What should the frontend do?",
    options: [
      "Call `await response.json()` to read the deleted appointment",
      "Treat it as an error because there is no body",
      "Treat it as success with no body and update the UI/cache (e.g. remove the item or invalidate the list)",
      "Retry, because a 2xx without content means the server timed out",
    ],
    answer: 2,
    explanation: "204 is success (`response.ok === true`) with an intentionally empty body.",
    distractorNotes: {
      0: "Parsing an empty body throws `SyntaxError: Unexpected end of JSON input`.",
      1: "All 2xx codes are successes.",
      3: "A timeout produces a network error or 504, not a 204.",
    },
    lessonId: "http-methods-status",
    misconception: "Calling response.json() on a 204",
  }),
  mcq({
    id: "pm1-A14",
    topic: "typescript",
    subtopic: "Narrowing unions",
    difficulty: M,
    marks: 1,
    minutes: 0.75,
    prompt: "Given `function formatId(id: string | number)`, which body compiles under `strict`?",
    options: [
      "`return id.toUpperCase();`",
      "`return id.length;`",
      "`return id.trim();`",
      "`return typeof id === \"string\" ? id.toUpperCase() : id.toFixed(0);`",
    ],
    answer: 3,
    explanation:
      "On a union you may only use members common to **all** types. `typeof` narrows `id` to `string` in one branch and `number` in the other.",
    distractorNotes: {
      0: "`toUpperCase` doesn't exist on `number`.",
      1: "`length` doesn't exist on `number`.",
      2: "`trim` doesn't exist on `number`.",
    },
    lessonId: "ts-unions-narrowing",
  }),
  mcq({
    id: "pm1-A15",
    topic: "tanstack-query",
    subtopic: "invalidateQueries",
    difficulty: M,
    marks: 1,
    minutes: 0.75,
    prompt:
      "After a mutation adds a dish, `queryClient.invalidateQueries({ queryKey: [\"menu\"] })` is called. What happens?",
    options: [
      "Queries whose key starts with `[\"menu\"]` are marked stale and the active ones refetch",
      "The `[\"menu\"]` cache entries are deleted and every component shows a loading state",
      "The POST request is retried",
      "Only a query with exactly `[\"menu\"]` is affected; `[\"menu\", 5]` is not",
    ],
    answer: 0,
    explanation:
      "Invalidation uses **prefix matching** by default and refetches active matches in the background, so existing data stays on screen until fresh data arrives.",
    distractorNotes: {
      1: "Invalidation doesn't delete data (that's `removeQueries`); stale data stays visible while refetching.",
      2: "It refetches queries; it never re-runs mutations.",
      3: "Exact matching requires `exact: true`.",
    },
    lessonId: "tq-mutations-invalidation",
  }),
  mcq({
    id: "pm1-A16",
    topic: "html-css",
    subtopic: "clamp()",
    difficulty: M,
    marks: 1,
    minutes: 0.75,
    prompt:
      "`font-size: clamp(1rem, 2.5vw, 2rem);` with a 16px root font size. What is the computed size on a **1000px**-wide viewport?",
    options: ["16px", "25px", "32px", "40px"],
    answer: 1,
    explanation: "2.5vw = 2.5% × 1000px = 25px, which lies between the minimum (16px) and maximum (32px), so 25px is used.",
    distractorNotes: {
      0: "16px (the minimum) is used only when 2.5vw < 16px, i.e. viewports narrower than 640px.",
      2: "32px (the maximum) applies only above 1280px wide.",
      3: "40px would be 4vw; it's also above the 32px cap.",
    },
    lessonId: "css-responsive-clamp",
  }),
  mcq({
    id: "pm1-A17",
    topic: "forms-crud",
    subtopic: "Why client-side validation",
    difficulty: M,
    marks: 1,
    minutes: 0.75,
    prompt: "The gym API already validates bookings. Why validate the booking form on the client as well?",
    options: [
      "So the server no longer needs to validate",
      "Because `fetch` cannot send JSON unless it is validated first",
      "To give immediate feedback and avoid sending requests that will obviously fail — the server remains the authority",
      "Because client-side validation encrypts the form data",
    ],
    answer: 2,
    explanation: "Client validation is a UX feature (fast, specific messages, fewer wasted round-trips). It can be bypassed, so the server must still validate.",
    distractorNotes: {
      0: "Anyone can bypass browser checks; server validation is mandatory.",
      1: "`fetch` sends whatever body you give it.",
      3: "Validation doesn't encrypt anything; HTTPS protects data in transit.",
    },
    lessonId: "forms-validation",
    misconception: "Treating client validation as a replacement for server validation",
  }),
  mcq({
    id: "pm1-A18",
    topic: "router",
    subtopic: "useSearchParams",
    difficulty: M,
    marks: 1,
    minutes: 0.75,
    prompt: "On `/books?genre=history&page=2`, which code reads `page` as a number (defaulting to 1)?",
    options: [
      "`const { page } = useParams();`",
      "`const page = useSearchParams().page;`",
      "`const page = useLocation().search.page;`",
      "`const [searchParams] = useSearchParams(); const page = Number(searchParams.get(\"page\") ?? \"1\");`",
    ],
    answer: 3,
    explanation:
      "`useSearchParams` returns `[URLSearchParams, setter]`; `.get()` returns `string | null`, so default it and convert with `Number`.",
    distractorNotes: {
      0: "`useParams` reads path segments like `:id`, not the query string.",
      1: "`useSearchParams()` returns a tuple, which has no `page` property.",
      2: "`location.search` is a plain string (`\"?genre=history&page=2\"`), not an object.",
    },
    lessonId: "router-search-params",
  }),
  mcq({
    id: "pm1-A19",
    topic: "architecture",
    subtopic: "Service modules",
    difficulty: M,
    marks: 1,
    minutes: 0.75,
    prompt:
      "Why put `getAppointments()` and `createAppointment()` in `src/api/appointmentsApi.ts` rather than inside components?",
    options: [
      "One place owns the base URL, headers, error checks and parsing, so components stay focused on UI and the logic is reusable and testable",
      "It makes HTTP requests travel faster",
      "It bypasses CORS restrictions",
      "It removes the need for `useEffect` or TanStack Query",
    ],
    answer: 0,
    explanation:
      "Service modules are about separation of concerns and avoiding duplication; components (or `queryFn`s) just call the functions.",
    distractorNotes: {
      1: "Where code lives doesn't change network speed.",
      2: "CORS is enforced by the browser based on server headers; moving code can't bypass it.",
      3: "You still need something to call the functions at the right time (an effect or TanStack Query).",
    },
    lessonId: "http-service-modules",
  }),
  mcq({
    id: "pm1-A20",
    topic: "html-css",
    subtopic: ":focus-visible",
    difficulty: M,
    marks: 1,
    minutes: 0.75,
    prompt:
      "A designer added `button:focus { outline: none; }` because the ring looked ugly on mouse clicks. What is the best fix?",
    options: [
      "Add an outline on `:hover` instead",
      "Add `tabindex=\"-1\"` to every button",
      "Keep `outline: none` — screen readers don't need outlines",
      "Remove that rule and style `button:focus-visible { outline: 3px solid ...; }` so keyboard users get a clear indicator",
    ],
    answer: 3,
    explanation:
      "`:focus-visible` matches when the browser judges a focus indicator is needed (typically keyboard focus), so you can show a strong ring for keyboard users without showing it on every click.",
    distractorNotes: {
      0: "Hover doesn't help keyboard users, who never hover.",
      1: "`tabindex=\"-1\"` removes buttons from the Tab order — much worse.",
      2: "Sighted keyboard users rely on the focus indicator to know where they are (WCAG 2.4.7 Focus Visible).",
    },
    lessonId: "a11y-focus-keyboard",
    misconception: "Removing focus outlines for aesthetics",
  }),
];

const pm1B: TrueFalseQuestion[] = [
  tf({
    id: "pm1-B1",
    topic: "router",
    subtopic: "Client-side navigation",
    difficulty: M,
    marks: 1,
    minutes: 0.7,
    prompt: "Clicking a React Router `<Link>` makes the browser request a new HTML document from the server.",
    answer: false,
    explanation: "`<Link>` prevents the default full navigation, updates the URL via the History API and renders the matching route client-side.",
    lessonId: "router-basics",
  }),
  tf({
    id: "pm1-B2",
    topic: "typescript",
    subtopic: "Types are erased",
    difficulty: M,
    marks: 1,
    minutes: 0.7,
    prompt: "A TypeScript interface validates the JSON returned by `fetch` at runtime.",
    answer: false,
    explanation: "Interfaces are erased at compile time. `response.json()` returns `any`; to validate at runtime use a schema library such as Zod.",
    lessonId: "ts-basics-interfaces",
    misconception: "Believing types validate runtime data",
  }),
  tf({
    id: "pm1-B3",
    topic: "javascript",
    subtopic: "filter",
    difficulty: M,
    marks: 1,
    minutes: 0.7,
    prompt: "`filter()` returns a new array containing every element that passes the test — possibly an empty array.",
    answer: true,
    explanation: "Unlike `find()` (first match or `undefined`), `filter()` always returns an array.",
    lessonId: "js-array-methods",
  }),
  tf({
    id: "pm1-B4",
    topic: "react",
    subtopic: "Custom Hooks",
    difficulty: M,
    marks: 1,
    minutes: 0.7,
    prompt:
      "A function called `useBookings` that calls `useState` and `useEffect` is a custom Hook, and it must itself be called at the top level of a component or another Hook.",
    answer: true,
    explanation: "Custom Hooks follow the Rules of Hooks: top level only (not in conditions, loops or handlers), and only from components or Hooks.",
    lessonId: "react-custom-hooks",
  }),
  tf({
    id: "pm1-B5",
    topic: "http-api",
    subtopic: "403",
    difficulty: M,
    marks: 1,
    minutes: 0.7,
    prompt: "A logged-in USER who tries to delete an event that only an ADMIN may delete should normally receive 403 Forbidden.",
    answer: true,
    explanation: "The user is authenticated (valid token) but not authorised for that action → 403.",
    lessonId: "sec-401-403-expiry",
  }),
  tf({
    id: "pm1-B6",
    topic: "tanstack-query",
    subtopic: "Defaults",
    difficulty: M,
    marks: 1,
    minutes: 0.7,
    prompt: "TanStack Query's default `staleTime` is 5 minutes.",
    answer: false,
    explanation: "The default `staleTime` is **0** (data is stale immediately). 5 minutes is the default `gcTime` for inactive cache entries.",
    lessonId: "tq-stale-gc",
    misconception: "Mixing up staleTime and gcTime defaults",
  }),
  tf({
    id: "pm1-B7",
    topic: "zustand",
    subtopic: "Selectors",
    difficulty: M,
    marks: 1,
    minutes: 0.7,
    prompt:
      "In Zustand, a component that uses `useAppStore((s) => s.theme)` re-renders whenever an unrelated `cartCount` field in the same store changes.",
    answer: false,
    explanation: "Zustand compares the selected value (`s.theme`) before and after each update with `Object.is`; if it hasn't changed, the component doesn't re-render.",
    lessonId: "zustand-selectors",
  }),
  tf({
    id: "pm1-B8",
    topic: "router",
    subtopic: "Param types",
    difficulty: M,
    marks: 1,
    minutes: 0.7,
    prompt: "For a route `/patients/:patientId`, `useParams().patientId` has the type `string | undefined`.",
    answer: true,
    explanation: "React Router types every param as `string | undefined` because it can't prove at compile time which route is rendering.",
    lessonId: "router-dynamic-params",
  }),
  tf({
    id: "pm1-B9",
    topic: "forms-crud",
    subtopic: "Validation is not security",
    difficulty: M,
    marks: 1,
    minutes: 0.7,
    prompt: "Disabling the submit button while the form is invalid prevents a malicious user from sending invalid data to the API.",
    answer: false,
    explanation: "The user can re-enable the button in DevTools or call the API directly. Only server-side validation protects the data.",
    lessonId: "forms-validation",
  }),
  tf({
    id: "pm1-B10",
    topic: "http-api",
    subtopic: "Idempotency",
    difficulty: M,
    marks: 1,
    minutes: 0.7,
    prompt: "PUT is idempotent: sending the same PUT request twice leaves the resource in the same state as sending it once.",
    answer: true,
    explanation: "PUT sets the resource at a known URL to the given state; repeating it changes nothing further. POST is not idempotent.",
    lessonId: "crud-post-put-delete",
  }),
  tf({
    id: "pm1-B11",
    topic: "router",
    subtopic: "Layout routes",
    difficulty: M,
    marks: 1,
    minutes: 0.7,
    prompt: "Several nested routes can share one layout component that renders a common header and an `<Outlet />`.",
    answer: true,
    explanation: "That is exactly what a layout (parent) route is for.",
    lessonId: "router-nested-layouts-outlet",
  }),
  tf({
    id: "pm1-B12",
    topic: "html-css",
    subtopic: "auto-fit + minmax",
    difficulty: M,
    marks: 1,
    minutes: 0.7,
    prompt:
      "`grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));` creates as many columns of at least 200px as fit in the container, sharing any leftover space.",
    answer: true,
    explanation: "`auto-fit` fits as many tracks as possible at their minimum (200px); `1fr` as the maximum lets them grow to fill the row.",
    lessonId: "css-grid",
  }),
  tf({
    id: "pm1-B13",
    topic: "typescript",
    subtopic: "Literal unions",
    difficulty: M,
    marks: 1,
    minutes: 0.7,
    prompt: "A variable of type `\"pending\" | \"confirmed\"` may be assigned the string `\"cancelled\"`.",
    answer: false,
    explanation: "A union of string literals allows only those exact strings; assigning `\"cancelled\"` is a compile error.",
    lessonId: "ts-unions-narrowing",
  }),
  tf({
    id: "pm1-B14",
    topic: "state-architecture",
    subtopic: "Kinds of state",
    difficulty: M,
    marks: 1,
    minutes: 0.7,
    prompt:
      "Zustand is well suited to client/UI state such as whether a sidebar is open, while TanStack Query is suited to server state fetched from an API.",
    answer: true,
    explanation: "This is the standard split: TanStack Query for async server data (cache, refetch, invalidation); Zustand for synchronous client state.",
    lessonId: "state-kinds",
  }),
  tf({
    id: "pm1-B15",
    topic: "security",
    subtopic: "JWT decoding",
    difficulty: M,
    marks: 1,
    minutes: 0.7,
    prompt: "Decoding a JWT's payload in the browser proves that the token is genuine.",
    answer: false,
    explanation: "The payload is only Base64URL-encoded — anyone can decode (or forge) it. Only verifying the signature with the server's key proves authenticity, and that happens on the server.",
    lessonId: "sec-authn-authz",
    misconception: "Decoding is not verifying",
  }),
];

const pm1C = [
  code({
    id: "pm1-C1",
    topic: "javascript",
    subtopic: "Reduce over objects",
    difficulty: M,
    marks: 3,
    minutes: 3,
    language: "js",
    prompt: `**C1. JavaScript - Library Fines**

\`\`\`js
const loans = [
  { title: "Dune", daysLate: 3 },
  { title: "Emma", daysLate: 0 },
  { title: "Ulysses", daysLate: 5 },
];
\`\`\`

The fine is 20 pence per day late. Write ONE statement using \`reduce()\` that stores the total fine **in pence** in a variable named \`totalFine\`.`,
    rubric: [
      { criterion: "Uses `loans.reduce` with an accumulator and the current loan", marks: 1 },
      { criterion: "Adds `loan.daysLate * 20` to the accumulator and returns it", marks: 1 },
      { criterion: "Initial value `0`; result stored in `totalFine` (= 160)", marks: 1 },
    ],
    modelAnswer: `\`\`\`js
const totalFine = loans.reduce((sum, loan) => sum + loan.daysLate * 20, 0);
// 0 + 60 → 60 + 0 → 60 + 100 → 160
\`\`\``,
    explanation:
      "With an array of objects the initial value is essential — without it the first loan object would be the starting accumulator. Working in pence avoids floating-point surprises such as `3 * 0.2 = 0.6000000000000001`.",
    lessonId: "js-array-reduce",
  }),
  code({
    id: "pm1-C2",
    topic: "typescript",
    subtopic: "Interfaces with unions and optional props",
    difficulty: M,
    marks: 3,
    minutes: 3,
    language: "ts",
    prompt: `**C2. TypeScript - Appointment Shape**

Write a TypeScript interface named \`Appointment\` with:

- \`id\`: number
- \`patientName\`: string
- \`date\`: string (ISO date-time)
- \`status\`: only \`"booked"\`, \`"cancelled"\` or \`"completed"\`
- \`notes\`: optional string`,
    rubric: [
      { criterion: "Correct `interface Appointment { ... }` syntax with `id: number`, `patientName: string`, `date: string`", marks: 1 },
      { criterion: "`status` typed as the literal union `\"booked\" | \"cancelled\" | \"completed\"`", marks: 1 },
      { criterion: "`notes?: string` marked optional", marks: 1 },
    ],
    modelAnswer: `\`\`\`ts
interface Appointment {
  id: number;
  patientName: string;
  date: string;
  status: "booked" | "cancelled" | "completed";
  notes?: string;
}
\`\`\``,
    explanation: "A literal union restricts `status` to known values (and enables narrowing). `?` makes `notes` optional.",
    lessonId: "ts-unions-narrowing",
    misconception: "Typing a fixed set of values as plain string",
  }),
  code({
    id: "pm1-C3",
    topic: "router",
    subtopic: "useSearchParams",
    difficulty: M,
    marks: 3,
    minutes: 3,
    language: "tsx",
    prompt: `**C3. React Router - Query Strings**

A food-delivery menu page is opened at \`/menu?category=vegan\`. Name the React Router Hook used to read query-string values, and write the code that reads \`category\` into a constant, defaulting to \`"all"\` when it is missing.`,
    rubric: [
      { criterion: "Names `useSearchParams` (from `react-router-dom`)", marks: 1 },
      { criterion: "Destructures the tuple: `const [searchParams] = useSearchParams();`", marks: 1 },
      { criterion: "`searchParams.get(\"category\") ?? \"all\"` (handles the `null` return)", marks: 1 },
    ],
    modelAnswer: `Hook: **\`useSearchParams\`**

\`\`\`tsx
import { useSearchParams } from "react-router-dom";

function MenuPage() {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category") ?? "all";
  return <h1>Category: {category}</h1>;
}
\`\`\``,
    explanation: "`get()` returns `string | null`; `??` supplies the default only when the value is `null`/`undefined`.",
    lessonId: "router-search-params",
  }),
  short({
    id: "pm1-C4",
    topic: "tanstack-query",
    subtopic: "staleTime vs gcTime",
    difficulty: M,
    marks: 3,
    minutes: 3,
    prompt: `**C4. TanStack Query - Freshness**

A gym's class timetable changes at most once a day. Explain the difference between \`staleTime\` and \`gcTime\`, and suggest a sensible \`staleTime\` for the timetable query with a reason.`,
    rubric: [
      { criterion: "`staleTime`: how long fetched data is considered fresh — no automatic refetch on mount/focus/reconnect while fresh (default 0)", marks: 1 },
      { criterion: "`gcTime`: how long an INACTIVE (unobserved) cache entry is kept before garbage collection (default 5 minutes)", marks: 1 },
      { criterion: "Sensible value (e.g. several minutes to an hour) justified by how rarely the data changes, trading freshness for fewer requests", marks: 1 },
    ],
    modelAnswer: `- **staleTime** controls *freshness*. While data is younger than \`staleTime\`, TanStack Query serves it from the cache and does not refetch when a component mounts, the window regains focus or the network reconnects. Default \`0\` = stale immediately.
- **gcTime** controls *memory*. When no component is using a query (it becomes inactive), its cache entry is kept for \`gcTime\` (default 5 minutes) and then garbage-collected. Stale data is still in the cache and is shown instantly while a background refetch runs.

For a timetable that changes once a day, something like \`staleTime: 30 * 60 * 1000\` (30 minutes) is reasonable: navigating between pages won't trigger repeated requests, yet users get updated data within half an hour. (After a booking mutation you can still invalidate it explicitly.)`,
    explanation: "Fresh vs stale decides *whether to refetch*; gcTime decides *how long unused data stays in memory*.",
    lessonId: "tq-stale-gc",
    misconception: "Confusing staleTime with gcTime",
  }),
  short({
    id: "pm1-C5",
    topic: "http-api",
    subtopic: "fetch error handling",
    difficulty: M,
    marks: 3,
    minutes: 3,
    prompt: `**C5. API Handling - Failures**

A hospital booking request is made with \`fetch\`. Explain how the frontend must handle (i) the server responding \`500 Internal Server Error\` and (ii) the user being offline.`,
    rubric: [
      { criterion: "(i) `fetch` RESOLVES for a 500 — the promise does not reject", marks: 1 },
      { criterion: "(i) So the code must check `response.ok` / `response.status` and throw or show an error", marks: 1 },
      { criterion: "(ii) A network failure makes `fetch` REJECT (TypeError) — handled in `catch`, showing an offline/retry message", marks: 1 },
    ],
    modelAnswer: `\`\`\`ts
try {
  const response = await fetch("/api/appointments", { method: "POST", headers, body });
  if (!response.ok) {
    // (i) 4xx/5xx: fetch resolved, but the request failed
    throw new Error(\`Server error \${response.status}\`);
  }
  return await response.json();
} catch (err) {
  // (ii) offline/DNS/CORS failure → fetch rejected with a TypeError
  // (also reached by the error thrown above)
  setError("Could not book the appointment. Please try again.");
}
\`\`\`

(i) A 500 is still an HTTP response, so the \`fetch\` promise **resolves** with \`response.ok === false\`; without the check the app would treat the failure as success. (ii) When offline there is no response at all, so \`fetch\` **rejects** and execution jumps to \`catch\`.`,
    explanation: "fetch only rejects for network-level failures (or aborts). HTTP error statuses must be detected manually with `response.ok`.",
    lessonId: "http-methods-status",
    misconception: "Assuming fetch rejects on 4xx/5xx",
  }),
];

const pm1D = [
  code({
    id: "pm1-D1",
    topic: "router",
    subtopic: "Routes, layouts, params and navigation",
    difficulty: M,
    marks: 10,
    minutes: 10,
    language: "tsx",
    prompt: `**D1. React Router - Hospital Appointments (10 marks)**

A hospital appointments app has these pages:

- Home: \`/\`
- Doctor list: \`/doctors\`
- Doctor profile: \`/doctors/:doctorId\`
- Book appointment: \`/appointments/new\`
- Any other URL: a "Page not found" page

All pages share a layout with a navigation bar.

a. Write the React Router configuration, using a shared layout. **(4 marks)**

b. Explain the role of \`<Outlet />\` in the layout and why \`NavLink\` is useful in the navigation bar. **(2 marks)**

c. Write the \`DoctorProfile\` component: read \`doctorId\`, convert it to a number, and display "Invalid doctor" if it is not a positive integer, otherwise "Doctor #<id>". **(2 marks)**

d. After a successful booking for doctor 7, the app must go to that doctor's profile page and the Back button should not return to the completed form. Explain and show how. **(2 marks)**`,
    rubric: [
      { criterion: "(a) `BrowserRouter`/`Routes` with a parent layout route rendering the shared layout", marks: 1 },
      { criterion: "(a) `index` route for home and `doctors` route nested under the layout", marks: 1 },
      { criterion: "(a) `doctors/:doctorId` and `appointments/new` routes defined", marks: 1 },
      { criterion: "(a) Catch-all `path=\"*\"` route for the not-found page", marks: 1 },
      { criterion: "(b) `<Outlet />` is where the matched child route renders inside the layout, so the nav is shared and stays mounted", marks: 1 },
      { criterion: "(b) `NavLink` knows when its route is active (adds `active` class / `isActive`), so the current page can be highlighted (with `aria-current`)", marks: 1 },
      { criterion: "(c) Reads `doctorId` with `useParams` and converts with `Number(...)`", marks: 1 },
      { criterion: "(c) Validates with `Number.isInteger(id) && id > 0` and renders the two messages", marks: 1 },
      { criterion: "(d) `const navigate = useNavigate()` at the component's top level, called after the booking succeeds", marks: 1 },
      { criterion: "(d) `navigate(\"/doctors/7\", { replace: true })` (or template with the id) — replace stops Back returning to the form", marks: 1 },
    ],
    modelAnswer: `**(a)**

\`\`\`tsx
import { BrowserRouter, Routes, Route, Outlet, NavLink } from "react-router-dom";

function HospitalLayout() {
  return (
    <>
      <nav>
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/doctors">Doctors</NavLink>
        <NavLink to="/appointments/new">Book</NavLink>
      </nav>
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HospitalLayout />}>
          <Route index element={<HomePage />} />
          <Route path="doctors" element={<DoctorListPage />} />
          <Route path="doctors/:doctorId" element={<DoctorProfile />} />
          <Route path="appointments/new" element={<BookAppointmentPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
\`\`\`

**(b)** \`<Outlet />\` is the placeholder in the parent layout where React Router renders whichever child route matched (e.g. \`DoctorProfile\` at \`/doctors/3\`). The nav bar is written once and stays mounted while only the outlet content changes. \`NavLink\` is a \`Link\` that knows whether its \`to\` matches the current URL: it adds an \`active\` class (and \`aria-current="page"\`), so the current section is highlighted for sighted and screen-reader users. \`end\` on the Home link stops it matching every URL.

**(c)**

\`\`\`tsx
import { useParams } from "react-router-dom";

function DoctorProfile() {
  const { doctorId } = useParams();
  const id = Number(doctorId);

  if (!Number.isInteger(id) || id <= 0) {
    return <p>Invalid doctor</p>;
  }
  return <h1>Doctor #{id}</h1>;
}
\`\`\`

\`Number(undefined)\` is \`NaN\` and \`Number("abc")\` is \`NaN\`, both rejected by \`Number.isInteger\`.

**(d)**

\`\`\`tsx
import { useNavigate } from "react-router-dom";

function BookAppointmentPage() {
  const navigate = useNavigate(); // top level of the component

  async function handleBooked(doctorId: number) {
    await createAppointment(/* form values */);
    navigate(\`/doctors/\${doctorId}\`, { replace: true });
  }
  // ...
}
\`\`\`

\`useNavigate\` returns a function for navigation triggered by code. \`{ replace: true }\` replaces the form's history entry with the profile page, so Back goes to the page *before* the form.`,
    explanation:
      "Covers layout routes + Outlet, index and catch-all routes, NavLink active styling, string params and their validation, and programmatic navigation with replace.",
    lessonId: "router-nested-layouts-outlet",
  }),
  code({
    id: "pm1-D2",
    topic: "http-api",
    subtopic: "Fetching with dependencies and abort",
    difficulty: M,
    marks: 10,
    minutes: 10,
    language: "tsx",
    prompt: `**D2. React API Consumption - Restaurants by City (10 marks)**

A food-delivery app lists restaurants for the city the user chooses from a dropdown:

\`https://example.com/api/restaurants?city=<city>\`

Requirements:

- Fetch restaurants when the component loads **and whenever the city changes**.
- Show "Loading…" while a request is in progress.
- Show an error message if the request fails (including HTTP error statuses).
- Show "N restaurants in <city>" on success.
- If the city changes before the previous request finishes, the old response must not overwrite the new one, and no state updates must happen after unmount.

a. Explain what \`await\` does in an async function and why the page stays responsive while the request is pending. **(2 marks)**

b. Write a custom Hook \`useRestaurants(city: string)\` and a component that uses it. **(6 marks)**

c. Move the request into a service function and explain one benefit of doing so. **(2 marks)**`,
    rubric: [
      { criterion: "(a) `await` pauses only that async function until the promise settles (giving its value or throwing its rejection)", marks: 1 },
      { criterion: "(a) Control returns to the event loop meanwhile, so the main thread keeps handling rendering/input; the rest of the function resumes later as a microtask", marks: 1 },
      { criterion: "(b) `useEffect` with `[city]` as the dependency array", marks: 1 },
      { criterion: "(b) Loading state set at the start of each request and rendered", marks: 1 },
      { criterion: "(b) `response.ok` checked; error state set and rendered", marks: 1 },
      { criterion: "(b) Success renders the count and city", marks: 1 },
      { criterion: "(b) `AbortController` per effect run; `signal` passed to fetch; `abort()` in cleanup (cancels the previous city's request)", marks: 1 },
      { criterion: "(b) AbortError ignored; city encoded in URL (`encodeURIComponent`/`URLSearchParams`)", marks: 1 },
      { criterion: "(c) Correct service function taking `city` and `signal`, checking `ok`, returning parsed JSON", marks: 1 },
      { criterion: "(c) Benefit explained (reuse, one place to change URL/headers/errors, easier testing/mocking, usable as a queryFn)", marks: 1 },
    ],
    modelAnswer: `**(a)** \`await promise\` suspends *only the current async function* until the promise settles: it then resumes with the fulfilled value, or throws the rejection reason (so \`try/catch\` works). It does **not** block the thread — the function returns a pending promise to its caller, the event loop continues to run rendering, clicks and timers, and when the response arrives the rest of the function is scheduled to continue as a microtask.

**(b)**

\`\`\`tsx
import { useEffect, useState } from "react";
import { getRestaurants, type Restaurant } from "../api/restaurantsApi";

export function useRestaurants(city: string) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);
    setError(null);

    getRestaurants(city, controller.signal)
      .then((data) => {
        setRestaurants(data);
        setIsLoading(false);
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === "AbortError") return; // superseded or unmounted
        setError(err instanceof Error ? err.message : "Something went wrong");
        setIsLoading(false);
      });

    return () => controller.abort(); // runs before the next effect (city changed) and on unmount
  }, [city]);

  return { restaurants, isLoading, error };
}

export function RestaurantSummary({ city }: { city: string }) {
  const { restaurants, isLoading, error } = useRestaurants(city);

  if (isLoading) return <p>Loading…</p>;
  if (error) return <p role="alert">Could not load restaurants: {error}</p>;
  return <p>{restaurants.length} restaurants in {city}</p>;
}
\`\`\`

When \`city\` changes, React runs the previous effect's cleanup first, aborting the old request, so a slow response for the old city can never overwrite the new one (no race condition). On unmount the same cleanup prevents state updates.

**(c)**

\`\`\`ts
// src/api/restaurantsApi.ts
export interface Restaurant {
  id: number;
  name: string;
  city: string;
}

const BASE_URL = "https://example.com/api";

export async function getRestaurants(city: string, signal?: AbortSignal): Promise<Restaurant[]> {
  const params = new URLSearchParams({ city });
  const response = await fetch(\`\${BASE_URL}/restaurants?\${params}\`, { signal });
  if (!response.ok) {
    throw new Error(\`HTTP \${response.status}\`);
  }
  return response.json();
}
\`\`\`

Benefit: the URL, query-string encoding and error handling live in one place, so every component (or a TanStack Query \`queryFn\`) reuses the same tested logic; changing the API base URL or adding an auth header means editing one file, and components can be tested with a mocked service.`,
    explanation:
      "Key ideas: effects re-run when dependencies change; cleanup aborts stale requests (preventing races and post-unmount updates); `fetch` needs a manual `ok` check; service modules centralise data access.",
    lessonId: "http-abortcontroller",
    misconception: "Missing dependency → stale data; no abort → race conditions",
  }),
  code({
    id: "pm1-D3",
    topic: "forms-crud",
    subtopic: "Validation and POST",
    difficulty: M,
    marks: 10,
    minutes: 10,
    language: "ts",
    prompt: `**D3. Forms, Validation and CRUD - Gym Class Booking (10 marks)**

A gym booking form has three fields:

- Member Name — must not be empty
- Email — must look like an email address (something@something.something)
- Sessions — a whole number from 1 to 10 inclusive

If validation fails, field-specific error messages must be shown. If it succeeds, the data is sent to \`POST /api/bookings\` (the user's JWT must be sent as a Bearer token).

a. Write a validation function returning an object of field errors. **(4 marks)**

b. Write \`createBooking(data, token)\` using \`fetch\` and POST. Include the correct headers and JSON body, handle HTTP errors, and return the created booking. **(3 marks)**

c. Later the member wants to change the number of sessions on an existing booking (id 42). Which HTTP method and URL should the frontend use, and how does this differ from creating the booking? **(3 marks)**`,
    rubric: [
      { criterion: "(a) Member name: trimmed and non-empty, with message", marks: 1 },
      { criterion: "(a) Email: checked with a sensible pattern (e.g. `/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/`), with message", marks: 1 },
      { criterion: "(a) Sessions: converted to a number; `Number.isInteger` and range 1–10 enforced", marks: 1 },
      { criterion: "(a) Returns an errors object keyed by field (empty object = valid)", marks: 1 },
      { criterion: "(b) `method: \"POST\"`, `body: JSON.stringify(data)`", marks: 1 },
      { criterion: "(b) Headers: `Content-Type: application/json` and `Authorization: Bearer <token>`", marks: 1 },
      { criterion: "(b) Checks `response.ok` (throws otherwise) and returns `await response.json()`", marks: 1 },
      { criterion: "(c) Uses PUT (or PATCH for a partial update) to `/api/bookings/42` — the item URL including the id", marks: 1 },
      { criterion: "(c) POST goes to the collection URL and the server creates a new resource/id (201); PUT targets an existing one (often 204/200)", marks: 1 },
      { criterion: "(c) PUT is idempotent, POST is not (double-submitting a POST creates duplicates)", marks: 1 },
    ],
    modelAnswer: `**(a)**

\`\`\`ts
export interface BookingForm {
  memberName: string;
  email: string;
  sessions: string; // raw input value
}

export type BookingErrors = Partial<Record<keyof BookingForm, string>>;

const EMAIL_PATTERN = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;

export function validateBooking(form: BookingForm): BookingErrors {
  const errors: BookingErrors = {};

  if (form.memberName.trim() === "") {
    errors.memberName = "Please enter the member's name.";
  }

  if (!EMAIL_PATTERN.test(form.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }

  const sessions = Number(form.sessions);
  if (form.sessions.trim() === "" || !Number.isInteger(sessions) || sessions < 1 || sessions > 10) {
    errors.sessions = "Sessions must be a whole number between 1 and 10.";
  }

  return errors;
}
\`\`\`

**(b)**

\`\`\`ts
export interface NewBooking {
  memberName: string;
  email: string;
  sessions: number;
}

export interface Booking extends NewBooking {
  id: number;
}

export async function createBooking(data: NewBooking, token: string): Promise<Booking> {
  const response = await fetch("/api/bookings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: \`Bearer \${token}\`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(\`Booking failed (HTTP \${response.status})\`);
  }

  return (await response.json()) as Booking; // 201 Created with the new booking
}
\`\`\`

**(c)** Use **PUT \`/api/bookings/42\`** with the updated booking in the body (or **PATCH \`/api/bookings/42\`** with just \`{ "sessions": 5 }\` if the API supports partial updates). Differences from creating:

- **URL**: create posts to the *collection* (\`/api/bookings\`) and the server assigns the id; update targets a *specific existing resource* whose id is already known.
- **Response**: create typically returns **201 Created** with the new booking; update often returns **204 No Content** (so don't call \`response.json()\`) or 200.
- **Idempotency**: repeating the same PUT leaves the booking in the same state; repeating a POST creates a second booking — so disable the submit button while a POST is pending.`,
    explanation:
      "Validation must cope with whitespace, non-numeric input, decimals and ranges. Requests need method, JSON content type, serialised body, auth header and an `ok` check. Create vs update differ in URL, method, response and idempotency.",
    lessonId: "crud-post-put-delete",
  }),
  short({
    id: "pm1-D4",
    topic: "state-architecture",
    subtopic: "Choosing Zustand vs TanStack Query",
    difficulty: M,
    marks: 10,
    minutes: 10,
    prompt: `**D4. State Management - Library App (10 marks)**

A library app has these requirements:

- The member's preferred catalogue view ("grid" or "list") must be shared by several components and remembered after a page refresh.
- The book catalogue is loaded from an API and should be cached.
- When a member borrows a book, the book's availability shown everywhere must update.
- Navigating back and forth between pages must not trigger unnecessary requests.

a. State which requirements belong in Zustand and which in TanStack Query, with reasons. **(4 marks)**

b. Explain what a query key is and why the catalogue query for a genre filter should use a key such as \`["books", { genre }]\`. **(2 marks)**

c. Write a \`useMutation\` for borrowing a book that keeps the catalogue up to date. **(2 marks)**

d. A component needs both \`view\` and \`setView\` from the store. Show how to select them efficiently and explain why. **(2 marks)**`,
    rubric: [
      { criterion: "(a) View preference → Zustand (with `persist` middleware for refresh)", marks: 1 },
      { criterion: "(a) Reason: client/UI state, synchronous, not owned by the server; shared without prop drilling", marks: 1 },
      { criterion: "(a) Catalogue fetching/caching, refreshing availability and avoiding requests → TanStack Query", marks: 1 },
      { criterion: "(a) Reason: server state — caching by key, deduplication, staleTime, invalidation/background refetch", marks: 1 },
      { criterion: "(b) Query key uniquely identifies the cached data; same key = shared cache entry", marks: 1 },
      { criterion: "(b) Including `genre` gives each filter its own cache entry and refetches automatically when the genre changes (key change)", marks: 1 },
      { criterion: "(c) `useMutation` with a `mutationFn` calling the borrow endpoint", marks: 1 },
      { criterion: "(c) `onSuccess` calls `queryClient.invalidateQueries({ queryKey: [\"books\"] })` (prefix covers all genre variants)", marks: 1 },
      { criterion: "(d) Separate selectors (or one object selector wrapped in `useShallow`)", marks: 1 },
      { criterion: "(d) Explains re-render only when the selected values change; plain object selector without `useShallow` creates a new object each time (re-render loop in v5)", marks: 1 },
    ],
    modelAnswer: `**(a)**

- **Zustand**: the catalogue view preference. It's *client state* — it exists only in the browser, changes synchronously when the user clicks a toggle, and several components need it. A store avoids prop drilling; the \`persist\` middleware saves it to \`localStorage\` so it survives refresh.
- **TanStack Query**: loading the catalogue, caching it, updating availability after borrowing, and avoiding unnecessary requests. That is *server state* — owned by the backend, async and able to go out of date. TanStack Query caches by key, deduplicates identical requests, serves fresh data without refetching (\`staleTime\`), and refreshes after mutations with \`invalidateQueries\`.

\`\`\`ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

type View = "grid" | "list";
interface PrefsState {
  view: View;
  setView: (view: View) => void;
}

export const usePrefsStore = create<PrefsState>()(
  persist(
    (set) => ({
      view: "grid",
      setView: (view) => set({ view }),
    }),
    { name: "library-prefs" },
  ),
);
\`\`\`

**(b)** A query key is the array that identifies a query's data in the cache. Every \`useQuery\` with an equal key shares the same cache entry and request. Using \`["books", { genre }]\` means each genre has its **own** cached result (switching back to "history" shows its data instantly), and because the key changes when \`genre\` changes, TanStack Query fetches the new genre automatically. If the key were just \`["books"]\` while the \`queryFn\` used \`genre\`, different genres would overwrite each other and changing the filter would show the wrong cached data.

\`\`\`ts
useQuery({ queryKey: ["books", { genre }], queryFn: () => getBooks(genre), staleTime: 5 * 60_000 });
\`\`\`

**(c)**

\`\`\`ts
const queryClient = useQueryClient();

const borrowBook = useMutation({
  mutationFn: (bookId: number) => api.borrowBook(bookId), // POST /api/loans
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["books"] });
  },
});

// <button onClick={() => borrowBook.mutate(book.id)} disabled={borrowBook.isPending}>Borrow</button>
\`\`\`

\`["books"]\` matches every \`["books", { genre }]\` query by prefix; active ones refetch so availability updates everywhere.

**(d)**

\`\`\`ts
const view = usePrefsStore((s) => s.view);
const setView = usePrefsStore((s) => s.setView);

// or, one call:
import { useShallow } from "zustand/react/shallow";
const { view, setView } = usePrefsStore(useShallow((s) => ({ view: s.view, setView: s.setView })));
\`\`\`

Each selector subscribes the component only to what it uses; it re-renders only when \`view\` changes (\`setView\` is a stable function). Returning a fresh object from a selector without \`useShallow\` would fail the \`Object.is\` comparison on every check — in Zustand v5 that causes an infinite re-render error — so \`useShallow\` compares the object's properties instead.`,
    explanation: "Separating server state (TanStack Query) from client state (Zustand), designing query keys, invalidating after mutations and using precise selectors.",
    lessonId: "state-kinds",
  }),
];

const pm1E = [
  mcq({
    id: "pm1-E1",
    topic: "security",
    subtopic: "Handling 401 mid-session",
    difficulty: M,
    marks: 2,
    minutes: 2,
    prompt:
      "Halfway through a session, the library API starts returning **401** for the member's requests. What should the frontend do?",
    options: [
      "Retry the same request repeatedly until it succeeds",
      "Decode the JWT and change its `exp` claim to a future time",
      "Clear the stored auth state and redirect to the login page (remembering the page they were on), or attempt a token refresh if supported",
      "Show a \"403 Forbidden — you do not have permission\" page",
    ],
    answer: 2,
    explanation: "401 means the credentials are no longer valid (often expired). The user must re-authenticate (or refresh); afterwards the app can return them to where they were.",
    distractorNotes: {
      0: "Retrying with the same invalid token will keep failing.",
      1: "Editing the payload breaks the signature; the server will reject the token (that's exactly what signatures are for).",
      3: "403 is a different situation (authenticated but not permitted).",
    },
    lessonId: "sec-401-403-expiry",
  }),
  mcq({
    id: "pm1-E2",
    topic: "security",
    subtopic: "Authentication vs authorisation",
    difficulty: M,
    marks: 2,
    minutes: 2,
    prompt: "Which of the following is an **authorisation** check?",
    options: [
      "Verifying a member's password at login",
      "Checking that the signed-in user has the ADMIN role before allowing `DELETE /api/events/5`",
      "Hashing a password before storing it",
      "Checking that an email field contains an @ sign",
    ],
    answer: 1,
    explanation: "Authorisation decides what an already identified user may do — e.g. role-based permission for a delete.",
    distractorNotes: {
      0: "Verifying a password establishes identity — that's authentication.",
      2: "Password hashing is secure credential storage, part of authentication infrastructure.",
      3: "That's input validation.",
    },
    lessonId: "sec-authn-authz",
  }),
  mcq({
    id: "pm1-E3",
    topic: "security",
    subtopic: "Role-based UI",
    difficulty: M,
    marks: 2,
    minutes: 2,
    prompt:
      "A gym app shows the \"Delete class\" button only when the role decoded from the JWT in `localStorage` is `ADMIN`. Which statement is correct?",
    options: [
      "This is secure because the JWT is signed",
      "Hiding the button with CSS instead would be more secure",
      "Moving the role into a cookie makes the client-side check secure",
      "This is good UX, but the server must verify the token's signature and the ADMIN role on every DELETE request",
    ],
    answer: 3,
    explanation: "The client can be modified, and anyone can call the API directly. Only server-side checks (signature + role) enforce permissions.",
    distractorNotes: {
      0: "The *server* verifies signatures. The browser doesn't, and an attacker can simply send requests without using the UI.",
      1: "Hidden elements are still in the DOM and the endpoint is still callable.",
      2: "Where the client stores the role doesn't matter — client-side checks can always be bypassed.",
    },
    lessonId: "sec-trust-boundaries",
    misconception: "Treating UI guards as security",
  }),
  tf({
    id: "pm1-E4",
    topic: "security",
    subtopic: "XSS in React",
    difficulty: M,
    marks: 2,
    minutes: 2,
    prompt:
      "True or False: Rendering a user's review as `{review.text}` in JSX escapes it as text, whereas passing unsanitised review HTML to `dangerouslySetInnerHTML` can enable XSS.",
    answer: true,
    explanation: "React escapes strings rendered in JSX, so `<script>` appears as text. `dangerouslySetInnerHTML` inserts raw HTML; untrusted content must be sanitised (e.g. DOMPurify) first.",
    lessonId: "sec-xss-csrf-https",
  }),
  tf({
    id: "pm1-E5",
    topic: "security",
    subtopic: "Token storage",
    difficulty: M,
    marks: 2,
    minutes: 2,
    prompt: "True or False: Storing a JWT in `localStorage` protects it from being read by injected (XSS) scripts.",
    answer: false,
    explanation: "Any script running on the page can read `localStorage`. That's why preventing XSS matters; an `HttpOnly` cookie is not readable by JavaScript (though cookies bring CSRF considerations).",
    lessonId: "sec-xss-csrf-https",
    misconception: "Believing localStorage is a secure vault",
  }),
];

/* ================================================================== */
/* PRACTICE MOCK 2 — advanced (code reading, output prediction, bugs)  */
/* ================================================================== */

const H: Difficulty = "advanced";

const pm2A: McqQuestion[] = [
  mcq({
    id: "pm2-A1",
    topic: "javascript",
    subtopic: "reduce without an initial value",
    difficulty: H,
    marks: 1,
    minutes: 0.75,
    prompt: `What does this food-delivery snippet log?

\`\`\`js
const orders = [{ total: 12 }, { total: 8 }, { total: 5 }];
const result = orders.reduce((acc, o) => acc + o.total);
console.log(result);
\`\`\``,
    options: ["`25`", "`NaN`", "`\"[object Object]85\"`", "A `TypeError` is thrown"],
    answer: 2,
    explanation:
      "With no initial value, the accumulator starts as the **first element** (`{ total: 12 }`) and iteration starts at index 1. `{…} + 8` converts the object to `\"[object Object]\"` and concatenates → `\"[object Object]8\"`, then `+ 5` → `\"[object Object]85\"`. Fix: `reduce((acc, o) => acc + o.total, 0)`.",
    distractorNotes: {
      0: "25 requires the initial value `0`.",
      1: "NaN would come from adding `undefined` to a number; here the object is converted to a string, so `+` concatenates.",
      3: "A TypeError only happens when reducing an **empty** array with no initial value.",
    },
    lessonId: "js-array-reduce",
    misconception: "Omitting reduce's initial value",
  }),
  mcq({
    id: "pm2-A2",
    topic: "router",
    subtopic: "Rules of Hooks with useNavigate",
    difficulty: H,
    marks: 1,
    minutes: 0.75,
    prompt: `What is wrong with this login form?

\`\`\`tsx
function LoginForm() {
  async function handleSubmit() {
    await login();
    const navigate = useNavigate();
    navigate("/dashboard");
  }
  return <button onClick={handleSubmit}>Sign in</button>;
}
\`\`\``,
    options: [
      "`useNavigate` is called inside a nested function, breaking the Rules of Hooks — call it at the component's top level",
      "`navigate` returns a promise that must be awaited",
      "Programmatic navigation is impossible; a `<Link>` must be used",
      "`navigate` requires `{ replace: true }`",
    ],
    answer: 0,
    explanation: "Hooks must be called at the top level of a component/Hook, in the same order each render. Get `navigate` at the top and call it inside the handler.",
    distractorNotes: {
      1: "Awaiting isn't the issue (the Hook call itself is illegal).",
      2: "`useNavigate` exists precisely for programmatic navigation.",
      3: "`replace` is optional.",
    },
    lessonId: "router-navigation",
    misconception: "Calling Hooks inside event handlers",
  }),
  mcq({
    id: "pm2-A3",
    topic: "typescript",
    subtopic: "type vs interface",
    difficulty: H,
    marks: 1,
    minutes: 0.75,
    prompt: "Which of these can a `type` alias express that an `interface` declaration cannot?",
    options: [
      "An object with optional properties",
      "An object shape that extends another shape",
      "A union, e.g. `type Result = Success | Failure`",
      "An object with methods",
    ],
    answer: 2,
    explanation: "Interfaces describe object shapes only. Unions (and primitives, tuples, mapped/conditional types) need a `type` alias.",
    distractorNotes: {
      0: "Interfaces support `prop?: T`.",
      1: "Interfaces use `extends`; types use `&` — both can.",
      3: "Both can declare methods.",
    },
    lessonId: "ts-basics-interfaces",
  }),
  mcq({
    id: "pm2-A4",
    topic: "react",
    subtopic: "&& rendering pitfalls",
    difficulty: H,
    marks: 1,
    minutes: 0.75,
    prompt: `What does this render when the member has no bookings?

\`\`\`tsx
const bookings: Booking[] = [];
return <div>{bookings.length && <BookingList items={bookings} />}</div>;
\`\`\``,
    options: ["An empty `<div>`", "A `<div>` containing the text `0`", "A `<div>` containing the text `false`", "It throws an error"],
    answer: 1,
    explanation:
      "`0 && x` evaluates to `0`, and React renders numbers (only `false`, `null`, `undefined` and `true` render nothing). Use `bookings.length > 0 && ...` or a ternary.",
    distractorNotes: {
      0: "That would happen if the expression produced `false`, `null` or `undefined` — but it produces `0`.",
      2: "The expression is `0`, not `false`; and React doesn't render `false` anyway.",
      3: "Rendering a number is valid.",
    },
    lessonId: "react-conditional-rendering",
    misconception: "Using a number on the left of && in JSX",
  }),
  mcq({
    id: "pm2-A5",
    topic: "http-api",
    subtopic: "401 vs 403",
    difficulty: H,
    marks: 1,
    minutes: 0.75,
    prompt:
      "A user with a **valid, unexpired** token whose role is `USER` calls `PATCH /api/bookings/4/status`, which is restricted to `ADMIN`. What should the API return?",
    options: ["401 Unauthorized", "404 Not Found", "500 Internal Server Error", "403 Forbidden"],
    answer: 3,
    explanation: "Identity is established (valid token) but the role lacks permission → 403. The frontend should show 'not permitted', not redirect to login.",
    distractorNotes: {
      0: "401 is for missing/invalid/expired credentials; this token is valid.",
      1: "Some APIs hide resources with 404, but the standard answer for insufficient permission is 403.",
      2: "Nothing failed on the server.",
    },
    lessonId: "sec-401-403-expiry",
  }),
  mcq({
    id: "pm2-A6",
    topic: "router",
    subtopic: "Nested route matching",
    difficulty: H,
    marks: 1,
    minutes: 0.75,
    prompt: `\`HospitalLayout\` renders a header and an \`<Outlet />\`. What renders at \`/hospital/wards/3\`?

\`\`\`tsx
<Route path="/hospital" element={<HospitalLayout />}>
  <Route index element={<Overview />} />
  <Route path="wards/:wardId" element={<Ward />} />
</Route>
\`\`\``,
    options: [
      "Only `Ward` — the layout is replaced",
      "`HospitalLayout`, with `Ward` rendered in its `<Outlet />`",
      "`HospitalLayout` with both `Overview` and `Ward`",
      "Nothing, because the child path doesn't start with `/`",
    ],
    answer: 1,
    explanation: "Child paths are relative to the parent (`/hospital` + `wards/:wardId`). The parent element renders and the matched child fills the outlet.",
    distractorNotes: {
      0: "Nested routes render *inside* the parent's element, not instead of it.",
      2: "The index route matches only `/hospital` exactly.",
      3: "Relative child paths are the normal form.",
    },
    lessonId: "router-nested-layouts-outlet",
  }),
  mcq({
    id: "pm2-A7",
    topic: "javascript",
    subtopic: "Event loop ordering",
    difficulty: H,
    marks: 1,
    minutes: 0.75,
    prompt: `What is the console output order?

\`\`\`js
console.log("A");
setTimeout(() => console.log("B"), 0);
Promise.resolve().then(() => console.log("C"));
console.log("D");
\`\`\``,
    options: ["A B C D", "A D B C", "A C D B", "A D C B"],
    answer: 3,
    explanation:
      "Synchronous code runs first (A, D). Then the microtask queue is drained (promise reaction C) before the event loop takes the next task — the `setTimeout` callback (B).",
    distractorNotes: {
      0: "Callbacks never interrupt synchronous code; B and C can't run before D.",
      1: "A 0 ms timer is a (macro)task, which waits until all microtasks have run.",
      2: "`.then` callbacks are asynchronous even for already-resolved promises, so C runs after D.",
    },
    lessonId: "js-promises-async",
    misconception: "Thinking setTimeout(…, 0) runs before promise callbacks",
  }),
  mcq({
    id: "pm2-A8",
    topic: "typescript",
    subtopic: "Types don't validate runtime data",
    difficulty: H,
    marks: 1,
    minutes: 0.75,
    prompt: `The server returns \`{"id":"1","fullName":"Dr Lee"}\`. What happens?

\`\`\`ts
interface Doctor { id: number; name: string }
const res = await fetch("/api/doctors/1");
const doctor: Doctor = await res.json();
console.log(doctor.name);
\`\`\``,
    options: [
      "It compiles and runs; it logs `undefined`, and `doctor.id` is actually the string `\"1\"`",
      "TypeScript throws a runtime error because the shape doesn't match",
      "It fails to compile because `res.json()` returns `unknown`",
      "`fetch` rejects because the JSON doesn't match the interface",
    ],
    answer: 0,
    explanation:
      "`res.json()` returns `Promise<any>`, which is assignable to `Doctor` without checks, and types are erased at runtime. The mismatch goes unnoticed until something breaks. Validate with a schema (e.g. Zod) at the boundary.",
    distractorNotes: {
      1: "TypeScript doesn't exist at runtime.",
      2: "In the DOM typings `Response.json()` returns `Promise<any>`, so assignment compiles.",
      3: "`fetch` knows nothing about your types.",
    },
    lessonId: "ts-basics-interfaces",
    misconception: "Believing type annotations validate API responses",
  }),
  mcq({
    id: "pm2-A9",
    topic: "html-css",
    subtopic: "grid-template-areas rules",
    difficulty: H,
    marks: 1,
    minutes: 0.75,
    prompt: "Which `grid-template-areas` value is **invalid**?",
    options: [
      "`\"head head\" \"side main\"`",
      "`\"head head\" \"side .\"`",
      "`\"head side\" \"main head\"`",
      "`\"head\" \"main\" \"foot\"`",
    ],
    answer: 2,
    explanation:
      "Every named area must form a single filled **rectangle**. In option C, `head` occupies the top-left and bottom-right cells, which aren't contiguous, so the whole declaration is invalid and ignored.",
    distractorNotes: {
      0: "Valid: `head` spans the top row as a rectangle.",
      1: "Valid: `.` marks an empty (unnamed) cell.",
      3: "Valid: a single-column, three-row layout.",
    },
    lessonId: "css-grid",
  }),
  mcq({
    id: "pm2-A10",
    topic: "router",
    subtopic: "Param name mismatch",
    difficulty: H,
    marks: 1,
    minutes: 0.75,
    prompt: `Route: \`<Route path="/restaurants/:restaurantId" element={<Restaurant />} />\`. Inside \`Restaurant\`, \`id\` is always \`undefined\`. Why?

\`\`\`tsx
const { id } = useParams();
\`\`\``,
    options: [
      "The value must be converted with `Number()` first",
      "`useParams` only works in class components",
      "Path params must be read with `useSearchParams`",
      "The key must match the segment name: `const { restaurantId } = useParams();`",
    ],
    answer: 3,
    explanation: "`useParams` returns an object whose keys are the names after `:` in the path. There is no `id` key here.",
    distractorNotes: {
      0: "`Number(undefined)` is still `NaN` — the key is wrong.",
      1: "Hooks only work in function components.",
      2: "`useSearchParams` reads the `?query` string, not path segments.",
    },
    lessonId: "router-dynamic-params",
  }),
  mcq({
    id: "pm2-A11",
    topic: "tanstack-query",
    subtopic: "Stale data and gcTime",
    difficulty: H,
    marks: 1,
    minutes: 0.75,
    prompt:
      "The `[\"classes\"]` query uses the defaults (`staleTime: 0`, `gcTime: 5 min`). The user leaves the page (no component uses the query) and returns 2 minutes later. What happens?",
    options: [
      "A spinner shows because the cache entry was garbage-collected",
      "The cached classes appear immediately while a background refetch runs",
      "The cached classes appear and no request is made, because 2 min < 5 min",
      "The query errors because it was inactive",
    ],
    answer: 1,
    explanation:
      "The entry is still in the cache (inactive for less than `gcTime`), so it's shown instantly. Because it is stale (`staleTime: 0`), mounting triggers a background refetch (`isFetching` true, `isPending` false).",
    distractorNotes: {
      0: "GC happens only after 5 minutes of inactivity.",
      2: "`gcTime` doesn't make data fresh — freshness is `staleTime`, which is 0.",
      3: "Inactive queries are simply cached; nothing errors.",
    },
    lessonId: "tq-stale-gc",
    misconception: "Confusing gcTime with staleTime",
  }),
  mcq({
    id: "pm2-A12",
    topic: "zustand",
    subtopic: "Object selectors and useShallow",
    difficulty: H,
    marks: 1,
    minutes: 0.75,
    prompt: `What is the problem with this Zustand v5 code?

\`\`\`ts
const { items, total } = useCartStore((s) => ({ items: s.items, total: s.total }));
\`\`\``,
    options: [
      "None — the component re-renders only when `items` or `total` change",
      "It is a TypeScript error: selectors must return primitives",
      "The selector returns a new object every time, so it never equals the previous result (`Object.is`); in v5 this can cause an infinite re-render error — use `useShallow`",
      "It subscribes to nothing, so the component never updates",
    ],
    answer: 2,
    explanation:
      "Zustand compares selector results with `Object.is`. A new object literal is never identical to the last one. Wrap it: `useCartStore(useShallow((s) => ({ items: s.items, total: s.total })))`, or use two separate selectors.",
    distractorNotes: {
      0: "That's what `useShallow` achieves, not a plain object selector.",
      1: "Selectors may return anything; the issue is identity, not typing.",
      3: "It does subscribe — too eagerly, not too little.",
    },
    lessonId: "zustand-selectors",
    misconception: "Returning new objects from selectors",
  }),
  mcq({
    id: "pm2-A13",
    topic: "http-api",
    subtopic: "204 and response.json()",
    difficulty: H,
    marks: 1,
    minutes: 0.75,
    prompt: `The CampusEvents API returns **204 No Content** for this PUT. What happens?

\`\`\`ts
async function updateEvent(id: number, event: EventInput) {
  const res = await fetch(\`/api/events/\${id}\`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(event),
  });
  if (!res.ok) throw new Error("Update failed");
  return await res.json();
}
\`\`\``,
    options: [
      "It returns `null`",
      "`res.json()` rejects with a `SyntaxError` (unexpected end of JSON input), so the successful update looks like a failure",
      "It returns an empty object `{}`",
      "`fetch` itself rejects because 204 has no body",
    ],
    answer: 1,
    explanation:
      "204 is `ok`, so the guard passes, but the body is empty and `JSON.parse(\"\")` fails. Fix: `if (res.status === 204) return;` (or check `content-length`/`content-type`) before parsing.",
    distractorNotes: {
      0: "`res.json()` never turns an empty body into `null`.",
      2: "It doesn't return `{}` either — it throws.",
      3: "`fetch` resolves for every HTTP response; only network errors/aborts reject.",
    },
    lessonId: "crud-post-put-delete",
    misconception: "Parsing JSON from an empty 204 response",
  }),
  mcq({
    id: "pm2-A14",
    topic: "typescript",
    subtopic: "Discriminated unions",
    difficulty: H,
    marks: 1,
    minutes: 0.75,
    prompt: `Inside the \`if\`, which expression compiles?

\`\`\`ts
type Result =
  | { ok: true; data: Order[] }
  | { ok: false; error: string };

function show(r: Result) {
  if (r.ok) {
    // here
  }
}
\`\`\``,
    options: ["`r.data.length`", "`r.error.length`", "Both", "Neither without a type assertion"],
    answer: 0,
    explanation: "`ok` is a literal-typed discriminant; checking `r.ok` narrows `r` to `{ ok: true; data: Order[] }` inside the block.",
    distractorNotes: {
      1: "`error` only exists on the `ok: false` member, which has been excluded.",
      2: "Only the `true` branch is possible here.",
      3: "Narrowing on a discriminant property works without assertions.",
    },
    lessonId: "ts-unions-narrowing",
  }),
  mcq({
    id: "pm2-A15",
    topic: "tanstack-query",
    subtopic: "Query key prefix matching",
    difficulty: H,
    marks: 1,
    minutes: 0.75,
    prompt:
      "Order 7 was updated. Which single call refreshes both the `[\"orders\"]` list and the `[\"orders\", 7]` detail query?",
    options: [
      "`queryClient.invalidateQueries({ queryKey: [\"orders\", 7] })`",
      "`queryClient.invalidateQueries({ queryKey: [\"orders\"], exact: true })`",
      "`queryClient.invalidateQueries({ queryKey: [\"orders\"] })`",
      "`queryClient.removeQueries({ queryKey: [\"orders\", 7] })`",
    ],
    answer: 2,
    explanation: "Query filters match by **prefix** by default, so `[\"orders\"]` matches `[\"orders\"]` and `[\"orders\", 7]` (and any other order queries).",
    distractorNotes: {
      0: "This matches keys starting with `[\"orders\", 7]` — not the list `[\"orders\"]`.",
      1: "`exact: true` matches only the list.",
      3: "Removing drops the detail cache without refetching and leaves the list stale.",
    },
    lessonId: "tq-mutations-invalidation",
  }),
  mcq({
    id: "pm2-A16",
    topic: "html-css",
    subtopic: "clamp() calculation",
    difficulty: H,
    marks: 1,
    minutes: 0.75,
    prompt:
      "`h1 { font-size: clamp(1.5rem, 1rem + 2vw, 3rem); }` with a 16px root. What is the font size on a **2000px**-wide viewport?",
    options: ["24px", "40px", "56px", "48px"],
    answer: 3,
    explanation: "Preferred = 16px + 2% × 2000px = 16 + 40 = 56px. That exceeds the max (3rem = 48px), so the result is clamped to 48px.",
    distractorNotes: {
      0: "24px (1.5rem) is the minimum — used only on narrow viewports (≤ 400px).",
      1: "40px is just the 2vw part; the `1rem` must be added.",
      2: "56px is the preferred value, but it is above the 48px maximum.",
    },
    lessonId: "css-responsive-clamp",
  }),
  mcq({
    id: "pm2-A17",
    topic: "forms-crud",
    subtopic: "Validation edge cases",
    difficulty: H,
    marks: 1,
    minutes: 0.75,
    prompt:
      "A form validates \"Maximum attendees must be a positive integer\" with `if (Number(value) > 0) valid = true;`. Which input is **wrongly** accepted?",
    options: ["`\"-3\"`", "`\"2.5\"`", "`\"abc\"`", "`\"\"` (empty)"],
    answer: 1,
    explanation: "`Number(\"2.5\") > 0` is true, but 2.5 isn't an integer. Use `Number.isInteger(n) && n > 0`.",
    distractorNotes: {
      0: "`-3 > 0` is false — correctly rejected.",
      2: "`Number(\"abc\")` is `NaN`, and `NaN > 0` is false — correctly rejected.",
      3: "`Number(\"\")` is `0`, and `0 > 0` is false — correctly rejected.",
    },
    lessonId: "forms-validation",
    misconception: "Checking positivity but not integrality",
  }),
  mcq({
    id: "pm2-A18",
    topic: "router",
    subtopic: "setSearchParams replaces the query",
    difficulty: H,
    marks: 1,
    minutes: 0.75,
    prompt: "On `/books?genre=sci-fi&page=3`, a \"Next\" button calls `setSearchParams({ page: \"4\" })`. What is the new URL?",
    options: [
      "`/books?page=4`",
      "`/books?genre=sci-fi&page=4`",
      "`/books?genre=sci-fi&page=3&page=4`",
      "Unchanged — `setSearchParams` only updates React state",
    ],
    answer: 0,
    explanation:
      "Passing an object **replaces** the whole query string, so `genre` is lost. Keep other params with a functional update: `setSearchParams((prev) => { prev.set(\"page\", \"4\"); return prev; })`.",
    distractorNotes: {
      1: "That's the result of the functional update pattern, not of passing a new object.",
      2: "`page` is set to the single value given; existing entries are not appended to.",
      3: "`setSearchParams` navigates — the URL really changes.",
    },
    lessonId: "router-search-params",
    misconception: "Expecting setSearchParams to merge",
  }),
  mcq({
    id: "pm2-A19",
    topic: "architecture",
    subtopic: "Where to check response.ok",
    difficulty: H,
    marks: 1,
    minutes: 0.75,
    prompt: "In an app that uses TanStack Query, where should `if (!response.ok) throw new Error(...)` live?",
    options: [
      "Nowhere — TanStack Query detects 4xx/5xx responses automatically",
      "In the JSX of every component that displays the data",
      "In the API service function used as the `queryFn`, so a thrown error puts the query into its `error` state",
      "In a `useEffect` in each component",
    ],
    answer: 2,
    explanation: "TanStack Query only knows a query failed if the `queryFn` throws/rejects. Since `fetch` resolves on HTTP errors, the service function must throw.",
    distractorNotes: {
      0: "TanStack Query is fetch-agnostic: a resolved promise is a success, whatever the status.",
      1: "Duplicates logic, and the query would already be cached as 'success'.",
      3: "Pointless with TanStack Query and duplicates logic across components.",
    },
    lessonId: "http-service-modules",
    misconception: "Assuming fetch or TanStack Query treat HTTP errors as failures",
  }),
  mcq({
    id: "pm2-A20",
    topic: "html-css",
    subtopic: "Keyboard accessibility",
    difficulty: H,
    marks: 1,
    minutes: 0.75,
    prompt: "A menu is opened by `<div onClick={openMenu}>Menu</div>`. Keyboard users can't reach or activate it. Best fix?",
    options: [
      "Use `<button type=\"button\" onClick={openMenu}>Menu</button>`",
      "Add a `:hover` style to the div",
      "Add `tabIndex={-1}` to the div",
      "Add `outline: none` so the focus looks cleaner",
    ],
    answer: 0,
    explanation:
      "A native `<button>` is focusable, activates with Enter and Space, and is announced as a button — for free. Style its `:focus-visible` state so keyboard focus is clear.",
    distractorNotes: {
      1: "Hover doesn't help keyboard or screen-reader users.",
      2: "`-1` makes it programmatically focusable but keeps it out of the Tab order; it still wouldn't respond to Enter/Space.",
      3: "Removing outlines makes keyboard focus invisible.",
    },
    lessonId: "a11y-focus-keyboard",
  }),
];

const pm2B: TrueFalseQuestion[] = [
  tf({
    id: "pm2-B1",
    topic: "react",
    subtopic: "StrictMode effects",
    difficulty: H,
    marks: 1,
    minutes: 0.7,
    prompt:
      "In development with `<StrictMode>`, React runs an extra setup → cleanup cycle for effects on mount, so a fetch effect may start, abort and start again.",
    answer: true,
    explanation: "StrictMode simulates unmount/remount to reveal missing cleanups. With an AbortController you'll see one cancelled request in DevTools; production runs effects once.",
    lessonId: "http-abortcontroller",
  }),
  tf({
    id: "pm2-B2",
    topic: "react",
    subtopic: "Async effects",
    difficulty: H,
    marks: 1,
    minutes: 0.7,
    prompt: "Passing an `async` function directly to `useEffect` is fine because React awaits the returned promise.",
    answer: false,
    explanation: "An effect must return nothing or a cleanup function. An async function returns a Promise, which React doesn't await (and it warns). Define an async function inside the effect and call it.",
    lessonId: "react-custom-hooks",
    misconception: "useEffect(async () => …)",
  }),
  tf({
    id: "pm2-B3",
    topic: "javascript",
    subtopic: "Default sort",
    difficulty: H,
    marks: 1,
    minutes: 0.7,
    prompt: "`[3, 10, 1].sort()` returns `[1, 3, 10]`.",
    answer: false,
    explanation: "Without a comparator, `sort` compares elements as **strings**: \"1\" < \"10\" < \"3\", giving `[1, 10, 3]`. Use `sort((a, b) => a - b)`.",
    lessonId: "js-array-methods",
    misconception: "Expecting numeric default sort",
  }),
  tf({
    id: "pm2-B4",
    topic: "javascript",
    subtopic: "find",
    difficulty: H,
    marks: 1,
    minutes: 0.7,
    prompt: "`orders.find((o) => o.id === 99)` returns `undefined` when no order has id 99.",
    answer: true,
    explanation: "`find` returns the first match or `undefined`, so callers should handle the missing case (TypeScript types it as `T | undefined`).",
    lessonId: "js-array-methods",
  }),
  tf({
    id: "pm2-B5",
    topic: "http-api",
    subtopic: "fetch rejection rules",
    difficulty: H,
    marks: 1,
    minutes: 0.7,
    prompt: "`fetch` rejects its promise when the server responds with 404 Not Found.",
    answer: false,
    explanation: "Any HTTP response — including 404 or 500 — resolves the promise. Check `response.ok`. `fetch` rejects only on network failure or abort.",
    lessonId: "http-methods-status",
    misconception: "Assuming fetch rejects on HTTP errors",
  }),
  tf({
    id: "pm2-B6",
    topic: "tanstack-query",
    subtopic: "isLoading vs isPending",
    difficulty: H,
    marks: 1,
    minutes: 0.7,
    prompt: "In TanStack Query v5, `isLoading` is true only while a query has no data yet AND is fetching (`isPending && isFetching`).",
    answer: true,
    explanation: "`isPending` means no data yet; `isFetching` means a request is in flight. A disabled query with no data is pending but not loading.",
    lessonId: "tq-server-state",
  }),
  tf({
    id: "pm2-B7",
    topic: "zustand",
    subtopic: "set merges",
    difficulty: H,
    marks: 1,
    minutes: 0.7,
    prompt: "In a Zustand store with `{ count, user }`, calling `set({ count: 1 })` replaces the whole state, removing `user`.",
    answer: false,
    explanation: "`set` **shallow-merges** the partial state into the current state. Replacement only happens with `set(newState, true)`. (Nested objects are not merged deeply.)",
    lessonId: "zustand-basics",
  }),
  tf({
    id: "pm2-B8",
    topic: "router",
    subtopic: "Route ranking",
    difficulty: H,
    marks: 1,
    minutes: 0.7,
    prompt: "With routes `/orders/new` and `/orders/:orderId`, visiting `/orders/new` renders the `/orders/new` route.",
    answer: true,
    explanation: "React Router ranks routes by specificity: static segments beat dynamic ones regardless of declaration order.",
    lessonId: "router-dynamic-params",
  }),
  tf({
    id: "pm2-B9",
    topic: "forms-crud",
    subtopic: "Runtime validation",
    difficulty: H,
    marks: 1,
    minutes: 0.7,
    prompt: "Unlike a TypeScript interface, a Zod schema's `safeParse` can check the shape of API JSON at runtime.",
    answer: true,
    explanation: "Zod schemas are runtime code; `safeParse` returns `{ success, data | error }`, and `z.infer` derives the static type from the same schema.",
    lessonId: "forms-validation",
  }),
  tf({
    id: "pm2-B10",
    topic: "http-api",
    subtopic: "Idempotency",
    difficulty: H,
    marks: 1,
    minutes: 0.7,
    prompt: "Sending the same `POST /api/bookings` twice will only create one booking because POST is idempotent.",
    answer: false,
    explanation: "POST is **not** idempotent; a double click can create two bookings. Disable the button while pending (`isPending`) or use server-side idempotency keys.",
    lessonId: "crud-post-put-delete",
  }),
  tf({
    id: "pm2-B11",
    topic: "router",
    subtopic: "Param changes reuse components",
    difficulty: H,
    marks: 1,
    minutes: 0.7,
    prompt:
      "When navigating from `/doctors/1` to `/doctors/2`, React Router keeps the same component instance mounted, so a fetching effect must list `doctorId` in its dependency array to load doctor 2.",
    answer: true,
    explanation: "Same route, same element type → React re-renders instead of remounting. An effect with `[]` would keep showing doctor 1.",
    lessonId: "router-dynamic-params",
    misconception: "Expecting a remount on param change",
  }),
  tf({
    id: "pm2-B12",
    topic: "html-css",
    subtopic: "fr units",
    difficulty: H,
    marks: 1,
    minutes: 0.7,
    prompt: "In `grid-template-columns: 200px 1fr 2fr`, the `fr` tracks share the space left after the 200px track is allocated.",
    answer: true,
    explanation: "`fr` divides the remaining free space: here 1/3 and 2/3 of (container width − 200px − gaps).",
    lessonId: "css-grid",
  }),
  tf({
    id: "pm2-B13",
    topic: "typescript",
    subtopic: "Control-flow narrowing",
    difficulty: H,
    marks: 1,
    minutes: 0.7,
    prompt:
      "In `function f(x: string | number) { if (typeof x === \"string\") return; /* ... */ }`, `x` is narrowed to `number` after the `if`.",
    answer: true,
    explanation: "TypeScript's control-flow analysis knows the string case returned early, so only `number` remains.",
    lessonId: "ts-unions-narrowing",
  }),
  tf({
    id: "pm2-B14",
    topic: "tanstack-query",
    subtopic: "invalidateQueries refetchType",
    difficulty: H,
    marks: 1,
    minutes: 0.7,
    prompt: "By default, `invalidateQueries` immediately refetches every matching query, including inactive ones that no component is using.",
    answer: false,
    explanation: "Default `refetchType` is `'active'`: all matches are marked stale, but only active ones refetch immediately. Inactive ones refetch when next used.",
    lessonId: "tq-mutations-invalidation",
  }),
  tf({
    id: "pm2-B15",
    topic: "security",
    subtopic: "JWT exp units",
    difficulty: H,
    marks: 1,
    minutes: 0.7,
    prompt: "A JWT's `exp` claim is a Unix timestamp in **seconds**, so it should be compared with `Date.now() / 1000` (or multiplied by 1000).",
    answer: true,
    explanation: "`exp` is NumericDate (seconds); `Date.now()` returns milliseconds. Mixing units is a classic bug.",
    lessonId: "sec-401-403-expiry",
  }),
];

const pm2C = [
  code({
    id: "pm2-C1",
    topic: "javascript",
    subtopic: "Grouping with reduce",
    difficulty: H,
    marks: 3,
    minutes: 3,
    language: "ts",
    prompt: `**C1. JavaScript - Grouping with reduce()**

\`\`\`ts
const orders = [
  { restaurant: "Pizza Hub", total: 20 },
  { restaurant: "Sushi Go", total: 35 },
  { restaurant: "Pizza Hub", total: 15 },
];
\`\`\`

Using \`reduce()\`, create \`totalsByRestaurant\` equal to \`{ "Pizza Hub": 35, "Sushi Go": 35 }\`.`,
    rubric: [
      { criterion: "Initial value is an empty object (typed, e.g. `reduce<Record<string, number>>(..., {})`)", marks: 1 },
      { criterion: "Adds `order.total` to the existing value, defaulting a missing key to 0 (`?? 0`)", marks: 1 },
      { criterion: "Returns the accumulator from the callback", marks: 1 },
    ],
    modelAnswer: `\`\`\`ts
const totalsByRestaurant = orders.reduce<Record<string, number>>((acc, order) => {
  acc[order.restaurant] = (acc[order.restaurant] ?? 0) + order.total;
  return acc;
}, {});
\`\`\`

Forgetting \`return acc\` makes the next iteration's accumulator \`undefined\` (TypeError). Without \`?? 0\` the first addition is \`undefined + 20 = NaN\`.`,
    explanation: "reduce can build any value — here an object map. The generic argument types the accumulator so TypeScript doesn't infer `{}`.",
    lessonId: "js-array-reduce",
  }),
  code({
    id: "pm2-C2",
    topic: "typescript",
    subtopic: "Generic discriminated union",
    difficulty: H,
    marks: 3,
    minutes: 3,
    language: "ts",
    prompt: `**C2. TypeScript - Modelling Request State**

Write a generic type \`FetchState<T>\` where \`status\` is \`"idle"\`, \`"loading"\`, \`"success"\` or \`"error"\`; only the success state has \`data: T\` and only the error state has \`error: string\`.`,
    rubric: [
      { criterion: "Generic type parameter `<T>` used for `data`", marks: 1 },
      { criterion: "Union of four object types discriminated by literal `status` values", marks: 1 },
      { criterion: "`data` only on success and `error` only on error (no optional-everything single object)", marks: 1 },
    ],
    modelAnswer: `\`\`\`ts
type FetchState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: string };

function describe(state: FetchState<Doctor[]>): string {
  switch (state.status) {
    case "success":
      return \`\${state.data.length} doctors\`; // data available only here
    case "error":
      return state.error;
    default:
      return "…";
  }
}
\`\`\``,
    explanation: "A discriminated union makes impossible states (e.g. data AND error, or loading with stale error) unrepresentable, and switching on `status` narrows automatically.",
    lessonId: "ts-unions-narrowing",
    misconception: "Using one object with every field optional",
  }),
  code({
    id: "pm2-C3",
    topic: "router",
    subtopic: "Params are strings (bug)",
    difficulty: H,
    marks: 3,
    minutes: 3,
    language: "tsx",
    prompt: `**C3. React Router - Find the Bug**

\`\`\`tsx
// route: /patients/:patientId
function PatientPage() {
  const { patientId } = useParams();
  const nextId = patientId + 1;
  return <Link to={\`/patients/\${nextId}\`}>Next patient</Link>;
}
\`\`\`

At \`/patients/41\`, where does the link go? Explain why and fix it.`,
    rubric: [
      { criterion: "States the link goes to `/patients/411`", marks: 1 },
      { criterion: "Explains `useParams` values are strings (or undefined), so `+` concatenates", marks: 1 },
      { criterion: "Fix: `Number(patientId)` with a NaN/undefined check before adding", marks: 1 },
    ],
    modelAnswer: `The link goes to **\`/patients/411\`**. \`patientId\` is the string \`"41"\`; \`"41" + 1\` is string concatenation → \`"411"\`. (TypeScript also flags \`patientId\` as possibly \`undefined\`.)

\`\`\`tsx
function PatientPage() {
  const { patientId } = useParams();
  const id = Number(patientId);
  if (!Number.isInteger(id)) return <p>Invalid patient</p>;
  return <Link to={\`/patients/\${id + 1}\`}>Next patient</Link>;
}
\`\`\``,
    explanation: "URL segments are text. Always convert and validate params before arithmetic or API calls.",
    lessonId: "router-dynamic-params",
    misconception: "Treating params as numbers",
  }),
  short({
    id: "pm2-C4",
    topic: "tanstack-query",
    subtopic: "Query keys must include variables",
    difficulty: H,
    marks: 3,
    minutes: 3,
    prompt: `**C4. TanStack Query - Find the Bug**

\`\`\`tsx
function Menu({ restaurantId }: { restaurantId: number }) {
  const { data } = useQuery({
    queryKey: ["menu"],
    queryFn: () => getMenu(restaurantId),
    staleTime: 60_000,
  });
  // ...
}
\`\`\`

When the user switches from restaurant 1 to restaurant 2, the old menu is still shown. Explain why and fix it.`,
    rubric: [
      { criterion: "The cache is keyed only by `[\"menu\"]`, so both restaurants share one cache entry", marks: 1 },
      { criterion: "Changing `restaurantId` doesn't change the key → no new fetch while the data is fresh (staleTime), so restaurant 1's menu is shown", marks: 1 },
      { criterion: "Fix: include every variable the queryFn uses in the key: `queryKey: [\"menu\", restaurantId]`", marks: 1 },
    ],
    modelAnswer: `TanStack Query identifies cached data **only by its query key**. Both restaurants use \`["menu"]\`, so they share a single cache entry. When \`restaurantId\` changes, the key doesn't change, so TanStack Query sees the same query with fresh data (within \`staleTime\`) and does not refetch — restaurant 1's menu stays on screen.

\`\`\`tsx
const { data } = useQuery({
  queryKey: ["menu", restaurantId],
  queryFn: () => getMenu(restaurantId),
  staleTime: 60_000,
});
\`\`\`

Now each restaurant has its own entry, a key change triggers a fetch, and switching back shows the cached menu instantly. (Treat the query key like an effect's dependency array.)`,
    explanation: "Every variable used by the `queryFn` belongs in the `queryKey` (the official ESLint plugin enforces this).",
    lessonId: "tq-server-state",
    misconception: "Static query keys for parameterised queries",
  }),
  short({
    id: "pm2-C5",
    topic: "http-api",
    subtopic: "Handling 401 vs 403 centrally",
    difficulty: H,
    marks: 3,
    minutes: 3,
    prompt: `**C5. API Handling - Central Auth Errors**

Write a helper \`checkAuth(response: Response)\` used by the service layer that handles 401 and 403 differently, and explain why they must be handled differently.`,
    rubric: [
      { criterion: "401 branch: clears the stored session/token and redirects to login (or triggers refresh)", marks: 1 },
      { criterion: "403 branch: throws/shows a 'not permitted' error WITHOUT logging the user out", marks: 1 },
      { criterion: "Explanation: 401 = not authenticated (missing/invalid/expired token); 403 = authenticated but lacks permission, so re-login wouldn't help", marks: 1 },
    ],
    modelAnswer: `\`\`\`ts
import { useAuthStore } from "../stores/authStore";

export class ForbiddenError extends Error {}

export function checkAuth(response: Response): void {
  if (response.status === 401) {
    useAuthStore.getState().logout(); // clear token + user
    window.location.assign("/login?expired=1");
    throw new Error("Session expired");
  }
  if (response.status === 403) {
    throw new ForbiddenError("You do not have permission to do this.");
  }
}
\`\`\`

- **401** means the request isn't authenticated — the token is missing, invalid or expired. The only fix is to authenticate again, so the session is cleared and the user is sent to log in.
- **403** means the server knows who the user is but their role doesn't allow the action. Logging out would be wrong (and would loop: log in → same 403). Show an "access denied" message and keep the session.`,
    explanation: "Distinguishing authentication failures from authorisation failures gives correct UX and avoids login loops.",
    lessonId: "sec-401-403-expiry",
  }),
];

const pm2D = [
  code({
    id: "pm2-D1",
    topic: "router",
    subtopic: "Protected layout routes and redirects",
    difficulty: H,
    marks: 10,
    minutes: 10,
    language: "tsx",
    prompt: `**D1. React Router - Food Delivery with a Protected Checkout (10 marks)**

Pages:

- Home \`/\`, Restaurants \`/restaurants\`, Restaurant menu \`/restaurants/:restaurantId\`, Login \`/login\`
- Checkout \`/checkout\` — only for logged-in users
- Any unknown URL → Not Found

All pages share a layout with a nav bar. The auth token is in a Zustand store: \`useAuthStore((s) => s.token)\`.

a. Write the route configuration, including a **layout route** that protects \`/checkout\` by redirecting anonymous users to \`/login\`. **(4 marks)**

b. Explain how \`<Outlet />\` is used by both the shared layout and the protecting route. **(2 marks)**

c. Write the \`RestaurantMenu\` component's code that reads and validates \`restaurantId\` (positive integer) before using it. **(2 marks)**

d. After logging in, the user should return to the page they originally requested (e.g. \`/checkout\`) and Back should not show the login page. Show how. **(2 marks)**`,
    rubric: [
      { criterion: "(a) Shared layout route wrapping all pages, with index/restaurants/restaurants/:restaurantId/login children", marks: 1 },
      { criterion: "(a) A `RequireAuth` (pathless) layout route wrapping `checkout`", marks: 1 },
      { criterion: "(a) `RequireAuth` returns `<Navigate to=\"/login\" replace state={{ from: location }} />` when there's no token, otherwise `<Outlet />`", marks: 1 },
      { criterion: "(a) Catch-all `*` route", marks: 1 },
      { criterion: "(b) Layout's Outlet renders the matched page inside the shared chrome", marks: 1 },
      { criterion: "(b) RequireAuth's Outlet renders the protected child only when allowed — guards all nested routes at once; notes it's UX only (server enforces)", marks: 1 },
      { criterion: "(c) `useParams` → `Number(restaurantId)`", marks: 1 },
      { criterion: "(c) `Number.isInteger(id) && id > 0` check with an error UI before using it", marks: 1 },
      { criterion: "(d) Reads `location.state?.from?.pathname` (default `/`) via `useLocation`", marks: 1 },
      { criterion: "(d) After successful login: `navigate(from, { replace: true })`", marks: 1 },
    ],
    modelAnswer: `**(a)**

\`\`\`tsx
import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "./stores/authStore";

function RequireAuth() {
  const token = useAuthStore((s) => s.token);
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return <Outlet />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="restaurants" element={<RestaurantListPage />} />
          <Route path="restaurants/:restaurantId" element={<RestaurantMenu />} />
          <Route path="login" element={<LoginPage />} />
          <Route element={<RequireAuth />}>
            <Route path="checkout" element={<CheckoutPage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
\`\`\`

\`AppLayout\` renders the nav bar and an \`<Outlet />\`. \`RequireAuth\` is a *pathless* layout route: it adds no URL segment, only behaviour.

**(b)** Both are parent routes, and \`<Outlet />\` renders "whichever child matched". In \`AppLayout\` it places each page inside the shared nav/footer, which stay mounted. In \`RequireAuth\` the Outlet is rendered **only if** the user has a token — otherwise a \`<Navigate>\` is rendered instead — so every route nested under it (checkout, and any future account pages) is guarded by one component. This is a UX guard only: the API must still reject unauthenticated checkout requests with 401.

**(c)**

\`\`\`tsx
import { useParams } from "react-router-dom";

function RestaurantMenu() {
  const { restaurantId } = useParams();
  const id = Number(restaurantId);

  if (!Number.isInteger(id) || id <= 0) {
    return <p role="alert">Unknown restaurant.</p>;
  }

  return <MenuList restaurantId={id} />; // safe to use id now (e.g. in a query key)
}
\`\`\`

**(d)**

\`\`\`tsx
import { useLocation, useNavigate, type Location } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: Location } | null)?.from?.pathname ?? "/";
  const login = useAuthStore((s) => s.login);

  async function handleSubmit(email: string, password: string) {
    await login(email, password); // POST /api/auth/login, store token
    navigate(from, { replace: true });
  }
  // ... form JSX calling handleSubmit
}
\`\`\`

\`RequireAuth\` stored the requested location in navigation state. After login we navigate there with \`replace: true\`, replacing the login entry in history so Back doesn't return to the login form.`,
    explanation: "Protected routes are layout routes that render either `<Outlet />` or `<Navigate />`; location state carries the original destination through the login flow.",
    lessonId: "router-navigation",
    misconception: "Thinking client-side route guards are security",
  }),
  code({
    id: "pm2-D2",
    topic: "http-api",
    subtopic: "Debugging a data-fetching Hook",
    difficulty: H,
    marks: 10,
    minutes: 10,
    language: "tsx",
    prompt: `**D2. React API Consumption - Find and Fix the Bugs (10 marks)**

This Hook loads a doctor for a hospital app's \`/doctors/:doctorId\` page:

\`\`\`tsx
function useDoctor(doctorId: string) {
  const [doctor, setDoctor] = useState(null);

  useEffect(async () => {
    const res = await fetch(\`/api/doctors/\${doctorId}\`);
    setDoctor(await res.json());
  }, []);

  return doctor;
}
\`\`\`

a. Identify **four** distinct problems with this code. **(4 marks)**

b. Rewrite the Hook so that it exposes loading and error states, handles HTTP errors, reloads when \`doctorId\` changes and cancels stale requests. **(4 marks)**

c. The user clicks quickly from doctor 1 to doctor 2. Explain the race condition the original code could suffer if it *did* depend on \`doctorId\` but had no cancellation, and how your fix prevents it. **(2 marks)**`,
    rubric: [
      { criterion: "(a) `async` effect callback returns a Promise, not a cleanup function (React warns; cleanup impossible)", marks: 1 },
      { criterion: "(a) Missing `doctorId` in the dependency array → stays on the first doctor when the param changes", marks: 1 },
      { criterion: "(a) No `res.ok` check: a 404/500 error body is stored as if it were a doctor", marks: 1 },
      { criterion: "(a) Any one of: no AbortController/cleanup (race, update after unmount); no loading/error state; `useState(null)` infers type `null` so `doctor` is unusable/untyped", marks: 1 },
      { criterion: "(b) Async function defined inside the effect (or promise chain) and `[doctorId]` dependency", marks: 1 },
      { criterion: "(b) Loading and error state exposed and reset at the start of each request", marks: 1 },
      { criterion: "(b) `res.ok` checked; typed state (`Doctor | null`)", marks: 1 },
      { criterion: "(b) AbortController signal + `abort()` in cleanup; AbortError ignored", marks: 1 },
      { criterion: "(c) Race: request for doctor 1 may resolve AFTER doctor 2's, overwriting the newer data with doctor 1", marks: 1 },
      { criterion: "(c) Fix: cleanup aborts the previous request when `doctorId` changes, so only the latest response can set state", marks: 1 },
    ],
    modelAnswer: `**(a) Problems**

1. **\`useEffect(async () => …)\`** — an async function returns a Promise. React expects the effect to return nothing or a cleanup function; it warns, and there's no way to clean up.
2. **Missing dependency** — \`doctorId\` is used but the array is \`[]\`. Navigating from \`/doctors/1\` to \`/doctors/2\` reuses the component, so the effect never re-runs and doctor 1 stays on screen.
3. **No \`res.ok\` check** — \`fetch\` resolves on 404/500, so an error body (e.g. \`{ "message": "Not found" }\`) is stored as the doctor.
4. **No cancellation** — no AbortController/cleanup, so responses can arrive after unmount or out of order (see c).
5. *(also)* No loading/error state for the UI, no \`try/catch\` (network errors become unhandled rejections), and \`useState(null)\` infers the type \`null\`, so \`doctor\` is effectively untyped.

**(b) Fixed Hook**

\`\`\`tsx
import { useEffect, useState } from "react";

interface Doctor {
  id: number;
  name: string;
  specialty: string;
}

export function useDoctor(doctorId: string | undefined) {
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!doctorId) return;
    const controller = new AbortController();

    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(\`/api/doctors/\${encodeURIComponent(doctorId!)}\`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
        setDoctor((await res.json()) as Doctor);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, [doctorId]);

  return { doctor, isLoading, error };
}
\`\`\`

**(c) Race condition**

With \`[doctorId]\` but no cancellation, clicking doctor 1 then doctor 2 starts two requests. Responses can arrive in any order: if doctor 1's (slower) response arrives last, its \`setDoctor\` overwrites doctor 2's data — the URL says doctor 2 but the page shows doctor 1. With the fix, when \`doctorId\` changes React runs the previous effect's cleanup **before** the new effect, aborting request 1. Its promise rejects with \`AbortError\`, which is ignored, so only the latest request can update state. (The same cleanup prevents updates after unmount.)`,
    explanation: "Typical effect bugs: async effect callbacks, missing dependencies, ignored HTTP status and missing cleanup leading to race conditions. TanStack Query solves these generically via query keys and cancellation.",
    lessonId: "http-abortcontroller",
    misconception: "Missing dependencies and no cleanup in fetch effects",
  }),
  code({
    id: "pm2-D3",
    topic: "forms-crud",
    subtopic: "Edit form validation and PUT with 204",
    difficulty: H,
    marks: 10,
    minutes: 10,
    language: "ts",
    prompt: `**D3. Forms, Validation and CRUD - Rescheduling an Appointment (10 marks)**

A hospital app lets a patient edit appointment \`id\`. Fields:

- **Reason** — required, at most 200 characters (after trimming)
- **Date & time** — from an \`<input type="datetime-local">\`; must be a valid date and not in the past
- **Duration** — must be one of 15, 30, 45 or 60 minutes

The API is \`PUT /api/appointments/{id}\` (requires a Bearer token) and responds **204 No Content** on success, **400** with \`{ errors: Record<string, string> }\` for validation problems, **401** and **403** as usual.

a. Write \`validateAppointment(values, now)\` returning field errors. (Passing \`now\` in makes it testable.) **(4 marks)**

b. Write \`updateAppointment(id, data, token)\` using fetch. It must not try to parse a body on 204, and should surface the server's 400 field errors. **(3 marks)**

c. Compare POST, PUT and PATCH for this app, and say which method suits "cancel an appointment" (changing only its status) and why. **(3 marks)**`,
    rubric: [
      { criterion: "(a) Reason: trimmed, required, ≤ 200 chars — two distinct messages", marks: 1 },
      { criterion: "(a) Date: invalid date detected (`Number.isNaN(date.getTime())`)", marks: 1 },
      { criterion: "(a) Date not in the past (compared with `now`)", marks: 1 },
      { criterion: "(a) Duration in the allowed set (`[15, 30, 45, 60].includes(Number(...))`)", marks: 1 },
      { criterion: "(b) PUT with Content-Type JSON, Bearer token and `JSON.stringify` body to `/api/appointments/${id}`", marks: 1 },
      { criterion: "(b) 204/ok → return without calling `response.json()`", marks: 1 },
      { criterion: "(b) 400 → parse and surface `errors` (e.g. throw a typed error carrying them); other statuses → throw", marks: 1 },
      { criterion: "(c) POST = create at collection URL (not idempotent); PUT = replace/update a known resource (idempotent)", marks: 1 },
      { criterion: "(c) PATCH = partial update of some fields", marks: 1 },
      { criterion: "(c) Cancelling (status only) suits PATCH (or a dedicated action endpoint like `PUT /api/bookings/{id}/cancel` in CampusEvents) — only one field changes, so sending the whole object via PUT is unnecessary", marks: 1 },
    ],
    modelAnswer: `**(a)**

\`\`\`ts
export interface AppointmentForm {
  reason: string;
  dateTime: string; // "2026-11-26T10:30" from datetime-local
  duration: string; // from a <select>
}

export type AppointmentErrors = Partial<Record<keyof AppointmentForm, string>>;

const ALLOWED_DURATIONS = [15, 30, 45, 60];

export function validateAppointment(values: AppointmentForm, now: Date = new Date()): AppointmentErrors {
  const errors: AppointmentErrors = {};

  const reason = values.reason.trim();
  if (reason === "") {
    errors.reason = "Please give a reason for the appointment.";
  } else if (reason.length > 200) {
    errors.reason = "Reason must be 200 characters or fewer.";
  }

  const date = new Date(values.dateTime);
  if (values.dateTime === "" || Number.isNaN(date.getTime())) {
    errors.dateTime = "Please choose a valid date and time.";
  } else if (date.getTime() < now.getTime()) {
    errors.dateTime = "The appointment cannot be in the past.";
  }

  if (!ALLOWED_DURATIONS.includes(Number(values.duration))) {
    errors.duration = "Duration must be 15, 30, 45 or 60 minutes.";
  }

  return errors;
}
\`\`\`

**(b)**

\`\`\`ts
export interface AppointmentUpdate {
  reason: string;
  dateTime: string;
  duration: number;
}

export class ValidationError extends Error {
  constructor(public fieldErrors: Record<string, string>) {
    super("Validation failed");
  }
}

export async function updateAppointment(id: number, data: AppointmentUpdate, token: string): Promise<void> {
  const response = await fetch(\`/api/appointments/\${id}\`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: \`Bearer \${token}\`,
    },
    body: JSON.stringify(data),
  });

  if (response.ok) return; // 204 No Content — nothing to parse

  if (response.status === 400) {
    const body = (await response.json()) as { errors?: Record<string, string> };
    throw new ValidationError(body.errors ?? {});
  }

  throw new Error(\`Update failed (HTTP \${response.status})\`); // 401/403/404/500
}
\`\`\`

The form catches \`ValidationError\` and shows \`fieldErrors\` next to the inputs; 401 → log in again, 403 → "not permitted".

(Note: class parameter properties such as \`public fieldErrors\` aren't allowed under \`erasableSyntaxOnly\`; declare the field explicitly in that case.)

**(c)**

- **POST \`/api/appointments\`** — create a new appointment; the server assigns the id and usually returns 201. Not idempotent (two clicks → two appointments).
- **PUT \`/api/appointments/{id}\`** — replace/update an existing appointment with a full representation. Idempotent: sending it twice leaves the same state.
- **PATCH \`/api/appointments/{id}\`** — partial update: send only the fields that change, e.g. \`{ "status": "cancelled" }\`.

Cancelling changes a single field, so **PATCH** (or a dedicated action endpoint such as CampusEvents' \`PUT /api/bookings/{id}/cancel\`) fits best: it expresses intent, sends minimal data and avoids accidentally overwriting other fields with stale values from the client. A full PUT would work only if the client sends the entire current appointment.`,
    explanation: "Robust validation (whitespace, length, dates, allowed values), correct handling of 204 vs 400 bodies, and choosing the right HTTP method by semantics.",
    lessonId: "crud-post-put-delete",
    misconception: "Calling response.json() on 204 / ignoring structured 400 errors",
  }),
  short({
    id: "pm2-D4",
    topic: "state-architecture",
    subtopic: "Classifying state; staleTime; mutations; selectors",
    difficulty: H,
    marks: 10,
    minutes: 10,
    prompt: `**D4. State Management - Gym Booking App (10 marks)**

The app has: (1) a light/dark theme remembered between visits, (2) the weekly class timetable from the API, (3) the selected day filter, which should be shareable as a link, (4) the values typed into the booking form, (5) the user's own bookings from the API, which must update after booking.

a. For each of the five, choose the best home — Zustand, TanStack Query, the URL, or local component state — and justify briefly. **(4 marks)**

b. The timetable changes about once a week. Recommend \`staleTime\` and explain how it reduces requests, and what \`gcTime\` adds. **(2 marks)**

c. Write the mutation for booking a class so that both the timetable (available spaces) and "my bookings" refresh. **(2 marks)**

d. Explain the performance problem in this component and fix it:

\`\`\`ts
const { favourites, toggleFavourite } = useGymStore();
\`\`\`
**(2 marks)**`,
    rubric: [
      { criterion: "(a) Theme → Zustand with `persist` (client state, global, survives reloads)", marks: 1 },
      { criterion: "(a) Timetable and my bookings → TanStack Query (server state, cached, invalidated)", marks: 1 },
      { criterion: "(a) Day filter → URL search params (`useSearchParams`) so it's shareable/bookmarkable and survives refresh", marks: 1 },
      { criterion: "(a) Form inputs → local component state (`useState` / React Hook Form) — only one component needs them; justification given", marks: 1 },
      { criterion: "(b) Sensible staleTime (e.g. 1 hour or more) — fresh data served from cache without refetch on mount/focus", marks: 1 },
      { criterion: "(b) gcTime keeps inactive data in memory for a while so returning to the page is instant (and should be ≥ useful revisit window)", marks: 1 },
      { criterion: "(c) `useMutation` with `mutationFn` calling POST booking", marks: 1 },
      { criterion: "(c) `onSuccess` invalidates both `[\"classes\"]` and `[\"bookings\", \"mine\"]` (e.g. `Promise.all` or two calls)", marks: 1 },
      { criterion: "(d) No selector → subscribes to the whole store; re-renders on ANY store change", marks: 1 },
      { criterion: "(d) Fix with individual selectors or `useShallow`", marks: 1 },
    ],
    modelAnswer: `**(a)**

| State | Home | Why |
|---|---|---|
| Theme | **Zustand** + \`persist\` | Client-only UI preference used app-wide; \`persist\` saves it to localStorage. |
| Weekly timetable | **TanStack Query** | Server state: fetched, cached by key, can go stale, refetched/invalidated. |
| Selected day | **URL** (\`?day=tue\` via \`useSearchParams\`) | Must be shareable/bookmarkable and survive refresh and Back/Forward. |
| Booking form values | **Local state** (\`useState\` or React Hook Form) | Only the form needs them; they're temporary until submitted. Global state would add coupling for no benefit. |
| My bookings | **TanStack Query** | Server state that must refresh after the booking mutation (invalidation). |

**(b)** e.g. \`staleTime: 60 * 60 * 1000\` (1 hour). While data is fresh, mounting the timetable page, refocusing the tab or reconnecting serves the cache **without any request**; with the default \`0\` every one of those triggers a refetch. When it does become stale, the cached data still shows instantly while a background refetch runs. \`gcTime\` (default 5 min) is how long the cache entry survives after **no component uses it**; a longer gcTime (e.g. 30 min) means returning to the page later still shows data instantly instead of a loading state. (Mutations still invalidate it explicitly, so a long staleTime doesn't hide the user's own changes.)

**(c)**

\`\`\`ts
const queryClient = useQueryClient();

const bookClass = useMutation({
  mutationFn: (classId: number) => api.createBooking({ classId }), // POST /api/bookings
  onSuccess: () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: ["classes"] }),
      queryClient.invalidateQueries({ queryKey: ["bookings", "mine"] }),
    ]),
});
\`\`\`

Returning the promise keeps the mutation pending until the refetches complete, so the button can stay disabled until the UI is up to date.

**(d)** Calling \`useGymStore()\` with **no selector** subscribes the component to the entire state, so it re-renders whenever *any* field changes (e.g. the theme or a timer), even though it uses only two. Fix:

\`\`\`ts
const favourites = useGymStore((s) => s.favourites);
const toggleFavourite = useGymStore((s) => s.toggleFavourite);

// or
import { useShallow } from "zustand/react/shallow";
const { favourites, toggleFavourite } = useGymStore(
  useShallow((s) => ({ favourites: s.favourites, toggleFavourite: s.toggleFavourite })),
);
\`\`\`

Now it re-renders only when \`favourites\` changes (actions are stable references).`,
    explanation: "Choosing the right home for each kind of state (server, client-global, URL, local), tuning cache freshness, invalidating multiple keys after a mutation and using selectors.",
    lessonId: "state-kinds",
    misconception: "Putting all state in one global store",
  }),
];

const pm2E = [
  mcq({
    id: "pm2-E1",
    topic: "security",
    subtopic: "Checking JWT expiry",
    difficulty: H,
    marks: 2,
    minutes: 2,
    prompt: "Which check correctly decides, in the browser, that a decoded JWT `payload` has expired?",
    options: [
      "`payload.exp < Date.now()`",
      "`new Date(payload.exp) < new Date()`",
      "`payload.exp * 1000 < Date.now()`",
      "`payload.exp > Date.now() / 1000`",
    ],
    answer: 2,
    explanation:
      "`exp` is in **seconds** since the epoch; `Date.now()` is in **milliseconds**. Convert `exp` to ms before comparing. (Still only a UX check — the server decides.)",
    distractorNotes: {
      0: "Compares seconds with milliseconds: `exp` (~1.7 billion) is always smaller than `Date.now()` (~1.7 trillion), so every token looks expired.",
      1: "`new Date(n)` treats `n` as milliseconds, giving a date in January 1970 — always 'expired'.",
      3: "Units are right, but this is true when the token is still **valid** — it's the opposite check.",
    },
    lessonId: "sec-401-403-expiry",
    misconception: "Mixing seconds and milliseconds",
  }),
  mcq({
    id: "pm2-E2",
    topic: "security",
    subtopic: "CSRF vs XSS",
    difficulty: H,
    marks: 2,
    minutes: 2,
    prompt: "Which best describes a **CSRF** attack?",
    options: [
      "An attacker injects a script into a page that other users view",
      "A malicious site makes the victim's browser send a request to another site, with the victim's cookies attached automatically",
      "An attacker intercepts unencrypted HTTP traffic on public Wi-Fi",
      "An attacker guesses passwords by trying many combinations",
    ],
    answer: 1,
    explanation:
      "CSRF exploits **ambient credentials** (cookies). Defences include `SameSite` cookies, CSRF tokens and checking Origin. Bearer tokens sent manually in an `Authorization` header are not attached automatically, so they aren't CSRF-prone (but are exposed to XSS if stored in JS-readable storage).",
    distractorNotes: {
      0: "That's XSS (cross-site scripting).",
      2: "That's a man-in-the-middle attack, mitigated by HTTPS.",
      3: "That's brute force / credential stuffing.",
    },
    lessonId: "sec-xss-csrf-https",
  }),
  mcq({
    id: "pm2-E3",
    topic: "security",
    subtopic: "Trust boundary",
    difficulty: H,
    marks: 2,
    minutes: 2,
    prompt:
      "A food-delivery checkout sends `{ items, totalPrice }` where `totalPrice` was computed in React. What is the correct approach?",
    options: [
      "The server can trust `totalPrice` because our own code computed it",
      "Minifying and obfuscating the JavaScript bundle prevents users changing the price",
      "TypeScript guarantees `totalPrice` is correct",
      "The server must recompute the price from item IDs and its own price list; the client total is only for display",
    ],
    answer: 3,
    explanation: "Everything from the browser can be altered (DevTools, Postman). The trust boundary is the API: authoritative values (prices, roles, ownership) are computed and checked server-side.",
    distractorNotes: {
      0: "Our code runs on the attacker's machine; they can change it or skip it entirely.",
      1: "Obfuscation slows reading but doesn't stop request tampering.",
      2: "TypeScript types vanish at runtime and can't constrain what a user sends.",
    },
    lessonId: "sec-trust-boundaries",
    misconception: "Trusting client-computed values",
  }),
  tf({
    id: "pm2-E4",
    topic: "security",
    subtopic: "What HTTPS does and doesn't protect",
    difficulty: H,
    marks: 2,
    minutes: 2,
    prompt:
      "True or False: HTTPS encrypts a token while it travels between browser and server, but it does not stop a malicious script running on the page (XSS) from reading a token stored in `localStorage`.",
    answer: true,
    explanation: "TLS protects data in transit. Once the token is in JS-accessible storage, any script on the page — including injected ones — can read it. Preventing XSS (escaping, CSP, sanitising) is a separate concern.",
    lessonId: "sec-xss-csrf-https",
  }),
  tf({
    id: "pm2-E5",
    topic: "security",
    subtopic: "Untrusted API data",
    difficulty: H,
    marks: 2,
    minutes: 2,
    prompt: "True or False: A `200 OK` response proves the JSON body has the shape declared in your TypeScript interface and is safe to render as HTML.",
    answer: false,
    explanation: "Status codes say nothing about the body's shape or safety. Validate the shape at runtime (e.g. Zod), handle missing fields, and render text through JSX (escaped) rather than raw HTML.",
    lessonId: "sec-trust-boundaries",
    misconception: "Equating success status with trustworthy data",
  }),
];

export const practiceMocks: ExamPaper[] = [
  {
    id: "practice-mock-1",
    title: "Practice Mock 1 — Core Concepts",
    description:
      "An original full-length paper with the same structure and coverage as the MOCK ICT, set in library, food-delivery, gym and hospital scenarios. Moderate difficulty.",
    kind: "practice-mock",
    difficulty: "mixed",
    durationMinutes: 90,
    rafExtraMinutes: 25,
    totalMarks: 100,
    instructions: INSTRUCTIONS,
    sections: buildSections(pm1A, pm1B, pm1C, pm1D, pm1E),
    questions: [...pm1A, ...pm1B, ...pm1C, ...pm1D, ...pm1E],
  },
  {
    id: "practice-mock-2",
    title: "Practice Mock 2 — Code Reading & Debugging",
    description:
      "A harder original paper: output prediction (event loop, reduce, JSX), find-the-bug items (missing dependencies, 204 + response.json(), selector pitfalls) and deeper design questions.",
    kind: "practice-mock",
    difficulty: "advanced",
    durationMinutes: 90,
    rafExtraMinutes: 25,
    totalMarks: 100,
    instructions: INSTRUCTIONS,
    sections: buildSections(pm2A, pm2B, pm2C, pm2D, pm2E),
    questions: [...pm2A, ...pm2B, ...pm2C, ...pm2D, ...pm2E],
  },
];
