const express = require('express');
const router = express.Router();
const clienteControlador = require('../controllers/clienteControlador');

router.get('/:id', clienteControlador.getById);
router.get('/', clienteControlador.getAll);

router.post('/', clienteControlador.create);
router.put('/:id', clienteControlador.update);
router.delete('/:id', clienteControlador.delete);

module.exports = router;