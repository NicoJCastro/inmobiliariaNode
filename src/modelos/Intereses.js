const db = require('../config/db'); // Asegúrate de tener tu configuración de base de datos aquí

class Intereses {
    static crearInteres(clienteId, propiedadId, tipoInteres, callback) {
        // Verificar si la propiedad existe
        const queryCheck = 'SELECT id FROM propiedades WHERE id = ?';
        db.query(queryCheck, [propiedadId], (error, results) => {
            if (error) {
                return callback(error, null);
            }
            if (results.length === 0) {
                return callback(new Error('Propiedad no encontrada'), null);
            }

            // Si la propiedad existe, insertar el interés
            const queryInsert = 'INSERT INTO intereses (cliente_id, propiedad_id, fecha_interes, tipo_interes, estado) VALUES (?, ?, NOW(), ?, ?)';
            const estado = 'pendiente'; // Estado inicial
            db.query(queryInsert, [clienteId, propiedadId, tipoInteres, estado], (error, result) => {
                if (error) {
                    return callback(error, null);
                }
                callback(null, result);
            });
        });
    }

    static listarIntereses(callback) {
        const query = 'SELECT * FROM intereses';
        db.query(query, (error, result) => {
            if (error) {
                return callback(error, null);
            }
            callback(null, result);
        });
    }
}

module.exports = Intereses;