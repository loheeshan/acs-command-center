# Architecture

ACS Command Center is a local-first single-page app: **React 19 + TypeScript + Vite 8**, **React Router 7** (`react-router-dom`, declarative `<Routes>` — the style the module teaches), **TanStack Query 5** (app-level client provided), **Zustand 5** for learner/UI client state, **Tailwind 4** for styling, **Monaco** (bundled locally, no CDN) for editing, **Sucrase** for in-browser TS/JSX transpilation, **React Flow** for the knowledge graph. No backend, no database, no paid APIs.

The app deliberately demonstrates what it teaches: server-like content is static data; client state is in Zustand stores with selectors; local UI state stays in components; filters live in the URL where shareable (`/lab/playground?preset=…`, `/flashcards?deck=…`, `/lab/campus-events?stage=…`).

```text
src/
├── main.tsx / App.tsx        providers + route table (all pages lazy-loaded)
├── app/navigation.ts         sidebar groups (COMMAND / LEARNING / LABORATORY / ASSESSMENT / COURSEWORK / PERSONAL)
├── components/ui|layout      design-system primitives, Markdown, CodeBlock, AppShell, Sidebar
├── content/                  ALL learning data (typed by content/types.ts)
│   ├── lessons/*.ts          67 lessons (WHY → … → REVISE structure, 3 explanation levels)
│   ├── questions/bank-*.ts   246 practice questions
│   ├── exams/                original mock (verbatim) + 2 practice mocks
│   ├── challenges/           30 auto-graded challenges (141 tests)
│   ├── flashcards/           126 cards
│   ├── references.ts         15 revision cheat sheets
│   ├── modules.ts            Master Core modules + University Academy weeks (shared lesson ids)
│   └── index.ts              aggregates files via import.meta.glob
├── features/
│   ├── curriculum/           Master Core, module, lesson, academy pages
│   ├── visualizers/          registry + 31 visualizers (a/ = JS/React/CSS, b/ = HTTP/security/state)
│   ├── playground/           Monaco editor, sandbox compiler/iframe, worker test runner, presets
│   ├── exam/ quiz/ results/  exam simulator, quiz arena, scoring analytics
│   ├── assessment/scoring.ts pure scoring + topic analytics
│   ├── challenges/ roadmap/ dashboard/ graph/ revision/ coursework/ project-lab/ personal/
├── stores/                   uiStore, progressStore (persisted), examSessionStore (persisted)
├── sandbox/runtime-entry.ts  bundled to public/sandbox-runtime.js (real React/Router/Query/Zustand/Zod)
└── tests/                    Vitest suites
```

## Persistence
`zustand/middleware` `persist` → versioned localStorage keys `acs-ui`, `acs-progress`, `acs-exam-session`. Progress export/import is JSON (Progress page). No credentials or tokens are stored.

## Exam timer
`examSessionStore` stores an **absolute deadline** (epoch ms). Remaining time is always `deadline − now`, so refreshes never reset the clock; reaching zero auto-submits, then the learner self-marks rubric questions before the attempt is saved.

## Code execution (see known-limitations.md)
- **Playground / lesson "Try it"**: files → Sucrase (TS/JSX → CommonJS) → `<iframe sandbox="allow-scripts allow-modals">` (no `allow-same-origin` ⇒ opaque origin, no access to app storage) with a CSP that blocks network. A tiny CommonJS loader resolves relative imports and maps bare imports to the bundled runtime. `fetch('/api/…')` is answered by a clearly-labelled **mock CampusEvents API**. Loops are instrumented with a time guard; a Stop button tears the iframe down.
- **Challenges**: learner code + tests run in a **Web Worker** (no DOM; network/IndexedDB removed), terminated after 15 s.
- **TypeScript diagnostics**: Monaco's real TS language service (with lightweight ambient declarations for the sandbox libraries).
