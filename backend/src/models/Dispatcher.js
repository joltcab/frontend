import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const dispatcherSchema = new mongoose.Schema({
  unique_id: {
    type: Number,
    unique: true,
  },
  first_name: {
    type: String,
    required: true,
    trim: true,
  },
  last_name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  picture: {
    type: String,
    default: '',
  },
  city_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'City',
  },
  country_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Country',
  },
  assigned_providers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'provider',
  }],
  permissions: {
    can_assign_trips: {
      type: Boolean,
      default: true,
    },
    can_cancel_trips: {
      type: Boolean,
      default: true,
    },
    can_view_analytics: {
      type: Boolean,
      default: false,
    },
  },
  is_approved: {
    type: Boolean,
    default: false,
  },
  is_active: {
    type: Boolean,
    default: true,
  },
  is_online: {
    type: Boolean,
    default: false,
  },
  token: {
    type: String,
    default: '',
  },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
});

dispatcherSchema.index({ email: 1 });
dispatcherSchema.index({ is_approved: 1, is_active: 1 });
dispatcherSchema.index({ city_id: 1, is_online: 1 });

dispatcherSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

dispatcherSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export const Dispatcher = mongoose.model('dispatcher', dispatcherSchema);
export default Dispatcher;
