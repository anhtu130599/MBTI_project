import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

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
    
    // Tạo người dùng mới
    const newUser = await User.create({
      username,
      email,
      password,
      // Chỉ cho phép tạo admin nếu đã xác thực là admin
      role: role === 'admin' ? 'admin' : 'user'
    });
    
    // Trả về thông tin người dùng (không bao gồm mật khẩu)
    const userResponse = {
      id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
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