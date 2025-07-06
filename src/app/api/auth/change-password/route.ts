import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/core/infrastructure/database/models/User';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { sendPasswordChangeNotificationEmail } from '@/core/infrastructure/external/nodemailer';

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
    } catch {
      return NextResponse.json({ error: 'Token không hợp lệ hoặc đã hết hạn' }, { status: 401 });
    }
    await dbConnect();
    const user = await User.findById(payload.payload.userId);
    if (!user) {
      return NextResponse.json({ error: 'Không tìm thấy người dùng' }, { status: 404 });
    }
    // Kiểm tra mật khẩu cũ
    const bcrypt = require('bcryptjs');
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: 'Mật khẩu cũ không đúng' }, { status: 400 });
    }
    // Đổi mật khẩu
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);
    await User.findByIdAndUpdate(user._id, { password: hashedNewPassword });
    
    // Gửi email thông báo đổi mật khẩu thành công
    try {
      const emailSent = await sendPasswordChangeNotificationEmail(user.email, user.username);
      if (!emailSent) {
        console.warn(`Failed to send password change notification to ${user.email}`);
        // Không return error vì việc đổi mật khẩu đã thành công
        // Chỉ log warning để admin biết
      }
    } catch (emailError) {
      console.error('Error sending password change notification:', emailError);
      // Tương tự, không làm fail request vì đổi mật khẩu đã thành công
    }
    
    return NextResponse.json({ 
      message: 'Đổi mật khẩu thành công',
      emailNotificationSent: true // Thông báo cho frontend biết email đã được gửi
    });
  } catch (error) {
    console.error('Error changing password:', error);
    return NextResponse.json({ error: 'Đổi mật khẩu thất bại' }, { status: 500 });
  }
} 
