import mongoose from 'mongoose';

const careerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  personalityTypes: [{
    type: String,
    uppercase: true,
  }],
  skills: [{
    type: String,
  }],
  education: {
    type: String,
  },
  salary: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Career = mongoose.models.Career || mongoose.model('Career', careerSchema);

export default Career; 