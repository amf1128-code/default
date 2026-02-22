"use client";

import QuickStart from "@/components/home/QuickStart";
import LastWorkout from "@/components/home/LastWorkout";
import StreakTracker from "@/components/home/StreakTracker";
import StatsCards from "@/components/home/StatsCards";

export default function Home() {
  return (
    <div className="px-4 pt-6 space-y-4">
      <div className="mb-2">
        <h1 className="text-2xl font-extrabold tracking-tight text-white">Workout</h1>
        <p className="text-sm text-text-dim mt-0.5">Track your progress, get stronger.</p>
      </div>

      <QuickStart />
      <LastWorkout />
      <StreakTracker />
      <StatsCards />
    </div>
  );
}
