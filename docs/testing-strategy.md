# Testing strategy

| Suite | File | What it proves |
|---|---|---|
| Scoring | `src/tests/scoring.test.ts` | exact MCQ/TF marking (incl. `false`/`0` answers), rubric capping, unanswered handling, section/topic aggregation, weak-topic evidence threshold |
| Exam session | `src/tests/examSession.test.ts` | absolute deadline persisted (refresh-safe), single submission, timed-out flag |
| Sandbox compiler | `src/tests/sandbox.test.ts` | loop guard instrumentation (and that strings/comments are untouched), TS/JSX → CommonJS |
| Content integrity | `src/tests/content.test.ts` | volumes, unique ids, every lesson/prereq/question/challenge/flashcard/Academy link resolves, MCQ indices, rubric sums, all full papers = 100 marks with 20/15/15/40/10 split, original-mock wording spot checks, **every challenge reference solution passes its tests** |
| Smoke | `src/tests/smoke.test.tsx` | 34 routes render with a heading and no React errors; all 31 visualizers mount (Monaco/React Flow stubbed) |
| Sandbox execution (opt-in) | `src/tests/sandboxRun.slow.test.ts` | each playground preset runs inside the real sandbox document; event-loop order; mock API; infinite-loop stop |

Commands: `npm test`, `npm run test:sandbox`, `npm run typecheck`, `npm run build`.
Manual checks still recommended: open the playground and run a preset; complete a short timed exam and refresh mid-way; try a challenge; toggle light/dark and phone width.
