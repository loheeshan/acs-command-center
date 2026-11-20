import type { Challenge } from "../types";

/**
 * Auto-graded coding challenges.
 *
 * Runtime contract: learner code runs in a Web Worker as a classic script
 * (no import/export, no DOM). "ts" code is transpiled with Sucrase (types
 * stripped). Each test runs `learnerCode` + test `code` inside one async
 * function, with `assertEqual(actual, expected, message?)` and
 * `assert(condition, message?)` available.
 */
export const challenges: Challenge[] = [
  /* ================================================================ */
  /* JavaScript                                                        */
  /* ================================================================ */
  {
    id: "ch-js-basket-total",
    topic: "javascript",
    title: "Basket total with reduce",
    difficulty: "beginner",
    scenario:
      "The campus shop shows a basket summary. Each basket line has a `price` (per item) and a `quantity`. Calculate the total the student pays.",
    requirements: [
      "Implement `basketTotal(items)` using `Array.prototype.reduce`.",
      "Each line contributes `price * quantity`.",
      "Return `0` for an empty basket (pass an initial value to reduce!).",
      "Round the result to 2 decimal places with `Math.round(total * 100) / 100`.",
    ],
    language: "js",
    starterCode: `function basketTotal(items) {
  // TODO: use items.reduce((sum, item) => ..., 0)
}
`,
    examples: `\`\`\`js
basketTotal([
  { name: "Notebook", price: 2.5, quantity: 4 },
  { name: "Hoodie", price: 30, quantity: 1 },
]); // 40
basketTotal([]); // 0
\`\`\``,
    tests: [
      {
        name: "sums price * quantity",
        code: `assertEqual(basketTotal([
  { name: "Notebook", price: 2.5, quantity: 4 },
  { name: "Hoodie", price: 30, quantity: 1 },
]), 40);`,
      },
      {
        name: "single item with quantity 3",
        code: `assertEqual(basketTotal([{ name: "Pen", price: 1.2, quantity: 3 }]), 3.6);`,
      },
      {
        name: "empty basket returns 0",
        code: `assertEqual(basketTotal([]), 0);`,
      },
      {
        name: "floating point result is rounded to 2 dp",
        hidden: true,
        code: `assertEqual(basketTotal([
  { name: "Mug", price: 19.99, quantity: 2 },
  { name: "Sticker", price: 0.1, quantity: 3 },
]), 40.28);`,
      },
      {
        name: "quantity 0 contributes nothing",
        hidden: true,
        code: `assertEqual(basketTotal([{ name: "Cap", price: 12, quantity: 0 }, { name: "Pin", price: 2, quantity: 1 }]), 2);`,
      },
    ],
    hints: [
      "`reduce` takes a callback `(accumulator, currentItem) => newAccumulator` and an initial value.",
      "Start the accumulator at `0`, then add `item.price * item.quantity` each step.",
      "`const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0); return Math.round(total * 100) / 100;`",
    ],
    solution: `function basketTotal(items) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return Math.round(total * 100) / 100;
}
`,
    explanation:
      "`reduce` walks the array carrying an accumulator. With the initial value `0`, an empty array simply returns `0` (without it, `reduce` on an empty array throws a TypeError). Money in floating point is imprecise (`0.1 * 3` is `0.30000000000000004`), so we round to pence at the end. Real shops often store prices in integer pence to avoid this entirely.",
    lessonId: "js-array-reduce",
  },
  {
    id: "ch-js-filter-products",
    topic: "javascript",
    title: "Filter products by category and max price",
    difficulty: "beginner",
    scenario:
      "The shop page has a category dropdown and a 'max price' slider. Return only the products that match both filters.",
    requirements: [
      "Implement `filterProducts(products, category, maxPrice)`.",
      "Keep products whose `category` equals `category` AND whose `price <= maxPrice`.",
      "The special category `\"all\"` matches every category.",
      "Return a NEW array; do not modify `products`.",
    ],
    language: "js",
    starterCode: `function filterProducts(products, category, maxPrice) {
  // TODO: return products.filter(...)
  return products;
}
`,
    examples: `\`\`\`js
const products = [
  { id: 1, name: "Hoodie", category: "clothing", price: 30 },
  { id: 2, name: "Mug", category: "homeware", price: 8 },
  { id: 3, name: "Cap", category: "clothing", price: 12 },
];
filterProducts(products, "clothing", 20); // [{ id: 3, ... }]
filterProducts(products, "all", 10);      // [{ id: 2, ... }]
\`\`\``,
    tests: [
      {
        name: "filters by category and max price",
        code: `const products = [
  { id: 1, name: "Hoodie", category: "clothing", price: 30 },
  { id: 2, name: "Mug", category: "homeware", price: 8 },
  { id: 3, name: "Cap", category: "clothing", price: 12 },
];
assertEqual(filterProducts(products, "clothing", 20).map(p => p.id), [3]);`,
      },
      {
        name: '"all" ignores category',
        code: `const products = [
  { id: 1, name: "Hoodie", category: "clothing", price: 30 },
  { id: 2, name: "Mug", category: "homeware", price: 8 },
  { id: 3, name: "Cap", category: "clothing", price: 12 },
];
assertEqual(filterProducts(products, "all", 12).map(p => p.id), [2, 3]);`,
      },
      {
        name: "price equal to max is included",
        code: `const products = [{ id: 7, name: "Lanyard", category: "accessories", price: 5 }];
assertEqual(filterProducts(products, "accessories", 5).map(p => p.id), [7]);`,
      },
      {
        name: "returns a new array and does not mutate",
        hidden: true,
        code: `const products = Object.freeze([
  Object.freeze({ id: 1, name: "Hoodie", category: "clothing", price: 30 }),
]);
const result = filterProducts(products, "all", 100);
assert(result !== products, "should return a new array");
assertEqual(result.length, 1);`,
      },
      {
        name: "no matches returns empty array",
        hidden: true,
        code: `assertEqual(filterProducts([{ id: 1, name: "Hoodie", category: "clothing", price: 30 }], "books", 100), []);`,
      },
    ],
    hints: [
      "`filter` keeps the items for which your callback returns `true` and always returns a new array.",
      "Build two booleans: `matchesCategory` and `withinBudget`, then return `matchesCategory && withinBudget`.",
      "`const matchesCategory = category === \"all\" || p.category === category;`",
    ],
    solution: `function filterProducts(products, category, maxPrice) {
  return products.filter((p) => {
    const matchesCategory = category === "all" || p.category === category;
    const withinBudget = p.price <= maxPrice;
    return matchesCategory && withinBudget;
  });
}
`,
    explanation:
      "`filter` is non-mutating: it creates a new array containing the original object references that pass the predicate. Naming the two conditions makes the logic readable, and the `\"all\"` short-circuit avoids a separate code path. In React this is classic *derived data*: compute it during render from props/state rather than storing a second filtered copy in state.",
    lessonId: "js-array-methods",
  },
  {
    id: "ch-js-find-by-id",
    topic: "javascript",
    title: "findById for a details page",
    difficulty: "beginner",
    scenario:
      "A details route such as `/events/:eventId` gives you the id as a STRING (route params are always strings). Find the matching event in an array of events with numeric ids.",
    requirements: [
      "Implement `findById(items, id)`.",
      "`id` may be a number or a numeric string (like `useParams()` gives); compare as numbers.",
      "Return the matching item, or `undefined` when nothing matches (do not throw).",
    ],
    language: "js",
    starterCode: `function findById(items, id) {
  // TODO: use items.find(...)
  return null;
}
`,
    examples: `\`\`\`js
const events = [{ id: 1, title: "Jazz Night" }, { id: 2, title: "Hackathon" }];
findById(events, 2);   // { id: 2, title: "Hackathon" }
findById(events, "1"); // { id: 1, title: "Jazz Night" }
findById(events, 99);  // undefined
\`\`\``,
    tests: [
      {
        name: "finds by numeric id",
        code: `const events = [{ id: 1, title: "Jazz Night" }, { id: 2, title: "Hackathon" }];
assertEqual(findById(events, 2), { id: 2, title: "Hackathon" });`,
      },
      {
        name: "finds by string id from route params",
        code: `const events = [{ id: 1, title: "Jazz Night" }, { id: 2, title: "Hackathon" }];
assertEqual(findById(events, "1"), { id: 1, title: "Jazz Night" });`,
      },
      {
        name: "returns undefined when missing",
        code: `const events = [{ id: 1, title: "Jazz Night" }];
assert(findById(events, 99) === undefined, "expected undefined for a missing id");`,
      },
      {
        name: "empty array returns undefined",
        hidden: true,
        code: `assert(findById([], "5") === undefined, "expected undefined for an empty array");`,
      },
      {
        name: "returns the same object reference (not a copy)",
        hidden: true,
        code: `const target = { id: 3, title: "Career Fair" };
const events = [{ id: 1, title: "A" }, target];
assert(findById(events, "3") === target, "find returns the original reference");`,
      },
    ],
    hints: [
      "`Array.prototype.find` returns the first matching element or `undefined`.",
      "`\"2\" === 2` is `false`. Convert the id first with `Number(id)`.",
      "`const wanted = Number(id); return items.find((item) => item.id === wanted);`",
    ],
    solution: `function findById(items, id) {
  const wanted = Number(id);
  return items.find((item) => item.id === wanted);
}
`,
    explanation:
      "`find` stops at the first match and returns `undefined` when there is none, so callers can render a 'Not found' state. Route params from React Router's `useParams()` are strings, so comparing them with `===` against numeric ids silently fails. Converting once with `Number(id)` fixes that. `find` returns the original object reference, not a copy.",
    lessonId: "js-array-methods",
  },
  {
    id: "ch-js-sort-by-price",
    topic: "javascript",
    title: "Sort products by price without mutating",
    difficulty: "intermediate",
    scenario:
      "A 'Sort by price' dropdown must not reorder the original array, because that array is React state (or comes from the TanStack Query cache) and must be treated as immutable.",
    requirements: [
      "Implement `sortByPrice(products, direction = \"asc\")`.",
      "`direction` is `\"asc\"` (cheapest first) or `\"desc\"` (most expensive first).",
      "Return a NEW sorted array; the input array must be unchanged.",
      "Sort numerically (not alphabetically).",
    ],
    language: "js",
    starterCode: `function sortByPrice(products, direction = "asc") {
  // TODO: copy first, then sort with a numeric comparator
  return products.sort();
}
`,
    examples: `\`\`\`js
const items = [{ name: "A", price: 10 }, { name: "B", price: 2 }, { name: "C", price: 100 }];
sortByPrice(items).map((p) => p.price);         // [2, 10, 100]
sortByPrice(items, "desc").map((p) => p.price); // [100, 10, 2]
items.map((p) => p.price);                      // [10, 2, 100] (unchanged)
\`\`\``,
    tests: [
      {
        name: "ascending numeric sort",
        code: `const items = [{ name: "A", price: 10 }, { name: "B", price: 2 }, { name: "C", price: 100 }];
assertEqual(sortByPrice(items).map(p => p.price), [2, 10, 100]);`,
      },
      {
        name: "descending sort",
        code: `const items = [{ name: "A", price: 10 }, { name: "B", price: 2 }, { name: "C", price: 100 }];
assertEqual(sortByPrice(items, "desc").map(p => p.price), [100, 10, 2]);`,
      },
      {
        name: "original array is not mutated",
        code: `const items = [{ name: "A", price: 10 }, { name: "B", price: 2 }, { name: "C", price: 100 }];
const result = sortByPrice(items);
assert(result !== items, "must return a new array");
assertEqual(items.map(p => p.price), [10, 2, 100]);`,
      },
      {
        name: "works on a frozen array",
        hidden: true,
        code: `const items = Object.freeze([{ name: "A", price: 9 }, { name: "B", price: 1 }]);
assertEqual(sortByPrice(items).map(p => p.name), ["B", "A"]);`,
      },
      {
        name: "empty array",
        hidden: true,
        code: `assertEqual(sortByPrice([], "desc"), []);`,
      },
    ],
    hints: [
      "`Array.prototype.sort` sorts IN PLACE and, without a comparator, compares values as strings.",
      "Copy first with `[...products]` (or use `toSorted`), then pass `(a, b) => a.price - b.price`.",
      "For descending, flip it: `(a, b) => b.price - a.price`.",
    ],
    solution: `function sortByPrice(products, direction = "asc") {
  const copy = [...products];
  copy.sort((a, b) => (direction === "desc" ? b.price - a.price : a.price - b.price));
  return copy;
}
`,
    explanation:
      "`sort` mutates the array it is called on. Mutating React state or cached query data breaks change detection (the reference stays the same) and can corrupt shared data. Copying with spread (or ES2023 `toSorted`) keeps the original intact. A comparator returning a negative number puts `a` first; `a.price - b.price` gives ascending numeric order, unlike the default string comparison where `\"100\" < \"2\"`.",
    lessonId: "js-references-copies",
  },
  {
    id: "ch-js-group-by-category",
    topic: "javascript",
    title: "Count products per category",
    difficulty: "intermediate",
    scenario:
      "The admin dashboard shows a badge with how many events/products exist in each category.",
    requirements: [
      "Implement `countByCategory(products)` using `reduce`.",
      "Return an object mapping each category name to its count, e.g. `{ music: 2, tech: 1 }`.",
      "An empty array returns `{}`.",
    ],
    language: "js",
    starterCode: `function countByCategory(products) {
  // TODO: reduce into an object of counts
  return {};
}
`,
    examples: `\`\`\`js
countByCategory([
  { title: "Jazz Night", category: "music" },
  { title: "Hackathon", category: "tech" },
  { title: "Open Mic", category: "music" },
]); // { music: 2, tech: 1 }
\`\`\``,
    tests: [
      {
        name: "counts categories",
        code: `assertEqual(countByCategory([
  { title: "Jazz Night", category: "music" },
  { title: "Hackathon", category: "tech" },
  { title: "Open Mic", category: "music" },
]), { music: 2, tech: 1 });`,
      },
      {
        name: "single category",
        code: `assertEqual(countByCategory([{ title: "A", category: "sport" }, { title: "B", category: "sport" }]), { sport: 2 });`,
      },
      {
        name: "empty array gives empty object",
        hidden: true,
        code: `assertEqual(countByCategory([]), {});`,
      },
      {
        name: "does not share state between calls",
        hidden: true,
        code: `countByCategory([{ title: "A", category: "x" }]);
assertEqual(countByCategory([{ title: "B", category: "y" }]), { y: 1 });`,
      },
    ],
    hints: [
      "The initial value of the accumulator should be an empty object `{}`.",
      "For each product, read the current count: `counts[p.category] ?? 0`.",
      "`return products.reduce((counts, p) => { counts[p.category] = (counts[p.category] ?? 0) + 1; return counts; }, {});`",
    ],
    solution: `function countByCategory(products) {
  return products.reduce((counts, p) => {
    counts[p.category] = (counts[p.category] ?? 0) + 1;
    return counts;
  }, {});
}
`,
    explanation:
      "The accumulator does not have to be a number: here it is an object we build up. Because `{}` is created fresh on every call as reduce's initial value, mutating the accumulator inside the callback is safe (no outside data is touched). Always `return` the accumulator from the callback, otherwise the next step receives `undefined`.",
    lessonId: "js-array-reduce",
  },
  {
    id: "ch-js-immutable-cart",
    topic: "javascript",
    title: "Immutable cart: add and update quantity",
    difficulty: "intermediate",
    scenario:
      "Cart state in React (useState / useReducer / Zustand) must be updated immutably so React notices the change.",
    requirements: [
      "Implement `addToCart(cart, product)`: if a line with `product.id` exists, return a new cart where that line's `quantity` is +1; otherwise append `{ id, name, price, quantity: 1 }`.",
      "Implement `updateQuantity(cart, id, quantity)`: return a new cart with that line's quantity set; if `quantity <= 0` remove the line.",
      "Never mutate the input array or its line objects (tests freeze them).",
    ],
    language: "js",
    starterCode: `function addToCart(cart, product) {
  // TODO
  return cart;
}

function updateQuantity(cart, id, quantity) {
  // TODO
  return cart;
}
`,
    examples: `\`\`\`js
let cart = [];
cart = addToCart(cart, { id: 1, name: "Mug", price: 8 });
cart = addToCart(cart, { id: 1, name: "Mug", price: 8 });
// [{ id: 1, name: "Mug", price: 8, quantity: 2 }]
cart = updateQuantity(cart, 1, 0); // []
\`\`\``,
    tests: [
      {
        name: "adds a new line with quantity 1",
        code: `const cart = Object.freeze([]);
assertEqual(addToCart(cart, { id: 1, name: "Mug", price: 8 }), [{ id: 1, name: "Mug", price: 8, quantity: 1 }]);`,
      },
      {
        name: "increments an existing line without mutating",
        code: `const line = Object.freeze({ id: 1, name: "Mug", price: 8, quantity: 1 });
const cart = Object.freeze([line]);
const next = addToCart(cart, { id: 1, name: "Mug", price: 8 });
assertEqual(next, [{ id: 1, name: "Mug", price: 8, quantity: 2 }]);
assert(next !== cart, "new array expected");
assertEqual(line.quantity, 1);`,
      },
      {
        name: "updateQuantity sets quantity",
        code: `const cart = Object.freeze([Object.freeze({ id: 1, name: "Mug", price: 8, quantity: 1 }), Object.freeze({ id: 2, name: "Cap", price: 12, quantity: 1 })]);
assertEqual(updateQuantity(cart, 2, 5), [{ id: 1, name: "Mug", price: 8, quantity: 1 }, { id: 2, name: "Cap", price: 12, quantity: 5 }]);`,
      },
      {
        name: "quantity 0 removes the line",
        hidden: true,
        code: `const cart = Object.freeze([Object.freeze({ id: 1, name: "Mug", price: 8, quantity: 3 })]);
assertEqual(updateQuantity(cart, 1, 0), []);`,
      },
      {
        name: "unchanged lines keep their reference",
        hidden: true,
        code: `const keep = Object.freeze({ id: 1, name: "Mug", price: 8, quantity: 1 });
const cart = Object.freeze([keep, Object.freeze({ id: 2, name: "Cap", price: 12, quantity: 1 })]);
const next = addToCart(cart, { id: 2, name: "Cap", price: 12 });
assert(next[0] === keep, "lines you did not change can be reused");
assertEqual(next[1].quantity, 2);`,
      },
    ],
    hints: [
      "Use `cart.some(line => line.id === product.id)` to know if the product is already there.",
      "Use `map` to produce a new array and spread to copy the changed line: `{ ...line, quantity: line.quantity + 1 }`.",
      "For removal use `filter`. Spread `[...cart, newLine]` appends without mutating.",
    ],
    solution: `function addToCart(cart, product) {
  const exists = cart.some((line) => line.id === product.id);
  if (exists) {
    return cart.map((line) =>
      line.id === product.id ? { ...line, quantity: line.quantity + 1 } : line
    );
  }
  return [...cart, { id: product.id, name: product.name, price: product.price, quantity: 1 }];
}

function updateQuantity(cart, id, quantity) {
  if (quantity <= 0) {
    return cart.filter((line) => line.id !== id);
  }
  return cart.map((line) => (line.id === id ? { ...line, quantity } : line));
}
`,
    explanation:
      "React (and Zustand selectors) decide whether something changed by comparing references. `push` or `line.quantity++` keeps the same references, so a component may not re-render. `map` + object spread creates a new array and a new object only for the changed line, while unchanged lines keep their identity (cheap, and memoised children stay stable). `filter` removes without mutating.",
    lessonId: "js-references-copies",
  },
  {
    id: "ch-js-promise-all",
    topic: "javascript",
    title: "Load users and courses in parallel",
    difficulty: "intermediate",
    scenario:
      "The dashboard needs `/api/users` and `/api/courses`. They do not depend on each other, so start both requests at once.",
    requirements: [
      "Implement `async function loadDashboard()` returning `{ users, courses }`.",
      "Call `fetch(\"/api/users\")` and `fetch(\"/api/courses\")` concurrently using `Promise.all`.",
      "If either response is not ok (`response.ok === false`), throw an `Error`.",
      "Parse both bodies with `response.json()`.",
    ],
    language: "js",
    starterCode: `async function loadDashboard() {
  // TODO: start both fetches, then await Promise.all([...])
  throw new Error("Not implemented");
}
`,
    examples: `\`\`\`js
const { users, courses } = await loadDashboard();
// users   -> [{ id: 1, name: "Ada" }]
// courses -> [{ id: 10, title: "React Basics" }]
\`\`\``,
    tests: [
      {
        name: "returns users and courses",
        code: `globalThis.fetch = async (url) => ({
  ok: true, status: 200,
  json: async () => url === "/api/users" ? [{ id: 1, name: "Ada" }] : [{ id: 10, title: "React Basics" }],
});
assertEqual(await loadDashboard(), { users: [{ id: 1, name: "Ada" }], courses: [{ id: 10, title: "React Basics" }] });`,
      },
      {
        name: "both requests are in flight at the same time",
        code: `let inFlight = 0;
let maxInFlight = 0;
globalThis.fetch = (url) => {
  inFlight++;
  maxInFlight = Math.max(maxInFlight, inFlight);
  return new Promise((resolve) => setTimeout(() => {
    inFlight--;
    resolve({ ok: true, status: 200, json: async () => [url] });
  }, 10));
};
await loadDashboard();
assertEqual(maxInFlight, 2, "requests should run concurrently, not one after another");`,
      },
      {
        name: "throws when one response is not ok",
        hidden: true,
        code: `globalThis.fetch = async (url) => ({
  ok: url !== "/api/courses", status: url === "/api/courses" ? 500 : 200,
  json: async () => [],
});
let threw = false;
try { await loadDashboard(); } catch (e) { threw = true; }
assert(threw, "should throw when a response is not ok");`,
      },
      {
        name: "rejects when the network fails",
        hidden: true,
        code: `globalThis.fetch = async () => { throw new TypeError("Failed to fetch"); };
let threw = false;
try { await loadDashboard(); } catch (e) { threw = true; }
assert(threw, "network errors should propagate");`,
      },
    ],
    hints: [
      "Calling `fetch()` starts the request immediately; `await` only waits for it. Start both before awaiting.",
      "`const [usersRes, coursesRes] = await Promise.all([fetch(\"/api/users\"), fetch(\"/api/courses\")]);`",
      "Check `usersRes.ok` and `coursesRes.ok` before calling `.json()` on each.",
    ],
    solution: `async function loadDashboard() {
  const [usersRes, coursesRes] = await Promise.all([
    fetch("/api/users"),
    fetch("/api/courses"),
  ]);
  if (!usersRes.ok || !coursesRes.ok) {
    throw new Error("Failed to load dashboard data");
  }
  const [users, courses] = await Promise.all([usersRes.json(), coursesRes.json()]);
  return { users, courses };
}
`,
    explanation:
      "`Promise.all` takes promises that are already running and resolves when all fulfil (in the same order as the input), or rejects as soon as one rejects. Total time is roughly the slowest request instead of the sum. Remember `fetch` only rejects on network failure; a 500 still fulfils, so we must check `ok` ourselves.",
    lessonId: "js-promises-async",
  },
  {
    id: "ch-js-sequential-concurrent",
    topic: "javascript",
    title: "Sequential vs concurrent async tasks",
    difficulty: "advanced",
    scenario:
      "Sometimes requests must run one after another (each depends on the previous); otherwise they should run concurrently. Write both helpers.",
    requirements: [
      "`tasks` is an array of functions; each returns a Promise when called.",
      "Implement `runSequential(tasks)`: start each task only after the previous one has finished; resolve to the results in order.",
      "Implement `runConcurrent(tasks)`: start all tasks immediately; resolve to the results in the ORIGINAL order.",
      "Both return `[]` for an empty array; a rejection should propagate.",
    ],
    language: "js",
    starterCode: `async function runSequential(tasks) {
  // TODO: for...of with await
  return [];
}

async function runConcurrent(tasks) {
  // TODO: Promise.all
  return [];
}
`,
    examples: `\`\`\`js
const wait = (v, ms) => () => new Promise((r) => setTimeout(() => r(v), ms));
await runSequential([wait("a", 20), wait("b", 5)]); // ["a", "b"] after ~25ms
await runConcurrent([wait("a", 20), wait("b", 5)]); // ["a", "b"] after ~20ms
\`\`\``,
    tests: [
      {
        name: "runSequential runs one at a time, in order",
        code: `let inFlight = 0, max = 0;
const task = (v, ms) => () => { inFlight++; max = Math.max(max, inFlight); return new Promise(r => setTimeout(() => { inFlight--; r(v); }, ms)); };
const result = await runSequential([task("a", 15), task("b", 5), task("c", 1)]);
assertEqual(result, ["a", "b", "c"]);
assertEqual(max, 1, "only one task may run at a time");`,
      },
      {
        name: "runConcurrent runs all at once, results in original order",
        code: `let inFlight = 0, max = 0;
const task = (v, ms) => () => { inFlight++; max = Math.max(max, inFlight); return new Promise(r => setTimeout(() => { inFlight--; r(v); }, ms)); };
const result = await runConcurrent([task("a", 15), task("b", 5), task("c", 1)]);
assertEqual(result, ["a", "b", "c"]);
assertEqual(max, 3, "all tasks should be in flight together");`,
      },
      {
        name: "empty arrays",
        code: `assertEqual(await runSequential([]), []);
assertEqual(await runConcurrent([]), []);`,
      },
      {
        name: "runSequential stops at the first rejection",
        hidden: true,
        code: `let started = 0;
const ok = () => { started++; return Promise.resolve("ok"); };
const bad = () => { started++; return Promise.reject(new Error("boom")); };
let message = "";
try { await runSequential([ok, bad, ok]); } catch (e) { message = e.message; }
assertEqual(message, "boom");
assertEqual(started, 2, "the third task should never start");`,
      },
      {
        name: "runConcurrent rejects if any task rejects",
        hidden: true,
        code: `let message = "";
try { await runConcurrent([() => Promise.resolve(1), () => Promise.reject(new Error("nope"))]); } catch (e) { message = e.message; }
assertEqual(message, "nope");`,
      },
    ],
    hints: [
      "A `for...of` loop with `await task()` inside naturally waits for each task before starting the next.",
      "For concurrency, call every task first: `tasks.map((task) => task())` gives an array of running promises.",
      "`return Promise.all(tasks.map((task) => task()));` keeps the original order regardless of finish order.",
    ],
    solution: `async function runSequential(tasks) {
  const results = [];
  for (const task of tasks) {
    results.push(await task());
  }
  return results;
}

async function runConcurrent(tasks) {
  return Promise.all(tasks.map((task) => task()));
}
`,
    explanation:
      "The difference is WHEN each promise is created. In the loop, `await` pauses the async function before the next `task()` call, so total time is the sum of durations. `tasks.map(task => task())` starts everything synchronously; `Promise.all` then waits for all of them, so total time is the longest single duration. Note that `tasks.forEach(async ...)` does NOT run sequentially: `forEach` ignores the returned promises.",
    lessonId: "js-promises-async",
  },
  {
    id: "ch-js-retry-backoff",
    topic: "javascript",
    title: "Retry with exponential backoff",
    difficulty: "advanced",
    scenario:
      "A flaky endpoint sometimes fails. TanStack Query retries 3 times with exponential backoff by default; build a tiny version yourself.",
    requirements: [
      "Implement `async function retryWithBackoff(fn, { retries, baseDelayMs, sleep = defaultSleep })`.",
      "Call `fn()`; if it resolves, return its value.",
      "If it rejects and retries remain, wait `baseDelayMs * 2 ** attemptIndex` (attemptIndex starts at 0) using `await sleep(ms)`, then try again.",
      "After `retries` failed retries (so `retries + 1` calls in total), throw the LAST error.",
      "Provide `defaultSleep(ms)` that resolves after `ms` using `setTimeout`.",
    ],
    language: "js",
    starterCode: `function defaultSleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function retryWithBackoff(fn, { retries, baseDelayMs, sleep = defaultSleep }) {
  // TODO: loop, try/catch, await sleep(...)
  return fn();
}
`,
    examples: `\`\`\`js
// fails twice, then succeeds -> waits 10ms, then 20ms
await retryWithBackoff(flakyFn, { retries: 3, baseDelayMs: 10 }); // "data"
\`\`\``,
    tests: [
      {
        name: "returns value after transient failures",
        code: `let calls = 0;
const flaky = async () => { calls++; if (calls < 3) throw new Error("fail " + calls); return "data"; };
const delays = [];
const result = await retryWithBackoff(flaky, { retries: 3, baseDelayMs: 10, sleep: async (ms) => { delays.push(ms); } });
assertEqual(result, "data");
assertEqual(calls, 3);
assertEqual(delays, [10, 20]);`,
      },
      {
        name: "throws the last error after all retries",
        code: `let calls = 0;
const alwaysFails = async () => { calls++; throw new Error("attempt " + calls); };
const delays = [];
let message = "";
try {
  await retryWithBackoff(alwaysFails, { retries: 3, baseDelayMs: 5, sleep: async (ms) => { delays.push(ms); } });
} catch (e) { message = e.message; }
assertEqual(message, "attempt 4");
assertEqual(calls, 4);
assertEqual(delays, [5, 10, 20]);`,
      },
      {
        name: "succeeds first time with no waiting",
        code: `const delays = [];
const result = await retryWithBackoff(async () => 42, { retries: 2, baseDelayMs: 100, sleep: async (ms) => { delays.push(ms); } });
assertEqual(result, 42);
assertEqual(delays, []);`,
      },
      {
        name: "retries: 0 means exactly one call",
        hidden: true,
        code: `let calls = 0;
let threw = false;
try { await retryWithBackoff(async () => { calls++; throw new Error("x"); }, { retries: 0, baseDelayMs: 1, sleep: async () => {} }); } catch (e) { threw = true; }
assert(threw, "should throw");
assertEqual(calls, 1);`,
      },
      {
        name: "defaultSleep really waits (tiny delay)",
        hidden: true,
        code: `let calls = 0;
const result = await retryWithBackoff(async () => { calls++; if (calls === 1) throw new Error("x"); return "ok"; }, { retries: 1, baseDelayMs: 1 });
assertEqual(result, "ok");
assertEqual(calls, 2);`,
      },
    ],
    hints: [
      "Use `for (let attempt = 0; ; attempt++)` with `try { return await fn(); } catch (err) { ... }` inside.",
      "Inside `catch`: if `attempt >= retries`, rethrow `err`; otherwise `await sleep(baseDelayMs * 2 ** attempt)`.",
      "`return await fn()` (not just `return fn()`) is essential inside `try`, otherwise the rejection escapes the `catch`.",
    ],
    solution: `function defaultSleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function retryWithBackoff(fn, { retries, baseDelayMs, sleep = defaultSleep }) {
  for (let attempt = 0; ; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt >= retries) throw err;
      await sleep(baseDelayMs * 2 ** attempt);
    }
  }
}
`,
    explanation:
      "Exponential backoff doubles the wait each time (10, 20, 40ms...) so a struggling server is not hammered. `return await` inside `try` matters: without `await`, the promise is returned before it settles and its rejection bypasses the `catch`. Injecting `sleep` makes the function testable without real waiting. TanStack Query's default is 3 retries with delay `min(1000 * 2 ** attempt, 30000)`.",
    lessonId: "js-promises-async",
  },

  /* ================================================================ */
  /* TypeScript                                                        */
  /* ================================================================ */
  {
    id: "ch-ts-product-interface",
    topic: "typescript",
    title: "Product interface with an optional description",
    difficulty: "beginner",
    scenario:
      "Product cards show a description, but some products have none. Model this with an interface and a default value.",
    requirements: [
      "Declare `interface Product { id: number; name: string; price: number; description?: string }`.",
      "Implement `describeProduct(product: Product): string` returning `NAME (£PRICE): DESCRIPTION`.",
      "Format the price with 2 decimals (`toFixed(2)`).",
      "If `description` is missing (`undefined`), use `\"No description provided\"`.",
    ],
    language: "ts",
    starterCode: `interface Product {
  // TODO: id, name, price, optional description
}

function describeProduct(product: Product): string {
  // TODO
  return "";
}
`,
    examples: `\`\`\`ts
describeProduct({ id: 1, name: "Desk Lamp", price: 24.5 });
// "Desk Lamp (£24.50): No description provided"
describeProduct({ id: 2, name: "Mug", price: 8, description: "Holds tea" });
// "Mug (£8.00): Holds tea"
\`\`\``,
    tests: [
      {
        name: "uses the default description",
        code: `assertEqual(describeProduct({ id: 1, name: "Desk Lamp", price: 24.5 }), "Desk Lamp (£24.50): No description provided");`,
      },
      {
        name: "uses a provided description",
        code: `assertEqual(describeProduct({ id: 2, name: "Mug", price: 8, description: "Holds tea" }), "Mug (£8.00): Holds tea");`,
      },
      {
        name: "explicit undefined also uses the default",
        hidden: true,
        code: `assertEqual(describeProduct({ id: 3, name: "Cap", price: 12.999, description: undefined }), "Cap (£13.00): No description provided");`,
      },
      {
        name: "empty string is kept (defaults only replace undefined)",
        hidden: true,
        code: `assertEqual(describeProduct({ id: 4, name: "Pin", price: 1, description: "" }), "Pin (£1.00): ");`,
      },
    ],
    hints: [
      "An optional property is written `description?: string`; its type is `string | undefined`.",
      "Destructure with a default: `const { name, price, description = \"No description provided\" } = product;`",
      "Build the string: `name + \" (£\" + price.toFixed(2) + \"): \" + description` (or a template literal).",
    ],
    solution: `interface Product {
  id: number;
  name: string;
  price: number;
  description?: string;
}

function describeProduct(product: Product): string {
  const { name, price, description = "No description provided" } = product;
  return \`\${name} (£\${price.toFixed(2)}): \${description}\`;
}
`,
    explanation:
      "`description?: string` means the property may be absent. Destructuring defaults apply only when the value is `undefined` (not for `\"\"`, `0` or `null`), which is why the empty string is kept. The interface exists only at compile time: Sucrase/tsc erase it, so it gives editor and compiler safety but no runtime checks.",
    lessonId: "ts-basics-interfaces",
  },
  {
    id: "ch-ts-request-state",
    topic: "typescript",
    title: "Render a discriminated-union request state",
    difficulty: "intermediate",
    scenario:
      "A component shows different UI for idle, loading, error and success. Model the states as a discriminated union so impossible combinations (loading AND error) cannot be represented.",
    requirements: [
      "Declare `type RequestState = { status: \"idle\" } | { status: \"loading\" } | { status: \"error\"; error: string } | { status: \"success\"; data: string[] }`.",
      "Implement `renderState(state: RequestState): string` with a `switch` on `state.status`.",
      "idle → `\"Nothing loaded yet\"`; loading → `\"Loading...\"`; error → `\"Error: \" + error`.",
      "success → the items joined with `\", \"`, or `\"No events found\"` when `data` is empty.",
      "Add an exhaustive `default` branch using `never`.",
    ],
    language: "ts",
    starterCode: `type RequestState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; error: string }
  | { status: "success"; data: string[] };

function renderState(state: RequestState): string {
  // TODO: switch (state.status) { ... }
  return "";
}
`,
    examples: `\`\`\`ts
renderState({ status: "loading" });                          // "Loading..."
renderState({ status: "error", error: "Network down" });     // "Error: Network down"
renderState({ status: "success", data: ["Jazz", "Expo"] });  // "Jazz, Expo"
\`\`\``,
    tests: [
      {
        name: "idle and loading",
        code: `assertEqual(renderState({ status: "idle" }), "Nothing loaded yet");
assertEqual(renderState({ status: "loading" }), "Loading...");`,
      },
      {
        name: "error shows the message",
        code: `assertEqual(renderState({ status: "error", error: "Network down" }), "Error: Network down");`,
      },
      {
        name: "success joins the data",
        code: `assertEqual(renderState({ status: "success", data: ["Jazz Night", "Tech Expo"] }), "Jazz Night, Tech Expo");`,
      },
      {
        name: "success with empty data",
        hidden: true,
        code: `assertEqual(renderState({ status: "success", data: [] }), "No events found");`,
      },
    ],
    hints: [
      "The shared literal property `status` is the discriminant. Inside `case \"error\":` TypeScript knows `state.error` exists.",
      "For success: `return state.data.length === 0 ? \"No events found\" : state.data.join(\", \");`",
      "Exhaustiveness: `default: { const unreachable: never = state; return unreachable; }` fails to compile if you forget a case.",
    ],
    solution: `type RequestState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; error: string }
  | { status: "success"; data: string[] };

function renderState(state: RequestState): string {
  switch (state.status) {
    case "idle":
      return "Nothing loaded yet";
    case "loading":
      return "Loading...";
    case "error":
      return "Error: " + state.error;
    case "success":
      return state.data.length === 0 ? "No events found" : state.data.join(", ");
    default: {
      const unreachable: never = state;
      return unreachable;
    }
  }
}
`,
    explanation:
      "A discriminated union narrows on a literal property: in each `case`, TypeScript knows exactly which variant you have, so `state.error` is only accessible in the error branch. The `never` default turns a forgotten variant into a compile error. Compare this with separate booleans `isLoading`, `isError`, `data` which allow contradictory combinations. TanStack Query's `status: 'pending' | 'error' | 'success'` uses the same idea.",
    lessonId: "ts-unions-narrowing",
  },
  {
    id: "ch-ts-format-price",
    topic: "typescript",
    title: "Narrow string | number in a price formatter",
    difficulty: "beginner",
    scenario:
      "Prices arrive either as numbers (from the API) or as strings (from a form input). Format both safely.",
    requirements: [
      "Implement `formatPrice(value: string | number): string`.",
      "Use `typeof` narrowing.",
      "Numbers → `\"£\" + value.toFixed(2)`.",
      "Strings → trim, convert with `Number(...)`; if the trimmed string is empty or the result is `NaN`, return `\"Invalid price\"`, otherwise format as above.",
    ],
    language: "ts",
    starterCode: `function formatPrice(value: string | number): string {
  // TODO: if (typeof value === "number") { ... }
  return String(value);
}
`,
    examples: `\`\`\`ts
formatPrice(12);    // "£12.00"
formatPrice("7.5"); // "£7.50"
formatPrice("abc"); // "Invalid price"
\`\`\``,
    tests: [
      {
        name: "formats numbers",
        code: `assertEqual(formatPrice(12), "£12.00");
assertEqual(formatPrice(0.5), "£0.50");`,
      },
      {
        name: "parses numeric strings",
        code: `assertEqual(formatPrice("7.5"), "£7.50");`,
      },
      {
        name: "rejects non-numeric strings",
        code: `assertEqual(formatPrice("abc"), "Invalid price");`,
      },
      {
        name: "trims whitespace and handles empty strings",
        hidden: true,
        code: `assertEqual(formatPrice(" 3 "), "£3.00");
assertEqual(formatPrice(""), "Invalid price");
assertEqual(formatPrice("   "), "Invalid price");`,
      },
      {
        name: "zero is a valid price",
        hidden: true,
        code: `assertEqual(formatPrice(0), "£0.00");
assertEqual(formatPrice("0"), "£0.00");`,
      },
    ],
    hints: [
      "After `if (typeof value === \"number\")`, TypeScript knows `value` is a number inside the block and a string after it.",
      "`Number(\"\")` is `0`, not `NaN`, so check for an empty trimmed string explicitly.",
      "Use `Number.isNaN(n)` to detect invalid numbers.",
    ],
    solution: `function formatPrice(value: string | number): string {
  if (typeof value === "number") {
    return "£" + value.toFixed(2);
  }
  const trimmed = value.trim();
  const n = Number(trimmed);
  if (trimmed === "" || Number.isNaN(n)) {
    return "Invalid price";
  }
  return "£" + n.toFixed(2);
}
`,
    explanation:
      "`typeof` checks are type guards: TypeScript narrows `string | number` to `number` inside the `if`, and to `string` afterwards because the number case returned. The tricky runtime edge is `Number(\"\") === 0`, which would silently show £0.00 for an empty field.",
    lessonId: "ts-unions-narrowing",
  },
  {
    id: "ch-ts-generic-first",
    topic: "typescript",
    title: "Generic first<T> and pluck",
    difficulty: "intermediate",
    scenario:
      "Write small reusable helpers that keep their types for ANY item type, instead of using `any`.",
    requirements: [
      "Implement `first<T>(items: readonly T[]): T | undefined` returning the first item or `undefined` for an empty array.",
      "Implement `pluck<T, K extends keyof T>(items: readonly T[], key: K): T[K][]` returning the values of `key` from each item.",
      "Do not mutate the input.",
    ],
    language: "ts",
    starterCode: `function first<T>(items: readonly T[]): T | undefined {
  // TODO
  return undefined;
}

function pluck<T, K extends keyof T>(items: readonly T[], key: K): T[K][] {
  // TODO
  return [];
}
`,
    examples: `\`\`\`ts
first([10, 20, 30]);           // 10   (type: number | undefined)
first<string>([]);             // undefined
pluck([{ id: 1, title: "Jazz" }], "title"); // ["Jazz"] (type: string[])
\`\`\``,
    tests: [
      {
        name: "first returns the first element",
        code: `assertEqual(first([10, 20, 30]), 10);
assertEqual(first(["a"]), "a");`,
      },
      {
        name: "first of empty array is undefined",
        code: `assert(first([]) === undefined, "expected undefined");`,
      },
      {
        name: "pluck extracts a property",
        code: `assertEqual(pluck([{ id: 1, title: "Jazz" }, { id: 2, title: "Expo" }], "title"), ["Jazz", "Expo"]);`,
      },
      {
        name: "first works when the first element is falsy",
        hidden: true,
        code: `assertEqual(first([0, 1]), 0);
assertEqual(first([null, 1]), null);`,
      },
      {
        name: "pluck of empty array",
        hidden: true,
        code: `assertEqual(pluck([], "id"), []);`,
      },
    ],
    hints: [
      "`T` is a type parameter: TypeScript infers it from the argument, e.g. `number` for `[10, 20]`.",
      "`items[0]` is all you need for `first` (an empty array gives `undefined`).",
      "`K extends keyof T` restricts `key` to real property names; `items.map((item) => item[key])` has type `T[K][]`.",
    ],
    solution: `function first<T>(items: readonly T[]): T | undefined {
  return items[0];
}

function pluck<T, K extends keyof T>(items: readonly T[], key: K): T[K][] {
  return items.map((item) => item[key]);
}
`,
    explanation:
      "Generics let one function work for many types while preserving the relationship between input and output: `first` of `Event[]` gives `Event | undefined`, not `any`. `K extends keyof T` is a constraint: `pluck(events, \"titel\")` would be a compile error. `T[K]` is an indexed access type, the type of property `K` on `T`. Avoid `items[0] || undefined`, which turns valid falsy values like `0` into `undefined`.",
    lessonId: "ts-generics-utility",
  },
  {
    id: "ch-ts-parse-api",
    topic: "typescript",
    title: "Validate unknown API JSON",
    difficulty: "advanced",
    scenario:
      "`await response.json()` gives you data TypeScript cannot check at runtime. Write a parser that turns `unknown` into a trusted `EventDto` or throws.",
    requirements: [
      "Declare `interface EventDto { id: number; title: string; price: number; imageUrl: string | null }`.",
      "Implement `parseEvent(json: unknown): EventDto`. If `json` is not a non-null, non-array object, throw `new Error(\"Invalid event: not an object\")`.",
      "Check fields in this order and throw `new Error(\"Invalid event: <field>\")` for the first bad one: `id` (number), `title` (string), `price` (number), `imageUrl` (string or null).",
      "Return a new object with ONLY those four fields (drop extra properties).",
      "Implement `parseEvents(json: unknown): EventDto[]`; throw `new Error(\"Invalid events: expected an array\")` if not an array, otherwise parse each item.",
    ],
    language: "ts",
    starterCode: `interface EventDto {
  id: number;
  title: string;
  price: number;
  imageUrl: string | null;
}

function parseEvent(json: unknown): EventDto {
  // TODO: validate, don't just cast with "as EventDto"
  return json as EventDto;
}

function parseEvents(json: unknown): EventDto[] {
  // TODO
  return json as EventDto[];
}
`,
    examples: `\`\`\`ts
parseEvent({ id: 1, title: "Jazz", price: 5, imageUrl: null, extra: true });
// { id: 1, title: "Jazz", price: 5, imageUrl: null }
parseEvent({ id: "1", title: "Jazz", price: 5, imageUrl: null });
// throws Error("Invalid event: id")
\`\`\``,
    tests: [
      {
        name: "parses a valid event and drops extra fields",
        code: `assertEqual(parseEvent({ id: 1, title: "Jazz Night", price: 5, imageUrl: null, secret: "x" }), { id: 1, title: "Jazz Night", price: 5, imageUrl: null });`,
      },
      {
        name: "throws for a wrong id type",
        code: `let message = "";
try { parseEvent({ id: "1", title: "Jazz", price: 5, imageUrl: null }); } catch (e) { message = e.message; }
assertEqual(message, "Invalid event: id");`,
      },
      {
        name: "parseEvents parses arrays",
        code: `assertEqual(parseEvents([{ id: 1, title: "A", price: 0, imageUrl: "a.png" }]), [{ id: 1, title: "A", price: 0, imageUrl: "a.png" }]);`,
      },
      {
        name: "rejects null, arrays and primitives",
        hidden: true,
        code: `for (const bad of [null, [], "event", 42]) {
  let message = "";
  try { parseEvent(bad); } catch (e) { message = e.message; }
  assertEqual(message, "Invalid event: not an object");
}`,
      },
      {
        name: "missing title and bad imageUrl",
        hidden: true,
        code: `let m1 = "", m2 = "";
try { parseEvent({ id: 1, price: 5, imageUrl: null }); } catch (e) { m1 = e.message; }
try { parseEvent({ id: 1, title: "T", price: 5 }); } catch (e) { m2 = e.message; }
assertEqual(m1, "Invalid event: title");
assertEqual(m2, "Invalid event: imageUrl");`,
      },
      {
        name: "parseEvents rejects non-arrays",
        hidden: true,
        code: `let message = "";
try { parseEvents({ items: [] }); } catch (e) { message = e.message; }
assertEqual(message, "Invalid events: expected an array");`,
      },
    ],
    hints: [
      "Write a type guard: `function isRecord(v: unknown): v is Record<string, unknown> { return typeof v === \"object\" && v !== null && !Array.isArray(v); }`",
      "After the guard, destructure: `const { id, title, price, imageUrl } = json;` each is `unknown`, so check with `typeof`.",
      "`imageUrl` is valid when `imageUrl === null || typeof imageUrl === \"string\"`. Note that a missing property is `undefined`, which is neither.",
    ],
    solution: `interface EventDto {
  id: number;
  title: string;
  price: number;
  imageUrl: string | null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseEvent(json: unknown): EventDto {
  if (!isRecord(json)) throw new Error("Invalid event: not an object");
  const { id, title, price, imageUrl } = json;
  if (typeof id !== "number") throw new Error("Invalid event: id");
  if (typeof title !== "string") throw new Error("Invalid event: title");
  if (typeof price !== "number") throw new Error("Invalid event: price");
  if (imageUrl !== null && typeof imageUrl !== "string") throw new Error("Invalid event: imageUrl");
  return { id, title, price, imageUrl };
}

function parseEvents(json: unknown): EventDto[] {
  if (!Array.isArray(json)) throw new Error("Invalid events: expected an array");
  return json.map(parseEvent);
}
`,
    explanation:
      "TypeScript types are erased at compile time, so `response.json() as EventDto` is a promise to the compiler, not a check. Accepting `unknown` forces you to narrow before use. A custom type guard (`value is Record<string, unknown>`) narrows the object, then `typeof` narrows each field. Returning a fresh object strips unexpected properties. In real projects a schema library such as Zod (`EventSchema.parse(json)`) does exactly this with less code.",
    lessonId: "ts-typed-api-data",
  },

  /* ================================================================ */
  /* React logic without the DOM                                       */
  /* ================================================================ */
  {
    id: "ch-react-todo-reducer",
    topic: "react",
    title: "Pure todo reducer",
    difficulty: "intermediate",
    scenario:
      "`useReducer(todoReducer, [])` manages a todo list. React requires reducers to be PURE: same input → same output, no mutation, no side effects.",
    requirements: [
      "Implement `todoReducer(state, action)` where state is an array of `{ id, text, done }`.",
      "`{ type: \"added\", text }` → append `{ id, text: text.trim(), done: false }` where `id` is (largest existing id) + 1, or 1 for an empty list. Ignore (return the SAME state) if the trimmed text is empty.",
      "`{ type: \"toggled\", id }` → flip `done` of that todo.",
      "`{ type: \"deleted\", id }` → remove that todo.",
      "Unknown action types → `throw new Error(\"Unknown action: \" + action.type)`.",
      "Never mutate `state` (tests freeze it).",
    ],
    language: "js",
    starterCode: `function todoReducer(state, action) {
  switch (action.type) {
    // TODO: "added", "toggled", "deleted"
    default:
      return state;
  }
}
`,
    examples: `\`\`\`js
let s = todoReducer([], { type: "added", text: "  Revise routing " });
// [{ id: 1, text: "Revise routing", done: false }]
s = todoReducer(s, { type: "toggled", id: 1 });
// [{ id: 1, text: "Revise routing", done: true }]
\`\`\``,
    tests: [
      {
        name: "added appends a trimmed todo",
        code: `const s = todoReducer(Object.freeze([]), { type: "added", text: "  Revise routing " });
assertEqual(s, [{ id: 1, text: "Revise routing", done: false }]);`,
      },
      {
        name: "toggled flips done without mutating",
        code: `const todo = Object.freeze({ id: 1, text: "A", done: false });
const state = Object.freeze([todo]);
const next = todoReducer(state, { type: "toggled", id: 1 });
assertEqual(next, [{ id: 1, text: "A", done: true }]);
assertEqual(todo.done, false);`,
      },
      {
        name: "deleted removes the todo",
        code: `const state = Object.freeze([Object.freeze({ id: 1, text: "A", done: false }), Object.freeze({ id: 2, text: "B", done: false })]);
assertEqual(todoReducer(state, { type: "deleted", id: 1 }), [{ id: 2, text: "B", done: false }]);`,
      },
      {
        name: "id is max id + 1 (not length + 1)",
        hidden: true,
        code: `const state = Object.freeze([Object.freeze({ id: 5, text: "A", done: false })]);
assertEqual(todoReducer(state, { type: "added", text: "B" })[1].id, 6);`,
      },
      {
        name: "empty text returns the same state",
        hidden: true,
        code: `const state = Object.freeze([]);
assert(todoReducer(state, { type: "added", text: "   " }) === state, "should return the same reference");`,
      },
      {
        name: "unknown action throws",
        hidden: true,
        code: `let message = "";
try { todoReducer([], { type: "renamed" }); } catch (e) { message = e.message; }
assertEqual(message, "Unknown action: renamed");`,
      },
    ],
    hints: [
      "Each case returns a NEW array: spread for adding, `map` for toggling, `filter` for deleting.",
      "Next id: `state.reduce((max, t) => Math.max(max, t.id), 0) + 1`.",
      "Toggle: `state.map((t) => (t.id === action.id ? { ...t, done: !t.done } : t))`.",
    ],
    solution: `function todoReducer(state, action) {
  switch (action.type) {
    case "added": {
      const text = action.text.trim();
      if (text === "") return state;
      const nextId = state.reduce((max, t) => Math.max(max, t.id), 0) + 1;
      return [...state, { id: nextId, text, done: false }];
    }
    case "toggled":
      return state.map((t) => (t.id === action.id ? { ...t, done: !t.done } : t));
    case "deleted":
      return state.filter((t) => t.id !== action.id);
    default:
      throw new Error("Unknown action: " + action.type);
  }
}
`,
    explanation:
      "Reducers centralise update logic: components dispatch *what happened* and the reducer computes the next state. React compares the returned state with `Object.is`; returning the same reference (as for empty text) lets React bail out of re-rendering. In StrictMode React may call reducers twice in development to expose impurities, so mutation or side effects (like `Date.now()` ids or fetches) cause bugs. Throwing on unknown actions catches typos early.",
    lessonId: "react-state-events",
  },
  {
    id: "ch-react-visible-events",
    topic: "router",
    title: "Derive a visible list from search params",
    difficulty: "intermediate",
    scenario:
      "The events page stores filters in the URL (`?q=jazz&category=music&sort=price-asc`) via `useSearchParams`, so filters survive refresh and can be shared. Derive the list to render.",
    requirements: [
      "Implement `getVisibleEvents(events, searchParams)` where `searchParams` is a `URLSearchParams`.",
      "`q`: keep events whose `title` contains `q`, case-insensitively (ignore if missing/empty after trim).",
      "`category`: keep events whose `category` equals it exactly (ignore if missing).",
      "`sort`: `\"price-asc\"` or `\"price-desc\"` sorts by price; anything else keeps the original order.",
      "Do not mutate `events`.",
    ],
    language: "js",
    starterCode: `function getVisibleEvents(events, searchParams) {
  // TODO: read searchParams.get("q"), .get("category"), .get("sort")
  return events;
}
`,
    examples: `\`\`\`js
const params = new URLSearchParams("?q=jazz&sort=price-desc");
getVisibleEvents(events, params);
\`\`\``,
    tests: [
      {
        name: "filters by case-insensitive search",
        code: `const events = [
  { id: 1, title: "Jazz Night", category: "music", price: 5 },
  { id: 2, title: "Hackathon", category: "tech", price: 0 },
  { id: 3, title: "Late JAZZ Jam", category: "music", price: 3 },
];
assertEqual(getVisibleEvents(events, new URLSearchParams("?q=jazz")).map(e => e.id), [1, 3]);`,
      },
      {
        name: "filters by category and sorts by price",
        code: `const events = [
  { id: 1, title: "Jazz Night", category: "music", price: 5 },
  { id: 2, title: "Hackathon", category: "tech", price: 0 },
  { id: 3, title: "Late JAZZ Jam", category: "music", price: 3 },
];
assertEqual(getVisibleEvents(events, new URLSearchParams("category=music&sort=price-asc")).map(e => e.id), [3, 1]);`,
      },
      {
        name: "no params returns all in original order",
        code: `const events = [
  { id: 2, title: "B", category: "x", price: 9 },
  { id: 1, title: "A", category: "y", price: 1 },
];
assertEqual(getVisibleEvents(events, new URLSearchParams("")).map(e => e.id), [2, 1]);`,
      },
      {
        name: "price-desc sorting does not mutate the input",
        hidden: true,
        code: `const events = Object.freeze([
  { id: 1, title: "A", category: "x", price: 1 },
  { id: 2, title: "B", category: "x", price: 7 },
]);
assertEqual(getVisibleEvents(events, new URLSearchParams("sort=price-desc")).map(e => e.id), [2, 1]);
assertEqual(events.map(e => e.id), [1, 2]);`,
      },
      {
        name: "whitespace-only q is ignored; unknown sort keeps order",
        hidden: true,
        code: `const events = [
  { id: 1, title: "A", category: "x", price: 9 },
  { id: 2, title: "B", category: "x", price: 1 },
];
assertEqual(getVisibleEvents(events, new URLSearchParams("q=%20%20&sort=popular")).map(e => e.id), [1, 2]);`,
      },
    ],
    hints: [
      "`searchParams.get(\"q\")` returns a string or `null` when the key is absent.",
      "Chain non-mutating steps: start with `let result = events.filter(...)` (filter always returns a new array).",
      "Sort a copy: `[...result].sort((a, b) => a.price - b.price)`.",
    ],
    solution: `function getVisibleEvents(events, searchParams) {
  const q = (searchParams.get("q") ?? "").trim().toLowerCase();
  const category = searchParams.get("category");
  const sort = searchParams.get("sort");

  let result = events.filter((e) => {
    const matchesQ = q === "" || e.title.toLowerCase().includes(q);
    const matchesCategory = !category || e.category === category;
    return matchesQ && matchesCategory;
  });

  if (sort === "price-asc") {
    result = [...result].sort((a, b) => a.price - b.price);
  } else if (sort === "price-desc") {
    result = [...result].sort((a, b) => b.price - a.price);
  }
  return result;
}
`,
    explanation:
      "The URL is the single source of truth for filter state: `const [searchParams, setSearchParams] = useSearchParams()` in the component, then the visible list is DERIVED during render with a pure function like this one. No extra `useState` or `useEffect` syncing is needed. `get()` returns `null` for missing keys and values are always strings.",
    lessonId: "router-search-params",
  },
  {
    id: "ch-router-match-path",
    topic: "router",
    title: "Build a tiny route matcher",
    difficulty: "intermediate",
    scenario:
      "React Router matches `<Route path=\"/students/:studentId\">` against the URL and exposes `{ studentId: \"42\" }` through `useParams()`. Implement the core idea.",
    requirements: [
      "Implement `matchPath(pattern, pathname)`.",
      "Split both on `/`, ignoring empty segments (so trailing slashes do not matter).",
      "If the segment counts differ, return `null`.",
      "Segments starting with `:` capture the corresponding pathname segment as a STRING (decode it with `decodeURIComponent`).",
      "Static segments must match exactly; otherwise return `null`.",
      "Return the params object (`{}` for a static match).",
    ],
    language: "js",
    starterCode: `function matchPath(pattern, pathname) {
  // TODO
  return null;
}
`,
    examples: `\`\`\`js
matchPath("/students/:studentId", "/students/42");
// { studentId: "42" }
matchPath("/events/:eventId/reviews/:reviewId", "/events/7/reviews/3");
// { eventId: "7", reviewId: "3" }
matchPath("/students/:studentId", "/courses/42"); // null
\`\`\``,
    tests: [
      {
        name: "captures a single param as a string",
        code: `assertEqual(matchPath("/students/:studentId", "/students/42"), { studentId: "42" });`,
      },
      {
        name: "captures multiple params",
        code: `assertEqual(matchPath("/events/:eventId/reviews/:reviewId", "/events/7/reviews/3"), { eventId: "7", reviewId: "3" });`,
      },
      {
        name: "returns null for non-matching paths",
        code: `assert(matchPath("/students/:studentId", "/courses/42") === null, "static segment mismatch");
assert(matchPath("/students/:studentId", "/students") === null, "missing segment");
assert(matchPath("/students/:studentId", "/students/42/edit") === null, "extra segment");`,
      },
      {
        name: "static routes and trailing slashes",
        hidden: true,
        code: `assertEqual(matchPath("/about", "/about/"), {});
assertEqual(matchPath("/", "/"), {});`,
      },
      {
        name: "decodes encoded segments",
        hidden: true,
        code: `assertEqual(matchPath("/search/:term", "/search/jazz%20night"), { term: "jazz night" });`,
      },
    ],
    hints: [
      "`const split = (p) => p.split(\"/\").filter(Boolean);` removes empty segments.",
      "Loop over pattern segments with their index; compare to the pathname segment at the same index.",
      "`if (seg.startsWith(\":\")) params[seg.slice(1)] = decodeURIComponent(actual); else if (seg !== actual) return null;`",
    ],
    solution: `function matchPath(pattern, pathname) {
  const split = (p) => p.split("/").filter(Boolean);
  const patternParts = split(pattern);
  const pathParts = split(pathname);
  if (patternParts.length !== pathParts.length) return null;

  const params = {};
  for (let i = 0; i < patternParts.length; i++) {
    const seg = patternParts[i];
    const actual = pathParts[i];
    if (seg.startsWith(":")) {
      params[seg.slice(1)] = decodeURIComponent(actual);
    } else if (seg !== actual) {
      return null;
    }
  }
  return params;
}
`,
    explanation:
      "Dynamic segments are placeholders: the router records the actual URL text under the param name. That is why `useParams()` values are always strings: convert with `Number(studentId)` before comparing with numeric ids. The real React Router also ranks routes (static segments beat dynamic ones), supports optional segments and splats (`*`), and nests matches for `<Outlet />` layouts.",
    lessonId: "router-dynamic-params",
  },

  /* ================================================================ */
  /* REST / HTTP                                                       */
  /* ================================================================ */
  {
    id: "ch-http-get-courses",
    topic: "http-api",
    title: "getCourses service with response.ok check",
    difficulty: "beginner",
    scenario:
      "A service module (`services/courseService`) wraps fetch so components never deal with raw responses. `fetch` does NOT reject on 404 or 500, so the service must check.",
    requirements: [
      "Implement `async function getCourses(baseUrl)` that requests `baseUrl + \"/courses\"`.",
      "If `response.ok` is false, throw `new Error(\"Request failed with status \" + response.status)` WITHOUT parsing the body.",
      "Otherwise return `await response.json()`.",
    ],
    language: "js",
    starterCode: `async function getCourses(baseUrl) {
  const response = await fetch(baseUrl + "/courses");
  // TODO: check response.ok
  return response.json();
}
`,
    examples: `\`\`\`js
await getCourses("http://localhost:5229/api");
// -> [{ id: 1, title: "React Basics" }]
// 404 -> throws Error("Request failed with status 404")
\`\`\``,
    tests: [
      {
        name: "returns parsed JSON on success",
        code: `let calledUrl = "";
globalThis.fetch = async (url) => { calledUrl = url; return { ok: true, status: 200, json: async () => [{ id: 1, title: "React Basics" }] }; };
assertEqual(await getCourses("http://localhost:5229/api"), [{ id: 1, title: "React Basics" }]);
assertEqual(calledUrl, "http://localhost:5229/api/courses");`,
      },
      {
        name: "throws with status on 404",
        code: `globalThis.fetch = async () => ({ ok: false, status: 404, json: async () => ({ title: "Not Found" }) });
let message = "";
try { await getCourses("/api"); } catch (e) { message = e.message; }
assertEqual(message, "Request failed with status 404");`,
      },
      {
        name: "throws on 500 without calling json()",
        hidden: true,
        code: `let jsonCalled = false;
globalThis.fetch = async () => ({ ok: false, status: 500, json: async () => { jsonCalled = true; throw new SyntaxError("Unexpected token <"); } });
let message = "";
try { await getCourses("/api"); } catch (e) { message = e.message; }
assertEqual(message, "Request failed with status 500");
assert(!jsonCalled, "do not parse the body of a failed response");`,
      },
      {
        name: "network errors propagate",
        hidden: true,
        code: `globalThis.fetch = async () => { throw new TypeError("Failed to fetch"); };
let name = "";
try { await getCourses("/api"); } catch (e) { name = e.name; }
assertEqual(name, "TypeError");`,
      },
    ],
    hints: [
      "`response.ok` is `true` only for status codes 200–299.",
      "Put the `if (!response.ok) throw ...` BEFORE `response.json()`.",
      "Thrown errors make the returned promise reject; TanStack Query will put the query into its error state.",
    ],
    solution: `async function getCourses(baseUrl) {
  const response = await fetch(baseUrl + "/courses");
  if (!response.ok) {
    throw new Error("Request failed with status " + response.status);
  }
  return response.json();
}
`,
    explanation:
      "The `fetch` promise resolves for ANY HTTP response, including 404 and 500; it only rejects for network failures, CORS blocks or aborts. Checking `response.ok` converts HTTP errors into rejections so callers (and TanStack Query's `isError`) see them. Error bodies are often HTML or empty, so parsing them as JSON would throw a confusing SyntaxError.",
    lessonId: "http-fetch-response-ok",
  },
  {
    id: "ch-http-create-event",
    topic: "forms-crud",
    title: "POST a new event with headers and JSON body",
    difficulty: "intermediate",
    scenario:
      "Admins create events via `POST /api/events`. The API needs a JSON body, a `Content-Type` header and the JWT in an `Authorization: Bearer` header. It answers `201 Created` with the new EventDto.",
    requirements: [
      "Implement `async function createEvent(baseUrl, token, newEvent)`.",
      "Call `fetch(baseUrl + \"/events\", options)` with `method: \"POST\"`.",
      "`headers` must be a plain object with `\"Content-Type\": \"application/json\"` and `Authorization: \"Bearer \" + token`.",
      "`body` must be `JSON.stringify(newEvent)`.",
      "If not ok, throw `new Error(\"Create failed: \" + response.status)`; otherwise return the parsed JSON.",
    ],
    language: "js",
    starterCode: `async function createEvent(baseUrl, token, newEvent) {
  // TODO: fetch with method, headers and body
  throw new Error("Not implemented");
}
`,
    examples: `\`\`\`js
const created = await createEvent("http://localhost:5229/api", token, {
  title: "Hack Night", location: "Room 101", price: 0,
});
// -> { id: 12, title: "Hack Night", ... }   (status 201)
\`\`\``,
    tests: [
      {
        name: "sends the right URL, method, headers and body",
        code: `const calls = [];
globalThis.fetch = async (url, options) => { calls.push({ url, options }); return { ok: true, status: 201, json: async () => ({ id: 12, title: "Hack Night" }) }; };
const newEvent = { title: "Hack Night", location: "Room 101", price: 0 };
await createEvent("http://localhost:5229/api", "fake-token-123", newEvent);
assertEqual(calls.length, 1);
const { url, options } = calls[0];
assertEqual(url, "http://localhost:5229/api/events");
assertEqual(options.method, "POST");
assertEqual(options.headers["Content-Type"], "application/json");
assertEqual(options.headers.Authorization, "Bearer fake-token-123");
assertEqual(typeof options.body, "string", "body must be a JSON string");
assertEqual(JSON.parse(options.body), newEvent);`,
      },
      {
        name: "returns the created event",
        code: `globalThis.fetch = async () => ({ ok: true, status: 201, json: async () => ({ id: 12, title: "Hack Night" }) });
assertEqual(await createEvent("/api", "t", { title: "Hack Night" }), { id: 12, title: "Hack Night" });`,
      },
      {
        name: "throws on 403 Forbidden",
        hidden: true,
        code: `globalThis.fetch = async () => ({ ok: false, status: 403, json: async () => ({}) });
let message = "";
try { await createEvent("/api", "user-token", { title: "X" }); } catch (e) { message = e.message; }
assertEqual(message, "Create failed: 403");`,
      },
      {
        name: "throws on 400 validation error",
        hidden: true,
        code: `globalThis.fetch = async () => ({ ok: false, status: 400, json: async () => ({ errors: { Title: ["Required"] } }) });
let message = "";
try { await createEvent("/api", "t", {}); } catch (e) { message = e.message; }
assertEqual(message, "Create failed: 400");`,
      },
    ],
    hints: [
      "The second argument of `fetch` is an options object: `{ method, headers, body }`.",
      "Without `JSON.stringify`, the body becomes the string `\"[object Object]\"`.",
      "Without `Content-Type: application/json`, ASP.NET Core typically responds 415 Unsupported Media Type.",
    ],
    solution: `async function createEvent(baseUrl, token, newEvent) {
  const response = await fetch(baseUrl + "/events", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(newEvent),
  });
  if (!response.ok) {
    throw new Error("Create failed: " + response.status);
  }
  return response.json();
}
`,
    explanation:
      "HTTP bodies are bytes, so objects must be serialised with `JSON.stringify`; `Content-Type` tells the server how to parse them. The `Authorization: Bearer <jwt>` header carries the token; a non-admin token gets 403 and a missing/expired one gets 401. POST is not idempotent: sending it twice creates two events, which is why submit buttons are disabled while a mutation is pending.",
    lessonId: "crud-post-put-delete",
  },
  {
    id: "ch-http-handle-204",
    topic: "http-api",
    title: "PUT update that handles 204 No Content",
    difficulty: "intermediate",
    scenario:
      "In the CampusEvents API, `PUT /api/events/{id}` returns `204 No Content` on success: there is no body to parse.",
    requirements: [
      "Implement `async function updateEvent(baseUrl, token, id, changes)` that sends a PUT to `baseUrl + \"/events/\" + id` with JSON body and Bearer token.",
      "If not ok, throw `new Error(\"Update failed: \" + response.status)`.",
      "If `response.status === 204`, return `null` WITHOUT calling `response.json()`.",
      "Otherwise return the parsed JSON.",
    ],
    language: "js",
    starterCode: `async function updateEvent(baseUrl, token, id, changes) {
  const response = await fetch(baseUrl + "/events/" + id, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
    body: JSON.stringify(changes),
  });
  // TODO: handle errors and 204
  return response.json();
}
`,
    examples: `\`\`\`js
await updateEvent("http://localhost:5229/api", token, 7, { title: "New title" }); // null (204)
\`\`\``,
    tests: [
      {
        name: "204 returns null without parsing",
        code: `let jsonCalled = false;
globalThis.fetch = async () => ({ ok: true, status: 204, json: async () => { jsonCalled = true; throw new SyntaxError("Unexpected end of JSON input"); } });
const result = await updateEvent("/api", "t", 7, { title: "New" });
assert(result === null, "expected null for 204");
assert(!jsonCalled, "must not call json() on a 204");`,
      },
      {
        name: "sends a PUT to the right URL",
        code: `let seen = null;
globalThis.fetch = async (url, options) => { seen = { url, method: options.method, body: options.body }; return { ok: true, status: 204, json: async () => null }; };
await updateEvent("http://localhost:5229/api", "t", 7, { title: "New" });
assertEqual(seen, { url: "http://localhost:5229/api/events/7", method: "PUT", body: JSON.stringify({ title: "New" }) });`,
      },
      {
        name: "200 with body returns JSON",
        hidden: true,
        code: `globalThis.fetch = async () => ({ ok: true, status: 200, json: async () => ({ id: 7, title: "New" }) });
assertEqual(await updateEvent("/api", "t", 7, { title: "New" }), { id: 7, title: "New" });`,
      },
      {
        name: "404 throws",
        hidden: true,
        code: `globalThis.fetch = async () => ({ ok: false, status: 404, json: async () => ({}) });
let message = "";
try { await updateEvent("/api", "t", 999, {}); } catch (e) { message = e.message; }
assertEqual(message, "Update failed: 404");`,
      },
    ],
    hints: [
      "Order matters: check `!response.ok` first, then `status === 204`, then parse.",
      "Calling `.json()` on an empty body throws `SyntaxError: Unexpected end of JSON input`.",
      "`if (response.status === 204) return null;`",
    ],
    solution: `async function updateEvent(baseUrl, token, id, changes) {
  const response = await fetch(baseUrl + "/events/" + id, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
    body: JSON.stringify(changes),
  });
  if (!response.ok) {
    throw new Error("Update failed: " + response.status);
  }
  if (response.status === 204) {
    return null;
  }
  return response.json();
}
`,
    explanation:
      "204 means success with deliberately no body. `response.json()` would throw on the empty body, turning a successful update into an apparent failure. After a successful PUT/DELETE you typically call `queryClient.invalidateQueries({ queryKey: [\"events\"] })` so the UI refetches fresh data instead of expecting it in the response.",
    lessonId: "http-service-modules",
  },
  {
    id: "ch-http-abortable-fetch",
    topic: "http-api",
    title: "Abortable fetch that ignores AbortError",
    difficulty: "advanced",
    scenario:
      "A `useEffect` starts loading events and its cleanup calls `controller.abort()` (for example when the component unmounts or StrictMode re-runs the effect). The cancelled request must not be reported as an error.",
    requirements: [
      "Implement `async function loadEvents(signal)` that calls `fetch(\"/api/events\", { signal })`.",
      "If not ok, throw `new Error(\"HTTP \" + response.status)`.",
      "Return the parsed JSON on success.",
      "If the request was aborted (error `name === \"AbortError\"`), return `null` instead of throwing.",
      "Re-throw every other error.",
    ],
    language: "js",
    starterCode: `async function loadEvents(signal) {
  // TODO: try/catch around fetch, pass { signal }
  const response = await fetch("/api/events");
  return response.json();
}
`,
    examples: `\`\`\`js
const controller = new AbortController();
const promise = loadEvents(controller.signal);
controller.abort();
await promise; // null, not an error
\`\`\``,
    tests: [
      {
        name: "passes the signal and returns data",
        code: `let receivedSignal = null;
globalThis.fetch = async (url, options) => { receivedSignal = options && options.signal; return { ok: true, status: 200, json: async () => [{ id: 1, title: "Jazz Night" }] }; };
const controller = new AbortController();
assertEqual(await loadEvents(controller.signal), [{ id: 1, title: "Jazz Night" }]);
assert(receivedSignal === controller.signal, "pass the signal to fetch");`,
      },
      {
        name: "aborting returns null",
        code: `globalThis.fetch = (url, options) => new Promise((resolve, reject) => {
  const signal = options && options.signal;
  if (!signal) return reject(new Error("no signal passed"));
  signal.addEventListener("abort", () => reject(new DOMException("The operation was aborted.", "AbortError")));
});
const controller = new AbortController();
const promise = loadEvents(controller.signal);
controller.abort();
assert((await promise) === null, "aborted requests should resolve to null");`,
      },
      {
        name: "network errors are re-thrown",
        hidden: true,
        code: `globalThis.fetch = async () => { throw new TypeError("Failed to fetch"); };
let name = "";
try { await loadEvents(new AbortController().signal); } catch (e) { name = e.name; }
assertEqual(name, "TypeError");`,
      },
      {
        name: "HTTP errors throw",
        hidden: true,
        code: `globalThis.fetch = async () => ({ ok: false, status: 503, json: async () => ({}) });
let message = "";
try { await loadEvents(new AbortController().signal); } catch (e) { message = e.message; }
assertEqual(message, "HTTP 503");`,
      },
    ],
    hints: [
      "Pass the signal in the options: `fetch(url, { signal })`.",
      "Wrap everything in `try { ... } catch (err) { ... }` and inspect `err.name`.",
      "`if (err instanceof Error && err.name === \"AbortError\") return null; throw err;` (DOMException also has `name`).",
    ],
    solution: `async function loadEvents(signal) {
  try {
    const response = await fetch("/api/events", { signal });
    if (!response.ok) {
      throw new Error("HTTP " + response.status);
    }
    return await response.json();
  } catch (err) {
    if (err && err.name === "AbortError") {
      return null;
    }
    throw err;
  }
}
`,
    explanation:
      "`AbortController` lets you cancel a fetch: `abort()` makes the fetch promise reject with a DOMException named `AbortError`. That is an expected outcome (the user navigated away), not a failure, so it should not show an error message. Typical usage: `useEffect(() => { const c = new AbortController(); loadEvents(c.signal).then(...); return () => c.abort(); }, [])`. This also prevents stale responses from overwriting newer state (race conditions). TanStack Query passes a `signal` to your `queryFn` for the same purpose.",
    lessonId: "http-abortcontroller",
  },

  /* ================================================================ */
  /* Forms                                                             */
  /* ================================================================ */
  {
    id: "ch-forms-validate-event",
    topic: "forms-crud",
    title: "validateEvent returning an errors object",
    difficulty: "intermediate",
    scenario:
      "The Create Event form validates on submit and shows a message under each invalid field. Return an errors object keyed by field name (empty object = valid).",
    requirements: [
      "Implement `validateEvent(values)` where values is `{ name, location, maxAttendees }` (maxAttendees may be a number or a string from an input).",
      "`name` required after `trim()`: error `\"Name is required\"`.",
      "`location` required after `trim()`: error `\"Location is required\"`.",
      "`maxAttendees` must be a positive integer (after `Number(...)`; empty string is invalid): error `\"Max attendees must be a positive whole number\"`.",
      "Only include keys for invalid fields; return `{}` when everything is valid.",
    ],
    language: "js",
    starterCode: `function validateEvent(values) {
  const errors = {};
  // TODO
  return errors;
}
`,
    examples: `\`\`\`js
validateEvent({ name: "  ", location: "Room 101", maxAttendees: "0" });
// { name: "Name is required", maxAttendees: "Max attendees must be a positive whole number" }
\`\`\``,
    tests: [
      {
        name: "valid values give an empty object",
        code: `assertEqual(validateEvent({ name: "Hack Night", location: "Room 101", maxAttendees: 50 }), {});`,
      },
      {
        name: "whitespace-only name and location are errors",
        code: `assertEqual(validateEvent({ name: "   ", location: "", maxAttendees: 10 }), {
  name: "Name is required",
  location: "Location is required",
});`,
      },
      {
        name: "maxAttendees must be a positive integer",
        code: `const msg = "Max attendees must be a positive whole number";
assertEqual(validateEvent({ name: "A", location: "B", maxAttendees: 0 }), { maxAttendees: msg });
assertEqual(validateEvent({ name: "A", location: "B", maxAttendees: -5 }), { maxAttendees: msg });
assertEqual(validateEvent({ name: "A", location: "B", maxAttendees: 2.5 }), { maxAttendees: msg });`,
      },
      {
        name: "string inputs from the form",
        hidden: true,
        code: `const msg = "Max attendees must be a positive whole number";
assertEqual(validateEvent({ name: "A", location: "B", maxAttendees: "25" }), {});
assertEqual(validateEvent({ name: "A", location: "B", maxAttendees: "" }), { maxAttendees: msg });
assertEqual(validateEvent({ name: "A", location: "B", maxAttendees: "ten" }), { maxAttendees: msg });`,
      },
      {
        name: "missing fields are handled",
        hidden: true,
        code: `assertEqual(Object.keys(validateEvent({})).sort(), ["location", "maxAttendees", "name"]);`,
      },
    ],
    hints: [
      "Guard against `undefined`: `(values.name ?? \"\").trim() === \"\"`.",
      "`Number(\"\")` is `0` and `Number(\"ten\")` is `NaN`. `Number.isInteger(n) && n > 0` rejects both.",
      "Treat an empty string explicitly as invalid before converting, or rely on `0` failing the `> 0` test.",
    ],
    solution: `function validateEvent(values) {
  const errors = {};
  if (String(values.name ?? "").trim() === "") {
    errors.name = "Name is required";
  }
  if (String(values.location ?? "").trim() === "") {
    errors.location = "Location is required";
  }
  const raw = values.maxAttendees;
  const n = raw === "" || raw === undefined || raw === null ? NaN : Number(raw);
  if (!Number.isInteger(n) || n <= 0) {
    errors.maxAttendees = "Max attendees must be a positive whole number";
  }
  return errors;
}
`,
    explanation:
      "Returning an errors object keyed by field maps directly to UI: `{errors.name && <p role=\"alert\">{errors.name}</p>}`. Trimming catches 'spaces only' input. HTML inputs always give strings, so numeric validation must convert and reject `NaN`, decimals and non-positive values. This is the same rule set you would express in Zod (`z.string().trim().min(1)`, `z.coerce.number().int().positive()`). Client-side validation is for UX; the server must validate again.",
    lessonId: "forms-validation",
  },
  {
    id: "ch-forms-email",
    topic: "forms-crud",
    title: "Email validation for the register form",
    difficulty: "beginner",
    scenario:
      "The register form should catch obvious email typos before calling `POST /api/auth/register`.",
    requirements: [
      "Implement `isValidEmail(email)` returning a boolean.",
      "Trim the input first.",
      "Valid means: no spaces, exactly one `@`, a non-empty local part, and a domain containing a dot with text on both sides (e.g. `ada@campus.ac.uk`).",
      "Use the regex `/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/` or equivalent logic.",
    ],
    language: "js",
    starterCode: `function isValidEmail(email) {
  // TODO
  return true;
}
`,
    examples: `\`\`\`js
isValidEmail("ada@campus.ac.uk"); // true
isValidEmail("ada@campus");       // false
isValidEmail("ada smith@x.uk");   // false
\`\`\``,
    tests: [
      {
        name: "accepts normal addresses",
        code: `assertEqual(isValidEmail("ada@campus.ac.uk"), true);
assertEqual(isValidEmail("w1234567@my.westminster.ac.uk"), true);`,
      },
      {
        name: "rejects missing domain dot or @",
        code: `assertEqual(isValidEmail("ada@campus"), false);
assertEqual(isValidEmail("ada.campus.ac.uk"), false);`,
      },
      {
        name: "trims surrounding whitespace",
        code: `assertEqual(isValidEmail("  ada@campus.ac.uk  "), true);`,
      },
      {
        name: "rejects spaces, double @ and empty",
        hidden: true,
        code: `assertEqual(isValidEmail("ada smith@x.uk"), false);
assertEqual(isValidEmail("ada@@campus.uk"), false);
assertEqual(isValidEmail(""), false);
assertEqual(isValidEmail("@campus.uk"), false);`,
      },
      {
        name: "rejects a trailing dot domain",
        hidden: true,
        code: `assertEqual(isValidEmail("ada@campus."), false);`,
      },
    ],
    hints: [
      "`[^\\s@]+` means 'one or more characters that are not whitespace and not @'.",
      "Anchor the pattern with `^` and `$` so the WHOLE string must match.",
      "`return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email.trim());`",
    ],
    solution: `function isValidEmail(email) {
  return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(String(email).trim());
}
`,
    explanation:
      "A pragmatic email check catches typos without rejecting valid but unusual addresses (the full RFC grammar is huge). Anchors `^...$` prevent partial matches. `<input type=\"email\">` gives similar built-in browser validation, and Zod offers `z.email()`. The only real proof that an address works is sending a confirmation email, server-side.",
    lessonId: "forms-validation",
  },

  /* ================================================================ */
  /* TanStack Query concepts                                           */
  /* ================================================================ */
  {
    id: "ch-tq-is-stale",
    topic: "tanstack-query",
    title: "Cache freshness: isStale",
    difficulty: "intermediate",
    scenario:
      "TanStack Query decides whether cached data is fresh using `dataUpdatedAt` and `staleTime`. Fresh data is served from cache without refetching on mount/focus; stale data is still shown but refetched in the background.",
    requirements: [
      "Implement `isStale(updatedAt, staleTime, now)` (all in milliseconds).",
      "If `updatedAt` is `null`/`undefined` (no data yet), return `true`.",
      "Otherwise data is stale when `now >= updatedAt + staleTime`.",
      "`staleTime: 0` (the default) means stale immediately; `staleTime: Infinity` means never stale.",
      "Also implement `timeUntilStale(updatedAt, staleTime, now)` returning the remaining ms, never below 0 (return 0 when there is no data).",
    ],
    language: "js",
    starterCode: `function isStale(updatedAt, staleTime, now) {
  // TODO
  return false;
}

function timeUntilStale(updatedAt, staleTime, now) {
  // TODO
  return 0;
}
`,
    examples: `\`\`\`js
isStale(1000, 5000, 3000); // false (fresh for another 3000ms)
isStale(1000, 5000, 6000); // true
isStale(1000, 0, 1000);    // true  (default staleTime 0)
\`\`\``,
    tests: [
      {
        name: "fresh within staleTime",
        code: `assertEqual(isStale(1000, 5000, 3000), false);
assertEqual(timeUntilStale(1000, 5000, 3000), 3000);`,
      },
      {
        name: "stale after staleTime",
        code: `assertEqual(isStale(1000, 5000, 6000), true);
assertEqual(isStale(1000, 5000, 7000), true);
assertEqual(timeUntilStale(1000, 5000, 7000), 0);`,
      },
      {
        name: "staleTime 0 is stale immediately",
        code: `assertEqual(isStale(1000, 0, 1000), true);`,
      },
      {
        name: "Infinity is never stale",
        hidden: true,
        code: `assertEqual(isStale(1000, Infinity, 1e12), false);`,
      },
      {
        name: "no data is stale",
        hidden: true,
        code: `assertEqual(isStale(null, 60000, 5), true);
assertEqual(isStale(undefined, 60000, 5), true);
assertEqual(timeUntilStale(null, 60000, 5), 0);`,
      },
    ],
    hints: [
      "The moment data turns stale is `updatedAt + staleTime`.",
      "`Infinity + 1000` is still `Infinity`, so the comparison handles it naturally.",
      "`timeUntilStale` is `Math.max(updatedAt + staleTime - now, 0)`.",
    ],
    solution: `function isStale(updatedAt, staleTime, now) {
  if (updatedAt === null || updatedAt === undefined) return true;
  return now >= updatedAt + staleTime;
}

function timeUntilStale(updatedAt, staleTime, now) {
  if (updatedAt === null || updatedAt === undefined) return 0;
  return Math.max(updatedAt + staleTime - now, 0);
}
`,
    explanation:
      "`staleTime` controls freshness: while fresh, mounting a new observer or refocusing the window does not refetch. With the default `staleTime: 0`, data is stale right away, so TanStack Query shows the cached data instantly and refetches in the background. This is different from `gcTime` (default 5 minutes), which controls how long INACTIVE cache entries (no observers) are kept before being garbage-collected.",
    lessonId: "tq-stale-gc",
  },
  {
    id: "ch-tq-query-keys",
    topic: "tanstack-query",
    title: "Query-key factory and prefix matching",
    difficulty: "intermediate",
    scenario:
      "`invalidateQueries({ queryKey: [\"events\", \"list\"] })` matches every key that STARTS with that prefix. A query-key factory keeps keys consistent across the app.",
    requirements: [
      "Create `const eventKeys` with: `all` = `[\"events\"]`, `lists()` = `[\"events\", \"list\"]`, `list(filters)` = `[\"events\", \"list\", filters]`, `details()` = `[\"events\", \"detail\"]`, `detail(id)` = `[\"events\", \"detail\", id]`.",
      "Implement `isKeyPrefix(prefix, key)`: true when `prefix` is no longer than `key` and every element of `prefix` equals the element at the same index of `key` (compare elements with `JSON.stringify`).",
    ],
    language: "js",
    starterCode: `const eventKeys = {
  all: ["events"],
  // TODO: lists, list, details, detail
};

function isKeyPrefix(prefix, key) {
  // TODO
  return false;
}
`,
    examples: `\`\`\`js
eventKeys.list({ category: "music" }); // ["events", "list", { category: "music" }]
isKeyPrefix(eventKeys.lists(), eventKeys.list({ category: "music" })); // true
isKeyPrefix(eventKeys.lists(), eventKeys.detail(3));                   // false
\`\`\``,
    tests: [
      {
        name: "factory produces hierarchical keys",
        code: `assertEqual(eventKeys.all, ["events"]);
assertEqual(eventKeys.lists(), ["events", "list"]);
assertEqual(eventKeys.list({ category: "music" }), ["events", "list", { category: "music" }]);
assertEqual(eventKeys.detail(42), ["events", "detail", 42]);
assertEqual(eventKeys.details(), ["events", "detail"]);`,
      },
      {
        name: "prefix matching like invalidateQueries",
        code: `assertEqual(isKeyPrefix(eventKeys.all, eventKeys.detail(1)), true);
assertEqual(isKeyPrefix(eventKeys.lists(), eventKeys.list({ q: "jazz" })), true);
assertEqual(isKeyPrefix(eventKeys.lists(), eventKeys.detail(1)), false);`,
      },
      {
        name: "different ids do not match",
        hidden: true,
        code: `assertEqual(isKeyPrefix(eventKeys.detail(1), eventKeys.detail(2)), false);
assertEqual(isKeyPrefix(eventKeys.detail(1), eventKeys.detail(1)), true);`,
      },
      {
        name: "longer prefix never matches; empty prefix matches everything",
        hidden: true,
        code: `assertEqual(isKeyPrefix(eventKeys.detail(1), eventKeys.all), false);
assertEqual(isKeyPrefix([], eventKeys.detail(1)), true);`,
      },
      {
        name: "factory returns fresh arrays",
        hidden: true,
        code: `const a = eventKeys.lists();
a.push("mutated");
assertEqual(eventKeys.lists(), ["events", "list"]);`,
      },
    ],
    hints: [
      "Build each level from the previous one: `lists: () => [...eventKeys.all, \"list\"]`.",
      "In `isKeyPrefix`, first check `prefix.length <= key.length`.",
      "`return prefix.every((part, i) => JSON.stringify(part) === JSON.stringify(key[i]));`",
    ],
    solution: `const eventKeys = {
  all: ["events"],
  lists: () => [...eventKeys.all, "list"],
  list: (filters) => [...eventKeys.lists(), filters],
  details: () => [...eventKeys.all, "detail"],
  detail: (id) => [...eventKeys.details(), id],
};

function isKeyPrefix(prefix, key) {
  if (prefix.length > key.length) return false;
  return prefix.every((part, i) => JSON.stringify(part) === JSON.stringify(key[i]));
}
`,
    explanation:
      "Query keys are arrays that identify cache entries; they are hashed deterministically, so `[\"events\", \"list\", { category: \"music\" }]` is a distinct entry per filter. Hierarchical keys let you invalidate broadly (`eventKeys.all` after any change) or narrowly (`eventKeys.detail(id)` after editing one event). The real `partialMatchKey` also compares objects regardless of property order. Note `JSON.stringify` is order-sensitive, a simplification here.",
    lessonId: "tq-usequery-keys",
  },

  /* ================================================================ */
  /* Zustand concepts                                                  */
  /* ================================================================ */
  {
    id: "ch-zustand-create-store",
    topic: "zustand",
    title: "Build a tiny createStore",
    difficulty: "advanced",
    scenario:
      "Zustand's core is a small vanilla store: state in a closure, a `setState` that merges, and listeners. Build your own to understand what `create` does under the hood.",
    requirements: [
      "Implement `createStore(initializer)`; call `initializer(setState, getState)` to get the initial state.",
      "Return `{ getState, setState, subscribe }`.",
      "`setState(partial)` accepts an object OR a function `(state) => partial`, and shallow-merges the partial into a NEW state object.",
      "Listeners are called with `(nextState, previousState)` only if at least one key in the partial differs from the current state (by `Object.is`). Otherwise do nothing (keep the same state reference).",
      "`subscribe(listener)` returns an unsubscribe function.",
    ],
    language: "js",
    starterCode: `function createStore(initializer) {
  let state;
  const listeners = new Set();
  // TODO: getState, setState, subscribe
  state = initializer(() => {}, () => state);
  return { getState: () => state, setState: () => {}, subscribe: () => () => {} };
}
`,
    examples: `\`\`\`js
const store = createStore((set, get) => ({
  count: 0,
  increment: () => set({ count: get().count + 1 }),
}));
store.getState().increment();
store.getState().count; // 1
\`\`\``,
    tests: [
      {
        name: "actions update state via set/get",
        code: `const store = createStore((set, get) => ({
  count: 0,
  increment: () => set({ count: get().count + 1 }),
}));
store.getState().increment();
store.getState().increment();
assertEqual(store.getState().count, 2);`,
      },
      {
        name: "setState merges and creates a new object",
        code: `const store = createStore(() => ({ user: null, theme: "light" }));
const before = store.getState();
store.setState({ theme: "dark" });
assertEqual(store.getState().theme, "dark");
assertEqual(store.getState().user, null, "other keys are kept");
assert(store.getState() !== before, "state must be a new object");
assertEqual(before.theme, "light", "old state is not mutated");`,
      },
      {
        name: "listeners receive next and previous state; unsubscribe works",
        code: `const store = createStore(() => ({ count: 0 }));
const calls = [];
const unsubscribe = store.subscribe((next, prev) => calls.push([prev.count, next.count]));
store.setState((s) => ({ count: s.count + 1 }));
unsubscribe();
store.setState({ count: 10 });
assertEqual(calls, [[0, 1]]);`,
      },
      {
        name: "no notification when nothing changes",
        hidden: true,
        code: `const store = createStore(() => ({ count: 5, label: "x" }));
let notified = 0;
store.subscribe(() => notified++);
const before = store.getState();
store.setState({ count: 5 });
store.setState((s) => ({ label: s.label }));
assertEqual(notified, 0);
assert(store.getState() === before, "state reference should not change");`,
      },
      {
        name: "multiple listeners",
        hidden: true,
        code: `const store = createStore(() => ({ n: 0 }));
let a = 0, b = 0;
store.subscribe(() => a++);
store.subscribe(() => b++);
store.setState({ n: 1 });
assertEqual([a, b], [1, 1]);`,
      },
    ],
    hints: [
      "Resolve the partial first: `const partial = typeof update === \"function\" ? update(state) : update;`",
      "Detect change: `Object.keys(partial).some((k) => !Object.is(partial[k], state[k]))`.",
      "Then `const prev = state; state = { ...state, ...partial }; listeners.forEach((l) => l(state, prev));`",
    ],
    solution: `function createStore(initializer) {
  let state;
  const listeners = new Set();

  const getState = () => state;

  const setState = (update) => {
    const partial = typeof update === "function" ? update(state) : update;
    const changed = Object.keys(partial).some((key) => !Object.is(partial[key], state[key]));
    if (!changed) return;
    const previous = state;
    state = { ...state, ...partial };
    listeners.forEach((listener) => listener(state, previous));
  };

  const subscribe = (listener) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  };

  state = initializer(setState, getState);
  return { getState, setState, subscribe };
}
`,
    explanation:
      "This mirrors Zustand's vanilla store: state lives in a closure, `set` shallow-merges (so you only pass the keys that change, but nested objects must still be copied immutably), and subscribers are notified. Real Zustand skips notifying only when the next state is `Object.is`-equal to the current one; our version adds a per-key check for clarity. React's `useStore` hook subscribes a component to this store and re-renders it when its selected slice changes.",
    lessonId: "zustand-basics",
  },
  {
    id: "ch-zustand-selector-subscribe",
    topic: "zustand",
    title: "Selector subscriptions with Object.is",
    difficulty: "advanced",
    scenario:
      "`useCartStore((s) => s.items.length)` only re-renders when the selected value changes. Implement the subscription logic behind that.",
    requirements: [
      "Implement `subscribeWithSelector(store, selector, listener)`. `store` has `getState()` and `subscribe(fn)` (which returns an unsubscribe function).",
      "Remember the current selected value `selector(store.getState())`.",
      "On every store change, compute the new selected value; call `listener(nextSelected, previousSelected)` ONLY if `!Object.is(next, previous)`, then remember the new value.",
      "Return the unsubscribe function.",
    ],
    language: "js",
    starterCode: `function subscribeWithSelector(store, selector, listener) {
  // TODO
  return store.subscribe(() => listener());
}
`,
    examples: `\`\`\`js
const unsub = subscribeWithSelector(cartStore, (s) => s.items.length, (n) => {
  console.log("badge count", n);
});
\`\`\``,
    tests: [
      {
        name: "notifies only when the selected value changes",
        code: `let state = { count: 0, theme: "light" };
const subs = new Set();
const store = { getState: () => state, subscribe: (fn) => { subs.add(fn); return () => subs.delete(fn); } };
const set = (partial) => { state = { ...state, ...partial }; subs.forEach((fn) => fn(state)); };
const calls = [];
subscribeWithSelector(store, (s) => s.count, (next, prev) => calls.push([prev, next]));
set({ theme: "dark" });
set({ count: 1 });
set({ theme: "light" });
assertEqual(calls, [[0, 1]]);`,
      },
      {
        name: "unsubscribe stops notifications",
        code: `let state = { count: 0 };
const subs = new Set();
const store = { getState: () => state, subscribe: (fn) => { subs.add(fn); return () => subs.delete(fn); } };
const set = (partial) => { state = { ...state, ...partial }; subs.forEach((fn) => fn(state)); };
let calls = 0;
const unsubscribe = subscribeWithSelector(store, (s) => s.count, () => calls++);
set({ count: 1 });
unsubscribe();
set({ count: 2 });
assertEqual(calls, 1);`,
      },
      {
        name: "selectors returning new objects notify every time (why useShallow exists)",
        hidden: true,
        code: `let state = { a: 1, b: 2, other: 0 };
const subs = new Set();
const store = { getState: () => state, subscribe: (fn) => { subs.add(fn); return () => subs.delete(fn); } };
const set = (partial) => { state = { ...state, ...partial }; subs.forEach((fn) => fn(state)); };
let calls = 0;
subscribeWithSelector(store, (s) => ({ a: s.a, b: s.b }), () => calls++);
set({ other: 1 });
set({ other: 2 });
assertEqual(calls, 2, "a new object literal is never Object.is-equal to the previous one");`,
      },
      {
        name: "NaN is treated as unchanged (Object.is semantics)",
        hidden: true,
        code: `let state = { v: NaN, x: 0 };
const subs = new Set();
const store = { getState: () => state, subscribe: (fn) => { subs.add(fn); return () => subs.delete(fn); } };
const set = (partial) => { state = { ...state, ...partial }; subs.forEach((fn) => fn(state)); };
let calls = 0;
subscribeWithSelector(store, (s) => s.v, () => calls++);
set({ x: 1 });
assertEqual(calls, 0);`,
      },
    ],
    hints: [
      "Keep a variable `let current = selector(store.getState());` in the closure.",
      "Inside the store listener: `const next = selector(store.getState()); if (!Object.is(next, current)) { ... }`.",
      "Update `current` BEFORE or AFTER calling the listener, but pass the old value as `previous`.",
    ],
    solution: `function subscribeWithSelector(store, selector, listener) {
  let current = selector(store.getState());
  return store.subscribe(() => {
    const next = selector(store.getState());
    if (!Object.is(next, current)) {
      const previous = current;
      current = next;
      listener(next, previous);
    }
  });
}
`,
    explanation:
      "A component using `useStore(selector)` re-renders only when the selected slice changes by `Object.is`. Selecting a primitive (`s.items.length`) or a stable reference (`s.items`) avoids needless renders. A selector that builds a new object/array each time (`s => ({ a: s.a, b: s.b })`) is never equal, which causes extra renders (and in Zustand v5 can trigger an infinite loop warning); `useShallow` fixes this by comparing the object's top-level values instead.",
    lessonId: "zustand-selectors",
  },

  /* ================================================================ */
  /* Security                                                          */
  /* ================================================================ */
  {
    id: "ch-sec-jwt-expiry",
    topic: "security",
    title: "Decode a JWT payload and check expiry",
    difficulty: "advanced",
    scenario:
      "The login response contains a JWT. The frontend may DECODE the payload (it is only Base64URL-encoded, not encrypted) to read `exp` and log the user out proactively. It cannot VERIFY the signature; only the server can.",
    requirements: [
      "Implement `decodeJwtPayload(token: string): Record<string, unknown>`.",
      "The token has 3 dot-separated parts; otherwise throw `new Error(\"Malformed token\")`.",
      "Convert the Base64URL payload to Base64 (`-` → `+`, `_` → `/`, add `=` padding to a multiple of 4), decode with `atob`, then `JSON.parse`.",
      "Implement `isExpired(token: string, nowSeconds: number): boolean`: `exp` is in SECONDS since epoch; expired when `nowSeconds >= exp`. A missing/non-numeric `exp` counts as expired.",
    ],
    language: "ts",
    starterCode: `function decodeJwtPayload(token: string): Record<string, unknown> {
  // TODO: split, Base64URL -> Base64, atob, JSON.parse
  return {};
}

function isExpired(token: string, nowSeconds: number): boolean {
  // TODO
  return false;
}
`,
    examples: `\`\`\`ts
// header.payload.signature  (fictional token)
const payload = decodeJwtPayload(token);
// { sub: "u-1", role: "ADMIN", exp: 1795000000 }
isExpired(token, 1794999999); // false
isExpired(token, 1795000000); // true
\`\`\``,
    tests: [
      {
        name: "decodes the payload",
        code: `const enc = (obj) => btoa(JSON.stringify(obj)).split("+").join("-").split("/").join("_").replace(/=+$/, "");
const token = enc({ alg: "HS256", typ: "JWT" }) + "." + enc({ sub: "u-1", role: "ADMIN", exp: 1795000000 }) + ".fake-signature";
assertEqual(decodeJwtPayload(token), { sub: "u-1", role: "ADMIN", exp: 1795000000 });`,
      },
      {
        name: "isExpired compares seconds",
        code: `const enc = (obj) => btoa(JSON.stringify(obj)).split("+").join("-").split("/").join("_").replace(/=+$/, "");
const token = enc({ alg: "HS256", typ: "JWT" }) + "." + enc({ sub: "u-1", exp: 1795000000 }) + ".fake-signature";
assertEqual(isExpired(token, 1794999999), false);
assertEqual(isExpired(token, 1795000000), true);
assertEqual(isExpired(token, 1795000500), true);`,
      },
      {
        name: "handles Base64URL characters and missing padding",
        hidden: true,
        code: `const raw = btoa(JSON.stringify({ name: "Ada ~~~>>>???", exp: 1 }));
const urlSafe = raw.split("+").join("-").split("/").join("_").replace(/=+$/, "");
assert(urlSafe.indexOf("-") !== -1 || urlSafe.indexOf("_") !== -1, "test token should contain URL-safe characters");
const token = "eyJhbGciOiJIUzI1NiJ9." + urlSafe + ".fake-signature";
assertEqual(decodeJwtPayload(token), { name: "Ada ~~~>>>???", exp: 1 });`,
      },
      {
        name: "malformed tokens throw; missing exp counts as expired",
        hidden: true,
        code: `let message = "";
try { decodeJwtPayload("not-a-jwt"); } catch (e) { message = e.message; }
assertEqual(message, "Malformed token");
const enc = (obj) => btoa(JSON.stringify(obj)).split("+").join("-").split("/").join("_").replace(/=+$/, "");
const noExp = enc({ alg: "HS256" }) + "." + enc({ sub: "u-2" }) + ".fake-signature";
assertEqual(isExpired(noExp, 0), true);`,
      },
    ],
    hints: [
      "`const parts = token.split(\".\"); if (parts.length !== 3) throw new Error(\"Malformed token\");`",
      "`let b64 = parts[1].replace(/-/g, \"+\").replace(/_/g, \"/\"); while (b64.length % 4 !== 0) b64 += \"=\";`",
      "JWT `exp` is in seconds; `Date.now()` is in milliseconds, so real code uses `Math.floor(Date.now() / 1000)`.",
    ],
    solution: `function decodeJwtPayload(token: string): Record<string, unknown> {
  const parts = token.split(".");
  if (parts.length !== 3) throw new Error("Malformed token");
  let b64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
  while (b64.length % 4 !== 0) b64 += "=";
  return JSON.parse(atob(b64)) as Record<string, unknown>;
}

function isExpired(token: string, nowSeconds: number): boolean {
  const { exp } = decodeJwtPayload(token);
  if (typeof exp !== "number") return true;
  return nowSeconds >= exp;
}
`,
    explanation:
      "A JWT is `base64url(header).base64url(payload).signature`. Anyone can decode the payload, so never put secrets in it, and a signed JWT is NOT encrypted. Decoding is not verifying: the signature check needs the server's secret/key, so the client must never trust its own decoding for authorisation decisions. Checking `exp` on the client is purely UX (log out before the API returns 401). Note `atob` decodes to Latin-1; real code handling non-ASCII claims would add a `TextDecoder` step.",
    lessonId: "sec-jwt-anatomy",
  },
  {
    id: "ch-sec-can-access",
    topic: "security",
    title: "canAccess: role-based route check (UX only)",
    difficulty: "intermediate",
    scenario:
      "A `ProtectedRoute` component decides whether to render a page or `<Navigate to=\"/login\" />`. The decision logic is a pure function you can test.",
    requirements: [
      "Implement `canAccess(user, route)`. `user` is `null` (logged out) or `{ id, role }` with role `\"USER\"` or `\"ADMIN\"`.",
      "`route` is `{ path, public?: boolean, roles?: string[] }`.",
      "Public routes (`public: true`) are always accessible.",
      "Otherwise a logged-out user (`null`) cannot access.",
      "If `roles` is missing or empty, any logged-in user can access; otherwise `user.role` must be in `roles`.",
    ],
    language: "js",
    starterCode: `function canAccess(user, route) {
  // TODO
  return true;
}
`,
    examples: `\`\`\`js
canAccess(null, { path: "/events", public: true });                        // true
canAccess(null, { path: "/my-bookings" });                                 // false
canAccess({ id: 1, role: "USER" }, { path: "/admin", roles: ["ADMIN"] }); // false
\`\`\``,
    tests: [
      {
        name: "public routes are open to everyone",
        code: `assertEqual(canAccess(null, { path: "/events", public: true }), true);
assertEqual(canAccess({ id: 1, role: "USER" }, { path: "/events", public: true }), true);`,
      },
      {
        name: "protected routes need a logged-in user",
        code: `assertEqual(canAccess(null, { path: "/my-bookings" }), false);
assertEqual(canAccess({ id: 1, role: "USER" }, { path: "/my-bookings" }), true);`,
      },
      {
        name: "role-restricted routes",
        code: `const adminRoute = { path: "/admin/events", roles: ["ADMIN"] };
assertEqual(canAccess({ id: 1, role: "USER" }, adminRoute), false);
assertEqual(canAccess({ id: 2, role: "ADMIN" }, adminRoute), true);`,
      },
      {
        name: "empty roles array means any logged-in user",
        hidden: true,
        code: `assertEqual(canAccess({ id: 1, role: "USER" }, { path: "/profile", roles: [] }), true);
assertEqual(canAccess(null, { path: "/profile", roles: [] }), false);`,
      },
      {
        name: "logged-out user on an admin route",
        hidden: true,
        code: `assertEqual(canAccess(null, { path: "/admin", roles: ["ADMIN"] }), false);`,
      },
    ],
    hints: [
      "Check in order: public → logged in → roles.",
      "`if (!route.roles || route.roles.length === 0) return true;`",
      "`return route.roles.includes(user.role);`",
    ],
    solution: `function canAccess(user, route) {
  if (route.public) return true;
  if (!user) return false;
  if (!route.roles || route.roles.length === 0) return true;
  return route.roles.includes(user.role);
}
`,
    explanation:
      "This logic decides what to SHOW, not what is allowed. Anyone can edit JavaScript, local storage or the decoded role in DevTools, so frontend guards are a user-experience feature (hide admin buttons, redirect early). Real enforcement happens on the server: the API must verify the JWT signature and check the role (`[Authorize(Roles = \"ADMIN\")]`), returning 401 for missing/invalid tokens and 403 for authenticated users without permission.",
    lessonId: "sec-trust-boundaries",
  },
  {
    id: "ch-sec-status-action",
    topic: "security",
    title: "Choose the UI action for an HTTP status",
    difficulty: "beginner",
    scenario:
      "A central API error handler maps status codes to what the UI should do: send the user to log in, show 'forbidden', show 'not found', or suggest trying later.",
    requirements: [
      "Implement `actionForStatus(status)`.",
      "200–299 → `\"ok\"`.",
      "401 → `\"reauthenticate\"`; 403 → `\"forbidden\"`; 404 → `\"not-found\"`.",
      "500–599 → `\"retry-later\"`.",
      "Any other status → `\"show-error\"`.",
    ],
    language: "js",
    starterCode: `function actionForStatus(status) {
  // TODO
  return "show-error";
}
`,
    examples: `\`\`\`js
actionForStatus(401); // "reauthenticate"  (missing / expired / invalid token)
actionForStatus(403); // "forbidden"       (logged in, but not allowed)
actionForStatus(503); // "retry-later"
\`\`\``,
    tests: [
      {
        name: "401 vs 403",
        code: `assertEqual(actionForStatus(401), "reauthenticate");
assertEqual(actionForStatus(403), "forbidden");`,
      },
      {
        name: "404 and 5xx",
        code: `assertEqual(actionForStatus(404), "not-found");
assertEqual(actionForStatus(500), "retry-later");
assertEqual(actionForStatus(503), "retry-later");`,
      },
      {
        name: "success codes",
        code: `assertEqual(actionForStatus(200), "ok");
assertEqual(actionForStatus(201), "ok");
assertEqual(actionForStatus(204), "ok");`,
      },
      {
        name: "other client errors and boundaries",
        hidden: true,
        code: `assertEqual(actionForStatus(400), "show-error");
assertEqual(actionForStatus(409), "show-error");
assertEqual(actionForStatus(599), "retry-later");
assertEqual(actionForStatus(600), "show-error");
assertEqual(actionForStatus(299), "ok");
assertEqual(actionForStatus(300), "show-error");`,
      },
    ],
    hints: [
      "Handle the exact codes (401, 403, 404) before the ranges.",
      "Ranges: `status >= 200 && status < 300`, `status >= 500 && status < 600`.",
      "Fall through to `\"show-error\"` at the end.",
    ],
    solution: `function actionForStatus(status) {
  if (status >= 200 && status < 300) return "ok";
  if (status === 401) return "reauthenticate";
  if (status === 403) return "forbidden";
  if (status === 404) return "not-found";
  if (status >= 500 && status < 600) return "retry-later";
  return "show-error";
}
`,
    explanation:
      "401 Unauthorized really means *unauthenticated*: no token, or an invalid/expired one, so the fix is to log in again (clear the stored token, redirect to /login). 403 Forbidden means the server knows who you are but you lack permission; logging in again will not help. 404 means the resource does not exist. 5xx are server faults that may be temporary, so retrying later is reasonable. TanStack Query's default retry would retry 4xx too, so many apps customise `retry` to skip 4xx.",
    lessonId: "sec-401-403-expiry",
  },
];
