/*
 * CONNECTIONS NEEDED:
 * - Firebase: import { db } from '../lib/firebase'
 * - User orders: db.collection('requests').where('userId','==',uid).get()
 * - Batch detail: db.collection('batches').doc(id).get()
 * - Each txHash: https://amoy.polygonscan.com/tx/{hash}
 */
import { useState } from "react";
import { Search, Package, Truck, Box, CheckCircle, Clock, ChevronRight } from "lucide-react";
import { TimelineStep } from "../components/TimelineStep";
import { StatusBadge } from "../components/StatusBadge";
import { useAuth } from "../context/AuthContext";

type Status = "created" | "packed" | "shipped" | "delivered";

interface UserOrder {
  id: string;
  productName: string;
  orderDate: string;
  status: Status;
  quantity: number;
  items: string[];
}

const USER_ORDERS: UserOrder[] = [
  {
    id: "BATCH-2024-001",
    productName: "Kit Hongo Ostra 500g",
    orderDate: "15 Ene 2024",
    status: "delivered",
    quantity: 2,
    items: ["Kit Hongo Ostra 500g ×2"],
  },
  {
    id: "NUTR-2024-B01-003",
    productName: "Sustrato Premium 2kg",
    orderDate: "2 Feb 2024",
    status: "shipped",
    quantity: 1,
    items: ["Sustrato Premium 2kg ×1", "Suplemento Crecimiento ×1"],
  },
  {
    id: "BATCH-2024-A03-005",
    productName: "Kit Lion's Mane 500g",
    orderDate: "18 Feb 2024",
    status: "packed",
    quantity: 1,
    items: ["Kit Lion's Mane 500g ×1", "Pulverizador 500ml ×1"],
  },
];

const STATUS_ICON = {
  created: Clock,
  packed: Box,
  shipped: Truck,
  delivered: CheckCircle,
};

// Mock timelines keyed by order id
function buildTimeline(orderId: string, status: Status) {
  const allSteps = [
    { label: "Creado", date: "15 Ene 2024", description: "Lote creado en instalaciones Green Block.", txHash: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f" },
    { label: "Empacado", date: "17 Ene 2024", description: "Kit empacado y verificado. Peso confirmado.", txHash: "0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b" },
    { label: "Enviado", date: "19 Ene 2024", description: "Kit enviado por mensajería ecológica. Temp. 18°C.", txHash: "0x5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d" },
    { label: "Entregado", date: "22 Ene 2024", description: "Entregado al destinatario. Condición: excelente.", txHash: "0x7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d" },
  ];

  const doneCount = { created: 1, packed: 2, shipped: 3, delivered: 4 }[status] ?? 1;
  return allSteps.slice(0, doneCount).map((s, i) => ({ ...s, done: true }));
}

const PENDING_STEPS: Record<Status, Array<{ label: string; description: string }>> = {
  created:   [{ label: "Empacado", description: "Pendiente" }, { label: "Enviado", description: "Pendiente" }, { label: "Entregado", description: "Pendiente" }],
  packed:    [{ label: "Enviado", description: "Pendiente" }, { label: "Entregado", description: "Pendiente" }],
  shipped:   [{ label: "Entregado", description: "Pendiente" }],
  delivered: [],
};

export function Traceability() {
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<UserOrder | null>(null);
  const [searchResult, setSearchResult] = useState<UserOrder | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);

  const activeOrder = selectedOrder ?? searchResult;

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setNotFound(false);
    setSelectedOrder(null);
    setSearchResult(null);
    await new Promise((r) => setTimeout(r, 700));
    // TODO: db.collection('batches').doc(query).get()
    const found = USER_ORDERS.find((o) => o.id.toLowerCase() === query.trim().toLowerCase()) ?? null;
    if (found) {
      setSearchResult(found);
    } else if (query.toUpperCase().includes("BATCH-2024-001")) {
      setSearchResult(USER_ORDERS[0]);
    } else {
      setNotFound(true);
    }
    setLoading(false);
  };

  const doneSteps = activeOrder ? buildTimeline(activeOrder.id, activeOrder.status) : [];
  const pendingSteps = activeOrder ? PENDING_STEPS[activeOrder.status] : [];

  return (
    <div className="min-h-screen py-10 px-4" style={{ backgroundColor: "#F8F4EF", fontFamily: "Nunito, sans-serif" }}>
      <div className="max-w-5xl mx-auto">
        <h1 style={{ fontWeight: 900, color: "#1B4332", fontSize: "1.8rem", marginBottom: "0.3rem" }}>
          Verificar trazabilidad
        </h1>
        <p className="mb-8 text-sm" style={{ color: "#6B7280" }}>
          Selecciona uno de tus pedidos o ingresa un ID de lote para ver su recorrido en blockchain.
        </p>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* LEFT: order list + search */}
          <div className="lg:w-80 flex-shrink-0 flex flex-col gap-5">

            {/* Search bar */}
            <div className="rounded-2xl p-4" style={{ backgroundColor: "white", border: "1px solid #E5E7EB" }}>
              <p className="text-xs mb-2" style={{ fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.05em" }}>Buscar por ID de lote</p>
              <div className="flex gap-2">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="BATCH-2024-001"
                  className="flex-1 px-3 py-2 rounded-xl text-sm outline-none"
                  style={{ border: "2px solid #E5E7EB", fontFamily: "Nunito, sans-serif", color: "#374151" }}
                />
                <button
                  onClick={handleSearch}
                  disabled={loading}
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-opacity hover:opacity-80"
                  style={{ backgroundColor: "#2D6A4F" }}
                >
                  {loading ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="animate-spin">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
                      <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : <Search size={16} color="white" />}
                </button>
              </div>
              {notFound && (
                <p className="text-xs mt-2" style={{ color: "#DC2626", fontWeight: 600 }}>
                  Lote no encontrado. Prueba con BATCH-2024-001.
                </p>
              )}
            </div>

            {/* User order list */}
            {user ? (
              <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "white", border: "1px solid #E5E7EB" }}>
                <div className="px-4 py-3" style={{ borderBottom: "1px solid #F3F4F6" }}>
                  <p className="text-xs" style={{ fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Tus pedidos ({USER_ORDERS.length})
                  </p>
                </div>
                <div className="divide-y" style={{ borderColor: "#F9FAFB" }}>
                  {USER_ORDERS.map((order) => {
                    const Icon = STATUS_ICON[order.status];
                    const isActive = activeOrder?.id === order.id;
                    return (
                      <button
                        key={order.id}
                        onClick={() => { setSelectedOrder(order); setSearchResult(null); setNotFound(false); setQuery(""); }}
                        className="w-full text-left px-4 py-4 transition-colors hover:opacity-90 flex items-start gap-3"
                        style={{ backgroundColor: isActive ? "#D8F3DC" : "transparent" }}
                      >
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                          style={{ backgroundColor: isActive ? "#2D6A4F" : "#F3F4F6" }}
                        >
                          <Icon size={16} color={isActive ? "white" : "#6B7280"} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm truncate" style={{ fontWeight: 700, color: isActive ? "#1B4332" : "#374151" }}>
                            {order.productName}
                          </p>
                          <p className="text-xs mb-1.5" style={{ color: "#9CA3AF" }}>{order.orderDate} · {order.id}</p>
                          <StatusBadge status={order.status} />
                        </div>
                        <ChevronRight size={14} color={isActive ? "#2D6A4F" : "#D1D5DB"} style={{ flexShrink: 0, marginTop: "0.2rem" }} />
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="rounded-2xl p-5 text-center" style={{ backgroundColor: "white", border: "1px dashed #D1D5DB" }}>
                <Package size={28} color="#D1D5DB" style={{ margin: "0 auto 0.5rem" }} />
                <p className="text-sm" style={{ color: "#9CA3AF", fontWeight: 600 }}>
                  Regístrate para ver el historial de tus pedidos
                </p>
              </div>
            )}
          </div>

          {/* RIGHT: tracking detail */}
          <div className="flex-1 min-w-0">
            {!activeOrder ? (
              <div className="h-full flex items-center justify-center rounded-2xl py-20" style={{ backgroundColor: "white", border: "2px dashed #E5E7EB" }}>
                <div className="text-center">
                  <Search size={40} color="#D1D5DB" style={{ margin: "0 auto 1rem" }} />
                  <p style={{ fontWeight: 700, color: "#9CA3AF", fontSize: "1rem" }}>
                    Selecciona un pedido o busca por ID
                  </p>
                  <p className="text-sm mt-1" style={{ color: "#D1D5DB" }}>La trazabilidad blockchain aparecerá aquí</p>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "white", border: "1px solid #E5E7EB" }}>
                {/* Order header */}
                <div className="p-5" style={{ borderBottom: "1px solid #F3F4F6" }}>
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <p className="text-xs mb-1" style={{ color: "#9CA3AF", fontWeight: 600 }}>Lote · {activeOrder.id}</p>
                      <h2 style={{ fontWeight: 900, color: "#1B4332", fontSize: "1.15rem", marginBottom: "0.4rem" }}>
                        {activeOrder.productName}
                      </h2>
                      <div className="flex flex-wrap gap-2">
                        {activeOrder.items.map((item) => (
                          <span key={item} className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: "#F3F4F6", color: "#6B7280", fontWeight: 600 }}>
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                    <StatusBadge status={activeOrder.status} />
                  </div>
                </div>

                {/* Timeline */}
                <div className="p-6">
                  <p className="text-xs mb-5" style={{ fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Recorrido verificado en blockchain
                  </p>
                  {doneSteps.map((step, i) => (
                    <TimelineStep
                      key={step.txHash}
                      label={step.label}
                      date={step.date}
                      description={step.description}
                      txHash={step.txHash}
                      done={true}
                      isLast={i === doneSteps.length - 1 && pendingSteps.length === 0}
                    />
                  ))}
                  {pendingSteps.map((step, i) => (
                    <div key={step.label} className="flex gap-4 mb-4">
                      <div className="flex flex-col items-center">
                        <div className="w-5 h-5 rounded-full flex-shrink-0 mt-1" style={{ backgroundColor: "#E5E7EB" }} />
                        {i < pendingSteps.length - 1 && <div className="w-0.5 flex-1 mt-1" style={{ backgroundColor: "#E5E7EB" }} />}
                      </div>
                      <div className="pb-4">
                        <p className="text-sm" style={{ fontWeight: 700, color: "#9CA3AF" }}>{step.label}</p>
                        <p className="text-xs mt-0.5" style={{ color: "#D1D5DB" }}>Pendiente</p>
                      </div>
                    </div>
                  ))}
                </div>

                {activeOrder.status === "delivered" && (
                  <div className="mx-5 mb-5 p-3 rounded-xl text-center" style={{ backgroundColor: "#D8F3DC" }}>
                    <p className="text-sm" style={{ fontWeight: 700, color: "#2D6A4F" }}>
                      <CheckCircle size={14} style={{ display: "inline", marginRight: "6px" }} />
                      Entregado y verificado en Polygon
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
