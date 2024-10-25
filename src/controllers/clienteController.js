const Cliente = require('../models/Cliente');
const multer = require('multer');
const path = require('path');

const clietnteController = {

    //Obtengo todos los clientes
    getAll: async (req, res) => {
        try {
            const clientes = await Cliente.getAll();
            res.json({ success: true, data: clientes });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    // Obtener un cliente por id
    getById: async (req, res) => {
        try {
            const cliente = await Cliente.getById(req.params.id);
            res.json({ success: true, data: cliente });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    // Crear un cliente
    create: async (req, res) => {
        try {
            const result = await Cliente.create(req.body);
            res.json({ success: true, data: result });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    // Actualizar un cliente
    update: async (req, res) => {
        try {
            const result = await Cliente.update(req.params.id, req.body);
            res.json({ success: true, data: result });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }


}

module.exports = clietnteController;