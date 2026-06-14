# Integración FrontEnd ↔ BackEnd — Portal de Transparencia Santo Domingo

Este documento describe la unión realizada entre el **FrontEnd**
(React + Vite + TypeScript) y el **BackEnd** (Express + Prisma + PostgreSQL + JWT).

## 1. Resumen de la integración

El FrontEnd original funcionaba con **datos simulados** y una **autenticación
JWT falsa** (`auth.ts` construía un token con `btoa`). El BackEnd es una API REST
real con autenticación JWT firmada, control de roles (RBAC) y persistencia en
PostgreSQL vía Prisma.

La unión consistió en reemplazar toda la lógica simulada del FrontEnd por
llamadas HTTP reales a los endpoints del BackEnd, manteniendo intacta la
interfaz visual y la estructura del proyecto.

| Modelo BackEnd | Endpoint público | Página FrontEnd que lo consume |
| -------------- | ---------------- | ------------------------------ |
| `Departamento` | `GET /api/departamentos` | `Organization.tsx` |
| `Presupuesto`  | `GET /api/presupuestos`  | `Budget.tsx` |
| `Contrato`     | `GET /api/contratos`     | `Contracts.tsx` |
| `Usuario`      | `POST /api/auth/*`       | `Login.tsx`, `Register.tsx` |

La gestión administrativa (crear/editar/eliminar) se realiza desde
`AdminPanel.tsx` contra los endpoints protegidos `/api/admin/*`.

## 2. Archivos modificados / creados (solo FrontEnd)

Se entregan **10 archivos**. El BackEnd **no requirió cambios**.

| Archivo | Estado | Descripción |
| ------- | ------ | ----------- |
| `src/utils/api.ts` | **NUEVO** | Cliente HTTP centralizado. Lee `VITE_API_URL`, adjunta el JWT, normaliza el formato `{ success, message, data }` y expone `publicApi` y `adminApi`. |
| `src/utils/auth.ts` | **REESCRITO** | Autenticación real: `login`/`register` llaman al BackEnd; el JWT firmado por el servidor se decodifica para validar expiración. |
| `src/app/pages/Login.tsx` | **MODIFICADO** | `handleSubmit` ahora es `async` y autentica contra `POST /api/auth/login`. |
| `src/app/pages/Register.tsx` | **MODIFICADO** | Registra al funcionario vía `POST /api/auth/register`; muestra errores del servidor. |
| `src/app/pages/AdminPanel.tsx` | **REESCRITO** | Panel de gestión real con CRUD de Departamentos, Presupuestos y Contratos contra `/api/admin/*`. Protege la ruta exigiendo sesión activa. |
| `src/app/pages/Organization.tsx` | **REESCRITO** | Carga los departamentos desde `GET /api/departamentos`. |
| `src/app/pages/Budget.tsx` | **REESCRITO** | Carga y agrupa presupuestos desde `GET /api/presupuestos`. |
| `src/app/pages/Contracts.tsx` | **REESCRITO** | Carga los contratos desde `GET /api/contratos`. |
| `src/app/components/Header.tsx` | **MODIFICADO** | Usa `isAuthenticated()`/`logout()` del nuevo `auth.ts`. |
| `.env` / `.env.example` | **NUEVO** | Define `VITE_API_URL` (URL base de la API). |

> Las páginas públicas (`Organization`, `Budget`, `Contracts`) incluyen un
> **respaldo de demostración**: si la API no está disponible, muestran datos de
> ejemplo y un indicador "Datos de demostración" en lugar de "Datos en vivo (API)".
> Esto evita que el portal quede en blanco si el BackEnd está apagado.

## 3. Puesta en marcha

### BackEnd (Express + PostgreSQL)

```bash
cd Proyecto_Transparencia_Gestion_Financiera_SantoDomingo_BackEnd-main
docker compose up -d --build           # levanta PostgreSQL + API
docker compose exec api npx prisma migrate deploy   # aplica el esquema
```

La API queda disponible en `http://localhost:3000/api`.

### FrontEnd (React + Vite)

```bash
cd Proyecto_Transparencia_Gestion_Financiera_SantoDomingo-main
npm install
# Verificar que .env contenga: VITE_API_URL=http://localhost:3000/api
npm run dev
```

> **CORS:** el BackEnd ya tiene `app.use(cors())` habilitado, por lo que acepta
> peticiones del FrontEnd desde cualquier origen sin configuración adicional.

### Primer uso

1. Ir a `/registro` y crear un funcionario (queda con rol `ADMIN`).
2. Iniciar sesión en `/login` con esas credenciales.
3. En `/admin` crear Departamentos, luego Presupuestos y Contratos.
4. Los datos aparecen de inmediato en las páginas públicas
   (Estructura, Presupuesto, Contrataciones).

## 4. Verificación realizada

Se ejecutó un harness de integración que reproduce las llamadas del cliente
`api.ts` contra el BackEnd en ejecución. **33 pruebas superadas, 0 fallidas**, cubriendo:

- Salud del servidor (`GET /api/health`).
- Registro y login: emisión de JWT real y validaciones (contraseña corta,
  credenciales inválidas).
- Matriz de seguridad: ruta protegida sin token → `401`, con token inválido →
  `403`, con token válido → `200`.
- CRUD completo de Departamentos, Presupuestos y Contratos, incluyendo errores
  de unicidad (`P2002`), integridad referencial (`P2003`) y registro no
  encontrado (`P2025`).
- Endpoints públicos: los presupuestos y contratos incluyen el objeto
  `departamento` relacionado (`include` de Prisma).

> Nota: la verificación se hizo con un *stub* en memoria del cliente Prisma,
> porque el entorno de prueba bloquea la descarga del motor binario de Prisma.
> En un entorno normal (o con el `docker compose` provisto) se usa PostgreSQL
> real sin ningún cambio en el código.
