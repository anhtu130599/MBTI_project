import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/core/infrastructure/database/models/User';
import { verifyAdminAuth } from '@/shared/utils/auth';

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdminAuth(request);
    if (!authResult.success) {
      console.log('Admin auth failed in /admin/users:', authResult.error);
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    console.log('Admin authenticated in /admin/users:', authResult.username);

    await dbConnect();
    const users = await User.find({}, '-password -verificationToken -verificationTokenExpires')
      .sort({ createdAt: -1 });
    
    console.log('Found users:', users.length);
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Lỗi khi lấy danh sách người dùng' },
      { status: 500 }
    );
  }
} 
