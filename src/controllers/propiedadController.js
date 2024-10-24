const Propiedad = require('../models/Propiedad');

const propiedadController = {

    //Obtengo todas las propiedades
    getAll: async (req, res) => {
        try {
            const propiedades = await Propiedad.getAll();
            res.json({ success: true, data: propiedades });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    // Obtener una propiedad por id
    getById: async (req, res) => {
        try {
            const propiedad = await Propiedad.getById(req.params.id);
            res.json({ success: true, data: propiedad });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    // Crear una propiedad
    create: async (req, res) => {
        try {
            const resultado = await Propiedad.create(req.body);
            res.status(201).json({ 
                success: true, 
                message: 'Propiedad creada exitosamente',
                data: { id: resultado.insertId, ...req.body }
            });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    // Actualizar una propiedad
    update: async (req, res) => {
        try {
            const resultado = await Propiedad.update(req.params.id, req.body);
            if (resultado.affectedRows === 0) {
                return res.status(404).json({ success: false, message: 'Propiedad no encontrada' });
            }
            res.json({ 
                success: true, 
                message: 'Propiedad actualizada exitosamente',
                data: { id: req.params.id, ...req.body }
            });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    // Eliminar una propiedad

    delete: async (req, res) => {
        try {
            const resultado = await Propiedad.delete(req.params.id);
            if (resultado.affectedRows === 0) {
                return res.status(404).json({ success: false, message: 'Propiedad no encontrada' });
            }
            res.json({ success: true, message: 'Propiedad eliminada exitosamente' });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    // Buscar propiedades

    searchWithFilters: async (req, res) => {
        try {
            const propiedades = await Propiedad.searchWithFilters(req.query);
            res.json({ success: true, data: propiedades });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
};

module.exports = propiedadController;