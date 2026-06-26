import { Microscope, Users, Beaker, Zap } from "lucide-react";
import { labGreenBlockVideo } from "../../../../assets";
import { SectionBadge, ClayCard, VideoAutoplay } from "../shared";

const labFeatures = [
  { icon: Microscope, bg: "#D8F3DC", color: "#1B4332", border: "#95D5B2", title: "Laboratorio equipado", desc: "Microscopios, incubadoras y sustratos preparados para que cada alumno tenga su propio cultivo activo." },
  { icon: Users, bg: "#DBEAFE", color: "#1D4ED8", border: "#93C5FD", title: "400+ estudiantes activos", desc: "Alumnos de primaria a secundaria aprenden micología aplicada y monitorean sus hongos semana a semana." },
  { icon: Beaker, bg: "#EDE9FE", color: "#5B21B6", border: "#C4B5FD", title: "Experimentos reales", desc: "Cada grupo mide la degradación de plástico, registra datos y sube evidencia a GreenBlock." },
  { icon: Zap, bg: "#FFF7ED", color: "#C2410C", border: "#FDBA74", title: "Resultados en semanas", desc: "En solo 3 semanas los kits muestran colonización visible. Resultados que se pueden ver y medir." },
];

const stats = [
  { num: "400+", label: "Estudiantes", color: "#D8F3DC", border: "#95D5B2", tc: "#1B4332" },
  { num: "12", label: "Kits activos", color: "#DBEAFE", border: "#93C5FD", tc: "#1D4ED8" },
  { num: "5Kg", label: "Plástico degradado", color: "#FEF3C7", border: "#FCD34D", tc: "#92400E" },
  { num: "3 sem", label: "Primer resultado", color: "#EDE9FE", border: "#C4B5FD", tc: "#5B21B6" },
];

export function LabSection() {
  return (
    <section className="w-full py-16 px-4" style={{ backgroundColor: "#F0FDF4", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, right: 0, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, #D8F3DC 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

      <div className="max-w-6xl mx-auto relative" style={{ zIndex: 10 }}>
        <div className="text-center mb-12">
          <SectionBadge text="Laboratorio escolar" color="#AAFF5E55" textColor="#1B4332" icon={Microscope} />
          <h2
            style={{
              fontFamily: "Nunito, sans-serif", fontWeight: 900,
              fontSize: "clamp(1.7rem, 4.5vw, 2.4rem)", lineHeight: 1.15,
              background: "linear-gradient(135deg, #1B4332 0%, #40C074 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}
          >
            El laboratorio ya está en nuestra escuela
          </h2>
          <p className="mt-3 max-w-xl mx-auto" style={{ color: "#2D6A4F", fontSize: "1.05rem", fontWeight: 600, lineHeight: 1.65 }}>
            No es un sueño: tenemos un laboratorio de cultivo de hongos funcionando dentro de la escuela donde los estudiantes aprenden micorremediación de verdad.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
          {stats.map((s) => (
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

        <div className="mt-14">
          <VideoAutoplay src={labGreenBlockVideo} />
        </div>
      </div>
    </section>
  );
}
