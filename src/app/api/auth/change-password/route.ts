import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: NextRequest) {
  try {
    const { oldPassword, newPassword, confirmPassword } = await request.json();
    if (!oldPassword || !newPassword || !confirmPassword) {
      return NextResponse.json({ error: 'Vui lòng nhập đầy đủ thông tin' }, { status: 400 });
    }
    if (newPassword !== confirmPassword) {
      return NextResponse.json({ error: 'Mật khẩu mới và xác nhận không khớp' }, { status: 400 });
    }
    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'Mật khẩu mới phải có ít nhất 6 ký tự' }, { status: 400 });
    }
    // Lấy token từ cookie
    const cookieStore = cookies();
    const token = cookieStore.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Bạn chưa đăng nhập' }, { status: 401 });
    }
    let payload;
    try {
      payload = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    } catch (err) {
      return NextResponse.json({ error: 'Token không hợp lệ hoặc đã hết hạn' }, { status: 401 });
    }
    await dbConnect();
    const user = await User.findById(payload.payload.id);
    if (!user) {
      return NextResponse.json({ error: 'Không tìm thấy người dùng' }, { status: 404 });
    }
    // Kiểm tra mật khẩu cũ
    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      return NextResponse.json({ error: 'Mật khẩu cũ không đúng' }, { status: 400 });
    }
    // Đổi mật khẩu
    user.password = newPassword;
    await user.save();
    return NextResponse.json({ message: 'Đổi mật khẩu thành công' });
  } catch (error) {
    console.error('Error changing password:', error);
    return NextResponse.json({ error: 'Đổi mật khẩu thất bại' }, { status: 500 });
  }
} 