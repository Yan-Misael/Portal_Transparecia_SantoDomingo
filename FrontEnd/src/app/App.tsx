import { useEffect } from "react";
import { RouterProvider } from "react-router";
import { Toaster } from "sonner";
import { router } from "./routes";

export default function App() {
  useEffect(() => {
    // Configurar viewport meta tag para Mobile-First (RNF-02)
    let viewportMeta = document.querySelector('meta[name="viewport"]');

    if (!viewportMeta) {
      viewportMeta = document.createElement("meta");
      viewportMeta.setAttribute("name", "viewport");
      document.head.appendChild(viewportMeta);
    }

    viewportMeta.setAttribute(
      "content",
      "width=device-width, initial-scale=1.0, minimum-scale=1.0"
    );

    // Configurar meta charset si no existe
    let charsetMeta = document.querySelector('meta[charset]');
    if (!charsetMeta) {
      charsetMeta = document.createElement("meta");
      charsetMeta.setAttribute("charset", "UTF-8");
      document.head.insertBefore(charsetMeta, document.head.firstChild);
    }

    // Configurar título del documento
    document.title = "Portal de Transparencia - Municipalidad de Santo Domingo";

    // Configurar meta description
    let descriptionMeta = document.querySelector('meta[name="description"]');
    if (!descriptionMeta) {
      descriptionMeta = document.createElement("meta");
      descriptionMeta.setAttribute("name", "description");
      document.head.appendChild(descriptionMeta);
    }
    descriptionMeta.setAttribute(
      "content",
      "Portal de Transparencia Activa de la Municipalidad de Santo Domingo. Acceso a información pública según Ley 20.285: presupuestos, remuneraciones, contrataciones y más."
    );
  }, []);

  return (
    <>
      <RouterProvider router={router} />
      {/* Notificaciones globales (EF1). richColors da estilos semánticos
          de éxito/error; se monta una sola vez a nivel de aplicación. */}
      <Toaster richColors closeButton position="top-right" />
    </>
  );
}
