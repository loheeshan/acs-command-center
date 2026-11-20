import { describe, expect, it } from "vitest";
import { compileFile, compileProject, instrumentLoops } from "@/features/playground/sandbox";

describe("instrumentLoops", () => {
  it("guards braced for/while/do loops", () => {
    const out = instrumentLoops("for (let i = 0; i < 3; i++) { x(); } while (a) { b(); } do { c(); } while (d);");
    expect(out.match(/__acsLoopGuard\(\);/g)).toHaveLength(3);
  });
  it("ignores keywords inside strings, comments and identifiers", () => {
    const src = 'const s = "while (x) {"; // for (;;) {\nconst forEachThing = 1; /* do { */';
    expect(instrumentLoops(src)).toBe(src);
  });
  it("handles nested parentheses in loop headers", () => {
    expect(instrumentLoops("for (const x of f(g(1))) { h(x); }")).toContain("{__acsLoopGuard();");
  });
});

describe("compile", () => {
  it("strips types and converts JSX + imports to CommonJS", () => {
    const out = compileFile("App.tsx", 'import { useState } from "react";\nexport default function App(): JSX.Element { const [n] = useState<number>(0); return <p>{n}</p>; }');
    expect(out).toMatch(/require\(['"]react['"]\)/);
    expect(out).toContain("react/jsx-runtime");
    expect(out).not.toContain("<number>");
  });
  it("reports compile errors per file and collects css/html", () => {
    const r = compileProject({ "a.ts": "const = ;", "s.css": "p{}", "index.html": "<p>hi</p>" });
    expect(r.errors[0].file).toBe("a.ts");
    expect(r.css).toContain("p{}");
    expect(r.html).toBe("<p>hi</p>");
  });
});
