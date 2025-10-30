import mongoose from 'mongoose';

const cardSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'user_type',
    required: true,
  },
  user_type: {
    type: String,
    enum: ['user', 'provider', 'corporate'],
    required: true,
  },
  card_token: {
    type: String,
    required: true,
  },
  last_four: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    default: '',
  },
  exp_month: {
    type: Number,
    required: true,
  },
  exp_year: {
    type: Number,
    required: true,
  },
  is_default: {
    type: Boolean,
    default: false,
  },
  is_active: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
});

cardSchema.index({ user_id: 1, is_active: 1 });
cardSchema.index({ card_token: 1 });

export const Card = mongoose.model('card', cardSchema);
export default Card;
