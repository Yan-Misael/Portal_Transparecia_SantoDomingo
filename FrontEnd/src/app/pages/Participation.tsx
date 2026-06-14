import { useState } from "react";
import { useLocation, Link } from "react-router";
import { ChevronLeft, Calendar, Users, MessageSquare, FileText, MapPin, Clock } from "lucide-react";

const participationData = [
  {
    id: 1,
    tipo: "Consejo Comunal de Organizaciones de la Sociedad Civil (COSOC)",
    descripcion: "Instancia de participación ciudadana que representa a las organizaciones sociales de la comuna en el municipio",
    proxReunion: "15/04/2026",
    horario: "18:00 hrs",
    lugar: "Salón Municipal - Edificio Consistorial",
    tematica: "Priorización de proyectos de inversión comunitaria 2026",
    estado: "Inscripción abierta",
  },
  {
    id: 2,
    tipo: "Consulta Ciudadana",
    descripcion: "Proceso de consulta sobre modificación del Plan Regulador Comunal",
    proxReunion: "20/04/2026",
    horario: "10:00 - 18:00 hrs",
    lugar: "Plaza de Armas de Santo Domingo",
    tematica: "Opinión sobre cambios de zonificación y altura de edificaciones",
    estado: "Votación en curso",
  },
  {
    id: 3,
    tipo: "Audiencia Pública",
    descripcion: "Presentación del Presupuesto Municipal 2027 y rendición de cuentas públicas",
    proxReunion: "28/04/2026",
    horario: "19:00 hrs",
    lugar: "Teatro Municipal de Santo Domingo",
    tematica: "Presupuesto Municipal 2027 y cuenta pública del alcalde",
    estado: "Próximamente",
  },
  {
    id: 4,
    tipo: "Cabildo Ciudadano",
    descripcion: "Encuentro abierto para discutir temas de interés comunal",
    proxReunion: "05/05/2026",
    horario: "18:30 hrs",
    lugar: "Centro Comunitario Sector Norte",
    tematica: "Seguridad ciudadana y mejoramiento del alumbrado público",
    estado: "Próximamente",
  },
  {
    id: 5,
    tipo: "Presupuesto Participativo",
    descripcion: "Los vecinos deciden en qué se invierte parte del presupuesto municipal",
    proxReunion: "12/05/2026",
    horario: "10:00 - 14:00 hrs",
    lugar: "Distintos puntos de votación en la comuna",
    tematica: "Votación de proyectos comunitarios para ejecución 2026-2027",
    estado: "Inscripción de proyectos",
  },
];

const pastEvents = [
  {
    fecha: "15/03/2026",
    tipo: "COSOC",
    tema: "Aprobación de Plan Anual de Trabajo",
    asistentes: 42,
    acuerdos: "Aprobado plan de trabajo 2026 con 8 iniciativas prioritarias",
  },
  {
    fecha: "28/02/2026",
    tipo: "Cabildo Ciudadano",
    tema: "Infraestructura vial y ciclovías",
    asistentes: 156,
    acuerdos: "Priorización de 3 calles para reparación y estudio de ciclovía en Av. Central",
  },
  {
    fecha: "10/02/2026",
    tipo: "Audiencia Pública",
    tema: "Modificación Ordenanza de Ruidos",
    asistentes: 89,
    acuerdos: "Incorporación de sugerencias ciudadanas al borrador de ordenanza",
  },
];

export default function Participation() {
  const location = useLocation();
  const { month, year } = location.state || { month: "Marzo", year: "2026" };
  const [selectedTab, setSelectedTab] = useState<"upcoming" | "past">("upcoming");

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
            <span className="text-gray-900">Mecanismos de Participación Ciudadana</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Mecanismos de Participación Ciudadana
          </h1>
          <p className="text-gray-600">
            Consultas ciudadanas, COSOC, audiencias públicas y otras instancias de participación
          </p>
        </div>

        {/* Info Box */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-2">¡Tu voz importa!</h2>
          <p className="mb-4 text-blue-50">
            La Ley 20.500 sobre Asociaciones y Participación Ciudadana en la Gestión Pública 
            garantiza tu derecho a participar en las decisiones municipales. Aquí encontrarás 
            todas las instancias disponibles para hacer oír tu opinión.
          </p>
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            <span className="font-semibold">Todas las instancias son gratuitas y abiertas a la comunidad</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex gap-8">
              <button
                onClick={() => setSelectedTab("upcoming")}
                className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === "upcoming"
                    ? "border-[#1e40af] text-[#1e40af]"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Próximas Actividades
              </button>
              <button
                onClick={() => setSelectedTab("past")}
                className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === "past"
                    ? "border-[#1e40af] text-[#1e40af]"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Actividades Realizadas
              </button>
            </nav>
          </div>
        </div>

        {/* Upcoming Events */}
        {selectedTab === "upcoming" && (
          <div className="space-y-6">
            {participationData.map((event) => (
              <div key={event.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 border-b border-blue-200">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mb-3 ${
                        event.estado === "Inscripción abierta"
                          ? "bg-green-100 text-green-800"
                          : event.estado === "Votación en curso"
                          ? "bg-blue-100 text-blue-800"
                          : event.estado === "Inscripción de proyectos"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {event.estado}
                      </span>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{event.tipo}</h3>
                      <p className="text-gray-700">{event.descripcion}</p>
                    </div>
                    <div className="flex-shrink-0">
                      <div className="bg-white rounded-lg p-4 text-center shadow">
                        <Calendar className="w-6 h-6 text-[#1e40af] mx-auto mb-2" />
                        <p className="text-sm font-semibold text-gray-900">
                          {event.proxReunion.split("/")[0]}
                        </p>
                        <p className="text-xs text-gray-600">
                          {["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"][
                            parseInt(event.proxReunion.split("/")[1]) - 1
                          ]}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid md:grid-cols-2 gap-6 mb-4">
                    <div className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Temática</p>
                        <p className="text-sm font-medium text-gray-900">{event.tematica}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Horario</p>
                        <p className="text-sm font-medium text-gray-900">{event.horario}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 mb-6">
                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Lugar</p>
                      <p className="text-sm font-medium text-gray-900">{event.lugar}</p>
                    </div>
                  </div>

                  <button className="w-full bg-[#1e40af] text-white px-6 py-3 rounded-md hover:bg-[#1e3a8a] transition-colors font-medium">
                    Inscribirme / Ver más información
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Past Events */}
        {selectedTab === "past" && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tema
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Asistentes
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Principales Acuerdos
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {pastEvents.map((event, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {event.fecha}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {event.tipo}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{event.tema}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-semibold text-gray-900">{event.asistentes}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{event.acuerdos}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Contact Section */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6 border border-blue-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            ¿Quieres proponer una instancia de participación?
          </h3>
          <p className="text-gray-700 mb-4">
            Si tienes una propuesta para una consulta ciudadana o quieres organizar un cabildo en tu sector, 
            contáctanos a través de los siguientes canales:
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-gray-700">participacion@santodomingo.cl</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-gray-700">Oficina de Participación Ciudadana - DIDECO</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
