# Source Inventory

Module: **5COSC026W Advanced Client-Side Development (2026/27)**, University of Westminster.
Inventory prepared on 20 Nov 2026 from the files supplied in the project root and their extracted copies.

> **Classification legend:** lecture · tutorial · project code · example · exam · image asset · admin (roadmap/planning)

## 1. Root files (originals — never modified)

| Path (project root) | Type | Size (bytes) | Contents | Classification |
|---|---|---:|---|---|
| `Week05_Routing_Forms_Validation_CRUD.pptx - Updated (1).zip` | ZIP | 66,244,043 | The main archive. Despite its name it contains **24 files**: all lecture decks/PDFs, tutorial guides, project zips and example zips listed in §2. | container |
| `MOCK ICT.docx` | DOCX | 24,703 | Mock in-class test (ICT): 100 marks, 90 min, Sections A–E. | exam |
| `MOCK ICT.pdf` | PDF | 93,356 | PDF rendering of the same mock paper (text identical apart from encoding of the dash in the heading). | exam (duplicate) |
| `5COSC026W_RoadMap_v1 26-27 (New).docx` | DOCX | 31,261 | Indicative teaching & assessment schedule T01–T12, key dates (Mock ICT 19 Nov, ICT 26 Nov 40 %, coursework 7 Jan 2027 60 %). | admin |
| `5COSC026W_RoadMap_v1 26-27 (New).pdf` | PDF | 86,215 | PDF rendering of the roadmap. | admin (duplicate) |

## 2. Top-level archive contents — `extracted-materials/archive/`

| File | Type | Size (bytes) | Contents | Classification |
|---|---|---:|---|---|
| `Advanced Client-Side Development - Lecture 01.pptx` | PPTX (26 slides) | 3,475,574 | How the Web works: Internet, IP/TCP/DNS, WWW, web server/browser, HTTP, status codes, URL, client–server diagram, Traditional vs SPA diagram, MVC, Models, Controllers, Views, DTOs, JWT/Cookie/Session. Embedded images on slides 4, 5, 13, 16, 17. | lecture |
| `Advanced Client-Side Development - Lecture 02.pptx` | PPTX (44 slides) | 3,671,158 | Modern React & TypeScript: components, JSX, props (+TS), state, events, lists, modern JS (var/let/const, arrow, this, spread/rest, destructuring, map/filter/reduce, promise), TypeScript basics, project structure. **Slides 18–23 and 25–37 are image-only** (19 PNG code screenshots/diagrams). | lecture |
| `Week03-Lecture-Consuming-REST-APIs.pptx` | PPTX (30 slides) | 110,215 | Consuming REST APIs: fetch, async/await, Promises, response.ok, JSON, TS interfaces for API data, service layer, CORS, four UI states, useEffect + deps, custom hooks, Service→Hook→Component. All text-based. | lecture |
| `Week05_Routing_Forms_Validation_CRUD.pptx - Updated (1).pptx` | PPTX (38 slides) | 143,392 | Routing (BrowserRouter/Routes/Route, useParams, nested layout/Outlet, Link vs navigate, not-found), architecture (pages/components/services/types), forms (controlled inputs, client vs server validation, Zod schema), CRUD (POST/PUT/DELETE, request states, common mistakes). All text-based. | lecture |
| `Advanced Client-Side Development - Lecture 04- HTML5 and CSS3.pdf` | PDF (26 pages) | 576,255 | HTML5 semantic elements, document head/meta, Core CSS (fonts, colours, text effects, backgrounds, shadows, gradients, attribute selectors). | lecture |
| `Advanced Client-Side Development Lecture 04 - Bootstrap.pdf` | PDF (20 pages) | 547,062 | Bootstrap part 01 (title page says "Lecture: 03 (part: 01)"): CDN, containers, colours, columns, tables, alerts, buttons, cards. | lecture |
| `Advanced Client-Side Development Lecture 04 - Bootstrap - part 02.pdf` | PDF (22 pages) | 568,635 | Bootstrap part 02 (title page "Lecture: 03 (part 02)"): grid tiers, text defaults, images, jumbotron, button groups, progress, spinners, pagination, dropdowns. | lecture |
| `Advanced Client-Side Development Lecture 04 - Bootstrap - part 03.pdf` | PDF (11 pages) | 698,162 | Bootstrap part 03: utilities, customisation, responsive design, optimisation (minify/bundle, images, CDN, lazy loading), best practices incl. ARIA. | lecture |
| `Week_02_React_Application_Shell_Tutorial_Guide.docx` | DOCX | 31,301 | Tutorial 2: create Vite React+TS project, Navbar/Footer, pages, EventCard (typed props), TicketCounter (useState), list rendering. | tutorial |
| `week_4_tutorial.pdf` | PDF (2 pages) | 154,260 | Bootstrap online-shopping page exercise (jumbotron, category buttons, cards, grid, closable alert, table, footer). | tutorial |
| `Bootstrap-Explanation (For Tutorial Exercise).docx` | DOCX | 19,078 | Glossary of Bootstrap classes used in a portfolio tutorial exercise + ARIA attributes explanation (refers to a `style.css` not supplied). | tutorial |
| `Campus Event Frontend guide.docx` | DOCX | 43,398 | Week 05 extension guide: 22 files (api.ts with ApiError, eventService, categoryService, useEvents/useEvent/useCategories, EventForm with RHF+Zod, AppLayout, Navbar with NavLink, pages, App routes, main.tsx). | tutorial |
| `CampusEvents_API_Postman_Testing_Guide.docx` | DOCX | 31,710 | Complete Postman test sequence: register/login, bootstrap first admin, categories, events, bookings, reviews, roles, 401/403 tests. | tutorial |
| `Backend Events API.zip` | ZIP | 25,855,652 | ASP.NET Core (.NET 9) CampusEvents.Api **version A** — no CORS; `RolesController` `[Authorize]` commented out. Includes `bin/`, `obj/`, `CampusEvents.db`. | project code |
| `CampusEvents.Api.zip` | ZIP | 25,847,662 | CampusEvents.Api **version B** — CORS `FrontendPolicy` added; `RolesController` `[Authorize(Roles = "ADMIN")]` active. Includes `bin/`, `obj/`, `CampusEvents.db`. | project code |
| `campus-events-frontend.zip` | ZIP | 56,953 | Week 03 state of the React frontend (Vite 8, React 19.2, TS ~6.0) — no `node_modules`. | project code |
| `required files (1).zip` | ZIP | 5,190 | Subset of `campus-events-frontend/src` (12 files) — byte-identical copies. | project code (duplicate subset) |
| `Advanced Examples.zip` | ZIP | 9,688 | 14 small HTML pages demonstrating JS: arrow functions, destructuring, filter, map, reduce, promise, rest, spread, template literals, var/let/const, data structures, normal function, ternary, `this`. | example |
| `React-basic-examples.zip` | ZIP | 2,322 | 3 HTML pages using React 17 UMD + Babel standalone: components & JSX, event handling, state & props. | example |
| `Bootstrap examples 4th lecture.zip` | ZIP | 4,383 | 4 HTML pages (Bootstrap 4.5.2): utilities, customising, responsive layout, responsive navbar. | example |
| `Examples-Bootstrap.zip` | ZIP | 1,158,016 | `Example-01..09.html` (Bootstrap 4.1.3 via MaxCDN + jQuery 3.3.1) + `car.jpg`. Referenced as "See Example N" in Bootstrap part 01/02 PDFs. | example |
| `HTML5 page and fonts.zip` | ZIP | 186,557 | `index.html` (semantic HTML5 + gradients), `example02.html` (Core CSS, Google Fonts Roboto/Lobster), `fontsexample.html`, 2 images. Referenced in the HTML5/CSS3 PDF pp. 23, 25. | example |
| `Images-Bootstrap-Portfolio.zip` | ZIP | 876,126 | 5 `.webp` images (background, bmi, math-wiz, wags-and-walks, we-wellness) for the Bootstrap portfolio exercise. | image asset |
| `images.7z` | 7-Zip | 3,505,116 | **Not extracted** (no 7z tool installed). Contents unknown; by name and neighbours, most likely image assets for a tutorial exercise. | image asset (unverified) |

## 3. Nested extractions — `extracted-materials/nested/<zip name>/`

### 3.1 Backend (two copies; see §5 for differences)

Path pattern: `nested/Backend Events API/Backend Events API/CampusEvents.Api/…` and `nested/CampusEvents.Api/CampusEvents.Api/…`

| Relative path | Size (bytes) | Contents |
|---|---:|---|
| `Program.cs` | 4,907 (A) / 5,264 (B) | DI setup, SQLite, Identity (password rules), JWT bearer validation, role seeding (`USER`, `ADMIN`), CORS (B only), pipeline, template `/weatherforecast` endpoint. |
| `Services/JWTService.cs` | 2,146 | `JwtService.GenerateTokenAsync` — claims, HMAC-SHA256, 2-hour expiry. |
| `Controllers/AuthController.cs` | 3,205 | `POST /api/auth/register`, `POST /api/auth/login`. |
| `Controllers/EventsController.cs` | 7,408 | Events CRUD (mutations ADMIN). |
| `Controllers/CategoriesController.cs` | 3,925 | Categories CRUD (mutations ADMIN). |
| `Controllers/BookingsController.cs` | 8,216 | Bookings (owner/ADMIN rules). |
| `Controllers/ReviewsController.cs` | 4,351 | Reviews (booking required, one per user/event). |
| `Controllers/RolesController.cs` | 6,769 (A) / 6,767 (B) | Role management. |
| `Controllers/UsersController.cs` | 2,427 | `DELETE /api/users/{userId}`. |
| `DTOs/Auth/*`, `DTOs/Events/*`, `DTOs/Categories/*`, `DTOs/Bookings/*`, `DTOs/Reviews/*` | 229–733 each | 14 DTO classes. |
| `Models/*.cs` | 277–818 each | `ApplicationUser`, `Event`, `Category`, `Booking` (+`BookingStatus` enum), `Review`. |
| `Data/ApplicationDbContext.cs`, `Data/ApplicationDbContextFactory.cs` | 2,753 / 534 | EF Core model config (FK delete behaviours, decimal precision, unique category name, rating check constraint). |
| `Migrations/*` | 780–18,845 | 4 migrations: InitialCreate, Identity, RemovePayments, AddUniqueCategoryName (+ snapshot). |
| `appsettings.json` | 401 | SQLite connection string, `Jwt:Key/Issuer/Audience` (development key placeholder). |
| `Properties/launchSettings.json` | 644 | `http` profile → `http://localhost:5229`; `https` profile → `https://localhost:7119;http://localhost:5229`. |
| `CampusEvents.Api.csproj` | 880 | `net9.0`; JwtBearer 9.0.0, Identity.EFCore 9.0.0, OpenApi 9.0.18, EFCore.Sqlite 9.0.0. |
| `CampusEvents.Api.http` | 145 | Template request for `/weatherforecast` only. |
| `.config/dotnet-tools.json` | 229 | `dotnet-aspnet-codegenerator` 9.0.0. |
| `CampusEvents.db` | 159,744 | SQLite database (binary, differs between A and B — not inspected; no sqlite tool used). |
| `bin/`, `obj/` | — | Build outputs (DLLs, PDBs, native SQLite libraries). Ignored for analysis; **never executed**. |

### 3.2 Frontend — `nested/campus-events-frontend/campus-events-frontend/`

| File | Size | Contents |
|---|---:|---|
| `package.json` | 725 | React ^19.2.8, react-dom ^19.2.8; dev: Vite ^8.3.0, TypeScript ~6.0.2, @vitejs/plugin-react ^6.1.1, ESLint ^10.10.0, typescript-eslint, react-hooks plugin ^7.1.1. |
| `package-lock.json` | 95,953 | Lockfile (not installed). |
| `vite.config.ts`, `tsconfig*.json`, `eslint.config.js`, `index.html`, `README.md` | small | Standard Vite React-TS template config. `tsconfig.app.json` has no explicit `strict` flag. |
| `src/main.tsx` | 233 | `createRoot` + `<StrictMode>`; no router. |
| `src/App.tsx` | 336 | Renders Navbar, a heading, `<Events />` and Footer directly (no routes). |
| `src/components/{Navbar,Footer,EventCard,TicketCounter}.tsx` | 142–461 | Week 02 shell components. |
| `src/pages/{Home,Events,Login,Register}.tsx` | 197–741 | Only `Events` is used; Home/Login/Register are placeholders. |
| `src/hooks/useEvents.ts` | 738 | `useState` + `useEffect([])` + try/catch/finally; no cleanup. |
| `src/services/eventService.ts` | 342 | `getEvents()` with hard-coded `http://localhost:5229/api/events` and `response.ok` check. |
| `src/types/Event.ts` | 318 | `Event` interface matching `EventDto`. |
| `src/App.css`, `src/index.css`, `src/assets/*`, `public/*` | — | Styles and template images/icons. |

### 3.3 `nested/required files (1)/`

12 files (`App.tsx`, `components/*` ×4, `hooks/useEvents.ts`, `pages/*` ×4, `services/eventService.ts`, `types/Event.ts`). `diff -r` against `campus-events-frontend/src` shows **no content differences**; it simply omits `main.tsx`, `App.css`, `index.css` and `assets/`.

### 3.4 Example and asset folders

| Folder | Files |
|---|---|
| `nested/Advanced Examples/Advanced Examples/Examples/Advanced/` | `arrowFunctionJS`, `destructuringJS`, `filterJS`, `mapJS`, `promiseJS`, `reduceJS`, `restParameterJS`, `spreadOperatorJS`, `templateLiteralsJS`, `var-let-const-JS` (.html) |
| `nested/Advanced Examples/Advanced Examples/Examples/prerequisites/` | `dataStructuresJS`, `normalFunctionJS`, `ternaryOperatorJS`, `thisKeywordJS` (.html) |
| `nested/React-basic-examples/React-basic-examples/` | `example-components-and-JSX.html`, `example-handling-events(react).html`, `example-states-and-props.html` |
| `nested/Bootstrap examples 4th lecture/Bootstrap examples 4th lecture/` | `B3example01.html` (utilities), `B3example2.html` (customising), `B3example3.html` (responsive layout), `B3example4.html` (responsive navbar) |
| `nested/Examples-Bootstrap/Examples-Bootstrap/` | `Example-01..09.html`, `car.jpg` |
| `nested/HTML5 page and fonts/HTML5 page and fonts/` | `index.html`, `example02.html`, `fontsexample.html`, `background.jpg`, `image.jpg` |
| `nested/Images-Bootstrap-Portfolio/Images-Bootstrap-Portfolio/` | 5 `.webp` images |

## 4. Text extractions

| Folder | Contents |
|---|---|
| `extracted-materials/text/*.txt` | Text of every PPTX/DOCX/PDF in the archive (PPTX slides delimited by `=== SLIDE n ===`, speaker notes after `--- notes ---`; PDF pages delimited by form-feed characters, which allows page numbers to be cited). Also includes `MOCK ICT.pdf.txt` and the roadmap PDF text. |
| `extracted-materials/text-root/*.txt` | Text of the root DOCX files (`MOCK_ICT.docx.txt`, `5COSC026W_RoadMap_v1_26-27_New_.docx.txt`) plus duplicates of the archive DOCX/PPTX texts. |

## 5. Duplicates and versions

| Item | Relationship |
|---|---|
| `MOCK ICT.docx` vs `MOCK ICT.pdf` | Same paper. DOCX text is the authoritative extraction (`text-root/MOCK_ICT.docx.txt`). |
| Roadmap `.docx` vs `.pdf` | Same schedule; DOCX extraction is a cleaner table. |
| `text-root/` vs `text/` for Lecture 01/02, Week03, Week05, Week02 guide, Bootstrap explanation, Postman guide, Frontend guide | Identical byte sizes — duplicates. |
| `Backend Events API.zip` vs `CampusEvents.Api.zip` | Same project at two points in time. Source differs only in `Program.cs` (CORS block + `app.UseCors(FrontendPolicy)` added in B) and `RolesController.cs` line 11 (`//[Authorize(Roles = "ADMIN")]` in A vs active in B). The SQLite DB and build outputs also differ. Zip dates: A 28 Sep 2026, B 5 Nov 2026. |
| `campus-events-frontend.zip` vs `required files (1).zip` | `required files` is an identical subset of `src/`. |
| Bootstrap examples | Two separate example sets: `Examples-Bootstrap` (BS 4.1.3, referenced by part 01/02 PDFs as "See Example 1–9") and `Bootstrap examples 4th lecture` (BS 4.5.2, referenced by part 03 PDF as "See example 01–04"). Neither uses Bootstrap 5 although the PDFs say "Bootstrap 5". |

## 6. What could not be extracted / inspected

| Item | Reason | Consequence |
|---|---|---|
| `images.7z` (3.5 MB) | No 7-Zip tool installed; not extracted. | Its contents are unknown. Nothing in any text file references it by name. It is treated as an unverified image asset; no lesson cites it. |
| Lecture 02 slides 18–23, 25–37 | Content is embedded PNG screenshots, not text. A subset was viewed as images during analysis (slides 18, 20, 21, 26, 27, 28, 30, 35, 36, 37) to describe them; others are described from their titles only. | Lecture analysis marks these slides as "image-only". |
| Lecture 01 slides 4, 5, 13, 16 | EMF diagrams (not rendered). Slide 17 PNG was viewed (Traditional vs SPA diagram). | Diagram descriptions for 4/5/13/16 are inferred from slide titles only and labelled as such. |
| `CampusEvents.db` | Binary SQLite; no database tool was run. | Seed data (if any) unknown. `ApplicationDbContext` contains no `HasData` seeding. |
| Coursework specification | Not in the supplied materials (roadmap says released in T06). | See `knowledge-gaps.md`. |

## 7. Safety approach

- **Nothing was executed.** No `dotnet run`, no `npm install`/`npm run`, no opening of the example HTML pages in a browser, no execution of the compiled DLLs in `bin/`.
- **No dependencies were installed** from the extracted projects (`package.json`, `.csproj`, `dotnet-tools.json` were read as text only).
- Extracted archives are treated as **untrusted data**: they live in `extracted-materials/`, separate from the app source; analysis used read-only tools (`cat`, `diff`, `unzip -l`/`unzip -p` to list/read PPTX internals, PNGs copied to a temporary scratch directory for viewing).
- The original root files were **not modified, moved or deleted**.
- The development JWT key in `appsettings.json` (`CHANGE_THIS_TO_A_LONG_RANDOM_DEVELOPMENT_KEY_123456789`) is a placeholder and must never be reused outside local development.
