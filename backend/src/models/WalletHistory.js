import mongoose from 'mongoose';

const walletHistorySchema = new mongoose.Schema({
  unique_id: {
    type: Number,
    unique: true,
  },
  
  // User Information
  user_type: {
    type: Number,
    required: true, // 1=admin, 2=driver, 7=user, etc.
  },
  user_unique_id: {
    type: Number,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'user_model',
    required: true,
  },
  user_model: {
    type: String,
    enum: ['user', 'provider', 'admin'],
    default: 'user',
  },
  
  // Location
  country_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Country',
  },
  
  // Currency Conversion
  from_amount: {
    type: Number,
    default: 0,
  },
  from_currency_code: {
    type: String,
    default: 'USD',
  },
  to_currency_code: {
    type: String,
    default: 'USD',
  },
  current_rate: {
    type: Number,
    default: 1,
  },
  
  // Wallet Transaction
  wallet_amount: {
    type: Number,
    default: 0,
  },
  added_wallet: {
    type: Number,
    default: 0,
  },
  total_wallet_amount: {
    type: Number,
    default: 0,
  },
  
  // Transaction Details
  wallet_status: {
    type: Number,
    default: 0, // 0=pending, 1=completed, 2=failed
  },
  wallet_comment_id: {
    type: Number,
    default: 1,
  },
  wallet_description: {
    type: String,
    default: '',
  },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
});

// Índices
walletHistorySchema.index({ user_id: 1, created_at: -1 });
walletHistorySchema.index({ user_type: 1, created_at: -1 });
walletHistorySchema.index({ wallet_status: 1 });

export const WalletHistory = mongoose.model('wallet_history', walletHistorySchema);
export default WalletHistory;
