import { transform } from "sucrase";
import type { ChallengeTest } from "@/content/types";
import { instrumentLoops } from "./sandbox";

export interface TestOutcome {
  name: string;
  hidden: boolean;
  passed: boolean;
  message?: string;
  durationMs: number;
}

export interface RunReport {
  outcomes: TestOutcome[];
  logs: string[];
  compileError?: string;
  timedOut?: boolean;
}

/**
 * Worker source. Learner code + each test run inside a dedicated Web Worker:
 * no DOM, no access to the app's state, and the worker is terminated after
 * a timeout so infinite loops cannot freeze the app.
 */
const WORKER_SRC = String.raw`
const __logs = [];
const __fmt = (v) => { try { return typeof v === 'string' ? v : JSON.stringify(v, (k, x) => x === undefined ? '__undefined__' : x)?.replaceAll('"__undefined__"', 'undefined') ?? String(v); } catch { return String(v); } };
['log','info','warn','error'].forEach((l) => { console[l] = (...a) => { if (__logs.length < 200) __logs.push((l === 'log' ? '' : '[' + l + '] ') + a.map(__fmt).join(' ')); }; });
function __deepEqual(a, b) {
  if (Object.is(a, b)) return true;
  if (typeof a !== typeof b || a === null || b === null || typeof a !== 'object') return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  if (a instanceof Map && b instanceof Map) return a.size === b.size && [...a].every(([k, v]) => b.has(k) && __deepEqual(v, b.get(k)));
  if (a instanceof Set && b instanceof Set) return a.size === b.size && [...a].every((v) => b.has(v));
  const ka = Object.keys(a), kb = Object.keys(b);
  if (ka.length !== kb.length) return false;
  return ka.every((k) => Object.prototype.hasOwnProperty.call(b, k) && __deepEqual(a[k], b[k]));
}
class AssertionError extends Error { constructor(m) { super(m); this.name = 'AssertionError'; } }
function assertEqual(actual, expected, message) {
  if (!__deepEqual(actual, expected)) throw new AssertionError((message ? message + ' — ' : '') + 'expected ' + __fmt(expected) + ' but received ' + __fmt(actual));
}
function assert(cond, message) { if (!cond) throw new AssertionError(message || 'assertion failed'); }
let __loopStart = 0, __loopCount = 0;
function __acsLoopGuard() { const n = performance.now(); if (n - __loopStart > 50) { __loopStart = n; __loopCount = 0; } if (++__loopCount % 1000 === 0 && performance.now() - __loopStart > 2500) throw new Error('Possible infinite loop: a loop ran for more than 2.5 seconds.'); }
// Remove network / storage capabilities before learner code runs (tests may install their own fetch mock).
self.fetch = async () => { throw new TypeError('Network access is disabled in challenges. Tests provide a mock fetch where needed.'); };
self.XMLHttpRequest = undefined; self.importScripts = undefined; self.indexedDB = undefined; self.WebSocket = undefined;
const __AsyncFunction = (async () => {}).constructor;
self.onmessage = async (e) => {
  const { code, tests } = e.data;
  const results = [];
  for (const t of tests) {
    const start = performance.now();
    const realFetch = self.fetch;
    try {
      const fn = new __AsyncFunction('assertEqual', 'assert', '__acsLoopGuard', code + '\n;\n' + t.code);
      await Promise.race([
        fn(assertEqual, assert, __acsLoopGuard),
        new Promise((_, rej) => setTimeout(() => rej(new Error('Test timed out after 3 s (did you forget to resolve a promise?)')), 3000)),
      ]);
      results.push({ name: t.name, hidden: !!t.hidden, passed: true, durationMs: performance.now() - start });
    } catch (err) {
      results.push({ name: t.name, hidden: !!t.hidden, passed: false, message: (err && err.name ? err.name + ': ' : '') + (err && err.message ? err.message : String(err)), durationMs: performance.now() - start });
    } finally { self.fetch = realFetch; }
  }
  self.postMessage({ results, logs: __logs });
};
`;

export function prepareCode(code: string, language: "js" | "ts"): string {
  const out = transform(code, { transforms: language === "ts" ? ["typescript"] : [], disableESTransforms: true });
  return instrumentLoops(out.code);
}

export function runTests(code: string, language: "js" | "ts", tests: ChallengeTest[], timeoutMs = 15000): Promise<RunReport> {
  let prepared: string;
  try {
    prepared = prepareCode(code, language);
  } catch (e) {
    return Promise.resolve({ outcomes: [], logs: [], compileError: e instanceof Error ? e.message : String(e) });
  }
  return new Promise((resolve) => {
    const blob = new Blob([WORKER_SRC], { type: "text/javascript" });
    const url = URL.createObjectURL(blob);
    const worker = new Worker(url);
    const done = (r: RunReport) => {
      clearTimeout(timer);
      worker.terminate();
      URL.revokeObjectURL(url);
      resolve(r);
    };
    const timer = setTimeout(
      () =>
        done({
          outcomes: tests.map((t) => ({ name: t.name, hidden: !!t.hidden, passed: false, message: "Stopped: execution exceeded the time limit.", durationMs: timeoutMs })),
          logs: [],
          timedOut: true,
        }),
      timeoutMs,
    );
    worker.onmessage = (e: MessageEvent<{ results: TestOutcome[]; logs: string[] }>) => done({ outcomes: e.data.results, logs: e.data.logs });
    worker.onerror = (e) => {
      e.preventDefault();
      done({ outcomes: [], logs: [], compileError: e.message || "Syntax error in your code." });
    };
    worker.postMessage({ code: prepared, tests: tests.map((t) => ({ name: t.name, code: t.code, hidden: t.hidden })) });
  });
}
