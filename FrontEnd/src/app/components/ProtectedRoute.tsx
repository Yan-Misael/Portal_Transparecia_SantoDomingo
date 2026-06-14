import { Navigate, useLocation } from "react-router";
import { type ReactNode } from "react";
import { isAuthenticated, isAdmin } from "../../utils/auth";

interface ProtectedRouteProps {
  children: ReactNode;
  /** Si es true, además de estar autenticado el usuario debe tener rol ADMIN. */
  requireAdmin?: boolean;
}

/**
 * Componente de guarda de rutas (route guard) a nivel de router.
 *
 * Complementa la protección que ya hace AdminPanel internamente, pero la
 * traslada al árbol de rutas para que el control de acceso sea declarativo y
 * la redirección ocurra ANTES de montar la vista protegida.
 *
 * - Sin sesión válida  -> redirige a /login (recordando el destino original).
 * - Sesión sin rol ADMIN cuando requireAdmin -> redirige al inicio.
 *
 * Cubre el requerimiento de "rutas protegidas en frontend" (EP 2.5 / EF1 / EF3).
 */
export default function ProtectedRoute({
  children,
  requireAdmin = false,
}: ProtectedRouteProps) {
  const location = useLocation();

  if (!isAuthenticated()) {
    // Guardamos la ruta solicitada para poder volver tras el login.
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (requireAdmin && !isAdmin()) {
    // Autenticado pero sin privilegios: no exponemos el panel de administración.
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
