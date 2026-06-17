import { useNavigate } from "react-router";
import {
  Recycle, Leaf, ShieldCheck, UserPlus, BookOpen, Bot, Trophy,
  GraduationCap, ShoppingBag, Package, ChefHat, TrendingUp,
  ClipboardList, Sprout, FlaskConical, ChevronRight, ArrowRight,
  Microscope, Award, Star, Users, Beaker, TreePine, Medal, Sparkles,
  CheckCircle2, Zap, Instagram,
} from "lucide-react";
import { diagramFlow, greenBlockLogo, mushroomGrowingImg } from "../../assets";

// ─── WAVE DIVIDER ───────────────────────────────────────────────────────────
function WaveDivider({ topColor, bottomColor, flip = false }: { topColor: string; bottomColor: string; flip?: boolean }) {
  return (
    <div style={{ backgroundColor: topColor, lineHeight: 0, marginBottom: "-1px" }}>
      <svg
        viewBox="0 0 1440 80"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        style={{ display: "block", width: "100%", height: "80px", transform: flip ? "scaleY(-1)" : undefined }}
      >
        <path
          d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z"
          fill={bottomColor}
        />
      </svg>
    </div>
  );
}

// ─── SECTION BADGE ───────────────────────────────────────────────────────────
function SectionBadge({ text, color = "#D8F3DC", textColor = "#1B4332", icon: Icon }: {
  text: string; color?: string; textColor?: string; icon?: React.ElementType
}) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs mb-4"
      style={{
        backgroundColor: color, color: textColor,
        fontFamily: "Nunito, sans-serif", fontWeight: 800,
        letterSpacing: "0.07em", textTransform: "uppercase",
        border: `2px solid ${textColor}22`,
        boxShadow: `0 2px 8px ${color}99`,
      }}
    >
      {Icon && <Icon size={12} />}
      {text}
    </span>
  );
}

// ─── CLAY CARD ───────────────────────────────────────────────────────────────
function ClayCard({ children, bg = "white", border = "#E5E7EB", className = "" }: {
  children: React.ReactNode; bg?: string; border?: string; className?: string
}) {
  return (
    <div
      className={`p-5 rounded-3xl transition-transform duration-200 cursor-default ${className}`}
      style={{
        backgroundColor: bg,
        border: `3px solid ${border}`,
        boxShadow: "0 4px 0 0 rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.07)",
      }}
      onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-3px)")}
      onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}
    >
      {children}
    </div>
  );
}

// ─── BIG CTA BUTTON ──────────────────────────────────────────────────────────
function BigButton({ onClick, children, variant = "primary" }: {
  onClick?: () => void; children: React.ReactNode; variant?: "primary" | "outline"
}) {
  const isPrimary = variant === "primary";
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-black text-base cursor-pointer transition-all duration-200"
      style={{
        background: isPrimary ? "linear-gradient(135deg, #2D6A4F 0%, #40C074 100%)" : "white",
        color: isPrimary ? "white" : "#2D6A4F",
        border: isPrimary ? "3px solid #1B4332" : "3px solid #52B788",
        boxShadow: isPrimary ? "0 5px 0 #1B4332, 0 8px 20px rgba(45,106,79,0.3)" : "0 5px 0 #B7E4C7, 0 8px 16px rgba(82,183,136,0.2)",
        fontFamily: "Nunito, sans-serif",
        letterSpacing: "0.02em",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = isPrimary
          ? "0 7px 0 #1B4332, 0 12px 28px rgba(45,106,79,0.35)"
          : "0 7px 0 #B7E4C7, 0 12px 20px rgba(82,183,136,0.25)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = isPrimary
          ? "0 5px 0 #1B4332, 0 8px 20px rgba(45,106,79,0.3)"
          : "0 5px 0 #B7E4C7, 0 8px 16px rgba(82,183,136,0.2)";
      }}
      onMouseDown={e => { e.currentTarget.style.transform = "translateY(3px)"; }}
      onMouseUp={e => { e.currentTarget.style.transform = "translateY(-2px)"; }}
    >
      {children}
    </button>
  );
}

// ─── DATA ────────────────────────────────────────────────────────────────────

const registerBenefits = [
  { icon: UserPlus, bg: "#D8F3DC", color: "#1B4332", border: "#95D5B2", title: "Cuenta gratuita", desc: "Crea tu perfil en segundos con Google. Sin tarjeta." },
  { icon: BookOpen, bg: "#DBEAFE", color: "#1D4ED8", border: "#93C5FD", title: "Guía personalizada", desc: "Instrucciones según el kit y el tipo de plástico." },
  { icon: Bot, bg: "#EDE9FE", color: "#5B21B6", border: "#C4B5FD", title: "GreenBot IA", desc: "Asistente entrenado en micorremediación disponible 24/7." },
  { icon: Trophy, bg: "#FEF3C7", color: "#92400E", border: "#FCD34D", title: "Green Points", desc: "Gana puntos por aprender, enviar fotos y referir amigos." },
  { icon: GraduationCap, bg: "#FCE7F3", color: "#9D174D", border: "#F9A8D4", title: "Módulos de aprendizaje", desc: "Cursos cortos con quiz. Aprende la ciencia detrás del hongo." },
  { icon: ShoppingBag, bg: "#FFF7ED", color: "#C2410C", border: "#FDBA74", title: "Tienda de puntos", desc: "Canjea puntos por skins, items y descuentos reales." },
];

const purchaseBenefits = [
  { icon: Package, title: "Kit con lote verificado", desc: "Cada kit tiene un ID único registrado en blockchain. Sabes exactamente de dónde viene." },
  { icon: ShieldCheck, title: "Trazabilidad total", desc: "Sigue tu pedido en tiempo real: fabricación, empaque, envío y entrega verificados on-chain." },
  { icon: Recycle, title: "Degrada plástico real", desc: "Tu hongo descompone PET, HDPE, PP y LDPE. Con instrucciones específicas para cada tipo." },
  { icon: ChefHat, title: "Recetas incluidas", desc: "Cosecha hongos comestibles de tu kit y cocínalos. Instrucciones de cultivo y recetas culinarias." },
  { icon: ClipboardList, title: "Guía paso a paso", desc: "8 pasos ilustrados desde preparar el plástico hasta la cosecha final." },
  { icon: TrendingUp, title: "Impacto medible", desc: "Calcula el plástico degradado en gramos. Comparte tu huella positiva." },
];

const howItWorks = [
  { icon: Sprout, color: "#2D6A4F", bg: "#D8F3DC", border: "#95D5B2", step: "01", title: "El hongo crece", desc: "El micelio coloniza el sustrato con el plástico preparado en 7–14 días a 18–24°C." },
  { icon: FlaskConical, color: "#1D4ED8", bg: "#DBEAFE", border: "#93C5FD", step: "02", title: "Las enzimas degradan el plástico", desc: "Las lacasas producidas por el micelio rompen las cadenas de polímeros del plástico." },
  { icon: Leaf, color: "#2D6A4F", bg: "#D8F3DC", border: "#95D5B2", step: "03", title: "Suelo limpio + cosecha", desc: "El plástico se mineraliza. Cosechas hongos comestibles y un sustrato sin toxinas." },
];

const labFeatures = [
  { icon: Microscope, bg: "#D8F3DC", color: "#1B4332", border: "#95D5B2", title: "Laboratorio equipado", desc: "Microscopios, incubadoras y sustratos preparados para que cada alumno tenga su propio cultivo activo." },
  { icon: Users, bg: "#DBEAFE", color: "#1D4ED8", border: "#93C5FD", title: "400+ estudiantes activos", desc: "Alumnos de primaria a secundaria aprenden micología aplicada y monitorean sus hongos semana a semana." },
  { icon: Beaker, bg: "#EDE9FE", color: "#5B21B6", border: "#C4B5FD", title: "Experimentos reales", desc: "Cada grupo mide la degradación de plástico, registra datos y sube evidencia a GreenBlock." },
  { icon: Zap, bg: "#FFF7ED", color: "#C2410C", border: "#FDBA74", title: "Resultados en semanas", desc: "En solo 3 semanas los kits muestran colonización visible. Resultados que se pueden ver y medir." },
];

const certBenefits = [
  "Reducción documentada de residuos plásticos en el plantel",
  "Programa de ciencia ambiental con metodología validada",
  "Participación activa de alumnos en proyectos sustentables",
  "Registro en blockchain de cada acción de impacto",
  "Cumplimiento con criterios de educación ambiental SEP",
];

// ─── HOME PAGE ───────────────────────────────────────────────────────────────

export function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: "Nunito, sans-serif", overflowX: "hidden" }}>

      {/* ─── HERO ─────────────────────────────────────────────────────────── */}
      <section
        className="w-full pt-14 pb-0 px-4"
        style={{
          background: "linear-gradient(160deg, #B7E4C7 0%, #D8F3DC 40%, #AAFF5E22 100%)",
          position: "relative",
        }}
      >
        {/* Decorative blobs */}
        <div style={{ position: "absolute", top: 20, left: -60, width: 220, height: 220, borderRadius: "50%", background: "radial-gradient(circle, #95D5B244 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: 40, right: -40, width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle, #52B78844 0%, transparent 70%)", pointerEvents: "none" }} />

        <div className="max-w-6xl mx-auto flex flex-col items-center text-center gap-6">
          <div style={{ position: "relative", display: "inline-block" }}>
            <img
              src={greenBlockLogo}
              alt="Logo de GreenBlock"
              className="mx-auto h-auto rounded-3xl"
              style={{ width: "min(440px, 85vw)", display: "block", boxShadow: "0 8px 0 #1B433240, 0 16px 40px rgba(27,67,50,0.18)", border: "4px solid #1B4332" }}
            />
            <div
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full"
              style={{
                position: "absolute",
                bottom: -18,
                left: "50%",
                transform: "translateX(-50%)",
                whiteSpace: "nowrap",
                backgroundColor: "#1B4332",
                border: "3px solid #40C074",
                boxShadow: "0 4px 0 #40C07466, 0 6px 16px rgba(27,67,50,0.3)",
              }}
            >
              <Leaf size={14} color="#95D5B2" />
              <span style={{ color: "#95D5B2", fontWeight: 800, fontSize: "0.78rem", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                Plataforma de micorremediación
              </span>
            </div>
          </div>

          <h1
            style={{
              fontFamily: "Nunito, sans-serif", fontWeight: 900,
              fontSize: "clamp(2.2rem, 6vw, 3.5rem)", lineHeight: 1.1,
              background: "linear-gradient(135deg, #1B4332 0%, #2D6A4F 50%, #40C074 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            GreenBlock salva<br />el planeta
          </h1>

          <p style={{ color: "#2D6A4F", fontSize: "1.15rem", fontWeight: 700, lineHeight: 1.65, maxWidth: 520 }}>
            Cada kit GreenBlock degrada plástico real y produce hongos comestibles.{" "}
            <span style={{ color: "#1B4332" }}>Trazado en blockchain. Verificado por la ciencia.</span>
          </p>

          <img
            src={mushroomGrowingImg}
            alt="Hongo ostra creciendo sobre plástico colorido"
            className="h-auto rounded-3xl"
            style={{
              width: "min(320px, 75vw)",
              boxShadow: "0 6px 0 #1B433233, 0 14px 36px rgba(27,67,50,0.15)",
              border: "4px solid #B7E4C7",
              marginBottom: 0,
            }}
          />

          <div className="flex flex-col sm:flex-row gap-4 pb-4">
            <BigButton onClick={() => navigate("/request")}>
              <Package size={18} />
              Pedir un kit
              <ArrowRight size={18} />
            </BigButton>
            <BigButton variant="outline" onClick={() => document.getElementById("como-funciona")?.scrollIntoView({ behavior: "smooth" })}>
              Cómo funciona
              <ChevronRight size={18} />
            </BigButton>
          </div>
        </div>
      </section>

      <WaveDivider topColor="#D8F3DC" bottomColor="white" />

      {/* ─── CORE FEATURES ────────────────────────────────────────────────── */}
      <section className="w-full py-14 px-4" style={{ backgroundColor: "white" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <SectionBadge text="Lo que hacemos" color="#D8F3DC" textColor="#1B4332" icon={Sparkles} />
            <h2 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "clamp(1.6rem, 4vw, 2.2rem)", color: "#1B4332", lineHeight: 1.2 }}>
              Ciencia + tecnología + hongos
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Recycle, bg: "#D8F3DC", color: "#1B4332", border: "#95D5B2", title: "Degrada plástico", desc: "PET, HDPE, PP y LDPE se biodegradan gracias a las enzimas del micelio. Sin química." },
              { icon: Leaf, bg: "#DBEAFE", color: "#1D4ED8", border: "#93C5FD", title: "100% natural", desc: "Solo hongos, agua y plástico limpio. Sin reactivos, sin máquinas, sin residuos tóxicos." },
              { icon: ShieldCheck, bg: "#EDE9FE", color: "#5B21B6", border: "#C4B5FD", title: "Verificado en blockchain", desc: "Cada etapa de tu kit queda registrada en Polygon. Transparencia total e inmutable." },
            ].map((f) => (
              <ClayCard key={f.title} bg={f.bg} border={f.border}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: `${f.color}22`, border: `2px solid ${f.border}` }}>
                  <f.icon size={28} color={f.color} />
                </div>
                <h3 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, color: "#1B4332", fontSize: "1.05rem", marginBottom: "0.4rem" }}>{f.title}</h3>
                <p className="text-sm" style={{ color: "#4B5563", lineHeight: 1.65 }}>{f.desc}</p>
              </ClayCard>
            ))}
          </div>
        </div>
      </section>

      <WaveDivider topColor="white" bottomColor="#F0FDF4" />

      {/* ─── LAB ESCOLAR ──────────────────────────────────────────────────── */}
      <section className="w-full py-16 px-4" style={{ backgroundColor: "#F0FDF4", position: "relative" }}>
        <div style={{ position: "absolute", top: 0, right: 0, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, #D8F3DC 0%, transparent 70%)", pointerEvents: "none" }} />

        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <SectionBadge text="Laboratorio escolar" color="#AAFF5E55" textColor="#1B4332" icon={Microscope} />
            <h2
              style={{
                fontFamily: "Nunito, sans-serif", fontWeight: 900,
                fontSize: "clamp(1.7rem, 4.5vw, 2.4rem)", lineHeight: 1.15,
                background: "linear-gradient(135deg, #1B4332 0%, #40C074 100%)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              El laboratorio ya esta en nuestra escuela
            </h2>
            <p className="mt-3 max-w-xl mx-auto" style={{ color: "#2D6A4F", fontSize: "1.05rem", fontWeight: 600, lineHeight: 1.65 }}>
              No es un sueño: tenemos un laboratorio de cultivo de hongos funcionando dentro de la escuela donde los estudiantes aprenden micorremediacion de verdad.
            </p>
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
            {[
              { num: "400+", label: "Estudiantes", color: "#D8F3DC", border: "#95D5B2", tc: "#1B4332" },
              { num: "12", label: "Kits activos", color: "#DBEAFE", border: "#93C5FD", tc: "#1D4ED8" },
              { num: "5Kg", label: "Plástico degradado", color: "#FEF3C7", border: "#FCD34D", tc: "#92400E" },
              { num: "3 sem", label: "Primer resultado", color: "#EDE9FE", border: "#C4B5FD", tc: "#5B21B6" },
            ].map((s) => (
              <div
                key={s.label}
                className="text-center py-5 px-3 rounded-3xl"
                style={{ backgroundColor: s.color, border: `3px solid ${s.border}`, boxShadow: `0 4px 0 ${s.border}` }}
              >
                <div style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "2rem", color: s.tc, lineHeight: 1 }}>{s.num}</div>
                <div style={{ fontSize: "0.78rem", fontWeight: 700, color: s.tc + "BB", marginTop: "0.3rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {labFeatures.map((f) => (
              <ClayCard key={f.title} bg="white" border={f.border}>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3" style={{ backgroundColor: f.bg, border: `2px solid ${f.border}` }}>
                  <f.icon size={22} color={f.color} />
                </div>
                <h3 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, color: "#1B4332", fontSize: "0.95rem", marginBottom: "0.3rem" }}>{f.title}</h3>
                <p className="text-sm" style={{ color: "#6B7280", lineHeight: 1.6 }}>{f.desc}</p>
              </ClayCard>
            ))}
          </div>
        </div>
      </section>

      <WaveDivider topColor="#F0FDF4" bottomColor="#F8F4EF" />

      {/* ─── REGISTER BENEFITS ────────────────────────────────────────────── */}
      <section className="w-full py-16 px-4" style={{ backgroundColor: "#F8F4EF" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <SectionBadge text="Acceso gratuito" color="#FEF3C7" textColor="#92400E" icon={Star} />
            <h2 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, color: "#1B4332", fontSize: "clamp(1.6rem, 4vw, 2.2rem)", lineHeight: 1.2, marginBottom: "0.75rem" }}>
              Registrate y desbloquea todo
            </h2>
            <p className="max-w-lg mx-auto text-sm" style={{ color: "#6B7280", lineHeight: 1.65 }}>
              Crear una cuenta es gratis y toma menos de 1 minuto con Google. Accede a tu guia personalizada, al asistente IA y al sistema de puntos.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {registerBenefits.map((b) => (
              <ClayCard key={b.title} bg="white" border={b.border}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: b.bg, border: `2px solid ${b.border}` }}>
                    <b.icon size={20} color={b.color} />
                  </div>
                  <div>
                    <p style={{ fontWeight: 800, color: "#1B4332", marginBottom: "0.25rem", fontSize: "0.95rem" }}>{b.title}</p>
                    <p className="text-sm" style={{ color: "#6B7280", lineHeight: 1.55 }}>{b.desc}</p>
                  </div>
                </div>
              </ClayCard>
            ))}
          </div>

          <div className="text-center">
            <BigButton onClick={() => navigate("/register")}>
              <UserPlus size={18} />
              Crear cuenta gratis
            </BigButton>
          </div>
        </div>
      </section>

      <WaveDivider topColor="#F8F4EF" bottomColor="#1B4332" />

      {/* ─── PURCHASE BENEFITS ────────────────────────────────────────────── */}
      <section className="w-full py-16 px-4" style={{ backgroundColor: "#1B4332", position: "relative" }}>
        <div style={{ position: "absolute", bottom: 0, left: 0, width: 250, height: 250, borderRadius: "50%", background: "radial-gradient(circle, #2D6A4F 0%, transparent 70%)", pointerEvents: "none" }} />

        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <SectionBadge text="Con tu kit" color="#2D6A4F" textColor="#95D5B2" icon={Package} />
            <h2 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, color: "white", fontSize: "clamp(1.6rem, 4vw, 2.2rem)", lineHeight: 1.2, marginBottom: "0.75rem" }}>
              Lo que obtienes cuando compras
            </h2>
            <p className="max-w-lg mx-auto text-sm" style={{ color: "#95D5B2", lineHeight: 1.65 }}>
              Cada pedido incluye mucho mas que un kit de hongos. Es una experiencia completa de ciencia, tecnologia y gastronomia.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {purchaseBenefits.map((b) => (
              <div
                key={b.title}
                className="flex items-start gap-4 p-5 rounded-3xl transition-transform duration-200 cursor-default"
                style={{
                  backgroundColor: "#2D6A4F",
                  border: "3px solid rgba(149,213,178,0.3)",
                  boxShadow: "0 4px 0 rgba(149,213,178,0.15), 0 8px 24px rgba(0,0,0,0.15)",
                }}
                onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-3px)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}
              >
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "rgba(149,213,178,0.15)", border: "2px solid rgba(149,213,178,0.3)" }}>
                  <b.icon size={20} color="#95D5B2" />
                </div>
                <div>
                  <p style={{ fontWeight: 800, color: "white", marginBottom: "0.25rem", fontSize: "0.95rem" }}>{b.title}</p>
                  <p className="text-sm" style={{ color: "#95D5B2", lineHeight: 1.55 }}>{b.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={() => navigate("/request")}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-black text-base cursor-pointer transition-all duration-200"
              style={{
                background: "linear-gradient(135deg, #52B788 0%, #95D5B2 100%)",
                color: "#1B4332",
                border: "3px solid #95D5B2",
                boxShadow: "0 5px 0 #40C07488, 0 10px 24px rgba(82,183,136,0.3)",
                fontFamily: "Nunito, sans-serif",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <Package size={18} />
              Ver catalogo de kits
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      <WaveDivider topColor="#1B4332" bottomColor="white" />

      {/* ─── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section id="como-funciona" className="w-full py-16 px-4" style={{ backgroundColor: "white" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <SectionBadge text="La ciencia" color="#DBEAFE" textColor="#1D4ED8" icon={FlaskConical} />
            <h2
              style={{
                fontFamily: "Nunito, sans-serif", fontWeight: 900,
                fontSize: "clamp(1.6rem, 4vw, 2.2rem)",
                background: "linear-gradient(135deg, #1D4ED8 0%, #2D6A4F 100%)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              La ciencia de la micorremediacion
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <img
              src={diagramFlow}
              alt="Diagrama del proceso de micorremediacion"
              className="h-auto rounded-3xl mx-auto"
              style={{
                width: "min(420px, 90vw)",
                border: "4px solid #B7E4C7",
                boxShadow: "0 6px 0 #95D5B2, 0 16px 40px rgba(27,67,50,0.12)",
              }}
            />
            <div className="flex flex-col gap-5">
              {howItWorks.map((step) => (
                <div
                  key={step.step}
                  className="flex gap-4 items-start p-4 rounded-3xl transition-transform duration-200"
                  style={{
                    border: `3px solid ${step.border}`,
                    backgroundColor: `${step.bg}55`,
                    boxShadow: `0 3px 0 ${step.border}`,
                  }}
                  onMouseEnter={e => (e.currentTarget.style.transform = "translateX(4px)")}
                  onMouseLeave={e => (e.currentTarget.style.transform = "translateX(0)")}
                >
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: step.bg, border: `2px solid ${step.border}` }}>
                    <step.icon size={22} color={step.color} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ color: step.color, fontWeight: 800, backgroundColor: step.bg, border: `1px solid ${step.border}` }}>{step.step}</span>
                      <p style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, color: "#1B4332", fontSize: "0.95rem" }}>{step.title}</p>
                    </div>
                    <p className="text-sm" style={{ color: "#4B5563", lineHeight: 1.65 }}>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <WaveDivider topColor="white" bottomColor="#FFF7ED" />

      {/* ─── CERTIFICACION AMBIENTAL ──────────────────────────────────────── */}
      <section className="w-full py-16 px-4" style={{ backgroundColor: "#FFF7ED", position: "relative" }}>
        <div style={{ position: "absolute", top: 20, right: -60, width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle, #FDE68A44 0%, transparent 70%)", pointerEvents: "none" }} />

        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <SectionBadge text="Logro oficial" color="#FEF3C7" textColor="#92400E" icon={Award} />
            <h2
              style={{
                fontFamily: "Nunito, sans-serif", fontWeight: 900,
                fontSize: "clamp(1.7rem, 4.5vw, 2.4rem)", lineHeight: 1.15,
                background: "linear-gradient(135deg, #92400E 0%, #F59E0B 60%, #92400E 100%)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Certificacion Ambiental Escolar
            </h2>
            <p className="mt-3 max-w-xl mx-auto" style={{ color: "#78350F", fontSize: "1.05rem", fontWeight: 600, lineHeight: 1.65 }}>
              Gracias al laboratorio y al programa GreenBlock, nuestra escuela obtuvo la certificacion ambiental que reconoce nuestro compromiso real con el planeta.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-center">
            {/* Big badge */}
            <div className="flex-shrink-0 flex flex-col items-center gap-4">
              <div
                className="flex flex-col items-center justify-center gap-3"
                style={{
                  width: 220, height: 220,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #FDE68A 0%, #F59E0B 50%, #D97706 100%)",
                  border: "5px solid #92400E",
                  boxShadow: "0 8px 0 #92400E55, 0 16px 40px rgba(146,64,14,0.25)",
                }}
              >
                <Medal size={52} color="#92400E" />
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, color: "#92400E", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>Escuela</div>
                  <div style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, color: "#1B4332", fontSize: "1rem", textTransform: "uppercase", letterSpacing: "0.04em" }}>Certificada</div>
                  <div style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, color: "#92400E", fontSize: "0.85rem" }}>Ambiental</div>
                </div>
              </div>

              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={22} fill="#F59E0B" color="#D97706" />
                ))}
              </div>
            </div>

            {/* Benefits list */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {certBenefits.map((b, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-4 rounded-3xl"
                  style={{
                    backgroundColor: "white",
                    border: "3px solid #FCD34D",
                    boxShadow: "0 3px 0 #FCD34D",
                  }}
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#FEF3C7", border: "2px solid #FCD34D" }}>
                    <CheckCircle2 size={16} color="#D97706" />
                  </div>
                  <p style={{ color: "#78350F", fontWeight: 700, fontSize: "0.9rem", lineHeight: 1.55 }}>{b}</p>
                </div>
              ))}

              <div
                className="flex items-center gap-3 p-4 rounded-3xl sm:col-span-2"
                style={{
                  background: "linear-gradient(135deg, #1B4332 0%, #2D6A4F 100%)",
                  border: "3px solid #40C074",
                  boxShadow: "0 4px 0 #1B4332",
                }}
              >
                <TreePine size={28} color="#95D5B2" />
                <p style={{ color: "white", fontWeight: 800, fontSize: "0.95rem", lineHeight: 1.5 }}>
                  La certificacion convierte a nuestra escuela en un referente de educacion ambiental en la region.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <WaveDivider topColor="#FFF7ED" bottomColor="#D8F3DC" />

      {/* ─── CTA FINAL ────────────────────────────────────────────────────── */}
      <section
        className="w-full py-16 px-4"
        style={{ background: "linear-gradient(160deg, #D8F3DC 0%, #B7E4C7 100%)", position: "relative" }}
      >
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 500, height: 300, borderRadius: "50%", background: "radial-gradient(circle, #95D5B244 0%, transparent 70%)", pointerEvents: "none" }} />

        <div className="max-w-2xl mx-auto text-center relative">
          <div
            className="inline-flex items-center gap-2 mb-5 px-5 py-2.5 rounded-full"
            style={{ backgroundColor: "#1B4332", border: "3px solid #52B788", boxShadow: "0 4px 0 #1B433244" }}
          >
            <Sparkles size={16} color="#95D5B2" />
            <span style={{ color: "#95D5B2", fontWeight: 800, fontSize: "0.85rem", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Unete al movimiento
            </span>
          </div>

          <h2 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, color: "#1B4332", fontSize: "clamp(1.8rem, 5vw, 2.8rem)", marginBottom: "0.75rem", lineHeight: 1.1 }}>
            Empieza hoy y salva el planeta
          </h2>
          <p className="mb-8 text-base" style={{ color: "#2D6A4F", lineHeight: 1.65, fontWeight: 600 }}>
            Registrate gratis, pide tu kit y unete a la red de estudiantes que ya estan degradando plastico con hongos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <BigButton onClick={() => navigate("/register")}>
              <UserPlus size={18} />
              Registrarse gratis
            </BigButton>
            <BigButton variant="outline" onClick={() => navigate("/trazabilidad")}>
              <ShieldCheck size={18} />
              Verificar un lote
            </BigButton>
          </div>

          <a
            href="https://www.instagram.com/greenblockec?igsh=YmpvOXJ5YjM0ZTVo&utm_source=qr"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-full transition-opacity hover:opacity-80"
            style={{ backgroundColor: "#1B4332", color: "#95D5B2", fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: "0.9rem" }}
          >
            <Instagram size={16} />
            Síguenos en Instagram @greenblockec
          </a>
        </div>
      </section>
    </div>
  );
}
