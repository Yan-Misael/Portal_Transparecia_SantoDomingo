import { Link, useNavigate } from "react-router";
import { Building2, Lock, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import AccessibilityToolbar from "./AccessibilityToolbar";
import { isAuthenticated as checkAuth, logout } from "../../utils/auth";

export default function Header() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Verificar autenticación con el token JWT del backend
    setIsAuthenticated(checkAuth());
  }, []);

  const handleLogout = () => {
    logout();
    setIsAuthenticated(false);
    navigate("/");
  };

  return (
    <header role="banner" className="bg-white border-b border-gray-200">
      {/* Barra de Herramientas de Accesibilidad */}
      <AccessibilityToolbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-3">
            <Building2 className="w-8 h-8 text-[#1e40af]" aria-hidden="true" />
            <div>
              <span className="text-lg font-semibold text-gray-900">
                Municipalidad de Santo Domingo
              </span>
              <p className="text-xs text-gray-600">Comuna Parque</p>
            </div>
          </Link>

          <nav role="navigation" aria-label="Navegación principal" className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="text-sm text-gray-700 hover:text-gray-900 transition-colors"
              aria-current="page"
            >
              Inicio
            </Link>
            <Link
              to="/categorias"
              className="text-sm text-gray-700 hover:text-gray-900 transition-colors"
            >
              Transparencia
            </Link>
            <a
              href="#"
              className="text-sm text-gray-700 hover:text-gray-900 transition-colors"
            >
              Links de Interés
            </a>
            <a
              href="#"
              className="text-sm text-gray-700 hover:text-gray-900 transition-colors"
            >
              Contacto
            </a>
          </nav>

          <div className="flex items-center gap-3">
            {/* Indicador de Sesión Segura */}
            {isAuthenticated ? (
              <>
                <div className="hidden sm:flex items-center gap-2 text-green-700 bg-green-50 px-3 py-1 rounded-full border border-green-200">
                  <Lock className="w-4 h-4" aria-hidden="true" />
                  <span className="text-sm font-medium">Sesión Activa</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  aria-label="Cerrar sesión"
                >
                  <LogOut className="w-4 h-4" aria-hidden="true" />
                  <span className="hidden sm:inline">Salir</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                aria-label="Iniciar sesión como funcionario"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
