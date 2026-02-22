"use client";

import Link from "next/link";
import { MUSCLE_GROUPS, AREA_META } from "@/lib/exercises";

export default function WorkoutSelect() {
  return (
    <div className="px-4 pt-6">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-white">What are we hitting?</h1>
        <p className="text-sm text-text-dim mt-1">Select one or more muscle groups</p>
      </div>

      <div className="grid grid-cols-2 gap-2.5 mb-6">
        {MUSCLE_GROUPS.map((area) => (
          <div
            key={area}
            className="flex flex-col items-center justify-center gap-2 p-6 rounded-2xl bg-surface border border-border text-text-muted text-sm font-bold uppercase tracking-wide cursor-pointer transition-all active:scale-[0.97] hover:border-border-light"
          >
            {AREA_META[area].label}
          </div>
        ))}
      </div>

      <p className="text-center text-xs text-text-ghost font-medium">
        Full workout flow coming in Phase 2
      </p>

      <Link
        href="/"
        className="block text-center text-sm text-gold font-semibold mt-6"
      >
        &larr; Back to Home
      </Link>
    </div>
  );
}
