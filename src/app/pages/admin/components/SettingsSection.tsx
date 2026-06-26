import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Check } from "lucide-react";
import { LoadingSpinner } from "../../../components/LoadingSpinner";
import { db } from "../../../../lib/firebase";

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.65rem 0.9rem",
  borderRadius: "10px",
  border: "2px solid #D1D5DB",
  fontFamily: "Nunito, sans-serif",
  fontSize: "0.9rem",
  color: "#374151",
  outline: "none",
  boxSizing: "border-box",
  backgroundColor: "white",
};

export function SettingsSection() {
  const [pointsPerGram, setPointsPerGram] = useState<number>(10);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getDoc(doc(db, "config/app")).then((snap) => {
      if (snap.exists()) setPointsPerGram(snap.data().pointsPerGram || 10);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await updateDoc(doc(db, "config/app"), { pointsPerGram });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-sm">
      <h1 style={{ fontWeight: 800, color: "#1B4332", fontSize: "1.5rem", marginBottom: "1.5rem" }}>
        Configuración
      </h1>

      <div className="rounded-2xl p-6" style={{ backgroundColor: "white", border: "1px solid #E5E7EB" }}>
        <div className="mb-5">
          <label style={{ display: "block", fontWeight: 700, color: "#374151", marginBottom: "0.35rem" }}>
            GreenPoints por gramo de plástico
          </label>
          <p style={{ fontSize: "0.8rem", color: "#9CA3AF", marginBottom: "0.6rem" }}>
            Tasa de conversión: 1g = X GreenPoints
          </p>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min="1"
              value={pointsPerGram}
              onChange={(e) => setPointsPerGram(Number(e.target.value))}
              style={{ ...inputStyle, width: "100px" }}
            />
            <span style={{ color: "#6B7280", fontWeight: 600 }}>pts / g</span>
          </div>
          <p style={{ fontSize: "0.8rem", color: "#2D6A4F", marginTop: "0.5rem", fontWeight: 600 }}>
            Ejemplo: 500g × {pointsPerGram} = {(500 * pointsPerGram).toLocaleString()} GreenPoints
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl transition-opacity hover:opacity-80"
            style={{ backgroundColor: "#2D6A4F", color: "white", fontWeight: 700 }}
          >
            {saving ? <LoadingSpinner size={16} /> : <><Check size={16} /> Guardar</>}
          </button>
          {saved && (
            <span style={{ color: "#2D6A4F", fontWeight: 600, fontSize: "0.875rem" }}>
              ✅ Guardado
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
