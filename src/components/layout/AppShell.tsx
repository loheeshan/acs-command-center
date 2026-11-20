import { Outlet, useLocation } from "react-router-dom";
import { Suspense, useEffect } from "react";
import { Menu, Moon, Sun, X } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { useUiStore } from "@/stores/uiStore";
import { useNow } from "@/hooks/useNow";
import { DATES, formatCountdown } from "@/lib/dates";
import { ExamClockCompact } from "./ExamClock";
import { Segmented } from "@/components/ui/primitives";

function Countdown() {
  const now = useNow(60_000);
  const cw = new Date(DATES.courseworkDeadline).getTime();
  return (
    <div className="flex items-center gap-3 text-xs text-fg-2">
      <ExamClockCompact />
      <span className="hidden md:inline">Coursework <span className="font-semibold tabular-nums text-fg">{now < cw ? formatCountdown(cw - now) : "submitted?"}</span></span>
    </div>
  );
}

export function AppShell() {
  const theme = useUiStore((s) => s.theme);
  const toggleTheme = useUiStore((s) => s.toggleTheme);
  const level = useUiStore((s) => s.explanationLevel);
  const setLevel = useUiStore((s) => s.setExplanationLevel);
  const mobileOpen = useUiStore((s) => s.mobileNavOpen);
  const setMobileOpen = useUiStore((s) => s.setMobileNavOpen);
  const location = useLocation();
  const fullBleed = location.pathname.startsWith("/lab/playground") || location.pathname.startsWith("/assess/exam/");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    setMobileOpen(false);
    if (!location.hash) document.getElementById("main")?.scrollTo({ top: 0 });
  }, [location.pathname, location.hash, setMobileOpen]);

  return (
    <div className="flex h-full">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded focus:bg-primary focus:px-3 focus:py-1 focus:text-on-primary">Skip to content</a>
      <aside className="hidden w-60 shrink-0 border-r border-line bg-surface lg:block">
        <Sidebar />
      </aside>
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-72 border-r border-line bg-surface">
            <button type="button" onClick={() => setMobileOpen(false)} className="absolute right-2 top-3.5 rounded p-1.5 text-fg-2 hover:bg-hover" aria-label="Close navigation"><X size={16} /></button>
            <Sidebar onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-line bg-surface/80 px-3 backdrop-blur sm:px-4">
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setMobileOpen(true)} className="rounded p-1.5 text-fg-2 hover:bg-hover lg:hidden" aria-label="Open navigation"><Menu size={18} /></button>
            <Countdown />
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden text-[11px] text-fg-3 sm:inline">Explanation</span>
            <Segmented
              label="Explanation level"
              size="sm"
              value={level}
              onChange={setLevel}
              options={[{ value: "beginner", label: "Beginner" }, { value: "developer", label: "Developer" }, { value: "deep", label: "Deep dive" }]}
            />
            <button type="button" onClick={toggleTheme} className="rounded-md p-2 text-fg-2 hover:bg-hover hover:text-fg" aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}>
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
        </header>
        <main id="main" tabIndex={-1} className="min-h-0 flex-1 overflow-y-auto outline-none">
          <Suspense fallback={<div className="p-8 text-sm text-fg-2">Loading…</div>}>
            {fullBleed ? <Outlet /> : (
              <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:py-8">
                <Outlet />
              </div>
            )}
          </Suspense>
        </main>
      </div>
    </div>
  );
}
