import { useEffect, useState } from "react";
import { TrendingUp, AlertCircle } from "lucide-react";
import { publicApi, type Indicadores, type Indicador } from "../../utils/api";

/**
 * Franja de indicadores económicos (EF5 — Integración con servicio externo).
 *
 * Consume el endpoint `/indicadores` del backend, que a su vez actúa como
 * proxy hacia la API pública de mindicador.cl. Hacerlo a través del backend
 * (y no directo desde el navegador) permite centralizar el manejo de errores,
 * el timeout y la posibilidad de cachear, además de evitar problemas de CORS.
 *
 * La integración es pertinente al dominio: un portal de transparencia
 * financiera muestra montos en pesos cuyo contexto se entiende mejor junto a
 * la UF, la UTM y los tipos de cambio del día.
 *
 * Degradación elegante: si el servicio externo no responde, el componente no
 * rompe la página; simplemente muestra un aviso discreto.
 */

const formatoCLP = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0,
});

interface Item {
  clave: keyof Omit<Indicadores, "fecha">;
  etiqueta: string;
  dato: Indicador | null;
}

function Tarjeta({ etiqueta, dato }: { etiqueta: string; dato: Indicador | null }) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3 text-center min-w-[120px]">
      <p className="text-xs uppercase tracking-wide text-blue-100">{etiqueta}</p>
      <p className="text-lg font-bold text-white">
        {dato ? formatoCLP.format(dato.valor) : "—"}
      </p>
    </div>
  );
}

export default function EconomicIndicators() {
  const [datos, setDatos] = useState<Indicadores | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelado = false;

    (async () => {
      try {
        const resp = await publicApi.getIndicadores();
        if (!cancelado) {
          setDatos(resp);
          setError(false);
        }
      } catch {
        if (!cancelado) setError(true);
      } finally {
        if (!cancelado) setCargando(false);
      }
    })();

    return () => {
      cancelado = true;
    };
  }, []);

  // Estado de carga: placeholder discreto, no bloquea el resto de la página.
  if (cargando) {
    return (
      <section className="bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-blue-100 text-center animate-pulse">
            Cargando indicadores económicos…
          </p>
        </div>
      </section>
    );
  }

  // Degradación elegante ante fallo del servicio externo.
  if (error || !datos) {
    return (
      <section className="bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-blue-100 text-center inline-flex items-center gap-2 w-full justify-center">
            <AlertCircle className="w-4 h-4" />
            Indicadores económicos no disponibles por el momento.
          </p>
        </div>
      </section>
    );
  }

  const items: Item[] = [
    { clave: "uf", etiqueta: "UF", dato: datos.uf },
    { clave: "utm", etiqueta: "UTM", dato: datos.utm },
    { clave: "dolar", etiqueta: "Dólar", dato: datos.dolar },
    { clave: "euro", etiqueta: "Euro", dato: datos.euro },
  ];

  const fecha = datos.fecha
    ? new Date(datos.fecha).toLocaleDateString("es-CL", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <section className="bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] py-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-2 text-white">
            <TrendingUp className="w-5 h-5" />
            <div>
              <p className="font-semibold leading-tight">Indicadores del día</p>
              {fecha && <p className="text-xs text-blue-100">Valores al {fecha}</p>}
            </div>
          </div>
          <div className="flex flex-wrap gap-3 justify-center md:justify-end">
            {items.map((it) => (
              <Tarjeta key={it.clave} etiqueta={it.etiqueta} dato={it.dato} />
            ))}
          </div>
        </div>
        <p className="text-[11px] text-blue-200 text-right mt-2">
          Fuente: mindicador.cl
        </p>
      </div>
    </section>
  );
}
