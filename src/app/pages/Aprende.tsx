import { useState, useEffect } from "react";
import { Navigate } from "react-router";
import { collection, getDocs } from "firebase/firestore";
import { ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useAuth } from "../context/AuthContext";
import { db } from "../../lib/firebase";
import { ModuleGrid } from "./aprende/components/ModuleGrid";
import { LessonView } from "./aprende/components/LessonView";
import { QuizView } from "./aprende/components/QuizView";

export interface CourseLesson {
  id: string;
  title: string;
  content: string[];
  videoUrl: string | null;
  order: number;
}

export interface CourseQuiz {
  question: string;
  options: string[];
  correctIndex: number;
  points: number;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category?: string;
  color: string;
  order: number;
  isPublished: boolean;
  completionBonus: number;
  lessons: CourseLesson[];
  quiz: CourseQuiz;
}

type ViewMode = "modules" | "lesson" | "quiz";

export function Aprende() {
  const { user, loading: authLoading } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [view, setView] = useState<ViewMode>("modules");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [lessonIndex, setLessonIndex] = useState(0);

  useEffect(() => {
    if (!user) return;
    getDocs(collection(db, "courses"))
      .then((snap) => {
        const all = snap.docs
          .map((d) => ({ id: d.id, ...d.data() } as Course))
          .filter((c) => c.isPublished)
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        setCourses(all);
      })
      .finally(() => setCoursesLoading(false));
  }, [user]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#D8F3DC" }}>
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const startCourse = (courseId: string) => {
    const course = courses.find((c) => c.id === courseId);
    if (!course || !course.lessons?.length) return;
    setSelectedCourse(course);
    setLessonIndex(0);
    setView("lesson");
  };

  const handleNextLesson = () => {
    if (!selectedCourse) return;
    if (lessonIndex < selectedCourse.lessons.length - 1) {
      setLessonIndex((i) => i + 1);
    } else {
      setView("quiz");
    }
  };

  const backToModules = () => {
    setView("modules");
    setSelectedCourse(null);
    setLessonIndex(0);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F8F4EF", fontFamily: "Nunito, sans-serif" }}>
      {/* Header */}
      <div className="px-4 py-8" style={{ backgroundColor: "white", borderBottom: "1px solid #E5E7EB" }}>
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <AnimatePresence>
            {view !== "modules" && (
              <motion.button
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                onClick={backToModules}
                className="p-2 rounded-xl transition-opacity hover:opacity-70"
                style={{ backgroundColor: "#F3F4F6" }}
              >
                <ArrowLeft size={18} style={{ color: "#374151" }} />
              </motion.button>
            )}
          </AnimatePresence>
          <div>
            <h1 style={{ fontWeight: 900, color: "#1B4332", fontSize: "1.6rem" }}>
              📖 Aprende y gana Green Points
            </h1>
            {view !== "modules" && selectedCourse && (
              <p className="text-sm mt-0.5" style={{ color: "#6B7280" }}>{selectedCourse.title}</p>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {coursesLoading ? (
          <div className="flex items-center justify-center gap-3 py-20" style={{ color: "#6B7280" }}>
            <LoadingSpinner />
            <span style={{ fontWeight: 600 }}>Cargando módulos...</span>
          </div>
        ) : view === "modules" ? (
          <ModuleGrid courses={courses} onStart={startCourse} />
        ) : view === "lesson" && selectedCourse ? (
          <LessonView
            course={selectedCourse}
            lessonIndex={lessonIndex}
            onNext={handleNextLesson}
          />
        ) : view === "quiz" && selectedCourse ? (
          <QuizView
            course={selectedCourse}
            onFinish={backToModules}
            onBack={() => {
              setView("lesson");
              setLessonIndex(selectedCourse.lessons.length - 1);
            }}
          />
        ) : null}
      </div>
    </div>
  );
}
