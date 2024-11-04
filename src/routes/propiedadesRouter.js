const express = require('express');
const router = express.Router();
const propiedadController = require('../controllers/propiedadController');
const { verificarToken, esAgente } = require('../middleware/auth'); 

router.get('/search', propiedadController.searchWithFilters);
router.get('/:id', propiedadController.getById);
router.get('/codigo/:codigo', propiedadController.getByCodigo);
router.get('/', propiedadController.getAll);

// Si es agente puede crear, modificar y eliminar propiedades. Rutas protegidas!!!
router.post('/',[verificarToken, esAgente], propiedadController.create);
router.put('/:id',[verificarToken, esAgente], propiedadController.update);
router.delete('/:id',[verificarToken, esAgente], propiedadController.delete);

module.exports = router;