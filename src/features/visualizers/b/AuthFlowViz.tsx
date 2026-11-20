import { useMemo, useState } from "react";
import { Monitor, Server, ArrowRight, ArrowLeft, ShieldCheck } from "lucide-react";
import { Badge, Callout, Card, Segmented } from "@/components/ui/primitives";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { cn } from "@/lib/cn";
import { Pre, SimBanner, StepControls, StepList, useMarkOnce, useStepper } from "./shared";

type Scenario = "admin" | "user403" | "expired" | "tampered";
type Actor = "browser" | "toServer" | "server" | "toBrowser";
interface Step { title: string; actor: Actor; detail: string; payload?: string; fe?: number[]; be?: number[]; tone?: "ok" | "err" | "warn" }

const FE = `// authService.ts
export async function login(email: string, password: string) {
  const res = await fetch(\`\${API}/auth/login\`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("Invalid credentials");
  return (await res.json()) as AuthResponseDto;
}
// after login: useAuthStore.getState().setAuth(dto)

// apiClient.ts — every protected call
const res = await fetch(\`\${API}/events/3\`, {
  method: "DELETE",
  headers: { Authorization: \`Bearer \${token}\` },
});
if (res.status === 401) { clearAuth(); navigate("/login"); }
else if (res.status === 403) showError("Not allowed");
else if (res.ok) refreshEvents();`;

const BE = `// AuthController.cs
[HttpPost("login")]
public async Task<IActionResult> Login(LoginDto dto) {
  var user = await _users.FindByEmailAsync(dto.Email);
  if (user == null || !VerifyHash(dto.Password, user.PasswordHash))
    return Unauthorized();
  var token = _jwt.CreateToken(user);   // signs with secret key
  return Ok(new AuthResponseDto(token, expiresAt, user..., role));
}

// Program.cs — JwtBearer validates signature, exp, iss, aud
// EventsController.cs
[Authorize(Roles = "ADMIN")]
[HttpDelete("{id}")]
public async Task<IActionResult> Delete(int id) { ... return NoContent(); }`;

const LOGIN_RES = (role: string) => `HTTP/1.1 200 OK
Content-Type: application/json

{
  "token": "eyJhbGciOiJIUzI1NiIs...(fictional)",
  "expiresAt": "2026-11-20T15:00:00Z",
  "userId": 7,
  "email": "${role === "ADMIN" ? "admin" : "student"}@campus.test",
  "firstName": "Sam",
  "lastName": "Example",
  "role": "${role}"
}`;

function buildSteps(sc: Scenario): Step[] {
  const role = sc === "user403" ? "USER" : "ADMIN";
  const common: Step[] = [
    { title: "User submits the login form", actor: "browser", detail: "Client-side validation checks the email/password fields are filled (UX only).", fe: [2] },
    { title: "POST /api/auth/login", actor: "toServer", detail: "Credentials travel in the JSON body — over HTTPS in production.", payload: `POST /api/auth/login HTTP/1.1\nContent-Type: application/json\n\n{ "email": "...@campus.test", "password": "••••••••" }`, fe: [3, 4, 5, 6], be: [2, 3] },
    { title: "Server verifies credentials", actor: "server", detail: "Looks up the user and compares the password hash. Wrong password → 401 and no token.", be: [4, 5, 6] },
    { title: "Server issues a signed JWT", actor: "server", detail: "Claims (sub, email, nameid, unique_name, role, exp, iss, aud) are signed with the server's secret key.", be: [7] },
    { title: "200 AuthResponseDto", actor: "toBrowser", detail: "The DTO's role field is the user's first role — UI hints only; the token's claims are what the server trusts.", payload: LOGIN_RES(role), be: [8], fe: [8, 9] },
    { title: "Frontend stores auth state", actor: "browser", detail: "Token + role go into an auth store (and maybe localStorage). Route guards and hidden buttons now use the role — purely for UX.", fe: [11] },
  ];
  if (sc === "expired") common.push({ title: "⏱ 61 minutes pass", actor: "browser", detail: "The token's exp is now in the past. The browser still holds it.", tone: "warn" });
  if (sc === "tampered") common.push({ title: "Attacker edits the token's payload", actor: "browser", detail: 'They Base64URL-decode the payload, change "role": "USER" → "ADMIN" and re-encode. They cannot re-sign without the secret key.', tone: "warn" });
  const tokenDesc = sc === "tampered" ? "eyJ...(edited payload).(old signature)" : "eyJhbGciOi...";
  common.push({ title: "Protected request with Bearer token", actor: "toServer", detail: "The apiClient attaches the Authorization header.", payload: `DELETE /api/events/3 HTTP/1.1\nAuthorization: Bearer ${tokenDesc}`, fe: [13, 14, 15, 16], be: [13, 14] });
  if (sc === "expired") {
    common.push({ title: "JwtBearer: signature OK, exp FAILED", actor: "server", detail: "Authentication fails because the token has expired → 401 (the controller never runs).", be: [11], tone: "err" });
    common.push({ title: "401 Unauthorized", actor: "toBrowser", detail: 'WWW-Authenticate: Bearer error="invalid_token", error_description="The token expired..."', payload: `HTTP/1.1 401 Unauthorized\nWWW-Authenticate: Bearer error="invalid_token"`, tone: "err" });
    common.push({ title: "Frontend clears auth state → /login", actor: "browser", detail: "On 401: remove the token, reset the store, redirect to /login (optionally remember where they were).", fe: [17], tone: "warn" });
  } else if (sc === "tampered") {
    common.push({ title: "JwtBearer: signature FAILED", actor: "server", detail: "Recomputing HMAC over the edited header.payload gives a different signature → token rejected → 401.", be: [11], tone: "err" });
    common.push({ title: "401 Unauthorized", actor: "toBrowser", detail: "Editing claims in the browser can't grant rights the server didn't sign.", payload: `HTTP/1.1 401 Unauthorized\nWWW-Authenticate: Bearer error="invalid_token"`, tone: "err" });
    common.push({ title: "Frontend clears auth state → /login", actor: "browser", detail: "Same 401 handling as an expired token.", fe: [17], tone: "warn" });
  } else {
    common.push({ title: "JwtBearer: signature ✓, exp ✓, iss/aud ✓", actor: "server", detail: "Authenticated: HttpContext.User now holds the token's claims.", be: [11], tone: "ok" });
    if (sc === "user403") {
      common.push({ title: '[Authorize(Roles = "ADMIN")] FAILED', actor: "server", detail: "The user is known (authenticated) but role is USER → 403 Forbidden.", be: [13], tone: "err" });
      common.push({ title: "403 Forbidden", actor: "toBrowser", detail: "Logging in again won't help — show a permission message, keep the session.", payload: "HTTP/1.1 403 Forbidden", fe: [18], tone: "err" });
    } else {
      common.push({ title: '[Authorize(Roles = "ADMIN")] ✓ → controller runs', actor: "server", detail: "Authorisation passes; the event is deleted (no bookings).", be: [13, 14, 15], tone: "ok" });
      common.push({ title: "204 No Content", actor: "toBrowser", detail: "Success with an empty body — refresh the event list; don't call res.json().", payload: "HTTP/1.1 204 No Content", fe: [19], tone: "ok" });
    }
  }
  return common;
}

const LANES: { id: Actor; label: string }[] = [
  { id: "browser", label: "Browser (React)" },
  { id: "toServer", label: "→ request" },
  { id: "toBrowser", label: "← response" },
  { id: "server", label: "Server (ASP.NET Core)" },
];

export default function AuthFlowViz() {
  const mark = useMarkOnce("auth-flow");
  const [sc, setSc] = useState<Scenario>("admin");
  const steps = useMemo(() => buildSteps(sc), [sc]);
  const s = useStepper(steps.length, mark);
  const cur = steps[Math.min(s.step, steps.length - 1)];

  return (
    <div className="space-y-4">
      <SimBanner>Step through a modelled CampusEvents login and protected request. Tokens are fictional.</SimBanner>
      <div className="flex flex-wrap items-center gap-3">
        <Segmented label="Scenario" value={sc} onChange={(v) => { setSc(v); s.restart(); }} options={[
          { value: "admin", label: "Valid admin" },
          { value: "user403", label: "USER on admin endpoint" },
          { value: "expired", label: "Expired token" },
          { value: "tampered", label: "Tampered token" },
        ]} />
      </div>
      <StepControls s={s} />

      <Card>
        <div className="grid grid-cols-1 gap-2 p-3 sm:grid-cols-[1fr_auto_1fr]">
          <div className={cn("flex items-center gap-2 rounded-md border p-3 transition-colors", cur.actor === "browser" ? "border-primary bg-primary-soft" : "border-line")}>
            <Monitor size={18} className="text-primary" /><span className="text-sm font-medium">Browser (React app)</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-xs text-fg-2">
            <span className={cn("inline-flex items-center gap-1 rounded px-2 py-1", cur.actor === "toServer" && "bg-violet-soft text-violet")}><ArrowRight size={14} /> request</span>
            <span className={cn("inline-flex items-center gap-1 rounded px-2 py-1", cur.actor === "toBrowser" && "bg-violet-soft text-violet")}><ArrowLeft size={14} /> response</span>
          </div>
          <div className={cn("flex items-center gap-2 rounded-md border p-3 transition-colors", cur.actor === "server" ? "border-primary bg-primary-soft" : "border-line")}>
            <Server size={18} className="text-primary" /><span className="text-sm font-medium">Server (ASP.NET Core API)</span>
          </div>
        </div>
        <div className="border-t border-line p-3" aria-live="polite">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={cur.tone === "err" ? "error" : cur.tone === "ok" ? "success" : cur.tone === "warn" ? "warning" : "primary"}>{LANES.find((l) => l.id === cur.actor)?.label}</Badge>
            <span className="text-sm font-semibold text-fg">{cur.title}</span>
          </div>
          <p className="mt-1 text-sm text-fg-2">{cur.detail}</p>
          {cur.payload && <Pre className="mt-2">{cur.payload}</Pre>}
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
        <StepList s={s} steps={steps.map((st) => ({ title: st.title }))} />
        <div className="grid gap-4 xl:grid-cols-2">
          <CodeBlock code={FE} language="ts" title="Frontend" highlightLines={new Set(cur.fe ?? [])} runnable={false} />
          <CodeBlock code={BE} language="text" title="Backend (C#)" highlightLines={new Set(cur.be ?? [])} runnable={false} />
        </div>
      </div>

      <Callout tone="primary" title="401 vs 403" icon={<ShieldCheck size={14} />}>
        401 = the server doesn't know who you are (missing / invalid / expired / tampered token) → clear auth and log in again.
        403 = the server knows who you are but you lack permission → show a message; re-login won't help.
      </Callout>
    </div>
  );
}
