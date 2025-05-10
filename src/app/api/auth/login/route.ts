import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SignJWT } from 'jose';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

// Khóa bí mật cho JWT
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    
    // Kiểm tra dữ liệu đầu vào
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Vui lòng cung cấp tên đăng nhập và mật khẩu' },
        { status: 400 }
      );
    }
    
    // Kết nối database
    await dbConnect();
    
    // Tìm người dùng theo username
    const user = await User.findOne({ username });
    
    // Kiểm tra xem người dùng có tồn tại không
    if (!user) {
      return NextResponse.json(
        { error: 'Tên đăng nhập hoặc mật khẩu không đúng' },
        { status: 401 }
      );
    }
    
    // Kiểm tra mật khẩu
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Tên đăng nhập hoặc mật khẩu không đúng' },
        { status: 401 }
      );
    }
    
    // Cập nhật thời gian đăng nhập cuối cùng
    user.lastLogin = new Date();
    await user.save();
    
    // Tạo JWT token
    const token = await new SignJWT({
      id: user._id,
      username: user.username,
      role: user.role
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(new TextEncoder().encode(JWT_SECRET));
    
    // Lưu token vào cookie
    cookies().set({
      name: 'auth-token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 ngày
      path: '/'
    });
    
    // Trả về thông tin người dùng (không bao gồm mật khẩu)
    const userResponse = {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role
    };
    
    return NextResponse.json(userResponse);
  } catch (error) {
    console.error('Error logging in:', error);
    return NextResponse.json(
      { error: 'Đăng nhập thất bại' },
      { status: 500 }
    );
  }
} 