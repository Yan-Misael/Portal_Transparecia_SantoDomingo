const { z } = require('zod');

const crearDepartamentoSchema = z.object({
    body: z.object({
        nombre: z.string({ required_error: "El nombre es obligatorio" })
                 .min(3, "El nombre debe tener al menos 3 caracteres"),
        descripcion: z.string().optional()
    })
});

// Validación para la creación de presupuestos (EF3).
// El controlador inicializa montoEjecutado en 0, por lo que solo se exigen
// ano, montoAsignado y departamentoId.
const crearPresupuestoSchema = z.object({
    body: z.object({
        ano: z.number({ required_error: "El año es obligatorio", invalid_type_error: "El año debe ser numérico" })
              .int("El año debe ser un entero")
              .gte(2000, "El año debe ser válido")
              .lte(2100, "El año debe ser válido"),
        montoAsignado: z.number({ required_error: "El monto asignado es obligatorio", invalid_type_error: "El monto debe ser numérico" })
              .positive("El monto asignado debe ser mayor a 0"),
        departamentoId: z.number({ required_error: "El departamento es obligatorio" })
              .int().positive("El ID de departamento debe ser un entero positivo")
    })
});

const crearContratoSchema = z.object({
    body: z.object({
        titulo: z.string({ required_error: "El título es obligatorio" }),
        proveedor: z.string({ required_error: "El proveedor es obligatorio" }),
        monto: z.number({ required_error: "El monto es obligatorio", invalid_type_error: "El monto debe ser numérico" })
                .positive("El monto debe ser mayor a 0"),
        fechaInicio: z.string().datetime({ message: "Formato de fecha inválido. Use ISO 8601 (YYYY-MM-DDTHH:mm:ssZ)" }),
        departamentoId: z.number().int().positive()
    })
});

const idParamSchema = z.object({
    params: z.object({
        id: z.coerce.number().int().positive("El ID debe ser un número entero positivo")
    })
});

module.exports = { crearDepartamentoSchema, crearPresupuestoSchema, crearContratoSchema, idParamSchema };
