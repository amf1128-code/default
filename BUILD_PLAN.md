# Workout App - Build Plan

## Overview
Migrating from a single `index.html` vanilla JS workout tracker to a multi-page Next.js app with Supabase backend. Each phase below is designed to be a self-contained prompt for Claude Code.

---

## Phase 1: Project Scaffold + Homepage

### Goal
Set up the Next.js project, port the existing dark theme and design language, and build a homepage that serves as the new front door to the app.

### Tasks
1. Initialize a Next.js project (App Router, TypeScript, Tailwind CSS) inside this repo. The existing `index.html` should remain as a reference but the new app lives in `src/`.
2. Port the existing visual design into `globals.css` and Tailwind config:
   - Dark background (#0d0d0d), card surfaces (#141416), borders (#1f1f23)
   - Gold accent (#d4a053), green completion (#4ade80)
   - Inter font, existing typography scale
3. Create root layout (`src/app/layout.tsx`) with the dark theme, Inter font import, and a mobile-friendly max-width container.
4. Create a bottom navigation bar component (`src/components/layout/BottomNav.tsx`) with tabs: Home, Workout, History. Active tab uses gold accent.
5. Build the homepage (`src/app/page.tsx`) with these sections:
   - **Quick Start card** - prominent CTA button ("Start Workout") that navigates to `/workout`. This is the most important element on the page.
   - **Last Workout summary** - shows the most recent workout from history (date, muscle groups, exercise count). Tapping it expands to show details. If no history exists, show a friendly empty state ("No workouts yet - let's fix that!").
   - **Streak / Consistency tracker** - a row of 7 dots for the current week (Mon-Sun). Filled dots = days with a logged workout. Show the current streak count ("3 day streak" or "2 workouts this week").
   - **Quick Stats row** - 2-3 small stat cards: "Workouts this month", "Most trained muscle group", "Total sets this week". Derived from history data.
6. Move the exercise database (`WORKOUTS` and `AREA_META` objects from `index.html`) into `src/lib/exercises.ts` as typed TypeScript exports.
7. For now, create a `src/lib/storage.ts` that wraps localStorage with the same read/write pattern as the current app. This will be swapped for Supabase in Phase 3. The interface should be:
   - `getHistory(): WorkoutRecord[]`
   - `saveWorkout(record: WorkoutRecord): void`
   - `clearHistory(): void`
   - `getLastWeight(exerciseName: string): number | null`
8. Define TypeScript types in `src/lib/types.ts`:
   - `WorkoutRecord` (date, areas, exercises)
   - `ExerciseRecord` (name, area, sets)
   - `SetRecord` (weight, reps)
   - `MuscleGroup` (union type of the area keys)

### Done when
- `npm run dev` serves the app
- Homepage renders with all sections (using localStorage data from the old app if present)
- Bottom nav is visible and tabs highlight correctly
- No workout flow yet (that's Phase 2) - the "Start Workout" button can link to a placeholder page

---

## Phase 2: Workout Flow (Port + Improvements)

### Goal
Port the existing workout flow (muscle group selection -> exercise logging -> summary) into React components, and add the two UX improvements: rep quick-select and dynamic sets.

### Tasks
1. Build the muscle group selection page (`src/app/workout/page.tsx`):
   - Port the existing area grid with SVG icons, multi-select toggle, gold accent on selected
   - Move the SVG icon definitions to a component or inline SVGs
   - "Start Workout" button appears when 1+ areas selected, shows selected area names
   - On start, generate workout and navigate to `/workout/[id]` (id can be a timestamp or uuid)

2. Build the active workout page (`src/app/workout/[id]/page.tsx`):
   - Hero bar with workout title ("[Areas] Day") and Back button
   - Render an `ExerciseCard` for each exercise

3. Build `ExerciseCard` component (`src/components/workout/ExerciseCard.tsx`):
   - Exercise name with completion dot indicator (green when any set has data)
   - "Last session: X lbs" badge when previous data exists
   - Renders a list of `SetRow` components
   - **Add Set button** (`+`) at the bottom of the card. Appends a new set row. Keep it compact - a small pill button, not a big CTA.
   - Each exercise starts with 3 sets by default

4. Build `SetRow` component (`src/components/workout/SetRow.tsx`):
   - Set label (S1, S2, S3...)
   - Weight input (number, prefilled from last session)
   - Reps input (number)
   - **Rep quick-select chips**: 3 small pill buttons (5, 8, 12) next to or below the reps input. Tapping one fills the reps field. If the reps field already has that value, tapping again clears it. Chips should be subtle/muted until tapped.
   - **Remove set button** (`-` or `x`): appears on each set row, but only when there are more than 1 set. One-tap remove with no confirmation. Keep it small and unobtrusive (e.g., a small `x` at the far right of the row).

5. Build the workout summary page/modal:
   - Shows all exercises with logged sets (same as current summary screen)
   - "Start New Workout" button returns to homepage (not workout selection)
   - Saves the workout to storage (localStorage for now)

6. Wire up the full flow: Homepage -> Workout Select -> Active Workout -> Summary -> Homepage

### Done when
- Full workout flow works end to end
- Rep chips fill the reps field on tap
- Can add sets to any exercise (no upper limit, but be reasonable)
- Can remove sets down to a minimum of 1
- Weight is prefilled from last session
- Workout saves to localStorage and appears on homepage (last workout, stats, streak)

---

## Phase 3: Supabase Integration (Auth + Database)

### Goal
Replace localStorage with Supabase for persistence. Add user authentication so multiple people can use the app with their own data.

### Prerequisites
- A Supabase project created at supabase.com
- Project URL and anon key added to `.env.local`

### Tasks
1. Install Supabase client (`@supabase/supabase-js`) and set up the client in `src/lib/supabase.ts`.

2. Create the database schema in Supabase (provide SQL migration):
   ```sql
   create table workouts (
     id uuid primary key default gen_random_uuid(),
     user_id uuid references auth.users not null,
     date timestamptz not null default now(),
     areas text[] not null,
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
   ```

3. Set up Row Level Security (RLS) policies so users can only read/write their own data:
   - `workouts`: SELECT, INSERT, UPDATE, DELETE where `user_id = auth.uid()`
   - `workout_exercises` and `exercise_sets`: access through their parent workout's user_id

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
   - `getHistory()` -> `SELECT from workouts + exercises + sets WHERE user_id = current user, ORDER BY date DESC`
   - `saveWorkout()` -> `INSERT into workouts, workout_exercises, exercise_sets`
   - `getLastWeight()` -> query the most recent set for a given exercise name for this user
   - `clearHistory()` -> `DELETE from workouts WHERE user_id = current user`

8. Add a user menu to the TopBar or BottomNav - shows email/name, sign out option.

9. Optional: one-time localStorage migration. If a user has existing localStorage data and signs up, offer to import their old workouts into the database.

### Done when
- Can create an account and log in
- Workout data persists in Supabase, not localStorage
- Each user sees only their own data
- Signing out and back in preserves all data
- App redirects properly (unauthed -> login, authed -> home)

---

## Phase 4: Progress Tracking + Polish

### Goal
Build the progress/stats features and polish the overall experience. This is where the app starts to feel like a real fitness tool.

### Tasks
1. Build the progress page (`src/app/progress/page.tsx`):
   - **Exercise weight over time chart**: user picks an exercise from a dropdown, sees a line chart of their max weight per session over time. Use a lightweight chart library (e.g., recharts or chart.js).
   - **Volume per muscle group**: bar chart showing total sets per muscle group over the last 4 weeks. Shows which areas are getting attention and which are neglected.
   - **Personal records section**: list of PRs - heaviest weight logged per exercise. Highlight recent PRs.

2. Enhance the homepage stats:
   - Make the streak tracker pull from real Supabase data
   - Add a "weekly volume" mini-chart or progress bar
   - Show personal records that were hit in the last workout

3. Add workout category placeholders on homepage:
   - Show cards for future categories: Cardio, Flexibility, Nutrition
   - Each card is visually distinct but clearly inactive ("Coming Soon" label or muted styling)
   - Only Lifting/Strength is tappable and routes to `/workout`

4. History page improvements:
   - Add filtering by muscle group
   - Add date range filtering (this week, this month, all time)
   - Show total volume (sets x reps x weight) per workout

5. General polish:
   - Loading states and skeletons for async data fetches
   - Error handling for failed Supabase queries (toast notifications)
   - Smooth page transitions / animations
   - PWA setup (manifest.json, service worker) so it can be installed on a phone homescreen
   - Responsive design check - should work well on phone, tablet, and desktop

### Done when
- Progress page shows meaningful charts from real workout data
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
- **Custom exercises**: let users add their own exercises to the database.
- **Workout templates**: save and reuse specific workout configurations.
- **Rest timer**: built-in countdown between sets with configurable duration.
- **Body measurements**: track weight, body fat %, measurements over time.
