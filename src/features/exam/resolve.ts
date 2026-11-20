import { paperById, paperQuestions, questionById } from "@/content";
import type { Question } from "@/content/types";
import type { ExamSession, GeneratedPaper } from "@/stores/examSessionStore";

export interface ResolvedPaper {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  rafExtraMinutes: number;
  instructions: string[];
  sections: { id: string; title: string; instructions?: string; suggestedMinutes?: number }[];
  items: { section: string; question: Question }[];
  totalMarks: number;
}

export function resolveGenerated(id: string, g: GeneratedPaper): ResolvedPaper {
  const items = g.sections.flatMap((s) => s.questionIds.map((qid) => ({ section: s.id, question: questionById(qid)! })).filter((x) => x.question));
  return {
    id,
    title: g.title,
    description: g.description,
    durationMinutes: Math.max(10, Math.round(items.reduce((s, x) => s + x.question.minutes, 0))),
    rafExtraMinutes: 0,
    instructions: ["Answer all questions.", "Objective questions are marked automatically; written and code answers are self-assessed against a rubric after submission."],
    sections: g.sections.map((s) => ({ id: s.id, title: s.title })),
    items,
    totalMarks: items.reduce((s, x) => s + x.question.marks, 0),
  };
}

export function resolvePaper(paperId: string, session?: ExamSession | null): ResolvedPaper | null {
  if (session?.paperId === paperId && session.generated) return resolveGenerated(paperId, session.generated);
  const p = paperById(paperId);
  if (!p) return null;
  return {
    id: p.id,
    title: p.title,
    description: p.description,
    durationMinutes: p.durationMinutes,
    rafExtraMinutes: p.rafExtraMinutes,
    instructions: p.instructions,
    sections: p.sections.map((s) => ({ id: s.id, title: s.title, instructions: s.instructions, suggestedMinutes: s.suggestedMinutes })),
    items: paperQuestions(p),
    totalMarks: p.totalMarks,
  };
}
