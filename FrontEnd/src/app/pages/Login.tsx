import { useState } from "react";
import { useNavigate } from "react-router";
import { Building2, AlertCircle, Lock } from "lucide-react";
import { toast } from "sonner";
import { login } from "../../utils/auth";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Autenticación contra el backend real (POST /api/auth/login)
    const result = await login(email, password);

    if (result.success) {
      // Login exitoso - notificar y redirigir al panel de administración
      toast.success("Sesión iniciada correctamente.");
      navigate("/admin");
    } else {
      // Mostrar el error devuelto por el servidor (inline + toast)
      const msg = result.error || "Error al iniciar sesión";
      setError(msg);
      toast.error(msg);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e3a8a] to-[#3b82f6] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4">
            <Building2 className="w-10 h-10 text-[#1e40af]" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Portal de Transparencia
          </h1>
          <p className="text-blue-100 text-sm">
            Acceso exclusivo para funcionarios municipales
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Iniciar Sesión
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3 flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Correo Electrónico
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                placeholder="usuario@santodomingo.cl"
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  error && !email ? "border-red-300" : "border-gray-300"
                }`}
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                placeholder="••••••••"
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  error && !password ? "border-red-300" : "border-gray-300"
                }`}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#1e40af] text-white py-3 rounded-md hover:bg-[#1e3a8a] transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Lock className="w-5 h-5" aria-hidden="true" />
              {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </button>

            {/* Helper text */}
            <p className="text-xs text-gray-500 text-center mt-4">
              Autenticación segura con JWT. Use las credenciales de un funcionario municipal registrado.
            </p>
          </form>

          {/* Back Link */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={() => navigate("/")}
              className="text-sm text-gray-600 hover:text-gray-900 block mx-auto"
            >
              ← Volver al portal público
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
