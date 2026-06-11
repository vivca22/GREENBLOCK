import { Github, ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full py-10 px-4" style={{ backgroundColor: "#1B4332" }}>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
            <span className="text-2xl">🌿</span>
            <span style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, color: "white", fontSize: "1.2rem" }}>
              Green Block
            </span>
          </div>
          <p className="text-sm" style={{ color: "#95D5B2" }}>
            Fungi-powered plastic degradation tracking
          </p>
          <p className="text-sm mt-1" style={{ color: "#52B788" }}>
            Made by 11-year-old students ❤️
          </p>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm transition-opacity hover:opacity-70"
            style={{ color: "#95D5B2", fontFamily: "Nunito, sans-serif" }}
          >
            <Github size={16} />
            GitHub
          </a>
          <a
            href="https://amoy.polygonscan.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm transition-opacity hover:opacity-70"
            style={{ color: "#95D5B2", fontFamily: "Nunito, sans-serif" }}
          >
            <ExternalLink size={16} />
            Polygonscan
          </a>
          <a
            href="https://firebase.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm transition-opacity hover:opacity-70"
            style={{ color: "#95D5B2", fontFamily: "Nunito, sans-serif" }}
          >
            <ExternalLink size={16} />
            Firebase
          </a>
        </div>
      </div>
    </footer>
  );
}
