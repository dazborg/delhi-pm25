export type Month =
  | "January"
  | "February"
  | "March"
  | "April"
  | "May"
  | "June"
  | "July"
  | "August"
  | "September"
  | "October"
  | "November"
  | "December";

export interface MonthlyPM25 {
  month: Month;
  monthIndex: number;
  pm25: number;
}

export interface AnnualPM25 {
  year: number;
  annualAverage: number;
  monthlyData: MonthlyPM25[];
}
