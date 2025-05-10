import mongoose, { Schema } from 'mongoose';

// Định nghĩa schema cho loại tính cách MBTI
const PersonalityTypeSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true,
    maxlength: 4,
    minlength: 4
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  strengths: {
    type: [String],
    default: []
  },
  weaknesses: {
    type: [String],
    default: []
  },
  careers: {
    type: [String],
    default: []
  },
  famousPeople: {
    type: [String],
    default: []
  }
}, {
  timestamps: true
});

// Kiểm tra xem model đã tồn tại chưa để tránh lỗi khi hot reload
export default mongoose.models.PersonalityType || 
  mongoose.model('PersonalityType', PersonalityTypeSchema); 