import { useState } from "react";
import { useLocation, Link } from "react-router";
import { ChevronLeft, Download, Search, ArrowUpDown } from "lucide-react";
import Pagination from "../components/Pagination";

const mockSalaries = [
  { id: 1, nombre: "Juan Pérez González", cargo: "Director de Obras", grado: "A-10", bruto: 3850000, liquido: 3120000 },
  { id: 2, nombre: "María Silva Rojas", cargo: "Jefa de RRHH", grado: "A-8", bruto: 3250000, liquido: 2650000 },
  { id: 3, nombre: "Carlos Muñoz Díaz", cargo: "Encargado Finanzas", grado: "A-7", bruto: 2980000, liquido: 2430000 },
  { id: 4, nombre: "Ana Torres Vargas", cargo: "Directora Social", grado: "A-9", bruto: 3420000, liquido: 2780000 },
  { id: 5, nombre: "Roberto Castro Soto", cargo: "Jefe de Tránsito", grado: "B-12", bruto: 2650000, liquido: 2180000 },
  { id: 6, nombre: "Patricia Núñez Pérez", cargo: "Secretaria Municipal", grado: "A-11", bruto: 4120000, liquido: 3340000 },
  { id: 7, nombre: "Fernando Vega López", cargo: "Inspector Municipal", grado: "C-8", bruto: 1850000, liquido: 1520000 },
  { id: 8, nombre: "Claudia Ramos Fuentes", cargo: "Asistente Social", grado: "B-9", bruto: 2280000, liquido: 1880000 },
  { id: 9, nombre: "Jorge Hernández Ruiz", cargo: "Encargado Aseo", grado: "C-11", bruto: 2180000, liquido: 1800000 },
  { id: 10, nombre: "Valeria Morales Sáez", cargo: "Abogada Municipal", grado: "A-6", bruto: 2850000, liquido: 2330000 },
  { id: 11, nombre: "Ricardo Espinoza Mora", cargo: "Encargado de Cultura", grado: "B-10", bruto: 2450000, liquido: 2010000 },
  { id: 12, nombre: "Sofía Pinto Herrera", cargo: "Secretaria de Alcaldía", grado: "A-9", bruto: 3320000, liquido: 2710000 },
  { id: 13, nombre: "Luis Valdés Castro", cargo: "Director de Educación", grado: "A-10", bruto: 3890000, liquido: 3160000 },
  { id: 14, nombre: "Carmen Robles Díaz", cargo: "Jefa de Comunicaciones", grado: "B-11", bruto: 2580000, liquido: 2120000 },
  { id: 15, nombre: "Andrés Molina Soto", cargo: "Encargado Deportes", grado: "C-9", bruto: 1950000, liquido: 1600000 },
  { id: 16, nombre: "Francisca Lagos Pérez", cargo: "Asesora Jurídica", grado: "A-7", bruto: 2920000, liquido: 2380000 },
  { id: 17, nombre: "Gabriel Cortés Núñez", cargo: "Técnico Informático", grado: "C-10", bruto: 2080000, liquido: 1710000 },
  { id: 18, nombre: "Daniela Fuentes Ríos", cargo: "Coordinadora Medio Ambiente", grado: "B-9", bruto: 2350000, liquido: 1930000 },
  { id: 19, nombre: "Mauricio Campos Bravo", cargo: "Inspector de Seguridad", grado: "C-11", bruto: 2150000, liquido: 1770000 },
  { id: 20, nombre: "Isabel Guzmán Tapia", cargo: "Psicóloga Comunitaria", grado: "B-8", bruto: 2180000, liquido: 1790000 },
  { id: 21, nombre: "Héctor Reyes Flores", cargo: "Jefe de Mantención", grado: "C-12", bruto: 2220000, liquido: 1820000 },
  { id: 22, nombre: "Cecilia Vargas Muñoz", cargo: "Encargada de Turismo", grado: "B-9", bruto: 2280000, liquido: 1870000 },
  { id: 23, nombre: "Rodrigo Parra Vega", cargo: "Arquitecto Municipal", grado: "A-8", bruto: 3180000, liquido: 2590000 },
  { id: 24, nombre: "Lorena Medina Silva", cargo: "Trabajadora Social", grado: "B-10", bruto: 2420000, liquido: 1990000 },
  { id: 25, nombre: "Pablo Navarro Ortiz", cargo: "Contador Municipal", grado: "A-7", bruto: 2950000, liquido: 2410000 },
];

export default function Salaries() {
  const location = useLocation();
  const { month, year } = location.state || { month: "Marzo", year: "2026" };
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const filteredSalaries = mockSalaries.filter(
    (salary) =>
      salary.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      salary.cargo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedSalaries = [...filteredSalaries].sort((a, b) => {
    if (!sortConfig) return 0;

    const aValue = a[sortConfig.key as keyof typeof a];
    const bValue = b[sortConfig.key as keyof typeof b];

    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  // Calcular paginación
  const totalPages = Math.ceil(sortedSalaries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedSalaries = sortedSalaries.slice(startIndex, endIndex);

  // Resetear a página 1 cuando cambia la búsqueda
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleSort = (key: string) => {
    setSortConfig((current) => {
      if (!current || current.key !== key) {
        return { key, direction: "asc" };
      }
      if (current.direction === "asc") {
        return { key, direction: "desc" };
      }
      return null;
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
    }).format(amount);
  };

  const handleDownloadCSV = () => {
    const csv = [
      ["Nombre", "Cargo", "Grado", "Sueldo Bruto", "Sueldo Líquido"],
      ...sortedSalaries.map((s) => [s.nombre, s.cargo, s.grado, s.bruto, s.liquido]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `remuneraciones-${month}-${year}.csv`;
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
            <span className="text-gray-900">Remuneraciones del Personal</span>
          </div>
          <p className="text-sm text-gray-600">
            Período: <span className="font-semibold text-gray-900">{month} {year}</span>
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Remuneraciones del Personal
          </h1>
          <p className="text-gray-600">
            Sueldos brutos y líquidos de todos los funcionarios municipales
          </p>
        </div>

        {/* Tools */}
        <div className="bg-white rounded-lg shadow mb-6 p-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nombre o cargo..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={handleDownloadCSV}
              className="bg-[#1e40af] text-white px-4 py-2 rounded-md hover:bg-[#1e3a8a] transition-colors flex items-center gap-2 justify-center"
            >
              <Download className="w-4 h-4" />
              Descargar CSV
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort("nombre")}
                      className="flex items-center gap-1 hover:text-gray-700"
                    >
                      Nombre
                      <ArrowUpDown className="w-4 h-4" />
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort("cargo")}
                      className="flex items-center gap-1 hover:text-gray-700"
                    >
                      Cargo
                      <ArrowUpDown className="w-4 h-4" />
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Grado
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort("bruto")}
                      className="flex items-center gap-1 hover:text-gray-700 ml-auto"
                    >
                      Sueldo Bruto
                      <ArrowUpDown className="w-4 h-4" />
                    </button>
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    <button
                      onClick={() => handleSort("liquido")}
                      className="flex items-center gap-1 hover:text-gray-700 ml-auto"
                    >
                      Sueldo Líquido
                      <ArrowUpDown className="w-4 h-4" />
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedSalaries.map((salary) => (
                  <tr key={salary.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {salary.nombre}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {salary.cargo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 hidden md:table-cell">
                      {salary.grado}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-semibold">
                      {formatCurrency(salary.bruto)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-semibold hidden lg:table-cell">
                      {formatCurrency(salary.liquido)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Paginación */}
        {sortedSalaries.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={sortedSalaries.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
}
