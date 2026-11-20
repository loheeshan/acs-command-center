import { Highlight, themes } from "prism-react-renderer";
import { useState } from "react";
import { Check, Copy, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUiStore } from "@/stores/uiStore";
import { cn } from "@/lib/cn";
import { openInPlayground, isRunnableLanguage } from "@/features/playground/handoff";

const LANG_MAP: Record<string, string> = { js: "javascript", ts: "typescript", jsx: "jsx", tsx: "tsx", html: "markup", css: "css", json: "json", bash: "bash", http: "markup", text: "markup" };

export function CodeBlock({
  code,
  language = "text",
  title,
  highlightLines,
  runnable = true,
  className,
}: {
  code: string;
  language?: string;
  title?: string;
  highlightLines?: Set<number>;
  runnable?: boolean;
  className?: string;
}) {
  const theme = useUiStore((s) => s.theme);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const trimmed = code.replace(/\n+$/, "");
  const canRun = runnable && isRunnableLanguage(language);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(trimmed);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className={cn("group overflow-hidden rounded-md border border-line bg-code", className)}>
      <div className="flex items-center justify-between gap-2 border-b border-line px-3 py-1.5">
        <span className="truncate font-mono text-[11px] text-fg-3">{title ?? language}</span>
        <div className="flex items-center gap-1">
          {canRun && (
            <button
              type="button"
              onClick={() => {
                openInPlayground({ code: trimmed, language, title: title ?? "Lesson example" });
                navigate("/lab/playground");
              }}
              className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] text-fg-2 hover:bg-hover hover:text-primary"
              aria-label="Open this code in the playground"
            >
              <Play size={12} /> Try it
            </button>
          )}
          <button type="button" onClick={copy} className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] text-fg-2 hover:bg-hover hover:text-fg" aria-label="Copy code">
            {copied ? <Check size={12} /> : <Copy size={12} />} {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>
      <Highlight theme={theme === "dark" ? themes.vsDark : themes.github} code={trimmed} language={LANG_MAP[language] ?? "markup"}>
        {({ tokens, getLineProps, getTokenProps }) => (
          <pre className="overflow-x-auto py-2.5 font-mono text-[12.5px] leading-relaxed" style={{ background: "transparent" }}>
            {tokens.map((line, i) => {
              const { key: _k, ...lineProps } = getLineProps({ line, key: i }) as ReturnType<typeof getLineProps> & { key?: unknown };
              void _k;
              return (
                <div key={i} {...lineProps} className={cn("flex px-3", highlightLines?.has(i + 1) && "bg-primary-soft")}>
                  <span className="mr-4 inline-block w-6 shrink-0 select-none text-right text-fg-3/60">{i + 1}</span>
                  <span className="whitespace-pre">
                    {line.map((token, j) => {
                      const { key: _tk, ...tp } = getTokenProps({ token, key: j }) as ReturnType<typeof getTokenProps> & { key?: unknown };
                      void _tk;
                      return <span key={j} {...tp} />;
                    })}
                  </span>
                </div>
              );
            })}
          </pre>
        )}
      </Highlight>
    </div>
  );
}
