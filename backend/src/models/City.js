import mongoose from 'mongoose';

const citySchema = new mongoose.Schema({
  countryid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Country',
    required: true,
  },
  countryname: {
    type: String,
    default: '',
  },
  cityname: {
    type: String,
    required: [true, 'City name is required'],
    trim: true,
  },
  full_cityname: {
    type: String,
    default: '',
  },
  citycode: {
    type: String,
    default: '',
  },
  timezone: {
    type: String,
    default: '',
  },
  
  // Location
  cityLatLong: {
    type: [Number], // [longitude, latitude]
    index: '2d',
  },
  cityRadius: {
    type: Number,
    default: 50, // km
  },
  is_use_city_boundary: {
    type: Boolean,
    default: false,
  },
  city_locations: {
    type: Array,
    default: [],
  },
  
  // Business Settings
  isBusiness: {
    type: Boolean,
    default: true,
  },
  isCountryBusiness: {
    type: Boolean,
    default: true,
  },
  airport_business: {
    type: Boolean,
    default: true,
  },
  city_business: {
    type: Boolean,
    default: true,
  },
  zone_business: {
    type: Boolean,
    default: true,
  },
  
  // Payment Settings
  payment_gateway: {
    type: [Number],
    default: [],
  },
  unit: {
    type: Number,
    default: 1, // 0=km, 1=miles
  },
  is_payment_mode_cash: {
    type: Boolean,
    default: true,
  },
  is_payment_mode_card: {
    type: Boolean,
    default: true,
  },
  isPromoApplyForCash: {
    type: Boolean,
    default: true,
  },
  isPromoApplyForCard: {
    type: Boolean,
    default: true,
  },
  
  // Fare Settings
  is_ask_user_for_fixed_fare: {
    type: Boolean,
    default: false,
  },
  
  // Provider Wallet Settings
  provider_min_wallet_amount_set_for_received_cash_request: {
    type: Number,
    default: 0,
  },
  is_check_provider_wallet_amount_for_received_cash_request: {
    type: Boolean,
    default: false,
  },
  is_provider_earning_set_in_wallet_on_cash_payment: {
    type: Boolean,
    default: false,
  },
  is_provider_earning_set_in_wallet_on_other_payment: {
    type: Boolean,
    default: false,
  },
  
  // Destination Cities
  destination_city: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'City',
  }],
  
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
citySchema.index({ countryid: 1, isBusiness: 1 });
citySchema.index({ countryname: 1, isBusiness: 1 });
citySchema.index({ cityname: 1 });
citySchema.index({ created_at: 1, cityname: 1 });
citySchema.index({ countryid: 1 });

export const City = mongoose.model('city', citySchema);
export default City;
