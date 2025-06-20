import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { verifyAdminAuth } from '@/shared/utils/auth';

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdminAuth(request);
    if (!authResult.success) {
      console.log('Admin auth failed in /admin/personality-types:', authResult.error);
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    console.log('Admin authenticated in /admin/personality-types:', authResult.username);

    await dbConnect();
    const PersonalityType = (await import('@/core/infrastructure/database/models/PersonalityType')).default;
    const types = await PersonalityType.find().sort({ type: 1 });
    
    console.log('Found personality types:', types.length);
    return NextResponse.json(types);
  } catch (error) {
    console.error('Error fetching personality types:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdminAuth(request);
    if (!authResult.success) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const data = await request.json();
    await dbConnect();
    const PersonalityType = (await import('@/core/infrastructure/database/models/PersonalityType')).default;
    const type = new PersonalityType(data);
    await type.save();
    return NextResponse.json(type);
  } catch (error) {
    console.error('Error creating personality type:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 
