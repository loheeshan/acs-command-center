import type { Question } from "../types";

/** Markdown code fence helper. */
const F = "```";

export const reactQuestions: Question[] = [
  /* ---------------------------------------------------------------- */
  /* Components, JSX, props                                            */
  /* ---------------------------------------------------------------- */
  {
    id: "re-001",
    type: "mcq",
    topic: "react",
    subtopic: "JSX",
    difficulty: "beginner",
    marks: 1,
    minutes: 1,
    prompt: "A component must render a heading and a paragraph side by side without an extra wrapper `<div>`. Which `return` is valid JSX?",
    options: [
      "`return <h1>Events</h1><p>Upcoming</p>;`",
      "`return (<><h1>Events</h1><p>Upcoming</p></>);`",
      "`return \"<h1>Events</h1><p>Upcoming</p>\";`",
      "`return [<h1>Events</h1> <p>Upcoming</p>];`",
    ],
    answer: 1,
    distractorNotes: {
      0: "A JSX expression must have ONE root element; two adjacent elements is a syntax error.",
      2: "A string is rendered as literal text (escaped), not as HTML elements.",
      3: "Array elements need commas (and keys); as written it is a syntax error.",
    },
    explanation:
      "A fragment `<>...</>` groups siblings under one root without adding a DOM node.",
    lessonId: "react-components-jsx",
    source: "practice",
  },
  {
    id: "re-002",
    type: "mcq",
    topic: "react",
    subtopic: "Components",
    difficulty: "beginner",
    marks: 1,
    minutes: 1,
    prompt: `A developer writes \`function eventCard() { ... }\` and renders \`<eventCard />\`. Nothing from the component appears. Why?

${F}jsx
function eventCard() {
  return <div className="card">Jazz Night</div>;
}
export default function App() {
  return <eventCard />;
}
${F}`,
    options: [
      "Components must be arrow functions",
      "Components must be default-exported",
      "Lowercase JSX tags are treated as built-in HTML elements, so React creates an unknown `<eventcard>` element instead of calling the function",
      "`className` is not allowed in JSX",
    ],
    answer: 2,
    distractorNotes: {
      0: "Function declarations and arrow functions both work as components.",
      1: "Named and default exports both work; here the component is in the same file anyway.",
      3: "`className` is exactly how JSX sets the HTML `class` attribute.",
    },
    explanation:
      "JSX uses capitalisation to tell components from HTML tags. Rename to `EventCard` and render `<EventCard />`.",
    lessonId: "react-components-jsx",
    source: "practice",
  },
  {
    id: "re-003",
    type: "mcq",
    topic: "react",
    subtopic: "Props vs state",
    difficulty: "intermediate",
    marks: 1,
    minutes: 1,
    prompt:
      "A `QuantityPicker` child shows a `quantity` prop owned by its parent `Basket`. How should the child increase the quantity?",
    options: [
      "Write `props.quantity++` inside the child",
      "Call a callback prop such as `onChange(quantity + 1)` that the parent uses to update its own state",
      "Copy the prop into a global variable and modify that",
      "Call `useState(props.quantity)` in the child and update that copy; the parent will update automatically",
    ],
    answer: 1,
    distractorNotes: {
      0: "Props are read-only. Mutating them does not trigger a re-render and breaks one-way data flow.",
      2: "Changing a plain variable does not tell React to re-render anything.",
      3: "A local copy goes out of sync: the parent's state is never changed by updating the child's state.",
    },
    explanation:
      "Data flows down via props; changes flow up via callbacks. The state owner (`Basket`) passes a function down, and calling it updates the parent's state, which re-renders both.",
    lessonId: "react-props",
    source: "practice",
  },
  /* ---------------------------------------------------------------- */
  /* State snapshots & batching                                        */
  /* ---------------------------------------------------------------- */
  {
    id: "re-004",
    type: "mcq",
    topic: "react",
    subtopic: "State snapshot",
    difficulty: "exam",
    marks: 1,
    minutes: 2,
    prompt: `\`count\` starts at 0. After ONE click, what is logged and what does the button show?

${F}jsx
function Counter() {
  const [count, setCount] = useState(0);
  function handleClick() {
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
    console.log(count);
  }
  return <button onClick={handleClick}>{count}</button>;
}
${F}`,
    options: [
      "Logs 3, button shows 3",
      "Logs 0, button shows 3",
      "Logs 0, button shows 1",
      "Logs 1, button shows 1",
    ],
    answer: 2,
    distractorNotes: {
      0: "`count` is a constant for this render (a snapshot). Setting state does not change it inside the running handler.",
      1: "Each call computes `0 + 1` from the same snapshot, so all three queue \"set to 1\".",
      3: "`console.log(count)` reads the snapshot value 0; the new value is only visible in the next render.",
    },
    explanation:
      "During this handler `count` is 0. Each `setCount(count + 1)` queues \"replace with 1\". The log shows 0, and the next render shows 1. Use `setCount(c => c + 1)` three times to get 3.",
    lessonId: "react-rendering-snapshots",
    source: "practice",
    misconception: "setState updates the variable immediately",
  },
  {
    id: "re-005",
    type: "mcq",
    topic: "react",
    subtopic: "Updater functions",
    difficulty: "exam",
    marks: 1,
    minutes: 2,
    prompt: `\`count\` starts at 0. What does the button show after one click?

${F}jsx
function handleClick() {
  setCount(c => c + 1);
  setCount(count + 5);
  setCount(c => c * 2);
}
${F}`,
    options: ["2", "5", "12", "10"],
    answer: 3,
    distractorNotes: {
      0: "The middle call is not ignored: `setCount(count + 5)` replaces the queued value with 0 + 5 = 5.",
      1: "The last updater still runs on the result: 5 * 2 = 10.",
      2: "`count + 5` uses the render snapshot (0), not the result of the first updater, so it gives 5, not 6.",
    },
    explanation: `React processes the queue in order:
1. \`c => c + 1\`: 0 -> 1
2. \`count + 5\` (snapshot 0): replace with 5
3. \`c => c * 2\`: 5 -> 10

The next render shows **10**.`,
    lessonId: "react-rendering-snapshots",
    source: "practice",
  },
  {
    id: "re-006",
    type: "mcq",
    topic: "react",
    subtopic: "Batching",
    difficulty: "advanced",
    marks: 1,
    minutes: 2,
    prompt: `Ignoring StrictMode, how many extra times is \`"render"\` logged after the button is clicked once?

${F}jsx
function Profile() {
  const [name, setName] = useState("");
  const [age, setAge] = useState(0);
  console.log("render");
  function handleSave() {
    setName("Ana");
    setAge(20);
  }
  return <button onClick={handleSave}>{name} {age}</button>;
}
${F}`,
    options: ["0", "1", "2", "It depends on the order of the two calls"],
    answer: 1,
    distractorNotes: {
      0: "The state values change, so React must re-render once to show them.",
      2: "React batches state updates made in the same event: both are applied in a single re-render.",
      3: "Order does not change the number of renders; all updates in the handler are batched.",
    },
    explanation:
      "React (18+) automatically batches updates from the same event handler (and from promises/timeouts), then re-renders once with both new values.",
    lessonId: "react-rendering-snapshots",
    source: "practice",
  },
  {
    id: "re-007",
    type: "mcq",
    topic: "react",
    subtopic: "Immutable updates",
    difficulty: "intermediate",
    marks: 1,
    minutes: 1,
    prompt: "Which update correctly adds `newTodo` to the `todos` state array so React re-renders?",
    options: [
      "`todos.push(newTodo); setTodos(todos);`",
      "`setTodos(todos.concat);`",
      "`setTodos([...todos, newTodo]);`",
      "`todos[todos.length] = newTodo;`",
    ],
    answer: 2,
    distractorNotes: {
      0: "`push` mutates the existing array; passing the same reference means `Object.is` sees no change and React can skip the re-render.",
      1: "This passes the `concat` function itself as the new state, not an array.",
      3: "Direct mutation without calling the setter never schedules a render.",
    },
    explanation:
      "State must be treated as immutable. Create a new array (spread, `concat(newTodo)`, `map`, `filter`) so React sees a new reference.",
    lessonId: "react-state-events",
    source: "practice",
    misconception: "mutating state then calling setState works",
  },
  {
    id: "re-008",
    type: "mcq",
    topic: "react",
    subtopic: "Immutable updates",
    difficulty: "advanced",
    marks: 1,
    minutes: 2,
    prompt: `Which update changes only the city and keeps everything else, without mutating state?

${F}jsx
const [user, setUser] = useState({
  name: "Ana",
  address: { city: "Leeds", postcode: "LS1" },
});
${F}`,
    options: [
      "`setUser({ ...user, address: { city: \"York\" } })`",
      "`user.address.city = \"York\"; setUser({ ...user })`",
      "`setUser({ address: { ...user.address, city: \"York\" } })`",
      "`setUser({ ...user, address: { ...user.address, city: \"York\" } })`",
    ],
    answer: 3,
    distractorNotes: {
      0: "This replaces `address` with an object that has no `postcode`.",
      1: "This mutates the existing nested `address` object, which can break memoised children and history of previous renders.",
      2: "`useState` setters REPLACE the state; `name` would be lost.",
    },
    explanation:
      "Copy each level you change: spread `user`, then spread `user.address` and override `city`.",
    lessonId: "react-state-events",
    source: "practice",
  },
  /* ---------------------------------------------------------------- */
  /* Lists, keys, conditional rendering                                */
  /* ---------------------------------------------------------------- */
  {
    id: "re-009",
    type: "mcq",
    topic: "react",
    subtopic: "Keys",
    difficulty: "intermediate",
    marks: 1,
    minutes: 2,
    prompt:
      "A list of events with editable inputs is rendered with `key={index}`. When a new event is inserted at the TOP of the list, the typed input values appear next to the wrong events. What is the best fix?",
    options: [
      "Use `key={event.id}`",
      "Use `key={Math.random()}`",
      "Remove the key prop entirely",
      "Wrap the list in `React.memo`",
    ],
    answer: 0,
    distractorNotes: {
      1: "A new random key every render makes React destroy and recreate every item (losing input state and focus).",
      2: "Without a key React falls back to index-based matching, which is the same bug plus a warning.",
      3: "Memoisation does not change how React matches old and new items; keys do.",
    },
    explanation:
      "Keys tell React which item is which between renders. Indexes shift when items are inserted, so state follows the position instead of the item. A stable, unique id from the data keeps identity correct.",
    lessonId: "react-lists-keys",
    source: "practice",
    misconception: "index keys are always fine",
  },
  {
    id: "re-010",
    type: "mcq",
    topic: "react",
    subtopic: "Conditional rendering",
    difficulty: "exam",
    marks: 1,
    minutes: 1,
    prompt: `\`bookings\` is an empty array. What appears on the page?

${F}jsx
<div>
  {bookings.length && <BookingList items={bookings} />}
</div>
${F}`,
    options: ["Nothing", "The text \"false\"", "The digit 0", "An empty BookingList"],
    answer: 2,
    distractorNotes: {
      0: "`&&` returns its left operand when it is falsy. That value is the number 0, and React renders numbers.",
      1: "The left side is a number, not a boolean; and React renders nothing for `false`, not the text \"false\".",
      3: "`&&` short-circuits, so `BookingList` is never created.",
    },
    explanation:
      "`0 && x` evaluates to `0`, which React renders as text. Use a boolean: `bookings.length > 0 && ...` or a ternary.",
    lessonId: "react-conditional-rendering",
    source: "practice",
    misconception: "&& always renders nothing when false",
  },
  /* ---------------------------------------------------------------- */
  /* Effects                                                           */
  /* ---------------------------------------------------------------- */
  {
    id: "re-011",
    type: "mcq",
    topic: "react",
    subtopic: "useEffect dependencies",
    difficulty: "beginner",
    marks: 1,
    minutes: 1,
    prompt: `When does this effect run?

${F}jsx
useEffect(() => {
  loadBookings(userId);
}, [userId]);
${F}`,
    options: [
      "Before the first render only",
      "After every render",
      "After the first render, and again after any render where `userId` changed",
      "Only when the component unmounts",
    ],
    answer: 2,
    distractorNotes: {
      0: "Effects run AFTER React has committed the render to the screen, never before.",
      1: "That is what happens with NO dependency array.",
      3: "Code that runs on unmount goes in the cleanup function returned from the effect.",
    },
    explanation:
      "React compares each dependency with `Object.is` after every render and re-runs the effect only when one changed. `[]` means \"after mount only\".",
    lessonId: "react-useeffect",
    source: "practice",
  },
  {
    id: "re-012",
    type: "mcq",
    topic: "react",
    subtopic: "Effect cleanup",
    difficulty: "advanced",
    marks: 1,
    minutes: 2,
    prompt: `The component mounts with \`roomId = 1\` (no StrictMode). Then \`roomId\` changes to 2. Which lines are logged after the change?

${F}jsx
useEffect(() => {
  console.log("connect", roomId);
  return () => console.log("disconnect", roomId);
}, [roomId]);
${F}`,
    options: [
      "connect 2",
      "disconnect 2, connect 2",
      "connect 2, disconnect 1",
      "disconnect 1, connect 2",
    ],
    answer: 3,
    distractorNotes: {
      0: "Before re-running an effect, React runs the previous effect's cleanup.",
      1: "The cleanup closes over the roomId of the render that created it, which was 1.",
      2: "Cleanup runs BEFORE the new effect, not after it.",
    },
    explanation:
      "On a dependency change React first calls the old cleanup (with the old closure, roomId 1), then runs the new effect (roomId 2).",
    lessonId: "react-useeffect",
    source: "practice",
  },
  {
    id: "re-013",
    type: "mcq",
    topic: "react",
    subtopic: "StrictMode",
    difficulty: "exam",
    marks: 1,
    minutes: 2,
    prompt: `In a React 19 development build wrapped in \`<StrictMode>\`, the component from the previous scenario mounts with \`roomId = 1\`. What is logged?

${F}jsx
useEffect(() => {
  console.log("connect", roomId);
  return () => console.log("disconnect", roomId);
}, [roomId]);
${F}`,
    options: [
      "connect 1",
      "connect 1, disconnect 1, connect 1",
      "connect 1, connect 1",
      "disconnect 1, connect 1",
    ],
    answer: 1,
    distractorNotes: {
      0: "That is production behaviour. StrictMode adds an extra setup + cleanup cycle in development.",
      2: "StrictMode runs the cleanup between the two setups, simulating unmount and remount.",
      3: "Cleanup cannot run before any setup has happened.",
    },
    explanation:
      "In development StrictMode mounts, simulates an unmount (running cleanup), then mounts again, to expose effects whose cleanup is missing or wrong. It does not do this in production.",
    lessonId: "react-strictmode",
    source: "practice",
    misconception: "StrictMode double effects are a bug",
  },
  {
    id: "re-014",
    type: "mcq",
    topic: "react",
    subtopic: "useEffect dependencies",
    difficulty: "exam",
    marks: 1,
    minutes: 3,
    prompt: `This component keeps sending requests in an endless loop. Why?

${F}jsx
function Results({ page }) {
  const [data, setData] = useState([]);
  const options = { page, size: 10 };

  useEffect(() => {
    fetchResults(options).then(setData);
  }, [options]);

  return <List items={data} />;
}
${F}`,
    options: [
      "`fetchResults` must be awaited with `await` inside the effect",
      "`options` is a new object on every render, so the dependency always changes; each fetch sets new data, re-renders, and triggers the effect again",
      "`setData` cannot be passed directly to `.then`",
      "`page` is missing from the props",
    ],
    answer: 1,
    distractorNotes: {
      0: "Using `.then` is fine; the loop is caused by the dependency, not the promise style.",
      2: "`.then(setData)` passes the setter as the callback, which is valid.",
      3: "`page` is destructured from props correctly.",
    },
    explanation:
      "Dependencies are compared with `Object.is`. A freshly created object is never equal to the previous one. Depend on the primitive `page` and build the options object inside the effect.",
    lessonId: "react-useeffect",
    source: "practice",
    misconception: "objects in deps are compared by content",
  },
  /* ---------------------------------------------------------------- */
  /* Refs, context, hooks rules, custom hooks                          */
  /* ---------------------------------------------------------------- */
  {
    id: "re-015",
    type: "mcq",
    topic: "react",
    subtopic: "useRef vs useState",
    difficulty: "intermediate",
    marks: 1,
    minutes: 1,
    prompt:
      "A stopwatch must remember the id returned by `setInterval` so it can be cleared later. The id is never shown on screen. Which is the best choice?",
    options: [
      "`useState`, because every value a component remembers must be state",
      "A module-level `let` variable outside the component",
      "`useMemo`",
      "`useRef`, because it persists between renders without causing a re-render when changed",
    ],
    answer: 3,
    distractorNotes: {
      0: "Storing it in state would trigger an unnecessary re-render whenever it changes.",
      1: "A module variable is shared by every instance of the component, which breaks with two stopwatches.",
      2: "`useMemo` caches a computed value; it is not meant for mutable values you set from handlers.",
    },
    explanation:
      "`useRef` returns a stable `{ current }` box per component instance. Changing `ref.current` does not re-render, which is perfect for interval ids, DOM nodes and other non-visual values.",
    lessonId: "react-useref-context-reducer",
    source: "practice",
  },
  {
    id: "re-016",
    type: "mcq",
    topic: "react",
    subtopic: "Context",
    difficulty: "intermediate",
    marks: 1,
    minutes: 1,
    prompt: `What does \`Toolbar\` render?

${F}jsx
const ThemeContext = createContext("light");

function Toolbar() {
  const theme = useContext(ThemeContext);
  return <p>{theme}</p>;
}

export default function App() {
  return <Toolbar />;
}
${F}`,
    options: ["light", "undefined", "An error: useContext must be inside a Provider", "Nothing"],
    answer: 0,
    distractorNotes: {
      1: "`undefined` would only appear if `createContext()` were called with no default value.",
      2: "React does not throw; it falls back to the default value (custom hooks may add such a check themselves).",
      3: "The default value \"light\" is rendered as text.",
    },
    explanation:
      "If no matching Provider exists above the component, `useContext` returns the default value passed to `createContext`.",
    lessonId: "react-useref-context-reducer",
    source: "practice",
  },
  {
    id: "re-017",
    type: "mcq",
    topic: "react",
    subtopic: "Rules of Hooks",
    difficulty: "intermediate",
    marks: 1,
    minutes: 1,
    prompt: "Which snippet breaks the Rules of Hooks?",
    options: [
      "`const [open, setOpen] = useState(false);` at the top of a component",
      "`if (isAdmin) { const [filter, setFilter] = useState(\"\"); }`",
      "`const user = useAuth();` inside a custom Hook `useIsAdmin`",
      "`useEffect(() => { if (isAdmin) loadAdminData(); }, [isAdmin]);`",
    ],
    answer: 1,
    distractorNotes: {
      0: "Calling a Hook unconditionally at the top level is exactly the rule.",
      2: "Custom Hooks may call other Hooks.",
      3: "The condition is INSIDE the effect, which is allowed; the Hook itself is always called.",
    },
    explanation:
      "Hooks must be called in the same order on every render, so they cannot be inside conditions, loops or nested functions. React tracks Hook state by call order.",
    lessonId: "react-custom-hooks",
    source: "practice",
  },
  {
    id: "re-018",
    type: "mcq",
    topic: "react",
    subtopic: "Custom hooks",
    difficulty: "advanced",
    marks: 1,
    minutes: 2,
    prompt: `\`Sidebar\` and \`Header\` both call this hook. If the user toggles the sidebar, what happens to the header's \`open\` value?

${F}jsx
function useToggle(initial = false) {
  const [open, setOpen] = useState(initial);
  const toggle = () => setOpen(o => !o);
  return [open, toggle];
}
${F}`,
    options: [
      "It also toggles, because both use the same Hook",
      "It is unaffected: each call to a custom Hook has its own independent state",
      "It throws, because a Hook can only be used by one component",
      "It toggles only if both components are siblings",
    ],
    answer: 1,
    distractorNotes: {
      0: "Custom Hooks share LOGIC, not state. Use context or a store (e.g. Zustand) to share state.",
      2: "Any number of components can call the same custom Hook.",
      3: "Component position does not make Hook state shared.",
    },
    explanation:
      "Each component calling `useToggle` gets its own `useState` slot. To share the value, lift it up, use context, or use a store.",
    lessonId: "react-custom-hooks",
    source: "practice",
    misconception: "custom hooks share state",
  },
  /* ---------------------------------------------------------------- */
  /* True / False                                                      */
  /* ---------------------------------------------------------------- */
  {
    id: "re-019",
    type: "tf",
    topic: "react",
    subtopic: "State snapshot",
    difficulty: "beginner",
    marks: 1,
    minutes: 1,
    prompt: "After `setCount(5)` runs inside an event handler, the `count` variable equals 5 on the very next line of that handler.",
    answer: false,
    explanation:
      "Setting state schedules a re-render. In the current handler `count` still holds the snapshot from this render; the new value appears in the next render.",
    lessonId: "react-rendering-snapshots",
    source: "practice",
    misconception: "setState is synchronous",
  },
  {
    id: "re-020",
    type: "tf",
    topic: "react",
    subtopic: "Custom hooks",
    difficulty: "beginner",
    marks: 1,
    minutes: 1,
    prompt: "A custom Hook's name should start with `use` so React's tooling can recognise it as a Hook and check the Rules of Hooks inside it.",
    answer: true,
    explanation:
      "The `use` prefix is the convention that lets the ESLint plugin (and readers) know the function calls Hooks and must obey the Rules of Hooks.",
    lessonId: "react-custom-hooks",
    source: "practice",
  },
  {
    id: "re-021",
    type: "tf",
    topic: "react",
    subtopic: "Keys",
    difficulty: "intermediate",
    marks: 1,
    minutes: 1,
    prompt: "Keys must be unique among siblings in the same list, but do not need to be unique across the whole application.",
    answer: true,
    explanation: "React only compares keys within one list of siblings. Two different lists can reuse the same ids.",
    lessonId: "react-lists-keys",
    source: "practice",
  },
  {
    id: "re-022",
    type: "tf",
    topic: "react",
    subtopic: "Render vs commit",
    difficulty: "advanced",
    marks: 1,
    minutes: 1,
    prompt: "Every time a component re-renders, React replaces all of that component's DOM nodes.",
    answer: false,
    explanation:
      "Rendering produces a new description of the UI. React compares it with the previous one and commits only the differences; if nothing changed, the DOM is not touched.",
    lessonId: "react-rendering-snapshots",
    source: "practice",
    misconception: "re-render means DOM rewrite",
  },
  {
    id: "re-023",
    type: "tf",
    topic: "react",
    subtopic: "StrictMode",
    difficulty: "intermediate",
    marks: 1,
    minutes: 1,
    prompt: "StrictMode's double-invocation of effects also happens in the production build.",
    answer: false,
    explanation:
      "The extra render/effect cycles are development-only checks. Production builds run each effect once per mount/dependency change.",
    lessonId: "react-strictmode",
    source: "practice",
  },
  {
    id: "re-024",
    type: "tf",
    topic: "react",
    subtopic: "useRef",
    difficulty: "intermediate",
    marks: 1,
    minutes: 1,
    prompt: "Changing `renderCount.current += 1` inside a click handler causes the component to re-render.",
    answer: false,
    explanation:
      "Refs are mutable boxes that React does not track. Only state setters (or a parent re-render) trigger re-renders.",
    lessonId: "react-useref-context-reducer",
    source: "practice",
  },
  {
    id: "re-025",
    type: "tf",
    topic: "react",
    subtopic: "Props",
    difficulty: "beginner",
    marks: 1,
    minutes: 1,
    prompt: "Props flow from parent to child, and a child component should treat the props it receives as read-only.",
    answer: true,
    explanation:
      "React uses one-way data flow. A child that needs to change data calls a callback prop so the owner updates its state.",
    lessonId: "react-props",
    source: "practice",
  },
  /* ---------------------------------------------------------------- */
  /* Short answers                                                     */
  /* ---------------------------------------------------------------- */
  {
    id: "re-026",
    type: "short",
    topic: "react",
    subtopic: "Props vs state",
    difficulty: "beginner",
    marks: 3,
    minutes: 4,
    prompt: "Explain the difference between props and state in React, giving one example of each in an event-booking page.",
    rubric: [
      { criterion: "Props are inputs passed from a parent; read-only for the receiving component", marks: 1 },
      { criterion: "State is data owned and updated by the component itself (via a setter) and triggers re-render", marks: 1 },
      { criterion: "Sensible example of each (e.g. `event` passed to `EventCard` as a prop; `selectedSeats` held in state)", marks: 1 },
    ],
    modelAnswer:
      "Props are values a parent passes into a child, like function arguments; the child must not modify them. State is memory owned by a component, created with `useState` and changed only through its setter, which schedules a re-render. Example: `EventList` passes each `event` object to `<EventCard event={event} />` as a prop; inside a `BookingForm` the number of tickets the user has chosen is state (`const [tickets, setTickets] = useState(1)`).",
    explanation: "One component's state is often another component's props.",
    lessonId: "react-props",
    source: "practice",
  },
  {
    id: "re-027",
    type: "short",
    topic: "react",
    subtopic: "Effect cleanup",
    difficulty: "intermediate",
    marks: 3,
    minutes: 4,
    prompt:
      "Why might a `useEffect` need a cleanup function? Give a concrete example and say when React calls the cleanup.",
    rubric: [
      { criterion: "Cleanup undoes/stops side effects (subscriptions, timers, listeners, in-flight requests) to avoid leaks or stale updates", marks: 1 },
      { criterion: "Concrete example, e.g. `clearInterval`, `removeEventListener`, `controller.abort()`", marks: 1 },
      { criterion: "Called before the effect re-runs (dependency change) and on unmount (and in StrictMode dev after the first mount)", marks: 1 },
    ],
    modelAnswer:
      "Effects that start something ongoing must stop it, otherwise timers keep running, listeners pile up, or a late fetch response updates state for a component that has moved on. Example: an effect that adds `window.addEventListener(\"resize\", onResize)` returns `() => window.removeEventListener(\"resize\", onResize)`; a fetch effect creates an `AbortController` and returns `() => controller.abort()`. React calls the cleanup before running the effect again after a dependency change, when the component unmounts, and once extra in development StrictMode.",
    explanation: "The setup/cleanup pair should be symmetrical: whatever setup starts, cleanup stops.",
    lessonId: "react-useeffect",
    source: "practice",
  },
  {
    id: "re-028",
    type: "short",
    topic: "react",
    subtopic: "Context",
    difficulty: "advanced",
    marks: 3,
    minutes: 4,
    prompt: "What problem does React Context solve, and what is one drawback of putting frequently changing values into a single context?",
    rubric: [
      { criterion: "Avoids prop drilling: passes data deep into the tree without threading props through every level", marks: 1 },
      { criterion: "Consumers read it via `useContext` from the nearest Provider", marks: 1 },
      { criterion: "Drawback: every consumer re-renders when the context value changes (even if it uses only part of it); fix by splitting contexts/memoising or using a store with selectors", marks: 1 },
    ],
    modelAnswer:
      "Context lets a Provider make a value (theme, current user, locale) available to any component below it, which reads it with `useContext`, so you do not have to pass props through intermediate components that do not use them (prop drilling). Drawback: when the Provider's value changes, every component consuming that context re-renders, even if it only uses one field. For fast-changing state, split the context, memoise the value, or use a store like Zustand whose selectors re-render only on the selected slice.",
    explanation: "Context is a transport mechanism, not a full state-management solution.",
    lessonId: "react-useref-context-reducer",
    source: "practice",
  },
  /* ---------------------------------------------------------------- */
  /* Code questions                                                    */
  /* ---------------------------------------------------------------- */
  {
    id: "re-029",
    type: "code",
    topic: "react",
    subtopic: "Find the errors",
    difficulty: "exam",
    marks: 5,
    minutes: 8,
    language: "jsx",
    prompt: `This component has **three** bugs. Identify each one and rewrite the component correctly.

${F}jsx
function TodoList() {
  const [todos, setTodos] = useState([
    { id: 1, text: "Revise hooks", done: false },
    { id: 2, text: "Mock exam", done: false },
  ]);

  function toggle(id) {
    const todo = todos.find(t => t.id === id);
    todo.done = !todo.done;
    setTodos(todos);
  }

  return (
    <ul>
      {todos.map(t => (
        <li onClick={toggle(t.id)}>
          {t.text} {t.done && "(done)"}
        </li>
      ))}
    </ul>
  );
}
${F}`,
    rubric: [
      { criterion: "Bug 1: state is mutated and the same array reference is passed, so React may not re-render", marks: 1 },
      { criterion: "Fix: immutable update with `map` returning a new object for the toggled item", marks: 1 },
      { criterion: "Bug 2: `onClick={toggle(t.id)}` calls the function during render instead of passing a handler", marks: 1 },
      { criterion: "Fix: `onClick={() => toggle(t.id)}`", marks: 1 },
      { criterion: "Bug 3: missing `key` on list items; fix `key={t.id}`", marks: 1 },
    ],
    modelAnswer: `${F}jsx
function TodoList() {
  const [todos, setTodos] = useState([
    { id: 1, text: "Revise hooks", done: false },
    { id: 2, text: "Mock exam", done: false },
  ]);

  function toggle(id) {
    setTodos(prev =>
      prev.map(t => (t.id === id ? { ...t, done: !t.done } : t))
    );
  }

  return (
    <ul>
      {todos.map(t => (
        <li key={t.id} onClick={() => toggle(t.id)}>
          {t.text} {t.done && "(done)"}
        </li>
      ))}
    </ul>
  );
}
${F}`,
    explanation:
      "Immutable updates give React a new reference to detect; event props need a function, not the result of calling one; list items need stable keys. (`t.done && \"(done)\"` is safe here because `done` is a boolean, not a number.)",
    lessonId: "react-state-events",
    source: "practice",
  },
  {
    id: "re-030",
    type: "code",
    topic: "react",
    subtopic: "Custom hooks + fetch",
    difficulty: "exam",
    marks: 6,
    minutes: 10,
    language: "tsx",
    prompt:
      "Write a custom Hook `useEvents()` that fetches `http://localhost:5229/api/events` when the component mounts and returns `{ events, loading, error }`. Requirements: treat non-2xx responses as errors, cancel the request with `AbortController` when the component unmounts, and do not report an abort as an error. Use TypeScript with an `EventDto` type having at least `id: number` and `title: string`.",
    rubric: [
      { criterion: "Typed state: `useState<EventDto[]>([])`, loading boolean, error `string | null`", marks: 1 },
      { criterion: "Fetch inside `useEffect` with `[]` dependencies", marks: 1 },
      { criterion: "Checks `response.ok` and throws/sets an error for HTTP failures", marks: 1 },
      { criterion: "Creates an `AbortController`, passes `signal` to fetch, aborts in cleanup", marks: 1 },
      { criterion: "Ignores `AbortError` instead of setting error state", marks: 1 },
      { criterion: "Sets loading false when finished and returns `{ events, loading, error }`", marks: 1 },
    ],
    modelAnswer: `${F}tsx
import { useEffect, useState } from "react";

interface EventDto {
  id: number;
  title: string;
}

export function useEvents() {
  const [events, setEvents] = useState<EventDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        const res = await fetch("http://localhost:5229/api/events", {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
        const data: EventDto[] = await res.json();
        setEvents(data);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, []);

  return { events, loading, error };
}
${F}`,
    explanation:
      "The effect runs after mount; its cleanup aborts the request on unmount (and in the StrictMode dev re-mount), so a stale response never updates state. Checking `res.ok` is needed because `fetch` does not reject on HTTP errors.",
    lessonId: "react-custom-hooks",
    source: "practice",
  },
  {
    id: "re-031",
    type: "code",
    topic: "react",
    subtopic: "Controlled inputs",
    difficulty: "intermediate",
    marks: 4,
    minutes: 6,
    language: "tsx",
    prompt:
      "Write a `ReviewBox` component with a controlled `<textarea>` limited to 200 characters. Below it, show `\"N characters left\"`, and disable a Submit button when the text is empty (after trimming).",
    rubric: [
      { criterion: "`useState<string>(\"\")` holding the text", marks: 1 },
      { criterion: "Controlled textarea: `value={text}` and `onChange` updating state (with `maxLength` or slicing to 200)", marks: 1 },
      { criterion: "Derived remaining count `200 - text.length` rendered (not stored in separate state)", marks: 1 },
      { criterion: "Button `disabled={text.trim() === \"\"}`", marks: 1 },
    ],
    modelAnswer: `${F}tsx
import { useState } from "react";

const MAX = 200;

export function ReviewBox() {
  const [text, setText] = useState("");
  const remaining = MAX - text.length;

  return (
    <form onSubmit={e => e.preventDefault()}>
      <label htmlFor="review">Your review</label>
      <textarea
        id="review"
        value={text}
        maxLength={MAX}
        onChange={e => setText(e.target.value)}
      />
      <p>{remaining} characters left</p>
      <button type="submit" disabled={text.trim() === ""}>
        Submit
      </button>
    </form>
  );
}
${F}`,
    explanation:
      "A controlled input's value comes from state. The remaining count is derived during render, so it never gets out of sync with the text.",
    lessonId: "react-state-events",
    source: "practice",
  },
];
