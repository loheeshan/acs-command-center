/**
 * ACS Command Center — content schema.
 *
 * Every lesson, question, exam, challenge and flashcard is plain typed data.
 * All "markdown" fields are rendered with GitHub-flavoured markdown
 * (fenced code blocks with a language tag are syntax highlighted).
 */

/** Topic identifiers used for analytics, filtering and weak-topic tracking. */
export type TopicId =
  | "web"
  | "html-css"
  | "javascript"
  | "typescript"
  | "react"
  | "router"
  | "http-api"
  | "forms-crud"
  | "tanstack-query"
  | "zustand"
  | "state-architecture"
  | "security"
  | "architecture"
  | "testing";

export const TOPIC_LABELS: Record<TopicId, string> = {
  web: "How the Web Works",
  "html-css": "HTML & CSS",
  javascript: "JavaScript",
  typescript: "TypeScript",
  react: "React",
  router: "React Router",
  "http-api": "REST APIs & HTTP",
  "forms-crud": "Forms & CRUD",
  "tanstack-query": "TanStack Query",
  zustand: "Zustand",
  "state-architecture": "State Architecture",
  security: "Auth & Security",
  architecture: "App Architecture",
  testing: "Testing",
};

/**
 * Where a piece of content comes from. Content must never claim to be
 * university material unless it actually is.
 */
export type SourceKind =
  | "university" // lecture / tutorial / project supplied by the module
  | "mock" // the supplied MOCK ICT paper
  | "supplementary" // our own explanation filling a gap
  | "best-practice" // professional practice beyond the lecture
  | "optional"; // advanced / optional extension

export interface SourceRef {
  kind: SourceKind;
  /** e.g. "Week 03 Lecture — Consuming REST APIs" */
  label: string;
  /** e.g. "Slides 12, 22–25" or "src/hooks/useEvents.ts" */
  detail?: string;
  /** Official docs URL for supplementary content (MDN, react.dev, ...). Only real URLs. */
  url?: string;
}

export type Priority = "P0" | "P1" | "P2";
export type Difficulty = "beginner" | "intermediate" | "advanced" | "exam";
export type CodeLanguage = "js" | "ts" | "jsx" | "tsx" | "html" | "css" | "json" | "http" | "bash" | "text";

export interface CodeSample {
  title?: string;
  language: CodeLanguage;
  code: string;
  /** Line-by-line explanation. `lines` is "3" or "3-5" (1-based). */
  walkthrough?: { lines: string; text: string }[];
}

export interface Lesson {
  /** kebab-case, globally unique, e.g. "js-array-reduce" */
  id: string;
  moduleId: ModuleId;
  title: string;
  /** One-sentence summary shown on cards. */
  summary: string;
  priority: Priority;
  examCritical?: boolean;
  /** Approximate study minutes. */
  minutes: number;
  objectives: string[];
  /** Lesson ids that should be understood first. */
  prerequisites: string[];
  sources: SourceRef[];

  /** WHY — what problem does this solve (markdown). */
  why: string;
  /** Beginner-friendly analogy (markdown). Must not be technically misleading. */
  analogy: string;
  /** Three explanation depths of the SAME concept (markdown each). */
  explain: { beginner: string; developer: string; deep: string };
  /** Internal mechanism diagram — usually an ```text fenced ASCII diagram plus notes (markdown). */
  mechanism: string;
  simpleExample: CodeSample;
  realExample: CodeSample;
  mistakes: { mistake: string; fix: string }[];
  debug: {
    prompt: string;
    language: CodeLanguage;
    buggyCode: string;
    hint: string;
    fixedCode: string;
    explanation: string;
  };
  challenge: {
    prompt: string;
    starterCode?: string;
    language: CodeLanguage;
    hints: string[];
    solution: string;
    explanation: string;
  };
  /** Short exam-style Q&A pairs embedded in the lesson (markdown). */
  examQuestions: { question: string; answer: string; marks?: number }[];
  /** Bullet revision summary. */
  revision: string[];
  /** Ids from the visualizer registry, e.g. "event-loop". */
  visualizers?: string[];
  /** Id of a playground preset, e.g. "react-counter". */
  playground?: string;
}

export type ModuleId =
  | "m00-web"
  | "m01-html"
  | "m02-css"
  | "m03-javascript"
  | "m04-typescript"
  | "m05-react"
  | "m06-router"
  | "m07-http-api"
  | "m08-forms-crud"
  | "m09-security"
  | "m10-tanstack-query"
  | "m11-zustand"
  | "m12-state-architecture"
  | "m13-architecture"
  | "m14-perf-a11y-testing";

export interface ModuleInfo {
  id: ModuleId;
  number: string;
  title: string;
  topic: TopicId;
  priority: Priority;
  examCritical: boolean;
  description: string;
}

/* ------------------------------------------------------------------ */
/* Questions                                                           */
/* ------------------------------------------------------------------ */

export type QuestionType = "mcq" | "tf" | "short" | "code";

interface QuestionBase {
  /** Globally unique, e.g. "js-mcq-001", "mock-orig-A1" */
  id: string;
  type: QuestionType;
  topic: TopicId;
  subtopic: string;
  difficulty: Difficulty;
  marks: number;
  /** Estimated minutes. */
  minutes: number;
  /** Question text (markdown, may include fenced code). */
  prompt: string;
  /** Why the correct answer is correct (markdown). */
  explanation: string;
  /** Lesson id to revise. */
  lessonId?: string;
  source: "original-mock" | "practice" | "university-derived";
  /** Short label for the most common misconception tested. */
  misconception?: string;
}

export interface McqQuestion extends QuestionBase {
  type: "mcq";
  options: string[];
  /** Index into options. */
  answer: number;
  /** Why each wrong option is wrong, keyed by option index. */
  distractorNotes?: Record<number, string>;
}

export interface TrueFalseQuestion extends QuestionBase {
  type: "tf";
  answer: boolean;
}

export interface RubricItem {
  criterion: string;
  marks: number;
}

/**
 * Short-answer and code questions are marked by guided self-assessment
 * against a rubric (clearly labelled in the UI). Optional `autoCheck`
 * provides executable tests for code that can be run in the sandbox.
 */
export interface ShortQuestion extends QuestionBase {
  type: "short";
  rubric: RubricItem[];
  modelAnswer: string;
}

export interface CodeQuestion extends QuestionBase {
  type: "code";
  language: CodeLanguage;
  starterCode?: string;
  rubric: RubricItem[];
  modelAnswer: string;
}

export type Question = McqQuestion | TrueFalseQuestion | ShortQuestion | CodeQuestion;

/* ------------------------------------------------------------------ */
/* Exams                                                               */
/* ------------------------------------------------------------------ */

export interface ExamSection {
  id: "A" | "B" | "C" | "D" | "E";
  title: string;
  instructions: string;
  suggestedMinutes: number;
  questionIds: string[];
}

export interface ExamPaper {
  id: string;
  title: string;
  description: string;
  kind: "original-mock" | "practice-mock" | "topic-practice";
  difficulty: Difficulty | "mixed";
  durationMinutes: number;
  rafExtraMinutes: number;
  totalMarks: number;
  instructions: string[];
  sections: ExamSection[];
  /** Questions owned by this paper (others may be referenced from the bank by id). */
  questions: Question[];
}

/* ------------------------------------------------------------------ */
/* Coding challenges (auto-graded in an isolated Web Worker)           */
/* ------------------------------------------------------------------ */

export interface ChallengeTest {
  name: string;
  /**
   * JavaScript test body. Runs AFTER the learner's code in the same scope.
   * Use `assertEqual(actual, expected, message?)` (deep equality),
   * `assert(condition, message?)` and `await` is allowed.
   */
  code: string;
  hidden?: boolean;
}

export interface Challenge {
  id: string;
  topic: TopicId;
  title: string;
  difficulty: Difficulty;
  scenario: string;
  requirements: string[];
  /** "js" or "ts" (ts is transpiled; types are erased before running). */
  language: "js" | "ts";
  starterCode: string;
  examples?: string;
  tests: ChallengeTest[];
  hints: string[];
  solution: string;
  explanation: string;
  lessonId?: string;
}

/* ------------------------------------------------------------------ */
/* Flashcards                                                          */
/* ------------------------------------------------------------------ */

export interface Flashcard {
  id: string;
  topic: TopicId;
  front: string;
  back: string;
  code?: string;
  lessonId?: string;
  /** Included in last-minute ICT mode. */
  highPriority?: boolean;
}
