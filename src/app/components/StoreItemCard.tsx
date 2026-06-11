interface StoreItemCardProps {
  itemKey: string;
  name: string;
  description: string;
  price: number;
  emoji: string;
  userPoints: number;
  owned: boolean;
  onRedeem: (itemKey: string, price: number) => void;
}

export function StoreItemCard({ itemKey, name, description, price, emoji, userPoints, owned, onRedeem }: StoreItemCardProps) {
  const canAfford = userPoints >= price;

  return (
    <div
      className="rounded-2xl p-4 flex flex-col gap-3"
      style={{
        backgroundColor: owned ? "#F0FDF4" : "white",
        border: owned ? "2px solid #52B788" : "1px solid #E5E7EB",
      }}
    >
      <div
        className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto"
        style={{ backgroundColor: "#D8F3DC", fontSize: "1.8rem" }}
      >
        {emoji}
      </div>
      <div className="text-center">
        <p style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, color: "#1B4332" }}>{name}</p>
        <p className="text-xs mt-0.5" style={{ color: "#6B7280", lineHeight: 1.4 }}>{description}</p>
      </div>
      <div className="flex items-center justify-center gap-1 mt-auto">
        <span className="text-sm" style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, color: "#2D6A4F" }}>
          🌿 {price} pts
        </span>
      </div>
      {owned ? (
        <div className="text-center text-sm rounded-xl py-1.5" style={{ backgroundColor: "#D8F3DC", color: "#2D6A4F", fontFamily: "Nunito, sans-serif", fontWeight: 700 }}>
          ✓ Ya tienes
        </div>
      ) : canAfford ? (
        <button
          onClick={() => onRedeem(itemKey, price)}
          className="w-full py-2 rounded-xl text-sm transition-opacity hover:opacity-80"
          style={{ backgroundColor: "#2D6A4F", color: "white", fontFamily: "Nunito, sans-serif", fontWeight: 700 }}
        >
          Canjear
        </button>
      ) : (
        <div
          className="text-center text-sm rounded-xl py-1.5"
          style={{ border: "1.5px solid #FCA5A5", color: "#DC2626", fontFamily: "Nunito, sans-serif", fontWeight: 600 }}
        >
          Necesitas más pts
        </div>
      )}
    </div>
  );
}
