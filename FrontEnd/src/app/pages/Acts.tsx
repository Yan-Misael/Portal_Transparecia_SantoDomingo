import { useState } from "react";
import { useLocation, Link } from "react-router";
import { ChevronLeft, Download, Search, FileText, Calendar } from "lucide-react";

const actsData = [
  {
    id: 1,
    tipo: "Decreto Alcaldicio",
    numero: "DA-2026-0158",
    fecha: "28/03/2026",
    titulo: "Aprueba bases para licitación de construcción de plaza comunitaria",
    descripcion: "Autoriza la licitación pública para la construcción de una plaza en el sector norte de la comuna",
    materia: "Obras Públicas",
  },
  {
    id: 2,
    tipo: "Resolución Exenta",
    numero: "RE-2026-0342",
    fecha: "25/03/2026",
    titulo: "Otorga permiso de circulación a vehículo municipal",
    descripcion: "Autoriza el permiso de circulación para camión recolector de residuos modelo 2025",
    materia: "Tránsito",
  },
  {
    id: 3,
    tipo: "Decreto Alcaldicio",
    numero: "DA-2026-0157",
    fecha: "22/03/2026",
    titulo: "Modifica estructura organizacional del Departamento de Educación",
    descripcion: "Actualiza la dotación de personal y cargos del área educacional municipal",
    materia: "Recursos Humanos",
  },
  {
    id: 4,
    tipo: "Permiso de Edificación",
    numero: "PE-2026-0089",
    fecha: "20/03/2026",
    titulo: "Permiso de construcción vivienda unifamiliar Calle Los Aromos 245",
    descripcion: "Autoriza construcción de vivienda de 120m² en sector residencial",
    materia: "Obras Municipales",
  },
  {
    id: 5,
    tipo: "Concesión Municipal",
    numero: "CM-2026-0012",
    fecha: "18/03/2026",
    titulo: "Concesión de uso de inmueble municipal para centro comunitario",
    descripcion: "Otorga uso de espacio municipal a junta de vecinos por período de 5 años",
    materia: "Desarrollo Comunitario",
  },
  {
    id: 6,
    tipo: "Resolución Exenta",
    numero: "RE-2026-0338",
    fecha: "15/03/2026",
    titulo: "Aprueba subvención a club deportivo juvenil",
    descripcion: "Autoriza transferencia de fondos para actividades deportivas escolares",
    materia: "Deportes",
  },
  {
    id: 7,
    tipo: "Decreto Alcaldicio",
    numero: "DA-2026-0155",
    fecha: "12/03/2026",
    titulo: "Establece tarifas de derechos municipales para el año 2026",
    descripcion: "Fija valores de permisos, patentes y servicios municipales para el ejercicio 2026",
    materia: "Finanzas",
  },
  {
    id: 8,
    tipo: "Permiso de Edificación",
    numero: "PE-2026-0085",
    fecha: "10/03/2026",
    titulo: "Permiso de ampliación comercial Av. Principal 890",
    descripcion: "Autoriza ampliación de local comercial existente en 50m²",
    materia: "Obras Municipales",
  },
  {
    id: 9,
    tipo: "Resolución Exenta",
    numero: "RE-2026-0330",
    fecha: "08/03/2026",
    titulo: "Adjudica licitación de suministro de útiles escolares",
    descripcion: "Adjudica proceso de compra de material educativo para escuelas municipales",
    materia: "Educación",
  },
  {
    id: 10,
    tipo: "Decreto Alcaldicio",
    numero: "DA-2026-0152",
    fecha: "05/03/2026",
    titulo: "Autoriza firma de convenio con Corporación Cultural",
    descripcion: "Aprueba acuerdo de colaboración para realización de Festival de las Artes 2026",
    materia: "Cultura",
  },
];

export default function Acts() {
  const location = useLocation();
  const { month, year } = location.state || { month: "Marzo", year: "2026" };
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMateria, setFilterMateria] = useState("Todas");

  const materias = ["Todas", ...Array.from(new Set(actsData.map((act) => act.materia)))];

  const filteredActs = actsData.filter((act) => {
    const matchesSearch =
      act.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      act.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      act.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterMateria === "Todas" || act.materia === filterMateria;
    
    return matchesSearch && matchesFilter;
  });

  const handleDownloadAll = () => {
    const csv = [
      ["Tipo", "Número", "Fecha", "Título", "Materia"],
      ...actsData.map((act) => [act.tipo, act.numero, act.fecha, act.titulo, act.materia]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `actos-resoluciones-${month}-${year}.csv`;
    a.click();
  };

  const handleDownloadIndividual = (act: typeof actsData[0]) => {
    alert(`Descargando documento: ${act.numero}\n\nEn un sistema real, este enlace descargaría el PDF oficial del acto administrativo.`);
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
            <span className="text-gray-900">Actos y Resoluciones Municipales</span>
          </div>
          <p className="text-sm text-gray-600">
            Período: <span className="font-semibold text-gray-900">{month} {year}</span>
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Actos y Resoluciones Municipales
          </h1>
          <p className="text-gray-600">
            Decretos, resoluciones, permisos y concesiones que afectan a terceros
          </p>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 rounded-lg p-6 mb-6 border border-blue-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            ¿Qué son los actos administrativos?
          </h2>
          <p className="text-gray-700 text-sm leading-relaxed">
            Los actos administrativos son decisiones formales tomadas por la autoridad municipal que 
            producen efectos jurídicos sobre terceros. Incluyen decretos alcaldicios, resoluciones exentas, 
            permisos de edificación y concesiones. Según la Ley 19.880, estos actos deben ser públicos 
            y estar disponibles para consulta ciudadana.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow mb-6 p-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por título, número o descripción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterMateria}
              onChange={(e) => setFilterMateria(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {materias.map((materia) => (
                <option key={materia} value={materia}>
                  {materia === "Todas" ? "Todas las materias" : materia}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Download All Button */}
        <div className="mb-6 flex justify-end">
          <button
            onClick={handleDownloadAll}
            className="bg-[#1e40af] text-white px-4 py-2 rounded-md hover:bg-[#1e3a8a] transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Descargar listado completo
          </button>
        </div>

        {/* Acts List */}
        <div className="space-y-4">
          {filteredActs.map((act) => (
            <div key={act.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {act.tipo}
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {act.materia}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {act.titulo}
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-3">{act.descripcion}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      <span>{act.numero}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{act.fecha}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleDownloadIndividual(act)}
                  className="flex-shrink-0 bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Descargar</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredActs.length === 0 && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No se encontraron actos administrativos con los filtros seleccionados</p>
          </div>
        )}

        <p className="text-sm text-gray-500 mt-6 text-center">
          Mostrando {filteredActs.length} de {actsData.length} actos administrativos
        </p>
      </div>
    </div>
  );
}
