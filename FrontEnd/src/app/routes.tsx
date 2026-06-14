import { createBrowserRouter } from "react-router";
import Home from "./pages/Home";
import Categories from "./pages/Categories";
import Salaries from "./pages/Salaries";
import Budget from "./pages/Budget";
import Transfers from "./pages/Transfers";
import Login from "./pages/Login";
import AdminPanel from "./pages/AdminPanel";
import Register from "./pages/Register";
import Organization from "./pages/Organization";
import Contracts from "./pages/Contracts";
import Subsidies from "./pages/Subsidies";
import Acts from "./pages/Acts";
import Audits from "./pages/Audits";
import Services from "./pages/Services";
import Participation from "./pages/Participation";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "categorias", Component: Categories },
      { path: "remuneraciones", Component: Salaries },
      { path: "presupuesto", Component: Budget },
      { path: "transferencias", Component: Transfers },
      { path: "registro", Component: Register },
      { path: "estructura", Component: Organization },
      { path: "contrataciones", Component: Contracts },
      { path: "subsidios", Component: Subsidies },
      { path: "actos", Component: Acts },
      { path: "auditorias", Component: Audits },
      { path: "tramites", Component: Services },
      { path: "participacion", Component: Participation },
    ],
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute requireAdmin>
        <AdminPanel />
      </ProtectedRoute>
    ),
  },
]);