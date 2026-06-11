import { BlockchainBadge } from "./BlockchainBadge";

interface TimelineStepProps {
  label: string;
  date: string;
  description: string;
  txHash: string;
  done: boolean;
  isLast?: boolean;
}

export function TimelineStep({ label, date, description, txHash, done, isLast = false }: TimelineStepProps) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div
          className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center mt-1"
          style={{ backgroundColor: done ? "#52B788" : "#D1D5DB" }}
        >
          {done && (
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
        {!isLast && (
          <div className="w-0.5 flex-1 mt-1" style={{ backgroundColor: done ? "#95D5B2" : "#E5E7EB" }} />
        )}
      </div>
      <div className="pb-6">
        <div className="flex items-center gap-2 flex-wrap">
          <span style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, color: "#1B4332" }}>{label}</span>
          <span className="text-xs" style={{ color: "#6B7280" }}>{date}</span>
        </div>
        <p className="text-sm mt-0.5 mb-2" style={{ color: "#4B5563" }}>{description}</p>
        <BlockchainBadge txHash={txHash} />
      </div>
    </div>
  );
}
