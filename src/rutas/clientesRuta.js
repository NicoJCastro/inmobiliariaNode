const express = require('express');
const router = express.Router();
const clienteControlador = require('../controladores/clienteControlador');

router.get('/:id', clienteControlador.getById);
router.get('/', clienteControlador.getAll);


router.post('/', clienteControlador.create);
router.post('/login', clienteControlador.login);

router.put('/:id', clienteControlador.update);
router.delete('/:id', clienteControlador.delete);

module.exports = router;