import { useState } from "react";
import { Layers, MousePointerClick } from "lucide-react";
import { Badge, Button, Callout, Card, CardHeader, Segmented } from "@/components/ui/primitives";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { cn } from "@/lib/cn";
import { SimBanner, StepControls, useMarkOnce, useStepper } from "./shared";

type LayerId = "component" | "hook" | "service" | "http" | "controller" | "ef" | "db";
type Mode = "effect" | "query";
const LAYERS: { id: LayerId; name: string; file: string; side: "frontend" | "network" | "backend" }[] = [
  { id: "component", name: "React Component", file: "pages/Events.tsx", side: "frontend" },
  { id: "hook", name: "Custom Hook", file: "hooks/useEvents.ts", side: "frontend" },
  { id: "service", name: "API Service", file: "services/eventService.ts", side: "frontend" },
  { id: "http", name: "HTTP", file: "GET http://localhost:5229/api/events", side: "network" },
  { id: "controller", name: "ASP.NET Core Controller", file: "Controllers/EventsController.cs", side: "backend" },
  { id: "ef", name: "EF Core", file: "Data/AppDbContext.cs", side: "backend" },
  { id: "db", name: "SQLite", file: "campusevents.db", side: "backend" },
];

const CODE: Record<LayerId, (m: Mode) => { code: string; lang: string }> = {
  component: () => ({ lang: "tsx", code: `export default function Events() {\n  const { data: events, isLoading, error } = useEvents();\n  if (isLoading) return <Spinner />;\n  if (error) return <ErrorMessage error={error} />;\n  return events.map((e) => <EventCard key={e.id} event={e} />);\n}` }),
  hook: (m) => m === "effect"
    ? { lang: "ts", code: `export function useEvents() {\n  const [data, setData] = useState<EventDto[]>([]);\n  const [isLoading, setIsLoading] = useState(true);\n  const [error, setError] = useState<Error | null>(null);\n  useEffect(() => {\n    const controller = new AbortController();\n    getEvents(controller.signal)\n      .then(setData)\n      .catch((e) => e.name !== "AbortError" && setError(e))\n      .finally(() => setIsLoading(false));\n    return () => controller.abort();\n  }, []);\n  return { data, isLoading, error };\n}` }
    : { lang: "ts", code: `export function useEvents() {\n  return useQuery({\n    queryKey: ["events"],\n    queryFn: ({ signal }) => getEvents(signal),\n  });\n}\n// caching, dedupe, retries, refetch on focus,\n// loading/error state — handled by TanStack Query` },
  service: () => ({ lang: "ts", code: `const API = import.meta.env.VITE_API_URL; // http://localhost:5229/api\n\nexport async function getEvents(signal?: AbortSignal): Promise<EventDto[]> {\n  const res = await fetch(\`\${API}/events\`, { signal });\n  if (!res.ok) throw new Error(\`HTTP \${res.status}\`);\n  return res.json();\n}` }),
  http: () => ({ lang: "text", code: `GET /api/events HTTP/1.1\nHost: localhost:5229\nOrigin: http://localhost:5173\nAccept: application/json\n\nHTTP/1.1 200 OK\nContent-Type: application/json; charset=utf-8\nAccess-Control-Allow-Origin: http://localhost:5173\n\n[{ "id": 1, "title": "Intro to React", "categoryName": "Workshop", ... }]` }),
  controller: () => ({ lang: "text", code: `[ApiController]\n[Route("api/[controller]")]\npublic class EventsController : ControllerBase {\n  [HttpGet]\n  public async Task<ActionResult<IEnumerable<EventDto>>> GetEvents() {\n    var events = await _context.Events.Include(e => e.Category).ToListAsync();\n    return Ok(events.Select(e => e.ToDto()));   // entity → DTO\n  }\n}` }),
  ef: () => ({ lang: "text", code: `public class AppDbContext : DbContext {\n  public DbSet<Event> Events => Set<Event>();\n  public DbSet<Category> Categories => Set<Category>();\n}\n// LINQ → SQL translation:\n// SELECT e.*, c.* FROM Events e\n// LEFT JOIN Categories c ON e.CategoryId = c.Id` }),
  db: () => ({ lang: "text", code: `-- SQLite file database\nSELECT "e"."Id", "e"."Title", ..., "c"."Name"\nFROM "Events" AS "e"\nLEFT JOIN "Categories" AS "c" ON "e"."CategoryId" = "c"."Id";\n-- returns rows` }),
};

interface Step { layer: LayerId; dir: "down" | "up"; text: string; hl: number[] }
const steps = (m: Mode): Step[] => [
  { layer: "component", dir: "down", text: "Events renders and calls useEvents(). It knows nothing about URLs or fetch.", hl: [2] },
  { layer: "hook", dir: "down", text: m === "effect" ? "useEffect runs after the first render and calls the service, wiring loading/error state and an AbortController." : "useQuery checks the cache for ['events']. Nothing cached → it calls queryFn.", hl: m === "effect" ? [5, 6, 7] : [2, 3, 4] },
  { layer: "service", dir: "down", text: "eventService builds the URL from VITE_API_URL and calls fetch().", hl: [4] },
  { layer: "http", dir: "down", text: "The browser sends a cross-origin GET (5173 → 5229).", hl: [1, 2, 3, 4] },
  { layer: "controller", dir: "down", text: "Routing maps GET /api/events to EventsController.GetEvents().", hl: [4, 5] },
  { layer: "ef", dir: "down", text: "EF Core translates the LINQ query into SQL.", hl: [2, 6, 7] },
  { layer: "db", dir: "down", text: "SQLite executes the SELECT and returns rows.", hl: [2, 3, 4] },
  { layer: "ef", dir: "up", text: "EF Core materialises rows into Event entity objects.", hl: [2] },
  { layer: "controller", dir: "up", text: "Entities are mapped to EventDto (no internal fields leak) and returned with 200 OK as JSON.", hl: [6, 7] },
  { layer: "http", dir: "up", text: "Response travels back with CORS headers allowing http://localhost:5173.", hl: [6, 7, 8, 10] },
  { layer: "service", dir: "up", text: "Checks response.ok, parses JSON → EventDto[] (TypeScript type is not runtime validation!).", hl: [5, 6] },
  { layer: "hook", dir: "up", text: m === "effect" ? "setData + setIsLoading(false) schedule a re-render." : "Query stores the data in the cache under ['events'] (status 'success') and notifies observers.", hl: m === "effect" ? [8, 10] : [2, 3] },
  { layer: "component", dir: "up", text: "Events re-renders with the data and maps it into EventCards.", hl: [5] },
];

const EXERCISE: { snippet: string; answer: LayerId }[] = [
  { snippet: "fetch(`${API}/events/${id}`, { method: \"DELETE\", headers: { Authorization: … } })", answer: "service" },
  { snippet: "<button onClick={() => setOpen(true)}>Book</button>", answer: "component" },
  { snippet: "useQuery({ queryKey: [\"events\", id], queryFn: () => getEvent(id) })", answer: "hook" },
  { snippet: "[Authorize(Roles = \"ADMIN\")] [HttpPost] public IActionResult Create(CreateEventDto dto)", answer: "controller" },
  { snippet: "modelBuilder.Entity<Booking>().HasOne(b => b.Event).WithMany(e => e.Bookings)", answer: "ef" },
  { snippet: "if (!res.ok) throw new ApiError(res.status, await res.text())", answer: "service" },
  { snippet: "const { data, isPending } = useEvents(); if (isPending) return <Spinner />", answer: "component" },
];

export default function ArchitectureFlowViz() {
  const mark = useMarkOnce("architecture-flow");
  const [mode, setMode] = useState<Mode>("effect");
  const list = steps(mode);
  const s = useStepper(list.length, mark);
  const cur = list[Math.min(s.step, list.length - 1)];
  const c = CODE[cur.layer](mode);
  const [assign, setAssign] = useState<Record<number, LayerId>>({});
  const [sel, setSel] = useState(0);

  return (
    <div className="space-y-4">
      <SimBanner>A modelled walk through the CampusEvents stack for GET /api/events.</SimBanner>
      <div className="flex flex-wrap items-center gap-3">
        <Segmented label="Hook implementation" value={mode} onChange={(m) => { setMode(m); s.restart(); }} options={[{ value: "effect", label: "useEffect + fetch" }, { value: "query", label: "TanStack Query" }]} />
        {mode === "query" && <Badge tone="violet">Only the hook layer changed</Badge>}
      </div>
      <StepControls s={s} />

      <div className="grid gap-4 lg:grid-cols-[300px_1fr]">
        <Card>
          <CardHeader icon={<Layers size={16} />} title="Layers" subtitle={cur.dir === "down" ? "↓ request going down" : "↑ response coming back"} />
          <ol className="space-y-1.5 p-3">
            {LAYERS.map((l) => (
              <li key={l.id} className={cn("rounded-md border px-2.5 py-1.5 text-xs transition-colors",
                cur.layer === l.id ? "border-primary bg-primary-soft" : "border-line",
                l.side === "backend" && cur.layer !== l.id && "bg-elevated")}>
                <div className="flex items-center justify-between gap-1">
                  <span className="font-medium text-fg">{l.name}</span>
                  {cur.layer === l.id && <span className="text-primary">{cur.dir === "down" ? "↓" : "↑"}</span>}
                  {mode === "query" && l.id === "hook" && <Badge tone="violet">changed</Badge>}
                </div>
                <div className="font-mono text-[10.5px] text-fg-3">{l.file}</div>
              </li>
            ))}
          </ol>
        </Card>
        <div className="space-y-3">
          <Callout tone="primary" title={`${LAYERS.find((l) => l.id === cur.layer)!.name} — ${LAYERS.find((l) => l.id === cur.layer)!.file}`}>{cur.text}</Callout>
          <CodeBlock code={c.code} language={c.lang} title={LAYERS.find((l) => l.id === cur.layer)!.file} highlightLines={new Set(cur.hl)} runnable={false} />
        </div>
      </div>

      <Card>
        <CardHeader icon={<MousePointerClick size={16} />} title="Where does this code belong?" subtitle="Pick a snippet, then click a layer" action={<Badge tone="primary">{Object.entries(assign).filter(([i, l]) => EXERCISE[Number(i)].answer === l).length}/{EXERCISE.length}</Badge>} />
        <div className="grid gap-4 p-3 md:grid-cols-2">
          <ul className="space-y-1.5">
            {EXERCISE.map((ex, i) => {
              const a = assign[i];
              return (
                <li key={i}>
                  <button type="button" onClick={() => setSel(i)} aria-pressed={sel === i}
                    className={cn("w-full rounded-md border px-2.5 py-1.5 text-left font-mono text-[11px]", sel === i ? "border-primary bg-primary-soft" : "border-line hover:bg-hover")}>
                    {ex.snippet}
                    {a && <span className="ml-2"><Badge tone={a === ex.answer ? "success" : "error"}>{a === ex.answer ? "✓ " : "✗ "}{LAYERS.find((l) => l.id === a)!.name}</Badge></span>}
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="flex flex-wrap content-start gap-1.5">
            {LAYERS.filter((l) => l.id !== "http" && l.id !== "db").map((l) => (
              <Button key={l.id} size="sm" onClick={() => {
                const next = { ...assign, [sel]: l.id };
                setAssign(next);
                if (Object.keys(next).length === EXERCISE.length) mark();
                if (sel < EXERCISE.length - 1) setSel(sel + 1);
              }}>{l.name}</Button>
            ))}
            <Button size="sm" variant="ghost" onClick={() => { setAssign({}); setSel(0); }}>Reset</Button>
            {assign[sel] && assign[sel] !== EXERCISE[sel].answer && <p className="w-full text-xs text-err">Correct layer: {LAYERS.find((l) => l.id === EXERCISE[sel].answer)!.name}</p>}
          </div>
        </div>
      </Card>
    </div>
  );
}
