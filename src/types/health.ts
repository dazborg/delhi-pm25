export type HealthEndpoint =
  | "all_cause_mortality"
  | "cardiovascular_mortality"
  | "respiratory_mortality"
  | "lung_cancer";

export interface CRFParameter {
  endpoint: HealthEndpoint;
  label: string;
  relativeRiskPer10: number;
  ciLower: number;
  ciUpper: number;
  source: string;
}

export interface PopulationParameters {
  population: number;
  baselineMortalityRate: number;
  baselineDeaths: number;
  lifeExpectancyAtBirth: number;
}

export interface MortalityEstimate {
  endpoint: HealthEndpoint;
  label: string;
  relativeRisk: number;
  attributableFraction: number;
  attributableDeaths: number;
  attributableDeathsLower: number;
  attributableDeathsUpper: number;
}

export interface HealthImpact {
  pm25Level: number;
  counterfactualPM25: number;
  allCauseMortality: MortalityEstimate;
  cardiovascularMortality: MortalityEstimate;
  respiratoryMortality: MortalityEstimate;
  lungCancer: MortalityEstimate;
  lifeExpectancyLoss: number;
  dalysLost: number;
  qalysLost: number;
}

export interface HealthDelta {
  pm25Change: number;
  previousPM25: number;
  newPM25: number;
  prematureDeathsAvoided: number;
  cardiovascularDeathsAvoided: number;
  respiratoryDeathsAvoided: number;
  lifeExpectancyGainPerPerson: number;
  lifeYearsGained: number;
  dalysAverted: number;
  qalysGained: number;
}

export interface DashboardState {
  activeMonth: "annual" | number;
  sourceToggleState: Record<string, number>;
  effectivePM25: number;
  baselinePM25: number;
  healthImpact: HealthImpact;
  baselineHealthImpact: HealthImpact;
  healthDelta: HealthDelta;
}
