/*
 * CONNECTIONS NEEDED:
 * - Firebase: import { db } from '../lib/firebase'
 * - AI Advisor: import { askGreenBot } from '../lib/gemini'
 * - Connect to OpenRouter API - model: google/gemini-flash-1.5
 * - Trained with mycoremediation knowledge base
 */
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { Send, ChefHat, Leaf, Recycle, BookOpen } from "lucide-react";
import { askGreenBot } from "../../lib/greenbot";

const plasticTypes = [
  {
    code: 1, symbol: "PET", name: "Polietileno Tereftalato",
    color: "#DBEAFE", textColor: "#1D4ED8",
    products: "Botellas de agua, botellas de refresco, frascos",
    compatible: true,
    tip: "Busca el triángulo con el número 1 en la parte inferior de la botella, generalmente en el centro de la base.",
    instruction: "Limpia la botella y córtala en tiras de ~2cm. Mézclala con el sustrato del kit antes de inocular. El PET funciona muy bien con hongos ostra.",
  },
  {
    code: 2, symbol: "HDPE", name: "Polietileno de Alta Densidad",
    color: "#D1FAE5", textColor: "#065F46",
    products: "Bidones de leche, botellas de detergente, botellas de champú",
    compatible: true,
    tip: "El triángulo con 2 suele estar hundido en el plástico en la parte inferior o trasera del envase.",
    instruction: "Tritura el plástico en trozos de 1–3cm. Esteriliza hirviéndolo 10 minutos y deja enfriar. Agrega al sustrato del kit. Funciona muy bien.",
  },
  {
    code: 3, symbol: "PVC", name: "Policloruro de Vinilo",
    color: "#FEF3C7", textColor: "#92400E",
    products: "Tuberías, marcos de ventana, algunas envolturas de alimentos",
    compatible: false,
    tip: "El PVC frecuentemente no está marcado o lleva una V. Busca el triángulo con el número 3 en la parte inferior del envase.",
    instruction: "⚠️ No recomendado para uso doméstico. El PVC libera compuestos de cloro al degradarse. Lleva este plástico a un centro de reciclaje profesional.",
  },
  {
    code: 4, symbol: "LDPE", name: "Polietileno de Baja Densidad",
    color: "#D8F3DC", textColor: "#2D6A4F",
    products: "Bolsas de plástico, botellas exprimibles, anillos de six-pack",
    compatible: true,
    tip: "Las bolsas de LDPE raramente muestran el código. Busca el triángulo con 4 en la parte inferior de botellas exprimibles.",
    instruction: "Corta las bolsas en cuadrados de 2cm. Mezcla 20% de LDPE con 80% de sustrato. Buenos resultados de colonización en 3–4 semanas.",
  },
  {
    code: 5, symbol: "PP", name: "Polipropileno",
    color: "#EDE9FE", textColor: "#5B21B6",
    products: "Envases de yogur, botellas de ketchup, tapas de botellas",
    compatible: true,
    tip: "Busca el triángulo con 5 en la base o dentro de la tapa. Puede requerir linterna para verlo.",
    instruction: "Las tapas de PP y piezas pequeñas funcionan genial. Tritura si es posible o corta pequeño. Mezcla en el sustrato. Excelentes resultados con hongos ostra.",
  },
  {
    code: 6, symbol: "PS", name: "Poliestireno",
    color: "#FEE2E2", textColor: "#991B1B",
    products: "Vasos de poliestireno, cubiertos de plástico, cajas de CD",
    compatible: false,
    tip: "Busca el triángulo con 6 en vasos desechables y empaques de espuma. Puede aparecer como PS sin número.",
    instruction: "⚠️ Compatibilidad limitada. Los subproductos del estireno pueden dañar el micelio. Usar solo bajo supervisión adulta y nunca en cultivos de alimentos.",
  },
  {
    code: 7, symbol: "Otro", name: "Plásticos Mixtos / Otros",
    color: "#F3F4F6", textColor: "#374151",
    products: "Botellas grandes, DVDs, algunos envases de alimentos",
    compatible: null,
    tip: "El triángulo con 7 (u OTHER) significa mezcla. Los resultados varían. Identifica el plástico exacto antes de usar.",
    instruction: "Los resultados varían mucho. Envía una foto a GreenBot para una evaluación antes de agregar al kit.",
  },
];

const recipes = [
  {
    category: "Cultivo",
    emoji: "🌱",
    title: "Micro-jardín de Botellas PET",
    time: "3–4 semanas",
    difficulty: "Fácil",
    steps: [
      "Recolecta 5–6 botellas PET (código 1) limpias y córtalas en tiras de 2cm.",
      "Esteriliza las tiras en agua hirviendo 10 minutos y deja enfriar.",
      "Abre tu kit Green Block y mezcla las tiras de PET uniformemente en el sustrato (máximo 20% de plástico).",
      "Sella la bolsa y déjala en un lugar oscuro a 20–24°C.",
      "Revisa diariamente — el micelio blanco debe aparecer en 7–10 días.",
      "Una vez colonizado completamente (todo blanco), abre la bolsa y rocía con agua dos veces al día.",
      "Cosecha los hongos cuando los sombreros empiecen a aplanarse. ¡El plástico estará visiblemente degradado!",
    ],
  },
  {
    category: "Cultivo",
    emoji: "🍄",
    title: "Kit de Racimo de Tapas HDPE",
    time: "2–3 semanas",
    difficulty: "Fácil",
    steps: [
      "Recolecta 50+ tapas de plástico HDPE (código 2) de cualquier color.",
      "Lava bien con jabón y enjuaga.",
      "Coloca las tapas en una sola capa sobre la superficie del sustrato de tu kit abierto.",
      "Rocía diariamente y cubre con film plástico sin apretar.",
      "El micelio colonizará las tapas desde abajo en 5–7 días.",
      "Sigue rociando. Los hongos brotarán entre las tapas en la semana 2–3.",
    ],
  },
  {
    category: "Culinario",
    emoji: "🍳",
    title: "Hongos Ostra Salteados con Ajo",
    time: "15 min",
    difficulty: "Fácil",
    steps: [
      "Cosecha hongos ostra frescos de tu kit — idealmente 200g.",
      "Separa en trozos del tamaño de un bocado siguiendo la veta natural.",
      "Calienta 2 cucharadas de aceite de oliva en una sartén a fuego medio-alto.",
      "Agrega 3 dientes de ajo machacados y cocina 1 minuto.",
      "Agrega los hongos en una sola capa. No revuelvas durante 2 minutos para que doren.",
      "Voltea, agrega sal, pimienta, un chorrito de salsa de soja y perejil fresco.",
      "Sirve sobre tostadas o como guarnición. ¡Delicioso!",
    ],
  },
  {
    category: "Culinario",
    emoji: "🥘",
    title: "Risotto de Micelio",
    time: "35 min",
    difficulty: "Medio",
    steps: [
      "Sofríe 1 cebolla picada en mantequilla hasta que quede transparente.",
      "Agrega 1 taza de arroz Arborio, revuelve 2 minutos.",
      "Vierte ½ taza de vino blanco y revuelve hasta que se absorba.",
      "Agrega caldo de verduras caliente cucharón a cucharón, revolviendo constantemente (25 min).",
      "En otra sartén, saltea 150g de hongos ostra con tomillo y ajo.",
      "Incorpora los hongos al risotto. Agrega parmesano, sal y pimienta.",
      "Sirve inmediatamente con ralladura de limón fresca encima.",
    ],
  },
  {
    category: "Eco DIY",
    emoji: "♻️",
    title: "Acelerador de Compost Micelial",
    time: "6–8 semanas",
    difficulty: "Medio",
    steps: [
      "Después de cosechar, recoge el sustrato agotado (bloque blanco de micelio).",
      "Divídelo en trozos pequeños y agrégalos a tu pila de compost.",
      "El micelio continuará descomponiendo materia orgánica y cualquier plástico restante.",
      "Mezcla con restos de cocina, hojas y cartón cada 2 semanas.",
      "En 6–8 semanas tendrás un compost rico enriquecido con micelio.",
      "Úsalo en tu jardín — ¡excelente para la estructura del suelo!",
    ],
  },
];

interface BotMessage {
  id: number;
  from: "user" | "bot";
  text: string;
}

const initialBotMessages: BotMessage[] = [
  {
    id: 1, from: "bot",
    text: "¡Hola! Soy GreenBot 🌿 Sé todo sobre micorremediación, cómo usar tu kit Green Block y cocinar con tus hongos. ¿Qué quieres saber?",
  },
];

const botSuggestions = [
  "¿Qué plásticos funcionan mejor?",
  "¿Cuánto tarda en crecer el hongo?",
  "¿Puedo comer estos hongos?",
  "¡Mi micelio no crece, ayuda!",
  "¿Cuánto plástico puede degradar?",
];

const botResponses: Record<string, string> = {
  "¿Qué plásticos funcionan mejor?": "¡El PET (código 1), HDPE (código 2), LDPE (código 4) y PP (código 5) funcionan genial con hongos ostra! Evita el PVC (código 3) y ten cuidado con el PS (código 6). ¡Siempre limpia los plásticos antes de agregarlos a tu kit! 🍄",
  "¿Cuánto tarda en crecer el hongo?": "Después de inocular el sustrato, espera micelio blanco en 7–14 días. Los pins (pequeños hongos bebé) aparecen en 2–3 semanas y puedes cosechar en 3–4 semanas. ¡Mantén la humedad alta y la temperatura entre 18–24°C! 🌱",
  "¿Puedo comer estos hongos?": "¡Sí! Los hongos ostra cultivados en sustrato de plástico son seguros para comer. El micelio digiere el plástico internamente — los cuerpos fructíferos están perfectamente limpios y nutritivos. Cosecha antes de que los sombreros se curven hacia arriba. ¡Disfruta tu Risotto Micelial! 🍳",
  "¡Mi micelio no crece, ayuda!": "Revisa estos puntos: 1) Temperatura — debe ser 18–24°C. 2) Humedad — rocía el interior de la bolsa diariamente. 3) ¿Demasiada luz? Muévelo a un lugar más oscuro. 4) Contaminación — si ves manchas verdes/negras, es moho — empieza de nuevo. ¡Contáctanos si el problema persiste! 💚",
  "¿Cuánto plástico puede degradar?": "¡Un kit Green Block de 500g puede degradar aproximadamente el 15–30% del plástico mezclado en el sustrato en 4–6 semanas! El resto se vuelve más poroso y frágil, facilitando su procesamiento. ¡Con múltiples ciclos puedes degradar significativamente más! 🌍",
};

export function HowToUse() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState<"plastics" | "instructions" | "recipes" | "bot">("plastics");
  const [selectedRecipe, setSelectedRecipe] = useState<typeof recipes[0] | null>(null);
  const [botMessages, setBotMessages] = useState<BotMessage[]>(initialBotMessages);
  const [botInput, setBotInput] = useState("");
  const [botLoading, setBotLoading] = useState(false);
  const botBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    botBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [botMessages, botLoading]);
  const [selectedPlastic, setSelectedPlastic] = useState<typeof plasticTypes[0] | null>(null);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: "#D8F3DC", fontFamily: "Nunito, sans-serif" }}>
        <div className="text-center max-w-sm">
          <div className="text-5xl mb-4">🔒</div>
          <h2 style={{ fontWeight: 800, color: "#1B4332", fontSize: "1.4rem", marginBottom: "0.5rem" }}>Solo para miembros</h2>
          <p className="mb-6 text-sm" style={{ color: "#4B5563" }}>
            Regístrate con tu kit Green Block para acceder a tu guía personalizada y recetas.
          </p>
          <button
            onClick={() => navigate("/register")}
            className="px-8 py-3 rounded-xl transition-opacity hover:opacity-80"
            style={{ backgroundColor: "#2D6A4F", color: "white", fontWeight: 700 }}
          >
            Regístrate ahora →
          </button>
        </div>
      </div>
    );
  }

  const sendBotMessage = async (text: string) => {
    if (!text.trim() || botLoading) return;
    const userMsg: BotMessage = { id: Date.now(), from: "user", text };
    setBotMessages((prev) => [...prev, userMsg]);
    setBotInput("");
    setBotLoading(true);
    try {
      const reply = await askGreenBot(text, user.kitType);
      setBotMessages((prev) => [...prev, { id: Date.now(), from: "bot", text: reply }]);
    } catch {
      const fallback = botResponses[text] ?? "Lo siento, tuve un problema al responder. Intenta de nuevo en un momento. 🌿";
      setBotMessages((prev) => [...prev, { id: Date.now(), from: "bot", text: fallback }]);
    } finally {
      setBotLoading(false);
    }
  };

  const tabs = [
    { key: "plastics" as const, icon: <Recycle size={16} />, label: "Tipos de Plástico" },
    { key: "instructions" as const, icon: <BookOpen size={16} />, label: "Instrucciones" },
    { key: "recipes" as const, icon: <ChefHat size={16} />, label: "Recetas" },
    { key: "bot" as const, icon: <Leaf size={16} />, label: "GreenBot IA" },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F8F4EF", fontFamily: "Nunito, sans-serif" }}>
      {/* Header */}
      <div className="w-full py-10 px-4" style={{ backgroundColor: "#2D6A4F" }}>
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-1">
            <img
              src={user.photo}
              alt={user.name}
              className="w-10 h-10 rounded-full border-2 border-white"
              onError={(e) => { (e.target as HTMLImageElement).src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.name) + "&background=52B788&color=fff"; }}
            />
            <span className="text-sm" style={{ color: "#95D5B2", fontWeight: 600 }}>¡Hola, {user.name.split(" ")[0]}!</span>
          </div>
          <h1 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "2rem", color: "white", lineHeight: 1.2 }}>
            Cómo usar tu Kit Green Block 🍄
          </h1>
          <p className="mt-2 text-sm" style={{ color: "#95D5B2" }}>
            {user.kitType}{user.purchaseDate ? ` · Registrado el ${new Date(user.purchaseDate).toLocaleDateString("es-ES", { month: "long", day: "numeric", year: "numeric" })}` : ""}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="w-full px-4 py-0" style={{ backgroundColor: "#1B4332" }}>
        <div className="max-w-5xl mx-auto flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveSection(tab.key)}
              className="flex items-center gap-2 px-5 py-3 text-sm whitespace-nowrap transition-colors"
              style={{
                fontFamily: "Nunito, sans-serif",
                fontWeight: 700,
                color: activeSection === tab.key ? "#2D6A4F" : "#95D5B2",
                backgroundColor: activeSection === tab.key ? "#F8F4EF" : "transparent",
                borderRadius: activeSection === tab.key ? "12px 12px 0 0" : "0",
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* TIPOS DE PLÁSTICO */}
        {activeSection === "plastics" && (
          <div>
            <div className="mb-6">
              <h2 style={{ fontWeight: 800, color: "#1B4332", fontSize: "1.4rem", marginBottom: "0.5rem" }}>
                🔎 Encuentra tu tipo de plástico
              </h2>
              <p className="text-sm" style={{ color: "#4B5563" }}>
                Cada botella o envase de plástico tiene un símbolo de reciclaje — un triángulo con un número del 1 al 7 — generalmente en la parte inferior. Toca un tipo para saber más.
              </p>
            </div>

            <div className="p-5 rounded-2xl mb-6" style={{ backgroundColor: "#D8F3DC", border: "1px solid #95D5B2" }}>
              <p style={{ fontWeight: 700, color: "#1B4332", marginBottom: "0.5rem" }}>📍 Cómo encontrar el ícono en tu botella:</p>
              <ol className="text-sm flex flex-col gap-1" style={{ color: "#2D6A4F" }}>
                <li><strong>1.</strong> Da vuelta la botella y mira la base.</li>
                <li><strong>2.</strong> Verás un triángulo pequeño hecho de flechas con un número adentro (1–7).</li>
                <li><strong>3.</strong> Las letras debajo del triángulo son la abreviación del plástico (PET, HDPE, etc.).</li>
                <li><strong>4.</strong> Busca ese número en las tarjetas de abajo para ver tus instrucciones específicas.</li>
              </ol>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {plasticTypes.map((p) => (
                <button
                  key={p.code}
                  onClick={() => setSelectedPlastic(selectedPlastic?.code === p.code ? null : p)}
                  className="text-left p-4 rounded-2xl transition-all hover:shadow-md"
                  style={{
                    backgroundColor: p.color,
                    border: selectedPlastic?.code === p.code ? `2px solid ${p.textColor}` : "2px solid transparent",
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="relative flex items-center justify-center w-12 h-12">
                      <svg viewBox="0 0 48 48" width="48" height="48">
                        <path d="M24 4 L44 40 L4 40 Z" fill="none" stroke={p.textColor} strokeWidth="3" strokeLinejoin="round"/>
                        <path d="M24 4 L26 8 M44 40 L40 40 M4 40 L8 40" stroke={p.textColor} strokeWidth="2.5" strokeLinecap="round"/>
                        <text x="24" y="32" textAnchor="middle" style={{ fontSize: "13px", fontWeight: "bold", fill: p.textColor, fontFamily: "Nunito, sans-serif" }}>{p.code}</text>
                      </svg>
                    </div>
                    <span
                      className="px-2 py-0.5 rounded-full text-xs flex-shrink-0"
                      style={{
                        backgroundColor: p.compatible === true ? "#2D6A4F" : p.compatible === false ? "#DC2626" : "#6B7280",
                        color: "white",
                        fontWeight: 700,
                      }}
                    >
                      {p.compatible === true ? "✓ Compatible" : p.compatible === false ? "✗ Evitar" : "? Varía"}
                    </span>
                  </div>
                  <p style={{ fontWeight: 800, color: p.textColor, fontSize: "1rem" }}>{p.symbol}</p>
                  <p className="text-xs mt-0.5 mb-2" style={{ color: p.textColor, opacity: 0.8 }}>{p.name}</p>
                  <p className="text-xs" style={{ color: p.textColor, opacity: 0.7 }}>{p.products}</p>
                </button>
              ))}
            </div>

            {selectedPlastic && (
              <div className="mt-6 p-6 rounded-2xl" style={{ backgroundColor: selectedPlastic.color, border: `2px solid ${selectedPlastic.textColor}` }}>
                <h3 style={{ fontWeight: 800, color: selectedPlastic.textColor, fontSize: "1.1rem", marginBottom: "1rem" }}>
                  Código {selectedPlastic.code} — {selectedPlastic.symbol}: {selectedPlastic.name}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm mb-1" style={{ fontWeight: 700, color: selectedPlastic.textColor }}>📍 Cómo encontrar el ícono:</p>
                    <p className="text-sm" style={{ color: selectedPlastic.textColor, opacity: 0.85 }}>{selectedPlastic.tip}</p>
                  </div>
                  <div>
                    <p className="text-sm mb-1" style={{ fontWeight: 700, color: selectedPlastic.textColor }}>🍄 Cómo usar con tu kit:</p>
                    <p className="text-sm" style={{ color: selectedPlastic.textColor, opacity: 0.85 }}>{selectedPlastic.instruction}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* INSTRUCCIONES */}
        {activeSection === "instructions" && (
          <div>
            <h2 style={{ fontWeight: 800, color: "#1B4332", fontSize: "1.4rem", marginBottom: "0.5rem" }}>
              📋 Instrucciones paso a paso
            </h2>
            <p className="text-sm mb-6" style={{ color: "#4B5563" }}>
              Sigue estos pasos para configurar tu {user.kitType} para la degradación de plásticos.
            </p>

            {[
              { num: "1", icon: "🧹", title: "Prepara tus plásticos", color: "#D8F3DC", desc: "Recoge botellas o envases de plástico limpios. Retira etiquetas y tapas. Lava bien con jabón y agua tibia. Deja secar completamente." },
              { num: "2", icon: "🔍", title: "Identifica el tipo de plástico", color: "#DBEAFE", desc: "Revisa la parte inferior de cada envase para ver el triángulo de reciclaje con número (1–7). Usa la pestaña Tipos de Plástico para confirmar compatibilidad. Solo usa los códigos 1, 2, 4 y 5." },
              { num: "3", icon: "✂️", title: "Corta en trozos pequeños", color: "#EDE9FE", desc: "Corta el plástico en tiras o trozos de máximo 2–3cm. Trozos más pequeños = degradación más rápida. Para plásticos rígidos, pide ayuda a un adulto con tijeras o cúter." },
              { num: "4", icon: "♨️", title: "Opcional: Esteriliza", color: "#FEF3C7", desc: "Para plásticos HDPE y PP, hierve las piezas en agua 10 minutos y deja enfriar completamente. Esto elimina contaminantes superficiales que podrían dañar tu micelio." },
              { num: "5", icon: "📦", title: "Mezcla con el sustrato", color: "#D8F3DC", desc: "Abre la bolsa de tu kit Green Block. Agrega las piezas de plástico (máximo 20% del volumen total). Mezcla uniformemente en el sustrato. Sella la bolsa dejando el parche de filtro expuesto." },
              { num: "6", icon: "🌡️", title: "Fase de colonización", color: "#DBEAFE", desc: "Coloca la bolsa sellada en un lugar oscuro a 18–24°C. Revisa diariamente. El micelio blanco y esponjoso debe aparecer en 7–14 días. No abras la bolsa durante esta fase." },
              { num: "7", icon: "💧", title: "Fase de fructificación", color: "#EDE9FE", desc: "Una vez que el 70%+ de la bolsa esté blanca, haz 3–4 cortes en X en la bolsa. Rocía con agua limpia 2–3 veces al día. Mantén la humedad alta. Los hongos pinearán en 5–7 días." },
              { num: "8", icon: "🍄", title: "¡Cosecha!", color: "#FEF3C7", desc: "Cuando los sombreros empiecen a aplanarse y los bordes ondeen ligeramente, agarra la base y gira suavemente. Cosecha todo el racimo a la vez. ¡El plástico estará visiblemente degradado, gris y frágil!" },
            ].map((step) => (
              <div key={step.num} className="flex gap-4 mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: step.color }}
                >
                  <span style={{ fontSize: "1.4rem" }}>{step.icon}</span>
                </div>
                <div className="flex-1 p-4 rounded-2xl" style={{ backgroundColor: "white", border: "1px solid #E5E7EB" }}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: "#D8F3DC", color: "#2D6A4F", fontWeight: 700 }}>Paso {step.num}</span>
                    <p style={{ fontWeight: 700, color: "#1B4332" }}>{step.title}</p>
                  </div>
                  <p className="text-sm" style={{ color: "#4B5563", lineHeight: 1.6 }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* RECETAS */}
        {activeSection === "recipes" && (
          <div>
            <h2 style={{ fontWeight: 800, color: "#1B4332", fontSize: "1.4rem", marginBottom: "0.5rem" }}>
              🍳 Recetas y Proyectos
            </h2>
            <p className="text-sm mb-6" style={{ color: "#4B5563" }}>
              Proyectos de cultivo, recetas culinarias e ideas eco-DIY para tu kit de hongos.
            </p>

            {selectedRecipe ? (
              <div>
                <button
                  onClick={() => setSelectedRecipe(null)}
                  className="mb-4 flex items-center gap-1 text-sm transition-opacity hover:opacity-70"
                  style={{ color: "#2D6A4F", fontWeight: 600 }}
                >
                  ← Volver a recetas
                </button>
                <div className="p-6 rounded-2xl" style={{ backgroundColor: "white", border: "1px solid #E5E7EB" }}>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-4xl">{selectedRecipe.emoji}</span>
                    <div>
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: "#D8F3DC", color: "#2D6A4F", fontWeight: 700 }}>
                        {selectedRecipe.category}
                      </span>
                      <h3 style={{ fontWeight: 800, color: "#1B4332", fontSize: "1.2rem", marginTop: "0.25rem" }}>{selectedRecipe.title}</h3>
                      <div className="flex gap-3 mt-1">
                        <span className="text-xs" style={{ color: "#6B7280" }}>⏱ {selectedRecipe.time}</span>
                        <span className="text-xs" style={{ color: "#6B7280" }}>📊 {selectedRecipe.difficulty}</span>
                      </div>
                    </div>
                  </div>
                  <ol className="flex flex-col gap-3">
                    {selectedRecipe.steps.map((step, i) => (
                      <li key={i} className="flex gap-3">
                        <span
                          className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs mt-0.5"
                          style={{ backgroundColor: "#2D6A4F", color: "white", fontWeight: 700 }}
                        >
                          {i + 1}
                        </span>
                        <p className="text-sm" style={{ color: "#374151", lineHeight: 1.6 }}>{step}</p>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            ) : (
              <div>
                {(["Cultivo", "Culinario", "Eco DIY"] as const).map((cat) => (
                  <div key={cat} className="mb-8">
                    <h3 className="mb-3" style={{ fontWeight: 700, color: "#2D6A4F" }}>
                      {cat === "Cultivo" ? "🌱 Proyectos de Cultivo" : cat === "Culinario" ? "🍳 Recetas Culinarias" : "♻️ Proyectos Eco DIY"}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {recipes.filter((r) => r.category === cat).map((recipe) => (
                        <button
                          key={recipe.title}
                          onClick={() => setSelectedRecipe(recipe)}
                          className="text-left p-5 rounded-2xl transition-all hover:shadow-md"
                          style={{ backgroundColor: "white", border: "1px solid #E5E7EB" }}
                        >
                          <div className="flex items-start gap-3">
                            <span className="text-3xl">{recipe.emoji}</span>
                            <div>
                              <p style={{ fontWeight: 700, color: "#1B4332" }}>{recipe.title}</p>
                              <div className="flex gap-3 mt-1">
                                <span className="text-xs" style={{ color: "#6B7280" }}>⏱ {recipe.time}</span>
                                <span className="text-xs" style={{ color: "#6B7280" }}>📊 {recipe.difficulty}</span>
                              </div>
                              <p className="text-xs mt-2" style={{ color: "#9CA3AF" }}>{recipe.steps.length} pasos →</p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* GREENBOT IA */}
        {activeSection === "bot" && (
          <div>
            <div className="mb-4">
              <h2 style={{ fontWeight: 800, color: "#1B4332", fontSize: "1.4rem", marginBottom: "0.25rem" }}>
                🌿 Asesor GreenBot IA
              </h2>
              <p className="text-sm" style={{ color: "#4B5563" }}>
                Entrenado en micorremediación, ciencia del plástico y cultivo de hongos. ¡Pregúntame lo que quieras!
              </p>
            </div>

            <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid #E5E7EB", backgroundColor: "white" }}>
              <div className="p-4 flex flex-col gap-3 overflow-y-auto" style={{ minHeight: "320px", maxHeight: "480px" }}>
                {botMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
                    style={{ animation: "msgIn 0.18s ease-out both" }}
                  >
                    {msg.from === "bot" && (
                      <div className="w-7 h-7 rounded-full flex items-center justify-center mr-2 flex-shrink-0 mt-0.5" style={{ backgroundColor: "#D8F3DC" }}>
                        <span style={{ fontSize: "0.8rem" }}>🌿</span>
                      </div>
                    )}
                    <div
                      className="px-4 py-3 max-w-xs sm:max-w-md text-sm"
                      style={{
                        fontFamily: "Nunito, sans-serif",
                        backgroundColor: msg.from === "user" ? "#2D6A4F" : "#F3F4F6",
                        color: msg.from === "user" ? "white" : "#374151",
                        borderRadius: msg.from === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                        lineHeight: 1.5,
                      }}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}

                {botLoading && (
                  <div className="flex items-center gap-2" style={{ animation: "msgIn 0.18s ease-out both" }}>
                    <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#D8F3DC" }}>
                      <span style={{ fontSize: "0.8rem" }}>🌿</span>
                    </div>
                    <div className="px-4 py-3" style={{ backgroundColor: "#F3F4F6", borderRadius: "16px 16px 16px 4px" }}>
                      <span className="flex gap-1 items-center h-4">
                        <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ backgroundColor: "#52B788", animationDelay: "0ms" }} />
                        <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ backgroundColor: "#52B788", animationDelay: "150ms" }} />
                        <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ backgroundColor: "#52B788", animationDelay: "300ms" }} />
                      </span>
                    </div>
                  </div>
                )}

                <div ref={botBottomRef} />
              </div>

              <div className="px-4 pb-3 flex flex-wrap gap-2" style={{ borderTop: "1px solid #F3F4F6" }}>
                {botSuggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => sendBotMessage(s)}
                    className="px-3 py-1 rounded-full text-xs transition-opacity hover:opacity-70"
                    style={{ backgroundColor: "#D8F3DC", color: "#2D6A4F", fontFamily: "Nunito, sans-serif", fontWeight: 600 }}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <div className="flex gap-2 px-4 py-3" style={{ borderTop: "1px solid #E5E7EB" }}>
                <input
                  value={botInput}
                  onChange={(e) => setBotInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendBotMessage(botInput)}
                  placeholder="Pregunta sobre plásticos, cultivo, recetas..."
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none"
                  style={{ backgroundColor: "#F3F4F6", fontFamily: "Nunito, sans-serif", color: "#374151" }}
                />
                <button
                  onClick={() => sendBotMessage(botInput)}
                  disabled={botLoading}
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-opacity"
                  style={{ backgroundColor: "#2D6A4F", opacity: botLoading ? 0.5 : 1 }}
                >
                  <Send size={16} color="white" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
