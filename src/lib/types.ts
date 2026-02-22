export type MuscleGroup = "chest" | "back" | "legs" | "biceps" | "triceps" | "shoulders" | "abs";

export interface SetRecord {
  weight: string;
  reps: string;
}

export interface ExerciseRecord {
  name: string;
  area: MuscleGroup;
  sets: SetRecord[];
}

export interface WorkoutRecord {
  date: string;
  areas: string[];
  exercises: ExerciseRecord[];
  duration?: number;
  totalRestTime?: number;
  totalOvertime?: number;
}

export interface UserSettings {
  defaultRestTimer: number;
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  exercises: { area: MuscleGroup; name: string }[];
}
