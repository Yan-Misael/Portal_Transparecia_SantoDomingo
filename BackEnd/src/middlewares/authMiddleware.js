const jwt = require('jsonwebtoken');
const { sendError } = require('../utils/responseHandler');

const protegerRuta = (req, res, next) => {
    // 1. Obtener el token del header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return sendError(res, 401, 'Acceso denegado: Token no proporcionado');
    }

    const token = authHeader.split(' ')[1];

    try {
        // 2. Verificar el token
        const verificado = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = verificado; // Inyectamos los datos del usuario en la petición
        next(); // Continuar al controlador
    } catch (error) {
        return sendError(res, 403, 'Token inválido o expirado');
    }
};

module.exports = protegerRuta;