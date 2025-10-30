import mongoose from 'mongoose';

const typeSchema = new mongoose.Schema({
  typename: {
    type: String,
    required: [true, 'Type name is required'],
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  type_image_url: {
    type: String,
    default: '',
  },
  map_pin_image_url: {
    type: String,
    default: '',
  },
  service_type: {
    type: Number,
    required: true,
  },
  priority: {
    type: Number,
    default: 0,
  },
  is_business: {
    type: Boolean,
    default: true,
  },
  is_default_selected: {
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
typeSchema.index({ typename: 1 });
typeSchema.index({ service_type: 1, is_business: 1 });

export const Type = mongoose.model('type', typeSchema);
export default Type;
