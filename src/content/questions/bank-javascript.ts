import type { Question } from "../types";

/** Markdown code fence helper (avoids escaping triple backticks everywhere). */
const F = "```";

export const javascriptQuestions: Question[] = [
  /* ---------------------------------------------------------------- */
  /* Array methods                                                     */
  /* ---------------------------------------------------------------- */
  {
    id: "js-001",
    type: "mcq",
    topic: "javascript",
    subtopic: "Array reduce",
    difficulty: "beginner",
    marks: 1,
    minutes: 1,
    prompt: `A ticket basket stores a price and a quantity for each line. What is the value of \`total\`?

${F}js
const basket = [
  { price: 4, qty: 2 },
  { price: 10, qty: 1 },
  { price: 3, qty: 3 },
];
const total = basket.reduce((sum, line) => sum + line.price * line.qty, 0);
${F}`,
    options: ["17", "[8, 10, 9]", "27", "NaN"],
    answer: 2,
    distractorNotes: {
      0: "17 is the sum of the prices only; the callback multiplies each price by its quantity (8 + 10 + 9).",
      1: "That is what `map(line => line.price * line.qty)` would return. `reduce` folds the array into a single value.",
      3: "The initial value `0` is a number and every term is a number, so no NaN is produced.",
    },
    explanation:
      "`reduce` starts the accumulator at `0` and adds `price * qty` for each line: 0 + 8 = 8, 8 + 10 = 18, 18 + 9 = **27**.",
    lessonId: "js-array-reduce",
    source: "practice",
  },
  {
    id: "js-002",
    type: "mcq",
    topic: "javascript",
    subtopic: "Array reduce",
    difficulty: "advanced",
    marks: 1,
    minutes: 2,
    prompt: `What is logged?

${F}js
const cart = [{ price: 4 }, { price: 10 }];
const total = cart.reduce((sum, item) => sum + item.price);
console.log(total);
${F}`,
    options: ["14", "\"[object Object]10\"", "NaN", "TypeError: reduce of empty array"],
    answer: 1,
    distractorNotes: {
      0: "14 would need an initial value of `0`. Without it, the first accumulator is the first element (an object).",
      2: "Object + number does not give NaN here: the object is converted to the string \"[object Object]\" and `+` concatenates.",
      3: "That error only occurs when reduce is called on an EMPTY array with no initial value. This array has two items.",
    },
    explanation: `With no initial value, \`reduce\` uses \`cart[0]\` (the object \`{ price: 4 }\`) as the first accumulator and starts at index 1.
The single callback call computes \`{ price: 4 } + 10\`. The object is converted to the string \`"[object Object]"\` and \`+\` concatenates, giving \`"[object Object]10"\`.
Always pass an initial value (here \`0\`) when reducing objects to a number.`,
    lessonId: "js-array-reduce",
    source: "practice",
    misconception: "reduce without an initial value starts at 0",
  },
  {
    id: "js-003",
    type: "mcq",
    topic: "javascript",
    subtopic: "find vs filter",
    difficulty: "beginner",
    marks: 1,
    minutes: 1,
    prompt: `What does \`result\` hold?

${F}js
const capacities = [5, 12, 8, 130];
const result = capacities.find(n => n > 10);
${F}`,
    options: ["[12, 130]", "true", "130", "12"],
    answer: 3,
    distractorNotes: {
      0: "That is the result of `filter`, which returns ALL matching elements in a new array.",
      1: "`some` returns a boolean; `find` returns the element itself.",
      2: "`find` stops at the FIRST match scanning from index 0, which is 12.",
    },
    explanation:
      "`find` returns the first element for which the callback returns a truthy value (here `12`), or `undefined` if none match.",
    lessonId: "js-array-methods",
    source: "practice",
    misconception: "find returns all matches",
  },
  {
    id: "js-004",
    type: "mcq",
    topic: "javascript",
    subtopic: "some / every",
    difficulty: "intermediate",
    marks: 1,
    minutes: 1,
    prompt: `What is logged?

${F}js
const scores = [45, 72, 90];
console.log(scores.some(s => s < 50), scores.every(s => s > 45));
${F}`,
    options: ["true true", "true false", "false true", "false false"],
    answer: 1,
    distractorNotes: {
      0: "`every(s => s > 45)` fails for 45 because 45 is not strictly greater than 45.",
      2: "`some(s => s < 50)` is true because 45 < 50.",
      3: "At least one element (45) is below 50, so `some` is true.",
    },
    explanation:
      "`some` is true if ANY element passes (45 < 50). `every` is true only if ALL pass; 45 > 45 is false, so `every` returns `false`.",
    lessonId: "js-array-methods",
    source: "practice",
  },
  {
    id: "js-005",
    type: "mcq",
    topic: "javascript",
    subtopic: "sort mutation",
    difficulty: "exam",
    marks: 1,
    minutes: 2,
    prompt: `What is logged?

${F}js
const nums = [10, 1, 5, 100];
const sorted = nums.sort();
console.log(nums, sorted === nums);
${F}`,
    options: ["[1, 5, 10, 100] true", "[10, 1, 5, 100] false", "[1, 5, 10, 100] false", "[1, 10, 100, 5] true"],
    answer: 3,
    distractorNotes: {
      0: "Without a comparator, `sort` compares elements as STRINGS, so \"100\" comes before \"5\".",
      1: "`sort` mutates the original array in place; `nums` is changed.",
      2: "Both the order (string comparison) and the identity are wrong: `sort` returns the same array object.",
    },
    explanation: `\`sort()\` with no comparator converts elements to strings and compares UTF-16 order: "1" < "10" < "100" < "5".
It sorts **in place** and returns the same array reference, so \`sorted === nums\` is \`true\`.
Use \`[...nums].sort((a, b) => a - b)\` (or \`nums.toSorted((a, b) => a - b)\`) for a numeric, non-mutating sort.`,
    lessonId: "js-array-methods",
    source: "practice",
    misconception: "sort() sorts numbers numerically and returns a copy",
  },
  {
    id: "js-006",
    type: "mcq",
    topic: "javascript",
    subtopic: "slice vs splice",
    difficulty: "intermediate",
    marks: 1,
    minutes: 1,
    prompt: `What is logged?

${F}js
const letters = ["a", "b", "c", "d", "e"];
const removed = letters.splice(1, 2);
console.log(removed, letters);
${F}`,
    options: [
      "[\"b\", \"c\"] [\"a\", \"d\", \"e\"]",
      "[\"b\"] [\"a\", \"c\", \"d\", \"e\"]",
      "[\"b\", \"c\"] [\"a\", \"b\", \"c\", \"d\", \"e\"]",
      "[\"a\", \"d\", \"e\"] [\"b\", \"c\"]",
    ],
    answer: 0,
    distractorNotes: {
      1: "That is how `slice(1, 2)` treats its second argument (end index). For `splice`, the second argument is a COUNT: remove 2 items.",
      2: "`splice` mutates the original array; `slice` would leave it unchanged.",
      3: "`splice` returns the REMOVED elements; the original array keeps the rest.",
    },
    explanation:
      "`splice(start, deleteCount)` removes `deleteCount` items starting at `start` from the ORIGINAL array and returns them. `slice(start, end)` copies without mutating.",
    lessonId: "js-array-methods",
    source: "practice",
    misconception: "splice and slice behave the same",
  },
  {
    id: "js-007",
    type: "tf",
    topic: "javascript",
    subtopic: "slice vs splice",
    difficulty: "beginner",
    marks: 1,
    minutes: 1,
    prompt:
      "`const page = items.slice(1, 3);` returns a new array containing the elements at index 1 and 2, and leaves `items` unchanged.",
    answer: true,
    explanation:
      "`slice(start, end)` copies from `start` up to but **not including** `end`, and never mutates the source array. That makes it safe for React state.",
    lessonId: "js-array-methods",
    source: "practice",
  },
  {
    id: "js-008",
    type: "mcq",
    topic: "javascript",
    subtopic: "map and arrow returns",
    difficulty: "intermediate",
    marks: 1,
    minutes: 1,
    prompt: `What is \`doubled\`?

${F}js
const doubled = [1, 2, 3].map(n => { n * 2; });
${F}`,
    options: ["[2, 4, 6]", "[1, 2, 3]", "[undefined, undefined, undefined]", "[]"],
    answer: 2,
    distractorNotes: {
      0: "The arrow function has a block body `{ ... }` with no `return`, so nothing is returned.",
      1: "`map` uses the callback's RETURN value, not the original element.",
      3: "`map` always returns an array of the same length as the source.",
    },
    explanation:
      "Curly braces after `=>` start a block body. Without an explicit `return`, the callback returns `undefined` for every element. Write `n => n * 2` or `n => { return n * 2; }`.",
    lessonId: "js-array-methods",
    source: "practice",
    misconception: "arrow functions with braces return implicitly",
  },
  {
    id: "js-009",
    type: "mcq",
    topic: "javascript",
    subtopic: "?. and ??",
    difficulty: "intermediate",
    marks: 1,
    minutes: 2,
    prompt: `What are the three logged values?

${F}js
const user = { profile: { nickname: "" } };
console.log(user.profile?.nickname ?? "Guest");
console.log(user.profile?.nickname || "Guest");
console.log(user.settings?.theme ?? "light");
${F}`,
    options: [
      "\"Guest\", \"Guest\", \"light\"",
      "\"\", \"Guest\", TypeError",
      "\"Guest\", \"\", undefined",
      "\"\", \"Guest\", \"light\"",
    ],
    answer: 3,
    distractorNotes: {
      0: "`??` only falls back for `null` or `undefined`. An empty string is kept.",
      1: "`user.settings?.theme` short-circuits to `undefined` instead of throwing, so `??` gives \"light\".",
      2: "This swaps the behaviour of `??` and `||`: `||` falls back for any falsy value, including \"\".",
    },
    explanation: `- \`??\` (nullish coalescing) uses the right side only for \`null\`/\`undefined\`, so \`""\` is kept.
- \`||\` uses the right side for any falsy value (\`""\`, \`0\`, \`false\`...), so it gives "Guest".
- \`?.\` stops and returns \`undefined\` when \`user.settings\` is missing, then \`??\` supplies "light".`,
    lessonId: "js-spread-rest-destructuring",
    source: "practice",
    misconception: "?? and || are interchangeable",
  },
  {
    id: "js-010",
    type: "mcq",
    topic: "javascript",
    subtopic: "Destructuring defaults",
    difficulty: "advanced",
    marks: 1,
    minutes: 2,
    prompt: `What is logged?

${F}js
const event = { title: "Gig", price: null, tags: ["music", "live"] };
const { title, price = 10, tags: [first] = [] } = event;
console.log(title, price, first);
${F}`,
    options: ["Gig 10 music", "Gig null music", "Gig null [\"music\", \"live\"]", "Gig 10 undefined"],
    answer: 1,
    distractorNotes: {
      0: "Default values apply only when the value is `undefined`. `null` is a real value, so the default 10 is ignored.",
      2: "`tags: [first]` destructures the array further; `first` is its first element, not the whole array.",
      3: "`tags` exists, so the `= []` default is not used and `first` becomes \"music\".",
    },
    explanation:
      "Destructuring defaults are used only for `undefined`. `price` is `null`, so it stays `null`. `tags: [first]` takes the first element of the `tags` array: \"music\".",
    lessonId: "js-spread-rest-destructuring",
    source: "practice",
    misconception: "defaults replace null",
  },
  {
    id: "js-011",
    type: "mcq",
    topic: "javascript",
    subtopic: "Shallow copies",
    difficulty: "exam",
    marks: 1,
    minutes: 2,
    prompt: `What is logged?

${F}js
const original = { name: "Ana", address: { city: "Leeds" } };
const copy = { ...original };
copy.name = "Ben";
copy.address.city = "York";
console.log(original.name, original.address.city);
${F}`,
    options: ["Ana Leeds", "Ben York", "Ana York", "Ben Leeds"],
    answer: 2,
    distractorNotes: {
      0: "Spread is a SHALLOW copy: `copy.address` and `original.address` are the same object, so the city change is shared.",
      1: "`name` is a primitive copied into a new property, so reassigning `copy.name` does not touch `original.name`.",
      3: "Both parts are reversed: the top-level primitive is independent, the nested object is shared.",
    },
    explanation:
      "`{ ...original }` creates a new top-level object but copies nested objects **by reference**. In React you must also spread nested levels: `{ ...user, address: { ...user.address, city: \"York\" } }`.",
    lessonId: "js-references-copies",
    source: "practice",
    misconception: "spread makes a deep copy",
  },
  {
    id: "js-012",
    type: "tf",
    topic: "javascript",
    subtopic: "const and references",
    difficulty: "beginner",
    marks: 1,
    minutes: 1,
    prompt: "Declaring `const items = [];` prevents `items.push(1)` from running.",
    answer: false,
    explanation:
      "`const` stops the **variable** from being reassigned (`items = [...]` is an error), but the array it points to can still be mutated with `push`.",
    lessonId: "js-variables-scope",
    source: "practice",
    misconception: "const makes values immutable",
  },
  {
    id: "js-013",
    type: "tf",
    topic: "javascript",
    subtopic: "Copying objects",
    difficulty: "intermediate",
    marks: 1,
    minutes: 1,
    prompt:
      "`const copy = structuredClone(order);` produces a deep copy, so changing `copy.items[0].qty` does not change `order.items[0].qty`.",
    answer: true,
    explanation:
      "`structuredClone` recursively copies plain objects, arrays, Dates, Maps, etc. (not functions). Nested objects are new, so the original is unaffected. Spread / `Object.assign` are shallow by contrast.",
    lessonId: "js-references-copies",
    source: "practice",
  },
  /* ---------------------------------------------------------------- */
  /* Closures, scope and this                                          */
  /* ---------------------------------------------------------------- */
  {
    id: "js-014",
    type: "mcq",
    topic: "javascript",
    subtopic: "Closures",
    difficulty: "intermediate",
    marks: 1,
    minutes: 2,
    prompt: `What is logged?

${F}js
function makeCounter() {
  let count = 0;
  return () => ++count;
}
const a = makeCounter();
const b = makeCounter();
a();
a();
console.log(a(), b());
${F}`,
    options: ["3 1", "3 4", "1 1", "2 1"],
    answer: 0,
    distractorNotes: {
      1: "Each call to `makeCounter` creates a NEW `count` variable, so `a` and `b` do not share a counter.",
      2: "The closure keeps `count` alive between calls; it is not reset to 0 each time `a()` runs.",
      3: "`a()` has been called twice already, so the third call returns 3 (pre-increment returns the new value).",
    },
    explanation:
      "The returned arrow function closes over its own `count`. `a` increments its count to 1, 2, then 3. `b` has a separate count, so its first call returns 1.",
    lessonId: "js-closures",
    source: "practice",
  },
  {
    id: "js-015",
    type: "mcq",
    topic: "javascript",
    subtopic: "var vs let in loops",
    difficulty: "advanced",
    marks: 1,
    minutes: 2,
    prompt: `What is logged?

${F}js
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
${F}`,
    options: ["0 1 2", "undefined undefined undefined", "2 2 2", "3 3 3"],
    answer: 3,
    distractorNotes: {
      0: "That is the output with `let`, which creates a new binding for each iteration.",
      1: "`i` is defined (function-scoped by `var`), so the callbacks read a number, not undefined.",
      2: "The loop stops when `i < 3` is false, i.e. after `i` becomes 3.",
    },
    explanation:
      "`var` creates ONE function-scoped `i`. The timeouts run after the loop has finished, when `i` is 3, so each closure logs 3. Using `let i` gives each iteration its own binding and logs 0 1 2.",
    lessonId: "js-closures",
    source: "practice",
    misconception: "closures capture the value at creation time",
  },
  {
    id: "js-016",
    type: "mcq",
    topic: "javascript",
    subtopic: "this binding",
    difficulty: "advanced",
    marks: 1,
    minutes: 2,
    prompt: `What happens when this code runs?

${F}js
"use strict";
const account = {
  owner: "Kim",
  greet() {
    return "Hi " + this.owner;
  },
};
const greet = account.greet;
console.log(account.greet());
console.log(greet());
${F}`,
    options: [
      "Logs \"Hi Kim\" twice",
      "Logs \"Hi Kim\", then throws a TypeError",
      "Logs \"Hi Kim\", then \"Hi undefined\"",
      "Throws a TypeError before logging anything",
    ],
    answer: 1,
    distractorNotes: {
      0: "`this` is decided by HOW a regular function is called, not where it was defined. `greet()` has no object before the dot.",
      2: "In sloppy mode `this` would be the global object and you might see \"Hi undefined\", but in strict mode `this` is `undefined`, so reading `.owner` throws.",
      3: "The first call `account.greet()` works normally, so \"Hi Kim\" is logged first.",
    },
    explanation:
      "For a regular function, `this` is the object left of the dot at call time. `greet()` is a plain call, so in strict mode (and in ES modules) `this` is `undefined` and `this.owner` throws `TypeError: Cannot read properties of undefined`.",
    lessonId: "js-arrow-this",
    source: "practice",
    misconception: "methods remember their object when detached",
  },
  {
    id: "js-017",
    type: "tf",
    topic: "javascript",
    subtopic: "Arrow functions and this",
    difficulty: "intermediate",
    marks: 1,
    minutes: 1,
    prompt: `The following logs \`["Al of Reds", "Bo of Reds"]\` because the arrow function passed to \`map\` uses the \`this\` of \`list()\`.

${F}js
const team = {
  name: "Reds",
  members: ["Al", "Bo"],
  list() {
    return this.members.map(m => m + " of " + this.name);
  },
};
console.log(team.list());
${F}`,
    answer: true,
    explanation:
      "Arrow functions have no `this` of their own; they use the `this` of the surrounding scope. Inside `list()` called as `team.list()`, `this` is `team`.",
    lessonId: "js-arrow-this",
    source: "practice",
  },
  /* ---------------------------------------------------------------- */
  /* Promises & async                                                  */
  /* ---------------------------------------------------------------- */
  {
    id: "js-018",
    type: "tf",
    topic: "javascript",
    subtopic: "async functions",
    difficulty: "beginner",
    marks: 1,
    minutes: 1,
    prompt: "An `async` function always returns a Promise, even if its body does `return 42;`.",
    answer: true,
    explanation:
      "The return value of an `async` function is wrapped in a Promise (`Promise.resolve(42)`), and a thrown error becomes a rejected Promise. Callers must `await` it or use `.then`.",
    lessonId: "js-promises-async",
    source: "practice",
  },
  {
    id: "js-019",
    type: "mcq",
    topic: "javascript",
    subtopic: "Promise.all",
    difficulty: "intermediate",
    marks: 1,
    minutes: 2,
    prompt: `What is logged?

${F}js
async function loadAll() {
  try {
    const results = await Promise.all([
      Promise.resolve("events"),
      Promise.reject(new Error("categories failed")),
      Promise.resolve("bookings"),
    ]);
    console.log(results);
  } catch (err) {
    console.log("Error:", err.message);
  }
}
loadAll();
${F}`,
    options: [
      "[\"events\", undefined, \"bookings\"]",
      "[\"events\", \"bookings\"]",
      "Error: categories failed",
      "Nothing - the rejection is silently ignored",
    ],
    answer: 2,
    distractorNotes: {
      0: "`Promise.all` does not fill failed slots with undefined; it rejects as soon as any input rejects.",
      1: "Failed promises are not filtered out. Use `Promise.allSettled` to inspect each result.",
      3: "The rejection propagates through `await` and is caught by the `catch` block.",
    },
    explanation:
      "`Promise.all` is fail-fast: it rejects with the first rejection reason. `await` throws that error, so the `catch` block logs `Error: categories failed` and `results` is never assigned.",
    lessonId: "js-promises-async",
    source: "practice",
    misconception: "Promise.all returns partial results on failure",
  },
  {
    id: "js-020",
    type: "mcq",
    topic: "javascript",
    subtopic: "Promise.allSettled",
    difficulty: "intermediate",
    marks: 1,
    minutes: 2,
    prompt: `What does \`results\` contain?

${F}js
const results = await Promise.allSettled([
  Promise.resolve("a"),
  Promise.reject("b"),
]);
${F}`,
    options: [
      "[{ status: \"fulfilled\", value: \"a\" }, { status: \"rejected\", reason: \"b\" }]",
      "[\"a\", \"b\"]",
      "It rejects with \"b\"",
      "[{ ok: true, data: \"a\" }, { ok: false, error: \"b\" }]",
    ],
    answer: 0,
    distractorNotes: {
      1: "allSettled does not unwrap values; each entry is an object describing the outcome.",
      2: "That is `Promise.all` behaviour. `allSettled` never rejects because of an input rejection.",
      3: "The property names are `status` with `value` or `reason`; there is no `ok`/`data` shape.",
    },
    explanation:
      "`Promise.allSettled` waits for every promise and fulfils with an array of `{ status: \"fulfilled\", value }` or `{ status: \"rejected\", reason }` objects, in input order.",
    lessonId: "js-promises-async",
    source: "practice",
  },
  {
    id: "js-021",
    type: "mcq",
    topic: "javascript",
    subtopic: "Promise.race",
    difficulty: "advanced",
    marks: 1,
    minutes: 2,
    prompt: `What is logged?

${F}js
const slow = new Promise(resolve => setTimeout(() => resolve("data"), 200));
const timeout = new Promise((_, reject) =>
  setTimeout(() => reject(new Error("timeout")), 100)
);
Promise.race([slow, timeout])
  .then(value => console.log(value))
  .catch(err => console.log(err.message));
${F}`,
    options: ["data", "timeout", "data, then timeout", "Nothing, because race needs all promises to fulfil"],
    answer: 1,
    distractorNotes: {
      0: "`slow` settles at 200 ms, but `timeout` settles first at 100 ms.",
      2: "A promise settles only once. After `race` rejects, the later `slow` result is ignored.",
      3: "`race` settles with whichever input settles FIRST, whether it fulfils or rejects.",
    },
    explanation:
      "`Promise.race` adopts the outcome of the first promise to settle. The 100 ms rejection wins, so the `catch` logs `timeout`. This is a common pattern for request timeouts.",
    lessonId: "js-promises-async",
    source: "practice",
  },
  {
    id: "js-022",
    type: "mcq",
    topic: "javascript",
    subtopic: "async error handling",
    difficulty: "advanced",
    marks: 1,
    minutes: 3,
    prompt: `What is logged?

${F}js
function fetchData() {
  return Promise.reject(new Error("network"));
}

async function load() {
  try {
    return fetchData();
  } catch {
    return "fallback";
  }
}

load()
  .then(v => console.log("ok:", v))
  .catch(e => console.log("failed:", e.message));
${F}`,
    options: ["ok: fallback", "ok: undefined", "failed: network", "An uncaught error that crashes before anything is logged"],
    answer: 2,
    distractorNotes: {
      0: "The `catch` block only catches errors thrown while the `try` block runs. `return fetchData()` hands back a promise WITHOUT awaiting it, so the rejection happens after the try block has exited.",
      1: "`load` resolves with the state of the returned promise, which is a rejection, not undefined.",
      3: "The rejection is handled by the `.catch` attached to `load()`.",
    },
    explanation:
      "Returning a promise from an `async` function makes the outer promise follow it, but the `try/catch` never sees the rejection because nothing was awaited inside `try`. Writing `return await fetchData();` makes the catch block run and gives `ok: fallback`.",
    lessonId: "js-promises-async",
    source: "practice",
    misconception: "try/catch catches un-awaited promise rejections",
  },
  {
    id: "js-023",
    type: "tf",
    topic: "javascript",
    subtopic: "fetch errors",
    difficulty: "exam",
    marks: 1,
    minutes: 1,
    prompt:
      "`await fetch(\"/api/events/999\")` throws (the promise rejects) when the server responds with 404 Not Found.",
    answer: false,
    explanation:
      "`fetch` only rejects on network failure or abort. A 404 or 500 still resolves to a `Response`; you must check `response.ok` (or `response.status`) and throw yourself.",
    lessonId: "js-promises-async",
    source: "practice",
    misconception: "fetch rejects on HTTP error statuses",
  },
  {
    id: "js-024",
    type: "tf",
    topic: "javascript",
    subtopic: "Promise.all",
    difficulty: "intermediate",
    marks: 1,
    minutes: 1,
    prompt:
      "`await Promise.all([getEvents(), getCategories()])` runs the two requests one after another: `getCategories()` only starts after `getEvents()` finishes.",
    answer: false,
    explanation:
      "Both functions are called (and their requests start) while the array is built. `Promise.all` just waits for them concurrently. Sequential execution would be `await getEvents(); await getCategories();`.",
    lessonId: "js-promises-async",
    source: "practice",
    misconception: "Promise.all runs promises sequentially",
  },
  /* ---------------------------------------------------------------- */
  /* Event loop                                                        */
  /* ---------------------------------------------------------------- */
  {
    id: "js-025",
    type: "mcq",
    topic: "javascript",
    subtopic: "Event loop",
    difficulty: "exam",
    marks: 1,
    minutes: 2,
    prompt: `What is the console output order?

${F}js
console.log("A");
setTimeout(() => console.log("B"), 0);
Promise.resolve().then(() => console.log("C"));
queueMicrotask(() => console.log("D"));
console.log("E");
${F}`,
    options: ["A B C D E", "A E B C D", "A E C D B", "A C D E B"],
    answer: 2,
    distractorNotes: {
      0: "Callbacks never run in the middle of synchronous code; A and E run first.",
      1: "A `setTimeout(..., 0)` callback is a task (macrotask). All queued microtasks (C, D) run before the next task.",
      3: "Microtasks only run once the current synchronous script finishes, so E is logged before C and D.",
    },
    explanation: `1. Synchronous code: **A**, **E**.
2. Call stack empty - drain the microtask queue in FIFO order: **C** (promise reaction), **D** (queueMicrotask).
3. Next task from the task queue: **B** (the timer).`,
    lessonId: "js-event-loop",
    source: "practice",
    misconception: "setTimeout 0 runs before promise callbacks",
  },
  {
    id: "js-026",
    type: "mcq",
    topic: "javascript",
    subtopic: "Event loop with async/await",
    difficulty: "exam",
    marks: 1,
    minutes: 3,
    prompt: `What is the console output order?

${F}js
async function run() {
  console.log("1");
  await null;
  console.log("2");
}

console.log("3");
run();
setTimeout(() => console.log("4"), 0);
Promise.resolve().then(() => console.log("5"));
console.log("6");
${F}`,
    options: ["3 1 2 6 5 4", "3 1 6 2 5 4", "3 1 6 5 2 4", "3 6 1 2 5 4"],
    answer: 1,
    distractorNotes: {
      0: "`await` always pauses the async function, even for a non-promise value; the rest of `run` becomes a microtask, so 6 is logged before 2.",
      2: "The continuation after `await null` was queued BEFORE the `.then` callback, and microtasks run in FIFO order, so 2 comes before 5.",
      3: "The body of an async function runs synchronously up to the first `await`, so 1 is logged straight after 3.",
    },
    explanation: `- Sync: **3**; \`run()\` logs **1** then hits \`await\`, queuing its continuation (microtask M1).
- \`setTimeout\` queues task T1; \`.then\` queues microtask M2; sync logs **6**.
- Drain microtasks: M1 logs **2**, M2 logs **5**.
- Next task: T1 logs **4**.`,
    lessonId: "js-event-loop",
    source: "practice",
    misconception: "code after await runs synchronously",
  },
  {
    id: "js-027",
    type: "short",
    topic: "javascript",
    subtopic: "Event loop",
    difficulty: "exam",
    marks: 3,
    minutes: 4,
    prompt:
      "Explain why `Promise.resolve().then(cb1)` runs `cb1` before `setTimeout(cb2, 0)` runs `cb2`, even though the timer was scheduled first. Refer to the call stack, the microtask queue and the task (macrotask) queue.",
    rubric: [
      { criterion: "Synchronous code on the call stack runs to completion before any queued callback", marks: 1 },
      { criterion: "Promise reactions go to the microtask queue; timer callbacks go to the task queue", marks: 1 },
      { criterion: "After each task (when the stack is empty) the event loop drains ALL microtasks before taking the next task", marks: 1 },
    ],
    modelAnswer:
      "JavaScript runs synchronous code on the call stack until it is empty. `setTimeout` hands its callback to the timer API, which places it in the task (macrotask) queue when the delay expires; `.then` callbacks are placed in the microtask queue when the promise settles. When the stack empties, the event loop first drains the whole microtask queue, and only then takes the next task. So `cb1` (microtask) runs before `cb2` (task), regardless of scheduling order.",
    explanation:
      "Microtasks have priority: the microtask queue is emptied completely between tasks. A 0 ms timer is a minimum delay, not a guarantee of immediate execution.",
    lessonId: "js-event-loop",
    source: "practice",
  },
  {
    id: "js-028",
    type: "short",
    topic: "javascript",
    subtopic: "Closures",
    difficulty: "intermediate",
    marks: 3,
    minutes: 4,
    prompt:
      "Define a closure and give one practical example in client-side code (for example in a React component or an event handler) where a closure is used or causes a bug.",
    rubric: [
      { criterion: "A closure is a function together with the variables of the scope in which it was created", marks: 1 },
      { criterion: "The function can still read/update those variables after the outer function has returned", marks: 1 },
      { criterion: "Valid practical example (counter factory, event handler reading props/state, stale closure in setInterval, etc.)", marks: 1 },
    ],
    modelAnswer:
      "A closure is a function bundled with references to the variables in the lexical scope where it was defined. It keeps access to those variables even after the outer function has finished. Example: a React event handler `() => setCount(count + 1)` closes over the `count` of the render in which it was created. If it is used inside `setInterval` set up once in a `useEffect(..., [])`, it keeps seeing the first render's `count` (a stale closure); using the updater form `setCount(c => c + 1)` fixes it.",
    explanation:
      "Closures capture variables (bindings), not copies of values at creation time, which is why each React render's handlers see that render's state snapshot.",
    lessonId: "js-closures",
    source: "practice",
  },
  {
    id: "js-029",
    type: "short",
    topic: "javascript",
    subtopic: "References & copying",
    difficulty: "intermediate",
    marks: 3,
    minutes: 3,
    prompt: `Explain the output of this code and how to make \`b\` independent of \`a\`.

${F}js
const a = { tags: ["js"] };
const b = a;
b.tags.push("ts");
console.log(a.tags, a === b);
${F}`,
    rubric: [
      { criterion: "Output is [\"js\", \"ts\"] true", marks: 1 },
      { criterion: "Assigning an object copies the reference, so both variables point to the same object", marks: 1 },
      { criterion: "Fix: create a new object/array, e.g. `{ ...a, tags: [...a.tags] }` or `structuredClone(a)`", marks: 1 },
    ],
    modelAnswer:
      "It logs `[\"js\", \"ts\"] true`. `const b = a` copies the reference, not the object, so `a` and `b` are the same object and `push` mutates the one shared `tags` array. To get an independent copy, build new objects at every level that will change: `const b = { ...a, tags: [...a.tags] };` or a deep copy `structuredClone(a)`. Then `a === b` is false and pushing to `b.tags` leaves `a.tags` unchanged.",
    explanation:
      "Objects and arrays are reference values. React relies on new references to detect changes, which is why immutable updates matter.",
    lessonId: "js-references-copies",
    source: "practice",
    misconception: "assignment copies objects",
  },
  /* ---------------------------------------------------------------- */
  /* Code questions                                                    */
  /* ---------------------------------------------------------------- */
  {
    id: "js-030",
    type: "code",
    topic: "javascript",
    subtopic: "Array reduce",
    difficulty: "exam",
    marks: 4,
    minutes: 6,
    language: "js",
    prompt: `Using a **single \`reduce()\` call**, produce an object that counts events per category, storing it in \`countByCategory\`.

${F}js
const events = [
  { title: "Jazz Night", category: "Music" },
  { title: "5k Run", category: "Sport" },
  { title: "Open Mic", category: "Music" },
];
// expected: { Music: 2, Sport: 1 }
${F}`,
    starterCode: `const countByCategory = events.reduce(/* ... */);`,
    rubric: [
      { criterion: "Calls `reduce` on `events` with an accumulator and current item", marks: 1 },
      { criterion: "Supplies an empty object `{}` as the initial value", marks: 1 },
      { criterion: "Increments the count for `item.category`, handling the first occurrence (e.g. `?? 0`)", marks: 1 },
      { criterion: "Returns the accumulator from the callback on every iteration", marks: 1 },
    ],
    modelAnswer: `${F}js
const countByCategory = events.reduce((acc, event) => {
  acc[event.category] = (acc[event.category] ?? 0) + 1;
  return acc;
}, {});
// { Music: 2, Sport: 1 }
${F}`,
    explanation:
      "The accumulator starts as `{}`. For each event, read the current count (defaulting to 0 when the key is missing) and add 1. Forgetting `return acc` makes the next accumulator `undefined`.",
    lessonId: "js-array-reduce",
    source: "practice",
  },
  {
    id: "js-031",
    type: "code",
    topic: "javascript",
    subtopic: "sort mutation",
    difficulty: "advanced",
    marks: 4,
    minutes: 6,
    language: "js",
    prompt: `Find and fix the errors. This helper is called with an array held in React state, and the list sometimes appears unsorted and the original state is corrupted.

${F}js
function cheapestFirst(events) {
  return events.sort((a, b) => a.price > b.price);
}
${F}`,
    starterCode: `function cheapestFirst(events) {
  return events.sort((a, b) => a.price > b.price);
}`,
    rubric: [
      { criterion: "Identifies that `sort` mutates the original (state) array in place", marks: 1 },
      { criterion: "Copies before sorting (`[...events]`, `events.slice()` or uses `toSorted`)", marks: 1 },
      { criterion: "Identifies that the comparator must return a negative/zero/positive NUMBER, not a boolean", marks: 1 },
      { criterion: "Uses a correct numeric comparator such as `(a, b) => a.price - b.price`", marks: 1 },
    ],
    modelAnswer: `${F}js
function cheapestFirst(events) {
  // copy first so React state is never mutated
  return [...events].sort((a, b) => a.price - b.price);
  // or: return events.toSorted((a, b) => a.price - b.price);
}
${F}`,
    explanation:
      "A comparator returning `true`/`false` converts to 1/0 and never returns a negative number, so ordering is unreliable. `sort` also mutates in place, which breaks React's immutable-state assumption (same reference, possibly no re-render).",
    lessonId: "js-array-methods",
    source: "practice",
    misconception: "sort comparator can return a boolean",
  },
  {
    id: "js-032",
    type: "code",
    topic: "javascript",
    subtopic: "async/await error handling",
    difficulty: "exam",
    marks: 5,
    minutes: 8,
    language: "js",
    prompt:
      "Write an `async` function `getFreeEventTitles()` that fetches `http://localhost:5229/api/events` (returns an array of events with `title` and `price`). It must: throw a meaningful error for non-2xx responses, return the titles of events whose `price` is 0, and if anything fails log the error and return an empty array.",
    rubric: [
      { criterion: "Declares an async function and awaits `fetch`", marks: 1 },
      { criterion: "Checks `response.ok` and throws for HTTP errors", marks: 1 },
      { criterion: "Awaits `response.json()` to parse the body", marks: 1 },
      { criterion: "Uses `filter` then `map` (or reduce) to return titles of free events", marks: 1 },
      { criterion: "Wraps in try/catch, logging the error and returning `[]`", marks: 1 },
    ],
    modelAnswer: `${F}js
async function getFreeEventTitles() {
  try {
    const response = await fetch("http://localhost:5229/api/events");
    if (!response.ok) {
      throw new Error(\`Request failed with status \${response.status}\`);
    }
    const events = await response.json();
    return events.filter(e => e.price === 0).map(e => e.title);
  } catch (error) {
    console.error(error);
    return [];
  }
}
${F}`,
    explanation:
      "`fetch` resolves for 4xx/5xx responses, so you must check `response.ok`. `await` inside `try` ensures both network failures and your own thrown error reach the `catch` block.",
    lessonId: "js-promises-async",
    source: "practice",
  },
];
