import type { Lesson, SourceRef } from "../types";

/*
 * Module 06 (React Router), Module 07 (REST/HTTP) and Module 08 (Forms & CRUD).
 * University citations point at the real supplied files in extracted-materials/.
 */

const W03 = "Week 03 Lecture — Consuming REST APIs with React";
const W05 = "Week 05 Lecture — Routing, React Architecture, Forms, Validation & CRUD";
const GUIDE = "Campus Event Frontend guide (Week 05 extension)";
const POSTMAN = "CampusEvents API — Postman Testing Guide";
const L01 = "Lecture 01 — Web, HTTP, MVC, DTOs";
const MOCK = "MOCK ICT paper";

const mock = (detail: string): SourceRef => ({ kind: "mock", label: MOCK, detail });
const w03 = (detail: string): SourceRef => ({ kind: "university", label: W03, detail });
const w05 = (detail: string): SourceRef => ({ kind: "university", label: W05, detail });
const guide = (detail: string): SourceRef => ({ kind: "university", label: GUIDE, detail });
const postman = (detail: string): SourceRef => ({ kind: "university", label: POSTMAN, detail });
const l01 = (detail: string): SourceRef => ({ kind: "university", label: L01, detail });
const backend = (detail: string): SourceRef => ({
  kind: "university",
  label: "CampusEvents.Api backend (supplied project)",
  detail,
});

export const routerHttpFormsLessons: Lesson[] = [
  /* ================================================================== */
  /* 1. router-basics                                                    */
  /* ================================================================== */
  {
    id: "router-basics",
    moduleId: "m06-router",
    title: "Client-Side Routing Basics",
    summary:
      "How React Router maps URLs to components with BrowserRouter, Routes, Route, Link and NavLink — without reloading the page.",
    priority: "P0",
    examCritical: true,
    minutes: 30,
    objectives: [
      "Explain what client-side routing is and how it uses the browser History API instead of a full document reload.",
      "Configure BrowserRouter, Routes and Route, including a catch-all `*` not-found route.",
      "Choose between Link, NavLink and a plain `<a>` tag for internal navigation.",
      "Explain why the server must serve index.html for deep links such as /events/42.",
    ],
    prerequisites: ["react-state-events"],
    sources: [
      w05("Slides 5–8 (SPA, what routing solves, route design, core idea), Slide 11 (Link vs navigate), Slide 12 (not-found routes)"),
      guide("Files 13 (Navbar with NavLink), 20 (NotFound), 21 (App.tsx routes), 22 (main.tsx BrowserRouter)"),
      l01("Slide 17 — Traditional vs Modern (SPA)"),
      mock("A6, B1"),
      { kind: "supplementary", label: "MDN — History API", url: "https://developer.mozilla.org/en-US/docs/Web/API/History_API" },
      { kind: "supplementary", label: "React Router documentation", url: "https://reactrouter.com/" },
    ],
    why: `A single-page application (SPA) loads **one** HTML document and then lets JavaScript swap what is on screen. Without routing, every "page" would just be a piece of state — the user could not bookmark the Events page, share a link to event 42, or press the browser's Back button and land somewhere sensible.

Client-side routing gives an SPA real **URLs** again (Week 05, Slide 6):

- **Direct access** — paste \`/events/42\` and land on that view.
- **Browser history** — Back and Forward move between application locations.
- **Clear structure** — each URL has one purpose.

And it does this **without a full page reload** on every click (mock **B1** is True), so app state such as a logged-in user or a half-filled sidebar survives navigation and the transition feels instant.`,
    analogy: `Think of a theatre with **one stage**. A traditional website builds a brand-new theatre every time you change scene (the browser downloads a new HTML document). A React SPA keeps the same theatre and the stage manager (React Router) just swaps the scenery when the programme number (the URL) changes.

The programme number is real: you can write it down, tell a friend, and they can ask the box office for "scene /events/42". The box office (the web server) must then hand them the same theatre — \`index.html\` — and let the stage manager set the right scene. If the box office says "we have no theatre called /events/42" you get a 404, which is exactly the deep-link problem.`,
    explain: {
      beginner: `In a normal website every link asks the server for a **new HTML page**. The screen goes blank for a moment, all JavaScript restarts and anything you had in memory is lost.

A React app is usually a **single-page application**. The browser downloads \`index.html\` once, React starts, and from then on React decides what to draw. **React Router** is the library that connects the **address bar** to **which component is shown**.

You set it up with a few pieces:

- \`<BrowserRouter>\` wraps the app and listens to the URL.
- \`<Routes>\` looks at the current URL and picks the **best matching** \`<Route>\`.
- \`<Route path="/events" element={<Events />} />\` says "when the URL is /events, show the Events component".
- \`<Link to="/events">\` is the router-aware version of \`<a href>\`. Clicking it changes the URL **without reloading the page**.
- \`<NavLink>\` is a Link that knows whether it is **active**, so the navbar can highlight the current page.

Finally, a route with \`path="*"\` catches anything that does not match — your friendly "Page not found" screen.

Key idea: the URL is now **the source of truth for which page is visible**. That is why Back/Forward and bookmarks work in a React app.`,
      developer: `**Setup.** Wrap the tree once in \`main.tsx\` (as the Campus Event guide does in File 22):

\`\`\`tsx
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
\`\`\`

Every router hook (\`useParams\`, \`useNavigate\`, …) and component (\`Link\`, \`Routes\`) must be **inside** this provider, otherwise React Router throws an error about being used outside a router context.

**Matching.** \`<Routes>\` ranks routes by specificity rather than by order, so \`/events/new\` beats \`/events/:id\` regardless of which is written first. \`path="*"\` is the lowest-ranked match and is ideal for a NotFound page.

**Links.** \`<Link to="/events">\` renders a real \`<a href="/events">\` (good for accessibility, middle-click, "open in new tab") but intercepts a normal left-click, calls \`event.preventDefault()\` and pushes a new history entry. A plain \`<a href="/events">\` would trigger a **full document request**: React unmounts, all state is lost and the bundle is re-evaluated (Week 05, Slide 11).

**NavLink** passes \`{ isActive, isPending }\` to \`className\`/\`style\` functions. Use the \`end\` prop on the Home link so \`/\` is not "active" for every nested path.

**Declarative vs data routers.** The course teaches declarative \`<Routes>\`. React Router 7 also offers \`createBrowserRouter\` + \`<RouterProvider>\` (data APIs such as loaders/actions) — an alternative, not a requirement.`,
      deep: `**What actually happens on a Link click.** React Router's \`BrowserRouter\` creates a history object built on \`window.history\`. Clicking a Link calls \`history.pushState(state, "", "/events")\`. \`pushState\` changes the URL and adds a history entry **without** any network request and **without** firing \`popstate\`. The router therefore notifies its own subscribers, the location in context changes, \`<Routes>\` re-matches, and React re-renders. When the user presses Back, the browser fires \`popstate\`; the router listens for that, updates location and React renders the previous route.

**Deep links and the server.** A refresh or a pasted URL is **not** handled by the router — it is a brand-new HTTP \`GET /events/42\` from the browser to whatever serves your static files. The Vite dev server falls back to \`index.html\` automatically, but a production host (Nginx, IIS, S3, Azure Static Web Apps…) must be configured with a "history fallback" rule: unknown paths → \`index.html\`, **except** real asset files and the \`/api\` prefix. Week 05, Slide 6: "the server must be configured to serve the SPA entry point for valid client-side routes." Without it, refresh on a nested route returns the server's 404 — the knowledge-check question on Slide 13.

**Two different 404s.** A catch-all route handles *unknown paths*. It cannot know that \`/events/999\` has no record — that is a data 404 from the API (Slide 12). Model both.

**HashRouter** (\`/#/events\`) avoids the server rule because the fragment is never sent to the server, at the cost of uglier URLs and weaker SEO; prefer BrowserRouter plus a fallback rule.`,
    },
    mechanism: `\`\`\`text
 IN-APP CLICK  (<Link to="/events/42">)               REFRESH / PASTED URL
 ─────────────────────────────────────               ─────────────────────
 click ─► Link onClick                               browser ─► GET /events/42 ─► web server
          │ event.preventDefault()                                               │
          ▼                                                    ┌─────────────────┴───────────┐
   history.pushState(..., "/events/42")                        │ history fallback configured?│
          │  (no network request)                              └───────┬─────────────┬───────┘
          ▼                                                          yes             no
   router location changes                                            │               │
          │                                                   index.html        404 from server
          ▼                                                           │        (app never loads)
   <Routes> ranks & matches  "/events/:id"                     JS bundle boots
          │                                                           │
          ▼                                                    BrowserRouter reads
   React renders <EventDetails/>  ──► commit DOM               window.location → same
                                                               matching as the left side
\`\`\`

- Left: navigation **inside** the running app — no document request, state survives.
- Right: anything that asks the **server** for the URL — the server must return \`index.html\` so the router can take over.
- \`popstate\` (Back/Forward) re-enters the left pipeline at "router location changes".`,
    simpleExample: {
      title: "Smallest useful router with a catch-all route",
      language: "tsx",
      code: `import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

function Home() {
  return <h1>Home</h1>;
}

function About() {
  return <h1>About</h1>;
}

function NotFound() {
  return <h1>404 — page not found</h1>;
}

export default function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link> | <Link to="/about">About</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}`,
      walkthrough: [
        { lines: "1", text: "All router pieces come from `react-router-dom`, as in the course guide." },
        { lines: "3-13", text: "Three plain page components. Routing does not change how components are written." },
        { lines: "17", text: "`BrowserRouter` provides routing context and listens to the address bar (History API)." },
        { lines: "18-20", text: "`Link` renders an `<a>` but intercepts clicks: the URL changes with `pushState`, no page reload." },
        { lines: "21-25", text: "`Routes` picks the best match. `path=\"*\"` matches anything else — the not-found page." },
      ],
    },
    realExample: {
      title: "CampusEvents: main.tsx, Navbar with NavLink, App routes",
      language: "tsx",
      code: `// ---- src/main.tsx ----
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);

// ---- src/components/Navbar.tsx ----
import { NavLink } from "react-router-dom";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  "nav-link" + (isActive ? " active" : "");

export function Navbar() {
  return (
    <nav className="navbar navbar-expand navbar-dark bg-dark">
      <div className="container">
        <NavLink className="navbar-brand" to="/">CampusEvents</NavLink>
        <div className="navbar-nav">
          <NavLink to="/" end className={linkClass}>Home</NavLink>
          <NavLink to="/events" className={linkClass}>Events</NavLink>
        </div>
      </div>
    </nav>
  );
}

// ---- src/App.tsx ----
import { Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import Home from "./pages/Home";
import Events from "./pages/Events";
import EventNew from "./pages/EventNew";
import EventDetails from "./pages/EventDetails";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/new" element={<EventNew />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}`,
      walkthrough: [
        { lines: "7-13", text: "BrowserRouter wraps the whole app once, so every component below can use router hooks and links." },
        { lines: "18-19", text: "NavLink calls the className function with `{ isActive }` so the current page gets Bootstrap's `active` class." },
        { lines: "27", text: "`end` makes Home active only on exactly `/` — otherwise `/` would match every path as a prefix." },
        { lines: "50-51", text: "`/events/new` and `/events/:id` coexist: React Router ranks static segments above dynamic ones, so `new` is never treated as an id." },
        { lines: "52", text: "The catch-all `*` route renders NotFound for unknown paths (route-not-found, not record-not-found)." },
      ],
    },
    mistakes: [
      {
        mistake: "Using `<a href=\"/events\">` for internal navigation.",
        fix: "Use `<Link to=\"/events\">` (or NavLink). A plain anchor triggers a full document request, re-boots the app and wipes in-memory state.",
      },
      {
        mistake: "Calling `useNavigate`/`useParams` or rendering `<Link>` outside `<BrowserRouter>`.",
        fix: "Wrap `<App />` in `<BrowserRouter>` in main.tsx (or the test render). Router hooks need router context.",
      },
      {
        mistake: "Deploying the SPA and finding that refreshing `/events/42` shows a server 404.",
        fix: "Configure the host's history fallback so unknown non-asset, non-API paths return `index.html`.",
      },
      {
        mistake: "Forgetting `end` on the Home NavLink, so Home is highlighted on every page.",
        fix: "`<NavLink to=\"/\" end>` — active only when the path is exactly `/`.",
      },
      {
        mistake: "Thinking the `*` route handles `/events/999` when the event does not exist.",
        fix: "The catch-all only handles unmatched paths. A matched route whose record is missing must handle the API's 404 itself.",
      },
    ],
    debug: {
      prompt:
        "The navbar keeps a 'dark mode' toggle in state at the top of App. Every time the user clicks a navbar item, dark mode resets to off and the screen flashes white. Find the bug.",
      language: "tsx",
      buggyCode: `import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Events from "./pages/Events";

export default function App() {
  const [dark, setDark] = useState(false);
  return (
    <div className={dark ? "bg-dark text-light" : ""}>
      <nav>
        <a href="/">Home</a>
        <a href="/events">Events</a>
        <button onClick={() => setDark((d) => !d)}>Toggle theme</button>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
      </Routes>
    </div>
  );
}`,
      hint: "Open DevTools → Network and click a nav item. Is a document (HTML) request made?",
      fixedCode: `import { useState } from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import Home from "./pages/Home";
import Events from "./pages/Events";

export default function App() {
  const [dark, setDark] = useState(false);
  return (
    <div className={dark ? "bg-dark text-light" : ""}>
      <nav>
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/events">Events</NavLink>
        <button onClick={() => setDark((d) => !d)}>Toggle theme</button>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
      </Routes>
    </div>
  );
}`,
      explanation:
        "Plain `<a href>` tags make the browser request a new HTML document. The whole React tree is destroyed and rebuilt, so `useState(false)` starts again — the theme resets and the page flashes. `Link`/`NavLink` intercept the click and use `history.pushState`, so the App component stays mounted and its state survives.",
    },
    challenge: {
      prompt:
        "Add routing to a small library app: `/` shows Home, `/books` shows BookList, any other path shows NotFound with a link back home. The navbar must highlight the active page with an `active` class, and Home must only be active on exactly `/`.",
      starterCode: `import { BrowserRouter } from "react-router-dom";

function Home() { return <h1>Library</h1>; }
function BookList() { return <h1>Books</h1>; }

export default function App() {
  return (
    <BrowserRouter>
      {/* TODO: navbar with NavLinks */}
      {/* TODO: Routes, including a catch-all */}
    </BrowserRouter>
  );
}`,
      language: "tsx",
      hints: [
        "NavLink's className can be a function receiving `{ isActive }`.",
        "Use the `end` prop on the `/` link.",
        "The catch-all route uses `path=\"*\"`; its page should use `<Link>` (not `<a>`) to go home.",
      ],
      solution: `import { BrowserRouter, Routes, Route, NavLink, Link } from "react-router-dom";

function Home() { return <h1>Library</h1>; }
function BookList() { return <h1>Books</h1>; }

function NotFound() {
  return (
    <section>
      <h1>Page not found</h1>
      <Link to="/">Return home</Link>
    </section>
  );
}

const cls = ({ isActive }: { isActive: boolean }) => (isActive ? "active" : "");

export default function App() {
  return (
    <BrowserRouter>
      <nav>
        <NavLink to="/" end className={cls}>Home</NavLink>
        <NavLink to="/books" className={cls}>Books</NavLink>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/books" element={<BookList />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}`,
      explanation:
        "BrowserRouter supplies context; NavLink gives active styling; `end` stops `/` matching as a prefix of `/books`; the `*` route is ranked last so it only renders when nothing else matches. NotFound uses Link so returning home is a client-side transition.",
    },
    examQuestions: [
      {
        question:
          "**(B1, True/False)** A React application can use React Router to display different page components without requiring a full browser page reload for every navigation.",
        answer:
          "**True.** Link/NavLink/useNavigate change the URL with the History API (`pushState`) and React re-renders the matching route; no new HTML document is requested.",
        marks: 1,
      },
      {
        question:
          "A user bookmarks `https://campus.example/events/42`. Opening it locally (Vite) works, but on the production server it shows a 404 page from the web server. Explain why and how to fix it.",
        answer:
          "Opening a bookmark is a full browser request for `/events/42`. The router only runs **after** `index.html` and the JS bundle load. Vite's dev server falls back to `index.html` automatically; the production server is looking for a real file at that path and finds none. Fix: configure a history-fallback/rewrite so non-asset, non-`/api` paths serve `index.html`; then BrowserRouter reads the URL and renders EventDetails.",
        marks: 3,
      },
      {
        question: "Give two differences between `<Link to=\"/events\">` and `<a href=\"/events\">` in a React SPA.",
        answer:
          "1) Link prevents the default navigation and uses `history.pushState`, so there is no document reload; the anchor makes a full request and restarts the app. 2) Because of that, Link preserves in-memory state (React state, context, stores) while the anchor loses it. (Both render an `<a>` element, so Link remains accessible and supports open-in-new-tab.)",
        marks: 2,
      },
      {
        question: "What is the purpose of `<Route path=\"*\" element={<NotFound />} />`, and what can it NOT detect?",
        answer:
          "It is a catch-all route that renders a not-found page for any URL no other route matches. It cannot detect that a **matched** route refers to a missing record (e.g. `/events/999`); that is a data-level 404 returned by the API and must be handled in the page.",
        marks: 2,
      },
    ],
    revision: [
      "SPA = one HTML document; React Router maps URL → component without reloading.",
      "`BrowserRouter` (context) → `Routes` (pick best match) → `Route path element`.",
      "`Link`/`NavLink` use `history.pushState`; `<a href>` reloads the whole app and loses state.",
      "NavLink gives `isActive`; use `end` on `/`.",
      "`path=\"*\"` = route-not-found; record-not-found is the API's 404.",
      "Refresh/deep link = server request → host must fall back to `index.html` (Week 05 Slide 6).",
      "Routes are ranked by specificity: `/events/new` beats `/events/:id`.",
    ],
    visualizers: ["route-matcher"],
  },

  /* ================================================================== */
  /* 2. router-nested-layouts-outlet                                     */
  /* ================================================================== */
  {
    id: "router-nested-layouts-outlet",
    moduleId: "m06-router",
    title: "Nested Routes, Layouts and <Outlet />",
    summary:
      "Share a navigation shell across pages with layout routes, render the matched child with <Outlet />, and use index routes and multiple layouts.",
    priority: "P0",
    examCritical: true,
    minutes: 35,
    objectives: [
      "Build a layout route whose element renders `<Outlet />` where the matched child page appears.",
      "Use index routes and relative child paths correctly.",
      "Write the full mock D1(a) student-management configuration with a shared layout.",
      "Create different layouts for different route groups (public vs admin) using pathless layout routes.",
    ],
    prerequisites: ["router-basics"],
    sources: [
      w05("Slide 10 — Nested routes and shared layouts (Outlet renders the matched child route); Slide 13 knowledge check"),
      guide("File 14 (AppLayout.tsx with <Outlet />) and File 21 (App.tsx nested under AppLayout)"),
      mock("A6, B11, D1(a), D1(b)"),
      { kind: "supplementary", label: "React Router documentation", url: "https://reactrouter.com/" },
    ],
    why: `Almost every page in an app shares the same frame: navbar, footer, maybe a sidebar. Copy-pasting \`<Navbar />\` and \`<Footer />\` into every page is repetitive, easy to get wrong, and it **remounts** the navbar on every navigation (losing its state, re-running its effects).

Nested routes solve this: a **parent route** renders the shared frame once, and an \`<Outlet />\` placeholder inside it shows whichever **child route** currently matches (Week 05, Slide 10). The navbar stays mounted while only the page area changes. This is exactly what mock questions **A6**, **B11** and **D1** test.`,
    analogy: `A layout route is a **picture frame on the wall**. The frame (navbar + footer) stays hanging; you only swap the photo inside it. \`<Outlet />\` is the **empty space in the frame** where the current photo goes. The router decides which photo (child route) fits the current URL.

Different rooms can have different frames — the public lobby has a glossy frame, the staff office has a plain one. That is "different layouts for different route groups" (mock B11).`,
    explain: {
      beginner: `Imagine your app has a navbar that should appear on **every** page. Instead of putting \`<Navbar />\` inside Home, Students and Settings separately, you create **one Layout component**:

\`\`\`tsx
function Layout() {
  return (
    <>
      <Navbar />
      <main><Outlet /></main>
    </>
  );
}
\`\`\`

Then you **nest** the page routes inside a route that uses this layout:

\`\`\`tsx
<Route path="/" element={<Layout />}>
  <Route index element={<Home />} />
  <Route path="students" element={<StudentList />} />
</Route>
\`\`\`

When the URL is \`/students\`, React Router renders \`Layout\`, and where \`<Outlet />\` sits it puts \`StudentList\`. When the URL is \`/\`, the **index route** (Home) goes into the outlet.

So:

- **Parent route** = the shared frame.
- **Child routes** = the pages.
- **\`<Outlet />\`** = "put the matching child here".
- **index route** = the child shown when the URL is exactly the parent's path.

If you forget \`<Outlet />\`, the layout shows but the page area stays empty — a classic exam trap.`,
      developer: `**Relative child paths.** Inside \`<Route path="/" element={<Layout />}>\`, children are written without a leading slash (\`students\`, \`students/:studentId\`) and are resolved relative to the parent. Absolute child paths are allowed only if they start with the parent's full path.

**Index routes** (\`<Route index element={<Home />} />\`) have no path of their own; they render in the parent's outlet when the URL equals the parent path exactly. An index route cannot have children.

**Pathless layout routes** — \`<Route element={<AppLayout />}>\` with **no path** — add UI without adding a URL segment. The Campus Event guide uses exactly this in File 21: all pages, including \`*\`, are children of a pathless \`AppLayout\`, so even the NotFound page gets the navbar.

**Multiple layouts** (mock B11 → True):

\`\`\`tsx
<Routes>
  <Route element={<PublicLayout />}>
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />
  </Route>
  <Route path="/admin" element={<AdminLayout />}>
    <Route index element={<Dashboard />} />
    <Route path="events" element={<ManageEvents />} />
  </Route>
</Routes>
\`\`\`

**Passing data to children.** \`<Outlet context={value} />\` plus \`useOutletContext<T>()\` in the child lets a layout share data (e.g. the logged-in user) without prop drilling. Layouts can nest further: AdminLayout can itself contain an Outlet inside a sidebar section.`,
      deep: `**Matching produces a branch, rendering walks it.** For \`/students/7\`, React Router matches a **chain** of routes: \`[Layout route "/", child "students/:studentId"]\`. It renders the outermost element and supplies the next match to the nearest \`<Outlet />\` through context. Each Outlet renders "the next element in the matched chain"; with no further match it renders \`null\` (unless an index route exists).

**Why the layout stays mounted.** When navigating from \`/students\` to \`/settings\`, the first element in the chain is the same \`<Layout />\` at the same tree position, so React **reconciles** it rather than remounting it. Only the subtree under the Outlet changes type and is replaced. This is why a layout's state (an open sidebar, a search box) and its effects survive navigation — and why you should not put page-specific effects in the layout.

**Same component, different params.** Navigating \`/students/7 → /students/8\` keeps the *same* child element type, so React reuses the StudentDetails instance — only \`useParams()\` changes. Effects must therefore depend on the param (\`[studentId]\`), or you show stale data. Adding \`key={studentId}\` to force a remount is a deliberate alternative.

**Error and loading boundaries.** In the data-router style (\`createBrowserRouter\`), each route can declare an \`errorElement\` so a crash in a child page renders inside the still-working layout. In the declarative style, wrap the Outlet in your own error boundary.

**Design guidance.** Keep layouts dumb: frame, navigation, maybe auth context. Data fetching belongs in pages/hooks so a layout is not responsible for every child's loading state.`,
    },
    mechanism: `\`\`\`text
URL: /students/7

Route tree                               Matched branch            Rendered tree
──────────                               ──────────────            ─────────────
"/"  element=<Layout/>       ◄──── 1 ──── Layout          ──►  <Layout>
 ├─ index      <Home/>                                           <nav>…</nav>      (stays mounted)
 ├─ "students" <StudentList/>                                    <main>
 ├─ "students/:studentId"    ◄──── 2 ──── StudentDetails  ──►      <Outlet/> ──► <StudentDetails/>
 │            <StudentDetails/>            params {studentId:"7"}  </main>
 ├─ "settings" <Settings/>                                       </Layout>
 └─ "*"        <NotFound/>

Navigate to /settings:  match 1 unchanged  → Layout reconciled (same instance)
                        match 2 changes    → Outlet swaps StudentDetails → Settings
\`\`\`

- The router turns a URL into an ordered list of matches (parent → child).
- Every \`<Outlet />\` renders the *next* match in that list.
- Shared parents are reused between navigations; only the changed part re-mounts.`,
    simpleExample: {
      title: "Mock D1(a)–(c): student-management routes with a shared layout",
      language: "tsx",
      code: `import { BrowserRouter, Routes, Route, NavLink, Outlet, useParams } from "react-router-dom";

function Layout() {
  return (
    <>
      <nav>
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/students">Students</NavLink>
        <NavLink to="/settings">Settings</NavLink>
      </nav>
      <main>
        <Outlet />
      </main>
    </>
  );
}

function Home() { return <h1>Home</h1>; }
function StudentList() { return <h1>Students</h1>; }
function Settings() { return <h1>Settings</h1>; }
function NotFound() { return <h1>Page not found</h1>; }

function StudentDetails() {
  const { studentId } = useParams();
  return <h1>Student ID: {studentId}</h1>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="students" element={<StudentList />} />
          <Route path="students/:studentId" element={<StudentDetails />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}`,
      walkthrough: [
        { lines: "3-16", text: "The shared layout renders the navigation once. `<Outlet />` marks where the matched child page appears (D1b)." },
        { lines: "23-26", text: "D1(c): `useParams()` reads `studentId` from the URL. It is a string (or undefined)." },
        { lines: "32", text: "Parent layout route at `/`. Its children are relative paths." },
        { lines: "33", text: "`index` = the page shown at exactly `/` inside the layout." },
        { lines: "34-37", text: "`/students`, `/students/:studentId`, `/settings` and a catch-all — all wrapped in the same layout." },
      ],
    },
    realExample: {
      title: "CampusEvents: AppLayout plus a separate AdminLayout route group",
      language: "tsx",
      code: `import { Routes, Route, Outlet, NavLink } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import Home from "./pages/Home";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import EventNew from "./pages/EventNew";
import EventEdit from "./pages/EventEdit";
import AdminDashboard from "./pages/admin/AdminDashboard";
import NotFound from "./pages/NotFound";

function AppLayout() {
  return (
    <>
      <Navbar />
      <main className="container py-4">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

function AdminLayout() {
  return (
    <div className="d-flex">
      <aside className="p-3 border-end">
        <NavLink to="/admin" end>Dashboard</NavLink>
        <NavLink to="/admin/events/new">New event</NavLink>
      </aside>
      <section className="flex-grow-1 p-3">
        <Outlet />
      </section>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetails />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="events/new" element={<EventNew />} />
          <Route path="events/:id/edit" element={<EventEdit />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}`,
      walkthrough: [
        { lines: "12-22", text: "AppLayout (guide File 14): Navbar and Footer once; the page renders in the Outlet." },
        { lines: "24-36", text: "AdminLayout adds a sidebar and its own Outlet — a second, nested layout for one route group (mock B11)." },
        { lines: "41", text: "Pathless layout route: adds UI, not a URL segment (exactly as File 21 does)." },
        { lines: "46-50", text: "`/admin/...` pages render inside AdminLayout's Outlet, which itself renders inside AppLayout's Outlet." },
        { lines: "52", text: "The catch-all is inside AppLayout, so even the 404 page keeps the navbar." },
      ],
    },
    mistakes: [
      {
        mistake: "Layout route configured but the layout component has no `<Outlet />` — child pages never appear.",
        fix: "Render `<Outlet />` where the page content belongs.",
      },
      {
        mistake: "Writing child paths with a leading slash that does not include the parent path, e.g. `/settings` under `/admin`.",
        fix: "Use relative child paths (`settings`) or an absolute path that starts with the parent (`/admin/settings`).",
      },
      {
        mistake: "Adding `<Navbar />` to every page component as well as to the layout — duplicated nav.",
        fix: "Shared chrome lives only in the layout; pages render only their own content.",
      },
      {
        mistake: "Giving the home page `path=\"/\"` inside a parent that is also `/`, then wondering about matching.",
        fix: "Use `<Route index element={<Home />} />` for the default child of a layout.",
      },
      {
        mistake: "Fetching page data inside the layout so every child waits for it.",
        fix: "Keep data fetching in the page or its hook; layouts provide structure (and optionally shared context via `useOutletContext`).",
      },
    ],
    debug: {
      prompt:
        "The navbar renders on `/students`, but the student list never appears — the page body is blank. There are no console errors. Fix it.",
      language: "tsx",
      buggyCode: `import { Routes, Route, NavLink } from "react-router-dom";
import StudentList from "./StudentList";

function Layout() {
  return (
    <>
      <nav>
        <NavLink to="/students">Students</NavLink>
      </nav>
      <main></main>
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="students" element={<StudentList />} />
      </Route>
    </Routes>
  );
}`,
      hint: "The route matched correctly. Where is the matched child supposed to be drawn?",
      fixedCode: `import { Routes, Route, NavLink, Outlet } from "react-router-dom";
import StudentList from "./StudentList";

function Layout() {
  return (
    <>
      <nav>
        <NavLink to="/students">Students</NavLink>
      </nav>
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="students" element={<StudentList />} />
      </Route>
    </Routes>
  );
}`,
      explanation:
        "React Router matched both the layout and the `students` child, but a parent route only renders its element. The child element is handed to the nearest `<Outlet />`; with no Outlet there is nowhere to draw it, so nothing appears and no error is thrown.",
    },
    challenge: {
      prompt:
        "Add an account area: `/account` shows AccountOverview and `/account/security` shows SecurityPage, both inside an AccountLayout that has a sub-menu. The whole app is already wrapped in a pathless AppLayout. Keep the NotFound route working for everything else.",
      starterCode: `<Routes>
  <Route element={<AppLayout />}>
    <Route path="/" element={<Home />} />
    {/* TODO: account route group */}
    <Route path="*" element={<NotFound />} />
  </Route>
</Routes>`,
      language: "tsx",
      hints: [
        "AccountLayout needs its own `<Outlet />`.",
        "Use an `index` route for `/account`.",
        "Child paths under `/account` can be relative (`security`).",
      ],
      solution: `import { NavLink, Outlet, Route, Routes } from "react-router-dom";

function AccountLayout() {
  return (
    <div className="row">
      <nav className="col-3">
        <NavLink to="/account" end>Overview</NavLink>
        <NavLink to="/account/security">Security</NavLink>
      </nav>
      <div className="col-9">
        <Outlet />
      </div>
    </div>
  );
}

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/account" element={<AccountLayout />}>
          <Route index element={<AccountOverview />} />
          <Route path="security" element={<SecurityPage />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}`,
      explanation:
        "The URL `/account/security` matches the chain AppLayout → AccountLayout → SecurityPage. AppLayout's Outlet renders AccountLayout; AccountLayout's Outlet renders SecurityPage. The index route fills the inner Outlet at exactly `/account`. `end` on the Overview link stops it being active on `/account/security`.",
    },
    examQuestions: [
      {
        question:
          "**(A6)** Which React Router component allows child routes to render inside a parent layout? A. `<Navigate />` B. `<Outlet />` C. `<Link />` D. `<BrowserRouter />`",
        answer:
          "**B. `<Outlet />`.** It is a placeholder in the parent route's element where the currently matched child route is rendered. Navigate redirects, Link navigates, BrowserRouter supplies routing context.",
        marks: 1,
      },
      {
        question:
          "**(D1a, 4 marks)** Write a React Router configuration for `/`, `/students`, `/students/:studentId` and `/settings` using a shared layout containing a navigation menu.",
        answer: `\`\`\`tsx
<BrowserRouter>
  <Routes>
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="students" element={<StudentList />} />
      <Route path="students/:studentId" element={<StudentDetails />} />
      <Route path="settings" element={<Settings />} />
    </Route>
  </Routes>
</BrowserRouter>
\`\`\`
where \`Layout\` renders a \`<nav>\` with \`<NavLink>\`s and an \`<Outlet />\`. Marks: BrowserRouter/Routes (1), layout parent route (1), all four paths with \`:studentId\` (1), index/relative paths correct + Outlet in layout (1).`,
        marks: 4,
      },
      {
        question: "**(D1b, 2 marks)** Explain the purpose of `<Outlet />` in the shared layout.",
        answer:
          "`<Outlet />` marks where the matched **child** route's element is rendered inside the parent layout. The layout (nav menu) stays mounted while the outlet content changes with the URL, so shared UI is written once and not re-created on each navigation.",
        marks: 2,
      },
      {
        question: "**(B11, True/False)** A React application can use different layouts for different route groups.",
        answer:
          "**True.** Each group gets its own parent layout route (often pathless), e.g. PublicLayout for `/`, `/login` and AdminLayout for `/admin/*`, each with its own `<Outlet />`.",
        marks: 1,
      },
    ],
    revision: [
      "Layout route = parent route whose element renders shared UI + `<Outlet />`.",
      "`<Outlet />` renders the next matched child route (mock A6, D1b).",
      "`index` route = default child at exactly the parent path.",
      "Child paths are relative to the parent (`students`, not `/students` unless absolute & prefixed).",
      "Pathless layout route (`<Route element={<AppLayout/>}>`) adds UI without a URL segment.",
      "Multiple layouts for route groups are normal (mock B11 = True).",
      "Layout stays mounted across child navigations — its state and effects persist.",
    ],
    visualizers: ["outlet-layout", "route-matcher"],
  },

  /* ================================================================== */
  /* 3. router-dynamic-params                                            */
  /* ================================================================== */
  {
    id: "router-dynamic-params",
    moduleId: "m06-router",
    title: "Dynamic Routes and useParams()",
    summary:
      "Capture record identifiers with `:param` segments, read them with useParams(), and convert and validate them because params are always strings.",
    priority: "P0",
    examCritical: true,
    minutes: 30,
    objectives: [
      "Define dynamic segments such as `/events/:id` and `/orders/:orderId`.",
      "Read params with `useParams()` and write the mock C3 expression `const { orderId } = useParams();`.",
      "Convert string params with `Number()` and validate them (`Number.isInteger`, `> 0`) before calling an API.",
      "Distinguish an invalid id, a valid route whose record does not exist (API 404), loading and request failure.",
    ],
    prerequisites: ["router-nested-layouts-outlet", "react-useeffect", "ts-basics-interfaces"],
    sources: [
      w05("Slide 7 (route design: /events/42), Slide 9 (dynamic routes — params are strings, validate/convert), Slide 12 (valid route ≠ valid record)"),
      guide("File 18 (EventEdit: useParams, Number(id), Number.isInteger) and File 19 (EventDetails)"),
      backend("EventsController.cs — GET api/events/{id:int} returns NotFound() when no record"),
      mock("A10, B8, C3, D1(c)"),
      { kind: "supplementary", label: "React Router documentation", url: "https://reactrouter.com/" },
    ],
    why: `An app rarely has a separate page per record. You have **one** EventDetails page that must show event 1, 42 or 9001 depending on the URL. Dynamic segments let one route pattern (\`/events/:id\`) match many URLs, and \`useParams()\` hands the matched value to the component (Week 05, Slide 9).

Getting this right matters because the value comes from the **address bar** — something the user can type anything into. \`/events/abc\`, \`/events/-3\` and \`/events/999999\` are all reachable. A robust page converts and validates the param and handles "record not found" separately from "page not found". Mock **A10**, **B8**, **C3** and **D1(c)** all test this hook.`,
    analogy: `A dynamic route is like a **hotel corridor sign**: "Rooms 100–199 this way". The sign (route pattern \`/rooms/:roomNumber\`) sends every guest down the same corridor; the actual room number on their key card (the URL segment) tells the porter which door to open.

But the key card is just **printed text**. The porter must read "42" as a number, check it is a real room format, and still be ready for the door to open onto an empty room (API 404) — the corridor existing does not guarantee the room does.`,
    explain: {
      beginner: `A **dynamic segment** is a part of the path that starts with a colon:

\`\`\`tsx
<Route path="/events/:id" element={<EventDetails />} />
\`\`\`

This one route matches \`/events/1\`, \`/events/42\`, \`/events/hello\` … anything in that position. The name after the colon (\`id\`) becomes a key you can read inside the page:

\`\`\`tsx
const { id } = useParams();
\`\`\`

For the URL \`/events/42\`, \`id\` is the **string** \`"42"\` — not the number 42. URLs are text, so params are **always strings** (or \`undefined\` if that param is not part of the matched route).

So before using it as a number you convert it:

\`\`\`tsx
const eventId = Number(id);
\`\`\`

and check it is sensible: \`Number.isInteger(eventId) && eventId > 0\`. If not, show "Invalid event ID" instead of sending a silly request.

Remember also: even a perfectly valid id may not exist in the database. \`/events/999\` matches the route, React shows the page, the API answers **404 Not Found** — and your page should say "Event not found", not crash.`,
      developer: `**Typing params.** In React Router 7, \`useParams()\` returns \`Readonly<Partial<Params>>\`, so every value is \`string | undefined\` even if you supply a generic:

\`\`\`tsx
const { orderId } = useParams<{ orderId: string }>(); // orderId: string | undefined
\`\`\`

The generic documents intent; it does not make the value defined. Handle \`undefined\` explicitly.

**Convert + validate** (Campus Event guide, File 18):

\`\`\`tsx
const { id } = useParams<{ id: string }>();
const eventId = Number(id);
const validId = Number.isInteger(eventId) && eventId > 0;
\`\`\`

\`Number(undefined)\` is \`NaN\`, \`Number("abc")\` is \`NaN\`, \`Number("4.5")\` is \`4.5\` — all fail \`Number.isInteger\`. Note \`Number("")\` is \`0\`, which fails \`> 0\`. Avoid \`parseInt\` here: \`parseInt("42abc")\` is \`42\`, silently accepting garbage.

**Effects must depend on the param.** Moving from \`/events/1\` to \`/events/2\` re-renders the **same** component instance. Fetch logic must list the id in its dependency array (\`[eventId]\`) and reset state, as \`useEvent(id)\` does in File 11.

**Hook ordering.** Validate **after** calling all hooks; you may not return early before a hook call (Rules of Hooks). The guide's EventDetails calls \`useEvent(eventId)\` first and then returns "Invalid event ID" — the hook must tolerate an invalid id (or skip the fetch internally).

**Multiple params** work the same: \`/courses/:courseId/modules/:moduleId\` → \`const { courseId, moduleId } = useParams();\`.`,
      deep: `**Ranking and ambiguity.** React Router scores each route: static segments outrank dynamic segments, which outrank splats (\`*\`). That is why \`/events/new\` wins over \`/events/:id\` for the URL \`/events/new\` without any ordering tricks. Without that static route, "new" would be captured as an id and \`Number("new")\` → \`NaN\` — another reason to validate.

**Encoding.** Params are URL-decoded for you: \`/users/J%C3%BCrgen\` gives \`"Jürgen"\`. When **building** URLs from user data, use \`encodeURIComponent\` (or the router's \`generatePath\`) so a slash in a slug does not create an extra segment.

**Four distinct UI outcomes** for a details route (Week 05, Slide 12):

| Situation | Who detects it | UI |
|---|---|---|
| Unknown path \`/evnts/42\` | Router (\`*\`) | Page not found |
| Invalid id \`/events/abc\` | Component validation | Invalid ID message, no request |
| Valid id, no record \`/events/999\` | API → 404 | "Event not found" |
| Network/500 | fetch/response.ok | Error + retry |

The CampusEvents backend uses the route constraint \`{id:int}\`, so \`GET /api/events/abc\` would not even reach the action — the client should not send it in the first place.

**Stale data race.** If the user clicks quickly from event 1 to 2, the response for 1 can arrive **after** the response for 2. Without cancellation (AbortController) or an "active" flag, the page shows event 1 under URL \`/events/2\`. See the AbortController lesson.

**Security note.** A param is user input. Never interpolate it into HTML via \`dangerouslySetInnerHTML\`, and never assume a user is allowed to view record N just because they typed it — the server authorises every request.`,
    },
    mechanism: `\`\`\`text
 URL  /events/42 ─► matcher: "/events/:id" ─► params = { id: "42" }   (string!)
                                                    │
                                    EventDetails    ▼
                         const { id } = useParams()          id: string | undefined
                         const eventId = Number(id)          42 | NaN
                                    │
                 ┌──────────────────┴───────────────────┐
     Number.isInteger(eventId) && eventId > 0 ?          │
           no ─► "Invalid event ID" (no request)        yes
                                                         ▼
                                     GET /api/events/42  (effect deps [eventId])
                                                         │
                        ┌───────────────┬────────────────┴──────────┐
                     200 OK          404 Not Found          network / 5xx
                  render event     "Event not found"       error + retry
\`\`\`

The router guarantees only that the **shape** of the path matched. Type conversion, validity and existence are the component's (and API's) job.`,
    simpleExample: {
      title: "Mock C3 / D1(c): read a param and display it",
      language: "tsx",
      code: `import { useParams } from "react-router-dom";

// Route: <Route path="/orders/:orderId" element={<OrderDetails />} />
export default function OrderDetails() {
  const { orderId } = useParams();

  if (!orderId) {
    return <p>No order selected.</p>;
  }

  return <h1>Order #{orderId}</h1>;
}`,
      walkthrough: [
        { lines: "1", text: "`useParams` is the React Router hook for dynamic route parameters (mock A10, C3)." },
        { lines: "3", text: "The `:orderId` segment in the route defines the key name." },
        { lines: "5", text: "Mock C3 answer: `const { orderId } = useParams();` — destructure the param by name." },
        { lines: "7-9", text: "The value is `string | undefined`; handle the undefined case." },
        { lines: "11", text: "For `/orders/1007` this renders `Order #1007` — the string from the URL." },
      ],
    },
    realExample: {
      title: "CampusEvents EventDetails: convert, validate, fetch, and handle 404",
      language: "tsx",
      code: `import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { Event } from "../types/Event";

const API_BASE_URL = import.meta.env.VITE_API_URL as string;

type LoadState =
  | { status: "loading" }
  | { status: "not-found" }
  | { status: "error"; message: string }
  | { status: "success"; event: Event };

export default function EventDetails() {
  const { id } = useParams<{ id: string }>();
  const eventId = Number(id);
  const validId = Number.isInteger(eventId) && eventId > 0;
  const [state, setState] = useState<LoadState>({ status: "loading" });

  useEffect(() => {
    if (!validId) return;
    const controller = new AbortController();
    setState({ status: "loading" });

    fetch(API_BASE_URL + "/events/" + eventId, { signal: controller.signal })
      .then(async (response) => {
        if (response.status === 404) {
          setState({ status: "not-found" });
          return;
        }
        if (!response.ok) throw new Error("HTTP " + response.status);
        const event = (await response.json()) as Event;
        setState({ status: "success", event });
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setState({ status: "error", message: err instanceof Error ? err.message : "Request failed" });
      });

    return () => controller.abort();
  }, [eventId, validId]);

  if (!validId) return <div className="alert alert-danger">Invalid event ID.</div>;
  if (state.status === "loading") return <p role="status">Loading event...</p>;
  if (state.status === "not-found") return <div className="alert alert-info">Event not found.</div>;
  if (state.status === "error") return <div className="alert alert-danger">{state.message}</div>;

  return (
    <article>
      <h1>{state.event.title}</h1>
      <p>{state.event.location}</p>
      <Link to={\`/events/\${state.event.id}/edit\`}>Edit</Link>
    </article>
  );
}`,
      walkthrough: [
        { lines: "14-16", text: "Read the string param, convert with `Number`, validate as a positive integer (guide File 18 pattern)." },
        { lines: "19-20", text: "All hooks are called unconditionally; the effect itself skips work when the id is invalid." },
        { lines: "24", text: "The request URL is built from the validated number, never from the raw string." },
        { lines: "26-29", text: "404 is a *record-not-found* outcome, distinct from a route-not-found and from a failure." },
        { lines: "34-36", text: "AbortError means we cancelled on purpose (id changed/unmount) — not a user-facing error." },
        { lines: "39", text: "`[eventId, validId]`: changing `/events/1` → `/events/2` re-runs the effect for the new id and aborts the old request." },
        { lines: "42-45", text: "Four distinct UI states rendered before the success view." },
      ],
    },
    mistakes: [
      {
        mistake: "Comparing a param directly with numbers: `events.find(e => e.id === id)` where `id` is `\"42\"`.",
        fix: "Convert first: `const eventId = Number(id)` and compare numbers — `\"42\" === 42` is always false.",
      },
      {
        mistake: "Using `parseInt(id)` and accepting `\"42abc\"` as 42.",
        fix: "Use `Number(id)` + `Number.isInteger(n) && n > 0`, which rejects partial garbage.",
      },
      {
        mistake: "Fetching in `useEffect(..., [])` on a details page, so navigating from event 1 to event 2 keeps showing event 1.",
        fix: "Put the id in the dependency array (`[eventId]`) and reset/abort on change.",
      },
      {
        mistake: "Returning early (`if (!validId) return ...`) **before** calling a hook such as `useEvent`.",
        fix: "Call every hook unconditionally at the top, then branch in the JSX; let the hook ignore invalid ids.",
      },
      {
        mistake: "Treating an API 404 as a crash or showing a blank page.",
        fix: "Map 404 to a friendly 'Event not found' state with a link back to the list.",
      },
    ],
    debug: {
      prompt:
        "EventDetails uses the events already loaded in a parent list to find the selected event, but it always shows 'Event not found' even for ids that exist. Why?",
      language: "tsx",
      buggyCode: `import { useParams } from "react-router-dom";
import type { Event } from "../types/Event";

export default function EventDetails({ events }: { events: Event[] }) {
  const { id } = useParams();
  // TS is silenced with "as never" by a frustrated developer:
  const event = events.find((e) => e.id === (id as never));

  if (!event) return <p>Event not found</p>;
  return <h1>{event.title}</h1>;
}`,
      hint: "What is the type of `e.id`, and what is the type of `id` at runtime?",
      fixedCode: `import { useParams } from "react-router-dom";
import type { Event } from "../types/Event";

export default function EventDetails({ events }: { events: Event[] }) {
  const { id } = useParams<{ id: string }>();
  const eventId = Number(id);

  if (!Number.isInteger(eventId) || eventId <= 0) {
    return <p>Invalid event ID.</p>;
  }

  const event = events.find((e) => e.id === eventId);
  if (!event) return <p>Event not found</p>;
  return <h1>{event.title}</h1>;
}`,
      explanation:
        "Route params are strings. `e.id` is a number, so `42 === \"42\"` is false for every element and `find` returns `undefined`. TypeScript actually warned about the comparison; casting it away hid the real bug. Convert with `Number`, validate, then compare numbers.",
    },
    challenge: {
      prompt:
        "Write a hook `useNumericParam(name)` that reads a route param by name and returns `{ value: number | null, raw: string | undefined }`, where `value` is a positive integer or `null` if missing/invalid. Then use it in a `StudentDetails` page for `/students/:studentId`.",
      starterCode: `import { useParams } from "react-router-dom";

export function useNumericParam(name: string) {
  // TODO
}`,
      language: "tsx",
      hints: [
        "`useParams()` returns an object; index it with `params[name]`.",
        "Reject empty, non-integer, zero and negative values.",
        "Return `null` rather than `NaN` so callers can use a simple null check.",
      ],
      solution: `import { useParams } from "react-router-dom";

export function useNumericParam(name: string): { value: number | null; raw: string | undefined } {
  const params = useParams();
  const raw = params[name];
  if (raw === undefined || raw.trim() === "") return { value: null, raw };
  const n = Number(raw);
  return { value: Number.isInteger(n) && n > 0 ? n : null, raw };
}

export function StudentDetails() {
  const { value: studentId, raw } = useNumericParam("studentId");
  if (studentId === null) {
    return <p role="alert">"{raw ?? ""}" is not a valid student ID.</p>;
  }
  return <h1>Student ID: {studentId}</h1>;
}`,
      explanation:
        "The custom hook centralises conversion and validation so every details page treats params consistently. It is still a hook (it calls `useParams`), so it must be called at the top level of a component. Returning `null` for invalid values makes the calling code's branching explicit.",
    },
    examQuestions: [
      {
        question:
          "**(C3, 3 marks)** A React application uses the route `/orders/:orderId`. Name the React Router Hook that retrieves the route parameter and write the expression used to obtain `orderId`.",
        answer:
          "Hook: **`useParams()`** (from `react-router-dom`). Expression: `const { orderId } = useParams();` For `/orders/1007`, `orderId` is the **string** `\"1007\"` (convert with `Number(orderId)` if a number is needed).",
        marks: 3,
      },
      {
        question:
          "**(A10)** A developer wants to retrieve the identifier from a dynamic route such as `/products/42`. Which hook? A. useNavigate() B. useParams() C. useState() D. useRef()",
        answer: "**B. `useParams()`** — it returns the dynamic segments of the matched route as key/value strings.",
        marks: 1,
      },
      {
        question: "**(B8, True/False)** A dynamic route can use a URL parameter to identify which record should be displayed.",
        answer: "**True.** `/events/:id` lets one EventDetails component display whichever record the `id` segment identifies.",
        marks: 1,
      },
      {
        question:
          "The route `/events/:id` renders EventDetails. Explain why `/events/999` may still show 'not found' even though the route matched, and how the component should handle it.",
        answer:
          "Route matching only checks the URL shape; it has no knowledge of the database. The component fetches `GET /api/events/999`; if no record exists the API returns **404**. The component should check `response.status === 404` (or `!response.ok`) and render a 'record not found' message with a way back, distinct from the router's catch-all page and from a network/500 error.",
        marks: 3,
      },
    ],
    revision: [
      "`:param` in a path = dynamic segment; one route serves many records.",
      "`const { id } = useParams();` — values are `string | undefined` (mock C3).",
      "Convert with `Number()`; validate `Number.isInteger(n) && n > 0`; avoid lax `parseInt`.",
      "Effects that load by id must depend on the id and handle stale responses (abort).",
      "Static segments outrank dynamic ones (`/events/new` vs `/events/:id`).",
      "Valid route ≠ valid record — handle the API's 404 (Week 05 Slide 12).",
      "Params are user input: validate, encode, and let the server authorise.",
    ],
    visualizers: ["route-matcher"],
  },

  /* ================================================================== */
  /* 4. router-navigation                                                */
  /* ================================================================== */
  {
    id: "router-navigation",
    moduleId: "m06-router",
    title: "Navigation: Link, useNavigate, <Navigate> and Location State",
    summary:
      "Choose declarative links for user-chosen destinations and useNavigate() after successful actions; use replace, navigate(-1), <Navigate> and location state correctly.",
    priority: "P0",
    examCritical: true,
    minutes: 30,
    objectives: [
      "Decide between `<Link>` and `useNavigate()` (mock A2, D1d).",
      "Navigate only after an async mutation has succeeded, never before.",
      "Use `replace`, `navigate(-1)` and the `<Navigate>` component appropriately.",
      "Read the current location and pass state between routes with `useLocation()`.",
    ],
    prerequisites: ["router-basics", "js-promises-async"],
    sources: [
      w05("Slide 11 (links vs programmatic navigation), Slide 34 (navigating away before a mutation has succeeded), Slide 36 (mini scenario: 400 but app navigates)"),
      guide("File 17 (EventNew: navigate(`/events/${created.id}`, { replace: true })), File 18 (EventEdit), File 19 (delete then navigate)"),
      mock("A2, D1(d)"),
      { kind: "supplementary", label: "React Router documentation", url: "https://reactrouter.com/" },
    ],
    why: `Some navigation is a **choice** the user makes ("View details", a navbar item) — that is a link. Other navigation is a **consequence** of something finishing ("after the event is saved, show it") — that is programmatic navigation with \`useNavigate()\` (Week 05, Slide 11).

Doing it wrong produces real bugs: navigating **before** the save finishes hides a 400 error from the user and shows stale data (Week 05, Slide 36 scenario); using \`navigate\` instead of a link breaks "open in new tab" and accessibility; forgetting \`replace\` lets Back return to a login page the user has already left. Mock **A2** and **D1(d)** ask exactly which hook to use and how.`,
    analogy: `A **Link** is a signpost: it is always there, the traveller reads it and decides to walk that way. **\`navigate()\`** is a tour guide who, once the ticket is actually stamped, says "right, now we go to the museum". A good guide waits for the stamp; a bad guide walks off while the ticket machine is still printing an error.

\`replace\` is the guide tearing out the previous page of your itinerary so pressing Back does not return you to the ticket queue. \`<Navigate>\` is a permanent "road closed — detour" sign that redirects anyone who arrives.`,
    explain: {
      beginner: `There are two ways to move around a React Router app:

**1. \`<Link>\` — for things the user clicks to go somewhere.**

\`\`\`tsx
<Link to="/events">Events</Link>
\`\`\`

It renders a real link: users can see the URL on hover, open it in a new tab, and screen readers announce it as a link.

**2. \`useNavigate()\` — for moving the user from code, after something happens.**

\`\`\`tsx
const navigate = useNavigate();

async function handleSave() {
  await saveSettings();
  navigate("/settings");
}
\`\`\`

\`useNavigate()\` gives you a \`navigate\` function. You call it in an event handler **after** the work is done — for example after a successful sign-in, go to \`/dashboard\` (mock A2).

Other handy forms:

- \`navigate(-1)\` — go back one step, like the browser's Back button.
- \`navigate("/events", { replace: true })\` — go there but **replace** the current history entry, so Back skips the page you left.

There is also a **component** called \`<Navigate to="/login" />\`. When it renders, it immediately redirects. You use it inside JSX, e.g. "if not logged in, render \`<Navigate to="/login" />\`".`,
      developer: `**Rule of thumb** (Week 05, Slide 11): user chooses a destination → \`<Link>\`/\`<NavLink>\`; code reacts to a completed action → \`navigate()\`.

**Await, check, then navigate.**

\`\`\`tsx
async function handleCreate(dto: EventDto) {
  const created = await eventService.create(dto); // throws on !response.ok
  navigate(\`/events/\${created.id}\`, { replace: true });
}
\`\`\`

This is File 17 of the Campus Event guide. If \`create\` throws, \`navigate\` is never reached and the form shows the error.

**Options.**
- \`replace: true\` — replace the current entry. Use after creating (so Back doesn't resubmit the form view), after login, after delete (the deleted record's page is gone).
- \`state\` — attach non-URL data: \`navigate("/events", { state: { flash: "Event deleted" } })\`. Read it with \`useLocation().state\` (type \`unknown\` — narrow it). It survives refresh within the same history entry but is not shareable in the URL.
- \`navigate(-1)\` / \`navigate(1)\` — history delta. Beware: if the user arrived directly, -1 may leave your app.
- Relative paths: \`navigate("edit")\` resolves against the current route; \`navigate("..")\` goes up one route level.

**\`<Navigate>\` vs \`navigate()\`.** \`<Navigate to replace />\` is for **render-time** redirects (route guards, legacy URL redirects). Never call \`navigate()\` directly in the component body during render — React Router warns; use \`<Navigate>\` or an effect.

**\`useLocation()\`** returns \`{ pathname, search, hash, state, key }\` — useful for analytics, "redirect back to where you were", and reading flash state.`,
      deep: `**History semantics.** \`navigate(to)\` = \`history.pushState\`; \`navigate(to, { replace: true })\` = \`history.replaceState\`; \`navigate(-1)\` = \`history.go(-1)\`, which is asynchronous and fires \`popstate\`. Location \`state\` is stored with the history entry by the browser — it must be **structured-cloneable** (no functions, no class instances you expect to keep their prototype), and it is visible to anyone with devtools, so never put secrets in it.

**Post/Redirect/Get, SPA edition.** Classic server apps redirect after a POST so refresh does not resubmit. SPAs have the same instinct: after a successful create, \`replace\` the "new event" entry with the details entry. Back then goes to the list, not to a blank form.

**Why not navigate first and save in the background?** You lose the ability to show validation errors in context (the form is gone), you may show the list before the server state changes (stale UI), and a failure has nowhere sensible to be displayed. Optimistic navigation is a deliberate pattern that requires rollback and global error toasts — not a default.

**Unmount after navigate.** \`navigate()\` will unmount the current page. Any \`setState\` you call after it (e.g. in a \`finally\` block) targets an unmounting component — harmless in React 18+/19 (no warning) but wasted work; structure handlers so state updates happen on the failure path. If the request is still in flight when the user navigates away manually, abort it.

**Focus and accessibility.** Programmatic navigation does not move focus. After navigating to a new page, consider moving focus to the page \`<h1>\` so screen-reader users know the context changed.

**Testing.** Wrap components in \`<MemoryRouter initialEntries={["/events/new"]}>\` and assert on the rendered route after the mocked service resolves.`,
    },
    mechanism: `\`\`\`text
 user clicks "Save"
        │
        ▼
 handleSubmit ──► setSubmitting(true)
        │
        ▼
 await service.create(dto)  ───────────────┐
        │ resolves (2xx)                    │ throws (400/401/403/500/network)
        ▼                                   ▼
 navigate("/events/57", { replace:true })   setError(message); setSubmitting(false)
        │                                   (stay on the form, user can fix input)
        ▼
 history.replaceState  ─► router re-matches ─► EventDetails renders

 HISTORY STACK                 push                           replace
 [ /events, /events/new ] ─► [/events,/events/new,/events/57]  [/events, /events/57]
                                Back → empty form again ✗       Back → list ✓
\`\`\`

\`navigate\` is a side effect: put it after the awaited success, inside the event handler.`,
    simpleExample: {
      title: "Mock D1(d): save preferences, then navigate programmatically",
      language: "tsx",
      code: `import { useState } from "react";
import { useNavigate } from "react-router-dom";

async function savePreferences(theme: string): Promise<void> {
  localStorage.setItem("theme", theme);
}

export default function PreferencesForm() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState("light");

  async function handleSave() {
    await savePreferences(theme);
    navigate("/settings");
  }

  return (
    <div>
      <select value={theme} onChange={(e) => setTheme(e.target.value)}>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
      <button onClick={handleSave}>Save</button>
    </div>
  );
}`,
      walkthrough: [
        { lines: "2", text: "`useNavigate` is the hook for programmatic navigation (mock A2)." },
        { lines: "9", text: "Call the hook at the top level of the component; it returns the `navigate` function." },
        { lines: "12-15", text: "Inside the event handler: await the save, *then* call `navigate(\"/settings\")` (D1d)." },
        { lines: "24", text: "The button triggers the handler; the user did not choose a URL, the code did — so `navigate`, not `Link`." },
      ],
    },
    realExample: {
      title: "CampusEvents: create → navigate with replace; back button; flash state",
      language: "tsx",
      code: `import { Link, useLocation, useNavigate } from "react-router-dom";
import EventForm from "../components/EventForm";
import { eventService } from "../services/eventService";
import type { EventDto } from "../types/EventDto";

export function EventNew() {
  const navigate = useNavigate();

  async function handleCreate(dto: EventDto) {
    // eventService.create throws ApiError when !response.ok,
    // so the next line only runs after a 201 Created.
    const created = await eventService.create(dto);
    navigate(\`/events/\${created.id}\`, {
      replace: true,
      state: { flash: "Event created" },
    });
  }

  return (
    <section>
      <button type="button" className="btn btn-link" onClick={() => navigate(-1)}>
        ← Back
      </button>
      <h1>Create event</h1>
      <EventForm onSubmit={handleCreate} submitLabel="Create event" />
      <Link to="/events">Cancel</Link>
    </section>
  );
}

export function FlashMessage() {
  const location = useLocation();
  const state = location.state as { flash?: string } | null;
  if (!state?.flash) return null;
  return <div className="alert alert-success" role="status">{state.flash}</div>;
}`,
      walkthrough: [
        { lines: "9-12", text: "The handler awaits the service. If the API returns 400/403, the service throws, the form catches and displays it, and navigation never happens." },
        { lines: "13-16", text: "Only after success: go to the new record. `replace` swaps the `/events/new` history entry so Back doesn't return to the empty form." },
        { lines: "15", text: "`state` carries a one-off flash message that is not part of the URL." },
        { lines: "21", text: "`navigate(-1)` behaves like the browser Back button." },
        { lines: "26", text: "Cancel is a user-chosen destination, so it is a `Link`." },
        { lines: "31-35", text: "`useLocation().state` is `unknown`; narrow it before reading." },
      ],
    },
    mistakes: [
      {
        mistake: "Calling `navigate()` before (or without) awaiting the mutation: `eventService.update(id, dto); navigate(...)`.",
        fix: "`await` the call, let failures throw, and navigate only after success (Week 05 Slide 34).",
      },
      {
        mistake: "Using `<button onClick={() => navigate('/events')}>` for plain navigation links.",
        fix: "Use `<Link to=\"/events\">` — keeps hover URL, new-tab, and correct link semantics.",
      },
      {
        mistake: "Calling `navigate()` directly in the render body (e.g. `if (!user) navigate('/login')`).",
        fix: "Return `<Navigate to=\"/login\" replace />` during render, or navigate inside an effect/event handler.",
      },
      {
        mistake: "Not using `replace` after login/create, so Back returns to the login page or blank form.",
        fix: "`navigate(target, { replace: true })` for post-action redirects.",
      },
      {
        mistake: "Assuming `location.state` exists after a refresh or for a shared link.",
        fix: "Treat it as optional; anything that must survive sharing belongs in the URL (path or search params).",
      },
    ],
    debug: {
      prompt:
        "Admins report: 'I edited an event, clicked Save, got sent to the details page, and my changes weren't there.' The API log shows 400 Bad Request ('End date must be after the start date.'). Fix the handler.",
      language: "tsx",
      buggyCode: `async function handleUpdate(dto: EventDto) {
  eventService.update(eventId, dto).catch((err) => {
    console.error(err);
  });
  navigate(\`/events/\${eventId}\`);
}`,
      hint: "When exactly does `navigate` run relative to the HTTP response? Where does the error go?",
      fixedCode: `async function handleUpdate(dto: EventDto) {
  // Let errors propagate to EventForm, which shows them via setError("root.server", ...)
  await eventService.update(eventId, dto);
  navigate(\`/events/\${eventId}\`);
}`,
      explanation:
        "The promise was not awaited, so `navigate` ran immediately while the PUT was still in flight. The 400 arrived later and was only logged. Awaiting the update means navigation happens only after a successful 204; a failure throws, skips `navigate`, and the reusable form displays the server message so the user can fix the dates — exactly the Week 05 Slide 36 scenario.",
    },
    challenge: {
      prompt:
        "Write a `LoginPage` that, after `await login(email, password)` succeeds, sends the user to the page they originally tried to visit (passed as `location.state.from.pathname` by a route guard) or `/dashboard` if none, without leaving `/login` in the history. On failure, show the error and stay on the page.",
      starterCode: `import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { login } from "../services/authService";

export default function LoginPage() {
  // TODO
}`,
      language: "tsx",
      hints: [
        "`location.state` is `unknown`; cast to `{ from?: { pathname: string } } | null`.",
        "Use `{ replace: true }`.",
        "Wrap the await in try/catch; navigate only in the try branch after the await.",
      ],
      solution: `import { useState, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { login } from "../services/authService";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <p role="alert">{error}</p>}
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit" disabled={submitting}>{submitting ? "Signing in..." : "Sign in"}</button>
    </form>
  );
}`,
      explanation:
        "The redirect target comes from location state set by the guard (`<Navigate to=\"/login\" state={{ from: location }} />`). Navigation happens only after `login` resolves, and `replace` removes `/login` from history so Back does not show the login form to a signed-in user. On failure the user stays put with a message.",
    },
    examQuestions: [
      {
        question:
          "**(A2)** A developer wants to navigate programmatically to `/dashboard` after a user successfully signs in. Which hook? A. useParams() B. useLocation() C. useNavigate() D. useSearchParams()",
        answer:
          "**C. `useNavigate()`** — returns a `navigate` function to call from code (after the sign-in promise resolves). useParams reads path params, useLocation reads the current location, useSearchParams reads the query string.",
        marks: 1,
      },
      {
        question:
          "**(D1d, 2 marks)** Explain how a user could navigate to the settings page programmatically after saving their preferences. Name the hook and describe its use.",
        answer:
          "Use **`useNavigate()`** from react-router-dom: `const navigate = useNavigate();` at the top of the component. In the save handler, `await savePreferences(...)` and, once it succeeds, call `navigate(\"/settings\")` (optionally `{ replace: true }`). Navigation is done in the handler after success, not during render.",
        marks: 2,
      },
      {
        question:
          "A student's edit page calls `eventService.update(id, dto); navigate('/events');` without `await`. The API returns 400. Describe what the user sees and correct the code.",
        answer:
          "The user is taken to the list immediately and sees the **old** data; the 400 error is lost (or appears as an unhandled rejection). Correct: `await eventService.update(id, dto); navigate('/events');` inside try/catch (or let the form catch), so navigation occurs only after a 2xx and the validation message is shown on the form otherwise.",
        marks: 3,
      },
      {
        question: "When would you use the `<Navigate>` component instead of the `navigate()` function?",
        answer:
          "`<Navigate to=... replace />` is rendered as JSX for **render-time** redirects — route guards (not logged in → /login) or redirecting an old URL. `navigate()` is imperative, used inside event handlers/effects after something happens. Calling `navigate()` during render is incorrect.",
        marks: 2,
      },
    ],
    revision: [
      "User chooses destination → `<Link>`/`<NavLink>`; code reacts to success → `navigate()`.",
      "`const navigate = useNavigate();` at top level; call it in handlers (mock A2, D1d).",
      "Always `await` the mutation; navigate only after success (Week 05 Slides 34, 36).",
      "`{ replace: true }` after login/create/delete; `navigate(-1)` = Back.",
      "`<Navigate to replace />` for render-time redirects; never call navigate() during render.",
      "`useLocation()` → pathname, search, state; `state` is `unknown`, optional, not shareable.",
    ],
    visualizers: ["route-matcher"],
  },

  /* ================================================================== */
  /* 5. router-search-params                                             */
  /* ================================================================== */
  {
    id: "router-search-params",
    moduleId: "m06-router",
    title: "Query Strings and useSearchParams()",
    summary:
      "Keep filters, search terms and pagination in the URL query string with useSearchParams(), so views are shareable and survive refresh.",
    priority: "P0",
    examCritical: true,
    minutes: 25,
    objectives: [
      "Explain the difference between path params and query-string (search) params.",
      "Read query values with `searchParams.get()` and handle its `string | null` return type.",
      "Update the query with `setSearchParams` without losing other parameters.",
      "Decide when UI state belongs in the URL rather than in `useState`.",
    ],
    prerequisites: ["router-dynamic-params"],
    sources: [
      w05("Slide 7 — route design: nouns for resources, route parameters for records; 'avoid encoding every UI state into the path'"),
      mock("A18"),
      { kind: "supplementary", label: "MDN — URLSearchParams", url: "https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams" },
      { kind: "supplementary", label: "React Router documentation", url: "https://reactrouter.com/" },
    ],
    why: `Week 05, Slide 7 says: use **path segments** for resources and records, and avoid encoding every UI state into the path. But some UI state *should* still live in the URL: a search term, a category filter, the current page of results, a sort order. If those live only in \`useState\`, refreshing the page resets them and you cannot send a colleague "the list of Music events under £10".

The **query string** (\`?category=music&maxPrice=10\`) is the right home for such optional, combinable view options. React Router exposes it via \`useSearchParams()\` — the hook mock **A18** asks about.`,
    analogy: `The path is the **street address** of a shop: \`/events\`. The query string is the **note you hand the shop assistant**: "only music, under £10, sorted by date". Different notes, same shop. Because the note is written down in the URL, you can photocopy it (share the link), and if you walk out and back in (refresh), you still have it.

\`useState\` filters are more like *telling* the assistant verbally — forget it the moment you leave.`,
    explain: {
      beginner: `A URL can have a **query string** after a \`?\`:

\`\`\`text
/events?category=music&page=2
\`\`\`

It is a list of **key=value** pairs separated by \`&\`. They do not change *which page* you are on (still \`/events\`) — they describe *how* to show it.

React Router gives you a hook to read and change them:

\`\`\`tsx
const [searchParams, setSearchParams] = useSearchParams();
const category = searchParams.get("category"); // "music" or null
\`\`\`

It looks like \`useState\`: a value and a setter. The value is a \`URLSearchParams\` object; \`.get("name")\` returns the text value or **\`null\`** if it is not in the URL.

To change it:

\`\`\`tsx
setSearchParams({ category: "sport" }); // URL becomes /events?category=sport
\`\`\`

Changing search params updates the address bar and re-renders the component — just like setting state — but now the filter is **in the link**: refresh, bookmark and share all keep it.

Remember: values are always **strings**. \`?page=2\` gives \`"2"\`, so convert with \`Number()\` when you need a number.`,
      developer: `**Path vs query.** Path params identify *which resource* (\`/events/42\`), are required by the route pattern and read with \`useParams\`. Query params are *optional modifiers* (filter, sort, page, search), not part of route matching, read with \`useSearchParams\`.

**Reading.**
\`\`\`tsx
const [searchParams, setSearchParams] = useSearchParams();
const q = searchParams.get("q") ?? "";                 // string | null → string
const page = Math.max(1, Number(searchParams.get("page") ?? "1") || 1);
const tags = searchParams.getAll("tag");               // ?tag=a&tag=b → ["a","b"]
\`\`\`

**Updating without wiping other keys.** \`setSearchParams({ category })\` **replaces** the whole query. To change one key, use the functional form:

\`\`\`tsx
setSearchParams((prev) => {
  const next = new URLSearchParams(prev);
  if (value) next.set("category", value); else next.delete("category");
  next.set("page", "1"); // reset paging when the filter changes
  return next;
});
\`\`\`

**History.** Each \`setSearchParams\` call pushes a history entry by default. For text typed into a search box, pass \`{ replace: true }\` as the second argument so Back does not step through every keystroke.

**Fetching.** Derive the request from the params (\`useEffect(..., [category, page])\` or a TanStack Query key \`["events", { category, page }]\`). The URL is now the single source of truth for the filter; don't mirror it into \`useState\`.

**Links.** You can link straight to a filtered view: \`<Link to="/events?category=music">Music</Link>\` or \`<Link to={{ pathname: "/events", search: "?category=music" }}>\`.`,
      deep: `**URLSearchParams semantics.** \`get\` returns the *first* value for a key or \`null\`; \`getAll\` returns all. \`set\` removes duplicates and sets one value; \`append\` adds another. Encoding is automatic: \`set("q", "rock & roll")\` serialises to \`q=rock+%26+roll\`, and \`get\` decodes it back. Keys are case-sensitive.

**Single source of truth.** Copying search params into local state (\`const [cat, setCat] = useState(searchParams.get("category"))\`) creates two sources that drift: Back/Forward changes the URL but not the copied state. Derive from the URL on every render instead. If you need a controlled text input with debounce, keep the *draft* in local state and *commit* to the URL after the debounce.

**Number traps.** \`Number(null)\` is \`0\` and \`Number("")\` is \`0\` — so \`Number(searchParams.get("page"))\` silently yields page 0 when missing. Provide a default *before* converting and clamp: \`Math.max(1, Number(raw ?? "1") || 1)\`. Treat unknown enum values (\`?sort=hack\`) as the default rather than passing them to the API.

**Server interplay.** Query strings are visible in logs, history and Referer headers — never put tokens or personal data in them. On the server side, a filtered list endpoint (\`GET /api/events?categoryId=2\`) should validate the same parameters; the frontend's validation is UX.

**What not to put in the URL.** Ephemeral UI (is a dropdown open?), large objects, and sensitive data. A helpful test: "Would a user expect a shared link to reproduce this?" If yes → URL; if no → component state or a store.

**Scroll and caching.** Changing only the search keeps the same route element mounted — the list component re-renders with new params rather than remounting. With TanStack Query, including params in the query key gives each filter combination its own cache entry, so Back to a previous filter can render instantly from cache.`,
    },
    mechanism: `\`\`\`text
  /events?category=music&page=2
  └──┬──┘ └──────────┬─────────┘
   path         search (query string)
     │                 │
  route match      useSearchParams() → [URLSearchParams, setSearchParams]
  "/events"            │
                       ├─ get("category") → "music"
                       ├─ get("page")     → "2"      (string!)
                       └─ get("sort")     → null     (absent)

  user picks "sport"
     │
     ▼
  setSearchParams(prev => { next=new URLSearchParams(prev);
                            next.set("category","sport"); next.set("page","1"); return next; })
     │
     ▼  history.pushState("/events?category=sport&page=1")
  component re-renders ─► effect deps [category,page] changed ─► GET /api/events?category=sport&page=1
\`\`\``,
    simpleExample: {
      title: "Mock A18: read and write a filter in the query string",
      language: "tsx",
      code: `import { useSearchParams } from "react-router-dom";

export default function ProductFilter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category") ?? "all";

  return (
    <div>
      <p>Showing: {category}</p>
      <button onClick={() => setSearchParams({ category: "books" })}>Books</button>
      <button onClick={() => setSearchParams({ category: "games" })}>Games</button>
      <button onClick={() => setSearchParams({})}>All</button>
    </div>
  );
}`,
      walkthrough: [
        { lines: "4", text: "`useSearchParams()` returns the current query as `URLSearchParams` plus a setter (mock A18)." },
        { lines: "5", text: "`.get()` returns `string | null`; `?? \"all\"` supplies a default when absent." },
        { lines: "10-11", text: "Setting params updates the URL (`?category=books`) and re-renders — refresh keeps the filter." },
        { lines: "12", text: "An empty object clears the query string." },
      ],
    },
    realExample: {
      title: "CampusEvents list with shareable search, category and page filters",
      language: "tsx",
      code: `import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { Event } from "../types/Event";

const API_BASE_URL = import.meta.env.VITE_API_URL as string;
const PAGE_SIZE = 6;

export default function EventsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const category = searchParams.get("category") ?? "";
  const page = Math.max(1, Number(searchParams.get("page") ?? "1") || 1);

  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch(API_BASE_URL + "/events", { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json() as Promise<Event[]>;
      })
      .then(setEvents)
      .catch((e: unknown) => {
        if (!(e instanceof DOMException && e.name === "AbortError")) setError("Could not load events");
      });
    return () => controller.abort();
  }, []);

  function updateParam(key: string, value: string) {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value) next.set(key, value);
        else next.delete(key);
        if (key !== "page") next.set("page", "1");
        return next;
      },
      { replace: key === "q" }
    );
  }

  const filtered = events.filter(
    (e) =>
      e.title.toLowerCase().includes(q.toLowerCase()) &&
      (category === "" || e.categoryName === category)
  );
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <section>
      <input value={q} placeholder="Search" onChange={(e) => updateParam("q", e.target.value)} />
      <select value={category} onChange={(e) => updateParam("category", e.target.value)}>
        <option value="">All categories</option>
        <option value="Technology">Technology</option>
        <option value="Sport">Sport</option>
      </select>
      {error && <p role="alert">{error}</p>}
      <ul>{visible.map((e) => <li key={e.id}>{e.title}</li>)}</ul>
      <button disabled={page === 1} onClick={() => updateParam("page", String(page - 1))}>Prev</button>
      <button disabled={page * PAGE_SIZE >= filtered.length} onClick={() => updateParam("page", String(page + 1))}>Next</button>
    </section>
  );
}`,
      walkthrough: [
        { lines: "10-12", text: "All filter values are *derived* from the URL each render. `page` is defaulted before converting and clamped to ≥ 1." },
        { lines: "17-29", text: "The list is fetched once (the API in this course returns all events); filtering happens client-side." },
        { lines: "31-42", text: "Functional update copies existing params so changing one key keeps the others." },
        { lines: "37", text: "Changing a filter resets paging to page 1; changing `page` itself is left alone." },
        { lines: "40", text: "Typing in the search box uses `replace` so Back does not walk through every keystroke." },
        { lines: "53-54", text: "The inputs are controlled by URL-derived values, so Back/Forward updates them automatically." },
      ],
    },
    mistakes: [
      {
        mistake: "`Number(searchParams.get(\"page\"))` when `page` is absent → `Number(null)` is `0`.",
        fix: "Default before converting and clamp: `Math.max(1, Number(searchParams.get(\"page\") ?? \"1\") || 1)`.",
      },
      {
        mistake: "`setSearchParams({ category })` wipes `q` and `page`.",
        fix: "Use the functional form with `new URLSearchParams(prev)` and `set`/`delete` single keys.",
      },
      {
        mistake: "Copying search params into `useState` and then updating only the state.",
        fix: "Derive from `searchParams` every render; the URL is the single source of truth.",
      },
      {
        mistake: "Putting a record id in the query (`/event?id=42`) when it identifies the resource.",
        fix: "Use a path param for identity (`/events/42`) and query params for optional modifiers.",
      },
      {
        mistake: "Putting tokens or personal data in the query string.",
        fix: "Query strings appear in history, logs and Referer headers — keep secrets out.",
      },
    ],
    debug: {
      prompt:
        "The 'Next' button on page 1 sends the user to an empty page 1 again, and after refresh with no `?page`, the list shows nothing. Find both bugs.",
      language: "tsx",
      buggyCode: `const [searchParams, setSearchParams] = useSearchParams();
const page = Number(searchParams.get("page"));
const visible = items.slice((page - 1) * 10, page * 10);

function next() {
  setSearchParams({ page: page + 1 });
}`,
      hint: "What is `Number(null)`? What type must values passed to `setSearchParams` be?",
      fixedCode: `const [searchParams, setSearchParams] = useSearchParams();
const page = Math.max(1, Number(searchParams.get("page") ?? "1") || 1);
const visible = items.slice((page - 1) * 10, page * 10);

function next() {
  setSearchParams((prev) => {
    const params = new URLSearchParams(prev);
    params.set("page", String(page + 1));
    return params;
  });
}`,
      explanation:
        "With no `page` key, `get` returns `null` and `Number(null)` is `0`, so `slice(-10, 0)` is empty. Default to \"1\" and clamp. Also, search param values are strings — `{ page: page + 1 }` is a type error in TS and, with page 0, produced `?page=1`, which looked like 'nothing happened'. Use `String()` and the functional updater to preserve other keys.",
    },
    challenge: {
      prompt:
        "Write a reusable hook `useQueryParam(key, defaultValue)` returning `[value, setValue]` where `value` is a string (default when absent) and `setValue(v)` updates only that key (removing it when `v` equals the default) and uses `replace: true`.",
      starterCode: `import { useSearchParams } from "react-router-dom";

export function useQueryParam(key: string, defaultValue: string) {
  // TODO
}`,
      language: "ts",
      hints: [
        "Read with `searchParams.get(key) ?? defaultValue`.",
        "Use the functional setter and copy `prev` into a new URLSearchParams.",
        "Return a tuple typed `as const` or with an explicit return type.",
      ],
      solution: `import { useSearchParams } from "react-router-dom";

export function useQueryParam(
  key: string,
  defaultValue: string
): [string, (value: string) => void] {
  const [searchParams, setSearchParams] = useSearchParams();
  const value = searchParams.get(key) ?? defaultValue;

  function setValue(next: string) {
    setSearchParams(
      (prev) => {
        const params = new URLSearchParams(prev);
        if (next === defaultValue || next === "") params.delete(key);
        else params.set(key, next);
        return params;
      },
      { replace: true }
    );
  }

  return [value, setValue];
}

// usage: const [sort, setSort] = useQueryParam("sort", "date");`,
      explanation:
        "The hook keeps the URL as the only source of truth and gives components a `useState`-like API. Removing default values keeps URLs short and canonical (`/events` rather than `/events?sort=date`). `replace` avoids flooding history.",
    },
    examQuestions: [
      {
        question:
          "**(A18)** Which React Hook is commonly used to access URL query-string parameters through React Router? A. useSearchParams() B. useReducer() C. useMemo() D. useCallback()",
        answer:
          "**A. `useSearchParams()`** — returns `[searchParams, setSearchParams]`; read with `searchParams.get(\"key\")`.",
        marks: 1,
      },
      {
        question:
          "An events page stores its category filter in `useState`. Users complain the filter resets on refresh and links shared with friends show all events. Propose a fix and show the key lines of code.",
        answer:
          "Move the filter into the query string. `const [searchParams, setSearchParams] = useSearchParams(); const category = searchParams.get(\"category\") ?? \"\";` and on change `setSearchParams(prev => { const p = new URLSearchParams(prev); p.set(\"category\", value); return p; });`. The URL now encodes the filter, so refresh, bookmarks and shared links reproduce the view.",
        marks: 3,
      },
      {
        question: "Explain the difference between `/events/42` and `/events?id=42` and when each is appropriate.",
        answer:
          "`/events/42` uses a **path parameter** identifying a specific resource, matched by `/events/:id` and read via `useParams`. `/events?id=42` uses a **query parameter**, an optional modifier read via `useSearchParams`, not part of route matching. Use the path for identity (required) and the query for filters, sort, search and paging (optional, combinable).",
        marks: 2,
      },
      {
        question: "What does `searchParams.get(\"page\")` return when the URL is `/events`? Why does this matter?",
        answer:
          "`null`. If converted naively with `Number(null)`, you get `0`, which can produce wrong pagination. Always provide a default and validate (`Number(raw ?? \"1\")`, clamp to ≥ 1).",
        marks: 2,
      },
    ],
    revision: [
      "Query string = optional view modifiers: filter, search, sort, page (mock A18 → `useSearchParams`).",
      "`const [searchParams, setSearchParams] = useSearchParams();`",
      "`get()` → `string | null`; `getAll()` for repeated keys; values are strings.",
      "Functional setter + `new URLSearchParams(prev)` to change one key without wiping others.",
      "`{ replace: true }` for keystroke-level updates.",
      "Derive from the URL each render — don't mirror into useState.",
      "URL filters survive refresh and are shareable; never put secrets in them.",
    ],
    visualizers: ["route-matcher"],
  },

  /* ================================================================== */
  /* 6. router-protected-routes                                          */
  /* ================================================================== */
  {
    id: "router-protected-routes",
    moduleId: "m06-router",
    title: "Protected and Role-Aware Routes",
    summary:
      "Guard routes with a RequireAuth component that redirects to /login (remembering where the user came from), add ADMIN-only routes — and remember guards are UX, the server enforces security.",
    priority: "P0",
    examCritical: true,
    minutes: 35,
    objectives: [
      "Implement a `RequireAuth` layout route using `<Navigate to=\"/login\" replace state={{ from: location }} />` and `<Outlet />`.",
      "Add role-aware routing for ADMIN-only pages and handle an expired JWT.",
      "Redirect the user back to the originally requested page after login.",
      "Explain why frontend route guards are not a security boundary (mock E3).",
    ],
    prerequisites: ["router-navigation", "router-nested-layouts-outlet"],
    sources: [
      w05("Slide 4 (event mutations require the ADMIN role), Slide 24 (never treat browser validation as a security boundary), Slide 29 (ADMIN only)"),
      guide("File 19 note: the backend must still enforce administrator permissions regardless of which buttons are visible"),
      backend("EventsController.cs — [Authorize(Roles = \"ADMIN\")] on POST/PUT/DELETE; Program.cs — JWT bearer with ValidateLifetime = true"),
      postman("Section 15 — no JWT → 401, normal user on admin endpoint → 403"),
      l01("Slide 25 — JWT, cookies and sessions"),
      mock("E1, E2, E3"),
      { kind: "supplementary", label: "Lecture 6 (Auth/JWT) was not supplied — React Router documentation", url: "https://reactrouter.com/" },
      { kind: "best-practice", label: "OWASP — Authorization Cheat Sheet", url: "https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html" },
    ],
    why: `Some pages only make sense for signed-in users (My bookings) or for admins (Create event). Without guards, an anonymous user who types \`/admin/events/new\` sees a form that will fail on submit with 401 — a confusing experience.

A **route guard** checks the auth state before rendering and redirects: anonymous → \`/login\` (then back again after login), wrong role → a "not allowed" page. This is a **user-experience** feature. It is **not** security: anyone can edit the JavaScript in their browser or call the API directly with Postman. The CampusEvents backend protects every mutation with \`[Authorize(Roles = "ADMIN")]\`, returning **401** or **403** regardless of what the UI shows. Mock **E3** asks precisely why hiding pages is not enough.`,
    analogy: `A route guard is the **receptionist** in a building lobby. She politely tells visitors without a badge "please sign in first" and sends them to the sign-in desk, then walks them back to the room they wanted. Very helpful.

But the receptionist is not the **lock** on the server-room door. Someone can climb in through a window (call the API with curl) or forge a paper badge (edit localStorage). The real lock is the server checking the JWT signature and role on **every** request.`,
    explain: {
      beginner: `A **protected route** is a page that should only show if you are logged in. We build a small component that decides:

\`\`\`tsx
function RequireAuth() {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return <Outlet />;
}
\`\`\`

- If there is **no user**, it renders \`<Navigate>\`, which immediately sends the browser to \`/login\`. It also remembers **where you were trying to go** (\`state={{ from: location }}\`).
- If there **is** a user, it renders \`<Outlet />\` — the protected page.

We use it as a **layout route** around the pages that need protection:

\`\`\`tsx
<Route element={<RequireAuth />}>
  <Route path="/my-bookings" element={<MyBookings />} />
</Route>
\`\`\`

After a successful login, the Login page reads \`location.state.from\` and navigates back there.

**Very important:** this only changes what the browser **shows**. It does not stop anyone talking to the API. The API must check the token on every request — and the CampusEvents API does.`,
      developer: `**Guard as a layout route.** Wrapping children with a pathless \`<Route element={<RequireAuth />}>\` protects a whole group with one component, and the guard renders \`<Outlet />\` when allowed.

**Three outcomes**, plus loading:

1. Auth state still loading (e.g. restoring a token from storage) → render a spinner, **not** a redirect, or you will bounce a valid user to /login on refresh.
2. No user / expired token → \`<Navigate to="/login" replace state={{ from: location }} />\`. \`replace\` keeps the protected URL out of history, so Back after login does not loop.
3. Authenticated but missing role → \`<Navigate to="/forbidden" replace />\` (or render a 403 message). This mirrors **401 vs 403** on the server.

**Role-aware guard.** Accept \`roles?: Role[]\` and check \`roles.includes(user.role)\`. CampusEvents roles are \`USER\` and \`ADMIN\` (seeded in Program.cs).

**Expiry (mock E1).** The login response includes \`expiresAt\`; the JWT has an \`exp\` claim. The frontend can use these to treat the session as expired and require re-authentication — but must still handle a **401 from the API** at any time (clock skew, revoked token), by clearing auth state and redirecting to login.

**Return-to.** Login reads \`(location.state as { from?: Location } | null)?.from?.pathname ?? "/"\` and calls \`navigate(from, { replace: true })\` after success. Only redirect to in-app paths (starting with \`/\`) to avoid open-redirect issues if you ever accept a \`?returnTo=\` query parameter.

**Hide vs guard.** Also hide admin-only buttons (Edit/Delete) for non-admins — again UX. The backend decision is final.`,
      deep: `**Where the trust boundary is.** Everything in the browser is under the user's control: the JS bundle, React state, localStorage, the JWT payload (which is only **base64url-encoded**, not encrypted). A user can set \`role: "ADMIN"\` in a store and the guard will happily render the admin page. That is acceptable **only because** every API call from that page is rejected by the server: the ASP.NET Core JWT bearer handler verifies the signature with the server's key and checks \`exp\` (\`ValidateLifetime = true\` in Program.cs), then \`[Authorize(Roles = "ADMIN")]\` checks the role claim. Changing the token payload invalidates the signature → **401**; a valid USER token → **403**.

So the security properties are: confidentiality and integrity of data are enforced server-side; the guard prevents *accidental* access and gives good UX. Never ship sensitive data inside the JS bundle "behind" a guard — it is downloadable by anyone.

**Flash of protected content.** If auth restoration is async and the guard defaults to "allowed", protected UI flashes before redirecting. Default to "unknown" → loading UI.

**Redirect loops.** A guard on \`/login\` itself, or a role check that redirects to a page also protected by that role, loops forever. Keep \`/login\` and \`/forbidden\` outside the guarded group.

**Data routers.** With \`createBrowserRouter\`, guards are often implemented in \`loader\` functions that \`throw redirect("/login")\`, preventing the page's data request from even starting. Declarative guards (this lesson) still let child effects start only after the guard renders \`<Outlet />\`, which is usually fine.

**401 handling centrally.** Put 401 handling in the API layer (e.g. the request helper throws an \`ApiError\` with status 401; an auth provider listens and logs out). This covers tokens that expire *while* the user is on a page — a guard only runs on navigation/render.`,
    },
    mechanism: `\`\`\`text
 Navigate to /admin/events/new
           │
           ▼
 <Route element={<RequireAuth roles={["ADMIN"]} />}>  (layout route)
           │
   isLoading? ──yes──► <p>Checking session…</p>
           │ no
   user && !expired? ──no──► <Navigate to="/login" replace state={{from: location}}/>
           │ yes                         │
   roles ok? ──no──► <Navigate to="/forbidden" replace/>      Login succeeds
           │ yes                         │
       <Outlet/> ─► <EventNew/>          navigate(from.pathname, {replace:true})
           │
           ▼  submit
 POST /api/events  Authorization: Bearer <jwt>
           │
   ┌───────┴──── SERVER (the real gate) ───────────────────────┐
   │ signature valid? exp valid? ──no──► 401 Unauthorized       │
   │ role claim = ADMIN?         ──no──► 403 Forbidden          │
   │ yes ──► 201 Created                                        │
   └────────────────────────────────────────────────────────────┘
\`\`\`

The guard decides **what to render**. The server decides **what is allowed**.`,
    simpleExample: {
      title: "RequireAuth guard and route configuration",
      language: "tsx",
      code: `import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { useAuth } from "./auth/useAuth";

function RequireAuth() {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return <Outlet />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route element={<RequireAuth />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/my-bookings" element={<MyBookings />} />
      </Route>
    </Routes>
  );
}`,
      walkthrough: [
        { lines: "5-6", text: "Read auth state (from context or a store) and the current location." },
        { lines: "8-10", text: "Not signed in → render `<Navigate>` which redirects; `replace` keeps history clean; `state.from` remembers the target." },
        { lines: "11", text: "Signed in → render the protected child route via `<Outlet />`." },
        { lines: "18", text: "`/login` stays outside the guard to avoid a redirect loop." },
        { lines: "19-22", text: "Pathless layout route: every child inside is protected by one guard." },
      ],
    },
    realExample: {
      title: "Role-aware guard with loading and expiry, plus login redirect-back",
      language: "tsx",
      code: `import { Navigate, Outlet, useLocation, useNavigate, type Location } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

type Role = "USER" | "ADMIN";

interface RequireAuthProps {
  roles?: Role[];
}

export function RequireAuth({ roles }: RequireAuthProps) {
  const { user, expiresAt, isRestoring } = useAuth();
  const location = useLocation();

  if (isRestoring) {
    return <p role="status">Checking your session...</p>;
  }

  const expired = expiresAt !== null && new Date(expiresAt).getTime() <= Date.now();
  if (!user || expired) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/forbidden" replace />;
  }

  return <Outlet />;
}

export function useRedirectAfterLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: Location } | null)?.from;
  const target = from && from.pathname.startsWith("/") ? from.pathname + from.search : "/";
  return () => navigate(target, { replace: true });
}

// Routes:
// <Route element={<RequireAuth />}>
//   <Route path="/my-bookings" element={<MyBookings />} />
// </Route>
// <Route element={<RequireAuth roles={["ADMIN"]} />}>
//   <Route path="/events/new" element={<EventNew />} />
//   <Route path="/events/:id/edit" element={<EventEdit />} />
// </Route>`,
      walkthrough: [
        { lines: "4", text: "CampusEvents roles, as seeded in Program.cs." },
        { lines: "14-16", text: "While a stored token is being restored, show loading — redirecting now would bounce a valid user." },
        { lines: "18-21", text: "Missing user or `expiresAt` in the past (from the login response) → re-authenticate (mock E1)." },
        { lines: "23-25", text: "Authenticated but wrong role → forbidden page: the UI equivalent of HTTP 403." },
        { lines: "30-36", text: "After login, go back to the originally requested path (plus query), replacing `/login` in history." },
        { lines: "42-45", text: "Admin-only route group. The API still enforces `[Authorize(Roles = \"ADMIN\")]` on every request." },
      ],
    },
    mistakes: [
      {
        mistake: "Believing the guard secures the data: 'users can't reach /admin, so the API needn't check roles'.",
        fix: "Every protected endpoint must verify the token and role server-side (CampusEvents uses `[Authorize(Roles = \"ADMIN\")]`).",
      },
      {
        mistake: "Redirecting to /login while auth is still being restored, bouncing logged-in users on refresh.",
        fix: "Model an explicit loading/restoring state and render a placeholder until it resolves.",
      },
      {
        mistake: "Omitting `replace` on the redirect, so after login Back returns to the guard and redirects again (loop-like UX).",
        fix: "`<Navigate to=\"/login\" replace state={{ from: location }} />` and `navigate(from, { replace: true })`.",
      },
      {
        mistake: "Putting `/login` inside the guarded group.",
        fix: "Keep public routes (login, register, forbidden) outside the guard.",
      },
      {
        mistake: "Only checking expiry in the guard and ignoring 401 responses from the API.",
        fix: "Handle 401 centrally in the request layer: clear auth state and redirect to login.",
      },
    ],
    debug: {
      prompt:
        "After refreshing the page on `/my-bookings`, a signed-in user is always sent to `/login`, even though their token is still valid in storage. Find the bug.",
      language: "tsx",
      buggyCode: `function RequireAuth() {
  const { user } = useAuth(); // user is null until the provider's effect restores it
  const location = useLocation();
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  return <Outlet />;
}`,
      hint: "What is the auth state on the very first render after a refresh, before the provider's effect runs?",
      fixedCode: `function RequireAuth() {
  const { user, isRestoring } = useAuth(); // isRestoring starts true, false after the restore effect
  const location = useLocation();
  if (isRestoring) return <p role="status">Checking your session...</p>;
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  return <Outlet />;
}`,
      explanation:
        "On refresh, in-memory state is empty. The provider restores the token in an effect, which runs after the first render — but the guard already rendered `<Navigate>` with `user === null`. Distinguish 'unknown yet' from 'not logged in' with a restoring flag (or initialise state synchronously from storage).",
    },
    challenge: {
      prompt:
        "Extend the routes so that `/events/new` and `/events/:id/edit` are ADMIN-only, `/my-bookings` requires any signed-in user, and a non-admin who visits an admin route sees a `Forbidden` page with a link home. Also hide the 'Create event' button on the Events page for non-admins, and write one sentence explaining why the API must still check roles.",
      language: "tsx",
      hints: [
        "Reuse one `RequireAuth` with an optional `roles` prop.",
        "Two pathless guard routes: one without roles, one with `roles={[\"ADMIN\"]}`.",
        "The button visibility uses `user?.role === \"ADMIN\"`.",
      ],
      solution: `import { Link, Route, Routes } from "react-router-dom";
import { RequireAuth } from "./routes/RequireAuth";
import { useAuth } from "./auth/useAuth";

function Forbidden() {
  return (
    <section>
      <h1>403 — Not allowed</h1>
      <p>Your account does not have permission to view this page.</p>
      <Link to="/">Return home</Link>
    </section>
  );
}

export function CreateEventButton() {
  const { user } = useAuth();
  if (user?.role !== "ADMIN") return null; // UX only
  return <Link to="/events/new" className="btn btn-primary">Create event</Link>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/events" element={<Events />} />
      <Route path="/events/:id" element={<EventDetails />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forbidden" element={<Forbidden />} />

      <Route element={<RequireAuth />}>
        <Route path="/my-bookings" element={<MyBookings />} />
      </Route>

      <Route element={<RequireAuth roles={["ADMIN"]} />}>
        <Route path="/events/new" element={<EventNew />} />
        <Route path="/events/:id/edit" element={<EventEdit />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

// Why the API must still check: the guard and the hidden button run in the user's browser,
// which the user controls, so anyone can bypass them (edit JS, call the API with Postman);
// only the server's [Authorize(Roles = "ADMIN")] check on each request actually protects data.`,
      explanation:
        "One guard component handles both authentication (401-like) and authorisation (403-like) outcomes. `/events/new` still outranks `/events/:id` regardless of grouping. Hiding the button is cosmetic; the server's role check is the real control.",
    },
    examQuestions: [
      {
        question:
          "**(E3)** Why should the frontend not rely exclusively on hiding restricted pages as its security mechanism?",
        answer:
          "**B — because users may manipulate client-side code or requests, so access permissions must also be enforced by the server.** All frontend code and state run on the user's machine; guards are UX. The server must verify the token and role on every request (e.g. `[Authorize(Roles = \"ADMIN\")]` → 401/403).",
        marks: 2,
      },
      {
        question:
          "**(E1)** A user signed in, but their JWT has expired when they access a protected page. What should the frontend normally do?",
        answer:
          "**B — handle the expired authentication state and require reauthentication or an appropriate token-renewal flow.** E.g. the guard sees `expiresAt` in the past (or the API returns 401), clears auth state and redirects to `/login` with `state.from`, then returns the user after login.",
        marks: 2,
      },
      {
        question:
          "Write a `RequireAuth` component that redirects unauthenticated users to `/login` and remembers where they were going. Explain `replace` and `state`.",
        answer: `\`\`\`tsx
function RequireAuth() {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  return <Outlet />;
}
\`\`\`
\`replace\` replaces the protected URL in history so Back after login doesn't bounce through the guard again. \`state={{ from: location }}\` passes the attempted location to the Login page, which navigates there after a successful login.`,
        marks: 4,
      },
      {
        question:
          "From the frontend's perspective, how should a route guard's 'not logged in' and 'wrong role' outcomes relate to HTTP 401 and 403?",
        answer:
          "Not logged in / expired ≈ **401**: send the user to log in. Logged in but lacking the role ≈ **403**: re-authenticating won't help — show a 'not allowed' page. The server returns these same codes for API calls, and the frontend should react the same way to them.",
        marks: 2,
      },
    ],
    revision: [
      "Guard = layout route: no user → `<Navigate to=\"/login\" replace state={{ from: location }} />`; else `<Outlet />`.",
      "Handle a restoring/loading state before deciding (no bounce on refresh).",
      "Role-aware: `roles.includes(user.role)` → else forbidden page (UI 403).",
      "Login → `navigate(from, { replace: true })`.",
      "Expired JWT → reauthenticate (mock E1); also handle API 401 centrally.",
      "Guards and hidden buttons are UX; the server enforces security (mock E3).",
      "Keep `/login` and `/forbidden` outside guarded groups.",
    ],
    visualizers: ["route-matcher"],
  },

  /* ================================================================== */
  /* 7. http-methods-status                                              */
  /* ================================================================== */
  {
    id: "http-methods-status",
    moduleId: "m07-http-api",
    title: "REST, HTTP Methods and Status Codes",
    summary:
      "Map CRUD to GET/POST/PUT/PATCH/DELETE, know which methods are safe and idempotent, and decide how the frontend reacts to 200, 201, 204, 400, 401, 403, 404, 409, 422, 429, 500 and 503.",
    priority: "P0",
    examCritical: true,
    minutes: 40,
    objectives: [
      "Describe REST resources and map create/read/update/delete to HTTP methods.",
      "Explain safe and idempotent methods and why POST is neither.",
      "State the meaning of common status codes and the correct frontend reaction for each.",
      "Distinguish 401 from 403 (mock C5) and recognise 204 No Content (mock A13).",
      "Set request headers such as `Content-Type: application/json` and `Authorization: Bearer <token>`.",
    ],
    prerequisites: ["js-promises-async"],
    sources: [
      w03("Slide 5 (what is an API request), Slide 6 (HTTP methods table)"),
      w05("Slide 29 (CRUD maps user intent to HTTP methods), Slide 37 (PUT vs PATCH knowledge check)"),
      l01("Slide 13 (HTTP request-response protocol), Slide 14 (status codes 200/301/403/404/500), Slide 20 (controllers)"),
      backend("EventsController.cs — Ok(), CreatedAtAction() → 201, NoContent() → 204, NotFound() → 404, BadRequest() → 400"),
      postman("Sections 10–15 — expected 201, 204, 400, 401, 403 results"),
      mock("A5, A13, B5, B10, C5, D3(c)"),
      { kind: "supplementary", label: "MDN — HTTP response status codes", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status" },
      { kind: "supplementary", label: "MDN — HTTP request methods", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods" },
    ],
    why: `Every interaction between the React app and the CampusEvents API is an HTTP **request** (method + URL + headers + optional body) answered by a **response** (status code + headers + optional body). The method tells the server *what you intend*; the status code tells you *what happened*.

If the frontend ignores the status code, it will happily render an error object as if it were an event list, keep a user "logged in" with an expired token, or tell an admin "saved!" when the server answered 400. A large slice of the ICT tests exactly this vocabulary: **A5** (401), **A13** (204), **B5** (403), **B10** (PUT for updates), **C5** (401 vs 403), **D3c** (POST vs PUT).`,
    analogy: `HTTP is a **restaurant order slip**. The *method* is the verb on the slip: GET = "bring me the menu", POST = "add a new dish to my order", PUT = "replace my dish with exactly this", PATCH = "same dish but no onions", DELETE = "cancel that dish". The *URL* is which table/dish. *Headers* are notes in the margin ("I'm paying by card", "this note is written in JSON").

The *status code* is the waiter's reply: 200 "here you go", 201 "added to your order", 204 "done, nothing to bring you", 400 "I can't read this slip", 401 "who are you? show your wristband", 403 "I know who you are, but staff-only", 404 "we don't have that dish", 409 "someone just took the last one", 500 "the kitchen is on fire".`,
    explain: {
      beginner: `A **REST API** organises data as **resources** with URLs: \`/api/events\` (the collection) and \`/api/events/42\` (one event). You act on them with **methods** (Week 03, Slide 6):

| Method | Purpose | CampusEvents example |
|---|---|---|
| GET | Read | \`GET /api/events\` |
| POST | Create | \`POST /api/events\` (ADMIN) |
| PUT | Replace / update | \`PUT /api/events/42\` (ADMIN) |
| PATCH | Partial update | \`PATCH /api/bookings/7/status\` |
| DELETE | Remove | \`DELETE /api/events/42\` (ADMIN) |

The server answers with a **status code** — a three-digit number:

- **2xx = success**: 200 OK (here is data), 201 Created (new thing made), 204 No Content (done, no body).
- **4xx = the request had a problem** (client side): 400 bad data, 401 not logged in, 403 not allowed, 404 not found.
- **5xx = the server had a problem**: 500 internal error, 503 temporarily unavailable.

Two you must never mix up:

- **401 Unauthorized** — "I don't know who you are." No token, wrong token or **expired** token. The fix is to **log in**.
- **403 Forbidden** — "I know who you are, but you are not allowed." A normal USER trying to create an event. Logging in again won't help.

Requests also carry **headers** — extra labels. \`Content-Type: application/json\` says "my body is JSON". \`Authorization: Bearer eyJ...\` carries your login token.`,
      developer: `**Safe vs idempotent.** *Safe* = no intended server-side change (GET, HEAD, OPTIONS). *Idempotent* = sending the same request N times has the same effect as once (GET, PUT, DELETE, plus the safe ones). **POST is neither**: two POSTs create two events — which is why you disable the submit button. PATCH is not guaranteed idempotent (e.g. "increment by 1").

**PUT vs PATCH vs POST.** POST to the collection creates a new resource whose id the server assigns (\`201 Created\` + \`Location\` header + body). PUT targets a known URL and sends the full representation (CampusEvents' \`UpdateEventDto\` requires every field). PATCH sends only the changed fields.

**Frontend reaction table:**

| Code | Meaning | Frontend reaction |
|---|---|---|
| 200 | OK with body | parse JSON, render |
| 201 | Created | use returned body/id, navigate to it, refresh list |
| 204 | No Content | success; **don't** call \`response.json()\` |
| 400 | Bad Request (validation) | show message next to form; stay on page |
| 401 | Unauthenticated | clear session, redirect to login |
| 403 | Forbidden | show "not permitted"; do **not** log out |
| 404 | Not found | "record not found" view |
| 409 | Conflict (duplicate, stale version) | explain, offer reload |
| 422 | Unprocessable (semantic validation) | field errors like 400 |
| 429 | Too many requests | back off; honour \`Retry-After\` |
| 500 | Server error | generic message + retry; log |
| 503 | Unavailable | "try again shortly"; retry with backoff |

**Headers you set:** \`Content-Type: application/json\` whenever you send a JSON body; \`Accept: application/json\` (optional); \`Authorization: Bearer <jwt>\` on protected endpoints. Headers you read: \`Content-Type\`, \`Location\` (after 201), \`Retry-After\`.`,
      deep: `**Retries and idempotency.** Automatic retry (TanStack Query retries *queries* 3 times by default) is only safe for idempotent requests. Retrying a timed-out POST can double-book tickets; production APIs solve this with idempotency keys. Retrying 4xx is usually pointless — the same bad request fails again — except 408/429. Retry 5xx/network failures with exponential backoff.

**401 semantics.** Despite the name "Unauthorized", 401 means *unauthenticated*. The server should send \`WWW-Authenticate: Bearer\` — ASP.NET Core's JwtBearer handler does, and it adds \`error="invalid_token"\` and \`error_description="The token expired..."\` when lifetime validation fails. A 403 from \`[Authorize(Roles = "ADMIN")]\` means the token was valid but lacked the role claim.

**ASP.NET Core specifics in CampusEvents.** \`CreatedAtAction(nameof(GetEvent), new { id }, result)\` produces **201** with a \`Location: /api/Events/57\` header and the EventDto body. \`NoContent()\` → **204** for PUT and DELETE. \`BadRequest("End date must be after the start date.")\` returns a **plain string** body (\`text/plain\`), whereas automatic model validation from \`[ApiController]\` returns a **ProblemDetails** JSON object (\`application/problem+json\`) with an \`errors\` dictionary. Your error parser must handle both — which is why the guide's \`getErrorMessage\` checks \`message\`, \`detail\`, \`title\` and \`errors\`.

**4xx vs 5xx responsibility.** 4xx says "the client should change something"; 5xx says "the client did nothing wrong". This matters for UX copy and for monitoring: a spike in 400s often means a frontend validation gap; a spike in 500s is a backend incident.

**Redirects (3xx).** \`fetch\` follows redirects automatically by default (\`redirect: "follow"\`), so you rarely see 301/302 in code; \`response.redirected\` tells you it happened. Lecture 01 Slide 14 lists 301 "Page has moved".

**Caching.** GET responses may be cached by the browser per \`Cache-Control\`; mutations are not. That is one more reason never to use GET for something that changes state.`,
    },
    mechanism: `\`\`\`text
 REQUEST                                         RESPONSE
 ───────────────────────────────────────         ──────────────────────────────────
 POST /api/events HTTP/1.1                        HTTP/1.1 201 Created
 Host: localhost:5229                             Content-Type: application/json
 Content-Type: application/json   ◄ body format   Location: /api/Events/57
 Authorization: Bearer eyJhbGciOi... ◄ identity
                                                  { "id": 57, "title": "Hackathon", ... }
 { "title": "Hackathon", "capacity": 80, ... }

 FRONTEND DECISION TREE ON response.status
   2xx ─┬─ 200 → parse JSON & render
        ├─ 201 → use body (new id), navigate, refresh list
        └─ 204 → success, NO body
   4xx ─┬─ 400/422 → show validation message, stay
        ├─ 401 → session invalid → login
        ├─ 403 → logged in, not permitted → message
        ├─ 404 → not found view
        ├─ 409 → conflict → reload/explain
        └─ 429 → wait (Retry-After) then retry
   5xx ─── 500/503 → generic error + retry/backoff
\`\`\``,
    simpleExample: {
      title: "Translate a status code into a user-facing reaction",
      language: "ts",
      code: `export type Reaction =
  | { kind: "success"; hasBody: boolean }
  | { kind: "login" }
  | { kind: "message"; text: string }
  | { kind: "retry"; text: string };

export function reactTo(status: number): Reaction {
  if (status === 204) return { kind: "success", hasBody: false };
  if (status >= 200 && status < 300) return { kind: "success", hasBody: true };
  switch (status) {
    case 400:
    case 422:
      return { kind: "message", text: "Please check the highlighted fields." };
    case 401:
      return { kind: "login" };
    case 403:
      return { kind: "message", text: "You do not have permission to do this." };
    case 404:
      return { kind: "message", text: "That item could not be found." };
    case 409:
      return { kind: "message", text: "This item was changed elsewhere. Reload and try again." };
    case 429:
      return { kind: "retry", text: "Too many requests. Please wait a moment." };
    default:
      return status >= 500
        ? { kind: "retry", text: "The server had a problem. Try again shortly." }
        : { kind: "message", text: "Request failed (HTTP " + status + ")." };
  }
}`,
      walkthrough: [
        { lines: "1-5", text: "A discriminated union describes every way the UI can react." },
        { lines: "8-9", text: "All 2xx are success; 204 is special because there is no body to parse." },
        { lines: "11-13", text: "400/422: the input was wrong → show messages, keep the form." },
        { lines: "14-15", text: "401: not authenticated → send to login." },
        { lines: "16-17", text: "403: authenticated but not permitted → explain; logging in again won't help." },
        { lines: "22-27", text: "429 and 5xx are worth retrying later; other unknown codes get a generic message." },
      ],
    },
    realExample: {
      title: "CampusEvents request helper reacting to status codes",
      language: "ts",
      code: `const BASE_URL = import.meta.env.VITE_API_URL as string;

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function apiRequest<T>(
  path: string,
  init: { method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"; body?: unknown; token?: string } = {}
): Promise<T | undefined> {
  const headers = new Headers({ Accept: "application/json" });
  if (init.body !== undefined) headers.set("Content-Type", "application/json");
  if (init.token) headers.set("Authorization", "Bearer " + init.token);

  const response = await fetch(BASE_URL + path, {
    method: init.method ?? "GET",
    headers,
    body: init.body !== undefined ? JSON.stringify(init.body) : undefined,
  });

  if (response.status === 204) return undefined;
  if (response.ok) return (await response.json()) as T;

  const text = await response.text();
  switch (response.status) {
    case 401:
      window.dispatchEvent(new Event("auth:expired"));
      throw new ApiError(401, "Your session has expired. Please sign in again.");
    case 403:
      throw new ApiError(403, "You do not have permission to perform this action.");
    case 404:
      throw new ApiError(404, "Not found.");
    case 429: {
      const wait = response.headers.get("Retry-After");
      throw new ApiError(429, "Too many requests" + (wait ? ", retry in " + wait + "s." : "."));
    }
    default:
      throw new ApiError(response.status, text || "Request failed (HTTP " + response.status + ").");
  }
}

// const created = await apiRequest<EventDto>("/events", { method: "POST", body: dto, token });
// await apiRequest<void>("/events/" + id, { method: "DELETE", token });   // 204 → undefined`,
      walkthrough: [
        { lines: "3-8", text: "An error type that keeps the status, so UI code can branch (e.g. 401 vs 403) — the guide's ApiError idea." },
        { lines: "14-16", text: "`Content-Type` only when sending a body; `Authorization: Bearer` only when a token exists." },
        { lines: "24", text: "204 No Content (CampusEvents PUT/DELETE) → success with no body; never parse it." },
        { lines: "25", text: "Other 2xx (200, 201) → parse JSON." },
        { lines: "27", text: "Error bodies may be plain text (`BadRequest(\"...\")`) or ProblemDetails JSON; read text first." },
        { lines: "29-31", text: "401 → broadcast 'session expired' so an auth provider can log out and redirect." },
        { lines: "32-33", text: "403 → permission message; the user stays logged in." },
        { lines: "36-39", text: "429 → surface `Retry-After` so the UI can back off." },
      ],
    },
    mistakes: [
      {
        mistake: "Treating 403 like 401 and logging the user out.",
        fix: "401 = re-authenticate; 403 = authenticated but not allowed → show a message, keep the session.",
      },
      {
        mistake: "Calling `response.json()` on a 204 from PUT/DELETE.",
        fix: "204 has no body; return `undefined`/void (the guide's `request` helper checks for 204).",
      },
      {
        mistake: "Using GET (or a query string) to perform a change, e.g. `GET /api/events/5/delete`.",
        fix: "Use the correct method: `DELETE /api/events/5`. GET must be safe — browsers and caches may repeat it.",
      },
      {
        mistake: "Automatically retrying a failed POST.",
        fix: "POST is not idempotent; retrying can duplicate records. Only auto-retry idempotent requests or 5xx with care.",
      },
      {
        mistake: "Forgetting `Content-Type: application/json` when sending `JSON.stringify(body)`.",
        fix: "Without it the body is sent as text/plain and ASP.NET Core responds 415 Unsupported Media Type.",
      },
    ],
    debug: {
      prompt:
        "A normal USER clicks 'Delete event'. The API answers 403. The app immediately logs them out and sends them to /login, and after logging in again the same thing happens. Fix the handler.",
      language: "ts",
      buggyCode: `async function deleteEvent(id: number, token: string) {
  const response = await fetch(BASE_URL + "/events/" + id, {
    method: "DELETE",
    headers: { Authorization: "Bearer " + token },
  });
  if (response.status === 401 || response.status === 403) {
    logout();
    navigate("/login");
    return;
  }
  if (!response.ok) throw new Error("Delete failed");
}`,
      hint: "Does logging in again change whether a USER is allowed to delete events?",
      fixedCode: `async function deleteEvent(id: number, token: string) {
  const response = await fetch(BASE_URL + "/events/" + id, {
    method: "DELETE",
    headers: { Authorization: "Bearer " + token },
  });
  if (response.status === 401) {
    logout();
    navigate("/login");
    return;
  }
  if (response.status === 403) {
    throw new Error("Only administrators can delete events.");
  }
  if (!response.ok) throw new Error("Delete failed (HTTP " + response.status + ")");
  // 204 No Content → nothing to parse
}`,
      explanation:
        "403 means the server identified the user (token valid) but the role (USER) is not permitted. Re-authenticating produces the same token claims, so the loop repeats. Only 401 should trigger the login flow; 403 should display a permission message.",
    },
    challenge: {
      prompt:
        "For each CampusEvents action, give the HTTP method, URL, expected success status, and whether it is safe/idempotent: list events, view event 3, create event, update event 3, delete event 3, change booking 7's status.",
      language: "text",
      hints: [
        "Look at EventsController attributes: [HttpGet], [HttpPost], [HttpPut(\"{id:int}\")], [HttpDelete].",
        "CreatedAtAction returns 201; NoContent returns 204.",
        "Booking status uses PATCH (Postman guide section 12).",
      ],
      solution: `Action              Method  URL                          Success          Safe  Idempotent
List events         GET     /api/events                  200 + array      yes   yes
View event 3        GET     /api/events/3                200 (404 if none) yes  yes
Create event        POST    /api/events                  201 + EventDto   no    no
Update event 3      PUT     /api/events/3                204 No Content   no    yes
Delete event 3      DELETE  /api/events/3                204 (400 if bookings/reviews) no yes
Booking 7 status    PATCH   /api/bookings/7/status       2xx              no    not guaranteed (here effectively yes)

Mutations require Authorization: Bearer <ADMIN token>; without a token → 401, with a USER token → 403.`,
      explanation:
        "Reading the controller attributes and return helpers tells you exactly what the frontend must expect. Idempotency explains why PUT/DELETE can be retried safely but POST cannot.",
    },
    examQuestions: [
      {
        question:
          "**(C5, 3 marks)** Explain the difference between an HTTP 401 Unauthorized and a 403 Forbidden response from the perspective of a frontend application.",
        answer:
          "**401** = the request is not authenticated: missing, invalid or expired credentials/token. The frontend should treat the session as invalid — clear stored auth and send the user to log in (or refresh the token). **403** = the server knows who the user is (valid token) but they lack permission (e.g. USER calling an ADMIN endpoint). The frontend should show a 'not permitted' message and not log the user out, because logging in again will not change their role.",
        marks: 3,
      },
      {
        question: "**(A13)** What is the purpose of an HTTP 204 No Content response?",
        answer:
          "**A — the request succeeded but there is no response body.** CampusEvents returns 204 for PUT and DELETE; the frontend must not call `response.json()` on it.",
        marks: 1,
      },
      {
        question:
          "**(A5)** Which HTTP status code indicates that a request was understood but the user is not authenticated? A. 201 B. 204 C. 401 D. 500",
        answer: "**C. 401.** 201 = Created, 204 = success without body, 500 = server error.",
        marks: 1,
      },
      {
        question:
          "**(B5, B10)** True/False: (i) A 403 generally indicates the request was understood but the user lacks sufficient permission. (ii) The PUT method can be used by a frontend when updating an existing resource.",
        answer:
          "(i) **True** — 403 Forbidden. (ii) **True** — PUT updates/replaces the resource at a known URL (CampusEvents: `PUT /api/events/{id}` → 204).",
        marks: 2,
      },
      {
        question: "Explain 'idempotent' and state which of GET, POST, PUT and DELETE are idempotent. Why does it matter for a frontend?",
        answer:
          "Idempotent: repeating the same request has the same effect on the server as sending it once. GET, PUT and DELETE are idempotent; POST is not. It matters because retries (automatic or a user double-clicking) are safe for idempotent requests, but a repeated POST can create duplicates — so disable submit buttons and avoid auto-retrying POSTs.",
        marks: 3,
      },
    ],
    revision: [
      "GET read · POST create · PUT replace/update · PATCH partial · DELETE remove.",
      "Safe: GET/HEAD/OPTIONS. Idempotent: those + PUT, DELETE. POST is neither.",
      "200 data · 201 created (+Location, body) · 204 success, no body (don't parse).",
      "400/422 validation → show, stay · 401 → login · 403 → not permitted, keep session · 404 → not found.",
      "409 conflict · 429 back off (Retry-After) · 500/503 server → retry with backoff.",
      "Send `Content-Type: application/json` with JSON bodies; `Authorization: Bearer <jwt>` for protected endpoints.",
      "CampusEvents: POST → 201, PUT/DELETE → 204, DELETE with bookings → 400.",
    ],
    visualizers: ["http-lab"],
  },

  /* ================================================================== */
  /* 8. http-fetch-response-ok                                           */
  /* ================================================================== */
  {
    id: "http-fetch-response-ok",
    moduleId: "m07-http-api",
    title: "fetch(), the Response Object and response.ok",
    summary:
      "fetch resolves for any HTTP response and rejects only on network failure or abort — so always check response.ok/status before calling response.json(), and never parse a 204.",
    priority: "P0",
    examCritical: true,
    minutes: 30,
    objectives: [
      "Describe the two-step fetch flow: `await fetch()` → Response, then `await response.json()` → data.",
      "Explain why fetch does not reject on 404/500 and check `response.ok` (Week 03 Slide 12).",
      "Distinguish network errors (TypeError, AbortError) from HTTP errors.",
      "Handle 204 and non-JSON error bodies safely.",
    ],
    prerequisites: ["js-promises-async", "http-methods-status"],
    sources: [
      w03("Slide 7 (fetch), Slide 9 (Promises), Slide 10 (async/await, response.json()), Slide 11 (Response: ok, status, headers), Slide 12 (fetch only rejects on network failures)"),
      w05("Slide 34 — 'Assuming fetch rejects automatically for HTTP 400 or 500 responses — it usually does not'"),
      guide("File 5 (api.ts: !response.ok → ApiError; 204 handled without parsing JSON)"),
      { kind: "supplementary", label: "MDN — Using the Fetch API", url: "https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch" },
      { kind: "supplementary", label: "MDN — Response", url: "https://developer.mozilla.org/en-US/docs/Web/API/Response" },
    ],
    why: `\`fetch()\` is the browser's built-in way to make HTTP requests (Week 03, Slide 7). It is simple — but it has one behaviour that trips up nearly every beginner: **a 404 or 500 does not throw**. The promise resolves normally with a Response whose \`ok\` is \`false\` (Week 03, Slide 12; Week 05, Slide 34).

If you skip the \`response.ok\` check, your \`try/catch\` never runs, the code calls \`response.json()\` on an error body, and you either crash with a confusing JSON parse error or render \`{ title: "Not Found" }\` as if it were an event. Understanding exactly *when* fetch rejects is the foundation of every loading/error state you build.`,
    analogy: `\`fetch\` is a **courier**. You give them a letter for the API. The courier's promise is only about *delivery*: "I will bring you back whatever reply I get." If the road is closed (no network, CORS block, you cancel the trip), the courier comes back empty-handed — that's a **rejection**.

But if they reach the office and the office replies "No such person (404)" or "We're on fire (500)", the courier has done their job perfectly and hands you that reply — **resolved**. It's *your* job to open the envelope and read the status before you trust the contents.`,
    explain: {
      beginner: `Getting data with fetch takes **two awaits** (Week 03, Slide 10):

\`\`\`ts
const response = await fetch(url);      // 1. wait for the HTTP response
const data = await response.json();     // 2. wait for the body to be read and parsed as JSON
\`\`\`

The first step gives you a **Response object**, not the data. It has useful properties (Slide 11):

- \`response.status\` — the number, e.g. 200, 404, 500.
- \`response.ok\` — \`true\` if status is **200–299**, otherwise \`false\`.
- \`response.headers\` — e.g. \`response.headers.get("Content-Type")\`.

Here's the trap: **fetch only fails (rejects) when the request could not be completed at all** — no internet, server not running, request blocked by CORS, or cancelled. If the server answers with 404 or 500, fetch still **succeeds**. So you must check yourself:

\`\`\`ts
if (!response.ok) {
  throw new Error("Failed to fetch events: " + response.status);
}
\`\`\`

Throwing turns an HTTP error into a rejected promise, so your \`catch\` block and error UI work.

One more rule: a **204 No Content** reply has **no body**. Calling \`response.json()\` on it throws a parse error. For PUT/DELETE in CampusEvents (which return 204) simply don't read the body.`,
      developer: `**Failure taxonomy:**

| What happened | fetch promise | How to detect |
|---|---|---|
| 2xx | resolves | \`response.ok === true\` |
| 4xx / 5xx | resolves | \`response.ok === false\`, inspect \`status\` |
| DNS/offline/server down/CORS blocked | **rejects** \`TypeError\` ("Failed to fetch") | \`catch\` |
| \`controller.abort()\` | **rejects** \`DOMException\` name \`"AbortError"\` | \`err.name === "AbortError"\` |
| Body not valid JSON | \`response.json()\` rejects \`SyntaxError\` | \`catch\` |

**Typed wrapper** (the pattern the Campus Event guide's \`request<T>()\` uses):

\`\`\`ts
async function getJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);
  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new HttpError(response.status, detail || response.statusText);
  }
  return (await response.json()) as T;
}
\`\`\`

\`as T\` is a compile-time assertion only: TypeScript types are erased and do **not** validate the JSON. If the server's DTO changes, TS won't notice (Week 03 Slide 14: "If the C# DTO changes, this interface must change too"). Use Zod for runtime validation where it matters.

**Body is a stream that can be read once.** After \`response.json()\`, calling \`response.text()\` throws "body already used". Use \`response.clone()\` if you need it twice.

**204 / empty bodies:** check \`response.status === 204\` (or read \`text()\` and parse only if non-empty — the guide does both).

**CORS errors are opaque.** The browser deliberately hides details; your code sees only \`TypeError: Failed to fetch\`. The real reason is in the DevTools console.`,
      deep: `**Why fetch was designed this way.** At the transport level, a 404 is a *successful* HTTP exchange: a request was sent, a well-formed response came back. fetch models the network operation, not your application's notion of success. The older \`XMLHttpRequest\` behaved the same (\`onload\` fires for 404). Libraries such as axios choose the opposite default (reject on non-2xx) — knowing both helps when reading other codebases.

**Two promises, two failure points.** \`fetch()\` resolves as soon as the **headers** arrive; the body may still be streaming. \`response.json()\` reads the whole stream and parses it, so it can fail independently (connection dropped mid-body → TypeError; malformed JSON → SyntaxError; aborted → AbortError, because the same signal governs the body read).

**Content negotiation.** Before calling \`json()\`, robust code checks \`response.headers.get("Content-Type")?.includes("application/json")\`. ASP.NET Core returns \`text/plain\` for \`BadRequest("message")\` and \`application/problem+json\` for automatic validation errors. A dev-server proxy misconfiguration often returns **index.html with 200** for an API path — \`response.ok\` is true but \`json()\` throws "Unexpected token '<'". That error message is a strong hint that you hit the wrong URL.

**Status 0 / opaque responses.** With \`mode: "no-cors"\`, you get an opaque response with \`status 0\` and \`ok false\` and cannot read the body — it is not a CORS workaround for reading data.

**Error objects for the UI.** Throw an error class that keeps \`status\` (the guide's \`ApiError\`) so components can render different messages for 401/403/404 without string-parsing. Never surface raw server stack traces to users.

**Timeouts.** fetch has no built-in timeout; combine with \`AbortSignal.timeout(ms)\` (modern browsers) or an AbortController + \`setTimeout\`. A timeout abort rejects with a \`TimeoutError\` DOMException when using \`AbortSignal.timeout\`.`,
    },
    mechanism: `\`\`\`text
 await fetch(url) ─────────────┬─────────────────────────────────────────┐
                               │                                         │
                    network completed?                          no (offline, DNS,
                               │ yes                             CORS blocked, abort)
                               ▼                                         ▼
                   Promise RESOLVES with Response            Promise REJECTS
                   { status, ok, headers, body-stream }      TypeError / AbortError
                               │                                         │
                  response.ok (200–299)?                                 │
                 ┌─────────────┴───────────────┐                         │
               true                          false (404, 500…)           │
                 │                               │                       │
       status === 204 ?                  throw new HttpError(status) ────┤
        yes → no body                                                    ▼
        no  → await response.json()  ──(bad JSON)── SyntaxError ──►  catch (err)
                 │                                                 → error UI
                 ▼
            data → setState
\`\`\``,
    simpleExample: {
      title: "Week 03 Slide 12 pattern: check response.ok",
      language: "ts",
      code: `import type { Event } from "./types/Event";

const url = "http://localhost:5229/api/events";

export async function getEvents(): Promise<Event[]> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch events: " + response.status);
  }

  return (await response.json()) as Event[];
}

async function demo() {
  try {
    const events = await getEvents();
    console.log("Loaded", events.length, "events");
  } catch (err) {
    console.error(err instanceof Error ? err.message : err);
  }
}

void demo();`,
      walkthrough: [
        { lines: "6", text: "Step 1: `await fetch` gives a Response. It resolves for 200 **and** 404/500." },
        { lines: "8-10", text: "Turn HTTP failures into a thrown error so callers' `catch` blocks run (Week 03 Slide 12)." },
        { lines: "12", text: "Step 2: read and parse the body. `as Event[]` is a type assertion — not runtime validation." },
        { lines: "16-21", text: "One `catch` now handles network errors, HTTP errors and JSON parse errors." },
      ],
    },
    realExample: {
      title: "Robust getJson / send helpers: HTTP vs network errors, 204, non-JSON bodies",
      language: "ts",
      code: `export class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "HttpError";
    this.status = status;
  }
}

export class NetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NetworkError";
  }
}

async function send(url: string, init?: RequestInit): Promise<Response> {
  let response: Response;
  try {
    response = await fetch(url, init);
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") throw err;
    throw new NetworkError("Cannot reach the server. Is the API running? (Check CORS in the console.)");
  }

  if (!response.ok) {
    const type = response.headers.get("Content-Type") ?? "";
    let message = "Request failed (HTTP " + response.status + ")";
    if (type.includes("json")) {
      const body = (await response.json().catch(() => null)) as { title?: string; detail?: string } | null;
      message = body?.detail ?? body?.title ?? message;
    } else {
      const text = await response.text();
      if (text) message = text;
    }
    throw new HttpError(response.status, message);
  }
  return response;
}

export async function getJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await send(url, init);
  return (await response.json()) as T;
}

export async function sendNoContent(url: string, init: RequestInit): Promise<void> {
  const response = await send(url, init);
  if (response.status !== 204) {
    await response.text(); // drain any unexpected body; nothing to parse
  }
}

// const events = await getJson<Event[]>(API + "/events");
// await sendNoContent(API + "/events/3", { method: "DELETE", headers: { Authorization: "Bearer " + t } });`,
      walkthrough: [
        { lines: "1-13", text: "Two error classes so the UI can tell 'server said no' (with status) from 'could not reach server'." },
        { lines: "17-22", text: "fetch **rejects** only here: network/CORS failure → NetworkError; abort is re-thrown untouched so callers can ignore it." },
        { lines: "24-35", text: "fetch **resolved** but `ok` is false: read the body according to Content-Type — ProblemDetails JSON or ASP.NET's plain-text BadRequest message." },
        { lines: "39-42", text: "Only successful responses reach `response.json()`." },
        { lines: "44-49", text: "For PUT/DELETE (204 in CampusEvents) we never call `json()`." },
      ],
    },
    mistakes: [
      {
        mistake: "Relying on `try/catch` around `fetch` to catch 404/500.",
        fix: "fetch resolves for HTTP errors. Check `if (!response.ok) throw ...` (Week 03 Slide 12).",
      },
      {
        mistake: "Calling `response.json()` on 204 responses.",
        fix: "Check `response.status === 204` (or empty text) and return nothing.",
      },
      {
        mistake: "Forgetting the second `await`: `const data = response.json();` then `data.map(...)`.",
        fix: "`response.json()` returns a Promise — `await` it.",
      },
      {
        mistake: "Reading the body twice (`await response.json()` after `await response.text()`).",
        fix: "A body can be consumed once. Read text once and `JSON.parse` it, or use `response.clone()`.",
      },
      {
        mistake: "Assuming `as Event[]` validates the server data.",
        fix: "Types are erased at runtime. Keep interfaces in sync with DTOs, and validate with Zod where necessary.",
      },
    ],
    debug: {
      prompt:
        "When the API is stopped, the page shows 'Something went wrong' (good). But when the API returns 500, the page shows an empty list and no error. Why, and how do you fix it?",
      language: "tsx",
      buggyCode: `useEffect(() => {
  async function load() {
    try {
      const response = await fetch(API_BASE_URL + "/events");
      const data = await response.json();
      setEvents(Array.isArray(data) ? data : []);
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }
  void load();
}, []);`,
      hint: "Which of the two failures makes the fetch promise reject?",
      fixedCode: `useEffect(() => {
  async function load() {
    try {
      const response = await fetch(API_BASE_URL + "/events");
      if (!response.ok) {
        throw new Error("Failed to fetch events: " + response.status);
      }
      const data = (await response.json()) as Event[];
      setEvents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }
  void load();
}, []);`,
      explanation:
        "A stopped server is a network failure → fetch rejects → catch runs. A 500 is a completed HTTP exchange → fetch resolves; the ProblemDetails JSON body is parsed, is not an array, and the code silently shows an empty list (which also looks like the 'empty' state). Checking `response.ok` and throwing routes HTTP errors into the same catch.",
    },
    challenge: {
      prompt:
        "Write `async function updateEvent(id: number, dto: EventDto, token: string): Promise<void>` for CampusEvents `PUT /api/events/{id}` (204 on success). It must send JSON with the right headers, throw an Error containing the server's plain-text message for 400, a specific message for 401/403/404, and must not try to parse a body on success.",
      starterCode: `const API = import.meta.env.VITE_API_URL as string;

export async function updateEvent(id: number, dto: EventDto, token: string): Promise<void> {
  // TODO
}`,
      language: "ts",
      hints: [
        "Headers: Content-Type and Authorization.",
        "`if (response.ok) return;` handles 204 without parsing.",
        "ASP.NET's `BadRequest(\"...\")` sends text — use `await response.text()`.",
      ],
      solution: `const API = import.meta.env.VITE_API_URL as string;

export async function updateEvent(id: number, dto: EventDto, token: string): Promise<void> {
  const response = await fetch(API + "/events/" + id, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(dto),
  });

  if (response.ok) return; // 204 No Content — nothing to parse

  switch (response.status) {
    case 401:
      throw new Error("Please sign in again.");
    case 403:
      throw new Error("Only administrators can edit events.");
    case 404:
      throw new Error("This event no longer exists.");
    default: {
      const text = await response.text();
      throw new Error(text || "Update failed (HTTP " + response.status + ").");
    }
  }
}`,
      explanation:
        "Success is detected with `response.ok` and returns immediately, so the empty 204 body is never parsed. Each error status gets an actionable message; 400 surfaces the backend's own validation text (e.g. 'End date must be after the start date.').",
    },
    examQuestions: [
      {
        question:
          "A developer writes `try { const r = await fetch(url); const d = await r.json(); setData(d); } catch { setError('Failed'); }`. The server responds 404. Explain what happens and correct the code.",
        answer:
          "fetch **resolves** for a 404 (it only rejects on network failure or abort), so the catch is not triggered by the status. `r.json()` parses the error body (or throws if it isn't JSON) and the error body may be stored as data. Correct by checking `if (!r.ok) throw new Error('HTTP ' + r.status);` before `r.json()`, so HTTP errors reach the catch and the error UI.",
        marks: 3,
      },
      {
        question: "Name three properties of the Response object and what each tells you.",
        answer:
          "`status` — the numeric HTTP status (e.g. 201); `ok` — true when status is 200–299; `headers` — response headers, e.g. `headers.get('Content-Type')`. (Also `statusText`, `redirected`, body methods `json()`, `text()`.)",
        marks: 3,
      },
      {
        question: "Why should you not call `response.json()` after a successful `DELETE /api/events/5` in CampusEvents?",
        answer:
          "The endpoint returns **204 No Content** — there is no body. `response.json()` would reject with a JSON parse error, turning a successful delete into a reported failure. Check `response.ok`/`status === 204` and return without parsing.",
        marks: 2,
      },
      {
        question: "List two situations in which the fetch promise rejects.",
        answer:
          "1) Network failure — server unreachable, offline, DNS failure, or a CORS block (TypeError 'Failed to fetch'). 2) The request is aborted via an AbortController signal (DOMException 'AbortError'). HTTP error statuses do NOT cause rejection.",
        marks: 2,
      },
    ],
    revision: [
      "`await fetch()` → Response; `await response.json()` → data (two awaits).",
      "fetch rejects ONLY on network failure/CORS block/abort — not on 404/500 (Week 03 Slide 12).",
      "`response.ok` = status 200–299; check it and throw before parsing.",
      "204 → no body → don't call `json()`.",
      "Body readable once; error bodies may be text or ProblemDetails JSON.",
      "`as T` doesn't validate runtime data.",
      "'Unexpected token <' usually means you received HTML (wrong URL/proxy).",
    ],
    visualizers: ["http-lab"],
  },

  /* ================================================================== */
  /* 9. http-four-ui-states                                              */
  /* ================================================================== */
  {
    id: "http-four-ui-states",
    moduleId: "m07-http-api",
    title: "The Four UI States: Loading, Success, Error, Empty",
    summary:
      "Design every API-driven view for loading, success, error and empty (plus idle) — and never confuse 'No events' with a failure.",
    priority: "P0",
    examCritical: true,
    minutes: 25,
    objectives: [
      "Name and render the four UI states from Week 03 Slide 22, plus idle for user-triggered requests.",
      "Explain why a successful empty response is not an error.",
      "Model request state with a discriminated union so impossible combinations cannot occur.",
      "Distinguish first load (isPending) from background refetching (isFetching) as a TanStack Query preview.",
    ],
    prerequisites: ["http-fetch-response-ok", "react-useeffect", "react-state-events"],
    sources: [
      w03("Slide 21 (where does the data go — state), Slide 22 (the four UI states: loading, success, error, empty), Slide 27 (custom hook returns { events, loading, error })"),
      w05("Slide 33 (request states: idle, loading, success, error — don't show a blank screen), Slide 22 (forms communicate progress and outcome)"),
      guide("File 16 (Events.tsx handles loading, error and empty), File 8 (useEvents)"),
      mock("D2(b) — display loading, error and result"),
      { kind: "supplementary", label: "TanStack Query — Queries guide", url: "https://tanstack.com/query/latest/docs/framework/react/guides/queries" },
    ],
    why: `Network requests take time and can fail. A component that only codes the happy path shows a **blank screen** while waiting, a blank screen when it fails, and a blank screen when there is genuinely no data — the user cannot tell which (Week 05, Slide 33: "don't show a blank screen").

Week 03, Slide 22 states the rule: *every API-driven component has four states — design for all four.* In particular, **"Loading..." and "No events found" are different states, and a successful response with zero rows is not an error.** Mock **D2(b)** awards marks specifically for showing a loading message, an error message and the successful result.`,
    analogy: `Think of a **restaurant pager**. While it's silent you are *waiting* (loading). When it buzzes you collect your food (*success*). If the kitchen calls you over to say they've run out of ingredients, that's an *error*. And if you ordered "today's specials" and there simply aren't any today, that's *empty* — nothing went wrong, there's just nothing to serve.

Before you've even ordered, the pager is in your hand doing nothing — that's *idle*. A good restaurant tells you which of these is happening; a bad one leaves you staring at a dark pager.`,
    explain: {
      beginner: `When a component loads data from an API it is always in one of these states (Week 03, Slide 22):

1. **Loading** — the request has started and we're waiting. Show "Loading events..." or a spinner.
2. **Success** — data arrived and there is at least one item. Show the list.
3. **Error** — the request failed (network down, 500, 401…). Show a clear message, ideally with a "Try again" button.
4. **Empty** — the request **succeeded** but returned an empty array \`[]\`. Show "No events are currently available."

The empty state is the one people forget. It is **not an error**: the server worked fine, there just isn't anything yet. Showing a red "Error!" for an empty list confuses users and hides real errors.

For requests the **user** starts — like submitting a form — there is a fifth state: **idle** (nothing has happened yet; Week 05, Slide 33).

In code you usually keep three pieces of state:

\`\`\`tsx
const [events, setEvents] = useState<Event[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
\`\`\`

and check them in order: loading → error → empty → success. Notice \`loading\` starts as **true** — otherwise the very first render would show "No events" before the request even started.`,
      developer: `**Render order matters:**

\`\`\`tsx
if (loading) return <p role="status">Loading events...</p>;
if (error) return <div className="alert alert-danger" role="alert">{error}</div>;
if (events.length === 0) return <div className="alert alert-info">No events are currently available.</div>;
return <EventGrid events={events} />;
\`\`\`

This is the Campus Event guide's Events.tsx (File 16).

**Discriminated union instead of three booleans.** Separate flags allow impossible combinations (\`loading && error\`, stale \`events\` alongside an error). A single union makes them unrepresentable:

\`\`\`ts
type RequestState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; data: T };
\`\`\`

Empty is then *derived*: \`status === "success" && data.length === 0\`. TypeScript narrows \`data\` only inside the success branch, so you cannot accidentally read it while loading.

**Accessibility.** Use \`role="status"\` (polite live region) for loading messages and \`role="alert"\` for errors so screen-reader users are informed. Keep layout stable (skeletons) to avoid content jumping.

**Mutation states.** Forms need idle → submitting → success | error. Disable the submit button while submitting and keep the user's input on error.

**TanStack Query preview.** \`useQuery\` gives you \`status: 'pending' | 'error' | 'success'\`, plus \`isPending\` (no data yet), \`isFetching\` (any request in flight, including background refetches) and \`isLoading\` (= \`isPending && isFetching\`). With cached data, a refetch shows the old list with a small "Updating…" indicator instead of a full-page spinner.`,
      deep: `**Initial state is a design decision.** \`useState(false)\` for loading creates a one-frame "empty" flash: React renders, commits "No events", then the effect runs and sets loading. Initialising \`loading\` to \`true\` (or status \`"loading"\`) when the component fetches on mount avoids it. For user-triggered requests, start in \`"idle"\`.

**Resetting on parameter change.** When a details page goes from id 1 to id 2, the hook must reset to loading (and clear the old record and error) — the guide's \`useEvent\` does \`setLoading(true); setError(null); setEvent(null);\` at the top of the effect. Otherwise you show event 1's data under event 2's URL, or a stale error.

**Error vs empty vs not-found.** For collections: success with [] = empty. For single resources: 404 is usually a dedicated "not found" state rather than a generic error, because the remedy differs (go back to list vs retry).

**Stale-while-revalidate.** Libraries keep \`data\` from the previous success while a new request runs. Your UI then has *two* orthogonal dimensions: "do I have data?" and "am I fetching?". A background refetch error with existing data is often best shown as a toast while keeping the list visible, not by replacing the page with an error. This is why TanStack Query separates \`isPending\` from \`isFetching\`.

**Perceived performance.** Showing a spinner for very fast responses causes flicker; delaying the indicator ~200 ms, or using skeletons sized like the content, improves perceived speed. React 19's \`useTransition\`/Suspense patterns let you keep old UI visible during transitions.

**Testing the states.** Each state should be testable by mocking the service: resolved non-empty, resolved \`[]\`, rejected, and never-resolving (loading). If any of these renders nothing, you have a blank-screen bug.`,
    },
    mechanism: `\`\`\`text
               mount (fetch on load)          user action (submit)
                      │                               │
                      ▼                               ▼
                 ┌─────────┐                    ┌──────────┐
                 │ LOADING │◄──── retry ────┐   │   IDLE   │
                 └────┬────┘                │   └────┬─────┘
          ┌───────────┼────────────┐        │        │ submit
     reject/!ok    2xx []       2xx [..]    │        ▼
          ▼           ▼            ▼        │   SUBMITTING ─► success | error
     ┌───────┐   ┌───────┐   ┌─────────┐    │
     │ ERROR │   │ EMPTY │   │ SUCCESS │    │
     └───┬───┘   └───────┘   └─────────┘    │
         └────────── "Try again" ───────────┘

 EMPTY is a SUCCESS with zero rows — not an error (Week 03 Slide 22).
\`\`\``,
    simpleExample: {
      title: "Events page rendering all four states",
      language: "tsx",
      code: `import { useEvents } from "../hooks/useEvents";
import EventCard from "../components/EventCard";

export default function Events() {
  const { events, loading, error } = useEvents();

  if (loading) {
    return <p role="status">Loading events...</p>;
  }

  if (error) {
    return <div className="alert alert-danger" role="alert">{error}</div>;
  }

  if (events.length === 0) {
    return <div className="alert alert-info">No events are currently available.</div>;
  }

  return (
    <div className="row g-4">
      {events.map((event) => (
        <div className="col-md-4" key={event.id}>
          <EventCard event={event} />
        </div>
      ))}
    </div>
  );
}`,
      walkthrough: [
        { lines: "5", text: "The hook exposes the stable contract `{ events, loading, error }` (Week 03 Slide 27)." },
        { lines: "7-9", text: "Loading first. `role=\"status\"` announces it to assistive technology." },
        { lines: "11-13", text: "Error next, with `role=\"alert\"`." },
        { lines: "15-17", text: "Empty: the request succeeded with `[]` — an informative message, not an error." },
        { lines: "19-27", text: "Success: render the cards." },
      ],
    },
    realExample: {
      title: "Discriminated-union request state with retry and background refresh",
      language: "tsx",
      code: `import { useCallback, useEffect, useState } from "react";
import type { Event } from "../types/Event";
import { eventService } from "../services/eventService";

type RequestState<T> =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; data: T; refreshing: boolean };

export function useEventList() {
  const [state, setState] = useState<RequestState<Event[]>>({ status: "loading" });
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    setState((prev) =>
      prev.status === "success" ? { ...prev, refreshing: true } : { status: "loading" }
    );
    eventService
      .list()
      .then((data) => {
        if (active) setState({ status: "success", data, refreshing: false });
      })
      .catch((err: unknown) => {
        if (active) setState({ status: "error", message: err instanceof Error ? err.message : "Failed to load events." });
      });
    return () => {
      active = false;
    };
  }, [reloadKey]);

  const reload = useCallback(() => setReloadKey((k) => k + 1), []);
  return { state, reload };
}

export default function EventsPage() {
  const { state, reload } = useEventList();

  switch (state.status) {
    case "loading":
      return <p role="status">Loading events...</p>;
    case "error":
      return (
        <div role="alert" className="alert alert-danger">
          {state.message} <button onClick={reload}>Try again</button>
        </div>
      );
    case "success":
      if (state.data.length === 0) {
        return <p className="alert alert-info">No events yet. Check back soon.</p>;
      }
      return (
        <section aria-busy={state.refreshing}>
          {state.refreshing && <small role="status">Updating…</small>}
          <ul>{state.data.map((e) => <li key={e.id}>{e.title}</li>)}</ul>
          <button onClick={reload}>Refresh</button>
        </section>
      );
  }
}`,
      walkthrough: [
        { lines: "5-8", text: "One union: impossible states (loading *and* error) cannot be represented. `data` only exists on success." },
        { lines: "16-18", text: "If we already have data, keep showing it and flag `refreshing` (background fetch) instead of a full spinner." },
        { lines: "15, 21, 24, 27-29", text: "The `active` flag ignores results after unmount or a newer reload (same idea as the guide's useEvents)." },
        { lines: "32", text: "`reload` bumps a key in the dependency array to re-run the effect." },
        { lines: "38-46", text: "Exhaustive `switch` on status; TypeScript narrows `state` in each branch." },
        { lines: "48-50", text: "Empty is derived from success — not an error." },
      ],
    },
    mistakes: [
      {
        mistake: "Initialising `loading` to `false`, so the first render flashes 'No events found'.",
        fix: "Start with `loading = true` (or status `'loading'`) for fetch-on-mount components.",
      },
      {
        mistake: "Showing an error message when the API returns `[]`.",
        fix: "Empty is a successful outcome — render an informative empty state.",
      },
      {
        mistake: "Checking `events.length === 0` before `loading`/`error`, so failures display as 'No events'.",
        fix: "Order the checks: loading → error → empty → success.",
      },
      {
        mistake: "Not resetting state when a dependency (id) changes, showing stale data/errors.",
        fix: "Set loading and clear previous data/error at the start of the effect.",
      },
      {
        mistake: "Replacing a populated list with a full-page spinner on every refresh.",
        fix: "Keep existing data visible and show a small 'Updating…' indicator (isFetching vs isPending).",
      },
    ],
    debug: {
      prompt:
        "Users see 'No events are currently available' for a split second every time they open the page — and when the API is down, they see it permanently. Fix both.",
      language: "tsx",
      buggyCode: `export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getEvents()
      .then(setEvents)
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;
  if (events.length === 0) return <p>No events are currently available.</p>;
  return <EventList events={events} />;
}`,
      hint: "What does the first render show before the effect runs? And what does the catch turn an error into?",
      fixedCode: `export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getEvents()
      .then(setEvents)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Failed to load events."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p role="status">Loading...</p>;
  if (error) return <p role="alert">{error}</p>;
  if (events.length === 0) return <p>No events are currently available.</p>;
  return <EventList events={events} />;
}`,
      explanation:
        "Effects run after the first commit, so with `loading = false` the first paint is the empty state. Start with `true`. The catch converted failures into an empty array, collapsing the error state into the empty state — users were told there were no events when the server was actually unreachable. Keep a separate error state.",
    },
    challenge: {
      prompt:
        "Write a generic `<AsyncView<T>>` component that takes `state: RequestState<T[]>`, `renderItem`, `emptyMessage` and `onRetry`, and renders the right UI for loading, error (with retry), empty and success.",
      starterCode: `type RequestState<T> =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; data: T };

// TODO: AsyncView`,
      language: "tsx",
      hints: [
        "Generic components: `function AsyncView<T>(props: Props<T>)`.",
        "Use a switch on `state.status`.",
        "`renderItem` should return a ReactNode; let the caller supply keys via a `getKey` prop.",
      ],
      solution: `import type { ReactNode } from "react";

type RequestState<T> =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; data: T };

interface AsyncViewProps<T> {
  state: RequestState<T[]>;
  renderItem: (item: T) => ReactNode;
  getKey: (item: T) => string | number;
  emptyMessage: string;
  onRetry: () => void;
}

export function AsyncView<T>({ state, renderItem, getKey, emptyMessage, onRetry }: AsyncViewProps<T>) {
  switch (state.status) {
    case "loading":
      return <p role="status">Loading...</p>;
    case "error":
      return (
        <div role="alert">
          <p>{state.message}</p>
          <button type="button" onClick={onRetry}>Try again</button>
        </div>
      );
    case "success":
      if (state.data.length === 0) return <p>{emptyMessage}</p>;
      return (
        <ul>
          {state.data.map((item) => (
            <li key={getKey(item)}>{renderItem(item)}</li>
          ))}
        </ul>
      );
  }
}`,
      explanation:
        "Centralising the four-state rendering guarantees no page forgets a state. The union type forces the success branch before `data` can be read, and empty is derived from a successful result.",
    },
    examQuestions: [
      {
        question:
          "Week 03 states that 'Loading...' and 'No events found' are different states. Explain the difference and why showing an error for an empty list is wrong.",
        answer:
          "Loading means the request is still in progress — we don't know the result yet. 'No events found' (empty) means the request **completed successfully** and returned zero items. An empty result is valid data, not a failure; showing an error would mislead the user and make real failures indistinguishable from 'nothing yet'.",
        marks: 3,
      },
      {
        question: "List the four UI states of an API-driven component and give an example UI for each.",
        answer:
          "Loading — spinner/'Loading events...'; Success — the list of EventCards; Error — red alert with message and 'Try again'; Empty — 'No events are currently available' info box. (Plus idle for user-triggered requests such as forms.)",
        marks: 4,
      },
      {
        question:
          "Why is a discriminated union (`{status:'loading'} | {status:'error',message} | {status:'success',data}`) often better than three separate state variables?",
        answer:
          "Separate booleans allow impossible combinations (loading and error at once, stale data with an error). The union makes exactly one state possible at a time, and TypeScript narrows the type so `data` can only be accessed in the success branch, preventing bugs.",
        marks: 2,
      },
    ],
    revision: [
      "Four states: loading, success, error, empty (Week 03 Slide 22) — plus idle for user actions (Week 05 Slide 33).",
      "Empty = successful response with zero rows — NOT an error.",
      "Render order: loading → error → empty → success.",
      "Start `loading = true` for fetch-on-mount to avoid an empty flash.",
      "Reset loading/data/error when parameters change.",
      "Discriminated unions prevent impossible states.",
      "TanStack preview: isPending = no data yet; isFetching = request in flight (incl. background).",
    ],
  },

  /* ================================================================== */
  /* 10. http-abortcontroller                                            */
  /* ================================================================== */
  {
    id: "http-abortcontroller",
    moduleId: "m07-http-api",
    title: "AbortController, Cleanup and Race Conditions",
    summary:
      "Cancel in-flight fetches in useEffect cleanup, ignore AbortError, prevent out-of-order responses when params change, and write the full mock D2(b) CourseList answer.",
    priority: "P0",
    examCritical: true,
    minutes: 35,
    objectives: [
      "Create an AbortController per effect run, pass its `signal` to fetch, and abort in the cleanup function.",
      "Recognise and ignore `AbortError` so cancellation does not show as a user-facing error.",
      "Explain the race condition when params change and how aborting (or an `active` flag) prevents stale data.",
      "Write a complete component meeting mock D2(b): loading, error, count, no state updates after unmount.",
    ],
    prerequisites: ["http-fetch-response-ok", "http-four-ui-states", "react-useeffect"],
    sources: [
      w03("Slide 8 (synchronous vs asynchronous), Slide 23–25 (useEffect, dependency array, effect callback cannot be async), Slide 26 (complete flow)"),
      guide("Files 8–10 (useEvents/useEvent/useCategories use an `active` flag in the cleanup to avoid state updates after unmount)"),
      mock("D2(a), D2(b)"),
      { kind: "supplementary", label: "MDN — AbortController", url: "https://developer.mozilla.org/en-US/docs/Web/API/AbortController" },
      { kind: "supplementary", label: "react.dev — useEffect (fetching data, cleanup)", url: "https://react.dev/reference/react/useEffect" },
    ],
    why: `A request started by an effect can outlive the reason it was started. The user navigates away (component unmounts) or changes the id (\`/events/1\` → \`/events/2\`) while the first request is still travelling. Without cleanup:

- the old response may arrive **after** the new one and overwrite it — a **race condition** that shows event 1 on event 2's page;
- you update state for a component that no longer exists;
- you waste bandwidth on responses nobody will see.

\`AbortController\` lets you cancel the fetch in the effect's **cleanup** function. Mock **D2** explicitly requires "avoid updating component state after the component has been unmounted" and suggests \`useEffect\`, \`useState\` and \`AbortController\`.`,
    analogy: `You phone a takeaway and order a pizza (start fetch). Then you change your mind and order a curry instead (params change). If you don't **cancel the pizza order**, two drivers set off; the pizza driver might even arrive *after* the curry, and you end up eating the wrong dinner (stale data wins the race).

\`AbortController\` is the "cancel order" button. The \`signal\` is the order reference you gave the takeaway so they know which order to cancel. The cleanup function is the habit of always pressing "cancel" on your old order before placing a new one.`,
    explain: {
      beginner: `An effect can return a **cleanup function**. React calls it when the component unmounts **and** before re-running the effect with new dependencies:

\`\`\`tsx
useEffect(() => {
  // start something
  return () => {
    // stop it
  };
}, [id]);
\`\`\`

For fetch, "stop it" means **abort the request**:

\`\`\`tsx
useEffect(() => {
  const controller = new AbortController();
  fetch(url, { signal: controller.signal })
    .then(...)
    .catch(...);
  return () => controller.abort();
}, [url]);
\`\`\`

1. Create a new \`AbortController\` each time the effect runs.
2. Pass \`controller.signal\` to \`fetch\`.
3. In the cleanup, call \`controller.abort()\`.

When aborted, the fetch promise **rejects** with an error whose \`name\` is \`"AbortError"\`. That isn't a real problem — *we* cancelled it — so the catch block should **ignore** it instead of showing "Something went wrong".

Why we can't write \`useEffect(async () => ...)\`: an async function always returns a Promise, but React expects the effect to return nothing or a cleanup function (Week 03, Slide 25). So we define an async function **inside** the effect and call it.`,
      developer: `**Canonical pattern:**

\`\`\`tsx
useEffect(() => {
  const controller = new AbortController();
  async function load() {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(API + "/events/" + id, { signal: controller.signal });
      if (!res.ok) throw new Error("HTTP " + res.status);
      setEvent((await res.json()) as Event);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }
  void load();
  return () => controller.abort();
}, [id]);
\`\`\`

**Why the race happens.** Effect for id=1 starts request A; id becomes 2; cleanup aborts A; effect for id=2 starts B. Without the abort, A and B are both in flight, and network timing — not your code — decides which \`setEvent\` runs last.

**\`active\` flag alternative.** The Campus Event guide uses \`let active = true; … return () => { active = false; }\` and checks \`if (active)\` before each setState. That prevents stale updates but **doesn't cancel the network request**. AbortController does both; combining the abort with \`signal.aborted\` checks is the most complete solution.

**Abort covers the body read.** If abort happens after headers arrived, \`res.json()\` rejects with AbortError too — the same catch handles it.

**StrictMode.** In development React 19 runs mount → cleanup → mount for every effect. You'll see the first request as **(canceled)** in the Network tab. That's the cleanup working, not a bug — and proves your effect is resilient.

**Services.** Let service functions accept an optional \`signal\`: \`getEvent(id, { signal })\`. TanStack Query passes a \`signal\` to your \`queryFn\` and aborts automatically when a query becomes unused.`,
      deep: `**Ordering guarantees.** React guarantees cleanup of the previous effect runs **before** the next effect for the same component. So with abort-in-cleanup, at most one request per effect instance is "live" at any moment, and any late-settling old promise rejects with AbortError instead of resolving. The \`signal.aborted\` check in \`finally\` stops the aborted run from flipping \`loading\` to false while the *new* run is loading.

**Which errors are aborts?** In browsers, fetch rejects with a \`DOMException\` named \`"AbortError"\`. If you call \`controller.abort(reason)\` with a custom reason, fetch rejects with **that reason** instead — so checking \`controller.signal.aborted\` is the most robust test. \`AbortSignal.timeout(ms)\` rejects with a \`"TimeoutError"\` DOMException, which you probably *do* want to show. \`AbortSignal.any([a, b])\` combines a component-lifetime signal with a timeout.

**Server-side effect.** Aborting stops the browser waiting and closes the connection, but the server may already have processed the request. For GETs that's harmless. Do **not** rely on abort to "undo" a POST — the event may still be created. That's why mutations are triggered by explicit user actions, not by effects.

**Is setState after unmount harmful?** React 18 removed the warning; updates to unmounted components are simply ignored. The real problems are wasted work and *races between mounted states*, which is what D2's requirement is really testing.

**Debounced search.** Typing "rea" → "reac" → "react" fires three requests; aborting the previous on each change ensures results for "react" are not overwritten by slower results for "rea". Add a debounce (setTimeout cleared in the cleanup) to avoid the requests altogether.

**Memory/closure note.** Each effect run closes over its own \`controller\`; that's why the controller must be created *inside* the effect. A controller stored in a ref and reused will be aborted forever after the first abort — an AbortController cannot be "un-aborted".`,
    },
    mechanism: `\`\`\`text
 time ─────────────────────────────────────────────────────────────────►
 id=1  effect#1: ctrl1, fetch A(signal1) ───────────────(slow)──────────── X aborted → AbortError (ignored)
 id=2        cleanup#1: ctrl1.abort()
             effect#2: ctrl2, fetch B(signal2) ───(fast)──► 200 → setEvent(event 2) ✓
 unmount                                        cleanup#2: ctrl2.abort()  (if still pending)

 WITHOUT ABORT:
 fetch A ───────────────────────────────────────► 200 → setEvent(event 1)   ✗ overwrites!
 fetch B ─────────────────► 200 → setEvent(event 2)
 URL shows /events/2 but the page shows event 1  (race condition)
\`\`\``,
    simpleExample: {
      title: "Mock D2(b): CourseList with loading, error, count and abort on unmount",
      language: "tsx",
      code: `import { useEffect, useState } from "react";

interface Course {
  id: number;
  title: string;
}

export default function CourseList() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadCourses() {
      try {
        const response = await fetch("https://example.com/api/courses", {
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error("Request failed with status " + response.status);
        }
        const data = (await response.json()) as Course[];
        setCourses(data);
      } catch (err) {
        if (controller.signal.aborted) return;
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    void loadCourses();

    return () => controller.abort();
  }, []);

  if (loading) return <p>Loading courses...</p>;
  if (error) return <p role="alert">Error: {error}</p>;
  return <p>{courses.length} courses available</p>;
}`,
      walkthrough: [
        { lines: "9-11", text: "State for data, loading (starts true — request begins on mount) and error." },
        { lines: "13", text: "Empty dependency array: retrieve the data when the component loads." },
        { lines: "14", text: "A fresh AbortController for this effect run." },
        { lines: "16", text: "The effect callback can't be async, so we define an async function inside (Week 03 Slide 25)." },
        { lines: "18-20", text: "Pass `signal` so the request can be cancelled." },
        { lines: "21-23", text: "fetch doesn't reject on HTTP errors — check `response.ok`." },
        { lines: "27", text: "If we aborted (unmount), do nothing — no error shown, no state update after unmount." },
        { lines: "30", text: "Only clear loading for a run that wasn't cancelled." },
        { lines: "36", text: "Cleanup: abort the request when the component unmounts (D2 requirement)." },
        { lines: "39-41", text: "Loading message, error message, and the number of courses on success." },
      ],
    },
    realExample: {
      title: "useEvent(id): abort on id change to prevent out-of-order responses",
      language: "ts",
      code: `import { useEffect, useState } from "react";
import type { Event } from "../types/Event";

const API_BASE_URL = import.meta.env.VITE_API_URL as string;

export async function getEvent(id: number, signal?: AbortSignal): Promise<Event> {
  const response = await fetch(API_BASE_URL + "/events/" + id, { signal });
  if (!response.ok) throw new Error(response.status === 404 ? "Event not found." : "HTTP " + response.status);
  return (await response.json()) as Event;
}

export function useEvent(id: number) {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!Number.isInteger(id) || id <= 0) {
      setLoading(false);
      setError("Invalid event ID.");
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    setError(null);
    setEvent(null);

    getEvent(id, controller.signal)
      .then((data) => setEvent(data))
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        setError(err instanceof Error ? err.message : "Failed to load event.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [id]);

  return { event, loading, error };
}`,
      walkthrough: [
        { lines: "6-10", text: "The service accepts an optional `signal`, keeping cancellation in the caller's control." },
        { lines: "18-22", text: "Invalid ids never hit the network." },
        { lines: "25-27", text: "Reset to a clean loading state for the new id (as the guide's useEvent does)." },
        { lines: "31-33", text: "Aborted runs are silent; real failures become the error state." },
        { lines: "39", text: "Cleanup runs before the next effect when `id` changes: the old request is cancelled, so its response can never overwrite the new one." },
        { lines: "40", text: "`[id]` re-runs the effect for each new id." },
      ],
    },
    mistakes: [
      {
        mistake: "Writing `useEffect(async () => { ... }, [])`.",
        fix: "Effects must return nothing or a cleanup function. Define an async function inside and call it (Week 03 Slide 25).",
      },
      {
        mistake: "Creating the AbortController outside the effect (or in a ref) and reusing it.",
        fix: "Create a new controller in every effect run; an aborted controller stays aborted.",
      },
      {
        mistake: "Showing 'Error: The user aborted a request' after navigating away or in StrictMode dev.",
        fix: "Ignore aborts: `if (controller.signal.aborted) return;` or check `err.name === \"AbortError\"`.",
      },
      {
        mistake: "Omitting the id from the dependency array, so changing `/events/1` → `/events/2` never refetches.",
        fix: "List every value the effect uses (`[id]`); abort the previous request in cleanup.",
      },
      {
        mistake: "Using abort to 'cancel' a POST and assuming nothing was saved.",
        fix: "Abort only stops the client waiting; the server may have completed the mutation. Trigger mutations from user actions, not effects.",
      },
    ],
    debug: {
      prompt:
        "On the event details page, clicking quickly between 'Previous' and 'Next' sometimes shows the wrong event for the URL. Occasionally the page shows 'Error: signal is aborted without reason' after leaving it. Fix both.",
      language: "tsx",
      buggyCode: `useEffect(() => {
  fetch(API + "/events/" + id)
    .then((r) => r.json())
    .then((data: Event) => setEvent(data))
    .catch((e: Error) => setError(e.message));
}, [id]);`,
      hint: "What happens to request #1 when id changes to 2 and request #2 finishes first? (The second symptom appears after someone 'fixed' the first by adding abort without handling it.)",
      fixedCode: `useEffect(() => {
  const controller = new AbortController();
  fetch(API + "/events/" + id, { signal: controller.signal })
    .then((r) => {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.json() as Promise<Event>;
    })
    .then((data) => setEvent(data))
    .catch((e: unknown) => {
      if (controller.signal.aborted) return;
      setError(e instanceof Error ? e.message : "Request failed");
    });
  return () => controller.abort();
}, [id]);`,
      explanation:
        "Without cancellation, two requests race and whichever resolves last calls setEvent — sometimes the old one. Aborting in cleanup cancels the stale request before the new effect starts. The aborted fetch then rejects; checking `signal.aborted` keeps that intentional cancellation from being shown as an error. Also check `r.ok`, which the original omitted.",
    },
    challenge: {
      prompt:
        "Build a `useDebouncedSearch(term)` hook for `GET /api/events?search=term` that waits 300 ms after typing stops, cancels the previous request when the term changes, returns `{ results, loading, error }`, and returns an empty list without a request when the term is blank.",
      language: "ts",
      hints: [
        "Use one effect with `[term]`; inside, `setTimeout` for the debounce.",
        "Cleanup must both `clearTimeout` and `controller.abort()`.",
        "Use `encodeURIComponent(term)` when building the URL.",
      ],
      solution: `import { useEffect, useState } from "react";
import type { Event } from "../types/Event";

const API = import.meta.env.VITE_API_URL as string;

export function useDebouncedSearch(term: string) {
  const [results, setResults] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = term.trim();
    if (q === "") {
      setResults([]);
      setLoading(false);
      setError(null);
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(API + "/events?search=" + encodeURIComponent(q), { signal: controller.signal });
        if (!res.ok) throw new Error("HTTP " + res.status);
        setResults((await res.json()) as Event[]);
        setError(null);
      } catch (err) {
        if (controller.signal.aborted) return;
        setError(err instanceof Error ? err.message : "Search failed");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [term]);

  return { results, loading, error };
}`,
      explanation:
        "Each keystroke re-runs the effect; the cleanup clears the pending timer (so most keystrokes never send a request) and aborts any request still in flight (so a slow response for an old term can't overwrite newer results).",
    },
    examQuestions: [
      {
        question:
          "**(D2a, 2 marks)** Explain why an asynchronous operation is needed when communicating with an external API.",
        answer:
          "Network requests take an unpredictable amount of time. JavaScript in the browser runs on a single main thread; a synchronous (blocking) call would freeze rendering and user interaction until the server replied. Asynchronous code (Promises/async-await with fetch) starts the request and lets the UI continue (e.g. show a loading message), then processes the response when it arrives.",
        marks: 2,
      },
      {
        question:
          "**(D2b, 6 marks)** Write a React component that retrieves courses from `https://example.com/api/courses` on load, shows a loading message, an error message on failure, the number of courses on success, and avoids updating state after unmount.",
        answer: `\`\`\`tsx
function CourseList() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const res = await fetch("https://example.com/api/courses", { signal: controller.signal });
        if (!res.ok) throw new Error("Status " + res.status);
        setCourses(await res.json());
      } catch (err) {
        if (controller.signal.aborted) return;
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    void load();
    return () => controller.abort();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  return <p>{courses.length} courses</p>;
}
\`\`\`
Marks: state (1), useEffect with [] (1), fetch + response.ok (1), loading/error/count UI (1), AbortController signal + cleanup (1), ignoring abort / no update after unmount (1).`,
        marks: 6,
      },
      {
        question:
          "A details page fetches `/api/events/{id}` in an effect with `[id]`. Explain the race condition that can occur when the user changes id quickly and how AbortController prevents it.",
        answer:
          "Two requests (for the old and the new id) can be in flight; responses can arrive out of order, so the old response may call setState last and the page shows the wrong event for the URL. With an AbortController created per effect run and `controller.abort()` in the cleanup, React aborts the old request before starting the new effect; the old fetch rejects with AbortError (ignored), so only the latest response updates state.",
        marks: 3,
      },
    ],
    revision: [
      "New `AbortController` per effect run → `fetch(url, { signal })` → `return () => controller.abort()`.",
      "Cleanup runs on unmount AND before the effect re-runs with new deps.",
      "Aborted fetch rejects (AbortError) — ignore it (`signal.aborted`).",
      "Race condition: out-of-order responses overwrite newer data; abort or `active` flag fixes it.",
      "Effect callbacks can't be async — define and call an inner async function.",
      "StrictMode dev: mount→cleanup→mount shows one cancelled request — expected.",
      "Abort doesn't undo server-side mutations.",
    ],
    visualizers: ["abort-race"],
  },

  /* ================================================================== */
  /* 11. http-service-modules                                            */
  /* ================================================================== */
  {
    id: "http-service-modules",
    moduleId: "m07-http-api",
    title: "API Service Modules: Service → Hook → Component",
    summary:
      "Centralise URLs, fetch, response.ok checks and errors in typed service modules configured by VITE_API_URL, wrap them in hooks, and keep components focused on rendering.",
    priority: "P0",
    examCritical: true,
    minutes: 30,
    objectives: [
      "Explain the benefits of a dedicated API service module (mock A19, D2c).",
      "Configure the base URL with `import.meta.env.VITE_API_URL` and understand Vite env rules.",
      "Write typed service functions with centralised error handling.",
      "Describe the Service → Hook → Component layering and what each layer knows.",
    ],
    prerequisites: ["http-fetch-response-ok", "ts-basics-interfaces", "react-useeffect"],
    sources: [
      w03("Slide 16 (API logic vs UI logic), Slide 17 (services/eventService.ts), Slide 18 (separation of responsibilities), Slide 27–29 (custom hooks; Service → Hook → Component)"),
      w05("Slide 15–16 (pages/components/services/types structure), Slide 17 (trace the data flow), Slide 19 (service module reads VITE_API_URL), Slide 34 (hard-coding API URLs in multiple components)"),
      guide("Section 3 (.env VITE_API_URL; VITE_ variables are exposed), File 5 (api.ts request<T> + ApiError), File 6 (eventService), Files 8–10 (hooks)"),
      mock("A19, D2(c)"),
      { kind: "supplementary", label: "Vite — Env Variables and Modes", url: "https://vite.dev/guide/env-and-mode" },
    ],
    why: `If every component calls \`fetch("http://localhost:5229/api/events")\` itself, then the URL, headers, \`response.ok\` checks, 204 handling and error messages are copy-pasted everywhere. Changing the port, adding an \`Authorization\` header, or fixing one error-handling bug means editing ten files (Week 05, Slide 34: "Hard-coding API URLs in multiple components instead of centralising configuration").

A **service module** puts all "how do I talk to the API" knowledge in one place (Week 03, Slides 16–18). A **custom hook** wraps the React state around it, and the **component** just renders (Slide 28). Mock **A19** (main benefit: separates data-access logic from presentation) and **D2(c)** (why a service helps when several components use the same endpoint) test this directly.`,
    analogy: `A service module is the **embassy** for a foreign country (the API). Citizens (components) don't need to know the language, the paperwork or the office address — they just go to the embassy desk and ask "I'd like the list of events, please". If the foreign office moves, or starts requiring a new stamp (auth header), only the embassy updates its procedures.

The hook is the **personal assistant** who goes to the embassy for you, waits in the queue (loading), and reports back "here it is" or "they refused" (error). The component is you, who only decides how to present the result.`,
    explain: {
      beginner: `Week 03 splits API code into three layers (Slide 28):

| Layer | File | Knows about |
|---|---|---|
| **Service** | \`eventService.ts\` | URLs, fetch, \`response.ok\`, JSON, API errors |
| **Hook** | \`useEvents.ts\` | React state: \`useState\`, \`useEffect\`, loading, error |
| **Component** | \`Events.tsx\` | JSX, layout, EventCard |

The **service** is just a module of functions:

\`\`\`ts
const API_BASE_URL = import.meta.env.VITE_API_URL;

export async function getEvents(): Promise<Event[]> {
  const response = await fetch(API_BASE_URL + "/events");
  if (!response.ok) throw new Error("Could not load events");
  return response.json();
}
\`\`\`

The component doesn't need to know how the API works; it simply asks (Slide 17): \`const data = await getEvents();\` — or, better, uses a hook: \`const { events, loading, error } = useEvents();\`.

The base URL comes from a **\`.env\`** file in the project root:

\`\`\`text
VITE_API_URL=http://localhost:5229/api
\`\`\`

Vite only exposes variables that start with **\`VITE_\`**, and you must **restart** the dev server after editing \`.env\`. Anything with \`VITE_\` is bundled into the JavaScript the browser downloads — so never put secrets there (Campus Event guide, Section 3).

Benefits: one place to change the URL, one place to fix bugs, consistent error messages, smaller components, and easy testing (you can mock the service).`,
      developer: `**A shared request helper** (Campus Event guide, File 5) handles the cross-cutting concerns once:

- base URL from \`import.meta.env.VITE_API_URL\` (trailing slash stripped),
- JSON serialisation + \`Content-Type\` only when there is a body,
- \`Authorization: Bearer\` when required,
- \`!response.ok\` → \`ApiError(status, message)\` with a message extracted from ProblemDetails or text,
- 204/empty body → \`undefined\`.

**Resource services** then become thin and declarative (File 6):

\`\`\`ts
export const eventService = {
  list: () => request<Event[]>("/events"),
  get: (id: number) => request<Event>(\`/events/\${id}\`),
  create: (dto: EventDto) => request<Event>("/events", { method: "POST", body: dto, requiresAdmin: true }),
  update: (id: number, dto: EventDto) => request<void>(\`/events/\${id}\`, { method: "PUT", body: dto, requiresAdmin: true }),
  remove: (id: number) => request<void>(\`/events/\${id}\`, { method: "DELETE", requiresAdmin: true }),
};
\`\`\`

**Typing env vars.** Add to \`src/vite-env.d.ts\`:

\`\`\`ts
interface ImportMetaEnv { readonly VITE_API_URL: string }
interface ImportMeta { readonly env: ImportMetaEnv }
\`\`\`

Otherwise \`import.meta.env.VITE_API_URL\` is typed loosely and a typo becomes \`undefined\` at runtime → requests to \`"undefined/events"\`.

**Hook contract.** Hooks return a stable shape (\`{ data, loading, error }\`) so swapping fetch for TanStack Query later (Week 03 Slide 28: "only the hook changes") doesn't touch components.

**Types vs DTOs.** Response types (\`Event\`) and request payloads (\`EventDto\` without \`id\`, \`categoryName\`, \`availableTickets\`) are separate — Week 05 Slide 18.`,
      deep: `**Why this is a good boundary.** Each layer has *one reason to change* (Week 05 Slide 15): the service changes when the API contract changes; the hook changes when the state strategy changes (useEffect → TanStack Query); the component changes when the design changes. That is the single-responsibility principle applied to front-end architecture.

**Error normalisation.** Centralising errors means the UI deals with one error type (\`ApiError\` with \`status\` and a human message) instead of raw Responses, TypeErrors and text bodies. It also gives one hook point for cross-cutting behaviour: 401 → emit "session expired"; 5xx → log to monitoring; attach correlation ids.

**Runtime validation at the edge.** TypeScript's generic \`request<T>\` does not check the JSON (guide: "The generic type T tells TypeScript what response to expect; it does not validate the JSON at runtime"). The service layer is the natural place to add Zod parsing for critical data, so the rest of the app can trust the types.

**Env vars are build-time.** Vite statically replaces \`import.meta.env.VITE_*\` at build time. The value is baked into the bundle — changing it in production requires a rebuild (or a runtime config file loaded at startup). \`.env.development\`/\`.env.production\` let you vary it per mode. Again: anything in the bundle is public, including the guide's \`VITE_DEMO_ADMIN_TOKEN\` — acceptable for a classroom, never for production.

**Avoid premature abstraction.** Week 03 Slide 29 deliberately builds four near-identical hooks first, and Week 05 Slide 16 says "no generic hook framework required yet". A generic \`useFetch<T>\` (or TanStack Query) is introduced once the duplication is understood. Over-abstracting early hides behaviour and makes debugging harder.

**Testability.** Components can be tested by mocking the hook or service module (\`vi.mock("../services/eventService")\`) without a network or MSW, and the service can be tested in isolation against a mocked fetch.`,
    },
    mechanism: `\`\`\`text
 .env  VITE_API_URL=http://localhost:5229/api  ──(build-time replace)──┐
                                                                        ▼
 ┌──────────────── services/api.ts ─────────────────┐   BASE_URL
 │ request<T>(path, {method, body, requiresAdmin})   │
 │  • headers: Content-Type, Authorization: Bearer   │
 │  • fetch(BASE_URL + path)                         │──► HTTP ──► ASP.NET Core API
 │  • !ok → throw ApiError(status, message)          │◄── JSON ◄──
 │  • 204 → undefined                                │
 └───────────────▲───────────────────────────────────┘
                 │ eventService.list()/get()/create()/update()/remove()
 ┌───────────────┴─────── hooks/useEvents.ts ────────┐
 │ useState(events, loading, error) + useEffect       │
 └───────────────▲───────────────────────────────────┘
                 │ { events, loading, error }
 ┌───────────────┴─────── pages/Events.tsx ──────────┐
 │ loading / error / empty / <EventCard/> grid        │
 └────────────────────────────────────────────────────┘
\`\`\``,
    simpleExample: {
      title: "Week 05 Slide 19 service + a hook + a component",
      language: "tsx",
      code: `// ---- src/services/eventService.ts ----
import type { Event } from "../types/Event";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export async function getEvents(): Promise<Event[]> {
  const response = await fetch(API_BASE_URL + "/events");
  if (!response.ok) throw new Error("Could not load events");
  return (await response.json()) as Event[];
}

// ---- src/hooks/useEvents.ts ----
import { useEffect, useState } from "react";

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getEvents()
      .then(setEvents)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : "Failed"))
      .finally(() => setLoading(false));
  }, []);

  return { events, loading, error };
}

// ---- src/pages/Events.tsx ----
export default function Events() {
  const { events, loading, error } = useEvents();
  if (loading) return <p>Loading...</p>;
  if (error) return <p role="alert">{error}</p>;
  return <ul>{events.map((e) => <li key={e.id}>{e.title}</li>)}</ul>;
}`,
      walkthrough: [
        { lines: "4", text: "The base URL comes from `.env` via Vite — no hard-coded host in components." },
        { lines: "6-10", text: "The service knows URLs, fetch, `response.ok` and JSON." },
        { lines: "15-28", text: "The hook owns React state and the effect; it returns a stable `{ events, loading, error }` contract." },
        { lines: "31-36", text: "The component only renders; it doesn't know a URL exists." },
      ],
    },
    realExample: {
      title: "Campus Event guide-style request helper and eventService",
      language: "ts",
      code: `// ---- src/services/api.ts ----
const BASE_URL =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\\/$/, "") ?? "http://localhost:5229/api";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  token?: string | null;
}

export default async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, token, headers, ...rest } = options;
  const requestHeaders = new Headers(headers);
  if (body !== undefined) requestHeaders.set("Content-Type", "application/json");
  if (token) requestHeaders.set("Authorization", "Bearer " + token);

  const response = await fetch(BASE_URL + path, {
    ...rest,
    headers: requestHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const text = await response.text();
    let message = text || "Request failed (HTTP " + response.status + ").";
    try {
      const data = JSON.parse(text) as { title?: string; detail?: string; errors?: Record<string, string[]> };
      const firstFieldError = data.errors ? Object.values(data.errors)[0]?.[0] : undefined;
      message = data.detail ?? firstFieldError ?? data.title ?? message;
    } catch {
      /* plain-text body, e.g. BadRequest("Category does not exist.") */
    }
    if (response.status === 401) message = "Please sign in again.";
    if (response.status === 403) message = "You do not have permission to perform this action.";
    throw new ApiError(response.status, message);
  }

  if (response.status === 204) return undefined as T;
  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

// ---- src/services/eventService.ts ----
import type { Event } from "../types/Event";
import type { EventDto } from "../types/EventDto";

export const eventService = {
  list: (signal?: AbortSignal) => request<Event[]>("/events", { signal }),
  get: (id: number, signal?: AbortSignal) => request<Event>("/events/" + id, { signal }),
  create: (dto: EventDto, token: string) => request<Event>("/events", { method: "POST", body: dto, token }),
  update: (id: number, dto: EventDto, token: string) =>
    request<void>("/events/" + id, { method: "PUT", body: dto, token }),
  remove: (id: number, token: string) => request<void>("/events/" + id, { method: "DELETE", token }),
};`,
      walkthrough: [
        { lines: "2-3", text: "Base URL from Vite env with a fallback; trailing slash removed so paths join cleanly." },
        { lines: "5-12", text: "One error type carrying `status` for the whole app (guide File 5)." },
        { lines: "20-23", text: "Headers are added once, centrally: JSON content type only with a body; bearer token only if provided." },
        { lines: "31-44", text: "Centralised error handling: understands ProblemDetails JSON and ASP.NET plain-text `BadRequest` messages; friendlier 401/403 copy." },
        { lines: "46-48", text: "204 and empty bodies return `undefined` — never parsed." },
        { lines: "54-61", text: "Each endpoint is one line; components and hooks call `eventService.create(dto, token)` without knowing URLs or headers." },
      ],
    },
    mistakes: [
      {
        mistake: "Naming the env var `API_URL` (no prefix) and getting `undefined` → requests to `undefined/events`.",
        fix: "Vite exposes only `VITE_`-prefixed variables: `VITE_API_URL`. Restart the dev server after editing `.env`.",
      },
      {
        mistake: "Putting secrets (API keys, admin passwords) in `VITE_` variables.",
        fix: "They are bundled into public JavaScript. Secrets stay on the server.",
      },
      {
        mistake: "Duplicating fetch + error logic in many components.",
        fix: "One service module per resource on top of one request helper.",
      },
      {
        mistake: "Services that touch React state or return JSX.",
        fix: "Services are plain async functions; React state lives in hooks/components.",
      },
      {
        mistake: "Sending the whole `Event` response object (with `id`, `categoryName`, `availableTickets`) as the create/update payload.",
        fix: "Send an `EventDto` matching CreateEventDto/UpdateEventDto (Week 05 Slide 18).",
      },
    ],
    debug: {
      prompt:
        "In development, the Network tab shows requests to `http://localhost:5173/undefined/events` returning index.html, and the console says `Unexpected token '<'`. The .env file contains `API_URL=http://localhost:5229/api`. Fix it.",
      language: "ts",
      buggyCode: `// .env
// API_URL=http://localhost:5229/api

const API_BASE_URL = import.meta.env.API_URL;

export async function getEvents() {
  const response = await fetch(API_BASE_URL + "/events");
  return response.json();
}`,
      hint: "Which environment variables does Vite expose to client code? And what check is missing before `json()`?",
      fixedCode: `// .env   (restart `+"`npm run dev`"+` after editing)
// VITE_API_URL=http://localhost:5229/api

const API_BASE_URL = import.meta.env.VITE_API_URL as string;

export async function getEvents(): Promise<Event[]> {
  const response = await fetch(API_BASE_URL + "/events");
  if (!response.ok) throw new Error("Could not load events (HTTP " + response.status + ")");
  return (await response.json()) as Event[];
}`,
      explanation:
        "Vite only exposes `VITE_`-prefixed variables, so `import.meta.env.API_URL` is undefined and the URL became the relative path `undefined/events`. The Vite dev server answered with index.html (200), and `json()` failed on `<!doctype html>`. Rename to `VITE_API_URL`, restart the dev server, and check `response.ok`.",
    },
    challenge: {
      prompt:
        "Write `categoryService` (list categories from `GET /categories`) on top of the `request<T>` helper, and a `useCategories()` hook returning `{ categories, loading, error }` with an `active` flag cleanup. Then explain in one sentence which file would change if the course switched to TanStack Query.",
      language: "ts",
      hints: [
        "The service is one line: `list: () => request<Category[]>(\"/categories\")`.",
        "Mirror the guide's useEvents pattern.",
        "Week 03 Slide 28: only the hook changes.",
      ],
      solution: `// services/categoryService.ts
import request from "./api";
import type { Category } from "../types/Category";

export const categoryService = {
  list: () => request<Category[]>("/categories"),
};

// hooks/useCategories.ts
import { useEffect, useState } from "react";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    categoryService
      .list()
      .then((data) => { if (active) setCategories(data); })
      .catch((e: unknown) => { if (active) setError(e instanceof Error ? e.message : "Failed to load categories."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  return { categories, loading, error };
}

// Switching to TanStack Query changes only useCategories (it would call
// useQuery({ queryKey: ["categories"], queryFn: categoryService.list })); the service and components stay the same.`,
      explanation:
        "The service encodes the endpoint; the hook encodes React state; consumers rely on the `{ categories, loading, error }` contract, so the data-fetching strategy can change behind it.",
    },
    examQuestions: [
      {
        question:
          "**(A19)** What is the main benefit of separating API calls into a dedicated service module?",
        answer:
          "**B — it separates data-access logic from presentation components.** It doesn't remove HTTP requests, create a backend or prevent network errors.",
        marks: 1,
      },
      {
        question:
          "**(D2c, 2 marks)** Explain why an API service module can be beneficial when several components need to access the same endpoint.",
        answer:
          "The URL, request options (headers, auth), `response.ok` checks, JSON parsing and error handling are written once and reused, so components don't duplicate fetch logic. Changes (new base URL, auth header, bug fix, error format) are made in one place and apply everywhere, components stay focused on rendering, and the service can be tested/mocked independently.",
        marks: 2,
      },
      {
        question:
          "Describe the Service → Hook → Component pattern from Week 03 and state what each layer is responsible for.",
        answer:
          "Service (eventService.ts): talks to the API — URLs, fetch, response.ok, JSON, API errors. Hook (useEvents.ts): manages React state — useState/useEffect, loading, error — and returns `{ events, loading, error }`. Component (Events.tsx): renders the UI from that contract. Each layer has one job, so e.g. swapping fetch for TanStack Query only changes the hook.",
        marks: 3,
      },
      {
        question: "Why must the API base URL variable be named `VITE_API_URL`, and is it safe to store an API secret in it?",
        answer:
          "Vite only exposes env variables prefixed with `VITE_` to client code via `import.meta.env`. It is **not** safe for secrets: the value is embedded in the JavaScript bundle that every user downloads.",
        marks: 2,
      },
    ],
    revision: [
      "Service = URLs, fetch, response.ok, JSON, errors. Hook = React state. Component = UI (Week 03 Slide 28).",
      "Base URL from `import.meta.env.VITE_API_URL`; only `VITE_` vars are exposed; restart after editing .env.",
      "`VITE_` values are public — no secrets.",
      "One `request<T>` helper: headers, JSON, ApiError(status), 204 handling.",
      "Generic `<T>` is not runtime validation.",
      "Payload DTO ≠ response type (no id/categoryName/availableTickets).",
      "Mock A19/D2c: separation of data access from presentation; reuse and single place to change.",
    ],
    visualizers: ["architecture-flow"],
  },

  /* ================================================================== */
  /* 12. http-cors                                                       */
  /* ================================================================== */
  {
    id: "http-cors",
    moduleId: "m07-http-api",
    title: "CORS, Origins and Preflight Requests",
    summary:
      "Why the browser blocks cross-origin reads, what an origin is, when a preflight OPTIONS request is sent, why Postman never sees CORS, and how AddCors/UseCors are ordered in Program.cs.",
    priority: "P0",
    examCritical: true,
    minutes: 30,
    objectives: [
      "Define an origin as scheme + host + port and decide whether two URLs are same-origin.",
      "Explain the same-origin policy and the role of CORS response headers.",
      "Predict when a preflight `OPTIONS` request is sent (JSON content type, Authorization header, PUT/DELETE).",
      "Explain why Postman/Swagger don't hit CORS errors and configure AddCors/UseCors in the right order.",
    ],
    prerequisites: ["http-methods-status", "http-fetch-response-ok"],
    sources: [
      w03("Slide 5 (Swagger and Postman are not browsers — CORS will apply), Slide 19 (CORS — why browsers block requests; different origin = protocol, domain or port), Slide 20 (fixing CORS: AddCors before Build, UseCors before auth)"),
      backend("Program.cs — AddCors(FrontendPolicy, WithOrigins(\"http://localhost:5173\").AllowAnyHeader().AllowAnyMethod()); app.UseCors(FrontendPolicy) before UseAuthentication/UseAuthorization"),
      { kind: "supplementary", label: "MDN — Cross-Origin Resource Sharing (CORS)", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS" },
      { kind: "supplementary", label: "MDN — Same-origin policy", url: "https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy" },
    ],
    why: `Week 03, Slide 19 calls CORS "the #1 reason your first fetch fails". Your React dev server runs at \`http://localhost:5173\` and the API at \`http://localhost:5229\` — **different ports, therefore different origins**. By default the browser will not let JavaScript from one origin read responses from another, so your perfectly correct \`fetch\` fails with "blocked by CORS policy" while the same request works in Postman.

Understanding CORS lets you diagnose that in seconds: it's a **browser** policy, fixed by the **server** sending the right headers — not by changing your React code. It also explains preflight \`OPTIONS\` requests you'll see in DevTools when sending JSON or an \`Authorization\` header.`,
    analogy: `Your browser is a **strict parent** at a party. Your React app (a child from house 5173) wants to accept sweets from a stranger's house (5229). The parent won't let the child *eat* them unless the stranger's house has a sign saying "children from house 5173 are welcome" (\`Access-Control-Allow-Origin\`).

For anything unusual — like asking for a special delivery with a secret password (Authorization header) or a \`DELETE\` — the parent first knocks and asks "would you accept this kind of request from house 5173?" (**preflight OPTIONS**). Only if the answer is yes does the real request go ahead.

Postman is an **adult with no parent**: it just walks over and takes the sweets. That's why Postman never complains about CORS.`,
    explain: {
      beginner: `An **origin** is three things together: **scheme** (http/https) + **host** (localhost, example.com) + **port** (5173, 5229). If any one differs, it's a different origin (Week 03, Slide 19):

| Page | API | Same origin? |
|---|---|---|
| http://localhost:5173 | http://localhost:5173/api | ✅ yes |
| http://localhost:5173 | http://localhost:5229/api | ❌ port differs |
| http://localhost:5173 | https://localhost:5173 | ❌ scheme differs |

Browsers follow the **same-origin policy**: JavaScript may *send* requests anywhere, but may only *read* a cross-origin response if the server explicitly allows it. The server does that with **CORS headers**, especially:

\`\`\`http
Access-Control-Allow-Origin: http://localhost:5173
\`\`\`

If the header is missing, the browser blocks the response and your fetch rejects with a vague \`TypeError: Failed to fetch\`. The real explanation is in the DevTools **Console** ("blocked by CORS policy").

**The fix is on the server**, not in React. In CampusEvents' \`Program.cs\` (Slide 20):

1. \`builder.Services.AddCors(...)\` with a policy allowing \`http://localhost:5173\` — **before** \`builder.Build()\`.
2. \`app.UseCors("FrontendPolicy")\` — **after** \`Build()\` and **before** authentication/authorization.

Postman and Swagger are not browsers, so they don't enforce CORS at all (Slide 5, 19). "Works in Postman, fails in React" is the classic CORS symptom.`,
      developer: `**Simple vs preflighted requests.** A request is "simple" (no preflight) only if the method is GET, HEAD or POST, the only custom headers are CORS-safelisted (e.g. \`Accept\`, \`Content-Language\`, \`Content-Type\`), and \`Content-Type\` is one of \`text/plain\`, \`multipart/form-data\`, \`application/x-www-form-urlencoded\`. Anything else triggers a **preflight**:

- \`Content-Type: application/json\` → preflight (so every JSON POST/PUT).
- \`Authorization: Bearer …\` header → preflight (so every admin call).
- \`PUT\`, \`PATCH\`, \`DELETE\` → preflight.

The preflight is an automatic \`OPTIONS\` request:

\`\`\`http
OPTIONS /api/events HTTP/1.1
Origin: http://localhost:5173
Access-Control-Request-Method: POST
Access-Control-Request-Headers: authorization, content-type
\`\`\`

and the server must answer (2xx) with:

\`\`\`http
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Methods: POST          (AllowAnyMethod echoes it)
Access-Control-Allow-Headers: authorization, content-type
\`\`\`

Only then does the browser send the real POST — whose response must also carry \`Access-Control-Allow-Origin\`.

**ASP.NET Core ordering** (Program.cs in the supplied backend): \`AddCors\` registers the policy in DI; \`UseCors(FrontendPolicy)\` runs after \`UseHttpsRedirection\` and before \`UseAuthentication\`/\`UseAuthorization\`/\`MapControllers\`. If CORS ran after authorization, the preflight (which never carries your token) could be rejected with 401 and lack CORS headers.

**Debugging:** Network tab → look for the OPTIONS row. Failed preflight = CORS config; successful preflight but failing main request = check its own status (401/400) and headers.`,
      deep: `**What CORS protects.** The same-origin policy protects *users*, not servers. Without it, any website you visit could use your browser (with your cookies) to read your bank's API responses. CORS is a controlled relaxation: the server opts specific origins in. That's also why CORS is **not** an API security mechanism — curl, Postman and server-side code ignore it entirely. Authentication and authorisation still have to be enforced on the server.

**The request may still reach the server.** For *simple* requests, the browser sends the request and only blocks the **response** from JS. A cross-origin simple POST can therefore still change server state (CSRF territory). Preflights exist so that non-simple requests (custom methods/headers) are checked *before* being sent.

**Credentials.** For cookies (\`fetch(url, { credentials: "include" })\`), the server must send \`Access-Control-Allow-Credentials: true\` and a specific origin — \`Access-Control-Allow-Origin: *\` is forbidden with credentials. Bearer tokens in the \`Authorization\` header don't need credentials mode but do trigger preflight.

**Common misconfigurations:**
- Trailing slash in \`WithOrigins("http://localhost:5173/")\` — origins never have a path, so it doesn't match.
- http vs https mismatch: \`UseHttpsRedirection\` redirecting an http API call to https can break preflights (redirects aren't followed for preflight). The guide uses \`http://localhost:5229/api\`, while Week 03 Slide 19 shows the API on https — use whichever your launch profile actually serves, consistently.
- Dev server on a different port (5174 because 5173 was busy) → not in the allow-list.
- An exception/500 thrown before the CORS middleware adds headers → the browser reports CORS, hiding the real 500.

**Preflight caching.** \`Access-Control-Max-Age\` lets browsers cache preflight results to avoid an extra round trip per request.

**Alternative: same origin.** A Vite dev proxy (\`server.proxy: { "/api": "http://localhost:5229" }\`) or serving SPA and API from one host makes requests same-origin, avoiding CORS entirely.`,
    },
    mechanism: `\`\`\`text
 Browser (page origin http://localhost:5173)                 API http://localhost:5229
 ────────────────────────────────────────────               ──────────────────────────
 fetch POST /api/events  JSON + Authorization
        │ non-simple → PREFLIGHT first
        ├── OPTIONS /api/events ─────────────────────────────►  UseCors(FrontendPolicy)
        │   Origin: http://localhost:5173                       origin in WithOrigins? ─┐
        │   Access-Control-Request-Method: POST                                          │
        │   Access-Control-Request-Headers: authorization,content-type                   │
        │◄── 204  Access-Control-Allow-Origin: http://localhost:5173  ◄──── yes ─────────┘
        │        Access-Control-Allow-Methods: POST
        │        Access-Control-Allow-Headers: authorization,content-type
        │
        ├── POST /api/events (real request) ─────────────────►  UseAuthentication → UseAuthorization
        │◄── 201 + Access-Control-Allow-Origin ◄────────────────  controller
        ▼
 JS can read the response ✓

 If the preflight lacks the headers → browser never sends POST → fetch rejects TypeError ("Failed to fetch")
 Postman / Swagger: no Origin enforcement at all → no preflight, no CORS errors.
\`\`\``,
    simpleExample: {
      title: "Which requests trigger a preflight?",
      language: "ts",
      code: `const API = "http://localhost:5229/api";   // page runs on http://localhost:5173

// 1) Simple GET: no preflight. Response readable only if the server sends
//    Access-Control-Allow-Origin: http://localhost:5173
await fetch(API + "/events");

// 2) JSON POST: Content-Type application/json is not "simple" -> OPTIONS preflight first
await fetch(API + "/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email: "admin@example.com", password: "Password123" }),
});

// 3) DELETE with a bearer token: method AND header both trigger a preflight
await fetch(API + "/events/3", {
  method: "DELETE",
  headers: { Authorization: "Bearer " + localStorage.getItem("token") },
});`,
      walkthrough: [
        { lines: "1", text: "Different port → different origin → CORS applies to every call." },
        { lines: "5", text: "GET with no custom headers is a simple request: sent directly; the response is readable only with the allow-origin header." },
        { lines: "8-12", text: "JSON bodies require a preflight OPTIONS checking that `content-type` is an allowed header." },
        { lines: "15-18", text: "DELETE and `Authorization` both require a preflight; the server must allow the method and header (AllowAnyMethod/AllowAnyHeader)." },
      ],
    },
    realExample: {
      title: "CampusEvents Program.cs (C#): registering and applying the CORS policy",
      language: "text",
      code: `// Program.cs (ASP.NET Core) — from the supplied CampusEvents.Api

// 1) BEFORE builder.Build(): register the policy in the service container
const string FrontendPolicy = "FrontendPolicy";

builder.Services.AddCors(options =>
{
    options.AddPolicy(FrontendPolicy, policy =>
    {
        policy
            .WithOrigins("http://localhost:5173")   // exact origin: scheme + host + port, no trailing slash
            .AllowAnyHeader()                        // allows Content-Type, Authorization in preflight
            .AllowAnyMethod();                       // allows POST, PUT, PATCH, DELETE
    });
});

var app = builder.Build();

// 2) AFTER Build(): middleware order matters
app.UseHttpsRedirection();
app.UseCors(FrontendPolicy);    // must come BEFORE authentication/authorization
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();`,
      walkthrough: [
        { lines: "4-15", text: "AddCors registers a named policy before `Build()` (Week 03 Slide 20, step 1)." },
        { lines: "11", text: "The allowed origin must match the React dev server exactly — `http://localhost:5173`." },
        { lines: "12-13", text: "Preflights for JSON + Authorization + PUT/DELETE succeed because any header and method are allowed for that origin." },
        { lines: "21", text: "UseCors before auth: the preflight carries no token, so it must be answered by CORS middleware before authorization could reject it (Slide 20, step 2)." },
      ],
    },
    mistakes: [
      {
        mistake: "Trying to fix CORS in React (adding `Access-Control-Allow-Origin` to the request headers, or `mode: \"no-cors\"`).",
        fix: "CORS headers are *response* headers set by the server. `no-cors` gives an unreadable opaque response.",
      },
      {
        mistake: "Concluding the API works because Postman succeeds.",
        fix: "Postman/Swagger aren't browsers and skip CORS (Week 03 Slides 5, 19). Test from the browser.",
      },
      {
        mistake: "`WithOrigins(\"http://localhost:5173/\")` with a trailing slash, or the wrong port/scheme.",
        fix: "Origins are exactly scheme://host:port — no path or trailing slash.",
      },
      {
        mistake: "Calling `app.UseCors()` after `UseAuthorization()` or forgetting `AddCors`.",
        fix: "AddCors before Build(); UseCors after Build() and before UseAuthentication/UseAuthorization.",
      },
      {
        mistake: "Thinking CORS secures the API from other clients.",
        fix: "CORS only governs browsers reading responses; authenticate and authorise every request on the server.",
      },
    ],
    debug: {
      prompt:
        "GET /api/events works from React, but creating an event fails with 'Response to preflight request doesn't pass access control check: No Access-Control-Allow-Origin header'. Postman can create events fine. Here is the backend config — find the problems.",
      language: "text",
      buggyCode: `builder.Services.AddCors(options =>
    options.AddPolicy("FrontendPolicy", p => p
        .WithOrigins("http://localhost:5173/")
        .WithMethods("GET")));

var app = builder.Build();

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.UseCors("FrontendPolicy");
app.MapControllers();`,
      hint: "Three things: the origin string, what the preflight for a JSON POST with a token asks permission for, and middleware order.",
      fixedCode: `builder.Services.AddCors(options =>
    options.AddPolicy("FrontendPolicy", p => p
        .WithOrigins("http://localhost:5173")
        .AllowAnyHeader()
        .AllowAnyMethod()));

var app = builder.Build();

app.UseHttpsRedirection();
app.UseCors("FrontendPolicy");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();`,
      explanation:
        "(1) The trailing slash means the origin never matches. (2) The POST preflight asks for method POST and headers content-type/authorization; the policy allowed only GET and no extra headers. (3) UseCors ran after authorization, so the token-less preflight could be rejected before CORS headers were added. Postman worked because it doesn't enforce CORS. (A simple GET can appear to work in some setups, which is why the bug showed only on mutations.)",
    },
    challenge: {
      prompt:
        "For each pair, state whether a request from the page to the API is cross-origin, and whether `fetch(api, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body })` would be preflighted: (a) http://localhost:5173 → http://localhost:5173/api (Vite proxy) (b) http://localhost:5173 → http://localhost:5229/api (c) https://campus.example → https://api.campus.example (d) https://campus.example → https://campus.example:443/api",
      language: "text",
      hints: [
        "Origin = scheme + host + port; default port for https is 443.",
        "Subdomains are different hosts.",
        "Preflight only applies to cross-origin requests.",
      ],
      solution: `(a) Same origin (proxy keeps the browser talking to :5173) -> no CORS, no preflight.
(b) Cross-origin (port 5173 vs 5229) -> PUT + application/json -> preflight OPTIONS.
(c) Cross-origin (host campus.example vs api.campus.example) -> preflight OPTIONS.
(d) Same origin (https default port is 443, so :443 is identical) -> no CORS, no preflight.`,
      explanation:
        "Only scheme, host and port matter. Paths never affect origin. Preflight is a cross-origin mechanism: same-origin requests are never preflighted regardless of method or headers.",
    },
    examQuestions: [
      {
        question:
          "A React app on `http://localhost:5173` calls an API on `http://localhost:5229`. It works in Postman but fails in the browser with a CORS error. Explain why and how it is fixed.",
        answer:
          "The two URLs have different ports, so they are different **origins**. Browsers enforce the same-origin policy and block JS from reading cross-origin responses unless the server returns CORS headers (e.g. `Access-Control-Allow-Origin: http://localhost:5173`). Postman isn't a browser and doesn't enforce CORS. Fix on the server: register a CORS policy with `AddCors(...WithOrigins(\"http://localhost:5173\").AllowAnyHeader().AllowAnyMethod())` and apply `app.UseCors(policy)` before authentication/authorization.",
        marks: 4,
      },
      {
        question: "What is a preflight request and give two things that cause one?",
        answer:
          "An automatic `OPTIONS` request the browser sends before a non-simple cross-origin request, asking the server whether the origin, method and headers are allowed (`Access-Control-Request-Method/Headers`). Triggers include `Content-Type: application/json`, an `Authorization` header, or methods like PUT/PATCH/DELETE.",
        marks: 2,
      },
      {
        question: "Define 'origin' and state whether `https://site.com` and `http://site.com` share an origin.",
        answer:
          "Origin = scheme + host + port. They do **not** share an origin because the scheme (https vs http — and therefore default port 443 vs 80) differs.",
        marks: 2,
      },
    ],
    revision: [
      "Origin = scheme + host + port; any difference → cross-origin (Week 03 Slide 19).",
      "Same-origin policy: JS can't read cross-origin responses unless the server allows it.",
      "Fix CORS on the SERVER: `Access-Control-Allow-Origin` etc. — not in React.",
      "Preflight OPTIONS for JSON bodies, Authorization headers, PUT/PATCH/DELETE.",
      "Postman/Swagger aren't browsers → no CORS (Slides 5, 19).",
      "Program.cs: AddCors before Build(); UseCors before UseAuthentication/UseAuthorization (Slide 20).",
      "CORS is not API security; servers still authenticate/authorise.",
      "CORS failures appear as `TypeError: Failed to fetch`; read the Console.",
    ],
    visualizers: ["cors-preflight"],
  },

  /* ================================================================== */
  /* 13. forms-controlled-inputs                                         */
  /* ================================================================== */
  {
    id: "forms-controlled-inputs",
    moduleId: "m08-forms-crud",
    title: "Controlled Inputs and Form Submission",
    summary:
      "Make React state the source of truth for inputs with value + onChange, manage a form-state object with one change handler, and submit safely with preventDefault and duplicate-submit protection.",
    priority: "P0",
    examCritical: true,
    minutes: 30,
    objectives: [
      "Explain controlled vs uncontrolled inputs and when each is appropriate.",
      "Manage several fields with one state object and a single `name`-based change handler.",
      "Handle `onSubmit` with `event.preventDefault()` and async submission.",
      "Disable the submit button while submitting and prevent duplicate submissions.",
    ],
    prerequisites: ["react-state-events", "ts-basics-interfaces"],
    sources: [
      w05("Slide 22 (forms are a data-entry workflow: input → validate → submit → respond), Slide 23 (controlled inputs and form state), Slide 32 (prevent repeat clicks), Slide 34 (duplicate-submit protection)"),
      guide("File 12 (EventForm: submit disabled while isSubmitting, 'Saving...' label)"),
      mock("D3 (form for Event Name, Location, Maximum Attendees)"),
      { kind: "supplementary", label: "react.dev — <input> (controlled inputs)", url: "https://react.dev/reference/react-dom/components/input" },
    ],
    why: `Forms are where users hand your app data that will be sent to the server (Week 05, Slide 22: input → validate → submit → respond). To validate, show live feedback, pre-fill edit forms and build the request payload, your code needs to **know the current value of every field at all times**.

**Controlled inputs** make React state the single source of truth (Slide 23): the input displays what's in state, and every keystroke updates state. On top of that, a form must handle submission properly — stop the browser's default full-page POST, show that it's working, and stop a nervous double-click from creating two events (POST is not idempotent; Slide 34 lists "duplicate-submit protection" as a common CRUD mistake).`,
    analogy: `A controlled input is like a **whiteboard managed by a secretary**. You (the user) say "write 'Hackathon'"; the secretary (onChange) updates the official notes (state); the whiteboard (input) always shows exactly what's in the notes. There's never any disagreement about what's written.

An uncontrolled input is a **sticky note in the user's hand** — you only find out what's on it when you ask for it at the end (on submit, via a ref or FormData).

The disabled submit button is the **"processing — please wait" sign** at a ticket desk that stops people paying twice.`,
    explain: {
      beginner: `A **controlled input** gets its value from React state and reports changes back:

\`\`\`tsx
const [title, setTitle] = useState("");

<input value={title} onChange={(e) => setTitle(e.target.value)} />
\`\`\`

- \`value={title}\` — the input always shows what's in state.
- \`onChange\` — every keystroke calls \`setTitle\`, React re-renders, and the input shows the new value.

If you set \`value\` **without** \`onChange\`, the input is stuck — typing does nothing (React warns you).

**Many fields?** Keep one object and one handler that uses each input's \`name\`:

\`\`\`tsx
const [form, setForm] = useState({ eventName: "", location: "", maxAttendees: "" });

function handleChange(e: ChangeEvent<HTMLInputElement>) {
  const { name, value } = e.target;
  setForm((prev) => ({ ...prev, [name]: value }));
}
\`\`\`

**Submitting.** Put the logic on the form's \`onSubmit\` (so pressing Enter works too) and call \`e.preventDefault()\` first — otherwise the browser reloads the page with a traditional form submission.

**While it's sending,** set \`submitting\` to true, disable the button and show "Saving...". This stops the user clicking twice and creating two events.

An **uncontrolled** input instead keeps its own value in the DOM; you read it at submit time (\`new FormData(form)\` or a ref). It's simpler for tiny forms but makes live validation and pre-filling harder.`,
      developer: `**Typed single handler:**

\`\`\`tsx
type FieldElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

function handleChange(e: ChangeEvent<FieldElement>) {
  const { name, value } = e.currentTarget;
  setForm((prev) => ({ ...prev, [name]: value }));
}
\`\`\`

Keep numeric inputs as **strings in form state** (\`maxAttendees: ""\`) and convert on submit; \`<input type="number">\` still gives \`e.target.value\` as a string, and an empty field is \`""\`, not 0. For checkboxes use \`checked\` and \`e.target.checked\`.

**Submission skeleton:**

\`\`\`tsx
async function handleSubmit(e: FormEvent<HTMLFormElement>) {
  e.preventDefault();
  if (submitting) return;             // guard against double submit
  const errors = validate(form);
  if (Object.keys(errors).length) { setErrors(errors); return; }
  setSubmitting(true);
  try { await onSave(form); }
  catch (err) { setServerError(...); }
  finally { setSubmitting(false); }
}
\`\`\`

Pair it with \`<button type="submit" disabled={submitting}>\`. The \`if (submitting) return\` guard matters because two clicks can land before React re-renders the disabled button; a \`useRef\` flag is fully synchronous if you need a stronger guarantee.

**Edit forms** initialise from loaded data: pass the record as initial state and use a \`key={event.id}\` on the form so switching records re-initialises it (or \`reset\` in React Hook Form, as the guide's EventForm does).

**React 19 note.** React 19 also supports \`<form action={fn}>\` with \`useActionState\`/\`useFormStatus\` (uncontrolled, FormData-based). The course and RHF use the onSubmit pattern; both are valid.`,
      deep: `**Why controlled works.** React re-renders the input with \`value={state}\` after each \`onChange\`. If your handler doesn't update state (or transforms it), React resets the DOM value to match state — that's how you can implement input masks (\`setPhone(value.replace(/\\D/g, ""))\`). The trade-off: every keystroke re-renders the component owning the state. For large forms this is usually fine; if not, split fields into components or use React Hook Form, which uses uncontrolled inputs with refs and re-renders only what's needed.

**Controlled ↔ uncontrolled switch warning.** \`value={undefined}\` makes an input uncontrolled; later giving it a string makes it controlled, and React warns. Cause: initial state built from an API record with \`null\` fields (e.g. \`imageUrl: null\`). Normalise with \`?? ""\` (the guide does \`imageUrl: event.imageUrl ?? ""\`).

**Event pooling** no longer exists (since React 17), but reading \`e.target\` inside a functional \`setForm(prev => …)\` updater still runs later; destructure \`name\`/\`value\` first, as above.

**Duplicate submissions beyond the button.** Disabled buttons don't stop the Enter key in all browsers if focus is in an input and the form still submits — the \`if (submitting) return\` guard covers it. Network-level duplicates (retry after timeout) need server idempotency keys. After success, either navigate away or reset the form so a second Enter can't resubmit the same data.

**Preserve input on error.** Never clear the form when the server returns 400; the user must be able to fix one field and resubmit. Clear only after success.

**Accessibility.** Every input needs a \`<label htmlFor>\`; the submit button should remain a real \`<button type="submit">\`; announce the submitting state (button text change) and outcome (\`role="status"\`/\`role="alert"\`). Avoid \`disabled\` on fields during submission if it would lose focus unexpectedly — \`aria-busy\` on the form is an alternative.`,
    },
    mechanism: `\`\`\`text
 CONTROLLED INPUT LOOP
   keystroke "H" ─► onChange(e) ─► setForm({...prev, title:"H"}) ─► re-render
        ▲                                                             │
        └───────────── <input value={form.title}> shows "H" ◄──────────┘

 SUBMIT FLOW
   Enter / click ─► <form onSubmit> ─► e.preventDefault()  (no page reload)
                        │
                 submitting? ──yes──► return (ignore duplicate)
                        │ no
                 validate(form) ──errors──► setErrors, stay
                        │ ok
                 setSubmitting(true) ─► button disabled, "Saving..."
                        │
                 await onSave(payload)
                  ├─ success ─► reset form / navigate
                  └─ failure ─► show error, KEEP input
                        │
                 setSubmitting(false)
\`\`\``,
    simpleExample: {
      title: "One state object, one change handler, safe submit",
      language: "tsx",
      code: `import { useState, type ChangeEvent, type FormEvent } from "react";

interface EventFormState {
  eventName: string;
  location: string;
  maxAttendees: string;
}

export default function NewEventForm() {
  const [form, setForm] = useState<EventFormState>({ eventName: "", location: "", maxAttendees: "" });
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // pretend to save
      setForm({ eventName: "", location: "", maxAttendees: "" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="eventName">Event name</label>
      <input id="eventName" name="eventName" value={form.eventName} onChange={handleChange} />

      <label htmlFor="location">Location</label>
      <input id="location" name="location" value={form.location} onChange={handleChange} />

      <label htmlFor="maxAttendees">Maximum attendees</label>
      <input id="maxAttendees" name="maxAttendees" type="number" value={form.maxAttendees} onChange={handleChange} />

      <button type="submit" disabled={submitting}>{submitting ? "Saving..." : "Create event"}</button>
    </form>
  );
}`,
      walkthrough: [
        { lines: "3-7", text: "The number field is stored as a string — inputs always give strings; convert on submit." },
        { lines: "13-16", text: "One handler for every field: the input's `name` picks the property via a computed key." },
        { lines: "18-19", text: "`onSubmit` on the form handles both button clicks and Enter; `preventDefault` stops the full-page form post." },
        { lines: "20", text: "Duplicate guard: ignore a second submit while one is in flight." },
        { lines: "24", text: "Reset the form only after success." },
        { lines: "32-39", text: "Each input is controlled (`value` + `onChange`) and labelled with `htmlFor`/`id`." },
        { lines: "41", text: "Disabled while submitting and the label tells the user what's happening." },
      ],
    },
    realExample: {
      title: "CampusEvents create form: textarea, select, number conversion and server error",
      language: "tsx",
      code: `import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { eventService } from "../services/eventService";
import type { Category } from "../types/Category";
import type { EventDto } from "../types/EventDto";

type FieldElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

interface FormState {
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  price: string;
  capacity: string;
  categoryId: string;
}

const empty: FormState = {
  title: "", description: "", location: "", startDate: "", endDate: "",
  price: "0", capacity: "1", categoryId: "",
};

export default function CreateEventPage({ categories, token }: { categories: Category[]; token: string }) {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>(empty);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  function handleChange(e: ChangeEvent<FieldElement>) {
    const { name, value } = e.currentTarget;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setServerError(null);

    const dto: EventDto = {
      title: form.title.trim(),
      description: form.description.trim(),
      imageUrl: null,
      location: form.location.trim(),
      startDate: new Date(form.startDate).toISOString(),
      endDate: new Date(form.endDate).toISOString(),
      price: Number(form.price),
      capacity: Number(form.capacity),
      categoryId: Number(form.categoryId),
    };

    try {
      const created = await eventService.create(dto, token);
      navigate("/events/" + created.id, { replace: true });
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Could not create the event.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate aria-busy={submitting}>
      {serverError && <div role="alert" className="alert alert-danger">{serverError}</div>}
      <label htmlFor="title">Title</label>
      <input id="title" name="title" value={form.title} onChange={handleChange} />
      <label htmlFor="description">Description</label>
      <textarea id="description" name="description" value={form.description} onChange={handleChange} />
      <label htmlFor="location">Location</label>
      <input id="location" name="location" value={form.location} onChange={handleChange} />
      <label htmlFor="startDate">Starts</label>
      <input id="startDate" name="startDate" type="datetime-local" value={form.startDate} onChange={handleChange} />
      <label htmlFor="endDate">Ends</label>
      <input id="endDate" name="endDate" type="datetime-local" value={form.endDate} onChange={handleChange} />
      <label htmlFor="price">Price</label>
      <input id="price" name="price" type="number" min="0" step="0.01" value={form.price} onChange={handleChange} />
      <label htmlFor="capacity">Capacity</label>
      <input id="capacity" name="capacity" type="number" min="1" step="1" value={form.capacity} onChange={handleChange} />
      <label htmlFor="categoryId">Category</label>
      <select id="categoryId" name="categoryId" value={form.categoryId} onChange={handleChange}>
        <option value="">Select a category</option>
        {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select>
      <button type="submit" disabled={submitting}>{submitting ? "Saving..." : "Create event"}</button>
    </form>
  );
}`,
      walkthrough: [
        { lines: "7", text: "One handler typed for inputs, textareas and selects." },
        { lines: "9-18", text: "All form values are strings, exactly what the DOM gives us." },
        { lines: "31-34", text: "`currentTarget` is the element the handler is attached to; the computed key updates one field." },
        { lines: "42-52", text: "Build the EventDto on submit: trim strings, convert numbers, convert datetime-local to ISO (as the guide's `toApiDate`). Validation is covered in the next lesson." },
        { lines: "54-56", text: "Navigate only after the POST succeeds (201)." },
        { lines: "57-60", text: "On failure: show the server message, keep the user's input, re-enable the button." },
        { lines: "64", text: "`noValidate` lets our own validation/error UI take over from browser tooltips; `aria-busy` signals submission." },
      ],
    },
    mistakes: [
      {
        mistake: "Setting `value` without `onChange`, making the field read-only.",
        fix: "Provide `onChange` that updates state (or use `defaultValue` for an uncontrolled input).",
      },
      {
        mistake: "Forgetting `e.preventDefault()` in onSubmit — the page reloads and state is lost.",
        fix: "Call `e.preventDefault()` first in the submit handler.",
      },
      {
        mistake: "Putting the handler on the button's onClick instead of the form's onSubmit.",
        fix: "Use `<form onSubmit>` + `<button type=\"submit\">` so Enter works and semantics are correct.",
      },
      {
        mistake: "No submitting state — double-clicks create duplicate events (POST isn't idempotent).",
        fix: "Track `submitting`, disable the button, and early-return if already submitting.",
      },
      {
        mistake: "Initialising a controlled input with `null`/`undefined` from API data.",
        fix: "Normalise to strings (`event.imageUrl ?? \"\"`) to avoid the controlled/uncontrolled warning.",
      },
    ],
    debug: {
      prompt:
        "Typing in 'Location' wipes out 'Event name', and clicking Create twice quickly creates two events. Fix both bugs.",
      language: "tsx",
      buggyCode: `const [form, setForm] = useState({ eventName: "", location: "" });

function handleChange(e: ChangeEvent<HTMLInputElement>) {
  setForm({ [e.target.name]: e.target.value } as typeof form);
}

async function handleSubmit(e: FormEvent<HTMLFormElement>) {
  e.preventDefault();
  await createEvent(form);
}

// <button type="submit">Create</button>`,
      hint: "What does the new state object contain after one change? What stops a second submit?",
      fixedCode: `const [form, setForm] = useState({ eventName: "", location: "" });
const [submitting, setSubmitting] = useState(false);

function handleChange(e: ChangeEvent<HTMLInputElement>) {
  const { name, value } = e.target;
  setForm((prev) => ({ ...prev, [name]: value }));
}

async function handleSubmit(e: FormEvent<HTMLFormElement>) {
  e.preventDefault();
  if (submitting) return;
  setSubmitting(true);
  try {
    await createEvent(form);
  } finally {
    setSubmitting(false);
  }
}

// <button type="submit" disabled={submitting}>{submitting ? "Creating..." : "Create"}</button>`,
      explanation:
        "State setters replace, they don't merge: `{ [name]: value }` drops every other field (the `as` cast hid the type error). Spread the previous state. And with no submitting flag the button stays active, so two POSTs are sent; track submitting, guard the handler, and disable the button.",
    },
    challenge: {
      prompt:
        "Convert this uncontrolled sign-up form into a controlled one with a single state object `{ email, password, acceptTerms }` (a checkbox), one change handler that handles both text inputs and the checkbox, and a submit button disabled until terms are accepted or while submitting.",
      starterCode: `export default function SignUp() {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    console.log(data.get("email"), data.get("password"), data.get("acceptTerms"));
  }
  return (
    <form onSubmit={handleSubmit}>
      <input name="email" type="email" />
      <input name="password" type="password" />
      <input name="acceptTerms" type="checkbox" />
      <button type="submit">Sign up</button>
    </form>
  );
}`,
      language: "tsx",
      hints: [
        "For checkboxes read `e.target.checked`, not `value`.",
        "Use `type === \"checkbox\" ? checked : value`.",
        "`disabled={!form.acceptTerms || submitting}`.",
      ],
      solution: `import { useState, type ChangeEvent, type FormEvent } from "react";

interface SignUpState {
  email: string;
  password: string;
  acceptTerms: boolean;
}

export default function SignUp({ onSignUp }: { onSignUp: (s: SignUpState) => Promise<void> }) {
  const [form, setForm] = useState<SignUpState>({ email: "", password: "", acceptTerms: false });
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, type, value, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting || !form.acceptTerms) return;
    setSubmitting(true);
    try {
      await onSignUp(form);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="email">Email</label>
      <input id="email" name="email" type="email" value={form.email} onChange={handleChange} />
      <label htmlFor="password">Password</label>
      <input id="password" name="password" type="password" value={form.password} onChange={handleChange} />
      <label>
        <input name="acceptTerms" type="checkbox" checked={form.acceptTerms} onChange={handleChange} />
        I accept the terms
      </label>
      <button type="submit" disabled={!form.acceptTerms || submitting}>
        {submitting ? "Signing up..." : "Sign up"}
      </button>
    </form>
  );
}`,
      explanation:
        "Text inputs are controlled with `value`, the checkbox with `checked`. The single handler branches on the input type. The submit button reflects both a business rule (terms accepted) and the request state (submitting), and the handler re-checks both.",
    },
    examQuestions: [
      {
        question: "What is a controlled input in React? Show a minimal example.",
        answer:
          "An input whose displayed value comes from React state and whose changes update that state, making React the single source of truth (Week 05 Slide 23). Example: `const [title, setTitle] = useState(\"\"); <input value={title} onChange={(e) => setTitle(e.target.value)} />`.",
        marks: 2,
      },
      {
        question: "Why should a form submit handler call `event.preventDefault()`?",
        answer:
          "The browser's default form submission sends a request and reloads/navigates the page, which would restart the SPA and lose state. `preventDefault()` stops that so JavaScript can validate and send the data with fetch.",
        marks: 2,
      },
      {
        question:
          "A user double-clicks 'Create event' and two identical events are created. Explain why and give two frontend measures to prevent it.",
        answer:
          "Each click submits a POST, and POST is not idempotent — each request creates a new resource. Measures: track a `submitting` state and disable the submit button while the request is in flight; early-return from the handler if already submitting (or use a ref flag); then navigate/reset after success. (Server-side idempotency keys give full protection.)",
        marks: 3,
      },
    ],
    revision: [
      "Controlled: `value={state}` + `onChange={e => set(e.target.value)}` — state is the source of truth.",
      "One object + one `name`-based handler: `setForm(prev => ({ ...prev, [name]: value }))`.",
      "Input values are strings — convert numbers on submit.",
      "`<form onSubmit>` + `e.preventDefault()`; button `type=\"submit\"`.",
      "Track `submitting`; disable button + guard handler → no duplicate POSTs.",
      "Keep input on error; reset/navigate only on success.",
      "Normalise nulls to `\"\"` to avoid controlled/uncontrolled switches.",
    ],
    visualizers: ["form-validation"],
  },

  /* ================================================================== */
  /* 14. forms-validation                                                */
  /* ================================================================== */
  {
    id: "forms-validation",
    moduleId: "m08-forms-crud",
    title: "Client-Side Validation, Error Messages and Accessibility",
    summary:
      "Write a validation function that returns an errors object (mock D3a), trim input, use Number.isInteger, show accessible field and form errors, map server 400 messages — and remember client validation is not security.",
    priority: "P0",
    examCritical: true,
    minutes: 35,
    objectives: [
      "Write a pure validation function returning a typed errors object (full mock D3a answer).",
      "Apply required, format, range and cross-field rules, trimming whitespace first.",
      "Display field-level and form-level errors accessibly with label, aria-invalid and aria-describedby.",
      "Explain why client-side validation is not security (mock A17, B9) and map server 400 responses to the form.",
    ],
    prerequisites: ["forms-controlled-inputs"],
    sources: [
      w05("Slide 22 (validate before submit), Slide 24 (client vs server validation — never a security boundary), Slide 25 (rules: required after trimming, format, range, cross-field, accessible feedback), Slide 36 (diagnose a 400)"),
      guide("File 12 (EventForm: trimmed values, setError('root.server') for API failures, 'This is client-side validation. The backend must continue to validate')"),
      backend("EventsController.cs — BadRequest(\"End date must be after the start date.\"), BadRequest(\"Category does not exist.\"), capacity below booked tickets"),
      postman("Section 11 — invalid event date test → 400 Bad Request"),
      mock("A17, B9, D3(a)"),
      { kind: "supplementary", label: "MDN — aria-invalid", url: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-invalid" },
      { kind: "best-practice", label: "OWASP — Input Validation Cheat Sheet", url: "https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html" },
    ],
    why: `Sending obviously bad data to the server wastes a round trip and gives the user a vague error long after they made the mistake. **Client-side validation** gives fast, specific feedback next to the field ("Location is required") before any request is made (Week 05, Slide 24) — that's mock **A17**: the right way to stop a form being submitted with an invalid email.

But it is **only a convenience**. Anyone can bypass it with DevTools, Postman or curl, so it cannot guarantee that invalid data never reaches the server (mock **B9** is **False**). The CampusEvents API re-checks dates, category existence and capacity and answers **400** with a message — and a good form shows that message too. Mock **D3(a)** asks you to write the validation function itself.`,
    analogy: `Client-side validation is the **spell-checker** in your email app: it underlines mistakes instantly so you can fix them before sending. Helpful — but the recipient's mail server doesn't trust your spell-checker; it runs its own spam and virus checks on whatever actually arrives. Someone could send a message from a different program with no spell-checker at all.

Server-side validation is the **border control**: authoritative, unavoidable, and the only one that counts for security.`,
    explain: {
      beginner: `Validation means checking the user's input against **rules** before sending it. Week 05, Slide 25 lists the kinds of rule:

- **Required** — "title cannot be blank **after trimming whitespace**" (\`"   "\` is still empty!).
- **Format** — dates, email addresses.
- **Range** — e.g. capacity at least 1, price not negative.
- **Cross-field** — end date must be after start date.

A simple, testable approach is a function that takes the form values and returns an **errors object**: one message per invalid field, and an empty object if everything is fine.

\`\`\`ts
function validate(values) {
  const errors = {};
  if (values.eventName.trim() === "") errors.eventName = "Event name is required.";
  ...
  return errors;
}
\`\`\`

On submit:

1. \`const errors = validate(form)\`
2. If \`Object.keys(errors).length > 0\` → show the messages and **don't** send.
3. Otherwise → send the request.

Show each message **next to its field**, in words that explain how to fix it — and don't rely on red colour alone (Slide 25).

**Positive integer check:** inputs give strings, so convert first: \`const n = Number(value)\`, then \`Number.isInteger(n) && n > 0\`. \`Number.isInteger\` rejects \`NaN\`, decimals like 2.5 and Infinity.

**Never forget:** the server must validate again. Client checks are for the user's convenience, not for protection.`,
      developer: `**Typed validator** (mock D3a):

\`\`\`ts
type Errors<T> = Partial<Record<keyof T, string>>;
\`\`\`

returns only the keys that failed. Keep it **pure** (no state, no DOM) so it's easy to unit-test and reuse on blur and on submit.

**Trim then test.** Validate the trimmed value and **send** the trimmed value. The guide's EventForm trims every string in the DTO.

**Numbers.** \`Number("")\` is 0, \`Number(" 12 ")\` is 12, \`Number("12abc")\` is NaN, \`Number("1e3")\` is 1000. Use \`value.trim() !== "" && Number.isInteger(n) && n > 0\` and add an upper bound if the domain has one. \`parseInt("12abc")\` is 12 — too lenient.

**Emails.** A pragmatic regex such as \`/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/\` catches typos; a "perfect" RFC regex is impractical and still can't tell whether the mailbox exists. \`<input type="email">\` adds browser checks. Real verification = sending a confirmation email.

**When to show errors.** Validate on submit; then re-validate on change/blur for fields that already have an error (avoid shouting at users before they've finished typing). React Hook Form's \`mode: "onTouched"\` (used in the guide) does exactly this.

**Accessible errors:**

\`\`\`tsx
<label htmlFor="location">Location</label>
<input id="location" aria-invalid={!!errors.location}
       aria-describedby={errors.location ? "location-error" : undefined} />
{errors.location && <p id="location-error">{errors.location}</p>}
\`\`\`

Move focus to the first invalid field on submit, and show a form-level summary (\`role="alert"\`) for errors not tied to a field.

**Server 400s.** CampusEvents returns plain-text BadRequest messages ("End date must be after the start date.") and, for model-binding failures, ProblemDetails with \`errors: { "Title": ["..."] }\`. Map known keys to fields (lower-camel-case them) and show the rest as a form-level error (the guide uses \`setError("root.server", …)\`).`,
      deep: `**Two validation layers, different purposes.** The client layer optimises *user experience*: immediacy, specificity, no wasted requests. The server layer guarantees *integrity and security*: it is the only layer an attacker can't skip. The CampusEvents API validates things the client can't know reliably — the category still exists, capacity isn't below already-booked tickets — so even a perfect client validator will sometimes receive a 400. Design the form for that path from day one (Week 05, Slide 36).

**Validation is not sanitisation.** Validation rejects bad input; output encoding prevents injection. React escapes text content by default, so rendering a malicious event title as \`{event.title}\` is safe; \`dangerouslySetInnerHTML\` is not. SQL injection is prevented server-side by parameterised queries (EF Core), not by the form.

**Single source of rules.** Duplicating rules in the client and server means they can drift (client allows 200 chars, server allows 120 → confusing 400s). Options: share a schema (Zod on a Node backend), generate client rules from OpenAPI metadata, or at minimum keep the client rules a subset of the server's.

**Error-state UX details.**
- Don't disable submit just because the form is invalid; let users press it and see *why* (disabled buttons give no feedback).
- Preserve input on error; focus the first invalid field; keep messages persistent (not toasts that disappear).
- Use \`aria-describedby\` to link hint text and error text; \`aria-invalid="true"\` only after validation has run.
- Colour + icon + text (Slide 25: "do not rely on colour alone").

**Internationalisation & edge cases.** \`trim()\` handles Unicode whitespace; names and locations can contain any script — don't restrict to \`[A-Za-z]\`. Dates from \`datetime-local\` are local time without zone; compare as \`Date\` objects and send ISO strings (the guide's \`toApiDate\`).

**Testing.** Pure validators make excellent unit tests: table-driven cases for blank, whitespace-only, 0, -1, 2.5, "abc", "10".`,
    },
    mechanism: `\`\`\`text
 submit ─► values ─► validate(values) ─► errors {}
                          │
          ┌───────────────┴──────────────────┐
     keys > 0                              keys = 0
          │                                   │
  setErrors(errors)                     build DTO (trimmed, converted)
  aria-invalid + messages                     │
  focus first invalid field            POST /api/events ─────────────► SERVER validation
          │                                   │                         (authoritative)
     user fixes & resubmits          ┌────────┴─────────┐
                                    2xx               400 "End date must be after..."
                                     │                 │
                                 success          map to field / form-level error
                                                   (keep input, let user fix)

 BYPASS PATH: Postman / curl / DevTools ───────────────────────────► SERVER validation still runs
\`\`\``,
    simpleExample: {
      title: "Mock D3(a): validation function returning errors",
      language: "ts",
      code: `export interface EventFormValues {
  eventName: string;
  location: string;
  maxAttendees: string;
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

  const raw = values.maxAttendees.trim();
  const max = Number(raw);
  if (raw === "" || !Number.isInteger(max) || max <= 0) {
    errors.maxAttendees = "Maximum attendees must be a positive whole number.";
  }

  return errors;
}

// validateEvent({ eventName: "  ", location: "Hall A", maxAttendees: "2.5" })
// → { eventName: "Event name is required.", maxAttendees: "Maximum attendees must be a positive whole number." }`,
      walkthrough: [
        { lines: "1-5", text: "Form values are strings (they come from inputs)." },
        { lines: "7", text: "Errors object: optional message per field; empty object = valid." },
        { lines: "12-14", text: "Required after trimming — whitespace-only names are rejected." },
        { lines: "16-18", text: "Same rule for location." },
        { lines: "20-24", text: "Positive integer: not blank, `Number.isInteger` rejects NaN/decimals, `> 0` rejects zero and negatives." },
        { lines: "26", text: "Return the errors so the caller decides how to display them and whether to submit." },
      ],
    },
    realExample: {
      title: "Accessible form with field errors, focus management and server 400 mapping",
      language: "tsx",
      code: `import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { validateEvent, type EventFormErrors, type EventFormValues } from "./validateEvent";
import { createEvent } from "./eventApi";

const EMAIL_PATTERN = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
export const isPlausibleEmail = (v: string) => EMAIL_PATTERN.test(v.trim());

interface ProblemDetails {
  title?: string;
  errors?: Record<string, string[]>;
}

export default function CreateEventForm() {
  const [values, setValues] = useState<EventFormValues>({ eventName: "", location: "", maxAttendees: "" });
  const [errors, setErrors] = useState<EventFormErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    const next = { ...values, [name]: value };
    setValues(next);
    if (errors[name as keyof EventFormValues]) setErrors(validateEvent(next));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    const found = validateEvent(values);
    setErrors(found);
    setFormError(null);
    const firstInvalid = Object.keys(found)[0];
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLInputElement>("#" + firstInvalid)?.focus();
      return;
    }

    setSubmitting(true);
    const response = await createEvent({
      eventName: values.eventName.trim(),
      location: values.location.trim(),
      maxAttendees: Number(values.maxAttendees),
    });
    setSubmitting(false);

    if (response.status === 400) {
      const text = await response.text();
      try {
        const problem = JSON.parse(text) as ProblemDetails;
        const mapped: EventFormErrors = {};
        for (const [key, messages] of Object.entries(problem.errors ?? {})) {
          const field = (key.charAt(0).toLowerCase() + key.slice(1)) as keyof EventFormValues;
          if (field in values) mapped[field] = messages[0];
        }
        setErrors(mapped);
        setFormError(problem.title ?? "Please correct the errors below.");
      } catch {
        setFormError(text || "The server rejected the event.");
      }
    } else if (!response.ok) {
      setFormError("Could not create the event (HTTP " + response.status + ").");
    }
  }

  const field = (name: keyof EventFormValues, label: string, type = "text") => (
    <div>
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        value={values[name]}
        onChange={handleChange}
        aria-invalid={errors[name] ? true : undefined}
        aria-describedby={errors[name] ? name + "-error" : undefined}
      />
      {errors[name] && <p id={name + "-error"} className="text-danger">⚠ {errors[name]}</p>}
    </div>
  );

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate>
      {formError && <div role="alert">{formError}</div>}
      {field("eventName", "Event name")}
      {field("location", "Location")}
      {field("maxAttendees", "Maximum attendees", "number")}
      <button type="submit" disabled={submitting}>{submitting ? "Saving..." : "Create event"}</button>
    </form>
  );
}`,
      walkthrough: [
        { lines: "5-6", text: "A pragmatic email check for other forms: catches typos, not deliverability. (Backslashes are real regex escapes.)" },
        { lines: "20-25", text: "Re-validate on change only for fields already showing an error — no nagging while typing." },
        { lines: "30-37", text: "Validate on submit; focus the first invalid field and don't send." },
        { lines: "39-44", text: "Send trimmed, converted values." },
        { lines: "47-60", text: "Map a server 400: ProblemDetails `errors` keys (e.g. `EventName`) to form fields; plain-text messages become a form-level error." },
        { lines: "67-77", text: "Each input has a label, `aria-invalid` when invalid, and `aria-describedby` pointing at its message; text + icon, not colour alone." },
        { lines: "84", text: "`noValidate` so our consistent messages replace browser tooltips." },
      ],
    },
    mistakes: [
      {
        mistake: "`if (values.eventName === \"\")` — whitespace-only names pass.",
        fix: "Trim first: `values.eventName.trim() === \"\"`, and send the trimmed value.",
      },
      {
        mistake: "Checking `maxAttendees > 0` on the string, or using `parseInt` so `\"2.5\"` and `\"12abc\"` pass.",
        fix: "`const n = Number(raw); Number.isInteger(n) && n > 0` with a blank check.",
      },
      {
        mistake: "Treating client validation as protection and skipping server checks.",
        fix: "Client validation is UX; the API must validate everything (mock B9 is False).",
      },
      {
        mistake: "Error messages only shown by red borders, not linked to inputs.",
        fix: "Text messages + `aria-invalid` + `aria-describedby`; don't rely on colour alone.",
      },
      {
        mistake: "Ignoring the server's 400 message and showing 'Something went wrong'.",
        fix: "Read the body (text or ProblemDetails) and show it next to the field or at the top of the form.",
      },
    ],
    debug: {
      prompt:
        "The validator lets through `maxAttendees` values of `\"2.5\"`, `\"-3\"` and `\"   \"`, and an event name of three spaces. Fix it.",
      language: "ts",
      buggyCode: `function validate(v: { eventName: string; location: string; maxAttendees: string }) {
  const errors: Record<string, string> = {};
  if (!v.eventName) errors.eventName = "Required";
  if (!v.location) errors.location = "Required";
  if (isNaN(parseInt(v.maxAttendees))) errors.maxAttendees = "Must be a number";
  return errors;
}`,
      hint: "Is `\"   \"` truthy? What does `parseInt(\"2.5\")` return? Is a negative number checked anywhere?",
      fixedCode: `function validate(v: { eventName: string; location: string; maxAttendees: string }) {
  const errors: Partial<Record<"eventName" | "location" | "maxAttendees", string>> = {};
  if (v.eventName.trim() === "") errors.eventName = "Event name is required.";
  if (v.location.trim() === "") errors.location = "Location is required.";
  const raw = v.maxAttendees.trim();
  const n = Number(raw);
  if (raw === "" || !Number.isInteger(n) || n <= 0) {
    errors.maxAttendees = "Maximum attendees must be a positive whole number.";
  }
  return errors;
}`,
      explanation:
        "`\"   \"` is a non-empty string (truthy), so it passed; trim first. `parseInt(\"2.5\")` is 2 and `parseInt(\"-3\")` is -3 — both not NaN — and `parseInt(\"   \")` is NaN only by luck. Use `Number` + `Number.isInteger` + a positivity check, and write messages that say how to fix the problem.",
    },
    challenge: {
      prompt:
        "Extend `validateEvent` for the CampusEvents fields: `title` (3–120 chars after trim), `startDate`/`endDate` required with endDate after startDate, `price` ≥ 0 (decimals allowed), `capacity` positive integer, `categoryId` must be selected. Return `Partial<Record<keyof CampusEventForm, string>>`.",
      starterCode: `export interface CampusEventForm {
  title: string;
  startDate: string;
  endDate: string;
  price: string;
  capacity: string;
  categoryId: string;
}`,
      language: "ts",
      hints: [
        "Cross-field rule: only compare dates when both are present; attach the error to `endDate`.",
        "Price: `Number.isFinite(n) && n >= 0`.",
        "categoryId: `Number.isInteger(n) && n > 0`.",
      ],
      solution: `export interface CampusEventForm {
  title: string;
  startDate: string;
  endDate: string;
  price: string;
  capacity: string;
  categoryId: string;
}

export type CampusEventErrors = Partial<Record<keyof CampusEventForm, string>>;

export function validateCampusEvent(v: CampusEventForm): CampusEventErrors {
  const errors: CampusEventErrors = {};

  const title = v.title.trim();
  if (title.length < 3) errors.title = "Title must be at least 3 characters.";
  else if (title.length > 120) errors.title = "Title must be no more than 120 characters.";

  if (!v.startDate) errors.startDate = "Start date is required.";
  if (!v.endDate) errors.endDate = "End date is required.";
  if (v.startDate && v.endDate && new Date(v.endDate) <= new Date(v.startDate)) {
    errors.endDate = "End date must be after the start date.";
  }

  const price = Number(v.price);
  if (v.price.trim() === "" || !Number.isFinite(price) || price < 0) {
    errors.price = "Price cannot be negative.";
  }

  const capacity = Number(v.capacity);
  if (v.capacity.trim() === "" || !Number.isInteger(capacity) || capacity < 1) {
    errors.capacity = "Capacity must be a whole number of at least 1.";
  }

  const categoryId = Number(v.categoryId);
  if (!Number.isInteger(categoryId) || categoryId <= 0) {
    errors.categoryId = "Select a category.";
  }

  return errors;
}`,
      explanation:
        "These rules mirror the guide's Zod schema and the backend's checks (end after start). The cross-field error is attached to `endDate` so it appears beside the field the user should change. The server still validates — e.g. that the category exists — and may return 400 anyway.",
    },
    examQuestions: [
      {
        question:
          "**(D3a, 4 marks)** Write a JavaScript or TypeScript validation function for an event form: Event Name not empty, Location not empty, Maximum Attendees a positive integer. Return suitable validation errors.",
        answer: `\`\`\`ts
function validateEvent(v: { eventName: string; location: string; maxAttendees: string }) {
  const errors: { eventName?: string; location?: string; maxAttendees?: string } = {};
  if (v.eventName.trim() === "") errors.eventName = "Event name is required.";
  if (v.location.trim() === "") errors.location = "Location is required.";
  const n = Number(v.maxAttendees);
  if (v.maxAttendees.trim() === "" || !Number.isInteger(n) || n <= 0)
    errors.maxAttendees = "Maximum attendees must be a positive whole number.";
  return errors; // {} means valid
}
\`\`\`
Marks: name check with trim (1), location check (1), positive-integer check incl. Number.isInteger and > 0 (1), returns an errors object usable by the UI (1).`,
        marks: 4,
      },
      {
        question:
          "**(B9, True/False)** Client-side validation guarantees that invalid data can never reach a server.",
        answer:
          "**False.** Client-side code can be bypassed (DevTools, disabled JS, Postman/curl). The server must validate all input; client validation only improves UX.",
        marks: 1,
      },
      {
        question:
          "**(A17)** A developer wants to prevent a form being submitted if an email address does not meet a required format. Which approach is most appropriate?",
        answer:
          "**A — client-side validation** (e.g. a format check on submit with an error message), backed by server-side validation of the same rule.",
        marks: 1,
      },
      {
        question:
          "Name two attributes that make a validation error accessible to screen-reader users and explain each.",
        answer:
          "`aria-invalid=\"true\"` on the input announces that its value is invalid. `aria-describedby=\"field-error\"` links the input to the element containing the error text so it's read with the field. (Also: a proper `<label htmlFor>`, and `role=\"alert\"` for a form-level summary.)",
        marks: 2,
      },
    ],
    revision: [
      "Validator = pure function → errors object; `{}` means valid (mock D3a).",
      "Required = `value.trim() !== \"\"`; send trimmed values.",
      "Positive integer: `Number(raw)`, `Number.isInteger(n) && n > 0`, reject blank.",
      "Rule kinds: required, format, range, cross-field (Week 05 Slide 25).",
      "Accessible: label + `aria-invalid` + `aria-describedby`; text, not colour alone.",
      "Email regex catches typos only; real check = confirmation email.",
      "Client validation is UX, not security (A17 yes / B9 False); map server 400 messages back to the form.",
    ],
    visualizers: ["form-validation"],
  },

  /* ================================================================== */
  /* 15. forms-zod-rhf                                                   */
  /* ================================================================== */
  {
    id: "forms-zod-rhf",
    moduleId: "m08-forms-crud",
    title: "Schema Validation with Zod and React Hook Form",
    summary:
      "Describe form rules once as a Zod schema (coerce, refine/superRefine for endDate > startDate), connect it with zodResolver to React Hook Form, infer types with z.infer, and reuse one EventForm for create and edit.",
    priority: "P0",
    examCritical: true,
    minutes: 40,
    objectives: [
      "Write a Zod object schema for the CampusEvents form (Week 05 Slide 26), using `z.coerce` for numeric inputs.",
      "Add a cross-field rule (endDate after startDate) with `refine`/`superRefine` and attach it to the right field.",
      "Wire the schema into React Hook Form with `zodResolver`, `register`, `handleSubmit` and `formState.errors`.",
      "Derive TypeScript types with `z.infer`/`z.input`/`z.output` and build a reusable create/edit EventForm.",
    ],
    prerequisites: ["forms-validation", "forms-controlled-inputs", "ts-basics-interfaces"],
    sources: [
      w05("Slide 26 (Zod eventSchema: trim, min, coerce.number, int, positive; cross-field rule), Slide 27 (create and edit forms: reuse without over-abstracting)"),
      guide("Section 2 (npm install @hookform/resolvers react-hook-form zod), File 12 (EventForm: zodResolver, superRefine endDate rule, register, reset, setError('root.server'), isSubmitting), Files 17–18 (EventNew/EventEdit reuse EventForm)"),
      { kind: "supplementary", label: "Zod documentation", url: "https://zod.dev/" },
      { kind: "supplementary", label: "React Hook Form documentation", url: "https://react-hook-form.com/" },
    ],
    why: `Hand-written validators work, but on a real form (nine CampusEvents fields, a cross-field date rule, numbers that arrive as strings, create *and* edit modes) they get long, and the rules, the TypeScript types and the error display drift apart.

**Zod** lets you declare the rules once as a **schema** (Week 05, Slide 26); the same schema produces the TypeScript type (\`z.infer\`) and can coerce \`"80"\` into \`80\`. **React Hook Form** handles field registration, touched/dirty tracking, submit state and error objects with very few re-renders. \`zodResolver\` connects the two. The Campus Event guide's reusable **EventForm** (File 12) is built exactly this way and is shared by the create and edit pages (Slide 27).`,
    analogy: `A Zod schema is a **customs declaration form with the rules printed on it**: "Weight: number, at least 0", "Arrival date must be after departure date". Anyone (the form, a unit test, an API response check) can hold a package up against it and get back either "approved — here's the cleaned-up package" or a list of exactly which boxes are wrong.

React Hook Form is the **clerk** who hands out the form, keeps track of which boxes you've filled in and touched, and only bothers you about a box after you've had a go at it. \`zodResolver\` is the clerk agreeing to use *that* printed rulebook rather than inventing their own.`,
    explain: {
      beginner: `A **Zod schema** describes what valid data looks like:

\`\`\`ts
import { z } from "zod";

const eventSchema = z.object({
  title: z.string().trim().min(1, "Enter a title"),
  capacity: z.coerce.number().int().positive(),
});
\`\`\`

- \`z.string().trim().min(1, "...")\` — a string that, after trimming, is not empty; the second argument is the error message.
- \`z.coerce.number()\` — **convert** the value to a number first (form inputs give strings like \`"80"\`), then check it.
- \`.int()\` / \`.positive()\` — whole number, greater than 0.

You can check data with \`eventSchema.safeParse(data)\`: it returns \`{ success: true, data }\` or \`{ success: false, error }\`.

You also get a TypeScript type for free:

\`\`\`ts
type EventFormValues = z.infer<typeof eventSchema>; // { title: string; capacity: number }
\`\`\`

**React Hook Form** manages the form for you:

\`\`\`tsx
const { register, handleSubmit, formState: { errors, isSubmitting } } =
  useForm({ resolver: zodResolver(eventSchema) });

<form onSubmit={handleSubmit(onValid)}>
  <input {...register("title")} />
  {errors.title && <p>{errors.title.message}</p>}
</form>
\`\`\`

- \`register("title")\` connects an input to the form (name, onChange, onBlur, ref).
- \`handleSubmit(onValid)\` prevents the page reload, runs the schema, and calls \`onValid\` **only if everything is valid**.
- \`errors.title.message\` is the message from your schema.
- \`isSubmitting\` is true while your async \`onValid\` runs — use it to disable the button.

**Cross-field rules** like "end date after start date" go on the whole object with \`.refine()\` or \`.superRefine()\`, and you tell Zod which field to attach the error to with \`path: ["endDate"]\`.`,
      developer: `**Schema (Zod 4) mirroring the guide:**

\`\`\`ts
const eventSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters.").max(120),
  location: z.string().trim().min(2, "Location must be at least 2 characters."),
  startDate: z.string().min(1, "Start date is required."),
  endDate: z.string().min(1, "End date is required."),
  price: z.coerce.number().min(0, "Price cannot be negative."),
  capacity: z.coerce.number().int("Capacity must be a whole number.").min(1),
  categoryId: z.coerce.number().int().min(1, "Select a category."),
}).refine((v) => new Date(v.endDate) > new Date(v.startDate), {
  message: "End date must be after the start date.",
  path: ["endDate"],
});
\`\`\`

\`superRefine((v, ctx) => ctx.addIssue({ code: "custom", path: ["endDate"], message }))\` is the flexible variant (multiple issues, conditional logic) used in the guide; the guide writes \`z.ZodIssueCode.custom\`, which Zod 4 still accepts but the plain string \`"custom"\` is the modern form.

**Input vs output types.** With \`z.coerce\`, the schema's *input* (what the form holds) differs from its *output* (what you submit): \`z.input<typeof s>\` has \`capacity: unknown\`, \`z.output<typeof s>\` (= \`z.infer\`) has \`capacity: number\`. Tell RHF both:

\`\`\`ts
type FormInput = z.input<typeof eventSchema>;
type FormOutput = z.output<typeof eventSchema>;
const form = useForm<FormInput, unknown, FormOutput>({ resolver: zodResolver(eventSchema), mode: "onTouched" });
\`\`\`

Now \`handleSubmit\` hands you typed numbers. (If you see a resolver type error with \`useForm<z.infer<...>>\` and coerced fields, this is why.)

**Key RHF APIs:** \`register\`, \`handleSubmit\`, \`formState: { errors, isSubmitting, isDirty }\`, \`reset(values)\` to load edit data, \`setError("root.server", { message })\` for API errors, \`setError("title", ...)\` for a field-level server error. \`mode: "onTouched"\` validates a field after first blur, then on every change.

**Reusable EventForm** (Slide 27): props \`defaultValues\`, \`onSubmit(dto)\`, \`submitLabel\`. Create page passes nothing and POSTs; edit page loads the record, converts dates for \`datetime-local\`, passes \`defaultValues\`, and PUTs. Page-specific loading and navigation stay in the pages.`,
      deep: `**Parse, don't validate.** \`schema.parse(data)\` returns a *new, typed, transformed* value (trimmed strings, coerced numbers) — the "output" type. That's why it's attractive to also parse **API responses** at the service boundary: TypeScript interfaces are erased at runtime, while a Zod schema actually checks the JSON from the server (\`EventSchema.array().parse(await res.json())\`).

**Coercion caveats.** \`z.coerce.number()\` runs \`Number(value)\`: \`""\` → 0, \`" "\` → 0, \`null\` → 0, \`"abc"\` → NaN (rejected). So an empty "capacity" becomes 0 and fails \`.min(1)\` — fine — but an empty "price" becomes 0 and **passes** \`.min(0)\`. If "required" matters, validate the string first (\`z.string().min(1).pipe(z.coerce.number())\`) or use RHF's \`register("price", { valueAsNumber: true })\` with \`z.number()\` (empty → NaN → rejected).

**Refinement timing.** Object-level \`refine\`/\`superRefine\` run only after the object's own field checks pass. If \`title\` is invalid, the date refinement won't run on that pass, so users may see the date error only after fixing other fields. Zod 4 offers \`when\` on refinements to control this; alternatively compute the rule in \`superRefine\` with explicit guards (the guide checks \`values.startDate && values.endDate\`).

**Re-render performance.** RHF registers *uncontrolled* inputs (via refs) and subscribes to \`formState\` lazily: reading \`errors\` only re-renders when errors change, so typing in one field doesn't re-render the whole form. Use \`Controller\`/\`useController\` for custom controlled components (date pickers, selects from UI kits).

**Edit-form reset.** \`defaultValues\` are read once at mount. Loading data later requires \`reset(newValues)\` (guide: \`useEffect(() => { if (defaultValues) reset(...) }, [defaultValues, reset])\`), and \`defaultValues\` should be memoised (\`useMemo\`, File 18) so the effect doesn't reset on every render and wipe user edits.

**Server errors.** \`setError("root.server", ...)\` stores an error not tied to a field; it's cleared on the next submit. Map ProblemDetails field errors with \`setError(fieldName, { type: "server", message })\`. The server stays authoritative (category exists, capacity ≥ booked tickets).`,
    },
    mechanism: `\`\`\`text
 <input {...register("capacity")}>  (uncontrolled; RHF holds refs)
           │ "80" (string)
           ▼
 handleSubmit(onValid)  ─► e.preventDefault()
           │
           ▼
 zodResolver(eventSchema)
   1. field checks:  title trim/min ✓  capacity coerce "80"→80 int ✓ ...
   2. object refine: new Date(endDate) > new Date(startDate) ?
           │                                        │
         all ok                                   issues
           │                                        ▼
           ▼                         formState.errors = { endDate: { message } }
 onValid(values: z.output<…>)        (path:["endDate"] puts it on that field)
   capacity: number (80)
           │  isSubmitting = true
           ▼
 await onSubmit(dto)  ── throws ──► setError("root.server", { message })
           │ ok
       navigate / reset
\`\`\``,
    simpleExample: {
      title: "Week 05 Slide 26 schema with a cross-field refine, validated outside React",
      language: "ts",
      code: `import { z } from "zod";

export const eventSchema = z
  .object({
    title: z.string().trim().min(1, "Enter a title"),
    startDate: z.string().min(1, "Choose a start date"),
    endDate: z.string().min(1, "Choose an end date"),
    location: z.string().trim().min(1, "Enter a location"),
    price: z.coerce.number().min(0, "Price cannot be negative"),
    capacity: z.coerce.number().int("Whole numbers only").positive("Capacity must be at least 1"),
    categoryId: z.coerce.number().int().positive("Select a category"),
  })
  .refine((v) => new Date(v.endDate) > new Date(v.startDate), {
    message: "End date must be after the start date.",
    path: ["endDate"],
  });

export type EventFormValues = z.infer<typeof eventSchema>;

const result = eventSchema.safeParse({
  title: "  Hackathon ",
  startDate: "2026-12-01T10:00",
  endDate: "2026-12-01T09:00",
  location: "Lab 3",
  price: "0",
  capacity: "80",
  categoryId: "2",
});

if (!result.success) {
  console.log(result.error.issues.map((i) => i.path.join(".") + ": " + i.message));
  // ["endDate: End date must be after the start date."]
}`,
      walkthrough: [
        { lines: "5", text: "`trim()` transforms, `min(1)` then checks — whitespace-only titles fail (Slide 25 'required after trimming')." },
        { lines: "9-11", text: "`z.coerce.number()` converts the strings that inputs produce; `int`/`positive` check the result." },
        { lines: "13-16", text: "Cross-field rule on the whole object; `path` attaches the message to `endDate` so the form shows it beside that field." },
        { lines: "18", text: "`z.infer` derives the output TypeScript type — numbers for price/capacity/categoryId." },
        { lines: "20-28", text: "`safeParse` never throws; it returns success + data or an error with issues." },
      ],
    },
    realExample: {
      title: "Reusable EventForm with React Hook Form + zodResolver, used by create and edit pages",
      language: "tsx",
      code: `import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { EventDto } from "../types/EventDto";

const eventSchema = z
  .object({
    title: z.string().trim().min(3, "Title must be at least 3 characters.").max(120, "Title must be no more than 120 characters."),
    description: z.string().trim().min(10, "Description must be at least 10 characters."),
    location: z.string().trim().min(2, "Location must be at least 2 characters."),
    startDate: z.string().min(1, "Start date is required."),
    endDate: z.string().min(1, "End date is required."),
    price: z.coerce.number().min(0, "Price cannot be negative."),
    capacity: z.coerce.number().int("Capacity must be a whole number.").min(1, "Capacity must be at least 1."),
    categoryId: z.coerce.number().int().min(1, "Select a category."),
  })
  .superRefine((v, ctx) => {
    if (v.startDate && v.endDate && new Date(v.endDate) <= new Date(v.startDate)) {
      ctx.addIssue({ code: "custom", path: ["endDate"], message: "End date must be after the start date." });
    }
  });

type FormInput = z.input<typeof eventSchema>;
type FormOutput = z.output<typeof eventSchema>;

interface EventFormProps {
  defaultValues?: Partial<FormInput>;
  onSubmit: (dto: EventDto) => Promise<void>;
  submitLabel: string;
}

const emptyValues: FormInput = {
  title: "", description: "", location: "", startDate: "", endDate: "", price: 0, capacity: 1, categoryId: 0,
};

export default function EventForm({ defaultValues, onSubmit, submitLabel }: EventFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormInput, unknown, FormOutput>({
    resolver: zodResolver(eventSchema),
    mode: "onTouched",
    defaultValues: { ...emptyValues, ...defaultValues },
  });

  useEffect(() => {
    if (defaultValues) reset({ ...emptyValues, ...defaultValues });
  }, [defaultValues, reset]);

  async function submit(values: FormOutput) {
    const dto: EventDto = {
      ...values,
      imageUrl: null,
      startDate: new Date(values.startDate).toISOString(),
      endDate: new Date(values.endDate).toISOString(),
    };
    try {
      await onSubmit(dto);
    } catch (err) {
      setError("root.server", { type: "server", message: err instanceof Error ? err.message : "Unexpected error." });
    }
  }

  return (
    <form onSubmit={handleSubmit(submit)} noValidate>
      {errors.root?.server && <div role="alert" className="alert alert-danger">{errors.root.server.message}</div>}

      <label htmlFor="title">Title</label>
      <input id="title" aria-invalid={!!errors.title} aria-describedby="title-error" {...register("title")} />
      {errors.title && <p id="title-error" className="text-danger">{errors.title.message}</p>}

      <label htmlFor="endDate">End date and time</label>
      <input id="endDate" type="datetime-local" aria-invalid={!!errors.endDate} {...register("endDate")} />
      {errors.endDate && <p className="text-danger">{errors.endDate.message}</p>}

      <label htmlFor="capacity">Capacity</label>
      <input id="capacity" type="number" min="1" step="1" {...register("capacity")} />
      {errors.capacity && <p className="text-danger">{errors.capacity.message}</p>}

      {/* description, location, startDate, price and categoryId follow the same pattern */}

      <button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." : submitLabel}</button>
    </form>
  );
}

// EventNew:  <EventForm submitLabel="Create event"
//              onSubmit={async (dto) => { const c = await eventService.create(dto, token); navigate("/events/" + c.id, { replace: true }); }} />
// EventEdit: <EventForm submitLabel="Save changes" defaultValues={memoisedValues}
//              onSubmit={async (dto) => { await eventService.update(eventId, dto, token); navigate("/events/" + eventId); }} />`,
      walkthrough: [
        { lines: "7-22", text: "The guide's schema: trims, lengths, coerced numbers, and a `superRefine` that attaches the date error to `endDate`." },
        { lines: "24-25", text: "Input type (what fields hold before coercion) vs output type (numbers after parsing)." },
        { lines: "42-46", text: "`useForm<Input, Context, Output>` + `zodResolver`; `onTouched` validates after first blur." },
        { lines: "48-50", text: "Edit mode: when loaded values arrive, `reset` fills the form (pass memoised defaultValues)." },
        { lines: "52-64", text: "`submit` runs only with valid, typed data; the DTO converts datetime-local to ISO. API failures become a root-level form error." },
        { lines: "67", text: "`handleSubmit` prevents default, validates, then calls `submit`." },
        { lines: "71", text: "`register` wires name/onChange/onBlur/ref — no manual state per field." },
        { lines: "84", text: "`isSubmitting` is true while the async `submit` runs — duplicate-submit protection for free." },
        { lines: "88-91", text: "The same form serves both pages; only the submit behaviour and initial values differ (Slide 27)." },
      ],
    },
    mistakes: [
      {
        mistake: "Using `z.number()` for an `<input type=\"number\">` registered normally — it always fails because the value is a string.",
        fix: "Use `z.coerce.number()` (or `register(name, { valueAsNumber: true })` with `z.number()`).",
      },
      {
        mistake: "Putting the endDate > startDate rule on the `endDate` field alone (it can't see startDate).",
        fix: "Use object-level `refine`/`superRefine` with `path: [\"endDate\"]`.",
      },
      {
        mistake: "Typing the form as `useForm<z.infer<typeof schema>>` with coerced fields and fighting resolver type errors.",
        fix: "`useForm<z.input<typeof s>, unknown, z.output<typeof s>>`.",
      },
      {
        mistake: "Passing new `defaultValues` to an edit form after data loads and expecting the fields to update.",
        fix: "defaultValues are read once; call `reset(values)` when the record arrives (memoise the values).",
      },
      {
        mistake: "Assuming the Zod schema makes server validation unnecessary.",
        fix: "It is still client-side; the API re-validates and may return 400 (category missing, capacity below bookings).",
      },
    ],
    debug: {
      prompt:
        "The edit form shows the date error under the wrong place (a generic message at the top), capacity '80' is always rejected with 'Expected number, received string', and after the event loads the fields stay empty. Fix the three bugs.",
      language: "tsx",
      buggyCode: `const schema = z
  .object({
    startDate: z.string().min(1),
    endDate: z.string().min(1),
    capacity: z.number().int().positive(),
  })
  .refine((v) => new Date(v.endDate) > new Date(v.startDate), "End must be after start");

function EditForm({ event }: { event?: { startDate: string; endDate: string; capacity: number } }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: event, // undefined on first render, loaded later
  });
  // ...
}`,
      hint: "Where does an object-level refine put its issue without `path`? What type does an input's value have? When are defaultValues read?",
      fixedCode: `const schema = z
  .object({
    startDate: z.string().min(1),
    endDate: z.string().min(1),
    capacity: z.coerce.number().int().positive(),
  })
  .refine((v) => new Date(v.endDate) > new Date(v.startDate), {
    message: "End date must be after the start date.",
    path: ["endDate"],
  });

type Input = z.input<typeof schema>;
type Output = z.output<typeof schema>;

function EditForm({ event }: { event?: { startDate: string; endDate: string; capacity: number } }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Input, unknown, Output>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (event) reset(event);
  }, [event, reset]);
  // ...
}`,
      explanation:
        "(1) Without `path`, the refine issue belongs to the root object, so it never appears under `errors.endDate`. (2) Registered inputs produce strings; `z.number()` rejects them — `z.coerce.number()` converts first. (3) RHF reads `defaultValues` once at mount, when `event` was still undefined; call `reset` when the data arrives. (In real code, convert ISO dates to `datetime-local` format before resetting, as the guide's `toLocalDateTimeInput` does.)",
    },
    challenge: {
      prompt:
        "Write a Zod schema and React Hook Form component for a 'Book tickets' form: `numberOfTickets` (integer 1–10), `email` (valid email), `confirmEmail` (must match `email`, error on `confirmEmail`). On valid submit call `onBook({ numberOfTickets, email })`, show server errors at the form level, and disable the button while submitting.",
      language: "tsx",
      hints: [
        "`z.email()` (Zod 4) or `z.string().email()` for the email field.",
        "Matching fields → object-level `refine` with `path: [\"confirmEmail\"]`.",
        "Use `z.input`/`z.output` with `useForm` because of coercion.",
      ],
      solution: `import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const bookingSchema = z
  .object({
    numberOfTickets: z.coerce.number().int("Whole tickets only.").min(1, "Book at least 1 ticket.").max(10, "Maximum 10 tickets."),
    email: z.email("Enter a valid email address."),
    confirmEmail: z.string(),
  })
  .refine((v) => v.email === v.confirmEmail, {
    message: "Email addresses do not match.",
    path: ["confirmEmail"],
  });

type BookingInput = z.input<typeof bookingSchema>;
type BookingOutput = z.output<typeof bookingSchema>;

export function BookTicketsForm({ onBook }: { onBook: (b: { numberOfTickets: number; email: string }) => Promise<void> }) {
  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } =
    useForm<BookingInput, unknown, BookingOutput>({
      resolver: zodResolver(bookingSchema),
      defaultValues: { numberOfTickets: 1, email: "", confirmEmail: "" },
    });

  async function submit(values: BookingOutput) {
    try {
      await onBook({ numberOfTickets: values.numberOfTickets, email: values.email });
    } catch (err) {
      setError("root.server", { message: err instanceof Error ? err.message : "Booking failed." });
    }
  }

  return (
    <form onSubmit={handleSubmit(submit)} noValidate>
      {errors.root?.server && <p role="alert">{errors.root.server.message}</p>}
      <label htmlFor="numberOfTickets">Tickets</label>
      <input id="numberOfTickets" type="number" {...register("numberOfTickets")} />
      {errors.numberOfTickets && <p>{errors.numberOfTickets.message}</p>}
      <label htmlFor="email">Email</label>
      <input id="email" type="email" {...register("email")} />
      {errors.email && <p>{errors.email.message}</p>}
      <label htmlFor="confirmEmail">Confirm email</label>
      <input id="confirmEmail" type="email" {...register("confirmEmail")} />
      {errors.confirmEmail && <p>{errors.confirmEmail.message}</p>}
      <button type="submit" disabled={isSubmitting}>{isSubmitting ? "Booking..." : "Book"}</button>
    </form>
  );
}`,
      explanation:
        "Field rules live on fields, the matching rule on the object with a `path`. Coercion turns the ticket input into a number before `int/min/max`. RHF only calls `submit` with valid output data, tracks `isSubmitting`, and `setError(\"root.server\")` shows API failures (e.g. 'Not enough tickets available').",
    },
    examQuestions: [
      {
        question:
          "Write a Zod schema for an event form where `title` is required (after trimming), `capacity` is a positive integer entered in a number input, and `endDate` must be after `startDate`.",
        answer: `\`\`\`ts
const schema = z.object({
  title: z.string().trim().min(1, "Enter a title"),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  capacity: z.coerce.number().int().positive(),
}).refine((v) => new Date(v.endDate) > new Date(v.startDate), {
  message: "End date must be after the start date.",
  path: ["endDate"],
});
\`\`\`
\`trim().min(1)\` handles whitespace; \`z.coerce.number()\` converts the input's string; the object-level refine with \`path\` implements the cross-field rule on endDate.`,
        marks: 4,
      },
      {
        question: "What does `zodResolver` do in a React Hook Form setup, and what does `handleSubmit` guarantee about the values passed to your submit function?",
        answer:
          "`zodResolver(schema)` adapts the Zod schema into RHF's validation: on validation RHF passes form values to the schema and maps Zod issues into `formState.errors` by field path. `handleSubmit(fn)` prevents default submission, runs validation, and calls `fn` only when the schema succeeds — with the parsed (trimmed/coerced) values.",
        marks: 3,
      },
      {
        question: "Why does the Campus Event guide use one `EventForm` component for both creating and editing events?",
        answer:
          "Both workflows share the same fields and validation rules, so one component avoids duplicating inputs, schema and error display. The pages differ only in initial values (empty vs loaded record via `defaultValues`/`reset`) and submit behaviour (POST then navigate vs PUT then navigate), which are passed in as props (Week 05 Slide 27).",
        marks: 2,
      },
    ],
    revision: [
      "Zod schema = rules once; `z.infer`/`z.output` = TS type; `safeParse` → success/data or error.",
      "`z.string().trim().min(1, msg)` for required; `z.coerce.number().int().positive()` for numeric inputs.",
      "Cross-field: object `refine`/`superRefine` with `path: [\"endDate\"]`.",
      "`useForm<z.input<S>, unknown, z.output<S>>({ resolver: zodResolver(S) })`.",
      "`register`, `handleSubmit`, `formState.errors`, `isSubmitting`, `reset`, `setError(\"root.server\")`.",
      "Edit forms: `reset` when data loads (memoised values).",
      "One reusable EventForm for create/edit; pages own loading and submit (Slide 27).",
      "Still client-side — the API re-validates.",
    ],
    visualizers: ["form-validation"],
  },

  /* ================================================================== */
  /* 16. crud-post-put-delete                                            */
  /* ================================================================== */
  {
    id: "crud-post-put-delete",
    moduleId: "m08-forms-crud",
    title: "CRUD with POST, PUT and DELETE against CampusEvents",
    summary:
      "Create (POST → 201 + body), update (PUT → 204, no JSON), and delete (confirm → 204, or 400 if bookings exist) events with an ADMIN bearer token, refresh the list after mutations, and navigate only after success.",
    priority: "P0",
    examCritical: true,
    minutes: 40,
    objectives: [
      "Write the mock D3(b) `createEvent` function with fetch POST, JSON headers and `JSON.stringify`.",
      "Explain POST vs PUT for a frontend (mock D3c) and handle PUT's 204 without parsing JSON.",
      "Implement a confirmed DELETE that handles 204 success and the 400 'has bookings' rejection.",
      "Attach `Authorization: Bearer <token>` for ADMIN endpoints and handle 401/403.",
      "Keep the UI consistent: refresh/update the list after mutations and navigate only after success.",
    ],
    prerequisites: ["http-methods-status", "http-service-modules", "forms-validation", "router-navigation"],
    sources: [
      w05("Slide 18 (create/update payloads omit server-generated fields), Slide 29 (CRUD → HTTP methods; ADMIN only; delete may be blocked), Slides 30–32 (POST, PUT, DELETE code), Slide 33 (request states), Slide 34 (common CRUD mistakes), Slide 35 (end-to-end journey)"),
      guide("File 6 (eventService create/update/remove; update and delete return void because of 204), File 17 (EventNew), File 18 (EventEdit), File 19 (EventDetails delete with confirm)"),
      backend("EventsController.cs — [Authorize(Roles = \"ADMIN\")]; POST → CreatedAtAction (201 + EventDto); PUT → NoContent (204); DELETE → NoContent, or BadRequest 'Cannot delete an event that has bookings/reviews'"),
      postman("Section 11 — create event 201 (AdminToken), 403 with UserToken; invalid dates 400; delete only after booking/review tests"),
      mock("A13, B10, D3(b), D3(c)"),
      { kind: "supplementary", label: "MDN — Using the Fetch API (supplying request options)", url: "https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch" },
    ],
    why: `Reading data is only half an app. Admins must **create**, **edit** and **delete** events, and each action maps to an HTTP method with its own success code and failure modes (Week 05, Slide 29). Getting the details wrong produces the bugs Slide 34 lists: assuming fetch rejects on 400, parsing an empty 204 body, navigating before the save succeeded, local state that disagrees with the server, and no protection against repeat clicks.

The supplied backend adds real constraints: every mutation needs an **ADMIN** JWT (otherwise 401/403), PUT returns **204 No Content**, and DELETE is **refused with 400** if the event has bookings or reviews. Mock **D3(b)** asks you to write the POST function; **D3(c)** asks you to explain POST vs PUT.`,
    analogy: `Think of a **library catalogue** run by a head librarian (the API):

- **POST** = handing in a new-book form at the desk. The librarian assigns the shelf number (id) and hands you back the catalogue card (**201** + body). Hand in the same form twice → two cards (not idempotent).
- **PUT** = "replace the card for shelf 42 with this one". Doing it twice leaves the same card (idempotent). The librarian just nods (**204**, nothing to hand back).
- **DELETE** = "remove shelf 42's card" — but the librarian refuses if the book is currently on loan (**400** has bookings). You should ask "are you sure?" before even walking to the desk.

Only staff with a librarian badge (ADMIN token) can do any of this.`,
    explain: {
      beginner: `**CRUD** = Create, Read, Update, Delete. For CampusEvents (Week 05, Slide 29):

| Action | Method & URL | Success |
|---|---|---|
| Read list | \`GET /api/events\` | 200 + array |
| Read one | \`GET /api/events/42\` | 200 (404 if missing) |
| Create | \`POST /api/events\` | **201** + the new event |
| Update | \`PUT /api/events/42\` | **204** No Content |
| Delete | \`DELETE /api/events/42\` | **204** (or 400 if it has bookings) |

**Sending data** with fetch needs three things (Slide 30):

\`\`\`ts
await fetch(API_BASE_URL + "/events", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload),
});
\`\`\`

- \`method\` — the verb.
- \`headers\` — \`Content-Type: application/json\` tells the server the body is JSON. For admin actions add \`Authorization: "Bearer " + token\`.
- \`body\` — must be a **string**, so \`JSON.stringify\` the object.

Then **check \`response.ok\`** — fetch doesn't throw for 400/403.

**After a successful change**, make the screen match the server: refresh the list or navigate to the new/updated event. **Only after success** — if you navigate first, the user never sees the error (Slide 34).

**Deleting** is destructive: ask \`window.confirm("Delete this event?")\` first, disable the button while it runs, and show the server's message if it refuses (Slide 32).

**POST vs PUT in one sentence:** POST asks the server to *create* a new resource in a collection (server picks the id); PUT *updates/replaces* the resource at a URL you already know (\`/events/42\`).`,
      developer: `**Payload = DTO, not the response type.** \`EventDto\` (title, description, imageUrl, startDate, endDate, location, price, capacity, categoryId) omits the server-generated \`id\`, \`categoryName\` and \`availableTickets\` (Slide 18; guide File 3). Sending extra fields is at best ignored, at worst confusing.

**Status handling per operation:**
- **POST** → 201 with JSON body (EventDto incl. new \`id\`) and a \`Location\` header. Parse it; navigate to \`/events/{id}\` with \`replace\`.
- **PUT** → 204: **do not call \`response.json()\`**. The service returns \`void\` (guide File 6). If you need fresh data, GET it or invalidate your cache.
- **DELETE** → 204, or **400** "Cannot delete an event that has bookings." — read with \`response.text()\` (plain string body) and show it.
- **400** on POST/PUT: date order, category missing, capacity below booked tickets → show next to the form, keep input.
- **401** → token missing/expired → re-login. **403** → USER token on an ADMIN endpoint → "not permitted".
- **404** on PUT/DELETE → someone else deleted it → tell the user, refresh list.

**Keeping UI in sync.** Options after a mutation:
1. **Refetch** the list (simplest, always correct) — e.g. bump a reload key or \`invalidateQueries({ queryKey: ["events"] })\` with TanStack Query.
2. **Update local state from the response** — append the 201 body; remove the deleted id after 204. Do it *after* success so local state never disagrees with the server (Slide 34).
3. **Optimistic update** — change UI first, roll back on error (advanced).

**Request state for each mutation:** idle → pending (button disabled, "Saving…") → success (navigate/refresh/flash) | error (message, retry). Week 05 Slide 33.

**Auth header** is added centrally in the request helper; the guide's classroom version reads \`VITE_DEMO_ADMIN_TOKEN\` (never do that in production — anything \`VITE_\` is public).`,
      deep: `**Idempotency drives UX decisions.** A double-clicked PUT or DELETE is harmless (same final state; the second DELETE may 404). A double-clicked POST creates duplicates, so create buttons need stronger duplicate protection; production systems add idempotency keys. Never trigger mutations from \`useEffect\` — StrictMode's double-invoke in development would send them twice.

**PUT semantics in this API.** CampusEvents' \`UpdateEventDto\` requires every field, and the controller overwrites them all — true "replace" semantics. Missing fields would become defaults (e.g. \`ImageUrl\` → null). That's why the edit page loads the full record first and sends a complete DTO. PATCH (used for booking status) would send only the changed field.

**Concurrency.** Two admins editing the same event: last write wins silently. Robust APIs use ETags/\`If-Match\` or a version column and return **409 Conflict** on stale writes; the frontend then reloads and asks the user to reapply changes. The supplied API doesn't, so at least refresh after saving.

**Delete constraints are server truths.** The client can't know reliably whether an event has bookings (another user may book while the dialog is open), so the 400 path is not an edge case — design for it. Hiding the delete button when \`availableTickets < capacity\` is a reasonable hint but not a guarantee.

**window.confirm** is synchronous, blocking and unstyled; it is acceptable for coursework (Slide 32, guide File 19). Production apps use an accessible modal dialog (focus trap, \`role="dialog"\`, Escape to cancel) or an "Undo" pattern with delayed deletion.

**Navigation after mutation.** \`replace: true\` after create (Back shouldn't reopen the empty form) and after delete (the deleted details page is gone). After delete, never navigate back to the details route — it would now 404.

**Cache coherence with TanStack Query** (Week 08 preview): \`useMutation({ mutationFn: eventService.update, onSuccess: () => queryClient.invalidateQueries({ queryKey: ["events"] }) })\` marks event queries stale and refetches the active ones, so list and details agree with the server.`,
    },
    mechanism: `\`\`\`text
 CREATE  form valid ─► POST /api/events  {EventDto}  Authorization: Bearer <ADMIN>
                        ├─ 201 + {id:57,...} ─► navigate("/events/57", {replace:true}) + list refresh
                        ├─ 400 "End date must be after the start date." ─► show on form, stay
                        ├─ 401 ─► login          └─ 403 ─► "Admins only"

 UPDATE  load GET /events/57 ─► reset form ─► PUT /api/events/57 {EventDto}
                        ├─ 204 (NO BODY — don't parse) ─► navigate("/events/57") / refetch
                        ├─ 400 capacity < booked ─► show, stay      └─ 404 ─► "deleted elsewhere"

 DELETE  confirm("Delete?") ─no─► stop
            │ yes  (button disabled)
            ▼
         DELETE /api/events/57
                        ├─ 204 ─► remove from list / navigate("/events", {replace:true})
                        └─ 400 "Cannot delete an event that has bookings." ─► show, keep item
\`\`\``,
    simpleExample: {
      title: "Mock D3(b): createEvent with fetch POST, headers and JSON.stringify",
      language: "ts",
      code: `export interface NewEvent {
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
    throw new Error("Failed to create event (HTTP " + response.status + ")");
  }

  return response.json();
}

// Usage after validation passes:
// const errors = validateEvent(values);
// if (Object.keys(errors).length === 0) {
//   await createEvent({ eventName: values.eventName.trim(), location: values.location.trim(),
//                       maxAttendees: Number(values.maxAttendees) });
// }`,
      walkthrough: [
        { lines: "1-5", text: "The payload type: maxAttendees is already a number (converted after validation)." },
        { lines: "8-9", text: "POST to the collection endpoint from the question." },
        { lines: "10-13", text: "`Content-Type: application/json` describes the body; `Accept` asks for JSON back." },
        { lines: "14", text: "`JSON.stringify` serialises the object — fetch bodies must be strings (or FormData/Blob)." },
        { lines: "17-19", text: "fetch doesn't reject on 400/500, so check `response.ok` and throw." },
        { lines: "21", text: "A typical create returns 201 with the created resource — parse and return it." },
      ],
    },
    realExample: {
      title: "CampusEvents admin CRUD: service + events page with delete and refresh",
      language: "tsx",
      code: `// ---- services/eventService.ts ----
import type { Event } from "../types/Event";
import type { EventDto } from "../types/EventDto";

const API = import.meta.env.VITE_API_URL as string;

function authHeaders(token: string, json = false): HeadersInit {
  const headers: Record<string, string> = { Authorization: "Bearer " + token };
  if (json) headers["Content-Type"] = "application/json";
  return headers;
}

async function fail(response: Response): Promise<never> {
  if (response.status === 401) throw new Error("Your session has expired. Please sign in again.");
  if (response.status === 403) throw new Error("Only administrators can change events.");
  if (response.status === 404) throw new Error("This event no longer exists.");
  const text = await response.text();
  throw new Error(text || "Request failed (HTTP " + response.status + ").");
}

export async function listEvents(): Promise<Event[]> {
  const response = await fetch(API + "/events");
  if (!response.ok) return fail(response);
  return (await response.json()) as Event[];
}

export async function createEvent(dto: EventDto, token: string): Promise<Event> {
  const response = await fetch(API + "/events", {
    method: "POST",
    headers: authHeaders(token, true),
    body: JSON.stringify(dto),
  });
  if (!response.ok) return fail(response);
  return (await response.json()) as Event; // 201 Created + EventDto
}

export async function updateEvent(id: number, dto: EventDto, token: string): Promise<void> {
  const response = await fetch(API + "/events/" + id, {
    method: "PUT",
    headers: authHeaders(token, true),
    body: JSON.stringify(dto),
  });
  if (!response.ok) return fail(response); // 204 on success: nothing to parse
}

export async function deleteEvent(id: number, token: string): Promise<void> {
  const response = await fetch(API + "/events/" + id, { method: "DELETE", headers: authHeaders(token) });
  if (!response.ok) return fail(response); // 400 "Cannot delete an event that has bookings."
}

// ---- pages/AdminEvents.tsx ----
import { useCallback, useEffect, useState } from "react";

export default function AdminEvents({ token }: { token: string }) {
  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const refresh = useCallback(async () => {
    try {
      setEvents(await listEvents());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load events.");
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function handleDelete(event: Event) {
    if (!window.confirm('Delete "' + event.title + '"? This cannot be undone.')) return;
    setDeletingId(event.id);
    setError(null);
    try {
      await deleteEvent(event.id, token);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section>
      {error && <div role="alert" className="alert alert-danger">{error}</div>}
      <ul>
        {events.map((e) => (
          <li key={e.id}>
            {e.title}{" "}
            <button onClick={() => handleDelete(e)} disabled={deletingId === e.id}>
              {deletingId === e.id ? "Deleting..." : "Delete"}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}`,
      walkthrough: [
        { lines: "7-11", text: "Every mutation sends the ADMIN bearer token; Content-Type only when there is a JSON body." },
        { lines: "13-19", text: "One failure path: 401 / 403 / 404 get specific messages; 400s surface the backend's plain-text reason." },
        { lines: "27-35", text: "POST → 201 with the created EventDto, which we parse and return (e.g. to navigate to its id)." },
        { lines: "37-44", text: "PUT → 204 No Content: the function returns void and never calls `json()`." },
        { lines: "46-49", text: "DELETE → 204, or 400 when bookings/reviews exist." },
        { lines: "71-72", text: "Confirm destructive intent before sending anything (Slide 32)." },
        { lines: "73-76", text: "Disable the button for that row, call the service, then refetch so the list matches the server." },
        { lines: "77-78", text: "On failure (e.g. 'Cannot delete an event that has bookings.') the item stays and the reason is shown." },
      ],
    },
    mistakes: [
      {
        mistake: "Calling `await response.json()` after a successful PUT or DELETE (204).",
        fix: "204 has no body. Return void; refetch if you need fresh data (guide File 6).",
      },
      {
        mistake: "Sending `body: event` (an object) or forgetting `Content-Type: application/json`.",
        fix: "`body: JSON.stringify(dto)` with the JSON Content-Type header — otherwise ASP.NET Core returns 415/400.",
      },
      {
        mistake: "Navigating or removing the item from the list before the request succeeds.",
        fix: "Await the mutation; update UI/navigate only after `response.ok` (Week 05 Slide 34).",
      },
      {
        mistake: "Sending the full `Event` response object (id, categoryName, availableTickets) as the payload.",
        fix: "Send an `EventDto` matching CreateEventDto/UpdateEventDto (Slide 18).",
      },
      {
        mistake: "Forgetting the `Authorization: Bearer` header, then being confused by 401 on create.",
        fix: "Mutations are ADMIN-only; add the token centrally and handle 401 (login) vs 403 (not admin).",
      },
      {
        mistake: "Deleting without confirmation or without disabling the button.",
        fix: "`window.confirm` (or a dialog) first; disable while pending; show the 400 reason if refused.",
      },
    ],
    debug: {
      prompt:
        "Admins say: 'Saving an edited event shows \"Unexpected end of JSON input\" even though the change is saved. Deleting an event with bookings makes it disappear from the list until I refresh.' Fix the service and handler.",
      language: "ts",
      buggyCode: `export async function updateEvent(id: number, dto: EventDto, token: string) {
  const response = await fetch(API + "/events/" + id, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
    body: JSON.stringify(dto),
  });
  return response.json();
}

async function handleDelete(id: number) {
  setEvents((prev) => prev.filter((e) => e.id !== id));
  await fetch(API + "/events/" + id, { method: "DELETE", headers: { Authorization: "Bearer " + token } });
}`,
      hint: "What status and body does CampusEvents return for a successful PUT? Does `fetch` throw when DELETE returns 400 — and when was the list updated?",
      fixedCode: `export async function updateEvent(id: number, dto: EventDto, token: string): Promise<void> {
  const response = await fetch(API + "/events/" + id, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
    body: JSON.stringify(dto),
  });
  if (!response.ok) {
    throw new Error((await response.text()) || "Update failed (HTTP " + response.status + ")");
  }
  // 204 No Content — nothing to parse
}

async function handleDelete(id: number) {
  if (!window.confirm("Delete this event?")) return;
  const response = await fetch(API + "/events/" + id, {
    method: "DELETE",
    headers: { Authorization: "Bearer " + token },
  });
  if (!response.ok) {
    setError((await response.text()) || "Delete failed (HTTP " + response.status + ")");
    return;
  }
  setEvents((prev) => prev.filter((e) => e.id !== id)); // only after 204
}`,
      explanation:
        "PUT returns 204 with an empty body, so `response.json()` throws 'Unexpected end of JSON input' even though the update succeeded; also, no `ok` check meant a real 400 would have been ignored. The delete handler removed the item optimistically and never checked the response: the API answered 400 'Cannot delete an event that has bookings.', fetch resolved, and local state now disagreed with the server. Check `response.ok` and update state only after success.",
    },
    challenge: {
      prompt:
        "Implement the EventEdit page flow: read `:id` with useParams, validate it, load the event, pre-fill the reusable EventForm (convert ISO dates to `datetime-local`), on submit PUT the DTO with the admin token, and navigate to the details page only after success. Handle invalid id, loading, load error/404 and save errors.",
      language: "tsx",
      hints: [
        "Reuse `useEvent(id)` from the guide (File 11) and `EventForm` (File 12).",
        "`useMemo` the defaultValues so `reset` doesn't run every render.",
        "`handleUpdate` should `await` the service and let errors propagate to EventForm, which shows them via `setError('root.server')`.",
      ],
      solution: `import { useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import EventForm from "../components/EventForm";
import { useEvent } from "../hooks/useEvent";
import { updateEvent } from "../services/eventService";
import { useAuth } from "../auth/useAuth";
import type { EventDto } from "../types/EventDto";

function toLocalDateTimeInput(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()) +
    "T" + pad(d.getHours()) + ":" + pad(d.getMinutes());
}

export default function EventEdit() {
  const { id } = useParams<{ id: string }>();
  const eventId = Number(id);
  const validId = Number.isInteger(eventId) && eventId > 0;
  const navigate = useNavigate();
  const { token } = useAuth();
  const { event, loading, error } = useEvent(eventId);

  const defaultValues = useMemo(() => {
    if (!event) return undefined;
    return {
      title: event.title,
      description: event.description,
      location: event.location,
      startDate: toLocalDateTimeInput(event.startDate),
      endDate: toLocalDateTimeInput(event.endDate),
      price: event.price,
      capacity: event.capacity,
      categoryId: event.categoryId,
    };
  }, [event]);

  if (!validId) return <div className="alert alert-danger">Invalid event ID.</div>;
  if (loading) return <p role="status">Loading event...</p>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!event || !defaultValues) return <div className="alert alert-info">Event not found.</div>;

  async function handleUpdate(dto: EventDto) {
    if (!token) throw new Error("Please sign in as an administrator.");
    await updateEvent(eventId, { ...dto, imageUrl: event?.imageUrl ?? null }, token); // 204
    navigate("/events/" + eventId);
  }

  return (
    <section>
      <h1>Edit event</h1>
      <EventForm defaultValues={defaultValues} onSubmit={handleUpdate} submitLabel="Save changes" />
      <Link to={"/events/" + eventId}>Cancel</Link>
    </section>
  );
}`,
      explanation:
        "This follows the guide's EventEdit (File 18) and the Week 05 end-to-end journey (Slide 35): load → pre-fill → PUT → navigate. All hooks run before the early returns. Because PUT replaces every field, the full DTO is sent (including the existing imageUrl). If the PUT throws (400 capacity below bookings, 403 not admin), `navigate` is skipped and EventForm displays the message.",
    },
    examQuestions: [
      {
        question:
          "**(D3b, 3 marks)** Write a function that submits valid event data (eventName, location, maxAttendees) to `POST /api/events` using the Fetch API, with appropriate headers and JSON serialisation.",
        answer: `\`\`\`ts
async function createEvent(event: { eventName: string; location: string; maxAttendees: number }) {
  const response = await fetch("/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(event),
  });
  if (!response.ok) throw new Error("Failed to create event: " + response.status);
  return response.json();
}
\`\`\`
Marks: method POST + URL (1), Content-Type header (1), JSON.stringify body + response.ok check (1).`,
        marks: 3,
      },
      {
        question:
          "**(D3c, 3 marks)** Explain the difference between POST and PUT from the perspective of a frontend application performing CRUD operations.",
        answer:
          "**POST** is used to **create** a new resource: the frontend sends data to the collection URL (`/api/events`) and the server assigns the id, typically replying **201 Created** with the new resource. It is **not idempotent** — submitting twice creates two records, so the UI must prevent duplicate submits. **PUT** is used to **update/replace** an existing resource at a known URL (`/api/events/42`), sending the full representation; it is **idempotent** — repeating it leaves the same state. CampusEvents replies **204 No Content**, so the frontend must not parse a body and should refresh/navigate after success.",
        marks: 3,
      },
      {
        question:
          "An admin clicks Delete on an event that has bookings. Describe the request, the CampusEvents response, and what the UI should do.",
        answer:
          "After `window.confirm`, the app sends `DELETE /api/events/{id}` with `Authorization: Bearer <admin token>`. The controller returns **400 Bad Request** with 'Cannot delete an event that has bookings.' fetch resolves with `ok === false`, so the app must check `response.ok`, read the text body, display the message, keep the event in the list, and re-enable the button. Only a 204 should remove the event or navigate away.",
        marks: 3,
      },
      {
        question: "**(A13 / B10)** What does a 204 response to `PUT /api/events/5` mean, and is PUT appropriate for updating?",
        answer:
          "204 No Content = the update succeeded and there is no response body (don't call `response.json()`). Yes — PUT is the method for updating an existing resource at a known URL (B10: True).",
        marks: 2,
      },
    ],
    revision: [
      "Create = POST /api/events → 201 + body; Update = PUT /api/events/{id} → 204; Delete = DELETE → 204 (400 if bookings/reviews).",
      "`method`, `headers: { \"Content-Type\": \"application/json\" }`, `body: JSON.stringify(dto)` (mock D3b).",
      "POST creates (server assigns id, not idempotent); PUT updates/replaces at a known URL (idempotent) (mock D3c).",
      "Never parse a 204; check `response.ok` for every mutation.",
      "ADMIN mutations need `Authorization: Bearer <token>`; 401 → login, 403 → not permitted.",
      "Payload = EventDto (no id/categoryName/availableTickets).",
      "Confirm deletes, disable buttons while pending, show server reasons.",
      "Refresh/update the list and navigate ONLY after success.",
    ],
    visualizers: ["crud-simulator"],
  },
];
