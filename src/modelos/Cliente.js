const db = require('../config/db');
const bcrypt = require('bcryptjs');


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
            return new Promise(async (resolve, reject) => {
                try {
                    // Hashear la contraseña antes de almacenarla
                    const hashedPassword = await bcrypt.hash(clienteData.password, 10);
                    clienteData.password = hashedPassword;
        
                    db.query('INSERT INTO clientes SET ?', clienteData, (err, result) => {
                        if (err) {
                            console.error('Error en la consulta de inserción:', err); 
                            reject(err);
                        } else {
                            resolve(result);
                        }
                    });
                } catch (err) {
                    console.error('Error al hashear la contraseña:', err);
                    reject(err);
                }
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

        // Eliminar un cliente

        static delete(id) {
            return new Promise((resolve, reject) => {
                db.query('DELETE FROM clientes WHERE id = ?', id, (err, result) => {
                    if (err) reject(err);
                    resolve(result);
                });
            });
        }

        static login(email, password) {
            return new Promise((resolve, reject) => {
                db.query('SELECT * FROM clientes WHERE email = ?', email, async (err, results) => {
                    if (err) {
                        console.error('Error en la consulta de login:', err);
                        return reject(err);
                    }
                    const cliente = results[0];
                    if (!cliente) {
                        console.error('Cliente no encontrado para el email:', email);
                        return reject(new Error('Cliente no encontrado'));
                    }
                    
                    console.log('Cliente encontrado:', cliente);
                    console.log('Contraseña ingresada:', password);
                    console.log('Contraseña almacenada:', cliente.password);
                    
                    try {
                        const validPassword = await bcrypt.compare(password, cliente.password);
                        console.log('Resultado de la comparación de contraseñas:', validPassword);
                        if (!validPassword) {
                            console.error('Contraseña incorrecta para el email:', email);
                            return reject(new Error('Contraseña incorrecta'));
                        }
        
                        // No enviar la contraseña en la respuesta
                        delete cliente.password;
                        resolve(cliente);
                    } catch (compareErr) {
                        console.error('Error al comparar las contraseñas:', compareErr);
                        return reject(compareErr);
                    }
                });
            });
        }
}

module.exports = Cliente;