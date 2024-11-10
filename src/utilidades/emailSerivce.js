const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const emailService = {
    async notificarCambioEstado(propiedad, cliente) {
        try {
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: cliente.email,
                subject: `Actualización sobre propiedad ${propiedad.codigo}`,
                html: `
                    <h1>Actualización de Propiedad</h1>
                    <p>La propiedad ${propiedad.titulo} ha cambiado su estado a: ${propiedad.estado}</p>
                    <p>Para más información, contacte con su agente inmobiliario.</p>
                `
            });
        } catch (error) {
            console.error('Error al enviar email:', error);
        }
    },

    async enviarEmailPersonalizado(destinatario, asunto, contenido) {
        try {
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: destinatario,
                subject: asunto,
                html: contenido
            });
        } catch (error) {
            console.error('Error al enviar email personalizado:', error);
            throw error;
        }
    }
};

module.exports = emailService;

// Tengo errores por temas de que gmail no permite el envío de correos desde aplicaciones no seguras, por lo que no puedo probar el envío de correos electrónicos. 
