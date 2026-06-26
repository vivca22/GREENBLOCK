import { UserPlus, ShieldCheck, Sparkles, Instagram } from "lucide-react";
import type { GreenUser } from "../../../context/AuthContext";
import { BigButton } from "../shared";

interface CtaSectionProps {
  navigate: (path: string) => void;
  user: GreenUser | null;
}

export function CtaSection({ navigate, user }: CtaSectionProps) {
  return (
    <section
      className="w-full py-16 px-4"
      style={{ background: "linear-gradient(160deg, #D8F3DC 0%, #B7E4C7 100%)", position: "relative", overflow: "hidden" }}
    >
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 500, height: 300, borderRadius: "50%", background: "radial-gradient(circle, #95D5B244 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

      <div className="max-w-2xl mx-auto text-center relative" style={{ zIndex: 10 }}>
        <div
          className="inline-flex items-center gap-2 mb-5 px-5 py-2.5 rounded-full"
          style={{ backgroundColor: "#1B4332", border: "3px solid #52B788", boxShadow: "0 4px 0 #1B433244" }}
        >
          <Sparkles size={16} color="#95D5B2" />
          <span style={{ color: "#95D5B2", fontWeight: 800, fontSize: "0.85rem", letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Únete al movimiento
          </span>
        </div>

        <h2 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, color: "#1B4332", fontSize: "clamp(1.8rem, 5vw, 2.8rem)", marginBottom: "0.75rem", lineHeight: 1.1 }}>
          Empieza hoy y salva el planeta
        </h2>
        <p className="mb-8 text-base" style={{ color: "#2D6A4F", lineHeight: 1.65, fontWeight: 600 }}>
          Regístrate gratis, pide tu kit y únete a la red de estudiantes que ya están degradando plástico con hongos.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {!user && (
            <BigButton onClick={() => navigate("/register")}>
              <UserPlus size={18} />
              Registrarse gratis
            </BigButton>
          )}
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
  );
}
