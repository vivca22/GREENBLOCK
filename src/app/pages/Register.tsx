import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../context/AuthContext";

export function Register() {
  const navigate = useNavigate();
  const { loginWithGoogle, saveUserProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");
    try {
      const u = await loginWithGoogle();
      await saveUserProfile(u.uid, {
        name: u.name,
        email: u.email,
        photo: u.photo,
        kitType: "",
        purchaseDate: "",
        confirmed: false,
      });
      navigate("/mi-hongo");
    } catch {
      setError("No se pudo iniciar sesión con Google. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ backgroundColor: "#D8F3DC", fontFamily: "Nunito, sans-serif" }}
    >
      <div className="w-full max-w-sm">
        <div className="rounded-2xl shadow-sm overflow-hidden" style={{ backgroundColor: "white" }}>
          <div className="px-8 pt-8 pb-5 text-center" style={{ borderBottom: "1px solid #F0FDF4" }}>
            <div className="text-4xl mb-2">🌿</div>
            <h1 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "1.6rem", color: "#1B4332" }}>
              Únete a Green Block
            </h1>
            <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
              Crea tu cuenta para empezar a cultivar
            </p>
          </div>

          <div className="px-8 py-6 flex flex-col gap-4">
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-3 rounded-xl transition-all hover:shadow-md"
              style={{ border: "2px solid #E5E7EB", color: "#374151", fontWeight: 700, backgroundColor: "white" }}
            >
              {loading ? (
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
              {loading ? "Conectando..." : "Continuar con Google"}
            </button>

            {error && (
              <p className="text-sm text-center" style={{ color: "#DC2626", fontWeight: 600 }}>{error}</p>
            )}

            <p className="text-xs text-center" style={{ color: "#9CA3AF" }}>
              ¿Ya tienes cuenta?{" "}
              <Link to="/login" style={{ color: "#2D6A4F", fontWeight: 600 }}>
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
