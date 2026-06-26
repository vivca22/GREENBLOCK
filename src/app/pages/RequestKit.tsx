import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import {
  FlaskConical, Package, Droplets,
  ShoppingCart, Plus, Minus, Trash2, ArrowRight, X, Check, LayoutGrid,
} from "lucide-react";
import { db } from "../../lib/firebase";
import { callCreateOrder } from "../../lib/functions";
import { useAuth } from "../context/AuthContext";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { MushroomIcon } from "../components/shared/MushroomIcon";

type Category = "all" | "kits" | "nutrients" | "materials";

interface KitFromDB {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: Exclude<Category, "all">;
  tags: string[];
  isActive: boolean;
  fungiType: string | null;
}

interface CartItem {
  kitId: string;
  name: string;
  price: number;
  qty: number;
  Icon: React.ElementType;
  iconBg: string;
}

type ViewMode = "catalog" | "checkout" | "success";

const CATEGORY_META: Record<Exclude<Category, "all">, { Icon: React.ElementType; iconColor: string; iconBg: string }> = {
  kits:      { Icon: MushroomIcon,  iconColor: "#2D6A4F", iconBg: "#D8F3DC" },
  nutrients: { Icon: FlaskConical,  iconColor: "#1D4ED8", iconBg: "#DBEAFE" },
  materials: { Icon: Droplets,      iconColor: "#92400E", iconBg: "#FEF3C7" },
};

const CATEGORIES = [
  { key: "all" as const,       label: "Todo el catálogo", Icon: LayoutGrid },
  { key: "kits" as const,      label: "Kits de hongos",   Icon: MushroomIcon },
  { key: "nutrients" as const, label: "Nutrientes",        Icon: FlaskConical },
  { key: "materials" as const, label: "Materiales",        Icon: Package },
];

const defaultForm = { fullName: "", phone: "", city: "", province: "", street: "", notes: "" };

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.7rem 1rem",
  borderRadius: "12px",
  border: "2px solid #E5E7EB",
  fontFamily: "Nunito, sans-serif",
  fontSize: "0.9rem",
  color: "#374151",
  outline: "none",
  boxSizing: "border-box",
  backgroundColor: "white",
};

export function RequestKit() {
  const { user } = useAuth();

  const [kits, setKits] = useState<KitFromDB[]>([]);
  const [kitsLoading, setKitsLoading] = useState(true);
  const [category, setCategory] = useState<Category>("all");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [view, setView] = useState<ViewMode>("catalog");
  const [form, setForm] = useState(defaultForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [completedOrderCount, setCompletedOrderCount] = useState(0);

  useEffect(() => {
    setKitsLoading(true);
    getDocs(query(collection(db, "kits"), where("isActive", "==", true)))
      .then((snap) => setKits(snap.docs.map((d) => ({ id: d.id, ...d.data() } as KitFromDB))))
      .catch(() => setKits([]))
      .finally(() => setKitsLoading(false));
  }, []);

  const filtered = category === "all" ? kits : kits.filter((k) => k.category === category);
  const getQty = (id: string) => cart.find((i) => i.kitId === id)?.qty ?? 0;

  const updateCart = (kit: KitFromDB, delta: number) => {
    const meta = CATEGORY_META[kit.category] || CATEGORY_META.kits;
    setCart((prev) => {
      const existing = prev.find((i) => i.kitId === kit.id);
      if (!existing && delta > 0) {
        return [...prev, { kitId: kit.id, name: kit.name, price: kit.price, qty: 1, Icon: meta.Icon, iconBg: meta.iconBg }];
      }
      if (existing) {
        const newQty = existing.qty + delta;
        if (newQty <= 0) return prev.filter((i) => i.kitId !== kit.id);
        if (newQty > kit.stock) return prev;
        return prev.map((i) => i.kitId === kit.id ? { ...i, qty: newQty } : i);
      }
      return prev;
    });
  };

  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { setSubmitError("Debes iniciar sesión para hacer un pedido"); return; }
    setSubmitting(true);
    setSubmitError(null);
    try {
      const shippingAddress = {
        fullName: form.fullName,
        street: form.street,
        city: form.city,
        province: form.province,
        phone: form.phone,
        reference: form.notes || undefined,
      };
      await Promise.all(
        cart.map((item) => callCreateOrder({ kitId: item.kitId, quantity: item.qty, shippingAddress }))
      );
      setCompletedOrderCount(cart.length);
      setView("success");
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message || "Error al procesar el pedido";
      setSubmitError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // ── SUCCESS ──────────────────────────────────
  if (view === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ backgroundColor: "#D8F3DC" }}>
        <div className="max-w-sm w-full rounded-2xl text-center p-10" style={{ backgroundColor: "white" }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "#D8F3DC" }}>
            <Check size={32} color="#2D6A4F" />
          </div>
          <h2 style={{ fontFamily: "Nunito", fontWeight: 900, color: "#1B4332", fontSize: "1.4rem" }}>¡Pedido recibido!</h2>
          <p className="mt-2" style={{ color: "#6B7280", fontFamily: "Nunito" }}>
            {completedOrderCount === 1 ? "1 orden creada" : `${completedOrderCount} órdenes creadas`} exitosamente
          </p>
          <p className="text-sm mt-3 mb-6" style={{ color: "#4B5563", fontFamily: "Nunito", lineHeight: 1.6 }}>
            Puedes revisar el estado de tu pedido en tu perfil. Te contactaremos con la confirmación de envío.
          </p>
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
          <div className="lg:col-span-3 rounded-2xl overflow-hidden" style={{ backgroundColor: "white", border: "1px solid #E5E7EB" }}>
            <div className="px-6 py-5" style={{ borderBottom: "1px solid #F3F4F6" }}>
              <button onClick={() => setView("catalog")} className="flex items-center gap-1 text-sm mb-3 transition-opacity hover:opacity-70" style={{ color: "#2D6A4F", fontWeight: 600 }}>
                ← Volver al catálogo
              </button>
              <h2 style={{ fontWeight: 900, color: "#1B4332", fontSize: "1.3rem" }}>Datos de entrega</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
              {[
                { name: "fullName", label: "Nombre completo *", type: "text",  placeholder: "Tu nombre" },
                { name: "phone",    label: "Teléfono *",         type: "tel",   placeholder: "+593 99 000 0000" },
                { name: "province", label: "Provincia *",        type: "text",  placeholder: "ej: Pichincha" },
                { name: "city",     label: "Ciudad *",           type: "text",  placeholder: "Tu ciudad" },
              ].map((f) => (
                <div key={f.name}>
                  <label style={{ display: "block", fontWeight: 600, color: "#374151", marginBottom: "0.35rem", fontSize: "0.85rem" }}>{f.label}</label>
                  <input
                    type={f.type}
                    required
                    name={f.name}
                    value={(form as Record<string, string>)[f.name]}
                    onChange={(e) => setForm((p) => ({ ...p, [f.name]: e.target.value }))}
                    placeholder={f.placeholder}
                    style={inputStyle}
                  />
                </div>
              ))}
              <div>
                <label style={{ display: "block", fontWeight: 600, color: "#374151", marginBottom: "0.35rem", fontSize: "0.85rem" }}>Dirección completa *</label>
                <textarea required name="street" value={form.street} onChange={(e) => setForm((p) => ({ ...p, street: e.target.value }))} rows={3} placeholder="Calle, número, barrio, código postal..." style={{ ...inputStyle, resize: "vertical" }} />
              </div>
              <div>
                <label style={{ display: "block", fontWeight: 600, color: "#374151", marginBottom: "0.35rem", fontSize: "0.85rem" }}>Notas adicionales</label>
                <textarea name="notes" value={form.notes} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} rows={2} placeholder="Instrucciones de entrega..." style={{ ...inputStyle, resize: "vertical" }} />
              </div>

              {submitError && (
                <div className="rounded-xl p-3 text-sm" style={{ backgroundColor: "#FEE2E2", color: "#DC2626", fontWeight: 600 }}>
                  {submitError}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl mt-2 transition-opacity hover:opacity-80"
                style={{ backgroundColor: "#2D6A4F", color: "white", fontWeight: 700, fontSize: "1rem" }}
              >
                {submitting ? <LoadingSpinner size={18} /> : <>Confirmar pedido <ArrowRight size={18} /></>}
              </button>
            </form>
          </div>

          <div className="lg:col-span-2">
            <div className="rounded-2xl overflow-hidden sticky top-24" style={{ backgroundColor: "white", border: "1px solid #E5E7EB" }}>
              <div className="px-5 py-4" style={{ borderBottom: "1px solid #F3F4F6" }}>
                <p style={{ fontWeight: 800, color: "#1B4332" }}>Resumen del pedido</p>
              </div>
              <div className="divide-y" style={{ borderColor: "#F9FAFB" }}>
                {cart.map((item) => (
                  <div key={item.kitId} className="flex items-center gap-3 px-5 py-3">
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
      <div className="px-4 py-10" style={{ backgroundColor: "white", borderBottom: "1px solid #E5E7EB" }}>
        <div className="max-w-6xl mx-auto">
          <h1 style={{ fontWeight: 900, color: "#1B4332", fontSize: "1.8rem", marginBottom: "0.3rem" }}>Catálogo Green Block</h1>
          <p className="text-sm" style={{ color: "#6B7280" }}>Kits de hongos, nutrientes y materiales para tu proyecto de micorremediación</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
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

            {/* Loading state */}
            {kitsLoading ? (
              <div className="flex items-center justify-center py-20">
                <LoadingSpinner />
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16" style={{ color: "#9CA3AF" }}>
                <Package size={40} style={{ margin: "0 auto 0.75rem", opacity: 0.3 }} />
                <p>No hay productos disponibles en esta categoría.</p>
              </div>
            ) : (
              <>
                {category !== "all" && (
                  <p className="text-xs mb-4" style={{ color: "#9CA3AF", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.06em" }}>
                    {filtered.length} productos disponibles
                  </p>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filtered.map((kit) => {
                    const meta = CATEGORY_META[kit.category] || CATEGORY_META.kits;
                    const qty = getQty(kit.id);
                    const inStock = kit.stock > 0;
                    return (
                      <div
                        key={kit.id}
                        className="rounded-2xl overflow-hidden flex flex-col"
                        style={{
                          backgroundColor: "white",
                          border: qty > 0 ? "2px solid #52B788" : "1px solid #E5E7EB",
                        }}
                      >
                        <div className="p-5 flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: meta.iconBg }}>
                            <meta.Icon size={24} color={meta.iconColor} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                {kit.fungiType && (
                                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: "#F3F4F6", color: "#9CA3AF", fontWeight: 700 }}>
                                    {kit.fungiType}
                                  </span>
                                )}
                                <h3 className="mt-1" style={{ fontWeight: 800, color: "#1B4332", fontSize: "0.95rem", lineHeight: 1.3 }}>{kit.name}</h3>
                              </div>
                              <div className="text-right flex-shrink-0">
                                <p style={{ fontWeight: 900, color: "#2D6A4F", fontSize: "1.1rem" }}>${kit.price}</p>
                                <p className="text-xs" style={{ color: inStock ? "#52B788" : "#EF4444", fontWeight: 600 }}>
                                  {inStock ? `${kit.stock} disp.` : "Agotado"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="px-5 pb-3">
                          <p className="text-sm mb-3" style={{ color: "#6B7280", lineHeight: 1.5 }}>{kit.description}</p>
                          <div className="flex flex-wrap gap-1.5 mb-4">
                            {kit.tags.map((tag) => (
                              <span key={tag} className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: meta.iconBg, color: meta.iconColor, fontWeight: 600 }}>
                                {tag}
                              </span>
                            ))}
                          </div>

                          {qty === 0 ? (
                            <button
                              onClick={() => inStock && updateCart(kit, 1)}
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
                                <button onClick={() => updateCart(kit, -1)} className="w-8 h-8 rounded-lg flex items-center justify-center transition-opacity hover:opacity-70" style={{ backgroundColor: "#F3F4F6" }}>
                                  <Minus size={14} color="#374151" />
                                </button>
                                <span style={{ fontWeight: 800, color: "#1B4332", minWidth: "1.5rem", textAlign: "center" }}>{qty}</span>
                                <button onClick={() => updateCart(kit, 1)} disabled={qty >= kit.stock} className="w-8 h-8 rounded-lg flex items-center justify-center transition-opacity hover:opacity-70" style={{ backgroundColor: "#D8F3DC" }}>
                                  <Plus size={14} color="#2D6A4F" />
                                </button>
                              </div>
                              <div className="flex items-center gap-2">
                                <span style={{ fontWeight: 700, color: "#2D6A4F" }}>${(kit.price * qty).toFixed(2)}</span>
                                <button onClick={() => setCart((prev) => prev.filter((i) => i.kitId !== kit.id))} className="w-7 h-7 rounded-lg flex items-center justify-center transition-opacity hover:opacity-70" style={{ backgroundColor: "#FEF2F2" }}>
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
              </>
            )}
          </div>

          {/* Cart */}
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
                      <div key={item.kitId} className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: "1px solid #F9FAFB" }}>
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: item.iconBg }}>
                          <item.Icon size={16} color="#2D6A4F" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate" style={{ color: "#374151", fontWeight: 600 }}>{item.name}</p>
                          <p className="text-xs" style={{ color: "#9CA3AF" }}>×{item.qty} · ${(item.price * item.qty).toFixed(2)}</p>
                        </div>
                        <button onClick={() => setCart((prev) => prev.filter((i) => i.kitId !== item.kitId))}>
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
                    {!user && (
                      <p className="text-xs mb-3 text-center" style={{ color: "#DC2626", fontWeight: 600 }}>
                        Inicia sesión para continuar
                      </p>
                    )}
                    <button
                      onClick={() => setView("checkout")}
                      disabled={!user}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl transition-opacity hover:opacity-80"
                      style={{ backgroundColor: user ? "#2D6A4F" : "#E5E7EB", color: user ? "white" : "#9CA3AF", fontWeight: 700 }}
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
