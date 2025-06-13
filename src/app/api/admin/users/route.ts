import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'Không có quyền truy cập' },
        { status: 403 }
      );
    }
    let payload;
    try {
      payload = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    } catch (err) {
      return NextResponse.json(
        { error: 'Token không hợp lệ hoặc đã hết hạn' },
        { status: 403 }
      );
    }
    if (payload.payload.role !== 'admin') {
      return NextResponse.json(
        { error: 'Không có quyền truy cập' },
        { status: 403 }
      );
    }
    await dbConnect();
    const users = await User.find({}, '-password -verificationToken -verificationTokenExpires')
      .sort({ createdAt: -1 });
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Lỗi khi lấy danh sách người dùng' },
      { status: 500 }
    );
  }
} 
