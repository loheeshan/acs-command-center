import { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";


const Dashboard = lazy(() => import("@/features/dashboard/DashboardPage"));
const Roadmap = lazy(() => import("@/features/roadmap/RoadmapPage"));
const FastTrack = lazy(() => import("@/features/roadmap/FastTrackPage"));
const KnowledgeGraph = lazy(() => import("@/features/graph/KnowledgeGraphPage"));
const MasterCore = lazy(() => import("@/features/curriculum/MasterCorePage"));
const ModulePage = lazy(() => import("@/features/curriculum/ModulePage"));
const LessonPage = lazy(() => import("@/features/curriculum/LessonPage"));
const Academy = lazy(() => import("@/features/curriculum/AcademyPage"));
const VisualLab = lazy(() => import("@/features/visualizers/VisualLabPage"));
const VisualizerPage = lazy(() => import("@/features/visualizers/VisualizerPage"));
const Playground = lazy(() => import("@/features/playground/PlaygroundPage"));
const TopicLab = lazy(() => import("@/features/visualizers/TopicLabPage"));
const CampusLab = lazy(() => import("@/features/project-lab/CampusEventsLabPage"));
const QuizArena = lazy(() => import("@/features/quiz/QuizArenaPage"));
const Challenges = lazy(() => import("@/features/challenges/ChallengesPage"));
const ChallengePage = lazy(() => import("@/features/challenges/ChallengePage"));
const MockIct = lazy(() => import("@/features/exam/MockIctPage"));
const ExamSelect = lazy(() => import("@/features/exam/ExamSelectPage"));
const ExamSession = lazy(() => import("@/features/exam/ExamSessionPage"));
const Results = lazy(() => import("@/features/results/ResultsPage"));
const AttemptReview = lazy(() => import("@/features/results/AttemptReviewPage"));
const Coursework = lazy(() => import("@/features/coursework/CourseworkPage"));
const Revision = lazy(() => import("@/features/revision/RevisionPage"));
const LastMinute = lazy(() => import("@/features/revision/LastMinutePage"));
const Flashcards = lazy(() => import("@/features/revision/FlashcardsPage"));
const Notes = lazy(() => import("@/features/personal/NotesPage"));
const Saved = lazy(() => import("@/features/personal/SavedPage"));
const Progress = lazy(() => import("@/features/personal/ProgressPage"));
const Resources = lazy(() => import("@/features/personal/ResourcesPage"));
const Settings = lazy(() => import("@/features/personal/SettingsPage"));
const NotFound = lazy(() => import("@/features/personal/NotFoundPage"));

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Dashboard />} />
        <Route path="roadmap" element={<Roadmap />} />
        <Route path="fast-track" element={<FastTrack />} />
        <Route path="graph" element={<KnowledgeGraph />} />
        <Route path="learn" element={<MasterCore />} />
        <Route path="learn/:moduleId" element={<ModulePage />} />
        <Route path="lesson/:lessonId" element={<LessonPage />} />
        <Route path="academy" element={<Academy />} />
        <Route path="lab/visual" element={<VisualLab />} />
        <Route path="lab/visual/:vizId" element={<VisualizerPage />} />
        <Route path="lab/playground" element={<Playground />} />
        <Route path="lab/campus-events" element={<CampusLab />} />
        <Route path="lab/:topicLab" element={<TopicLab />} />
        <Route path="assess/quiz" element={<QuizArena />} />
        <Route path="assess/challenges" element={<Challenges />} />
        <Route path="assess/challenges/:challengeId" element={<ChallengePage />} />
        <Route path="assess/mock" element={<MockIct />} />
        <Route path="assess/exams" element={<ExamSelect />} />
        <Route path="assess/exam/:paperId" element={<ExamSession />} />
        <Route path="assess/results" element={<Results />} />
        <Route path="assess/results/:attemptId" element={<AttemptReview />} />
        <Route path="coursework/*" element={<Coursework />} />
        <Route path="revision" element={<Revision />} />
        <Route path="revision/last-minute" element={<LastMinute />} />
        <Route path="flashcards" element={<Flashcards />} />
        <Route path="notes" element={<Notes />} />
        <Route path="saved" element={<Saved />} />
        <Route path="progress" element={<Progress />} />
        <Route path="resources" element={<Resources />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
