/*
 * CONNECTIONS NEEDED:
 * - Firebase: import { auth } from '../lib/firebase'
 * - signInWithEmailAndPassword(auth, email, password)
 */
import { useState } from "react";
import { useNavigate } from "react-router";

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    await new Promise((r) => setTimeout(r, 1000));
    // TODO: signInWithEmailAndPassword(auth, email, password)
    if (email === "admin@ecofungi.com" && password === "demo1234") {
      navigate("/admin");
    } else {
      setError("Invalid credentials. Try admin@ecofungi.com / demo1234");
    }
    setLoading(false);
  };

  const inputStyle = {
    width: "100%",
    padding: "0.75rem 1rem",
    borderRadius: "12px",
    border: "2px solid #D1D5DB",
    fontFamily: "Nunito, sans-serif",
    fontSize: "0.95rem",
    color: "#374151",
    outline: "none",
    boxSizing: "border-box" as const,
    backgroundColor: "white",
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ backgroundColor: "#D8F3DC", fontFamily: "Nunito, sans-serif" }}>
      <div className="w-full max-w-sm">
        <div className="rounded-2xl shadow-sm overflow-hidden" style={{ backgroundColor: "white" }}>
          <div className="px-8 pt-8 pb-4 text-center">
            <div className="text-4xl mb-2">🌿</div>
            <h1 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "1.6rem", color: "#1B4332" }}>
              Green Block
            </h1>
            <p className="mt-1 text-sm" style={{ color: "#6B7280" }}>Admin Panel</p>
          </div>

          <form onSubmit={handleLogin} className="px-8 pb-8 flex flex-col gap-4">
            <div>
              <label style={{ display: "block", fontFamily: "Nunito, sans-serif", fontWeight: 600, color: "#374151", marginBottom: "0.4rem", fontSize: "0.9rem" }}>
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@ecofungi.com"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={{ display: "block", fontFamily: "Nunito, sans-serif", fontWeight: 600, color: "#374151", marginBottom: "0.4rem", fontSize: "0.9rem" }}>
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={inputStyle}
              />
            </div>

            {error && (
              <p className="text-sm text-center" style={{ color: "#DC2626", fontWeight: 600 }}>{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl transition-opacity hover:opacity-80"
              style={{ backgroundColor: "#2D6A4F", color: "white", fontWeight: 700, fontSize: "1rem" }}
            >
              {loading ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="animate-spin">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
                  <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : "Login →"}
            </button>

            <p className="text-xs text-center" style={{ color: "#9CA3AF" }}>
              Demo: admin@ecofungi.com / demo1234
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
