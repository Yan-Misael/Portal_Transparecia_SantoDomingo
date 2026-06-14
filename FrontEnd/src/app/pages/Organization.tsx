import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router";
import { ChevronLeft, Download, Loader2, Wifi, WifiOff } from "lucide-react";
import { publicApi } from "../../utils/api";

/**
 * Estructura organizacional. Los departamentos se obtienen en vivo desde
 * el backend (GET /api/departamentos). Si la API no está disponible se
 * utiliza un conjunto de datos de demostración como respaldo.
 */

type Department = {
  name: string;
  description: string;
  head?: string;
  subdepartments?: string[];
};

const alcalde = {
  name: "Carlos Andrés Valenzuela Rojas",
  position: "Alcalde",
  description:
    "Máxima autoridad comunal, responsable de la dirección superior del municipio",
};

// Respaldo de demostración (se usa solo si la API no responde o no hay datos)
const fallbackDepartments: Department[] = [
  {
    name: "Secretaría Municipal",
    head: "Patricia Núñez Pérez",
    description:
      "Responsable de la gestión administrativa y coordinación de las actividades municipales",
    subdepartments: ["Oficina de Partes", "Archivo Municipal", "Protocolo"],
  },
  {
    name: "Dirección de Obras Municipales (DOM)",
    head: "Juan Pérez González",
    description:
      "Supervisión y aprobación de proyectos de construcción en la comuna",
    subdepartments: ["Inspección Técnica", "Permisos de Edificación", "Urbanismo"],
  },
  {
    name: "Dirección de Tránsito y Transporte Público",
    head: "Roberto Castro Soto",
    description:
      "Gestión de permisos de circulación y fiscalización del tránsito",
    subdepartments: ["Licencias de Conducir", "Permisos de Circulación", "Fiscalización"],
  },
  {
    name: "Dirección de Desarrollo Comunitario (DIDECO)",
    head: "Ana Torres Vargas",
    description: "Programas sociales, educación, salud y deportes comunitarios",
    subdepartments: ["Programas Sociales", "Deportes y Recreación", "Cultura"],
  },
  {
    name: "Dirección de Administración y Finanzas",
    head: "Carlos Muñoz Díaz",
    description: "Gestión financiera, contable y de recursos humanos",
    subdepartments: ["Contabilidad", "Presupuesto", "Recursos Humanos"],
  },
  {
    name: "Dirección de Aseo y Ornato",
    head: "Jorge Hernández Ruiz",
    description:
      "Mantención de espacios públicos, recolección de residuos y áreas verdes",
    subdepartments: ["Recolección de Basura", "Mantención de Plazas", "Áreas Verdes"],
  },
];

export default function Organization() {
  const location = useLocation();
  const { month, year } = location.state || { month: "Marzo", year: "2026" };

  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [live, setLive] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await publicApi.getDepartamentos();
        if (cancelled) return;
        if (data && data.length > 0) {
          setDepartments(
            data.map((d) => ({
              name: d.nombre,
              description: d.descripcion || "Departamento municipal",
            }))
          );
          setLive(true);
        } else {
          setDepartments(fallbackDepartments);
          setLive(false);
        }
      } catch {
        if (!cancelled) {
          setDepartments(fallbackDepartments);
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
            <span className="text-gray-900">Estructura y Organización</span>
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
              Estructura y Organización Municipal
            </h1>
            <p className="text-gray-600">
              Organigrama y descripción de las unidades del municipio
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

        {/* Alcalde Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="text-center pb-6 border-b border-gray-200">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-4">
              <span className="text-3xl font-bold text-[#1e40af]">A</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              {alcalde.name}
            </h2>
            <p className="text-lg text-[#1e40af] font-semibold mb-2">
              {alcalde.position}
            </p>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {alcalde.description}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-lg shadow p-12 flex items-center justify-center gap-3 text-gray-500">
            <Loader2 className="w-5 h-5 animate-spin" />
            Cargando departamentos desde la API...
          </div>
        ) : (
          <>
            {/* Departments Grid */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Direcciones y Departamentos
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {departments.map((dept, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
                  >
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {dept.name}
                    </h3>
                    {dept.head && (
                      <p className="text-sm text-[#1e40af] font-semibold mb-3">
                        Director(a): {dept.head}
                      </p>
                    )}
                    <p className="text-gray-600 text-sm mb-4">
                      {dept.description}
                    </p>

                    {dept.subdepartments && dept.subdepartments.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-gray-700 mb-2">
                          Subdepartamentos:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {dept.subdepartments.map((sub, subIndex) => (
                            <span
                              key={subIndex}
                              className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded"
                            >
                              {sub}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Organigrama */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Organigrama Municipal
              </h2>

              <div className="overflow-x-auto">
                <div className="min-w-[800px]">
                  {/* Alcalde */}
                  <div className="flex justify-center mb-8">
                    <div className="bg-[#1e40af] text-white px-6 py-4 rounded-lg text-center shadow-lg">
                      <p className="font-bold">Alcalde</p>
                      <p className="text-sm">{alcalde.name}</p>
                    </div>
                  </div>

                  {/* Departamentos */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {departments.map((dept, index) => (
                      <div key={index} className="text-center">
                        <div className="bg-blue-100 text-gray-900 px-3 py-3 rounded-lg shadow h-full">
                          <p className="text-xs font-bold mb-1">{dept.name}</p>
                          {dept.head && (
                            <p className="text-xs text-gray-600">
                              {dept.head.split(" ").slice(0, 2).join(" ")}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() =>
                    alert("Descargando organigrama en formato PDF...")
                  }
                  className="bg-[#1e40af] text-white px-4 py-2 rounded-md hover:bg-[#1e3a8a] transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Descargar organigrama completo (PDF)
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
