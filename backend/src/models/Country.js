import mongoose from 'mongoose';

const countrySchema = new mongoose.Schema({
  countryname: {
    type: String,
    required: [true, 'Country name is required'],
    trim: true,
  },
  countrycode: {
    type: String,
    required: [true, 'Country code is required'],
    uppercase: true,
  },
  alpha2: {
    type: String,
    default: '',
    uppercase: true,
  },
  
  // Currency
  currency: {
    type: String,
    default: 'USD',
  },
  currencycode: {
    type: String,
    default: 'USD',
  },
  currencysign: {
    type: String,
    default: '$',
  },
  
  // Contact
  countryphonecode: {
    type: String,
    default: '+1',
  },
  phone_number_min_length: {
    type: Number,
    default: 8,
  },
  phone_number_length: {
    type: Number,
    default: 10,
  },
  
  // Timezone
  countrytimezone: {
    type: String,
    default: '',
  },
  country_all_timezone: {
    type: Array,
    default: [],
  },
  
  // Visual
  flag_url: {
    type: String,
    default: '',
  },
  
  // Business
  isBusiness: {
    type: Boolean,
    default: true,
  },
  default_selected: {
    type: Boolean,
    default: false,
  },
  
  // Referral System - Users
  is_referral: {
    type: Boolean,
    default: true,
  },
  userreferral: {
    type: Number,
    default: 0,
  },
  referral_bonus_to_user: {
    type: Number,
    default: 0,
  },
  bonus_to_userreferral: {
    type: Number,
    default: 0,
  },
  
  // Referral System - Providers
  is_provider_referral: {
    type: Boolean,
    default: true,
  },
  providerreferral: {
    type: Number,
    default: 0,
  },
  referral_bonus_to_provider: {
    type: Number,
    default: 0,
  },
  bonus_to_providerreferral: {
    type: Number,
    default: 0,
  },
  
  // Auto Transfer
  is_auto_transfer: {
    type: Boolean,
    default: true,
  },
  auto_transfer_day: {
    type: Number,
    default: 7,
  },
  
  // Cron
  daily_cron_date: {
    type: Date,
  },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
});

// Índices
countrySchema.index({ countryname: 1, isBusiness: 1 });
countrySchema.index({ countrycode: 1 });
countrySchema.index({ alpha2: 1 });

export const Country = mongoose.model('country', countrySchema);
export default Country;
