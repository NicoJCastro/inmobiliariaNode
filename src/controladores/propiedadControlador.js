const Propiedad = require('../modelos/Propiedad');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const unlinkAsync = promisify(fs.unlink);

function generatePropertyCode() {
    const prefix = 'PROP';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}-${timestamp}-${random}`;
}

const propiedadController = {
    
    getAll: async (req, res) => {
        try {
            const propiedades = await Propiedad.getAll();
            res.json({ success: true, data: propiedades });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

   
    getById: async (req, res) => {
        try {
            const propiedad = await Propiedad.getById(req.params.id);
            res.json({ success: true, data: propiedad });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    getByCodigo: async (req, res) => {
        try {
            const propiedad = await Propiedad.getByCodigo(req.params.codigo);
            if (!propiedad) {
                return res.status(404).json({ success: false, message: 'Propiedad no encontrada' });
            }
            console.log('Propiedad encontrada:', propiedad);
            res.json({ success: true, data: propiedad });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    getByAgente: async (req, res) => {
        try {
            const propiedad = await Propiedad.getByAgente(req.params.agenteId);
            if (!propiedad) {
                return res.status(404).json({ success: false, message: 'Propiedad no encontrada' });
            }
            res.json({ success: true, data: propiedad });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

   
    create: async (req, res) => {
        try {
            const requiredFields = ['titulo', 'tipo', 'descripcion', 'precio', 'direccion', 'agente_id'];
            const missingFields = requiredFields.filter(field => !req.body[field]);
    
            if (missingFields.length > 0) {
                return res.status(400).json({ 
                    success: false, 
                    error: `Faltan campos requeridos: ${missingFields.join(', ')}` 
                });
            }
    
            const { titulo, tipo, descripcion, precio, direccion, agente_id } = req.body;

            console.log("Archivo recibido",req.files);
            
            // Manejo de imágenes
            let imagenes = [];
            if (req.files && req.files.length > 0) {
                imagenes = req.files.map(file => `/images/${file.filename}`);
            } else if (req.body.imagen) {
                imagenes = Array.isArray(req.body.imagen) ? req.body.imagen : [req.body.imagen];
            }
            console.log("RUtas de las imagenes",imagenes);
    
            const codigo = generatePropertyCode();
    
            const newProperty = {
                codigo,
                tipo,
                titulo,
                descripcion,
                precio: parseFloat(precio),
                direccion,
                imagen: JSON.stringify(imagenes),  // Guardar las rutas como JSON string
                estado: req.body.estado || 'disponible',
                agente_id
            };
    
            console.log('Datos a insertar en la base de datos:', newProperty);
    
            const resultado = await Propiedad.create(newProperty);
    
            res.status(201).json({ 
                success: true, 
                message: 'Propiedad creada exitosamente',
                data: { 
                    id: resultado.insertId,
                    ...newProperty,
                    imagenes 
                }
            });
        } catch (error) {
            console.error('Error en create:', error);
            res.status(500).json({ 
                success: false, 
                error: error.message || 'Error al crear la propiedad' 
            });
        }
    },

    update: async (req, res) => {
        try {
            const propiedadActual = await Propiedad.getById(req.params.id);
            if (!propiedadActual) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Propiedad no encontrada' 
                });
            }
    
            // Definir los datos actualizados a partir de los datos recibidos en `req.body`
            const datosActualizados = {
                titulo: req.body.titulo,
                tipo: req.body.tipo,
                descripcion: req.body.descripcion,
                precio: parseFloat(req.body.precio),
                direccion: req.body.direccion,
                estado: req.body.estado
            };
    
            // Manejar las nuevas imágenes si se han subido
            if (req.files && req.files.length > 0) {
                
                const nuevasImagenes = req.files.map(file => `/images/${file.filename}`);
                datosActualizados.imagenes = JSON.stringify(nuevasImagenes);
    
                
                const imagenesAnteriores = JSON.parse(propiedadActual.imagenes || '[]');
                for (const imagenAnterior of imagenesAnteriores) {
                    try {
                        const imagePath = path.join(process.cwd(), 'public', imagenAnterior);
                        if (fs.existsSync(imagePath)) {
                            await unlinkAsync(imagePath); // Eliminar el archivo
                        }
                    } catch (unlinkError) {
                        console.error('Error al eliminar imagen anterior:', unlinkError);
                    }
                }
            }
    
       
            const resultado = await Propiedad.update(req.params.id, datosActualizados);
            
            if (resultado.affectedRows === 0) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Propiedad no encontrada' 
                });
            }
    
            
            res.json({ 
                success: true, 
                message: 'Propiedad actualizada exitosamente',
                data: { 
                    id: req.params.id, 
                    ...datosActualizados, 
                    imagenes: JSON.parse(datosActualizados.imagenes || '[]')
                }
            });
        } catch (error) {
            console.error('Error en update:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    },

   

    delete: async (req, res) => {
        try {
           
            const propiedad = await Propiedad.getById(req.params.id);
            
            if (!propiedad) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Propiedad no encontrada' 
                });
            }

           
            const resultado = await Propiedad.delete(req.params.id);

           
            if (resultado.affectedRows > 0 && propiedad.imagen) {
                try {
                    const imagePath = path.join(process.cwd(), 'public', propiedad.imagen);
                    console.log('Intentando eliminar imagen en:', imagePath);
                    await unlinkAsync(imagePath);
                } catch (unlinkError) {                    
                    console.error('Error al eliminar la imagen:', unlinkError);
                }
            }

            res.json({ 
                success: true, 
                message: 'Propiedad y sus archivos asociados eliminados exitosamente' 
            });
        } catch (error) {
            res.status(500).json({ 
                success: false, 
                error: error.message 
            });
        }
    },

    

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