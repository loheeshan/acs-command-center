import { transform } from "sucrase";

/**
 * Sandbox execution model
 * -----------------------
 * - Learner files are transpiled in the main app with Sucrase (TS/JSX → CommonJS).
 *   Types are stripped (no type checking here — Monaco shows real TS diagnostics).
 * - The compiled modules run inside an <iframe sandbox="allow-scripts"> WITHOUT
 *   allow-same-origin: the code gets an opaque origin, so it cannot read this app's
 *   storage, cookies or DOM. A CSP meta tag blocks all network access.
 * - fetch() to /api/... and to the example course endpoint is answered by a
 *   clearly-labelled in-sandbox MOCK API. All other network requests fail.
 * - Loops are instrumented with a guard that throws after ~3 s of continuous looping.
 */

export type SandboxFiles = Record<string, string>;

export interface CompileResult {
  modules: Record<string, string>;
  css: string;
  html: string;
  errors: { file: string; message: string }[];
}

const GUARD = "__acsLoopGuard();";

/** Insert a loop guard at the start of every braced loop body. Unbraced loops are left as-is. */
export function instrumentLoops(code: string): string {
  let out = "";
  let i = 0;
  const n = code.length;
  const isIdent = (c: string | undefined) => !!c && /[A-Za-z0-9_$]/.test(c);
  while (i < n) {
    const ch = code[i];
    // skip strings / template literals / comments
    if (ch === '"' || ch === "'" || ch === "`") {
      const q = ch;
      let j = i + 1;
      while (j < n && code[j] !== q) {
        if (code[j] === "\\") j++;
        j++;
      }
      out += code.slice(i, j + 1);
      i = j + 1;
      continue;
    }
    if (ch === "/" && code[i + 1] === "/") {
      const j = code.indexOf("\n", i);
      const end = j === -1 ? n : j;
      out += code.slice(i, end);
      i = end;
      continue;
    }
    if (ch === "/" && code[i + 1] === "*") {
      const j = code.indexOf("*/", i + 2);
      const end = j === -1 ? n : j + 2;
      out += code.slice(i, end);
      i = end;
      continue;
    }
    const rest = code.slice(i, i + 6);
    const kw = rest.startsWith("while") ? "while" : rest.startsWith("for") ? "for" : rest.startsWith("do") ? "do" : null;
    if (kw && !isIdent(code[i - 1]) && !isIdent(code[i + kw.length])) {
      let j = i + kw.length;
      if (kw !== "do") {
        while (j < n && /\s/.test(code[j])) j++;
        if (code[j] === "(") {
          let depth = 0;
          for (; j < n; j++) {
            if (code[j] === "(") depth++;
            else if (code[j] === ")") {
              depth--;
              if (depth === 0) {
                j++;
                break;
              }
            }
          }
        } else {
          out += code.slice(i, j);
          i = j;
          continue;
        }
      }
      let k = j;
      while (k < n && /\s/.test(code[k])) k++;
      if (code[k] === "{") {
        out += code.slice(i, k + 1) + GUARD;
        i = k + 1;
        continue;
      }
      out += code.slice(i, j);
      i = j;
      continue;
    }
    out += ch;
    i++;
  }
  return out;
}

export function compileFile(path: string, source: string): string {
  const isTs = /\.tsx?$/.test(path);
  const isJsx = /\.(t|j)sx$/.test(path) || /\.js$/.test(path);
  const transforms: ("typescript" | "jsx" | "imports")[] = ["imports"];
  if (isTs) transforms.unshift("typescript");
  if (isJsx) transforms.unshift("jsx");
  const result = transform(source, {
    transforms,
    jsxRuntime: "automatic",
    production: true,
    filePath: path,
  });
  return instrumentLoops(result.code);
}

export function compileProject(files: SandboxFiles): CompileResult {
  const modules: Record<string, string> = {};
  const errors: CompileResult["errors"] = [];
  let css = "";
  let html = "";
  for (const [path, source] of Object.entries(files)) {
    if (path.endsWith(".css")) {
      css += `\n/* ${path} */\n${source}`;
      continue;
    }
    if (path.endsWith(".html")) {
      html += source;
      continue;
    }
    if (/\.(t|j)sx?$/.test(path)) {
      try {
        modules[path] = compileFile(path, source);
      } catch (e) {
        errors.push({ file: path, message: e instanceof Error ? e.message : String(e) });
      }
    }
  }
  return { modules, css, html, errors };
}

/* ------------------------------------------------------------------ */
/* Code that runs INSIDE the iframe. Must be self-contained.           */
/* ------------------------------------------------------------------ */

function sandboxBootstrap(runId: string, modules: Record<string, string>, entry: string, autoRender: boolean) {
  const post = (msg: Record<string, unknown>) => parent.postMessage({ __acs: true, runId, ...msg }, "*");

  const seen = new WeakSet<object>();
  const fmt = (v: unknown, depth = 0): string => {
    if (typeof v === "string") return depth === 0 ? v : JSON.stringify(v);
    if (typeof v === "function") return `ƒ ${(v as { name?: string }).name || "anonymous"}()`;
    if (typeof v === "undefined") return "undefined";
    if (typeof v === "symbol" || typeof v === "bigint") return String(v);
    if (v === null || typeof v !== "object") return String(v);
    if (v instanceof Error) return `${v.name}: ${v.message}`;
    if (v instanceof Promise) return "Promise {<pending or settled>}";
    if (seen.has(v)) return "[Circular]";
    if (depth > 3) return Array.isArray(v) ? "[Array]" : "{…}";
    seen.add(v);
    try {
      if (Array.isArray(v)) return `[${v.map((x) => fmt(x, depth + 1)).join(", ")}]`;
      if (v instanceof Map) return `Map(${v.size}) {${[...v.entries()].map(([k, x]) => `${fmt(k, depth + 1)} => ${fmt(x, depth + 1)}`).join(", ")}}`;
      if (v instanceof Set) return `Set(${v.size}) {${[...v].map((x) => fmt(x, depth + 1)).join(", ")}}`;
      if ((v as { $$typeof?: unknown }).$$typeof) return "<ReactElement>";
      if (typeof Node !== "undefined" && v instanceof Node) return `<${(v as Element).tagName?.toLowerCase() ?? "node"}>`;
      const entries = Object.entries(v as Record<string, unknown>).map(([k, x]) => `${k}: ${fmt(x, depth + 1)}`);
      return `{ ${entries.join(", ")} }`;
    } finally {
      seen.delete(v);
    }
  };

  (["log", "info", "warn", "error", "debug", "table"] as const).forEach((level) => {
    const original = console[level].bind(console);
    (console as unknown as Record<string, (...a: unknown[]) => void>)[level] = (...args: unknown[]) => {
      original(...args);
      post({ type: "console", level: level === "debug" || level === "table" ? "log" : level, text: args.map((a) => fmt(a)).join(" ") });
    };
  });

  window.addEventListener("error", (e) => post({ type: "error", message: e.message || String(e.error) }));
  window.addEventListener("unhandledrejection", (e) => {
    const r = (e as PromiseRejectionEvent).reason;
    post({ type: "error", message: `Uncaught (in promise) ${r instanceof Error ? `${r.name}: ${r.message}` : fmt(r)}` });
  });

  // Loop guard
  let loopStart = 0;
  let loopCount = 0;
  (window as unknown as Record<string, unknown>).__acsLoopGuard = () => {
    const now = performance.now();
    if (now - loopStart > 50) {
      loopStart = now;
      loopCount = 0;
    }
    loopCount++;
    if (loopCount % 1000 === 0 && performance.now() - loopStart > 3000) {
      throw new Error("Execution stopped: a loop ran for more than 3 seconds (possible infinite loop).");
    }
  };

  // ---------------- Mock API (clearly labelled) ----------------
  type Ev = Record<string, unknown> & { id: number };
  const db = {
    categories: [
      { id: 1, name: "Technology" },
      { id: 2, name: "Sports" },
      { id: 3, name: "Music" },
    ],
    events: [
      { id: 1, title: "Campus Tech Conference 2026", description: "Talks on web development and AI.", imageUrl: null, startDate: "2026-12-02T09:00:00", endDate: "2026-12-02T17:00:00", location: "Main Campus Hall", price: 15, capacity: 200, availableTickets: 120, categoryId: 1, categoryName: "Technology" },
      { id: 2, title: "Sports Day", description: "Inter-faculty athletics.", imageUrl: null, startDate: "2026-12-05T10:00:00", endDate: "2026-12-05T16:00:00", location: "University Sports Centre", price: 5, capacity: 500, availableTickets: 480, categoryId: 2, categoryName: "Sports" },
      { id: 3, title: "Winter Music Festival", description: "Student bands and DJs.", imageUrl: null, startDate: "2026-12-10T18:00:00", endDate: "2026-12-10T23:00:00", location: "Student Union", price: 12, capacity: 300, availableTickets: 0, categoryId: 3, categoryName: "Music" },
    ] as Ev[],
    courses: [
      { id: 1, title: "Advanced Client-Side Development" },
      { id: 2, title: "Database Systems" },
      { id: 3, title: "Software Engineering" },
      { id: 4, title: "Algorithms" },
    ],
  };
  let nextId = 4;
  const failNext = { value: false };
  (window as unknown as Record<string, unknown>).mockApi = {
    db,
    failNextRequest: () => {
      failNext.value = true;
    },
  };

  const json = (status: number, body: unknown, extraHeaders: Record<string, string> = {}) =>
    new Response(status === 204 ? null : JSON.stringify(body), {
      status,
      headers: status === 204 ? extraHeaders : { "Content-Type": "application/json", ...extraHeaders },
    });

  window.fetch = (input: RequestInfo | URL, init: RequestInit = {}) => {
    const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
    const method = (init.method ?? "GET").toUpperCase();
    const signal = init.signal;
    const u = new URL(url, "http://mock.local");
    const isMock = u.pathname.startsWith("/api/") && (u.host === "mock.local" || u.hostname === "localhost" || u.hostname === "example.com");
    if (!isMock) {
      return Promise.reject(new TypeError(`Failed to fetch: network access is disabled in the sandbox (${url}). Use /api/events, /api/categories or https://example.com/api/courses (mock API).`));
    }
    return new Promise<Response>((resolve, reject) => {
      if (signal?.aborted) {
        reject(new DOMException("The operation was aborted.", "AbortError"));
        return;
      }
      const delay = 500 + Math.random() * 400;
      const timer = setTimeout(() => {
        const path = u.pathname.replace(/\/+$/, "");
        let res: Response;
        const auth = new Headers(init.headers).get("Authorization");
        let body: Record<string, unknown> = {};
        try {
          body = init.body ? JSON.parse(String(init.body)) : {};
        } catch {
          body = {};
        }
        const m = /^\/api\/events\/(\d+)$/.exec(path);
        const users: Record<string, { password: string; role: string; firstName: string; token: string }> = {
          "admin@example.com": { password: "Password123", role: "ADMIN", firstName: "Admin", token: "fake-admin-token" },
          "user@example.com": { password: "Password123", role: "USER", firstName: "Student", token: "fake-user-token" },
        };
        if (failNext.value) {
          failNext.value = false;
          res = json(500, { title: "Internal Server Error" });
        } else if (path === "/api/auth/login" && method === "POST") {
          const u = users[String(body.email ?? "").toLowerCase()];
          res = u && u.password === body.password
            ? json(200, { token: u.token, expiresAt: new Date(Date.now() + 3600_000).toISOString(), userId: "u-" + u.role.toLowerCase(), email: body.email, firstName: u.firstName, lastName: "Demo", role: u.role })
            : json(401, { message: "Invalid email or password." });
        } else if (path === "/api/auth/register" && method === "POST") {
          res = !body.email || String(body.password ?? "").length < 8 ? json(400, { message: "Email and an 8+ character password are required." }) : json(200, { message: "User registered successfully." });
        } else if (path === "/api/courses" && method === "GET") res = json(200, db.courses);
        else if (path === "/api/categories" && method === "GET") res = json(200, db.categories);
        else if (path === "/api/events" && method === "GET") {
          const q = u.searchParams.get("search")?.toLowerCase();
          res = json(200, q ? db.events.filter((e) => String(e.title).toLowerCase().includes(q)) : db.events);
        } else if (m && method === "GET") {
          const ev = db.events.find((e) => e.id === Number(m[1]));
          res = ev ? json(200, ev) : json(404, { title: "Not Found" });
        } else if ((path === "/api/events" && method === "POST") || (m && (method === "PUT" || method === "DELETE"))) {
          if (!auth?.startsWith("Bearer ")) res = json(401, { title: "Unauthorized" });
          else if (!auth.includes("admin")) res = json(403, { title: "Forbidden" });
          else if (method === "POST") {
            if (!body.title || !String(body.title).trim()) res = json(400, { errors: { Title: ["The Title field is required."] } });
            else {
              const cat = db.categories.find((c) => c.id === Number(body.categoryId));
              const ev: Ev = { ...body, id: nextId++, categoryName: cat?.name ?? "Unknown", availableTickets: body.capacity };
              db.events.push(ev);
              res = json(201, ev, { Location: `/api/events/${ev.id}` });
            }
          } else {
            const idx = db.events.findIndex((e) => e.id === Number(m![1]));
            if (idx === -1) res = json(404, { title: "Not Found" });
            else if (method === "PUT") {
              db.events[idx] = { ...db.events[idx], ...body, id: db.events[idx].id };
              res = json(204, null);
            } else {
              db.events.splice(idx, 1);
              res = json(204, null);
            }
          }
        } else res = json(404, { title: "Not Found" });
        post({ type: "network", method, url, status: res.status });
        resolve(res);
      }, delay);
      signal?.addEventListener("abort", () => {
        clearTimeout(timer);
        post({ type: "network", method, url, status: 0, aborted: true });
        reject(new DOMException("The operation was aborted.", "AbortError"));
      });
    });
  };

  // ---------------- Module system ----------------
  const registry = (window as unknown as { __acsModules: Record<string, unknown> }).__acsModules;
  const cache: Record<string, { exports: Record<string, unknown> }> = {};
  const normalize = (from: string, req: string) => {
    const base = from.split("/").slice(0, -1);
    for (const part of req.split("/")) {
      if (part === "." || part === "") continue;
      if (part === "..") base.pop();
      else base.push(part);
    }
    return base.join("/");
  };
  const resolve = (from: string, req: string) => {
    const p = normalize(from, req);
    const candidates = [p, `${p}.tsx`, `${p}.ts`, `${p}.jsx`, `${p}.js`, `${p}/index.tsx`, `${p}/index.ts`, `${p}/index.js`];
    return candidates.find((c) => c in modules) ?? (req.endsWith(".css") ? "__css__" : null);
  };
  const load = (path: string): Record<string, unknown> => {
    if (cache[path]) return cache[path].exports;
    const module = { exports: {} as Record<string, unknown> };
    cache[path] = module;
    const fn = new Function("require", "module", "exports", modules[path]);
    fn(makeRequire(path), module, module.exports);
    return module.exports;
  };
  const makeRequire = (from: string) => (req: string) => {
    if (registry[req]) return registry[req];
    if (req.startsWith(".")) {
      const p = resolve(from, req);
      if (p === "__css__") return {};
      if (!p) throw new Error(`Cannot find module '${req}' (from ${from})`);
      return load(p);
    }
    throw new Error(`Module '${req}' is not available in the sandbox. Available: ${Object.keys(registry).join(", ")}`);
  };

  try {
    const exp = load(entry);
    const root = document.getElementById("root");
    const Default = exp.default;
    if (autoRender && typeof Default === "function" && root && !root.hasChildNodes()) {
      const React = registry.react as { createElement: (c: unknown) => unknown };
      const client = registry["react-dom/client"] as { createRoot: (el: Element) => { render: (n: unknown) => void } };
      client.createRoot(root).render(React.createElement(Default));
    }
    post({ type: "ready" });
  } catch (e) {
    const err = e as Error;
    post({ type: "error", message: `${err.name}: ${err.message}` });
  }
}

export function buildSrcDoc(opts: {
  runId: string;
  runtime: string;
  compiled: CompileResult;
  entry: string;
  autoRender: boolean;
}): string {
  const { runId, runtime, compiled, entry, autoRender } = opts;
  const csp = "default-src 'none'; script-src 'unsafe-inline' 'unsafe-eval'; style-src 'unsafe-inline'; img-src data: blob:; font-src data:;";
  const safeJson = (v: unknown) => JSON.stringify(v).replace(/</g, "\\u003c");
  return `<!doctype html><html><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="${csp}">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>body{font-family:system-ui,-apple-system,Segoe UI,sans-serif;margin:12px;color:#18181b;background:#fff;line-height:1.5}button{cursor:pointer}${compiled.css.replace(/<\/style/gi, "<\\/style")}</style>
</head><body>${compiled.html}${compiled.html.includes('id="root"') ? "" : '<div id="root"></div>'}
<script>${runtime.replace(/<\/script/gi, "<\\/script")}</script>
<script>(${sandboxBootstrap.toString()})(${safeJson(runId)}, ${safeJson(compiled.modules)}, ${safeJson(entry)}, ${autoRender});</script>
</body></html>`;
}

let runtimeCache: Promise<string> | null = null;
export function loadRuntime(): Promise<string> {
  runtimeCache ??= fetch(`${import.meta.env.BASE_URL}sandbox-runtime.js`).then((r) => {
    if (!r.ok) throw new Error(`Sandbox runtime missing (HTTP ${r.status}). Run "npm run build:runtime".`);
    return r.text();
  });
  return runtimeCache;
}
