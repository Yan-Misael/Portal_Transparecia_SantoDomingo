const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

// ----------------------------------------------------------------------------
// Resolución defensiva de la cadena de conexión.
// ----------------------------------------------------------------------------
const rawUrl = process.env.DATABASE_URL;
if (!rawUrl) {
  throw new Error(
    'DATABASE_URL no está definida. Copie .env.example a .env y configure la conexión a PostgreSQL.'
  );
}

// Dentro de Docker, el host de la base de datos es el nombre del servicio
// (por defecto "db"). Esto permite usar la misma cadena con "localhost" tanto
// en local como en contenedor. Para deshabilitar la reescritura (ej. ejecutar
// la API fuera de Docker contra un PostgreSQL local), defina DB_INTERNAL_HOST="".
const internalHost = process.env.DB_INTERNAL_HOST ?? 'db';
const connectionString = internalHost ? rawUrl.replace('localhost', internalHost) : rawUrl;

console.log('🛠️  Conectando a la base de datos...');

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

module.exports = prisma;
