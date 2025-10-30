import mongoose from 'mongoose';

const cityTypeSchema = new mongoose.Schema({
  unique_id: {
    type: Number,
    unique: true,
  },
  city_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'City',
    required: true,
  },
  type_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Type',
    required: true,
  },
  // Pricing
  base_fare: {
    type: Number,
    default: 0,
  },
  min_fare: {
    type: Number,
    default: 0,
  },
  per_km_charge: {
    type: Number,
    default: 0,
  },
  per_minute_charge: {
    type: Number,
    default: 0,
  },
  waiting_charge_per_minute: {
    type: Number,
    default: 0,
  },
  cancellation_fee: {
    type: Number,
    default: 0,
  },
  // Commission
  admin_commission_type: {
    type: Number,
    default: 0, // 0=percentage, 1=fixed
  },
  admin_commission: {
    type: Number,
    default: 20,
  },
  // Surge
  surge_multiplier: {
    type: Number,
    default: 1,
  },
  // Status
  is_business: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
});

cityTypeSchema.index({ city_id: 1, type_id: 1 });
cityTypeSchema.index({ is_business: 1 });

export const CityType = mongoose.model('citytype', cityTypeSchema);
export default CityType;
