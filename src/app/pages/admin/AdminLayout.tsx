import { useNavigate, NavLink, Outlet, Navigate, useLocation } from "react-router";
import { Recycle, ShoppingBag, Package, Settings, LogOut } from "lucide-react";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { useAuth } from "../../context/AuthContext";
import { useIsAdmin } from "../../../hooks/useIsAdmin";

const NAV_ITEMS = [
  { to: "/admin/reciclaje", icon: <Recycle size={18} />, label: "Reciclaje" },
  { to: "/admin/pedidos", icon: <ShoppingBag size={18} />, label: "Pedidos" },
  { to: "/admin/kits", icon: <Package size={18} />, label: "Kits" },
  { to: "/admin/configuracion", icon: <Settings size={18} />, label: "Configuración" },
];

export function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();
  const isAdmin = useIsAdmin();

  if (loading || isAdmin === null) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#D8F3DC" }}>
        <LoadingSpinner />
        <p style={{ marginLeft: "0.75rem", color: "#2D6A4F", fontFamily: "Nunito", fontWeight: 600 }}>
          Verificando acceso...
        </p>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  if (location.pathname === "/admin" || location.pathname === "/admin/") {
    return <Navigate to="/admin/reciclaje" replace />;
  }

  return (
    <div className="flex min-h-screen" style={{ fontFamily: "Nunito, sans-serif", backgroundColor: "#F9FAFB" }}>
      <aside
        className="w-56 flex-shrink-0 flex flex-col"
        style={{ backgroundColor: "white", borderRight: "1px solid #E5E7EB", minHeight: "100vh" }}
      >
        <div className="px-5 py-5" style={{ borderBottom: "1px solid #E5E7EB" }}>
          <div className="flex items-center gap-2">
            <span className="text-xl">🌿</span>
            <span style={{ fontWeight: 800, color: "#2D6A4F", fontSize: "1rem" }}>Green Block</span>
          </div>
          <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>Admin Panel</p>
        </div>

        <nav className="flex-1 p-3">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm mb-1 transition-colors"
              style={({ isActive }) => ({
                backgroundColor: isActive ? "#D8F3DC" : "transparent",
                color: isActive ? "#2D6A4F" : "#6B7280",
                fontWeight: isActive ? 700 : 500,
                textDecoration: "none",
                display: "flex",
              })}
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="px-4 py-4" style={{ borderTop: "1px solid #E5E7EB" }}>
          <p className="text-xs mb-2 truncate" style={{ color: "#9CA3AF" }}>{user.email}</p>
          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-2 text-sm transition-opacity hover:opacity-70"
            style={{ color: "#DC2626", fontWeight: 600 }}
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
