import { useNavigate } from "react-router";
import {
  Recycle, Leaf, ShieldCheck, UserPlus, BookOpen, Bot, Trophy,
  GraduationCap, ShoppingBag, Package, ChefHat, TrendingUp,
  ClipboardList, Sprout, FlaskConical, ChevronRight, ArrowRight,
} from "lucide-react";
import { ImagePlaceholder } from "../components/ImagePlaceholder";

function SectionBadge({ text, color = "#D8F3DC", textColor = "#2D6A4F" }: { text: string; color?: string; textColor?: string }) {
  return (
    <span
      className="inline-block px-3 py-1 rounded-full text-xs mb-3"
      style={{ backgroundColor: color, color: textColor, fontFamily: "Nunito, sans-serif", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}
    >
      {text}
    </span>
  );
}

function FeatureIcon({ Icon, color, bg }: { Icon: React.ElementType; color: string; bg: string }) {
  return (
    <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: bg }}>
      <Icon size={20} color={color} />
    </div>
  );
}

const registerBenefits = [
  { icon: UserPlus, bg: "#D8F3DC", color: "#2D6A4F", title: "Cuenta gratuita", desc: "Crea tu perfil en segundos con Google. Sin tarjeta." },
  { icon: BookOpen, bg: "#DBEAFE", color: "#1D4ED8", title: "Guía personalizada", desc: "Instrucciones según el kit que compraste y el tipo de plástico." },
  { icon: Bot, bg: "#EDE9FE", color: "#5B21B6", title: "GreenBot IA", desc: "Asistente entrenado en micorremediación disponible 24/7." },
  { icon: Trophy, bg: "#FEF3C7", color: "#92400E", title: "Green Points", desc: "Gana puntos por aprender, enviar fotos y referir amigos." },
  { icon: GraduationCap, bg: "#FCE7F3", color: "#9D174D", title: "Módulos de aprendizaje", desc: "Cursos cortos con quiz. Aprende la ciencia detrás del hongo." },
  { icon: ShoppingBag, bg: "#D8F3DC", color: "#2D6A4F", title: "Tienda de puntos", desc: "Canjea puntos por skins, items para tu hongo y descuentos reales." },
];

const purchaseBenefits = [
  { icon: Package, bg: "#1B4332", color: "#95D5B2", title: "Kit con lote verificado", desc: "Cada kit tiene un ID de lote único registrado en blockchain. Sabes exactamente de dónde viene." },
  { icon: ShieldCheck, bg: "#1B4332", color: "#95D5B2", title: "Trazabilidad total", desc: "Sigue tu pedido en tiempo real: fabricación, empaque, envío y entrega verificados on-chain." },
  { icon: Recycle, bg: "#1B4332", color: "#95D5B2", title: "Degrada plástico real", desc: "Tu hongo descompone PET, HDPE, PP y LDPE. Con instrucciones específicas para cada tipo." },
  { icon: ChefHat, bg: "#1B4332", color: "#95D5B2", title: "Recetas incluidas", desc: "Cosecha hongos comestibles de tu kit y cocínalos. Instrucciones de cultivo y recetas culinarias." },
  { icon: ClipboardList, bg: "#1B4332", color: "#95D5B2", title: "Guía paso a paso", desc: "8 pasos ilustrados desde preparar el plástico hasta la cosecha final." },
  { icon: TrendingUp, bg: "#1B4332", color: "#95D5B2", title: "Impacto medible", desc: "Calcula el plástico degradado en gramos. Comparte tu huella positiva." },
];

const howItWorks = [
  { icon: Sprout, color: "#2D6A4F", bg: "#D8F3DC", step: "01", title: "El hongo crece", desc: "El micelio coloniza el sustrato con el plástico preparado en 7–14 días a 18–24°C." },
  { icon: FlaskConical, color: "#1D4ED8", bg: "#DBEAFE", step: "02", title: "Las enzimas degradan el plástico", desc: "Las lacasas producidas por el micelio rompen las cadenas de polímeros del plástico." },
  { icon: Leaf, color: "#2D6A4F", bg: "#D8F3DC", step: "03", title: "Suelo limpio + cosecha", desc: "El plástico se mineraliza. Cosechas hongos comestibles y un sustrato sin toxinas." },
];

export function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: "Nunito, sans-serif" }}>

      {/* ─── HERO ─── */}
      <section className="w-full py-16 px-4" style={{ backgroundColor: "#D8F3DC" }}>
        <div className="max-w-6xl mx-auto flex flex-col items-center text-center gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5" style={{ backgroundColor: "#95D5B2" }}>
              <Leaf size={14} color="#1B4332" />
              <span style={{ color: "#1B4332", fontWeight: 700, fontSize: "0.8rem" }}>Plataforma de micorremediación</span>
            </div>
            <h1 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "clamp(2rem, 5vw, 3rem)", color: "#1B4332", lineHeight: 1.15 }}>
              Fungi que salvan el planeta
            </h1>
            <p className="mt-4" style={{ color: "#2D6A4F", fontSize: "1.1rem", fontWeight: 600, lineHeight: 1.6 }}>
              Cada kit Green Block degrada plástico real y produce hongos comestibles.<br />
              Trazado en blockchain. Verificado por la ciencia.
            </p>
          </div>
          <ImagePlaceholder
            label="AI image: oyster mushroom growing on colorful plastic"
            height="h-72"
            className="w-full max-w-2xl"
          />
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate("/request")}
              className="flex items-center gap-2 px-8 py-3 rounded-xl transition-opacity hover:opacity-80"
              style={{ backgroundColor: "#2D6A4F", color: "white", fontWeight: 700, fontSize: "1rem" }}
            >
              Pedir un kit
              <ArrowRight size={18} />
            </button>
            <button
              onClick={() => document.getElementById("como-funciona")?.scrollIntoView({ behavior: "smooth" })}
              className="flex items-center gap-2 px-8 py-3 rounded-xl transition-opacity hover:opacity-80"
              style={{ backgroundColor: "white", color: "#2D6A4F", fontWeight: 700, border: "2px solid #52B788", fontSize: "1rem" }}
            >
              Cómo funciona
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* ─── CORE FEATURES ROW ─── */}
      <section className="w-full py-12 px-4" style={{ backgroundColor: "white" }}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Recycle, bg: "#D8F3DC", color: "#2D6A4F", title: "Degrada plástico", desc: "PET, HDPE, PP y LDPE se biodegradan gracias a las enzimas del micelio. Sin química." },
            { icon: Leaf, bg: "#DBEAFE", color: "#1D4ED8", title: "100% natural", desc: "Solo hongos, agua y plástico limpio. Sin reactivos, sin máquinas, sin residuos tóxicos." },
            { icon: ShieldCheck, bg: "#EDE9FE", color: "#5B21B6", title: "Verificado en blockchain", desc: "Cada etapa de tu kit queda registrada en Polygon. Transparencia total e inmutable." },
          ].map((f) => (
            <div key={f.title} className="p-6 rounded-2xl" style={{ backgroundColor: f.bg }}>
              <f.icon size={32} color={f.color} style={{ marginBottom: "1rem" }} />
              <h3 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, color: "#1B4332", marginBottom: "0.4rem" }}>{f.title}</h3>
              <p className="text-sm" style={{ color: "#4B5563", lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── REGISTER BENEFITS ─── */}
      <section className="w-full py-16 px-4" style={{ backgroundColor: "#F8F4EF" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <SectionBadge text="Acceso gratuito" />
            <h2 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, color: "#1B4332", fontSize: "1.9rem", lineHeight: 1.2, marginBottom: "0.75rem" }}>
              Regístrate y desbloquea todo
            </h2>
            <p className="max-w-lg mx-auto text-sm" style={{ color: "#6B7280", lineHeight: 1.6 }}>
              Crear una cuenta es gratis y toma menos de 1 minuto con Google. Accede a tu guía personalizada, al asistente IA y al sistema de puntos.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {registerBenefits.map((b) => (
              <div key={b.title} className="flex items-start gap-4 p-5 rounded-2xl" style={{ backgroundColor: "white", border: "1px solid #E5E7EB" }}>
                <FeatureIcon Icon={b.icon} color={b.color} bg={b.bg} />
                <div>
                  <p style={{ fontWeight: 700, color: "#1B4332", marginBottom: "0.2rem" }}>{b.title}</p>
                  <p className="text-sm" style={{ color: "#6B7280", lineHeight: 1.5 }}>{b.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={() => navigate("/register")}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl transition-opacity hover:opacity-80"
              style={{ backgroundColor: "#2D6A4F", color: "white", fontWeight: 700, fontSize: "1rem" }}
            >
              <UserPlus size={18} />
              Crear cuenta gratis
            </button>
          </div>
        </div>
      </section>

      {/* ─── PURCHASE BENEFITS ─── */}
      <section className="w-full py-16 px-4" style={{ backgroundColor: "#1B4332" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <SectionBadge text="Con tu kit" color="#2D6A4F" textColor="#95D5B2" />
            <h2 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, color: "white", fontSize: "1.9rem", lineHeight: 1.2, marginBottom: "0.75rem" }}>
              Lo que obtienes cuando compras
            </h2>
            <p className="max-w-lg mx-auto text-sm" style={{ color: "#95D5B2", lineHeight: 1.6 }}>
              Cada pedido incluye mucho más que un kit de hongos. Es una experiencia completa de ciencia, tecnología y gastronomía.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {purchaseBenefits.map((b) => (
              <div key={b.title} className="flex items-start gap-4 p-5 rounded-2xl" style={{ backgroundColor: "#2D6A4F", border: "1px solid rgba(149,213,178,0.2)" }}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "rgba(149,213,178,0.15)" }}>
                  <b.icon size={20} color="#95D5B2" />
                </div>
                <div>
                  <p style={{ fontWeight: 700, color: "white", marginBottom: "0.2rem" }}>{b.title}</p>
                  <p className="text-sm" style={{ color: "#95D5B2", lineHeight: 1.5 }}>{b.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={() => navigate("/request")}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl transition-opacity hover:opacity-80"
              style={{ backgroundColor: "#52B788", color: "#1B4332", fontWeight: 700, fontSize: "1rem" }}
            >
              <Package size={18} />
              Ver catálogo de kits
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section id="como-funciona" className="w-full py-16 px-4" style={{ backgroundColor: "white" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <SectionBadge text="La ciencia" />
            <h2 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, color: "#1B4332", fontSize: "1.9rem" }}>
              La ciencia de la micorremediación
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <ImagePlaceholder label="AI image: diagram of fungi degrading plastic polymer chains" height="h-72" className="w-full" />
            <div className="flex flex-col gap-6">
              {howItWorks.map((step) => (
                <div key={step.step} className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: step.bg }}>
                    <step.icon size={22} color={step.color} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs" style={{ color: step.color, fontWeight: 700, letterSpacing: "0.05em" }}>{step.step}</span>
                      <p style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, color: "#1B4332" }}>{step.title}</p>
                    </div>
                    <p className="text-sm" style={{ color: "#4B5563", lineHeight: 1.6 }}>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA FINAL ─── */}
      <section className="w-full py-14 px-4" style={{ backgroundColor: "#D8F3DC" }}>
        <div className="max-w-2xl mx-auto text-center">
          <h2 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, color: "#1B4332", fontSize: "1.8rem", marginBottom: "0.75rem" }}>
            Empieza hoy
          </h2>
          <p className="mb-6 text-sm" style={{ color: "#2D6A4F", lineHeight: 1.6 }}>
            Regístrate gratis, pide tu kit y únete a la red de estudiantes que ya están degradando plástico con hongos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/register")}
              className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl transition-opacity hover:opacity-80"
              style={{ backgroundColor: "#2D6A4F", color: "white", fontWeight: 700 }}
            >
              <UserPlus size={18} />
              Registrarse gratis
            </button>
            <button
              onClick={() => navigate("/trazabilidad")}
              className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl transition-opacity hover:opacity-80"
              style={{ backgroundColor: "white", color: "#2D6A4F", fontWeight: 700, border: "2px solid #52B788" }}
            >
              <ShieldCheck size={18} />
              Verificar un lote
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
