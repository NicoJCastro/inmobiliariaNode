const db = require('../config/db');

class Propiedad {

    // Obtengo las propiedades

    static getAll() {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM propiedades', (err, results) => {
                if (err) reject(err);
                resolve(results);
            });
        });
    }

    // Obtener una propiedad por id

    static getById(id) {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM propiedades WHERE id = ?', id, (err, results) => {
                if (err) reject(err);
                resolve(results[0]);
            });
        });

    }

    // Obtener propiedad por codigo
    static getByCodigo(codigo) {
        return new Promise((resolve, reject) => {
            console.log('SQL Query:', 'SELECT * FROM propiedades WHERE codigo = ?', codigo);
            db.query('SELECT * FROM propiedades WHERE codigo = ?', codigo, (err, results) => {
                if (err) {
                    reject(err);
                } else if (results.length === 0) {
                    resolve(null);
                } else {
                    resolve(results[0]);
                }
            });
        });
    }

    // Obtener agente por Id

    static getByAgente(agenteId) {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM propiedades WHERE agente_id = ?', agenteId, (err, results) => {
                if (err) {
                    console.error('Error en la consulta:', err);
                    reject(err);
                }
                console.log('Resultados:', results);
                resolve(results[0] || null);
            });
        });
    }

    // Crear una propiedad

    static create(propiedadData) {
        return new Promise((resolve, reject) => {
            db.query('INSERT INTO propiedades SET ?', propiedadData, (err, result) => {
                if (err) {
                    console.error('Error en la consulta de inserción:', err); 
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

    // Actualizar una propiedad

    static update(id, propiedadData) {
        return new Promise((resolve, reject) => {
            if (Object.keys(propiedadData).length === 0) {
                return reject(new Error('No hay datos para actualizar'));
            }
    
            // Verificar que propiedadData no esté vacío
            const fieldsToUpdate = Object.keys(propiedadData).filter(key => propiedadData[key] !== undefined && propiedadData[key] !== null);
            if (fieldsToUpdate.length === 0) {
                return reject(new Error('No hay datos válidos para actualizar'));
            }
    
            const query = 'UPDATE propiedades SET ? WHERE id = ?';
            console.log('SQL Query:', query, [propiedadData, id]); // Agregar esta línea para depuración
            db.query(query, [propiedadData, id], (err, result) => {
                if (err) {
                    console.error('Error en la consulta de actualización:', err); // Agregar esta línea para depuración
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }


    // Eliminar una propiedad

    static delete(id) {
        return new Promise((resolve, reject) => {
            db.query('DELETE FROM propiedades WHERE id = ?', id, (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    }

    // Buscar propiedades por filtros

    static searchWithFilters(filters) {
        return new Promise((resolve, reject) => {
            let query = 'SELECT * FROM propiedades WHERE 1=1';
            let valores = [];

            if (filters.tipo) {
                query += ' AND tipo = ?';
                valores.push(filters.tipo);
            }
            

            if (filters.precioMin) {
                query += ' AND precio >= ?';
                valores.push(filters.precioMin);
            }

            if (filters.precioMax) {
                query += ' AND precio <= ?';
                valores.push(filters.precioMax);
            }

            if (filters.estado) {
                query += ' AND estado = ?';
                valores.push(filters.estado);
            }

            if (filters.images) {
                query += ' AND images > 0';
                valores.push(filters.images);
            }

            if (filters.agente_id) {
                query += ' AND p.agente_id = ?';
                valores.push(filters.agente_id);
            }

            db.query(query, valores, (err, results) => {
                if (err) reject(err);
                resolve(results);
            });

        });
    }

}

module.exports = Propiedad;