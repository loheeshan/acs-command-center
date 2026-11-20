import type { Challenge, ExamPaper, Flashcard, Lesson, ModuleId, Question, TopicId } from "./types";
import { MODULES } from "./modules";

type Mod = Record<string, unknown>;

function collect<T>(mods: Record<string, Mod>, guard: (v: unknown) => boolean): T[] {
  const out: T[] = [];
  for (const m of Object.values(mods)) {
    for (const v of Object.values(m)) {
      if (Array.isArray(v)) out.push(...(v.filter(guard) as T[]));
      else if (guard(v)) out.push(v as T);
    }
  }
  return out;
}

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null;

const lessonMods = import.meta.glob<Mod>("./lessons/*.ts", { eager: true });
const questionMods = import.meta.glob<Mod>("./questions/*.ts", { eager: true });
const examMods = import.meta.glob<Mod>("./exams/*.ts", { eager: true });
const challengeMods = import.meta.glob<Mod>("./challenges/*.ts", { eager: true });
const flashcardMods = import.meta.glob<Mod>("./flashcards/*.ts", { eager: true });

const moduleOrder = new Map(MODULES.map((m, i) => [m.id, i]));

export const LESSONS: Lesson[] = collect<Lesson>(lessonMods, (v) => isObj(v) && "moduleId" in v && "explain" in v).sort(
  (a, b) => (moduleOrder.get(a.moduleId) ?? 99) - (moduleOrder.get(b.moduleId) ?? 99),
);
const lessonMap = new Map(LESSONS.map((l) => [l.id, l]));
export const lessonById = (id: string) => lessonMap.get(id);
export const lessonsByModule = (id: ModuleId) => LESSONS.filter((l) => l.moduleId === id);

export const PAPERS: ExamPaper[] = collect<ExamPaper>(examMods, (v) => isObj(v) && "sections" in v && "questions" in v).sort((a, b) =>
  a.kind === "original-mock" ? -1 : b.kind === "original-mock" ? 1 : a.id.localeCompare(b.id),
);
export const paperById = (id: string) => PAPERS.find((p) => p.id === id);

/** Practice bank (excludes exam papers). */
export const BANK: Question[] = collect<Question>(questionMods, (v) => isObj(v) && "type" in v && "prompt" in v && "topic" in v);
export const ALL_QUESTIONS: Question[] = [...BANK, ...PAPERS.flatMap((p) => p.questions)];
const qMap = new Map(ALL_QUESTIONS.map((q) => [q.id, q]));
export const questionById = (id: string) => qMap.get(id);

export const CHALLENGES: Challenge[] = collect<Challenge>(challengeMods, (v) => isObj(v) && "tests" in v && "starterCode" in v);
export const challengeById = (id: string) => CHALLENGES.find((c) => c.id === id);

export const FLASHCARDS: Flashcard[] = collect<Flashcard>(flashcardMods, (v) => isObj(v) && "front" in v && "back" in v);

export function questionsForTopic(t: TopicId) {
  return BANK.filter((q) => q.topic === t);
}

/** Resolve the ordered question list of a paper. */
export function paperQuestions(p: ExamPaper): { section: string; question: Question }[] {
  const local = new Map(p.questions.map((q) => [q.id, q]));
  return p.sections.flatMap((s) =>
    s.questionIds.map((id) => ({ section: s.id, question: (local.get(id) ?? questionById(id))! })).filter((x) => x.question),
  );
}
