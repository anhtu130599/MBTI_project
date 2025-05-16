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
    console.log('TOKEN:', token);
    if (!token) {
      return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 });
    }
    let payload;
    try {
      payload = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
      console.log('PAYLOAD:', payload);
    } catch (err) {
      console.error('JWT VERIFY ERROR:', err);
      return NextResponse.json({ error: 'Token không hợp lệ hoặc đã hết hạn' }, { status: 401 });
    }
    await dbConnect();
    const user = await User.findById(payload.payload.id).select('-password');
    console.log('USER:', user);
    if (!user) {
      return NextResponse.json({ error: 'Không tìm thấy người dùng' }, { status: 404 });
    }
    return NextResponse.json({ user });
  } catch (error) {
    console.error('API /api/auth/me ERROR:', error);
    return NextResponse.json({ error: 'Lỗi lấy thông tin user', detail: (error as any)?.message || String(error) }, { status: 500 });
  }
}