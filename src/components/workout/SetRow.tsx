"use client";

interface SetRowProps {
  index: number;
  weight: string;
  reps: string;
  canRemove: boolean;
  onWeightChange: (value: string) => void;
  onRepsChange: (value: string) => void;
  onRemove: () => void;
  onSetLogged: () => void;
}

const REP_CHIPS = [5, 8, 12];

export default function SetRow({
  index,
  weight,
  reps,
  canRemove,
  onWeightChange,
  onRepsChange,
  onRemove,
  onSetLogged,
}: SetRowProps) {
  function handleWeightChange(val: string) {
    onWeightChange(val);
    if (val && reps) onSetLogged();
  }

  function handleRepsChange(val: string) {
    onRepsChange(val);
    if (weight && val) onSetLogged();
  }

  function handleChipTap(val: number) {
    const strVal = String(val);
    if (reps === strVal) {
      onRepsChange("");
    } else {
      onRepsChange(strVal);
      if (weight) onSetLogged();
    }
  }

  return (
    <div className="flex items-center gap-2 py-1.5">
      <span className="text-[0.65rem] font-bold text-text-ghost w-6 shrink-0">
        S{index + 1}
      </span>

      <input
        type="number"
        inputMode="decimal"
        placeholder="lbs"
        value={weight}
        onChange={(e) => handleWeightChange(e.target.value)}
        className="w-16 bg-white/[0.06] border border-white/[0.1] rounded-lg px-2.5 py-1.5 text-sm text-text font-semibold text-center outline-none focus:border-gold transition-colors"
      />

      <input
        type="number"
        inputMode="numeric"
        placeholder="reps"
        value={reps}
        onChange={(e) => handleRepsChange(e.target.value)}
        className="w-14 bg-white/[0.06] border border-white/[0.1] rounded-lg px-2 py-1.5 text-sm text-text font-semibold text-center outline-none focus:border-gold transition-colors"
      />

      <div className="flex gap-1">
        {REP_CHIPS.map((val) => (
          <button
            key={val}
            type="button"
            onClick={() => handleChipTap(val)}
            className={`px-2 py-1 rounded-md text-[0.65rem] font-bold transition-colors ${
              reps === String(val)
                ? "bg-gold/20 text-gold border border-gold/40"
                : "bg-border/30 text-text-ghost border border-transparent hover:text-text-faint"
            }`}
          >
            {val}
          </button>
        ))}
      </div>

      {canRemove ? (
        <button
          type="button"
          onClick={onRemove}
          className="text-text-ghost hover:text-text-dim text-sm ml-auto shrink-0 w-5 h-5 flex items-center justify-center"
        >
          &times;
        </button>
      ) : (
        <div className="w-5 shrink-0 ml-auto" />
      )}
    </div>
  );
}
