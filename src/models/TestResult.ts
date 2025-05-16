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
  userId: {
    type: String,
    required: true,
    unique: true // Mỗi user chỉ có 1 kết quả cuối cùng
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