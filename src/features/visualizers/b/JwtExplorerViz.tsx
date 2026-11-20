import { useMemo, useState } from "react";
import { KeyRound, Eye, ShieldAlert, ShieldCheck, Lock } from "lucide-react";
import { Badge, Button, Callout, Card, CardHeader, Segmented } from "@/components/ui/primitives";
import { cn } from "@/lib/cn";
import { Pre, labelCls, textareaCls, useMarkOnce } from "./shared";

/** Correct Base64URL: UTF-8 bytes → btoa → replace + / with - _ → strip = padding. */
export function base64UrlEncode(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
export function base64UrlDecode(part: string): string {
  let b64 = part.replace(/-/g, "+").replace(/_/g, "/");
  while (b64.length % 4) b64 += "=";
  const bin = atob(b64);
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}
/** NOT a real signature — a deterministic fake so the token looks complete. */
function fakeSignature(input: string): string {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) h = Math.imul(h ^ input.charCodeAt(i), 16777619);
  let out = "";
  for (let i = 0; i < 4; i++) { h = Math.imul(h ^ (h >>> 13), 0x5bd1e995); out += (h >>> 0).toString(16).padStart(8, "0"); }
  return base64UrlEncode(`FAKE-SIG:${out}`);
}

const NOW = Math.floor(Date.now() / 1000);
const DEFAULT_HEADER = { alg: "HS256", typ: "JWT" };
const DEFAULT_PAYLOAD = {
  sub: "7",
  email: "student@campus.test",
  nameid: "7",
  unique_name: "student@campus.test",
  role: "USER",
  iat: NOW,
  nbf: NOW,
  exp: NOW + 3600,
  iss: "CampusEventsAPI",
  aud: "CampusEventsClient",
};

const PART_COLOURS = ["text-err", "text-violet", "text-primary"];
const PART_BG = ["bg-err-soft border-err/30", "bg-violet-soft border-violet/30", "bg-primary-soft border-primary/30"];

function fmtDate(sec: unknown) {
  return typeof sec === "number" ? new Date(sec * 1000).toLocaleString() : "—";
}

export default function JwtExplorerViz() {
  const mark = useMarkOnce("jwt-explorer");
  const [mode, setMode] = useState<"build" | "decode">("build");
  const [headerText, setHeaderText] = useState(JSON.stringify(DEFAULT_HEADER, null, 2));
  const [payloadText, setPayloadText] = useState(JSON.stringify(DEFAULT_PAYLOAD, null, 2));
  const [pasted, setPasted] = useState("");
  const [nowOffset, setNowOffset] = useState(0); // minutes relative to real now

  const built = useMemo(() => {
    try {
      const h = JSON.stringify(JSON.parse(headerText));
      const p = JSON.stringify(JSON.parse(payloadText));
      const head = base64UrlEncode(h);
      const body = base64UrlEncode(p);
      return { token: `${head}.${body}.${fakeSignature(head + "." + body)}`, error: null as string | null };
    } catch (e) {
      return { token: "", error: (e as Error).message };
    }
  }, [headerText, payloadText]);

  const token = mode === "build" ? built.token : pasted.trim();
  const decoded = useMemo(() => {
    if (!token) return null;
    const parts = token.split(".");
    if (parts.length !== 3) return { parts, error: `A JWS has 3 dot-separated parts; this has ${parts.length}.` } as const;
    try {
      const header = JSON.parse(base64UrlDecode(parts[0])) as Record<string, unknown>;
      const payload = JSON.parse(base64UrlDecode(parts[1])) as Record<string, unknown>;
      return { parts, header, payload, error: null } as const;
    } catch {
      return { parts, error: "Header or payload is not valid Base64URL-encoded JSON." } as const;
    }
  }, [token]);

  const nowSec = NOW + nowOffset * 60;
  const payload = decoded && !decoded.error ? decoded.payload : null;
  const exp = payload && typeof payload.exp === "number" ? payload.exp : null;
  const expired = exp !== null && nowSec >= exp;
  const lifetimeMin = payload && typeof payload.iat === "number" && exp !== null ? Math.round((exp - payload.iat) / 60) : null;

  const patchPayload = (extra: Record<string, unknown>) => {
    try { setPayloadText(JSON.stringify({ ...JSON.parse(payloadText || "{}"), ...extra }, null, 2)); mark(); } catch { /* invalid JSON: leave as is */ }
  };
  const sensitive = payload ? Object.keys(payload).filter((k) => /pass|secret|pwd|card|ssn/i.test(k)) : [];

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-2 rounded-md border border-violet/30 bg-violet-soft px-3 py-2 text-xs text-violet">
        <KeyRound size={14} className="mt-0.5 shrink-0" />
        <span><strong>Live tool, fictional tokens only.</strong> The default is an example payload modelled on CampusEvents (claim keys as serialised by JwtSecurityTokenHandler). The signature is FAKE — no key is used, so nothing here can be verified. Never paste a real production token into any website.</span>
      </div>

      <div className="grid gap-2 md:grid-cols-3">
        <Callout tone="warning" title="Signed ≠ encrypted" icon={<Eye size={14} />}>Header and payload are only Base64URL-encoded — anyone holding the token can read them.</Callout>
        <Callout tone="primary" title="Decoding ≠ verifying" icon={<ShieldCheck size={14} />}>Only the server with the signing key can verify the signature. Decoded claims in the browser are for UI hints only.</Callout>
        <Callout tone="error" title="No secrets in the payload" icon={<Lock size={14} />}>Never put passwords, keys or personal secrets in claims.</Callout>
      </div>

      <Segmented label="Mode" value={mode} onChange={(m) => { setMode(m); mark(); }} options={[{ value: "build", label: "Build a token" }, { value: "decode", label: "Decode a pasted token" }]} />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title={mode === "build" ? "Edit header & payload JSON" : "Paste a token"} subtitle={mode === "build" ? "Encoded live as you type" : "Try the token from Build mode, then change one character"} />
          <div className="space-y-3 p-3">
            {mode === "build" ? (
              <>
                <label className="block"><span className={labelCls}>Header</span>
                  <textarea className={textareaCls} rows={4} value={headerText} onChange={(e) => { setHeaderText(e.target.value); mark(); }} spellCheck={false} />
                </label>
                <label className="block"><span className={labelCls}>Payload (claims)</span>
                  <textarea className={textareaCls} rows={13} value={payloadText} onChange={(e) => { setPayloadText(e.target.value); mark(); }} spellCheck={false} />
                </label>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" onClick={() => patchPayload({ role: "ADMIN" })}>Set role = ADMIN</Button>
                  <Button size="sm" onClick={() => patchPayload({ password: "hunter2" })}>Add a password claim (bad!)</Button>
                  <Button size="sm" variant="ghost" onClick={() => { setHeaderText(JSON.stringify(DEFAULT_HEADER, null, 2)); setPayloadText(JSON.stringify(DEFAULT_PAYLOAD, null, 2)); }}>Reset</Button>
                </div>
                {built.error && <p className="text-xs text-err" role="alert">JSON error: {built.error}</p>}
              </>
            ) : (
              <>
                <textarea aria-label="JWT to decode" className={textareaCls} rows={6} value={pasted} onChange={(e) => { setPasted(e.target.value); mark(); }} placeholder="eyJhbGciOi..." spellCheck={false} />
                <Button size="sm" onClick={() => setPasted(built.token)} disabled={!built.token}>Use the token from Build mode</Button>
              </>
            )}
          </div>
        </Card>

        <Card>
          <CardHeader title="The three parts" subtitle="header . payload . signature" />
          <div className="space-y-3 p-3">
            {token ? (
              <p className="break-all rounded-md border border-line bg-code p-2.5 font-mono text-[11.5px] leading-relaxed">
                {token.split(".").map((p, i, arr) => (
                  <span key={i}><span className={PART_COLOURS[i] ?? "text-fg"}>{p}</span>{i < arr.length - 1 && <span className="text-fg">.</span>}</span>
                ))}
              </p>
            ) : <p className="text-sm text-fg-3">No token yet.</p>}
            {decoded?.error && <Callout tone="error">{decoded.error}</Callout>}
            {decoded && !decoded.error && (
              <div className="grid gap-2">
                {[["Header", decoded.header], ["Payload", decoded.payload]].map(([name, obj], i) => (
                  <div key={String(name)} className={cn("rounded-md border p-2", PART_BG[i])}>
                    <div className={cn("mb-1 text-xs font-semibold", PART_COLOURS[i])}>{String(name)} (decoded — no key needed)</div>
                    <Pre className="bg-transparent border-0 p-0">{JSON.stringify(obj, null, 2)}</Pre>
                  </div>
                ))}
                <div className={cn("rounded-md border p-2 text-xs", PART_BG[2])}>
                  <div className={cn("mb-1 font-semibold", PART_COLOURS[2])}>Signature</div>
                  <span className="text-fg-2">HMACSHA256(base64url(header) + "." + base64url(payload), serverSecret). The browser cannot recompute or check this without the secret — here it is fake. Changing any payload character makes a real server reject the token (401).</span>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      {payload && (
        <Card>
          <CardHeader title="Time claims & expiry simulator" subtitle="exp / iat / nbf are seconds since 1970-01-01 UTC (NumericDate)" action={exp !== null && <Badge tone={expired ? "error" : "success"}>{expired ? "EXPIRED → server returns 401" : "not expired"}</Badge>} />
          <div className="space-y-3 p-3 text-sm">
            <div className="grid gap-2 sm:grid-cols-3 text-xs">
              <div><span className="text-fg-2">iat (issued at)</span><div className="font-mono">{fmtDate(payload.iat)}</div></div>
              <div><span className="text-fg-2">exp (expires)</span><div className="font-mono">{fmtDate(payload.exp)}</div></div>
              <div><span className="text-fg-2">lifetime</span><div className="font-mono">{lifetimeMin !== null ? `${lifetimeMin} min` : "—"}</div></div>
            </div>
            <label className="block">
              <span className={labelCls}>Simulated "now": {nowOffset >= 0 ? "+" : ""}{nowOffset} min → {new Date(nowSec * 1000).toLocaleString()}</span>
              <input type="range" min={-120} max={240} step={5} value={nowOffset} onChange={(e) => { setNowOffset(Number(e.target.value)); mark(); }} className="w-full accent-[var(--primary)]" aria-label="Simulated current time offset in minutes" />
            </label>
            {exp !== null && (
              <p className="text-xs text-fg-2">
                {expired ? `Expired ${Math.round((nowSec - exp) / 60)} min ago. The frontend may check exp to log the user out early (UX), but the server is what actually rejects it.` : `Valid for another ${Math.round((exp - nowSec) / 60)} min (ignoring the server's small clock-skew allowance).`}
              </p>
            )}
            {payload.role !== undefined && (
              <p className="text-xs text-fg-2">
                Claim <code className="font-mono">role = {JSON.stringify(payload.role)}</code>. Editing it here produces a token whose signature no longer matches — a real server rejects it with 401. Trust the role only after server-side verification.
              </p>
            )}
          </div>
        </Card>
      )}

      {sensitive.length > 0 && (
        <Callout tone="error" title="Sensitive-looking claim detected" icon={<ShieldAlert size={14} />}>
          <code className="font-mono">{sensitive.join(", ")}</code> is readable by anyone who sees this token (browser storage, logs, proxies). Remove it.
        </Callout>
      )}
    </div>
  );
}
