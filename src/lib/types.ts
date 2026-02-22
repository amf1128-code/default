export type MuscleGroup = "chest" | "back" | "legs" | "arms" | "shoulders" | "abs";

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
}
