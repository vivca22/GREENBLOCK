/*
 * CONNECTIONS NEEDED:
 * - Firebase: import { db } from '../lib/firebase'
 * - Firestore: users/{uid} — read points, stage, equippedItems
 * - pointsLog subcollection for history
 */
import { useState } from "react";
import { useNavigate } from "react-router";
import { Paintbrush, Leaf, BookOpen, Camera, Users, Star } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useGame } from "../context/GameContext";
import { FungiAvatar } from "../components/FungiAvatar";
import { ProgressBar } from "../components/ProgressBar";
import { GreenPointsBadge } from "../components/GreenPointsBadge";

export function MiHongo() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { points, stage, stageName, stageProgress, skin, equippedItems, history, photosSent, referrals, lessonsCompleted } = useGame();
  const [customizeOpen, setCustomizeOpen] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#D8F3DC" }}>
        <div className="text-center">
          <p style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, color: "#1B4332" }}>Debes registrarte para ver tu hongo</p>
          <button onClick={() => navigate("/register")} className="mt-4 px-6 py-2 rounded-xl" style={{ backgroundColor: "#2D6A4F", color: "white", fontFamily: "Nunito, sans-serif", fontWeight: 700 }}>
            Registrarse
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4" style={{ backgroundColor: "#F8F4EF", fontFamily: "Nunito, sans-serif" }}>
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* LEFT COLUMN — Hongo */}
          <div className="flex flex-col items-center gap-4">
            <div
              className="w-full rounded-3xl p-8 flex flex-col items-center relative"
              style={{ backgroundColor: "#D8F3DC", border: "2px solid #95D5B2" }}
            >
              {/* Customize button */}
              <button
                onClick={() => setCustomizeOpen(!customizeOpen)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-opacity hover:opacity-80 shadow-sm"
                style={{ backgroundColor: "#2D6A4F" }}
              >
                <Paintbrush size={16} color="white" />
              </button>

              {/* Equipped item badges */}
              {equippedItems.length > 0 && (
                <div className="absolute top-4 left-4 flex flex-col gap-1">
                  {equippedItems.map((item) => (
                    <span key={item} className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: "#1B4332", color: "#95D5B2", fontWeight: 600 }}>
                      {item === "watering_can" ? "🪣 Regadera" : item === "uv_light" ? "💜 Luz UV" : item === "fertilizer" ? "⚡ Abono" : item}
                    </span>
                  ))}
                </div>
              )}

              <FungiAvatar stage={stage} skin={skin} size={200} equippedItems={equippedItems} />

              {/* Stage badge */}
              <div className="mt-3 px-5 py-2 rounded-full" style={{ backgroundColor: "#2D6A4F" }}>
                <span style={{ color: "white", fontWeight: 800, fontSize: "1rem" }}>
                  Etapa {stage}: {stageName}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full mt-4">
                <ProgressBar
                  current={stageProgress.current}
                  max={stageProgress.max}
                  label={`para siguiente etapa`}
                />
              </div>

              <GreenPointsBadge points={points} size="lg" />
            </div>

            {/* Customize panel */}
            {customizeOpen && (
              <div className="w-full rounded-2xl p-5" style={{ backgroundColor: "white", border: "1px solid #E5E7EB" }}>
                <p style={{ fontWeight: 800, color: "#1B4332", marginBottom: "1rem" }}>🎨 Personalizar skin</p>
                <div className="grid grid-cols-4 gap-3">
                  {(["default", "blue", "golden", "rainbow"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => {}}
                      className="rounded-xl p-2 flex flex-col items-center gap-1 transition-opacity hover:opacity-80"
                      style={{
                        backgroundColor: s === skin ? "#D8F3DC" : "#F9FAFB",
                        border: s === skin ? "2px solid #52B788" : "2px solid transparent",
                      }}
                    >
                      <FungiAvatar stage={stage} skin={s} size={48} />
                      <span className="text-xs" style={{ color: "#374151", fontWeight: 600, textTransform: "capitalize" }}>{s}</span>
                    </button>
                  ))}
                </div>
                <p className="text-xs mt-3 text-center" style={{ color: "#9CA3AF" }}>
                  Desbloquea skins en la{" "}
                  <button onClick={() => navigate("/tienda")} style={{ color: "#2D6A4F", fontWeight: 700 }}>Tienda</button>
                </p>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN — Stats */}
          <div className="flex flex-col gap-5">
            {/* User header */}
            <div className="flex items-center gap-4 p-4 rounded-2xl" style={{ backgroundColor: "white", border: "1px solid #E5E7EB" }}>
              <img
                src={user.photo}
                alt={user.name}
                className="w-14 h-14 rounded-full border-2"
                style={{ borderColor: "#52B788" }}
                onError={(e) => { (e.target as HTMLImageElement).src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.name) + "&background=52B788&color=fff&size=56"; }}
              />
              <div>
                <p className="text-sm" style={{ color: "#6B7280" }}>Hola,</p>
                <p style={{ fontWeight: 900, color: "#1B4332", fontSize: "1.3rem" }}>{user.name.split(" ")[0]}! 👋</p>
                <p className="text-xs" style={{ color: "#9CA3AF" }}>{user.kitType}</p>
              </div>
            </div>

            {/* Metric cards 2x2 */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: <Leaf size={20} color="#2D6A4F" />, label: "Green Points", value: points.toLocaleString(), bg: "#D8F3DC", color: "#1B4332" },
                { icon: <BookOpen size={20} color="#2563EB" />, label: "Lecciones completadas", value: String(lessonsCompleted), bg: "#DBEAFE", color: "#1D4ED8" },
                { icon: <Camera size={20} color="#7C3AED" />, label: "Fotos enviadas", value: String(photosSent), bg: "#EDE9FE", color: "#5B21B6" },
                { icon: <Users size={20} color="#D97706" />, label: "Amigos referidos", value: String(referrals), bg: "#FEF3C7", color: "#92400E" },
              ].map((m) => (
                <div key={m.label} className="p-4 rounded-2xl" style={{ backgroundColor: m.bg }}>
                  <div className="flex items-center gap-2 mb-1">
                    {m.icon}
                    <p className="text-xs" style={{ color: m.color, fontWeight: 600 }}>{m.label}</p>
                  </div>
                  <p style={{ fontSize: "2rem", fontWeight: 900, color: m.color, lineHeight: 1 }}>{m.value}</p>
                </div>
              ))}
            </div>

            {/* Historial reciente */}
            <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "white", border: "1px solid #E5E7EB" }}>
              <div className="px-5 py-3" style={{ borderBottom: "1px solid #F3F4F6" }}>
                <p style={{ fontWeight: 800, color: "#1B4332" }}>Historial reciente</p>
              </div>
              <div className="divide-y" style={{ borderColor: "#F3F4F6" }}>
                {history.slice(0, 5).map((item) => (
                  <div key={item.id} className="flex items-center justify-between px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: "#F3F4F6", fontSize: "1rem" }}
                      >
                        {item.icon}
                      </div>
                      <p className="text-sm" style={{ color: "#374151", fontWeight: 500 }}>{item.text}</p>
                    </div>
                    <span
                      className="flex-shrink-0 ml-2 px-2 py-0.5 rounded-full text-xs"
                      style={{ backgroundColor: "#D8F3DC", color: "#2D6A4F", fontWeight: 700 }}
                    >
                      +{item.points} pts
                    </span>
                  </div>
                ))}
              </div>
              <div className="px-5 py-3 text-center">
                <button className="text-xs" style={{ color: "#2D6A4F", fontWeight: 600 }}>Ver todo el historial →</button>
              </div>
            </div>

            {/* Quick actions */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => navigate("/aprende")}
                className="p-3 rounded-2xl flex items-center gap-2 transition-opacity hover:opacity-80"
                style={{ backgroundColor: "#2D6A4F", color: "white" }}
              >
                <BookOpen size={18} />
                <span style={{ fontWeight: 700, fontSize: "0.9rem" }}>Aprender →</span>
              </button>
              <button
                onClick={() => navigate("/tienda")}
                className="p-3 rounded-2xl flex items-center gap-2 transition-opacity hover:opacity-80"
                style={{ backgroundColor: "#D8F3DC", color: "#2D6A4F" }}
              >
                <Star size={18} />
                <span style={{ fontWeight: 700, fontSize: "0.9rem" }}>Tienda →</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
