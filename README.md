# Design Engineering Academy

A personal learning platform for training from beginner product designer toward
elite design engineering ability. Fifteen modules, seventy-five lessons, fifteen
build projects, and an evidence-based record of what has actually been completed.

Sign in and your progress follows you to any device. Supabase holds the
learning state, the curriculum stays in this repository, and the browser keeps a
working copy so a dropped connection never loses what you just wrote.

Supabase is optional: without it the application runs local-first, exactly as it
did before cloud sync, with sign-in switched off.

---

## Running locally

Requires **Node 20.9+** (developed on Node 24) and npm.

```bash
npm install
```

```bash
npm run dev
```

Then open <http://localhost:3000>.

### All scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server with hot reload |
| `npm run build` | Production build (prerenders 148 pages) |
| `npm start` | Serves the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Vitest, single run |
| `npm run test:watch` | Vitest in watch mode |

> **Do not run `npm run build` while `npm run dev` is running.** The dev server
> rewrites `.next/dev/types`, and a concurrent build reads them mid-write and
> reports route-type errors that do not exist. Stop the dev server, then build.

---

## Supabase

Accounts and cross-device sync are optional. Without a Supabase project the
application runs local-first with sign-in switched off; nothing is gated.

### 1. Create the project

Supabase dashboard → **New project**. Note the region and database password
(the password is for the dashboard only — the application never uses it).

### 2. Run the migration

Open **SQL Editor** and run `supabase/migrations/0001_user_learning_state.sql`
in full. It is idempotent, so re-running it is safe. It creates:

- `public.user_learning_state` — one row per user, `user_id` as the primary key
- an `updated_at` trigger, which the conflict guard depends on
- table grants for `authenticated` (and none for `anon`)
- **row level security**, enabled, with four owner-scoped policies

### 3. Confirm RLS is on

**Table Editor → user_learning_state → RLS** should read *enabled*, with four
policies. If RLS is ever off, the publishable key shipped to the browser can
read every row — this is the single most important setting in the project.

### 4. Authentication

**Authentication → Providers → Email**: enabled. Decide whether to require
email confirmation; the sign-up flow handles both.

**Authentication → URL Configuration**:

| Field | Value |
| --- | --- |
| Site URL | `https://<your-project>.vercel.app` |
| Redirect URLs | `https://<your-project>.vercel.app/auth/callback` |
| Redirect URLs | `http://localhost:3000/auth/callback` |

Both entries matter: the production one for the deployed site, the localhost one
so development keeps working. Password reset and email confirmation both return
through `/auth/callback`, which exchanges the code for a session cookie.

### 5. Environment variables

Copy `.env.example` to `.env.local` and fill in from **Project Settings → API**:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

These are the only two variables the application reads. **The service-role key
is not required and must never be set here** — anything prefixed
`NEXT_PUBLIC_` is compiled into the JavaScript served to every visitor.

---

## Deploying to Vercel

Vercel detects Next.js; the defaults are correct. No `vercel.json` is needed.

| Setting | Value |
| --- | --- |
| Framework | Next.js (auto-detected) |
| Build command | `next build` |
| Install | `npm install` (`package-lock.json`) |
| Node | `>=20.9.0` via `engines` in `package.json` |
| Output | default |

### Environment variables

Add both under **Project Settings → Environment Variables**, for Production,
Preview and Development:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```

Set them **before** the first deploy. Next.js inlines `NEXT_PUBLIC_` values at
build time, so adding them afterwards requires a redeploy to take effect.

### Option A — Vercel CLI (no git repository needed)

```bash
npm i -g vercel
```

```bash
vercel
```

Accept the detected settings, then promote:

```bash
vercel --prod
```

### Option B — Git import

This directory is not yet a git repository. Initialise one first:

```bash
git init && git add -A && git commit -m "Design Engineering Academy"
```

Push to GitHub, then **Add New → Project** in the Vercel dashboard and import
it. `.gitignore` already excludes `.env*` while keeping `.env.example`, so no
credentials are committed.

### After the first deploy

Go back to Supabase → **Authentication → URL Configuration** and set the Site
URL and redirect URL to the real `*.vercel.app` domain. Until that is done,
confirmation and password-reset emails will point at the wrong host.

### Restricting sign-ups to just you

Once your own account exists: **Authentication → Providers → Email → Allow new
users to sign up: off**. Existing accounts keep working and you can still sign
in from any new device; only *new* account creation is refused. The
`/sign-up` route stays in place and Supabase rejects the attempt, so nothing
needs removing from the application.

---

## Data architecture

Three stores, three different jobs. The split is the whole design:

| What | Lives in | Why |
| --- | --- | --- |
| **Curriculum content** — modules, lessons, projects, resources, competency definitions | **The repository** | Authored content, identical for every user, versioned and reviewed with the code. It is never copied into the database. |
| **Permanent learning state** — lesson progress, exercise completion, reflections, notes, project records and links, resource marks | **Supabase** | One row per user in `user_learning_state`, protected by row level security. This is the source of truth, and what makes the same account show the same progress on any device. |
| **Unsaved drafts and cache** — in-flight note and reflection text, the last known copy of the three stores, the chosen theme | **Browser local storage** | Lets a dropped connection or a closed tab keep work that has not reached the cloud yet. It is a cache, not the record: on the next load the cloud replaces it. |

**Nothing derived is stored anywhere.** Percentages, completion statuses,
recent activity and competency evidence are recalculated from the recorded
facts every time, so a rule change can never leave a stale figure behind.

The one deliberate exception to "cloud wins" is the theme. A blocking script
reads it before React exists, so adopting a cloud value would flip the interface
after paint. It is synced into the account and applied only on a device that has
never chosen one.

---

## Architecture

```
app/          14 routes — thin server components, no business logic
components/   80 components in 12 groups (ui, shell, lesson, curriculum, …)
lib/          32 modules — curriculum index, progress derivation, search,
              persistence, hooks. All framework-free and unit-tested.
stores/       4 Zustand stores (progress, notes, resources, ui)
types/        7 schema modules — the contracts everything else is written against
content/      21 authored data modules — the curriculum itself
tests/        16 Vitest suites, 329 tests
```

**Facts, not statuses.** The progress stores record only what happened —
`reachedEndAt`, `exerciseCompletedAt`, `reflectionAnsweredAt`. Every status is
derived by pure functions in `lib/progress/derive.ts`. Nothing stores "complete",
so the rules can change without migrating anyone's data.

**One index, built once.** `lib/curriculum/curriculum-index.ts` builds ordered
arrays and id maps in a closure at module load. Every query is an O(1) lookup
returning a referentially stable value, which is why curriculum reads are safe to
call directly in a render body.

**Hydration is explicit.** Anything whose value differs between server and
browser is gated on `useMounted()` (a `useSyncExternalStore` hook) plus the
store's own `hasHydrated` flag, so the first client render always matches the
server markup.

**Persistence is defensive.** Versioned envelopes, legacy-key adoption, and
corrupt entries recovered rather than thrown on — unreadable data starts the
store empty and reports itself in Settings instead of bricking the app.

---

## Curriculum

| | |
| --- | --- |
| Phases | 5 |
| Modules | 15 |
| Lessons | 75 (exactly 5 per module) |
| Projects | 15 (one per module) |
| Competencies | 33 — 13 design, 13 engineering, 7 hybrid |
| Concept chains | 5, spanning 29 linked concepts |
| Library resources | 75 |

Every lesson carries an objective set, first-principles explanation, design and
engineering perspectives plus their synthesis, an industry example, a walkthrough,
common mistakes, one practical exercise, one reflection question with a hint, and
its own resources. `tests/final-review.test.ts` enforces all of this against the
real content, so authoring that drops a part fails the build.

Evidence is recorded at three levels and never as a score:

- **Exposure** — a tagged lesson completed
- **Practised** — that lesson's exercise completed
- **Demonstrated** — a tagged module **project** completed

A module is not finished until its project is built. Completing all five lessons
reports "project outstanding", never "complete".

---

## Known limitations

- **Every route ships the whole curriculum.** The command palette indexes all
  1,033 documents for offline search, and it lives in the shell, so ~234 KB
  gzipped of curriculum JavaScript is on first load for every page. Acceptable
  locally; the first thing to address if this is ever hosted for others.
- **Conflicts are reported, not merged.** If two devices both change things
  while offline, the second save is refused and you choose which version wins.
  Correct for one person; not a collaborative editor.
- **No export.** Progress can be read back from Supabase, but the application
  offers no download.
- **No automated component tests.** Vitest runs in a Node environment with no
  DOM library, so the 355 tests cover pure logic, curriculum integrity and the
  sync engine (against a fake Supabase client). Interactive behaviour has been
  verified manually in the browser.
- **The Supabase auth client ships on every route**, even with no project
  configured, because the sync layer is mounted in the application frame.
- **External resource links are not health-checked.** URLs were authored
  deliberately rather than generated, but nothing detects when one rots.
- **A module teaches more competencies than its project can demonstrate.** This
  is intentional and the interface says so, but it means "demonstrated" will
  always trail "practised" for some competencies no matter how much work is done.
