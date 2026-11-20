import type { Question } from "../types";

/** Markdown code fence helper. */
const F = "```";

export const webCssQuestions: Question[] = [
  /* ---------------------------------------------------------------- */
  /* How the web works                                                 */
  /* ---------------------------------------------------------------- */
  {
    id: "wc-001",
    type: "mcq",
    topic: "web",
    subtopic: "DNS",
    difficulty: "beginner",
    marks: 1,
    minutes: 1,
    prompt: "A user types `campus-events.example.ac.uk` into the browser. What is the job of DNS in this step?",
    options: [
      "To encrypt the connection between browser and server",
      "To translate the domain name into the IP address of the server",
      "To render the HTML into pixels",
      "To decide which React component to show",
    ],
    answer: 1,
    distractorNotes: {
      0: "Encryption is done by TLS (HTTPS), after the server's address is known.",
      2: "Rendering is the browser engine's job, after the response arrives.",
      3: "Component selection is client-side routing, long after DNS.",
    },
    explanation:
      "DNS (Domain Name System) resolves human-friendly host names to IP addresses so the browser can open a TCP/TLS connection to the right machine.",
    lessonId: "web-how-the-web-works",
    source: "practice",
  },
  {
    id: "wc-002",
    type: "mcq",
    topic: "web",
    subtopic: "URL anatomy",
    difficulty: "intermediate",
    marks: 1,
    minutes: 1,
    prompt: `Which part of this URL is NOT sent to the server in the HTTP request?

${F}text
https://shop.example.com:8443/products/42?sort=price#reviews
${F}`,
    options: ["`/products/42`", "`?sort=price`", "`:8443`", "`#reviews`"],
    answer: 3,
    distractorNotes: {
      0: "The path is sent in the request line (`GET /products/42?sort=price`).",
      1: "The query string is sent as part of the request target.",
      2: "The port decides where the connection is made (and appears in the Host header).",
    },
    explanation:
      "The fragment (after `#`) is handled only by the browser, e.g. to scroll to an element with `id=\"reviews\"`. It is never included in the HTTP request.",
    lessonId: "web-how-the-web-works",
    source: "practice",
  },
  {
    id: "wc-003",
    type: "mcq",
    topic: "web",
    subtopic: "SPA vs MPA",
    difficulty: "beginner",
    marks: 1,
    minutes: 1,
    prompt: "Which statement best describes a Single-Page Application (SPA) such as a React + Vite app?",
    options: [
      "Every navigation downloads a new HTML document from the server",
      "It can only have one screen of content",
      "The browser loads one HTML document and JavaScript; navigation updates the view and URL on the client, and data is fetched as JSON",
      "It does not use HTTP at all after the first request",
    ],
    answer: 2,
    distractorNotes: {
      0: "That describes a multi-page application (MPA).",
      1: "\"Single page\" refers to one HTML document, not one screen; client-side routing provides many views.",
      3: "SPAs still make HTTP requests, typically to a JSON API.",
    },
    explanation:
      "An SPA swaps components in place and talks to an API for data, giving fast navigation but requiring client-side routing and care with initial load and SEO.",
    lessonId: "web-spa-vs-mpa",
    source: "practice",
  },
  {
    id: "wc-004",
    type: "mcq",
    topic: "web",
    subtopic: "DTO vs model",
    difficulty: "intermediate",
    marks: 1,
    minutes: 1,
    prompt:
      "The backend `User` entity has `PasswordHash` and `Bookings`, but the API returns `{ id, email, firstName, role }`. What is this returned shape called and why is it used?",
    options: [
      "A DTO (Data Transfer Object): a shape designed for the API boundary that exposes only what the client needs and hides internal fields",
      "A database migration, used to create tables",
      "A JWT, used to prove identity",
      "A React prop type, used to type components",
    ],
    answer: 0,
    distractorNotes: {
      1: "Migrations change the database schema; they are not response shapes.",
      2: "A JWT is a signed token string, not a response object for user data.",
      3: "The frontend may type it with an interface, but the concept here is the server's transfer shape.",
    },
    explanation:
      "DTOs decouple the API contract from the internal model, prevent leaking sensitive data (like password hashes) and avoid over-fetching or circular references.",
    lessonId: "web-mvc-dtos",
    source: "practice",
  },
  {
    id: "wc-005",
    type: "mcq",
    topic: "http-api",
    subtopic: "CORS",
    difficulty: "exam",
    marks: 1,
    minutes: 2,
    prompt:
      "A React app at `http://localhost:5173` calls `http://localhost:5229/api/events`. The console shows *\"blocked by CORS policy: No 'Access-Control-Allow-Origin' header\"*, yet the same request works in Postman. What is the correct explanation?",
    options: [
      "The API is down; Postman is showing a cached response",
      "CORS is enforced by the browser for cross-origin requests; the SERVER must allow the origin `http://localhost:5173` in its CORS policy",
      "The frontend must add an `Access-Control-Allow-Origin` header to its request",
      "React apps cannot call APIs on a different port",
    ],
    answer: 1,
    distractorNotes: {
      0: "Postman is not a browser and does not apply CORS, so it receives the real response.",
      2: "`Access-Control-Allow-Origin` is a RESPONSE header the server sends; adding it to the request does nothing.",
      3: "They can, as long as the server allows that origin. Different port = different origin.",
    },
    explanation:
      "Origin = scheme + host + port. The browser only lets JavaScript read a cross-origin response if the server opts in with CORS headers (and answers preflight OPTIONS requests where needed).",
    lessonId: "http-cors",
    source: "practice",
    misconception: "CORS is fixed on the client",
  },
  /* ---------------------------------------------------------------- */
  /* CSS                                                               */
  /* ---------------------------------------------------------------- */
  {
    id: "wc-006",
    type: "mcq",
    topic: "html-css",
    subtopic: "Specificity",
    difficulty: "advanced",
    marks: 1,
    minutes: 2,
    prompt: `What colour is the paragraph text?

${F}html
<section id="main" class="content">
  <div class="card">
    <p class="note">Doors open at 7pm</p>
  </div>
</section>
${F}

${F}css
.content .card p.note { color: blue; }
#main .card p { color: red; }
p { color: green; }
${F}`,
    options: ["blue", "green", "red", "black (the default)"],
    answer: 2,
    distractorNotes: {
      0: "Three classes + one element = (0,3,1). One ID beats any number of classes.",
      1: "A type selector has the lowest specificity (0,0,1); order only matters when specificity ties.",
      3: "All three rules match, so one of them applies.",
    },
    explanation:
      "Specificity (IDs, classes, types): `#main .card p` = (1,1,1), `.content .card p.note` = (0,3,1), `p` = (0,0,1). The ID column wins first, so the text is **red**.",
    lessonId: "css-box-model-cascade",
    source: "practice",
    misconception: "more classes beat an ID",
  },
  {
    id: "wc-007",
    type: "mcq",
    topic: "html-css",
    subtopic: "Box model",
    difficulty: "intermediate",
    marks: 1,
    minutes: 2,
    prompt: `With the default \`box-sizing: content-box\`, how wide is the element's border box (outer edge of the border)?

${F}css
.card {
  width: 200px;
  padding: 20px;
  border: 5px solid #333;
  margin: 10px;
}
${F}`,
    options: ["200px", "270px", "230px", "250px"],
    answer: 3,
    distractorNotes: {
      0: "200px is only the content width with `content-box`; it would be the border-box width with `box-sizing: border-box`.",
      1: "270px adds the margins too, but margins sit outside the border.",
      2: "230px forgets that padding and border apply to both left and right sides.",
    },
    explanation:
      "content-box: 200 (content) + 2 x 20 (padding) + 2 x 5 (border) = **250px**. Margins add space outside that.",
    lessonId: "css-box-model-cascade",
    source: "practice",
  },
  {
    id: "wc-008",
    type: "mcq",
    topic: "html-css",
    subtopic: "Flexbox vs Grid",
    difficulty: "beginner",
    marks: 1,
    minutes: 1,
    prompt:
      "A dashboard needs cards aligned in both rows AND columns, with a header spanning the full width. Which layout tool fits best?",
    options: [
      "CSS Grid, because it controls two dimensions (rows and columns) at once",
      "Flexbox, because it is designed for two-dimensional layouts",
      "`float: left` on every card",
      "`position: absolute` with manual offsets",
    ],
    answer: 0,
    distractorNotes: {
      1: "Flexbox is one-dimensional: it lays items out along a single row or column.",
      2: "Floats are a legacy technique for wrapping text around images, not layout.",
      3: "Absolute positioning removes items from flow and breaks responsiveness.",
    },
    explanation:
      "Grid suits page-level two-dimensional layouts; flexbox is ideal for one-dimensional groups like nav bars or a row of buttons. They are often combined.",
    lessonId: "css-grid",
    source: "practice",
  },
  {
    id: "wc-009",
    type: "mcq",
    topic: "html-css",
    subtopic: "grid-template-areas",
    difficulty: "advanced",
    marks: 1,
    minutes: 2,
    prompt: "Which `grid-template-areas` value is INVALID?",
    options: [
      "`\"head head\" \"nav main\"`",
      "`\"head head\" \"nav main\" \"foot foot\"`",
      "`\"head head\" \"nav head\"`",
      "`\"head head\" \". main\"`",
    ],
    answer: 2,
    distractorNotes: {
      0: "Two rows of two cells; every name forms a rectangle.",
      1: "Three rows of two cells; `head` and `foot` each span a full row.",
      3: "`.` marks an empty cell, which is allowed.",
    },
    explanation:
      "Each named area must form a single rectangle. In option C `head` occupies both top cells and the bottom-right cell, an L-shape, so the declaration is invalid and ignored.",
    lessonId: "css-grid",
    source: "practice",
  },
  {
    id: "wc-010",
    type: "mcq",
    topic: "html-css",
    subtopic: "auto-fit & minmax",
    difficulty: "intermediate",
    marks: 1,
    minutes: 1,
    prompt: "What does `grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));` do?",
    options: [
      "Always creates exactly 220 columns",
      "Creates as many columns as fit, each at least 220px wide, sharing any leftover space equally - with no media queries needed",
      "Creates one 220px column and one flexible column",
      "Makes each column exactly 1fr regardless of screen size",
    ],
    answer: 1,
    distractorNotes: {
      0: "`220px` is the minimum TRACK SIZE, not a column count.",
      2: "`repeat(auto-fit, ...)` creates a variable number of tracks.",
      3: "`minmax` sets a 220px minimum, so columns wrap rather than shrinking below it.",
    },
    explanation:
      "The browser fits as many 220px-minimum columns as the container allows; `1fr` max lets them stretch to fill the row. Fewer columns appear on narrow screens automatically.",
    lessonId: "css-grid",
    source: "practice",
  },
  {
    id: "wc-011",
    type: "mcq",
    topic: "html-css",
    subtopic: "clamp()",
    difficulty: "exam",
    marks: 1,
    minutes: 2,
    prompt: `The root font size is 16px. On a 1200px-wide viewport, what is the computed font size of \`h1\`?

${F}css
h1 { font-size: clamp(1rem, 2.5vw, 2rem); }
${F}`,
    options: ["16px", "32px", "30px", "40px"],
    answer: 2,
    distractorNotes: {
      0: "16px (1rem) is the MINIMUM, used only when 2.5vw is smaller (viewports under 640px).",
      1: "32px (2rem) is the MAXIMUM, reached only on viewports of 1280px or wider.",
      3: "40px is above the 2rem maximum, so clamp would never return it.",
    },
    explanation:
      "2.5vw of 1200px = 30px, which lies between 16px and 32px, so the preferred value is used: **30px**.",
    lessonId: "css-responsive-clamp",
    source: "practice",
  },
  {
    id: "wc-012",
    type: "mcq",
    topic: "html-css",
    subtopic: "Mobile-first media queries",
    difficulty: "intermediate",
    marks: 1,
    minutes: 1,
    prompt: "Which pattern is mobile-first?",
    options: [
      "Desktop styles by default, then `@media (max-width: 767px)` to undo them for phones",
      "Separate stylesheets for every device model",
      "Using `px` only so layouts never change",
      "Simple single-column styles by default, then `@media (min-width: 768px)` to add multi-column layouts for larger screens",
    ],
    answer: 3,
    distractorNotes: {
      0: "That is desktop-first: phones download and then override desktop rules.",
      1: "Device-specific stylesheets do not scale; breakpoints should follow the content.",
      2: "Fixed pixels are the opposite of responsive design.",
    },
    explanation:
      "Mobile-first starts from the smallest layout and progressively enhances with `min-width` queries, keeping base CSS simple for small devices.",
    lessonId: "css-responsive-clamp",
    source: "practice",
  },
  {
    id: "wc-013",
    type: "mcq",
    topic: "html-css",
    subtopic: ":focus-visible",
    difficulty: "intermediate",
    marks: 1,
    minutes: 1,
    prompt:
      "A designer dislikes the focus ring that appears when buttons are clicked with a mouse. Which CSS keeps the page accessible to keyboard users?",
    options: [
      "`button:focus { outline: none; }`",
      "`button:focus-visible { outline: 3px solid #1d4ed8; outline-offset: 2px; }`",
      "`* { outline: 0 !important; }`",
      "`button:hover { outline: 3px solid #1d4ed8; }`",
    ],
    answer: 1,
    distractorNotes: {
      0: "This removes the indicator for keyboard users too, so they cannot see where focus is.",
      2: "This removes every focus indicator on the page, a serious accessibility failure.",
      3: "Hover only applies to pointers; keyboard focus still has no clear indicator.",
    },
    explanation:
      "`:focus-visible` matches when the browser decides a visible focus indicator is appropriate (typically keyboard navigation), so you can style a strong ring without showing it on every mouse click.",
    lessonId: "a11y-focus-keyboard",
    source: "practice",
  },
  {
    id: "wc-014",
    type: "mcq",
    topic: "html-css",
    subtopic: "Bootstrap breakpoints",
    difficulty: "exam",
    marks: 1,
    minutes: 2,
    prompt: `In Bootstrap 5, how many of these cards appear per row on an 800px-wide viewport?

${F}html
<div class="row">
  <div class="col-12 col-md-6 col-lg-4">...</div>
  <div class="col-12 col-md-6 col-lg-4">...</div>
  <div class="col-12 col-md-6 col-lg-4">...</div>
</div>
${F}`,
    options: ["1", "3", "2", "4"],
    answer: 2,
    distractorNotes: {
      0: "`col-12` applies only below `md` (under 768px).",
      1: "`col-lg-4` (3 per row) needs the `lg` breakpoint, 992px or wider.",
      3: "No class here gives a width of 3/12.",
    },
    explanation:
      "Bootstrap is mobile-first: `md` applies from 768px up, `lg` from 992px. At 800px the active class is `col-md-6` = 6 of 12 columns, so **2 cards per row**.",
    lessonId: "css-bootstrap-grid",
    source: "practice",
  },
  /* ---------------------------------------------------------------- */
  /* True / False                                                      */
  /* ---------------------------------------------------------------- */
  {
    id: "wc-015",
    type: "tf",
    topic: "web",
    subtopic: "HTTP statelessness",
    difficulty: "beginner",
    marks: 1,
    minutes: 1,
    prompt:
      "HTTP is stateless: each request is independent, which is why cookies, sessions or tokens (e.g. a JWT in the Authorization header) are used to identify the user across requests.",
    answer: true,
    explanation: "The server does not remember previous requests by itself; the client must send identifying information each time.",
    lessonId: "web-how-the-web-works",
    source: "practice",
  },
  {
    id: "wc-016",
    type: "tf",
    topic: "html-css",
    subtopic: "Semantic HTML",
    difficulty: "intermediate",
    marks: 1,
    minutes: 1,
    prompt:
      "`<div onclick=\"save()\">Save</div>` is as accessible as `<button>Save</button>`, because screen readers announce both as buttons.",
    answer: false,
    explanation:
      "A `div` has no button role, is not in the tab order and does not respond to Enter/Space. `<button>` provides role, focusability and keyboard activation for free.",
    lessonId: "html-semantic-forms",
    source: "practice",
    misconception: "any clickable element is a button",
  },
  {
    id: "wc-017",
    type: "tf",
    topic: "html-css",
    subtopic: "Labels",
    difficulty: "beginner",
    marks: 1,
    minutes: 1,
    prompt:
      "Associating `<label for=\"email\">Email</label>` with `<input id=\"email\">` gives the input an accessible name, and clicking the label focuses the input.",
    answer: true,
    explanation:
      "Matching `for`/`id` (or `htmlFor` in JSX) links the two. A placeholder is not a substitute for a label because it disappears when typing.",
    lessonId: "html-semantic-forms",
    source: "practice",
  },
  {
    id: "wc-018",
    type: "tf",
    topic: "http-api",
    subtopic: "CORS",
    difficulty: "exam",
    marks: 1,
    minutes: 1,
    prompt: "A CORS error in the browser means the request would also fail when sent from Postman or curl.",
    answer: false,
    explanation:
      "CORS is a browser security policy that controls whether JavaScript may read a cross-origin response. Non-browser tools do not enforce it, so the same request usually succeeds there.",
    lessonId: "http-cors",
    source: "practice",
    misconception: "CORS is a server-side failure",
  },
  {
    id: "wc-019",
    type: "tf",
    topic: "html-css",
    subtopic: "Bootstrap breakpoints",
    difficulty: "intermediate",
    marks: 1,
    minutes: 1,
    prompt:
      "In Bootstrap 5, `col-sm-6` applies from the `sm` breakpoint (576px) upwards unless a larger-breakpoint class such as `col-lg-3` overrides it.",
    answer: true,
    explanation: "Bootstrap's breakpoint classes use `min-width` media queries, so each applies at its breakpoint and above.",
    lessonId: "css-bootstrap-grid",
    source: "practice",
  },
  /* ---------------------------------------------------------------- */
  /* Short answers                                                     */
  /* ---------------------------------------------------------------- */
  {
    id: "wc-020",
    type: "short",
    topic: "html-css",
    subtopic: "Semantic HTML",
    difficulty: "intermediate",
    marks: 3,
    minutes: 4,
    prompt: "Give three benefits of using semantic elements such as `<header>`, `<nav>`, `<main>` and `<button>` instead of generic `<div>` elements.",
    rubric: [
      { criterion: "Accessibility: assistive technology gets roles/landmarks and can navigate by them", marks: 1 },
      { criterion: "Built-in behaviour: e.g. buttons are focusable and keyboard-operable; forms submit", marks: 1 },
      { criterion: "Readability/maintainability and SEO: meaning is clear to developers and search engines", marks: 1 },
    ],
    modelAnswer:
      "1) Accessibility: semantic elements expose roles and landmarks, so screen-reader users can jump to the `<nav>` or `<main>` region and hear that a `<button>` is a button. 2) Free behaviour: `<button>` is focusable and activates with Enter/Space, and `<label>`/`<form>` give native form behaviour, so no extra JavaScript or ARIA is needed. 3) Clarity and SEO: the code documents its structure for other developers, and search engines can understand page structure better.",
    explanation: "Use the native element that matches the meaning first; add ARIA only when no suitable element exists.",
    lessonId: "html-semantic-forms",
    source: "practice",
  },
  {
    id: "wc-021",
    type: "short",
    topic: "web",
    subtopic: "Request lifecycle",
    difficulty: "beginner",
    marks: 3,
    minutes: 4,
    prompt: "Outline what happens between a user entering `https://example.com/events` in the address bar and the page appearing.",
    rubric: [
      { criterion: "DNS lookup resolves the host name to an IP address", marks: 1 },
      { criterion: "Connection (TCP + TLS for HTTPS) then an HTTP GET request; the server responds with status, headers and HTML", marks: 1 },
      { criterion: "Browser parses HTML, requests CSS/JS/images, builds the DOM/CSSOM and renders (an SPA's JS then fetches data from the API)", marks: 1 },
    ],
    modelAnswer:
      "The browser parses the URL and uses DNS to find the IP address for `example.com`. It opens a TCP connection and performs a TLS handshake (HTTPS), then sends `GET /events` with headers. The server replies with a status code (e.g. 200), headers and an HTML document. The browser parses the HTML into the DOM, downloads the linked CSS, JavaScript and images, applies styles and paints the page. In a React SPA the downloaded JavaScript then renders the UI and fetches JSON data from the API.",
    explanation: "Each step is a place where things can fail: DNS errors, TLS issues, HTTP status codes, or JS/runtime errors.",
    lessonId: "web-how-the-web-works",
    source: "practice",
  },
  /* ---------------------------------------------------------------- */
  /* Code questions                                                    */
  /* ---------------------------------------------------------------- */
  {
    id: "wc-022",
    type: "code",
    topic: "html-css",
    subtopic: "Responsive grid",
    difficulty: "exam",
    marks: 5,
    minutes: 8,
    language: "css",
    prompt: `Write CSS for an events page:

- \`.event-grid\` shows cards in ONE column by default (mobile-first), and from 768px upwards uses a grid that fits as many columns of at least 250px as possible, with a 1rem gap.
- \`.event-grid h2\` font size scales fluidly between 1.25rem and 2rem, preferring 3vw.
- Links inside cards (\`.event-card a\`) show a clear 3px outline only when focused via keyboard.`,
    rubric: [
      { criterion: "`display: grid` with a single-column default and a gap", marks: 1 },
      { criterion: "`@media (min-width: 768px)` (mobile-first) enhancement", marks: 1 },
      { criterion: "`repeat(auto-fit, minmax(250px, 1fr))` (auto-fill also accepted)", marks: 1 },
      { criterion: "`font-size: clamp(1.25rem, 3vw, 2rem)`", marks: 1 },
      { criterion: "`:focus-visible` rule with a visible outline (not removing focus styles)", marks: 1 },
    ],
    modelAnswer: `${F}css
.event-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 768px) {
  .event-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }
}

.event-grid h2 {
  font-size: clamp(1.25rem, 3vw, 2rem);
}

.event-card a:focus-visible {
  outline: 3px solid #1d4ed8;
  outline-offset: 2px;
}
${F}`,
    explanation:
      "Mobile-first base + `min-width` query, an intrinsic grid with `auto-fit`/`minmax`, fluid type with `clamp`, and keyboard-friendly focus with `:focus-visible`.",
    lessonId: "css-grid",
    source: "practice",
  },
  {
    id: "wc-023",
    type: "code",
    topic: "html-css",
    subtopic: "Accessible forms",
    difficulty: "intermediate",
    marks: 4,
    minutes: 6,
    language: "html",
    prompt: `Find the accessibility and semantic problems in this sign-up form and rewrite it.

${F}html
<div class="form">
  <input placeholder="Email">
  <input placeholder="Password">
  <div class="btn" onclick="signUp()">Sign up</div>
</div>
${F}`,
    rubric: [
      { criterion: "Uses a `<form>` element (submit handled by the form)", marks: 1 },
      { criterion: "Adds visible `<label>`s linked with `for`/`id` (placeholder is not a label)", marks: 1 },
      { criterion: "Uses correct input types (`email`, `password`) and `name` / `autocomplete` / `required` as appropriate", marks: 1 },
      { criterion: "Replaces the clickable div with `<button type=\"submit\">`", marks: 1 },
    ],
    modelAnswer: `${F}html
<form id="signup-form">
  <label for="email">Email</label>
  <input id="email" name="email" type="email" autocomplete="email" required>

  <label for="password">Password</label>
  <input id="password" name="password" type="password" autocomplete="new-password" required>

  <button type="submit">Sign up</button>
</form>
${F}`,
    explanation:
      "Labels give inputs accessible names; proper input types give the right mobile keyboard and masking; a real submit button is focusable and works with Enter. Handle the form's `submit` event in JavaScript (or `onSubmit` in React).",
    lessonId: "html-semantic-forms",
    source: "practice",
  },
];
