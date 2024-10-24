const Propiedad = require('../models/Propiedad');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');        
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); 
    }
});

const fileFilter = (req, file, cb) => {
    const fileType = /jpeg|jpg|png|gif/;
    const extname = fileType.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileType.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Errors("Solo se permiten imagenes en formato jpeg, jpg o png"));
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 1024 * 1024 * 5 } // Limitar a 5 MB
}).single('imagen');

function generatePropertyCode() {
    const prefix = 'PROP';
    const timestamp = Date.now().toString().slice(-6); // Últimos 6 dígitos del timestamp
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0'); // 3 dígitos aleatorios
    return `${prefix}-${timestamp}-${random}`;
}

const propiedadController = {

    //Obtengo todas las propiedades
    getAll: async (req, res) => {
        try {
            const propiedades = await Propiedad.getAll();
            res.json({ success: true, data: propiedades });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    // Obtener una propiedad por id
    getById: async (req, res) => {
        try {
            const propiedad = await Propiedad.getById(req.params.id);
            res.json({ success: true, data: propiedad });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    // Crear una propiedad
    create: async (req, res) => {
        upload(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ success: false, error: err.message });
            }

            try {
                const { titulo, descripcion, precio, direccion } = req.body;
                const imagen = req.file ? `/images/${req.file.filename}` : null; // Ruta de la imagen

                const codigo = generatePropertyCode();

                const newProperty = {
                    codigo,
                    titulo,
                    descripcion,
                    precio,
                    direccion,
                    imagen 
                };

                const resultado = await Propiedad.create(newProperty);
                console.log('Datos a insertar en la base de datos:', newProperty);
                res.status(201).json({ 
                    success: true, 
                    message: 'Propiedad creada exitosamente',
                    data: { id: resultado.insertId, ...newProperty }
                });
            } catch (error) {
                res.status(500).json({ success: false, error: error.message });
            }
        });
    },

    // Actualizar una propiedad
    update: async (req, res) => {
        try {
            const resultado = await Propiedad.update(req.params.id, req.body);
            if (resultado.affectedRows === 0) {
                return res.status(404).json({ success: false, message: 'Propiedad no encontrada' });
            }
            res.json({ 
                success: true, 
                message: 'Propiedad actualizada exitosamente',
                data: { id: req.params.id, ...req.body }
            });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    // Eliminar una propiedad

    delete: async (req, res) => {
        try {
            const resultado = await Propiedad.delete(req.params.id);
            if (resultado.affectedRows === 0) {
                return res.status(404).json({ success: false, message: 'Propiedad no encontrada' });
            }
            res.json({ success: true, message: 'Propiedad eliminada exitosamente' });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    // Buscar propiedades

    searchWithFilters: async (req, res) => {
        try {
            const propiedades = await Propiedad.searchWithFilters(req.query);
            res.json({ success: true, data: propiedades });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
};

module.exports = propiedadController;