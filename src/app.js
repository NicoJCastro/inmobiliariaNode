const express = require('express');
const cors = require('cors'); // cors permite que un servidor permita peticiones de otros servidores (cross-origin requests)
const propiedadRouter = require('./routes/propiedadesRouter');
require('dotenv').config();

const app = express();

// Middleware

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arhivos estáticos desde public
app.use(express.static('public'));

// Routes

app.use('/api/propiedades', propiedadRouter);

// Manjeo de los errores generales 

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined // Solo mostrar el mensaje de error en desarrollo
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

module.exports = app;

