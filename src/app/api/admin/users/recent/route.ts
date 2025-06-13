import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    let payload;
    try {
      payload = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    } catch {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (payload.payload.role !== 'admin') {
      return NextResponse.json(
        { message: 'Forbidden' },
        { status: 403 }
      );
    }

    await dbConnect();

    const User = (await import('@/models/User')).default;

    const recentUsers = await User
      .find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('username email role createdAt lastLogin')
      .lean();

    return NextResponse.json(recentUsers);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
} 
