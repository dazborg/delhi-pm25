"use client";

interface SourceSliderProps {
  value: number;
  onChange: (value: number) => void;
  label: string;
  color: string;
  baselineContribution: number;
}

export function SourceSlider({
  value,
  onChange,
  label,
  color,
  baselineContribution,
}: SourceSliderProps) {
  const effectiveContribution = baselineContribution * (value / 100);
  const percentage = value / 200; // 0 to 1 for the track fill
  const baselineMark = 100 / 200; // 0.5 = middle of track

  return (
    <div className="w-full">
      <div className="relative mt-1 mb-1">
        {/* Track background */}
        <div className="relative h-2 rounded-full bg-slate-200 overflow-hidden">
          {/* Filled portion */}
          <div
            className="absolute top-0 left-0 h-full rounded-full transition-all duration-75"
            style={{
              width: `${percentage * 100}%`,
              backgroundColor: value <= 100 ? color : undefined,
              background: value > 100
                ? `linear-gradient(90deg, ${color} 0%, ${color} ${(baselineMark / percentage) * 100}%, #EF4444 100%)`
                : undefined,
            }}
          />
          {/* Baseline tick mark at 50% of track */}
          <div
            className="absolute top-0 h-full w-0.5 bg-slate-400/60"
            style={{ left: `${baselineMark * 100}%` }}
          />
        </div>

        {/* Native range input (invisible, overlaid for interaction) */}
        <input
          type="range"
          min={0}
          max={200}
          step={5}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-label={`${label} pollution level`}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          style={{ margin: 0 }}
        />

        {/* Custom thumb indicator */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white shadow-md border-2 pointer-events-none transition-all duration-75"
          style={{
            left: `calc(${percentage * 100}% - 8px)`,
            borderColor: value > 100 ? "#EF4444" : color,
          }}
        />
      </div>

      {/* Labels row */}
      <div className="flex items-center justify-between text-xs text-slate-500 mt-1">
        <span>0%</span>
        <span className="font-medium text-slate-600">
          {effectiveContribution.toFixed(1)} µg/m³
          {value !== 100 && (
            <span className="text-slate-400 ml-1">
              (was {baselineContribution.toFixed(1)})
            </span>
          )}
        </span>
        <span>200%</span>
      </div>
    </div>
  );
}
