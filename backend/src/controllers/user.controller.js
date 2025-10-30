import { User } from '../models/User.js';

// @desc    Obtener perfil de usuario
// @route   GET /api/v1/users/profile
// @access  Private
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    res.json({
      success: true,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Actualizar perfil de usuario
// @route   PUT /api/v1/users/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const allowedFields = [
      'first_name',
      'last_name',
      'phone',
      'gender',
      'bio',
      'address',
      'city',
      'country',
      'zipcode',
      'home_address',
      'work_address',
    ];

    const updates = {};
    Object.keys(req.body).forEach(key => {
      if (allowedFields.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Profile updated successfully.',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Subir avatar
// @route   POST /api/v1/users/avatar
// @access  Private
export const uploadAvatar = async (req, res, next) => {
  try {
    // TODO: Implementar upload de imagen con multer
    res.json({
      success: true,
      message: 'Avatar upload endpoint - to be implemented.',
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getProfile,
  updateProfile,
  uploadAvatar,
};
