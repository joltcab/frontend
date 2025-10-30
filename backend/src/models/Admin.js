import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const adminSchema = new mongoose.Schema({
  // Basic Info
  username: {
    type: String,
    default: '',
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false,
  },
  
  // Profile
  first_name: {
    type: String,
    default: '',
    trim: true,
  },
  last_name: {
    type: String,
    default: '',
    trim: true,
  },
  phone: {
    type: String,
    default: '',
  },
  avatar: {
    type: String,
    default: '',
  },
  
  // Legacy fields (backward compatibility)
  token: {
    type: String,
    default: '',
  },
  type: {
    type: Number,
    default: 0, // 0 = admin, 1 = super admin
  },
  url_array: {
    type: Array,
    default: [],
  },
  
  // Role-Based Access Control
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
  },
  custom_permissions: [{
    resource: String,
    actions: [String],
  }],
  
  // Security
  is_active: {
    type: Boolean,
    default: true,
  },
  is_email_verified: {
    type: Boolean,
    default: false,
  },
  email_verification_token: {
    type: String,
  },
  password_reset_token: {
    type: String,
  },
  password_reset_expires: {
    type: Date,
  },
  
  // Social Login
  login_by: {
    type: String,
    enum: ['manual', 'google', 'facebook', 'apple'],
    default: 'manual',
  },
  social_unique_id: {
    type: String,
    default: '',
  },
  
  // Two-Factor Authentication
  two_factor_enabled: {
    type: Boolean,
    default: false,
  },
  two_factor_secret: {
    type: String,
  },
  two_factor_backup_codes: [{
    code: String,
    used: {
      type: Boolean,
      default: false,
    },
  }],
  
  // Session Management
  last_login: {
    type: Date,
  },
  last_login_ip: {
    type: String,
  },
  failed_login_attempts: {
    type: Number,
    default: 0,
  },
  account_locked_until: {
    type: Date,
  },
  active_sessions: [{
    token: String,
    device: String,
    ip: String,
    created_at: {
      type: Date,
      default: Date.now,
    },
    last_activity: {
      type: Date,
      default: Date.now,
    },
  }],
  
  // Activity Tracking
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'admin',
  },
  updated_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'admin',
  },
  
  // Metadata
  department: {
    type: String,
    enum: ['support', 'operations', 'technical', 'finance', 'marketing', 'general'],
    default: 'general',
  },
  timezone: {
    type: String,
    default: 'America/New_York',
  },
  language: {
    type: String,
    default: 'en',
  },
  
  // Soft Delete
  deleted_at: {
    type: Date,
  },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Índices
adminSchema.index({ email: 1 }, { unique: true });
adminSchema.index({ role: 1 });
adminSchema.index({ is_active: 1 });
adminSchema.index({ department: 1 });
adminSchema.index({ deleted_at: 1 });

// Virtual para nombre completo
adminSchema.virtual('full_name').get(function() {
  if (this.first_name || this.last_name) {
    return `${this.first_name || ''} ${this.last_name || ''}`.trim();
  }
  return this.username || this.email;
});

// Virtual para verificar si la cuenta está bloqueada
adminSchema.virtual('is_locked').get(function() {
  return this.account_locked_until && this.account_locked_until > new Date();
});

// Encriptar password antes de guardar
adminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Métodos de instancia
adminSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

adminSchema.methods.hasPermission = async function(resource, action) {
  // Super admin tiene todos los permisos
  if (this.type === 1) return true;
  
  // Verificar permisos personalizados
  const customPerm = this.custom_permissions.find(p => p.resource === resource);
  if (customPerm && customPerm.actions.includes(action)) {
    return true;
  }
  
  // Verificar permisos del rol
  if (this.role) {
    await this.populate('role');
    return this.role.hasPermission(resource, action);
  }
  
  return false;
};

adminSchema.methods.recordLogin = function(ip, device) {
  this.last_login = new Date();
  this.last_login_ip = ip;
  this.failed_login_attempts = 0;
  return this.save();
};

adminSchema.methods.recordFailedLogin = async function() {
  this.failed_login_attempts += 1;
  
  // Bloquear cuenta después de 5 intentos fallidos
  if (this.failed_login_attempts >= 5) {
    this.account_locked_until = new Date(Date.now() + 30 * 60 * 1000); // 30 minutos
  }
  
  return this.save();
};

adminSchema.methods.addSession = function(token, device, ip) {
  this.active_sessions.push({
    token,
    device,
    ip,
  });
  return this.save();
};

adminSchema.methods.removeSession = function(token) {
  this.active_sessions = this.active_sessions.filter(s => s.token !== token);
  return this.save();
};

adminSchema.methods.generatePasswordResetToken = function() {
  this.password_reset_token = crypto.randomBytes(32).toString('hex');
  this.password_reset_expires = new Date(Date.now() + 3600000); // 1 hora
  return this.save();
};

// Métodos estáticos
adminSchema.statics.findByEmail = function(email) {
  return this.findOne({ email, deleted_at: null });
};

adminSchema.statics.getActiveAdmins = function() {
  return this.find({ 
    is_active: true, 
    deleted_at: null,
  }).populate('role');
};

adminSchema.statics.getAdminsByRole = function(roleId) {
  return this.find({ 
    role: roleId, 
    is_active: true,
    deleted_at: null,
  });
};

export const Admin = mongoose.model('admin', adminSchema);
export default Admin;
