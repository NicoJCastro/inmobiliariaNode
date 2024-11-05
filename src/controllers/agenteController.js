const Agente = require('../models/Agente');

const jwt = require('jsonwebtoken');

const agenteController = {
    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Por favor, proporcione email y contraseña'
                });
            }

            const agente = await Agente.login(email, password);

            // Generar token JWT
            const token = jwt.sign(
                { 
                    id: agente.id, 
                    email: agente.email,
                    rol: 'agente'
                },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.json({
                success: true,
                data: {
                    agente: {
                        id: agente.id,
                        nombre: agente.nombre,
                        email: agente.email
                    },
                    token
                }
            });
        } catch (error) {
            res.status(401).json({
                success: false,
                message: error.message
            });
        }
    },

    register: async (req, res) => {
        try {
            const { nombre, apellido, email, password, telefono } = req.body;

            // Validaciones
            if (!nombre || !apellido || !email || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Todos los campos son obligatorios'
                });
            }

            const resultado = await Agente.register({
                nombre,
                apellido,
                email,
                password,
                telefono
            });

            res.status(201).json({
                success: true,
                message: 'Agente registrado exitosamente',
                data: resultado
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    verify: async (req, res) => {
        try {
            res.json({
                success: true,
                message: 'Token válido'
            });
        } catch (error) {
            res.status(401).json({
                success: false,
                message: error.message
            });
        }
    },

    getAll: async (req, res) => {
        try {
            const agentes = await Agente.getAll();
            res.json({ success: true, data: agentes });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    getById: async (req, res) => {
        try {
            const agente = await Agente.getById(req.params.id);
            if (!agente) {
                return res.status(404).json({ success: false, message: 'Agente no encontrado' });
            }
            res.json({ success: true, data: agente });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    update: async (req, res) => {
        try {
            const { nombre, apellido, email, password, telefono } = req.body;
    
            // Validaciones
            if (!nombre || !apellido || !email) {
                return res.status(400).json({
                    success: false,
                    message: 'Nombre, apellido y email son obligatorios'
                });
            }
    
            const agenteData = { nombre, apellido, email, telefono };
            if (password) {
                agenteData.password = password; // Solo actualizar la contraseña si se proporciona
            }
    
            const resultado = await Agente.update(req.params.id, agenteData);
    
            if (resultado.affectedRows === 0) {
                return res.status(404).json({ success: false, message: 'Agente no encontrado' });
            }

            const agenteActualizado = await Agente.getById(req.params.id);
    
            res.json({ success: true, message: 'Agente actualizado exitosamente',   data: agenteActualizado  });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    delete: async (req, res) => {
        try {
            const agente = await Agente.getById(req.params.id);

            if (!agente) {
                return res.status(404).json({ success: false, message: 'Agente no encontrado' });
            }

            await Agente.delete(req.params.id); 
    
            res.json({ success: true, message: 'Agente eliminado exitosamente', data: agente });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
   
};

module.exports = agenteController;