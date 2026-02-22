import { WorkoutRecord } from "./types";

const STORAGE_KEY = "gym_workout_history";

export function getHistory(): WorkoutRecord[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveWorkout(record: WorkoutRecord): void {
  const history = getHistory();
  history.unshift(record);
  if (history.length > 50) history.length = 50;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

export function clearHistory(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function getLastWeight(exerciseName: string): string | null {
  const history = getHistory();
  for (const workout of history) {
    if (!workout.exercises) continue;
    for (const ex of workout.exercises) {
      if (ex.name === exerciseName) {
        for (const set of ex.sets) {
          if (set.weight && set.weight !== "-" && Number(set.weight) > 0) {
            return set.weight;
          }
        }
      }
    }
  }
  return null;
}
