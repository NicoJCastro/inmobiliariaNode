const Interes = require('../modelos/Intereses');

const interesControlador = {
    registrarInteres: (req, res) => {
        const { clienteId, propiedadId, tipoInteres } = req.body;

        Interes.crearInteres(clienteId, propiedadId, tipoInteres, (error, resultado) => {
            if (error) {
                return res.status(500).json({ success: false, message: error.message });
            }
            res.status(201).json({
                success: true,
                message: 'Interés registrado exitosamente',
                data: { id: resultado.insertId, clienteId, propiedadId, tipoInteres }
            });
        });
    },

    listarIntereses: (req, res) => {
        Interes.listarIntereses((error, intereses) => {
            if (error) {
                return res.status(500).json({ success: false, message: error.message });
            }
            res.json({ success: true, data: intereses });
        });
    }
};

module.exports = interesControlador;