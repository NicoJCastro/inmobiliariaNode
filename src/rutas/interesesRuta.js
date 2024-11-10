const express = require('express');
const router = express.Router();
const interesControlador = require('../controladores/interesesControlador');

router.post('/', interesControlador.registrarInteres); 
router.get('/', interesControlador.listarIntereses); 

module.exports = router;