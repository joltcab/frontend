import mongoose from 'mongoose';

const providerDailyEarningSchema = new mongoose.Schema({
  provider_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'provider',
    required: true,
  },
  date: {
    type: Date,
    required: true,
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
  total_earnings: {
    type: Number,
    default: 0,
  },
  cash_collected: {
    type: Number,
    default: 0,
  },
  online_payment: {
    type: Number,
    default: 0,
  },
  admin_commission: {
    type: Number,
    default: 0,
  },
  net_earnings: {
    type: Number,
    default: 0,
  },
  total_distance: {
    type: Number,
    default: 0,
  },
  total_time: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
});

providerDailyEarningSchema.index({ provider_id: 1, date: -1 });

export const ProviderDailyEarning = mongoose.model('provider_daily_earning', providerDailyEarningSchema);
export default ProviderDailyEarning;
