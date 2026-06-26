import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Search, Package } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { callGetOrders } from "../../lib/functions";
import { SearchBar } from "./traceability/components/SearchBar";
import { OrderList } from "./traceability/components/OrderList";
import { OrderDetail } from "./traceability/components/OrderDetail";
import { OrderTimeline } from "./traceability/components/OrderTimeline";
import { parseOrders } from "../models/mappers/orderMappers";
import type { Order } from "../models/order.model";

export function Traceability() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!user) return;
    setLoadingOrders(true);
    callGetOrders({ limitNum: 30 })
      .then((res) => setOrders(parseOrders(res.data)))
      .catch(() => setOrders([]))
      .finally(() => setLoadingOrders(false));
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#D8F3DC" }}>
        <div className="text-center" style={{ fontFamily: "Nunito, sans-serif" }}>
          <Package size={40} color="#2D6A4F" style={{ margin: "0 auto 0.75rem" }} />
          <p style={{ fontWeight: 700, color: "#1B4332" }}>Inicia sesión para ver tu trazabilidad</p>
          <button
            onClick={() => navigate("/login")}
            className="mt-4 px-6 py-2 rounded-xl"
            style={{ backgroundColor: "#2D6A4F", color: "white", fontWeight: 700 }}
          >
            Iniciar sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen py-10 px-4"
      style={{ backgroundColor: "#F8F4EF", fontFamily: "Nunito, sans-serif" }}
    >
      <div className="max-w-5xl mx-auto">
        <h1 style={{ fontWeight: 900, color: "#1B4332", fontSize: "1.8rem", marginBottom: "0.3rem" }}>
          Trazabilidad
        </h1>
        <p className="mb-8 text-sm" style={{ color: "#6B7280" }}>
          Selecciona un pedido para ver su recorrido detallado.
        </p>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* LEFT — search + order list */}
          <div className="lg:w-80 flex-shrink-0 flex flex-col gap-5">
            <SearchBar orders={orders} onSelect={setSelectedOrder} />
            <OrderList
              orders={orders}
              loading={loadingOrders}
              activeId={selectedOrder?.id}
              onSelect={setSelectedOrder}
            />
          </div>

          {/* RIGHT — order detail + timeline */}
          <div className="flex-1 min-w-0">
            {!selectedOrder ? (
              <div
                className="h-full flex items-center justify-center rounded-2xl py-20"
                style={{ backgroundColor: "white", border: "2px dashed #E5E7EB" }}
              >
                <div className="text-center">
                  <Search size={40} color="#D1D5DB" style={{ margin: "0 auto 1rem" }} />
                  <p style={{ fontWeight: 700, color: "#9CA3AF", fontSize: "1rem" }}>
                    Selecciona un pedido
                  </p>
                  <p className="text-sm mt-1" style={{ color: "#D1D5DB" }}>
                    El historial de estado aparecerá aquí
                  </p>
                </div>
              </div>
            ) : (
              <div
                className="rounded-2xl overflow-hidden"
                style={{ backgroundColor: "white", border: "1px solid #E5E7EB" }}
              >
                <OrderDetail order={selectedOrder} />
                <OrderTimeline order={selectedOrder} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
