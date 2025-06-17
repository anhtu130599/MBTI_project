import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb://localhost:27017/mbti_db';

export async function GET() {
  try {
    console.log('Simple API: Starting...');
    
    // Connect to database
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(MONGODB_URI);
    }
    
    console.log('Simple API: Connected to database');
    
    // Define simple schema
    const PersonalitySchema = new mongoose.Schema({
      type: String,
      name: String,
      description: String
    }, { collection: 'personalitydetailinfos' });
    
    const Personality = mongoose.models.TestPersonality || mongoose.model('TestPersonality', PersonalitySchema);
    
    // Get count
    const count = await Personality.countDocuments();
    console.log('Simple API: Found', count, 'records');
    
    // Get ESTJ
    const estj = await Personality.findOne({ type: 'ESTJ' });
    console.log('Simple API: ESTJ found:', estj ? 'YES' : 'NO');
    
    return NextResponse.json({
      success: true,
      count,
      estj_found: !!estj,
      estj_data: estj ? { type: estj.type, name: estj.name } : null
    });
    
  } catch (error) {
    console.error('Simple API Error:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 