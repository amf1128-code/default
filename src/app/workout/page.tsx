"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MUSCLE_GROUPS, AREA_META, getRandomExercises } from "@/lib/exercises";
import { MuscleGroup, ExerciseRecord } from "@/lib/types";
import { getHistory } from "@/lib/storage";
import { getTemplates } from "@/lib/settings";
import { WorkoutTemplate } from "@/lib/types";

type WorkoutMode = "random" | "repeat" | "template";

export default function WorkoutSelect() {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<MuscleGroup>>(new Set());
  const [counts, setCounts] = useState<Record<MuscleGroup, number>>(() => {
    const init: Partial<Record<MuscleGroup, number>> = {};
    MUSCLE_GROUPS.forEach((g) => (init[g] = 4));
    return init as Record<MuscleGroup, number>;
  });
  const [mode, setMode] = useState<WorkoutMode>("random");
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [hasHistory, setHasHistory] = useState(false);

  useEffect(() => {
    setTemplates(getTemplates());
    setHasHistory(getHistory().length > 0);
  }, []);

  function toggle(area: MuscleGroup) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(area)) next.delete(area);
      else next.add(area);
      return next;
    });
  }

  function adjustCount(area: MuscleGroup, delta: number) {
    setCounts((prev) => ({
      ...prev,
      [area]: Math.min(6, Math.max(2, prev[area] + delta)),
    }));
  }

  function generateWorkout(): ExerciseRecord[] {
    if (mode === "template" && selectedTemplate) {
      const tmpl = templates.find((t) => t.id === selectedTemplate);
      if (tmpl) {
        return tmpl.exercises.map((ex) => ({
          name: ex.name,
          area: ex.area,
          sets: [],
        }));
      }
    }

    if (mode === "repeat") {
      const history = getHistory();
      const exercises: ExerciseRecord[] = [];
      for (const area of selected) {
        let found = false;
        for (const workout of history) {
          const fromArea = workout.exercises?.filter((e) => e.area === area);
          if (fromArea && fromArea.length > 0) {
            exercises.push(
              ...fromArea.slice(0, counts[area]).map((e) => ({
                name: e.name,
                area: area,
                sets: [],
              }))
            );
            found = true;
            break;
          }
        }
        if (!found) {
          exercises.push(
            ...getRandomExercises(area, counts[area]).map((name) => ({
              name,
              area,
              sets: [],
            }))
          );
        }
      }
      return exercises;
    }

    // Random mode
    const exercises: ExerciseRecord[] = [];
    for (const area of selected) {
      exercises.push(
        ...getRandomExercises(area, counts[area]).map((name) => ({
          name,
          area,
          sets: [],
        }))
      );
    }
    return exercises;
  }

  function startWorkout() {
    const exercises = generateWorkout();
    const areas = mode === "template" && selectedTemplate
      ? [...new Set(exercises.map((e) => e.area))]
      : [...selected];

    const payload = {
      areas,
      exercises,
      startTime: Date.now(),
    };
    sessionStorage.setItem("active_workout", JSON.stringify(payload));
    router.push("/workout/active");
  }

  const canStart =
    mode === "template"
      ? selectedTemplate !== null
      : selected.size > 0;

  const selectedNames =
    mode === "template" && selectedTemplate
      ? templates.find((t) => t.id === selectedTemplate)?.name || ""
      : [...selected].map((a) => AREA_META[a].label).join(" + ");

  return (
    <div className="px-5 pt-10 pb-8">
      <div className="mb-5">
        <h1 className="text-2xl font-extrabold tracking-tight text-white">
          What are we hitting?
        </h1>
        <p className="text-sm text-text-dim mt-1">
          Select one or more muscle groups
        </p>
      </div>

      {/* Workout mode toggle */}
      <div className="flex gap-1.5 mb-5 bg-white/[0.05] backdrop-blur-lg border border-white/[0.1] rounded-xl p-1">
        <ModeButton
          label="Random"
          active={mode === "random"}
          onClick={() => setMode("random")}
        />
        <ModeButton
          label="Repeat Last"
          active={mode === "repeat"}
          onClick={() => setMode("repeat")}
          disabled={!hasHistory}
        />
        {templates.length > 0 && (
          <ModeButton
            label="Template"
            active={mode === "template"}
            onClick={() => setMode("template")}
          />
        )}
      </div>

      {/* Template picker */}
      {mode === "template" && (
        <div className="mb-5 space-y-2">
          {templates.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedTemplate(t.id === selectedTemplate ? null : t.id)}
              className={`w-full text-left rounded-xl p-3 border transition-colors ${
                selectedTemplate === t.id
                  ? "bg-gold/10 border-gold/40 text-gold"
                  : "bg-white/[0.05] backdrop-blur-sm border-white/[0.1] text-text-muted"
              }`}
            >
              <p className="text-sm font-bold">{t.name}</p>
              <p className="text-xs text-text-ghost mt-0.5">
                {t.exercises.length} exercises
              </p>
            </button>
          ))}
        </div>
      )}

      {/* Muscle group grid */}
      {mode !== "template" && (
        <div className="grid grid-cols-2 gap-2.5 mb-6">
          {MUSCLE_GROUPS.map((area) => {
            const isSelected = selected.has(area);
            return (
              <div key={area} className="relative">
                <button
                  type="button"
                  onClick={() => toggle(area)}
                  className={`w-full flex flex-col items-center justify-center gap-1.5 p-5 rounded-2xl border text-sm font-bold uppercase tracking-wide transition-all active:scale-[0.97] ${
                    isSelected
                      ? "bg-gold/10 border-gold/40 text-gold"
                      : "bg-white/[0.05] backdrop-blur-sm border-white/[0.1] text-text-muted"
                  }`}
                >
                  {isSelected && (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#d4a053"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="absolute top-2.5 right-2.5"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                  <AreaIcon area={area} active={isSelected} />
                  {AREA_META[area].label}
                </button>

                {/* Exercise count stepper */}
                {isSelected && (
                  <div className="flex items-center justify-center gap-2 mt-1.5">
                    <button
                      type="button"
                      onClick={() => adjustCount(area, -1)}
                      className="w-6 h-6 rounded-md bg-border/50 text-text-ghost text-xs font-bold flex items-center justify-center hover:bg-border"
                    >
                      -
                    </button>
                    <span className="text-xs font-bold text-text-muted w-12 text-center">
                      {counts[area]} ex
                    </span>
                    <button
                      type="button"
                      onClick={() => adjustCount(area, 1)}
                      className="w-6 h-6 rounded-md bg-border/50 text-text-ghost text-xs font-bold flex items-center justify-center hover:bg-border"
                    >
                      +
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Start button */}
      {canStart && (
        <button
          type="button"
          onClick={startWorkout}
          className="w-full rounded-2xl bg-gradient-to-br from-gold to-gold-dark p-4 transition-transform active:scale-[0.98]"
        >
          <p className="text-base font-extrabold text-bg tracking-tight">
            Start Workout
          </p>
          <p className="text-sm font-medium text-bg/60 mt-0.5">
            {selectedNames}
          </p>
        </button>
      )}
    </div>
  );
}

function ModeButton({
  label,
  active,
  onClick,
  disabled,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex-1 py-2 px-2 rounded-lg text-xs font-bold transition-colors ${
        active
          ? "bg-gold/15 text-gold"
          : disabled
          ? "text-text-ghost/40 cursor-not-allowed"
          : "text-text-ghost hover:text-text-faint"
      }`}
    >
      {label}
    </button>
  );
}

function AreaIcon({ area, active }: { area: MuscleGroup; active: boolean }) {
  const color = active ? "#d4a053" : "#52525b";
  const size = 28;

  switch (area) {
    case "chest":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 8c0-2 2-4 4-4h8c2 0 4 2 4 4v4c0 4-3 8-8 8s-8-4-8-8V8z" />
          <path d="M12 4v16" />
        </svg>
      );
    case "back":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v20" />
          <path d="M8 6c-2 2-3 5-3 8" />
          <path d="M16 6c2 2 3 5 3 8" />
          <path d="M8 10l-2 6" />
          <path d="M16 10l2 6" />
        </svg>
      );
    case "legs":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 2v8l-2 12" />
          <path d="M16 2v8l2 12" />
          <path d="M6 10h4" />
          <path d="M14 10h4" />
        </svg>
      );
    case "biceps":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 18c-1-2-2-5-1-8 1-2 2-4 4-5" />
          <path d="M10 5c2 0 4 1 5 3s1 5 0 7" />
          <path d="M15 15c-1 2-3 3-5 3" />
          <circle cx="11" cy="9" r="2" />
        </svg>
      );
    case "triceps":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 18c1-2 2-5 1-8-1-2-2-4-4-5" />
          <path d="M14 5c-2 0-4 1-5 3s-1 5 0 7" />
          <path d="M9 15c1 2 3 3 5 3" />
          <path d="M11 8l2 4" />
        </svg>
      );
    case "shoulders":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 14c0-4 3-8 8-8s8 4 8 8" />
          <circle cx="12" cy="10" r="3" />
          <path d="M4 14l2 4" />
          <path d="M20 14l-2 4" />
        </svg>
      );
    case "abs":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="7" y="3" width="10" height="18" rx="2" />
          <line x1="7" y1="9" x2="17" y2="9" />
          <line x1="7" y1="15" x2="17" y2="15" />
          <line x1="12" y1="3" x2="12" y2="21" />
        </svg>
      );
  }
}
