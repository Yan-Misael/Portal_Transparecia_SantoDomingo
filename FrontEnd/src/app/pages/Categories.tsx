import { useLocation, Link } from "react-router";
import {
  Building2,
  Wallet,
  ShoppingCart,
  ArrowRightLeft,
  PieChart,
  Gift,
  FileText,
  ClipboardCheck,
  FileSearch,
  Users,
} from "lucide-react";

const categories = [
  {
    id: 1,
    title: "Estructura y Organización",
    description: "Organigrama y estructura del municipio",
    icon: Building2,
    path: "/estructura",
  },
  {
    id: 2,
    title: "Remuneraciones del Personal",
    description: "Sueldos y escalafón de funcionarios municipales",
    icon: Wallet,
    path: "/remuneraciones",
  },
  {
    id: 3,
    title: "Contrataciones y Compras",
    description: "Licitaciones, contratos y proveedores",
    icon: ShoppingCart,
    path: "/contrataciones",
  },
  {
    id: 4,
    title: "Transferencias de Fondos",
    description: "Transferencias a terceros y organizaciones",
    icon: ArrowRightLeft,
    path: "/transferencias",
  },
  {
    id: 5,
    title: "Ejecución Presupuestaria",
    description: "Presupuesto asignado y nivel de ejecución",
    icon: PieChart,
    path: "/presupuesto",
  },
  {
    id: 6,
    title: "Subsidios y Beneficios Sociales",
    description: "Programas sociales y beneficiarios",
    icon: Gift,
    path: "/subsidios",
  },
  {
    id: 7,
    title: "Actos y Resoluciones Municipales",
    description: "Decretos, resoluciones y permisos",
    icon: FileText,
    path: "/actos",
  },
  {
    id: 8,
    title: "Auditorías e Informes de Control",
    description: "Resultados de auditorías internas y externas",
    icon: ClipboardCheck,
    path: "/auditorias",
  },
  {
    id: 9,
    title: "Trámites y Servicios",
    description: "Procedimientos y requisitos municipales",
    icon: FileSearch,
    path: "/tramites",
  },
  {
    id: 10,
    title: "Mecanismos de Participación Ciudadana",
    description: "Consultas ciudadanas y audiencias públicas",
    icon: Users,
    path: "/participacion",
  },
];

export default function Categories() {
  const location = useLocation();
  const { month, year } = location.state || { month: "Marzo", year: "2026" };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-sm text-gray-600">
            Período activo: <span className="font-semibold text-gray-900">{month} {year}</span>
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Categorías de Transparencia
        </h1>
        <p className="text-gray-600 mb-8">
          Selecciona una categoría para ver la información detallada según la Ley 20.285
        </p>

        {/* Categories Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            const isActive = category.path !== "#";
            
            if (isActive) {
              return (
                <Link
                  key={category.id}
                  to={category.path}
                  state={{ month, year }}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 border border-gray-200 hover:border-[#1e40af] group"
                >
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-50 p-3 rounded-lg group-hover:bg-blue-100 transition-colors">
                      <Icon className="w-6 h-6 text-[#1e40af]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-[#1e40af] transition-colors">
                        {category.title}
                      </h3>
                      <p className="text-sm text-gray-600">{category.description}</p>
                    </div>
                  </div>
                </Link>
              );
            }

            return (
              <div
                key={category.id}
                className="bg-white rounded-lg shadow p-6 border border-gray-200 opacity-60 cursor-not-allowed"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <Icon className="w-6 h-6 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-700 mb-1">
                      {category.title}
                    </h3>
                    <p className="text-sm text-gray-500">{category.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}