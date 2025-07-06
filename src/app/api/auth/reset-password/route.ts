import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/core/infrastructure/database/models/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const PASSWORD_RESET_SECRET = process.env.PASSWORD_RESET_SECRET || 'reset-secret';

interface ResetPayload extends jwt.JwtPayload {
    id: string;
    email: string;
}

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json();
    
    if (!token || !password) {
      return NextResponse.json(
        { error: 'Vui lòng cung cấp token và mật khẩu mới' },
        { status: 400 }
      );
    }
    
        // Giải mã token
    let payload: ResetPayload;
    try {
      payload = jwt.verify(token, PASSWORD_RESET_SECRET) as ResetPayload;
    } catch {
      return NextResponse.json(
        { error: 'Token không hợp lệ hoặc đã hết hạn' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Tìm người dùng
    const user = await User.findOne({ _id: payload.id, email: payload.email });
    if (!user) {
      return NextResponse.json(
        { error: 'Không tìm thấy người dùng' },
        { status: 404 }
      );
    }
    
    // Hash mật khẩu mới
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Cập nhật mật khẩu
    user.password = hashedPassword;
    await user.save();
    
    return NextResponse.json({
      message: 'Đặt lại mật khẩu thành công'
    });
  } catch (error) {
    console.error('Error resetting password:', error);
    return NextResponse.json(
      { error: 'Đặt lại mật khẩu thất bại' },
      { status: 500 }
    );
  }
} 
