# Checklist crítico de la rúbrica — Entrega Final (ICI 4247)

Estado de cada criterio con evidencia concreta en el código. La valoración es honesta: se distingue lo plenamente cubierto de lo que tiene matices.

Leyenda: ✅ cubierto · ⚠️ cubierto con observación · ❌ no cubierto

---

## EF1 — Funcionalidades completas e integración (20 pts)

- ✅ **CRUD completo.** Panel `/admin` con creación, edición y borrado real de departamentos, presupuestos y contratos, persistido en PostgreSQL vía Prisma. Controladores en `BackEnd/src/controllers/adminController.js`.
- ✅ **Autenticación.** Registro e inicio de sesión con JWT (`authController.js`, `utils/auth.ts`).
- ⚠️ **Diferenciación por roles.** Implementada (rol `ADMIN`, middleware `adminMiddleware.js`, guardia `ProtectedRoute` en el frontend). Observación: el registro asigna `ADMIN` por defecto; en producción debería restringirse.
- ✅ **Notificaciones.** Toasts de `sonner` montados globalmente en `App.tsx` y usados en login, descargas y errores de carga.
- ✅ **Almacenamiento local.** El token JWT se guarda y consume desde `localStorage`.
- ✅ **Integración front-back.** El frontend consume la API por `fetch` con manejo de errores y envío del token en cabecera `Authorization`.

---

## EF2 — UI/UX y optimización del rendimiento (15 pts)

- ✅ **Responsividad móvil/web.** Layout con Tailwind y breakpoints; meta viewport configurado en `App.tsx`.
- ✅ **Navegación coherente.** React Router 7 con layout compartido y rutas por sección.
- ✅ **Validaciones visuales.** Formularios de login/registro con estados de error e indicadores de carga.
- ✅ **Rendimiento de servido.** Nginx con compresión gzip y caché de estáticos (`FrontEnd/nginx.conf`); paginación para no traer toda la tabla de una vez.
- ⚠️ **Componentes Ionic.** La rúbrica los menciona en el nivel "Excelente". El proyecto usa React + Vite + Tailwind/shadcn desde las entregas parciales, no Ionic. Decisión documentada en el `README.md` y para la defensa. El resto del criterio se cumple.

---

## EF3 — Seguridad avanzada en la API (15 pts)

- ✅ **Hash de contraseñas.** bcrypt en el registro y verificación en login.
- ✅ **JWT.** Firmado con secreto de entorno y validado en middleware (`authMiddleware.js`); vigencia 8 h.
- ✅ **CORS seguro.** Lista blanca por `CORS_ORIGINS` en `app.js`; rechazo traducido a `403`.
- ✅ **Cabeceras de seguridad.** Helmet activo (anti-clickjacking, `nosniff`, etc.).
- ✅ **Rate limiting.** `express-rate-limit` en `/api/auth` (mitiga fuerza bruta).
- ✅ **Validación de inputs.** Esquemas Zod en `schemas/` aplicados por middleware.
- ✅ **Inyección SQL.** Mitigada por Prisma (consultas parametrizadas; no hay SQL string-concatenado).
- ⚠️ **XSS.** Mitigado parcialmente: React escapa el contenido por defecto y Helmet aporta cabeceras; no se añadió una sanitización explícita adicional del lado servidor por no almacenarse HTML de usuario.

---

## EF4 — Optimización de consultas y eficiencia (10 pts)

- ✅ **Índices.** `@@index` en columnas de filtro/orden de `Presupuesto` (`departamentoId`, `ano`) y `Contrato` (`departamentoId`, `fechaInicio`), con migración dedicada.
- ✅ **Paginación.** `skip`/`take` + `count` en `obtenerContratos`, devolviendo `meta` (total, página, límite, totalPages).
- ✅ **Ordenamiento.** `orderBy` en las consultas públicas.
- ✅ **Respuestas acotadas.** Se seleccionan los campos necesarios; no se exponen credenciales ni datos internos.

---

## EF5 — Integración con servicio externo (10 pts)

- ✅ **Servicio pertinente.** mindicador.cl (UF, UTM, dólar, euro): contexto natural para un portal financiero.
- ✅ **Justificado y documentado.** Explicado en `README.md` y en este documento.
- ✅ **Manejo de errores y timeout.** `obtenerIndicadores` usa `AbortController` (timeout) y devuelve `502` ante fallo del servicio externo; el frontend degrada de forma elegante.
- ✅ **Variables de entorno.** URL del servicio en `MINDICADOR_API_URL`.
- ✅ **Aporta valor real.** Se muestra en la portada (`EconomicIndicators`), integrado al flujo principal.
- ✅ **Desacople correcto.** El navegador no llama al servicio externo directamente; lo hace vía backend (evita CORS y centraliza el control).

---

## EF6 — Despliegue con Docker (15 pts)

- ✅ **Dockerfile de backend.** `BackEnd/dockerfile` (Node 20, genera cliente Prisma).
- ✅ **Dockerfile de frontend.** `FrontEnd/Dockerfile` multi-etapa (build con Vite → servido por Nginx), con `VITE_API_URL` como argumento de build.
- ✅ **docker-compose.** `docker-compose.yml` raíz orquesta `db` + `api` + `web`.
- ✅ **Variables de entorno.** `.env.example` raíz centralizado.
- ✅ **Orden de arranque.** `depends_on: condition: service_healthy` para esperar a PostgreSQL; la API migra y siembra antes de servir.
- ✅ **Instrucciones claras.** Sección 2 del `README.md`.
- ⚠️ **Evidencia de despliegue exitoso.** Pendiente de ejecutar en un entorno con Docker (no disponible donde se preparó la integración). Los pasos están verificados a nivel de configuración y sintaxis; la corrida real queda a cargo de quien despliegue.

---

## Presentación y defensa (15 pts)

Material de apoyo disponible: este checklist, el documento de desafíos de implementación y el README. Puntos sugeridos a preparar para la defensa: justificación del stack (incluida la decisión sobre Ionic), recorrido por la seguridad de la API, demostración del CRUD y del servicio externo, y despliegue en vivo con `docker compose up`.

---

## Acciones recomendadas antes de entregar

1. Ejecutar `docker compose up -d --build` en una máquina con Docker y confirmar las tres URLs de la sección 2 del README.
2. Probar el login con las credenciales sembradas y un ciclo CRUD completo en `/admin`.
3. Verificar `http://localhost:3000/api/indicadores` (servicio externo) y la franja de indicadores en la portada.
4. Completar la URL real del repositorio en `readme.txt` y subirlo al Aula Virtual.
5. Confirmar que el repositorio de GitHub es público (o dar acceso a profesor/a y ayudante) para evitar la penalización indicada en las bases.
