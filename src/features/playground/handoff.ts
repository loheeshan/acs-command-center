/** Hand code from anywhere in the app to the playground via sessionStorage. */
export interface PlaygroundHandoff {
  code: string;
  language: string;
  title: string;
  /** Optional multi-file project (overrides code/language). */
  files?: Record<string, string>;
  entry?: string;
  open?: string;
  instructions?: string;
}

const KEY = "acs-playground-handoff";

export function isRunnableLanguage(language: string): boolean {
  return ["js", "ts", "jsx", "tsx", "html", "css", "javascript", "typescript"].includes(language);
}

export function openInPlayground(h: PlaygroundHandoff): void {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(h));
  } catch {
    /* storage unavailable */
  }
}

export function takeHandoff(): PlaygroundHandoff | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    sessionStorage.removeItem(KEY);
    return JSON.parse(raw) as PlaygroundHandoff;
  } catch {
    return null;
  }
}
