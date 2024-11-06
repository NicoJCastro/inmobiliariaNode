const express = require('express');
const router = express.Router();
const agenteControlador = require('../controladores/agenteControlador');
const { verificarToken } = require('../middleware/auth');

router.post('/login', agenteControlador.login);
router.post('/register', agenteControlador.register);
router.get('/verify', verificarToken, agenteControlador.verify);
router.get('/', agenteControlador.getAll);
router.get('/:id', agenteControlador.getById);

// Solo los agentes pueden modificar y eliminar agentes. Rutas protegidas!!!
router.put('/:id', verificarToken, agenteControlador.update);
router.delete('/:id', verificarToken, agenteControlador.delete);

module.exports = router;