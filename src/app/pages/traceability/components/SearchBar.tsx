import { useState } from "react";
import { Search } from "lucide-react";
import type { Order } from "../../../models/order.model";

interface SearchBarProps {
  orders: Order[];
  onSelect: (order: Order | null) => void;
}

export function SearchBar({ orders, onSelect }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setLoading(true);
    setNotFound(false);
    await new Promise((r) => setTimeout(r, 400));
    const found = orders.find((o) => o.id.toLowerCase() === trimmed.toLowerCase()) ?? null;
    if (found) {
      onSelect(found);
    } else {
      setNotFound(true);
      onSelect(null);
    }
    setLoading(false);
  };

  return (
    <div className="rounded-2xl p-4" style={{ backgroundColor: "white", border: "1px solid #E5E7EB" }}>
      <p
        className="text-xs mb-2"
        style={{ fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.05em" }}
      >
        Buscar por ID de pedido
      </p>
      <div className="flex gap-2">
        <input
          value={query}
          onChange={(e) => { setQuery(e.target.value); setNotFound(false); }}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="ej: abc123..."
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
          ) : (
            <Search size={16} color="white" />
          )}
        </button>
      </div>
      {notFound && (
        <p className="text-xs mt-2" style={{ color: "#DC2626", fontWeight: 600 }}>
          Pedido no encontrado entre tus órdenes.
        </p>
      )}
    </div>
  );
}
