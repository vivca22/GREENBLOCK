import { Outlet } from "react-router";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { ChatBot } from "../components/ChatBot";
import { PointsToast } from "../components/PointsToast";
import { useGame } from "../context/GameContext";

export function PublicLayout() {
  const { toast } = useGame();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ChatBot />
      <PointsToast toast={toast} />
    </div>
  );
}
