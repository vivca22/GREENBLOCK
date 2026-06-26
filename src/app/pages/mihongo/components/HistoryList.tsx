import { useState, useEffect } from "react";
import { collection, getDocs, orderBy, query, limit } from "firebase/firestore";
import { db } from "../../../../lib/firebase";
import { useAuth } from "../../../context/AuthContext";
import { useGame } from "../../../context/GameContext";
import { LoadingSpinner } from "../../../components/LoadingSpinner";

interface DisplayItem {
  id: string;
  icon: string;
  text: string;
  points: number;
  dateLabel: string;
  timestampMs: number;
}

const PLASTIC_ICONS: Record<string, string> = {
  PET: "🧴",
  HDPE: "🪣",
  LDPE: "🛍️",
  PP: "🥡",
  mixed: "♻️",
};

function formatRelativeDate(ms: number): string {
  const diffMs = Date.now() - ms;
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffDays === 0) return "Hoy";
  if (diffDays === 1) return "Ayer";
  if (diffDays < 7) return `Hace ${diffDays} días`;
  return new Date(ms).toLocaleDateString("es-EC", { day: "2-digit", month: "short" });
}

export function HistoryList() {
  const { user } = useAuth();
  const { history: gameHistory } = useGame();
  const [firestoreItems, setFirestoreItems] = useState<DisplayItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) { setLoading(false); return; }
    getDocs(
      query(
        collection(db, "users", user.uid, "pointsHistory"),
        orderBy("createdAt", "desc"),
        limit(20)
      )
    )
      .then((snap) => {
        const items: DisplayItem[] = snap.docs.map((d) => {
          const data = d.data();
          const ms = data.createdAt?.seconds ? data.createdAt.seconds * 1000 : Date.now();
          const plasticIcon = PLASTIC_ICONS[data.plasticType] ?? "♻️";
          return {
            id: d.id,
            icon: plasticIcon,
            text: `Reciclaje: ${data.weightGrams?.toLocaleString()}g de ${data.plasticType ?? "plástico"}`,
            points: data.amount ?? 0,
            dateLabel: formatRelativeDate(ms),
            timestampMs: ms,
          };
        });
        setFirestoreItems(items);
      })
      .catch(() => setFirestoreItems([]))
      .finally(() => setLoading(false));
  }, [user?.uid]);

  // Merge: Firestore items (real timestamps) + game history (approximate)
  const gameItems: DisplayItem[] = gameHistory.map((h, i) => ({
    id: h.id,
    icon: h.icon,
    text: h.text,
    points: h.points,
    dateLabel: h.date,
    timestampMs: Date.now() - i * 60000, // approximate ordering
  }));

  const merged = [...firestoreItems, ...gameItems]
    .sort((a, b) => b.timestampMs - a.timestampMs)
    .slice(0, 8);

  return (
    <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "white", border: "1px solid #E5E7EB" }}>
      <div className="px-5 py-3 flex items-center justify-between" style={{ borderBottom: "1px solid #F3F4F6" }}>
        <p style={{ fontWeight: 800, color: "#1B4332" }}>Historial reciente</p>
        {loading && <LoadingSpinner size={14} />}
      </div>

      {merged.length === 0 && !loading ? (
        <div className="px-5 py-8 text-center" style={{ color: "#9CA3AF" }}>
          <p style={{ fontSize: "1.5rem", marginBottom: "0.4rem" }}>📭</p>
          <p className="text-sm" style={{ fontWeight: 600 }}>Sin actividad aún</p>
        </div>
      ) : (
        <div>
          {merged.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between px-5 py-3"
              style={{ borderBottom: "1px solid #F9FAFB" }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "#F3F4F6", fontSize: "1rem" }}
                >
                  {item.icon}
                </div>
                <div className="min-w-0">
                  <p className="text-sm truncate" style={{ color: "#374151", fontWeight: 500 }}>
                    {item.text}
                  </p>
                  <p className="text-xs" style={{ color: "#9CA3AF" }}>{item.dateLabel}</p>
                </div>
              </div>
              <span
                className="flex-shrink-0 ml-3 px-2 py-0.5 rounded-full text-xs"
                style={{ backgroundColor: "#D8F3DC", color: "#2D6A4F", fontWeight: 700 }}
              >
                +{item.points} pts
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
