const prisma = require('../config/db');
const { sendSuccess, sendError } = require('../utils/responseHandler');

const adminController = {
    async crearDepartamento(req, res) {
        try {
            const { nombre, descripcion } = req.body;
            const nuevo = await prisma.departamento.create({
                data: { nombre, descripcion }
            });
            return sendSuccess(res, 201, nuevo, 'Departamento creado correctamente.');
        } catch (error) {
            console.error('[Error en crearDepartamento]:', error);
            // Manejo específico para errores de unicidad (nombre duplicado)
            if (error.code === 'P2002') {
                return sendError(res, 400, 'El nombre del departamento ya existe.');
            }
            return sendError(res, 500, 'Error interno del servidor al crear el departamento.');
        }
    },

    async actualizarDepartamento(req, res) {
        try {
            const { id } = req.params;
            const { nombre, descripcion } = req.body;
            const actualizado = await prisma.departamento.update({
                where: { id: parseInt(id) },
                data: { nombre, descripcion }
            });
            return sendSuccess(res, 200, actualizado, 'Departamento actualizado correctamente.');
        } catch (error) {
            console.error('[Error en actualizarDepartamento]:', error);
            if (error.code === 'P2025') {
                return sendError(res, 404, 'El departamento no fue encontrado.');
            }
            if (error.code === 'P2002') {
                return sendError(res, 400, 'El nombre del departamento ya existe.');
            }
            return sendError(res, 500, 'Error interno del servidor al actualizar el departamento.');
        }
    },

    async crearPresupuesto(req, res) {
        try {
            const { ano, montoAsignado, departamentoId } = req.body;
            const nuevo = await prisma.presupuesto.create({
                data: { 
                    ano, 
                    montoAsignado, 
                    montoEjecutado: 0, // Se inicializa en 0 por defecto
                    departamentoId 
                }
            });
            return sendSuccess(res, 201, nuevo, 'Presupuesto creado correctamente.');
        } catch (error) {
            console.error('[Error en crearPresupuesto]:', error);
            if (error.code === 'P2003') {
                return sendError(res, 400, 'El ID del departamento no existe.');
            }
            return sendError(res, 500, 'Error interno al registrar el presupuesto.');
        }
    },

    async actualizarPresupuesto(req, res) {
        try {
            const { id } = req.params;
            const { ano, montoAsignado, montoEjecutado } = req.body;
            const actualizado = await prisma.presupuesto.update({
                where: { id: parseInt(id) },
                data: { ano, montoAsignado, montoEjecutado }
            });
            return sendSuccess(res, 200, actualizado, 'Presupuesto actualizado correctamente.');
        } catch (error) {
            console.error('[Error en actualizarPresupuesto]:', error);
            if (error.code === 'P2025') {
                return sendError(res, 404, 'El presupuesto no fue encontrado.');
            }
            return sendError(res, 500, 'Error interno al actualizar el presupuesto.');
        }
    },

    async crearContrato(req, res) {
        try {
            const { titulo, proveedor, monto, fechaInicio, departamentoId } = req.body;
            const nuevo = await prisma.contrato.create({
                data: { 
                    titulo, 
                    proveedor, 
                    monto, 
                    // Aseguramos que el string de fecha se parsee a objeto Date nativo
                    fechaInicio: new Date(fechaInicio), 
                    departamentoId 
                }
            });
            return sendSuccess(res, 201, nuevo, 'Contrato creado correctamente.');
        } catch (error) {
            console.error('[Error en crearContrato]:', error);
            return sendError(res, 500, 'Error interno al registrar el contrato.');
        }
    },

    async actualizarContrato(req, res) {
        try {
            const { id } = req.params;
            const { titulo, proveedor, monto, fechaInicio, fechaTermino, departamentoId } = req.body;
            const actualizado = await prisma.contrato.update({
                where: { id: parseInt(id) },
                data: { 
                    titulo, 
                    proveedor, 
                    monto, 
                    fechaInicio: fechaInicio ? new Date(fechaInicio) : undefined,
                    fechaTermino: fechaTermino ? new Date(fechaTermino) : undefined,
                    departamentoId 
                }
            });
            return sendSuccess(res, 200, actualizado, 'Contrato actualizado correctamente.');
        } catch (error) {
            console.error('[Error en actualizarContrato]:', error);
            if (error.code === 'P2025') {
                return sendError(res, 404, 'El contrato no fue encontrado.');
            }
            return sendError(res, 500, 'Error interno al actualizar el contrato.');
        }
    },

    async eliminarContrato(req, res) {
        try {
            const { id } = req.params;
            await prisma.contrato.delete({
                where: { id: parseInt(id) }
            });
            return sendSuccess(res, 200, null, 'Contrato eliminado correctamente.');
        } catch (error) {
            console.error('[Error en eliminarContrato]:', error);
            if (error.code === 'P2025') {
                return sendError(res, 404, 'El contrato no fue encontrado.');
            }
            return sendError(res, 500, 'Error interno al eliminar el contrato.');
        }
    }
};

module.exports = adminController;