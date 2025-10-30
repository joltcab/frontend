import mongoose from 'mongoose';

const providerDocumentSchema = new mongoose.Schema({
  provider_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'provider',
    required: true,
  },
  document_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'documents',
    required: true,
  },
  document_number: {
    type: String,
    default: '',
  },
  document_image_url: {
    type: String,
    default: '',
  },
  expiry_date: {
    type: Date,
  },
  is_verified: {
    type: Boolean,
    default: false,
  },
  verified_at: {
    type: Date,
  },
  verified_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'admin',
  },
  rejection_reason: {
    type: String,
    default: '',
  },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
});

providerDocumentSchema.index({ provider_id: 1, document_id: 1 });
providerDocumentSchema.index({ is_verified: 1, expiry_date: 1 });

export const ProviderDocument = mongoose.model('provider_document', providerDocumentSchema);
export default ProviderDocument;
