import mongoose from 'mongoose';

const promoCodeSchema = new mongoose.Schema({
  promocode: {
    type: String,
    required: [true, 'Promo code is required'],
    unique: true,
    uppercase: true,
    trim: true,
  },
  code_value: {
    type: Number,
    required: [true, 'Code value is required'],
    default: 0,
  },
  code_type: {
    type: Number,
    default: 0, // 0 = percentage, 1 = fixed amount
  },
  code_uses: {
    type: Number,
    default: 0, // Max number of times code can be used
  },
  user_used_promo: {
    type: Number,
    default: 0, // Number of times code has been used
  },
  state: {
    type: Number,
    default: 1, // 0 = inactive, 1 = active
  },
  
  // Location
  countryid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Country',
  },
  cityid: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'City',
  }],
  
  // Validity
  start_date: {
    type: Date,
    required: [true, 'Start date is required'],
    default: Date.now,
  },
  code_expiry: {
    type: Date,
    required: [true, 'Expiry date is required'],
  },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
});

// Índices
promoCodeSchema.index({ promocode: 1, countryid: 1 });
promoCodeSchema.index({ state: 1, start_date: 1, code_expiry: 1 });
promoCodeSchema.index({ promocode: 1, code_expiry: 1 });

// Método para verificar si el código está activo
promoCodeSchema.methods.isActive = function() {
  const now = new Date();
  return this.state === 1 && 
         this.start_date <= now && 
         this.code_expiry >= now &&
         (this.code_uses === 0 || this.user_used_promo < this.code_uses);
};

export const PromoCode = mongoose.model('promo_code', promoCodeSchema);
export default PromoCode;
