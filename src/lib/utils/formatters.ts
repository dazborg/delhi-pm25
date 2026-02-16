/**
 * Format a number with commas for thousands separation.
 */
export function formatNumber(value: number): string {
  return value.toLocaleString("en-IN");
}

/**
 * Format a large number in compact form (e.g., 73,000 → "73K").
 */
export function formatCompact(value: number): string {
  if (Math.abs(value) >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }
  if (Math.abs(value) >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  }
  return value.toFixed(0);
}

/**
 * Format PM2.5 value with unit.
 */
export function formatPM25(value: number): string {
  return `${Math.round(value * 10) / 10} µg/m³`;
}

/**
 * Format a percentage.
 */
export function formatPercent(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format years (e.g., life expectancy).
 */
export function formatYears(value: number): string {
  return `${Math.round(value * 10) / 10} years`;
}

/**
 * Get the severity color for a PM2.5 level.
 */
export function getPM25Color(pm25: number): string {
  if (pm25 <= 5) return "#22C55E";    // green - WHO safe
  if (pm25 <= 40) return "#EAB308";   // yellow - moderate
  if (pm25 <= 100) return "#F97316";  // orange - unhealthy
  if (pm25 <= 200) return "#EF4444";  // red - very unhealthy
  return "#7F1D1D";                    // dark red - hazardous
}

/**
 * Get severity label for a PM2.5 level.
 */
export function getPM25Label(pm25: number): string {
  if (pm25 <= 5) return "WHO Safe";
  if (pm25 <= 40) return "Moderate";
  if (pm25 <= 100) return "Unhealthy";
  if (pm25 <= 200) return "Very Unhealthy";
  return "Hazardous";
}
