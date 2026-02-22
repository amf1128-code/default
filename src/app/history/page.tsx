"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getHistory } from "@/lib/storage";
import { WorkoutRecord } from "@/lib/types";

export default function HistoryPage() {
  const [history, setHistory] = useState<WorkoutRecord[]>([]);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  return (
    <div className="px-4 pt-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-white">History</h1>
        <Link href="/" className="text-xs font-semibold text-text-muted px-3 py-1.5 rounded-xl bg-border/30 border border-border-light">
          Back
        </Link>
      </div>

      {history.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-sm text-text-ghost">No workouts logged yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {history.map((entry, i) => {
            const d = new Date(entry.date);
            const dateStr = d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
            const timeStr = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
            const exCount = entry.exercises?.length ?? 0;
            const isExpanded = expandedIndex === i;

            return (
              <div
                key={i}
                className="rounded-2xl bg-surface border border-border p-4 cursor-pointer transition-colors active:bg-border/20"
                onClick={() => setExpandedIndex(isExpanded ? null : i)}
              >
                <p className="text-[0.65rem] font-medium uppercase tracking-widest text-text-faint">
                  {dateStr} &middot; {timeStr}
                </p>
                <p className="text-sm font-bold text-gold mt-1">{entry.areas.join(" + ")}</p>
                <p className="text-xs text-text-ghost mt-0.5">{exCount} exercises</p>

                {isExpanded && entry.exercises && (
                  <div className="mt-3 pt-3 border-t border-border space-y-2">
                    {entry.exercises.map((ex, ei) => (
                      <div key={ei} className="rounded-xl bg-bg border border-border-light p-3">
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
          })}
        </div>
      )}
    </div>
  );
}
