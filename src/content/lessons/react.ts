import type { Lesson, SourceRef } from "../types";

/**
 * Module 05 — React fundamentals (React 19 + TypeScript strict).
 * Markdown fences are built with the T constant to avoid escaping backticks.
 */
const T = "```";

const L02 = (detail: string): SourceRef => ({
  kind: "university",
  label: "Lecture 02 — Modern React & TypeScript",
  detail,
});
const W03 = (detail: string): SourceRef => ({
  kind: "university",
  label: "Week 03 Lecture — Consuming REST APIs with React",
  detail,
});
const W02 = (detail: string): SourceRef => ({
  kind: "university",
  label: "Week 02 Tutorial Guide — React Application Shell",
  detail,
});
const GUIDE = (detail: string): SourceRef => ({
  kind: "university",
  label: "Campus Event Frontend guide (Week 05 extension)",
  detail,
});
const PROJECT = (detail: string): SourceRef => ({
  kind: "university",
  label: "Supplied project — campus-events-frontend",
  detail,
});
const BASIC = (detail: string): SourceRef => ({
  kind: "university",
  label: "Supplied React-basic-examples",
  detail,
});
const MOCK = (detail: string): SourceRef => ({
  kind: "mock",
  label: "MOCK ICT paper",
  detail,
});
const DOCS = (label: string, url: string, kind: "supplementary" | "best-practice" = "supplementary"): SourceRef => ({
  kind,
  label,
  url,
});

export const reactLessons: Lesson[] = [
  /* ================================================================== */
  /* 1. Components & JSX                                                 */
  /* ================================================================== */
  {
    id: "react-components-jsx",
    moduleId: "m05-react",
    title: "Components & JSX",
    summary:
      "React builds UI from small functions (components) that return JSX — a syntax that compiles to plain jsx() calls describing what the screen should look like.",
    priority: "P0",
    examCritical: true,
    minutes: 35,
    objectives: [
      "Explain the difference between imperative DOM manipulation and React's declarative model.",
      "Write a function component in TypeScript that returns JSX.",
      "Describe what JSX compiles to with the React 17+ automatic runtime (jsx() calls from react/jsx-runtime).",
      "Use {} expressions, className and fragments correctly inside JSX.",
      "Compose an application from smaller components (App → Navbar / Events / Footer).",
    ],
    prerequisites: ["ts-basics-interfaces", "js-array-methods"],
    sources: [
      L02("Slides 3–9 (What is React, SPA, components, component-based architecture, JSX, JSX expressions)"),
      W02("Steps 3–5 — App.tsx, Navbar, Footer, page components"),
      PROJECT("src/App.tsx, src/components/Navbar.tsx, src/components/Footer.tsx"),
      BASIC("example-components-and-JSX.html (Greeting component)"),
      DOCS("react.dev — Writing Markup with JSX", "https://react.dev/learn/writing-markup-with-jsx"),
      DOCS(
        "React blog — Introducing the New JSX Transform",
        "https://legacy.reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html",
      ),
    ],
    why: `Building a UI with raw DOM calls means writing **step-by-step instructions**: find the element, create a node, set its text, append it, remember to remove the old one later. As soon as data changes in several places, it becomes very easy for the screen and the data to disagree.

React flips this around. You write a function that says **"given this data, the UI looks like this"**, and React works out which DOM changes are needed. Components let you split a big page (the CampusEvents app) into small, named, reusable pieces — \`Navbar\`, \`Events\`, \`EventCard\`, \`Footer\` — each of which can be understood, tested and reused on its own.

JSX is the syntax that makes those descriptions readable. Understanding that JSX is *just JavaScript* (it compiles to function calls) explains almost every JSX rule you will meet: why it's \`className\` not \`class\`, why you can only put **expressions** inside \`{}\`, and why a component must return a single root.`,
    analogy: `Think of a component as a **recipe card** and JSX as the recipe written in a friendly format. You don't cook the meal yourself step by step on the stove (imperative DOM); you hand the kitchen (React) a card that says "a plate with a title, a list of three events and a footer". The kitchen compares the new card with what is already on the table and only swaps what is different.

Composition is like building a menu out of recipe cards: the "Dinner" card (App) just says "starter card, main card, dessert card" (Navbar, Events, Footer). The analogy has a limit: a real recipe is followed once, whereas React re-reads the card every time the data changes.`,
    explain: {
      beginner: `**React** is a JavaScript library for building user interfaces. Instead of writing one huge HTML page, you build small pieces called **components**.

A component in modern React is simply a **function that returns JSX**:

${T}tsx
function Footer() {
  return (
    <footer>
      <p>CampusEvents</p>
    </footer>
  );
}
${T}

**JSX** looks like HTML but lives inside your TypeScript file. A few rules follow from the fact that it is really JavaScript:

- Component names start with a **capital letter** (\`<Footer />\`), otherwise React treats them as HTML tags.
- Use \`className\` instead of \`class\` (because \`class\` is a JavaScript keyword).
- Put JavaScript **expressions** inside curly braces: \`<h1>Welcome, {name}</h1>\`.
- A component returns **one** root element. If you don't want an extra \`<div>\`, wrap siblings in a **fragment** \`<>...</>\`.
- Every tag must be closed: \`<img />\`, \`<br />\`.

You then **compose** components: \`App\` renders \`<Navbar />\`, \`<Events />\` and \`<Footer />\` — exactly how the supplied CampusEvents \`App.tsx\` is built. This is what Lecture 02 calls *component-based architecture*: the application becomes a tree of smaller components.`,
      developer: `With Vite's React + TypeScript template, \`tsconfig\` uses \`"jsx": "react-jsx"\` — the **automatic runtime** introduced in React 17. Each JSX element is compiled to a call imported automatically from \`react/jsx-runtime\`, so you no longer need \`import React from "react"\` at the top of each file:

${T}tsx
// You write
const el = <h1 className="title">Hi {name}</h1>;

// Compiler emits (roughly)
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const el = _jsxs("h1", { className: "title", children: ["Hi ", name] });
${T}

\`jsx()\` returns a **React element**: a plain, immutable object like \`{ type: "h1", props: {...}, key: null }\`. It is a *description*, not a DOM node. Lower-case types become host elements (\`"h1"\`); capitalised identifiers are passed as references (\`_jsx(Navbar, {})\`), which is why component names must be capitalised.

Inside \`{}\` you may use any **expression** (variables, calls, ternaries, \`.map()\`), but not statements (\`if\`, \`for\`). Attributes use camelCase DOM property names: \`className\`, \`htmlFor\`, \`onClick\`, \`tabIndex\`; \`style\` takes an object (\`style={{ marginTop: 8 }}\`). Fragments (\`<>\` or \`<Fragment key=...>\`) group children without adding DOM nodes.

Components are typed as normal functions; the return type is inferred. Keep one component per file with a default or named export, as in the supplied \`components/\` and \`pages/\` folders.`,
      deep: `**Declarative vs imperative.** With the DOM API you mutate a long-lived tree directly. With React, every render produces a *new* element tree; React's reconciler compares it with the previous tree and the renderer (\`react-dom\`) applies the minimal set of DOM operations in the **commit** phase. If nothing changed, nothing is written to the DOM — a render is a calculation, not necessarily a DOM mutation.

**Why components must be pure.** Because React may call your function many times (re-renders, StrictMode double rendering, concurrent rendering that throws work away), a component should compute JSX from props/state without side effects. Side effects belong in event handlers or effects.

**Element identity.** An element's \`type\` is how React knows whether two renders describe "the same" component at a position. If you define a component *inside* another component's body, its function identity changes on every render, so React sees a new type each time and **unmounts and remounts** it, losing state. Always define components at module top level.

**JSX details worth knowing:** \`{false}\`, \`{null}\`, \`{undefined}\` and \`{true}\` render nothing, but \`{0}\` and \`{NaN}\` render text. Adjacent JSX can't be returned because a function returns one value — a fragment turns it into one value (\`jsxs(Fragment, { children: [...] })\`). JSX string attributes are not HTML-escaped by you: React escapes text content automatically, which is a key XSS defence (unless you use \`dangerouslySetInnerHTML\`).

The older UMD examples in the supplied \`React-basic-examples\` folder use Babel in the browser and \`ReactDOM.render\` (React 17). In React 19 \`ReactDOM.render\` is removed; apps start with \`createRoot(el).render(<App />)\` as in the supplied \`main.tsx\`.`,
    },
    mechanism: `${T}text
   Navbar.tsx / Events.tsx / Footer.tsx          (your source: JSX)
                 │
                 ▼  Vite (esbuild) with "jsx": "react-jsx"
   _jsx(Navbar, {}) , _jsxs("main", { children: [...] })   (plain JS calls)
                 │
                 ▼  called during RENDER
   React element tree  (plain objects — a description of the UI)
   ┌──────────────────────────────────────────────┐
   │ { type: App }                                │
   │   ├─ { type: Navbar }                        │
   │   ├─ { type: "main", props.children: [...] } │
   │   │     └─ { type: Events }                  │
   │   └─ { type: Footer }                        │
   └──────────────────────────────────────────────┘
                 │
                 ▼  reconcile with previous tree (diff)
   COMMIT: react-dom creates/updates ONLY the DOM nodes that differ
                 │
                 ▼
   <h1>CampusEvents</h1><nav>…</nav><main>…</main><footer>…</footer>
${T}

- JSX never reaches the browser — it is compiled away.
- Calling a component produces **elements** (objects), not DOM nodes.
- The DOM is touched only in the commit step, and only where the new description differs from the old one.`,
    simpleExample: {
      title: "A component with expressions, className and a fragment",
      language: "tsx",
      code: `function Welcome() {
  const title = "CampusEvents";
  const tickets = 5;
  const isOpen = true;

  return (
    <>
      <h1 className="page-title">{title}</h1>
      <p>Tickets left: {tickets}</p>
      <p>Status: {isOpen ? "Booking open" : "Sold out"}</p>
      <p>Total for 2 tickets: £{2 * 15}</p>
    </>
  );
}

export default Welcome;`,
      walkthrough: [
        { lines: "1", text: "A component is a plain function whose name starts with a capital letter." },
        { lines: "2-4", text: "Ordinary JavaScript runs before the return — this is where you compute values to display." },
        { lines: "7", text: "The fragment <>…</> groups siblings without adding an extra DOM element." },
        { lines: "8", text: "className (not class) because JSX attributes are JavaScript property names; {title} inserts an expression." },
        { lines: "10", text: "Any expression works inside {} — here a ternary, which is how you choose between two outputs." },
        { lines: "11", text: "Arithmetic is an expression too; React converts the number to text." },
        { lines: "16", text: "Export so App.tsx can import and compose it." },
      ],
    },
    realExample: {
      title: "CampusEvents App shell — composition (supplied App.tsx + Navbar.tsx)",
      language: "tsx",
      code: `// src/components/Navbar.tsx
function Navbar() {
  return (
    <>
      <h1>CampusEvents</h1>
      <nav className="menu">
        <a href="#">Home</a>
        <a href="#">Events</a>
        <a href="#">Login</a>
        <a href="#">Register</a>
      </nav>
    </>
  );
}
export default Navbar;

// src/App.tsx
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Events from "./pages/Events";
import "./App.css";

function App() {
  return (
    <>
      <Navbar />
      <main>
        <h2>Welcome to CampusEvents</h2>
        <Events />
      </main>
      <Footer />
    </>
  );
}

export default App;`,
      walkthrough: [
        { lines: "2-14", text: "Navbar returns two siblings (h1 and nav), so they are wrapped in a fragment." },
        { lines: "6", text: "className=\"menu\" becomes the DOM class attribute after commit." },
        { lines: "18-21", text: "App imports child components. No `import React` is needed with the automatic JSX runtime." },
        { lines: "23-34", text: "App is pure composition: it describes the page as Navbar + main(Events) + Footer — the component tree from Lecture 02 slide 7." },
        { lines: "26", text: "<Navbar /> compiles to _jsx(Navbar, {}): the capital letter makes it a component reference rather than an HTML tag." },
      ],
    },
    mistakes: [
      {
        mistake: "Writing `class=\"card\"` or `for=\"email\"` in JSX.",
        fix: "Use `className` and `htmlFor` — JSX attributes map to DOM property names, and `class`/`for` are reserved words in JavaScript.",
      },
      {
        mistake: "Returning two sibling elements from a component (`return <h1/><nav/>`).",
        fix: "A function returns one value. Wrap siblings in a fragment `<>…</>` (or a meaningful element such as `<header>`).",
      },
      {
        mistake: "Naming a component in lower case (`function eventCard()` used as `<eventCard />`).",
        fix: "Capitalise component names. Lower-case JSX tags are treated as built-in HTML elements, so React would try to create an unknown `<eventcard>` element.",
      },
      {
        mistake: "Putting a statement inside braces, e.g. `{if (isOpen) { ... }}`.",
        fix: "Only expressions are allowed in `{}`. Use a ternary, `&&`, or compute a variable before the `return`.",
      },
      {
        mistake: "Defining a child component inside the parent's function body.",
        fix: "Define components at the top level of a module. A nested definition is a new function on every render, so React remounts it and its state is lost.",
      },
    ],
    debug: {
      prompt: "This Footer component does not compile and the styling class is not applied. Find the four JSX problems.",
      language: "tsx",
      buggyCode: `function footer() {
  const year = 2026;
  return (
    <p class="small">CampusEvents</p>
    <p>© year University of Westminster</p>
  );
}

export default footer;`,
      hint: "Check the component name, the attribute name, how many root elements are returned, and how the variable is inserted.",
      fixedCode: `function Footer() {
  const year = 2026;
  return (
    <footer>
      <p className="small">CampusEvents</p>
      <p>© {year} University of Westminster</p>
    </footer>
  );
}

export default Footer;`,
      explanation:
        "1) Components must be capitalised so `<Footer />` is treated as a component. 2) `class` must be `className`. 3) Two siblings cannot be returned without a wrapper — a `<footer>` (or fragment) fixes that. 4) Without braces, `year` is literal text; `{year}` inserts the variable's value.",
    },
    challenge: {
      prompt:
        "Create a `Hero` component that shows the heading \"Discover campus events\", a paragraph with the number of upcoming events (stored in a local constant `upcoming = 12`) and, using a ternary, the text \"Busy week!\" when `upcoming > 10` otherwise \"Quiet week\". Then compose it inside a `Home` component above a `<p>` that says \"Browse below\". Use a fragment in `Home`.",
      starterCode: `function Hero() {
  // TODO
}

function Home() {
  // TODO
}

export default Home;`,
      language: "tsx",
      hints: [
        "Declare `const upcoming = 12;` before the return.",
        "Use `{upcoming > 10 ? \"Busy week!\" : \"Quiet week\"}` inside JSX.",
        "Home returns two siblings, so wrap them in `<>…</>`.",
      ],
      solution: `function Hero() {
  const upcoming = 12;
  return (
    <section className="hero">
      <h1>Discover campus events</h1>
      <p>{upcoming} upcoming events</p>
      <p>{upcoming > 10 ? "Busy week!" : "Quiet week"}</p>
    </section>
  );
}

function Home() {
  return (
    <>
      <Hero />
      <p>Browse below</p>
    </>
  );
}

export default Home;`,
      explanation:
        "Hero is a pure function that computes its output from a constant; the ternary is an expression so it can sit inside `{}`. Home composes Hero with another element and uses a fragment so no extra wrapper div is added to the DOM.",
    },
    examQuestions: [
      {
        question: "Explain what JSX is and what happens to it before the code runs in the browser.",
        answer:
          "JSX is a syntax extension that lets you describe UI with HTML-like markup inside JavaScript/TypeScript. It is not understood by browsers: the build tool (Vite/esbuild with the React 17+ automatic runtime) compiles each element into a function call such as `jsx(\"h1\", { children: title })` imported from `react/jsx-runtime`. Those calls return plain React element objects that React later uses to update the DOM.",
        marks: 3,
      },
      {
        question: "Why does JSX use `className` instead of `class`, and why can't you put an `if` statement inside `{}`?",
        answer:
          "JSX is JavaScript: attributes become object properties, and `class` is a reserved word, so the DOM property name `className` is used. Curly braces embed a JavaScript *expression* (something that produces a value) as an argument to `jsx()`; an `if` statement does not produce a value, so use a ternary, `&&`, or compute a variable before the return.",
        marks: 2,
      },
      {
        question: "Describe the component-based architecture used in the CampusEvents App.tsx and one benefit of it.",
        answer:
          "`App` is composed of smaller components — `Navbar`, a `main` containing `Events` (which renders many `EventCard`s), and `Footer`. Each component is a function with one responsibility. Benefits: reuse (EventCard is rendered for every event), easier testing and maintenance, and changes are isolated to one file.",
        marks: 3,
      },
      {
        question: "True or False: every time a React component renders, React rewrites that component's DOM nodes.",
        answer:
          "False. Rendering means calling the component to produce a new element description. React compares it with the previous one and, in the commit phase, only changes DOM nodes that actually differ — if nothing differs, the DOM is not touched.",
        marks: 1,
      },
    ],
    revision: [
      "A component is a capitalised function that returns JSX; compose them into a tree (App → Navbar / Events / Footer).",
      "React is declarative: describe what the UI should look like for given data; React works out the DOM changes.",
      "JSX compiles (automatic runtime, React 17+) to `jsx()`/`jsxs()` calls from `react/jsx-runtime` returning plain element objects.",
      "`{}` holds expressions only; use `className`, `htmlFor`, camelCase events, and close every tag.",
      "Return one root — use a fragment `<>…</>` to avoid extra DOM wrappers.",
      "Define components at module top level and keep them pure; rendering ≠ DOM mutation.",
    ],
    visualizers: ["props-flow"],
  },

  /* ================================================================== */
  /* 2. Props                                                            */
  /* ================================================================== */
  {
    id: "react-props",
    moduleId: "m05-react",
    title: "Props — Passing Data Down",
    summary:
      "Props are the read-only inputs a parent passes to a child component; TypeScript interfaces such as EventCardProps make them a checked contract.",
    priority: "P0",
    minutes: 30,
    objectives: [
      "Pass data from a parent to a child component using props.",
      "Type props with a TypeScript interface and destructure them in the parameter list.",
      "Explain why props are read-only and how a child asks the parent for changes (callback props).",
      "Use the special `children` prop to build wrapper components.",
      "Decide which fields a component really needs (Event vs EventCardProps, Week 03 slide 15).",
    ],
    prerequisites: ["react-components-jsx", "ts-basics-interfaces"],
    sources: [
      L02("Slides 10–11 (Props, Props with TypeScript — EventCardProps)"),
      W03("Slide 15 — The Event interface vs the card props"),
      W02("Steps 6–7 — reusable EventCard and demonstrating props"),
      PROJECT("src/components/EventCard.tsx, src/pages/Events.tsx, src/types/Event.ts"),
      GUIDE("File 11 — EventCard receiving the whole `event: Event`"),
      BASIC("example-states-and-props.html (ParentComponent → ChildComponent name prop)"),
      DOCS("react.dev — Passing Props to a Component", "https://react.dev/learn/passing-props-to-a-component"),
    ],
    why: `A reusable component is useless if it can only ever show one hard-coded event. **Props** are how the same \`EventCard\` can render "Campus Tech Conference" in one place and "Sports Day" in another: the parent decides *what* to show, the child decides *how* to show it.

Because data only flows **down** (parent → child), you can always answer "where did this value come from?" by walking up the tree. With TypeScript, the props interface becomes a **contract**: if \`Events.tsx\` forgets \`price\` or passes a string, the compiler catches it before the browser ever runs the code.`,
    analogy: `Props are like the **arguments printed on an order slip** handed to a chef. The head chef (parent) writes "Title: Sports Day, Location: Sports Centre, Price: £5" and hands it to the station (child). The station cooks exactly what is on the slip; it may not scribble over the slip to change the order. If the station needs something changed, it rings a bell (calls a callback prop) and the head chef writes a new slip.`,
    explain: {
      beginner: `**Props** ("properties") let a parent component pass data to a child component. You write them like HTML attributes:

${T}tsx
<EventCard title="Campus Tech Conference" location="Main Campus Hall" price={15} />
${T}

Strings can use quotes; any other value (numbers, booleans, objects, functions) goes inside \`{}\`.

The child receives all of them in **one object**. With TypeScript we describe that object with an interface — Lecture 02 calls it a *contract for the component*:

${T}tsx
interface EventCardProps {
  title: string;
  location: string;
  price: number;
}

function EventCard({ title, location, price }: EventCardProps) {
  return <h3>{title} — {location} — £{price}</h3>;
}
${T}

The \`{ title, location, price }\` part is **destructuring**: it unpacks the props object into variables.

Two key rules:
1. Data flows **one way**: parent → child.
2. Props are **read-only**. A child must never change them. If something needs to change, that is **state** (next lesson), usually owned by a parent.`,
      developer: `**Typing.** Use an \`interface\` (or \`type\`) per component and destructure in the signature. Optional props use \`?\` and can have defaults via destructuring defaults: \`function Badge({ tone = "info" }: BadgeProps)\`. Avoid \`React.FC\`; plain functions with typed parameters are the recommended style.

**Pass only what's needed** (Week 03 slide 15). The API returns a 12-field \`Event\`. The Week 03 \`EventCard\` only needs \`title\`, \`location\`, \`price\`, so \`Events.tsx\` acts as the bridge, mapping each \`Event\` to just those props. The Week 05 guide later changes the card to receive \`event: Event\` because it needs \`id\`, \`imageUrl\`, dates and category. Both are valid trade-offs: narrow props make a component more reusable and easier to test; passing the whole object is convenient when most fields are used.

**children.** Whatever you nest between a component's tags arrives as \`props.children\`. Type it as \`ReactNode\`:

${T}tsx
import type { ReactNode } from "react";
interface CardProps { title: string; children: ReactNode }
${T}

**Callback props** let a child request changes: the parent passes \`onBook={(id) => ...}\` and the child calls it on click. Name them \`onSomething\` and type them precisely: \`onBook: (eventId: number) => void\`.

**Spreading** \`{...event}\` passes every field as a prop — convenient, but it hides what the child depends on and can pass unwanted fields; prefer explicit props in course code.`,
      deep: `Props are just the second argument object of \`jsx(type, props, key)\`. React freezes the props object in development, so \`props.title = "x"\` throws in strict-mode JavaScript modules — a runtime hint that mutation is forbidden. More importantly, mutating anything you received breaks React's assumption that rendering is a **pure function of props and state**.

**\`key\` and \`ref\` are special.** \`key\` is consumed by React for list reconciliation and is *not* available as \`props.key\`; pass a separate prop (e.g. \`id\`) if the child needs it. In React 19, \`ref\` *is* now passed as a normal prop to function components (no \`forwardRef\` needed).

**Re-render behaviour.** When a parent re-renders, its children re-render too by default, whether or not their props changed. Props equality only matters if you opt in with \`memo()\`, which compares props with \`Object.is\` — and an inline object or arrow function is a new reference every render, defeating that comparison. That's an optimisation topic; correctness never depends on it.

**Type-safety boundary.** \`EventCardProps\` is erased at compile time. It guarantees that *your code* passes the right shapes, but if the API sends \`price: "15"\` the type annotation won't stop it. Runtime validation (e.g. Zod) belongs at the service boundary, not in each component.

**Design heuristic.** If two siblings need the same data, lift it to their closest common parent and pass it down; if many levels need it, consider context (lesson on useContext) rather than prop drilling.`,
    },
    mechanism: `${T}text
              Events.tsx  (has Event[] from useEvents)
                   │
     events.map(event => <EventCard key={event.id}
                     │               title={event.title}
                     │               location={event.location}
                     │               price={event.price} />)
                     ▼
    props object  { title: "Sports Day", location: "...", price: 5 }
                     │   (read-only, one-way: parent ──► child)
                     ▼
     EventCard({ title, location, price }: EventCardProps)
                     │
                     ▼
               <article>…</article>

   child wants a change?  child ──calls──► onBook(id)  (callback prop)
                          parent updates ITS state ──► new props flow down
${T}

Data goes down as props; requests for change go up as callback calls. The child never edits its props.`,
    simpleExample: {
      title: "Typed props, optional prop with default, and children",
      language: "tsx",
      code: `import type { ReactNode } from "react";

interface PriceTagProps {
  price: number;
  currency?: string;
}

function PriceTag({ price, currency = "£" }: PriceTagProps) {
  return <span className="price">{price === 0 ? "Free" : currency + price}</span>;
}

interface PanelProps {
  heading: string;
  children: ReactNode;
}

function Panel({ heading, children }: PanelProps) {
  return (
    <section className="panel">
      <h2>{heading}</h2>
      {children}
    </section>
  );
}

export default function Demo() {
  return (
    <Panel heading="Today">
      <PriceTag price={15} />
      <PriceTag price={0} />
    </Panel>
  );
}`,
      walkthrough: [
        { lines: "1", text: "With verbatimModuleSyntax, type-only imports use `import type`." },
        { lines: "3-6", text: "The interface is the contract; `currency?` is optional." },
        { lines: "8", text: "Destructure props in the parameter list; `currency = \"£\"` supplies a default." },
        { lines: "12-15", text: "`children: ReactNode` accepts any renderable content nested between tags." },
        { lines: "21", text: "`{children}` renders whatever the parent placed inside <Panel>…</Panel>." },
        { lines: "28-31", text: "The parent passes different props to the same component; numbers go inside {}." },
      ],
    },
    realExample: {
      title: "Events.tsx is the bridge: Event[] → only the fields EventCard needs",
      language: "tsx",
      code: `// src/components/EventCard.tsx (supplied, Week 03)
interface EventCardProps {
  title: string;
  location: string;
  price: number;
}

function EventCard({ title, location, price }: EventCardProps) {
  return (
    <article>
      <h3>{title}</h3>
      <p>{location}</p>
      <p>£{price}</p>
    </article>
  );
}
export default EventCard;

// src/pages/Events.tsx (excerpt)
import EventCard from "../components/EventCard";
import { useEvents } from "../hooks/useEvents";

function Events() {
  const { events } = useEvents();
  return (
    <section>
      {events.map((event) => (
        <EventCard
          key={event.id}
          title={event.title}
          location={event.location}
          price={event.price}
        />
      ))}
    </section>
  );
}
export default Events;`,
      walkthrough: [
        { lines: "2-6", text: "EventCardProps lists only three fields, although the API Event has twelve (Week 03 slide 15)." },
        { lines: "8", text: "Destructuring gives three local variables; TypeScript checks every call site." },
        { lines: "24", text: "Events gets the full Event[] from the hook (Service → Hook → Component)." },
        { lines: "27-33", text: "For each event, Events picks the fields the card needs. Forgetting `price` or passing `price=\"15\"` is a compile error." },
        { lines: "29", text: "`key` is for React's list bookkeeping and is not received by EventCard as a prop." },
      ],
    },
    mistakes: [
      {
        mistake: "Mutating a prop inside the child: `props.price = props.price * 0.9`.",
        fix: "Props are read-only. Compute a new local value (`const discounted = price * 0.9`) or ask the parent to change its state via a callback prop.",
      },
      {
        mistake: "Passing a number as a string: `<EventCard price=\"15\" />`.",
        fix: "Quotes always produce a string. Use braces for non-string values: `price={15}`. TypeScript flags this when `price: number`.",
      },
      {
        mistake: "Trying to read `props.key` in the child.",
        fix: "`key` is reserved for React. Pass the id separately if the child needs it, e.g. `id={event.id}`.",
      },
      {
        mistake: "Copying a prop into state (`useState(title)`) and expecting it to update when the parent changes it.",
        fix: "The initial value is only used on the first render. Read the prop directly, or reset the child with a `key` when the identity changes.",
      },
    ],
    debug: {
      prompt: "The card shows the price as \"£15\" for every event, and TypeScript reports an error on the call site. Fix both problems.",
      language: "tsx",
      buggyCode: `interface EventCardProps {
  title: string;
  price: number;
}

function EventCard(title: string, price: number) {
  return <h3>{title} — £{price}</h3>;
}

function Events({ events }: { events: { id: number; title: string; price: number }[] }) {
  return (
    <>
      {events.map((e) => (
        <EventCard key={e.id} title={e.title} price="15" />
      ))}
    </>
  );
}`,
      hint: "A component receives ONE argument — the props object. And quotes always make a string.",
      fixedCode: `interface EventCardProps {
  title: string;
  price: number;
}

function EventCard({ title, price }: EventCardProps) {
  return <h3>{title} — £{price}</h3>;
}

function Events({ events }: { events: { id: number; title: string; price: number }[] }) {
  return (
    <>
      {events.map((e) => (
        <EventCard key={e.id} title={e.title} price={e.price} />
      ))}
    </>
  );
}`,
      explanation:
        "React calls a component with a single props object, so the parameters must be destructured from it and typed with the interface. The call site hard-coded the string \"15\" instead of passing each event's numeric price with `{e.price}`.",
    },
    challenge: {
      prompt:
        "Write a `CategoryBadge` component with props `name: string` and optional `count?: number`. It renders `<span className=\"badge\">` containing the name, followed by ` (count)` only when count is provided. Then write `CategoryList` that receives `categories: { id: number; name: string; eventCount: number }[]` and renders a badge per category using only the fields the badge needs.",
      language: "tsx",
      hints: [
        "Use `count !== undefined` rather than a truthy check so a count of 0 still shows.",
        "Pass `name={c.name}` and `count={c.eventCount}` — not the whole object.",
        "Give each badge `key={c.id}`.",
      ],
      solution: `interface CategoryBadgeProps {
  name: string;
  count?: number;
}

function CategoryBadge({ name, count }: CategoryBadgeProps) {
  return (
    <span className="badge">
      {name}
      {count !== undefined ? " (" + count + ")" : null}
    </span>
  );
}

interface Category {
  id: number;
  name: string;
  eventCount: number;
}

export function CategoryList({ categories }: { categories: Category[] }) {
  return (
    <div>
      {categories.map((c) => (
        <CategoryBadge key={c.id} name={c.name} count={c.eventCount} />
      ))}
    </div>
  );
}`,
      explanation:
        "The badge has a narrow, reusable contract (name + optional count), and the list is the bridge that maps domain objects to that contract — the same pattern as Events.tsx → EventCard.",
    },
    examQuestions: [
      {
        question: "Write a TypeScript interface `EventCardProps` (title: string, price: number) and a component that destructures it and displays both values.",
        answer: `${T}tsx
interface EventCardProps {
  title: string;
  price: number;
}
function EventCard({ title, price }: EventCardProps) {
  return (
    <div>
      <h2>{title}</h2>
      <p>£{price}</p>
    </div>
  );
}
${T}
Marks: correct interface (1), typed destructured parameter (1), JSX using {} expressions (1).`,
        marks: 3,
      },
      {
        question: "Explain two differences between props and state.",
        answer:
          "Props are passed into a component by its parent and are read-only for the child; state is created and managed inside the component (useState) and can change over time. Changing state (via its setter) schedules a re-render of the owning component; a child cannot change its props — it can only ask the parent via a callback, and the parent's new state flows down as new props.",
        marks: 2,
      },
      {
        question: "Why does Events.tsx pass only title, location and price to EventCard instead of the whole Event object (Week 03)?",
        answer:
          "Not every component needs every field. A narrow props interface documents exactly what the card depends on, makes it reusable with data from other sources, and means changes to unrelated API fields do not affect the card. Events.tsx acts as the bridge between the API shape (Event) and the UI contract (EventCardProps).",
        marks: 2,
      },
    ],
    revision: [
      "Props = inputs passed parent → child, received as ONE object.",
      "Props are read-only; to change data, the owner updates its state and new props flow down.",
      "Type props with an interface and destructure: `function EventCard({ title, price }: EventCardProps)`.",
      "Strings in quotes, everything else in `{}`; optional props with `?` and defaults in destructuring.",
      "`children: ReactNode` lets components wrap nested content; `key` is not a readable prop.",
      "Children ask for changes through callback props like `onBook(id)`.",
      "TS prop types are compile-time only — they don't validate API data at runtime.",
    ],
    visualizers: ["props-flow"],
  },

  /* ================================================================== */
  /* 3. State & events                                                   */
  /* ================================================================== */
  {
    id: "react-state-events",
    moduleId: "m05-react",
    title: "State & Event Handling",
    summary:
      "useState gives a component memory between renders; event handlers call the setter with a NEW value, which schedules a re-render.",
    priority: "P0",
    examCritical: true,
    minutes: 40,
    objectives: [
      "Declare state with useState (with explicit generic types where inference is not enough).",
      "Attach event handlers correctly (pass a function, don't call it).",
      "Compare props and state (Lecture 02 slide 13).",
      "Update object and array state immutably with spread, map and filter.",
      "Explain why mutating state directly does not trigger a re-render.",
    ],
    prerequisites: ["react-props", "js-references-copies", "js-array-methods"],
    sources: [
      L02("Slides 12–15 (State, State vs Props table, Events, State + Event)"),
      W02("Step 8 — TicketCounter: user clicks → handler → state changes → React renders"),
      PROJECT("src/components/TicketCounter.tsx"),
      BASIC("example-handling-events(react).html (Counter with React.useState)"),
      DOCS("react.dev — State: A Component's Memory", "https://react.dev/learn/state-a-components-memory"),
      DOCS("react.dev — Updating Objects in State", "https://react.dev/learn/updating-objects-in-state"),
      DOCS("react.dev — Updating Arrays in State", "https://react.dev/learn/updating-arrays-in-state"),
    ],
    why: `A normal local variable inside a component is **recreated on every render** and changing it doesn't tell React anything, so the screen never updates. Interactive UI — a ticket counter, a search box, a "show details" toggle — needs two things: a value that **survives between renders**, and a way to **tell React** that it changed. \`useState\` provides both.

Getting state updates right (always a *new* value, never a mutation) is one of the most examined React ideas because the bug it causes — "I changed the data but the UI didn't update" — is so common.`,
    analogy: `State is like a **scoreboard operator** at a match. The scoreboard (screen) only changes when someone hands the operator a new score card (\`setScore(3)\`). Shouting at the scoreboard or scribbling on the old card (mutating) doesn't work — the operator only reacts to a new card being handed over. Each time a new card arrives, the operator redraws the board from it.`,
    explain: {
      beginner: `**State** is data that belongs to a component and can change over time (Lecture 02 slide 12).

${T}tsx
const [tickets, setTickets] = useState(1);
${T}

- \`tickets\` is the current value.
- \`setTickets\` is the function you call to change it.
- \`1\` is the initial value, used only on the first render.

**Events** connect user actions to code. In JSX you pass a function to an event prop such as \`onClick\`:

${T}tsx
<button onClick={() => setTickets(tickets + 1)}>+</button>
${T}

The flow from the Week 02 tutorial is: **user clicks → event handler runs → state changes → React re-renders** the component with the new value.

**State vs props** (slide 13):

| Props | State |
|---|---|
| Passed into component | Managed by component |
| Read-only | Can change (via setter) |
| Parent → child | Component controls it |
| Configure components | Change data |

Golden rule: **never change state directly** (\`tickets = 5\` or \`event.price = 10\`). Always call the setter with a **new value**.`,
      developer: `**Typing.** \`useState(1)\` infers \`number\`. When the initial value doesn't reveal the full type, pass a generic: \`useState<Event[]>([])\`, \`useState<string | null>(null)\`.

**Handlers.** Pass a function reference: \`onClick={handleClick}\` or \`onClick={() => remove(id)}\`. Writing \`onClick={handleClick()}\` *calls* it during render. Handlers receive a typed event: \`(e: React.ChangeEvent<HTMLInputElement>)\` — or import \`type ChangeEvent\` from "react". For forms, call \`e.preventDefault()\` in \`onSubmit\`.

**Immutable updates.** React decides whether to re-render by comparing the old and new state with \`Object.is\`. For objects and arrays, that means **the reference must change**:

${T}tsx
// object: copy then override
setEvent({ ...event, price: 20 });
// array add / remove / update
setEvents([...events, newEvent]);
setEvents(events.filter((e) => e.id !== id));
setEvents(events.map((e) => (e.id === id ? { ...e, price: 20 } : e)));
${T}

Avoid mutating methods on state arrays: \`push\`, \`splice\`, \`sort\`, \`reverse\` (copy first: \`[...events].sort(...)\` or \`toSorted\`). Spread is **shallow** — nested objects must be copied at every level you change.

**Controlled inputs.** \`<input value={query} onChange={(e) => setQuery(e.target.value)} />\` keeps the input and state in sync.

Note the supplied \`TicketCounter\` uses \`Math.max(1, tickets - 1)\` so the counter never drops below one — state updates can include validation logic.`,
      deep: `**Why mutation doesn't re-render.** \`setX(next)\` enqueues an update. When React processes it, it compares \`Object.is(prev, next)\`. If you did \`events.push(e); setEvents(events)\`, \`next\` *is* \`prev\` (same reference) so React bails out — no re-render. Even when something else triggers a render later, you've broken the snapshot model: the "previous" value was changed underneath React, which breaks features like comparing old/new props, \`memo\`, and concurrent rendering that may discard a render.

**State lives in React, not in your function.** The component function is called repeatedly; React stores state in an internal list attached to the component's position in the tree and hands back the right values in **call order**. That is why hooks must be called unconditionally at the top level.

**Setting state is not assignment.** After \`setTickets(tickets + 1)\`, the local constant \`tickets\` still holds the old value for the rest of this handler — the new value appears in the *next* render (see the Rendering & Snapshots lesson).

**Lazy initialisation.** \`useState(expensive())\` calls \`expensive\` every render (result ignored after the first). \`useState(() => expensive())\` calls it once. In StrictMode development, initialisers are called twice to detect impurity.

**Where to keep state.** Keep it as local as possible; lift it to the nearest common parent when siblings must share it; don't store values you can **derive** from props/other state (e.g. \`total = tickets * price\`) — duplicating them invites inconsistencies.`,
    },
    mechanism: `${T}text
 render #1:  useState(1) ─► tickets = 1     UI: [-] 1 [+]
                                                    │ click
                                                    ▼
             onClick handler runs: setTickets(1 + 1)
                                                    │
             React queues update  ──  Object.is(1, 2)? no → schedule re-render
                                                    │
 render #2:  useState(1) ─► tickets = 2   (initial value ignored now)
             new JSX ─► diff ─► commit: only the <span> text node changes

 MUTATION BUG
   events.push(x); setEvents(events)
   Object.is(events, events) === true  ─► React bails out, NO re-render
${T}

The setter does not change the variable you already have; it asks React to render again with a new value. React uses reference equality, so objects/arrays must be replaced, not mutated.`,
    simpleExample: {
      title: "Supplied TicketCounter (Week 02)",
      language: "tsx",
      code: `import { useState } from "react";

function TicketCounter() {
  const [tickets, setTickets] = useState(1);

  return (
    <div>
      <button onClick={() => setTickets(Math.max(1, tickets - 1))}>
        -
      </button>
      <span>{tickets}</span>
      <button onClick={() => setTickets(tickets + 1)}>
        +
      </button>
    </div>
  );
}

export default TicketCounter;`,
      walkthrough: [
        { lines: "1", text: "useState is a named import from react." },
        { lines: "4", text: "Array destructuring gives the current value and its setter; 1 is the initial value (inferred type number)." },
        { lines: "8", text: "An arrow function is passed (not called). Math.max keeps the minimum at 1 ticket." },
        { lines: "11", text: "The current snapshot of state is displayed." },
        { lines: "12", text: "Clicking + schedules a re-render with tickets + 1." },
      ],
    },
    realExample: {
      title: "Immutable array/object updates — a basket of event bookings",
      language: "tsx",
      code: `import { useState } from "react";

interface BasketItem {
  eventId: number;
  title: string;
  quantity: number;
}

export default function Basket() {
  const [items, setItems] = useState<BasketItem[]>([]);

  function add(eventId: number, title: string) {
    const existing = items.find((i) => i.eventId === eventId);
    if (existing) {
      setItems(
        items.map((i) =>
          i.eventId === eventId ? { ...i, quantity: i.quantity + 1 } : i,
        ),
      );
    } else {
      setItems([...items, { eventId, title, quantity: 1 }]);
    }
  }

  function remove(eventId: number) {
    setItems(items.filter((i) => i.eventId !== eventId));
  }

  return (
    <div>
      <button onClick={() => add(1, "Campus Tech Conference")}>Add Tech Conf</button>
      <button onClick={() => add(2, "Sports Day")}>Add Sports Day</button>
      <ul>
        {items.map((i) => (
          <li key={i.eventId}>
            {i.title} × {i.quantity}{" "}
            <button onClick={() => remove(i.eventId)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}`,
      walkthrough: [
        { lines: "10", text: "The generic `<BasketItem[]>` is required — `[]` alone would infer `never[]`." },
        { lines: "15-19", text: "Update one item: map returns a NEW array and spread creates a NEW object for the changed item; others are reused." },
        { lines: "21", text: "Add: spread into a new array instead of push()." },
        { lines: "26", text: "Remove: filter returns a new array without the item." },
        { lines: "31-32", text: "Handlers that need arguments are wrapped in arrow functions so they run on click, not during render." },
      ],
    },
    mistakes: [
      {
        mistake: "`onClick={setTickets(tickets + 1)}` — calling the setter during render.",
        fix: "Pass a function: `onClick={() => setTickets(tickets + 1)}`. Calling it during render causes 'Too many re-renders'.",
      },
      {
        mistake: "Mutating state: `items.push(newItem); setItems(items);`",
        fix: "Create a new array: `setItems([...items, newItem])`. Same reference ⇒ React bails out of the update.",
      },
      {
        mistake: "Updating a nested field with `event.price = 20; setEvent(event)`.",
        fix: "Copy the object: `setEvent({ ...event, price: 20 })` (and copy nested objects you change).",
      },
      {
        mistake: "Reading state right after setting it and expecting the new value: `setTickets(2); console.log(tickets)`.",
        fix: "State updates apply on the next render; the current variable is a snapshot. Compute the new value into a local constant if you need it immediately.",
      },
      {
        mistake: "`useState([])` with no type for an array of events.",
        fix: "Provide the generic: `useState<Event[]>([])`, otherwise TypeScript infers `never[]`.",
      },
    ],
    debug: {
      prompt: "Clicking \"Mark sold out\" changes the data (you can see it in console.log) but the screen never updates. Fix it.",
      language: "tsx",
      buggyCode: `import { useState } from "react";

interface EventItem { id: number; title: string; soldOut: boolean }

export default function EventAdmin() {
  const [events, setEvents] = useState<EventItem[]>([
    { id: 1, title: "Sports Day", soldOut: false },
    { id: 2, title: "Music Festival", soldOut: false },
  ]);

  function markSoldOut(id: number) {
    const target = events.find((e) => e.id === id);
    if (target) target.soldOut = true;
    console.log(events);
    setEvents(events);
  }

  return (
    <ul>
      {events.map((e) => (
        <li key={e.id}>
          {e.title} {e.soldOut ? "(sold out)" : ""}
          <button onClick={() => markSoldOut(e.id)}>Mark sold out</button>
        </li>
      ))}
    </ul>
  );
}`,
      hint: "What does Object.is(events, events) return? What did you actually change?",
      fixedCode: `import { useState } from "react";

interface EventItem { id: number; title: string; soldOut: boolean }

export default function EventAdmin() {
  const [events, setEvents] = useState<EventItem[]>([
    { id: 1, title: "Sports Day", soldOut: false },
    { id: 2, title: "Music Festival", soldOut: false },
  ]);

  function markSoldOut(id: number) {
    setEvents(
      events.map((e) => (e.id === id ? { ...e, soldOut: true } : e)),
    );
  }

  return (
    <ul>
      {events.map((e) => (
        <li key={e.id}>
          {e.title} {e.soldOut ? "(sold out)" : ""}
          <button onClick={() => markSoldOut(e.id)}>Mark sold out</button>
        </li>
      ))}
    </ul>
  );
}`,
      explanation:
        "The buggy code mutated an object inside the existing array and passed the *same* array reference to setEvents. React compares with Object.is, sees no change and skips the re-render. map() creates a new array and the spread creates a new object for the changed event, so React detects the change.",
    },
    challenge: {
      prompt:
        "Build a `FavouriteToggle` component that receives `title: string`. It keeps a boolean `isFavourite` in state (start false) and a number `clicks`. Clicking the button flips the favourite flag and increments clicks. The button text is \"★ Unfavourite\" or \"☆ Favourite\", and a paragraph shows \"Toggled N times\".",
      language: "tsx",
      hints: [
        "Two separate useState calls are fine — keep unrelated values separate.",
        "Flip a boolean with `!isFavourite`.",
        "Put both setter calls in one handler; React batches them into one re-render.",
      ],
      solution: `import { useState } from "react";

interface FavouriteToggleProps {
  title: string;
}

export default function FavouriteToggle({ title }: FavouriteToggleProps) {
  const [isFavourite, setIsFavourite] = useState(false);
  const [clicks, setClicks] = useState(0);

  function handleToggle() {
    setIsFavourite(!isFavourite);
    setClicks(clicks + 1);
  }

  return (
    <div>
      <h3>{title}</h3>
      <button onClick={handleToggle}>
        {isFavourite ? "★ Unfavourite" : "☆ Favourite"}
      </button>
      <p>Toggled {clicks} times</p>
    </div>
  );
}`,
      explanation:
        "Props (title) configure the component; state (isFavourite, clicks) is its own changing memory. Both updates in the handler are batched into a single re-render. Primitive values are replaced, so no copying is needed.",
    },
    examQuestions: [
      {
        question: "Describe what happens, step by step, when a user clicks the + button in TicketCounter.",
        answer:
          "1) The browser click event reaches React, which calls the onClick handler. 2) The handler calls `setTickets(tickets + 1)`, which queues a state update (it does not change the `tickets` variable). 3) React re-renders TicketCounter: `useState` now returns the new value. 4) React compares the new JSX with the previous output and commits only the changed text in the `<span>` to the DOM.",
        marks: 4,
      },
      {
        question: "A developer writes `cart.push(item); setCart(cart);` and the UI does not update. Explain why and give the correct code.",
        answer:
          "push mutates the existing array, so the value passed to setCart is the same reference as the current state. React compares old and new state with Object.is, sees they are identical and skips the re-render. Correct: `setCart([...cart, item]);` which creates a new array.",
        marks: 3,
      },
      {
        question: "True or False: Props are managed by the component itself and can be changed by it, while state is passed from the parent.",
        answer: "False — it's the other way round. Props are passed from the parent and are read-only; state is managed by the component and changes via its setter.",
        marks: 1,
      },
      {
        question: "What is wrong with `<button onClick={deleteEvent(id)}>`?",
        answer:
          "It calls deleteEvent immediately during rendering and passes its return value as the handler. It should pass a function: `onClick={() => deleteEvent(id)}`.",
        marks: 2,
      },
    ],
    revision: [
      "`const [value, setValue] = useState(initial)` — memory that survives renders; initial used only once.",
      "User event → handler → setter → React re-renders → only changed DOM is committed.",
      "Pass handlers, don't call them: `onClick={() => f(id)}`.",
      "Props: from parent, read-only. State: owned by component, changed via setter.",
      "Never mutate: new arrays via spread/map/filter, new objects via `{ ...obj, field }`.",
      "React compares with Object.is — same reference ⇒ no re-render.",
      "Type empty/nullable state explicitly: `useState<Event[]>([])`, `useState<string | null>(null)`.",
    ],
    visualizers: ["react-state-queue"],
  },
  /* ================================================================== */
  /* 4. Rendering & snapshots                                            */
  /* ================================================================== */
  {
    id: "react-rendering-snapshots",
    moduleId: "m05-react",
    title: "Rendering, Snapshots & the Update Queue",
    summary:
      "A render is React calling your component to get a snapshot of the UI; state updates are queued and batched, then React commits only the DOM differences.",
    priority: "P1",
    minutes: 40,
    objectives: [
      "Distinguish the trigger, render and commit phases and explain that not every render changes the DOM.",
      "Explain 'state as a snapshot' and predict the result of `setCount(count + 1)` called three times.",
      "Use the functional updater `setCount(c => c + 1)` when the next state depends on the previous one.",
      "Describe batching and reconciliation (the virtual DOM as a conceptual model).",
      "Explain how component identity (type + position + key) preserves or resets state, and use `key` to reset it.",
    ],
    prerequisites: ["react-state-events", "js-closures"],
    sources: [
      L02("Slides 14–15 — User action → event handler → state update → React re-renders"),
      W03("Slide 21 — React re-renders the component automatically when state changes"),
      DOCS("react.dev — Render and Commit", "https://react.dev/learn/render-and-commit"),
      DOCS("react.dev — State as a Snapshot", "https://react.dev/learn/state-as-a-snapshot"),
      DOCS("react.dev — Queueing a Series of State Updates", "https://react.dev/learn/queueing-a-series-of-state-updates"),
      DOCS("react.dev — Preserving and Resetting State", "https://react.dev/learn/preserving-and-resetting-state"),
    ],
    why: `Lecture 02 summarises React as **"state update → React re-renders"**. That sentence hides several mechanisms that explain most "weird" React behaviour: why a value logged straight after \`setCount\` is stale, why three \`setCount(count + 1)\` calls only add one, why a form keeps old text when you switch to a different event, and why re-rendering is usually cheap.

Understanding render vs commit also corrects a common misconception that *every render rewrites the DOM*. It doesn't — React computes a new description and only touches the DOM where something actually changed.`,
    analogy: `Imagine a **photographer** taking a snapshot of a classroom each time the teacher rings a bell. Students can hand notes ("move Sam to seat 3") to the teacher during the lesson; the teacher collects all notes (**queue**) and rings the bell once (**batching**). The photographer takes a new photo (**render**), compares it with the last one, and the caretaker only physically moves the chairs that differ (**commit**).

Anyone looking at the *old* photo still sees the old seating — that's why a handler reading \`count\` still sees the old value: it's holding the old photo.`,
    explain: {
      beginner: `React updates the screen in three steps:

1. **Trigger** — something asks for an update: the first mount, or a state setter like \`setCount\`.
2. **Render** — React *calls your component function* to find out what the UI should look like now.
3. **Commit** — React compares the result with the previous one and updates **only the parts of the real page that changed**. If nothing changed, the page isn't touched.

**State is a snapshot.** During one render, \`count\` is a fixed value. Calling \`setCount(count + 1)\` does **not** change \`count\` in the current code; it asks React for a new render where \`count\` will be bigger. So:

${T}tsx
function handleClick() {
  setCount(count + 1); // 0 + 1
  setCount(count + 1); // 0 + 1 again!
  setCount(count + 1); // 0 + 1 again!
}
${T}

After the click, \`count\` is **1**, not 3 — every line used the same snapshot value 0.

If the new value depends on the old one, pass a **function**: \`setCount(c => c + 1)\`. React feeds each function the latest queued value, so three of them give **3**.

When a parent re-renders, its children are rendered again as well — but again, only real differences reach the DOM.`,
      developer: `**Update queue.** Each setter call appends to a queue for that hook. During the next render React processes the queue in order: a plain value replaces the state; an updater function receives the pending state and returns the next one.

${T}tsx
setCount(count + 5);       // queue: "replace with 5"      (count was 0)
setCount((c) => c + 1);    // queue: "c => c + 1"  → 6
setCount(42);              // queue: "replace with 42"     → 42
${T}

**Batching.** Since React 18, all updates triggered in the same tick — inside event handlers, promises, timeouts — are **automatically batched** into one render. Updates are only applied after your handler finishes.

**Reconciliation.** React compares the new element tree with the previous one. Same type at the same position → update props on the existing DOM node/component instance (state kept). Different type → unmount the old subtree (state destroyed) and mount a new one. Lists use \`key\` to match items.

**Resetting state with key.** Identity is *type + position (+ key)*. Rendering \`<EventEditor key={event.id} event={event} />\` means switching events gives a different key → React unmounts the old editor and mounts a fresh one, resetting its internal state. This is cleaner than syncing props to state with an effect.

**Re-render scope.** A state change re-renders that component and, by default, its descendants. That's normally fast because rendering is just function calls; \`memo\`, \`useMemo\` and \`useCallback\` are optimisations to apply after measuring, not prerequisites for correctness.`,
      deep: `**Virtual DOM as a model.** The "virtual DOM" is a useful mental model: React keeps a tree of lightweight objects (internally, *fibers*) describing the UI and diffs new element trees against it. The diff uses heuristics (O(n), not a general tree diff): it compares by type and key at each position rather than searching for moved subtrees. That's why keys matter and why changing a wrapper's type remounts everything inside.

**Render must be pure.** React may render a component and throw the result away (concurrent features like transitions, Suspense, StrictMode's double render). Only the **commit** phase is guaranteed to reach the DOM, and effects run after commit. Side effects during render (mutating outside variables, fetching, writing to the DOM) therefore produce bugs.

**Closures explain snapshots.** Each render creates new handler functions that close over that render's \`count\`. A \`setTimeout(() => alert(count), 3000)\` started in render #1 will alert render #1's value even if the count has changed since — the closure kept the old snapshot. The updater form avoids depending on the captured value. For reading the *latest* value from an async callback, use a ref.

**Bail-outs.** If a setter is called with a value \`Object.is\`-equal to the current state, React may skip re-rendering the children and committing. (React may still call the component once before bailing out — another reason renders must be pure.)

**Commit is minimal.** For an updated host element React patches only changed attributes/text; for unchanged subtrees nothing is written. That's why it's wrong to say "every render mutates the DOM": renders are calculations; commits are the (possibly empty) DOM work.`,
    },
    mechanism: `${T}text
  click ─► handler runs to completion
           setCount(count + 1)   queue: [ +1 using snapshot 0 → 1 ]
           setCount(count + 1)   queue: [ 1, 1 ]
           setCount(c => c + 1)  queue: [ 1, 1, c=>c+1 ]
           (batched — no render yet)
                    │
                    ▼
  ┌──────────── RENDER (pure, may be repeated/discarded) ─────────────┐
  │ process queue: 0 → 1 → 1 → 2      useState returns 2              │
  │ call Counter() → new element tree                                 │
  │ reconcile with previous tree: same type+position+key? keep state  │
  └───────────────────────────────────────────────────────────────────┘
                    │ differences only
                    ▼
  ┌──────────── COMMIT ───────────────────────────────────────────────┐
  │ patch DOM: text "1" → "2"   (nothing else touched)                │
  │ then run effects (useEffect) after paint                          │
  └───────────────────────────────────────────────────────────────────┘

  Identity: <EventEditor key={1}/> → <EventEditor key={2}/>
            different key ⇒ unmount old (state lost) + mount new (fresh state)
${T}

Notes: the queue is processed during the next render, not when you call the setter. A render that produces the same output leads to an empty commit for that subtree.`,
    simpleExample: {
      title: "Snapshot vs updater function",
      language: "tsx",
      code: `import { useState } from "react";

export default function Counters() {
  const [count, setCount] = useState(0);

  function addThreeWrong() {
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
    console.log(count); // still the old snapshot
  }

  function addThreeRight() {
    setCount((c) => c + 1);
    setCount((c) => c + 1);
    setCount((c) => c + 1);
  }

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={addThreeWrong}>+3 (wrong: adds 1)</button>
      <button onClick={addThreeRight}>+3 (right)</button>
    </div>
  );
}`,
      walkthrough: [
        { lines: "7-9", text: "Each call computes count + 1 from the same snapshot (e.g. 0 + 1), so the queue holds 'replace with 1' three times." },
        { lines: "10", text: "Logs the old value: setting state does not reassign the local constant." },
        { lines: "14-16", text: "Updater functions receive the latest pending value: 0→1→2→3." },
        { lines: "20-24", text: "All three updates are batched into ONE re-render after the handler returns." },
      ],
    },
    realExample: {
      title: "Resetting a form's state with key when the selected event changes",
      language: "tsx",
      code: `import { useState } from "react";

interface CampusEvent {
  id: number;
  title: string;
}

function ReviewForm({ event }: { event: CampusEvent }) {
  const [comment, setComment] = useState("");
  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <label htmlFor="comment">Review of {event.title}</label>
      <textarea
        id="comment"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
    </form>
  );
}

export default function ReviewPanel({ events }: { events: CampusEvent[] }) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const selected = events.find((e) => e.id === selectedId) ?? null;

  return (
    <div>
      {events.map((e) => (
        <button key={e.id} onClick={() => setSelectedId(e.id)}>
          {e.title}
        </button>
      ))}
      {selected && <ReviewForm key={selected.id} event={selected} />}
    </div>
  );
}`,
      walkthrough: [
        { lines: "8-9", text: "ReviewForm owns its comment state." },
        { lines: "23", text: "selected is DERIVED during render from the id — no extra state, so it can't go out of sync." },
        { lines: "33", text: "Without key, switching event keeps the same ReviewForm at the same position, so the half-typed comment would leak to the other event. key={selected.id} gives each event its own identity: React remounts the form with fresh state." },
        { lines: "28-30", text: "Clicking a button re-renders ReviewPanel and its children; React commits only what differs (the label text, or the remounted form)." },
      ],
    },
    mistakes: [
      {
        mistake: "Calling `setCount(count + 1)` several times and expecting several increments.",
        fix: "Use the updater form `setCount(c => c + 1)` whenever the next state depends on the previous state.",
      },
      {
        mistake: "Logging state right after setting it to 'check it worked'.",
        fix: "The variable is a snapshot of this render. Log in the next render, or compute `const next = count + 1` and use `next`.",
      },
      {
        mistake: "Believing every re-render rewrites the DOM and so wrapping everything in memo/useMemo 'for performance'.",
        fix: "Rendering is calculation; commit only touches changed nodes. Optimise after profiling shows a real problem.",
      },
      {
        mistake: "Syncing a prop into state with an effect so a form 'resets' when the item changes.",
        fix: "Give the component a `key` tied to the item id so React remounts it with fresh state.",
      },
      {
        mistake: "Declaring a component inside another component.",
        fix: "Its type changes every render, so React remounts it and state resets. Declare components at module top level.",
      },
    ],
    debug: {
      prompt: "The \"Book 2 tickets\" button only adds 1 to the booked count, and the alert shows the old value. Fix the counter so it adds 2 and shows the new total.",
      language: "tsx",
      buggyCode: `import { useState } from "react";

export default function Booker() {
  const [booked, setBooked] = useState(0);

  function bookTwo() {
    setBooked(booked + 1);
    setBooked(booked + 1);
    alert("Booked total: " + booked);
  }

  return <button onClick={bookTwo}>Book 2 tickets ({booked})</button>;
}`,
      hint: "Both setter calls read the same snapshot. And the alert reads the snapshot too.",
      fixedCode: `import { useState } from "react";

export default function Booker() {
  const [booked, setBooked] = useState(0);

  function bookTwo() {
    const next = booked + 2;
    setBooked(next);
    alert("Booked total: " + next);
  }

  return <button onClick={bookTwo}>Book 2 tickets ({booked})</button>;
}`,
      explanation:
        "`booked` is fixed for the whole handler, so two `booked + 1` calls both queue the same value. Computing `next` once and using it for both the update and the alert is clearest. (Two updater calls `setBooked(b => b + 1)` would also add 2, but the alert would still show the old snapshot.)",
    },
    challenge: {
      prompt:
        "Predict the final value of `n` after one click for each handler (n starts at 0), then explain using the update queue.\n\nA: `setN(n + 1); setN(n + 1);`\nB: `setN(n + 1); setN(x => x + 1);`\nC: `setN(x => x + 1); setN(5);`\nD: `setN(5); setN(x => x * 2); setN(x => x + 1);`",
      language: "text",
      hints: [
        "A plain value means 'replace with this value' — computed from the snapshot when the line ran.",
        "An updater receives the result of everything queued before it.",
        "Process the queue left to right starting from 0.",
      ],
      solution: `A: queue [replace 1, replace 1]           → 1
B: queue [replace 1, x => x + 1]          → 1 → 2  = 2
C: queue [x => x + 1, replace 5]          → 1 → 5  = 5
D: queue [replace 5, x => x * 2, x => x + 1] → 5 → 10 → 11 = 11`,
      explanation:
        "Setters don't change n immediately; they append to a queue processed in order during the next (single, batched) render. Replacement values were computed from the snapshot n = 0, while updater functions chain on the pending value.",
    },
    examQuestions: [
      {
        question: "A handler calls `setCount(count + 1)` three times. count was 0. What is displayed after the click, and how would you make it 3?",
        answer:
          "1. Each call uses the same render snapshot (count = 0), so each queues 'set to 1'; the batched re-render shows 1. Use the functional updater `setCount(c => c + 1)` three times — each receives the latest pending value, giving 3.",
        marks: 3,
      },
      {
        question: "Explain the difference between the render phase and the commit phase in React.",
        answer:
          "Render: React calls component functions to compute a new element tree and reconciles it with the previous one; it must be pure and may be repeated or discarded. Commit: React applies only the necessary changes to the real DOM and then runs effects. If the render produces the same output, the commit changes nothing for that part of the tree.",
        marks: 3,
      },
      {
        question: "How can you force a component's internal state to reset when the user selects a different record?",
        answer:
          "Render it with a `key` based on the record's id, e.g. `<EventForm key={event.id} event={event} />`. When the key changes React treats it as a different component instance, unmounting the old one and mounting a new one with fresh initial state.",
        marks: 2,
      },
      {
        question: "True or False: Every time a component re-renders, React recreates all of its DOM elements.",
        answer: "False. React reuses existing DOM nodes when type and position/key match and only patches the attributes or text that changed.",
        marks: 1,
      },
    ],
    revision: [
      "Trigger → Render (call components, pure) → Commit (apply only DOM differences, then effects).",
      "State is a snapshot per render; setters don't change the current variable.",
      "Setters enqueue updates; React 18+ batches them automatically into one render.",
      "Use `setX(prev => …)` when the next value depends on the previous one.",
      "Reconciliation matches by type + position + key; different type/key ⇒ remount, state lost.",
      "Use `key` to deliberately reset a component's state.",
      "A parent re-render re-renders children by default; that's normally cheap and not the same as DOM writes.",
    ],
    visualizers: ["react-state-queue", "render-commit"],
  },

  /* ================================================================== */
  /* 5. Lists & keys                                                     */
  /* ================================================================== */
  {
    id: "react-lists-keys",
    moduleId: "m05-react",
    title: "Rendering Lists & Keys",
    summary:
      "Use map() to turn an array of data into an array of elements, and give each a stable, unique key (the record id) so React can track items across renders.",
    priority: "P0",
    minutes: 25,
    objectives: [
      "Render an array of objects with `.map()` returning JSX.",
      "Choose a stable, unique key (database id) and put it on the outermost element returned by map.",
      "Explain what goes wrong with index keys when items are inserted, removed or reordered.",
      "Filter/sort data before rendering without mutating state.",
    ],
    prerequisites: ["react-props", "js-array-methods"],
    sources: [
      L02("Slide 16 — Rendering Lists with events.map and key"),
      W02("Step 9 — Render a list with map() (key={event.id})"),
      PROJECT("src/pages/Events.tsx — key={event.id} on the wrapping div"),
      GUIDE("File 16 — Events.tsx renders a Bootstrap grid with key={event.id}"),
      DOCS("react.dev — Rendering Lists", "https://react.dev/learn/rendering-lists"),
    ],
    why: `The Events page exists to show *many* events. You don't write \`<EventCard />\` ten times — you transform the array of data into an array of elements. Because the list changes (new events, deleted events, sorting), React needs a way to tell **which element is which** between renders. That is the job of \`key\`. Wrong keys don't just cause a console warning; they can attach state (ticket counts, typed text, focus) to the **wrong item**.`,
    analogy: `Keys are like **name badges at a conference**. If people are identified by badge (id), you can shuffle the queue and still hand the right lanyard to each person. If they're identified by "position in the queue" (index), when someone joins at the front everybody's lanyard shifts to the person behind them.`,
    explain: {
      beginner: `To show a list, call \`.map()\` on the array and return JSX for each item:

${T}tsx
{events.map((event) => (
  <EventCard key={event.id} title={event.title} location={event.location} price={event.price} />
))}
${T}

\`map\` returns a **new array of elements**, and React renders arrays of elements in order.

Each item needs a **key**: a value that is

- **unique** among its siblings, and
- **stable** — the same item keeps the same key on every render.

The best key is the record's **id** from the database (\`event.id\`). Lecture 02 slide 16 uses the string itself (\`key={event}\`), which works only because those titles are unique.

Put the key on the **outermost** element that \`map\` returns. In the supplied Events page that is the wrapping \`<div key={event.id}>\` holding both the EventCard and the TicketCounter.

Avoid using the array **index** as a key when the list can change order or have items added/removed.`,
      developer: `**Where the key goes.** \`key\` belongs on the element directly returned from the map callback. If you return a fragment with several children, use \`<Fragment key={id}>\` (the short \`<>\` syntax can't take a key).

**Scope.** Keys only need to be unique among siblings in the same array, not globally.

**Not a prop.** The child doesn't receive \`key\`; pass \`id\` separately if needed.

**Derive, don't mutate.** Filtering and sorting for display should be done in render on copies:

${T}tsx
const visible = events
  .filter((e) => e.categoryName === category)
  .toSorted((a, b) => a.startDate.localeCompare(b.startDate));
${T}

\`sort()\` mutates in place — dangerous on state or props. \`toSorted()\` (ES2023) or \`[...arr].sort()\` are safe.

**Generating keys.** Never use \`Math.random()\` or \`crypto.randomUUID()\` *during render* as a key — a new key each render forces React to remount every item. If data has no id, create ids **once** when the data is created (e.g. when adding an item to state).

**Index keys are acceptable** only for static lists that never reorder, filter or insert, and whose items have no state.`,
      deep: `**How React uses keys.** When reconciling a list, React matches old and new children by key. Matching key and type → the existing component instance and DOM node are **reused** (state preserved, props updated). Missing key in the new list → unmount. New key → mount. Without explicit keys, React falls back to index — position-based matching.

**Index key failure, concretely.** The Events page renders \`EventCard + TicketCounter\` per event. Suppose a user sets the counter for "Sports Day" (index 0) to 4 tickets, then a new event is inserted at the top. With \`key={index}\`, the new event now has key 0 and inherits the existing instance — so the *new* event shows 4 tickets and Sports Day shows the counter of whatever was previously at index 1. The same happens with uncontrolled inputs (typed text stays at the position), focus, animations, and in-flight effects. With \`key={event.id}\`, React moves the existing instance to its new position.

**Performance.** Stable keys also let React move DOM nodes instead of patching every row's content; with index keys an insertion at the front patches *every* item.

**Keys for resetting.** Since key is identity, changing a key intentionally remounts a component (see Rendering & Snapshots).

**Duplicate keys** cause React to warn and may drop or duplicate items in updates — ensure ids are unique (e.g. don't key by \`title\` if two events share a name).`,
    },
    mechanism: `${T}text
 Before insert                       After inserting "Open Day" at top

 key={index}                          key={index}
 0: Sports Day    [tickets: 4]        0: Open Day      [tickets: 4]  ✗ inherited!
 1: Music Fest    [tickets: 1]        1: Sports Day    [tickets: 1]  ✗
                                      2: Music Fest    [tickets: 1]  (new instance)

 key={event.id}                       key={event.id}
 7: Sports Day    [tickets: 4]        9: Open Day      [tickets: 1]  (new instance)
 8: Music Fest    [tickets: 1]        7: Sports Day    [tickets: 4]  ✓ moved
                                      8: Music Fest    [tickets: 1]  ✓ moved
${T}

React matches list children by key. Index keys tie state to *positions*; id keys tie state to *records*.`,
    simpleExample: {
      title: "Lecture 02 list rendering, upgraded to objects with ids",
      language: "tsx",
      code: `interface EventSummary {
  id: number;
  title: string;
}

const events: EventSummary[] = [
  { id: 1, title: "Tech Conference" },
  { id: 2, title: "Sports Day" },
  { id: 3, title: "Music Festival" },
];

export default function EventList() {
  return (
    <ul>
      {events.map((event) => (
        <li key={event.id}>{event.title}</li>
      ))}
    </ul>
  );
}`,
      walkthrough: [
        { lines: "6-10", text: "Hard-coded data like Week 02; from Week 03 this comes from the API." },
        { lines: "15", text: "map returns a new array of <li> elements; parentheses return JSX implicitly from the arrow." },
        { lines: "16", text: "key uses the stable database id, placed on the element returned by map." },
      ],
    },
    realExample: {
      title: "Supplied Events.tsx — key on the wrapper, plus filtering without mutation",
      language: "tsx",
      code: `import { useState } from "react";
import EventCard from "../components/EventCard";
import TicketCounter from "../components/TicketCounter";
import { useEvents } from "../hooks/useEvents";

function Events() {
  const { events, loading, error } = useEvents();
  const [maxPrice, setMaxPrice] = useState(50);

  if (loading) return <p>Loading events...</p>;
  if (error) return <p>{error}</p>;

  const visible = events
    .filter((e) => e.price <= maxPrice)
    .toSorted((a, b) => a.price - b.price);

  return (
    <section>
      <h2>Events</h2>
      <label>
        Max price: £{maxPrice}
        <input
          type="range"
          min={0}
          max={100}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
        />
      </label>
      {visible.map((event) => (
        <div key={event.id}>
          <EventCard title={event.title} location={event.location} price={event.price} />
          <TicketCounter />
        </div>
      ))}
    </section>
  );
}

export default Events;`,
      walkthrough: [
        { lines: "7-8", text: "Hooks are called first, before any early return (Rules of Hooks)." },
        { lines: "13-15", text: "The visible list is derived during render. filter and toSorted return new arrays, so the hook's state is never mutated." },
        { lines: "30-35", text: "The key is on the outer div, exactly like the supplied file. Because it's event.id, each TicketCounter's state stays with its event when the filter hides or reorders items." },
        { lines: "26", text: "Range inputs give strings; Number() converts before storing in numeric state." },
      ],
    },
    mistakes: [
      {
        mistake: "`key={index}` on a list that can be filtered, sorted or have items inserted.",
        fix: "Use a stable id from the data: `key={event.id}`.",
      },
      {
        mistake: "Putting the key on the inner component instead of the element returned by map: `<div><EventCard key={e.id} /></div>`.",
        fix: "Put it on the outermost returned element: `<div key={e.id}>…</div>`.",
      },
      {
        mistake: "`key={Math.random()}` to silence the warning.",
        fix: "That generates a new key every render, remounting every item and losing state. Use the record's id (or create ids once when data is created).",
      },
      {
        mistake: "`events.sort(...)` directly on state or props before mapping.",
        fix: "sort mutates. Use `toSorted()` or `[...events].sort(...)`.",
      },
      {
        mistake: "Forgetting to return from a map callback with braces: `events.map(e => { <li>{e.title}</li> })`.",
        fix: "Either use parentheses for an implicit return `e => (<li …/>)` or write `return` inside the braces.",
      },
    ],
    debug: {
      prompt: "After deleting the first event, the ticket count the user set for it appears on the next event. Find the cause and fix it.",
      language: "tsx",
      buggyCode: `import { useState } from "react";
import TicketCounter from "./TicketCounter";

interface Item { id: number; title: string }

export default function Shortlist({ initial }: { initial: Item[] }) {
  const [items, setItems] = useState(initial);

  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>
          {item.title}
          <TicketCounter />
          <button onClick={() => setItems(items.filter((i) => i.id !== item.id))}>
            Remove
          </button>
        </li>
      ))}
    </ul>
  );
}`,
      hint: "After removal, which key does the second item get? Which component instance does React reuse for it?",
      fixedCode: `import { useState } from "react";
import TicketCounter from "./TicketCounter";

interface Item { id: number; title: string }

export default function Shortlist({ initial }: { initial: Item[] }) {
  const [items, setItems] = useState(initial);

  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>
          {item.title}
          <TicketCounter />
          <button onClick={() => setItems(items.filter((i) => i.id !== item.id))}>
            Remove
          </button>
        </li>
      ))}
    </ul>
  );
}`,
      explanation:
        "With index keys, removing item 0 makes the old item 1 take key 0, so React reuses the first <li>'s TicketCounter instance (and its state) for it, and unmounts the last instance. Keying by item.id keeps each counter attached to its own item.",
    },
    challenge: {
      prompt:
        "Given `events: { id: number; title: string; categoryName: string }[]`, render them grouped: an `<h3>` per category followed by a `<ul>` of that category's titles. Use correct keys at both levels and do not mutate the input.",
      language: "tsx",
      hints: [
        "Build a list of unique category names with `[...new Set(events.map(e => e.categoryName))]`.",
        "The category name is unique, so it can be the key of each group.",
        "Use `<Fragment key={name}>` when returning h3 + ul without a wrapper.",
      ],
      solution: `import { Fragment } from "react";

interface Ev {
  id: number;
  title: string;
  categoryName: string;
}

export default function GroupedEvents({ events }: { events: Ev[] }) {
  const categories = [...new Set(events.map((e) => e.categoryName))];

  return (
    <div>
      {categories.map((name) => (
        <Fragment key={name}>
          <h3>{name}</h3>
          <ul>
            {events
              .filter((e) => e.categoryName === name)
              .map((e) => (
                <li key={e.id}>{e.title}</li>
              ))}
          </ul>
        </Fragment>
      ))}
    </div>
  );
}`,
      explanation:
        "Each map level needs its own keys, unique among its siblings: category names for groups, event ids for items. A keyed Fragment groups two elements without adding DOM. filter/map create new arrays so props are not mutated.",
    },
    examQuestions: [
      {
        question: "Why does React need a `key` when rendering a list, and why is the database id better than the array index?",
        answer:
          "React uses keys to match list items between renders so it can reuse the right component instances and DOM nodes. An id is stable and unique to a record, so state stays with the correct item when the list is reordered, filtered or has insertions. An index describes position, so after an insertion/removal items get each other's keys and state (e.g. input text, counters) can appear on the wrong item.",
        marks: 3,
      },
      {
        question: "Write JSX that renders an array `courses: { id: number; name: string }[]` as a list of `<li>` elements.",
        answer: `${T}tsx
<ul>
  {courses.map((course) => (
    <li key={course.id}>{course.name}</li>
  ))}
</ul>
${T}
Marks: map (1), key with id (1), expression output (1).`,
        marks: 3,
      },
      {
        question: "True or False: Keys must be unique across the whole application.",
        answer: "False. Keys only need to be unique among siblings in the same list.",
        marks: 1,
      },
    ],
    revision: [
      "Render lists with `array.map(item => <Element key={item.id} … />)`.",
      "Keys: unique among siblings and stable across renders — use the record id.",
      "Key goes on the outermost element returned by map (Fragment key for multiple roots).",
      "Index keys break state/focus on insert, delete, reorder or filter.",
      "Never generate keys randomly during render.",
      "Filter/sort on copies (`filter`, `toSorted`, `[...arr].sort`) — never mutate state or props.",
    ],
    visualizers: ["render-commit"],
  },

  /* ================================================================== */
  /* 6. Conditional rendering                                            */
  /* ================================================================== */
  {
    id: "react-conditional-rendering",
    moduleId: "m05-react",
    title: "Conditional Rendering & UI States",
    summary:
      "Choose what to show with ternaries, &&, and early returns — and always design the loading, error, empty and success states.",
    priority: "P0",
    examCritical: true,
    minutes: 30,
    objectives: [
      "Use a ternary, logical && and early returns to render conditionally.",
      "Explain and avoid the `{count && …}` pitfall that renders 0.",
      "Implement the four UI states (loading, error, empty, success) for API data.",
      "Build a tabbed interface where the selected tab controls what renders (Mock A4).",
    ],
    prerequisites: ["react-components-jsx", "react-state-events"],
    sources: [
      L02("Slides 23–24 — Ternary conditional; Conditional rendering (login/logout, admin UI, loading, empty, error)"),
      W03("Slide 22 — The Four UI States: loading, success, error, empty"),
      PROJECT("src/pages/Events.tsx — early returns for loading / error / empty"),
      GUIDE("File 16 — Events.tsx with loading, error alert and empty-state alert"),
      MOCK("Question A4 — displaying different content for a selected tab; D2 loading/error states"),
      DOCS("react.dev — Conditional Rendering", "https://react.dev/learn/conditional-rendering"),
    ],
    why: `Real interfaces are rarely static: a user is logged in or not, an admin sees a "Create event" button, a request is loading or has failed, a list is empty, a tab is selected. The Week 03 lecture insists that every API-driven component must answer **"what do I show while waiting, and what if it fails?"** — a blank screen is a bug.

Because JSX is JavaScript, conditional rendering uses ordinary JavaScript tools. Knowing *which* tool fits — and the classic \`0 &&\` trap — is frequently examined (Mock A4 asks exactly which technique displays content for a selected tab).`,
    analogy: `Conditional rendering is like a **shop window display** that changes depending on circumstances: "Opening soon" before the stock arrives (loading), "Sorry, closed due to flooding" (error), "Sold out" (empty), or the full display (success). The window is always showing *something* deliberate — never an empty glass pane.`,
    explain: {
      beginner: `There are three everyday ways to show different things:

**1. Ternary — one thing or another** (Lecture 02 slide 24):

${T}tsx
{isLoggedIn ? <p>Welcome back!</p> : <p>Please log in.</p>}
${T}

**2. Logical && — something or nothing:**

${T}tsx
{isAdmin && <button>Create event</button>}
${T}

**3. Early return — a whole different output:**

${T}tsx
if (loading) return <p>Loading events...</p>;
if (error) return <p>{error}</p>;
${T}

The Week 03 lecture's **four UI states** for data from an API:

| State | Condition | Show |
|---|---|---|
| Loading | \`loading === true\` | "Loading…" |
| Error | \`error\` is set | an error message |
| Empty | \`events.length === 0\` | "No events found" |
| Success | \`events.length > 0\` | the list |

"Loading…" and "No events found" are **different** states, and a successful response with zero rows is **not** an error.

Watch out: \`{events.length && <List />}\` shows a **0** on the page when the list is empty! Use \`events.length > 0 && …\` instead.`,
      developer: `**Choosing a tool:**

- Ternary \`cond ? A : B\` for either/or inside JSX.
- \`cond && A\` for show/hide — only when \`cond\` is a real boolean.
- Early return when an entire component's output differs (loading/error guard clauses), keeping the success JSX flat.
- A variable or lookup object for many branches:

${T}tsx
const panels: Record<Tab, ReactNode> = { details: <Details />, reviews: <Reviews /> };
return <div>{panels[tab]}</div>;
${T}

**The 0 pitfall.** \`&&\` returns its left operand if it's falsy. React renders nothing for \`false\`, \`null\`, \`undefined\` — but renders \`0\` (and \`NaN\`) as text. Fix with \`count > 0 &&\`, \`Boolean(count) &&\` or a ternary returning \`null\`.

**Returning null** from a component renders nothing (the component is still mounted and its hooks still run).

**Order of checks matters.** Check \`loading\`, then \`error\`, then empty, then success. And critically: **hooks must be called before any early return** — you can't put \`useState\` below \`if (loading) return …\`.

**Accessibility.** Loading messages can use \`role="status"\`, errors \`role="alert"\` (the Week 05 guide uses \`<p role="status">Loading events...</p>\`), so assistive technology announces them.

**Conditional class names**: \`className={tab === "details" ? "nav-link active" : "nav-link"}\` — conditional rendering of attributes, not elements.`,
      deep: `**Unmount vs hide.** \`cond && <Panel />\` *unmounts* Panel when cond becomes false — its state is destroyed and its effects clean up. Toggling CSS (\`hidden\` attribute / \`display:none\`) keeps it mounted with state intact. Choose deliberately: tab panels that should remember scroll/input can stay mounted and hidden; expensive panels that should reset can be unmounted.

**Position and identity.** \`{isEditing ? <Input /> : <Input />}\` — both branches are the same type at the same position, so React *keeps* the same instance and state across the switch. If you need a reset, give them different keys. Conversely \`{a && <X/>}{b && <Y/>}\` gives X and Y stable slots, because \`false\` still occupies a position in the children array.

**Status modelling.** Separate booleans (\`loading\`, \`error\`, \`data\`) allow impossible combinations (loading and error both true). A discriminated union is more robust:

${T}ts
type State<T> =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; data: T };
${T}

\`switch (state.status)\` then narrows the type — TypeScript knows \`data\` exists only in the success branch. TanStack Query exposes exactly this kind of status (\`'pending' | 'error' | 'success'\`).

**Error vs empty.** A 200 with \`[]\` is success-empty; a 404/500 (where \`response.ok\` is false) is an error your service must throw; a network failure rejects fetch. Mapping these correctly is what makes the four UI states honest.`,
    },
    mechanism: `${T}text
             Events() render
                  │
        loading? ─yes─► return <p role="status">Loading events...</p>
                  │no
        error?   ─yes─► return <div className="alert alert-danger">{error}</div>
                  │no
        events.length === 0 ─yes─► <div>No events are currently available.</div>
                  │no
                  ▼
        events.map(e => <EventCard key={e.id} … />)      (success)

  JSX value rules for {cond && X}:
   false / null / undefined / true ─► renders nothing
   0 / NaN                         ─► renders the text "0" / "NaN"   ⚠
${T}

Early returns handle whole-component states; ternaries and && handle pieces inside the success layout. All hooks run above the first return.`,
    simpleExample: {
      title: "Ternary, &&, and the 0 pitfall",
      language: "tsx",
      code: `interface HeaderProps {
  userName: string | null;
  isAdmin: boolean;
  unread: number;
}

export default function Header({ userName, isAdmin, unread }: HeaderProps) {
  return (
    <header>
      {userName ? <p>Welcome back, {userName}!</p> : <p>Please log in.</p>}
      {isAdmin && <button>Create event</button>}
      {/* ✗ {unread && <span>{unread} new</span>} would print 0 */}
      {unread > 0 && <span className="badge">{unread} new</span>}
    </header>
  );
}`,
      walkthrough: [
        { lines: "10", text: "Ternary: choose between two outputs; null/empty string userName is falsy so 'Please log in.' shows." },
        { lines: "11", text: "&& with a real boolean: show the button or nothing." },
        { lines: "12", text: "If unread is 0, `unread && …` evaluates to 0, which React renders as text." },
        { lines: "13", text: "Comparing with > 0 produces a boolean, so nothing renders when there are no messages." },
      ],
    },
    realExample: {
      title: "Tabs on an event details page (Mock A4) + four UI states",
      language: "tsx",
      code: `import { useState } from "react";
import { useEvents } from "../hooks/useEvents";

type Tab = "details" | "location" | "tickets";

export default function EventTabs() {
  const { events, loading, error } = useEvents();
  const [tab, setTab] = useState<Tab>("details");

  if (loading) return <p role="status">Loading events...</p>;
  if (error) return <p role="alert">{error}</p>;
  if (events.length === 0) return <p>No events found.</p>;

  const event = events[0];
  const tabs: Tab[] = ["details", "location", "tickets"];

  return (
    <section>
      <h2>{event.title}</h2>
      <nav>
        {tabs.map((t) => (
          <button
            key={t}
            className={t === tab ? "btn btn-primary" : "btn btn-outline-primary"}
            aria-pressed={t === tab}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </nav>
      {tab === "details" && <p>{event.description}</p>}
      {tab === "location" && <p>{event.location}</p>}
      {tab === "tickets" &&
        (event.availableTickets > 0 ? (
          <p>{event.availableTickets} tickets left at £{event.price}</p>
        ) : (
          <p>Sold out</p>
        ))}
    </section>
  );
}`,
      walkthrough: [
        { lines: "4", text: "A union type restricts the tab state to valid values." },
        { lines: "7-8", text: "Both hooks run before any early return." },
        { lines: "10-12", text: "Loading → error → empty guard clauses, in that order (Week 03 slide 22)." },
        { lines: "14", text: "Safe to index [0] now because the empty case has returned already." },
        { lines: "24", text: "Conditional className highlights the active tab." },
        { lines: "32-39", text: "The selected tab decides which content renders — conditional rendering is the answer to Mock A4. Nested ternary handles sold-out." },
      ],
    },
    mistakes: [
      {
        mistake: "`{events.length && <EventList />}` — shows a stray 0 when the list is empty.",
        fix: "Use a boolean condition: `{events.length > 0 && <EventList />}` or a ternary with an empty-state message.",
      },
      {
        mistake: "Treating an empty result as an error, or showing a blank screen while loading.",
        fix: "Design all four states: loading, error, empty and success are distinct.",
      },
      {
        mistake: "Calling a hook after an early return (`if (loading) return …; const [tab, setTab] = useState(…)`).",
        fix: "Call every hook at the top of the component before any return — otherwise hook order changes between renders.",
      },
      {
        mistake: "Using `if` inside JSX braces.",
        fix: "Inside JSX use ternary or &&; for complex logic compute a variable before the return or use early returns.",
      },
      {
        mistake: "Deeply nested ternaries that nobody can read.",
        fix: "Extract a small component or a lookup object (`Record<Tab, ReactNode>`), or use early returns.",
      },
    ],
    debug: {
      prompt: "When there are no events the page shows a lonely \"0\". While loading it briefly shows \"No events\". Fix both.",
      language: "tsx",
      buggyCode: `import { useEvents } from "../hooks/useEvents";

export default function Events() {
  const { events, loading, error } = useEvents();

  return (
    <section>
      {error && <p>{error}</p>}
      {events.length === 0 && <p>No events</p>}
      {events.length && (
        <ul>
          {events.map((e) => <li key={e.id}>{e.title}</li>)}
        </ul>
      )}
    </section>
  );
}`,
      hint: "What does `0 && x` evaluate to? And `loading` is never checked — events is [] initially.",
      fixedCode: `import { useEvents } from "../hooks/useEvents";

export default function Events() {
  const { events, loading, error } = useEvents();

  if (loading) return <p role="status">Loading events...</p>;
  if (error) return <p role="alert">{error}</p>;

  return (
    <section>
      {events.length === 0 ? (
        <p>No events</p>
      ) : (
        <ul>
          {events.map((e) => <li key={e.id}>{e.title}</li>)}
        </ul>
      )}
    </section>
  );
}`,
      explanation:
        "`events.length && …` returns 0 when empty and React renders 0 as text. And because the initial state is [] while loading, the empty message appeared during loading. Checking loading and error first, then a ternary for empty vs list, gives four honest states.",
    },
    challenge: {
      prompt:
        "Write a `BookingStatus` component that receives `status: \"pending\" | \"confirmed\" | \"cancelled\"` and `seats: number`. Render a coloured message per status (Bootstrap classes `text-warning`, `text-success`, `text-danger`) and, only for confirmed bookings with seats > 0, a line \"N seat(s) reserved\". Use a lookup object instead of nested ternaries.",
      language: "tsx",
      hints: [
        "Type the lookup with `Record<Status, { label: string; className: string }>`.",
        "Use `status === \"confirmed\" && seats > 0 && …` — both conditions are booleans.",
      ],
      solution: `type Status = "pending" | "confirmed" | "cancelled";

const STATUS_UI: Record<Status, { label: string; className: string }> = {
  pending: { label: "Awaiting confirmation", className: "text-warning" },
  confirmed: { label: "Booking confirmed", className: "text-success" },
  cancelled: { label: "Booking cancelled", className: "text-danger" },
};

interface BookingStatusProps {
  status: Status;
  seats: number;
}

export default function BookingStatus({ status, seats }: BookingStatusProps) {
  const ui = STATUS_UI[status];
  return (
    <div>
      <p className={ui.className}>{ui.label}</p>
      {status === "confirmed" && seats > 0 && (
        <p>
          {seats} seat{seats === 1 ? "" : "s"} reserved
        </p>
      )}
    </div>
  );
}`,
      explanation:
        "A Record keyed by the union guarantees (at compile time) that every status has a UI entry. The && chain only contains booleans, so it renders either the paragraph or nothing — never a stray 0.",
    },
    examQuestions: [
      {
        question: "A React application needs to display different content depending on whether a user has selected a particular tab. Which technique is most appropriate? (A) Conditional rendering (B) Database migration (C) Server-side rendering configuration (D) CSS font loading",
        answer: "A — Conditional rendering. The selected tab is held in state and JSX renders the matching panel (e.g. `{tab === \"reviews\" && <Reviews />}`).",
        marks: 1,
      },
      {
        question: "Name the four UI states every API-driven component should handle and explain why 'empty' is not an error.",
        answer:
          "Loading (request in progress), error (request failed / non-OK response), empty (successful response with no records) and success (records to display). An empty array is a valid successful answer from the server — it should show a friendly 'No events found' message, not an error alert.",
        marks: 3,
      },
      {
        question: "Explain why `{items.length && <List />}` can show '0' on screen and give a fix.",
        answer:
          "&& returns its left operand when it is falsy. For an empty array, items.length is 0, so the expression evaluates to 0, and React renders numbers as text (it only skips false/null/undefined/true). Fix: `{items.length > 0 && <List />}`.",
        marks: 2,
      },
    ],
    revision: [
      "Ternary for either/or; && for something-or-nothing; early return for whole-component states.",
      "`0 && x` renders 0 — use `x > 0 &&` or a ternary.",
      "Four UI states: loading, error, empty, success — empty is NOT an error.",
      "Check loading → error → empty → success; call all hooks before any return.",
      "Tabs = state + conditional rendering (Mock A4).",
      "&&/ternary unmount components (state lost); hiding with CSS keeps them mounted.",
      "Use role=\"status\" / role=\"alert\" for accessible loading/error messages.",
    ],
  },
  /* ================================================================== */
  /* 7. useEffect                                                        */
  /* ================================================================== */
  {
    id: "react-useeffect",
    moduleId: "m05-react",
    title: "useEffect — Synchronising with the Outside World",
    summary:
      "Effects run after commit to keep a component in sync with external systems (APIs, timers, subscriptions); the dependency array decides when they re-run and cleanup undoes them.",
    priority: "P0",
    examCritical: true,
    minutes: 50,
    objectives: [
      "Explain what a side effect is and why fetching on load belongs in useEffect (Week 03 slide 23).",
      "Predict when an effect runs for `[]`, `[id]` and no dependency array (Week 03 slide 24).",
      "Explain why the effect callback cannot be async and write the nested-async pattern (slide 25).",
      "Write cleanup functions and use an ignore flag or AbortController to avoid state updates after unmount (Mock D2).",
      "Explain StrictMode's development mount→unmount→mount check and recognise when you don't need an effect.",
    ],
    prerequisites: ["react-rendering-snapshots", "js-promises-async", "js-closures"],
    sources: [
      W03("Slides 21–26 — state for API data, four UI states, useEffect, dependency array, why the callback cannot be async, the complete flow"),
      PROJECT("src/hooks/useEvents.ts (Week 03 version without cleanup)"),
      GUIDE("Files 8–9 — useEvents/useEvent with `let active = true` cleanup flag and `[id]` dependency"),
      MOCK("Question D2 — load courses, loading/error states, avoid updating state after unmount (AbortController)"),
      DOCS("react.dev — Synchronizing with Effects", "https://react.dev/learn/synchronizing-with-effects"),
      DOCS("react.dev — You Might Not Need an Effect", "https://react.dev/learn/you-might-not-need-an-effect"),
      DOCS("MDN — AbortController", "https://developer.mozilla.org/en-US/docs/Web/API/AbortController"),
    ],
    why: `Rendering must be pure — it only calculates JSX. But a real component must also *do* things: fetch events from \`http://localhost:5229/api/events\`, start a timer, subscribe to a WebSocket, set \`document.title\`. These are **side effects**: they reach outside React.

\`useEffect\` gives those side effects a safe place: **after** React has committed the UI, and with a **cleanup** step that runs before the effect re-runs or the component disappears. Getting the dependency array and cleanup right prevents the classic bugs examined in Week 03 and the mock paper: infinite fetch loops, stale data from race conditions, and "state update on an unmounted component".`,
    analogy: `An effect is like **plugging an appliance into the wall** when you move into a room (mount). The dependency array says "unplug and re-plug whenever the *voltage setting* (\`id\`) changes". The cleanup is **unplugging** — always done before re-plugging and before you leave the room (unmount). In development, StrictMode deliberately plugs in, unplugs and plugs in again on arrival to check that your unplugging actually works.`,
    explain: {
      beginner: `A **side effect** is anything a component does that affects the world outside its JSX: calling an API, setting a timer, changing the page title.

${T}tsx
useEffect(() => {
  // runs AFTER React has updated the screen
}, [/* dependencies */]);
${T}

The **dependency array** controls *when* the effect runs (Week 03 slide 24):

| Code | Runs |
|---|---|
| \`useEffect(fn, [])\` | once after the first render (mount) |
| \`useEffect(fn, [id])\` | after mount **and** whenever \`id\` changes |
| \`useEffect(fn)\` | after **every** render ⚠ |

Fetching with no array and setting state inside causes an **infinite loop**: fetch → setEvents → re-render → effect runs again → fetch…

**The callback can't be \`async\`** (slide 25), because an async function always returns a Promise, but React expects either nothing or a **cleanup function**. Put the async work in an inner function and call it:

${T}tsx
useEffect(() => {
  async function loadEvents() {
    const data = await getEvents();
    setEvents(data);
  }
  loadEvents();
}, []);
${T}

**Cleanup** is the function you return from the effect. React calls it before re-running the effect and when the component is removed. Use it to stop timers, remove listeners, or ignore a response that arrives too late.`,
      developer: `**Lifecycle per dependency change:** render → commit → (previous cleanup, if any) → effect setup. On unmount → cleanup. Effects run after the browser has had a chance to paint, so they don't block the first display.

**Dependencies are not optional configuration — they're facts.** Every reactive value (props, state, values derived from them, functions declared in the component) that the effect reads must be listed. The \`react-hooks/exhaustive-deps\` ESLint rule enforces this. To depend on less, move things *inside* the effect or outside the component.

**Avoiding stale responses.** If the user goes from event 1 to event 2 quickly, the response for 1 may arrive after the one for 2. Two patterns:

${T}tsx
// 1) ignore flag (Campus Event guide: let active = true)
useEffect(() => {
  let active = true;
  eventService.get(id).then((data) => { if (active) setEvent(data); });
  return () => { active = false; };
}, [id]);

// 2) AbortController (Mock D2) — also cancels the network request
useEffect(() => {
  const controller = new AbortController();
  fetch(url, { signal: controller.signal }) /* ... */;
  return () => controller.abort();
}, [url]);
${T}

An aborted fetch rejects with a \`DOMException\` named \`"AbortError"\`; don't show that as an error.

**StrictMode (dev only)** runs setup → cleanup → setup once on mount to prove your cleanup is correct. Two requests in the Network tab during development is expected; with proper cleanup only one result is used.

**You might not need an effect.** Don't use effects to compute values from props/state (calculate during render), to respond to a user event (do it in the handler), or to reset state when a prop changes (use a \`key\`).`,
      deep: `**Mental model: synchronisation, not lifecycle.** Rather than "run on mount", think "keep this external system in sync with these values". The setup describes how to start syncing with the current values; cleanup describes how to stop. React may start/stop many times (dependency changes, StrictMode, future features such as preserving state for hidden UI), and a correct effect behaves the same whether it ran once or setup→cleanup→setup.

**Closures and stale values.** Each render's effect closes over that render's props and state. With \`[]\`, the effect only ever sees the first render's values — the source of "stale closure" bugs with intervals: \`setInterval(() => setCount(count + 1), 1000)\` with \`[]\` sets 1 forever. Use the updater \`setCount(c => c + 1)\` or include \`count\` in deps.

**Why not async directly?** Besides the Promise-return problem, an async callback makes cleanup impossible to express — the cleanup must be returned synchronously. TypeScript's \`EffectCallback\` type (\`() => void | Destructor\`) also rejects \`async () => {}\`.

**State updates after unmount.** React 18 removed the old warning (setting state on an unmounted component is now silently ignored), but the *real* problems remain: race conditions (old response overwriting new), wasted network requests, and work continuing after the user left. The cleanup patterns solve those.

**Effects for data fetching are the low-level approach.** They don't give caching, deduplication, retries or background refetch. The course moves to TanStack Query later precisely because hand-written effects get repetitive; the Service → Hook → Component structure means only the hook changes.

**Derived state anti-pattern.** \`useEffect(() => setVisible(events.filter(...)), [events])\` causes an extra render with stale UI between them. \`const visible = events.filter(...)\` during render is simpler and always consistent (memoise with useMemo only if it's measurably expensive).`,
    },
    mechanism: `${T}text
 mount (id = 1)
   render ─► commit DOM ─► paint ─► setup#1 (fetch event 1)
 [StrictMode dev only: cleanup#1 ─► setup#1' (fetch again)]

 props change (id = 2)
   render ─► commit ─► cleanup#1 (active=false / abort) ─► setup#2 (fetch event 2)
                          │
                          └─ late response for id 1 arrives ─► ignored ✓

 unmount
   cleanup#2 (abort / unsubscribe / clearInterval)

 Dependency array decides re-runs:
   []        setup once  (plus the dev-only StrictMode re-run)
   [id]      setup again when Object.is(prevId, id) is false
   (none)    setup after EVERY commit — setState inside ⇒ infinite loop
${T}

The cleanup of the previous run always happens before the next setup. Effects never run during render; they run after commit.`,
    simpleExample: {
      title: "Dependencies and cleanup — page title + timer",
      language: "tsx",
      code: `import { useEffect, useState } from "react";

export default function CountdownTitle() {
  const [seconds, setSeconds] = useState(10);
  const [running, setRunning] = useState(false);

  // Sync the browser tab title with state
  useEffect(() => {
    document.title = seconds + "s until doors open";
  }, [seconds]);

  // Start/stop an interval when 'running' changes
  useEffect(() => {
    if (!running) return;
    const timerId = setInterval(() => {
      setSeconds((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(timerId);
  }, [running]);

  return (
    <div>
      <p>{seconds}s</p>
      <button onClick={() => setRunning((r) => !r)}>
        {running ? "Pause" : "Start"}
      </button>
    </div>
  );
}`,
      walkthrough: [
        { lines: "8-10", text: "document.title is an external system; the effect re-syncs it whenever seconds changes." },
        { lines: "14", text: "Returning early (no cleanup) when not running is allowed." },
        { lines: "15-17", text: "The updater form avoids a stale closure — the interval doesn't need seconds in its deps." },
        { lines: "18", text: "Cleanup clears the interval when running changes or the component unmounts. Without it, pausing would leave the timer ticking and StrictMode would create two intervals." },
        { lines: "19", text: "[running] — the effect re-runs only when the start/pause toggle changes." },
      ],
    },
    realExample: {
      title: "Mock D2 — load courses with loading/error/count and AbortController",
      language: "tsx",
      code: `import { useEffect, useState } from "react";

interface Course {
  id: number;
  title: string;
}

export default function CourseCount() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadCourses() {
      try {
        const response = await fetch("https://example.com/api/courses", {
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error("Request failed with status " + response.status);
        }
        const data: Course[] = await response.json();
        setCourses(data);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    void loadCourses();
    return () => controller.abort();
  }, []);

  if (loading) return <p role="status">Loading courses...</p>;
  if (error) return <p role="alert">Error: {error}</p>;
  return <p>{courses.length} courses available</p>;
}`,
      walkthrough: [
        { lines: "9-11", text: "Three pieces of state for the UI states; loading starts true because the request starts immediately." },
        { lines: "14", text: "One controller per effect run." },
        { lines: "16", text: "The async work lives in a nested function — the effect callback itself stays synchronous (Week 03 slide 25)." },
        { lines: "18-20", text: "Passing the signal lets cleanup cancel the HTTP request." },
        { lines: "21-23", text: "fetch only rejects on network failure, so a 404/500 must be turned into an error by checking response.ok." },
        { lines: "27", text: "An abort is not a user-facing error — return without setting state." },
        { lines: "30", text: "Don't touch state for an aborted (unmounted / superseded) run." },
        { lines: "34-35", text: "Call the function (void marks the promise as intentionally not awaited) and return the cleanup. [] = load when the component mounts." },
        { lines: "38-40", text: "Loading, error and success (count) rendering as the question requires." },
      ],
    },
    mistakes: [
      {
        mistake: "Omitting the dependency array on an effect that fetches and sets state.",
        fix: "That runs after every render → setState → render → infinite loop. Use `[]` for load-once or list the real dependencies like `[id]`.",
      },
      {
        mistake: "`useEffect(async () => { … }, [])`.",
        fix: "Define an async function inside the effect and call it; the effect must return nothing or a cleanup function, not a Promise.",
      },
      {
        mistake: "Leaving out a value the effect uses (e.g. `id`) from the dependency array.",
        fix: "The effect will keep using the stale value. List every reactive value it reads (follow the exhaustive-deps lint rule).",
      },
      {
        mistake: "No cleanup for intervals, listeners or requests.",
        fix: "Return `() => clearInterval(id)`, `removeEventListener`, `controller.abort()` or set an `active=false` flag.",
      },
      {
        mistake: "Using an effect to derive data: `useEffect(() => setTotal(price * qty), [price, qty])`.",
        fix: "Compute during render: `const total = price * qty;` — no extra state or render needed.",
      },
      {
        mistake: "Trying to 'fix' StrictMode's double fetch by removing StrictMode or adding a 'hasRun' ref.",
        fix: "Write a correct cleanup (abort/ignore). The double run is development-only and is there to expose missing cleanup.",
      },
    ],
    debug: {
      prompt: "This component hammers the API with hundreds of requests per second and TypeScript also complains about the effect callback. Fix it.",
      language: "tsx",
      buggyCode: `import { useEffect, useState } from "react";
import { getEvents } from "../services/eventService";
import type { Event } from "../types/Event";

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(async () => {
    const data = await getEvents();
    setEvents(data);
  });

  return <p>{events.length} events</p>;
}`,
      hint: "Two problems: what does an async function return, and when does an effect with no dependency array run?",
      fixedCode: `import { useEffect, useState } from "react";
import { getEvents } from "../services/eventService";
import type { Event } from "../types/Event";

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    let active = true;
    async function loadEvents() {
      const data = await getEvents();
      if (active) setEvents(data);
    }
    void loadEvents();
    return () => {
      active = false;
    };
  }, []);

  return <p>{events.length} events</p>;
}`,
      explanation:
        "Without a dependency array the effect runs after every render; each run sets new state (a new array reference), which re-renders and runs the effect again — an infinite fetch loop. The async callback returns a Promise where React expects undefined or a cleanup function. The fix wraps the async work in an inner function, adds `[]` so it runs on mount, and uses an active flag so a late response after unmount is ignored. (A production version would also catch errors and track loading.)",
    },
    challenge: {
      prompt:
        "Write an `EventDetails` component that receives `eventId: number` and loads `GET http://localhost:5229/api/events/{id}`. It must: re-fetch when eventId changes; reset to a loading state for the new id; ignore responses that belong to a previous id; handle non-OK responses as errors; render loading / error / the event title and location.",
      starterCode: `import { useEffect, useState } from "react";
import type { Event } from "../types/Event";

export default function EventDetails({ eventId }: { eventId: number }) {
  // TODO
}`,
      language: "tsx",
      hints: [
        "The dependency array is `[eventId]`.",
        "Call setLoading(true) / setError(null) at the start of the effect so the new id shows a loading state.",
        "Use an AbortController (or an ignore flag) and abort it in the cleanup.",
        "Build the URL with string concatenation or a template literal.",
      ],
      solution: `import { useEffect, useState } from "react";
import type { Event } from "../types/Event";

const API_URL = "http://localhost:5229/api";

export default function EventDetails({ eventId }: { eventId: number }) {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    setEvent(null);

    async function load() {
      try {
        const res = await fetch(API_URL + "/events/" + eventId, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("Failed to load event: " + res.status);
        const data: Event = await res.json();
        setEvent(data);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Failed to load event.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    void load();
    return () => controller.abort();
  }, [eventId]);

  if (loading) return <p role="status">Loading event...</p>;
  if (error) return <p role="alert">{error}</p>;
  if (!event) return <p>Event not found.</p>;

  return (
    <article>
      <h2>{event.title}</h2>
      <p>{event.location}</p>
    </article>
  );
}`,
      explanation:
        "`[eventId]` re-synchronises whenever the id changes. Before each new run React calls the previous cleanup, which aborts the old request, so a slow response for an earlier id can never overwrite the current one. Non-OK statuses are converted into errors because fetch resolves for 4xx/5xx. This mirrors the guide's useEvent(id) hook, using AbortController instead of an active flag.",
    },
    examQuestions: [
      {
        question: "Explain the difference between `useEffect(fn, [])`, `useEffect(fn, [id])` and `useEffect(fn)`.",
        answer:
          "`[]`: the effect runs once after the component mounts (no dependencies to change; in StrictMode development it is set up, cleaned up and set up again once). `[id]`: runs after mount and again whenever `id` changes, with the previous cleanup running first. No array: runs after every render — if it sets state this creates an infinite loop.",
        marks: 3,
      },
      {
        question: "Why can't the callback passed to useEffect be declared `async`? Show the correct pattern.",
        answer: `An async function always returns a Promise, but React expects the effect to return nothing or a cleanup function. Define and call an async function inside:
${T}tsx
useEffect(() => {
  async function load() {
    const data = await getEvents();
    setEvents(data);
  }
  load();
}, []);
${T}`,
        marks: 3,
      },
      {
        question: "(Mock D2) How can a component avoid updating state after it has been unmounted while a request is in progress?",
        answer:
          "Return a cleanup function from the effect. Either create an AbortController, pass `controller.signal` to fetch and call `controller.abort()` in the cleanup (ignoring the resulting AbortError), or use an `let active = true` flag that the cleanup sets to false and check it before calling setState. Cleanup runs on unmount and before the effect re-runs, which also prevents stale responses overwriting newer data.",
        marks: 3,
      },
      {
        question: "Why does a fetch in useEffect appear twice in the Network tab during development but once in production?",
        answer:
          "React StrictMode in development mounts, unmounts and re-mounts components once, running effect setup → cleanup → setup, to reveal missing cleanup. It does not do this in production builds. With a proper cleanup (abort/ignore) the first request's result is discarded.",
        marks: 2,
      },
    ],
    revision: [
      "Effects synchronise with external systems and run AFTER commit; rendering stays pure.",
      "`[]` = on mount; `[id]` = on mount + when id changes; no array = after every render (loop risk).",
      "Effect callbacks can't be async — nest an async function and call it.",
      "Return a cleanup: clearInterval, removeEventListener, controller.abort(), or active = false.",
      "Previous cleanup always runs before the next setup and on unmount — prevents stale responses.",
      "StrictMode (dev) runs setup → cleanup → setup to test your cleanup; production runs once.",
      "Check `response.ok`; ignore AbortError; don't derive state in effects — compute during render.",
    ],
    visualizers: ["useeffect-lifecycle"],
  },

  /* ================================================================== */
  /* 8. useRef, useContext, useReducer + Rules of Hooks                  */
  /* ================================================================== */
  {
    id: "react-useref-context-reducer",
    moduleId: "m05-react",
    title: "useRef, useContext, useReducer & the Rules of Hooks",
    summary:
      "useRef stores a mutable value or DOM node without re-rendering, useContext shares values down the tree without prop drilling, useReducer centralises complex state transitions — all governed by the Rules of Hooks.",
    priority: "P1",
    minutes: 45,
    objectives: [
      "Choose between useRef and useState, and use a ref to access a DOM element.",
      "Create a context with a provider and consume it with useContext to avoid prop drilling.",
      "Model state transitions with useReducer (action → reducer → new state) using a typed union of actions.",
      "State and apply the Rules of Hooks (top level only; only in components or custom hooks — Mock B4).",
    ],
    prerequisites: ["react-state-events", "react-props", "react-useeffect"],
    sources: [
      MOCK("Question B4 — custom Hooks must follow the Rules of Hooks (top level of a component or another Hook)"),
      L02("Slides 12–13 — state vs props (the basis for choosing other hooks)"),
      DOCS("react.dev — useRef", "https://react.dev/reference/react/useRef"),
      DOCS("react.dev — useContext", "https://react.dev/reference/react/useContext"),
      DOCS("react.dev — useReducer", "https://react.dev/reference/react/useReducer"),
      DOCS("react.dev — Rules of Hooks", "https://react.dev/reference/rules/rules-of-hooks"),
    ],
    why: `\`useState\` covers most component memory, but three situations come up constantly:

- You need to **remember something without re-rendering** (a timer id, the previous value) or to **reach a DOM node** (focus the search box) → \`useRef\`.
- Many components at different depths need the **same value** (theme, logged-in user) and passing it through every level is tedious → \`useContext\`.
- State changes follow **many related rules** (add/remove/update/clear a basket) and scattered \`setX\` calls become hard to follow → \`useReducer\`.

All of them are hooks, so the **Rules of Hooks** apply — a true/false item in the mock paper (B4). The lecture series covering state management in depth was not supplied, so this lesson uses the official React documentation.`,
    analogy: `- **useRef** is a **sticky note in your pocket**: you can rewrite it any time, but nobody else notices — the screen doesn't change.
- **useContext** is the **building's PA system**: the provider makes an announcement once and every room that has a speaker (consumer) hears it, without passing notes floor by floor (prop drilling).
- **useReducer** is a **bank teller with a rulebook**: you hand in a slip ("deposit £10") and the teller applies the rule to produce the new balance; you never edit the ledger yourself.`,
    explain: {
      beginner: `**useRef** gives you a box \`{ current: value }\` that keeps its contents between renders. Changing \`ref.current\` does **not** re-render. Common uses: pointing at a DOM element (\`<input ref={inputRef} />\` then \`inputRef.current?.focus()\`) or storing a timer id.

| | useState | useRef |
|---|---|---|
| Survives re-renders | yes | yes |
| Changing it re-renders | yes (via setter) | no |
| Use for | what the UI shows | behind-the-scenes values, DOM nodes |

**useContext** solves **prop drilling** — passing a prop through components that don't use it just to reach a deep child. You create a context, wrap part of the tree in a provider with a value, and any component inside can read it with \`useContext\`.

**useReducer** is an alternative to useState for complex state. You **dispatch** an action like \`{ type: "add", eventId: 3 }\`; a **reducer** function receives the current state and the action and returns the new state.

**Rules of Hooks** (anything starting with \`use\`):
1. Call hooks only at the **top level** — never inside \`if\`, loops, nested functions, or after an early return.
2. Call hooks only from **React function components** or **custom hooks**.`,
      developer: `**useRef in TypeScript (React 19).** \`useRef<HTMLInputElement>(null)\` returns a \`RefObject<HTMLInputElement | null>\`; React sets \`.current\` after commit and back to null on unmount — so access it in effects or handlers, never during render. In React 19 you must pass an initial value to useRef, and function components can receive \`ref\` as a normal prop.

**Context setup pattern:**

${T}tsx
const ThemeContext = createContext<ThemeValue | null>(null);
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}
${T}

In React 19 you can render \`<ThemeContext value={...}>\` directly as the provider; \`<ThemeContext.Provider value={...}>\` still works and is what older tutorials show. Consumers re-render when the provider's \`value\` changes by \`Object.is\` — so creating a new object every render re-renders all consumers; memoise it or keep it stable if that matters.

**useReducer:**

${T}tsx
type Action = { type: "increment" } | { type: "decrement" } | { type: "reset"; to: number };
function reducer(state: number, action: Action): number { switch (action.type) { /* ... */ } }
const [count, dispatch] = useReducer(reducer, 1);
${T}

Reducers must be **pure** and return new objects (no mutation), just like state setters. A discriminated union of actions gives exhaustive checking in the \`switch\`.

**When to use what:** local UI state → useState; complex transitions → useReducer; low-frequency global values (theme, auth user, locale) → context; frequently-changing shared client state → a store like Zustand; server data → TanStack Query.`,
      deep: `**Why the Rules of Hooks exist.** React doesn't know hook *names*; it stores hook state in a list on the component's fiber and matches each call **by order**. Render 1: [useState(tab), useEffect, useRef]. If a condition skips the first call on render 2, every subsequent hook receives the wrong slot — the effect gets the state's slot and so on. Hence: same hooks, same order, every render. The \`eslint-plugin-react-hooks\` rules (\`rules-of-hooks\`, \`exhaustive-deps\`) detect violations statically. The \`use\` prefix is how the linter (and humans) recognise a function that may call hooks. (React 19's \`use(promiseOrContext)\` API is the documented exception that may be called conditionally.)

**Refs and rendering.** Reading or writing \`ref.current\` during render makes output depend on something React doesn't track, breaking purity (and concurrent rendering). Refs are an escape hatch for handlers and effects. A common pattern: keep the *latest* callback in a ref so a long-lived interval or listener can call it without re-subscribing.

**Context performance.** Context propagates through \`memo\` boundaries: when the provider value changes, every consumer re-renders, regardless of which field it uses. Split contexts by update frequency (e.g. \`AuthUserContext\` vs \`AuthActionsContext\`), or use a store with selectors when values change often. Context is a *transport* mechanism, not a state manager — the state still lives in a useState/useReducer in the provider component.

**Reducer benefits.** All transitions in one pure function are easy to unit-test without rendering (\`expect(reducer(s, a)).toEqual(...)\`), and \`dispatch\` has a stable identity, so passing it via context doesn't cause extra consumer re-renders. Updates are queued like setState: \`dispatch\` doesn't change the current snapshot.`,
    },
    mechanism: `${T}text
 useRef                         useContext                        useReducer
 ┌──────────────┐              <ThemeContext value={theme}>        dispatch({type:"add", id:3})
 │ {current: x} │ same object     ├─ Layout (doesn't care)                 │
 └──────────────┘ every render    │   └─ Navbar                            ▼
  write: no re-render             │        └─ ThemeToggle ◄── useContext   reducer(state, action)
  DOM ref: set after commit       └─ Footer ◄── useContext                 │ pure, returns NEW state
                                  value changes ⇒ all consumers           ▼
                                  re-render                       Object.is changed? ⇒ re-render

 Rules of Hooks — React matches hooks by CALL ORDER:
   render 1: [0] useState(tab)  [1] useRef  [2] useEffect
   render 2: if (x) skipped useState ⇒ [0] useRef gets tab's slot ✗ broken
${T}

Refs are invisible to rendering; context broadcasts a value down a subtree; reducers turn actions into new state. Hook state is stored by position, which is why call order must never change.`,
    simpleExample: {
      title: "useRef for a DOM node and for a value that shouldn't re-render",
      language: "tsx",
      code: `import { useRef, useState } from "react";

export default function SearchBox() {
  const inputRef = useRef<HTMLInputElement>(null);
  const searches = useRef(0);
  const [query, setQuery] = useState("");

  function handleSearch() {
    searches.current += 1;
    console.log("Searches so far:", searches.current);
    inputRef.current?.focus();
  }

  return (
    <div>
      <input
        ref={inputRef}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search events"
      />
      <button onClick={handleSearch}>Search</button>
      <p>Searching for: {query}</p>
    </div>
  );
}`,
      walkthrough: [
        { lines: "4", text: "A DOM ref typed for an input; starts as null until React attaches it after commit." },
        { lines: "5", text: "A counter that must persist but should NOT cause a re-render when it changes." },
        { lines: "6", text: "query is displayed, so it belongs in state." },
        { lines: "9-10", text: "Mutating a ref is allowed (in handlers) and does not re-render." },
        { lines: "11", text: "Optional chaining because current may be null; focus() is an imperative DOM call — a legitimate use of a ref." },
        { lines: "17", text: "Attaching the ref; React sets inputRef.current to the <input> element." },
      ],
    },
    realExample: {
      title: "Theme context + basket reducer for CampusEvents",
      language: "tsx",
      code: `import { createContext, useContext, useReducer, useState } from "react";
import type { ReactNode } from "react";

/* ---------- Context: theme available anywhere ---------- */
type Theme = "light" | "dark";
interface ThemeValue {
  theme: Theme;
  toggle: () => void;
}
const ThemeContext = createContext<ThemeValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const toggle = () => setTheme((t) => (t === "light" ? "dark" : "light"));
  return <ThemeContext value={{ theme, toggle }}>{children}</ThemeContext>;
}

export function useTheme(): ThemeValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}

/* ---------- Reducer: basket transitions in one place ---------- */
interface Line {
  eventId: number;
  qty: number;
}
type BasketAction =
  | { type: "add"; eventId: number }
  | { type: "remove"; eventId: number }
  | { type: "clear" };

export function basketReducer(state: Line[], action: BasketAction): Line[] {
  switch (action.type) {
    case "add": {
      const exists = state.some((l) => l.eventId === action.eventId);
      return exists
        ? state.map((l) => (l.eventId === action.eventId ? { ...l, qty: l.qty + 1 } : l))
        : [...state, { eventId: action.eventId, qty: 1 }];
    }
    case "remove":
      return state.filter((l) => l.eventId !== action.eventId);
    case "clear":
      return [];
  }
}

export function BasketWidget() {
  const { theme, toggle } = useTheme();
  const [lines, dispatch] = useReducer(basketReducer, []);
  return (
    <div className={theme === "dark" ? "bg-dark text-light p-3" : "p-3"}>
      <button onClick={toggle}>Toggle theme</button>
      <button onClick={() => dispatch({ type: "add", eventId: 1 })}>Add event 1</button>
      <button onClick={() => dispatch({ type: "clear" })}>Clear</button>
      <p>{lines.reduce((sum, l) => sum + l.qty, 0)} tickets in basket</p>
    </div>
  );
}`,
      walkthrough: [
        { lines: "10", text: "Typed context with null default so misuse outside a provider can be detected." },
        { lines: "12-16", text: "The provider owns the state; context only transports it. React 19 lets you render <ThemeContext value=…> directly (older code: <ThemeContext.Provider>)." },
        { lines: "18-22", text: "A custom hook wraps useContext and narrows away null — consumers never deal with the null case." },
        { lines: "29-32", text: "A discriminated union of actions: TypeScript knows action.eventId exists for add/remove." },
        { lines: "34-47", text: "A pure reducer returns new arrays/objects; every case returns, so the return type is satisfied." },
        { lines: "50-51", text: "Hooks at the top level: context consumer + reducer." },
        { lines: "55", text: "dispatch sends an action; React calls the reducer during the next render." },
      ],
    },
    mistakes: [
      {
        mistake: "Calling a hook inside a condition: `if (isAdmin) { const [x, setX] = useState(0); }`.",
        fix: "Call hooks unconditionally at the top level and put the condition inside the hook's usage or effect.",
      },
      {
        mistake: "Storing displayed data in a ref and wondering why the UI doesn't update.",
        fix: "Changing `ref.current` never re-renders. Anything the UI displays belongs in state.",
      },
      {
        mistake: "Reading `inputRef.current.value` during render.",
        fix: "Refs are set after commit and aren't tracked by rendering. Read them in handlers or effects; use state for rendered values.",
      },
      {
        mistake: "Mutating state inside a reducer (`state.push(...)`, `return state`).",
        fix: "Reducers must be pure and return new arrays/objects, otherwise React bails out of the update.",
      },
      {
        mistake: "Using useContext without a matching provider above, then getting the default value (often null) and crashing.",
        fix: "Wrap the tree in the provider and expose a custom hook that throws a helpful error when the context is missing.",
      },
    ],
    debug: {
      prompt: "React throws \"Rendered more hooks than during the previous render\" when the user logs in. Fix the component.",
      language: "tsx",
      buggyCode: `import { useRef, useState } from "react";

export default function AdminPanel({ isAdmin }: { isAdmin: boolean }) {
  if (!isAdmin) {
    return <p>Admins only.</p>;
  }

  const [title, setTitle] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <input ref={inputRef} value={title} onChange={(e) => setTitle(e.target.value)} />
      <button onClick={() => inputRef.current?.focus()}>Focus</button>
    </div>
  );
}`,
      hint: "How many hooks run when isAdmin is false versus true?",
      fixedCode: `import { useRef, useState } from "react";

export default function AdminPanel({ isAdmin }: { isAdmin: boolean }) {
  const [title, setTitle] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  if (!isAdmin) {
    return <p>Admins only.</p>;
  }

  return (
    <div>
      <input ref={inputRef} value={title} onChange={(e) => setTitle(e.target.value)} />
      <button onClick={() => inputRef.current?.focus()}>Focus</button>
    </div>
  );
}`,
      explanation:
        "With the early return first, a non-admin render calls zero hooks and an admin render calls two, so the hook call order differs between renders — a Rules of Hooks violation. Moving the hooks above the early return makes every render call the same hooks in the same order.",
    },
    challenge: {
      prompt:
        "Rewrite the supplied TicketCounter using useReducer. Actions: `increment`, `decrement` (never below 1) and `set` with a `value` (clamped between 1 and 10). Keep the same UI (- / count / +) and add a 'Max' button that sets 10.",
      language: "tsx",
      hints: [
        "Type actions as a discriminated union on `type`.",
        "Use Math.min/Math.max for clamping.",
        "useReducer(reducer, 1) — the second argument is the initial state.",
      ],
      solution: `import { useReducer } from "react";

type TicketAction =
  | { type: "increment" }
  | { type: "decrement" }
  | { type: "set"; value: number };

const clamp = (n: number) => Math.min(10, Math.max(1, n));

function ticketReducer(tickets: number, action: TicketAction): number {
  switch (action.type) {
    case "increment":
      return clamp(tickets + 1);
    case "decrement":
      return clamp(tickets - 1);
    case "set":
      return clamp(action.value);
  }
}

export default function TicketCounter() {
  const [tickets, dispatch] = useReducer(ticketReducer, 1);

  return (
    <div>
      <button onClick={() => dispatch({ type: "decrement" })}>-</button>
      <span>{tickets}</span>
      <button onClick={() => dispatch({ type: "increment" })}>+</button>
      <button onClick={() => dispatch({ type: "set", value: 10 })}>Max</button>
    </div>
  );
}`,
      explanation:
        "All the rules (min 1, max 10) now live in one pure, easily testable function. The component only describes *what happened* (actions), not *how* state changes. dispatch receives the latest state in the reducer, so repeated dispatches don't suffer from stale snapshots.",
    },
    examQuestions: [
      {
        question: "(Mock B4) True or False: A React custom Hook must follow the Rules of Hooks, including being called at the top level of a component or another custom Hook.",
        answer:
          "True. Hooks (built-in or custom) must be called unconditionally at the top level of a function component or custom hook, never in loops, conditions or nested functions, because React identifies hook state by call order.",
        marks: 1,
      },
      {
        question: "Compare useRef and useState. Give one appropriate use for each.",
        answer:
          "Both persist values across renders. Updating state via its setter schedules a re-render, so it suits values shown in the UI (e.g. the number of tickets). Changing ref.current does not re-render, so it suits values the UI doesn't display, such as a timer id, or a reference to a DOM element to call focus().",
        marks: 3,
      },
      {
        question: "What is prop drilling and how does useContext address it?",
        answer:
          "Prop drilling is passing a prop through intermediate components that don't use it just so a deeply nested component can receive it. With context, a provider high in the tree supplies a value and any descendant reads it directly with useContext, so intermediate components don't need the prop. Consumers re-render when the provided value changes.",
        marks: 3,
      },
      {
        question: "Describe the flow of a state update with useReducer.",
        answer:
          "A component calls `dispatch(action)` (e.g. `{ type: \"add\", eventId: 3 }`). React queues it; on the next render it calls the pure `reducer(currentState, action)`, which returns a new state object. If the new state differs (Object.is), the component re-renders with it.",
        marks: 2,
      },
    ],
    revision: [
      "useRef: mutable `{ current }` box, persists, NO re-render; use for DOM nodes and timer ids.",
      "Don't read/write refs during render; use them in handlers and effects.",
      "Context: createContext → provider with value → useContext in descendants; fixes prop drilling.",
      "Consumers re-render when the provider value changes; context transports state, it doesn't own it.",
      "useReducer: dispatch(action) → pure reducer(state, action) → new state.",
      "Rules of Hooks: top level only (no conditions/loops/after early return); only in components or custom hooks.",
      "Hook state is matched by call order — that's why the rules exist.",
    ],
    visualizers: ["state-decision"],
  },
  /* ================================================================== */
  /* 9. Custom hooks                                                     */
  /* ================================================================== */
  {
    id: "react-custom-hooks",
    moduleId: "m05-react",
    title: "Custom Hooks — Service → Hook → Component",
    summary:
      "A custom hook is a function starting with `use` that bundles hooks (useState + useEffect + a service call) and returns a stable contract like { data, loading, error }.",
    priority: "P0",
    examCritical: true,
    minutes: 40,
    objectives: [
      "Extract data-loading logic from a page into a custom hook (useEvents, Week 03 slides 27–29).",
      "Explain the responsibilities of each layer in Service → Hook → Component.",
      "Write a generic `useFetch<T>(url)` hook that returns `{ data, loading, error }` and cleans up.",
      "Explain that custom hooks share logic, not state, and must follow the Rules of Hooks (Mock B4).",
    ],
    prerequisites: ["react-useeffect", "react-useref-context-reducer", "js-promises-async"],
    sources: [
      W03("Slides 16–18 — API logic vs UI logic, API service, separation of responsibilities"),
      W03("Slides 27–29 — Custom hooks, Service → Hook → Component, why custom hooks (useFetch<T> preview)"),
      PROJECT("src/hooks/useEvents.ts, src/services/eventService.ts, src/pages/Events.tsx"),
      GUIDE("Files 8–10 — useEvents, useEvent(id), useCategories with active-flag cleanup"),
      MOCK("Questions B4 (Rules of Hooks for custom Hooks), D2b (component or custom Hook), D2c and A19 (service module benefits)"),
      DOCS("react.dev — Reusing Logic with Custom Hooks", "https://react.dev/learn/reusing-logic-with-custom-hooks"),
    ],
    why: `Week 03 slide 27 points out that once \`Events.tsx\` loads data itself, it does **three jobs at once**: talking to the API, managing React state (\`useState\`, \`useEffect\`, try/catch) and rendering UI. Repeat that for bookings, categories and reviews and you copy the same 25 lines four times — and fix the same bug four times.

A **custom hook** moves the React-state part into a reusable function. The page shrinks to \`const { events, loading, error } = useEvents();\` plus JSX. And because the page only depends on the hook's **contract**, the course can later swap the internals for TanStack Query (Week 08) without touching the page — "only the hook changes" (slide 28).`,
    analogy: `Think of a custom hook as a **coffee machine with one button**. The café counter (component) doesn't grind beans, heat water or handle a jammed filter; it presses "latte" and gets a cup plus a status light (loading / error). The supplier (service) delivers the beans (HTTP + JSON). Each café that installs the machine gets **its own** machine with its own water tank — sharing the design, not the coffee. That's why two components calling \`useEvents()\` get independent state.`,
    explain: {
      beginner: `A **custom hook** is just a JavaScript function whose name starts with **\`use\`** and which calls other hooks.

The supplied project splits the work into three layers (Week 03 slide 28):

| Layer | File | Knows about |
|---|---|---|
| Service | \`eventService.ts\` | URLs, \`fetch\`, \`response.ok\`, JSON |
| Hook | \`useEvents.ts\` | \`useState\`, \`useEffect\`, loading, error |
| Component | \`Events.tsx\` | JSX, \`EventCard\`, layout |

The hook returns an object:

${T}tsx
const { events, loading, error } = useEvents();
${T}

and the page just renders the four UI states.

Two important rules:

1. The name **must start with \`use\`**, so React's lint rules (and other developers) know it calls hooks.
2. It must follow the **Rules of Hooks**: call it at the top level of a component or another custom hook — never inside an \`if\`, a loop or an event handler (Mock B4 is *True*).

Custom hooks share **logic**, not **data**. If two components both call \`useEvents()\`, each gets its own \`events\` state and makes its own request.`,
      developer: `**Contract first.** Return a small, stable shape: \`{ data, loading, error }\` (or named fields like \`events\`). Slide 29: "Reusability does NOT mean never repeat code" — useEvents, useBookings, useCategories may look nearly identical; the value is that consumers depend on the contract and the implementation can change in one place.

**Keep layers honest.** The service throws on \`!response.ok\` and returns typed data; the hook converts thrown errors into an \`error\` string and handles cleanup; the component never sees \`fetch\`.

**Parameters become dependencies.** \`useEvent(id)\` puts \`id\` in the effect's dependency array (guide File 9) and resets loading/error when it changes.

**Generic hook.** When the duplication is understood, collapse it:

${T}tsx
function useFetch<T>(url: string): { data: T | null; loading: boolean; error: string | null }
${T}

Callers choose \`T\`: \`useFetch<Event[]>(API + "/events")\`. Remember TypeScript's \`T\` is a compile-time *claim* — it doesn't validate the JSON; validate at the service boundary (e.g. Zod) if you need guarantees.

**Return-value stability.** If you return functions (e.g. \`refetch\`), consider \`useCallback\` so consumers can safely put them in dependency arrays.

**Improving the supplied useEvents.** The Week 03 file has no cleanup, so a response arriving after unmount (or the StrictMode dev re-mount) still calls setState; the Week 05 guide's version adds \`let active = true\` and a cleanup that sets it false. Prefer that version (or AbortController).`,
      deep: `**Why hooks share logic but not state.** A custom hook is not a special React entity — React never sees it. Calling \`useEvents()\` inside \`Events\` simply inlines its \`useState\`/\`useEffect\` calls into \`Events\`'s own hook list. The state therefore belongs to the *calling component's* fiber. Two callers = two independent copies. To truly share data you need a common owner: lift state up and pass it down, put it in context, use a store (Zustand) or a server cache (TanStack Query, which deduplicates requests by query key).

**Why the \`use\` prefix matters.** The Rules of Hooks are enforced statically: \`eslint-plugin-react-hooks\` only checks functions it recognises as components (capitalised) or hooks (\`use\` + capital letter). A function named \`getEvents\` that calls \`useState\` escapes the lint check, and a caller could invoke it conditionally — reintroducing the call-order bug. Conversely, don't prefix plain helpers with \`use\` if they don't call hooks.

**Designing state inside the hook.** Separate booleans (\`loading\`, \`error\`, \`data\`) can contradict each other; a discriminated union (\`{ status: "loading" } | { status: "error"; message } | { status: "success"; data }\`) makes impossible states unrepresentable — the shape TanStack Query's \`status\` uses.

**Where hand-written fetch hooks stop scaling.** No caching between components, no request deduplication, no retries, no background refetch, no invalidation after mutations. That is the motivation for TanStack Query; thanks to the Service → Hook → Component split, migrating means rewriting \`useEvents\` as \`useQuery({ queryKey: ["events"], queryFn: getEvents })\` while \`Events.tsx\` stays almost unchanged.

**Testing.** Hooks can be tested with \`renderHook\` from React Testing Library, mocking the service module — another benefit of the layer boundary.`,
    },
    mechanism: `${T}text
  Events.tsx (Component)                 knows: JSX, EventCard, UI states
     │  const { events, loading, error } = useEvents();
     ▼
  useEvents.ts (Hook)                    knows: useState, useEffect, cleanup
     │  useState x3 ─ useEffect(() => { … getEvents() … }, [])
     ▼
  eventService.ts (Service)              knows: URL, fetch, response.ok, JSON
     │  fetch("http://localhost:5229/api/events")
     ▼
  ASP.NET Core API ─► EF Core ─► SQLite

  Two components calling the hook:
   <Events/>   ─ useEvents() ─► own state A + own request
   <Sidebar/>  ─ useEvents() ─► own state B + own request   (logic shared, state NOT)
${T}

The hook's hooks run as part of the calling component. Swapping the hook's internals (e.g. to TanStack Query) leaves the component's contract unchanged.`,
    simpleExample: {
      title: "useEvents with cleanup (Week 03 hook + Week 05 active flag)",
      language: "ts",
      code: `import { useEffect, useState } from "react";
import { getEvents } from "../services/eventService";
import type { Event } from "../types/Event";

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadEvents() {
      try {
        const data = await getEvents();
        if (active) setEvents(data);
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : "Unable to load events.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadEvents();
    return () => {
      active = false;
    };
  }, []);

  return { events, loading, error };
}`,
      walkthrough: [
        { lines: "1-3", text: "A plain .ts file — the hook contains no JSX. It depends on the service, not on fetch directly." },
        { lines: "5", text: "Named `use…`, so the Rules of Hooks lint applies to it and its callers." },
        { lines: "6-8", text: "The same three state values the page used to manage itself." },
        { lines: "11", text: "The active flag from the Campus Event guide: set false in cleanup." },
        { lines: "15-16", text: "The service throws if !response.ok; we only store data if still mounted." },
        { lines: "18-20", text: "Thrown errors become a user-friendly string." },
        { lines: "27-29", text: "Cleanup makes late responses (unmount, StrictMode re-mount) harmless." },
        { lines: "32", text: "The contract the component relies on." },
      ],
    },
    realExample: {
      title: "Generic useFetch<T> with AbortController, and a page using it",
      language: "tsx",
      code: `// src/hooks/useFetch.ts
import { useEffect, useState } from "react";

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useFetch<T>(url: string): FetchState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    async function load() {
      try {
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error("Request failed: " + res.status);
        const json = (await res.json()) as T;
        setData(json);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Request failed");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    void load();
    return () => controller.abort();
  }, [url]);

  return { data, loading, error };
}

// src/pages/Categories.tsx
import { useFetch } from "../hooks/useFetch";

interface Category {
  id: number;
  name: string;
}

export default function Categories() {
  const { data, loading, error } = useFetch<Category[]>(
    "http://localhost:5229/api/categories",
  );

  if (loading) return <p role="status">Loading categories...</p>;
  if (error) return <p role="alert">{error}</p>;
  if (!data || data.length === 0) return <p>No categories.</p>;

  return (
    <ul>
      {data.map((c) => (
        <li key={c.id}>{c.name}</li>
      ))}
    </ul>
  );
}`,
      walkthrough: [
        { lines: "4-8", text: "The contract, generic over the data type T." },
        { lines: "10", text: "The caller chooses T; the hook doesn't know about events or categories." },
        { lines: "15-18", text: "Each run gets its own controller and resets loading/error for the new URL." },
        { lines: "22-24", text: "Check response.ok; the `as T` cast is a compile-time assertion only — it does not validate the JSON." },
        { lines: "27", text: "Aborts (unmount or URL change) are not errors." },
        { lines: "34-35", text: "[url] re-runs when the URL changes; cleanup aborts the stale request." },
        { lines: "49-51", text: "One line in the page gives typed data plus loading/error state." },
        { lines: "53-55", text: "The page only handles presentation: loading, error, empty, success." },
      ],
    },
    mistakes: [
      {
        mistake: "Naming a hook-calling function without the `use` prefix (e.g. `fetchEvents()` that calls useState).",
        fix: "Name it `useEvents`. The prefix lets the linter enforce the Rules of Hooks for it and its callers.",
      },
      {
        mistake: "Calling a custom hook conditionally or inside an event handler (`onClick={() => useEvents()}`).",
        fix: "Call it at the top level of a component; to fetch on demand, have the hook expose a function (e.g. `refetch`) or keep a trigger value in state.",
      },
      {
        mistake: "Expecting two components that call `useEvents()` to share the same data.",
        fix: "Each call has independent state. Lift state up, use context/a store, or a server cache like TanStack Query to share.",
      },
      {
        mistake: "Putting fetch URLs and response.ok checks inside the hook and the component.",
        fix: "Keep HTTP details in the service, React state in the hook, JSX in the component.",
      },
      {
        mistake: "Forgetting to include the hook's parameters (id, url) in its effect dependencies.",
        fix: "List them: `[id]` / `[url]`, so the hook reloads when the caller passes a new value.",
      },
    ],
    debug: {
      prompt: "The linter reports a Rules of Hooks violation and the page sometimes crashes with \"Rendered fewer hooks than expected\". Fix the hook and the page.",
      language: "tsx",
      buggyCode: `import { useEffect, useState } from "react";
import { getEvents } from "../services/eventService";
import type { Event } from "../types/Event";

function loadEventList() {
  const [events, setEvents] = useState<Event[]>([]);
  useEffect(() => {
    getEvents().then(setEvents);
  }, []);
  return events;
}

export default function Events({ showEvents }: { showEvents: boolean }) {
  if (!showEvents) return <p>Events hidden.</p>;
  const events = loadEventList();
  return <p>{events.length} events</p>;
}`,
      hint: "Look at the function's name and where it's called relative to the early return.",
      fixedCode: `import { useEffect, useState } from "react";
import { getEvents } from "../services/eventService";
import type { Event } from "../types/Event";

function useEventList() {
  const [events, setEvents] = useState<Event[]>([]);
  useEffect(() => {
    let active = true;
    getEvents().then((data) => {
      if (active) setEvents(data);
    });
    return () => {
      active = false;
    };
  }, []);
  return events;
}

export default function Events({ showEvents }: { showEvents: boolean }) {
  const events = useEventList();
  if (!showEvents) return <p>Events hidden.</p>;
  return <p>{events.length} events</p>;
}`,
      explanation:
        "A function that calls hooks is a hook and must be named `use…`. It was also called after an early return, so the number of hooks changed when `showEvents` toggled. Calling it unconditionally at the top level fixes the call order; the active flag avoids setting state after unmount. (A production version would also handle errors and loading.)",
    },
    challenge: {
      prompt:
        "Write a custom hook `useDebouncedValue<T>(value: T, delayMs: number): T` that returns `value` only after it has stopped changing for `delayMs`. Then use it in a search box so that `useFetch` is only called with the debounced query (URL: `http://localhost:5229/api/events?search=` + encoded query).",
      language: "tsx",
      hints: [
        "Keep the debounced value in state, initialised to `value`.",
        "In an effect depending on [value, delayMs], start a setTimeout that sets it; clear the timeout in cleanup.",
        "Use encodeURIComponent for the query string.",
      ],
      solution: `import { useEffect, useState } from "react";
import { useFetch } from "./useFetch";
import type { Event } from "../types/Event";

export function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timerId = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timerId);
  }, [value, delayMs]);

  return debounced;
}

export default function EventSearch() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 400);
  const { data, loading, error } = useFetch<Event[]>(
    "http://localhost:5229/api/events?search=" + encodeURIComponent(debouncedQuery),
  );

  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search" />
      {loading && <p role="status">Searching...</p>}
      {error && <p role="alert">{error}</p>}
      {data && (
        <ul>
          {data.map((e) => (
            <li key={e.id}>{e.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
}`,
      explanation:
        "Each keystroke changes `value`, so the previous timeout is cleared by the cleanup before a new one starts; only a pause of delayMs lets setDebounced run. The fetch hook depends on the URL, which only changes when the debounced value changes — far fewer requests. Both hooks are called at the top level and compose naturally. (Whether the backend supports a `search` parameter is an assumption for this exercise.)",
    },
    examQuestions: [
      {
        question: "(Mock D2b-style) Write a custom Hook `useCourses()` that loads `https://example.com/api/courses` and returns `{ courses, loading, error }`, avoiding state updates after unmount.",
        answer: `${T}tsx
function useCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const res = await fetch("https://example.com/api/courses", { signal: controller.signal });
        if (!res.ok) throw new Error("HTTP " + res.status);
        setCourses(await res.json());
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Failed");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    void load();
    return () => controller.abort();
  }, []);

  return { courses, loading, error };
}
${T}
Marks: state (1), effect with [] and nested async (2), response.ok + error handling (1), AbortController cleanup (1), returned contract (1).`,
        marks: 6,
      },
      {
        question: "Explain the Service → Hook → Component structure used in the CampusEvents frontend.",
        answer:
          "The service (eventService.ts) handles HTTP: URL, fetch, response.ok and JSON. The hook (useEvents.ts) manages React state and lifecycle: useState for events/loading/error and useEffect to call the service. The component (Events.tsx) only renders UI from the hook's { events, loading, error }. Each layer has one job, so e.g. swapping fetch for TanStack Query only changes the hook.",
        marks: 3,
      },
      {
        question: "Two components both call `useEvents()`. Do they share the same events state? Explain.",
        answer:
          "No. A custom hook shares logic, not state: its useState/useEffect calls run as part of each calling component, so each gets its own state and makes its own request. Sharing requires lifting state up, context, a store, or a cache like TanStack Query.",
        marks: 2,
      },
      {
        question: "(Mock D2c / A19) Why is an API service module beneficial when several components need the same endpoint?",
        answer:
          "It separates data-access logic from presentation: the URL, headers, response.ok checks and JSON parsing live in one place, so they're reused rather than duplicated, a bug fix or API change is made once, and components (and hooks) stay smaller and easier to test by mocking the service.",
        marks: 2,
      },
    ],
    revision: [
      "Custom hook = function named `use…` that calls other hooks and returns a contract like `{ data, loading, error }`.",
      "Service (HTTP) → Hook (React state/effects) → Component (JSX): one job per layer.",
      "Only the hook changes when you swap fetch for TanStack Query.",
      "Custom hooks share logic, NOT state — each caller gets its own copy.",
      "Follow the Rules of Hooks: top level of components/custom hooks only (Mock B4 = True).",
      "Hook parameters (id, url) must be effect dependencies; include cleanup (active flag / AbortController).",
      "Generic `useFetch<T>` removes duplication, but `T` is not runtime validation.",
    ],
    visualizers: ["architecture-flow", "useeffect-lifecycle"],
  },

  /* ================================================================== */
  /* 10. StrictMode                                                      */
  /* ================================================================== */
  {
    id: "react-strictmode",
    moduleId: "m05-react",
    title: "StrictMode — Development Double-Checks",
    summary:
      "<StrictMode> in main.tsx makes React render components twice and run effect setup → cleanup → setup once in development to expose impure code and missing cleanup; production is unaffected.",
    priority: "P1",
    minutes: 20,
    objectives: [
      "Identify StrictMode in the supplied main.tsx and explain what it wraps.",
      "List StrictMode's development-only behaviours: double render, double initialisers/updaters, extra effect setup+cleanup.",
      "Explain why console logs and network requests can appear twice in development.",
      "Use StrictMode's warnings to find missing effect cleanup rather than disabling it.",
    ],
    prerequisites: ["react-useeffect", "react-rendering-snapshots"],
    sources: [
      PROJECT("src/main.tsx — createRoot(...).render(<StrictMode><App /></StrictMode>)"),
      GUIDE("File 22 — main.tsx with StrictMode wrapping BrowserRouter and App"),
      PROJECT("src/hooks/useEvents.ts — Week 03 effect without cleanup (requests twice in dev)"),
      DOCS("react.dev — <StrictMode>", "https://react.dev/reference/react/StrictMode"),
      DOCS("react.dev — Synchronizing with Effects (how to handle the effect firing twice)", "https://react.dev/learn/synchronizing-with-effects"),
    ],
    why: `Students often open DevTools, see "Loading events" logged twice and two GET \`/api/events\` requests, and conclude their code is broken — or delete \`<StrictMode>\` to "fix" it. Neither is right. The Vite template and the course's \`main.tsx\` enable StrictMode deliberately: it is a **development-only stress test** that makes bugs which would appear rarely in production (impure renders, missing cleanup) appear **immediately and reliably**.`,
    analogy: `StrictMode is like a **fire drill**. In the training building (development), the alarm is rung on purpose: everyone leaves and comes back (unmount → remount) to prove the exits (cleanup functions) work. In the real event (production) there's no drill — but because you practised, a real evacuation (navigating away, changing an id) goes smoothly.`,
    explain: {
      beginner: `Open the supplied \`main.tsx\`:

${T}tsx
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
${T}

\`<StrictMode>\` renders **no visible UI**. It turns on extra checks for everything inside it, **only in development** (\`npm run dev\`).

What it does:

- Calls your component functions **twice** per render, to catch components that aren't pure.
- Runs every effect **setup → cleanup → setup** once when a component first mounts, as if the component was removed and immediately added back.
- Warns about some deprecated APIs.

So in development you may see:

- \`console.log\` messages inside components printed twice (the second one may appear greyed out),
- **two** requests for \`/api/events\` in the Network tab.

That's expected. With a **cleanup function** (e.g. the guide's \`let active = true … return () => { active = false; }\`), the first request's result is ignored and the app behaves correctly.

In the production build (\`npm run build\`) none of this double-calling happens.`,
      developer: `**Development-only behaviours (React 18/19):**

1. **Double rendering** of component bodies, and double-invocation of \`useState\`/\`useReducer\` initialisers, \`useMemo\` callbacks and state updater functions. One result is discarded. Pure code produces the same result twice, so nothing visible changes.
2. **Effect re-run on mount:** setup → cleanup → setup, for every effect in a newly mounted tree. In React 19 ref callbacks are also run, cleaned up and re-run.
3. **Deprecated API checks** (legacy APIs and patterns).

**Typical symptoms and the right fix:**

| Symptom in dev | Real bug exposed | Fix |
|---|---|---|
| Two intervals, timer runs 2× speed | no \`clearInterval\` | return cleanup |
| Duplicate event listeners | no \`removeEventListener\` | return cleanup |
| List gets items appended twice | mutating/accumulating in render or effect | immutable, idempotent updates |
| Two fetches | normal; a late result could clobber newer data | active flag / AbortController |

**Anti-fixes:** removing StrictMode, or using a \`hasRun\` ref to skip the second setup. Both hide the bug instead of fixing it — the same cleanup path runs in production whenever a dependency changes or the user navigates away and back.

StrictMode can wrap only part of the tree, but the course wraps the whole app (around \`BrowserRouter\` in the Week 05 guide), which is the recommended default.`,
      deep: `**Why double render?** React's model requires rendering to be pure so it can render speculatively (concurrent features, transitions, Suspense) and throw results away. A component that mutates a module variable, pushes into an array from props, or reads changing external data during render behaves differently on the second call — StrictMode makes that difference visible during development. React 19 reuses the first call's memoised results for \`useMemo\`/\`useCallback\` during the second render.

**Why remount effects?** React wants effects to be resilient to being stopped and restarted, because that happens in real life: dependency changes, Fast Refresh during development, and features that preserve state while hiding UI. The invariant to aim for is: *setup → cleanup → setup should be indistinguishable from a single setup* from the user's perspective. For subscriptions that's "connect, disconnect, connect"; for fetches it's "request, ignore, request".

**Fetching is the subtle case.** You can't "un-send" a GET, so two requests still hit the server in development. That's acceptable for reads. For non-idempotent operations (POST a booking) the lesson is different: these belong in **event handlers**, not in effects that run on mount. If a mutation is in an effect, StrictMode's double run is warning you about a design problem.

**Logs.** React 17 silenced logs in the second render; later versions show them, with React DevTools able to dim or hide the duplicate. Don't build debugging conclusions on log counts in dev.

**Production.** StrictMode checks are stripped from production builds; \`<StrictMode>\` there behaves like a fragment. Performance measurements should therefore be done on a production build.`,
    },
    mechanism: `${T}text
 DEVELOPMENT (inside <StrictMode>)                PRODUCTION
 ─────────────────────────────────                ──────────
 render: Events() ─► Events() again (compare)     render: Events() once
 commit DOM                                       commit DOM
 effect setup #1   (fetch A, active=true)         effect setup (fetch)
 effect cleanup #1 (active=false / abort A)
 effect setup #2   (fetch B, active=true)
 response A arrives ─► ignored ✓ (cleanup ran)
 response B arrives ─► setEvents ✓                response ─► setEvents

 Missing cleanup?  setInterval ×2 ─► timer runs double speed  ⇐ bug revealed
${T}

StrictMode doesn't create the bug; it makes an existing missing-cleanup bug happen every time in development instead of occasionally in production.`,
    simpleExample: {
      title: "Supplied main.tsx (Week 05 guide version)",
      language: "tsx",
      code: `import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);`,
      walkthrough: [
        { lines: "1", text: "StrictMode is a component exported from react." },
        { lines: "2", text: "React 18+/19 entry point: createRoot (ReactDOM.render was removed in React 19)." },
        { lines: "8", text: "The non-null assertion `!` tells TypeScript the #root element exists in index.html." },
        { lines: "9-13", text: "Everything inside StrictMode gets the development checks; it renders no DOM of its own." },
      ],
    },
    realExample: {
      title: "Seeing StrictMode expose a missing cleanup — live seat counter",
      language: "tsx",
      code: `import { useEffect, useState } from "react";

export default function LiveSeats({ eventId }: { eventId: number }) {
  const [seats, setSeats] = useState<number | null>(null);

  console.log("render LiveSeats", eventId); // twice per render in dev

  useEffect(() => {
    console.log("setup: start polling", eventId);
    let active = true;

    async function poll() {
      const res = await fetch("http://localhost:5229/api/events/" + eventId);
      if (!res.ok) return;
      const data: { availableTickets: number } = await res.json();
      if (active) setSeats(data.availableTickets);
    }

    void poll();
    const timerId = setInterval(() => void poll(), 5000);

    return () => {
      console.log("cleanup: stop polling", eventId);
      active = false;
      clearInterval(timerId);
    };
  }, [eventId]);

  return <p>{seats === null ? "Checking seats..." : seats + " seats left"}</p>;
}`,
      walkthrough: [
        { lines: "6", text: "Logging during render is harmless but appears twice in development because StrictMode double-renders." },
        { lines: "9", text: "In dev, the console shows: setup → cleanup → setup on mount. In production: setup once." },
        { lines: "20", text: "Without the clearInterval in cleanup, StrictMode would leave TWO intervals polling — the bug is immediately visible in the Network tab." },
        { lines: "22-26", text: "Cleanup stops polling and ignores late responses; the same code path runs in production when eventId changes or the component unmounts." },
      ],
    },
    mistakes: [
      {
        mistake: "Removing `<StrictMode>` because requests or logs appear twice.",
        fix: "Keep it. Add correct cleanup; the double run is development-only and is there to expose bugs.",
      },
      {
        mistake: "Using a `useRef` flag to stop the effect running a second time.",
        fix: "That hides missing cleanup. Make setup → cleanup → setup behave like a single setup instead.",
      },
      {
        mistake: "Thinking StrictMode affects production performance or behaviour.",
        fix: "Its checks are development-only; production renders and runs effects once per normal React rules.",
      },
      {
        mistake: "Sending POST/booking requests from an effect on mount and seeing duplicates in dev.",
        fix: "Mutations triggered by the user belong in event handlers, not in mount effects.",
      },
      {
        mistake: "Side effects during render (pushing into an outer array, incrementing a module counter).",
        fix: "Keep render pure; StrictMode's double render makes such bugs appear as doubled data.",
      },
    ],
    debug: {
      prompt: "In development the clock jumps two seconds at a time and the console shows the listener firing twice per key press. Fix the component without removing StrictMode.",
      language: "tsx",
      buggyCode: `import { useEffect, useState } from "react";

export default function Kiosk() {
  const [seconds, setSeconds] = useState(0);
  const [lastKey, setLastKey] = useState("");

  useEffect(() => {
    setInterval(() => setSeconds((s) => s + 1), 1000);
    window.addEventListener("keydown", (e) => {
      console.log("key", e.key);
      setLastKey(e.key);
    });
  }, []);

  return (
    <p>
      Open for {seconds}s — last key: {lastKey}
    </p>
  );
}`,
      hint: "StrictMode ran the setup twice. What did the first setup leave behind?",
      fixedCode: `import { useEffect, useState } from "react";

export default function Kiosk() {
  const [seconds, setSeconds] = useState(0);
  const [lastKey, setLastKey] = useState("");

  useEffect(() => {
    const timerId = setInterval(() => setSeconds((s) => s + 1), 1000);
    function handleKey(e: KeyboardEvent) {
      console.log("key", e.key);
      setLastKey(e.key);
    }
    window.addEventListener("keydown", handleKey);

    return () => {
      clearInterval(timerId);
      window.removeEventListener("keydown", handleKey);
    };
  }, []);

  return (
    <p>
      Open for {seconds}s — last key: {lastKey}
    </p>
  );
}`,
      explanation:
        "StrictMode's mount → unmount → mount ran the setup twice; with no cleanup the first interval and listener were never removed, so there were two of each. Returning a cleanup that clears the interval and removes the same handler reference makes the double setup harmless — and fixes the real production leak that would happen on unmount.",
    },
    challenge: {
      prompt:
        "Predict the development console output (inside StrictMode) when this component first mounts, then the production output. Then explain whether the code is correct.\n\n```tsx\nfunction Chat({ room }: { room: string }) {\n  console.log(\"render\", room);\n  useEffect(() => {\n    console.log(\"connect\", room);\n    return () => console.log(\"disconnect\", room);\n  }, [room]);\n  return <h2>{room}</h2>;\n}\n```",
      language: "text",
      hints: [
        "Component bodies are called twice in development.",
        "Effects on mount: setup → cleanup → setup.",
        "Production does neither extra step.",
      ],
      solution: `Development (StrictMode), first mount with room = "general":
render general
render general        (second render, may be greyed out)
connect general
disconnect general    (simulated unmount)
connect general       (simulated remount)

Production:
render general
connect general

The code is correct: every connect is matched by a disconnect, so after the
dev double-run exactly one connection is active — the same end state as production.`,
      explanation:
        "StrictMode double-invokes the render function and stress-tests effects with an extra cleanup+setup. Because the effect has a symmetrical cleanup, the end state is identical in both modes, which is exactly what StrictMode verifies.",
    },
    examQuestions: [
      {
        question: "What does wrapping `<App />` in `<StrictMode>` do in a React 19 application?",
        answer:
          "It enables extra development-only checks for the wrapped tree: components (and state initialisers/updaters) are invoked twice to detect impure rendering, every effect is set up, cleaned up and set up again on mount to detect missing cleanup, and deprecated APIs are warned about. It renders no UI and has no effect in production builds.",
        marks: 3,
      },
      {
        question: "A student sees two GET /api/events requests when the Events page loads in development and only one in production. Explain why and what they should do.",
        answer:
          "StrictMode in development runs the effect setup → cleanup → setup on mount, so the fetch happens twice. This is expected. They should keep StrictMode and make sure the effect has a cleanup (an active flag or AbortController) so the first response is ignored/aborted; production runs the effect once.",
        marks: 3,
      },
      {
        question: "True or False: Removing StrictMode is the recommended way to stop effects running twice.",
        answer:
          "False. The double run is a development check that exposes missing cleanup; the fix is a correct cleanup function, not removing StrictMode.",
        marks: 1,
      },
    ],
    revision: [
      "`<StrictMode>` (in main.tsx) adds development-only checks; it renders no UI.",
      "Dev: component bodies, initialisers and updaters run twice — render must be pure.",
      "Dev: effects run setup → cleanup → setup on mount — cleanup must undo setup.",
      "Duplicate logs/requests in dev are expected; production runs once.",
      "Fix with cleanup (clearInterval, removeEventListener, abort, active flag) — never by removing StrictMode or ref hacks.",
      "User-triggered mutations (POST) belong in event handlers, not mount effects.",
    ],
    visualizers: ["useeffect-lifecycle"],
  },
];
