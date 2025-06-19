import mongoose, { Schema, Document } from 'mongoose';

export interface UserTestResult extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  personalityType: string;
  scores: {
    E: number;
    I: number;
    S: number;
    N: number;
    T: number;
    F: number;
    J: number;
    P: number;
  };
  percentages: {
    E: number;
    I: number;
    S: number;
    N: number;
    T: number;
    F: number;
    J: number;
    P: number;
  };
  careerRecommendations: string[];
  answers: Record<string, string>; // Lưu lại câu trả lời chi tiết
  totalQuestions: number;
  createdAt: Date;
  updatedAt: Date;
}

const TestResultSchema = new Schema<UserTestResult>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true  // Không unique, cho phép user có nhiều test
  },
  personalityType: {
    type: String,
    required: true,
    match: /^[A-Z]{4}$/,
    index: true
  },
  scores: {
    E: { type: Number, required: true, min: 0 },
    I: { type: Number, required: true, min: 0 },
    S: { type: Number, required: true, min: 0 },
    N: { type: Number, required: true, min: 0 },
    T: { type: Number, required: true, min: 0 },
    F: { type: Number, required: true, min: 0 },
    J: { type: Number, required: true, min: 0 },
    P: { type: Number, required: true, min: 0 }
  },
  percentages: {
    E: { type: Number, required: true, min: 0, max: 100 },
    I: { type: Number, required: true, min: 0, max: 100 },
    S: { type: Number, required: true, min: 0, max: 100 },
    N: { type: Number, required: true, min: 0, max: 100 },
    T: { type: Number, required: true, min: 0, max: 100 },
    F: { type: Number, required: true, min: 0, max: 100 },
    J: { type: Number, required: true, min: 0, max: 100 },
    P: { type: Number, required: true, min: 0, max: 100 }
  },
  careerRecommendations: [{
    type: String,
    required: true
  }],
  answers: {
    type: Schema.Types.Mixed,
    required: true
  },
  totalQuestions: {
    type: Number,
    required: true,
    min: 1
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// Compound indexes for better query performance
TestResultSchema.index({ userId: 1, createdAt: -1 });
TestResultSchema.index({ personalityType: 1, createdAt: -1 });

const TestResult = mongoose.models.TestResult || mongoose.model<UserTestResult>('TestResult', TestResultSchema);

export default TestResult; 