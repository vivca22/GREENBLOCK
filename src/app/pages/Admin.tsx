/*
 * CONNECTIONS NEEDED:
 * - Firebase: import { db, auth } from '../lib/firebase'
 * - Blockchain: import { registerEvent } from '../lib/blockchain'
 * - ethers.js v6: contract.registerEvent(batchId, status, description)
 * - Save txHash to Firestore after tx.wait()
 * - Firebase Auth: auth.currentUser
 */
import { useState } from "react";
import { useNavigate } from "react-router";
import { X, Plus, LogOut, Package, Settings } from "lucide-react";
import { BatchCard } from "../components/BatchCard";
import { LoadingSpinner } from "../components/LoadingSpinner";

type Status = "created" | "packed" | "shipped" | "delivered";

interface Batch {
  id: string;
  name: string;
  quantity: number;
  status: Status;
}

const mockBatches: Batch[] = [
  { id: "BATCH-001", name: "Oyster Mushroom Kit 500g", quantity: 50, status: "delivered" },
  { id: "BATCH-002", name: "Pink Oyster Kit 250g", quantity: 30, status: "shipped" },
  { id: "BATCH-003", name: "Blue Oyster Kit 1kg", quantity: 20, status: "packed" },
];

type ModalType = "create" | "register" | null;

export function Admin() {
  const navigate = useNavigate();
  const [batches, setBatches] = useState<Batch[]>(mockBatches);
  const [modal, setModal] = useState<ModalType>(null);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [activeMenu, setActiveMenu] = useState<"batches" | "requests" | "settings">("batches");

  // Create batch form
  const [newBatch, setNewBatch] = useState({ name: "", type: "Oyster", quantity: 1, notes: "" });
  const [creating, setCreating] = useState(false);

  // Register event form
  const [eventStatus, setEventStatus] = useState<Status>("packed");
  const [eventDesc, setEventDesc] = useState("");
  const [registering, setRegistering] = useState(false);

  const handleCreateBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    await new Promise((r) => setTimeout(r, 1500));
    // TODO: contract.registerEvent(batchId, 'created', description); then save txHash to Firestore
    const id = `BATCH-${String(batches.length + 1).padStart(3, "0")}`;
    setBatches((prev) => [...prev, { id, name: newBatch.name || `${newBatch.type} Kit`, quantity: newBatch.quantity, status: "created" }]);
    setCreating(false);
    setModal(null);
    setNewBatch({ name: "", type: "Oyster", quantity: 1, notes: "" });
  };

  const handleRegisterEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegistering(true);
    await new Promise((r) => setTimeout(r, 1500));
    // TODO: contract.registerEvent(selectedBatch.id, eventStatus, eventDesc); save txHash
    setBatches((prev) => prev.map((b) => b.id === selectedBatch?.id ? { ...b, status: eventStatus } : b));
    setRegistering(false);
    setModal(null);
    setSelectedBatch(null);
    setEventDesc("");
  };

  const inputStyle = {
    width: "100%",
    padding: "0.65rem 0.9rem",
    borderRadius: "10px",
    border: "2px solid #D1D5DB",
    fontFamily: "Nunito, sans-serif",
    fontSize: "0.9rem",
    color: "#374151",
    outline: "none",
    boxSizing: "border-box" as const,
  };

  const menuItems = [
    { key: "batches" as const, icon: <Package size={18} />, label: "Batches" },
    { key: "requests" as const, icon: <span>📦</span>, label: "Requests" },
    { key: "settings" as const, icon: <Settings size={18} />, label: "Settings" },
  ];

  return (
    <div className="flex min-h-screen" style={{ fontFamily: "Nunito, sans-serif", backgroundColor: "#F9FAFB" }}>
      {/* Sidebar */}
      <aside
        className="w-56 flex-shrink-0 flex flex-col"
        style={{ backgroundColor: "white", borderRight: "1px solid #E5E7EB", minHeight: "100vh" }}
      >
        <div className="px-5 py-5" style={{ borderBottom: "1px solid #E5E7EB" }}>
          <div className="flex items-center gap-2">
            <span className="text-xl">🌿</span>
            <span style={{ fontWeight: 800, color: "#2D6A4F", fontSize: "1rem" }}>Green Block</span>
          </div>
          <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>Admin Panel</p>
        </div>

        <nav className="flex-1 p-3">
          {menuItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveMenu(item.key)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm mb-1 transition-colors text-left"
              style={{
                backgroundColor: activeMenu === item.key ? "#D8F3DC" : "transparent",
                color: activeMenu === item.key ? "#2D6A4F" : "#6B7280",
                fontWeight: activeMenu === item.key ? 700 : 500,
              }}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="px-4 py-4" style={{ borderTop: "1px solid #E5E7EB" }}>
          <p className="text-xs mb-2 truncate" style={{ color: "#9CA3AF" }}>admin@ecofungi.com</p>
          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-2 text-sm transition-opacity hover:opacity-70"
            style={{ color: "#DC2626", fontWeight: 600 }}
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-auto">
        {activeMenu === "batches" && (
          <>
            <div className="flex items-center justify-between mb-6">
              <h1 style={{ fontWeight: 800, color: "#1B4332", fontSize: "1.5rem" }}>Active Batches</h1>
              <button
                onClick={() => setModal("create")}
                className="flex items-center gap-2 px-4 py-2 rounded-xl transition-opacity hover:opacity-80"
                style={{ backgroundColor: "#2D6A4F", color: "white", fontWeight: 700 }}
              >
                <Plus size={16} />
                Create Batch
              </button>
            </div>
            <div className="flex flex-col gap-3">
              {batches.map((batch) => (
                <BatchCard
                  key={batch.id}
                  {...batch}
                  onRegisterEvent={(id) => {
                    const b = batches.find((x) => x.id === id);
                    if (b) { setSelectedBatch(b); setModal("register"); }
                  }}
                  onView={(id) => { const b = batches.find((x) => x.id === id); if (b) alert(`Batch: ${b.name}\nStatus: ${b.status}\nQuantity: ${b.quantity}`); }}
                />
              ))}
            </div>
          </>
        )}
        {activeMenu === "requests" && (
          <div className="flex items-center justify-center h-64">
            <p style={{ color: "#9CA3AF", fontWeight: 600 }}>📦 Requests view — connect to Firestore to load requests.</p>
          </div>
        )}
        {activeMenu === "settings" && (
          <div className="flex items-center justify-center h-64">
            <p style={{ color: "#9CA3AF", fontWeight: 600 }}>⚙️ Settings — coming soon.</p>
          </div>
        )}
      </main>

      {/* Create Batch Modal */}
      {modal === "create" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ backgroundColor: "rgba(0,0,0,0.4)" }}>
          <div className="w-full max-w-md rounded-2xl overflow-hidden shadow-xl" style={{ backgroundColor: "white" }}>
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid #E5E7EB" }}>
              <h2 style={{ fontWeight: 800, color: "#1B4332", fontSize: "1.1rem" }}>New Batch</h2>
              <button onClick={() => setModal(null)}><X size={18} style={{ color: "#9CA3AF" }} /></button>
            </div>
            <form onSubmit={handleCreateBatch} className="px-6 py-5 flex flex-col gap-4">
              <div>
                <label style={{ display: "block", fontWeight: 600, color: "#374151", marginBottom: "0.35rem", fontSize: "0.85rem" }}>Batch Name</label>
                <input value={newBatch.name} onChange={(e) => setNewBatch((p) => ({ ...p, name: e.target.value }))} placeholder="e.g. Oyster Kit Batch" style={inputStyle} />
              </div>
              <div>
                <label style={{ display: "block", fontWeight: 600, color: "#374151", marginBottom: "0.35rem", fontSize: "0.85rem" }}>Mushroom Type</label>
                <select
                  value={newBatch.type}
                  onChange={(e) => setNewBatch((p) => ({ ...p, type: e.target.value }))}
                  style={{ ...inputStyle, backgroundColor: "white" }}
                >
                  <option>Oyster</option>
                  <option>Pink Oyster</option>
                  <option>Blue Oyster</option>
                  <option>Shiitake</option>
                  <option>Lion's Mane</option>
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontWeight: 600, color: "#374151", marginBottom: "0.35rem", fontSize: "0.85rem" }}>Quantity</label>
                <input type="number" min={1} value={newBatch.quantity} onChange={(e) => setNewBatch((p) => ({ ...p, quantity: Number(e.target.value) }))} style={{ ...inputStyle, width: "120px" }} />
              </div>
              <div>
                <label style={{ display: "block", fontWeight: 600, color: "#374151", marginBottom: "0.35rem", fontSize: "0.85rem" }}>Notes</label>
                <textarea value={newBatch.notes} onChange={(e) => setNewBatch((p) => ({ ...p, notes: e.target.value }))} rows={2} style={{ ...inputStyle, resize: "vertical" }} placeholder="Optional notes..." />
              </div>
              {/* TODO: contract.registerEvent(batchId, 'created', description) */}
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setModal(null)} className="flex-1 py-2.5 rounded-xl transition-opacity hover:opacity-70" style={{ backgroundColor: "#F3F4F6", color: "#374151", fontWeight: 600 }}>
                  Cancel
                </button>
                <button type="submit" disabled={creating} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-opacity hover:opacity-80" style={{ backgroundColor: "#2D6A4F", color: "white", fontWeight: 700 }}>
                  {creating ? <LoadingSpinner size={16} /> : "Create + Register on Blockchain 🔗"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Register Event Modal */}
      {modal === "register" && selectedBatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ backgroundColor: "rgba(0,0,0,0.4)" }}>
          <div className="w-full max-w-md rounded-2xl overflow-hidden shadow-xl" style={{ backgroundColor: "white" }}>
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid #E5E7EB" }}>
              <h2 style={{ fontWeight: 800, color: "#1B4332", fontSize: "1.1rem" }}>Register Event</h2>
              <button onClick={() => setModal(null)}><X size={18} style={{ color: "#9CA3AF" }} /></button>
            </div>
            <form onSubmit={handleRegisterEvent} className="px-6 py-5 flex flex-col gap-4">
              <div>
                <label style={{ display: "block", fontWeight: 600, color: "#374151", marginBottom: "0.35rem", fontSize: "0.85rem" }}>Batch ID</label>
                <input readOnly value={selectedBatch.id} style={{ ...inputStyle, backgroundColor: "#F3F4F6", color: "#6B7280" }} />
              </div>
              <div>
                <label style={{ display: "block", fontWeight: 600, color: "#374151", marginBottom: "0.35rem", fontSize: "0.85rem" }}>Current Status</label>
                <input readOnly value={selectedBatch.status.charAt(0).toUpperCase() + selectedBatch.status.slice(1)} style={{ ...inputStyle, backgroundColor: "#F3F4F6", color: "#6B7280" }} />
              </div>
              <div>
                <label style={{ display: "block", fontWeight: 600, color: "#374151", marginBottom: "0.35rem", fontSize: "0.85rem" }}>New Status</label>
                <select
                  value={eventStatus}
                  onChange={(e) => setEventStatus(e.target.value as Status)}
                  style={{ ...inputStyle, backgroundColor: "white" }}
                >
                  <option value="packed">Packed</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontWeight: 600, color: "#374151", marginBottom: "0.35rem", fontSize: "0.85rem" }}>Description</label>
                <textarea required value={eventDesc} onChange={(e) => setEventDesc(e.target.value)} rows={3} placeholder="Describe this event..." style={{ ...inputStyle, resize: "vertical" }} />
              </div>
              {/* TODO: ethers.js v6: contract.registerEvent(id, status, desc) */}
              <button type="submit" disabled={registering} className="flex items-center justify-center gap-2 w-full py-3 rounded-xl transition-opacity hover:opacity-80" style={{ backgroundColor: "#2D6A4F", color: "white", fontWeight: 700 }}>
                {registering ? <LoadingSpinner size={16} /> : "Register on Blockchain + Save 🔗"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
