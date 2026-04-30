# biip-zvejyba-web

Mobile-first React/Vite frontend for the Lithuanian commercial-fishing app
(Žvejyba). Pairs with [biip-zvejyba-api](../biip-zvejyba-api). Lithuanian-
only UI; no i18n library.

Žvejys (fisherman) flow: pick fishing type (Kuršių mariose / Vidaus
vandenyse / Polderiuose) → place tools (nets, traps) → register catches
(boat preliminary + shore total for ESTUARY; shore-only for INLAND_WATERS
and POLDERS) → end fishing.

## Stack

- React 18, Vite 6, TypeScript (strict)
- React Query 3 for server state, Redux Toolkit + redux-persist for the
  user slice (everything else is React Query / Context)
- Formik + Yup forms, styled-components 6
- `@aplinkosministerija/design-system` for fields, theme breakpoints
  (`device.mobileL`, `device.desktop`)
- Sentry for errors
- Node ≥ 20 < 21 (see `engines`)

## Repo layout

```
src/
├─ App.tsx                 router + login bootstrapping (eGates ticket, refresh)
├─ main.tsx                Redux + QueryClient + Sentry + providers
├─ pages/                  16 pages, route-mapped via utils/routes.tsx
├─ components/
│  ├─ buttons/             Button, LargeButton, FishingLocationButton, …
│  ├─ cards/               FishingCard, ToolsGroupCard, TimeLineItem, …
│  ├─ containers/          FishingActions (3 hero buttons), BuildTools, …
│  ├─ fields/              wrappers around design-system inputs
│  ├─ forms/               LocationForm (polder / bar / inland branches), ToolForm, …
│  ├─ headers/             LogoHeader, BackHeader
│  ├─ layouts/             DefaultLayout, Modal, Popup, PopUpWithImage, …
│  ├─ other/               LoaderComponent, FishRow, ErrorBoundary, …
│  ├─ popups/              one file per PopupContentType (see catalogue)
│  └─ providers/
│     ├─ PopupProvider.tsx        showPopup / hidePopup context
│     └─ GeolocationProvider.tsx  coordinates / loading / refresh context
├─ state/user/reducer.ts   only user slice; persisted via redux-persist
└─ utils/
   ├─ api.ts               Axios wrapper, all REST calls live here
   ├─ types.ts             User, Fishing, Tool, Polder, Location, …
   ├─ constants.ts         enums (LocationType, RoleTypes, PopupContentType, …)
   ├─ routes.tsx           route table, role + investigator filtering
   ├─ hooks.ts             useCurrentFishing, useFishWeights, useFishTypes, …
   ├─ functions.ts         toast helpers, isShoreOnlyWeighing, date utils
   ├─ validations.ts       Yup schemas
   ├─ texts.ts             validation/error/button labels (LT)
   └─ theme.ts, options.ts, index.ts (barrel)
```

## Page → route map (`utils/routes.tsx`)

| Page | Slug |
|---|---|
| Login | `/prisijungimas` |
| CantLogin | `/negalima_jungtis` |
| Profiles | `/profiliai` |
| Profile | `/profilis` |
| CurrentFishing | `/zvejyba` |
| Fishing | `/zvejybos_zurnalas/:fishingId` |
| FishingJournal | `/zvejybos_zurnalas` |
| FishingToolsEstuary | `/zvejyba/marios/irankiai` |
| FishingToolsInlandWaters | `/zvejyba/vidaus_vandenys/irankiai` |
| FishingToolsPolders | `/zvejyba/polderiai/irankiai` |
| FishingWeight | `/zvejyba/svoris` |
| Tools / Tool | `/irankiai` / `/irankiai/:id` |
| Users / User | `/nariai` / `/nariai/:id` |
| Research (+ variants) | `/moksliniai-tyrimai*` |

URL slug for `LocationType` lives in `FishingTypeRoute` enum:
`ESTUARY → marios`, `INLAND_WATERS → vidaus_vandenys`,
`POLDERS → polderiai`.

## Popups

`PopupProvider` is a context with `showPopup({ type, content })` /
`hidePopup`. Renders the right component per `PopupContentType`. Note:
popups live **outside** the router scope, so `useNavigate` / `useParams`
do not work inside them — pass any nav action via `content` instead.

| Type | File | When |
|---|---|---|
| `LOCATION_PERMISSION` | LocationPermission | geolocation denied |
| `START_FISHING` | StartFishing | begin a session (any type) |
| `START_FISHING_INLAND_WATERS` | StartFishingInlandWater | (legacy variant; not currently routed) |
| `SKIP_FISHING` | SkipFishing | "neplaukiu žvejoti" + reason |
| `END_FISHING` | EndFishing | confirm end |
| `CAUGHT_FISH_WEIGHT` | CaughtFishWeight | on-boat preliminary catch |
| `CONFIRM_WEIGHT` | ConfirmWeight | shore final weight + 20% diff guard |
| `TOOL_GROUP_ACTION` | ToolGroupAction | per-tool actions; "Sverti žuvį laive" hidden when `isShoreOnlyWeighing(type)` |

## State & data flow

### Redux (just the user)

`state/user/reducer.ts` holds `{ userData, loggedIn }`. Persisted to
localStorage via `redux-persist` (key `animalsConfig`). Everything else
is React Query or local component state.

### React Query

Wrapper in `utils/api.ts` (`Api` class with axios). `fishingProxy = '/api'`,
proxied by Vite to `VITE_PROXY_URL`. Axios interceptor injects
`Authorization: Bearer <token>` and `x-profile` from cookies (`token`,
`refreshToken`, `profileId`).

Reusable hooks in `utils/hooks.ts`:

- `useCurrentFishing()` — `['currentFishing']`
- `useFishWeights()` — `['fishingWeights']`
- `useFishTypes()` — `['fishTypes']`
- `useFishingWeightMutation()` — saves catches, invalidates weights
- `useGetCurrentProfile()` / `useFilteredRoutes()` — role-aware route gate
- `useGeolocation()` — re-exported context consumer

**Query key rule** (learnt the hard way): never put live coordinates
in a queryKey. The fishing-tools pages use just
`['location', currentFishing?.id]` and read fresh `coordinates` inside
the queryFn closure. See gotcha below.

### GeolocationProvider

`{ coordinates, loading, refresh }` context. Two-phase startup:

1. Fast initial fix — `getCurrentPosition({ enableHighAccuracy: false,
   timeout: 8000, maximumAge: 60000 })`. Cell/wifi cache, usually < 5 s.
2. Continuous high-accuracy `watchPosition` started **immediately and in
   parallel** — recovers from transient GPS errors silently.

`MIN_COORDINATE_DELTA = 0.0005°` (~50 m at LT latitude). `applyPosition`
returns the previous reference if the new fix is within the threshold —
keeps consumers' query keys stable.

Errors: only permission-denied surfaces a toast (timeouts are silent
because the watch is still running).

### Auth flow (`App.tsx`)

1. URL params parsed for `ticket` (eGates callback) and `eGates` (sign).
2. `shouldUpdateTokens()` — if `token` cookie missing but `refreshToken`
   exists, call `api.refreshToken()`.
3. If a `ticket` is in the URL → `eGatesLoginMutation(ticket)`. On
   success → `handleUpdateTokens(data)`. On error → navigate to
   `/negalima_jungtis`.
4. `useCheckUserInfo()` fetches `/auth/me`, sets Redux user + profiles.
   On 401 → clear cookies + log out.
5. `ProtectedRoute` / `PublicRoute` redirect based on `loggedIn` and
   `profileId` cookie (selected tenant / `personal`).

## Domain types (high level)

`utils/types.ts` and `utils/constants.ts` are the source of truth.

```ts
LocationType       = ESTUARY | INLAND_WATERS | POLDERS
FishingTypeRoute   = 'marios' | 'vidaus_vandenys' | 'polderiai'
PopupContentType   = CONFIRM | LOCATION_PERMISSION | START_FISHING | … | TOOL_GROUP_ACTION
RoleTypes          = USER | USER_ADMIN | OWNER
ToolTypeType       = NET | CATCHER
FishingEventType   = START | END | SKIP
EventTypes         = START | END | SKIP | BUILD_TOOLS | REMOVE_TOOLS | WEIGHT_ON_SHORE | WEIGHT_ON_BOAT
SickReasons        = BAD_WEATHER | SICK | OTHER
ServerErrors       = USER_NOT_FOUND | WRONG_PASSWORD | TOO_MANY_TOOLS | WEIGHT_DIFFERENCE | …
```

`Polder` shape: `{ id: number, name: string, area: number }` — fetched
via `api.getPolders()`. The picker stores `id` as a STRING in the
location object before sending it to the backend (LocationProp validator
expects string ids).

## Patterns when adding code

- **Form:** Formik + Yup schema in `utils/validations.ts`. Use the design-
  system fields (`SelectField`, `AsyncSelectField`, `NumericTextField`,
  `TextAreaField`). Keep `validateOnChange={false}` (consistent with
  existing forms).
- **Toasts:** `handleSuccessToast`, `handleErrorToast`,
  `handleErrorToastFromServer(response)` (maps backend error codes via
  `validationTexts`). Don't `console.error` — Sentry sees toasts via the
  ErrorBoundary path.
- **Popups:** add a new `PopupContentType` enum entry, render branch in
  `PopupProvider`, expose via `showPopup({ type, content })` from any
  component.
- **styled-components:** transient props with `$` prefix to avoid
  `Unknown DOM attribute` warnings:
  `styled.div<{ $variant?: string }>` then pass `$variant="error"`.
  Breakpoints from design-system: `@media ${device.mobileL}`,
  `${device.desktop}`.
- **Routing:** add to the `routes` array in `utils/routes.tsx` with
  `slug`, optional `tenantOwner: true` (OWNER/USER_ADMIN only) and
  `isInvestigator: true` (filters by `profile.isInvestigator`).
  `useFilteredRoutes()` reads these.
- **API:** add the call to the `Api` class in `utils/api.ts`, then a
  hook in `utils/hooks.ts` if it's reused.

## Gotchas (learnt the hard way)

1. **Don't put `coordinates` in `useQuery` keys.** A moving boat fires
   GPS updates every second — the queryKey changes, React Query refetches,
   the page sits in a loader, and the user can't place a tool. The three
   FishingTools pages key on `currentFishing?.id` only; the queryFn
   closure reads the latest coordinates from context.
2. **`isShoreOnlyWeighing(type)`** in `utils/functions.ts` is the single
   gate for "no on-boat weighing" UI. Returns true for `INLAND_WATERS`
   *and* `POLDERS`. Use it instead of comparing to `INLAND_WATERS`
   directly — every existing call site has been migrated.
3. **Polder picker lives in `LocationForm`, not in start-fishing popup.**
   The flow: tap "Polderiuose" → start a generic POLDERS fishing → land
   on `FishingToolsPolders` → click the pencil on `LocationInfo` → polder
   picker shows up (Pasirinkite polderį). No coordinates input on that
   branch (polders are selected, not detected).
4. **Polder location shape going to the API**: backend's `LocationProp`
   requires `id: string` and `municipality: { id, name }`. Frontend
   coerces polder id with `String(...)` and merges in
   `municipality` from the auto-detected `getLocation` result before
   sending. See `FishingToolsPolders.tsx` `setLocationManually` wrapper.
5. **GeolocationProvider** purposely silences transient GPS errors
   (timeout / unavailable). Only permission-denied toasts. The watch is
   continuous and will recover. Don't add toasts back without a reason.
6. **Build event coordinates** (`BuildTools.tsx`) read from the hook
   inside the click handler closure, not via deps. Same for
   `ToolGroupAction.tsx`, `CaughtFishWeight.tsx`, `StartFishingInlandWater.tsx`.
   This is fine — closures aren't re-render triggers.

## Dev workflow

```bash
npm install
npm run start             # vite dev on :8080 (--host so phones on LAN can hit)
npm run build             # tsc + vite build
npm run preview           # serve the build locally
npm run lint              # eslint --max-warnings 0 (strict)
```

Env vars (`.env`, all `VITE_*` to be exposed to the client):

```
VITE_PROXY_URL=https://zvejyba.biip.lt/api      # backend (or local)
VITE_UETK_URL=https://uetk.biip.lt/api          # water-body search
VITE_GIS_URL=https://gis.biip.lt/api            # GIS layers
VITE_MAPS_HOST=https://maps.biip.lt
VITE_SENTRY_DSN=...
VITE_ENVIRONMENT=local|staging|production
VITE_VERSION=...
```

## Conventions

- Conventional Commits (`feat:`, `fix:`, `chore:`, `refactor:`).
- Branches: kebab-case (`feat/polderiai`, `fix/stop-location-refetch-while-sailing`).
- Components PascalCase (`FishingActions.tsx`); utils/hooks camelCase.
- Lithuanian copy lives inline; treat `utils/texts.ts` as the place for
  validation/error/button labels you might re-use.
- Don't add comments that just restate code — leave only the *why*
  (constraints, prior incidents, hidden invariants).
