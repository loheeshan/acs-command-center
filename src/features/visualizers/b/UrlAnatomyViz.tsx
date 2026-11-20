import { useMemo, useState } from "react";
import { Globe, Link2 } from "lucide-react";
import { Badge, Button, Callout, Card, CardHeader } from "@/components/ui/primitives";
import { cn } from "@/lib/cn";
import { Pre, StepControls, StepList, inputCls, useMarkOnce, useStepper } from "./shared";

const EXAMPLES = [
  "https://campus.example.ac.uk/events/42?category=tech&sort=date&page=2#reviews",
  "http://localhost:5173/students/7?tab=grades",
  "http://localhost:5229/api/events?search=react%20workshop",
  "https://user:pw@shop.example.com:8443/cart?item=1&item=2#checkout",
];
const DEFAULT_PORT: Record<string, string> = { "http:": "80", "https:": "443", "ws:": "80", "wss:": "443", "ftp:": "21" };

const PART_STYLE: Record<string, string> = {
  protocol: "text-err",
  host: "text-violet",
  pathname: "text-primary",
  search: "text-warn",
  hash: "text-ok",
};

export default function UrlAnatomyViz() {
  const mark = useMarkOnce("url-anatomy");
  const [raw, setRaw] = useState(EXAMPLES[0]);

  const parsed = useMemo(() => {
    try {
      return { url: new URL(raw), error: null as string | null };
    } catch (e) {
      return { url: null, error: (e as Error).message };
    }
  }, [raw]);
  const u = parsed.url;
  const effectivePort = u ? u.port || DEFAULT_PORT[u.protocol] || "(none)" : "";
  const secure = u?.protocol === "https:";

  const steps = useMemo(() => {
    if (!u) return [];
    return [
      { title: "Browser parses the URL", detail: `Scheme ${u.protocol} → ${secure ? "HTTPS (TLS)" : "plain HTTP"}; host "${u.hostname}"; port ${effectivePort}.` },
      { title: "DNS lookup", detail: u.hostname === "localhost" || /^\d+\.\d+\.\d+\.\d+$/.test(u.hostname) ? `"${u.hostname}" needs no DNS query (localhost / literal IP → 127.0.0.1 or the IP itself).` : `Resolve "${u.hostname}" to an IP address (browser cache → OS cache → DNS resolver).` },
      { title: "TCP connection", detail: `Open a TCP connection to that IP on port ${effectivePort} (SYN → SYN-ACK → ACK).` },
      { title: secure ? "TLS handshake" : "TLS handshake (skipped)", detail: secure ? "Negotiate encryption and verify the server's certificate matches the hostname." : "http:// is unencrypted — anyone on the network path can read the traffic." },
      { title: "HTTP request sent", detail: "Only the path and query go in the request line; the hash (fragment) is never sent to the server." },
      { title: "Server sends the response", detail: "Status line, headers (Content-Type, Cache-Control, Set-Cookie…) and a body (HTML, JSON…)." },
      { title: "Browser parses & renders", detail: "HTML → DOM, CSS → CSSOM, run JS, layout, paint. Extra requests for linked CSS/JS/images. Then it scrolls to the #hash target if there is one." },
    ];
  }, [u, secure, effectivePort]);
  const s = useStepper(Math.max(1, steps.length), mark);

  const requestText = u
    ? `GET ${u.pathname}${u.search} HTTP/1.1\nHost: ${u.host}\nAccept: text/html,application/json\n${u.username ? `Authorization: Basic ${btoa(`${decodeURIComponent(u.username)}:${decodeURIComponent(u.password)}`)}\n` : ""}`
    : "";

  return (
    <div className="space-y-4">
      <div className="rounded-md border border-ok/30 bg-ok-soft px-3 py-2 text-xs text-ok"><strong>Live:</strong> parsed with the real <code className="font-mono">new URL()</code> API. The network steps below are an explanation — no request is made.</div>

      <Card>
        <CardHeader icon={<Link2 size={16} />} title="Type or paste a URL" />
        <div className="space-y-2 p-3">
          <input aria-label="URL" className={cn(inputCls, "font-mono")} value={raw} onChange={(e) => { setRaw(e.target.value); mark(); }} spellCheck={false} />
          <div className="flex flex-wrap gap-1.5">
            {EXAMPLES.map((ex, i) => <Button key={ex} size="sm" variant="ghost" onClick={() => { setRaw(ex); s.restart(); }}>Example {i + 1}</Button>)}
          </div>
          {parsed.error && <Callout tone="error" title="new URL() threw a TypeError">{parsed.error} — a relative URL needs a base: <code>new URL("/events", "http://localhost:5173")</code>.</Callout>}
          {u && (
            <p className="break-all rounded-md bg-code p-2.5 font-mono text-sm" aria-label="Colour-coded URL">
              <span className={PART_STYLE.protocol}>{u.protocol}//</span>
              {u.username && <span className="text-fg-3">{u.username}{u.password && ":" + u.password}@</span>}
              <span className={PART_STYLE.host}>{u.host}</span>
              <span className={PART_STYLE.pathname}>{u.pathname}</span>
              <span className={PART_STYLE.search}>{u.search}</span>
              <span className={PART_STYLE.hash}>{u.hash}</span>
            </p>
          )}
        </div>
      </Card>

      {u && (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader icon={<Globe size={16} />} title="URL properties" />
            <table className="w-full text-sm">
              <tbody>
                {([
                  ["protocol", u.protocol, "Scheme. Decides HTTP vs HTTPS."],
                  ["host", u.host, "hostname + port (port omitted when default)."],
                  ["hostname", u.hostname, "Name resolved by DNS."],
                  ["port", u.port || '""', u.port ? "Explicit port." : `Empty string = default port ${DEFAULT_PORT[u.protocol] ?? "?"} for ${u.protocol}`],
                  ["pathname", u.pathname, "Which resource. React Router matches on this."],
                  ["search", u.search || '""', "Query string, starts with ?"],
                  ["hash", u.hash || '""', "Fragment — stays in the browser, never sent to the server."],
                  ["origin", u.origin, "protocol + host + port. Same-origin policy and CORS compare this."],
                ] as const).map(([k, v, note]) => (
                  <tr key={k} className="border-t border-line align-top">
                    <td className="px-3 py-1.5 font-mono text-xs text-fg-2">url.{k}</td>
                    <td className="px-2 py-1.5 break-all font-mono text-xs text-fg">{v}</td>
                    <td className="px-3 py-1.5 text-xs text-fg-3">{note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="border-t border-line p-3">
              <div className="mb-1 text-xs font-medium text-fg-2">url.searchParams (URLSearchParams — values are always strings, already decoded)</div>
              {[...u.searchParams].length ? (
                <table className="w-full text-xs"><thead><tr className="text-fg-3"><th className="text-left font-medium">key</th><th className="text-left font-medium">value</th><th className="text-left font-medium">getAll(key)</th></tr></thead>
                  <tbody>{[...u.searchParams].map(([k, v], i) => (
                    <tr key={i} className="border-t border-line font-mono"><td className="py-1">{k}</td><td>"{v}"</td><td>{JSON.stringify(u.searchParams.getAll(k))}</td></tr>
                  ))}</tbody></table>
              ) : <p className="text-xs text-fg-3">No query parameters.</p>}
            </div>
          </Card>

          <Card>
            <CardHeader title="What happens after you press Enter" subtitle={<span className="inline-flex gap-1">{secure ? <Badge tone="success">HTTPS</Badge> : <Badge tone="warning">HTTP — unencrypted</Badge>}<Badge>port {effectivePort}</Badge></span>} />
            <div className="space-y-3 p-3">
              <StepControls s={s} />
              <StepList s={s} steps={steps} />
              {s.step >= 4 && (
                <div>
                  <div className="mb-1 text-xs font-medium text-fg-2">Request the server receives (note: no #hash)</div>
                  <Pre>{requestText}</Pre>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
