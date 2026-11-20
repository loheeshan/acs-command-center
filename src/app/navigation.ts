import {
  LayoutDashboard, CalendarClock, Network, BookOpen, GraduationCap, Globe, Palette, Braces, FileType2, Atom, Route,
  ServerCog, FormInput, ShieldCheck, DatabaseZap, Boxes, Layers, FlaskConical, Eye, Code2, Send, Lock, Workflow,
  CalendarDays, ListChecks, Puzzle, FileCheck2, Timer, BarChart3, Briefcase, ClipboardList, Map, Repeat, StickyNote,
  Bookmark, TrendingUp, Library, Settings, Zap, Rocket, type LucideIcon,
} from "lucide-react";

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  keywords?: string;
}
export interface NavGroup {
  id: string;
  label: string;
  items: NavItem[];
}

export const NAV: NavGroup[] = [
  { id: "command", label: "Command", items: [
    { to: "/", label: "Dashboard", icon: LayoutDashboard },
    { to: "/fast-track", label: "ICT Fast Track", icon: Rocket, keywords: "exam timeline fastest countdown ict" },
    { to: "/roadmap", label: "Study Roadmap", icon: CalendarClock, keywords: "plan schedule ict" },
    { to: "/graph", label: "Knowledge Graph", icon: Network, keywords: "prerequisites map" },
  ]},
  { id: "learning", label: "Learning", items: [
    { to: "/learn", label: "Master Core", icon: BookOpen, keywords: "modules curriculum" },
    { to: "/academy", label: "University Academy", icon: GraduationCap, keywords: "weeks lectures roadmap" },
    { to: "/learn/m00-web", label: "Web Fundamentals", icon: Globe },
    { to: "/learn/m02-css", label: "HTML & CSS", icon: Palette, keywords: "grid flexbox bootstrap clamp" },
    { to: "/learn/m03-javascript", label: "JavaScript", icon: Braces, keywords: "reduce promises event loop" },
    { to: "/learn/m04-typescript", label: "TypeScript", icon: FileType2, keywords: "interface union" },
    { to: "/learn/m05-react", label: "React", icon: Atom, keywords: "hooks state effect" },
    { to: "/learn/m06-router", label: "React Router", icon: Route, keywords: "outlet useParams navigate" },
    { to: "/learn/m07-http-api", label: "REST APIs", icon: ServerCog, keywords: "fetch http status" },
    { to: "/learn/m08-forms-crud", label: "Forms & CRUD", icon: FormInput, keywords: "validation post put delete" },
    { to: "/learn/m09-security", label: "Auth & Security", icon: ShieldCheck, keywords: "jwt 401 403 xss" },
    { to: "/learn/m10-tanstack-query", label: "TanStack Query", icon: DatabaseZap, keywords: "staletime invalidate cache" },
    { to: "/learn/m11-zustand", label: "Zustand", icon: Boxes, keywords: "store selector" },
    { to: "/learn/m13-architecture", label: "App Architecture", icon: Layers },
    { to: "/learn/m14-perf-a11y-testing", label: "Testing", icon: FlaskConical, keywords: "vitest rtl" },
  ]},
  { id: "lab", label: "Laboratory", items: [
    { to: "/lab/visual", label: "Visual Lab", icon: Eye, keywords: "visualizer simulator" },
    { to: "/lab/playground", label: "Code Playground", icon: Code2, keywords: "editor run sandbox" },
    { to: "/lab/api", label: "API Lab", icon: Send, keywords: "http request postman" },
    { to: "/lab/security", label: "Security Lab", icon: Lock, keywords: "jwt auth" },
    { to: "/lab/state", label: "State Management Lab", icon: Workflow, keywords: "zustand query cache" },
    { to: "/lab/campus-events", label: "CampusEvents Lab", icon: CalendarDays, keywords: "project stages" },
  ]},
  { id: "assessment", label: "Assessment", items: [
    { to: "/assess/quiz", label: "Quiz Arena", icon: ListChecks },
    { to: "/assess/challenges", label: "Programming Challenges", icon: Puzzle, keywords: "coding tests" },
    { to: "/assess/mock", label: "Mock ICT", icon: FileCheck2, keywords: "original paper" },
    { to: "/assess/exams", label: "Exam Simulator", icon: Timer, keywords: "timed full mock" },
    { to: "/assess/results", label: "Results & Analysis", icon: BarChart3, keywords: "scores weak topics" },
  ]},
  { id: "coursework", label: "Coursework", items: [
    { to: "/coursework", label: "Coursework Workspace", icon: Briefcase },
    { to: "/coursework/requirements", label: "Requirements Tracker", icon: ClipboardList },
    { to: "/coursework/planner", label: "Application Planner", icon: Map },
  ]},
  { id: "personal", label: "Personal", items: [
    { to: "/revision", label: "Revision Center", icon: Repeat, keywords: "cheat sheet" },
    { to: "/revision/last-minute", label: "Last-minute ICT", icon: Zap },
    { to: "/flashcards", label: "Flashcards", icon: Library, keywords: "spaced repetition" },
    { to: "/notes", label: "Notes", icon: StickyNote },
    { to: "/saved", label: "Saved Examples", icon: Bookmark },
    { to: "/progress", label: "Progress", icon: TrendingUp, keywords: "export import" },
    { to: "/resources", label: "Resources", icon: BookOpen, keywords: "sources docs" },
    { to: "/settings", label: "Settings", icon: Settings, keywords: "theme exam time" },
  ]},
];
