import { useNavigate } from "react-router";
import { BookOpen, Star } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { HongoCard } from "./mihongo/components/HongoCard";
import { StatsGrid } from "./mihongo/components/StatsGrid";
import { HistoryList } from "./mihongo/components/HistoryList";

export function MiHongo() {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#D8F3DC" }}>
        <div className="text-center" style={{ fontFamily: "Nunito, sans-serif" }}>
          <p style={{ fontWeight: 700, color: "#1B4332" }}>Debes registrarte para ver tu hongo</p>
          <button
            onClick={() => navigate("/register")}
            className="mt-4 px-6 py-2 rounded-xl"
            style={{ backgroundColor: "#2D6A4F", color: "white", fontWeight: 700 }}
          >
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

          {/* LEFT — Hongo avatar + customize */}
          <HongoCard />

          {/* RIGHT — Stats, history, quick actions */}
          <div className="flex flex-col gap-5">
            <StatsGrid user={user} />
            <HistoryList />

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
