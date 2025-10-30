import { verifyToken } from '../config/jwt.js';
import { User } from '../models/User.js';

export const protect = async (req, res, next) => {
  try {
    let token;

    // Obtener token del header Authorization
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'No token provided. Please login.',
      });
    }

    // Verificar token
    const decoded = verifyToken(token);

    // Buscar usuario en la base de datos
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'User not found.',
      });
    }

    // Agregar usuario al request
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized',
      message: error.message || 'Invalid token.',
    });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.type)) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden',
        message: `User type '${req.user.type}' is not authorized to access this route.`,
      });
    }
    next();
  };
};

export default { protect, authorize };
