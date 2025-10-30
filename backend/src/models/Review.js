import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  // Trip Information
  trip_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'trip',
    required: true,
  },
  trip_unique_id: {
    type: Number,
  },
  
  // User Information
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  
  // Provider Information
  provider_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'provider',
    required: true,
  },
  
  // User Review (about provider)
  userRating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
    default: 0,
  },
  userReview: {
    type: String,
    default: '',
    maxlength: 1000,
  },
  
  // Provider Review (about user)
  providerRating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
    default: 0,
  },
  providerReview: {
    type: String,
    default: '',
    maxlength: 1000,
  },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
});

// Índices
reviewSchema.index({ trip_id: 1 });
reviewSchema.index({ user_id: 1, created_at: -1 });
reviewSchema.index({ provider_id: 1, created_at: -1 });
reviewSchema.index({ created_at: -1 });

// Método para calcular promedio de rating
reviewSchema.statics.getAverageRating = async function(providerId) {
  const result = await this.aggregate([
    { $match: { provider_id: providerId } },
    {
      $group: {
        _id: null,
        avgRating: { $avg: '$userRating' },
        count: { $sum: 1 },
      },
    },
  ]);
  
  return result.length > 0 ? result[0] : { avgRating: 0, count: 0 };
};

export const Review = mongoose.model('reviews', reviewSchema);
export default Review;
