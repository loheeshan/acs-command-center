import { useMemo, useState } from "react";
import { Send, ListChecks, HelpCircle, Check, X } from "lucide-react";
import { Badge, Button, Callout, Card, CardHeader, Segmented, Tabs } from "@/components/ui/primitives";
import { cn } from "@/lib/cn";
import { Pre, SimBanner, inputCls, labelCls, statusTone, textareaCls, useMarkOnce } from "./shared";

type Method = "GET" | "POST" | "PUT" | "DELETE";
interface Ev { id: number; title: string; location: string; capacity: number; categoryId: number; hasBookings: boolean }
interface Res { status: number; text: string; headers: Record<string, string>; body: unknown | null }

const REASON: Record<number, string> = { 200: "OK", 201: "Created", 204: "No Content", 400: "Bad Request", 401: "Unauthorized", 403: "Forbidden", 404: "Not Found", 405: "Method Not Allowed", 409: "Conflict", 415: "Unsupported Media Type", 422: "Unprocessable Content", 429: "Too Many Requests", 500: "Internal Server Error", 503: "Service Unavailable" };

const ADVICE: Record<number, string> = {
  200: "Success with a body. Parse it (response.json()) and render / update state.",
  201: "Resource created. Read the returned DTO (and Location header) — then refresh the list or navigate to the new item.",
  204: "Success with NO body. Do not call response.json(). Refresh/invalidate the list or navigate away.",
  400: "Bad request / validation failed. Show the server's field errors next to the inputs; keep the user's input.",
  401: "Not authenticated (missing, invalid or expired token). Clear auth state and redirect to /login.",
  403: "Authenticated but not permitted (e.g. USER on an ADMIN endpoint). Show 'You don't have permission' — logging in again won't help.",
  404: "Resource doesn't exist. Show a Not Found message / page; don't retry.",
  409: "Conflict with current state (duplicate, version clash). Explain and let the user resolve it.",
  415: "Server can't read the body format. Send Content-Type: application/json with a JSON body.",
  422: "Syntactically fine but semantically invalid. Treat like validation errors.",
  429: "Rate limited. Back off and retry later (respect Retry-After).",
  500: "Server bug. Show a generic error ('Something went wrong'); log details; maybe offer retry.",
  503: "Server temporarily unavailable. Show a retry option; it may recover.",
};

const SEED: Ev[] = [
  { id: 1, title: "Intro to React Workshop", location: "Cavendish C1.04", capacity: 40, categoryId: 1, hasBookings: false },
  { id: 2, title: "Campus Hackathon", location: "Marylebone Hall", capacity: 120, categoryId: 2, hasBookings: true },
];
const CATEGORIES = [{ id: 1, name: "Workshop" }, { id: 2, name: "Competition" }];

const PRESETS: { label: string; method: Method; path: string; token: string; body: string }[] = [
  { label: "List events", method: "GET", path: "/api/events", token: "", body: "" },
  { label: "Get event 99", method: "GET", path: "/api/events/99", token: "", body: "" },
  { label: "Create (admin)", method: "POST", path: "/api/events", token: "fake-admin-token", body: JSON.stringify({ title: "TS Bootcamp", location: "Room 2.10", capacity: 30, categoryId: 1 }, null, 2) },
  { label: "Create (invalid)", method: "POST", path: "/api/events", token: "fake-admin-token", body: JSON.stringify({ title: "", location: "Room 2.10", capacity: 0, categoryId: 1 }, null, 2) },
  { label: "Create (no token)", method: "POST", path: "/api/events", token: "", body: JSON.stringify({ title: "TS Bootcamp", location: "Room 2.10", capacity: 30, categoryId: 1 }, null, 2) },
  { label: "Create (user)", method: "POST", path: "/api/events", token: "fake-user-token", body: JSON.stringify({ title: "TS Bootcamp", location: "Room 2.10", capacity: 30, categoryId: 1 }, null, 2) },
  { label: "Update event 1", method: "PUT", path: "/api/events/1", token: "fake-admin-token", body: JSON.stringify({ title: "React Workshop (updated)", location: "Cavendish C1.04", capacity: 50, categoryId: 1 }, null, 2) },
  { label: "Delete event 2", method: "DELETE", path: "/api/events/2", token: "fake-admin-token", body: "" },
  { label: "Login", method: "POST", path: "/api/auth/login", token: "", body: JSON.stringify({ email: "admin@campus.test", password: "Passw0rd!" }, null, 2) },
];

const problem = (status: number, extra: Record<string, unknown> = {}) => ({ type: `https://tools.ietf.org/html/rfc9110`, title: REASON[status], status, ...extra });

function simulate(method: Method, path: string, ctype: string, token: string, body: string, db: Ev[]): { res: Res; db: Ev[] } {
  const r = (status: number, b: unknown | null, headers: Record<string, string> = {}): Res => ({
    status, text: REASON[status] ?? "", body: b,
    headers: { ...(b !== null ? { "Content-Type": status >= 400 ? "application/problem+json; charset=utf-8" : "application/json; charset=utf-8" } : {}), Date: new Date().toUTCString(), Server: "Kestrel", ...headers },
  });
  const role = token === "fake-admin-token" ? "ADMIN" : token === "fake-user-token" ? "USER" : token ? "INVALID" : null;
  const m = path.split("?")[0].match(/^\/api\/(events|categories|auth\/login)(?:\/(\w+))?\/?$/);
  if (!m) return { res: r(404, null), db };
  const [, resource, idStr] = m;
  let parsed: Record<string, unknown> | null = null;
  if (method === "POST" || method === "PUT") {
    if (!ctype.includes("application/json")) return { res: r(415, problem(415)), db };
    try { parsed = JSON.parse(body || "null"); } catch { return { res: r(400, problem(400, { errors: { $: ["The JSON value could not be converted / is malformed."] } })), db }; }
  }
  if (resource === "auth/login") {
    if (method !== "POST") return { res: r(405, null), db };
    const ok = parsed && parsed.email === "admin@campus.test" && parsed.password === "Passw0rd!";
    if (!ok) return { res: r(401, { message: "Invalid email or password" }), db };
    return { res: r(200, { token: "fake-admin-token", expiresAt: new Date(Date.now() + 3600_000).toISOString(), userId: 1, email: "admin@campus.test", firstName: "Ada", lastName: "Admin", role: "ADMIN" }), db };
  }
  if (resource === "categories") return { res: method === "GET" ? r(200, CATEGORIES) : r(405, null), db };
  // events
  const needsAdmin = method !== "GET";
  if (needsAdmin) {
    if (!role || role === "INVALID") return { res: r(401, null, { "WWW-Authenticate": role === "INVALID" ? 'Bearer error="invalid_token"' : "Bearer" }), db };
    if (role !== "ADMIN") return { res: r(403, null), db };
  }
  const id = idStr !== undefined ? Number(idStr) : null;
  if (idStr !== undefined && !Number.isInteger(id)) return { res: r(400, problem(400, { errors: { id: [`The value '${idStr}' is not valid.`] } })), db };
  const found = id !== null ? db.find((e) => e.id === id) : undefined;
  if (id !== null && !found) return { res: r(404, problem(404)), db };
  const validate = (p: Record<string, unknown> | null) => {
    const errors: Record<string, string[]> = {};
    if (!p || typeof p.title !== "string" || !p.title.trim()) errors.Title = ["The Title field is required."];
    if (!p || typeof p.location !== "string" || !p.location.trim()) errors.Location = ["The Location field is required."];
    if (!p || typeof p.capacity !== "number" || !Number.isInteger(p.capacity) || p.capacity < 1) errors.Capacity = ["Capacity must be at least 1."];
    return errors;
  };
  if (method === "GET") return { res: r(200, found ?? db.map(({ hasBookings: _h, ...e }) => e)), db };
  if (method === "POST") {
    if (id !== null) return { res: r(405, null), db };
    const errors = validate(parsed);
    if (Object.keys(errors).length) return { res: r(400, problem(400, { title: "One or more validation errors occurred.", errors })), db };
    const newId = Math.max(0, ...db.map((e) => e.id)) + 1;
    const ev: Ev = { id: newId, title: String(parsed!.title), location: String(parsed!.location), capacity: Number(parsed!.capacity), categoryId: Number(parsed!.categoryId ?? 1), hasBookings: false };
    const { hasBookings: _x, ...dto } = ev;
    return { res: r(201, dto, { Location: `http://localhost:5229/api/events/${newId}` }), db: [...db, ev] };
  }
  if (id === null) return { res: r(405, null), db };
  if (method === "PUT") {
    const errors = validate(parsed);
    if (Object.keys(errors).length) return { res: r(400, problem(400, { title: "One or more validation errors occurred.", errors })), db };
    return { res: r(204, null), db: db.map((e) => (e.id === id ? { ...e, title: String(parsed!.title), location: String(parsed!.location), capacity: Number(parsed!.capacity) } : e)) };
  }
  if (found!.hasBookings) return { res: r(400, { message: "Cannot delete an event that has bookings or reviews." }), db };
  return { res: r(204, null), db: db.filter((e) => e.id !== id) };
}

const QUIZ = [200, 201, 204, 400, 401, 403, 404, 409, 422, 429, 500, 503];
const SCENARIOS: Record<number, string> = {
  200: "GET /api/events returns the list of events.",
  201: "POST /api/events succeeded and the new event DTO is returned with a Location header.",
  204: "PUT /api/events/3 succeeded; the server sends no body.",
  400: "POST /api/events with an empty title — the server returns field errors.",
  401: "A request to an ADMIN endpoint with no Authorization header or an expired token.",
  403: "A logged-in USER calls DELETE /api/events/1, which requires ADMIN.",
  404: "GET /api/events/9999 — that id doesn't exist.",
  409: "Registering with an email that is already taken (conflicts with existing state).",
  422: "Well-formed JSON, but the end date is before the start date (some APIs use this instead of 400).",
  429: "The client sent 500 requests in a minute and is being throttled.",
  500: "An unhandled exception was thrown inside the controller.",
  503: "The server is down for maintenance / overloaded.",
};

export default function HttpLabViz() {
  const mark = useMarkOnce("http-lab");
  const [mode, setMode] = useState<"builder" | "quiz">("builder");
  const [method, setMethod] = useState<Method>("GET");
  const [path, setPath] = useState("/api/events");
  const [ctype, setCtype] = useState("application/json");
  const [token, setToken] = useState("");
  const [body, setBody] = useState("");
  const [db, setDb] = useState<Ev[]>(SEED);
  const [res, setRes] = useState<Res | null>(null);
  const [tab, setTab] = useState<"response" | "raw" | "frontend">("response");

  const hasBody = method === "POST" || method === "PUT";
  const rawRequest = useMemo(() => {
    const lines = [`${method} ${path} HTTP/1.1`, "Host: localhost:5229", "Accept: application/json"];
    if (hasBody && ctype) lines.push(`Content-Type: ${ctype}`);
    if (token) lines.push(`Authorization: Bearer ${token}`);
    if (hasBody) lines.push(`Content-Length: ${new TextEncoder().encode(body).length}`);
    return lines.join("\n") + "\n\n" + (hasBody ? body : "");
  }, [method, path, ctype, token, body, hasBody]);

  const send = () => {
    const out = simulate(method, path, ctype, token, hasBody ? body : "", db);
    setRes(out.res);
    setDb(out.db);
    mark();
  };
  const load = (p: (typeof PRESETS)[number]) => {
    setMethod(p.method); setPath(p.path); setToken(p.token); setBody(p.body); setCtype("application/json"); setRes(null);
  };

  const rawResponse = res
    ? `HTTP/1.1 ${res.status} ${res.text}\n${Object.entries(res.headers).map(([k, v]) => `${k}: ${v}`).join("\n")}\n\n${res.body === null ? "" : JSON.stringify(res.body, null, 2)}`
    : "";

  // quiz
  const [qIdx, setQIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState({ right: 0, total: 0 });
  const qStatus = QUIZ[qIdx % QUIZ.length];
  const options = useMemo(() => {
    const others = QUIZ.filter((s) => s !== qStatus).sort(() => Math.random() - 0.5).slice(0, 3);
    return [...others, qStatus].sort((a, b) => a - b);
  }, [qStatus]);

  return (
    <div className="space-y-4">
      <SimBanner>The CampusEvents API below is simulated in your browser (base URL modelled as http://localhost:5229). Use tokens <code className="font-mono">fake-admin-token</code> or <code className="font-mono">fake-user-token</code>.</SimBanner>
      <Segmented label="Mode" value={mode} onChange={setMode} options={[{ value: "builder", label: "Request builder" }, { value: "quiz", label: "Status code quiz" }]} />

      {mode === "builder" ? (
        <>
          <div className="flex flex-wrap gap-1.5">
            {PRESETS.map((p) => <Button key={p.label} size="sm" variant="ghost" onClick={() => load(p)}>{p.label}</Button>)}
            <Button size="sm" variant="ghost" onClick={() => { setDb(SEED); setRes(null); }}>Reset data</Button>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader icon={<Send size={16} />} title="Request" subtitle="Build it like you would in Postman" />
              <form className="space-y-3 p-3" onSubmit={(e) => { e.preventDefault(); send(); }}>
                <div className="flex gap-2">
                  <select aria-label="HTTP method" className={cn(inputCls, "w-28 font-mono")} value={method} onChange={(e) => setMethod(e.target.value as Method)}>
                    {(["GET", "POST", "PUT", "DELETE"] as Method[]).map((m) => <option key={m}>{m}</option>)}
                  </select>
                  <input aria-label="Path" className={cn(inputCls, "font-mono")} value={path} onChange={(e) => setPath(e.target.value)} />
                  <Button type="submit" variant="primary"><Send size={14} /> Send</Button>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <label><span className={labelCls}>Content-Type</span>
                    <select className={inputCls} value={ctype} onChange={(e) => setCtype(e.target.value)} disabled={!hasBody}>
                      <option value="application/json">application/json</option>
                      <option value="text/plain">text/plain</option>
                      <option value="">(none)</option>
                    </select>
                  </label>
                  <label><span className={labelCls}>Authorization: Bearer …</span>
                    <select className={inputCls} value={token} onChange={(e) => setToken(e.target.value)}>
                      <option value="">(no header)</option>
                      <option value="fake-admin-token">fake-admin-token (ADMIN)</option>
                      <option value="fake-user-token">fake-user-token (USER)</option>
                      <option value="garbage.token.value">garbage.token.value (invalid)</option>
                    </select>
                  </label>
                </div>
                <label className="block"><span className={labelCls}>JSON body {hasBody ? "" : "(GET/DELETE send no body)"}</span>
                  <textarea rows={7} className={textareaCls} value={body} onChange={(e) => setBody(e.target.value)} disabled={!hasBody} spellCheck={false} />
                </label>
                <div><span className={labelCls}>Raw HTTP request</span><Pre>{rawRequest}</Pre></div>
              </form>
            </Card>
            <Card>
              <CardHeader title="Response" action={res && <Badge tone={statusTone(res.status) === "neutral" ? "neutral" : statusTone(res.status)}>{res.status} {res.text}</Badge>} />
              <Tabs className="px-3" value={tab} onChange={setTab} tabs={[{ id: "response", label: "Body & headers" }, { id: "raw", label: "Raw" }, { id: "frontend", label: "What should the frontend do?" }]} />
              <div className="space-y-3 p-3 text-sm" aria-live="polite">
                {!res && <p className="text-fg-3">Press Send (or Enter in the path field).</p>}
                {res && tab === "response" && (
                  <>
                    <table className="w-full text-xs"><tbody>
                      {Object.entries(res.headers).map(([k, v]) => <tr key={k} className="border-t border-line"><td className="py-1 pr-2 font-mono text-fg-2">{k}</td><td className="break-all py-1 font-mono">{v}</td></tr>)}
                    </tbody></table>
                    <Pre>{res.body === null ? "(empty body)" : JSON.stringify(res.body, null, 2)}</Pre>
                  </>
                )}
                {res && tab === "raw" && <Pre>{rawResponse}</Pre>}
                {res && tab === "frontend" && (
                  <div className="space-y-2">
                    <p>{ADVICE[res.status] ?? "Method not allowed for this path."}</p>
                    <ul className="space-y-1 text-xs">
                      <li><Badge tone="success">fetch resolves</Badge> — any HTTP response (even 4xx/5xx) resolves the promise; only network failure / abort rejects.</li>
                      <li><Badge tone={res.status >= 200 && res.status < 300 ? "success" : "error"}>response.ok = {String(res.status >= 200 && res.status < 300)}</Badge> — true only for 200–299.</li>
                      <li><Badge tone={res.body !== null ? "success" : "error"}>response.json() {res.body !== null ? "safe" : "would throw"}</Badge> — {res.body !== null ? "there is a JSON body." : "the body is empty (e.g. 204), so JSON parsing fails."}</li>
                    </ul>
                  </div>
                )}
              </div>
              <div className="border-t border-line p-3">
                <div className={labelCls}>Server data (simulated DB)</div>
                <ul className="space-y-0.5 font-mono text-[11px] text-fg-2">
                  {db.map((e) => <li key={e.id}>#{e.id} {e.title} · cap {e.capacity}{e.hasBookings && <span className="text-warn"> · has bookings</span>}</li>)}
                </ul>
              </div>
            </Card>
          </div>
          <Callout tone="primary" title="Pattern">
            <code className="font-mono">const res = await fetch(url, opts); if (!res.ok) throw new Error(`HTTP ${"${res.status}"}`); return res.status === 204 ? undefined : res.json();</code>
          </Callout>
        </>
      ) : (
        <Card>
          <CardHeader icon={<ListChecks size={16} />} title="Which status code fits?" action={<Badge tone="primary">{score.right}/{score.total}</Badge>} />
          <div className="space-y-3 p-4">
            <p className="flex items-start gap-2 text-sm text-fg"><HelpCircle size={16} className="mt-0.5 shrink-0 text-primary" /> {SCENARIOS[qStatus]}</p>
            <div className="flex flex-wrap gap-2">
              {options.map((o) => (
                <Button key={o} variant={picked === null ? "secondary" : o === qStatus ? "success" : o === picked ? "danger" : "secondary"} disabled={picked !== null}
                  onClick={() => { setPicked(o); setScore((s) => ({ right: s.right + (o === qStatus ? 1 : 0), total: s.total + 1 })); mark(); }}>
                  {picked !== null && o === qStatus && <Check size={14} />}{picked === o && o !== qStatus && <X size={14} />}{o} {REASON[o]}
                </Button>
              ))}
            </div>
            {picked !== null && (
              <Callout tone={picked === qStatus ? "success" : "warning"} title={`${qStatus} ${REASON[qStatus]}`}>
                {ADVICE[qStatus]}
              </Callout>
            )}
            <Button variant="primary" size="sm" onClick={() => { setQIdx((i) => i + 1); setPicked(null); }}>Next question</Button>
          </div>
        </Card>
      )}
    </div>
  );
}
