import mongoose from 'mongoose';

const paymentTransactionSchema = new mongoose.Schema({
  // Stripe Keys
  stripe_public_key: {
    type: String,
    default: '',
  },
  stripe_secret_key: {
    type: String,
    default: '',
    select: false, // No incluir en queries por seguridad
  },
  
  // Amount
  amount: {
    type: Number,
    required: true,
    default: 0,
  },
  currency_code: {
    type: String,
    default: 'USD',
  },
  
  // Payment Status
  is_schedule_payment: {
    type: Boolean,
    default: true,
  },
  is_payment_paid: {
    type: Boolean,
    default: false,
  },
  
  // Transaction Tracking
  no_of_failed_transaction: {
    type: Number,
    default: 0,
  },
  max_no_of_transaction: {
    type: Number,
    default: 3,
  },
  
  // Transaction Details
  transaction_detail: {
    type: Array,
    default: [],
  },
  card_detail: {
    type: Array,
    default: [],
  },
  type_detail: {
    type: Array,
    default: [],
  },
  
  // Dates
  last_payment_date: {
    type: Date,
  },
  
  // System Control
  is_stop_system: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
});

// Índices
paymentTransactionSchema.index({ is_payment_paid: 1, created_at: -1 });
paymentTransactionSchema.index({ is_schedule_payment: 1, last_payment_date: 1 });

export const PaymentTransaction = mongoose.model('payment_transaction', paymentTransactionSchema);
export default PaymentTransaction;
