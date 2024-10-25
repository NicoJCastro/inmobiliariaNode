const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');

router.get('/:id', clienteController.getById);
router.get('/', clienteController.getAll);

router.post('/', clienteController.create);
router.put('/:id', clienteController.update);

module.exports = router;