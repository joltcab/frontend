import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const partnerSchema = new mongoose.Schema({
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
  company_name: {
    type: String,
    default: '',
  },
  company_address: {
    type: String,
    default: '',
  },
  tax_id: {
    type: String,
    default: '',
  },
  country_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Country',
  },
  city_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'City',
  },
  wallet: {
    type: Number,
    default: 0,
  },
  commission_rate: {
    type: Number,
    default: 20, // Percentage
  },
  is_approved: {
    type: Boolean,
    default: false,
  },
  is_active: {
    type: Boolean,
    default: true,
  },
  total_providers: {
    type: Number,
    default: 0,
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

// Índices
partnerSchema.index({ email: 1 });
partnerSchema.index({ is_approved: 1, is_active: 1 });

// Encriptar password
partnerSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

partnerSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export const Partner = mongoose.model('partner', partnerSchema);
export default Partner;
