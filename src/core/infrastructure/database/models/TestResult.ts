import mongoose, { Schema, Document } from 'mongoose';
import { TestResult as TestResultEntity } from '@/core/domain/entities/TestResult';

export interface TestResultDocument extends TestResultEntity, Document {
  _id: mongoose.Types.ObjectId;
}

const TestResultSchema = new Schema<TestResultDocument>({
  type: {
    type: String,
    required: true,
    match: /^[A-Z]{4}$/,
  },
  description: {
    type: String,
    required: true,
  },
  strengths: [{
    type: String,
    required: true,
  }],
  weaknesses: [{
    type: String,
    required: true,
  }],
  careers: [{
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    matchScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
  }],
}, {
  timestamps: true,
});

const TestResult = mongoose.models.TestResult || mongoose.model<TestResultDocument>('TestResult', TestResultSchema);

export default TestResult; 