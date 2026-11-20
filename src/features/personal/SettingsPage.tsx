import { useUiStore } from "@/stores/uiStore";
import { useProgressStore } from "@/stores/progressStore";
import { Card, PageHeader, Segmented } from "@/components/ui/primitives";
import { DATES } from "@/lib/dates";

export default function SettingsPage() {
  const { theme, setTheme, explanationLevel, setExplanationLevel } = useUiStore();
  const ictStart = useProgressStore((s) => s.ictStartTime);
  const setIct = useProgressStore((s) => s.setIctStartTime);
  const time = ictStart?.slice(11) ?? DATES.ictStart.slice(11);
  return (
    <div>
      <PageHeader eyebrow="Personal" title="Settings" />
      <div className="max-w-2xl space-y-4">
        <Card className="space-y-4 p-4">
          <div className="flex items-center justify-between gap-3"><span className="text-sm">Theme</span><Segmented label="Theme" value={theme} onChange={setTheme} options={[{ value: "dark", label: "Dark" }, { value: "light", label: "Light" }]} /></div>
          <div className="flex flex-wrap items-center justify-between gap-3"><span className="text-sm">Default explanation level</span><Segmented label="Explanation level" value={explanationLevel} onChange={setExplanationLevel} options={[{ value: "beginner", label: "Beginner" }, { value: "developer", label: "Developer" }, { value: "deep", label: "Deep dive" }]} /></div>
        </Card>
        <Card className="p-4">
          <h2 className="text-sm font-semibold">ICT start time</h2>
          <p className="mt-1 text-xs text-fg-2">Confirmed: 25 November 2026, 15:30–17:30 (Asia/Colombo). Change the start time only if the schedule moves.</p>
          <div className="mt-3 flex items-center gap-2">
            <label htmlFor="ict-time" className="text-sm text-fg-2">25 Nov 2026 at</label>
            <input id="ict-time" type="time" value={time} onChange={(e) => setIct(e.target.value ? `${DATES.ict}T${e.target.value}` : undefined)} className="h-9 rounded-md border border-line bg-elevated px-2 text-sm text-fg" />
            {ictStart && <button type="button" className="text-xs text-primary" onClick={() => setIct(undefined)}>Reset to 15:30</button>}
          </div>
        </Card>
        <Card className="p-4 text-sm text-fg-2">
          <h2 className="mb-1 text-sm font-semibold text-fg">Key dates (Asia/Colombo)</h2>
          <ul className="list-disc space-y-0.5 pl-5">
            <li>Mock ICT: 19 Nov 2026</li><li>ICT (40%, qualifying mark 30/100): 25 Nov 2026, 15:30–17:30</li>
            <li>Holiday: 14 Dec 2026 – 1 Jan 2027</li><li>Coursework (60%, qualifying 30/100): 7 Jan 2027, 1:00 PM</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
