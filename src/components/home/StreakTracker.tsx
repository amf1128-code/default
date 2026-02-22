"use client";

import { useState, useEffect } from "react";
import { getHistory } from "@/lib/storage";

function getWeekDays(): { label: string; date: string }[] {
  const now = new Date();
  const day = now.getDay();
  // Start on Monday
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((day + 6) % 7));

  const days = [];
  const labels = ["M", "T", "W", "T", "F", "S", "S"];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    days.push({
      label: labels[i],
      date: d.toISOString().split("T")[0],
    });
  }
  return days;
}

export default function StreakTracker() {
  const [activeDays, setActiveDays] = useState<Set<string>>(new Set());
  const [weekCount, setWeekCount] = useState(0);

  useEffect(() => {
    const history = getHistory();
    const workoutDates = new Set(
      history.map((w) => new Date(w.date).toISOString().split("T")[0])
    );
    setActiveDays(workoutDates);

    const week = getWeekDays();
    const count = week.filter((d) => workoutDates.has(d.date)).length;
    setWeekCount(count);
  }, []);

  const week = getWeekDays();
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="rounded-2xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-text-ghost">This Week</h3>
        <span className="text-xs font-bold text-gold">
          {weekCount} workout{weekCount !== 1 ? "s" : ""}
        </span>
      </div>
      <div className="flex justify-between">
        {week.map((day) => {
          const isActive = activeDays.has(day.date);
          const isToday = day.date === today;
          return (
            <div key={day.date} className="flex flex-col items-center gap-2">
              <span className="text-[0.65rem] font-semibold text-text-ghost uppercase">{day.label}</span>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  isActive
                    ? "bg-gold/20 border-2 border-gold"
                    : isToday
                    ? "bg-border-light/30 border-2 border-border-light"
                    : "bg-white/[0.06] border border-white/[0.1]"
                }`}
              >
                {isActive && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d4a053" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
