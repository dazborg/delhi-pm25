"use client";

import { HeroSection } from "@/components/dashboard/HeroSection";
import { MonthlyChart } from "@/components/dashboard/MonthlyChart";
import { SourceDonutChart } from "@/components/dashboard/SourceDonutChart";
import { SourceTogglePanel } from "@/components/dashboard/SourceTogglePanel";
import { HealthImpactPanel } from "@/components/dashboard/HealthImpactPanel";
import { MonthSelector } from "@/components/interactive/MonthSelector";
import { useSourceToggle } from "@/lib/hooks/useSourceToggle";
import { MONTHS } from "@/lib/utils/constants";

export default function HomePage() {
  const {
    dashboardState,
    toggleSource,
    resetAll,
    setActiveMonth,
    toggleState,
    activeMonth,
  } = useSourceToggle();

  const monthLabel =
    activeMonth === "annual"
      ? "Annual Average (2024)"
      : MONTHS[activeMonth as number];

  return (
    <>
      {/* Hero */}
      <HeroSection />

      {/* Interactive Explorer Section */}
      <section id="explorer" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Section header */}
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Interactive Data Explorer
          </h2>
          <p className="mt-2 text-slate-600 max-w-2xl">
            Select a time period and toggle pollution sources on/off to see how
            they affect PM2.5 levels and health outcomes in real time.
          </p>
        </div>

        {/* Month selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Time Period
          </label>
          <MonthSelector activeMonth={activeMonth} onSelect={setActiveMonth} />
        </div>

        {/* Current view indicator */}
        <div className="mb-6 p-4 bg-slate-800 text-white rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-sm text-slate-400">Viewing</p>
            <p className="text-lg font-semibold">{monthLabel}</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-sm text-slate-400">Baseline PM2.5</p>
              <p className="text-xl font-bold tabular-nums">
                {dashboardState.baselinePM25}{" "}
                <span className="text-sm font-normal text-slate-400">µg/m³</span>
              </p>
            </div>
            {dashboardState.effectivePM25 < dashboardState.baselinePM25 && (
              <>
                <div className="text-slate-600">→</div>
                <div className="text-center">
                  <p className="text-sm text-emerald-400">After Intervention</p>
                  <p className="text-xl font-bold tabular-nums text-emerald-400">
                    {dashboardState.effectivePM25}{" "}
                    <span className="text-sm font-normal">µg/m³</span>
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-emerald-400">Reduction</p>
                  <p className="text-xl font-bold tabular-nums text-emerald-400">
                    -{dashboardState.healthDelta.pm25Reduction}{" "}
                    <span className="text-sm font-normal">µg/m³</span>
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column: Monthly chart (spans 2 cols on large) */}
          <div className="lg:col-span-2">
            <MonthlyChart
              activeMonth={activeMonth}
              onMonthClick={setActiveMonth}
            />
          </div>

          {/* Right column: Donut chart */}
          <div>
            <SourceDonutChart
              activeMonth={activeMonth}
              toggleState={toggleState}
              effectivePM25={dashboardState.effectivePM25}
            />
          </div>
        </div>

        {/* Second row: Source toggles + Health impact */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Source toggles */}
          <div>
            <SourceTogglePanel
              activeMonth={activeMonth}
              toggleState={toggleState}
              onToggle={toggleSource}
              onReset={resetAll}
            />
          </div>

          {/* Health impact (spans 2 cols) */}
          <div className="lg:col-span-2">
            <HealthImpactPanel
              healthImpact={dashboardState.healthImpact}
              healthDelta={dashboardState.healthDelta}
              baselinePM25={dashboardState.baselinePM25}
              effectivePM25={dashboardState.effectivePM25}
            />
          </div>
        </div>
      </section>

      {/* Policy context section */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center">
            Why This Matters for Policy
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <PolicyCard
              number="8.2"
              unit="years"
              title="Life Expectancy Lost"
              description="Every Delhi resident loses over 8 years of life expectancy to air pollution — more than the impact of tobacco in many countries."
              source="AQLI 2025"
            />
            <PolicyCard
              number="21×"
              unit=""
              title="Above WHO Guideline"
              description="Delhi's annual PM2.5 is 21 times the WHO safety limit. Even India's own national standard is exceeded by 2.6 times."
              source="CPCB/CSE 2024"
            />
            <PolicyCard
              number="~73K"
              unit=""
              title="Premature Deaths Annually"
              description="Our modelling estimates tens of thousands of premature deaths annually in Delhi attributable to PM2.5 exposure above safe levels."
              source="Model estimate"
            />
          </div>
          <div className="mt-10 text-center">
            <a
              href="/reports"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-900 rounded-lg font-semibold hover:bg-slate-100 transition-colors"
            >
              Read the Full Evidence Base →
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

function PolicyCard({
  number,
  unit,
  title,
  description,
  source,
}: {
  number: string;
  unit: string;
  title: string;
  description: string;
  source: string;
}) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
      <p className="text-4xl font-bold text-amber-400">
        {number}
        {unit && (
          <span className="text-lg font-normal text-amber-300 ml-1">{unit}</span>
        )}
      </p>
      <h3 className="text-lg font-semibold mt-2">{title}</h3>
      <p className="text-slate-400 text-sm mt-2 leading-relaxed">{description}</p>
      <p className="text-xs text-slate-500 mt-3">Source: {source}</p>
    </div>
  );
}
