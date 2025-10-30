import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const providerSchema = new mongoose.Schema({
  unique_id: {
    type: Number,
    unique: true,
  },
  provider_type: {
    type: Number,
    default: 0, // 0 = individual, 1 = partner
  },
  provider_type_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Partner',
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
    select: false,
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
  app_version: {
    type: String,
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
  cityid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'City',
  },
  country: {
    type: String,
    default: '',
  },
  country_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Country',
  },
  zipcode: {
    type: String,
    default: '',
  },
  
  // Vehicle Information
  service_type: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Type',
  },
  car_model: {
    type: String,
    default: '',
  },
  car_number: {
    type: String,
    default: '',
  },
  vehicle_detail: {
    type: Array,
    default: [],
  },
  
  // Location
  providerLocation: {
    type: [Number], // [longitude, latitude]
    index: '2d',
  },
  providerPreviousLocation: {
    type: [Number],
    index: '2d',
  },
  bearing: {
    type: Number,
    default: 0,
  },
  location_updated_time: {
    type: Date,
    default: Date.now,
  },
  
  // Status
  is_available: {
    type: Boolean,
    default: false,
  },
  is_active: {
    type: Boolean,
    default: false,
  },
  is_approved: {
    type: Boolean,
    default: false,
  },
  is_partner_approved_by_admin: {
    type: Boolean,
    default: false,
  },
  is_document_uploaded: {
    type: Boolean,
    default: false,
  },
  is_vehicle_document_uploaded: {
    type: Boolean,
    default: false,
  },
  is_documents_expired: {
    type: Boolean,
    default: false,
  },
  
  // Trip Management
  is_trip: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip',
  }],
  
  // Statistics
  total_request: {
    type: Number,
    default: 0,
  },
  accepted_request: {
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
  rejected_request: {
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
  
  // Wallet
  wallet: {
    type: Number,
    default: 0,
  },
  wallet_currency_code: {
    type: String,
    default: 'USD',
  },
  
  // Banking
  account_id: {
    type: String,
    default: '',
  },
  bank_id: {
    type: String,
    default: '',
  },
  
  // Referral System
  referral_code: {
    type: String,
    unique: true,
    sparse: true,
  },
  referred_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Provider',
    default: null,
  },
  is_referral: {
    type: Boolean,
    default: true,
  },
  total_referrals: {
    type: Number,
    default: 0,
  },
  
  // Social Login
  social_unique_id: {
    type: String,
    default: '',
  },
  login_by: {
    type: String,
    enum: ['manual', 'google', 'facebook', 'apple', ''],
    default: 'manual',
  },
  
  // Preferences
  languages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Language',
  }],
  received_trip_from_gender: [{
    type: String,
    enum: ['male', 'female', 'other'],
  }],
  is_use_google_distance: {
    type: Boolean,
    default: false,
  },
  
  // Zone Queue System
  in_zone_queue: {
    type: Boolean,
    default: false,
  },
  zone_queue_no: {
    type: Number,
    default: Number.MAX_SAFE_INTEGER,
  },
  zone_queue_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ZoneQueue',
  },
  
  // Admin Assignment
  admintypeid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
  },
  
  // Timing
  start_online_time: {
    type: Date,
  },
  last_transferred_date: {
    type: Date,
    default: Date.now,
  },
  
  // Device
  device_unique_code: {
    type: String,
    default: '',
  },
  device_timezone: {
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
providerSchema.index({ country: 1, service_type: 1, provider_type: 1, is_approved: 1, is_partner_approved_by_admin: 1 });
providerSchema.index({ device_type: 1, unique_id: 1, device_token: 1 });
providerSchema.index({ country: 1 });
providerSchema.index({ email: 1 });
providerSchema.index({ provider_type_id: 1 });
providerSchema.index({ is_approved: 1, cityid: 1 });
providerSchema.index({ is_active: 1, is_trip: 1 });
providerSchema.index({ social_unique_id: 1 });
providerSchema.index({ phone: 1, country_phone_code: 1 });
providerSchema.index({ providerLocation: 1, is_active: 1, is_available: 1, is_vehicle_document_uploaded: 1 });

// Encriptar password antes de guardar
providerSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Método para comparar passwords
providerSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Método para obtener datos públicos del conductor
providerSchema.methods.toJSON = function() {
  const provider = this.toObject();
  delete provider.password;
  delete provider.token;
  return provider;
};

export const Provider = mongoose.model('provider', providerSchema);
export default Provider;
