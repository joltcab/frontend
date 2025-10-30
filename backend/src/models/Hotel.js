import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const hotelSchema = new mongoose.Schema({
  unique_id: {
    type: Number,
    unique: true,
  },
  hotel_name: {
    type: String,
    required: true,
    trim: true,
  },
  contact_person: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  address: {
    type: String,
    default: '',
  },
  city_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'City',
  },
  country_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Country',
  },
  location: {
    type: [Number], // [longitude, latitude]
    index: '2d',
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  wallet: {
    type: Number,
    default: 0,
  },
  commission_rate: {
    type: Number,
    default: 10,
  },
  is_approved: {
    type: Boolean,
    default: false,
  },
  is_active: {
    type: Boolean,
    default: true,
  },
  token: {
    type: String,
    default: '',
  },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
});

hotelSchema.index({ email: 1 });
hotelSchema.index({ is_approved: 1, is_active: 1 });
hotelSchema.index({ city_id: 1 });

hotelSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

hotelSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export const Hotel = mongoose.model('hotel', hotelSchema);
export default Hotel;
