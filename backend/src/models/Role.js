import mongoose from 'mongoose';

const permissionSchema = new mongoose.Schema({
  resource: {
    type: String,
    required: true,
    enum: [
      'dashboard', 'users', 'providers', 'trips', 'payments',
      'settings', 'reports', 'notifications', 'promo_codes',
      'reviews', 'support_tickets', 'tasks', 'analytics',
      'countries', 'cities', 'vehicles', 'documents',
    ],
  },
  actions: [{
    type: String,
    enum: ['create', 'read', 'update', 'delete', 'export', 'approve'],
  }],
});

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  display_name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  level: {
    type: Number,
    required: true,
    default: 1,
    min: 1,
    max: 100,
  },
  permissions: [permissionSchema],
  is_system_role: {
    type: Boolean,
    default: false,
  },
  is_active: {
    type: Boolean,
    default: true,
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'admin',
  },
  updated_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'admin',
  },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
});

// Índices
roleSchema.index({ name: 1 });
roleSchema.index({ level: 1 });
roleSchema.index({ is_active: 1 });

// Métodos de instancia
roleSchema.methods.hasPermission = function(resource, action) {
  const permission = this.permissions.find(p => p.resource === resource);
  return permission && permission.actions.includes(action);
};

roleSchema.methods.canAccessResource = function(resource) {
  return this.permissions.some(p => p.resource === resource);
};

// Métodos estáticos
roleSchema.statics.getSystemRoles = function() {
  return this.find({ is_system_role: true, is_active: true });
};

roleSchema.statics.getRoleByName = function(name) {
  return this.findOne({ name, is_active: true });
};

export const Role = mongoose.model('Role', roleSchema);
export default Role;
