type Status = "created" | "packed" | "shipped" | "delivered";

const statusConfig: Record<Status, { label: string; bg: string; color: string }> = {
  created: { label: "Created", bg: "#DBEAFE", color: "#1D4ED8" },
  packed: { label: "Packed", bg: "#FEF9C3", color: "#854D0E" },
  shipped: { label: "Shipped", bg: "#FFEDD5", color: "#9A3412" },
  delivered: { label: "Delivered", bg: "#D8F3DC", color: "#2D6A4F" },
};

interface StatusBadgeProps {
  status: Status;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const cfg = statusConfig[status] ?? statusConfig.created;
  return (
    <span
      className="inline-block px-3 py-1 rounded-full text-xs"
      style={{ backgroundColor: cfg.bg, color: cfg.color, fontFamily: "Nunito, sans-serif", fontWeight: 700 }}
    >
      {cfg.label}
    </span>
  );
}
