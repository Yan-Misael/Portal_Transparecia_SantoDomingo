import { useState } from "react";
import { useNavigate } from "react-router";
import { Search, Shield, TrendingUp, Users, ArrowRight } from "lucide-react";
import EconomicIndicators from "../components/EconomicIndicators";

export default function Home() {
  const navigate = useNavigate();
  const [selectedMonth, setSelectedMonth] = useState("Marzo");
  const [selectedYear, setSelectedYear] = useState("2026");

  const months = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const years = ["2026", "2025", "2024", "2023"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/categorias", { state: { month: selectedMonth, year: selectedYear } });
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#1e3a8a] to-[#3b82f6] text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Portal de Transparencia
            </h1>
            <p className="text-lg md:text-xl text-blue-100">
              Municipalidad de Santo Domingo — accede a la información pública de manera clara y oportuna.
            </p>
          </div>

          {/* Filter Form */}
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-xl p-6 md:p-8">
              <div className="grid md:grid-cols-3 gap-4 items-end">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Selecciona un mes
                  </label>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {months.map((month) => (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Selecciona un año
                  </label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="bg-[#1e40af] text-white px-6 py-3 rounded-md hover:bg-[#1e3a8a] transition-colors flex items-center justify-center gap-2"
                >
                  <Search className="w-5 h-5" />
                  Ingresar
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* Indicadores económicos externos (EF5) */}
      <EconomicIndicators />

      {/* Educational Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-blue-50 rounded-lg p-6 md:p-8 border border-blue-200">
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 p-3 rounded-full flex-shrink-0">
                <Shield className="w-8 h-8 text-[#1e40af]" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  ¿Qué es un Portal de Transparencia?
                </h2>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  Desde 2009, la Ley 20.285 garantiza tu derecho a conocer cómo el municipio gasta el dinero público. 
                  Este portal te permite consultarlo de forma simple, sin trámites ni burocracia. Aquí encontrarás 
                  información sobre presupuestos, remuneraciones, contrataciones y más.
                </p>
                <a
                  href="#"
                  className="text-[#1e40af] hover:text-[#1e3a8a] font-medium inline-flex items-center gap-2"
                >
                  Leer más sobre la ley →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* KPIs Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Últimas cifras disponibles
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-2">$450.5 M</p>
              <p className="text-gray-600">Presupuesto ejecutado</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-2">342</p>
              <p className="text-gray-600">Personal activo</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <ArrowRight className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-2">28</p>
              <p className="text-gray-600">Transferencias del mes</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}