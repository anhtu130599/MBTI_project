import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Career from '@/models/Career';

export async function GET(
  request: NextRequest,
  { params }: { params: { type: string } }
) {
  try {
    const { type } = params;
    
    // Validate personality type format
    if (!type || !/^[A-Z]{4}$/.test(type)) {
      return NextResponse.json(
        { error: 'Invalid personality type format. Must be 4 uppercase letters (e.g., ENFP)' },
        { status: 400 }
      );
    }

    await dbConnect();
    
    // Find careers that match the personality type
    const careers = await Career.find({
      personalityTypes: { $in: [type] }
    }).sort({ title: 1 });

    return NextResponse.json({
      success: true,
      data: {
        personalityType: type,
        careers: careers,
        total: careers.length
      }
    });

  } catch (error) {
    console.error('Error fetching careers by personality type:', error);
    return NextResponse.json(
      { error: 'Failed to fetch careers for this personality type' },
      { status: 500 }
    );
  }
} 