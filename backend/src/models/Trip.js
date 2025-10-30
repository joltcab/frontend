import mongoose from 'mongoose';

const tripSchema = new mongoose.Schema({
  unique_id: {
    type: Number,
    unique: true,
  },
  invoice_number: {
    type: String,
    default: '',
  },
  
  // Service and Type
  service_type_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Type',
  },
  trip_service_city_type_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CityType',
  },
  trip_type: {
    type: Number,
    default: 0, // 0 = normal, 1 = scheduled, 2 = car rental
  },
  car_rental_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CarRental',
  },
  
  // User Information
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  user_type: {
    type: Number,
    default: 7,
  },
  user_type_id: {
    type: mongoose.Schema.Types.ObjectId,
  },
  user_first_name: {
    type: String,
    default: '',
  },
  user_last_name: {
    type: String,
    default: '',
  },
  
  // Provider Information
  provider_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'provider',
  },
  confirmed_provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'provider',
  },
  current_provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'provider',
  },
  current_providers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'provider',
  }],
  providers_id_that_rejected_trip: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'provider',
  }],
  provider_type: {
    type: Number,
    default: 0,
  },
  provider_type_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Partner',
  },
  provider_first_name: {
    type: String,
    default: '',
  },
  provider_last_name: {
    type: String,
    default: '',
  },
  
  // Preferences
  provider_language: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Language',
  }],
  received_trip_from_gender: [{
    type: String,
  }],
  accessibility: [{
    type: String,
  }],
  is_favourite_provider: {
    type: Boolean,
    default: false,
  },
  
  // Location Information
  source_address: {
    type: String,
    default: '',
  },
  destination_address: {
    type: String,
    default: '',
  },
  sourceLocation: {
    type: [Number], // [longitude, latitude]
    index: '2d',
  },
  destinationLocation: {
    type: [Number],
    index: '2d',
  },
  providerLocation: {
    type: [Number],
    index: '2d',
  },
  providerPreviousLocation: {
    type: [Number],
    index: '2d',
  },
  
  // Hotel/Corporate specific
  room_number: {
    type: String,
    default: '',
  },
  floor: {
    type: Number,
    default: 0,
  },
  
  // Trip Status
  is_provider_accepted: {
    type: Boolean,
    default: false,
  },
  is_provider_status: {
    type: Number,
    default: 0, // 0=searching, 1=accepted, 2=arrived, 3=started, 4=completed
  },
  is_trip_end: {
    type: Boolean,
    default: false,
  },
  is_trip_completed: {
    type: Boolean,
    default: false,
  },
  is_trip_cancelled: {
    type: Boolean,
    default: false,
  },
  is_trip_cancelled_by_user: {
    type: Boolean,
    default: false,
  },
  is_trip_cancelled_by_provider: {
    type: Boolean,
    default: false,
  },
  cancel_reason: {
    type: String,
    default: '',
  },
  
  // Schedule
  is_schedule_trip: {
    type: Boolean,
    default: false,
  },
  schedule_start_time: {
    type: Date,
  },
  server_start_time_for_schedule: {
    type: Date,
    default: Date.now,
  },
  
  // Queue System
  is_trip_inside_zone_queue: {
    type: Boolean,
    default: false,
  },
  
  // Distance and Time
  total_distance: {
    type: Number,
    default: 0,
  },
  total_time: {
    type: Number,
    default: 0,
  },
  total_waiting_time: {
    type: Number,
    default: 0,
  },
  provider_to_user_estimated_distance: {
    type: Number,
  },
  provider_to_user_estimated_time: {
    type: Number,
  },
  speed: {
    type: Number,
    default: 0,
  },
  bearing: {
    type: Number,
    default: 0,
  },
  
  // Pricing
  currency: {
    type: String,
    default: 'USD',
  },
  currencycode: {
    type: String,
    default: 'USD',
  },
  admin_currency: {
    type: String,
    default: 'USD',
  },
  admin_currencycode: {
    type: String,
    default: 'USD',
  },
  unit: {
    type: Number,
    default: 0, // 0=km, 1=miles
  },
  
  // Fare Breakdown
  is_fixed_fare: {
    type: Boolean,
    default: false,
  },
  fixed_price: {
    type: Number,
    default: 0,
  },
  is_min_fare_used: {
    type: Boolean,
    default: false,
  },
  base_distance_cost: {
    type: Number,
    default: 0,
  },
  distance_cost: {
    type: Number,
    default: 0,
  },
  time_cost: {
    type: Number,
    default: 0,
  },
  waiting_time_cost: {
    type: Number,
    default: 0,
  },
  trip_type_amount: {
    type: Number,
    default: 0,
  },
  
  // Fees
  total_service_fees: {
    type: Number,
    default: 0,
  },
  tax_fee: {
    type: Number,
    default: 0,
  },
  user_tax_fee: {
    type: Number,
    default: 0,
  },
  provider_tax_fee: {
    type: Number,
    default: 0,
  },
  user_miscellaneous_fee: {
    type: Number,
    default: 0,
  },
  provider_miscellaneous_fee: {
    type: Number,
    default: 0,
  },
  total_after_tax_fees: {
    type: Number,
    default: 0,
  },
  
  // Surge Pricing
  is_surge_hours: {
    type: Boolean,
    default: false,
  },
  surge_multiplier: {
    type: Number,
    default: 0,
  },
  surge_fee: {
    type: Number,
    default: 0,
  },
  total_after_surge_fees: {
    type: Number,
    default: 0,
  },
  
  // Promo and Referral
  promo_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PromoCode',
  },
  promo_payment: {
    type: Number,
    default: 0,
  },
  total_after_promo_payment: {
    type: Number,
    default: 0,
  },
  referral_payment: {
    type: Number,
    default: 0,
  },
  total_after_referral_payment: {
    type: Number,
    default: 0,
  },
  promo_referral_amount: {
    type: Number,
    default: 0,
  },
  
  // Tips and Tolls
  is_tip: {
    type: Boolean,
    default: false,
  },
  tip_amount: {
    type: Number,
    default: 0,
  },
  is_toll: {
    type: Boolean,
    default: false,
  },
  toll_amount: {
    type: Number,
    default: 0,
  },
  
  // Cancellation
  is_cancellation_fee: {
    type: Boolean,
    default: false,
  },
  
  // Total
  total: {
    type: Number,
    default: 0,
  },
  
  // Payment
  payment_mode: {
    type: Number,
    default: 0, // 0=cash, 1=card, 2=wallet
  },
  payment_id: {
    type: Number,
  },
  is_paid: {
    type: Boolean,
    default: false,
  },
  is_pending_payments: {
    type: Boolean,
    default: false,
  },
  cash_payment: {
    type: Number,
    default: 0,
  },
  card_payment: {
    type: Number,
    default: 0,
  },
  wallet_payment: {
    type: Number,
    default: 0,
  },
  total_after_wallet_payment: {
    type: Number,
    default: 0,
  },
  remaining_payment: {
    type: Number,
    default: 0,
  },
  payment_error: {
    type: String,
    default: '',
  },
  payment_error_message: {
    type: String,
    default: '',
  },
  payment_transaction: {
    type: Array,
    default: [],
  },
  
  // Refund
  refund_amount: {
    type: Number,
    default: 0,
  },
  is_amount_refund: {
    type: Boolean,
    default: false,
  },
  
  // Provider Earnings
  provider_service_fees: {
    type: Number,
    default: 0,
  },
  provider_have_cash: {
    type: Number,
    default: 0,
  },
  pay_to_provider: {
    type: Number,
    default: 0,
  },
  provider_income_set_in_wallet: {
    type: Number,
    default: 0,
  },
  is_provider_earning_set_in_wallet: {
    type: Boolean,
    default: false,
  },
  is_transfered: {
    type: Boolean,
    default: false,
  },
  
  // Currency Conversion
  current_rate: {
    type: Number,
  },
  wallet_current_rate: {
    type: Number,
  },
  total_in_admin_currency: {
    type: Number,
    default: 0,
  },
  service_total_in_admin_currency: {
    type: Number,
    default: 0,
  },
  provider_service_fees_in_admin_currency: {
    type: Number,
    default: 0,
  },
  
  // Ratings
  is_user_rated: {
    type: Boolean,
    default: false,
  },
  is_provider_rated: {
    type: Boolean,
    default: false,
  },
  
  // Invoice
  is_user_invoice_show: {
    type: Boolean,
    default: false,
  },
  is_provider_invoice_show: {
    type: Boolean,
    default: false,
  },
  
  // Location
  city_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'City',
  },
  country_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Country',
  },
  timezone: {
    type: String,
    default: '',
  },
  
  // Completion Date
  complete_date_tag: {
    type: String,
    default: '',
  },
  complete_date_in_city_timezone: {
    type: Date,
  },
  
  // Request Management
  find_nearest_provider_time: {
    type: Date,
  },
  no_of_time_send_request: {
    type: Number,
    default: 0,
  },
  
  // Timestamps
  user_create_time: {
    type: Date,
    default: Date.now,
  },
  accepted_time: {
    type: Date,
  },
  provider_arrived_time: {
    type: Date,
  },
  provider_trip_start_time: {
    type: Date,
  },
  provider_trip_end_time: {
    type: Date,
  },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
});

// Índices para optimizar búsquedas
tripSchema.index({ user_id: 1, is_trip_cancelled: 1, is_trip_completed: 1 });
tripSchema.index({ user_id: 1, is_pending_payments: 1 });
tripSchema.index({ is_provider_status: 1, is_trip_cancelled: 1 });
tripSchema.index({ is_provider_status: 1, current_provider: 1 });
tripSchema.index({ confirmed_provider: 1, is_trip_cancelled_by_provider: 1, provider_trip_end_time: 1 });
tripSchema.index({ service_type_id: 1, is_trip_completed: 1, created_at: 1 });
tripSchema.index({ user_id: 1, is_trip_cancelled: 1, is_trip_cancelled_by_provider: 1, is_user_invoice_show: 1 });

// Índices para agregaciones
tripSchema.index({ country_id: 1, city_id: 1, is_trip_completed: 1, is_trip_cancelled_by_user: 1, provider_type: 1 });
tripSchema.index({ provider_type_id: 1, complete_date_in_city_timezone: 1, is_trip_completed: 1, is_trip_cancelled_by_user: 1 });
tripSchema.index({ is_schedule_trip: 1, is_trip_cancelled: 1, is_trip_completed: 1, is_trip_end: 1, current_provider: 1, user_type_id: 1 });
tripSchema.index({ user_type_id: 1, is_trip_cancelled: 1, is_trip_completed: 1, is_provider_accepted: 1, is_provider_status: 1 });
tripSchema.index({ provider_id: 1, provider_trip_end_time: 1, is_trip_completed: 1, is_trip_cancelled: 1, is_trip_cancelled_by_provider: 1 });
tripSchema.index({ provider_type_id: 1, created_at: 1 });
tripSchema.index({ promo_id: 1 });
tripSchema.index({ confirmed_provider: 1, is_trip_completed: 1, provider_trip_end_time: 1 });
tripSchema.index({ payment_mode: 1, is_trip_completed: 1, is_trip_cancelled: 1, created_at: 1 });
tripSchema.index({ is_trip_cancelled_by_user: 1, is_trip_completed: 1, is_trip_cancelled: 1, user_id: 1, provider_trip_end_time: 1 });
tripSchema.index({ confirmed_provider: 1, is_trip_completed: 1, is_transfered: 1, is_provider_earning_set_in_wallet: 1 });
tripSchema.index({ provider_type_id: 1, is_trip_completed: 1, is_transfered: 1, is_provider_earning_set_in_wallet: 1 });

export const Trip = mongoose.model('trip', tripSchema);
export default Trip;
