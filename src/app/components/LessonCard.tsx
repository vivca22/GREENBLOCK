import { Lock, CheckCircle, PlayCircle, Trophy } from "lucide-react";

type ModuleStatus = "completed" | "available" | "locked";

interface LessonCardProps {
  id: string;
  title: string;
  description: string;
  status: ModuleStatus;
  lessonCount: number;
  hasQuiz: boolean;
  points: number;
  color: string;
  imagePlaceholder: string;
  claimed?: boolean;
  onStart: (id: string) => void;
}

export function LessonCard({ id, title, description, status, lessonCount, hasQuiz, points, color, imagePlaceholder, claimed, onStart }: LessonCardProps) {
  return (
    <div
      className="rounded-2xl overflow-hidden flex flex-col"
      style={{
        backgroundColor: color,
        opacity: status === "locked" ? 0.65 : 1,
        border: status === "completed" ? "2px solid #52B788" : "2px solid transparent",
      }}
    >
      {/* Image placeholder */}
      <div
        className="h-32 flex items-center justify-center relative"
        style={{ backgroundColor: `${color}cc`, borderBottom: "1px solid rgba(0,0,0,0.06)" }}
      >
        {status === "completed" && (
          <span
            className="absolute top-2 right-2 inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-full"
            style={{ backgroundColor: "#2D6A4F", color: "white", fontWeight: 800 }}
          >
            <Trophy size={12} /> Completado
          </span>
        )}
        <div className="text-center">
          <div className="text-3xl mb-1">🌿</div>
          <p className="text-xs px-3" style={{ color: "rgba(0,0,0,0.4)", fontFamily: "Nunito, sans-serif" }}>{imagePlaceholder}</p>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            {status === "completed" && (
              <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full mb-1" style={{ backgroundColor: "#D8F3DC", color: "#2D6A4F", fontWeight: 700 }}>
                <CheckCircle size={10} /> Completado
              </span>
            )}
            {status === "available" && (
              <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full mb-1" style={{ backgroundColor: "#FEF3C7", color: "#92400E", fontWeight: 700 }}>
                Disponible
              </span>
            )}
            {status === "locked" && (
              <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full mb-1" style={{ backgroundColor: "#F3F4F6", color: "#9CA3AF", fontWeight: 700 }}>
                <Lock size={10} /> Bloqueado
              </span>
            )}
            <h3 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, color: "#1B4332", fontSize: "0.95rem", lineHeight: 1.3 }}>{title}</h3>
          </div>
        </div>

        <p className="text-sm flex-1 mb-3" style={{ color: "#4B5563", lineHeight: 1.5 }}>{description}</p>

        <div className="flex items-center justify-between">
          <p className="text-xs" style={{ color: "#6B7280", fontFamily: "Nunito, sans-serif" }}>
            {lessonCount} lecciones · {hasQuiz ? "1 quiz · " : ""}
            {claimed ? (
              <span style={{ backgroundColor: "#F3F4F6", color: "#9CA3AF", padding: "1px 7px", borderRadius: "999px", fontWeight: 700 }}>
                ✓ Puntos reclamados
              </span>
            ) : (
              <strong style={{ color: "#2D6A4F" }}>+{points} pts</strong>
            )}
          </p>
          {status !== "locked" && (
            <button
              onClick={() => onStart(id)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-sm transition-opacity hover:opacity-80"
              style={{ backgroundColor: "#2D6A4F", color: "white", fontFamily: "Nunito, sans-serif", fontWeight: 700 }}
            >
              <PlayCircle size={14} />
              {status === "completed" ? "Repasar" : "Empezar →"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
