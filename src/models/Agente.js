const db = require('../config/db');
const bcrypt = require('bcryptjs');

class Agente {
    static async login(email, password) {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM agentes WHERE email = ?', [email], async (err, results) => {
                if (err) reject(err);
                
                const agente = results[0];
                if (!agente) {
                    reject(new Error('Agente no encontrado'));
                    return;
                }

                const validPassword = await bcrypt.compare(password, agente.password);
                if (!validPassword) {
                    reject(new Error('Contraseña incorrecta'));
                    return;
                }

                // No enviar la contraseña en la respuesta
                delete agente.password;
                resolve(agente);
            });
        });
    }

    // Seria el create
    static async register(agenteData) {
        return new Promise(async (resolve, reject) => {
            try {
                // Encriptar la contraseña
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(agenteData.password, salt);

                const newAgente = {
                    ...agenteData, // los ... son para copiar todas las propiedades de agenteData en newAgente
                    password: hashedPassword
                };

                db.query('INSERT INTO agentes SET ?', newAgente, (err, result) => {
                    if (err) reject(err);
                    resolve(result);
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    static getAll() {
        return new Promise((resolve, reject) => {
            db.query('SELECT id, nombre, apellido, email, telefono FROM agentes', (err, results) => {
                if (err) reject(err);
                resolve(results);
            });
        });
    }

    static getById(id) {
        return new Promise((resolve, reject) => {
            db.query('SELECT id, nombre, apellido, email, telefono FROM agentes WHERE id = ?', 
                [id], 
                (err, results) => {
                    if (err) reject(err);
                    resolve(results[0]);
                });
        });
    }

    static update(id, agenteData) {
        return new Promise(async (resolve, reject) => {
            try {
                if (agenteData.password) {
                    // Encriptar la nueva contraseña si se proporciona
                    const salt = await bcrypt.genSalt(10);
                    agenteData.password = await bcrypt.hash(agenteData.password, salt);
                }

                db.query('UPDATE agentes SET ? WHERE id = ?', [agenteData, id], (err, result) => {
                    if (err) reject(err);
                    resolve(result);
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    static delete(id) {
        return new Promise((resolve, reject) => {
            db.query('DELETE FROM agentes WHERE id = ?', [id], (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    }

}

module.exports = Agente;