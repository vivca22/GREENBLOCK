import { UserPlus, BookOpen, Bot, Trophy, GraduationCap, ShoppingBag, Star } from "lucide-react";
import type { GreenUser } from "../../../context/AuthContext";
import { SectionBadge, ClayCard, BigButton } from "../shared";

const benefits = [
  { icon: UserPlus, bg: "#D8F3DC", color: "#1B4332", border: "#95D5B2", title: "Cuenta gratuita", desc: "Crea tu perfil en segundos con Google. Sin tarjeta." },
  { icon: BookOpen, bg: "#DBEAFE", color: "#1D4ED8", border: "#93C5FD", title: "Guía personalizada", desc: "Instrucciones según el kit y el tipo de plástico." },
  { icon: Bot, bg: "#EDE9FE", color: "#5B21B6", border: "#C4B5FD", title: "GreenBot IA", desc: "Asistente entrenado en micorremediación disponible 24/7." },
  { icon: Trophy, bg: "#FEF3C7", color: "#92400E", border: "#FCD34D", title: "Green Points", desc: "Gana puntos por aprender, enviar fotos y referir amigos." },
  { icon: GraduationCap, bg: "#FCE7F3", color: "#9D174D", border: "#F9A8D4", title: "Módulos de aprendizaje", desc: "Cursos cortos con quiz. Aprende la ciencia detrás del hongo." },
  { icon: ShoppingBag, bg: "#FFF7ED", color: "#C2410C", border: "#FDBA74", title: "Tienda de puntos", desc: "Canjea puntos por skins, items y descuentos reales." },
];

interface RegisterBenefitsSectionProps {
  navigate: (path: string) => void;
  user: GreenUser | null;
}

export function RegisterBenefitsSection({ navigate, user }: RegisterBenefitsSectionProps) {
  return (
    <section className="w-full py-16 px-4" style={{ backgroundColor: "#F8F4EF" }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <SectionBadge text="Acceso gratuito" color="#FEF3C7" textColor="#92400E" icon={Star} />
          <h2 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, color: "#1B4332", fontSize: "clamp(1.6rem, 4vw, 2.2rem)", lineHeight: 1.2, marginBottom: "0.75rem" }}>
            Regístrate y desbloquea todo
          </h2>
          <p className="max-w-lg mx-auto text-sm" style={{ color: "#6B7280", lineHeight: 1.65 }}>
            Crear una cuenta es gratis y toma menos de 1 minuto con Google. Accede a tu guía personalizada, al asistente IA y al sistema de puntos.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {benefits.map((b) => (
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

        {!user && (
          <div className="text-center">
            <BigButton onClick={() => navigate("/register")}>
              <UserPlus size={18} />
              Crear cuenta gratis
            </BigButton>
          </div>
        )}
      </div>
    </section>
  );
}
