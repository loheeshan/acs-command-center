import { Card, PageHeader, Badge } from "@/components/ui/primitives";
import { ExternalLink } from "lucide-react";

const UNI = [
  ["Lecture 01 — How the Web Works, SPA, REST & Backend Architecture", "pptx"],
  ["Lecture 02 — Modern React & TypeScript", "pptx"],
  ["Week 03 — Consuming REST APIs with React", "pptx"],
  ["Lecture 04 — HTML5 & CSS3; Bootstrap parts 1–3", "pdf"],
  ["Week 05 — Routing, Forms, Validation & CRUD", "pptx"],
  ["Week 02 React Application Shell tutorial; Campus Event Frontend guide; Postman testing guide; Bootstrap tutorial", "docx/pdf"],
  ["CampusEvents.Api backend (ASP.NET Core, EF Core, SQLite, JWT) and campus-events-frontend", "code"],
  ["MOCK ICT paper; 5COSC026W roadmap 2026/27", "docx/pdf"],
];
const DOCS = [
  ["MDN Web Docs", "https://developer.mozilla.org/"],
  ["React", "https://react.dev/"],
  ["React Router", "https://reactrouter.com/"],
  ["TypeScript Handbook", "https://www.typescriptlang.org/docs/"],
  ["TanStack Query", "https://tanstack.com/query/latest"],
  ["Zustand", "https://zustand.docs.pmnd.rs/"],
  ["OWASP Cheat Sheet Series", "https://cheatsheetseries.owasp.org/"],
  ["W3C Web Accessibility Initiative", "https://www.w3.org/WAI/"],
  ["Vitest", "https://vitest.dev/"],
  ["Testing Library", "https://testing-library.com/"],
  ["Bootstrap", "https://getbootstrap.com/"],
];

export default function ResourcesPage() {
  return (
    <div>
      <PageHeader eyebrow="Personal" title="Resources" description="Where the content comes from. University files are referenced, never modified. Full analysis lives in the project's docs/ folder (source-inventory, lecture-analysis, curriculum-map, exam-topic-matrix, knowledge-gaps)." />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-4">
          <h2 className="mb-2 text-sm font-semibold">Supplied university material</h2>
          <ul className="space-y-1.5 text-sm text-fg-2">{UNI.map(([t, k]) => <li key={t} className="flex justify-between gap-2"><span>{t}</span><Badge>{k}</Badge></li>)}</ul>
          <p className="mt-3 text-xs text-warn">Not supplied: Lecture 6 (Auth/JWT), Lecture 7 (State Management), Lectures 8–11 and the coursework specification. Lessons on those topics are labelled "Supplementary".</p>
        </Card>
        <Card className="p-4">
          <h2 className="mb-2 text-sm font-semibold">Official documentation</h2>
          <ul className="space-y-1.5 text-sm">{DOCS.map(([t, u]) => <li key={u}><a href={u} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-1 text-primary hover:underline">{t} <ExternalLink size={11} /></a></li>)}</ul>
        </Card>
      </div>
    </div>
  );
}
