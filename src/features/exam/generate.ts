import { BANK, PAPERS, paperQuestions } from "@/content";
import type { Question, TopicId } from "@/content/types";
import type { GeneratedPaper } from "@/stores/examSessionStore";
import { shuffle } from "@/features/assessment/scoring";

const SECTION_TITLE: Record<string, string> = { A: "Multiple choice", B: "True / False", C: "Short answer", D: "Programming & analysis", E: "Front-end security" };

function bySection(qs: Question[]): GeneratedPaper["sections"] {
  const groups: Record<string, Question[]> = { A: [], B: [], C: [], D: [], E: [] };
  for (const q of qs) {
    if (q.topic === "security" && (q.type === "mcq" || q.type === "tf")) groups.E.push(q);
    else if (q.type === "mcq") groups.A.push(q);
    else if (q.type === "tf") groups.B.push(q);
    else if (q.type === "short") groups.C.push(q);
    else groups.D.push(q);
  }
  return Object.entries(groups).filter(([, v]) => v.length).map(([id, v]) => ({ id, title: SECTION_TITLE[id], questionIds: v.map((q) => q.id) }));
}

const take = (qs: Question[], n: number, seed: number) => shuffle(qs, seed).slice(0, n);

/** Beginner guided mock: same 5-section shape, beginner/intermediate bank questions. */
export function beginnerMock(seed = Date.now()): GeneratedPaper {
  const easy = BANK.filter((q) => q.difficulty === "beginner" || q.difficulty === "intermediate");
  const nonSec = easy.filter((q) => q.topic !== "security");
  const sec = easy.filter((q) => q.topic === "security" && (q.type === "mcq" || q.type === "tf"));
  const qs = [
    ...take(nonSec.filter((q) => q.type === "mcq"), 20, seed),
    ...take(nonSec.filter((q) => q.type === "tf"), 15, seed + 1),
    ...take(nonSec.filter((q) => q.type === "short"), 5, seed + 2),
    ...take(nonSec.filter((q) => q.type === "code"), 4, seed + 3),
    ...take(sec, 5, seed + 4),
  ];
  return { title: "Beginner guided mock", description: "Generated from beginner/intermediate practice questions in the ICT section structure. Marks differ from the 100-mark paper.", sections: bySection(qs) };
}

export function topicPaper(topics: TopicId[], title: string, description: string, n = 25, seed = Date.now()): GeneratedPaper {
  const pool = BANK.filter((q) => topics.includes(q.topic));
  return { title, description, sections: bySection(take(pool, n, seed)) };
}

export function programmingOnly(seed = Date.now()): GeneratedPaper {
  const fromPapers = PAPERS.flatMap((p) => paperQuestions(p).filter((x) => x.section === "D").map((x) => x.question));
  const bank = BANK.filter((q) => q.type === "code");
  const qs = [...take(fromPapers, 4, seed), ...take(bank, 4, seed + 7)];
  return { title: "Programming-only practice", description: "Section D-style programming and analysis questions (4 from mock papers + 4 from the bank). Self-assessed against rubrics.", sections: [{ id: "D", title: SECTION_TITLE.D, questionIds: qs.map((q) => q.id) }] };
}

export function securityOnly(seed = Date.now()): GeneratedPaper {
  const pool = BANK.filter((q) => q.topic === "security");
  const paperSec = PAPERS.flatMap((p) => paperQuestions(p).filter((x) => x.section === "E").map((x) => x.question));
  const qs = [...take(pool, 15, seed), ...take(paperSec, 5, seed + 3)];
  return { title: "Security-only practice", description: "Authentication, JWT, 401/403, trust boundaries, XSS/CSRF and HTTPS.", sections: [{ id: "E", title: SECTION_TITLE.E, questionIds: [...new Set(qs.map((q) => q.id))] }] };
}

export function missedPaper(ids: string[]): GeneratedPaper | null {
  const qs = ids.map((id) => BANK.find((q) => q.id === id) ?? PAPERS.flatMap((p) => p.questions).find((q) => q.id === id)).filter((q): q is Question => !!q);
  if (!qs.length) return null;
  return { title: "Review my mistakes", description: "Questions you previously answered incorrectly.", sections: bySection(qs.slice(0, 30)) };
}
