import { createBrowserRouter } from "react-router";
import { PublicLayout } from "./layouts/PublicLayout";
import { Home } from "./pages/Home";
import { Traceability } from "./pages/Traceability";
import { RequestKit } from "./pages/RequestKit";
import { AdminLayout } from "./pages/admin/AdminLayout";
import { RecyclingSection } from "./pages/admin/components/RecyclingSection";
import { OrdersSection } from "./pages/admin/components/OrdersSection";
import { KitsSection } from "./pages/admin/components/KitsSection";
import { SettingsSection } from "./pages/admin/components/SettingsSection";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { HowToUse } from "./pages/HowToUse";
import { MiHongo } from "./pages/MiHongo";
import { Aprende } from "./pages/Aprende";
import { Tienda } from "./pages/Tienda";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: PublicLayout,
    children: [
      { index: true, Component: Home },
      { path: "trazabilidad", Component: Traceability },
      { path: "request", Component: RequestKit },
      { path: "como-usar", Component: HowToUse },
      { path: "register", Component: Register },
      { path: "mi-hongo", Component: MiHongo },
      { path: "aprende", Component: Aprende },
      { path: "tienda", Component: Tienda },
    ],
  },
  { path: "/login", Component: Login },
  {
    path: "/admin",
    Component: AdminLayout,
    children: [
      { path: "reciclaje", Component: RecyclingSection },
      { path: "pedidos", Component: OrdersSection },
      { path: "kits", Component: KitsSection },
      { path: "configuracion", Component: SettingsSection },
    ],
  },
]);
