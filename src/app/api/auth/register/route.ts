import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

// Cấu hình transporter cho nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function POST(request: NextRequest) {
  try {
    const { username, email, password, role } = await request.json();
    
    // Kiểm tra dữ liệu đầu vào
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: 'Vui lòng cung cấp đầy đủ thông tin' },
        { status: 400 }
      );
    }
    
    // Kết nối database
    await dbConnect();
    
    // Kiểm tra xem username hoặc email đã tồn tại chưa
    const existingUser = await User.findOne({
      $or: [{ username }, { email }]
    });
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'Tên đăng nhập hoặc email đã tồn tại' },
        { status: 409 }
      );
    }
    
    // Tạo token xác thực
    const verificationToken = jwt.sign(
      { email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
    
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 giờ
    
    // Tạo người dùng mới
    const newUser = await User.create({
      username,
      email,
      password,
      role: role === 'admin' ? 'admin' : 'user',
      emailVerified: false,
      verificationToken,
      verificationTokenExpires
    });
    
    // Gửi email xác thực
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${verificationToken}`;
    
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Xác thực email của bạn',
      html: `
        <h1>Xác thực email</h1>
        <p>Xin chào ${username},</p>
        <p>Cảm ơn bạn đã đăng ký tài khoản. Vui lòng click vào link dưới đây để xác thực email của bạn:</p>
        <a href="${verificationUrl}">${verificationUrl}</a>
        <p>Link này sẽ hết hạn sau 24 giờ.</p>
        <p>Nếu bạn không yêu cầu đăng ký tài khoản này, vui lòng bỏ qua email này.</p>
      `
    });
    
    // Trả về thông tin người dùng
    const userResponse = {
      id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
      emailVerified: newUser.emailVerified,
      createdAt: newUser.createdAt
    };
    
    return NextResponse.json(userResponse, { status: 201 });
  } catch (error) {
    console.error('Error registering user:', error);
    return NextResponse.json(
      { error: 'Đăng ký thất bại' },
      { status: 500 }
    );
  }
} 