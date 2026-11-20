import type { Question } from "../types";

/** Markdown code fence helper. */
const F = "```";

export const typescriptQuestions: Question[] = [
  {
    id: "ts-001",
    type: "mcq",
    topic: "typescript",
    subtopic: "interface vs type",
    difficulty: "beginner",
    marks: 1,
    minutes: 1,
    prompt: "A booking can only have the status `\"pending\"`, `\"confirmed\"` or `\"cancelled\"`. Which declaration compiles?",
    options: [
      "`interface BookingStatus = \"pending\" | \"confirmed\" | \"cancelled\";`",
      "`type BookingStatus { \"pending\" | \"confirmed\" | \"cancelled\" }`",
      "`type BookingStatus = \"pending\" | \"confirmed\" | \"cancelled\";`",
      "`enum type BookingStatus = \"pending\" | \"confirmed\" | \"cancelled\";`",
    ],
    answer: 2,
    distractorNotes: {
      0: "An interface describes an object shape with `{ ... }` and cannot be assigned a union with `=`.",
      1: "A type alias needs `=`; braces alone are interface syntax.",
      3: "`enum type` is not valid syntax. An `enum` is a separate construct with its own syntax.",
    },
    explanation:
      "Unions of literal types can only be named with a `type` alias. Interfaces describe object shapes (and can be extended or merged).",
    lessonId: "ts-basics-interfaces",
    source: "practice",
  },
  {
    id: "ts-002",
    type: "mcq",
    topic: "typescript",
    subtopic: "Optional properties",
    difficulty: "beginner",
    marks: 1,
    minutes: 1,
    prompt: `What is the type of \`e.imageUrl\` inside \`show\` (with \`strict\` enabled)?

${F}ts
interface CampusEvent {
  title: string;
  imageUrl?: string;
}
function show(e: CampusEvent) {
  return e.imageUrl;
}
${F}`,
    options: ["`string`", "`string | undefined`", "`string | null`", "`any`"],
    answer: 1,
    distractorNotes: {
      0: "The `?` means the property may be absent, so reading it can produce `undefined`.",
      2: "Optional properties add `undefined`, not `null`. A nullable API field would need `string | null` explicitly.",
      3: "Strict TypeScript never silently widens a declared property to `any`.",
    },
    explanation:
      "`imageUrl?: string` means the key may be missing, so its read type is `string | undefined`. You must narrow (e.g. `if (e.imageUrl)`) before using string methods.",
    lessonId: "ts-basics-interfaces",
    source: "practice",
  },
  {
    id: "ts-003",
    type: "mcq",
    topic: "typescript",
    subtopic: "readonly",
    difficulty: "intermediate",
    marks: 1,
    minutes: 2,
    prompt: `Which lines produce compile errors?

${F}ts
interface Booking {
  readonly id: number;
  seats: number;
}
const b: Booking = { id: 1, seats: 2 };
b.seats = 3;            // line A
b.id = 2;               // line B
const ids: readonly number[] = [1, 2];
ids.push(3);            // line C
${F}`,
    options: [
      "B only",
      "A and B",
      "None - `readonly` is only checked at runtime",
      "B and C",
    ],
    answer: 3,
    distractorNotes: {
      0: "`readonly number[]` has no `push` method in its type, so line C is also an error.",
      1: "`seats` is not readonly, so line A is fine (and `const` does not freeze object properties).",
      2: "`readonly` is a COMPILE-TIME check only; it does nothing at runtime, but the compiler reports these errors.",
    },
    explanation:
      "Assigning to a `readonly` property (B) and calling a mutating method on a `readonly` array (C) are compile errors. Both checks disappear in the emitted JavaScript.",
    lessonId: "ts-basics-interfaces",
    source: "practice",
  },
  {
    id: "ts-004",
    type: "mcq",
    topic: "typescript",
    subtopic: "Intersection types",
    difficulty: "intermediate",
    marks: 1,
    minutes: 1,
    prompt: `Which value can be assigned to \`AdminUser\`?

${F}ts
type User = { id: number; email: string };
type Admin = { permissions: string[] };
type AdminUser = User & Admin;
${F}`,
    options: [
      "`{ id: 1, email: \"a@b.com\" }`",
      "`{ id: 1, email: \"a@b.com\", permissions: [\"events:write\"] }`",
      "`{ permissions: [\"events:write\"] }`",
      "Either of the first two, because `&` means \"one or the other\"",
    ],
    answer: 1,
    distractorNotes: {
      0: "This is missing `permissions`, which `Admin` requires.",
      2: "This is missing `id` and `email`, which `User` requires.",
      3: "\"One or the other\" is a union (`|`). An intersection (`&`) needs ALL properties of both types.",
    },
    explanation:
      "An intersection `A & B` combines the members of both types, so the value must satisfy `User` AND `Admin`.",
    lessonId: "ts-unions-narrowing",
    source: "practice",
    misconception: "& means either type",
  },
  {
    id: "ts-005",
    type: "mcq",
    topic: "typescript",
    subtopic: "Narrowing",
    difficulty: "intermediate",
    marks: 1,
    minutes: 2,
    prompt: `This function does not compile. Which change fixes it while keeping the parameter type?

${F}ts
function formatPrice(price: string | number): string {
  return price.toFixed(2);
}
${F}`,
    options: [
      "Add `typeof price === \"number\" ? price.toFixed(2) : Number(price).toFixed(2)`",
      "Change the return type to `any`",
      "Add `// @ts-ignore`, because the runtime value is always a number",
      "Use `price instanceof number` to narrow",
    ],
    answer: 0,
    distractorNotes: {
      1: "The error is on `price.toFixed`, not on the return type. `toFixed` does not exist on `string`.",
      2: "Suppressing the error hides a real bug: a string at runtime has no `toFixed` and would throw.",
      3: "`instanceof` works with classes/constructors, not primitive type names; primitives are narrowed with `typeof`.",
    },
    explanation:
      "On a union you can only use members common to all types. A `typeof` check narrows `price` to `number` in that branch, so `toFixed` is allowed.",
    lessonId: "ts-unions-narrowing",
    source: "practice",
  },
  {
    id: "ts-006",
    type: "mcq",
    topic: "typescript",
    subtopic: "Discriminated unions",
    difficulty: "advanced",
    marks: 1,
    minutes: 2,
    prompt: `What is the type of \`r\` on the final \`return\` line?

${F}ts
type Result =
  | { status: "success"; data: string[] }
  | { status: "error"; message: string };

function describe(r: Result) {
  if (r.status === "error") {
    return r.message;
  }
  return r.data.length;
}
${F}`,
    options: [
      "`Result`",
      "`{ status: \"error\"; message: string }`",
      "`{ status: \"success\"; data: string[] }`",
      "`never`",
    ],
    answer: 2,
    distractorNotes: {
      0: "The early return removes the `error` member, so TypeScript narrows the remaining type.",
      1: "That member was handled (and returned from) inside the `if`.",
      3: "`never` would only appear if every member had already been eliminated.",
    },
    explanation:
      "`status` is a discriminant (a literal-typed property shared by every member). After the `error` branch returns, control-flow analysis narrows `r` to the `success` member, so `r.data` is allowed.",
    lessonId: "ts-unions-narrowing",
    source: "practice",
  },
  {
    id: "ts-007",
    type: "mcq",
    topic: "typescript",
    subtopic: "Literal types",
    difficulty: "intermediate",
    marks: 1,
    minutes: 1,
    prompt: `What types does TypeScript infer?

${F}ts
let methodA = "GET";
const methodB = "GET";
${F}`,
    options: [
      "`methodA: \"GET\"`, `methodB: \"GET\"`",
      "`methodA: string`, `methodB: string`",
      "`methodA: \"GET\"`, `methodB: string`",
      "`methodA: string`, `methodB: \"GET\"`",
    ],
    answer: 3,
    distractorNotes: {
      0: "A `let` can be reassigned later, so TypeScript widens its literal to `string`.",
      1: "A `const` primitive can never change, so it keeps the narrow literal type `\"GET\"`.",
      2: "This is reversed: `const` keeps the literal, `let` widens.",
    },
    explanation:
      "Literal widening: `let` declarations widen `\"GET\"` to `string`; `const` declarations keep the literal type. This matters when passing values to parameters typed as unions like `\"GET\" | \"POST\"`.",
    lessonId: "ts-unions-narrowing",
    source: "practice",
  },
  {
    id: "ts-008",
    type: "mcq",
    topic: "typescript",
    subtopic: "Generics",
    difficulty: "intermediate",
    marks: 1,
    minutes: 1,
    prompt: `What is the inferred type of \`x\`?

${F}ts
function first<T>(items: T[]): T | undefined {
  return items[0];
}
const x = first([10, 20, 30]);
${F}`,
    options: ["`number | undefined`", "`T | undefined`", "`any`", "`number[]`"],
    answer: 0,
    distractorNotes: {
      1: "`T` is a placeholder; at the call site it is inferred from the argument as `number`.",
      2: "Generics preserve type information; they are the type-safe alternative to `any`.",
      3: "The function returns one element (or undefined), not the array.",
    },
    explanation:
      "TypeScript infers `T = number` from `[10, 20, 30]`, so the return type `T | undefined` becomes `number | undefined`.",
    lessonId: "ts-generics-utility",
    source: "practice",
  },
  {
    id: "ts-009",
    type: "mcq",
    topic: "typescript",
    subtopic: "Utility types",
    difficulty: "advanced",
    marks: 1,
    minutes: 2,
    prompt: `Which object literal can be assigned to \`EventUpdate\`?

${F}ts
interface EventDto {
  id: number;
  title: string;
  price: number;
}
type EventUpdate = Partial<Omit<EventDto, "id">>;
${F}`,
    options: [
      "`{ id: 5, title: \"New\" }`",
      "`{ title: 42 }`",
      "`{ title: \"New\", category: \"Music\" }`",
      "`{}`",
    ],
    answer: 3,
    distractorNotes: {
      0: "`Omit` removed `id`, so an object literal with `id` is an excess-property error.",
      1: "`Partial` makes properties optional but keeps their types; `title` must still be a string if present.",
      2: "`category` is not a property of `EventDto`, so it is rejected as an excess property.",
    },
    explanation:
      "`Omit<EventDto, \"id\">` gives `{ title: string; price: number }`; `Partial` makes both optional: `{ title?: string; price?: number }`. An empty object is valid.",
    lessonId: "ts-generics-utility",
    source: "practice",
  },
  {
    id: "ts-010",
    type: "mcq",
    topic: "typescript",
    subtopic: "Record",
    difficulty: "intermediate",
    marks: 1,
    minutes: 1,
    prompt: `Why does this fail to compile?

${F}ts
type Role = "USER" | "ADMIN";
const homePage: Record<Role, string> = { USER: "/events" };
${F}`,
    options: [
      "`Record` keys must be numbers",
      "Property `ADMIN` is missing",
      "Role values must be lowercase",
      "`Record` can only hold objects, not strings",
    ],
    answer: 1,
    distractorNotes: {
      0: "`Record<K, V>` accepts string literal unions as keys; that is its most common use.",
      2: "Literal types are case-sensitive but any case is allowed.",
      3: "The value type `V` can be any type, including `string`.",
    },
    explanation:
      "`Record<Role, string>` requires a key for EVERY member of `Role`. Adding `ADMIN: \"/admin\"` fixes it (or use `Partial<Record<Role, string>>`).",
    lessonId: "ts-generics-utility",
    source: "practice",
  },
  {
    id: "ts-011",
    type: "mcq",
    topic: "typescript",
    subtopic: "any vs unknown",
    difficulty: "intermediate",
    marks: 1,
    minutes: 2,
    prompt: `Which statement is correct?

${F}ts
const a: any = JSON.parse(text);
const u: unknown = JSON.parse(text);
a.title.toUpperCase(); // line 1
u.title.toUpperCase(); // line 2
${F}`,
    options: [
      "Both lines compile; `any` and `unknown` are aliases",
      "Line 1 errors; line 2 compiles",
      "Line 1 compiles; line 2 errors until `u` is narrowed",
      "Both lines error because `JSON.parse` returns `object`",
    ],
    answer: 2,
    distractorNotes: {
      0: "They are opposites in safety: `any` disables checks, `unknown` forces you to check first.",
      1: "This is reversed: `any` allows everything.",
      3: "`JSON.parse` is declared to return `any`, so it can be assigned to either.",
    },
    explanation:
      "`any` switches off type checking (line 1 compiles but may crash at runtime). `unknown` accepts any value but blocks property access until you narrow it (e.g. with a type guard or Zod schema).",
    lessonId: "ts-typed-api-data",
    source: "practice",
    misconception: "unknown behaves like any",
  },
  {
    id: "ts-012",
    type: "mcq",
    topic: "typescript",
    subtopic: "Types erased at runtime",
    difficulty: "exam",
    marks: 1,
    minutes: 2,
    prompt: `The API actually returns \`{ "id": 1, "price": "12.50" }\` (price as a string). What happens?

${F}ts
interface EventDto { id: number; price: number }

const res = await fetch("/api/events/1");
const event: EventDto = await res.json();
console.log(event.price.toFixed(1));
${F}`,
    options: [
      "Compile error, because TypeScript checks the JSON against `EventDto`",
      "It compiles, then throws `TypeError: event.price.toFixed is not a function` at runtime",
      "It logs `12.5` because TypeScript converts the string to a number",
      "`res.json()` rejects because the body does not match the interface",
    ],
    answer: 1,
    distractorNotes: {
      0: "`res.json()` returns `Promise<any>`, so the assignment compiles. The compiler never sees the real response.",
      2: "TypeScript emits no conversion code; types are erased when compiling to JavaScript.",
      3: "`json()` only parses JSON syntax; it knows nothing about your interfaces.",
    },
    explanation:
      "Type annotations are compile-time promises, not runtime checks. At runtime `price` is a string, and strings have no `toFixed`. Validate API data at runtime (e.g. with a Zod schema) if you cannot trust it.",
    lessonId: "ts-typed-api-data",
    source: "practice",
    misconception: "interfaces validate API responses",
  },
  {
    id: "ts-013",
    type: "mcq",
    topic: "typescript",
    subtopic: "Typing useState",
    difficulty: "exam",
    marks: 1,
    minutes: 2,
    prompt: `In strict mode, \`setEvents(data)\` reports \`Argument of type 'EventDto[]' is not assignable to parameter of type 'SetStateAction<never[]>'\`. Which fix is best?

${F}tsx
const [events, setEvents] = useState([]);
// later
const data: EventDto[] = await getEvents();
setEvents(data);
${F}`,
    options: [
      "`const [events, setEvents] = useState<any>([]);`",
      "`setEvents(data as never[]);`",
      "`const [events, setEvents] = useState<EventDto[]>([]);`",
      "`const [events, setEvents]: EventDto[] = useState([]);`",
    ],
    answer: 2,
    distractorNotes: {
      0: "This silences the error but throws away all type safety for `events`.",
      1: "Casting to `never[]` lies to the compiler; `events` would still be typed as `never[]`, so `events[0].title` would not compile.",
      3: "`useState` returns a tuple `[state, setter]`, not an `EventDto[]`; this annotation is wrong.",
    },
    explanation:
      "An empty array literal gives TypeScript nothing to infer from, so it becomes `never[]`. Pass the generic explicitly: `useState<EventDto[]>([])`.",
    lessonId: "ts-typed-api-data",
    source: "practice",
  },
  {
    id: "ts-014",
    type: "mcq",
    topic: "typescript",
    subtopic: "Typing events",
    difficulty: "intermediate",
    marks: 1,
    minutes: 1,
    prompt: "Which parameter type is correct for a handler attached with `<input onChange={handleChange} />` in React?",
    options: [
      "`(e: Event) => void`",
      "`(e: React.MouseEvent<HTMLButtonElement>) => void`",
      "`(e: string) => void`",
      "`(e: React.ChangeEvent<HTMLInputElement>) => void`",
    ],
    answer: 3,
    distractorNotes: {
      0: "React passes its own synthetic event type; the DOM `Event` type has no typed `target.value`.",
      1: "That is for click handlers on buttons, not change events on inputs.",
      2: "React passes an event object, not the input's value; read it from `e.target.value`.",
    },
    explanation:
      "`React.ChangeEvent<HTMLInputElement>` types `e.target` as `HTMLInputElement`, so `e.target.value` is a `string`.",
    lessonId: "ts-typed-api-data",
    source: "practice",
  },
  {
    id: "ts-015",
    type: "tf",
    topic: "typescript",
    subtopic: "interface vs type",
    difficulty: "beginner",
    marks: 1,
    minutes: 1,
    prompt:
      "An interface can extend another interface with `extends`, and a type alias can achieve a similar result with an intersection (`&`).",
    answer: true,
    explanation:
      "`interface Admin extends User { ... }` and `type Admin = User & { ... }` both produce a type with all members. Interfaces additionally support declaration merging; type aliases can name unions and primitives.",
    lessonId: "ts-basics-interfaces",
    source: "practice",
  },
  {
    id: "ts-016",
    type: "tf",
    topic: "typescript",
    subtopic: "Types erased at runtime",
    difficulty: "intermediate",
    marks: 1,
    minutes: 1,
    prompt: "If `Product` is an interface, you can write `if (data instanceof Product)` to check API data at runtime.",
    answer: false,
    explanation:
      "Interfaces do not exist in the emitted JavaScript, so there is nothing for `instanceof` to compare against (the compiler reports \"only refers to a type, but is being used as a value\"). Use property checks / type guards / a schema validator instead.",
    lessonId: "ts-typed-api-data",
    source: "practice",
    misconception: "interfaces exist at runtime",
  },
  {
    id: "ts-017",
    type: "tf",
    topic: "typescript",
    subtopic: "any vs unknown",
    difficulty: "intermediate",
    marks: 1,
    minutes: 1,
    prompt: "`const x: unknown = 5; const y: number = x;` compiles without errors.",
    answer: false,
    explanation:
      "`unknown` is only assignable to `unknown` and `any`. You must narrow first, e.g. `if (typeof x === \"number\") { const y: number = x; }`.",
    lessonId: "ts-unions-narrowing",
    source: "practice",
  },
  {
    id: "ts-018",
    type: "tf",
    topic: "typescript",
    subtopic: "Utility types",
    difficulty: "beginner",
    marks: 1,
    minutes: 1,
    prompt: "`Pick<User, \"id\" | \"email\">` creates a type containing only the `id` and `email` properties of `User`.",
    answer: true,
    explanation: "`Pick<T, K>` keeps only the listed keys. `Omit<T, K>` is the opposite: it keeps everything except the listed keys.",
    lessonId: "ts-generics-utility",
    source: "practice",
  },
  {
    id: "ts-019",
    type: "tf",
    topic: "typescript",
    subtopic: "Narrowing",
    difficulty: "intermediate",
    marks: 1,
    minutes: 1,
    prompt:
      "In `function greet(name: string | null) { if (!name) return; ... }`, TypeScript narrows `name` to `string` in the code after the `if`.",
    answer: true,
    explanation:
      "Truthiness narrowing removes `null` (and the code path where `name` is `\"\"` simply returns too). After the guard, `name` has type `string`.",
    lessonId: "ts-unions-narrowing",
    source: "practice",
  },
  {
    id: "ts-020",
    type: "tf",
    topic: "typescript",
    subtopic: "Optional properties",
    difficulty: "advanced",
    marks: 1,
    minutes: 1,
    prompt:
      "`interface A { age?: number }` and `interface B { age: number | undefined }` are identical: both allow the object `{}`.",
    answer: false,
    explanation:
      "`age?:` makes the KEY optional, so `{}` is a valid `A`. In `B` the key is required (its value may be `undefined`), so `{}` is an error: \"Property 'age' is missing\". `{ age: undefined }` would satisfy `B`.",
    lessonId: "ts-basics-interfaces",
    source: "practice",
    misconception: "optional means the same as | undefined",
  },
  {
    id: "ts-021",
    type: "short",
    topic: "typescript",
    subtopic: "any vs unknown",
    difficulty: "intermediate",
    marks: 3,
    minutes: 4,
    prompt:
      "Compare `any` and `unknown`. Explain which one is the safer choice for the result of `await response.json()` and why.",
    rubric: [
      { criterion: "`any` turns off type checking: any property access/assignment compiles", marks: 1 },
      { criterion: "`unknown` accepts any value but must be narrowed/validated before use", marks: 1 },
      { criterion: "`unknown` is safer for API data because the shape is not guaranteed at runtime; validate (type guard / Zod) before treating it as a typed object", marks: 1 },
    ],
    modelAnswer:
      "Both can hold any value. With `any` the compiler stops checking, so `data.title.toUpperCase()` compiles even if `title` is missing, and the bug appears at runtime. With `unknown`, the compiler refuses property access until you narrow the value (typeof checks, a custom type guard, or parsing with a Zod schema). API responses are external data whose shape is not guaranteed, so treating them as `unknown` and validating them before use is safer.",
    explanation:
      "`unknown` is the type-safe counterpart of `any`: it forces the developer to prove what the value is.",
    lessonId: "ts-typed-api-data",
    source: "practice",
  },
  {
    id: "ts-022",
    type: "short",
    topic: "typescript",
    subtopic: "Types erased at runtime",
    difficulty: "exam",
    marks: 3,
    minutes: 4,
    prompt:
      "A developer says: \"I typed the response as `EventDto[]`, so the app is protected if the API sends bad data.\" Explain why this is wrong and what should be done instead.",
    rubric: [
      { criterion: "TypeScript types are erased at compile time; no checks exist in the emitted JavaScript", marks: 1 },
      { criterion: "The annotation is an unchecked assertion about data the compiler never sees (`res.json()` returns any)", marks: 1 },
      { criterion: "Remedy: runtime validation (schema such as Zod, or type guards) and handling of invalid data", marks: 1 },
    ],
    modelAnswer:
      "TypeScript only checks code at compile time; the types are removed when compiled to JavaScript. `response.json()` returns `any`, so annotating it as `EventDto[]` simply tells the compiler to trust it - nothing checks the real response. If the API sends a string price or a missing field, the app fails at runtime. To protect the app, validate the data at runtime, e.g. `EventSchema.array().parse(json)` with Zod or a custom type guard, and handle the validation error (show an error state).",
    explanation: "Static types describe what you expect; runtime validation checks what you actually received.",
    lessonId: "ts-typed-api-data",
    source: "practice",
    misconception: "types validate runtime data",
  },
  {
    id: "ts-023",
    type: "code",
    topic: "typescript",
    subtopic: "Typing props",
    difficulty: "exam",
    marks: 5,
    minutes: 8,
    language: "tsx",
    prompt: `Write:
1. An interface \`Student\` with a **read-only** numeric \`id\`, a string \`name\`, and an **optional** string \`email\`.
2. A props interface \`StudentCardProps\` with a \`student: Student\` and a callback \`onSelect\` that receives the student id and returns nothing.
3. A \`StudentCard\` function component that shows the name, shows the email only if present, and calls \`onSelect\` when a button is clicked.`,
    rubric: [
      { criterion: "`readonly id: number`, `name: string`, `email?: string`", marks: 1 },
      { criterion: "Props interface with `student: Student` and `onSelect: (id: number) => void`", marks: 1 },
      { criterion: "Component destructures typed props (`({ student, onSelect }: StudentCardProps)`)", marks: 1 },
      { criterion: "Conditionally renders email only when defined", marks: 1 },
      { criterion: "Button `onClick={() => onSelect(student.id)}` (arrow, not an immediate call)", marks: 1 },
    ],
    modelAnswer: `${F}tsx
interface Student {
  readonly id: number;
  name: string;
  email?: string;
}

interface StudentCardProps {
  student: Student;
  onSelect: (id: number) => void;
}

function StudentCard({ student, onSelect }: StudentCardProps) {
  return (
    <article>
      <h3>{student.name}</h3>
      {student.email && <p>{student.email}</p>}
      <button type="button" onClick={() => onSelect(student.id)}>
        Select
      </button>
    </article>
  );
}
${F}`,
    explanation:
      "Callback props are typed as function types. Wrapping the call in an arrow function passes a function to `onClick` instead of calling `onSelect` during render.",
    lessonId: "ts-basics-interfaces",
    source: "practice",
  },
  {
    id: "ts-024",
    type: "code",
    topic: "typescript",
    subtopic: "Generics & discriminated unions",
    difficulty: "advanced",
    marks: 5,
    minutes: 8,
    language: "ts",
    prompt:
      "Define a generic discriminated union `ApiResult<T>` that is either `{ ok: true; data: T }` or `{ ok: false; error: string }`. Then write a generic function `unwrapOr<T>(result: ApiResult<T>, fallback: T): T` that returns the data on success or the fallback on failure. Show one call with `ApiResult<string[]>`.",
    rubric: [
      { criterion: "Generic type alias with a type parameter `T`", marks: 1 },
      { criterion: "Union of two object types with a literal discriminant (`ok: true` / `ok: false`)", marks: 1 },
      { criterion: "Generic function signature `unwrapOr<T>(result: ApiResult<T>, fallback: T): T`", marks: 1 },
      { criterion: "Narrows on `result.ok` before accessing `data`", marks: 1 },
      { criterion: "Valid example call whose inferred return type is `string[]`", marks: 1 },
    ],
    modelAnswer: `${F}ts
type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

function unwrapOr<T>(result: ApiResult<T>, fallback: T): T {
  return result.ok ? result.data : fallback;
}

const titles: ApiResult<string[]> = { ok: false, error: "Network error" };
const list = unwrapOr(titles, []); // list: string[]
${F}`,
    explanation:
      "`ok` is the discriminant; checking it narrows `result` so `data` is only accessed on the success member. `T` flows from the argument to the return type.",
    lessonId: "ts-generics-utility",
    source: "practice",
  },
];
