const jwt = require('jsonwebtoken');

const auth = {
    verificarToken: (req, res, next) => {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: 'Acceso denegado. Token no proporcionado.' 
            });
        }

        try {
            const verified = jwt.verify(token, process.env.JWT_SECRET);
            req.user = verified;
            next();
        } catch (error) {
            res.status(401).json({ 
                success: false, 
                message: 'Token inválido' 
            });
        }
    },

    esAgente: (req, res, next) => {
        if (req.user && req.user.rol === 'agente') {
            next();
        } else {
            res.status(403).json({ 
                success: false, 
                message: 'Acceso denegado. Se requieren permisos de agente.' 
            });
        }
    }
};

module.exports = auth;