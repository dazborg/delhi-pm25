"use client";

import { ANNUAL_PM25, WHO_GUIDELINE, INDIA_NAAQS } from "@/lib/data/pm25-levels";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";

export function HeroSection() {
  const whoMultiple = Math.round(ANNUAL_PM25 / WHO_GUIDELINE);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-red-950">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(239,68,68,0.3) 0%, transparent 50%),
              radial-gradient(circle at 75% 75%, rgba(234,179,8,0.2) 0%, transparent 50%)`,
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <div className="text-center">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-300 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            2024 Annual Data — CPCB Monitoring Network
          </div>

          {/* Main headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight">
            Delhi&apos;s Air:{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-amber-400">
              {whoMultiple}× the WHO Safety Limit
            </span>
          </h1>

          <p className="mt-6 max-w-3xl mx-auto text-lg sm:text-xl text-slate-300 leading-relaxed">
            Every breath in Delhi carries{" "}
            <span className="text-white font-semibold">{ANNUAL_PM25} µg/m³</span> of
            fine particulate matter — {whoMultiple} times what the World Health
            Organisation considers safe. This analysis maps the sources, quantifies
            the health burden, and models the impact of intervention.
          </p>

          {/* Key stats row */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <StatCard
              label="Annual Average PM2.5"
              value={ANNUAL_PM25}
              unit="µg/m³"
              context={`WHO guideline: ${WHO_GUIDELINE}`}
              severity="critical"
            />
            <StatCard
              label="Exceeds India Standard"
              value={Math.round((ANNUAL_PM25 / INDIA_NAAQS) * 10) / 10}
              unit="× NAAQS"
              context={`National standard: ${INDIA_NAAQS} µg/m³`}
              severity="high"
            />
            <StatCard
              label="Life Expectancy Lost"
              value={8.2}
              unit="years"
              context="Per resident (AQLI 2025)"
              severity="critical"
            />
          </div>

          {/* CTA buttons */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#explorer"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-white text-slate-900 font-semibold hover:bg-slate-100 transition-colors shadow-lg"
            >
              Explore the Data ↓
            </a>
            <a
              href="/reports"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-slate-700 text-white font-semibold hover:bg-slate-600 transition-colors border border-slate-600"
            >
              Read the Evidence →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatCard({
  label,
  value,
  unit,
  context,
  severity,
}: {
  label: string;
  value: number;
  unit: string;
  context: string;
  severity: "critical" | "high" | "moderate";
}) {
  const borderColor =
    severity === "critical"
      ? "border-red-500/30"
      : severity === "high"
        ? "border-amber-500/30"
        : "border-slate-500/30";

  return (
    <div
      className={`bg-white/5 backdrop-blur-sm border ${borderColor} rounded-xl p-6 text-left`}
    >
      <p className="text-sm font-medium text-slate-400 mb-1">{label}</p>
      <p className="text-3xl font-bold text-white">
        <AnimatedNumber value={value} formatFn={(v) => v.toFixed(v % 1 === 0 ? 0 : 1)} />
        <span className="text-lg font-normal text-slate-400 ml-1">{unit}</span>
      </p>
      <p className="text-xs text-slate-500 mt-2">{context}</p>
    </div>
  );
}
