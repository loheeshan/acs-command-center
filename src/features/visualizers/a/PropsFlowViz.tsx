import { useState } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import { Badge, Button, Callout, Segmented } from "@/components/ui/primitives";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { cn } from "@/lib/cn";
import { inputCls } from "./StepControls";
import { useMarkOnce } from "./useStepper";

interface Ev {
  id: number;
  title: string;
}
type Mode = "drilling" | "context";
type Node = "App" | "Events" | "EventCard";
interface Flow {
  dir: "down" | "up";
  path: Node[];
  text: string[];
}

const CODE: Record<Mode, string> = {
  drilling: `function App() {
  const [events, setEvents] = useState(initial);
  const [user, setUser] = useState("Ana");
  const [booked, setBooked] = useState([]);
  const book = (id) => setBooked((b) => [...b, id]);
  return <Events events={events} user={user} booked={booked} onBook={book} />;
}
function Events({ events, user, booked, onBook }) {
  // uses none of user — just passes it on (prop drilling)
  return events.map((e) => (
    <EventCard key={e.id} event={e} user={user} isBooked={booked.includes(e.id)} onBook={onBook} />
  ));
}
function EventCard({ event, user, isBooked, onBook }) {
  return <button onClick={() => onBook(event.id)}>{user}: book {event.title}</button>;
}`,
  context: `const UserContext = createContext("guest");
function App() {
  // ...same state as before
  return (
    <UserContext.Provider value={user}>
      <Events events={events} booked={booked} onBook={book} />
    </UserContext.Provider>
  );
}
function Events({ events, booked, onBook }) {
  return events.map((e) => (
    <EventCard key={e.id} event={e} isBooked={booked.includes(e.id)} onBook={onBook} />
  ));
}
function EventCard({ event, isBooked, onBook }) {
  const user = useContext(UserContext); // read directly, no drilling
  return <button onClick={() => onBook(event.id)}>{user}: book {event.title}</button>;
}`,
};

function PropRow({ name, value, hot, passThrough }: { name: string; value: string; hot?: boolean; passThrough?: boolean }) {
  return (
    <div className={cn("flex items-center justify-between gap-2 rounded px-1.5 py-0.5 font-mono text-[11px]", hot && "bg-primary-soft")}>
      <span className="text-fg-2">{name}</span>
      <span className="flex items-center gap-1 truncate text-fg">
        {value}
        {passThrough && <Badge tone="warning">pass-through</Badge>}
      </span>
    </div>
  );
}

export default function PropsFlowViz() {
  const [mode, setMode] = useState<Mode>("drilling");
  const [events, setEvents] = useState<Ev[]>([{ id: 1, title: "Hackathon" }, { id: 2, title: "Career fair" }]);
  const [user, setUser] = useState("Ana");
  const [booked, setBooked] = useState<number[]>([]);
  const [flow, setFlow] = useState<Flow | null>(null);
  const [hot, setHot] = useState<string>("");
  const mark = useMarkOnce("props-flow");

  const editTitle = (t: string) => {
    setEvents((es) => es.map((e) => (e.id === 1 ? { ...e, title: t } : e)));
    setHot("events");
    setFlow({ dir: "down", path: ["App", "Events", "EventCard"], text: ["App's state changes → App re-renders", "Events receives a new events prop", "EventCard #1 receives a new event prop and shows the new title"] });
    mark();
  };
  const editUser = (u: string) => {
    setUser(u);
    setHot("user");
    setFlow(
      mode === "drilling"
        ? { dir: "down", path: ["App", "Events", "EventCard"], text: ["App's user state changes", "Events gets user only to forward it (prop drilling)", "EventCard finally uses user"] }
        : { dir: "down", path: ["App", "EventCard"], text: ["Provider value changes", "Events is skipped over — it no longer knows about user", "Every useContext(UserContext) consumer re-renders with the new value"] },
    );
    mark();
  };
  const book = (id: number) => {
    setBooked((b) => (b.includes(id) ? b : [...b, id]));
    setHot("booked");
    setFlow({ dir: "up", path: ["EventCard", "Events", "App"], text: [`EventCard calls onBook(${id}) — a function it received as a prop`, "The function was created in App (Events just passed it along)", "App's setBooked runs → state lives in App (lifted state) → new booked flows back DOWN"] });
    mark();
  };

  const nodeCls = (n: Node) => cn("rounded-md border p-2.5", flow?.path.includes(n) ? (flow.dir === "down" ? "border-primary bg-primary-soft/60" : "border-violet bg-violet-soft") : "border-line bg-surface");

  return (
    <div className="space-y-4">
      <Segmented label="Sharing user" value={mode} onChange={(m) => { setMode(m); setFlow(null); }} options={[{ value: "drilling", label: "Prop drilling" }, { value: "context", label: "Context" }]} />
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          <div className={nodeCls("App")}>
            <div className="mb-1.5 flex items-center justify-between">
              <span className="font-mono text-xs font-semibold text-fg">&lt;App&gt;</span>
              <Badge tone="success">owns state</Badge>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <label className="flex flex-col gap-1 text-[11px] text-fg-2">
                events[0].title
                <input className={inputCls} value={events[0].title} onChange={(e) => editTitle(e.target.value)} />
              </label>
              <label className="flex flex-col gap-1 text-[11px] text-fg-2">
                user
                <input className={inputCls} value={user} onChange={(e) => editUser(e.target.value)} />
              </label>
            </div>
            <PropRow name="booked" value={JSON.stringify(booked)} hot={hot === "booked"} />
            {mode === "context" && <PropRow name="<UserContext.Provider value>" value={JSON.stringify(user)} hot={hot === "user"} />}
          </div>
          <div className="flex justify-center text-fg-3" aria-hidden>{flow?.dir === "up" ? <ArrowUp size={16} /> : <ArrowDown size={16} />}</div>
          <div className={cn(nodeCls("Events"), "ml-4")}>
            <div className="mb-1 font-mono text-xs font-semibold text-fg">&lt;Events&gt;</div>
            <PropRow name="events" value={`[${events.length} items]`} hot={hot === "events"} />
            {mode === "drilling" && <PropRow name="user" value={JSON.stringify(user)} hot={hot === "user"} passThrough />}
            <PropRow name="booked" value={JSON.stringify(booked)} hot={hot === "booked"} />
            <PropRow name="onBook" value="ƒ book" />
          </div>
          <div className="flex justify-center text-fg-3" aria-hidden>{flow?.dir === "up" ? <ArrowUp size={16} /> : <ArrowDown size={16} />}</div>
          <div className="ml-8 grid gap-2 sm:grid-cols-2">
            {events.map((e) => (
              <div key={e.id} className={nodeCls("EventCard")}>
                <div className="mb-1 font-mono text-xs font-semibold text-fg">&lt;EventCard&gt;</div>
                <PropRow name="event.title" value={JSON.stringify(e.title)} hot={hot === "events" && e.id === 1} />
                <PropRow name={mode === "context" ? "user (useContext)" : "user"} value={JSON.stringify(user)} hot={hot === "user"} />
                <PropRow name="isBooked" value={String(booked.includes(e.id))} hot={hot === "booked"} />
                <Button size="sm" variant={booked.includes(e.id) ? "success" : "secondary"} className="mt-1.5 w-full" onClick={() => book(e.id)}>
                  {booked.includes(e.id) ? "Booked ✓" : `${user}: book`}
                </Button>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-3">
          {flow ? (
            <Callout tone={flow.dir === "down" ? "primary" : "violet"} title={flow.dir === "down" ? "Data flows DOWN via props" : "Events flow UP via callback props"}>
              <ol className="list-decimal space-y-1 pl-4" aria-live="polite">
                {flow.text.map((t, i) => <li key={i}>{t}</li>)}
              </ol>
            </Callout>
          ) : (
            <Callout tone="neutral" title="Try it">Edit a value in App, or click “book” on a card.</Callout>
          )}
          <CodeBlock code={CODE[mode]} language="jsx" title={mode === "drilling" ? "drilling.jsx" : "context.jsx"} runnable={false} />
        </div>
      </div>
    </div>
  );
}
