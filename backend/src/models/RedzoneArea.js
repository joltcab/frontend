import mongoose from 'mongoose';

const redzoneAreaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  city_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'City',
    required: true,
  },
  coordinates: {
    type: Array,
    default: [], // Array of [longitude, latitude] pairs forming a polygon
  },
  is_active: {
    type: Boolean,
    default: true,
  },
  restriction_type: {
    type: String,
    enum: ['no_pickup', 'no_dropoff', 'no_service', 'surge_only'],
    default: 'no_service',
  },
  surge_multiplier: {
    type: Number,
    default: 1,
  },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
});

redzoneAreaSchema.index({ city_id: 1, is_active: 1 });

export const RedzoneArea = mongoose.model('redzone_area', redzoneAreaSchema);
export default RedzoneArea;
