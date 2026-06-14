# Desafíos de Implementación — Integración y Entrega Final

Este documento registra los problemas técnicos encontrados al consolidar el proyecto en su versión final y cómo se resolvieron. El objetivo es dar trazabilidad a las decisiones de arquitectura para la defensa.

El punto de partida fueron dos versiones del mismo sistema con distinto grado de madurez: una versión integrada y estable (que se tomó como base) y una versión paralela cuyo frontend no compilaba pero cuyo backend incorporaba algunas mejoras puntuales. El trabajo consistió en partir de la versión estable y portar sobre ella únicamente las mejoras válidas, cerrando además las brechas exigidas por la rúbrica de la Entrega Final.

---

## 1. Discrepancia de forma en la respuesta paginada (frontend ↔ backend)

**Problema.** La mejora de paginación del backend cambió la forma de la respuesta de contratos: de un arreglo plano `[...]` a un objeto `{ items, meta }`. El frontend esperaba el arreglo y, al recibir un objeto, dejaba de renderizar la tabla.

**Solución.** Se versionó el cliente de API en `FrontEnd/src/utils/api.ts` exponiendo dos métodos:
- `getContratosPaginated(page, limit)` que devuelve `{ items, meta }` para la tabla con control de páginas.
- `getContratos(limit)` que desempaqueta `items` y devuelve un arreglo, preservando compatibilidad con los componentes que consumían la forma anterior (tarjetas resumen, gráfico y búsqueda global).

Así la nueva capacidad de paginación convive con el código existente sin romperlo, y el componente `Pagination` ya presente en la base se conectó con el `meta` del backend.

---

## 2. Error latente que impedía arrancar el backend de la versión paralela

**Problema.** La versión paralela aplicaba un esquema de validación (`crearPresupuestoSchema`) en la ruta `POST /presupuestos`, pero ese esquema **no estaba definido ni exportado** en el archivo de esquemas. Al cargar el módulo de rutas, Node lanzaba un `ReferenceError`, lo que tumbaba el servidor antes de atender peticiones.

**Solución.** Se implementó el esquema faltante con Zod en `BackEnd/src/schemas/adminSchemas.js` (validando `ano` como entero en rango, `montoAsignado` positivo y `departamentoId` entero positivo) y se mantuvo su uso en la ruta. La validación quedó operativa en lugar de ser una referencia rota.

---

## 3. Dependencias con versiones inexistentes en el frontend paralelo

**Problema.** El `package.json` del frontend paralelo declaraba versiones que no existen en el registro de npm (por ejemplo, versiones mayores adelantadas de varias librerías). Esto hacía fallar `npm install` de entrada: el proyecto "explotaba" antes de compilar.

**Solución.** Se descartó ese `package.json` y se conservó el de la base estable, cuyas versiones están fijadas a releases reales y verificadas. Sobre esa base sólo se añadieron al backend dos dependencias de seguridad (`helmet` y `express-rate-limit`), comprobando que las versiones existieran en el registro antes de fijarlas.

---

## 4. Autenticación duplicada e inconsistente

**Problema.** El frontend paralelo tenía la lógica de autenticación repartida en varios archivos con claves de `localStorage` distintas e incompatibles entre sí (unas guardaban el token bajo una clave y la verificación lo buscaba bajo otra), de modo que las rutas protegidas nunca reconocían la sesión.

**Solución.** Se adoptó la implementación única y coherente de la base estable (`utils/auth.ts`), que centraliza el manejo del token, su decodificación, la verificación de expiración y el rol. Sobre ella se añadió un guardia de rutas declarativo (`ProtectedRoute`) que protege `/admin` a nivel de enrutador, complementando el control que la propia vista ya hacía.

---

## 5. CORS y discrepancia de puertos

**Problema.** Una configuración de CORS abierta es insegura (EF3) y, a la vez, una lista blanca mal definida bloquea al propio frontend. Había que conciliar los puertos de desarrollo (Vite en 5173) y de despliegue (Nginx en 8080).

**Solución.** En `BackEnd/src/app.js` se configuró CORS con lista blanca leída de la variable `CORS_ORIGINS`, con ambos orígenes (`5173` y `8080`) por defecto. El manejador de errores central traduce el rechazo de CORS a una respuesta `403` con JSON estructurado, en lugar de un error genérico.

---

## 6. Resolución frágil de la cadena de conexión a la base de datos

**Problema.** La conexión reescribía el host de forma rígida y fallaba con un error poco claro si la variable no estaba definida. Además, dentro de Docker el host de la base de datos no es `localhost` sino el nombre del servicio.

**Solución.** Se hizo defensivo `BackEnd/src/config/db.js`: lanza un error explícito si falta `DATABASE_URL`, y la reescritura `localhost`→`db` quedó parametrizada por `DB_INTERNAL_HOST` (valor por defecto `db`, o cadena vacía para desactivarla al correr fuera de Docker).

Un matiz importante: la **CLI de Prisma** (usada para migrar y sembrar) lee `DATABASE_URL` directamente, sin pasar por esa reescritura. Por eso, en `docker-compose.yml` la `DATABASE_URL` de la API apunta explícitamente al host `db`, garantizando que tanto la migración/seed como el cliente en tiempo de ejecución apunten a la base correcta.

---

## 7. Variables de entorno vacías que rompían el despliegue Docker

**Problema.** El archivo de ejemplo de variables del backend estaba vacío, pero la orquestación dependía de varias de ellas (credenciales de BD, `DATABASE_URL`, `JWT_SECRET`, `PORT`). Sin esos valores, los contenedores no levantaban.

**Solución.** Se completaron `.env.example` y `.env` tanto del backend como de la raíz, con valores coherentes y documentados. Se añadió un `.env.example` raíz centralizado que alimenta a `docker-compose.yml` por sustitución de variables.

---

## 8. La variable de API del frontend se "hornea" en tiempo de build

**Problema.** Vite incrusta las variables `VITE_*` en el bundle durante el build, no en tiempo de ejecución. Si se fijara la URL de la API al nombre interno del servicio Docker, el **navegador del usuario** (que corre en el host, no en la red de contenedores) no podría alcanzarla.

**Solución.** En el `Dockerfile` del frontend se expone `VITE_API_URL` como `ARG` de build, con valor por defecto `http://localhost:3000/api` (el puerto publicado de la API en el host). `docker-compose.yml` lo pasa como argumento de build. Así el bundle resultante apunta a una URL que el navegador sí puede resolver.

---

## 9. Notificaciones globales sin dependencia de framework ajeno

**Problema.** El componente envoltorio de notificaciones provisto por la plantilla importaba `next-themes`, una dependencia propia de Next.js que no corresponde a este proyecto Vite y habría introducido un fallo en tiempo de ejecución.

**Solución.** Se montó el `Toaster` importándolo directamente de `sonner` en `App.tsx`, evitando el envoltorio y su dependencia innecesaria. Los avisos de éxito/error (login, descargas, errores de carga) usan la misma librería de forma consistente.

---

## Observación de seguridad para la defensa

El endpoint de registro del backend asigna por defecto el rol `ADMIN`. Para un sistema en producción esto debería restringirse (el alta de administradores no debería ser auto-servicio). Se deja consignado como hallazgo; la diferenciación por roles en sí está implementada y operativa tanto en backend como en frontend.

---

## Verificación realizada y límites

- Se validó la **sintaxis** de todos los archivos JavaScript del backend modificados (`node --check`) y la validez del JSON de `package.json`.
- La verificación **de extremo a extremo** (migración real, seed, build de Vite y orquestación Docker) debe ejecutarse en el entorno con Docker y red disponibles, siguiendo los pasos del `README.md`. El entorno donde se preparó esta integración no dispone de Docker ni de un PostgreSQL en vivo, por lo que esa comprobación final queda a cargo de quien despliegue.
