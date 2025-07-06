import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { verifyAdminAuth } from '@/shared/utils/auth';
import PersonalityDetailInfo from '@/models/PersonalityDetailInfo';

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
    
    const types = await PersonalityDetailInfo.find().sort({ type: 1 });
    
    // Map dữ liệu để tương thích với frontend
    const mappedTypes = types.map(type => ({
      _id: type._id,
      code: type.type,
      name: type.name,
      description: type.description,
      strengths: type.strengths ? type.strengths.map((s: { title?: string; description?: string }) => s.title || s.description || s) : [],
      weaknesses: type.weaknesses ? type.weaknesses.map((w: { title?: string; description?: string }) => w.title || w.description || w) : [],
      // Không map career_paths vì careers được quản lý riêng
    }));
    
    console.log('Found personality types:', mappedTypes.length);
    return NextResponse.json(mappedTypes);
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
    
    const type = new PersonalityDetailInfo(data);
    await type.save();
    return NextResponse.json(type);
  } catch (error) {
    console.error('Error creating personality type:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 
