/**
 * Utilidades de Autenticación JWT
 * Portal de Transparencia Municipal - Santo Domingo
 *
 * Esta implementación se conecta con el BackEnd real (Express + Prisma):
 *  - POST /api/auth/login    -> valida credenciales y entrega un JWT firmado.
 *  - POST /api/auth/register -> registra un funcionario municipal.
 *
 * El token JWT es emitido y firmado por el servidor con jsonwebtoken.
 * El FrontEnd solo lo almacena y lo decodifica para conocer su expiración.
 */

import { api, ApiError } from "./api";

const TOKEN_KEY = "auth_token";
const USER_KEY = "user_info";
const EMAIL_KEY = "user_email";

export interface AuthUser {
  email: string;
  nombre: string;
  rol: string;
}

interface JwtPayload {
  id: number;
  email: string;
  rol: string;
  iat: number; // emitido en (segundos)
  exp: number; // expira en (segundos)
}

interface AuthResult {
  success: boolean;
  token?: string;
  user?: AuthUser;
  error?: string;
}

/* ----------------------------- Helpers internos ---------------------------- */

/** Decodifica el payload de un JWT (sin verificar la firma). */
function decodeJwt(token: string): JwtPayload | null {
  try {
    const part = token.split(".")[1];
    if (!part) return null;
    const base64 = part.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
}

/* ------------------------------- API pública ------------------------------- */

/**
 * Inicia sesión contra el backend real.
 * Devuelve el token JWT firmado por el servidor.
 */
export const login = async (
  email: string,
  password: string
): Promise<AuthResult> => {
  if (!email || !password) {
    return { success: false, error: "Email y contraseña son requeridos" };
  }
  if (password.length < 6) {
    return {
      success: false,
      error: "La contraseña debe tener al menos 6 caracteres",
    };
  }

  try {
    const data = await api.post<{ token: string; usuario: AuthUser }>(
      "/auth/login",
      { email, password }
    );

    // Persistir sesión
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.usuario));
    localStorage.setItem(EMAIL_KEY, data.usuario.email);

    return { success: true, token: data.token, user: data.usuario };
  } catch (err) {
    const message =
      err instanceof ApiError ? err.message : "Error al iniciar sesión";
    return { success: false, error: message };
  }
};

/**
 * Registra un nuevo funcionario municipal en el backend.
 */
export const register = async (
  nombre: string,
  email: string,
  password: string
): Promise<AuthResult> => {
  try {
    await api.post("/auth/register", { nombre, email, password });
    return { success: true };
  } catch (err) {
    const message =
      err instanceof ApiError ? err.message : "Error al registrar la cuenta";
    return { success: false, error: message };
  }
};

/** Cierra la sesión del usuario. */
export const logout = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(EMAIL_KEY);
};

/** Devuelve el token JWT almacenado (o null). */
export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Verifica si el usuario está autenticado: el token existe y no ha expirado.
 */
export const isAuthenticated = (): boolean => {
  const token = getToken();
  if (!token) return false;

  const payload = decodeJwt(token);
  if (!payload) {
    logout();
    return false;
  }

  // exp viene en segundos (estándar JWT)
  if (payload.exp * 1000 < Date.now()) {
    logout();
    return false;
  }
  return true;
};

/** Obtiene la información del usuario autenticado. */
export const getUserInfo = (): AuthUser | null => {
  const raw = localStorage.getItem(USER_KEY);
  if (raw) {
    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      /* continúa al fallback */
    }
  }
  // Fallback: reconstruir desde el token
  const token = getToken();
  if (!token) return null;
  const payload = decodeJwt(token);
  if (!payload) return null;
  return { email: payload.email, nombre: payload.email, rol: payload.rol };
};

/** Obtiene el email del usuario autenticado. */
export const getUserEmail = (): string | null => {
  return localStorage.getItem(EMAIL_KEY) || getUserInfo()?.email || null;
};

/** Indica si el rol del usuario autenticado es ADMIN. */
export const isAdmin = (): boolean => {
  return getUserInfo()?.rol === "ADMIN";
};

/** Verifica si el token está por expirar (menos de 5 minutos). */
export const isTokenExpiringSoon = (): boolean => {
  const token = getToken();
  if (!token) return false;
  const payload = decodeJwt(token);
  if (!payload) return false;
  const fiveMinutes = 5 * 60 * 1000;
  return payload.exp * 1000 - Date.now() < fiveMinutes;
};
