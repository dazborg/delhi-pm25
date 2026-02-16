"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { MONTHLY_PM25, WHO_GUIDELINE, INDIA_NAAQS } from "@/lib/data/pm25-levels";
import { MONTHS_SHORT } from "@/lib/utils/constants";
import { getPM25Color } from "@/lib/utils/formatters";

interface MonthlyChartProps {
  activeMonth: "annual" | number;
  onMonthClick: (monthIndex: number | "annual") => void;
}

export function MonthlyChart({ activeMonth, onMonthClick }: MonthlyChartProps) {
  const data = MONTHLY_PM25.map((m) => ({
    name: MONTHS_SHORT[m.monthIndex],
    pm25: m.pm25,
    monthIndex: m.monthIndex,
  }));

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">Monthly PM2.5 Levels</h3>
          <p className="text-sm text-slate-500">Click a bar to explore that month&apos;s sources</p>
        </div>
        {activeMonth !== "annual" && (
          <button
            onClick={() => onMonthClick("annual")}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Show Annual
          </button>
        )}
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12, fill: "#64748B" }}
              axisLine={{ stroke: "#e2e8f0" }}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#64748B" }}
              axisLine={{ stroke: "#e2e8f0" }}
              label={{
                value: "µg/m³",
                angle: -90,
                position: "insideLeft",
                offset: 15,
                style: { fontSize: 11, fill: "#94A3B8" },
              }}
            />
            <Tooltip
              formatter={(value) => [`${value} µg/m³`, "PM2.5"]}
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 4px 6px rgba(0,0,0,0.07)",
              }}
            />
            <ReferenceLine
              y={WHO_GUIDELINE}
              stroke="#22C55E"
              strokeDasharray="6 3"
              label={{
                value: "WHO",
                position: "right",
                fill: "#22C55E",
                fontSize: 10,
              }}
            />
            <ReferenceLine
              y={INDIA_NAAQS}
              stroke="#EAB308"
              strokeDasharray="6 3"
              label={{
                value: "India",
                position: "right",
                fill: "#EAB308",
                fontSize: 10,
              }}
            />
            <Bar
              dataKey="pm25"
              radius={[4, 4, 0, 0]}
              cursor="pointer"
              onClick={(_data, index) => onMonthClick(index)}
            >
              {data.map((entry) => (
                <Cell
                  key={entry.monthIndex}
                  fill={getPM25Color(entry.pm25)}
                  opacity={
                    activeMonth === "annual" || activeMonth === entry.monthIndex
                      ? 1
                      : 0.35
                  }
                  stroke={activeMonth === entry.monthIndex ? "#1e293b" : "none"}
                  strokeWidth={activeMonth === entry.monthIndex ? 2 : 0}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-4 text-xs text-slate-500 justify-center">
        <span className="flex items-center gap-1">
          <span className="w-3 h-0.5 bg-green-500 inline-block" style={{ borderTop: "2px dashed #22C55E" }}></span>
          WHO Guideline (5 µg/m³)
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-0.5 inline-block" style={{ borderTop: "2px dashed #EAB308" }}></span>
          India NAAQS (40 µg/m³)
        </span>
      </div>
    </div>
  );
}
