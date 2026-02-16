"use client";

import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import type { HealthImpact, HealthDelta } from "@/types/health";
import { formatNumber, formatCompact } from "@/lib/utils/formatters";

interface HealthImpactPanelProps {
  healthImpact: HealthImpact;
  healthDelta: HealthDelta;
  baselinePM25: number;
  effectivePM25: number;
}

export function HealthImpactPanel({
  healthImpact,
  healthDelta,
  baselinePM25,
  effectivePM25,
}: HealthImpactPanelProps) {
  const hasIntervention = effectivePM25 < baselinePM25;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-slate-800">Health Impact</h3>
        {hasIntervention && (
          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-xs font-medium px-2.5 py-1 rounded-full">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            Intervention modelled
          </span>
        )}
      </div>
      <p className="text-sm text-slate-500 mb-5">
        Estimated annual health burden at{" "}
        <span className="font-medium text-slate-700">{effectivePM25} µg/m³</span>
        {hasIntervention && (
          <span className="text-emerald-600">
            {" "}(reduced from {baselinePM25})
          </span>
        )}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <HealthCard
          label="Premature Deaths"
          value={healthImpact.allCauseMortality.attributableDeaths}
          delta={hasIntervention ? healthDelta.prematureDeathsAvoided : 0}
          deltaLabel="lives saved"
          format="number"
          icon="💀"
          severity="critical"
        />
        <HealthCard
          label="Life Expectancy Lost"
          value={healthImpact.lifeExpectancyLoss}
          delta={hasIntervention ? healthDelta.lifeExpectancyGainPerPerson : 0}
          deltaLabel="years gained"
          format="years"
          icon="⏳"
          severity="high"
        />
        <HealthCard
          label="DALYs Lost"
          value={healthImpact.dalysLost}
          delta={hasIntervention ? healthDelta.dalysAverted : 0}
          deltaLabel="DALYs averted"
          format="compact"
          icon="📊"
          severity="high"
        />
        <HealthCard
          label="QALYs Lost"
          value={healthImpact.qalysLost}
          delta={hasIntervention ? healthDelta.qalysGained : 0}
          deltaLabel="QALYs gained"
          format="compact"
          icon="💚"
          severity="moderate"
        />
        <HealthCard
          label="Cardiovascular Deaths"
          value={healthImpact.cardiovascularMortality.attributableDeaths}
          delta={hasIntervention ? healthDelta.cardiovascularDeathsAvoided : 0}
          deltaLabel="lives saved"
          format="number"
          icon="❤️"
          severity="high"
        />
        <HealthCard
          label="Respiratory Deaths"
          value={healthImpact.respiratoryMortality.attributableDeaths}
          delta={hasIntervention ? healthDelta.respiratoryDeathsAvoided : 0}
          deltaLabel="lives saved"
          format="number"
          icon="🫁"
          severity="moderate"
        />
      </div>

      {/* Methodology note */}
      <p className="mt-5 text-xs text-slate-400 leading-relaxed">
        Health estimates use log-linear concentration-response functions from WHO meta-analyses.
        All-cause mortality RR = 1.095 per 10 µg/m³. Life expectancy via AQLI methodology
        (Ebenstein et al. 2017). Counterfactual: WHO guideline (5 µg/m³).
        See{" "}
        <a href="/reports/health-effects" className="text-blue-500 hover:underline">
          Health Effects Review
        </a>{" "}
        and{" "}
        <a href="/reports/key-decisions" className="text-blue-500 hover:underline">
          Key Decisions
        </a>.
      </p>
    </div>
  );
}

function HealthCard({
  label,
  value,
  delta,
  deltaLabel,
  format,
  icon,
  severity,
}: {
  label: string;
  value: number;
  delta: number;
  deltaLabel: string;
  format: "number" | "compact" | "years";
  icon: string;
  severity: "critical" | "high" | "moderate";
}) {
  const borderColor =
    severity === "critical"
      ? "border-l-red-500"
      : severity === "high"
        ? "border-l-amber-500"
        : "border-l-blue-500";

  const formatFn = (v: number) => {
    if (format === "years") return `${(Math.round(v * 10) / 10).toFixed(1)}`;
    if (format === "compact") return formatCompact(Math.round(v));
    return formatNumber(Math.round(v));
  };

  const unitLabel = format === "years" ? "years per person" : format === "compact" ? "" : "";

  return (
    <div className={`border-l-4 ${borderColor} bg-slate-50 rounded-lg p-4`}>
      <div className="flex items-start gap-2">
        <span className="text-lg" aria-hidden="true">{icon}</span>
        <div className="flex-1">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">
            <AnimatedNumber value={value} formatFn={formatFn} />
            {unitLabel && <span className="text-sm font-normal text-slate-500 ml-1">{unitLabel}</span>}
          </p>

          {delta > 0 && (
            <div className="mt-1.5 inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 text-xs font-medium px-2 py-0.5 rounded-full">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              {formatFn(delta)} {deltaLabel}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
