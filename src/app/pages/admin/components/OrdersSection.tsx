import { useState, useEffect, useCallback } from "react";
import { X, Check, ChevronDown, ShoppingBag } from "lucide-react";
import { LoadingSpinner } from "../../../components/LoadingSpinner";
import { callGetOrders, callUpdateOrderStatus } from "../../../../lib/functions";

type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";

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

const ALL_STATUSES: OrderStatus[] = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

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

export function OrdersSection() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<OrderStatus | "all">("all");

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState<OrderStatus>("confirmed");
  const [trackingCode, setTrackingCode] = useState("");
  const [updating, setUpdating] = useState(false);

  const loadOrders = useCallback(async () => {
    const res = await callGetOrders({ adminView: true, limitNum: 50 });
    setOrders(res.data as Order[]);
  }, []);

  useEffect(() => {
    loadOrders().finally(() => setDataLoading(false));
  }, [loadOrders]);

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    setUpdating(true);
    try {
      await callUpdateOrderStatus({
        orderId: selectedOrder.id,
        status: newStatus,
        trackingCode: trackingCode || undefined,
      });
      setSelectedOrder(null);
      loadOrders();
    } catch {
      alert("Error al actualizar la orden");
    } finally {
      setUpdating(false);
    }
  };

  const countByStatus = (status: OrderStatus) => orders.filter((o) => o.status === status).length;
  const filtered = activeFilter === "all" ? orders : orders.filter((o) => o.status === activeFilter);

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl" style={{ backgroundColor: "#D8F3DC" }}>
            <ShoppingBag size={20} style={{ color: "#2D6A4F" }} />
          </div>
          <div>
            <h1 style={{ fontWeight: 800, color: "#1B4332", fontSize: "1.4rem", lineHeight: 1.2 }}>Pedidos</h1>
            <p style={{ fontSize: "0.8rem", color: "#6B7280", marginTop: "0.1rem" }}>
              {orders.length} pedido{orders.length !== 1 ? "s" : ""} en total
            </p>
          </div>
        </div>
        <button
          onClick={() => { setDataLoading(true); loadOrders().finally(() => setDataLoading(false)); }}
          className="text-sm px-4 py-2 rounded-xl transition-opacity hover:opacity-70"
          style={{ backgroundColor: "#F3F4F6", color: "#374151", fontWeight: 600 }}
        >
          Actualizar
        </button>
      </div>

      {dataLoading ? (
        <div className="flex items-center gap-2 text-sm" style={{ color: "#6B7280" }}>
          <LoadingSpinner size={14} /> Cargando pedidos...
        </div>
      ) : (
        <>
          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-5">
            {ALL_STATUSES.map((s) => {
              const count = countByStatus(s);
              const sc = STATUS_COLORS[s];
              return (
                <button
                  key={s}
                  onClick={() => setActiveFilter(activeFilter === s ? "all" : s)}
                  className="rounded-xl p-3 text-left transition-all"
                  style={{
                    backgroundColor: activeFilter === s ? sc.bg : "white",
                    border: `2px solid ${activeFilter === s ? sc.color : "#E5E7EB"}`,
                    cursor: "pointer",
                  }}
                >
                  <p style={{ fontSize: "1.4rem", fontWeight: 900, color: activeFilter === s ? sc.color : "#374151" }}>{count}</p>
                  <p style={{ fontSize: "0.7rem", fontWeight: 600, color: activeFilter === s ? sc.color : "#9CA3AF", marginTop: "0.1rem" }}>
                    {STATUS_LABELS[s]}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <button
              onClick={() => setActiveFilter("all")}
              className="px-4 py-1.5 rounded-full text-sm transition-colors"
              style={{
                backgroundColor: activeFilter === "all" ? "#2D6A4F" : "#F3F4F6",
                color: activeFilter === "all" ? "white" : "#6B7280",
                fontWeight: 600,
              }}
            >
              Todos ({orders.length})
            </button>
            {ALL_STATUSES.filter((s) => countByStatus(s) > 0).map((s) => {
              const sc = STATUS_COLORS[s];
              const isActive = activeFilter === s;
              return (
                <button
                  key={s}
                  onClick={() => setActiveFilter(isActive ? "all" : s)}
                  className="px-4 py-1.5 rounded-full text-sm transition-colors"
                  style={{
                    backgroundColor: isActive ? sc.color : sc.bg,
                    color: isActive ? "white" : sc.color,
                    fontWeight: 600,
                  }}
                >
                  {STATUS_LABELS[s]} ({countByStatus(s)})
                </button>
              );
            })}
          </div>

          {/* Table */}
          <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "white", border: "1px solid #E5E7EB" }}>
            {filtered.length === 0 ? (
              <div className="px-5 py-12 text-center" style={{ color: "#9CA3AF" }}>
                <ShoppingBag size={36} style={{ margin: "0 auto 0.75rem", opacity: 0.2 }} />
                <p style={{ fontWeight: 600 }}>
                  {activeFilter === "all" ? "No hay pedidos aún" : `No hay pedidos con estado "${STATUS_LABELS[activeFilter]}"`}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#F9FAFB" }}>
                      {["Kit", "Cliente", "Ciudad", "Cant.", "Total", "Estado", "Fecha", ""].map((h) => (
                        <th
                          key={h}
                          style={{ padding: "0.75rem 1.25rem", textAlign: "left", fontWeight: 700, color: "#6B7280", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.04em" }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((o) => {
                      const sc = STATUS_COLORS[o.status] || STATUS_COLORS.pending;
                      return (
                        <tr key={o.id} className="hover:bg-gray-50 transition-colors" style={{ borderTop: "1px solid #F3F4F6" }}>
                          <td style={{ padding: "0.85rem 1.25rem", fontWeight: 700, color: "#1B4332" }}>{o.kitName}</td>
                          <td style={{ padding: "0.85rem 1.25rem" }}>
                            <p style={{ color: "#374151", fontWeight: 600, fontSize: "0.875rem" }}>{o.shippingAddress?.fullName || "—"}</p>
                          </td>
                          <td style={{ padding: "0.85rem 1.25rem", color: "#6B7280", fontSize: "0.8rem" }}>{o.shippingAddress?.city || "—"}</td>
                          <td style={{ padding: "0.85rem 1.25rem", color: "#374151", fontWeight: 600, textAlign: "center" }}>{o.quantity}</td>
                          <td style={{ padding: "0.85rem 1.25rem", fontWeight: 800, color: "#2D6A4F" }}>${o.total?.toFixed(2)}</td>
                          <td style={{ padding: "0.85rem 1.25rem" }}>
                            <span style={{ backgroundColor: sc.bg, color: sc.color, padding: "3px 10px", borderRadius: "999px", fontWeight: 700, fontSize: "0.72rem", whiteSpace: "nowrap" }}>
                              {STATUS_LABELS[o.status]}
                            </span>
                          </td>
                          <td style={{ padding: "0.85rem 1.25rem", color: "#9CA3AF", fontSize: "0.8rem", whiteSpace: "nowrap" }}>{formatDate(o.createdAt)}</td>
                          <td style={{ padding: "0.85rem 1.25rem" }}>
                            <button
                              onClick={() => { setSelectedOrder(o); setNewStatus(o.status); setTrackingCode(o.trackingCode || ""); }}
                              className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg transition-all hover:shadow-sm"
                              style={{ backgroundColor: "#F3F4F6", color: "#374151", fontWeight: 600, whiteSpace: "nowrap" }}
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
        </>
      )}

      {/* Status update modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ backgroundColor: "rgba(0,0,0,0.45)" }}>
          <div className="w-full max-w-md rounded-2xl overflow-hidden shadow-xl" style={{ backgroundColor: "white" }}>
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid #E5E7EB", backgroundColor: "#F9FAFB" }}>
              <div>
                <h2 style={{ fontWeight: 800, color: "#1B4332" }}>Actualizar orden</h2>
                <p style={{ fontSize: "0.75rem", color: "#9CA3AF", marginTop: "0.1rem" }}>
                  {selectedOrder.shippingAddress?.fullName} · {formatDate(selectedOrder.createdAt)}
                </p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-1 rounded-lg hover:bg-gray-100 transition-colors">
                <X size={18} style={{ color: "#9CA3AF" }} />
              </button>
            </div>
            <form onSubmit={handleUpdateStatus} className="px-6 py-5 flex flex-col gap-4">
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
                <label style={{ display: "block", fontWeight: 600, color: "#374151", marginBottom: "0.35rem", fontSize: "0.85rem" }}>
                  Código de rastreo <span style={{ color: "#9CA3AF", fontWeight: 400 }}>(opcional)</span>
                </label>
                <input
                  value={trackingCode}
                  onChange={(e) => setTrackingCode(e.target.value)}
                  placeholder="ej: EC123456789"
                  style={inputStyle}
                />
              </div>
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="flex-1 py-2.5 rounded-xl transition-colors hover:bg-gray-200"
                  style={{ backgroundColor: "#F3F4F6", color: "#374151", fontWeight: 600 }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-opacity hover:opacity-80"
                  style={{ backgroundColor: "#2D6A4F", color: "white", fontWeight: 700 }}
                >
                  {updating ? <LoadingSpinner size={16} /> : <><Check size={16} /> Guardar</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
