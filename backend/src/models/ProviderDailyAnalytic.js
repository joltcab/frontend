import mongoose from 'mongoose';

const providerDailyAnalyticSchema = new mongoose.Schema({
  provider_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'provider',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  total_online_time: {
    type: Number,
    default: 0, // in minutes
  },
  total_trips: {
    type: Number,
    default: 0,
  },
  completed_trips: {
    type: Number,
    default: 0,
  },
  cancelled_trips: {
    type: Number,
    default: 0,
  },
  rejected_trips: {
    type: Number,
    default: 0,
  },
  total_distance: {
    type: Number,
    default: 0,
  },
  total_earnings: {
    type: Number,
    default: 0,
  },
  average_rating: {
    type: Number,
    default: 0,
  },
  acceptance_rate: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
});

providerDailyAnalyticSchema.index({ provider_id: 1, date: -1 });

export const ProviderDailyAnalytic = mongoose.model('provider_daily_analytic', providerDailyAnalyticSchema);
export default ProviderDailyAnalytic;
