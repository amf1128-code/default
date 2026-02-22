"use client";

import { useState, useEffect } from "react";
import { getHistory } from "@/lib/storage";

interface Stat {
  label: string;
  value: string;
}

export default function StatsCards() {
  const [stats, setStats] = useState<Stat[]>([]);

  useEffect(() => {
    const history = getHistory();

    // Workouts this month
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisMonth = history.filter((w) => new Date(w.date) >= monthStart).length;

    // Total sets this week
    const day = now.getDay();
    const monday = new Date(now);
    monday.setDate(now.getDate() - ((day + 6) % 7));
    monday.setHours(0, 0, 0, 0);
    const weekWorkouts = history.filter((w) => new Date(w.date) >= monday);
    const totalSets = weekWorkouts.reduce(
      (sum, w) => sum + w.exercises.reduce((s, ex) => s + ex.sets.length, 0),
      0
    );

    // Most trained muscle group
    const areaCounts: Record<string, number> = {};
    history.forEach((w) => {
      w.areas.forEach((a) => {
        areaCounts[a] = (areaCounts[a] || 0) + 1;
      });
    });
    const topArea = Object.entries(areaCounts).sort((a, b) => b[1] - a[1])[0];

    setStats([
      { label: "This Month", value: String(thisMonth) },
      { label: "Sets This Week", value: String(totalSets) },
      { label: "Most Trained", value: topArea ? topArea[0] : "—" },
    ]);
  }, []);

  if (stats.length === 0) return null;

  return (
    <div className="grid grid-cols-3 gap-2.5">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-xl bg-surface border border-border p-3.5 text-center"
        >
          <p className="text-lg font-extrabold text-text tracking-tight">{stat.value}</p>
          <p className="text-[0.6rem] font-bold uppercase tracking-widest text-text-ghost mt-1">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
