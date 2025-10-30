import mongoose from 'mongoose';

const airportSchema = new mongoose.Schema({
  unique_id: {
    type: Number,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  code: {
    type: String,
    required: true,
    uppercase: true,
    trim: true,
  },
  city_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'City',
    required: true,
  },
  country_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Country',
    required: true,
  },
  location: {
    type: [Number], // [longitude, latitude]
    index: '2d',
  },
  address: {
    type: String,
    default: '',
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

airportSchema.index({ code: 1 });
airportSchema.index({ city_id: 1, is_active: 1 });

export const Airport = mongoose.model('airport', airportSchema);
export default Airport;
