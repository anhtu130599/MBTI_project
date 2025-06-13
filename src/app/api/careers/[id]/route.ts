import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { db } = await connectToDatabase();
    const career = await db.collection('careers').findOne({
      _id: new ObjectId(params.id)
    });

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
    const { db } = await connectToDatabase();
    const updates = await request.json();
    
    const result = await db.collection('careers').updateOne(
      { _id: new ObjectId(params.id) },
      { $set: updates }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Career not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result);
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
    const { db } = await connectToDatabase();
    const result = await db.collection('careers').deleteOne({
      _id: new ObjectId(params.id)
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Career not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error deleting career:', error);
    return NextResponse.json(
      { error: 'Failed to delete career' },
      { status: 500 }
    );
  }
} 