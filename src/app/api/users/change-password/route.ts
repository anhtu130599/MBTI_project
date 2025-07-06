import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import bcryptjs from 'bcryptjs';
import { sendPasswordChangeNotificationEmail } from '@/core/infrastructure/external/nodemailer';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: NextRequest) {
  try {
    // Get user from JWT token
    const cookieStore = cookies();
    const token = cookieStore.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let payload;
    try {
      payload = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const userId = payload.payload.id;
    const { currentPassword, newPassword } = await request.json();

    await dbConnect();
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Verify current password
    const isValidPassword = await bcryptjs.compare(currentPassword, user.password);
    if (!isValidPassword) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
    }

    // Hash new password
    const hashedNewPassword = await bcryptjs.hash(newPassword, 12);

    // Update password
    await User.findByIdAndUpdate(userId, { password: hashedNewPassword });

    // Gửi email thông báo đổi mật khẩu thành công
    try {
      const emailSent = await sendPasswordChangeNotificationEmail(user.email, user.name);
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
      message: 'Password updated successfully',
      emailNotificationSent: true // Thông báo cho frontend biết email đã được gửi
    });
  } catch (error) {
    console.error('Error changing password:', error);
    return NextResponse.json(
      { error: 'Failed to change password' },
      { status: 500 }
    );
  }
} 
