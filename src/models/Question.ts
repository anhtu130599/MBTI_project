import mongoose from 'mongoose';

const optionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  value: { type: String, required: true },
}, { _id: false });

const questionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  options: { type: [optionSchema], required: true },
  order: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
  category: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Question || mongoose.model('Question', questionSchema); 