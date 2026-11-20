import type { Question } from "../types";

/**
 * Practice bank — Forms, validation and CRUD. Original practice items in the
 * style of the module's ICT; not copied from the mock paper.
 */
export const formsQuestions: Question[] = [
  {
    id: "fm-001",
    type: "mcq",
    topic: "forms-crud",
    subtopic: "Controlled inputs",
    difficulty: "beginner",
    marks: 1,
    minutes: 1,
    prompt: `What makes this input **controlled**?

\`\`\`tsx
const [title, setTitle] = useState("");
<input value={title} onChange={(e) => setTitle(e.target.value)} />
\`\`\``,
    options: [
      "It has an `id` attribute.",
      "It is inside a `<form>` element.",
      "It uses a `ref` to read the DOM value on submit.",
      "Its displayed value comes from React state via `value`, and changes flow back through `onChange`.",
    ],
    answer: 3,
    explanation:
      "In a controlled input, React state is the single source of truth: `value` is set from state and every keystroke updates state via `onChange`.",
    distractorNotes: {
      0: "An `id` is unrelated to who owns the value.",
      1: "Being in a form does not make an input controlled.",
      2: "Reading the value through a ref is the *uncontrolled* pattern.",
    },
    lessonId: "forms-controlled-inputs",
    source: "practice",
  },
  {
    id: "fm-002",
    type: "mcq",
    topic: "forms-crud",
    subtopic: "Controlled inputs",
    difficulty: "intermediate",
    marks: 1,
    minutes: 1,
    prompt:
      "A developer writes `<input value={name} />` with no `onChange` handler. What happens when the user types?",
    options: [
      "The input accepts typing and `name` updates automatically.",
      "The visible value does not change, because React keeps rendering the state value; React also warns about a missing `onChange`.",
      "The page reloads.",
      "React converts it into an uncontrolled input after the first keystroke.",
    ],
    answer: 1,
    explanation:
      "With `value` set and no handler, React keeps forcing the input back to `name`, so it is effectively read-only. React warns you to add `onChange`, use `readOnly`, or use `defaultValue` for an uncontrolled input.",
    distractorNotes: {
      0: "Nothing updates state without a handler calling the setter.",
      2: "Typing never reloads the page; submitting a form without `preventDefault` can.",
      3: "React does not switch modes; switching between controlled/uncontrolled triggers a warning.",
    },
    lessonId: "forms-controlled-inputs",
    source: "practice",
  },
  {
    id: "fm-003",
    type: "mcq",
    topic: "forms-crud",
    subtopic: "Form submission",
    difficulty: "beginner",
    marks: 1,
    minutes: 1,
    prompt:
      "Why does a React form's `onSubmit` handler usually call `event.preventDefault()`?",
    options: [
      "To stop the browser's default full-page form submission/navigation, so the app can handle it with JavaScript.",
      "To validate the inputs automatically.",
      "To stop the event reaching the server's firewall.",
      "To clear all input fields.",
    ],
    answer: 0,
    explanation:
      "By default a submitted form navigates (reloads the page with a GET/POST to its `action`). Preventing the default keeps the single-page app running so it can validate and send a `fetch` request.",
    distractorNotes: {
      1: "`preventDefault` does not validate anything.",
      2: "It is a browser-side event; it has nothing to do with firewalls.",
      3: "Fields keep their values unless you reset state.",
    },
    lessonId: "forms-controlled-inputs",
    source: "practice",
  },
  {
    id: "fm-004",
    type: "mcq",
    topic: "forms-crud",
    subtopic: "Validation functions",
    difficulty: "exam",
    marks: 1,
    minutes: 2,
    prompt:
      "A \"Number of seats\" input must be a **positive integer**. The input value is the string `seatsText`. Which check is correct?",
    options: [
      "`seatsText.length > 0`",
      "`Number(seatsText) > 0`",
      "`const n = Number(seatsText); Number.isInteger(n) && n > 0`",
      "`parseInt(seatsText) !== 0`",
    ],
    answer: 2,
    explanation:
      "Input values are strings. Converting with `Number` and then checking `Number.isInteger(n) && n > 0` rejects `\"\"` (0), `\"2.5\"`, `\"-3\"`, `\"abc\"` (NaN) and `\"0\"`.",
    distractorNotes: {
      0: "Accepts any non-empty text, such as \"abc\" or \"-4\".",
      1: "Accepts decimals like \"2.5\".",
      3: "`parseInt(\"3abc\")` is 3 and `parseInt(\"-2\")` is -2, so invalid values pass; NaN also passes (`NaN !== 0`).",
    },
    lessonId: "forms-validation",
    source: "practice",
    misconception: "Number(x) > 0 means positive integer",
  },
  {
    id: "fm-005",
    type: "mcq",
    topic: "forms-crud",
    subtopic: "Validation functions",
    difficulty: "intermediate",
    marks: 1,
    minutes: 1,
    prompt:
      "A \"Venue\" field must not be empty. A user types three spaces. Which check correctly rejects it?",
    options: [
      "`if (!venue)`",
      "`if (venue.length === 0)`",
      "`if (venue === null)`",
      "`if (venue.trim() === \"\")`",
    ],
    answer: 3,
    explanation:
      "`\"   \"` is a truthy, non-empty string. Trimming whitespace first makes whitespace-only input count as empty.",
    distractorNotes: {
      0: "`\"   \"` is truthy, so `!venue` is false.",
      1: "The length of three spaces is 3.",
      2: "An input value is a string, never null here.",
    },
    lessonId: "forms-validation",
    source: "practice",
  },
  {
    id: "fm-006",
    type: "mcq",
    topic: "forms-crud",
    subtopic: "Client vs server validation",
    difficulty: "exam",
    marks: 1,
    minutes: 1,
    prompt: "What is the main purpose of **client-side** validation?",
    options: [
      "To guarantee that only valid data ever reaches the database.",
      "To give users fast feedback and avoid unnecessary requests; the server must still validate.",
      "To replace server-side validation so the API can be simpler.",
      "To encrypt the form data.",
    ],
    answer: 1,
    explanation:
      "Client-side checks improve UX, but anyone can bypass them (DevTools, curl, a modified request). The server is the trust boundary and must validate again.",
    distractorNotes: {
      0: "Client checks can be bypassed, so they guarantee nothing.",
      2: "Removing server validation would be a security flaw.",
      3: "Validation is not encryption; HTTPS protects data in transit.",
    },
    lessonId: "forms-validation",
    source: "practice",
    misconception: "Client validation is a security control",
  },
  {
    id: "fm-007",
    type: "mcq",
    topic: "forms-crud",
    subtopic: "POST vs PUT vs PATCH",
    difficulty: "intermediate",
    marks: 1,
    minutes: 1,
    prompt:
      "A user changes **only** the status of an existing booking 12. The API supports partial updates. Which request fits best?",
    options: [
      "`PATCH /api/bookings/12` with `{ \"status\": \"Confirmed\" }`",
      "`POST /api/bookings` with `{ \"status\": \"Confirmed\" }`",
      "`GET /api/bookings/12?status=Confirmed`",
      "`DELETE /api/bookings/12` then create a new one",
    ],
    answer: 0,
    explanation:
      "`PATCH` applies a partial modification to an existing resource. `PUT` would normally send the full representation.",
    distractorNotes: {
      1: "POST to the collection creates a new booking.",
      2: "GET must not change server state.",
      3: "Deleting and recreating loses the identity/history of the booking and is two requests.",
    },
    lessonId: "crud-post-put-delete",
    source: "practice",
  },
  {
    id: "fm-008",
    type: "mcq",
    topic: "forms-crud",
    subtopic: "Duplicate submission",
    difficulty: "intermediate",
    marks: 1,
    minutes: 1,
    prompt:
      "Users double-click \"Create order\" and two orders are created. What is the most appropriate frontend fix?",
    options: [
      "Use PUT instead of POST.",
      "Call `preventDefault()` twice.",
      "Track a submitting state, disable the button while the request is pending, and re-enable it when it settles.",
      "Hide the button with CSS after the first click forever.",
    ],
    answer: 2,
    explanation:
      "POST is not idempotent, so each click creates a record. Disabling the button while `isSubmitting` (or `mutation.isPending`) prevents duplicates in the UI. Servers may additionally use idempotency keys or unique constraints.",
    distractorNotes: {
      0: "The endpoint creates via POST; switching method doesn't fit the API.",
      1: "`preventDefault` stops the browser's navigation, not repeated clicks.",
      3: "If the request fails, the user could never retry.",
    },
    lessonId: "crud-post-put-delete",
    source: "practice",
  },
  {
    id: "fm-009",
    type: "mcq",
    topic: "forms-crud",
    subtopic: "Navigate after success",
    difficulty: "exam",
    marks: 1,
    minutes: 2,
    prompt: `What is wrong with this submit handler?

\`\`\`tsx
async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  createEvent(form);      // returns a Promise
  navigate("/events");
}
\`\`\``,
    options: [
      "`navigate` cannot be used inside event handlers.",
      "It navigates before the request finishes and without knowing whether it succeeded, so errors are lost and the list may not yet include the new item.",
      "`preventDefault` must be called after `createEvent`.",
      "Nothing — this is the recommended pattern.",
    ],
    answer: 1,
    explanation:
      "The promise is not awaited. Correct pattern: `await createEvent(form)` inside `try`, navigate only on success, and show the error (staying on the form) on failure.",
    distractorNotes: {
      0: "`useNavigate()` returns a function intended for event handlers.",
      2: "It should be called first, synchronously, before any `await`.",
      3: "Navigating before success hides failures from the user.",
    },
    lessonId: "crud-post-put-delete",
    source: "practice",
    misconception: "Navigate immediately after starting a mutation",
  },
  {
    id: "fm-010",
    type: "mcq",
    topic: "forms-crud",
    subtopic: "Zod and React Hook Form",
    difficulty: "advanced",
    marks: 1,
    minutes: 2,
    prompt: `Which schema accepts a text input for capacity and outputs a positive integer?

(Zod 4, used with React Hook Form via \`zodResolver\`.)`,
    options: [
      "`z.string().min(1)`",
      "`z.number().positive()`",
      "`z.string().int()`",
      "`z.coerce.number().int().positive()`",
    ],
    answer: 3,
    explanation:
      "Text inputs produce strings. `z.coerce.number()` converts the input with `Number(...)`, then `.int().positive()` enforce a whole number > 0. (Alternatively, register the field with `valueAsNumber: true` and use `z.number().int().positive()`.)",
    distractorNotes: {
      0: "Only checks non-empty text; \"abc\" passes.",
      1: "A plain `z.number()` rejects the string the input provides (unless converted first), and does not require an integer.",
      2: "`int()` is not a string method in Zod.",
    },
    lessonId: "forms-zod-rhf",
    source: "practice",
  },
  {
    id: "fm-011",
    type: "mcq",
    topic: "forms-crud",
    subtopic: "Refresh after mutation",
    difficulty: "intermediate",
    marks: 1,
    minutes: 1,
    prompt:
      "After a successful `DELETE /api/notes/5` (204), the notes list still shows note 5. Using plain `useState` + `fetch` (no TanStack Query), what is a correct fix?",
    options: [
      "Call `response.json()` to get the updated list.",
      "Reload the whole browser page with `window.location.reload()` as the standard approach.",
      "Remove the note from local state (e.g. `setNotes(ns => ns.filter(n => n.id !== 5))`) or refetch the list after success.",
      "Nothing — React re-renders automatically when server data changes.",
    ],
    answer: 2,
    explanation:
      "The server change is invisible to React until you update state. Either update the local list immutably or re-request it, only after the response is ok.",
    distractorNotes: {
      0: "204 has no body.",
      1: "A full reload works but throws away all client state; it is not the idiomatic SPA approach.",
      3: "React only re-renders on state/prop changes, not server changes.",
    },
    lessonId: "crud-post-put-delete",
    source: "practice",
  },
  {
    id: "fm-012",
    type: "tf",
    topic: "forms-crud",
    subtopic: "Controlled vs uncontrolled",
    difficulty: "beginner",
    marks: 1,
    minutes: 1,
    prompt:
      "An uncontrolled input keeps its current value in the DOM, and React code typically reads it with a ref or `FormData` when needed.",
    answer: true,
    explanation:
      "Uncontrolled inputs use `defaultValue` for the initial value; the DOM owns the current value, which is read via a ref or `new FormData(form)` on submit. React Hook Form is built around this approach.",
    lessonId: "forms-controlled-inputs",
    source: "practice",
  },
  {
    id: "fm-013",
    type: "tf",
    topic: "forms-crud",
    subtopic: "Validation functions",
    difficulty: "intermediate",
    marks: 1,
    minutes: 1,
    prompt: "`Number.isInteger(\"5\")` returns `true`.",
    answer: false,
    explanation:
      "`Number.isInteger` does not coerce: a string is not a number, so it returns `false`. Convert first: `Number.isInteger(Number(\"5\"))` is `true`.",
    lessonId: "forms-validation",
    source: "practice",
    misconception: "Number.isInteger coerces strings",
  },
  {
    id: "fm-014",
    type: "tf",
    topic: "forms-crud",
    subtopic: "POST vs PUT",
    difficulty: "intermediate",
    marks: 1,
    minutes: 1,
    prompt:
      "Sending the same `PUT /api/events/4` request with the same body twice should leave the event in the same state as sending it once.",
    answer: true,
    explanation:
      "PUT is idempotent: it sets the resource at a known URL to the supplied representation. Repeating it changes nothing further — unlike POST to a collection, which would create another record.",
    lessonId: "crud-post-put-delete",
    source: "practice",
  },
  {
    id: "fm-015",
    type: "tf",
    topic: "forms-crud",
    subtopic: "DELETE confirmation",
    difficulty: "beginner",
    marks: 1,
    minutes: 1,
    prompt:
      "Asking the user to confirm before sending a DELETE request is a UX safeguard against accidental deletion; it does not replace the server checking whether the user is allowed to delete.",
    answer: true,
    explanation:
      "A confirm dialog prevents mistakes by legitimate users. Authorisation must still be enforced by the API, because requests can be sent without the UI.",
    lessonId: "crud-post-put-delete",
    source: "practice",
  },
  {
    id: "fm-016",
    type: "tf",
    topic: "forms-crud",
    subtopic: "Field errors",
    difficulty: "intermediate",
    marks: 1,
    minutes: 1,
    prompt:
      "Storing validation errors as an object keyed by field name (e.g. `{ title?: string; capacity?: string }`) lets the form show each message next to the matching input.",
    answer: true,
    explanation:
      "A field → message map makes rendering simple (`errors.title && <p>{errors.title}</p>`) and checking validity easy (`Object.keys(errors).length === 0`).",
    lessonId: "forms-validation",
    source: "practice",
  },
  {
    id: "fm-017",
    type: "short",
    topic: "forms-crud",
    subtopic: "POST vs PUT vs PATCH",
    difficulty: "exam",
    marks: 3,
    minutes: 3,
    prompt:
      "From the point of view of a frontend performing CRUD on `/api/courses`, explain when you would use **POST**, **PUT** and **PATCH**, including the URL each would target.",
    rubric: [
      { criterion: "POST to the collection (`/api/courses`) to create a new resource; server assigns the id; not idempotent", marks: 1 },
      { criterion: "PUT to a specific resource (`/api/courses/{id}`) to replace/update it with a full representation; idempotent", marks: 1 },
      { criterion: "PATCH to a specific resource to change only some fields (partial update)", marks: 1 },
    ],
    modelAnswer:
      "- **POST** `/api/courses` with the new course data creates a new course; the server assigns the id and typically returns 201 with the created object. Repeating it creates duplicates (not idempotent).\n- **PUT** `/api/courses/12` sends the complete updated course to replace the resource at that known URL; repeating it gives the same result (idempotent). Some APIs return 204 No Content.\n- **PATCH** `/api/courses/12` sends only the fields that changed (e.g. `{ \"title\": \"New\" }`) for a partial update.",
    explanation:
      "The key distinctions are: collection vs item URL, create vs update, full vs partial body, and idempotency.",
    lessonId: "crud-post-put-delete",
    source: "practice",
  },
  {
    id: "fm-018",
    type: "short",
    topic: "forms-crud",
    subtopic: "Client vs server validation",
    difficulty: "intermediate",
    marks: 3,
    minutes: 3,
    prompt:
      "A form validates that \"Price\" is not negative before sending. Explain why the server must validate again, and how the frontend should handle a `400`/`422` response containing field errors.",
    rubric: [
      { criterion: "Client validation can be bypassed (DevTools, curl, modified requests) — it is UX only", marks: 1 },
      { criterion: "Server is the trust boundary / may have rules the client doesn't know (e.g. uniqueness)", marks: 1 },
      { criterion: "Frontend reads the error body and shows messages beside fields, keeping the user's input", marks: 1 },
    ],
    modelAnswer:
      "Client-side validation only improves the user experience; an attacker or buggy client can send any request directly, bypassing the form. The server is the trust boundary and may also enforce rules the client cannot check (e.g. unique names, data in the database), so it must validate again. When the API returns 400/422 with field errors, the frontend should parse the error body, map the messages to the matching fields (and a general message otherwise), keep the user's input so they can correct it, and re-enable the submit button.",
    explanation:
      "Both layers are needed: client for speed and feedback, server for correctness and security.",
    lessonId: "forms-validation",
    source: "practice",
    misconception: "Client validation guarantees valid data",
  },
  {
    id: "fm-019",
    type: "code",
    topic: "forms-crud",
    subtopic: "Validation functions",
    difficulty: "exam",
    marks: 4,
    minutes: 6,
    language: "ts",
    prompt: `A "Create workshop" form has \`title\`, \`room\` and \`maxStudents\` (all strings from inputs). Write \`validateWorkshop(values)\` that returns an object of field errors:

- \`title\` must not be empty (ignore surrounding whitespace)
- \`room\` must not be empty (ignore surrounding whitespace)
- \`maxStudents\` must be a positive integer

Return an empty object when everything is valid.`,
    starterCode: `interface WorkshopForm {
  title: string;
  room: string;
  maxStudents: string;
}
type WorkshopErrors = Partial<Record<keyof WorkshopForm, string>>;

export function validateWorkshop(values: WorkshopForm): WorkshopErrors {
  // TODO
}`,
    rubric: [
      { criterion: "Checks `title.trim()` is not empty with a message", marks: 1 },
      { criterion: "Checks `room.trim()` is not empty with a message", marks: 1 },
      { criterion: "Converts maxStudents to a number and uses `Number.isInteger(n) && n > 0`", marks: 1 },
      { criterion: "Returns an errors object keyed by field (empty when valid)", marks: 1 },
    ],
    modelAnswer: `\`\`\`ts
export function validateWorkshop(values: WorkshopForm): WorkshopErrors {
  const errors: WorkshopErrors = {};

  if (values.title.trim() === "") {
    errors.title = "Title is required.";
  }
  if (values.room.trim() === "") {
    errors.room = "Room is required.";
  }

  const raw = values.maxStudents.trim();
  const n = Number(raw);
  if (raw === "" || !Number.isInteger(n) || n <= 0) {
    errors.maxStudents = "Max students must be a positive whole number.";
  }

  return errors;
}
\`\`\``,
    explanation:
      "Trimming catches whitespace-only input. `Number(\"\")` is 0, so the explicit empty check gives a clear message; `Number.isInteger` rejects NaN and decimals; `n <= 0` rejects zero and negatives.",
    lessonId: "forms-validation",
    source: "practice",
  },
  {
    id: "fm-020",
    type: "code",
    topic: "forms-crud",
    subtopic: "Submit flow",
    difficulty: "advanced",
    marks: 5,
    minutes: 7,
    language: "tsx",
    prompt:
      "Write the `handleSubmit` function for a controlled form component. It has state `values`, `errors`, `submitting`, `serverError`, a `validateWorkshop(values)` function (returns field errors), a `createWorkshop(values)` service function (returns a Promise and throws on failure), and `navigate` from `useNavigate()`. The handler must: prevent the default submission; validate and stop if there are errors; avoid duplicate submits; navigate to `/workshops` **only after success**; show an error message otherwise.",
    rubric: [
      { criterion: "Calls `e.preventDefault()`", marks: 1 },
      { criterion: "Validates, stores errors and returns early when invalid", marks: 1 },
      { criterion: "Guards/disables duplicate submit via `submitting` state", marks: 1 },
      { criterion: "Awaits `createWorkshop` in try/catch and navigates only on success", marks: 1 },
      { criterion: "Sets serverError on failure and resets submitting in finally (or on failure)", marks: 1 },
    ],
    modelAnswer: `\`\`\`tsx
async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  if (submitting) return;

  const found = validateWorkshop(values);
  setErrors(found);
  if (Object.keys(found).length > 0) return;

  setSubmitting(true);
  setServerError(null);
  try {
    await createWorkshop(values);
    navigate("/workshops");
  } catch (err) {
    setServerError(err instanceof Error ? err.message : "Could not save the workshop.");
  } finally {
    setSubmitting(false);
  }
}

// In JSX: <button type="submit" disabled={submitting}>Save</button>
\`\`\``,
    explanation:
      "Awaiting the service call means navigation only happens if it did not throw. The `submitting` flag (and disabled button) prevents double POSTs; `finally` re-enables the form if the user stays on it.",
    lessonId: "crud-post-put-delete",
    source: "practice",
  },
];
