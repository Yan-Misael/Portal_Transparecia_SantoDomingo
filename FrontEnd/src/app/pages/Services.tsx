import { useLocation, Link } from "react-router";
import { ChevronLeft, FileText, Clock, MapPin, Phone, Mail, ExternalLink } from "lucide-react";

const servicesData = [
  {
    id: 1,
    titulo: "Certificado de Antecedentes",
    descripcion: "Documento que acredita la no existencia de antecedentes penales",
    categoria: "Certificados",
    plazo: "Inmediato",
    costo: "Gratuito",
    requisitos: [
      "Cédula de identidad vigente",
      "Completar formulario en línea o presencial",
    ],
    donde: "Oficina de Atención Ciudadana - Primer Piso",
    horario: "Lunes a viernes 8:30 - 14:00 hrs",
  },
  {
    id: 2,
    titulo: "Permiso de Circulación",
    descripcion: "Permiso anual obligatorio para circular con vehículos motorizados",
    categoria: "Tránsito",
    plazo: "Inmediato",
    costo: "Variable según tasación del vehículo",
    requisitos: [
      "Cédula de identidad del propietario",
      "Padrón o certificado de inscripción del vehículo",
      "Revisión técnica al día",
      "Seguro obligatorio vigente (SOAP)",
      "Pago de multas de tránsito (si corresponde)",
    ],
    donde: "Dirección de Tránsito - Segundo Piso",
    horario: "Lunes a viernes 8:30 - 17:00 hrs",
  },
  {
    id: 3,
    titulo: "Permiso de Edificación",
    descripcion: "Autorización para construir, ampliar o remodelar una propiedad",
    categoria: "Obras",
    plazo: "30 a 60 días hábiles",
    costo: "Variable según proyecto",
    requisitos: [
      "Formulario de solicitud de permiso",
      "Planos arquitectónicos firmados por profesional competente",
      "Certificado de informaciones previas vigente",
      "Pago de derechos municipales",
      "Certificado de dominio vigente",
    ],
    donde: "Dirección de Obras Municipales - Tercer Piso",
    horario: "Lunes a viernes 9:00 - 13:00 hrs",
  },
  {
    id: 4,
    titulo: "Patente Comercial",
    descripcion: "Permiso municipal para ejercer actividades comerciales",
    categoria: "Patentes",
    plazo: "15 a 30 días hábiles",
    costo: "Variable según superficie y actividad",
    requisitos: [
      "Inicio de actividades ante el SII",
      "Certificado de dominio o contrato de arriendo",
      "Plano de ubicación del local",
      "Autorización sanitaria (si corresponde)",
      "Patente de alcohol (si corresponde)",
      "Informe sanitario favorable",
    ],
    donde: "Departamento de Patentes - Primer Piso",
    horario: "Lunes a viernes 8:30 - 14:00 hrs",
  },
  {
    id: 5,
    titulo: "Subsidio Familiar (SUF)",
    descripcion: "Beneficio económico para familias vulnerables con menores de edad",
    categoria: "Beneficios Sociales",
    plazo: "60 días hábiles",
    costo: "Gratuito",
    requisitos: [
      "Cédula de identidad del solicitante y del menor",
      "Certificado de nacimiento del menor",
      "Ficha de Protección Social vigente",
      "Certificado de residencia",
      "Certificado de estudios (mayores de 6 años)",
    ],
    donde: "DIDECO - Departamento Social",
    horario: "Lunes a viernes 8:30 - 17:00 hrs",
  },
  {
    id: 6,
    titulo: "Certificado de Número",
    descripcion: "Documento que asigna numeración oficial a una propiedad",
    categoria: "Certificados",
    plazo: "5 a 10 días hábiles",
    costo: "$5.000 aprox.",
    requisitos: [
      "Solicitud escrita del propietario",
      "Certificado de dominio vigente",
      "Plano de ubicación de la propiedad",
      "Pago de derechos municipales",
    ],
    donde: "Dirección de Obras Municipales - Tercer Piso",
    horario: "Lunes a viernes 9:00 - 13:00 hrs",
  },
  {
    id: 7,
    titulo: "Licencia de Conducir (renovación)",
    descripcion: "Renovación de licencia de conducir clase B (vehículos particulares)",
    categoria: "Tránsito",
    plazo: "Inmediato (mismo día)",
    costo: "$15.000 aprox.",
    requisitos: [
      "Cédula de identidad vigente",
      "Licencia anterior (si corresponde)",
      "Examen médico (oftalmológico y psicológico)",
      "Fotografía tamaño carnet",
      "Pago de derechos",
    ],
    donde: "Dirección de Tránsito - Segundo Piso",
    horario: "Lunes a viernes 8:30 - 13:00 hrs",
  },
  {
    id: 8,
    titulo: "Solicitud de Poda de Árboles",
    descripcion: "Solicitud de poda o tala de árboles en espacios públicos",
    categoria: "Aseo y Ornato",
    plazo: "15 a 30 días hábiles",
    costo: "Gratuito",
    requisitos: [
      "Solicitud escrita indicando dirección exacta",
      "Fotografías del árbol",
      "Justificación técnica (si es tala)",
      "Informe de riesgo (si corresponde)",
    ],
    donde: "Departamento de Aseo y Ornato - Primer Piso",
    horario: "Lunes a viernes 8:30 - 14:00 hrs",
  },
];

const categories = Array.from(new Set(servicesData.map(s => s.categoria)));

export default function Services() {
  const location = useLocation();
  const { month, year } = location.state || { month: "Marzo", year: "2026" };

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
            <span className="text-gray-900">Trámites y Servicios</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Trámites y Servicios Municipales
          </h1>
          <p className="text-gray-600">
            Requisitos y procedimientos para realizar trámites en el municipio
          </p>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 rounded-lg p-6 mb-6 border border-blue-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Información importante
          </h2>
          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex items-start gap-2">
              <Phone className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <strong>Teléfono:</strong> +56 2 2345 6789
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Mail className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <strong>Email:</strong> atencion@santodomingo.cl
              </div>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <strong>Dirección:</strong> Av. Bernardo O'Higgins 450, Santo Domingo
              </div>
            </div>
          </div>
        </div>

        {/* Categories Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category) => (
            <button
              key={category}
              className="px-4 py-2 bg-white border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {category}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {servicesData.map((service) => (
            <div key={service.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4">
                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-white/20 text-white mb-2">
                  {service.categoria}
                </span>
                <h3 className="text-xl font-bold text-white">{service.titulo}</h3>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-gray-600 text-sm mb-4">{service.descripcion}</p>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-gray-200">
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <p className="text-xs text-gray-500">Plazo</p>
                    </div>
                    <p className="text-sm font-semibold text-gray-900">{service.plazo}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Costo</p>
                    <p className="text-sm font-semibold text-gray-900">{service.costo}</p>
                  </div>
                </div>

                {/* Requisitos */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Requisitos:</h4>
                  <ul className="space-y-1">
                    {service.requisitos.map((req, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Location */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-start gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500">Dónde tramitar</p>
                      <p className="text-sm font-medium text-gray-900">{service.donde}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500">Horario de atención</p>
                      <p className="text-sm font-medium text-gray-900">{service.horario}</p>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <button className="w-full mt-4 bg-[#1e40af] text-white px-4 py-2 rounded-md hover:bg-[#1e3a8a] transition-colors flex items-center justify-center gap-2">
                  <ExternalLink className="w-4 h-4" />
                  Iniciar trámite en línea
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
