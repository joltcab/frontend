import mongoose from 'mongoose';

const tripOfferSchema = new mongoose.Schema({
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
  offered_price: {
    type: Number,
    required: true,
  },
  estimated_time: {
    type: Number,
    default: 0,
  },
  message: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'expired'],
    default: 'pending',
  },
  expires_at: {
    type: Date,
    required: true,
  },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
});

tripOfferSchema.index({ trip_id: 1, status: 1 });
tripOfferSchema.index({ provider_id: 1, created_at: -1 });

export const TripOffer = mongoose.model('trip_offer', tripOfferSchema);
export default TripOffer;
