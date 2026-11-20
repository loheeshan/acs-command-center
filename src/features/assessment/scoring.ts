import type { Question, TopicId } from "@/content/types";
import type { AttemptRecord, QuestionResult } from "@/stores/progressStore";

export type AnswerMap = Record<string, unknown>;
/** Self-assessed marks for rubric questions: questionId → rubric index → awarded marks. */
export type SelfMarks = Record<string, Record<number, number>>;

export function isObjective(q: Question): boolean {
  return q.type === "mcq" || q.type === "tf";
}

export function isAnswered(_q: Question, a: unknown): boolean {
  if (a === undefined || a === null) return false;
  if (typeof a === "string") return a.trim().length > 0;
  return true;
}

/** Exact marking for objective questions. Returns null for rubric questions. */
export function markObjective(q: Question, a: unknown): boolean | null {
  if (q.type === "mcq") return a === q.answer;
  if (q.type === "tf") return a === q.answer;
  return null;
}

export function scoreQuestion(q: Question, a: unknown, self: Record<number, number> | undefined, section?: string): QuestionResult {
  if (q.type === "mcq" || q.type === "tf") {
    const answered = isAnswered(q, a);
    const correct = answered ? markObjective(q, a) === true : null;
    return { questionId: q.id, topic: q.topic, section, marksAvailable: q.marks, marksAwarded: correct ? q.marks : 0, correct, selfAssessed: false };
  }
  const answered = isAnswered(q, a);
  const awarded = answered && self ? q.rubric.reduce((sum, r, i) => sum + Math.min(r.marks, Math.max(0, self[i] ?? 0)), 0) : 0;
  return {
    questionId: q.id,
    topic: q.topic,
    section,
    marksAvailable: q.marks,
    marksAwarded: awarded,
    correct: answered ? awarded >= q.marks * 0.5 : null,
    selfAssessed: true,
  };
}

export interface Breakdown {
  key: string;
  awarded: number;
  available: number;
  /** 0–100 */
  pct: number;
  count: number;
}

function group(results: QuestionResult[], key: (r: QuestionResult) => string | undefined): Breakdown[] {
  const map = new Map<string, Breakdown>();
  for (const r of results) {
    const k = key(r);
    if (!k) continue;
    const b = map.get(k) ?? { key: k, awarded: 0, available: 0, pct: 0, count: 0 };
    b.awarded += r.marksAwarded;
    b.available += r.marksAvailable;
    b.count += 1;
    map.set(k, b);
  }
  return [...map.values()].map((b) => ({ ...b, pct: b.available ? Math.round((b.awarded / b.available) * 100) : 0 }));
}

export const bySection = (r: QuestionResult[]) => group(r, (x) => x.section).sort((a, b) => a.key.localeCompare(b.key));
export const byTopic = (r: QuestionResult[]) => group(r, (x) => x.topic).sort((a, b) => a.pct - b.pct);

export function totals(results: QuestionResult[]) {
  const awarded = results.reduce((s, r) => s + r.marksAwarded, 0);
  const available = results.reduce((s, r) => s + r.marksAvailable, 0);
  return {
    awarded,
    available,
    pct: available ? Math.round((awarded / available) * 100) : 0,
    correct: results.filter((r) => r.correct === true).length,
    incorrect: results.filter((r) => r.correct === false).length,
    unanswered: results.filter((r) => r.correct === null).length,
    selfAssessedMarks: results.filter((r) => r.selfAssessed).reduce((s, r) => s + r.marksAwarded, 0),
  };
}

/**
 * Aggregate demonstrated performance per topic across ALL recorded attempts.
 * Only topics with real evidence are returned (no fabricated numbers).
 */
export function topicPerformance(attempts: AttemptRecord[]): Breakdown[] {
  return byTopic(attempts.flatMap((a) => a.results.filter((r) => r.correct !== null)));
}

/** Weak = below 65 % with at least 3 answered questions of evidence. */
export function weakTopics(attempts: AttemptRecord[], threshold = 65, minEvidence = 3): (Breakdown & { key: TopicId })[] {
  return topicPerformance(attempts).filter((b) => b.count >= minEvidence && b.pct < threshold) as (Breakdown & { key: TopicId })[];
}

export function strongTopics(attempts: AttemptRecord[], threshold = 80, minEvidence = 3): Breakdown[] {
  return topicPerformance(attempts).filter((b) => b.count >= minEvidence && b.pct >= threshold).sort((a, b) => b.pct - a.pct);
}

/** Questions answered incorrectly in the attempts (latest first). */
export function missedQuestionIds(attempts: AttemptRecord[]): string[] {
  const ids: string[] = [];
  for (const a of [...attempts].reverse()) for (const r of a.results) if (r.correct === false && !ids.includes(r.questionId)) ids.push(r.questionId);
  return ids;
}

export function shuffle<T>(arr: T[], seed = Date.now()): T[] {
  const a = [...arr];
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 16807) % 2147483647;
    const j = s % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
