import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FilePlus2, Monitor, Play, RotateCcw, Save, Smartphone, Tablet, X } from "lucide-react";
import { PRESETS, presetById, type PlaygroundPreset } from "./presets";
import { takeHandoff } from "./handoff";
import { SandboxPreview } from "./SandboxPreview";
import type { Diagnostic } from "./CodeEditor";
import { Badge, Button } from "@/components/ui/primitives";
import { Markdown } from "@/components/ui/Markdown";
import { useProgressStore } from "@/stores/progressStore";
import { cn } from "@/lib/cn";

const CodeEditor = lazy(() => import("./CodeEditor"));

interface Project {
  title: string;
  presetId?: string;
  files: Record<string, string>;
  entry: string;
  autoRender: boolean;
  instructions: string;
}

function fromPreset(p: PlaygroundPreset): Project {
  return { title: p.title, presetId: p.id, files: { ...p.files }, entry: p.entry, autoRender: p.autoRender, instructions: p.instructions };
}

function fromSnippet(code: string, language: string, title: string): Project {
  const lang = language === "javascript" ? "js" : language === "typescript" ? "ts" : language;
  if (lang === "html") return { title, files: { "index.html": code, "styles.css": "", "script.js": "" }, entry: "script.js", autoRender: false, instructions: "Snippet opened from a lesson. Edit and press **Run**." };
  if (lang === "css") return { title, files: { "index.html": '<div class="demo">Edit the HTML and CSS</div>', "styles.css": code, "script.js": "" }, entry: "script.js", autoRender: false, instructions: "CSS snippet opened from a lesson. Add HTML to see it applied." };
  const ext = ["tsx", "jsx", "ts", "js"].includes(lang) ? lang : "tsx";
  const isReact = /from\s+["']react["']|<[A-Z][A-Za-z]*[\s/>]|return\s*\(\s*</.test(code);
  const file = isReact ? `App.${ext === "ts" ? "tsx" : ext === "js" ? "jsx" : ext}` : `index.${ext}`;
  return {
    title,
    files: { [file]: code, ...(isReact ? { "styles.css": "body{font-family:system-ui,sans-serif}" } : {}) },
    entry: file,
    autoRender: isReact,
    instructions:
      "Snippet opened from a lesson. If the file has a **default-exported component** it is rendered automatically; otherwise watch the **Console**. Lesson snippets can be fragments — add any missing pieces (imports, sample data) to make them run.",
  };
}

const DEVICES = [
  { id: "full", label: "Full", width: undefined, icon: Monitor },
  { id: "tablet", label: "Tablet (768)", width: 768, icon: Tablet },
  { id: "phone", label: "Phone (375)", width: 375, icon: Smartphone },
] as const;

export default function PlaygroundPage() {
  const [params, setParams] = useSearchParams();
  const [project, setProject] = useState<Project>(() => {
    const h = takeHandoff();
    if (h?.files && h.entry) return { title: h.title, files: h.files, entry: h.entry, autoRender: false, instructions: h.instructions ?? "Project opened from the CampusEvents Lab." };
    if (h) return fromSnippet(h.code, h.language, h.title);
    const p = presetById(params.get("preset") ?? "") ?? PRESETS[0];
    return fromPreset(p);
  });
  const [activeFile, setActiveFile] = useState<string>(() => presetById(project.presetId ?? "")?.open ?? Object.keys(project.files)[0]);
  const [runKey, setRunKey] = useState(0);
  const [runFiles, setRunFiles] = useState(project.files);
  const [device, setDevice] = useState<(typeof DEVICES)[number]["id"]>("full");
  const [diagnostics, setDiagnostics] = useState<Record<string, Diagnostic[]>>({});
  const saveSnippet = useProgressStore((s) => s.saveSnippet);
  const [savedMsg, setSavedMsg] = useState("");

  useEffect(() => {
    const id = params.get("preset");
    if (id && id !== project.presetId) {
      const p = presetById(id);
      if (p) loadPreset(p);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  function loadPreset(p: PlaygroundPreset) {
    const next = fromPreset(p);
    setProject(next);
    setActiveFile(p.open ?? Object.keys(p.files)[0]);
    setRunFiles(next.files);
    setDiagnostics({});
    setRunKey((k) => k + 1);
  }

  const run = () => {
    setRunFiles({ ...project.files });
    setRunKey((k) => k + 1);
  };

  const reset = () => {
    const p = presetById(project.presetId ?? "");
    if (p) loadPreset(p);
  };

  const groups = useMemo(() => {
    const g: Record<string, PlaygroundPreset[]> = {};
    for (const p of PRESETS) (g[p.group] ??= []).push(p);
    return g;
  }, []);

  const addFile = () => {
    const name = window.prompt("New file name (e.g. utils.ts, Card.tsx, extra.css):");
    if (!name || project.files[name] !== undefined) return;
    if (!/^[\w.-]+\.(tsx?|jsx?|css|html)$/.test(name)) {
      window.alert("Use a simple file name ending in .ts, .tsx, .js, .jsx, .css or .html");
      return;
    }
    setProject((p) => ({ ...p, files: { ...p.files, [name]: "" } }));
    setActiveFile(name);
  };

  const removeFile = (name: string) => {
    if (name === project.entry) return;
    if (!window.confirm(`Delete ${name}?`)) return;
    setProject((p) => {
      const files = { ...p.files };
      delete files[name];
      return { ...p, files };
    });
    if (activeFile === name) setActiveFile(project.entry);
  };

  const save = () => {
    const title = window.prompt("Save as:", project.title);
    if (!title) return;
    saveSnippet({
      id: `snip-${Date.now()}`,
      title,
      language: "project",
      code: JSON.stringify({ files: project.files, entry: project.entry, autoRender: project.autoRender }),
      updatedAt: Date.now(),
    });
    setSavedMsg("Saved to Personal → Saved Examples");
    setTimeout(() => setSavedMsg(""), 2500);
  };

  const allDiagnostics = Object.entries(diagnostics).flatMap(([file, ds]) => ds.map((d) => ({ ...d, file })));
  const errCount = allDiagnostics.filter((d) => d.severity === "error").length;

  return (
    <div className="flex h-[calc(100vh-3.5rem)] min-h-[600px] flex-col lg:flex-row">
      {/* Left: presets + instructions */}
      <aside className="flex max-h-72 w-full shrink-0 flex-col border-b border-line lg:max-h-none lg:w-72 lg:border-b-0 lg:border-r">
        <div className="border-b border-line p-3">
          <label htmlFor="preset" className="mb-1 block text-xs font-medium text-fg-2">Preset</label>
          <select
            id="preset"
            value={project.presetId ?? ""}
            onChange={(e) => setParams({ preset: e.target.value })}
            className="h-9 w-full rounded-md border border-line bg-elevated px-2 text-sm text-fg"
          >
            {!project.presetId && <option value="">{project.title}</option>}
            {Object.entries(groups).map(([g, ps]) => (
              <optgroup key={g} label={g}>
                {ps.map((p) => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
        <div className="flex-1 overflow-y-auto p-3">
          <h2 className="text-sm font-semibold">{project.title}</h2>
          <div className="mt-1 flex flex-wrap gap-1">
            <Badge tone="success">Real execution</Badge>
            <Badge tone="violet">Mock API for /api/*</Badge>
          </div>
          <Markdown className="mt-3 text-[13px]">{project.instructions}</Markdown>
        </div>
      </aside>

      {/* Center: files + editor */}
      <section className="flex min-h-[320px] min-w-0 flex-1 flex-col border-b border-line lg:border-b-0 lg:border-r">
        <div className="flex items-center gap-1 overflow-x-auto border-b border-line px-2 py-1.5">
          {Object.keys(project.files).map((f) => (
            <div key={f} className={cn("group flex shrink-0 items-center rounded", activeFile === f ? "bg-elevated" : "hover:bg-hover")}>
              <button type="button" onClick={() => setActiveFile(f)} className={cn("px-2 py-1 font-mono text-xs", activeFile === f ? "text-fg" : "text-fg-2")}>
                {f}
                {(diagnostics[f]?.some((d) => d.severity === "error")) && <span className="ml-1 text-err">●</span>}
              </button>
              {f !== project.entry && (
                <button type="button" onClick={() => removeFile(f)} aria-label={`Delete ${f}`} className="mr-1 hidden rounded p-0.5 text-fg-3 hover:text-err group-hover:block">
                  <X size={11} />
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={addFile} className="ml-1 rounded p-1 text-fg-3 hover:bg-hover hover:text-fg" aria-label="Add file">
            <FilePlus2 size={14} />
          </button>
          <div className="ml-auto flex shrink-0 items-center gap-1.5 pl-2">
            {savedMsg && <span className="text-[11px] text-ok">{savedMsg}</span>}
            <Button size="sm" variant="ghost" onClick={save}><Save size={13} /> Save</Button>
            {project.presetId && <Button size="sm" variant="ghost" onClick={reset}><RotateCcw size={13} /> Reset</Button>}
            <Button size="sm" variant="primary" onClick={run}><Play size={13} /> Run</Button>
          </div>
        </div>
        <div className="min-h-0 flex-1" onKeyDown={(e) => { if ((e.ctrlKey || e.metaKey) && e.key === "Enter") { e.preventDefault(); run(); } }}>
          <Suspense fallback={<div className="p-4 text-sm text-fg-2">Loading editor…</div>}>
            <CodeEditor
              key={activeFile + (project.presetId ?? "custom")}
              path={activeFile}
              value={project.files[activeFile] ?? ""}
              onChange={(v) => setProject((p) => ({ ...p, files: { ...p.files, [activeFile]: v } }))}
              onDiagnostics={(d) => setDiagnostics((all) => ({ ...all, [activeFile]: d }))}
            />
          </Suspense>
        </div>
        <div className="max-h-32 overflow-y-auto border-t border-line bg-surface px-3 py-1.5 text-xs">
          <div className="mb-1 flex items-center gap-2 font-medium text-fg-2">
            Problems (TypeScript) {errCount > 0 ? <Badge tone="error">{errCount}</Badge> : <Badge tone="success">0</Badge>}
            <span className="font-normal text-fg-3">· Ctrl/⌘+Enter to run</span>
          </div>
          {allDiagnostics.map((d, i) => (
            <div key={i} className={cn("font-mono", d.severity === "error" ? "text-err" : "text-warn")}>
              {d.file}:{d.line}:{d.column} — {d.message}
            </div>
          ))}
        </div>
      </section>

      {/* Right: preview */}
      <section className="flex min-h-[360px] w-full flex-col lg:w-[44%]">
        <div className="flex items-center justify-end gap-1 border-b border-line px-2 py-1">
          {DEVICES.map((d) => (
            <button
              key={d.id}
              type="button"
              aria-pressed={device === d.id}
              onClick={() => setDevice(d.id)}
              className={cn("inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px]", device === d.id ? "bg-elevated text-fg" : "text-fg-3 hover:text-fg")}
            >
              <d.icon size={12} /> {d.label}
            </button>
          ))}
        </div>
        <SandboxPreview
          className="flex-1"
          files={runFiles}
          entry={project.entry}
          autoRender={project.autoRender}
          runKey={runKey}
          width={DEVICES.find((d) => d.id === device)?.width}
        />
      </section>
    </div>
  );
}
