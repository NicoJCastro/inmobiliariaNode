const db = require('../config/db');

class Cliente {
    
        // Obtengo los clientes
    
        static getAll() {
            return new Promise((resolve, reject) => {
                db.query('SELECT * FROM clientes', (err, results) => {
                    if (err) reject(err);
                    resolve(results);
                });
            });
        }
    
        // Obtener un cliente por id
    
        static getById(id) {
            return new Promise((resolve, reject) => {
                db.query('SELECT * FROM clientes WHERE id = ?', id, (err, results) => {
                    if (err) reject(err);
                    resolve(results[0]);
                });
            });
    
        }
    
        // Crear un cliente
    
        static create(clienteData) {
            return new Promise((resolve, reject) => {
                db.query('INSERT INTO clientes SET ?', clienteData, (err, result) => {
                    if (err) {
                        console.error('Error en la consulta de inserción:', err); 
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            });
        }
    
        // Actualizar un cliente
    
        static update(id, clienteData) {
            return new Promise((resolve, reject) => {
                db.query('UPDATE clientes SET ? WHERE id = ?', [clienteData, id], (err, result) => {
                    if (err) reject(err);
                    resolve(result);
                });
            });
        }
}

module.exports = Cliente;