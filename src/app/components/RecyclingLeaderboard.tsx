import { useState, useEffect } from "react";
import { collection, getDocs, orderBy, query, limit } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { LoadingSpinner } from "./LoadingSpinner";

interface LeaderEntry {
  uid: string;
  name: string;
  photo: string;
  totalGrams: number;
  totalDeliveries: number;
}

function formatGrams(g: number): string {
  return g >= 1000 ? `${(g / 1000).toFixed(1)} kg` : `${g.toLocaleString()} g`;
}

function Avatar({ entry, size = 56, border }: { entry: LeaderEntry; size?: number; border: string }) {
  const initials = entry.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div
      style={{
        width: size, height: size, borderRadius: "50%", overflow: "hidden",
        border: `3px solid ${border}`, flexShrink: 0, display: "flex",
        alignItems: "center", justifyContent: "center",
        backgroundColor: "#D8F3DC", fontSize: size * 0.35,
        fontWeight: 900, color: "#1B4332",
      }}
    >
      {entry.photo ? (
        <img
          src={entry.photo}
          alt={entry.name}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
        />
      ) : initials}
    </div>
  );
}

const PODIUM = [
  { medal: "🥇", bg: "linear-gradient(160deg,#FDE68A,#F59E0B)", border: "#D97706", textColor: "#92400E", rank: 1, height: 90, zIndex: 3 },
  { medal: "🥈", bg: "linear-gradient(160deg,#E5E7EB,#9CA3AF)", border: "#6B7280", textColor: "#374151", rank: 2, height: 64, zIndex: 2 },
  { medal: "🥉", bg: "linear-gradient(160deg,#FDBA74,#D97706)", border: "#B45309", textColor: "#92400E", rank: 3, height: 48, zIndex: 1 },
];

// Display order: 2nd, 1st, 3rd
const DISPLAY_ORDER = [1, 0, 2];

interface RecyclingLeaderboardProps {
  limitCount?: number;
}

export function RecyclingLeaderboard({ limitCount = 10 }: RecyclingLeaderboardProps) {
  const [entries, setEntries] = useState<LeaderEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDocs(
      query(collection(db, "leaderboard"), orderBy("totalGrams", "desc"), limit(limitCount))
    )
      .then((snap) => {
        setEntries(
          snap.docs.map((d) => ({
            uid: d.id,
            name: (d.data().name as string) || "Usuario",
            photo: (d.data().photo as string) || "",
            totalGrams: (d.data().totalGrams as number) || 0,
            totalDeliveries: (d.data().totalDeliveries as number) || 0,
          }))
        );
      })
      .catch(() => setEntries([]))
      .finally(() => setLoading(false));
  }, [limitCount]);

  const top3 = entries.slice(0, 3);
  const rest = entries.slice(3);
  const maxGrams = entries[0]?.totalGrams || 1;

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12 gap-2 text-sm" style={{ color: "#9CA3AF" }}>
        <LoadingSpinner size={16} /> Cargando clasificación...
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="py-12 text-center" style={{ color: "#9CA3AF" }}>
        <p style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🌱</p>
        <p style={{ fontWeight: 700 }}>Aún no hay reciclajes registrados. ¡Sé el primero!</p>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "Nunito, sans-serif" }}>
      {/* ─── Podium ─────────────────────────────────────────────────── */}
      {top3.length > 0 && (
        <div className="flex items-end justify-center gap-4 mb-8" style={{ minHeight: 220 }}>
          {DISPLAY_ORDER.map((podiumIndex) => {
            const p = PODIUM[podiumIndex];
            const entry = top3[podiumIndex];
            if (!entry) return null;
            return (
              <div key={p.rank} className="flex flex-col items-center" style={{ zIndex: p.zIndex, flex: "0 0 auto", width: 110 }}>
                {/* Medal */}
                <span style={{ fontSize: "1.6rem", marginBottom: "0.35rem" }}>{p.medal}</span>

                {/* Avatar */}
                <Avatar entry={entry} size={p.rank === 1 ? 68 : 56} border={p.border} />

                {/* Name */}
                <p
                  className="text-center mt-2 px-1 truncate w-full"
                  style={{ fontWeight: 800, color: "#1B4332", fontSize: "0.78rem", maxWidth: 100 }}
                >
                  {entry.name.split(" ")[0]}
                </p>

                {/* Weight */}
                <p style={{ fontWeight: 900, color: p.textColor, fontSize: p.rank === 1 ? "1rem" : "0.88rem" }}>
                  {formatGrams(entry.totalGrams)}
                </p>

                {/* Platform */}
                <div
                  className="w-full mt-2 flex items-center justify-center rounded-t-xl"
                  style={{
                    height: p.height,
                    background: p.bg,
                    border: `3px solid ${p.border}`,
                    borderBottom: "none",
                    boxShadow: `0 -4px 12px ${p.border}44`,
                  }}
                >
                  <span style={{ fontWeight: 900, fontSize: "1.4rem", color: p.textColor }}>{p.rank}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ─── Rest of ranking ─────────────────────────────────────────── */}
      {rest.length > 0 && (
        <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid #E5E7EB" }}>
          {rest.map((entry, i) => {
            const rank = i + 4;
            const barWidth = Math.round((entry.totalGrams / maxGrams) * 100);
            return (
              <div
                key={entry.uid}
                className="flex items-center gap-3 px-4 py-3"
                style={{ borderBottom: i < rest.length - 1 ? "1px solid #F3F4F6" : "none", backgroundColor: "white" }}
              >
                <span style={{ fontWeight: 900, color: "#9CA3AF", fontSize: "0.85rem", width: 20, textAlign: "center", flexShrink: 0 }}>
                  {rank}
                </span>
                <Avatar entry={entry} size={36} border="#E5E7EB" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="truncate text-sm" style={{ fontWeight: 700, color: "#374151" }}>
                      {entry.name.split(" ")[0]} {entry.name.split(" ")[1]?.[0] ? entry.name.split(" ")[1][0] + "." : ""}
                    </p>
                    <p style={{ fontWeight: 800, color: "#2D6A4F", fontSize: "0.85rem", flexShrink: 0 }}>
                      {formatGrams(entry.totalGrams)}
                    </p>
                  </div>
                  <div className="w-full rounded-full overflow-hidden" style={{ height: 6, backgroundColor: "#F3F4F6" }}>
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${barWidth}%`, background: "linear-gradient(90deg,#52B788,#2D6A4F)", transition: "width 0.6s ease" }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
