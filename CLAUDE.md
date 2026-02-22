# CLAUDE.md

This file provides guidance for AI assistants (Claude and others) working in this repository.

## Project Overview

A React Native gym tracking app built with **Expo** (SDK 52) and **Expo Router**. The app targets iOS and lets users log workouts (exercises, sets, reps, weight) and track progress over time.

- **Framework**: React Native + Expo
- **Routing**: Expo Router (file-based, similar to Next.js)
- **Language**: TypeScript
- **Main branch**: `master`
- **Remote**: `amf1128-code/default`

## Running the App

```bash
# Install dependencies (first time only)
npm install

# Start the Expo development server
npx expo start
```

After starting, scan the QR code with the **Expo Go** app on your iPhone (download from the App Store) to see the app live on your phone.

## Project Structure

```
app/                        # All screens and navigation (Expo Router)
├── _layout.tsx             # Root layout — wraps all screens
├── (tabs)/                 # Tab bar group
│   ├── _layout.tsx         # Defines the 3 tabs: Home, Workout, Progress
│   ├── index.tsx           # Home screen — dashboard & quick stats
│   ├── workout.tsx         # Log Workout screen — add exercises & sets
│   └── progress.tsx        # Progress screen — history & stats
└── modal.tsx               # Example modal (can be repurposed later)

components/                 # Reusable UI building blocks
├── themed-text.tsx         # Text that adapts to light/dark mode
├── themed-view.tsx         # View container that adapts to light/dark mode
├── haptic-tab.tsx          # Tab bar button with haptic feedback
├── parallax-scroll-view.tsx
├── hello-wave.tsx
└── ui/
    └── icon-symbol.tsx     # SF Symbol icons (iOS native icons)

constants/
└── theme.ts                # Color definitions for light and dark themes

hooks/
├── use-color-scheme.ts     # Detect light/dark mode
└── use-theme-color.ts      # Resolve colors for current theme

assets/
└── images/                 # App icons, splash screens, etc.
```

## Screen Guide

### Home (`app/(tabs)/index.tsx`)
Dashboard shown on app open. Currently displays:
- Time-of-day greeting and today's date
- "Start Workout" button (navigates to Workout tab)
- Quick stats cards (workouts this week, total sets)
- Recent workout history list

All stats and history are placeholders — they'll be populated once data persistence is added.

### Workout (`app/(tabs)/workout.tsx`)
The primary logging screen. Allows users to:
- Name their workout session
- Add multiple exercises
- Log sets per exercise (reps + weight in lbs)
- Add more sets with the "+ Add Set" button

The "Save Workout" button currently has no action — the next step is wiring it to persistent storage.

### Progress (`app/(tabs)/progress.tsx`)
Overview of the user's history. Will show:
- Summary stats (total workouts, sets, heaviest lift, streak)
- Volume-over-time chart
- Scrollable workout history list

Currently all placeholders until data persistence is implemented.

## Key Conventions

### Styling
- All styling uses React Native's `StyleSheet.create()` — defined at the bottom of each file
- No external CSS or styling libraries — keep it plain RN styles
- Primary accent color: `#E63946` (red) — used for buttons and interactive elements
- Use `ThemedText` and `ThemedView` (from `@/components/`) instead of bare `Text`/`View` to get automatic light/dark mode support

### File naming
- All files use **kebab-case** (e.g., `themed-text.tsx`, `use-color-scheme.ts`)
- Screens live in `app/(tabs)/`; shared UI lives in `components/`

### TypeScript
- Always define types for props and state shapes
- Use `type` (not `interface`) for local data shapes
- Keep types co-located with the component that uses them (no separate types file yet)

### State Management
- Currently using React's built-in `useState` — no external state library
- When data persistence is needed, the plan is to use `AsyncStorage` (local) or a lightweight DB like SQLite via `expo-sqlite`

## Next Steps (Planned Features)

- [ ] **Persist workouts** — save logged workouts to device storage with `expo-sqlite`
- [ ] **Populate Home stats** — count sessions, sets from saved data
- [ ] **Progress charts** — render a volume-over-time line chart (e.g., `victory-native`)
- [ ] **Workout history list** — scrollable list of past sessions with tap-to-expand
- [ ] **Exercise autocomplete** — suggest common exercise names while typing
- [ ] **Rest timer** — countdown between sets

## AI Assistant Instructions

### When adding new screens
1. Create the file in `app/(tabs)/` for a new tab, or `app/` for a full-screen pushed route
2. Register new tabs in `app/(tabs)/_layout.tsx`
3. Use `ThemedText` and `ThemedView` — never raw `Text` or `View`
4. Define styles with `StyleSheet.create()` at the bottom of the file

### When adding features
1. Read the relevant screen file first to understand existing state shape
2. Add state with `useState`; keep logic inside the component unless it needs sharing
3. Follow the existing color and spacing patterns
4. Test on iPhone via Expo Go before committing

### What to avoid
- Do not add navigation libraries — Expo Router handles routing
- Do not add a global state library until clearly needed
- Do not inline styles — always use `StyleSheet.create()`
- Do not add comments explaining what code does; only add comments for non-obvious logic

## Git Workflow

```bash
# Feature branch
git checkout -b feature/<short-description>

# Commit (imperative mood)
git commit -m "Add set deletion to workout logger"

# Push
git push -u origin <branch-name>
```

Commit message format: `<verb> <what> [— <why if non-obvious>]`
Examples: `Add progress chart`, `Fix set index off-by-one`, `Save workouts to SQLite`
