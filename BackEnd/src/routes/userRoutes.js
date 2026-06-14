const express = require('express');
const router = express.Router();
const protegerRuta = require('../middlewares/authMiddleware');

// Ruta protegida que requiere JWT
router.get('/perfil', protegerRuta, (req, res) => {
    res.json({
        mensaje: 'Acceso autorizado a datos municipales',
        datosUsuario: req.usuario
    });
});

module.exports = router;