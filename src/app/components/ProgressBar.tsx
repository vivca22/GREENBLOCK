import { motion } from "motion/react";

interface ProgressBarProps {
  current: number;
  max: number;
  label?: string;
  color?: string;
}

export function ProgressBar({ current, max, label, color = "#52B788" }: ProgressBarProps) {
  const pct = Math.min(100, Math.round((current / max) * 100));

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between mb-1.5">
          <span className="text-xs" style={{ fontFamily: "Nunito, sans-serif", color: "#6B7280" }}>{label}</span>
          <span className="text-xs" style={{ fontFamily: "Nunito, sans-serif", color: "#2D6A4F", fontWeight: 700 }}>
            {current.toLocaleString()} / {max.toLocaleString()} pts
          </span>
        </div>
      )}
      <div className="w-full h-3 rounded-full overflow-hidden" style={{ backgroundColor: "#E5E7EB" }}>
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
