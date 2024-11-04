const express = require('express');
const router = express.Router();
const agenteController = require('../controllers/agenteController');
const { verificarToken } = require('../middleware/auth');

router.post('/login', agenteController.login);
router.post('/register', agenteController.register);

router.get('/verify', verificarToken, agenteController.verify);

module.exports = router;