import mongoose from 'mongoose';

const bankDetailSchema = new mongoose.Schema({
  provider_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'provider',
    required: true,
  },
  bank_name: {
    type: String,
    required: true,
  },
  account_holder_name: {
    type: String,
    required: true,
  },
  account_number: {
    type: String,
    required: true,
  },
  routing_number: {
    type: String,
    default: '',
  },
  swift_code: {
    type: String,
    default: '',
  },
  account_type: {
    type: String,
    enum: ['checking', 'savings'],
    default: 'checking',
  },
  is_verified: {
    type: Boolean,
    default: false,
  },
  is_default: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
});

bankDetailSchema.index({ provider_id: 1 });

export const BankDetail = mongoose.model('bank_detail', bankDetailSchema);
export default BankDetail;
