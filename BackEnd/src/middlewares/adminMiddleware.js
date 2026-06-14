const { sendError } = require('../utils/responseHandler');

const verificarAdmin = (req, res, next) => {
    // req.usuario es inyectado por el authMiddleware previo
    if (req.usuario && req.usuario.rol === 'ADMIN') {
        next();
    } else {
        return sendError(res, 403, 'Acceso denegado: Se requieren privilegios de Administrador');
    }
};

module.exports = verificarAdmin;