"use client";

import QuickStart from "@/components/home/QuickStart";
import LastWorkout from "@/components/home/LastWorkout";
import StreakTracker from "@/components/home/StreakTracker";
import StatsCards from "@/components/home/StatsCards";

export default function Home() {
  return (
    <div className="px-5 pt-10 space-y-5 pb-4">
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
