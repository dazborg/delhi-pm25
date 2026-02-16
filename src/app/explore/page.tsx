"use client";

import { useSourceToggle } from "@/lib/hooks/useSourceToggle";
import { MonthSelector } from "@/components/interactive/MonthSelector";
import { SourceTogglePanel } from "@/components/dashboard/SourceTogglePanel";
import { SourceDonutChart } from "@/components/dashboard/SourceDonutChart";
import { HealthImpactPanel } from "@/components/dashboard/HealthImpactPanel";
import { MonthlyChart } from "@/components/dashboard/MonthlyChart";
import { MONTHS } from "@/lib/utils/constants";
import { POLLUTION_SOURCES, getAnnualSources, getMonthSources } from "@/lib/data/source-apportionment";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { MONTHLY_PM25, WHO_GUIDELINE, INDIA_NAAQS } from "@/lib/data/pm25-levels";
import { MONTHS_SHORT } from "@/lib/utils/constants";

export default function ExplorePage() {
  const {
    dashboardState,
    setSourceLevel,
    resetAll,
    setActiveMonth,
    toggleState,
    activeMonth,
  } = useSourceToggle();

  // Build stacked area data
  const stackedData = MONTHLY_PM25.map((m) => {
    const sources = getMonthSources(m.monthIndex);
    const entry: Record<string, number | string> = {
      name: MONTHS_SHORT[m.monthIndex],
    };
    sources.forEach((s) => {
      const scaleFactor = (toggleState[s.sourceId] ?? 100) / 100;
      entry[s.sourceId] = s.absolutePM25 * scaleFactor;
    });
    return entry;
  });

  const monthLabel =
    activeMonth === "annual"
      ? "Annual Average (2024)"
      : MONTHS[activeMonth as number];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Data Explorer</h1>
        <p className="mt-2 text-slate-600">
          Deep-dive into Delhi&apos;s PM2.5 data. Toggle sources, select months, and
          model intervention scenarios.
        </p>
      </div>

      {/* Controls bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Time Period: <span className="text-slate-900 font-semibold">{monthLabel}</span>
            </label>
            <MonthSelector activeMonth={activeMonth} onSelect={setActiveMonth} />
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-500">Effective PM2.5</p>
            <p className="text-3xl font-bold text-slate-900 tabular-nums">
              {dashboardState.effectivePM25}
              <span className="text-sm font-normal text-slate-500 ml-1">µg/m³</span>
            </p>
          </div>
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left sidebar: controls */}
        <div className="lg:col-span-1 space-y-6">
          <SourceTogglePanel
            activeMonth={activeMonth}
            toggleState={toggleState}
            onSourceChange={setSourceLevel}
            onReset={resetAll}
          />
        </div>

        {/* Main area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Stacked area chart */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-1">
              Source Contributions by Month
            </h3>
            <p className="text-sm text-slate-500 mb-4">
              Stacked area chart showing how each source contributes to total PM2.5 across the year
            </p>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stackedData} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#64748B" }} />
                  <YAxis
                    tick={{ fontSize: 12, fill: "#64748B" }}
                    label={{
                      value: "µg/m³",
                      angle: -90,
                      position: "insideLeft",
                      offset: 15,
                      style: { fontSize: 11, fill: "#94A3B8" },
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 4px 6px rgba(0,0,0,0.07)",
                    }}
                    formatter={(value, name) => {
                      const source = POLLUTION_SOURCES.find((s) => s.id === name);
                      return [`${Number(value).toFixed(1)} µg/m³`, source?.label || String(name)];
                    }}
                  />
                  <ReferenceLine y={WHO_GUIDELINE} stroke="#22C55E" strokeDasharray="6 3" />
                  <ReferenceLine y={INDIA_NAAQS} stroke="#EAB308" strokeDasharray="6 3" />
                  {POLLUTION_SOURCES.map((source) => (
                    <Area
                      key={source.id}
                      type="monotone"
                      dataKey={source.id}
                      stackId="1"
                      stroke={source.color}
                      fill={source.color}
                      fillOpacity={toggleState[source.id] > 0 ? 0.7 : 0}
                    />
                  ))}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Row: monthly bar + donut */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MonthlyChart activeMonth={activeMonth} onMonthClick={setActiveMonth} />
            <SourceDonutChart
              activeMonth={activeMonth}
              toggleState={toggleState}
              effectivePM25={dashboardState.effectivePM25}
            />
          </div>

          {/* Health impact */}
          <HealthImpactPanel
            healthImpact={dashboardState.healthImpact}
            healthDelta={dashboardState.healthDelta}
            baselinePM25={dashboardState.baselinePM25}
            effectivePM25={dashboardState.effectivePM25}
          />
        </div>
      </div>
    </div>
  );
}
