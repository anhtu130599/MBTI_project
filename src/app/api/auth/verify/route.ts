import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

const EMAIL_VERIFY_SECRET = process.env.EMAIL_VERIFY_SECRET || 'verify-secret';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();
    if (!token) {
      return NextResponse.json({ error: 'Thiếu token xác nhận.' }, { status: 400 });
    }

    // Giải mã token để lấy userId/email
    let payload;
    try {
      payload = jwt.verify(token, EMAIL_VERIFY_SECRET);
    } catch (err) {
      return NextResponse.json({ error: 'Token không hợp lệ hoặc đã hết hạn.' }, { status: 400 });
    }

    await dbConnect();
    const user = await User.findOne({ _id: payload.id, email: payload.email });
    if (!user) {
      return NextResponse.json({ error: 'Không tìm thấy người dùng.' }, { status: 404 });
    }
    if (user.emailVerified) {
      return NextResponse.json({ message: 'Email đã được xác nhận trước đó.' });
    }
    user.emailVerified = true;
    await user.save();
    return NextResponse.json({ message: 'Xác nhận email thành công!' });
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi xác nhận email.' }, { status: 500 });
  }
} 