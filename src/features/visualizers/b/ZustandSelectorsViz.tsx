import { useEffect, useRef, type ReactNode } from "react";
import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";
import { Activity, RotateCcw } from "lucide-react";
import { Badge, Button, Callout, Card, CardHeader } from "@/components/ui/primitives";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { useMarkOnce } from "./shared";

/* ---------- A REAL Zustand v5 store, local to this visualizer ---------- */
interface CartItem { id: number; name: string; qty: number }
interface DemoState {
  theme: "light" | "dark";
  cart: CartItem[];
  sidebarOpen: boolean;
  preferences: { currency: "GBP" | "EUR"; compact: boolean };
  toggleTheme: () => void;
  addToCart: (name: string) => void;
  swapFirstItem: () => void;
  toggleSidebar: () => void;
  setCurrency: (c: "GBP" | "EUR") => void;
  reset: () => void;
}
const initialData = {
  theme: "light" as const,
  cart: [{ id: 1, name: "Hackathon ticket", qty: 1 }],
  sidebarOpen: false,
  preferences: { currency: "GBP" as const, compact: false },
};
const useDemoStore = create<DemoState>()((set) => ({
  ...initialData,
  toggleTheme: () => set((s) => ({ theme: s.theme === "light" ? "dark" : "light" })),
  addToCart: (name) => set((s) => ({ cart: [...s.cart, { id: Date.now(), name, qty: 1 }] })),
  swapFirstItem: () => set((s) => ({ cart: s.cart.map((it, i) => (i === 0 ? { ...it, id: Date.now(), name: it.name === "Hackathon ticket" ? "Workshop ticket" : "Hackathon ticket" } : it)) })),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  // always creates a NEW preferences object, even if the value is the same
  setCurrency: (currency) => set((s) => ({ preferences: { ...s.preferences, currency } })),
  reset: () => set({ ...initialData, cart: [...initialData.cart], preferences: { ...initialData.preferences } }),
}));

/* ---------- render (commit) tracking ---------- */
const committed = new Set<string>();
interface LogEntry { id: number; action: string; rendered: string[] }
const useLogStore = create<{ entries: LogEntry[]; add: (e: LogEntry) => void; clear: () => void }>()((set) => ({
  entries: [],
  add: (e) => set((s) => ({ entries: [e, ...s.entries].slice(0, 12) })),
  clear: () => set({ entries: [] }),
}));

function useCommitCounter(name: string) {
  const count = useRef(0);
  const countEl = useRef<HTMLSpanElement>(null);
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    count.current += 1;
    if (countEl.current) countEl.current.textContent = String(count.current);
    committed.add(name);
    const el = box.current;
    if (!el) return;
    el.classList.add("ring-2", "ring-warn");
    const t = setTimeout(() => el.classList.remove("ring-2", "ring-warn"), 700);
    return () => clearTimeout(t);
  });
  return { countEl, box };
}

function Sub({ name, selector, value, children }: { name: string; selector: string; value: ReactNode; children?: ReactNode }) {
  const { countEl, box } = useCommitCounter(name);
  return (
    <div ref={box} className="rounded-md border border-line bg-elevated p-2.5 transition-shadow">
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-xs font-semibold text-fg">{name}</span>
        <Badge tone="warning">renders: <span ref={countEl}>0</span></Badge>
      </div>
      <code className="mt-1 block break-all font-mono text-[11px] text-fg-3">{selector}</code>
      <div className="mt-1.5 text-xs text-fg-2">{value}</div>
      {children}
    </div>
  );
}

function WholeStore() {
  const s = useDemoStore();
  return <Sub name="WholeStore" selector="useDemoStore()" value={`theme=${s.theme}, items=${s.cart.length}, sidebar=${s.sidebarOpen}, ${s.preferences.currency}`} />;
}
function ThemeBadge() {
  const theme = useDemoStore((s) => s.theme);
  return <Sub name="ThemeBadge" selector="useDemoStore((s) => s.theme)" value={`theme = ${theme}`} />;
}
function CartCount() {
  const count = useDemoStore((s) => s.cart.reduce((n, it) => n + it.qty, 0));
  return <Sub name="CartCount" selector="useDemoStore((s) => s.cart.reduce((n, i) => n + i.qty, 0))" value={`count = ${count} (a number → compared by Object.is)`} />;
}
function SidebarToggle() {
  const open = useDemoStore((s) => s.sidebarOpen);
  return <Sub name="SidebarToggle" selector="useDemoStore((s) => s.sidebarOpen)" value={`sidebarOpen = ${String(open)}`} />;
}
function PrefsPanel() {
  const { currency, compact } = useDemoStore(useShallow((s) => ({ currency: s.preferences.currency, compact: s.preferences.compact })));
  return <Sub name="PrefsPanel" selector="useDemoStore(useShallow((s) => ({ currency: s.preferences.currency, compact: … })))" value={`${currency}, compact=${String(compact)} — new object each call, but shallow-equal → no re-render`} />;
}
function AddButton() {
  const addToCart = useDemoStore((s) => s.addToCart);
  return <Sub name="AddButton" selector="useDemoStore((s) => s.addToCart)" value={`Action functions are stable → never re-renders (holds ${typeof addToCart}).`} />;
}
function ThemeParent() {
  const theme = useDemoStore((s) => s.theme);
  return (
    <Sub name="ThemeParent" selector="useDemoStore((s) => s.theme)" value={`renders <PlainChild /> (theme=${theme})`}>
      <div className="mt-2"><PlainChild /></div>
    </Sub>
  );
}
function PlainChild() {
  return <Sub name="PlainChild" selector="(no store subscription)" value="Re-renders whenever its parent does." />;
}

function ActionLog() {
  const entries = useLogStore((s) => s.entries);
  return (
    <ul className="space-y-1.5 p-3 text-xs" aria-live="polite">
      {entries.length === 0 && <li className="text-fg-3">Dispatch an action to see which components re-rendered.</li>}
      {entries.map((e) => (
        <li key={e.id} className="rounded-md border border-line p-2">
          <div className="font-mono font-semibold text-fg">{e.action}</div>
          <div className="mt-1 flex flex-wrap gap-1">
            {e.rendered.length ? e.rendered.map((r) => <Badge key={r} tone="warning">{r}</Badge>) : <span className="text-fg-3">no component re-rendered</span>}
          </div>
        </li>
      ))}
    </ul>
  );
}

const BROKEN = `// ❌ v5: returns a NEW object every call → Object.is fails every time
const { theme, sidebarOpen } = useDemoStore((s) => ({
  theme: s.theme,
  sidebarOpen: s.sidebarOpen,
}));
// → "Maximum update depth exceeded" / infinite re-render loop

// ✅ compare the object's fields shallowly instead
const { theme, sidebarOpen } = useDemoStore(
  useShallow((s) => ({ theme: s.theme, sidebarOpen: s.sidebarOpen })),
);
// ✅ or select primitives separately
const theme = useDemoStore((s) => s.theme);
const sidebarOpen = useDemoStore((s) => s.sidebarOpen);`;

export default function ZustandSelectorsViz() {
  const mark = useMarkOnce("zustand-selectors");
  const dispatch = (label: string, fn: () => void) => {
    committed.clear();
    fn();
    mark();
    setTimeout(() => useLogStore.getState().add({ id: Date.now(), action: label, rendered: [...committed] }), 80);
  };
  const a = useDemoStore.getState;

  return (
    <div className="space-y-4">
      <div className="rounded-md border border-ok/30 bg-ok-soft px-3 py-2 text-xs text-ok">
        <strong>Live:</strong> a real Zustand v5 store created with <code className="font-mono">create()</code>. Render counters count commits; in development, React StrictMode may count the first mount twice.
        This parent component does not subscribe to the store, so it never re-renders the subscribers below.
      </div>

      <Card>
        <CardHeader icon={<Activity size={16} />} title="Dispatch actions" subtitle="Flashing border = that component re-rendered" action={<Button size="sm" variant="ghost" onClick={() => dispatch("reset()", () => a().reset())}><RotateCcw size={14} /> Reset store</Button>} />
        <div className="flex flex-wrap gap-2 p-3">
          <Button size="sm" onClick={() => dispatch("toggleTheme()", () => a().toggleTheme())}>toggleTheme()</Button>
          <Button size="sm" onClick={() => dispatch('addToCart("Workshop ticket")', () => a().addToCart("Workshop ticket"))}>addToCart()</Button>
          <Button size="sm" onClick={() => dispatch("swapFirstItem() — same count", () => a().swapFirstItem())}>swapFirstItem() (count unchanged)</Button>
          <Button size="sm" onClick={() => dispatch("toggleSidebar()", () => a().toggleSidebar())}>toggleSidebar()</Button>
          <Button size="sm" onClick={() => dispatch('setCurrency(same value) — new object', () => a().setCurrency(a().preferences.currency))}>setCurrency(same)</Button>
          <Button size="sm" onClick={() => dispatch("setCurrency(other)", () => a().setCurrency(a().preferences.currency === "GBP" ? "EUR" : "GBP"))}>setCurrency(other)</Button>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="grid gap-2 sm:grid-cols-2">
          <WholeStore />
          <ThemeBadge />
          <CartCount />
          <SidebarToggle />
          <PrefsPanel />
          <AddButton />
          <div className="sm:col-span-2"><ThemeParent /></div>
        </div>
        <Card>
          <CardHeader title="Action log" subtitle="Which components committed after each action" action={<Button size="sm" variant="ghost" onClick={() => useLogStore.getState().clear()}>Clear</Button>} />
          <ActionLog />
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <CodeBlock code={BROKEN} language="tsx" title="Object selectors in v5 (explained, not run)" highlightLines={new Set([2, 6, 9, 10])} runnable={false} />
        <div className="space-y-2">
          <Callout tone="primary" title="The rule">A component subscribed with a selector re-renders only when the selected value changes, compared with <code>Object.is</code>. A derived number (cart count) can stay equal even when the cart array changes.</Callout>
          <Callout tone="warning" title="Selectors don't stop every re-render">Calling <code>useDemoStore()</code> with no selector subscribes to everything. And a parent that re-renders still re-renders its children (see PlainChild) unless they're memoised.</Callout>
          <Callout tone="success" title="Actions are stable">Selecting only an action never causes re-renders, because the function reference never changes.</Callout>
        </div>
      </div>
    </div>
  );
}
