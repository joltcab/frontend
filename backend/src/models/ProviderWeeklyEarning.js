import mongoose from 'mongoose';

const providerWeeklyEarningSchema = new mongoose.Schema({
  provider_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'provider',
    required: true,
  },
  week_start_date: {
    type: Date,
    required: true,
  },
  week_end_date: {
    type: Date,
    required: true,
  },
  total_trips: {
    type: Number,
    default: 0,
  },
  total_earnings: {
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
  is_transferred: {
    type: Boolean,
    default: false,
  },
  transferred_at: {
    type: Date,
  },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
});

providerWeeklyEarningSchema.index({ provider_id: 1, week_start_date: -1 });

export const ProviderWeeklyEarning = mongoose.model('provider_weekly_earning', providerWeeklyEarningSchema);
export default ProviderWeeklyEarning;
