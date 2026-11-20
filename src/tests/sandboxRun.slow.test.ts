// @vitest-environment node
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { JSDOM } from "jsdom";
import { buildSrcDoc, compileProject } from "@/features/playground/sandbox";
import { PRESETS } from "@/features/playground/presets";

const runtime = readFileSync("public/sandbox-runtime.js", "utf8");

async function runInSandbox(files: Record<string, string>, entry: string, waitMs = 1600) {
  const html = buildSrcDoc({ runId: "t", runtime, compiled: compileProject(files), entry, autoRender: false });
  const messages: { type: string; level?: string; text?: string; message?: string; status?: number }[] = [];
  const dom = new JSDOM(html, {
    runScripts: "dangerously",
    pretendToBeVisual: true,
    beforeParse(win) {
      // In the real app `parent` is the host window; here we capture what the sandbox posts.
      Object.defineProperty(win, "parent", { value: { postMessage: (m: never) => messages.push(m) } });
      (win as unknown as { Response: typeof Response; Headers: typeof Headers }).Response = Response;
      (win as unknown as { Headers: typeof Headers }).Headers = Headers;
    },
  });
  await new Promise((r) => setTimeout(r, waitMs));
  const body = dom.window.document.body.textContent ?? "";
  dom.window.close();
  return { messages, body };
}

describe("playground presets execute for real in the sandbox document", () => {
  for (const p of PRESETS) {
    it(p.id, async () => {
      const { messages, body } = await runInSandbox(p.files, p.entry);
      const errors = messages.filter((m) => m.type === "error");
      expect(errors, JSON.stringify(errors)).toEqual([]);
      expect(messages.some((m) => m.type === "ready")).toBe(true);
      if (p.files["main.tsx"]) expect(body.trim().length).toBeGreaterThan(0);
    }, 10000);
  }

  it("event-loop preset logs in the correct order (real execution)", async () => {
    const p = PRESETS.find((x) => x.id === "js-event-loop")!;
    const { messages } = await runInSandbox(p.files, p.entry, 300);
    const logs = messages.filter((m) => m.type === "console").map((m) => m.text!.split(":")[0]);
    expect(logs).toEqual(["1", "2", "2b", "3", "4", "5", "6"]);
  });

  it("mock API answers fetch and reports network activity", async () => {
    const p = PRESETS.find((x) => x.id === "react-useeffect-fetch")!;
    const { messages, body } = await runInSandbox(p.files, p.entry, 1800);
    expect(messages.some((m) => m.type === "network" && m.status === 200)).toBe(true);
    expect(body).toContain("Campus Tech Conference 2026");
  });

  it("stops an infinite loop instead of hanging", async () => {
    const { messages } = await runInSandbox({ "index.js": "let i = 0; while (true) { i++; }" }, "index.js", 200);
    expect(messages.find((m) => m.type === "error")?.message).toMatch(/infinite loop/);
  }, 15000);
});
