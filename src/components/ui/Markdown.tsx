import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { CodeBlock } from "./CodeBlock";
import { cn } from "@/lib/cn";

const components: Components = {
  pre: ({ children }) => <>{children}</>,
  code: ({ className, children }) => {
    const match = /language-(\w+)/.exec(className ?? "");
    const text = String(children ?? "");
    if (match || text.includes("\n")) {
      const lang = match?.[1] ?? "text";
      return <CodeBlock code={text} language={lang} runnable={lang !== "text"} className="my-3" />;
    }
    return <code>{children}</code>;
  },
  a: ({ href, children }) => (
    <a href={href} target={href?.startsWith("http") ? "_blank" : undefined} rel="noreferrer noopener">
      {children}
    </a>
  ),
};

/** Renders trusted, bundled lesson markdown. Raw HTML is NOT enabled (react-markdown escapes it). */
export function Markdown({ children, className }: { children: string; className?: string }) {
  return (
    <div className={cn("prose-acs", className)}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {children}
      </ReactMarkdown>
    </div>
  );
}
