import { useState, useEffect, useCallback } from "react";
import { collection, query, orderBy, limit, getDocs, updateDoc, doc } from "firebase/firestore";
import { AlertCircle } from "lucide-react";
import { LoadingSpinner } from "../../../components/LoadingSpinner";
import { db } from "../../../../lib/firebase";

interface Kit {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  fungiType: string | null;
  isActive: boolean;
}

export function KitsSection() {
  const [kits, setKits] = useState<Kit[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  const loadKits = useCallback(async () => {
    const snap = await getDocs(query(collection(db, "kits"), orderBy("createdAt", "desc"), limit(50)));
    setKits(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Kit)));
  }, []);

  useEffect(() => {
    loadKits().finally(() => setDataLoading(false));
  }, [loadKits]);

  const handleToggle = async (kit: Kit) => {
    await updateDoc(doc(db, "kits", kit.id), { isActive: !kit.isActive });
    setKits((prev) => prev.map((k) => k.id === kit.id ? { ...k, isActive: !k.isActive } : k));
  };

  return (
    <div>
      <h1 style={{ fontWeight: 800, color: "#1B4332", fontSize: "1.5rem", marginBottom: "1.5rem" }}>
        Kits &amp; Productos
      </h1>

      {dataLoading ? (
        <div className="flex items-center gap-2 text-sm" style={{ color: "#6B7280" }}>
          <LoadingSpinner size={14} /> Cargando kits...
        </div>
      ) : (
        <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "white", border: "1px solid #E5E7EB" }}>
          {kits.length === 0 ? (
            <div className="px-5 py-10 text-center" style={{ color: "#9CA3AF" }}>
              <AlertCircle size={32} style={{ margin: "0 auto 0.75rem", opacity: 0.3 }} />
              <p>No hay kits en la base de datos.</p>
              <p className="text-xs mt-1">
                Corre <code>node scripts/seedDatabase.js</code> para inicializar.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
                <thead>
                  <tr style={{ backgroundColor: "#F9FAFB" }}>
                    {["Nombre", "Categoría", "Precio", "Stock", "Estado", ""].map((h) => (
                      <th key={h} style={{ padding: "0.75rem 1.25rem", textAlign: "left", fontWeight: 700, color: "#6B7280", fontSize: "0.8rem" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {kits.map((k) => (
                    <tr key={k.id} style={{ borderTop: "1px solid #F3F4F6" }}>
                      <td style={{ padding: "0.75rem 1.25rem", fontWeight: 600, color: "#374151" }}>{k.name}</td>
                      <td style={{ padding: "0.75rem 1.25rem" }}>
                        <span style={{ backgroundColor: "#F3F4F6", color: "#6B7280", padding: "2px 8px", borderRadius: "999px", fontSize: "0.75rem", fontWeight: 700 }}>
                          {k.category}
                        </span>
                      </td>
                      <td style={{ padding: "0.75rem 1.25rem", fontWeight: 700, color: "#2D6A4F" }}>${k.price}</td>
                      <td style={{ padding: "0.75rem 1.25rem", color: k.stock > 0 ? "#374151" : "#DC2626", fontWeight: 600 }}>
                        {k.stock} {k.stock === 0 && "(agotado)"}
                      </td>
                      <td style={{ padding: "0.75rem 1.25rem" }}>
                        <span style={{
                          backgroundColor: k.isActive ? "#D8F3DC" : "#F3F4F6",
                          color: k.isActive ? "#2D6A4F" : "#9CA3AF",
                          padding: "2px 8px", borderRadius: "999px", fontSize: "0.75rem", fontWeight: 700,
                        }}>
                          {k.isActive ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td style={{ padding: "0.75rem 1.25rem" }}>
                        <button
                          onClick={() => handleToggle(k)}
                          className="text-xs px-3 py-1.5 rounded-lg transition-opacity hover:opacity-70"
                          style={{
                            backgroundColor: k.isActive ? "#FEE2E2" : "#D8F3DC",
                            color: k.isActive ? "#DC2626" : "#2D6A4F",
                            fontWeight: 600,
                          }}
                        >
                          {k.isActive ? "Desactivar" : "Activar"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
