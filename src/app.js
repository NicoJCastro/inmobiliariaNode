const express = require('express');
const cors = require('cors');
const PORT = process.env.PORT || 3000;
const path = require('path');
const propiedadRouter = require('./routes/propiedadesRouter');
const clienteRouter = require('./routes/clientesRouter');
require('dotenv').config();

const app = express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/images', express.static(path.join(__dirname, '../public/images')));
app.use('/public', express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});


app.use('/api/propiedades', propiedadRouter);
app.use('/api/clientes', clienteRouter);


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});


app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Ruta no encontrada'
    });
});


app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
    console.log(`Archivos estáticos servidos desde: ${path.join(__dirname, '../public')}`);
});

module.exports = app;