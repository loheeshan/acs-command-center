# Visualizer specifications

Registry: `src/features/visualizers/registry.ts` (merges `registry-a.ts`, `registry-b.ts`). Each entry declares `kind: "live"` (real code/CSS runs) or `"simulation"` (step-through model of real semantics) and the UI labels it accordingly. Every visualizer marks itself explored in progress once completed/used.

| Id | Kind | Teaches |
|---|---|---|
| event-loop | sim | stack / microtasks / tasks ordering, 3 presets + predict mode |
| array-methods | sim (real calls) | callback calls, return values, mutation |
| reduce-accumulator | sim | accumulator table, missing initial value |
| reference-copy | sim | stack/heap, aliasing, shallow vs deep copy |
| closure-scope | sim | lexical environments, let vs var in loops |
| promise-lifecycle | sim | all / allSettled / race / any / sequential on a timeline |
| ts-compile | live | Sucrase strips types; `as` doesn't validate |
| react-state-queue | sim | snapshots, updater queue, batching |
| render-commit | sim | render ≠ DOM mutation, keys |
| useeffect-lifecycle | sim | deps, cleanup, StrictMode |
| props-flow | sim | props down, callbacks up, drilling vs context |
| box-model, flexbox, grid-areas, clamp, specificity | live | real CSS with generated code |
| url-anatomy | live | `new URL()` parts, request journey |
| http-lab | sim | request builder, status codes, what the frontend should do |
| abort-race | sim | out-of-order responses, AbortController |
| cors-preflight | sim | simple vs preflighted requests |
| crud-simulator | sim | validate → request → status → UI update |
| form-validation | live | controlled form, errors object, server still validates |
| jwt-explorer | live | Base64URL encode/decode of fictional tokens, expiry |
| auth-flow | sim | login → bearer → 200/401/403 |
| trust-boundary | sim | which defences hold client vs server |
| query-cache | sim | staleTime, gcTime, observers, invalidation, request counts |
| zustand-selectors | live | real store + render counters |
| state-decision | sim | choosing the right state tool |
| architecture-flow | sim | Component → Hook → Service → API → DB |
| route-matcher | sim | ranking, params, query, history |
| outlet-layout | sim (real components) | layouts persist, Outlet swaps children |
