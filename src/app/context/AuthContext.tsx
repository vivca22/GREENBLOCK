/*
 * CONNECTIONS NEEDED:
 * - Firebase: import { auth, googleProvider } from '../lib/firebase'
 * - signInWithPopup(auth, googleProvider)
 * - db.collection('users').doc(uid).set(userData)
 */
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface GreenUser {
  uid: string;
  name: string;
  email: string;
  photo: string;
  kitType: string;
  purchaseDate: string;
  confirmed: boolean;
}

interface AuthContextType {
  user: GreenUser | null;
  login: (user: GreenUser) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  loading: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<GreenUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("greenblock_user");
      if (stored) setUser(JSON.parse(stored));
    } catch {}
    setLoading(false);
  }, []);

  const login = (u: GreenUser) => {
    setUser(u);
    localStorage.setItem("greenblock_user", JSON.stringify(u));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("greenblock_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
