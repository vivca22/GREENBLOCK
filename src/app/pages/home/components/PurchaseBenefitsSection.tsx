import { Package, ShieldCheck, Recycle, ChefHat, ClipboardList, TrendingUp, ArrowRight } from "lucide-react";
import { SectionBadge } from "../shared";

const benefits = [
  { icon: Package, title: "Kit con lote verificado", desc: "Cada kit tiene un ID único registrado en blockchain. Sabes exactamente de dónde viene." },
  { icon: ShieldCheck, title: "Trazabilidad total", desc: "Sigue tu pedido en tiempo real: fabricación, empaque, envío y entrega verificados on-chain." },
  { icon: Recycle, title: "Degrada plástico real", desc: "Tu hongo descompone PET, HDPE, PP y LDPE. Con instrucciones específicas para cada tipo." },
  { icon: ChefHat, title: "Recetas incluidas", desc: "Cosecha hongos comestibles de tu kit y cocínalos. Instrucciones de cultivo y recetas culinarias." },
  { icon: ClipboardList, title: "Guía paso a paso", desc: "8 pasos ilustrados desde preparar el plástico hasta la cosecha final." },
  { icon: TrendingUp, title: "Impacto medible", desc: "Calcula el plástico degradado en gramos. Comparte tu huella positiva." },
];

interface PurchaseBenefitsSectionProps {
  navigate: (path: string) => void;
}

export function PurchaseBenefitsSection({ navigate }: PurchaseBenefitsSectionProps) {
  return (
    <section className="w-full py-16 px-4" style={{ backgroundColor: "#1B4332", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", bottom: 0, left: 0, width: 250, height: 250, borderRadius: "50%", background: "radial-gradient(circle, #2D6A4F 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

      <div className="max-w-6xl mx-auto relative" style={{ zIndex: 10 }}>
        <div className="text-center mb-10">
          <SectionBadge text="Con tu kit" color="#2D6A4F" textColor="#95D5B2" icon={Package} />
          <h2 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, color: "white", fontSize: "clamp(1.6rem, 4vw, 2.2rem)", lineHeight: 1.2, marginBottom: "0.75rem" }}>
            Lo que obtienes cuando compras
          </h2>
          <p className="max-w-lg mx-auto text-sm" style={{ color: "#95D5B2", lineHeight: 1.65 }}>
            Cada pedido incluye mucho más que un kit de hongos. Es una experiencia completa de ciencia, tecnología y gastronomía.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {benefits.map((b) => (
            <div
              key={b.title}
              className="flex items-start gap-4 p-5 rounded-3xl transition-transform duration-200 cursor-default"
              style={{ backgroundColor: "#2D6A4F", border: "3px solid rgba(149,213,178,0.3)", boxShadow: "0 4px 0 rgba(149,213,178,0.15), 0 8px 24px rgba(0,0,0,0.15)" }}
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
            style={{ background: "linear-gradient(135deg, #52B788 0%, #95D5B2 100%)", color: "#1B4332", border: "3px solid #95D5B2", boxShadow: "0 5px 0 #40C07488, 0 10px 24px rgba(82,183,136,0.3)", fontFamily: "Nunito, sans-serif" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}
          >
            <Package size={18} />
            Ver catálogo de kits
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
