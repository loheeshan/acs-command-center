export interface LabStage {
  /** "stage-01" … "stage-08" */
  id: string;
  number: number;
  title: string;
  /** Week / source this stage is based on, e.g. "Week 02 tutorial guide". */
  basedOn: string;
  sourceKind: "university" | "supplementary";
  summary: string;
  objectives: string[];
  /** ```text ASCII architecture diagram + notes (markdown). */
  architecture: string;
  /** Guided implementation steps (markdown each). */
  steps: { title: string; body: string }[];
  /** Practice TODOs the learner completes in the starter project. */
  todos: string[];
  /** What the finished stage should do (markdown bullets). */
  expectedBehavior: string;
  mistakes: { mistake: string; fix: string }[];
  /** Runnable in the sandbox playground (mock CampusEvents API at /api/*). */
  starter: { files: Record<string, string>; entry: string; open: string };
  reference: { files: Record<string, string>; entry: string; open: string };
  /** Short knowledge-check Q&A. */
  knowledgeCheck: { question: string; answer: string }[];
  /** Related lesson ids. */
  lessons: string[];
}
