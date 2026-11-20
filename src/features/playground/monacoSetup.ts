import * as monaco from "monaco-editor";
import { loader } from "@monaco-editor/react";
import EditorWorker from "monaco-editor/editor/editor.worker?worker";
import TsWorker from "monaco-editor/languages/features/typescript/ts.worker?worker";
import CssWorker from "monaco-editor/languages/features/css/css.worker?worker";
import HtmlWorker from "monaco-editor/languages/features/html/html.worker?worker";
import JsonWorker from "monaco-editor/languages/features/json/json.worker?worker";

/** Monaco is bundled locally (no CDN) so the playground works offline. */
self.MonacoEnvironment = {
  getWorker(_id: string, label: string) {
    if (label === "typescript" || label === "javascript") return new TsWorker();
    if (label === "css" || label === "scss" || label === "less") return new CssWorker();
    if (label === "html") return new HtmlWorker();
    if (label === "json") return new JsonWorker();
    return new EditorWorker();
  },
};

const ts = monaco.typescript;
const compilerOptions = {
  target: ts.ScriptTarget.ES2020,
  module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.NodeJs,
  jsx: ts.JsxEmit.ReactJSX,
  strict: true,
  esModuleInterop: true,
  allowNonTsExtensions: true,
  allowJs: true,
  noEmit: true,
  skipLibCheck: true,
};
ts.typescriptDefaults.setCompilerOptions(compilerOptions);
ts.javascriptDefaults.setCompilerOptions({ ...compilerOptions, strict: false, checkJs: false });
ts.typescriptDefaults.setDiagnosticsOptions({ noSemanticValidation: false, noSyntaxValidation: false });

/**
 * Lightweight ambient declarations so imports of the sandbox libraries type-check
 * without shipping full .d.ts files. They are intentionally loose (any-typed);
 * full library typings are documented as a known limitation.
 */
const AMBIENT = `
declare module "react" {
  export function useState<S>(initial: S | (() => S)): [S, (value: S | ((prev: S) => S)) => void];
  export function useState<S = undefined>(): [S | undefined, (value: S | undefined | ((prev: S | undefined) => S | undefined)) => void];
  export function useEffect(effect: () => void | (() => void), deps?: readonly unknown[]): void;
  export function useLayoutEffect(effect: () => void | (() => void), deps?: readonly unknown[]): void;
  export function useRef<T>(initial: T): { current: T };
  export function useRef<T>(initial: T | null): { current: T | null };
  export function useMemo<T>(factory: () => T, deps: readonly unknown[]): T;
  export function useCallback<T extends (...args: never[]) => unknown>(fn: T, deps: readonly unknown[]): T;
  export function useReducer<S, A>(reducer: (state: S, action: A) => S, initial: S): [S, (action: A) => void];
  export function useContext<T>(ctx: Context<T>): T;
  export function useId(): string;
  export interface Context<T> { Provider: any; Consumer: any; _t?: T }
  export function createContext<T>(defaultValue: T): Context<T>;
  export function memo<T>(c: T): T;
  export function lazy<T>(f: () => Promise<{ default: T }>): T;
  export const Fragment: any; export const StrictMode: any; export const Suspense: any;
  export type ReactNode = any;
  export type FormEvent<T = Element> = { preventDefault(): void; currentTarget: T; target: any };
  export type ChangeEvent<T = Element> = { target: T & { value: string; checked: boolean; name: string }; currentTarget: T };
  export type MouseEvent<T = Element> = { preventDefault(): void; currentTarget: T; target: any };
  export type KeyboardEvent<T = Element> = { key: string; preventDefault(): void; currentTarget: T };
  export type PropsWithChildren<P = {}> = P & { children?: ReactNode };
  const React: any; export default React;
}
declare module "react/jsx-runtime" { export const jsx: any; export const jsxs: any; export const Fragment: any; }
declare module "react-dom/client" { export function createRoot(el: Element | null): { render(node: any): void; unmount(): void }; }
declare module "react-router-dom" {
  export const BrowserRouter: any; export const MemoryRouter: any; export const HashRouter: any; export const Routes: any; export const Route: any;
  export const Link: any; export const NavLink: any; export const Navigate: any; export const Outlet: any;
  export function useNavigate(): (to: string | number, options?: { replace?: boolean; state?: unknown }) => void;
  export function useParams<T extends Record<string, string | undefined> = Record<string, string | undefined>>(): T;
  export function useLocation(): { pathname: string; search: string; hash: string; state: unknown; key: string };
  export function useSearchParams(): [URLSearchParams, (next: Record<string, string> | URLSearchParams | ((prev: URLSearchParams) => URLSearchParams)) => void];
  export function createBrowserRouter(routes: any[]): any; export function createMemoryRouter(routes: any[], opts?: any): any; export const RouterProvider: any;
}
declare module "zustand" { export function create<T>(): (init: (set: (partial: Partial<T> | ((s: T) => Partial<T>)) => void, get: () => T) => T) => { <U>(selector: (s: T) => U): U; (): T; getState(): T; setState(p: Partial<T> | ((s: T) => Partial<T>)): void; subscribe(l: (s: T, prev: T) => void): () => void }; export function create<T>(init: (set: (partial: Partial<T> | ((s: T) => Partial<T>)) => void, get: () => T) => T): { <U>(selector: (s: T) => U): U; (): T; getState(): T; setState(p: Partial<T> | ((s: T) => Partial<T>)): void; subscribe(l: (s: T, prev: T) => void): () => void }; }
declare module "zustand/middleware" { export const persist: any; export const devtools: any; export const createJSONStorage: any; }
declare module "zustand/react/shallow" { export function useShallow<S, U>(selector: (s: S) => U): (s: S) => U; }
declare module "@tanstack/react-query" {
  export class QueryClient { constructor(opts?: any); invalidateQueries(f?: { queryKey?: readonly unknown[]; exact?: boolean }): Promise<void>; setQueryData<T>(key: readonly unknown[], updater: T | ((old: T | undefined) => T)): void; getQueryData<T>(key: readonly unknown[]): T | undefined; }
  export const QueryClientProvider: any;
  export function useQueryClient(): QueryClient;
  export function useQuery<T>(opts: { queryKey: readonly unknown[]; queryFn: (ctx: { signal: AbortSignal }) => Promise<T>; staleTime?: number; gcTime?: number; enabled?: boolean; retry?: number | boolean; refetchOnWindowFocus?: boolean; select?: (d: T) => any; placeholderData?: any }): { data: T | undefined; error: Error | null; status: "pending" | "error" | "success"; fetchStatus: "fetching" | "paused" | "idle"; isPending: boolean; isLoading: boolean; isFetching: boolean; isError: boolean; isSuccess: boolean; refetch(): Promise<unknown> };
  export function useMutation<TData, TVars>(opts: { mutationFn: (v: TVars) => Promise<TData>; onSuccess?: (d: TData, v: TVars) => unknown; onError?: (e: Error, v: TVars) => unknown; onSettled?: () => unknown }): { mutate(v: TVars): void; mutateAsync(v: TVars): Promise<TData>; isPending: boolean; isError: boolean; isSuccess: boolean; error: Error | null; data: TData | undefined; reset(): void };
  export const keepPreviousData: any;
}
declare module "zod" { export const z: any; export default z; }
declare const mockApi: { db: any; failNextRequest(): void };
declare namespace JSX { interface IntrinsicElements { [el: string]: any } interface Element {} }
`;
ts.typescriptDefaults.addExtraLib(AMBIENT, "file:///acs-ambient.d.ts");
ts.javascriptDefaults.addExtraLib(AMBIENT, "file:///acs-ambient.d.ts");

loader.config({ monaco });

export { monaco };
