import { useState, useEffect, useCallback } from "react";
import { useNavigate, Navigate } from "react-router";
import { doc, getDoc, collection, query, orderBy, limit, getDocs, updateDoc } from "firebase/firestore";
import {
  X, Plus, LogOut, Package, Settings, Recycle, ShoppingBag, ChevronDown, Check, AlertCircle,
} from "lucide-react";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useAuth } from "../context/AuthContext";
import { useIsAdmin } from "../../hooks/useIsAdmin";
import { db } from "../../lib/firebase";
import { callRegisterRecyclingDelivery, callGetRecyclingHistory, callGetOrders, callUpdateOrderStatus } from "../../lib/functions";

type Section = "kits" | "orders" | "recycling" | "settings";
type PlasticType = "PET" | "HDPE" | "LDPE" | "PP" | "mixed";
type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";

interface Kit {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  fungiType: string | null;
  isActive: boolean;
}

interface Order {
  id: string;
  userId: string;
  kitName: string;
  quantity: number;
  total: number;
  status: OrderStatus;
  shippingAddress: { fullName: string; city: string; street: string };
  trackingCode: string | null;
  createdAt: { seconds: number } | null;
}

interface RecyclingDelivery {
  id: string;
  studentEmail: string;
  weightGrams: number;
  plasticType: PlasticType;
  greenPointsAwarded: number;
  registeredAt: { seconds: number } | null;
}

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pendiente",
  confirmed: "Confirmado",
  shipped: "Enviado",
  delivered: "Entregado",
  cancelled: "Cancelado",
};

const STATUS_COLORS: Record<OrderStatus, { bg: string; color: string }> = {
  pending: { bg: "#FEF3C7", color: "#92400E" },
  confirmed: { bg: "#DBEAFE", color: "#1D4ED8" },
  shipped: { bg: "#EDE9FE", color: "#5B21B6" },
  delivered: { bg: "#D8F3DC", color: "#2D6A4F" },
  cancelled: { bg: "#FEE2E2", color: "#DC2626" },
};

const PLASTIC_OPTIONS: PlasticType[] = ["PET", "HDPE", "LDPE", "PP", "mixed"];

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.65rem 0.9rem",
  borderRadius: "10px",
  border: "2px solid #D1D5DB",
  fontFamily: "Nunito, sans-serif",
  fontSize: "0.9rem",
  color: "#374151",
  outline: "none",
  boxSizing: "border-box",
  backgroundColor: "white",
};

function formatDate(ts: { seconds: number } | null): string {
  if (!ts) return "—";
  return new Date(ts.seconds * 1000).toLocaleDateString("es-EC", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

export function Admin() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const isAdmin = useIsAdmin();
  const [pointsPerGram, setPointsPerGram] = useState<number>(10);
  const [activeSection, setActiveSection] = useState<Section>("recycling");

  const [kits, setKits] = useState<Kit[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [deliveries, setDeliveries] = useState<RecyclingDelivery[]>([]);
  const [dataLoading, setDataLoading] = useState(false);

  // Recycling form
  const [recyclingForm, setRecyclingForm] = useState({ studentEmail: "", weightGrams: "", plasticType: "mixed" as PlasticType });
  const [recyclingLoading, setRecyclingLoading] = useState(false);
  const [recyclingResult, setRecyclingResult] = useState<{ success: boolean; message: string } | null>(null);

  // Order status modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState<OrderStatus>("confirmed");
  const [trackingCode, setTrackingCode] = useState("");
  const [updatingOrder, setUpdatingOrder] = useState(false);

  // Settings
  const [savingSettings, setSavingSettings] = useState(false);

  useEffect(() => {
    if (!isAdmin) return;
    getDoc(doc(db, "config/app")).then((snap) => {
      if (snap.exists()) setPointsPerGram(snap.data().pointsPerGram || 10);
    });
  }, [isAdmin]);

  const loadKits = useCallback(async () => {
    const snap = await getDocs(query(collection(db, "kits"), orderBy("createdAt", "desc"), limit(50)));
    setKits(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Kit)));
  }, []);

  const loadOrders = useCallback(async () => {
    const result = await callGetOrders({ adminView: true, limitNum: 50 });
    setOrders(result.data as Order[]);
  }, []);

  const loadDeliveries = useCallback(async () => {
    const result = await callGetRecyclingHistory({ limitNum: 50 });
    setDeliveries(result.data as RecyclingDelivery[]);
  }, []);

  useEffect(() => {
    if (!isAdmin) return;
    setDataLoading(true);
    Promise.all([loadKits(), loadOrders(), loadDeliveries()]).finally(() => setDataLoading(false));
  }, [isAdmin, loadKits, loadOrders, loadDeliveries]);

  const handleRegisterRecycling = async (e: React.FormEvent) => {
    e.preventDefault();
    setRecyclingLoading(true);
    setRecyclingResult(null);
    try {
      const weightGrams = parseFloat(recyclingForm.weightGrams);
      const result = await callRegisterRecyclingDelivery({
        studentEmail: recyclingForm.studentEmail,
        weightGrams,
        plasticType: recyclingForm.plasticType,
      });
      setRecyclingResult({
        success: true,
        message: `✅ Registrado. Se asignaron ${result.data.greenPointsAwarded} GreenPoints a ${recyclingForm.studentEmail}`,
      });
      setRecyclingForm({ studentEmail: "", weightGrams: "", plasticType: "mixed" });
      loadDeliveries();
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message || "Error al registrar";
      setRecyclingResult({ success: false, message: `❌ ${msg}` });
    } finally {
      setRecyclingLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    setUpdatingOrder(true);
    try {
      await callUpdateOrderStatus({ orderId: selectedOrder.id, status: newStatus, trackingCode: trackingCode || undefined });
      setSelectedOrder(null);
      loadOrders();
    } catch {
      alert("Error al actualizar la orden");
    } finally {
      setUpdatingOrder(false);
    }
  };

  const handleToggleKit = async (kit: Kit) => {
    await updateDoc(doc(db, "kits", kit.id), { isActive: !kit.isActive });
    setKits((prev) => prev.map((k) => k.id === kit.id ? { ...k, isActive: !k.isActive } : k));
  };

  const handleSaveSettings = async () => {
    setSavingSettings(true);
    try {
      await updateDoc(doc(db, "config/app"), { pointsPerGram });
    } finally {
      setSavingSettings(false);
    }
  };

  const weightGramsNum = parseFloat(recyclingForm.weightGrams) || 0;
  const previewPoints = Math.floor(weightGramsNum * pointsPerGram);

  const menuItems: { key: Section; icon: React.ReactNode; label: string }[] = [
    { key: "recycling", icon: <Recycle size={18} />, label: "Reciclaje" },
    { key: "orders", icon: <ShoppingBag size={18} />, label: "Pedidos" },
    { key: "kits", icon: <Package size={18} />, label: "Kits" },
    { key: "settings", icon: <Settings size={18} />, label: "Configuración" },
  ];

  if (loading || isAdmin === null) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#D8F3DC" }}>
        <LoadingSpinner />
      </div>
    );
  }

  if (!user || isAdmin === false) return <Navigate to="/login" replace />;

  return (
    <div className="flex min-h-screen" style={{ fontFamily: "Nunito, sans-serif", backgroundColor: "#F9FAFB" }}>
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 flex flex-col" style={{ backgroundColor: "white", borderRight: "1px solid #E5E7EB", minHeight: "100vh" }}>
        <div className="px-5 py-5" style={{ borderBottom: "1px solid #E5E7EB" }}>
          <div className="flex items-center gap-2">
            <span className="text-xl">🌿</span>
            <span style={{ fontWeight: 800, color: "#2D6A4F", fontSize: "1rem" }}>Green Block</span>
          </div>
          <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>Admin Panel</p>
        </div>

        <nav className="flex-1 p-3">
          {menuItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveSection(item.key)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm mb-1 transition-colors text-left"
              style={{
                backgroundColor: activeSection === item.key ? "#D8F3DC" : "transparent",
                color: activeSection === item.key ? "#2D6A4F" : "#6B7280",
                fontWeight: activeSection === item.key ? 700 : 500,
              }}
            >
              {item.icon}
              {item.label}
            </button>
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

      {/* Main */}
      <main className="flex-1 p-6 overflow-auto">
        {dataLoading && (
          <div className="flex items-center gap-2 mb-4 text-sm" style={{ color: "#6B7280" }}>
            <LoadingSpinner size={14} />
            Cargando datos...
          </div>
        )}

        {/* ── RECICLAJE ── */}
        {activeSection === "recycling" && (
          <div className="max-w-4xl">
            <h1 style={{ fontWeight: 800, color: "#1B4332", fontSize: "1.5rem", marginBottom: "1.5rem" }}>
              Registrar Entrega de Plástico
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Form */}
              <div className="rounded-2xl p-6" style={{ backgroundColor: "white", border: "1px solid #E5E7EB" }}>
                <h2 style={{ fontWeight: 700, color: "#1B4332", marginBottom: "1.25rem" }}>Nueva entrega</h2>
                <form onSubmit={handleRegisterRecycling} className="flex flex-col gap-4">
                  <div>
                    <label style={{ display: "block", fontWeight: 600, color: "#374151", marginBottom: "0.35rem", fontSize: "0.85rem" }}>
                      Email del estudiante *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="estudiante@gmail.com"
                      value={recyclingForm.studentEmail}
                      onChange={(e) => setRecyclingForm((p) => ({ ...p, studentEmail: e.target.value }))}
                      style={inputStyle}
                    />
                    <p style={{ fontSize: "0.75rem", color: "#9CA3AF", marginTop: "0.3rem" }}>
                      Debe estar registrado en la app con Google
                    </p>
                  </div>

                  <div>
                    <label style={{ display: "block", fontWeight: 600, color: "#374151", marginBottom: "0.35rem", fontSize: "0.85rem" }}>
                      Peso en gramos *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      step="0.1"
                      placeholder="ej: 500"
                      value={recyclingForm.weightGrams}
                      onChange={(e) => setRecyclingForm((p) => ({ ...p, weightGrams: e.target.value }))}
                      style={{ ...inputStyle, width: "180px" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontWeight: 600, color: "#374151", marginBottom: "0.35rem", fontSize: "0.85rem" }}>
                      Tipo de plástico
                    </label>
                    <select
                      value={recyclingForm.plasticType}
                      onChange={(e) => setRecyclingForm((p) => ({ ...p, plasticType: e.target.value as PlasticType }))}
                      style={{ ...inputStyle, width: "auto", backgroundColor: "white" }}
                    >
                      {PLASTIC_OPTIONS.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>

                  {/* Preview */}
                  {weightGramsNum > 0 && (
                    <div className="rounded-xl p-4" style={{ backgroundColor: "#D8F3DC" }}>
                      <p style={{ fontWeight: 700, color: "#1B4332", fontSize: "0.9rem" }}>Vista previa</p>
                      <p style={{ color: "#2D6A4F", fontSize: "1.1rem", fontWeight: 800, marginTop: "0.25rem" }}>
                        {weightGramsNum.toLocaleString()}g × {pointsPerGram} pts/g = {previewPoints.toLocaleString()} GreenPoints
                      </p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={recyclingLoading}
                    className="flex items-center justify-center gap-2 py-3 rounded-xl transition-opacity hover:opacity-80"
                    style={{ backgroundColor: "#2D6A4F", color: "white", fontWeight: 700 }}
                  >
                    {recyclingLoading ? <LoadingSpinner size={16} /> : <><Recycle size={16} /> Registrar entrega</>}
                  </button>

                  {recyclingResult && (
                    <div
                      className="rounded-xl p-3 text-sm"
                      style={{
                        backgroundColor: recyclingResult.success ? "#D8F3DC" : "#FEE2E2",
                        color: recyclingResult.success ? "#1B4332" : "#DC2626",
                        fontWeight: 600,
                      }}
                    >
                      {recyclingResult.message}
                    </div>
                  )}
                </form>
              </div>

              {/* Stats */}
              <div className="flex flex-col gap-4">
                <div className="rounded-2xl p-5" style={{ backgroundColor: "white", border: "1px solid #E5E7EB" }}>
                  <p style={{ color: "#6B7280", fontSize: "0.85rem", fontWeight: 600 }}>Total entregas registradas</p>
                  <p style={{ fontWeight: 900, color: "#2D6A4F", fontSize: "2rem" }}>{deliveries.length}</p>
                </div>
                <div className="rounded-2xl p-5" style={{ backgroundColor: "white", border: "1px solid #E5E7EB" }}>
                  <p style={{ color: "#6B7280", fontSize: "0.85rem", fontWeight: 600 }}>Total plástico reciclado</p>
                  <p style={{ fontWeight: 900, color: "#2D6A4F", fontSize: "2rem" }}>
                    {deliveries.reduce((s, d) => s + d.weightGrams, 0).toLocaleString()}g
                  </p>
                </div>
                <div className="rounded-2xl p-5" style={{ backgroundColor: "white", border: "1px solid #E5E7EB" }}>
                  <p style={{ color: "#6B7280", fontSize: "0.85rem", fontWeight: 600 }}>Total GreenPoints asignados</p>
                  <p style={{ fontWeight: 900, color: "#2D6A4F", fontSize: "2rem" }}>
                    {deliveries.reduce((s, d) => s + d.greenPointsAwarded, 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Recent deliveries */}
            <div className="mt-6 rounded-2xl overflow-hidden" style={{ backgroundColor: "white", border: "1px solid #E5E7EB" }}>
              <div className="px-5 py-4" style={{ borderBottom: "1px solid #E5E7EB" }}>
                <p style={{ fontWeight: 700, color: "#1B4332" }}>Entregas recientes</p>
              </div>
              {deliveries.length === 0 ? (
                <div className="px-5 py-10 text-center" style={{ color: "#9CA3AF" }}>
                  No hay entregas registradas aún
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
                    <thead>
                      <tr style={{ backgroundColor: "#F9FAFB" }}>
                        {["Estudiante", "Peso", "Tipo", "GreenPoints", "Fecha"].map((h) => (
                          <th key={h} style={{ padding: "0.75rem 1.25rem", textAlign: "left", fontWeight: 700, color: "#6B7280", fontSize: "0.8rem" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {deliveries.map((d) => (
                        <tr key={d.id} style={{ borderTop: "1px solid #F3F4F6" }}>
                          <td style={{ padding: "0.75rem 1.25rem", color: "#374151", fontWeight: 600 }}>{d.studentEmail}</td>
                          <td style={{ padding: "0.75rem 1.25rem", color: "#374151" }}>{d.weightGrams.toLocaleString()}g</td>
                          <td style={{ padding: "0.75rem 1.25rem" }}>
                            <span style={{ backgroundColor: "#D8F3DC", color: "#2D6A4F", padding: "2px 8px", borderRadius: "999px", fontWeight: 700, fontSize: "0.75rem" }}>
                              {d.plasticType}
                            </span>
                          </td>
                          <td style={{ padding: "0.75rem 1.25rem", color: "#2D6A4F", fontWeight: 700 }}>+{d.greenPointsAwarded.toLocaleString()}</td>
                          <td style={{ padding: "0.75rem 1.25rem", color: "#9CA3AF" }}>{formatDate(d.registeredAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── PEDIDOS ── */}
        {activeSection === "orders" && (
          <div>
            <h1 style={{ fontWeight: 800, color: "#1B4332", fontSize: "1.5rem", marginBottom: "1.5rem" }}>Pedidos</h1>
            <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "white", border: "1px solid #E5E7EB" }}>
              {orders.length === 0 ? (
                <div className="px-5 py-10 text-center" style={{ color: "#9CA3AF" }}>No hay pedidos aún</div>
              ) : (
                <div className="overflow-x-auto">
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
                    <thead>
                      <tr style={{ backgroundColor: "#F9FAFB" }}>
                        {["Kit", "Cliente", "Ciudad", "Cantidad", "Total", "Estado", "Fecha", ""].map((h) => (
                          <th key={h} style={{ padding: "0.75rem 1.25rem", textAlign: "left", fontWeight: 700, color: "#6B7280", fontSize: "0.8rem" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((o) => {
                        const sc = STATUS_COLORS[o.status] || STATUS_COLORS.pending;
                        return (
                          <tr key={o.id} style={{ borderTop: "1px solid #F3F4F6" }}>
                            <td style={{ padding: "0.75rem 1.25rem", fontWeight: 600, color: "#374151" }}>{o.kitName}</td>
                            <td style={{ padding: "0.75rem 1.25rem", color: "#374151" }}>{o.shippingAddress?.fullName || "—"}</td>
                            <td style={{ padding: "0.75rem 1.25rem", color: "#6B7280" }}>{o.shippingAddress?.city || "—"}</td>
                            <td style={{ padding: "0.75rem 1.25rem", color: "#374151" }}>{o.quantity}</td>
                            <td style={{ padding: "0.75rem 1.25rem", fontWeight: 700, color: "#2D6A4F" }}>${o.total?.toFixed(2)}</td>
                            <td style={{ padding: "0.75rem 1.25rem" }}>
                              <span style={{ backgroundColor: sc.bg, color: sc.color, padding: "2px 8px", borderRadius: "999px", fontWeight: 700, fontSize: "0.75rem" }}>
                                {STATUS_LABELS[o.status]}
                              </span>
                            </td>
                            <td style={{ padding: "0.75rem 1.25rem", color: "#9CA3AF" }}>{formatDate(o.createdAt)}</td>
                            <td style={{ padding: "0.75rem 1.25rem" }}>
                              <button
                                onClick={() => { setSelectedOrder(o); setNewStatus(o.status); setTrackingCode(o.trackingCode || ""); }}
                                className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg transition-opacity hover:opacity-70"
                                style={{ backgroundColor: "#F3F4F6", color: "#374151", fontWeight: 600 }}
                              >
                                <ChevronDown size={12} /> Estado
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── KITS ── */}
        {activeSection === "kits" && (
          <div>
            <h1 style={{ fontWeight: 800, color: "#1B4332", fontSize: "1.5rem", marginBottom: "1.5rem" }}>Kits & Productos</h1>
            <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "white", border: "1px solid #E5E7EB" }}>
              {kits.length === 0 ? (
                <div className="px-5 py-10 text-center" style={{ color: "#9CA3AF" }}>
                  <AlertCircle size={32} style={{ margin: "0 auto 0.75rem", opacity: 0.3 }} />
                  <p>No hay kits en la base de datos.</p>
                  <p className="text-xs mt-1">Corre <code>node scripts/seedDatabase.js</code> para inicializar.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
                    <thead>
                      <tr style={{ backgroundColor: "#F9FAFB" }}>
                        {["Nombre", "Categoría", "Precio", "Stock", "Estado", ""].map((h) => (
                          <th key={h} style={{ padding: "0.75rem 1.25rem", textAlign: "left", fontWeight: 700, color: "#6B7280", fontSize: "0.8rem" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {kits.map((k) => (
                        <tr key={k.id} style={{ borderTop: "1px solid #F3F4F6" }}>
                          <td style={{ padding: "0.75rem 1.25rem", fontWeight: 600, color: "#374151" }}>{k.name}</td>
                          <td style={{ padding: "0.75rem 1.25rem" }}>
                            <span style={{ backgroundColor: "#F3F4F6", color: "#6B7280", padding: "2px 8px", borderRadius: "999px", fontSize: "0.75rem", fontWeight: 700 }}>
                              {k.category}
                            </span>
                          </td>
                          <td style={{ padding: "0.75rem 1.25rem", fontWeight: 700, color: "#2D6A4F" }}>${k.price}</td>
                          <td style={{ padding: "0.75rem 1.25rem", color: k.stock > 0 ? "#374151" : "#DC2626", fontWeight: 600 }}>
                            {k.stock} {k.stock === 0 && "(agotado)"}
                          </td>
                          <td style={{ padding: "0.75rem 1.25rem" }}>
                            <span style={{
                              backgroundColor: k.isActive ? "#D8F3DC" : "#F3F4F6",
                              color: k.isActive ? "#2D6A4F" : "#9CA3AF",
                              padding: "2px 8px", borderRadius: "999px", fontSize: "0.75rem", fontWeight: 700,
                            }}>
                              {k.isActive ? "Activo" : "Inactivo"}
                            </span>
                          </td>
                          <td style={{ padding: "0.75rem 1.25rem" }}>
                            <button
                              onClick={() => handleToggleKit(k)}
                              className="text-xs px-3 py-1.5 rounded-lg transition-opacity hover:opacity-70"
                              style={{ backgroundColor: k.isActive ? "#FEE2E2" : "#D8F3DC", color: k.isActive ? "#DC2626" : "#2D6A4F", fontWeight: 600 }}
                            >
                              {k.isActive ? "Desactivar" : "Activar"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── CONFIGURACIÓN ── */}
        {activeSection === "settings" && (
          <div className="max-w-sm">
            <h1 style={{ fontWeight: 800, color: "#1B4332", fontSize: "1.5rem", marginBottom: "1.5rem" }}>Configuración</h1>
            <div className="rounded-2xl p-6" style={{ backgroundColor: "white", border: "1px solid #E5E7EB" }}>
              <div className="mb-5">
                <label style={{ display: "block", fontWeight: 700, color: "#374151", marginBottom: "0.35rem" }}>
                  GreenPoints por gramo de plástico
                </label>
                <p style={{ fontSize: "0.8rem", color: "#9CA3AF", marginBottom: "0.6rem" }}>
                  Tasa de conversión: 1g = X GreenPoints
                </p>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="1"
                    value={pointsPerGram}
                    onChange={(e) => setPointsPerGram(Number(e.target.value))}
                    style={{ ...inputStyle, width: "100px" }}
                  />
                  <span style={{ color: "#6B7280", fontWeight: 600 }}>pts / g</span>
                </div>
                <p style={{ fontSize: "0.8rem", color: "#2D6A4F", marginTop: "0.5rem", fontWeight: 600 }}>
                  Ejemplo: 500g × {pointsPerGram} = {(500 * pointsPerGram).toLocaleString()} GreenPoints
                </p>
              </div>
              <button
                onClick={handleSaveSettings}
                disabled={savingSettings}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl transition-opacity hover:opacity-80"
                style={{ backgroundColor: "#2D6A4F", color: "white", fontWeight: 700 }}
              >
                {savingSettings ? <LoadingSpinner size={16} /> : <><Check size={16} /> Guardar</>}
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Order status modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ backgroundColor: "rgba(0,0,0,0.4)" }}>
          <div className="w-full max-w-md rounded-2xl overflow-hidden shadow-xl" style={{ backgroundColor: "white" }}>
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid #E5E7EB" }}>
              <h2 style={{ fontWeight: 800, color: "#1B4332" }}>Actualizar orden</h2>
              <button onClick={() => setSelectedOrder(null)}><X size={18} style={{ color: "#9CA3AF" }} /></button>
            </div>
            <form onSubmit={handleUpdateOrderStatus} className="px-6 py-5 flex flex-col gap-4">
              <div>
                <label style={{ display: "block", fontWeight: 600, color: "#374151", marginBottom: "0.35rem", fontSize: "0.85rem" }}>Kit</label>
                <input readOnly value={selectedOrder.kitName} style={{ ...inputStyle, backgroundColor: "#F3F4F6", color: "#6B7280" }} />
              </div>
              <div>
                <label style={{ display: "block", fontWeight: 600, color: "#374151", marginBottom: "0.35rem", fontSize: "0.85rem" }}>Nuevo estado</label>
                <select value={newStatus} onChange={(e) => setNewStatus(e.target.value as OrderStatus)} style={{ ...inputStyle, backgroundColor: "white" }}>
                  <option value="confirmed">Confirmado</option>
                  <option value="shipped">Enviado</option>
                  <option value="delivered">Entregado</option>
                  <option value="cancelled">Cancelado</option>
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontWeight: 600, color: "#374151", marginBottom: "0.35rem", fontSize: "0.85rem" }}>Código de rastreo (opcional)</label>
                <input
                  value={trackingCode}
                  onChange={(e) => setTrackingCode(e.target.value)}
                  placeholder="ej: EC123456789"
                  style={inputStyle}
                />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setSelectedOrder(null)} className="flex-1 py-2.5 rounded-xl" style={{ backgroundColor: "#F3F4F6", color: "#374151", fontWeight: 600 }}>
                  Cancelar
                </button>
                <button type="submit" disabled={updatingOrder} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-opacity hover:opacity-80" style={{ backgroundColor: "#2D6A4F", color: "white", fontWeight: 700 }}>
                  {updatingOrder ? <LoadingSpinner size={16} /> : <><Check size={16} /> Guardar</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
