import { useCallback, useEffect, useRef, useState } from "react";
import { AlertTriangle, Globe, Square, Terminal } from "lucide-react";
import { buildSrcDoc, compileProject, loadRuntime, type SandboxFiles } from "./sandbox";
import { cn } from "@/lib/cn";
import { Badge, Tabs } from "@/components/ui/primitives";

export interface ConsoleEntry {
  level: "log" | "info" | "warn" | "error";
  text: string;
}
export interface NetworkEntry {
  method: string;
  url: string;
  status: number;
  aborted?: boolean;
  at: number;
}

type Status = "idle" | "running" | "ready" | "error" | "stopped";

/**
 * Runs a multi-file project in an isolated iframe and shows preview, console and network.
 * Re-runs whenever `runKey` changes.
 */
export function SandboxPreview({
  files,
  entry,
  autoRender,
  runKey,
  width,
  showPreview = true,
  className,
}: {
  files: SandboxFiles;
  entry: string;
  autoRender: boolean;
  runKey: number;
  width?: number;
  showPreview?: boolean;
  className?: string;
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [srcDoc, setSrcDoc] = useState<string>("");
  const [logs, setLogs] = useState<ConsoleEntry[]>([]);
  const [network, setNetwork] = useState<NetworkEntry[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [tab, setTab] = useState<"preview" | "console" | "network">(showPreview ? "preview" : "console");
  const runIdRef = useRef("");
  const filesRef = useRef(files);
  filesRef.current = files;

  const run = useCallback(async () => {
    const runId = `run-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    runIdRef.current = runId;
    setLogs([]);
    setNetwork([]);
    setStatus("running");
    const compiled = compileProject(filesRef.current);
    if (compiled.errors.length) {
      setLogs(compiled.errors.map((e) => ({ level: "error", text: `Compile error in ${e.file}: ${e.message}` })));
      setStatus("error");
      setTab("console");
      setSrcDoc("<!doctype html><p style='font-family:sans-serif;color:#b91c1c'>Compile error — see Console.</p>");
      return;
    }
    try {
      const runtime = await loadRuntime();
      if (runIdRef.current !== runId) return;
      setSrcDoc(buildSrcDoc({ runId, runtime, compiled, entry, autoRender }));
    } catch (e) {
      setLogs([{ level: "error", text: e instanceof Error ? e.message : String(e) }]);
      setStatus("error");
    }
  }, [entry, autoRender]);

  useEffect(() => {
    void run();
  }, [run, runKey]);

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      const d = e.data as { __acs?: boolean; runId?: string; type?: string; level?: ConsoleEntry["level"]; text?: string; message?: string; method?: string; url?: string; status?: number; aborted?: boolean };
      if (!d?.__acs || d.runId !== runIdRef.current) return;
      if (iframeRef.current && e.source !== iframeRef.current.contentWindow) return;
      if (d.type === "console") setLogs((l) => [...l.slice(-499), { level: d.level ?? "log", text: d.text ?? "" }]);
      else if (d.type === "error") {
        setLogs((l) => [...l, { level: "error", text: d.message ?? "Error" }]);
        setStatus("error");
      } else if (d.type === "ready") setStatus((s) => (s === "error" ? s : "ready"));
      else if (d.type === "network") setNetwork((n) => [...n, { method: d.method ?? "GET", url: d.url ?? "", status: d.status ?? 0, aborted: d.aborted, at: Date.now() }]);
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  const stop = () => {
    runIdRef.current = "stopped";
    setSrcDoc("<!doctype html><p style='font-family:sans-serif;color:#71717a'>Execution stopped.</p>");
    setStatus("stopped");
  };

  const errorCount = logs.filter((l) => l.level === "error").length;

  return (
    <div className={cn("flex min-h-0 flex-col", className)}>
      <div className="flex items-center justify-between gap-2 border-b border-line pr-2">
        <Tabs
          className="border-b-0"
          value={tab}
          onChange={setTab}
          tabs={[
            ...(showPreview ? [{ id: "preview" as const, label: "Preview" }] : []),
            { id: "console" as const, label: <span className="inline-flex items-center gap-1"><Terminal size={13} /> Console</span>, badge: errorCount ? <Badge tone="error">{errorCount}</Badge> : logs.length ? <Badge>{logs.length}</Badge> : undefined },
            { id: "network" as const, label: <span className="inline-flex items-center gap-1"><Globe size={13} /> Network</span>, badge: network.length ? <Badge tone="violet">{network.length}</Badge> : undefined },
          ]}
        />
        <div className="flex items-center gap-2">
          <span className={cn("text-[11px]", status === "error" ? "text-err" : status === "running" ? "text-warn" : "text-fg-3")}>
            {status === "running" ? "Running…" : status === "ready" ? "Running (live)" : status === "error" ? "Error" : status === "stopped" ? "Stopped" : ""}
          </span>
          <button type="button" onClick={stop} className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] text-fg-2 hover:bg-hover hover:text-err" aria-label="Stop execution">
            <Square size={11} /> Stop
          </button>
        </div>
      </div>
      <div className="relative min-h-0 flex-1">
        <div className={cn("absolute inset-0 overflow-auto bg-elevated", tab !== "preview" && "invisible")}>
          <div className="mx-auto h-full bg-white transition-all" style={{ maxWidth: width ? `${width}px` : "100%" }}>
            <iframe
              ref={iframeRef}
              title="Sandboxed code preview"
              sandbox="allow-scripts allow-modals"
              srcDoc={srcDoc}
              className="h-full w-full border-0 bg-white"
            />
          </div>
        </div>
        {tab === "console" && (
          <div className="absolute inset-0 overflow-auto bg-code p-2 font-mono text-[12px]" aria-live="polite">
            {logs.length === 0 && <p className="p-2 text-fg-3">No console output yet.</p>}
            {logs.map((l, i) => (
              <div
                key={i}
                className={cn(
                  "whitespace-pre-wrap break-words border-b border-line/60 px-2 py-1",
                  l.level === "error" && "bg-err-soft text-err",
                  l.level === "warn" && "bg-warn-soft text-warn",
                  (l.level === "log" || l.level === "info") && "text-fg",
                )}
              >
                {l.level === "error" && <AlertTriangle size={11} className="mr-1 inline" />}
                {l.text}
              </div>
            ))}
          </div>
        )}
        {tab === "network" && (
          <div className="absolute inset-0 overflow-auto bg-code p-2 text-[12px]">
            <p className="mb-2 px-1 text-[11px] text-fg-3">Requests answered by the in-sandbox <strong>mock API</strong> (simulated, ~0.5 s latency). Real network access is blocked.</p>
            {network.length === 0 && <p className="p-2 text-fg-3">No requests yet.</p>}
            <table className="w-full font-mono">
              <tbody>
                {network.map((n, i) => (
                  <tr key={i} className="border-b border-line/60">
                    <td className="px-2 py-1 font-semibold text-primary">{n.method}</td>
                    <td className="px-2 py-1 text-fg">{n.url}</td>
                    <td className={cn("px-2 py-1 text-right", n.aborted ? "text-fg-3" : n.status >= 400 ? "text-err" : "text-ok")}>{n.aborted ? "aborted" : n.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
