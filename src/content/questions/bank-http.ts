import type { Question } from "../types";

/**
 * Practice bank — REST APIs & HTTP (fetch, status codes, AbortController,
 * service modules, headers, CORS, UI states). Original practice items written
 * in the style of the module's ICT; not copied from the mock paper.
 */
export const httpQuestions: Question[] = [
  {
    id: "http-001",
    type: "mcq",
    topic: "http-api",
    subtopic: "HTTP methods",
    difficulty: "beginner",
    marks: 1,
    minutes: 1,
    prompt:
      "A library app shows a list of books. Which HTTP method should the frontend use to **read** the list from `/api/books` without changing anything on the server?",
    options: ["POST", "GET", "PATCH", "DELETE"],
    answer: 1,
    explanation:
      "`GET` retrieves a representation of a resource. It is a *safe* method: it should not change server state, which is why browsers and caches can repeat it freely.",
    distractorNotes: {
      0: "POST submits data to be processed — typically to create a new resource.",
      2: "PATCH partially modifies an existing resource.",
      3: "DELETE removes a resource; it changes server state.",
    },
    lessonId: "http-methods-status",
    source: "practice",
    misconception: "Any method can be used to read data",
  },
  {
    id: "http-002",
    type: "mcq",
    topic: "http-api",
    subtopic: "Safe and idempotent methods",
    difficulty: "intermediate",
    marks: 1,
    minutes: 1,
    prompt:
      "Which statement about **idempotent** HTTP methods is correct?",
    options: [
      "An idempotent method never changes anything on the server.",
      "POST is idempotent because the same body is sent each time.",
      "Sending the same idempotent request several times has the same intended effect on the server as sending it once.",
      "Only GET is idempotent.",
    ],
    answer: 2,
    explanation:
      "Idempotent means repeating the identical request leaves the server in the same state as doing it once. `GET`, `HEAD`, `PUT` and `DELETE` are idempotent. Safe (read-only) is a stricter property: `PUT` and `DELETE` are idempotent but not safe.",
    distractorNotes: {
      0: "That describes *safe* methods. PUT and DELETE change state but are still idempotent.",
      1: "POST is not idempotent — submitting the same order twice typically creates two orders.",
      3: "PUT and DELETE (and HEAD, OPTIONS) are also idempotent.",
    },
    lessonId: "http-methods-status",
    source: "practice",
    misconception: "Idempotent means read-only",
  },
  {
    id: "http-003",
    type: "mcq",
    topic: "http-api",
    subtopic: "Status codes",
    difficulty: "beginner",
    marks: 1,
    minutes: 1,
    prompt:
      "A frontend sends `POST /api/tickets` and the server successfully creates the ticket, returning it in the body. Which status code is most appropriate?",
    options: ["200 OK", "204 No Content", "404 Not Found", "201 Created"],
    answer: 3,
    explanation:
      "`201 Created` signals that a new resource was created. APIs commonly return the created object (and often a `Location` header) with it.",
    distractorNotes: {
      0: "200 is a generic success; 201 is the more specific and expected code for creation.",
      1: "204 means success with no body — but here the ticket is returned in the body.",
      2: "404 means the resource/endpoint was not found — a failure.",
    },
    lessonId: "http-methods-status",
    source: "practice",
  },
  {
    id: "http-004",
    type: "mcq",
    topic: "http-api",
    subtopic: "Status codes",
    difficulty: "intermediate",
    marks: 1,
    minutes: 1,
    prompt:
      "A user tries to register with an email address that is already taken. The server rejects the request because it conflicts with the current state of an existing resource. Which status code fits best?",
    options: ["409 Conflict", "401 Unauthorized", "503 Service Unavailable", "201 Created"],
    answer: 0,
    explanation:
      "`409 Conflict` indicates the request conflicts with the current state of the target resource (e.g. a duplicate unique value). The frontend should show a specific message such as \"This email is already registered\".",
    distractorNotes: {
      1: "401 is about missing/invalid authentication, not duplicate data.",
      2: "503 means the server is temporarily unable to handle requests (overloaded/maintenance).",
      3: "201 means creation succeeded, which it did not.",
    },
    lessonId: "http-methods-status",
    source: "practice",
  },
  {
    id: "http-005",
    type: "mcq",
    topic: "http-api",
    subtopic: "Status codes and frontend reaction",
    difficulty: "exam",
    marks: 1,
    minutes: 1,
    prompt:
      "A search box calls an API on every keystroke and suddenly starts receiving `429 Too Many Requests`. What is the most appropriate frontend change?",
    options: [
      "Treat 429 as a successful response and render an empty list.",
      "Redirect the user to the login page.",
      "Reduce the request rate (e.g. debounce input) and back off before retrying, respecting `Retry-After` if present.",
      "Immediately retry the same request in a tight loop until it succeeds.",
    ],
    answer: 2,
    explanation:
      "429 means the client is being rate-limited. The fix is to send fewer requests (debouncing, caching) and wait before retrying. The server may send a `Retry-After` header indicating how long to wait.",
    distractorNotes: {
      0: "429 is an error; silently showing an empty list hides the problem from the user.",
      1: "429 is not an authentication problem — that would be 401.",
      3: "Hammering the server makes rate limiting worse.",
    },
    lessonId: "http-methods-status",
    source: "practice",
    misconception: "Retrying instantly fixes server-side errors",
  },
  {
    id: "http-006",
    type: "mcq",
    topic: "http-api",
    subtopic: "Status codes",
    difficulty: "intermediate",
    marks: 1,
    minutes: 1,
    prompt:
      "A form sends syntactically valid JSON, but the server responds `422 Unprocessable Content` (often called Unprocessable Entity) with a list of field messages. How should the frontend respond?",
    options: [
      "Log the user out, because the token must be invalid.",
      "Display the server's validation messages next to the relevant fields so the user can correct them.",
      "Show a generic \"Server is down\" banner and disable the form.",
      "Resend the identical request automatically.",
    ],
    answer: 1,
    explanation:
      "422 means the request was well-formed but semantically invalid (validation failed). The frontend should map the returned errors to fields. Resending unchanged data will fail again.",
    distractorNotes: {
      0: "Authentication failures use 401, not 422.",
      2: "A 5xx code would indicate a server problem; 422 is a client data problem.",
      3: "The same invalid data will produce the same 422.",
    },
    lessonId: "http-methods-status",
    source: "practice",
  },
  {
    id: "http-007",
    type: "mcq",
    topic: "http-api",
    subtopic: "fetch and HTTP errors",
    difficulty: "exam",
    marks: 1,
    minutes: 2,
    prompt: `What is logged when the server replies with **500 Internal Server Error**?

\`\`\`ts
try {
  const res = await fetch("/api/report");
  console.log("A", res.status);
} catch {
  console.log("B");
}
\`\`\``,
    options: ["B", "A 500", "Nothing — fetch throws an uncaught error", "A 200"],
    answer: 1,
    explanation:
      "The `fetch` promise **resolves** for any HTTP response, including 4xx and 5xx. It only rejects on network failure (or abort / CORS block). So the `try` block runs and logs `A 500`. Code must check `res.ok` or `res.status` itself.",
    distractorNotes: {
      0: "The catch block only runs if fetch rejects — not for an HTTP 500.",
      2: "No exception is thrown for an HTTP error status.",
      3: "`res.status` is the real status, 500.",
    },
    lessonId: "http-fetch-response-ok",
    source: "practice",
    misconception: "fetch rejects on 4xx/5xx",
  },
  {
    id: "http-008",
    type: "mcq",
    topic: "http-api",
    subtopic: "response.ok",
    difficulty: "beginner",
    marks: 1,
    minutes: 1,
    prompt: "For which status code is `response.ok` **true**?",
    options: ["304", "401", "204", "404"],
    answer: 2,
    explanation:
      "`response.ok` is `true` only when the status is in the range 200–299. 204 No Content is a success code, so `ok` is true (even though there is no body).",
    distractorNotes: {
      0: "304 is outside 200–299, so `ok` is false.",
      1: "401 is a client error.",
      3: "404 is a client error.",
    },
    lessonId: "http-fetch-response-ok",
    source: "practice",
  },
  {
    id: "http-009",
    type: "mcq",
    topic: "http-api",
    subtopic: "204 No Content",
    difficulty: "exam",
    marks: 1,
    minutes: 2,
    prompt: `The endpoint \`PUT /api/rooms/7\` returns **204 No Content** on success. What happens with this code?

\`\`\`ts
const res = await fetch("/api/rooms/7", {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(room),
});
if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
const updated = await res.json();
\`\`\``,
    options: [
      "`updated` is `null`.",
      "`updated` is an empty object `{}`.",
      "`res.json()` rejects with a parsing error because the body is empty.",
      "`res.ok` is false so the Error is thrown.",
    ],
    answer: 2,
    explanation:
      "A 204 response has no body. Calling `res.json()` on an empty body rejects (a `SyntaxError` about unexpected end of JSON input). Check `res.status === 204` and skip parsing, or refetch the resource.",
    distractorNotes: {
      0: "`json()` does not turn an empty body into null — it fails to parse.",
      1: "An empty body is not valid JSON, so no object is produced.",
      3: "204 is in 200–299, so `res.ok` is true.",
    },
    lessonId: "http-fetch-response-ok",
    source: "practice",
    misconception: "Every successful response has a JSON body",
  },
  {
    id: "http-010",
    type: "mcq",
    topic: "http-api",
    subtopic: "AbortController",
    difficulty: "intermediate",
    marks: 1,
    minutes: 1,
    prompt:
      "In a `useEffect` that fetches data, what is the main purpose of calling `controller.abort()` in the cleanup function?",
    options: [
      "To cancel the in-flight request when the component unmounts or the dependency changes, so a stale response is not applied.",
      "To delete the data on the server.",
      "To make the request run faster.",
      "To stop React from re-rendering the component.",
    ],
    answer: 0,
    explanation:
      "Aborting signals that the result is no longer wanted. The pending `fetch` rejects with an `AbortError`, so outdated responses do not overwrite newer state, and no state is set after unmount.",
    distractorNotes: {
      1: "Aborting only affects the client side of the request; it never deletes server data (and the server may already have processed it).",
      2: "Abort cancels; it does not speed anything up.",
      3: "Re-rendering is controlled by state changes, not by aborting fetches.",
    },
    lessonId: "http-abortcontroller",
    source: "practice",
  },
  {
    id: "http-011",
    type: "mcq",
    topic: "http-api",
    subtopic: "Race conditions",
    difficulty: "advanced",
    marks: 1,
    minutes: 2,
    prompt: `A profile page fetches \`/api/users/\${id}\` whenever \`id\` changes. The user clicks user 1 then quickly user 2. User 1's response arrives **after** user 2's. Without cleanup, what does the page show?

\`\`\`tsx
useEffect(() => {
  fetch(\`/api/users/\${id}\`)
    .then((r) => r.json())
    .then(setUser);
}, [id]);
\`\`\``,
    options: [
      "User 2, because React ignores responses from old renders automatically.",
      "An error, because two requests cannot run at once.",
      "Nothing, because the second request cancels the first.",
      "User 1's data while the URL says user 2 — the slower, stale response overwrote the newer one.",
    ],
    answer: 3,
    explanation:
      "This is a race condition: whichever response resolves last wins. Fix it with an `AbortController` (abort in cleanup) or an `ignore` flag set in cleanup, or use a library such as TanStack Query that keys data by `id`.",
    distractorNotes: {
      0: "React does not know which promise is stale; the old `.then(setUser)` still runs.",
      1: "Browsers happily run several requests concurrently.",
      2: "Starting a new fetch does not cancel an older one unless you abort it.",
    },
    lessonId: "http-abortcontroller",
    source: "practice",
    misconception: "Later requests always resolve later",
  },
  {
    id: "http-012",
    type: "mcq",
    topic: "http-api",
    subtopic: "Headers",
    difficulty: "beginner",
    marks: 1,
    minutes: 1,
    prompt:
      "When sending `JSON.stringify(data)` as the body of a `POST`, which header tells the server the body format?",
    options: [
      "`Accept: text/html`",
      "`Content-Type: application/json`",
      "`Authorization: application/json`",
      "`Cache-Control: json`",
    ],
    answer: 1,
    explanation:
      "`Content-Type` describes the format of the request body. Without `application/json`, fetch sends a string body as `text/plain`, and many servers (e.g. ASP.NET Core `[FromBody]`) reject it with 415 Unsupported Media Type.",
    distractorNotes: {
      0: "`Accept` says what response format the client wants — and HTML is the wrong one here.",
      2: "`Authorization` carries credentials such as `Bearer <token>`.",
      3: "`Cache-Control` controls caching, not body format.",
    },
    lessonId: "http-service-modules",
    source: "practice",
  },
  {
    id: "http-013",
    type: "mcq",
    topic: "http-api",
    subtopic: "Authorization header",
    difficulty: "intermediate",
    marks: 1,
    minutes: 1,
    prompt:
      "An API expects a JWT access token. Which header value is the conventional format?",
    options: [
      "`Authorization: Bearer <token>`",
      "`Token: <token>`",
      "`Authorization: <username>:<password>`",
      "`Content-Type: Bearer <token>`",
    ],
    answer: 0,
    explanation:
      "Bearer tokens are sent as `Authorization: Bearer <token>` (RFC 6750). Many APIs, including ASP.NET Core JWT bearer authentication, expect exactly this format.",
    distractorNotes: {
      1: "`Token` is not a standard header and the server won't read it by default.",
      2: "That resembles (unencoded) Basic auth credentials, not a bearer token.",
      3: "`Content-Type` describes the body format.",
    },
    lessonId: "http-service-modules",
    source: "practice",
  },
  {
    id: "http-014",
    type: "mcq",
    topic: "http-api",
    subtopic: "CORS preflight",
    difficulty: "advanced",
    marks: 1,
    minutes: 2,
    prompt:
      "A React app on `http://localhost:5173` sends `DELETE http://localhost:5229/api/notes/3` with an `Authorization` header. Before the DELETE, the browser sends an `OPTIONS` request. Why?",
    options: [
      "React Router sends OPTIONS to check the route exists.",
      "The server always requires OPTIONS before any request.",
      "It is a CORS preflight: the request is cross-origin and not \"simple\" (non-simple method and header), so the browser asks the server whether it is allowed.",
      "OPTIONS is how the browser encrypts the token.",
    ],
    answer: 2,
    explanation:
      "Different port = different origin. Methods other than GET/HEAD/POST, or headers like `Authorization` or `Content-Type: application/json`, trigger a preflight. The server must answer with suitable `Access-Control-Allow-*` headers or the browser will not send the real request.",
    distractorNotes: {
      0: "React Router works entirely in the browser and makes no HTTP requests for routing.",
      1: "Simple same-origin or simple cross-origin requests have no preflight.",
      3: "Encryption in transit comes from HTTPS (TLS), not OPTIONS.",
    },
    lessonId: "http-cors",
    source: "practice",
  },
  {
    id: "http-015",
    type: "mcq",
    topic: "http-api",
    subtopic: "CORS",
    difficulty: "exam",
    marks: 1,
    minutes: 1,
    prompt:
      "The console shows: *\"blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present\"*. Where must the fix normally be made?",
    options: [
      "In the React component, by adding `mode: \"no-cors\"` and reading the JSON as usual.",
      "On the server/API, by allowing the frontend's origin in its CORS configuration (or by using a dev proxy).",
      "In `index.html`, by adding a `<meta>` tag.",
      "By switching from `fetch` to `axios`.",
    ],
    answer: 1,
    explanation:
      "CORS is enforced by the browser based on headers the **server** returns. The server must list the frontend origin (e.g. `http://localhost:5173`). In development, a Vite proxy makes requests same-origin as an alternative.",
    distractorNotes: {
      0: "`no-cors` gives an *opaque* response you cannot read — the JSON is unavailable.",
      2: "No meta tag can grant cross-origin access; the server decides.",
      3: "axios uses the same browser networking and is subject to the same CORS rules.",
    },
    lessonId: "http-cors",
    source: "practice",
    misconception: "CORS errors are fixed in frontend code",
  },
  {
    id: "http-016",
    type: "mcq",
    topic: "http-api",
    subtopic: "Four UI states",
    difficulty: "intermediate",
    marks: 1,
    minutes: 1,
    prompt:
      "A component fetches a list of workshops. The API succeeds and returns `[]`. Which UI should be shown?",
    options: [
      "A loading spinner, because there is no data yet.",
      "An error message, because nothing was returned.",
      "A blank area, since there is nothing to render.",
      "An empty state such as \"No workshops yet\", distinct from loading and error.",
    ],
    answer: 3,
    explanation:
      "Data-driven UIs should handle four states: loading, error, empty and success-with-data. An empty array is a *successful* response and deserves a clear empty-state message.",
    distractorNotes: {
      0: "Loading is finished — the request succeeded.",
      1: "An empty array is not a failure.",
      2: "A blank area leaves users unsure whether something broke.",
    },
    lessonId: "http-four-ui-states",
    source: "practice",
  },
  {
    id: "http-017",
    type: "mcq",
    topic: "http-api",
    subtopic: "Service modules",
    difficulty: "intermediate",
    marks: 1,
    minutes: 1,
    prompt:
      "Three components each call `fetch(\"http://localhost:5229/api/rooms\")` directly with copied header code. What does moving this into `roomsService.getRooms()` mainly achieve?",
    options: [
      "It makes the network request unnecessary.",
      "It guarantees the API can never return an error.",
      "It centralises the base URL, headers, error handling and typing so components focus on presentation and changes happen in one place.",
      "It moves the code to the server.",
    ],
    answer: 2,
    explanation:
      "A service module separates data access from UI. The base URL, `Authorization` header, `response.ok` checks and return types live in one place, making changes and testing (mocking) easier.",
    distractorNotes: {
      0: "The service still makes the request.",
      1: "Errors still happen; they are just handled consistently.",
      3: "The service module still runs in the browser.",
    },
    lessonId: "http-service-modules",
    source: "practice",
  },
  {
    id: "http-018",
    type: "tf",
    topic: "http-api",
    subtopic: "fetch and HTTP errors",
    difficulty: "beginner",
    marks: 1,
    minutes: 1,
    prompt:
      "The promise returned by `fetch()` rejects when the server responds with `404 Not Found`.",
    answer: false,
    explanation:
      "`fetch` resolves with a `Response` whose `ok` is false and `status` is 404. It only rejects for network errors, aborts or requests blocked (e.g. by CORS).",
    lessonId: "http-fetch-response-ok",
    source: "practice",
    misconception: "fetch rejects on 4xx/5xx",
  },
  {
    id: "http-019",
    type: "tf",
    topic: "http-api",
    subtopic: "Safe and idempotent methods",
    difficulty: "intermediate",
    marks: 1,
    minutes: 1,
    prompt: "`DELETE` is an idempotent HTTP method.",
    answer: true,
    explanation:
      "Deleting the same resource twice leaves the server in the same state (it is gone). The *status* of the second response may differ (e.g. 404), but idempotency is about the effect on server state.",
    lessonId: "http-methods-status",
    source: "practice",
    misconception: "Idempotent means identical response",
  },
  {
    id: "http-020",
    type: "tf",
    topic: "http-api",
    subtopic: "Status codes",
    difficulty: "beginner",
    marks: 1,
    minutes: 1,
    prompt:
      "A `503 Service Unavailable` response usually means the user typed invalid data into the form.",
    answer: false,
    explanation:
      "5xx codes are server-side problems. 503 means the server is temporarily unable to handle the request (overloaded or in maintenance). The frontend should show a \"try again later\" message, not a field validation error.",
    lessonId: "http-methods-status",
    source: "practice",
  },
  {
    id: "http-021",
    type: "tf",
    topic: "http-api",
    subtopic: "AbortController",
    difficulty: "intermediate",
    marks: 1,
    minutes: 1,
    prompt:
      "When a fetch is aborted with an `AbortController`, the fetch promise rejects with an error whose `name` is `\"AbortError\"`, so the catch block should usually ignore it rather than show an error message.",
    answer: true,
    explanation:
      "An aborted fetch rejects with a `DOMException` named `AbortError`. It is an expected cancellation (e.g. unmount), not a failure the user should see.",
    lessonId: "http-abortcontroller",
    source: "practice",
  },
  {
    id: "http-022",
    type: "tf",
    topic: "http-api",
    subtopic: "CORS",
    difficulty: "advanced",
    marks: 1,
    minutes: 1,
    prompt:
      "CORS is enforced by the browser; a tool such as Postman or `curl` can call the same API without being blocked by CORS.",
    answer: true,
    explanation:
      "CORS is a browser mechanism that protects users by restricting which origins' scripts may read responses. Non-browser clients do not apply it — which is also why CORS is not an access-control mechanism for the API itself.",
    lessonId: "http-cors",
    source: "practice",
    misconception: "CORS protects the server from all clients",
  },
  {
    id: "http-023",
    type: "tf",
    topic: "http-api",
    subtopic: "204 No Content",
    difficulty: "intermediate",
    marks: 1,
    minutes: 1,
    prompt:
      "After a successful `DELETE` that returns `204 No Content`, the frontend should call `response.json()` to read the deleted item.",
    answer: false,
    explanation:
      "A 204 has no body, so `response.json()` would reject. Check `response.ok` and then update the UI (remove the item locally or refetch the list).",
    lessonId: "http-fetch-response-ok",
    source: "practice",
  },
  {
    id: "http-024",
    type: "tf",
    topic: "http-api",
    subtopic: "Four UI states",
    difficulty: "beginner",
    marks: 1,
    minutes: 1,
    prompt:
      "A robust data-fetching component should handle loading, error, empty and success states separately.",
    answer: true,
    explanation:
      "Each state needs different feedback: a spinner/skeleton, an error message with retry, an empty-state message, and the actual data.",
    lessonId: "http-four-ui-states",
    source: "practice",
  },
  {
    id: "http-025",
    type: "short",
    topic: "http-api",
    subtopic: "fetch and HTTP errors",
    difficulty: "exam",
    marks: 3,
    minutes: 3,
    prompt:
      "Explain why a `try/catch` around `await fetch(url)` is **not enough** to detect a failed API call, and state what the code must additionally check.",
    rubric: [
      { criterion: "States fetch resolves (does not reject) for HTTP error statuses such as 404/500", marks: 1 },
      { criterion: "States fetch rejects only for network failure / abort / CORS block", marks: 1 },
      { criterion: "Says to check `response.ok` (or `response.status`) and throw/handle when false", marks: 1 },
    ],
    modelAnswer:
      "`fetch` only rejects when the request cannot complete — a network failure, an abort, or a CORS block. If the server answers with 404 or 500, fetch still **resolves** with a `Response`, so the `catch` never runs. The code must check `response.ok` (true only for 200–299) or `response.status`, and throw or handle the error itself, e.g. `if (!res.ok) throw new Error(\"HTTP \" + res.status)`.",
    explanation:
      "This is the most common fetch bug: treating an error page or error JSON as successful data.",
    lessonId: "http-fetch-response-ok",
    source: "practice",
    misconception: "fetch rejects on 4xx/5xx",
  },
  {
    id: "http-026",
    type: "short",
    topic: "http-api",
    subtopic: "CORS",
    difficulty: "advanced",
    marks: 3,
    minutes: 3,
    prompt:
      "A frontend at `http://localhost:5173` calls an API at `http://localhost:5229`. Explain (a) why these are different origins, (b) what a preflight request is, and (c) why CORS does not stop an attacker from calling the API directly.",
    rubric: [
      { criterion: "Origin = scheme + host + port; port differs, so cross-origin", marks: 1 },
      { criterion: "Preflight = browser OPTIONS request asking the server which methods/headers/origin are allowed before a non-simple request", marks: 1 },
      { criterion: "CORS is enforced by browsers only; non-browser clients ignore it, so the server still needs authentication/authorisation", marks: 1 },
    ],
    modelAnswer:
      "(a) An origin is scheme + host + port. Both use `http` and `localhost`, but the ports 5173 and 5229 differ, so the request is cross-origin.\n\n(b) For non-simple requests (e.g. `PUT`/`DELETE`, or headers like `Authorization` or `Content-Type: application/json`) the browser first sends an `OPTIONS` preflight with `Access-Control-Request-Method/Headers`. The server must reply with matching `Access-Control-Allow-Origin/Methods/Headers`, otherwise the browser does not send the real request.\n\n(c) CORS is a browser-enforced policy that controls which web pages can read responses. Tools like curl or Postman do not apply it, so the API must still enforce authentication and authorisation itself.",
    explanation:
      "CORS relaxes the same-origin policy; it is not an authentication or authorisation mechanism.",
    lessonId: "http-cors",
    source: "practice",
    misconception: "CORS is a security wall around the API",
  },
  {
    id: "http-027",
    type: "code",
    topic: "http-api",
    subtopic: "Service modules / POST",
    difficulty: "exam",
    marks: 5,
    minutes: 6,
    language: "ts",
    prompt: `Write an async TypeScript function \`createWorkshop(input: NewWorkshop, token: string): Promise<Workshop>\` that sends a **POST** to \`http://localhost:5229/api/workshops\`.

Requirements:
- Send JSON with the correct \`Content-Type\` header.
- Send the token as a bearer token.
- Throw an \`Error\` containing the status code if the response is not successful.
- Return the created workshop parsed from the response body.`,
    starterCode: `interface NewWorkshop {
  title: string;
  seats: number;
}
interface Workshop extends NewWorkshop {
  id: number;
}

const BASE_URL = "http://localhost:5229/api";

export async function createWorkshop(input: NewWorkshop, token: string): Promise<Workshop> {
  // TODO
}`,
    rubric: [
      { criterion: "Uses fetch with method \"POST\" and the correct URL", marks: 1 },
      { criterion: "Sets `Content-Type: application/json` and serialises the body with `JSON.stringify`", marks: 1 },
      { criterion: "Sends `Authorization: Bearer <token>`", marks: 1 },
      { criterion: "Checks `response.ok` and throws an Error including the status", marks: 1 },
      { criterion: "Returns `await response.json()` typed as Workshop", marks: 1 },
    ],
    modelAnswer: `\`\`\`ts
export async function createWorkshop(input: NewWorkshop, token: string): Promise<Workshop> {
  const response = await fetch(\`\${BASE_URL}/workshops\`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: \`Bearer \${token}\`,
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error(\`Create workshop failed: HTTP \${response.status}\`);
  }

  return (await response.json()) as Workshop;
}
\`\`\``,
    explanation:
      "The essentials: method, JSON header and serialised body, bearer token, an explicit `ok` check (because fetch does not reject on 4xx/5xx), and parsing the 201 body. Note the `as Workshop` cast does not validate the data at runtime.",
    lessonId: "http-service-modules",
    source: "practice",
  },
  {
    id: "http-028",
    type: "code",
    topic: "http-api",
    subtopic: "AbortController / four UI states",
    difficulty: "exam",
    marks: 6,
    minutes: 8,
    language: "tsx",
    prompt:
      "Write a custom Hook `useModules()` that fetches `GET https://example.com/api/modules` (an array of `{ id: number; code: string }`) when the component mounts. It must expose `data`, `loading` and `error`, treat non-2xx responses as errors, and use an `AbortController` so no state is updated after unmount (ignore `AbortError`).",
    rubric: [
      { criterion: "useState for data, loading and error with sensible initial values", marks: 1 },
      { criterion: "useEffect with an empty dependency array performs the fetch", marks: 1 },
      { criterion: "Creates an AbortController and passes `signal` to fetch", marks: 1 },
      { criterion: "Checks `response.ok` and throws on failure", marks: 1 },
      { criterion: "Ignores AbortError and sets error otherwise; sets loading false when finished", marks: 1 },
      { criterion: "Cleanup function calls `controller.abort()`", marks: 1 },
    ],
    modelAnswer: `\`\`\`tsx
import { useEffect, useState } from "react";

interface Module {
  id: number;
  code: string;
}

export function useModules() {
  const [data, setData] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        const res = await fetch("https://example.com/api/modules", {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
        const json = (await res.json()) as Module[];
        setData(json);
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

  return { data, loading, error };
}
\`\`\``,
    explanation:
      "Aborting in cleanup cancels the request when the component unmounts (and in development StrictMode's simulated unmount). The `aborted` check stops state updates after cancellation; the `ok` check turns HTTP errors into the error state.",
    lessonId: "http-abortcontroller",
    source: "practice",
  },
];
