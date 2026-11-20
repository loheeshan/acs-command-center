# Known limitations

## Verification status
- Verified automatically: `tsc -b` clean, production build succeeds, 116 Vitest tests pass (scoring, timer persistence, loop guard, compiler, content integrity incl. every cross-link and 100-mark paper structure, every challenge reference solution, every route renders, all 31 visualizers mount).
- **Not yet verified in a real browser by the developer:** Monaco worker loading, the sandbox iframe end-to-end, visual layout/responsiveness and keyboard flows. The opt-in `npm run test:sandbox` executes every playground preset inside a scripted jsdom document (real React rendering, mock API, loop guard) — it was not run to completion during the build because the machine was low on memory.

## Sandbox
- Loop guard only instruments **braced** loops; `while(true) x++;` without braces relies on the Stop button (the iframe can be removed, but a tight loop in a same-process iframe can still freeze the tab until the browser intervenes).
- Sandboxed previews use `MemoryRouter` because the preview document has no real address bar; real apps use `BrowserRouter` (explained in each preset).
- Monaco ambient typings for react / react-router-dom / zustand / @tanstack/react-query / zod are simplified; some valid code may show loose types or miss errors. Full `.d.ts` bundling is a future improvement.
- Web Worker challenges remove `fetch`, XHR, `importScripts`, `indexedDB` and `WebSocket` before learner code runs; this is defence-in-depth for a single-user local app, not a hardened multi-tenant sandbox.

## Marking
- MCQ/True-False are marked exactly. Short-answer and code questions use **guided self-assessment** against rubrics, labelled as such; there is no automatic semantic grading.
- The supplied mock had no answer key; answers/rubrics were written for this platform.

## Content
- Lectures 6–11 and the coursework specification were not supplied; related lessons are labelled *Supplementary* and coursework checklists are labelled *recommendations*.
- Question bank: 246 practice questions + 3 full papers (target in the brief was 450 practice questions and 5 practice mocks — quality was prioritised; more can be added as data files without code changes).
- A few facts flagged by authors for spot-checking: React 19 handling of `javascript:` URLs, JwtBearer default clock skew, some Zustand doc URL paths. Walkthrough line numbers were hand-counted.
- `images.7z` from the archive was not extracted (no 7z tool installed).
