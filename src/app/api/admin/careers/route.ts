import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import dbConnect from '@/lib/mongodb';
import Career from '@/models/Career';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('auth-token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    let payload;
    try {
      payload = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    } catch {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (payload.payload.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await dbConnect();
    const careers = await Career.find().sort({ title: 1 });
    return NextResponse.json(careers);
  } catch (error) {
    console.error('Error fetching careers:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('auth-token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    let payload;
    try {
      payload = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    } catch {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (payload.payload.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const data = await request.json();
    await dbConnect();
    const career = new Career(data);
    await career.save();
    return NextResponse.json(career);
  } catch (error) {
    console.error('Error creating career:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 
