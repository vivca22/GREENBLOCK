import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useGame } from "../../../context/GameContext";
import type { Course } from "../../Aprende";

interface QuizViewProps {
  course: Course;
  onFinish: () => void;
  onBack: () => void;
}

export function QuizView({ course, onFinish, onBack }: QuizViewProps) {
  const { addPoints, completeLesson, completedLessons } = useGame();
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);
  const [showPoints, setShowPoints] = useState(false);

  const quiz = course.quiz;
  const alreadyCompleted = completedLessons.includes(course.id);

  if (!quiz) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12" style={{ color: "#9CA3AF" }}>
        <p style={{ fontWeight: 600 }}>Este módulo no tiene quiz todavía.</p>
        <button onClick={onFinish} className="mt-4 px-6 py-2 rounded-xl" style={{ backgroundColor: "#2D6A4F", color: "white", fontWeight: 700 }}>
          Volver a módulos
        </button>
      </div>
    );
  }

  const checkAnswer = () => {
    if (selectedOption === null) return;
    const isCorrect = quiz.correctIndex === selectedOption;
    setResult(isCorrect ? "correct" : "wrong");
    if (isCorrect && !alreadyCompleted) {
      setShowPoints(true);
      addPoints(quiz.points, `Quiz: ${course.title}`, "🧠");
      completeLesson(course.id);
      setTimeout(() => setShowPoints(false), 2500);
    }
  };

  const borderColor = result === "correct" ? "#52B788" : result === "wrong" ? "#FECACA" : "#E5E7EB";
  const bgColor = result === "correct" ? "#D8F3DC" : result === "wrong" ? "#FEF2F2" : "white";

  return (
    <div className="max-w-2xl mx-auto">
      <div
        className="rounded-2xl p-6"
        style={{ backgroundColor: bgColor, border: `2px solid ${borderColor}`, transition: "all 0.3s ease" }}
      >
        {/* Quiz header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 flex-wrap mb-3">
            <span
              className="inline-block text-xs px-3 py-1 rounded-full"
              style={{ backgroundColor: "#D8F3DC", color: "#2D6A4F", fontWeight: 700 }}
            >
              Quiz · {course.title}
            </span>
            {alreadyCompleted ? (
              <span
                className="inline-block text-xs px-3 py-1 rounded-full"
                style={{ backgroundColor: "#FEF3C7", color: "#92400E", fontWeight: 700 }}
              >
                ✅ Ya completado · sin puntos adicionales
              </span>
            ) : (
              <span
                className="inline-block text-xs px-3 py-1 rounded-full"
                style={{ backgroundColor: "#D8F3DC", color: "#2D6A4F", fontWeight: 700 }}
              >
                +{quiz.points} pts si aciertas
              </span>
            )}
          </div>
          <h2 style={{ fontWeight: 800, color: "#1B4332", fontSize: "1.15rem", lineHeight: 1.45 }}>
            {quiz.question}
          </h2>
        </div>

        {/* Options */}
        <div className="flex flex-col gap-3 mb-6">
          {quiz.options.map((option, i) => {
            const isSelected = selectedOption === i;
            const isCorrect = quiz.correctIndex === i;
            const revealed = result !== null;

            let bg = "white";
            let border = "#E5E7EB";
            let color = "#374151";
            let dotBg = "#F3F4F6";
            let dotColor = "#9CA3AF";

            if (revealed && isCorrect) { bg = "#D8F3DC"; border = "#52B788"; color = "#1B4332"; dotBg = "#2D6A4F"; dotColor = "white"; }
            else if (revealed && isSelected && !isCorrect) { bg = "#FEF2F2"; border = "#FECACA"; color = "#DC2626"; dotBg = "#FCA5A5"; dotColor = "white"; }
            else if (!revealed && isSelected) { bg = "#D8F3DC"; border = "#52B788"; color = "#1B4332"; dotBg = "#2D6A4F"; dotColor = "white"; }

            return (
              <button
                key={i}
                onClick={() => !result && setSelectedOption(i)}
                disabled={result !== null}
                className="flex items-center gap-3 p-4 rounded-xl text-left transition-all"
                style={{ backgroundColor: bg, border: `2px solid ${border}`, color, cursor: result ? "default" : "pointer" }}
              >
                <div
                  className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs"
                  style={{ backgroundColor: dotBg, color: dotColor, fontWeight: 700 }}
                >
                  {["A", "B", "C", "D"][i]}
                </div>
                <span style={{ fontWeight: 600 }}>{option}</span>
              </button>
            );
          })}
        </div>

        {/* Points flash */}
        <AnimatePresence>
          {showPoints && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="text-center mb-4"
            >
              <span style={{ fontSize: "2rem", fontWeight: 900, color: "#2D6A4F" }}>
                +{quiz.points} puntos! 🎉
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Result messages */}
        {result === "correct" && (
          <div className="text-center mb-4 p-3 rounded-xl" style={{ backgroundColor: "#2D6A4F" }}>
            <p style={{ color: "white", fontWeight: 700 }}>¡Correcto! ✓</p>
          </div>
        )}
        {result === "wrong" && (
          <div className="text-center mb-4 p-3 rounded-xl" style={{ backgroundColor: "#FEF2F2", border: "1px solid #FECACA" }}>
            <p style={{ color: "#DC2626", fontWeight: 700 }}>
              Incorrecto — la respuesta correcta era: <em>{quiz.options[quiz.correctIndex]}</em>
            </p>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-3">
          {result === null ? (
            <>
              <button
                onClick={onBack}
                className="px-4 py-3 rounded-xl transition-opacity hover:opacity-70"
                style={{ backgroundColor: "#F3F4F6", color: "#374151", fontWeight: 600 }}
              >
                ← Repasar
              </button>
              <button
                onClick={checkAnswer}
                disabled={selectedOption === null}
                className="flex-1 py-3 rounded-xl transition-opacity hover:opacity-80"
                style={{
                  backgroundColor: selectedOption !== null ? "#2D6A4F" : "#E5E7EB",
                  color: selectedOption !== null ? "white" : "#9CA3AF",
                  fontWeight: 700,
                }}
              >
                Comprobar respuesta
              </button>
            </>
          ) : (
            <button
              onClick={onFinish}
              className="flex-1 py-3 rounded-xl transition-opacity hover:opacity-80"
              style={{ backgroundColor: "#2D6A4F", color: "white", fontWeight: 700 }}
            >
              Volver a módulos →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
