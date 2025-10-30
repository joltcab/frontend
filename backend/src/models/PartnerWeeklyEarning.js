import mongoose from 'mongoose';

const partnerWeeklyEarningSchema = new mongoose.Schema({
  partner_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'partner',
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
  commission_earned: {
    type: Number,
    default: 0,
  },
  is_transferred: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
});

partnerWeeklyEarningSchema.index({ partner_id: 1, week_start_date: -1 });

export const PartnerWeeklyEarning = mongoose.model('partner_weekly_earning', partnerWeeklyEarningSchema);
export default PartnerWeeklyEarning;
