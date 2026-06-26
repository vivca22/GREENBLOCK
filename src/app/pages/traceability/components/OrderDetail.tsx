import type { Order, OrderStatus } from "../../../models/order.model";

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending:   "Pendiente",
  confirmed: "Confirmado",
  shipped:   "Enviado",
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

interface OrderDetailProps {
  order: Order;
}

export function OrderDetail({ order }: OrderDetailProps) {
  const sc = STATUS_COLORS[order.status] ?? STATUS_COLORS.pending;
  const itemLabel = `${order.kitName} ×${order.quantity}`;

  return (
    <div className="p-5" style={{ borderBottom: "1px solid #F3F4F6" }}>
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs mb-1" style={{ color: "#9CA3AF", fontWeight: 600 }}>
            Pedido #{order.id.slice(0, 12)}
          </p>
          <h2 style={{ fontWeight: 900, color: "#1B4332", fontSize: "1.15rem", marginBottom: "0.4rem" }}>
            {order.kitName}
          </h2>
          <div className="flex flex-wrap gap-2 mb-1">
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{ backgroundColor: "#F3F4F6", color: "#6B7280", fontWeight: 600 }}
            >
              {itemLabel}
            </span>
            {order.trackingCode && (
              <span
                className="text-xs px-2 py-0.5 rounded-full"
                style={{ backgroundColor: "#EDE9FE", color: "#5B21B6", fontWeight: 600 }}
              >
                🚚 {order.trackingCode}
              </span>
            )}
          </div>
        </div>
        <span
          className="inline-block px-3 py-1 rounded-full text-xs flex-shrink-0"
          style={{ backgroundColor: sc.bg, color: sc.color, fontWeight: 700 }}
        >
          {STATUS_LABELS[order.status]}
        </span>
      </div>
    </div>
  );
}
