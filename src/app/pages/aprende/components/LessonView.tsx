import { ChevronRight } from "lucide-react";
import { ProgressBar } from "../../../components/ProgressBar";
import type { Course } from "../../Aprende";

function getYouTubeEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    let videoId: string | null = null;
    if (parsed.hostname === "youtu.be") {
      videoId = parsed.pathname.slice(1).split("?")[0];
    } else if (parsed.hostname.includes("youtube.com")) {
      if (parsed.pathname.startsWith("/embed/")) return url; // already embed
      videoId = parsed.searchParams.get("v");
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  } catch {
    return null;
  }
}

interface LessonViewProps {
  course: Course;
  lessonIndex: number;
  onNext: () => void;
}

export function LessonView({ course, lessonIndex, onNext }: LessonViewProps) {
  const lesson = course.lessons[lessonIndex];
  const isLastLesson = lessonIndex === course.lessons.length - 1;

  if (!lesson) return null;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-sm" style={{ color: "#6B7280" }}>
            Lección {lessonIndex + 1} de {course.lessons.length}
          </p>
          <p className="text-sm" style={{ color: "#2D6A4F", fontWeight: 700 }}>
            +{course.completionBonus} pts al completar
          </p>
        </div>
        <ProgressBar current={lessonIndex + 1} max={course.lessons.length} />
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "white", border: "1px solid #E5E7EB" }}>
        {/* Header image area */}
        <div
          className="h-44 flex items-center justify-center"
          style={{ backgroundColor: course.color ?? "#D8F3DC" }}
        >
          <div className="text-center">
            <div className="text-5xl mb-2">🌿</div>
            <p className="text-xs" style={{ color: "rgba(0,0,0,0.35)", fontFamily: "Nunito" }}>
              {course.title}
            </p>
          </div>
        </div>

        <div className="p-6">
          <h2 style={{ fontWeight: 800, color: "#1B4332", fontSize: "1.2rem", marginBottom: "1.25rem" }}>
            {lesson.title}
          </h2>

          {/* Content paragraphs */}
          {lesson.content.map((paragraph, i) => (
            <p key={i} className="text-sm mb-4" style={{ color: "#374151", lineHeight: 1.75 }}>
              {paragraph}
            </p>
          ))}

          {/* Video — only rendered if videoUrl is set */}
          {lesson.videoUrl && (() => {
            const embedUrl = getYouTubeEmbedUrl(lesson.videoUrl!);
            if (embedUrl) {
              return (
                <div className="mb-5 rounded-xl overflow-hidden" style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
                  <iframe
                    src={embedUrl}
                    title={lesson.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                    style={{
                      position: "absolute", top: 0, left: 0,
                      width: "100%", height: "100%",
                      border: 0, borderRadius: "12px",
                    }}
                  />
                </div>
              );
            }
            // Fallback for direct video files
            return (
              <div className="rounded-xl overflow-hidden mb-5">
                <video src={lesson.videoUrl} controls className="w-full" style={{ borderRadius: "12px" }} />
              </div>
            );
          })()}

          <button
            onClick={onNext}
            className="w-full py-3 rounded-xl transition-opacity hover:opacity-80"
            style={{ backgroundColor: "#2D6A4F", color: "white", fontWeight: 700, fontSize: "0.95rem" }}
          >
            {isLastLesson ? "Ir al Quiz →" : "Siguiente lección →"}
          </button>
        </div>
      </div>
    </div>
  );
}
