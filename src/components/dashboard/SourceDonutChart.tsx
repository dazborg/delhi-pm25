"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { POLLUTION_SOURCES, getAnnualSources, getMonthSources } from "@/lib/data/source-apportionment";
import type { SourceToggleState } from "@/types/sources";

interface SourceDonutChartProps {
  activeMonth: "annual" | number;
  toggleState: SourceToggleState;
  effectivePM25: number;
}

export function SourceDonutChart({ activeMonth, toggleState, effectivePM25 }: SourceDonutChartProps) {
  const sources = activeMonth === "annual" ? getAnnualSources() : getMonthSources(activeMonth);

  const data = sources.map((s) => {
    const sourceMeta = POLLUTION_SOURCES.find((ps) => ps.id === s.sourceId)!;
    const isEnabled = toggleState[s.sourceId];
    return {
      name: sourceMeta.label,
      value: isEnabled ? s.percentage : 0,
      originalValue: s.percentage,
      color: sourceMeta.color,
      enabled: isEnabled,
      sourceId: s.sourceId,
    };
  });

  // Filter out disabled sources for the chart but keep for display
  const chartData = data.filter((d) => d.value > 0);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <h3 className="text-lg font-semibold text-slate-800 mb-1">Source Apportionment</h3>
      <p className="text-sm text-slate-500 mb-4">
        {activeMonth === "annual" ? "Annual average" : "Month profile"} — hover for details
      </p>

      <div className="h-64 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={95}
              paddingAngle={2}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [`${Number(value).toFixed(1)}%`, "Share"]}
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 4px 6px rgba(0,0,0,0.07)",
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <p className="text-2xl font-bold text-slate-800">
              {effectivePM25}
            </p>
            <p className="text-xs text-slate-500">µg/m³</p>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-2 mt-4">
        {data.map((d) => (
          <div
            key={d.sourceId}
            className={`flex items-center gap-2 text-xs ${d.enabled ? "text-slate-600" : "text-slate-400 line-through"}`}
          >
            <span
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: d.enabled ? d.color : "#D1D5DB" }}
            />
            <span className="truncate">{d.name}</span>
            <span className="ml-auto font-medium">{d.originalValue.toFixed(0)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
