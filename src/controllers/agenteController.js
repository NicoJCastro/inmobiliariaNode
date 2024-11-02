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
                data: { id: resultado.insertId }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
};

module.exports = agenteController;