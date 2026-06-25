import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../app/context/AuthContext";

export function useIsAdmin(): boolean {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!user?.email) { setIsAdmin(false); return; }
    getDoc(doc(db, "config/app"))
      .then((snap) => {
        const emails = (snap.data()?.adminEmails as string[]) || [];
        setIsAdmin(emails.includes(user.email!));
      })
      .catch(() => setIsAdmin(false));
  }, [user]);

  return isAdmin;
}
