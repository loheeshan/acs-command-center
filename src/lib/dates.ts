/** Academic dates (Asia/Colombo, UTC+05:30). */
export const TZ = "Asia/Colombo";
export const DATES = {
  mockIct: "2026-11-19",
  /** ICT confirmed by the learner: 25 Nov 2026, 15:30–17:30 Asia/Colombo (roadmap had listed 26 Nov). */
  ict: "2026-11-25",
  ictStart: "2026-11-25T15:30",
  ictEnd: "2026-11-25T17:30",
  holidayStart: "2026-12-14",
  holidayEnd: "2027-01-01",
  /** 7 Jan 2027 13:00 Asia/Colombo */
  courseworkDeadline: "2027-01-07T13:00:00+05:30",
};

/** Convert a local Colombo "YYYY-MM-DDTHH:mm" string to epoch ms. */
export function colomboToEpoch(local: string): number {
  return new Date(`${local}:00+05:30`).getTime();
}

/** Today's date in Asia/Colombo as YYYY-MM-DD. */
export function todayColombo(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
}

export function daysBetween(fromIso: string, toIso: string): number {
  return Math.round((new Date(`${toIso}T00:00:00Z`).getTime() - new Date(`${fromIso}T00:00:00Z`).getTime()) / 86_400_000);
}

export function formatCountdown(ms: number): string {
  if (ms <= 0) return "now";
  const d = Math.floor(ms / 86_400_000);
  const h = Math.floor((ms % 86_400_000) / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

export function formatDuration(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function formatDate(iso: string | number, opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" }): string {
  return new Intl.DateTimeFormat("en-GB", { timeZone: TZ, ...opts }).format(new Date(iso));
}

/** ICT window as epoch ms. `overrideStart` is a local "YYYY-MM-DDTHH:mm" from Settings. */
export function ictWindow(overrideStart?: string): { start: number; end: number } {
  const start = colomboToEpoch(overrideStart ?? DATES.ictStart);
  const defaultLen = colomboToEpoch(DATES.ictEnd) - colomboToEpoch(DATES.ictStart);
  return { start, end: start + defaultLen };
}

/** Split a duration into days/hours/minutes/seconds. */
export function splitDuration(ms: number) {
  const t = Math.max(0, Math.floor(ms / 1000));
  return { d: Math.floor(t / 86400), h: Math.floor((t % 86400) / 3600), m: Math.floor((t % 3600) / 60), s: t % 60 };
}
