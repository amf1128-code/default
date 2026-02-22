"use client";

import Link from "next/link";

export default function QuickStart() {
  return (
    <Link
      href="/workout"
      className="block w-full rounded-2xl bg-gradient-to-br from-gold to-gold-dark p-5 transition-transform active:scale-[0.98]"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-bg tracking-tight">Start Workout</h2>
          <p className="text-sm font-medium text-bg/60 mt-0.5">Select muscle groups and go</p>
        </div>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0d0d0d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14" />
          <path d="M12 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}
