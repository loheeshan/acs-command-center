// Builds the library runtime that the sandboxed playground iframe executes.
import { build } from "esbuild";

await build({
  entryPoints: ["src/sandbox/runtime-entry.ts"],
  bundle: true,
  format: "iife",
  minify: true,
  target: "es2020",
  define: { "process.env.NODE_ENV": '"development"' },
  outfile: "public/sandbox-runtime.js",
  logLevel: "warning",
});
console.log("sandbox runtime built → public/sandbox-runtime.js");
