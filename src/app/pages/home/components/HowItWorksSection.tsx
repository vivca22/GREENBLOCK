import { Sprout, FlaskConical, Leaf } from "lucide-react";
import { diagramFlow } from "../../../../assets";
import { SectionBadge } from "../shared";

const steps = [
  { icon: Sprout, color: "#2D6A4F", bg: "#D8F3DC", border: "#95D5B2", step: "01", title: "El hongo crece", desc: "El micelio coloniza el sustrato con el plástico preparado en 7–14 días a 18–24°C." },
  { icon: FlaskConical, color: "#1D4ED8", bg: "#DBEAFE", border: "#93C5FD", step: "02", title: "Las enzimas degradan el plástico", desc: "Las lacasas producidas por el micelio rompen las cadenas de polímeros del plástico." },
  { icon: Leaf, color: "#2D6A4F", bg: "#D8F3DC", border: "#95D5B2", step: "03", title: "Suelo limpio + cosecha", desc: "El plástico se mineraliza. Cosechas hongos comestibles y un sustrato sin toxinas." },
];

export function HowItWorksSection() {
  return (
    <section id="como-funciona" className="w-full py-16 px-4" style={{ backgroundColor: "white" }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <SectionBadge text="La ciencia" color="#DBEAFE" textColor="#1D4ED8" icon={FlaskConical} />
          <h2
            style={{
              fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "clamp(1.6rem, 4vw, 2.2rem)",
              background: "linear-gradient(135deg, #1D4ED8 0%, #2D6A4F 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}
          >
            La ciencia de la micorremediación
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <img
            src={diagramFlow}
            alt="Diagrama del proceso de micorremediación"
            className="h-auto rounded-3xl mx-auto"
            style={{ width: "min(420px, 90vw)", border: "4px solid #B7E4C7", boxShadow: "0 6px 0 #95D5B2, 0 16px 40px rgba(27,67,50,0.12)" }}
          />
          <div className="flex flex-col gap-5">
            {steps.map((step) => (
              <div
                key={step.step}
                className="flex gap-4 items-start p-4 rounded-3xl transition-transform duration-200"
                style={{ border: `3px solid ${step.border}`, backgroundColor: `${step.bg}55`, boxShadow: `0 3px 0 ${step.border}` }}
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
  );
}
