import type { Lesson, SourceRef } from "../types";

/*
 * Module 09 (Security), 10 (TanStack Query), 11 (Zustand), 12 (State architecture),
 * 13 (Architecture) and 14 (Performance / Testing) lessons.
 *
 * IMPORTANT source note: Lecture 6 (Auth/JWT), Lecture 7 (State Management) and
 * Lectures 8–11 were NOT supplied. Anything beyond Lecture 01 slide 25, the Week 03 /
 * Week 05 decks, the CampusEvents backend code and the MOCK ICT paper is labelled
 * "supplementary" or "best-practice" and cites official documentation.
 *
 * All JWTs in this file are FICTIONAL teaching tokens with fake signatures.
 */

const L01_JWT: SourceRef = {
  kind: "university",
  label: "Lecture 01 — How the Web Works",
  detail: "Slide 3 notes (interview question: JWT vs cookie vs session), slide 4 notes, slide 25 (JWT – Cookies – Session)",
};
const BACKEND_AUTH: SourceRef = {
  kind: "university",
  label: "CampusEvents.Api backend",
  detail: "Controllers/AuthController.cs, Services/JWTService.cs, Program.cs (AddJwtBearer, roles USER/ADMIN), appsettings.json (Jwt:Issuer/Audience)",
};
const OWASP_AUTHN: SourceRef = {
  kind: "best-practice",
  label: "OWASP Authentication Cheat Sheet",
  url: "https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html",
};
const OWASP_AUTHZ: SourceRef = {
  kind: "best-practice",
  label: "OWASP Authorization Cheat Sheet",
  url: "https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html",
};
const JWT_INTRO: SourceRef = {
  kind: "supplementary",
  label: "jwt.io — Introduction to JSON Web Tokens",
  url: "https://jwt.io/introduction",
};
const RFC7519: SourceRef = {
  kind: "supplementary",
  label: "RFC 7519 — JSON Web Token (registered claims)",
  url: "https://datatracker.ietf.org/doc/html/rfc7519",
};
const NOT_SUPPLIED_L6: SourceRef = {
  kind: "supplementary",
  label: "Lecture 6 (Authentication & JWT) was not supplied",
  detail: "This lesson fills the gap from official documentation; verify against the lecture when it is released.",
};
const NOT_SUPPLIED_L7: SourceRef = {
  kind: "supplementary",
  label: "Lecture 7 (State Management) was not supplied",
  detail: "This lesson fills the gap from official documentation; Week03 slide 28 previews TanStack Query.",
};
const TQ_OVERVIEW: SourceRef = {
  kind: "supplementary",
  label: "TanStack Query v5 docs — Overview",
  url: "https://tanstack.com/query/latest/docs/framework/react/overview",
};
const TQ_DEFAULTS: SourceRef = {
  kind: "supplementary",
  label: "TanStack Query v5 docs — Important Defaults",
  url: "https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults",
};
const ZUSTAND_INTRO: SourceRef = {
  kind: "supplementary",
  label: "Zustand docs — Introduction",
  url: "https://zustand.docs.pmnd.rs/getting-started/introduction",
};
const WEEK03_SLIDE28: SourceRef = {
  kind: "university",
  label: "Week 03 Lecture — Consuming REST APIs",
  detail: "Slide 28: Service → Hook → Component; \"Swap fetch for TanStack Query in Week 08 → only the hook changes\"",
};

export const stateSecurityArchLessons: Lesson[] = [
  /* ================================================================== */
  /* m09-security                                                        */
  /* ================================================================== */
  {
    id: "sec-authn-authz",
    moduleId: "m09-security",
    title: "Authentication vs Authorisation (and sessions, cookies, JWT)",
    summary:
      "Authentication proves WHO you are; authorisation decides WHAT you may do — and the server enforces both, whether it uses sessions or JWTs.",
    priority: "P0",
    examCritical: true,
    minutes: 25,
    objectives: [
      "Define authentication and authorisation precisely and give an example of each (mock E2).",
      "Explain the difference between a cookie, a server session and a JWT (Lecture 01 slide 25).",
      "Trace the CampusEvents register → login → AuthResponseDto → authenticated request flow.",
      "Describe roles (USER, ADMIN) and permissions and where they are enforced.",
    ],
    prerequisites: ["http-methods-status", "http-fetch-response-ok"],
    sources: [
      L01_JWT,
      BACKEND_AUTH,
      { kind: "mock", label: "MOCK ICT", detail: "E2 (authentication vs authorisation), A5 (401), B5 (403)" },
      NOT_SUPPLIED_L6,
      OWASP_AUTHN,
      OWASP_AUTHZ,
      {
        kind: "supplementary",
        label: "MDN — HTTP authentication",
        url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication",
      },
    ],
    why: `Almost every real app has data that belongs to someone and actions only some people may perform. Two separate questions have to be answered on **every** protected request:

1. **Who is this?** → *authentication* (authN)
2. **Are they allowed to do this?** → *authorisation* (authZ)

Mixing the two up leads to classic bugs: an app that checks "is someone logged in?" but never "is this *their* booking?", letting any logged-in user read anyone's data. The mock paper tests the definitions directly (E2) and indirectly through 401 vs 403 (A5, B5, C5).`,
    analogy: `Think of a conference venue.

- At the **front desk** you show your passport. The receptionist checks it is genuine and gives you a **badge** with your name and your ticket type. That is *authentication* — proving identity and receiving a credential.
- Later, a **door steward** looks at your badge before letting you into the speakers' lounge. Being a real attendee is not enough; your badge must say "speaker". That is *authorisation*.

A **session** is like the desk keeping your details in a register and giving you a cloakroom number — the desk looks you up each time. A **JWT** is like a tamper-evident badge that carries your details on it; stewards check the hologram (signature) instead of phoning the desk. A **cookie** is the lanyard: a way to carry *either* the number or the badge automatically. The analogy has limits: a JWT's details are readable by anyone who sees the badge.`,
    explain: {
      beginner: `**Authentication** answers "who are you?". You give credentials — usually an email and password — and the server checks them. If they are right, the server gives you something to prove it later (a session ID or a token), so you don't have to send your password on every request.

**Authorisation** answers "what are you allowed to do?". Once the server knows who you are, it checks your **role** or **permissions**. In CampusEvents every new user is a normal user (role \`USER\`), and only an \`ADMIN\` may create, edit or delete events.

Lecture 01 (slide 25) describes three related ideas:

- 🍪 **Cookie** — a small value the server asks the browser to store; the browser sends it back automatically with future requests to that site.
- 🗄️ **Session** — the server keeps your information in its own memory/database and gives the browser only a **session ID**.
- 🎫 **JWT** — the server creates a **signed token containing claims** about you and gives it to the client, which sends it back with each request.

So a cookie is a *transport/storage mechanism*, while session vs JWT are two *ways of remembering who you are*. You could even put a JWT inside a cookie.

Order always matters: you must be authenticated before the server can decide what you are authorised to do.`,
      developer: `**CampusEvents flow** (from \`AuthController.cs\`):

1. \`POST /api/auth/register\` with \`{ email, password, firstName, lastName }\`. The server creates an Identity user, adds them to the normal user role and returns \`{ message: "Registration successful." }\` — **no token**. The frontend should then send the user to the login page (or log them in with a second call).
2. \`POST /api/auth/login\` with \`{ email, password }\`. Wrong email *or* wrong password both return **401** with the same generic message (good practice: don't reveal which part was wrong).
3. On success the server returns an \`AuthResponseDto\`: \`{ token, expiresAt, userId, email, firstName, lastName, role }\`. \`JwtService\` signs the token with HMAC-SHA256 and sets it to expire after **2 hours**. Caveat: \`role\` here is only the user's **first** role (\`roles.FirstOrDefault()\`), whereas the token contains a role claim for every role — so the response field is a convenient UI hint, not a complete permission list.
4. The frontend stores the auth state and sends \`Authorization: Bearer <token>\` on protected calls.
5. \`Program.cs\` configures \`AddJwtBearer\` to validate issuer, audience, lifetime and signing key; \`[Authorize(Roles = "ADMIN")]\` on \`POST/PUT/DELETE /api/events\` performs authorisation.

Frontend responsibilities: keep an \`AuthState\` (user + token + expiry), show/hide UI by role **for UX**, attach the header, and react to **401** (log out / re-authenticate) and **403** (show "not permitted"). The server remains the only place where the rules are actually enforced.`,
      deep: `**Session vs JWT trade-offs.** A server-side session is *stateful*: the server stores the session record, so it can revoke it instantly (delete the row) and the browser only holds an opaque random ID. A JWT is *self-contained*: any server holding the key can verify it without a lookup, which suits APIs and multiple services, but revocation before \`exp\` is hard (you need short lifetimes, a deny-list or refresh-token rotation). Neither is "more secure" in general — the risks move around.

**Cookies are orthogonal.** A cookie can carry a session ID *or* a JWT. If the cookie is \`HttpOnly\`, page JavaScript cannot read it (reducing token theft through XSS), but the browser attaches it automatically, which reintroduces CSRF concerns (mitigated with \`SameSite\` and CSRF tokens). Lecture 01's speaker notes summarise this: a normal JS-readable cookie for a JWT is weak; HttpOnly is better.

**Roles vs permissions.** Roles (USER, ADMIN) are coarse buckets; permissions ("event:delete") are fine-grained; real systems also need **resource ownership** checks — CampusEvents' BookingsController returns \`Forbid()\` (403) when \`booking.UserId != userId\` and the caller is not an ADMIN. That object-level check is exactly what role checks alone miss (OWASP "Broken Access Control").

**Login responses** should not leak whether an email exists (CampusEvents returns the same 401 message for both cases). Registration still reveals "email already exists" — a common, accepted usability trade-off, but worth noticing. Password hashing, lockout and MFA are server concerns outside the ICT's client-side scope.`,
    },
    mechanism: `\`\`\`text
 Browser (React)                         CampusEvents.Api
 ───────────────                         ────────────────
 [Login form] --POST /api/auth/login-->  AuthController.Login
   {email,password}                        ├─ FindByEmailAsync      ─┐ AUTHENTICATION
                                           ├─ CheckPasswordAsync     │ (who are you?)
                                           ├─ JwtService.GenerateToken┘  sign(HS256, key)
              <-- 200 AuthResponseDto --   └─ {token, expiresAt, userId, email,
                                                firstName, lastName, role}
 [authStore] keeps user + token
       │
       ▼
 GET /api/bookings/my-bookings
 Authorization: Bearer <token>  ------->  JwtBearer middleware
                                           ├─ signature / iss / aud / exp valid?
                                           │     no  → 401 Unauthorized
                                           ▼
                                          [Authorize(Roles="ADMIN")] / ownership check
                                           ├─ allowed?  no → 403 Forbidden   AUTHORISATION
                                           ▼                                 (may you?)
              <-------- 200 data ------   controller action runs
\`\`\`

- Authentication happens once at login *and* is re-checked on every request by validating the token.
- Authorisation is decided per request, per resource, on the server.
- The React app only *reflects* these decisions in the UI.`,
    simpleExample: {
      title: "Typing the login request and response",
      language: "ts",
      code: `export type Role = "USER" | "ADMIN";

export interface LoginRequest {
  email: string;
  password: string;
}

// Mirrors CampusEvents AuthResponseDto (camelCase JSON)
export interface AuthResponse {
  token: string;
  expiresAt: string; // ISO date string
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string; // validate before trusting it as Role
}

export function isAdmin(role: string | undefined): boolean {
  // UX helper only: decides what to SHOW, not what is ALLOWED
  return role?.toUpperCase() === "ADMIN";
}`,
      walkthrough: [
        { lines: "1", text: "A union type for the two roles the backend seeds in Program.cs." },
        { lines: "8-16", text: "The DTO shape returned by POST /api/auth/login. TypeScript does not validate it at runtime, so role is typed as string and checked." },
        { lines: "18-21", text: "A helper for conditional rendering. The comment is the key point: hiding a button is not authorisation." },
      ],
    },
    realExample: {
      title: "authService.ts — register then login against CampusEvents",
      language: "ts",
      code: `const API = "http://localhost:5229/api";

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  token: string;
  expiresAt: string;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

async function readError(res: Response): Promise<string> {
  try {
    const body: unknown = await res.json();
    if (body && typeof body === "object" && "message" in body) {
      return String((body as { message: unknown }).message);
    }
  } catch {
    /* body was not JSON */
  }
  return \`Request failed (\${res.status})\`;
}

export async function register(data: RegisterRequest): Promise<void> {
  const res = await fetch(\`\${API}/auth/register\`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await readError(res)); // 400: email exists / weak password
  // Register returns only a message — no token. Next step: login.
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const res = await fetch(\`\${API}/auth/login\`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (res.status === 401) throw new Error("Invalid email or password.");
  if (!res.ok) throw new Error(await readError(res));
  return (await res.json()) as AuthResponse;
}`,
      walkthrough: [
        { lines: "1", text: "Base URL from the course backend; in a real project read it from import.meta.env.VITE_API_URL (public config, not a secret)." },
        { lines: "20-30", text: "Error bodies differ (a {message} object or an Identity error array), so read defensively and fall back to the status code." },
        { lines: "32-40", text: "Register only creates the account. fetch does not reject on 400, so we check res.ok." },
        { lines: "42-50", text: "Login: 401 means the credentials were not accepted (authentication failed). On success we get the AuthResponseDto containing the JWT." },
      ],
    },
    mistakes: [
      {
        mistake: "Using \"authentication\" and \"authorisation\" interchangeably.",
        fix: "Authentication = identity (who). Authorisation = permission (what). AuthN comes first; authZ is checked on every protected action.",
      },
      {
        mistake: "Assuming that hiding the admin menu for USER accounts secures admin endpoints.",
        fix: "Hidden UI is UX. The API must enforce roles — CampusEvents does with [Authorize(Roles = \"ADMIN\")]. Anyone can call the endpoint with Postman.",
      },
      {
        mistake: "Saying \"a cookie is an alternative to JWT\".",
        fix: "A cookie is a browser storage/transport mechanism. It can carry a session ID or a JWT. Session vs JWT is the real comparison.",
      },
      {
        mistake: "Expecting a token from POST /api/auth/register.",
        fix: "CampusEvents' register returns only a success message. Redirect to login (or call login next) to obtain the token.",
      },
      {
        mistake: "Checking only the role and forgetting resource ownership.",
        fix: "A USER may read *their* booking but not someone else's. Ownership checks must happen on the server (CampusEvents returns 403 via Forbid()).",
      },
    ],
    debug: {
      prompt: "After a successful login the app shows \"Welcome undefined\" and the admin link never appears for admins. Find the bugs.",
      language: "ts",
      buggyCode: `async function handleLogin(email: string, password: string) {
  const res = await fetch("http://localhost:5229/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  setUser({ name: data.FirstName, role: data.Role, token: data.Token });
  setShowAdmin(data.role === "admin");
}`,
      hint: "Look at the request headers, the casing of JSON properties produced by ASP.NET Core, the role value, and what happens on 401.",
      fixedCode: `async function handleLogin(email: string, password: string) {
  const res = await fetch("http://localhost:5229/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    throw new Error(res.status === 401 ? "Invalid email or password." : \`Login failed (\${res.status})\`);
  }
  const data = (await res.json()) as AuthResponse;
  setUser({ name: data.firstName, role: data.role, token: data.token });
  setShowAdmin(data.role.toUpperCase() === "ADMIN"); // UX only
}`,
      explanation: `Four problems: (1) without \`Content-Type: application/json\` ASP.NET Core will not bind the JSON body (typically 415); (2) ASP.NET Core serialises properties in **camelCase**, so \`FirstName\` is \`undefined\` — use \`firstName\`; (3) roles are \`"ADMIN"\`/\`"USER"\`, so compare case-insensitively against the real value; (4) \`fetch\` doesn't throw on 401, so check \`res.ok\` before treating the body as an AuthResponse.`,
    },
    challenge: {
      prompt: "Write a pure function `describeAccess(user, action)` that returns 'unauthenticated' when there is no user, 'forbidden' when a USER attempts an admin-only action ('create-event' | 'delete-event'), and 'allowed' otherwise. Then state in a comment why this function can only drive UI.",
      starterCode: `type Role = "USER" | "ADMIN";
interface SessionUser { id: string; role: Role }
type Action = "view-events" | "book-ticket" | "create-event" | "delete-event";
type Access = "unauthenticated" | "forbidden" | "allowed";

export function describeAccess(user: SessionUser | null, action: Action): Access {
  // TODO
}`,
      language: "ts",
      hints: [
        "Check authentication first: no user → 'unauthenticated' (maps to 401 / redirect to login).",
        "Keep admin-only actions in a Set or array.",
        "'view-events' is public in CampusEvents, but booking requires login.",
      ],
      solution: `type Role = "USER" | "ADMIN";
interface SessionUser { id: string; role: Role }
type Action = "view-events" | "book-ticket" | "create-event" | "delete-event";
type Access = "unauthenticated" | "forbidden" | "allowed";

const ADMIN_ONLY: ReadonlySet<Action> = new Set<Action>(["create-event", "delete-event"]);
const PUBLIC: ReadonlySet<Action> = new Set<Action>(["view-events"]);

// UX only: the browser can be modified, so the API must make the real decision.
export function describeAccess(user: SessionUser | null, action: Action): Access {
  if (PUBLIC.has(action)) return "allowed";
  if (!user) return "unauthenticated"; // like 401 → send to login
  if (ADMIN_ONLY.has(action) && user.role !== "ADMIN") return "forbidden"; // like 403
  return "allowed";
}`,
      explanation: "The order mirrors the server: identify the caller first (authN), then check permission (authZ). The function is useful for disabling buttons or choosing which page to show, but any user could edit it in DevTools or call the API directly, so the server's [Authorize] attributes remain the security boundary.",
    },
    examQuestions: [
      {
        question: "(Mock E2) What is the main difference between authentication and authorisation?",
        answer: "Authentication establishes **who** the user is (e.g. checking email + password and issuing a token). Authorisation determines **what** that identified user is allowed to access or do (e.g. only ADMIN may delete events). Authentication happens first. (Option A.)",
        marks: 2,
      },
      {
        question: "Explain the difference between a cookie, a session and a JWT. (3 marks)",
        answer: "A **cookie** is a value the browser stores and automatically sends back to the server — a transport/storage mechanism. A **session** keeps the user's data on the server and gives the client only a session ID to look it up. A **JWT** is a signed token containing claims about the user that the client sends back; the server verifies the signature rather than looking up stored state. A cookie may carry either a session ID or a JWT.",
        marks: 3,
      },
      {
        question: "A logged-in USER calls DELETE /api/events/5 using Postman. Which status should CampusEvents return and why?",
        answer: "**403 Forbidden** — the user is authenticated (valid token) but lacks the ADMIN role required by [Authorize(Roles = \"ADMIN\")]. Without a valid token it would be 401.",
        marks: 2,
      },
      {
        question: "Why does CampusEvents return the same message for an unknown email and a wrong password?",
        answer: "To avoid revealing which accounts exist (user enumeration). Both cases return 401 \"Invalid email or password.\"",
        marks: 1,
      },
    ],
    revision: [
      "AuthN = who you are; AuthZ = what you may do. AuthN first.",
      "Cookie = browser storage + automatic sending; session = server-side record + ID; JWT = signed, self-contained claims (Lecture 01 slide 25).",
      "CampusEvents login returns AuthResponseDto { token, expiresAt, userId, email, firstName, lastName, role }; register returns only a message.",
      "Protected requests send Authorization: Bearer <token>.",
      "No/invalid/expired token → 401; valid token but wrong role/ownership → 403.",
      "Roles shown/hidden in React are UX; [Authorize] on the server is security.",
    ],
    visualizers: ["auth-flow"],
  },
  {
    id: "sec-jwt-anatomy",
    moduleId: "m09-security",
    title: "JWT anatomy: header.payload.signature",
    summary:
      "A JWT is three Base64URL parts joined by dots; anyone can decode the claims, only the key holder can produce a valid signature — signed is not encrypted.",
    priority: "P0",
    examCritical: true,
    minutes: 25,
    objectives: [
      "Split a JWT into header, payload and signature and decode the first two.",
      "Explain the registered claims sub, iss, aud, exp, iat and custom claims such as role.",
      "Explain why signed ≠ encrypted and decoding ≠ verifying.",
      "Send a token correctly with the Authorization: Bearer header.",
    ],
    prerequisites: ["sec-authn-authz"],
    sources: [
      L01_JWT,
      BACKEND_AUTH,
      NOT_SUPPLIED_L6,
      JWT_INTRO,
      RFC7519,
      {
        kind: "best-practice",
        label: "OWASP JSON Web Token Cheat Sheet",
        url: "https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html",
      },
      { kind: "mock", label: "MOCK ICT", detail: "B15 (JWT expiry information), E1 (expired JWT)" },
    ],
    why: `The CampusEvents login returns a long string like \`eyJhbGciOi...\`. If you treat it as magic you will make dangerous assumptions — "nobody can read it", "if I can decode it, it must be valid", "I'll put the user's password in it". Understanding the three parts tells you what the frontend *may* read (claims, for UX), what it must *never* rely on (its own decoding for security), and what must never be placed inside.`,
    analogy: `A JWT is like a **postcard with a wax seal**.

- Anyone who handles the postcard can **read** the message (the payload is only encoded, not hidden).
- The **wax seal** (signature) was pressed with the sender's private stamp. If someone changes the text, the seal no longer matches — but only someone who has the stamp (the server's key) can check that properly.
- Reading the card yourself (decoding) tells you what it *claims*; it does not prove the seal is genuine (verifying).

So: never write a secret on a postcard, and never accept one just because it is readable.`,
    explain: {
      beginner: `A JWT (JSON Web Token) has **three parts separated by dots**:

\`\`\`text
xxxxx.yyyyy.zzzzz
header.payload.signature
\`\`\`

1. **Header** — JSON saying what kind of token it is and which algorithm signed it, e.g. \`{"alg":"HS256","typ":"JWT"}\`.
2. **Payload** — JSON **claims**: facts about the user and the token, such as the user id (\`sub\`), role and expiry time (\`exp\`).
3. **Signature** — a cryptographic value computed from the header, payload and a secret key that only the server knows.

The header and payload are **Base64URL encoded**. Encoding is just a reversible way of writing data with safe characters — it is *not* encryption. Paste a token into a decoder and you can read every claim. That is why you must never put passwords or secret data in a JWT.

The signature is what makes the token trustworthy *to the server*: if anyone changes even one character of the payload (for example \`"role":"USER"\` → \`"role":"ADMIN"\`), the signature no longer matches and the server rejects the token with 401.

To use the token, the frontend sends it in a header on each protected request:

\`\`\`http
Authorization: Bearer <token>
\`\`\``,
      developer: `**Decoding the payload in the browser** (for UX — showing the name, checking \`exp\`):

\`\`\`ts
function decodeBase64Url(part: string): string {
  const b64 = part.replace(/-/g, "+").replace(/_/g, "/");
  const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
  const bytes = Uint8Array.from(atob(padded), (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes); // handles non-ASCII names
}
\`\`\`

Base64URL differs from Base64: \`-\` instead of \`+\`, \`_\` instead of \`/\`, and padding \`=\` removed. Libraries such as \`jwt-decode\` do the same job; neither **verifies** anything.

**Registered claims (RFC 7519):** \`iss\` issuer (CampusEvents: \`"CampusEvents.Api"\`), \`aud\` audience (\`"CampusEvents.Client"\`), \`sub\` subject (user id), \`exp\` expiry and \`iat\` issued-at — both **NumericDate = seconds since the Unix epoch**, not milliseconds — plus \`nbf\` and \`jti\`. Applications add custom claims like \`email\` and \`role\`.

**CampusEvents specifics** (\`JwtService.cs\`): claims for sub, email, name identifier, name and one claim per role; HMAC-SHA256 with the \`Jwt:Key\`; expiry 2 hours. .NET's \`JwtSecurityTokenHandler\` maps those long claim types to short payload keys, so a decoded CampusEvents payload uses \`sub\`, \`email\`, \`nameid\`, \`unique_name\`, \`role\`, \`exp\`, \`iss\` and \`aud\` (confirm against a token from your running API). If a user holds several roles, \`role\` becomes a JSON **array**. The login response's \`role\` field is only the user's **first** role (\`roles.FirstOrDefault()\` in AuthController), so an account holding both USER and ADMIN can be reported as \`"USER"\` — don't treat that single field as the complete picture. Either way, roles in the frontend drive UX only.

**Sending:** \`headers: { Authorization: "Bearer " + token }\` — exactly one space, the word \`Bearer\`, no quotes around the token.`,
      deep: `**Signed ≠ encrypted.** A JWS (the usual "JWT") provides *integrity and authenticity*: the verifier can detect tampering and know the key holder issued it. It provides **no confidentiality**. Encrypted tokens (JWE) exist but are rarer and still shouldn't carry passwords.

**Decoding ≠ verifying.** Verification recomputes the signature with the key and checks claims (\`exp\`, \`nbf\`, \`iss\`, \`aud\`). CampusEvents' \`Program.cs\` turns on \`ValidateIssuer\`, \`ValidateAudience\`, \`ValidateLifetime\` and \`ValidateIssuerSigningKey\`. The browser cannot do this for HS256 because the key is a **shared secret** — shipping it to the client would let anyone mint ADMIN tokens. (With asymmetric algorithms such as RS256 a client *could* verify with the public key, but the server must still verify; client checks are never the security boundary.)

**Classic JWT pitfalls** (OWASP): accepting \`alg: "none"\`; algorithm confusion (treating an RS256 public key as an HS256 secret); weak HMAC keys (note \`appsettings.json\` literally says \`CHANGE_THIS_TO_A_LONG_RANDOM_DEVELOPMENT_KEY...\` — a development placeholder that must be replaced and kept out of source control in production); long lifetimes with no revocation strategy; sensitive data in claims.

**Clock skew.** ASP.NET Core's JwtBearer allows a default clock skew (5 minutes) when checking \`exp\`, so a token can still be accepted briefly after its nominal expiry. Client-side expiry checks should therefore be treated as approximate UX hints, and the server's 401 is the final word.

**Size.** Every claim is sent on every request; keep payloads small.`,
    },
    mechanism: `\`\`\`text
 FICTIONAL token (fake signature — for teaching only)

 eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9 . eyJzdWIiOiJkZW1vLXVzZXItNDIi... . FICTIONAL-signature-not-valid
 └──────────── header ──────────────┘   └──────── payload ─────────┘   └───────── signature ────────┘
          │ base64url decode                    │ base64url decode               │ cannot be "decoded"
          ▼                                     ▼                                ▼
 {"alg":"HS256","typ":"JWT"}         {"sub":"demo-user-42",            HMACSHA256(
                                      "email":"ada@example.com",          base64url(header) + "." +
                                      "role":"USER",                      base64url(payload),
                                      "iss":"CampusEvents.Api",           SERVER_SECRET_KEY)
                                      "aud":"CampusEvents.Client",
                                      "iat":1767218400,
                                      "exp":1767225600}   ← seconds since 1970 (2026-01-01T00:00:00Z)

 Browser:  can DECODE header + payload  ───►  display name, rough expiry check (UX)
 Server:   VERIFIES signature with key  ───►  valid? + iss/aud/exp ok? → trust claims, else 401
\`\`\`

- Change one payload byte → server recomputes HMAC → mismatch → 401.
- The secret key never leaves the server; the browser never verifies HS256 tokens.`,
    simpleExample: {
      title: "Decode (not verify) a fictional token's payload",
      language: "ts",
      code: `// FICTIONAL token — the signature is fake and will not verify anywhere.
const demoToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9" +
  ".eyJzdWIiOiJkZW1vLXVzZXItNDIiLCJlbWFpbCI6ImFkYUBleGFtcGxlLmNvbSIsInJvbGUiOiJVU0VSIiwiaXNzIjoiQ2FtcHVzRXZlbnRzLkFwaSIsImF1ZCI6IkNhbXB1c0V2ZW50cy5DbGllbnQiLCJpYXQiOjE3NjcyMTg0MDAsImV4cCI6MTc2NzIyNTYwMH0" +
  ".FICTIONAL-signature-not-valid";

function decodeBase64Url(part: string): string {
  const b64 = part.replace(/-/g, "+").replace(/_/g, "/");
  const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
  const bytes = Uint8Array.from(atob(padded), (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

const [headerPart, payloadPart] = demoToken.split(".");
console.log(JSON.parse(decodeBase64Url(headerPart))); // { alg: "HS256", typ: "JWT" }
console.log(JSON.parse(decodeBase64Url(payloadPart))); // { sub: "demo-user-42", role: "USER", exp: 1767225600, ... }
// Nothing above proves the token is genuine — only the server can verify it.`,
      walkthrough: [
        { lines: "2-5", text: "A made-up token: real Base64URL header and payload, deliberately fake signature." },
        { lines: "7-12", text: "Base64URL → Base64 (swap - and _, restore padding), then bytes → UTF-8 text." },
        { lines: "14-16", text: "Anyone can read the claims. This is why secrets never go in the payload." },
        { lines: "17", text: "Decoding gives claims, not trust. Verification needs the server's key." },
      ],
    },
    realExample: {
      title: "jwt.ts — typed, defensive payload reader + Bearer header helper",
      language: "ts",
      code: `export interface JwtClaims {
  sub?: string;
  email?: string;
  role?: string;
  iss?: string;
  aud?: string | string[];
  iat?: number; // seconds since epoch
  exp?: number; // seconds since epoch
  [claim: string]: unknown;
}

function decodeBase64Url(part: string): string {
  const b64 = part.replace(/-/g, "+").replace(/_/g, "/");
  const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
  const bytes = Uint8Array.from(atob(padded), (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

/** Reads claims for DISPLAY/UX. Returns null for malformed tokens. Does NOT verify. */
export function readClaims(token: string): JwtClaims | null {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  try {
    const parsed: unknown = JSON.parse(decodeBase64Url(parts[1]));
    return parsed !== null && typeof parsed === "object" ? (parsed as JwtClaims) : null;
  } catch {
    return null;
  }
}

export function authHeaders(token: string | null): HeadersInit {
  return token ? { Authorization: \`Bearer \${token}\` } : {};
}

// Usage
// fetch(\`\${API}/bookings/my-bookings\`, { headers: authHeaders(token) });`,
      walkthrough: [
        { lines: "1-10", text: "Claims are optional and loosely typed — the payload is just JSON from outside our code." },
        { lines: "20-29", text: "Malformed tokens (wrong number of parts, invalid Base64, invalid JSON) return null instead of crashing the app." },
        { lines: "19", text: "The doc comment states the limit: this is for UX only." },
        { lines: "31-33", text: "The Bearer scheme: 'Bearer', one space, the raw token." },
      ],
    },
    mistakes: [
      {
        mistake: "Believing the payload is secret because it looks scrambled.",
        fix: "Base64URL is encoding, not encryption. Anyone can decode it. Never put passwords, card numbers or secrets in claims.",
      },
      {
        mistake: "Treating a successfully decoded token as valid/trusted.",
        fix: "Decoding reads claims; only signature verification with the key (on the server) proves authenticity. A forged token decodes perfectly.",
      },
      {
        mistake: "Comparing exp directly with Date.now().",
        fix: "exp is in seconds; Date.now() is milliseconds. Use exp * 1000 < Date.now() or exp < Date.now() / 1000.",
      },
      {
        mistake: "Sending `Authorization: token` or `Authorization: Bearer: token`.",
        fix: "The format is exactly `Authorization: Bearer <token>`.",
      },
      {
        mistake: "Putting the JWT signing key in the React app (e.g. VITE_JWT_SECRET) to verify tokens client-side.",
        fix: "Anything in the bundle is public; with the HS256 key anyone could forge ADMIN tokens. Verification stays on the server.",
      },
    ],
    debug: {
      prompt: "This helper is meant to show the logged-in user's role, but it throws `InvalidCharacterError` for some tokens and the role check is wrong. Fix it.",
      language: "ts",
      buggyCode: `function getRole(token: string): string {
  const payload = JSON.parse(atob(token.split(".")[0]));
  return payload.role;
}

const canEdit = getRole(token) === "ADMIN"; // used to allow DELETE requests`,
      hint: "Which part holds the claims? Is a JWT segment plain Base64? And what is canEdit being used for?",
      fixedCode: `function getRoles(token: string): string[] {
  const part = token.split(".")[1]; // payload is the SECOND segment
  if (!part) return [];
  try {
    const b64 = part.replace(/-/g, "+").replace(/_/g, "/");
    const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
    const json = new TextDecoder().decode(Uint8Array.from(atob(padded), (c) => c.charCodeAt(0)));
    const payload: unknown = JSON.parse(json);
    if (payload && typeof payload === "object" && "role" in payload) {
      const role = (payload as { role: unknown }).role;
      // one role → string, several roles → array
      return (Array.isArray(role) ? role : [role]).map((r) => String(r).toUpperCase());
    }
    return [];
  } catch {
    return [];
  }
}

// UX only: show/hide the Delete button. The API still enforces ADMIN.
const showDelete = getRoles(token).includes("ADMIN");`,
      explanation: "Index 0 is the header, not the payload. JWT segments are Base64URL (may contain - and _ and lack padding), so plain atob can throw. CampusEvents payloads use the short key role, but its value can be a string or an array (several roles) or be missing, so handle those cases. Finally, the result may only drive UI — the DELETE request must be authorised by the server.",
    },
    challenge: {
      prompt: "Write `describeToken(token)` that returns `{ subject, role, issuedAt, expiresAt }` where the dates are JavaScript Date objects (or null when the claim is missing), or returns null if the token is malformed. Test it with the fictional token from the simple example.",
      starterCode: `interface TokenSummary {
  subject: string | null;
  role: string | null;
  issuedAt: Date | null;
  expiresAt: Date | null;
}

export function describeToken(token: string): TokenSummary | null {
  // TODO: split, decode payload (Base64URL), convert iat/exp seconds → Date
}`,
      language: "ts",
      hints: [
        "Reuse a decodeBase64Url helper.",
        "NumericDate claims are seconds — multiply by 1000 for new Date(ms).",
        "Guard with typeof value === 'number' before converting.",
      ],
      solution: `interface TokenSummary {
  subject: string | null;
  role: string | null;
  issuedAt: Date | null;
  expiresAt: Date | null;
}

function decodeBase64Url(part: string): string {
  const b64 = part.replace(/-/g, "+").replace(/_/g, "/");
  const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
  return new TextDecoder().decode(Uint8Array.from(atob(padded), (c) => c.charCodeAt(0)));
}

const toDate = (v: unknown): Date | null => (typeof v === "number" ? new Date(v * 1000) : null);
const toStr = (v: unknown): string | null => (typeof v === "string" ? v : null);

export function describeToken(token: string): TokenSummary | null {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  try {
    const raw: unknown = JSON.parse(decodeBase64Url(parts[1]));
    if (raw === null || typeof raw !== "object") return null;
    const c = raw as Record<string, unknown>;
    return {
      subject: toStr(c.sub),
      role: toStr(c.role),
      issuedAt: toDate(c.iat),
      expiresAt: toDate(c.exp),
    };
  } catch {
    return null;
  }
}

// describeToken(demoToken)?.expiresAt?.toISOString() === "2026-01-01T00:00:00.000Z"`,
      explanation: "The function treats the payload as untrusted JSON (unknown → narrowed), converts seconds to milliseconds, and fails safely. It never claims the token is valid — that is the server's job.",
    },
    examQuestions: [
      {
        question: "Name the three parts of a JWT and state what each contains.",
        answer: "**Header** (algorithm and token type, e.g. HS256/JWT), **payload** (claims such as sub, role, exp), **signature** (computed over header + payload with the server's key, used to detect tampering). Parts are Base64URL-encoded and separated by dots.",
        marks: 3,
      },
      {
        question: "True or False: Because a JWT is signed, its payload cannot be read by the client.",
        answer: "**False.** Signing protects integrity, not confidentiality. The payload is Base64URL-encoded and anyone can decode it, so it must not contain secrets.",
        marks: 1,
      },
      {
        question: "(Mock B15) True or False: A frontend application can use a JWT's expiry information to determine whether a token may have expired.",
        answer: "**True.** The frontend can decode the exp claim (seconds since epoch) or use the expiresAt returned at login to detect a probably-expired token and prompt re-login. The server still validates lifetime and returns 401 for expired tokens.",
        marks: 1,
      },
      {
        question: "A student decodes a JWT in the browser and says 'the token is valid because the role says ADMIN'. Explain the flaw.",
        answer: "Decoding only reads claims; it doesn't verify the signature. Anyone can craft a token whose payload says ADMIN. Only the server, holding the signing key, can verify the signature (and iss/aud/exp) and then trust the role claim.",
        marks: 2,
      },
    ],
    revision: [
      "JWT = base64url(header).base64url(payload).signature.",
      "Header: alg/typ. Payload: claims (sub, iss, aud, exp, iat + custom like role). Signature: HMAC/RSA over the first two parts.",
      "Signed ≠ encrypted: the payload is readable by anyone — no secrets in it.",
      "Decoding ≠ verifying: only the key holder (server) verifies; client decoding is UX only.",
      "exp and iat are SECONDS since epoch.",
      "Send as `Authorization: Bearer <token>`.",
      "CampusEvents: HS256, iss CampusEvents.Api, aud CampusEvents.Client, 2-hour lifetime.",
    ],
    visualizers: ["jwt-explorer"],
  },
  {
    id: "sec-401-403-expiry",
    moduleId: "m09-security",
    title: "Handling 401, 403 and expired tokens",
    summary:
      "401 means 'we don't know who you are (any more)' → clear auth and re-authenticate; 403 means 'we know you, but no' → show a not-permitted message.",
    priority: "P0",
    examCritical: true,
    minutes: 30,
    objectives: [
      "Distinguish 401 and 403 from the frontend's point of view and respond correctly to each (mock A5, B5, C5).",
      "Check a token's expiry using exp (seconds) or expiresAt and Date.now() (mock B15).",
      "Implement the expected behaviour for an expired JWT: clear auth state and re-authenticate or refresh (mock E1).",
      "Centralise 401 handling in a fetch wrapper instead of repeating it in every component.",
      "Describe at a high level how access/refresh token flows work.",
    ],
    prerequisites: ["sec-jwt-anatomy", "http-methods-status", "http-fetch-response-ok", "router-protected-routes"],
    sources: [
      { kind: "mock", label: "MOCK ICT", detail: "A5 (401), B5 (403), C5 (401 vs 403 from the frontend's perspective), B15 (JWT expiry), E1 (expired JWT)" },
      BACKEND_AUTH,
      NOT_SUPPLIED_L6,
      {
        kind: "supplementary",
        label: "MDN — 401 Unauthorized",
        url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/401",
      },
      {
        kind: "supplementary",
        label: "MDN — 403 Forbidden",
        url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/403",
      },
      RFC7519,
      {
        kind: "best-practice",
        label: "OWASP Session Management Cheat Sheet",
        url: "https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html",
      },
    ],
    why: `CampusEvents tokens live for **2 hours**. A student who leaves the tab open over lunch comes back to an app that still *looks* logged in, but every protected request now fails. If the app ignores this, buttons silently do nothing, or worse, it shows stale "logged-in" UI forever. The mock paper asks exactly this (E1: option B — handle the expired state and require re-authentication or a token-renewal flow) and asks you to explain 401 vs 403 (C5, 3 marks).`,
    analogy: `A gym membership card:

- **401** — the scanner says "card not recognised / expired". The gym doesn't know you're a valid member right now. Fix: go to reception and prove who you are again (log in) or renew the card (refresh).
- **403** — the scanner recognises you perfectly, but your basic membership does not include the spa. Logging in again changes nothing; you need a different membership (role).

Checking the expiry date printed on your card before you go is the frontend's \`exp\` check — handy, but the scanner (server) still decides.`,
    explain: {
      beginner: `**401 Unauthorized** — despite the name, this means *unauthenticated*: the server could not identify you. The token is missing, malformed, signed wrongly or **expired**. The frontend should treat the user as logged out: clear the stored token/user, and send them to the login page (ideally remembering where they were going).

**403 Forbidden** — the server knows exactly who you are, but you are **not allowed** to do this (wrong role, or not your resource). Logging in again won't help. The frontend should show a clear "You don't have permission" message and should *not* log the user out.

**Checking expiry before a request.** The JWT payload's \`exp\` claim is a number of **seconds** since 1 January 1970. \`Date.now()\` gives **milliseconds**. So:

\`\`\`ts
const expired = payload.exp * 1000 <= Date.now();
// or: payload.exp <= Date.now() / 1000
\`\`\`

CampusEvents also returns \`expiresAt\` in the login response, which you can compare with \`new Date(expiresAt).getTime()\`.

This check improves user experience (log out *before* a confusing failure, show "session expired"), but the server's 401 is still the final answer — your clock may be wrong and the server may revoke tokens early.`,
      developer: `**One central place.** Put auth handling in a small API client so every service benefits:

1. Before the request: if the stored token is expired, clear auth and throw a typed \`AuthError\` (no point sending it).
2. Attach \`Authorization: Bearer <token>\`.
3. After the response:
   - \`401\` → \`logout()\` (clear Zustand/Context + storage), throw \`AuthError\`. A route guard or error boundary redirects to \`/login?redirect=<current path>\`.
   - \`403\` → throw a \`ForbiddenError\`; the page shows a "not permitted" message. Keep the user logged in.
   - other \`!res.ok\` → throw a normal error with the status.
   - \`204\` → return \`undefined\` without calling \`res.json()\` (CampusEvents PUT/DELETE).

**Proactive logout timer.** On login you can schedule \`setTimeout(logout, expiresAtMs - Date.now())\` (clear it on logout/unmount). Keep in mind browsers clamp very long timeouts (> ~24.8 days overflow) — irrelevant for 2 h tokens but worth knowing.

**Refresh tokens (overview).** Many systems pair a **short-lived access token** (minutes) with a **longer-lived refresh token**, often in an HttpOnly cookie. On a 401 (or just before expiry) the client calls a refresh endpoint to get a new access token and retries the original request once. CampusEvents has **no refresh endpoint**, so the correct behaviour there is: expired → clear auth → login again.

**Don't loop.** If the refresh call itself returns 401, log out — never retry endlessly.`,
      deep: `**Why "Unauthorized" for authentication?** HTTP's naming is historical. RFC 9110 defines 401 as lacking valid authentication credentials and requires a \`WWW-Authenticate\` header describing how to authenticate; ASP.NET Core's JwtBearer sends \`WWW-Authenticate: Bearer\` and may add \`error="invalid_token"\` with a description such as "The token expired". 403 means the server understood the request and refuses to fulfil it; re-authenticating will not change the outcome. Some APIs deliberately return **404** instead of 403 to avoid revealing that a resource exists — the frontend should not assume a 404 always means "doesn't exist".

**Clock skew.** The client's clock can be wrong by minutes or more. JwtBearer itself tolerates a default 5-minute skew. A client that logs out exactly at \`exp\` might be slightly early or late; that's fine because the server decides. Use a small safety margin (e.g. treat tokens as expired 30 s early) to avoid sending requests that will race the expiry.

**Concurrent 401s with refresh.** If five queries fail with 401 at once, a naive client fires five refresh calls. Production clients keep a single in-flight refresh promise that all retries await. Refresh-token rotation (issuing a new refresh token each time and detecting reuse) limits damage from a stolen refresh token.

**TanStack Query interplay.** By default queries retry 3 times — pointless for 401/403. Use \`retry: (count, error) => !(error instanceof AuthError) && count < 3\`, and on logout call \`queryClient.clear()\` so the next user does not see the previous user's cached data.`,
    },
    mechanism: `\`\`\`text
 apiFetch(path)
   │
   ├─ token present?  no ──────────────────────────────┐
   ├─ isExpired(token)? (exp*1000 <= Date.now()) yes ──┤
   │                                                    ▼
   │                                       logout(); throw AuthError ──► route guard → /login?redirect=...
   ▼
 fetch(API + path, { headers: { Authorization: "Bearer " + token } })
   │
   ▼
 response.status
   ├─ 2xx (204 → no body) ──────────────► return data
   ├─ 401 ─► token missing/invalid/expired ─► logout(); throw AuthError   (re-authenticate / refresh)
   ├─ 403 ─► known user, not permitted   ─► throw ForbiddenError          (stay logged in, show message)
   └─ other ─────────────────────────────► throw HttpError(status)

 Refresh-token variant (not in CampusEvents):
   401 ─► POST /auth/refresh (HttpOnly cookie) ─► ok? store new access token, retry ONCE
                                                 └─ fail? logout()
\`\`\``,
    simpleExample: {
      title: "Is this token expired?",
      language: "ts",
      code: `/** exp is a JWT NumericDate: SECONDS since 1970-01-01T00:00:00Z. */
export function isExpired(exp: number, skewSeconds = 30): boolean {
  const nowSeconds = Date.now() / 1000; // Date.now() is MILLISECONDS
  return exp - skewSeconds <= nowSeconds;
}

/** CampusEvents also returns expiresAt (ISO string) in AuthResponseDto. */
export function isExpiredAt(expiresAt: string): boolean {
  const ms = new Date(expiresAt).getTime();
  return Number.isNaN(ms) || ms <= Date.now();
}

isExpired(1767225600); // fictional token: expired after 2026-01-01T00:00:00Z
isExpiredAt("2099-01-01T00:00:00Z"); // false`,
      walkthrough: [
        { lines: "2-5", text: "Convert milliseconds to seconds before comparing; subtract a small skew so we treat the token as expired slightly early." },
        { lines: "8-11", text: "An unparseable date is treated as expired — fail safe." },
        { lines: "13-14", text: "Both checks are UX hints; the server's 401 is authoritative." },
      ],
    },
    realExample: {
      title: "apiClient.ts — a central fetch wrapper with 401/403 handling",
      language: "ts",
      code: `import { useAuthStore } from "../stores/authStore";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:5229/api";

export class AuthError extends Error {}
export class ForbiddenError extends Error {}
export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

function isExpiredAt(expiresAt: string): boolean {
  const ms = new Date(expiresAt).getTime();
  return Number.isNaN(ms) || ms - 30_000 <= Date.now();
}

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const { token, expiresAt, logout } = useAuthStore.getState();

  if (token && expiresAt && isExpiredAt(expiresAt)) {
    logout();
    throw new AuthError("Your session has expired. Please sign in again.");
  }

  const headers = new Headers(init.headers);
  if (token) headers.set("Authorization", \`Bearer \${token}\`);
  if (init.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");

  const res = await fetch(\`\${API}\${path}\`, { ...init, headers });

  if (res.status === 401) {
    logout();
    throw new AuthError("Please sign in to continue.");
  }
  if (res.status === 403) {
    throw new ForbiddenError("You do not have permission to do that.");
  }
  if (!res.ok) throw new HttpError(res.status, \`Request failed (\${res.status})\`);
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}`,
      walkthrough: [
        { lines: "1", text: "Reads auth state outside React with the Zustand store's getState() (see the Zustand lessons)." },
        { lines: "5-11", text: "Typed errors let pages and TanStack Query's retry option distinguish auth problems from other failures." },
        { lines: "21-24", text: "Proactive check: don't send a request we already know will be rejected." },
        { lines: "26-28", text: "Headers object merges caller headers with the Bearer token and JSON content type." },
        { lines: "32-38", text: "401 → clear auth (re-authenticate). 403 → stay logged in, report lack of permission." },
        { lines: "39-41", text: "fetch doesn't throw on HTTP errors; 204 has no body, so never call json() on it." },
      ],
    },
    mistakes: [
      {
        mistake: "Logging the user out on a 403.",
        fix: "403 means authenticated but not permitted. Keep the session; show a 'not permitted' message or hide the action.",
      },
      {
        mistake: "Treating 401 as 'wrong role'.",
        fix: "401 = missing/invalid/expired credentials. Wrong role is 403.",
      },
      {
        mistake: "`if (payload.exp < Date.now())` — never true for real tokens.",
        fix: "exp is seconds; Date.now() is ms. Compare `payload.exp * 1000 < Date.now()`.",
      },
      {
        mistake: "Handling 401 in every component separately (and inconsistently).",
        fix: "Centralise in an API client / fetch wrapper that clears auth and throws a typed error.",
      },
      {
        mistake: "Letting TanStack Query retry 401s three times and keeping the previous user's cache after logout.",
        fix: "Skip retries for AuthError/ForbiddenError, and call queryClient.clear() on logout.",
      },
    ],
    debug: {
      prompt: "Users with an expired session see a blank bookings page forever and are never sent to login. Find the bugs.",
      language: "ts",
      buggyCode: `export async function getMyBookings(token: string) {
  try {
    const res = await fetch("http://localhost:5229/api/bookings/my-bookings", {
      headers: { Authorization: token },
    });
    return await res.json();
  } catch (err) {
    if ((err as { status?: number }).status === 401) {
      logout();
    }
    return [];
  }
}`,
      hint: "Does fetch throw on 401? What format does the Authorization header need? What does returning [] hide?",
      fixedCode: `export async function getMyBookings(token: string): Promise<Booking[]> {
  const res = await fetch("http://localhost:5229/api/bookings/my-bookings", {
    headers: { Authorization: \`Bearer \${token}\` },
  });
  if (res.status === 401) {
    logout(); // clear auth state; the route guard redirects to /login
    throw new AuthError("Session expired — please sign in again.");
  }
  if (res.status === 403) throw new ForbiddenError("Not permitted.");
  if (!res.ok) throw new Error(\`Failed to load bookings (\${res.status})\`);
  return (await res.json()) as Booking[];
}`,
      explanation: "fetch resolves (doesn't throw) for 401, so the catch never sees it and res.json() parses the error body. The header lacked the 'Bearer ' scheme, so even valid tokens failed. Swallowing errors and returning [] made a failure look like 'no bookings'. Check the status explicitly, log out on 401 and surface errors.",
    },
    challenge: {
      prompt: "Write `msUntilExpiry(expiresAt)` and a `scheduleAutoLogout(expiresAt, logout)` function that logs the user out when the token expires and returns a cleanup function. If the token is already expired, log out immediately.",
      starterCode: `export function msUntilExpiry(expiresAt: string): number {
  // TODO
}

export function scheduleAutoLogout(expiresAt: string, logout: () => void): () => void {
  // TODO: return a function that cancels the timer
}`,
      language: "ts",
      hints: [
        "new Date(expiresAt).getTime() - Date.now()",
        "Treat NaN as 0 (expired).",
        "setTimeout returns an id; clearTimeout(id) in the cleanup.",
      ],
      solution: `export function msUntilExpiry(expiresAt: string): number {
  const ms = new Date(expiresAt).getTime() - Date.now();
  return Number.isNaN(ms) ? 0 : Math.max(0, ms);
}

export function scheduleAutoLogout(expiresAt: string, logout: () => void): () => void {
  const delay = msUntilExpiry(expiresAt);
  if (delay === 0) {
    logout();
    return () => {};
  }
  const id = setTimeout(logout, delay);
  return () => clearTimeout(id);
}

// In a component: useEffect(() => expiresAt ? scheduleAutoLogout(expiresAt, logout) : undefined, [expiresAt, logout]);`,
      explanation: "The cleanup matters: if the user logs out manually or logs in again (new expiresAt), the old timer must be cancelled, which useEffect's cleanup does. This improves UX only — the server still rejects expired tokens with 401.",
    },
    examQuestions: [
      {
        question: "(Mock C5) Explain the difference between an HTTP 401 Unauthorized response and a 403 Forbidden response from the perspective of a frontend application. (3 marks)",
        answer: "**401** means the request lacks valid authentication — no token, an invalid token or an **expired** token. The frontend should treat the user as signed out: clear stored auth, redirect to login (or attempt a token refresh), then retry. **403** means the server knows who the user is but they **lack permission** (e.g. a USER trying an ADMIN action or another user's resource). Re-logging in won't help; the frontend should keep the session and show a 'not permitted' message / hide the action.",
        marks: 3,
      },
      {
        question: "(Mock E1) A user's JWT has expired when they try to access a protected page. What should the frontend normally do?",
        answer: "**B** — handle the expired authentication state (clear the token/user) and require reauthentication or use an appropriate token-renewal (refresh) flow. It must not keep treating the user as authenticated.",
        marks: 2,
      },
      {
        question: "(Mock A5) Which status indicates the request was understood but the user is not authenticated? A 201 B 204 C 401 D 500",
        answer: "**C — 401.** 201 = created, 204 = success with no body, 500 = server error.",
        marks: 1,
      },
      {
        question: "Write an expression that is true when a decoded JWT payload `p` (with numeric `exp`) has expired.",
        answer: "`p.exp * 1000 <= Date.now()` (or `p.exp <= Date.now() / 1000`) — exp is seconds, Date.now() is milliseconds.",
        marks: 1,
      },
    ],
    revision: [
      "401 = not authenticated (missing/invalid/expired) → clear auth, re-login or refresh.",
      "403 = authenticated but not permitted → stay logged in, show 'not permitted'.",
      "exp is seconds; compare exp * 1000 with Date.now().",
      "Client-side expiry checks are UX; the server's 401 is authoritative (clock skew!).",
      "Centralise auth handling in one fetch wrapper / API client.",
      "CampusEvents has no refresh endpoint: expired → log in again.",
      "Don't retry 401/403 in TanStack Query; queryClient.clear() on logout.",
    ],
    visualizers: ["jwt-explorer", "auth-flow"],
  },
  {
    id: "sec-token-storage",
    moduleId: "m09-security",
    title: "Where to store tokens: memory, Web Storage or HttpOnly cookies",
    summary:
      "Every storage option trades XSS exposure, CSRF exposure and convenience differently — there is no perfectly secure place, only informed trade-offs.",
    priority: "P1",
    examCritical: true,
    minutes: 20,
    objectives: [
      "Compare in-memory, localStorage, sessionStorage and HttpOnly cookie storage.",
      "Explain why JavaScript cannot read HttpOnly cookies and what that does (and doesn't) protect against.",
      "Explain the XSS risk of Web Storage and the CSRF risk of cookies, and the Secure/SameSite attributes.",
      "Justify a storage choice for the CampusEvents coursework.",
    ],
    prerequisites: ["sec-jwt-anatomy"],
    sources: [
      {
        kind: "university",
        label: "Lecture 01 — How the Web Works",
        detail: "Slide 4 speaker notes: 'storing a jwt in a normal cookie isn't safe, using httponly cookie is better'; slide 25",
      },
      NOT_SUPPLIED_L6,
      {
        kind: "best-practice",
        label: "OWASP HTML5 Security Cheat Sheet — Local Storage",
        url: "https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html",
      },
      {
        kind: "supplementary",
        label: "MDN — Using HTTP cookies",
        url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies",
      },
      {
        kind: "supplementary",
        label: "MDN — Set-Cookie (HttpOnly, Secure, SameSite)",
        url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie",
      },
      {
        kind: "supplementary",
        label: "MDN — Window.localStorage",
        url: "https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage",
      },
    ],
    why: `After login you hold a token that grants access to the user's account for 2 hours. Where you keep it decides **who else might get it** and **what survives a page refresh**. Students often hear "never use localStorage!" or "cookies are always safe!" — both oversimplify. Examiners reward answers that name the specific threat each option is exposed to.`,
    analogy: `Where do you keep a hotel key card?

- **In your hand (memory):** hard to steal unnoticed, but you lose it when you fall asleep (page refresh).
- **On the desk in your room (localStorage):** survives the night, but anyone who gets *into the room* (malicious script via XSS) can pick it up and walk away with it.
- **In the hotel safe that only staff can open (HttpOnly cookie):** you can't take it out yourself, and neither can an intruder — but the safe opens automatically for anyone sending requests *as you*, so you also need rules about who may ask (SameSite/CSRF protection).

Nothing protects you if an intruder is already in the room acting as you; you can only make theft and misuse harder.`,
    explain: {
      beginner: `**Options:**

| Where | Survives refresh? | Readable by JS? | Sent automatically? |
|---|---|---|---|
| React state / Zustand (memory) | No | Yes (your code) | No |
| \`sessionStorage\` | Yes, for that tab only | Yes | No |
| \`localStorage\` | Yes, until cleared | Yes | No |
| Cookie (normal) | Yes (until expiry) | Yes | Yes, to that site |
| Cookie with \`HttpOnly\` | Yes | **No** | Yes, to that site |

**XSS** (cross-site scripting) means an attacker manages to run their JavaScript on your page. That script can read anything *your* JavaScript can read — so tokens in memory, sessionStorage, localStorage or normal cookies can be stolen and used elsewhere.

**HttpOnly cookies** cannot be read by JavaScript at all, so XSS cannot simply copy the token out. But because the browser sends cookies automatically, another site might trick the browser into sending a request *with* that cookie — that's **CSRF** (cross-site request forgery). The \`SameSite\` attribute and CSRF tokens reduce that risk.

**Secure** means the cookie is only sent over HTTPS.

The honest conclusion: **no option is perfectly secure**. The best defence is to prevent XSS in the first place, keep tokens short-lived, and let the server enforce everything.`,
      developer: `**What the frontend can choose by itself.** CampusEvents returns the token in the JSON body, so the backend does not set cookies. A React app can only choose memory, sessionStorage or localStorage:

- **Memory only** (e.g. Zustand without persist): smallest exposure window, but the user must log in again after every refresh. Fine for coursework demos; annoying for real users.
- **sessionStorage**: survives refresh, cleared when the tab closes; not shared between tabs.
- **localStorage**: survives restarts and is shared across tabs — most convenient, longest exposure. Common in tutorials and acceptable for coursework *if you can explain the XSS trade-off*.

**HttpOnly cookie** requires **backend changes**: the server sets \`Set-Cookie: access_token=...; HttpOnly; Secure; SameSite=Lax; Path=/\` and reads the cookie instead of the \`Authorization\` header. Cross-origin dev setups (\`localhost:5173\` → \`localhost:5229\`) also need \`credentials: "include"\` on fetch and CORS with \`AllowCredentials()\` and an explicit origin.

**Whatever you store:** clear it on logout *and* on 401, never log it to the console, don't put it in URLs (they end up in history, logs and Referer headers), and keep the user object separate from the token so UI code doesn't pass tokens around.

A common hybrid in production: short-lived access token in memory + refresh token in an HttpOnly, Secure, SameSite cookie scoped to the refresh endpoint.`,
      deep: `**What HttpOnly really buys.** It prevents *exfiltration* of the cookie value by script. It does **not** stop an XSS payload from making authenticated requests from the victim's own browser while the page is open (the browser attaches the cookie for it). So HttpOnly turns "attacker steals a token they can use for hours from anywhere" into "attacker can act only while their script runs in the victim's tab" — a meaningful reduction, not immunity.

**SameSite.** \`Strict\` never sends the cookie on cross-site requests; \`Lax\` (the default in modern Chromium-based browsers when the attribute is absent) sends it on top-level GET navigations but not on cross-site POSTs or sub-requests; \`None\` sends it everywhere and requires \`Secure\`. Note *site* ≠ *origin*: \`localhost:5173\` and \`localhost:5229\` are the **same site** (port is ignored for site), so SameSite doesn't block those dev requests, while CORS (which is origin-based) still applies.

**Bearer tokens in headers are not sent automatically**, so classic CSRF doesn't apply to them — another site cannot make the browser attach a header it doesn't know. That's the genuine upside of Web Storage + Authorization header, balanced against the XSS exfiltration downside.

**Other leak paths:** browser extensions with page access, shared/public computers (localStorage persists), malicious dependencies in your bundle (supply-chain XSS), and error-tracking tools capturing request headers. Mitigations: CSP, dependency hygiene, short lifetimes, server-side revocation, and rotating refresh tokens.

OWASP's HTML5 cheat sheet recommends avoiding storing session identifiers in localStorage; many teams still accept the trade-off with strong XSS controls. Whichever you choose, *state the threat model*.`,
    },
    mechanism: `\`\`\`text
                    ┌──────────── browser tab (origin http://localhost:5173) ───────────┐
  XSS script ──────►│  JS heap (memory)   sessionStorage   localStorage   document.cookie │
  (runs as page)    │      readable ✓          readable ✓      readable ✓    readable ✓   │
                    │                                                    (non-HttpOnly) │
                    │  HttpOnly cookie jar:  NOT readable by JS ✗                         │
                    └────────────────────────────┬──────────────────────────────────────┘
                                                 │ browser attaches cookies AUTOMATICALLY
                                                 ▼
   evil.example ── form POST / link ──► API ◄── cookie sent? depends on SameSite (CSRF risk)
                                         ▲
                                         └── Authorization: Bearer header is only sent
                                             when OUR code adds it (no automatic CSRF)

 Threat summary:
   Web Storage / memory  → XSS can READ and EXFILTRATE the token
   HttpOnly cookie       → XSS cannot read it, but can still RIDE the session; CSRF needs SameSite/tokens
   Secure                → cookie only over HTTPS (protects in transit, not against XSS)
\`\`\``,
    simpleExample: {
      title: "A tiny storage abstraction you can swap later",
      language: "ts",
      code: `export interface TokenStore {
  get(): string | null;
  set(token: string): void;
  clear(): void;
}

// Option 1: memory only — lost on refresh, smallest exposure window
let memoryToken: string | null = null;
export const memoryStore: TokenStore = {
  get: () => memoryToken,
  set: (t) => { memoryToken = t; },
  clear: () => { memoryToken = null; },
};

// Option 2: sessionStorage — survives refresh, cleared when the tab closes
const KEY = "ce.auth.token";
export const sessionStore: TokenStore = {
  get: () => sessionStorage.getItem(KEY),
  set: (t) => sessionStorage.setItem(KEY, t),
  clear: () => sessionStorage.removeItem(KEY),
};`,
      walkthrough: [
        { lines: "1-5", text: "Hide the storage choice behind an interface so you can change strategy without touching components." },
        { lines: "8-13", text: "Memory storage: a module variable. Readable by any script on the page, but gone on reload." },
        { lines: "16-21", text: "sessionStorage: per-tab persistence. Still readable by injected scripts (XSS)." },
      ],
    },
    realExample: {
      title: "Cookie-based alternative (requires backend support) — the fetch side",
      language: "ts",
      code: `// If the backend set the token as:
//   Set-Cookie: access_token=...; HttpOnly; Secure; SameSite=Lax; Path=/api
// the frontend never sees or stores the token. It just asks the browser to send cookies.

const API = import.meta.env.VITE_API_URL ?? "http://localhost:5229/api";

export async function getMyBookingsWithCookie(): Promise<unknown[]> {
  const res = await fetch(\`\${API}/bookings/my-bookings\`, {
    credentials: "include", // cross-origin (5173 → 5229) requests need this to send cookies
  });
  if (res.status === 401) throw new Error("Not signed in");
  if (!res.ok) throw new Error(\`Request failed (\${res.status})\`);
  return (await res.json()) as unknown[];
}

// Server-side requirements (not frontend code):
//  - CORS: WithOrigins("http://localhost:5173").AllowCredentials()  (no "*" with credentials)
//  - read the token from the cookie instead of the Authorization header
//  - CSRF defence for state-changing requests (SameSite + anti-forgery token)

// What the frontend CAN still know: user profile/role returned in the login response body,
// kept in memory or Zustand for rendering decisions.`,
      walkthrough: [
        { lines: "1-3", text: "With HttpOnly the token is invisible to JS — document.cookie won't show it." },
        { lines: "9", text: "credentials: 'include' tells fetch to send/accept cookies on cross-origin requests." },
        { lines: "16-19", text: "This option needs backend changes; CampusEvents as supplied uses the Authorization header instead." },
        { lines: "21-22", text: "UI still needs to know who is logged in — keep the non-secret user info separately." },
      ],
    },
    mistakes: [
      {
        mistake: "Claiming localStorage is 'encrypted' or 'private to the user'.",
        fix: "It's plain text accessible to any script running on that origin, and it persists on shared computers.",
      },
      {
        mistake: "Claiming HttpOnly cookies make the app immune to XSS.",
        fix: "They stop token theft by script, but an XSS payload can still send requests from the victim's browser. Preventing XSS is still essential.",
      },
      {
        mistake: "Saying cookies have no CSRF risk because the token is signed.",
        fix: "CSRF abuses the browser's automatic sending of cookies; the signature is valid because it's the user's real cookie. Use SameSite and CSRF tokens.",
      },
      {
        mistake: "Reading an HttpOnly cookie with document.cookie to put it in the Authorization header.",
        fix: "Impossible by design. If the server uses HttpOnly cookies, send them with credentials: 'include'.",
      },
      {
        mistake: "Forgetting to clear stored tokens on logout and on 401.",
        fix: "Clear every place you stored it (state, storage) and the TanStack Query cache.",
      },
    ],
    debug: {
      prompt: "A reviewer flags three security smells in this login success handler. Fix them.",
      language: "ts",
      buggyCode: `function onLoginSuccess(data: AuthResponse) {
  console.log("logged in", data);
  localStorage.setItem("auth", JSON.stringify({ ...data, password: form.password }));
  navigate(\`/dashboard?token=\${data.token}\`);
}`,
      hint: "What gets logged? What extra field is stored? Where does the token end up in the last line?",
      fixedCode: `function onLoginSuccess(data: AuthResponse) {
  // never log tokens or credentials
  const { token, expiresAt, ...user } = data;
  localStorage.setItem("auth", JSON.stringify({ token, expiresAt, user })); // documented XSS trade-off
  navigate("/dashboard"); // no token in the URL
}`,
      explanation: "Logging the response writes the token to the console (and possibly to log-capture tools). Storing the password is never acceptable — the token exists precisely so you don't keep it. Putting tokens in URLs leaks them into browser history, server logs and Referer headers. The remaining localStorage choice is a conscious trade-off you should be able to justify.",
    },
    challenge: {
      prompt: "Write a short (5–6 sentence) justification for how YOUR CampusEvents coursework stores the token, naming one threat it is exposed to and two mitigations. Then implement `clearAuthEverywhere(queryClient)`.",
      starterCode: `import type { QueryClient } from "@tanstack/react-query";

export function clearAuthEverywhere(queryClient: QueryClient): void {
  // TODO: remove persisted auth, reset in-memory state, clear cached server data
}`,
      language: "ts",
      hints: [
        "If you use Zustand persist with name 'auth', the key in localStorage is 'auth'.",
        "queryClient.clear() removes all cached queries and mutations.",
        "Mention XSS as the exposure for Web Storage.",
      ],
      solution: `import type { QueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../stores/authStore";

/*
 Justification: The CampusEvents API returns the JWT in the response body and expects an
 Authorization: Bearer header, so I keep auth in a Zustand store persisted to localStorage
 to survive page refreshes. The main exposure is XSS: any injected script could read the
 token. Mitigations: React's default escaping and no dangerouslySetInnerHTML with
 unsanitised input; the token lives only 2 hours and is cleared on logout and on any 401;
 a CSP would further restrict script sources in production. The server enforces all roles.
*/
export function clearAuthEverywhere(queryClient: QueryClient): void {
  useAuthStore.getState().logout(); // resets token/user in memory
  useAuthStore.persist.clearStorage(); // removes the persisted 'auth' entry
  queryClient.clear(); // the next user must not see this user's cached bookings
}`,
      explanation: "Exam-quality security answers name the threat (XSS/CSRF), the asset (the token), and concrete mitigations, without claiming perfection. Clearing auth everywhere prevents data leaking between users on a shared computer.",
    },
    examQuestions: [
      {
        question: "Compare storing a JWT in localStorage with storing it in an HttpOnly cookie. (4 marks)",
        answer: "**localStorage:** persists across refreshes and is easy to use with an Authorization header; not sent automatically, so classic CSRF doesn't apply; but **any script on the page can read it**, so an XSS vulnerability can steal the token. **HttpOnly cookie:** JavaScript cannot read it, so XSS cannot simply exfiltrate it; but the browser sends it **automatically**, so CSRF must be mitigated (SameSite, CSRF tokens), it requires server support and `credentials: 'include'` for cross-origin calls. Neither is perfectly secure; preventing XSS and short token lifetimes matter in both cases.",
        marks: 4,
      },
      {
        question: "True or False: An HttpOnly cookie cannot be read via document.cookie.",
        answer: "**True.** That is the purpose of the HttpOnly attribute.",
        marks: 1,
      },
      {
        question: "What does the Secure cookie attribute do, and what does it not do?",
        answer: "It ensures the cookie is only sent over HTTPS, protecting it in transit. It does not stop XSS or CSRF and does not hide the cookie from JavaScript (that's HttpOnly).",
        marks: 2,
      },
      {
        question: "Why should a token never be placed in a URL query string?",
        answer: "URLs are stored in browser history, server/proxy logs and can be leaked through the Referer header or by sharing links, exposing the token to others.",
        marks: 1,
      },
    ],
    revision: [
      "Memory: lost on refresh; smallest exposure. Web Storage: persists; readable by XSS.",
      "sessionStorage = per tab, cleared on tab close; localStorage = persists, shared across tabs.",
      "HttpOnly cookie: unreadable by JS; still sent automatically → CSRF; needs server support.",
      "Secure = HTTPS only. SameSite = Strict/Lax/None controls cross-site sending.",
      "Bearer headers aren't attached automatically → no classic CSRF, but XSS can steal stored tokens.",
      "No option is perfectly secure — prevent XSS, keep tokens short-lived, enforce on the server.",
      "Clear token + cached data on logout and on 401; never log tokens or put them in URLs.",
    ],
  },
  {
    id: "sec-trust-boundaries",
    moduleId: "m09-security",
    title: "Trust boundaries: the frontend is untrusted",
    summary:
      "Everything in the browser can be read and changed by the user, so route guards and hidden buttons are UX — the server must enforce access, and API data must be validated before use.",
    priority: "P0",
    examCritical: true,
    minutes: 25,
    objectives: [
      "Explain why client-side code, guards and hidden UI cannot be a security mechanism (mock E3).",
      "Identify broken access control and IDOR, and explain why the server must check ownership.",
      "Treat API responses as untrusted input and validate them at runtime (mock E5).",
      "Explain why VITE_ environment variables are public and must never contain secrets.",
    ],
    prerequisites: ["sec-authn-authz", "router-protected-routes"],
    sources: [
      { kind: "mock", label: "MOCK ICT", detail: "E3 (why not rely on hiding pages), E5 (treating API data as trustworthy), B9 (client-side validation guarantees nothing)" },
      BACKEND_AUTH,
      {
        kind: "university",
        label: "CampusEvents.Api — BookingsController.cs",
        detail: "Ownership check: if (booking.UserId != userId && !User.IsInRole(\"ADMIN\")) return Forbid();",
      },
      NOT_SUPPLIED_L6,
      {
        kind: "best-practice",
        label: "OWASP Top 10 — A01 Broken Access Control",
        url: "https://owasp.org/Top10/A01_2021-Broken_Access_Control/",
      },
      {
        kind: "best-practice",
        label: "OWASP IDOR Prevention Cheat Sheet",
        url: "https://cheatsheetseries.owasp.org/cheatsheets/Insecure_Direct_Object_Reference_Prevention_Cheat_Sheet.html",
      },
      {
        kind: "supplementary",
        label: "Vite — Env Variables and Modes",
        url: "https://vite.dev/guide/env-and-mode",
      },
    ],
    why: `The single most important frontend security idea: **you do not control the client**. The user owns the browser. They can open DevTools, change state, edit JavaScript, replay requests with Postman or curl, and skip your React app entirely. The mock paper asks this directly (E3: option B) and B9 tests the related idea that client-side validation doesn't guarantee anything. Getting this right tells the examiner you understand where security actually lives.`,
    analogy: `Your React app is the **shop window and the sales assistant**; the API is the **vault with its own guard**.

The assistant can politely say "staff only" and steer customers away from the back door (route guards, hidden buttons). But a determined person can walk past the assistant or come in through the loading bay (Postman). The vault guard must check every person's ID and permission *at the vault door*, no matter what the assistant said. And deliveries arriving at the shop (API responses) get inspected before they go on the shelves.`,
    explain: {
      beginner: `A **trust boundary** is a line where data or control passes from something you don't control to something you do. Between the browser and the server is the most important one.

**Things that are UX, not security:**

- A \`<ProtectedRoute>\` that redirects to \`/login\` if there's no token.
- Hiding the "Delete event" button unless \`role === "ADMIN"\`.
- Client-side form validation ("price must be positive").

They make the app pleasant and prevent honest mistakes. But anyone can change \`role\` in DevTools, or send \`DELETE /api/events/5\` directly. That is why CampusEvents puts \`[Authorize(Roles = "ADMIN")]\` on the server and validates data there too.

**Data coming back from the API is also outside your control.** A request succeeding (200 OK) only tells you the server answered; it doesn't mean the body has the shape you expected, or that text inside it is safe to render as HTML. Fields can be \`null\` (CampusEvents' \`imageUrl\` can be), the API might change, or user-generated text (event descriptions, reviews) might contain malicious markup. Validate and render it safely (mock E5 is **False**).

**Environment variables:** anything starting with \`VITE_\` is copied into your JavaScript bundle at build time. Users can read it. So \`VITE_API_URL\` is fine; \`VITE_JWT_SECRET\` or a private API key is a leak.`,
      developer: `**Guards are still worth writing** — they give users a good experience — just be accurate about their role:

\`\`\`tsx
function RequireAdmin({ children }: { children: React.ReactNode }) {
  const role = useAuthStore((s) => s.user?.role);
  if (!role) return <Navigate to="/login" replace />;
  if (role !== "ADMIN") return <p>You don't have access to this page.</p>; // UX
  return children;
}
\`\`\`

**Broken access control / IDOR.** An *Insecure Direct Object Reference* is when the server uses an id from the request (\`/api/bookings/17\`) without checking that the caller owns it. Changing 17 to 18 then exposes someone else's booking. The fix is server-side: CampusEvents' BookingsController compares \`booking.UserId\` with the caller's id and returns \`Forbid()\` (403) unless the caller is ADMIN. The frontend can't fix IDOR — at most it avoids *displaying* ids carelessly.

**Validating API data.** TypeScript types disappear at runtime; \`res.json() as Event[]\` is a promise to the compiler, not a check. Use a schema (Zod) at the service boundary:

\`\`\`ts
const EventSchema = z.object({ id: z.number(), title: z.string(), imageUrl: z.string().nullable() /* ... */ });
const events = z.array(EventSchema).parse(await res.json());
\`\`\`

**Secrets.** Vite exposes only \`VITE_\`-prefixed variables to client code via \`import.meta.env\` — that prefix is a *publishing* switch. Secrets (database passwords, signing keys, third-party secret keys) belong on a server.`,
      deep: `**Threat model the client as an attacker-controlled program.** Assume an adversary can: modify any JS or state at runtime, replay or forge any HTTP request with any headers, read every string in the bundle (minification is not obfuscation, and source maps may even ship), bypass any timing or sequence your UI enforces (e.g. skip a "confirm payment" step), and send values your forms would never produce (negative \`quantity\`, other users' ids, extra JSON fields like \`"role":"ADMIN"\` — *mass assignment*, which DTOs help prevent on the server, as Lecture 01's DTO slides note).

**Defence in depth on the client is still valuable**: it reduces accidental misuse, limits XSS impact, and avoids leaking information. Examples: don't render data you don't need; don't put PII in URLs or logs; validate API data to fail safely (a Zod parse error is better than rendering \`undefined\` everywhere or crashing deep in a component); sanitise any HTML you must render.

**Information disclosure.** Hiding an admin page doesn't hide its code: lazy-loaded admin bundles are still downloadable. Don't embed sensitive business logic, internal URLs or feature flags you consider secret. Error messages from the API should not be echoed verbatim if they leak internals.

**OWASP A01 Broken Access Control** was the #1 category in the OWASP Top 10 (2021) — missing function-level checks (USER calling an ADMIN endpoint) and object-level checks (IDOR) are both server responsibilities. A frontend developer's professional duty is to *notice* when an API seems to trust the client (e.g. it accepts \`userId\` in a POST body instead of deriving it from the token — note CampusEvents derives the user from the token's claims) and to raise it.`,
    },
    mechanism: `\`\`\`text
        UNTRUSTED (user controls everything)          │           TRUSTED (you control)
 ─────────────────────────────────────────────────────┼──────────────────────────────────────
  React bundle  (readable, editable, VITE_* visible)  │
  Route guards / hidden buttons   ── UX only ──       │
  Client validation               ── UX only ──       │   CampusEvents.Api
  Postman / curl / DevTools  ───── any request ──────►│   1. authenticate (JwtBearer)   → 401
                                                      │   2. authorise role             → 403
                                                      │      [Authorize(Roles="ADMIN")]
                                                      │   3. authorise OWNERSHIP (IDOR) → 403
                                                      │      booking.UserId == caller?
                                                      │   4. validate input (DTOs)      → 400
  API response  ◄──────────── data crosses back ──────│
  (validate shape at runtime; render text safely)     │
\`\`\`

Every arrow that crosses the boundary must be checked on the receiving side: the server checks requests; the client checks responses before relying on them.`,
    simpleExample: {
      title: "UX guard vs real enforcement",
      language: "tsx",
      code: `import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuthStore } from "../stores/authStore";

// UX: keeps honest users away from a page they can't use.
// NOT security: a user can edit the store or call the API directly.
export function RequireAdmin({ children }: { children: ReactNode }) {
  const user = useAuthStore((s) => s.user);
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "ADMIN") return <p role="alert">You don't have access to this page.</p>;
  return <>{children}</>;
}

// The real rule lives on the server (CampusEvents EventsController):
//   [Authorize(Roles = "ADMIN")]
//   public async Task<IActionResult> Delete(int id) { ... }`,
      walkthrough: [
        { lines: "5-6", text: "State the limitation explicitly in code comments and in exam answers." },
        { lines: "9", text: "No user → login (mirrors a 401)." },
        { lines: "10", text: "Wrong role → friendly message (mirrors a 403)." },
        { lines: "14-16", text: "The server attribute is what actually prevents a USER deleting events." },
      ],
    },
    realExample: {
      title: "eventService.ts — validating untrusted API data with Zod",
      language: "ts",
      code: `import { z } from "zod";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:5229/api"; // public config, OK

export const EventSchema = z.object({
  id: z.number().int(),
  title: z.string(),
  description: z.string(),
  imageUrl: z.string().nullable(),
  startDate: z.string(),
  endDate: z.string(),
  location: z.string(),
  price: z.number().nonnegative(),
  capacity: z.number().int(),
  availableTickets: z.number().int(),
  categoryId: z.number().int(),
  categoryName: z.string(),
});
export type EventDto = z.infer<typeof EventSchema>;

export async function getEvents(signal?: AbortSignal): Promise<EventDto[]> {
  const res = await fetch(\`\${API}/events\`, { signal });
  if (!res.ok) throw new Error(\`Failed to load events (\${res.status})\`);
  const json: unknown = await res.json();
  const result = z.array(EventSchema).safeParse(json);
  if (!result.success) {
    // 200 OK but the wrong shape: fail loudly instead of rendering undefined
    throw new Error("Unexpected data from the events API");
  }
  return result.data;
}

// Rendering: {event.description} in JSX is escaped by React — no dangerouslySetInnerHTML.`,
      walkthrough: [
        { lines: "3", text: "VITE_API_URL is bundled into the client — fine for a URL, never for a secret." },
        { lines: "5-18", text: "The schema mirrors the CampusEvents Event shape, including the nullable imageUrl." },
        { lines: "19", text: "Derive the TypeScript type from the schema so compile-time and runtime agree." },
        { lines: "24-29", text: "json is unknown until validated. A 200 response with the wrong shape is still an error." },
        { lines: "33", text: "Text from the API is rendered as text, not HTML." },
      ],
    },
    mistakes: [
      {
        mistake: "\"Users can't reach /admin because the route is protected.\"",
        fix: "They can still call the admin API endpoints directly. Route guards are UX; the API must authorise every request.",
      },
      {
        mistake: "Putting API secrets in .env as VITE_SECRET_KEY because '.env is not committed'.",
        fix: "VITE_ variables are embedded in the built JS that every visitor downloads. Keep secrets on a server.",
      },
      {
        mistake: "Casting `await res.json() as Event[]` and assuming it's safe.",
        fix: "Type assertions do nothing at runtime. Validate with a schema (Zod) or type guards at the service boundary.",
      },
      {
        mistake: "Sending userId in the request body so the server knows whose booking it is.",
        fix: "The server should derive identity from the verified token; trusting a client-supplied userId invites IDOR/impersonation.",
      },
      {
        mistake: "Thinking client-side validation means the server doesn't need to validate (mock B9).",
        fix: "Client validation can be bypassed. The server must validate too; client validation is for UX.",
      },
    ],
    debug: {
      prompt: "A team believes this code makes the 'Delete' endpoint admin-only. Identify every trust-boundary error and rewrite the client code correctly.",
      language: "tsx",
      buggyCode: `const SECRET = import.meta.env.VITE_ADMIN_PASSWORD;

function DeleteButton({ eventId }: { eventId: number }) {
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  if (!isAdmin) return null;
  return (
    <button onClick={() =>
      fetch(\`/api/events/\${eventId}?adminPassword=\${SECRET}\`, { method: "DELETE" })
    }>Delete</button>
  );
}`,
      hint: "Who can read VITE_ variables? Who can change localStorage? What should authorise the DELETE?",
      fixedCode: `function DeleteButton({ eventId }: { eventId: number }) {
  const role = useAuthStore((s) => s.user?.role);
  const token = useAuthStore((s) => s.token);
  if (role !== "ADMIN") return null; // UX only

  async function handleDelete() {
    const res = await fetch(\`\${API}/events/\${eventId}\`, {
      method: "DELETE",
      headers: { Authorization: \`Bearer \${token}\` },
    });
    if (res.status === 403) alert("You are not allowed to delete events.");
    else if (res.status === 400) alert("This event has bookings or reviews and cannot be deleted.");
    else if (!res.ok) alert(\`Delete failed (\${res.status})\`);
    // 204 No Content → success, no body to parse
  }

  return <button onClick={handleDelete}>Delete</button>;
}`,
      explanation: "VITE_ADMIN_PASSWORD is shipped to every visitor, so the 'secret' is public — and putting it in a URL leaks it further. localStorage 'isAdmin' can be set by anyone in DevTools. The only real check is the server validating the Bearer token and the ADMIN role. The fixed version hides the button for UX, sends the token, and handles 403/400/204 properly.",
    },
    challenge: {
      prompt: "Classify each item as (S) security control or (U) UX only, and give a one-line reason: (1) RequireAdmin route wrapper, (2) [Authorize(Roles=\"ADMIN\")], (3) Zod validation of form input before POST, (4) server-side DTO validation, (5) hiding the 'Edit' button for USERs, (6) server ownership check in BookingsController, (7) Zod validation of API responses.",
      language: "text",
      hints: [
        "Ask: can the user bypass it without touching the server?",
        "Validation of API responses protects your app's correctness, not the server.",
      ],
      solution: `1. U — runs in the browser; user can edit state or call the API directly.
2. S — enforced by the server on every request; cannot be bypassed from the client.
3. U — improves feedback; requests can be sent without the form.
4. S — server rejects invalid data regardless of the client.
5. U — hidden UI; the endpoint still exists.
6. S — server prevents IDOR by comparing booking.UserId with the token's user.
7. U for the server / defensive for the client — it protects the frontend from crashing or
   mis-rendering on unexpected data (mock E5), but does not protect server resources.`,
      explanation: "A useful test: if a user with curl and a valid USER token could get around it, it's not a security control for the server's resources.",
    },
    examQuestions: [
      {
        question: "(Mock E3) Why should the frontend not rely exclusively on hiding restricted pages as its security mechanism?",
        answer: "**B** — users can manipulate client-side code or send requests directly (DevTools, Postman), so access permissions must also be enforced by the server. Hiding pages is only a UX measure.",
        marks: 2,
      },
      {
        question: "(Mock E5) True or False: A frontend application should treat data received from an external API as automatically trustworthy simply because the request was successful.",
        answer: "**False.** A 2xx status only means the server responded successfully; the body may have an unexpected shape, null fields, or user-generated content that must be rendered safely. Validate (e.g. with Zod) and escape output.",
        marks: 2,
      },
      {
        question: "What is an IDOR vulnerability and whose responsibility is it to prevent it?",
        answer: "Insecure Direct Object Reference: the server uses an identifier from the request (e.g. /api/bookings/18) without checking that the caller may access that object, so changing the id exposes others' data. The **server** must check ownership/permission for every object (CampusEvents returns 403 via Forbid()).",
        marks: 2,
      },
      {
        question: "Is it safe to store a third-party API secret in VITE_PAYMENT_SECRET? Explain.",
        answer: "No. Vite replaces import.meta.env.VITE_* with literal values in the client bundle, which every visitor downloads and can read. Secrets must stay on a server (e.g. a backend endpoint that calls the third party).",
        marks: 2,
      },
    ],
    revision: [
      "The client is untrusted: users can read/modify code and forge requests.",
      "Route guards, hidden buttons and client validation = UX, not security (E3, B9).",
      "Server enforces authN (401), role authZ (403), ownership/IDOR (403), validation (400).",
      "Successful response ≠ trustworthy data: validate at runtime, render as text (E5).",
      "TypeScript types/assertions don't validate at runtime — use Zod at the service boundary.",
      "VITE_* env vars are public — never put secrets in the bundle.",
      "Derive the user from the token on the server, not from a client-supplied userId.",
    ],
    visualizers: ["trust-boundary"],
  },
  {
    id: "sec-xss-csrf-https",
    moduleId: "m09-security",
    title: "XSS, CSRF, HTTPS and other frontend attack surfaces",
    summary:
      "React escapes text by default, dangerouslySetInnerHTML bypasses that, CSP limits damage, SameSite/CSRF tokens protect cookie sessions, and HTTPS protects data in transit — not against XSS.",
    priority: "P1",
    examCritical: true,
    minutes: 30,
    objectives: [
      "Explain XSS, how React's escaping helps, and when dangerouslySetInnerHTML is dangerous.",
      "Sanitise untrusted HTML with DOMPurify and validate URLs before using them in href/src.",
      "Explain CSRF, why it targets cookie-based auth, and how SameSite and CSRF tokens mitigate it.",
      "State precisely what HTTPS protects (mock E4) and what it does not.",
      "Recognise open redirects and dependency (supply-chain) risks.",
    ],
    prerequisites: ["sec-token-storage", "sec-trust-boundaries"],
    sources: [
      { kind: "mock", label: "MOCK ICT", detail: "E4 (HTTPS protects tokens in transit), E5 (untrusted API data)" },
      NOT_SUPPLIED_L6,
      {
        kind: "best-practice",
        label: "OWASP Cross Site Scripting Prevention Cheat Sheet",
        url: "https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html",
      },
      {
        kind: "best-practice",
        label: "OWASP Cross-Site Request Forgery Prevention Cheat Sheet",
        url: "https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html",
      },
      {
        kind: "best-practice",
        label: "OWASP Unvalidated Redirects and Forwards Cheat Sheet",
        url: "https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html",
      },
      {
        kind: "supplementary",
        label: "MDN — Content Security Policy (CSP)",
        url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP",
      },
      {
        kind: "supplementary",
        label: "react.dev — dangerouslySetInnerHTML",
        url: "https://react.dev/reference/react-dom/components/common#dangerously-setting-the-inner-html",
      },
      {
        kind: "optional",
        label: "DOMPurify (HTML sanitiser)",
        url: "https://github.com/cure53/DOMPurify",
      },
    ],
    why: `CampusEvents shows user-generated content: event descriptions, reviews and comments. If any of that is rendered as HTML without care, one malicious review can run JavaScript in every visitor's browser — reading tokens from storage, calling the API as them, or rewriting the page. Knowing which React patterns are safe by default and which are escape hatches lets you build features without opening holes, and lets you answer E4/E5-style questions precisely.`,
    analogy: `- **XSS** is someone slipping a forged instruction note into the *staff* noticeboard — staff (the browser) follow it because it appears to come from inside the shop.
- **CSRF** is a con artist sending a letter to your bank that *you* unknowingly sign because your pen (cookie) signs automatically whenever you hold a page.
- **HTTPS** is an armoured van between you and the bank: nobody can read or alter the parcel on the road, but it doesn't check whether the parcel was poisoned before it was loaded or after it arrives.`,
    explain: {
      beginner: `**XSS (Cross-Site Scripting)** happens when attacker-supplied text is treated as code in your page. Example: a review that contains \`<img src=x onerror="steal()">\`. If the page inserts it as HTML, the browser runs \`steal()\`.

**React protects you by default.** When you write \`<p>{review.text}</p>\`, React inserts it as **text**, so \`<img ...>\` appears literally on screen and nothing runs. Danger starts when you bypass that: \`dangerouslySetInnerHTML\`, setting \`element.innerHTML\` manually, or putting untrusted URLs into \`href\` (e.g. \`javascript:...\`). If you really must render HTML (say, rich-text descriptions), **sanitise** it first with a library like DOMPurify.

**CSRF (Cross-Site Request Forgery)** tricks your browser into sending a request to a site where you're logged in *with cookies*. Because browsers attach cookies automatically, the evil site doesn't need to know your password. It mostly affects **cookie-based** auth. Defences: \`SameSite\` cookies and CSRF tokens on the server.

**HTTPS** encrypts traffic between browser and server, so people on the same Wi-Fi can't read or modify your token or password **in transit** (mock E4: **True**). But HTTPS does **not** stop XSS — the malicious script runs *inside* the page, after decryption.

**Other risks:** *open redirects* (\`/login?redirect=https://evil.example\` sending users to a phishing site after login) and *vulnerable npm packages* that run code inside your app.`,
      developer: `**Safe vs unsafe rendering in React:**

\`\`\`tsx
<p>{review.text}</p>                                   // ✅ escaped text
<div dangerouslySetInnerHTML={{ __html: review.html }} /> // ❌ raw HTML from users
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(review.html) }} /> // ✅ sanitised
<a href={event.website}>Website</a>                    // ⚠️ validate protocol first
\`\`\`

React escapes text children and attribute values, but it can't know that \`javascript:alert(1)\` in an \`href\` is dangerous in every case (React 19 blocks \`javascript:\` URLs in \`href\`/\`src\` by default, replacing them with a safe value, but don't rely on that alone — validate with \`new URL()\` and allow only \`http:\`/\`https:\`).

**Content Security Policy** — an HTTP response header (or \`<meta>\` tag) like \`Content-Security-Policy: default-src 'self'; script-src 'self'; object-src 'none'; base-uri 'self'\` tells the browser which sources may load scripts, so an injected inline script is blocked. Set by the server/host serving your built app; Vite's dev server needs relaxations, so test CSP on the production build.

**CSRF** for cookie sessions: \`SameSite=Lax\` or \`Strict\`, plus server-issued anti-forgery tokens sent in a custom header for state-changing requests. With CampusEvents' Bearer-header model, CSRF is not the main threat (headers aren't added automatically) — XSS is.

**Open redirect fix:** after login, only navigate to *relative* in-app paths:

\`\`\`ts
const safe = redirect && redirect.startsWith("/") && !redirect.startsWith("//") ? redirect : "/";
\`\`\`

**Dependencies:** run \`npm audit\`, keep packages updated, prefer well-maintained libraries, and commit the lockfile.`,
      deep: `**XSS classes.** *Stored* (malicious review saved in the DB, served to everyone), *reflected* (payload in a URL parameter echoed back), and *DOM-based* (client code reads \`location.hash\`/search params and writes them into the DOM via an injection sink). SPAs are especially prone to DOM XSS: sinks include \`innerHTML\`, \`outerHTML\`, \`insertAdjacentHTML\`, \`document.write\`, \`eval\`, \`new Function\`, \`setTimeout(string)\`, and URL-bearing attributes. React's JSX avoids most sinks, which is why \`dangerouslySetInnerHTML\` is deliberately awkward to type.

**Output encoding is context-specific**: HTML body, attribute, URL, JavaScript and CSS contexts each need different escaping. React handles the HTML-text and attribute contexts; URL and script contexts remain your problem. Sanitisers (DOMPurify) parse HTML and strip dangerous elements/attributes — preferred over hand-written regexes, which are routinely bypassed. *Trusted Types* (a CSP feature supported in Chromium) can force all sink assignments through vetted policies.

**CSP nuances.** \`'unsafe-inline'\` largely defeats the point for scripts; nonces or hashes are the modern approach. \`frame-ancestors\` prevents clickjacking. CSP is *defence in depth* — it limits damage when other defences fail; it doesn't replace escaping.

**HTTPS precisely:** TLS provides confidentiality, integrity and server authentication *for the connection*. It doesn't protect data at rest (localStorage, logs), doesn't validate content, and doesn't stop a compromised client. Mixed content (HTTP sub-resources on an HTTPS page) is blocked or warned by browsers. HSTS tells browsers to always use HTTPS for the site. CampusEvents' \`UseHttpsRedirection()\` redirects HTTP to HTTPS when an HTTPS endpoint is configured.

**Supply chain.** Every npm dependency runs with your page's full privileges; a compromised package is an XSS by design. Lockfiles, \`npm audit\`, minimal dependencies and Subresource Integrity (for CDN scripts) reduce exposure.`,
    },
    mechanism: `\`\`\`text
 XSS (stored)                                   CSRF (cookie auth)
 ───────────                                    ──────────────────
 attacker ─POST review "<img onerror=..>"─► API  victim logged in to bank.example (cookie)
                         │ stored                victim visits evil.example
 victim ◄─GET reviews────┘                       evil page auto-submits <form action=bank.example/transfer>
   │                                             browser attaches bank cookie automatically ──► bank
   ├─ {text}  → React escapes → shows as text ✅       defences: SameSite=Lax/Strict, CSRF token,
   └─ dangerouslySetInnerHTML → script runs ❌                   check Origin header
         └─ DOMPurify.sanitize first ✅
         └─ CSP blocks inline/foreign scripts (defence in depth)

 HTTPS (TLS)
 ───────────
 browser ══════ encrypted + integrity-protected ══════► server
   ▲  protects tokens/passwords IN TRANSIT (E4 True)
   └─ does NOT protect: XSS inside the page, localStorage contents, a malicious server, bad data
\`\`\``,
    simpleExample: {
      title: "Safe by default vs the escape hatch",
      language: "tsx",
      code: `interface Review {
  id: number;
  author: string;
  comment: string; // user-generated, untrusted
}

export function ReviewItem({ review }: { review: Review }) {
  return (
    <li>
      <strong>{review.author}</strong>
      {/* ✅ React inserts this as TEXT: "<script>" shows literally, nothing executes */}
      <p>{review.comment}</p>

      {/* ❌ Never do this with untrusted input:
          <p dangerouslySetInnerHTML={{ __html: review.comment }} /> */}
    </li>
  );
}`,
      walkthrough: [
        { lines: "4", text: "Mark user-generated fields mentally as untrusted." },
        { lines: "11-12", text: "JSX text children are escaped — the default protects you." },
        { lines: "14-15", text: "dangerouslySetInnerHTML turns text into live HTML; with untrusted input it is an XSS hole." },
      ],
    },
    realExample: {
      title: "Rendering rich text and links safely + safe post-login redirect",
      language: "tsx",
      code: `import DOMPurify from "dompurify";
import { useNavigate, useSearchParams } from "react-router-dom";

export function RichDescription({ html }: { html: string }) {
  // Only if the product genuinely needs formatted HTML; otherwise render as text.
  const clean = DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });
  return <div className="description" dangerouslySetInnerHTML={{ __html: clean }} />;
}

export function safeExternalUrl(raw: string | null): string | null {
  if (!raw) return null;
  try {
    const url = new URL(raw);
    return url.protocol === "https:" || url.protocol === "http:" ? url.href : null;
  } catch {
    return null; // not an absolute URL
  }
}

export function EventLink({ href }: { href: string | null }) {
  const safe = safeExternalUrl(href);
  if (!safe) return null;
  return (
    <a href={safe} target="_blank" rel="noopener noreferrer">
      Event website
    </a>
  );
}

export function useSafeRedirectAfterLogin() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  return () => {
    const target = params.get("redirect");
    const isInternal = target !== null && target.startsWith("/") && !target.startsWith("//");
    navigate(isInternal ? target : "/", { replace: true });
  };
}`,
      walkthrough: [
        { lines: "4-8", text: "Sanitise with DOMPurify immediately before injecting; never store 'pre-sanitised' assumptions." },
        { lines: "10-18", text: "Parse URLs and allow-list protocols, blocking javascript: and data: URLs." },
        { lines: "24", text: "rel='noopener noreferrer' stops the new tab controlling window.opener and hides the referrer." },
        { lines: "30-37", text: "Prevent open redirects: only accept same-app paths ('/events'), rejecting 'https://evil...' and protocol-relative '//evil'." },
      ],
    },
    mistakes: [
      {
        mistake: "\"We use HTTPS, so XSS isn't possible.\"",
        fix: "HTTPS protects data in transit. XSS runs inside the decrypted page; you need escaping, sanitising and CSP.",
      },
      {
        mistake: "Using dangerouslySetInnerHTML to render user comments with line breaks.",
        fix: "Render as text and use CSS `white-space: pre-line`, or split on newlines into elements.",
      },
      {
        mistake: "Writing a regex to strip <script> tags as 'sanitisation'.",
        fix: "XSS doesn't need <script> (onerror, svg, javascript: URLs…). Use a maintained sanitiser like DOMPurify.",
      },
      {
        mistake: "Assuming CSRF matters equally for Bearer-header APIs.",
        fix: "CSRF exploits automatically-sent credentials (cookies). Bearer headers must be added by your code, so classic CSRF doesn't apply — but XSS does.",
      },
      {
        mistake: "Redirecting to any ?redirect= value after login.",
        fix: "Allow only internal relative paths starting with a single '/'.",
      },
    ],
    debug: {
      prompt: "The search page shows 'Results for: <term>' using the URL. A tester reports that a crafted link runs JavaScript. Fix it.",
      language: "tsx",
      buggyCode: `import { useSearchParams } from "react-router-dom";

export function SearchHeading() {
  const [params] = useSearchParams();
  const q = params.get("q") ?? "";
  return <h2 dangerouslySetInnerHTML={{ __html: "Results for: " + q }} />;
}
// Attack: /events?q=<img src=x onerror=alert(document.domain)>`,
      hint: "Is there any reason this needs HTML at all?",
      fixedCode: `import { useSearchParams } from "react-router-dom";

export function SearchHeading() {
  const [params] = useSearchParams();
  const q = params.get("q") ?? "";
  return <h2>Results for: {q}</h2>; // React escapes q as text
}`,
      explanation: "This is DOM-based (reflected) XSS: URL input flowed into an HTML sink. The heading only needs text, so plain JSX interpolation is the correct fix. Reach for DOMPurify only when HTML formatting is a genuine requirement.",
    },
    challenge: {
      prompt: "Write `toSafeHref(input)` returning a safe href or null: allow absolute http/https URLs and in-app paths beginning with a single '/'; reject javascript:, data:, protocol-relative '//' URLs and garbage.",
      starterCode: `export function toSafeHref(input: string): string | null {
  // TODO
}`,
      language: "ts",
      hints: [
        "Handle the relative case first: startsWith('/') && !startsWith('//').",
        "new URL(input) throws for relative strings — wrap it in try/catch.",
        "Compare url.protocol to 'http:' and 'https:' (note the colon).",
      ],
      solution: `export function toSafeHref(input: string): string | null {
  const value = input.trim();
  if (value.startsWith("/") && !value.startsWith("//") && !value.startsWith("/\\\\")) {
    return value; // in-app path
  }
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:" ? url.href : null;
  } catch {
    return null;
  }
}

// toSafeHref("/events/3")              → "/events/3"
// toSafeHref("https://example.com")    → "https://example.com/"
// toSafeHref("javascript:alert(1)")    → null
// toSafeHref("//evil.example")         → null`,
      explanation: "Allow-listing (only known-good schemes) is more robust than block-listing bad ones. Browsers treat '//' and '/\\' as protocol-relative/absolute in some contexts, so they're rejected.",
    },
    examQuestions: [
      {
        question: "(Mock E4) True or False: Sending authentication tokens and other sensitive information over HTTPS helps protect them while travelling between the browser and server.",
        answer: "**True.** HTTPS (TLS) encrypts and integrity-protects data in transit, preventing eavesdropping and tampering on the network. It doesn't protect against XSS or data stored on the device.",
        marks: 2,
      },
      {
        question: "Explain how React helps prevent XSS and name one way a developer can bypass that protection. (3 marks)",
        answer: "React escapes values interpolated into JSX (`{value}`), so strings containing HTML are displayed as text rather than parsed as markup. A developer bypasses this with `dangerouslySetInnerHTML` (or direct DOM `innerHTML`), or by putting unvalidated URLs into href/src. If HTML must be rendered, sanitise it with a library like DOMPurify first.",
        marks: 3,
      },
      {
        question: "What is CSRF, and why are cookie-authenticated apps more exposed than Bearer-header apps?",
        answer: "CSRF tricks the victim's browser into sending a state-changing request to a site where they are logged in. Browsers attach cookies automatically, so the forged request is authenticated. Bearer tokens in an Authorization header are only added by the app's own code, so a third-party site cannot make the browser add them. Mitigations: SameSite cookies, CSRF tokens, Origin checks.",
        marks: 3,
      },
      {
        question: "What is a Content Security Policy and what role does it play?",
        answer: "An HTTP header that tells the browser which sources of scripts, styles, images etc. are allowed (e.g. script-src 'self'). It is defence in depth: if an injection slips through, CSP can block inline or foreign scripts from running.",
        marks: 2,
      },
    ],
    revision: [
      "XSS = attacker input executed as code in your page; stored, reflected, DOM-based.",
      "React escapes `{text}` by default; dangerouslySetInnerHTML/innerHTML bypass it.",
      "Need HTML? Sanitise with DOMPurify. Need links? Allow-list http/https.",
      "CSP limits what scripts can run — defence in depth, not a replacement for escaping.",
      "CSRF abuses automatically-sent cookies → SameSite + CSRF tokens; Bearer headers aren't auto-sent.",
      "HTTPS protects data in transit (E4 True), not against XSS or at-rest storage.",
      "Prevent open redirects: only internal '/paths'. Audit and update dependencies.",
    ],
  },

  /* ================================================================== */
  /* m10-tanstack-query                                                  */
  /* ================================================================== */
  {
    id: "tq-server-state",
    moduleId: "m10-tanstack-query",
    title: "Server state vs client state — why TanStack Query exists",
    summary:
      "Server state is a cached copy of data owned by the backend; TanStack Query manages fetching, caching, deduplication and refreshing so you stop hand-rolling it in useEffect.",
    priority: "P0",
    examCritical: true,
    minutes: 25,
    objectives: [
      "Distinguish server state from client state with examples (mock B6, B14).",
      "List the problems of manual useEffect fetching: caching, deduplication, races, stale data, boilerplate.",
      "Set up QueryClient and QueryClientProvider at the app root.",
      "Explain how TanStack Query fits the Week 03 Service → Hook → Component layering.",
    ],
    prerequisites: ["react-useeffect", "react-custom-hooks", "http-fetch-response-ok"],
    sources: [
      WEEK03_SLIDE28,
      { kind: "mock", label: "MOCK ICT", detail: "B6 (TanStack Query manages async server data, caching, synchronisation), B14 (not interchangeable with Zustand), D2 (manual useEffect + AbortController)" },
      NOT_SUPPLIED_L7,
      TQ_OVERVIEW,
      {
        kind: "supplementary",
        label: "TanStack Query v5 docs — Does TanStack Query replace Redux, MobX or other global state managers?",
        url: "https://tanstack.com/query/latest/docs/framework/react/guides/does-this-replace-client-state",
      },
      TQ_DEFAULTS,
    ],
    why: `In Week 03 you wrote \`useEvents\` with \`useState\` + \`useEffect\` + \`AbortController\` (and the mock D2 asks for exactly that). It works for one component. Now imagine the events list, the navbar badge and the event details page all need event data: each one fetches separately, nothing is shared, navigating back refetches from scratch with a spinner, a booking made on one page leaves another page stale, and fast navigation can show the wrong event (race conditions). TanStack Query solves this class of problems once, so the Week03 slide 28 promise holds: "Swap fetch for TanStack Query → only the hook changes."`,
    analogy: `**Client state** is what's in your own notebook — the theme you picked, whether the menu is open. Only you write it; it is always "true".

**Server state** is a **photocopy of a library book**. The library (database) owns the original; other people may change it at any moment. Your copy might already be out of date. You need rules: how long do I trust my copy? When do I go back for a fresh one? If three friends need the same page, do we make three trips?

TanStack Query is the **librarian's photocopy desk**: it keeps one copy per book (query key), hands it to everyone who asks, notes when it was made, and fetches a fresh copy when it's considered old.`,
    explain: {
      beginner: `**Client state** lives only in the browser and your app is its owner: a dark-mode toggle, which tab is selected, form input before submit, whether a modal is open.

**Server state** is data whose **source of truth is the server**: the events list, a user's bookings, reviews. Your app only holds a *snapshot*. Server state is:

- **asynchronous** — you must wait for it, and it can fail;
- **shared** — other users and other tabs can change it;
- **possibly stale** — your snapshot can be out of date without you knowing.

Handling server state by hand in every component means writing \`loading\`, \`error\` and \`data\` state, an effect, cleanup, retry, and some way to refresh after changes — over and over.

**TanStack Query** (formerly React Query) is a library built specifically for server state. You tell it **what** data you want (a *query key* such as \`['events']\`) and **how** to fetch it (a *query function*), and it handles **caching**, **deduplicating** identical requests, **background refetching**, **retries**, and exposing \`isPending\`/\`isError\`/\`data\` to your component.

It does **not** replace client-state tools like Zustand. They solve different problems and are often used together (mock B14 is **False**).

To use it you create one **QueryClient** (the cache) and provide it to the whole app with **QueryClientProvider**.`,
      developer: `**Manual fetching problems** (from a typical \`useEffect\` hook):

1. **No cache** — every mount refetches; going back shows a spinner again.
2. **No dedup** — three components mounting together send three identical requests.
3. **Races** — changing \`id\` quickly can let an older response overwrite a newer one unless you abort/ignore (D2's AbortController).
4. **Staleness** — after a mutation, nothing tells other components to refetch.
5. **Boilerplate** — loading/error/data/retry/cleanup in every hook; StrictMode double-invokes effects in development, exposing missing cleanup.

**Setup (v5):**

\`\`\`tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient(); // create ONCE, outside components
createRoot(el).render(
  <QueryClientProvider client={queryClient}><App /></QueryClientProvider>
);
\`\`\`

**Layering (Week 03 slide 28):** keep \`eventService.ts\` (URLs, fetch, \`response.ok\`) unchanged; rewrite \`useEvents.ts\` to call \`useQuery({ queryKey: ['events'], queryFn: ({ signal }) => getEvents(signal) })\`; \`Events.tsx\` keeps rendering. The \`signal\` TanStack passes lets your service abort requests that are no longer needed.

Optional: \`@tanstack/react-query-devtools\` shows every cache entry, its key, status and freshness.`,
      deep: `**Why the QueryClient must be stable.** The client *is* the cache. Creating it inside a component body (\`const qc = new QueryClient()\` on every render) gives each render an empty cache. Create it at module scope, or with \`useState(() => new QueryClient())\` when you need one per request (SSR) or per test.

**Ownership model.** TanStack Query treats data as owned by the server and the cache as a *synchronisation layer*. Every query entry tracks \`dataUpdatedAt\`, observer count, fetch status and error state. Components subscribe as **observers**; when the last observer unmounts the entry becomes *inactive* and is garbage-collected after \`gcTime\`.

**Structural sharing.** When refetched data is deep-equal in parts to the previous data, TanStack Query reuses the old object references for unchanged parts. This keeps \`data\` referentially stable, so memoised children and effects depending on \`data\` don't re-run needlessly.

**Tracked properties.** \`useQuery\` returns a proxied result that tracks which fields you read; a component reading only \`data\` doesn't re-render when \`isFetching\` flips.

**What it doesn't do.** It is not a data-fetching library — you still write the \`queryFn\` (fetch/axios). It doesn't validate data (do that in the service), it doesn't manage UI state, and it isn't a database: a cache is always potentially stale, which is why freshness (\`staleTime\`) and invalidation are central concepts in the next lessons.

**Version note.** v5 merged the overloads into a single object signature, renamed \`cacheTime\` → \`gcTime\`, and renamed the initial-loading status from \`loading\` to \`pending\` (\`isPending\`).`,
    },
    mechanism: `\`\`\`text
  Manual (Week 03 style)                       TanStack Query
  ──────────────────────                       ──────────────
  <EventList>  useEffect → fetch /events       <EventList> ─┐
  <Navbar>     useEffect → fetch /events        <Navbar>   ─┼─ observers of key ['events']
  <Sidebar>    useEffect → fetch /events        <Sidebar>  ─┘          │
     3 requests, 3 copies, 3 spinners                                 ▼
                                               QueryClient (cache) ── ['events'] → { data, status,
                                                    │                    dataUpdatedAt, observers: 3 }
                                                    │ one in-flight request (deduplicated)
                                                    ▼
                                               queryFn → eventService.getEvents(signal) → API

  <App> wrapped once in:  <QueryClientProvider client={queryClient}>
\`\`\`

- Identical keys share one cache entry and one request.
- The service layer is unchanged; only the hook layer swaps implementation.`,
    simpleExample: {
      title: "main.tsx — providing the QueryClient",
      language: "tsx",
      code: `import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";

// One client = one cache for the whole app. Created once, outside components.
const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
);`,
      walkthrough: [
        { lines: "3", text: "Both exports come from @tanstack/react-query (v5)." },
        { lines: "7", text: "Module scope keeps the same cache for the lifetime of the page." },
        { lines: "11-13", text: "Every component inside can call useQuery / useMutation / useQueryClient." },
      ],
    },
    realExample: {
      title: "Week 03's useEvents rewritten — only the hook changes",
      language: "ts",
      code: `// services/eventService.ts — unchanged responsibility: URLs, fetch, response.ok
import type { EventDto } from "../types/Event";
const API = import.meta.env.VITE_API_URL ?? "http://localhost:5229/api";

export async function getEvents(signal?: AbortSignal): Promise<EventDto[]> {
  const res = await fetch(\`\${API}/events\`, { signal });
  if (!res.ok) throw new Error(\`Failed to load events (\${res.status})\`);
  return (await res.json()) as EventDto[];
}

// hooks/useEvents.ts — BEFORE (manual):
//   const [events, setEvents] = useState<EventDto[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   useEffect(() => { const c = new AbortController(); ... return () => c.abort(); }, []);

// hooks/useEvents.ts — AFTER (TanStack Query v5):
import { useQuery } from "@tanstack/react-query";

export function useEvents() {
  return useQuery({
    queryKey: ["events"],
    queryFn: ({ signal }) => getEvents(signal), // aborts if no longer needed
  });
}

// pages/Events.tsx — rendering logic barely changes
// const { data: events = [], isPending, isError, error } = useEvents();`,
      walkthrough: [
        { lines: "5-9", text: "The service throws on !res.ok — TanStack Query treats a thrown error (rejected promise) as the error state." },
        { lines: "11-15", text: "The manual version needed three state variables, an effect and cleanup." },
        { lines: "20-25", text: "The query version: a key (cache identity) and a function. Loading, error, caching, dedup and retries come for free." },
        { lines: "23", text: "The queryFn receives an AbortSignal; passing it to fetch cancels obsolete requests." },
      ],
    },
    mistakes: [
      {
        mistake: "Creating `new QueryClient()` inside the App component.",
        fix: "Create it once at module scope (or useState(() => new QueryClient())) — otherwise the cache resets on every render.",
      },
      {
        mistake: "Copying query data into useState / a Zustand store 'to share it'.",
        fix: "The query cache already shares it: call the same hook (same key) wherever needed. Copies go stale.",
      },
      {
        mistake: "Thinking TanStack Query performs the HTTP request itself.",
        fix: "It calls your queryFn. You still write fetch, check response.ok, and throw on errors.",
      },
      {
        mistake: "A queryFn that returns the error object instead of throwing on !res.ok.",
        fix: "Throw (or return a rejected promise) — otherwise the query reports success with error data.",
      },
      {
        mistake: "Using TanStack Query for UI state like 'isSidebarOpen'.",
        fix: "That's client state — useState or Zustand. TanStack Query is for async server data.",
      },
    ],
    debug: {
      prompt: "The events list flashes a spinner and refetches every time ANY state in App changes, and the DevTools show an empty cache each time. Why?",
      language: "tsx",
      buggyCode: `export default function App() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>Toggle</button>
      <EventList />
    </QueryClientProvider>
  );
}`,
      hint: "What happens to `queryClient` on every render of App?",
      fixedCode: `const queryClient = new QueryClient(); // module scope: created once

export default function App() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  return (
    <QueryClientProvider client={queryClient}>
      <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>Toggle</button>
      <EventList />
    </QueryClientProvider>
  );
}`,
      explanation: "Each render created a brand-new QueryClient with an empty cache, so every theme toggle discarded all cached data and every query started again from 'pending'. Move it to module scope (or useState(() => new QueryClient())).",
    },
    challenge: {
      prompt: "Classify each as server state (S) or client state (C) and name the tool you'd use: (1) list of events, (2) dark/light theme, (3) a user's bookings, (4) whether the mobile menu is open, (5) items in a cart before checkout, (6) categories for a dropdown, (7) the current search text in an input.",
      language: "text",
      hints: [
        "Ask: who owns the source of truth — the backend or the browser?",
        "Cart before checkout is usually client state (unless the backend stores carts).",
      ],
      solution: `1. S — TanStack Query (useQuery ['events'])
2. C — Zustand (shared across components, maybe persisted)
3. S — TanStack Query (['bookings','mine'])
4. C — local useState in the layout (only one component needs it)
5. C — Zustand (shared across pages, maybe persisted); becomes server state once submitted
6. S — TanStack Query (['categories'], long staleTime: rarely changes)
7. C — local useState (or URL search params if it should be shareable)`,
      explanation: "The deciding question is ownership. Server-owned data needs caching and synchronisation (TanStack Query); browser-owned data needs a simple, synchronous store (useState/Zustand/URL).",
    },
    examQuestions: [
      {
        question: "(Mock B6) True or False: TanStack Query is designed to help manage asynchronous server data, including caching and synchronisation.",
        answer: "**True.**",
        marks: 1,
      },
      {
        question: "(Mock B14) True or False: TanStack Query and Zustand are interchangeable tools designed exclusively for storing server responses.",
        answer: "**False.** TanStack Query manages server state (fetching, caching, refetching); Zustand manages client/UI state (theme, cart, preferences). They're complementary.",
        marks: 1,
      },
      {
        question: "Give three problems with fetching data using useEffect in every component that TanStack Query addresses. (3 marks)",
        answer: "Any three: no caching (data refetched on every mount, spinners on back navigation); duplicate requests when several components need the same data (no deduplication); race conditions when parameters change quickly; stale data after mutations with no invalidation mechanism; repeated loading/error/retry boilerplate.",
        marks: 3,
      },
      {
        question: "What are QueryClient and QueryClientProvider for?",
        answer: "QueryClient holds the query/mutation cache and default options. QueryClientProvider makes that client available via React context so useQuery/useMutation/useQueryClient work in any descendant component.",
        marks: 2,
      },
    ],
    revision: [
      "Server state: owned by the backend, async, shared, can go stale. Client state: owned by the browser.",
      "Manual useEffect fetching lacks caching, dedup, race protection, invalidation; adds boilerplate.",
      "new QueryClient() once; wrap the app in <QueryClientProvider client={queryClient}>.",
      "TanStack Query calls YOUR queryFn — throw on !res.ok.",
      "Service → Hook → Component: only the hook changes when adopting TanStack Query (Week03 slide 28).",
      "TanStack Query + Zustand are complementary, not interchangeable (B14 False).",
    ],
  },
  {
    id: "tq-usequery-keys",
    moduleId: "m10-tanstack-query",
    title: "useQuery and query keys",
    summary:
      "useQuery({ queryKey, queryFn }) — the key is the cache identity; status tells you about data, fetchStatus tells you about the network.",
    priority: "P0",
    examCritical: true,
    minutes: 30,
    objectives: [
      "Write useQuery calls with correct v5 syntax and typed results.",
      "Design query keys as cache identity, including parameters (['events', id]).",
      "Distinguish status (pending/error/success) from fetchStatus (fetching/paused/idle), and isPending from isFetching and isLoading.",
      "Use enabled for dependent queries, run parallel queries, and know the retry/refetchOnWindowFocus defaults.",
    ],
    prerequisites: ["tq-server-state", "react-custom-hooks"],
    sources: [
      WEEK03_SLIDE28,
      { kind: "mock", label: "MOCK ICT", detail: "D4b (what query caching means), B6" },
      NOT_SUPPLIED_L7,
      {
        kind: "supplementary",
        label: "TanStack Query v5 docs — Queries",
        url: "https://tanstack.com/query/latest/docs/framework/react/guides/queries",
      },
      {
        kind: "supplementary",
        label: "TanStack Query v5 docs — Query Keys",
        url: "https://tanstack.com/query/latest/docs/framework/react/guides/query-keys",
      },
      {
        kind: "supplementary",
        label: "TanStack Query v5 docs — Dependent Queries",
        url: "https://tanstack.com/query/latest/docs/framework/react/guides/dependent-queries",
      },
      TQ_DEFAULTS,
    ],
    why: `Almost every bug with TanStack Query comes from the **query key**: two different pieces of data sharing a key (one overwrites the other), or a key missing a variable (changing the event id doesn't refetch). The second most common confusion is between "first load" and "background refresh" — showing a full-page spinner every time the window regains focus. Mastering keys and status flags makes the library predictable.`,
    analogy: `The query key is the **label on a storage box** in a warehouse. \`['events']\` is the box for "all events"; \`['events', 7]\` is the box for "event 7". Anyone asking for the same label gets the same box. If you forget to write the number on the label, every event goes into one box and you'll pull out the wrong one.

\`status\` describes **what's in the box** (nothing yet / an error note / data). \`fetchStatus\` describes **whether a courier is on the way** right now. A box can have data *and* a courier en route with a fresher copy.`,
    explain: {
      beginner: `\`\`\`ts
const { data, isPending, isError, error } = useQuery({
  queryKey: ["events"],
  queryFn: getEvents,
});
\`\`\`

- **queryKey** — an array that uniquely names this data in the cache. Include *everything the data depends on*: \`["events", eventId]\`, \`["events", { search, page }]\`.
- **queryFn** — a function returning a promise. Resolve with data, or throw/reject on error.

The result tells you what to render:

- \`isPending\` — no data yet (first load). Show a spinner/skeleton.
- \`isError\` / \`error\` — the query failed (after retries). Show a message.
- \`data\` — the result when successful.
- \`isFetching\` — a request is in flight *right now*, including background refreshes when data is already shown. Use it for a small "refreshing…" indicator, not a full-page spinner.

Two components using the same key share the same cached data and the same request.

**Defaults to know:** failed queries **retry 3 times** with increasing delays before showing an error; queries **refetch when the window regains focus** (and on reconnect, and when a new component mounts) if the data is stale.

**Dependent query:** if you need data A before fetching B, use \`enabled\`:

\`\`\`ts
useQuery({ queryKey: ["events", id], queryFn: () => getEvent(id!), enabled: id !== undefined });
\`\`\``,
      developer: `**Typing:** the type of \`data\` is inferred from \`queryFn\`'s return type (\`Promise<EventDto[]>\` → \`EventDto[] | undefined\`). After narrowing with \`if (isPending) return …; if (isError) return …;\` TypeScript knows \`data\` is defined — v5's result is a discriminated union on \`status\`.

**Two status axes (v5):**

| \`status\` | meaning | | \`fetchStatus\` | meaning |
|---|---|---|---|---|
| \`pending\` | no data yet | | \`fetching\` | queryFn running |
| \`error\` | last attempt failed | | \`paused\` | wanted to fetch but offline |
| \`success\` | have data | | \`idle\` | not fetching |

\`isLoading\` = \`isPending && isFetching\` (first load actually in progress). A disabled query (\`enabled: false\`) with no data is \`isPending\` but **not** \`isLoading\` — so use \`isLoading\` if you'd otherwise show a spinner forever for a disabled query.

**Keys from params:** \`useParams()\` gives strings — convert: \`const id = Number(eventId)\`; key \`["events", id]\`; \`enabled: Number.isInteger(id)\`. Keys are hashed deterministically: object key order doesn't matter, array order does.

**Parallel queries:** just call \`useQuery\` several times — they run concurrently. For a dynamic number use \`useQueries({ queries: ids.map(id => ({ queryKey: ["events", id], queryFn: … })) })\`.

**Options worth knowing:** \`select\` (transform/derive from cached data, e.g. count), \`retry\` (number | boolean | function), \`refetchOnWindowFocus\`, \`staleTime\` (next lesson).`,
      deep: `**Hierarchical keys enable targeted invalidation.** \`invalidateQueries({ queryKey: ["events"] })\` matches \`["events"]\`, \`["events", 7]\` and \`["events", { page: 2 }]\` by prefix. Design keys general → specific so a single prefix refreshes a family. Many teams centralise them in a **query key factory**:

\`\`\`ts
export const eventKeys = {
  all: ["events"] as const,
  list: (filters: { search: string; page: number }) => [...eventKeys.all, "list", filters] as const,
  detail: (id: number) => [...eventKeys.all, "detail", id] as const,
};
\`\`\`

**Retry semantics.** Default \`retry: 3\` with exponential backoff (\`retryDelay\` ~1s, 2s, 4s… capped at 30s). The error state appears only after all retries — so a 404 or 401 can take several seconds to surface. Use a function: \`retry: (failureCount, err) => !(err instanceof HttpError && err.status < 500) && failureCount < 3\`.

**Focus refetching** uses the \`visibilitychange\` event; combined with \`staleTime: 0\` it can look like "random" requests in the Network tab. That's by design: stale data + trigger = background refetch. Tune \`staleTime\` rather than disabling everything.

**Cancellation.** If all observers unmount or the key changes while fetching, TanStack Query aborts the \`signal\` it passed to the queryFn (if you consumed it). This is the library's answer to the race conditions you handled manually with AbortController in Week 03.

**Errors in render.** \`throwOnError: true\` re-throws to the nearest error boundary — useful with Suspense-style architectures (\`useSuspenseQuery\`, where \`data\` is always defined).`,
    },
    mechanism: `\`\`\`text
 useQuery({ queryKey: ['events', 7], queryFn })
        │ hash(['events',7]) = '["events",7]'
        ▼
 QueryCache ─┬─ '["events"]'    → { status: success, data: [...], fetchStatus: idle }
             ├─ '["events",7]'  → { status: pending, fetchStatus: fetching }  ◄── this observer
             └─ '["categories"]'→ { status: success, ... }

 Timeline for ['events',7]:
   mount ──► status=pending  fetchStatus=fetching   isPending ✓ isLoading ✓ isFetching ✓
   200   ──► status=success  fetchStatus=idle       data ✓
   focus ──► status=success  fetchStatus=fetching   data ✓ (shown)  isFetching ✓  isPending ✗
   500×4 ──► status=error (after 3 retries)         error ✓ (previous data still available)

 enabled:false ─► status=pending fetchStatus=idle   isPending ✓ isLoading ✗
\`\`\``,
    simpleExample: {
      title: "Events list with correct loading / error / refreshing states",
      language: "tsx",
      code: `import { useQuery } from "@tanstack/react-query";
import { getEvents } from "../services/eventService";

export function EventList() {
  const { data, isPending, isError, error, isFetching } = useQuery({
    queryKey: ["events"],
    queryFn: ({ signal }) => getEvents(signal),
  });

  if (isPending) return <p>Loading events…</p>;
  if (isError) return <p role="alert">Could not load events: {error.message}</p>;

  return (
    <section>
      {isFetching && <small>Refreshing…</small>}
      <ul>
        {data.map((e) => (
          <li key={e.id}>{e.title}</li>
        ))}
      </ul>
    </section>
  );
}`,
      walkthrough: [
        { lines: "5-8", text: "Key ['events'] identifies the cached list; queryFn forwards the AbortSignal." },
        { lines: "10", text: "First load only: no data yet." },
        { lines: "11", text: "error is typed Error by default in v5." },
        { lines: "15", text: "Background refetch indicator — data is still shown." },
        { lines: "17", text: "After the two early returns, TypeScript knows data is defined." },
      ],
    },
    realExample: {
      title: "EventDetails: params → key, dependent reviews query, parallel categories",
      language: "tsx",
      code: `import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getEvent, getReviewsForEvent, getCategories } from "../services/eventService";

export const eventKeys = {
  all: ["events"] as const,
  detail: (id: number) => ["events", id] as const,
  reviews: (id: number) => ["reviews", "event", id] as const,
};

export function EventDetails() {
  const { eventId } = useParams(); // string | undefined
  const id = Number(eventId);
  const validId = Number.isInteger(id) && id > 0;

  const eventQuery = useQuery({
    queryKey: eventKeys.detail(id),
    queryFn: ({ signal }) => getEvent(id, signal),
    enabled: validId,
  });

  // Dependent: only fetch reviews once the event exists
  const reviewsQuery = useQuery({
    queryKey: eventKeys.reviews(id),
    queryFn: ({ signal }) => getReviewsForEvent(id, signal),
    enabled: eventQuery.isSuccess,
  });

  // Parallel and independent: runs at the same time as the event query
  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: ({ signal }) => getCategories(signal),
    staleTime: 10 * 60 * 1000, // categories rarely change
  });

  if (!validId) return <p>Invalid event id.</p>;
  if (eventQuery.isPending) return <p>Loading event…</p>;
  if (eventQuery.isError) return <p role="alert">{eventQuery.error.message}</p>;

  const event = eventQuery.data;
  return (
    <article>
      <h1>{event.title}</h1>
      <p>Category: {event.categoryName} ({categoriesQuery.data?.length ?? "…"} categories)</p>
      <h2>Reviews</h2>
      {reviewsQuery.isPending ? <p>Loading reviews…</p> : <p>{reviewsQuery.data?.length ?? 0} reviews</p>}
    </article>
  );
}`,
      walkthrough: [
        { lines: "5-9", text: "A small key factory keeps keys consistent between queries and invalidations." },
        { lines: "12-14", text: "Route params are strings; convert and validate before using them in keys or URLs." },
        { lines: "16-20", text: "Key includes id → navigating to another event uses a different cache entry. enabled prevents fetching /events/NaN." },
        { lines: "23-27", text: "Dependent query: enabled waits for the event to load successfully." },
        { lines: "30-34", text: "An independent query runs in parallel; long staleTime avoids needless refetches." },
        { lines: "36-38", text: "Handle invalid id, first load and error before rendering data." },
      ],
    },
    mistakes: [
      {
        mistake: "`useQuery({ queryKey: ['event'], queryFn: () => getEvent(id) })` — id missing from the key.",
        fix: "Every variable the queryFn uses belongs in the key: ['events', id]. Otherwise different events share one cache entry.",
      },
      {
        mistake: "Showing a full-page spinner whenever isFetching is true.",
        fix: "Use isPending (or isLoading) for first load; isFetching for a subtle background indicator.",
      },
      {
        mistake: "v4 syntax: `useQuery(['events'], getEvents)` or `isLoading` for everything / `status === 'loading'`.",
        fix: "v5 takes a single object; the initial status is 'pending' (isPending).",
      },
      {
        mistake: "Using the same key for different data shapes (e.g. ['events'] for the list AND for a count).",
        fix: "Different data → different keys, or derive with `select` from one query.",
      },
      {
        mistake: "Fetching /events/undefined because the param isn't ready.",
        fix: "Guard with `enabled: Boolean(id)` / a validity check.",
      },
    ],
    debug: {
      prompt: "Clicking from event 1 to event 2 keeps showing event 1's details. Also the page shows 'Loading…' forever when the URL is /events/abc. Fix it.",
      language: "tsx",
      buggyCode: `function EventDetails() {
  const { eventId } = useParams();
  const { data, isLoading, isPending } = useQuery({
    queryKey: ["event"],
    queryFn: () => getEvent(Number(eventId)),
    enabled: !!eventId,
  });
  if (isPending) return <p>Loading…</p>;
  return <h1>{data?.title}</h1>;
}`,
      hint: "What is the cache identity of event 1 vs event 2? What is isPending for a query whose fetch fails validation or is disabled?",
      fixedCode: `function EventDetails() {
  const { eventId } = useParams();
  const id = Number(eventId);
  const validId = Number.isInteger(id) && id > 0;
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["events", id],
    queryFn: ({ signal }) => getEvent(id, signal),
    enabled: validId,
  });
  if (!validId) return <p>Invalid event id.</p>;
  if (isPending) return <p>Loading…</p>;
  if (isError) return <p role="alert">{error.message}</p>;
  return <h1>{data.title}</h1>;
}`,
      explanation: "The key ['event'] ignored the id, so both events shared one cache entry (showing cached event 1). The id must be in the key. For 'abc', Number('abc') is NaN; the request fails (or is disabled) and the error was never rendered. Validate the param, disable invalid queries, and render the error state.",
    },
    challenge: {
      prompt: "Write a `useEventSearch(search, page)` hook that fetches `/api/events?search=…&page=…` with a key that changes when either input changes, doesn't fetch when search is shorter than 2 characters, and does not retry on 4xx errors.",
      starterCode: `import { useQuery } from "@tanstack/react-query";

class HttpError extends Error {
  status: number;
  constructor(status: number) { super(\`HTTP \${status}\`); this.status = status; }
}

export function useEventSearch(search: string, page: number) {
  // TODO
}`,
      language: "ts",
      hints: [
        "Use an object inside the key: ['events', 'search', { search, page }].",
        "URLSearchParams builds the query string safely.",
        "retry can be a function (failureCount, error) => boolean.",
      ],
      solution: `import { useQuery } from "@tanstack/react-query";

class HttpError extends Error {
  status: number;
  constructor(status: number) { super(\`HTTP \${status}\`); this.status = status; }
}

const API = import.meta.env.VITE_API_URL ?? "http://localhost:5229/api";

interface EventSummary { id: number; title: string }

async function searchEvents(search: string, page: number, signal: AbortSignal): Promise<EventSummary[]> {
  const qs = new URLSearchParams({ search, page: String(page) });
  const res = await fetch(\`\${API}/events?\${qs}\`, { signal });
  if (!res.ok) throw new HttpError(res.status);
  return (await res.json()) as EventSummary[];
}

export function useEventSearch(search: string, page: number) {
  const term = search.trim();
  return useQuery({
    queryKey: ["events", "search", { search: term, page }],
    queryFn: ({ signal }) => searchEvents(term, page, signal),
    enabled: term.length >= 2,
    retry: (failureCount, error) =>
      !(error instanceof HttpError && error.status >= 400 && error.status < 500) && failureCount < 3,
  });
}`,
      explanation: "Both inputs are in the key, so each search/page combination is its own cache entry (going back to page 1 is instant). enabled prevents pointless requests; the retry function stops wasting time on client errors that won't fix themselves while still retrying network/5xx failures. (CampusEvents' supplied API may not implement search/page parameters — the pattern is what matters.)",
    },
    examQuestions: [
      {
        question: "What is the purpose of the queryKey in useQuery? Give an example for a single product with id 42.",
        answer: "The key uniquely identifies the cached data: queries with the same key share one cache entry and request; a different key creates a separate entry. It must include all variables the queryFn depends on, e.g. `['products', 42]`.",
        marks: 2,
      },
      {
        question: "Explain the difference between isPending and isFetching.",
        answer: "isPending is true when the query has **no data yet** (status 'pending'). isFetching is true whenever the queryFn is **currently running**, including background refetches while existing data is displayed. A cached query refetching on window focus has isPending false and isFetching true.",
        marks: 2,
      },
      {
        question: "(Mock D4b) Describe what query caching means in TanStack Query and how it benefits the application. (2 marks)",
        answer: "Results are stored in the QueryClient cache under their query key. Any component requesting the same key receives the cached data immediately instead of making a new request, and identical concurrent requests are deduplicated. Benefits: fewer API calls, instant display when navigating back, consistent data across components, with background refetching keeping it up to date.",
        marks: 2,
      },
      {
        question: "Write a useQuery call that fetches a customer by id only when id is defined.",
        answer: "`useQuery({ queryKey: ['customers', id], queryFn: () => getCustomer(id!), enabled: id !== undefined })`",
        marks: 2,
      },
    ],
    revision: [
      "v5: useQuery({ queryKey, queryFn }) — one object argument.",
      "Key = cache identity; include every variable: ['events', id].",
      "Keys are hierarchical — enables prefix invalidation.",
      "status: pending | error | success; fetchStatus: fetching | paused | idle.",
      "isPending = no data yet; isFetching = request in flight; isLoading = isPending && isFetching.",
      "enabled for dependent/conditional queries; multiple useQuery calls run in parallel.",
      "Defaults: retry 3 with backoff; refetchOnWindowFocus true (when stale).",
    ],
    visualizers: ["query-cache"],
  },
  {
    id: "tq-stale-gc",
    moduleId: "m10-tanstack-query",
    title: "staleTime vs gcTime — freshness and garbage collection",
    summary:
      "staleTime decides how long cached data counts as fresh (no automatic refetch); gcTime decides how long UNUSED cache entries are kept before being deleted.",
    priority: "P0",
    examCritical: true,
    minutes: 25,
    objectives: [
      "Define staleTime precisely (mock A11) and state its default (0).",
      "Define gcTime (v5; was cacheTime in v4) and its default (5 minutes), and when its timer starts.",
      "Draw the fresh → stale → inactive → garbage-collected timeline for a query.",
      "List the refetch triggers and explain why stale data is still displayed while refetching.",
    ],
    prerequisites: ["tq-usequery-keys"],
    sources: [
      { kind: "mock", label: "MOCK ICT", detail: "A11 (staleTime), D4 (avoid unnecessary API requests)" },
      NOT_SUPPLIED_L7,
      TQ_DEFAULTS,
      {
        kind: "supplementary",
        label: "TanStack Query v5 docs — Caching Examples",
        url: "https://tanstack.com/query/latest/docs/framework/react/guides/caching",
      },
      {
        kind: "supplementary",
        label: "TanStack Query v5 docs — Migrating to v5 (cacheTime → gcTime)",
        url: "https://tanstack.com/query/latest/docs/framework/react/guides/migrating-to-v5",
      },
    ],
    why: `Mock D4 says the shop app "should avoid unnecessary API requests". With default settings TanStack Query considers data stale **immediately**, so it refetches on every mount, focus and reconnect. That's safe but chatty. The two timing options are how you tune it — and they are the most commonly confused pair in the exam (A11 asks what staleTime controls; option A: how long cached data is considered fresh).`,
    analogy: `Milk in a fridge.

- **staleTime** is the **"best before" date**. Before it, you pour the milk without thinking. After it, you still pour it (stale data is shown) but you also send someone to the shop for a fresh bottle at the next opportunity (refetch trigger).
- **gcTime** is how long a bottle can sit in the fridge **after everybody has stopped using it** before you throw it out to free space. While somebody is still using it, it never gets thrown out, whatever the date.`,
    explain: {
      beginner: `Every cached query is either **fresh** or **stale**.

- **Fresh**: TanStack Query trusts it and will **not** refetch automatically.
- **Stale**: still shown on screen, but TanStack Query will refetch it in the background when a *trigger* happens.

**staleTime** = how long data stays fresh after it was fetched. **Default: 0**, meaning data is stale immediately.

**Refetch triggers** (only act on **stale** data): a new component mounts using that key, the browser window regains focus, the network reconnects, or a \`refetchInterval\` you set fires. Calling \`refetch()\` or invalidating a query refetches regardless.

**gcTime** (garbage-collection time) is about **memory**, not freshness. When no mounted component uses a query any more, it becomes **inactive**. After **gcTime** (default **5 minutes**) of being inactive, it is deleted from the cache. If you return within that time, the old data shows instantly (and refetches if stale). In TanStack Query v4 this option was called \`cacheTime\`; v5 renamed it to \`gcTime\` because the old name misled people.

Example: \`staleTime: 60_000\` on the events list → navigate away and back within a minute → no request at all. After 2 minutes → the cached list shows instantly *and* a background refetch updates it. After 6 minutes away → entry was garbage-collected → a normal first load with a spinner.`,
      developer: `**Set per query or as defaults:**

\`\`\`ts
const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000 } },
});
useQuery({ queryKey: ["categories"], queryFn: getCategories, staleTime: 10 * 60_000 });
useQuery({ queryKey: ["events", id], queryFn: () => getEvent(id), staleTime: 0 });
\`\`\`

**Choosing staleTime** by how often the data changes and how bad staleness is:

- categories / config: minutes to \`Infinity\` (refresh only via invalidation)
- events list: 30–60 s
- available tickets on a checkout page: 0 (always revalidate)

**Relationship rules:** staleTime and gcTime are independent clocks. staleTime starts at \`dataUpdatedAt\` (each successful fetch); gcTime starts when the **last observer unmounts**. A staleTime longer than gcTime is legal but means inactive entries may be deleted while still "fresh".

**Seeing it:** React Query Devtools colours entries *fresh*, *stale*, *fetching*, *inactive*. \`query.isStale()\`, and the result's \`isStale\` flag, expose the state.

**Disabling triggers:** \`refetchOnWindowFocus: false\` is a blunt tool; raising \`staleTime\` is usually better because it reduces *all* unnecessary refetches while keeping invalidation working.

**\`staleTime: Infinity\`** = never stale by time; data refreshes only when you invalidate it or call refetch. \`gcTime: Infinity\` = never garbage-collect.`,
      deep: `**Stale-while-revalidate.** The model mirrors HTTP's SWR: serve the cached value immediately for perceived speed, revalidate in the background, then swap in the new data. Structural sharing ensures unchanged parts keep their references, so the swap re-renders only what changed.

**Mount triggers and observers.** \`refetchOnMount\` (default \`true\`) means a newly mounting observer refetches if stale; \`'always'\` refetches even when fresh; \`false\` never. Because multiple observers share one entry, the effective staleTime for a mount is the one passed by the *mounting* observer — keep options for one key consistent (another reason for custom hooks).

**Garbage collection timing.** Inactive entries schedule removal with a timer; \`queryClient.removeQueries\` deletes immediately; \`queryClient.clear()\` empties everything (do this on logout). In SSR environments the default gcTime is effectively Infinity on the server to avoid timers.

**Interaction with \`placeholderData\` and \`initialData\`.** \`initialData\` is treated as real cache data (subject to staleTime; you can set \`initialDataUpdatedAt\`), whereas \`placeholderData\` is never cached and is always "pending" underneath.

**Errors with stale data.** If a background refetch fails, \`status\` becomes \`'error'\` but \`data\` still holds the last successful value; good UIs keep showing it with a warning instead of replacing the page with an error.

**Exam phrasing.** Avoid "staleTime is how long data stays in the cache" — that's closer to gcTime. Fresh/stale is about *whether to refetch*; gcTime is about *whether to keep inactive data at all*.`,
    },
    mechanism: `\`\`\`text
 staleTime = 60s, gcTime = 5min (default)

 t=0s     fetch ok ─────► FRESH ───────────────┐ (mount/focus: NO refetch)
 t=60s                    STALE ◄──────────────┘ (still displayed)
 t=90s    window focus ──► background refetch ──► FRESH again (t=90..150s)
 t=200s   last component unmounts ──► INACTIVE   (gcTime timer starts: 5 min)
 t=300s   remount within gcTime ──► cached data shown instantly
                                  + refetch (because stale) ──► FRESH
 ...      unmount again, no remount ...
 t=+5min  ─────────────────────────────────────► GARBAGE-COLLECTED (entry removed)
 next mount ──► status=pending, spinner, normal first load

 Refetch triggers (act only when STALE): mount · window focus · reconnect · refetchInterval
 Always refetch (ignore staleTime): invalidateQueries (active) · refetch()
\`\`\``,
    simpleExample: {
      title: "Different freshness for different data",
      language: "ts",
      code: `import { QueryClient, useQuery } from "@tanstack/react-query";
import { getCategories, getEvents } from "../services/eventService";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000, // app-wide: data is fresh for 30 s
      gcTime: 5 * 60_000, // the v5 default, shown explicitly (v4 name: cacheTime)
    },
  },
});

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: ({ signal }) => getCategories(signal),
    staleTime: Infinity, // only refreshed when we invalidate it
  });
}

export function useEvents() {
  return useQuery({
    queryKey: ["events"],
    queryFn: ({ signal }) => getEvents(signal),
    staleTime: 60_000, // overrides the default for this query
  });
}`,
      walkthrough: [
        { lines: "4-11", text: "Defaults apply to every query unless overridden." },
        { lines: "8", text: "gcTime only matters once nothing is using the query." },
        { lines: "17", text: "Categories almost never change: never stale by time." },
        { lines: "24", text: "Events: navigating back within a minute costs zero requests." },
      ],
    },
    realExample: {
      title: "Showing stale data honestly while refreshing",
      language: "tsx",
      code: `import { useQuery } from "@tanstack/react-query";
import { getEvents } from "../services/eventService";

export function EventsPage() {
  const { data, isPending, isError, error, isFetching, isStale, dataUpdatedAt, refetch } = useQuery({
    queryKey: ["events"],
    queryFn: ({ signal }) => getEvents(signal),
    staleTime: 60_000,
  });

  if (isPending) return <p>Loading events…</p>;

  return (
    <section>
      <header>
        <small>
          Updated {new Date(dataUpdatedAt).toLocaleTimeString()}
          {isStale && " · may be out of date"}
          {isFetching && " · refreshing…"}
        </small>
        <button onClick={() => refetch()} disabled={isFetching}>Refresh</button>
      </header>
      {isError && (
        <p role="alert">Couldn't refresh ({error.message}). Showing the last loaded data.</p>
      )}
      <ul>
        {data?.map((e) => <li key={e.id}>{e.title}</li>)}
      </ul>
    </section>
  );
}`,
      walkthrough: [
        { lines: "5", text: "dataUpdatedAt and isStale come from the same result object." },
        { lines: "11", text: "Full spinner only when there is genuinely nothing to show." },
        { lines: "17-19", text: "Communicate freshness instead of hiding it." },
        { lines: "21", text: "refetch() ignores staleTime and always fetches." },
        { lines: "23-25", text: "If a background refetch fails, status is 'error' but the old data remains — keep showing it." },
        { lines: "27", text: "data may be undefined if the very first fetch failed, hence ?." },
      ],
    },
    mistakes: [
      {
        mistake: "\"staleTime is how long data stays in the cache.\"",
        fix: "staleTime = how long data is FRESH (no auto-refetch). How long INACTIVE data is kept is gcTime.",
      },
      {
        mistake: "Using `cacheTime` in v5 code.",
        fix: "It was renamed gcTime in v5.",
      },
      {
        mistake: "Thinking stale data is hidden or deleted.",
        fix: "Stale data is still returned and displayed; it is just refetched when a trigger occurs.",
      },
      {
        mistake: "Turning off refetchOnWindowFocus everywhere to stop 'extra' requests.",
        fix: "Raise staleTime for data that doesn't change often; keep focus refetching for data that does.",
      },
      {
        mistake: "Expecting gcTime to delete data that a mounted component is still using.",
        fix: "gcTime only starts once a query has no observers (inactive).",
      },
    ],
    debug: {
      prompt: "The team set this to 'cache events for 10 minutes and avoid refetching'. Yet the Network tab shows a request every time the user tabs back to the browser. Explain and fix.",
      language: "ts",
      buggyCode: `useQuery({
  queryKey: ["events"],
  queryFn: getEvents,
  cacheTime: 10 * 60 * 1000,
});`,
      hint: "Which option controls refetching? Is cacheTime a v5 option?",
      fixedCode: `useQuery({
  queryKey: ["events"],
  queryFn: ({ signal }) => getEvents(signal),
  staleTime: 10 * 60 * 1000, // fresh for 10 min → no focus/mount refetch
  gcTime: 15 * 60 * 1000, // keep inactive data a bit longer than it stays fresh
});`,
      explanation: "cacheTime doesn't exist in v5 (TypeScript reports it) and, even in v4, it controlled garbage collection of inactive data — not refetching. With the default staleTime of 0 the data is stale immediately, so every window focus triggers a refetch. staleTime is the knob for 'avoid refetching'.",
    },
    challenge: {
      prompt: "Write `describeQueryState(now, dataUpdatedAt, staleTime, observers, inactiveSince, gcTime)` returning 'fresh' | 'stale' | 'inactive' | 'garbage-collected' using TanStack Query's rules (ms throughout; inactiveSince is null while observed).",
      starterCode: `type QState = "fresh" | "stale" | "inactive" | "garbage-collected";

export function describeQueryState(
  now: number, dataUpdatedAt: number, staleTime: number,
  observers: number, inactiveSince: number | null, gcTime: number,
): QState {
  // TODO
}`,
      language: "ts",
      hints: [
        "Check garbage collection first: no observers and now - inactiveSince >= gcTime.",
        "Inactive entries can also be fresh or stale, but report 'inactive' for this exercise.",
        "Fresh when now - dataUpdatedAt < staleTime.",
      ],
      solution: `type QState = "fresh" | "stale" | "inactive" | "garbage-collected";

export function describeQueryState(
  now: number, dataUpdatedAt: number, staleTime: number,
  observers: number, inactiveSince: number | null, gcTime: number,
): QState {
  if (observers === 0 && inactiveSince !== null) {
    return now - inactiveSince >= gcTime ? "garbage-collected" : "inactive";
  }
  return now - dataUpdatedAt < staleTime ? "fresh" : "stale";
}

// describeQueryState(10_000, 0, 0, 1, null, 300_000)          → "stale" (default staleTime 0)
// describeQueryState(10_000, 0, 60_000, 1, null, 300_000)     → "fresh"
// describeQueryState(400_000, 0, 60_000, 0, 50_000, 300_000)  → "garbage-collected"`,
      explanation: "The two clocks are independent: freshness is measured from the last successful fetch; garbage collection from when the last observer left. Infinity works naturally in both comparisons.",
    },
    examQuestions: [
      {
        question: "(Mock A11) What does the staleTime option in TanStack Query control? A how long cached data is considered fresh; B how long a session remains authenticated; C how long a component remains mounted; D how long a form submission takes.",
        answer: "**A.** While data is fresh, TanStack Query serves it from cache without automatic refetches; once stale, triggers like mount or window focus cause a background refetch.",
        marks: 1,
      },
      {
        question: "Distinguish staleTime from gcTime and give the v5 defaults. (3 marks)",
        answer: "**staleTime** (default 0): how long after a successful fetch data is considered fresh; stale data is still shown but refetched on triggers. **gcTime** (default 5 minutes; called cacheTime in v4): how long a query that has no mounted observers (inactive) stays in the cache before being garbage-collected. One is about refetching, the other about memory.",
        marks: 3,
      },
      {
        question: "How can staleTime help satisfy the requirement 'the application should avoid unnecessary API requests' (mock D4)?",
        answer: "Setting an appropriate staleTime (e.g. 60 s for products, longer for rarely changing data) means mounts, navigation and window focus within that period use the cache instead of calling the API; invalidation after updates still refreshes data when it actually changes.",
        marks: 2,
      },
    ],
    revision: [
      "staleTime = how long data is FRESH (default 0). Fresh → no automatic refetch.",
      "Stale data is still displayed; it's refetched in the background on triggers.",
      "Triggers: mount, window focus, reconnect, refetchInterval (when stale).",
      "gcTime = how long INACTIVE (unobserved) entries are kept (default 5 min).",
      "v4 cacheTime → v5 gcTime.",
      "invalidateQueries / refetch() ignore staleTime.",
      "Tune staleTime per data type rather than disabling refetch options.",
    ],
    visualizers: ["query-cache"],
  },
  {
    id: "tq-mutations-invalidation",
    moduleId: "m10-tanstack-query",
    title: "useMutation and invalidating queries",
    summary:
      "Mutations change server data; they don't update cached queries by themselves — call queryClient.invalidateQueries (or setQueryData) in onSuccess so the UI reflects the change.",
    priority: "P0",
    examCritical: true,
    minutes: 30,
    objectives: [
      "Write a typed useMutation with mutate/mutateAsync and isPending/isError states.",
      "Invalidate related queries after a successful update (mock A15, C4, D4c).",
      "Use setQueryData to update the cache directly with server responses.",
      "Outline how optimistic updates work and when they're worth it.",
    ],
    prerequisites: ["tq-usequery-keys", "tq-stale-gc", "http-methods-status"],
    sources: [
      { kind: "mock", label: "MOCK ICT", detail: "A15 (invalidateQueries), C4 (refresh cached customer data after update), D4c (refresh products after update)" },
      {
        kind: "university",
        label: "Week 05 — Routing, Forms, Validation, CRUD",
        detail: "CRUD with the CampusEvents API (POST 201, PUT 204, DELETE 204)",
      },
      NOT_SUPPLIED_L7,
      {
        kind: "supplementary",
        label: "TanStack Query v5 docs — Mutations",
        url: "https://tanstack.com/query/latest/docs/framework/react/guides/mutations",
      },
      {
        kind: "supplementary",
        label: "TanStack Query v5 docs — Invalidation from Mutations",
        url: "https://tanstack.com/query/latest/docs/framework/react/guides/invalidations-from-mutations",
      },
      {
        kind: "supplementary",
        label: "TanStack Query v5 docs — Optimistic Updates",
        url: "https://tanstack.com/query/latest/docs/framework/react/guides/optimistic-updates",
      },
    ],
    why: `After an admin edits an event, the details page and the list should show the new title. But TanStack Query has no idea that \`PUT /api/events/5\` affected \`['events']\` and \`['events', 5]\` — it can't read your API's mind. Without telling it, users see old data until something happens to refetch. Mock C4 and D4c ask exactly how to fix this; A15 asks what \`invalidateQueries\` does.`,
    analogy: `Back to the library photocopies: when you **edit the original book** (mutation), your old photocopies don't magically change. \`invalidateQueries\` is pinning a note "OUT OF DATE" on every copy with that label — copies on desks people are actively reading get re-photocopied right away; copies in drawers get replaced next time someone takes them out. \`setQueryData\` is writing the correction directly onto the copy because you already know exactly what the new page says.`,
    explain: {
      beginner: `**Queries read; mutations write.** For POST/PUT/PATCH/DELETE you use \`useMutation\`:

\`\`\`ts
const queryClient = useQueryClient();
const updateEvent = useMutation({
  mutationFn: (input: UpdateEventInput) => eventService.update(input),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["events"] });
  },
});
// later: updateEvent.mutate({ id: 5, title: "New title", ... })
\`\`\`

- \`mutationFn\` does the request. It doesn't run on mount — only when you call \`mutate(variables)\`.
- \`isPending\` is true while it runs (disable the Save button). \`isError\`/\`error\`, \`isSuccess\` work like queries.
- **Mutations do not update queries automatically.**

**invalidateQueries** marks every query whose key **starts with** the given key as **stale**, and immediately refetches the ones currently on screen (active). Others refetch when next used. So invalidating \`['events']\` refreshes both the list \`['events']\` and details \`['events', 5]\`.

For the mock C4 answer: "\`queryClient.invalidateQueries({ queryKey: ['customer'] })\` — called after a successful update (e.g. in onSuccess), it marks the cached customer queries as stale so TanStack Query refetches fresh data from the server."`,
      developer: `**Typing:** \`useMutation<TData, TError, TVariables>\` is usually inferred from \`mutationFn\`. Callbacks: \`onMutate(variables)\` (before), \`onSuccess(data, variables, context)\`, \`onError(error, variables, context)\`, \`onSettled\` (always).

**mutate vs mutateAsync:** \`mutate\` is fire-and-forget (errors go to callbacks/state); \`mutateAsync\` returns a promise you must \`await\`/catch — handy to \`navigate\` after success.

**Return the invalidation promise** from \`onSuccess\` to keep the mutation \`isPending\` until refetches finish:

\`\`\`ts
onSuccess: () => queryClient.invalidateQueries({ queryKey: ["events"] }),
\`\`\`

**setQueryData when the server returns the new entity.** CampusEvents' \`POST /api/events\` returns **201 + EventDto**, so you can seed the detail cache: \`queryClient.setQueryData(["events", created.id], created)\`. But its \`PUT\` returns **204 No Content** — no body — so there's nothing to write; invalidate instead (and never call \`res.json()\` on the 204).

**Matching options:** \`exact: true\` matches only the exact key; \`refetchType: 'active' | 'inactive' | 'all' | 'none'\`; \`predicate\` for custom matching.

**DELETE:** \`removeQueries({ queryKey: ["events", id] })\` for the deleted detail + invalidate the list. Handle CampusEvents' 400 when bookings/reviews exist by showing the server's message.`,
      deep: `**Optimistic updates** make the UI change before the server confirms:

1. \`onMutate\`: \`await queryClient.cancelQueries({ queryKey })\` (so an in-flight refetch doesn't overwrite your optimistic value), snapshot \`getQueryData\`, \`setQueryData\` the optimistic value, return \`{ previous }\` as context.
2. \`onError\`: roll back with \`setQueryData(queryKey, context.previous)\`.
3. \`onSettled\`: \`invalidateQueries\` to resync with the truth.

v5 also offers a simpler variant: render \`mutation.variables\` as a pending item while \`isPending\`, without touching the cache. Optimistic updates suit low-risk, high-frequency actions (toggle favourite); avoid them for things users must not be misled about (payments, ticket availability where the server may refuse).

**Immutability:** \`setQueryData\` updaters must return **new** objects/arrays (\`old.map(...)\`), never mutate \`old\` in place — the cache relies on reference changes and structural sharing.

**Why not auto-invalidate?** The library can't know which keys a mutation affects; your key design (\`['events', …]\` hierarchy, key factories) makes the mapping one line. Some teams attach \`meta: { invalidates: [...] }\` to mutations and handle it globally in a \`MutationCache\` \`onSuccess\`.

**Races.** Two quick mutations + invalidations may interleave; TanStack cancels the earlier in-flight refetch when a new invalidation refetches the same query (\`cancelRefetch\` defaults to true), so the final state reflects the last fetch.`,
    },
    mechanism: `\`\`\`text
 Admin clicks Save
   │ mutate({ id: 5, ...form })
   ▼
 useMutation ── status: pending ──► mutationFn → PUT /api/events/5 ──► 204 No Content
   │                                                                    │
   │◄─────────────────────────── success ───────────────────────────────┘
   ▼
 onSuccess: queryClient.invalidateQueries({ queryKey: ['events'] })
   │ prefix match
   ├─ ['events']            ACTIVE (list on screen)  → stale + refetch NOW
   ├─ ['events', 5]         ACTIVE (details open)   → stale + refetch NOW
   ├─ ['events', 9]         inactive                → stale (refetch when next used)
   └─ ['categories']        not matched             → untouched

 Without onSuccess invalidation: every entry above keeps showing the OLD title
 until something else triggers a refetch.
\`\`\``,
    simpleExample: {
      title: "Delete an event and refresh the list",
      language: "tsx",
      code: `import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteEvent } from "../services/eventService"; // DELETE → 204, no body

export function DeleteEventButton({ id }: { id: number }) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: () => deleteEvent(id),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["events", id] }); // detail no longer exists
      return queryClient.invalidateQueries({ queryKey: ["events"] }); // refresh the list
    },
  });

  return (
    <>
      <button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
        {mutation.isPending ? "Deleting…" : "Delete"}
      </button>
      {mutation.isError && <p role="alert">{mutation.error.message}</p>}
    </>
  );
}`,
      walkthrough: [
        { lines: "5", text: "useQueryClient gives access to the same client provided at the root." },
        { lines: "7", text: "mutationFn runs only when mutate() is called." },
        { lines: "9-10", text: "Remove the deleted detail, then invalidate the list; returning the promise keeps isPending true until the refetch completes." },
        { lines: "16", text: "Disable the button while pending to avoid double submissions." },
        { lines: "19", text: "Show server errors such as CampusEvents' 400 'event has bookings'." },
      ],
    },
    realExample: {
      title: "useUpdateEvent + useCreateEvent hooks (PUT 204, POST 201)",
      language: "ts",
      code: `import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import type { EventDto, EventFormData } from "../types/Event";
import { apiFetch } from "../services/apiClient";

export const eventKeys = {
  all: ["events"] as const,
  detail: (id: number) => ["events", id] as const,
};

export function useUpdateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: EventFormData }) =>
      apiFetch<void>(\`/events/\${id}\`, { method: "PUT", body: JSON.stringify(data) }), // 204
    onSuccess: (_void, { id }) =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: eventKeys.detail(id) }),
        queryClient.invalidateQueries({ queryKey: eventKeys.all, exact: true }),
      ]),
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (data: EventFormData) =>
      apiFetch<EventDto>("/events", { method: "POST", body: JSON.stringify(data) }), // 201 + body
    onSuccess: (created) => {
      queryClient.setQueryData(eventKeys.detail(created.id), created); // seed the detail cache
      void queryClient.invalidateQueries({ queryKey: eventKeys.all, exact: true });
      navigate(\`/events/\${created.id}\`);
    },
  });
}`,
      walkthrough: [
        { lines: "6-9", text: "Shared key factory: the same keys the queries use." },
        { lines: "14-15", text: "PUT returns 204 — apiFetch returns undefined without parsing JSON." },
        { lines: "16-20", text: "Variables are the second onSuccess argument. Invalidate the edited detail and the list." },
        { lines: "28-29", text: "POST returns the created EventDto (201)." },
        { lines: "31", text: "setQueryData writes the server's response into the cache — the details page renders instantly without a request." },
        { lines: "32-33", text: "Still invalidate the list (the new event must appear), then navigate." },
      ],
    },
    mistakes: [
      {
        mistake: "Expecting the list to update automatically after a successful mutation.",
        fix: "Mutations don't touch queries. Invalidate (or setQueryData) in onSuccess.",
      },
      {
        mistake: "Invalidating with a key that doesn't match: invalidateQueries({ queryKey: ['event'] }) when queries use ['events', id].",
        fix: "Use the same keys as your queries — a key factory prevents typos.",
      },
      {
        mistake: "v4 syntax: queryClient.invalidateQueries(['events']).",
        fix: "v5 takes an object: invalidateQueries({ queryKey: ['events'] }).",
      },
      {
        mistake: "Calling res.json() on CampusEvents' PUT/DELETE 204 responses and treating the parse error as failure.",
        fix: "204 has no body — return early when status is 204.",
      },
      {
        mistake: "Mutating the old array inside setQueryData (old.push(item); return old).",
        fix: "Return a new array/object: (old) => old ? [...old, item] : [item].",
      },
    ],
    debug: {
      prompt: "After editing a product, the success toast shows but the product page still displays the old price. Find the bug(s).",
      language: "ts",
      buggyCode: `const queryClient = useQueryClient();
const mutation = useMutation({
  mutationFn: (p: Product) =>
    fetch(\`/api/products/\${p.id}\`, { method: "PUT", body: JSON.stringify(p) }),
  onSuccess: () => {
    toast("Saved!");
    queryClient.invalidateQueries({ queryKey: ["product"] });
  },
});`,
      hint: "What keys do the product queries use? Does fetch reject on 400? Are headers missing?",
      fixedCode: `const queryClient = useQueryClient();
const mutation = useMutation({
  mutationFn: async (p: Product) => {
    const res = await fetch(\`/api/products/\${p.id}\`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(p),
    });
    if (!res.ok) throw new Error(\`Update failed (\${res.status})\`);
  },
  onSuccess: (_data, p) => {
    toast("Saved!");
    return queryClient.invalidateQueries({ queryKey: ["products"] }); // matches ['products'] and ['products', p.id]
  },
});`,
      explanation: "The queries use ['products', id] but the invalidation used ['product'] — no prefix match, nothing refreshed. Also fetch resolves on HTTP errors, so a 400/415 (missing Content-Type) still triggered onSuccess and a misleading toast. Throw on !res.ok so failures reach the error state.",
    },
    challenge: {
      prompt: "Implement `useToggleFavourite()` with an optimistic update on the ['events'] list (each event has `isFavourite: boolean`), rolling back on error and invalidating on settle.",
      starterCode: `import { useMutation, useQueryClient } from "@tanstack/react-query";

interface EventItem { id: number; title: string; isFavourite: boolean }
declare function setFavourite(id: number, value: boolean): Promise<void>;

export function useToggleFavourite() {
  // TODO
}`,
      language: "ts",
      hints: [
        "onMutate: cancelQueries, getQueryData snapshot, setQueryData new array, return { previous }.",
        "onError receives context as the third argument.",
        "onSettled: invalidateQueries({ queryKey: ['events'] }).",
      ],
      solution: `import { useMutation, useQueryClient } from "@tanstack/react-query";

interface EventItem { id: number; title: string; isFavourite: boolean }
declare function setFavourite(id: number, value: boolean): Promise<void>;

export function useToggleFavourite() {
  const queryClient = useQueryClient();
  const key = ["events"] as const;

  return useMutation({
    mutationFn: ({ id, value }: { id: number; value: boolean }) => setFavourite(id, value),
    onMutate: async ({ id, value }) => {
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<EventItem[]>(key);
      queryClient.setQueryData<EventItem[]>(key, (old) =>
        old?.map((e) => (e.id === id ? { ...e, isFavourite: value } : e)),
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(key, context.previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: key }),
  });
}`,
      explanation: "Cancel first so an in-flight refetch can't overwrite the optimistic value; snapshot for rollback; update immutably; resync with the server whatever happens. The context returned from onMutate is typed automatically for onError.",
    },
    examQuestions: [
      {
        question: "(Mock A15) What is the main purpose of invalidateQueries() in TanStack Query?",
        answer: "**B** — to mark matching cached queries as invalid (stale) so they can be refreshed. Active matching queries are refetched immediately; inactive ones refetch when next used.",
        marks: 1,
      },
      {
        question: "(Mock C4) After successfully updating a customer's profile, the application must refresh cached customer information. Write the TanStack Query function used and explain what it does. (3 marks)",
        answer: "`queryClient.invalidateQueries({ queryKey: ['customers'] })` (obtained via `useQueryClient()`), called in the mutation's `onSuccess`. It marks every cached query whose key starts with ['customers'] as stale; those currently rendered are refetched immediately from the server so the UI shows the updated profile, and others refetch next time they are used.",
        marks: 3,
      },
      {
        question: "(Mock D4c) Explain how the application can ensure product information is refreshed after a successful update. (2 marks)",
        answer: "Perform the update with useMutation and, in onSuccess, call queryClient.invalidateQueries({ queryKey: ['products'] }) (or setQueryData with the returned product). Invalidation marks product queries stale and refetches active ones, so components display the new data.",
        marks: 2,
      },
      {
        question: "When would you use setQueryData instead of invalidateQueries?",
        answer: "When the mutation response already contains the complete, authoritative new data (e.g. POST returning 201 + EventDto), you can write it straight into the cache and avoid a request. If the response has no body (PUT 204) or affects many derived queries (lists, counts), invalidate instead.",
        marks: 2,
      },
    ],
    revision: [
      "useMutation({ mutationFn, onSuccess, onError, onSettled }); call mutate(vars).",
      "Mutations do NOT update queries automatically.",
      "invalidateQueries({ queryKey }) — prefix match; marks stale; refetches ACTIVE queries.",
      "Return the invalidation promise from onSuccess to keep isPending until refreshed.",
      "setQueryData writes known data into the cache (e.g. POST 201 response).",
      "CampusEvents PUT/DELETE return 204: no body → invalidate.",
      "Optimistic: cancelQueries → snapshot → setQueryData → rollback onError → invalidate onSettled.",
    ],
    visualizers: ["query-cache"],
  },

  /* ================================================================== */
  /* m11-zustand                                                         */
  /* ================================================================== */
  {
    id: "zustand-basics",
    moduleId: "m11-zustand",
    title: "Zustand basics: create a store, read it with the generated hook",
    summary:
      "create<State>()((set, get) => ({ ... })) returns a hook; components call it to read state and actions, and set() shallow-merges updates.",
    priority: "P0",
    examCritical: true,
    minutes: 25,
    objectives: [
      "Explain why some client state needs to be global and why Zustand is a lightweight choice.",
      "Create a typed Zustand v5 store with state and actions using set and get.",
      "Explain set's shallow merge and immutable updates for nested data.",
      "Access store data with the generated hook (mock A12) and outside React with getState().",
      "Build a theme store (mock D4a) and a cart store.",
    ],
    prerequisites: ["react-state-events", "react-custom-hooks"],
    sources: [
      { kind: "mock", label: "MOCK ICT", detail: "A12 (the store's generated Hook), D4a (theme across components → Zustand), B7" },
      NOT_SUPPLIED_L7,
      ZUSTAND_INTRO,
      {
        kind: "supplementary",
        label: "Zustand docs — Updating state",
        url: "https://zustand.docs.pmnd.rs/guides/updating-state",
      },
      {
        kind: "supplementary",
        label: "Zustand README — TypeScript usage (create<T>()(...))",
        url: "https://github.com/pmndrs/zustand",
      },
      {
        kind: "supplementary",
        label: "react.dev — Sharing state between components",
        url: "https://react.dev/learn/sharing-state-between-components",
      },
    ],
    why: `The theme toggle lives in the Navbar, but the Layout, cards and footer all need the current theme (mock D4a). Lifting state to \`App\` and passing it down through five levels of props (*prop drilling*) gets painful; React Context works but re-renders every consumer whenever any part of the value changes and needs provider boilerplate. Zustand gives you a tiny global store with a hook API and no provider.`,
    analogy: `A Zustand store is a **shared whiteboard on the office wall**. Anyone can walk up and **read** the part they care about (the generated hook with a selector), and the whiteboard has a few **official marker pens** (actions) for changing it. When the board changes, only people who were looking at the changed part need to look up again.`,
    explain: {
      beginner: `**Local state** (\`useState\`) belongs to one component. When several distant components need the same client data — theme, logged-in user, shopping cart — you need **shared/global client state**.

**Zustand** ("state" in German) lets you create a store in a few lines:

\`\`\`ts
import { create } from "zustand";

interface ThemeState {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()((set) => ({
  theme: "light",
  toggleTheme: () => set((state) => ({ theme: state.theme === "light" ? "dark" : "light" })),
}));
\`\`\`

\`create\` returns a **custom hook** (\`useThemeStore\`). That generated hook is how components access the store (mock A12, answer C):

\`\`\`tsx
const theme = useThemeStore((s) => s.theme);
const toggleTheme = useThemeStore((s) => s.toggleTheme);
\`\`\`

The function you pass to the hook is a **selector** — it picks the piece you need. No \`<Provider>\` is required.

**Actions** are functions stored in the state that call \`set\`. \`set\` **merges** the object you return into the existing state (one level deep), so you only return the fields that change. Like React state, updates must be immutable: create new arrays/objects instead of changing existing ones.`,
      developer: `**Typed store pattern (v5):** \`create<State>()(initializer)\` — note the extra \`()\` ("curried" form) which lets TypeScript infer middleware types correctly.

**set forms:**
- \`set({ theme: "dark" })\` — object, merged.
- \`set((state) => ({ count: state.count + 1 }))\` — updater when the new value depends on the old.
- \`set(newState, true)\` — **replace** instead of merge (rare; you lose actions unless included).

**get()** reads the current state inside actions without subscribing — useful for derived logic: \`checkout: () => api.order(get().items)\`.

**Shallow merge:** \`set({ user: { name: "Ada" } })\` replaces the whole \`user\` object. For nested updates spread manually: \`set((s) => ({ user: { ...s.user, name: "Ada" } }))\`.

**Outside React:** the hook also has static methods — \`useCartStore.getState()\`, \`useCartStore.setState()\`, \`useCartStore.subscribe(listener)\` — handy in an API client (read the token) or tests (reset state).

**What belongs in Zustand:** theme, auth session/user (UI copy), cart before checkout, UI preferences, multi-step wizard progress. **Not** server data like the events list — that's TanStack Query's job.

**Derived values:** don't store totals that can be computed; compute them in a selector (\`s.items.reduce(...)\`) — compare mock A1/C1's \`reduce\`.`,
      deep: `**How it works.** Zustand's vanilla core is a closure holding \`state\` and a \`Set\` of listeners. \`setState\` computes the next state (\`Object.assign({}, state, partial)\` unless replacing), skips if \`Object.is(next, state)\`, then notifies listeners. The React binding uses \`useSyncExternalStore\` to subscribe each component, run its selector on the latest snapshot, and re-render only when the selected value changes (\`Object.is\`). That's why selecting a primitive is cheap and why selectors must not return a fresh object every call (next lesson).

**Module-level singletons.** A store created at module scope is global for the page. In tests, reset it in \`beforeEach\` (\`useStore.setState(initialState, true)\`); in SSR, per-request stores via \`createStore\` + Context avoid cross-request leakage.

**Actions in state vs separate.** Putting actions inside the store keeps them stable references (they're created once), so selecting an action never causes re-renders. Alternatively, export plain functions that call \`useStore.setState\` — the docs mention both; consistency matters more than the choice.

**Immutability matters** because subscribers compare references. \`state.items.push(x); set({ items: state.items })\` doesn't change the reference → \`Object.is\` says equal → no re-render. (The optional \`immer\` middleware lets you write mutating syntax safely.)

**Zustand vs Context vs Redux Toolkit.** Context is dependency injection, not a state manager — every consumer re-renders when the value changes. Redux Toolkit adds structure (slices, devtools, middleware) at more ceremony. Zustand sits in between: minimal API, selector-based subscriptions, optional middleware (persist, devtools, immer).`,
    },
    mechanism: `\`\`\`text
 create<CartState>()((set, get) => ({ items: [], addItem, removeItem, clear }))
        │
        ▼
 ┌──────────── store (module singleton) ────────────┐
 │ state: { items: [...], addItem(), removeItem() } │
 │ listeners: Set<() => void>                       │
 │ setState(partial) → next = { ...state, ...partial }  (SHALLOW merge)
 │                   → notify listeners             │
 └───────┬──────────────────────┬───────────────────┘
         │ useCartStore(sel)     │ useCartStore.getState()  (non-React code)
         ▼                       ▼
  <CartBadge> sel: s => s.items.length      apiClient / tests
  <CartPage>  sel: s => s.items
  <AddButton> sel: s => s.addItem   (stable function → never re-renders on cart changes)

 click "Add" → addItem(p) → set(s => ({ items: [...s.items, p] }))
            → listeners run selectors → re-render components whose selected value changed
\`\`\``,
    simpleExample: {
      title: "Theme store (mock D4a) and its use",
      language: "tsx",
      code: `import { create } from "zustand";

type Theme = "light" | "dark";

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()((set) => ({
  theme: "light",
  setTheme: (theme) => set({ theme }),
  toggleTheme: () => set((s) => ({ theme: s.theme === "light" ? "dark" : "light" })),
}));

export function ThemeToggle() {
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  return (
    <button onClick={toggleTheme} aria-pressed={theme === "dark"}>
      {theme === "light" ? "Switch to dark" : "Switch to light"}
    </button>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const theme = useThemeStore((s) => s.theme); // same store, different component — no props
  return <div data-theme={theme}>{children}</div>;
}`,
      walkthrough: [
        { lines: "11", text: "create<ThemeState>() — the curried v5 TypeScript form; returns a hook." },
        { lines: "13", text: "Object form of set: merged into existing state." },
        { lines: "14", text: "Updater form when the next value depends on the previous." },
        { lines: "18-19", text: "Read with the generated hook + a selector (mock A12)." },
        { lines: "28-29", text: "Any component can read the theme without prop drilling or a Provider." },
      ],
    },
    realExample: {
      title: "cartStore.ts — actions with immutable updates, get(), and derived totals",
      language: "ts",
      code: `import { create } from "zustand";

export interface CartItem {
  eventId: number;
  title: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  removeItem: (eventId: number) => void;
  setQuantity: (eventId: number, quantity: number) => void;
  clear: () => void;
  totalPrice: () => number;
}

export const useCartStore = create<CartState>()((set, get) => ({
  items: [],

  addItem: (item, qty = 1) =>
    set((state) => {
      const existing = state.items.find((i) => i.eventId === item.eventId);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.eventId === item.eventId ? { ...i, quantity: i.quantity + qty } : i,
          ),
        };
      }
      return { items: [...state.items, { ...item, quantity: qty }] };
    }),

  removeItem: (eventId) =>
    set((state) => ({ items: state.items.filter((i) => i.eventId !== eventId) })),

  setQuantity: (eventId, quantity) =>
    set((state) => ({
      items:
        quantity <= 0
          ? state.items.filter((i) => i.eventId !== eventId)
          : state.items.map((i) => (i.eventId === eventId ? { ...i, quantity } : i)),
    })),

  clear: () => set({ items: [] }),

  totalPrice: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
}));

// Derived value via a selector (re-renders only when the number changes):
// const total = useCartStore((s) => s.items.reduce((sum, i) => sum + i.price * i.quantity, 0));`,
      walkthrough: [
        { lines: "10-17", text: "State and actions typed together in one interface." },
        { lines: "22-33", text: "Immutable update: map to a new array with a new object for the changed item, or append." },
        { lines: "35-36", text: "filter returns a new array — correct for removal." },
        { lines: "38-44", text: "Quantity 0 or less removes the item; otherwise replace that one item immutably." },
        { lines: "48", text: "get() reads the latest state inside an action without subscribing; reduce accumulates the total (mock A1)." },
        { lines: "51-52", text: "Prefer computing derived values in a selector instead of storing them." },
      ],
    },
    mistakes: [
      {
        mistake: "`create<State>((set) => ...)` without the extra parentheses in TypeScript.",
        fix: "Use the curried form create<State>()((set) => ...) so types (especially with middleware) infer correctly.",
      },
      {
        mistake: "Mutating state: `state.items.push(item); return { items: state.items }`.",
        fix: "Return new arrays/objects: { items: [...state.items, item] }. Same reference = no re-render.",
      },
      {
        mistake: "Assuming set deep-merges nested objects.",
        fix: "set merges only one level. Spread nested objects yourself: { user: { ...s.user, name } }.",
      },
      {
        mistake: "Storing server data (events list) in Zustand and refetching manually.",
        fix: "Server data → TanStack Query. Zustand is for client state.",
      },
      {
        mistake: "Wrapping the app in a Zustand <Provider>.",
        fix: "Zustand hooks need no provider; the store is a module-level singleton.",
      },
    ],
    debug: {
      prompt: "Clicking 'Add to cart' logs the new item in the console but the cart badge never updates. Why?",
      language: "ts",
      buggyCode: `export const useCartStore = create<CartState>()((set, get) => ({
  items: [],
  addItem: (item) => {
    const items = get().items;
    items.push({ ...item, quantity: 1 });
    console.log(items);
    set({ items });
  },
}));`,
      hint: "What does Zustand compare to decide whether subscribers should re-render?",
      fixedCode: `export const useCartStore = create<CartState>()((set) => ({
  items: [],
  addItem: (item) =>
    set((state) => ({ items: [...state.items, { ...item, quantity: 1 }] })),
}));`,
      explanation: "push mutated the existing array, so set received the same reference. The selector s => s.items (or s.items.length computed from the same mutated array before/after) is compared with Object.is; the array reference didn't change, so React wasn't told to re-render (and the mutation also breaks snapshot consistency). Always create new arrays/objects.",
    },
    challenge: {
      prompt: "Create a typed `useAuthStore` holding `user` (id, email, firstName, role) | null, `token` | null, `expiresAt` | null, with actions `login(response: AuthResponse)` and `logout()`, plus a selector-friendly `isAdmin` derived in the component.",
      starterCode: `import { create } from "zustand";

interface AuthResponse {
  token: string; expiresAt: string; userId: string; email: string;
  firstName: string; lastName: string; role: string;
}

// TODO: AuthUser, AuthState, useAuthStore`,
      language: "ts",
      hints: [
        "Map AuthResponse → { user, token, expiresAt } in login.",
        "logout sets all three back to null.",
        "In components: const isAdmin = useAuthStore((s) => s.user?.role === 'ADMIN');",
      ],
      solution: `import { create } from "zustand";

interface AuthResponse {
  token: string; expiresAt: string; userId: string; email: string;
  firstName: string; lastName: string; role: string;
}

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  role: string;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  expiresAt: string | null;
  login: (res: AuthResponse) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  token: null,
  expiresAt: null,
  login: (res) =>
    set({
      user: { id: res.userId, email: res.email, firstName: res.firstName, role: res.role.toUpperCase() },
      token: res.token,
      expiresAt: res.expiresAt,
    }),
  logout: () => set({ user: null, token: null, expiresAt: null }),
}));

// Component: const isAdmin = useAuthStore((s) => s.user?.role === "ADMIN"); // boolean → cheap re-render check`,
      explanation: "The store holds the client-side view of the session; selecting a boolean means components re-render only when admin status flips. isAdmin drives UI only — the server enforces roles.",
    },
    examQuestions: [
      {
        question: "(Mock A12) Which Zustand function is commonly used to access a particular piece of data from a store? A useState() B useEffect() C the store's generated Hook D createContext()",
        answer: "**C** — `create` returns a hook (e.g. `useThemeStore`); components call it with a selector: `useThemeStore((s) => s.theme)`.",
        marks: 1,
      },
      {
        question: "Write a Zustand store in TypeScript holding a theme ('light' | 'dark') with a toggleTheme action. (4 marks)",
        answer: "```ts\nimport { create } from 'zustand';\ninterface ThemeState { theme: 'light' | 'dark'; toggleTheme: () => void }\nexport const useThemeStore = create<ThemeState>()((set) => ({\n  theme: 'light',\n  toggleTheme: () => set((s) => ({ theme: s.theme === 'light' ? 'dark' : 'light' })),\n}));\n```\nMarks: import/create (1), typed state (1), initial value (1), action using updater set (1).",
        marks: 4,
      },
      {
        question: "What does `set` do with the object you pass it?",
        answer: "It shallow-merges it into the current state (only top-level keys are replaced), then notifies subscribers. Nested objects must be spread manually; set(state, true) replaces the whole state.",
        marks: 2,
      },
    ],
    revision: [
      "Global client state (theme, user, cart) → Zustand; server data → TanStack Query.",
      "create<State>()((set, get) => ({ ...state, ...actions })) returns a hook.",
      "Read with the generated hook + selector: useStore((s) => s.theme) (A12).",
      "set merges shallowly; use the updater form when depending on previous state.",
      "Never mutate — return new arrays/objects.",
      "get() inside actions; useStore.getState()/setState() outside React.",
      "No Provider needed.",
    ],
  },
  {
    id: "zustand-selectors",
    moduleId: "m11-zustand",
    title: "Zustand selectors and re-renders",
    summary:
      "A selector subscribes a component to just the value it picks; the component re-renders only when that value changes by Object.is — use useShallow when picking several fields.",
    priority: "P0",
    examCritical: true,
    minutes: 25,
    objectives: [
      "Explain why `useStore((s) => s.theme)` is better than `useStore()` (mock D4d).",
      "Explain Object.is comparison and why returning new objects/arrays from a selector causes problems.",
      "Use useShallow from 'zustand/react/shallow' for multi-field selection.",
      "State what selectors do NOT prevent (parent re-renders, actual value changes) and answer mock B7.",
    ],
    prerequisites: ["zustand-basics"],
    sources: [
      { kind: "mock", label: "MOCK ICT", detail: "B7 (components need not subscribe to the entire store), D4d (advantage of selectors)" },
      NOT_SUPPLIED_L7,
      ZUSTAND_INTRO,
      {
        kind: "supplementary",
        label: "Zustand docs — Prevent rerenders with useShallow",
        url: "https://zustand.docs.pmnd.rs/guides/prevent-rerenders-with-use-shallow",
      },
      {
        kind: "supplementary",
        label: "MDN — Object.is()",
        url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is",
      },
    ],
    why: `In a shop app the cart changes every time a user clicks "Add". If the theme toggle, header, footer and every product card subscribe to the *whole* store, they all re-render on every cart change. Selectors are Zustand's mechanism for fine-grained subscriptions. Mock D4d asks for one advantage of selectors (2 marks), and B7 tests the misconception that every component must subscribe to the entire store (False).`,
    analogy: `Subscribing to the whole store is like asking a newsagent to deliver **the entire newspaper** whenever *any* page changes. A selector is subscribing only to **the football results**: you're only disturbed when *that* changes. \`useShallow\` is subscribing to "football results and weather" — you're disturbed only if one of those two actually changed, not merely because a new bundle was printed.`,
    explain: {
      beginner: `When you call the store's hook you pass a **selector** — a function from the whole state to the part you need:

\`\`\`ts
const theme = useAppStore((s) => s.theme);
\`\`\`

After every store update, Zustand runs your selector again and compares the **new result with the previous result**. If they're the same, your component is **not** re-rendered. So a component that only selects \`theme\` doesn't re-render when the cart changes.

If you call the hook **without** a selector — \`const state = useAppStore()\` — you get the whole state object, and since every update creates a new state object, the component re-renders on **every** change to **anything** in the store.

The comparison uses \`Object.is\`, which is basically \`===\`: primitives (strings, numbers, booleans) compare by value; objects and arrays compare by **reference** (are they the same object in memory?).

That's why this is a problem:

\`\`\`ts
const { theme, user } = useAppStore((s) => ({ theme: s.theme, user: s.user })); // ❌ new object every time
\`\`\`

The selector returns a brand-new object every time, so it never looks "equal". In Zustand v5 this can even cause an infinite render loop error. Fix it with \`useShallow\`, which compares the object's fields one by one:

\`\`\`ts
import { useShallow } from "zustand/react/shallow";
const { theme, user } = useAppStore(useShallow((s) => ({ theme: s.theme, user: s.user })));
\`\`\`

Or simply call the hook twice, once per field.`,
      developer: `**Patterns, best to worst:**

1. **Atomic selectors**: \`const items = useCart((s) => s.items); const add = useCart((s) => s.addItem);\` — simplest, always correct.
2. **Derived primitive**: \`const count = useCart((s) => s.items.length);\` — re-renders only when the count changes, not when a quantity changes.
3. **Multiple fields** with \`useShallow\` (object or array/tuple): \`const [items, clear] = useCart(useShallow((s) => [s.items, s.clear]));\`.
4. ❌ **Whole store**: \`useCart()\` — re-renders on every change.

**Selecting actions** is free: action functions are created once, so their reference never changes and components selecting only actions never re-render due to store updates.

**Derived arrays need care:** \`useCart((s) => s.items.filter((i) => i.quantity > 1))\` returns a new array every time → treat like (3): wrap with \`useShallow\` (compares elements by Object.is) or select \`s.items\` and derive with \`useMemo\` in the component.

**Custom hooks** keep selectors consistent: \`export const useCartCount = () => useCartStore((s) => s.items.length);\`

**What selectors don't stop:** a component still re-renders when its **parent** re-renders (unless memoised), when its own local state changes, and of course when its selected value really changes. Selectors reduce *store-triggered* re-renders; they don't eliminate rendering.`,
      deep: `**Under the hood (v5).** The React binding calls \`useSyncExternalStore(api.subscribe, () => selector(api.getState()))\`. React requires \`getSnapshot\` to return a cached/stable value when the store hasn't changed; a selector that allocates a new object returns a different snapshot on every call, which React interprets as a change → render → new snapshot → … hence the "Maximum update depth exceeded" / "The result of getSnapshot should be cached" errors in v5. (v4 used its own equality-fn mechanism and merely over-rendered.) \`useShallow\` memoises the selector's output: if the new output is shallowly equal to the previous, it returns the **previous reference**, satisfying \`Object.is\`.

**Custom equality.** If you need a different comparison, \`createWithEqualityFn\` / \`useStoreWithEqualityFn\` from \`zustand/traditional\` accept an equality function (needs the \`use-sync-external-store\` package).

**Selector cost.** Selectors run on every store update for every subscribed component, so keep them cheap; for expensive derivations select the inputs and memoise the computation.

**Granular state design** helps more than clever selectors: separate frequently changing fields (cart items) from rarely changing ones (theme), or use separate stores (\`useThemeStore\`, \`useCartStore\`). Small stores per concern are idiomatic in Zustand.

**Measuring.** Use the React DevTools Profiler ("Highlight updates when components render") to *see* the difference between whole-store and selector subscriptions before optimising further.`,
    },
    mechanism: `\`\`\`text
 store update: addItem() → state' = { ...state, items: [...items, x] }   (theme unchanged)

 Component        selector                       prev        next         Object.is   re-render?
 ─────────────    ─────────────────────────────  ──────────  ───────────  ──────────  ──────────
 <ThemeToggle>    s => s.theme                   "dark"      "dark"       true        NO
 <CartBadge>      s => s.items.length            2           3            false       YES
 <AddButton>      s => s.addItem                 fnA         fnA          true        NO
 <Header>         (none) useStore()              stateObj    stateObj'    false       YES  ✗ wasteful
 <Bad>            s => ({ t: s.theme })          {t}#1       {t}#2        false       YES  ✗ every time
                                                                                     (v5: may loop!)
 <Good>           useShallow(s => ({ t: s.theme }))  {t}#1   {t}#1 (reused) true      NO
\`\`\``,
    simpleExample: {
      title: "Whole-store vs selector subscription",
      language: "tsx",
      code: `import { useShallow } from "zustand/react/shallow";
import { useAppStore } from "../stores/appStore"; // { theme, items, addItem, toggleTheme }

// ❌ Re-renders on EVERY store change (cart updates included)
export function ThemeLabelBad() {
  const state = useAppStore();
  return <span>{state.theme}</span>;
}

// ✅ Re-renders only when theme changes
export function ThemeLabel() {
  const theme = useAppStore((s) => s.theme);
  return <span>{theme}</span>;
}

// ✅ Several fields: useShallow compares each field instead of the object reference
export function ThemeControls() {
  const { theme, toggleTheme } = useAppStore(
    useShallow((s) => ({ theme: s.theme, toggleTheme: s.toggleTheme })),
  );
  return <button onClick={toggleTheme}>Theme: {theme}</button>;
}`,
      walkthrough: [
        { lines: "1", text: "useShallow is imported from 'zustand/react/shallow' (v5)." },
        { lines: "5-8", text: "No selector → subscribed to everything." },
        { lines: "11-14", text: "Primitive selector → Object.is compares strings by value." },
        { lines: "17-22", text: "An object selector must be wrapped in useShallow, otherwise it's new each time." },
      ],
    },
    realExample: {
      title: "Cart UI with derived-primitive selectors and reusable hooks",
      language: "tsx",
      code: `import { useShallow } from "zustand/react/shallow";
import { useCartStore } from "../stores/cartStore";

// Reusable selector hooks keep subscriptions consistent across the app
export const useCartCount = () =>
  useCartStore((s) => s.items.reduce((n, i) => n + i.quantity, 0));
export const useCartTotal = () =>
  useCartStore((s) => s.items.reduce((sum, i) => sum + i.price * i.quantity, 0));
export const useCartActions = () =>
  useCartStore(useShallow((s) => ({ add: s.addItem, remove: s.removeItem, clear: s.clear })));

export function CartBadge() {
  const count = useCartCount(); // number → re-renders only when the count changes
  return <span aria-label={\`\${count} items in cart\`}>{count}</span>;
}

export function CartSummary() {
  const items = useCartStore((s) => s.items);
  const total = useCartTotal();
  const { remove, clear } = useCartActions();
  return (
    <aside>
      <ul>
        {items.map((i) => (
          <li key={i.eventId}>
            {i.title} × {i.quantity}
            <button onClick={() => remove(i.eventId)}>Remove</button>
          </li>
        ))}
      </ul>
      <p>Total: £{total.toFixed(2)}</p>
      <button onClick={clear}>Clear cart</button>
    </aside>
  );
}`,
      walkthrough: [
        { lines: "5-8", text: "Selectors that compute a number: changing a title wouldn't re-render the badge; changing a quantity would." },
        { lines: "9-10", text: "Grouping actions into an object requires useShallow; the function references are stable, so this never triggers re-renders." },
        { lines: "18", text: "CartSummary genuinely needs the array, so it re-renders when items change — selectors don't (and shouldn't) prevent that." },
      ],
    },
    mistakes: [
      {
        mistake: "Calling `useStore()` with no selector in many components.",
        fix: "Select only what each component needs; whole-store subscription re-renders on every change.",
      },
      {
        mistake: "Returning a new object/array from a selector without useShallow (v5: infinite loop error).",
        fix: "Wrap with useShallow, or call the hook once per field.",
      },
      {
        mistake: "Believing selectors stop ALL re-renders.",
        fix: "They prevent re-renders caused by unrelated store changes. Parent renders, local state and real changes to the selected value still re-render.",
      },
      {
        mistake: "Mock B7: 'Zustand requires every component to subscribe to the entire store.'",
        fix: "False — components subscribe to whatever slice their selector returns, and components that don't use the store don't subscribe at all.",
      },
      {
        mistake: "Importing useShallow from 'zustand/shallow' and using it as an equality function argument (v4 style).",
        fix: "v5: `useStore(useShallow(selector))` with useShallow from 'zustand/react/shallow'.",
      },
    ],
    debug: {
      prompt: "After upgrading to Zustand v5 this component crashes with 'Maximum update depth exceeded'. Fix it two different ways.",
      language: "tsx",
      buggyCode: `function Header() {
  const { user, theme } = useAppStore((s) => ({ user: s.user, theme: s.theme }));
  return <header data-theme={theme}>{user?.firstName ?? "Guest"}</header>;
}`,
      hint: "What does the selector return each time it runs, and how does useSyncExternalStore treat a snapshot that's never equal to the last one?",
      fixedCode: `import { useShallow } from "zustand/react/shallow";

// Fix 1: useShallow
function Header() {
  const { user, theme } = useAppStore(useShallow((s) => ({ user: s.user, theme: s.theme })));
  return <header data-theme={theme}>{user?.firstName ?? "Guest"}</header>;
}

// Fix 2: atomic selectors
function Header2() {
  const user = useAppStore((s) => s.user);
  const theme = useAppStore((s) => s.theme);
  return <header data-theme={theme}>{user?.firstName ?? "Guest"}</header>;
}`,
      explanation: "The selector creates a new object on every call, so Object.is never sees equality; in v5 (useSyncExternalStore) that unstable snapshot causes an endless render loop. useShallow returns the previous object when fields are equal; atomic selectors return stable values directly.",
    },
    challenge: {
      prompt: "Without running code, predict which components re-render when `addItem` is called on a store `{ theme, items, addItem }`: (A) `useStore((s) => s.theme)`, (B) `useStore((s) => s.items)`, (C) `useStore((s) => s.addItem)`, (D) `useStore()`, (E) `useStore(useShallow((s) => [s.theme, s.addItem]))`, (F) `useStore((s) => s.items.length > 0)` when the cart already had 2 items.",
      language: "text",
      hints: [
        "Only items gets a new reference in addItem.",
        "A boolean that stays true doesn't change.",
      ],
      solution: `A — no (theme unchanged)
B — yes (new items array)
C — no (action reference is stable)
D — yes (whole new state object)
E — no (both elements Object.is-equal to the previous ones)
F — no (true → true)`,
      explanation: "Each subscriber re-renders only if its selector's output differs from last time by Object.is (or shallowly, with useShallow). Derived booleans/numbers are the most re-render-efficient.",
    },
    examQuestions: [
      {
        question: "(Mock D4d) Explain one advantage of using a selector when accessing data from a Zustand store. (2 marks)",
        answer: "A selector (e.g. `useStore((s) => s.theme)`) subscribes the component only to the selected value; Zustand compares the selector's result after each update (Object.is) and re-renders the component only when that value changes. So unrelated updates (e.g. cart changes) don't re-render the theme toggle, improving performance and keeping components focused on the data they need.",
        marks: 2,
      },
      {
        question: "(Mock B7) True or False: Zustand requires every component in an application to subscribe to the entire store.",
        answer: "**False.** Components choose what to subscribe to via selectors, and components not using the store don't subscribe at all.",
        marks: 1,
      },
      {
        question: "Why does `useStore((s) => ({ a: s.a, b: s.b }))` cause problems, and how do you fix it?",
        answer: "It returns a new object every time, so the reference comparison (Object.is) always reports a change — causing re-renders on every update (and in v5 an infinite loop). Fix: `useStore(useShallow((s) => ({ a: s.a, b: s.b })))` or two separate selectors.",
        marks: 2,
      },
    ],
    revision: [
      "Selector = function picking the slice a component needs: useStore((s) => s.theme).",
      "Re-render only when the selected value changes by Object.is.",
      "No selector = whole store = re-render on every change.",
      "Selectors returning new objects/arrays → wrap in useShallow (from 'zustand/react/shallow').",
      "Actions are stable references — selecting them never causes re-renders.",
      "Selectors don't stop parent-driven or genuine re-renders.",
      "B7 is False; D4d: fewer unnecessary re-renders.",
    ],
    visualizers: ["zustand-selectors"],
  },
  {
    id: "zustand-persist",
    moduleId: "m11-zustand",
    title: "Zustand middleware: persist and devtools",
    summary:
      "persist saves (part of) a store to localStorage under a name and rehydrates it on load; devtools connects the store to Redux DevTools; both are typed via the curried create<State>()(...) form.",
    priority: "P1",
    examCritical: true,
    minutes: 20,
    objectives: [
      "Persist a store to localStorage with persist and createJSONStorage.",
      "Use name, version/migrate and partialize to control what is saved.",
      "Reset a store and clear persisted data.",
      "Combine devtools and persist with correct TypeScript typing.",
    ],
    prerequisites: ["zustand-basics", "sec-token-storage"],
    sources: [
      NOT_SUPPLIED_L7,
      {
        kind: "supplementary",
        label: "Zustand docs — Persisting store data",
        url: "https://zustand.docs.pmnd.rs/integrations/persisting-store-data",
      },
      {
        kind: "supplementary",
        label: "Zustand docs — Introduction (middleware overview)",
        url: "https://zustand.docs.pmnd.rs/getting-started/introduction",
      },
      {
        kind: "supplementary",
        label: "MDN — Window.localStorage",
        url: "https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage",
      },
      {
        kind: "best-practice",
        label: "OWASP HTML5 Security Cheat Sheet — Local Storage",
        url: "https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html",
      },
    ],
    why: `Users expect the chosen theme and the cart to survive a page refresh. A plain Zustand store lives in memory and resets on reload. You could hand-write \`useEffect\`s that read and write localStorage, but you'd have to handle JSON parsing, versioning and which fields to save. The \`persist\` middleware does this in a few lines — and knowing \`partialize\` lets you avoid persisting things you shouldn't.`,
    analogy: `\`persist\` is a **save-game slot**. \`name\` is the slot label, \`partialize\` decides which items go into the save (your inventory, not the temporary on-screen menu), \`version\` + \`migrate\` let an updated game load an old save file, and *rehydration* is loading the save when the game starts.`,
    explain: {
      beginner: `Wrap your store's initializer in \`persist(...)\`:

\`\`\`ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "light",
      toggleTheme: () => set((s) => ({ theme: s.theme === "light" ? "dark" : "light" })),
    }),
    { name: "theme" }, // localStorage key
  ),
);
\`\`\`

Now every change is saved to \`localStorage\` under the key \`"theme"\` (as JSON), and when the app loads it reads it back — called **rehydration**. Functions (actions) aren't saved; only data.

Options you'll use:

- **name** (required) — the storage key; must be unique per store.
- **storage** — where to save. Default is localStorage; use \`createJSONStorage(() => sessionStorage)\` for per-tab storage.
- **partialize** — choose which fields to save, e.g. save \`items\` but not \`isCartOpen\`.
- **version** — a number; bump it when the shape changes, with a **migrate** function to convert old saves.

Remember localStorage is readable by any script on the page (XSS) and stays on shared computers — be thoughtful about persisting auth tokens and never persist passwords.

**devtools** middleware lets you inspect store changes with the Redux DevTools browser extension.`,
      developer: `**Full typed example with devtools + persist:**

\`\`\`ts
export const useCartStore = create<CartState>()(
  devtools(
    persist(
      (set) => ({ ...initialCart, addItem: (i) => set((s) => ({ items: [...s.items, i] }), undefined, "cart/addItem") }),
      { name: "ce-cart", version: 1, partialize: (s) => ({ items: s.items }) },
    ),
    { name: "CartStore" },
  ),
);
\`\`\`

- Order: \`devtools\` outermost is the recommended convention, so it sees every \`setState\` including rehydration.
- With devtools, \`set\` takes an optional third argument: the **action name** shown in the extension.

**partialize** returns the subset to store. Its return type becomes the persisted type; with \`migrate\` the persisted state is typed \`unknown\` — validate it.

**Persist API on the hook:** \`useCartStore.persist.clearStorage()\`, \`.rehydrate()\`, \`.hasHydrated()\`, \`.onFinishHydration(cb)\`, \`.getOptions()\`.

**Reset pattern:** keep an \`initialState\` object and expose \`reset: () => set(initialState)\`. To also wipe storage: \`useStore.persist.clearStorage()\`. Logout should reset auth *and* \`queryClient.clear()\`.

**Hydration timing:** with synchronous storage like localStorage, hydration happens during store creation, so the first render already sees the saved theme. With async storage (IndexedDB, React Native AsyncStorage) the first render sees defaults — check \`hasHydrated()\` to avoid UI flicker.

**Cross-tab sync:** persist doesn't automatically sync tabs; listen to the \`storage\` event and call \`useStore.persist.rehydrate()\` if needed.`,
      deep: `**What persist actually does.** It wraps \`set\` so every state change serialises \`partialize(state)\` (default: the whole state) with \`JSON.stringify\` into \`{ state, version }\` under \`name\`. On creation it reads the item, compares versions, runs \`migrate(persistedState, oldVersion)\` if they differ, then merges with the current state using \`merge\` (default: shallow \`{ ...current, ...persisted }\`). Nested objects therefore come entirely from storage — provide a custom \`merge\` for deep defaults when you add nested fields.

**Serialisation limits.** JSON drops functions and \`undefined\`, turns \`Date\` into strings, and \`Map\`/\`Set\` into \`{}\`. Store ISO strings/arrays, or supply custom \`storage\` with \`replacer\`/\`reviver\` in \`createJSONStorage\`.

**Trust boundary.** Persisted data is user-controlled: a user (or XSS script) can edit localStorage. Treat rehydrated values as untrusted — e.g. a persisted \`role: "ADMIN"\` only changes UI; the server still decides. Validate shape in \`migrate\`/\`merge\` (Zod) to avoid crashes from corrupted or old data.

**Security of persisting tokens.** Persisting the JWT means it survives restarts and sits in localStorage, readable by XSS — a deliberate trade-off (see the token-storage lesson). Consider persisting only the user profile and keeping the token in memory, or using \`sessionStorage\`, and always clear on logout/401.

**Quota and errors.** localStorage is ~5 MB per origin, synchronous (blocks the main thread on large writes) and can throw (quota exceeded, disabled storage in some private modes). Keep persisted slices small; persist writes on every \`set\`, so avoid persisting rapidly changing values like form keystrokes.

**SSR** (Next.js etc.) has no localStorage on the server; use \`skipHydration: true\` and call \`rehydrate()\` in an effect. Not relevant to the Vite SPA in this module, but common in interviews.`,
    },
    mechanism: `\`\`\`text
 page load
   │ create(persist(init, { name: "ce-cart", version: 1, partialize }))
   ▼
 init() → default state { items: [], isOpen: false, addItem... }
   │ read localStorage["ce-cart"] → '{"state":{"items":[...]},"version":1}'
   │ version matches? no → migrate(state, oldVersion)
   ▼
 merge(persisted, current) → { items: [saved...], isOpen: false, addItem... }   (REHYDRATED)
   │
 user action → set(...) → new state
   │                 └──► partialize(state) = { items } → JSON.stringify → localStorage["ce-cart"]
   ▼
 subscribers re-render

 devtools(persist(...)) → every set (incl. rehydrate) also sent to Redux DevTools with an action name
\`\`\``,
    simpleExample: {
      title: "Persisted theme store",
      language: "ts",
      code: `import { create } from "zustand";
import { persist } from "zustand/middleware";

type Theme = "light" | "dark";

interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "light",
      toggleTheme: () => set((s) => ({ theme: s.theme === "light" ? "dark" : "light" })),
    }),
    { name: "ce-theme" }, // localStorage key; defaults to localStorage + JSON
  ),
);

// localStorage["ce-theme"] → {"state":{"theme":"dark"},"version":0}`,
      walkthrough: [
        { lines: "2", text: "Middleware lives in 'zustand/middleware'." },
        { lines: "11-12", text: "Curried create<State>()(...) is required for middleware typing." },
        { lines: "18", text: "name is required and must be unique per persisted store." },
        { lines: "22", text: "Only data is serialised (actions are functions); version defaults to 0." },
      ],
    },
    realExample: {
      title: "Cart store with devtools, partialize, versioning and reset",
      language: "ts",
      code: `import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

export interface CartItem {
  eventId: number;
  title: string;
  price: number;
  quantity: number;
}

interface CartData {
  items: CartItem[];
  isOpen: boolean; // UI-only: not persisted
}

interface CartState extends CartData {
  addItem: (item: Omit<CartItem, "quantity">) => void;
  toggleOpen: () => void;
  reset: () => void;
}

const initialCart: CartData = { items: [], isOpen: false };

export const useCartStore = create<CartState>()(
  devtools(
    persist(
      (set) => ({
        ...initialCart,
        addItem: (item) =>
          set(
            (s) => ({ items: [...s.items, { ...item, quantity: 1 }] }),
            undefined,
            "cart/addItem",
          ),
        toggleOpen: () => set((s) => ({ isOpen: !s.isOpen }), undefined, "cart/toggleOpen"),
        reset: () => set(initialCart, undefined, "cart/reset"),
      }),
      {
        name: "ce-cart",
        storage: createJSONStorage(() => localStorage),
        version: 2,
        partialize: (state) => ({ items: state.items }),
        migrate: (persisted, version) => {
          // v1 stored { cart: [...] }; v2 stores { items: [...] }
          if (version === 1 && persisted && typeof persisted === "object" && "cart" in persisted) {
            return { items: (persisted as { cart: CartItem[] }).cart };
          }
          return persisted as { items: CartItem[] };
        },
      },
    ),
    { name: "CartStore" },
  ),
);

// Logout / "start again":
export function resetCartCompletely() {
  useCartStore.getState().reset();
  useCartStore.persist.clearStorage();
}`,
      walkthrough: [
        { lines: "11-14", text: "Separate data from actions; isOpen is UI-only state." },
        { lines: "24-26", text: "devtools outermost, persist inside; both typed via the curried create." },
        { lines: "30-34", text: "With devtools, set's third argument names the action in the Redux DevTools timeline." },
        { lines: "40-41", text: "Explicit localStorage via createJSONStorage (swap for sessionStorage easily)." },
        { lines: "42-43", text: "version + partialize: only items are saved." },
        { lines: "44-50", text: "migrate converts old saved shapes; persisted data is unknown and user-editable, so check it." },
        { lines: "57-60", text: "Reset memory state and remove the stored copy." },
      ],
    },
    mistakes: [
      {
        mistake: "Persisting the whole store including transient UI flags (isOpen, loading).",
        fix: "Use partialize to save only what should survive a reload.",
      },
      {
        mistake: "Two stores using the same persist name.",
        fix: "Names are storage keys — they'd overwrite each other. Use unique, prefixed names.",
      },
      {
        mistake: "Changing the persisted shape without bumping version.",
        fix: "Increase version and provide migrate, otherwise old saves merge into the new shape and crash or misbehave.",
      },
      {
        mistake: "Persisting server data (events list) to localStorage with Zustand.",
        fix: "Server data belongs in TanStack Query (it has its own persistence plugins if really needed).",
      },
      {
        mistake: "Trusting rehydrated values (e.g. role) as authoritative.",
        fix: "Users can edit localStorage. Treat persisted data as untrusted; the server enforces permissions.",
      },
    ],
    debug: {
      prompt: "After adding persist, TypeScript reports errors on `set` and the theme is still lost on refresh in some cases. Find the problems.",
      language: "ts",
      buggyCode: `export const useThemeStore = create<ThemeState>(
  persist((set) => ({
    theme: "light",
    toggleTheme: () => set((s) => ({ theme: s.theme === "light" ? "dark" : "light" })),
  }), { name: "" }),
);`,
      hint: "Look at the shape of the create call and at the persist name.",
      fixedCode: `export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "light",
      toggleTheme: () => set((s) => ({ theme: s.theme === "light" ? "dark" : "light" })),
    }),
    { name: "ce-theme" },
  ),
);`,
      explanation: "With middleware in TypeScript you must use the curried form create<T>()(...) — otherwise the middleware's mutator types aren't inferred and set is mistyped. An empty name means an empty storage key, which other code could collide with; give each persisted store a unique, descriptive name.",
    },
    challenge: {
      prompt: "Create a persisted `useAuthStore` that saves `user` and `expiresAt` to sessionStorage but keeps `token` in memory only, and exposes `logout()` that clears memory and storage.",
      starterCode: `import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthUser { id: string; email: string; role: string }
interface AuthState {
  user: AuthUser | null;
  token: string | null;
  expiresAt: string | null;
  login: (user: AuthUser, token: string, expiresAt: string) => void;
  logout: () => void;
}

// TODO`,
      language: "ts",
      hints: [
        "storage: createJSONStorage(() => sessionStorage)",
        "partialize: (s) => ({ user: s.user, expiresAt: s.expiresAt })",
        "Inside logout you can't reference the hook before it's defined? You can — actions run later, after creation.",
      ],
      solution: `import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthUser { id: string; email: string; role: string }
interface AuthState {
  user: AuthUser | null;
  token: string | null;
  expiresAt: string | null;
  login: (user: AuthUser, token: string, expiresAt: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      expiresAt: null,
      login: (user, token, expiresAt) => set({ user, token, expiresAt }),
      logout: () => {
        set({ user: null, token: null, expiresAt: null });
        useAuthStore.persist.clearStorage();
      },
    }),
    {
      name: "ce-auth",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (s) => ({ user: s.user, expiresAt: s.expiresAt }),
    },
  ),
);`,
      explanation: "The token never touches Web Storage, shrinking its exposure window; the trade-off is that after a refresh the user object is restored but the token isn't, so the app should treat 'user without token' as signed out (or re-authenticate). This is a design choice you can explain in coursework — not a perfect solution.",
    },
    examQuestions: [
      {
        question: "Explain what Zustand's persist middleware does and name two of its options.",
        answer: "It saves the store's state (or a chosen part) to a storage engine — localStorage by default — on every change, and rehydrates it when the app loads so state survives refreshes. Options: `name` (storage key, required), `storage` (e.g. createJSONStorage(() => sessionStorage)), `partialize` (which fields to save), `version`/`migrate` (handle shape changes).",
        marks: 3,
      },
      {
        question: "Why might you use partialize?",
        answer: "To persist only data that should survive a reload (e.g. cart items, theme) and exclude transient UI state or sensitive values (e.g. a token kept in memory), reducing storage size and exposure.",
        marks: 2,
      },
      {
        question: "Is data restored from localStorage by persist trustworthy? Explain.",
        answer: "No. Users and any script on the page can modify localStorage, and old versions may have a different shape. Validate it, and never base security decisions on it — the server enforces permissions.",
        marks: 2,
      },
    ],
    revision: [
      "persist from 'zustand/middleware': create<T>()(persist(init, { name })).",
      "Default storage: localStorage (JSON). createJSONStorage(() => sessionStorage) to change.",
      "partialize = choose what to save; version + migrate = handle shape changes.",
      "useStore.persist.clearStorage() / rehydrate() / hasHydrated().",
      "Reset: keep initialState and set(initialState).",
      "devtools(persist(...)) — set(partial, undefined, 'actionName') names actions.",
      "Persisted data is user-editable: validate, don't trust.",
    ],
  },

  /* ================================================================== */
  /* m12-state-architecture                                              */
  /* ================================================================== */
  {
    id: "state-kinds",
    moduleId: "m12-state-architecture",
    title: "Kinds of state and choosing where each lives",
    summary:
      "Local, shared client, server, URL, derived, form and persistent state each have a natural home — Zustand and TanStack Query are complementary, not interchangeable.",
    priority: "P0",
    examCritical: true,
    minutes: 30,
    objectives: [
      "Name and give examples of local, shared client, server, URL, derived, form and persistent state.",
      "Apply a decision guide to choose useState, Zustand, TanStack Query, URL params, React Hook Form or computed values.",
      "Write a full-mark answer to mock D4a (Zustand vs TanStack Query) and explain B14.",
      "Avoid duplicated and derived-but-stored state.",
    ],
    prerequisites: ["tq-server-state", "zustand-basics", "react-state-events"],
    sources: [
      { kind: "mock", label: "MOCK ICT", detail: "D4a (identify Zustand vs TanStack Query requirements — 4 marks), B14, B6, A18 (useSearchParams)" },
      WEEK03_SLIDE28,
      NOT_SUPPLIED_L7,
      {
        kind: "supplementary",
        label: "react.dev — Choosing the State Structure",
        url: "https://react.dev/learn/choosing-the-state-structure",
      },
      {
        kind: "supplementary",
        label: "TanStack Query v5 docs — Does TanStack Query replace client state?",
        url: "https://tanstack.com/query/latest/docs/framework/react/guides/does-this-replace-client-state",
      },
      ZUSTAND_INTRO,
    ],
    why: `Most state bugs aren't about *how* to update state but *where* it lives: the same data copied into two places that drift apart, server data in a global store that never refreshes, filters that vanish when the user shares a link. Mock D4a (4 marks) is literally a "where does this state belong?" question. A clear mental taxonomy turns it into an easy answer.`,
    analogy: `Think of a household:

- **Local state** — what's in your own pocket (only you need it).
- **Shared client state** — the family calendar on the fridge (everyone reads it, it's yours to change).
- **Server state** — the bank balance shown in the banking app (the bank owns it; your view may be out of date).
- **URL state** — the address on an envelope (anyone with it arrives at the same place).
- **Derived state** — "money left this month" — you don't write it down, you calculate it from the balance and bills.
- **Form state** — a draft letter not yet posted.
- **Persistent state** — things in the loft that survive moving house (a reload).`,
    explain: {
      beginner: `| Kind | Example in CampusEvents | Natural home |
|---|---|---|
| **Local** | is this dropdown open? | \`useState\` in that component |
| **Shared client** | theme, logged-in user, cart | **Zustand** (or Context for rarely-changing values) |
| **Server** | events, bookings, reviews | **TanStack Query** |
| **URL** | \`/events/7\`, \`?search=jazz&page=2\` | React Router (\`useParams\`, \`useSearchParams\`) |
| **Derived** | cart total, "sold out" flag, filtered list | **compute it** during render (or in a selector) |
| **Form** | values and errors while typing | React Hook Form / local state |
| **Persistent** | theme across reloads | Zustand \`persist\` (localStorage) |

**Quick decision guide:**

1. Does the **server own** it? → TanStack Query.
2. Can it be **calculated** from other state? → don't store it; derive it.
3. Should it survive **refresh / be shareable as a link**? → URL (or persist for preferences).
4. Is it used by **one component** (or a parent + children close together)? → \`useState\` / lift state up.
5. Needed by **many distant components**? → Zustand.

**Zustand vs TanStack Query** (mock B14 is **False**): TanStack Query handles data that comes from an API — caching, refetching, invalidation. Zustand holds client-owned data — theme, cart, UI preferences. Most real apps use **both**.`,
      developer: `**Mock D4a model answer structure** (4 marks — identify + justify each):

- **Zustand:** the selected theme. It is client-owned UI state needed by many components; Zustand provides a global store any component can read via its hook with a selector, without prop drilling (and \`persist\` can keep it across reloads).
- **TanStack Query:** retrieving product information, caching it, refreshing after updates, and avoiding unnecessary requests. Products are server state: TanStack Query caches by query key, deduplicates requests, uses \`staleTime\` to avoid refetching fresh data, and \`invalidateQueries\` after a mutation refreshes them.
- Using Zustand for products would mean re-implementing caching, staleness and refetching by hand.

**Anti-patterns:**

- *Mirroring server data*: \`useEffect(() => setEvents(data), [data])\` copies query data into useState/Zustand → two sources of truth. Use \`data\` directly.
- *Storing derived values*: \`total\` in the cart store must be updated on every change; compute it with \`reduce\` in a selector instead.
- *Global everything*: putting a modal's open flag in Zustand when only one component uses it.
- *Losing URL state*: search filters in useState disappear on refresh and can't be shared — put them in \`useSearchParams\` (mock A18).

**Combining them:** the authenticated user lives in Zustand; the query key for "my bookings" includes the user id (\`['bookings', 'mine', userId]\`) so switching users never shows the previous user's cached data; logout clears both.`,
      deep: `**Single source of truth** is the governing principle. For each piece of information, decide who *owns* it; everything else is a *view* (derived) or a *cache* (server state). Duplication is only acceptable when it's an explicit cache with a sync strategy — which is precisely what TanStack Query is.

**Locality first.** React's guidance is to keep state as close as possible to where it's used, lifting it only when siblings need it. Global stores add indirection and make components less reusable; use them for genuinely cross-cutting concerns.

**URL as state** gives you deep links, back/forward behaviour and refresh survival for free. Good candidates: selected tab, filters, sort, pagination, selected item id. Bad candidates: sensitive data (URLs leak via history/logs/Referer) and high-frequency values (every keystroke creating history entries — use \`setSearchParams(next, { replace: true })\` or debounce).

**Form state is transient**: it becomes server state only when submitted. Libraries like React Hook Form keep inputs uncontrolled to avoid re-rendering the whole form per keystroke and integrate schema validation (Zod). Initialising an edit form from query data is a *one-time copy* by design (\`defaultValues\`/\`reset(data)\`), not a sync.

**Context vs Zustand.** Context is ideal for dependency injection and rarely-changing values (theme can live there too); every consumer re-renders on any change of the value. Zustand's selector subscriptions scale better for frequently changing shared state.

**State machines.** For complex flows (checkout: cart → details → payment → confirmation) a discriminated-union status (\`{ step: 'payment', orderId }\`) prevents impossible combinations of booleans (\`isLoading && isError\`). TanStack Query's own \`status\` union is an example of this idea.`,
    },
    mechanism: `\`\`\`text
                        Where should this state live?
                                    │
              ┌─────────────────────┴─────────────────────┐
     owned by the server?                                  owned by the browser
              │ yes                                                  │
      TanStack Query                       can it be computed from other state?
   (cache, staleTime, invalidate)              │ yes → DERIVE (render / selector / useMemo)
                                               │ no
                                   should it be in a link / survive refresh?
                                    │ yes → URL (useParams / useSearchParams)
                                    │ no
                                   form input being edited? ─ yes → React Hook Form / useState
                                    │ no
                                   used by many distant components?
                                    │ yes → Zustand  (+ persist if it must survive reload)
                                    │ no  → useState (lift to nearest common parent if shared)
\`\`\``,
    simpleExample: {
      title: "One page, five kinds of state, each in its home",
      language: "tsx",
      code: `import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useThemeStore } from "../stores/themeStore";
import { getEvents } from "../services/eventService";

export function EventsPage() {
  const theme = useThemeStore((s) => s.theme); // shared client state → Zustand
  const [params, setParams] = useSearchParams(); // URL state
  const search = params.get("search") ?? "";
  const [showHelp, setShowHelp] = useState(false); // local UI state

  const { data: events = [], isPending } = useQuery({ // server state
    queryKey: ["events"],
    queryFn: ({ signal }) => getEvents(signal),
  });

  const visible = events.filter((e) => // derived state: computed, never stored
    e.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <main data-theme={theme}>
      <input
        value={search}
        onChange={(e) => setParams(e.target.value ? { search: e.target.value } : {}, { replace: true })}
        aria-label="Search events"
      />
      <button onClick={() => setShowHelp((v) => !v)}>Help</button>
      {showHelp && <p>Type to filter events by title.</p>}
      {isPending ? <p>Loading…</p> : <p>{visible.length} events</p>}
    </main>
  );
}`,
      walkthrough: [
        { lines: "8", text: "Theme is needed app-wide → Zustand selector." },
        { lines: "9-10", text: "Search lives in the URL: refresh-safe and shareable." },
        { lines: "11", text: "Help toggle only matters here → useState." },
        { lines: "13-16", text: "Events come from the API → TanStack Query." },
        { lines: "18-20", text: "The filtered list is derived each render — no useEffect, no second copy." },
        { lines: "26", text: "replace: true avoids a history entry per keystroke." },
      ],
    },
    realExample: {
      title: "Mock D4 — shopping app: theme store + product queries + update mutation",
      language: "tsx",
      code: `import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

/* ---------- Client state: theme (Zustand) ---------- */
interface ThemeState { theme: "light" | "dark"; toggleTheme: () => void }
export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "light",
      toggleTheme: () => set((s) => ({ theme: s.theme === "light" ? "dark" : "light" })),
    }),
    { name: "shop-theme" },
  ),
);

/* ---------- Server state: products (TanStack Query) ---------- */
interface Product { id: number; name: string; price: number }
const API = "https://example.com/api";

async function fetchProducts(signal: AbortSignal): Promise<Product[]> {
  const res = await fetch(\`\${API}/products\`, { signal });
  if (!res.ok) throw new Error(\`Failed (\${res.status})\`);
  return (await res.json()) as Product[];
}

async function updateProduct(p: Product): Promise<void> {
  const res = await fetch(\`\${API}/products/\${p.id}\`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(p),
  });
  if (!res.ok) throw new Error(\`Update failed (\${res.status})\`);
}

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: ({ signal }) => fetchProducts(signal),
    staleTime: 60_000, // cached + fresh for 1 min → avoids unnecessary requests
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProduct,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }), // refresh after update
  });
}

/* ---------- A component using both ---------- */
export function ProductList() {
  const theme = useThemeStore((s) => s.theme); // selector: re-renders only on theme change
  const { data, isPending, isError } = useProducts();
  if (isPending) return <p>Loading…</p>;
  if (isError) return <p role="alert">Could not load products.</p>;
  return (
    <ul className={theme}>
      {data.map((p) => <li key={p.id}>{p.name} — £{p.price}</li>)}
    </ul>
  );
}`,
      walkthrough: [
        { lines: "5-15", text: "Requirement 1 (theme across components) → Zustand, persisted." },
        { lines: "17-34", text: "Service functions: fetch with response.ok checks." },
        { lines: "36-42", text: "Requirements 2–3 and 5 (retrieve, cache, avoid unnecessary requests) → useQuery with a key and staleTime." },
        { lines: "44-50", text: "Requirement 4 (refresh after update) → useMutation + invalidateQueries." },
        { lines: "54", text: "D4d: a selector limits re-renders to theme changes." },
      ],
    },
    mistakes: [
      {
        mistake: "Copying TanStack Query data into Zustand or useState via useEffect.",
        fix: "Use the query's data directly; call the same hook wherever needed. Copies drift and go stale.",
      },
      {
        mistake: "Storing derived values (cart total, filtered list) in state.",
        fix: "Compute them during render or in a selector; memoise only if measurably expensive.",
      },
      {
        mistake: "Putting everything in a global store.",
        fix: "Keep state local until multiple distant components need it.",
      },
      {
        mistake: "Keeping filters/pagination in useState so links and refresh lose them.",
        fix: "Use useSearchParams for shareable view state.",
      },
      {
        mistake: "Answering D4a with 'use Zustand for everything because it's simpler'.",
        fix: "Server data needs caching, staleness and invalidation — TanStack Query's purpose. Zustand is for client state like the theme.",
      },
    ],
    debug: {
      prompt: "After editing an event, the list shows the new title but the 'Featured' sidebar still shows the old one. Explain the architectural cause and fix it.",
      language: "tsx",
      buggyCode: `const useFeaturedStore = create<{ featured: EventDto[]; setFeatured: (e: EventDto[]) => void }>()(
  (set) => ({ featured: [], setFeatured: (featured) => set({ featured }) }),
);

function Sidebar() {
  const { data } = useQuery({ queryKey: ["events"], queryFn: () => getEvents() });
  const featured = useFeaturedStore((s) => s.featured);
  const setFeatured = useFeaturedStore((s) => s.setFeatured);
  useEffect(() => {
    if (data && featured.length === 0) setFeatured(data.slice(0, 3));
  }, [data, featured.length, setFeatured]);
  return <ul>{featured.map((e) => <li key={e.id}>{e.title}</li>)}</ul>;
}`,
      hint: "How many sources of truth are there for the featured events?",
      fixedCode: `function Sidebar() {
  const { data: featured = [] } = useQuery({
    queryKey: ["events"],
    queryFn: ({ signal }) => getEvents(signal),
    select: (events) => events.slice(0, 3), // derived from the cache, never copied
  });
  return <ul>{featured.map((e) => <li key={e.id}>{e.title}</li>)}</ul>;
}`,
      explanation: "Server data was copied into a Zustand store once, creating a second source of truth that invalidation never touches. Derive the featured list from the query (select or a plain slice in render) so it refreshes together with ['events'].",
    },
    challenge: {
      prompt: "For a CampusEvents 'My Bookings' page, decide where each lives and justify briefly: (1) the bookings list, (2) a 'show cancelled' toggle that should survive refresh, (3) the number of upcoming bookings, (4) the logged-in user's name in the navbar, (5) the cancel-confirmation dialog's open flag, (6) the review text being typed.",
      language: "text",
      hints: ["Use the decision guide in order: server-owned? derivable? URL? form? shared?"],
      solution: `1. TanStack Query — server-owned; key ['bookings','mine', userId]; invalidate after cancel.
2. URL search param (?showCancelled=1) — survives refresh and is shareable.
3. Derived — bookings.filter(b => new Date(b.eventStartDate) > new Date()).length during render.
4. Zustand auth store — client copy of session info needed across the app.
5. Local useState in the bookings page/dialog — only that component cares.
6. Form state — React Hook Form or local useState until submitted (then a mutation).`,
      explanation: "Each answer follows from ownership and scope. Nothing is stored twice; the count is computed; the toggle uses the URL because it should persist and be linkable.",
    },
    examQuestions: [
      {
        question: "(Mock D4a) A shopping app: theme available across components; product info from an API; product info cached; refreshed after updates; avoid unnecessary requests. Identify which requirements Zustand and TanStack Query should handle and explain. (4 marks)",
        answer: "**Zustand:** the selected theme — it is client-side UI state, owned by the browser and needed by many components; a Zustand store exposes it through a hook with selectors without prop drilling (and can persist it). **TanStack Query:** fetching product information, caching it, refreshing after updates and avoiding unnecessary requests — these are server-state concerns. TanStack Query caches results by query key, shares them between components, deduplicates requests, uses staleTime to avoid refetching fresh data, and invalidateQueries after a successful update mutation refreshes the products. The tools are complementary.",
        marks: 4,
      },
      {
        question: "(Mock B14) True or False: TanStack Query and Zustand are interchangeable tools designed exclusively for storing server responses.",
        answer: "**False.** TanStack Query is for server state; Zustand is a general client-state store. They solve different problems and are commonly used together.",
        marks: 1,
      },
      {
        question: "Why should a cart total not be stored as its own piece of state?",
        answer: "It is derived from the items; storing it creates a second source of truth that must be updated on every change and can become inconsistent. Compute it (e.g. items.reduce) during render or in a selector.",
        marks: 2,
      },
      {
        question: "Give one advantage of storing search filters in URL search parameters.",
        answer: "They survive refresh and can be shared/bookmarked, and back/forward navigation restores previous filters (useSearchParams).",
        marks: 1,
      },
    ],
    revision: [
      "Local → useState; shared client → Zustand; server → TanStack Query.",
      "URL state (ids, filters, page) → useParams / useSearchParams.",
      "Derived state → compute, don't store.",
      "Form state → React Hook Form/local until submitted.",
      "Persistent preferences → Zustand persist.",
      "D4a: theme = Zustand; fetch/cache/refresh/avoid requests = TanStack Query.",
      "Never mirror query data into another store.",
    ],
    visualizers: ["state-decision"],
  },

  /* ================================================================== */
  /* m13-architecture                                                    */
  /* ================================================================== */
  {
    id: "arch-project-structure",
    moduleId: "m13-architecture",
    title: "Project structure: Vite, scripts, env config and folders",
    summary:
      "A maintainable React app separates responsibilities — pages, components, hooks, services, stores, types — but stays proportionate: add a folder only when it has a clear job.",
    priority: "P1",
    minutes: 25,
    objectives: [
      "Explain what Vite provides and what the package.json scripts do.",
      "Configure environment variables with VITE_ prefixes and understand that they are public.",
      "Describe the responsibility of each common folder and the Service → Hook → Component flow.",
      "Compare type-based and feature-based structures and apply 'keep it proportionate' (Week05 slides 15–16).",
    ],
    prerequisites: ["react-custom-hooks", "tq-server-state"],
    sources: [
      {
        kind: "university",
        label: "Week 05 — Routing, Forms, Validation, CRUD",
        detail: "Slide 15 (a maintainable structure separates responsibilities), slide 16 (a small, realistic project structure; keep it proportionate), slide 17 (trace the data flow)",
      },
      WEEK03_SLIDE28,
      { kind: "mock", label: "MOCK ICT", detail: "A19 (benefit of a dedicated service module), D2c" },
      {
        kind: "supplementary",
        label: "Vite — Getting Started",
        url: "https://vite.dev/guide/",
      },
      {
        kind: "supplementary",
        label: "Vite — Env Variables and Modes",
        url: "https://vite.dev/guide/env-and-mode",
      },
    ],
    why: `As CampusEvents grows from one page to auth, bookings, reviews and admin CRUD, a flat \`src/\` becomes a maze: fetch calls inside JSX, duplicated URL strings, types copied between files. Week 05 slide 15 states the goal: *each module should have a clear reason to change*. Slide 16 adds the counterweight: *keep it proportionate* — don't build a framework you don't need. Mock A19 and D2c test the service-module idea directly.`,
    analogy: `A restaurant kitchen has stations: **front-of-house** (pages) talks to customers, **chefs** (components) assemble dishes, the **pantry manager** (services) deals with suppliers (the API), and **recipes** (types/schemas) define what each dish must contain. A food truck doesn't need eight stations — but even it separates the till from the grill.`,
    explain: {
      beginner: `**Vite** is the build tool behind the project. In development it runs a fast server with hot reloading (\`npm run dev\` → \`http://localhost:5173\`, the origin CampusEvents' CORS allows). For production it bundles and minifies your code (\`npm run build\` → \`dist/\`). \`npm run preview\` serves that build locally. Scripts live in \`package.json\`.

**Environment variables** go in \`.env\` files. Only names starting with \`VITE_\` are exposed to your code, via \`import.meta.env.VITE_API_URL\`. They're baked into the bundle, so they're **public** — fine for an API URL, never for secrets.

**Folders (Week 05 slides 15–16):**

- \`pages/\` — route-level views (\`Events.tsx\`, \`EventDetails.tsx\`, \`Login.tsx\`).
- \`components/\` — reusable UI (\`EventCard\`, \`Navbar\`, \`EventForm\`).
- \`hooks/\` — custom hooks managing React state / queries (\`useEvents\`).
- \`services/\` — HTTP/API calls (\`eventService.ts\`): URLs, fetch, \`response.ok\`.
- \`types/\` & \`schemas/\` — data contracts and validation.

As the app grows you may add \`layouts/\` (shared shells with \`<Outlet />\`), \`routes/\` (route config, guards), \`stores/\` (Zustand), \`utils/\` (pure helpers like \`formatPrice\`), \`config/\` (constants such as the API base URL).

**Data flow** (Week 03 slide 28): **Service** talks to the API → **Hook** manages React state → **Component** renders. Each layer has one job, so you can swap \`fetch\` for TanStack Query by changing only the hook.`,
      developer: `**package.json scripts (Vite React-TS template):**

\`\`\`json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview",
    "test": "vitest"
  }
}
\`\`\`

Note \`build\` type-checks first: Vite itself only *strips* types (esbuild) and doesn't report type errors.

**Env files:** \`.env\` (all modes), \`.env.development\`, \`.env.production\`, \`.env.local\` (git-ignored overrides). Type them:

\`\`\`ts
// src/vite-env.d.ts
interface ImportMetaEnv { readonly VITE_API_URL: string }
interface ImportMeta { readonly env: ImportMetaEnv }
\`\`\`

Centralise in \`config/env.ts\` (\`export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5229/api"\`) so services never hard-code URLs.

**Type-based vs feature-based.** Type-based (\`components/\`, \`hooks/\`, \`services/\`) is clear for small apps like the coursework. Feature-based groups everything for one domain together:

\`\`\`text
src/features/events/{components,hooks,api,types}.ts(x)
src/features/bookings/...
src/features/auth/...
src/shared/{components,utils}
\`\`\`

It scales better because a change to "bookings" touches one folder. A hybrid is common: features for domain code, shared folders for generic UI.

**Rules of thumb:** components don't call \`fetch\`; services don't import React; pages compose and handle routing params; stores hold client state only; types are shared, not duplicated.`,
      deep: `**Dependency direction.** A healthy architecture has dependencies pointing *inwards*: pages → components/hooks → services → types/config. Services must not import components; shared UI must not import feature code. ESLint rules (\`import/no-restricted-paths\`, boundaries plugins) can enforce this. Circular imports are a smell that a responsibility is in the wrong layer.

**Colocation vs separation.** Keeping tests, styles and stories next to the component (\`EventCard.tsx\`, \`EventCard.test.tsx\`) reduces hunting. Separating by *reason to change* (Week 05 slide 15) beats separating by file type when the two conflict.

**Barrel files** (\`index.ts\` re-exports) make imports tidy but can hurt tree-shaking and create cycles; use them at feature boundaries only.

**Path aliases** (\`@/features/events\`) require both \`tsconfig\` \`paths\` and a Vite \`resolve.alias\` (or a plugin) — TypeScript resolution and bundler resolution are separate systems.

**Build-time vs runtime config.** \`import.meta.env\` values are replaced at build time; changing the API URL needs a rebuild. Deployments needing runtime configuration fetch a \`/config.json\` at startup instead.

**Proportionality.** Premature abstraction (generic repository layers, a hook factory for every endpoint) costs more than it saves in a small app. Week 05 slide 16 explicitly says "no generic hook framework required yet". Refactor toward structure when duplication or confusion actually appears — the "rule of three" is a decent heuristic.

**Security note:** the \`dist/\` bundle is public. Don't ship source maps with sensitive comments, and remember lazy-loaded admin chunks can still be downloaded by anyone.`,
    },
    mechanism: `\`\`\`text
 Week 05 slide 16 (extended)              Data flow (Week 03 slide 28 / Week 05 slide 17)
 src/
 ├─ main.tsx      providers (QueryClient, Router)
 ├─ App.tsx       routes                        user clicks "Save" on EventNew page
 ├─ config/       env.ts (VITE_API_URL)                 │
 ├─ layouts/      MainLayout (<Outlet/>)                ▼
 ├─ pages/        Events, EventDetails, Login   pages/EventNew.tsx   (intent, routing)
 ├─ components/   EventCard, EventForm, Navbar          │ uses
 ├─ hooks/        useEvents, useCreateEvent             ▼
 ├─ services/     apiClient, eventService       hooks/useCreateEvent.ts (React/TanStack state)
 ├─ stores/       authStore, themeStore                 │ calls
 ├─ schemas/      eventSchema (Zod)                     ▼
 ├─ types/        Event.ts                      services/eventService.ts (URL, fetch, response.ok)
 └─ utils/        formatPrice.ts                        │ HTTP
                                                        ▼
  dependencies point DOWN this list ────►       CampusEvents API  POST /api/events → 201
\`\`\``,
    simpleExample: {
      title: "config/env.ts + services/eventService.ts",
      language: "ts",
      code: `// config/env.ts — the ONLY place that reads import.meta.env
export const API_URL: string = import.meta.env.VITE_API_URL ?? "http://localhost:5229/api";

// .env.development (public values only!)
// VITE_API_URL=http://localhost:5229/api

// services/eventService.ts — knows URLs, fetch and response.ok; no React
import { API_URL } from "../config/env";
import type { EventDto } from "../types/Event";

export async function getEvents(signal?: AbortSignal): Promise<EventDto[]> {
  const res = await fetch(\`\${API_URL}/events\`, { signal });
  if (!res.ok) throw new Error(\`Failed to load events (\${res.status})\`);
  return (await res.json()) as EventDto[];
}

export async function getEvent(id: number, signal?: AbortSignal): Promise<EventDto> {
  const res = await fetch(\`\${API_URL}/events/\${id}\`, { signal });
  if (!res.ok) throw new Error(\`Failed to load event \${id} (\${res.status})\`);
  return (await res.json()) as EventDto;
}`,
      walkthrough: [
        { lines: "2", text: "One source for the base URL; a fallback keeps local development working." },
        { lines: "4-5", text: "VITE_ values are bundled — public configuration only." },
        { lines: "8-9", text: "Services depend on config and types, never on React." },
        { lines: "11-21", text: "Every endpoint function handles URL construction and HTTP errors in one place (mock A19)." },
      ],
    },
    realExample: {
      title: "Feature-based layout for the events feature",
      language: "ts",
      code: `// src/features/events/api.ts
import { apiFetch } from "../../shared/api/apiClient";
import type { EventDto, EventFormData } from "./types";

export const eventsApi = {
  list: (signal?: AbortSignal) => apiFetch<EventDto[]>("/events", { signal }),
  get: (id: number, signal?: AbortSignal) => apiFetch<EventDto>(\`/events/\${id}\`, { signal }),
  create: (data: EventFormData) =>
    apiFetch<EventDto>("/events", { method: "POST", body: JSON.stringify(data) }),
  update: (id: number, data: EventFormData) =>
    apiFetch<void>(\`/events/\${id}\`, { method: "PUT", body: JSON.stringify(data) }),
  remove: (id: number) => apiFetch<void>(\`/events/\${id}\`, { method: "DELETE" }),
};

// src/features/events/queries.ts
import { useQuery } from "@tanstack/react-query";

export const eventKeys = {
  all: ["events"] as const,
  detail: (id: number) => ["events", id] as const,
};

export const useEvents = () =>
  useQuery({ queryKey: eventKeys.all, queryFn: ({ signal }) => eventsApi.list(signal) });

export const useEvent = (id: number) =>
  useQuery({
    queryKey: eventKeys.detail(id),
    queryFn: ({ signal }) => eventsApi.get(id, signal),
    enabled: Number.isInteger(id) && id > 0,
  });

// src/features/events/index.ts — the feature's public surface
// export { useEvents, useEvent, eventKeys } from "./queries";
// export { EventCard } from "./components/EventCard";
// export type { EventDto } from "./types";`,
      walkthrough: [
        { lines: "1-13", text: "All event endpoints in one object; PUT/DELETE typed void because CampusEvents returns 204." },
        { lines: "15-30", text: "Query hooks and keys live next to the API they wrap." },
        { lines: "32-35", text: "A small index file defines what other features may import." },
      ],
    },
    mistakes: [
      {
        mistake: "Calling fetch directly inside JSX components across the app.",
        fix: "Put HTTP in services; components consume hooks (Service → Hook → Component).",
      },
      {
        mistake: "Hard-coding http://localhost:5229 in many files.",
        fix: "Read VITE_API_URL once in config and import it.",
      },
      {
        mistake: "Putting secrets in .env as VITE_ variables because .env is git-ignored.",
        fix: "VITE_ values ship to every browser. Secrets stay on a server.",
      },
      {
        mistake: "Creating dozens of empty folders and abstraction layers on day one.",
        fix: "Keep it proportionate (Week05 slide 16): add files when they have a clear job.",
      },
      {
        mistake: "Assuming `vite build` catches type errors.",
        fix: "Vite strips types; run tsc (the template's build script does tsc -b first).",
      },
    ],
    debug: {
      prompt: "`import.meta.env.API_URL` is always undefined and the app calls `undefined/events`. Fix the configuration and code.",
      language: "ts",
      buggyCode: `// .env
API_URL=http://localhost:5229/api

// eventService.ts
const res = await fetch(import.meta.env.API_URL + "/events");`,
      hint: "Which variables does Vite expose to client code?",
      fixedCode: `// .env
VITE_API_URL=http://localhost:5229/api

// config/env.ts
export const API_URL: string = import.meta.env.VITE_API_URL ?? "http://localhost:5229/api";

// eventService.ts
import { API_URL } from "../config/env";
const res = await fetch(\`\${API_URL}/events\`);
// Restart the dev server after editing .env files.`,
      explanation: "Vite only exposes variables prefixed with VITE_ to client code (to avoid leaking server secrets by accident). The dev server reads .env at start-up, so restart it after changes. Centralising the value avoids repeating the mistake in every service.",
    },
    challenge: {
      prompt: "Given this flat src/ — App.tsx, EventCard.tsx, Events.tsx, EventDetails.tsx, Login.tsx, useEvents.ts, eventService.ts, authStore.ts, Event.ts, formatPrice.ts, MainLayout.tsx, eventSchema.ts — propose a proportionate folder structure and give one sentence per folder explaining its reason to change.",
      language: "text",
      hints: ["Follow Week 05 slide 16 and add only the folders these files need."],
      solution: `src/
  App.tsx                  routes
  layouts/MainLayout.tsx   changes when the shared shell (nav/footer) changes
  pages/Events.tsx, EventDetails.tsx, Login.tsx
                           change when a route-level screen's composition changes
  components/EventCard.tsx changes when reusable presentation changes
  hooks/useEvents.ts       changes when React/query state logic changes
  services/eventService.ts changes when the API (URLs, methods, status handling) changes
  stores/authStore.ts      changes when shared client state (session) changes
  types/Event.ts           changes when the data contract changes
  schemas/eventSchema.ts   changes when validation rules change
  utils/formatPrice.ts     changes when a pure helper changes`,
      explanation: "Each folder has one reason to change, and no folder exists without a file that needs it — Week 05's 'keep it proportionate'.",
    },
    examQuestions: [
      {
        question: "(Mock A19) What is the main benefit of separating API calls into a dedicated service module?",
        answer: "**B** — it separates data-access logic from presentation components.",
        marks: 1,
      },
      {
        question: "(Mock D2c) Explain why an API service module can be beneficial when several components need to access the same endpoint. (2 marks)",
        answer: "The URL, headers, error handling (response.ok) and parsing are written once and reused, so components stay focused on rendering; changes to the endpoint or auth header are made in one place, reducing duplication and bugs, and the functions are easier to test/mock.",
        marks: 2,
      },
      {
        question: "Why is it unsafe to place a secret API key in VITE_SECRET_KEY?",
        answer: "Vite inlines VITE_-prefixed variables into the client bundle at build time, so anyone can read them in the downloaded JavaScript.",
        marks: 2,
      },
    ],
    revision: [
      "Vite: dev server (5173), build to dist/, preview; build script runs tsc first.",
      "Only VITE_ env vars reach client code — and they are public.",
      "pages = routes; components = reusable UI; hooks = React state; services = HTTP; types/schemas = contracts.",
      "Service → Hook → Component; swap fetch for TanStack Query by changing only the hook.",
      "Feature-based structure scales; type-based is fine for small apps.",
      "Keep it proportionate (Week05 slide 16).",
    ],
    visualizers: ["architecture-flow"],
  },
  {
    id: "arch-search-filter-pagination",
    moduleId: "m13-architecture",
    title: "Search, filtering, sorting and pagination",
    summary:
      "Filter on the client for small datasets and on the server for large ones; keep filters in the URL, debounce search input, and paginate with TanStack Query's placeholderData: keepPreviousData.",
    priority: "P1",
    minutes: 30,
    objectives: [
      "Choose between client-side and server-side filtering/sorting/pagination.",
      "Store search, filter, sort and page in URL search params (mock A18).",
      "Debounce search input with a small custom hook.",
      "Paginate with TanStack Query using placeholderData: keepPreviousData and isPlaceholderData.",
    ],
    prerequisites: ["tq-usequery-keys", "state-kinds", "react-custom-hooks"],
    sources: [
      {
        kind: "supplementary",
        label: "Lecture 9 (search, filtering, pagination) was not supplied",
        detail: "This lesson is supplementary; it builds on Week 05 routing and the MOCK ICT A18 (useSearchParams).",
      },
      { kind: "mock", label: "MOCK ICT", detail: "A18 (useSearchParams), A1/C1 (reduce), B3 (find vs filter)" },
      {
        kind: "supplementary",
        label: "TanStack Query v5 docs — Paginated / Lagged Queries",
        url: "https://tanstack.com/query/latest/docs/framework/react/guides/paginated-queries",
      },
      {
        kind: "supplementary",
        label: "React Router — useSearchParams",
        url: "https://reactrouter.com/api/hooks/useSearchParams",
      },
      {
        kind: "supplementary",
        label: "MDN — URLSearchParams",
        url: "https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams",
      },
    ],
    why: `An events page with 20 items can filter in the browser instantly. One with 20,000 can't download everything — it must ask the server for "page 3 of jazz events in London sorted by date". Users also expect the filters to survive refresh, the back button to work and links to be shareable. And firing a request for every keystroke in a search box is wasteful. These patterns appear in almost every coursework project.`,
    analogy: `**Client-side filtering** is bringing the whole library home and searching your living room — fast once it's there, impossible for a big library. **Server-side filtering** is asking the librarian for "page 3 of jazz books" — the librarian does the work and hands you only what you need. **Debouncing** is waiting until the customer stops talking before running to the shelves. **keepPreviousData** is keeping the current page in your hands until the next one arrives, instead of standing there empty-handed.`,
    explain: {
      beginner: `**Client-side** filtering/sorting/pagination: fetch all items once, then use array methods during render:

\`\`\`ts
const visible = events
  .filter((e) => e.title.toLowerCase().includes(search.toLowerCase()))
  .sort((a, b) => a.startDate.localeCompare(b.startDate))
  .slice((page - 1) * pageSize, page * pageSize);
\`\`\`

Good when the dataset is small (tens to a few hundred items). Note \`sort\` mutates arrays — the \`filter\` result is a new array, so sorting it is safe here; never sort query data in place.

**Server-side**: send the criteria as query-string parameters (\`GET /api/events?search=jazz&page=2&pageSize=10&sort=date\`) and the server returns just that slice (often with a total count). Needed for large datasets. (The supplied CampusEvents API returns all events from \`GET /api/events\`; server-side parameters would need backend support.)

**Put filters in the URL** with React Router's \`useSearchParams\` (mock A18). Then refresh, back/forward and shared links all keep the same view.

**Debounce search**: wait ~300 ms after the user stops typing before using the value for a request.

**Pagination with TanStack Query**: include \`page\` in the query key (\`['events', { page }]\`). Each page is cached separately. Add \`placeholderData: keepPreviousData\` so the old page stays on screen while the next one loads, instead of flashing a spinner.`,
      developer: `**URL as the source of truth:**

\`\`\`ts
const [params, setParams] = useSearchParams();
const search = params.get("search") ?? "";
const page = Math.max(1, Number(params.get("page") ?? "1") || 1);
const sort = params.get("sort") === "price" ? "price" : "date"; // validate untrusted URL input
\`\`\`

Update with a functional setter so other params are preserved, and reset the page when filters change:

\`\`\`ts
setParams((prev) => { const next = new URLSearchParams(prev); next.set("search", value); next.delete("page"); return next; }, { replace: true });
\`\`\`

**Debounce hook:**

\`\`\`ts
function useDebouncedValue<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => { const id = setTimeout(() => setDebounced(value), delay); return () => clearTimeout(id); }, [value, delay]);
  return debounced;
}
\`\`\`

Keep the input responsive with local state, and push the *debounced* value into the URL/query key.

**TanStack Query v5 pagination:**

\`\`\`ts
import { keepPreviousData, useQuery } from "@tanstack/react-query";
const q = useQuery({ queryKey: ["events", { search, page, sort }], queryFn: …, placeholderData: keepPreviousData });
\`\`\`

\`q.isPlaceholderData\` is true while showing the previous page — disable "Next" then. (v4 used \`keepPreviousData: true\`; v5 replaced it with this \`placeholderData\` helper.) Prefetch the next page with \`queryClient.prefetchQuery\` for instant navigation.

**Sorting** on dates: compare ISO strings with \`localeCompare\` or \`Date\` timestamps; on numbers \`a.price - b.price\`. Use \`toSorted()\` (ES2023) or copy first to avoid mutating.`,
      deep: `**Offset vs cursor pagination.** Offset (\`page\`/\`pageSize\` or \`skip\`/\`take\`) is simple and allows jumping to page N, but rows inserted/deleted between requests cause duplicates or gaps, and large offsets are slow in databases. Cursor (keyset) pagination (\`?after=<lastId>\`) is stable and efficient for feeds and pairs with \`useInfiniteQuery\` (\`getNextPageParam\`, \`fetchNextPage\`) for "load more"/infinite scroll — at the cost of not jumping to arbitrary pages.

**Races and cancellation.** Because the debounced search term is in the query key, each term is a separate query; TanStack Query ignores results for keys no longer observed and aborts via \`signal\` if consumed — eliminating the "older response overwrites newer" bug of manual implementations.

**Cache growth.** Each search/page combination creates a cache entry; inactive ones are garbage-collected after \`gcTime\`. A sensible \`staleTime\` makes back-and-forth paging free.

**URL hygiene.** Remove default values (\`page=1\`, empty search) to keep URLs canonical; use \`replace\` for keystroke-driven updates so history isn't flooded, but \`push\` for deliberate page changes so Back works intuitively. Treat URL params as **untrusted input** — validate numbers and enums, clamp page ranges, and never inject them into HTML.

**Accessibility.** Announce result counts with an \`aria-live="polite"\` region, give the search input a label, use \`<nav aria-label="Pagination">\` with \`aria-current="page"\`, and keep focus sensible after page changes.

**Client vs server sorting must agree with pagination**: sorting only the current page client-side gives wrong global order. Whatever does pagination must also do sorting and filtering.`,
    },
    mechanism: `\`\`\`text
 user types "jaz" ─► local input state (instant)
                        │ useDebouncedValue(300ms)  — timer reset on every keystroke
                        ▼
 setSearchParams({ search: "jazz", page: removed }, { replace: true })
                        │ URL: /events?search=jazz&sort=date
                        ▼
 useQuery({ queryKey: ['events', { search:'jazz', page:1, sort:'date' }],
            placeholderData: keepPreviousData })
     ├─ cache hit (fresh)? → render immediately, no request
     └─ miss → fetch /api/events?search=jazz&page=1&sort=date
               while pending: show PREVIOUS data (isPlaceholderData = true)
                        ▼
 click "Next" → setSearchParams(page=2)  (push: Back returns to page 1)
             → new key ['events',{...page:2}] → cached separately
\`\`\``,
    simpleExample: {
      title: "Client-side search + sort + paginate, state in the URL",
      language: "tsx",
      code: `import { useSearchParams } from "react-router-dom";
import type { EventDto } from "../types/Event";

const PAGE_SIZE = 6;

export function EventBrowser({ events }: { events: EventDto[] }) {
  const [params, setParams] = useSearchParams();
  const search = params.get("search") ?? "";
  const sort = params.get("sort") === "price" ? "price" : "date";
  const page = Math.max(1, Number(params.get("page")) || 1);

  const filtered = events
    .filter((e) => e.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => (sort === "price" ? a.price - b.price : a.startDate.localeCompare(b.startDate)));
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const visible = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const update = (key: string, value: string) =>
    setParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) next.set(key, value); else next.delete(key);
      if (key !== "page") next.delete("page"); // new filter → back to page 1
      return next;
    });

  return (
    <section>
      <input aria-label="Search" value={search} onChange={(e) => update("search", e.target.value)} />
      <select aria-label="Sort" value={sort} onChange={(e) => update("sort", e.target.value)}>
        <option value="date">Date</option>
        <option value="price">Price</option>
      </select>
      <p aria-live="polite">{filtered.length} events</p>
      <ul>{visible.map((e) => <li key={e.id}>{e.title}</li>)}</ul>
      <button disabled={current <= 1} onClick={() => update("page", String(current - 1))}>Previous</button>
      <span> Page {current} of {pageCount} </span>
      <button disabled={current >= pageCount} onClick={() => update("page", String(current + 1))}>Next</button>
    </section>
  );
}`,
      walkthrough: [
        { lines: "8-10", text: "Read and validate URL params — they're strings typed by users." },
        { lines: "12-14", text: "filter returns a new array, so sort doesn't mutate the original prop." },
        { lines: "15-17", text: "Clamp the page so a stale ?page=99 still shows something sensible." },
        { lines: "19-25", text: "Functional update preserves other params; changing a filter resets to page 1." },
        { lines: "34", text: "aria-live announces result counts to screen reader users." },
      ],
    },
    realExample: {
      title: "Server-side search + pagination with debounce and keepPreviousData",
      language: "tsx",
      code: `import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

interface Page<T> { items: T[]; totalCount: number }
interface EventSummary { id: number; title: string }

const API = import.meta.env.VITE_API_URL ?? "http://localhost:5229/api";
const PAGE_SIZE = 10;

async function fetchEventPage(search: string, page: number, signal: AbortSignal): Promise<Page<EventSummary>> {
  const qs = new URLSearchParams({ page: String(page), pageSize: String(PAGE_SIZE) });
  if (search) qs.set("search", search);
  const res = await fetch(\`\${API}/events?\${qs}\`, { signal }); // assumes a paginated endpoint
  if (!res.ok) throw new Error(\`Failed to load events (\${res.status})\`);
  return (await res.json()) as Page<EventSummary>;
}

function useDebouncedValue<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

export function EventSearchPage() {
  const [params, setParams] = useSearchParams();
  const page = Math.max(1, Number(params.get("page")) || 1);
  const [input, setInput] = useState(params.get("search") ?? "");
  const search = useDebouncedValue(input.trim(), 300);

  useEffect(() => {
    setParams((prev) => {
      const next = new URLSearchParams(prev);
      if ((prev.get("search") ?? "") === search) return prev; // unchanged: keep page
      if (search) next.set("search", search); else next.delete("search");
      next.delete("page");
      return next;
    }, { replace: true });
  }, [search, setParams]);

  const { data, isPending, isError, error, isFetching, isPlaceholderData } = useQuery({
    queryKey: ["events", "search", { search, page }],
    queryFn: ({ signal }) => fetchEventPage(search, page, signal),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });

  const pageCount = data ? Math.max(1, Math.ceil(data.totalCount / PAGE_SIZE)) : 1;
  const goTo = (p: number) =>
    setParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("page", String(p));
      return next;
    });

  return (
    <section>
      <input aria-label="Search events" value={input} onChange={(e) => setInput(e.target.value)} />
      {isFetching && <small> Updating…</small>}
      {isPending ? (
        <p>Loading…</p>
      ) : isError ? (
        <p role="alert">{error.message}</p>
      ) : (
        <ul style={{ opacity: isPlaceholderData ? 0.6 : 1 }}>
          {data.items.map((e) => <li key={e.id}>{e.title}</li>)}
        </ul>
      )}
      <nav aria-label="Pagination">
        <button disabled={page <= 1} onClick={() => goTo(page - 1)}>Previous</button>
        <span aria-current="page"> {page} / {pageCount} </span>
        <button disabled={isPlaceholderData || page >= pageCount} onClick={() => goTo(page + 1)}>Next</button>
      </nav>
    </section>
  );
}`,
      walkthrough: [
        { lines: "11-17", text: "Service builds the query string with URLSearchParams (safe encoding). The paginated response shape is an assumption — the supplied API returns a plain array." },
        { lines: "19-26", text: "Debounce: each keystroke resets the timer; cleanup cancels the previous one." },
        { lines: "31-32", text: "Input is local (instant typing); the debounced value drives the URL and query." },
        { lines: "34-42", text: "Sync the debounced term to the URL with replace, resetting the page only when the term actually changed." },
        { lines: "44-49", text: "Key includes search and page; keepPreviousData keeps the old page visible during loading." },
        { lines: "71", text: "Disable Next while showing placeholder data so users don't skip pages blindly." },
      ],
    },
    mistakes: [
      {
        mistake: "Keeping search/page in useState so refresh and shared links lose them.",
        fix: "Use useSearchParams as the source of truth for view state.",
      },
      {
        mistake: "Sending a request on every keystroke.",
        fix: "Debounce the term (~300 ms) and put the debounced value in the query key.",
      },
      {
        mistake: "Forgetting page in the query key — every page shows page 1's cached data.",
        fix: "Key: ['events', { search, page }].",
      },
      {
        mistake: "Using v4 `keepPreviousData: true` in v5.",
        fix: "v5: placeholderData: keepPreviousData (imported from @tanstack/react-query).",
      },
      {
        mistake: "Sorting query data in place: data.sort(...).",
        fix: "sort mutates; copy first ([...data].sort or data.toSorted) — never mutate cached data.",
      },
      {
        mistake: "Not resetting to page 1 when the filter changes.",
        fix: "Delete the page param whenever search/filter/sort changes.",
      },
    ],
    debug: {
      prompt: "Every page change flashes 'Loading…' and empties the list, and the sort order of the shared events list changes on other pages too. Fix both.",
      language: "tsx",
      buggyCode: `const { data, isPending } = useQuery({
  queryKey: ["events", page],
  queryFn: () => fetchEventPage(page),
});
if (isPending) return <p>Loading…</p>;
const sorted = data.items.sort((a, b) => a.title.localeCompare(b.title));`,
      hint: "What does the query return while a new key loads? Does sort return a new array?",
      fixedCode: `import { keepPreviousData, useQuery } from "@tanstack/react-query";

const { data, isPending, isPlaceholderData } = useQuery({
  queryKey: ["events", { page }],
  queryFn: ({ signal }) => fetchEventPage(page, signal),
  placeholderData: keepPreviousData, // show previous page while the next loads
});
if (isPending) return <p>Loading…</p>; // now only on the very first load
const sorted = [...data.items].sort((a, b) => a.title.localeCompare(b.title)); // copy, don't mutate cache`,
      explanation: "A new page is a new key with no data, so status returns to 'pending'. keepPreviousData supplies the previous key's data as placeholder (status stays 'success', isPlaceholderData true). Array.prototype.sort mutates in place, which corrupted the cached array shared with other components; copy before sorting.",
    },
    challenge: {
      prompt: "Write a pure function `paginate<T>(items, page, pageSize)` returning `{ items, page, pageCount, hasPrev, hasNext }`, clamping invalid pages (NaN, < 1, > pageCount).",
      starterCode: `export interface PageResult<T> {
  items: T[];
  page: number;
  pageCount: number;
  hasPrev: boolean;
  hasNext: boolean;
}

export function paginate<T>(items: readonly T[], page: number, pageSize: number): PageResult<T> {
  // TODO
}`,
      language: "ts",
      hints: [
        "pageCount = max(1, ceil(length / pageSize)).",
        "Use Number.isFinite to catch NaN; Math.trunc for decimals.",
        "slice((page - 1) * pageSize, page * pageSize).",
      ],
      solution: `export interface PageResult<T> {
  items: T[];
  page: number;
  pageCount: number;
  hasPrev: boolean;
  hasNext: boolean;
}

export function paginate<T>(items: readonly T[], page: number, pageSize: number): PageResult<T> {
  const size = Math.max(1, Math.trunc(pageSize) || 1);
  const pageCount = Math.max(1, Math.ceil(items.length / size));
  const requested = Number.isFinite(page) ? Math.trunc(page) : 1;
  const current = Math.min(Math.max(1, requested), pageCount);
  return {
    items: items.slice((current - 1) * size, current * size),
    page: current,
    pageCount,
    hasPrev: current > 1,
    hasNext: current < pageCount,
  };
}

// paginate([1,2,3,4,5], 2, 2) → { items: [3,4], page: 2, pageCount: 3, hasPrev: true, hasNext: true }
// paginate([], NaN, 10)       → { items: [], page: 1, pageCount: 1, hasPrev: false, hasNext: false }`,
      explanation: "Pure, testable logic separated from the component; URL-derived input is clamped rather than trusted. readonly T[] documents that the function never mutates its input.",
    },
    examQuestions: [
      {
        question: "(Mock A18) Which React Hook is commonly used to access URL query-string parameters through React Router?",
        answer: "**useSearchParams()** — it returns [searchParams, setSearchParams]; e.g. searchParams.get('page').",
        marks: 1,
      },
      {
        question: "When should filtering be done on the server rather than in the browser? (2 marks)",
        answer: "When the dataset is large (downloading everything would be slow/expensive), when results must be paginated consistently with sorting/filtering, or when data must not all be exposed to the client. The client sends criteria (search, page, sort) as query parameters and receives only the matching slice.",
        marks: 2,
      },
      {
        question: "What does placeholderData: keepPreviousData do in a paginated useQuery?",
        answer: "While the query for a new key (e.g. the next page) is loading, it returns the previous key's data as placeholder so the UI keeps showing the old page instead of a loading state; isPlaceholderData is true until the new data arrives.",
        marks: 2,
      },
      {
        question: "Why debounce a search input that triggers API requests?",
        answer: "To avoid sending a request for every keystroke; the request is sent only after the user pauses (e.g. 300 ms), reducing server load and race conditions while keeping the UI responsive.",
        marks: 1,
      },
    ],
    revision: [
      "Small dataset → filter/sort/slice on the client; large → server-side params.",
      "View state (search, filters, sort, page) belongs in the URL: useSearchParams (A18).",
      "Validate URL params — they're untrusted strings.",
      "Debounce search (~300 ms) with a setTimeout + cleanup hook.",
      "Query key includes every param: ['events', { search, page, sort }].",
      "v5 pagination: placeholderData: keepPreviousData; isPlaceholderData.",
      "Reset page on filter change; never sort cached arrays in place.",
    ],
  },

  /* ================================================================== */
  /* m14-perf-a11y-testing                                               */
  /* ================================================================== */
  {
    id: "perf-memoization",
    moduleId: "m14-perf-a11y-testing",
    title: "Performance: memo, useMemo, useCallback and code splitting",
    summary:
      "Measure first with the React Profiler; then use React.memo to skip re-rendering unchanged children, useMemo/useCallback to keep values stable or cache expensive work, and React.lazy + Suspense to split bundles.",
    priority: "P2",
    minutes: 25,
    objectives: [
      "Explain when React re-renders and when re-renders actually matter.",
      "Use React.memo, useMemo and useCallback correctly and know their costs.",
      "Split route bundles with React.lazy and Suspense.",
      "Profile with React DevTools before and after optimising.",
    ],
    prerequisites: ["react-state-events", "zustand-selectors"],
    sources: [
      {
        kind: "supplementary",
        label: "Lectures 8–11 were not supplied",
        detail: "Performance content is supplementary, based on react.dev.",
      },
      { kind: "supplementary", label: "react.dev — memo", url: "https://react.dev/reference/react/memo" },
      { kind: "supplementary", label: "react.dev — useMemo", url: "https://react.dev/reference/react/useMemo" },
      { kind: "supplementary", label: "react.dev — useCallback", url: "https://react.dev/reference/react/useCallback" },
      { kind: "supplementary", label: "react.dev — lazy", url: "https://react.dev/reference/react/lazy" },
      { kind: "supplementary", label: "react.dev — Profiler", url: "https://react.dev/reference/react/Profiler" },
    ],
    why: `Most React apps are fast enough without tuning — but a long list re-rendering on every keystroke, or a 2 MB bundle that includes the admin dashboard for every visitor, are real problems. The danger is optimising blindly: sprinkling \`useMemo\` everywhere adds complexity and can even slow things down. The professional habit is *measure, fix the bottleneck, measure again*.`,
    analogy: `Re-rendering is a chef **re-reading a recipe**; committing to the DOM is actually **re-cooking the dish**. Re-reading is cheap, and React only re-cooks what changed. \`React.memo\` is a sticky note saying "same ingredients as last time — skip reading". \`useMemo\` is keeping a pre-made sauce instead of making it again. Code splitting is not carrying the wedding-cake equipment to every lunch shift — fetch it only when a wedding is booked.`,
    explain: {
      beginner: `A component **re-renders** when its state changes, when its parent re-renders, or when a context/store value it subscribes to changes. Re-rendering means React calls your function again and compares the result; it only updates the real DOM where something differs. So re-renders are usually cheap.

They matter when a component is **expensive** (big lists, heavy calculations, charts) and re-renders **often** for no reason.

Tools:

- **\`React.memo(Component)\`** — skip re-rendering if the props are the same (shallow comparison) as last time.
- **\`useMemo(() => compute(a, b), [a, b])\`** — remember the result of a calculation until \`a\` or \`b\` change.
- **\`useCallback(fn, [deps])\`** — remember a function so it keeps the same identity between renders (useful when passing callbacks to memoised children).
- **\`React.lazy\` + \`<Suspense>\`** — load a page's code only when it's first needed (**code splitting**), making the initial download smaller.

**Measure first** with the React DevTools **Profiler**: record an interaction, see which components rendered and how long they took. Optimise the slow ones, then measure again.

Note: React 19 projects can also use the **React Compiler**, which adds memoisation automatically; it's optional and not required for this module.`,
      developer: `**memo needs stable props.** Shallow comparison uses \`Object.is\` per prop, so a new object/array/function each render defeats it:

\`\`\`tsx
const EventCard = memo(function EventCard({ event, onBook }: Props) { … });
// parent:
const handleBook = useCallback((id: number) => bookMutation.mutate(id), [bookMutation.mutate]);
<EventCard event={event} onBook={handleBook} />   // event from TanStack Query is referentially stable
\`\`\`

TanStack Query's structural sharing and Zustand selectors both help here: unchanged data keeps the same reference.

**useMemo** for (a) genuinely expensive derivations (filter+sort of thousands of items) or (b) keeping an object/array stable for a memoised child or an effect dependency. Don't wrap trivial expressions.

**Code splitting:**

\`\`\`tsx
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
<Route path="/admin" element={<Suspense fallback={<p>Loading…</p>}><AdminDashboard /></Suspense>} />
\`\`\`

\`lazy\` requires a **default export** and must be declared at module scope (not inside a component, or it remounts every render).

**Cheaper wins first:** move state down (so fewer components re-render), lift expensive children out as \`children\` props, use selective subscriptions (Zustand selectors), stable \`key\`s in lists, and avoid creating QueryClients/stores in render.`,
      deep: `**Cost model.** memo/useMemo aren't free: they store previous values and run comparisons each render. If props change every time anyway, memo is pure overhead. React's docs describe these as performance *optimisations* — code must be correct without them, since React may discard cached values (e.g. during development or for offscreen components).

**Why referential stability propagates.** One unstable value at the top (an inline object in a provider \`value\`, a new array from a selector) invalidates memoisation for an entire subtree. Fix instability at its source rather than memoising leaves.

**StrictMode** double-invokes component functions and effects in development to surface impurity — Profiler timings in dev are therefore inflated; confirm real numbers on a production build (\`vite build && vite preview\`), optionally with the profiling build of react-dom.

**Lists.** For thousands of rows, virtualisation (rendering only visible rows, e.g. TanStack Virtual) beats any memoisation. Transitions (\`useTransition\`, \`useDeferredValue\`) keep typing responsive by marking expensive updates as non-urgent — a good alternative to debouncing for purely client-side filtering.

**Bundles.** Analyse with \`rollup-plugin-visualizer\`; split by route first; preload likely-next chunks on hover (\`import()\` early). Lazy-loading admin pages is a performance measure, *not* access control — the chunk is still downloadable.

**Web Vitals** (LCP, INP, CLS) are the user-facing metrics; INP in particular reflects interaction latency caused by long renders.`,
    },
    mechanism: `\`\`\`text
 state change in <EventsPage>
        │ render phase (call component functions)
        ▼
 <EventsPage> ── re-render
     ├─ <SearchBox>                    re-render (props changed)
     ├─ <EventList items={visible}>    visible = useMemo(filter+sort, [events, search])
     │     └─ <EventCard> × 500        memo + stable props → SKIPPED unless its event changed
     └─ <Footer>  memo, no props       SKIPPED
        │ commit phase: DOM updated only where output differs
        ▼
 Profiler: flamegraph shows which rendered + duration ──► optimise the hot path ──► re-measure

 Code splitting:  main.js (home, events)  ── navigate /admin ──► import('./AdminDashboard') chunk
                  <Suspense fallback> shown until the chunk loads
\`\`\``,
    simpleExample: {
      title: "memo + useCallback + useMemo working together",
      language: "tsx",
      code: `import { memo, useCallback, useMemo, useState } from "react";

interface Item { id: number; title: string; price: number }

const Row = memo(function Row({ item, onSelect }: { item: Item; onSelect: (id: number) => void }) {
  return <li onClick={() => onSelect(item.id)}>{item.title} — £{item.price}</li>;
});

export function ItemList({ items }: { items: Item[] }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<number | null>(null);

  const visible = useMemo(
    () => items.filter((i) => i.title.toLowerCase().includes(query.toLowerCase())),
    [items, query],
  );

  const handleSelect = useCallback((id: number) => setSelected(id), []);

  return (
    <>
      <input aria-label="Filter" value={query} onChange={(e) => setQuery(e.target.value)} />
      <p>Selected: {selected ?? "none"}</p>
      <ul>{visible.map((i) => <Row key={i.id} item={i} onSelect={handleSelect} />)}</ul>
    </>
  );
}`,
      walkthrough: [
        { lines: "5-7", text: "memo: a Row re-renders only if item or onSelect changes (shallow)." },
        { lines: "13-16", text: "Filtering recomputes only when items or query change — not when 'selected' changes." },
        { lines: "18", text: "Stable callback identity; without it every Row would re-render on every parent render." },
        { lines: "23", text: "Selecting an item re-renders ItemList but the memoised Rows are skipped." },
      ],
    },
    realExample: {
      title: "Route-level code splitting in App.tsx",
      language: "tsx",
      code: `import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Events from "./pages/Events";

// Declared at module scope; each import() becomes a separate chunk
const EventDetails = lazy(() => import("./pages/EventDetails"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const NotFound = lazy(() => import("./pages/NotFound"));

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<p role="status">Loading page…</p>}>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:eventId" element={<EventDetails />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}`,
      walkthrough: [
        { lines: "4-5", text: "Pages most visitors need stay in the main bundle." },
        { lines: "8-10", text: "lazy needs a default export; the chunk downloads on first render of that route." },
        { lines: "15", text: "Suspense shows a fallback while a chunk loads; it can also be placed per route or inside the layout." },
        { lines: "21", text: "Lazy-loading AdminDashboard reduces bundle size — it is not a security control; the server still enforces ADMIN." },
      ],
    },
    mistakes: [
      {
        mistake: "Wrapping every value in useMemo/useCallback 'for performance'.",
        fix: "Profile first; memoise expensive computations or values passed to memoised children/effects only.",
      },
      {
        mistake: "Using memo while passing inline objects/functions as props.",
        fix: "New references each render defeat memo — stabilise with useMemo/useCallback or restructure.",
      },
      {
        mistake: "Declaring `const Page = lazy(...)` inside a component.",
        fix: "Declare lazy components at module scope, or state resets and the chunk re-imports on every render.",
      },
      {
        mistake: "Relying on useMemo for correctness (e.g. to run something only once).",
        fix: "useMemo is a cache hint; React may recompute. Use state/refs/effects for semantics.",
      },
      {
        mistake: "Measuring performance in development mode only.",
        fix: "StrictMode and dev checks inflate timings; verify with a production build.",
      },
    ],
    debug: {
      prompt: "EventCard is wrapped in memo, yet the Profiler shows all 300 cards re-rendering every time the user types in an unrelated input. Why, and how do you fix it?",
      language: "tsx",
      buggyCode: `function EventsPage({ events }: { events: EventDto[] }) {
  const [note, setNote] = useState("");
  return (
    <>
      <input value={note} onChange={(e) => setNote(e.target.value)} />
      {events.map((e) => (
        <EventCard key={e.id} event={e} style={{ margin: 8 }} onBook={() => book(e.id)} />
      ))}
    </>
  );
}`,
      hint: "Compare the props EventCard receives on two consecutive renders using Object.is.",
      fixedCode: `const cardStyle = { margin: 8 }; // module-level constant: same reference every render

function EventsPage({ events }: { events: EventDto[] }) {
  const [note, setNote] = useState("");
  const handleBook = useCallback((id: number) => book(id), []);
  return (
    <>
      <input value={note} onChange={(e) => setNote(e.target.value)} />
      {events.map((e) => (
        <EventCard key={e.id} event={e} style={cardStyle} onBook={handleBook} />
      ))}
    </>
  );
}
// EventCard calls onBook(event.id) itself.
// Even simpler: move the note input into its own component so typing doesn't re-render the list.`,
      explanation: "The inline style object and arrow function were new references on every render, so memo's shallow comparison always failed. Hoist constants, stabilise callbacks with useCallback (passing the id as an argument), or — often best — move the fast-changing state into a smaller component so the list's parent doesn't re-render at all.",
    },
    challenge: {
      prompt: "A dashboard computes statistics with `computeStats(bookings)` (≈40 ms for 10,000 bookings) on every render, including when a sidebar toggles. Rewrite the component so stats are recomputed only when bookings change, and the heavy `BookingsChart` is code-split.",
      starterCode: `import BookingsChart from "./BookingsChart";

export function Dashboard({ bookings }: { bookings: Booking[] }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const stats = computeStats(bookings);
  return (
    <div>
      <button onClick={() => setSidebarOpen((o) => !o)}>Toggle sidebar</button>
      {sidebarOpen && <aside>Filters…</aside>}
      <p>Total revenue: £{stats.revenue}</p>
      <BookingsChart data={stats.byDay} />
    </div>
  );
}`,
      language: "tsx",
      hints: ["useMemo with [bookings] as the dependency.", "lazy(() => import('./BookingsChart')) + Suspense."],
      solution: `import { lazy, Suspense, useMemo, useState } from "react";

const BookingsChart = lazy(() => import("./BookingsChart"));

export function Dashboard({ bookings }: { bookings: Booking[] }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const stats = useMemo(() => computeStats(bookings), [bookings]);
  return (
    <div>
      <button onClick={() => setSidebarOpen((o) => !o)}>Toggle sidebar</button>
      {sidebarOpen && <aside>Filters…</aside>}
      <p>Total revenue: £{stats.revenue}</p>
      <Suspense fallback={<p role="status">Loading chart…</p>}>
        <BookingsChart data={stats.byDay} />
      </Suspense>
    </div>
  );
}`,
      explanation: "If bookings comes from TanStack Query, structural sharing keeps its reference stable across unrelated renders, so the memoised stats aren't recomputed when the sidebar toggles. stats.byDay is then also stable, which lets a memoised chart skip re-rendering. The chart library loads only when the dashboard renders.",
    },
    examQuestions: [
      {
        question: "Explain the difference between React.memo and useMemo.",
        answer: "React.memo wraps a **component** so React skips re-rendering it when its props are shallowly equal to the previous props. useMemo is a **hook** that caches the result of a calculation inside a component between renders until its dependencies change.",
        marks: 2,
      },
      {
        question: "What is code splitting and how is it done in React?",
        answer: "Splitting the JavaScript bundle into chunks loaded on demand, reducing the initial download. In React: `const Page = lazy(() => import('./Page'))` rendered inside `<Suspense fallback={...}>`; the chunk is fetched the first time Page renders.",
        marks: 2,
      },
      {
        question: "Why should you profile before adding memoisation?",
        answer: "Most re-renders are cheap; memoisation has its own cost and complexity, and unstable props can make it useless. Profiling (React DevTools Profiler) identifies the components that are actually slow so you optimise the real bottleneck and can verify the improvement.",
        marks: 2,
      },
    ],
    revision: [
      "Re-render = calling the component again; DOM changes only where output differs.",
      "Measure first: React DevTools Profiler, production build for real numbers.",
      "memo skips child re-render when props are shallowly equal.",
      "useMemo caches values; useCallback caches function identity.",
      "Unstable props (inline objects/functions) defeat memo.",
      "lazy + Suspense = route-level code splitting (default export, module scope).",
      "Cheaper wins: move state down, selective subscriptions, stable keys.",
    ],
  },
  {
    id: "testing-vitest-rtl",
    moduleId: "m14-perf-a11y-testing",
    title: "Testing with Vitest and React Testing Library",
    summary:
      "Test behaviour the way users experience it: render, find elements by role/label, interact with user-event, await async UI, and mock the network — including loading, error, form and protected-route cases.",
    priority: "P2",
    minutes: 35,
    objectives: [
      "Write Vitest unit tests for pure functions (describe/it/expect).",
      "Render components with React Testing Library and query by role and label.",
      "Simulate interactions with user-event and await async UI with findBy*/waitFor.",
      "Test loading/error states by mocking fetch or using MSW, with a test QueryClient.",
      "Test forms and protected routes using MemoryRouter.",
    ],
    prerequisites: ["tq-usequery-keys", "zustand-basics", "router-protected-routes"],
    sources: [
      {
        kind: "supplementary",
        label: "Lectures 8–11 were not supplied",
        detail: "Testing content is supplementary, based on official docs.",
      },
      { kind: "supplementary", label: "Vitest — Getting Started", url: "https://vitest.dev/guide/" },
      { kind: "supplementary", label: "Testing Library — About Queries", url: "https://testing-library.com/docs/queries/about" },
      { kind: "supplementary", label: "Testing Library — user-event", url: "https://testing-library.com/docs/user-event/intro" },
      { kind: "supplementary", label: "React Testing Library — Introduction", url: "https://testing-library.com/docs/react-testing-library/intro" },
      { kind: "optional", label: "Mock Service Worker (MSW) docs", url: "https://mswjs.io/docs" },
      {
        kind: "supplementary",
        label: "TanStack Query v5 docs — Testing",
        url: "https://tanstack.com/query/latest/docs/framework/react/guides/testing",
      },
    ],
    why: `Every lesson in this module describes behaviour that's easy to break silently: a 401 that no longer logs out, a form that submits invalid data, a guard that stops redirecting, an error state that never shows. Automated tests catch regressions in seconds. Testing Library's philosophy — *the more your tests resemble the way your software is used, the more confidence they give you* — also pushes you towards accessible markup, because the best queries are by role and label.`,
    analogy: `A good UI test is a **mystery shopper**: they don't inspect the kitchen's internal notes (component state); they walk in, read the labels on the shelves (roles, labels, text), press buttons, and report what they experienced. Mocking the network is hiring an **actor to play the supplier** so the shopper's visit is repeatable.`,
    explain: {
      beginner: `**Vitest** is a test runner that works natively with Vite projects (same config, TypeScript out of the box). Tests look like:

\`\`\`ts
import { describe, it, expect } from "vitest";
describe("formatPrice", () => {
  it("formats pounds", () => {
    expect(formatPrice(12.5)).toBe("£12.50");
  });
});
\`\`\`

Run with \`npx vitest\` (watch mode) or \`vitest run\` (once, for CI).

**React Testing Library (RTL)** renders components into a simulated DOM (jsdom) and gives you queries that find elements **like a user would**:

- \`getByRole("button", { name: /save/i })\` — preferred; matches accessible roles and names.
- \`getByLabelText("Email")\` — form fields by their label.
- \`getByText(...)\` — visible text.
- \`getBy*\` throws if not found; \`queryBy*\` returns \`null\` (use for "should NOT be there"); \`findBy*\` **waits** (returns a promise) for async UI.

**user-event** simulates real interactions: \`const user = userEvent.setup(); await user.type(input, "hello"); await user.click(button);\`

**Async UI**: data loads after a fetch, so use \`await screen.findByText(...)\`.

**Mock the network** so tests don't depend on the real API: replace \`fetch\` with a fake (\`vi.spyOn(globalThis, "fetch")\`) or use **MSW** to intercept requests.

Test the **states users see**: loading, error, empty, success — and the behaviour of forms and protected routes.`,
      developer: `**Setup** (vite.config / vitest config): \`test: { environment: "jsdom", globals: true, setupFiles: "./src/test/setup.ts" }\`; in setup: \`import "@testing-library/jest-dom/vitest";\` for matchers like \`toBeInTheDocument()\`, \`toBeDisabled()\`. RTL auto-cleans up between tests when globals are enabled.

**TanStack Query in tests:** create a fresh client per test and **turn retries off**, otherwise error tests wait through 3 retries with backoff:

\`\`\`tsx
function renderWithClient(ui: React.ReactElement) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>);
}
\`\`\`

**Mocking fetch:** \`vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify(data), { status: 200, headers: { "Content-Type": "application/json" } }))\`; restore with \`vi.restoreAllMocks()\` in \`afterEach\`. For errors: \`new Response(null, { status: 500 })\`.

**MSW** intercepts at the network level with handlers (\`http.get("http://localhost:5229/api/events", () => HttpResponse.json([...]))\`) — your real service code runs unchanged, which makes tests more realistic; \`server.use(...)\` overrides per test.

**Zustand:** stores are module singletons — reset in \`beforeEach\`: \`useAuthStore.setState({ user: null, token: null, expiresAt: null })\`.

**Routes:** wrap in \`<MemoryRouter initialEntries={["/admin"]}>\` with a \`<Routes>\` containing the guard and a \`/login\` route, then assert which page rendered.`,
      deep: `**Query priority** (Testing Library guidance): \`*ByRole\` → \`*ByLabelText\` → \`*ByPlaceholderText\` → \`*ByText\` → \`*ByDisplayValue\` → \`*ByAltText\`/\`*ByTitle\` → \`*ByTestId\` as a last resort. If you can't find an element by role, real assistive-technology users probably can't either — the test is telling you about an accessibility bug.

**Avoid implementation details**: don't assert on state variables, hook internals or CSS classes; don't call component methods. Tests coupled to implementation break on refactors that don't change behaviour, eroding trust.

**Async pitfalls:** forgetting \`await\` on user-event calls or \`findBy*\`; using \`waitFor\` with side effects inside (it may run the callback many times); "act(...) warnings" usually mean an update happened after the test ended — await the UI that results from it.

**Fake timers** (\`vi.useFakeTimers()\`) for debounce/expiry tests; with user-event, pass \`advanceTimers: vi.advanceTimersByTime\` to \`userEvent.setup\`. For JWT expiry logic, inject \`now\` or mock \`Date.now\` via \`vi.setSystemTime\`.

**What to test where:** pure logic (validation, \`isExpired\`, \`paginate\`, reducers/store actions) with fast unit tests; components with RTL integration tests; whole flows across real browsers with Playwright/Cypress (E2E) sparingly. The "testing trophy" emphasises integration tests for frontend apps.

**Security-relevant tests:** 401 → logout + redirect; 403 → message without logout; guard redirects; DOMPurify sanitisation of a known payload; no token in URLs. Remember a frontend test proves the *UX* behaves; it doesn't prove the server enforces access — that needs API tests.`,
    },
    mechanism: `\`\`\`text
 vitest run
   │ for each *.test.ts(x): fresh module scope, jsdom environment
   ▼
 arrange:  vi.spyOn(fetch) / MSW handler ─┐   new QueryClient({ retry:false })
           store.setState(initial)        │   <MemoryRouter initialEntries={['/events']}>
   ▼                                      │
 act:      render(<App/>)  ──► component calls service ──► fetch ──► MOCK response
           user.type / user.click (user-event)
   ▼
 assert:   await screen.findByRole('heading', { name: 'Jazz Night' })   (waits for async)
           expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
   ▼
 cleanup:  unmount, vi.restoreAllMocks(), reset stores
\`\`\``,
    simpleExample: {
      title: "Unit-testing pure auth helpers with Vitest",
      language: "ts",
      code: `import { describe, it, expect, vi, afterEach } from "vitest";
import { isExpired } from "./auth";

describe("isExpired", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("treats a past exp (seconds) as expired", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:10Z"));
    expect(isExpired(1767225600, 0)).toBe(true); // 2026-01-01T00:00:00Z
  });

  it("treats a future exp as valid", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-12-31T23:00:00Z"));
    expect(isExpired(1767225600, 30)).toBe(false);
  });

  it("applies the skew margin", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-12-31T23:59:45Z")); // 15 s before exp
    expect(isExpired(1767225600, 30)).toBe(true);
  });
});`,
      walkthrough: [
        { lines: "2", text: "isExpired(exp, skewSeconds) from the 401/403 lesson." },
        { lines: "5-7", text: "Always restore real timers so other tests aren't affected." },
        { lines: "10-11", text: "setSystemTime makes Date.now() deterministic." },
        { lines: "21-24", text: "Edge case: within the skew window counts as expired." },
      ],
    },
    realExample: {
      title: "Component tests: loading → data, error, form submit, protected route",
      language: "tsx",
      code: `import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import type { ReactElement } from "react";
import { EventList } from "./EventList";
import { LoginForm } from "./LoginForm";
import { RequireAdmin } from "./RequireAdmin";
import { useAuthStore } from "../stores/authStore";

function renderWithProviders(ui: ReactElement, route = "/") {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
    </QueryClientProvider>,
  );
}

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

beforeEach(() => {
  useAuthStore.setState({ user: null, token: null, expiresAt: null });
});
afterEach(() => {
  vi.restoreAllMocks();
});

describe("EventList", () => {
  it("shows loading, then the events", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(jsonResponse([{ id: 1, title: "Jazz Night" }]));
    renderWithProviders(<EventList />);
    expect(screen.getByText(/loading events/i)).toBeInTheDocument();
    expect(await screen.findByText("Jazz Night")).toBeInTheDocument();
    expect(screen.queryByText(/loading events/i)).not.toBeInTheDocument();
  });

  it("shows an error message when the API fails", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(null, { status: 500 }));
    renderWithProviders(<EventList />);
    expect(await screen.findByRole("alert")).toHaveTextContent(/could not load events/i);
  });
});

describe("LoginForm", () => {
  it("submits credentials and stores the user", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      jsonResponse({
        token: "fictional.token.value", expiresAt: "2099-01-01T00:00:00Z", userId: "u1",
        email: "ada@example.com", firstName: "Ada", lastName: "L", role: "USER",
      }),
    );
    const user = userEvent.setup();
    renderWithProviders(<LoginForm />);

    await user.type(screen.getByLabelText(/email/i), "ada@example.com");
    await user.type(screen.getByLabelText(/password/i), "Passw0rd!");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(fetchSpy).toHaveBeenCalledWith(
      expect.stringContaining("/auth/login"),
      expect.objectContaining({ method: "POST" }),
    );
    expect(await screen.findByText(/welcome, ada/i)).toBeInTheDocument();
    expect(useAuthStore.getState().user?.email).toBe("ada@example.com");
  });

  it("shows a validation error and does not call the API for an invalid email", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const user = userEvent.setup();
    renderWithProviders(<LoginForm />);
    await user.type(screen.getByLabelText(/email/i), "not-an-email");
    await user.click(screen.getByRole("button", { name: /sign in/i }));
    expect(await screen.findByText(/valid email/i)).toBeInTheDocument();
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});

describe("RequireAdmin", () => {
  const routes = (
    <Routes>
      <Route path="/login" element={<h1>Login page</h1>} />
      <Route path="/admin" element={<RequireAdmin><h1>Admin dashboard</h1></RequireAdmin>} />
    </Routes>
  );

  it("redirects anonymous users to /login", () => {
    renderWithProviders(routes, "/admin");
    expect(screen.getByRole("heading", { name: /login page/i })).toBeInTheDocument();
  });

  it("shows a not-permitted message for USER", () => {
    useAuthStore.setState({ user: { id: "u1", email: "a@b.c", firstName: "A", role: "USER" }, token: "t", expiresAt: null });
    renderWithProviders(routes, "/admin");
    expect(screen.getByRole("alert")).toHaveTextContent(/don't have access/i);
    expect(screen.queryByRole("heading", { name: /admin dashboard/i })).not.toBeInTheDocument();
  });
});`,
      walkthrough: [
        { lines: "12-19", text: "Fresh QueryClient per test with retry disabled; MemoryRouter controls the starting URL." },
        { lines: "24-29", text: "Reset the Zustand singleton and restore mocks between tests to keep them independent." },
        { lines: "32-38", text: "Loading state is synchronous on first render; findByText waits for the resolved data." },
        { lines: "40-44", text: "Error state: a 500 Response makes the service throw; with retry off the alert appears immediately." },
        { lines: "48-67", text: "Form test: type into labelled fields, click the named button, assert on the request and on what the user sees and the store." },
        { lines: "69-77", text: "Client validation test: the API must not be called — a UX behaviour, not a security guarantee." },
        { lines: "80-97", text: "Guard tests via MemoryRouter: anonymous → login page; USER → message, no admin content." },
      ],
    },
    mistakes: [
      {
        mistake: "Querying by class names or test ids first (container.querySelector('.btn')).",
        fix: "Prefer getByRole/getByLabelText — it mirrors users and catches accessibility problems.",
      },
      {
        mistake: "Using getBy* for content that appears after a fetch.",
        fix: "Use await findBy* (it retries until the element appears or times out).",
      },
      {
        mistake: "Leaving TanStack Query's default retry on in error tests (slow/time-outs).",
        fix: "new QueryClient({ defaultOptions: { queries: { retry: false } } }) per test.",
      },
      {
        mistake: "Forgetting to await user-event calls.",
        fix: "With userEvent.setup(), every interaction returns a promise — await it.",
      },
      {
        mistake: "Store state leaking between tests.",
        fix: "Reset Zustand stores in beforeEach; restore mocks in afterEach.",
      },
      {
        mistake: "Hitting the real API in unit/component tests.",
        fix: "Mock fetch or use MSW so tests are fast, deterministic and offline.",
      },
    ],
    debug: {
      prompt: "This test fails with 'Unable to find an element with the text: Jazz Night', and the error-state test in the same file takes ~7 seconds. Fix both problems.",
      language: "tsx",
      buggyCode: `const client = new QueryClient();

it("renders events", () => {
  vi.spyOn(globalThis, "fetch").mockResolvedValue(
    new Response(JSON.stringify([{ id: 1, title: "Jazz Night" }]), { status: 200 }),
  );
  render(<QueryClientProvider client={client}><EventList /></QueryClientProvider>);
  expect(screen.getByText("Jazz Night")).toBeInTheDocument();
});`,
      hint: "Is the data there synchronously after render? And what are TanStack Query's retry defaults?",
      fixedCode: `function makeClient() {
  return new QueryClient({ defaultOptions: { queries: { retry: false } } });
}

it("renders events", async () => {
  vi.spyOn(globalThis, "fetch").mockResolvedValue(
    new Response(JSON.stringify([{ id: 1, title: "Jazz Night" }]), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }),
  );
  render(<QueryClientProvider client={makeClient()}><EventList /></QueryClientProvider>);
  expect(await screen.findByText("Jazz Night")).toBeInTheDocument();
});`,
      explanation: "The fetch resolves asynchronously, so the text isn't present immediately — findByText waits for it. The shared module-level client also shared cache between tests and kept the default retry: 3 with exponential backoff, making error tests slow; a fresh client per test with retry disabled fixes both isolation and speed.",
    },
    challenge: {
      prompt: "Write a test proving that a 401 from `GET /api/bookings/my-bookings` clears the auth store and shows the login page. Assume `<App />` renders `/bookings` with a guard that redirects to `/login` when there is no user, and that the API client calls `logout()` on 401.",
      starterCode: `import { it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
// TODO: imports for providers, App, store

it("logs out and redirects to login on 401", async () => {
  // arrange: logged-in store, fetch → 401
  // act: render at /bookings
  // assert: login heading appears, store is cleared
});`,
      language: "tsx",
      hints: [
        "useAuthStore.setState({...}) before rendering.",
        "mockResolvedValue(new Response(null, { status: 401 })).",
        "Render with MemoryRouter initialEntries={['/bookings']} and a retry-free QueryClient.",
      ],
      solution: `import { it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import { AppRoutes } from "./AppRoutes"; // the <Routes> tree without BrowserRouter
import { useAuthStore } from "./stores/authStore";

it("logs out and redirects to login on 401", async () => {
  useAuthStore.setState({
    user: { id: "u1", email: "ada@example.com", firstName: "Ada", role: "USER" },
    token: "fictional.expired.token",
    expiresAt: "2099-01-01T00:00:00Z",
  });
  vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(null, { status: 401 }));

  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={["/bookings"]}>
        <AppRoutes />
      </MemoryRouter>
    </QueryClientProvider>,
  );

  expect(await screen.findByRole("heading", { name: /sign in/i })).toBeInTheDocument();
  expect(useAuthStore.getState().token).toBeNull();
  expect(useAuthStore.getState().user).toBeNull();
});`,
      explanation: "Rendering the route tree inside MemoryRouter (rather than an App that contains BrowserRouter) lets the test choose the URL. The test checks user-visible behaviour (login page) and the observable store state — it proves the client handles 401 correctly; server-side enforcement needs separate API tests.",
    },
    examQuestions: [
      {
        question: "Why does React Testing Library recommend getByRole over querying by CSS class?",
        answer: "Role queries find elements the way users and assistive technologies perceive them (role + accessible name), so tests resemble real usage, survive refactors of markup/styling, and fail when accessibility breaks. Class names are implementation details.",
        marks: 2,
      },
      {
        question: "Explain the difference between getBy*, queryBy* and findBy*.",
        answer: "getBy* returns the element or throws if not found (synchronous); queryBy* returns null if not found — used to assert absence; findBy* returns a promise that resolves when the element appears (retrying until a timeout) — used for async UI.",
        marks: 3,
      },
      {
        question: "Why should tests that use TanStack Query create a QueryClient with retry: false?",
        answer: "The default retries failed queries 3 times with exponential backoff, so error-state tests become slow or time out; a fresh client per test also prevents cached data leaking between tests.",
        marks: 2,
      },
    ],
    revision: [
      "Vitest: describe/it/expect, vi.fn/vi.spyOn, fake timers; runs with Vite config.",
      "RTL: render + screen; prefer getByRole / getByLabelText.",
      "getBy throws, queryBy returns null, findBy waits (async).",
      "userEvent.setup() and await every interaction.",
      "Mock fetch (vi.spyOn) or MSW; test loading, error, empty and success states.",
      "Fresh QueryClient with retry: false per test; reset Zustand stores.",
      "MemoryRouter initialEntries to test guards and routes.",
    ],
  },
];
