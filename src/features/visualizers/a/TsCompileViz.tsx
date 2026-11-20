import { useMemo, useState } from "react";
import { transform } from "sucrase";
import { Badge, Button, Callout, Segmented } from "@/components/ui/primitives";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { Panel } from "./StepControls";
import { useMarkOnce } from "./useStepper";

const SAMPLES: Record<string, string> = {
  types: `interface Product {
  id: number;
  title: string;
  price: number;
}

type Status = "draft" | "live";

function total(items: Product[], discount: number = 0): number {
  return items.reduce((sum, p) => sum + p.price, 0) * (1 - discount);
}

const status: Status = "live";
let count = 0 as number;
const first = [] as Product[];`,
  generics: `function firstOrNull<T>(list: T[]): T | null {
  return list.length > 0 ? list[0] : null;
}

const n = firstOrNull<number>([1, 2, 3]);
const s = firstOrNull(["a", "b"]);

class Cart {
  private items: string[] = [];
  constructor(public owner: string) {}
  add(item: string): void {
    this.items.push(item);
  }
}`,
  enum: `// enums are one of the few TS features that DO emit code
enum Role {
  User = "USER",
  Admin = "ADMIN",
}

const r: Role = Role.Admin;
console.log(r);`,
};

const CAST_DEMO = `interface Product { id: number; title: string; price: number }

// The server actually sends: { "id": "7", "name": "Mug" }
const data = JSON.parse('{"id":"7","name":"Mug"}');
const p = data as Product;   // compiles fine — no runtime check

p.price.toFixed(2);          // 💥 TypeError at runtime: p.price is undefined`;

export default function TsCompileViz() {
  const [sample, setSample] = useState<keyof typeof SAMPLES>("types");
  const [src, setSrc] = useState(SAMPLES.types);
  const mark = useMarkOnce("ts-compile");

  const result = useMemo(() => {
    try {
      const code = transform(src, { transforms: ["typescript"], disableESTransforms: true }).code;
      return { ok: true as const, code: code.replace(/^\s*\n/gm, "").trim() || "// (nothing left: only type-level code)" };
    } catch (e) {
      return { ok: false as const, msg: e instanceof Error ? e.message : String(e) };
    }
  }, [src]);

  const [castRun, setCastRun] = useState<string | null>(null);
  const runCast = () => {
    mark();
    try {
      const data: unknown = JSON.parse('{"id":"7","name":"Mug"}');
      const p = data as { id: number; title: string; price: number };
      setCastRun(`typeof p.id === "${typeof p.id}" … calling p.price.toFixed(2): ${p.price.toFixed(2)}`);
    } catch (e) {
      setCastRun(`${e instanceof Error ? `${e.name}: ${e.message}` : String(e)}`);
    }
  };

  const inLines = src.split("\n").length;
  const outLines = result.ok ? result.code.split("\n").length : 0;

  return (
    <div className="space-y-4">
      <Segmented
        label="Sample"
        value={sample}
        onChange={(k) => { setSample(k); setSrc(SAMPLES[k]); }}
        options={[{ value: "types", label: "Types & interfaces" }, { value: "generics", label: "Generics & classes" }, { value: "enum", label: "Enum (emits code)" }]}
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <label htmlFor="ts-src" className="mb-1 flex items-center justify-between text-xs font-medium text-fg-2">
            TypeScript input (editable) <Badge>{inLines} lines</Badge>
          </label>
          <textarea
            id="ts-src"
            value={src}
            spellCheck={false}
            onChange={(e) => { setSrc(e.target.value); mark(); }}
            className="h-80 w-full resize-y rounded-md border border-line bg-code p-3 font-mono text-[12.5px] leading-relaxed text-fg focus:border-primary focus:outline-none"
          />
        </div>
        <div>
          <div className="mb-1 flex items-center justify-between text-xs font-medium text-fg-2">
            JavaScript output (compiled live with Sucrase) {result.ok && <Badge tone="success">{outLines} lines</Badge>}
          </div>
          {result.ok ? (
            <CodeBlock code={result.code} language="js" title="output.js" runnable={false} />
          ) : (
            <Callout tone="error" title="Syntax error">
              <code className="font-mono text-xs">{result.msg}</code>
            </Callout>
          )}
        </div>
      </div>
      <Callout tone="primary" title="What just happened?">
        Interfaces, type aliases, annotations, generics and <code>as</code> casts are <strong>erased</strong> — the browser only ever runs the
        JavaScript on the right. Sucrase only strips types (like Vite/esbuild do); it does not type-check. Type errors are reported by
        <code> tsc</code> or your editor at compile time.
      </Callout>

      <div className="grid gap-4 lg:grid-cols-2">
        <CodeBlock code={CAST_DEMO} language="ts" title="as-is-not-validation.ts" highlightLines={new Set([5, 7])} runnable={false} />
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <Panel title="Compile time (tsc)" tone="primary">
              <ul className="list-disc space-y-1 pl-4 text-xs text-fg-2">
                <li>Checks your code against declared types</li>
                <li><code>as Product</code> is trusted — no error</li>
                <li>Then all types are removed</li>
              </ul>
            </Panel>
            <Panel title="Runtime (browser)" tone="warn">
              <ul className="list-disc space-y-1 pl-4 text-xs text-fg-2">
                <li>No types exist any more</li>
                <li>API data can be any shape</li>
                <li>Validate with code (e.g. Zod) at the boundary</li>
              </ul>
            </Panel>
          </div>
          <Button variant="primary" size="sm" onClick={runCast}>Run the cast example for real</Button>
          {castRun && (
            <Callout tone="error" title="Runtime result">
              <code className="break-words font-mono text-xs">{castRun}</code>
              <p className="mt-1 text-xs">The cast compiled, yet the data was never checked: <code>id</code> is a string and <code>price</code> does not exist.</p>
            </Callout>
          )}
        </div>
      </div>
    </div>
  );
}
