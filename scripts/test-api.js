const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mbti_db';

// Define schema inline
const PersonalityDetailInfoSchema = new mongoose.Schema({
  type: { type: String, required: true, unique: true, match: /^[A-Z]{4}$/ },
  name: { type: String, required: true },
  description: { type: String, required: true },
  note: { type: String, required: true },
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
    dimension: { type: String, required: true, enum: ['EI', 'SN', 'TF', 'JP'] },
    dimension_name_vi: { type: String, required: true },
    trait_a: {
      id: String, name_en: String, name_vi: String, description: String,
      keywords: [String], examples: [String],
      dimension_type: { type: String, enum: ['EI', 'SN', 'TF', 'JP'] },
    },
    trait_b: {
      id: String, name_en: String, name_vi: String, description: String,
      keywords: [String], examples: [String],
      dimension_type: { type: String, enum: ['EI', 'SN', 'TF', 'JP'] },
    },
  }],
  strengths: [{
    title: { type: String, required: true },
    description: { type: String, required: true },
    why_explanation: { type: String, required: true },
  }],
  weaknesses: [{
    title: { type: String, required: true },
    description: { type: String, required: true },
    why_explanation: { type: String, required: true },
    improvement_advice: { type: String, required: true },
  }],
  development_advice: [{ type: String, required: true }],
  relationship_analysis: {
    interaction_style: { type: String, required: true },
    improvement_tips: [{ type: String, required: true }],
  },
  career_guidance: {
    suitable_fields: [{ type: String, required: true }],
    improvement_skills: [{ type: String, required: true }],
    career_matches: [{ type: String, required: true }],
  },
}, { timestamps: true });

const PersonalityDetailInfo = mongoose.model('PersonalityDetailInfo', PersonalityDetailInfoSchema);

async function testAPI() {
  try {
    console.log('Testing API logic...');
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const type = 'ESTJ';
    console.log(`Searching for personality type: ${type}`);
    
    const personalityDetail = await PersonalityDetailInfo.findOne({ type });
    console.log('Found personality detail:', personalityDetail ? 'YES' : 'NO');
    
    if (personalityDetail) {
      console.log('SUCCESS: API logic would work');
      console.log(`- Type: ${personalityDetail.type}`);
      console.log(`- Name: ${personalityDetail.name}`);
      console.log(`- Description: ${personalityDetail.description.substring(0, 100)}...`);
      
      // Test the response structure
      const response = {
        success: true,
        data: {
          ...personalityDetail.toObject(),
          available_careers: [] // Empty for now since Career model might not exist
        }
      };
      console.log('Response structure is valid');
    } else {
      console.log('ERROR: Personality type not found in database');
    }

  } catch (error) {
    console.error('Error testing API:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

testAPI(); 