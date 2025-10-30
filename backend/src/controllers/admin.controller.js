import { Admin } from '../models/Admin.js';
import { User } from '../models/User.js';

// Obtener todos los admins
export const getAdmins = async (req, res, next) => {
  try {
    const admins = await Admin.find({ deleted_at: null })
      .select('-password')
      .populate('role')
      .sort({ created_at: -1 });

    res.json({
      success: true,
      data: {
        admins,
        total: admins.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Crear admin
export const createAdmin = async (req, res, next) => {
  try {
    const { email, password, first_name, last_name, type = 1, department } = req.body;

    // Verificar si el email ya existe
    const existingAdmin = await Admin.findOne({ email, deleted_at: null });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        error: 'Email already exists',
      });
    }

    // Crear admin
    const admin = await Admin.create({
      email,
      password,
      first_name,
      last_name,
      type,
      department: department || 'general',
      is_active: true,
      is_email_verified: false,
    });

    // No devolver password
    const adminData = admin.toObject();
    delete adminData.password;

    res.status(201).json({
      success: true,
      data: {
        admin: adminData,
      },
      message: 'Admin created successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Actualizar admin
export const updateAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // No permitir actualizar password directamente
    delete updates.password;
    delete updates.deleted_at;

    const admin = await Admin.findByIdAndUpdate(
      id,
      { ...updates, updated_at: new Date() },
      { new: true, runValidators: true }
    ).select('-password');

    if (!admin) {
      return res.status(404).json({
        success: false,
        error: 'Admin not found',
      });
    }

    res.json({
      success: true,
      data: {
        admin,
      },
      message: 'Admin updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Eliminar admin (soft delete)
export const deleteAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;

    const admin = await Admin.findByIdAndUpdate(
      id,
      { deleted_at: new Date() },
      { new: true }
    );

    if (!admin) {
      return res.status(404).json({
        success: false,
        error: 'Admin not found',
      });
    }

    res.json({
      success: true,
      message: 'Admin deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Upgrade a Super Admin
export const upgradeToSuperAdmin = async (req, res, next) => {
  try {
    const { admin_email } = req.body;

    if (!admin_email) {
      return res.status(400).json({
        success: false,
        error: 'Admin email is required',
      });
    }

    // Buscar admin por email
    const admin = await Admin.findOne({ email: admin_email, deleted_at: null });
    
    if (!admin) {
      return res.status(404).json({
        success: false,
        error: 'Admin not found',
      });
    }

    // Actualizar a Super Admin (type 1)
    admin.type = 1;
    await admin.save();

    res.json({
      success: true,
      data: {
        admin: {
          email: admin.email,
          type: admin.type,
          full_name: admin.full_name,
        },
      },
      message: 'Admin upgraded to Super Admin successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Sincronizar admin desde Google
export const syncAdminUser = async (req, res, next) => {
  try {
    const { admin_email, make_super_admin = false } = req.body;

    if (!admin_email) {
      return res.status(400).json({
        success: false,
        error: 'Admin email is required',
      });
    }

    // Buscar o crear admin
    let admin = await Admin.findOne({ email: admin_email, deleted_at: null });

    if (!admin) {
      // Crear nuevo admin
      admin = await Admin.create({
        email: admin_email,
        password: Math.random().toString(36).slice(-8), // Temporal
        type: make_super_admin ? 1 : 0,
        is_active: true,
        login_by: 'google',
      });
    } else {
      // Actualizar existente
      if (make_super_admin) {
        admin.type = 1;
        await admin.save();
      }
    }

    res.json({
      success: true,
      data: {
        admin: {
          email: admin.email,
          type: admin.type,
          admin_role: admin.type === 1 ? 'super_admin' : 'admin',
        },
        temp_password: 'Please reset password',
      },
      message: 'Admin synced successfully',
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  upgradeToSuperAdmin,
  syncAdminUser,
};
