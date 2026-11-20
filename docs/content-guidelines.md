# Content Authoring Guidelines (for all content contributors)

Project: **ACS Command Center** — an interactive learning app for University of Westminster module
5COSC026W Advanced Client-Side Development (2026/27). Student has an ICT exam on **26 Nov 2026**
(today is 20 Nov 2026) and a coursework deadline of 7 Jan 2027. Target: understanding, not memorisation.

## Stack versions (be accurate to these)
- React 19 (function components, hooks; StrictMode double-invokes effects in development)
- React Router **7** imported from `react-router-dom` (the course guide uses `react-router-dom`;
  `BrowserRouter`, `Routes`, `Route`, `Outlet`, `Link`, `NavLink`, `Navigate`, `useNavigate`, `useParams`,
  `useSearchParams`, `useLocation`). Declarative `<Routes>` style is what the course teaches; mention
  `createBrowserRouter` only as an alternative.
- TanStack Query **v5**: `useQuery({ queryKey, queryFn })`, `useMutation`, `useQueryClient`,
  `queryClient.invalidateQueries({ queryKey })`, `setQueryData`; status is `'pending' | 'error' | 'success'`,
  `isPending`, `isFetching`, `isLoading` (= isPending && isFetching). `gcTime` (v5) replaced `cacheTime` (v4).
  Defaults: staleTime 0, gcTime 5 minutes, retry 3 (with exponential backoff), refetchOnWindowFocus true.
- Zustand **v5**: `import { create } from 'zustand'`; `create<State>()((set, get) => ({...}))`;
  `useShallow` from `zustand/react/shallow`; `persist` from `zustand/middleware`.
- TypeScript 6 strict. Zod 4. React Hook Form 7 with `zodResolver` from `@hookform/resolvers/zod`.
- CampusEvents backend (ASP.NET Core): base URL `http://localhost:5229/api`. Endpoints:
  `GET /api/events`, `GET /api/events/{id}`, `POST /api/events` (ADMIN, 201 + EventDto),
  `PUT /api/events/{id}` (ADMIN, **204 No Content**), `DELETE /api/events/{id}` (ADMIN, 204; 400 if bookings/reviews exist),
  `GET /api/categories`, `POST /api/auth/register`, `POST /api/auth/login` → `{ token, expiresAt, userId, email, firstName, lastName, role }`,
  bookings (`GET /api/bookings/my-bookings`, `POST /api/bookings`, `PUT /api/bookings/{id}/cancel`, `PATCH /api/bookings/{id}/status` ADMIN),
  reviews (`GET /api/reviews/event/{eventId}`, `POST /api/reviews`, `DELETE /api/reviews/{id}`).
  Roles: `USER`, `ADMIN` (note: the Postman guide writes User/Admin). Login returns a single `role` = the user's FIRST role, so an admin may appear as "USER" in the response — don't rely on it alone. Register returns 200 `{ message }` with no token (log in afterwards). JWT payload (JwtSecurityTokenHandler outbound mapping) uses short keys: `sub`, `email`, `nameid`, `unique_name`, `role`, `exp`, `iss`, `aud` (verify against a real token before claiming exact key names). The API listens on http://localhost:5229 and https://localhost:7119. CORS allows `http://localhost:5173`.
  Event shape: `{ id, title, description, imageUrl: string|null, startDate, endDate, location, price, capacity, availableTickets, categoryId, categoryName }`.

## Source classification — NEVER fabricate
Every lesson has `sources: SourceRef[]`. Use `kind: "university"` ONLY for material that is really in the
supplied files (see `extracted-materials/text/*.txt` and `extracted-materials/nested/**`). Cite the real
file and slide numbers. Supplied lectures: Lecture 01 (web/HTTP/MVC/DTO/JWT-cookie-session), Lecture 02
(React + TS + modern JS), Week 03 (Consuming REST APIs), Lecture 04 PDFs (HTML5/CSS3, Bootstrap ×3),
Week 05 deck (Routing, Architecture, Forms, Validation, CRUD), Week 02 tutorial guide, Campus Event
Frontend guide, Postman guide, week_4_tutorial.pdf (Bootstrap shopping page), MOCK ICT.
**Missing** (not supplied): Lecture 6 Auth/JWT, Lecture 7 State Management, Lecture 8 Responsive/Accessible UI,
Lectures 9–11. Lessons on those topics must use `kind: "supplementary"` / `"best-practice"` and cite real
official docs (MDN, react.dev, reactrouter.com, tanstack.com/query/latest, zustand.docs.pmnd.rs, owasp.org,
typescriptlang.org). Only use URLs you are confident exist (prefer top-level doc pages).

## Accuracy rules (examples of traps to avoid)
- `fetch` rejects only on network failure/abort, not on HTTP 4xx/5xx — check `response.ok`.
- 204 responses have no body — do not call `response.json()` on them.
- Microtasks (promise reactions) run before the next task (setTimeout); the event loop drains ALL microtasks.
- React state updates are scheduled, not immediate; a render sees a snapshot. Not every render mutates the DOM.
- TypeScript types are erased at compile time and do NOT validate runtime API data.
- A signed JWT is encoded, not encrypted. Decoding ≠ verifying. Frontend guards are UX, not security.
- `staleTime` = how long data is fresh; `gcTime` = how long INACTIVE (unobserved) cache entries are kept before garbage collection.
- `invalidateQueries` marks matching queries stale and refetches the ACTIVE ones (by default).
- Zustand selectors cause re-render only when the selected value changes (by `Object.is`); they do not eliminate all re-renders.
- Route params from `useParams()` are strings (or undefined).
- 401 = not authenticated (missing/invalid/expired credentials); 403 = authenticated but not permitted.
- PUT replaces/updates a resource at a known URL (idempotent); POST creates (not idempotent); PATCH partially updates.

## Writing style
- Beginner level: plain language, analogies, but never technically false.
- Developer level: practical code patterns and API details.
- Deep level: internals, edge cases, performance, professional practice.
- Use markdown. Fenced code blocks MUST carry a language tag (`ts`, `tsx`, `js`, `jsx`, `css`, `html`, `json`, `http`, `text`).
- Mechanism diagrams: ```text fenced ASCII diagrams with boxes/arrows, followed by a short explanation.
- Code must be correct and compile under TS strict where it's TS/TSX.
- UK spelling is fine (the module uses it) but be consistent within a file.

## TypeScript file mechanics
- Content files are `.ts` modules that `import type { ... } from "../types";` and export a typed array.
- Multi-line strings use template literals. **Escape** backticks as \` and `${` as \${ inside them.
  (Tip: for code samples full of template literals, check carefully that the TS still compiles.)
- Verify your file compiles: `npx tsc -p tsconfig.app.json --noEmit 2>&1 | grep -F "<your file path fragment>"`
  should print nothing. Other files may have unrelated errors while the project is being built — ignore those.
- Only create/edit the files you were assigned. Do not run `npm install`, do not edit package.json, do not touch other folders.

## Visualizer ids lessons may reference (`visualizers: [...]`)
url-anatomy, http-lab, event-loop, array-methods, reduce-accumulator, reference-copy, closure-scope,
promise-lifecycle, ts-compile, react-state-queue, render-commit, useeffect-lifecycle, props-flow,
route-matcher, outlet-layout, abort-race, cors-preflight, crud-simulator, form-validation, jwt-explorer,
auth-flow, trust-boundary, query-cache, zustand-selectors, state-decision, box-model, flexbox,
grid-areas, clamp, specificity, architecture-flow
