# Curriculum Map

Two learning paths share the same lesson ids (and therefore the same progress):

1. **Master Core** — topic-ordered modules `m00`–`m14` (`MODULES` in `src/content/modules.ts`).
2. **University Academy** — the official roadmap order, weeks `T01`–`T12` (`ACADEMY` in `src/content/modules.ts`,
   based on `5COSC026W_RoadMap_v1 26-27 (New).docx`).

Source-kind rule (from `docs/content-guidelines.md`): `university` only when the concept is really in the supplied files;
otherwise `supplementary` / `best-practice` with official documentation.

---

## 1. Master Core modules (m00–m14)

`modules.ts` does not store a lesson→module mapping; the mapping below is **inferred from the lesson-id prefix** and the
module descriptions. Lessons marked † are not in `ACADEMY` (Master Core only) — currently only `react-rendering-snapshots`
(present in `src/content/lessons/react.ts` at the time of writing).

| Module | Title | Priority | Exam-critical | Lesson ids (inferred) | University coverage |
|---|---|---|---|---|---|
| m00-web | How the Web Works | P1 | no | web-how-the-web-works, web-spa-vs-mpa, web-mvc-dtos | Lecture 01 (s4–s25) |
| m01-html | HTML5 Fundamentals | P2 | no | html-semantic-forms | HTML5/CSS3 PDF pp. 2–23 (semantics); forms only via Week05 s22–25 |
| m02-css | CSS, Responsive Design & Bootstrap | P1 | **yes** | css-box-model-cascade, css-flexbox, css-grid, css-responsive-clamp, css-bootstrap-grid | Only Bootstrap PDFs + Core CSS (pp. 24–25). Grid areas, minmax, clamp, :focus-visible **not supplied** |
| m03-javascript | JavaScript Master Core | P0 | **yes** | js-variables-scope, js-arrow-this, js-spread-rest-destructuring, js-array-methods, js-array-reduce, js-promises-async, js-event-loop | Lecture 02 s17–37, Advanced Examples, Week03 s8–10. Event loop, closures, `find()`, `Promise.all` not supplied |
| m04-typescript | TypeScript Master Core | P0 | **yes** | ts-basics-interfaces | Lecture 02 s38–42, Week03 s14–15, Week05 s18. Union types and `type` aliases appear only in code, not taught explicitly; generics only in Frontend guide `request<T>()` |
| m05-react | React Master Core | P0 | **yes** | react-components-jsx, react-props, react-state-events, react-rendering-snapshots †, react-lists-keys, react-conditional-rendering, react-useeffect, react-custom-hooks | Lecture 02 s6–16, s24; Week03 s21–29 |
| m06-router | React Router | P0 | **yes** | router-basics, router-nested-layouts-outlet, router-dynamic-params, router-navigation, router-search-params, router-protected-routes | Week05 s5–13; Frontend guide (App.tsx, AppLayout, NavLink). `useSearchParams` and protected routes **not supplied** |
| m07-http-api | REST APIs & HTTP | P0 | **yes** | http-methods-status, http-fetch-response-ok, http-four-ui-states, http-abortcontroller, http-service-modules, http-cors | Week03 s5–22; Lecture 01 s13–14; Postman guide §15. AbortController **not supplied** |
| m08-forms-crud | Forms, Validation & CRUD | P0 | **yes** | forms-controlled-inputs, forms-validation, forms-zod-rhf, crud-post-put-delete | Week05 s21–37; Frontend guide (EventForm, eventService) |
| m09-security | Authentication, JWT & Frontend Security | P0 | **yes** | sec-authn-authz, sec-jwt-anatomy, sec-401-403-expiry, sec-token-storage, sec-xss-csrf-https | Lecture 6 **missing**; partial: Lecture 01 s25 (+s4 notes), backend `AuthController`/`JWTService`, Postman guide §15 |
| m10-tanstack-query | TanStack Query | P0 | **yes** | tq-server-state, tq-usequery-keys, tq-stale-gc, tq-mutations-invalidation | Lecture 7 **missing**; only Week03 s28–29 preview |
| m11-zustand | Zustand | P0 | **yes** | zustand-basics, zustand-selectors, zustand-persist | Lecture 7 **missing** |
| m12-state-architecture | State Management Architecture | P0 | **yes** | state-kinds | Lecture 7 **missing**; roadmap T08 description only |
| m13-architecture | Application Development & Integration | P2 | no | arch-project-structure, arch-search-filter-pagination | Week05 s14–20, Lecture 02 s43, Week03 s16–18, s28. Search/filter/pagination (Lecture 9) **missing** (Bootstrap pagination markup only) |
| m14-perf-a11y-testing | Performance, Accessibility & Testing | P2 | no | perf-memoization, a11y-focus-keyboard, testing-vitest-rtl | Lectures 8, 10, 11 **missing**; ARIA basics in Bootstrap-Explanation docx and Bootstrap part 03 p.11 |

Notes:
- `a11y-focus-keyboard` could belong to m02 (`:focus-visible` is in the m02 description) or m14 (accessibility). Mapped to m14 here; exam question A20 is the only direct link.
- `css-responsive-clamp` is listed in both T04 and T09 in `ACADEMY` (intentional repeat for revision; counts once for progress).
- Gaps in lesson coverage relative to the mock: no dedicated lesson ids for **TS union types / type aliases** (A3, A14, B13), **`Promise.all`** (A7), **`find()` vs `filter()`** (B3), **Rules of Hooks** (B4). These are expected to be covered inside `ts-basics-interfaces`, `js-promises-async`, `js-array-methods` and `react-custom-hooks` respectively.

---

## 2. University Academy (T01–T12)

Status values come from `ACADEMY[].materials`. **U** = university-derived (concept present in supplied files),
**S** = supplementary (not in supplied files; must cite official docs), **U/S** = partially supplied (university source exists but the lesson goes beyond it).

### T01 — 24 Sep 2026 · Lecture 1: How the Web works, SPA, REST APIs & Backend Architecture · Tutorial 1: Backend API & React Setup
Materials: **supplied** (Lecture 01, Backend Events API, Postman guide). Assessment: Practical Web Application Project released.

| Lesson id | Kind | Source |
|---|---|---|
| web-how-the-web-works | U | Lecture 01 s4–s15 |
| web-spa-vs-mpa | U | Lecture 01 s17 (diagram), Lecture 02 s4–5, Week05 s5–6 |
| web-mvc-dtos | U | Lecture 01 s18–24; backend DTOs |
| http-methods-status | U/S | Lecture 01 s13–14, Week03 s6, Postman guide §15; 401 and 204 semantics supplementary-precise |

### T02 — 1 Oct 2026 · Lecture 2: Modern React & TypeScript · Tutorial 2: React Application Shell
Materials: **supplied** (Lecture 02, Week 02 guide, React-basic-examples, Advanced Examples).

| Lesson id | Kind | Source |
|---|---|---|
| js-variables-scope | U/S | Lecture 02 s18 (image); `var-let-const-JS.html`; closures/TDZ supplementary |
| js-arrow-this | U | Lecture 02 s19–21; `arrowFunctionJS.html`, `thisKeywordJS.html` |
| js-spread-rest-destructuring | U | Lecture 02 s26–32; spread/rest/destructuring example pages |
| js-array-methods | U/S | Lecture 02 s33–34, s36; map/filter examples; `find()`/`some()` supplementary |
| js-array-reduce | U | Lecture 02 s35; `reduceJS.html` |
| ts-basics-interfaces | U | Lecture 02 s38–42 |
| react-components-jsx | U | Lecture 02 s6–9; Week 02 guide §5–7 |
| react-props | U | Lecture 02 s10–11; Week 02 guide §8–9 |
| react-state-events | U | Lecture 02 s12–15; Week 02 guide §10 |
| react-lists-keys | U | Lecture 02 s16; Week 02 guide §11 |
| react-conditional-rendering | U | Lecture 02 s23–24 |

### T03 — 8 Oct 2026 · Lecture 3: Consuming REST APIs with React · Tutorial 3: Connecting React to ASP.NET Core
Materials: **supplied** (Week03 deck, campus-events-frontend).

| Lesson id | Kind | Source |
|---|---|---|
| js-promises-async | U/S | Week03 s7–10; Lecture 02 s37; `promiseJS.html`; `Promise.all` supplementary |
| js-event-loop | S | Only "sync vs async" in Week03 s8; microtasks/tasks not supplied (MDN) |
| http-fetch-response-ok | U | Week03 s7, s11–12 |
| http-four-ui-states | U | Week03 s22; Week05 s33 |
| react-useeffect | U/S | Week03 s23–25; StrictMode double-run and cleanup supplementary |
| http-abortcontroller | S | Not supplied (Frontend guide uses `active` flag); mock D2 requires it (MDN) |
| http-service-modules | U | Week03 s16–18; Week05 s19; Frontend guide `api.ts` |
| react-custom-hooks | U | Week03 s27–29; `useEvents.ts` |
| http-cors | U | Week03 s19–20; `Program.cs` (version B) |

### T04 — 15 Oct 2026 · Lecture 4: Routing & React Application Architecture · Tutorial 4: Multi-page React Application
Materials: **partial** — supplied "Lecture 04" files are HTML5/CSS3 + Bootstrap; routing content is in the Week05 deck; supplied tutorial is the Bootstrap online-shopping exercise.

| Lesson id | Kind | Source |
|---|---|---|
| css-box-model-cascade | S | Not supplied (MDN) |
| css-flexbox | U/S | Bootstrap part 03 p.2 (flex utilities), part 02 p.2 ("grid is built with flexbox"); CSS Flexbox itself supplementary |
| css-grid | S | Not supplied (`grid-template-areas`, `minmax()` — mock A9, B12) |
| css-responsive-clamp | U/S | Viewport meta (HTML5 PDF p.9), Bootstrap breakpoints; `clamp()` supplementary (mock A16) |
| css-bootstrap-grid | U | Bootstrap part 01 pp.14–15, part 02 pp.2–5; Bootstrap-Explanation; week_4_tutorial |
| html-semantic-forms | U/S | HTML5/CSS3 PDF pp.2–23; forms/labels from Week05 s25 |
| router-basics | U | Week05 s5–8; Frontend guide App.tsx/main.tsx |
| router-nested-layouts-outlet | U | Week05 s10; Frontend guide AppLayout.tsx |

### T05 — 22 Oct 2026 · Lecture 5: Forms, Validation & CRUD · Tutorial 5: CRUD Application
Materials: **supplied** (Week05 deck, Campus Event Frontend guide). Assessment: Frontend development checkpoint.

| Lesson id | Kind | Source |
|---|---|---|
| router-dynamic-params | U | Week05 s9; Frontend guide EventDetails/EventEdit |
| router-navigation | U | Week05 s11; Frontend guide EventNew (`navigate(..., { replace: true })`), NavLink |
| router-search-params | S | Not supplied (`useSearchParams` — mock A18; reactrouter.com) |
| forms-controlled-inputs | U | Week05 s23 |
| forms-validation | U | Week05 s24–25; mock D3a |
| forms-zod-rhf | U | Week05 s26; Frontend guide EventForm |
| crud-post-put-delete | U | Week05 s28–37; Frontend guide eventService/api.ts; EventsController |

### T06 — 29 Oct 2026 · No classes (Engagement Week)
Materials: **none**. Coursework released (specification not supplied). No lessons.

### T07 — 5 Nov 2026 · Lecture 6: Authentication, JWT & Protected React Applications · Tutorial 6: Authenticated React Application
Materials: **missing** (slides not supplied).

| Lesson id | Kind | Source |
|---|---|---|
| sec-authn-authz | S (+U backend) | Mock E2; backend `[Authorize]` vs `[Authorize(Roles="ADMIN")]`; Lecture 01 s25 vocabulary |
| sec-jwt-anatomy | S (+U backend) | `JWTService.cs` claims/expiry; Lecture 01 s25; jwt.io-style decoding (supplementary) |
| sec-401-403-expiry | S (+U backend) | Postman guide §15; `AuthResponseDto.ExpiresAt`; mock A5, B5, C5, E1, B15 |
| router-protected-routes | S | Not supplied (reactrouter.com `Navigate`/`Outlet` guard pattern) |
| sec-token-storage | S | Lecture 01 s4 notes ("httponly cookie is better"); Frontend guide .env security note; OWASP |

### T08 — 12 Nov 2026 · Lecture 7: Modern State Management · Tutorial 7: Professional State Management
Materials: **missing**. Assessment: responsive UI / coursework milestone.

| Lesson id | Kind | Source |
|---|---|---|
| state-kinds | S | Roadmap T08 description only; mock D4a |
| tq-server-state | S | Week03 s28 preview only; tanstack.com/query |
| tq-usequery-keys | S | tanstack.com/query |
| tq-stale-gc | S | mock A11; tanstack.com/query |
| tq-mutations-invalidation | S | mock A15, C4, D4c; tanstack.com/query |
| zustand-basics | S | mock A12; zustand docs |
| zustand-selectors | S | mock D4d, B7; zustand docs |
| zustand-persist | S | zustand docs |

### T09 — 19 Nov 2026 · Lecture 8: Responsive, Accessible & Modern UI Development · Tutorial 8: MOCK ICT
Materials: **partial** (mock paper supplied; Lecture 8 slides missing). Assessment: Mock ICT 19 Nov 2026.

| Lesson id | Kind | Source |
|---|---|---|
| css-responsive-clamp | U/S | (repeat of T04) mock A16 |
| a11y-focus-keyboard | S | mock A20; Bootstrap part 03 p.11 and Bootstrap-Explanation (ARIA) as university context |

### T10 — 26 Nov 2026 · Lecture 9: Advanced Client-side Features & Application Workflows · Tutorial 9: ICT
Materials: **missing** (not yet delivered). Assessment: **ICT (lab-based) 26 Nov 2026 — 40 %, qualifying mark 30/100**.

| Lesson id | Kind | Source |
|---|---|---|
| arch-search-filter-pagination | S | Bootstrap part 02 pp.18–19 (pagination markup only); otherwise supplementary |

### T11 — 3 Dec 2026 · Lecture 10: Professional React Development · Tutorial 10: Coursework consolidation
Materials: **missing**.

| Lesson id | Kind | Source |
|---|---|---|
| arch-project-structure | U/S | Week05 s15–16, Lecture 02 s43, Week03 s28 (university); Lecture 10 itself missing |
| perf-memoization | S | Frontend guide uses `useMemo` in EventEdit (single example); otherwise react.dev |
| sec-xss-csrf-https | S | OWASP, MDN; Lecture 01 s4 notes (cookies) as context; mock E4 |

### T12 — 10 Dec 2026 · Lecture 11: Frontend Testing with Vitest & React Testing Library · Tutorial 11: Testing & coursework support
Materials: **missing**. Final coursework due 7 Jan 2027 13:00 (60 %, qualifying mark 30/100).

| Lesson id | Kind | Source |
|---|---|---|
| testing-vitest-rtl | S | vitest.dev, testing-library.com |

---

## 3. Summary counts

| Path | Weeks/modules | Unique lesson ids | Fully university (U) | Partial (U/S) | Supplementary (S, incl. S+backend) |
|---|---|---:|---:|---:|---:|
| University Academy | 12 weeks (T06 empty) | 58 | 26 | 9 | 23 |

Weeks with supplied lecture material: T01, T02, T03, T05 (fully), T04 (different topic than roadmap), T09 (mock only).
Weeks relying entirely on supplementary content: T07, T08, T10, T11, T12.
