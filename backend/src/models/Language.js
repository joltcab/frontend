import mongoose from 'mongoose';

const languageSchema = new mongoose.Schema({
  unique_id: {
    type: Number,
    unique: true,
  },
  name: {
    type: String,
    required: [true, 'Language name is required'],
    trim: true,
  },
  code: {
    type: String,
    required: [true, 'Language code is required'],
    unique: true,
    uppercase: true,
    trim: true,
  },
  native_name: {
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

// Índices
languageSchema.index({ code: 1 });
languageSchema.index({ is_active: 1 });

export const Language = mongoose.model('language', languageSchema);
export default Language;
