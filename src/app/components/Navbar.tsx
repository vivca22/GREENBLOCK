import { useState } from "react";
import { Link, useLocation } from "react-router";
import { Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useGame } from "../context/GameContext";
import { GreenPointsBadge } from "./GreenPointsBadge";

export function Navbar() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { points } = useGame();
  const [menuOpen, setMenuOpen] = useState(false);

  const publicLinks = [
    { to: "/trazabilidad", label: "Verificar" },
    { to: "/request", label: "Pedir Kit" },
  ];

  const authLinks = user
    ? [
        { to: "/mi-hongo", label: "🍄 Mi Hongo" },
        { to: "/aprende", label: "📖 Aprende" },
        { to: "/tienda", label: "🌿 Tienda" },
        { to: "/como-usar", label: "Cómo usar" },
      ]
    : [];

  const allLinks = [...publicLinks, ...authLinks];

  return (
    <nav className="sticky top-0 z-40 w-full" style={{ backgroundColor: "white", borderBottom: "1px solid #E5E7EB" }}>
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xl">🌿</span>
          <span style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, color: "#2D6A4F", fontSize: "1.15rem" }}>
            Green Block
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {allLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="px-3 py-1.5 rounded-xl text-sm transition-colors hover:opacity-80"
              style={{
                fontFamily: "Nunito, sans-serif",
                fontWeight: 600,
                color: location.pathname === link.to ? "#2D6A4F" : "#6B7280",
                backgroundColor: location.pathname === link.to ? "#D8F3DC" : "transparent",
              }}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/admin"
            className="px-3 py-1.5 rounded-xl text-sm transition-colors hover:opacity-80"
            style={{
              fontFamily: "Nunito, sans-serif",
              fontWeight: 600,
              color: location.pathname === "/admin" ? "#2D6A4F" : "#9CA3AF",
              backgroundColor: location.pathname === "/admin" ? "#D8F3DC" : "transparent",
            }}
          >
            Admin
          </Link>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <GreenPointsBadge points={points} size="sm" />
              <div className="hidden md:flex items-center gap-2">
                <Link to="/mi-hongo">
                  <img
                    src={user.photo}
                    alt={user.name}
                    className="w-8 h-8 rounded-full border-2"
                    style={{ borderColor: "#52B788" }}
                    onError={(e) => { (e.target as HTMLImageElement).src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.name) + "&background=52B788&color=fff&size=32"; }}
                  />
                </Link>
                <button onClick={logout} className="text-xs px-2 py-1.5 rounded-xl transition-opacity hover:opacity-70" style={{ color: "#9CA3AF", fontFamily: "Nunito, sans-serif", fontWeight: 600 }}>
                  Salir
                </button>
              </div>
            </>
          ) : (
            <Link
              to="/register"
              className="hidden md:block px-4 py-2 rounded-xl text-sm transition-opacity hover:opacity-80"
              style={{ backgroundColor: "#2D6A4F", color: "white", fontFamily: "Nunito, sans-serif", fontWeight: 700 }}
            >
              Registrarse
            </Link>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-xl"
            style={{ backgroundColor: "#F3F4F6" }}
          >
            {menuOpen ? <X size={18} style={{ color: "#374151" }} /> : <Menu size={18} style={{ color: "#374151" }} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 flex flex-col gap-1" style={{ borderTop: "1px solid #F3F4F6" }}>
          {[...allLinks, { to: "/admin", label: "Admin" }].map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className="px-4 py-3 rounded-xl text-sm"
              style={{
                fontFamily: "Nunito, sans-serif",
                fontWeight: 600,
                color: location.pathname === link.to ? "#2D6A4F" : "#374151",
                backgroundColor: location.pathname === link.to ? "#D8F3DC" : "transparent",
              }}
            >
              {link.label}
            </Link>
          ))}
          {user ? (
            <button onClick={() => { logout(); setMenuOpen(false); }} className="px-4 py-2 rounded-xl text-sm text-left" style={{ color: "#DC2626", fontFamily: "Nunito, sans-serif", fontWeight: 600 }}>
              Cerrar sesión
            </button>
          ) : (
            <Link to="/register" onClick={() => setMenuOpen(false)} className="px-4 py-3 rounded-xl text-sm text-center" style={{ backgroundColor: "#2D6A4F", color: "white", fontFamily: "Nunito, sans-serif", fontWeight: 700 }}>
              Registrarse
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
