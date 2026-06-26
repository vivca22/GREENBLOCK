import { useState } from "react";
import { useNavigate } from "react-router";
import { Paintbrush } from "lucide-react";
import { FungiAvatar } from "../../../components/FungiAvatar";
import { ProgressBar } from "../../../components/ProgressBar";
import { GreenPointsBadge } from "../../../components/GreenPointsBadge";
import { useGame, type SkinType } from "../../../context/GameContext";

const ITEM_LABELS: Record<string, string> = {
  watering_can: "🪣 Regadera",
  uv_light: "💜 Luz UV",
  fertilizer: "⚡ Abono",
};

const SKINS: { key: SkinType; label: string }[] = [
  { key: "default", label: "Default" },
  { key: "blue", label: "Azul" },
  { key: "golden", label: "Dorado" },
  { key: "rainbow", label: "Arcoíris" },
];

export function HongoCard() {
  const navigate = useNavigate();
  const { points, stage, stageName, stageProgress, skin, setSkin, equippedItems } = useGame();
  const [customizeOpen, setCustomizeOpen] = useState(false);

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Avatar card */}
      <div
        className="w-full rounded-3xl p-8 flex flex-col items-center relative"
        style={{ backgroundColor: "#D8F3DC", border: "2px solid #95D5B2" }}
      >
        {/* Customize toggle */}
        <button
          onClick={() => setCustomizeOpen((o) => !o)}
          className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-opacity hover:opacity-80 shadow-sm"
          style={{ backgroundColor: customizeOpen ? "#1B4332" : "#2D6A4F" }}
          title="Personalizar"
        >
          <Paintbrush size={16} color="white" />
        </button>

        {/* Equipped items */}
        {equippedItems.length > 0 && (
          <div className="absolute top-4 left-4 flex flex-col gap-1">
            {equippedItems.map((item) => (
              <span
                key={item}
                className="text-xs px-2 py-0.5 rounded-full"
                style={{ backgroundColor: "#1B4332", color: "#95D5B2", fontWeight: 600 }}
              >
                {ITEM_LABELS[item] ?? item}
              </span>
            ))}
          </div>
        )}

        <FungiAvatar stage={stage} skin={skin} size={200} equippedItems={equippedItems} />

        <div className="mt-3 px-5 py-2 rounded-full" style={{ backgroundColor: "#2D6A4F" }}>
          <span style={{ color: "white", fontWeight: 800, fontSize: "1rem" }}>
            Etapa {stage}: {stageName}
          </span>
        </div>

        <div className="w-full mt-4">
          <ProgressBar current={stageProgress.current} max={stageProgress.max} label="para siguiente etapa" />
        </div>

        <GreenPointsBadge points={points} size="lg" />
      </div>

      {/* Customize panel */}
      {customizeOpen && (
        <div className="w-full rounded-2xl p-5" style={{ backgroundColor: "white", border: "1px solid #E5E7EB" }}>
          <p style={{ fontWeight: 800, color: "#1B4332", marginBottom: "1rem" }}>🎨 Personalizar skin</p>
          <div className="grid grid-cols-4 gap-3">
            {SKINS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setSkin(key)}
                className="rounded-xl p-2 flex flex-col items-center gap-1 transition-all hover:opacity-80"
                style={{
                  backgroundColor: key === skin ? "#D8F3DC" : "#F9FAFB",
                  border: key === skin ? "2px solid #52B788" : "2px solid transparent",
                }}
              >
                <FungiAvatar stage={stage} skin={key} size={48} />
                <span className="text-xs" style={{ color: "#374151", fontWeight: 600 }}>{label}</span>
              </button>
            ))}
          </div>
          <p className="text-xs mt-3 text-center" style={{ color: "#9CA3AF" }}>
            Desbloquea skins en la{" "}
            <button onClick={() => navigate("/tienda")} style={{ color: "#2D6A4F", fontWeight: 700 }}>
              Tienda
            </button>
          </p>
        </div>
      )}
    </div>
  );
}
