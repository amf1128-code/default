"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface RestTimerProps {
  defaultDuration: number; // seconds
  active: boolean;
  onDismiss: () => void;
}

const DURATION_OPTIONS = [30, 60, 90, 120, 180];

export default function RestTimer({ defaultDuration, active, onDismiss }: RestTimerProps) {
  const [duration, setDuration] = useState(defaultDuration);
  const [remaining, setRemaining] = useState(defaultDuration);
  const [paused, setPaused] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const resetTimer = useCallback(() => {
    setRemaining(duration);
    setPaused(false);
  }, [duration]);

  useEffect(() => {
    if (active) {
      resetTimer();
    }
  }, [active, resetTimer]);

  useEffect(() => {
    if (!active || paused) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setRemaining((prev) => prev - 1);
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [active, paused]);

  if (!active) return null;

  const isOvertime = remaining < 0;
  const absSeconds = Math.abs(remaining);
  const mins = Math.floor(absSeconds / 60);
  const secs = absSeconds % 60;
  const timeStr = `${mins}:${secs.toString().padStart(2, "0")}`;

  return (
    <div
      className={`rounded-xl p-3 mb-4 border transition-colors ${
        isOvertime
          ? "bg-red-500/10 border-red-500/30"
          : "bg-gold/10 border-gold/30"
      }`}
    >
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setPaused(!paused)}
          className="flex items-center gap-2 flex-1"
        >
          <span
            className={`text-[0.65rem] font-bold uppercase tracking-widest ${
              isOvertime ? "text-red-400" : "text-gold"
            }`}
          >
            {isOvertime ? "Overtime" : paused ? "Paused" : "Rest"}
          </span>
          <span
            className={`text-lg font-extrabold tracking-tight ${
              isOvertime ? "text-red-400" : "text-gold"
            }`}
          >
            {isOvertime ? "-" : ""}{timeStr}
          </span>
          {paused && (
            <span className="text-[0.6rem] text-text-ghost">(tap to resume)</span>
          )}
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowPicker(!showPicker)}
            className="w-7 h-7 rounded-lg bg-white/[0.08] flex items-center justify-center"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#71717a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
            </svg>
          </button>
          <button
            type="button"
            onClick={onDismiss}
            className="text-xs font-bold text-text-ghost hover:text-text-dim px-2 py-1"
          >
            Skip
          </button>
        </div>
      </div>

      {showPicker && (
        <div className="flex gap-1.5 mt-2 pt-2 border-t border-white/[0.08]">
          {DURATION_OPTIONS.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => {
                setDuration(d);
                setRemaining(d);
                setShowPicker(false);
              }}
              className={`flex-1 py-1.5 rounded-md text-xs font-bold transition-colors ${
                duration === d
                  ? "bg-gold/20 text-gold"
                  : "bg-border/30 text-text-ghost"
              }`}
            >
              {d}s
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
