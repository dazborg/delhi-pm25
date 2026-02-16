import type { PollutionSource, SourceApportionment, SourceId } from "@/types/sources";
import { ANNUAL_PM25, MONTHLY_PM25 } from "./pm25-levels";

/**
 * Source definitions with metadata and chart colors.
 */
export const POLLUTION_SOURCES: PollutionSource[] = [
  {
    id: "vehicles",
    label: "Vehicles & Transport",
    description:
      "Exhaust and non-exhaust emissions from road transport including cars, trucks, buses, and two-wheelers",
    color: "#4A90D9",
    icon: "🚗",
  },
  {
    id: "biomass",
    label: "Biomass & Crop Burning",
    description:
      "Agricultural residue burning (stubble), residential biomass combustion for cooking and heating",
    color: "#E8913A",
    icon: "🔥",
  },
  {
    id: "dust",
    label: "Dust (Road & Construction)",
    description:
      "Road dust resuspension, construction activity, soil dust, and wind-blown dust",
    color: "#C4A35A",
    icon: "🏗️",
  },
  {
    id: "industry",
    label: "Industrial Emissions",
    description:
      "Manufacturing, power plants, brick kilns, and other industrial processes in Delhi-NCR",
    color: "#6B7B8D",
    icon: "🏭",
  },
  {
    id: "secondary",
    label: "Secondary Particles",
    description:
      "Secondary aerosols formed from gaseous precursors (SO₂, NOx, NH₃, VOCs) through atmospheric chemistry",
    color: "#8B5CF6",
    icon: "💨",
  },
  {
    id: "waste_other",
    label: "Waste Burning & Other",
    description:
      "Municipal solid waste burning, diesel generator sets, and other miscellaneous sources",
    color: "#14B8A6",
    icon: "🗑️",
  },
];

/**
 * Annual average source apportionment (representative midpoint).
 * Synthesis of: IIT Kanpur (2015), TERI-ARAI (2018), Sharma et al. (2016), CEEW.
 * Values represent consensus estimates across methodologies.
 */
export const ANNUAL_SOURCE_PERCENTAGES: Record<SourceId, number> = {
  vehicles: 25,
  biomass: 20,
  dust: 18,
  industry: 15,
  secondary: 12,
  waste_other: 10,
};

/**
 * Seasonal adjustment factors for source contributions.
 * Multiplied against annual percentages, then re-normalised to 100%.
 *
 * Rationale:
 * - Winter (Dec-Feb): Temperature inversions trap pollutants; biomass burning for heating peaks
 * - Summer (Mar-May): Dust storms from Rajasthan; reduced biomass
 * - Monsoon (Jun-Sep): Rain washes out particulates; dust suppressed
 * - Post-monsoon (Oct-Nov): Crop residue burning peaks; low wind + inversions
 *
 * Based on: IIT Kanpur seasonal analysis, TERI-ARAI dispersion modelling,
 * and SAFAR (System of Air Quality and Weather Forecasting) seasonal reports.
 */
const SEASONAL_FACTORS: Record<number, Partial<Record<SourceId, number>>> = {
  0: { biomass: 1.4, dust: 0.6, vehicles: 1.1, secondary: 1.1 }, // Jan
  1: { biomass: 1.2, dust: 0.7, vehicles: 1.1 }, // Feb
  2: { biomass: 0.8, dust: 1.3 }, // Mar
  3: { biomass: 0.6, dust: 1.6, vehicles: 0.9 }, // Apr
  4: { biomass: 0.5, dust: 1.8, vehicles: 0.9 }, // May
  5: { biomass: 0.4, dust: 1.2, secondary: 0.7 }, // Jun
  6: { biomass: 0.3, dust: 0.5, secondary: 0.6 }, // Jul
  7: { biomass: 0.3, dust: 0.4, secondary: 0.5 }, // Aug
  8: { biomass: 0.5, dust: 0.7, secondary: 0.8 }, // Sep
  9: { biomass: 1.5, dust: 0.8, secondary: 1.3 }, // Oct
  10: { biomass: 2.2, dust: 0.5, secondary: 1.5, vehicles: 0.9 }, // Nov
  11: { biomass: 1.6, dust: 0.5, vehicles: 1.2, secondary: 1.1 }, // Dec
};

/**
 * Get source apportionment for a specific month.
 * Applies seasonal adjustment factors and re-normalises to 100%.
 */
export function getMonthSources(monthIndex: number): SourceApportionment[] {
  const totalPM25 = MONTHLY_PM25[monthIndex].pm25;
  const factors = SEASONAL_FACTORS[monthIndex] || {};

  const sourceIds = Object.keys(ANNUAL_SOURCE_PERCENTAGES) as SourceId[];

  // Apply seasonal factors
  const adjusted = sourceIds.map((id) => ({
    id,
    raw: ANNUAL_SOURCE_PERCENTAGES[id] * (factors[id] ?? 1.0),
  }));

  // Normalise to 100%
  const total = adjusted.reduce((sum, s) => sum + s.raw, 0);

  return adjusted.map(({ id, raw }) => {
    const percentage = (raw / total) * 100;
    return {
      sourceId: id,
      percentage: Math.round(percentage * 10) / 10,
      absolutePM25: Math.round((totalPM25 * percentage) / 100 * 10) / 10,
    };
  });
}

/**
 * Get annual source apportionment.
 */
export function getAnnualSources(): SourceApportionment[] {
  const sourceIds = Object.keys(ANNUAL_SOURCE_PERCENTAGES) as SourceId[];
  return sourceIds.map((id) => ({
    sourceId: id,
    percentage: ANNUAL_SOURCE_PERCENTAGES[id],
    absolutePM25: Math.round(ANNUAL_PM25 * ANNUAL_SOURCE_PERCENTAGES[id]) / 100,
  }));
}
