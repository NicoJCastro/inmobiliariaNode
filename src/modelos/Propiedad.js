const db = require('../config/db');

class Propiedad {

    // Obtengo las propiedades

    static getAll() {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM propiedades', (err, results) => {
                if (err) reject(err);
                // Parsear las imágenes para cada propiedad
                results.forEach(propiedad => {
                    if (propiedad.imagenes) {
                        try {
                            propiedad.imagenes = JSON.parse(propiedad.imagenes);
                        } catch (e) {
                            propiedad.imagenes = [];
                        }
                    }
                });
                resolve(results);
            });
        });
    }

    // Obtener una propiedad por id

    static getById(id) {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM propiedades WHERE id = ?', id, (err, results) => {
                if (err) reject(err);
                if (results[0] && results[0].imagenes) {
                    try {
                        results[0].imagenes = JSON.parse(results[0].imagenes);
                    } catch (e) {
                        results[0].imagenes = [];
                    }
                }
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
                    if (results[0].imagenes) {
                        try {
                            results[0].imagenes = JSON.parse(results[0].imagenes);
                        } catch (e) {
                            results[0].imagenes = [];
                        }
                    }
                    resolve(results[0]);
                }
            });
        });
    }

    // Obtener propiedades por agente

    static getByAgente(agenteId) {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM propiedades WHERE agente_id = ?', agenteId, (err, results) => {
                if (err) reject(err);
                // Parsear las imágenes para cada propiedad
                results.forEach(propiedad => {
                    if (propiedad.imagenes) {
                        try {
                            propiedad.imagenes = JSON.parse(propiedad.imagenes);
                        } catch (e) {
                            propiedad.imagenes = [];
                        }
                    }
                });
                resolve(results);
            });
        });
    }

    // Crear una propiedad

    static create(propiedadData) {
        return new Promise((resolve, reject) => {
            // Asegurarse de que las imágenes se guarden como JSON string
            if (propiedadData.imagenes && Array.isArray(propiedadData.imagenes)) {
                propiedadData.imagenes = JSON.stringify(propiedadData.imagenes);
            }

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
            const fieldsToUpdate = Object.keys(propiedadData).filter(key =>
                propiedadData[key] !== undefined && propiedadData[key] !== null
            );

            if (fieldsToUpdate.length === 0) {
                return reject(new Error('No hay datos válidos para actualizar'));
            }

            // Convertir el array de imágenes a JSON string si existe
            if (propiedadData.imagenes && Array.isArray(propiedadData.imagenes)) {
                propiedadData.imagenes = JSON.stringify(propiedadData.imagenes);
            }

            const query = 'UPDATE propiedades SET ? WHERE id = ?';
            console.log('SQL Query:', query, [propiedadData, id]);

            db.query(query, [propiedadData, id], (err, result) => {
                if (err) {
                    console.error('Error en la consulta de actualización:', err);
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

    static buscarConFiltros(filters) {
        return new Promise((resolve, reject) => {
            let query = 'SELECT * FROM propiedades WHERE 1=1';
            let valores = [];

            if (filters.codigo) {
                query += ' AND codigo = ?';
                valores.push(filters.codigo);
            }

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
                query += ' AND agente_id = ?';
                valores.push(filters.agente_id);
            }

            // ACA MANEJO LA PAGINACION EN EL MODELO
            const limit = parseInt(filters.limit, 10) || 10;
            const page = parseInt(filters.page, 10) || 1;
            const offset = (page - 1) * limit;

            query += ' LIMIT ? OFFSET ?';
            valores.push(limit, offset);

            db.query(query, valores, (err, results) => {
                if (err) reject(err);
                resolve(results);
            });

        });
    }

    static contamosConFiltros(filters) {
        return new Promise((resolve, reject) => {
            let query = 'SELECT COUNT(*) as total FROM propiedades WHERE 1=1';
            let valores = [];
    
            if (filters.codigo) {
                query += ' AND codigo = ?';
                valores.push(filters.codigo);
            }
    
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
                query += ' AND agente_id = ?';
                valores.push(filters.agente_id);
            }
    
            db.query(query, valores, (err, results) => {
                if (err) reject(err);
                resolve(results[0].total);
            });
        });
    }


}

module.exports = Propiedad;