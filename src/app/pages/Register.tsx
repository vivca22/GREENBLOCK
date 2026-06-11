/*
 * CONNECTIONS NEEDED:
 * - Firebase: import { auth, googleProvider, db } from '../lib/firebase'
 * - signInWithPopup(auth, googleProvider)
 * - db.collection('users').doc(user.uid).set({ kitType, purchaseDate, confirmed: true })
 */
import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../context/AuthContext";

const kitOptions = [
  "Oyster Mushroom Kit 500g",
  "Pink Oyster Kit 250g",
  "Blue Oyster Kit 1kg",
  "Lion's Mane Kit 500g",
  "Shiitake Kit 500g",
];

type Step = "google" | "confirm" | "done";

export function Register() {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const [step, setStep] = useState<Step>(user ? "done" : "google");
  const [googleLoading, setGoogleLoading] = useState(false);
  const [mockUser, setMockUser] = useState({ name: "", email: "", photo: "" });
  const [kitType, setKitType] = useState(kitOptions[0]);
  const [purchaseDate, setPurchaseDate] = useState("");
  const [confirming, setConfirming] = useState(false);

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    await new Promise((r) => setTimeout(r, 1400));
    // TODO: const result = await signInWithPopup(auth, googleProvider);
    const demoUser = {
      name: "María García",
      email: "maria.garcia@gmail.com",
      photo: "https://ui-avatars.com/api/?name=Mar%C3%ADa+Garc%C3%ADa&background=52B788&color=fff",
    };
    setMockUser(demoUser);
    setGoogleLoading(false);
    setStep("confirm");
  };

  const handleConfirmPurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    setConfirming(true);
    await new Promise((r) => setTimeout(r, 1000));
    // TODO: db.collection('users').doc(uid).set({ kitType, purchaseDate, confirmed: true })
    login({
      uid: "demo_" + Date.now(),
      name: mockUser.name,
      email: mockUser.email,
      photo: mockUser.photo,
      kitType,
      purchaseDate,
      confirmed: true,
    });
    setConfirming(false);
    setStep("done");
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

          {/* Header */}
          <div className="px-8 pt-8 pb-5 text-center" style={{ borderBottom: "1px solid #F0FDF4" }}>
            <div className="text-4xl mb-2">🌿</div>
            <h1 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "1.6rem", color: "#1B4332" }}>
              Join Green Block
            </h1>
            <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
              Register to access your usage guide & recipes
            </p>

            {/* Step indicators */}
            <div className="flex items-center justify-center gap-2 mt-4">
              {(["google", "confirm", "done"] as Step[]).map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs"
                    style={{
                      backgroundColor: step === s ? "#2D6A4F" : (["google", "confirm", "done"].indexOf(step) > i ? "#52B788" : "#E5E7EB"),
                      color: step === s || ["google", "confirm", "done"].indexOf(step) > i ? "white" : "#9CA3AF",
                      fontWeight: 700,
                    }}
                  >
                    {["google", "confirm", "done"].indexOf(step) > i ? "✓" : i + 1}
                  </div>
                  {i < 2 && <div className="w-6 h-0.5" style={{ backgroundColor: ["google", "confirm", "done"].indexOf(step) > i ? "#52B788" : "#E5E7EB" }} />}
                </div>
              ))}
            </div>
          </div>

          <div className="px-8 py-6">
            {/* Step 1: Google Sign In */}
            {step === "google" && (
              <div className="flex flex-col gap-4">
                <p className="text-sm text-center" style={{ color: "#4B5563" }}>
                  Sign in with your Google account to get started
                </p>
                <button
                  onClick={handleGoogleSignIn}
                  disabled={googleLoading}
                  className="w-full flex items-center justify-center gap-3 py-3 rounded-xl transition-all hover:shadow-md"
                  style={{ border: "2px solid #E5E7EB", color: "#374151", fontWeight: 700, backgroundColor: "white" }}
                >
                  {googleLoading ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="animate-spin">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="#2D6A4F" strokeWidth="4" />
                      <path className="opacity-75" fill="#2D6A4F" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                  )}
                  {googleLoading ? "Connecting..." : "Continue with Google"}
                </button>
                <p className="text-xs text-center" style={{ color: "#9CA3AF" }}>
                  Already have an account?{" "}
                  <Link to="/login" style={{ color: "#2D6A4F", fontWeight: 600 }}>Log in here</Link>
                </p>
              </div>
            )}

            {/* Step 2: Confirm Purchase */}
            {step === "confirm" && (
              <form onSubmit={handleConfirmPurchase} className="flex flex-col gap-4">
                <div className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: "#F0FDF4" }}>
                  <img src={mockUser.photo} alt={mockUser.name} className="w-10 h-10 rounded-full" />
                  <div>
                    <p style={{ fontWeight: 700, color: "#1B4332", fontSize: "0.9rem" }}>{mockUser.name}</p>
                    <p className="text-xs" style={{ color: "#6B7280" }}>{mockUser.email}</p>
                  </div>
                </div>
                <p className="text-sm" style={{ color: "#374151", fontWeight: 600 }}>
                  Confirm your Green Block kit purchase to unlock your personalized guide 🍄
                </p>
                <div>
                  <label style={{ display: "block", fontWeight: 600, color: "#374151", marginBottom: "0.4rem", fontSize: "0.85rem" }}>
                    Which kit did you buy? *
                  </label>
                  <select value={kitType} onChange={(e) => setKitType(e.target.value)} required style={{ ...inputStyle }}>
                    {kitOptions.map((k) => <option key={k}>{k}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontWeight: 600, color: "#374151", marginBottom: "0.4rem", fontSize: "0.85rem" }}>
                    Purchase date *
                  </label>
                  <input type="date" required value={purchaseDate} onChange={(e) => setPurchaseDate(e.target.value)} style={inputStyle} />
                </div>
                <button
                  type="submit"
                  disabled={confirming}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl transition-opacity hover:opacity-80"
                  style={{ backgroundColor: "#2D6A4F", color: "white", fontWeight: 700 }}
                >
                  {confirming ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="animate-spin">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
                      <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : "Confirm & Get My Guide →"}
                </button>
              </form>
            )}

            {/* Step 3: Done */}
            {step === "done" && (
              <div className="text-center flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: "#D8F3DC" }}>
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <path d="M6 16l7 7 13-13" stroke="#2D6A4F" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <h2 style={{ fontWeight: 800, color: "#1B4332", fontSize: "1.2rem" }}>You're in! 🌿</h2>
                  <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
                    Your guide and recipes are ready
                  </p>
                </div>
                <button
                  onClick={() => navigate("/como-usar")}
                  className="px-8 py-3 rounded-xl transition-opacity hover:opacity-80"
                  style={{ backgroundColor: "#2D6A4F", color: "white", fontWeight: 700 }}
                >
                  Go to My Guide →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
