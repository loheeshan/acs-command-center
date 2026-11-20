import type { Lesson } from "../types";

/**
 * Module m00 (How the Web Works), m01 (HTML & accessibility) and m02 (CSS & Bootstrap).
 * University citations refer to the supplied lecture/tutorial files in extracted-materials/text.
 */

const LEC01 = "Lecture 01 — How the Web Works (Advanced Client-Side Development)";
const LEC02 = "Lecture 02 — React + TypeScript + modern JS";
const WEEK03 = "Week 03 Lecture — Consuming REST APIs with React";
const WEEK05 = "Week 05 Lecture — Routing, Architecture, Forms, Validation, CRUD";
const LEC04_HTML = "Lecture 04 — HTML5 and Core CSS (PDF)";
const LEC04_BS1 = "Lecture 04 — Bootstrap (part 01, PDF)";
const LEC04_BS2 = "Lecture 04 — Bootstrap (part 02, PDF)";
const LEC04_BS3 = "Lecture 04 — Bootstrap (part 03, PDF)";
const BS_DOC = "Bootstrap Explanation for Tutorial Exercise (docx)";
const WEEK4_TUT = "Week 4 Tutorial — Bootstrap Online Shopping Interface (PDF)";
const MOCK = "MOCK ICT paper";

export const webHtmlCssLessons: Lesson[] = [
  /* ================================================================== */
  /* 1. How the web works                                               */
  /* ================================================================== */
  {
    id: "web-how-the-web-works",
    moduleId: "m00-web",
    title: "How the Web Works: IP, DNS, TCP, HTTP and URLs",
    summary:
      "What really happens between typing a URL and seeing a page: DNS lookup, TCP connection, TLS, an HTTP request/response, then parsing and rendering.",
    priority: "P1",
    minutes: 35,
    objectives: [
      "Distinguish the Internet (infrastructure) from the World Wide Web (a service that runs on it).",
      "Explain the roles of IP addresses, DNS, TCP ports and HTTP in loading a web page.",
      "Break a URL into scheme, host, port, path, query string and fragment.",
      "Describe the HTTP request/response cycle and read common status codes (200, 201, 204, 301, 401, 403, 404, 500).",
      "Trace the full pipeline DNS → TCP → TLS → HTTP → HTML parse → DOM/CSSOM → render.",
    ],
    prerequisites: [],
    sources: [
      { kind: "university", label: LEC01, detail: "Slides 4–16 (Internet, IP, TCP, DNS, WWW, web server/browser, HTTP, status codes, URL, request/response)" },
      { kind: "supplementary", label: "MDN — An overview of HTTP", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview" },
      { kind: "supplementary", label: "MDN — How browsers work", url: "https://developer.mozilla.org/en-US/docs/Web/Performance/How_browsers_work" },
    ],
    why: `Every React app you build in this module is just a **client** in a conversation that the web has been having since the 1990s. When a page "doesn't load", an API call "fails", or CORS "blocks" you, the cause lives somewhere in this pipeline: a name that didn't resolve, a port nobody is listening on, a 401 from the server, or a page that loaded but whose JavaScript crashed.

If you can say *which step* failed, you can debug it. That is why Lecture 01 starts here: later topics (fetch, status codes, CORS, JWT) all assume you know what an HTTP request actually is.`,
    analogy: `Think of sending a letter to a company:

- **DNS** is the phone book: you know the company's *name* (www.westminster.ac.uk) and look up its *street address* (an IP address).
- **IP** is the postal system that moves envelopes between addresses.
- **TCP port** is the *department* inside the building (port 80 = web reception, 443 = secure web reception, 25 = mail room).
- **TCP** itself is like recorded delivery: pieces are numbered, acknowledged and re-sent if lost.
- **HTTP** is the *language of the letter*: "GET me the faculty page, please" and the reply "200 OK, here it is".
- **TLS** is sealing the letter in a tamper-evident, opaque envelope (that's the "S" in HTTPS).

The analogy breaks down in one place: a real web conversation happens in milliseconds and the "letter" is split into many small packets.`,
    explain: {
      beginner: `**The Internet is not the Web.** The Internet is the global *network of networks* — the cables, routers and the TCP/IP protocols that let any two computers exchange data. The **World Wide Web** is one *service* that runs on top of it, alongside email (SMTP) and file transfer (FTP).

Every device on the Internet has an **IP address** (like 142.250.180.4). Humans can't remember those, so we use names like www.google.com, and the **DNS** (Domain Name System) translates the name into an IP address. You can try it yourself: run nslookup www.google.com in a terminal.

Once the browser knows the IP address, it opens a **TCP connection** to a particular **port** on that machine. A port number lets many programs share one IP address: web servers traditionally listen on port **80** (HTTP) and **443** (HTTPS).

Then the browser speaks **HTTP**: it sends a *request* ("GET /Campus/Cavendish/Faculty") and the server sends back a *response* with a **status code** (200 OK, 404 Not Found, 500 Internal Server Error…) and usually a body — for a web page, that body is HTML.

Finally the browser reads the HTML, fetches any CSS, JavaScript and images it references, and draws the page on the screen. That last part — turning text into pixels — is called **rendering**.`,
      developer: `An HTTP exchange is plain structured text (HTTP/1.1) or a binary framing of the same concepts (HTTP/2, HTTP/3). A request has a **method**, a **target path**, **headers** and an optional **body**; a response has a **status line**, headers and an optional body.

Useful methods for this module: GET (read), POST (create, not idempotent), PUT (replace/update a known resource, idempotent), PATCH (partial update), DELETE. Useful headers: Content-Type (what format the body is in, e.g. application/json), Accept, Authorization (e.g. Bearer <jwt>), Cache-Control, Location (with 201/301).

Status code families matter more than memorising every code:

| Range | Meaning | Examples |
|---|---|---|
| 2xx | success | 200 OK, 201 Created, 204 No Content (no body!) |
| 3xx | redirection | 301 Moved Permanently, 304 Not Modified |
| 4xx | client problem | 400 Bad Request, 401 not authenticated, 403 authenticated but forbidden, 404 Not Found |
| 5xx | server problem | 500 Internal Server Error |

A URL such as https://api.example.com:8443/api/events?page=2#top decomposes into **scheme** (https), **host** (api.example.com), **port** (8443; defaults to 443 for https and 80 for http when omitted), **path** (/api/events), **query string** (?page=2) and **fragment** (#top). The fragment is **never sent to the server** — it is handled entirely by the browser. In DevTools → Network you can see every request, its headers, status and timing breakdown (DNS, connect, TLS/SSL, waiting, download).`,
      deep: `The full navigation pipeline:

1. **URL parsing** — the browser normalises the input; if it isn't a URL it becomes a search.
2. **DNS resolution** — browser cache → OS cache → configured resolver, which may walk root → TLD (.uk) → authoritative name server. Results are cached according to their TTL, which is why DNS changes "propagate" slowly.
3. **TCP handshake** — SYN, SYN-ACK, ACK: one network round trip before any data flows. TCP gives reliable, ordered delivery; UDP (used by games/streaming and by HTTP/3's QUIC) does not.
4. **TLS handshake** (HTTPS) — the server presents a certificate, both sides agree keys; TLS 1.3 needs one extra round trip. After this, headers *and* body are encrypted in transit (the hostname is still visible to the network via DNS/SNI in most setups).
5. **HTTP request/response** — the server routes the request (in our stack, an ASP.NET Core controller) and returns a response.
6. **Parsing** — the HTML is parsed *incrementally* into the **DOM**. A classic script without defer/async blocks parsing; stylesheets block rendering. CSS is parsed into the **CSSOM**.
7. **Render tree → layout → paint → composite** — DOM + CSSOM combine into a render tree (elements with display: none are excluded), layout computes geometry, paint fills pixels, and the compositor assembles layers on the GPU.

Professional consequences: reduce round trips (keep-alive connections, HTTP/2 multiplexing, CDNs close to users), put scripts at the end or use defer, and understand that "the page loaded" (load event) is not the same as "the React app is usable" — for an SPA the real content often appears only after an *extra* API round trip.`,
    },
    mechanism: `\`\`\`text
 You type: https://www.westminster.ac.uk/Campus/Cavendish/Faculty
   │
   ▼
┌──────────┐  "IP for www.westminster.ac.uk?"   ┌────────────┐
│ Browser  │ ─────────────────────────────────▶ │ DNS server │
│ (client) │ ◀───────────────────────────────── │            │
└────┬─────┘        "it is 203.0.113.10"          └────────────┘
     │ TCP handshake to 203.0.113.10:443  (SYN / SYN-ACK / ACK)
     │ TLS handshake (certificate, keys)  → encrypted channel
     ▼
┌──────────────────────────────┐        ┌──────────────────────┐
│ GET /Campus/Cavendish/Faculty│ ─────▶ │ Web server           │
│ Host: www.westminster.ac.uk  │        │ (listens on 80/443)  │
│ Accept: text/html            │ ◀───── │ HTTP/1.1 200 OK      │
└──────────────────────────────┘        │ Content-Type: text/html
     │                                  │ <html>…</html>       │
     ▼                                  └──────────────────────┘
 HTML bytes ─parse─▶ DOM ─┐
 CSS  bytes ─parse─▶ CSSOM┴─▶ render tree ─▶ layout ─▶ paint ─▶ pixels
 (extra requests for CSS, JS, images, fonts, API JSON...)
\`\`\`

- Slide 15 of Lecture 01 describes exactly steps 1–4 for http:// (port 80). With https:// the port is 443 and a TLS handshake is added.
- Each referenced CSS/JS/image file triggers **another** HTTP request (often over the same connection).
- An SPA adds a further step: after JavaScript runs, React calls the API (e.g. GET /api/events) and renders the JSON it receives.`,
    simpleExample: {
      title: "A raw HTTP request and response",
      language: "http",
      code: `GET /api/events/42 HTTP/1.1
Host: localhost:5229
Accept: application/json

HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{"id":42,"title":"Campus Tech Conference","price":15}`,
      walkthrough: [
        { lines: "1", text: "Request line: method GET, target path /api/events/42, protocol version." },
        { lines: "2", text: "Host header: which site/port the request is for (one IP can host many sites)." },
        { lines: "3", text: "Accept: the client says it would like JSON back." },
        { lines: "4", text: "A blank line ends the headers. GET requests normally have no body." },
        { lines: "5", text: "Status line: 200 OK means the request succeeded." },
        { lines: "6", text: "Content-Type tells the client how to interpret the body bytes." },
        { lines: "8", text: "The body: a JSON representation of event 42." },
      ],
    },
    realExample: {
      title: "Watching the pipeline from JavaScript (Navigation Timing)",
      language: "ts",
      code: `const [nav] = performance.getEntriesByType("navigation") as PerformanceNavigationTiming[];

if (nav) {
  const dns = nav.domainLookupEnd - nav.domainLookupStart;
  const tcp = nav.connectEnd - nav.connectStart;
  const tls = nav.secureConnectionStart > 0 ? nav.connectEnd - nav.secureConnectionStart : 0;
  const ttfb = nav.responseStart - nav.requestStart;
  const domReady = nav.domContentLoadedEventEnd - nav.startTime;

  console.table({ dns, tcp, tls, ttfb, domReady });
}

const url = new URL("https://shop.example.com:8443/products/42?colour=red#reviews");
console.log(url.protocol, url.hostname, url.port, url.pathname, url.search, url.hash);
// "https:" "shop.example.com" "8443" "/products/42" "?colour=red" "#reviews"`,
      walkthrough: [
        { lines: "1", text: "The Navigation Timing API records timestamps for each phase of loading the current document." },
        { lines: "4", text: "DNS time: how long the name → IP lookup took (0 if cached)." },
        { lines: "5", text: "TCP time: includes the TLS handshake on HTTPS, because connectEnd is after TLS." },
        { lines: "6", text: "TLS time: secureConnectionStart is 0 for plain HTTP." },
        { lines: "7", text: "Time To First Byte: request sent → first response byte (server processing + network)." },
        { lines: "8", text: "When the DOM was fully parsed and DOMContentLoaded handlers finished." },
        { lines: "13-15", text: "The URL class parses a URL into exactly the parts used in this lesson. Note the hash is browser-only." },
      ],
    },
    mistakes: [
      { mistake: "Saying \"the Internet\" and \"the Web\" are the same thing.", fix: "The Internet is the network infrastructure (TCP/IP); the Web is a service (HTTP + HTML + URLs) running on it, like email is another service." },
      { mistake: "Assuming every 4xx/5xx makes fetch() throw.", fix: "fetch only rejects on network failure or abort. A 404 or 500 is still a resolved Response — check response.ok / response.status." },
      { mistake: "Thinking the #fragment is sent to the server.", fix: "The fragment stays in the browser; it is used for in-page anchors (and by hash-based routers). The server only sees path + query." },
      { mistake: "Confusing 401 and 403.", fix: "401 = not authenticated (no/invalid/expired credentials). 403 = the server knows who you are but you are not permitted." },
      { mistake: "Believing HTTPS hides everything, including which site you visit.", fix: "HTTPS encrypts headers and body in transit; the destination IP and usually the hostname are still visible to the network." },
    ],
    debug: {
      prompt: "A student's React page shows \"Loaded!\" even when the API returns 500, and crashes with a JSON parse error after a DELETE. Find both bugs.",
      language: "ts",
      buggyCode: `async function loadEvent(id: number) {
  try {
    const res = await fetch(\`http://localhost:5229/api/events/\${id}\`);
    const data = await res.json();
    console.log("Loaded!", data);
    return data;
  } catch {
    console.log("Network error");
  }
}

async function deleteEvent(id: number) {
  const res = await fetch(\`http://localhost:5229/api/events/\${id}\`, { method: "DELETE" });
  return res.json();
}`,
      hint: "Which HTTP outcomes make fetch reject? What body does a 204 response carry?",
      fixedCode: `async function loadEvent(id: number) {
  const res = await fetch(\`http://localhost:5229/api/events/\${id}\`);
  if (!res.ok) {
    throw new Error(\`Request failed: \${res.status} \${res.statusText}\`);
  }
  const data: unknown = await res.json();
  console.log("Loaded!", data);
  return data;
}

async function deleteEvent(id: number): Promise<void> {
  const res = await fetch(\`http://localhost:5229/api/events/\${id}\`, { method: "DELETE" });
  if (!res.ok) {
    throw new Error(\`Delete failed: \${res.status}\`);
  }
  // 204 No Content: there is no body, so do not call res.json()
}`,
      explanation: "An HTTP error status is a successful *network* exchange, so fetch resolves and the code must inspect res.ok. The DELETE endpoint returns 204 No Content, which has an empty body; calling res.json() on it throws a SyntaxError.",
    },
    challenge: {
      prompt: "Write a function describeUrl(input: string) that returns an object { scheme, host, port, path, query, fragment } where port is filled with the default (\"80\" for http, \"443\" for https) when the URL does not specify one, and query/fragment exclude their leading ? and #.",
      language: "ts",
      starterCode: `interface UrlParts {
  scheme: string;
  host: string;
  port: string;
  path: string;
  query: string;
  fragment: string;
}

function describeUrl(input: string): UrlParts {
  // your code here
}`,
      hints: [
        "new URL(input) parses for you; url.port is an empty string when the port is the scheme default.",
        "url.protocol includes a trailing colon (\"https:\").",
        "url.search starts with ? and url.hash starts with # (or both are empty strings).",
      ],
      solution: `interface UrlParts {
  scheme: string;
  host: string;
  port: string;
  path: string;
  query: string;
  fragment: string;
}

const DEFAULT_PORTS: Record<string, string> = { http: "80", https: "443" };

function describeUrl(input: string): UrlParts {
  const url = new URL(input);
  const scheme = url.protocol.replace(/:$/, "");
  return {
    scheme,
    host: url.hostname,
    port: url.port || DEFAULT_PORTS[scheme] || "",
    path: url.pathname,
    query: url.search.replace(/^\\?/, ""),
    fragment: url.hash.replace(/^#/, ""),
  };
}

// describeUrl("http://www.westminster.ac.uk/Campus/Cavendish/Faculty")
// → { scheme: "http", host: "www.westminster.ac.uk", port: "80",
//     path: "/Campus/Cavendish/Faculty", query: "", fragment: "" }`,
      explanation: "The WHATWG URL parser already splits the URL. The only subtlety is that it reports an empty port when the URL uses the default for its scheme, which is exactly why Lecture 01's example http://www.Westminster.ac.uk/... connects to port 80 even though no port is written.",
    },
    examQuestions: [
      { question: "Explain the difference between the Internet and the World Wide Web.", answer: "The Internet is the global network of networks (hardware plus the TCP/IP protocol suite) that connects computers. The World Wide Web is one service that runs on the Internet: documents and resources identified by URLs, transferred with HTTP and usually written in HTML. Email (SMTP) and FTP are other Internet services that are not the Web.", marks: 2 },
      { question: "List the steps a browser performs after the user enters http://www.westminster.ac.uk/Campus/Cavendish/Faculty.", answer: "1) Ask DNS for the IP address of www.westminster.ac.uk. 2) Open a TCP connection to that IP on port 80 (443 + TLS for https). 3) Send an HTTP request: GET /Campus/Cavendish/Faculty with a Host header. 4) Receive the response (status code, headers, HTML body). 5) Parse HTML into the DOM, CSS into the CSSOM, request further resources, then lay out and paint the page.", marks: 4 },
      { question: "MCQ: Which HTTP status code indicates that a request was understood but the user is not authenticated? A. 201 B. 204 C. 401 D. 500", answer: "**C. 401.** 201 = Created, 204 = success with no body, 500 = server error. (403 would mean authenticated but not permitted.)", marks: 1 },
      { question: "What is the purpose of a TCP port number? Give two examples from the lecture.", answer: "Ports provide multiplexing: they let multiple programs on the same IP address receive their own traffic. Examples: FTP 21, SMTP 25, HTTP 80 (and HTTPS 443).", marks: 2 },
    ],
    revision: [
      "Internet = infrastructure (TCP/IP); Web = a service on it (URLs + HTTP + HTML).",
      "DNS turns names into IP addresses (try nslookup); results are cached.",
      "TCP gives reliable ordered delivery; ports multiplex (21 FTP, 25 SMTP, 80 HTTP, 443 HTTPS).",
      "URL = scheme://host:port/path?query#fragment — the fragment never reaches the server.",
      "HTTP is request/response: method + path + headers (+ body) → status + headers (+ body).",
      "2xx success (204 has no body), 3xx redirect, 4xx client (401 unauthenticated, 403 forbidden, 404), 5xx server.",
      "Navigation pipeline: DNS → TCP → TLS → HTTP → parse HTML (DOM) + CSS (CSSOM) → layout → paint.",
    ],
    visualizers: ["url-anatomy", "http-lab"],
  },

  /* ================================================================== */
  /* 2. SPA vs MPA                                                      */
  /* ================================================================== */
  {
    id: "web-spa-vs-mpa",
    moduleId: "m00-web",
    title: "Traditional (MPA) vs Modern Single-Page Applications",
    summary:
      "Why modern apps ship one HTML shell plus JavaScript that renders views in the browser and fetches JSON from an API, and how that compares with server-rendered pages, SSR and SSG.",
    priority: "P1",
    minutes: 25,
    objectives: [
      "Contrast a traditional multi-page application (server generates HTML per request) with an SPA (browser renders, server returns JSON).",
      "Explain client-side rendering (CSR) and client-side routing without full page reloads.",
      "Describe SSR and SSG at a high level and when they help.",
      "Explain why a React SPA needs a separate API and why JSON is the exchange format.",
    ],
    prerequisites: ["web-how-the-web-works"],
    sources: [
      { kind: "university", label: LEC01, detail: "Slide 17 (Traditional vs Modern SPA)" },
      { kind: "university", label: LEC02, detail: "Slides 4–5 (Traditional Web Application vs Modern SPA)" },
      { kind: "university", label: WEEK05, detail: "Slides 5–6 (From single-page UI to multi-page app; what routing solves)" },
      { kind: "supplementary", label: "MDN Glossary — SPA", url: "https://developer.mozilla.org/en-US/docs/Glossary/SPA" },
      { kind: "supplementary", label: "MDN Glossary — JSON", url: "https://developer.mozilla.org/en-US/docs/Glossary/JSON" },
    ],
    why: `In a traditional site, every click asks the server for a brand-new HTML page: the screen flashes white, scroll position and in-memory state are lost, and the server must render HTML for every user. Highly interactive apps (dashboards, booking systems like CampusEvents) need instant feedback and rich client state.

The SPA model splits responsibilities: **React owns the UI in the browser**, and an **API owns data and rules on the server**. Understanding the split explains almost every later topic — routing (Week 05), fetch and loading states (Week 03), caching (TanStack Query) and why the server must still validate and authorise everything.`,
    analogy: `A **traditional MPA** is like a restaurant where, every time you want anything — salt, a drink, the bill — the waiter takes your whole table away and brings back a freshly laid one.

An **SPA** is a restaurant where the table (the app shell) stays put. You place small orders (API requests) and the waiter brings just the dish (JSON); you arrange it on your own table (React renders). The kitchen (the API) still decides what is on the menu and who is allowed to order the wine.`,
    explain: {
      beginner: `In a **traditional web application** (also called a multi-page application, MPA), the browser sends a request and the **server generates a complete HTML page** and sends it back. Click a link → new request → new full page. Lecture 02 slide 4 shows exactly this: *Browser → HTTP Request → Server generates HTML → Browser*.

In a **modern single-page application (SPA)** the browser downloads **one HTML page (the "app shell") plus a JavaScript bundle** once. After that, the JavaScript — our React app — draws every view itself. When it needs data, it asks an **API** over HTTP and gets back **JSON** (JavaScript Object Notation), a lightweight text format for data such as {"id": 1, "title": "Sports Day"}.

When you "change page" in an SPA, React Router updates the URL and swaps components **without a full document reload** (Week 05 slide 5). The URL still matters: you can bookmark it, share it, and the Back button works (slide 6).

So the server's job changes from "make pages" to "provide data and enforce rules". That is why CampusEvents has two projects: a React frontend and an ASP.NET Core API.`,
      developer: `**Client-side rendering (CSR)**: the initial HTML is nearly empty (a <div id="root"></div> plus a script). The browser downloads and executes the bundle, React builds the UI, then effects or a data library fetch JSON (GET /api/events) and React re-renders with real content. Navigation uses the History API (pushState) via React Router, so only the changed components re-render.

Practical consequences:

- **Loading/error states are your job** — every fetch needs pending, error and success UI.
- **Deep links need server config**: if a user refreshes /events/42, the server must return index.html for that path, not a 404 (Week 05 slide 6). Vite's dev server does this for you.
- **Two origins in development**: React on http://localhost:5173 calling the API on http://localhost:5229 means CORS applies.
- **JSON is the contract**: the frontend sends JSON.stringify(body) with Content-Type: application/json and reads await res.json(). Dates arrive as strings; TypeScript types do not validate the data at runtime.

**SSR (server-side rendering)** renders React to HTML on the server per request, then "hydrates" it in the browser so it becomes interactive. **SSG (static site generation)** renders HTML at build time. Frameworks like Next.js or React Router's framework mode provide these; this module uses a plain Vite CSR SPA.`,
      deep: `Trade-offs, honestly stated:

| Concern | MPA | CSR SPA | SSR + hydration | SSG |
|---|---|---|---|---|
| First meaningful content | fast (HTML ready) | slower (download JS, then fetch data) | fast | fastest (CDN) |
| Navigation after load | full reload | instant view swap | instant (after hydration) | instant |
| Server load | renders every page | serves static files + JSON | renders + JSON | build time only |
| SEO / no-JS users | good | weaker (crawlers must run JS) | good | good |
| Complexity | low | medium | high | medium (stale content) |

CSR's "waterfall" is real: HTML → JS bundle → render → fetch → render again. Mitigations include code splitting, preloading data, caching with TanStack Query, and showing skeletons.

The **security boundary does not move to the browser**. Everything in an SPA bundle is public and can be edited in DevTools; route guards and hidden buttons are UX only. The API must authenticate (JWT), authorise (roles: USER/ADMIN) and validate every request. This is also why "React needs an API": browsers cannot safely hold database credentials, and a database speaks its own protocol, not HTTP/JSON designed for untrusted clients.

Finally, "single page" refers to the single *document* load, not a single *view* — a well-designed SPA has many meaningful URLs.`,
    },
    mechanism: `\`\`\`text
TRADITIONAL (MPA)                          MODERN SPA (CSR)
─────────────────                          ────────────────
Browser                                    Browser
  │ GET /events                              │ GET /            (once)
  ▼                                          ▼
Server ── query DB ── build HTML            Server ──▶ index.html + bundle.js
  │                                          │
  ▼ full HTML page                           ▼ React renders shell + <Routes>
Browser replaces whole document             │
  │ click "Event 42"                         │ click "Event 42"
  ▼ GET /events/42 → new HTML page           ▼ history.pushState("/events/42")
  (white flash, state lost)                  │ React swaps <EventDetails/>
                                             │ fetch GET /api/events/42
                                             ▼
                                         ASP.NET Core API ─EF Core─▶ SQLite
                                             │  200 OK  {"id":42,...} (JSON)
                                             ▼
                                         React re-renders with the data
\`\`\`

Notes: in the SPA column the server sends HTML **once**; afterwards only JSON travels. The URL still changes (client-side routing), so refresh and bookmarks work — provided the server falls back to index.html for unknown paths.`,
    simpleExample: {
      title: "The entire HTML a Vite React SPA sends",
      language: "html",
      code: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>CampusEvents</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`,
      walkthrough: [
        { lines: "1-7", text: "A normal HTML document head — this is the 'app shell'." },
        { lines: "9", text: "An empty container. No events, no navbar: nothing is rendered yet." },
        { lines: "10", text: "The JavaScript entry point. React mounts into #root and from now on builds every view in the browser." },
      ],
    },
    realExample: {
      title: "SPA view fetching JSON from the API",
      language: "tsx",
      code: `import { useEffect, useState } from "react";

interface EventSummary {
  id: number;
  title: string;
  price: number;
}

export function EventsPage() {
  const [events, setEvents] = useState<EventSummary[]>([]);
  const [status, setStatus] = useState<"loading" | "error" | "ready">("loading");

  useEffect(() => {
    const controller = new AbortController();
    fetch("http://localhost:5229/api/events", { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
        return res.json() as Promise<EventSummary[]>;
      })
      .then((data) => {
        setEvents(data);
        setStatus("ready");
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setStatus("error");
      });
    return () => controller.abort();
  }, []);

  if (status === "loading") return <p>Loading events…</p>;
  if (status === "error") return <p role="alert">Could not load events.</p>;
  return (
    <ul>
      {events.map((e) => (
        <li key={e.id}>{e.title} — £{e.price}</li>
      ))}
    </ul>
  );
}`,
      walkthrough: [
        { lines: "3-7", text: "A TypeScript description of the JSON we expect. It is erased at compile time and does not validate the response." },
        { lines: "14-15", text: "After the first render, the component requests JSON — not HTML — from the API." },
        { lines: "17", text: "fetch does not reject on 4xx/5xx, so the status is checked explicitly." },
        { lines: "24-27", text: "Abort errors from unmounting are ignored; real failures show an error state." },
        { lines: "28", text: "Cleanup aborts the request if the component unmounts (React StrictMode mounts twice in development)." },
        { lines: "31-38", text: "The browser, not the server, turns data into HTML-like UI. This is client-side rendering." },
      ],
    },
    mistakes: [
      { mistake: "Thinking an SPA has only one URL / one view.", fix: "Single-page means a single document load. Client-side routing gives many meaningful, bookmarkable URLs (Week 05 slide 7)." },
      { mistake: "Refreshing /events/42 in production returns 404 and blaming React Router.", fix: "Configure the web server/host to serve index.html for all client-side routes (Week 05 slide 6)." },
      { mistake: "Putting business rules or secrets only in the React code.", fix: "Everything shipped to the browser is visible and editable. The API must enforce validation, authentication and authorisation." },
      { mistake: "Calling JSON 'a JavaScript object'.", fix: "JSON is a text format. res.json() parses the text into a JS value; JSON.stringify serialises a value into JSON text." },
    ],
    debug: {
      prompt: "This code is meant to send a new event as JSON to the API, but the server receives \"[object Object]\" and responds 415 Unsupported Media Type. Fix it.",
      language: "ts",
      buggyCode: `const newEvent = { title: "Sports Day", location: "Sports Centre", price: 5 };

await fetch("http://localhost:5229/api/events", {
  method: "POST",
  body: newEvent as unknown as BodyInit,
});`,
      hint: "What does the server need to know about the body's format, and what does a plain object become when coerced to a string?",
      fixedCode: `const newEvent = { title: "Sports Day", location: "Sports Centre", price: 5 };

const res = await fetch("http://localhost:5229/api/events", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(newEvent),
});
if (!res.ok) throw new Error(\`Create failed: \${res.status}\`);`,
      explanation: "HTTP bodies are bytes/text. A plain object is coerced to the string \"[object Object]\". JSON.stringify serialises it into JSON text and the Content-Type header tells ASP.NET Core to use its JSON input formatter (without it the API returns 415). (Creating events also requires an ADMIN JWT in CampusEvents.)",
    },
    challenge: {
      prompt: "Classify each scenario as best served by MPA, CSR SPA, SSR or SSG and justify in one line: (a) a university news archive that changes weekly; (b) an admin dashboard behind login with live filtering; (c) an online shop whose product pages must be indexed by search engines and personalised per user; (d) a simple contact form site on a basic PHP host.",
      language: "text",
      hints: [
        "Ask: does content change per request, per user, or rarely?",
        "Ask: does SEO matter, and is the app behind a login?",
      ],
      solution: `(a) SSG — content changes rarely; pre-render at build time, serve from a CDN, rebuild weekly.
(b) CSR SPA — behind login so SEO is irrelevant; highly interactive with lots of client state.
(c) SSR (with hydration) — per-request personalised HTML that crawlers can read, then interactive in the browser.
(d) MPA — server-generated pages are the simplest fit; little interactivity needed.`,
      explanation: "There is no universally 'best' architecture. The deciding factors are how often content changes, whether it is per-user, whether SEO/first paint matters, and how interactive the UI is. This module's CampusEvents app is a CSR SPA talking to an ASP.NET Core JSON API.",
    },
    examQuestions: [
      { question: "Describe how a traditional web application differs from a modern SPA in terms of where HTML is generated.", answer: "In a traditional application the server generates the HTML for each page/request and the browser replaces the whole document on navigation. In an SPA the browser loads an app shell and JavaScript once; React generates the UI in the browser and requests only data (JSON) from an API, so navigation does not require a full page reload.", marks: 3 },
      { question: "True/False: A React application can use React Router to display different page components without requiring a full browser page reload for every navigation.", answer: "**True.** Client-side routing updates the URL with the History API and swaps components (mock B1).", marks: 1 },
      { question: "What is JSON and why is it used between React and an ASP.NET Core API?", answer: "JSON (JavaScript Object Notation) is a lightweight, language-independent text format for structured data (objects, arrays, strings, numbers, booleans, null). It is easy for JavaScript to parse (res.json()/JSON.parse) and for C# to serialise, so both sides can exchange data over HTTP with Content-Type: application/json.", marks: 2 },
      { question: "Why must the server still be configured when using client-side routing?", answer: "If the user refreshes or opens a deep link like /events/42 directly, the browser requests that path from the server. The server must return the SPA entry point (index.html) so React Router can handle the route; otherwise it returns 404.", marks: 2 },
    ],
    revision: [
      "MPA: server builds full HTML per request; navigation = full reload.",
      "SPA: one HTML shell + JS bundle; React renders views in the browser; data comes as JSON.",
      "CSR waterfall: HTML → JS → render → fetch → re-render; you must design loading/error states.",
      "Client-side routing changes the URL without reloading; server must fall back to index.html.",
      "SSR renders HTML per request then hydrates; SSG renders at build time.",
      "React needs an API: the browser is untrusted and cannot talk to the DB safely.",
      "JSON is text; JSON.stringify to send (with Content-Type: application/json), res.json() to read.",
    ],
    visualizers: ["architecture-flow"],
  },

  /* ================================================================== */
  /* 3. MVC and DTOs                                                    */
  /* ================================================================== */
  {
    id: "web-mvc-dtos",
    moduleId: "m00-web",
    title: "MVC, Models vs DTOs and the API Boundary",
    summary:
      "How the CampusEvents backend is organised (Models, Controllers, EF Core, SQLite), why React plays the View role, and why APIs return DTOs instead of database models.",
    priority: "P1",
    minutes: 25,
    objectives: [
      "Describe the responsibilities of Models, Views and Controllers and identify React as the View in our stack.",
      "Explain what a DTO is and why exposing database Models (e.g. passwordHash) through an API is harmful.",
      "Trace a request from React through HTTP, an ASP.NET Core controller and EF Core to SQLite.",
      "Explain why React never talks to the database directly and how Swagger/Postman are used to test the API.",
    ],
    prerequisites: ["web-spa-vs-mpa"],
    sources: [
      { kind: "university", label: LEC01, detail: "Slides 18–24 (MVC, Models, Controllers, Views, DTOs, Model vs DTO JSON, problems without DTOs)" },
      { kind: "university", label: WEEK03, detail: "Slide 4 (React does not talk directly to the database), slide 5 (Swagger and Postman are not browsers)" },
      { kind: "university", label: "CampusEvents API — Postman Testing Guide (docx)", detail: "Sections 3–10 (Bearer token setup, 201 Created vs 403 Forbidden tests)" },
      { kind: "supplementary", label: "Microsoft Learn — Create web APIs with ASP.NET Core", url: "https://learn.microsoft.com/en-us/aspnet/core/web-api/" },
      { kind: "supplementary", label: "Microsoft Learn — Entity Framework Core", url: "https://learn.microsoft.com/en-us/ef/core/" },
    ],
    why: `Interview questions from Lecture 01's notes: *"Why use DTOs when we have models?"* and *"What is MVC? How does it help us?"*. They matter because a single careless return user; in a controller can leak password hashes to every browser that calls the endpoint. And when your React app gets a 400 or 403, you need a mental model of **which layer** produced it and why the frontend cannot "just query the database" instead.`,
    analogy: `A bank branch:

- The **vault and ledgers** are the database (SQLite) — customers never walk in there.
- The **clerks behind the counter** are controllers: they take your request, check your ID, and talk to the vault through the bank's internal procedures (EF Core).
- The **internal account record** (with security questions, internal risk scores) is the Model.
- The **printed statement** you receive shows only what you need — that is the **DTO**.
- **You, the customer, at the counter** are React: the View that shows information and collects requests.`,
    explain: {
      beginner: `**MVC** stands for **Model–View–Controller**, a way of splitting an application into three responsibilities so each part is easier to understand and change.

- **Models** are classes that represent the application's data — often one per database table. In our backend they are C# classes such as Product with Id, Name and Price.
- **Controllers** handle HTTP requests: they receive "GET /api/products", fetch or change data, and send back a response. This is where CRUD (create, read, update, delete) methods live.
- **Views** are what the user sees. In a traditional MVC app the server generates HTML views; **in our application React is the View layer** (Lecture 01 slide 21).

A **DTO (Data Transfer Object)** is a simple class that describes *exactly the data an API sends or receives*. The User model stored in the database might contain PasswordHash and CreatedAt, but the UserDto sent to React contains only Id and Email. Compare the two JSON responses on slide 23: one leaks "passwordHash": "$2a$11$...", the DTO version does not.

React never connects to the database directly. The path is always **React → HTTP → ASP.NET Core API → EF Core → SQLite** (Week 03 slide 4).`,
      developer: `In ASP.NET Core Web API, a controller is a class decorated with [ApiController] and [Route("api/[controller]")] that inherits ControllerBase. Action methods are mapped to HTTP verbs with [HttpGet], [HttpPost], [HttpPut("{id}")], [HttpDelete("{id}")]. Return helpers map to status codes: Ok(dto) → 200, CreatedAtAction(...) → 201 with a Location header, NoContent() → 204, BadRequest() → 400, NotFound() → 404. [Authorize(Roles = "Admin")] produces 401 for anonymous callers and 403 for a logged-in user without the role — exactly what the Postman guide asks you to verify with AdminToken vs UserToken.

**EF Core** is the ORM: a DbContext exposes DbSet<Event>; LINQ queries such as _db.Events.Include(e => e.Category) are translated to SQL for **SQLite**. Projecting to DTOs is typically done with Select:

Select(e => new EventDto { Id = e.Id, Title = e.Title, CategoryName = e.Category.Name })

This flattens relationships (categoryName in the CampusEvents EventDto), avoids serialising navigation-property cycles, and fetches only needed columns.

On the React side, your TypeScript interface Event mirrors the **DTO**, not the database table. **Swagger** (OpenAPI UI generated by the backend) and **Postman** let you test endpoints without a frontend. Remember they are not browsers, so CORS does not apply to them (Week 03 slide 5): an endpoint that works in Postman can still be blocked in React.`,
      deep: `DTOs are about **contracts and coupling**. Lecture 01 slide 24 lists the problems with returning models: over-exposure of data React doesn't need, potential leakage of sensitive/internal fields, and tight coupling — rename a column and the public API changes, breaking every client. A DTO layer lets the database schema evolve independently of the JSON contract.

DTOs also protect **input**. Binding a request body straight onto an entity enables **mass assignment / over-posting**: a client adds "role": "ADMIN" or "availableTickets": 9999 to the JSON and the model binder happily sets it. Separate request DTOs (CreateEventDto, UpdateEventDto) whitelist the writable fields; the server then applies business rules (capacity ≥ booked tickets, end date after start date) before saving.

Why not let the browser talk to SQLite or any DB directly? (1) The browser is an untrusted environment — any credentials shipped to it are public. (2) Authorisation is per-row/per-role logic that must run on a trusted server. (3) Databases speak their own wire protocols and aren't designed to be exposed to the Internet. (4) An API gives a stable, versionable HTTP/JSON contract that multiple clients (web, mobile, Postman tests) share.

Note that MVC is a server-side pattern here; inside React we use a different layering (components, hooks, service modules, stores). The idea is the same: separate presentation from data access and business rules.`,
    },
    mechanism: `\`\`\`text
 React (View)                       ASP.NET Core API                         Data
┌──────────────┐  GET /api/events/1  ┌───────────────────────────┐        ┌──────────┐
│ EventDetails │ ──────────────────▶ │ [ApiController]           │  LINQ  │          │
│ component    │   Authorization:    │ EventsController          │ ─────▶ │ EF Core  │
│              │   Bearer <jwt>      │  ├─ auth / role checks    │        │ DbContext│
│              │                     │  ├─ validation            │        └────┬─────┘
│              │                     │  └─ map Model ─▶ DTO      │  SQL        ▼
│              │ ◀────────────────── │ return Ok(eventDto)       │ ◀────── ┌──────────┐
└──────────────┘  200 + JSON (DTO)   └───────────────────────────┘ entity  │ SQLite   │
                                                                          └──────────┘
 Model (internal):  Id, Email, PasswordHash, CreatedAt   ─╳─ never serialised
 DTO   (public):    Id, Email                            ──▶ JSON to React
\`\`\`

- The **controller** is the only door to the data. React can only ask it, over HTTP.
- The **mapping step** (Model → DTO) is where sensitive or irrelevant fields are dropped and relations are flattened.
- Swagger/Postman call the same controller directly — useful for isolating "is it the API or my React code?".`,
    simpleExample: {
      title: "Model vs DTO as JSON (Lecture 01 slide 23)",
      language: "json",
      code: `{
  "model_response_without_dto": {
    "id": 1,
    "email": "student@example.com",
    "passwordHash": "$2a$11$...",
    "createdAt": "2026-09-16T10:30:00"
  },
  "dto_response": {
    "id": 1,
    "email": "student@example.com"
  }
}`,
      walkthrough: [
        { lines: "2-7", text: "Serialising the User Model directly: the bcrypt password hash and internal timestamp leak to every client." },
        { lines: "8-11", text: "Serialising a UserDto: only the fields React needs. The contract is explicit and safe." },
      ],
    },
    realExample: {
      title: "ASP.NET Core controller returning DTOs (C#, shown as text) + the matching TS type",
      language: "text",
      code: `// ---------- C# (backend) ----------
public class EventDto
{
    public int Id { get; set; }
    public string Title { get; set; } = "";
    public decimal Price { get; set; }
    public string CategoryName { get; set; } = "";
}

[ApiController]
[Route("api/[controller]")]
public class EventsController : ControllerBase
{
    private readonly AppDbContext _db;
    public EventsController(AppDbContext db) => _db = db;

    [HttpGet("{id}")]
    public async Task<ActionResult<EventDto>> GetById(int id)
    {
        var dto = await _db.Events
            .Where(e => e.Id == id)
            .Select(e => new EventDto {
                Id = e.Id, Title = e.Title, Price = e.Price,
                CategoryName = e.Category.Name })
            .FirstOrDefaultAsync();
        return dto is null ? NotFound() : Ok(dto);
    }
}

// ---------- TypeScript (frontend) ----------
// export interface EventDto { id: number; title: string; price: number; categoryName: string; }`,
      walkthrough: [
        { lines: "2-8", text: "The DTO: a flat, public shape. CategoryName flattens the Category relation." },
        { lines: "10-12", text: "Controller attributes from Lecture 01 slide 20: [ApiController], route api/events, inherits ControllerBase." },
        { lines: "14-15", text: "EF Core DbContext is injected; the controller never opens SQLite connections by hand." },
        { lines: "17-18", text: "GET /api/events/{id} returns an EventDto (200) or 404." },
        { lines: "20-25", text: "LINQ projection: EF Core translates this into SQL selecting only the needed columns and maps rows straight into DTOs." },
        { lines: "26", text: "NotFound() → 404, Ok(dto) → 200 with JSON. ASP.NET Core serialises property names in camelCase by default." },
        { lines: "31", text: "The React-side type mirrors the DTO's JSON (camelCase), not the database table." },
      ],
    },
    mistakes: [
      { mistake: "Returning EF Core entities directly from controllers.", fix: "Map to DTOs. Entities can leak sensitive fields, couple the API to the schema and cause JSON cycles via navigation properties." },
      { mistake: "Using the same class for input and output (accepting the full Model in POST).", fix: "Use request DTOs that whitelist writable fields to prevent over-posting (e.g. a client setting role or availableTickets)." },
      { mistake: "Saying 'React is the Controller' or 'React is MVC'.", fix: "In our architecture React provides the View layer; ASP.NET Core controllers handle HTTP requests; Models represent data." },
      { mistake: "Concluding that an API works for React because it works in Postman/Swagger.", fix: "Postman and Swagger are not browsers — CORS is not enforced there. Test from the React origin too." },
    ],
    debug: {
      prompt: "The GET /api/users/me endpoint returns the JSON below to the React app. Identify what is wrong from a DTO/security perspective and write the corrected response the API should send.",
      language: "json",
      buggyCode: `{
  "id": 7,
  "email": "student@example.com",
  "firstName": "Ada",
  "passwordHash": "$2a$11$Qe8...",
  "securityStamp": "c1f0-4d2b-...",
  "createdAt": "2026-09-16T10:30:00",
  "bookings": [
    { "id": 3, "eventId": 42, "user": { "id": 7, "email": "student@example.com", "bookings": [] } }
  ]
}`,
      hint: "Which fields should never leave the server, and what is the nested user inside bookings telling you about how this was serialised?",
      fixedCode: `{
  "id": 7,
  "email": "student@example.com",
  "firstName": "Ada",
  "bookings": [
    { "id": 3, "eventId": 42 }
  ]
}`,
      explanation: "The controller is serialising the database entity: passwordHash and securityStamp are internal secrets, and the nested user inside each booking is a navigation-property back-reference (a cycle that can explode or fail serialisation). A UserProfileDto with a BookingSummaryDto list exposes only what the UI needs.",
    },
    challenge: {
      prompt: "Design the DTOs for the CampusEvents booking feature. The Booking entity has: Id, UserId, User (navigation), EventId, Event (navigation), Quantity, Status, CreatedAt, InternalNotes. Write (1) a TypeScript interface for the JSON returned by GET /api/bookings/my-bookings and (2) a TypeScript interface for the body of POST /api/bookings. Justify each excluded field.",
      language: "ts",
      hints: [
        "Output DTOs should contain what the 'My bookings' page displays — probably the event title and date, not the whole Event entity.",
        "Input DTOs should contain only what the user is allowed to choose. Who decides UserId and Status?",
      ],
      solution: `// Response item for GET /api/bookings/my-bookings
export interface BookingDto {
  id: number;
  eventId: number;
  eventTitle: string; // flattened from Event
  eventStartDate: string; // ISO date string in JSON
  quantity: number;
  status: "Pending" | "Confirmed" | "Cancelled";
  createdAt: string;
}

// Request body for POST /api/bookings
export interface CreateBookingDto {
  eventId: number;
  quantity: number;
}

// Excluded:
// - userId (input): taken from the authenticated JWT on the server, never trusted from the body.
// - status (input): server sets the initial status; only ADMIN changes it via PATCH.
// - User / Event navigations: replaced by the flattened fields actually displayed; avoids cycles.
// - internalNotes: internal staff data, not for clients.`,
      explanation: "Good DTOs are shaped by the screen (output) and by what the client is allowed to decide (input). Identity comes from the token, not the request body, and server-controlled fields like status must not be writable through the create endpoint. (Exact status names depend on the supplied backend; the pattern is what matters.)",
    },
    examQuestions: [
      { question: "What is a DTO and why use one when we already have Models?", answer: "A Data Transfer Object is a simple object describing exactly the data sent across a boundary (e.g. API → React). Using DTOs avoids exposing data the client doesn't need and sensitive internal fields (e.g. PasswordHash), decouples the API contract from the database model so schema changes don't break clients, and (for input DTOs) prevents over-posting.", marks: 3 },
      { question: "In the course's architecture, which part provides the View in MVC, and what do Controllers do?", answer: "React provides the View: it renders the UI in the browser. Controllers are ASP.NET Core classes inheriting ControllerBase that handle HTTP requests, perform CRUD operations using Models/DTOs (via EF Core) and return responses with status codes.", marks: 2 },
      { question: "Why does React not talk directly to the SQLite database?", answer: "The browser is untrusted: any DB credentials would be public and users could run arbitrary queries. The API is the boundary that authenticates, authorises and validates requests, applies business rules, and exposes a stable HTTP/JSON contract. React → HTTP → ASP.NET Core API → EF Core → SQLite.", marks: 2 },
      { question: "Using the Postman guide, what response should a USER token receive for POST /api/categories, and why?", answer: "403 Forbidden: the user is authenticated (valid token) but lacks the Admin role required by the endpoint. Without any token the response would be 401.", marks: 2 },
    ],
    revision: [
      "MVC: Model = data structure, View = UI (React in our stack), Controller = handles HTTP requests/CRUD.",
      "Controllers: [ApiController], [Route(\"api/[controller]\")], inherit ControllerBase, return Ok/Created/NoContent/NotFound.",
      "DTO = the public shape of data crossing the API boundary; Model = internal/database shape.",
      "Without DTOs: over-exposure, leaked secrets (passwordHash), tight coupling to the schema.",
      "Input DTOs prevent over-posting; identity comes from the JWT, not the body.",
      "Path: React → HTTP → ASP.NET Core API → EF Core → SQLite. Never React → DB.",
      "Swagger/Postman test the API directly; they are not browsers, so CORS doesn't apply there.",
    ],
    visualizers: ["architecture-flow", "trust-boundary"],
  },


  /* ================================================================== */
  /* 4. Semantic HTML and forms                                         */
  /* ================================================================== */
  {
    id: "html-semantic-forms",
    moduleId: "m01-html",
    title: "Semantic HTML5, Forms and the DOM",
    summary:
      "Use elements that describe their meaning (header, nav, main, article, form, label) and let the browser's built-in form validation do the first line of checking.",
    priority: "P1",
    minutes: 35,
    objectives: [
      "Choose semantic HTML5 elements (header, nav, main, section, article, aside, footer, figure, time) over generic divs.",
      "Explain the purpose of <!DOCTYPE html>, lang, meta charset and the viewport meta tag.",
      "Build accessible forms with correctly associated labels and appropriate input types.",
      "Use native validation attributes (required, min, max, minlength, pattern, type=email) and explain their limits.",
      "Describe the DOM as the browser's live tree of objects built from HTML.",
    ],
    prerequisites: ["web-how-the-web-works"],
    sources: [
      { kind: "university", label: LEC04_HTML, detail: "Sections: Semantic Elements; <!DOCTYPE html>; <html lang>; <head>; meta charset; meta viewport; header/nav/section/article/mark/figure/details/time/progress/meter/aside/footer" },
      { kind: "university", label: WEEK05, detail: "Slides 24–25 (client vs server validation; associate labels with inputs, connect errors to fields)" },
      { kind: "mock", label: MOCK, detail: "A17 (client-side validation), B9 (client validation is not a guarantee)" },
      { kind: "supplementary", label: "MDN — Client-side form validation", url: "https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation" },
      { kind: "supplementary", label: "MDN — Introduction to the DOM", url: "https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction" },
    ],
    why: `HTML is not just "boxes to style". The element you choose tells browsers, screen readers, search engines and other developers **what the content is**. A <button> is focusable, clickable with Enter/Space and announced as a button for free; a <div onclick> is none of those. A <label for> makes the label clickable and gives the input an accessible name.

Forms are the heart of CRUD apps like CampusEvents. Native validation gives instant feedback at zero JavaScript cost — but it is a convenience, never a security boundary (Week 05 slide 24, mock B9).`,
    analogy: `Semantic HTML is like labelling the rooms on a building plan "Kitchen", "Exit", "Stairs" instead of "Room 1", "Room 2", "Room 3". A visitor looking at the walls might work it out, but a blind visitor using a tactile map, a fire inspector (search engine) or a new architect (developer) relies on the labels.

Native form validation is the receptionist who checks you filled in every box before passing your form to the back office. Helpful — but the back office (the server) still checks it properly, because someone can always walk round the receptionist.`,
    explain: {
      beginner: `**Semantic elements** describe their meaning. <div> and <span> say nothing about their content; <form>, <table>, <article> clearly define theirs (Lecture 04). HTML5 added layout semantics:

- <header> introductory content or navigation at the top; <nav> a set of navigation links;
- <main> the main content (one per page); <section> a themed group; <article> a self-contained piece (blog post, event card);
- <aside> tangential content like a sidebar; <footer> copyright/contact info;
- <figure> + <figcaption> media with a caption; <time datetime="2026-11-26"> a machine-readable date; <details>/<summary> a collapsible block; <progress> and <meter> for progress and measurements.

The document skeleton matters too: <!DOCTYPE html> avoids "quirks mode"; <html lang="en"> tells screen readers which language to pronounce; <meta charset="UTF-8"> handles all characters; <meta name="viewport" content="width=device-width, initial-scale=1.0"> is essential for responsive design.

**Forms** collect input. Every input needs a **<label>** linked with for="id". Pick the right **type**: email, number, date, password, tel — mobile keyboards adapt and the browser validates. Add **validation attributes**: required, min, max, minlength, maxlength, pattern. If the user submits invalid data, the browser blocks submission and shows a message.

The browser turns your HTML into the **DOM** (Document Object Model): a tree of objects JavaScript (and React) can read and change.`,
      developer: `Native **constraint validation** runs when a form is submitted (and can be queried any time). Each input exposes input.validity (a ValidityState with flags such as valueMissing, typeMismatch, patternMismatch, rangeUnderflow, tooShort), input.validationMessage, and methods checkValidity(), reportValidity() and setCustomValidity(msg). CSS can react via :invalid, :valid, :required and the newer :user-invalid (only after the user has interacted).

Key details:
- pattern must match the **entire** value (it is implicitly anchored) and only applies to non-empty values — combine with required.
- type="number" values are still **strings** in input.value; use valueAsNumber or Number(). step="1" restricts to integers.
- An empty optional field passes every constraint except required.
- Add novalidate to the <form> when you take over validation in JavaScript (React Hook Form + Zod), so the browser's bubbles don't fight your custom messages. Keep the semantic types and labels anyway.

Accessible error wiring: give the error element an id and reference it from the input with aria-describedby, set aria-invalid="true" on invalid fields, and don't rely on red borders alone (Week 05 slide 25).

The **DOM** is a live tree of Node objects (Document → Element → Text). document.querySelector returns elements; changing them changes the page. React keeps a virtual description of the UI and updates only the DOM nodes that differ.`,
      deep: `Every semantic element maps to an **implicit ARIA role** in the accessibility tree that browsers expose to assistive technology: <nav> → navigation landmark, <main> → main, <header> (when not inside article/section) → banner, <footer> (top-level) → contentinfo, <button> → button, <a href> → link, <input type="checkbox"> → checkbox. Screen-reader users jump between landmarks and headings — a page built only from divs is a flat, unnavigable wall of text.

Form submission internals: pressing Enter in a text field triggers *implicit submission* via the form's default button. A <button> inside a <form> defaults to type="submit" — a common bug when a "Cancel" button submits the form; set type="button". On submit, the browser runs constraint validation, fires invalid events on failing controls, focuses the first invalid one, and only if all pass fires submit. In React you call event.preventDefault() in onSubmit to stop the full-page navigation the browser would otherwise perform (the MPA default!).

Validation layers in professional apps:
1. **HTML attributes** — instant, free, works without JS.
2. **Client schema** (Zod) — rich rules: trimmed non-empty, cross-field (end after start), custom messages.
3. **Server validation** — authoritative. Anyone can remove required in DevTools or send a request with curl/Postman, so client validation only improves UX (mock B9 is **False**).

Also note the DOM is not the HTML source: the parser fixes errors (e.g. inserts <tbody>), and scripts mutate it after load. DevTools Elements shows the DOM, "View source" shows the original HTML.`,
    },
    mechanism: `\`\`\`text
 HTML source                         DOM tree (live objects)          Accessibility tree
 ───────────                         ───────────────────────          ──────────────────
 <body>                              document                         banner
   <header>…<nav>…</nav></header>     └ html (lang="en")                navigation "Main"
   <main>                                └ body                       main
     <form>                                 ├ header ─ nav               form
       <label for="email">Email          ├ main                         textbox "Email" required
       <input id="email"                    │  └ form                     invalid: true
              type="email" required>      │     ├ label ─┐ for=email     description: "Enter a valid…"
       <p id="email-err">…</p>            │     ├ input ◀┘ validity{…}  button "Register"
       <button>Register</button>            │     └ button (type=submit)
     </form>                              └ footer                     contentinfo
   </main>
   <footer>…</footer>

 Submit pressed ─▶ constraint validation on each control
                    ├─ any invalid? ─▶ fire "invalid", focus first, show message, STOP
                    └─ all valid    ─▶ fire "submit" ─▶ (React: preventDefault + fetch POST)
\`\`\`

The same HTML produces two trees: the DOM (what scripts manipulate) and the accessibility tree (what assistive technology reads). Semantic elements and labels populate the second one correctly for free.`,
    simpleExample: {
      title: "A semantic page skeleton",
      language: "html",
      code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CampusEvents — Upcoming</title>
</head>
<body>
  <header>
    <h1>CampusEvents</h1>
    <nav aria-label="Main">
      <a href="/">Home</a>
      <a href="/events">Events</a>
    </nav>
  </header>
  <main>
    <article>
      <h2>Campus Tech Conference</h2>
      <p>Starts <time datetime="2026-12-03T09:00">3 December, 9am</time></p>
    </article>
  </main>
  <footer>&copy; 2026 University of Westminster students</footer>
</body>
</html>`,
      walkthrough: [
        { lines: "1", text: "HTML5 doctype: standards mode, no quirks mode." },
        { lines: "2", text: "lang tells screen readers and search engines the language." },
        { lines: "4-5", text: "UTF-8 encoding and the viewport tag required for responsive layouts." },
        { lines: "9-15", text: "header with the site title and a labelled nav landmark." },
        { lines: "16-21", text: "main holds the unique page content; each event is a self-contained article." },
        { lines: "19", text: "time carries a machine-readable datetime alongside human-friendly text." },
        { lines: "22", text: "footer for copyright/legal info." },
      ],
    },
    realExample: {
      title: "Registration form with native validation and accessible errors",
      language: "html",
      code: `<form action="/api/auth/register" method="post">
  <div>
    <label for="firstName">First name</label>
    <input id="firstName" name="firstName" autocomplete="given-name" required minlength="2">
  </div>

  <div>
    <label for="email">Email</label>
    <input id="email" name="email" type="email" autocomplete="email" required
           aria-describedby="email-hint">
    <p id="email-hint">Use your university email.</p>
  </div>

  <div>
    <label for="password">Password</label>
    <input id="password" name="password" type="password" autocomplete="new-password"
           required minlength="8" pattern="(?=.*\\d)(?=.*[A-Z]).{8,}"
           aria-describedby="password-rules">
    <p id="password-rules">At least 8 characters, one capital letter and one number.</p>
  </div>

  <div>
    <label for="tickets">Tickets</label>
    <input id="tickets" name="tickets" type="number" min="1" max="10" step="1" value="1">
  </div>

  <button type="submit">Register</button>
</form>`,
      walkthrough: [
        { lines: "3-4", text: "label for= matches input id=, so clicking the label focuses the input and the input gets an accessible name. required + minlength block empty or 1-char names." },
        { lines: "9-10", text: "type=email triggers a format check and an email keyboard on mobile; autocomplete helps password managers." },
        { lines: "11", text: "aria-describedby links the hint so screen readers read it after the label." },
        { lines: "17", text: "pattern must match the whole value; it only applies when the field is non-empty, hence required as well." },
        { lines: "24", text: "type=number with min/max/step: rangeUnderflow, rangeOverflow and stepMismatch are checked. The value is still a string in JS." },
        { lines: "27", text: "An explicit submit button. Without JS, the browser validates then POSTs the form." },
      ],
    },
    mistakes: [
      { mistake: "Using <div onclick> or <span> as buttons.", fix: "Use <button type=\"button\">: it is focusable, keyboard-operable (Enter/Space) and announced as a button." },
      { mistake: "Placeholder text instead of a label.", fix: "Placeholders vanish when typing and are often low contrast. Always provide a <label> (it can be visually styled small)." },
      { mistake: "A Cancel button inside a form submits it.", fix: "Buttons in forms default to type=\"submit\". Set type=\"button\" for non-submitting buttons." },
      { mistake: "Trusting required/pattern as security.", fix: "Anyone can edit the DOM or send requests directly. The server must validate again (mock B9: False)." },
      { mistake: "Using heading levels for size (jumping from h1 to h4).", fix: "Choose headings by document outline; control size with CSS." },
    ],
    debug: {
      prompt: "This form looks fine, but clicking the 'Email' text doesn't focus the field, screen readers announce 'edit text, blank', the email field accepts 'abc', and pressing Clear submits the form. Fix all four issues.",
      language: "html",
      buggyCode: `<form>
  <div class="field">
    <span>Email</span>
    <input name="email" placeholder="Email">
  </div>
  <div class="field">
    <label>Age</label>
    <input id="age" name="age">
  </div>
  <button>Clear</button>
  <button>Send</button>
</form>`,
      hint: "Labels need for/id association; inputs need types and constraints; check the default type of a button inside a form.",
      fixedCode: `<form>
  <div class="field">
    <label for="email">Email</label>
    <input id="email" name="email" type="email" required autocomplete="email">
  </div>
  <div class="field">
    <label for="age">Age</label>
    <input id="age" name="age" type="number" min="16" max="120" step="1">
  </div>
  <button type="reset">Clear</button>
  <button type="submit">Send</button>
</form>`,
      explanation: "A <span> is not a label, and a <label> without for (and not wrapping the input) is not associated. type=email + required adds format and presence checks. Buttons inside forms default to submit, so Clear must be type=reset (or type=button with custom logic).",
    },
    challenge: {
      prompt: "Write the HTML for a CampusEvents 'Create event' form using only native validation: Event name (required, 3–100 chars), Location (required), Start date-time (required), Maximum attendees (required positive integer, max 5000), Price (0 or more, pennies allowed). Every field must have a label and the attendees field a hint linked with aria-describedby.",
      language: "html",
      hints: [
        "datetime-local is the input type for a date + time without time zone.",
        "For a positive integer: type=number, min=1, step=1.",
        "For money: type=number with min=0 and step=0.01.",
      ],
      solution: `<form>
  <h2>Create event</h2>

  <label for="name">Event name</label>
  <input id="name" name="title" required minlength="3" maxlength="100">

  <label for="location">Location</label>
  <input id="location" name="location" required>

  <label for="start">Start</label>
  <input id="start" name="startDate" type="datetime-local" required>

  <label for="capacity">Maximum attendees</label>
  <input id="capacity" name="capacity" type="number" required min="1" max="5000" step="1"
         aria-describedby="capacity-hint">
  <p id="capacity-hint">Whole number between 1 and 5000.</p>

  <label for="price">Price (£)</label>
  <input id="price" name="price" type="number" min="0" step="0.01" value="0">

  <button type="submit">Create event</button>
</form>`,
      explanation: "Each requirement maps to a constraint: required (valueMissing), minlength/maxlength (tooShort/tooLong), min/max (range), step=1 (stepMismatch for decimals). Note required on a text input accepts '   ' (spaces) — trimming checks like the Week 05 Zod schema (z.string().trim().min(1)) need JavaScript, and the API validates authoritatively.",
    },
    examQuestions: [
      { question: "MCQ (mock A17): A developer wants to prevent a user from submitting a form if an email address does not meet a required format. Which approach is most appropriate? A. Client-side validation B. Changing the page title C. Adding a CSS animation D. Using browser local storage only", answer: "**A. Client-side validation** — e.g. type=\"email\" + required, or a schema check before submitting. The server should still validate.", marks: 1 },
      { question: "True/False (mock B9): Client-side validation guarantees that invalid data can never reach a server.", answer: "**False.** Client code can be bypassed (DevTools, disabling JS, Postman/curl). Client validation improves UX; server validation is authoritative.", marks: 1 },
      { question: "What is a semantic element? Give two non-semantic and three semantic examples.", answer: "A semantic element clearly describes its meaning to both the browser and the developer. Non-semantic: <div>, <span>. Semantic: <form>, <table>, <article>, <nav>, <header>, <footer>, <main>.", marks: 2 },
      { question: "Explain the purpose of <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">.", answer: "It tells mobile browsers to make the layout viewport the device's width and to start at 100% zoom, instead of rendering a ~980px desktop-width page zoomed out. Without it, media queries and responsive layouts don't behave as intended.", marks: 2 },
    ],
    revision: [
      "Semantic = meaning: header, nav, main, section, article, aside, footer, figure/figcaption, time, details/summary.",
      "<!DOCTYPE html> = standards mode; lang aids screen readers/SEO; meta viewport is required for responsive design.",
      "Every input needs a <label for=id>; placeholders are not labels.",
      "Choose input types (email, number, date, password) for validation and mobile keyboards.",
      "Constraint attributes: required, min, max, step, minlength, maxlength, pattern (whole-value match).",
      "Buttons in forms default to submit; use type=\"button\" for other actions.",
      "Client validation is UX, not security — the server validates again.",
      "The DOM is the live object tree built from HTML; React updates it for you.",
    ],
    visualizers: ["form-validation"],
  },

  /* ================================================================== */
  /* 5. Accessibility: focus & keyboard                                 */
  /* ================================================================== */
  {
    id: "a11y-focus-keyboard",
    moduleId: "m01-html",
    title: "Accessibility Essentials: Keyboard, Focus, Labels and Contrast",
    summary:
      "Make every feature usable without a mouse, show where focus is with :focus-visible, connect errors to fields, meet contrast, respect reduced motion and use ARIA only when HTML can't.",
    priority: "P0",
    examCritical: true,
    minutes: 35,
    objectives: [
      "Ensure every interactive control is reachable and operable with the keyboard in a logical focus order.",
      "Explain the difference between :focus and :focus-visible and style a clear focus indicator (mock A20).",
      "Associate labels, hints and error messages with inputs using for/id, aria-describedby and aria-invalid.",
      "Apply colour-contrast requirements and avoid conveying information by colour alone.",
      "Respect prefers-reduced-motion and apply the rule 'no ARIA is better than bad ARIA'.",
    ],
    prerequisites: ["html-semantic-forms"],
    sources: [
      { kind: "mock", label: MOCK, detail: "A20 (purpose of :focus-visible)" },
      { kind: "university", label: WEEK05, detail: "Slide 25 (do not rely on colour alone; associate labels with inputs and connect errors to fields)" },
      { kind: "university", label: BS_DOC, detail: "'What is ARIA?' section (aria-controls, aria-expanded, aria-label, aria-labelledby)" },
      { kind: "university", label: LEC04_BS3, detail: "Best practices — accessibility considerations, sufficient colour contrast" },
      { kind: "supplementary", label: "MDN — :focus-visible", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible" },
      { kind: "supplementary", label: "MDN — prefers-reduced-motion", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion" },
      { kind: "supplementary", label: "W3C WAI — WCAG 2.2 Quick Reference", url: "https://www.w3.org/WAI/WCAG22/quickref/" },
      { kind: "supplementary", label: "W3C WAI — ARIA Authoring Practices Guide", url: "https://www.w3.org/WAI/ARIA/apg/" },
    ],
    why: `Many people never use a mouse: screen-reader users, people with motor impairments using switches or keyboards, power users. If your "Book now" is a <div>, or your CSS deletes the focus outline, those users simply **cannot use your app**. Accessibility is also a legal requirement for UK public-sector sites (including universities) and is part of the coursework marking for responsive/accessible UI.

The ICT tests this directly: mock **A20** asks what :focus-visible is for. Lecture 8 (Responsive/Accessible UI) wasn't supplied, so this lesson fills that gap from W3C WAI and MDN.`,
    analogy: `Keyboard focus is the **cursor of a person who cannot point**. Imagine navigating a shop where you can only say "next aisle" (Tab), "previous aisle" (Shift+Tab) and "take this" (Enter/Space). The focus ring is the spotlight showing which aisle you're in. Remove the spotlight (outline: none) and you're shopping in the dark.

ARIA is like a **name badge**: it changes what people *call* something, not what it *can do*. Pinning a "Chef" badge on a waiter (role="button" on a div) doesn't make them cook — you still have to add the skills (keyboard handling, focusability) yourself.`,
    explain: {
      beginner: `**Keyboard access.** Press Tab and you move focus to the next interactive element (links, buttons, inputs); Shift+Tab goes back; Enter activates links and buttons; Space activates buttons and checkboxes; arrow keys move within radio groups and selects; Esc should close dialogs. If you use real <a href>, <button> and form controls, all of this works automatically.

**Focus order** follows the order of elements in the HTML. Keep the source order the same as the visual order, and avoid positive tabindex values.

**Focus indicator.** The browser draws an outline around the focused element. Never remove it without replacing it. **:focus** matches whenever an element has focus — including after a mouse click. **:focus-visible** matches only when the browser decides a visible indicator is helpful, typically keyboard navigation. Mock A20's answer: it applies styling *when an element receives focus in situations where a visible focus indicator is appropriate*.

**Labels and errors.** Every input needs a label; error messages should be text, linked to their field, and explain how to fix the problem.

**Colour.** Text must contrast enough with its background (WCAG AA: at least 4.5:1 for normal text, 3:1 for large text). Never use colour alone to show meaning — an invalid field needs a message or icon, not just a red border (Week 05 slide 25).

**Motion.** Some users get dizzy from animation; respect the prefers-reduced-motion setting.`,
      developer: `Focus styling pattern:

- Keep a strong indicator for keyboard users: button:focus-visible { outline: 3px solid var(--focus); outline-offset: 2px; }
- Optionally quieten mouse clicks: button:focus:not(:focus-visible) { outline: none; } — only alongside the rule above.
- Browsers apply :focus-visible to text inputs even on click (you need to know where you're typing).

tabindex rules: tabindex="0" adds a non-interactive element to the tab order (only if you also give it a role and keyboard handlers); tabindex="-1" makes it focusable by script (element.focus()) but not by Tab — useful for headings you move focus to after route changes, or the first error. Avoid tabindex > 0: it creates a separate, confusing order.

Error wiring in React:

- <input id="email" aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined} />
- <p id="email-error">Enter an email like name@example.com</p>
- On a failed submit, move focus to the first invalid field (React Hook Form's shouldFocusError does this by default) or to an error summary with role="alert".

Live regions: role="alert" (assertive) or role="status" / aria-live="polite" announce dynamic messages such as "Event saved". The region should exist in the DOM before the text changes.

Reduced motion: wrap non-essential animations in @media (prefers-reduced-motion: reduce) { ... } and disable or shorten them.

ARIA's first rule: if a native element provides the semantics and behaviour, use it. Use ARIA to fill gaps, e.g. aria-expanded on a menu toggle, aria-controls pointing to the menu id, aria-label for an icon-only button (exactly the attributes the Bootstrap navbar tutorial uses).`,
      deep: `**WCAG 2.2** organises requirements under POUR — Perceivable, Operable, Understandable, Robust. Relevant success criteria: 1.4.1 Use of Color, 1.4.3 Contrast (Minimum) 4.5:1 / 3:1, 1.4.11 Non-text Contrast (3:1 for UI component boundaries and focus indicators), 2.1.1 Keyboard, 2.1.2 No Keyboard Trap, 2.4.3 Focus Order, 2.4.7 Focus Visible, 2.4.11 Focus Not Obscured (new in 2.2: sticky headers must not hide the focused element), 3.3.1 Error Identification, 3.3.2 Labels or Instructions, 4.1.2 Name, Role, Value.

**Contrast ratio** = (L1 + 0.05) / (L2 + 0.05) where L is relative luminance (0 black – 1 white). Black on white is 21:1; #777 on white is about 4.48:1 — just failing AA for body text.

**SPA-specific traps**: client-side navigation doesn't reset focus or announce a new page as a full reload would. Good routers/apps move focus to the new page's <h1> (with tabIndex={-1}) and update document.title. Modals must trap focus inside while open, close on Esc and return focus to the trigger — the native <dialog> element with showModal() provides much of this.

**Bad ARIA is worse than none** (ARIA Authoring Practices): role="button" on a <div> promises keyboard behaviour it doesn't have; aria-hidden="true" on a focusable element creates a ghost that keyboard users land on but screen readers can't see; a wrong aria-labelledby can silence the real label. ARIA changes only the accessibility tree — never behaviour or appearance.

Testing: unplug the mouse and Tab through every flow; use the browser's accessibility inspector, Lighthouse/axe for automated checks (they find roughly a third of issues), and a screen reader (NVDA, VoiceOver) for the rest.`,
    },
    mechanism: `\`\`\`text
 Input modality heuristic → which pseudo-classes match?

 Event                         :focus   :focus-visible   Typical UI
 ────────────────────────────  ──────   ──────────────   ──────────────────────
 Tab onto <button>               ✔           ✔           ring shown
 Mouse click on <button>         ✔           ✘ (usually) no ring (clean look)
 Mouse click into <input text>   ✔           ✔           ring shown (typing target)
 script el.focus() after a key   ✔           ✔           ring shown
 script el.focus() after a click ✔         depends       browser heuristic

 Tab order = DOM order (tabindex 0 / none), skipping tabindex="-1" and disabled
 ┌────────┐ Tab ┌───────┐ Tab ┌──────────┐ Tab ┌──────────┐ Tab ┌────────┐
 │ Skip   │───▶ │ Nav   │───▶ │ Email    │───▶ │ Password │───▶ │ Submit │
 │ link   │ ◀───│ links │◀─── │ input    │◀─── │ input    │◀─── │ button │
 └────────┘ S+Tab└──────┘     └────┬─────┘     └──────────┘     └────────┘
                                   │ aria-describedby="email-err"
                                   ▼
                          <p id="email-err">Enter a valid email…</p>
                          (read after the label: "Email, invalid entry, Enter a valid email…")
\`\`\`

The browser decides :focus-visible from how focus arrived. Your CSS decides how it looks — make it high-contrast (≥3:1 against adjacent colours) and never remove it without a replacement.`,
    simpleExample: {
      title: "A robust focus style",
      language: "css",
      code: `:root {
  --focus: #1d4ed8;
}

a:focus-visible,
button:focus-visible,
input:focus-visible,
select:focus-visible,
textarea:focus-visible {
  outline: 3px solid var(--focus);
  outline-offset: 2px;
}

button:focus:not(:focus-visible) {
  outline: none;
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}`,
      walkthrough: [
        { lines: "1-3", text: "A custom property for the focus colour, so the ring can be themed consistently." },
        { lines: "5-12", text: ":focus-visible shows a thick ring when the browser decides it's useful (keyboard). outline doesn't affect layout; outline-offset adds breathing room." },
        { lines: "14-16", text: "Only for mouse clicks on buttons: remove the ring. Safe because the :focus-visible rule still applies to keyboard focus." },
        { lines: "18-27", text: "Users who ask the OS for reduced motion get near-instant transitions and no smooth scrolling." },
      ],
    },
    realExample: {
      title: "Accessible field with error wiring (React + TS)",
      language: "tsx",
      code: `import { useId } from "react";

interface TextFieldProps {
  label: string;
  type?: "text" | "email" | "password";
  error?: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
}

export function TextField({ label, type = "text", error, hint, value, onChange }: TextFieldProps) {
  const id = useId();
  const hintId = \`\${id}-hint\`;
  const errorId = \`\${id}-error\`;
  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(" ");

  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy || undefined}
      />
      {hint && <p id={hintId} className="hint">{hint}</p>}
      {error && (
        <p id={errorId} className="error">
          <span aria-hidden="true">⚠ </span>
          {error}
        </p>
      )}
    </div>
  );
}`,
      walkthrough: [
        { lines: "13", text: "useId generates a unique, SSR-safe id so label/input/error ids never collide across multiple fields." },
        { lines: "16", text: "aria-describedby can list several ids separated by spaces: hint first, then the error." },
        { lines: "20", text: "htmlFor (JSX for the for attribute) gives the input its accessible name." },
        { lines: "26", text: "aria-invalid announces 'invalid entry'; omitted entirely when valid." },
        { lines: "30-35", text: "The error is real text (not just a red border) — information is not conveyed by colour alone. The decorative icon is hidden from screen readers." },
      ],
    },
    mistakes: [
      { mistake: "*:focus { outline: none; } to remove 'ugly' rings.", fix: "Never remove focus indication without a replacement. Style :focus-visible with a clear, high-contrast outline instead." },
      { mistake: "Clickable <div>/<span> elements with onClick.", fix: "Use <button> or <a href>. If you truly can't, you must add role, tabindex=\"0\" and Enter/Space key handlers — which is why native is better." },
      { mistake: "Showing errors only with a red border.", fix: "Add an error message in text, linked via aria-describedby, plus aria-invalid. Colour alone fails users with colour-blindness (Week 05 slide 25)." },
      { mistake: "Using positive tabindex values (tabindex=\"3\") to 'fix' order.", fix: "Fix the DOM order instead; use only 0 or -1." },
      { mistake: "Adding ARIA everywhere (role=\"button\" on buttons, aria-label duplicating visible text).", fix: "No ARIA is better than bad ARIA. Use native semantics first; add ARIA only to fill a real gap." },
      { mistake: "Light grey placeholder-style text for body copy.", fix: "Check contrast: 4.5:1 for normal text, 3:1 for large text and UI component borders/focus rings." },
    ],
    debug: {
      prompt: "Keyboard users report they cannot see where they are, cannot open the 'Book' control, and screen readers say 'clickable' with no name for the close icon. Fix the markup and CSS.",
      language: "html",
      buggyCode: `<style>
  * { outline: none; }
  .error { color: red; }
</style>

<div class="btn" onclick="book()">Book</div>
<span class="close" onclick="closeDialog()">✕</span>

<label>Email</label>
<input id="email" style="border-color: red">`,
      hint: "Restore a visible focus indicator, use native buttons, give the icon button an accessible name, associate the label and add a text error.",
      fixedCode: `<style>
  :focus-visible { outline: 3px solid #1d4ed8; outline-offset: 2px; }
  .error { color: #b91c1c; }
</style>

<button type="button" class="btn" onclick="book()">Book</button>
<button type="button" class="close" aria-label="Close dialog" onclick="closeDialog()">
  <span aria-hidden="true">✕</span>
</button>

<label for="email">Email</label>
<input id="email" type="email" aria-invalid="true" aria-describedby="email-error"
       style="border-color: #b91c1c">
<p id="email-error" class="error">Enter an email address like name@example.com.</p>`,
      explanation: "The global outline: none removed every focus indicator (WCAG 2.4.7). Divs/spans are not focusable or keyboard-activatable; <button> is. The ✕ glyph is not a meaningful name, so aria-label supplies one and the glyph is hidden. The label is now associated, and the error is conveyed in text linked to the field rather than by colour only.",
    },
    challenge: {
      prompt: "Write CSS for a 'skip to main content' link that is visually hidden until it receives keyboard focus, then appears at the top-left with a clear focus ring. Also write the HTML that uses it.",
      language: "css",
      hints: [
        "Don't use display: none — hidden elements can't be focused.",
        "Position it off-screen (or clip it) by default, and bring it back with :focus-visible / :focus.",
        "The link's href should target the id of <main>, which may need tabindex=\"-1\" to receive focus in some browsers.",
      ],
      solution: `/* HTML:
<body>
  <a class="skip-link" href="#main">Skip to main content</a>
  <header>…navigation…</header>
  <main id="main" tabindex="-1">…</main>
</body>
*/

.skip-link {
  position: absolute;
  left: 0.5rem;
  top: -100px;
  padding: 0.5rem 1rem;
  background: #ffffff;
  color: #111827;
  border-radius: 0.25rem;
  z-index: 1000;
}

.skip-link:focus,
.skip-link:focus-visible {
  top: 0.5rem;
  outline: 3px solid #1d4ed8;
  outline-offset: 2px;
}

@media (prefers-reduced-motion: no-preference) {
  .skip-link {
    transition: top 150ms ease-out;
  }
}`,
      explanation: "The skip link is the first focusable element, so the first Tab reveals it and Enter jumps past repeated navigation (WCAG 2.4.1 Bypass Blocks). It is moved off-screen rather than display:none so it stays focusable. The slide-in transition is only added for users who haven't requested reduced motion.",
    },
    examQuestions: [
      { question: "MCQ (mock A20): What is the purpose of the CSS pseudo-class :focus-visible? A. To apply styling when an element receives focus in situations where a visible focus indicator is appropriate B. To hide all focused elements C. To prevent keyboard navigation D. To resize elements when clicked", answer: "**A.** :focus-visible matches a focused element when the browser's heuristics decide a visible indicator should be shown (typically keyboard focus), letting you show strong focus rings for keyboard users without showing them on every mouse click.", marks: 1 },
      { question: "Explain the difference between :focus and :focus-visible.", answer: ":focus matches whenever an element has focus, however it got there (keyboard, mouse click, script). :focus-visible matches only when the browser determines focus should be visibly indicated — e.g. keyboard navigation, or any focus on a text input — so mouse users clicking buttons don't see a ring while keyboard users always do.", marks: 2 },
      { question: "Give three techniques that make a form's validation errors accessible.", answer: "1) Show the error as text that explains how to fix it (not colour alone). 2) Link it to the input with aria-describedby and mark the input aria-invalid=\"true\". 3) Associate every input with a <label>, and on failed submit move focus to the first invalid field or an error summary with role=\"alert\".", marks: 3 },
      { question: "What does 'no ARIA is better than bad ARIA' mean? Give an example.", answer: "Incorrect ARIA misinforms assistive technology and can make a page less usable than having none. Example: <div role=\"button\"> without tabindex and key handlers is announced as a button but cannot be reached or activated by keyboard; aria-hidden=\"true\" on a focusable element creates an unnamed focus stop. Prefer native elements like <button>.", marks: 2 },
      { question: "Why should an application not rely on colour alone to show an invalid field?", answer: "Users with colour-vision deficiencies or using screen readers/high-contrast modes may not perceive the colour. Pair colour with text messages, icons or patterns (WCAG 1.4.1; Week 05 slide 25).", marks: 2 },
    ],
    revision: [
      "Everything must work with Tab / Shift+Tab / Enter / Space / Esc — native elements give this for free.",
      "Focus order follows DOM order; use tabindex 0 or -1 only, never positive.",
      ":focus = any focus; :focus-visible = focus where a visible indicator is appropriate (mock A20 answer A).",
      "Never outline: none without a replacement; focus ring ≥3:1 contrast.",
      "Label every input; link hints/errors with aria-describedby; set aria-invalid on errors.",
      "Contrast AA: 4.5:1 normal text, 3:1 large text and UI components. Don't rely on colour alone.",
      "Respect @media (prefers-reduced-motion: reduce).",
      "No ARIA is better than bad ARIA: native HTML first, ARIA (aria-expanded, aria-controls, aria-label) to fill gaps.",
    ],
    visualizers: [],
  },


  /* ================================================================== */
  /* 6. Box model, cascade, specificity                                 */
  /* ================================================================== */
  {
    id: "css-box-model-cascade",
    moduleId: "m02-css",
    title: "Selectors, the Cascade, Specificity and the Box Model",
    summary:
      "How the browser decides which CSS rule wins (origin, importance, layers, specificity, order), what inherits, and how width, padding, border and margin combine into an element's box.",
    priority: "P1",
    minutes: 40,
    objectives: [
      "Write type, class, id, attribute, pseudo-class, pseudo-element and combinator selectors.",
      "Explain the cascade order and calculate specificity as (a, b, c).",
      "Predict which properties inherit and use inherit/initial/unset where needed.",
      "Calculate an element's rendered size under box-sizing: content-box and border-box.",
      "Recognise margin collapsing and the difference between padding and margin.",
    ],
    prerequisites: ["html-semantic-forms"],
    sources: [
      { kind: "university", label: LEC04_HTML, detail: "Core CSS section (fonts, colours, text effects, backgrounds, shadows, gradients, attribute selectors) and Self Study links (CSS selectors reference)" },
      { kind: "supplementary", label: "MDN — Specificity", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity" },
      { kind: "supplementary", label: "MDN — Cascade, specificity and inheritance (Learn)", url: "https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Cascade_and_inheritance" },
      { kind: "supplementary", label: "MDN — box-sizing", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/box-sizing" },
    ],
    why: `"Why isn't my CSS working?" is almost always one of three things: the selector doesn't match, another rule **wins the cascade**, or the **box model** makes the element bigger than you expected. Bootstrap makes this sharper: its classes like .btn-primary have their own specificity, and your overrides only win if you understand how the browser picks a winner.

Lecture 04's attribute-selector example (a[href^="https"], img[alt]) is a taste; this lesson gives you the rules behind it.`,
    analogy: `The cascade is like a **court deciding between conflicting instructions**:

1. Higher courts beat lower ones (origin and !important).
2. Within the same court, the more **specific** instruction wins: "the student with ID W1234567" (id) beats "students in the Cavendish building" (class) beats "students" (type).
3. If they are equally specific, the **most recent** ruling (later in the source) wins.

The box model is a **framed picture**: the picture (content), the mount around it (padding), the frame (border) and the empty wall space you keep from the next picture (margin). box-sizing decides whether "make it 30cm wide" means the picture alone or picture + mount + frame.`,
    explain: {
      beginner: `A CSS **rule** is a selector plus declarations: h1 { color: navy; }. Common selectors:

- **type**: p, button  — **class**: .card — **id**: #main
- **attribute**: input[type="email"], a[href^="https"] (starts with)
- **pseudo-class**: :hover, :focus-visible, :nth-child(2), :first-child
- **pseudo-element**: ::before, ::after, ::placeholder
- **combinators**: .card p (descendant), .card > p (direct child), h2 + p (next sibling)

When two rules set the same property on the same element, the **cascade** decides. The simple version: the rule with higher **specificity** wins; if equal, the rule written **later** wins.

Specificity is counted as three numbers **(a, b, c)**: a = ids, b = classes/attributes/pseudo-classes, c = types/pseudo-elements. Compare left to right: (1,0,0) beats (0,10,0).

Some properties **inherit** from the parent (colour, font, line-height), others don't (margin, padding, border, width, background).

Every element is a **box**: content, then padding, then border, then margin. By default (box-sizing: content-box) width means the content only — so width: 200px with 20px padding and a 2px border is actually 244px wide. With box-sizing: border-box, width includes padding and border, so it stays 200px. Most projects (and Bootstrap) set border-box everywhere.`,
      developer: `**Full cascade order** (highest priority first, for normal web pages):

1. Transitions in progress, then !important declarations (user-agent !important > user !important > author !important — importance *reverses* origin order).
2. Animations.
3. Normal author declarations (your CSS and Bootstrap), then user, then user-agent defaults.

Within the same origin and importance: **cascade layers** (@layer — unlayered styles beat layered ones for normal declarations), then **specificity**, then **source order**. Inline style="..." beats any selector specificity for normal declarations.

**Calculating specificity:**

| Selector | a (id) | b (class/attr/pseudo-class) | c (type/pseudo-element) |
|---|---|---|---|
| p | 0 | 0 | 1 |
| .card .title | 0 | 2 | 0 |
| #nav a:hover | 1 | 1 | 1 |
| input[type="email"]:focus | 0 | 2 | 1 |
| ul li::before | 0 | 0 | 3 |
| * and combinators | 0 | 0 | 0 |

:is(), :not() and :has() take the specificity of their **most specific argument**; :where() always contributes **zero** — great for low-priority defaults that are easy to override.

**Inheritance** keywords: inherit (copy parent value), initial (spec default), unset (inherit if inheritable, else initial), revert (back to browser default).

**Box model:** total width (content-box) = width + padding-left + padding-right + border-left + border-right; margin is outside and doesn't count toward the element's own box. The usual reset:

*, *::before, *::after { box-sizing: border-box; }

**Margin collapsing**: vertical margins between adjacent block siblings (and between a parent and its first/last child with no padding/border between them) collapse to the larger value. They don't collapse inside flex or grid containers.`,
      deep: `Specificity is compared **component-wise**, not as a decimal number — 11 classes (0,11,0) never beat one id (1,0,0). This is why ids in stylesheets are a maintenance trap: they force everything after them to escalate. Professional CSS keeps specificity flat and low (one or two classes), uses :where() for base styles, and uses @layer to order whole groups (reset, framework, components, utilities) independently of specificity.

!important is a different axis, not "very high specificity". Two !important declarations still compare by layer, specificity and order. Bootstrap 5's utility classes (e.g. .d-none, .mt-3, .text-center) use !important deliberately so utilities always win over component styles — which is also why your plain .card { margin-top: 0 } can't override .mt-3 on the same element.

**Computed values pipeline:** declared values → cascaded value (the winner) → specified value (inheritance/defaults applied) → computed value (em/% resolved where possible; this is what children inherit) → used value (after layout, e.g. percentages of the actual container) → actual value (rounded to device pixels). Inheritance passes the **computed** value: a parent with font-size: 2em passes down the resolved pixel size, not "2em" again, whereas line-height: 1.5 (unitless) passes the *number*, which is why unitless line-heights scale properly.

Box details worth knowing: percentages in padding and margin are relative to the containing block's **width**, even for top/bottom. outline and box-shadow don't affect layout (handy for focus rings). Inline elements ignore width/height and vertical margins; inline-block respects them.`,
    },
    mechanism: `\`\`\`text
 THE CASCADE (for one property on one element)

 all matching declarations
        │
        ▼
 1. Origin & importance ──▶ author !important > author normal > UA defaults
        │ tie
        ▼
 2. Cascade layer       ──▶ (normal) unlayered > later @layer > earlier @layer
        │ tie
        ▼
 3. Specificity (a,b,c) ──▶ compare a, then b, then c
        │ tie
        ▼
 4. Source order        ──▶ last declared wins
        │
        ▼ winner = cascaded value  (no declaration? inherited or initial value)

 THE BOX (box-sizing: content-box)

 ┌──────────────────── margin (transparent, outside) ─────────────────┐
 │  ┌──────────────────── border ───────────────────────────────┐     │
 │  │  ┌──────────────── padding ──────────────────────────┐    │     │
 │  │  │       ┌──────── content: width × height ────┐     │    │     │
 │  │  │       │                                      │     │    │     │
 │  │  │       └──────────────────────────────────────┘     │    │     │
 │  │  └────────────────────────────────────────────────────┘    │     │
 │  └────────────────────────────────────────────────────────────┘     │
 └────────────────────────────────────────────────────────────────────┘
 content-box: rendered width = width + 2×padding + 2×border
 border-box : rendered width = width   (content shrinks to fit padding + border)
\`\`\`

Try both in the specificity and box-model visualizers: change a selector and watch (a,b,c) update; switch box-sizing and watch the outer size change.`,
    simpleExample: {
      title: "Which colour wins?",
      language: "html",
      code: `<style>
  p { color: black; }                 /* (0,0,1) */
  .note { color: green; }             /* (0,1,0) */
  article .note { color: orange; }    /* (0,1,1) */
  #intro { color: blue; }             /* (1,0,0) */
  .note.highlight { color: purple; }  /* (0,2,0) */
</style>

<article>
  <p id="intro" class="note highlight">What colour am I?</p>
  <p class="note highlight">And me?</p>
</article>`,
      walkthrough: [
        { lines: "2-6", text: "Five rules, each annotated with its (a,b,c) specificity." },
        { lines: "10", text: "First paragraph matches all five. #intro (1,0,0) has an id, which beats any number of classes → blue." },
        { lines: "11", text: "Second paragraph: no id. Candidates .note.highlight (0,2,0) vs article .note (0,1,1): compare b first, 2 > 1 → purple." },
      ],
    },
    realExample: {
      title: "A card component with a border-box reset and low-specificity overrides",
      language: "css",
      code: `*,
*::before,
*::after {
  box-sizing: border-box;
}

body {
  font-family: system-ui, sans-serif;
  line-height: 1.5;
  color: #1f2937;
}

:where(.card) {
  padding: 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
}

.card {
  width: 320px;
  background: #ffffff;
}

.card--featured {
  border-color: #2563eb;
  border-width: 3px;
}

.card a[href^="https"] {
  color: #047857;
}

.card img[alt] {
  max-width: 100%;
  display: block;
}`,
      walkthrough: [
        { lines: "1-5", text: "Border-box everywhere: a 320px card stays 320px wide whatever padding/border it gets." },
        { lines: "7-11", text: "font-family, line-height and color inherit, so setting them on body styles all text. line-height is unitless so it scales with each element's font-size." },
        { lines: "13-17", text: ":where() has zero specificity, so these base styles can be overridden by any single class later." },
        { lines: "24-27", text: ".card--featured (0,1,0) easily overrides the border because the base rule is (0,0,0)." },
        { lines: "29-31", text: "Lecture 04's attribute selector: links whose href starts with https are styled green. Specificity (0,2,1)." },
        { lines: "33-36", text: "img[alt] targets only images that have an alt attribute; max-width: 100% keeps them inside the card." },
      ],
    },
    mistakes: [
      { mistake: "Thinking 11 classes beat one id because 11 > 1 '100'.", fix: "Specificity compares component by component: any id (1,0,0) beats (0,11,0)." },
      { mistake: "Reaching for !important to fix every conflict.", fix: "Find the winning rule in DevTools (Styles shows crossed-out declarations) and lower/raise specificity deliberately, or use @layer/:where()." },
      { mistake: "Forgetting padding and border make content-box elements wider, causing overflow or wrapping.", fix: "Use the global box-sizing: border-box reset (Bootstrap already sets it)." },
      { mistake: "Expecting margin, padding or border to inherit.", fix: "Only some properties inherit (mostly text-related). Use inherit explicitly if needed." },
      { mistake: "Being surprised by the gap between a heading's margin and its parent (margin collapsing).", fix: "Add padding/border to the parent, use flex/grid with gap, or use display: flow-root." },
    ],
    debug: {
      prompt: "The 'Delete' button should be red, but it renders Bootstrap blue, and the 300px sidebar is overflowing its 300px column. Explain and fix without using !important.",
      language: "html",
      buggyCode: `<style>
  .danger { background-color: #dc2626; }
  .sidebar { width: 300px; padding: 24px; border: 2px solid #e5e7eb; }
</style>

<aside class="sidebar">
  <nav id="tools">
    <button class="btn btn-primary danger">Delete</button>
  </nav>
</aside>

<!-- Bootstrap's own rule (loaded AFTER the style block above): -->
<!-- .btn-primary { background-color: #0d6efd; } -->`,
      hint: ".danger and .btn-primary have equal specificity — what breaks the tie? And what does width mean under content-box?",
      fixedCode: `<style>
  #tools .danger,
  .btn.danger { background-color: #dc2626; }
  .sidebar { box-sizing: border-box; width: 300px; padding: 24px; border: 2px solid #e5e7eb; }
</style>

<aside class="sidebar">
  <nav id="tools">
    <button class="btn btn-danger">Delete</button>
  </nav>
</aside>`,
      explanation: ".danger (0,1,0) ties with .btn-primary (0,1,0), and Bootstrap's rule comes later, so source order wins. The best fix is to use Bootstrap's own .btn-danger variant (and drop btn-primary); otherwise raise specificity (.btn.danger is (0,2,0)) or load your stylesheet after Bootstrap. In real Bootstrap 5.3 the button colours come from CSS variables like --bs-btn-bg, so overriding the variable on .danger is another clean option. The sidebar was 300 + 48 + 4 = 352px under content-box; border-box keeps it at 300px.",
    },
    challenge: {
      prompt: "Without a browser, compute: (1) the specificity of each selector: nav#main > ul li.active a:hover, .form input[type=\"text\"]::placeholder, :where(#app) .btn, :is(#a, .b) span. (2) The rendered width of a div with width: 50%; padding: 10px 20px; border: 3px solid; margin: 0 auto inside a 600px container, for content-box and border-box.",
      language: "text",
      hints: [
        "Count ids, then classes/attributes/pseudo-classes, then types/pseudo-elements.",
        ":where() contributes nothing; :is() takes its most specific argument.",
        "Horizontal padding is 20px on each side here (the second value of the shorthand).",
      ],
      solution: `(1) Specificity
 nav#main > ul li.active a:hover        → ids: #main = 1
                                          classes/pseudo-classes: .active, :hover = 2
                                          types: nav, ul, li, a = 4        → (1,2,4)
 .form input[type="text"]::placeholder  → .form, [type="text"] = 2; input, ::placeholder = 2 → (0,2,2)
 :where(#app) .btn                      → :where() = 0; .btn = 1         → (0,1,0)
 :is(#a, .b) span                       → :is takes #a (1,0,0); span = 1 → (1,0,1)

(2) Width (container 600px → width: 50% = 300px)
 content-box: 300 + 20 + 20 + 3 + 3 = 346px rendered border-box width
 border-box : 300px rendered; content area = 300 − 40 − 6 = 254px
 margin: 0 auto centres it in both cases (margins are outside the box).`,
      explanation: "Note that :is() with an id argument gives (1,0,0) even when the element actually matched via .b — a classic surprise. Percent widths resolve against the containing block's content width before padding/border are added.",
    },
    examQuestions: [
      { question: "Calculate the specificity of #header .nav a:hover and explain whether it beats .nav .link.active.current.", answer: "#header .nav a:hover = (1,2,1): 1 id, 2 (.nav, :hover), 1 type (a). .nav .link.active.current = (0,4,0). Comparing left to right, 1 > 0 ids, so the first selector wins regardless of the four classes.", marks: 2 },
      { question: "An element has width: 200px, padding: 15px, border: 5px solid and margin: 10px. What is its rendered width with box-sizing: content-box and with border-box?", answer: "content-box: 200 + 2×15 + 2×5 = 240px (plus 20px of margin space outside, 260px occupied). border-box: 200px rendered (content 160px), still 220px occupied including margins.", marks: 2 },
      { question: "List the factors the cascade uses, in order, to decide between conflicting declarations.", answer: "Origin and importance (e.g. !important author > normal author > browser defaults), cascade layers, specificity, then source order (last wins). Inline styles beat selector-based author styles for normal declarations.", marks: 2 },
      { question: "Name two properties that inherit by default and two that do not.", answer: "Inherit: color, font-family (also font-size, line-height, visibility). Don't inherit: margin, padding, border, width, background.", marks: 2 },
    ],
    revision: [
      "Selectors: type, .class, #id, [attr^=val], :pseudo-class, ::pseudo-element, combinators (space, >, +, ~).",
      "Cascade: origin/importance → layers → specificity → source order.",
      "Specificity (a,b,c) = (ids, classes/attrs/pseudo-classes, types/pseudo-elements), compared left to right.",
      ":where() = 0 specificity; :is()/:not()/:has() = most specific argument; * and combinators = 0.",
      "Text properties inherit (color, font, line-height); box properties don't.",
      "Box: content → padding → border → margin.",
      "content-box: width excludes padding+border; border-box: width includes them (use it globally).",
      "Vertical margins collapse between blocks, but not inside flex/grid containers.",
    ],
    visualizers: ["box-model", "specificity"],
  },

  /* ================================================================== */
  /* 7. Flexbox                                                         */
  /* ================================================================== */
  {
    id: "css-flexbox",
    moduleId: "m02-css",
    title: "Flexbox: One-Dimensional Layout",
    summary:
      "Lay items out along a main axis and align them on the cross axis with justify-content, align-items, gap, flex-wrap and the flex shorthand.",
    priority: "P1",
    minutes: 35,
    objectives: [
      "Identify the main and cross axes for flex-direction row and column.",
      "Use justify-content, align-items, align-self and gap to distribute and align items.",
      "Control wrapping with flex-wrap and multi-line alignment with align-content.",
      "Explain flex-grow, flex-shrink, flex-basis and the shorthands flex: 1, flex: auto and flex: none.",
    ],
    prerequisites: ["css-box-model-cascade"],
    sources: [
      { kind: "university", label: LEC04_BS2, detail: "Bootstrap 5 Grid System — 'built with flexbox'" },
      { kind: "university", label: LEC04_BS3, detail: "Bootstrap Utilities — flexbox utilities (flex, row, column, justify, alignment and axis)" },
      { kind: "supplementary", label: "MDN — CSS flexible box layout", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout" },
      { kind: "supplementary", label: "MDN — flex shorthand", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/flex" },
    ],
    why: `Navbars, button rows, card footers, centring a spinner, pushing a "Logout" link to the right — these are all **one-dimensional** problems: arrange things in a row (or column) and decide how spare space is shared. Before flexbox this needed floats and hacks. Bootstrap's grid itself is built on flexbox (Lecture 04 Bootstrap part 02), and classes like d-flex, justify-content-between and ms-auto are flexbox under the hood. Understanding flexbox means you understand what those classes actually do.`,
    analogy: `Picture books on a **shelf** (the flex container). The shelf's length is the **main axis**; its depth/height is the **cross axis**.

- justify-content decides how you spread the books along the shelf: all to the left, centred, or evenly spaced.
- align-items decides how tall books and short books sit: all standing on the bottom, centred, or stretched to the shelf height.
- flex-grow is how eagerly a book "expands" to take up leftover shelf space; flex-shrink is how willing it is to be squashed when the shelf is too short.
- Rotate the shelf upright (flex-direction: column) and the axes swap with it.`,
    explain: {
      beginner: `Add display: flex to a parent and its direct children become **flex items** laid out in a line.

- **flex-direction** sets the **main axis**: row (left→right, the default) or column (top→bottom). The **cross axis** is perpendicular.
- **justify-content** aligns items along the **main axis**: flex-start, center, flex-end, space-between (first and last at the edges), space-around, space-evenly.
- **align-items** aligns items on the **cross axis**: stretch (default — items fill the container's height in a row), flex-start, center, flex-end, baseline.
- **gap** puts space *between* items (no extra space at the edges): gap: 1rem.
- **flex-wrap: wrap** lets items flow onto new lines instead of squashing onto one.

On the items:
- **flex: 1** makes an item grow to fill available space (several items with flex: 1 share it equally).
- **align-self** overrides align-items for one item.
- **margin-left: auto** (or Bootstrap's ms-auto) absorbs all free space on that side — the classic way to push the last navbar item to the right.

Centring something perfectly is two lines on the parent: justify-content: center; align-items: center; (plus a height for vertical centring to be visible).`,
      developer: `The **flex shorthand** is flex: <grow> <shrink> <basis>:

| Shorthand | Expands to | Meaning |
|---|---|---|
| flex: initial (default) | 0 1 auto | don't grow, may shrink, size from width/content |
| flex: 1 | 1 1 0% | grow equally from a zero base → equal widths |
| flex: auto | 1 1 auto | grow from content size → wider content stays wider |
| flex: none | 0 0 auto | rigid; neither grows nor shrinks |
| flex: 0 0 250px | — | a fixed 250px sidebar |

**flex-basis** is the starting main-size before free space is distributed. With flex: 1 every item starts at 0 and gets equal shares; with flex: auto items start at content width, so a long label ends up wider.

Wrapping: flex-wrap: wrap creates flex *lines*; **align-content** distributes those lines on the cross axis (it does nothing for a single line). flex-flow: row wrap is the shorthand for direction + wrap.

Bootstrap 5 mapping: d-flex → display:flex; flex-column; justify-content-between; align-items-center; flex-wrap; gap-3; flex-grow-1; ms-auto; responsive variants such as flex-md-row. order (and Bootstrap's order-* classes) changes visual order only — keyboard/screen-reader order still follows the DOM, so use it sparingly.

Remember row-reverse/column-reverse also flip visual order but not DOM order, and that in a column container justify-content works vertically (it needs a definite height to have free space).`,
      deep: `**The flex algorithm, simplified:**

1. Determine each item's **hypothetical main size** from flex-basis (auto → width/height or content size), clamped by min/max.
2. Sum them plus gaps; compare with the container's inner main size → **free space** (positive or negative).
3. Positive free space: distribute proportionally to **flex-grow**. Negative: shrink proportionally to **flex-shrink × flex-basis** (bigger items shrink more in absolute terms).
4. Clamp results by min/max; if any item hits a limit, freeze it and redistribute (loop).
5. Apply justify-content to leftover space (only if no item grew), then cross-axis alignment.

**The min-width: auto trap:** flex items have an automatic minimum size of their *min-content* width. A long URL or a <pre> inside a flex: 1 item will refuse to shrink and overflow the container. Fix with min-width: 0 (or overflow: hidden) on the item. This is the single most common "flexbox is broken" bug.

**Flex vs Grid:** flex is content-out and one-dimensional — items size themselves and lines don't align with each other across rows. Grid is layout-in and two-dimensional — you define tracks and items snap to them. A wrapped flex "card grid" with uneven last rows is usually a sign you want CSS Grid (next lesson). A good rule: grid for page/card layouts, flex for components and alignment inside them.

Auto margins resolve **before** justify-content, which is why margin-left: auto overrides space-between for that item. Percentages in flex-basis resolve against the container's inner main size; gap is not included in those percentages, which is why Bootstrap uses padding-based gutters on columns.`,
    },
    mechanism: `\`\`\`text
 flex-direction: row
            main axis ───────────────────────────────▶ (justify-content)
          ┌─────────────────────────────────────────────────────────┐
 cross    │ ┌──────┐  gap  ┌────────────┐  gap  ┌──────┐            │
 axis     │ │ item │ ◀───▶ │  flex: 1   │ ◀───▶ │ item │  free      │
 │        │ │  A   │       │   grows    │       │  C   │  space?    │
 │        │ └──────┘       └────────────┘       └──────┘            │
 ▼        └─────────────────────────────────────────────────────────┘
(align-items)

 Free space distribution:
   container 900px, gap 2×16 = 32px
   A: flex 0 0 200px  → 200
   B: flex 1 1 0%     → 900 − 32 − 200 − 150 = 518
   C: flex 0 0 150px  → 150

 flex-direction: column  →  axes rotate:
   main axis ↓ (justify-content works vertically)
   cross axis → (align-items works horizontally)
\`\`\`

Key insight: **justify-* always follows the main axis**, **align-* always follows the cross axis** — so when you change flex-direction, the property that centres vertically changes too.`,
    simpleExample: {
      title: "Navbar with a pushed-right logout link",
      language: "html",
      code: `<style>
  .nav {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.75rem 1rem;
    background: #1f2937;
  }
  .nav a { color: #f9fafb; }
  .nav .logout { margin-left: auto; }
</style>

<nav class="nav" aria-label="Main">
  <a href="/">CampusEvents</a>
  <a href="/events">Events</a>
  <a href="/bookings">My bookings</a>
  <a class="logout" href="/logout">Log out</a>
</nav>`,
      walkthrough: [
        { lines: "3", text: "The nav becomes a flex container; its four links become flex items in a row." },
        { lines: "4", text: "Vertically centre the links on the cross axis." },
        { lines: "5", text: "gap spaces the links without margins on each one." },
        { lines: "10", text: "An auto margin swallows all free space on the left of Log out, pushing it to the far right (Bootstrap: ms-auto)." },
      ],
    },
    realExample: {
      title: "Event card with a sticky-bottom footer and a responsive toolbar",
      language: "css",
      code: `.event-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  overflow: hidden;
}

.event-card__body {
  flex: 1;
  padding: 1rem;
}

.event-card__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  border-top: 1px solid #e5e7eb;
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.toolbar__search {
  flex: 1 1 240px;
  min-width: 0;
}

.toolbar__button {
  flex: none;
}`,
      walkthrough: [
        { lines: "1-4", text: "The card is a column flex container that fills its grid cell's height." },
        { lines: "10-13", text: "The body grows (flex: 1) so footers of cards with short descriptions line up at the bottom." },
        { lines: "15-21", text: "Inside the footer: price on the left, 'Book' button on the right, vertically centred." },
        { lines: "23-27", text: "The toolbar wraps onto a new line on narrow screens instead of overflowing." },
        { lines: "29-32", text: "The search box prefers 240px, grows into spare space, and min-width: 0 lets it shrink below its content's min-content size." },
        { lines: "34-36", text: "Buttons keep their natural size (0 0 auto)." },
      ],
    },
    mistakes: [
      { mistake: "Using align-items to centre horizontally in a row container.", fix: "In a row, horizontal = main axis → justify-content. align-items handles the cross (vertical) axis." },
      { mistake: "Applying justify-content to the items instead of the container.", fix: "justify-content/align-items/gap/flex-wrap go on the container; flex, align-self and order go on the items." },
      { mistake: "Text or long words overflowing a flex: 1 item.", fix: "Add min-width: 0 (or overflow: hidden) to the item to override the automatic min-content minimum." },
      { mistake: "Expecting vertical centring in a column/full-page layout without any height.", fix: "The container needs a height (e.g. min-height: 100vh) for there to be free space to distribute." },
      { mistake: "Using order or row-reverse to fix tab order.", fix: "These change only visual order; fix the DOM order so keyboard and screen readers match." },
    ],
    debug: {
      prompt: "The spinner should sit in the exact centre of the loading panel, but it sticks to the top-left. Fix it.",
      language: "css",
      buggyCode: `.loading-panel {
  height: 300px;
  border: 1px dashed #9ca3af;
}

.loading-panel .spinner {
  display: flex;
  justify-content: center;
  align-content: center;
  width: 48px;
  height: 48px;
}`,
      hint: "Which element should be the flex container? Which property aligns a single line of items on the cross axis?",
      fixedCode: `.loading-panel {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  border: 1px dashed #9ca3af;
}

.loading-panel .spinner {
  width: 48px;
  height: 48px;
}`,
      explanation: "Alignment properties act on the children of a flex container, so display:flex belongs on the panel, not the spinner. align-content only distributes multiple flex lines; for a single line you need align-items: center on the cross axis.",
    },
    challenge: {
      prompt: "Build the CSS for a 'holy grail' app layout using only flexbox: a header and footer at full width, and between them a 200px fixed left nav, a fluid main area, and a 250px right aside. The footer should stay at the bottom of the viewport even when content is short. Below 768px, the three middle columns should stack vertically.",
      language: "css",
      starterCode: `/* HTML:
<div class="app">
  <header>…</header>
  <div class="middle">
    <nav>…</nav>
    <main>…</main>
    <aside>…</aside>
  </div>
  <footer>…</footer>
</div>
*/`,
      hints: [
        "Make .app a column flex container with min-height: 100vh and let .middle grow.",
        "Use flex: 0 0 200px for the fixed columns and flex: 1 for main.",
        "In a media query, switch .middle to flex-direction: column (mobile-first: start with column).",
      ],
      solution: `.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.middle {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.middle > main {
  flex: 1;
  min-width: 0;
}

@media (min-width: 768px) {
  .middle {
    flex-direction: row;
  }
  .middle > nav {
    flex: 0 0 200px;
  }
  .middle > aside {
    flex: 0 0 250px;
  }
}`,
      explanation: "The outer column container with min-height: 100vh and a growing middle pushes the footer to the bottom. The layout is written mobile-first: stacked by default, three columns from 768px. The fixed columns use flex: 0 0 <size> so they neither grow nor shrink, and main takes the rest with min-width: 0 to avoid overflow. (CSS Grid with grid-template-areas is often cleaner for this — see the next lesson.)",
    },
    examQuestions: [
      { question: "In a container with display: flex; flex-direction: column;, which property centres items horizontally?", answer: "align-items: center. In a column container the main axis is vertical (justify-content) and the cross axis is horizontal (align-items).", marks: 1 },
      { question: "Explain the difference between flex: 1 and flex: auto.", answer: "flex: 1 = 1 1 0%: items start from a zero basis and share all space by their grow factors, so equal flex: 1 items become equal width. flex: auto = 1 1 auto: items start at their content/width size and share only the leftover space, so items with more content stay wider.", marks: 2 },
      { question: "What does the Bootstrap class ms-auto do inside a d-flex navbar, in CSS terms?", answer: "It sets margin-left (margin-inline-start) to auto. In a flex container an auto margin absorbs all free space on that side, pushing the element (and those after it) to the end of the main axis.", marks: 2 },
      { question: "State one situation where CSS Grid is a better choice than flexbox.", answer: "When you need two-dimensional alignment — rows and columns lining up — such as a page layout with named areas or a card gallery where every row's columns align. Flexbox is one-dimensional and lines are laid out independently.", marks: 1 },
    ],
    revision: [
      "display: flex on the parent; direct children become flex items.",
      "Main axis = flex-direction (row default); cross axis is perpendicular.",
      "justify-content → main axis; align-items / align-self → cross axis; align-content → multiple lines.",
      "gap spaces items without edge spacing; flex-wrap: wrap allows multiple lines.",
      "flex: grow shrink basis — 1 = 1 1 0%, auto = 1 1 auto, none = 0 0 auto.",
      "margin-left: auto (ms-auto) pushes an item to the end.",
      "Overflowing flex item? add min-width: 0.",
      "order/row-reverse change visuals only, not tab order.",
    ],
    visualizers: ["flexbox"],
  },

  /* ================================================================== */
  /* 8. CSS Grid                                                        */
  /* ================================================================== */
  {
    id: "css-grid",
    moduleId: "m02-css",
    title: "CSS Grid: Tracks, fr, minmax(), auto-fit and Named Areas",
    summary:
      "Define two-dimensional layouts with grid-template-columns, the fr unit, repeat(), minmax(), auto-fit/auto-fill and readable grid-template-areas.",
    priority: "P0",
    examCritical: true,
    minutes: 40,
    objectives: [
      "Create grids with grid-template-columns/rows, the fr unit, gap and repeat().",
      "Use minmax() to set minimum and maximum track sizes (mock B12).",
      "Explain the difference between auto-fit and auto-fill in responsive card grids.",
      "Build page layouts with grid-template-areas and grid-area (mock A9).",
      "Place items explicitly with grid-column / grid-row line numbers and span.",
    ],
    prerequisites: ["css-flexbox"],
    sources: [
      { kind: "mock", label: MOCK, detail: "A9 (grid-template-areas), B12 (minmax() for grid tracks)" },
      { kind: "supplementary", label: "MDN — CSS grid layout", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout" },
      { kind: "supplementary", label: "MDN — grid-template-areas", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template-areas" },
      { kind: "supplementary", label: "MDN — minmax()", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/minmax" },
      { kind: "supplementary", label: "MDN — repeat()", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/repeat" },
    ],
    why: `Grid is the layout system for **two dimensions** at once: rows *and* columns that line up. It replaces most media-query-heavy layout code — a single line like grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)) gives a fully responsive card gallery with no breakpoints.

The mock ICT asks directly about it: **A9** (which property creates layouts with named grid areas → grid-template-areas) and **B12** (minmax() can specify minimum and maximum sizes for grid tracks → True). Lecture 8 (Responsive UI) wasn't supplied, so this lesson is built from MDN.`,
    analogy: `Grid is a **spreadsheet or a car park**. You paint the lines first (define tracks), then park items into bays. An item can take one bay or span several. grid-template-areas is like drawing a **map of the car park in text**, writing "header" in the bays reserved for the header, "sidebar" for the sidebar, and so on — then you just tell each element which named zone it belongs to.

The fr unit is "a share of whatever's left": three columns of 1fr 2fr 1fr split the remaining width into four shares, giving the middle one two shares.`,
    explain: {
      beginner: `Set display: grid on a container and describe the columns (and optionally rows):

- grid-template-columns: 200px 1fr 1fr; → a 200px column, then two columns sharing the rest equally.
- The **fr** unit means "fraction of the leftover space".
- **gap: 1rem** adds space between rows and columns.
- **repeat(4, 1fr)** is shorthand for 1fr 1fr 1fr 1fr.
- **minmax(min, max)** sets a size range for a track: minmax(200px, 1fr) means "at least 200px, otherwise share the space".

Children fill the cells automatically, left to right, row by row (auto-placement).

**Named areas** let you draw the layout with words:

grid-template-areas:
  "header header"
  "sidebar main"
  "footer footer";

Each string is a row; each word is a cell. Repeating a name makes that area span cells. Then give each child grid-area: header; and so on. A dot (.) marks an empty cell. Areas must be rectangles.

For a responsive card gallery: grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); — the browser creates as many 250px-or-wider columns as fit, and stretches them to fill the row. On a phone you get one column, on a laptop three or four — no media queries needed.`,
      developer: `**Track sizing values**: fixed lengths (px, rem), percentages, fr, auto, min-content, max-content, fit-content(300px), and minmax(min, max). fr cannot be used as a minimum: minmax(1fr, 2fr) is invalid, while minmax(0, 1fr) is common.

**1fr really means minmax(auto, 1fr)**: a column won't shrink below its content's minimum. A long word or <pre> in a 1fr column can blow out the layout; use minmax(0, 1fr) to allow true equal shrinking.

**auto-fill vs auto-fit** (both only inside repeat()):
- Both create as many tracks as fit given the minimum size.
- **auto-fill** keeps the extra *empty* tracks, so with few items the items stay at their minimum-ish width and empty columns remain.
- **auto-fit** collapses empty tracks to 0, so the existing items **stretch** to fill the row (when the max is 1fr).
- When there are enough items to fill every track, they look identical.

**Explicit placement** uses line numbers (lines are numbered from 1; negative numbers count from the end): grid-column: 1 / -1 spans the full width; grid-column: span 2 spans two tracks from wherever it's auto-placed; grid-row: 2 / 4.

**Areas and responsiveness**: redefine only grid-template-areas and grid-template-columns inside a media query and the children move — HTML stays the same. Use grid-auto-rows: minmax(150px, auto) for implicit rows created by auto-placement, and grid-auto-flow: dense to backfill holes (visual order then differs from DOM order — careful with accessibility).

Alignment: justify-items/align-items align items within their cells; justify-content/align-content align the whole grid within the container; place-items: center sets both.`,
      deep: `**Track sizing algorithm (outline):** fixed tracks are resolved first; then intrinsic tracks (auto, min-content, max-content, minimum of minmax with content keywords) are sized from their items, including items that span; finally fr tracks share the **remaining** free space. If the leftover per fr would make a flexible track smaller than its base size, the algorithm treats that track as inflexible and recomputes — this is why 1fr columns can be unequal when content is wide.

**auto-fit/auto-fill counting**: the browser computes how many tracks fit using the *minimum* of minmax() (or the fixed size): floor((container + gap) / (min + gap)). With repeat(auto-fit, minmax(250px, 1fr)) in a 1000px container with 16px gaps: floor(1016 / 266) = 3 tracks. A gotcha: if the min exceeds the container (e.g. a 250px minimum on a 220px phone), the track overflows; repeat(auto-fit, minmax(min(250px, 100%), 1fr)) fixes it by capping the minimum at the container width.

**Subgrid** (grid-template-columns: subgrid, supported in all modern browsers) lets nested items (e.g. card title/body/footer) align with the parent's tracks — solving "card footers don't line up" without fixed heights.

**Accessibility**: grid changes only visual placement. Reordering with areas or line numbers doesn't change DOM/tab order; screen readers read source order. Keep the DOM in a logical reading order and use areas to adjust the visuals only within reason.

**Grid vs Bootstrap**: Bootstrap's .row/.col is a 12-column flexbox system with class-driven breakpoints. Native grid gives you arbitrary track definitions and named areas in CSS — many teams use Bootstrap components with CSS Grid for page layout. Bootstrap 5 also ships an opt-in CSS Grid mode (.grid with .g-col-*), disabled by default.`,
    },
    mechanism: `\`\`\`text
 .layout {
   display: grid;
   grid-template-columns: 220px 1fr;           col lines:  1      2              3
   grid-template-rows: auto 1fr auto;                      │ 220px│     1fr      │
   grid-template-areas:                        row 1 ──────┼──────┴──────────────┤
     "header  header"                                      │   header (spans 2)  │
     "sidebar main"                            row 2 ──────┼──────┬──────────────┤
     "footer  footer";                                     │sidebar│    main     │
 }                                             row 3 ──────┼──────┴──────────────┤
                                                           │   footer (spans 2)  │
 header  { grid-area: header; }                row 4 ──────┴─────────────────────┘
 aside   { grid-area: sidebar; }
 main    { grid-area: main; }               header ≡ grid-row: 1 / 2; grid-column: 1 / 3

 auto-fill vs auto-fit — 2 items, container fits 4 tracks of minmax(200px, 1fr)

 auto-fill: │ item │ item │ (empty) │ (empty) │   empty tracks kept
 auto-fit : │     item     │     item       │   empty tracks collapse → items stretch
\`\`\`

Each string in grid-template-areas is one row; the number of words per string must equal the number of columns; repeated names merge into a rectangle.`,
    simpleExample: {
      title: "Responsive card gallery with no media queries",
      language: "css",
      code: `.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(250px, 100%), 1fr));
  gap: 1.5rem;
}

.gallery > .card {
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  padding: 1rem;
}

.gallery > .card--wide {
  grid-column: span 2;
}`,
      walkthrough: [
        { lines: "2", text: "The cards' container becomes a grid." },
        { lines: "3", text: "As many columns as fit, each at least 250px (or 100% on tiny screens) and at most an equal share. auto-fit stretches the cards when there are fewer than the row could hold." },
        { lines: "4", text: "gap spaces both rows and columns." },
        { lines: "13-15", text: "A featured card spans two column tracks wherever it is auto-placed. (On a single-column screen, span 2 would create an extra implicit column, so you'd reset this in a media query.)" },
      ],
    },
    realExample: {
      title: "CampusEvents dashboard with named areas that rearrange on mobile",
      language: "css",
      code: `.dashboard {
  display: grid;
  min-height: 100vh;
  gap: 1rem;
  grid-template-columns: 1fr;
  grid-template-rows: auto auto 1fr auto;
  grid-template-areas:
    "header"
    "filters"
    "events"
    "footer";
}

.dashboard > header { grid-area: header; }
.dashboard > .filters { grid-area: filters; }
.dashboard > .events { grid-area: events; }
.dashboard > footer { grid-area: footer; }

@media (min-width: 992px) {
  .dashboard {
    grid-template-columns: 260px minmax(0, 1fr);
    grid-template-rows: auto 1fr auto;
    grid-template-areas:
      "header  header"
      "filters events"
      "footer  footer";
  }
}

.events {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  grid-auto-rows: minmax(180px, auto);
  gap: 1rem;
}`,
      walkthrough: [
        { lines: "1-11", text: "Mobile-first: one column, areas stacked top to bottom. The 1fr row lets the events area grow and pushes the footer down." },
        { lines: "13-16", text: "Each child is assigned to an area by name — no line numbers needed." },
        { lines: "18-27", text: "From 992px only the template changes: a 260px filter sidebar beside the events. The HTML is untouched. minmax(0, 1fr) prevents long content from blowing out the main column." },
        { lines: "29-34", text: "Nested grid for event cards. auto-fill keeps card widths consistent even when a filter returns only one or two events. Implicit rows are at least 180px tall." },
      ],
    },
    mistakes: [
      { mistake: "Non-rectangular or mismatched grid-template-areas (e.g. an L-shaped 'main' or rows with different word counts).", fix: "Every string must have the same number of cells and each named area must form a rectangle; otherwise the whole declaration is invalid and ignored." },
      { mistake: "Quoting the name in grid-area (grid-area: \"header\") or forgetting the quotes in grid-template-areas.", fix: "Strings in grid-template-areas are quoted; grid-area takes an unquoted identifier: grid-area: header;." },
      { mistake: "Using minmax(1fr, 300px) or fr as a minimum.", fix: "fr is only valid as a maximum (flex factor). Use minmax(200px, 1fr) or minmax(0, 1fr)." },
      { mistake: "Thinking auto-fit and auto-fill are identical.", fix: "They differ only when there are fewer items than tracks: auto-fill keeps empty tracks; auto-fit collapses them so items stretch." },
      { mistake: "Setting grid properties on grandchildren.", fix: "Only direct children are grid items. Nest another grid (or use subgrid) for deeper elements." },
    ],
    debug: {
      prompt: "This layout should show header across the top, sidebar and main side by side, then footer — but everything stacks in a single column. Find the errors.",
      language: "css",
      buggyCode: `.page {
  display: grid;
  grid-template-columns: 240px 1fr;
  grid-template-areas:
    "header header"
    "sidebar main content"
    "footer footer";
}

.page header  { grid-area: "header"; }
.page aside   { grid-area: sidebar; }
.page main    { grid-area: main; }
.page footer  { grid-area: footer; }`,
      hint: "Count the cells in each string, and check the syntax of grid-area values.",
      fixedCode: `.page {
  display: grid;
  grid-template-columns: 240px 1fr;
  grid-template-areas:
    "header  header"
    "sidebar main"
    "footer  footer";
}

.page header  { grid-area: header; }
.page aside   { grid-area: sidebar; }
.page main    { grid-area: main; }
.page footer  { grid-area: footer; }`,
      explanation: "The middle row has three cells while the others have two, which makes grid-template-areas invalid — the browser drops the whole declaration, so no named areas exist and items auto-place. grid-area: \"header\" is also invalid because area names are identifiers, not strings. Fixing both restores the layout.",
    },
    challenge: {
      prompt: "Write the CSS for a product page: on mobile, stack image, info, reviews, related (in that order). From 768px: image left and info right on the first row, reviews spanning both columns below, related products on the last row as a grid of cards each at least 160px wide that stretch to fill the row.",
      language: "css",
      starterCode: `/* HTML:
<div class="product">
  <img class="product__image" src="hoodie.jpg" alt="University hoodie in navy">
  <section class="product__info">…</section>
  <section class="product__reviews">…</section>
  <section class="product__related">
    <article class="mini-card">…</article> (×5)
  </section>
</div>
*/`,
      hints: [
        "Start with a single-column grid-template-areas, then redefine it in a min-width media query.",
        "The related section is itself a grid container — use repeat(auto-fit, minmax(160px, 1fr)).",
        "Use minmax(0, 1fr) for the text column to avoid overflow from long words.",
      ],
      solution: `.product {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: 1fr;
  grid-template-areas:
    "image"
    "info"
    "reviews"
    "related";
}

.product__image   { grid-area: image; width: 100%; height: auto; }
.product__info    { grid-area: info; }
.product__reviews { grid-area: reviews; }
.product__related { grid-area: related; }

@media (min-width: 768px) {
  .product {
    grid-template-columns: 1fr minmax(0, 1fr);
    grid-template-areas:
      "image   info"
      "reviews reviews"
      "related related";
  }
}

.product__related {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 1rem;
}`,
      explanation: "Named areas make the two layouts readable at a glance, and only the container's template changes at the breakpoint. auto-fit is chosen for related products so that if only two exist they stretch to fill the row rather than leaving empty columns. The DOM order already matches the reading order, so keyboard and screen-reader order stays logical.",
    },
    examQuestions: [
      { question: "MCQ (mock A9): Which CSS property is particularly useful for creating layouts with named grid areas? A. grid-template-areas B. text-transform C. letter-spacing D. border-radius", answer: "**A. grid-template-areas** — it defines named regions as strings (one per row); children are placed with grid-area: <name>.", marks: 1 },
      { question: "True/False (mock B12): The CSS minmax() function can specify minimum and maximum sizes for grid tracks.", answer: "**True.** minmax(min, max) defines a size range for a grid track, e.g. minmax(200px, 1fr).", marks: 1 },
      { question: "Explain the difference between repeat(auto-fill, minmax(200px, 1fr)) and repeat(auto-fit, minmax(200px, 1fr)) when a wide container holds only two items.", answer: "Both compute how many ≥200px tracks fit. auto-fill keeps the extra tracks even though they're empty, so the two items stay narrow with empty columns beside them. auto-fit collapses the empty tracks to zero, so the two 1fr items stretch to fill the whole row.", marks: 2 },
      { question: "Write CSS for a three-column layout where the sidebars are 200px and the centre takes the remaining space, with 1rem gaps.", answer: "```css\n.layout {\n  display: grid;\n  grid-template-columns: 200px 1fr 200px;\n  gap: 1rem;\n}\n```\nThe fr unit shares the space left after fixed tracks and gaps.", marks: 2 },
      { question: "What does grid-column: 1 / -1 do?", answer: "It makes the item start at the first column line and end at the last explicit line, spanning every explicit column — a full-width item regardless of the number of columns.", marks: 1 },
    ],
    revision: [
      "display: grid + grid-template-columns/rows define tracks; gap spaces them.",
      "fr = fraction of leftover space; 1fr behaves like minmax(auto, 1fr) — use minmax(0, 1fr) to allow shrinking.",
      "repeat(n, size); minmax(min, max) sets track min and max (mock B12 True).",
      "auto-fill keeps empty tracks; auto-fit collapses them so items stretch.",
      "repeat(auto-fit, minmax(250px, 1fr)) = responsive gallery without media queries.",
      "grid-template-areas: quoted strings per row, equal cell counts, rectangular areas, . for empty (mock A9).",
      "grid-area: name (unquoted) places a child; grid-column: 1 / -1 spans the full width.",
      "Visual placement doesn't change DOM/tab order — keep source order logical.",
    ],
    visualizers: ["grid-areas"],
  },


  /* ================================================================== */
  /* 9. Responsive CSS, units, clamp()                                  */
  /* ================================================================== */
  {
    id: "css-responsive-clamp",
    moduleId: "m02-css",
    title: "Responsive CSS: Media Queries, Units, calc(), clamp() and Variables",
    summary:
      "Design mobile-first with min-width media queries, choose the right unit (rem, em, %, vw), and use calc(), clamp() and custom properties for fluid, maintainable layouts.",
    priority: "P0",
    examCritical: true,
    minutes: 40,
    objectives: [
      "Write mobile-first media queries with min-width and explain why the viewport meta tag is required.",
      "Choose between px, rem, em, %, vw/vh/dvh and explain what each is relative to.",
      "Use calc() to mix units and clamp(min, preferred, max) for fluid sizes (mock A16).",
      "Distinguish clamp() from calc(), minmax() and var().",
      "Define and override CSS custom properties (variables) for theming.",
    ],
    prerequisites: ["css-box-model-cascade"],
    sources: [
      { kind: "mock", label: MOCK, detail: "A16 (clamp() — preferred value with min and max limits)" },
      { kind: "university", label: LEC04_HTML, detail: "<meta name=\"viewport\"> section — crucial for responsive web design" },
      { kind: "university", label: LEC04_BS3, detail: "Responsive Design with Bootstrap — media queries and breakpoints" },
      { kind: "supplementary", label: "MDN — clamp()", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/clamp" },
      { kind: "supplementary", label: "MDN — Using media queries", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries" },
      { kind: "supplementary", label: "MDN — Using CSS custom properties", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties" },
    ],
    why: `Your CampusEvents app will be opened on a 360px phone, a 1440px laptop and everything between. Fixed pixel layouts either overflow on phones or look tiny on desktops. Responsive CSS adapts layout and type to the space available, and it is part of the coursework marking (responsive/accessible UI).

clamp() appears in the mock (**A16**) because it replaces several media queries with one line: "be fluid, but never smaller than X or larger than Y". Lecture 8 (Responsive UI) wasn't supplied, so the details here come from MDN.`,
    analogy: `clamp() is a **thermostat with a minimum and maximum**: "follow the weather (the preferred, fluid value), but never let the room drop below 18° or go above 24°".

Mobile-first media queries are like **packing for a trip**: start with the essentials that work everywhere (the small-screen layout), then *add* extras when there's more room (min-width breakpoints) — rather than packing everything and trying to remove things for small bags.

CSS variables are **named paint pots**: paint everything from the "brand" pot, and changing the pot's colour repaints everything that used it.`,
    explain: {
      beginner: `**Viewport meta tag first.** Without <meta name="viewport" content="width=device-width, initial-scale=1"> phones pretend to be ~980px wide and zoom out, so your media queries never trigger (Lecture 04).

**Media queries** apply CSS only when a condition is true:

@media (min-width: 768px) { .layout { grid-template-columns: 1fr 1fr; } }

**Mobile-first** means: write the base styles for small screens, then add min-width queries for larger screens. Bootstrap is mobile-first too.

**Units:**
- px — fixed CSS pixels.
- **rem** — relative to the root (html) font size (16px by default). 1.5rem = 24px. Respects the user's browser font-size setting — great for font sizes and spacing.
- **em** — relative to the current element's font size (for font-size itself, the parent's). Compounds when nested.
- **%** — relative to the parent (for width, the containing block's width).
- **vw / vh** — 1% of the viewport's width / height. dvh adjusts for mobile browser toolbars.

**calc()** mixes units: width: calc(100% - 2rem).

**clamp(min, preferred, max)** returns the preferred value but never less than min or more than max:

font-size: clamp(1.5rem, 1rem + 2vw, 3rem);

The heading grows smoothly with the screen but stays between 24px and 48px.

**CSS variables** (custom properties) store reusable values: :root { --brand: #2563eb; } then color: var(--brand);.`,
      developer: `**clamp(MIN, VAL, MAX)** is exactly max(MIN, min(VAL, MAX)). It works for any length/number property — font-size, width, padding, gap.

Mock A16 distractors, precisely:
- **calc()** — arithmetic with mixed units; no limits.
- **minmax()** — only valid in grid track sizing (grid-template-columns), not a general function.
- **clamp()** — preferred value bounded by min and max. ✔
- **var()** — reads a custom property.

**Designing a fluid value:** for font-size from 1rem at a 360px viewport to 2rem at 1200px: slope = (32 − 16) / (1200 − 360) ≈ 0.019 → 1.9vw; intercept = 16 − 0.019 × 360 ≈ 9.1px ≈ 0.57rem. Result: clamp(1rem, 0.57rem + 1.9vw, 2rem). Always include a rem component in the preferred value so text still responds to user zoom/font settings — pure vw font sizes fail WCAG 1.4.4 (Resize text).

**Media query details:** combine with and: @media (min-width: 768px) and (max-width: 991.98px). Modern range syntax: @media (768px <= width < 992px). Other useful features: (orientation: landscape), (hover: hover) and (pointer: coarse) for touch, (prefers-color-scheme: dark), (prefers-reduced-motion: reduce). Bootstrap uses max-width values like 767.98px to avoid overlap at fractional widths.

**Custom properties** cascade and inherit like normal properties, can be overridden per component or per media query, and can be read/written from JavaScript (element.style.setProperty("--brand", "#dc2626")). var(--gap, 1rem) supplies a fallback. They are resolved at computed-value time, unlike Sass variables, which are compiled away.

Images: max-width: 100%; height: auto; (Bootstrap's .img-fluid) stops images overflowing; srcset/sizes serve appropriately sized files (Bootstrap part 03, image optimisation).`,
      deep: `**Why mobile-first?** Small-screen styles are usually simpler (single column), so they make a sensible default; larger screens *add* complexity. With min-width queries, later (larger) breakpoints override earlier ones naturally through source order, and phones download/parse the same CSS but apply fewer overrides. Desktop-first max-width cascades tend to accumulate "undo" rules.

**Container queries** are the modern complement: @container (min-width: 400px) responds to the size of a component's container (declared with container-type: inline-size), not the viewport — so the same card can be compact in a sidebar and spacious in main content. Media queries are for page-level layout; container queries for component-level adaptation. Container query units (cqi) also work inside clamp().

**Viewport unit pitfalls:** 100vh on mobile includes the area behind the dynamic toolbar, causing overflow; use 100dvh (dynamic), svh (small) or lvh (large). 100vw includes the vertical scrollbar width on desktop, so width: 100vw causes horizontal scrolling — prefer width: 100%.

**em vs rem in media queries:** in media queries, em/rem are based on the browser's *initial* font size, not your html font-size, so @media (min-width: 48em) tracks the user's default text size; this makes breakpoints respond to user font preferences.

**Custom property mechanics:** an invalid substituted value makes the property "invalid at computed-value time", falling back to inherit/initial — not to the previous declaration — which surprises people. @property lets you register a typed custom property (e.g. <color>, <length>) with an initial value and inheritance setting, enabling transitions on variables.

**Fluid type + accessibility:** the WCAG requirement is that text can be zoomed to 200%. With clamp(1rem, 0.5rem + 2vw, 3rem), browser zoom scales rem but not vw, so a large vw share can cap effective zoom; keep the vw coefficient moderate and the max in rem.`,
    },
    mechanism: `\`\`\`text
 clamp(MIN, PREFERRED, MAX)  ≡  max(MIN, min(PREFERRED, MAX))

 font-size: clamp(1rem, 0.5rem + 2vw, 2rem)        (1rem = 16px)

 size (px)
  32 ┤                               ●━━━━━━━━━━━━━━━━  MAX 32px (from 1200px)
     │                           ●
  24 ┤                      ●          preferred = 8px + 2% of viewport width
     │                 ●
  16 ┤━━━━━━━━━━━━●                                    MIN 16px (below 400px)
     └────┬────────┬────────┬────────┬────────┬─────▶ viewport width
         320      400      800      1200     1600

 Mobile-first media query flow (source order matters):

 base CSS (all widths) ──▶ @media (min-width: 576px) ──▶ (min-width: 768px) ──▶ (min-width: 992px)
 1 column                   still 1 column                2 columns               3 columns
 each later block overrides earlier ones only when its condition is true
\`\`\`

At 400px: 8 + 0.02 × 400 = 16px (meets MIN). At 1200px: 8 + 24 = 32px (meets MAX). Between them the size scales linearly — no breakpoints required.`,
    simpleExample: {
      title: "Fluid heading and spacing with clamp() and variables",
      language: "css",
      code: `:root {
  --brand: #2563eb;
  --space: clamp(1rem, 0.5rem + 2vw, 2.5rem);
}

h1 {
  font-size: clamp(1.75rem, 1rem + 3vw, 3.5rem);
  color: var(--brand);
}

.section {
  padding: var(--space);
  max-width: min(70ch, 100% - 2rem);
  margin-inline: auto;
}`,
      walkthrough: [
        { lines: "1-4", text: "Custom properties on :root are available everywhere. --space is itself fluid." },
        { lines: "7", text: "Heading: never smaller than 28px, never larger than 56px, fluid in between. The rem part keeps it zoom-friendly." },
        { lines: "8", text: "var() reads the variable — change --brand once to re-theme." },
        { lines: "12", text: "Section padding grows with the screen but stays within bounds." },
        { lines: "13", text: "min() picks the smaller: a readable 70-character line length, or the full width minus 2rem on small screens (math functions allow calc-style arithmetic without writing calc())." },
        { lines: "14", text: "Auto inline margins centre the block." },
      ],
    },
    realExample: {
      title: "Mobile-first event listing with breakpoints, theming and reduced motion",
      language: "css",
      code: `:root {
  --bg: #ffffff;
  --text: #111827;
  --accent: #2563eb;
  --radius: 0.5rem;
  --gutter: clamp(0.75rem, 0.5rem + 1vw, 1.5rem);
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg: #111827;
    --text: #f9fafb;
    --accent: #60a5fa;
  }
}

body {
  background: var(--bg);
  color: var(--text);
  font-size: 1rem;
}

.events {
  display: grid;
  gap: var(--gutter);
  grid-template-columns: 1fr;
  padding: var(--gutter);
}

@media (min-width: 768px) {
  .events { grid-template-columns: repeat(2, 1fr); }
}

@media (min-width: 1200px) {
  .events { grid-template-columns: repeat(3, 1fr); }
}

.event-card {
  border-radius: var(--radius);
  border: 1px solid color-mix(in srgb, var(--text) 20%, transparent);
  transition: transform 200ms ease;
}

.event-card:hover {
  transform: translateY(-2px);
}

.event-card img {
  max-width: 100%;
  height: auto;
}

.event-card__title {
  font-size: clamp(1.125rem, 1rem + 0.5vw, 1.375rem);
  width: calc(100% - 2.5rem);
}

@media (prefers-reduced-motion: reduce) {
  .event-card { transition: none; }
  .event-card:hover { transform: none; }
}`,
      walkthrough: [
        { lines: "1-7", text: "Design tokens as custom properties, including a fluid gutter." },
        { lines: "9-15", text: "Dark mode only redefines the variables; every rule that uses them updates automatically." },
        { lines: "23-28", text: "Mobile-first base: a single column on phones." },
        { lines: "30-36", text: "Two columns from 768px, three from 1200px (the same thresholds as Bootstrap md and xl). Later queries override earlier ones." },
        { lines: "38-42", text: "color-mix() derives a subtle border from the text colour, so it works in both themes." },
        { lines: "48-51", text: "Responsive images never overflow their card (Bootstrap's .img-fluid does exactly this)." },
        { lines: "53-56", text: "Fluid title size with clamp(); calc() leaves room for a 2.5rem icon button." },
        { lines: "58-61", text: "Respect users who prefer reduced motion." },
      ],
    },
    mistakes: [
      { mistake: "Forgetting the viewport meta tag, then wondering why media queries don't fire on phones.", fix: "Add <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"> in <head>." },
      { mistake: "Writing clamp() arguments in the wrong order, e.g. clamp(3rem, 5vw, 1rem).", fix: "Order is clamp(MIN, PREFERRED, MAX). If MIN > MAX, MIN wins, so the value is stuck at 3rem." },
      { mistake: "Using pure vw for font-size (font-size: 4vw).", fix: "Text becomes tiny on phones, huge on desktops and ignores zoom. Combine rem + vw inside clamp()." },
      { mistake: "Confusing clamp() with minmax().", fix: "minmax() only sizes grid tracks; clamp() works for any length property." },
      { mistake: "Desktop-first max-width queries that keep 'undoing' styles.", fix: "Write the small-screen layout first and add min-width queries for larger screens." },
      { mistake: "width: 100vw on a full-width section.", fix: "100vw includes the scrollbar on desktop and causes horizontal scroll. Use width: 100%." },
    ],
    debug: {
      prompt: "On phones the hero title is enormous and the three-column layout never collapses, even though the CSS seems responsive. Find all the problems.",
      language: "html",
      buggyCode: `<head>
  <title>CampusEvents</title>
  <style>
    .hero h1 { font-size: clamp(4rem, 5vw, 2rem); }
    .cols { display: grid; grid-template-columns: repeat(3, 1fr); }
    @media (min-width: 768px) {
      .cols { grid-template-columns: 1fr; }
    }
  </style>
</head>`,
      hint: "Check the head for a missing tag, the clamp() argument order, and the direction of the media query logic.",
      fixedCode: `<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>CampusEvents</title>
  <style>
    .hero h1 { font-size: clamp(2rem, 1rem + 4vw, 4rem); }
    .cols { display: grid; grid-template-columns: 1fr; }
    @media (min-width: 768px) {
      .cols { grid-template-columns: repeat(3, 1fr); }
    }
  </style>
</head>`,
      explanation: "Without the viewport meta tag phones render at ~980px, so (min-width: 768px) is always true. The clamp() had MIN (4rem) larger than MAX (2rem), so it always resolved to 4rem. Finally, the media query logic was inverted: mobile-first means one column by default and three columns from 768px upwards.",
    },
    challenge: {
      prompt: "Write a fluid type scale using custom properties: --step-0 for body text (1rem at 360px → 1.125rem at 1200px) and --step-3 for h1 (1.75rem at 360px → 3rem at 1200px). Show your slope/intercept working, then apply them to body and h1. Finally, explain why each clamp() includes a rem term in the preferred value.",
      language: "css",
      hints: [
        "slope = (maxPx − minPx) / (1200 − 360); preferred = intercept + slope × 100vw.",
        "Convert px to rem by dividing by 16.",
        "1vw = 1% of the viewport width, so a slope of 0.0238 is 2.38vw.",
      ],
      solution: `/*
  --step-0: 16px → 18px over 360 → 1200px
    slope = (18 - 16) / (1200 - 360) = 2 / 840 ≈ 0.00238  → 0.238vw
    intercept = 16 - 0.00238 × 360 ≈ 15.14px ≈ 0.946rem
  --step-3: 28px → 48px over 360 → 1200px
    slope = (48 - 28) / 840 ≈ 0.0238 → 2.38vw
    intercept = 28 - 0.0238 × 360 ≈ 19.43px ≈ 1.214rem
*/
:root {
  --step-0: clamp(1rem, 0.946rem + 0.238vw, 1.125rem);
  --step-3: clamp(1.75rem, 1.214rem + 2.38vw, 3rem);
}

body {
  font-size: var(--step-0);
  line-height: 1.5;
}

h1 {
  font-size: var(--step-3);
  line-height: 1.15;
}`,
      explanation: "The linear equation passes through both target points, and clamp() pins the ends so the size stops changing outside 360–1200px. The rem term makes the preferred value scale with the user's default font size and browser zoom; a pure vw value would ignore those settings and could fail WCAG 1.4.4 (Resize text).",
    },
    examQuestions: [
      { question: "MCQ (mock A16): Which CSS function allows a property to have a preferred value while respecting minimum and maximum limits? A. calc() B. minmax() C. clamp() D. var()", answer: "**C. clamp()** — clamp(min, preferred, max). calc() only does arithmetic, minmax() sizes grid tracks, var() reads a custom property.", marks: 1 },
      { question: "What value does width: clamp(300px, 50%, 800px) produce in containers of 400px, 1000px and 2000px?", answer: "50% is 200px, 500px and 1000px respectively. Clamped: 300px (below min), 500px (within range), 800px (above max).", marks: 2 },
      { question: "Explain 'mobile-first' and show a media query that applies from 992px upwards.", answer: "Mobile-first means writing base styles for the smallest screens and progressively adding/overriding styles for larger screens with min-width media queries.\n```css\n@media (min-width: 992px) {\n  .layout { grid-template-columns: 250px 1fr; }\n}\n```", marks: 2 },
      { question: "Explain the difference between rem and em.", answer: "rem is relative to the root (html) element's font size, so it is consistent anywhere in the document. em is relative to the current element's font size (for font-size, the parent's), so nested em values compound.", marks: 2 },
      { question: "Give two benefits of CSS custom properties over hard-coded values.", answer: "A single source of truth (change --brand once to re-theme everything); they cascade and can be overridden per component, per media query or for dark mode; and they can be updated at runtime from JavaScript.", marks: 2 },
    ],
    revision: [
      "No viewport meta tag = no working responsive design on phones.",
      "Mobile-first: base styles for small screens + min-width media queries for larger ones.",
      "rem → root font size; em → own/parent font size (compounds); % → parent; vw/vh → viewport (use dvh on mobile).",
      "calc() mixes units, e.g. calc(100% - 2rem).",
      "clamp(MIN, PREFERRED, MAX) = max(MIN, min(PREFERRED, MAX)) — mock A16 answer.",
      "minmax() is only for grid tracks; var() reads a custom property.",
      "Fluid type: clamp(1rem, 0.5rem + 2vw, 2rem) — always mix rem into the preferred value.",
      "Custom properties: --name on :root, var(--name, fallback); they cascade and can change in media queries.",
    ],
    visualizers: ["clamp"],
  },

  /* ================================================================== */
  /* 10. Bootstrap 5 grid & components                                  */
  /* ================================================================== */
  {
    id: "css-bootstrap-grid",
    moduleId: "m02-css",
    title: "Bootstrap 5: Grid, Breakpoints, Utilities and Components",
    summary:
      "Build responsive pages with Bootstrap's container/row/col grid and six breakpoints, then add utilities, cards, buttons, a navbar, forms and alerts — as in the Week 4 shopping tutorial.",
    priority: "P1",
    minutes: 40,
    objectives: [
      "Structure layouts with .container / .container-fluid, .row and .col-* and explain the 12-column system.",
      "State Bootstrap 5's breakpoints (xs <576, sm ≥576, md ≥768, lg ≥992, xl ≥1200, xxl ≥1400) and predict how responsive columns stack.",
      "Use spacing, display, flex and text utilities (mb-3, d-flex, ms-auto, text-center) instead of custom CSS.",
      "Build cards, buttons, a collapsible navbar, form controls and dismissible alerts with correct Bootstrap 5 markup.",
      "Identify outdated Bootstrap 3/4 patterns (jQuery, jumbotron, data-toggle, float-left) and their Bootstrap 5 replacements.",
    ],
    prerequisites: ["css-flexbox", "css-responsive-clamp"],
    sources: [
      { kind: "university", label: LEC04_BS1, detail: "Bootstrap intro, CDN, mobile-first checks, containers, colours, columns, responsive columns, tables, alerts, buttons, cards" },
      { kind: "university", label: LEC04_BS2, detail: "Grid system (flexbox, 12 columns, grid classes), unequal columns, images (.img-fluid), button groups, progress, spinners, pagination, dropdowns" },
      { kind: "university", label: LEC04_BS3, detail: "Utilities, customisation, responsive design, optimisation (minification, CDN, lazy loading), accessibility best practices" },
      { kind: "university", label: BS_DOC, detail: "Class-by-class explanation: container, row, col-12/col-md-6/col-lg-4, navbar-expand-sm, ms-auto, g-3, card-*, modal, ARIA attributes" },
      { kind: "university", label: WEEK4_TUT, detail: "Online shopping interface task: header, category buttons, product cards in a grid, alerts, price table, footer" },
      { kind: "supplementary", label: "Bootstrap 5.3 docs — Grid system", url: "https://getbootstrap.com/docs/5.3/layout/grid/" },
      { kind: "supplementary", label: "Bootstrap 5.3 docs — Breakpoints", url: "https://getbootstrap.com/docs/5.3/layout/breakpoints/" },
    ],
    why: `Bootstrap lets you build a clean, responsive, consistent UI quickly by composing **pre-written classes** instead of writing every rule yourself. It is the framework used in the Week 4 tutorial (online shopping page) and it is common in coursework and industry prototypes.

But Bootstrap only helps if you understand what the classes do — that .col-md-6 is a flexbox column at 50% width from 768px up, that utilities use !important, and which markup changed between versions. Some lecture examples come from Bootstrap 4 (jumbotron, jQuery), so knowing the Bootstrap 5 equivalents prevents broken pages.`,
    analogy: `Bootstrap's grid is a **12-slot shelf unit** that rearranges itself depending on the room size. In a narrow hallway (phone) each box takes the full shelf width and they stack; in a wider room (md) two boxes share a shelf (6 + 6 slots); in a big hall (lg) three share it (4 + 4 + 4). You label each box with its size per room — col-12 col-md-6 col-lg-4 — and the shelf does the rest.

Utilities are **adhesive labels** you stick directly on elements: "margin-bottom 3", "centre text", "push right". Components are **flat-pack furniture**: cards, navbars and alerts that arrive pre-designed — follow the assembly instructions (the required class structure) and they work.`,
    explain: {
      beginner: `**Setup**: include Bootstrap's CSS (and JS bundle for interactive components) from a CDN, use <!DOCTYPE html> and the viewport meta tag — Bootstrap is mobile-first.

**Layout trio**:
- **.container** — centred, responsive fixed max-width; **.container-fluid** — full width.
- **.row** — a horizontal group of columns (a flexbox row).
- **.col-*** — columns. A row has **12** units; .col-4 takes 4/12 = one third. Plain .col shares space equally.

**Breakpoints** (Bootstrap 5):

| Infix | Applies from | Typical device |
|---|---|---|
| (none) xs | <576px (and up) | phones |
| sm | ≥576px | large phones |
| md | ≥768px | tablets |
| lg | ≥992px | laptops |
| xl | ≥1200px | desktops |
| xxl | ≥1400px | large desktops |

A class applies **from its breakpoint upwards**. col-12 col-md-6 col-lg-4 = full width on phones, half from 768px, a third from 992px. col-sm-4 columns stack below 576px (Lecture 04 "Responsive Columns").

**Utilities**: spacing m/p + side (t, b, s=start, e=end, x, y) + size 0–5 (mb-3, my-4, px-2, ms-auto), text-center, text-muted, bg-primary, text-white, d-none d-md-block, d-flex, justify-content-between, img-fluid.

**Components**: .btn .btn-primary/.btn-outline-secondary, .card with .card-img-top, .card-body, .card-title, .card-text, .alert .alert-success, .table .table-striped, .navbar, .form-control and .form-label.`,
      developer: `**How the grid works:** .row is display: flex; flex-wrap: wrap with negative horizontal margins; each column has horizontal padding (the *gutter*, default 1.5rem total). .col-md-6 compiles to @media (min-width: 768px) { .col-md-6 { flex: 0 0 auto; width: 50%; } }. Gutter classes **g-0…g-5**, **gx-***, **gy-*** on the row control spacing (g-3 in the tutorial form). Columns adding up to more than 12 wrap onto a new line. **row-cols-1 row-cols-md-3** sets the column count from the row — perfect for card grids. Offsets: offset-md-2; ordering: order-first, order-md-2 (visual only).

**Containers**: .container max-widths are 540 / 720 / 960 / 1140 / 1320px at sm / md / lg / xl / xxl; .container-md is 100% wide until md.

**Bootstrap 5 changes from the lecture's Bootstrap 4-era material:**
- **No jQuery.** Bootstrap 5's JavaScript is plain JS. Include bootstrap.bundle.min.js (it bundles Popper for dropdowns/tooltips).
- data-* attributes are namespaced: **data-bs-toggle**, **data-bs-target**, **data-bs-dismiss**.
- left/right became start/end: **ms-*/me-***, **float-start/float-end**, **dropstart/dropend** (formerly dropleft/dropright), text-start.
- **.jumbotron was removed** — recreate it with utilities: <div class="p-5 mb-4 bg-body-tertiary rounded-3">.
- Forms: .form-group is gone (use mb-3), .custom-select became .form-select.

**Dismissible alert**: class="alert alert-info alert-dismissible fade show" role="alert" plus <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close">.

**Navbar** (from the tutorial): .navbar.navbar-expand-sm collapses below 576px; the .navbar-toggler button uses data-bs-toggle="collapse", data-bs-target="#nav", aria-controls, aria-expanded and aria-label; the links live in .collapse.navbar-collapse; .ms-auto on the ul pushes them right.`,
      deep: `**Specificity and customisation.** Bootstrap's utilities are generated from a Sass utility map with !important so they override component styles — a .card with mt-0 always loses its top margin. To customise the theme properly, either override Sass variables ($primary, $border-radius, $grid-breakpoints) before importing Bootstrap's Sass (Lecture 04 part 03 "Theming with Bootstrap variables"), or override the **CSS custom properties** Bootstrap 5.3 exposes (--bs-primary, --bs-body-font-family, component-level --bs-btn-bg, --bs-card-border-radius). Raising specificity with ids or slapping !important on your own CSS leads to an arms race.

**Performance** (part 03): the full minified CSS is still roughly 230 KB before compression; production builds should import only the Sass partials used, minify, and serve via CDN or your bundler. Lazy-load below-the-fold images with loading="lazy".

**Accessibility**: Bootstrap gives correct ARIA for its JS components *if you copy the full markup* — the tutorial docx explains aria-controls/aria-expanded on the toggler and aria-labelledby on modals. You are still responsible for semantic wrappers (put .navbar in <nav>), colour contrast when customising (text-white on bg-warning fails contrast), visible focus (Bootstrap provides a focus ring via box-shadow; don't remove it) and alt text.

**Bootstrap in React:** Bootstrap's JS manipulates the DOM directly, which can conflict with React's control of the DOM. In React apps you typically use only the CSS (import "bootstrap/dist/css/bootstrap.min.css") and manage state (navbar open, alert visible) in React, or use React-Bootstrap components. Remember className instead of class.

**The Week 4 "layout must not jump" requirement**: dismissing an alert removes it from flow, so content below moves up. Placing alerts in a single region above the cards with a reserved min-height (or overlaying them with position: fixed toasts) keeps the product grid stable.`,
    },
    mechanism: `\`\`\`text
 <div class="container">            max-width: 540 / 720 / 960 / 1140 / 1320 px
   <div class="row g-3">           display:flex; flex-wrap:wrap; gutters via padding
     <div class="col-12 col-md-6 col-lg-4"> card </div>   × 6
   </div>
 </div>

 viewport  <576 (xs)   ≥576 (sm)    ≥768 (md)          ≥992 (lg)            ≥1200 xl / ≥1400 xxl
           ┌──────┐    ┌──────┐     ┌──────┬──────┐    ┌────┬────┬────┐     same as lg
           │  1   │    │  1   │     │  1   │  2   │    │ 1  │ 2  │ 3  │     (no xl/xxl class,
           ├──────┤    ├──────┤     ├──────┼──────┤    ├────┼────┼────┤      so lg rule
           │  2   │    │  2   │     │  3   │  4   │    │ 4  │ 5  │ 6  │      continues)
           ├──────┤    ├──────┤     ├──────┼──────┤    └────┴────┴────┘
           │ ...  │    │ ...  │     │  5   │  6   │
           col-12      col-12       col-md-6 = 6/12    col-lg-4 = 4/12

 Class applies from its breakpoint UP until a larger breakpoint class overrides it:
   col-12 ───────▶ col-md-6 ───────▶ col-lg-4 ───────────────────────────▶
\`\`\`

Each .col-{bp}-{n} compiles to a min-width media query setting width: n/12 × 100%. Because every breakpoint uses min-width, Bootstrap is mobile-first, exactly like the media queries in the previous lesson.`,
    simpleExample: {
      title: "Responsive columns (Lecture 04 Bootstrap) in Bootstrap 5",
      language: "html",
      code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Bootstrap grid</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
  <main class="container my-4">
    <div class="row g-3">
      <div class="col-sm-4"><div class="p-3 bg-primary text-white">.col-sm-4</div></div>
      <div class="col-sm-4"><div class="p-3 bg-success text-white">.col-sm-4</div></div>
      <div class="col-sm-4"><div class="p-3 bg-dark text-white">.col-sm-4</div></div>
    </div>
    <div class="row g-3 mt-1">
      <div class="col-md-4"><div class="p-3 border">sidebar (.col-md-4)</div></div>
      <div class="col-md-8"><div class="p-3 border">content (.col-md-8)</div></div>
    </div>
  </main>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>`,
      walkthrough: [
        { lines: "1-5", text: "The lecture's 'checks for Bootstrap 5': HTML5 doctype and the viewport meta tag (mobile-first)." },
        { lines: "7", text: "Bootstrap CSS from a CDN (jsDelivr is the official CDN in the Bootstrap docs)." },
        { lines: "10", text: "container centres content with a responsive max-width; my-4 adds vertical margin." },
        { lines: "11-15", text: "Three equal columns from 576px up; below that they stack. g-3 sets the gutter. Colours via bg-* and text-white utilities." },
        { lines: "16-19", text: "Unequal columns: 4 + 8 = 12 units from 768px up." },
        { lines: "21", text: "The JS bundle (includes Popper). No jQuery is needed in Bootstrap 5." },
      ],
    },
    realExample: {
      title: "Week 4 shopping page skeleton (Bootstrap 5 markup)",
      language: "html",
      code: `<nav class="navbar navbar-expand-sm bg-body-tertiary">
  <div class="container">
    <a class="navbar-brand" href="#">UniShop</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav"
            aria-controls="mainNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="mainNav">
      <ul class="navbar-nav ms-auto">
        <li class="nav-item"><a class="nav-link active" aria-current="page" href="#">Shop</a></li>
        <li class="nav-item"><a class="nav-link" href="#prices">Price list</a></li>
      </ul>
    </div>
  </div>
</nav>

<header class="container my-4">
  <div class="p-5 bg-body-tertiary rounded-3 text-center">
    <h1 class="display-5">Online Shopping</h1>
    <p class="lead">Everything for campus life, delivered.</p>
    <div class="btn-group" role="group" aria-label="Product categories">
      <button type="button" class="btn btn-primary" data-category="electronics">Electronics</button>
      <button type="button" class="btn btn-outline-primary" data-category="clothing">Clothing</button>
      <button type="button" class="btn btn-outline-primary" data-category="books">Books</button>
    </div>
  </div>
</header>

<main class="container">
  <div class="alert-region" style="min-height: 4rem">
    <div class="alert alert-info alert-dismissible fade show" role="alert">
      Free delivery on orders over $100.
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
  </div>

  <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4" data-group="electronics">
    <div class="col">
      <article class="card h-100">
        <img src="headphones.jpg" class="card-img-top img-fluid" alt="Wireless headphones">
        <div class="card-body">
          <h2 class="card-title h5">Wireless Headphones</h2>
          <p class="card-text">Noise-cancelling, 30-hour battery.</p>
          <a href="#" class="btn btn-primary">Add to basket</a>
        </div>
      </article>
    </div>
  </div>

  <section id="prices" class="my-5">
    <h2>Price list</h2>
    <table class="table table-striped table-bordered">
      <thead><tr><th scope="col">Product</th><th scope="col">Price</th></tr></thead>
      <tbody><tr><td>Wireless Headphones</td><td>$89</td></tr></tbody>
    </table>
  </section>
</main>

<footer class="py-4 bg-dark text-white text-center">
  <p class="mb-0">&copy; 2026 UniShop</p>
</footer>`,
      walkthrough: [
        { lines: "1", text: "navbar-expand-sm: horizontal from 576px, collapsed behind the toggler below that (as described in the tutorial docx)." },
        { lines: "4-7", text: "Bootstrap 5 uses data-bs-toggle/data-bs-target. aria-controls, aria-expanded and aria-label make the toggler accessible." },
        { lines: "9", text: "ms-auto (margin-start: auto) pushes the links to the right inside the flex container." },
        { lines: "17-26", text: "Jumbotron replacement: padding, a tertiary background and rounded corners via utilities. display-5 and lead for typography. Category buttons in a labelled btn-group." },
        { lines: "29-34", text: "All alerts live in one region with a reserved height so dismissing one doesn't shift the cards (Week 4 requirement f/i). alert-dismissible + fade show + btn-close make it closable." },
        { lines: "36", text: "row-cols-* sets 1 / 2 / 3 cards per row at xs / md / lg; g-4 adds gutters. data-group lets a small script show/hide categories." },
        { lines: "38", text: "h-100 makes every card in a row the same height." },
        { lines: "39-44", text: "Card anatomy: card-img-top, card-body, card-title, card-text, and a btn." },
        { lines: "51-54", text: "Price list as a striped, bordered table with proper th scope for accessibility." },
      ],
    },
    mistakes: [
      { mistake: "Following Bootstrap 4 snippets: including jQuery, data-toggle=\"collapse\", float-left, dropright.", fix: "Bootstrap 5 needs no jQuery; use data-bs-toggle/data-bs-target/data-bs-dismiss, float-start/float-end, dropend/dropstart." },
      { mistake: "Using .jumbotron and getting an unstyled block.", fix: ".jumbotron was removed in Bootstrap 5. Recreate it with utilities such as p-5 mb-4 bg-body-tertiary rounded-3." },
      { mistake: "Placing .col-* elements directly in a .container without a .row (or nesting rows directly in rows).", fix: "Structure is container → row → col; content goes inside columns, and nested rows go inside a column." },
      { mistake: "Thinking col-md-6 means 'only on medium screens'.", fix: "Breakpoint classes apply from that width upwards until a larger breakpoint class overrides them." },
      { mistake: "Forgetting the JS bundle and wondering why the navbar toggler or dismissible alert does nothing.", fix: "Include bootstrap.bundle.min.js (or manage the open/closed state yourself in React)." },
      { mistake: "Fighting utilities with custom CSS (e.g. .card { margin: 0 } vs mb-3).", fix: "Utilities use !important; remove or change the utility class instead of overriding it." },
    ],
    debug: {
      prompt: "This Bootstrap 5 page was copied from an older tutorial. The navbar never expands on mobile, the alert can't be closed, the image does not float at all and overflows on phones, and the three products don't sit side by side on tablets. Fix it.",
      language: "html",
      buggyCode: `<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.min.js"></script>

<button class="navbar-toggler" data-toggle="collapse" data-target="#nav">
  <span class="navbar-toggler-icon"></span>
</button>

<div class="alert alert-warning">
  Stock is low!
  <button class="close" data-dismiss="alert">&times;</button>
</div>

<img src="bag.jpg" class="float-left" alt="Tote bag">

<div class="container">
  <div class="col-md-4">Product 1</div>
  <div class="col-md-4">Product 2</div>
  <div class="col-md-4">Product 3</div>
</div>`,
      hint: "Look for Bootstrap 4 attribute names and classes, a missing .row, a missing responsive image class, and which JS file includes Popper.",
      fixedCode: `<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>

<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav"
        aria-controls="nav" aria-expanded="false" aria-label="Toggle navigation">
  <span class="navbar-toggler-icon"></span>
</button>

<div class="alert alert-warning alert-dismissible fade show" role="alert">
  Stock is low!
  <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
</div>

<img src="bag.jpg" class="float-start img-fluid" alt="Tote bag">

<div class="container">
  <div class="row">
    <div class="col-md-4">Product 1</div>
    <div class="col-md-4">Product 2</div>
    <div class="col-md-4">Product 3</div>
  </div>
</div>`,
      explanation: "Bootstrap 5's data API only listens for data-bs-* attributes, so data-toggle/data-dismiss do nothing (and jQuery is unnecessary). The bundle includes Popper for dropdowns. .close was replaced by .btn-close, and dismissible alerts need alert-dismissible fade show. float-left became float-start (logical direction), img-fluid prevents overflow, and columns must be direct children of a .row, which provides the flex container and gutters.",
    },
    challenge: {
      prompt: "Write the Bootstrap 5 markup for a product listing where: phones show 1 card per row, tablets (≥768px) 2, laptops (≥992px) 3, and large desktops (≥1400px) 4. Include a sidebar of category buttons that sits above the products on phones/tablets and to the left (3 of 12 columns) from 992px. All cards in a row should be equal height.",
      language: "html",
      hints: [
        "Wrap sidebar + products in a row: col-12 col-lg-3 and col-12 col-lg-9.",
        "Inside the products column, use a nested .row with row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xxl-4.",
        "h-100 on the card makes cards fill their column's height.",
      ],
      solution: `<div class="container-fluid my-4">
  <div class="row g-4">
    <aside class="col-12 col-lg-3">
      <h2 class="h5">Categories</h2>
      <div class="d-flex flex-wrap flex-lg-column gap-2">
        <button type="button" class="btn btn-primary">All</button>
        <button type="button" class="btn btn-outline-primary">Electronics</button>
        <button type="button" class="btn btn-outline-primary">Clothing</button>
        <button type="button" class="btn btn-outline-primary">Books</button>
      </div>
    </aside>

    <main class="col-12 col-lg-9">
      <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xxl-4 g-3">
        <div class="col">
          <article class="card h-100">
            <img src="hoodie.jpg" class="card-img-top" alt="Navy university hoodie">
            <div class="card-body d-flex flex-column">
              <h3 class="card-title h6">University Hoodie</h3>
              <p class="card-text">Heavyweight cotton, embroidered crest.</p>
              <a href="#" class="btn btn-primary mt-auto">Add to basket</a>
            </div>
          </article>
        </div>
        <!-- repeat .col for each product -->
      </div>
    </main>
  </div>
</div>`,
      explanation: "The outer row places the sidebar and products: full width each below lg (stacked), 3 + 9 from 992px. The nested row uses row-cols-* so you don't repeat col classes on every card, and the counts change at md, lg and xxl. Note the xxl breakpoint (≥1400px) exists in Bootstrap 5 even though the lecture's grid-class list stops at xl. h-100 equalises card heights, and d-flex flex-column + mt-auto pins the button to the bottom of each card.",
    },
    examQuestions: [
      { question: "List the six Bootstrap 5 breakpoints with their minimum widths.", answer: "xs: <576px (no infix, default), sm: ≥576px, md: ≥768px, lg: ≥992px, xl: ≥1200px, xxl: ≥1400px.", marks: 2 },
      { question: "Describe the layout produced by <div class=\"col-12 col-md-6 col-lg-4\"> repeated six times in a row, on a 400px phone, a 800px tablet and a 1300px laptop.", answer: "400px: col-12 → one card per row (6 rows). 800px: col-md-6 → two per row (3 rows). 1300px: col-lg-4 still applies (no xl class) → three per row (2 rows).", marks: 3 },
      { question: "What is the difference between .container and .container-fluid?", answer: ".container has a responsive fixed max-width at each breakpoint (540/720/960/1140/1320px) and is centred; .container-fluid is always 100% of the viewport width.", marks: 1 },
      { question: "Explain what ms-auto and g-3 do, as used in the Bootstrap tutorial explanation.", answer: "ms-auto sets margin-inline-start: auto, which in a flex container (like the navbar) pushes the element to the end/right. g-3 is a gutter class on a .row that sets the horizontal and vertical spacing between columns to spacing level 3 (1rem by default).", marks: 2 },
      { question: "Name two Bootstrap 4 patterns from older tutorials that do not work in Bootstrap 5 and give their replacements.", answer: "data-toggle/data-target/data-dismiss → data-bs-toggle/data-bs-target/data-bs-dismiss; .jumbotron → utilities (p-5 bg-body-tertiary rounded-3); float-left/float-right → float-start/float-end; ml-auto → ms-auto; jQuery is no longer required.", marks: 2 },
    ],
    revision: [
      "Structure: .container (or -fluid) → .row → .col-*; 12 columns per row, built with flexbox.",
      "Breakpoints: xs <576, sm ≥576, md ≥768, lg ≥992, xl ≥1200, xxl ≥1400 — classes apply from that width up.",
      "col-12 col-md-6 col-lg-4 = 1 → 2 → 3 per row; row-cols-* sets counts from the row.",
      "Utilities: m/p + t/b/s/e/x/y + 0–5 (mb-3, ms-auto), d-flex, justify-content-*, text-center, img-fluid; they use !important.",
      "Components: btn btn-*, card (card-img-top/body/title/text), alert alert-* alert-dismissible, table table-striped, navbar navbar-expand-*.",
      "Bootstrap 5: no jQuery, data-bs-*, start/end instead of left/right, no jumbotron, use bootstrap.bundle.min.js.",
      "Keep accessibility: navbar inside <nav>, aria-* on toggler, btn-close with aria-label, check contrast.",
    ],
    visualizers: ["flexbox"],
  },
];
