# Portal de Transparencia y Gestión Financiera — Santo Domingo

Sistema web para la publicación y gestión de información financiera municipal bajo la **Ley 20.285** de Chile (Transparencia Activa). Incluye un portal ciudadano de consulta pública y un panel administrativo protegido con autenticación.

Proyecto del curso **ICI 4247 — Ingeniería Web y Móvil**, PUCV. Entrega Final.

Los datos sembrados se basan en información pública oficial de la I. Municipalidad de Santo Domingo, Región de Valparaíso (ver `Otros/FUENTES_DATOS.md`).

| Capa | Tecnología |
| --- | --- |
| FrontEnd | React 19, Vite, TypeScript, Tailwind CSS, React Router 7 |
| BackEnd | Node.js, Express 5, Prisma ORM 7, JWT, bcrypt, Helmet, express-rate-limit |
| Base de datos | PostgreSQL 15 |
| Servicio externo | mindicador.cl (indicadores económicos UF/UTM/dólar/euro) |
| Infraestructura | Docker & Docker Compose, Nginx |

---

## 1. Estructura del repositorio

```
Portal_Transparencia_SantoDomingo_Final/
├── docker-compose.yml          ← orquesta los 3 servicios (EF6)
├── .env / .env.example         ← variables consumidas por compose
├── README.md
├── readme.txt                  ← URL del repo (para Aula Virtual)
├── BackEnd/                     ← API REST + Prisma + PostgreSQL
│   ├── dockerfile
│   ├── package.json
│   ├── .env / .env.example
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── seed.js
│   │   └── migrations/
│   └── src/
│       ├── app.js               ← punto de entrada (Express)
│       ├── config/db.js
│       ├── controllers/         ← auth, admin, public
│       ├── routes/
│       ├── middlewares/
│       └── schemas/             ← validación con Zod
├── FrontEnd/                    ← portal + panel admin (Vite/React)
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── .env / .env.example
│   └── src/app/
│       ├── pages/
│       ├── components/
│       ├── routes.tsx
│       └── App.tsx
└── Otros/                       ← material de apoyo (rúbrica: carpeta "otros")
    ├── FUENTES_DATOS.md
    ├── DESAFIOS_IMPLEMENTACION.md
    └── RUBRICA_CHECKLIST.md
```

---

## 2. Puesta en marcha con Docker (recomendado)

Es la vía oficial de despliegue (EF6) y la más simple: levanta base de datos, API y frontend con un solo comando.

### Requisitos previos
- Docker Desktop (o Docker Engine + plugin Compose v2).
- Puertos libres en el host: **8080** (web), **3000** (API), **5432** (PostgreSQL).

### Pasos

```bash
# 1. Situarse en la raíz del proyecto (donde está docker-compose.yml)
cd Portal_Transparencia_SantoDomingo_Final

# 2. Crear el archivo de variables a partir del ejemplo
cp .env.example .env          # en Windows PowerShell: copy .env.example .env

# 3. Construir y levantar todo en segundo plano
docker compose up -d --build
```

La primera vez, la API ejecuta automáticamente, **en orden**:
1. `prisma migrate deploy` — crea las tablas (incluye índices de optimización).
2. `prisma db seed` — inserta departamentos, presupuestos, contratos y el usuario administrador.
3. `npm start` — arranca el servidor Express.

Esto ocurre **después** de que PostgreSQL esté saludable (`depends_on: condition: service_healthy`), evitando la condición de carrera habitual.

### Acceso

| Servicio | URL |
| --- | --- |
| Portal ciudadano (Frontend) | http://localhost:8080 |
| API REST | http://localhost:3000/api |
| Indicadores (prueba del servicio externo) | http://localhost:3000/api/indicadores |

### Credenciales del administrador (sembradas)

```
Correo:      admin@santodomingo.cl
Contraseña:  clave123
```

Inicie sesión en http://localhost:8080/login para acceder al panel `/admin` (CRUD de departamentos, presupuestos y contratos).

### Comandos útiles

```bash
docker compose logs -f api     # ver logs de la API (migración/seed/arranque)
docker compose ps              # estado de los contenedores
docker compose down            # detener y eliminar contenedores
docker compose down -v         # además, borrar el volumen de la BD (reinicio limpio)
```

---

## 3. Ejecución en modo desarrollo (sin Docker)

Útil para desarrollar con recarga en caliente. Requiere Node.js 20+ y un PostgreSQL local en ejecución.

### Backend

```bash
cd BackEnd
cp .env.example .env
# Editar .env: ajustar DATABASE_URL a su PostgreSQL local y añadir DB_INTERNAL_HOST=""
# (DB_INTERNAL_HOST="" desactiva la reescritura localhost->db pensada para Docker)

npm install
npx prisma migrate deploy
npx prisma db seed
npm run dev                    # nodemon en http://localhost:3000
```

### Frontend

```bash
cd FrontEnd
cp .env.example .env           # VITE_API_URL=http://localhost:3000/api
npm install
npm run dev                    # Vite en http://localhost:5173
```

El backend ya permite el origen `http://localhost:5173` en su lista blanca de CORS.

---

## 4. Cumplimiento de la rúbrica (Entrega Final)

Resumen del mapeo; el detalle por criterio está en `Otros/RUBRICA_CHECKLIST.md`.

| Criterio | Dónde se evidencia |
| --- | --- |
| **EF1** — Funcionalidades completas e integración | CRUD real en panel `/admin`, autenticación JWT, roles (ADMIN), notificaciones (toasts de `sonner`), almacenamiento local del token, integración front-back vía `fetch`. |
| **EF2** — UI/UX y rendimiento | Diseño responsivo (móvil/web), navegación coherente, paginación, compresión gzip y caché de estáticos en Nginx. |
| **EF3** — Seguridad de la API | Hash bcrypt, JWT firmado y validado, CORS por lista blanca, cabeceras con Helmet, rate limiting en `/api/auth`, validación de inputs con Zod, ORM Prisma (consultas parametrizadas → mitiga inyección SQL). |
| **EF4** — Optimización de consultas | Índices en columnas de filtro/orden (`@@index`), paginación con `skip/take` y `count`, `orderBy`, respuestas que no exponen datos innecesarios. |
| **EF5** — Servicio externo | Endpoint `/api/indicadores` que actúa como proxy a mindicador.cl, con timeout, manejo de errores y variable de entorno `MINDICADOR_API_URL`. Se consume en la portada (componente `EconomicIndicators`). |
| **EF6** — Despliegue con Docker | `Dockerfile` de backend y frontend + `docker-compose.yml` orquestando los tres servicios, variables de entorno e instrucciones de despliegue. |

> **Nota honesta sobre el stack de UI.** La rúbrica menciona componentes de Ionic en su nivel "Excelente". Este proyecto fue desarrollado desde las entregas parciales con **React + Vite + Tailwind/shadcn**, no con Ionic. Migrar a Ionic a esta altura implicaría reescribir la capa de presentación completa, fuera del alcance de la integración final. El resto de los criterios (funcionalidad, seguridad, optimización, servicio externo y Docker) es independiente del framework de UI y se cumple en su totalidad. Esta decisión y su justificación se documentan para la defensa.

---

## 5. Notas de arquitectura

- **Backend en capas:** rutas → middlewares (auth/rol/validación) → controladores → Prisma. Las respuestas siguen un formato JSON uniforme (`{ success, data | error }`).
- **Autenticación:** el token JWT (vigencia 8 h) se guarda en `localStorage`. El frontend protege la ruta `/admin` con un guardia declarativo (`ProtectedRoute`) además del control interno de la vista.
- **Reescritura de host de BD:** `src/config/db.js` traduce `localhost`→`db` para que la misma cadena de conexión sirva en local y en Docker. En `docker-compose.yml`, la `DATABASE_URL` de la API ya apunta directamente a `db` porque la **CLI de Prisma** (migración/seed) no pasa por esa reescritura.
- **Servicio externo desacoplado:** el frontend nunca llama a mindicador.cl directamente; lo hace a través del backend, centralizando errores, timeout y CORS.

Para los desafíos técnicos encontrados durante la integración de las dos bases de código y cómo se resolvieron, ver `Otros/DESAFIOS_IMPLEMENTACION.md`.
