import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import TestResult from '@/models/TestResult';

// Khóa bí mật cho JWT
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(request: NextRequest) {
  try {
    // Lấy token từ cookie
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: 'Không có quyền truy cập' },
        { status: 401 }
      );
    }
    
    // Xác thực token
    let payload;
    try {
      const verified = await jwtVerify(
        token,
        new TextEncoder().encode(JWT_SECRET)
      );
      payload = verified.payload;
    } catch (error) {
      return NextResponse.json(
        { error: 'Token không hợp lệ' },
        { status: 401 }
      );
    }
    
    // Kiểm tra quyền admin
    if (payload.role !== 'admin') {
      return NextResponse.json(
        { error: 'Không có quyền truy cập' },
        { status: 403 }
      );
    }
    
    // Kết nối database
    await dbConnect();
    
    // Lấy số lượng người dùng
    const userCount = await User.countDocuments();
    
    // Lấy số lượng bài test
    const testCount = await TestResult.countDocuments();
    
    // Lấy các loại tính cách phổ biến nhất
    const popularTypesAggregation = await TestResult.aggregate([
      { $group: { _id: '$personalityType', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $project: { _id: 0, type: '$_id', count: 1 } }
    ]);
    
    // Lấy các bài test gần đây
    const recentTests = await TestResult.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('personalityType createdAt');
    
    // Trả về dữ liệu thống kê
    return NextResponse.json({
      userCount,
      testCount,
      popularTypes: popularTypesAggregation,
      recentTests: recentTests.map(test => ({
        id: test._id,
        personalityType: test.personalityType,
        createdAt: test.createdAt
      }))
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'Không thể lấy dữ liệu thống kê' },
      { status: 500 }
    );
  }
} 