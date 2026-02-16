import { AVERAGE_YLL_PER_DEATH, YLD_FRACTION } from "@/lib/data/health-parameters";

/**
 * DALY (Disability-Adjusted Life Year) estimation for PM2.5.
 *
 * DALY = YLL + YLD
 *   YLL = Years of Life Lost = attributable deaths × average YLL per death
 *   YLD = Years Lived with Disability (from morbidity)
 *
 * For PM2.5, mortality dominates: ~95% of DALYs are YLL.
 * We compute YLL directly and gross up by the YLD fraction.
 *
 * Average YLL per death = 12 years (GBD 2019 India estimate for
 * PM2.5-attributable deaths, reflecting the age distribution of mortality).
 *
 * @param attributableDeaths Number of PM2.5-attributable deaths
 * @returns Total DALYs
 */
export function calculateDALYs(attributableDeaths: number): number {
  const yll = attributableDeaths * AVERAGE_YLL_PER_DEATH;
  // Total DALYs = YLL / (1 - YLD fraction)
  return yll / (1 - YLD_FRACTION);
}

/**
 * QALY loss approximation.
 *
 * QALYs and DALYs are conceptual mirrors but differ in measurement.
 * For mortality-dominated burdens like PM2.5:
 *   QALYs lost ≈ DALYs × 0.95
 *
 * This rough conversion follows Sassi (2006) and is noted as an
 * approximation in the Key Decisions document.
 *
 * @param dalys Total DALYs
 * @returns Approximate QALYs lost
 */
export function calculateQALYsLost(dalys: number): number {
  return dalys * 0.95;
}
