import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useAuth } from "./AuthContext";

export type SkinType = "default" | "blue" | "golden" | "rainbow";

export interface HistoryItem {
  id: string;
  icon: string;
  text: string;
  points: number;
  date: string;
}

const STAGE_THRESHOLDS = [0, 50, 150, 400, 700, 1000, Infinity];
const STAGE_NAMES = ["", "Espora", "Micelio", "Primordio", "Pin", "Joven", "Maduro"];

function getStage(pts: number): number {
  for (let i = STAGE_THRESHOLDS.length - 2; i >= 0; i--) {
    if (pts >= STAGE_THRESHOLDS[i]) return i + 1;
  }
  return 1;
}

function getStageProgress(pts: number): { current: number; max: number } {
  const stage = getStage(pts);
  const stageStart = STAGE_THRESHOLDS[stage - 1];
  const stageEnd = STAGE_THRESHOLDS[stage] === Infinity ? stageStart + 500 : STAGE_THRESHOLDS[stage];
  return { current: pts - stageStart, max: stageEnd - stageStart };
}

interface ToastData { text: string; points: number }

interface GameContextType {
  points: number;
  stage: number;
  stageName: string;
  stageProgress: { current: number; max: number };
  skin: SkinType;
  equippedItems: string[];
  completedLessons: string[];
  history: HistoryItem[];
  photosSent: number;
  referrals: number;
  lessonsCompleted: number;
  toast: ToastData | null;
  addPoints: (amount: number, text: string, icon: string) => void;
  setSkin: (skin: SkinType) => void;
  equipItem: (item: string) => void;
  unequipItem: (item: string) => void;
  spendPoints: (amount: number, itemKey: string) => boolean;
  completeLesson: (lessonId: string) => void;
}

const GameContext = createContext<GameContextType>({} as GameContextType);

const INITIAL_HISTORY: HistoryItem[] = [
  { id: "h1", icon: "🧠", text: "Quiz completado: Micorremediación", points: 20, date: "Hoy" },
  { id: "h2", icon: "📸", text: "Foto del hongo enviada", points: 30, date: "Ayer" },
  { id: "h3", icon: "📦", text: "Kit comprado", points: 100, date: "Hace 3 días" },
  { id: "h4", icon: "👥", text: "Amigo referido: maria@gmail.com", points: 50, date: "Hace 5 días" },
  { id: "h5", icon: "📖", text: "Lección completada: El hongo y el plástico", points: 50, date: "Hace 7 días" },
];

const STORAGE_KEY = "greenblock_game";

function loadLocal() {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    if (s) return JSON.parse(s);
  } catch {}
  return null;
}

export function GameProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const uid = user?.uid;

  const saved = loadLocal();
  const [points, setPoints] = useState<number>(saved?.points ?? 270);
  const [skin, setSkinState] = useState<SkinType>(saved?.skin ?? "default");
  const [equippedItems, setEquippedItems] = useState<string[]>(saved?.equippedItems ?? []);
  const [completedLessons, setCompletedLessons] = useState<string[]>(saved?.completedLessons ?? ["module-1"]);
  const [history, setHistory] = useState<HistoryItem[]>(saved?.history ?? INITIAL_HISTORY);
  const [photosSent] = useState<number>(2);
  const [referrals] = useState<number>(1);
  const [toast, setToast] = useState<ToastData | null>(null);
  const [firestoreLoaded, setFirestoreLoaded] = useState(false);

  // Load from Firestore when user logs in
  useEffect(() => {
    if (!uid) {
      setFirestoreLoaded(false);
      return;
    }
    const docRef = doc(db, "gameData", uid);
    getDoc(docRef).then((snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setPoints(data.points ?? 270);
        setSkinState(data.skin ?? "default");
        setEquippedItems(data.equippedItems ?? []);
        setCompletedLessons(data.completedLessons ?? ["module-1"]);
        setHistory(data.history ?? INITIAL_HISTORY);
      }
      setFirestoreLoaded(true);
    }).catch(() => setFirestoreLoaded(true));
  }, [uid]);

  // Sync to localStorage and Firestore on state changes
  useEffect(() => {
    const state = { points, skin, equippedItems, completedLessons, history };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    if (uid && firestoreLoaded) {
      setDoc(doc(db, "gameData", uid), state).catch(console.error);
    }
  }, [points, skin, equippedItems, completedLessons, history, uid, firestoreLoaded]);

  const addPoints = useCallback((amount: number, text: string, icon: string) => {
    setPoints((p) => p + amount);
    const item: HistoryItem = { id: "h" + Date.now(), icon, text, points: amount, date: "Ahora" };
    setHistory((h) => [item, ...h].slice(0, 20));
    setToast({ text, points: amount });
    setTimeout(() => setToast(null), 2800);
  }, []);

  const setSkin = useCallback((s: SkinType) => setSkinState(s), []);

  const equipItem = useCallback((item: string) => {
    setEquippedItems((prev) => prev.includes(item) ? prev : [...prev, item]);
  }, []);

  const unequipItem = useCallback((item: string) => {
    setEquippedItems((prev) => prev.filter((i) => i !== item));
  }, []);

  const spendPoints = useCallback((amount: number, itemKey: string): boolean => {
    setPoints((p) => {
      if (p < amount) return p;
      return p - amount;
    });
    return points >= amount;
  }, [points]);

  const completeLesson = useCallback((lessonId: string) => {
    setCompletedLessons((prev) => prev.includes(lessonId) ? prev : [...prev, lessonId]);
  }, []);

  const stage = getStage(points);
  const stageName = STAGE_NAMES[stage] ?? "Maduro";
  const stageProgress = getStageProgress(points);

  return (
    <GameContext.Provider value={{
      points, stage, stageName, stageProgress, skin, equippedItems,
      completedLessons, history, photosSent, referrals,
      lessonsCompleted: completedLessons.length,
      toast, addPoints, setSkin, equipItem, unequipItem, spendPoints, completeLesson,
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  return useContext(GameContext);
}
