import mongoose from 'mongoose';

const tripLocationSchema = new mongoose.Schema({
  trip_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'trip',
    required: true,
  },
  provider_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'provider',
    required: true,
  },
  location: {
    type: [Number], // [longitude, latitude]
    required: true,
    index: '2d',
  },
  bearing: {
    type: Number,
    default: 0,
  },
  speed: {
    type: Number,
    default: 0,
  },
  accuracy: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
});

tripLocationSchema.index({ trip_id: 1, created_at: 1 });
tripLocationSchema.index({ provider_id: 1 });

export const TripLocation = mongoose.model('trip_location', tripLocationSchema);
export default TripLocation;
