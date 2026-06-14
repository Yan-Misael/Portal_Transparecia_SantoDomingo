/**
 * Cliente HTTP centralizado para la API del Portal de Transparencia.
 *
 * Conecta el FrontEnd (React + Vite) con el BackEnd (Express + Prisma + JWT).
 * - La URL base se toma de la variable de entorno VITE_API_URL.
 * - Adjunta automáticamente el token JWT (Bearer) en las peticiones.
 * - Normaliza el formato de respuesta estandarizado del backend:
 *     éxito -> { success: true, message?, data? }
 *     error -> { success: false, error, details? }
 */

const TOKEN_KEY = "auth_token";

/** URL base de la API. Configurable mediante .env (VITE_API_URL). */
export const API_BASE_URL: string =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, "") ||
  "http://localhost:3000/api";

/** Error de API con el código de estado HTTP asociado. */
export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  /** Si es true, adjunta el token JWT en el header Authorization. */
  auth?: boolean;
};

/**
 * Ejecuta una petición a la API y devuelve únicamente el contenido útil.
 * Lanza ApiError si la respuesta no es satisfactoria.
 */
async function request<T = unknown>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = "GET", body, auth = false } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (auth) {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    // Falla de red / servidor caído
    throw new ApiError(
      "No se pudo conectar con el servidor. Verifique que la API esté en ejecución.",
      0
    );
  }

  // Algunas respuestas (p. ej. 204) podrían no traer cuerpo JSON.
  let payload: any = null;
  const text = await response.text();
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = { message: text };
    }
  }

  // El backend usa { success: false, error } para los errores.
  if (!response.ok || (payload && payload.success === false)) {
    const message =
      payload?.error ||
      payload?.message ||
      `Error ${response.status}: ${response.statusText}`;
    throw new ApiError(message, response.status, payload?.details);
  }

  // Respuesta estándar del backend -> { success, message, data }.
  // Si no viene envuelta, se devuelve el cuerpo completo.
  if (payload && Object.prototype.hasOwnProperty.call(payload, "data")) {
    return payload.data as T;
  }
  return payload as T;
}

/** Métodos HTTP de conveniencia. */
export const api = {
  get: <T = unknown>(path: string, auth = false) =>
    request<T>(path, { method: "GET", auth }),
  post: <T = unknown>(path: string, body?: unknown, auth = false) =>
    request<T>(path, { method: "POST", body, auth }),
  put: <T = unknown>(path: string, body?: unknown, auth = false) =>
    request<T>(path, { method: "PUT", body, auth }),
  delete: <T = unknown>(path: string, auth = false) =>
    request<T>(path, { method: "DELETE", auth }),
};

/* ----------------------------- Tipos del dominio ---------------------------- */

export interface Departamento {
  id: number;
  nombre: string;
  descripcion: string | null;
}

export interface Presupuesto {
  id: number;
  ano: number;
  montoAsignado: string | number;
  montoEjecutado: string | number;
  departamentoId: number;
  departamento?: Departamento;
  actualizadoEn?: string;
}

export interface Contrato {
  id: number;
  titulo: string;
  proveedor: string;
  monto: string | number;
  fechaInicio: string;
  fechaTermino: string | null;
  departamentoId: number;
  departamento?: Departamento;
}

/* ----------------------------- Tipos de paginación -------------------------- */

export interface PageMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Paginated<T> {
  items: T[];
  meta: PageMeta;
}

/* ------------------------- Tipos de indicadores (EF5) ----------------------- */

export interface Indicador {
  valor: number;
  unidad: string;
}

export interface Indicadores {
  fecha: string;
  uf: Indicador | null;
  utm: Indicador | null;
  dolar: Indicador | null;
  euro: Indicador | null;
}

/* ----------------------------- Endpoints públicos --------------------------- */

export const publicApi = {
  getDepartamentos: () => api.get<Departamento[]>("/departamentos"),
  getPresupuestos: () => api.get<Presupuesto[]>("/presupuestos"),

  /** Contratos paginados desde el servidor (EF4). Devuelve { items, meta }. */
  getContratosPaginated: (page = 1, limit = 10) =>
    api.get<Paginated<Contrato>>(`/contratos?page=${page}&limit=${limit}`),

  /**
   * Conveniencia: devuelve los contratos ya desempaquetados (hasta `limit`).
   * El backend siempre responde de forma paginada; aquí se extrae `items`.
   */
  getContratos: async (limit = 100): Promise<Contrato[]> => {
    const res = await api.get<Paginated<Contrato>>(
      `/contratos?page=1&limit=${limit}`
    );
    return res.items;
  },

  /** Indicadores económicos externos vía backend -> mindicador.cl (EF5). */
  getIndicadores: () => api.get<Indicadores>("/indicadores"),
};

/* --------------------- Endpoints administrativos (JWT) ---------------------- */

export const adminApi = {
  crearDepartamento: (body: { nombre: string; descripcion?: string }) =>
    api.post<Departamento>("/admin/departamentos", body, true),
  actualizarDepartamento: (
    id: number,
    body: { nombre: string; descripcion?: string }
  ) => api.put<Departamento>(`/admin/departamentos/${id}`, body, true),

  crearPresupuesto: (body: {
    ano: number;
    montoAsignado: number;
    departamentoId: number;
  }) => api.post<Presupuesto>("/admin/presupuestos", body, true),
  actualizarPresupuesto: (
    id: number,
    body: { ano: number; montoAsignado: number; montoEjecutado: number }
  ) => api.put<Presupuesto>(`/admin/presupuestos/${id}`, body, true),

  crearContrato: (body: {
    titulo: string;
    proveedor: string;
    monto: number;
    fechaInicio: string;
    departamentoId: number;
  }) => api.post<Contrato>("/admin/contratos", body, true),
  actualizarContrato: (
    id: number,
    body: {
      titulo: string;
      proveedor: string;
      monto: number;
      fechaInicio?: string;
      fechaTermino?: string;
      departamentoId: number;
    }
  ) => api.put<Contrato>(`/admin/contratos/${id}`, body, true),
  eliminarContrato: (id: number) =>
    api.delete<null>(`/admin/contratos/${id}`, true),
};
