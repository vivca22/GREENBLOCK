import { useGame } from "../../../context/GameContext";
import { LessonCard } from "../../../components/LessonCard";
import type { Course } from "../../Aprende";

interface ModuleGridProps {
  courses: Course[];
  onStart: (courseId: string) => void;
}

const CATEGORY_EMOJI: Record<string, string> = {
  fungi: "🍄",
  recycling: "♻️",
  care: "🌱",
  environment: "🌊",
  science: "🔬",
};

export function ModuleGrid({ courses, onStart }: ModuleGridProps) {
  const { completedLessons } = useGame();

  const getStatus = (courseId: string, index: number): "completed" | "available" | "locked" => {
    if (completedLessons.includes(courseId)) return "completed";
    if (index === 0) return "available";
    const prevId = courses[index - 1]?.id;
    if (prevId && completedLessons.includes(prevId)) return "available";
    return "locked";
  };

  if (courses.length === 0) {
    return (
      <div className="text-center py-20" style={{ color: "#9CA3AF" }}>
        <p style={{ fontSize: "3rem", marginBottom: "0.75rem" }}>📭</p>
        <p style={{ fontWeight: 600 }}>No hay módulos publicados aún.</p>
      </div>
    );
  }

  const completedCount = courses.filter((c) => completedLessons.includes(c.id)).length;
  const totalPoints = courses.reduce((s, c) => s + (c.completionBonus || 0), 0);

  return (
    <div>
      {/* Progress summary */}
      <div className="flex items-center gap-4 mb-6 p-4 rounded-2xl" style={{ backgroundColor: "white", border: "1px solid #E5E7EB" }}>
        <div className="flex-1">
          <p style={{ fontWeight: 700, color: "#1B4332", fontSize: "0.9rem" }}>
            {completedCount} de {courses.length} módulos completados
          </p>
          <div className="mt-2 h-2 rounded-full overflow-hidden" style={{ backgroundColor: "#E5E7EB" }}>
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${courses.length ? (completedCount / courses.length) * 100 : 0}%`, backgroundColor: "#52B788" }}
            />
          </div>
        </div>
        <div className="text-right">
          <p style={{ fontSize: "1.4rem", fontWeight: 900, color: "#2D6A4F" }}>
            {courses.filter((c) => completedLessons.includes(c.id)).reduce((s, c) => s + (c.completionBonus || 0), 0)} pts
          </p>
          <p style={{ fontSize: "0.7rem", color: "#9CA3AF", fontWeight: 600 }}>de {totalPoints} posibles</p>
        </div>
      </div>

      {/* Course grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {courses.map((course, i) => {
          const emoji = CATEGORY_EMOJI[course.category as string] ?? "🌿";
          return (
            <LessonCard
              key={course.id}
              id={course.id}
              title={course.title}
              description={course.description}
              status={getStatus(course.id, i)}
              lessonCount={course.lessons?.length ?? 0}
              hasQuiz={!!course.quiz}
              points={course.completionBonus ?? 0}
              color={course.color ?? "#D8F3DC"}
              imagePlaceholder={`${emoji} ${course.title}`}
              claimed={completedLessons.includes(course.id)}
              onStart={onStart}
            />
          );
        })}
      </div>
    </div>
  );
}
