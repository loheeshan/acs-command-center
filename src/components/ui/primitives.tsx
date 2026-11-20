import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "success";
type Size = "sm" | "md";

export function Button({
  variant = "secondary",
  size = "md",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }) {
  return (
    <button
      type="button"
      {...props}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-md font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        size === "sm" ? "h-8 px-2.5 text-xs" : "h-9 px-3.5 text-sm",
        variant === "primary" && "bg-primary text-on-primary hover:bg-primary-strong",
        variant === "secondary" && "border border-line bg-elevated text-fg hover:bg-hover",
        variant === "ghost" && "text-fg-2 hover:bg-hover hover:text-fg",
        variant === "danger" && "border border-err/40 bg-err-soft text-err hover:bg-err/20",
        variant === "success" && "border border-ok/40 bg-ok-soft text-ok hover:bg-ok/20",
        className,
      )}
    />
  );
}

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={cn("rounded-lg border border-line bg-surface", className)} />;
}

export function CardHeader({ title, subtitle, action, icon }: { title: ReactNode; subtitle?: ReactNode; action?: ReactNode; icon?: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-line px-4 py-3">
      <div className="flex min-w-0 items-start gap-2.5">
        {icon && <span className="mt-0.5 text-primary">{icon}</span>}
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-fg">{title}</h3>
          {subtitle && <p className="mt-0.5 text-xs text-fg-2">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}

type Tone = "neutral" | "primary" | "success" | "warning" | "error" | "violet";
const toneClass: Record<Tone, string> = {
  neutral: "border-line bg-elevated text-fg-2",
  primary: "border-primary/30 bg-primary-soft text-primary",
  success: "border-ok/30 bg-ok-soft text-ok",
  warning: "border-warn/30 bg-warn-soft text-warn",
  error: "border-err/30 bg-err-soft text-err",
  violet: "border-violet/30 bg-violet-soft text-violet",
};

export function Badge({ tone = "neutral", className, children }: { tone?: Tone; className?: string; children: ReactNode }) {
  return (
    <span className={cn("inline-flex items-center gap-1 whitespace-nowrap rounded border px-1.5 py-0.5 text-[11px] font-medium leading-none", toneClass[tone], className)}>
      {children}
    </span>
  );
}

export function Callout({ tone = "primary", title, children, icon }: { tone?: Tone; title?: ReactNode; children: ReactNode; icon?: ReactNode }) {
  return (
    <div className={cn("rounded-md border px-3.5 py-3 text-sm", toneClass[tone])}>
      {title && (
        <div className="mb-1 flex items-center gap-1.5 font-semibold">
          {icon}
          {title}
        </div>
      )}
      <div className="text-fg-2">{children}</div>
    </div>
  );
}

export function ProgressBar({ value, max = 100, tone = "primary", label }: { value: number; max?: number; tone?: "primary" | "success" | "warning" | "error"; label?: string }) {
  const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  const color = { primary: "bg-primary", success: "bg-ok", warning: "bg-warn", error: "bg-err" }[tone];
  return (
    <div role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100} aria-label={label} className="h-1.5 w-full overflow-hidden rounded-full bg-elevated">
      <div className={cn("h-full rounded-full transition-all", color)} style={{ width: `${pct}%` }} />
    </div>
  );
}

export function PageHeader({ eyebrow, title, description, actions }: { eyebrow?: ReactNode; title: ReactNode; description?: ReactNode; actions?: ReactNode }) {
  return (
    <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0 max-w-3xl">
        {eyebrow && <div className="mb-1.5 text-xs font-medium uppercase tracking-wider text-primary">{eyebrow}</div>}
        <h1 className="text-2xl font-semibold tracking-tight text-fg">{title}</h1>
        {description && <p className="mt-1.5 text-sm text-fg-2">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </header>
  );
}

export function EmptyState({ icon, title, children, action }: { icon?: ReactNode; title: string; children?: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-line px-6 py-10 text-center">
      {icon && <div className="mb-3 text-fg-3">{icon}</div>}
      <p className="text-sm font-medium text-fg">{title}</p>
      {children && <div className="mt-1 max-w-md text-sm text-fg-2">{children}</div>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function Segmented<T extends string>({
  value,
  onChange,
  options,
  label,
  size = "md",
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: ReactNode }[];
  label: string;
  size?: Size;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex rounded-md border border-line bg-elevated p-0.5">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            "rounded px-2.5 font-medium transition-colors",
            size === "sm" ? "h-6 text-[11px]" : "h-7 text-xs",
            value === o.value ? "bg-surface text-fg shadow-sm" : "text-fg-2 hover:text-fg",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Tabs<T extends string>({
  tabs,
  value,
  onChange,
  className,
}: {
  tabs: { id: T; label: ReactNode; badge?: ReactNode }[];
  value: T;
  onChange: (id: T) => void;
  className?: string;
}) {
  return (
    <div role="tablist" className={cn("flex gap-1 overflow-x-auto border-b border-line", className)}>
      {tabs.map((t) => (
        <button
          key={t.id}
          role="tab"
          type="button"
          aria-selected={value === t.id}
          onClick={() => onChange(t.id)}
          className={cn(
            "-mb-px flex shrink-0 items-center gap-1.5 border-b-2 px-3 py-2 text-sm transition-colors",
            value === t.id ? "border-primary font-medium text-fg" : "border-transparent text-fg-2 hover:text-fg",
          )}
        >
          {t.label}
          {t.badge}
        </button>
      ))}
    </div>
  );
}

export function Stat({ label, value, hint }: { label: string; value: ReactNode; hint?: ReactNode }) {
  return (
    <div className="min-w-0">
      <div className="text-xs text-fg-2">{label}</div>
      <div className="mt-0.5 text-xl font-semibold tabular-nums text-fg">{value}</div>
      {hint && <div className="mt-0.5 text-xs text-fg-3">{hint}</div>}
    </div>
  );
}

export function Kbd({ children }: { children: ReactNode }) {
  return <kbd className="rounded border border-line bg-elevated px-1.5 py-0.5 font-mono text-[10px] text-fg-2">{children}</kbd>;
}
