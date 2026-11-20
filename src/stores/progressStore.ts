import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { TopicId } from "@/content/types";

export interface QuestionResult {
  questionId: string;
  topic: TopicId;
  section?: string;
  marksAwarded: number;
  marksAvailable: number;
  /** true/false for objective questions; null when unanswered. */
  correct: boolean | null;
  /** Marks came from guided self-assessment against a rubric. */
  selfAssessed: boolean;
}

export interface AttemptRecord {
  id: string;
  kind: "quiz" | "exam";
  paperId?: string;
  title: string;
  startedAt: number;
  finishedAt: number;
  /** Seconds actually spent. */
  durationSec: number;
  timedOut?: boolean;
  results: QuestionResult[];
  /** Answers given, for review. */
  answers: Record<string, unknown>;
}

export interface ChallengeRecord {
  passed: boolean;
  attempts: number;
  bestPassed: number;
  total: number;
  lastRunAt: number;
  solutionRevealed?: boolean;
}

export interface FlashcardState {
  /** SM-2 style ease factor. */
  ease: number;
  /** Interval in days. */
  interval: number;
  reps: number;
  /** Epoch ms when due. */
  due: number;
  status?: "understood" | "revise";
}

export interface CourseworkRequirement {
  id: string;
  text: string;
  /** Where in the spec it comes from, e.g. "Spec §2.1". */
  source: string;
  status: "todo" | "in-progress" | "done";
}

export interface Note {
  id: string;
  title: string;
  body: string;
  lessonId?: string;
  updatedAt: number;
}

export interface SavedSnippet {
  id: string;
  title: string;
  language: string;
  code: string;
  updatedAt: number;
}

interface ProgressState {
  completedLessons: Record<string, number>;
  lessonVisits: Record<string, number>;
  lastLessonId?: string;
  completedVisualizers: Record<string, number>;
  attempts: AttemptRecord[];
  challenges: Record<string, ChallengeRecord>;
  challengeCode: Record<string, string>;
  flashcards: Record<string, FlashcardState>;
  confidence: Partial<Record<TopicId, number>>;
  notes: Note[];
  snippets: SavedSnippet[];
  /** Hours available per ISO date (YYYY-MM-DD). */
  studyAvailability: Record<string, number>;
  studyTasksDone: Record<string, boolean>;
  /** Local datetime string "YYYY-MM-DDTHH:mm" (Asia/Colombo). Undefined until the learner sets it. */
  ictStartTime?: string;
  checklist: Record<string, boolean>;
  /** Requirements the learner copied from the official coursework specification. */
  requirements: CourseworkRequirement[];
  /** Free-form planner text per planner section. */
  planner: Record<string, string>;

  markLessonComplete: (id: string, done?: boolean) => void;
  visitLesson: (id: string) => void;
  markVisualizer: (id: string) => void;
  addAttempt: (a: AttemptRecord) => void;
  deleteAttempt: (id: string) => void;
  recordChallenge: (id: string, passed: number, total: number) => void;
  revealChallenge: (id: string) => void;
  saveChallengeCode: (id: string, code: string) => void;
  rateFlashcard: (id: string, quality: 0 | 3 | 4 | 5) => void;
  setFlashcardStatus: (id: string, status: "understood" | "revise") => void;
  setConfidence: (topic: TopicId, value: number) => void;
  upsertNote: (n: Note) => void;
  deleteNote: (id: string) => void;
  saveSnippet: (s: SavedSnippet) => void;
  deleteSnippet: (id: string) => void;
  setAvailability: (date: string, hours: number) => void;
  toggleStudyTask: (id: string) => void;
  setIctStartTime: (v: string | undefined) => void;
  toggleChecklist: (id: string) => void;
  upsertRequirement: (r: CourseworkRequirement) => void;
  deleteRequirement: (id: string) => void;
  setPlanner: (key: string, value: string) => void;
  importState: (data: Partial<ProgressData>) => void;
  reset: () => void;
}

type DataKeys = Exclude<{ [K in keyof ProgressState]-?: ProgressState[K] extends (...args: never[]) => unknown ? never : K }[keyof ProgressState], undefined>;
export type ProgressData = Pick<ProgressState, DataKeys>;

const initial = {
  completedLessons: {},
  lessonVisits: {},
  lastLessonId: undefined,
  completedVisualizers: {},
  attempts: [],
  challenges: {},
  challengeCode: {},
  flashcards: {},
  confidence: {},
  notes: [],
  snippets: [],
  studyAvailability: {},
  studyTasksDone: {},
  ictStartTime: undefined,
  checklist: {},
  requirements: [],
  planner: {},
} satisfies Partial<ProgressState>;

const DAY = 24 * 60 * 60 * 1000;

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      ...initial,
      markLessonComplete: (id, done = true) =>
        set((s) => {
          const completedLessons = { ...s.completedLessons };
          if (done) completedLessons[id] = Date.now();
          else delete completedLessons[id];
          return { completedLessons };
        }),
      visitLesson: (id) => set((s) => ({ lastLessonId: id, lessonVisits: { ...s.lessonVisits, [id]: Date.now() } })),
      markVisualizer: (id) => set((s) => ({ completedVisualizers: { ...s.completedVisualizers, [id]: Date.now() } })),
      addAttempt: (a) => set((s) => ({ attempts: [...s.attempts, a] })),
      deleteAttempt: (id) => set((s) => ({ attempts: s.attempts.filter((a) => a.id !== id) })),
      recordChallenge: (id, passed, total) =>
        set((s) => {
          const prev = s.challenges[id];
          return {
            challenges: {
              ...s.challenges,
              [id]: {
                passed: (prev?.passed ?? false) || passed === total,
                attempts: (prev?.attempts ?? 0) + 1,
                bestPassed: Math.max(prev?.bestPassed ?? 0, passed),
                total,
                lastRunAt: Date.now(),
                solutionRevealed: prev?.solutionRevealed,
              },
            },
          };
        }),
      revealChallenge: (id) =>
        set((s) => ({
          challenges: {
            ...s.challenges,
            [id]: { ...(s.challenges[id] ?? { passed: false, attempts: 0, bestPassed: 0, total: 0, lastRunAt: Date.now() }), solutionRevealed: true },
          },
        })),
      saveChallengeCode: (id, code) => set((s) => ({ challengeCode: { ...s.challengeCode, [id]: code } })),
      rateFlashcard: (id, quality) =>
        set((s) => {
          const prev = s.flashcards[id] ?? { ease: 2.5, interval: 0, reps: 0, due: 0 };
          let { ease, interval, reps } = prev;
          if (quality < 3) {
            reps = 0;
            interval = 0; // see again this session / today
          } else {
            reps += 1;
            interval = reps === 1 ? 1 : reps === 2 ? 3 : Math.round(interval * ease);
            ease = Math.max(1.3, ease + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));
          }
          const due = quality < 3 ? Date.now() + 10 * 60 * 1000 : Date.now() + interval * DAY;
          return { flashcards: { ...s.flashcards, [id]: { ...prev, ease, interval, reps, due } } };
        }),
      setFlashcardStatus: (id, status) =>
        set((s) => ({
          flashcards: { ...s.flashcards, [id]: { ...(s.flashcards[id] ?? { ease: 2.5, interval: 0, reps: 0, due: 0 }), status } },
        })),
      setConfidence: (topic, value) => set((s) => ({ confidence: { ...s.confidence, [topic]: value } })),
      upsertNote: (n) => set((s) => ({ notes: [n, ...s.notes.filter((x) => x.id !== n.id)] })),
      deleteNote: (id) => set((s) => ({ notes: s.notes.filter((n) => n.id !== id) })),
      saveSnippet: (sn) => set((s) => ({ snippets: [sn, ...s.snippets.filter((x) => x.id !== sn.id)] })),
      deleteSnippet: (id) => set((s) => ({ snippets: s.snippets.filter((n) => n.id !== id) })),
      setAvailability: (date, hours) => set((s) => ({ studyAvailability: { ...s.studyAvailability, [date]: hours } })),
      toggleStudyTask: (id) => set((s) => ({ studyTasksDone: { ...s.studyTasksDone, [id]: !s.studyTasksDone[id] } })),
      setIctStartTime: (ictStartTime) => set({ ictStartTime }),
      toggleChecklist: (id) => set((s) => ({ checklist: { ...s.checklist, [id]: !s.checklist[id] } })),
      upsertRequirement: (r) =>
        set((s) => ({ requirements: s.requirements.some((x) => x.id === r.id) ? s.requirements.map((x) => (x.id === r.id ? r : x)) : [...s.requirements, r] })),
      deleteRequirement: (id) => set((s) => ({ requirements: s.requirements.filter((r) => r.id !== id) })),
      setPlanner: (key, value) => set((s) => ({ planner: { ...s.planner, [key]: value } })),
      importState: (data) => set(() => ({ ...initial, ...data })),
      reset: () => set(() => ({ ...initial })),
    }),
    { name: "acs-progress", version: 1 },
  ),
);

/** Plain-data snapshot of the progress store (actions removed) for export. */
export function exportProgress(): Record<string, unknown> {
  const state = useProgressStore.getState() as unknown as Record<string, unknown>;
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(state)) if (typeof v !== "function") out[k] = v;
  return out;
}
