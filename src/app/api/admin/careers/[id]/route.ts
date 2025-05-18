import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import dbConnect from '@/lib/mongodb';
import Career from '@/models/Career';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

async function checkAdmin() {
  const cookieStore = cookies();
  const token = cookieStore.get('auth-token')?.value;
  if (!token) return false;
  try {
    const payload = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    return payload.payload.role === 'admin';
  } catch {
    return false;
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const isAdmin = await checkAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const career = await Career.findById(params.id);
    
    if (!career) {
      return NextResponse.json({ error: 'Not Found' }, { status: 404 });
    }

    return NextResponse.json(career);
  } catch (error) {
    console.error('Error fetching career:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const isAdmin = await checkAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    await dbConnect();

    const career = await Career.findByIdAndUpdate(
      params.id,
      { ...data, updatedAt: new Date() },
      { new: true }
    );

    if (!career) {
      return NextResponse.json({ error: 'Not Found' }, { status: 404 });
    }

    return NextResponse.json(career);
  } catch (error) {
    console.error('Error updating career:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const isAdmin = await checkAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const career = await Career.findByIdAndDelete(params.id);

    if (!career) {
      return NextResponse.json({ error: 'Not Found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (error) {
    console.error('Error deleting career:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 