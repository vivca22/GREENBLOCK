import { useState } from "react";
import { Eye } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { LoadingSpinner } from "./LoadingSpinner";

type Status = "created" | "packed" | "shipped" | "delivered";

interface BatchCardProps {
  id: string;
  name: string;
  quantity: number;
  status: Status;
  onRegisterEvent: (id: string) => void;
  onView: (id: string) => void;
}

export function BatchCard({ id, name, quantity, status, onRegisterEvent, onView }: BatchCardProps) {
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    onRegisterEvent(id);
  };

  return (
    <div
      className="p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      style={{ backgroundColor: "#F9FAFB", border: "1px solid #E5E7EB" }}
    >
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <span
          className="px-2 py-1 rounded-lg text-xs flex-shrink-0"
          style={{ backgroundColor: "#D8F3DC", color: "#2D6A4F", fontFamily: "Nunito, sans-serif", fontWeight: 700 }}
        >
          {id}
        </span>
        <div className="min-w-0">
          <p style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, color: "#1B4332" }} className="truncate">{name}</p>
          <p className="text-sm" style={{ color: "#6B7280" }}>{quantity} units</p>
        </div>
      </div>
      <div className="flex items-center gap-3 flex-wrap">
        <StatusBadge status={status} />
        <button
          onClick={handleRegister}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-opacity hover:opacity-80"
          style={{ backgroundColor: "#2D6A4F", color: "white", fontFamily: "Nunito, sans-serif", fontWeight: 600 }}
        >
          {loading ? <LoadingSpinner size={14} /> : <span>🔗</span>}
          Register Event
        </button>
        <button
          onClick={() => onView(id)}
          className="flex items-center gap-1 px-3 py-2 rounded-xl text-sm transition-opacity hover:opacity-80"
          style={{ backgroundColor: "#E5E7EB", color: "#374151", fontFamily: "Nunito, sans-serif", fontWeight: 600 }}
        >
          <Eye size={14} />
          View
        </button>
      </div>
    </div>
  );
}
