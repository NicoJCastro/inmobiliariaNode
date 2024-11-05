const express = require('express');
const router = express.Router();
const propiedadControlador = require('../controllers/propiedadControlador');
const { verificarToken, esAgente } = require('../middleware/auth'); 

router.get('/search', propiedadControlador.searchWithFilters);
router.get('/:id', propiedadControlador.getById);
router.get('/codigo/:codigo', propiedadControlador.getByCodigo);
router.get('/', propiedadControlador.getAll);
router.get('/agente/:agenteId', propiedadControlador.getByAgente);

// Si es agente puede crear, modificar y eliminar propiedades. Rutas protegidas!!!
router.post('/',[verificarToken, esAgente], propiedadControlador.create);
router.put('/:id',[verificarToken, esAgente], propiedadControlador.update);
router.delete('/:id',[verificarToken, esAgente], propiedadControlador.delete);

module.exports = router;