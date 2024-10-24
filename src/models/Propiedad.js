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
            db.query('UPDATE propiedades SET ? WHERE id = ?', [propiedadData, id], (err, result) => {
                if (err) reject(err);
                resolve(result);
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

            db.query(query, valores, (err, results) => {
                if (err) reject(err);
                resolve(results);
            });

        });
    }

}

module.exports = Propiedad;