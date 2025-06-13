import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import { sendPasswordResetEmail } from '@/core/infrastructure/external/nodemailer';

const PASSWORD_RESET_SECRET = process.env.PASSWORD_RESET_SECRET || 'reset-secret';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json(
        { error: 'Vui lòng cung cấp email' },
        { status: 400 }
      );
    }
    
    await dbConnect();
    
    // Tìm người dùng theo email
    const user = await User.findOne({ email });
    
    if (!user) {
      // Trả về thành công ngay cả khi không tìm thấy email để tránh email enumeration
      return NextResponse.json(
        { message: 'Nếu email tồn tại, chúng tôi sẽ gửi link đặt lại mật khẩu' }
      );
    }
    
    // Tạo token đặt lại mật khẩu
    const token = jwt.sign(
      { id: user._id, email: user.email },
      PASSWORD_RESET_SECRET,
      { expiresIn: '1h' }
    );
    
    // Gửi email đặt lại mật khẩu
    const emailSent = await sendPasswordResetEmail(user.email, token);
    
    if (!emailSent) {
      return NextResponse.json(
        { error: 'Không thể gửi email đặt lại mật khẩu' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      message: 'Nếu email tồn tại, chúng tôi sẽ gửi link đặt lại mật khẩu'
    });
  } catch (error) {
    console.error('Error in forgot password:', error);
    return NextResponse.json(
      { error: 'Có lỗi xảy ra' },
      { status: 500 }
    );
  }
} 
