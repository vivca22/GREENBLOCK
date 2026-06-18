interface GreenPointsBadgeProps {
  points: number;
  size?: "sm" | "md" | "lg";
}

const coinSizePx = { sm: 16, md: 20, lg: 28 };

export function GPCoin({ size = 20, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Green Points"
    >
      {/* Drop shadow */}
      <ellipse cx="20" cy="37" rx="11" ry="3" fill="rgba(0,0,0,0.18)" />

      {/* Coin edge / depth */}
      <circle cx="20" cy="21" r="17" fill="#B8860B" />

      {/* Coin face */}
      <circle cx="20" cy="19" r="17" fill="url(#gpGold)" />

      {/* Inner rim */}
      <circle cx="20" cy="19" r="13.5" fill="none" stroke="#F5C518" strokeWidth="1.2" strokeDasharray="2.5 2" />

      {/* GP text */}
      <text
        x="20"
        y="24.5"
        textAnchor="middle"
        fontFamily="Nunito, Georgia, serif"
        fontWeight="900"
        fontSize="12"
        fill="#7A4F00"
        letterSpacing="-0.5"
      >
        GP
      </text>

      <defs>
        <radialGradient id="gpGold" cx="38%" cy="30%" r="65%" fx="38%" fy="30%">
          <stop offset="0%" stopColor="#FFE566" />
          <stop offset="45%" stopColor="#F5C518" />
          <stop offset="100%" stopColor="#C8860A" />
        </radialGradient>
      </defs>
    </svg>
  );
}

export function GreenPointsBadge({ points, size = "md" }: GreenPointsBadgeProps) {
  const sizeStyle = {
    sm: { padding: "0.2rem 0.6rem", fontSize: "0.75rem" },
    md: { padding: "0.3rem 0.8rem", fontSize: "0.85rem" },
    lg: { padding: "0.5rem 1.2rem", fontSize: "1.1rem" },
  }[size];

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full"
      style={{
        backgroundColor: "#D8F3DC",
        color: "#2D6A4F",
        fontFamily: "Nunito, sans-serif",
        fontWeight: 800,
        ...sizeStyle,
      }}
    >
      <GPCoin size={coinSizePx[size]} />
      {points.toLocaleString()} pts
    </span>
  );
}
