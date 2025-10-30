import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  unique_id: {
    type: Number,
    unique: true,
  },
  user_type: {
    type: Number,
    default: 7, // 1 = admin, 2 = driver, 3 = dispatcher, 4 = corporate, 5 = hotel, 7 = user
  },
  user_type_id: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
  },
  first_name: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
  },
  last_name: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
  },
  country_phone_code: {
    type: String,
    default: '+1',
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false, // No incluir password en queries por defecto
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other', ''],
    default: '',
  },
  picture: {
    type: String,
    default: '',
  },
  device_token: {
    type: String,
    default: '',
  },
  device_type: {
    type: String,
    enum: ['ios', 'android', 'web', ''],
    default: '',
  },
  bio: {
    type: String,
    default: '',
  },
  address: {
    type: String,
    default: '',
  },
  city: {
    type: String,
    default: '',
  },
  country: {
    type: String,
    default: '',
  },
  zipcode: {
    type: String,
    default: '',
  },
  home_address: {
    type: String,
    default: '',
  },
  work_address: {
    type: String,
    default: '',
  },
  home_location: {
    type: [Number], // [longitude, latitude]
    default: undefined,
  },
  work_location: {
    type: [Number], // [longitude, latitude]
    default: undefined,
  },
  wallet: {
    type: Number,
    default: 0,
  },
  wallet_currency_code: {
    type: String,
    default: 'USD',
  },
  is_use_wallet: {
    type: Boolean,
    default: false,
  },
  is_approved: {
    type: Boolean,
    default: true,
  },
  is_document_uploaded: {
    type: Boolean,
    default: false,
  },
  social_unique_id: {
    type: String,
    default: '',
  },
  social_ids: [{
    type: String,
    default: '',
  }],
  login_by: {
    type: String,
    enum: ['manual', 'google', 'facebook', 'apple', ''],
    default: 'manual',
  },
  referral_code: {
    type: String,
    unique: true,
    sparse: true,
  },
  referred_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  is_referral: {
    type: Boolean,
    default: false,
  },
  total_referrals: {
    type: Number,
    default: 0,
  },
  refferal_credit: {
    type: Number,
    default: 0,
  },
  total_request: {
    type: Number,
    default: 0,
  },
  completed_request: {
    type: Number,
    default: 0,
  },
  cancelled_request: {
    type: Number,
    default: 0,
  },
  rate: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  rate_count: {
    type: Number,
    default: 0,
  },
  promo_count: {
    type: Number,
    default: 0,
  },
  favourite_providers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Provider',
  }],
  corporate_ids: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Corporate',
  }],
  current_trip_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip',
    default: null,
  },
  device_timezone: {
    type: String,
    default: '',
  },
  app_version: {
    type: String,
    default: '',
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

// Índices para optimizar búsquedas
userSchema.index({ email: 1, is_approved: 1 });
userSchema.index({ phone: 1, is_approved: 1 });
userSchema.index({ country: 1, is_approved: 1 });
userSchema.index({ referral_code: 1 });
userSchema.index({ social_unique_id: 1 });

// Encriptar password antes de guardar
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Método para comparar passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Método para obtener datos públicos del usuario
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  delete user.token;
  return user;
};

export const User = mongoose.model('user', userSchema);
export default User;
