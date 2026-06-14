# Portal de Transparencia y Gestión Financiera - Santo Domingo

Este sistema es una API REST robusta diseñada para gestionar y exponer la información financiera municipal, asegurando la transparencia en la administración de presupuestos, departamentos y contratos públicos. Implementa un modelo de seguridad basado en roles (RBAC) y autenticación mediante JSON Web Tokens (JWT).

## Stack Tecnológico

- **Runtime:** Node.js (Express)
- **Base de Datos:** PostgreSQL
- **ORM:** Prisma
- **Infraestructura:** Docker & Docker Compose
- **Seguridad:** bcrypt (Hashing) & jsonwebtoken (JWT)

## Arquitectura del Proyecto

```text
transparencia-backend/
├── prisma/
│   ├── schema.prisma         # Definición del modelo de datos relacional
│   └── migrations/           # Historial de migraciones de base de datos
├── src/
│   ├── config/               # Configuración de base de datos:
│   │   └── db.js             # Conexión y cliente de Prisma
│   ├── controllers/          # Lógica de negocio:
│   │   ├── authController.js # Registro y login de usuarios
│   │   ├── adminController.js # Gestión administrativa (CRUD)
│   │   └── publicController.js # Acceso público a datos
│   ├── middlewares/          # Capas de seguridad y validación:
│   │   ├── authMiddleware.js # Validación de token JWT
│   │   ├── adminMiddleware.js # Verificación de rol ADMIN
│   │   └── validateMiddleware.js # Validación de esquemas de entrada
│   ├── routes/               # Definición de endpoints:
│   │   ├── authRoutes.js     # /api/auth/...
│   │   ├── publicRoutes.js   # /api/... (Acceso libre)
│   │   ├── userRoutes.js     # /api/usuario/... (Acceso autenticado)
│   │   └── adminRoutes.js    # /api/admin/... (Acceso restringido)
│   ├── schemas/              # Esquemas de validación:
│   │   └── adminSchemas.js   # Reglas de validación para admin
│   ├── utils/                # Utilidades globales:
│   │   └── responseHandler.js # Estandarización de respuestas HTTP
│   └── app.js                # Punto de entrada y configuración de Express
├── dockerfile                # Configuración de la imagen de Node.js
├── compose.yaml              # Orquestación de servicios (API + DB)
├── prisma.config.ts          # Configuración adicional de Prisma
├── .env                      # Variables de entorno (Secretos y Credenciales)
├── AGENTS.md                 # Guía de planificación y tareas para agentes
├── .gitignore                # Archivos excluidos del control de versiones
└── package.json              # Dependencias y scripts del proyecto
```

## Guía de Instalación y Ejecución

### 1. Configuración de Entorno
Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:
```env
PORT=3000
DATABASE_URL="postgresql://user:password@localhost:5432/transparencia_db?schema=public"
JWT_SECRET="tu_clave_secreta_super_segura_aqui"
```

### 2. Levantamiento de Infraestructura
Utiliza Docker para desplegar la base de datos y la API:
```powershell
# Levantar contenedores en segundo plano
docker compose up -d

# Verificar estado de los servicios
docker ps

# Ver logs de la API para confirmar conexión a BD
docker logs api_transparencia
```

### 3. Sincronización de Base de Datos
Si realizas cambios en el archivo `prisma/schema.prisma`, sincroniza la base de datos sin perder el estado actual:
```powershell
docker compose exec api npx prisma db push
```

### 4. Mantenimiento y Reinicio
Para aplicar cambios profundos en la configuración o dependencias:
```powershell
# Detener y eliminar contenedores
docker compose down

# Reconstruir imágenes y levantar
docker compose up -d --build
```

## Referencia de la API

### Autenticación (`/api/auth`)
| Método | Endpoint | Acceso | Descripción |
| :--- | :--- | :--- | :--- |
| `POST` | `/register` | Público | Registra un funcionario. **Validaciones:** Email válido, Pass $\ge$ 6 chars, campos obligatorios. |
| `POST` | `/login` | Público | Valida credenciales y retorna JWT. **Validaciones:** Campos obligatorios. |

### Acceso Público (`/api`)
| Método | Endpoint | Acceso | Descripción |
| :--- | :--- | :--- | :--- |
| `GET` | `/departamentos` | Público | Lista todos los departamentos municipales. |
| `GET` | `/presupuestos` | Público | Lista presupuestos con detalle de departamento. |
| `GET` | `/contratos` | Público | Lista contratos públicos y sus proveedores. |

### Usuario Autenticado (`/api/usuario`)
| Método | Endpoint | Acceso | Descripción |
| :--- | :--- | :--- | :--- |
| `GET` | `/perfil` | JWT | Retorna la información del usuario autenticado. |

### Administración (`/api/admin`)
| Método | Endpoint | Acceso | Descripción |
| :--- | :--- | :--- | :--- |
| `POST` | `/departamentos` | JWT + ADMIN | Crea un nuevo departamento municipal. |
| `PUT` | `/departamentos/:id` | JWT + ADMIN | Actualiza la información de un departamento. |
| `POST` | `/presupuestos` | JWT + ADMIN | Asigna un presupuesto a un departamento. |
| `PUT` | `/presupuestos/:id` | JWT + ADMIN | Actualiza montos o año de un presupuesto. |
| `POST` | `/contratos` | JWT + ADMIN | Registra un nuevo contrato público. |
| `PUT` | `/contratos/:id` | JWT + ADMIN | Actualiza detalles de un contrato existente. |
| `DELETE` | `/contratos/:id` | JWT + ADMIN | Elimina un contrato mediante su ID. |

## Suite de Pruebas en Postman (Estándar de Industria)

### Configuración de Entorno
Crea un entorno en Postman llamado `Transparencia_Dev` con las siguientes variables:
- `url`: `http://localhost:3000/api`
- `jwt_token`: (vacío inicialmente)

### Automatización de Tokens
Para evitar copiar el token manualmente, añade el siguiente script en la pestaña **Tests** de la petición `POST /auth/login`:

```javascript
// Captura automática del token JWT
if (pm.response.code === 200) {
    const response = pm.response.json();
    if (response.token) {
        pm.environment.set("jwt_token", response.token);
        console.log("Token JWT almacenado en el entorno correctamente.");
    }
}
```

### Matriz de Validación de Seguridad

| Prueba | Acción | Header Authorization | Resultado Esperado |
| :--- | :--- | :--- | :--- |
| **Flujo Feliz** | Login $\rightarrow$ Perfil | `Bearer {{jwt_token}}` | `200 OK` |
| **Acceso No Autorizado** | GET `/usuario/perfil` | (Vacío) | `401 Unauthorized` |
| **Token Inválido** | GET `/usuario/perfil` | `Bearer token_falso` | `403 Forbidden` |
| **Escalada de Privilegios** | POST `/admin/contratos` | `Bearer {{token_usuario}}` | `403 Forbidden` (si el rol $\neq$ ADMIN) |
