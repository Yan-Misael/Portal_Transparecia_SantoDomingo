import { useState } from "react";
import { useLocation, Link } from "react-router";
import { ChevronLeft, Download, Search, User } from "lucide-react";

const subsidiesData = [
  {
    id: 1,
    programa: "Subsidio Único Familiar (SUF)",
    beneficiarios: 187,
    montoTotal: 28050000,
    montoIndividual: 150000,
    descripcion: "Aporte monetario mensual para familias vulnerables con menores de edad",
  },
  {
    id: 2,
    programa: "Pensión Básica Solidaria",
    beneficiarios: 142,
    montoTotal: 20880000,
    montoIndividual: 147000,
    descripcion: "Beneficio para adultos mayores de 65 años sin pensión",
  },
  {
    id: 3,
    programa: "Subsidio al Pago de Consumo de Agua Potable",
    beneficiarios: 325,
    montoTotal: 13000000,
    montoIndividual: 40000,
    descripcion: "Apoyo para el pago del servicio de agua potable a familias vulnerables",
  },
  {
    id: 4,
    programa: "Beca Indígena",
    beneficiarios: 78,
    montoTotal: 11700000,
    montoIndividual: 150000,
    descripcion: "Apoyo económico anual para estudiantes de ascendencia indígena",
  },
  {
    id: 5,
    programa: "Subsidio Habitacional",
    beneficiarios: 45,
    montoTotal: 225000000,
    montoIndividual: 5000000,
    descripcion: "Aporte estatal para la adquisición o construcción de vivienda",
  },
  {
    id: 6,
    programa: "Programa de Alimentación Escolar",
    beneficiarios: 856,
    montoTotal: 42800000,
    montoIndividual: 50000,
    descripcion: "Alimentación diaria para estudiantes de escuelas municipales",
  },
  {
    id: 7,
    programa: "Subsidio de Discapacidad",
    beneficiarios: 93,
    montoTotal: 13950000,
    montoIndividual: 150000,
    descripcion: "Beneficio monetario para personas con discapacidad calificada",
  },
  {
    id: 8,
    programa: "Fondo Solidario de Salud",
    beneficiarios: 234,
    montoTotal: 23400000,
    montoIndividual: 100000,
    descripcion: "Apoyo para gastos médicos y tratamientos de salud",
  },
];

export default function Subsidies() {
  const location = useLocation();
  const { month, year } = location.state || { month: "Marzo", year: "2026" };
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSubsidies = subsidiesData.filter((subsidy) =>
    subsidy.programa.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
    }).format(amount);
  };

  const totalBeneficiaries = subsidiesData.reduce((sum, item) => sum + item.beneficiarios, 0);
  const totalAmount = subsidiesData.reduce((sum, item) => sum + item.montoTotal, 0);

  const handleDownload = () => {
    const csv = [
      ["Programa", "Beneficiarios", "Monto Total", "Monto Individual", "Descripción"],
      ...subsidiesData.map((s) => [
        s.programa,
        s.beneficiarios,
        s.montoTotal,
        s.montoIndividual,
        s.descripcion,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `subsidios-${month}-${year}.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <Link to="/categorias" state={{ month, year }} className="hover:text-gray-900 flex items-center gap-1">
              <ChevronLeft className="w-4 h-4" />
              Categorías
            </Link>
            <span>/</span>
            <span className="text-gray-900">Subsidios y Beneficios Sociales</span>
          </div>
          <p className="text-sm text-gray-600">
            Período: <span className="font-semibold text-gray-900">{month} {year}</span>
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Subsidios y Beneficios Sociales
          </h1>
          <p className="text-gray-600">
            Programas sociales y beneficios entregados a la comunidad
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg shadow-lg p-6">
            <p className="text-blue-100 mb-1">Total Beneficiarios</p>
            <p className="text-4xl font-bold">{totalBeneficiaries.toLocaleString()}</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg shadow-lg p-6">
            <p className="text-green-100 mb-1">Monto Total Distribuido</p>
            <p className="text-4xl font-bold">{formatCurrency(totalAmount)}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg shadow-lg p-6">
            <p className="text-purple-100 mb-1">Programas Activos</p>
            <p className="text-4xl font-bold">{subsidiesData.length}</p>
          </div>
        </div>

        {/* Info Section */}
        <div className="bg-blue-50 rounded-lg p-6 mb-6 border border-blue-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            ¿Cómo se protege la privacidad de los beneficiarios?
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Por cumplimiento de la Ley de Protección de Datos Personales (Ley N°19.628), la información de 
            beneficiarios se presenta de forma agregada y anónima. No se publican nombres, RUT ni direcciones 
            de las personas que reciben estos beneficios. Solo se muestra el número total de beneficiarios 
            y los montos distribuidos por programa social.
          </p>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow mb-6 p-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar programa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={handleDownload}
              className="bg-[#1e40af] text-white px-4 py-2 rounded-md hover:bg-[#1e3a8a] transition-colors flex items-center gap-2 justify-center"
            >
              <Download className="w-4 h-4" />
              Descargar reporte
            </button>
          </div>
        </div>

        {/* Programs Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {filteredSubsidies.map((subsidy) => (
            <div key={subsidy.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4">
                <h3 className="text-lg font-bold text-white">{subsidy.programa}</h3>
              </div>
              <div className="p-6">
                <p className="text-gray-600 text-sm mb-4">{subsidy.descripcion}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <User className="w-4 h-4 text-blue-600" />
                      <p className="text-xs text-gray-600">Beneficiarios</p>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{subsidy.beneficiarios}</p>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-3">
                    <p className="text-xs text-gray-600 mb-1">Monto Total</p>
                    <p className="text-lg font-bold text-gray-900">
                      {formatCurrency(subsidy.montoTotal)}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-600">Monto individual promedio</p>
                  <p className="text-lg font-semibold text-[#1e40af]">
                    {formatCurrency(subsidy.montoIndividual)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
