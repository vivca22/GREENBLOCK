import { RouterProvider } from "react-router";
import { router } from "./routes";
import { AuthProvider } from "./context/AuthContext";
import { GameProvider } from "./context/GameContext";
import "../styles/fonts.css";

export default function App() {
  return (
    <AuthProvider>
      <GameProvider>
        <RouterProvider router={router} />
      </GameProvider>
    </AuthProvider>
  );
}
