import mongoose from 'mongoose';

const tripServiceSchema = new mongoose.Schema({
  trip_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'trip',
    required: true,
  },
  service_type_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Type',
    required: true,
  },
  city_type_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'citytype',
  },
  base_fare: {
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
  admin_commission: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
});

tripServiceSchema.index({ trip_id: 1 });

export const TripService = mongoose.model('trip_service', tripServiceSchema);
export default TripService;
