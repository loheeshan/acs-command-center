# Lecture & Tutorial Analysis

Source texts: `extracted-materials/text/*.txt`. Slide numbers refer to `=== SLIDE n ===` markers; PDF page numbers
are derived from form-feed page breaks in the extracted text (page 1 = title page).
"Exam relevance" refers to the supplied MOCK ICT (`text-root/MOCK_ICT.docx.txt`).

Every "simplification" entry follows the format **What the slide says → What is precisely true → How the app should teach it**.

---

## Lecture 01 — How the Web Works (`Advanced Client-Side Development - Lecture 01.pptx`, 26 slides)

**Teaching objectives (inferred from slide 3 notes "Interview Questions"):** explain JSON, why DTOs exist, MVC,
JWT vs cookie vs session, AJAX; understand Internet vs Web, HTTP request/response, URL resolution.

| Slides | Key concepts |
|---|---|
| 1–3 | Title; "How the web works? Think about it"; client-side (HTML/CSS/JS) vs server-side (PHP/ASP/Python/Node, MySQL/SQL Server). Notes on slide 3 list interview questions (JSON, DTOs, MVC, JWT/cookie/session, AJAX). |
| 4–8 | Internet as network of networks (TCP/IP); IP and IPv4 (2^32) vs IPv6 (2^128); TCP adds multiplexing via ports (FTP 21, SMTP 25, HTTP 80); DNS (`nslookup`). Slide 4 notes: session vs JWT vs cookie, "httponly cookie is better". |
| 9–12 | WWW ≠ Internet; web pages, servers, clients, browsers; web server software (Apache, Tomcat, XAMPP, IIS); browsers. |
| 13–15 | HTTP request–response; status codes (200, 301, 403, 404, 500); URL → DNS lookup → connect port 80 → GET path → display. |
| 16–17 | Diagrams: client–server request/response (slide 16, EMF, not rendered); **Traditional vs SPA** (slide 17, viewed): traditional = Initial Request→HTML, Form Post→HTML; SPA = Initial Request→HTML, then AJAX→JSON. |
| 18–21 | MVC: Models (C# `Product` class), Controllers (`[ApiController]`, `[Route("api/[controller]")]`, `ControllerBase`, `[HttpGet]`), Views (React is the View layer). |
| 22–24 | DTOs: `User` (with `PasswordHash`, `CreatedAt`) vs `UserDto` (Id, Email); JSON before/after; problems without DTOs (over-exposure, sensitive data, tight coupling to DB model). |
| 25 | Cookie vs Session vs JWT one-line definitions. |
| 26 | Questions. |

**Code examples:** C# `Product` model (s19), `ProductsController` skeleton (s20), `User`/`UserDto` (s22), JSON before/after (s23).
**Diagrams:** s16 client/server (not rendered), s17 traditional vs SPA (described above), s4/s5/s13 EMF images (not rendered; topics Internet/IP/HTTP by title).
**Exam relevance:** low–medium directly (mock is client-side only), but s13–s14 underpin A5, A13, B5, C5 (status codes); s17 underpins B1 (no full reload); s25 underpins E1–E3 vocabulary.

**Simplifications needing clarification**

| Slide | Says | Precise statement |
|---|---|---|
| 7, 11, 15 | Web servers listen on TCP port 80; the browser "connect[s] to that IP address at port 80". | Port 80 is the **default for `http://`**. `https://` defaults to **443**, and almost all real sites (incl. westminster.ac.uk) redirect to HTTPS. Any port can be used explicitly (e.g. `http://localhost:5229`, `https://localhost:7119`, Vite on 5173). |
| 14 | Title "HTTP Error Codes" listing 200 and 301. | These are **status codes**; 2xx = success, 3xx = redirection, 4xx = client error, 5xx = server error. Only 4xx/5xx are errors. The list omits **401 Unauthorized** and **204 No Content**, which the mock examines (A5, A13, C5). |
| 14 | 403 "You are forbidden to access this page". | Correct, but should be contrasted with 401: 401 = not authenticated (missing/invalid/expired credentials), 403 = authenticated but not permitted. |
| 12 | Internet Explorer listed as a popular browser. | IE is retired (support ended 2022); Edge replaced it. |
| 25 | "Cookie: the server sends a cookie to the browser…" presented as an alternative to sessions/JWT. | A cookie is a **storage/transport mechanism**; it can carry a session ID **or** a JWT. Session = server-side state looked up by ID; JWT = signed, self-contained claims verified by the server. The slide 4 notes make this point; the slide body does not. A signed JWT is **encoded, not encrypted**. |
| 1 | Title promises "REST APIs". | No slide defines REST constraints (resources, uniform interface, statelessness). REST vocabulary is only used later (Week03 s5–6, Week05 s7, s29). |
| 6 | "232" / "2128" | Superscripts lost in extraction: 2^32 and 2^128. |

---

## Lecture 02 — Modern React & TypeScript (`Advanced Client-Side Development - Lecture 02.pptx`, 44 slides)

**Teaching objectives (s3, s17, Week 02 guide §2):** components, JSX, props, state, events, list rendering, modern JS prerequisites,
TypeScript basics, project structure for CampusEvents.

| Slides | Key concepts |
|---|---|
| 1–5 | Where we are (React ↔ HTTP ↔ ASP.NET Core ↔ SQLite); what React is; traditional server-rendered vs SPA (diagrams as text boxes). s3 asks "why install Node.js to use React (if not using a CDN)?" |
| 6–9 | Components (`Welcome`, `Navbar`, `Footer`); component tree (App → Navbar/Home/Footer → Hero/EventCard); JSX (`className`, `{}` expressions). |
| 10–11 | Props; props with TS interface `EventCardProps { title; price }` and destructuring. |
| 12–15 | State (`useState(0)` → 0,1,2); state vs props table; events (`onClick`); counter. s14: "User action → Event handler → State update → React re-renders". |
| 16 | Rendering lists with `map` and `key={event}`. |
| 17 | Modern JS agenda list. |
| 18–37 | **Image-only slides.** Viewed: s18 var = "Global Scope" vs let/const = "Block Scope"; s20 arrow-function forms (block body, implicit return, single/no params, returning multi-line template literal); s21 `this` in plain function (`// window`), strict function (`// undefined`), object method (`this` = the car); s26 spread icon vs `let [a, b, ...rest] = numbers`; s27 "What's the issue with this code?" — `let arr2 = arr1; arr2.push(4)` (both arrays change); s28 "Solution to shallow copy?" — `let arr4 = [...arr3]`; s30 `sumRest = (a, b, c, ...rest) => …`; s35 `nums.reduce((acc, curr) => acc + curr, 0)` → 10; s36 map/filter/reduce summary boxes; s37 Promise cartoon ("Promise fulfilled? Yes → go play / No → do the laundry"). Not viewed (titles only): s19 arrow functions, s22 data structures, s23 ternary, s25 template literals, s29 rest "Need? Issue?", s31 spread vs rest, s32 destructuring, s33 map, s34 filter. |
| 24 | Conditional rendering with ternary (login/logout, admin UI, loading, empty, error states). |
| 38–42 | TypeScript: primitive annotations, why TS, `interface Event`, typed function `calculateTotal`, `useState<Event[]>([])`. |
| 43–44 | Project structure (`components/`, `pages/`, `App.tsx`, `main.tsx`, `index.css`); CampusEvents pages (Home, Events, Login, Register). |

**Code examples:** s6, s8–11, s14–16, s24, s38–42 (text); s18–37 (screenshots). Companion runnable examples: `Advanced Examples.zip`, `React-basic-examples.zip`.
**Exam relevance:** high — A1/C1 (reduce, s35), A4 (conditional rendering, s24), A8/B2/C2 (interfaces, s40), B3 (array methods — but `find()` is not covered), B4 (hooks), state snapshot thinking for D2.

**Simplifications needing clarification**

| Slide | Says | Precise statement |
|---|---|---|
| 18 | `var` = "Global Scope". | `var` is **function-scoped** (it ignores blocks). It becomes global only when declared outside any function in a classic script. The companion `var-let-const-JS.html` correctly says "function-scoped". |
| 21 | Plain function call: `this // window`. | Only in **non-strict classic scripts**. ES modules (every Vite/React file) are strict, so `this` in a plain function call is `undefined`. The value of `this` depends on how a function is called; arrow functions capture `this` lexically (s19 notes). |
| 27–28 | "Solution to shallow copy?" → `[...arr3]`. | s27's problem is **no copy at all** (two variables referencing the same array). Spread creates a **shallow** copy: top-level elements are copied, nested objects are still shared. Use `structuredClone` for deep copies. This matters for React immutable updates. |
| 15 / React-basic-examples | `setCount(count + 1)`. | Fine for one update per event; when the next state depends on the previous one and multiple updates are queued, use the updater form `setCount(c => c + 1)`. State is a snapshot per render. |
| 16 | `key={event}` (string value as key). | Acceptable only when values are unique and stable; prefer database ids (`key={event.id}` as in the Week 02 guide). |
| 26 (image) | Rest example ends with a stray `}`. | Typo in the screenshot; code otherwise correct. |
| 37 | Promise as a cartoon (fulfilled/not fulfilled). | A promise has three states: pending, fulfilled, rejected; it settles once. Week03 s9 states this precisely. |
| Notes on s19–33 | Speaker notes appear **offset** from slide content (e.g. s26 notes explain `reduce`'s accumulator; s27 notes talk about Promise; s33 notes say "We're going to build this structure during the tutorial"). | Do not cite notes from these slides as describing the slide they are attached to. |
| React-basic-examples (companion) | React 17 UMD + `ReactDOM.render`. | `ReactDOM.render` and UMD builds were removed in React 19; the project uses `createRoot` (`main.tsx`). Treat these examples as concept demos only. |

---

## Week 03 — Consuming REST APIs with React (`Week03-Lecture-Consuming-REST-APIs.pptx`, 30 slides)

**Teaching objectives (s30, verbatim list):** explain React↔REST communication; GET with `fetch()`; async/Promises; `async/await`;
process JSON; check `response.ok`; explain and configure CORS; separate API service; four UI states; `useEffect` and `[]`; basic custom hook; display API data.

| Slides | Key concepts |
|---|---|
| 1–4 | Recap; hard-coded data problem; React never talks to the DB directly (React → HTTP → API → EF Core → SQLite). |
| 5–6 | API request (`GET …/api/events` → JSON); HTTP methods table (GET/POST/PUT/PATCH/DELETE); "Week 05 → POST/PUT/DELETE". Note: Swagger/Postman are not browsers (no CORS). |
| 7–13 | `fetch()`; sync vs async diagram; Promise states (pending/fulfilled/rejected); `async/await`; `Response` object (`ok`, `status`, `headers`); **fetch only rejects on network failure — check `response.ok`** (s12); JSON sample. |
| 14–15 | `Event` interface matching the C# DTO (`imageUrl: string \| null`, dates as ISO strings); `Event` vs `EventCardProps`. |
| 16–18 | API logic vs UI logic; `services/eventService.ts`; separation of responsibilities. |
| 19–20 | CORS: origins differ by protocol/domain/port; Program.cs `AddCors` before `Build()`, `UseCors` before auth. |
| 21–25 | State for API data; **four UI states** (loading, success, error, empty); `useEffect(…, [])`; dependency array variants; why the effect callback cannot be `async`. |
| 26 | "The most important diagram": page → render → useEffect → service → fetch → API → EF Core → SQLite → JSON → state → re-render → EventCard. |
| 27–29 | Custom hook `useEvents()` returning `{ events, loading, error }`; Service → Hook → Component; preview: "Swap fetch for TanStack Query in Week 08 → only the hook changes" (s28) and generic `useFetch<T>(url)` (s29). |
| 30 | Learning outcomes. |

**Code examples:** s3, s7, s10–12, s14–15, s17, s20, s21, s23–25, s27. **Diagrams (as text):** s4, s5, s8, s9, s18, s26, s28.
**Exam relevance:** very high — D2 (entire question), A19/D2c (service module), B2 (interfaces for API data), B4 (custom hooks), D3b (fetch), E5 (API data trust — partially, via s14 warning).

**Simplifications needing clarification**

| Slide | Says | Precise statement |
|---|---|---|
| 24 | "Omitting `[]` → infinite fetch loop (the classic Week 03 bug)." | Omitting the array makes the effect run **after every render**. It only loops if the effect **sets state that changes on each run** (e.g. `setEvents(data)` with a new array every time → re-render → effect → fetch …). An effect that only logs or sets an unchanged primitive does not loop forever (React bails out when `Object.is` says the value is unchanged). |
| 23–24 | `[]` means "run ONCE on mount". | In development, React 18/19 **StrictMode** mounts, unmounts and re-mounts components, so the effect runs **twice** (setup → cleanup → setup). This is why cleanup (abort/ignore flag) matters; `main.tsx` uses `<StrictMode>`. In production it runs once per mount. |
| 25 | "an async function always returns a Promise — so React rejects it." | React does not throw: it **warns in development** that an effect must return nothing or a cleanup function; the returned Promise cannot act as cleanup. The nested-function pattern is correct. |
| 19 | "ASP.NET Core API `https://localhost:5229`". | In `launchSettings.json`, **5229 is the HTTP port** (`http://localhost:5229`); HTTPS is **7119**. The frontend code and Frontend guide use `http://localhost:5229/api`. |
| 12 | `fetch()` only rejects on network failures. | Also rejects on **abort** (`AbortError`) and on CORS failures (which surface as a network-style `TypeError`). HTTP 4xx/5xx resolve normally. |
| 10 | `getEvents` without `response.ok`. | Deliberately fixed on s12; emphasise the fixed version. |
| 22 | Error state as `error !== ""`. | Works with a string state; the later Frontend guide uses `string \| null`. Either is fine if consistent. |
| 9 | Promise "Fulfilled/Rejected". | Good. Note `.then` reactions run as **microtasks**, before the next task (e.g. `setTimeout`). The event loop is not covered in any supplied slide. |
| — | No cancellation shown. | The mock (D2) asks for **AbortController** / avoiding state updates after unmount. Week03 does not show it; the Frontend guide uses an `active` flag (ignore-pattern), not AbortController. |

---

## Lecture 04 (supplied PDFs) — HTML5/CSS3 and Bootstrap

> Roadmap Lecture 4 is "Routing & React Application Architecture"; the supplied "Lecture 04" files are **HTML5/CSS3 + Bootstrap**,
> and the Bootstrap PDFs' own title pages say "Lecture: 03 (part 01/02)". Routing is taught in the Week 05 deck.

### HTML5 and CSS3 (`…Lecture 04- HTML5 and CSS3.pdf`, 26 pages)

| Pages | Content |
|---|---|
| 1–4 | Title; HTML vs HTML5; semantic vs non-semantic elements (`div/span` vs `form/table/article`); page 4 = semantic-layout image. |
| 5–10 | `<!DOCTYPE html>` (prevents quirks mode), `<html lang="en">` (accessibility/SEO), `<head>`, `<meta charset="UTF-8">`, viewport meta (responsive), `<title>`. |
| 11–22 | `header`, `nav`, `section`, `article`, `mark`, `figure/figcaption`, `details/summary`, `time datetime`, `progress`, `meter`, `aside`, `footer`. |
| 23 | Example `index.html` (in `HTML5 page and fonts.zip`). |
| 24–25 | Core CSS: fonts (Google Fonts Roboto/Lobster), colours, text effects (`text-shadow`), backgrounds (image + gradient overlay), `box-shadow`, `linear-gradient`, attribute selectors (`a[href^="https"]`, `img[alt]`) — see `example02.html`. |
| 26 | Self-study links (w3schools). |

**Exam relevance:** low for the mock. **Not covered anywhere in supplied files:** box model, cascade/specificity, Flexbox as CSS, **CSS Grid (`grid-template-areas`, `minmax()`)**, **`clamp()`**, media queries in CSS, **`:focus-visible`** — yet A9, A16, A20, B12 test them (4 marks; roadmap places them in missing Lecture 8).

### Bootstrap part 01/02/03 PDFs (20 / 22 / 11 pages)

| File · pages | Content |
|---|---|
| Part 01 · 2–9 | What Bootstrap is; browser support; CDN vs download; jQuery & Popper; components requiring jQuery; mobile-first checks (viewport meta, HTML5 doctype). |
| Part 01 · 10–19 | Containers (`.container`, `.container-fluid`), background/text colours, `.row`/`.col`, responsive `.col-sm-4`, tables, alerts, buttons, cards — each "See Example 01–09" (`Examples-Bootstrap.zip`). |
| Part 02 · 2–5 | 12-column flexbox grid; tier classes `.col-`, `-sm-` (≥576), `-md-` (≥768), `-lg-` (≥992), `-xl-` (≥1200); unequal columns. |
| Part 02 · 6–21 | Text defaults; images (`rounded`, `rounded-circle`, `img-thumbnail`, floats, `mx-auto d-block`, `img-fluid`); jumbotron; button groups; progress; spinners; pagination; dropdowns and drop positioning. |
| Part 03 · 2–4 | Utilities (spacing, display, flex utilities, responsive classes), customisation (overrides, variables), responsive design (examples 3–4 in `Bootstrap examples 4th lecture.zip`). |
| Part 03 · 5–11 | Optimisation: minification/bundling, image optimisation (`srcset`), CDN, lazy loading (`loading="lazy"`); best practices: semantic HTML, organised CSS/JS (Sass), ARIA, colour contrast. |

**Exam relevance:** none directly in the mock (no Bootstrap question); relevant to the Week 05 Frontend guide (Bootstrap classes) and coursework UI.

**Simplifications / outdated statements needing clarification** (labelled "Bootstrap 5" but describing Bootstrap 4; supplied examples load BS 4.1.3/4.5.2)

| Location | Says | Precise statement (Bootstrap 5) |
|---|---|---|
| Part 01 p.3 | "Bootstrap 5 supports all major browsers (Check for IE 9)". | Bootstrap 5 **dropped Internet Explorer support** entirely. |
| Part 01 p.5–7 | Bootstrap 5 uses jQuery; list of components requiring jQuery; MaxCDN. | Bootstrap 5 **removed the jQuery dependency** (vanilla JS); Popper is still used for dropdowns/tooltips/popovers. MaxCDN has been retired; official docs use jsDelivr. |
| Part 02 p.3 | Grid has "five classes" up to `.col-xl-` (≥1200). | Bootstrap 5 has **six tiers**, adding `xxl` (≥1400px). |
| Part 02 p.6 | Default font family "Helvetica Neue", Helvetica, Arial. | Bootstrap 5 uses a **system font stack** (`system-ui, -apple-system, "Segoe UI", Roboto, …`). |
| Part 02 p.9 | `float-left`, `float-right`. | BS5 uses logical names `float-start`, `float-end`. |
| Part 02 p.11–12 | `.jumbotron`, `.jumbotron-fluid`. | Jumbotron was **removed** in Bootstrap 5 (recreate with utilities, e.g. `p-5 bg-light rounded-3` — exactly what the Frontend guide's `Home.tsx` does). The Week 4 tutorial still asks for a "Jumbotron". |
| Part 02 p.20–21 | `data-toggle="dropdown"`, `.dropright`, `.dropleft`. | BS5 uses `data-bs-toggle`, `.dropend`, `.dropstart`. |
| Part 03 p.4 | "Media queries and breakpoints (can use but do we really have to?)". | Bootstrap's grid is itself implemented with media queries; understanding them is still required for custom CSS and the exam's responsive questions. |
| Part 03 p.9 | "lazy load components using libraries like Intersection Observer". | Intersection Observer is a **browser API**, not a library. In React, component code-splitting uses `React.lazy` + dynamic `import()`. |
| Part 03 p.6 | UglifyJS, CSSNano, Grunt, Gulp, Webpack. | Valid historically; the course's Vite toolchain minifies and bundles automatically on `vite build`. |
| Bootstrap-Explanation docx | Uses `bg-body-tertiary` (Bootstrap 5.3 class) alongside the above. | Confirms that the tutorial exercise targets BS 5.3 while the lecture examples are BS 4 — mixing versions will break some classes. |

---

## Week 05 — Routing, Architecture, Forms, Validation & CRUD (`Week05_Routing_Forms_Validation_CRUD.pptx - Updated (1).pptx`, 38 slides)

**Teaching objectives (s2):** design multi-page app with clear URLs; routes, dynamic params, shared layouts and navigation;
separate pages/components/services/types; controlled inputs with validation feedback; POST, PUT/PATCH, DELETE; trace a user journey and failure states.

| Slides | Key concepts |
|---|---|
| 1–4 | Agenda; why combine routing and CRUD; running example (existing Navbar/Footer/EventCard/TicketCounter/Events; next: EventDetails, Login/Register, create/edit/delete; **mutations require ADMIN**). |
| 5–7 | SPA and client-side routing (no full reload; shareable URLs); what routing solves (direct access, history, structure; **server must serve the SPA entry for client routes**); meaningful URLs (`/`, `/events`, `/events/42`, `/events/42/edit`). |
| 8 | `BrowserRouter` / `Routes` / `Route` from `react-router-dom`. |
| 9 | `useParams()`; **route params are strings** — validate/convert. |
| 10 | Nested routes and shared layouts — `AppLayout` (Navbar + frame) with children; **`Outlet` renders the matched child**. |
| 11 | `<Link to>` for user-chosen navigation; `navigate(...)` after an action; avoid `<a>` for internal navigation. |
| 12 | Catch-all route; valid route ≠ valid record (`/events/999` may 404 from API); distinguish route-not-found, record-not-found, loading, request-failed. |
| 13 | Knowledge check (route for event 42; why nested layout; refreshing a nested route). |
| 14–20 | Architecture: pages/components/services/types & schemas; realistic `src/` tree (add EventForm, EventDetails, EventNew, EventEdit, NotFound); data flow Page → Hook/handler → Service → API; TS types match DTOs (create/update payload omits `id`, `categoryName`, `availableTickets`); service reads `import.meta.env.VITE_API_URL`; retrieval practice. |
| 21–27 | Forms: input → validate → submit → respond; controlled inputs; **client vs server validation (server authoritative; browser validation is not a security boundary)**; rule types (required, format, range, cross-field, feedback, accessibility); Zod schema with `z.coerce.number()`; create vs edit forms sharing `EventForm`. |
| 28–33 | CRUD ↔ HTTP table (GET public; POST/PUT/DELETE ADMIN; delete blocked when bookings/reviews exist); POST, PUT, DELETE code; request states (idle/loading/success/error). |
| 34–38 | Common CRUD mistakes (fetch does not reject on 400/500; navigating before success; duplicate submits; hard-coded URLs); end-to-end journey; diagnosis scenario (400 but app navigates); knowledge check (POST vs PUT vs PATCH); key takeaways. |

**Code examples:** s8, s9, s16, s18, s19, s23, s26, s30, s31, s32. **Diagrams (text):** s10 layout tree, s17 data flow, s22 form workflow, s33 request states, s35 journey.
**Exam relevance:** very high — D1 (all parts), D3 (all parts), A2, A6, A10, A17, B1, B8, B9, B10, B11, C3, E3.

**Simplifications needing clarification**

| Slide | Says / shows | Precise statement |
|---|---|---|
| 30–32 | POST/PUT/DELETE examples send only `Content-Type`; s30 notes "requires ADMIN auth". | Against the supplied API these calls return **401** without an `Authorization: Bearer <token>` header (or **403** with a non-admin token). The Frontend guide adds the header through `requiresAdmin` + `VITE_DEMO_ADMIN_TOKEN`. |
| 31 | PUT example does not check `response.ok` or handle 204. | Must check `response.ok`; the API returns **204 No Content** for PUT and DELETE — do not call `response.json()` on 204. |
| 29 / 31 | "PUT/PATCH: update a record". | PUT replaces the resource representation at a known URL (idempotent); PATCH applies a partial change. The supplied events endpoint only supports **PUT** (full `UpdateEventDto`). PATCH exists only for `/api/bookings/{id}/status`. |
| 26 | `price: z.coerce.number().min(0)` etc. | `z.coerce.number()` turns an **empty string into 0** (`Number("") === 0`), so an empty price field passes `min(0)`. Also, in Zod 4 + React Hook Form, coerced fields have input type `unknown`, which affects `useForm` generics. |
| 8 | Imports from `react-router-dom`. | Fine: in React Router v7 the package `react-router` is primary and `react-router-dom` re-exports it; the course uses `react-router-dom`. |
| 6 / 13 | Server must serve the SPA entry for client routes. | Vite's dev server already falls back to `index.html`; production hosting needs a rewrite rule. Correct but worth showing concretely. |
| 24 | Server checks "ADMIN role for mutations" listed under *validation*. | Role checks are **authorisation**, not validation. Different HTTP outcome (403 vs 400). |
| 25 | "associate labels with inputs and connect errors to fields". | The Frontend guide's `EventForm` uses `<label className="form-label">` **without `htmlFor`/`id`** and errors without `aria-describedby` — it does not follow this slide's own rule. |

---

## Week 02 Tutorial — React Application Shell (`Week_02_React_Application_Shell_Tutorial_Guide.docx`)

- **Objectives (§2):** Vite React+TS project, project structure, reusable components, JSX, props, typed props, `useState`, events, `map()`.
- **Steps:** `npm create vite@latest` → App → Navbar/Footer → pages (Home/Events/Login/Register) → `EventCard` (typed props) → `TicketCounter` (`useState`, `Math.max(1, tickets - 1)`) → hard-coded `events` list rendered with `key={event.id}`.
- **Matches** the supplied `campus-events-frontend` components exactly.
- **Clarifications:** Navbar uses `<a href="#">` (replaced by `NavLink` in Week 05); `TicketCounter` uses `setTickets(tickets + 1)` (fine here; updater form preferred when chaining).

## Week 4 Tutorial — Bootstrap Online Shopping (`week_4_tutorial.pdf`, 2 pages)

Single HTML page: Bootstrap CDN, jumbotron header (removed in BS5 — see above), category buttons switching card sets, product cards, grid layout, closable info alert ("Free delivery on orders over $100") placed so the layout does not jump, price-list table, footer. The wireframe on page 2 is an image (not extracted as text).

## Bootstrap-Explanation (For Tutorial Exercise)

Glossary of classes in a (not supplied) portfolio page: containers/grid, display headings/`lead`, spacing utilities, navbar (`navbar-expand-sm`, `ms-auto`, toggler, `collapse`), buttons, `img-fluid`, form classes, modals, cards; ARIA attributes (`aria-controls`, `aria-expanded`, `aria-label`, `aria-labelledby`). Images for it are in `Images-Bootstrap-Portfolio.zip`; `style.css` and the HTML are not supplied.

## Campus Event Frontend Guide (Week 05 extension)

Detailed in `project-analysis.md`. Key teaching points: centralised `request<T>()` with `ApiError`; 204 handling; generic `T` **does not validate JSON at runtime** (§7 key points); `active` flag to avoid state updates after unmount; `useEvent(id)` re-runs on `[id]`; `EventForm` with Zod + RHF (`superRefine` cross-field rule, `setError("root.server")`); `NavLink` with `end`; `AppLayout` + `Outlet`; wildcard `*` route; `BrowserRouter` in `main.tsx`; "the backend must still enforce administrator permissions, regardless of which buttons are visible".
**Clarifications:** `VITE_DEMO_ADMIN_TOKEN` is a classroom shortcut (the guide itself warns VITE_ variables are public); `z.ZodIssueCode.custom` is deprecated in Zod 4 (use `code: "custom"`); `getErrorMessage` checks `title` before `errors`, so ASP.NET validation problem details show the generic title "One or more validation errors occurred."; plain-string `BadRequest("…")` bodies from the API are not JSON, so the guide falls back to "Request failed (HTTP 400)".

## Postman Testing Guide

Detailed in `project-analysis.md`. **Clarification:** the guide writes roles as `User`/`Admin` and `[Authorize(Roles = "Admin")]`, but the code seeds and checks **`USER`/`ADMIN`** (Program.cs, all controllers). Role lookups through Identity are normalised (so `/assign/Admin` works), but `GetRolesAsync` returns the stored names, i.e. `"USER"`, `"ADMIN"`, and the JWT `role` claims carry those upper-case values.
