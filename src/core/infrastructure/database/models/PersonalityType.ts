import mongoose, { Schema, Document } from 'mongoose';
import { PersonalityType as PersonalityTypeEntity } from '@/core/domain/entities/PersonalityType';

export interface PersonalityTypeDocument extends Omit<PersonalityTypeEntity, 'id'>, Document {
  _id: mongoose.Types.ObjectId;
}

const PersonalityTypeSchema = new Schema<PersonalityTypeDocument>({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
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
  traits: {
    introversion: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    intuition: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    thinking: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    judging: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
  },
  strengths: [{
    type: String,
    required: true,
  }],
  weaknesses: [{
    type: String,
    required: true,
  }],
  cognitive_functions: {
    dominant: {
      type: String,
      required: true,
    },
    auxiliary: {
      type: String,
      required: true,
    },
    tertiary: {
      type: String,
      required: true,
    },
    inferior: {
      type: String,
      required: true,
    },
  },
  famous_people: [{
    type: String,
  }],
  compatibility: {
    romantic: [{
      type: String,
      match: /^[A-Z]{4}$/,
    }],
    friendship: [{
      type: String,
      match: /^[A-Z]{4}$/,
    }],
    work: [{
      type: String,
      match: /^[A-Z]{4}$/,
    }],
  },
  career_paths: [{
    type: String,
    required: true,
  }],
  growth_tips: [{
    type: String,
  }],
  stress_triggers: [{
    type: String,
  }],
}, {
  timestamps: true,
});

const PersonalityType = mongoose.models.PersonalityType || mongoose.model<PersonalityTypeDocument>('PersonalityType', PersonalityTypeSchema);

export default PersonalityType; 