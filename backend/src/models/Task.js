import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  assigned_to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'admin',
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'admin',
    required: true,
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed', 'cancelled'],
    default: 'pending',
  },
  due_date: {
    type: Date,
  },
  completed_at: {
    type: Date,
  },
  related_type: {
    type: String,
    enum: ['trip', 'user', 'provider', 'support_ticket'],
  },
  related_id: {
    type: mongoose.Schema.Types.ObjectId,
  },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
});

taskSchema.index({ assigned_to: 1, status: 1 });
taskSchema.index({ created_by: 1 });

export const Task = mongoose.model('task', taskSchema);
export default Task;
