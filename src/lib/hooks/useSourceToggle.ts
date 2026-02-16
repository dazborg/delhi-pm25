"use client";

import { useState, useMemo, useCallback } from "react";
import type { SourceToggleState, SourceId } from "@/types/sources";
import type { DashboardState } from "@/types/health";
import { getAnnualSources, getMonthSources } from "@/lib/data/source-apportionment";
import { ANNUAL_PM25, getMonthlyPM25 } from "@/lib/data/pm25-levels";
import {
  calculateEffectivePM25,
  calculateHealthImpact,
  calculateHealthDelta,
} from "@/lib/calculations/health-engine";

const ALL_SOURCES_BASELINE: SourceToggleState = {
  vehicles: 100,
  biomass: 100,
  industry: 100,
  dust: 100,
  secondary: 100,
  waste_other: 100,
};

export function useSourceToggle() {
  const [activeMonth, setActiveMonth] = useState<"annual" | number>("annual");
  const [toggleState, setToggleState] = useState<SourceToggleState>({
    ...ALL_SOURCES_BASELINE,
  });

  const setSourceLevel = useCallback((sourceId: SourceId, level: number) => {
    setToggleState((prev) => ({
      ...prev,
      [sourceId]: Math.max(0, Math.min(200, Math.round(level))),
    }));
  }, []);

  const resetAll = useCallback(() => {
    setToggleState({ ...ALL_SOURCES_BASELINE });
  }, []);

  const dashboardState: DashboardState = useMemo(() => {
    const basePM25 =
      activeMonth === "annual" ? ANNUAL_PM25 : getMonthlyPM25(activeMonth);

    const sources =
      activeMonth === "annual" ? getAnnualSources() : getMonthSources(activeMonth);

    const effectivePM25 = calculateEffectivePM25(basePM25, sources, toggleState);
    const baselineImpact = calculateHealthImpact(basePM25);
    const scenarioImpact = calculateHealthImpact(effectivePM25);
    const delta = calculateHealthDelta(baselineImpact, scenarioImpact);

    return {
      activeMonth,
      sourceToggleState: toggleState,
      effectivePM25: Math.round(effectivePM25 * 10) / 10,
      baselinePM25: basePM25,
      healthImpact: scenarioImpact,
      baselineHealthImpact: baselineImpact,
      healthDelta: delta,
    };
  }, [activeMonth, toggleState]);

  return {
    dashboardState,
    setSourceLevel,
    resetAll,
    setActiveMonth,
    toggleState,
    activeMonth,
  };
}
