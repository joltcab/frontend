import mongoose from 'mongoose';

const userDocumentSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
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

userDocumentSchema.index({ user_id: 1, document_id: 1 });
userDocumentSchema.index({ is_verified: 1 });

export const UserDocument = mongoose.model('user_document', userDocumentSchema);
export default UserDocument;
