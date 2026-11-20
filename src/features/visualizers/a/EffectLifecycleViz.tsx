import { useState } from "react";
import { Badge, Button, Callout, Segmented } from "@/components/ui/primitives";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { cn } from "@/lib/cn";
import { Panel } from "./StepControls";
import { useMarkOnce } from "./useStepper";

type Deps = "none" | "empty" | "id";
type Kind = "render" | "commit" | "setup" | "cleanup" | "skip" | "info";
interface Entry {
  kind: Kind;
  text: string;
}

const DEPS_SRC: Record<Deps, string> = { none: "", empty: ", []", id: ", [id]" };
const kindTone: Record<Kind, string> = {
  render: "text-primary",
  commit: "text-fg-2",
  setup: "text-ok",
  cleanup: "text-warn",
  skip: "text-fg-3",
  info: "text-violet",
};

export default function EffectLifecycleViz() {
  const [deps, setDeps] = useState<Deps>("id");
  const [strict, setStrict] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [id, setId] = useState(1);
  const [tab, setTab] = useState(0);
  const [effectId, setEffectId] = useState<number | null>(null); // id captured by the currently active effect
  const [log, setLog] = useState<Entry[][]>([]);
  const mark = useMarkOnce("useeffect-lifecycle");

  const code = `function EventDetails({ id }) {
  const [tab, setTab] = useState(0);
  useEffect(() => {
    console.log("setup: subscribe", id);
    return () => console.log("cleanup: unsubscribe", id);
  }${DEPS_SRC[deps]});
  return <Details id={id} tab={tab} />;
}`;

  const renderEntries = (nextId: number, nextTab: number): Entry[] =>
    strict
      ? [{ kind: "render", text: `render(id=${nextId}, tab=${nextTab}) ×2 — StrictMode calls the component twice in dev` }]
      : [{ kind: "render", text: `render(id=${nextId}, tab=${nextTab})` }];

  const add = (group: Entry[]) => setLog((l) => [...l, group]);

  const mount = () => {
    const g: Entry[] = [...renderEntries(id, tab), { kind: "commit", text: "commit → DOM updated, browser paints" }, { kind: "setup", text: `setup: subscribe ${id}` }];
    if (strict) g.push({ kind: "cleanup", text: `cleanup: unsubscribe ${id}  (StrictMode dev-only remount test)` }, { kind: "setup", text: `setup: subscribe ${id}  (again)` });
    add(g);
    setMounted(true);
    setEffectId(id);
  };

  const update = (nextId: number, nextTab: number, cause: string) => {
    const g: Entry[] = [{ kind: "info", text: cause }, ...renderEntries(nextId, nextTab), { kind: "commit", text: "commit" }];
    const depsChanged = deps === "none" || (deps === "id" && nextId !== id);
    if (depsChanged) {
      g.push({ kind: "cleanup", text: `cleanup: unsubscribe ${effectId}  (previous effect's closure → OLD id)` }, { kind: "setup", text: `setup: subscribe ${nextId}` });
      setEffectId(nextId);
    } else {
      g.push({ kind: "skip", text: deps === "empty" ? "effect skipped — [] never changes" : "effect skipped — id is unchanged (Object.is)" });
      if (deps === "empty" && nextId !== effectId) g.push({ kind: "info", text: `⚠ still subscribed to ${effectId} while showing id ${nextId}: stale effect (missing dependency)` });
    }
    add(g);
    setId(nextId);
    setTab(nextTab);
  };

  const unmount = () => {
    add([{ kind: "info", text: "parent stops rendering <EventDetails />" }, { kind: "cleanup", text: `cleanup: unsubscribe ${effectId}  (on unmount)` }]);
    setMounted(false);
    setEffectId(null);
    mark();
  };

  const reset = () => {
    setLog([]);
    setMounted(false);
    setId(1);
    setTab(0);
    setEffectId(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Segmented label="Dependency array" value={deps} onChange={(d) => { setDeps(d); reset(); }} options={[{ value: "none", label: "no array" }, { value: "empty", label: "[]" }, { value: "id", label: "[id]" }]} />
        <label className="flex items-center gap-1.5 text-xs text-fg-2">
          <input type="checkbox" checked={strict} onChange={(e) => { setStrict(e.target.checked); reset(); }} /> StrictMode (development)
        </label>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-3">
          <CodeBlock code={code} language="jsx" title="EventDetails.jsx" highlightLines={new Set([3, 4, 5, 6])} runnable={false} />
          <div className="flex flex-wrap gap-2" role="group" aria-label="Actions">
            <Button size="sm" variant="primary" disabled={mounted} onClick={mount}>Mount</Button>
            <Button size="sm" disabled={!mounted} onClick={() => update(id + 1, tab, `parent passes new prop id=${id + 1}`)}>Change id → {id + 1}</Button>
            <Button size="sm" disabled={!mounted} onClick={() => update(id, tab + 1, `setTab(${tab + 1}) — unrelated state`)}>Re-render (unrelated state)</Button>
            <Button size="sm" variant="danger" disabled={!mounted} onClick={unmount}>Unmount</Button>
            <Button size="sm" variant="ghost" onClick={reset}>Clear</Button>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <Badge tone={mounted ? "success" : "neutral"}>{mounted ? "mounted" : "not mounted"}</Badge>
            <Badge>props.id = {id}</Badge>
            <Badge tone="violet">active subscription: {effectId ?? "none"}</Badge>
          </div>
        </div>
        <Panel title="Event log (in order)" className="max-h-96 overflow-y-auto">
          {log.length === 0 ? (
            <p className="text-xs italic text-fg-3">Press Mount to start.</p>
          ) : (
            <ol className="space-y-2" aria-live="polite">
              {log.map((g, i) => (
                <li key={i} className={cn("rounded border px-2 py-1.5", i === log.length - 1 ? "border-primary/50 bg-primary-soft" : "border-line bg-surface")}>
                  {g.map((e, j) => (
                    <div key={j} className={cn("font-mono text-[11px]", kindTone[e.kind])}>
                      {e.kind === "info" ? "▸ " : "  "}
                      {e.text}
                    </div>
                  ))}
                </li>
              ))}
            </ol>
          )}
        </Panel>
      </div>
      <Callout tone="primary" title="Rules">
        Effects run <strong>after</strong> render and commit. Before re-running, React runs the previous cleanup (which sees the values from
        <em> its</em> render). No array → after every render; <code>[]</code> → only after mount; <code>[id]</code> → when <code>id</code> changes.
        StrictMode’s extra setup → cleanup → setup happens only in development, to expose missing cleanups.
      </Callout>
    </div>
  );
}
