import { Trophy } from "lucide-react";
import { RecyclingLeaderboard } from "../../../components/RecyclingLeaderboard";
import { SectionBadge } from "../shared";

export function LeaderboardSection() {
  return (
    <section className="w-full py-16 px-4" style={{ backgroundColor: "#F8F4EF" }}>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <SectionBadge text="Comunidad" color="#FEF3C7" textColor="#92400E" icon={Trophy} />
          <h2 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, color: "#1B4332", fontSize: "clamp(1.6rem, 4vw, 2.2rem)", lineHeight: 1.2, marginBottom: "0.5rem" }}>
            Tabla de clasificación
          </h2>
          <p className="text-sm max-w-sm mx-auto" style={{ color: "#6B7280", lineHeight: 1.6 }}>
            Los estudiantes que más plástico han reciclado con sus kits Green Block.
          </p>
        </div>

        <div
          className="rounded-3xl p-6"
          style={{
            backgroundColor: "white",
            border: "3px solid #E5E7EB",
            boxShadow: "0 4px 0 #E5E7EB, 0 12px 32px rgba(0,0,0,0.06)",
          }}
        >
          <RecyclingLeaderboard limitCount={10} />
        </div>
      </div>
    </section>
  );
}
