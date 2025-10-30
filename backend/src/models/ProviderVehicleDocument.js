import mongoose from 'mongoose';

const providerVehicleDocumentSchema = new mongoose.Schema({
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
  vehicle_id: {
    type: String,
    default: '',
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
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
});

providerVehicleDocumentSchema.index({ provider_id: 1 });
providerVehicleDocumentSchema.index({ is_verified: 1, expiry_date: 1 });

export const ProviderVehicleDocument = mongoose.model('provider_vehicle_document', providerVehicleDocumentSchema);
export default ProviderVehicleDocument;
