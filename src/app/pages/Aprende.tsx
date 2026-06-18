/*
 * CONNECTIONS NEEDED:
 * - Firebase: import { db } from '../lib/firebase'
 * - Firestore: lessons/{id} — content, quiz questions
 * - awardPoints(uid, 'quiz', description)
 * - awardPoints(uid, 'lesson', description)
 */
import { useState } from "react";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { LessonCard } from "../components/LessonCard";
import { ProgressBar } from "../components/ProgressBar";
import { useGame } from "../context/GameContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";

type ViewMode = "modules" | "lesson" | "quiz";

const MODULES = [
  {
    id: "module-1",
    title: "El hongo y el plástico",
    description: "Aprende cómo los hongos ostra descomponen el plástico a nivel molecular.",
    color: "#D8F3DC",
    imagePlaceholder: "AI image: hongo sobre plástico",
    lessonCount: 3,
    hasQuiz: true,
    points: 50,
    lessons: [
      {
        id: "l1-1",
        title: "El micelio: la red invisible",
        content: [
          "El micelio es la parte vegetativa del hongo — una red de hilos microscópicos llamados hifas que se extienden por el sustrato buscando nutrientes. A diferencia del cuerpo fructífero (el hongo que vemos), el micelio permanece oculto, trabajando silenciosamente.",
          "Cuando el micelio entra en contacto con el plástico, las hifas secretan enzimas especiales —sobre todo lacasas y peroxidasas— que atacan los polímeros del plástico. Este proceso puede reducir el peso del PET hasta un 30% en pocas semanas.",
        ],
        videoPlaceholder: "Video: Micelio bajo el microscopio",
      },
      {
        id: "l1-2",
        title: "Lacasas: las tijeras moleculares",
        content: [
          "Las lacasas son enzimas oxidativas producidas naturalmente por el Pleurotus ostreatus (hongo ostra). Su función en la naturaleza es degradar la lignina de la madera, pero resultan igualmente eficaces contra los polímeros sintéticos.",
          "Estas enzimas actúan cortando los enlaces C–O del PET y otros plásticos, fragmentando cadenas largas de polímeros en moléculas más pequeñas y eventualmente asimilables. El proceso se acelera con temperatura cálida (22–28°C) y humedad alta.",
        ],
        videoPlaceholder: "Video: Cómo actúan las lacasas",
      },
      {
        id: "l1-3",
        title: "El resultado final",
        content: [
          "Después de 4–8 semanas, el plástico tratado con micelio presenta cambios visibles: se vuelve poroso, frágil y de color grisáceo. Su peso puede reducirse un 20–35%. Los fragmentos resultantes son transformados en CO₂ y agua, completando el ciclo.",
          "Es importante destacar que este proceso es seguro: los cuerpos fructíferos (los hongos comestibles) no acumulan los subproductos del plástico. El micelio actúa como barrera, dejando a las setas limpias y nutritivas para el consumo humano.",
        ],
        videoPlaceholder: "Video: Plástico antes y después",
      },
    ],
    quiz: {
      question: "¿Cómo se llama el proceso donde los hongos descomponen materiales?",
      options: ["Fotosíntesis", "Micorremediación", "Biogénesis", "Fermentación"],
      correct: 1,
      points: 20,
    },
  },
  {
    id: "module-2",
    title: "¿Qué es la micorremediación?",
    description: "Explora la ciencia de usar hongos para limpiar contaminantes del ambiente.",
    color: "#DBEAFE",
    imagePlaceholder: "AI image: laboratorio de micorremediación",
    lessonCount: 3,
    hasQuiz: true,
    points: 50,
    lessons: [
      {
        id: "l2-1",
        title: "Historia de la micorremediación",
        content: [
          "El término 'micorremediación' fue acuñado por el micólogo Paul Stamets en la década de 1990. Stamets documentó cómo diversas especies de hongos podían degradar contaminantes del suelo, incluyendo hidrocarburos del petróleo y pesticidas.",
          "Desde entonces, investigaciones en universidades de todo el mundo han confirmado la capacidad de hongos como Pleurotus ostreatus, Trametes versicolor y Ganoderma lucidum para biodegradar una amplia gama de materiales, desde plásticos hasta metales pesados.",
        ],
        videoPlaceholder: "Video: Paul Stamets y los hongos",
      },
      {
        id: "l2-2",
        title: "Tipos de hongos biorremediadores",
        content: [
          "No todos los hongos tienen la misma capacidad de degradación. Los hongos de podredumbre blanca (white-rot fungi), como el hongo ostra, son los más eficaces porque producen las concentraciones más altas de lacasas y peroxidasas ligninolíticas.",
          "El Pleurotus ostreatus es especialmente versátil: crece en una amplia gama de sustratos, tolera variaciones de temperatura, y produce altos rendimientos de enzimas degradadoras. Por estas razones, es el hongo estrella de Green Block.",
        ],
        videoPlaceholder: "Video: Tipos de hongos biorremediadores",
      },
      {
        id: "l2-3",
        title: "Aplicaciones globales",
        content: [
          "La micorremediación ya se usa a escala industrial en varios países. En Holanda, hongos de podredumbre blanca se usan para limpiar suelos contaminados con PAHs (hidrocarburos poliaromáticos). En Colombia, equipos universitarios están probando Pleurotus para degradar plásticos de río.",
          "El futuro de la micorremediación incluye hongos genéticamente mejorados con mayor producción enzimática, sistemas de biorreactores para plástico reciclado, y kits domésticos como Green Block para involucrar a ciudadanos de todas las edades.",
        ],
        videoPlaceholder: "Video: Proyectos globales de micorremediación",
      },
    ],
    quiz: {
      question: "¿Qué tipo de hongos son más efectivos para la biorremediación?",
      options: ["Hongos de podredumbre marrón", "Levaduras", "Hongos de podredumbre blanca", "Moho negro"],
      correct: 2,
      points: 20,
    },
  },
  {
    id: "module-3",
    title: "Cómo cuidar tu kit",
    description: "Guía completa para maximizar el crecimiento y la degradación de plástico.",
    color: "#FEF3C7",
    imagePlaceholder: "AI image: kit de hongos en casa",
    lessonCount: 2,
    hasQuiz: true,
    points: 40,
    lessons: [
      {
        id: "l3-1",
        title: "Condiciones ideales",
        content: [
          "Para un crecimiento óptimo, mantén tu kit en un lugar con temperatura estable entre 18–24°C. Evita corrientes de aire frío o calor directo. La luz indirecta es perfecta — no es necesaria la luz solar directa, pero tampoco la oscuridad total.",
          "La humedad es crucial. Durante la fase de colonización (bag cerrada), el sustrato ya contiene suficiente humedad. Durante la fructificación, rocía el interior de la apertura con agua limpia 2–3 veces al día. El objetivo es mantener las superficies ligeramente húmedas.",
        ],
        videoPlaceholder: "Video: Setup ideal del kit en casa",
      },
      {
        id: "l3-2",
        title: "Solución de problemas",
        content: [
          "Contaminación: Si ves manchas verdes, negras o rosadas en el sustrato, indica hongos competidores (Trichoderma, Penicillium). Actúa rápido: aísla el kit en una bolsa hermética y deséchalo. No intentes eliminar el moho con vinagre — la cepa está perdida.",
          "Micelio lento: Si después de 14 días no ves micelio blanco, revisa temperatura y humedad. Si el kit está muy seco, agrega 30ml de agua estéril en los bordes del sustrato. Si la temperatura es menor a 15°C, mueve el kit a un lugar más cálido.",
        ],
        videoPlaceholder: "Video: Cómo resolver problemas del kit",
      },
    ],
    quiz: {
      question: "¿Qué temperatura es ideal para el crecimiento del micelio?",
      options: ["5–10°C", "18–24°C", "30–35°C", "40–45°C"],
      correct: 1,
      points: 15,
    },
  },
  {
    id: "module-4",
    title: "El plástico en el océano",
    description: "Descubre el impacto global del plástico marino y cómo los hongos pueden ayudar.",
    color: "#F3F4F6",
    imagePlaceholder: "AI image: plástico en el océano",
    lessonCount: 3,
    hasQuiz: true,
    points: 60,
    lessons: [],
    quiz: {
      question: "¿Cuánto tiempo tarda en degradarse una botella de PET en el océano?",
      options: ["10 años", "50 años", "450 años", "Solo 1 año"],
      correct: 2,
      points: 25,
    },
  },
];

export function Aprende() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { completedLessons, completeLesson, addPoints } = useGame();

  const [view, setView] = useState<ViewMode>("modules");
  const [selectedModule, setSelectedModule] = useState<typeof MODULES[0] | null>(null);
  const [lessonIndex, setLessonIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizResult, setQuizResult] = useState<"correct" | "wrong" | null>(null);
  const [showPoints, setShowPoints] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#D8F3DC" }}>
        <div className="text-center">
          <p style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, color: "#1B4332" }}>Regístrate para acceder a los módulos</p>
          <button onClick={() => navigate("/register")} className="mt-4 px-6 py-2 rounded-xl" style={{ backgroundColor: "#2D6A4F", color: "white", fontFamily: "Nunito, sans-serif", fontWeight: 700 }}>
            Registrarse
          </button>
        </div>
      </div>
    );
  }

  const getModuleStatus = (id: string, index: number): "completed" | "available" | "locked" => {
    if (completedLessons.includes(id)) return "completed";
    if (index === 0) return "available";
    if (completedLessons.includes(MODULES[index - 1].id)) return "available";
    return "locked";
  };

  const startModule = (id: string) => {
    const mod = MODULES.find((m) => m.id === id);
    if (!mod || mod.lessons.length === 0) return;
    setSelectedModule(mod);
    setLessonIndex(0);
    setView("lesson");
  };

  const nextLesson = () => {
    if (!selectedModule) return;
    if (lessonIndex < selectedModule.lessons.length - 1) {
      setLessonIndex((i) => i + 1);
    } else {
      setSelectedOption(null);
      setQuizResult(null);
      setShowPoints(false);
      setView("quiz");
    }
  };

  const checkAnswer = () => {
    if (selectedOption === null || !selectedModule) return;
    const correct = selectedModule.quiz.correct === selectedOption;
    setQuizResult(correct ? "correct" : "wrong");
    if (correct) {
      setShowPoints(true);
      addPoints(selectedModule.quiz.points, `Quiz: ${selectedModule.title}`, "🧠");
      completeLesson(selectedModule.id);
      setTimeout(() => setShowPoints(false), 2500);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F8F4EF", fontFamily: "Nunito, sans-serif" }}>
      {/* Header */}
      <div className="px-4 py-8" style={{ backgroundColor: "white", borderBottom: "1px solid #E5E7EB" }}>
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          {view !== "modules" && (
            <button onClick={() => { setView("modules"); setSelectedModule(null); }} className="p-2 rounded-xl transition-opacity hover:opacity-70" style={{ backgroundColor: "#F3F4F6" }}>
              <ArrowLeft size={18} style={{ color: "#374151" }} />
            </button>
          )}
          <div>
            <h1 style={{ fontWeight: 900, color: "#1B4332", fontSize: "1.6rem" }}>
              📖 Aprende y gana Green Points
            </h1>
            {view === "lesson" && selectedModule && (
              <p className="text-sm" style={{ color: "#6B7280" }}>{selectedModule.title}</p>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* MODULE GRID */}
        {view === "modules" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {MODULES.map((mod, i) => (
              <LessonCard
                key={mod.id}
                id={mod.id}
                title={mod.title}
                description={mod.description}
                status={getModuleStatus(mod.id, i)}
                lessonCount={mod.lessonCount}
                hasQuiz={mod.hasQuiz}
                points={mod.points}
                color={mod.color}
                imagePlaceholder={mod.imagePlaceholder}
                onStart={startModule}
              />
            ))}
          </div>
        )}

        {/* LESSON VIEW */}
        {view === "lesson" && selectedModule && selectedModule.lessons[lessonIndex] && (
          <div className="max-w-2xl mx-auto">
            <div className="mb-5">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm" style={{ color: "#6B7280" }}>
                  Lección {lessonIndex + 1} de {selectedModule.lessons.length}
                </p>
              </div>
              <ProgressBar current={lessonIndex + 1} max={selectedModule.lessons.length} />
            </div>

            <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "white", border: "1px solid #E5E7EB" }}>
              {/* Image placeholder */}
              <div className="h-44 flex items-center justify-center" style={{ backgroundColor: selectedModule.color }}>
                <div className="text-center">
                  <div className="text-4xl mb-2">🌿</div>
                  <p className="text-xs" style={{ color: "rgba(0,0,0,0.4)", fontFamily: "Nunito" }}>
                    AI image: micelio creciendo
                  </p>
                </div>
              </div>

              <div className="p-6">
                <h2 style={{ fontWeight: 800, color: "#1B4332", fontSize: "1.2rem", marginBottom: "1.2rem" }}>
                  {selectedModule.lessons[lessonIndex].title}
                </h2>
                {selectedModule.lessons[lessonIndex].content.map((p, i) => (
                  <p key={i} className="text-sm mb-4" style={{ color: "#374151", lineHeight: 1.7 }}>{p}</p>
                ))}

                {/* Video embed placeholder */}
                <div className="rounded-xl flex items-center justify-center h-36 mb-4" style={{ backgroundColor: "#1B4332" }}>
                  <div className="text-center">
                    <div className="w-14 h-14 rounded-full border-4 border-white flex items-center justify-center mx-auto mb-2">
                      <ChevronRight size={24} color="white" style={{ marginLeft: "3px" }} />
                    </div>
                    <p className="text-xs" style={{ color: "#95D5B2" }}>{selectedModule.lessons[lessonIndex].videoPlaceholder}</p>
                  </div>
                </div>

                <button
                  onClick={nextLesson}
                  className="w-full py-3 rounded-xl transition-opacity hover:opacity-80"
                  style={{ backgroundColor: "#2D6A4F", color: "white", fontWeight: 700 }}
                >
                  {lessonIndex < selectedModule.lessons.length - 1 ? "Siguiente →" : "Ir al Quiz →"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* QUIZ VIEW */}
        {view === "quiz" && selectedModule && (
          <div className="max-w-2xl mx-auto">
            <div
              className="rounded-2xl p-6"
              style={{
                backgroundColor: quizResult === "correct" ? "#D8F3DC" : quizResult === "wrong" ? "#FEF2F2" : "white",
                border: `2px solid ${quizResult === "correct" ? "#52B788" : quizResult === "wrong" ? "#FECACA" : "#E5E7EB"}`,
                transition: "all 0.3s ease",
              }}
            >
              {/* Question */}
              <div className="mb-6">
                <span className="inline-block text-xs px-3 py-1 rounded-full mb-3" style={{ backgroundColor: "#D8F3DC", color: "#2D6A4F", fontWeight: 700 }}>
                  Quiz — {selectedModule.title}
                </span>
                <h2 style={{ fontWeight: 800, color: "#1B4332", fontSize: "1.15rem", lineHeight: 1.4 }}>
                  {selectedModule.quiz.question}
                </h2>
              </div>

              {/* Options */}
              <div className="flex flex-col gap-3 mb-6">
                {selectedModule.quiz.options.map((option, i) => {
                  const isSelected = selectedOption === i;
                  const isCorrect = selectedModule.quiz.correct === i;
                  const revealed = quizResult !== null;
                  let bg = "white";
                  let border = "#E5E7EB";
                  let color = "#374151";
                  if (revealed && isCorrect) { bg = "#D8F3DC"; border = "#52B788"; color = "#1B4332"; }
                  else if (revealed && isSelected && !isCorrect) { bg = "#FEF2F2"; border = "#FECACA"; color = "#DC2626"; }
                  else if (!revealed && isSelected) { bg = "#D8F3DC"; border = "#52B788"; color = "#1B4332"; }
                  return (
                    <button
                      key={i}
                      onClick={() => !quizResult && setSelectedOption(i)}
                      disabled={quizResult !== null}
                      className="flex items-center gap-3 p-4 rounded-xl text-left transition-all"
                      style={{ backgroundColor: bg, border: `2px solid ${border}`, color }}
                    >
                      <div
                        className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center"
                        style={{ backgroundColor: isSelected || (revealed && isCorrect) ? "#2D6A4F" : "#F3F4F6" }}
                      >
                        <span className="text-xs" style={{ color: isSelected || (revealed && isCorrect) ? "white" : "#9CA3AF", fontWeight: 700 }}>
                          {["A","B","C","D"][i]}
                        </span>
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
                      +{selectedModule.quiz.points} puntos! 🎉
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              {quizResult === "correct" && (
                <div className="text-center mb-4 p-3 rounded-xl" style={{ backgroundColor: "#2D6A4F" }}>
                  <p style={{ color: "white", fontWeight: 700 }}>¡Correcto! ✓</p>
                </div>
              )}
              {quizResult === "wrong" && (
                <div className="text-center mb-4 p-3 rounded-xl" style={{ backgroundColor: "#FEF2F2", border: "1px solid #FECACA" }}>
                  <p style={{ color: "#DC2626", fontWeight: 700 }}>Incorrecto — la respuesta correcta era: {selectedModule.quiz.options[selectedModule.quiz.correct]}</p>
                </div>
              )}

              <div className="flex gap-3">
                {quizResult === null ? (
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
                ) : (
                  <button
                    onClick={() => setView("modules")}
                    className="flex-1 py-3 rounded-xl transition-opacity hover:opacity-80"
                    style={{ backgroundColor: "#2D6A4F", color: "white", fontWeight: 700 }}
                  >
                    Volver a módulos →
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
