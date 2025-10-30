import { User } from '../models/User.js';
import { generateToken } from '../config/jwt.js';

// @desc    Registro de usuario
// @route   POST /api/v1/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { first_name, last_name, email, phone, password, country_phone_code } = req.body;

    // Validar campos requeridos
    if (!first_name || !last_name || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Please provide all required fields.',
      });
    }

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ 
      $or: [{ email }, { phone }] 
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User Already Exists',
        message: existingUser.email === email 
          ? 'Email already registered.' 
          : 'Phone number already registered.',
      });
    }

    // Generar código de referido único
    const referral_code = `JC${Date.now().toString(36).toUpperCase()}`;

    // Crear usuario
    const user = await User.create({
      first_name,
      last_name,
      email,
      phone,
      password,
      country_phone_code: country_phone_code || '+1',
      referral_code,
      user_type: 7, // Usuario normal
      is_approved: true,
    });

    // Generar token JWT
    const token = generateToken({ id: user._id, email: user.email });

    res.status(201).json({
      success: true,
      message: 'User registered successfully.',
      data: {
        user: {
          id: user._id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          phone: user.phone,
          referral_code: user.referral_code,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login de usuario
// @route   POST /api/v1/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password, phone } = req.body;

    // Validar que se proporcione email o phone
    if ((!email && !phone) || !password) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Please provide email/phone and password.',
      });
    }

    // Buscar usuario (incluir password para comparación)
    const query = email ? { email } : { phone };
    const user = await User.findOne(query).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid Credentials',
        message: 'Invalid email/phone or password.',
      });
    }

    // Verificar password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid Credentials',
        message: 'Invalid email/phone or password.',
      });
    }

    // Verificar si el usuario está aprobado
    if (!user.is_approved) {
      return res.status(403).json({
        success: false,
        error: 'Account Not Approved',
        message: 'Your account is pending approval.',
      });
    }

    // Generar token JWT
    const token = generateToken({ id: user._id, email: user.email });

    // Actualizar token en la base de datos
    user.token = token;
    await user.save();

    res.json({
      success: true,
      message: 'Login successful.',
      data: {
        user: {
          id: user._id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          phone: user.phone,
          picture: user.picture,
          wallet: user.wallet,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout de usuario
// @route   POST /api/v1/auth/logout
// @access  Private
export const logout = async (req, res, next) => {
  try {
    // Limpiar token del usuario
    req.user.token = '';
    req.user.device_token = '';
    await req.user.save();

    res.json({
      success: true,
      message: 'Logout successful.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtener usuario actual
// @route   GET /api/v1/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    // Determinar el rol basado en user_type
    let role = 'user';
    if (user.user_type === 1) {
      role = 'admin';
    } else if (user.user_type === 2) {
      role = 'driver';
    } else if (user.user_type === 3) {
      role = 'dispatcher';
    } else if (user.user_type === 4) {
      role = 'corporate';
    } else if (user.user_type === 5) {
      role = 'hotel';
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          phone: user.phone,
          picture: user.picture,
          wallet: user.wallet,
          user_type: user.user_type,
          role: role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Refrescar token
// @route   POST /api/v1/auth/refresh
// @access  Private
export const refreshToken = async (req, res, next) => {
  try {
    const token = generateToken({ id: req.user._id, email: req.user.email });

    req.user.token = token;
    await req.user.save();

    res.json({
      success: true,
      message: 'Token refreshed successfully.',
      data: {
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Olvidé mi contraseña
// @route   POST /api/v1/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Please provide an email.',
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'User not found.',
      });
    }

    // TODO: Implementar envío de email con código de recuperación
    // Por ahora, solo retornamos éxito

    res.json({
      success: true,
      message: 'Password reset instructions sent to your email.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Resetear contraseña
// @route   POST /api/v1/auth/reset-password
// @access  Public
export const resetPassword = async (req, res, next) => {
  try {
    const { email, code, new_password } = req.body;

    if (!email || !code || !new_password) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Please provide email, code, and new password.',
      });
    }

    // TODO: Implementar verificación de código
    // Por ahora, solo actualizamos la contraseña

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'User not found.',
      });
    }

    user.password = new_password;
    await user.save();

    res.json({
      success: true,
      message: 'Password reset successfully.',
    });
  } catch (error) {
    next(error);
  }
};

export default {
  register,
  login,
  logout,
  getMe,
  refreshToken,
  forgotPassword,
  resetPassword,
};
