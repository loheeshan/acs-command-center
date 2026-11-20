# Exam Topic Matrix — MOCK ICT

Source: `MOCK ICT.docx` (text: `extracted-materials/text-root/MOCK_ICT.docx.txt`). 90 minutes, 100 marks.
Sections: A MCQ 20×1 · B True/False 15×1 · C Short answer 5×3 · D Programming/analysis 4×10 · E Front-end security 5×2.
The paper states: "All questions are based on client-side development. Backend implementation is outside the scope."
The real ICT (26 Nov 2026, 40 %) is delivered on Blackboard.

Column notes: **University source** cites the real file and slide/page; "not in supplied lectures" means no supplied file teaches it.
**Lesson id** and **visualizer** ids are from `src/content/modules.ts` and `docs/content-guidelines.md`.
Expected answers are given for orientation only.

## Section A — Multiple choice (20 × 1)

| Q | Marks | Primary concept (answer) | Prerequisite | University source | Lesson id | Visualizer | Common misconception |
|---|---:|---|---|---|---|---|---|
| A1 | 1 | `reduce()` for a single accumulated value (B) | Callbacks, arrays | Lecture 02 s35, s36 (images); `Advanced Examples/reduceJS.html` | js-array-reduce | reduce-accumulator | Thinking `find`/`slice` aggregate; forgetting the initial value (empty array throws without it). |
| A2 | 1 | `useNavigate()` for programmatic navigation (C) | Router basics | Week05 s11; Frontend guide EventNew.tsx | router-navigation | route-matcher | Confusing with `useLocation` (reads location) or `<Navigate>` (component for render-time redirects). |
| A3 | 1 | `type` keyword defines a type alias (B) | TS basics | Week05 s18 uses `type Event = {…}` (code only, not explained) | ts-basics-interfaces | ts-compile | Believing `interface` and `type` are identical in every case, or that aliases exist at runtime. |
| A4 | 1 | Conditional rendering (A) | JSX expressions, state | Lecture 02 s24 | react-conditional-rendering | render-commit | `&&` with a numeric `0` renders "0"; thinking CSS hiding is the React technique. |
| A5 | 1 | 401 = not authenticated (C) | Status-code classes | Not in Lecture 01 s14 list; Postman guide §12, §15; Frontend guide `api.ts` getErrorMessage | sec-401-403-expiry | http-lab | Swapping 401 and 403 (the name "Unauthorized" actually means unauthenticated). |
| A6 | 1 | `<Outlet />` renders child routes inside a layout (B) | Nested routes | Week05 s10; Frontend guide AppLayout.tsx | router-nested-layouts-outlet | outlet-layout | Thinking `Outlet` is a link or that children must be passed as props. |
| A7 | 1 | `Promise.all()` waits for all promises (A) | Promises | Not in supplied lectures (Week03 s9 and Lecture 02 s37 cover single promises only) | js-promises-async | promise-lifecycle | `Promise.all` **rejects as soon as any input rejects** (fail-fast); "wait for all to settle" is `Promise.allSettled`. Option A's wording blurs this. Also: it runs operations concurrently, not one after another. |
| A8 | 1 | Interface defines object shape (A) | Objects | Lecture 02 s40; Week03 s14–15 | ts-basics-interfaces | ts-compile | Thinking interfaces validate data at runtime (they are erased). |
| A9 | 1 | `grid-template-areas` (A) | CSS Grid basics | Not in supplied lectures (missing Lecture 8) | css-grid | grid-areas | Expecting Bootstrap's grid classes to be "CSS Grid" — Bootstrap's grid is Flexbox-based (Bootstrap part 02 p.2). |
| A10 | 1 | `useParams()` (B) | Dynamic segments | Week05 s9; Frontend guide EventDetails.tsx | router-dynamic-params | route-matcher | Forgetting the value is a **string** (or undefined) — `"42"`, not `42`. |
| A11 | 1 | `staleTime` = how long data is fresh (A) | Server-state caching | Not in supplied lectures (Week03 s28 previews TanStack Query only) | tq-stale-gc | query-cache | Confusing with `gcTime` (how long **inactive** cache is kept); default staleTime is 0. |
| A12 | 1 | The store's generated hook, e.g. `useStore(s => s.x)` (C) | Hooks | Not in supplied lectures (missing Lecture 7) | zustand-basics | zustand-selectors | Thinking Zustand needs Context/Provider or `useState`. |
| A13 | 1 | 204 = success, no body (A) | Status classes | Postman guide §12–13 (cancel/delete → 204); Frontend guide `api.ts` §7 and eventService §8 | http-methods-status | http-lab | Calling `response.json()` on a 204 (throws). |
| A14 | 1 | Union `string \| number` (B) | Primitive types | Week03 s14 (`string \| null` in code, not explained) | ts-basics-interfaces | ts-compile | Confusing `\|` (union) with `&` (intersection — `string & number` is `never`). |
| A15 | 1 | `invalidateQueries()` marks matching queries stale so they refetch (B) | Query keys, staleTime | Not in supplied lectures | tq-mutations-invalidation | query-cache | Thinking it deletes cache data or always refetches every query; by default it refetches **active** queries and marks others stale. |
| A16 | 1 | `clamp(min, preferred, max)` (C) | CSS units, `calc` | Not in supplied lectures (missing Lecture 8) | css-responsive-clamp | clamp | Confusing with `minmax()` (grid tracks only). |
| A17 | 1 | Client-side validation (A) | Forms | Week05 s24–25; Frontend guide EventForm | forms-validation | form-validation | Treating client validation as security (see B9). |
| A18 | 1 | `useSearchParams()` (A) | URL anatomy | Not in supplied lectures | router-search-params | url-anatomy | Using `useParams` for `?query=` values. |
| A19 | 1 | Service module separates data access from presentation (B) | Components, fetch | Week03 s16–18, s28; Week05 s15, s19 | http-service-modules | architecture-flow | Believing a service layer prevents network errors. |
| A20 | 1 | `:focus-visible` styles focus when a visible indicator is appropriate, e.g. keyboard (A) | Pseudo-classes, keyboard a11y | Not in supplied lectures (missing Lecture 8) | a11y-focus-keyboard | specificity | Removing outlines with `outline: none` and no replacement; thinking it equals `:focus`. |

## Section B — True/False (15 × 1)

| Q | Marks | Primary concept (answer) | Prerequisite | University source | Lesson id | Visualizer | Common misconception |
|---|---:|---|---|---|---|---|---|
| B1 | 1 | Client-side routing without full reloads (True) | SPA model | Week05 s5; Lecture 01 s17 | router-basics | route-matcher | Using `<a href>` for internal links (causes a full reload) — Week05 s11. |
| B2 | 1 | Interfaces describe API object shapes (True) | Interfaces | Week03 s14–15; Week05 s18 | ts-basics-interfaces | ts-compile | Believing the interface guarantees the runtime JSON matches. |
| B3 | 1 | `find()` returns only the first match (False) | Array methods | Not in supplied lectures (Lecture 02 covers map/filter/reduce) | js-array-methods | array-methods | Confusing `find` (first element or `undefined`) with `filter` (array of all matches). |
| B4 | 1 | Custom hooks obey the Rules of Hooks (True) | Hooks | Week03 s27–29 (custom hooks; rules not stated explicitly) | react-custom-hooks | useeffect-lifecycle | Calling hooks inside conditions/loops/handlers; naming a hook without the `use` prefix. |
| B5 | 1 | 403 = understood but insufficient permission (True) | Authn vs authz | Lecture 01 s14; Postman guide §15 | sec-401-403-expiry | auth-flow | Treating 403 as "log in again" (that is 401). |
| B6 | 1 | TanStack Query manages async server data (True) | Server vs client state | Not in supplied lectures (Week03 s28 preview) | tq-server-state | query-cache | Calling it a data-fetching library only (it does not fetch; your `queryFn` does). |
| B7 | 1 | Zustand does **not** require subscribing to the whole store (False) | Selectors | Not in supplied lectures | zustand-selectors | zustand-selectors | Calling `useStore()` with no selector everywhere (re-renders on any change). |
| B8 | 1 | Dynamic route param identifies the record (True) | Route patterns | Week05 s7, s9 | router-dynamic-params | route-matcher | Valid route ≠ valid record (Week05 s12: `/events/999` may 404). |
| B9 | 1 | Client validation does **not** guarantee invalid data never reaches the server (False) | Trust boundary | Week05 s24 ("Never treat browser validation as a security boundary"); Frontend guide §14 note | forms-validation | trust-boundary | Believing disabled buttons / HTML `required` stop crafted requests (Postman/curl bypass them). |
| B10 | 1 | PUT can update an existing resource (True) | HTTP methods | Week03 s6; Week05 s29, s31; EventsController `[HttpPut]` | crud-post-put-delete | crud-simulator | Thinking PUT creates (POST) or is partial (PATCH). |
| B11 | 1 | Different layouts for different route groups (True) | Layout routes | Week05 s10 (single layout shown); multiple layout groups not shown | router-nested-layouts-outlet | outlet-layout | Believing only one root layout is allowed. |
| B12 | 1 | `minmax()` sets min/max grid track sizes (True) | CSS Grid | Not in supplied lectures | css-grid | grid-areas | Using `minmax()` outside grid templates. |
| B13 | 1 | Union types (True) | Types | Week03 s14 (`string \| null`, code only) | ts-basics-interfaces | ts-compile | Accessing members without narrowing. |
| B14 | 1 | TanStack Query and Zustand are **not** interchangeable server-response stores (False) | State kinds | Not in supplied lectures (roadmap T08 description) | state-kinds | state-decision | "Put API data in Zustand" — duplicates server cache and loses staleness/refetch. |
| B15 | 1 | Frontend can read JWT `exp` to judge likely expiry (True) | JWT structure | Lecture 01 s25 (JWT defined); backend `AuthResponseDto.ExpiresAt`, `JWTService` 2-hour expiry | sec-jwt-anatomy | jwt-explorer | Thinking decoding = verifying, or that the client check replaces server validation (`ValidateLifetime = true` in Program.cs). |

## Section C — Short answer (5 × 3)

| Q | Marks | Primary concept (expected answer) | Prerequisite | University source | Lesson id | Visualizer | Common misconception |
|---|---:|---|---|---|---|---|---|
| C1 | 3 | `const total = prices.reduce((sum, p) => sum + p, 0);` → 80 | Arrow functions | Lecture 02 s35; `reduceJS.html` | js-array-reduce | reduce-accumulator | Omitting the initial value or the `return` inside a block-bodied arrow. |
| C2 | 3 | `interface Product { id: number; name: string; price: number; description?: string; }` | Optional properties | Lecture 02 s40; Frontend guide `Category.ts` (`description?`) | ts-basics-interfaces | ts-compile | Writing `description: string \| undefined` (not optional) or using `=` / commas inconsistently. |
| C3 | 3 | `useParams()`; `const { orderId } = useParams();` | Destructuring | Week05 s9; Frontend guide EventEdit.tsx (`useParams<{ id: string }>()`) | router-dynamic-params | route-matcher | Destructuring the wrong name (`id` vs `orderId`); assuming a number. |
| C4 | 3 | `queryClient.invalidateQueries({ queryKey: ['customer', id] })` — marks matching cached queries stale and refetches active ones | Query keys, mutations | Not in supplied lectures | tq-mutations-invalidation | query-cache | v4 syntax `invalidateQueries(['customer'])`; thinking it updates data directly (that is `setQueryData`). |
| C5 | 3 | 401: not authenticated → re-login/refresh; 403: authenticated but not permitted → show "no permission", re-login will not help | Authn vs authz | Lecture 01 s14 (403 only); Postman guide §15; Frontend guide `api.ts` messages | sec-401-403-expiry | auth-flow | Redirecting to login on 403; treating both identically. |

## Section D — Programming, explanation and code analysis (4 × 10)

| Q | Marks | Primary concept | Prerequisite | University source | Lesson id | Visualizer | Common misconception |
|---|---:|---|---|---|---|---|---|
| D1a | 4 | Route config with shared layout: layout `Route` (element `<Layout/>`) containing `/`, `/students`, `/students/:studentId`, `/settings` | BrowserRouter, Routes | Week05 s8, s10; Frontend guide App.tsx §23 + main.tsx §24 | router-nested-layouts-outlet | outlet-layout | Forgetting `<BrowserRouter>` or `<Outlet/>` in the layout; absolute vs relative child paths mixed up; using `index` incorrectly. |
| D1b | 2 | `<Outlet />` is where the matched child route renders inside the parent layout | Nested routes | Week05 s10; Frontend guide AppLayout §16 | router-nested-layouts-outlet | outlet-layout | Thinking the layout re-mounts on each navigation (it stays mounted; only the outlet content changes). |
| D1c | 2 | Component using `const { studentId } = useParams();` and rendering it | Hooks | Week05 s9 | router-dynamic-params | route-matcher | Reading `props.studentId`; calling the hook conditionally. |
| D1d | 2 | `const navigate = useNavigate(); … navigate('/settings')` after a successful save | Async handlers | Week05 s11, s34 ("Navigating away before a mutation has succeeded"); Frontend guide EventNew | router-navigation | route-matcher | Navigating before the save resolves; calling `useNavigate()` inside the handler instead of the component body. |
| D2a | 2 | Network I/O takes time; async keeps the UI responsive (non-blocking) | Event loop basics | Week03 s8–10 | js-promises-async | event-loop | "Async makes the request faster"; JavaScript is multi-threaded. |
| D2b | 6 | `useEffect` + `useState` (loading/error/data) + `fetch` + `response.ok` + **AbortController** cleanup; render count | Effects, cleanup, fetch | Week03 s11–12, s21–25, s27; Frontend guide useEvents §10 (uses `active` flag). AbortController **not in supplied lectures** | http-abortcontroller (with react-useeffect, http-fetch-response-ok, http-four-ui-states) | abort-race | Not checking `response.ok`; `async` effect callback; no cleanup; treating `AbortError` as a user-visible error; missing `[]`. |
| D2c | 2 | Service module: single place for URL, errors, parsing; reuse and easier change/testing | Modules | Week03 s16–18, s28; Week05 s19, s34 | http-service-modules | architecture-flow | "It makes requests faster" or "removes the need for error handling". |
| D3a | 4 | Validation function returning an errors object (trimmed non-empty name/location; `Number.isInteger(n) && n > 0`) | Types, conditionals | Week05 s24–26; Frontend guide EventForm (Zod) | forms-validation | form-validation | Not trimming whitespace; `parseInt("3.5")` passing as integer; accepting `"10abc"`; returning a boolean with no messages. |
| D3b | 3 | `fetch('/api/events', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })` + `response.ok` check | fetch | Week05 s30; Frontend guide `api.ts` | crud-post-put-delete | crud-simulator | Forgetting `JSON.stringify` or the content-type header; not checking `response.ok`. |
| D3c | 3 | POST creates (server assigns id; not idempotent; usually 201) vs PUT replaces/updates at a known URL (idempotent; often 204) | HTTP semantics | Week03 s6; Week05 s29–31, s37; EventsController (201 vs 204) | crud-post-put-delete | http-lab | "PUT = partial update" (that is PATCH); "POST is only for forms". |
| D4a | 4 | Theme → Zustand (global client state); product data, caching, refresh after update, fewer requests → TanStack Query (server state) | State kinds | Not in supplied lectures (roadmap T08 only) | state-kinds | state-decision | Putting server data in Zustand; using TanStack Query for UI theme. |
| D4b | 2 | Query cache keyed by `queryKey`; fresh data served without refetch during `staleTime`; dedupes requests, instant UI | Query keys | Not in supplied lectures | tq-stale-gc | query-cache | Confusing `staleTime` with `gcTime`; thinking cache persists across page reloads by default. |
| D4c | 2 | `useMutation` with `onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] })` (or `setQueryData`) | Mutations | Not in supplied lectures | tq-mutations-invalidation | query-cache | Manually refetching every component; invalidating before the mutation succeeds. |
| D4d | 2 | Selector subscribes a component to a slice → re-renders only when that slice changes (`Object.is`) | Store, references | Not in supplied lectures | zustand-selectors | zustand-selectors | Selector returning a new object/array each call (re-renders every time; use `useShallow`). |

## Section E — Front-end security (5 × 2)

| Q | Marks | Primary concept (answer) | Prerequisite | University source | Lesson id | Visualizer | Common misconception |
|---|---:|---|---|---|---|---|---|
| E1 | 2 | Handle expired token → re-authenticate or renewal flow (B) | JWT `exp`, 401 | Backend: `JWTService` (2 h expiry), `AuthResponseDto.ExpiresAt`, Program.cs `ValidateLifetime = true`; Lecture 6 missing | sec-401-403-expiry | jwt-explorer | Keeping the user "logged in" in UI state after the token expired. |
| E2 | 2 | Authentication = who you are; authorisation = what you may access (A) | — | Lecture 01 s25 (vocabulary only); backend `[Authorize]` vs `[Authorize(Roles = "ADMIN")]`; Lecture 6 missing | sec-authn-authz | auth-flow | Using the terms interchangeably. |
| E3 | 2 | Client-side code can be manipulated; server must enforce permissions (B) | Trust boundary | Week05 s24; Frontend guide §21 note ("backend must still enforce administrator permissions"); EventsController role attributes | router-protected-routes | trust-boundary | "Protected routes are security" — they are UX only. |
| E4 | 2 | HTTPS protects tokens in transit (True) | TLS basics | Not in supplied lectures (Lecture 01 covers HTTP/port 80 only) | sec-xss-csrf-https | http-lab | HTTPS does not protect a token once it is in the browser (XSS can still read `localStorage`). |
| E5 | 2 | API data is **not** automatically trustworthy (False) | Runtime validation, XSS | Frontend guide §7 ("The generic type T … does not validate the JSON at runtime"); Week03 s14 warning | sec-xss-csrf-https | trust-boundary | Believing TypeScript types or a 200 status validate the data. |

---

## Topic-weight summary (where the 100 marks concentrate)

Each question is assigned to exactly one primary topic.

| Topic | Questions | Marks | Share | Covered by supplied university files? |
|---|---|---:|---:|---|
| HTTP & API consumption (fetch, status codes, services, async React data loading, POST/PUT) | A5, A13, A19, B5, B10, C5, D2b, D2c, D3b, D3c | **22** | 22 % | Mostly (Week03, Week05, Postman guide); AbortController (part of D2b) not |
| React Router | A2, A6, A10, A18, B1, B8, B11, C3, D1a–d | **20** | 20 % | Yes (Week05, Frontend guide) except `useSearchParams` (A18, 1 mark) |
| Front-end security | B15, E1–E5 | **11** | 11 % | Largely no — Lecture 6 missing; backend code + Postman guide give partial grounding |
| TanStack Query | A11, A15, B6, C4, D4b, D4c | **10** | 10 % | No — Lecture 7 missing |
| JavaScript core (reduce, promises, find, async) | A1, A7, B3, C1, D2a | **8** | 8 % | Partly — reduce and async yes; `Promise.all` and `find()` no |
| TypeScript | A3, A8, A14, B2, B13, C2 | **8** | 8 % | Mostly — interfaces taught; `type` alias and unions appear only in code |
| Forms & validation | A17, B9, D3a | **6** | 6 % | Yes (Week05, Frontend guide) |
| State-management architecture | B14, D4a | **5** | 5 % | No — Lecture 7 missing |
| Zustand | A12, B7, D4d | **4** | 4 % | No — Lecture 7 missing |
| CSS / responsive / accessibility | A9, A16, A20, B12 | **4** | 4 % | No — Lecture 8 missing |
| React core (conditional rendering, rules of hooks) | A4, B4 | **2** | 2 % | Yes (Lecture 02 s24, Week03 s27–29) |
| **Total** | | **100** | 100 % | |

### Coverage by supplied material (approximate)

| Grouping | Marks |
|---|---:|
| Topics with **no** supplied lecture (TanStack Query 10, Zustand 4, State architecture 5, CSS Grid/clamp/:focus-visible 4) | 23 |
| Security questions taught only indirectly (B15, E1–E5) | 11 |
| Individual uncovered items inside covered topics (A7 `Promise.all`, B3 `find()`, A18 `useSearchParams`) | 3 |
| AbortController portion of D2b (cleanup/"avoid updating after unmount" — guide teaches an `active` flag alternative) | part of 6 |
| **≈ 37 marks** depend on content outside the supplied lectures | ~37 |

### Study-priority implications

1. **Router + HTTP/API consumption = 42 marks**, fully supported by Week03/Week05 and the CampusEvents code — highest return.
2. **State management (TanStack Query + Zustand + architecture) = 19 marks** with no supplied lecture — supplementary lessons `tq-*`, `zustand-*`, `state-kinds` are critical.
3. **Security = 11 marks** — conceptual; anchor in the real CampusEvents backend (`[Authorize]`, roles, `ValidateLifetime`, 401 vs 403 per Postman guide §15).
4. Section D (40 marks) rewards **writing code from memory**: route config with layout, `useParams`/`useNavigate`, effect + AbortController fetch, validation function, POST with headers/`JSON.stringify`, invalidation after mutation.
