import mongoose, { Schema, Document } from 'mongoose';
import { PersonalityDetailInfo as PersonalityDetailInfoEntity } from '@/core/domain/entities/MBTIDimensionInfo';

export interface PersonalityDetailInfoDocument extends Omit<PersonalityDetailInfoEntity, 'id'>, Document {
  _id: mongoose.Types.ObjectId;
}

const PersonalityDetailInfoSchema = new Schema<PersonalityDetailInfoDocument>({
  type: {
    type: String,
    required: true,
    unique: true,
    match: /^[A-Z]{4}$/,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  note: {
    type: String,
    required: true,
  },
  trait_percentages: {
    E: { type: Number, required: true, min: 0, max: 100 },
    I: { type: Number, required: true, min: 0, max: 100 },
    S: { type: Number, required: true, min: 0, max: 100 },
    N: { type: Number, required: true, min: 0, max: 100 },
    T: { type: Number, required: true, min: 0, max: 100 },
    F: { type: Number, required: true, min: 0, max: 100 },
    J: { type: Number, required: true, min: 0, max: 100 },
    P: { type: Number, required: true, min: 0, max: 100 },
  },
  dimensions: [{
    dimension: {
      type: String,
      required: true,
      enum: ['EI', 'SN', 'TF', 'JP'],
    },
    dimension_name_vi: {
      type: String,
      required: true,
    },
    trait_a: {
      id: String,
      name_en: String,
      name_vi: String,
      description: String,
      keywords: [String],
      examples: [String],
      dimension_type: {
        type: String,
        enum: ['EI', 'SN', 'TF', 'JP'],
      },
    },
    trait_b: {
      id: String,
      name_en: String,
      name_vi: String,
      description: String,
      keywords: [String],
      examples: [String],
      dimension_type: {
        type: String,
        enum: ['EI', 'SN', 'TF', 'JP'],
      },
    },
  }],
  strengths: [{
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    why_explanation: {
      type: String,
      required: true,
    },
  }],
  weaknesses: [{
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    why_explanation: {
      type: String,
      required: true,
    },
    improvement_advice: {
      type: String,
      required: true,
    },
  }],
  development_advice: [{
    type: String,
    required: true,
  }],
  relationship_analysis: {
    interaction_style: {
      type: String,
      required: true,
    },
    improvement_tips: [{
      type: String,
      required: true,
    }],
  },
  career_guidance: {
    suitable_fields: [{
      type: String,
      required: true,
    }],
    improvement_skills: [{
      type: String,
      required: true,
    }],
    career_matches: [{
      type: String,
      required: true,
    }],
  },
  work_environment_preferred: {
    type: String,
    required: true,
  },
  work_environment_avoid: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
  collection: 'personalitydetailinfos'
});

const PersonalityDetailInfo = mongoose.models.PersonalityDetailInfo || mongoose.model<PersonalityDetailInfoDocument>('PersonalityDetailInfo', PersonalityDetailInfoSchema);

export default PersonalityDetailInfo; 