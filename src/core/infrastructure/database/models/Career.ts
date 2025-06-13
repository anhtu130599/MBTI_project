import mongoose, { Schema, Document } from 'mongoose';
import { Career as CareerEntity } from '@/core/domain/entities/Career';

export interface CareerDocument extends Omit<CareerEntity, 'id'>, Document {
  _id: mongoose.Types.ObjectId;
}

const CareerSchema = new Schema<CareerDocument>({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  industry: {
    type: String,
    required: true,
    trim: true,
  },
  salaryRange: {
    min: {
      type: Number,
      required: true,
      min: 0,
    },
    max: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      required: true,
      default: 'VND',
    },
  },
  requiredSkills: [{
    type: String,
    required: true,
    trim: true,
  }],
  educationLevel: {
    type: String,
    required: true,
    trim: true,
  },
  experienceLevel: {
    type: String,
    required: true,
    enum: ['Entry', 'Mid', 'Senior', 'Executive'],
  },
  personalityTypes: [{
    type: String,
    required: true,
    match: /^[A-Z]{4}$/,
  }],
  workEnvironment: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  jobOutlook: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

const Career = mongoose.models.Career || mongoose.model<CareerDocument>('Career', CareerSchema);

export default Career; 