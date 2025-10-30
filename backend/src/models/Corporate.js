import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const corporateSchema = new mongoose.Schema({
  unique_id: {
    type: Number,
    unique: true,
  },
  company_name: {
    type: String,
    required: true,
    trim: true,
  },
  contact_person: {
    type: String,
    required: true,
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
  address: {
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
  wallet: {
    type: Number,
    default: 0,
  },
  credit_limit: {
    type: Number,
    default: 0,
  },
  discount_rate: {
    type: Number,
    default: 0,
  },
  employees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  }],
  is_approved: {
    type: Boolean,
    default: false,
  },
  is_active: {
    type: Boolean,
    default: true,
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

corporateSchema.index({ email: 1 });
corporateSchema.index({ is_approved: 1, is_active: 1 });

corporateSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

corporateSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export const Corporate = mongoose.model('corporate', corporateSchema);
export default Corporate;
