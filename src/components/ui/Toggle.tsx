"use client";

interface ToggleProps {
  enabled: boolean;
  onChange: () => void;
  label: string;
  color?: string;
}

export function Toggle({ enabled, onChange, label, color = "#4A90D9" }: ToggleProps) {
  return (
    <button
      role="switch"
      aria-checked={enabled}
      aria-label={`Toggle ${label}`}
      onClick={onChange}
      className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      style={{ backgroundColor: enabled ? color : "#D1D5DB" }}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
          enabled ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}
