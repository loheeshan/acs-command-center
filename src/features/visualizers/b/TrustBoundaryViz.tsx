import { useState } from "react";
import { Monitor, Server, ShieldAlert, ShieldCheck, ShieldOff, Skull } from "lucide-react";
import { Badge, Callout, Card, CardHeader } from "@/components/ui/primitives";
import { cn } from "@/lib/cn";
import { Pre, SimBanner, Toggle, useMarkOnce } from "./shared";

type AttackId = "localStorageRole" | "curl" | "body" | "idor" | "env" | "decode";
type ServerDef = "authn" | "authz" | "validation" | "ownership";
type Verdict = "bypassed" | "holds" | "n/a" | "breach" | "exposed";

interface Attack { id: AttackId; name: string; how: string; payload: string; browser: Partial<Record<string, Verdict>>; needs: ServerDef[]; breachText: string; safeText: string }

const BROWSER_DEFENCES = ["Route guards", "Hidden admin buttons", "Client-side validation", "Decoded JWT claims", "VITE_ env vars"];
const SERVER_DEFENCES: { id: ServerDef; label: string; desc: string }[] = [
  { id: "authn", label: "Authentication", desc: "JwtBearer verifies signature + expiry" },
  { id: "authz", label: "Authorisation (roles)", desc: '[Authorize(Roles = "ADMIN")]' },
  { id: "validation", label: "Server-side validation", desc: "DTO annotations / ModelState → 400" },
  { id: "ownership", label: "Ownership check", desc: "booking.UserId == current user id" },
];

const ATTACKS: Attack[] = [
  {
    id: "localStorageRole", name: "Edit role in localStorage", how: 'DevTools → Application → localStorage: change "role":"USER" to "ADMIN", reload.',
    payload: `localStorage.setItem("auth", JSON.stringify({ ...auth, role: "ADMIN" }))\n// then click the now-visible "Delete event" button\nDELETE /api/events/3\nAuthorization: Bearer <same USER token — role claim inside is still USER>`,
    browser: { "Route guards": "bypassed", "Hidden admin buttons": "bypassed" }, needs: ["authn", "authz"],
    breachText: "Without role checks on the server, a USER deletes events.", safeText: "Admin UI appears, but the server reads the role from the signed token → 403 Forbidden.",
  },
  {
    id: "curl", name: "Call the API directly (curl / DevTools)", how: "Skip the React app entirely.",
    payload: `curl -X DELETE http://localhost:5229/api/events/3\n# no Authorization header at all`,
    browser: { "Route guards": "bypassed", "Hidden admin buttons": "bypassed", "Client-side validation": "bypassed" }, needs: ["authn", "authz"],
    breachText: "An anonymous request deletes data.", safeText: "No token → 401 Unauthorized. Postman and curl ignore CORS, so only server checks matter.",
  },
  {
    id: "body", name: "Modify the request body", how: "Intercept the POST in DevTools and edit the JSON.",
    payload: `POST /api/events\nAuthorization: Bearer <valid ADMIN token>\n\n{ "title": "", "capacity": -50, "price": -10 }`,
    browser: { "Client-side validation": "bypassed" }, needs: ["authn", "validation"],
    breachText: "Invalid data (negative capacity, empty title) is saved to the database.", safeText: "Model validation rejects it → 400 with field errors.",
  },
  {
    id: "idor", name: "IDOR: GET /api/bookings/99", how: "Logged-in USER changes the id in the URL to someone else's booking.",
    payload: `GET /api/bookings/99\nAuthorization: Bearer <valid USER token, sub = 7>\n# booking 99 belongs to user 12`,
    browser: { "Route guards": "bypassed" }, needs: ["authn", "ownership"],
    breachText: "User 7 reads user 12's booking — Insecure Direct Object Reference.", safeText: "Server compares booking.UserId with the token's user id → 403 (or 404 to avoid revealing it exists).",
  },
  {
    id: "env", name: "Read VITE_ env vars from the bundle", how: "Open the built JS file and search for VITE_.",
    payload: `// dist/assets/index-abc123.js\nconst API_URL="http://localhost:5229/api",SECRET_KEY="sk_live_..."`,
    browser: { "VITE_ env vars": "exposed" }, needs: [],
    breachText: "", safeText: "Every VITE_ variable is inlined into public JS. Only put public config (like the API URL) there — never secrets.",
  },
  {
    id: "decode", name: "Decode the JWT", how: "Paste the token into any Base64URL decoder.",
    payload: `atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))\n// {"sub":"7","email":"…","role":"USER","exp":…}`,
    browser: { "Decoded JWT claims": "exposed" }, needs: [],
    breachText: "", safeText: "Expected: claims are readable by design. Harmless as long as no secrets are in the payload; changing them breaks the signature.",
  },
];

const tone: Record<Verdict, "success" | "warning" | "error" | "neutral"> = { holds: "success", bypassed: "warning", "n/a": "neutral", breach: "error", exposed: "warning" };

export default function TrustBoundaryViz() {
  const mark = useMarkOnce("trust-boundary");
  const [attack, setAttack] = useState<AttackId>("localStorageRole");
  const [server, setServer] = useState<Record<ServerDef, boolean>>({ authn: true, authz: true, validation: true, ownership: true });
  const a = ATTACKS.find((x) => x.id === attack)!;
  const missing = a.needs.filter((d) => !server[d]);
  const breached = a.needs.length > 0 && missing.length > 0;

  return (
    <div className="space-y-4">
      <SimBanner>Attack scenarios are modelled — nothing is actually sent. The point: everything in the browser is under the user's control.</SimBanner>

      <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label="Attack scenario">
        {ATTACKS.map((x) => (
          <button key={x.id} type="button" role="radio" aria-checked={attack === x.id} onClick={() => { setAttack(x.id); mark(); }}
            className={cn("rounded-md border px-2.5 py-1.5 text-xs", attack === x.id ? "border-err/50 bg-err-soft font-semibold text-err" : "border-line text-fg-2 hover:bg-hover")}>
            <Skull size={12} className="mr-1 inline" />{x.name}
          </button>
        ))}
      </div>

      <Card>
        <CardHeader icon={<Skull size={16} />} title={a.name} subtitle={a.how} />
        <div className="p-3"><Pre>{a.payload}</Pre></div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-warn/40">
          <CardHeader icon={<Monitor size={16} />} title="Browser — UNTRUSTED zone" subtitle="Runs on the attacker's machine. Good for UX, never for security." />
          <ul className="space-y-1.5 p-3">
            {BROWSER_DEFENCES.map((d) => {
              const v = a.browser[d] ?? "n/a";
              return (
                <li key={d} className="flex items-center justify-between gap-2 rounded-md border border-line px-2.5 py-1.5 text-sm">
                  <span className="flex items-center gap-2">{v === "bypassed" || v === "exposed" ? <ShieldOff size={14} className="text-warn" /> : <ShieldAlert size={14} className="text-fg-3" />}{d}</span>
                  <Badge tone={tone[v]}>{v === "n/a" ? "not involved" : v}</Badge>
                </li>
              );
            })}
          </ul>
        </Card>
        <Card className="border-ok/40">
          <CardHeader icon={<Server size={16} />} title="Server — TRUSTED zone" subtitle="Toggle defences off to see what breaks" />
          <ul className="space-y-1.5 p-3">
            {SERVER_DEFENCES.map((d) => {
              const involved = a.needs.includes(d.id);
              const v: Verdict = !involved ? "n/a" : server[d.id] ? "holds" : "breach";
              return (
                <li key={d.id} className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-line px-2.5 py-1.5 text-sm">
                  <span className="min-w-0">
                    <Toggle checked={server[d.id]} onChange={(on) => { setServer((s) => ({ ...s, [d.id]: on })); mark(); }} label={<span className="font-medium text-fg">{d.label}</span>} />
                    <span className="block pl-6 text-[11px] text-fg-3">{d.desc}</span>
                  </span>
                  <Badge tone={tone[v]}>{v === "n/a" ? "not involved" : v === "breach" ? "MISSING" : "holds"}</Badge>
                </li>
              );
            })}
            <li className="rounded-md border border-line px-2.5 py-1.5 text-xs text-fg-2">Database — only reachable through the server.</li>
          </ul>
        </Card>
      </div>

      <div aria-live="polite">
        {a.needs.length === 0 ? (
          <Callout tone="warning" title="Nothing to defend here — design accordingly" icon={<ShieldAlert size={14} />}>{a.safeText}</Callout>
        ) : breached ? (
          <Callout tone="error" title={`BREACH — missing: ${missing.map((m) => SERVER_DEFENCES.find((d) => d.id === m)!.label).join(", ")}`} icon={<ShieldOff size={14} />}>{a.breachText} The browser defences didn't matter; they were bypassed.</Callout>
        ) : (
          <Callout tone="success" title="Attack stopped at the server" icon={<ShieldCheck size={14} />}>{a.safeText}</Callout>
        )}
      </div>

      <Callout tone="primary" title="Rule of thumb">
        Frontend checks (route guards, hidden buttons, form validation, reading the role from a decoded token) improve the experience for honest users.
        Every security decision must be repeated on the server, which is the only place the user can't modify.
      </Callout>
    </div>
  );
}
