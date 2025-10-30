import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  unique_id: {
    type: Number,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  is_required: {
    type: Boolean,
    default: true,
  },
  document_type: {
    type: String,
    enum: ['user', 'provider', 'vehicle', 'partner'],
    required: true,
  },
  country_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Country',
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

documentSchema.index({ document_type: 1, is_active: 1 });
documentSchema.index({ country_id: 1 });

export const Document = mongoose.model('documents', documentSchema);
export default Document;
