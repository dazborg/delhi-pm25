export type SourceId =
  | "vehicles"
  | "biomass"
  | "industry"
  | "dust"
  | "secondary"
  | "waste_other";

export interface PollutionSource {
  id: SourceId;
  label: string;
  description: string;
  color: string;
  icon: string;
}

export interface SourceApportionment {
  sourceId: SourceId;
  percentage: number;
  absolutePM25: number;
}

export interface MonthlySourceProfile {
  monthIndex: number;
  totalPM25: number;
  sources: SourceApportionment[];
}

/** Percentage scale factor per source: 100 = baseline, 0 = eliminated, 200 = doubled */
export type SourceToggleState = Record<SourceId, number>;
