import type { ModuleInfo, TopicId } from "./types";

export const MODULES: ModuleInfo[] = [
  { id: "m00-web", number: "00", title: "How the Web Works", topic: "web", priority: "P1", examCritical: false,
    description: "Internet vs Web, DNS, HTTP, client–server, rendering pipeline, SPA vs MPA, MVC, DTOs." },
  { id: "m01-html", number: "01", title: "HTML5 Fundamentals", topic: "html-css", priority: "P2", examCritical: false,
    description: "Semantic structure, forms, native validation, accessibility and the DOM." },
  { id: "m02-css", number: "02", title: "CSS, Responsive Design & Bootstrap", topic: "html-css", priority: "P1", examCritical: true,
    description: "Cascade, box model, Flexbox, Grid (template areas, minmax), clamp(), :focus-visible, Bootstrap grid." },
  { id: "m03-javascript", number: "03", title: "JavaScript Master Core", topic: "javascript", priority: "P0", examCritical: true,
    description: "Scope, closures, references, modern syntax, array methods, promises and the event loop." },
  { id: "m04-typescript", number: "04", title: "TypeScript Master Core", topic: "typescript", priority: "P0", examCritical: true,
    description: "Interfaces, type aliases, unions, narrowing, generics, utility types and typed API data." },
  { id: "m05-react", number: "05", title: "React Master Core", topic: "react", priority: "P0", examCritical: true,
    description: "Components, JSX, props, state snapshots, rendering, hooks, effects and custom hooks." },
  { id: "m06-router", number: "06", title: "React Router", topic: "router", priority: "P0", examCritical: true,
    description: "Routes, nested layouts, Outlet, dynamic params, query strings, programmatic navigation, guards." },
  { id: "m07-http-api", number: "07", title: "REST APIs & HTTP", topic: "http-api", priority: "P0", examCritical: true,
    description: "HTTP methods, status codes, fetch, response.ok, AbortController, services, CORS." },
  { id: "m08-forms-crud", number: "08", title: "Forms, Validation & CRUD", topic: "forms-crud", priority: "P0", examCritical: true,
    description: "Controlled inputs, validation functions, POST/PUT/DELETE workflows, Zod + React Hook Form." },
  { id: "m09-security", number: "09", title: "Authentication, JWT & Frontend Security", topic: "security", priority: "P0", examCritical: true,
    description: "Authentication vs authorisation, JWT anatomy, expiry, 401/403, trust boundaries, XSS, CSRF, HTTPS." },
  { id: "m10-tanstack-query", number: "10", title: "TanStack Query", topic: "tanstack-query", priority: "P0", examCritical: true,
    description: "Server state, query keys, staleTime vs gcTime, caching, mutations and invalidateQueries." },
  { id: "m11-zustand", number: "11", title: "Zustand", topic: "zustand", priority: "P0", examCritical: true,
    description: "Global client state, create(), set/get, generated hooks, selectors and persist." },
  { id: "m12-state-architecture", number: "12", title: "State Management Architecture", topic: "state-architecture", priority: "P0", examCritical: true,
    description: "Choosing local, shared client, server, URL, derived and form state." },
  { id: "m13-architecture", number: "13", title: "Application Development & Integration", topic: "architecture", priority: "P2", examCritical: false,
    description: "Vite, project structure, services/hooks/stores layering, search, filtering, pagination." },
  { id: "m14-perf-a11y-testing", number: "14", title: "Performance, Accessibility & Testing", topic: "testing", priority: "P2", examCritical: false,
    description: "Memoisation, code splitting, accessible UI, Vitest, React Testing Library and MSW." },
];

export const moduleById = (id: string) => MODULES.find((m) => m.id === id);
export const modulesByTopic = (t: TopicId) => MODULES.filter((m) => m.topic === t);

/** University Academy — follows the official roadmap order (5COSC026W RoadMap v1 26-27). */
export interface AcademyWeek {
  id: string;
  week: string;
  dateCommencing: string;
  lecture: string;
  tutorial: string;
  /** Status of the supplied material for this week. */
  materials: "supplied" | "partial" | "missing" | "none";
  materialNotes: string;
  /** Master Core lesson ids taught in this week (shared progress). */
  lessonIds: string[];
  assessment?: string;
}

export const ACADEMY: AcademyWeek[] = [
  { id: "T01", week: "T01", dateCommencing: "2026-09-24",
    lecture: "Lecture 1: How the Web works, Traditional vs Modern Web Applications (SPA), REST APIs & Backend Architecture",
    tutorial: "Tutorial 1: Backend API & React Setup",
    materials: "supplied", materialNotes: "Lecture 01 slides, Backend Events API, Postman Testing Guide.",
    lessonIds: ["web-how-the-web-works", "web-spa-vs-mpa", "web-mvc-dtos", "http-methods-status"],
    assessment: "Practical Web Application Project released" },
  { id: "T02", week: "T02", dateCommencing: "2026-10-01",
    lecture: "Lecture 2: Modern React & TypeScript",
    tutorial: "Tutorial 2: React Application Shell",
    materials: "supplied", materialNotes: "Lecture 02 slides, Week 02 tutorial guide, React-basic-examples, Advanced Examples (JS).",
    lessonIds: ["js-variables-scope", "js-closures", "js-arrow-this", "js-references-copies", "js-spread-rest-destructuring", "js-array-methods", "js-array-reduce", "ts-basics-interfaces", "ts-unions-narrowing", "ts-generics-utility", "react-components-jsx", "react-props", "react-state-events", "react-rendering-snapshots", "react-lists-keys", "react-conditional-rendering", "react-strictmode"] },
  { id: "T03", week: "T03", dateCommencing: "2026-10-08",
    lecture: "Lecture 3: Consuming REST APIs with React",
    tutorial: "Tutorial 3: Connecting React to ASP.NET Core",
    materials: "supplied", materialNotes: "Week03 lecture slides, campus-events-frontend (useEvents, eventService).",
    lessonIds: ["js-promises-async", "js-event-loop", "http-fetch-response-ok", "http-four-ui-states", "react-useeffect", "react-useref-context-reducer", "http-abortcontroller", "http-service-modules", "react-custom-hooks", "ts-typed-api-data", "http-cors"] },
  { id: "T04", week: "T04", dateCommencing: "2026-10-15",
    lecture: "Lecture 4: Routing & React Application Architecture (supplied files: HTML5/CSS3 + Bootstrap)",
    tutorial: "Tutorial 4: Multi-page React Application (supplied: Bootstrap online-shopping tutorial)",
    materials: "partial", materialNotes: "Supplied Lecture 04 PDFs cover HTML5, CSS3 and Bootstrap. Routing content is in the Week 05 deck.",
    lessonIds: ["css-box-model-cascade", "css-flexbox", "css-grid", "css-responsive-clamp", "css-bootstrap-grid", "html-semantic-forms", "router-basics", "router-nested-layouts-outlet"] },
  { id: "T05", week: "T05", dateCommencing: "2026-10-22",
    lecture: "Lecture 5: Forms, Validation & CRUD",
    tutorial: "Tutorial 5: CRUD Application",
    materials: "supplied", materialNotes: "Week05 Routing/Forms/Validation/CRUD deck, Campus Event Frontend guide.",
    lessonIds: ["router-dynamic-params", "router-navigation", "router-search-params", "forms-controlled-inputs", "forms-validation", "forms-zod-rhf", "crud-post-put-delete"],
    assessment: "Frontend development checkpoint" },
  { id: "T06", week: "T06", dateCommencing: "2026-10-29",
    lecture: "No classes — Engagement Week", tutorial: "Consolidation",
    materials: "none", materialNotes: "Coursework released (specification not included in the supplied archive).",
    lessonIds: [] },
  { id: "T07", week: "T07", dateCommencing: "2026-11-05",
    lecture: "Lecture 6: Authentication, JWT & Protected React Applications",
    tutorial: "Tutorial 6: Authenticated React Application",
    materials: "missing", materialNotes: "Lecture slides not supplied. Supplementary lessons built from the CampusEvents backend (AuthController, JWTService) and official docs.",
    lessonIds: ["sec-authn-authz", "sec-jwt-anatomy", "sec-401-403-expiry", "router-protected-routes", "sec-token-storage", "sec-trust-boundaries"] },
  { id: "T08", week: "T08", dateCommencing: "2026-11-12",
    lecture: "Lecture 7: Modern State Management", tutorial: "Tutorial 7: Professional State Management",
    materials: "missing", materialNotes: "Lecture slides not supplied. Supplementary lessons; Week 03 slide 28 previews the TanStack Query refactor.",
    lessonIds: ["state-kinds", "tq-server-state", "tq-usequery-keys", "tq-stale-gc", "tq-mutations-invalidation", "zustand-basics", "zustand-selectors", "zustand-persist", "tq-server-state"] },
  { id: "T09", week: "T09", dateCommencing: "2026-11-19",
    lecture: "Lecture 8: Responsive, Accessible & Modern UI Development", tutorial: "Tutorial 8: MOCK ICT",
    materials: "partial", materialNotes: "Mock ICT paper supplied. Lecture 8 slides not supplied.",
    lessonIds: ["css-responsive-clamp", "a11y-focus-keyboard"], assessment: "Mock ICT 19 Nov · ICT (40%) 25 Nov 2026, 15:30–17:30" },
  { id: "T10", week: "T10", dateCommencing: "2026-11-26",
    lecture: "Lecture 9: Advanced Client-side Features & Application Workflows", tutorial: "Tutorial 9: ICT",
    materials: "missing", materialNotes: "Not yet delivered. Supplementary lesson on search/filter/pagination.",
    lessonIds: ["arch-search-filter-pagination"], assessment: "Roadmap originally listed the ICT here (26 Nov); confirmed date is 25 Nov" },
  { id: "T11", week: "T11", dateCommencing: "2026-12-03",
    lecture: "Lecture 10: Professional React Development", tutorial: "Coursework consolidation",
    materials: "missing", materialNotes: "Not yet delivered.",
    lessonIds: ["arch-project-structure", "perf-memoization", "sec-xss-csrf-https"] },
  { id: "T12", week: "T12", dateCommencing: "2026-12-10",
    lecture: "Lecture 11: Frontend Testing with Vitest & React Testing Library", tutorial: "Testing & coursework support",
    materials: "missing", materialNotes: "Not yet delivered.",
    lessonIds: ["testing-vitest-rtl"] },
];
