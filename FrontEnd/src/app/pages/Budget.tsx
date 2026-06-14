import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router";
import {
  ChevronLeft,
  Download,
  ChevronDown,
  ChevronUp,
  Loader2,
  Wifi,
  WifiOff,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { publicApi } from "../../utils/api";

/**
 * Ejecución Presupuestaria.
 * Los datos se obtienen en vivo del backend (GET /api/presupuestos).
 * Si la API no responde, se usa un conjunto de demostración.
 */

type BudgetRow = {
  name: string;
  asignado: number;
  ejecutado: number;
};

const COLORS = ["#1e40af", "#3b82f6", "#60a5fa", "#93c5fd", "#dbeafe", "#bfdbfe"];

// Respaldo de demostración
const fallbackBudget: BudgetRow[] = [
  { name: "Obras Públicas", asignado: 171190000, ejecutado: 120000000 },
  { name: "Educación", asignado: 112625000, ejecutado: 98000000 },
  { name: "Salud", asignado: 81090000, ejecutado: 60000000 },
  { name: "Servicios Comunitarios", asignado: 54060000, ejecutado: 40000000 },
  { name: "Administración", asignado: 31535000, ejecutado: 25000000 },
];

export default function Budget() {
  const location = useLocation();
  const { month, year } = location.state || { month: "Marzo", year: "2026" };
  const [showDetails, setShowDetails] = useState(false);

  const [rows, setRows] = useState<BudgetRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [live, setLive] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await publicApi.getPresupuestos();
        if (cancelled) return;
        if (data && data.length > 0) {
          // Agrupar montos por departamento
          const grouped = new Map<string, BudgetRow>();
          for (const p of data) {
            const key = p.departamento?.nombre || `Departamento #${p.departamentoId}`;
            const prev = grouped.get(key) || {
              name: key,
              asignado: 0,
              ejecutado: 0,
            };
            prev.asignado += Number(p.montoAsignado);
            prev.ejecutado += Number(p.montoEjecutado);
            grouped.set(key, prev);
          }
          setRows(Array.from(grouped.values()));
          setLive(true);
        } else {
          setRows(fallbackBudget);
          setLive(false);
        }
      } catch {
        if (!cancelled) {
          setRows(fallbackBudget);
          setLive(false);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const totalBudget = rows.reduce((sum, item) => sum + item.asignado, 0);

  const chartData = rows.map((r) => ({
    name: r.name,
    value: totalBudget > 0 ? Math.round((r.asignado / totalBudget) * 100) : 0,
    amount: r.asignado,
  }));

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
    }).format(amount);

  const handleDownload = () => {
    const csv = [
      ["Departamento", "Monto Asignado", "Monto Ejecutado"],
      ...rows.map((item) => [item.name, item.asignado, item.ejecutado]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `presupuesto-${month}-${year}.csv`;
    a.click();
  };

  const topRow = [...rows].sort((a, b) => b.asignado - a.asignado)[0];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <Link
              to="/categorias"
              state={{ month, year }}
              className="hover:text-gray-900 flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              Categorías
            </Link>
            <span>/</span>
            <span className="text-gray-900">Ejecución Presupuestaria</span>
          </div>
          <p className="text-sm text-gray-600">
            Período:{" "}
            <span className="font-semibold text-gray-900">
              {month} {year}
            </span>
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Ejecución Presupuestaria
            </h1>
            <p className="text-gray-600">
              Distribución del presupuesto municipal por departamento
            </p>
          </div>
          {!loading && (
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
                live
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-amber-50 text-amber-700 border-amber-200"
              }`}
            >
              {live ? (
                <Wifi className="w-3.5 h-3.5" />
              ) : (
                <WifiOff className="w-3.5 h-3.5" />
              )}
              {live ? "Datos en vivo (API)" : "Datos de demostración"}
            </span>
          )}
        </div>

        {loading ? (
          <div className="bg-white rounded-lg shadow p-12 flex items-center justify-center gap-3 text-gray-500">
            <Loader2 className="w-5 h-5 animate-spin" />
            Cargando presupuestos desde la API...
          </div>
        ) : (
          <>
            {/* Chart Section */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Chart */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Distribución del Presupuesto
                  </h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {chartData.map((_, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Legend with amounts */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Montos por Departamento
                  </h2>
                  <div className="space-y-3">
                    {chartData.map((item, index) => (
                      <div
                        key={item.name}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{
                              backgroundColor: COLORS[index % COLORS.length],
                            }}
                          />
                          <span className="text-sm font-medium text-gray-700">
                            {item.name}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-gray-900">
                            {formatCurrency(item.amount)}
                          </p>
                          <p className="text-xs text-gray-500">{item.value}%</p>
                        </div>
                      </div>
                    ))}
                    <div className="border-t border-gray-200 pt-3 mt-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-900">
                          Total
                        </span>
                        <span className="text-sm font-bold text-gray-900">
                          {formatCurrency(totalBudget)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Citizen Explanation */}
            {topRow && (
              <div className="bg-blue-50 rounded-lg p-6 mb-6 border border-blue-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  ¿Qué significa esto para la comunidad?
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  El mayor monto presupuestario corresponde a{" "}
                  <strong>{topRow.name}</strong>, con{" "}
                  {formatCurrency(topRow.asignado)} asignados, de los cuales se
                  han ejecutado {formatCurrency(topRow.ejecutado)}. Estos
                  recursos permiten financiar las obras y servicios que el
                  municipio entrega a la comunidad de Santo Domingo.
                </p>
              </div>
            )}

            {/* Detailed Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <h2 className="text-lg font-semibold text-gray-900">
                  Detalle completo del presupuesto
                </h2>
                {showDetails ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </button>

              {showDetails && (
                <div className="p-6">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Departamento
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Asignado
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Ejecutado
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {rows.map((item) => (
                          <tr key={item.name} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {item.name}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900 text-right font-semibold">
                              {formatCurrency(item.asignado)}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600 text-right">
                              {formatCurrency(item.ejecutado)}
                            </td>
                          </tr>
                        ))}
                        <tr className="bg-gray-50 font-bold">
                          <td className="px-6 py-4 text-sm text-gray-900">
                            Total
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 text-right">
                            {formatCurrency(totalBudget)}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 text-right">
                            {formatCurrency(
                              rows.reduce((s, r) => s + r.ejecutado, 0)
                            )}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={handleDownload}
                      className="bg-[#1e40af] text-white px-4 py-2 rounded-md hover:bg-[#1e3a8a] transition-colors flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Descargar datos
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
