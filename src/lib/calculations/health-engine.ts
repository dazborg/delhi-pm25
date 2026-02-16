import {
  calculateRelativeRisk,
  calculateAttributableFraction,
  calculateAttributableDeaths,
} from "./attributable-fraction";
import { calculateLifeExpectancyLoss } from "./life-expectancy";
import { calculateDALYs, calculateQALYsLost } from "./dalys";
import {
  CRF_PARAMETERS,
  POPULATION_PARAMS,
  COUNTERFACTUAL_PM25,
} from "@/lib/data/health-parameters";
import type {
  HealthImpact,
  HealthDelta,
  MortalityEstimate,
  HealthEndpoint,
} from "@/types/health";
import type { SourceApportionment } from "@/types/sources";
import type { SourceToggleState } from "@/types/sources";

/**
 * Calculate the effective PM2.5 level after scaling sources.
 *
 * Each source contributes: (source.percentage / 100) * (scaleFactor / 100) of basePM25.
 * At scale 100 (baseline), contribution is unchanged.
 * At scale 0, contribution is removed. At scale 200, contribution is doubled.
 */
export function calculateEffectivePM25(
  basePM25: number,
  sources: SourceApportionment[],
  toggleState: SourceToggleState
): number {
  let scaledFraction = 0;
  for (const source of sources) {
    const scaleFactor = toggleState[source.sourceId] ?? 100;
    scaledFraction += (source.percentage / 100) * (scaleFactor / 100);
  }
  return Math.max(0, Math.round(basePM25 * scaledFraction * 10) / 10);
}

/**
 * Calculate a single mortality endpoint estimate.
 */
function calculateMortalityEndpoint(
  endpoint: HealthEndpoint,
  pm25Level: number,
  counterfactual: number
): MortalityEstimate {
  const crf = CRF_PARAMETERS[endpoint];
  const { population, baselineMortalityRate } = POPULATION_PARAMS;

  const rr = calculateRelativeRisk(pm25Level, counterfactual, crf.relativeRiskPer10);
  const rrLower = calculateRelativeRisk(pm25Level, counterfactual, crf.ciLower);
  const rrUpper = calculateRelativeRisk(pm25Level, counterfactual, crf.ciUpper);

  const af = calculateAttributableFraction(rr);
  const afLower = calculateAttributableFraction(rrLower);
  const afUpper = calculateAttributableFraction(rrUpper);

  return {
    endpoint,
    label: crf.label,
    relativeRisk: rr,
    attributableFraction: af,
    attributableDeaths: Math.round(
      calculateAttributableDeaths(population, baselineMortalityRate, af)
    ),
    attributableDeathsLower: Math.round(
      calculateAttributableDeaths(population, baselineMortalityRate, afLower)
    ),
    attributableDeathsUpper: Math.round(
      calculateAttributableDeaths(population, baselineMortalityRate, afUpper)
    ),
  };
}

/**
 * Calculate full health impact for a given PM2.5 level.
 *
 * Computes mortality estimates for all endpoints, plus
 * life expectancy loss, DALYs, and QALYs.
 */
export function calculateHealthImpact(
  pm25Level: number,
  counterfactual: number = COUNTERFACTUAL_PM25
): HealthImpact {
  const allCause = calculateMortalityEndpoint("all_cause_mortality", pm25Level, counterfactual);
  const cardiovascular = calculateMortalityEndpoint("cardiovascular_mortality", pm25Level, counterfactual);
  const respiratory = calculateMortalityEndpoint("respiratory_mortality", pm25Level, counterfactual);
  const lungCancer = calculateMortalityEndpoint("lung_cancer", pm25Level, counterfactual);

  const lifeExpLoss = calculateLifeExpectancyLoss(pm25Level, counterfactual);
  const dalys = calculateDALYs(allCause.attributableDeaths);
  const qalys = calculateQALYsLost(dalys);

  return {
    pm25Level,
    counterfactualPM25: counterfactual,
    allCauseMortality: allCause,
    cardiovascularMortality: cardiovascular,
    respiratoryMortality: respiratory,
    lungCancer: lungCancer,
    lifeExpectancyLoss: Math.round(lifeExpLoss * 10) / 10,
    dalysLost: Math.round(dalys),
    qalysLost: Math.round(qalys),
  };
}

/**
 * Calculate the health delta between baseline and a scenario.
 * Used to show the impact of toggling sources off.
 */
export function calculateHealthDelta(
  baselineImpact: HealthImpact,
  scenarioImpact: HealthImpact
): HealthDelta {
  const lifeExpGain =
    Math.round((baselineImpact.lifeExpectancyLoss - scenarioImpact.lifeExpectancyLoss) * 10) / 10;

  return {
    pm25Change:
      Math.round((baselineImpact.pm25Level - scenarioImpact.pm25Level) * 10) / 10,
    previousPM25: baselineImpact.pm25Level,
    newPM25: scenarioImpact.pm25Level,
    prematureDeathsAvoided:
      baselineImpact.allCauseMortality.attributableDeaths -
      scenarioImpact.allCauseMortality.attributableDeaths,
    cardiovascularDeathsAvoided:
      baselineImpact.cardiovascularMortality.attributableDeaths -
      scenarioImpact.cardiovascularMortality.attributableDeaths,
    respiratoryDeathsAvoided:
      baselineImpact.respiratoryMortality.attributableDeaths -
      scenarioImpact.respiratoryMortality.attributableDeaths,
    lifeExpectancyGainPerPerson: lifeExpGain,
    lifeYearsGained: Math.round(lifeExpGain * POPULATION_PARAMS.population),
    dalysAverted: baselineImpact.dalysLost - scenarioImpact.dalysLost,
    qalysGained: baselineImpact.qalysLost - scenarioImpact.qalysLost,
  };
}
