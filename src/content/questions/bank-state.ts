import type { Question } from "../types";

/**
 * Practice bank — TanStack Query v5, Zustand v5 and state architecture.
 * Original practice items in the style of the module's ICT.
 */
export const stateQuestions: Question[] = [
  /* ---------------------------- TanStack Query ---------------------------- */
  {
    id: "st-001",
    type: "mcq",
    topic: "tanstack-query",
    subtopic: "Server state",
    difficulty: "beginner",
    marks: 1,
    minutes: 1,
    prompt: "Which kind of data is TanStack Query primarily designed to manage?",
    options: [
      "Whether a modal dialog is open.",
      "The text currently typed into a search input.",
      "Asynchronous server state — data owned by a remote API that can change without the client knowing.",
      "CSS theme variables.",
    ],
    answer: 2,
    explanation:
      "TanStack Query fetches, caches, deduplicates and re-synchronises server data. Purely local UI state belongs in `useState` or a client store such as Zustand.",
    distractorNotes: {
      0: "Modal visibility is local UI state.",
      1: "Input text is local form state.",
      3: "Theme is client state (often Zustand or context).",
    },
    lessonId: "tq-server-state",
    source: "practice",
  },
  {
    id: "st-002",
    type: "mcq",
    topic: "tanstack-query",
    subtopic: "Query keys",
    difficulty: "intermediate",
    marks: 1,
    minutes: 1,
    prompt: `A page shows one lecturer by id:

\`\`\`ts
useQuery({
  queryKey: ["lecturer"],
  queryFn: () => getLecturer(lecturerId),
});
\`\`\`

Switching from lecturer 3 to lecturer 8 keeps showing lecturer 3. Why?`,
    options: [
      "The key does not include `lecturerId`, so both lecturers share one cache entry and the query is not refetched for the new id.",
      "`queryFn` must be an async function declared with `async`.",
      "TanStack Query never refetches automatically.",
      "Query keys must be strings, not arrays.",
    ],
    answer: 0,
    explanation:
      "The key identifies the cache entry and acts like a dependency list. Use `queryKey: [\"lecturer\", lecturerId]` so each id has its own entry and changing the id triggers a fetch.",
    distractorNotes: {
      1: "Any function returning a promise works.",
      2: "Queries refetch when the key changes, on mount when stale, on window focus, etc.",
      3: "In v5 query keys must be arrays.",
    },
    lessonId: "tq-usequery-keys",
    source: "practice",
    misconception: "Key omits variables used by queryFn",
  },
  {
    id: "st-003",
    type: "mcq",
    topic: "tanstack-query",
    subtopic: "staleTime vs gcTime",
    difficulty: "exam",
    marks: 1,
    minutes: 1,
    prompt: "In TanStack Query v5, what does `gcTime` control?",
    options: [
      "How long fetched data is considered fresh.",
      "How long an inactive (no longer observed) query stays in the cache before it is garbage collected.",
      "How often the query polls the server.",
      "The maximum time a request may take before timing out.",
    ],
    answer: 1,
    explanation:
      "`gcTime` (called `cacheTime` in v4) starts when a query has no observers. Default: 5 minutes. Freshness is `staleTime`; polling is `refetchInterval`.",
    distractorNotes: {
      0: "That is `staleTime`.",
      2: "That is `refetchInterval`.",
      3: "TanStack Query has no built-in request timeout option; use an AbortSignal in the queryFn.",
    },
    lessonId: "tq-stale-gc",
    source: "practice",
    misconception: "gcTime and staleTime are the same",
  },
  {
    id: "st-004",
    type: "mcq",
    topic: "tanstack-query",
    subtopic: "Defaults",
    difficulty: "intermediate",
    marks: 1,
    minutes: 1,
    prompt:
      "With **default** options, a component using `useQuery` for `['courses']` remounts 10 seconds after the first fetch. What happens?",
    options: [
      "Cached data is shown immediately and a background refetch starts, because the default `staleTime` is 0.",
      "Nothing is shown until a new request finishes.",
      "Cached data is shown and no request is made for 5 minutes.",
      "An error is thrown because the query already exists.",
    ],
    answer: 0,
    explanation:
      "Default `staleTime: 0` means data is stale immediately. On mount, the cached (stale) data is returned instantly and a background refetch runs (`isFetching` true, `isPending` false).",
    distractorNotes: {
      1: "Cached data is still there (gcTime default 5 min) and is shown immediately.",
      2: "5 minutes is the default gcTime, not staleTime.",
      3: "Multiple observers of the same key are normal.",
    },
    lessonId: "tq-stale-gc",
    source: "practice",
  },
  {
    id: "st-005",
    type: "mcq",
    topic: "tanstack-query",
    subtopic: "isPending vs isFetching",
    difficulty: "advanced",
    marks: 1,
    minutes: 2,
    prompt:
      "A list already has cached data, and a background refetch is running. Which flags are true?",
    options: [
      "`isPending: true`, `isFetching: true`",
      "`isPending: true`, `isFetching: false`",
      "`isPending: false`, `isFetching: false`",
      "`isPending: false`, `isFetching: true`",
    ],
    answer: 3,
    explanation:
      "`isPending` means there is no data yet (status `'pending'`). `isFetching` means a request is in flight. With cached data being refreshed, status is `'success'` and fetchStatus is `'fetching'`. Show the data plus a subtle \"refreshing\" indicator, not a full spinner.",
    distractorNotes: {
      0: "isPending is false because data already exists.",
      1: "That combination occurs when there is no data and no request running (e.g. `enabled: false`).",
      2: "A request is in flight, so isFetching is true.",
    },
    lessonId: "tq-server-state",
    source: "practice",
    misconception: "isPending means any request is running",
  },
  {
    id: "st-006",
    type: "mcq",
    topic: "tanstack-query",
    subtopic: "enabled",
    difficulty: "intermediate",
    marks: 1,
    minutes: 1,
    prompt:
      "A query needs a `userId` that may be `undefined` until login completes. How should it avoid calling `/api/users/undefined`?",
    options: [
      "Wrap `useQuery` in `if (userId) { ... }`.",
      "Pass `enabled: userId !== undefined` (or `!!userId`) so the query does not run until the id exists.",
      "Set `retry: 0`.",
      "Set `staleTime: Infinity`.",
    ],
    answer: 1,
    explanation:
      "`enabled: false` keeps the query idle (status pending, fetchStatus idle). Hooks cannot be called conditionally, so `enabled` is the correct way to make it dependent.",
    distractorNotes: {
      0: "Calling a Hook conditionally breaks the Rules of Hooks.",
      2: "It would still make the bad request once.",
      3: "Freshness doesn't stop the first fetch when there's no data.",
    },
    lessonId: "tq-usequery-keys",
    source: "practice",
  },
  {
    id: "st-007",
    type: "mcq",
    topic: "tanstack-query",
    subtopic: "invalidateQueries",
    difficulty: "exam",
    marks: 1,
    minutes: 1,
    prompt:
      "After a mutation updates a module, the code calls `queryClient.invalidateQueries({ queryKey: ['modules'] })`. What happens by default?",
    options: [
      "All cached data for every key is deleted.",
      "Queries whose key starts with `['modules']` are marked stale, and the ones currently in use (active) are refetched.",
      "The `modules` endpoint is disabled.",
      "Only the exact key `['modules']` is refetched, never `['modules', 4]`.",
    ],
    answer: 1,
    explanation:
      "Invalidation uses prefix matching: `['modules']` matches `['modules']`, `['modules', 4]`, etc. Matching queries become stale; active ones refetch immediately, inactive ones refetch when next used.",
    distractorNotes: {
      0: "Only matching queries are affected, and data is not deleted (use `removeQueries` for that).",
      2: "It never touches the server API.",
      3: "Matching is by prefix unless `exact: true` is passed.",
    },
    lessonId: "tq-mutations-invalidation",
    source: "practice",
  },
  {
    id: "st-008",
    type: "mcq",
    topic: "tanstack-query",
    subtopic: "Mutations",
    difficulty: "exam",
    marks: 1,
    minutes: 2,
    prompt: `A user renames a project. The PUT succeeds but the list still shows the old name. What is missing?

\`\`\`ts
const rename = useMutation({
  mutationFn: (p: Project) => updateProject(p),
});
\`\`\``,
    options: [
      "`retry: true` on the mutation.",
      "A `queryKey` on `useMutation`, which links it to the list automatically.",
      "An `onSuccess` that invalidates (or updates via `setQueryData`) the `['projects']` cache.",
      "Calling `rename.mutate` twice.",
    ],
    answer: 2,
    explanation:
      "Mutations do not automatically update queries. Typical pattern: `onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects'] })` (returning the promise keeps the mutation pending until the refetch finishes).",
    distractorNotes: {
      0: "Retrying a successful request does nothing useful (mutations default to retry 0).",
      1: "`useMutation` does not take a `queryKey` that refreshes queries.",
      3: "Mutating again doesn't refresh the cache.",
    },
    lessonId: "tq-mutations-invalidation",
    source: "practice",
    misconception: "Mutations auto-refresh related queries",
  },
  {
    id: "st-009",
    type: "mcq",
    topic: "tanstack-query",
    subtopic: "setQueryData",
    difficulty: "advanced",
    marks: 1,
    minutes: 2,
    prompt:
      "The `POST /api/comments` response contains the full created comment. Which approach updates the comment list **without** another GET request?",
    options: [
      "`queryClient.setQueryData<Comment[]>(['comments'], (old) => old ? [...old, created] : [created])`",
      "`queryClient.invalidateQueries({ queryKey: ['comments'] })`",
      "`queryClient.getQueryData(['comments']).push(created)`",
      "`useQuery({ queryKey: ['comments'], staleTime: 0 })`",
    ],
    answer: 0,
    explanation:
      "`setQueryData` writes to the cache directly and notifies observers. The updater must return a **new** array (immutable update) for components to re-render.",
    distractorNotes: {
      1: "Invalidation triggers a refetch (another GET) for active queries.",
      2: "Mutating cached data in place is not detected and breaks structural sharing; never mutate.",
      3: "This creates/reads a query; it does not insert the new comment.",
    },
    lessonId: "tq-mutations-invalidation",
    source: "practice",
  },
  {
    id: "st-010",
    type: "mcq",
    topic: "tanstack-query",
    subtopic: "Retry",
    difficulty: "intermediate",
    marks: 1,
    minutes: 1,
    prompt:
      "A query's `queryFn` throws. With default settings in the browser, how many **additional** attempts does TanStack Query make before showing the error state?",
    options: ["0", "1", "5", "3"],
    answer: 3,
    explanation:
      "Queries retry 3 times by default with exponential backoff (mutations default to 0 retries). Note: the `queryFn` must throw (e.g. on `!res.ok`) for a failed HTTP call to count as an error.",
    distractorNotes: {
      0: "That is the default for mutations, not queries.",
      1: "The default is 3.",
      2: "The default is 3.",
    },
    lessonId: "tq-server-state",
    source: "practice",
  },
  {
    id: "st-011",
    type: "mcq",
    topic: "tanstack-query",
    subtopic: "staleTime",
    difficulty: "exam",
    marks: 1,
    minutes: 1,
    prompt:
      "A list of countries rarely changes, yet the Network tab shows it refetched every time the user switches back to the browser tab. Which option most directly reduces these requests?",
    options: [
      "Lower `gcTime` to 0.",
      "Set `retry: false`.",
      "Remove the query key.",
      "Increase `staleTime` (e.g. to 1 hour), so the data stays fresh and focus/mount do not trigger refetches.",
    ],
    answer: 3,
    explanation:
      "Automatic refetches (mount, window focus, reconnect) only happen for **stale** queries. A longer `staleTime` keeps data fresh. (`refetchOnWindowFocus: false` would also stop the focus refetch specifically.)",
    distractorNotes: {
      0: "gcTime 0 removes inactive data sooner, causing *more* fetches.",
      1: "Retry is about failures, not focus refetches.",
      2: "A query key is required.",
    },
    lessonId: "tq-stale-gc",
    source: "practice",
  },
  {
    id: "st-012",
    type: "tf",
    topic: "tanstack-query",
    subtopic: "gcTime",
    difficulty: "intermediate",
    marks: 1,
    minutes: 1,
    prompt:
      "In TanStack Query v5 the option `gcTime` replaced the v4 option `cacheTime`.",
    answer: true,
    explanation:
      "v5 renamed `cacheTime` to `gcTime` to make it clear it controls garbage collection of unused cache entries (default 5 minutes).",
    lessonId: "tq-stale-gc",
    source: "practice",
  },
  {
    id: "st-013",
    type: "tf",
    topic: "tanstack-query",
    subtopic: "staleTime vs gcTime",
    difficulty: "exam",
    marks: 1,
    minutes: 1,
    prompt:
      "When a query's data becomes stale, TanStack Query immediately deletes it from the cache.",
    answer: false,
    explanation:
      "Stale data stays in the cache and is still shown; it is simply eligible for background refetching. Removal is governed by `gcTime`, which only starts counting once the query has no observers.",
    lessonId: "tq-stale-gc",
    source: "practice",
    misconception: "Stale means deleted",
  },
  {
    id: "st-014",
    type: "tf",
    topic: "tanstack-query",
    subtopic: "Deduplication",
    difficulty: "intermediate",
    marks: 1,
    minutes: 1,
    prompt:
      "If three mounted components call `useQuery` with the same `queryKey` at the same time, TanStack Query deduplicates them into a single request and shares the result.",
    answer: true,
    explanation:
      "The cache is keyed by `queryKey`; concurrent observers of the same key share one in-flight request and one cache entry.",
    lessonId: "tq-usequery-keys",
    source: "practice",
  },
  {
    id: "st-015",
    type: "tf",
    topic: "tanstack-query",
    subtopic: "refetchOnWindowFocus",
    difficulty: "beginner",
    marks: 1,
    minutes: 1,
    prompt:
      "By default, TanStack Query refetches stale active queries when the browser window regains focus.",
    answer: true,
    explanation:
      "`refetchOnWindowFocus` defaults to `true`. It only refetches stale queries, which with the default `staleTime: 0` is most of them.",
    lessonId: "tq-stale-gc",
    source: "practice",
  },

  /* -------------------------------- Zustand -------------------------------- */
  {
    id: "st-016",
    type: "mcq",
    topic: "zustand",
    subtopic: "create",
    difficulty: "beginner",
    marks: 1,
    minutes: 1,
    prompt: `What does \`create\` return here?

\`\`\`ts
import { create } from "zustand";

const useBasket = create<BasketState>()((set) => ({
  count: 0,
  add: () => set((s) => ({ count: s.count + 1 })),
}));
\`\`\``,
    options: [
      "A React Context provider that must wrap the app.",
      "A plain object containing `count` and `add`.",
      "A reducer function to pass to `useReducer`.",
      "A custom Hook bound to the store, which components call (optionally with a selector) to read state and actions.",
    ],
    answer: 3,
    explanation:
      "`create` returns a Hook (`useBasket`) that also exposes store APIs such as `getState` and `setState`. No provider is needed.",
    distractorNotes: {
      0: "Zustand stores need no provider.",
      1: "The object is the store's initial state; `create` returns a Hook.",
      2: "Zustand is not used with `useReducer`.",
    },
    lessonId: "zustand-basics",
    source: "practice",
  },
  {
    id: "st-017",
    type: "mcq",
    topic: "zustand",
    subtopic: "set merging",
    difficulty: "intermediate",
    marks: 1,
    minutes: 2,
    prompt: `The state is \`{ theme: "light", fontSize: 16 }\`. After \`set({ theme: "dark" })\`, what is the state?`,
    options: [
      "`{ theme: \"dark\" }` — fontSize is lost.",
      "`{ theme: \"dark\", fontSize: 16 }`",
      "`{ theme: \"light\", fontSize: 16 }` — set is asynchronous and has not applied yet.",
      "An error, because set requires a function.",
    ],
    answer: 1,
    explanation:
      "Zustand's `set` shallow-merges the object into the existing state (one level deep). Pass `true` as the second argument to replace instead. Nested objects are not deep-merged.",
    distractorNotes: {
      0: "That would require replace mode: `set({...}, true)`.",
      2: "`set` updates the store synchronously; subscribers are notified straight away.",
      3: "`set` accepts either an object or an updater function.",
    },
    lessonId: "zustand-basics",
    source: "practice",
  },
  {
    id: "st-018",
    type: "mcq",
    topic: "zustand",
    subtopic: "get",
    difficulty: "intermediate",
    marks: 1,
    minutes: 1,
    prompt:
      "Inside a Zustand action, how do you read the **current** state without subscribing (for example, to compute a total)?",
    options: [
      "Call the store Hook inside the action.",
      "Use `useEffect` inside the store.",
      "Use the `get` function passed to the store creator: `(set, get) => ({ ... get().items ... })`.",
      "Read `window.store`.",
    ],
    answer: 2,
    explanation:
      "The creator receives `set` and `get`; `get()` returns the latest state. Outside React you can also use `useStore.getState()`.",
    distractorNotes: {
      0: "Hooks may only be called in components or other Hooks, not in store actions.",
      1: "Stores are not components; Hooks cannot run there.",
      3: "Zustand does not put stores on `window`.",
    },
    lessonId: "zustand-basics",
    source: "practice",
  },
  {
    id: "st-019",
    type: "mcq",
    topic: "zustand",
    subtopic: "Selectors and re-renders",
    difficulty: "exam",
    marks: 1,
    minutes: 2,
    prompt:
      "Component A uses `const theme = useSettings((s) => s.theme)`. Another component changes `fontSize` in the same store. Does A re-render because of this change?",
    options: [
      "No — the selected value (`theme`) is unchanged by `Object.is`, so A is not re-rendered by this store update.",
      "Yes — any store change re-renders every component using the store.",
      "Yes — selectors only work with `useShallow`.",
      "No — Zustand components never re-render.",
    ],
    answer: 0,
    explanation:
      "Zustand runs the selector after each change and compares the result to the previous one with `Object.is`. A re-render is triggered only when the selected value changes. (A may still re-render for other reasons, e.g. its parent re-renders.)",
    distractorNotes: {
      1: "That is what happens if you select the *whole* store (`useSettings()`), not a single field.",
      2: "`useShallow` is for selectors returning new objects/arrays; primitives work fine.",
      3: "A re-renders when `theme` changes.",
    },
    lessonId: "zustand-selectors",
    source: "practice",
  },
  {
    id: "st-020",
    type: "mcq",
    topic: "zustand",
    subtopic: "useShallow",
    difficulty: "advanced",
    marks: 1,
    minutes: 2,
    prompt: `Why might this selector cause problems in Zustand v5?

\`\`\`ts
const { name, email } = useProfile((s) => ({ name: s.name, email: s.email }));
\`\`\``,
    options: [
      "Destructuring is not allowed with Zustand.",
      "It returns a new object on every call, so `Object.is` always sees a change; in v5 this can cause an infinite re-render loop (\"Maximum update depth exceeded\"). Wrap it in `useShallow`.",
      "Selectors must return arrays.",
      "It reads the state twice, which doubles network requests.",
    ],
    answer: 1,
    explanation:
      "A fresh object literal is never `Object.is`-equal to the previous one. `useShallow((s) => ({ name: s.name, email: s.email }))` compares the object's top-level values instead. Alternatively select each field separately.",
    distractorNotes: {
      0: "Destructuring the result is fine when the result is stable.",
      2: "Selectors can return anything; arrays have the same new-reference problem.",
      3: "Zustand selectors make no network requests.",
    },
    lessonId: "zustand-selectors",
    source: "practice",
    misconception: "Object selectors are always safe",
  },
  {
    id: "st-021",
    type: "mcq",
    topic: "zustand",
    subtopic: "persist",
    difficulty: "intermediate",
    marks: 1,
    minutes: 1,
    prompt:
      "A user's chosen theme should survive a page reload. Which Zustand feature fits?",
    options: [
      "The `persist` middleware from `zustand/middleware`, which saves state to storage (localStorage by default) under a `name` key.",
      "`useShallow` from `zustand/react/shallow`.",
      "Calling `set` with `true` as the second argument.",
      "Zustand stores persist across reloads automatically.",
    ],
    answer: 0,
    explanation:
      "`create<S>()(persist((set) => ({ ... }), { name: \"theme-store\" }))` writes to localStorage and rehydrates on load. `partialize` can limit which fields are stored.",
    distractorNotes: {
      1: "`useShallow` affects re-render comparison, not storage.",
      2: "That replaces state instead of merging.",
      3: "Store state lives in memory and is lost on reload without `persist`.",
    },
    lessonId: "zustand-persist",
    source: "practice",
  },
  {
    id: "st-022",
    type: "tf",
    topic: "zustand",
    subtopic: "Provider",
    difficulty: "beginner",
    marks: 1,
    minutes: 1,
    prompt:
      "A Zustand store created with `create` must be wrapped in a `<Provider>` at the root of the app before components can use it.",
    answer: false,
    explanation:
      "Zustand stores are module-level; any component can call the generated Hook without a provider.",
    lessonId: "zustand-basics",
    source: "practice",
  },
  {
    id: "st-023",
    type: "tf",
    topic: "zustand",
    subtopic: "Selectors and re-renders",
    difficulty: "intermediate",
    marks: 1,
    minutes: 1,
    prompt:
      "Calling `useCart()` with **no selector** subscribes the component to the entire store, so it re-renders whenever any part of the cart state changes.",
    answer: true,
    explanation:
      "Without a selector the whole state object is returned; every `set` produces a new state object, so the component re-renders on any change. Prefer narrow selectors.",
    lessonId: "zustand-selectors",
    source: "practice",
  },
  {
    id: "st-024",
    type: "tf",
    topic: "zustand",
    subtopic: "persist and security",
    difficulty: "advanced",
    marks: 1,
    minutes: 1,
    prompt:
      "Data saved by Zustand's `persist` middleware to localStorage can be read by any JavaScript running on the same origin.",
    answer: true,
    explanation:
      "localStorage is accessible to all scripts on the origin, including injected ones in an XSS attack. Avoid persisting sensitive data; use `partialize` to store only what is needed.",
    lessonId: "zustand-persist",
    source: "practice",
  },

  /* -------------------------- State architecture --------------------------- */
  {
    id: "st-025",
    type: "mcq",
    topic: "state-architecture",
    subtopic: "Which state where",
    difficulty: "exam",
    marks: 1,
    minutes: 1,
    prompt:
      "An app needs: (1) a list of products from an API, cached and refreshed after edits; (2) a sidebar open/closed flag shared by the header and the layout. Which split is most appropriate?",
    options: [
      "Both in Zustand.",
      "Both in TanStack Query.",
      "(1) TanStack Query; (2) Zustand (or lifted React state).",
      "(1) Zustand; (2) TanStack Query.",
    ],
    answer: 2,
    explanation:
      "Server state (products) needs caching, refetching and invalidation — TanStack Query. A shared UI flag is client state — Zustand or lifting state up.",
    distractorNotes: {
      0: "You would have to rebuild caching, deduplication and refetching manually.",
      1: "TanStack Query is for async server data, not local UI flags.",
      3: "This reverses the responsibilities.",
    },
    lessonId: "state-kinds",
    source: "practice",
  },
  {
    id: "st-026",
    type: "mcq",
    topic: "state-architecture",
    subtopic: "URL state",
    difficulty: "intermediate",
    marks: 1,
    minutes: 1,
    prompt:
      "A product list has a category filter and page number. Users want to bookmark and share a filtered view. Where should these values live?",
    options: [
      "In the URL query string (e.g. `useSearchParams`), so the view is shareable and survives reloads.",
      "In a `useRef`.",
      "In a Zustand store with no persistence.",
      "In a module-level `let` variable.",
    ],
    answer: 0,
    explanation:
      "URL state is shareable, bookmarkable and works with back/forward navigation. Include the params in the query key (e.g. `['products', { category, page }]`).",
    distractorNotes: {
      1: "Refs don't trigger renders and are lost on reload.",
      2: "Memory-only store state cannot be shared via a link.",
      3: "Module variables don't trigger renders and aren't shareable.",
    },
    lessonId: "state-kinds",
    source: "practice",
  },
  {
    id: "st-027",
    type: "mcq",
    topic: "state-architecture",
    subtopic: "Derived state",
    difficulty: "advanced",
    marks: 1,
    minutes: 2,
    prompt: `A component stores \`items\` and \`total\` in two separate states, updating \`total\` in a \`useEffect\` whenever \`items\` changes. What is the better approach?

\`\`\`tsx
const [items, setItems] = useState<Item[]>([]);
const [total, setTotal] = useState(0);
useEffect(() => {
  setTotal(items.reduce((sum, i) => sum + i.price, 0));
}, [items]);
\`\`\``,
    options: [
      "Store `total` in localStorage.",
      "Move both into TanStack Query.",
      "Add `total` to the effect's dependency array.",
      "Derive it during render: `const total = items.reduce((sum, i) => sum + i.price, 0);` (with `useMemo` only if it is expensive).",
    ],
    answer: 3,
    explanation:
      "Values computable from existing state should be derived, not stored. The effect version causes an extra render and a moment where `total` is out of sync.",
    distractorNotes: {
      0: "Persistence does not solve duplicated state.",
      1: "These are local items, not server state.",
      2: "Adding `total` doesn't fix the redundant state, and it's not needed as a dependency.",
    },
    lessonId: "state-kinds",
    source: "practice",
    misconception: "Everything displayed must be state",
  },
  {
    id: "st-028",
    type: "tf",
    topic: "state-architecture",
    subtopic: "Zustand vs TanStack Query",
    difficulty: "exam",
    marks: 1,
    minutes: 1,
    prompt:
      "Zustand and TanStack Query are complementary: an app commonly uses TanStack Query for server data and Zustand for shared client/UI state.",
    answer: true,
    explanation:
      "They solve different problems. Copying query results into Zustand duplicates server state and loses caching/invalidation benefits.",
    lessonId: "state-kinds",
    source: "practice",
  },
  {
    id: "st-029",
    type: "short",
    topic: "tanstack-query",
    subtopic: "staleTime vs gcTime",
    difficulty: "exam",
    marks: 3,
    minutes: 3,
    prompt:
      "Explain the difference between `staleTime` and `gcTime` in TanStack Query v5, give their default values, and describe what a user sees when returning to a page whose data is stale but still cached.",
    rubric: [
      { criterion: "staleTime = how long data is considered fresh (default 0)", marks: 1 },
      { criterion: "gcTime = how long inactive/unused data stays in cache before removal (default 5 minutes; formerly cacheTime)", marks: 1 },
      { criterion: "Stale cached data is shown immediately while a background refetch updates it", marks: 1 },
    ],
    modelAnswer:
      "`staleTime` is how long fetched data counts as fresh; while fresh, mounts and window focus do not trigger refetches. Default `0` (stale immediately). `gcTime` (v4 name `cacheTime`) is how long a query with no active observers stays in the cache before it is garbage-collected. Default 5 minutes. If the user returns to a page whose data is stale but still cached, the cached data is shown instantly (no loading spinner) and a background refetch runs (`isFetching` true); the UI updates when new data arrives.",
    explanation:
      "Freshness controls *when to refetch*; gcTime controls *how long unused data is kept*.",
    lessonId: "tq-stale-gc",
    source: "practice",
    misconception: "gcTime and staleTime are the same",
  },
  {
    id: "st-030",
    type: "short",
    topic: "zustand",
    subtopic: "Selectors and re-renders",
    difficulty: "intermediate",
    marks: 3,
    minutes: 3,
    prompt:
      "Explain one advantage of using a selector when reading from a Zustand store, how Zustand decides whether to re-render, and when `useShallow` is needed.",
    rubric: [
      { criterion: "Selector subscribes the component only to the slice it uses, reducing unnecessary re-renders", marks: 1 },
      { criterion: "Zustand compares previous and new selected values with Object.is", marks: 1 },
      { criterion: "useShallow needed when the selector returns a new object/array each time", marks: 1 },
    ],
    modelAnswer:
      "A selector such as `useStore((s) => s.theme)` subscribes the component only to `theme`, so unrelated changes (e.g. to `cartCount`) do not re-render it. After each store update Zustand runs the selector again and compares the new result to the previous one using `Object.is`; it re-renders only if they differ. When a selector builds a new object or array (e.g. `(s) => ({ a: s.a, b: s.b })`) the reference is new every time, so `useShallow` is used to compare the top-level values instead.",
    explanation:
      "Selectors make subscriptions precise; they don't prevent re-renders from other causes such as parent renders.",
    lessonId: "zustand-selectors",
    source: "practice",
  },
  {
    id: "st-031",
    type: "short",
    topic: "state-architecture",
    subtopic: "Which state where",
    difficulty: "exam",
    marks: 3,
    minutes: 3,
    prompt:
      "A team stores API results in a Zustand store and fetches them in `useEffect` in every page. Give three problems with this approach that TanStack Query would solve.",
    rubric: [
      { criterion: "No caching/deduplication — repeated or duplicate requests", marks: 1 },
      { criterion: "Manual loading/error state and race conditions/cancellation", marks: 1 },
      { criterion: "No staleness/invalidation/background refetch — data goes out of date after mutations", marks: 1 },
    ],
    modelAnswer:
      "1. **Duplicated and repeated requests** — each page fetches again, and two components mounting together send two identical requests; TanStack Query caches and deduplicates by query key.\n2. **Hand-written loading/error/race handling** — every effect needs flags, `response.ok` checks, and abort/ignore logic; `useQuery` provides `isPending`, `isError`, retries and keyed results.\n3. **Stale data after changes** — there is no notion of freshness or invalidation, so after a mutation the store must be updated by hand; TanStack Query offers `staleTime`, background refetching and `invalidateQueries`.",
    explanation:
      "Server state has different needs from client state: it's remote, shared, asynchronous and can become out of date.",
    lessonId: "tq-server-state",
    source: "practice",
  },
  {
    id: "st-032",
    type: "code",
    topic: "tanstack-query",
    subtopic: "useQuery + useMutation + invalidation",
    difficulty: "exam",
    marks: 6,
    minutes: 8,
    language: "tsx",
    prompt:
      "Using TanStack Query v5, write a component `TaskList` that (a) loads tasks with `getTasks()` under the key `['tasks']`, showing loading and error states, and (b) has a button per task that calls `completeTask(id)` through `useMutation` and, on success, invalidates the tasks query so the list refreshes. Disable the button while the mutation is pending. Assume `getTasks(): Promise<Task[]>` and `completeTask(id: number): Promise<void>` exist.",
    rubric: [
      { criterion: "useQuery with queryKey ['tasks'] and queryFn getTasks", marks: 1 },
      { criterion: "Handles isPending and isError (error message) before rendering data", marks: 1 },
      { criterion: "useQueryClient obtained at component top level", marks: 1 },
      { criterion: "useMutation with mutationFn calling completeTask", marks: 1 },
      { criterion: "onSuccess calls invalidateQueries({ queryKey: ['tasks'] })", marks: 1 },
      { criterion: "Button calls mutate(id) and is disabled while isPending", marks: 1 },
    ],
    modelAnswer: `\`\`\`tsx
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function TaskList() {
  const queryClient = useQueryClient();

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });

  const complete = useMutation({
    mutationFn: (id: number) => completeTask(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  if (isPending) return <p>Loading tasks…</p>;
  if (isError) return <p role="alert">Error: {error.message}</p>;
  if (data.length === 0) return <p>No tasks.</p>;

  return (
    <ul>
      {data.map((t) => (
        <li key={t.id}>
          {t.title}
          <button onClick={() => complete.mutate(t.id)} disabled={complete.isPending}>
            Complete
          </button>
        </li>
      ))}
    </ul>
  );
}
\`\`\``,
    explanation:
      "Mutations don't update queries automatically. Returning the `invalidateQueries` promise from `onSuccess` keeps the mutation pending until the refetch completes. After the `isPending`/`isError` checks, TypeScript narrows `data` to `Task[]`.",
    lessonId: "tq-mutations-invalidation",
    source: "practice",
  },
  {
    id: "st-033",
    type: "code",
    topic: "zustand",
    subtopic: "Theme store with persist",
    difficulty: "intermediate",
    marks: 5,
    minutes: 6,
    language: "ts",
    prompt:
      "Write a Zustand v5 store `useThemeStore` in TypeScript holding `theme: \"light\" | \"dark\"` (default `\"light\"`), a `toggleTheme()` action and a `setTheme(theme)` action. Persist it to localStorage under the name `\"theme\"`. Then show how a component reads only `theme` using a selector.",
    rubric: [
      { criterion: "Imports create from 'zustand' and persist from 'zustand/middleware'", marks: 1 },
      { criterion: "Typed state interface including actions; uses create<State>()(...) curried form", marks: 1 },
      { criterion: "toggleTheme uses set with an updater based on current state", marks: 1 },
      { criterion: "persist wraps the creator with { name: 'theme' }", marks: 1 },
      { criterion: "Component uses a selector `useThemeStore((s) => s.theme)`", marks: 1 },
    ],
    modelAnswer: `\`\`\`ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

type Theme = "light" | "dark";

interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "light",
      toggleTheme: () =>
        set((s) => ({ theme: s.theme === "light" ? "dark" : "light" })),
      setTheme: (theme) => set({ theme }),
    }),
    { name: "theme" },
  ),
);

// In a component:
// const theme = useThemeStore((s) => s.theme);
// const toggleTheme = useThemeStore((s) => s.toggleTheme);
\`\`\``,
    explanation:
      "The curried `create<T>()(...)` form is required in TypeScript when using middleware. `persist` defaults to localStorage (JSON). Selecting individual fields keeps re-renders minimal.",
    lessonId: "zustand-persist",
    source: "practice",
  },
  {
    id: "st-034",
    type: "code",
    topic: "tanstack-query",
    subtopic: "Parameterised queries",
    difficulty: "advanced",
    marks: 4,
    minutes: 5,
    language: "ts",
    prompt:
      "Write a custom Hook `useCourse(courseId: string | undefined)` with TanStack Query v5 that fetches `/api/courses/{id}` via `getCourse(id: string): Promise<Course>`. The key must include the id, the query must not run until `courseId` is defined, and the data should be considered fresh for 60 seconds.",
    rubric: [
      { criterion: "queryKey includes the id, e.g. ['courses', courseId]", marks: 1 },
      { criterion: "queryFn calls getCourse with the id (handling the undefined type safely)", marks: 1 },
      { criterion: "enabled: !!courseId (or courseId !== undefined)", marks: 1 },
      { criterion: "staleTime: 60_000", marks: 1 },
    ],
    modelAnswer: `\`\`\`ts
import { useQuery } from "@tanstack/react-query";

export function useCourse(courseId: string | undefined) {
  return useQuery({
    queryKey: ["courses", courseId],
    queryFn: () => getCourse(courseId as string),
    enabled: courseId !== undefined,
    staleTime: 60_000,
  });
}
\`\`\``,
    explanation:
      "Including the id in the key gives each course its own cache entry and refetches when it changes. `enabled` prevents a request to `/api/courses/undefined`; the cast is safe because the queryFn only runs when enabled. (v5 also offers `skipToken`: `queryFn: courseId ? () => getCourse(courseId) : skipToken`.)",
    lessonId: "tq-usequery-keys",
    source: "practice",
  },
];
