import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();
    
    if (!token) {
      return NextResponse.json(
        { error: 'Token xác thực không hợp lệ' },
        { status: 400 }
      );
    }
    
        // Xác thực token
    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    } catch (error) {
      return NextResponse.json(
        { error: 'Token xác thực đã hết hạn hoặc không hợp lệ' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Tìm người dùng theo email từ token
    const user = await User.findOne({ email: decoded.email });
    
    if (!user) {
      return NextResponse.json(
        { error: 'Không tìm thấy người dùng' },
        { status: 404 }
      );
    }
    
    // Kiểm tra xem email đã được xác thực chưa
    if (user.emailVerified) {
      return NextResponse.json(
        { message: 'Email đã được xác thực trước đó' }
      );
    }
    
    // Kiểm tra token có khớp không
    if (user.verificationToken !== token) {
      return NextResponse.json(
        { error: 'Token xác thực không đúng' },
        { status: 400 }
      );
    }
    
    // Kiểm tra thời hạn token
    if (user.verificationTokenExpires < new Date()) {
      return NextResponse.json(
        { error: 'Token xác thực đã hết hạn' },
        { status: 400 }
      );
    }
    
    // Cập nhật trạng thái xác thực
    user.emailVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpires = null;
    await user.save();
    
    return NextResponse.json({
      message: 'Xác thực email thành công!'
    });
  } catch (error) {
    console.error('Error verifying email:', error);
    return NextResponse.json(
      { error: 'Xác thực email thất bại' },
      { status: 500 }
    );
  }
} 
