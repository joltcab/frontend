import mongoose from 'mongoose';

const partnerVehicleDocumentSchema = new mongoose.Schema({
  partner_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'partner',
    required: true,
  },
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
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
});

partnerVehicleDocumentSchema.index({ partner_id: 1, provider_id: 1 });

export const PartnerVehicleDocument = mongoose.model('partner_vehicle_document', partnerVehicleDocumentSchema);
export default PartnerVehicleDocument;
