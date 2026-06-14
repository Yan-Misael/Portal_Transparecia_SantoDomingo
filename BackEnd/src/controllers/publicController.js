const prisma = require('../config/db');
const { sendSuccess, sendError } = require('../utils/responseHandler');

// ----------------------------------------------------------------------------
// GET /api/departamentos
// ----------------------------------------------------------------------------
const obtenerDepartamentos = async (req, res) => {
    try {
        const departamentos = await prisma.departamento.findMany({
            orderBy: { nombre: 'asc' },
        });
        return sendSuccess(res, 200, departamentos);
    } catch (error) {
        console.error('[Error en obtenerDepartamentos]:', error);
        return sendError(res, 500, 'Error al obtener departamentos');
    }
};

// ----------------------------------------------------------------------------
// GET /api/presupuestos
// Incluye el departamento relacionado (Prisma include) y ordena por año.
// ----------------------------------------------------------------------------
const obtenerPresupuestos = async (req, res) => {
    try {
        const presupuestos = await prisma.presupuesto.findMany({
            include: { departamento: true },
            orderBy: [{ ano: 'desc' }, { id: 'asc' }],
        });
        return sendSuccess(res, 200, presupuestos);
    } catch (error) {
        console.error('[Error en obtenerPresupuestos]:', error);
        return sendError(res, 500, 'Error al obtener presupuestos');
    }
};

// ----------------------------------------------------------------------------
// GET /api/contratos?page=&limit=
// Respuesta paginada (EF4): usa skip/take + count en paralelo (Promise.all)
// y se apoya en los índices de la tabla Contrato para una consulta eficiente.
// Estructura: { items: Contrato[], meta: { total, page, limit, totalPages } }
// ----------------------------------------------------------------------------
const obtenerContratos = async (req, res) => {
    try {
        const page = Math.max(parseInt(req.query.page) || 1, 1);
        const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 100);
        const skip = (page - 1) * limit;

        const [contratos, totalRegistros] = await Promise.all([
            prisma.contrato.findMany({
                skip,
                take: limit,
                include: { departamento: true },
                orderBy: { fechaInicio: 'desc' },
            }),
            prisma.contrato.count(),
        ]);

        const paginacionData = {
            items: contratos,
            meta: {
                total: totalRegistros,
                page,
                limit,
                totalPages: Math.max(Math.ceil(totalRegistros / limit), 1),
            },
        };

        return sendSuccess(res, 200, paginacionData);
    } catch (error) {
        console.error('[Error en obtenerContratos]:', error);
        return sendError(res, 500, 'Error al obtener contratos paginados');
    }
};

// ----------------------------------------------------------------------------
// GET /api/indicadores  (EF5 - Integración con servicio externo)
// Consume la API pública mindicador.cl (Banco Central de Chile) del lado del
// servidor. La URL base es configurable vía MINDICADOR_API_URL. Se normaliza
// la respuesta a los indicadores relevantes para un portal financiero (UF,
// UTM, dólar, euro) y se maneja el error si el servicio externo no responde.
// ----------------------------------------------------------------------------
const obtenerIndicadores = async (req, res) => {
    const baseUrl = process.env.MINDICADOR_API_URL || 'https://mindicador.cl/api';
    try {
        // Node 20 incluye fetch global. Timeout defensivo de 8s.
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000);

        const respuesta = await fetch(baseUrl, { signal: controller.signal });
        clearTimeout(timeout);

        if (!respuesta.ok) {
            return sendError(res, 502, 'El servicio de indicadores no está disponible');
        }

        const data = await respuesta.json();

        const indicadores = {
            fecha: data.fecha,
            uf: data.uf ? { valor: data.uf.valor, unidad: data.uf.unidad_medida } : null,
            utm: data.utm ? { valor: data.utm.valor, unidad: data.utm.unidad_medida } : null,
            dolar: data.dolar ? { valor: data.dolar.valor, unidad: data.dolar.unidad_medida } : null,
            euro: data.euro ? { valor: data.euro.valor, unidad: data.euro.unidad_medida } : null,
        };

        return sendSuccess(res, 200, indicadores);
    } catch (error) {
        console.error('[Error en obtenerIndicadores]:', error.name === 'AbortError' ? 'Timeout' : error);
        return sendError(res, 502, 'No se pudieron obtener los indicadores económicos externos');
    }
};

module.exports = {
    obtenerDepartamentos,
    obtenerPresupuestos,
    obtenerContratos,
    obtenerIndicadores,
};
