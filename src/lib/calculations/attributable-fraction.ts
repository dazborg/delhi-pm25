/**
 * Concentration-Response Function calculations for PM2.5 health impacts.
 *
 * Uses the standard log-linear model from environmental epidemiology:
 *   RR(C) = exp(β × (C - C₀))
 *
 * where:
 *   β = ln(RR₁₀) / 10  (the log-linear slope per µg/m³)
 *   C = current PM2.5 concentration (µg/m³)
 *   C₀ = counterfactual concentration (WHO guideline = 5 µg/m³)
 *   RR₁₀ = relative risk per 10 µg/m³ increase
 *
 * This model is standard in GBD analyses and WHO guidelines.
 * Limitation: log-linear may overestimate at very high concentrations
 * (>200 µg/m³). The GEMM (Burnett et al. 2018) uses a supralinear
 * shape that flattens at high concentrations. See Key Decisions document.
 */

/**
 * Calculate relative risk at a given PM2.5 concentration.
 */
export function calculateRelativeRisk(
  concentration: number,
  counterfactual: number,
  rrPer10: number
): number {
  const beta = Math.log(rrPer10) / 10;
  const deltaC = Math.max(0, concentration - counterfactual);
  return Math.exp(beta * deltaC);
}

/**
 * Population Attributable Fraction.
 * AF = (RR - 1) / RR
 *
 * Represents the proportion of deaths in the population
 * that can be attributed to PM2.5 exposure above the counterfactual.
 */
export function calculateAttributableFraction(rr: number): number {
  if (rr <= 1) return 0;
  return (rr - 1) / rr;
}

/**
 * Number of deaths attributable to PM2.5 exposure.
 * Attributable deaths = Baseline deaths × AF
 */
export function calculateAttributableDeaths(
  population: number,
  baselineMortalityRate: number, // per 1,000
  af: number
): number {
  const baselineDeaths = population * (baselineMortalityRate / 1000);
  return baselineDeaths * af;
}
