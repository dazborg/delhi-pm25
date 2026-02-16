"use client";

import { MONTHS_SHORT } from "@/lib/utils/constants";
import { MONTHLY_PM25 } from "@/lib/data/pm25-levels";
import { getPM25Color } from "@/lib/utils/formatters";

interface MonthSelectorProps {
  activeMonth: "annual" | number;
  onSelect: (month: "annual" | number) => void;
}

export function MonthSelector({ activeMonth, onSelect }: MonthSelectorProps) {
  return (
    <div className="flex flex-wrap gap-1.5 items-center">
      <button
        onClick={() => onSelect("annual")}
        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
          activeMonth === "annual"
            ? "bg-slate-800 text-white shadow-md"
            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
        }`}
      >
        Annual
      </button>
      {MONTHS_SHORT.map((month, idx) => {
        const pm25 = MONTHLY_PM25[idx].pm25;
        const isActive = activeMonth === idx;
        return (
          <button
            key={month}
            onClick={() => onSelect(idx)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              isActive
                ? "text-white shadow-md"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
            style={isActive ? { backgroundColor: getPM25Color(pm25) } : undefined}
            title={`${month}: ${pm25} µg/m³`}
          >
            {month}
          </button>
        );
      })}
    </div>
  );
}
