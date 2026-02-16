import type { CRFParameter, HealthEndpoint, PopulationParameters } from "@/types/health";

/**
 * Population parameters for Delhi NCT (2025 projected).
 * Sources:
 * - Population: National Commission on Population projection
 * - Mortality rate: Sample Registration System, India (crude death rate)
 * - Life expectancy: SRS abridged life tables
 */
export const POPULATION_PARAMS: PopulationParameters = {
  population: 22_300_000,
  baselineMortalityRate: 5.5, // per 1,000 per year
  baselineDeaths: Math.round(22_300_000 * 5.5 / 1000), // 122,650
  lifeExpectancyAtBirth: 70.2, // years (India average 2022)
};

/**
 * Concentration-Response Function parameters for PM2.5 health endpoints.
 *
 * These use the log-linear model: RR = exp(β × ΔC)
 * where β = ln(RR_per_10) / 10 and ΔC = max(0, C - C₀)
 *
 * All-cause mortality: WHO systematic review update (2024), Chen & Hoek (2020)
 * Cardiovascular: WHO review, Pope et al. (2020)
 * Respiratory: WHO review, pooled estimates from LMICs meta-analysis (2023)
 * Lung cancer: Hamra et al. (2014) meta-analysis
 */
export const CRF_PARAMETERS: Record<HealthEndpoint, CRFParameter> = {
  all_cause_mortality: {
    endpoint: "all_cause_mortality",
    label: "All-Cause Premature Deaths",
    relativeRiskPer10: 1.095,
    ciLower: 1.066,
    ciUpper: 1.126,
    source: "WHO systematic review update 2024; Chen & Hoek 2020",
  },
  cardiovascular_mortality: {
    endpoint: "cardiovascular_mortality",
    label: "Cardiovascular Deaths",
    relativeRiskPer10: 1.1,
    ciLower: 1.05,
    ciUpper: 1.15,
    source: "WHO 2013 review; Pope et al. 2020",
  },
  respiratory_mortality: {
    endpoint: "respiratory_mortality",
    label: "Respiratory Deaths",
    relativeRiskPer10: 1.31,
    ciLower: 1.15,
    ciUpper: 1.49,
    source: "WHO 2013 review; LMICs meta-analysis 2023",
  },
  lung_cancer: {
    endpoint: "lung_cancer",
    label: "Lung Cancer Deaths",
    relativeRiskPer10: 1.12,
    ciLower: 1.03,
    ciUpper: 1.21,
    source: "Hamra et al. 2014 meta-analysis",
  },
};

/**
 * AQLI life expectancy coefficient.
 * Calibrated to match AQLI 2025 report: 8.2 years lost at Delhi's
 * annual average of 104.7 µg/m³ (relative to WHO guideline of 5 µg/m³).
 *
 * Raw AQLI coefficient from Ebenstein et al. (2017): ~0.098 years/µg/m³
 * Calibrated: 8.2 / (104.7 - 5) = 0.0822 years/µg/m³
 *
 * The calibration accounts for AQLI's age-stratified population weighting
 * which the raw coefficient does not capture.
 */
export const AQLI_COEFFICIENT = 0.0822;

/**
 * Average years of life lost per PM2.5-attributable death.
 * From GBD 2019 India estimates.
 */
export const AVERAGE_YLL_PER_DEATH = 12;

/**
 * Years lived with disability as a fraction of total DALYs.
 * For PM2.5, ~95% of DALYs are from YLL (mortality dominates).
 * Source: GBD 2019.
 */
export const YLD_FRACTION = 0.05;

/**
 * WHO counterfactual concentration (theoretical minimum risk exposure level).
 */
export const COUNTERFACTUAL_PM25 = 5;
