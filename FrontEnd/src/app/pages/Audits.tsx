import { useLocation, Link } from "react-router";
import { ChevronLeft, Download, FileText, Calendar, AlertCircle, CheckCircle } from "lucide-react";
import { jsPDF } from "jspdf";

const auditsData = [
  {
    id: 1,
    titulo: "Auditoría de Gestión Financiera Año 2025",
    organismo: "Contraloría General de la República",
    fecha: "15/02/2026",
    tipo: "Externa",
    estado: "Aprobado con observaciones",
    resultado: "satisfactorio",
    pdfUrl: "#",
    resumen: "La auditoría evaluó la gestión financiera del municipio durante el año 2025. Se identificaron fortalezas en el control presupuestario y algunas observaciones menores en procesos de adquisiciones que fueron subsanadas.",
    hallazgos: [
      "Control presupuestario adecuado con 98% de cumplimiento",
      "Observación en documentación de 3 procesos de compra menor",
      "Recomendación de mejora en sistema de archivo digital",
    ],
  },
  {
    id: 2,
    titulo: "Auditoría Interna de Recursos Humanos",
    organismo: "Unidad de Auditoría Interna Municipal",
    fecha: "28/01/2026",
    tipo: "Interna",
    estado: "Aprobado",
    resultado: "satisfactorio",
    pdfUrl: "#",
    resumen: "Revisión de procesos de contratación, asistencia y remuneraciones del personal municipal. Se verificó el cumplimiento de normativas laborales y procedimientos internos.",
    hallazgos: [
      "Cumplimiento del 100% en contratos según normativa vigente",
      "Sistema de control de asistencia funcionando correctamente",
      "Liquidaciones de sueldo sin observaciones",
    ],
  },
  {
    id: 3,
    titulo: "Auditoría de Obras Públicas 2025",
    organismo: "Contraloría General de la República",
    fecha: "10/12/2025",
    tipo: "Externa",
    estado: "Aprobado con reparos",
    resultado: "conReparos",
    pdfUrl: "#",
    resumen: "Evaluación de proyectos de obras públicas ejecutados durante 2025. Se identificaron retrasos en 2 proyectos y se solicitaron mejoras en la supervisión técnica.",
    hallazgos: [
      "85% de proyectos ejecutados en plazo",
      "Reparo por retraso en obra de plaza comunitaria (justificado por condiciones climáticas)",
      "Recomendación de reforzar equipo de supervisión técnica",
    ],
  },
  {
    id: 4,
    titulo: "Informe de Control Inventario Municipal",
    organismo: "Unidad de Auditoría Interna Municipal",
    fecha: "20/11/2025",
    tipo: "Interna",
    estado: "Aprobado",
    resultado: "satisfactorio",
    pdfUrl: "#",
    resumen: "Verificación del inventario de bienes muebles e inmuebles municipales. Se actualizó el catastro y se verificó la existencia física de los activos.",
    hallazgos: [
      "Inventario actualizado y conciliado al 100%",
      "Registro de 1.247 bienes muebles verificados",
      "Sistema de codificación de activos implementado correctamente",
    ],
  },
  {
    id: 5,
    titulo: "Auditoría de Transferencias a Terceros",
    organismo: "Contraloría General de la República",
    fecha: "05/10/2025",
    tipo: "Externa",
    estado: "Aprobado",
    resultado: "satisfactorio",
    pdfUrl: "#",
    resumen: "Revisión de procedimientos y documentación de transferencias a organizaciones sociales y beneficiarios. Se verificó el cumplimiento de la Ley 19.862.",
    hallazgos: [
      "100% de transferencias con documentación respaldatoria completa",
      "Convenios suscritos según procedimiento legal",
      "Mecanismos de rendición de cuentas implementados correctamente",
    ],
  },
];

export default function Audits() {
  const location = useLocation();
  const { month, year } = location.state || { month: "Marzo", year: "2026" };

  const handleDownload = (audit: typeof auditsData[0]) => {
    const doc = new jsPDF();

    // Configuración de fuente y colores
    const primaryColor: [number, number, number] = [30, 64, 175]; // #1e40af
    const textColor: [number, number, number] = [0, 0, 0];
    const grayColor: [number, number, number] = [107, 114, 128];

    let yPosition = 20;

    // Encabezado
    doc.setFontSize(18);
    doc.setTextColor(...textColor);
    doc.setFont("helvetica", "bold");
    doc.text("MUNICIPALIDAD DE SANTO DOMINGO", 105, yPosition, { align: "center" });

    yPosition += 8;
    doc.setFontSize(12);
    doc.setTextColor(...primaryColor);
    doc.text("Portal de Transparencia", 105, yPosition, { align: "center" });

    yPosition += 15;

    // Línea separadora
    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(0.5);
    doc.line(20, yPosition, 190, yPosition);

    yPosition += 10;

    // Título de la auditoría
    doc.setFontSize(14);
    doc.setTextColor(...textColor);
    doc.setFont("helvetica", "bold");
    const titleLines = doc.splitTextToSize(audit.titulo, 170);
    doc.text(titleLines, 20, yPosition);
    yPosition += titleLines.length * 7 + 5;

    // Metadatos
    doc.setFontSize(10);
    doc.setTextColor(...grayColor);
    doc.setFont("helvetica", "normal");
    doc.text(`Organismo: ${audit.organismo}`, 20, yPosition);
    yPosition += 6;
    doc.text(`Fecha: ${audit.fecha}`, 20, yPosition);
    yPosition += 6;
    doc.text(`Tipo: ${audit.tipo}`, 20, yPosition);
    yPosition += 6;
    doc.text(`Estado: ${audit.estado}`, 20, yPosition);
    yPosition += 12;

    // Resumen Ejecutivo
    doc.setFontSize(12);
    doc.setTextColor(...primaryColor);
    doc.setFont("helvetica", "bold");
    doc.text("RESUMEN EJECUTIVO", 20, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setTextColor(...textColor);
    doc.setFont("helvetica", "normal");
    const resumenLines = doc.splitTextToSize(audit.resumen, 170);
    doc.text(resumenLines, 20, yPosition);
    yPosition += resumenLines.length * 5 + 10;

    // Principales Hallazgos
    doc.setFontSize(12);
    doc.setTextColor(...primaryColor);
    doc.setFont("helvetica", "bold");
    doc.text("PRINCIPALES HALLAZGOS", 20, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setTextColor(...textColor);
    doc.setFont("helvetica", "normal");

    audit.hallazgos.forEach((hallazgo, index) => {
      // Verificar si necesitamos una nueva página
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }

      // Bullet point
      doc.circle(22, yPosition - 1.5, 1, "F");

      // Texto del hallazgo
      const hallazgoLines = doc.splitTextToSize(hallazgo, 160);
      doc.text(hallazgoLines, 27, yPosition);
      yPosition += hallazgoLines.length * 5 + 3;
    });

    // Pie de página en todas las páginas
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(...grayColor);
      doc.setFont("helvetica", "italic");
      doc.text(
        `Documento generado desde el Portal de Transparencia - Municipalidad de Santo Domingo`,
        105,
        285,
        { align: "center" }
      );
      doc.text(`Página ${i} de ${pageCount}`, 105, 290, { align: "center" });
    }

    // Descargar el PDF
    const fileName = `auditoria-${audit.id}-${audit.fecha.replace(/\//g, '-')}.pdf`;
    doc.save(fileName);
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
            <span className="text-gray-900">Auditorías e Informes de Control</span>
          </div>
          <p className="text-sm text-gray-600">
            Período: <span className="font-semibold text-gray-900">{month} {year}</span>
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Auditorías e Informes de Control
          </h1>
          <p className="text-gray-600">
            Resultados de auditorías internas y externas realizadas por organismos fiscalizadores
          </p>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 rounded-lg p-6 mb-6 border border-blue-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            ¿Qué son las auditorías municipales?
          </h2>
          <p className="text-gray-700 text-sm leading-relaxed mb-3">
            Las auditorías son procesos de evaluación independiente que verifican el cumplimiento de normativas, 
            la correcta gestión de recursos públicos y la eficiencia de los procedimientos municipales. 
            Pueden ser realizadas por la Contraloría General de la República (externas) o por la Unidad de 
            Auditoría Interna del propio municipio.
          </p>
          <div className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-gray-700">
              Todos los informes son públicos y están disponibles para descarga según lo establece la 
              Ley 20.285 sobre Acceso a la Información Pública.
            </p>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600 mb-1">Total Auditorías</p>
            <p className="text-3xl font-bold text-gray-900">{auditsData.length}</p>
          </div>
          <div className="bg-green-50 rounded-lg shadow p-4">
            <p className="text-sm text-gray-600 mb-1">Aprobadas</p>
            <p className="text-3xl font-bold text-green-600">
              {auditsData.filter(a => a.resultado === "satisfactorio").length}
            </p>
          </div>
          <div className="bg-yellow-50 rounded-lg shadow p-4">
            <p className="text-sm text-gray-600 mb-1">Con Observaciones</p>
            <p className="text-3xl font-bold text-yellow-600">
              {auditsData.filter(a => a.resultado === "conReparos").length}
            </p>
          </div>
          <div className="bg-blue-50 rounded-lg shadow p-4">
            <p className="text-sm text-gray-600 mb-1">Auditorías Externas</p>
            <p className="text-3xl font-bold text-blue-600">
              {auditsData.filter(a => a.tipo === "Externa").length}
            </p>
          </div>
        </div>

        {/* Audits List */}
        <div className="space-y-6">
          {auditsData.map((audit) => (
            <div key={audit.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Header */}
              <div className={`p-6 ${
                audit.resultado === "satisfactorio" ? "bg-green-50" : "bg-yellow-50"
              }`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        audit.tipo === "Externa"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-purple-100 text-purple-800"
                      }`}>
                        {audit.tipo === "Externa" ? "Auditoría Externa" : "Auditoría Interna"}
                      </span>
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                        audit.resultado === "satisfactorio"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {audit.resultado === "satisfactorio" ? (
                          <CheckCircle className="w-3 h-3" />
                        ) : (
                          <AlertCircle className="w-3 h-3" />
                        )}
                        {audit.estado}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {audit.titulo}
                    </h3>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        <span>{audit.organismo}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{audit.fecha}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDownload(audit)}
                    className="flex-shrink-0 bg-[#1e40af] text-white px-4 py-2 rounded-md hover:bg-[#1e3a8a] transition-colors flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">Descargar PDF</span>
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h4 className="font-semibold text-gray-900 mb-2">Resumen Ejecutivo</h4>
                <p className="text-gray-700 mb-4">{audit.resumen}</p>

                <h4 className="font-semibold text-gray-900 mb-2">Principales Hallazgos</h4>
                <ul className="space-y-2">
                  {audit.hallazgos.map((hallazgo, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                        audit.resultado === "satisfactorio" ? "bg-green-500" : "bg-yellow-500"
                      }`} />
                      <span className="text-gray-700 text-sm">{hallazgo}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
