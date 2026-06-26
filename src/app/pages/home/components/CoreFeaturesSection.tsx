import { Recycle, Leaf, ShieldCheck, Sparkles } from "lucide-react";
import { SectionBadge, ClayCard } from "../shared";

const features = [
  { icon: Recycle, bg: "#D8F3DC", color: "#1B4332", border: "#95D5B2", title: "Degrada plástico", desc: "PET, HDPE, PP y LDPE se biodegradan gracias a las enzimas del micelio. Sin química." },
  { icon: Leaf, bg: "#DBEAFE", color: "#1D4ED8", border: "#93C5FD", title: "100% natural", desc: "Solo hongos, agua y plástico limpio. Sin reactivos, sin máquinas, sin residuos tóxicos." },
  { icon: ShieldCheck, bg: "#EDE9FE", color: "#5B21B6", border: "#C4B5FD", title: "Verificado en blockchain", desc: "Cada etapa de tu kit queda registrada en Polygon. Transparencia total e inmutable." },
];

export function CoreFeaturesSection() {
  return (
    <section className="w-full py-14 px-4" style={{ backgroundColor: "white" }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <SectionBadge text="Lo que hacemos" color="#D8F3DC" textColor="#1B4332" icon={Sparkles} />
          <h2 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "clamp(1.6rem, 4vw, 2.2rem)", color: "#1B4332", lineHeight: 1.2 }}>
            Ciencia + tecnología + hongos
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f) => (
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
  );
}
