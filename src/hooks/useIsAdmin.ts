import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../app/context/AuthContext";

export function useIsAdmin(): boolean | null {
  const { user, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    if (loading) return;
    if (!user?.email) { setIsAdmin(false); return; }

    console.log("[useIsAdmin] Checking admin for:", user.email);
    getDoc(doc(db, "config/app"))
      .then((snap) => {
        if (!snap.exists()) {
          console.warn("[useIsAdmin] config/app not found — run seedDatabase.js");
          setIsAdmin(false);
          return;
        }
        const emails = (snap.data()?.adminEmails as string[]) || [];
        const result = emails.includes(user.email!);
        console.log("[useIsAdmin] adminEmails:", emails, "→ isAdmin:", result);
        setIsAdmin(result);
      })
      .catch((err) => {
        console.error("[useIsAdmin] Firestore error:", err);
        setIsAdmin(false);
      });
  }, [user, loading]);

  return isAdmin;
}
