import { describe, expect, it } from "vitest";
import { transform } from "sucrase";
import { ALL_QUESTIONS, BANK, CHALLENGES, FLASHCARDS, LESSONS, PAPERS, lessonById, paperQuestions } from "@/content";
import { ACADEMY } from "@/content/modules";

describe("content integrity", () => {
  it("has the expected volume of content", () => {
    expect(LESSONS.length).toBeGreaterThanOrEqual(60);
    expect(BANK.length).toBeGreaterThanOrEqual(200);
    expect(PAPERS.length).toBeGreaterThanOrEqual(3);
    expect(CHALLENGES.length).toBeGreaterThanOrEqual(25);
    expect(FLASHCARDS.length).toBeGreaterThanOrEqual(100);
  });
  it("has unique ids", () => {
    const dupes = (ids: string[]) => ids.filter((id, i) => ids.indexOf(id) !== i);
    expect(dupes(LESSONS.map((l) => l.id))).toEqual([]);
    expect(dupes(ALL_QUESTIONS.map((q) => q.id))).toEqual([]);
    expect(dupes(CHALLENGES.map((c) => c.id))).toEqual([]);
    expect(dupes(FLASHCARDS.map((c) => c.id))).toEqual([]);
  });
  it("only links to lessons that exist", () => {
    const missing = [
      ...LESSONS.flatMap((l) => l.prerequisites.filter((p) => !lessonById(p)).map((p) => `${l.id} → prereq ${p}`)),
      ...ALL_QUESTIONS.filter((q) => q.lessonId && !lessonById(q.lessonId)).map((q) => `${q.id} → ${q.lessonId}`),
      ...CHALLENGES.filter((c) => c.lessonId && !lessonById(c.lessonId)).map((c) => `${c.id} → ${c.lessonId}`),
      ...FLASHCARDS.filter((c) => c.lessonId && !lessonById(c.lessonId)).map((c) => `${c.id} → ${c.lessonId}`),
      ...ACADEMY.flatMap((w) => w.lessonIds.filter((id) => !lessonById(id)).map((id) => `${w.id} → ${id}`)),
    ];
    expect(missing).toEqual([]);
  });
  it("MCQ answers are valid indices and rubrics sum to marks", () => {
    for (const q of ALL_QUESTIONS) {
      if (q.type === "mcq") expect(q.answer, q.id).toBeLessThan(q.options.length);
      if (q.type === "short" || q.type === "code") expect(q.rubric.reduce((s, r) => s + r.marks, 0), q.id).toBe(q.marks);
    }
  });
  it("full mock papers follow the 100-mark A–E structure", () => {
    for (const p of PAPERS.filter((x) => x.kind !== "topic-practice")) {
      const items = paperQuestions(p);
      const marks = (s: string) => items.filter((i) => i.section === s).reduce((a, b) => a + b.question.marks, 0);
      expect(items.reduce((a, b) => a + b.question.marks, 0), p.id).toBe(100);
      expect(["A", "B", "C", "D", "E"].map(marks), p.id).toEqual([20, 15, 15, 40, 10]);
      expect(["A", "B", "C", "D", "E"].map((s) => items.filter((i) => i.section === s).length), p.id).toEqual([20, 15, 5, 4, 5]);
    }
  });
  it("preserves the original mock wording for spot-checked questions", () => {
    const orig = PAPERS.find((p) => p.kind === "original-mock")!;
    const a1 = orig.questions.find((q) => q.id === "mock-orig-A1")!;
    expect(a1.prompt).toContain("display the total value of all items in a shopping basket");
    const c1 = orig.questions.find((q) => q.id === "mock-orig-C1")!;
    expect(c1.prompt).toContain("const prices = [15, 25, 10, 30];");
  });
});

// Mirror of the worker runner, executed in Node so every reference solution is verified.
const AsyncFunction = (async () => {}).constructor as new (...args: string[]) => (...a: unknown[]) => Promise<unknown>;
function deepEqual(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) return true;
  if (typeof a !== "object" || typeof b !== "object" || !a || !b) return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  const ka = Object.keys(a), kb = Object.keys(b);
  return ka.length === kb.length && ka.every((k) => deepEqual((a as Record<string, unknown>)[k], (b as Record<string, unknown>)[k]));
}
const assertEqual = (x: unknown, y: unknown, m?: string) => { if (!deepEqual(x, y)) throw new Error(`${m ?? ""} expected ${JSON.stringify(y)} got ${JSON.stringify(x)}`); };
const assert = (c: unknown, m?: string) => { if (!c) throw new Error(m ?? "assertion failed"); };

describe("challenges", () => {
  for (const c of CHALLENGES) {
    it(`${c.id}: reference solution passes every test`, async () => {
      const code = c.language === "ts" ? transform(c.solution, { transforms: ["typescript"] }).code : c.solution;
      const realFetch = globalThis.fetch;
      for (const t of c.tests) {
        try {
          await new AsyncFunction("assertEqual", "assert", "__acsLoopGuard", `${code}\n;\n${t.code}`)(assertEqual, assert, () => {});
        } finally {
          globalThis.fetch = realFetch;
        }
      }
    });
  }
});
