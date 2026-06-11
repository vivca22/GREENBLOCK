/*
 * CONNECTIONS NEEDED:
 * - Firebase: import { db } from '../lib/firebase'
 * - Fetch catalog: db.collection('batches').where('status','==','available').get()
 * - Save order: db.collection('requests').add(orderData)
 */
import { useState } from "react";
import {
  Sprout, FlaskConical, Package, Droplets, Thermometer, Box,
  ShoppingCart, Plus, Minus, Trash2, ArrowRight, X, Check,
  LayoutGrid, ChevronDown,
} from "lucide-react";

type Category = "all" | "kits" | "nutrients" | "materials";

interface Product {
  batchId: string;
  name: string;
  category: Exclude<Category, "all">;
  price: number;
  stock: number;
  description: string;
  tags: string[];
  Icon: React.ElementType;
  iconColor: string;
  iconBg: string;
}

const CATALOG: Product[] = [
  // ── Kits de Hongos ──
  {
    batchId: "BATCH-A01", name: "Kit Hongo Ostra 500g", category: "kits", price: 25, stock: 14,
    description: "Micelio de Pleurotus ostreatus sobre sustrato inoculado. Degrada PET, HDPE y PP.",
    tags: ["Degrada PET", "Comestible", "Principiantes"],
    Icon: Sprout, iconColor: "#2D6A4F", iconBg: "#D8F3DC",
  },
  {
    batchId: "BATCH-A02", name: "Kit Hongo Ostra Rosa 250g", category: "kits", price: 18, stock: 8,
    description: "Variedad rosa con alta producción de lacasas. Ideal para plásticos LDPE y bolsas.",
    tags: ["Degrada LDPE", "Comestible", "Color vibrante"],
    Icon: Sprout, iconColor: "#2D6A4F", iconBg: "#D8F3DC",
  },
  {
    batchId: "BATCH-A03", name: "Kit Lion's Mane 500g", category: "kits", price: 32, stock: 5,
    description: "Hericium erinaceus. Alta concentración enzimática para PP y LDPE. Muy cotizado.",
    tags: ["Degrada PP", "Gourmet", "Alta potencia"],
    Icon: Sprout, iconColor: "#2D6A4F", iconBg: "#D8F3DC",
  },
  {
    batchId: "BATCH-A04", name: "Kit Shiitake 500g", category: "kits", price: 28, stock: 9,
    description: "Lentinula edodes sobre base lignocelulósica con fragmentos de HDPE integrados.",
    tags: ["Degrada HDPE", "Comestible", "Aromático"],
    Icon: Sprout, iconColor: "#2D6A4F", iconBg: "#D8F3DC",
  },
  // ── Nutrientes & Alimento ──
  {
    batchId: "NUTR-B01", name: "Sustrato Premium 2kg", category: "nutrients", price: 12, stock: 20,
    description: "Mezcla pasteurizada de aserrín, salvado de trigo y perlita para colonización óptima.",
    tags: ["2 kg", "Pasteurizado", "Bolsa sellada"],
    Icon: FlaskConical, iconColor: "#1D4ED8", iconBg: "#DBEAFE",
  },
  {
    batchId: "NUTR-B02", name: "Suplemento de Crecimiento 500ml", category: "nutrients", price: 15, stock: 15,
    description: "Solución líquida con aminoácidos y minerales. Dilución 1:50 en agua de riego.",
    tags: ["500 ml", "Dilución 1:50", "Acelera x1.5"],
    Icon: Droplets, iconColor: "#1D4ED8", iconBg: "#DBEAFE",
  },
  {
    batchId: "NUTR-B03", name: "Abono Micológico 250g", category: "nutrients", price: 10, stock: 30,
    description: "Polvo rico en lignina para reactivar el micelio entre cosechas. 1 cucharada por riego.",
    tags: ["250 g", "Post-cosecha", "Regenera"],
    Icon: FlaskConical, iconColor: "#1D4ED8", iconBg: "#DBEAFE",
  },
  // ── Materiales de cuidado ──
  {
    batchId: "MAT-C01", name: "Pulverizador de niebla fina 500ml", category: "materials", price: 8, stock: 50,
    description: "Boquilla ajustable para niebla ultra-fina. Mantiene humedad >85% sin encharcamiento.",
    tags: ["500 ml", "Boquilla ajustable", "Esencial"],
    Icon: Droplets, iconColor: "#92400E", iconBg: "#FEF3C7",
  },
  {
    batchId: "MAT-C02", name: "Termómetro-Higrómetro Digital", category: "materials", price: 22, stock: 12,
    description: "Monitor LCD de temperatura y HR con alarma configurable. Batería incluida.",
    tags: ["-10 a 60°C", "HR 0-99%", "Alarma"],
    Icon: Thermometer, iconColor: "#92400E", iconBg: "#FEF3C7",
  },
  {
    batchId: "MAT-C03", name: "Cámara de Fructificación 60×40cm", category: "materials", price: 35, stock: 7,
    description: "Tienda plegable con bandeja de agua y ventilación lateral para máxima cosecha.",
    tags: ["60×40×80cm", "Con bandeja", "Plegable"],
    Icon: Box, iconColor: "#92400E", iconBg: "#FEF3C7",
  },
  {
    batchId: "MAT-C04", name: "Kit de Inicio Completo", category: "materials", price: 55, stock: 4,
    description: "Todo incluido: pulverizador + termómetro + guantes de nitrilo + bisturí estéril + tapabocas.",
    tags: ["5 ítems", "Todo incluido", "Recomendado"],
    Icon: Package, iconColor: "#92400E", iconBg: "#FEF3C7",
  },
];

const CATEGORIES = [
  { key: "all" as const, label: "Todo el catálogo", Icon: LayoutGrid },
  { key: "kits" as const, label: "Kits de hongos", Icon: Sprout },
  { key: "nutrients" as const, label: "Nutrientes", Icon: FlaskConical },
  { key: "materials" as const, label: "Materiales", Icon: Package },
];

interface CartItem { batchId: string; name: string; price: number; qty: number; Icon: React.ElementType; iconBg: string }

type ViewMode = "catalog" | "checkout" | "success";

const defaultForm = { fullName: "", email: "", phone: "", city: "", address: "", notes: "" };

export function RequestKit() {
  const [category, setCategory] = useState<Category>("all");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [view, setView] = useState<ViewMode>("catalog");
  const [form, setForm] = useState(defaultForm);
  const [submitting, setSubmitting] = useState(false);
  const [orderId] = useState(() => `GB-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`);

  const filtered = category === "all" ? CATALOG : CATALOG.filter((p) => p.category === category);

  const getQty = (batchId: string) => cart.find((i) => i.batchId === batchId)?.qty ?? 0;

  const updateCart = (product: Product, delta: number) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.batchId === product.batchId);
      if (!existing && delta > 0) {
        return [...prev, { batchId: product.batchId, name: product.name, price: product.price, qty: 1, Icon: product.Icon, iconBg: product.iconBg }];
      }
      if (existing) {
        const newQty = existing.qty + delta;
        if (newQty <= 0) return prev.filter((i) => i.batchId !== product.batchId);
        return prev.map((i) => i.batchId === product.batchId ? { ...i, qty: newQty } : i);
      }
      return prev;
    });
  };

  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1400));
    // TODO: db.collection('requests').add({ ...form, cart, orderId, createdAt: new Date() })
    setSubmitting(false);
    setView("success");
  };

  const inputStyle = {
    width: "100%",
    padding: "0.7rem 1rem",
    borderRadius: "12px",
    border: "2px solid #E5E7EB",
    fontFamily: "Nunito, sans-serif",
    fontSize: "0.9rem",
    color: "#374151",
    outline: "none",
    boxSizing: "border-box" as const,
    backgroundColor: "white",
  };

  // ── SUCCESS ──────────────────────────────────
  if (view === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ backgroundColor: "#D8F3DC" }}>
        <div className="max-w-sm w-full rounded-2xl text-center p-10" style={{ backgroundColor: "white" }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "#D8F3DC" }}>
            <Check size={32} color="#2D6A4F" />
          </div>
          <h2 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, color: "#1B4332", fontSize: "1.4rem" }}>¡Pedido recibido!</h2>
          <p className="mt-2" style={{ color: "#6B7280", fontFamily: "Nunito" }}>Número de orden</p>
          <p className="mt-1 mb-5" style={{ fontWeight: 800, color: "#2D6A4F", fontSize: "1.2rem", fontFamily: "Nunito" }}>#{orderId}</p>
          <p className="text-sm mb-6" style={{ color: "#4B5563", fontFamily: "Nunito", lineHeight: 1.6 }}>Te contactaremos pronto con la confirmación de envío.</p>
          <button
            onClick={() => { setView("catalog"); setCart([]); setForm(defaultForm); }}
            className="px-8 py-3 rounded-xl transition-opacity hover:opacity-80"
            style={{ backgroundColor: "#2D6A4F", color: "white", fontWeight: 700, fontFamily: "Nunito" }}
          >
            Volver al catálogo
          </button>
        </div>
      </div>
    );
  }

  // ── CHECKOUT ────────────────────────────────
  if (view === "checkout") {
    return (
      <div className="min-h-screen py-8 px-4" style={{ backgroundColor: "#F8F4EF", fontFamily: "Nunito, sans-serif" }}>
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Form */}
          <div className="lg:col-span-3 rounded-2xl overflow-hidden" style={{ backgroundColor: "white", border: "1px solid #E5E7EB" }}>
            <div className="px-6 py-5" style={{ borderBottom: "1px solid #F3F4F6" }}>
              <button onClick={() => setView("catalog")} className="flex items-center gap-1 text-sm mb-3 transition-opacity hover:opacity-70" style={{ color: "#2D6A4F", fontWeight: 600 }}>
                ← Volver al catálogo
              </button>
              <h2 style={{ fontWeight: 900, color: "#1B4332", fontSize: "1.3rem" }}>Datos de entrega</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
              {[
                { name: "fullName", label: "Nombre completo *", type: "text", placeholder: "Tu nombre" },
                { name: "email", label: "Email *", type: "email", placeholder: "tu@email.com" },
                { name: "phone", label: "Teléfono", type: "tel", placeholder: "+1 555 000 0000" },
                { name: "city", label: "Ciudad *", type: "text", placeholder: "Tu ciudad" },
              ].map((f) => (
                <div key={f.name}>
                  <label style={{ display: "block", fontWeight: 600, color: "#374151", marginBottom: "0.35rem", fontSize: "0.85rem" }}>{f.label}</label>
                  <input
                    type={f.type}
                    required={f.label.includes("*")}
                    name={f.name}
                    value={(form as any)[f.name]}
                    onChange={(e) => setForm((p) => ({ ...p, [f.name]: e.target.value }))}
                    placeholder={f.placeholder}
                    style={inputStyle}
                  />
                </div>
              ))}
              <div>
                <label style={{ display: "block", fontWeight: 600, color: "#374151", marginBottom: "0.35rem", fontSize: "0.85rem" }}>Dirección completa *</label>
                <textarea required name="address" value={form.address} onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))} rows={3} placeholder="Calle, número, colonia, código postal..." style={{ ...inputStyle, resize: "vertical" }} />
              </div>
              <div>
                <label style={{ display: "block", fontWeight: 600, color: "#374151", marginBottom: "0.35rem", fontSize: "0.85rem" }}>Notas adicionales</label>
                <textarea name="notes" value={form.notes} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} rows={2} placeholder="Instrucciones de entrega, preguntas..." style={{ ...inputStyle, resize: "vertical" }} />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl mt-2 transition-opacity hover:opacity-80"
                style={{ backgroundColor: "#2D6A4F", color: "white", fontWeight: 700, fontSize: "1rem" }}
              >
                {submitting ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="animate-spin">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
                    <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <>Confirmar pedido <ArrowRight size={18} /></>
                )}
              </button>
            </form>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl overflow-hidden sticky top-24" style={{ backgroundColor: "white", border: "1px solid #E5E7EB" }}>
              <div className="px-5 py-4" style={{ borderBottom: "1px solid #F3F4F6" }}>
                <p style={{ fontWeight: 800, color: "#1B4332" }}>Resumen del pedido</p>
              </div>
              <div className="divide-y" style={{ borderColor: "#F9FAFB" }}>
                {cart.map((item) => (
                  <div key={item.batchId} className="flex items-center gap-3 px-5 py-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: item.iconBg }}>
                      <item.Icon size={16} color="#2D6A4F" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate" style={{ fontWeight: 600, color: "#374151" }}>{item.name}</p>
                      <p className="text-xs" style={{ color: "#9CA3AF" }}>×{item.qty}</p>
                    </div>
                    <p className="text-sm flex-shrink-0" style={{ fontWeight: 700, color: "#2D6A4F" }}>${(item.price * item.qty).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <div className="px-5 py-4 flex items-center justify-between" style={{ borderTop: "1px solid #E5E7EB" }}>
                <p style={{ fontWeight: 800, color: "#1B4332" }}>Total</p>
                <p style={{ fontWeight: 900, color: "#2D6A4F", fontSize: "1.2rem" }}>${cartTotal.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── CATALOG ──────────────────────────────────
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F8F4EF", fontFamily: "Nunito, sans-serif" }}>
      {/* Page header */}
      <div className="px-4 py-10" style={{ backgroundColor: "white", borderBottom: "1px solid #E5E7EB" }}>
        <div className="max-w-6xl mx-auto">
          <h1 style={{ fontWeight: 900, color: "#1B4332", fontSize: "1.8rem", marginBottom: "0.3rem" }}>Catálogo Green Block</h1>
          <p className="text-sm" style={{ color: "#6B7280" }}>Kits de hongos, nutrientes y materiales para tu proyecto de micorremediación</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* LEFT: catalog */}
          <div className="flex-1 min-w-0">
            {/* Category tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
              {CATEGORIES.map((cat) => {
                const active = category === cat.key;
                return (
                  <button
                    key={cat.key}
                    onClick={() => setCategory(cat.key)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm flex-shrink-0 transition-all"
                    style={{
                      backgroundColor: active ? "#2D6A4F" : "white",
                      color: active ? "white" : "#6B7280",
                      fontWeight: 600,
                      border: active ? "none" : "1px solid #E5E7EB",
                    }}
                  >
                    <cat.Icon size={15} />
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* Category heading */}
            {category !== "all" && (
              <p className="text-xs mb-4" style={{ color: "#9CA3AF", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.06em" }}>
                {filtered.length} productos disponibles
              </p>
            )}

            {/* Product grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filtered.map((product) => {
                const qty = getQty(product.batchId);
                const inStock = product.stock > 0;
                return (
                  <div
                    key={product.batchId}
                    className="rounded-2xl overflow-hidden flex flex-col"
                    style={{
                      backgroundColor: "white",
                      border: qty > 0 ? "2px solid #52B788" : "1px solid #E5E7EB",
                    }}
                  >
                    {/* Product header */}
                    <div className="p-5 flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: product.iconBg }}>
                        <product.Icon size={24} color={product.iconColor} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: "#F3F4F6", color: "#9CA3AF", fontWeight: 700 }}>
                              {product.batchId}
                            </span>
                            <h3 className="mt-1" style={{ fontWeight: 800, color: "#1B4332", fontSize: "0.95rem", lineHeight: 1.3 }}>{product.name}</h3>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p style={{ fontWeight: 900, color: "#2D6A4F", fontSize: "1.1rem" }}>${product.price}</p>
                            <p className="text-xs" style={{ color: inStock ? "#52B788" : "#EF4444", fontWeight: 600 }}>
                              {inStock ? `${product.stock} disp.` : "Agotado"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="px-5 pb-3">
                      <p className="text-sm mb-3" style={{ color: "#6B7280", lineHeight: 1.5 }}>{product.description}</p>
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {product.tags.map((tag) => (
                          <span key={tag} className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: product.iconBg, color: product.iconColor, fontWeight: 600 }}>
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Qty controls */}
                      {qty === 0 ? (
                        <button
                          onClick={() => inStock && updateCart(product, 1)}
                          disabled={!inStock}
                          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm transition-opacity hover:opacity-80"
                          style={{ backgroundColor: inStock ? "#2D6A4F" : "#E5E7EB", color: inStock ? "white" : "#9CA3AF", fontWeight: 700 }}
                        >
                          <Plus size={16} />
                          Agregar al pedido
                        </button>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button onClick={() => updateCart(product, -1)} className="w-8 h-8 rounded-lg flex items-center justify-center transition-opacity hover:opacity-70" style={{ backgroundColor: "#F3F4F6" }}>
                              <Minus size={14} color="#374151" />
                            </button>
                            <span style={{ fontWeight: 800, color: "#1B4332", minWidth: "1.5rem", textAlign: "center" }}>{qty}</span>
                            <button onClick={() => updateCart(product, 1)} className="w-8 h-8 rounded-lg flex items-center justify-center transition-opacity hover:opacity-70" style={{ backgroundColor: "#D8F3DC" }}>
                              <Plus size={14} color="#2D6A4F" />
                            </button>
                          </div>
                          <div className="flex items-center gap-2">
                            <span style={{ fontWeight: 700, color: "#2D6A4F" }}>${(product.price * qty).toFixed(2)}</span>
                            <button onClick={() => setCart((prev) => prev.filter((i) => i.batchId !== product.batchId))} className="w-7 h-7 rounded-lg flex items-center justify-center transition-opacity hover:opacity-70" style={{ backgroundColor: "#FEF2F2" }}>
                              <Trash2 size={13} color="#DC2626" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT: cart summary (sticky) */}
          <div className="lg:w-72 flex-shrink-0">
            <div className="sticky top-24 rounded-2xl overflow-hidden" style={{ backgroundColor: "white", border: "1px solid #E5E7EB" }}>
              <div className="px-5 py-4 flex items-center gap-2" style={{ borderBottom: "1px solid #F3F4F6" }}>
                <ShoppingCart size={18} color="#2D6A4F" />
                <p style={{ fontWeight: 800, color: "#1B4332" }}>Tu pedido</p>
                {cartCount > 0 && (
                  <span className="ml-auto px-2 py-0.5 rounded-full text-xs" style={{ backgroundColor: "#2D6A4F", color: "white", fontWeight: 700 }}>{cartCount}</span>
                )}
              </div>

              {cart.length === 0 ? (
                <div className="px-5 py-8 text-center">
                  <ShoppingCart size={32} color="#D1D5DB" style={{ margin: "0 auto 0.75rem" }} />
                  <p className="text-sm" style={{ color: "#9CA3AF" }}>Agrega productos del catálogo</p>
                </div>
              ) : (
                <>
                  <div className="max-h-56 overflow-y-auto">
                    {cart.map((item) => (
                      <div key={item.batchId} className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: "1px solid #F9FAFB" }}>
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: item.iconBg }}>
                          <item.Icon size={16} color="#2D6A4F" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate" style={{ color: "#374151", fontWeight: 600 }}>{item.name}</p>
                          <p className="text-xs" style={{ color: "#9CA3AF" }}>×{item.qty} · ${(item.price * item.qty).toFixed(2)}</p>
                        </div>
                        <button onClick={() => setCart((prev) => prev.filter((i) => i.batchId !== item.batchId))}>
                          <X size={14} color="#9CA3AF" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="px-5 py-4">
                    <div className="flex justify-between mb-4">
                      <p className="text-sm" style={{ color: "#6B7280" }}>Total</p>
                      <p style={{ fontWeight: 900, color: "#1B4332", fontSize: "1.1rem" }}>${cartTotal.toFixed(2)}</p>
                    </div>
                    <button
                      onClick={() => setView("checkout")}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl transition-opacity hover:opacity-80"
                      style={{ backgroundColor: "#2D6A4F", color: "white", fontWeight: 700 }}
                    >
                      Proceder a pedir
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
