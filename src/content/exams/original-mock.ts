import type { CodeQuestion, ExamPaper, McqQuestion, ShortQuestion, TrueFalseQuestion } from "../types";

/**
 * The supplied MOCK ICT paper (5COSC026W), reproduced verbatim.
 * The paper itself has no answer key: answers, explanations, distractor
 * notes, rubrics and model answers are our own (checked carefully) and are
 * marked with source "original-mock" because the QUESTIONS come from the mock.
 *
 * Only PDF artefacts were fixed ("�" → "×" / bullet lists) and JSX tags in
 * options were wrapped in backticks so the markdown renderer shows them.
 */

type Auto = "type" | "difficulty" | "source";

const mcq = (q: Omit<McqQuestion, Auto>): McqQuestion => ({ ...q, type: "mcq", difficulty: "exam", source: "original-mock" });
const tf = (q: Omit<TrueFalseQuestion, Auto>): TrueFalseQuestion => ({ ...q, type: "tf", difficulty: "exam", source: "original-mock" });
const short = (q: Omit<ShortQuestion, Auto>): ShortQuestion => ({ ...q, type: "short", difficulty: "exam", source: "original-mock" });
const code = (q: Omit<CodeQuestion, Auto>): CodeQuestion => ({ ...q, type: "code", difficulty: "exam", source: "original-mock" });

/* ------------------------------------------------------------------ */
/* Section A — Multiple choice (20 × 1)                                */
/* ------------------------------------------------------------------ */

const sectionA: McqQuestion[] = [
  mcq({
    id: "mock-orig-A1",
    topic: "javascript",
    subtopic: "Array reduce",
    marks: 1,
    minutes: 0.75,
    prompt:
      "A React application needs to display the total value of all items in a shopping basket. Which JavaScript array method is most appropriate for calculating a single accumulated value?",
    options: ["find()", "reduce()", "sort()", "slice()"],
    answer: 1,
    explanation:
      "`reduce()` walks the array once, carrying an **accumulator** from one element to the next, and returns a single value — exactly what a basket total is: `basket.reduce((sum, item) => sum + item.price * item.qty, 0)`. Always pass the initial value (`0`) so an empty basket gives `0` and the first element isn't used as the accumulator.",
    distractorNotes: {
      0: "`find()` returns the first element that matches a condition (or `undefined`) — it does not combine values.",
      2: "`sort()` reorders the array (in place) — it produces an array, not a total.",
      3: "`slice()` returns a shallow copy of part of the array — still an array, not an accumulated value.",
    },
    lessonId: "js-array-reduce",
    misconception: "Confusing searching/copying array methods with aggregation",
  }),
  mcq({
    id: "mock-orig-A2",
    topic: "router",
    subtopic: "Programmatic navigation",
    marks: 1,
    minutes: 0.75,
    prompt:
      "A developer wants to navigate programmatically to /dashboard after a user successfully signs in. Which React Router Hook is designed for this purpose?",
    options: ["useParams()", "useLocation()", "useNavigate()", "useSearchParams()"],
    answer: 2,
    explanation:
      "`useNavigate()` returns a `navigate` function you call from code — e.g. in a submit handler after the login request resolves: `navigate(\"/dashboard\")` (optionally `{ replace: true }` so Back doesn't return to the login form). Call the Hook at the top level of the component; call the returned function inside the handler.",
    distractorNotes: {
      0: "`useParams()` reads dynamic segments such as `:id` from the current URL — it cannot change the URL.",
      1: "`useLocation()` reads the current location object (pathname, search, state). It is read-only.",
      3: "`useSearchParams()` reads/updates the query string (`?page=2`) of the current URL — it is not meant for moving to a different page after login.",
    },
    lessonId: "router-navigation",
    misconception: "Thinking read-only location Hooks can navigate",
  }),
  mcq({
    id: "mock-orig-A3",
    topic: "typescript",
    subtopic: "Type aliases",
    marks: 1,
    minutes: 0.75,
    prompt: "In TypeScript, which keyword is used to define a custom type alias?",
    options: ["interfaceOnly", "type", "define", "structure"],
    answer: 1,
    explanation:
      "`type` creates a type alias: `type Status = \"active\" | \"archived\";` or `type Point = { x: number; y: number };`. Aliases can name any type — unions, tuples, primitives, object shapes — whereas `interface` describes object shapes only.",
    distractorNotes: {
      0: "`interfaceOnly` is not a TypeScript keyword (the real keyword is `interface`, which declares an interface, not a type alias).",
      2: "`define` is not a TypeScript keyword.",
      3: "`structure` is not a TypeScript keyword.",
    },
    lessonId: "ts-basics-interfaces",
  }),
  mcq({
    id: "mock-orig-A4",
    topic: "react",
    subtopic: "Conditional rendering",
    marks: 1,
    minutes: 0.75,
    prompt:
      "A React application needs to display different content depending on whether a user has selected a particular tab. Which programming technique is most appropriate?",
    options: ["Conditional rendering", "Database migration", "Server-side rendering configuration", "CSS font loading"],
    answer: 0,
    explanation:
      "Conditional rendering means choosing what JSX to return based on state: `{activeTab === \"details\" ? <Details /> : <Reviews />}` or `{isOpen && <Panel />}`. When the selected-tab state changes, React re-renders and shows the matching content.",
    distractorNotes: {
      1: "Database migrations change a database schema on the server — unrelated to what a component displays.",
      2: "SSR configuration decides *where* HTML is first generated, not which tab content is shown in response to a click.",
      3: "Font loading affects typography only.",
    },
    lessonId: "react-conditional-rendering",
  }),
  mcq({
    id: "mock-orig-A5",
    topic: "http-api",
    subtopic: "Status codes — 401",
    marks: 1,
    minutes: 0.75,
    prompt:
      "Which HTTP status code indicates that a request was understood but the user is not authenticated?",
    options: ["201", "204", "401", "500"],
    answer: 2,
    explanation:
      "**401 Unauthorized** means the request lacks valid authentication credentials — no token, an invalid token or an expired one. (Despite its name it is about *authentication*.) The frontend should typically clear the session and send the user to log in, or try a token refresh flow.",
    distractorNotes: {
      0: "201 Created is a success code — a new resource was created (typical for POST).",
      1: "204 No Content is a success code with no response body (typical for PUT/DELETE).",
      3: "500 Internal Server Error means the server failed — nothing to do with the user's credentials.",
    },
    lessonId: "sec-401-403-expiry",
    misconception: "Mixing up 401 (not authenticated) and 403 (not permitted)",
  }),
  mcq({
    id: "mock-orig-A6",
    topic: "router",
    subtopic: "Layouts and Outlet",
    marks: 1,
    minutes: 0.75,
    prompt: "Which React Router component allows child routes to render inside a parent layout?",
    options: ["`<Navigate />`", "`<Outlet />`", "`<Link />`", "`<BrowserRouter />`"],
    answer: 1,
    explanation:
      "A parent route's element (the layout) renders `<Outlet />` where the matched **child** route's element should appear. The layout (header, nav) stays mounted while only the outlet content changes between child routes.",
    distractorNotes: {
      0: "`<Navigate />` redirects when it renders — it does not host child routes.",
      2: "`<Link />` renders an anchor for client-side navigation; it does not render route content.",
      3: "`<BrowserRouter />` provides routing context for the whole app (wraps everything); it is not a placeholder for children inside a layout.",
    },
    lessonId: "router-nested-layouts-outlet",
  }),
  mcq({
    id: "mock-orig-A7",
    topic: "javascript",
    subtopic: "Promise.all",
    marks: 1,
    minutes: 0.75,
    prompt: "What is the main purpose of Promise.all() in JavaScript?",
    options: [
      "To execute multiple asynchronous operations and wait for all of them to settle successfully",
      "To cancel every pending request",
      "To convert JavaScript objects into TypeScript interfaces",
      "To execute asynchronous operations one after another automatically",
    ],
    answer: 0,
    explanation: `Option A is the intended answer: \`Promise.all\` lets several async operations run **concurrently** and waits for all of them.

Be precise about its behaviour (the option's wording is a little loose):
- It **fulfils** when *every* input promise fulfils, with an array of results **in input order** (not completion order).
- It **rejects as soon as any one** input rejects, with that reason — it does *not* wait for the others (they keep running; nothing is cancelled).
- If you need to wait for every promise to *settle* (fulfil or reject) and inspect each outcome, use \`Promise.allSettled\`.

\`\`\`js
const [user, orders] = await Promise.all([getUser(id), getOrders(id)]);
\`\`\``,
    distractorNotes: {
      1: "`Promise.all` cancels nothing. Cancelling `fetch` requests needs an `AbortController`.",
      2: "TypeScript interfaces exist only at compile time; no runtime function converts objects into them.",
      3: "`Promise.all` does not sequence work — the operations were already started when the promises were created and run concurrently. Sequential execution needs `await` in a loop (or chained `.then`).",
    },
    lessonId: "js-promises-async",
    misconception: "Believing Promise.all waits for every promise even when one rejects (that is allSettled)",
  }),
  mcq({
    id: "mock-orig-A8",
    topic: "typescript",
    subtopic: "Interfaces",
    marks: 1,
    minutes: 0.75,
    prompt: "In TypeScript, what is the purpose of an interface?",
    options: [
      "To define the expected structure of an object",
      "To create a CSS class",
      "To automatically send API requests",
      "To store application data permanently",
    ],
    answer: 0,
    explanation:
      "An interface describes the **shape** of an object — its property names and types — so the compiler can check your code: `interface Product { id: number; name: string; price: number }`. It is erased when compiled to JavaScript, so it does not validate data at runtime.",
    distractorNotes: {
      1: "Interfaces have nothing to do with CSS.",
      2: "Interfaces produce no runtime code at all, so they cannot send requests.",
      3: "Interfaces store nothing — persistent storage would be a database, `localStorage`, etc.",
    },
    lessonId: "ts-basics-interfaces",
  }),
  mcq({
    id: "mock-orig-A9",
    topic: "html-css",
    subtopic: "CSS Grid template areas",
    marks: 1,
    minutes: 0.75,
    prompt: "Which CSS property is particularly useful for creating layouts with named grid areas?",
    options: ["grid-template-areas", "text-transform", "letter-spacing", "border-radius"],
    answer: 0,
    explanation: `\`grid-template-areas\` draws the layout as named strings on the grid container; children are placed with \`grid-area\`:

\`\`\`css
.page { display: grid; grid-template-areas: "header header" "sidebar main"; }
.page > nav { grid-area: sidebar; }
\`\`\``,
    distractorNotes: {
      1: "`text-transform` changes letter case (uppercase/lowercase).",
      2: "`letter-spacing` changes space between characters.",
      3: "`border-radius` rounds corners.",
    },
    lessonId: "css-grid",
  }),
  mcq({
    id: "mock-orig-A10",
    topic: "router",
    subtopic: "Dynamic route params",
    marks: 1,
    minutes: 0.75,
    prompt:
      "A developer wants to retrieve the identifier from a dynamic route such as /products/42. Which React Router Hook is most suitable?",
    options: ["useNavigate()", "useParams()", "useState()", "useRef()"],
    answer: 1,
    explanation:
      "With a route `path=\"/products/:productId\"`, `const { productId } = useParams();` returns `\"42\"`. Note it is a **string** (or `undefined`) — convert with `Number(productId)` if you need a number.",
    distractorNotes: {
      0: "`useNavigate()` changes the URL; it does not read segments from it.",
      2: "`useState()` holds component state; it knows nothing about the URL.",
      3: "`useRef()` holds a mutable value or DOM reference; unrelated to routing.",
    },
    lessonId: "router-dynamic-params",
    misconception: "Forgetting that params are strings",
  }),
  mcq({
    id: "mock-orig-A11",
    topic: "tanstack-query",
    subtopic: "staleTime",
    marks: 1,
    minutes: 0.75,
    prompt: "What does the staleTime option in TanStack Query control?",
    options: [
      "How long cached query data is considered fresh",
      "How long a browser session remains authenticated",
      "How long a React component remains mounted",
      "How long a form submission takes",
    ],
    answer: 0,
    explanation:
      "`staleTime` is how long data stays **fresh** after a successful fetch. While fresh, mounting a component that uses the query, refocusing the window or reconnecting will *not* trigger a refetch. The default is `0` (immediately stale). Don't confuse it with `gcTime` (default 5 minutes): how long an *inactive* (unobserved) cache entry is kept before being garbage-collected.",
    distractorNotes: {
      1: "Session/token lifetime is governed by the auth system (e.g. the JWT `exp` claim), not TanStack Query.",
      2: "Component lifetime is controlled by React rendering, not query options.",
      3: "Submission duration depends on the network/server; `staleTime` concerns cached query data.",
    },
    lessonId: "tq-stale-gc",
    misconception: "Confusing staleTime with gcTime",
  }),
  mcq({
    id: "mock-orig-A12",
    topic: "zustand",
    subtopic: "Reading from a store",
    marks: 1,
    minutes: 0.75,
    prompt: "Which Zustand function is commonly used to access a particular piece of data from a store?",
    options: ["useState()", "useEffect()", "The store's generated Hook", "createContext()"],
    answer: 2,
    explanation:
      "`create()` returns a Hook (e.g. `useCartStore`). Call it with a **selector** to read one piece of state: `const count = useCartStore((s) => s.items.length);`. The component re-renders only when that selected value changes (compared with `Object.is`).",
    distractorNotes: {
      0: "`useState()` creates local component state; it cannot read a Zustand store.",
      1: "`useEffect()` runs side effects after render; it is not how you read store data.",
      3: "`createContext()` is React's Context API. Zustand stores do not need a Provider or context.",
    },
    lessonId: "zustand-selectors",
  }),
  mcq({
    id: "mock-orig-A13",
    topic: "http-api",
    subtopic: "Status codes — 204",
    marks: 1,
    minutes: 0.75,
    prompt: "What is the purpose of an HTTP 204 No Content response?",
    options: [
      "It indicates that the request succeeded but there is no response body to return",
      "It indicates that the server has crashed",
      "It means that authentication has failed",
      "It indicates that a requested page has moved permanently",
    ],
    answer: 0,
    explanation:
      "204 is a **2xx success** with an empty body — common for `PUT` and `DELETE` (the CampusEvents API returns 204 for both). `response.ok` is `true`, but do **not** call `response.json()`: parsing an empty body throws a `SyntaxError`.",
    distractorNotes: {
      1: "A server crash is reported as 500 (or similar 5xx).",
      2: "Failed authentication is 401.",
      3: "Moved permanently is 301 (or 308).",
    },
    lessonId: "http-methods-status",
    misconception: "Calling response.json() on an empty 204 body",
  }),
  mcq({
    id: "mock-orig-A14",
    topic: "typescript",
    subtopic: "Union types",
    marks: 1,
    minutes: 0.75,
    prompt:
      "Which TypeScript type would be most appropriate for a variable that can contain either a string or a number?",
    options: ["string & number", "string | number", "string + number", "string / number"],
    answer: 1,
    explanation:
      "`|` creates a **union**: the value is one of the listed types. Before using type-specific methods you narrow it, e.g. `if (typeof id === \"string\") id.toUpperCase();`.",
    distractorNotes: {
      0: "`&` is an **intersection** — a value that is both a string and a number at once, which is impossible (`never`).",
      2: "`+` is not a type operator in TypeScript.",
      3: "`/` is not a type operator in TypeScript.",
    },
    lessonId: "ts-unions-narrowing",
    misconception: "Confusing union (|) with intersection (&)",
  }),
  mcq({
    id: "mock-orig-A15",
    topic: "tanstack-query",
    subtopic: "invalidateQueries",
    marks: 1,
    minutes: 0.75,
    prompt: "What is the main purpose of the invalidateQueries() function in TanStack Query?",
    options: [
      "To remove all React components",
      "To mark matching cached queries as invalid so they can be refreshed",
      "To permanently delete the API endpoint",
      "To disable all future API requests",
    ],
    answer: 1,
    explanation:
      "`queryClient.invalidateQueries({ queryKey: [\"products\"] })` marks every query whose key **starts with** `[\"products\"]` as stale and, by default, immediately refetches the ones that are **active** (currently used by a mounted component). Inactive ones refetch next time they are used. It's typically called in a mutation's `onSuccess`.",
    distractorNotes: {
      0: "It never touches components — it only affects the query cache.",
      2: "The frontend cannot delete a server endpoint; invalidation only affects cached data in the browser.",
      3: "It causes *more* (fresh) requests, not fewer.",
    },
    lessonId: "tq-mutations-invalidation",
    misconception: "Thinking invalidation deletes data instead of marking it stale",
  }),
  mcq({
    id: "mock-orig-A16",
    topic: "html-css",
    subtopic: "clamp()",
    marks: 1,
    minutes: 0.75,
    prompt:
      "Which CSS function allows a property to have a preferred value while respecting minimum and maximum limits?",
    options: ["calc()", "minmax()", "clamp()", "var()"],
    answer: 2,
    explanation:
      "`clamp(MIN, PREFERRED, MAX)` returns the preferred value but never below MIN or above MAX — e.g. `font-size: clamp(1rem, 2.5vw, 2rem);` for fluid typography.",
    distractorNotes: {
      0: "`calc()` performs arithmetic (`calc(100% - 2rem)`) but has no built-in limits.",
      1: "`minmax()` defines a size range for **grid tracks** only (`grid-template-columns`), and has no 'preferred' value.",
      3: "`var()` reads a CSS custom property.",
    },
    lessonId: "css-responsive-clamp",
    misconception: "Confusing clamp() with grid-only minmax()",
  }),
  mcq({
    id: "mock-orig-A17",
    topic: "forms-crud",
    subtopic: "Client-side validation",
    marks: 1,
    minutes: 0.75,
    prompt:
      "A developer wants to prevent a user from submitting a form if an email address does not meet a required format. Which approach is most appropriate?",
    options: ["Client-side validation", "Changing the page title", "Adding a CSS animation", "Using browser local storage only"],
    answer: 0,
    explanation:
      "Client-side validation (HTML `type=\"email\"`/`required`, a validation function, or Zod + React Hook Form) checks input before submitting and shows immediate errors. It improves UX, but it can be bypassed — the server must validate again.",
    distractorNotes: {
      1: "The page title has no effect on submission.",
      2: "An animation can *highlight* an error but does not check the format or stop submission.",
      3: "Storing values in `localStorage` does not validate them.",
    },
    lessonId: "forms-validation",
  }),
  mcq({
    id: "mock-orig-A18",
    topic: "router",
    subtopic: "Search params",
    marks: 1,
    minutes: 0.75,
    prompt: "Which React Hook is commonly used to access URL query-string parameters through React Router?",
    options: ["useSearchParams()", "useReducer()", "useMemo()", "useCallback()"],
    answer: 0,
    explanation:
      "`const [searchParams, setSearchParams] = useSearchParams();` then `searchParams.get(\"page\")` returns a `string | null`. Updating it with `setSearchParams` changes the URL, so filters/pagination survive refresh and can be shared.",
    distractorNotes: {
      1: "`useReducer()` manages local state with a reducer; it does not read the URL.",
      2: "`useMemo()` caches a computed value between renders.",
      3: "`useCallback()` caches a function between renders.",
    },
    lessonId: "router-search-params",
  }),
  mcq({
    id: "mock-orig-A19",
    topic: "architecture",
    subtopic: "API service modules",
    marks: 1,
    minutes: 0.75,
    prompt: "What is the main benefit of separating API calls into a dedicated service module?",
    options: [
      "It removes the need for HTTP requests",
      "It separates data-access logic from presentation components",
      "It automatically creates a backend",
      "It prevents all network errors",
    ],
    answer: 1,
    explanation:
      "A service module (e.g. `src/api/eventsApi.ts`) owns the base URL, headers, `response.ok` checks and JSON parsing. Components (or TanStack Query `queryFn`s) just call `getEvents()`. This is separation of concerns: easier reuse, testing and changes in one place.",
    distractorNotes: {
      0: "The service still makes HTTP requests — it just centralises them.",
      2: "Frontend code cannot create a backend.",
      3: "Network errors still happen; the module just handles them consistently.",
    },
    lessonId: "http-service-modules",
  }),
  mcq({
    id: "mock-orig-A20",
    topic: "html-css",
    subtopic: "Focus styles (:focus-visible)",
    marks: 1,
    minutes: 0.75,
    prompt: "What is the purpose of the CSS pseudo-class :focus-visible?",
    options: [
      "To apply styling when an element receives focus in situations where a visible focus indicator is appropriate",
      "To hide all focused elements",
      "To prevent keyboard navigation",
      "To resize elements when clicked",
    ],
    answer: 0,
    explanation:
      "`:focus-visible` matches a focused element when the browser decides a focus ring should be shown — typically keyboard (Tab) focus, not a mouse click on a button. It lets you design a clear focus indicator for keyboard users without showing it on every click: `button:focus-visible { outline: 3px solid #2563eb; outline-offset: 2px; }`.",
    distractorNotes: {
      1: "It styles focused elements; it does not hide them (hiding focus would harm accessibility).",
      2: "It does not affect whether elements can be focused or navigated.",
      3: "It is about focus indication, not resizing on click.",
    },
    lessonId: "a11y-focus-keyboard",
  }),
];

/* ------------------------------------------------------------------ */
/* Section B — True/False (15 × 1)                                     */
/* ------------------------------------------------------------------ */

const sectionB: TrueFalseQuestion[] = [
  tf({
    id: "mock-orig-B1",
    topic: "router",
    subtopic: "Client-side routing",
    marks: 1,
    minutes: 0.7,
    prompt:
      "A React application can use React Router to display different page components without requiring a full browser page reload for every navigation.",
    answer: true,
    explanation:
      "React Router intercepts link clicks, updates the URL with the History API and renders the matching component — no new HTML document is requested. This is what makes it a single-page application (SPA).",
    lessonId: "router-basics",
  }),
  tf({
    id: "mock-orig-B2",
    topic: "typescript",
    subtopic: "Interfaces for API data",
    marks: 1,
    minutes: 0.7,
    prompt: "TypeScript interfaces can be used to describe the expected properties of objects received from an API.",
    answer: true,
    explanation:
      "Yes — e.g. `interface EventDto { id: number; title: string; ... }`. Remember they *describe* expectations at compile time only; they don't validate the JSON at runtime (use a runtime validator such as Zod for that).",
    lessonId: "ts-basics-interfaces",
    misconception: "Believing interfaces validate data at runtime",
  }),
  tf({
    id: "mock-orig-B3",
    topic: "javascript",
    subtopic: "find vs filter",
    marks: 1,
    minutes: 0.7,
    prompt: "The JavaScript find() method returns every element that satisfies a condition.",
    answer: false,
    explanation:
      "`find()` returns only the **first** matching element (or `undefined`). To get every matching element use `filter()`, which returns a new array (possibly empty).",
    lessonId: "js-array-methods",
    misconception: "Confusing find() with filter()",
  }),
  tf({
    id: "mock-orig-B4",
    topic: "react",
    subtopic: "Rules of Hooks",
    marks: 1,
    minutes: 0.7,
    prompt:
      "A React custom Hook must follow the Rules of Hooks, including being called at the top level of a component or another custom Hook.",
    answer: true,
    explanation:
      "Custom Hooks are just functions whose names start with `use` and that call other Hooks, so the same rules apply: call them only at the top level (not in loops, conditions or nested functions) and only from components or other Hooks. React relies on Hooks being called in the same order every render.",
    lessonId: "react-custom-hooks",
  }),
  tf({
    id: "mock-orig-B5",
    topic: "http-api",
    subtopic: "Status codes — 403",
    marks: 1,
    minutes: 0.7,
    prompt:
      "A 403 Forbidden response generally indicates that the request was understood but the user does not have sufficient permission.",
    answer: true,
    explanation:
      "403 = the server knows who you are (or doesn't need to) but you are **not allowed** to do this — e.g. a `USER` calling an `ADMIN`-only endpoint. Logging in again won't help; 401 is the 'not authenticated' code.",
    lessonId: "sec-401-403-expiry",
  }),
  tf({
    id: "mock-orig-B6",
    topic: "tanstack-query",
    subtopic: "Server state",
    marks: 1,
    minutes: 0.7,
    prompt:
      "TanStack Query is designed to help manage asynchronous server data, including caching and synchronisation.",
    answer: true,
    explanation:
      "TanStack Query is a **server-state** library: it fetches, caches by query key, deduplicates requests, refetches stale data in the background, retries failures and exposes loading/error states.",
    lessonId: "tq-server-state",
  }),
  tf({
    id: "mock-orig-B7",
    topic: "zustand",
    subtopic: "Selectors",
    marks: 1,
    minutes: 0.7,
    prompt: "Zustand requires every component in an application to subscribe to the entire store.",
    answer: false,
    explanation:
      "Components subscribe to just what they select: `useStore((s) => s.theme)`. A component re-renders only when its selected value changes. Calling `useStore()` with no selector subscribes to everything — possible, but not required and usually avoided.",
    lessonId: "zustand-selectors",
  }),
  tf({
    id: "mock-orig-B8",
    topic: "router",
    subtopic: "Dynamic routes",
    marks: 1,
    minutes: 0.7,
    prompt: "A dynamic route can use a URL parameter to identify which record should be displayed.",
    answer: true,
    explanation:
      "E.g. `<Route path=\"/events/:id\" element={<EventDetails />} />`; the component reads `id` with `useParams()` and fetches that record.",
    lessonId: "router-dynamic-params",
  }),
  tf({
    id: "mock-orig-B9",
    topic: "forms-crud",
    subtopic: "Client vs server validation",
    marks: 1,
    minutes: 0.7,
    prompt: "Client-side validation guarantees that invalid data can never reach a server.",
    answer: false,
    explanation:
      "Anyone can bypass browser code — disable JavaScript, edit requests in DevTools, or call the API directly with Postman/curl. Client-side validation is for UX; the server must validate every request.",
    lessonId: "forms-validation",
    misconception: "Treating client-side validation as a security control",
  }),
  tf({
    id: "mock-orig-B10",
    topic: "http-api",
    subtopic: "HTTP methods — PUT",
    marks: 1,
    minutes: 0.7,
    prompt: "The HTTP PUT method can be used by a frontend application when updating an existing resource.",
    answer: true,
    explanation:
      "PUT updates/replaces the resource at a known URL, e.g. `PUT /api/events/5` with the full updated event in the body. It is idempotent; CampusEvents returns 204 No Content.",
    lessonId: "crud-post-put-delete",
  }),
  tf({
    id: "mock-orig-B11",
    topic: "router",
    subtopic: "Layouts for route groups",
    marks: 1,
    minutes: 0.7,
    prompt: "A React application can use different layouts for different route groups.",
    answer: true,
    explanation:
      "Each parent (layout) route can render its own layout with an `<Outlet />` — e.g. a `PublicLayout` for `/`, `/events` and an `AdminLayout` for `/admin/*`.",
    lessonId: "router-nested-layouts-outlet",
  }),
  tf({
    id: "mock-orig-B12",
    topic: "html-css",
    subtopic: "minmax()",
    marks: 1,
    minutes: 0.7,
    prompt: "The CSS minmax() function can specify minimum and maximum sizes for grid tracks.",
    answer: true,
    explanation:
      "`grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));` — each column is at least 220px and at most one fraction of the free space, giving a responsive card grid without media queries.",
    lessonId: "css-grid",
  }),
  tf({
    id: "mock-orig-B13",
    topic: "typescript",
    subtopic: "Union types",
    marks: 1,
    minutes: 0.7,
    prompt: "A TypeScript union type allows a value to belong to one of several specified types.",
    answer: true,
    explanation: "`let id: string | number;` — `id` may hold either a string or a number. Narrow with `typeof` before using type-specific operations.",
    lessonId: "ts-unions-narrowing",
  }),
  tf({
    id: "mock-orig-B14",
    topic: "state-architecture",
    subtopic: "Server state vs client state",
    marks: 1,
    minutes: 0.7,
    prompt:
      "TanStack Query and Zustand are interchangeable tools designed exclusively for storing server responses.",
    answer: false,
    explanation:
      "They solve different problems. TanStack Query manages **server state** (fetching, caching, invalidation, refetching). Zustand is a lightweight store for **client/UI state** (theme, sidebar open, cart before checkout). Putting API data in Zustand means re-implementing caching and staleness yourself.",
    lessonId: "state-kinds",
    misconception: "Treating every state library as interchangeable",
  }),
  tf({
    id: "mock-orig-B15",
    topic: "security",
    subtopic: "JWT expiry",
    marks: 1,
    minutes: 0.7,
    prompt: "A frontend application can use a JWT's expiry information to determine whether a token may have expired.",
    answer: true,
    explanation:
      "The payload's `exp` claim (seconds since the Unix epoch) — or the `expiresAt` returned at login — can be compared with the current time (`exp * 1000 < Date.now()`) to log the user out proactively. This is a UX convenience; the server still decides whether the token is valid.",
    lessonId: "sec-401-403-expiry",
  }),
];

/* ------------------------------------------------------------------ */
/* Section C — Short answer (5 × 3)                                    */
/* ------------------------------------------------------------------ */

const sectionC = [
  code({
    id: "mock-orig-C1",
    topic: "javascript",
    subtopic: "Array reduce",
    marks: 3,
    minutes: 3,
    language: "js",
    prompt: `**C1. JavaScript - Array Reduction**

Consider the following data:

\`\`\`js
const prices = [15, 25, 10, 30];
\`\`\`

Write a JavaScript statement using reduce() to calculate the total of all prices and store the result in a variable named total.`,
    starterCode: `const prices = [15, 25, 10, 30];
`,
    rubric: [
      { criterion: "Calls `prices.reduce(...)` with a callback taking an accumulator and the current price", marks: 1 },
      { criterion: "Callback returns accumulator + current value (e.g. `sum + price`)", marks: 1 },
      { criterion: "Supplies initial value `0` and stores the result in a variable named `total`", marks: 1 },
    ],
    modelAnswer: `\`\`\`js
const total = prices.reduce((sum, price) => sum + price, 0);
console.log(total); // 80
\`\`\`

\`sum\` starts at \`0\` (the initial value); each step returns \`sum + price\`: 0 → 15 → 40 → 50 → 80.`,
    explanation:
      "`reduce` folds the array into one value. The initial value `0` matters: without it the first element becomes the accumulator, which works here but throws a `TypeError` on an empty array and breaks with arrays of objects.",
    lessonId: "js-array-reduce",
    misconception: "Omitting the initial value",
  }),
  code({
    id: "mock-orig-C2",
    topic: "typescript",
    subtopic: "Interfaces and optional properties",
    marks: 3,
    minutes: 3,
    language: "ts",
    prompt: `**C2. TypeScript - Object Structure**

Write a TypeScript interface named Product containing the following properties:

- id: number
- name: string
- price: number
- description: optional string`,
    rubric: [
      { criterion: "Uses `interface Product { ... }` with correct syntax", marks: 1 },
      { criterion: "`id: number`, `name: string` and `price: number` declared with correct types", marks: 1 },
      { criterion: "`description?: string` marked optional with `?`", marks: 1 },
    ],
    modelAnswer: `\`\`\`ts
interface Product {
  id: number;
  name: string;
  price: number;
  description?: string;
}
\`\`\`

\`description?: string\` means the property may be missing; its type is \`string | undefined\` when read.`,
    explanation:
      "The `?` modifier makes a property optional. Writing `description: string | undefined` is *not* the same: the property would still be required (it must be present, even if `undefined`).",
    lessonId: "ts-basics-interfaces",
  }),
  code({
    id: "mock-orig-C3",
    topic: "router",
    subtopic: "useParams",
    marks: 3,
    minutes: 3,
    language: "tsx",
    prompt: `**C3. React Router - Dynamic Parameters**

A React application uses the following route:

\`/orders/:orderId\`

Name the React Router Hook that retrieves the route parameter and write the expression used to obtain orderId.`,
    rubric: [
      { criterion: "Names `useParams` (imported from `react-router-dom`)", marks: 1 },
      { criterion: "Writes `const { orderId } = useParams();` (or `useParams().orderId`) inside a component", marks: 1 },
      { criterion: "Key matches the `:orderId` segment exactly; recognises the value is a string (or undefined)", marks: 1 },
    ],
    modelAnswer: `Hook: **\`useParams\`**

\`\`\`tsx
import { useParams } from "react-router-dom";

function OrderDetails() {
  const { orderId } = useParams(); // "123" for /orders/123 (string | undefined)
  return <h1>Order {orderId}</h1>;
}
\`\`\`

If a number is needed: \`const id = Number(orderId);\` and check \`Number.isNaN(id)\`.`,
    explanation:
      "`useParams()` returns an object of the current route's dynamic segments keyed by the names after `:`. Values are always strings (or `undefined`), never numbers.",
    lessonId: "router-dynamic-params",
    misconception: "Expecting params to be numbers",
  }),
  short({
    id: "mock-orig-C4",
    topic: "tanstack-query",
    subtopic: "invalidateQueries after mutation",
    marks: 3,
    minutes: 3,
    prompt: `**C4. TanStack Query - Cache Management**

After successfully updating a customer's profile, the application needs to ensure that previously cached customer information is refreshed.

Write the TanStack Query function commonly used for this purpose and briefly explain what it does.`,
    rubric: [
      { criterion: "Names `queryClient.invalidateQueries` (obtained via `useQueryClient()`)", marks: 1 },
      { criterion: "Uses a query key that matches the customer data, e.g. `{ queryKey: [\"customer\", id] }`, typically in the mutation's `onSuccess`", marks: 1 },
      { criterion: "Explains it marks matching cached queries stale and refetches the active ones so the UI shows fresh data", marks: 1 },
    ],
    modelAnswer: `\`\`\`ts
const queryClient = useQueryClient();

const updateProfile = useMutation({
  mutationFn: (profile: CustomerProfile) => api.updateCustomer(profile),
  onSuccess: (_data, profile) => {
    queryClient.invalidateQueries({ queryKey: ["customer", profile.id] });
  },
});
\`\`\`

\`invalidateQueries\` marks every cached query whose key starts with the given key as **stale**, and immediately refetches the ones currently in use (active). The next render therefore shows the updated profile rather than the old cached copy. Inactive matches refetch when next used.`,
    explanation:
      "Invalidation is the standard way to resynchronise the cache after a write. Alternatives: `setQueryData` to write the server's response straight into the cache.",
    lessonId: "tq-mutations-invalidation",
  }),
  short({
    id: "mock-orig-C5",
    topic: "http-api",
    subtopic: "401 vs 403",
    marks: 3,
    minutes: 3,
    prompt: `**C5. API Handling - HTTP Status Codes**

Explain the difference between an HTTP 401 Unauthorized response and a 403 Forbidden response from the perspective of a frontend application.`,
    rubric: [
      { criterion: "401: the request is not authenticated — token missing, invalid or expired", marks: 1 },
      { criterion: "403: the user is authenticated (identity known) but lacks permission, e.g. a USER calling an ADMIN endpoint", marks: 1 },
      { criterion: "Frontend reaction differs: 401 → clear session and redirect to login / refresh token; 403 → show 'access denied', do not ask to log in again, hide/disable the action", marks: 1 },
    ],
    modelAnswer: `- **401 Unauthorized** — "I don't know who you are." The request had no valid credentials: no \`Authorization\` header, a malformed/tampered token, or an **expired** JWT. The frontend should treat the user as logged out: clear the stored token/user, and redirect to \`/login\` (remembering where they were) or attempt a refresh-token flow.
- **403 Forbidden** — "I know who you are, but you're not allowed." The token is valid but the user's role/permissions don't allow the action (e.g. a \`USER\` calling \`DELETE /api/events/5\`, which is ADMIN-only). Logging in again won't help; the frontend should show an "access denied"/"not permitted" message and ideally not offer that action to such users in the first place.`,
    explanation:
      "401 is about **authentication** (identity), 403 about **authorisation** (permission). Treating 403 like 401 (sending users to the login page) creates a confusing login loop.",
    lessonId: "sec-401-403-expiry",
    misconception: "Treating 403 the same as 401",
  }),
];

/* ------------------------------------------------------------------ */
/* Section D — Programming and analysis (4 × 10)                       */
/* ------------------------------------------------------------------ */

const sectionD = [
  code({
    id: "mock-orig-D1",
    topic: "router",
    subtopic: "Routes, layouts, params and navigation",
    marks: 10,
    minutes: 10,
    language: "tsx",
    prompt: `**D1. React Router - Application Navigation (10 marks)**

A student-management application contains the following pages:

- Home page: \`/\`
- Student list: \`/students\`
- Individual student details: \`/students/:studentId\`
- Settings page: \`/settings\`

The application should use a shared layout containing a navigation menu. The student details page must display the ID belonging to the selected student.

a. Write a React Router configuration that defines the routes listed above. Use a shared layout for the pages. **(4 marks)**

b. Explain the purpose of the \`<Outlet />\` component in the shared layout. **(2 marks)**

c. Write a small React component that retrieves studentId from the URL and displays it. **(2 marks)**

d. Explain how a user could navigate to the settings page programmatically after saving their preferences. Name the appropriate Hook and describe its use. **(2 marks)**`,
    rubric: [
      { criterion: "(a) Router set up (`BrowserRouter` + `Routes`) with a parent layout route whose `element` is the shared layout", marks: 1 },
      { criterion: "(a) Home as an `index` route (or `path=\"/\"`) and `students` route nested inside the layout", marks: 1 },
      { criterion: "(a) Dynamic route `students/:studentId` defined correctly", marks: 1 },
      { criterion: "(a) `settings` route defined; layout renders a nav menu (`Link`/`NavLink`) and an `<Outlet />`", marks: 1 },
      { criterion: "(b) `<Outlet />` is the placeholder where the matched child route's element renders", marks: 1 },
      { criterion: "(b) Lets the layout (nav menu) be written once and stay mounted while only the page content changes", marks: 1 },
      { criterion: "(c) Uses `useParams()` to read `studentId` (name matches the route)", marks: 1 },
      { criterion: "(c) Renders the ID in JSX (handles missing value sensibly)", marks: 1 },
      { criterion: "(d) Names `useNavigate` and calls it at the top level of the component", marks: 1 },
      { criterion: "(d) Calls `navigate(\"/settings\")` after the save succeeds (e.g. after awaiting the request), optionally with `{ replace: true }`", marks: 1 },
    ],
    modelAnswer: `**(a) Route configuration with a shared layout**

\`\`\`tsx
import { BrowserRouter, Routes, Route, Outlet, NavLink } from "react-router-dom";

function MainLayout() {
  return (
    <>
      <header>
        <nav>
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/students">Students</NavLink>
          <NavLink to="/settings">Settings</NavLink>
        </nav>
      </header>
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
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="students" element={<StudentListPage />} />
          <Route path="students/:studentId" element={<StudentDetailsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
\`\`\`

The parent route has no page of its own — it renders \`MainLayout\`. Child paths are relative (\`students\` → \`/students\`). The \`index\` route renders at exactly \`/\`. (The \`*\` route is an optional extra for unknown URLs.)

**(b) Purpose of \`<Outlet />\`**

\`<Outlet />\` marks *where* inside the parent layout the matched child route's element should render. At \`/students/7\`, React Router renders \`MainLayout\` and puts \`StudentDetailsPage\` in the outlet. The nav menu is written once, stays mounted, and only the outlet content changes as the user navigates. Without it, the child pages would never appear.

**(c) Reading \`studentId\`**

\`\`\`tsx
import { useParams } from "react-router-dom";

function StudentDetailsPage() {
  const { studentId } = useParams();

  if (!studentId) return <p>No student selected.</p>;

  return <h1>Student ID: {studentId}</h1>;
}
\`\`\`

\`studentId\` is a string (e.g. \`"7"\`) or \`undefined\`; convert with \`Number(studentId)\` if the API needs a number.

**(d) Programmatic navigation after saving**

Use the **\`useNavigate\`** Hook. Call it at the top level of the component to get a \`navigate\` function, then call that function once the save succeeds:

\`\`\`tsx
import { useNavigate } from "react-router-dom";

function PreferencesForm() {
  const navigate = useNavigate();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await savePreferences(/* form values */);
    navigate("/settings"); // or navigate("/settings", { replace: true })
  }

  return <form onSubmit={handleSubmit}>{/* inputs + Save button */}</form>;
}
\`\`\`

\`navigate\` changes the URL client-side (no page reload) and React Router renders the settings route. \`{ replace: true }\` replaces the current history entry so Back doesn't return to the form. Hooks can't be called inside the handler — only the returned function is.`,
    explanation:
      "Key ideas: nested routes under a layout route, relative child paths, `index` routes, `<Outlet />` as the child placeholder, `useParams` returning strings, and `useNavigate` for navigation triggered by code rather than by a click on a `<Link>`.",
    lessonId: "router-nested-layouts-outlet",
    misconception: "Calling useNavigate inside an event handler / forgetting <Outlet />",
  }),
  code({
    id: "mock-orig-D2",
    topic: "http-api",
    subtopic: "Fetching in useEffect with AbortController",
    marks: 10,
    minutes: 10,
    language: "tsx",
    prompt: `**D2. React API Consumption - Asynchronous Operations (10 marks)**

A React application needs to retrieve a list of courses from the following API endpoint:

\`https://example.com/api/courses\`

The application should:

- Retrieve the course data when the component loads.
- Display a loading message while the request is in progress.
- Display an error message if the request fails.
- Display the number of courses after a successful request.
- Avoid updating component state after the component has been unmounted.

a. Explain why an asynchronous operation is needed when communicating with an external API. **(2 marks)**

b. Write a React component or custom Hook that implements the requirements above. You may use useEffect, useState and AbortController. **(6 marks)**

c. Explain why an API service module can be beneficial when several components need to access the same endpoint. **(2 marks)**`,
    rubric: [
      { criterion: "(a) A network request takes an unknown time to complete (latency, slow server)", marks: 1 },
      { criterion: "(a) JavaScript is single-threaded: waiting synchronously would freeze the UI; `fetch` returns a Promise handled with `await`/`.then` so the page stays responsive", marks: 1 },
      { criterion: "(b) Fetch runs inside `useEffect` with an empty dependency array (runs when the component mounts)", marks: 1 },
      { criterion: "(b) Loading state tracked with `useState` and a loading message rendered while pending", marks: 1 },
      { criterion: "(b) Checks `response.ok` (fetch does not reject on 4xx/5xx), catches errors and renders an error message", marks: 1 },
      { criterion: "(b) On success stores the data and renders the number of courses (`courses.length`)", marks: 1 },
      { criterion: "(b) Creates an `AbortController`, passes `signal` to `fetch`, and calls `controller.abort()` in the effect cleanup", marks: 1 },
      { criterion: "(b) Ignores the `AbortError` (no state update / no error message after unmount)", marks: 1 },
      { criterion: "(c) One place for the URL, headers, `response.ok` checks and parsing — no duplicated fetch logic across components", marks: 1 },
      { criterion: "(c) Separation of concerns: components stay focused on UI; endpoint changes are made once; easier to test/mock and reuse (e.g. as a TanStack Query `queryFn`)", marks: 1 },
    ],
    modelAnswer: `**(a) Why asynchronous?**

A request to an external API travels over the network and the server takes an unpredictable amount of time to reply (milliseconds to seconds, or it may fail). JavaScript in the browser runs on a single main thread that also handles rendering and user input; if it waited synchronously, the whole page would freeze. \`fetch\` therefore returns a **Promise** immediately; the code continues, and when the response arrives the continuation (\`await\` / \`.then\`) runs and React updates state.

**(b) Custom Hook + component**

\`\`\`tsx
import { useEffect, useState } from "react";

interface Course {
  id: number;
  title: string;
}

export function useCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadCourses() {
      try {
        const response = await fetch("https://example.com/api/courses", {
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error(\`Request failed with status \${response.status}\`);
        }
        const data = (await response.json()) as Course[];
        setCourses(data);
        setIsLoading(false);
      } catch (err) {
        // Aborted because the component unmounted: do not touch state.
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Unknown error");
        setIsLoading(false);
      }
    }

    loadCourses();

    // Cleanup runs on unmount: cancel the in-flight request.
    return () => controller.abort();
  }, []); // empty array → run once when the component mounts

  return { courses, isLoading, error };
}

export function CourseSummary() {
  const { courses, isLoading, error } = useCourses();

  if (isLoading) return <p>Loading courses…</p>;
  if (error) return <p role="alert">Could not load courses: {error}</p>;
  return <p>Number of courses: {courses.length}</p>;
}
\`\`\`

Points to note:
- \`fetch\` only rejects on network failure or abort — a 404/500 still *resolves*, so \`response.ok\` must be checked and an error thrown.
- When the component unmounts, the cleanup calls \`abort()\`; the pending \`fetch\` rejects with an \`AbortError\`, which we ignore, so no state is updated after unmount.
- In development, React StrictMode mounts → unmounts → re-mounts once, so you'll see one aborted request followed by a real one — this is expected.

**(c) Why an API service module?**

\`\`\`ts
// src/api/coursesApi.ts
const BASE_URL = "https://example.com/api";

export async function getCourses(signal?: AbortSignal): Promise<Course[]> {
  const response = await fetch(\`\${BASE_URL}/courses\`, { signal });
  if (!response.ok) throw new Error(\`HTTP \${response.status}\`);
  return response.json();
}
\`\`\`

If several components need the courses endpoint, each calling \`fetch\` directly would duplicate the URL, headers (e.g. \`Authorization\`), status checks and parsing. A service module puts that logic in **one place**: components just call \`getCourses()\`. If the base URL, auth header or response format changes, you change one file. It separates data access from presentation, makes components smaller and easier to test (the module can be mocked), and the same function can be reused as a TanStack Query \`queryFn\`.`,
    explanation:
      "This tests the async request lifecycle in React: effects for side effects, explicit loading/error/success UI states, `response.ok` because `fetch` doesn't reject on HTTP errors, and `AbortController` cleanup to avoid updating state after unmount (and to avoid race conditions).",
    lessonId: "http-abortcontroller",
    misconception: "Assuming fetch rejects on HTTP error statuses",
  }),
  code({
    id: "mock-orig-D3",
    topic: "forms-crud",
    subtopic: "Validation + POST with fetch",
    marks: 10,
    minutes: 10,
    language: "ts",
    prompt: `**D3. Forms, Validation and CRUD (10 marks)**

A React application allows users to create a new event.

The form contains the following information:

- Event Name
- Location
- Maximum Attendees

The requirements are:

- Event Name must not be empty.
- Location must not be empty.
- Maximum Attendees must be a positive integer.
- If validation fails, the user must receive an appropriate error message.
- If validation succeeds, the frontend must submit the data to the following endpoint: \`POST /api/events\`

a. Write a JavaScript or TypeScript validation function that checks all three requirements. It should return suitable validation errors. **(4 marks)**

b. Write a function that submits valid event data using the Fetch API and the POST method. Include appropriate request headers and JSON serialisation. **(3 marks)**

c. Explain the difference between POST and PUT from the perspective of a frontend application performing CRUD operations. **(3 marks)**`,
    rubric: [
      { criterion: "(a) Event Name rejected when empty or whitespace only (uses `trim()`), with a message", marks: 1 },
      { criterion: "(a) Location rejected when empty or whitespace only, with a message", marks: 1 },
      { criterion: "(a) Maximum Attendees checked as a positive integer (`Number.isInteger(n) && n > 0`, rejecting empty, decimals, negatives, NaN)", marks: 1 },
      { criterion: "(a) Returns errors keyed by field (or a list) that the form can display; empty result means valid", marks: 1 },
      { criterion: "(b) `fetch(\"/api/events\", { method: \"POST\", ... })`", marks: 1 },
      { criterion: "(b) `headers: { \"Content-Type\": \"application/json\" }` and `body: JSON.stringify(data)`", marks: 1 },
      { criterion: "(b) Checks `response.ok` and throws/reports an error otherwise; returns the created event", marks: 1 },
      { criterion: "(c) POST creates a new resource, sent to the collection URL (`/api/events`); the server assigns the id; usually 201 Created", marks: 1 },
      { criterion: "(c) PUT updates/replaces an existing resource at a known URL including its id (`/api/events/5`); often 204/200", marks: 1 },
      { criterion: "(c) PUT is idempotent (repeating it gives the same result) whereas repeating a POST can create duplicates — so the frontend must avoid double submits for POST", marks: 1 },
    ],
    modelAnswer: `**(a) Validation function**

\`\`\`ts
export interface EventFormValues {
  eventName: string;
  location: string;
  maxAttendees: string; // raw text from the input
}

export type EventFormErrors = Partial<Record<keyof EventFormValues, string>>;

export function validateEvent(values: EventFormValues): EventFormErrors {
  const errors: EventFormErrors = {};

  if (values.eventName.trim() === "") {
    errors.eventName = "Event name is required.";
  }

  if (values.location.trim() === "") {
    errors.location = "Location is required.";
  }

  const max = Number(values.maxAttendees);
  if (values.maxAttendees.trim() === "" || !Number.isInteger(max) || max <= 0) {
    errors.maxAttendees = "Maximum attendees must be a positive whole number.";
  }

  return errors; // {} means valid
}
\`\`\`

\`Number.isInteger\` rejects \`NaN\` (e.g. "abc") and decimals ("2.5"); \`max <= 0\` rejects 0 and negatives.

**(b) Submitting with fetch + POST**

\`\`\`ts
export interface NewEvent {
  eventName: string;
  location: string;
  maxAttendees: number;
}

export async function createEvent(event: NewEvent): Promise<unknown> {
  const response = await fetch("/api/events", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(event),
  });

  if (!response.ok) {
    throw new Error(\`Could not create event (status \${response.status})\`);
  }

  return response.json(); // 201 Created + the new event
}

// In the form's submit handler:
async function handleSubmit(values: EventFormValues) {
  const errors = validateEvent(values);
  if (Object.keys(errors).length > 0) {
    setErrors(errors); // show messages next to the fields
    return;
  }
  await createEvent({
    eventName: values.eventName.trim(),
    location: values.location.trim(),
    maxAttendees: Number(values.maxAttendees),
  });
}
\`\`\`

(Add an \`Authorization: Bearer <token>\` header if the endpoint is protected, as CampusEvents' admin endpoints are.)

**(c) POST vs PUT**

| | POST | PUT |
|---|---|---|
| CRUD operation | **Create** | **Update** (replace) |
| URL | Collection: \`/api/events\` | Specific resource: \`/api/events/5\` |
| Who chooses the id | Server | Already known (in the URL) |
| Typical response | 201 Created + new resource | 204 No Content (or 200 with the resource) |
| Idempotent? | No — sending twice creates two events | Yes — sending the same PUT twice leaves the same state |

For the frontend this means: use POST from the "Create event" form and PUT from the "Edit event" form (which must know the id and usually sends the full object); disable the submit button while a POST is pending to avoid duplicates; and don't call \`response.json()\` on a 204 response.`,
    explanation:
      "Validation logic must handle whitespace and non-numeric input; fetch needs an explicit method, a JSON content-type header, a stringified body and a `response.ok` check. POST vs PUT is about create vs update, collection vs item URL, and idempotency.",
    lessonId: "forms-validation",
    misconception: "Forgetting JSON.stringify / Content-Type, or assuming fetch rejects on 400",
  }),
  short({
    id: "mock-orig-D4",
    topic: "state-architecture",
    subtopic: "Zustand vs TanStack Query",
    marks: 10,
    minutes: 10,
    prompt: `**D4. State Management - Zustand and TanStack Query (10 marks)**

A shopping application contains the following requirements:

- The selected theme (light or dark) must be available across multiple components.
- Product information must be retrieved from an external API.
- Product information should be cached.
- When a product is updated, the application should refresh the relevant product information.
- The application should avoid unnecessary API requests.

Answer all parts.

a. Identify which of the requirements should be handled using Zustand and which should be handled using TanStack Query. Explain your choices. **(4 marks)**

b. Describe what query caching means in TanStack Query and how it benefits the application. **(2 marks)**

c. Explain how the application can ensure that product information is refreshed after a successful update. **(2 marks)**

d. Explain one advantage of using a selector when accessing data from a Zustand store. **(2 marks)**`,
    rubric: [
      { criterion: "(a) Theme → Zustand", marks: 1 },
      { criterion: "(a) Justification: theme is client/UI state owned by the browser, shared globally without prop drilling or a Provider, updated synchronously (can be persisted)", marks: 1 },
      { criterion: "(a) Fetching, caching, refreshing products and avoiding unnecessary requests → TanStack Query", marks: 1 },
      { criterion: "(a) Justification: product data is server state (owned by the API, can go out of date) — TanStack Query provides caching by query key, deduplication, staleTime, background refetch and invalidation", marks: 1 },
      { criterion: "(b) Caching = results stored in the QueryClient under the query key and reused by every component using that key", marks: 1 },
      { criterion: "(b) Benefit: instant display from cache, fewer duplicate requests (dedupe + staleTime), less loading flicker", marks: 1 },
      { criterion: "(c) Use `useMutation` and, in `onSuccess`, call `queryClient.invalidateQueries({ queryKey: [\"products\"] })`", marks: 1 },
      { criterion: "(c) Explains that matching queries are marked stale and active ones refetch (prefix match also covers `[\"products\", id]`), or alternatively `setQueryData` with the server response", marks: 1 },
      { criterion: "(d) A selector subscribes the component only to the slice it needs, so it re-renders only when that value changes", marks: 1 },
      { criterion: "(d) Explains the benefit: fewer unnecessary re-renders / better performance (and clearer, decoupled component code)", marks: 1 },
    ],
    modelAnswer: `**(a) Which tool for which requirement**

| Requirement | Tool | Why |
|---|---|---|
| Selected theme available across components | **Zustand** | Client/UI state: it lives only in the browser, is not fetched from a server, changes synchronously when the user clicks a toggle. A small global store lets any component read it without prop drilling or a Context provider (and \`persist\` middleware can save it to localStorage). |
| Retrieve products from an API | **TanStack Query** | Server state: owned by the backend, fetched asynchronously, may become out of date. \`useQuery\` handles loading/error states and retries. |
| Cache products | **TanStack Query** | Results are cached by query key in the QueryClient. |
| Refresh after an update | **TanStack Query** | \`useMutation\` + \`invalidateQueries\`. |
| Avoid unnecessary requests | **TanStack Query** | Request deduplication, \`staleTime\` (fresh data is reused without refetching), shared cache across components. |

\`\`\`ts
// Zustand — client state
import { create } from "zustand";

type Theme = "light" | "dark";
interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()((set) => ({
  theme: "light",
  toggleTheme: () => set((s) => ({ theme: s.theme === "light" ? "dark" : "light" })),
}));
\`\`\`

\`\`\`ts
// TanStack Query — server state
const { data: products, isPending, isError } = useQuery({
  queryKey: ["products"],
  queryFn: getProducts,      // from the API service module
  staleTime: 60_000,         // treat as fresh for 1 minute → no refetch on remount
});
\`\`\`

Putting products in Zustand would mean hand-writing loading flags, caching, staleness and refetch logic; putting the theme in TanStack Query makes no sense because there's no server to fetch it from.

**(b) Query caching**

Every successful \`queryFn\` result is stored in the QueryClient cache under its **query key** (e.g. \`["products"]\`, \`["products", 5]\`). Any component that uses the same key reads the same cached data: navigating back to the product list shows products **instantly** instead of a spinner, simultaneous requests for the same key are **deduplicated** into one, and while data is fresh (within \`staleTime\`) no new request is made. Stale data is still shown immediately while a background refetch updates it. Result: fewer API calls, faster UI, consistent data across components. Unused entries are garbage-collected after \`gcTime\` (default 5 minutes).

**(c) Refreshing after a successful update**

\`\`\`ts
const queryClient = useQueryClient();

const updateProduct = useMutation({
  mutationFn: (product: Product) => api.updateProduct(product), // PUT /api/products/:id
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["products"] });
  },
});
\`\`\`

\`invalidateQueries\` marks every query whose key starts with \`["products"]\` (the list *and* \`["products", id]\` details) as stale and immediately refetches the active ones, so the UI shows the updated product. Inactive ones refetch when next used. (Alternative: \`queryClient.setQueryData(["products", updated.id], updated)\` with the server's response.)

**(d) Advantage of a selector**

\`\`\`ts
const theme = useThemeStore((s) => s.theme);
\`\`\`

The component subscribes only to \`theme\`. Zustand compares the selected value (with \`Object.is\`) after each store update and re-renders the component **only if that value changed** — updates to other fields (e.g. a cart count in the same store) don't re-render it. Calling \`useThemeStore()\` without a selector subscribes to the whole state and re-renders on every change. Selectors also make each component's dependency on the store explicit.`,
    explanation:
      "The core distinction is server state (TanStack Query: async, cached, can go stale, needs refetching) vs client state (Zustand: synchronous UI state owned by the browser). Invalidation after mutations keeps the cache in sync; selectors limit re-renders.",
    lessonId: "state-kinds",
    misconception: "Storing API data in a global client store",
  }),
];

/* ------------------------------------------------------------------ */
/* Section E — Front-end security (5 × 2)                              */
/* ------------------------------------------------------------------ */

const sectionE = [
  mcq({
    id: "mock-orig-E1",
    topic: "security",
    subtopic: "Expired JWT handling",
    marks: 2,
    minutes: 2,
    prompt:
      "A user successfully signs in, but their JWT has expired when they attempt to access a protected page. What should the frontend application normally do?",
    options: [
      "Continue treating the user as authenticated indefinitely",
      "Handle the expired authentication state and require reauthentication or an appropriate token-renewal flow",
      "Ignore the expiry information",
      "Display the protected page regardless of authentication",
    ],
    answer: 1,
    explanation:
      "Once `exp` has passed, the API will reject the token with 401. The frontend should detect this (check `exp`/`expiresAt` proactively, or react to a 401), clear the stored auth state, and send the user to log in again (remembering where they were going) — or use a refresh-token flow if the backend supports one.",
    distractorNotes: {
      0: "An expired token no longer proves identity; the API will return 401 for every protected call.",
      2: "Ignoring expiry leads to a broken UI full of failed requests.",
      3: "Showing the page leaks the UI to a logged-out user, and its data requests will fail anyway.",
    },
    lessonId: "sec-401-403-expiry",
  }),
  mcq({
    id: "mock-orig-E2",
    topic: "security",
    subtopic: "Authentication vs authorisation",
    marks: 2,
    minutes: 2,
    prompt: "What is the main difference between authentication and authorisation?",
    options: [
      "Authentication identifies who a user is; authorisation determines what they are allowed to access",
      "Authentication controls CSS; authorisation controls HTML",
      "Both terms mean exactly the same thing",
      "Authorisation always happens before a user is identified",
    ],
    answer: 0,
    explanation:
      "Authentication = *who are you?* (login, verifying a JWT's signature). Authorisation = *what may you do?* (e.g. only `ADMIN` can `DELETE /api/events/{id}`). Failing authentication → 401; failing authorisation → 403.",
    distractorNotes: {
      1: "Neither concept is about styling or markup.",
      2: "They are distinct steps with different status codes (401 vs 403).",
      3: "Authorisation decisions depend on knowing the identity/role, so authentication normally comes first.",
    },
    lessonId: "sec-authn-authz",
  }),
  mcq({
    id: "mock-orig-E3",
    topic: "security",
    subtopic: "Client-side route guards",
    marks: 2,
    minutes: 2,
    prompt:
      "A frontend application allows users to access different pages depending on their roles. Why should the frontend not rely exclusively on hiding restricted pages as its security mechanism?",
    options: [
      "Because React cannot display different pages",
      "Because users may manipulate client-side code or requests, so access permissions must also be enforced by the server",
      "Because CSS cannot hide pages",
      "Because routing automatically encrypts user information",
    ],
    answer: 1,
    explanation:
      "All frontend code runs on the user's machine: they can edit `localStorage`, change JavaScript in DevTools, or call the API directly with curl/Postman. Hiding routes and buttons is good **UX**, but the **server** must check the token and role on every request (the trust boundary is the API).",
    distractorNotes: {
      0: "React (with React Router) can certainly render different pages per role — the problem is that this can be bypassed.",
      2: "CSS can hide elements; but hidden ≠ secure, which is the actual point.",
      3: "Routing encrypts nothing; HTTPS encrypts traffic in transit.",
    },
    lessonId: "sec-trust-boundaries",
    misconception: "Believing frontend route guards are a security boundary",
  }),
  tf({
    id: "mock-orig-E4",
    topic: "security",
    subtopic: "HTTPS",
    marks: 2,
    minutes: 2,
    prompt:
      "True or False: Sending authentication tokens and other sensitive information over HTTPS helps protect them while travelling between the browser and server.",
    answer: true,
    explanation:
      "HTTPS (TLS) encrypts and integrity-protects traffic **in transit**, so eavesdroppers on the network can't read or alter a bearer token. It does not protect a token once it's in the browser (e.g. from XSS) or on the server.",
    lessonId: "sec-xss-csrf-https",
  }),
  tf({
    id: "mock-orig-E5",
    topic: "security",
    subtopic: "Trusting API data",
    marks: 2,
    minutes: 2,
    prompt:
      "True or False: A frontend application should treat data received from an external API as automatically trustworthy simply because the request was successful.",
    answer: false,
    explanation:
      "A 200 response only means the request succeeded — not that the body has the shape you expect or is safe to render. Validate structure at runtime (e.g. Zod), handle missing/null fields, and never inject API strings as raw HTML (`dangerouslySetInnerHTML`) without sanitising, because user-generated content can carry XSS payloads.",
    lessonId: "sec-trust-boundaries",
    misconception: "Equating a successful response with trustworthy data",
  }),
];

export const originalMock: ExamPaper = {
  id: "original-mock",
  title: "MOCK ICT — Advanced Client-Side Web Development",
  description:
    "The supplied mock In-Class Test (5COSC026W), reproduced verbatim with our own answers, explanations, rubrics and model answers. Actual ICT questions appear on Blackboard.",
  kind: "original-mock",
  difficulty: "exam",
  durationMinutes: 90,
  rafExtraMinutes: 25,
  totalMarks: 100,
  instructions: [
    "Answer all questions in Sections A-E.",
    "The examination is worth 100 marks.",
    "Select one answer for each multiple-choice question.",
    "Select True or False for each statement.",
    "Use React with TypeScript or JavaScript and JSX for programming questions, as specified.",
    "Logically correct solutions receive credit.",
    "Show your reasoning where requested.",
    "All questions are based on client-side development. Backend implementation is outside the scope of this examination.",
  ],
  sections: [
    {
      id: "A",
      title: "Section A - Multiple Choice (20 marks)",
      instructions: "Choose ONE answer for each question. Each question is worth 1 mark.",
      suggestedMinutes: 15,
      questionIds: sectionA.map((q) => q.id),
    },
    {
      id: "B",
      title: "Section B - True/False (15 marks)",
      instructions: "Select True or False for each statement. Each question is worth 1 mark.",
      suggestedMinutes: 10,
      questionIds: sectionB.map((q) => q.id),
    },
    {
      id: "C",
      title: "Section C - Short Answer (15 marks)",
      instructions: "Answer all five questions. Each question is worth 3 marks.",
      suggestedMinutes: 15,
      questionIds: sectionC.map((q) => q.id),
    },
    {
      id: "D",
      title: "Section D - Programming, Explanation and Code Analysis (40 marks)",
      instructions: "Answer all four questions. Each question is worth 10 marks.",
      suggestedMinutes: 40,
      questionIds: sectionD.map((q) => q.id),
    },
    {
      id: "E",
      title: "Section E - Front-End Security (10 marks)",
      instructions: "Answer all five questions. Each question is worth 2 marks.",
      suggestedMinutes: 10,
      questionIds: sectionE.map((q) => q.id),
    },
  ],
  questions: [...sectionA, ...sectionB, ...sectionC, ...sectionD, ...sectionE],
};
