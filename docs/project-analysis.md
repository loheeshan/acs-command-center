# CampusEvents Project Analysis

Sources: `extracted-materials/nested/CampusEvents.Api/CampusEvents.Api/` (backend version B), `extracted-materials/nested/Backend Events API/Backend Events API/CampusEvents.Api/` (version A),
`extracted-materials/nested/campus-events-frontend/campus-events-frontend/`, `Campus Event Frontend guide.docx`, `CampusEvents_API_Postman_Testing_Guide.docx`.
All findings come from reading the source; **nothing was built or run**.

## 1. Backend overview

| Aspect | Value (from source) |
|---|---|
| Framework | ASP.NET Core, `net9.0` (`CampusEvents.Api.csproj`) |
| Data | EF Core 9 + SQLite (`Data Source=CampusEvents.db`); Identity tables via `IdentityDbContext<ApplicationUser>` |
| Auth | ASP.NET Core Identity (`AddIdentityCore` + roles) + JWT bearer (`Microsoft.AspNetCore.Authentication.JwtBearer` 9.0.0) |
| JSON | `JsonStringEnumConverter` → enums serialised as strings (`"Pending"`, `"Confirmed"`, `"Cancelled"`); default camelCase property names |
| API docs | `AddOpenApi()` / `MapOpenApi()` in Development (OpenAPI document; no Swagger UI package referenced) |
| Ports (`launchSettings.json`) | `http` profile: `http://localhost:5229`; `https` profile: `https://localhost:7119` + `http://localhost:5229` |
| Leftover | Template `GET /weatherforecast` endpoint still mapped ("You can delete this section later") |

### Domain model

| Entity | Fields | Relationships / constraints (`ApplicationDbContext`) |
|---|---|---|
| `ApplicationUser : IdentityUser` | FirstName, LastName, CreatedAt | Bookings, Reviews (FK delete **Restrict**) |
| `Category` | Id, Name (max 100, **unique index**), Description? | Events (FK delete **Restrict**) |
| `Event` | Id, Title (max 150), Description, ImageUrl?, StartDate, EndDate, Location, Price (decimal 10,2), Capacity, CategoryId, CreatedAt | Bookings & Reviews cascade on event delete (but controller blocks deletion when any exist) |
| `Booking` | Id, EventId, UserId, BookingDate, NumberOfTickets, TotalAmount (10,2), Status (`Pending`/`Confirmed`/`Cancelled`) | — |
| `Review` | Id, EventId, UserId, Rating (check constraint 1–5), Comment?, CreatedAt | — |

## 2. Endpoints (read from the controllers)

Auth legend: **Public** = no `[Authorize]`; **User** = `[Authorize]` (any valid JWT); **ADMIN** = `[Authorize(Roles = "ADMIN")]`.
Without a valid token on a protected endpoint → **401**; valid token lacking the role → **403**.
All controllers use `[ApiController]`, so DTO data-annotation failures return an automatic **400 ValidationProblemDetails** (`{ title, status, errors: { field: [msg] } }`).
Route constraints `{id:int}` mean non-numeric ids give **404** (no route match).

### AuthController — `api/auth`

| Method & path | Auth | Request DTO | Success response | Other status codes |
|---|---|---|---|---|
| `POST /api/auth/register` | Public | `RegisterDto { email [Required, EmailAddress], password [Required, MinLength 8], firstName [Required, Max 50], lastName [Required, Max 50] }` | **200** `{ message: "Registration successful." }` — **no token returned** | 400 `{ message: "A user with this email already exists." }`; 400 `IdentityError[]` (`[{ code, description }]`) on password-rule failure; 400 if role assignment fails (user deleted again) |
| `POST /api/auth/login` | Public | `LoginDto { email [Required, EmailAddress], password [Required] }` | **200** `AuthResponseDto` | 401 `{ message: "Invalid email or password." }` (same message for unknown email and wrong password) |

### EventsController — `api/events`

| Method & path | Auth | Request DTO | Success response | Other status codes |
|---|---|---|---|---|
| `GET /api/events` | Public | — | 200 `EventDto[]` | — |
| `GET /api/events/{id}` | Public | — | 200 `EventDto` | 404 |
| `POST /api/events` | ADMIN | `CreateEventDto { title [Required, ≤150], description [Required], imageUrl?, startDate [Required], endDate [Required], location [Required], price [0–100000], capacity [1–10000], categoryId [Required] }` | **201** `EventDto` + `Location` header (`CreatedAtAction(GetEvent)`), `availableTickets = capacity` | 400 "End date must be after the start date." (end ≤ start); 400 "Category does not exist."; 401; 403 |
| `PUT /api/events/{id}` | ADMIN | `UpdateEventDto` (same fields/rules as Create) | **204 No Content** | 400 date order; 404 event; 400 category; 400 "Capacity cannot be less than the number of booked tickets (n)."; 401; 403 |
| `DELETE /api/events/{id}` | ADMIN | — | **204** | 404; 400 "Cannot delete an event that has bookings." (any booking, **including cancelled**); 400 "Cannot delete an event that has reviews."; 401; 403 |

`EventDto { id, title, description, imageUrl: string|null, startDate, endDate, location, price, capacity, availableTickets, categoryId, categoryName }`.
`availableTickets` = capacity − sum of tickets of **non-cancelled** bookings (computed server-side on every GET).

### CategoriesController — `api/categories`

| Method & path | Auth | Request DTO | Success | Other |
|---|---|---|---|---|
| `GET /api/categories` | Public | — | 200 `CategoryDto[]` `{ id, name, description?, eventCount }` | — |
| `GET /api/categories/{id}` | Public | — | 200 `CategoryDto` | 404 |
| `POST /api/categories` | ADMIN | `CreateCategoryDto { name [Required, ≤100], description? }` (name trimmed) | **201** `CategoryDto` | **409 Conflict** `{ message: "A category with this name already exists." }` (case-insensitive check); 401; 403 |
| `PUT /api/categories/{id}` | ADMIN | `UpdateCategoryDto { name, description? }` | 204 | 404; duplicate name is **not** pre-checked — the unique index would make `SaveChangesAsync` throw (unhandled → 500); 401; 403 |
| `DELETE /api/categories/{id}` | ADMIN | — | 204 | 404; 400 "Cannot delete a category that contains events."; 401; 403 |

### BookingsController — `api/bookings`

| Method & path | Auth | Request DTO | Success | Other |
|---|---|---|---|---|
| `GET /api/bookings` | ADMIN | — | 200 `BookingDto[]` | 401; 403 |
| `GET /api/bookings/my-bookings` | User | — | 200 `BookingDto[]` (current user's, all statuses) | 401 |
| `GET /api/bookings/{id}` | User (owner or ADMIN) | — | 200 `BookingDto` | 404; **403** (`Forbid()`) if not owner and not ADMIN |
| `POST /api/bookings` | User | `CreateBookingDto { eventId [Range 1..], numberOfTickets [Range 1–20] }` | **201** `BookingDto` (`status: "Pending"`, `totalAmount = price × tickets`) | 404 "Event not found."; 400 "Only n tickets are available."; 401 |
| `PUT /api/bookings/{id}/cancel` | User (owner or ADMIN) | none | **204** | 404; 403; 400 "Booking is already cancelled." |
| `PATCH /api/bookings/{id}/status` | ADMIN | `UpdateBookingStatusDto { status: "Pending" \| "Confirmed" \| "Cancelled" }` | **204** | 404; 400 invalid status; 401; 403 |

`BookingDto { id, eventId, eventTitle, userId, bookingDate, numberOfTickets, totalAmount, status }`.

### ReviewsController — `api/reviews`

| Method & path | Auth | Request DTO | Success | Other |
|---|---|---|---|---|
| `GET /api/reviews/event/{eventId}` | Public | — | 200 `ReviewDto[]` `{ id, eventId, eventTitle, userName ("First Last"), rating, comment?, createdAt }` | 404 "Event not found." |
| `POST /api/reviews` | User | `CreateReviewDto { eventId [Required], rating [1–5], comment? [≤1000] }` | **201** `ReviewDto` | 404 event; 400 "You must have a valid booking for this event before leaving a review." (needs a non-cancelled booking); 400 "You have already reviewed this event."; 401 |
| `DELETE /api/reviews/{id}` | User (owner or ADMIN) | — | 204 | 404; 403 |

### RolesController — `api/roles` (class-level `[Authorize(Roles = "ADMIN")]` in version B)

| Method & path | Request | Success | Other |
|---|---|---|---|
| `GET /api/roles` | — | 200 `[{ id, name }]` | 401/403 |
| `GET /api/roles/users/{userId}` | — | 200 `{ userId, email, firstName, lastName, roles: string[] }` | 404 |
| `POST /api/roles/{roleName}` | — | 200 `{ message, role }` | 400 exists/errors |
| `DELETE /api/roles/{roleName}` | — | 204 | 400 for User/Admin (case-insensitive) or role in use; 404 |
| `POST /api/roles/users/{userId}/assign/{roleName}` | no body | 200 `{ message, userId, role }` | 404 user/role; 400 already has role |
| `DELETE /api/roles/users/{userId}/remove/{roleName}` | no body | 200 `{ message, userId, role }` | 404; 400 missing role; 400 removing Admin from the last administrator |

### UsersController — `api/users` (class-level `[Authorize]`)

| Method & path | Rule | Success | Other |
|---|---|---|---|
| `DELETE /api/users/{userId}` | User may delete self; ADMIN may delete non-admins; last admin cannot delete self | 204 | 401; 403; 404; 400 (admin deleting admin / last admin) |

### Error-body formats (frontend relevance)

| Source | Body shape |
|---|---|
| `BadRequest("plain string")` (most domain rules in Events/Categories/Bookings/Reviews/Roles) | a JSON-less string body (ASP.NET Core's string output formatter normally writes it as `text/plain`) |
| `BadRequest(new { message })`, `Unauthorized(new { message })`, `Conflict(new { message })` | JSON `{ "message": "…" }` |
| `BadRequest(result.Errors)` | JSON array of `{ code, description }` |
| Automatic model validation | JSON ValidationProblemDetails `{ type, title, status, errors }` |
| `NotFound()` / `Forbid()` / `Unauthorized()` (no body) | Empty or ProblemDetails body |

The Frontend guide's `getErrorMessage()` reads `message`, `detail`, `title`, then `errors`. It therefore shows server messages for `{ message }` bodies, shows the generic title "One or more validation errors occurred." for validation problems (because `title` is checked before `errors`), and falls back to "Request failed (HTTP 400)." for plain-string bodies (`response.json()` fails → `null`).

## 3. Authentication flow

### Password and user rules (`Program.cs`, `AddIdentityCore`)

- `RequireUniqueEmail = true`
- `RequireDigit = true`, `RequireLowercase = true`, `RequireUppercase = true`
- `RequireNonAlphanumeric = false`
- `RequiredLength = 8` (also `[MinLength(8)]` on `RegisterDto.Password`)
- `UserName` is set to the email at registration.
- Example passing password from the Postman guide: `Password123`.

### Roles

- Seeded at startup in `Program.cs`: **`"USER"`** and **`"ADMIN"`** (created if missing).
- `Register` calls `AddToRoleAsync(user, "User")`. Identity resolves role names through their normalised (upper-case) form, so this attaches the seeded `USER` role.
- Controllers check `Roles = "ADMIN"` and `User.IsInRole("ADMIN")` (upper case).
- `GetRolesAsync` returns the stored names (`"USER"`, `"ADMIN"`), so token role claims and `/api/roles/users/{id}` show upper-case names — **not** `"User"`/`"Admin"` as written in the Postman guide.

### JWT (`Services/JWTService.cs`)

| Item | Value |
|---|---|
| Algorithm | HMAC-SHA256 (`SymmetricSecurityKey` from `Jwt:Key`) |
| Issuer / Audience | `CampusEvents.Api` / `CampusEvents.Client` |
| Lifetime | `DateTime.UtcNow.AddHours(2)` → `exp` claim; returned as `expiresAt` |
| Claims added in code | `JwtRegisteredClaimNames.Sub` = user id; `JwtRegisteredClaimNames.Email` = email; `ClaimTypes.NameIdentifier` = user id; `ClaimTypes.Email` = email; `ClaimTypes.Name` = UserName (= email); one `ClaimTypes.Role` per role |
| Validation (`Program.cs`) | `ValidateIssuer`, `ValidateAudience`, `ValidateLifetime`, `ValidateIssuerSigningKey` all `true` (default clock skew applies) |

Note for the JWT explorer / lessons: `JwtSecurityTokenHandler` normally shortens the long `ClaimTypes.*` URIs when writing the token (e.g. `nameid`, `unique_name`, `role`), and the email claim is added twice. The decoded payload keys should be confirmed by decoding a real token from the running API before being presented as fact; the claim **meanings** (sub/user id, email, name, role, exp, iss, aud) are certain from the source. An admin has **two** role claims (`USER` and `ADMIN`), which typically decode as a JSON array.

### `AuthResponseDto` (login response)

```json
{ "token": "…", "expiresAt": "2026-…Z", "userId": "…", "email": "…", "firstName": "…", "lastName": "…", "role": "…" }
```

`role = roles.FirstOrDefault() ?? "User"` — **only the first role**. For an admin (roles USER + ADMIN) this field may be `"USER"`; the fallback `"User"` is mixed-case. A frontend that decides "is admin" from `role === "ADMIN"` can be wrong; reading all role claims from the token (or calling an endpoint) is more reliable, and server-side `[Authorize]` remains the real enforcement.

### Flow

```text
Register ──POST /api/auth/register──▶ 200 {message}            (no token; user gets USER role)
Login    ──POST /api/auth/login─────▶ 200 AuthResponseDto      (token valid 2 h)
Request  ──Authorization: Bearer <token>──▶ JwtBearer validates signature, issuer, audience, lifetime
            ├─ invalid/missing/expired ─▶ 401
            ├─ valid, lacks ADMIN on admin endpoint ─▶ 403
            └─ valid & permitted ─▶ 2xx
Role change (e.g. promoted to ADMIN) ─▶ must log in again: old token still carries old role claims.
```

## 4. CORS configuration (version B only)

```csharp
const string FrontendPolicy = "FrontendPolicy";
builder.Services.AddCors(o => o.AddPolicy(FrontendPolicy, p =>
    p.WithOrigins("http://localhost:5173").AllowAnyHeader().AllowAnyMethod()));
// pipeline:
app.UseHttpsRedirection();
app.UseCors(FrontendPolicy);
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
```

- Exactly one allowed origin: `http://localhost:5173` (Vite default). `http://127.0.0.1:5173` or another port is a **different origin** and will be blocked.
- `AllowAnyHeader()` permits the `Authorization` and `Content-Type: application/json` headers that trigger a preflight; `AllowAnyMethod()` permits PUT/PATCH/DELETE.
- No `AllowCredentials()` — fine for bearer tokens in headers; cookies would not be accepted cross-origin.
- `UseCors` is placed before authentication, matching Week03 s20.
- `UseHttpsRedirection` is active. With the `http` launch profile there is no HTTPS port, so no redirect occurs; with the `https` profile an `http://localhost:5229` request can be redirected to `https://localhost:7119`, and redirected preflights fail CORS. The Frontend guide's `VITE_API_URL=http://localhost:5229/api` therefore assumes the `http` profile.

## 5. Differences between the two backend versions

| | `Backend Events API.zip` (version A, dated 28 Sep 2026) | `CampusEvents.Api.zip` (version B, dated 5 Nov 2026) |
|---|---|---|
| CORS | **None** — browser calls from React fail CORS | `FrontendPolicy` registered and applied (lines 102–116, 158–159 of `Program.cs`) |
| `RolesController` line 11 | `//[Authorize(Roles = "ADMIN")]` — **commented out**: any caller (even anonymous) can list/create/delete roles and assign ADMIN | `[Authorize(Roles = "ADMIN")]` active |
| Everything else (controllers, DTOs, models, migrations, JWT, Identity) | identical source | identical source |
| `CampusEvents.db`, `bin/`, `obj/` | differ (different builds / data) | — |

Why: the Postman guide §6 instructs "If no administrator currently exists, temporarily remove `[Authorize(Roles = "Admin")]` from RolesController while creating the first administrator … After this works, restore it … and log in again". Version A is the **bootstrapping state** (first admin creation, Week 01 Postman testing); version B is the **frontend-ready state** (Week 03 onward: CORS for `localhost:5173`, roles locked down). Leaving version A's role endpoints open would let anyone make themselves ADMIN — a useful security discussion point.

## 6. Frontend project (`campus-events-frontend.zip`, Week 03 state)

### Stack (`package.json`)

React `^19.2.8`, react-dom `^19.2.8`; Vite `^8.3.0`; TypeScript `~6.0.2`; `@vitejs/plugin-react` `^6.1.1`; ESLint `^10.10.0` with `typescript-eslint`, `eslint-plugin-react-hooks` `^7.1.1`, `eslint-plugin-react-refresh`. **No router, no form library, no Bootstrap, no query/state library.**
`tsconfig.app.json`: `target es2023`, `moduleResolution bundler`, `verbatimModuleSyntax`, `jsx react-jsx`, `noUnusedLocals/Parameters`, `erasableSyntaxOnly`; **no explicit `"strict"`** entry (confirm the effective value with `tsc --showConfig` before claiming strict mode for this project).

### Files and what is implemented

| File | Implemented |
|---|---|
| `main.tsx` | `createRoot(...).render(<StrictMode><App/></StrictMode>)` — StrictMode ⇒ effects run twice in development. |
| `App.tsx` | Static composition: `<Navbar/>`, `<h2>Welcome to CampusEvents</h2>`, `<Events/>`, `<Footer/>`. No routing; Home/Login/Register pages are never rendered. |
| `components/Navbar.tsx` | `<h1>` + `<nav className="menu">` with four `<a href="#">` links (Home, Events, Login, Register) — non-functional. |
| `components/Footer.tsx` | Static footer. |
| `components/EventCard.tsx` | Props `{ title, location, price }`; renders `£{price}`. |
| `components/TicketCounter.tsx` | Local `useState(1)`, min 1, no max (not linked to `availableTickets`; no booking call). |
| `pages/Events.tsx` | Uses `useEvents()`; renders loading / error / empty / list states; one `TicketCounter` per event; `key={event.id}`. |
| `pages/Home.tsx`, `Login.tsx`, `Register.tsx` | Placeholder text only. |
| `hooks/useEvents.ts` | `useState` for events/loading/error (`error` is `""` initially); `useEffect(..., [])` with nested async function, try/catch/finally. **No cleanup** (no abort, no ignore flag). Error message typo "Unabale to load events.". |
| `services/eventService.ts` | `getEvents()` → `fetch("http://localhost:5229/api/events")` (hard-coded URL), checks `response.ok`, returns `response.json()` typed as `Promise<Event[]>` (not runtime-validated). |
| `types/Event.ts` | `Event` interface matching `EventDto`. |
| `App.css` / `index.css` | `.menu` flex styles; template global styles. |

`required files (1).zip` contains the same 12 `src` files, unchanged.

### Week 05 guide additions

Install: `npm install @hookform/resolvers bootstrap react-hook-form react-router-dom zod`.
Adds `.env` (`VITE_API_URL=http://localhost:5229/api`, `VITE_DEMO_ADMIN_TOKEN=`), `types/EventDto.ts`, `types/Category.ts`, `services/api.ts` (generic `request<T>`, `ApiError`, 204/empty-body handling, optional Bearer for `requiresAdmin`), `services/eventService.ts` (`list/get/create/update/remove`), `services/categoryService.ts`, hooks `useEvents` (with `active` flag), `useEvent(id)` (deps `[id]`), `useCategories`, components `EventCard` (takes whole `event`, Bootstrap card, `Link` to details), `EventForm` (RHF + Zod schema: title 3–120, description ≥10, optional http(s) image URL, location ≥2, required dates, price ≥0, integer capacity ≥1, category ≥1, `superRefine` end > start; `setError("root.server")` for API errors; `isSubmitting` disables submit), `Navbar` (NavLink with `end`), `AppLayout` (Navbar + `<Outlet/>` + Footer), pages `Home`, `Events`, `EventNew` (navigate with `replace` after create), `EventEdit` (`useParams`, id validation, `useMemo` default values, `toLocalDateTimeInput`), `EventDetails` (confirm-delete, deleting state, error display), `NotFound`; `App.tsx` routes (`/`, `/events`, `/events/new`, `/events/:id`, `/events/:id/edit`, `*`) under `AppLayout`; `main.tsx` wraps `<BrowserRouter>` and imports Bootstrap CSS.
The guide states that bookings, reviews, users, roles and authentication are **not** implemented by this Week 05 frontend.

## 7. Gaps between backend capability and frontend implementation

| Backend capability | Week 03 project | After Week 05 guide | Gap / note |
|---|---|---|---|
| `GET /api/events` | ✅ (hard-coded URL) | ✅ via `request<T>` + env URL | — |
| `GET /api/events/{id}` | ❌ | ✅ `useEvent` | `useEvent(NaN)` still fires a request when the id is invalid (validity is checked only in rendering). |
| `POST/PUT/DELETE /api/events` (ADMIN) | ❌ | ✅ with `VITE_DEMO_ADMIN_TOKEN` | Token pasted into `.env` is a classroom shortcut; no login; Edit/Delete buttons visible to everyone; 403/401 only surfaced as messages. |
| Server error messages | — | partial | Plain-string 400s (date order, capacity, delete-blocked) display as "Request failed (HTTP 400)"; validation problems show the generic title. |
| `GET /api/categories` | ❌ | ✅ (form dropdown) | Category CRUD (ADMIN) not implemented; 409 duplicate handling not used. |
| `POST /api/auth/register`, `/login` | placeholders | ❌ | No auth context/store, token storage, logout, expiry handling, protected routes (Lecture 6 / Tutorial 6, not supplied). |
| Roles (`USER`/`ADMIN`) | ❌ | ❌ | `AuthResponseDto.role` returns only the first role; role-based UI must handle `USER` + `ADMIN`. |
| Bookings (`my-bookings`, create, cancel, status) | `TicketCounter` UI only | ❌ | TicketCounter not wired to `POST /api/bookings`; no max of 20 or `availableTickets` limit. |
| Reviews (list, create, delete) | ❌ | ❌ | Requires a non-cancelled booking and one review per user/event. |
| `DELETE /api/users/{id}`, role management | ❌ | ❌ | Admin tooling only. |
| Caching/refetch | ❌ | ❌ (manual `useEffect` hooks) | TanStack Query refactor previewed for Week 08 (Week03 s28) — Lecture 7 not supplied. |
| Search/filter/pagination | ❌ | ❌ | API has no query parameters for search/paging; any filtering would be client-side (Lecture 9, not supplied). |
| Accessibility | — | partial | `EventForm` labels lack `htmlFor`/`id`; errors not linked with `aria-describedby` (Week05 s25 asks for both). `role="status"` used for loading text. |

## 8. CampusEvents lab progression (8 stages)

A staged lab path derived from the supplied materials. Stages 1–6 are fully grounded in supplied files; stages 7–8 extend into weeks whose lectures are missing and must be labelled supplementary.

| Stage | Roadmap week | Goal | Grounding (supplied files) | Key lesson ids |
|---|---|---|---|---|
| 1. Explore the API | T01 | Run/inspect the backend, test every endpoint, understand 200/201/204/400/401/403/404, bootstrap the first ADMIN | Lecture 01; Postman guide; backend version A → B | web-mvc-dtos, http-methods-status |
| 2. Application shell | T02 | Vite React+TS app, Navbar/Footer, pages, typed `EventCard`, `TicketCounter`, hard-coded list with keys | Week 02 guide; Lecture 02 | react-components-jsx, react-props, react-state-events, react-lists-keys |
| 3. Fetch real data | T03 | `eventService.getEvents`, `response.ok`, `useEffect([])`, four UI states, `useEvents` hook, CORS fix | Week03 deck; `campus-events-frontend.zip`; Program.cs CORS | http-fetch-response-ok, http-four-ui-states, react-useeffect, react-custom-hooks, http-cors |
| 4. Robust data layer | T03→T05 | Centralised `request<T>`, `ApiError`, env base URL, 204 handling, cleanup (`active` flag → AbortController) | Frontend guide §3, §7, §10; Week05 s19 | http-service-modules, http-abortcontroller |
| 5. Routing & layout | T04–T05 | `BrowserRouter`, `AppLayout` + `Outlet`, `NavLink`, `/events/:id` details, `useParams` validation, `NotFound` | Week05 s5–13; Frontend guide §15–17, §21–24 | router-basics, router-nested-layouts-outlet, router-dynamic-params |
| 6. Forms & CRUD | T05 | `EventForm` (Zod + RHF), create (POST 201 → navigate), edit (PUT 204), delete (confirm, 400 when bookings/reviews exist) with demo admin token | Week05 s21–37; Frontend guide §5–6, §14, §19–21; EventsController | forms-validation, forms-zod-rhf, crud-post-put-delete, router-navigation |
| 7. Authentication & roles | T07 (Lecture 6 **not supplied**) | Register/login pages, store token + `expiresAt`, logout, attach Bearer automatically, protected/admin routes, handle 401 (re-login) vs 403, hide admin UI for USER (server still enforces) | Backend AuthController, JWTService, AuthResponseDto, Postman guide §15 (university code); lesson content supplementary | sec-authn-authz, sec-jwt-anatomy, sec-401-403-expiry, router-protected-routes, sec-token-storage |
| 8. State management & user features | T08–T10 (Lectures 7 and 9 **not supplied**) | Refactor hooks to TanStack Query (keys, staleTime, mutations + invalidation), Zustand for auth/theme UI state, bookings (`my-bookings`, create/cancel), reviews, client-side search/filter | Week03 s28–29 preview; Bookings/Reviews controllers; lesson content supplementary | state-kinds, tq-*, zustand-*, arch-search-filter-pagination |
