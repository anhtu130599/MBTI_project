import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import PersonalityType from '@/models/PersonalityType';

export async function GET() {
  try {
    await dbConnect();
    const types = await PersonalityType.find().sort({ type: 1 });
    return NextResponse.json(types);
  } catch (error) {
    console.error('Error in GET /api/personality-types:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 
