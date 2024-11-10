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
            const propiedades = await Propiedad.getById(req.params.id);
            res.json({ success: true, data: propiedades });
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
            // Verifica que todos los campos requeridos estén en `req.body`
            const requiredFields = ['titulo', 'tipo', 'descripcion', 'precio', 'direccion', 'agente_id'];
            const missingFields = requiredFields.filter(field => !req.body[field]);
            
            if (missingFields.length > 0) {
                return res.status(400).json({ 
                    success: false, 
                    error: `Faltan campos requeridos: ${missingFields.join(', ')}` 
                });
            }
    
            const { titulo, tipo, descripcion, precio, direccion, agente_id } = req.body;
            
            // Como manejo las imagenes en la tabla propeidades. Colocamos la primera como principal y las demas como secundarias.
            let imagenPrincipal = null;
            let imagenes = [];
            if (req.files && req.files.length > 0) {
                imagenPrincipal = `/images/${req.files[0].filename}`;

                if (req.files.length > 1) {
                imagenes = req.files.slice(1).map(file => `/images/${file.filename}`);
                }
            }
            
            const codigo = generatePropertyCode();
            
            const newProperty = {
                codigo,
                tipo,
                titulo,
                descripcion,
                precio: parseFloat(precio),
                direccion,
                imagen: imagenPrincipal,
                imagenes: JSON.stringify(imagenes),  // Guardar como JSON es un array de direcciones de imágenes
                estado: req.body.estado || 'disponible',
                agente_id
            };
            
            // Guardar en la base de datos
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
    
            const datosActualizados = {
                titulo: req.body.titulo,
                tipo: req.body.tipo,
                descripcion: req.body.descripcion,
                precio: parseFloat(req.body.precio),
                direccion: req.body.direccion,
                estado: req.body.estado,
                agente_id: req.body.agente_id
            };
    
            // Manejar las nuevas imágenes si se han subido
            if (req.files && req.files.length > 0) {
                // Imagen principal
                datosActualizados.imagen = `/images/${req.files[0].filename}`;
    
                // Las secundarias se guardan como un array de strings
                if (req.files.length > 1) {
                    datosActualizados.imagenes = JSON.stringify(
                        req.files.slice(1).map(file => `/images/${file.filename}`)
                    );
                } else {
                    datosActualizados.imagenes = JSON.stringify([]);
                }
    
                // Elimina las imágenes anteriores para que no se repitan en el servidor
                const imagenesAnteriores = JSON.parse(propiedadActual.imagenes || '[]');
                for (const imagenAnterior of imagenesAnteriores) {
                    try {
                        const imagePath = path.join(process.cwd(), 'public', imagenAnterior);
                        if (fs.existsSync(imagePath)) {
                            await unlinkAsync(imagePath);
                        }
                    } catch (unlinkError) {
                        console.error('Error al eliminar imagen anterior:', unlinkError);
                    }
                }
    
                // Eliminar la imagen principal anterior si también fue reemplazada
                if (propiedadActual.imagen && propiedadActual.imagen !== datosActualizados.imagen) {
                    try {
                        const principalImagePath = path.join(process.cwd(), 'public', propiedadActual.imagen);
                        if (fs.existsSync(principalImagePath)) {
                            await unlinkAsync(principalImagePath);
                        }
                    } catch (unlinkError) {
                        console.error('Error al eliminar la imagen principal anterior:', unlinkError);
                    }
                }
            }
    
            // Actualizar en la base de datos
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

    

    buscarConFiltros: async (req, res) => {
        try {
            const { page = 1, limit = 10, ...filters } = req.query;
            const offset = (page - 1) * limit;
    
            // Obtener las propiedades filtradas
            const propiedades = await Propiedad.buscarConFiltros({ ...filters, limit, offset });
    
            // Obtener el total de propiedades para la paginación
            const totalPropiedades = await Propiedad.contamosConFiltros(filters);
    
            res.json({ 
                success: true, 
                data: propiedades,
                total: totalPropiedades,
                page: parseInt(page, 10),
                limit: parseInt(limit, 10)
            });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
};

module.exports = propiedadController;