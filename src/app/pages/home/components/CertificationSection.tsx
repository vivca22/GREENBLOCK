import { Award, Medal, Star, CheckCircle2, TreePine } from "lucide-react";
import { SectionBadge } from "../shared";

const certBenefits = [
  "Reducción documentada de residuos plásticos en el plantel",
  "Programa de ciencia ambiental con metodología validada",
  "Participación activa de alumnos en proyectos sustentables",
  "Registro en blockchain de cada acción de impacto",
  "Cumplimiento con criterios de educación ambiental SEP",
];

export function CertificationSection() {
  return (
    <section className="w-full py-16 px-4" style={{ backgroundColor: "#FFF7ED", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 20, right: -60, width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle, #FDE68A44 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

      <div className="max-w-6xl mx-auto relative" style={{ zIndex: 10 }}>
        <div className="text-center mb-12">
          <SectionBadge text="Logro oficial" color="#FEF3C7" textColor="#92400E" icon={Award} />
          <h2
            style={{
              fontFamily: "Nunito, sans-serif", fontWeight: 900,
              fontSize: "clamp(1.7rem, 4.5vw, 2.4rem)", lineHeight: 1.15,
              background: "linear-gradient(135deg, #92400E 0%, #F59E0B 60%, #92400E 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}
          >
            Certificación Ambiental Escolar
          </h2>
          <p className="mt-3 max-w-xl mx-auto" style={{ color: "#78350F", fontSize: "1.05rem", fontWeight: 600, lineHeight: 1.65 }}>
            Gracias al laboratorio y al programa GreenBlock, nuestra escuela obtuvo la certificación ambiental que reconoce nuestro compromiso real con el planeta.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-center">
          <div className="flex-shrink-0 flex flex-col items-center gap-4">
            <div
              className="flex flex-col items-center justify-center gap-3"
              style={{ width: 220, height: 220, borderRadius: "50%", background: "linear-gradient(135deg, #FDE68A 0%, #F59E0B 50%, #D97706 100%)", border: "5px solid #92400E", boxShadow: "0 8px 0 #92400E55, 0 16px 40px rgba(146,64,14,0.25)" }}
            >
              <Medal size={52} color="#92400E" />
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, color: "#92400E", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>Escuela</div>
                <div style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, color: "#1B4332", fontSize: "1rem", textTransform: "uppercase", letterSpacing: "0.04em" }}>Certificada</div>
                <div style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, color: "#92400E", fontSize: "0.85rem" }}>Ambiental</div>
              </div>
            </div>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => <Star key={i} size={22} fill="#F59E0B" color="#D97706" />)}
            </div>
          </div>

          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {certBenefits.map((b, i) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-3xl" style={{ backgroundColor: "white", border: "3px solid #FCD34D", boxShadow: "0 3px 0 #FCD34D" }}>
                <div className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#FEF3C7", border: "2px solid #FCD34D" }}>
                  <CheckCircle2 size={16} color="#D97706" />
                </div>
                <p style={{ color: "#78350F", fontWeight: 700, fontSize: "0.9rem", lineHeight: 1.55 }}>{b}</p>
              </div>
            ))}
            <div className="flex items-center gap-3 p-4 rounded-3xl sm:col-span-2" style={{ background: "linear-gradient(135deg, #1B4332 0%, #2D6A4F 100%)", border: "3px solid #40C074", boxShadow: "0 4px 0 #1B4332" }}>
              <TreePine size={28} color="#95D5B2" />
              <p style={{ color: "white", fontWeight: 800, fontSize: "0.95rem", lineHeight: 1.5 }}>
                La certificación convierte a nuestra escuela en un referente de educación ambiental en la región.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
