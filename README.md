# ACS Command Center

**Understand. Visualize. Experiment. Master.** — an interactive learning environment for 5COSC026W Advanced Client-Side Development (University of Westminster, 2026/27).

## Run
```bash
npm install
npm run dev        # http://localhost:5180  (also builds public/sandbox-runtime.js)
npm test           # 116 unit/content/smoke tests
npm run build      # typecheck + production build
```
Node 22+. Everything is local: no accounts, no backend. Progress is stored in your browser — use **Personal → Progress → Export** to back it up.

## What's inside
- **Master Core** (15 modules, 67 lessons, 3 explanation levels) and **University Academy** (T01–T12, same lessons in roadmap order).
- **Visual Lab**: 31 interactive visualizers (event loop, TanStack Query cache inspector, JWT explorer, route matcher, Zustand selectors, CSS grid…).
- **Code Playground**: Monaco + real React/Router/TanStack Query/Zustand in an isolated iframe with a mock CampusEvents API.
- **Assessment**: original Mock ICT (verbatim), 2 practice mocks, 246 practice questions, 30 auto-graded challenges, timed exam simulator (refresh-safe), results & weak-topic analysis.
- **Revision**: study roadmap 20–26 Nov, flashcards with spaced repetition, cheat sheets, last-minute mode.
- **Coursework** workspace and the 8-stage **CampusEvents Project Lab**.

See `docs/` for source analysis, architecture, testing strategy and known limitations. Original university files are untouched in the project root; extracted copies are in `extracted-materials/`.
