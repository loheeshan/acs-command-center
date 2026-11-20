# Knowledge Gaps

What the supplied materials do **not** contain, how much that matters for the ICT (26 Nov 2026, 40 %) and the coursework
(7 Jan 2027, 60 %), and how the ACS Command Center makes up for it. Mark counts refer to the MOCK ICT (see `exam-topic-matrix.md`).

**Compensation rules used by the app throughout** (from `docs/content-guidelines.md`):
- A lesson that teaches content not found in the supplied files uses `kind: "supplementary"` / `"best-practice"` and is **clearly labelled** in the UI. It never claims to be university material.
- Supplementary lessons cite official documentation only: MDN, react.dev, reactrouter.com, tanstack.com/query/latest, zustand.docs.pmnd.rs, owasp.org, typescriptlang.org (plus vitest.dev / testing-library.com for testing).
- Where possible, supplementary lessons are **anchored in real supplied code** (the CampusEvents backend and frontend) so students still practise against the module's own project.

---

## 1. Missing lectures

| Gap | Roadmap week | Mock marks affected | Impact | How the app compensates |
|---|---|---:|---|---|
| **Lecture 6 — Authentication, JWT & Protected React Applications** (+ Tutorial 6) | T07 | ~11 (B15, E1–E5, and the 401/403 framing in A5, B5, C5) | High. Security is Section E (10 marks). The supplied lectures only define JWT, cookie and session in one sentence each (Lecture 01 s25, plus s4 notes). There is no slide on protected routes, token storage, expiry or the difference between authentication and authorisation. | Supplementary lessons `sec-authn-authz`, `sec-jwt-anatomy`, `sec-401-403-expiry`, `router-protected-routes`, `sec-token-storage`. They are grounded in real code: `AuthController`, `JWTService` (claims, 2-hour expiry), `AuthResponseDto`, the `[Authorize]` / `[Authorize(Roles="ADMIN")]` attributes, `ValidateLifetime=true`, and Postman guide §15 (401 vs 403 matrix). Visualizers: `jwt-explorer`, `auth-flow`, `trust-boundary`. Sources: OWASP and MDN. |
| **Lecture 7 — Modern State Management** (+ Tutorial 7) | T08 | 19 (A11, A12, A15, B6, B7, B14, C4, D4a–d) | Very high. This is the largest block of marks with no lecture behind it. The only supplied hint is Week03 s28–29 ("Swap fetch for TanStack Query in Week 08"; a `useFetch<T>` preview). | Supplementary lessons `state-kinds`, `tq-server-state`, `tq-usequery-keys`, `tq-stale-gc`, `tq-mutations-invalidation`, `zustand-basics`, `zustand-selectors`, `zustand-persist`. They follow TanStack Query v5 and Zustand v5 APIs exactly as stated in the content guidelines. The worked examples refactor the real `useEvents` hook. Visualizers: `query-cache`, `zustand-selectors`, `state-decision`. |
| **Lecture 8 — Responsive, Accessible & Modern UI Development** | T09 | 4 (A9, A16, A20, B12) | Medium. Supplied CSS material covers only fonts, colours, shadows, gradients and attribute selectors (HTML5/CSS3 PDF pp. 24–25), plus Bootstrap (written for version 4). There is nothing on CSS Grid, `grid-template-areas`, `minmax()`, `clamp()`, media queries or `:focus-visible`. | Supplementary lessons `css-box-model-cascade`, `css-flexbox`, `css-grid`, `css-responsive-clamp`, `a11y-focus-keyboard` (MDN). Bootstrap material is kept as university content but annotated with Bootstrap 5 corrections (see `lecture-analysis.md`). Visualizers: `box-model`, `flexbox`, `grid-areas`, `clamp`, `specificity`. |
| **Lecture 9 — Advanced Client-side Features & Application Workflows** | T10 (ICT week) | 0 directly | Low for the ICT, because it is delivered in the ICT week itself. Medium for the coursework (search, filtering, pagination). The API has no query parameters for these features. | Supplementary lesson `arch-search-filter-pagination`, which covers client-side filtering, `useSearchParams` for URL state, and the Bootstrap pagination markup from part 02 pp. 18–19. |
| **Lecture 10 — Professional React Development** | T11 | 0 | Coursework quality: reusable components, configuration, performance, security, refactoring. | `arch-project-structure` (university-grounded in Week05 s14–20, Week03 s28), plus supplementary `perf-memoization` and `sec-xss-csrf-https`. |
| **Lecture 11 — Frontend Testing (Vitest & RTL)** | T12 | 0 | Coursework only. | Supplementary `testing-vitest-rtl` (vitest.dev, testing-library.com). |
| **Roadmap "Lecture 4: Routing & Architecture"** | T04 | — | The files supplied as "Lecture 04" are on HTML5/CSS3 and Bootstrap, and their own title pages say "Lecture: 03". Routing is taught in the Week 05 deck instead. Week numbering in the supplied files therefore does not match the roadmap. | The Academy T04 entry is marked `partial` and explains the mismatch. Routing lessons cite Week05 slides, not a separate Lecture 4. |
| **Tutorial 4 (Multi-page React app) and Tutorial 6/7 guides** | T04, T07, T08 | — | The only supplied Week 4 tutorial is the Bootstrap online-shopping page. No auth or state-management tutorial guides were supplied. | Lab stages 5, 7 and 8 in `project-analysis.md`. Stages 7–8 are labelled supplementary. |

## 2. Missing assessment information

| Gap | Impact | How the app compensates |
|---|---|---|
| **Coursework specification** (roadmap: "Coursework Released" in T06; "Practical Web Application Project RELEASED" in T01) | High for the 60 % coursework. Requirements, marking criteria and deliverables are unknown, so the app cannot claim to cover the brief. | The app does not invent requirements. It covers the roadmap topics and the full CampusEvents backend capability (bookings, reviews, roles), and shows the backend-vs-frontend gap table (`project-analysis.md` §7) as a guide to likely work. Students are told to check Blackboard. |
| **Real ICT paper** (delivered on Blackboard) | Only the mock is available, and question style may differ. | Every mock question is mapped in `exam-topic-matrix.md`. The question banks practise the same concepts with varied wording; they are not copies of the mock. |
| **Mock ICT model answers / marking scheme** | It is unclear how partial marks are awarded in Section D. | Expected answers are presented as **rubric-based self-assessment**, clearly labelled as the app's own rubric (`types.ts` comment: "against a rubric (clearly labelled in the UI)"). |

## 3. Material that could not be read

| Gap | Impact | How the app compensates |
|---|---|---|
| **`images.7z`** (3.5 MB): not extracted because no 7-Zip tool is installed | Probably image assets for a tutorial exercise. No text file references it, so the expected impact is low, but its contents are **unverified**. | It is not cited anywhere. If a 7-Zip tool becomes available, extract it into `extracted-materials/nested/images/` (read-only) and update `source-inventory.md`. |
| **Lecture 02 slides 18–23, 25–37**: image-only (code screenshots) | Text extraction misses the JavaScript fundamentals content. Ten slides were viewed and described; s19, s22, s23, s25, s29, s31–34 are known from their titles only. | JavaScript lessons cite these slides by title/topic only. Where content is needed, they use the matching runnable pages in `Advanced Examples.zip`, which carry real code. |
| **Lecture 01 slides 4, 5, 13, 16**: EMF diagrams not rendered | Minor (Internet / IP / HTTP / client–server diagrams). | Described only by slide title. The app's own `http-lab` and `url-anatomy` visualizers cover the mechanism. |
| **Lecture 02 speaker notes on s19–33** appear offset from the slide content | Risk of mis-citation. | Notes from those slides are not used as evidence (flagged in `lecture-analysis.md`). |
| **`week_4_tutorial.pdf` page 2 wireframe** (image) | Minor. | The exercise is described from the page 1 text. |
| **`CampusEvents.db`**: binary SQLite, not inspected | Seed data unknown. `ApplicationDbContext` has no `HasData` seeding. | Lessons do not assume any particular events or users exist. Labs start from the Postman guide sequence. |
| **Bootstrap-Explanation exercise HTML and `style.css`** | The glossary refers to a page that was not supplied. Only its images (`Images-Bootstrap-Portfolio.zip`) are present. | The glossary is used as a class reference only. |

## 4. Content in the supplied files that is outdated or inaccurate

These are not missing material, but they would teach something wrong if copied as-is. Full details with slide/page numbers are in `lecture-analysis.md`.

| Area | Issue | App response |
|---|---|---|
| Lecture 01 s7/s11/s15 | "Web servers listen on port 80". This is only the HTTP default; HTTPS uses 443, and any port can be explicit (5173, 5229, 7119). | Correct statement in `web-how-the-web-works`. |
| Lecture 01 s14 | 200/301 listed as "error codes"; 401 and 204 missing. | `http-methods-status` covers status-code classes, 401 vs 403, and 204. |
| Lecture 02 s18 / s21 | `var` described as "global scope"; plain-function `this` shown as `window`. | `js-variables-scope`: `var` is function-scoped. `js-arrow-this`: ES modules are strict, so `this` is `undefined` there. |
| Lecture 02 s27–28 | Spread presented as the "solution to shallow copy". | `js-spread-rest-destructuring` + `reference-copy` visualizer: spread *makes* a shallow copy; nested objects are still shared. |
| Week03 s24 | "Omitting `[]` → infinite loop". | `react-useeffect`: the effect runs after every render, and only loops when it sets state that changes each run. StrictMode runs effects twice in development. |
| Week03 s25 | "React rejects" an async effect callback. | React gives a development warning; the returned promise is not a valid cleanup function. |
| Week03 s19 | API shown at `https://localhost:5229`. | 5229 is the HTTP port; HTTPS is 7119 (`launchSettings.json`). |
| Week05 s30–32 | Admin mutations shown without an `Authorization` header; PUT without an `ok` check or 204 handling. | `crud-post-put-delete` shows the Bearer header, the `response.ok` check, and no `.json()` on a 204 response. |
| Week05 s26 / Frontend guide | `z.coerce.number()` turns `""` into 0; `z.ZodIssueCode.custom` is deprecated in Zod 4. | `forms-zod-rhf` targets Zod 4 / React Hook Form 7 accurately. |
| Bootstrap PDFs | Material labelled "Bootstrap 5" describes Bootstrap 4 (jQuery, IE9, jumbotron, `float-left`, `data-toggle`, 5 grid tiers, MaxCDN). Examples load Bootstrap 4.1.3 / 4.5.2. | `css-bootstrap-grid` uses Bootstrap 5 class names and notes the differences. |
| React-basic-examples | Use React 17 UMD + `ReactDOM.render`, both removed in React 19. | Treated as concept demos; lessons use `createRoot`. |
| Postman guide | Roles written as `User`/`Admin`; the code uses `USER`/`ADMIN`. | `sec-jwt-anatomy` and the lab use the real upper-case values. |
| Mock A7 option A | "wait for all of them to settle successfully" blurs `Promise.all` (rejects as soon as one input rejects) with `Promise.allSettled`. | `js-promises-async` explains both. |

## 5. Topics the mock examines that no supplied file teaches (summary)

| Topic | Questions | Lesson providing it |
|---|---|---|
| TanStack Query (staleTime, invalidateQueries, caching) | A11, A15, B6, C4, D4b, D4c | tq-* |
| Zustand (generated hook, selectors) | A12, B7, D4d | zustand-* |
| Server vs client state choice | B14, D4a | state-kinds |
| CSS Grid areas, `minmax()`, `clamp()`, `:focus-visible` | A9, A16, A20, B12 | css-grid, css-responsive-clamp, a11y-focus-keyboard |
| `Promise.all` | A7 | js-promises-async |
| `Array.prototype.find` | B3 | js-array-methods |
| `useSearchParams` | A18 | router-search-params |
| AbortController / avoid state updates after unmount | D2b | http-abortcontroller (the guide's `active` flag is shown as the alternative) |
| HTTPS in transit; untrusted API data | E4, E5 | sec-xss-csrf-https |
| Authentication vs authorisation; expired-token handling | E1, E2 | sec-authn-authz, sec-401-403-expiry |

About **37 of the 100 mock marks** depend on content outside the supplied lectures. These lessons are therefore treated as priority P0 in the Master Core even though they are labelled supplementary.

## 6. Recommended follow-ups (outside the app's control)

1. Get the Lecture 6–8 slides and the coursework specification from Blackboard when they are published. Then upgrade the matching lessons' `sources` from `supplementary` to `university` with real slide numbers.
2. Extract `images.7z` once a 7-Zip tool is available, and update the inventory.
3. Decode a real token from the running API (`http` profile) to confirm the exact JWT payload key names before showing them as fact in `jwt-explorer`. The claim meanings are already certain from `JWTService.cs`.
