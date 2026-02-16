"use client";

import { Toggle } from "@/components/ui/Toggle";
import { POLLUTION_SOURCES, getAnnualSources, getMonthSources } from "@/lib/data/source-apportionment";
import type { SourceId, SourceToggleState } from "@/types/sources";

interface SourceTogglePanelProps {
  activeMonth: "annual" | number;
  toggleState: SourceToggleState;
  onToggle: (sourceId: SourceId) => void;
  onReset: () => void;
}

export function SourceTogglePanel({
  activeMonth,
  toggleState,
  onToggle,
  onReset,
}: SourceTogglePanelProps) {
  const sources = activeMonth === "annual" ? getAnnualSources() : getMonthSources(activeMonth);
  const anyDisabled = Object.values(toggleState).some((v) => !v);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">Pollution Sources</h3>
          <p className="text-sm text-slate-500">
            Toggle sources to model intervention scenarios
          </p>
        </div>
        {anyDisabled && (
          <button
            onClick={onReset}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium px-3 py-1 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Reset All
          </button>
        )}
      </div>

      <div className="space-y-3">
        {POLLUTION_SOURCES.map((source) => {
          const apportionment = sources.find((s) => s.sourceId === source.id);
          const isEnabled = toggleState[source.id];

          return (
            <div
              key={source.id}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 ${
                isEnabled
                  ? "border-slate-200 bg-white"
                  : "border-slate-100 bg-slate-50"
              }`}
            >
              <span className="text-xl flex-shrink-0" aria-hidden="true">
                {source.icon}
              </span>
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-medium ${
                    isEnabled ? "text-slate-800" : "text-slate-400"
                  }`}
                >
                  {source.label}
                </p>
                <p className={`text-xs ${isEnabled ? "text-slate-500" : "text-slate-400"}`}>
                  {apportionment
                    ? `${apportionment.percentage.toFixed(1)}% · ${apportionment.absolutePM25.toFixed(1)} µg/m³`
                    : "—"}
                </p>
              </div>
              <Toggle
                enabled={isEnabled}
                onChange={() => onToggle(source.id)}
                label={source.label}
                color={source.color}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
