interface GreenPointsBadgeProps {
  points: number;
  size?: "sm" | "md" | "lg";
}

export function GreenPointsBadge({ points, size = "md" }: GreenPointsBadgeProps) {
  const sizeStyle = {
    sm: { padding: "0.2rem 0.6rem", fontSize: "0.75rem" },
    md: { padding: "0.3rem 0.8rem", fontSize: "0.85rem" },
    lg: { padding: "0.5rem 1.2rem", fontSize: "1.1rem" },
  }[size];

  return (
    <span
      className="inline-flex items-center gap-1 rounded-full"
      style={{
        backgroundColor: "#D8F3DC",
        color: "#2D6A4F",
        fontFamily: "Nunito, sans-serif",
        fontWeight: 800,
        ...sizeStyle,
      }}
    >
      🌿 {points.toLocaleString()} pts
    </span>
  );
}
