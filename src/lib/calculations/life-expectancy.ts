import { AQLI_COEFFICIENT, COUNTERFACTUAL_PM25 } from "@/lib/data/health-parameters";

/**
 * Life expectancy reduction calculation using AQLI methodology.
 *
 * The Air Quality Life Index (University of Chicago EPIC) converts
 * PM2.5 exposure into years of life expectancy lost using a linear
 * approximation derived from Ebenstein et al. (2017).
 *
 * Original coefficient: ~0.098 years per µg/m³ above WHO guideline
 * Calibrated coefficient: 0.0822 years per µg/m³
 *
 * Calibration ensures our model matches AQLI's published figure of
 * 8.2 years lost for Delhi at 104.7 µg/m³. The difference arises
 * because AQLI uses an age-stratified population-weighted model.
 *
 * @param concentration Current PM2.5 level (µg/m³)
 * @param counterfactual Reference level (default: WHO guideline, 5 µg/m³)
 * @returns Years of life expectancy lost per person
 */
export function calculateLifeExpectancyLoss(
  concentration: number,
  counterfactual: number = COUNTERFACTUAL_PM25
): number {
  const delta = Math.max(0, concentration - counterfactual);
  return AQLI_COEFFICIENT * delta;
}

/**
 * Calculate population-level life-years lost.
 *
 * @param lifeExpectancyLossPerPerson Years lost per person
 * @param population Total population
 * @returns Total life-years lost across the population
 */
export function calculatePopulationLifeYearsLost(
  lifeExpectancyLossPerPerson: number,
  population: number
): number {
  return lifeExpectancyLossPerPerson * population;
}
