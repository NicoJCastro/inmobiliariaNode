const express = require('express');
const router = express.Router();
const multer = require('multer');
const propiedadController = require('../controllers/propiedadController');

router.get('/search', propiedadController.searchWithFilters);
router.get('/:id', propiedadController.getById);
router.get('/', propiedadController.getAll);

router.post('/', propiedadController.create);
router.put('/:id', propiedadController.update);
router.delete('/:id', propiedadController.delete);

module.exports = router;