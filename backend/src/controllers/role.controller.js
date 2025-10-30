import { Role } from '../models/Role.js';

// Seed default roles
export const seedRoles = async (req, res, next) => {
  try {
    const defaultRoles = [
      {
        name: 'super_admin',
        display_name: 'Super Admin',
        description: 'Full access to ALL resources and actions',
        level: 100,
        is_system_role: true,
        permissions: [
          { resource: 'dashboard', actions: ['create', 'read', 'update', 'delete', 'export', 'approve'] },
          { resource: 'users', actions: ['create', 'read', 'update', 'delete', 'export', 'approve'] },
          { resource: 'providers', actions: ['create', 'read', 'update', 'delete', 'export', 'approve'] },
          { resource: 'trips', actions: ['create', 'read', 'update', 'delete', 'export', 'approve'] },
          { resource: 'payments', actions: ['create', 'read', 'update', 'delete', 'export', 'approve'] },
          { resource: 'settings', actions: ['create', 'read', 'update', 'delete', 'export', 'approve'] },
          { resource: 'reports', actions: ['create', 'read', 'update', 'delete', 'export', 'approve'] },
          { resource: 'notifications', actions: ['create', 'read', 'update', 'delete', 'export', 'approve'] },
          { resource: 'promo_codes', actions: ['create', 'read', 'update', 'delete', 'export', 'approve'] },
          { resource: 'reviews', actions: ['create', 'read', 'update', 'delete', 'export', 'approve'] },
          { resource: 'support_tickets', actions: ['create', 'read', 'update', 'delete', 'export', 'approve'] },
          { resource: 'analytics', actions: ['create', 'read', 'update', 'delete', 'export', 'approve'] },
        ],
      },
      {
        name: 'administrator',
        display_name: 'Administrator',
        description: 'General administrative access',
        level: 80,
        is_system_role: true,
        permissions: [
          { resource: 'dashboard', actions: ['read'] },
          { resource: 'users', actions: ['read', 'update'] },
          { resource: 'providers', actions: ['read', 'update', 'approve'] },
          { resource: 'trips', actions: ['read', 'update'] },
          { resource: 'payments', actions: ['read'] },
          { resource: 'reports', actions: ['read', 'export'] },
        ],
      },
      {
        name: 'operations_manager',
        display_name: 'Operations Manager',
        description: 'Daily operations management',
        level: 70,
        is_system_role: true,
        permissions: [
          { resource: 'dashboard', actions: ['read'] },
          { resource: 'trips', actions: ['read', 'update'] },
          { resource: 'providers', actions: ['read', 'update'] },
          { resource: 'users', actions: ['read'] },
        ],
      },
      {
        name: 'support_manager',
        display_name: 'Support Manager',
        description: 'Customer support and tickets',
        level: 60,
        is_system_role: true,
        permissions: [
          { resource: 'support_tickets', actions: ['read', 'update', 'delete'] },
          { resource: 'users', actions: ['read'] },
          { resource: 'providers', actions: ['read'] },
        ],
      },
    ];

    let created = 0;
    let updated = 0;

    for (const roleData of defaultRoles) {
      const existing = await Role.findOne({ name: roleData.name });
      
      if (existing) {
        // Actualizar permisos si es necesario
        existing.permissions = roleData.permissions;
        existing.description = roleData.description;
        await existing.save();
        updated++;
      } else {
        await Role.create(roleData);
        created++;
      }
    }

    res.json({
      success: true,
      message: `Roles initialized: ${created} created, ${updated} updated`,
      data: {
        created,
        updated,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get all roles
export const getRoles = async (req, res, next) => {
  try {
    const roles = await Role.find({ is_active: true }).sort({ level: -1 });

    res.json({
      success: true,
      data: {
        roles,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Update role
export const updateRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const role = await Role.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!role) {
      return res.status(404).json({
        success: false,
        error: 'Role not found',
      });
    }

    res.json({
      success: true,
      data: {
        role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export default {
  seedRoles,
  getRoles,
  updateRole,
};
