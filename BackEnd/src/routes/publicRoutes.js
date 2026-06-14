const express = require('express');
const router = express.Router();
const {
    obtenerDepartamentos,
    obtenerPresupuestos,
    obtenerContratos,
    obtenerIndicadores,
} = require('../controllers/publicController');

router.get('/departamentos', obtenerDepartamentos);
router.get('/presupuestos', obtenerPresupuestos);
router.get('/contratos', obtenerContratos);

// EF5 - Servicio externo: indicadores económicos (mindicador.cl)
router.get('/indicadores', obtenerIndicadores);

module.exports = router;
