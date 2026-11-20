import { useMemo, useState } from "react";
import { Globe2, ShieldQuestion } from "lucide-react";
import { Badge, Callout, Card, CardHeader } from "@/components/ui/primitives";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { cn } from "@/lib/cn";
import { Pre, SimBanner, StepControls, Toggle, inputCls, labelCls, useMarkOnce, useStepper } from "./shared";

const API_ORIGIN = "http://localhost:5229";
const ORIGINS = ["http://localhost:5173", "http://localhost:3000", "https://evil.example", API_ORIGIN];
const METHODS = ["GET", "POST", "PUT", "DELETE"];
const CTYPES = ["(none)", "text/plain", "application/x-www-form-urlencoded", "application/json"];
const SAFE_CTYPES = ["text/plain", "application/x-www-form-urlencoded", "multipart/form-data"];

interface Phase { title: string; who: string; text: string; tone: "primary" | "success" | "error" | "warning" }

export default function CorsPreflightViz() {
  const mark = useMarkOnce("cors-preflight");
  const [origin, setOrigin] = useState(ORIGINS[0]);
  const [method, setMethod] = useState("POST");
  const [ctype, setCtype] = useState("application/json");
  const [auth, setAuth] = useState(true);
  const [allowOrigin, setAllowOrigin] = useState(true);
  const [anyMethod, setAnyMethod] = useState(true);
  const [anyHeader, setAnyHeader] = useState(true);

  const result = useMemo(() => {
    const sameOrigin = origin === API_ORIGIN;
    const reqHeaders = [...(ctype !== "(none)" ? ["content-type"] : []), ...(auth ? ["authorization"] : [])];
    const reasons: string[] = [];
    if (!["GET", "HEAD", "POST"].includes(method)) reasons.push(`method ${method} is not GET/HEAD/POST`);
    if (auth) reasons.push("Authorization is not a CORS-safelisted header");
    if (ctype !== "(none)" && !SAFE_CTYPES.includes(ctype)) reasons.push(`Content-Type ${ctype} is not one of the 3 simple types`);
    const simple = reasons.length === 0;
    const originOk = allowOrigin && origin === "http://localhost:5173";
    const methodOk = anyMethod || ["GET", "POST"].includes(method);
    const unlisted = reqHeaders.filter((h) => !anyHeader && h !== "content-type");
    const headersOk = unlisted.length === 0;
    const phases: Phase[] = [];
    phases.push({ title: "fetch() called", who: "JavaScript", tone: "primary", text: `Page at ${origin} calls fetch("${API_ORIGIN}/api/events", { method: "${method}" }). Different origin? ${sameOrigin ? "No — same origin, CORS doesn't apply." : "Yes (scheme/host/port differ) → CORS rules apply."}` });
    if (sameOrigin) {
      phases.push({ title: "Request sent normally", who: "Browser", tone: "success", text: `${method} /api/events HTTP/1.1\nHost: localhost:5229` });
      return { simple, reasons, phases, outcome: "ok" as const, sameOrigin };
    }
    phases.push({ title: simple ? "Classified: SIMPLE request" : "Classified: needs PREFLIGHT", who: "Browser", tone: simple ? "success" : "warning", text: simple ? "No preflight: the browser sends the real request straight away, with an Origin header." : `Preflight needed because: ${reasons.join("; ")}.` });
    if (!simple) {
      phases.push({ title: "Preflight OPTIONS request", who: "Browser → Server", tone: "primary", text: `OPTIONS /api/events HTTP/1.1\nOrigin: ${origin}\nAccess-Control-Request-Method: ${method}${reqHeaders.length ? `\nAccess-Control-Request-Headers: ${reqHeaders.join(",")}` : ""}` });
      const allowed = originOk && methodOk && headersOk;
      phases.push({
        title: "Preflight response", who: "Server → Browser", tone: allowed ? "success" : "error",
        text: `HTTP/1.1 204 No Content${originOk ? `\nAccess-Control-Allow-Origin: ${origin}` : ""}${originOk ? `\nAccess-Control-Allow-Methods: ${anyMethod ? method : "GET,POST"}` : ""}${originOk && reqHeaders.length ? `\nAccess-Control-Allow-Headers: ${anyHeader ? reqHeaders.join(",") : "content-type"}` : ""}`,
      });
      if (!allowed) {
        const why = !originOk ? `origin ${origin} not allowed` : !methodOk ? `method ${method} not allowed` : `header(s) ${unlisted.join(", ")} not allowed`;
        phases.push({ title: "Browser blocks — real request NEVER sent", who: "Browser", tone: "error", text: `Console: "Access to fetch … has been blocked by CORS policy" (${why}). fetch() rejects with TypeError: Failed to fetch. The server never sees the ${method}.` });
        return { simple, reasons, phases, outcome: "blocked-preflight" as const, sameOrigin };
      }
    }
    phases.push({ title: "Actual request", who: "Browser → Server", tone: "primary", text: `${method} /api/events HTTP/1.1\nOrigin: ${origin}${ctype !== "(none)" ? `\nContent-Type: ${ctype}` : ""}${auth ? "\nAuthorization: Bearer eyJ…" : ""}` });
    phases.push({ title: "Server responds", who: "Server → Browser", tone: originOk ? "success" : "warning", text: `HTTP/1.1 200 OK${originOk ? `\nAccess-Control-Allow-Origin: ${origin}` : "\n(no Access-Control-Allow-Origin header)"}\nContent-Type: application/json` });
    if (!originOk) {
      phases.push({ title: "Browser hides the response from JS", who: "Browser", tone: "error", text: "The request DID reach the server (and any side effects happened), but without a matching Access-Control-Allow-Origin the browser refuses to give the response to your code. fetch() rejects with TypeError." });
      return { simple, reasons, phases, outcome: "blocked-read" as const, sameOrigin };
    }
    phases.push({ title: "JavaScript gets the response", who: "Browser", tone: "success", text: "CORS checks passed. Now check response.ok as usual — CORS says nothing about whether you're authorised." });
    return { simple, reasons, phases, outcome: "ok" as const, sameOrigin };
  }, [origin, method, ctype, auth, allowOrigin, anyMethod, anyHeader]);

  const s = useStepper(result.phases.length, mark);
  const visible = result.phases.slice(0, Math.min(s.step, result.phases.length - 1) + 1);

  const serverCode = `// Program.cs (ASP.NET Core) — modelled on CampusEvents
builder.Services.AddCors(o => o.AddPolicy("Frontend", p => p
${allowOrigin ? '    .WithOrigins("http://localhost:5173")' : "    // .WithOrigins(...) — origin NOT allowed"}
${anyMethod ? "    .AllowAnyMethod()" : '    .WithMethods("GET", "POST")'}
${anyHeader ? "    .AllowAnyHeader()));" : '    .WithHeaders("Content-Type")));'}
app.UseCors("Frontend");`;

  const sel = (label: string, value: string, set: (v: string) => void, opts: string[]) => (
    <label className="block"><span className={labelCls}>{label}</span>
      <select className={cn(inputCls, "font-mono text-xs")} value={value} onChange={(e) => { set(e.target.value); s.restart(); mark(); }}>
        {opts.map((o) => <option key={o}>{o}</option>)}
      </select>
    </label>
  );

  return (
    <div className="space-y-4">
      <SimBanner>The browser's CORS algorithm is modelled here; the API at {API_ORIGIN} is imaginary.</SimBanner>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader icon={<Globe2 size={16} />} title="The request (frontend)" />
          <div className="grid gap-3 p-3 sm:grid-cols-2">
            {sel("Page origin", origin, setOrigin, ORIGINS)}
            {sel("Method", method, setMethod, METHODS)}
            {sel("Content-Type", ctype, setCtype, CTYPES)}
            <div className="flex items-end pb-1"><Toggle checked={auth} onChange={(v) => { setAuth(v); s.restart(); }} label="Authorization: Bearer header" /></div>
          </div>
          <div className="border-t border-line p-3">
            {result.sameOrigin ? <Badge tone="success">Same origin — no CORS</Badge> : result.simple ? <Badge tone="success">Simple request — no preflight</Badge> : <Badge tone="warning">Preflight required</Badge>}
            {!result.simple && !result.sameOrigin && <ul className="mt-2 list-disc pl-5 text-xs text-fg-2">{result.reasons.map((r) => <li key={r}>{r}</li>)}</ul>}
          </div>
        </Card>
        <Card>
          <CardHeader icon={<ShieldQuestion size={16} />} title="Server CORS policy" />
          <div className="space-y-2 p-3">
            <Toggle checked={allowOrigin} onChange={(v) => { setAllowOrigin(v); s.restart(); }} label="Allow origin http://localhost:5173" />
            <Toggle checked={anyMethod} onChange={(v) => { setAnyMethod(v); s.restart(); }} label="AllowAnyMethod (else only GET, POST)" />
            <Toggle checked={anyHeader} onChange={(v) => { setAnyHeader(v); s.restart(); }} label="AllowAnyHeader (else only Content-Type)" />
            <CodeBlock code={serverCode} language="text" title="Program.cs" highlightLines={new Set([3, 4, 5])} runnable={false} />
          </div>
        </Card>
      </div>

      <StepControls s={s} label="Phase" />
      <ol className="space-y-2" aria-live="polite">
        {visible.map((p, i) => (
          <li key={i} className={cn("rounded-md border p-3", i === visible.length - 1 ? "border-primary/50" : "border-line")}>
            <div className="flex flex-wrap items-center gap-2"><Badge tone={p.tone}>{p.who}</Badge><span className="text-sm font-semibold text-fg">{p.title}</span></div>
            {p.text.includes("\n") || p.text.startsWith("OPTIONS") || p.text.startsWith("HTTP") ? <Pre className="mt-2">{p.text}</Pre> : <p className="mt-1 text-sm text-fg-2">{p.text}</p>}
          </li>
        ))}
      </ol>

      <div className="grid gap-2 md:grid-cols-2">
        <Callout tone="warning" title="CORS is enforced by browsers">Postman, curl and server-to-server calls ignore it entirely. It protects users' browsers from other sites reading responses — it does not protect your API.</Callout>
        <Callout tone="error" title="CORS is not authentication">Allowing an origin doesn't make a request authorised. Use JWT authentication and role checks on the server.</Callout>
      </div>
    </div>
  );
}
