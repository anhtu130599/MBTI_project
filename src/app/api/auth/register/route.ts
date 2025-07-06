import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
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
    const { username, firstName, lastName, email, password } = await request.json();

    // Validation
    if (!username || !firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate username format
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return NextResponse.json(
        { message: 'Username can only contain letters, numbers and underscores' },
        { status: 400 }
      );
    }

    await dbConnect();
    const User = (await import('@/core/infrastructure/database/models/User')).default;

    // Kiểm tra username đã tồn tại
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return NextResponse.json(
        { message: 'Username already exists' },
        { status: 400 }
      );
    }

    // Kiểm tra email đã tồn tại
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return NextResponse.json(
        { message: 'Email already exists' },
        { status: 400 }
      );
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo token xác thực
    const verificationToken = jwt.sign(
      { email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
    
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 giờ

    // Tạo user mới
    const newUser = new User({
      username,
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: 'user',
      isVerified: false,
      verificationToken,
      verificationTokenExpires,
    });

    await newUser.save();

    // Tạo token đăng nhập
    const token = jwt.sign(
      { userId: newUser._id, username: newUser.username, role: newUser.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );
    
    // Gửi email xác thực
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${verificationToken}`;
    
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Xác thực email của bạn',
      html: `
        <h1>Xác thực email</h1>
        <p>Xin chào ${firstName} ${lastName},</p>
        <p>Cảm ơn bạn đã đăng ký tài khoản với tên đăng nhập: <strong>${username}</strong></p>
        <p>Vui lòng click vào link dưới đây để xác thực email của bạn:</p>
        <a href="${verificationUrl}">${verificationUrl}</a>
        <p>Link này sẽ hết hạn sau 24 giờ.</p>
        <p>Nếu bạn không yêu cầu đăng ký tài khoản này, vui lòng bỏ qua email này.</p>
      `
    });

    return NextResponse.json({
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 
