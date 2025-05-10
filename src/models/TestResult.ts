import mongoose, { Schema } from 'mongoose';

// Định nghĩa schema cho kết quả test MBTI
const TestResultSchema = new Schema({
  personalityType: {
    type: String,
    required: true,
    uppercase: true,
    trim: true,
    maxlength: 4,
    minlength: 4
  },
  answers: {
    type: Map,
    of: Number,
    required: true
  },
  scores: {
    e: Number,
    i: Number,
    s: Number,
    n: Number,
    t: Number,
    f: Number,
    j: Number,
    p: Number
  },
  userId: {
    type: String,
    default: null
  },
  careerRecommendations: {
    type: [String],
    default: []
  }
}, {
  timestamps: true
});

// Kiểm tra xem model đã tồn tại chưa để tránh lỗi khi hot reload
export default mongoose.models.TestResult || 
  mongoose.model('TestResult', TestResultSchema); 