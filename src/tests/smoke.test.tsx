import { Suspense } from "react";
import { describe, expect, it, vi, beforeAll } from "vitest";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Monaco and React Flow need real browser APIs; stub them for jsdom smoke tests.
vi.mock("@/features/playground/CodeEditor", () => ({ default: () => <textarea aria-label="code editor stub" /> }));
vi.mock("@xyflow/react", () => ({ ReactFlow: () => <div>graph</div>, Background: () => null, Controls: () => null, MiniMap: () => null, MarkerType: { ArrowClosed: "arrowclosed" } }));
vi.mock("@xyflow/react/dist/style.css", () => ({}));

beforeAll(() => {
  window.scrollTo = () => {};
  Element.prototype.scrollTo = () => {};
  Element.prototype.scrollIntoView = () => {};
  globalThis.ResizeObserver ??= class { observe() {} unobserve() {} disconnect() {} } as unknown as typeof ResizeObserver;
  window.matchMedia ??= ((q: string) => ({ matches: false, media: q, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}, onchange: null, dispatchEvent: () => false })) as typeof window.matchMedia;
});

const ROUTES = [
  "/", "/fast-track", "/roadmap", "/graph", "/learn", "/learn/m06-router", "/academy",
  "/lesson/js-array-reduce", "/lesson/router-nested-layouts-outlet", "/lesson/tq-stale-gc", "/lesson/sec-jwt-anatomy",
  "/lab/visual", "/lab/api", "/lab/security", "/lab/state", "/lab/campus-events",
  "/assess/quiz", "/assess/challenges", "/assess/challenges/ch-js-basket-total", "/assess/mock", "/assess/exams",
  "/assess/exam/original-mock", "/assess/results",
  "/coursework", "/coursework/requirements", "/coursework/planner",
  "/revision", "/revision/last-minute", "/flashcards", "/notes", "/saved", "/progress", "/resources", "/settings", "/no-such-page",
];

async function renderAt(path: string) {
  const { default: App } = await import("@/App");
  const errors: unknown[] = [];
  const spy = vi.spyOn(console, "error").mockImplementation((...a) => errors.push(a));
  render(
    <QueryClientProvider client={new QueryClient()}>
      <MemoryRouter initialEntries={[path]}><App /></MemoryRouter>
    </QueryClientProvider>,
  );
  await waitFor(() => expect(screen.queryByText("Loading…")).toBeNull(), { timeout: 12000 });
  spy.mockRestore();
  return errors;
}

describe("every route renders without crashing", () => {
  for (const path of ROUTES) {
    it(path, async () => {
      const errors = await renderAt(path);
      expect(document.querySelector("h1")?.textContent?.length ?? 0).toBeGreaterThan(0);
      expect(errors.filter((e) => String(e).includes("Error:"))).toEqual([]);
      cleanup();
    }, 20000);
  }
});

describe("every visualizer renders", async () => {
  const { VISUALIZERS } = await import("@/features/visualizers/registry");
  it("has all 31 visualizers registered", () => expect(VISUALIZERS.length).toBe(31));
  for (const v of VISUALIZERS) {
    it(v.id, async () => {
      const C = v.component;
      const { container } = render(<MemoryRouter><Suspense fallback={<p>loading-viz</p>}><C /></Suspense></MemoryRouter>);
      await waitFor(() => expect(screen.queryByText("loading-viz")).toBeNull(), { timeout: 12000 });
      expect(container.textContent!.length).toBeGreaterThan(20);
      cleanup();
    }, 20000);
  }
});
