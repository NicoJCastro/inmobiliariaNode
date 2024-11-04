const express = require('express');
const router = express.Router();
const agenteController = require('../controllers/agenteController');
const { verificarToken } = require('../middleware/auth');

router.post('/login', agenteController.login);
router.post('/register', agenteController.register);
router.get('/verify', verificarToken, agenteController.verify);
router.get('/', agenteController.getAll);
router.get('/:id', agenteController.getById);

// Solo los agentes pueden modificar y eliminar agentes. Rutas protegidas!!!
router.put('/:id', verificarToken, agenteController.update);
router.delete('/:id', verificarToken, agenteController.delete);

module.exports = router;