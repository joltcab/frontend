import mongoose from 'mongoose';

const informationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['terms', 'privacy', 'about', 'help', 'faq'],
    required: true,
  },
  language: {
    type: String,
    default: 'en',
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

informationSchema.index({ type: 1, language: 1 });

export const Information = mongoose.model('information', informationSchema);
export default Information;
