import mongoose from 'mongoose';

const personalityTypeSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    uppercase: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  strengths: [{
    type: String,
  }],
  weaknesses: [{
    type: String,
  }],
  careers: [{
    type: String,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  _id: true,
  id: false,
  timestamps: true,
});

personalityTypeSchema.index({ type: 1 }, { unique: true });

const PersonalityType = mongoose.models.PersonalityType || mongoose.model('PersonalityType', personalityTypeSchema);

export default PersonalityType; 