const express = require('express');
const router = express.Router();
const propiedadController = require('../controllers/propiedadController');

//DEGUB VER!
console.log('Métodos del controlador:', Object.keys(propiedadController));
console.log('Controller:', propiedadController);


router.get('/search', propiedadController.searchWithFilters); // Colocada antes de la ruta con :id
router.get('/:id', propiedadController.getById);
router.get('/', propiedadController.getAll);

router.post('/', propiedadController.create);
router.put('/:id', propiedadController.update);
router.delete('/:id', propiedadController.delete);

module.exports = router;