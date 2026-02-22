import { MuscleGroup } from "./types";

export interface AreaMeta {
  icon: string;
  label: string;
}

export const AREA_META: Record<MuscleGroup, AreaMeta> = {
  chest:     { icon: "chest",     label: "Chest" },
  back:      { icon: "back",      label: "Back" },
  legs:      { icon: "legs",      label: "Legs" },
  biceps:    { icon: "biceps",    label: "Biceps" },
  triceps:   { icon: "triceps",   label: "Triceps" },
  shoulders: { icon: "shoulders", label: "Shoulders" },
  abs:       { icon: "abs",       label: "Abs" },
};

export const WORKOUTS: Record<MuscleGroup, string[][]> = {
  chest: [
    ["Flat Barbell Bench Press", "Incline Dumbbell Press", "Cable Flyes", "Push-Ups"],
    ["Incline Barbell Bench Press", "Flat Dumbbell Press", "Pec Deck Machine", "Dips"],
    ["Dumbbell Bench Press", "Incline Smith Machine Press", "Low Cable Crossover", "Decline Push-Ups"],
  ],
  back: [
    ["Barbell Rows", "Lat Pulldowns", "Seated Cable Rows", "Face Pulls"],
    ["Pull-Ups", "Dumbbell Rows", "T-Bar Row", "Straight Arm Pulldowns"],
    ["Deadlifts", "Wide Grip Lat Pulldown", "Cable Rows", "Reverse Flyes"],
  ],
  legs: [
    ["Barbell Squats", "Romanian Deadlifts", "Leg Press", "Calf Raises"],
    ["Front Squats", "Leg Curls", "Walking Lunges", "Leg Extensions"],
    ["Goblet Squats", "Hip Thrusts", "Bulgarian Split Squats", "Seated Calf Raises"],
  ],
  biceps: [
    ["Barbell Curls", "Hammer Curls", "Preacher Curls", "Concentration Curls"],
    ["Dumbbell Curls", "EZ Bar Curls", "Cable Curls", "Incline Dumbbell Curls"],
    ["Spider Curls", "Reverse Curls", "Zottman Curls", "Chin-Ups"],
  ],
  triceps: [
    ["Tricep Dips", "Skull Crushers", "Tricep Pushdowns", "Overhead Tricep Extension"],
    ["Close Grip Bench Press", "Cable Tricep Kickbacks", "Diamond Push-Ups", "Rope Pushdowns"],
    ["JM Press", "Tate Press", "Single Arm Pushdowns", "Bench Dips"],
  ],
  shoulders: [
    ["Overhead Press", "Lateral Raises", "Front Raises", "Reverse Pec Deck"],
    ["Dumbbell Shoulder Press", "Cable Lateral Raises", "Arnold Press", "Face Pulls"],
    ["Military Press", "Upright Rows", "Dumbbell Lateral Raises", "Rear Delt Flyes"],
  ],
  abs: [
    ["Hanging Leg Raises", "Cable Crunches", "Ab Wheel Rollouts", "Plank Hold"],
    ["Bicycle Crunches", "Dragon Flags", "Decline Sit-Ups", "Dead Bugs"],
    ["Weighted Sit-Ups", "Pallof Press", "Toe Touches", "Mountain Climbers"],
  ],
};

export const MUSCLE_GROUPS: MuscleGroup[] = Object.keys(AREA_META) as MuscleGroup[];

/** Get all unique exercise names for a muscle group */
export function getAllExercises(area: MuscleGroup): string[] {
  const sets = WORKOUTS[area];
  const seen = new Set<string>();
  for (const arr of sets) {
    for (const name of arr) {
      seen.add(name);
    }
  }
  return Array.from(seen);
}

/** Generate random exercises for a muscle group */
export function getRandomExercises(area: MuscleGroup, count: number): string[] {
  const all = getAllExercises(area);
  const shuffled = [...all].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, all.length));
}
