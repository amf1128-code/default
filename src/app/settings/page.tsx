"use client";

import { useState, useEffect } from "react";
import { getSettings, saveSettings, getTemplates, saveTemplate, deleteTemplate } from "@/lib/settings";
import { MUSCLE_GROUPS, AREA_META, getAllExercises } from "@/lib/exercises";
import { MuscleGroup, WorkoutTemplate } from "@/lib/types";

const TIMER_OPTIONS = [30, 60, 90, 120, 180];

export default function SettingsPage() {
  const [restTimer, setRestTimer] = useState(90);
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Template form state
  const [templateName, setTemplateName] = useState("");
  const [selectedAreas, setSelectedAreas] = useState<Set<MuscleGroup>>(new Set());
  const [selectedExercises, setSelectedExercises] = useState<{ area: MuscleGroup; name: string }[]>([]);

  useEffect(() => {
    const settings = getSettings();
    setRestTimer(settings.defaultRestTimer);
    setTemplates(getTemplates());
  }, []);

  function handleTimerChange(value: number) {
    setRestTimer(value);
    saveSettings({ defaultRestTimer: value });
  }

  function toggleArea(area: MuscleGroup) {
    setSelectedAreas((prev) => {
      const next = new Set(prev);
      if (next.has(area)) {
        next.delete(area);
        setSelectedExercises((exs) => exs.filter((e) => e.area !== area));
      } else {
        next.add(area);
      }
      return next;
    });
  }

  function toggleExercise(area: MuscleGroup, name: string) {
    setSelectedExercises((prev) => {
      const exists = prev.some((e) => e.area === area && e.name === name);
      if (exists) {
        return prev.filter((e) => !(e.area === area && e.name === name));
      }
      return [...prev, { area, name }];
    });
  }

  function resetForm() {
    setTemplateName("");
    setSelectedAreas(new Set());
    setSelectedExercises([]);
    setEditingId(null);
    setShowForm(false);
  }

  function handleSave() {
    if (!templateName.trim() || selectedExercises.length === 0) return;

    const template: WorkoutTemplate = {
      id: editingId || crypto.randomUUID(),
      name: templateName.trim(),
      exercises: selectedExercises,
    };

    saveTemplate(template);
    setTemplates(getTemplates());
    resetForm();
  }

  function handleEdit(template: WorkoutTemplate) {
    setEditingId(template.id);
    setTemplateName(template.name);
    const areas = new Set(template.exercises.map((e) => e.area));
    setSelectedAreas(areas);
    setSelectedExercises([...template.exercises]);
    setShowForm(true);
  }

  function handleDelete(id: string) {
    deleteTemplate(id);
    setTemplates(getTemplates());
  }

  return (
    <div className="px-5 pt-10 pb-8">
      <h1 className="text-2xl font-extrabold tracking-tight text-white mb-6">
        Settings
      </h1>

      {/* Rest Timer Setting */}
      <div className="rounded-2xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] p-5 mb-4">
        <h2 className="text-xs font-bold uppercase tracking-widest text-text-ghost mb-3">
          Default Rest Timer
        </h2>
        <div className="flex gap-2">
          {TIMER_OPTIONS.map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => handleTimerChange(val)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                restTimer === val
                  ? "bg-gold/15 text-gold border border-gold/40"
                  : "bg-border/30 text-text-ghost border border-transparent hover:text-text-faint"
              }`}
            >
              {val}s
            </button>
          ))}
        </div>
      </div>

      {/* Workout Templates */}
      <div className="rounded-2xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-text-ghost">
            Workout Templates
          </h2>
          {!showForm && (
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="text-xs font-bold text-gold"
            >
              + Create
            </button>
          )}
        </div>

        {/* Template list */}
        {!showForm && templates.length === 0 && (
          <p className="text-sm text-text-dim">No templates yet. Create one to get started.</p>
        )}

        {!showForm &&
          templates.map((t) => (
            <div
              key={t.id}
              className="flex items-center justify-between py-3 border-b border-white/[0.08] last:border-0"
            >
              <button
                type="button"
                onClick={() => handleEdit(t)}
                className="text-left flex-1"
              >
                <p className="text-sm font-bold text-text">{t.name}</p>
                <p className="text-xs text-text-ghost mt-0.5">
                  {t.exercises.length} exercises
                </p>
              </button>
              <button
                type="button"
                onClick={() => handleDelete(t.id)}
                className="text-text-ghost hover:text-red-400 text-sm px-2 py-1 transition-colors"
              >
                &times;
              </button>
            </div>
          ))}

        {/* Template form */}
        {showForm && (
          <div className="space-y-5">
            <input
              type="text"
              placeholder="Template name (e.g., Push Day)"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              className="w-full bg-white/[0.06] border border-white/[0.1] rounded-xl px-3 py-2.5 text-sm text-text outline-none focus:border-gold transition-colors"
            />

            {/* Area selection */}
            <div>
              <p className="text-xs font-bold text-text-ghost mb-2">Muscle Groups</p>
              <div className="flex flex-wrap gap-1.5">
                {MUSCLE_GROUPS.map((area) => (
                  <button
                    key={area}
                    type="button"
                    onClick={() => toggleArea(area)}
                    className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors ${
                      selectedAreas.has(area)
                        ? "bg-gold/15 text-gold border border-gold/40"
                        : "bg-border/30 text-text-ghost border border-transparent"
                    }`}
                  >
                    {AREA_META[area].label}
                  </button>
                ))}
              </div>
            </div>

            {/* Exercise selection per area */}
            {[...selectedAreas].map((area) => (
              <div key={area}>
                <p className="text-xs font-bold text-text-muted mb-2">
                  {AREA_META[area].label}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {getAllExercises(area).map((name) => {
                    const isSelected = selectedExercises.some(
                      (e) => e.area === area && e.name === name
                    );
                    return (
                      <button
                        key={name}
                        type="button"
                        onClick={() => toggleExercise(area, name)}
                        className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                          isSelected
                            ? "bg-gold/15 text-gold border border-gold/40"
                            : "bg-border/30 text-text-ghost border border-transparent"
                        }`}
                      >
                        {name}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Form actions */}
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-text-ghost bg-white/[0.06] border border-white/[0.1]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={!templateName.trim() || selectedExercises.length === 0}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-bg bg-gold disabled:opacity-40"
              >
                {editingId ? "Update" : "Save"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
