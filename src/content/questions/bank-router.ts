import type { Question } from "../types";

/** Markdown code fence helper. */
const F = "```";

export const routerQuestions: Question[] = [
  {
    id: "rt-001",
    type: "mcq",
    topic: "router",
    subtopic: "BrowserRouter",
    difficulty: "beginner",
    marks: 1,
    minutes: 1,
    prompt:
      "A new app renders `<Routes>` in `App`, but the console shows an error that `useRoutes()` / `<Routes>` may be used only in the context of a router. What is missing?",
    options: [
      "A `<Link>` to every page",
      "`<Outlet />` inside `App`",
      "A `<BrowserRouter>` wrapping the app (e.g. in `main.tsx`)",
      "A `path=\"*\"` route",
    ],
    answer: 2,
    distractorNotes: {
      0: "Links are optional navigation UI; they also need a router around them.",
      1: "`Outlet` is for nested layouts; it does not provide router context.",
      3: "A catch-all route handles unknown URLs but is not required for routing to work.",
    },
    explanation:
      "`BrowserRouter` connects React Router to the browser's History API and provides the context that `Routes`, `Link` and the router hooks rely on.",
    lessonId: "router-basics",
    source: "practice",
  },
  {
    id: "rt-002",
    type: "mcq",
    topic: "router",
    subtopic: "Route element",
    difficulty: "beginner",
    marks: 1,
    minutes: 1,
    prompt: "Which route definition is correct for React Router v6/v7 declarative routing?",
    options: [
      "`<Route path=\"/events\" component={EventsPage} />`",
      "`<Route path=\"/events\" element={<EventsPage />} />`",
      "`<Route to=\"/events\" element={EventsPage} />`",
      "`<Route href=\"/events\" render={() => <EventsPage />} />`",
    ],
    answer: 1,
    distractorNotes: {
      0: "`component` is React Router v5 syntax; v6+ uses the `element` prop.",
      2: "`to` belongs to `Link`/`Navigate`; and `element` needs a JSX element, not the component function.",
      3: "`href` and `render` are not `Route` props in v6/v7.",
    },
    explanation:
      "Routes are declared with `path` and `element`, where `element` is a rendered JSX element like `<EventsPage />`.",
    lessonId: "router-basics",
    source: "practice",
  },
  {
    id: "rt-003",
    type: "mcq",
    topic: "router",
    subtopic: "Outlet",
    difficulty: "exam",
    marks: 1,
    minutes: 2,
    prompt: `Visiting \`/students\` shows the navigation bar but NOT the student list. What is wrong?

${F}jsx
<Routes>
  <Route path="/" element={<Layout />}>
    <Route path="students" element={<StudentList />} />
  </Route>
</Routes>

function Layout() {
  return (
    <>
      <nav>...</nav>
      <main></main>
    </>
  );
}
${F}`,
    options: [
      "The child path must be `/students`",
      "`Layout` must render `<Outlet />` where child routes should appear",
      "Nested routes require `createBrowserRouter`",
      "`StudentList` must be wrapped in `<BrowserRouter>`",
    ],
    answer: 1,
    distractorNotes: {
      0: "Relative child paths (`students`) are the normal way to nest; they resolve to `/students`.",
      2: "Declarative `<Routes>` nesting works fine with `BrowserRouter`.",
      3: "There must be only one router at the top of the app; nested routers throw an error.",
    },
    explanation:
      "The route DID match. The parent layout decides where the matched child is rendered by placing `<Outlet />`, e.g. `<main><Outlet /></main>`.",
    lessonId: "router-nested-layouts-outlet",
    source: "practice",
  },
  {
    id: "rt-004",
    type: "mcq",
    topic: "router",
    subtopic: "Index routes",
    difficulty: "intermediate",
    marks: 1,
    minutes: 1,
    prompt: `Which URL renders \`<Dashboard />\` inside \`AdminLayout\`'s outlet?

${F}jsx
<Route path="/admin" element={<AdminLayout />}>
  <Route index element={<Dashboard />} />
  <Route path="events" element={<AdminEvents />} />
</Route>
${F}`,
    options: ["`/admin/index`", "`/admin/dashboard`", "`/admin/events`", "`/admin`"],
    answer: 3,
    distractorNotes: {
      0: "`index` is a prop, not a path segment.",
      1: "No route has the path `dashboard`; it would fall through to a 404 route if one exists.",
      2: "`/admin/events` renders `AdminEvents`.",
    },
    explanation:
      "An index route renders in the parent's outlet when the URL matches the parent path exactly. It is the \"default child\".",
    lessonId: "router-nested-layouts-outlet",
    source: "practice",
  },
  {
    id: "rt-005",
    type: "mcq",
    topic: "router",
    subtopic: "Nested routes",
    difficulty: "intermediate",
    marks: 1,
    minutes: 2,
    prompt: `What is rendered at \`/admin/events/7/edit\`?

${F}jsx
<Route path="/admin" element={<AdminLayout />}>
  <Route path="events" element={<AdminEvents />} />
  <Route path="events/:id/edit" element={<EditEvent />} />
</Route>
${F}`,
    options: [
      "`AdminLayout` with `EditEvent` in its outlet",
      "`AdminLayout` with `AdminEvents` in its outlet, and `EditEvent` inside `AdminEvents`",
      "`EditEvent` only, without the layout",
      "Nothing, because `:id` must be the last segment",
    ],
    answer: 0,
    distractorNotes: {
      1: "`events` and `events/:id/edit` are siblings, not parent/child, so `AdminEvents` is not rendered.",
      2: "The child is nested in the `/admin` route, so its parent element (the layout) also renders.",
      3: "Dynamic segments can appear anywhere in a path.",
    },
    explanation:
      "Matching nested routes renders the whole chain of elements: the parent layout, then the matching child in its `<Outlet />`. Here `id` is `\"7\"`.",
    lessonId: "router-nested-layouts-outlet",
    source: "practice",
  },
  {
    id: "rt-006",
    type: "mcq",
    topic: "router",
    subtopic: "useParams",
    difficulty: "exam",
    marks: 1,
    minutes: 2,
    prompt: `The route is \`/events/:eventId\` and the URL is \`/events/5\`. Event ids in \`events\` are numbers. What is \`event\`?

${F}jsx
const { eventId } = useParams();
const event = events.find(e => e.id === eventId);
${F}`,
    options: [
      "The event with id 5",
      "A TypeError, because `eventId` is undefined",
      "`undefined`, because `eventId` is the string \"5\" and `5 === \"5\"` is false",
      "An array containing the event with id 5",
    ],
    answer: 2,
    distractorNotes: {
      0: "URL params are always strings. Strict equality with a number never matches.",
      1: "`eventId` is defined (\"5\") because the route has a matching `:eventId` segment.",
      3: "`find` returns one element or `undefined`, never an array.",
    },
    explanation:
      "`useParams()` returns string values (or `undefined`). Convert first: `const id = Number(eventId);` and validate it (`Number.isNaN`) before using it.",
    lessonId: "router-dynamic-params",
    source: "practice",
    misconception: "useParams returns numbers",
  },
  {
    id: "rt-007",
    type: "mcq",
    topic: "router",
    subtopic: "useNavigate",
    difficulty: "advanced",
    marks: 1,
    minutes: 1,
    prompt:
      "After a successful login, the app sends the user to `/events`. Pressing the browser's Back button should NOT return to the login page. Which call achieves this?",
    options: [
      "`navigate(\"/events\")`",
      "`navigate(-1)`",
      "`window.location.href = \"/events\"`",
      "`navigate(\"/events\", { replace: true })`",
    ],
    answer: 3,
    distractorNotes: {
      0: "This pushes a new history entry, leaving `/login` behind it, so Back returns to it.",
      1: "This goes back one entry; it does not go to `/events`.",
      2: "This causes a full page reload (losing in-memory state) and still creates a history entry.",
    },
    explanation:
      "`replace: true` replaces the current history entry (the login page) instead of pushing a new one.",
    lessonId: "router-navigation",
    source: "practice",
  },
  {
    id: "rt-008",
    type: "mcq",
    topic: "router",
    subtopic: "useSearchParams",
    difficulty: "intermediate",
    marks: 1,
    minutes: 1,
    prompt: `The URL is \`/events?category=music&page=2\`. What do these return?

${F}jsx
const [searchParams] = useSearchParams();
const page = searchParams.get("page");
const sort = searchParams.get("sort");
${F}`,
    options: [
      "`page` = 2 (number), `sort` = undefined",
      "`page` = \"2\" (string), `sort` = null",
      "`page` = \"2\" (string), `sort` = \"\"",
      "`page` = [\"2\"], `sort` = []",
    ],
    answer: 1,
    distractorNotes: {
      0: "Query values are strings; and `URLSearchParams.get` returns `null`, not `undefined`, for a missing key.",
      2: "An empty string would only be returned for `?sort=` (present but empty).",
      3: "`get` returns the first value as a string; `getAll` returns an array.",
    },
    explanation:
      "`searchParams` is a `URLSearchParams` object. `get` returns the first value as a string, or `null` if the key is absent. Parse numbers yourself: `Number(searchParams.get(\"page\") ?? \"1\")`.",
    lessonId: "router-search-params",
    source: "practice",
  },
  {
    id: "rt-009",
    type: "mcq",
    topic: "router",
    subtopic: "Link vs <a>",
    difficulty: "beginner",
    marks: 1,
    minutes: 1,
    prompt:
      "A navigation bar uses `<a href=\"/basket\">Basket</a>`. Users complain the basket count (held in React state) resets when they click it. Why?",
    options: [
      "`<a>` triggers a full page load, so the React app restarts and in-memory state is lost; use `<Link to=\"/basket\">`",
      "`href` must be an absolute URL",
      "`<a>` elements cannot be styled as nav items",
      "The basket route is missing a `key` prop",
    ],
    answer: 0,
    distractorNotes: {
      1: "Relative hrefs work; the problem is the full reload, not the URL format.",
      2: "Styling is unrelated to losing state.",
      3: "Routes do not need keys; keys are for list items.",
    },
    explanation:
      "`<Link>` renders an `<a>` but intercepts the click and updates the URL with the History API, so React Router swaps components without reloading the page.",
    lessonId: "router-navigation",
    source: "practice",
  },
  {
    id: "rt-010",
    type: "mcq",
    topic: "router",
    subtopic: "NotFound route",
    difficulty: "advanced",
    marks: 1,
    minutes: 2,
    prompt: "Where must `<Route path=\"*\" element={<NotFound />} />` be placed among its sibling routes in React Router v6/v7?",
    options: [
      "It must be the very last sibling, otherwise it matches everything first",
      "It must be the first sibling",
      "It must be outside `<Routes>`",
      "Anywhere among its siblings: routes are ranked by specificity, so `*` only wins when nothing more specific matches",
    ],
    answer: 3,
    distractorNotes: {
      0: "That was true for v5's `<Switch>` (first match wins). v6+ ranks routes, so order does not matter.",
      1: "Order does not decide matching in v6+.",
      2: "Every `<Route>` must be a child of `<Routes>` (or another `<Route>`).",
    },
    explanation:
      "React Router v6+ scores every route and picks the best match. Static segments beat dynamic ones, which beat the `*` splat. Placing `*` last is still a readable convention.",
    lessonId: "router-basics",
    source: "practice",
    misconception: "route order decides the match",
  },
  {
    id: "rt-011",
    type: "mcq",
    topic: "router",
    subtopic: "Route ranking",
    difficulty: "advanced",
    marks: 1,
    minutes: 1,
    prompt: `Which component renders at \`/events/new\`?

${F}jsx
<Routes>
  <Route path="/events/:id" element={<EventDetails />} />
  <Route path="/events/new" element={<CreateEvent />} />
</Routes>
${F}`,
    options: [
      "`EventDetails` with `id = \"new\"`, because it is declared first",
      "Both components",
      "`CreateEvent`, because a static segment ranks higher than a dynamic one",
      "Neither; the routes conflict and throw an error",
    ],
    answer: 2,
    distractorNotes: {
      0: "Declaration order does not matter in v6+; ranking does.",
      1: "Only one sibling route is matched at each level.",
      3: "Overlapping patterns are allowed; ranking resolves them.",
    },
    explanation: "`new` is a static segment and scores higher than `:id`, so `/events/new` matches `CreateEvent`; `/events/5` matches `EventDetails`.",
    lessonId: "router-dynamic-params",
    source: "practice",
  },
  {
    id: "rt-012",
    type: "mcq",
    topic: "router",
    subtopic: "Protected routes",
    difficulty: "exam",
    marks: 1,
    minutes: 2,
    prompt: `What is the purpose of \`replace\` and \`state\` in this guard?

${F}jsx
function RequireAuth({ children }) {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return children;
}
${F}`,
    options: [
      "`replace` encrypts the redirect; `state` stores the JWT",
      "`replace` swaps the protected URL's history entry for `/login`; `state.from` lets the login page send the user back to where they were after signing in",
      "`replace` reloads the page; `state` resets all React state",
      "They make the route secure so the API does not need to check permissions",
    ],
    answer: 1,
    distractorNotes: {
      0: "Routing never encrypts anything, and the token should not be put in navigation state.",
      2: "`<Navigate>` performs client-side navigation without a reload.",
      3: "Frontend guards are UX only; the API must still enforce authentication and authorisation.",
    },
    explanation:
      "Replacing avoids a Back-button loop to the guarded page. After login, `navigate(location.state?.from?.pathname ?? \"/\", { replace: true })` returns the user to the page they wanted.",
    lessonId: "router-protected-routes",
    source: "practice",
  },
  {
    id: "rt-013",
    type: "mcq",
    topic: "router",
    subtopic: "Deep-link refresh",
    difficulty: "exam",
    marks: 1,
    minutes: 2,
    prompt:
      "A React SPA works when you click around, but after deploying to a static web server, refreshing on `/events/5` returns the server's 404 page. What is the cause?",
    options: [
      "React Router does not support dynamic segments in production",
      "The browser cache is corrupt",
      "The server looks for a file at `/events/5`, which does not exist; it must be configured to serve `index.html` for unknown paths so the client router can handle the URL",
      "`BrowserRouter` must be replaced by `<a>` links",
    ],
    answer: 2,
    distractorNotes: {
      0: "Dynamic segments work identically in production once the app has loaded.",
      1: "The 404 comes from the server's routing, not from the cache.",
      3: "Plain links would make every navigation a full request, hitting the same server problem.",
    },
    explanation:
      "In-app navigation never asks the server for `/events/5`, but a refresh or a pasted deep link does. Configure a fallback (rewrite) to `index.html`; the Vite dev server already does this, which is why it works locally.",
    lessonId: "router-basics",
    source: "practice",
  },
  {
    id: "rt-014",
    type: "mcq",
    topic: "router",
    subtopic: "NavLink",
    difficulty: "beginner",
    marks: 1,
    minutes: 1,
    prompt: "Which component makes it easy to style the link for the page the user is currently on?",
    options: ["`<NavLink>`", "`<Navigate>`", "`<Outlet>`", "`<Routes>`"],
    answer: 0,
    distractorNotes: {
      1: "`<Navigate>` redirects when rendered; it does not render a link.",
      2: "`<Outlet>` renders matched child routes.",
      3: "`<Routes>` chooses which route to render.",
    },
    explanation:
      "`NavLink` knows whether its `to` matches the current location; it adds an `active` class by default and accepts a `className` function like `({ isActive }) => isActive ? \"active\" : \"\"`.",
    lessonId: "router-navigation",
    source: "practice",
  },
  /* ---------------------------------------------------------------- */
  /* True / False                                                      */
  /* ---------------------------------------------------------------- */
  {
    id: "rt-015",
    type: "tf",
    topic: "router",
    subtopic: "Client-side routing",
    difficulty: "beginner",
    marks: 1,
    minutes: 1,
    prompt: "When the user clicks a React Router `<Link>`, the browser requests the new page's HTML from the server.",
    answer: false,
    explanation:
      "`Link` prevents the default navigation, updates the URL with `history.pushState`, and React Router renders the matching components. Only data requests (if any) go to the server.",
    lessonId: "router-basics",
    source: "practice",
  },
  {
    id: "rt-016",
    type: "tf",
    topic: "router",
    subtopic: "useParams",
    difficulty: "intermediate",
    marks: 1,
    minutes: 1,
    prompt:
      "In a nested route `/courses/:courseId/lessons/:lessonId`, a component rendered by the inner lesson route can read BOTH `courseId` and `lessonId` with `useParams()`.",
    answer: true,
    explanation: "`useParams` returns the params of the current match, including those from parent route segments.",
    lessonId: "router-dynamic-params",
    source: "practice",
  },
  {
    id: "rt-017",
    type: "tf",
    topic: "router",
    subtopic: "Protected routes",
    difficulty: "exam",
    marks: 1,
    minutes: 1,
    prompt: "Hiding the `/admin` link and wrapping the route in a `RequireAdmin` component is enough to keep admin data secure.",
    answer: false,
    explanation:
      "Client code can be inspected or modified, and API endpoints can be called directly. Guards improve UX; the server must check the token and role (returning 401/403) on every protected endpoint.",
    lessonId: "router-protected-routes",
    source: "practice",
    misconception: "frontend guards are security",
  },
  {
    id: "rt-018",
    type: "tf",
    topic: "router",
    subtopic: "useSearchParams",
    difficulty: "advanced",
    marks: 1,
    minutes: 1,
    prompt:
      "On `/events?category=music`, calling `setSearchParams({ page: \"3\" })` changes the URL to `/events?category=music&page=3`.",
    answer: false,
    explanation:
      "Passing an object REPLACES the whole query string, giving `/events?page=3`. To keep existing params, use the updater form: `setSearchParams(prev => { prev.set(\"page\", \"3\"); return prev; })`.",
    lessonId: "router-search-params",
    source: "practice",
    misconception: "setSearchParams merges",
  },
  {
    id: "rt-019",
    type: "tf",
    topic: "router",
    subtopic: "Layout routes",
    difficulty: "intermediate",
    marks: 1,
    minutes: 1,
    prompt:
      "A route with an `element` but no `path` (a pathless layout route) can wrap several sibling routes so they share a layout, without adding a URL segment.",
    answer: true,
    explanation:
      "For example `<Route element={<AuthLayout />}>` around `login` and `register` gives both pages the same layout via its `<Outlet />`, while their URLs stay `/login` and `/register`.",
    lessonId: "router-nested-layouts-outlet",
    source: "practice",
  },
  /* ---------------------------------------------------------------- */
  /* Short answers                                                     */
  /* ---------------------------------------------------------------- */
  {
    id: "rt-020",
    type: "short",
    topic: "router",
    subtopic: "useParams vs useSearchParams",
    difficulty: "intermediate",
    marks: 3,
    minutes: 4,
    prompt:
      "Using the URL `/products/42?colour=red&sort=price`, explain the difference between `useParams()` and `useSearchParams()` and when you would use each.",
    rubric: [
      { criterion: "`useParams` reads dynamic path segments defined in the route (`/products/:productId` -> `productId = \"42\"`)", marks: 1 },
      { criterion: "`useSearchParams` reads/writes the query string (`colour`, `sort`) via a URLSearchParams object", marks: 1 },
      { criterion: "Usage: path params identify a resource; search params hold optional view state like filters, sorting, pagination (both are strings)", marks: 1 },
    ],
    modelAnswer:
      "With the route `/products/:productId`, `useParams()` returns `{ productId: \"42\" }`: path params identify WHICH resource the page shows and are required by the route. `useSearchParams()` returns `[searchParams, setSearchParams]`; `searchParams.get(\"colour\")` gives \"red\" and `get(\"sort\")` gives \"price\". Query params hold optional, shareable view state such as filters, sorting and page number, and `setSearchParams` can update them. All values are strings and must be converted if numbers are needed.",
    explanation: "Path = identity of the resource; query = how to view it.",
    lessonId: "router-search-params",
    source: "practice",
  },
  {
    id: "rt-021",
    type: "short",
    topic: "router",
    subtopic: "Protected routes",
    difficulty: "exam",
    marks: 3,
    minutes: 4,
    prompt:
      "Describe how a protected route works in a React Router app and explain why it does not, by itself, secure the application's data.",
    rubric: [
      { criterion: "A wrapper/layout checks auth state and renders the page (children/Outlet) or `<Navigate to=\"/login\" replace />`", marks: 1 },
      { criterion: "Can also check role for admin pages and preserve the intended location", marks: 1 },
      { criterion: "Not security: client code can be bypassed/modified; the server must validate the token and role on every request (401/403)", marks: 1 },
    ],
    modelAnswer:
      "A component such as `RequireAuth` (or a layout route rendering `<Outlet />`) reads the auth state, e.g. from a store or context. If there is no valid user it returns `<Navigate to=\"/login\" replace state={{ from: location }} />`; otherwise it renders the protected page. A role check (e.g. ADMIN) can redirect to a 403 page. This only controls what the UI shows: anyone can change JavaScript in the browser or call the API directly with tools like Postman. Real protection is the backend verifying the JWT and the user's role on each request and returning 401 or 403.",
    explanation: "Frontend guards are a UX convenience; authorisation is enforced by the server.",
    lessonId: "router-protected-routes",
    source: "practice",
    misconception: "frontend guards are security",
  },
  /* ---------------------------------------------------------------- */
  /* Code questions                                                    */
  /* ---------------------------------------------------------------- */
  {
    id: "rt-022",
    type: "code",
    topic: "router",
    subtopic: "Route configuration",
    difficulty: "exam",
    marks: 6,
    minutes: 10,
    language: "tsx",
    prompt: `Write a React Router configuration for a library app:

- A shared \`MainLayout\` (with a nav menu) wraps all pages.
- \`/\` shows \`Home\`.
- \`/books\` shows \`BookList\`.
- \`/books/:isbn\` shows \`BookDetails\`.
- \`/account\` shows \`Account\`, but only for signed-in users (assume a \`RequireAuth\` component that renders \`<Outlet />\` or redirects).
- Any unknown URL shows \`NotFound\`.

Also write \`MainLayout\`.`,
    rubric: [
      { criterion: "`BrowserRouter` (here or in main) wrapping `<Routes>`", marks: 1 },
      { criterion: "Parent layout route with `element={<MainLayout />}` and nested child routes", marks: 1 },
      { criterion: "Index route for Home and relative paths `books`, `books/:isbn`", marks: 1 },
      { criterion: "`account` nested inside a `RequireAuth` route", marks: 1 },
      { criterion: "`path=\"*\"` NotFound route", marks: 1 },
      { criterion: "`MainLayout` renders navigation (`Link`/`NavLink`) and `<Outlet />`", marks: 1 },
    ],
    modelAnswer: `${F}tsx
import { BrowserRouter, Routes, Route, NavLink, Outlet } from "react-router-dom";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="books" element={<BookList />} />
          <Route path="books/:isbn" element={<BookDetails />} />
          <Route element={<RequireAuth />}>
            <Route path="account" element={<Account />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

function MainLayout() {
  return (
    <>
      <nav>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/books">Books</NavLink>
        <NavLink to="/account">Account</NavLink>
      </nav>
      <main>
        <Outlet />
      </main>
    </>
  );
}
${F}`,
    explanation:
      "The layout route renders once for all children; `<Outlet />` marks where the matched child appears. A pathless `RequireAuth` route guards any routes nested inside it.",
    lessonId: "router-nested-layouts-outlet",
    source: "practice",
  },
  {
    id: "rt-023",
    type: "code",
    topic: "router",
    subtopic: "Params, search params & navigation",
    difficulty: "advanced",
    marks: 5,
    minutes: 8,
    language: "tsx",
    prompt:
      "For the route `/books/:isbn`, write a `BookDetails` component that: displays the `isbn` param; reads a `tab` query parameter (default `\"summary\"` when absent) and shows it; has two buttons that switch `tab` to `\"summary\"` or `\"reviews\"` via the query string; and has a \"Back to list\" button that navigates to `/books` programmatically.",
    rubric: [
      { criterion: "`const { isbn } = useParams();` and displays it", marks: 1 },
      { criterion: "`useSearchParams` with `searchParams.get(\"tab\") ?? \"summary\"`", marks: 1 },
      { criterion: "Buttons call `setSearchParams({ tab: \"...\" })` (or updater form)", marks: 1 },
      { criterion: "`const navigate = useNavigate();` called at top level", marks: 1 },
      { criterion: "Back button `onClick={() => navigate(\"/books\")}`", marks: 1 },
    ],
    modelAnswer: `${F}tsx
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

export function BookDetails() {
  const { isbn } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const tab = searchParams.get("tab") ?? "summary";

  return (
    <section>
      <h1>Book {isbn}</h1>
      <button onClick={() => setSearchParams({ tab: "summary" })}>Summary</button>
      <button onClick={() => setSearchParams({ tab: "reviews" })}>Reviews</button>
      <p>Current tab: {tab}</p>
      <button onClick={() => navigate("/books")}>Back to list</button>
    </section>
  );
}
${F}`,
    explanation:
      "Keeping the tab in the query string makes it bookmarkable and survives refresh. Hooks are called at the top level; `navigate` is used inside the click handler.",
    lessonId: "router-search-params",
    source: "practice",
  },
  {
    id: "rt-024",
    type: "code",
    topic: "router",
    subtopic: "Find the errors",
    difficulty: "exam",
    marks: 5,
    minutes: 8,
    language: "jsx",
    prompt: `Assume nothing else wraps \`App\`. Find **four** problems in this code and rewrite it correctly. (At \`/products/4\` the heading should show "Product 5 of the catalogue" - i.e. id + 1.)

${F}jsx
import { Routes, Route, useParams } from "react-router-dom";

export default function App() {
  return (
    <Routes>
      <Route path="/" component={Layout}>
        <Route index element={<Home />} />
        <Route path="products/:id" element={<Product />} />
      </Route>
    </Routes>
  );
}

function Layout() {
  return <nav>Shop</nav>;
}

function Product() {
  const { id } = useParams();
  return <h1>Product {id + 1} of the catalogue</h1>;
}
${F}`,
    rubric: [
      { criterion: "No router: wrap `<Routes>` in `<BrowserRouter>`", marks: 1 },
      { criterion: "`component={Layout}` is v5 syntax: use `element={<Layout />}`", marks: 1 },
      { criterion: "`Layout` has no `<Outlet />`, so children never render", marks: 1 },
      { criterion: "`id` is a string: `id + 1` gives \"41\"; use `Number(id) + 1`", marks: 1 },
      { criterion: "Correct rewritten code", marks: 1 },
    ],
    modelAnswer: `${F}jsx
import { BrowserRouter, Routes, Route, Outlet, useParams } from "react-router-dom";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="products/:id" element={<Product />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

function Layout() {
  return (
    <>
      <nav>Shop</nav>
      <Outlet />
    </>
  );
}

function Product() {
  const { id } = useParams();
  return <h1>Product {Number(id) + 1} of the catalogue</h1>;
}
${F}`,
    explanation:
      "Router context, the `element` prop, an `<Outlet />` in layouts, and string params are the four most common React Router mistakes.",
    lessonId: "router-dynamic-params",
    source: "practice",
    misconception: "useParams returns numbers",
  },
];
