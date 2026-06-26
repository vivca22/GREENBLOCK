import { BookOpen, Camera, Users } from "lucide-react";
import { useGame } from "../../../context/GameContext";
import type { GreenUser } from "../../../context/AuthContext";
import { GPCoin } from "../../../components/GreenPointsBadge";

interface StatsGridProps {
  user: GreenUser;
}

export function StatsGrid({ user }: StatsGridProps) {
  const { points, lessonsCompleted, photosSent, referrals } = useGame();

  const stats = [
    {
      icon: <GPCoin size={16} />,
      label: "Green Points",
      value: points.toLocaleString(),
      bg: "#D8F3DC",
      color: "#1B4332",
    },
    {
      icon: <BookOpen size={20} color="#2563EB" />,
      label: "Lecciones completadas",
      value: String(lessonsCompleted),
      bg: "#DBEAFE",
      color: "#1D4ED8",
    },
    {
      icon: <Camera size={20} color="#7C3AED" />,
      label: "Fotos enviadas",
      value: String(photosSent),
      bg: "#EDE9FE",
      color: "#5B21B6",
    },
    {
      icon: <Users size={20} color="#D97706" />,
      label: "Amigos referidos",
      value: String(referrals),
      bg: "#FEF3C7",
      color: "#92400E",
    },
  ];

  const totalGrams = user.recyclingStats?.totalGrams ?? 0;
  const totalDeliveries = user.recyclingStats?.totalDeliveries ?? 0;

  return (
    <div className="flex flex-col gap-5">
      {/* User header */}
      <div
        className="flex items-center gap-4 p-4 rounded-2xl"
        style={{ backgroundColor: "white", border: "1px solid #E5E7EB" }}
      >
        <img
          src={user.photo}
          alt={user.name}
          className="w-14 h-14 rounded-full border-2 flex-shrink-0"
          style={{ borderColor: "#52B788" }}
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://ui-avatars.com/api/?name=" +
              encodeURIComponent(user.name) +
              "&background=52B788&color=fff&size=56";
          }}
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm" style={{ color: "#6B7280" }}>Hola,</p>
          <p style={{ fontWeight: 900, color: "#1B4332", fontSize: "1.3rem" }}>
            {user.name.split(" ")[0]}! 👋
          </p>
          {user.kitType && (
            <p className="text-xs" style={{ color: "#9CA3AF" }}>{user.kitType}</p>
          )}
        </div>

        {/* Recycling summary pill */}
        {totalDeliveries > 0 && (
          <div
            className="flex-shrink-0 flex flex-col items-center px-3 py-2 rounded-xl"
            style={{ backgroundColor: "#D8F3DC" }}
          >
            <span style={{ fontSize: "1.1rem" }}>♻️</span>
            <p style={{ fontWeight: 900, color: "#1B4332", fontSize: "1rem", lineHeight: 1.1 }}>
              {totalGrams >= 1000
                ? `${(totalGrams / 1000).toFixed(1)} kg`
                : `${totalGrams.toLocaleString()} g`}
            </p>
            <p style={{ fontSize: "0.65rem", color: "#52B788", fontWeight: 700 }}>
              {totalDeliveries} entrega{totalDeliveries !== 1 ? "s" : ""}
            </p>
          </div>
        )}
      </div>

      {/* Metric cards 2×2 */}
      <div className="grid grid-cols-2 gap-3">
        {stats.map((m) => (
          <div key={m.label} className="p-4 rounded-2xl" style={{ backgroundColor: m.bg }}>
            <div className="flex items-center gap-2 mb-1">
              {m.icon}
              <p className="text-xs" style={{ color: m.color, fontWeight: 600 }}>{m.label}</p>
            </div>
            <p style={{ fontSize: "2rem", fontWeight: 900, color: m.color, lineHeight: 1 }}>{m.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
