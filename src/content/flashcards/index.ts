import type { Flashcard } from "../types";

/**
 * Flashcards for spaced revision. `highPriority` cards form the
 * last-minute ICT essentials deck.
 */
export const flashcards: Flashcard[] = [
  /* ---------------------------- HTTP / REST ---------------------------- */
  {
    id: "fc-001",
    topic: "http-api",
    front: "Does `fetch` reject its promise on a 404 or 500 response?",
    back: "No. `fetch` resolves for ANY HTTP response. It rejects only on network failure, CORS block or abort. Check `response.ok` (true for 200–299) and throw yourself.",
    code: `const res = await fetch("/api/events");
if (!res.ok) throw new Error("HTTP " + res.status);
const data = await res.json();`,
    lessonId: "http-fetch-response-ok",
    highPriority: true,
  },
  {
    id: "fc-002",
    topic: "http-api",
    front: "HTTP 200 vs 201 vs 204",
    back: "200 OK: success with a body. 201 Created: a new resource was created (typical POST response, often with the new object and a Location header). 204 No Content: success with NO body (typical PUT/DELETE): don't call `response.json()`.",
    lessonId: "http-fetch-response-ok",
    highPriority: true,
  },
  {
    id: "fc-003",
    topic: "http-api",
    front: "HTTP 400 vs 404 vs 409",
    back: "400 Bad Request: the request is invalid (e.g. validation failed). 404 Not Found: the resource does not exist. 409 Conflict: the request conflicts with current state (e.g. duplicate).",
    lessonId: "http-fetch-response-ok",
    highPriority: true,
  },
  {
    id: "fc-004",
    topic: "security",
    front: "401 vs 403",
    back: "401 Unauthorized = NOT AUTHENTICATED: missing, invalid or expired credentials → log in again. 403 Forbidden = authenticated but NOT PERMITTED (e.g. USER calling an ADMIN endpoint) → logging in again won't help.",
    lessonId: "sec-401-403-expiry",
    highPriority: true,
  },
  {
    id: "fc-005",
    topic: "http-api",
    front: "What do 5xx status codes mean?",
    back: "Server-side errors (500 Internal Server Error, 502 Bad Gateway, 503 Service Unavailable). The request may be fine; retrying later can succeed.",
    lessonId: "http-fetch-response-ok",
    highPriority: true,
  },
  {
    id: "fc-006",
    topic: "http-api",
    front: "POST vs PUT vs PATCH",
    back: "POST creates a new resource (server assigns the id) and is NOT idempotent. PUT replaces/updates the resource at a known URL and IS idempotent. PATCH partially updates a resource.",
    code: `POST /api/events        -> create (201)
PUT  /api/events/7      -> update event 7 (204)
PATCH /api/bookings/3/status -> change one field`,
    lessonId: "crud-post-put-delete",
    highPriority: true,
  },
  {
    id: "fc-007",
    topic: "http-api",
    front: "What does 'idempotent' mean for HTTP methods?",
    back: "Repeating the same request has the same effect on the server as sending it once. GET, PUT and DELETE are idempotent; POST is not (two POSTs create two resources).",
    lessonId: "crud-post-put-delete",
  },
  {
    id: "fc-008",
    topic: "http-api",
    front: "Which HTTP methods are 'safe'?",
    back: "GET, HEAD and OPTIONS: they should not change server state. Safe methods are also idempotent.",
  },
  {
    id: "fc-009",
    topic: "http-api",
    front: "How do you send JSON in a POST with fetch?",
    back: "Set `method: \"POST\"`, the header `Content-Type: application/json`, and serialise the body with `JSON.stringify`.",
    code: `await fetch(url, {
  method: "POST",
  headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
  body: JSON.stringify(newEvent),
});`,
    lessonId: "crud-post-put-delete",
    highPriority: true,
  },
  {
    id: "fc-010",
    topic: "http-api",
    front: "Why must you not call `response.json()` on a 204 response?",
    back: "204 has no body; parsing an empty body throws `SyntaxError: Unexpected end of JSON input`, making a successful request look like a failure.",
    lessonId: "http-service-modules",
  },
  {
    id: "fc-011",
    topic: "http-api",
    front: "What is `AbortController` used for with fetch?",
    back: "Cancelling a request: pass `controller.signal` to `fetch` and call `controller.abort()` (e.g. in a useEffect cleanup). The fetch rejects with an `AbortError`, which you usually ignore.",
    code: `useEffect(() => {
  const controller = new AbortController();
  fetch(url, { signal: controller.signal }).then(/* ... */);
  return () => controller.abort();
}, [url]);`,
    lessonId: "http-abortcontroller",
  },
  {
    id: "fc-012",
    topic: "http-api",
    front: "Why put API calls in a service module (e.g. `services/eventService.ts`)?",
    back: "Separation of concerns: components focus on UI; the service centralises base URL, headers, auth token, error handling and typing. Easier to reuse, test and change.",
    lessonId: "http-service-modules",
  },
  {
    id: "fc-013",
    topic: "http-api",
    front: "What is a REST resource URL convention?",
    back: "Plural nouns for collections and ids for items; the HTTP method expresses the action: `GET /api/events`, `GET /api/events/7`, `POST /api/events`, `PUT /api/events/7`, `DELETE /api/events/7`.",
  },
  {
    id: "fc-014",
    topic: "http-api",
    front: "What is CORS and when does a preflight happen?",
    back: "Cross-Origin Resource Sharing: the browser blocks reading cross-origin responses unless the server sends `Access-Control-Allow-Origin`. A preflight `OPTIONS` request is sent first for 'non-simple' requests, e.g. `Content-Type: application/json` or an `Authorization` header.",
  },
  {
    id: "fc-015",
    topic: "http-api",
    front: "A CORS error appears in the console. Is the fix in the React code?",
    back: "Usually no. CORS is enforced by the browser but configured on the SERVER (e.g. ASP.NET Core must allow `http://localhost:5173`). Alternatively use a dev proxy.",
  },
  {
    id: "fc-016",
    topic: "http-api",
    front: "What is a DTO?",
    back: "Data Transfer Object: the shape of data sent over the API (e.g. EventDto), separate from internal database entities. It controls exactly which fields are exposed.",
  },

  /* ------------------------------ Security ----------------------------- */
  {
    id: "fc-017",
    topic: "security",
    front: "Authentication vs authorisation",
    back: "Authentication (authn) = WHO are you? (login, verifying identity). Authorisation (authz) = WHAT are you allowed to do? (roles/permissions).",
    lessonId: "sec-401-403-expiry",
    highPriority: true,
  },
  {
    id: "fc-018",
    topic: "security",
    front: "Is a signed JWT encrypted?",
    back: "No. A JWT (JWS) is Base64URL-ENCODED and SIGNED, not encrypted. Anyone can decode and read the payload, so never put secrets in it. The signature only proves it was not tampered with.",
    lessonId: "sec-jwt-anatomy",
    highPriority: true,
  },
  {
    id: "fc-019",
    topic: "security",
    front: "What are the three parts of a JWT?",
    back: "`header.payload.signature`, each Base64URL-encoded. Header: algorithm/type. Payload: claims (sub, role, exp...). Signature: HMAC/RSA over header + payload using the server's key.",
    code: `eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwicm9sZSI6IkFETUlOIn0.<signature>`,
    lessonId: "sec-jwt-anatomy",
    highPriority: true,
  },
  {
    id: "fc-020",
    topic: "security",
    front: "Decoding a JWT vs verifying a JWT",
    back: "Decoding just Base64URL-decodes the payload (anyone can). Verifying checks the signature with the secret/public key and validates exp/iss/aud: only the server can trust a token.",
    lessonId: "sec-jwt-anatomy",
    highPriority: true,
  },
  {
    id: "fc-021",
    topic: "security",
    front: "What unit is the JWT `exp` claim in?",
    back: "Seconds since the Unix epoch (NumericDate). `Date.now()` is milliseconds, so compare with `Math.floor(Date.now() / 1000)`.",
    lessonId: "sec-jwt-anatomy",
  },
  {
    id: "fc-022",
    topic: "security",
    front: "How is a JWT sent to the API?",
    back: "In the `Authorization` header with the Bearer scheme.",
    code: `headers: { Authorization: \`Bearer \${token}\` }`,
    lessonId: "sec-jwt-anatomy",
    highPriority: true,
  },
  {
    id: "fc-023",
    topic: "security",
    front: "Do frontend route guards (ProtectedRoute) provide security?",
    back: "No, they are UX only. Users control the browser and can bypass any client check. The SERVER must verify the token and enforce roles on every request.",
    lessonId: "sec-trust-boundaries",
    highPriority: true,
  },
  {
    id: "fc-024",
    topic: "security",
    front: "Storing a JWT in localStorage: main risk?",
    back: "Any JavaScript on the page (e.g. via XSS) can read it and steal the token. HttpOnly cookies cannot be read by JS but need CSRF protection. Either way, preventing XSS is essential.",
    lessonId: "sec-trust-boundaries",
  },
  {
    id: "fc-025",
    topic: "security",
    front: "What is XSS and how does React help?",
    back: "Cross-Site Scripting: attacker-controlled script runs in your page. React escapes values rendered in JSX by default; `dangerouslySetInnerHTML` bypasses that protection.",
    lessonId: "sec-trust-boundaries",
  },
  {
    id: "fc-026",
    topic: "security",
    front: "What is CSRF?",
    back: "Cross-Site Request Forgery: another site makes the user's browser send a request that automatically includes their cookies. Mitigated by SameSite cookies and CSRF tokens. Bearer tokens in headers are not sent automatically.",
  },
  {
    id: "fc-027",
    topic: "security",
    front: "Session (cookie) auth vs JWT auth",
    back: "Session: server stores session state, browser holds a session id cookie (stateful). JWT: the signed token itself carries the claims; the server verifies it without a session store (stateless), but revocation before expiry is harder.",
  },
  {
    id: "fc-028",
    topic: "security",
    front: "What should the frontend do when an API call returns 401?",
    back: "Treat the session as invalid/expired: clear the stored token and user, then redirect to /login (optionally remembering where to return).",
    lessonId: "sec-401-403-expiry",
  },
  {
    id: "fc-029",
    topic: "security",
    front: "What is a trust boundary?",
    back: "The line between code/data you control (the server) and what you don't (the browser, user input, network). Everything crossing into the server must be validated and authorised there.",
    lessonId: "sec-trust-boundaries",
  },

  /* ------------------------------- Router ------------------------------ */
  {
    id: "fc-030",
    topic: "router",
    front: "`useParams()`: what does it return?",
    back: "An object of the dynamic segments in the matched route. Values are STRINGS (or undefined), so convert with `Number(id)` before comparing with numeric ids.",
    code: `// <Route path="/events/:eventId" element={<EventDetails />} />
const { eventId } = useParams();
const id = Number(eventId);`,
    lessonId: "router-dynamic-params",
    highPriority: true,
  },
  {
    id: "fc-031",
    topic: "router",
    front: "`useNavigate()`: what is it for?",
    back: "Programmatic navigation, e.g. after a successful form submit: `navigate(\"/events\")`, `navigate(-1)` to go back, `navigate(\"/login\", { replace: true })` to replace the history entry.",
    code: `const navigate = useNavigate();
// after saving
navigate(\`/events/\${created.id}\`);`,
    highPriority: true,
  },
  {
    id: "fc-032",
    topic: "router",
    front: "`useSearchParams()`: what does it give you?",
    back: "A `[searchParams, setSearchParams]` pair for the URL query string. `searchParams.get(\"q\")` returns a string or null. Good for filters, sorting and pagination that should survive refresh and be shareable.",
    code: `const [searchParams, setSearchParams] = useSearchParams();
const q = searchParams.get("q") ?? "";
setSearchParams({ q: "jazz", sort: "price-asc" });`,
    lessonId: "router-search-params",
    highPriority: true,
  },
  {
    id: "fc-033",
    topic: "router",
    front: "What does `<Outlet />` do?",
    back: "In a parent (layout) route element, it marks where the matched CHILD route renders. Lets a layout (nav, footer) wrap many pages.",
    code: `<Route path="/" element={<Layout />}>
  <Route index element={<Home />} />
  <Route path="events" element={<Events />} />
</Route>
// Layout: <Nav /><main><Outlet /></main>`,
    highPriority: true,
  },
  {
    id: "fc-034",
    topic: "router",
    front: "`<Link>` vs `<a href>` in a React Router app",
    back: "`<Link to>` navigates client-side via the History API without a full page reload (state is kept). A plain `<a href>` reloads the whole app.",
    highPriority: true,
  },
  {
    id: "fc-035",
    topic: "router",
    front: "`<NavLink>` vs `<Link>`",
    back: "`NavLink` knows if it matches the current URL: it applies an `active` class / `aria-current=\"page\"` and accepts `className` or `style` as functions of `{ isActive }`.",
    code: `<NavLink to="/events" className={({ isActive }) => (isActive ? "active" : "")}>Events</NavLink>`,
  },
  {
    id: "fc-036",
    topic: "router",
    front: "What is an index route?",
    back: "A child route with `index` instead of `path`; it renders in the parent's `<Outlet />` when the URL matches the parent path exactly.",
    code: `<Route path="/" element={<Layout />}>
  <Route index element={<Home />} />
</Route>`,
  },
  {
    id: "fc-037",
    topic: "router",
    front: "How do you add a 404 / catch-all route?",
    back: "A route with `path=\"*\"`. It matches anything not matched by more specific routes.",
    code: `<Route path="*" element={<NotFound />} />`,
    highPriority: true,
  },
  {
    id: "fc-038",
    topic: "router",
    front: "`<Navigate>`: when do you use it?",
    back: "To redirect while rendering, e.g. a protected route sends logged-out users to /login: `return <Navigate to=\"/login\" replace />`. Use `useNavigate` for redirects in event handlers.",
    code: `function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((s) => s.user);
  return user ? children : <Navigate to="/login" replace />;
}`,
  },
  {
    id: "fc-039",
    topic: "router",
    front: "What must wrap your `<Routes>` for routing to work?",
    back: "A router such as `<BrowserRouter>` (usually in main.tsx). Router hooks only work inside it.",
    code: `createRoot(root).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);`,
  },
  {
    id: "fc-040",
    topic: "router",
    front: "`useLocation()`: what does it return?",
    back: "The current location object: `pathname`, `search`, `hash`, `state`, `key`. Useful for reading `location.state` (e.g. where to return after login).",
  },
  {
    id: "fc-041",
    topic: "router",
    front: "Path param vs query string: which for what?",
    back: "Path params identify a resource (`/events/7`). Query strings modify a view (filters, sort, page: `/events?category=music&page=2`).",
    lessonId: "router-search-params",
  },
  {
    id: "fc-042",
    topic: "router",
    front: "Why might a deployed SPA show 404 on refresh at `/events/7`?",
    back: "The server looks for a real file at that path. It must be configured to serve `index.html` for all app routes so the client router can handle them.",
  },

  /* ---------------------------- TanStack Query ------------------------- */
  {
    id: "fc-043",
    topic: "tanstack-query",
    front: "`staleTime`: what does it control? Default?",
    back: "How long fetched data is considered FRESH. While fresh, no automatic refetch on mount/window focus/reconnect. Default `0`: data is stale immediately (cached data shown, refetched in background).",
    lessonId: "tq-stale-gc",
    highPriority: true,
  },
  {
    id: "fc-044",
    topic: "tanstack-query",
    front: "`gcTime`: what does it control? Default?",
    back: "How long an INACTIVE (unobserved) cache entry is kept before garbage collection. Default 5 minutes. Called `cacheTime` in v4.",
    lessonId: "tq-stale-gc",
    highPriority: true,
  },
  {
    id: "fc-045",
    topic: "tanstack-query",
    front: "What does `queryClient.invalidateQueries({ queryKey })` do?",
    back: "Marks all queries whose key STARTS WITH the given key as stale, and refetches the ones that are currently ACTIVE (rendered). Typically called in a mutation's `onSuccess`.",
    code: `const queryClient = useQueryClient();
useMutation({
  mutationFn: createEvent,
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ["events"] }),
});`,
    lessonId: "tq-usequery-keys",
    highPriority: true,
  },
  {
    id: "fc-046",
    topic: "tanstack-query",
    front: "Basic `useQuery` syntax (v5)",
    back: "One object argument with `queryKey` (array) and `queryFn` (returns a promise; must throw on error).",
    code: `const { data, isPending, isError, error } = useQuery({
  queryKey: ["events", id],
  queryFn: () => getEvent(id),
});`,
    lessonId: "tq-usequery-keys",
    highPriority: true,
  },
  {
    id: "fc-047",
    topic: "tanstack-query",
    front: "What is the query key for and why include variables in it?",
    back: "It uniquely identifies the cached data. Include every variable the queryFn depends on (`[\"events\", id]`) so each id gets its own cache entry and the query refetches when the variable changes.",
    lessonId: "tq-usequery-keys",
    highPriority: true,
  },
  {
    id: "fc-048",
    topic: "tanstack-query",
    front: "`isPending` vs `isFetching` vs `isLoading` (v5)",
    back: "`isPending`: no data yet (status 'pending'). `isFetching`: a request is in flight (including background refetches). `isLoading` = `isPending && isFetching` (first load).",
    lessonId: "tq-stale-gc",
    highPriority: true,
  },
  {
    id: "fc-049",
    topic: "tanstack-query",
    front: "What are the three query `status` values in v5?",
    back: "`'pending'` (no data yet), `'error'`, `'success'`. Separately, `fetchStatus` is `'fetching' | 'paused' | 'idle'`.",
    lessonId: "tq-stale-gc",
  },
  {
    id: "fc-050",
    topic: "tanstack-query",
    front: "`useMutation`: what is it for?",
    back: "Create/update/delete operations (side effects). Call `mutate(variables)` or `mutateAsync`; use `isPending`, `onSuccess`, `onError`. Mutations are not cached like queries.",
    code: `const mutation = useMutation({ mutationFn: (e: NewEvent) => createEvent(e) });
mutation.mutate(formValues);`,
    highPriority: true,
  },
  {
    id: "fc-051",
    topic: "tanstack-query",
    front: "TanStack Query default retry behaviour",
    back: "Failed queries retry 3 times (on the client) with exponential backoff before showing an error. Configure with `retry` / `retryDelay`. Mutations do not retry by default.",
    lessonId: "tq-stale-gc",
  },
  {
    id: "fc-052",
    topic: "tanstack-query",
    front: "When does TanStack Query refetch stale data automatically?",
    back: "When a new component mounts using the query (refetchOnMount), when the window regains focus (refetchOnWindowFocus) and on reconnect, all default true, and only if data is stale.",
    lessonId: "tq-stale-gc",
  },
  {
    id: "fc-053",
    topic: "tanstack-query",
    front: "`setQueryData`: when would you use it?",
    back: "To write data into the cache directly, e.g. putting the server's response from a mutation into the cache, or an optimistic update, avoiding an extra request.",
    code: `queryClient.setQueryData(["events", updated.id], updated);`,
  },
  {
    id: "fc-054",
    topic: "tanstack-query",
    front: "Why does TanStack Query count as 'server state' management?",
    back: "It caches, dedupes, refetches and synchronises data owned by the server. You don't copy API data into useState/Zustand; the query cache is the source of truth.",
  },
  {
    id: "fc-055",
    topic: "tanstack-query",
    front: "How do you only run a query when an id exists?",
    back: "Use the `enabled` option.",
    code: `useQuery({ queryKey: ["events", id], queryFn: () => getEvent(id!), enabled: !!id });`,
  },
  {
    id: "fc-056",
    topic: "tanstack-query",
    front: "What must wrap the app to use TanStack Query?",
    back: "`<QueryClientProvider client={queryClient}>` with a `new QueryClient()` created once (outside components).",
  },

  /* ------------------------------- Zustand ----------------------------- */
  {
    id: "fc-057",
    topic: "zustand",
    front: "Create a Zustand store in TypeScript (v5)",
    back: "Use `create<State>()(...)` (curried) and return state + actions; actions call `set`.",
    code: `import { create } from "zustand";

interface CartState {
  items: CartItem[];
  add: (item: CartItem) => void;
}

export const useCartStore = create<CartState>()((set) => ({
  items: [],
  add: (item) => set((s) => ({ items: [...s.items, item] })),
}));`,
    lessonId: "zustand-basics",
    highPriority: true,
  },
  {
    id: "fc-058",
    topic: "zustand",
    front: "Why use a selector: `useCartStore((s) => s.items)`?",
    back: "The component re-renders only when the selected value changes (compared with `Object.is`). Without a selector it subscribes to the whole store and re-renders on any change.",
    lessonId: "zustand-selectors",
    highPriority: true,
  },
  {
    id: "fc-059",
    topic: "zustand",
    front: "Why can `useStore((s) => ({ a: s.a, b: s.b }))` cause problems?",
    back: "The selector returns a NEW object every time, which never passes `Object.is`, so extra re-renders (and in v5 possibly an infinite-loop error). Select separately or wrap with `useShallow`.",
    code: `import { useShallow } from "zustand/react/shallow";
const { a, b } = useStore(useShallow((s) => ({ a: s.a, b: s.b })));`,
    lessonId: "zustand-selectors",
    highPriority: true,
  },
  {
    id: "fc-060",
    topic: "zustand",
    front: "Does Zustand's `set` replace or merge state?",
    back: "It shallow-MERGES the object you pass into the top-level state (pass `true` as the 2nd argument to replace). Nested objects still need immutable copying.",
    lessonId: "zustand-basics",
  },
  {
    id: "fc-061",
    topic: "zustand",
    front: "How do you read state inside a Zustand action?",
    back: "Use the updater form `set((state) => ...)` or the `get` argument.",
    code: `create<S>()((set, get) => ({
  count: 0,
  inc: () => set((s) => ({ count: s.count + 1 })),
  double: () => set({ count: get().count * 2 }),
}));`,
    lessonId: "zustand-basics",
  },
  {
    id: "fc-062",
    topic: "zustand",
    front: "How do you persist a Zustand store to localStorage?",
    back: "Wrap the creator in `persist` from `zustand/middleware` and give it a unique `name`.",
    code: `create<AuthState>()(persist((set) => ({ token: null, setToken: (t) => set({ token: t }) }), { name: "auth" }));`,
  },
  {
    id: "fc-063",
    topic: "zustand",
    front: "Do Zustand stores need a Provider?",
    back: "No. The store is a module-level hook; any component can import and use it. You can also read state outside React with `useStore.getState()`.",
    lessonId: "zustand-basics",
  },
  {
    id: "fc-064",
    topic: "state-architecture",
    front: "Server state vs client state: which tool for which?",
    back: "Server state (events from the API) → TanStack Query (cache, refetch, invalidation). Global client state (auth user, cart, theme) → Zustand/Context. Local UI state (input value, modal open) → useState.",
    highPriority: true,
  },
  {
    id: "fc-065",
    topic: "state-architecture",
    front: "Why not copy fetched API data into a Zustand store?",
    back: "You'd duplicate the source of truth and have to re-implement caching, staleness, refetching and invalidation. Keep server data in TanStack Query.",
  },
  {
    id: "fc-066",
    topic: "state-architecture",
    front: "What is 'derived state' and why avoid storing it?",
    back: "Values computable from existing state/props (filtered list, totals). Compute during render instead of storing, so it can never get out of sync.",
  },
  {
    id: "fc-067",
    topic: "state-architecture",
    front: "What is prop drilling and how is it solved?",
    back: "Passing props through many intermediate components that don't use them. Solved with composition, React Context, or a store like Zustand.",
  },

  /* ----------------------------- JavaScript ---------------------------- */
  {
    id: "fc-068",
    topic: "javascript",
    front: "`reduce` syntax",
    back: "`array.reduce((accumulator, current) => newAccumulator, initialValue)`. Always pass an initial value; an empty array without one throws a TypeError.",
    code: `const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);`,
    lessonId: "js-array-reduce",
    highPriority: true,
  },
  {
    id: "fc-069",
    topic: "javascript",
    front: "`map` vs `filter` vs `find`",
    back: "`map`: new array of transformed items (same length). `filter`: new array of items passing a test. `find`: the FIRST matching item or `undefined`.",
    lessonId: "js-array-methods",
    highPriority: true,
  },
  {
    id: "fc-070",
    topic: "javascript",
    front: "Which common array methods MUTATE the array?",
    back: "`push`, `pop`, `shift`, `unshift`, `splice`, `sort`, `reverse`, `fill`. Non-mutating alternatives: spread, `filter`, `map`, `slice`, `toSorted`, `toReversed`, `toSpliced`.",
    lessonId: "js-references-copies",
    highPriority: true,
  },
  {
    id: "fc-071",
    topic: "javascript",
    front: "Default `sort()` on numbers `[10, 2, 100]`?",
    back: "`[10, 100, 2]`: without a comparator, elements are compared as strings. Use `(a, b) => a - b`.",
    lessonId: "js-references-copies",
  },
  {
    id: "fc-072",
    topic: "javascript",
    front: "Spread copy: shallow or deep?",
    back: "Shallow. `{ ...obj }` / `[...arr]` copy one level; nested objects are still shared references. Use nested spreads or `structuredClone` for deep copies.",
    lessonId: "js-references-copies",
    highPriority: true,
  },
  {
    id: "fc-073",
    topic: "javascript",
    front: "`===` vs `==`",
    back: "`===` is strict equality (no type conversion). `==` converts types first (`\"1\" == 1` is true). Use `===`.",
  },
  {
    id: "fc-074",
    topic: "javascript",
    front: "`??` vs `||`",
    back: "`a ?? b` uses `b` only when `a` is null/undefined. `a || b` uses `b` for ANY falsy value (0, \"\", false, NaN).",
    code: `0 ?? 5;  // 0
0 || 5;  // 5`,
  },
  {
    id: "fc-075",
    topic: "javascript",
    front: "Optional chaining `?.`",
    back: "Stops and returns `undefined` if the value before it is null/undefined instead of throwing: `user?.address?.city`.",
  },
  {
    id: "fc-076",
    topic: "javascript",
    front: "`let` vs `const` vs `var`",
    back: "`const`: block-scoped, cannot be reassigned (object contents can still change). `let`: block-scoped, reassignable. `var`: function-scoped and hoisted. Avoid it.",
  },
  {
    id: "fc-077",
    topic: "javascript",
    front: "What is a closure?",
    back: "A function together with the variables from the scope where it was created; it keeps access to them even after that scope has finished. Stale closures in React capture old state values.",
  },
  {
    id: "fc-078",
    topic: "javascript",
    front: "Event loop: which runs first, a resolved promise callback or `setTimeout(fn, 0)`?",
    back: "The promise callback (microtask). After each task, the event loop drains ALL microtasks before running the next task (setTimeout).",
    code: `setTimeout(() => console.log("timeout"));
Promise.resolve().then(() => console.log("promise"));
console.log("sync");
// sync, promise, timeout`,
    lessonId: "js-promises-async",
    highPriority: true,
  },
  {
    id: "fc-079",
    topic: "javascript",
    front: "Three states of a Promise",
    back: "pending → fulfilled (with a value) or rejected (with a reason). Once settled it never changes.",
    lessonId: "js-promises-async",
  },
  {
    id: "fc-080",
    topic: "javascript",
    front: "`Promise.all` vs `Promise.allSettled`",
    back: "`all`: resolves to all values in order, rejects as soon as ANY rejects. `allSettled`: waits for all and reports each as `{ status, value | reason }`, never rejects.",
    lessonId: "js-promises-async",
  },
  {
    id: "fc-081",
    topic: "javascript",
    front: "What does `await` do inside an async function?",
    back: "Pauses that function until the promise settles, returning the value or throwing the rejection (catch with try/catch). Other code keeps running. An async function always returns a promise.",
    lessonId: "js-promises-async",
    highPriority: true,
  },
  {
    id: "fc-082",
    topic: "javascript",
    front: "Destructuring with defaults",
    back: "Defaults apply only when the value is `undefined`.",
    code: `const { name, price = 0 } = product;
const [first, second] = items;
function card({ title, size = "md" }: Props) {}`,
  },
  {
    id: "fc-083",
    topic: "javascript",
    front: "ES modules: named vs default export",
    back: "Named: `export function getEvents()` → `import { getEvents } from \"./api\"`. Default: `export default App` → `import App from \"./App\"` (any name). A module can have many named exports but one default.",
  },
  {
    id: "fc-084",
    topic: "javascript",
    front: "Template literals",
    back: "Backtick strings with interpolation and multiple lines.",
    code: `const url = \`\${BASE_URL}/events/\${id}\`;`,
  },

  /* ----------------------------- TypeScript ---------------------------- */
  {
    id: "fc-085",
    topic: "typescript",
    front: "Interface syntax with an optional property",
    back: "Use `interface Name { ... }` with `?` for optional properties (type becomes `T | undefined`).",
    code: `interface EventDto {
  id: number;
  title: string;
  imageUrl: string | null;
  description?: string;
}`,
    lessonId: "ts-basics-interfaces",
    highPriority: true,
  },
  {
    id: "fc-086",
    topic: "typescript",
    front: "Union types and literal unions",
    back: "`A | B` means a value can be either. Literal unions restrict to exact values.",
    code: `type Role = "USER" | "ADMIN";
let id: string | number;`,
    lessonId: "ts-unions-narrowing",
    highPriority: true,
  },
  {
    id: "fc-087",
    topic: "typescript",
    front: "What is narrowing?",
    back: "TypeScript refines a union type inside a branch after a check: `typeof x === \"string\"`, `Array.isArray`, `in`, `instanceof`, equality on a discriminant (`state.status === \"error\"`).",
    lessonId: "ts-unions-narrowing",
    highPriority: true,
  },
  {
    id: "fc-088",
    topic: "typescript",
    front: "Discriminated union",
    back: "A union of object types sharing a literal property (the discriminant). Switching on it narrows to one variant, making impossible states unrepresentable.",
    code: `type State =
  | { status: "loading" }
  | { status: "error"; error: string }
  | { status: "success"; data: EventDto[] };`,
    lessonId: "ts-unions-narrowing",
  },
  {
    id: "fc-089",
    topic: "typescript",
    front: "Do TypeScript types validate API responses at runtime?",
    back: "No. Types are ERASED at compile time. `await res.json() as EventDto[]` is just a promise to the compiler. Validate at runtime (manual checks or Zod) if you need guarantees.",
    lessonId: "ts-typed-api-data",
    highPriority: true,
  },
  {
    id: "fc-090",
    topic: "typescript",
    front: "`unknown` vs `any`",
    back: "`any` disables type checking. `unknown` accepts any value but forces you to narrow before using it, the safe choice for untrusted data.",
    lessonId: "ts-typed-api-data",
  },
  {
    id: "fc-091",
    topic: "typescript",
    front: "Generic function syntax",
    back: "A type parameter in angle brackets keeps the relationship between input and output types.",
    code: `function first<T>(items: T[]): T | undefined {
  return items[0];
}
const n = first([1, 2]); // number | undefined`,
    lessonId: "ts-generics-utility",
  },
  {
    id: "fc-092",
    topic: "typescript",
    front: "`Partial`, `Pick`, `Omit`",
    back: "`Partial<T>`: all properties optional. `Pick<T, \"a\" | \"b\">`: only those keys. `Omit<T, \"id\">`: all except those keys (e.g. a create payload without id).",
    code: `type CreateEventDto = Omit<EventDto, "id" | "categoryName">;`,
    lessonId: "ts-generics-utility",
  },
  {
    id: "fc-093",
    topic: "typescript",
    front: "`interface` vs `type`",
    back: "Both describe object shapes. `interface` can be extended/merged (`extends`, declaration merging). `type` can also express unions, tuples, mapped and conditional types.",
    lessonId: "ts-basics-interfaces",
  },
  {
    id: "fc-094",
    topic: "typescript",
    front: "Typing React props",
    back: "Declare an interface/type for props and annotate the destructured parameter.",
    code: `interface EventCardProps {
  event: EventDto;
  onSelect?: (id: number) => void;
}
function EventCard({ event, onSelect }: EventCardProps) { /* ... */ }`,
  },
  {
    id: "fc-095",
    topic: "typescript",
    front: "Typing `useState` that starts as null",
    back: "Pass the type argument explicitly with a union.",
    code: `const [user, setUser] = useState<User | null>(null);`,
  },

  /* ------------------------------- React ------------------------------- */
  {
    id: "fc-096",
    topic: "react",
    front: "Is a React state update applied immediately?",
    back: "No. `setX` schedules a re-render; the current render keeps its snapshot value. Use the updater form `setCount((c) => c + 1)` when the new value depends on the old one.",
    lessonId: "react-state-events",
    highPriority: true,
  },
  {
    id: "fc-097",
    topic: "react",
    front: "Why must state be updated immutably?",
    back: "React compares old and new state with `Object.is`. Mutating an object/array keeps the same reference, so React may skip the re-render. Create new objects/arrays instead.",
    code: `setItems((prev) => [...prev, newItem]);
setUser((prev) => ({ ...prev, name: "Ada" }));`,
    lessonId: "react-state-events",
    highPriority: true,
  },
  {
    id: "fc-098",
    topic: "react",
    front: "`useEffect` dependency array: [] vs [x] vs none",
    back: "`[]`: run after the first render (and cleanup on unmount). `[x]`: after first render and whenever x changes. No array: after EVERY render.",
    highPriority: true,
  },
  {
    id: "fc-099",
    topic: "react",
    front: "What is a `useEffect` cleanup function for?",
    back: "Returned from the effect; runs before the effect re-runs and on unmount. Use it to abort fetches, clear timers and remove listeners/subscriptions.",
  },
  {
    id: "fc-100",
    topic: "react",
    front: "Why does my effect run twice in development?",
    back: "React StrictMode intentionally mounts, unmounts and re-mounts components in development to expose missing cleanups. It does not happen in production.",
  },
  {
    id: "fc-101",
    topic: "react",
    front: "Why do list items need a `key`?",
    back: "Keys identify items between renders so React can match, reorder and preserve state correctly. Use a stable unique id, not the array index when the list can change order.",
    code: `{events.map((e) => <EventCard key={e.id} event={e} />)}`,
    highPriority: true,
  },
  {
    id: "fc-102",
    topic: "react",
    front: "Props vs state",
    back: "Props: inputs passed from the parent, read-only for the child. State: data owned by the component that changes over time and triggers re-renders.",
  },
  {
    id: "fc-103",
    topic: "react",
    front: "Render vs commit",
    back: "Render: React calls your components to compute the UI (should be pure). Commit: React applies the minimal changes to the DOM. Not every render changes the DOM.",
  },
  {
    id: "fc-104",
    topic: "react",
    front: "What is a controlled input?",
    back: "An input whose value comes from React state and updates via onChange, so React is the single source of truth.",
    code: `<input value={title} onChange={(e) => setTitle(e.target.value)} />`,
    lessonId: "react-state-events",
  },
  {
    id: "fc-105",
    topic: "react",
    front: "Rules of Hooks",
    back: "Call hooks only at the top level of function components or custom hooks: never inside conditions, loops or nested functions. React relies on call order.",
  },
  {
    id: "fc-106",
    topic: "react",
    front: "`onClick={handleClick}` vs `onClick={handleClick()}`",
    back: "The first passes the function to be called on click. The second CALLS it during render and passes its return value. Use `onClick={() => handleDelete(id)}` to pass arguments.",
    lessonId: "react-state-events",
  },

  /* ----------------------------- Forms / CRUD -------------------------- */
  {
    id: "fc-107",
    topic: "forms-crud",
    front: "Why call `e.preventDefault()` in a form's onSubmit?",
    back: "A native form submit reloads/navigates the page. Preventing it lets React handle the submit (validate, call the API) without a reload. React Hook Form's `handleSubmit` does this for you.",
    lessonId: "forms-validation",
    highPriority: true,
  },
  {
    id: "fc-108",
    topic: "forms-crud",
    front: "React Hook Form + Zod setup",
    back: "Define a Zod schema, infer the type, pass `zodResolver(schema)` to `useForm`, then `register` fields and read `formState.errors`.",
    code: `const schema = z.object({ title: z.string().trim().min(1, "Title is required") });
type FormValues = z.infer<typeof schema>;
const { register, handleSubmit, formState: { errors } } =
  useForm<FormValues>({ resolver: zodResolver(schema) });`,
    lessonId: "forms-validation",
  },
  {
    id: "fc-109",
    topic: "forms-crud",
    front: "Is client-side validation enough?",
    back: "No. It is for UX (fast feedback). The server must validate again because requests can be sent without your UI (Postman, DevTools).",
    lessonId: "forms-validation",
    highPriority: true,
  },
  {
    id: "fc-110",
    topic: "forms-crud",
    front: "What type does an `<input type=\"number\">` value have in JS?",
    back: "A string (`e.target.value`). Convert with `Number()` / `valueAsNumber`, or `z.coerce.number()` / RHF `valueAsNumber: true`.",
    lessonId: "forms-validation",
  },
  {
    id: "fc-111",
    topic: "forms-crud",
    front: "CRUD → HTTP mapping",
    back: "Create = POST, Read = GET, Update = PUT/PATCH, Delete = DELETE.",
    lessonId: "crud-post-put-delete",
    highPriority: true,
  },
  {
    id: "fc-112",
    topic: "forms-crud",
    front: "After a successful create/update/delete, how do you refresh lists?",
    back: "Invalidate the related query in the mutation's onSuccess (`invalidateQueries({ queryKey: [\"events\"] })`), then usually navigate or close the form.",
    lessonId: "crud-post-put-delete",
  },

  /* ------------------------------ HTML / CSS --------------------------- */
  {
    id: "fc-113",
    topic: "html-css",
    front: "`clamp(min, preferred, max)`",
    back: "Returns the preferred value but never below min or above max. Great for fluid typography/spacing without media queries.",
    code: `h1 { font-size: clamp(1.5rem, 4vw, 3rem); }`,
    highPriority: true,
  },
  {
    id: "fc-114",
    topic: "html-css",
    front: "`repeat(auto-fit, minmax(250px, 1fr))`",
    back: "Responsive grid: as many columns as fit, each at least 250px and sharing extra space equally. No media queries needed.",
    code: `.grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; }`,
    highPriority: true,
  },
  {
    id: "fc-115",
    topic: "html-css",
    front: "`grid-template-areas`",
    back: "Names regions of a grid with strings; children are placed with `grid-area`. Each string is a row; repeated names span cells; `.` is an empty cell.",
    code: `.page {
  display: grid;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
}
.header { grid-area: header; }`,
    highPriority: true,
  },
  {
    id: "fc-116",
    topic: "html-css",
    front: "`:focus-visible` vs `:focus`",
    back: "`:focus` matches any focused element. `:focus-visible` matches only when the browser decides a focus ring should be shown (e.g. keyboard navigation), so you can style keyboard focus without showing rings on mouse click. Never remove focus outlines without a replacement.",
    code: `button:focus-visible { outline: 3px solid #2563eb; outline-offset: 2px; }`,
    highPriority: true,
  },
  {
    id: "fc-117",
    topic: "html-css",
    front: "Flexbox vs Grid: when to use which?",
    back: "Flexbox: one-dimensional layout (a row OR a column), content-driven, e.g. navbars. Grid: two-dimensional (rows AND columns), layout-driven, e.g. page layouts and card grids.",
  },
  {
    id: "fc-118",
    topic: "html-css",
    front: "`box-sizing: border-box`",
    back: "Width/height include padding and border (not just content), making sizes predictable. Commonly applied to all elements.",
  },
  {
    id: "fc-119",
    topic: "html-css",
    front: "Why use semantic HTML (`<nav>`, `<main>`, `<button>`)?",
    back: "It gives meaning for assistive technology (landmarks, roles), built-in keyboard behaviour (a `<button>` is focusable and responds to Enter/Space), and better SEO.",
  },
  {
    id: "fc-120",
    topic: "html-css",
    front: "CSS specificity order (low → high)",
    back: "Type selectors/pseudo-elements < classes/attributes/pseudo-classes < IDs < inline styles. `!important` overrides normal declarations. On a tie, the later rule wins.",
  },

  /* ------------------------------ Web / misc --------------------------- */
  {
    id: "fc-121",
    topic: "web",
    front: "Parts of a URL",
    back: "`https://example.com:443/events/7?sort=date#reviews` → scheme `https`, host `example.com`, port `443`, path `/events/7`, query `?sort=date`, fragment `#reviews` (never sent to the server).",
  },
  {
    id: "fc-122",
    topic: "web",
    front: "What is an SPA?",
    back: "Single Page Application: the server sends one HTML page plus JavaScript; navigation is handled client-side (React Router) and data is loaded via API calls (JSON).",
  },
  {
    id: "fc-123",
    topic: "architecture",
    front: "Typical React project folder separation",
    back: "`pages/` (route components), `components/` (reusable UI), `services/` or `api/` (HTTP calls), `hooks/` (custom hooks e.g. useEvents), `stores/` (Zustand), `types/` (DTO interfaces).",
  },
  {
    id: "fc-124",
    topic: "architecture",
    front: "What is a custom hook?",
    back: "A function starting with `use` that calls other hooks to reuse stateful logic, e.g. `useEvents()` wrapping `useQuery`. It shares logic, not state: each call has its own state.",
  },
  {
    id: "fc-125",
    topic: "testing",
    front: "React Testing Library philosophy",
    back: "Test behaviour the way users experience it: query by role/label/text (`getByRole(\"button\", { name: /save/i })`), interact with `userEvent`, assert on visible output, not implementation details.",
  },
  {
    id: "fc-126",
    topic: "testing",
    front: "`getBy` vs `queryBy` vs `findBy`",
    back: "`getBy`: throws if not found. `queryBy`: returns null if not found (assert absence). `findBy`: async, waits for the element to appear (returns a promise).",
  },
];
