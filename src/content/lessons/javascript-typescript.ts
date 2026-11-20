import type { Lesson, SourceRef } from "../types";

/* ------------------------------------------------------------------ */
/* Source helpers — every "university" ref points at a real file.      */
/* ------------------------------------------------------------------ */

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

const EXAMPLES = (detail: string): SourceRef => ({
  kind: "university",
  label: "Advanced Examples (module JS example files)",
  detail,
});

const MOCK = (detail: string): SourceRef => ({
  kind: "mock",
  label: "MOCK ICT paper",
  detail,
});

const MDN = (label: string, url: string): SourceRef => ({
  kind: "supplementary",
  label: `MDN — ${label}`,
  url,
});

const TS_DOCS = (label: string, url: string): SourceRef => ({
  kind: "supplementary",
  label: `TypeScript Handbook — ${label}`,
  url,
});

export const jsTsLessons: Lesson[] = [
  /* ================================================================ */
  /* 1. Variables & scope                                              */
  /* ================================================================ */
  {
    id: "js-variables-scope",
    moduleId: "m03-javascript",
    title: "Variables & Scope: let, const, var, Hoisting and the TDZ",
    summary:
      "How let, const and var differ in scope, reassignment and hoisting — and why modern React code uses const by default.",
    priority: "P1",
    minutes: 25,
    objectives: [
      "Choose between const, let and var and justify the choice",
      "Distinguish block scope from function scope and predict where a variable is visible",
      "Explain hoisting and the temporal dead zone (TDZ) and recognise the ReferenceError it causes",
      "Describe a lexical environment and how the scope chain is searched",
    ],
    prerequisites: [],
    sources: [
      L02("Slide 17 (Why Modern JavaScript?), Slide 18 (Var, Let and Const — notes: use const by default, let when reassignment is required, avoid var)"),
      EXAMPLES("Examples/Advanced/var-let-const-JS.html"),
      MDN("let", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let"),
      MDN("const", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const"),
      MDN("var", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/var"),
    ],
    why: `Every React component, hook and API call you write starts with a variable declaration. Choosing the wrong keyword causes real bugs: a \`var\` inside an \`if\` block leaks out and collides with another variable, a loop counter declared with \`var\` is shared by every callback, and reading a \`let\` before its declaration throws a \`ReferenceError\` that crashes a component.

Lecture 02 gives the rule of thumb — **use \`const\` by default, \`let\` when you must reassign, avoid \`var\`**. This lesson explains *why* that rule exists, so you can predict what code does instead of memorising it.`,
    analogy: `Think of scopes as **rooms in a building**.

- A \`let\` or \`const\` variable is a note pinned to the wall of the **room (block)** where it was declared. People in that room, and in any smaller room *inside* it, can read it. People outside cannot.
- A \`var\` variable ignores the internal walls of a floor: it is pinned to the **whole floor (function)**, even if you wrote it inside a cupboard (\`if\` block).
- The **TDZ** is like a note that has been reserved on the wall but is still face-down: the room knows the name exists, but if you try to read it before it is turned over (the declaration line runs), you get an error instead of a blank note.`,
    explain: {
      beginner: `A **variable** is a named box that holds a value. JavaScript has three ways to create one:

- \`const\` — the name is bound **once**. You cannot point it at a new value later. Use it for almost everything.
- \`let\` — the name can be **reassigned** (e.g. a loop counter or a running total).
- \`var\` — the old (pre-2015) keyword. It works differently and causes surprising bugs, so modern code avoids it.

**Scope** is "where in the code can I see this name?". \`let\` and \`const\` are **block-scoped**: a block is anything between \`{ }\` — an \`if\`, a \`for\` loop, a function body. Outside those braces the name does not exist. \`var\` is **function-scoped**: it is visible everywhere inside the surrounding function, even outside the \`if\` block where you wrote it. The module's own example shows this — \`var message\` declared inside \`if (true) { ... }\` is still printed by a \`console.log(message)\` *after* the block.

Important: \`const\` does **not** freeze the value. A \`const\` array can still have items pushed into it; you just cannot write \`basket = somethingElse\`.

Rule from Lecture 02: start with \`const\`; switch to \`let\` only when you genuinely reassign; don't use \`var\`.`,
      developer: `Practical differences you will hit in React/TypeScript code:

| | \`var\` | \`let\` | \`const\` |
|---|---|---|---|
| Scope | function | block | block |
| Reassign | yes | yes | **no** |
| Redeclare in same scope | yes | no (SyntaxError) | no |
| Hoisted | yes, initialised to \`undefined\` | yes, but in TDZ | yes, but in TDZ |
| Becomes a \`window\` property at the top level of a classic script | yes | no | no |

\`\`\`js
const pi = 3.14;      // never reassigned
let radius = 5;       // reassigned later
radius = 10;          // OK
// pi = 3.14159;      // TypeError: Assignment to constant variable.
\`\`\`

In components, nearly everything is \`const\`: \`const [events, setEvents] = useState([])\`, \`const total = items.reduce(...)\`, \`const handleClick = () => {...}\`. Each render is a fresh function call, so you get fresh \`const\` bindings — you never "reassign" state, you call the setter and React re-runs the function.

\`let\` appears in imperative helpers (loops, accumulating a string, retry counters). If you find yourself writing \`let x; if (a) x = 1; else x = 2;\`, a ternary with \`const\` is usually clearer: \`const x = a ? 1 : 2;\`.

\`const\` + objects: the *binding* is constant, the *object* is mutable. \`const basket = []; basket.push(item)\` is legal — which is exactly why "I used const so it's immutable" is a common exam trap.`,
      deep: `**Lexical environments.** When JavaScript runs a function or enters a block, it creates an *environment record* that maps names to values, plus a pointer to the *outer* environment where that code was **written** (not where it is called). Looking up a name walks this chain outward until the global environment; if nothing matches you get \`ReferenceError: x is not defined\`.

**Hoisting** is a consequence of how environments are created. Before a scope's code runs, the engine registers its declarations:
- \`var\` names are created **and initialised to \`undefined\`** — so reading one early gives \`undefined\`, silently.
- \`let\`/\`const\`/\`class\` names are created but **left uninitialised**. From the start of the block until the declaration line executes, the name is in the **temporal dead zone**; any access throws \`ReferenceError: Cannot access 'x' before initialization\`.
- Function declarations are hoisted **with their body**, which is why you can call \`function helper() {}\` above its definition.

The TDZ is *temporal*, not positional: a function defined above a \`let\` may reference it safely as long as it is **called** after the declaration has run.

**Shadowing.** An inner \`let total\` hides an outer \`total\` inside its block — legal but a frequent source of "why is my total 0?" bugs. ESLint's \`no-shadow\` rule catches it.

**Loops.** \`for (let i = 0; ...)\` creates a **new binding of \`i\` per iteration**, which is why callbacks created in the loop each see their own value. \`var i\` is one shared binding (see *Closures*).

**Modules.** Top-level \`let\`/\`const\` in an ES module are module-scoped; they never become \`window\` properties. Vite/React projects are all modules, so accidental globals effectively disappear.`,
    },
    mechanism: `\`\`\`text
 Global environment          { pi: 3.14, radius: 5, calculateArea: fn }
        ▲ outer
 Function env: calculateArea { area: <var, hoisted = undefined> }
        ▲ outer
 Block env: if (...) { }     { label: <TDZ until its line runs> }

 Lookup of "radius" inside the if-block:
   block env? no ──▶ function env? no ──▶ global env? YES → 5

 Timeline of a block with const:
   {  ─────────── TDZ for label ───────────┐
      console.log(label)  ✗ ReferenceError  │
      const label = "Basket" ◀──────────────┘ initialised here
      console.log(label)  ✓ "Basket"
   }
\`\`\`

- Each \`{ }\` block creates a new environment for \`let\`/\`const\`; \`var\` skips blocks and lands in the nearest **function** environment.
- The outer pointer is fixed where the code is **written** (lexical scoping) — this is the foundation for closures.
- Hoisting = names are registered before execution; only \`var\` is pre-filled with \`undefined\`.`,
    simpleExample: {
      title: "Block scope vs function scope (from var-let-const-JS.html)",
      language: "js",
      code: `const pi = 3.14;
let radius = 5;

function calculateArea() {
  var area = pi * radius * radius;
  console.log("Area:", area);
}

calculateArea();        // Area: 78.5
radius = 10;            // allowed: let can be reassigned
calculateArea();        // Area: 314

if (true) {
  var message = "Hello, World!";
  let secret = "block only";
}
console.log(message);   // Hello, World!  (var leaked out of the block)
console.log(typeof secret); // "undefined" — secret does not exist here`,
      walkthrough: [
        { lines: "1-2", text: "`pi` never changes, so `const`; `radius` will be reassigned, so `let`." },
        { lines: "4-7", text: "`area` is function-scoped; it only exists while `calculateArea` runs. The function reads `pi` and `radius` from the outer (global) scope." },
        { lines: "9-11", text: "The function reads the *current* value of `radius` on each call: 3.14 × 5 × 5 = 78.5, then 3.14 × 10 × 10 = 314." },
        { lines: "13-16", text: "`var message` is attached to the enclosing function/global scope, not the `if` block. `let secret` belongs only to the block." },
        { lines: "17-18", text: "`message` is visible after the block; `secret` is not. `typeof` on an undeclared name returns \"undefined\" instead of throwing." },
      ],
    },
    realExample: {
      title: "Basket summary helper: const by default, let only for the accumulator",
      language: "ts",
      code: `interface BasketItem {
  name: string;
  price: number;
  quantity: number;
}

export function summariseBasket(items: BasketItem[]): string {
  const VAT_RATE = 0.2;
  let subtotal = 0;

  for (const item of items) {
    const lineTotal = item.price * item.quantity;
    subtotal += lineTotal;
  }

  const vat = subtotal * VAT_RATE;
  const label = items.length === 1 ? "item" : "items";
  return \`\${items.length} \${label}: £\${(subtotal + vat).toFixed(2)} inc. VAT\`;
}

console.log(
  summariseBasket([
    { name: "Notebook", price: 3.5, quantity: 4 },
    { name: "Pen", price: 1.25, quantity: 2 },
  ]),
); // "2 items: £19.80 inc. VAT"`,
      walkthrough: [
        { lines: "8", text: "A constant that never changes — `const`, conventionally UPPER_CASE." },
        { lines: "9", text: "`subtotal` is reassigned on every loop iteration, so it is the one place `let` is justified." },
        { lines: "11-14", text: "`for...of` with `const item`: each iteration gets a fresh binding, so `const` is fine even though the loop repeats. `lineTotal` is block-scoped to one iteration." },
        { lines: "16-18", text: "Derived values use `const`; a ternary avoids a `let label` + if/else. 3.5×4 + 1.25×2 = 16.50; +20% VAT = 19.80." },
      ],
    },
    mistakes: [
      {
        mistake: "Believing `const` makes an object or array immutable (`const basket = []` then being surprised that `basket.push(x)` works).",
        fix: "`const` only stops reassignment of the *name*. To avoid mutation use immutable update patterns (spread) or `Object.freeze` (shallow).",
      },
      {
        mistake: "Using `var` inside `if`/`for` blocks and expecting it to stay inside the block.",
        fix: "Use `let`/`const`, which are block-scoped. Reserve `var` knowledge for reading legacy code.",
      },
      {
        mistake: "Reading a `let`/`const` variable above its declaration and getting `ReferenceError: Cannot access 'x' before initialization`.",
        fix: "Declare before use. The TDZ exists on purpose — it turns silent `undefined` bugs (which `var` gives you) into loud errors.",
      },
      {
        mistake: "Declaring everything with `let` \"just in case\".",
        fix: "Default to `const`. A `let` should tell the reader \"this value changes later\" — if it never does, ESLint's `prefer-const` will flag it.",
      },
    ],
    debug: {
      prompt: "Calling `getBasketLabel([])` crashes the basket page with a ReferenceError. Find and fix the bug.",
      language: "js",
      buggyCode: `function getBasketLabel(items) {
  if (items.length === 0) {
    return prefix + "empty";
  }
  const prefix = "Basket: ";
  return prefix + items.length + " item(s)";
}

console.log(getBasketLabel([]));`,
      hint: "Where is `prefix` declared relative to where it is first read? What happens to `const` names before their line runs?",
      fixedCode: `function getBasketLabel(items) {
  const prefix = "Basket: ";
  if (items.length === 0) {
    return prefix + "empty";
  }
  return prefix + items.length + " item(s)";
}

console.log(getBasketLabel([])); // "Basket: empty"`,
      explanation: "`prefix` is hoisted to the top of the function body but stays in the temporal dead zone until `const prefix = ...` executes. The empty-basket branch reads it first, so the engine throws `ReferenceError: Cannot access 'prefix' before initialization`. Moving the declaration above its first use fixes it. With `var` the code would *not* crash but would silently return `\"undefinedempty\"` — the TDZ makes the bug visible.",
    },
    challenge: {
      prompt: "Predict what is logged **without running the code**, then rewrite the function so that nothing uses `var` and the discount is always a defined number.",
      starterCode: `function checkout(total) {
  if (total > 50) {
    var discount = 5;
  }
  console.log(discount);
  var total = total - (discount || 0);
  return total;
}

console.log(checkout(80));
console.log(checkout(20));`,
      language: "js",
      hints: [
        "`var discount` is hoisted to the top of `checkout` and initialised to `undefined`.",
        "Redeclaring a parameter with `var` is allowed and keeps the parameter's value.",
        "With `let` inside the `if`, reading `discount` after the block would be a ReferenceError — so compute it with a `const` and a ternary instead.",
      ],
      solution: `// Predictions for the original:
// checkout(80): logs 5, then 75 is printed
// checkout(20): logs undefined, then 20 is printed

function checkout(total) {
  const discount = total > 50 ? 5 : 0;
  console.log(discount);
  return total - discount;
}

console.log(checkout(80)); // 5, then 75
console.log(checkout(20)); // 0, then 20`,
      explanation: "Because `var` is function-scoped and hoisted with the value `undefined`, `discount` is readable after the `if` even when the branch did not run. Replacing it with one `const` computed by a ternary makes the value always defined and removes the confusing redeclaration of `total`.",
    },
    examQuestions: [
      {
        question: "Which declaration creates a **block-scoped** variable that **cannot be reassigned**?\n\nA. `var`\nB. `let`\nC. `const`\nD. `function`",
        answer: "**C. `const`.** `let` is block-scoped but reassignable; `var` is function-scoped.",
        marks: 1,
      },
      {
        question: "True or False: declaring an array with `const` prevents items from being added with `push()`.",
        answer: "**False.** `const` prevents reassigning the variable name, not mutating the object it refers to.",
        marks: 1,
      },
      {
        question: "What happens, and why?\n\n```js\nconsole.log(a);\nvar a = 1;\nconsole.log(b);\nlet b = 2;\n```",
        answer: "First `undefined` is logged (`var` is hoisted and initialised to `undefined`), then `ReferenceError: Cannot access 'b' before initialization` is thrown because `b` is still in the temporal dead zone.",
        marks: 2,
      },
      {
        question: "Briefly explain why Lecture 02 recommends avoiding `var` in modern React development.",
        answer: "`var` is function-scoped and hoisted as `undefined`, so it leaks out of blocks and hides use-before-declare bugs; `let`/`const` are block-scoped and throw on early access, which makes code predictable. `const` also communicates that a binding is never reassigned.",
        marks: 3,
      },
    ],
    revision: [
      "`const` by default, `let` only when reassigning, avoid `var` (Lecture 02, slide 18).",
      "`let`/`const` = block scope `{ }`; `var` = function scope (leaks out of `if`/`for`).",
      "`const` stops reassignment, NOT mutation of objects/arrays.",
      "All declarations are hoisted; `var` starts as `undefined`, `let`/`const` sit in the TDZ until their line runs.",
      "TDZ access → `ReferenceError: Cannot access 'x' before initialization`.",
      "Scope lookup walks outward through lexical environments (where code is written, not where it is called).",
      "`for (let i ...)` gives each iteration its own `i`; `var i` is shared.",
    ],
    visualizers: ["closure-scope"],
  },

  /* ================================================================ */
  /* 2. Closures                                                        */
  /* ================================================================ */
  {
    id: "js-closures",
    moduleId: "m03-javascript",
    title: "Closures: Functions That Remember",
    summary:
      "A closure is a function plus the variables it captured from where it was created — the reason counters, factories, event handlers and hooks work (and the cause of stale-state bugs).",
    priority: "P1",
    minutes: 25,
    objectives: [
      "Define a closure in terms of functions and lexical environments",
      "Build counter and factory functions that keep private state",
      "Explain the classic `var` + callback loop bug and fix it with `let`",
      "Recognise a stale closure in a React effect and fix it with a functional update",
    ],
    prerequisites: ["js-variables-scope"],
    sources: [
      L02("Slide 15 (State + Event: onClick={() => setCount(count + 1)}), Slide 17 (prerequisites: const/let vs var, arrow functions)"),
      EXAMPLES("Examples/Advanced/var-let-const-JS.html (calculateArea reads the outer `radius`)"),
      MDN("Closures", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures"),
      { kind: "best-practice", label: "react.dev — State as a Snapshot", url: "https://react.dev/learn/state-as-a-snapshot" },
    ],
    why: `Every time you write \`onClick={() => setCount(count + 1)}\` you create a closure. Every custom hook, every \`setTimeout\` callback, every \`.filter(e => e.price < maxPrice)\` that reads a variable from the component is a closure. When closures behave as expected you never notice them; when they capture an **old** value you get the most confusing bug in React: an interval that is stuck, or a handler that submits stale form data.

Understanding closures turns "React is weird" into "this function captured \`count\` from the render in which it was created".`,
    analogy: `A closure is like a **backpack** a function carries.

When a function is created, it packs a reference to the variables around it (not photocopies of their values — the actual variable "slots"). Wherever the function is later called — in a timer, an event handler, another module — it opens its backpack to find those variables.

A *stale closure* is a backpack packed during an **old render**: the function is still carrying the old render's variables, even though React has since run your component again and created new ones.`,
    explain: {
      beginner: `A **closure** happens when a function uses a variable declared *outside* of it, and keeps access to that variable even after the outer function has finished running.

\`\`\`js
function makeCounter() {
  let count = 0;
  return function () {
    count = count + 1;
    return count;
  };
}
const next = makeCounter();
next(); // 1
next(); // 2
\`\`\`

\`makeCounter\` has finished, yet \`next\` still remembers \`count\`. Each call to \`makeCounter()\` creates a **new, separate** \`count\`, so two counters never interfere. Nobody outside can touch \`count\` directly — it is effectively private.

You use closures constantly without naming them: an arrow function inside a component that reads a prop, a \`.filter(e => e.price < maxPrice)\` that reads \`maxPrice\`, or an event handler that reads state. The function "closes over" those variables.`,
      developer: `Closures are the backbone of several everyday patterns:

- **Factories / configuration**: \`const formatGBP = makeFormatter("en-GB", "GBP")\` returns a function that remembers its locale and currency.
- **Private state / module pattern**: data hidden inside a function scope, exposed only through returned methods (\`add\`, \`total\`).
- **Callbacks**: \`setTimeout\`, \`addEventListener\`, \`fetch(...).then(...)\` — the callback runs later but still sees the variables from when it was created.
- **React hooks**: each render is a new call of your component function with its own \`props\` and \`state\` constants; handlers defined in that render close over **that render's** values.

The stale-closure trap:

\`\`\`jsx
useEffect(() => {
  const id = setInterval(() => setCount(count + 1), 1000);
  return () => clearInterval(id);
}, []); // effect runs once → callback captured count = 0 forever
\`\`\`

Every tick computes \`0 + 1\`, so the UI shows \`1\` and stays there. Fixes: use the **functional updater** \`setCount(c => c + 1)\` (React passes the latest value), or list \`count\` in the dependency array so the effect re-subscribes with a fresh closure.

Closures capture **variables (bindings)**, not snapshots of values: if the outer variable is later reassigned, the closure sees the new value. React state only *feels* like a snapshot because each render creates brand-new \`const\` bindings.`,
      deep: `Formally, when a function object is created it stores a hidden reference (\`[[Environment]]\`) to the lexical environment current at creation. Calling the function creates a new environment whose outer pointer is that stored one. As long as the function object is reachable, the captured environment cannot be garbage-collected — the memory cost of closures. A long-lived listener that closes over a huge array keeps the array alive; remove listeners (or return cleanup functions from effects) to release them.

Engines optimise: V8 keeps only the variables closures actually reference, but closures created in the same scope share one context object, so one closure referencing a big object can keep it alive for its siblings too — a surprise in memory profiles.

**Loop bindings.** With \`for (var i = 0; i < 3; i++) setTimeout(() => console.log(i))\` there is a single \`i\` in the function environment; by the time the callbacks run the loop has finished and \`i\` is \`3\`, so you see \`3 3 3\`. With \`let\`, the specification creates a fresh per-iteration environment and copies the current value forward, so each callback captures its own \`i\` → \`0 1 2\`.

**React.** \`useCallback\`/\`useMemo\` deliberately *preserve* an old closure until dependencies change; omitting a dependency is how stale values leak in, which is why the \`react-hooks/exhaustive-deps\` lint rule exists. \`useRef\` is the escape hatch: a ref object is the same object across renders, so a closure that reads \`ref.current\` always sees the latest value written to it.`,
    },
    mechanism: `\`\`\`text
 makeCounter() call #1                      makeCounter() call #2
 ┌──────────────────────────┐               ┌──────────────────────────┐
 │ env A   { count: 0 → 2 } │               │ env B   { count: 0 → 1 } │
 └───────────▲──────────────┘               └───────────▲──────────────┘
             │ [[Environment]]                          │ [[Environment]]
      ┌──────┴──────┐                            ┌──────┴──────┐
      │ fn counterA │  counterA() → 1, 2         │ fn counterB │ counterB() → 1
      └─────────────┘                            └─────────────┘

 React render #1 (count = 0)          React render #2 (count = 1)
 ┌──────────────────────────┐         ┌──────────────────────────┐
 │ { count: 0, setCount }   │         │ { count: 1, setCount }   │
 └──────────▲───────────────┘         └──────────────────────────┘
            │ interval callback created ONCE (deps [])
            └── still reads count = 0  →  stale closure
\`\`\`

- Each call of the outer function creates a **separate** environment, so factories produce independent state.
- A closure holds a *live reference* to its environment; it reads the variable's current value at call time.
- React state looks frozen per render because each render creates new constants; old callbacks keep pointing at old environments.`,
    simpleExample: {
      title: "Counter factory with private state",
      language: "js",
      code: `function makeCounter(start = 0) {
  let count = start;
  return {
    increment: () => ++count,
    reset: () => {
      count = start;
      return count;
    },
  };
}

const ticketsA = makeCounter();
const ticketsB = makeCounter(10);

console.log(ticketsA.increment()); // 1
console.log(ticketsA.increment()); // 2
console.log(ticketsB.increment()); // 11
console.log(ticketsA.reset());     // 0
console.log(ticketsA.count);       // undefined — not reachable from outside`,
      walkthrough: [
        { lines: "1-2", text: "Each call to `makeCounter` creates a new environment containing its own `count` and `start`." },
        { lines: "3-9", text: "The returned arrow functions close over `count` and `start`; they are the only way to reach them." },
        { lines: "12-13", text: "Two calls → two independent environments. `ticketsB` starts at 10." },
        { lines: "15-18", text: "`++count` increments then returns. A's and B's counts never interfere; `reset` restores A's own `start` (0)." },
        { lines: "19", text: "`count` is not a property of the returned object — it is private closure state." },
      ],
    },
    realExample: {
      title: "Stale closure in a React seat-hold countdown (and the fix)",
      language: "tsx",
      code: `import { useEffect, useState } from "react";

export function BookingTimer() {
  const [secondsLeft, setSecondsLeft] = useState(60);

  useEffect(() => {
    const id = setInterval(() => {
      // ❌ setSecondsLeft(secondsLeft - 1);  // captures 60 forever → stuck at 59
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0)); // ✅ latest value
    }, 1000);
    return () => clearInterval(id); // cleanup releases the closure
  }, []);

  return <p>Your seats are held for {secondsLeft}s</p>;
}`,
      walkthrough: [
        { lines: "4", text: "Each render gets a new `secondsLeft` constant." },
        { lines: "6-7", text: "The effect runs once after mount (empty deps), so the interval callback is created once — inside the first render's closure." },
        { lines: "8", text: "Reading `secondsLeft` here would always see `60` (the first render's value), so the display would get stuck at 59." },
        { lines: "9", text: "The functional updater receives the current state from React, so the callback no longer needs to read `secondsLeft` at all." },
        { lines: "11", text: "Clearing the interval on unmount lets the callback (and its captured environment) be garbage-collected. In StrictMode development, React mounts → unmounts → mounts, which proves the cleanup works." },
      ],
    },
    mistakes: [
      {
        mistake: "Thinking a closure copies the value of a variable at creation time.",
        fix: "A closure captures the variable binding. If the outer variable is reassigned later, the closure sees the new value. React state only *looks* snapshotted because each render has new bindings.",
      },
      {
        mistake: "Using `var` in a loop that creates callbacks, then getting the final value in every callback.",
        fix: "Use `let` in the loop header — each iteration gets its own binding.",
      },
      {
        mistake: "Reading state inside a `setInterval`/subscription created in an effect with `[]` dependencies (stale closure).",
        fix: "Use the functional updater `setX(prev => ...)`, include the value in the dependency array, or store the latest value in a `useRef`.",
      },
      {
        mistake: "Never removing event listeners/intervals that close over large data, causing memory leaks.",
        fix: "Return a cleanup function from `useEffect` (`clearInterval`, `removeEventListener`, `controller.abort()`).",
      },
    ],
    debug: {
      prompt: "These buttons should alert \"Seat 0\", \"Seat 1\", \"Seat 2\", but every button alerts \"Seat 3\". Fix it.",
      language: "js",
      buggyCode: `const container = document.querySelector("#seats");

for (var i = 0; i < 3; i++) {
  const button = document.createElement("button");
  button.textContent = "Seat " + i;
  button.addEventListener("click", () => {
    alert("Seat " + i);
  });
  container.append(button);
}`,
      hint: "How many `i` variables exist when the loop uses `var`? What is its value when a user eventually clicks?",
      fixedCode: `const container = document.querySelector("#seats");

for (let i = 0; i < 3; i++) {
  const button = document.createElement("button");
  button.textContent = "Seat " + i;
  button.addEventListener("click", () => {
    alert("Seat " + i);
  });
  container.append(button);
}`,
      explanation: "With `var` there is one function-scoped `i`. The button labels are correct because they are computed during the loop, but the click handlers run later, after the loop has finished and `i === 3`. All three closures share the same binding. `let` creates a fresh binding per iteration, so each handler closes over its own `i` (0, 1, 2).",
    },
    challenge: {
      prompt: "Write `createBasket()` that returns `{ add(name, price), total(), count() }`. The items array must be private (not reachable from outside), and two baskets must be independent.",
      starterCode: `function createBasket() {
  // your code
}

const a = createBasket();
a.add("Mug", 8);
a.add("Lamp", 25);
const b = createBasket();
b.add("Pen", 1);
console.log(a.total(), a.count()); // 33 2
console.log(b.total(), b.count()); // 1 1
console.log(a.items);              // undefined`,
      language: "js",
      hints: [
        "Declare `const items = []` inside `createBasket`, not at module level.",
        "Return an object whose methods read and modify `items`.",
        "`total` can use `reduce` with an initial value of 0.",
      ],
      solution: `function createBasket() {
  const items = [];
  return {
    add(name, price) {
      items.push({ name, price });
    },
    total() {
      return items.reduce((sum, item) => sum + item.price, 0);
    },
    count() {
      return items.length;
    },
  };
}`,
      explanation: "Each `createBasket()` call creates a new environment with its own `items` array. The three methods close over that environment, so they can read and mutate `items`, but code outside has no reference to it — `a.items` is `undefined`. This is the classic encapsulation pattern built on closures.",
    },
    examQuestions: [
      {
        question: "What is a closure in JavaScript?\n\nA. A function that has been garbage-collected\nB. A function together with references to the variables of the scope in which it was created\nC. A way to close a browser tab\nD. A TypeScript keyword for private fields",
        answer: "**B.** A closure is a function bundled with its lexical environment, so it can access outer variables after the outer function has returned.",
        marks: 1,
      },
      {
        question: "What does this print?\n\n```js\nfor (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 0);\n}\n```",
        answer: "`3`, `3`, `3`. There is a single `var i`; the callbacks run after the loop finishes, when `i` is 3. With `let` it prints `0`, `1`, `2`.",
        marks: 2,
      },
      {
        question: "A component uses `useEffect(() => { const id = setInterval(() => setCount(count + 1), 1000); return () => clearInterval(id); }, []);`. The display stops at 1. Explain why and give a fix.",
        answer: "The interval callback was created in the first render and closes over `count = 0` (a stale closure), so it always sets `0 + 1`. Fix: `setCount(c => c + 1)` (functional update) or add `count` to the dependency array.",
        marks: 3,
      },
    ],
    revision: [
      "Closure = function + the lexical environment it was created in.",
      "Closures capture variable bindings (live), not copies of values.",
      "Each call to a factory creates a fresh, independent environment → private state.",
      "`var` in loops shares one binding → `3 3 3`; `let` gives one per iteration → `0 1 2`.",
      "Each React render is a new function call with its own constants; handlers close over *that* render.",
      "Stale closure fix: functional updater `setX(prev => ...)`, correct deps, or `useRef`.",
      "Closures keep memory alive — clean up intervals/listeners in effect cleanups.",
    ],
    visualizers: ["closure-scope"],
  },

  /* ================================================================ */
  /* 3. Arrow functions, this, template literals, ternary              */
  /* ================================================================ */
  {
    id: "js-arrow-this",
    moduleId: "m03-javascript",
    title: "Arrow Functions, this, Template Literals & the Ternary",
    summary:
      "Arrow-function syntax, the `this` rules (method, plain call, strict mode, lexical arrow), plus template literals and the ternary operator used everywhere in JSX.",
    priority: "P1",
    minutes: 30,
    objectives: [
      "Rewrite traditional functions as arrow functions, including implicit returns",
      "Predict `this` for method calls, plain calls (sloppy and strict) and arrow functions",
      "Use template literals for interpolation and multi-line strings",
      "Use the ternary operator for conditional values and conditional rendering",
    ],
    prerequisites: ["js-variables-scope"],
    sources: [
      L02("Slides 19–21 (Arrow Functions — notes: arrows have no own `this`; Different Arrow Functions — inside a function vs strict vs object; this keyword)"),
      L02("Slides 23–25 (Ternary Conditional, Conditional Rendering, Template Literals)"),
      EXAMPLES("Examples/Advanced/arrowFunctionJS.html, Examples/Advanced/templateLiteralsJS.html"),
      EXAMPLES("Examples/prerequisites/thisKeywordJS.html, normalFunctionJS.html, ternaryOperatorJS.html"),
      MOCK("A4 (conditional rendering)"),
      MDN("this", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this"),
      MDN("Arrow function expressions", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions"),
    ],
    why: `Arrow functions are the default way to write callbacks in React: \`events.map(e => <EventCard ... />)\`, \`onClick={() => setOpen(true)}\`. They are shorter, but they also behave differently: **an arrow function has no \`this\` of its own**. Lecture 02 calls this out explicitly (slide 19 notes), and the module's \`thisKeywordJS.html\` example walks through how \`this\` changes between the global scope, a plain function, a strict function and an object method.

Template literals and the ternary operator are the other two pieces of syntax you will write dozens of times a day — for building URLs and messages, and for conditional rendering (\`isLoggedIn ? <Welcome/> : <Login/>\`).`,
    analogy: `\`this\` is like the word **"me"** in a sentence — its meaning depends on **who is speaking**.

- \`person.greet()\` — the person is speaking, so "me" = \`person\`.
- \`greet()\` on its own — nobody in particular is speaking; in sloppy mode "me" defaults to the global object (the browser \`window\`), in strict mode it is \`undefined\`.
- An **arrow function** never says "me" on its own behalf; it repeats whatever "me" meant in the sentence around it (the enclosing scope).`,
    explain: {
      beginner: `**Arrow functions** are a shorter way to write a function (from \`arrowFunctionJS.html\`):

\`\`\`js
function add(a, b) { return a + b; }   // traditional
const addArrow = (a, b) => a + b;      // arrow, implicit return
const greet = () => "Hello, World!";   // no parameters
const square = x => x * x;             // one parameter: brackets optional
\`\`\`

If the body is a single expression you can drop \`{ }\` and \`return\`. If you use \`{ }\`, you must write \`return\` yourself.

**\`this\`** is a special word that refers to "the object this function is working for". In a method call like \`person.greet()\`, \`this\` is \`person\`, so \`this.name\` reads the person's name. Arrow functions don't get their own \`this\`; they borrow it from the surrounding code.

**Template literals** use backticks and \`\${ }\` to drop values into strings, for example \`\` \`Hello, my name is \${firstName} \${lastName}\` \`\` from \`templateLiteralsJS.html\`. They can also span multiple lines.

**The ternary** \`condition ? valueIfTrue : valueIfFalse\` is a compact if/else that *produces a value*: \`const canVote = age >= 18 ? "Yes, you can vote." : "No, you cannot vote.";\`. In JSX it is how you show one thing or another (Lecture 02, slide 24: login/logout, admin UI, loading, empty and error states).`,
      developer: `**\`this\` rules** for regular \`function\`s, decided at *call time*:

1. **Method call** \`obj.method()\` → \`this === obj\`.
2. **Plain call** \`fn()\` → \`undefined\` in strict mode (ES modules, classes, \`"use strict"\`); the global object (\`window\`) in sloppy scripts.
3. **Explicit** \`fn.call(x)\`, \`fn.apply(x)\`, \`fn.bind(x)\` → \`this === x\`.
4. **\`new Fn()\`** → \`this\` is the newly created object.

**Arrow functions** ignore all of the above: \`this\` is taken lexically from the enclosing scope, permanently. \`call\`/\`bind\` cannot change it, and arrows cannot be used with \`new\`.

Consequences:
- Extracting a method loses \`this\`: \`const g = person.greet; g();\` is a plain call.
- Callbacks inside methods: \`setTimeout(function () { this.x })\` gets the wrong \`this\`; \`setTimeout(() => this.x)\` keeps the method's \`this\`.
- **Don't** use an arrow as an object method if it needs \`this\` — it will see the outer \`this\` (\`undefined\` at the top level of a module).

Function components and hooks don't use \`this\` at all, one reason modern React feels simpler. You will still meet \`this\` in class components, DOM listeners (for a regular-function listener, \`this === event.currentTarget\`) and libraries.

Template literals: \`\` \`\${API_BASE}/events/\${id}\` \`\` — any expression can go inside \`\${}\`. Ternaries can nest, but more than one level hurts readability — extract a variable or a helper with early returns instead.`,
      deep: `Under the hood, a regular function call creates an environment with its own \`this\` binding determined by *how* it was invoked: a property reference like \`obj.method\` carries a base object which becomes \`this\`; a bare identifier call has no base, so \`this\` is \`undefined\`, which sloppy mode then replaces with \`globalThis\` (and boxes primitives). Arrow functions have no \`this\` binding in their environment, so a lookup of \`this\` walks out to the nearest enclosing non-arrow function (or the module/script top level) exactly like a variable lookup — that is what "lexical \`this\`" means. The same applies to \`arguments\`, \`super\` and \`new.target\`: arrows have none of their own.

Top-level \`this\` differs by context: in a classic browser script it is \`window\` (which is what \`thisKeywordJS.html\` logs), in an ES module it is \`undefined\`, in Node CommonJS it is \`module.exports\`.

Timers: browsers invoke \`setTimeout\`/\`setInterval\` callbacks with \`this\` set to \`window\`; Node uses its \`Timeout\` object — another reason not to rely on \`this\` in callbacks.

Class fields holding arrows (\`handleClick = () => {...}\`) create one function per instance whose lexical \`this\` is the instance — the pre-hooks React idiom that avoided \`.bind(this)\` in constructors, at the cost of a function per instance instead of one on the prototype.

Tagged templates (\`\` sql\`...\` \`\`, \`\` css\`...\` \`\`) call a function with the string parts and values separately — that is how libraries escape interpolations safely. Plain template literals do **no** escaping, so building HTML with them and assigning to \`innerHTML\` is an XSS risk.`,
    },
    mechanism: `\`\`\`text
 How is the function CALLED?                          this =
 ──────────────────────────────────────────────────────────────────────
 person.greet()                regular fn, method  ─▶ person
 const g = person.greet; g()   plain call          ─▶ window (sloppy) / undefined (strict)
 greet.call(admin)             explicit            ─▶ admin
 new Booking()                 constructor         ─▶ the new object
 () => this.x                  ARROW               ─▶ same as enclosing scope (fixed)

 const timer = {
   seconds: 0,
   start() {                     ◀── this = timer (called as timer.start())
     setInterval(() => {         ◀── arrow: no own this
       this.seconds++;           ──▶ looks outward → start's this → timer ✓
     }, 1000);
   }
 };
\`\`\`

- Regular functions: \`this\` is chosen at **call time** by the shape of the call.
- Arrow functions: \`this\` is resolved like a variable, from the **definition** site.`,
    simpleExample: {
      title: "The this cases from thisKeywordJS.html (classic browser script)",
      language: "js",
      code: `function showThis() {
  console.log(this);                 // window (sloppy mode)
}
function showThisStrict() {
  "use strict";
  console.log(this);                 // undefined
}
const person = {
  name: "Ebad",
  greet: function () {
    console.log("Hello, my name is " + this.name);
  },
  greetArrow: () => {
    console.log(this === window);    // true — NOT person
  },
};

showThis();
showThisStrict();
person.greet();                      // Hello, my name is Ebad
person.greetArrow();
const detached = person.greet;
detached();                          // reads window.name (usually "") — person is lost`,
      walkthrough: [
        { lines: "1-3", text: "A plain call of a sloppy-mode function: `this` defaults to the global object (`window` in a browser)." },
        { lines: "4-7", text: "The same call in strict mode: no default, so `this` is `undefined`." },
        { lines: "10-12", text: "Regular function as a method, called as `person.greet()`, so `this === person`." },
        { lines: "13-15", text: "Arrow as a method: it takes `this` from the surrounding scope (script top level → `window`), not from `person`. In an ES module it would be `undefined`." },
        { lines: "22-23", text: "Detaching the method turns `detached()` into a plain call — `this` is no longer `person`." },
      ],
    },
    realExample: {
      title: "Event card helpers: arrows, template literals and ternaries together",
      language: "ts",
      code: `const API_BASE = "http://localhost:5229/api";

interface CampusEvent {
  id: number;
  title: string;
  price: number;
  availableTickets: number;
}

const eventUrl = (id: number): string => \`\${API_BASE}/events/\${id}\`;

const priceLabel = (price: number): string =>
  price === 0 ? "Free" : \`£\${price.toFixed(2)}\`;

const ticketBadge = (e: CampusEvent): string =>
  e.availableTickets === 0
    ? "Sold out"
    : e.availableTickets < 10
      ? \`Only \${e.availableTickets} left\`
      : "Available";

const describe = (e: CampusEvent): string => \`\${e.title}
  Price: \${priceLabel(e.price)}
  Status: \${ticketBadge(e)}\`;

const sample: CampusEvent = { id: 3, title: "Sports Day", price: 0, availableTickets: 4 };
console.log(eventUrl(sample.id)); // http://localhost:5229/api/events/3
console.log(describe(sample));`,
      walkthrough: [
        { lines: "10", text: "A one-line arrow with an implicit return builds the endpoint URL with a template literal." },
        { lines: "12-13", text: "A ternary chooses between two values; `toFixed(2)` formats to pence." },
        { lines: "15-20", text: "A nested ternary (one level, formatted vertically) gives three states. Beyond this, prefer if/else or a lookup table." },
        { lines: "22-24", text: "Template literals preserve line breaks and indentation, so this produces a three-line string." },
        { lines: "27-28", text: "Logs the URL, then `Sports Day`, `Price: Free`, `Status: Only 4 left` on three lines." },
      ],
    },
    mistakes: [
      {
        mistake: "Using an arrow function as an object method and expecting `this` to be the object.",
        fix: "Use method shorthand `greet() { ... }` or `function` for methods that need `this`; use arrows for callbacks *inside* methods.",
      },
      {
        mistake: "Passing a method as a callback (`button.addEventListener('click', basket.clear)`) and losing `this`.",
        fix: "Wrap it: `() => basket.clear()`, or bind it: `basket.clear.bind(basket)`.",
      },
      {
        mistake: "Writing `x => { x * 2 }` and getting `undefined` back.",
        fix: "Braces create a block body that needs `return`. Use `x => x * 2` or `x => { return x * 2; }`. To return an object literal, wrap it: `() => ({ id: 1 })`.",
      },
      {
        mistake: "Using single or double quotes with `${...}` and seeing the literal text printed.",
        fix: "Interpolation only works inside backtick template literals.",
      },
      {
        mistake: "Deeply nested ternaries that nobody can read.",
        fix: "Limit to one nested level; otherwise extract a helper function with early returns.",
      },
    ],
    debug: {
      prompt: "The timer should log 1, 2, 3 ... but in the browser it logs NaN every second. Fix it with the smallest change.",
      language: "js",
      buggyCode: `const timer = {
  seconds: 0,
  start() {
    setInterval(function () {
      this.seconds++;
      console.log(this.seconds);
    }, 1000);
  },
};

timer.start();`,
      hint: "Who calls the function passed to `setInterval`, and how? What is `this` inside it?",
      fixedCode: `const timer = {
  seconds: 0,
  start() {
    setInterval(() => {
      this.seconds++;
      console.log(this.seconds);
    }, 1000);
  },
};

timer.start(); // 1, 2, 3, ...`,
      explanation: "The `function` callback is invoked by the browser's timer, not as `timer.something()`, so its `this` is not `timer` (browsers pass `window`). `window.seconds` is `undefined`, and `undefined + 1` is `NaN`. An arrow function has no `this` of its own, so it uses `start`'s `this`, which is `timer` because `start` was called as `timer.start()`.",
    },
    challenge: {
      prompt: "Convert `formatBooking` to an arrow function that uses a template literal, and use a ternary so the output says `1 ticket` or `N tickets` correctly. Then state what `this` would be inside the original if it were called as a plain function in an ES module.",
      starterCode: `function formatBooking(name, tickets, price) {
  var total = tickets * price;
  return "Booking for " + name + ": " + tickets + " tickets, £" + total.toFixed(2);
}

console.log(formatBooking("Alex", 1, 15)); // want: Booking for Alex: 1 ticket, £15.00
console.log(formatBooking("Sam", 3, 5));   // want: Booking for Sam: 3 tickets, £15.00`,
      language: "js",
      hints: [
        "`const formatBooking = (name, tickets, price) => ...`",
        "Inside the template literal: `${tickets === 1 ? \"ticket\" : \"tickets\"}`.",
        "ES modules are always strict mode.",
      ],
      solution: `const formatBooking = (name, tickets, price) =>
  \`Booking for \${name}: \${tickets} \${tickets === 1 ? "ticket" : "tickets"}, £\${(tickets * price).toFixed(2)}\`;

console.log(formatBooking("Alex", 1, 15)); // Booking for Alex: 1 ticket, £15.00
console.log(formatBooking("Sam", 3, 5));   // Booking for Sam: 3 tickets, £15.00

// In an ES module (strict mode), a plain call of the original function
// would have this === undefined.`,
      explanation: "The arrow has a single expression so it returns implicitly. The ternary inside `${}` picks the right noun. Because the function never reads `this`, converting it is safe. ES modules are strict, so a plain call of a regular function gets `this === undefined`.",
    },
    examQuestions: [
      {
        question: "Which statement about arrow functions is correct?\n\nA. They always bind `this` to the object literal they are defined in\nB. They do not have their own `this`; they use `this` from the enclosing scope\nC. They can be used as constructors with `new`\nD. They must always use the `return` keyword",
        answer: "**B.** Arrow functions take `this` lexically. They can't be used with `new`, and single-expression bodies return implicitly.",
        marks: 1,
      },
      {
        question: "In strict mode, what is `this` inside a regular function called as `fn()`?",
        answer: "`undefined`. In sloppy mode it would be the global object (`window` in a browser).",
        marks: 1,
      },
      {
        question: "A React component should show `Welcome back!` when `isLoggedIn` is true and `Please log in.` otherwise. Write the JSX expression and name the technique.",
        answer: "`{isLoggedIn ? <p>Welcome back!</p> : <p>Please log in.</p>}` — conditional rendering using the ternary operator (Lecture 02, slide 24; mock A4).",
        marks: 2,
      },
      {
        question: "Write a template literal that produces `/api/events/42?page=2` from variables `id = 42` and `page = 2`.",
        answer: "`` `/api/events/${id}?page=${page}` ``",
        marks: 1,
      },
    ],
    revision: [
      "`(a, b) => a + b` — implicit return for single expressions; braces need `return`; wrap object literals in `()`.",
      "Regular functions: `this` decided at call time — method → the object; plain call → `window` (sloppy) / `undefined` (strict).",
      "Arrow functions have no own `this` (or `arguments`); they use the enclosing scope's `this`.",
      "Don't use arrows as methods that need `this`; do use them for callbacks inside methods.",
      "Detaching a method (`const f = obj.m; f()`) loses `this`.",
      "Template literals: backticks + `${expr}`, multi-line allowed, no automatic escaping.",
      "Ternary `cond ? a : b` produces a value — the standard tool for conditional rendering in JSX.",
    ],
  },

  /* ================================================================ */
  /* 4. References vs copies                                            */
  /* ================================================================ */
  {
    id: "js-references-copies",
    moduleId: "m03-javascript",
    title: "Primitives vs References: Mutation, Equality and Copies",
    summary:
      "Why changing a 'copy' of an object changes the original, how === compares objects, shallow vs deep copies (spread vs structuredClone) and why React needs immutable updates.",
    priority: "P0",
    minutes: 30,
    objectives: [
      "Distinguish primitive values from reference values and predict the effect of assignment",
      "Explain why `===` on two objects compares identity, not contents",
      "Create shallow copies with spread and deep copies with `structuredClone`, and know the limits of each",
      "Write immutable updates for nested basket/state data so React detects the change",
    ],
    prerequisites: ["js-variables-scope"],
    sources: [
      L02("Slide 22 (Data Structures — arrays and objects), Slides 27–28 (Need for Spread Operator? What's the issue with this code? / Solution to shallow copy?)"),
      EXAMPLES("Examples/prerequisites/dataStructuresJS.html, Examples/Advanced/spreadOperatorJS.html"),
      MDN("structuredClone()", "https://developer.mozilla.org/en-US/docs/Web/API/Window/structuredClone"),
      MDN("Equality comparisons and sameness", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness"),
      { kind: "best-practice", label: "react.dev — Updating Objects in State", url: "https://react.dev/learn/updating-objects-in-state" },
    ],
    why: `Lecture 02 asks "What's the issue with this code?" right before introducing the spread operator — because copying an object with \`=\` does **not** copy it. Both names point at the same object, so "editing the copy" silently edits the original.

In React this is not just a curiosity: React decides whether state changed by comparing the old and new value with \`Object.is\` (essentially \`===\`). If you mutate an array and pass the same array back to the setter, React sees "same reference → nothing changed" and may skip the re-render. Immutable updates — creating new objects instead of changing old ones — are the foundation of React state, Zustand stores and TanStack Query cache updates.`,
    analogy: `A **primitive** (number, string, boolean) is like a **number written on a sticky note**: when you copy it, you write the same number on a new note. Changing one note doesn't change the other.

An **object or array** is like a **house**. A variable doesn't hold the house — it holds the **address**. \`const b = a\` copies the address, not the house. Repaint the kitchen via \`b\` and anyone visiting address \`a\` sees the new kitchen.

A **shallow copy** (\`{ ...a }\`) builds a new house but moves the *same furniture* in — the nested objects (the sofa) are still shared. A **deep copy** (\`structuredClone(a)\`) builds a new house and new furniture.`,
    explain: {
      beginner: `JavaScript values come in two families:

- **Primitives**: \`number\`, \`string\`, \`boolean\`, \`null\`, \`undefined\`, \`bigint\`, \`symbol\`. Assigning copies the value.
- **Objects** (including arrays and functions): the variable holds a **reference** — a pointer to the object in memory. Assigning copies the pointer.

\`\`\`js
let a = 5;
let b = a;
b = 6;            // a is still 5

const basket = ["Mug"];
const copy = basket;
copy.push("Lamp");
console.log(basket); // ["Mug", "Lamp"]  ← the "original" changed too!
\`\`\`

That is the issue Lecture 02 (slide 27) highlights. The fix is to create a **new** array or object: \`const copy = [...basket];\` or \`const copyObj = { ...person };\`. Now changes to \`copy\` don't affect \`basket\`.

Equality follows the same idea. \`5 === 5\` is \`true\`, but \`{ id: 1 } === { id: 1 }\` is \`false\` — they are two different objects that happen to look the same. \`===\` asks "is this the *same object*?", not "do these look alike?".`,
      developer: `**Shallow copy** — copies the top level only:

\`\`\`js
const event = { title: "Tech Conf", venue: { room: "A1" } };
const copy = { ...event };          // or Object.assign({}, event)
copy.title = "Changed";             // original title unaffected
copy.venue.room = "B2";             // ⚠ original venue.room is now "B2"
\`\`\`

\`[...arr]\`, \`arr.slice()\`, \`Array.from(arr)\`, \`{ ...obj }\` are all shallow. Nested objects are shared.

**Deep copy** — \`structuredClone(value)\` (built into modern browsers and Node 17+) recursively copies plain objects, arrays, \`Date\`, \`Map\`, \`Set\`, typed arrays, and even circular references. It **throws** \`DataCloneError\` for functions and DOM nodes, and class instances come back as plain objects (prototype lost).

\`JSON.parse(JSON.stringify(x))\` is the old trick: it turns \`Date\` into strings, drops \`undefined\` and functions, and fails on circular references — avoid it for anything but simple JSON data.

**Immutable updates in React** — copy *along the path* you change, share everything else:

\`\`\`js
setBasket(prev => ({
  ...prev,
  items: prev.items.map(i => i.id === id ? { ...i, qty: i.qty + 1 } : i),
}));
\`\`\`

This is usually better than deep-cloning everything: unchanged items keep their identity, so memoised child components (\`React.memo\`) can skip re-rendering.`,
      deep: `**Identity vs equality.** \`===\` on objects compares references. \`Object.is\` is \`===\` except that \`Object.is(NaN, NaN)\` is \`true\` and \`Object.is(0, -0)\` is \`false\`; React uses \`Object.is\` for state bail-outs, \`useEffect\`/\`useMemo\` dependency comparison and \`React.memo\` prop checks. That is why an inline object \`{ page: 1 }\` in a dependency array re-runs the effect every render: it is a new reference each time.

**Mutation inside React.** If you do \`items.push(x); setItems(items)\`, React compares old and new with \`Object.is\` — identical — and bails out; the UI does not update. Even when something else causes a re-render, mutating state that earlier renders captured breaks time-travel debugging, StrictMode double-render checks, concurrent rendering assumptions and memoisation.

**Structural sharing.** Immutable updates copy only the changed path (root → items array → the one item). Unchanged branches keep their references, so equality checks are O(1) per node. Libraries like Immer let you write mutating syntax on a draft and produce a structurally-shared copy; TanStack Query uses structural sharing to keep unchanged parts of refetched data referentially stable; Zustand's \`set\` shallow-merges the top level for you.

**const ≠ immutable.** \`Object.freeze\` makes an object's own properties read-only (silently ignored in sloppy mode, TypeError in strict), but only shallowly. TypeScript's \`readonly\` and \`Readonly<T>\` are compile-time only — erased at runtime.

**Pass-by-sharing.** Functions receive a copy of the reference: reassigning the parameter doesn't affect the caller, but mutating through it does.`,
    },
    mechanism: `\`\`\`text
 STACK (variables)              HEAP (objects)
 ┌──────────┬───────┐
 │ a        │   5   │           (primitives stored directly)
 │ b        │   5   │
 │ basket   │  #1 ──┼────────▶ #1 ["Mug", "Lamp"]
 │ alias    │  #1 ──┼────────▶   (same object!)
 │ shallow  │  #2 ──┼────────▶ #2 { title, venue: #3 }
 │ original │  #4 ──┼────────▶ #4 { title, venue: #3 }   ← venue SHARED
 │ deep     │  #5 ──┼────────▶ #5 { title, venue: #6 }   ← new venue
 └──────────┴───────┘

 alias === basket      → true   (same address)
 shallow === original  → false  (different top-level objects)
 shallow.venue === original.venue → true (shared nested object)
\`\`\`

- Assignment copies what is in the variable box: a value for primitives, an address for objects.
- Spread creates a new top-level object but copies nested *addresses*.
- \`structuredClone\` follows every address and copies the objects too.`,
    simpleExample: {
      title: "The Lecture 02 problem: copying a reference",
      language: "js",
      code: `const original = { title: "Tech Conference", tags: ["tech"] };

const alias = original;            // copies the reference
alias.title = "Renamed";
console.log(original.title);       // "Renamed"  ❌ original changed

const shallow = { ...original };   // new top-level object
shallow.title = "Shallow";
shallow.tags.push("free");
console.log(original.title);       // "Renamed"  ✓ unaffected
console.log(original.tags);        // ["tech", "free"] ❌ nested array shared

const deep = structuredClone(original);
deep.tags.push("music");
console.log(original.tags);        // ["tech", "free"] ✓ unaffected

console.log(alias === original);   // true
console.log(shallow === original); // false
console.log({ a: 1 } === { a: 1 }); // false — different objects`,
      walkthrough: [
        { lines: "3-5", text: "`alias` holds the same address as `original`, so changing through either name changes the one object." },
        { lines: "7-11", text: "Spread copies top-level properties. `title` is a primitive so it is truly copied; `tags` is an array, so only its address is copied — both objects share it." },
        { lines: "13-15", text: "`structuredClone` copies nested arrays/objects as well, so the original's `tags` is untouched." },
        { lines: "17-19", text: "`===` compares identity: same reference → true; look-alike objects → false." },
      ],
    },
    realExample: {
      title: "Immutable basket update in React (quantity change)",
      language: "tsx",
      code: `import { useState } from "react";

interface BasketItem {
  id: number;
  name: string;
  price: number;
  qty: number;
}

export function Basket() {
  const [items, setItems] = useState<BasketItem[]>([
    { id: 1, name: "Mug", price: 8, qty: 1 },
    { id: 2, name: "Desk Lamp", price: 25, qty: 1 },
  ]);

  const increment = (id: number) => {
    // ❌ items.find(i => i.id === id)!.qty++; setItems(items);  // same reference → no re-render
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, qty: item.qty + 1 } : item)),
    );
  };

  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>
          {item.name} × {item.qty}
          <button onClick={() => increment(item.id)}>+</button>
        </li>
      ))}
    </ul>
  );
}`,
      walkthrough: [
        { lines: "11-14", text: "State holds an array of objects — references all the way down." },
        { lines: "17", text: "The mutating version changes the existing object and passes the *same* array back; `Object.is(old, new)` is true, so React bails out." },
        { lines: "18-20", text: "`map` returns a new array; only the changed item is replaced with a new object (`{ ...item, qty: ... }`). Unchanged items keep their identity (structural sharing)." },
        { lines: "26-29", text: "The new array reference triggers a re-render, and the list shows the new quantity." },
      ],
    },
    mistakes: [
      {
        mistake: "`const copy = original;` and assuming it's a copy.",
        fix: "That copies the reference. Use `{ ...original }` / `[...original]` for a shallow copy or `structuredClone(original)` for a deep copy.",
      },
      {
        mistake: "Assuming spread is a deep copy and mutating a nested property of the 'copy'.",
        fix: "Spread is shallow. Copy each nested level you change: `{ ...event, venue: { ...event.venue, room: 'B2' } }`.",
      },
      {
        mistake: "Mutating state (`push`, `sort`, `splice`, `obj.x = ...`) then calling the setter with the same reference.",
        fix: "Produce new arrays/objects: `[...prev, item]`, `prev.filter(...)`, `prev.map(...)`, `prev.toSorted(...)`.",
      },
      {
        mistake: "Comparing objects with `===` to check if they have the same contents.",
        fix: "Compare the relevant fields (`a.id === b.id`) or use a deep-equality helper; `===` only checks identity.",
      },
      {
        mistake: "Using `JSON.parse(JSON.stringify(x))` for deep copies of data containing `Date`s.",
        fix: "Use `structuredClone`, which preserves `Date`, `Map` and `Set`.",
      },
    ],
    debug: {
      prompt: "`addToBasket` is supposed to return a new basket without changing the old one, so the change detector can compare them. It always reports \"No change\". Fix the function.",
      language: "js",
      buggyCode: `function addToBasket(basket, product) {
  basket.items.push(product);
  basket.total += product.price;
  return basket;
}

const before = { items: [], total: 0 };
const after = addToBasket(before, { name: "Mug", price: 8 });

console.log(before === after ? "No change" : "Changed");
console.log(before.total); // expected 0`,
      hint: "What does `return basket` return — a new object or the same reference? What did `push` do to `before`?",
      fixedCode: `function addToBasket(basket, product) {
  return {
    ...basket,
    items: [...basket.items, product],
    total: basket.total + product.price,
  };
}

const before = { items: [], total: 0 };
const after = addToBasket(before, { name: "Mug", price: 8 });

console.log(before === after ? "No change" : "Changed"); // "Changed"
console.log(before.total); // 0`,
      explanation: "The buggy version mutates the object it receives and returns the same reference, so `before === after` is true and `before.total` became 8. React's state comparison works exactly like this check. The fix builds a new top-level object and a new `items` array, leaving `before` untouched.",
    },
    challenge: {
      prompt: "Write `renameVenue(event, newRoom)` that returns a new event whose `venue.room` is `newRoom`, without mutating the input, and without deep-cloning unrelated data. Verify that `tags` is still shared and `venue` is not.",
      starterCode: `const event = {
  id: 7,
  title: "Music Festival",
  venue: { building: "Main Hall", room: "A1" },
  tags: ["music", "outdoor"],
};

function renameVenue(event, newRoom) {
  // your code
}

const updated = renameVenue(event, "B2");
console.log(event.venue.room);                 // "A1"
console.log(updated.venue.room);               // "B2"
console.log(updated.tags === event.tags);      // true
console.log(updated.venue === event.venue);    // false`,
      language: "js",
      hints: [
        "Spread the top level: `{ ...event, venue: ... }`.",
        "Spread the nested level you are changing: `{ ...event.venue, room: newRoom }`.",
        "Do not touch `tags` — leaving it alone keeps it shared, which is fine because you are not changing it.",
      ],
      solution: `function renameVenue(event, newRoom) {
  return {
    ...event,
    venue: { ...event.venue, room: newRoom },
  };
}`,
      explanation: "Copy along the path you change (event → venue) and share everything else. This is how immutable updates stay cheap: unchanged branches keep their identity, so `updated.tags === event.tags` is `true`, while `venue` is a new object.",
    },
    examQuestions: [
      {
        question: "What is logged?\n\n```js\nconst a = [1, 2];\nconst b = a;\nb.push(3);\nconsole.log(a.length, a === b);\n```",
        answer: "`3 true` — `b` refers to the same array as `a`.",
        marks: 1,
      },
      {
        question: "True or False: `{ ...obj }` creates a deep copy of `obj`, including its nested objects.",
        answer: "**False.** Spread creates a shallow copy; nested objects are shared. Use `structuredClone` for a deep copy.",
        marks: 1,
      },
      {
        question: "A developer writes `items.push(newItem); setItems(items);` in a React component, but the list does not update. Explain why and give the correct code.",
        answer: "`push` mutates the existing array and the setter receives the same reference; React compares with `Object.is`, sees no change and bails out. Correct: `setItems(prev => [...prev, newItem]);`.",
        marks: 3,
      },
      {
        question: "Name one limitation of `structuredClone`.",
        answer: "It cannot clone functions or DOM nodes (throws `DataCloneError`), and class instances lose their prototype (come back as plain objects).",
        marks: 1,
      },
    ],
    revision: [
      "Primitives are copied by value; objects/arrays/functions are accessed by reference.",
      "`const b = a` for objects copies the reference — both names see changes.",
      "`===` on objects checks identity (same reference), never contents.",
      "Spread/`slice`/`Object.assign` = shallow copy; nested objects remain shared.",
      "`structuredClone` = deep copy (handles Date/Map/Set/cycles; not functions/DOM nodes).",
      "React compares state with `Object.is`: mutate + same reference → no re-render.",
      "Immutable update: copy along the changed path, share the rest (structural sharing).",
    ],
    visualizers: ["reference-copy"],
  },

  /* ================================================================ */
  /* 5. Spread, rest, destructuring, ?. ?? && and modules              */
  /* ================================================================ */
  {
    id: "js-spread-rest-destructuring",
    moduleId: "m03-javascript",
    title: "Spread, Rest, Destructuring, ?. / ?? and ES Modules",
    summary:
      "The modern syntax React code is built from: spreading and collecting values, unpacking objects/arrays/props, safe property access, sensible defaults and import/export.",
    priority: "P0",
    minutes: 35,
    objectives: [
      "Tell spread (expands) apart from rest (collects) by their position",
      "Destructure objects, arrays and function parameters, with renaming and defaults",
      "Choose correctly between `??`, `||` and `&&`, and use optional chaining `?.` safely",
      "Use named and default ES module exports/imports",
    ],
    prerequisites: ["js-references-copies"],
    sources: [
      L02("Slides 26–32 (Spread Operator and rest parameter syntax; Need for Spread Operator?; Solution to shallow copy?; rest parameter Need?/Solution; Spread vs rest; Destructuring)"),
      L02("Slide 11 (destructuring props in the parameter list: function EventCard({ title, price }: EventCardProps))"),
      EXAMPLES("Examples/Advanced/spreadOperatorJS.html, restParameterJS.html, destructuringJS.html"),
      MDN("Spread syntax", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax"),
      MDN("Destructuring", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring"),
      MDN("Nullish coalescing operator (??)", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing"),
      MDN("JavaScript modules", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules"),
    ],
    why: `Open any React file and you'll see this syntax on almost every line: \`const [events, setEvents] = useState([])\` (array destructuring), \`function EventCard({ title, price })\` (parameter destructuring, Lecture 02 slide 11), \`setForm({ ...form, title: value })\` (spread), \`event.category?.name ?? "Uncategorised"\` (optional chaining + nullish coalescing), \`import { getEvents } from "./services/eventService"\` (ES modules).

If any of these is fuzzy, the code reads as noise. Worse, small mix-ups — \`||\` instead of \`??\`, \`count && <Badge/>\` — produce visible bugs like a price of £0 shown as "N/A" or a stray \`0\` rendered on the page.`,
    analogy: `The same three dots do opposite jobs depending on where they stand:

- **Spread** is **unpacking a suitcase** onto the bed — one container becomes many separate items: \`[...fruits1, ...fruits2]\`.
- **Rest** is **packing the leftovers** into a bag — many separate items become one container: \`function sum(...numbers)\`.

**Destructuring** is like **labelled pigeonholes**: you say which labels you want (\`{ title, price }\`) and the values drop straight into variables with those names.

\`??\` is a **"fill in only if blank"** rule: it only replaces a value that is truly missing (\`null\`/\`undefined\`), whereas \`||\` replaces anything that *looks* empty — including a perfectly valid \`0\` or \`""\`.`,
    explain: {
      beginner: `**Spread \`...\`** expands an array or object *where values are expected*:

\`\`\`js
const all = [...fruits1, ...fruits2];          // combine arrays (spreadOperatorJS.html)
const updated = { ...person, age: 31 };        // copy + override a property
\`\`\`

**Rest \`...\`** collects values *where names are expected* — in a parameter list or a destructuring pattern:

\`\`\`js
function sum(...numbers) { /* numbers is a real array */ }  // restParameterJS.html
sum(5, 10, 15, 20); // 50
\`\`\`

**Destructuring** unpacks values into variables (destructuringJS.html):

\`\`\`js
const [firstFruit, secondFruit] = ["apple", "banana", "mango"];
const { firstName, lastName } = person;
\`\`\`

React uses both every day: \`const [count, setCount] = useState(0)\` is array destructuring; \`function EventCard({ title, price })\` destructures props.

**Optional chaining \`?.\`** reads a property only if the thing before it exists: \`user?.address?.city\` gives \`undefined\` instead of crashing when \`user\` is \`null\`.

**Nullish coalescing \`??\`** gives a default only when the left side is \`null\` or \`undefined\`: \`quantity ?? 1\`. Unlike \`||\`, it keeps \`0\` and \`""\`.`,
      developer: `**Spread vs rest — decided by position**:

| Position | Meaning | Example |
|---|---|---|
| Right of \`=\`, in a call, in an array/object literal | spread (expand) | \`Math.max(...prices)\`, \`[...a, x]\`, \`{ ...o, k: v }\` |
| Parameter list or left side of a destructuring | rest (collect) | \`(first, ...others) =>\`, \`const { id, ...data } = event\` |

Rest must be **last**. Later properties win in object spread: \`{ ...defaults, ...userOptions }\`.

**Destructuring features**:
\`\`\`js
const { title, price = 0, venue: { room } = {}, ...rest } = event; // default, nested, rest
const { id: eventId } = event;                 // rename
const [, second] = list;                       // skip
function card({ title, price = 0 }) {}        // parameter destructuring with default
\`\`\`
Defaults apply only when the value is \`undefined\` (not \`null\`).

**Operators**:
- \`a || b\` → \`b\` if \`a\` is **falsy** (\`false, 0, -0, 0n, "", null, undefined, NaN\`).
- \`a ?? b\` → \`b\` only if \`a\` is \`null\` or \`undefined\`.
- \`a && b\` → \`a\` if \`a\` is falsy, else \`b\`. In JSX, \`{count && <Badge/>}\` renders **\`0\`** when \`count\` is 0 — use \`{count > 0 && <Badge/>}\`.
- \`a?.b\`, \`a?.[key]\`, \`fn?.()\` short-circuit to \`undefined\` if the left side is nullish.

**ES modules**: \`export function getEvents() {}\` / \`import { getEvents } from "./eventService"\` (named, braces, exact name); \`export default function App() {}\` / \`import App from "./App"\` (one per file, any local name). With TypeScript's \`verbatimModuleSyntax\`, type-only imports use \`import type { Event } from "./types"\`.`,
      deep: `**Spread mechanics.** Array spread uses the *iterator protocol*, so it works on strings, \`Set\`, \`Map\`, \`NodeList\` and generators (\`[...new Set(ids)]\` de-duplicates). Object spread copies **own enumerable** properties (including symbols) via \`[[Get]]\` — getters are invoked and their *values* are copied; prototypes and non-enumerables are not. Spreading \`null\`/\`undefined\` into an object is a no-op; into an array it throws (not iterable).

Spreading a large array into a function call (\`Math.max(...hugeArray)\`) can exceed the engine's argument limit; use \`reduce\` for very large inputs.

**Rest vs \`arguments\`.** Rest parameters are real arrays and work in arrow functions; the legacy \`arguments\` object is array-like and absent in arrows.

**Destructuring evaluation.** Defaults are evaluated lazily, left to right, and can reference earlier bindings: \`const { a, b = a * 2 } = obj\`. Destructuring \`null\`/\`undefined\` throws \`TypeError: Cannot destructure property 'x' of 'undefined'\` — common when a prop or API field is missing; guard with \`= {}\` defaults.

**\`??\` precedence.** \`??\` cannot be mixed with \`||\`/\`&&\` without parentheses (\`a || b ?? c\` is a SyntaxError) — a deliberate language design to avoid ambiguity.

**Optional chaining short-circuits the whole chain**: in \`a?.b.c.d\`, if \`a\` is nullish, nothing to the right is evaluated. Overusing \`?.\` hides bugs; use it where absence is legitimate (\`imageUrl: string | null\`), not to silence crashes.

**Modules.** ES module imports are **live bindings** (read-only views of the exporter's variables), are hoisted, evaluated once and cached, and are always strict mode. Bundlers like Vite tree-shake unused *named* exports more reliably than properties of a default-exported object.`,
    },
    mechanism: `\`\`\`text
 SPREAD (expand)                          REST (collect)
 ───────────────                          ──────────────
 [ ...[1,2], 3 ]   →  [1, 2, 3]           function f(a, ...rest)
 { ...{x:1}, y:2 } →  {x:1, y:2}          f(1, 2, 3)  → a = 1, rest = [2, 3]
 Math.max(...[4,9]) → Math.max(4, 9)      const { id, ...data } = event
                                            → id = 7, data = { everything else }

 DESTRUCTURING of  event = { id: 7, title: "Gig", price: 0, venue: null }
   const { title, price = 10, venue } = event;
           │       │            └─ null   (default NOT used: only for undefined)
           │       └─ 0        (default NOT used: 0 is a real value)
           └─ "Gig"

 DEFAULTING OPERATORS on value v:
            v = undefined  null   0      ""     false   "Gig"
   v || "x"     "x"        "x"    "x"    "x"    "x"     "Gig"
   v ?? "x"     "x"        "x"    0      ""     false   "Gig"
\`\`\`

- Position decides spread vs rest.
- Destructuring defaults and \`??\` both treat \`0\`/\`""\`/\`false\` as real values; \`||\` does not.`,
    simpleExample: {
      title: "Spread, rest and destructuring from the module examples",
      language: "js",
      code: `// spreadOperatorJS.html
const fruits1 = ["apple", "banana", "orange"];
const fruits2 = ["mango", "pineapple"];
const allFruits = [...fruits1, ...fruits2];
console.log(allFruits.length); // 5

// restParameterJS.html
function sum(...numbers) {
  let total = 0;
  for (const num of numbers) total += num;
  return total;
}
console.log(sum(5, 10, 15, 20)); // 50

// destructuringJS.html (+ rename, default, rest)
const person = { firstName: "Ebad", lastName: "Majeed", age: 30 };
const { firstName, age: years, city = "London", ...others } = person;
console.log(firstName, years, city, others); // Ebad 30 London { lastName: "Majeed" }

const [first, , third] = allFruits;
console.log(first, third); // apple orange`,
      walkthrough: [
        { lines: "2-5", text: "Spread expands both arrays into a new array literal: 3 + 2 = 5 items. Neither original is modified." },
        { lines: "8-13", text: "Rest collects any number of arguments into the real array `numbers`: 5 + 10 + 15 + 20 = 50." },
        { lines: "16-18", text: "`age: years` renames; `city = \"London\"` is used because `person.city` is undefined; `...others` collects the remaining property (`lastName`)." },
        { lines: "20-21", text: "Array destructuring is positional; an empty slot skips the second element." },
      ],
    },
    realExample: {
      title: "Event card props + form update + safe defaults",
      language: "tsx",
      code: `import type { ChangeEvent } from "react";

interface EventCardProps {
  title: string;
  price: number;
  imageUrl: string | null;
  category?: { name: string };
  availableTickets: number;
}

export function EventCard({ title, price, imageUrl, category, availableTickets }: EventCardProps) {
  const categoryName = category?.name ?? "Uncategorised";
  const priceText = price === 0 ? "Free" : \`£\${price.toFixed(2)}\`;
  return (
    <article>
      <img src={imageUrl ?? "/placeholder.png"} alt="" />
      <h2>{title}</h2>
      <p>{categoryName} · {priceText}</p>
      {availableTickets > 0 && <span>{availableTickets} left</span>}
    </article>
  );
}

interface EventForm { title: string; location: string; capacity: number }

export function makeFieldChangeHandler(setForm: (f: (prev: EventForm) => EventForm) => void) {
  return (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "number" ? Number(value) : value }));
  };
}`,
      walkthrough: [
        { lines: "11", text: "Props are destructured in the parameter list, exactly like Lecture 02 slide 11, and typed by the interface." },
        { lines: "12", text: "`?.` avoids a crash if `category` is missing; `??` supplies a fallback only when the result is null/undefined." },
        { lines: "16", text: "`imageUrl` is `string | null` (C# `string?`), so `??` gives a placeholder for null." },
        { lines: "19", text: "`availableTickets > 0 &&` — comparing first prevents React rendering a literal `0` when sold out." },
        { lines: "27-29", text: "Destructure the input's `name`/`value`, then spread the previous form and override one field with a computed key `[name]` — an immutable update." },
      ],
    },
    mistakes: [
      {
        mistake: "Using `||` for defaults on numbers: `const qty = input.qty || 1` turns a valid 0 into 1, and `price || 'N/A'` hides free events.",
        fix: "Use `??` when only null/undefined should trigger the default.",
      },
      {
        mistake: "`{items.length && <List />}` in JSX renders `0` when the array is empty.",
        fix: "Make the left side a boolean: `{items.length > 0 && <List />}` or use a ternary.",
      },
      {
        mistake: "Destructuring a possibly-undefined value: `const { name } = props.category` crashes when category is missing.",
        fix: "Provide a default `const { name } = props.category ?? {}` or use `props.category?.name`.",
      },
      {
        mistake: "Putting rest anywhere but last (`function f(...a, b)`), or confusing rest with spread.",
        fix: "Rest collects and must be the final parameter/element; spread expands and can appear anywhere in a literal or call.",
      },
      {
        mistake: "Importing a named export without braces (`import getEvents from './eventService'`) and getting `undefined`/a build error.",
        fix: "Named exports need braces and the exact name; only `export default` is imported without braces.",
      },
    ],
    debug: {
      prompt: "The order summary says `Qty: 1` and `Note: (none)` even when the user deliberately chose 0 tickets and typed an empty note \"\" to clear it. The product owner wants 0 and \"\" kept; only *missing* values should get defaults. Fix it.",
      language: "js",
      buggyCode: `function summarise(order) {
  const qty = order.qty || 1;
  const note = order.note || "(none)";
  const city = order.address.city || "Unknown";
  return \`Qty: \${qty}, Note: \${note}, City: \${city}\`;
}

console.log(summarise({ qty: 0, note: "" , address: { city: "London" } }));
console.log(summarise({ qty: 2 })); // crashes: Cannot read properties of undefined`,
      hint: "Which values does `||` treat as 'missing'? How can you read `address.city` when `address` itself may not exist?",
      fixedCode: `function summarise(order) {
  const qty = order.qty ?? 1;
  const note = order.note ?? "(none)";
  const city = order.address?.city ?? "Unknown";
  return \`Qty: \${qty}, Note: \${note}, City: \${city}\`;
}

console.log(summarise({ qty: 0, note: "", address: { city: "London" } }));
// "Qty: 0, Note: , City: London"
console.log(summarise({ qty: 2 }));
// "Qty: 2, Note: (none), City: Unknown"`,
      explanation: "`||` falls back for every falsy value, so 0 and \"\" were replaced. `??` falls back only for `null`/`undefined`. The crash came from reading `.city` on `undefined`; `order.address?.city` short-circuits to `undefined`, which `??` then turns into \"Unknown\".",
    },
    challenge: {
      prompt: "Write `toCreatePayload(event)` that removes `id`, `categoryName` and `availableTickets` from an event object using destructuring + rest, and returns the remaining fields with `price` defaulted to 0 only if it is missing. Then write `cheapest(...prices)` that returns the lowest price using rest + spread.",
      starterCode: `const event = {
  id: 9,
  title: "Hack Night",
  location: "Lab 3",
  capacity: 40,
  availableTickets: 12,
  categoryId: 2,
  categoryName: "Tech",
};

function toCreatePayload(event) {
  // your code
}

function cheapest(/* rest param */) {
  // your code
}

console.log(toCreatePayload(event));
// { title: "Hack Night", location: "Lab 3", capacity: 40, categoryId: 2, price: 0 }
console.log(cheapest(15, 5, 25)); // 5`,
      language: "js",
      hints: [
        "`const { id, categoryName, availableTickets, ...payload } = event;`",
        "Return `{ ...payload, price: payload.price ?? 0 }`.",
        "`Math.min(...prices)` spreads the collected rest array back into arguments.",
      ],
      solution: `function toCreatePayload(event) {
  // eslint-disable-next-line no-unused-vars
  const { id, categoryName, availableTickets, ...payload } = event;
  return { ...payload, price: payload.price ?? 0 };
}

function cheapest(...prices) {
  return Math.min(...prices);
}`,
      explanation: "Destructuring pulls out the server-generated fields and `...payload` collects everything else into a new object — the original event is unchanged. `??` adds a price only when it is missing. In `cheapest`, rest collects the arguments into an array and spread expands it back into `Math.min`'s argument list.",
    },
    examQuestions: [
      {
        question: "What is the value of `x`?\n\n```js\nconst x = 0 ?? 10;\n```\n\nA. `10`  B. `0`  C. `undefined`  D. `null`",
        answer: "**B. `0`.** `??` only falls back for `null` or `undefined`; `0` is kept. (`0 || 10` would give `10`.)",
        marks: 1,
      },
      {
        question: "Explain the difference between the spread operator and rest parameter syntax, with one example of each.",
        answer: "Both use `...`. **Spread** expands an iterable/object into individual elements where values are expected, e.g. `[...a, ...b]` or `{ ...user, age: 31 }`. **Rest** collects multiple values into one array/object where names are expected, e.g. `function sum(...numbers)` or `const { id, ...rest } = obj`. Rest must be last.",
        marks: 3,
      },
      {
        question: "Rewrite `function EventCard(props) { return <h2>{props.title} £{props.price}</h2>; }` using parameter destructuring.",
        answer: "`function EventCard({ title, price }) { return <h2>{title} £{price}</h2>; }` (with TypeScript: `({ title, price }: EventCardProps)`).",
        marks: 2,
      },
      {
        question: "True or False: `user?.address?.city` throws a TypeError if `user` is `null`.",
        answer: "**False.** Optional chaining short-circuits and evaluates to `undefined`.",
        marks: 1,
      },
    ],
    revision: [
      "`...` on the right/in literals/calls = spread (expand); in params/destructuring targets = rest (collect, must be last).",
      "Spread copies are shallow; later properties override earlier ones.",
      "Destructuring: `{ a, b: renamed, c = default, ...rest }`, `[first, , third]`; defaults apply only to `undefined`.",
      "`||` defaults on any falsy (0, \"\", false); `??` only on null/undefined.",
      "`?.` short-circuits to `undefined` instead of throwing on null/undefined.",
      "JSX: `{n && <X/>}` renders 0 when n is 0 — use `{n > 0 && <X/>}`.",
      "Named exports: `import { x } from`; default export: `import X from`; types: `import type`.",
    ],
  },

  /* ================================================================ */
  /* 6. Array methods                                                   */
  /* ================================================================ */
  {
    id: "js-array-methods",
    moduleId: "m03-javascript",
    title: "Array Methods: map, filter, find, some/every, sort, slice/splice",
    summary:
      "One product catalogue, every everyday array method — what each returns, whether it mutates, and which one to pick (find returns only the FIRST match).",
    priority: "P0",
    examCritical: true,
    minutes: 40,
    objectives: [
      "Select the right array method for transform, select, search and test tasks",
      "State what each method returns and whether it mutates the original array",
      "Sort numbers and objects correctly with a comparator and avoid mutating state (toSorted / copy first)",
      "Explain the difference between `find` and `filter`, and between `slice` and `splice`",
    ],
    prerequisites: ["js-arrow-this", "js-references-copies"],
    sources: [
      L02("Slides 33–34 and 36 (map(), filter(), map() vs filter() vs reduce()), Slide 16 (Rendering Lists with events.map)"),
      EXAMPLES("Examples/Advanced/mapJS.html, Examples/Advanced/filterJS.html"),
      MOCK("B3 (find() returns every element? — False), A1 distractors (find, sort, slice)"),
      MDN("Array", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array"),
      MDN("Array.prototype.toSorted()", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toSorted"),
    ],
    why: `A React UI is mostly lists: events, products, bookings, reviews. Rendering them is \`map\`; search boxes and category tabs are \`filter\`; a details page needs \`find\`; "is anything sold out?" is \`some\`; a price-sorted catalogue is \`sort\`. Picking the right method keeps code short and declarative.

Getting it wrong is costly in two specific ways the exam loves: (1) **\`find\` returns only the first match** (mock B3 — the statement "find() returns every element that satisfies a condition" is **False**), and (2) **\`sort\` and \`splice\` mutate** the original array — which in React state means stale UI or bugs that appear far away from the line that caused them.`,
    analogy: `Imagine a warehouse conveyor belt of products:

- **map** — every box passes a *labelling machine*; the same number of boxes come out, each transformed.
- **filter** — a *sieve*: only boxes that pass the test drop through; the rest are left behind (original belt untouched).
- **find** — a worker who grabs **the first** matching box and stops looking.
- **some / every** — an inspector answering yes/no: "is *any* box damaged?" / "are *all* boxes labelled?".
- **sort** — rearranging the boxes **on the belt itself** (the original order is gone) — unless you use \`toSorted\`, which builds a sorted *copy* of the belt.
- **slice** — photocopying a section; **splice** — physically cutting boxes out of the belt.`,
    explain: {
      beginner: `All examples use one shared catalogue:

\`\`\`js
const products = [
  { id: 1, name: "Laptop",     category: "tech",   price: 899, stock: 4 },
  { id: 2, name: "Headphones", category: "tech",   price: 59,  stock: 0 },
  { id: 3, name: "Desk Lamp",  category: "home",   price: 25,  stock: 12 },
  { id: 4, name: "Mug",        category: "home",   price: 8,   stock: 30 },
  { id: 5, name: "Backpack",   category: "travel", price: 45,  stock: 7 },
];
\`\`\`

- \`products.map(p => p.name)\` → a **new array of the same length**: \`["Laptop", "Headphones", ...]\`. (Lecture: \`numbers.map(num => num * 2)\` → \`[2, 4, 6, 8, 10]\`.)
- \`products.filter(p => p.stock > 0)\` → a **new array** with only the matching items (4 here). (Lecture: \`numbers.filter(num => num % 2 === 0)\` → \`[2, 4]\`.)
- \`products.find(p => p.category === "home")\` → **one item** — the *first* match (Desk Lamp) — or \`undefined\`.
- \`products.findIndex(p => p.id === 4)\` → its position (\`3\`), or \`-1\`.
- \`products.some(p => p.stock === 0)\` → \`true\` (at least one sold out).
- \`products.every(p => p.price > 5)\` → \`true\` (all of them).
- \`["tech", "home"].includes("home")\` → \`true\`.

The callbacks receive \`(item, index, array)\`. These methods don't change \`products\` — except \`sort\` and \`splice\`, which do.`,
      developer: `**Returns / mutates cheat sheet** (on \`products\` above):

| Method | Returns | Mutates? |
|---|---|---|
| \`map(fn)\` | new array, same length | No |
| \`filter(fn)\` | new array, 0..n items | No |
| \`find(fn)\` | **first** matching element or \`undefined\` | No |
| \`findIndex(fn)\` | index of first match or \`-1\` | No |
| \`some(fn)\` / \`every(fn)\` | boolean (short-circuits) | No |
| \`includes(value)\` | boolean (SameValueZero — objects by reference) | No |
| \`sort(cmp)\` | **the same array**, sorted | **Yes** |
| \`toSorted(cmp)\` (ES2023) | new sorted array | No |
| \`slice(start, end)\` | new array (end exclusive) | No |
| \`splice(start, count, ...items)\` | array of **removed** items | **Yes** |
| \`flatMap(fn)\` | new array, flattened one level | No |
| \`forEach(fn)\` | \`undefined\` | No (but used for side effects) |

**Sorting**: default \`sort()\` compares items as **strings** — \`[899, 59, 25, 8, 45].sort()\` gives \`[25, 45, 59, 8, 899]\`. Always pass a comparator: \`(a, b) => a.price - b.price\` (negative → a first). For strings: \`a.name.localeCompare(b.name)\`.

**In React state**, never call \`sort\`/\`splice\`/\`reverse\` on state directly. Use \`items.toSorted(cmp)\`, \`[...items].sort(cmp)\`, \`items.filter(i => i.id !== id)\` (remove) and \`items.toSpliced(...)\`.

**Chaining**: \`products.filter(p => p.stock > 0).map(p => p.name)\` reads left-to-right like a pipeline. Each step allocates a new array — fine for UI-sized lists.`,
      deep: `**Short-circuiting.** \`find\`, \`findIndex\`, \`some\`, \`every\` and \`includes\` stop at the first decisive element; \`map\`/\`filter\`/\`forEach\` always visit every element. \`every\` on an empty array is \`true\` and \`some\` is \`false\` (vacuous truth) — a classic edge-case for "all items valid?" checks on an empty form list.

**Holes and \`undefined\`.** \`find\` returns \`undefined\` both for "no match" and for a matching element that *is* \`undefined\`; use \`findIndex\` if that matters. In TypeScript, \`find\` returns \`T | undefined\`, forcing you to handle the not-found case (e.g. render a 404 when an event id doesn't exist).

**\`includes\` vs \`indexOf\`.** \`includes\` uses SameValueZero, so \`[NaN].includes(NaN)\` is \`true\` whereas \`indexOf(NaN)\` is \`-1\`. Neither does deep equality: \`products.includes({ id: 1, ... })\` is \`false\` because the literal is a different object.

**Sort stability and comparators.** Since ES2019 \`sort\` is required to be **stable** (equal elements keep their relative order), so you can sort by category then by price by sorting twice (price first, then category) or by a compound comparator. A comparator must be consistent (return negative/zero/positive); returning a boolean (\`a.price > b.price\`) gives engine-dependent results.

**Mutation copies.** ES2023 added non-mutating twins: \`toSorted\`, \`toReversed\`, \`toSpliced\`, \`with(index, value)\`. They need a modern lib target in TypeScript (\`ES2023\`).

**Performance.** Repeated \`find\` inside \`map\` is O(n·m); for large joins build a \`Map\` by id first. Callbacks also receive \`index\` — but using the index as a React \`key\` breaks identity when the list is filtered or sorted; use a stable id.`,
    },
    mechanism: `\`\`\`text
 products = [Laptop 899, Headphones 59, Desk Lamp 25, Mug 8, Backpack 45]

 map(p => p.price)        ──▶ [899, 59, 25, 8, 45]          new, same length
 filter(p => p.price<50)  ──▶ [Desk Lamp, Mug, Backpack]     new, subset
 find(p => p.price<50)    ──▶ Desk Lamp   (stops here ✋)     ONE element
 findIndex(...)           ──▶ 2
 some(p => p.stock===0)   ──▶ true   (stops at Headphones)
 every(p => p.stock>0)    ──▶ false  (stops at Headphones)

 sort((a,b)=>a.price-b.price)
   products ──┐ SAME array reordered in place ──▶ products is now [Mug, Desk Lamp, ...]  ⚠ MUTATED
 toSorted((a,b)=>a.price-b.price)
   products ──▶ untouched;  returns NEW [Mug 8, Desk Lamp 25, Backpack 45, Headphones 59, Laptop 899]

 slice(1, 3)   ──▶ [Headphones, Desk Lamp]    products untouched
 splice(1, 2)  ──▶ [Headphones, Desk Lamp]    products loses those 2 ⚠ MUTATED
\`\`\`

- Ask two questions for every method: **what comes back?** and **is the original changed?**
- Short-circuit methods stop as soon as the answer is known.`,
    simpleExample: {
      title: "Every method on one catalogue",
      language: "js",
      code: `const products = [
  { id: 1, name: "Laptop", category: "tech", price: 899, stock: 4 },
  { id: 2, name: "Headphones", category: "tech", price: 59, stock: 0 },
  { id: 3, name: "Desk Lamp", category: "home", price: 25, stock: 12 },
  { id: 4, name: "Mug", category: "home", price: 8, stock: 30 },
  { id: 5, name: "Backpack", category: "travel", price: 45, stock: 7 },
];

const names = products.map((p) => p.name);                 // 5 names
const inStock = products.filter((p) => p.stock > 0);       // 4 products
const firstHome = products.find((p) => p.category === "home"); // Desk Lamp only
const allHome = products.filter((p) => p.category === "home"); // [Desk Lamp, Mug]
const mugIndex = products.findIndex((p) => p.name === "Mug");  // 3
const anySoldOut = products.some((p) => p.stock === 0);    // true
const allCheap = products.every((p) => p.price < 100);     // false (Laptop)
const hasTravel = products.map((p) => p.category).includes("travel"); // true

const byPrice = products.toSorted((a, b) => a.price - b.price);
console.log(byPrice.map((p) => p.name));
// ["Mug", "Desk Lamp", "Backpack", "Headphones", "Laptop"]
console.log(products[0].name); // "Laptop" — original order kept

console.log([899, 59, 25, 8, 45].sort()); // [25, 45, 59, 8, 899]  string order!
const tags = products.flatMap((p) => (p.stock === 0 ? [] : [p.category]));
console.log(tags); // ["tech", "home", "home", "travel"]`,
      walkthrough: [
        { lines: "9", text: "`map` transforms each element; the output always has the same length as the input." },
        { lines: "10", text: "`filter` keeps items whose callback returns truthy — Headphones (stock 0) is dropped." },
        { lines: "11-12", text: "Same predicate, different method: `find` returns ONE object (the first match), `filter` returns an ARRAY of all matches. This is mock B3." },
        { lines: "13-16", text: "`findIndex` → position; `some`/`every` → booleans; `includes` checks for a value (here on a mapped array of strings)." },
        { lines: "18-21", text: "`toSorted` returns a sorted copy using a numeric comparator; `products` keeps its order." },
        { lines: "23", text: "Without a comparator, numbers are compared as strings: \"8\" sorts after \"59\" because '8' > '5'." },
        { lines: "24-25", text: "`flatMap` maps and flattens one level — returning `[]` removes an item, so it can filter and map in one pass." },
      ],
    },
    realExample: {
      title: "CampusEvents list page: search, category filter, sort, details lookup",
      language: "tsx",
      code: `interface CampusEvent {
  id: number;
  title: string;
  price: number;
  availableTickets: number;
  categoryName: string;
}

type SortKey = "price-asc" | "price-desc" | "title";

const comparators: Record<SortKey, (a: CampusEvent, b: CampusEvent) => number> = {
  "price-asc": (a, b) => a.price - b.price,
  "price-desc": (a, b) => b.price - a.price,
  title: (a, b) => a.title.localeCompare(b.title),
};

export function visibleEvents(
  events: CampusEvent[],
  search: string,
  category: string,
  sort: SortKey,
): CampusEvent[] {
  const term = search.trim().toLowerCase();
  return events
    .filter((e) => category === "All" || e.categoryName === category)
    .filter((e) => e.title.toLowerCase().includes(term))
    .toSorted(comparators[sort]);
}

export function EventList({ events }: { events: CampusEvent[] }) {
  const shown = visibleEvents(events, "", "All", "price-asc");
  const anySoldOut = events.some((e) => e.availableTickets === 0);
  const selected = events.find((e) => e.id === 42); // CampusEvent | undefined

  return (
    <>
      {anySoldOut && <p>Some events are sold out.</p>}
      {selected ? <h2>{selected.title}</h2> : <p>Event not found.</p>}
      <ul>
        {shown.map((e) => (
          <li key={e.id}>{e.title} — £{e.price}</li>
        ))}
      </ul>
    </>
  );
}`,
      walkthrough: [
        { lines: "11-15", text: "A lookup table of comparators avoids a chain of if/else; numeric sorts subtract, string sorts use `localeCompare`." },
        { lines: "23-27", text: "Filters chain into a pipeline; `toSorted` sorts a copy, so the `events` prop (owned by a parent or a query cache) is never mutated." },
        { lines: "32", text: "`some` answers a yes/no question and stops at the first sold-out event." },
        { lines: "33", text: "`find` returns a single event or `undefined` — TypeScript forces the not-found branch below." },
        { lines: "38", text: "Ternary handles both cases of `find`'s result." },
        { lines: "40-42", text: "`map` renders the list; `key={e.id}` uses a stable id, not the array index." },
      ],
    },
    mistakes: [
      {
        mistake: "Using `find` when you need all matches (and believing it returns every matching element).",
        fix: "`find` returns the FIRST match or `undefined`. Use `filter` for all matches.",
      },
      {
        mistake: "Calling `.sort()` on numbers without a comparator.",
        fix: "Default sort compares strings. Use `(a, b) => a - b` (ascending) or `b - a` (descending).",
      },
      {
        mistake: "Sorting or splicing React state / props in place (`events.sort(...)`).",
        fix: "Use `toSorted`/`toSpliced`, or copy first: `[...events].sort(...)`; remove items with `filter`.",
      },
      {
        mistake: "Using `map` for side effects and ignoring the returned array, or using `forEach` and expecting a return value.",
        fix: "`map` is for producing a new array; `forEach` returns `undefined` and is only for side effects.",
      },
      {
        mistake: "Mixing up `slice` and `splice`.",
        fix: "`slice(start, end)` copies a section (non-mutating, end exclusive); `splice(start, deleteCount, ...items)` edits the array in place and returns removed items.",
      },
    ],
    debug: {
      prompt: "After showing the 'cheapest first' list, the admin table (which should keep the original catalogue order) is also sorted cheapest-first, and the 'top price' badge shows the wrong product. Find the bug and fix it.",
      language: "js",
      buggyCode: `const products = [
  { id: 1, name: "Laptop", price: 899 },
  { id: 2, name: "Headphones", price: 59 },
  { id: 3, name: "Desk Lamp", price: 25 },
  { id: 4, name: "Mug", price: 8 },
];

const cheapestFirst = products.sort((a, b) => a.price - b.price);
console.log(cheapestFirst.map((p) => p.name).join(", "));

// elsewhere — admin table in catalogue order, and the first product's badge
console.log(products.map((p) => p.name).join(", "));
console.log("Top product:", products[0].name); // expected Laptop`,
      hint: "What does `sort` return, and what does it do to the array it is called on?",
      fixedCode: `const products = [
  { id: 1, name: "Laptop", price: 899 },
  { id: 2, name: "Headphones", price: 59 },
  { id: 3, name: "Desk Lamp", price: 25 },
  { id: 4, name: "Mug", price: 8 },
];

const cheapestFirst = products.toSorted((a, b) => a.price - b.price);
// or: const cheapestFirst = [...products].sort((a, b) => a.price - b.price);
console.log(cheapestFirst.map((p) => p.name).join(", ")); // Mug, Desk Lamp, Headphones, Laptop

console.log(products.map((p) => p.name).join(", ")); // Laptop, Headphones, Desk Lamp, Mug
console.log("Top product:", products[0].name);        // Laptop`,
      explanation: "`sort` reorders the array in place and returns the same array, so `cheapestFirst === products`. Every other reader of `products` now sees the sorted order. `toSorted` (or sorting a spread copy) leaves the original untouched.",
    },
    challenge: {
      prompt: "Using the shared `products` catalogue, return the **names** of in-stock products priced under £50, cheapest first, without mutating `products`. Then return the first out-of-stock product's name (or \"none\").",
      starterCode: `const products = [
  { id: 1, name: "Laptop", category: "tech", price: 899, stock: 4 },
  { id: 2, name: "Headphones", category: "tech", price: 59, stock: 0 },
  { id: 3, name: "Desk Lamp", category: "home", price: 25, stock: 12 },
  { id: 4, name: "Mug", category: "home", price: 8, stock: 30 },
  { id: 5, name: "Backpack", category: "travel", price: 45, stock: 7 },
];

function affordableInStock(list) {
  // your code
}

function firstSoldOut(list) {
  // your code
}

console.log(affordableInStock(products)); // ["Mug", "Desk Lamp", "Backpack"]
console.log(firstSoldOut(products));      // "Headphones"`,
      language: "js",
      hints: [
        "Filter on both conditions, then sort a copy, then map to names.",
        "`find` returns `undefined` when nothing matches — use `?.` and `??`.",
        "Order of operations matters for readability: filter → sort → map.",
      ],
      solution: `function affordableInStock(list) {
  return list
    .filter((p) => p.stock > 0 && p.price < 50)
    .toSorted((a, b) => a.price - b.price)
    .map((p) => p.name);
}

function firstSoldOut(list) {
  return list.find((p) => p.stock === 0)?.name ?? "none";
}`,
      explanation: "`filter` keeps Desk Lamp (25), Mug (8) and Backpack (45); `toSorted` orders them 8, 25, 45 on a copy; `map` extracts names. `find` stops at the first product with zero stock (Headphones); optional chaining + `??` handle the no-match case.",
    },
    examQuestions: [
      {
        question: "**(Mock B3)** True or False: The JavaScript `find()` method returns every element that satisfies a condition.",
        answer: "**False.** `find()` returns only the **first** element that satisfies the condition (or `undefined`). `filter()` returns all matching elements in a new array.",
        marks: 1,
      },
      {
        question: "Which array method returns a new array of the same length where each element has been transformed?\n\nA. `filter()`\nB. `map()`\nC. `find()`\nD. `some()`",
        answer: "**B. `map()`.**",
        marks: 1,
      },
      {
        question: "What does this log, and why?\n\n```js\nconsole.log([10, 9, 1].sort());\n```",
        answer: "`[1, 10, 9]`. Without a comparator, `sort` converts elements to strings and compares them lexicographically (\"10\" < \"9\"). Use `.sort((a, b) => a - b)` → `[1, 9, 10]`.",
        marks: 2,
      },
      {
        question: "Explain the difference between `slice()` and `splice()` and why it matters for React state.",
        answer: "`slice(start, end)` returns a new array copy of a section and does not modify the original. `splice(start, count, ...items)` modifies the original array in place and returns the removed elements. React state must not be mutated (React compares references), so use `slice`/`filter`/`toSpliced` instead of `splice` on state.",
        marks: 3,
      },
      {
        question: "A list should show a warning if **any** basket item is out of stock. Which method is most appropriate?\n\nA. `every()`\nB. `some()`\nC. `map()`\nD. `reduce()`",
        answer: "**B. `some()`** — returns `true` as soon as one element matches.",
        marks: 1,
      },
    ],
    revision: [
      "`map` → new array, same length (transform). `filter` → new array, subset (select).",
      "`find` → FIRST match or `undefined` (mock B3: it does NOT return every match). `findIndex` → index or -1.",
      "`some` = any match? `every` = all match? Both return booleans and short-circuit.",
      "`includes` → boolean; compares objects by reference.",
      "`sort` MUTATES and compares as strings by default — pass `(a, b) => a - b`; prefer `toSorted` / `[...arr].sort`.",
      "`slice` copies (non-mutating); `splice` edits in place and returns removed items.",
      "`flatMap` maps then flattens one level; `forEach` returns `undefined`.",
      "Use stable ids, not indexes, as React keys after filter/sort.",
    ],
    visualizers: ["array-methods"],
  },

  /* ================================================================ */
  /* 7. reduce                                                          */
  /* ================================================================ */
  {
    id: "js-array-reduce",
    moduleId: "m03-javascript",
    title: "reduce(): Folding an Array into One Value",
    summary:
      "How reduce carries an accumulator through an array step by step — basket totals (mock A1/C1), counting, grouping — and why the initial value matters.",
    priority: "P0",
    examCritical: true,
    minutes: 35,
    objectives: [
      "Trace a `reduce` call step by step, writing down the accumulator after each element",
      "Write `const total = prices.reduce((sum, p) => sum + p, 0);` from memory and explain each part",
      "Explain what goes wrong without an initial value (empty arrays, arrays of objects)",
      "Use `reduce` to build objects: counts and groups by category",
    ],
    prerequisites: ["js-array-methods"],
    sources: [
      L02("Slide 35 (reduce()), Slide 36 (map() vs filter() vs reduce()), Slide 26 notes (0 is the initial value of the accumulator; curr is the current element)"),
      EXAMPLES("Examples/Advanced/reduceJS.html (numbers.reduce((total, num) => total + num, 0) → 15)"),
      MOCK("A1 (shopping-basket total → reduce()), C1 (const prices = [15, 25, 10, 30]; total with reduce)"),
      MDN("Array.prototype.reduce()", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce"),
    ],
    why: `Many questions about a list have a **single answer**: the basket total, the number of sold-out events, the most expensive product, a lookup object of events by category. \`map\` gives you another list, \`filter\` gives you a smaller list — \`reduce\` is the method that **collapses a list into one value**.

The mock paper tests this directly twice: **A1** asks which method is most appropriate for "the total value of all items in a shopping basket" (answer: \`reduce()\`), and **C1** asks you to write the statement for \`const prices = [15, 25, 10, 30];\`. You should be able to write and trace it in your sleep.`,
    analogy: `\`reduce\` is a **cashier with a running total on the till**.

The till starts at the **initial value** (£0). Each item from the basket goes across the scanner one at a time; the cashier adds its price to whatever the till currently shows, and the till now shows the new running total. When the last item has been scanned, whatever the till shows is the answer.

The till is the **accumulator**, each scanned item is the **current value**, and the rule "add the price to the till" is your **callback**. Forget to reset the till to £0 at the start (no initial value) and the cashier just uses the first item *itself* as the starting display — fine for plain numbers, nonsense for product objects.`,
    explain: {
      beginner: `\`reduce\` takes two things: a **callback** and an **initial value**.

\`\`\`js
const prices = [15, 25, 10, 30];
const total = prices.reduce((sum, p) => sum + p, 0);
console.log(total); // 80
\`\`\`

- \`0\` — the **initial value**: what the accumulator (\`sum\`) starts as.
- \`(sum, p) => sum + p\` — called once per element. \`sum\` is the running total so far, \`p\` is the current price. Whatever you **return** becomes the new \`sum\` for the next element.
- The final returned value is the result.

Trace it:

| step | sum (before) | p | returned |
|---|---|---|---|
| 1 | 0 | 15 | 15 |
| 2 | 15 | 25 | 40 |
| 3 | 40 | 10 | 50 |
| 4 | 50 | 30 | **80** |

This is exactly the module example \`numbers.reduce((total, num) => total + num, 0)\`, which gives 15 for \`[1, 2, 3, 4, 5]\`. The names don't matter — \`acc\`/\`curr\`, \`total\`/\`num\`, \`sum\`/\`p\` all work — what matters is: **first parameter = accumulator, second = current element**, and **always return the new accumulator**.`,
      developer: `Full signature: \`array.reduce((acc, current, index, array) => newAcc, initialValue)\`.

**Totals from objects** (basket):
\`\`\`js
const total = basket.reduce((sum, item) => sum + item.price * item.qty, 0);
\`\`\`
The initial value \`0\` is essential here: without it, the first accumulator is the first **item object**, and \`object + number\` becomes string concatenation (\`"[object Object]24..."\`).

**Counting**:
\`\`\`js
const soldOut = events.reduce((n, e) => (e.availableTickets === 0 ? n + 1 : n), 0);
\`\`\`
(\`events.filter(...).length\` is equally fine and often clearer.)

**Grouping / lookup objects** — the accumulator can be any type:
\`\`\`js
const countByCategory = events.reduce((acc, e) => {
  acc[e.categoryName] = (acc[e.categoryName] ?? 0) + 1;
  return acc;
}, {});
// { Tech: 2, Sports: 1 }
\`\`\`
Mutating a *fresh* accumulator object you created in the initial value is fine — it isn't shared state. Modern runtimes also offer \`Object.groupBy(events, e => e.categoryName)\` (ES2024).

**Max/min**: \`prices.reduce((max, p) => (p > max ? p : max), -Infinity)\` — or \`Math.max(...prices)\` for small arrays.

**When not to use reduce**: if a \`map\`/\`filter\`/\`for...of\` reads more clearly, prefer it. \`reduce\` shines when the answer is one value (number, object, Map) built from all elements.

**In TypeScript**, give the accumulator a type when it differs from the elements: \`events.reduce<Record<string, number>>((acc, e) => ..., {})\`.`,
      deep: `**Initial value semantics.** With an initial value, the callback runs \`length\` times starting at index 0. **Without** one, the first element becomes the accumulator and the callback runs \`length - 1\` times starting at index 1. Consequences:
- Empty array + no initial value → \`TypeError: Reduce of empty array with no initial value\`. A basket that is empty must still total 0, so always pass \`0\`.
- Single-element array + no initial value → the callback never runs; that element is returned as-is.
- Element type ≠ accumulator type (objects → number) → you *must* supply an initial value, or the first object leaks in as the accumulator.

**Purity.** The callback should depend only on \`(acc, current)\`. Side effects inside \`reduce\` (API calls, setState) make it hard to reason about; reduce is a *fold*, a pure computation.

**Performance traps.** \`reduce((acc, x) => ({ ...acc, [x.id]: x }), {})\` copies the accumulator on every step — O(n²) for large arrays. Mutating the local accumulator (\`acc[x.id] = x; return acc;\`) is O(n) and safe because nothing else references it yet. Similarly, \`acc.concat(x)\` per step is quadratic; use \`push\`.

**Money and floating point.** \`0.1 + 0.2 === 0.30000000000000004\`. Summing many decimal prices can drift; production code stores **integer pence** and formats at the edge (\`(pence / 100).toFixed(2)\` or \`Intl.NumberFormat\`). Rounding only for display is acceptable for coursework-sized baskets.

**\`reduceRight\`** folds from the end — rarely needed outside function composition.

**React.** Derive totals during render (\`const total = items.reduce(...)\`) instead of storing them in state — duplicated state goes out of sync. Wrap in \`useMemo\` only if the list is large and profiling shows it matters.`,
    },
    mechanism: `\`\`\`text
 prices.reduce((sum, p) => sum + p, 0)      prices = [15, 25, 10, 30]

   initial ──▶ sum = 0
                 │
   p = 15  ──▶ ( 0 + 15) ──▶ sum = 15
                 │
   p = 25  ──▶ (15 + 25) ──▶ sum = 40
                 │
   p = 10  ──▶ (40 + 10) ──▶ sum = 50
                 │
   p = 30  ──▶ (50 + 30) ──▶ sum = 80 ──▶ returned → total = 80

 WITHOUT initial value on objects:
   basket = [{price: 2, qty: 3}, {price: 5, qty: 1}]
   acc = basket[0] (an OBJECT!)          ← no initial value
   step 1: acc + 5*1 → "[object Object]" + 5 → "[object Object]5"  ✗
\`\`\`

- The value you **return** from the callback is the only thing carried forward.
- Forgetting \`return\` in a block-bodied callback makes the accumulator \`undefined\` on the next step (→ \`NaN\`).`,
    simpleExample: {
      title: "Mock C1 exactly, plus the module example",
      language: "js",
      code: `// Mock ICT C1
const prices = [15, 25, 10, 30];
const total = prices.reduce((sum, p) => sum + p, 0);
console.log(total); // 80

// reduceJS.html
const numbers = [1, 2, 3, 4, 5];
const sumOfNumbers = numbers.reduce((total, num) => total + num, 0);
console.log(sumOfNumbers); // 15

// Why the initial value matters
console.log([].reduce((sum, p) => sum + p, 0)); // 0
// [].reduce((sum, p) => sum + p);  // TypeError: Reduce of empty array with no initial value

// Highest price
const highest = prices.reduce((max, p) => (p > max ? p : max), -Infinity);
console.log(highest); // 30`,
      walkthrough: [
        { lines: "2-4", text: "The exact answer to mock C1. Accumulator 0 → 15 → 40 → 50 → 80." },
        { lines: "7-9", text: "The module's example: 0+1+2+3+4+5 = 15. Parameter names are just labels." },
        { lines: "12-13", text: "An empty basket with an initial value safely totals 0; without one, `reduce` throws." },
        { lines: "16-17", text: "The accumulator doesn't have to be a sum — here it remembers the largest value seen so far." },
      ],
    },
    realExample: {
      title: "Shopping basket total and events-per-category summary",
      language: "ts",
      code: `interface BasketItem {
  name: string;
  price: number; // pounds
  qty: number;
}

const basket: BasketItem[] = [
  { name: "Notebook", price: 3.5, qty: 4 },
  { name: "Pen", price: 1.2, qty: 10 },
  { name: "Bag", price: 20, qty: 1 },
];

const basketTotal = basket.reduce((sum, item) => sum + item.price * item.qty, 0);
console.log(\`Total: £\${basketTotal.toFixed(2)}\`); // Total: £46.00

const itemCount = basket.reduce((n, item) => n + item.qty, 0); // 15

interface CampusEvent {
  id: number;
  title: string;
  categoryName: string;
  availableTickets: number;
}

const events: CampusEvent[] = [
  { id: 1, title: "Tech Conference", categoryName: "Tech", availableTickets: 0 },
  { id: 2, title: "Sports Day", categoryName: "Sports", availableTickets: 50 },
  { id: 3, title: "Hack Night", categoryName: "Tech", availableTickets: 12 },
];

const perCategory = events.reduce<Record<string, number>>((acc, e) => {
  acc[e.categoryName] = (acc[e.categoryName] ?? 0) + 1;
  return acc;
}, {});
console.log(perCategory, itemCount); // { Tech: 2, Sports: 1 } 15`,
      walkthrough: [
        { lines: "13", text: "Line totals: 3.5×4 = 14, 1.2×10 = 12, 20×1 = 20 → 0 → 14 → 26 → 46. The initial `0` is required because the elements are objects." },
        { lines: "14", text: "Format only at the edge; `toFixed(2)` gives `46.00`." },
        { lines: "16", text: "Same pattern, different question: 4 + 10 + 1 = 15 items." },
        { lines: "31-34", text: "The accumulator is an object. The type argument `<Record<string, number>>` tells TypeScript what the accumulator holds; `?? 0` initialises a new key. Mutating `acc` is safe because it was created fresh by the initial value `{}`." },
      ],
    },
    mistakes: [
      {
        mistake: "Leaving out the initial value when summing a property of objects: `basket.reduce((s, i) => s + i.price)`.",
        fix: "Always pass `0`: `basket.reduce((s, i) => s + i.price, 0)`. Otherwise the first object becomes the accumulator.",
      },
      {
        mistake: "Forgetting to `return` inside a block-bodied callback: `(sum, p) => { sum + p; }` → `NaN`/`undefined`.",
        fix: "Return the new accumulator, or use an expression body `(sum, p) => sum + p`.",
      },
      {
        mistake: "Swapping the parameters: `(p, sum) => ...`.",
        fix: "The first parameter is ALWAYS the accumulator, the second is the current element.",
      },
      {
        mistake: "Storing the basket total in its own `useState` and trying to keep it in sync.",
        fix: "Derive it during render: `const total = items.reduce(...)`.",
      },
      {
        mistake: "Picking `find`, `sort` or `slice` for a total (mock A1 distractors).",
        fix: "`find` returns one element, `sort` reorders, `slice` copies — only `reduce` accumulates a single value.",
      },
    ],
    debug: {
      prompt: "The basket badge shows `Total: £[object Object]2420` instead of `Total: £46`. Find and fix the bug.",
      language: "js",
      buggyCode: `const basket = [
  { name: "Notebook", price: 3.5, qty: 4 },
  { name: "Pen", price: 1.2, qty: 10 },
  { name: "Bag", price: 20, qty: 1 },
];

const total = basket.reduce((sum, item) => sum + item.price * item.qty);
console.log("Total: £" + total);`,
      hint: "With no initial value, what is `sum` on the first call? What does `object + number` produce?",
      fixedCode: `const basket = [
  { name: "Notebook", price: 3.5, qty: 4 },
  { name: "Pen", price: 1.2, qty: 10 },
  { name: "Bag", price: 20, qty: 1 },
];

const total = basket.reduce((sum, item) => sum + item.price * item.qty, 0);
console.log("Total: £" + total); // Total: £46`,
      explanation: "Without an initial value, `sum` starts as the first element — the Notebook object — and iteration starts at the Pen. `object + 12` converts the object to the string \"[object Object]\" and concatenates: \"[object Object]12\", then + 20 → \"[object Object]1220\"... (exact text depends on the numbers, but it is always a string). Passing `0` makes the accumulator a number from the start and includes the Notebook's 14.",
    },
    challenge: {
      prompt: "Given an array of bookings, use `reduce` to return `{ totalTickets, revenue, byStatus }` in a **single pass**, where `byStatus` counts bookings per status.",
      starterCode: `const bookings = [
  { id: 1, tickets: 2, unitPrice: 15, status: "Confirmed" },
  { id: 2, tickets: 1, unitPrice: 5, status: "Cancelled" },
  { id: 3, tickets: 4, unitPrice: 15, status: "Confirmed" },
  { id: 4, tickets: 3, unitPrice: 10, status: "Pending" },
];

function summarise(list) {
  // your code
}

console.log(summarise(bookings));
// { totalTickets: 10, revenue: 125, byStatus: { Confirmed: 2, Cancelled: 1, Pending: 1 } }`,
      language: "js",
      hints: [
        "Initial value: `{ totalTickets: 0, revenue: 0, byStatus: {} }`.",
        "Inside the callback, update all three fields, then `return acc`.",
        "revenue = Σ tickets × unitPrice = 30 + 5 + 60 + 30 = 125.",
      ],
      solution: `function summarise(list) {
  return list.reduce(
    (acc, b) => {
      acc.totalTickets += b.tickets;
      acc.revenue += b.tickets * b.unitPrice;
      acc.byStatus[b.status] = (acc.byStatus[b.status] ?? 0) + 1;
      return acc;
    },
    { totalTickets: 0, revenue: 0, byStatus: {} },
  );
}`,
      explanation: "The accumulator can be any shape. Starting from a fresh object literal means mutating it inside the callback is safe (no one else holds a reference) and keeps the fold O(n). Tickets: 2+1+4+3 = 10. Revenue: 30+5+60+30 = 125. Note that this naive version counts cancelled bookings in revenue — a real app might `filter` first.",
    },
    examQuestions: [
      {
        question: "**(Mock A1)** A React application needs to display the total value of all items in a shopping basket. Which JavaScript array method is most appropriate for calculating a single accumulated value?\n\nA. `find()`\nB. `reduce()`\nC. `sort()`\nD. `slice()`",
        answer: "**B. `reduce()`** — it combines all elements into one accumulated value. `find` returns one element, `sort` reorders, `slice` copies part of the array.",
        marks: 1,
      },
      {
        question: "**(Mock C1)** Given `const prices = [15, 25, 10, 30];`, write a JavaScript statement using `reduce()` to calculate the total of all prices and store it in a variable named `total`.",
        answer: "```js\nconst total = prices.reduce((sum, p) => sum + p, 0);\n```\nAccumulator `sum` starts at the initial value `0`; each step returns `sum + p`: 0 → 15 → 40 → 50 → **80**. (Marks typically for: correct `reduce` call, accumulator callback returning the sum, initial value 0 / correct variable.)",
        marks: 3,
      },
      {
        question: "What happens when `[].reduce((a, b) => a + b)` runs?",
        answer: "It throws `TypeError: Reduce of empty array with no initial value`. Supplying an initial value (`, 0`) returns 0 instead.",
        marks: 1,
      },
      {
        question: "Trace `[2, 4, 6].reduce((acc, n) => acc + n * 10, 1)` and give the result.",
        answer: "acc: 1 → 1 + 20 = 21 → 21 + 40 = 61 → 61 + 60 = **121**.",
        marks: 2,
      },
    ],
    revision: [
      "`reduce((acc, current) => newAcc, initialValue)` folds an array into ONE value.",
      "Mock C1: `const total = prices.reduce((sum, p) => sum + p, 0);` → 80.",
      "Mock A1: basket total → `reduce()` (not find/sort/slice).",
      "First param = accumulator, second = current element; whatever you return is carried forward.",
      "Always pass an initial value — empty arrays throw without one, and object arrays break.",
      "Accumulator can be a number, string, object or Map — counts and groups use `{}`.",
      "Derive totals during render; don't duplicate them in state.",
    ],
    visualizers: ["reduce-accumulator"],
  },

  /* ================================================================ */
  /* 8. Promises & async/await                                          */
  /* ================================================================ */
  {
    id: "js-promises-async",
    moduleId: "m03-javascript",
    title: "Promises & async/await: Working with Results That Arrive Later",
    summary:
      "Promise states, then/catch/finally, async/await with try/catch, error propagation, and the combinators Promise.all (fails fast), allSettled, race and any — plus sequential vs concurrent awaits.",
    priority: "P0",
    examCritical: true,
    minutes: 45,
    objectives: [
      "Explain why network requests are asynchronous and what a Promise represents",
      "Name the three Promise states and how a promise settles",
      "Consume promises with then/catch/finally and with async/await + try/catch/finally",
      "Choose between Promise.all, allSettled, race and any — and know that Promise.all rejects on the first rejection",
      "Run independent requests concurrently instead of accidentally sequentially",
    ],
    prerequisites: ["js-arrow-this"],
    sources: [
      L02("Slide 37 (promise)"),
      EXAMPLES("Examples/Advanced/promiseJS.html (new Promise with resolve/reject after setTimeout; 'Promise is pending...' logs first)"),
      W03("Slides 7–12 (fetch(); Synchronous vs Asynchronous; Promises — Pending/Fulfilled/Rejected; async and await; the Response object; checking response.ok)"),
      MOCK("A7 (purpose of Promise.all), D2a (why asynchronous operations are needed)"),
      MDN("Promise", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise"),
      MDN("Promise.all()", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all"),
      MDN("async function", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function"),
    ],
    why: `A request to \`http://localhost:5229/api/events\` might take 20 ms or 20 seconds. If JavaScript **waited** (synchronously) the whole browser tab would freeze: no clicks, no scrolling, no spinner. Week 03 (slide 8) contrasts the two models: synchronous "do A, wait, do B" versus asynchronous "start request, continue working, process the response when it arrives".

A **Promise** is JavaScript's object for "a result that will exist later" (Week 03 slide 9). \`fetch\` returns one, \`response.json()\` returns one, TanStack Query's \`queryFn\` must return one. \`async/await\` is just nicer syntax over promises. The mock tests this in A7 (\`Promise.all\`) and D2 (loading/error states for an async request) — and nearly every coursework bug around "data is undefined" comes from misunderstanding when a promise's value is available.`,
    analogy: `Ordering at a busy café:

- You order and get a **buzzer** (the Promise). The buzzer is **pending**.
- You don't stand at the counter blocking everyone — you sit down and keep chatting (the rest of your code runs).
- The buzzer eventually goes off: either your coffee is ready (**fulfilled** with a value) or they've run out of milk (**rejected** with a reason). Once it has gone off it never changes again (**settled**).
- \`then\` = "when the buzzer goes off with coffee, do this"; \`catch\` = "if they ran out, do this"; \`finally\` = "either way, give the buzzer back".
- \`Promise.all\` = waiting for a group order: you only collect when **every** drink is ready — but if **any one** fails, the whole group order is cancelled immediately.`,
    explain: {
      beginner: `A **Promise** represents an operation that hasn't finished yet. It is always in one of three states (Week 03, slide 9):

- **pending** — still working;
- **fulfilled** — finished successfully with a **value**;
- **rejected** — failed with a **reason** (usually an \`Error\`).

Once fulfilled or rejected it is **settled** and never changes again.

The module's \`promiseJS.html\` creates one by hand:

\`\`\`js
const myPromise = new Promise((resolve, reject) => {
  setTimeout(() => resolve("The promise was resolved successfully!"), 2000);
});
myPromise.then(result => console.log(result)).catch(error => console.log(error));
console.log("Promise is pending...");   // printed FIRST
\`\`\`

"Promise is pending..." prints first because the \`then\` callback only runs after the 2-second timer resolves the promise.

**async/await** (Week 03, slide 10) lets you write the same thing top-to-bottom:

\`\`\`js
async function getEvents() {
  const response = await fetch(url);      // wait for the HTTP response
  const data = await response.json();     // wait for the body to be parsed
  return data;
}
\`\`\`

\`await\` pauses **only this function** until the promise settles; the rest of the page keeps working. An \`async\` function always returns a promise. Wrap awaits in \`try/catch\` to handle failures, and remember \`fetch\` only rejects on network failure — check \`response.ok\` for 404/500 (slide 12).`,
      developer: `**Chaining**: \`then\` returns a **new** promise resolved with whatever its callback returns (if you return a promise, the chain waits for it). An error thrown anywhere — or a rejected promise returned — skips forward to the next \`catch\`. \`finally\` runs either way and passes the result through.

\`\`\`js
setLoading(true);
getEvents()
  .then(events => setEvents(events))
  .catch(err => setError(err.message))
  .finally(() => setLoading(false));
\`\`\`

**async/await equivalent** with error propagation:

\`\`\`js
async function getEvents() {
  const res = await fetch(\`\${API}/events\`);
  if (!res.ok) throw new Error(\`Failed to fetch events: \${res.status}\`);
  return res.json();                     // a rejection here propagates to the caller
}
try { setEvents(await getEvents()); }
catch (err) { setError(err instanceof Error ? err.message : "Unknown error"); }
finally { setLoading(false); }
\`\`\`

**Combinators**:
| | Resolves when | Rejects when |
|---|---|---|
| \`Promise.all\` | **all** fulfil → array of values (input order) | **first** rejection (fail-fast) |
| \`Promise.allSettled\` | all settle → \`{status, value/reason}[]\` | never |
| \`Promise.race\` | first to **settle** (either way) | first to settle is a rejection |
| \`Promise.any\` | first to **fulfil** | all reject → \`AggregateError\` |

**Sequential vs concurrent**: \`const a = await getEvents(); const b = await getCategories();\` waits for A *before even starting* B. If they're independent, start both then wait: \`const [a, b] = await Promise.all([getEvents(), getCategories()]);\` — total time ≈ the slower one, not the sum.

In React, \`useEffect\` callbacks can't be \`async\` (Week 03 slide 25) — define an async function inside the effect and call it.`,
      deep: `**Promise.all is fail-fast but not cancel-fast.** When one input rejects, \`Promise.all\` rejects immediately with that reason, but the other operations **keep running** — promises are not cancellable. Their later results (or rejections) are ignored. To actually stop the other HTTP requests, pass a shared \`AbortController.signal\` to each \`fetch\` and call \`abort()\` in the catch. Mock A7's option A ("execute multiple asynchronous operations and wait for all of them to settle successfully") is the intended answer: \`all\` waits for every operation to *fulfil* and gives an array of results — strictly, if you need to wait for all to *settle* regardless of failures, that is \`allSettled\`.

**Unhandled rejections.** A rejected promise with no handler triggers an \`unhandledrejection\` event (console error; in Node it can crash the process). Every chain needs a terminal \`catch\` or an awaiting \`try\`.

**\`return\` vs \`return await\` inside try.** In \`try { return fetchJson(); } catch {}\` the promise is returned *unawaited*, so its rejection escapes the local catch. \`return await fetchJson();\` keeps it inside the try.

**Async functions and timing.** An \`async\` function runs synchronously until its first \`await\`; then it returns a pending promise to the caller. The code after \`await\` resumes as a **microtask** once the awaited promise settles (see *Event loop*). \`then\` callbacks are always asynchronous, even on an already-resolved promise.

**\`async\` inside array methods.** \`items.forEach(async i => await save(i))\` fires all saves and does not wait for any; \`map(async ...)\` returns an array of promises — wrap it in \`Promise.all\` for concurrency, or use \`for...of\` with \`await\` when order/rate-limiting matters.

**Thenables.** \`await\` and \`Promise.resolve\` adopt any object with a \`then\` method — how libraries interoperate.`,
    },
    mechanism: `\`\`\`text
                    resolve(value)
   ┌─────────┐  ─────────────────▶ ┌─────────────┐ ──▶ .then(onFulfilled) callbacks queued
   │ PENDING │                     │  FULFILLED  │
   └─────────┘  ─────────────────▶ ├─────────────┤ ──▶ .catch(onRejected) callbacks queued
                 reject(reason)    │  REJECTED   │
                 or throw          └─────────────┘     .finally(...) runs for both
                                    (settled: never changes again)

 SEQUENTIAL                          CONCURRENT (Promise.all)
 t=0   start events ─┐               t=0  start events ───┐
 t=300 events done ◀─┘               t=0  start categories ─┐│
 t=300 start categories ─┐           t=200 categories done ◀┘│
 t=500 categories done  ◀┘           t=300 events done  ◀────┘
 total ≈ 500 ms                      total ≈ 300 ms (the slowest)

 Promise.all([A, B, C])
   A fulfils ✓   B REJECTS ✗ ──▶ all() rejects NOW with B's reason
   C still running… its result is ignored (not cancelled!)
\`\`\``,
    simpleExample: {
      title: "From promiseJS.html to async/await",
      language: "js",
      code: `function wait(ms, value, fail = false) {
  return new Promise((resolve, reject) => {
    setTimeout(() => (fail ? reject(new Error(value)) : resolve(value)), ms);
  });
}

// then / catch / finally
wait(1000, "The promise was resolved successfully!")
  .then((result) => console.log(result))
  .catch((error) => console.log(error.message))
  .finally(() => console.log("done (then-chain)"));
console.log("Promise is pending...");

// async / await with try / catch / finally
async function run() {
  try {
    const a = await wait(500, "first");
    console.log(a);
    await wait(200, "boom", true);   // rejects → jumps to catch
    console.log("never printed");
  } catch (err) {
    console.log("caught:", err.message);
  } finally {
    console.log("done (async)");
  }
}
run();

// Output order:
// Promise is pending...
// first                       (t ≈ 500 ms)
// caught: boom                (t ≈ 700 ms)
// done (async)
// The promise was resolved successfully!   (t ≈ 1000 ms)
// done (then-chain)`,
      walkthrough: [
        { lines: "1-5", text: "A helper that wraps `setTimeout` in a promise which fulfils with `value` or rejects with an Error after `ms`." },
        { lines: "8-12", text: "`then` handles success, `catch` failure, `finally` both. The synchronous `console.log` runs first because promise callbacks always run later." },
        { lines: "15-26", text: "`await` pauses only `run`. After 500 ms `first` prints; the next await rejects after a further 200 ms, so control jumps to `catch`, then `finally`." },
        { lines: "29-35", text: "Timeline: sync log at 0 ms; run's results at 500/700 ms; the 1000 ms timer from the then-chain finishes last." },
      ],
    },
    realExample: {
      title: "CampusEvents: concurrent loading of events + categories with proper error handling",
      language: "ts",
      code: `const API = "http://localhost:5229/api";

interface CampusEvent { id: number; title: string; categoryId: number }
interface Category { id: number; name: string }

async function getJson<T>(path: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(\`\${API}\${path}\`, { signal });
  if (!res.ok) {
    throw new Error(\`GET \${path} failed: \${res.status}\`);
  }
  return (await res.json()) as T; // shape is NOT validated — see ts-typed-api-data
}

export async function loadEventsPage(signal?: AbortSignal) {
  // ❌ sequential: categories don't start until events finish
  // const events = await getJson<CampusEvent[]>("/events", signal);
  // const categories = await getJson<Category[]>("/categories", signal);

  // ✅ concurrent: both requests start immediately
  const [events, categories] = await Promise.all([
    getJson<CampusEvent[]>("/events", signal),
    getJson<Category[]>("/categories", signal),
  ]);
  return { events, categories };
}

export async function loadDashboardWidgets() {
  // Independent widgets: one failing should not blank the whole dashboard
  const results = await Promise.allSettled([
    getJson<CampusEvent[]>("/events"),
    getJson<unknown[]>("/bookings/my-bookings"),
  ]);
  return results.map((r) => (r.status === "fulfilled" ? r.value : []));
}`,
      walkthrough: [
        { lines: "6-12", text: "A generic helper: await the Response, check `res.ok` (fetch does not reject on 404/500 — Week 03 slide 12), then await the JSON body." },
        { lines: "15-17", text: "Two `await`s in a row run one after the other — total time is the sum of both." },
        { lines: "20-23", text: "`Promise.all` starts both requests at once and resolves with values in input order. If either rejects, the whole call rejects immediately (fail-fast) — appropriate here because the page needs both." },
        { lines: "27-33", text: "`allSettled` never rejects; each result says `fulfilled` or `rejected`, so a failing bookings request (e.g. 401) doesn't break the events widget." },
      ],
    },
    mistakes: [
      {
        mistake: "Forgetting `await` (`const events = getEvents();`) and then calling `events.map` on a Promise.",
        fix: "`await` the call inside an async function (or use `.then`). Hovering in TypeScript shows `Promise<Event[]>`, a strong hint.",
      },
      {
        mistake: "Assuming `fetch` rejects for 404/500 responses.",
        fix: "`fetch` only rejects on network failure/abort; check `response.ok` and `throw` yourself.",
      },
      {
        mistake: "Awaiting independent requests one after another.",
        fix: "Start them together with `Promise.all([...])` (or `allSettled` if partial failure is acceptable).",
      },
      {
        mistake: "Believing `Promise.all` waits for every promise even if one fails, or that it cancels the others.",
        fix: "It rejects on the FIRST rejection; the others keep running unless you abort them with an AbortController.",
      },
      {
        mistake: "Making the `useEffect` callback itself `async`.",
        fix: "Effects must return nothing or a cleanup function. Define `async function load() {...}` inside the effect and call it.",
      },
      {
        mistake: "Using `forEach(async ...)` and expecting the loop to wait.",
        fix: "Use `for...of` with `await` (sequential) or `await Promise.all(items.map(async ...))` (concurrent).",
      },
    ],
    debug: {
      prompt: "`showUpcoming()` crashes with `TypeError: events.filter is not a function`. Fix it so it logs the number of upcoming events and handles failures.",
      language: "js",
      buggyCode: `async function getEvents() {
  const res = await fetch("http://localhost:5229/api/events");
  return res.json();
}

async function showUpcoming() {
  const events = getEvents();
  const upcoming = events.filter((e) => new Date(e.startDate) > new Date());
  console.log(upcoming.length + " upcoming events");
}

showUpcoming();`,
      hint: "What does an `async` function return when you call it without `await`? Also: what happens on a 500 response?",
      fixedCode: `async function getEvents() {
  const res = await fetch("http://localhost:5229/api/events");
  if (!res.ok) throw new Error("Failed to fetch events: " + res.status);
  return res.json();
}

async function showUpcoming() {
  try {
    const events = await getEvents();
    const upcoming = events.filter((e) => new Date(e.startDate) > new Date());
    console.log(upcoming.length + " upcoming events");
  } catch (err) {
    console.error("Could not load events:", err.message);
  }
}

showUpcoming();`,
      explanation: "Calling an async function always returns a Promise immediately. Without `await`, `events` is a pending Promise, which has no `filter` method. Adding `await` gives the parsed array. The `res.ok` check turns HTTP errors into rejections, and `try/catch` handles both network and HTTP failures instead of leaving an unhandled rejection.",
    },
    challenge: {
      prompt: "Write `loadEventDetails(id)` that fetches `/events/{id}` and `/reviews/event/{id}` **concurrently**, returns `{ event, reviews }`, throws a helpful error if either response is not ok, and always logs `\"finished\"` at the end.",
      starterCode: `const API = "http://localhost:5229/api";

async function loadEventDetails(id) {
  // your code
}

loadEventDetails(1)
  .then(({ event, reviews }) => console.log(event.title, reviews.length))
  .catch((err) => console.error(err.message));`,
      language: "js",
      hints: [
        "Write a small `getJson(path)` helper that checks `res.ok`.",
        "`const [event, reviews] = await Promise.all([...])`.",
        "Use `try { ... } finally { console.log(\"finished\") }` — no catch needed if the caller handles errors.",
      ],
      solution: `const API = "http://localhost:5229/api";

async function getJson(path) {
  const res = await fetch(API + path);
  if (!res.ok) throw new Error("GET " + path + " failed: " + res.status);
  return res.json();
}

async function loadEventDetails(id) {
  try {
    const [event, reviews] = await Promise.all([
      getJson("/events/" + id),
      getJson("/reviews/event/" + id),
    ]);
    return { event, reviews };
  } finally {
    console.log("finished");
  }
}`,
      explanation: "Both requests start at once, so total time ≈ the slower one. If either rejects (network error or non-ok status), `Promise.all` rejects immediately and the error propagates to the caller's `.catch`. `finally` runs in both cases without swallowing the error.",
    },
    examQuestions: [
      {
        question: "**(Mock A7)** What is the main purpose of `Promise.all()` in JavaScript?\n\nA. To execute multiple asynchronous operations and wait for all of them to settle successfully\nB. To cancel every pending request\nC. To convert JavaScript objects into TypeScript interfaces\nD. To execute asynchronous operations one after another automatically",
        answer: "**A.** `Promise.all` runs operations concurrently and resolves with an array of all results once they have all fulfilled. Note: it **rejects as soon as any one rejects** (fail-fast) and does not cancel the others. It does not run them sequentially (D) or cancel them (B).",
        marks: 1,
      },
      {
        question: "**(Mock D2a)** Explain why an asynchronous operation is needed when communicating with an external API.",
        answer: "Network requests take an unpredictable amount of time. JavaScript in the browser runs on a single main thread; a synchronous (blocking) request would freeze the UI — no rendering, clicks or scrolling — until the response arrived. Asynchronous requests (fetch returns a Promise) let the app keep responding, show a loading state, and process the data (or error) when it arrives.",
        marks: 2,
      },
      {
        question: "Name the three states of a Promise and state which of them are 'settled'.",
        answer: "Pending, fulfilled, rejected. Fulfilled and rejected are settled; a settled promise never changes state again.",
        marks: 2,
      },
      {
        question: "What is printed, in order?\n\n```js\nconsole.log(\"A\");\nfetchData().then(() => console.log(\"B\"));\nconsole.log(\"C\");\n```\n(assume `fetchData` returns a promise that fulfils later)",
        answer: "`A`, `C`, `B`. The `then` callback runs only after the promise fulfils and the current synchronous code has finished.",
        marks: 1,
      },
      {
        question: "Rewrite `getEvents().then(e => setEvents(e)).catch(err => setError(err.message));` using async/await.",
        answer: "```js\ntry {\n  const e = await getEvents();\n  setEvents(e);\n} catch (err) {\n  setError(err.message);\n}\n```\n(inside an async function, e.g. one defined within `useEffect`).",
        marks: 2,
      },
    ],
    revision: [
      "Promise = eventual result; states pending → fulfilled (value) | rejected (reason); settled never changes.",
      "`then` returns a new promise; throw/reject skips to the next `catch`; `finally` runs either way.",
      "`async` functions always return a promise; `await` pauses only that function.",
      "Use try/catch/finally around awaits; `return await` inside try if you want local catch.",
      "`fetch` rejects only on network failure — check `response.ok` (Week 03 slide 12).",
      "`Promise.all`: concurrent, ordered results, REJECTS on FIRST rejection (no cancellation). `allSettled`: never rejects. `race`: first to settle. `any`: first to fulfil.",
      "Independent awaits in a row are sequential — use `Promise.all` to run them concurrently.",
      "`useEffect` callbacks can't be async — define and call an inner async function.",
    ],
    visualizers: ["promise-lifecycle"],
  },

  /* ================================================================ */
  /* 9. Event loop                                                      */
  /* ================================================================ */
  {
    id: "js-event-loop",
    moduleId: "m03-javascript",
    title: "The Event Loop: Call Stack, Microtasks, Tasks and Rendering",
    summary:
      "How single-threaded JavaScript juggles timers, promises and clicks: run the stack, drain ALL microtasks, maybe render, then take ONE task — and how to predict output order exactly.",
    priority: "P1",
    minutes: 35,
    objectives: [
      "Describe the roles of the call stack, Web APIs, the task queue and the microtask queue",
      "Predict console output for puzzles mixing sync code, setTimeout, promises and await",
      "Explain why `await` continuations run as microtasks",
      "Explain why long synchronous work freezes the UI and how to avoid it",
    ],
    prerequisites: ["js-promises-async"],
    sources: [
      W03("Slide 8 (Synchronous vs Asynchronous: start request → continue working → API responds → process response)"),
      EXAMPLES("Examples/Advanced/promiseJS.html ('Promise is pending...' logs before the resolved message)"),
      MDN("JavaScript execution model", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Execution_model"),
      MDN("Using microtasks (queueMicrotask guide)", "https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide"),
    ],
    why: `JavaScript in the browser runs your code on **one main thread** — the same thread that handles clicks and paints the page. Yet \`fetch\` doesn't freeze the page and timers fire later. The **event loop** is the scheduler that makes this work.

You need it to: predict output-order questions (a favourite exam/interview format), understand why \`setTimeout(fn, 0)\` is not "immediately", why a \`then\` callback runs before a timer, why a heavy loop makes "Loading..." never appear, and why React state updates and promise callbacks happen "after" the line that triggered them.`,
    analogy: `A **single chef** (the main thread) in a restaurant kitchen:

- The **call stack** is the dish the chef is cooking *right now*. The chef never stops halfway through a dish.
- **Web APIs** are the kitchen appliances — oven timers, delivery drivers (network). The chef hands work to them and carries on.
- When an appliance finishes, it puts a ticket on the **task queue** (the main order rail).
- **Microtasks** are sticky notes the chef wrote *to themselves* ("after this dish, plate the sauce"). The chef always clears **every** sticky note — including new ones written while clearing — **before** taking the next order ticket.
- Between orders, the waiter may take the plates out to the dining room (**rendering**). If the chef spends 5 minutes on one dish, nobody gets served and the dining room looks frozen.`,
    explain: {
      beginner: `JavaScript can only do **one thing at a time**. When you call \`fetch\` or \`setTimeout\`, JavaScript hands the waiting part to the **browser** and immediately carries on with the next line. When the waiting is over, the browser puts your callback in a **queue**; JavaScript picks it up only when it has finished everything it is currently doing.

There are two queues that matter:

1. **Microtask queue** — promise callbacks (\`then\`, \`catch\`, \`finally\`, code after \`await\`) and \`queueMicrotask\`.
2. **Task queue** (macrotasks) — \`setTimeout\`/\`setInterval\` callbacks, user events like clicks, network/message events.

The rule: **finish the current code → run *all* microtasks → (maybe update the screen) → run *one* task → repeat.**

\`\`\`js
console.log("1");
setTimeout(() => console.log("2"), 0);
Promise.resolve().then(() => console.log("3"));
console.log("4");
// 1, 4, 3, 2
\`\`\`

"1" and "4" are ordinary code, so they run first. "3" is a microtask, so it runs as soon as the current script finishes. "2" is a task, so it waits until all microtasks are done — even with a 0 ms delay.

That is also why \`promiseJS.html\` prints "Promise is pending..." before the resolved message.`,
      developer: `**One loop iteration (simplified HTML model):**
1. Take the oldest runnable **task** (a script, a timer callback, an event handler) and run it to completion on the call stack.
2. **Drain the microtask queue**: run microtasks until the queue is empty — microtasks queued *during* this step run in the same drain.
3. If it's time for a frame (~every 16.7 ms at 60 Hz) and something changed: run \`requestAnimationFrame\` callbacks, recalc style, layout, **paint**.
4. Repeat.

What creates what:
| Source | Queue |
|---|---|
| \`promise.then/catch/finally\`, \`await\` continuation, \`queueMicrotask\`, \`MutationObserver\` | microtask |
| \`setTimeout\`, \`setInterval\`, DOM events, \`MessageChannel\`, network/IndexedDB callbacks | task |
| \`requestAnimationFrame\` | before the next paint |

**await** — \`await x\` evaluates \`x\`, suspends the async function, and schedules the rest of the function as a microtask once \`x\` settles. Code *before* the first \`await\` runs synchronously when the function is called.

\`\`\`js
async function run() { console.log("A"); await null; console.log("B"); }
console.log("start");
run();
setTimeout(() => console.log("timeout"), 0);
Promise.resolve().then(() => console.log("then"));
console.log("end");
// start, A, end, B, then, timeout
\`\`\`

\`B\` was queued (by \`await null\`) before \`then\` was queued, so it runs first; both beat the timeout.

\`setTimeout(fn, 0)\` means "as a new task, no earlier than ~0 ms" — browsers clamp nested timers to ≥4 ms and throttle background tabs.`,
      deep: `**Why microtasks exist.** Promise reactions must run asynchronously (so \`then\` is always consistent) but as soon as possible (before the browser does other work), so the spec gives them their own queue drained at every "microtask checkpoint" — after each task, and also after each callback when the stack empties (e.g. between two event listeners for the same click dispatched by the user).

**Starvation.** Because the drain runs until empty, a microtask that keeps scheduling microtasks (\`function loop() { queueMicrotask(loop) }\`) blocks rendering and tasks forever — the page freezes just like a \`while(true)\`. A task that reschedules itself with \`setTimeout\` does *not* starve the page.

**Await tick counts.** \`await somePromise\` on a native promise takes one microtask hop to resume (since ES2019's await optimisation). Returning a promise from a \`then\` callback, or from an async function, costs extra hops (thenable resolution job), which is why some puzzles involving \`return promise\` inside \`then\` look "one step late". Don't write code that depends on these exact counts.

**Rendering is not guaranteed between tasks.** Browsers render when a frame is due; two quick tasks may run back-to-back with no paint between. To be sure a status message paints before heavy work, wait for a frame: \`requestAnimationFrame(() => setTimeout(work, 0))\` (rAF runs before the paint, the timeout task runs after it). Better: move the heavy work to a **Web Worker**, chunk it, or use \`scheduler.yield()\` where supported.

**Node** has a similar loop with phases (timers, poll, check) plus \`process.nextTick\`, which runs before promise microtasks. Browser rules are what the module's exam context assumes.

**React 18+** batches state updates inside promises/timeouts too (automatic batching), so several \`setState\` calls in one microtask/task cause one render.`,
    },
    mechanism: `\`\`\`text
        ┌──────────────── CALL STACK ────────────────┐
        │ run current task to completion              │
        └───────┬───────────────────────▲─────────────┘
                │ setTimeout / fetch /   │
                │ addEventListener       │ next task
                ▼                        │
        ┌───────────────┐        ┌──────┴────────────────┐
        │   WEB APIs    │──────▶ │  TASK QUEUE (FIFO)     │  timers, clicks,
        │ timers, net,  │ done   │  [t1] [t2] [click] ... │  network events
        │ DOM events    │        └────────────────────────┘
        └───────────────┘
                 promise settles / await / queueMicrotask
                                 ▼
                         ┌────────────────────────┐
                         │ MICROTASK QUEUE        │  drained COMPLETELY
                         │ [m1] [m2] [m3] ...     │  after every task
                         └────────────────────────┘

  LOOP:  task ──▶ drain ALL microtasks ──▶ (render if frame due:
                                             rAF → style → layout → paint)
          ▲                                                   │
          └───────────────────── next task ◀──────────────────┘
\`\`\`

Ordering rule for puzzles: **synchronous code → every microtask (including ones added meanwhile) → one task → its microtasks → next task …**`,
    simpleExample: {
      title: "Ordering puzzle with nested microtasks and tasks",
      language: "js",
      code: `console.log("script start");

setTimeout(() => {
  console.log("t1");
  Promise.resolve().then(() => console.log("m-inside-t1"));
}, 0);

setTimeout(() => console.log("t2"), 0);

Promise.resolve().then(() => {
  console.log("m1");
  Promise.resolve().then(() => console.log("m2"));
});

console.log("script end");

// Output:
// script start
// script end
// m1
// m2
// t1
// m-inside-t1
// t2`,
      walkthrough: [
        { lines: "1", text: "Synchronous: printed immediately." },
        { lines: "3-6", text: "Timer callback t1 is handed to the browser; when 0 ms passes it is queued as a TASK." },
        { lines: "8", text: "t2 is queued as a task after t1." },
        { lines: "10-13", text: "The promise is already resolved, so the `then` callback is queued as a MICROTASK right away." },
        { lines: "15", text: "Synchronous: printed. The script (itself a task) is now finished." },
        { lines: "17-24", text: "Microtask drain: m1 runs and queues m2, which runs in the same drain. Then task t1 runs; it queues a microtask that is drained before the next task, so m-inside-t1 prints before t2." },
      ],
    },
    realExample: {
      title: "await continuations vs timers in a data-loading click handler",
      language: "js",
      code: `async function loadEvents() {
  console.log("2: loadEvents starts (sync part)");
  const events = await Promise.resolve([{ id: 1 }, { id: 2 }]);
  console.log("4: after await —", events.length, "events");
  return events;
}

console.log("1: click handler starts");

setTimeout(() => console.log("7: timeout task"), 0);

loadEvents().then((list) => console.log("6: then on result —", list.length));

queueMicrotask(() => console.log("5: queueMicrotask callback"));

console.log("3: click handler ends");

// Output (labels are numbered in the order they print):
// 1: click handler starts
// 2: loadEvents starts (sync part)
// 3: click handler ends
// 4: after await — 2 events
// 5: queueMicrotask callback
// 6: then on result — 2
// 7: timeout task`,
      walkthrough: [
        { lines: "8", text: "Synchronous code runs first, in order: prints 1." },
        { lines: "10", text: "The timeout callback is handed to the browser and becomes a TASK — it can only run after every microtask." },
        { lines: "12", text: "Calling `loadEvents()` runs its body synchronously up to the first `await` (prints 2). Awaiting an already-resolved promise queues the continuation as microtask M1. The function returns a pending promise P; `.then` registers a reaction on P (nothing queued yet — P is not fulfilled)." },
        { lines: "14", text: "`queueMicrotask` queues M2, behind M1. Queue: [M1, M2]." },
        { lines: "16", text: "Last synchronous line prints 3. The microtask drain begins." },
        { lines: "18-25", text: "M1 resumes `loadEvents` (prints 4) and returns, fulfilling P, which queues the `.then` reaction M3 → queue [M2, M3]. M2 prints 5, M3 prints 6. Only now, with the microtask queue empty, does the timer task print 7." },
      ],
    },
    mistakes: [
      {
        mistake: "Thinking `setTimeout(fn, 0)` runs `fn` immediately or before promise callbacks.",
        fix: "It queues a TASK; all synchronous code and all microtasks (promise callbacks, await continuations) run first.",
      },
      {
        mistake: "Thinking `await` blocks the whole program.",
        fix: "It suspends only the current async function; the caller continues, and the rest of the function resumes later as a microtask.",
      },
      {
        mistake: "Assuming code before the first `await` in an async function runs later.",
        fix: "An async function runs synchronously until its first `await`.",
      },
      {
        mistake: "Running a long synchronous loop in a click handler and expecting a 'Loading...' message to appear first.",
        fix: "The browser can't paint until the task (and its microtasks) finish. Yield (rAF + setTimeout), chunk the work, or use a Web Worker.",
      },
      {
        mistake: "Believing the task queue is checked between microtasks.",
        fix: "The microtask queue is drained completely — even newly added microtasks — before the next task.",
      },
    ],
    debug: {
      prompt: "When the user clicks **Calculate**, the status should show \"Calculating...\" while a ~3 s computation runs. Users report the text jumps straight to \"Done\" and the page is frozen meanwhile. Explain and fix (without a Web Worker).",
      language: "js",
      buggyCode: `const status = document.querySelector("#status");
const button = document.querySelector("#calc");

function heavyCalculation() {
  let total = 0;
  for (let i = 0; i < 3e9; i++) total += i % 7;
  return total;
}

button.addEventListener("click", () => {
  status.textContent = "Calculating...";
  const result = heavyCalculation();
  status.textContent = "Done: " + result;
});`,
      hint: "When does the browser get a chance to paint the DOM change? Can it paint in the middle of a task?",
      fixedCode: `const status = document.querySelector("#status");
const button = document.querySelector("#calc");

function heavyCalculation() {
  let total = 0;
  for (let i = 0; i < 3e9; i++) total += i % 7;
  return total;
}

const nextPaint = () =>
  new Promise((resolve) => requestAnimationFrame(() => setTimeout(resolve, 0)));

button.addEventListener("click", async () => {
  status.textContent = "Calculating...";
  button.disabled = true;
  await nextPaint();               // let the browser render the message first
  const result = heavyCalculation(); // still blocks, but the user sees feedback
  status.textContent = "Done: " + result;
  button.disabled = false;
});`,
      explanation: "The click handler is one task. Rendering only happens between tasks, so the DOM change to \"Calculating...\" is overwritten by \"Done\" before the browser ever paints. Waiting for `requestAnimationFrame` (runs just before the next paint) and then a `setTimeout` (a new task after that paint) guarantees the message is painted before the heavy work starts. The page is still unresponsive during the calculation — the real fix for that is chunking the work or moving it to a Web Worker.",
    },
    challenge: {
      prompt: "Predict the exact output order, then explain each step in terms of the call stack, microtask queue and task queue.",
      starterCode: `console.log("A");
setTimeout(() => console.log("B"), 0);
queueMicrotask(() => console.log("C"));
Promise.resolve()
  .then(() => console.log("D"))
  .then(() => console.log("E"));
(async () => {
  console.log("F");
  await undefined;
  console.log("G");
})();
console.log("H");`,
      language: "js",
      hints: [
        "First list all synchronous logs (remember the async IIFE runs synchronously until its await).",
        "Write down the microtask queue in the order items are added: C, then D, then G.",
        "When D runs, its `then` promise fulfils, which queues E at the END of the microtask queue.",
        "The timer callback B is a task: it runs after the microtask queue is empty.",
      ],
      solution: `// Output: A F H C D G E B
//
// Sync:      A, F (async IIFE body before await), H
// Microtask queue after sync: [C, D, G]
//   run C
//   run D  → its returned promise fulfils → queue E  → [G, E]
//   run G
//   run E
// Task queue: [B] → run B`,
      explanation: "Synchronous code first: A, then the async function runs until `await` (F), then H. Microtasks are queued in order C (queueMicrotask), D (`then` on an already-resolved promise), G (await continuation). E can only be queued once D's callback has finished, so it lands after G. The timer callback B is a task and runs only after the microtask queue is completely empty.",
    },
    examQuestions: [
      {
        question: "What is the output?\n\n```js\nconsole.log(\"1\");\nsetTimeout(() => console.log(\"2\"), 0);\nPromise.resolve().then(() => console.log(\"3\"));\nconsole.log(\"4\");\n```\n\nA. 1 2 3 4\nB. 1 4 2 3\nC. 1 4 3 2\nD. 1 3 4 2",
        answer: "**C. 1 4 3 2.** Synchronous logs first; the promise callback is a microtask (runs as soon as the script finishes); the timeout is a task (runs after all microtasks).",
        marks: 1,
      },
      {
        question: "True or False: `setTimeout(fn, 0)` guarantees that `fn` runs before any promise `.then` callbacks that were registered after it.",
        answer: "**False.** Timer callbacks are tasks; promise callbacks are microtasks, and all microtasks are drained before the next task runs.",
        marks: 1,
      },
      {
        question: "Explain what happens to the rest of an async function when it reaches `await`.",
        answer: "The function is suspended and immediately returns a pending promise to its caller, which continues running. When the awaited promise settles, the remainder of the function is scheduled as a microtask and resumes from that point (or throws at the await if the promise rejected).",
        marks: 2,
      },
      {
        question: "Why can a long-running synchronous loop make a web page unresponsive even though JavaScript supports asynchronous operations?",
        answer: "JavaScript runs on the single main thread, which also handles input and rendering. A synchronous loop occupies the call stack; the event loop can't process clicks (tasks) or paint until it finishes. Asynchrony only helps for work handed to the browser (timers, network), not CPU-bound code — that needs chunking or a Web Worker.",
        marks: 2,
      },
    ],
    revision: [
      "One main thread: call stack runs one task to completion — nothing interrupts it.",
      "Web APIs (timers, network, DOM events) do the waiting and queue callbacks.",
      "Microtasks: promise reactions, `await` continuations, `queueMicrotask`.",
      "Tasks: `setTimeout`/`setInterval`, events, network callbacks.",
      "Loop: task → drain ALL microtasks (incl. newly added) → maybe render → next task.",
      "Puzzle order: sync → microtasks → tasks. `setTimeout(…, 0)` is never 'immediate'.",
      "Async functions run synchronously until the first `await`.",
      "Long sync work blocks rendering and input — yield, chunk or use a Web Worker.",
    ],
    visualizers: ["event-loop"],
  },

  /* ================================================================ */
  /* 10. TypeScript basics & interfaces                                 */
  /* ================================================================ */
  {
    id: "ts-basics-interfaces",
    moduleId: "m04-typescript",
    title: "TypeScript Basics: Types, Inference, Interfaces and type Aliases",
    summary:
      "What TypeScript adds to JavaScript (and what it doesn't — types are erased), annotations vs inference, interfaces vs type aliases, optional/readonly properties, typed functions, typed state and props.",
    priority: "P0",
    examCritical: true,
    minutes: 40,
    objectives: [
      "Explain the difference between compile time and runtime and that types are erased",
      "Annotate variables, parameters and return types, and know when to rely on inference",
      "Write interfaces with optional (`?`) and `readonly` properties (mock C2: `Product`)",
      "Compare `interface` and `type` aliases (mock A3) and choose appropriately",
      "Type React state (`useState<Event[]>([])`) and component props",
    ],
    prerequisites: ["js-spread-rest-destructuring"],
    sources: [
      L02("Slides 38–42 (What Is TypeScript?, Why TypeScript?, Interfaces, TypeScript Functions, TypeScript + React State — useState<Event[]>([]))"),
      L02("Slide 11 (Props with TypeScript — interface EventCardProps { title: string; price: number })"),
      W03("Slides 14–15 (Event interface; EventCardProps uses only the fields the card needs)"),
      MOCK("A3 (keyword for a type alias → type), A8 (purpose of an interface), B2 (interfaces describe API objects — True), C2 (Product interface)"),
      TS_DOCS("Everyday Types", "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html"),
      TS_DOCS("Object Types", "https://www.typescriptlang.org/docs/handbook/2/objects.html"),
    ],
    why: `Lecture 02 (slide 39) lists the payoffs: **catch mistakes earlier, better editor support, easier refactoring, clearer component contracts, safer API data handling**. In a React app full of objects passed between components — events, bookings, users — a typo like \`event.titel\` or passing a string where a number is expected is caught as you type instead of as a blank card in production.

The exam checks the fundamentals directly: what an interface is for (A8), which keyword creates a type alias (A3), whether interfaces can describe API objects (B2), and writing the \`Product\` interface with an optional description (C2). You need to be able to write these without hesitation.`,
    analogy: `An **interface** is like the **spec sheet for a parcel locker**: "this slot accepts a box with an \`id\` (number), a \`name\` (string) and a \`price\` (number); a \`description\` label is optional". Anyone delivering (calling code) gets told off immediately if their box doesn't fit.

But the spec sheet is **only checked at the depot (compile time)**. Once the van leaves (the code runs in the browser), nobody looks at the sheet — the types have been **erased**. If a box arrives from outside the depot (an API response), TypeScript can't inspect it; you've only *promised* it fits.`,
    explain: {
      beginner: `**TypeScript is JavaScript with a static type system** (Lecture 02, slide 38). You add type information; the TypeScript compiler checks it and then produces ordinary JavaScript.

\`\`\`ts
let name: string = "Alex";
let age: number = 21;
let isAdmin: boolean = false;
\`\`\`

Often you don't need to write the type — TypeScript **infers** it: \`let age = 21\` is already a \`number\`.

An **interface** describes the **shape of an object** (slide 40, mock A8):

\`\`\`ts
interface Product {
  id: number;
  name: string;
  price: number;
  description?: string;   // ? = optional
}
\`\`\`

Now \`const p: Product = { id: 1, name: "Mug", price: 8 }\` is fine, but forgetting \`price\` or writing \`price: "8"\` is a compile error.

**Functions** declare parameter and return types (slide 41):

\`\`\`ts
function calculateTotal(price: number, tickets: number): number {
  return price * tickets;
}
\`\`\`

**React state** gets a type argument (slide 42): \`const [events, setEvents] = useState<Event[]>([]);\` — "events will be an array of Event objects". Without it, TypeScript would infer \`never[]\` from the empty array and refuse to store events in it.

**Props** are typed with an interface too (slide 11): \`function EventCard({ title, price }: EventCardProps)\`.`,
      developer: `**Annotate at boundaries, infer inside.** Annotate function parameters, exported function return types, props, and empty initial values (\`useState<Event[]>([])\`, \`useState<User | null>(null)\`). Let inference handle locals: \`const total = items.reduce((s, i) => s + i.price, 0)\` is already \`number\`.

**\`interface\` vs \`type\`** (mock A3: \`type\` defines an alias):
\`\`\`ts
interface Event { id: number; title: string }          // object shapes; can extend
interface AdminEvent extends Event { createdBy: string }
type EventId = number;                                  // alias for anything
type Status = "Pending" | "Confirmed" | "Cancelled";    // unions — type only
type WithCategory = Event & { categoryName: string };   // intersection
\`\`\`
Both describe object shapes equally well. Interfaces can be **extended** and **merged** (two declarations with the same name combine); \`type\` can name unions, primitives, tuples and mapped types. Common convention: \`interface\` for object/prop shapes, \`type\` for unions and compositions — be consistent.

**Optional vs nullable**: \`description?: string\` means the property may be **absent** (type \`string | undefined\`); \`imageUrl: string | null\` means it is **always present** but may be \`null\` — which is exactly how a C# \`string?\` arrives in JSON (Week 03 slide 14). Accessing an optional property forces you to handle \`undefined\`: \`p.description?.length ?? 0\`.

**\`readonly\`**: \`readonly id: number\` stops reassignment *in TypeScript code* — a compile-time guard only.

**Props**: \`interface EventCardProps { title: string; price: number; onBook?: (id: number) => void }\`. Don't pass the whole API object if the card needs three fields — Week 03 slide 15 makes the card's contract minimal and lets the page map \`Event\` → props.`,
      deep: `**Erasure.** \`tsc\` (or Vite's esbuild transform) strips type annotations, interfaces and type aliases entirely; nothing remains at runtime. Consequences: you can't \`if (x instanceof Product)\` an interface; \`as Product\` performs no check; JSON from an API is unchecked (see *Typed API data*). Vite does **not** type-check during dev — it only strips types — so run \`tsc --noEmit\` (the \`build\` script does) or rely on your editor.

**Structural typing.** TypeScript compares shapes, not names: any object with \`id: number; name: string; price: number\` *is* a \`Product\`, even if declared elsewhere. **Excess property checks** apply only to fresh object literals assigned directly: \`const p: Product = { id: 1, name: "x", price: 2, colour: "red" }\` errors, but the same object stored in a variable first and then assigned does not.

**Name collisions.** The lecture's \`interface Event\` shares its name with the DOM's global \`Event\` type. Declared inside a module (a file with \`import\`/\`export\`), your interface **shadows** the global one in that file — fine, but importing it where you also handle DOM events is confusing; many teams name it \`CampusEvent\` or \`EventDto\`. A *global* script file would instead **merge** with the DOM \`Event\` interface — a nasty surprise of declaration merging.

**strict mode** (this project uses TS strict) enables \`strictNullChecks\` (\`null\`/\`undefined\` are not assignable to \`string\`), \`noImplicitAny\` and more. Without \`strictNullChecks\` optional properties would silently allow crashes.

**Inference widening.** \`let status = "Pending"\` infers \`string\`; \`const status = "Pending"\` infers the literal \`"Pending"\`. \`as const\` freezes literals and makes arrays readonly tuples — useful for lookup tables.`,
    },
    mechanism: `\`\`\`text
  YOU WRITE (.ts / .tsx)            COMPILE TIME (tsc / editor)          RUNTIME (browser)
 ┌───────────────────────────┐     ┌─────────────────────────────┐     ┌───────────────────────┐
 │ interface Product {...}   │ ──▶ │ type-check: shapes, nulls,  │ ──▶ │ const p = {           │
 │ const p: Product = {...}  │     │ params, returns, props      │     │   id: 1, name: "Mug", │
 │ function total(           │     │   ✗ errors shown in editor  │     │   price: 8 };         │
 │   price: number): number  │     │ then ERASE all types        │     │ function total(price) │
 └───────────────────────────┘     └─────────────────────────────┘     └───────────────────────┘
                                                                         no interfaces, no checks
  API JSON ──────────────────────────────────────────────────────────────▶ arrives HERE, unchecked
\`\`\`

- Type errors exist only in the editor/compiler; the emitted JS is plain JavaScript.
- Anything entering at runtime (fetch, localStorage, user input) bypasses the checker — it needs runtime validation.`,
    simpleExample: {
      title: "Mock C2 Product interface + typed function",
      language: "ts",
      code: `interface Product {
  id: number;
  name: string;
  price: number;
  description?: string;
}

type ProductId = Product["id"]; // number — a type alias

function lineTotal(product: Product, quantity: number): number {
  return product.price * quantity;
}

const mug: Product = { id: 4, name: "Mug", price: 8 };       // ✓ description optional
const lamp: Product = { id: 3, name: "Lamp", price: 25, description: "LED" };

console.log(lineTotal(mug, 3));                     // 24
console.log(mug.description?.toUpperCase() ?? "No description");
const id: ProductId = lamp.id;
console.log(id);                                    // 3

// const bad: Product = { id: "5", name: "Pen", price: 1 };
//   ✗ Type 'string' is not assignable to type 'number'.
// lineTotal(mug);
//   ✗ Expected 2 arguments, but got 1.`,
      walkthrough: [
        { lines: "1-6", text: "The exact answer to mock C2. `description?` makes the property optional (type `string | undefined`)." },
        { lines: "8", text: "`type` creates an alias (mock A3). Indexed access `Product[\"id\"]` reuses the property's type." },
        { lines: "10-12", text: "Parameter types and an explicit return type (Lecture 02, slide 41)." },
        { lines: "14-15", text: "Both objects satisfy the interface — one without the optional property." },
        { lines: "18", text: "Because `description` may be undefined, strict TypeScript makes you handle it: `?.` + `??`." },
        { lines: "23-26", text: "These lines would fail to compile — caught before the code ever runs." },
      ],
    },
    realExample: {
      title: "Typed CampusEvents state and props (Lecture 02 slides 11 & 42, Week 03 slide 15)",
      language: "tsx",
      code: `import { useState } from "react";

export interface CampusEvent {
  readonly id: number;
  title: string;
  description: string;
  imageUrl: string | null;
  startDate: string;
  location: string;
  price: number;
  availableTickets: number;
}

interface EventCardProps {
  title: string;
  location: string;
  price: number;
  onSelect?: () => void;
}

function EventCard({ title, location, price, onSelect }: EventCardProps) {
  return (
    <article onClick={onSelect}>
      <h2>{title}</h2>
      <p>{location} · £{price.toFixed(2)}</p>
    </article>
  );
}

export function EventsPage({ initial }: { initial: CampusEvent[] }) {
  const [events] = useState<CampusEvent[]>(initial);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  return (
    <section>
      {selectedId !== null && <p>Selected event #{selectedId}</p>}
      {events.map((e) => (
        <EventCard
          key={e.id}
          title={e.title}
          location={e.location}
          price={e.price}
          onSelect={() => setSelectedId(e.id)}
        />
      ))}
    </section>
  );
}`,
      walkthrough: [
        { lines: "3-12", text: "The API shape. `readonly id` prevents accidental reassignment in TS; `imageUrl: string | null` mirrors C# `string?`. Named `CampusEvent` to avoid confusion with the DOM `Event` type." },
        { lines: "14-19", text: "The card's contract only lists what it needs (Week 03 slide 15); `onSelect?` is an optional callback prop." },
        { lines: "21", text: "Props destructured and typed in the parameter list (Lecture 02 slide 11)." },
        { lines: "31-32", text: "Type arguments on `useState`: an array of events, and a union with `null` for 'nothing selected yet'." },
        { lines: "38-44", text: "The page is the bridge: it maps each `CampusEvent` to just the props a card needs. A missing or mistyped prop is a compile error." },
      ],
    },
    mistakes: [
      {
        mistake: "Thinking TypeScript checks data at runtime (e.g. that an API really returned `Product[]`).",
        fix: "Types are erased at compile time. Validate untrusted runtime data (e.g. with Zod) — see the typed API data lesson.",
      },
      {
        mistake: "`useState([])` for a list of events → inferred as `never[]`, then `setEvents(data)` errors.",
        fix: "Provide the type argument: `useState<Event[]>([])`.",
      },
      {
        mistake: "Confusing optional (`description?: string`) with nullable (`imageUrl: string | null`).",
        fix: "`?` = property may be missing (undefined); `| null` = property present but may be null (C# `string?` in JSON).",
      },
      {
        mistake: "Answering that `interface` defines a type alias, or inventing keywords like `define`/`structure` (mock A3 distractors).",
        fix: "`type Name = ...` defines an alias; `interface Name { ... }` declares an object shape.",
      },
      {
        mistake: "Annotating everything, including obvious locals (`const n: number = 5`).",
        fix: "Annotate boundaries (params, returns of exported functions, props, empty initial state); let inference do the rest.",
      },
    ],
    debug: {
      prompt: "This component fails to compile under strict mode: `'product.description' is possibly 'undefined'` and `Argument of type 'string' is not assignable to parameter of type 'number'`. Fix both errors properly (no `any`, no `!`).",
      language: "tsx",
      buggyCode: `interface Product {
  id: number;
  name: string;
  price: number;
  description?: string;
}

function formatPrice(price: number): string {
  return "£" + price.toFixed(2);
}

export function ProductRow({ product, priceInput }: { product: Product; priceInput: string }) {
  const preview = product.description.slice(0, 40);
  return (
    <tr>
      <td>{product.name}</td>
      <td>{preview}</td>
      <td>{formatPrice(priceInput)}</td>
    </tr>
  );
}`,
      hint: "An optional property can be `undefined`. An `<input>` value is always a string — convert it explicitly.",
      fixedCode: `interface Product {
  id: number;
  name: string;
  price: number;
  description?: string;
}

function formatPrice(price: number): string {
  return "£" + price.toFixed(2);
}

export function ProductRow({ product, priceInput }: { product: Product; priceInput: string }) {
  const preview = product.description?.slice(0, 40) ?? "No description";
  const parsed = Number(priceInput);
  return (
    <tr>
      <td>{product.name}</td>
      <td>{preview}</td>
      <td>{Number.isFinite(parsed) ? formatPrice(parsed) : "Invalid price"}</td>
    </tr>
  );
}`,
      explanation: "Strict null checks make `description` `string | undefined`, so calling `.slice` on it directly could crash; `?.` plus `??` handles the missing case. `formatPrice` requires a number but `priceInput` is a string — TypeScript caught a real bug (`\"8\".toFixed` would throw at runtime). Converting with `Number()` and checking `Number.isFinite` handles bad input instead of silencing the compiler.",
    },
    challenge: {
      prompt: "Write an interface `BasketItem` (`product: Product`, `quantity: number`, readonly `addedAt: string`) and a typed function `basketTotal(items: BasketItem[]): number`. Also write `type Currency = \"GBP\" | \"EUR\"` and a function `formatMoney(amount: number, currency: Currency): string`.",
      starterCode: `interface Product {
  id: number;
  name: string;
  price: number;
  description?: string;
}

// your code here`,
      language: "ts",
      hints: [
        "`readonly addedAt: string;` inside the interface.",
        "Use `reduce` with initial value 0; TypeScript infers the accumulator as number.",
        "A union of string literals restricts `currency` to exactly those values.",
      ],
      solution: `interface Product {
  id: number;
  name: string;
  price: number;
  description?: string;
}

interface BasketItem {
  product: Product;
  quantity: number;
  readonly addedAt: string; // ISO date string
}

function basketTotal(items: BasketItem[]): number {
  return items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
}

type Currency = "GBP" | "EUR";

function formatMoney(amount: number, currency: Currency): string {
  const symbol = currency === "GBP" ? "£" : "€";
  return \`\${symbol}\${amount.toFixed(2)}\`;
}

const items: BasketItem[] = [
  { product: { id: 4, name: "Mug", price: 8 }, quantity: 2, addedAt: "2026-11-20T10:00:00Z" },
];
console.log(formatMoney(basketTotal(items), "GBP")); // £16.00`,
      explanation: "The interface nests another interface and marks `addedAt` readonly (a compile-time guard). `basketTotal`'s annotations make its contract explicit; the union type means `formatMoney(10, \"USD\")` fails to compile.",
    },
    examQuestions: [
      {
        question: "**(Mock A3)** In TypeScript, which keyword is used to define a custom type alias?\n\nA. `interfaceOnly`\nB. `type`\nC. `define`\nD. `structure`",
        answer: "**B. `type`** — e.g. `type Status = \"Pending\" | \"Confirmed\";`.",
        marks: 1,
      },
      {
        question: "**(Mock A8)** In TypeScript, what is the purpose of an interface?\n\nA. To define the expected structure of an object\nB. To create a CSS class\nC. To automatically send API requests\nD. To store application data permanently",
        answer: "**A.** An interface describes the shape (property names and types) of an object; it is checked at compile time and erased at runtime.",
        marks: 1,
      },
      {
        question: "**(Mock B2)** True or False: TypeScript interfaces can be used to describe the expected properties of objects received from an API.",
        answer: "**True.** E.g. `interface Event { id: number; title: string; ... }` (Week 03 slide 14). Note they describe the *expected* shape — they don't validate the data at runtime.",
        marks: 1,
      },
      {
        question: "**(Mock C2)** Write a TypeScript interface named `Product` containing: id (number), name (string), price (number), description (optional string).",
        answer: "```ts\ninterface Product {\n  id: number;\n  name: string;\n  price: number;\n  description?: string;\n}\n```\nThe `?` marks `description` as optional.",
        marks: 3,
      },
      {
        question: "Why does `const [events, setEvents] = useState<Event[]>([]);` include `<Event[]>`?",
        answer: "From an empty array TypeScript can't infer the element type (it would infer `never[]`). The type argument declares that `events` is an array of `Event` objects, so `setEvents(data)` type-checks and `events[0].title` is known to be a string (Lecture 02 slide 42).",
        marks: 2,
      },
    ],
    revision: [
      "TypeScript = JavaScript + static types; checked at compile time, ERASED at runtime.",
      "Annotate params, returns, props and empty initial state; let inference handle the rest.",
      "Mock C2: `interface Product { id: number; name: string; price: number; description?: string; }`.",
      "Mock A3: `type` defines an alias; A8: interface = expected structure of an object.",
      "`?` optional (may be missing/undefined) vs `| null` (present but null — C# `string?`).",
      "`readonly` is a compile-time-only guard.",
      "Interfaces can extend/merge; `type` can express unions, intersections, tuples.",
      "`useState<Event[]>([])` — type argument for empty initial values.",
    ],
    visualizers: ["ts-compile"],
  },

  /* ================================================================ */
  /* 11. Unions & narrowing                                             */
  /* ================================================================ */
  {
    id: "ts-unions-narrowing",
    moduleId: "m04-typescript",
    title: "Union Types, Literal Types and Narrowing",
    summary:
      "`string | number` vs `string & number`, literal types, discriminated unions for request state, narrowing with typeof/in/equality, custom type guards and `never` exhaustiveness checks.",
    priority: "P0",
    examCritical: true,
    minutes: 40,
    objectives: [
      "Write union types and distinguish them from intersection types (mock A14, B13)",
      "Use literal types to restrict values to a fixed set",
      "Model loading/error/success request state as a discriminated union",
      "Narrow unions with `typeof`, `in`, equality and custom type guards",
      "Use `never` to make a switch exhaustive",
    ],
    prerequisites: ["ts-basics-interfaces"],
    sources: [
      MOCK("A14 (string | number), B13 (a union type allows a value to belong to one of several types — True)"),
      W03("Slide 14 (imageUrl: string | null), Slide 22 (The Four UI States: loading, success, error, empty)"),
      TS_DOCS("Narrowing", "https://www.typescriptlang.org/docs/handbook/2/narrowing.html"),
      TS_DOCS("Everyday Types — Union Types", "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html"),
    ],
    why: `Real data is rarely one fixed type. An id might arrive as a \`string\` from the URL and a \`number\` from the API; \`imageUrl\` is \`string | null\`; a request is *either* loading, failed or succeeded (Week 03 slide 22's four UI states). **Union types** describe "one of these", and **narrowing** is how TypeScript lets you safely use the value once you've checked which one it is.

The mock tests unions directly (A14, B13), and discriminated unions are the professional way to model API state — they make impossible states (\`loading: true\` *and* \`error\` *and* \`data\` at once) unrepresentable.`,
    analogy: `A **union** \`string | number\` is a box labelled "contains a string OR a number". Before you open it you may only do things that are safe for **both** (like printing it). Once you **check** what's inside (\`typeof x === "string"\`), you know which one you have and can use its specific tools — that check is **narrowing**.

An **intersection** \`A & B\` is the opposite: a box that must satisfy **both** labels at once. For object types that means "has all the properties of A *and* B"; for \`string & number\` nothing can be both, so the type is \`never\` — an impossible box.

A **discriminated union** is a box with a **status sticker** on top (\`status: "loading" | "error" | "success"\`): read the sticker and you know exactly what else is inside.`,
    explain: {
      beginner: `A **union type** says a value can be one of several types:

\`\`\`ts
let id: string | number;
id = 42;        // ✓
id = "42";      // ✓
id = true;      // ✗ boolean is not allowed
\`\`\`

This is mock A14's answer: \`string | number\` (not \`&\`, \`+\` or \`/\`). And B13 is **True**: "a union type allows a value to belong to one of several specified types".

**Literal types** restrict a value to exact options:

\`\`\`ts
type BookingStatus = "Pending" | "Confirmed" | "Cancelled";
let status: BookingStatus = "Confirmed"; // "Done" would be an error
\`\`\`

**Narrowing**: with a union, TypeScript only lets you do what is valid for *every* member. To use string-only methods you first check:

\`\`\`ts
function formatId(id: string | number): string {
  if (typeof id === "number") {
    return id.toFixed(0);        // here id is number
  }
  return id.trim();              // here id is string
}
\`\`\`

Same idea for \`null\`: with \`imageUrl: string | null\`, write \`imageUrl !== null ? imageUrl : "/placeholder.png"\` or \`imageUrl ?? "/placeholder.png"\`.

**Intersection** \`A & B\` means "both at once" — for objects, all properties combined: \`type EventWithCategory = Event & { categoryName: string }\`.`,
      developer: `**Narrowing tools**:
- \`typeof x === "string" | "number" | "boolean" | "undefined" | "object" | "function"\` (note \`typeof null === "object"\`).
- Truthiness / equality: \`if (user)\`, \`if (x !== null)\`, \`if (status === "error")\`.
- \`"prop" in obj\` — narrows object unions by property presence.
- \`instanceof\` — classes and built-ins (\`err instanceof Error\` in catch blocks, where \`err\` is \`unknown\`).
- Custom **type guards**: \`function isEvent(x: unknown): x is Event { ... }\`.

**Discriminated unions** for request state:
\`\`\`ts
type RequestState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; data: T };
\`\`\`
Each member shares a literal \`status\` field (the *discriminant*). Checking it narrows the whole object: inside \`case "success"\`, \`state.data\` exists and is typed; in \`"error"\`, only \`message\` exists. Compare with three independent states (\`loading\`, \`error\`, \`data\`) which allow nonsense like "loading with an error and stale data" and force \`data!\` assertions.

**Exhaustiveness with \`never\`**:
\`\`\`ts
default: {
  const unreachable: never = state;   // compile error if a case is missing
  return unreachable;
}
\`\`\`
Add a \`{ status: "empty" }\` member later and every switch that forgot it fails to compile.

**Union vs intersection**: \`A | B\` accepts values of either type (you can only use common members until narrowed). \`A & B\` requires both — for objects, merged properties; for incompatible primitives, \`never\`. TanStack Query v5 uses exactly this pattern: \`status: 'pending' | 'error' | 'success'\`.`,
      deep: `**Control-flow analysis.** TypeScript tracks each variable's narrowed type through \`if\`, \`switch\`, early \`return\`/\`throw\`, \`&&\`/\`||\`, and assignments. Narrowing is reset when the variable could change: after an \`await\`, inside callbacks (a narrowed \`let\` is not trusted inside a closure created later), and for properties of objects that might be mutated by function calls. Copying to a \`const\` preserves narrowing.

**Discriminants must be literal types** (string/number/boolean literals, \`null\`/\`undefined\`). Destructuring the discriminant into a const (\`const { status } = state\`) still narrows \`state\` in TS ≥ 4.6 for destructured *const* bindings.

**Assignability.** A union is a supertype of its members: \`"Pending"\` is assignable to \`BookingStatus\`, which is assignable to \`string\`, not vice versa. Hence values read from a \`<select>\` (\`string\`) need validation/narrowing before becoming \`BookingStatus\` — a type guard \`(s: string): s is BookingStatus => (["Pending","Confirmed","Cancelled"] as const).includes(s as BookingStatus)\` or a Zod enum.

**Type guards can lie.** A user-defined \`x is Event\` guard is trusted blindly; a buggy guard silently mis-narrows. Keep guards small or generate them from a schema (Zod's \`safeParse\`).

**Intersection subtleties.** Intersecting object types with conflicting property types yields \`never\` for that property (and, for discriminants, the whole type reduces to \`never\`). Intersections of function types behave like overloads.

**\`never\`** is the empty union (bottom type): \`string & number\`, the result of narrowing away every member, and the return type of functions that always throw. Being assignable to everything is what makes the exhaustiveness trick work — only \`never\` can be assigned *to* \`never\`.`,
    },
    mechanism: `\`\`\`text
  UNION  string | number            INTERSECTION  A & B
  ┌──────────┐┌──────────┐           ┌─────────────────────┐
  │  string  ││  number  │           │ has A's props AND   │
  └──────────┘└──────────┘           │ B's props           │
   value is in EITHER set            └─────────────────────┘
                                      string & number = never (empty)

  NARROWING a discriminated union:   state: RequestState<Event[]>
                         ┌─ "idle"     → { status }
  switch (state.status) ─┼─ "loading"  → { status }
                         ├─ "error"    → { status, message: string }
                         ├─ "success"  → { status, data: Event[] }
                         └─ default    → state: never  (compile error if a case is missing)

  typeof x === "number"  : string | number ──▶ number   (else-branch: string)
  x !== null             : string | null   ──▶ string
  "data" in s            : A | B           ──▶ whichever has 'data'
\`\`\``,
    simpleExample: {
      title: "Unions, literals, typeof and intersection",
      language: "ts",
      code: `type Id = string | number;
type BookingStatus = "Pending" | "Confirmed" | "Cancelled";

function normaliseId(id: Id): number {
  if (typeof id === "string") {
    return Number.parseInt(id, 10);   // id: string
  }
  return id;                          // id: number
}

function statusColour(status: BookingStatus): string {
  return status === "Confirmed" ? "green" : status === "Pending" ? "amber" : "grey";
}

interface Event { id: number; title: string }
type EventWithCategory = Event & { categoryName: string };

const e: EventWithCategory = { id: 1, title: "Sports Day", categoryName: "Sports" };

console.log(normaliseId("42") + normaliseId(8)); // 50
console.log(statusColour("Pending"));            // amber
console.log(e.title, e.categoryName);            // Sports Day Sports
// let impossible: string & number = 5;         // ✗ Type 'number' is not assignable to type 'never'`,
      walkthrough: [
        { lines: "1-2", text: "A union of primitives (mock A14) and a union of string literals." },
        { lines: "4-9", text: "`typeof` narrows: in the `if` branch `id` is `string`; after the early return, TypeScript knows it must be `number`." },
        { lines: "11-13", text: "With a literal union, typos like `\"Confirmd\"` are compile errors." },
        { lines: "15-18", text: "Intersection: the object must have the properties of BOTH sides." },
        { lines: "23", text: "Intersecting incompatible primitives produces `never` — nothing can be assigned to it." },
      ],
    },
    realExample: {
      title: "Discriminated request state for the Events page, with exhaustive rendering",
      language: "tsx",
      code: `import { useEffect, useState } from "react";

interface CampusEvent { id: number; title: string }

type RequestState<T> =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; data: T };

async function getEvents(signal: AbortSignal): Promise<CampusEvent[]> {
  const res = await fetch("http://localhost:5229/api/events", { signal });
  if (!res.ok) throw new Error(\`Failed to fetch events: \${res.status}\`);
  return res.json() as Promise<CampusEvent[]>;
}

export function EventsPage() {
  const [state, setState] = useState<RequestState<CampusEvent[]>>({ status: "loading" });

  useEffect(() => {
    const controller = new AbortController();
    getEvents(controller.signal)
      .then((data) => setState({ status: "success", data }))
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setState({ status: "error", message: err instanceof Error ? err.message : "Unknown error" });
      });
    return () => controller.abort();
  }, []);

  switch (state.status) {
    case "loading":
      return <p>Loading…</p>;
    case "error":
      return <p role="alert">{state.message}</p>;
    case "success":
      return state.data.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <ul>{state.data.map((e) => <li key={e.id}>{e.title}</li>)}</ul>
      );
    default: {
      const unreachable: never = state;
      return unreachable;
    }
  }
}`,
      walkthrough: [
        { lines: "5-8", text: "One state value, three shapes, discriminated by the literal `status`. 'Loading with an error' cannot be represented." },
        { lines: "17", text: "State is typed with the generic union; it starts in the loading shape." },
        { lines: "22-26", text: "`catch` receives `unknown`; `instanceof` narrows it. Aborts (from unmount/StrictMode) are ignored." },
        { lines: "30-40", text: "`switch` on the discriminant narrows `state`: `message` only exists in the error case, `data` only in success. Empty vs success are distinguished (Week 03 slide 22)." },
        { lines: "41-44", text: "If someone adds a new status and forgets a case, `state` is no longer `never` here and the build fails." },
      ],
    },
    mistakes: [
      {
        mistake: "Writing `string & number` (or `string + number`) for 'either a string or a number' (mock A14 distractors).",
        fix: "Union is `|`: `string | number`. `&` means both at once, which for these primitives is `never`.",
      },
      {
        mistake: "Calling type-specific methods on a union without narrowing (`id.trim()` on `string | number`).",
        fix: "Narrow first with `typeof`, equality, `in`, `instanceof` or a type guard.",
      },
      {
        mistake: "Modelling request state as separate booleans/fields (`loading`, `error`, `data`) that can contradict each other.",
        fix: "Use a discriminated union keyed by a literal `status` field.",
      },
      {
        mistake: "Using `!` (non-null assertion) to silence `possibly null` errors.",
        fix: "Handle the null case (`??`, early return, conditional rendering). `!` only hides the problem.",
      },
      {
        mistake: "Forgetting that `typeof null === \"object\"` when narrowing objects.",
        fix: "Check `x !== null && typeof x === \"object\"`.",
      },
    ],
    debug: {
      prompt: "This helper doesn't compile: `Property 'toFixed' does not exist on type 'string | number'`. A teammate wants to 'fix' it with `as any`. Fix it properly and make the label function exhaustive.",
      language: "ts",
      buggyCode: `type Price = string | number;
type TicketType = "standard" | "student" | "vip";

function formatPrice(price: Price): string {
  return "£" + price.toFixed(2);
}

function ticketLabel(type: TicketType): string {
  switch (type) {
    case "standard":
      return "Standard";
    case "student":
      return "Student (ID required)";
  }
  return "";
}`,
      hint: "Narrow `price` with `typeof`. For `ticketLabel`, what happens when `\"vip\"` is passed? How can the compiler force you to handle it?",
      fixedCode: `type Price = string | number;
type TicketType = "standard" | "student" | "vip";

function formatPrice(price: Price): string {
  const value = typeof price === "string" ? Number.parseFloat(price) : price;
  return Number.isFinite(value) ? "£" + value.toFixed(2) : "Price unavailable";
}

function ticketLabel(type: TicketType): string {
  switch (type) {
    case "standard":
      return "Standard";
    case "student":
      return "Student (ID required)";
    case "vip":
      return "VIP";
    default: {
      const unreachable: never = type;
      return unreachable;
    }
  }
}`,
      explanation: "`toFixed` exists on numbers only; `typeof` narrowing converts strings first and handles unparseable input. `as any` would compile but crash on `\"15.00\".toFixed`. The original `ticketLabel` silently returned \"\" for `\"vip\"`; with a `never` default, forgetting any member of `TicketType` is a compile error.",
    },
    challenge: {
      prompt: "Write a type guard `isApiError(x: unknown): x is ApiError` where `ApiError = { status: number; message: string }`, and a function `describe(result: Booking | ApiError): string` that uses the `in` operator (or your guard) to narrow.",
      starterCode: `interface Booking { id: number; eventTitle: string; tickets: number }
interface ApiError { status: number; message: string }

// isApiError
// describe`,
      language: "ts",
      hints: [
        "Check `typeof x === \"object\" && x !== null` first.",
        "Then check `\"status\" in x && typeof x.status === \"number\"` and the same for `message`.",
        "In `describe`, `\"message\" in result` narrows to `ApiError`.",
      ],
      solution: `interface Booking { id: number; eventTitle: string; tickets: number }
interface ApiError { status: number; message: string }

function isApiError(x: unknown): x is ApiError {
  return (
    typeof x === "object" &&
    x !== null &&
    "status" in x &&
    typeof x.status === "number" &&
    "message" in x &&
    typeof x.message === "string"
  );
}

function describe(result: Booking | ApiError): string {
  if (isApiError(result)) {
    return \`Error \${result.status}: \${result.message}\`;
  }
  return \`\${result.tickets} ticket(s) for \${result.eventTitle}\`;
}

console.log(describe({ status: 403, message: "Forbidden" }));          // Error 403: Forbidden
console.log(describe({ id: 1, eventTitle: "Sports Day", tickets: 2 })); // 2 ticket(s) for Sports Day`,
      explanation: "The guard's return type `x is ApiError` tells TypeScript that a `true` result narrows the argument. `in` checks (TS 4.9+) also narrow `unknown` objects so `x.status` can be read. In `describe`, the else branch is automatically narrowed to `Booking`.",
    },
    examQuestions: [
      {
        question: "**(Mock A14)** Which TypeScript type would be most appropriate for a variable that can contain either a string or a number?\n\nA. `string & number`\nB. `string | number`\nC. `string + number`\nD. `string / number`",
        answer: "**B. `string | number`** — a union. `&` is an intersection (both at once — impossible here, `never`); `+` and `/` are not type operators.",
        marks: 1,
      },
      {
        question: "**(Mock B13)** True or False: A TypeScript union type allows a value to belong to one of several specified types.",
        answer: "**True.**",
        marks: 1,
      },
      {
        question: "Explain what a discriminated union is and why it is useful for representing the result of an API request.",
        answer: "A union of object types that share a literal 'discriminant' property (e.g. `status: \"loading\" | \"error\" | \"success\"`). Checking the discriminant narrows the object, so `data` is only accessible in the success case and `message` only in the error case. It prevents impossible combinations (loading + error + data) and lets the compiler check every state is handled.",
        marks: 3,
      },
      {
        question: "Given `function f(x: string | null)`, write one line that returns the string's length, or 0 when `x` is null.",
        answer: "`return x?.length ?? 0;` (or `return x !== null ? x.length : 0;`).",
        marks: 1,
      },
    ],
    revision: [
      "Union `A | B` = either (mock A14: `string | number`; B13 True).",
      "Intersection `A & B` = both; incompatible primitives → `never`.",
      "Literal unions restrict values: `\"Pending\" | \"Confirmed\" | \"Cancelled\"`.",
      "Narrow with `typeof`, equality/`!== null`, `in`, `instanceof`, or `x is T` guards.",
      "Discriminated union: shared literal `status` field; switch on it to narrow.",
      "Model request state as `loading | error(message) | success(data)` — no impossible states.",
      "`const unreachable: never = x` in `default` makes switches exhaustive.",
      "Avoid `as any` and `!` — they silence, not fix.",
    ],
  },

  /* ================================================================ */
  /* 12. Generics & utility types                                       */
  /* ================================================================ */
  {
    id: "ts-generics-utility",
    moduleId: "m04-typescript",
    title: "Generics, Utility Types, any/unknown/never and React Event Types",
    summary:
      "Reusable typed functions with generics and constraints, Partial/Pick/Omit/Record/Readonly, the any vs unknown vs never trio, why `as` is dangerous, and typing React change/submit events.",
    priority: "P1",
    minutes: 40,
    objectives: [
      "Write generic functions and hooks (`identity<T>`, `useFetch<T>`) and explain what `T` represents",
      "Constrain generics with `extends` (e.g. `K extends keyof T`)",
      "Derive new types with Partial, Pick, Omit, Record and Readonly",
      "Choose correctly between `any`, `unknown` and `never`, and explain the risk of `as` assertions",
      "Type React event handlers with `React.ChangeEvent<HTMLInputElement>` and `React.FormEvent`",
    ],
    prerequisites: ["ts-unions-narrowing"],
    sources: [
      L02("Slide 42 (useState<Event[]>([]) — a generic type argument in practice)"),
      W03("Slide 17 (getEvents(): Promise<Event[]> — a generic Promise type), Slide 15 (Event vs EventCardProps — deriving smaller shapes)"),
      TS_DOCS("Generics", "https://www.typescriptlang.org/docs/handbook/2/generics.html"),
      { kind: "supplementary", label: "TypeScript Handbook — Utility Types", url: "https://www.typescriptlang.org/docs/handbook/utility-types.html" },
      { kind: "supplementary", label: "react.dev — Using TypeScript", url: "https://react.dev/learn/typescript" },
    ],
    why: `You've already used generics: \`useState<Event[]>\`, \`Promise<Event[]>\`, \`Array<number>\`. Generics let **one** function or hook work for **many** types while keeping full type information — a \`useFetch<T>\` hook that returns \`Event[]\` for one call and \`Category[]\` for another, instead of returning \`any\` and losing all checking.

Utility types stop you duplicating interfaces: an update form is \`Partial<Event>\`, a create payload is \`Omit<Event, "id">\`, a card's props are \`Pick<Event, "title" | "price">\`. And knowing \`any\` vs \`unknown\` vs \`never\` — and why \`as\` doesn't check anything — is what separates code that *looks* typed from code that *is* safe.`,
    analogy: `A generic is a **labelled storage box with a blank label slot**: \`Box<T>\`. When you use it you fill in the label — \`Box<Book>\` — and from then on the system knows that what goes in and what comes out are both books. Without generics you'd either make a separate box type for every item, or a box labelled "\`any\` stuff" where you've no idea what you'll pull out.

**\`any\`** is a box with the label torn off *and* the alarm disabled — anything goes, nothing is checked. **\`unknown\`** is a sealed box: you can hold it, but you must inspect it (narrow) before using what's inside. **\`never\`** is a box that can't exist. **\`as\`** is writing a label on a box *without looking inside* — the system believes you, even if you're wrong.`,
    explain: {
      beginner: `A **generic** is a type parameter — a placeholder, usually called \`T\`, filled in when the function is used:

\`\`\`ts
function identity<T>(value: T): T {
  return value;
}
const n = identity(5);          // T = number, n: number
const s = identity("hello");    // T = "hello" (a literal), s: "hello"
\`\`\`

TypeScript usually **infers** \`T\` from the arguments. Compare \`function identity(value: any): any\` — it "works", but \`n\` would be \`any\` and all checking is gone.

You already use generic types: \`useState<Event[]>([])\`, \`Promise<Event[]>\`.

**Utility types** build new types from existing ones:
- \`Partial<Event>\` — all properties optional (for updates).
- \`Pick<Event, "title" | "price">\` — only those properties.
- \`Omit<Event, "id">\` — everything except \`id\` (for create forms — the server assigns the id).
- \`Record<string, number>\` — an object whose keys are strings and values numbers.
- \`Readonly<Event>\` — all properties readonly.

**\`any\` vs \`unknown\`**: both accept any value, but \`any\` lets you do anything with it (no checks), whereas \`unknown\` makes you check first. Prefer \`unknown\` for things you haven't validated yet, like JSON from an API or a caught error.

**React events**: \`(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)\` and \`(e: React.FormEvent<HTMLFormElement>) => { e.preventDefault(); ... }\`.`,
      developer: `**Generic functions and hooks**:
\`\`\`ts
async function getJson<T>(url: string): Promise<T> { /* fetch + res.json() */ }
const events = await getJson<Event[]>("/api/events"); // events: Event[]

function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  // ...
  return { data, error, loading };   // data: T | null
}
const { data } = useFetch<Category[]>("/api/categories");
\`\`\`
Caveat: \`getJson<T>\` just *trusts* the caller's \`T\` — it's an assertion in disguise (see *Typed API data*).

**Constraints** restrict what \`T\` may be:
\`\`\`ts
function pluck<T, K extends keyof T>(items: T[], key: K): T[K][] {
  return items.map(i => i[key]);
}
pluck(events, "title");   // string[]
pluck(events, "titel");   // ✗ not a key of Event
function byId<T extends { id: number }>(items: T[], id: number): T | undefined { ... }
\`\`\`

**Utility types in practice**:
\`\`\`ts
type EventUpdate = Partial<Omit<Event, "id">>;               // PATCH-like changes
type CreateEventRequest = Omit<Event, "id" | "categoryName" | "availableTickets">;
type EventCardProps = Pick<Event, "title" | "location" | "price">;
type CountByCategory = Record<string, number>;
\`\`\`

**any / unknown / never**: \`any\` disables checking in both directions (and spreads — \`any.foo.bar\` is \`any\`); \`unknown\` is the safe top type (must narrow before use; \`catch (err)\` is \`unknown\` under strict); \`never\` is the empty type (impossible branches, functions that always throw).

**Assertions** (\`value as Event\`) tell the compiler "trust me" — no runtime check. Acceptable for DOM lookups you control (\`document.getElementById("root")!\`) or after real validation; dangerous on API data.

**React event types**: \`React.ChangeEvent<HTMLInputElement | HTMLSelectElement>\`, \`React.FormEvent<HTMLFormElement>\`, \`React.MouseEvent<HTMLButtonElement>\`, \`React.KeyboardEvent\`. Inline handlers (\`onChange={e => ...}\`) are inferred automatically — annotate only when the handler is declared separately.`,
      deep: `**Inference and widening.** For \`identity("hello")\` TypeScript infers the literal type \`T = "hello"\`; assigning the result to a \`const\` keeps \`"hello"\`, while a \`let\` widens it to \`string\`. Literals nested inside object arguments are widened (\`{ status: "open" }\` infers \`status: string\`). Use \`<const T>\` (TS 5.0 const type parameters) when you want literal/tuple inference preserved deliberately.

**Constraints are upper bounds.** \`T extends { id: number }\` lets the body use \`.id\` and lets callers pass richer objects; returning \`T\` (not \`{ id: number }\`) preserves the caller's full type — the main reason to prefer generics over plain parameter types.

**How utility types work.** They are *mapped* and *conditional* types in the standard library: \`Partial<T> = { [K in keyof T]?: T[K] }\`, \`Pick<T, K extends keyof T> = { [P in K]: T[P] }\`, \`Omit<T, K> = Pick<T, Exclude<keyof T, K>>\`. Note \`Omit\`'s \`K\` is \`keyof any\`, so a misspelt key (\`Omit<Event, "idd">\`) is **not** an error — a known foot-gun.

**\`Readonly\` is shallow and compile-time only**; nested arrays stay mutable unless typed \`readonly T[]\`.

**any is contagious.** \`JSON.parse\` and (in lib types) \`Response.json()\` return \`any\`/\`Promise<any>\`, which silently flows into typed variables. Lint rules like \`@typescript-eslint/no-unsafe-assignment\` catch this. Typing \`const data: unknown = await res.json()\` forces validation.

**Assertions vs satisfies.** \`as\` can only convert between *related* types (otherwise you need \`as unknown as T\` — a red flag). \`satisfies\` (TS 4.9) checks a value against a type **without** changing its inferred type — great for config objects and lookup tables.

**React 19 types**: event types live in \`@types/react\` under the \`React\` namespace; with \`verbatimModuleSyntax\`, import them as types: \`import type { ChangeEvent, FormEvent } from "react"\`.`,
    },
    mechanism: `\`\`\`text
 GENERIC FUNCTION                         call site
 function first<T>(xs: T[]): T | undefined   first(events)
            ▲          ▲        ▲                │ infer T from argument
            └──────────┴────────┴──── T := CampusEvent
                                         result: CampusEvent | undefined

 UTILITY TYPES on  Event { id; title; price; location; categoryName }
   Partial<Event>              → { id?; title?; price?; location?; categoryName? }
   Pick<Event,"title"|"price"> → { title; price }
   Omit<Event,"id">            → { title; price; location; categoryName }
   Record<string, number>      → { [key: string]: number }
   Readonly<Event>             → { readonly id; readonly title; ... }

 TOP & BOTTOM TYPES
   any      ◀── anything in, ANYTHING allowed out (checker off)  ✗
   unknown  ◀── anything in, must NARROW before use               ✓
   never    ◀── nothing in (impossible)

 ASSERTION   const e = json as Event   →  compiler: "OK!"   runtime: no check at all
\`\`\``,
    simpleExample: {
      title: "identity, constrained helpers and utility types",
      language: "ts",
      code: `function identity<T>(value: T): T {
  return value;
}

function pluck<T, K extends keyof T>(items: T[], key: K): T[K][] {
  return items.map((item) => item[key]);
}

function findById<T extends { id: number }>(items: T[], id: number): T | undefined {
  return items.find((item) => item.id === id);
}

interface Product { id: number; name: string; price: number; description?: string }

type ProductUpdate = Partial<Omit<Product, "id">>;
type ProductSummary = Pick<Product, "name" | "price">;
type StockByName = Record<string, number>;

const products: Product[] = [
  { id: 1, name: "Mug", price: 8 },
  { id: 2, name: "Lamp", price: 25 },
];

const n = identity(42);                       // number
const names = pluck(products, "name");        // string[]
const lamp = findById(products, 2);           // Product | undefined
const change: ProductUpdate = { price: 9 };   // only some fields
const summary: ProductSummary = { name: "Mug", price: 8 };
const stock: StockByName = { Mug: 30, Lamp: 12 };

console.log(n, names, lamp?.name, change, summary, stock.Mug);
// 42 ["Mug", "Lamp"] Lamp { price: 9 } { name: "Mug", price: 8 } 30`,
      walkthrough: [
        { lines: "1-3", text: "`T` is inferred at each call; input and output types are linked." },
        { lines: "5-7", text: "`K extends keyof T` restricts `key` to real property names; the return type `T[K][]` is the property's type." },
        { lines: "9-11", text: "A constraint lets the body use `.id` while returning the caller's full type `T`." },
        { lines: "15-17", text: "Utility types derive new shapes from `Product` instead of duplicating it." },
        { lines: "24-29", text: "Every result is precisely typed — no `any`. `pluck(products, \"nam\")` would be a compile error." },
      ],
    },
    realExample: {
      title: "A generic useFetch hook and a typed create-event form",
      language: "tsx",
      code: `import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

export function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch(url, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
        return res.json() as Promise<T>; // ⚠ trusted, not validated
      })
      .then(setData)
      .catch((err: unknown) => {
        if (err instanceof Error && err.name !== "AbortError") setError(err.message);
      });
    return () => controller.abort();
  }, [url]);

  return { data, error, loading: data === null && error === null };
}

interface CampusEvent {
  id: number;
  title: string;
  location: string;
  capacity: number;
  categoryName: string;
}

type CreateEventForm = Omit<CampusEvent, "id" | "categoryName">;

export function CreateEvent({ onCreate }: { onCreate: (e: CreateEventForm) => void }) {
  const [form, setForm] = useState<CreateEventForm>({ title: "", location: "", capacity: 1 });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "number" ? Number(value) : value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onCreate(form);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="title" value={form.title} onChange={handleChange} />
      <input name="location" value={form.location} onChange={handleChange} />
      <input name="capacity" type="number" value={form.capacity} onChange={handleChange} />
      <button type="submit">Create</button>
    </form>
  );
}`,
      walkthrough: [
        { lines: "4-5", text: "The hook is generic: the caller decides `T` (`useFetch<CampusEvent[]>(...)`), and `data` is `T | null`." },
        { lines: "13", text: "`res.json()` returns `Promise<any>`; asserting to `Promise<T>` documents intent but checks nothing — pair with runtime validation for untrusted APIs." },
        { lines: "16-17", text: "Caught errors are `unknown`; `instanceof Error` narrows before reading `.message`." },
        { lines: "33", text: "`Omit` derives the form type from the API type: the server assigns `id` and `categoryName`." },
        { lines: "38-41", text: "`ChangeEvent<HTMLInputElement>` types `e.target` so `name`, `value` and `type` are known strings." },
        { lines: "43-46", text: "`FormEvent<HTMLFormElement>`; `preventDefault()` stops the browser's full-page form submission." },
      ],
    },
    mistakes: [
      {
        mistake: "Typing unknown data as `any` (`const data: any = await res.json()`).",
        fix: "Use `unknown` and narrow/validate; `any` turns off checking everywhere the value flows.",
      },
      {
        mistake: "Using `as Event[]` and believing the data has been checked.",
        fix: "Assertions are compile-time promises only. Validate with a schema (Zod `safeParse`) or a type guard.",
      },
      {
        mistake: "Duplicating interfaces for create/update forms that drift out of sync with the main type.",
        fix: "Derive them: `Omit<Event, \"id\">`, `Partial<...>`, `Pick<...>`.",
      },
      {
        mistake: "Typing an input handler as `(e: Event)` or `(e: any)`.",
        fix: "`(e: React.ChangeEvent<HTMLInputElement>)`; for forms `React.FormEvent<HTMLFormElement>`.",
      },
      {
        mistake: "Writing a generic with no relationship between parameters and return (`function f<T>(x: string): T`).",
        fix: "That is a hidden cast. A type parameter should appear in at least one parameter (or be constrained) so it is inferred, not invented.",
      },
    ],
    debug: {
      prompt: "A typo slipped through: the page renders `undefined` instead of the first event's title, but TypeScript reported nothing. Make the helper generic so the compiler catches the typo, then fix the typo.",
      language: "ts",
      buggyCode: `interface CampusEvent { id: number; title: string; price: number }

function firstItem(items: any[]): any {
  return items[0];
}

const events: CampusEvent[] = [{ id: 1, title: "Tech Conference", price: 15 }];
const first = firstItem(events);
console.log(first.titel.toUpperCase());`,
      hint: "What is the type of `first`? What would it be if `firstItem` were `<T>(items: T[]) => T | undefined`?",
      fixedCode: `interface CampusEvent { id: number; title: string; price: number }

function firstItem<T>(items: T[]): T | undefined {
  return items[0];
}

const events: CampusEvent[] = [{ id: 1, title: "Tech Conference", price: 15 }];
const first = firstItem(events);              // CampusEvent | undefined
// first.titel  → ✗ Property 'titel' does not exist. Did you mean 'title'?
console.log(first?.title.toUpperCase() ?? "No events"); // TECH CONFERENCE`,
      explanation: "With `any`, every property access is allowed, so `titel` compiled and produced `undefined` at runtime (calling `.toUpperCase()` on it would actually throw). The generic version infers `T = CampusEvent`, so the typo is a compile error, and the honest return type `T | undefined` forces handling the empty-array case.",
    },
    challenge: {
      prompt: "Write a generic `groupBy<T, K extends string>(items: T[], getKey: (item: T) => K): Partial<Record<K, T[]>>`, then use it to group events by `categoryName`. Also define `type EventPatch = Partial<Pick<CampusEvent, \"title\" | \"price\">>`.",
      starterCode: `interface CampusEvent { id: number; title: string; price: number; categoryName: string }

const events: CampusEvent[] = [
  { id: 1, title: "Tech Conference", price: 15, categoryName: "Tech" },
  { id: 2, title: "Sports Day", price: 5, categoryName: "Sports" },
  { id: 3, title: "Hack Night", price: 0, categoryName: "Tech" },
];

// groupBy + EventPatch`,
      language: "ts",
      hints: [
        "Start with `const groups: Partial<Record<K, T[]>> = {};`.",
        "For each item: `const key = getKey(item); (groups[key] ??= []).push(item);`.",
        "Partial is needed because not every possible key will be present.",
      ],
      solution: `interface CampusEvent { id: number; title: string; price: number; categoryName: string }

const events: CampusEvent[] = [
  { id: 1, title: "Tech Conference", price: 15, categoryName: "Tech" },
  { id: 2, title: "Sports Day", price: 5, categoryName: "Sports" },
  { id: 3, title: "Hack Night", price: 0, categoryName: "Tech" },
];

function groupBy<T, K extends string>(items: T[], getKey: (item: T) => K): Partial<Record<K, T[]>> {
  const groups: Partial<Record<K, T[]>> = {};
  for (const item of items) {
    const key = getKey(item);
    (groups[key] ??= []).push(item);
  }
  return groups;
}

type EventPatch = Partial<Pick<CampusEvent, "title" | "price">>;

const byCategory = groupBy(events, (e) => e.categoryName);
console.log(byCategory.Tech?.length);   // 2
const patch: EventPatch = { price: 20 };
console.log(patch);                     // { price: 20 }`,
      explanation: "`T` is inferred as `CampusEvent` and `K` as `string` from the callback. `Partial<Record<K, T[]>>` honestly says some groups may be missing, so `byCategory.Tech` is `CampusEvent[] | undefined`. `??=` creates the array on first use. `EventPatch` composes two utility types.",
    },
    examQuestions: [
      {
        question: "Which type should you use for a value whose type you don't know yet and which must be checked before use?\n\nA. `any`\nB. `unknown`\nC. `never`\nD. `void`",
        answer: "**B. `unknown`** — it accepts any value but forces narrowing before you can use it. `any` disables checking; `never` has no values.",
        marks: 1,
      },
      {
        question: "Given `interface Event { id: number; title: string; price: number }`, write a type for the request body of a create-event form where the server generates `id`.",
        answer: "`type CreateEventRequest = Omit<Event, \"id\">;` (→ `{ title: string; price: number }`).",
        marks: 2,
      },
      {
        question: "True or False: `const events = data as Event[];` makes the program check at runtime that `data` is an array of events.",
        answer: "**False.** Type assertions are erased; they only change what the compiler believes. No runtime check happens.",
        marks: 1,
      },
      {
        question: "Give the correct type annotation for an input change handler in React + TypeScript and for a form submit handler.",
        answer: "`(e: React.ChangeEvent<HTMLInputElement>) => void` and `(e: React.FormEvent<HTMLFormElement>) => void` (calling `e.preventDefault()` in the submit handler).",
        marks: 2,
      },
    ],
    revision: [
      "Generics = type parameters (`<T>`) inferred at call sites; keep input/output types linked.",
      "Constraints: `T extends { id: number }`, `K extends keyof T`.",
      "`Partial` (all optional), `Pick` (some), `Omit` (all but), `Record<K, V>` (dictionary), `Readonly`.",
      "`any` = checking off; `unknown` = must narrow first; `never` = impossible.",
      "`as` asserts without checking — never treat it as validation.",
      "`useState<T>`, `Promise<T>`, `useFetch<T>` are all generics.",
      "React events: `ChangeEvent<HTMLInputElement>`, `FormEvent<HTMLFormElement>`, `MouseEvent<HTMLButtonElement>`.",
    ],
  },

  /* ================================================================ */
  /* 13. Typed API data                                                 */
  /* ================================================================ */
  {
    id: "ts-typed-api-data",
    moduleId: "m04-typescript",
    title: "Typing API Data: DTO → Interface, Payload Types and Runtime Validation with Zod",
    summary:
      "Map C# DTOs to TypeScript interfaces (string? → string | null, DateTime → ISO string), type fetch functions as Promise<Event[]>, derive payload types with Omit — and validate at runtime because `as Event[]` checks nothing.",
    priority: "P0",
    examCritical: true,
    minutes: 40,
    objectives: [
      "Translate a C# DTO into a TypeScript interface, including nullable strings and dates",
      "Type service functions (`getEvents(): Promise<Event[]>`) and create/update payloads",
      "Explain why `as Event[]` (or a generic `getJson<T>`) does not validate API data",
      "Validate responses at runtime with Zod `safeParse` and derive the type with `z.infer`",
    ],
    prerequisites: ["ts-generics-utility", "js-promises-async"],
    sources: [
      W03("Slides 14–15 (TypeScript and API Data: Event interface — imageUrl: string | null for C# string?, startDate: string for C# DateTime; 'If the C# DTO changes, this interface must change too'; Event vs EventCardProps)"),
      W03("Slides 11–12, 17–18 (Response object, response.ok check, eventService.ts with getEvents(): Promise<Event[]>)"),
      L02("Slide 39 (Why TypeScript? — safer API data handling)"),
      MOCK("B2 (interfaces describe API objects), E5 (API data should not be treated as automatically trustworthy)"),
      { kind: "supplementary", label: "Zod documentation", url: "https://zod.dev" },
      MDN("Response.json()", "https://developer.mozilla.org/en-US/docs/Web/API/Response/json"),
    ],
    why: `The API is the boundary where your carefully typed frontend meets data it doesn't control. Week 03 shows the Event interface mirroring the C# DTO and warns: **"If the C# DTO changes, this interface must change too."** If the backend renames \`title\` to \`name\`, or sends \`imageUrl: null\` where your interface says \`string\`, TypeScript won't notice — the JSON arrives at **runtime**, after types have been erased. The result is crashes like \`Cannot read properties of null\` far from the fetch call.

Mock E5 makes the security version of this point: a frontend should **not** treat API data as automatically trustworthy just because the request succeeded. This lesson connects the typing (interfaces, \`Promise<Event[]>\`, \`Omit\` payloads) with runtime validation (Zod) so the types you write are actually true.`,
    analogy: `Your TypeScript interface is a **delivery note** saying "this parcel contains 12 events, each with a title and a price". \`as Event[]\` is **signing for the parcel without opening it**. Everything downstream trusts the note.

**Runtime validation** (Zod \`safeParse\`) is **opening the parcel at the door and checking each item against the delivery note**. If something's wrong you find out *at the door* with a clear message ("item 3: price expected number, received string"), not later when a customer opens a broken box.`,
    explain: {
      beginner: `The CampusEvents API is written in C#. Its \`EventDto\` becomes JSON, and your interface describes that JSON (Week 03 slide 14):

| C# (DTO) | JSON | TypeScript |
|---|---|---|
| \`int Id\` | \`"id": 1\` | \`id: number\` |
| \`string Title\` | \`"title": "..."\` | \`title: string\` |
| \`string? ImageUrl\` | \`"imageUrl": null\` | \`imageUrl: string \\| null\` |
| \`DateTime StartDate\` | \`"startDate": "2026-11-26T09:00:00"\` | \`startDate: string\` |
| \`decimal Price\` | \`"price": 15\` | \`price: number\` |

Note the names change from PascalCase to camelCase (ASP.NET Core's default JSON setting) and dates arrive as **ISO strings**, not \`Date\` objects — convert with \`new Date(event.startDate)\` when you need to.

A typed service function (Week 03 slide 17):

\`\`\`ts
export async function getEvents(): Promise<Event[]> {
  const response = await fetch(\`\${API_BASE}/events\`);
  if (!response.ok) throw new Error("Failed to fetch events: " + response.status);
  return response.json();
}
\`\`\`

The return type \`Promise<Event[]>\` tells every component what it will get. **But** TypeScript just believes it: \`response.json()\` returns \`any\`, so if the server sends something different, nothing complains until your code crashes. That's why professional apps add **runtime validation** with a library such as **Zod**.

For sending data, derive the payload type instead of rewriting it: \`type CreateEventRequest = Omit<Event, "id" | "categoryName" | "availableTickets">\` — the server generates those.`,
      developer: `**Layering** (Week 03 slides 16–18): \`types/event.ts\` (shapes) → \`services/eventService.ts\` (HTTP + parsing + errors) → components (UI). Only the service touches raw JSON.

**Why casts don't help**:
\`\`\`ts
const events = (await res.json()) as Event[];    // compiles, checks nothing
const data = await getJson<Event[]>("/events");   // same thing, hidden in a generic
\`\`\`

**Runtime validation with Zod 4**:
\`\`\`ts
import { z } from "zod";

export const EventSchema = z.object({
  id: z.number(),
  title: z.string(),
  imageUrl: z.string().nullable(),   // string | null
  startDate: z.string(),             // ISO string from DateTime
  price: z.number().nonnegative(),
  availableTickets: z.number().int(),
  categoryName: z.string(),
});
export type Event = z.infer<typeof EventSchema>;   // single source of truth

const result = z.array(EventSchema).safeParse(await res.json());
if (!result.success) {
  console.error(result.error.issues);              // path + message per problem
  throw new Error("Unexpected events response");
}
return result.data;                                 // typed AND verified
\`\`\`
\`parse\` throws a \`ZodError\`; \`safeParse\` returns a discriminated union \`{ success: true, data } | { success: false, error }\` — narrow on \`success\`.

**Payload types**:
\`\`\`ts
type CreateEventRequest = Omit<Event, "id" | "categoryName" | "availableTickets">;
type UpdateEventRequest = CreateEventRequest;   // PUT /api/events/{id} → 204 No Content
\`\`\`
For a 204, don't call \`res.json()\` — there is no body; type the function \`Promise<void>\`.

**Nulls in the UI**: \`imageUrl ?? "/placeholder.png"\`; dates: \`new Date(e.startDate).toLocaleDateString("en-GB")\`.`,
      deep: `**Where to validate.** Validate once, at the boundary (service layer or TanStack Query \`queryFn\`), so everything downstream can trust the types. Validating in components scatters the logic; not validating means one backend change can crash many screens.

**Strictness choices.** \`z.object\` strips unknown keys by default (Zod 4); \`z.strictObject\` rejects them; \`z.looseObject\` keeps them. Stripping is usually right for APIs: new backend fields don't break the client. Be deliberate about \`nullable()\` (\`null\` allowed) vs \`optional()\` (key may be missing) vs \`nullish()\` (both) — they map to \`| null\`, \`?:\`, and both respectively.

**Dates.** ASP.NET serialises \`DateTime\` as ISO 8601; whether it carries \`Z\`/an offset depends on \`DateTimeKind\` — a value without an offset is parsed by \`new Date()\` as **local time**. If the backend uses UTC, make sure it emits \`Z\`, or treat dates consistently. You can transform during validation (\`z.string().transform(s => new Date(s))\`), but then the parsed type differs from the JSON type (\`z.input\` vs \`z.output\`), which matters if you also re-send the data.

**Decimal precision.** C# \`decimal\` → JSON number → JS double; fine for prices like 15.50, risky for high-precision money arithmetic (prefer integer pence or server-side totals).

**Error policy.** Decide what a failed parse means: throw (show error UI), or partially accept (filter out invalid items and log them). For lists, \`z.array(EventSchema)\` fails the whole list on one bad item; parsing items individually with \`safeParse\` allows graceful degradation.

**Contract drift tooling.** For larger systems, generate TS types (and even Zod schemas) from the backend's OpenAPI/Swagger document so DTO changes surface as compile errors rather than runtime surprises.

**Security (mock E5).** Validation guards *shape*, not *trust*: strings from the API can still contain malicious HTML — never pass them to \`dangerouslySetInnerHTML\` unsanitised.`,
    },
    mechanism: `\`\`\`text
  C# EventDto                JSON over HTTP                     TypeScript
 ┌──────────────────────┐   ┌──────────────────────────┐   ┌──────────────────────────┐
 │ int Id               │   │ "id": 7                  │   │ id: number               │
 │ string Title         │──▶│ "title": "Hack Night"    │──▶│ title: string            │
 │ string? ImageUrl     │   │ "imageUrl": null         │   │ imageUrl: string | null  │
 │ DateTime StartDate   │   │ "startDate": "2026-12-…" │   │ startDate: string (ISO)  │
 │ decimal Price        │   │ "price": 0               │   │ price: number            │
 └──────────────────────┘   └──────────────────────────┘   └──────────────────────────┘

  fetch ─▶ res.ok? ─▶ res.json(): any ─┬─▶  as Event[]        ✗ no check — bad data flows on
                                       └─▶  Schema.safeParse  ✓ success → data: Event[]
                                                              ✗ failure → error.issues (path, message)
\`\`\`

- The interface/schema must follow the DTO; changes on one side must be mirrored (Week 03 slide 14).
- Only runtime code (Zod, type guards) can inspect runtime data.`,
    simpleExample: {
      title: "Why `as` doesn't validate — and what safeParse does",
      language: "ts",
      code: `import { z } from "zod";

const EventSchema = z.object({
  id: z.number(),
  title: z.string(),
  imageUrl: z.string().nullable(),
  price: z.number(),
});
type Event = z.infer<typeof EventSchema>;

// Simulated response from a backend that renamed "title" to "name"
const json: unknown = JSON.parse('[{"id":1,"name":"Tech Conference","imageUrl":null,"price":15}]');

const trusted = json as Event[];
console.log(trusted[0].title);            // undefined — no error, silent bug

const result = z.array(EventSchema).safeParse(json);
if (result.success) {
  console.log(result.data[0].title);
} else {
  console.log(result.error.issues[0].path, result.error.issues[0].message);
  // [0, "title"]  "Invalid input: expected string, received undefined"
}`,
      walkthrough: [
        { lines: "3-9", text: "The schema is the runtime check; `z.infer` derives the static type from it, so the two can't drift apart." },
        { lines: "12", text: "Typing parsed JSON as `unknown` is honest — we don't know its shape yet." },
        { lines: "14-15", text: "The assertion compiles and lies: `title` is actually missing, so we get `undefined` at runtime." },
        { lines: "17-22", text: "`safeParse` returns a discriminated union. On failure, `issues` pinpoint the problem (`path` = index 0, key `title`). The exact message wording depends on the Zod version." },
      ],
    },
    realExample: {
      title: "services/eventService.ts — typed, validated CampusEvents service",
      language: "ts",
      code: `import { z } from "zod";

const API_BASE = "http://localhost:5229/api";

export const EventSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  imageUrl: z.string().nullable(),       // C# string?  → string | null
  startDate: z.string(),                 // C# DateTime → ISO 8601 string
  endDate: z.string(),
  location: z.string(),
  price: z.number(),
  capacity: z.number(),
  availableTickets: z.number(),
  categoryId: z.number(),
  categoryName: z.string(),
});

export type CampusEvent = z.infer<typeof EventSchema>;
export type CreateEventRequest = Omit<CampusEvent, "id" | "categoryName" | "availableTickets">;

async function request(path: string, init?: RequestInit): Promise<Response> {
  const res = await fetch(\`\${API_BASE}\${path}\`, init);
  if (!res.ok) throw new Error(\`\${init?.method ?? "GET"} \${path} failed: \${res.status}\`);
  return res;
}

export async function getEvents(signal?: AbortSignal): Promise<CampusEvent[]> {
  const res = await request("/events", { signal });
  const parsed = z.array(EventSchema).safeParse(await res.json());
  if (!parsed.success) {
    console.error("Unexpected /events payload", parsed.error.issues);
    throw new Error("The server returned events in an unexpected format.");
  }
  return parsed.data;
}

export async function createEvent(body: CreateEventRequest, token: string): Promise<CampusEvent> {
  const res = await request("/events", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: \`Bearer \${token}\` },
    body: JSON.stringify(body),
  });
  return EventSchema.parse(await res.json()); // 201 Created + EventDto
}

export async function updateEvent(id: number, body: CreateEventRequest, token: string): Promise<void> {
  await request(\`/events/\${id}\`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: \`Bearer \${token}\` },
    body: JSON.stringify(body),
  });
  // 204 No Content — no body, so no res.json()
}`,
      walkthrough: [
        { lines: "5-18", text: "The schema mirrors the C# EventDto field-for-field (Week 03 slide 14). If the DTO changes, this is the one place to update." },
        { lines: "20-21", text: "The static type is inferred from the schema; the create payload omits server-generated fields with `Omit`." },
        { lines: "23-27", text: "One helper checks `res.ok`, because fetch doesn't reject on HTTP errors." },
        { lines: "29-37", text: "`safeParse` validates the whole array; failures are logged with paths and turned into a user-friendly error the UI can show." },
        { lines: "39-46", text: "POST returns 201 with the created EventDto, so we parse it (here with `parse`, which throws on mismatch)." },
        { lines: "48-55", text: "PUT returns 204 No Content — the return type is `Promise<void>` and we must not call `res.json()`." },
      ],
    },
    mistakes: [
      {
        mistake: "Typing `imageUrl: string` when the C# property is `string?`, then calling `event.imageUrl.startsWith(...)`.",
        fix: "Map C# nullable reference types to `string | null` and handle null (`??`, conditional rendering).",
      },
      {
        mistake: "Typing dates as `Date` because the C# type is `DateTime`.",
        fix: "JSON has no date type — it arrives as an ISO string. Type it `string` and convert with `new Date(...)` (or transform in the schema).",
      },
      {
        mistake: "Believing `res.json() as Event[]` or `getJson<Event[]>()` validates the response.",
        fix: "Both are compile-time assertions. Use `schema.safeParse(json)` (or a type guard) at the boundary.",
      },
      {
        mistake: "Calling `res.json()` on a 204 No Content response from PUT/DELETE.",
        fix: "Return `Promise<void>` and skip parsing; there is no body (it would throw a JSON syntax error).",
      },
      {
        mistake: "Hand-writing separate create/update interfaces that drift from the main type.",
        fix: "Derive with `Omit`/`Partial`, or infer from Zod schemas (`z.infer`, `Schema.omit({...})`).",
      },
    ],
    debug: {
      prompt: "The events page crashes with `TypeError: Cannot read properties of null (reading 'startsWith')` for events without an image. TypeScript reported no errors. Find the root cause in the types and fix both the type and the component.",
      language: "tsx",
      buggyCode: `interface CampusEvent {
  id: number;
  title: string;
  imageUrl: string;        // from C# string? ImageUrl
}

async function getEvents(): Promise<CampusEvent[]> {
  const res = await fetch("http://localhost:5229/api/events");
  return (await res.json()) as CampusEvent[];
}

function EventImage({ event }: { event: CampusEvent }) {
  const src = event.imageUrl.startsWith("http")
    ? event.imageUrl
    : \`http://localhost:5229\${event.imageUrl}\`;
  return <img src={src} alt={event.title} />;
}`,
      hint: "What does C# `string?` become in JSON when there is no image? What did the interface claim? Why did TypeScript not catch it?",
      fixedCode: `interface CampusEvent {
  id: number;
  title: string;
  imageUrl: string | null; // C# string? → may be null in JSON
}

async function getEvents(): Promise<CampusEvent[]> {
  const res = await fetch("http://localhost:5229/api/events");
  if (!res.ok) throw new Error("Failed to fetch events: " + res.status);
  return (await res.json()) as CampusEvent[]; // still unvalidated — see Zod version above
}

function EventImage({ event }: { event: CampusEvent }) {
  if (event.imageUrl === null) {
    return <img src="/placeholder.png" alt="" />;
  }
  const src = event.imageUrl.startsWith("http")
    ? event.imageUrl
    : \`http://localhost:5229\${event.imageUrl}\`;
  return <img src={src} alt={event.title} />;
}`,
      explanation: "The C# `string?` serialises as `null` when there is no image, but the interface said `string`, and the `as` cast meant TypeScript trusted it. With the honest type `string | null`, strict mode forces the null check (narrowing), and the component renders a placeholder. A Zod schema with `.nullable()` would have caught the mismatch even if the interface had been wrong.",
    },
    challenge: {
      prompt: "Given this C# DTO, write (1) a Zod schema `BookingSchema`, (2) the inferred type `Booking`, (3) `type CreateBookingRequest = ...` containing only `eventId` and `numberOfTickets`, and (4) `getMyBookings(token)` that validates the response and throws a helpful error on mismatch.\n\n```text\npublic class BookingDto {\n  public int Id { get; set; }\n  public int EventId { get; set; }\n  public string EventTitle { get; set; }\n  public int NumberOfTickets { get; set; }\n  public decimal TotalPrice { get; set; }\n  public string Status { get; set; }   // \"Pending\" | \"Confirmed\" | \"Cancelled\"\n  public DateTime BookingDate { get; set; }\n  public string? Notes { get; set; }\n}\n```",
      starterCode: `import { z } from "zod";

const API_BASE = "http://localhost:5229/api";

// 1. BookingSchema
// 2. Booking type
// 3. CreateBookingRequest
// 4. getMyBookings`,
      language: "ts",
      hints: [
        "camelCase keys: `id`, `eventId`, `eventTitle`, `numberOfTickets`, `totalPrice`, `status`, `bookingDate`, `notes`.",
        "`status: z.enum([\"Pending\", \"Confirmed\", \"Cancelled\"])`, `notes: z.string().nullable()`, `bookingDate: z.string()`.",
        "`Pick<Booking, \"eventId\" | \"numberOfTickets\">` for the request.",
        "Endpoint: `GET /api/bookings/my-bookings` with `Authorization: Bearer <token>`.",
      ],
      solution: `import { z } from "zod";

const API_BASE = "http://localhost:5229/api";

export const BookingSchema = z.object({
  id: z.number(),
  eventId: z.number(),
  eventTitle: z.string(),
  numberOfTickets: z.number().int().positive(),
  totalPrice: z.number(),
  status: z.enum(["Pending", "Confirmed", "Cancelled"]),
  bookingDate: z.string(),          // DateTime → ISO string
  notes: z.string().nullable(),     // string? → string | null
});

export type Booking = z.infer<typeof BookingSchema>;
export type CreateBookingRequest = Pick<Booking, "eventId" | "numberOfTickets">;

export async function getMyBookings(token: string): Promise<Booking[]> {
  const res = await fetch(\`\${API_BASE}/bookings/my-bookings\`, {
    headers: { Authorization: \`Bearer \${token}\` },
  });
  if (!res.ok) throw new Error(\`Failed to load bookings: \${res.status}\`);
  const parsed = z.array(BookingSchema).safeParse(await res.json());
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    throw new Error(\`Unexpected bookings data at \${first?.path.join(".")}: \${first?.message}\`);
  }
  return parsed.data;
}`,
      explanation: "Each DTO property maps to a camelCase key with the matching Zod type: `int`/`decimal` → number, `string?` → `.nullable()`, `DateTime` → ISO string, and a status string with known values → `z.enum` (giving a literal union type). `z.infer` keeps the static type in sync; `Pick` derives the request body. `safeParse` turns a contract mismatch into a precise, debuggable error.",
    },
    examQuestions: [
      {
        question: "A C# DTO has `public string? ImageUrl { get; set; }` and `public DateTime StartDate { get; set; }`. Write the corresponding TypeScript properties and justify them.",
        answer: "`imageUrl: string | null;` — a nullable C# string is serialised as `null` when absent, and camelCase is the default JSON naming. `startDate: string;` — JSON has no date type, so `DateTime` arrives as an ISO 8601 string (Week 03 slide 14).",
        marks: 2,
      },
      {
        question: "True or False: writing `const events = (await res.json()) as Event[];` guarantees at runtime that each item has a numeric `price`.",
        answer: "**False.** Type assertions are erased at compile time; nothing is checked at runtime. Use runtime validation such as `z.array(EventSchema).safeParse(data)`.",
        marks: 1,
      },
      {
        question: "**(Mock E5)** True or False: A frontend application should treat data received from an external API as automatically trustworthy simply because the request was successful.",
        answer: "**False.** A 200 response only means the request succeeded; the data may be malformed, changed or malicious. Validate its shape (e.g. Zod), handle nulls, and never render it as raw HTML.",
        marks: 1,
      },
      {
        question: "Explain the difference between `schema.parse(data)` and `schema.safeParse(data)` in Zod, and show how to use `safeParse`'s result.",
        answer: "`parse` returns the typed data or **throws** a `ZodError`. `safeParse` never throws; it returns `{ success: true, data }` or `{ success: false, error }`. Usage: `const r = Schema.safeParse(json); if (!r.success) { console.error(r.error.issues); } else { use(r.data); }`.",
        marks: 2,
      },
      {
        question: "Write a type for the body of `POST /api/events` given the full `Event` interface, where the server generates `id`, `categoryName` and `availableTickets`.",
        answer: "`type CreateEventRequest = Omit<Event, \"id\" | \"categoryName\" | \"availableTickets\">;`",
        marks: 2,
      },
    ],
    revision: [
      "Interfaces mirror the C# DTO in camelCase; if the DTO changes, the interface must change (Week 03 slide 14).",
      "C# `string?` → `string | null`; `DateTime` → ISO `string`; `int`/`decimal` → `number`.",
      "Type services as `getEvents(): Promise<Event[]>`; components never touch raw JSON.",
      "`as Event[]` / `getJson<T>` = assertions — NO runtime validation.",
      "Zod: define schema → `z.infer<typeof Schema>` for the type → `safeParse` at the boundary.",
      "`safeParse` → `{ success, data }` or `{ success: false, error.issues }`.",
      "Payload types via `Omit`/`Pick`; 204 responses → `Promise<void>`, no `res.json()`.",
      "Mock E5: successful ≠ trustworthy — validate and never inject API strings as HTML.",
    ],
  },
];
