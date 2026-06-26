import { useState, useEffect, useCallback, useRef } from "react";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { Recycle, Search, ChevronDown, X } from "lucide-react";
import { LoadingSpinner } from "../../../components/LoadingSpinner";
import { db } from "../../../../lib/firebase";
import { callRegisterRecyclingDelivery, callGetRecyclingHistory } from "../../../../lib/functions";
import type { PlasticType, RecyclingDelivery } from "../../../models/recycling.model";
import { parseRecyclingDeliveries } from "../../../models/mappers/recyclingMappers";

interface AppUser {
  uid: string;
  email: string;
  name: string;
  greenPoints: number;
}


const PLASTIC_OPTIONS: PlasticType[] = ["PET", "HDPE", "LDPE", "PP", "mixed"];

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

function formatDate(ts: { seconds: number } | null): string {
  if (!ts) return "—";
  return new Date(ts.seconds * 1000).toLocaleDateString("es-EC", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

function UserAvatar({ name, size = 32 }: { name: string; size?: number }) {
  const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div
      style={{
        width: size, height: size, borderRadius: "50%", backgroundColor: "#D8F3DC",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: size * 0.38, fontWeight: 700, color: "#2D6A4F", flexShrink: 0,
      }}
    >
      {initials || "?"}
    </div>
  );
}

function UserSelector({
  users,
  selectedEmail,
  onSelect,
}: {
  users: AppUser[];
  selectedEmail: string;
  onSelect: (email: string) => void;
}) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selectedUser = users.find((u) => u.email === selectedEmail);

  const filtered = search.trim()
    ? users.filter(
        (u) =>
          u.name.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase())
      )
    : users;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSelect = (user: AppUser) => {
    onSelect(user.email);
    setOpen(false);
    setSearch("");
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect("");
    setSearch("");
  };

  return (
    <div ref={ref} style={{ position: "relative" }}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => { setOpen((p) => !p); setSearch(""); }}
        style={{
          ...inputStyle,
          display: "flex",
          alignItems: "center",
          gap: "0.6rem",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        {selectedUser ? (
          <>
            <UserAvatar name={selectedUser.name || selectedUser.email} size={26} />
            <div style={{ flex: 1, overflow: "hidden" }}>
              <p style={{ fontWeight: 700, color: "#1B4332", fontSize: "0.85rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {selectedUser.name || selectedUser.email}
              </p>
              <p style={{ fontSize: "0.72rem", color: "#9CA3AF", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {selectedUser.email}
              </p>
            </div>
            <button type="button" onClick={handleClear} style={{ padding: "2px", color: "#9CA3AF" }}>
              <X size={14} />
            </button>
          </>
        ) : (
          <>
            <Search size={15} style={{ color: "#9CA3AF", flexShrink: 0 }} />
            <span style={{ color: "#9CA3AF", flex: 1 }}>Buscar estudiante...</span>
            <ChevronDown size={14} style={{ color: "#9CA3AF" }} />
          </>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            right: 0,
            backgroundColor: "white",
            border: "2px solid #D1D5DB",
            borderRadius: "10px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            zIndex: 50,
            overflow: "hidden",
          }}
        >
          {/* Search inside dropdown */}
          <div style={{ padding: "0.5rem", borderBottom: "1px solid #F3F4F6" }}>
            <div style={{ position: "relative" }}>
              <Search size={14} style={{ position: "absolute", left: "0.65rem", top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }} />
              <input
                autoFocus
                type="text"
                placeholder="Nombre o email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  ...inputStyle,
                  paddingLeft: "2rem",
                  fontSize: "0.85rem",
                  border: "1px solid #E5E7EB",
                  padding: "0.45rem 0.65rem 0.45rem 2rem",
                }}
              />
            </div>
          </div>

          {/* User list */}
          <div style={{ maxHeight: "220px", overflowY: "auto" }}>
            {filtered.length === 0 ? (
              <div style={{ padding: "1rem", textAlign: "center", color: "#9CA3AF", fontSize: "0.85rem" }}>
                Sin resultados
              </div>
            ) : (
              filtered.map((u) => (
                <button
                  key={u.uid}
                  type="button"
                  onClick={() => handleSelect(u)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 transition-colors text-left"
                  style={{
                    backgroundColor: u.email === selectedEmail ? "#D8F3DC" : "transparent",
                    borderBottom: "1px solid #F9FAFB",
                  }}
                  onMouseEnter={(e) => { if (u.email !== selectedEmail) (e.currentTarget as HTMLElement).style.backgroundColor = "#F9FAFB"; }}
                  onMouseLeave={(e) => { if (u.email !== selectedEmail) (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
                >
                  <UserAvatar name={u.name || u.email} size={32} />
                  <div style={{ flex: 1, overflow: "hidden" }}>
                    <p style={{ fontWeight: 600, color: "#1B4332", fontSize: "0.875rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {u.name || "Sin nombre"}
                    </p>
                    <p style={{ fontSize: "0.75rem", color: "#6B7280", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {u.email}
                    </p>
                  </div>
                  {u.greenPoints > 0 && (
                    <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#2D6A4F", backgroundColor: "#D8F3DC", padding: "2px 6px", borderRadius: "999px", flexShrink: 0 }}>
                      {u.greenPoints.toLocaleString()} GP
                    </span>
                  )}
                </button>
              ))
            )}
          </div>

          {users.length > 0 && (
            <div style={{ padding: "0.4rem 0.75rem", borderTop: "1px solid #F3F4F6", backgroundColor: "#F9FAFB" }}>
              <p style={{ fontSize: "0.7rem", color: "#9CA3AF" }}>{users.length} usuario{users.length !== 1 ? "s" : ""} registrados</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function RecyclingSection() {
  const [pointsPerGram, setPointsPerGram] = useState<number>(10);
  const [users, setUsers] = useState<AppUser[]>([]);
  const [deliveries, setDeliveries] = useState<RecyclingDelivery[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  const [form, setForm] = useState({ studentEmail: "", weightGrams: "", plasticType: "mixed" as PlasticType });
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const loadDeliveries = useCallback(async () => {
    const res = await callGetRecyclingHistory({ limitNum: 50 });
    setDeliveries(parseRecyclingDeliveries(res.data as Record<string, unknown>[]));
  }, []);

  useEffect(() => {
    Promise.all([
      getDoc(doc(db, "config/app")).then((snap) => {
        if (snap.exists()) setPointsPerGram(snap.data().pointsPerGram || 10);
      }),
      getDocs(collection(db, "users")).then((snap) => {
        const loaded = snap.docs
          .map((d) => ({
            uid: d.id,
            email: d.data().email || "",
            name: d.data().name || "",
            greenPoints: d.data().greenPoints || 0,
          }))
          .sort((a, b) => (a.name || a.email).localeCompare(b.name || b.email, "es", { sensitivity: "base" }));
        setUsers(loaded);
      }),
      loadDeliveries(),
    ]).finally(() => setDataLoading(false));
  }, [loadDeliveries]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.studentEmail) return;
    setSubmitting(true);
    setResult(null);
    try {
      const weightGrams = parseFloat(form.weightGrams);
      const res = await callRegisterRecyclingDelivery({
        studentEmail: form.studentEmail,
        weightGrams,
        plasticType: form.plasticType,
      });
      setResult({
        success: true,
        message: `Se asignaron ${res.data.greenPointsAwarded} GreenPoints a ${form.studentEmail}`,
      });
      setForm({ studentEmail: "", weightGrams: "", plasticType: "mixed" });
      loadDeliveries();
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message || "Error al registrar";
      setResult({ success: false, message: msg });
    } finally {
      setSubmitting(false);
    }
  };

  const weightNum = parseFloat(form.weightGrams) || 0;
  const previewPoints = Math.floor(weightNum * pointsPerGram);

  return (
    <div className="max-w-4xl">
      <h1 style={{ fontWeight: 800, color: "#1B4332", fontSize: "1.5rem", marginBottom: "1.5rem" }}>
        Registrar Entrega de Plástico
      </h1>

      {dataLoading ? (
        <div className="flex items-center gap-2 text-sm" style={{ color: "#6B7280" }}>
          <LoadingSpinner size={14} /> Cargando...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Form */}
            <div className="rounded-2xl p-6" style={{ backgroundColor: "white", border: "1px solid #E5E7EB" }}>
              <h2 style={{ fontWeight: 700, color: "#1B4332", marginBottom: "1.25rem" }}>Nueva entrega</h2>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                {/* User selector */}
                <div>
                  <label style={{ display: "block", fontWeight: 600, color: "#374151", marginBottom: "0.35rem", fontSize: "0.85rem" }}>
                    Estudiante *
                  </label>
                  <UserSelector
                    users={users}
                    selectedEmail={form.studentEmail}
                    onSelect={(email) => setForm((p) => ({ ...p, studentEmail: email }))}
                  />
                  {users.length === 0 && (
                    <p style={{ fontSize: "0.75rem", color: "#F59E0B", marginTop: "0.3rem" }}>
                      No hay usuarios registrados aún
                    </p>
                  )}
                </div>

                {/* Weight */}
                <div>
                  <label style={{ display: "block", fontWeight: 600, color: "#374151", marginBottom: "0.35rem", fontSize: "0.85rem" }}>
                    Peso en gramos *
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      required
                      min="1"
                      step="0.1"
                      placeholder="ej: 500"
                      value={form.weightGrams}
                      onChange={(e) => setForm((p) => ({ ...p, weightGrams: e.target.value }))}
                      style={{ ...inputStyle, width: "150px" }}
                    />
                    <span style={{ color: "#6B7280", fontWeight: 600 }}>g</span>
                  </div>
                </div>

                {/* Plastic type */}
                <div>
                  <label style={{ display: "block", fontWeight: 600, color: "#374151", marginBottom: "0.35rem", fontSize: "0.85rem" }}>
                    Tipo de plástico
                  </label>
                  <select
                    value={form.plasticType}
                    onChange={(e) => setForm((p) => ({ ...p, plasticType: e.target.value as PlasticType }))}
                    style={{ ...inputStyle, width: "auto", backgroundColor: "white" }}
                  >
                    {PLASTIC_OPTIONS.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                {/* Preview */}
                {weightNum > 0 && form.studentEmail && (
                  <div className="rounded-xl p-4" style={{ backgroundColor: "#D8F3DC" }}>
                    <p style={{ fontWeight: 700, color: "#1B4332", fontSize: "0.85rem" }}>Vista previa</p>
                    <p style={{ color: "#2D6A4F", fontSize: "1.1rem", fontWeight: 800, marginTop: "0.25rem" }}>
                      {weightNum.toLocaleString()}g × {pointsPerGram} pts/g = {previewPoints.toLocaleString()} GP
                    </p>
                    <p style={{ fontSize: "0.75rem", color: "#52B788", marginTop: "0.2rem" }}>
                      para {form.studentEmail}
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting || !form.studentEmail}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl transition-opacity hover:opacity-80 disabled:opacity-40"
                  style={{ backgroundColor: "#2D6A4F", color: "white", fontWeight: 700 }}
                >
                  {submitting ? <LoadingSpinner size={16} /> : <><Recycle size={16} /> Registrar entrega</>}
                </button>

                {result && (
                  <div
                    className="rounded-xl p-3 text-sm"
                    style={{
                      backgroundColor: result.success ? "#D8F3DC" : "#FEE2E2",
                      color: result.success ? "#1B4332" : "#DC2626",
                      fontWeight: 600,
                    }}
                  >
                    {result.success ? "✅" : "❌"} {result.message}
                  </div>
                )}
              </form>
            </div>

            {/* Stats */}
            <div className="flex flex-col gap-4">
              {[
                { label: "Total entregas", value: String(deliveries.length) },
                { label: "Plástico reciclado", value: `${deliveries.reduce((s, d) => s + d.weightGrams, 0).toLocaleString()}g` },
                { label: "GreenPoints asignados", value: deliveries.reduce((s, d) => s + d.greenPointsAwarded, 0).toLocaleString() },
              ].map((stat) => (
                <div key={stat.label} className="rounded-2xl p-5" style={{ backgroundColor: "white", border: "1px solid #E5E7EB" }}>
                  <p style={{ color: "#6B7280", fontSize: "0.85rem", fontWeight: 600 }}>{stat.label}</p>
                  <p style={{ fontWeight: 900, color: "#2D6A4F", fontSize: "2rem" }}>{stat.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent deliveries */}
          <div className="mt-6 rounded-2xl overflow-hidden" style={{ backgroundColor: "white", border: "1px solid #E5E7EB" }}>
            <div className="px-5 py-4" style={{ borderBottom: "1px solid #E5E7EB" }}>
              <p style={{ fontWeight: 700, color: "#1B4332" }}>Entregas recientes</p>
            </div>
            {deliveries.length === 0 ? (
              <div className="px-5 py-10 text-center" style={{ color: "#9CA3AF" }}>
                No hay entregas registradas aún
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#F9FAFB" }}>
                      {["Estudiante", "Peso", "Tipo", "GreenPoints", "Fecha"].map((h) => (
                        <th key={h} style={{ padding: "0.75rem 1.25rem", textAlign: "left", fontWeight: 700, color: "#6B7280", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.04em" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {deliveries.map((d) => {
                      const user = users.find((u) => u.email === d.studentEmail);
                      return (
                        <tr key={d.id} style={{ borderTop: "1px solid #F3F4F6" }}>
                          <td style={{ padding: "0.75rem 1.25rem" }}>
                            <div className="flex items-center gap-2">
                              {user && <UserAvatar name={user.name || user.email} size={28} />}
                              <div>
                                {user?.name && <p style={{ fontWeight: 600, color: "#1B4332", fontSize: "0.875rem" }}>{user.name}</p>}
                                <p style={{ color: "#6B7280", fontSize: user?.name ? "0.75rem" : "0.875rem" }}>{d.studentEmail}</p>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: "0.75rem 1.25rem", color: "#374151", fontWeight: 600 }}>{d.weightGrams.toLocaleString()}g</td>
                          <td style={{ padding: "0.75rem 1.25rem" }}>
                            <span style={{ backgroundColor: "#D8F3DC", color: "#2D6A4F", padding: "2px 8px", borderRadius: "999px", fontWeight: 700, fontSize: "0.75rem" }}>
                              {d.plasticType}
                            </span>
                          </td>
                          <td style={{ padding: "0.75rem 1.25rem", color: "#2D6A4F", fontWeight: 700 }}>+{d.greenPointsAwarded.toLocaleString()}</td>
                          <td style={{ padding: "0.75rem 1.25rem", color: "#9CA3AF", fontSize: "0.8rem" }}>{formatDate(d.registeredAt)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
