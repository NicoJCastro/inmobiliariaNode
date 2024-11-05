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
            const { nombre, apellido, email, password, telefono, tipo_interes, fecha_creacion,  } = req.body;

            // Validaciones
            if (!nombre || !apellido || !email || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Todos los campos son obligatorios'
                });
            }

            const resultado = await Cliente.create({
                nombre,
                apellido,
                email,
                password,
                telefono
            });

            res.status(201).json({
                success: true,
                message: 'Cliente registrado exitosamente',
                data: { id: resultado.insertId,
                        nombre: nombre,
                        apellido: apellido,
                        email: email,
                        password: password,
                        telefono: telefono,
                        tipo_interes: tipo_interes,
                        fecha_creacion: fecha_creacion
                 }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    // Actualizar un cliente
    update: async (req, res) => {
        try {
            const cliente = await Cliente.getById(req.params.id);
            if (!cliente) {
                return res.status(404).json({ success: false, error: 'Cliente no encontrado' });
            }

            await Cliente.update(req.params.id, req.body);

            res.json({ success: true, message: "Cliente editado exitosamente" , data: cliente });

        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    // Eliminar un cliente
    delete: async (req, res) => {
        try {
            const cliente = await Cliente.getById(req.params.id);
            if (!cliente) {
                return res.status(404).json({ success: false, error: 'Cliente no encontrado' });
            }

            await Cliente.delete(req.params.id);
            
            res.json({ success: true, message: "Cliente eliminado exitosamente" , data: cliente });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }


}

module.exports = clietnteController;