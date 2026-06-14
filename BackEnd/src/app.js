// ============================================================================
//  Portal de Transparencia - Municipalidad de Santo Domingo
//  Punto de entrada de la API (Express 5 + Prisma + PostgreSQL + JWT)
// ============================================================================
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Rutas
const authRoutes = require('./routes/authRoutes');

const app = express();

// ----------------------------------------------------------------------------
// Seguridad de cabeceras HTTP (EF3): Helmet añade cabeceras como
// X-Content-Type-Options, X-Frame-Options (anti-clickjacking), HSTS, etc.
// y mitiga vectores comunes de XSS / sniffing.
// ----------------------------------------------------------------------------
app.use(helmet());

// ----------------------------------------------------------------------------
// CORS seguro mediante lista blanca configurable (EF3).
// Los orígenes permitidos se leen de la variable de entorno CORS_ORIGINS
// (separados por coma). Por defecto se aceptan los puertos de desarrollo de
// Vite (5173) y del contenedor Nginx del frontend (8080).
// ----------------------------------------------------------------------------
const origenesPermitidos = (
  process.env.CORS_ORIGINS || 'http://localhost:5173,http://localhost:8080'
)
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    // Permite herramientas sin origin (Postman, curl, health checks) y los
    // orígenes de la lista blanca. Cualquier otro origen es rechazado.
    if (!origin || origenesPermitidos.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Acceso denegado por políticas de CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));

// Parseo de JSON con límite explícito (evita payloads abusivos).
app.use(express.json({ limit: '1mb' }));

// ----------------------------------------------------------------------------
// Limitador de tasa para los endpoints de autenticación (EF3):
// mitiga ataques de fuerza bruta sobre /api/auth/login y /register.
// ----------------------------------------------------------------------------
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 50, // 50 intentos por ventana e IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Demasiados intentos de autenticación. Intente nuevamente más tarde.',
  },
});

// Ruta de comprobación de estado
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'API del Portal de Transparencia operando correctamente',
  });
});

// Rutas de autenticación (con rate limiting)
app.use('/api/auth', authLimiter, authRoutes);

// Rutas protegidas para usuarios autenticados
app.use('/api/usuario', require('./routes/userRoutes'));

// Rutas públicas para datos municipales (incluye /api/indicadores - EF5)
app.use('/api', require('./routes/publicRoutes'));

// Rutas administrativas (solo ADMIN)
app.use('/api/admin', require('./routes/adminRoutes'));

// ----------------------------------------------------------------------------
// Manejo de 404 para rutas no encontradas.
// ----------------------------------------------------------------------------
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Recurso no encontrado' });
});

// ----------------------------------------------------------------------------
// Manejador de errores centralizado. Captura errores de CORS y cualquier
// excepción no controlada, devolviendo siempre JSON estructurado.
// ----------------------------------------------------------------------------
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err && err.message === 'Acceso denegado por políticas de CORS') {
    return res.status(403).json({ success: false, error: err.message });
  }
  console.error('[Error no controlado]:', err);
  return res.status(500).json({ success: false, error: 'Error interno del servidor' });
});

// Configuración del puerto
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor inicializado en el puerto ${PORT}`);
  console.log(`Orígenes CORS permitidos: ${origenesPermitidos.join(', ')}`);
});
