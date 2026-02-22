"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ExerciseRecord } from "@/lib/types";
import { saveWorkout } from "@/lib/storage";
import { AREA_META } from "@/lib/exercises";

interface SummaryData {
  areas: string[];
  exercises: ExerciseRecord[];
  duration: number;
  totalRestTime: number;
  totalOvertime: number;
  startTime: number;
}

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

export default function WorkoutSummary() {
  const router = useRouter();
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("workout_summary");
    if (!raw) {
      router.replace("/workout");
      return;
    }
    const data: SummaryData = JSON.parse(raw);
    setSummary(data);

    // Save the workout record
    if (!saved) {
      saveWorkout({
        date: new Date(data.startTime).toISOString(),
        areas: data.areas,
        exercises: data.exercises,
        duration: data.duration,
        totalRestTime: data.totalRestTime,
        totalOvertime: data.totalOvertime,
      });
      setSaved(true);
    }
  }, [router, saved]);

  if (!summary) {
    return (
      <div className="px-4 pt-6">
        <p className="text-sm text-text-dim">Loading summary...</p>
      </div>
    );
  }

  const title = summary.areas
    .map((a) => AREA_META[a as keyof typeof AREA_META]?.label || a)
    .join(" + ");

  const totalSets = summary.exercises.reduce((sum, ex) => sum + ex.sets.length, 0);

  return (
    <div className="px-4 pt-6 pb-6">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green/20 border-2 border-green mb-3">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight text-white">
          Workout Complete
        </h1>
        <p className="text-sm text-text-dim mt-1">{title}</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2.5 mb-6">
        <StatCard label="Duration" value={formatTime(summary.duration)} />
        <StatCard label="Rest Time" value={formatTime(summary.totalRestTime)} />
        <StatCard
          label="Overtime"
          value={formatTime(summary.totalOvertime)}
          highlight={summary.totalOvertime > 0}
        />
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-2.5 mb-6">
        <div className="rounded-xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] p-3.5 text-center">
          <p className="text-lg font-extrabold text-text">{summary.exercises.length}</p>
          <p className="text-[0.6rem] font-bold uppercase tracking-widest text-text-ghost mt-1">
            Exercises
          </p>
        </div>
        <div className="rounded-xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] p-3.5 text-center">
          <p className="text-lg font-extrabold text-text">{totalSets}</p>
          <p className="text-[0.6rem] font-bold uppercase tracking-widest text-text-ghost mt-1">
            Sets
          </p>
        </div>
      </div>

      {/* Exercise breakdown */}
      <div className="space-y-2 mb-6">
        {summary.exercises.map((ex, i) => (
          <div key={i} className="rounded-xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] p-3">
            <p className="text-xs font-bold text-gold mb-1.5">{ex.name}</p>
            {ex.sets.map((set, si) => (
              <p key={si} className="text-xs text-text-faint">
                Set {si + 1}:{" "}
                <span className="text-text-muted font-semibold">
                  {set.weight || "—"} lbs x {set.reps || "—"}
                </span>
              </p>
            ))}
          </div>
        ))}
      </div>

      {/* CTA */}
      <button
        type="button"
        onClick={() => {
          sessionStorage.removeItem("workout_summary");
          router.push("/");
        }}
        className="w-full rounded-2xl bg-gradient-to-br from-gold to-gold-dark p-4 transition-transform active:scale-[0.98]"
      >
        <p className="text-base font-extrabold text-bg tracking-tight">
          Back to Home
        </p>
      </button>
    </div>
  );
}

function StatCard({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] p-3.5 text-center">
      <p className={`text-base font-extrabold tracking-tight ${highlight ? "text-red-400" : "text-text"}`}>
        {value}
      </p>
      <p className="text-[0.6rem] font-bold uppercase tracking-widest text-text-ghost mt-1">
        {label}
      </p>
    </div>
  );
}
