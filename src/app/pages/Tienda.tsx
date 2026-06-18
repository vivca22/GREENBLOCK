/*
 * CONNECTIONS NEEDED:
 * - Firebase: import { db } from '../lib/firebase'
 * - spendPoints(uid, amount, itemKey)
 * - equipItem(uid, itemKey)
 * - generateDiscountCode(uid, type)
 */
import { useState } from "react";
import { X, Ticket, Gift } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useGame } from "../context/GameContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";
import { GreenPointsBadge } from "../components/GreenPointsBadge";
import { StoreItemCard } from "../components/StoreItemCard";
import { FungiAvatar } from "../components/FungiAvatar";
import type { SkinType } from "../context/GameContext";

interface ConfirmModal { itemKey: string; name: string; price: number; emoji: string }

const MUSHROOM_ITEMS = [
  { itemKey: "watering_can", name: "Regadera", description: "Acelera el crecimiento x2 por 24h", price: 40, emoji: "🪣" },
  { itemKey: "fertilizer", name: "Abono especial", description: "Tu hongo sube directo a la siguiente etapa", price: 80, emoji: "⚡" },
  { itemKey: "uv_light", name: "Luz UV", description: "Efecto brillo en tu hongo por 7 días", price: 60, emoji: "💜" },
];

const SKIN_ITEMS: { itemKey: SkinType; name: string; description: string; price: number; skin: SkinType }[] = [
  { itemKey: "blue", name: "Hongo Azul", description: "Skin oceánico con tonos azul glacial", price: 80, skin: "blue" },
  { itemKey: "golden", name: "Hongo Dorado ✨", description: "Skin legendario con destellos dorados", price: 150, skin: "golden" },
  { itemKey: "rainbow", name: "Hongo Arcoíris 🌈", description: "Skin exclusivo multicolor psicodélico", price: 200, skin: "rainbow" },
];

const DISCOUNT_ITEMS = [
  {
    itemKey: "discount_5pct",
    name: "5% dto. próximo kit",
    description: "Recibe un código de descuento del 5% para tu próxima compra de kit Green Block.",
    price: 150,
    emoji: "🏷️",
    action: "Genera código",
  },
  {
    itemKey: "free_kit_raffle",
    name: "Kit gratis (sorteo)",
    description: "Entra a la rifa mensual para ganar un kit Green Block completamente gratis.",
    price: 500,
    emoji: "🎁",
    action: "Entrar a la rifa",
  },
];

export function Tienda() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { points, skin, equippedItems, stage, spendPoints, equipItem, setSkin, addPoints } = useGame();
  const [confirmModal, setConfirmModal] = useState<ConfirmModal | null>(null);
  const [purchasedItems, setPurchasedItems] = useState<Set<string>>(new Set());
  const [discountCode, setDiscountCode] = useState<string | null>(null);
  const [raffleEntered, setRaffleEntered] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#D8F3DC" }}>
        <div className="text-center">
          <p style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, color: "#1B4332" }}>Regístrate para acceder a la tienda</p>
          <button onClick={() => navigate("/register")} className="mt-4 px-6 py-2 rounded-xl" style={{ backgroundColor: "#2D6A4F", color: "white", fontFamily: "Nunito, sans-serif", fontWeight: 700 }}>
            Registrarse
          </button>
        </div>
      </div>
    );
  }

  const openConfirm = (itemKey: string, name: string, price: number, emoji: string) => {
    setConfirmModal({ itemKey, name, price, emoji });
  };

  const confirmRedeem = () => {
    if (!confirmModal) return;
    const { itemKey, price } = confirmModal;
    const success = spendPoints(price, itemKey);
    if (!success) { setConfirmModal(null); return; }

    // Handle different item types
    if (itemKey === "watering_can" || itemKey === "fertilizer" || itemKey === "uv_light") {
      equipItem(itemKey);
    } else if (["blue", "golden", "rainbow"].includes(itemKey)) {
      setSkin(itemKey as SkinType);
    } else if (itemKey === "discount_5pct") {
      const code = "GREEN" + Math.random().toString(36).substring(2, 7).toUpperCase();
      setDiscountCode(code);
    } else if (itemKey === "free_kit_raffle") {
      setRaffleEntered(true);
    }
    setPurchasedItems((prev) => new Set([...prev, itemKey]));
    setConfirmModal(null);
  };

  const isOwned = (itemKey: string) =>
    purchasedItems.has(itemKey) ||
    equippedItems.includes(itemKey) ||
    (["blue", "golden", "rainbow"].includes(itemKey) && skin === itemKey);

  return (
    <div className="min-h-screen pb-12" style={{ backgroundColor: "#F8F4EF", fontFamily: "Nunito, sans-serif" }}>
      {/* Header */}
      <div className="px-4 py-8" style={{ backgroundColor: "white", borderBottom: "1px solid #E5E7EB" }}>
        <div className="max-w-5xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 style={{ fontWeight: 900, color: "#1B4332", fontSize: "1.6rem" }}>🌿 Tienda Green Points</h1>
            <p className="text-sm mt-1" style={{ color: "#6B7280" }}>Canjea tus puntos por ítems, skins y descuentos reales</p>
          </div>
          <GreenPointsBadge points={points} size="lg" />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 pt-8">

        {/* Discount code banner */}
        {discountCode && (
          <div className="mb-6 p-4 rounded-2xl flex items-center justify-between gap-4" style={{ backgroundColor: "#D8F3DC", border: "1px solid #52B788" }}>
            <div>
              <p style={{ fontWeight: 700, color: "#1B4332" }}>🏷️ Tu código de descuento está listo</p>
              <p className="text-sm" style={{ color: "#2D6A4F" }}>Úsalo en tu próximo pedido</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl" style={{ backgroundColor: "#1B4332" }}>
              <Ticket size={16} color="#95D5B2" />
              <span style={{ color: "white", fontWeight: 900, fontSize: "1.1rem", letterSpacing: "0.05em" }}>{discountCode}</span>
            </div>
          </div>
        )}

        {raffleEntered && (
          <div className="mb-6 p-4 rounded-2xl" style={{ backgroundColor: "#EDE9FE", border: "1px solid #A78BFA" }}>
            <p style={{ fontWeight: 700, color: "#5B21B6" }}>🎁 ¡Estás en la rifa! El ganador se anuncia el último día del mes.</p>
          </div>
        )}

        {/* SECTION: Para tu hongo */}
        <section className="mb-10">
          <h2 style={{ fontWeight: 800, color: "#1B4332", fontSize: "1.2rem", marginBottom: "1rem" }}>
            🍄 Para tu hongo
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {MUSHROOM_ITEMS.map((item) => (
              <StoreItemCard
                key={item.itemKey}
                {...item}
                userPoints={points}
                owned={isOwned(item.itemKey)}
                onRedeem={(k, p) => openConfirm(k, item.name, p, item.emoji)}
              />
            ))}
          </div>
        </section>

        {/* SECTION: Skins del hongo */}
        <section className="mb-10">
          <h2 style={{ fontWeight: 800, color: "#1B4332", fontSize: "1.2rem", marginBottom: "1rem" }}>
            🎨 Skins del hongo
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {SKIN_ITEMS.map((item) => (
              <div
                key={item.itemKey}
                className="rounded-2xl p-4 flex flex-col gap-3"
                style={{
                  backgroundColor: isOwned(item.itemKey) ? "#F0FDF4" : "white",
                  border: isOwned(item.itemKey) ? "2px solid #52B788" : "1px solid #E5E7EB",
                }}
              >
                <div className="flex justify-center">
                  <FungiAvatar stage={stage} skin={item.skin} size={100} />
                </div>
                <div className="text-center">
                  <p style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, color: "#1B4332" }}>{item.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>{item.description}</p>
                </div>
                <div className="text-center">
                  <span style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, color: "#2D6A4F" }}>🌿 {item.price} pts</span>
                </div>
                {isOwned(item.itemKey) ? (
                  <div className="text-center text-sm rounded-xl py-1.5" style={{ backgroundColor: "#D8F3DC", color: "#2D6A4F", fontFamily: "Nunito, sans-serif", fontWeight: 700 }}>
                    ✓ {skin === item.itemKey ? "Activo" : "Ya tienes"}
                  </div>
                ) : points >= item.price ? (
                  <button
                    onClick={() => openConfirm(item.itemKey, item.name, item.price, "🎨")}
                    className="w-full py-2 rounded-xl text-sm transition-opacity hover:opacity-80"
                    style={{ backgroundColor: "#2D6A4F", color: "white", fontFamily: "Nunito, sans-serif", fontWeight: 700 }}
                  >
                    Canjear
                  </button>
                ) : (
                  <div className="text-center text-sm rounded-xl py-1.5" style={{ border: "1.5px solid #FCA5A5", color: "#DC2626", fontFamily: "Nunito, sans-serif", fontWeight: 600 }}>
                    Necesitas más pts
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* SECTION: Descuentos reales */}
        <section>
          <h2 style={{ fontWeight: 800, color: "#1B4332", fontSize: "1.2rem", marginBottom: "1rem" }}>
            🏷️ Descuentos reales
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {DISCOUNT_ITEMS.map((item) => {
              const owned = isOwned(item.itemKey);
              const canAfford = points >= item.price;
              return (
                <div
                  key={item.itemKey}
                  className="rounded-2xl p-6 flex flex-col gap-4"
                  style={{
                    backgroundColor: owned ? "#F0FDF4" : "white",
                    border: owned ? "2px solid #52B788" : "1px solid #E5E7EB",
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{item.emoji}</div>
                    <div>
                      <p style={{ fontWeight: 800, color: "#1B4332", fontSize: "1rem" }}>{item.name}</p>
                      <p className="text-sm mt-0.5" style={{ color: "#4B5563", lineHeight: 1.5 }}>{item.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span style={{ fontWeight: 800, color: "#2D6A4F", fontSize: "1.1rem" }}>🌿 {item.price} pts</span>
                    {owned ? (
                      <span className="px-4 py-2 rounded-xl text-sm" style={{ backgroundColor: "#D8F3DC", color: "#2D6A4F", fontWeight: 700 }}>✓ Canjeado</span>
                    ) : canAfford ? (
                      <button
                        onClick={() => openConfirm(item.itemKey, item.name, item.price, item.emoji)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-opacity hover:opacity-80"
                        style={{ backgroundColor: "#2D6A4F", color: "white", fontWeight: 700 }}
                      >
                        {item.itemKey === "free_kit_raffle" ? <Gift size={14} /> : <Ticket size={14} />}
                        {item.action}
                      </button>
                    ) : (
                      <span className="px-4 py-2 rounded-xl text-sm" style={{ border: "1.5px solid #FCA5A5", color: "#DC2626", fontWeight: 600 }}>
                        Necesitas más pts
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* Confirmation modal */}
      <AnimatePresence>
        {confirmModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm rounded-2xl overflow-hidden shadow-xl"
              style={{ backgroundColor: "white" }}
            >
              <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid #E5E7EB" }}>
                <h3 style={{ fontWeight: 800, color: "#1B4332" }}>Confirmar canje</h3>
                <button onClick={() => setConfirmModal(null)}><X size={18} style={{ color: "#9CA3AF" }} /></button>
              </div>
              <div className="px-6 py-5">
                <div className="text-center mb-5">
                  <span className="text-5xl">{confirmModal.emoji}</span>
                  <p className="mt-3 text-sm" style={{ color: "#374151" }}>
                    ¿Canjear <strong>{confirmModal.name}</strong> por{" "}
                    <strong style={{ color: "#2D6A4F" }}>{confirmModal.price} pts</strong>?
                  </p>
                </div>
                <div className="rounded-xl p-3 mb-5" style={{ backgroundColor: "#F9FAFB" }}>
                  <div className="flex items-center justify-between text-sm">
                    <span style={{ color: "#6B7280" }}>Saldo actual</span>
                    <span style={{ fontWeight: 700, color: "#1B4332" }}>🌿 {points} pts</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-1">
                    <span style={{ color: "#6B7280" }}>Después del canje</span>
                    <span style={{ fontWeight: 700, color: points >= confirmModal.price ? "#2D6A4F" : "#DC2626" }}>
                      🌿 {points - confirmModal.price} pts
                    </span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setConfirmModal(null)}
                    className="flex-1 py-2.5 rounded-xl transition-opacity hover:opacity-70"
                    style={{ backgroundColor: "#F3F4F6", color: "#374151", fontWeight: 600 }}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={confirmRedeem}
                    disabled={points < confirmModal.price}
                    className="flex-1 py-2.5 rounded-xl transition-opacity hover:opacity-80"
                    style={{ backgroundColor: points >= confirmModal.price ? "#2D6A4F" : "#E5E7EB", color: "white", fontWeight: 700 }}
                  >
                    Confirmar canje
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
