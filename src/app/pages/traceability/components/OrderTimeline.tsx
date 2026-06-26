import { CheckCircle } from "lucide-react";
import { TimelineStep } from "../../../components/TimelineStep";
import type { Order, OrderStatus } from "../../../models/order.model";

function formatDate(ts: { seconds: number } | null): string {
  if (!ts) return "—";
  return new Date(ts.seconds * 1000).toLocaleDateString("es-EC", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

const STATUS_ORDER: OrderStatus[] = ["pending", "confirmed", "shipped", "delivered"];

interface Step {
  label: string;
  description: (order: Order) => string;
  date: (order: Order) => string;
}

const STEPS: Step[] = [
  {
    label: "Pedido recibido",
    description: (o) => `Pedido registrado el ${formatDate(o.createdAt)}. Total: $${o.total?.toFixed(2) ?? "—"}.`,
    date: (o) => formatDate(o.createdAt),
  },
  {
    label: "Confirmado",
    description: () => "Orden confirmada por el equipo Green Block.",
    date: () => "—",
  },
  {
    label: "En camino",
    description: (o) =>
      o.trackingCode
        ? `Enviado por mensajería. Código de rastreo: ${o.trackingCode}.`
        : "Paquete enviado por mensajería.",
    date: () => "—",
  },
  {
    label: "Entregado",
    description: () => "Paquete recibido. ¡Disfruta tu kit de hongos!",
    date: () => "—",
  },
];

function getCompletedCount(status: OrderStatus): number {
  if (status === "cancelled") return 1;
  const idx = STATUS_ORDER.indexOf(status);
  return idx + 1;
}

interface OrderTimelineProps {
  order: Order;
}

export function OrderTimeline({ order }: OrderTimelineProps) {
  const completedCount = getCompletedCount(order.status);
  const doneSteps = STEPS.slice(0, completedCount);
  const pendingSteps = order.status === "cancelled" ? [] : STEPS.slice(completedCount);

  return (
    <div className="p-6">
      <p
        className="text-xs mb-5"
        style={{ fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.05em" }}
      >
        Recorrido del pedido
      </p>

      {order.status === "cancelled" ? (
        <div className="p-4 rounded-xl" style={{ backgroundColor: "#FEE2E2" }}>
          <p className="text-sm" style={{ color: "#DC2626", fontWeight: 700 }}>
            ✕ Este pedido fue cancelado.
          </p>
        </div>
      ) : (
        <>
          {doneSteps.map((step, i) => (
            <TimelineStep
              key={step.label}
              label={step.label}
              date={step.date(order)}
              description={step.description(order)}
              done={true}
              isLast={i === doneSteps.length - 1 && pendingSteps.length === 0}
            />
          ))}

          {pendingSteps.map((step, i) => (
            <div key={step.label} className="flex gap-4 mb-4">
              <div className="flex flex-col items-center">
                <div
                  className="w-5 h-5 rounded-full flex-shrink-0 mt-1"
                  style={{ backgroundColor: "#E5E7EB" }}
                />
                {i < pendingSteps.length - 1 && (
                  <div className="w-0.5 flex-1 mt-1" style={{ backgroundColor: "#E5E7EB" }} />
                )}
              </div>
              <div className="pb-4">
                <p className="text-sm" style={{ fontWeight: 700, color: "#9CA3AF" }}>{step.label}</p>
                <p className="text-xs mt-0.5" style={{ color: "#D1D5DB" }}>Pendiente</p>
              </div>
            </div>
          ))}

          {order.status === "delivered" && (
            <div className="mt-2 p-3 rounded-xl text-center" style={{ backgroundColor: "#D8F3DC" }}>
              <p className="text-sm" style={{ fontWeight: 700, color: "#2D6A4F" }}>
                <CheckCircle size={14} style={{ display: "inline", marginRight: "6px", verticalAlign: "middle" }} />
                Pedido completado · Green Block
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
