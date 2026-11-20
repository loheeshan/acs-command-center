import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AnswerValue = number | boolean | string;

export interface ExamSession {
  sessionId: string;
  paperId: string;
  mode: "timed" | "untimed";
  /** Epoch ms when the attempt started. */
  startedAt: number;
  /** Absolute deadline (epoch ms) — survives refresh because remaining time is derived from it. */
  deadline: number | null;
  answers: Record<string, AnswerValue>;
  flags: Record<string, boolean>;
  currentIndex: number;
  /** For generated papers (weak-topic, security-only, …) the question list is frozen here so it survives refresh. */
  generated?: GeneratedPaper;
  submittedAt?: number;
  timedOut?: boolean;
  /** Self-assessed rubric marks: questionId → rubric index → marks. */
  selfMarks: Record<string, Record<number, number>>;
}

export interface GeneratedPaper {
  title: string;
  description: string;
  sections: { id: string; title: string; questionIds: string[] }[];
}

interface ExamSessionState {
  session: ExamSession | null;
  start: (paperId: string, minutes: number | null, generated?: GeneratedPaper) => void;
  submit: (timedOut?: boolean) => void;
  setSelfMark: (questionId: string, rubricIndex: number, marks: number) => void;
  answer: (questionId: string, value: AnswerValue) => void;
  clearAnswer: (questionId: string) => void;
  toggleFlag: (questionId: string) => void;
  goTo: (index: number) => void;
  end: () => void;
}

/** In-progress exam attempt, persisted so a refresh never resets the timer or answers. */
export const useExamSessionStore = create<ExamSessionState>()(
  persist(
    (set) => ({
      session: null,
      start: (paperId, minutes, generated) => {
        const now = Date.now();
        set({
          session: {
            sessionId: `${paperId}-${now}`,
            paperId,
            mode: minutes ? "timed" : "untimed",
            startedAt: now,
            deadline: minutes ? now + minutes * 60_000 : null,
            answers: {},
            flags: {},
            currentIndex: 0,
            generated,
            selfMarks: {},
          },
        });
      },
      answer: (questionId, value) =>
        set((s) => (s.session ? { session: { ...s.session, answers: { ...s.session.answers, [questionId]: value } } } : s)),
      clearAnswer: (questionId) =>
        set((s) => {
          if (!s.session) return s;
          const answers = { ...s.session.answers };
          delete answers[questionId];
          return { session: { ...s.session, answers } };
        }),
      toggleFlag: (questionId) =>
        set((s) =>
          s.session ? { session: { ...s.session, flags: { ...s.session.flags, [questionId]: !s.session.flags[questionId] } } } : s,
        ),
      goTo: (currentIndex) => set((s) => (s.session ? { session: { ...s.session, currentIndex } } : s)),
      submit: (timedOut = false) =>
        set((s) => (s.session && !s.session.submittedAt ? { session: { ...s.session, submittedAt: Date.now(), timedOut } } : s)),
      setSelfMark: (questionId, rubricIndex, marks) =>
        set((s) =>
          s.session
            ? { session: { ...s.session, selfMarks: { ...s.session.selfMarks, [questionId]: { ...s.session.selfMarks[questionId], [rubricIndex]: marks } } } }
            : s,
        ),
      end: () => set({ session: null }),
    }),
    { name: "acs-exam-session", version: 1 },
  ),
);
