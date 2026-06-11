import { motion, AnimatePresence } from "motion/react";

interface PointsToastProps {
  toast: { text: string; points: number } | null;
}

export function PointsToast({ toast }: PointsToastProps) {
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          key={toast.text + toast.points}
          initial={{ opacity: 0, y: 40, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 24 }}
          className="fixed bottom-24 left-1/2 z-50 flex items-center gap-2 px-5 py-3 rounded-2xl shadow-lg"
          style={{
            transform: "translateX(-50%)",
            backgroundColor: "#1B4332",
            fontFamily: "Nunito, sans-serif",
            pointerEvents: "none",
          }}
        >
          <span className="text-xl">🌿</span>
          <span style={{ color: "white", fontWeight: 700 }}>+{toast.points} pts</span>
          <span className="text-sm max-w-xs truncate" style={{ color: "#95D5B2" }}>{toast.text}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
