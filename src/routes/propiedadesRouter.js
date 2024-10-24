const express = require('express');
const router = express.Router();
const propiedadController = require('../controllers/propiedadController');

console.log('Métodos del controlador:', Object.keys(propiedadController));


// Verificarcontroller
console.log('Controller:', propiedadController); // Para debugging


router.get('/', propiedadController.getAll);
router.get('/:id', propiedadController.getById);
router.get('/search', propiedadController.searchWithFilters);

router.post('/', propiedadController.create);

router.put('/:id', propiedadController.update);

router.delete('/:id', propiedadController.delete);

module.exports = router;