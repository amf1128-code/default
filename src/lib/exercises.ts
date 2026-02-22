import { MuscleGroup } from "./types";

export interface AreaMeta {
  icon: string;
  label: string;
}

export const AREA_META: Record<MuscleGroup, AreaMeta> = {
  chest:     { icon: "chest",     label: "Chest" },
  back:      { icon: "back",      label: "Back" },
  legs:      { icon: "legs",      label: "Legs" },
  arms:      { icon: "arms",      label: "Arms" },
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
  arms: [
    ["Barbell Curls", "Tricep Dips", "Hammer Curls", "Overhead Tricep Extension"],
    ["Dumbbell Curls", "Close Grip Bench Press", "Preacher Curls", "Tricep Pushdowns"],
    ["EZ Bar Curls", "Skull Crushers", "Concentration Curls", "Cable Tricep Kickbacks"],
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
