import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Career from '@/models/Career';

export async function GET() {
  try {
    await dbConnect();
    const careers = await Career.find().sort({ title: 1 });
    return NextResponse.json(careers);
  } catch (error) {
    console.error('Error fetching careers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch careers' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const careerData = await request.json();
    
    const career = await Career.create(careerData);
    return NextResponse.json(career);
  } catch (error) {
    console.error('Error creating career:', error);
    return NextResponse.json(
      { error: 'Failed to create career' },
      { status: 500 }
    );
  }
} 
