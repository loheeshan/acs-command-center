import { useMemo, useState } from "react";
import { Badge, Button, Callout, Segmented, Tabs } from "@/components/ui/primitives";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { cn } from "@/lib/cn";
import { Panel, StepControls } from "./StepControls";
import { useMarkOnce, useStepper } from "./useStepper";

type Comp = "App" | "Header" | "List" | "Item 1" | "Item 2" | "Item 3";
const TREE: { name: Comp; depth: number; children: Comp[] }[] = [
  { name: "App", depth: 0, children: ["Header", "List"] },
  { name: "Header", depth: 1, children: [] },
  { name: "List", depth: 1, children: ["Item 1", "Item 2", "Item 3"] },
  { name: "Item 1", depth: 2, children: [] },
  { name: "Item 2", depth: 2, children: [] },
  { name: "Item 3", depth: 2, children: [] },
];
const descendants = (c: Comp): Comp[] => {
  const n = TREE.find((t) => t.name === c);
  return n ? [c, ...n.children.flatMap(descendants)] : [c];
};

interface Trigger {
  at: Comp;
  label: string;
  dom: string; // the only DOM change
}
const TRIGGERS: Record<string, Trigger> = {
  App: { at: "App", label: "App: setClicks(c => c + 1)", dom: 'App footer text "Clicks: 3" → "Clicks: 4"' },
  Header: { at: "Header", label: "Header: setMenuOpen(true)", dom: "Header <nav> class: menu → menu open" },
  List: { at: "List", label: "List: setShowCount(true)", dom: 'List inserts <span>"3 items"</span>' },
  "Item 2": { at: "Item 2", label: "Item 2: setLiked(true)", dom: "Item 2 button text ♡ → ♥" },
};

const CODE = `function App() {
  const [clicks, setClicks] = useState(3);
  return (<>
    <Header title="Events" />
    <List items={events} />
    <footer>Clicks: {clicks}</footer>
  </>);
}`;

interface Frame {
  rendering: Comp | null;
  rendered: Comp[];
  phase: "trigger" | "render" | "diff" | "commit";
  note: string;
}

function build(t: Trigger, memoHeader: boolean): Frame[] {
  const all = descendants(t.at);
  const skipped = memoHeader && t.at === "App" ? ["Header" as Comp] : [];
  const order = all.filter((c) => !skipped.includes(c));
  const frames: Frame[] = [{ rendering: null, rendered: [], phase: "trigger", note: `${t.label} — a state update on ${t.at} schedules a render of ${t.at}. Components above it are not involved.` }];
  order.forEach((c, i) => {
    frames.push({
      rendering: c,
      rendered: order.slice(0, i + 1),
      phase: "render",
      note: c === t.at
        ? `Render phase: React calls ${c}() to get new JSX. This is just a function call — no DOM touched yet.`
        : `${c} re-renders because its parent re-rendered (by default React re-renders the whole subtree, even if props are equal).`,
    });
  });
  if (skipped.length) frames.push({ rendering: null, rendered: order, phase: "render", note: "Header is wrapped in React.memo and its props (title) are unchanged, so React skips calling it." });
  frames.push({ rendering: null, rendered: order, phase: "diff", note: `Reconciliation: React compares the new JSX with the previous output for ${order.length} component(s). Almost everything is identical.` });
  frames.push({ rendering: null, rendered: order, phase: "commit", note: `Commit phase: only the real difference is applied to the DOM — ${t.dom}. ${order.length} render(s), 1 DOM mutation. Rendering ≠ DOM update.` });
  return frames;
}

const BEFORE = [
  { id: "ana", label: "Ana", note: "vegan" },
  { id: "ben", label: "Ben", note: "wheelchair" },
  { id: "cy", label: "Cy", note: "late arrival" },
];

function KeysDemo() {
  const [keyMode, setKeyMode] = useState<"index" | "id">("index");
  const [inserted, setInserted] = useState(false);
  const mark = useMarkOnce("render-commit");
  const after = [{ id: "zed", label: "Zed" }, ...BEFORE];
  const rows = !inserted
    ? BEFORE.map((b, i) => ({ key: keyMode === "id" ? b.id : String(i), label: b.label, note: b.note, wrong: false, fresh: false }))
    : after.map((a, i) => {
        // state lives with the component instance identified by its key
        const prev = keyMode === "id" ? BEFORE.find((b) => b.id === a.id) : BEFORE[i];
        const note = prev?.note ?? "";
        const correct = BEFORE.find((b) => b.id === a.id)?.note ?? "";
        return { key: keyMode === "id" ? a.id : String(i), label: a.label, note, wrong: note !== correct, fresh: !prev };
      });
  const mutations = !inserted ? null : keyMode === "id" ? "1 DOM insertion (new <li> at the top). Existing <li>s are moved/kept intact." : "3 label text updates + 1 new <li> appended at the end — and the input state is now attached to the wrong people.";

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <Segmented label="Key strategy" value={keyMode} onChange={(k) => { setKeyMode(k); setInserted(false); }} options={[{ value: "index", label: "key={index}" }, { value: "id", label: "key={item.id}" }]} />
        <Button size="sm" variant="primary" disabled={inserted} onClick={() => { setInserted(true); mark(); }}>Insert “Zed” at top</Button>
        <Button size="sm" variant="ghost" onClick={() => setInserted(false)}>Reset</Button>
      </div>
      <CodeBlock code={`{guests.map((g, i) => (\n  <Guest key={${keyMode === "id" ? "g.id" : "i"}} name={g.label} /> // Guest has its own useState(note)\n))}`} language="jsx" title="GuestList.jsx" runnable={false} />
      <ul className="space-y-1.5">
        {rows.map((r) => (
          <li key={r.label} className={cn("grid grid-cols-[5rem_4rem_minmax(0,1fr)] items-center gap-2 rounded border px-2 py-1.5 text-xs", r.wrong ? "border-err/50 bg-err-soft" : "border-line bg-surface")}>
            <span className="font-mono text-fg-3">key="{r.key}"</span>
            <span className="font-semibold text-fg">{r.label}</span>
            <span className="flex items-center gap-2">
              <span className="rounded border border-line bg-elevated px-1.5 py-0.5 font-mono text-fg">{r.note || "(empty)"}</span>
              {r.wrong && <Badge tone="error">wrong state</Badge>}
              {r.fresh && <Badge tone="primary">new instance</Badge>}
            </span>
          </li>
        ))}
      </ul>
      {mutations && (
        <Callout tone={keyMode === "id" ? "success" : "error"} title="What React did">
          {mutations} React matches old and new children by key; with index keys, “key 0” used to be Ana, so Ana’s state is reused for Zed.
        </Callout>
      )}
    </div>
  );
}

export default function RenderCommitViz() {
  const [tab, setTab] = useState<"phases" | "keys">("phases");
  const [trig, setTrig] = useState("App");
  const [memoHeader, setMemoHeader] = useState(false);
  const t = TRIGGERS[trig];
  const frames = useMemo(() => build(t, memoHeader), [t, memoHeader]);
  const s = useStepper(frames.length, "render-commit");
  const f = frames[s.step];

  return (
    <div className="space-y-4">
      <Tabs tabs={[{ id: "phases", label: "Render vs commit" }, { id: "keys", label: "Keys: index vs id" }]} value={tab} onChange={setTab} />
      {tab === "keys" ? (
        <KeysDemo />
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-3">
            <Segmented label="Where does state change?" value={trig} onChange={(x) => { setTrig(x); s.reset(); }} options={Object.keys(TRIGGERS).map((k) => ({ value: k, label: k }))} />
            <label className="flex items-center gap-1.5 text-xs text-fg-2">
              <input type="checkbox" checked={memoHeader} onChange={(e) => { setMemoHeader(e.target.checked); s.reset(); }} /> Header wrapped in React.memo
            </label>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <Panel title="Component tree">
              <ul className="space-y-1">
                {TREE.map((n) => {
                  const isNow = f.rendering === n.name;
                  const did = f.rendered.includes(n.name);
                  const changed = f.phase === "commit" && n.name === t.at;
                  return (
                    <li key={n.name} style={{ marginLeft: n.depth * 20 }} className={cn("flex items-center justify-between gap-2 rounded border px-2 py-1 font-mono text-xs", isNow ? "border-primary bg-primary-soft" : did ? "border-violet/40 bg-violet-soft" : "border-line bg-surface")}>
                      <span className="text-fg">&lt;{n.name.replace(" ", "")} /&gt;{n.name === t.at && " ⚡"}</span>
                      <span className="flex gap-1">
                        {did && <Badge tone="violet">rendered</Badge>}
                        {changed && <Badge tone="success">DOM updated</Badge>}
                      </span>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-2 flex flex-wrap gap-1.5 text-[11px]">
                {(["trigger", "render", "diff", "commit"] as const).map((p) => (
                  <Badge key={p} tone={f.phase === p ? "primary" : "neutral"}>{p}</Badge>
                ))}
              </div>
            </Panel>
            <CodeBlock code={CODE} language="jsx" title="App.jsx" highlightLines={new Set(f.phase === "commit" && t.at === "App" ? [6] : f.rendering === "App" ? [1] : [])} runnable={false} />
          </div>
          <Callout tone={f.phase === "commit" ? "success" : "primary"} title={f.phase.toUpperCase()}>
            <span aria-live="polite">{f.note}</span>
          </Callout>
          <StepControls s={s} />
        </>
      )}
    </div>
  );
}
