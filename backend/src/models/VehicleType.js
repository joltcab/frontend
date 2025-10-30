import mongoose from 'mongoose';

const vehicleTypeSchema = new mongoose.Schema({
  unique_id: {
    type: Number,
    unique: true,
  },
  vehicle_name: {
    type: String,
    required: true,
  },
  vehicle_image: {
    type: String,
    default: '',
  },
  base_fare: {
    type: Number,
    required: true,
    default: 0,
  },
  per_km_charge: {
    type: Number,
    required: true,
    default: 0,
  },
  per_minute_charge: {
    type: Number,
    default: 0,
  },
  minimum_fare: {
    type: Number,
    default: 0,
  },
  cancellation_fee: {
    type: Number,
    default: 0,
  },
  capacity: {
    type: Number,
    default: 4,
  },
  description: {
    type: String,
    default: '',
  },
  is_active: {
    type: Boolean,
    default: true,
  },
  sort_order: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
});

vehicleTypeSchema.index({ is_active: 1, sort_order: 1 });

export const VehicleType = mongoose.model('vehicle_type', vehicleTypeSchema);
export default VehicleType;
