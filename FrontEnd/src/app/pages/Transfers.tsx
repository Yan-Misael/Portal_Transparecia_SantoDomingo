import { useLocation, Link } from "react-router";
import { ChevronLeft, Download } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const transfersData = [
  {
    id: 1,
    institucion: "Fundación Comunidad Activa",
    monto: 8500000,
    fecha: "15/03/2026",
    objetivo: "Programa deportivo juvenil",
  },
  {
    id: 2,
    institucion: "Corporación Cultural Santo Domingo",
    monto: 12000000,
    fecha: "10/03/2026",
    objetivo: "Festival de las Artes 2026",
  },
  {
    id: 3,
    institucion: "ONG Medio Ambiente Verde",
    monto: 6500000,
    fecha: "08/03/2026",
    objetivo: "Reforestación parques comunales",
  },
  {
    id: 4,
    institucion: "Centro de Adultos Mayores",
    monto: 4200000,
    fecha: "05/03/2026",
    objetivo: "Programa de salud preventiva",
  },
  {
    id: 5,
    institucion: "Agrupación Vecinal Norte",
    monto: 3800000,
    fecha: "02/03/2026",
    objetivo: "Mejoramiento de espacios comunitarios",
  },
];

const chartData = transfersData.map((t) => ({
  name: t.institucion.split(" ")[0] + "...",
  value: t.monto,
}));

const COLORS = ["#1e40af", "#3b82f6", "#60a5fa", "#93c5fd", "#dbeafe"];

export default function Transfers() {
  const location = useLocation();
  const { month, year } = location.state || { month: "Marzo", year: "2026" };

  const totalTransfers = transfersData.reduce((sum, item) => sum + item.monto, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
    }).format(amount);
  };

  const handleDownload = () => {
    const csv = [
      ["Institución", "Monto", "Fecha", "Objetivo"],
      ...transfersData.map((t) => [t.institucion, t.monto, t.fecha, t.objetivo]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transferencias-${month}-${year}.csv`;
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
            <span className="text-gray-900">Transferencias de Fondos</span>
          </div>
          <p className="text-sm text-gray-600">
            Período: <span className="font-semibold text-gray-900">{month} {year}</span>
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Transferencias de Fondos
          </h1>
          <p className="text-gray-600">
            Transferencias a organizaciones y beneficiarios externos
          </p>
        </div>

        {/* Chart and Summary */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Distribución por Beneficiario
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Summary */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Resumen</h2>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Total Transferido</p>
                <p className="text-3xl font-bold text-gray-900">
                  {formatCurrency(totalTransfers)}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Número de Transferencias</p>
                <p className="text-3xl font-bold text-gray-900">{transfersData.length}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Promedio por Transferencia</p>
                <p className="text-3xl font-bold text-gray-900">
                  {formatCurrency(totalTransfers / transfersData.length)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Citizen Explanation */}
        <div className="bg-blue-50 rounded-lg p-6 mb-6 border border-blue-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            ¿Qué son las transferencias de fondos?
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Las transferencias de fondos son recursos que el municipio entrega a organizaciones comunitarias, 
            fundaciones y agrupaciones ciudadanas para financiar proyectos específicos que benefician a la comunidad. 
            Durante {month} de {year}, se realizaron {transfersData.length} transferencias por un total de{" "}
            {formatCurrency(totalTransfers)}. La mayor parte se destinó a la Corporación Cultural Santo Domingo 
            para el Festival de las Artes, seguida por la Fundación Comunidad Activa para programas deportivos juveniles. 
            Estas inversiones fortalecen el tejido social y mejoran la calidad de vida de los vecinos.
          </p>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">
              Detalle de Transferencias
            </h2>
            <button
              onClick={handleDownload}
              className="bg-[#1e40af] text-white px-4 py-2 rounded-md hover:bg-[#1e3a8a] transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Descargar
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Institución Beneficiaria
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Monto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    Objetivo
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {transfersData.map((transfer) => (
                  <tr key={transfer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{transfer.institucion}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 text-right font-semibold">
                      {formatCurrency(transfer.monto)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 hidden md:table-cell">
                      {transfer.fecha}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 hidden lg:table-cell">
                      {transfer.objetivo}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50 border-t-2 border-gray-300">
                <tr>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">Total</td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900 text-right">
                    {formatCurrency(totalTransfers)}
                  </td>
                  <td className="hidden md:table-cell"></td>
                  <td className="hidden lg:table-cell"></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
