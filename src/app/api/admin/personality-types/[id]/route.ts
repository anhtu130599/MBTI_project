import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { verifyAdminAuth } from '@/shared/utils/auth';
import PersonalityDetailInfo from '@/models/PersonalityDetailInfo';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await verifyAdminAuth(request);
    if (!authResult.success) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    await dbConnect();
    
    const type = await PersonalityDetailInfo.findById(params.id);
    
    if (!type) {
      return NextResponse.json({ error: 'Not Found' }, { status: 404 });
    }
    
    // Map dữ liệu để tương thích với frontend
    const mappedType = {
      _id: type._id,
      code: type.type,
      name: type.name,
      description: type.description,
      strengths: type.strengths ? type.strengths.map((s: { title?: string; description?: string }) => s.title || s.description || s) : [],
      weaknesses: type.weaknesses ? type.weaknesses.map((w: { title?: string; description?: string }) => w.title || w.description || w) : [],
    };
    
    return NextResponse.json(mappedType);
  } catch (error) {
    console.error('Error fetching personality type:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await verifyAdminAuth(request);
    if (!authResult.success) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const data = await request.json();
    await dbConnect();
    
    // Map dữ liệu từ frontend về database format
    const updateData = {
      type: data.code,
      name: data.name,
      description: data.description,
      // Giữ nguyên các field khác không được edit
    };
    
    const type = await PersonalityDetailInfo.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true }
    );
    
    if (!type) {
      return NextResponse.json({ error: 'Not Found' }, { status: 404 });
    }
    
    return NextResponse.json(type);
  } catch (error) {
    console.error('Error updating personality type:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await verifyAdminAuth(request);
    if (!authResult.success) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    await dbConnect();
    
    const type = await PersonalityDetailInfo.findByIdAndDelete(params.id);
    
    if (!type) {
      return NextResponse.json({ error: 'Not Found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (error) {
    console.error('Error deleting personality type:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 