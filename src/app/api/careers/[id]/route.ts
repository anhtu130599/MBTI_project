import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Career from '@/core/infrastructure/database/models/Career';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const career = await Career.findById(params.id);

    if (!career) {
      return NextResponse.json(
        { error: 'Career not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(career);
  } catch (error) {
    console.error('Error fetching career:', error);
    return NextResponse.json(
      { error: 'Failed to fetch career' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const updates = await request.json();
    
    const career = await Career.findByIdAndUpdate(
      params.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!career) {
      return NextResponse.json(
        { error: 'Career not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(career);
  } catch (error) {
    console.error('Error updating career:', error);
    return NextResponse.json(
      { error: 'Failed to update career' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const career = await Career.findByIdAndDelete(params.id);

    if (!career) {
      return NextResponse.json(
        { error: 'Career not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Career deleted successfully' });
  } catch (error) {
    console.error('Error deleting career:', error);
    return NextResponse.json(
      { error: 'Failed to delete career' },
      { status: 500 }
    );
  }
} 