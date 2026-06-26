import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, googleProvider, db } from "../../lib/firebase";

export interface GreenUser {
  uid: string;
  name: string;
  email: string;
  photo: string;
  kitType: string;
  purchaseDate: string;
  confirmed: boolean;
  greenPoints: number;
  recyclingStats: { totalGrams: number; totalDeliveries: number };
}

interface AuthContextType {
  user: GreenUser | null;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<{ uid: string; name: string; email: string; photo: string }>;
  saveUserProfile: (uid: string, data: Omit<GreenUser, "uid">) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loginWithEmail: async () => {},
  loginWithGoogle: async () => ({ uid: "", name: "", email: "", photo: "" }),
  saveUserProfile: async () => {},
  logout: async () => {},
  loading: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<GreenUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const docRef = doc(db, "users", firebaseUser.uid);
        const docSnap = await getDoc(docRef);
        const data = docSnap.exists() ? docSnap.data() : {};
        setUser({
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || data.name || "",
          email: firebaseUser.email || data.email || "",
          photo: firebaseUser.photoURL || data.photo || "",
          kitType: data.kitType || "",
          purchaseDate: data.purchaseDate || "",
          confirmed: data.confirmed || false,
          greenPoints: data.greenPoints || 0,
          recyclingStats: {
            totalGrams: data.recyclingStats?.totalGrams || 0,
            totalDeliveries: data.recyclingStats?.totalDeliveries || 0,
          },
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const loginWithEmail = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const u = result.user;
    return {
      uid: u.uid,
      name: u.displayName || "",
      email: u.email || "",
      photo: u.photoURL || "",
    };
  };

  const saveUserProfile = async (uid: string, data: Omit<GreenUser, "uid">) => {
    const docRef = doc(db, "users", uid);
    await setDoc(docRef, { ...data, updatedAt: serverTimestamp() }, { merge: true });
    setUser((prev) => ({
      ...(prev ?? { uid, greenPoints: 0, recyclingStats: { totalGrams: 0, totalDeliveries: 0 } }),
      uid,
      ...data,
    }));
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loginWithEmail, loginWithGoogle, saveUserProfile, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
