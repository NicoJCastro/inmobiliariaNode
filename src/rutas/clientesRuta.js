const express = require('express');
const router = express.Router();
const clienteControlador = require('../controladores/clienteControlador');
const { verificarToken } = require('../middleware/auth');


router.get('/:id', clienteControlador.getById);
router.get('/', clienteControlador.getAll);


router.post('/', clienteControlador.create);
router.post('/login', clienteControlador.login);

router.put('/:id', clienteControlador.update);
router.delete('/:id', verificarToken, clienteControlador.delete);

module.exports = router;