import { Package, Clock, CheckCircle, Truck, Box, XCircle, ChevronRight } from "lucide-react";
import { LoadingSpinner } from "../../../components/LoadingSpinner";
import type { Order, OrderStatus } from "../../../models/order.model";

const STATUS_ICON: Record<OrderStatus, React.ElementType> = {
  pending: Clock,
  confirmed: Box,
  shipped: Truck,
  delivered: CheckCircle,
  cancelled: XCircle,
};

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pendiente",
  confirmed: "Confirmado",
  shipped: "Enviado",
  delivered: "Entregado",
  cancelled: "Cancelado",
};

const STATUS_COLORS: Record<OrderStatus, { bg: string; color: string }> = {
  pending:   { bg: "#FEF3C7", color: "#92400E" },
  confirmed: { bg: "#DBEAFE", color: "#1D4ED8" },
  shipped:   { bg: "#EDE9FE", color: "#5B21B6" },
  delivered: { bg: "#D8F3DC", color: "#2D6A4F" },
  cancelled: { bg: "#FEE2E2", color: "#DC2626" },
};

function formatDate(ts: { seconds: number } | null): string {
  if (!ts) return "—";
  return new Date(ts.seconds * 1000).toLocaleDateString("es-EC", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

interface OrderListProps {
  orders: Order[];
  loading: boolean;
  activeId: string | undefined;
  onSelect: (order: Order) => void;
}

export function OrderList({ orders, loading, activeId, onSelect }: OrderListProps) {
  if (loading) {
    return (
      <div className="rounded-2xl p-5 flex items-center gap-2 text-sm" style={{ backgroundColor: "white", border: "1px solid #E5E7EB", color: "#6B7280" }}>
        <LoadingSpinner size={14} /> Cargando pedidos...
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="rounded-2xl p-6 text-center" style={{ backgroundColor: "white", border: "1px dashed #D1D5DB" }}>
        <Package size={30} color="#D1D5DB" style={{ margin: "0 auto 0.6rem" }} />
        <p className="text-sm" style={{ color: "#9CA3AF", fontWeight: 600 }}>
          Aún no tienes pedidos
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "white", border: "1px solid #E5E7EB" }}>
      <div className="px-4 py-3" style={{ borderBottom: "1px solid #F3F4F6" }}>
        <p
          className="text-xs"
          style={{ fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.05em" }}
        >
          Tus pedidos ({orders.length})
        </p>
      </div>
      <div>
        {orders.map((order) => {
          const Icon = STATUS_ICON[order.status] ?? Package;
          const sc = STATUS_COLORS[order.status] ?? STATUS_COLORS.pending;
          const isActive = activeId === order.id;
          return (
            <button
              key={order.id}
              onClick={() => onSelect(order)}
              className="w-full text-left px-4 py-4 flex items-start gap-3 transition-colors hover:opacity-90"
              style={{
                backgroundColor: isActive ? "#D8F3DC" : "transparent",
                borderBottom: "1px solid #F9FAFB",
              }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ backgroundColor: isActive ? "#2D6A4F" : "#F3F4F6" }}
              >
                <Icon size={16} color={isActive ? "white" : "#6B7280"} />
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="text-sm truncate"
                  style={{ fontWeight: 700, color: isActive ? "#1B4332" : "#374151" }}
                >
                  {order.kitName}
                </p>
                <p className="text-xs mb-1.5" style={{ color: "#9CA3AF" }}>
                  {formatDate(order.createdAt)} · #{order.id.slice(0, 8)}
                </p>
                <span
                  className="inline-block px-2 py-0.5 rounded-full text-xs"
                  style={{ backgroundColor: sc.bg, color: sc.color, fontWeight: 700 }}
                >
                  {STATUS_LABELS[order.status]}
                </span>
              </div>
              <ChevronRight size={14} color={isActive ? "#2D6A4F" : "#D1D5DB"} style={{ flexShrink: 0, marginTop: "0.2rem" }} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
