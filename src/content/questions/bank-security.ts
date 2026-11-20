import type { Question } from "../types";

/**
 * Practice bank — Front-end authentication & security.
 * Includes Section-E-style 2-mark items. All tokens shown are fictional.
 */
export const securityQuestions: Question[] = [
  {
    id: "sec-001",
    type: "mcq",
    topic: "security",
    subtopic: "Authentication vs authorisation",
    difficulty: "beginner",
    marks: 1,
    minutes: 1,
    prompt:
      "A user logs in successfully, then tries to open the admin dashboard and is refused because their role is `USER`. Which process refused them?",
    options: [
      "Authentication",
      "Encryption",
      "Authorisation",
      "Serialisation",
    ],
    answer: 2,
    explanation:
      "Authentication established *who* they are (the login). Authorisation decides *what* that identity may do — here, the role check.",
    distractorNotes: {
      0: "Authentication already succeeded at login.",
      1: "Encryption protects data confidentiality; it does not decide permissions.",
      3: "Serialisation converts data to a transferable format (e.g. JSON).",
    },
    lessonId: "sec-authn-authz",
    source: "practice",
    misconception: "Authentication and authorisation are the same",
  },
  {
    id: "sec-002",
    type: "mcq",
    topic: "security",
    subtopic: "JWT structure",
    difficulty: "beginner",
    marks: 1,
    minutes: 1,
    prompt: "A signed JWT (JWS compact form) consists of which three dot-separated parts?",
    options: [
      "Username, password, expiry",
      "Header, payload, signature",
      "Public key, private key, salt",
      "Cookie, session, token",
    ],
    answer: 1,
    explanation:
      "`xxxxx.yyyyy.zzzzz` = Base64URL-encoded header (algorithm, type), Base64URL-encoded payload (claims), and the signature computed over the first two parts.",
    distractorNotes: {
      0: "A JWT must never contain a password.",
      2: "Keys are held by the issuer/verifier, not embedded as token parts.",
      3: "These are different session mechanisms, not JWT parts.",
    },
    lessonId: "sec-jwt-anatomy",
    source: "practice",
  },
  {
    id: "sec-003",
    type: "mcq",
    topic: "security",
    subtopic: "Base64URL is not encryption",
    difficulty: "exam",
    marks: 2,
    minutes: 2,
    prompt:
      "A developer proposes putting a user's home address in the payload of a signed JWT, arguing \"it's safe because the token is encoded\". What is the best response?",
    options: [
      "Agree — Base64URL encoding hides the data from anyone without the secret key.",
      "Agree — the signature encrypts the payload.",
      "Disagree — only the header is readable; the payload is encrypted.",
      "Disagree — the payload is only Base64URL-encoded, so anyone holding the token can decode and read it; the signature prevents undetected tampering but does not provide confidentiality.",
    ],
    answer: 3,
    explanation:
      "Encoding is reversible without any key. A signed JWT gives integrity/authenticity, not secrecy, so sensitive data should not be placed in its payload (JWE exists for encrypted tokens, but standard login JWTs are signed only).",
    distractorNotes: {
      0: "Base64URL decoding needs no key at all.",
      1: "Signing is not encryption; the payload stays readable.",
      2: "Header and payload are both just encoded.",
    },
    lessonId: "sec-jwt-anatomy",
    source: "practice",
    misconception: "Encoded means encrypted",
  },
  {
    id: "sec-004",
    type: "mcq",
    topic: "security",
    subtopic: "Decode vs verify",
    difficulty: "exam",
    marks: 2,
    minutes: 2,
    prompt:
      "A React app decodes the JWT payload in the browser and reads `role: \"ADMIN\"`. What can the app safely conclude?",
    options: [
      "The user is definitely an admin, so admin API calls will succeed.",
      "The token's signature has been verified.",
      "It may use the claim to adjust the UI (e.g. show an admin menu), but only the server — which verifies the signature with its key — can trust the claim for access decisions.",
      "The token cannot have expired.",
    ],
    answer: 2,
    explanation:
      "Decoding just reads the Base64URL text; it proves nothing about authenticity. A modified token would decode fine. The API verifies the signature and enforces roles on every request.",
    distractorNotes: {
      0: "The server decides; a tampered or revoked token would be rejected.",
      1: "Decoding performs no verification; the browser normally doesn't hold the signing secret.",
      3: "Decoding doesn't check `exp`; you must compare it to the current time.",
    },
    lessonId: "sec-jwt-anatomy",
    source: "practice",
    misconception: "Decoding a JWT verifies it",
  },
  {
    id: "sec-005",
    type: "mcq",
    topic: "security",
    subtopic: "exp claim",
    difficulty: "advanced",
    marks: 1,
    minutes: 2,
    prompt:
      "A decoded payload contains `\"exp\": 1795000000`. Which expression correctly tests whether the token has expired?",
    options: [
      "`payload.exp < Date.now()`",
      "`payload.exp * 1000 <= Date.now()`",
      "`payload.exp > Date.now() / 1000`",
      "`new Date(payload.exp) < new Date()`",
    ],
    answer: 1,
    explanation:
      "`exp` is a NumericDate: **seconds** since the Unix epoch. `Date.now()` returns **milliseconds**, so multiply `exp` by 1000 (or divide `Date.now()` by 1000) before comparing.",
    distractorNotes: {
      0: "Compares seconds with milliseconds, so almost any token looks expired.",
      2: "This is true when the token is still *valid* — the logic is inverted.",
      3: "`new Date(seconds)` treats the value as milliseconds, giving a date in 1970.",
    },
    lessonId: "sec-401-403-expiry",
    source: "practice",
    misconception: "exp is in milliseconds",
  },
  {
    id: "sec-006",
    type: "mcq",
    topic: "security",
    subtopic: "Expired token handling",
    difficulty: "exam",
    marks: 2,
    minutes: 2,
    prompt:
      "A user leaves a booking app open overnight. In the morning, clicking \"My bookings\" returns `401 Unauthorized` because the access token expired. What should the frontend normally do?",
    options: [
      "Clear the stored auth state and send the user to sign in again (optionally returning them to the page afterwards), or attempt a refresh-token flow if the app has one.",
      "Keep showing the page with cached data and ignore the 401.",
      "Change the `exp` claim in the stored token to a later time.",
      "Retry the request every second until it works.",
    ],
    answer: 0,
    explanation:
      "401 means the credentials are missing/invalid/expired. The app should treat the user as logged out (or renew via a refresh flow) and re-authenticate.",
    distractorNotes: {
      1: "The user is no longer authenticated; protected data should not be treated as current.",
      2: "Editing the payload invalidates the signature; the server will reject it.",
      3: "An expired token will never start working again.",
    },
    lessonId: "sec-401-403-expiry",
    source: "practice",
  },
  {
    id: "sec-007",
    type: "mcq",
    topic: "security",
    subtopic: "401 vs 403",
    difficulty: "intermediate",
    marks: 1,
    minutes: 1,
    prompt:
      "A logged-in `USER` sends a valid token to `DELETE /api/events/9`, an ADMIN-only endpoint. Which response is expected?",
    options: [
      "401 Unauthorized",
      "204 No Content",
      "404 Not Found",
      "403 Forbidden",
    ],
    answer: 3,
    explanation:
      "The server knows who the user is (valid token) but they lack permission: 403. The frontend should show \"You don't have permission\" — logging in again would not help.",
    distractorNotes: {
      0: "401 is for missing/invalid/expired credentials; this token is valid.",
      1: "204 would mean the delete succeeded.",
      2: "Some APIs hide existence with 404, but the conventional answer for insufficient permission is 403.",
    },
    lessonId: "sec-401-403-expiry",
    source: "practice",
  },
  {
    id: "sec-008",
    type: "mcq",
    topic: "security",
    subtopic: "Refresh tokens",
    difficulty: "advanced",
    marks: 1,
    minutes: 2,
    prompt:
      "Why do many systems pair a **short-lived access token** with a **longer-lived refresh token**?",
    options: [
      "So the access token can contain the user's password.",
      "To limit the damage window if an access token leaks, while letting the user obtain new access tokens without logging in again.",
      "Because refresh tokens make CORS unnecessary.",
      "Because access tokens cannot be sent over HTTPS.",
    ],
    answer: 1,
    explanation:
      "A stolen access token is useful only until it expires. The refresh token (often in an HttpOnly cookie, sent only to the refresh endpoint) is used to obtain new ones and can be revoked server-side.",
    distractorNotes: {
      0: "Tokens should never contain passwords.",
      2: "CORS is unrelated to token lifetimes.",
      3: "Tokens should always be sent over HTTPS.",
    },
    lessonId: "sec-401-403-expiry",
    source: "practice",
  },
  {
    id: "sec-009",
    type: "mcq",
    topic: "security",
    subtopic: "Token storage",
    difficulty: "exam",
    marks: 2,
    minutes: 2,
    prompt:
      "Which statement about storing an access token in `localStorage` is accurate?",
    options: [
      "It is completely safe because localStorage is encrypted by the browser.",
      "Other websites can read it directly.",
      "It persists across reloads and is easy to attach as a bearer header, but any script running on the page — including injected script from an XSS flaw — can read it.",
      "It is automatically sent with every request like a cookie.",
    ],
    answer: 2,
    explanation:
      "localStorage is scoped to the origin (other sites can't read it) but is fully readable by JavaScript on that origin. That is the main trade-off versus HttpOnly cookies.",
    distractorNotes: {
      0: "localStorage is not an encryption mechanism and is readable by page scripts.",
      1: "The same-origin policy prevents other origins from reading it.",
      3: "localStorage values are only sent if your code attaches them.",
    },
    lessonId: "sec-token-storage",
    source: "practice",
  },
  {
    id: "sec-010",
    type: "mcq",
    topic: "security",
    subtopic: "HttpOnly cookies",
    difficulty: "advanced",
    marks: 1,
    minutes: 2,
    prompt:
      "A session token is stored in a cookie set by the server with `HttpOnly; Secure; SameSite=Lax`. Which statement is correct?",
    options: [
      "`document.cookie` cannot read it, and the browser attaches it automatically to matching requests (only over HTTPS).",
      "React can read it with `document.cookie` and put it in the `Authorization` header.",
      "It makes the site immune to every kind of attack.",
      "It is stored in localStorage by the browser.",
    ],
    answer: 0,
    explanation:
      "`HttpOnly` hides the cookie from JavaScript, reducing token theft via XSS. `Secure` restricts it to HTTPS; `SameSite` limits cross-site sending (helping against CSRF). XSS can still make requests *as* the user, so it must still be prevented.",
    distractorNotes: {
      1: "HttpOnly specifically prevents JavaScript access.",
      2: "It reduces specific risks; XSS and other flaws still matter.",
      3: "Cookies are a separate storage mechanism.",
    },
    lessonId: "sec-token-storage",
    source: "practice",
    misconception: "HttpOnly cookies make an app fully secure",
  },
  {
    id: "sec-011",
    type: "mcq",
    topic: "security",
    subtopic: "XSS",
    difficulty: "exam",
    marks: 2,
    minutes: 2,
    prompt: `A review component renders user-submitted text. Which version is vulnerable to XSS?

\`\`\`tsx
// A
<p>{review.text}</p>
// B
<p dangerouslySetInnerHTML={{ __html: review.text }} />
\`\`\``,
    options: [
      "A, because JSX inserts raw HTML.",
      "Both are equally safe.",
      "Both are vulnerable.",
      "B, because it inserts the string as HTML, so markup such as `<img src=x onerror=...>` would execute.",
    ],
    answer: 3,
    explanation:
      "JSX `{...}` escapes strings and renders them as text. `dangerouslySetInnerHTML` bypasses that. If HTML really must be rendered, sanitise it first with a vetted library such as DOMPurify.",
    distractorNotes: {
      0: "JSX expressions escape text, so tags appear literally.",
      1: "B renders untrusted HTML.",
      2: "A is escaped by React.",
    },
    lessonId: "sec-xss-csrf-https",
    source: "practice",
  },
  {
    id: "sec-012",
    type: "mcq",
    topic: "security",
    subtopic: "CSRF and SameSite",
    difficulty: "advanced",
    marks: 1,
    minutes: 2,
    prompt: "Which application is **most** exposed to classic CSRF attacks?",
    options: [
      "An app that sends a bearer token from memory in the `Authorization` header.",
      "An app that authenticates with a cookie that the browser sends automatically, without `SameSite` restrictions or anti-CSRF tokens.",
      "A static site with no login.",
      "An app that only uses GET requests for reading public data.",
    ],
    answer: 1,
    explanation:
      "CSRF tricks the browser into sending a request with credentials it attaches **automatically** (cookies). Defences: `SameSite=Lax/Strict` cookies, anti-CSRF tokens, checking `Origin`. A manually attached header isn't added by a forged cross-site request.",
    distractorNotes: {
      0: "A malicious site cannot make the browser attach your in-memory bearer token.",
      2: "No authenticated actions means nothing to forge.",
      3: "Reading public data has no state change to forge.",
    },
    lessonId: "sec-xss-csrf-https",
    source: "practice",
  },
  {
    id: "sec-013",
    type: "mcq",
    topic: "security",
    subtopic: "Route guards are UX",
    difficulty: "exam",
    marks: 2,
    minutes: 2,
    prompt:
      "An app uses a `<ProtectedRoute>` that redirects non-admins away from `/admin`. A student says: \"Now the admin API is secure.\" Why is this wrong?",
    options: [
      "Because route guards only work with `createBrowserRouter`.",
      "Because the guard runs in the user's browser; anyone can call the API directly or modify the client code, so the API must check the token and role on every request.",
      "Because `<Navigate>` is deprecated.",
      "Because route guards encrypt the URL.",
    ],
    answer: 1,
    explanation:
      "Client-side guards improve UX (no confusing pages) but provide no security for the data. Authorisation is enforced by the server.",
    distractorNotes: {
      0: "Guards work with declarative `<Routes>` too.",
      2: "`<Navigate>` is a current React Router component.",
      3: "Routing does not encrypt anything.",
    },
    lessonId: "router-protected-routes",
    source: "practice",
    misconception: "Frontend guards are security",
  },
  {
    id: "sec-014",
    type: "mcq",
    topic: "security",
    subtopic: "IDOR",
    difficulty: "advanced",
    marks: 2,
    minutes: 2,
    prompt:
      "On `/bookings/57`, a user changes the URL to `/bookings/58` and sees another customer's booking. What is the vulnerability and where must it be fixed?",
    options: [
      "Insecure Direct Object Reference (broken access control) — the API must check that booking 58 belongs to the authenticated user.",
      "XSS — escape the booking id in JSX.",
      "CORS misconfiguration — remove `Access-Control-Allow-Origin`.",
      "Weak validation — use `Number.isInteger` on the route param.",
    ],
    answer: 0,
    explanation:
      "The server returned data based only on an id the client controls. Each request must be authorised against the resource owner; hiding or validating ids in React cannot fix it.",
    distractorNotes: {
      1: "No script injection is involved.",
      2: "CORS only governs browser cross-origin reads; the attacker is the legitimate user on the real site.",
      3: "58 is a valid integer; the problem is missing ownership checks.",
    },
    lessonId: "sec-trust-boundaries",
    source: "practice",
  },
  {
    id: "sec-015",
    type: "mcq",
    topic: "security",
    subtopic: "VITE_ env vars are public",
    difficulty: "exam",
    marks: 2,
    minutes: 2,
    prompt:
      "A Vite app reads `import.meta.env.VITE_PAYMENT_SECRET_KEY` to call a payment API directly from the browser. What is the problem?",
    options: [
      "`import.meta.env` is not available in Vite.",
      "Nothing — `.env` files are never shipped to the browser.",
      "`VITE_` variables are embedded into the client bundle at build time, so the secret is visible to anyone who loads the app; secret keys must stay on a server.",
      "Environment variables are encrypted by Vite.",
    ],
    answer: 2,
    explanation:
      "Vite exposes only `VITE_`-prefixed variables to client code precisely because they become public. Anything in browser code can be read via DevTools or the JS bundle.",
    distractorNotes: {
      0: "`import.meta.env` is Vite's standard way to read env variables.",
      1: "The `.env` file itself isn't served, but `VITE_` values are inlined into the bundle.",
      3: "Vite performs plain text replacement — no encryption.",
    },
    lessonId: "sec-trust-boundaries",
    source: "practice",
    misconception: "Env variables in frontend code are secret",
  },
  {
    id: "sec-016",
    type: "mcq",
    topic: "security",
    subtopic: "Untrusted API data",
    difficulty: "intermediate",
    marks: 1,
    minutes: 1,
    prompt:
      "A TypeScript interface `Event` describes the API response, and the code does `const e = (await res.json()) as Event`. What does this guarantee at runtime?",
    options: [
      "That the response matches `Event` exactly.",
      "Nothing — types are erased at compile time; to be sure, validate at runtime (e.g. with a Zod schema) and handle missing/unexpected values.",
      "That `res.ok` is true.",
      "That the data is free of malicious HTML.",
    ],
    answer: 1,
    explanation:
      "A type assertion tells the compiler to trust you; it adds no runtime checks. API data crosses a trust boundary and should be validated and rendered safely.",
    distractorNotes: {
      0: "No checking happens at runtime.",
      2: "`res.ok` must be checked separately.",
      3: "Types say nothing about content safety.",
    },
    lessonId: "sec-trust-boundaries",
    source: "practice",
    misconception: "TypeScript types validate API data",
  },
  {
    id: "sec-017",
    type: "tf",
    topic: "security",
    subtopic: "HTTPS",
    difficulty: "exam",
    marks: 2,
    minutes: 1,
    prompt:
      "Serving an app and its API over HTTPS encrypts tokens and form data **in transit**, but does not by itself protect a token that malicious script reads from `localStorage` inside the browser.",
    answer: true,
    explanation:
      "TLS protects data between browser and server (against eavesdropping and tampering on the network). Once data is in the page, HTTPS offers no defence against XSS or other client-side compromise.",
    lessonId: "sec-xss-csrf-https",
    source: "practice",
  },
  {
    id: "sec-018",
    type: "tf",
    topic: "security",
    subtopic: "Untrusted API data",
    difficulty: "exam",
    marks: 2,
    minutes: 1,
    prompt:
      "A response with status 200 from your own API means its contents can be inserted into the page as HTML without any further checks.",
    answer: false,
    explanation:
      "200 only means the request succeeded. The content may include user-submitted text (stored XSS) or unexpected shapes. Render as text, sanitise any HTML, and validate structure.",
    lessonId: "sec-trust-boundaries",
    source: "practice",
    misconception: "Successful responses are trustworthy",
  },
  {
    id: "sec-019",
    type: "tf",
    topic: "security",
    subtopic: "Hidden buttons",
    difficulty: "intermediate",
    marks: 1,
    minutes: 1,
    prompt:
      "Hiding the \"Delete\" button from non-admin users prevents them from deleting records.",
    answer: false,
    explanation:
      "Hiding UI is a usability choice. A user can still send `DELETE` requests with DevTools, curl or Postman. The API must reject unauthorised requests (403).",
    lessonId: "router-protected-routes",
    source: "practice",
    misconception: "Hidden UI is access control",
  },
  {
    id: "sec-020",
    type: "tf",
    topic: "security",
    subtopic: "CORS is not authorisation",
    difficulty: "advanced",
    marks: 2,
    minutes: 1,
    prompt:
      "Restricting an API's CORS policy to `https://app.example.com` ensures that only that frontend's users can call the API, so the API does not need to check tokens.",
    answer: false,
    explanation:
      "CORS only tells *browsers* whether a page from another origin may read responses. Scripts, servers and tools ignore it. Authentication and authorisation must still be enforced on every request.",
    lessonId: "http-cors",
    source: "practice",
    misconception: "CORS is an authorisation mechanism",
  },
  {
    id: "sec-021",
    type: "tf",
    topic: "security",
    subtopic: "JWT exp claim",
    difficulty: "intermediate",
    marks: 1,
    minutes: 1,
    prompt:
      "A frontend can read the `exp` claim of a JWT to estimate whether the token has expired and proactively log the user out, even though it cannot verify the signature.",
    answer: true,
    explanation:
      "Reading `exp` is a reasonable UX optimisation (e.g. avoid a doomed request). The server still makes the authoritative decision and may reject a token earlier (e.g. revocation, clock skew).",
    lessonId: "sec-401-403-expiry",
    source: "practice",
  },
  {
    id: "sec-022",
    type: "tf",
    topic: "security",
    subtopic: "HttpOnly cookies",
    difficulty: "beginner",
    marks: 1,
    minutes: 1,
    prompt: "JavaScript can read an `HttpOnly` cookie using `document.cookie`.",
    answer: false,
    explanation:
      "The `HttpOnly` attribute hides the cookie from `document.cookie` and other JS APIs; the browser still sends it with matching requests.",
    lessonId: "sec-token-storage",
    source: "practice",
  },
  {
    id: "sec-023",
    type: "tf",
    topic: "security",
    subtopic: "Signature integrity",
    difficulty: "advanced",
    marks: 2,
    minutes: 1,
    prompt:
      "If a user edits the payload of their signed JWT to change `role` from `USER` to `ADMIN`, a server that properly verifies signatures will reject the token.",
    answer: true,
    explanation:
      "The signature covers the header and payload. Changing the payload without the signing key produces a mismatch, so verification fails (typically a 401).",
    lessonId: "sec-jwt-anatomy",
    source: "practice",
  },
  {
    id: "sec-024",
    type: "tf",
    topic: "security",
    subtopic: "XSS in React",
    difficulty: "intermediate",
    marks: 1,
    minutes: 1,
    prompt:
      "React escapes values rendered with JSX `{}` as text, but this does not make `href={userUrl}` safe if `userUrl` can be a `javascript:` URL.",
    answer: true,
    explanation:
      "Text escaping doesn't validate URLs. Recent React versions warn about or neutralise `javascript:` URLs in `href`, but relying on that alone is unwise: validate that user-supplied URLs use `http:`/`https:` before rendering them.",
    lessonId: "sec-xss-csrf-https",
    source: "practice",
  },
  {
    id: "sec-025",
    type: "short",
    topic: "security",
    subtopic: "401 vs 403",
    difficulty: "exam",
    marks: 3,
    minutes: 3,
    prompt:
      "From a frontend perspective, explain the difference between `401 Unauthorized` and `403 Forbidden`, and describe how the UI should react to each.",
    rubric: [
      { criterion: "401 = not authenticated (missing/invalid/expired credentials)", marks: 1 },
      { criterion: "403 = authenticated but lacks permission for the resource/action", marks: 1 },
      { criterion: "Reactions: 401 → clear auth state / redirect to login or refresh token; 403 → show permission message, logging in again won't help", marks: 1 },
    ],
    modelAnswer:
      "**401** means the server could not authenticate the request: no token, an invalid token or an expired one. The frontend should clear its auth state and send the user to sign in (or try a refresh-token flow), ideally remembering where they were. **403** means the server knows who the user is, but they are not permitted to do this (e.g. a `USER` calling an ADMIN endpoint). The frontend should show an \"access denied\" message or hide the action — re-authenticating with the same account won't change the outcome.",
    explanation:
      "Despite its name, 401 is about authentication; 403 is about authorisation.",
    lessonId: "sec-401-403-expiry",
    source: "practice",
  },
  {
    id: "sec-026",
    type: "short",
    topic: "security",
    subtopic: "Token storage trade-offs",
    difficulty: "advanced",
    marks: 3,
    minutes: 4,
    prompt:
      "Compare storing an access token in (a) `localStorage`, (b) in-memory JavaScript state, and (c) an `HttpOnly` cookie. Give one advantage and one risk for each.",
    rubric: [
      { criterion: "localStorage: survives reloads/simple; readable by any script on the origin (XSS theft)", marks: 1 },
      { criterion: "Memory: not persisted, harder to steal later; lost on reload/new tab (needs refresh flow), still usable by XSS while page is open", marks: 1 },
      { criterion: "HttpOnly cookie: unreadable by JS; sent automatically so CSRF must be addressed (SameSite / tokens), needs server cooperation", marks: 1 },
    ],
    modelAnswer:
      "(a) **localStorage** — advantage: persists across reloads and tabs and is simple to attach as `Authorization: Bearer`. Risk: any JavaScript on the origin, including XSS payloads, can read and exfiltrate it.\n\n(b) **In memory** (e.g. a variable or store without persistence) — advantage: not written to disk, so it disappears when the page closes. Risk/cost: lost on reload, so a refresh mechanism is needed; XSS running while the page is open can still use it.\n\n(c) **HttpOnly cookie** — advantage: JavaScript cannot read it, reducing token theft via XSS. Risk: the browser sends it automatically, so CSRF must be mitigated (`SameSite`, anti-CSRF tokens), and the API must be designed for cookie auth (CORS credentials, `Secure`).\n\nNo option is perfect; preventing XSS remains essential in every case.",
    explanation:
      "Token storage is a trade-off between persistence, exposure to XSS and exposure to CSRF.",
    lessonId: "sec-token-storage",
    source: "practice",
  },
  {
    id: "sec-027",
    type: "short",
    topic: "security",
    subtopic: "Trust boundaries",
    difficulty: "exam",
    marks: 3,
    minutes: 3,
    prompt:
      "Give three reasons why security decisions (who may view or change data) must be made by the server rather than the React frontend.",
    rubric: [
      { criterion: "Client code runs on the user's machine and can be inspected/modified (DevTools)", marks: 1 },
      { criterion: "Requests can be sent directly (curl/Postman), bypassing UI checks, guards and hidden buttons", marks: 1 },
      { criterion: "Only the server can verify token signatures/hold secrets and check ownership/roles against the database", marks: 1 },
    ],
    modelAnswer:
      "1. The JavaScript bundle runs in the user's browser, where it can be read and modified with DevTools — route guards and role checks can simply be switched off.\n2. Anyone can send HTTP requests directly with curl, Postman or a script, completely bypassing the UI, hidden buttons and validation.\n3. Only the server holds the signing keys to verify a JWT and the data needed to check ownership and roles (e.g. that booking 58 belongs to this user); any secret placed in frontend code is public.",
    explanation:
      "The frontend is on the untrusted side of the trust boundary. Client checks are for UX.",
    lessonId: "sec-trust-boundaries",
    source: "practice",
    misconception: "Frontend checks are security",
  },
  {
    id: "sec-028",
    type: "code",
    topic: "security",
    subtopic: "JWT expiry check",
    difficulty: "exam",
    marks: 5,
    minutes: 6,
    language: "ts",
    prompt: `Write \`isTokenExpired(token: string): boolean\` that decodes the payload of a JWT **without verifying it** and returns \`true\` if the \`exp\` claim is in the past, if \`exp\` is missing, or if the token is malformed.

Notes: the payload is the second dot-separated part and is **Base64URL** encoded (\`-\` and \`_\` instead of \`+\` and \`/\`, padding may be omitted). \`atob\` expects standard Base64. Example fictional token:

\`\`\`text
eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJkZW1vIiwiZXhwIjoxNzAwMDAwMDAwfQ.ZmFrZS1zaWduYXR1cmU
\`\`\``,
    starterCode: `export function isTokenExpired(token: string): boolean {
  // TODO
}`,
    rubric: [
      { criterion: "Splits on '.' and takes the payload part, handling a missing part", marks: 1 },
      { criterion: "Converts Base64URL to Base64 (replace - and _, add padding) before atob", marks: 1 },
      { criterion: "Parses JSON and reads exp, treating missing/non-number exp as expired", marks: 1 },
      { criterion: "Compares exp (seconds) × 1000 with Date.now() (milliseconds)", marks: 1 },
      { criterion: "Wraps decoding in try/catch and returns true on error", marks: 1 },
    ],
    modelAnswer: `\`\`\`ts
export function isTokenExpired(token: string): boolean {
  try {
    const part = token.split(".")[1];
    if (!part) return true;

    let base64 = part.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4 !== 0) base64 += "=";

    const payload: unknown = JSON.parse(atob(base64));
    if (typeof payload !== "object" || payload === null) return true;

    const exp = (payload as { exp?: unknown }).exp;
    if (typeof exp !== "number") return true;

    return exp * 1000 <= Date.now(); // exp is in seconds
  } catch {
    return true;
  }
}
\`\`\``,
    explanation:
      "The example token's `exp` is 1700000000 (Nov 2023), so it returns `true`. This check is UX only: it decodes but does not verify, so the server must still validate the signature and expiry.",
    lessonId: "sec-401-403-expiry",
    source: "practice",
    misconception: "exp is in milliseconds",
  },
  {
    id: "sec-029",
    type: "code",
    topic: "security",
    subtopic: "Handling 401 and 403 in a service",
    difficulty: "advanced",
    marks: 5,
    minutes: 6,
    language: "ts",
    prompt:
      "Write an `apiFetch<T>(path: string, init?: RequestInit): Promise<T>` helper for `http://localhost:5229/api` that: reads a token via `getToken(): string | null`; adds `Authorization: Bearer <token>` when present (keeping any other headers); on **401** calls `logout()` and throws an `Error(\"Session expired\")`; on **403** throws `Error(\"Not allowed\")`; on other non-ok statuses throws with the status; returns `undefined` for 204; otherwise returns the parsed JSON.",
    rubric: [
      { criterion: "Builds headers with `new Headers(init?.headers)` (or merge) and sets Authorization only when a token exists", marks: 1 },
      { criterion: "Calls fetch with the base URL + path and merged init", marks: 1 },
      { criterion: "401 → logout() then throw; 403 → throw distinct error", marks: 1 },
      { criterion: "Other !res.ok → throw including status", marks: 1 },
      { criterion: "204 → return undefined (no json()); else return res.json()", marks: 1 },
    ],
    modelAnswer: `\`\`\`ts
const BASE_URL = "http://localhost:5229/api";

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);
  const token = getToken();
  if (token) headers.set("Authorization", \`Bearer \${token}\`);

  const res = await fetch(\`\${BASE_URL}\${path}\`, { ...init, headers });

  if (res.status === 401) {
    logout();
    throw new Error("Session expired");
  }
  if (res.status === 403) {
    throw new Error("Not allowed");
  }
  if (!res.ok) {
    throw new Error(\`Request failed: HTTP \${res.status}\`);
  }
  if (res.status === 204) {
    return undefined as T;
  }
  return (await res.json()) as T;
}
\`\`\``,
    explanation:
      "Centralising this logic means every call treats 401 (re-authenticate) and 403 (no permission) correctly and never calls `json()` on a 204. These are UX reactions; the server still enforces access.",
    lessonId: "sec-401-403-expiry",
    source: "practice",
  },
  {
    id: "sec-030",
    type: "code",
    topic: "security",
    subtopic: "Protected route (UX)",
    difficulty: "intermediate",
    marks: 4,
    minutes: 5,
    language: "tsx",
    prompt:
      "Using React Router (`react-router-dom`), write a `RequireRole` component that takes `role: \"USER\" | \"ADMIN\"`. It reads `user` from `useAuth()` (`user` is `{ role: string } | null`). If there is no user, redirect to `/login` with `replace`; if the role does not match, render `<p>Access denied</p>`; otherwise render the nested routes with `<Outlet />`. Add a one-line comment explaining why this is not a security boundary.",
    rubric: [
      { criterion: "Imports Navigate and Outlet from react-router-dom", marks: 1 },
      { criterion: "No user → `<Navigate to=\"/login\" replace />`", marks: 1 },
      { criterion: "Role mismatch → access denied message; match → `<Outlet />`", marks: 1 },
      { criterion: "Comment notes the server must enforce authorisation (guard is UX only)", marks: 1 },
    ],
    modelAnswer: `\`\`\`tsx
import { Navigate, Outlet } from "react-router-dom";

export function RequireRole({ role }: { role: "USER" | "ADMIN" }) {
  const { user } = useAuth();

  // UX only: the API must still check the token and role on every request.
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) return <p>Access denied</p>;
  return <Outlet />;
}

// Usage:
// <Route element={<RequireRole role="ADMIN" />}>
//   <Route path="/admin" element={<AdminPage />} />
// </Route>
\`\`\``,
    explanation:
      "A layout-style guard wraps a group of routes. It hides pages from users who can't use them, but anyone can still call the API directly, so authorisation lives on the server.",
    lessonId: "router-protected-routes",
    source: "practice",
  },
];
