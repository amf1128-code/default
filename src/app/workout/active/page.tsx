"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { MuscleGroup, ExerciseRecord, SetRecord } from "@/lib/types";
import { AREA_META } from "@/lib/exercises";
import { getSettings } from "@/lib/settings";
import ExerciseCard, { ExerciseCardRef } from "@/components/workout/ExerciseCard";
import RestTimer from "@/components/workout/RestTimer";

interface ActiveWorkoutData {
  areas: MuscleGroup[];
  exercises: ExerciseRecord[];
  startTime: number;
}

export default function ActiveWorkout() {
  const router = useRouter();
  const [workout, setWorkout] = useState<ActiveWorkoutData | null>(null);
  const [timerActive, setTimerActive] = useState(false);
  const [timerDismissed, setTimerDismissed] = useState(false);
  const [defaultTimer, setDefaultTimer] = useState(90);
  const [restTimerKey, setRestTimerKey] = useState(0);
  const [hasEnteredData, setHasEnteredData] = useState(false);
  const cardRefs = useRef<(ExerciseCardRef | null)[]>([]);
  // Track rest periods for summary
  const restPeriodsRef = useRef<{ start: number; duration: number; overtime: number }[]>([]);
  const timerStartRef = useRef<number>(0);

  useEffect(() => {
    const raw = sessionStorage.getItem("active_workout");
    if (!raw) {
      router.replace("/workout");
      return;
    }
    setWorkout(JSON.parse(raw));
    setDefaultTimer(getSettings().defaultRestTimer);
  }, [router]);

  const handleSetLogged = useCallback(() => {
    setHasEnteredData(true);
    // Track rest period end for the previous timer if it was active
    if (timerActive && timerStartRef.current > 0) {
      const elapsed = Math.round((Date.now() - timerStartRef.current) / 1000);
      const overtime = Math.max(0, elapsed - defaultTimer);
      restPeriodsRef.current.push({
        start: timerStartRef.current,
        duration: Math.min(elapsed, defaultTimer),
        overtime,
      });
    }
    // Start a new rest timer
    setTimerDismissed(false);
    setTimerActive(true);
    setRestTimerKey((k) => k + 1);
    timerStartRef.current = Date.now();
  }, [timerActive, defaultTimer]);

  function handleDismissTimer() {
    // Track the rest period being dismissed
    if (timerStartRef.current > 0) {
      const elapsed = Math.round((Date.now() - timerStartRef.current) / 1000);
      const overtime = Math.max(0, elapsed - defaultTimer);
      restPeriodsRef.current.push({
        start: timerStartRef.current,
        duration: Math.min(elapsed, defaultTimer),
        overtime,
      });
    }
    setTimerDismissed(true);
    setTimerActive(false);
    timerStartRef.current = 0;
  }

  function handleBack() {
    if (hasEnteredData) {
      if (!confirm("You have unsaved workout data. Are you sure you want to leave?")) {
        return;
      }
    }
    sessionStorage.removeItem("active_workout");
    router.push("/workout");
  }

  function handleFinish() {
    if (!workout) return;

    // Collect all exercise data from card refs
    const exercises: ExerciseRecord[] = [];
    for (const ref of cardRefs.current) {
      if (ref) {
        const data = ref.getData();
        // Only include exercises that have at least one logged set
        const loggedSets = data.sets.filter(
          (s: SetRecord) => (s.weight && s.weight !== "") || (s.reps && s.reps !== "")
        );
        if (loggedSets.length > 0) {
          exercises.push({ ...data, sets: loggedSets });
        }
      }
    }

    const now = Date.now();
    const duration = Math.round((now - workout.startTime) / 1000);

    // Calculate total rest time and overtime
    const totalRestTime = restPeriodsRef.current.reduce((sum, p) => sum + p.duration, 0);
    const totalOvertime = restPeriodsRef.current.reduce((sum, p) => sum + p.overtime, 0);

    const summaryPayload = {
      areas: workout.areas,
      exercises,
      duration,
      totalRestTime,
      totalOvertime,
      startTime: workout.startTime,
    };

    sessionStorage.setItem("workout_summary", JSON.stringify(summaryPayload));
    sessionStorage.removeItem("active_workout");
    router.push("/workout/summary");
  }

  if (!workout) {
    return (
      <div className="px-4 pt-6">
        <p className="text-sm text-text-dim">Loading workout...</p>
      </div>
    );
  }

  const title = workout.areas.map((a) => AREA_META[a]?.label || a).join(" + ") + " Day";

  return (
    <div className="px-4 pt-6 pb-6">
      {/* Hero bar */}
      <div className="flex items-center justify-between mb-5">
        <button
          type="button"
          onClick={handleBack}
          className="text-xs font-semibold text-text-muted px-3 py-1.5 rounded-xl bg-border/30 border border-border-light"
        >
          &larr; Back
        </button>
        <h1 className="text-lg font-extrabold tracking-tight text-white">{title}</h1>
        <button
          type="button"
          onClick={handleFinish}
          className="text-xs font-bold text-bg px-3 py-1.5 rounded-xl bg-gold"
        >
          Finish
        </button>
      </div>

      {/* Rest timer */}
      {!timerDismissed && (
        <RestTimer
          key={restTimerKey}
          defaultDuration={defaultTimer}
          active={timerActive}
          onDismiss={handleDismissTimer}
        />
      )}

      {/* Exercise cards */}
      <div className="space-y-3">
        {workout.exercises.map((ex, i) => (
          <ExerciseCard
            key={`${ex.name}-${i}`}
            ref={(el) => { cardRefs.current[i] = el; }}
            name={ex.name}
            area={ex.area}
            onSetLogged={handleSetLogged}
          />
        ))}
      </div>

      {/* Bottom finish button */}
      <button
        type="button"
        onClick={handleFinish}
        className="w-full mt-6 rounded-2xl bg-gradient-to-br from-gold to-gold-dark p-4 transition-transform active:scale-[0.98]"
      >
        <p className="text-base font-extrabold text-bg tracking-tight">
          Finish Workout
        </p>
      </button>
    </div>
  );
}
