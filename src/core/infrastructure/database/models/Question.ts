import mongoose, { Schema, Document } from 'mongoose';
import { Question as QuestionEntity } from '@/core/domain/entities/Question';

export interface QuestionDocument extends Omit<QuestionEntity, 'id'>, Document {
  _id: mongoose.Types.ObjectId;
}

const QuestionSchema = new Schema<QuestionDocument>({
  text: {
    type: String,
    required: true,
    trim: true,
  },
  options: [{
    id: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['E', 'I', 'S', 'N', 'T', 'F', 'J', 'P'],
    },
  }],
  category: {
    type: String,
    required: true,
    enum: ['EI', 'SN', 'TF', 'JP'],
  },
}, {
  timestamps: true,
});

const Question = mongoose.models.Question || mongoose.model<QuestionDocument>('Question', QuestionSchema);

export default Question; 