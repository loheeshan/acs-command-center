import "./monacoSetup";
import Editor, { type OnMount } from "@monaco-editor/react";
import { useUiStore } from "@/stores/uiStore";
import { monaco } from "./monacoSetup";
import { useEffect, useRef } from "react";

export interface Diagnostic {
  line: number;
  column: number;
  message: string;
  severity: "error" | "warning" | "info";
}

const LANG: Record<string, string> = { ts: "typescript", tsx: "typescript", js: "javascript", jsx: "javascript", css: "css", html: "html", json: "json" };

export function languageFromPath(path: string): string {
  const ext = path.split(".").pop() ?? "";
  return LANG[ext] ?? "plaintext";
}

/**
 * Monaco editor. Each file gets its own model at file:///<path> so that
 * relative imports between files resolve for TypeScript diagnostics.
 */
export default function CodeEditor({
  path,
  value,
  onChange,
  onDiagnostics,
  height = "100%",
  readOnly = false,
}: {
  path: string;
  value: string;
  onChange?: (v: string) => void;
  onDiagnostics?: (d: Diagnostic[]) => void;
  height?: string | number;
  readOnly?: boolean;
}) {
  const theme = useUiStore((s) => s.theme);
  const diagRef = useRef(onDiagnostics);
  diagRef.current = onDiagnostics;

  useEffect(() => {
    const uri = monaco.Uri.parse(`file:///${path}`);
    const update = () => {
      const markers = monaco.editor.getModelMarkers({ resource: uri });
      diagRef.current?.(
        markers.map((m) => ({
          line: m.startLineNumber,
          column: m.startColumn,
          message: m.message,
          severity: m.severity === monaco.MarkerSeverity.Error ? "error" : m.severity === monaco.MarkerSeverity.Warning ? "warning" : "info",
        })),
      );
    };
    const sub = monaco.editor.onDidChangeMarkers((uris) => {
      if (uris.some((u) => u.toString() === uri.toString())) update();
    });
    update();
    return () => sub.dispose();
  }, [path]);

  const handleMount: OnMount = (editor) => {
    editor.updateOptions({ tabSize: 2 });
  };

  return (
    <Editor
      height={height}
      path={path}
      defaultLanguage={languageFromPath(path)}
      language={languageFromPath(path)}
      value={value}
      theme={theme === "dark" ? "vs-dark" : "vs"}
      onChange={(v) => onChange?.(v ?? "")}
      onMount={handleMount}
      loading={<div className="p-4 text-sm text-fg-2">Loading editor…</div>}
      options={{
        readOnly,
        minimap: { enabled: false },
        fontSize: 13,
        fontFamily: "JetBrains Mono, Consolas, monospace",
        scrollBeyondLastLine: false,
        automaticLayout: true,
        wordWrap: "on",
        padding: { top: 8 },
        renderLineHighlight: "line",
        fixedOverflowWidgets: true,
      }}
    />
  );
}
