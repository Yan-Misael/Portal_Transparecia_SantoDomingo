const { sendError } = require('../utils/responseHandler');

const validateSchema = (schema) => async (req, res, next) => {
    try {
        await schema.parseAsync({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        
        return next();
    } catch (error) {
        const validationErrors = error.issues || error.errors || [];

        const detallesErrores = validationErrors.map(err => ({
            campo: err.path.join('.'),
            mensaje: err.message
        }));
        
        return sendError(res, 400, 'Error de validación de datos', detallesErrores);
    }
};

module.exports = validateSchema;
