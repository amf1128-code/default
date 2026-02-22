"use client";

import { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import { MuscleGroup, SetRecord } from "@/lib/types";
import { getLastWeight } from "@/lib/storage";
import SetRow from "./SetRow";

export interface ExerciseCardRef {
  getData: () => { name: string; area: MuscleGroup; sets: SetRecord[] };
}

interface ExerciseCardProps {
  name: string;
  area: MuscleGroup;
  onSetLogged: () => void;
}

function createEmptySet(prefill: string): SetRecord {
  return { weight: prefill, reps: "" };
}

const ExerciseCard = forwardRef<ExerciseCardRef, ExerciseCardProps>(
  function ExerciseCard({ name, area, onSetLogged }, ref) {
    const [sets, setSets] = useState<SetRecord[]>([]);
    const [lastWeight, setLastWeight] = useState<string | null>(null);

    useEffect(() => {
      const lw = getLastWeight(name);
      setLastWeight(lw);
      const prefill = lw || "";
      setSets([createEmptySet(prefill), createEmptySet(prefill), createEmptySet(prefill)]);
    }, [name]);

    useImperativeHandle(ref, () => ({
      getData: () => ({ name, area, sets }),
    }));

    const hasData = sets.some((s) => (s.weight && s.weight !== "") || (s.reps && s.reps !== ""));

    function updateSet(index: number, field: keyof SetRecord, value: string) {
      setSets((prev) => {
        const next = [...prev];
        next[index] = { ...next[index], [field]: value };
        return next;
      });
    }

    function addSet() {
      const prefill = lastWeight || "";
      setSets((prev) => [...prev, createEmptySet(prefill)]);
    }

    function removeSet(index: number) {
      setSets((prev) => prev.filter((_, i) => i !== index));
    }

    return (
      <div className="rounded-2xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] p-4">
        <div className="flex items-center gap-2 mb-3">
          <div
            className={`w-2 h-2 rounded-full shrink-0 ${
              hasData ? "bg-green" : "bg-border-light"
            }`}
          />
          <h3 className="text-sm font-bold text-text flex-1">{name}</h3>
          {lastWeight && (
            <span className="text-xs font-bold text-text-ghost bg-white/[0.06] border border-white/[0.08] px-2 py-0.5 rounded-md">
              Last: {lastWeight} lbs
            </span>
          )}
        </div>

        <div>
          {sets.map((set, i) => (
            <SetRow
              key={i}
              index={i}
              weight={set.weight}
              reps={set.reps}
              canRemove={sets.length > 1}
              onWeightChange={(val) => updateSet(i, "weight", val)}
              onRepsChange={(val) => updateSet(i, "reps", val)}
              onRemove={() => removeSet(i)}
              onSetLogged={onSetLogged}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={addSet}
          className="mt-3 text-xs font-bold text-text-ghost hover:text-text-dim transition-colors py-1"
        >
          + Add Set
        </button>
      </div>
    );
  }
);

export default ExerciseCard;
