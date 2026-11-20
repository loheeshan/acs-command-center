/**
 * Bundled into public/sandbox-runtime.js (IIFE) and inlined into the sandboxed
 * preview iframe. Exposes real library modules to learner code via `require()`.
 */
import * as React from "react";
import * as ReactDOM from "react-dom";
import * as ReactDOMClient from "react-dom/client";
import * as JsxRuntime from "react/jsx-runtime";
import * as ReactRouterDom from "react-router-dom";
import * as Zustand from "zustand";
import * as ZustandMiddleware from "zustand/middleware";
import * as ZustandShallow from "zustand/react/shallow";
import * as ReactQuery from "@tanstack/react-query";
import * as Zod from "zod";

(globalThis as unknown as { __acsModules: Record<string, unknown> }).__acsModules = {
  react: React,
  "react-dom": ReactDOM,
  "react-dom/client": ReactDOMClient,
  "react/jsx-runtime": JsxRuntime,
  "react/jsx-dev-runtime": JsxRuntime,
  "react-router-dom": ReactRouterDom,
  "react-router": ReactRouterDom,
  zustand: Zustand,
  "zustand/middleware": ZustandMiddleware,
  "zustand/react/shallow": ZustandShallow,
  "@tanstack/react-query": ReactQuery,
  zod: Zod,
};
