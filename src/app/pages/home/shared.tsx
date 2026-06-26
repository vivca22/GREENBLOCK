import { useRef, useEffect } from "react";

export function VideoAutoplay({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (videoRef.current) {
          if (entry.isIntersecting) videoRef.current.play();
          else videoRef.current.pause();
        }
      },
      { threshold: 0.7 }
    );
    if (videoRef.current) observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={videoRef}
      src={src}
      muted
      loop
      playsInline
      className="w-full h-auto rounded-3xl"
      style={{
        boxShadow: "0 8px 0 #95D5B2, 0 16px 40px rgba(27,67,50,0.12)",
        border: "4px solid #B7E4C7",
        maxWidth: "100%",
      }}
    />
  );
}

export function WaveDivider({ topColor, bottomColor, flip = false }: { topColor: string; bottomColor: string; flip?: boolean }) {
  return (
    <div style={{ backgroundColor: topColor, lineHeight: 0, marginBottom: "-1px" }}>
      <svg
        viewBox="0 0 1440 80"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        style={{ display: "block", width: "100%", height: "80px", transform: flip ? "scaleY(-1)" : undefined }}
      >
        <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill={bottomColor} />
      </svg>
    </div>
  );
}

export function SectionBadge({ text, color = "#D8F3DC", textColor = "#1B4332", icon: Icon }: {
  text: string; color?: string; textColor?: string; icon?: React.ElementType;
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

export function ClayCard({ children, bg = "white", border = "#E5E7EB", className = "" }: {
  children: React.ReactNode; bg?: string; border?: string; className?: string;
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

export function BigButton({ onClick, children, variant = "primary" }: {
  onClick?: () => void; children: React.ReactNode; variant?: "primary" | "outline";
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
