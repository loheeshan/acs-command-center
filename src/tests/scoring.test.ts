import { describe, expect, it } from "vitest";
import type { McqQuestion, ShortQuestion, TrueFalseQuestion } from "@/content/types";
import { byTopic, scoreQuestion, totals, weakTopics, bySection } from "@/features/assessment/scoring";
import type { AttemptRecord } from "@/stores/progressStore";

const base = { subtopic: "x", difficulty: "exam" as const, minutes: 1, explanation: "", source: "practice" as const };
const mcq: McqQuestion = { ...base, id: "m1", type: "mcq", topic: "javascript", marks: 1, prompt: "?", options: ["a", "b", "c", "d"], answer: 1 };
const tf: TrueFalseQuestion = { ...base, id: "t1", type: "tf", topic: "router", marks: 1, prompt: "?", answer: false };
const short: ShortQuestion = { ...base, id: "s1", type: "short", topic: "security", marks: 3, prompt: "?", rubric: [{ criterion: "a", marks: 2 }, { criterion: "b", marks: 1 }], modelAnswer: "" };

describe("scoreQuestion", () => {
  it("marks MCQs exactly", () => {
    expect(scoreQuestion(mcq, 1, undefined).marksAwarded).toBe(1);
    expect(scoreQuestion(mcq, 2, undefined)).toMatchObject({ marksAwarded: 0, correct: false });
    expect(scoreQuestion(mcq, undefined, undefined).correct).toBeNull();
  });
  it("treats `false` as a real true/false answer, not as unanswered", () => {
    expect(scoreQuestion(tf, false, undefined)).toMatchObject({ marksAwarded: 1, correct: true });
    expect(scoreQuestion(tf, true, undefined)).toMatchObject({ marksAwarded: 0, correct: false });
  });
  it("caps self-assessed rubric marks and flags them as self-assessed", () => {
    const r = scoreQuestion(short, "my answer", { 0: 5, 1: 1 });
    expect(r).toMatchObject({ marksAwarded: 3, selfAssessed: true });
  });
  it("gives 0 for an unanswered rubric question even if marks were entered", () => {
    expect(scoreQuestion(short, "   ", { 0: 2, 1: 1 }).marksAwarded).toBe(0);
  });
});

describe("aggregation", () => {
  const results = [scoreQuestion(mcq, 1, undefined, "A"), scoreQuestion(tf, true, undefined, "B"), scoreQuestion(short, "x", { 0: 1 }, "C")];
  it("totals", () => {
    expect(totals(results)).toMatchObject({ awarded: 2, available: 5, correct: 1, incorrect: 2 });
  });
  it("groups by section and topic", () => {
    expect(bySection(results).map((s) => s.key)).toEqual(["A", "B", "C"]);
    expect(byTopic(results)[0]).toMatchObject({ key: "router", pct: 0 });
  });
  it("only reports weak topics with enough evidence", () => {
    const attempt = (r: typeof results): AttemptRecord => ({ id: "a", kind: "quiz", title: "", startedAt: 0, finishedAt: 0, durationSec: 0, results: r, answers: {} });
    expect(weakTopics([attempt(results)])).toEqual([]);
    const many = [1, 2, 3].map(() => scoreQuestion(tf, true, undefined));
    expect(weakTopics([attempt(many)]).map((w) => w.key)).toEqual(["router"]);
  });
});
