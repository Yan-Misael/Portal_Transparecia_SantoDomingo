const sendSuccess = (res, statusCode, data, message = null) => {
    const response = {
        success: true
    };
    
    if (message) response.message = message;
    if (data !== undefined && data !== null) response.data = data;

    return res.status(statusCode).json(response);
};

const sendError = (res, statusCode, error, details = null) => {
    const response = {
        success: false,
        error: error
    };

    // Solo enviamos los detalles técnicos si existen (útil para depuración)
    if (details) response.details = details;

    return res.status(statusCode).json(response);
};

module.exports = { sendSuccess, sendError };