import { useMemo, useState } from "react";
import { ClipboardCheck, ShieldAlert, Wrench } from "lucide-react";
import { Badge, Button, Callout, Card, CardHeader } from "@/components/ui/primitives";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { cn } from "@/lib/cn";
import { Pre, SimBanner, Toggle, inputCls, labelCls, useMarkOnce } from "./shared";

type Field = "eventName" | "location" | "maxAttendees" | "contactEmail";
type Rule = "required" | "trim" | "minLength" | "positiveInt" | "email";
const FIELDS: { id: Field; label: string; placeholder: string; rules: Rule[] }[] = [
  { id: "eventName", label: "Event Name", placeholder: "e.g. React Study Night", rules: ["required", "trim", "minLength"] },
  { id: "location", label: "Location", placeholder: "e.g. Cavendish C1.04", rules: ["required", "trim", "minLength"] },
  { id: "maxAttendees", label: "Maximum Attendees", placeholder: "e.g. 30", rules: ["required", "positiveInt"] },
  { id: "contactEmail", label: "Contact Email", placeholder: "you@campus.test", rules: ["required", "trim", "email"] },
];
const RULE_LABEL: Record<Rule, string> = { required: "required", trim: "trim whitespace", minLength: "min length", positiveInt: "positive integer", email: "email format" };
type Values = Record<Field, string>;
type Errors = Partial<Record<Field, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function check(values: Values, rules: Record<Field, Rule[]>, minLen: number): Errors {
  const errors: Errors = {};
  for (const f of FIELDS) {
    const r = rules[f.id];
    const raw = values[f.id];
    const v = r.includes("trim") ? raw.trim() : raw;
    if (r.includes("required") && v === "") { errors[f.id] = `${f.label} is required`; continue; }
    if (v === "") continue;
    if (r.includes("minLength") && v.length < minLen) errors[f.id] = `${f.label} must be at least ${minLen} characters`;
    else if (r.includes("positiveInt") && (!/^\d+$/.test(v.trim()) || Number(v) <= 0)) errors[f.id] = `${f.label} must be a whole number greater than 0`;
    else if (r.includes("email") && !EMAIL_RE.test(v)) errors[f.id] = "Enter a valid email address";
  }
  return errors;
}

// The server's own rules never change — it can't trust the client.
const SERVER_RULES: Record<Field, Rule[]> = { eventName: ["required", "trim", "minLength"], location: ["required", "trim", "minLength"], maxAttendees: ["required", "positiveInt"], contactEmail: ["required", "trim", "email"] };

export default function FormValidationViz() {
  const mark = useMarkOnce("form-validation");
  const [values, setValues] = useState<Values>({ eventName: "", location: "", maxAttendees: "", contactEmail: "" });
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [rules, setRules] = useState<Record<Field, Rule[]>>(SERVER_RULES);
  const [minLen, setMinLen] = useState(3);
  const [clientOff, setClientOff] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverRes, setServerRes] = useState<string | null>(null);

  const errors = useMemo(() => (clientOff ? {} : check(values, rules, minLen)), [values, rules, minLen, clientOff]);
  const isValid = Object.keys(errors).length === 0;
  const body = {
    eventName: rules.eventName.includes("trim") ? values.eventName.trim() : values.eventName,
    location: rules.location.includes("trim") ? values.location.trim() : values.location,
    maxAttendees: values.maxAttendees === "" ? null : Number(values.maxAttendees),
    contactEmail: rules.contactEmail.includes("trim") ? values.contactEmail.trim() : values.contactEmail,
  };

  const submit = () => {
    setSubmitted(true);
    setTouched({ eventName: true, location: true, maxAttendees: true, contactEmail: true });
    mark();
    if (!isValid) { setServerRes(null); return; }
    const srvErr = check({ ...values, maxAttendees: body.maxAttendees === null || Number.isNaN(body.maxAttendees) ? values.maxAttendees : String(body.maxAttendees) }, SERVER_RULES, 3);
    if (Object.keys(srvErr).length) {
      const errs = Object.fromEntries(Object.entries(srvErr).map(([k, v]) => [k[0].toUpperCase() + k.slice(1), [v]]));
      setServerRes(`HTTP/1.1 400 Bad Request\nContent-Type: application/problem+json\n\n${JSON.stringify({ title: "One or more validation errors occurred.", status: 400, errors: errs }, null, 2)}`);
    } else {
      setServerRes(`HTTP/1.1 201 Created\nLocation: /api/events/12\n\n${JSON.stringify({ id: 12, ...body }, null, 2)}`);
    }
  };

  const toggleRule = (f: Field, r: Rule) => { setRules((rs) => ({ ...rs, [f]: rs[f].includes(r) ? rs[f].filter((x) => x !== r) : [...rs[f], r] })); mark(); };
  const show = (f: Field) => (touched[f] || submitted) && errors[f];

  const code = `const [values, setValues] = useState({ eventName: "", location: "", maxAttendees: "" });
const errors = validate(values);              // derived — not stored in state
const isValid = Object.keys(errors).length === 0;

<input
  value={values.eventName}                     // controlled: React owns the value
  onChange={(e) => setValues({ ...values, eventName: e.target.value })}
  onBlur={() => setTouched({ ...touched, eventName: true })}
/>

async function onSubmit(e: FormEvent) {
  e.preventDefault();
  if (!isValid) return;                        // client check = UX
  const res = await createEvent({ ...values, maxAttendees: Number(values.maxAttendees) });
  if (res.status === 400) setServerErrors(await res.json()); // server check = security
}`;

  return (
    <div className="space-y-4">
      <SimBanner>The form is a real controlled React form; the "server" that receives it is simulated.</SimBanner>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader icon={<ClipboardCheck size={16} />} title="Create event (mock D3 form)" action={<Badge tone={isValid ? "success" : "error"}>{clientOff ? "client validation OFF" : isValid ? "valid" : `${Object.keys(errors).length} error(s)`}</Badge>} />
          <form className="space-y-3 p-3" noValidate onSubmit={(e) => { e.preventDefault(); submit(); }}>
            {FIELDS.map((f) => (
              <label key={f.id} className="block">
                <span className={labelCls}>{f.label}{rules[f.id].includes("required") && <span className="text-err"> *</span>}</span>
                <input className={cn(inputCls, show(f.id) && "border-err")} placeholder={f.placeholder} value={values[f.id]}
                  inputMode={f.id === "maxAttendees" ? "numeric" : f.id === "contactEmail" ? "email" : undefined}
                  aria-invalid={!!show(f.id)} aria-describedby={show(f.id) ? `${f.id}-err` : undefined}
                  onChange={(e) => { setValues((v) => ({ ...v, [f.id]: e.target.value })); mark(); }}
                  onBlur={() => setTouched((t) => ({ ...t, [f.id]: true }))} />
                {show(f.id) && <span id={`${f.id}-err`} className="text-xs text-err" role="alert">{errors[f.id]}</span>}
              </label>
            ))}
            <div className="flex flex-wrap items-center gap-2">
              <Button type="submit" variant="primary" disabled={!clientOff && submitted && !isValid}>Submit (POST /api/events)</Button>
              <Button onClick={() => { setValues({ eventName: "", location: "", maxAttendees: "", contactEmail: "" }); setTouched({}); setSubmitted(false); setServerRes(null); }}>Reset</Button>
              <Button variant="ghost" onClick={() => setValues({ eventName: "  ", location: "X", maxAttendees: "-5", contactEmail: "not-an-email" })}>Fill with bad data</Button>
            </div>
          </form>
          <div className="border-t border-line p-3">
            <Toggle checked={clientOff} onChange={(v) => { setClientOff(v); setServerRes(null); mark(); }} label={<span className="inline-flex items-center gap-1"><ShieldAlert size={12} /> Disable client validation (like an attacker using DevTools/curl)</span>} />
          </div>
        </Card>

        <Card>
          <CardHeader icon={<Wrench size={16} />} title="Rule builder" subtitle="Applied to the client check only — the server's rules are fixed" />
          <div className="space-y-2 p-3">
            {FIELDS.map((f) => (
              <div key={f.id} className="flex flex-wrap items-center gap-3 text-xs">
                <span className="w-32 font-medium text-fg">{f.label}</span>
                {(["required", "trim", "minLength", "positiveInt", "email"] as Rule[]).map((r) => (
                  <Toggle key={r} checked={rules[f.id].includes(r)} onChange={() => toggleRule(f.id, r)} label={RULE_LABEL[r]} />
                ))}
              </div>
            ))}
            <label className="flex items-center gap-2 text-xs text-fg-2">min length
              <input type="number" min={1} max={20} className={cn(inputCls, "w-16")} value={minLen} onChange={(e) => setMinLen(Math.max(1, Number(e.target.value) || 1))} />
            </label>
          </div>
          <div className="grid gap-2 border-t border-line p-3 sm:grid-cols-2">
            <div><div className={labelCls}>values (form state)</div><Pre>{JSON.stringify(values, null, 2)}</Pre></div>
            <div><div className={labelCls}>errors</div><Pre>{JSON.stringify(errors, null, 2)}</Pre></div>
            <div className="sm:col-span-2"><div className={labelCls}>JSON body that WOULD be POSTed {isValid ? "" : "(blocked — form invalid)"}</div><Pre className={cn(!isValid && "opacity-50")}>{JSON.stringify(body, null, 2)}</Pre></div>
          </div>
        </Card>
      </div>

      {serverRes && (
        <Card aria-live="polite">
          <CardHeader title="Simulated server response" action={<Badge tone={serverRes.includes(" 400 ") ? "error" : "success"}>{serverRes.includes(" 400 ") ? "400 — server caught it" : "201 Created"}</Badge>} />
          <div className="p-3"><Pre>{serverRes}</Pre></div>
        </Card>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <CodeBlock code={code} language="tsx" title="Controlled form pattern" highlightLines={new Set(clientOff ? [15] : [2, 3, 13])} runnable={false} />
        <div className="space-y-2">
          <Callout tone="warning" title="Client validation ≠ security">It gives instant feedback to honest users. Anyone can skip it — turn it off and submit bad data: the server still answers 400.</Callout>
          <Callout tone="primary" title="Inputs give you strings">Even <code>type="number"</code> inputs give <code>e.target.value</code> as a string. Convert with <code>Number()</code> before sending, and check for NaN.</Callout>
        </div>
      </div>
    </div>
  );
}
