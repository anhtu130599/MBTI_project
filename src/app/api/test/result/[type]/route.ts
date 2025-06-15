import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb://localhost:27017/mbti_db';

// Simple inline schema matching the database exactly
const PersonalitySchema = new mongoose.Schema({}, { 
  strict: false, 
  collection: 'personalitydetailinfos' 
});

export async function GET(
  request: NextRequest,
  { params }: { params: { type: string } }
) {
  try {
    const { type } = params;
    console.log(`[API] Request for type: ${type}`);
    
    if (!type || !/^[A-Z]{4}$/.test(type)) {
      console.log(`[API] Invalid type format: ${type}`);
      return NextResponse.json(
        { error: 'Invalid personality type format' },
        { status: 400 }
      );
    }

    // Connect to database
    if (mongoose.connection.readyState !== 1) {
      console.log('[API] Connecting to MongoDB...');
      await mongoose.connect(MONGODB_URI);
    }
    console.log('[API] Connected to MongoDB');

    // Get model
    const PersonalityModel = mongoose.models.TestPersonality || 
      mongoose.model('TestPersonality', PersonalitySchema);

    // Check database
    const totalCount = await PersonalityModel.countDocuments();
    console.log(`[API] Total documents: ${totalCount}`);

    // Find the personality type
    const personality = await PersonalityModel.findOne({ type }).lean();
    console.log(`[API] Found ${type}:`, personality ? 'YES' : 'NO');

    if (!personality) {
      console.log(`[API] ${type} not found in database`);
      return NextResponse.json(
        { error: `Personality type ${type} not found` },
        { status: 404 }
      );
    }

    console.log(`[API] Successfully found ${type} data`);

    // Return the data in expected format
    return NextResponse.json({
      success: true,
      data: {
        ...personality,
        available_careers: [] // Empty for now
      }
    });

  } catch (error) {
    console.error('[API] Error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 