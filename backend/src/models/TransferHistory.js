import mongoose from 'mongoose';

const transferHistorySchema = new mongoose.Schema({
  provider_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'provider',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency_code: {
    type: String,
    default: 'USD',
  },
  transfer_method: {
    type: String,
    enum: ['bank_transfer', 'paypal', 'stripe', 'cash'],
    default: 'bank_transfer',
  },
  transaction_id: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending',
  },
  processed_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'admin',
  },
  processed_at: {
    type: Date,
  },
  notes: {
    type: String,
    default: '',
  },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
});

transferHistorySchema.index({ provider_id: 1, created_at: -1 });
transferHistorySchema.index({ status: 1 });

export const TransferHistory = mongoose.model('transfer_history', transferHistorySchema);
export default TransferHistory;
