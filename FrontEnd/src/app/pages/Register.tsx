import { useState } from "react";
import { useNavigate } from "react-router";
import { Building2, CheckCircle, AlertCircle } from "lucide-react";
import { register } from "../../utils/auth";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    rut: "",
    email: "",
    region: "",
    comuna: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const regiones = [
    "Región Metropolitana",
    "Región de Valparaíso",
    "Región de O'Higgins",
    "Región del Maule",
    "Región del Biobío",
  ];

  const comunas = [
    "Santo Domingo",
    "Santiago",
    "Valparaíso",
    "Concepción",
    "La Serena",
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) {
      newErrors.username = "El nombre de usuario es requerido";
    }

    if (!formData.rut.trim()) {
      newErrors.rut = "El RUT es requerido";
    } else if (!/^\d{7,8}-[\dkK]$/.test(formData.rut)) {
      newErrors.rut = "Formato de RUT inválido (ej: 12345678-9)";
    }

    if (!formData.email.trim()) {
      newErrors.email = "El correo electrónico es requerido";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Correo electrónico inválido";
    }

    if (!formData.region) {
      newErrors.region = "Debe seleccionar una región";
    }

    if (!formData.comuna) {
      newErrors.comuna = "Debe seleccionar una comuna";
    }

    if (!formData.password) {
      newErrors.password = "La contraseña es requerida";
    } else if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = "Debe aceptar los términos y condiciones";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Registro contra el backend real (POST /api/auth/register).
    // El backend almacena: nombre, email y contraseña (hash bcrypt).
    const result = await register(
      formData.username,
      formData.email,
      formData.password
    );

    setIsLoading(false);

    if (result.success) {
      setIsSubmitted(true);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } else {
      setServerError(result.error || "No se pudo completar el registro");
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1e3a8a] to-[#3b82f6] flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            ¡Registro Exitoso!
          </h2>
          <p className="text-gray-600">
            Tu cuenta ha sido creada correctamente. Redirigiendo al inicio de sesión...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <Building2 className="w-8 h-8 text-[#1e40af]" />
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                Portal de Transparencia Municipal
              </h1>
              <p className="text-sm text-gray-600">Registro de Ciudadano</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Registro de Usuario Ciudadano
          </h2>
          <p className="text-gray-600 mb-8">
            Regístrate para recibir alertas y notificaciones sobre actualizaciones del portal
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre de Usuario <span className="text-red-500">*</span>
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.username ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Juan Pérez"
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">{errors.username}</p>
              )}
            </div>

            {/* RUT */}
            <div>
              <label htmlFor="rut" className="block text-sm font-medium text-gray-700 mb-1">
                RUT <span className="text-red-500">*</span>
              </label>
              <input
                id="rut"
                name="rut"
                type="text"
                value={formData.rut}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.rut ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="12345678-9"
              />
              {errors.rut && (
                <p className="mt-1 text-sm text-red-600">{errors.rut}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Correo Electrónico <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.email ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="correo@ejemplo.cl"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Region and Comuna */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-1">
                  Región <span className="text-red-500">*</span>
                </label>
                <select
                  id="region"
                  name="region"
                  value={formData.region}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.region ? "border-red-300" : "border-gray-300"
                  }`}
                >
                  <option value="">Seleccione...</option>
                  {regiones.map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
                {errors.region && (
                  <p className="mt-1 text-sm text-red-600">{errors.region}</p>
                )}
              </div>

              <div>
                <label htmlFor="comuna" className="block text-sm font-medium text-gray-700 mb-1">
                  Comuna <span className="text-red-500">*</span>
                </label>
                <select
                  id="comuna"
                  name="comuna"
                  value={formData.comuna}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.comuna ? "border-red-300" : "border-gray-300"
                  }`}
                >
                  <option value="">Seleccione...</option>
                  {comunas.map((comuna) => (
                    <option key={comuna} value={comuna}>
                      {comuna}
                    </option>
                  ))}
                </select>
                {errors.comuna && (
                  <p className="mt-1 text-sm text-red-600">{errors.comuna}</p>
                )}
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña <span className="text-red-500">*</span>
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.password ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Confirmar Contraseña <span className="text-red-500">*</span>
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.confirmPassword ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="••••••••"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Terms Checkbox */}
            <div>
              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  className="mt-1"
                />
                <span className="text-sm text-gray-700">
                  Acepto los{" "}
                  <a href="#" className="text-[#1e40af] hover:underline">
                    Términos y Condiciones
                  </a>{" "}
                  y la{" "}
                  <a href="#" className="text-[#1e40af] hover:underline">
                    Política de Privacidad
                  </a>
                  <span className="text-red-500">*</span>
                </span>
              </label>
              {errors.acceptTerms && (
                <p className="mt-1 text-sm text-red-600">{errors.acceptTerms}</p>
              )}
            </div>

            {/* Server Error */}
            {serverError && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3 flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{serverError}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#1e40af] text-white py-3 rounded-md hover:bg-[#1e3a8a] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Registrando..." : "Registrarse"}
            </button>

            {/* Back Link */}
            <div className="text-center pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                ← Volver al portal
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
