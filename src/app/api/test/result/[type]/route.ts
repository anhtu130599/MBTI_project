import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import PersonalityDetailInfo from '@/models/PersonalityDetailInfo';
import Career from '@/models/Career';

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
    await dbConnect();
    console.log('[API] Connected to MongoDB');

    // Find the personality type
    const personality = await PersonalityDetailInfo.findOne({ type }).lean();
    console.log(`[API] Found ${type}:`, personality ? 'YES' : 'NO');

    if (!personality) {
      console.log(`[API] ${type} not found in database`);
      return NextResponse.json(
        { error: `Personality type ${type} not found` },
        { status: 404 }
      );
    }

    // Get careers for this personality type
    const careers = await Career.find({
      personalityTypes: { $in: [type] }
    }).sort({ title: 1 });

    console.log(`[API] Found ${careers.length} careers for ${type}`);

    // Return the complete data
    return NextResponse.json({
      success: true,
      data: {
        personality,
        careers,
        totalCareers: careers.length
      }
    });

  } catch (error) {
    console.error('[API] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 