import { Leaf, Package, ChevronRight, ArrowRight } from "lucide-react";
import { greenBlockLogo, mushroomGrowingImg } from "../../../../assets";
import { BigButton } from "../shared";

interface HeroSectionProps {
  navigate: (path: string) => void;
}

export function HeroSection({ navigate }: HeroSectionProps) {
  return (
    <section
      className="w-full pt-14 pb-0 px-4"
      style={{
        background: "linear-gradient(160deg, #B7E4C7 0%, #D8F3DC 40%, #AAFF5E22 100%)",
        position: "relative",
      }}
    >
      <div style={{ position: "absolute", top: 20, left: -60, width: 220, height: 220, borderRadius: "50%", background: "radial-gradient(circle, #95D5B244 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "absolute", top: 40, right: -40, width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle, #52B78844 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

      <div className="max-w-6xl mx-auto flex flex-col items-center text-center gap-6 relative" style={{ zIndex: 10 }}>
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
              position: "absolute", bottom: -18, left: "50%", transform: "translateX(-50%)",
              whiteSpace: "nowrap", backgroundColor: "#1B4332",
              border: "3px solid #40C074", boxShadow: "0 4px 0 #40C07466, 0 6px 16px rgba(27,67,50,0.3)",
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
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
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
          style={{ width: "min(320px, 75vw)", boxShadow: "0 6px 0 #1B433233, 0 14px 36px rgba(27,67,50,0.15)", border: "4px solid #B7E4C7", marginBottom: 0 }}
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
  );
}
