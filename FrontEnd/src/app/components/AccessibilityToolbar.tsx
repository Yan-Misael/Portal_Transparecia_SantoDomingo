import { useState, useEffect } from "react";
import { Volume2, Eye, Type, Minus, Plus } from "lucide-react";

export default function AccessibilityToolbar() {
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState(1); // 1 = normal, 2 = grande, 3 = muy grande
  const [isReading, setIsReading] = useState(false);

  useEffect(() => {
    // Cargar preferencias guardadas
    const savedContrast = localStorage.getItem("a11y-contrast") === "true";
    const savedFontSize = parseInt(localStorage.getItem("a11y-font-size") || "1");

    setHighContrast(savedContrast);
    setFontSize(savedFontSize);

    // Aplicar al cargar
    applyContrast(savedContrast);
    applyFontSize(savedFontSize);
  }, []);

  const applyContrast = (enabled: boolean) => {
    if (enabled) {
      document.documentElement.classList.add("a11y-contrast");
    } else {
      document.documentElement.classList.remove("a11y-contrast");
    }
  };

  const applyFontSize = (size: number) => {
    // Remover clases previas
    document.documentElement.classList.remove("a11y-font-1", "a11y-font-2", "a11y-font-3");
    // Aplicar nueva clase
    document.documentElement.classList.add(`a11y-font-${size}`);
  };

  const toggleContrast = () => {
    const newValue = !highContrast;
    setHighContrast(newValue);
    applyContrast(newValue);
    localStorage.setItem("a11y-contrast", String(newValue));

    // Anunciar cambio para lectores de pantalla
    announceChange(newValue ? "Alto contraste activado" : "Contraste normal activado");
  };

  const increaseFontSize = () => {
    if (fontSize < 3) {
      const newSize = fontSize + 1;
      setFontSize(newSize);
      applyFontSize(newSize);
      localStorage.setItem("a11y-font-size", String(newSize));

      const sizeNames = ["", "normal", "grande", "muy grande"];
      announceChange(`Tamaño de fuente ${sizeNames[newSize]}`);
    }
  };

  const decreaseFontSize = () => {
    if (fontSize > 1) {
      const newSize = fontSize - 1;
      setFontSize(newSize);
      applyFontSize(newSize);
      localStorage.setItem("a11y-font-size", String(newSize));

      const sizeNames = ["", "normal", "grande", "muy grande"];
      announceChange(`Tamaño de fuente ${sizeNames[newSize]}`);
    }
  };

  const announceChange = (message: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.lang = 'es-CL';
      utterance.rate = 1.0;
      window.speechSynthesis.cancel(); // Cancelar anuncios previos
      window.speechSynthesis.speak(utterance);
    }
  };

  const readPageTitle = () => {
    if ('speechSynthesis' in window) {
      setIsReading(true);

      const title = document.querySelector('h1')?.textContent ||
                   document.querySelector('h2')?.textContent ||
                   "Portal de Transparencia Municipal de Santo Domingo";

      const utterance = new SpeechSynthesisUtterance(title);
      utterance.lang = 'es-CL';
      utterance.rate = 0.9;

      utterance.onend = () => setIsReading(false);
      utterance.onerror = () => setIsReading(false);

      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Tu navegador no soporta lectura de pantalla");
    }
  };

  const stopReading = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsReading(false);
    }
  };

  const fontSizeLabels = ["", "Normal", "Grande", "Muy Grande"];

  return (
    <div className="bg-blue-50 border-b border-blue-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Título de la barra */}
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-blue-700" />
            <span className="text-sm font-medium text-blue-900 hidden sm:inline">
              Herramientas de Accesibilidad
            </span>
          </div>

          {/* Controles */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Toggle de Contraste */}
            <button
              onClick={toggleContrast}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                highContrast
                  ? "bg-blue-700 text-white"
                  : "bg-white text-blue-900 border border-blue-300 hover:bg-blue-100"
              }`}
              aria-label={highContrast ? "Desactivar alto contraste" : "Activar alto contraste"}
              aria-pressed={highContrast}
            >
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">
                {highContrast ? "Alto Contraste" : "Contraste Normal"}
              </span>
            </button>

            {/* Escalador de Fuente */}
            <div className="flex items-center gap-1 bg-white rounded-md border border-blue-300 p-1">
              <button
                onClick={decreaseFontSize}
                disabled={fontSize === 1}
                className="p-1.5 rounded hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Reducir tamaño de fuente"
              >
                <Minus className="w-4 h-4 text-blue-900" />
              </button>

              <div className="flex items-center gap-1 px-2 min-w-[80px] justify-center">
                <Type className="w-4 h-4 text-blue-900" />
                <span className="text-xs font-medium text-blue-900">
                  {fontSizeLabels[fontSize]}
                </span>
              </div>

              <button
                onClick={increaseFontSize}
                disabled={fontSize === 3}
                className="p-1.5 rounded hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Aumentar tamaño de fuente"
              >
                <Plus className="w-4 h-4 text-blue-900" />
              </button>
            </div>

            {/* Botón de Lectura de Pantalla */}
            <button
              onClick={isReading ? stopReading : readPageTitle}
              className={`rsbtn-gobcl-skin flex items-center gap-2 ${
                isReading ? "animate-pulse" : ""
              }`}
              aria-label={isReading ? "Detener lectura" : "Leer página"}
            >
              <Volume2 className="w-4 h-4" />
              <span className="hidden sm:inline">
                {isReading ? "Detener" : "Leer"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
