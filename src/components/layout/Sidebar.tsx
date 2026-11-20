import { NavLink } from "react-router-dom";
import { ChevronDown, Search, Terminal } from "lucide-react";
import { useMemo, useState } from "react";
import { NAV } from "@/app/navigation";
import { useUiStore } from "@/stores/uiStore";
import { cn } from "@/lib/cn";

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const [query, setQuery] = useState("");
  const collapsed = useUiStore((s) => s.collapsedGroups);
  const toggleGroup = useUiStore((s) => s.toggleGroup);

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return NAV;
    return NAV.map((g) => ({ ...g, items: g.items.filter((i) => `${i.label} ${i.keywords ?? ""}`.toLowerCase().includes(q)) })).filter((g) => g.items.length);
  }, [query]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 shrink-0 items-center gap-2 border-b border-line px-4">
        <div className="grid h-7 w-7 place-items-center rounded-md bg-primary-soft text-primary"><Terminal size={15} /></div>
        <div className="leading-tight">
          <div className="text-sm font-semibold tracking-tight">ACS Command Center</div>
          <div className="text-[10px] text-fg-3">5COSC026W · 2026/27</div>
        </div>
      </div>
      <div className="p-3">
        <label className="relative block">
          <span className="sr-only">Search navigation</span>
          <Search size={14} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-fg-3" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search sections…"
            className="h-8 w-full rounded-md border border-line bg-elevated pl-8 pr-2 text-xs text-fg placeholder:text-fg-3"
          />
        </label>
      </div>
      <nav aria-label="Main" className="flex-1 overflow-y-auto px-2 pb-6">
        {groups.map((g) => {
          const isCollapsed = !query && collapsed[g.id];
          return (
            <div key={g.id} className="mb-2">
              <button
                type="button"
                onClick={() => toggleGroup(g.id)}
                aria-expanded={!isCollapsed}
                className="flex w-full items-center justify-between rounded px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-fg-3 hover:text-fg-2"
              >
                {g.label}
                <ChevronDown size={12} className={cn("transition-transform", isCollapsed && "-rotate-90")} />
              </button>
              {!isCollapsed && (
                <ul className="mt-0.5 space-y-px">
                  {g.items.map((item) => (
                    <li key={item.to}>
                      <NavLink
                        to={item.to}
                        end={item.to === "/" || item.to === "/learn" || item.to === "/coursework" || item.to === "/revision"}
                        onClick={onNavigate}
                        className={({ isActive }) =>
                          cn(
                            "flex items-center gap-2.5 rounded-md px-2 py-1.5 text-[13px] transition-colors",
                            isActive ? "bg-primary-soft font-medium text-primary" : "text-fg-2 hover:bg-hover hover:text-fg",
                          )
                        }
                      >
                        <item.icon size={15} className="shrink-0" />
                        <span className="truncate">{item.label}</span>
                      </NavLink>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
}
