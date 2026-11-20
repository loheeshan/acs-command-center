import { useMemo, useState } from "react";
import { Plus, Trash2, Trophy } from "lucide-react";
import { Badge, Button, Callout } from "@/components/ui/primitives";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { cn } from "@/lib/cn";
import { inputCls } from "./StepControls";
import { useMarkOnce } from "./useStepper";

type Spec = [number, number, number];
const ZERO: Spec = [0, 0, 0];
const add = (a: Spec, b: Spec): Spec => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const cmp = (a: Spec, b: Spec) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2];
const maxOf = (list: Spec[]) => list.reduce((m, s) => (cmp(s, m) > 0 ? s : m), ZERO);
const LEGACY_PSEUDO_ELEMENTS = new Set(["before", "after", "first-line", "first-letter"]);

/** Split on commas that are not inside parentheses or brackets. */
function splitTop(s: string): string[] {
  const out: string[] = [];
  let depth = 0, cur = "";
  for (const ch of s) {
    if (ch === "(" || ch === "[") depth++;
    if (ch === ")" || ch === "]") depth--;
    if (ch === "," && depth === 0) { out.push(cur); cur = ""; } else cur += ch;
  }
  out.push(cur);
  return out.map((x) => x.trim()).filter(Boolean);
}

/** Specificity of ONE complex selector (Selectors Level 4 rules). */
function specificity(sel: string): { spec: Spec; parts: string[] } {
  let spec: Spec = [0, 0, 0];
  const parts: string[] = [];
  let i = 0;
  const ident = () => {
    const m = /^-?[A-Za-z_ -￿][\w\- -￿]*/.exec(sel.slice(i)) ?? /^\\./.exec(sel.slice(i));
    const v = m ? m[0] : "";
    i += v.length;
    return v;
  };
  const parens = () => {
    if (sel[i] !== "(") return "";
    let depth = 0, start = i + 1;
    for (; i < sel.length; i++) {
      if (sel[i] === "(") depth++;
      if (sel[i] === ")" && --depth === 0) break;
    }
    const inner = sel.slice(start, i);
    i++;
    return inner;
  };
  while (i < sel.length) {
    const ch = sel[i];
    if (/[\s>+~*&|]/.test(ch)) { i++; continue; }
    if (ch === "#") { i++; parts.push(`#${ident()} → id (1,0,0)`); spec = add(spec, [1, 0, 0]); continue; }
    if (ch === ".") { i++; parts.push(`.${ident()} → class (0,1,0)`); spec = add(spec, [0, 1, 0]); continue; }
    if (ch === "[") {
      const end = sel.indexOf("]", i);
      const txt = sel.slice(i, end < 0 ? sel.length : end + 1);
      i += txt.length;
      parts.push(`${txt} → attribute (0,1,0)`);
      spec = add(spec, [0, 1, 0]);
      continue;
    }
    if (ch === ":" && sel[i + 1] === ":") {
      i += 2;
      const name = ident();
      const arg = parens();
      parts.push(`::${name}${arg ? `(${arg})` : ""} → pseudo-element (0,0,1)`);
      spec = add(spec, [0, 0, 1]);
      continue;
    }
    if (ch === ":") {
      i++;
      const name = ident().toLowerCase();
      const arg = parens();
      if (name === "where") { parts.push(`:where(${arg}) → always (0,0,0)`); continue; }
      if (["is", "not", "has", "matches"].includes(name)) {
        const best = maxOf(splitTop(arg).map((a) => specificity(a).spec));
        parts.push(`:${name}(${arg}) → its most specific argument (${best.join(",")})`);
        spec = add(spec, best);
        continue;
      }
      if ((name === "nth-child" || name === "nth-last-child") && / of /i.test(arg)) {
        const best = maxOf(splitTop(arg.split(/ of /i)[1]).map((a) => specificity(a).spec));
        const s = add([0, 1, 0], best);
        parts.push(`:${name}(${arg}) → pseudo-class + most specific “of” selector (${s.join(",")})`);
        spec = add(spec, s);
        continue;
      }
      if (LEGACY_PSEUDO_ELEMENTS.has(name)) { parts.push(`:${name} → legacy pseudo-element (0,0,1)`); spec = add(spec, [0, 0, 1]); continue; }
      parts.push(`:${name}${arg ? `(${arg})` : ""} → pseudo-class (0,1,0)`);
      spec = add(spec, [0, 1, 0]);
      continue;
    }
    const before = i;
    const el = ident();
    if (el && sel[i] === "|") { i++; continue; } // namespace prefix (svg|a) adds nothing
    if (el) { parts.push(`${el} → element (0,0,1)`); spec = add(spec, [0, 0, 1]); continue; }
    i = before + 1; // skip unknown char
  }
  return { spec, parts };
}

function validSelector(sel: string) {
  try {
    document.createDocumentFragment().querySelector(sel);
    return true;
  } catch {
    return false;
  }
}

interface Rule {
  sel: string;
  important: boolean;
}

export default function SpecificityViz() {
  const [rules, setRules] = useState<Rule[]>([
    { sel: "#main .card h2", important: false },
    { sel: ".card h2.title", important: false },
    { sel: "main :is(#featured, .card) > h2", important: false },
    { sel: ":where(#main) h2", important: false },
  ]);
  const [inline, setInline] = useState(false);
  const [inlineImportant, setInlineImportant] = useState(false);
  const mark = useMarkOnce("specificity");

  const rows = useMemo(
    () =>
      rules.map((r, idx) => {
        const list = splitTop(r.sel);
        const each = list.map((s) => ({ s, ...specificity(s) }));
        // a selector list: each complex selector is matched separately; show the highest
        const best = each.length ? each.reduce((m, e) => (cmp(e.spec, m.spec) > 0 ? e : m)) : { s: "", spec: ZERO, parts: [] as string[] };
        return { ...r, idx, each, best, valid: r.sel.trim() !== "" && validSelector(r.sel) };
      }),
    [rules],
  );

  // Cascade (same origin, no layers): important > normal; inline beats selectors within the same importance; then specificity; then source order.
  const ranked = [...rows].filter((r) => r.valid).sort((a, b) => Number(b.important) - Number(a.important) || cmp(b.best.spec, a.best.spec) || b.idx - a.idx);
  const top = ranked[0];
  const winner = inline && inlineImportant ? "inline !important" : top?.important ? `rule ${top.idx + 1} (!important)` : inline ? "inline style" : top ? `rule ${top.idx + 1}` : "—";
  const why = inline && inlineImportant
    ? "An !important inline declaration beats every author stylesheet rule."
    : top?.important
      ? "!important declarations beat all normal declarations, including inline style (only inline !important beats them)."
      : inline
        ? "Inline style (style=\"…\") beats any selector, no matter how many ids it has."
        : top && ranked[1] && cmp(top.best.spec, ranked[1].best.spec) === 0 && top.important === ranked[1].important
          ? "Tie in specificity → the rule that appears LATER in the source wins."
          : "Highest specificity wins. Compare column a first; only if equal compare b, then c — (1,0,0) beats (0,15,0).";

  const update = (i: number, patch: Partial<Rule>) => { setRules((rs) => rs.map((r, j) => (j === i ? { ...r, ...patch } : r))); mark(); };

  return (
    <div className="space-y-4">
      <ul className="space-y-2">
        {rows.map((r, i) => {
          const isWin = winner.startsWith(`rule ${i + 1}`);
          return (
            <li key={i} className={cn("rounded-md border p-2.5", isWin ? "border-ok/50 bg-ok-soft" : "border-line bg-elevated/50")}>
              <div className="flex flex-wrap items-center gap-2">
                <span className="w-12 text-xs text-fg-3">rule {i + 1}</span>
                <input aria-label={`Selector ${i + 1}`} value={r.sel} onChange={(e) => update(i, { sel: e.target.value })} className={cn(inputCls, "min-w-0 flex-1 font-mono")} />
                <span className="flex gap-0.5 font-mono text-sm" aria-label={`Specificity ${r.best.spec.join(", ")}`}>
                  {r.best.spec.map((n, k) => (
                    <span key={k} className={cn("rounded px-1.5 py-0.5", ["bg-err-soft text-err", "bg-warn-soft text-warn", "bg-primary-soft text-primary"][k])}>{n}</span>
                  ))}
                </span>
                <label className="flex items-center gap-1 text-xs text-fg-2">
                  <input type="checkbox" checked={r.important} onChange={(e) => update(i, { important: e.target.checked })} /> !important
                </label>
                {isWin && <Badge tone="success"><Trophy size={11} /> wins</Badge>}
                {!r.valid && <Badge tone="error">invalid selector</Badge>}
                <Button size="sm" variant="ghost" aria-label={`Remove rule ${i + 1}`} disabled={rules.length <= 1} onClick={() => setRules((rs) => rs.filter((_, j) => j !== i))}><Trash2 size={13} /></Button>
              </div>
              {r.valid && (
                <ul className="ml-14 mt-1.5 space-y-0.5 font-mono text-[11px] text-fg-2">
                  {r.each.length > 1 && <li className="text-violet">selector list → each part matched separately; highest shown: {r.best.s}</li>}
                  {r.best.parts.map((p, k) => <li key={k}>{p}</li>)}
                  {r.best.parts.length === 0 && <li>* / combinators only → (0,0,0)</li>}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
      <div className="flex flex-wrap items-center gap-3">
        <Button size="sm" disabled={rules.length >= 6} onClick={() => setRules((rs) => [...rs, { sel: "h2", important: false }])}><Plus size={13} /> Add selector</Button>
        <label className="flex items-center gap-1.5 text-xs text-fg-2"><input type="checkbox" checked={inline} onChange={(e) => { setInline(e.target.checked); mark(); }} /> element also has style="color: …"</label>
        {inline && <label className="flex items-center gap-1.5 text-xs text-fg-2"><input type="checkbox" checked={inlineImportant} onChange={(e) => setInlineImportant(e.target.checked)} /> inline is !important</label>}
      </div>
      <Callout tone="success" title={`Winner: ${winner}`}>
        <span aria-live="polite">{why}</span>
      </Callout>
      <div className="grid gap-4 md:grid-cols-2">
        <CodeBlock code={rows.map((r) => `${r.sel} { color: c${r.idx + 1}${r.important ? " !important" : ""}; }`).join("\n")} language="css" title="rules.css (source order)" runnable={false} />
        <Callout tone="primary" title="(a, b, c)">
          <strong className="text-err">a</strong> = ids · <strong className="text-warn">b</strong> = classes, attributes, pseudo-classes ·{" "}
          <strong className="text-primary">c</strong> = elements, pseudo-elements. <code>*</code> and combinators add nothing. <code>:is()</code>,{" "}
          <code>:not()</code>, <code>:has()</code> take their most specific argument; <code>:where()</code> is always 0.
        </Callout>
      </div>
    </div>
  );
}
