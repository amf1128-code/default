# Workout App - Build Plan

## Overview
Migrating from a single `index.html` vanilla JS workout tracker to a multi-page Next.js app with Supabase backend. Each phase below is designed to be a self-contained prompt for Claude Code.

---

## Phase 1: Project Scaffold + Homepage [COMPLETE]

### Goal
Set up the Next.js project, port the existing dark theme and design language, and build a homepage that serves as the new front door to the app.

### What was built
- Next.js 16 with App Router, TypeScript, Tailwind CSS
- Homepage with QuickStart CTA, LastWorkout summary, StreakTracker (weekly dots), StatsCards
- Bottom navigation bar (Home, Workout, History) with gold active state
- Dark theme ported from original design
- TypeScript types (`WorkoutRecord`, `ExerciseRecord`, `SetRecord`, `MuscleGroup`)
- Exercise database in `src/lib/exercises.ts`
- localStorage wrapper in `src/lib/storage.ts`
- Placeholder pages for `/workout` and `/history`

---

## Phase 2: Workout Flow (Port + Improvements)

### Goal
Build the complete workout experience: muscle group selection, exercise logging with UX improvements, rest timer, workout summary. Also add a settings page for timer defaults and saved workout templates. Split "arms" into biceps and triceps for more granular targeting.

### Context
- Phase 1 is complete. The app scaffolding, homepage dashboard, bottom nav, types, exercise database, and localStorage wrapper are all in place.
- The existing `index.html` in the repo root has the original vanilla JS implementation for reference.
- Current file structure uses `src/app/` for routes and `src/components/` for components.
- Design tokens are defined in `src/app/globals.css` as CSS custom properties exposed via `@theme inline` (e.g., `--color-gold`, `--color-surface`, `--color-border`). Use these as Tailwind classes like `bg-gold`, `text-surface`, `border-border`, etc.
- Types are in `src/lib/types.ts`, exercise data in `src/lib/exercises.ts`, storage in `src/lib/storage.ts`.

### Tasks

#### 2.1 — Split arms into biceps and triceps
- Update the `MuscleGroup` type in `src/lib/types.ts`: remove `"arms"`, add `"biceps"` and `"triceps"`.
- Update `AREA_META` in `src/lib/exercises.ts`:
  - Remove the `arms` entry
  - Add `biceps: { icon: "biceps", label: "Biceps" }` and `triceps: { icon: "triceps", label: "Triceps" }`
- Update `WORKOUTS` in `src/lib/exercises.ts`:
  - Remove the `arms` workout arrays
  - Add `biceps` arrays (e.g., `["Barbell Curls", "Hammer Curls", "Preacher Curls", "Concentration Curls"]`, etc.)
  - Add `triceps` arrays (e.g., `["Tricep Dips", "Skull Crushers", "Tricep Pushdowns", "Overhead Tricep Extension"]`, etc.)
- Add SVG icons for biceps and triceps (simple muscle silhouettes, same style as existing icons)
- The area grid on the workout selection page should now show 7 muscle groups in a 2-column grid

#### 2.2 — Muscle group selection page (`src/app/workout/page.tsx`)
- Replace the Phase 1 placeholder with the full selection UI
- Port the existing area grid with SVG icons from the original `index.html`, multi-select toggle, gold accent and checkmark on selected cards
- **Exercise count selector**: when a muscle group is selected, show a small stepper (−/+) or dropdown on the card to choose how many exercises (default: 4, range: 2-6). This controls how many exercises are generated for that group.
- **Workout mode toggle** at the top or below the grid, with three options:
  - "Random" (default) — generates a random workout from the exercise database
  - "Repeat Last" — uses the exact exercises from your most recent workout for each selected muscle group. If no history exists for a group, falls back to random. Gray out / disable this option if there's no history for the selected groups.
  - "Template" — pick from saved templates (see 2.7). Only shown if templates exist.
- "Start Workout" button appears when 1+ areas selected, shows selected area names
- On start: generate workout based on mode, store the workout state, and navigate to `/workout/active`

#### 2.3 — Active workout page (`src/app/workout/active/page.tsx`)
- Use a client-side state approach (React context or a hook) rather than URL params, since the workout data is generated at start time
- Hero bar with workout title ("[Areas] Day") and Back button (with confirmation if data has been entered)
- **Rest timer display** at the top of the workout, below the hero bar:
  - Shows "REST — 1:30" counting down, then "OVERTIME — 0:15" when it goes negative
  - Timer auto-starts when the user logs a set (fills in weight + reps for any set)
  - Tap the timer to pause/resume
  - Tap a "Skip" button to dismiss the timer and hide it until the next set is logged
  - Timer value defaults to the user's setting (see 2.7), but can be adjusted for this workout via a small edit icon next to the timer that opens a quick picker (30s, 60s, 90s, 120s, 180s)
- Render an `ExerciseCard` for each exercise

#### 2.4 — ExerciseCard component (`src/components/workout/ExerciseCard.tsx`)
- Exercise name with completion dot indicator (green when any set has data)
- "Last session: X lbs" badge when previous data exists (use `getLastWeight()` from storage)
- Renders a list of `SetRow` components
- **Add Set button** (`+`) at the bottom of the card. Appends a new set row with the same prefilled weight. Keep it compact — a small pill/text button, not a big CTA.
- Each exercise starts with 3 sets by default
- The exercise card should track its own sets state and expose it upward for the finish/summary step

#### 2.5 — SetRow component (`src/components/workout/SetRow.tsx`)
- Set label (S1, S2, S3...)
- Weight input (number, `inputmode="decimal"`, prefilled from last session)
- Reps input (number, `inputmode="numeric"`)
- **Rep quick-select chips**: 3 small pill buttons labeled `5`, `8`, `12` next to or below the reps input. Tapping one fills the reps field with that value. If the reps field already has that value, tapping again clears it. Chips should be subtle/muted by default, highlighted when their value matches the current reps.
- **Remove set button** (`×`): appears on each set row, but only when there are more than 1 set on that exercise. One-tap remove with no confirmation. Small and unobtrusive (e.g., a dim `×` at the far right of the row).

#### 2.6 — Workout summary page (`src/app/workout/summary/page.tsx`)
- Shows all exercises with logged sets (exercise name, each set's weight × reps)
- Shows workout duration (time from start to finish)
- Shows total rest time and total "overtime" (time past the timer, a.k.a. "time wasted" — track this as a field on the workout record for Phase 4 stats)
- "Start New Workout" button returns to homepage (not workout selection)
- Saves the workout record to storage (localStorage for now)
- Workout record should now include: `duration`, `totalRestTime`, `totalOvertime` fields

#### 2.7 — Settings page (`src/app/settings/page.tsx`)
- Add a "Settings" icon/tab to the bottom nav (gear icon), making it 4 tabs: Home, Workout, History, Settings
- **Default rest timer**: picker or stepper to set the default rest timer duration (30s, 60s, 90s, 120s, 180s). Default: 90s. Stored in localStorage under a settings key.
- **Workout templates section**:
  - "Create Template" button opens a form:
    - Template name (text input, e.g., "Push Day")
    - Select muscle groups, then for each group pick specific exercises from the database
    - Save button
  - List of saved templates with name and exercise count
  - Tap a template to edit it, swipe or tap delete to remove
  - Templates stored in localStorage under a separate key (will migrate to Supabase in Phase 3)
- Settings stored via a new `src/lib/settings.ts` module:
  - `getSettings(): UserSettings`
  - `saveSettings(settings: UserSettings): void`
  - `getTemplates(): WorkoutTemplate[]`
  - `saveTemplate(template: WorkoutTemplate): void`
  - `deleteTemplate(id: string): void`
- Add types to `src/lib/types.ts`:
  - `UserSettings { defaultRestTimer: number }`
  - `WorkoutTemplate { id: string, name: string, exercises: { area: MuscleGroup, name: string }[] }`

#### 2.8 — Wire up the full flow
- Homepage "Start Workout" → Workout Select (pick groups, mode, count) → Active Workout (log sets, timer) → Summary → Homepage
- Bottom nav works across all pages
- Workout data persists in localStorage and appears on homepage (last workout, stats, streak)

### Done when
- Full workout flow works end to end
- Muscle groups include biceps and triceps (no more combined "arms")
- Can choose exercise count per muscle group (default 4, range 2-6)
- Can choose Random, Repeat Last, or Template mode
- Rep chips (5, 8, 12) fill the reps field on tap
- Can add sets to any exercise, can remove sets down to a minimum of 1
- Weight is prefilled from last session
- Rest timer counts down between sets, goes negative as overtime
- Timer default is configurable in settings
- Can create, edit, and delete workout templates in settings
- Workout summary shows duration, rest time, and overtime
- Workout saves to localStorage and appears on homepage

---

## Phase 3: Supabase Integration (Auth + Database)

### Goal
Replace localStorage with Supabase for persistence. Add user authentication so multiple people can use the app with their own data.

### Prerequisites
- A Supabase project created at supabase.com
- Project URL and anon key added to `.env.local`

### Context
- Phases 1-2 are complete. The app has a full workout flow, settings page, templates, and rest timer — all backed by localStorage.
- `src/lib/storage.ts` handles workout history, `src/lib/settings.ts` handles user settings and templates.
- Types are defined in `src/lib/types.ts`.

### Tasks
1. Install Supabase client (`@supabase/supabase-js`) and set up the client in `src/lib/supabase.ts`.

2. Create the database schema in Supabase (provide SQL migration):
   ```sql
   create table workouts (
     id uuid primary key default gen_random_uuid(),
     user_id uuid references auth.users not null,
     date timestamptz not null default now(),
     areas text[] not null,
     duration int,           -- seconds
     total_rest_time int,    -- seconds
     total_overtime int,     -- seconds
     created_at timestamptz default now()
   );

   create table workout_exercises (
     id uuid primary key default gen_random_uuid(),
     workout_id uuid references workouts on delete cascade not null,
     exercise_name text not null,
     area text not null,
     sort_order int not null
   );

   create table exercise_sets (
     id uuid primary key default gen_random_uuid(),
     exercise_id uuid references workout_exercises on delete cascade not null,
     set_number int not null,
     weight numeric,
     reps int
   );

   create table user_settings (
     user_id uuid primary key references auth.users,
     default_rest_timer int not null default 90,
     updated_at timestamptz default now()
   );

   create table workout_templates (
     id uuid primary key default gen_random_uuid(),
     user_id uuid references auth.users not null,
     name text not null,
     exercises jsonb not null,  -- [{area, name}]
     created_at timestamptz default now()
   );
   ```

3. Set up Row Level Security (RLS) policies so users can only read/write their own data:
   - `workouts`: SELECT, INSERT, UPDATE, DELETE where `user_id = auth.uid()`
   - `workout_exercises` and `exercise_sets`: access through their parent workout's user_id
   - `user_settings`: where `user_id = auth.uid()`
   - `workout_templates`: where `user_id = auth.uid()`

4. Build auth pages:
   - `src/app/auth/login/page.tsx` - email + password login form
   - `src/app/auth/signup/page.tsx` - email + password signup form
   - Keep it minimal - same dark theme, centered card layout
   - After login/signup, redirect to homepage

5. Create `src/hooks/useAuth.ts`:
   - Wraps Supabase auth session
   - Provides `user`, `signIn`, `signUp`, `signOut`
   - Handles auth state changes

6. Create auth-aware middleware or layout wrapper:
   - Redirect unauthenticated users to `/auth/login`
   - Redirect authenticated users away from auth pages to `/`

7. Replace `src/lib/storage.ts` localStorage calls with Supabase queries:
   - `getHistory()` → `SELECT from workouts + exercises + sets WHERE user_id = current user, ORDER BY date DESC`
   - `saveWorkout()` → `INSERT into workouts, workout_exercises, exercise_sets` (include duration, rest time, overtime)
   - `getLastWeight()` → query the most recent set for a given exercise name for this user
   - `clearHistory()` → `DELETE from workouts WHERE user_id = current user`

8. Replace `src/lib/settings.ts` localStorage calls with Supabase queries:
   - Settings → `user_settings` table
   - Templates → `workout_templates` table

9. Add a user menu to the settings page - shows email/name, sign out option.

10. Optional: one-time localStorage migration. If a user has existing localStorage data and signs up, offer to import their old workouts into the database.

### Done when
- Can create an account and log in
- Workout data persists in Supabase, not localStorage
- Settings and templates persist in Supabase
- Each user sees only their own data
- Signing out and back in preserves all data
- App redirects properly (unauthed → login, authed → home)

---

## Phase 4: Progress Tracking + Polish

### Goal
Build the progress/stats features and polish the overall experience. This is where the app starts to feel like a real fitness tool.

### Context
- Phases 1-3 are complete. The app has auth, Supabase persistence, workout flow with timer, templates, and settings.
- Workout records include `duration`, `totalRestTime`, and `totalOvertime` fields.

### Tasks
1. Build the progress page (`src/app/progress/page.tsx`):
   - **Exercise weight over time chart**: user picks an exercise from a dropdown, sees a line chart of their max weight per session over time. Use a lightweight chart library (e.g., recharts or chart.js).
   - **Volume per muscle group**: bar chart showing total sets per muscle group over the last 4 weeks. Shows which areas are getting attention and which are neglected.
   - **Personal records section**: list of PRs - heaviest weight logged per exercise. Highlight recent PRs.
   - **"Time wasted" tracking**: show total overtime accumulated across workouts. Could be a chart over time (are you getting more disciplined with rest?) or a simple running total. Pull from the `totalOvertime` field saved in Phase 2.

2. Enhance the homepage stats:
   - Make the streak tracker pull from real Supabase data
   - Add a "weekly volume" mini-chart or progress bar
   - Show personal records that were hit in the last workout
   - Show average rest discipline (% of time within timer vs overtime)

3. Add workout category placeholders on homepage:
   - Show cards for future categories: Cardio, Flexibility, Nutrition
   - Each card is visually distinct but clearly inactive ("Coming Soon" label or muted styling)
   - Only Lifting/Strength is tappable and routes to `/workout`

4. History page improvements:
   - Add filtering by muscle group
   - Add date range filtering (this week, this month, all time)
   - Show total volume (sets x reps x weight) per workout
   - Show rest time / overtime per workout

5. Add a Progress tab to the bottom nav (5 tabs: Home, Workout, History, Progress, Settings)

6. General polish:
   - Loading states and skeletons for async data fetches
   - Error handling for failed Supabase queries (toast notifications)
   - Smooth page transitions / animations
   - PWA setup (manifest.json, service worker) so it can be installed on a phone homescreen
   - Responsive design check - should work well on phone, tablet, and desktop

### Done when
- Progress page shows meaningful charts from real workout data
- "Time wasted" / overtime trends are visible in progress
- Homepage feels like a complete dashboard
- Future category placeholders are visible but non-functional
- History page supports filtering
- App is installable as a PWA on mobile

---

## Future Phases (not yet scoped)

These are ideas to revisit once Phases 1-4 are complete:

- **Cardio tracking**: log runs, bike rides, rowing. Different input model (distance, time, pace vs. weight/reps).
- **Flexibility/mobility**: stretching routines, yoga flows. Timer-based rather than rep-based.
- **Nutrition logging**: meal tracking, macro counting. Possibly integrate with a food database API.
- **Social features**: share workouts, compare with friends, workout together.
- **Smart workout generation**: avoid repeating yesterday's exercises, suggest progressive overload, periodization.
- **Custom exercises**: let users add their own exercises beyond the built-in database.
- **Rest timer audio/haptic**: sound or vibration when timer hits zero.
- **Body measurements**: track weight, body fat %, measurements over time.
- **Superset / circuit support**: group exercises together with shared rest timers.
