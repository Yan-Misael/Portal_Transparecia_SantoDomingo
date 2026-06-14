import { Building2, Shield } from "lucide-react";

export default function Footer() {
  return (
    <footer role="contentinfo" className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Building2 className="w-6 h-6 text-[#1e40af]" aria-hidden="true" />
              <span className="text-sm text-gray-600">Municipalidad Santo Domingo</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-[#1e40af]" aria-hidden="true" />
              <span className="text-sm text-gray-600">Consejo para la Transparencia</span>
            </div>
          </div>

          <nav aria-label="Enlaces del pie de página" className="flex gap-6 text-sm text-gray-600">
            <a href="#" className="hover:text-gray-900 transition-colors">
              Política de Privacidad
            </a>
            <a href="#" className="hover:text-gray-900 transition-colors">
              Términos de Uso
            </a>
            <a href="#" className="hover:text-gray-900 transition-colors">
              Contacto
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
