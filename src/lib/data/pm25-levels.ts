import type { MonthlyPM25 } from "@/types/pm25";

/** Delhi annual average PM2.5 (2024), CPCB/CSE data */
export const ANNUAL_PM25 = 104.7;

/** WHO 2021 annual guideline */
export const WHO_GUIDELINE = 5;

/** India National Ambient Air Quality Standard (annual) */
export const INDIA_NAAQS = 40;

/** WHO 24-hour guideline */
export const WHO_24HR = 15;

/** India NAAQS 24-hour standard */
export const INDIA_NAAQS_24HR = 60;

/**
 * Monthly PM2.5 averages for Delhi (µg/m³)
 * Based on long-term analysis (2007-2024) from CPCB CAAQMS stations.
 * Sources: Aerosol and Air Quality Research 2022; CSE annual analyses.
 */
export const MONTHLY_PM25: MonthlyPM25[] = [
  { month: "January", monthIndex: 0, pm25: 190 },
  { month: "February", monthIndex: 1, pm25: 155 },
  { month: "March", monthIndex: 2, pm25: 115 },
  { month: "April", monthIndex: 3, pm25: 95 },
  { month: "May", monthIndex: 4, pm25: 90 },
  { month: "June", monthIndex: 5, pm25: 70 },
  { month: "July", monthIndex: 6, pm25: 55 },
  { month: "August", monthIndex: 7, pm25: 42 },
  { month: "September", monthIndex: 8, pm25: 60 },
  { month: "October", monthIndex: 9, pm25: 125 },
  { month: "November", monthIndex: 10, pm25: 240 },
  { month: "December", monthIndex: 11, pm25: 195 },
];

/** Year-over-year annual averages for trend display */
export const YEARLY_TREND = [
  { year: 2018, pm25: 115.8 },
  { year: 2019, pm25: 109.2 },
  { year: 2020, pm25: 95.1 },
  { year: 2021, pm25: 106.2 },
  { year: 2022, pm25: 98.6 },
  { year: 2023, pm25: 100.9 },
  { year: 2024, pm25: 104.7 },
];

export function getMonthlyPM25(monthIndex: number): number {
  return MONTHLY_PM25[monthIndex].pm25;
}
