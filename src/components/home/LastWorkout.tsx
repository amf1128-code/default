"use client";

import { useState, useEffect } from "react";
import { getHistory } from "@/lib/storage";
import { WorkoutRecord } from "@/lib/types";

export default function LastWorkout() {
  const [last, setLast] = useState<WorkoutRecord | null>(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const history = getHistory();
    if (history.length > 0) setLast(history[0]);
  }, []);

  if (!last) {
    return (
      <div className="rounded-2xl bg-surface border border-border p-5">
        <h3 className="text-xs font-bold uppercase tracking-widest text-text-ghost mb-2">Last Workout</h3>
        <p className="text-sm text-text-dim">No workouts yet — let&apos;s fix that!</p>
      </div>
    );
  }

  const d = new Date(last.date);
  const dateStr = d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  const exCount = last.exercises?.length ?? 0;

  return (
    <div
      className="rounded-2xl bg-surface border border-border p-5 cursor-pointer transition-colors active:bg-border/30"
      onClick={() => setExpanded(!expanded)}
    >
      <h3 className="text-xs font-bold uppercase tracking-widest text-text-ghost mb-3">Last Workout</h3>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-base font-bold text-gold">{last.areas.join(" + ")}</p>
          <p className="text-xs text-text-faint mt-1">{dateStr} &middot; {exCount} exercises</p>
        </div>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#52525b"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-transform ${expanded ? "rotate-180" : ""}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>

      {expanded && last.exercises && (
        <div className="mt-4 pt-4 border-t border-border space-y-2">
          {last.exercises.map((ex, i) => (
            <div key={i} className="rounded-xl bg-bg border border-border-light p-3">
              <p className="text-xs font-bold text-gold mb-1">{ex.name}</p>
              {ex.sets.map((set, si) => (
                <p key={si} className="text-xs text-text-faint">
                  Set {si + 1}: <span className="text-text-muted font-semibold">{set.weight} lbs x {set.reps}</span>
                </p>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
