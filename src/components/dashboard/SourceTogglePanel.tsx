"use client";

import { SourceSlider } from "@/components/ui/SourceSlider";
import { POLLUTION_SOURCES, getAnnualSources, getMonthSources } from "@/lib/data/source-apportionment";
import type { SourceId, SourceToggleState } from "@/types/sources";

interface SourceTogglePanelProps {
  activeMonth: "annual" | number;
  toggleState: SourceToggleState;
  onSourceChange: (sourceId: SourceId, level: number) => void;
  onReset: () => void;
}

function DeltaBadge({ value }: { value: number }) {
  if (value === 100) return null;
  const isReduction = value < 100;
  return (
    <span
      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
        isReduction
          ? "bg-emerald-100 text-emerald-700"
          : "bg-red-100 text-red-700"
      }`}
    >
      {isReduction ? `−${100 - value}%` : `+${value - 100}%`}
    </span>
  );
}

export function SourceTogglePanel({
  activeMonth,
  toggleState,
  onSourceChange,
  onReset,
}: SourceTogglePanelProps) {
  const sources = activeMonth === "annual" ? getAnnualSources() : getMonthSources(activeMonth);
  const hasChanges = Object.values(toggleState).some((v) => v !== 100);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">Pollution Sources</h3>
          <p className="text-sm text-slate-500">
            Adjust levels to model scenarios
          </p>
        </div>
        {hasChanges && (
          <button
            onClick={onReset}
            className="text-sm text-white bg-blue-600 hover:bg-blue-700 font-medium px-4 py-2 rounded-lg transition-colors shadow-sm"
          >
            Reset All to 100%
          </button>
        )}
      </div>

      <div className="space-y-4">
        {POLLUTION_SOURCES.map((source) => {
          const apportionment = sources.find((s) => s.sourceId === source.id);
          const level = toggleState[source.id];

          return (
            <div
              key={source.id}
              className="p-3 rounded-xl border border-slate-200 bg-white"
            >
              <div className="flex items-center gap-3 mb-1">
                <span className="text-xl flex-shrink-0" aria-hidden="true">
                  {source.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800">
                    {source.label}
                  </p>
                  <p className="text-xs text-slate-500">
                    {apportionment
                      ? `Baseline: ${apportionment.percentage.toFixed(1)}% · ${apportionment.absolutePM25.toFixed(1)} µg/m³`
                      : "—"}
                  </p>
                </div>
                <DeltaBadge value={level} />
              </div>
              <SourceSlider
                value={level}
                onChange={(val) => onSourceChange(source.id, val)}
                label={source.label}
                color={source.color}
                baselineContribution={apportionment?.absolutePM25 ?? 0}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
