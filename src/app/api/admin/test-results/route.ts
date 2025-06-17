import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import TestResult from '@/models/TestResult';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Bạn cần đăng nhập.' }, { status: 401 });
    }
    let payload;
    try {
      payload = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    } catch {
      return NextResponse.json({ error: 'Token không hợp lệ.' }, { status: 401 });
    }
    if (payload.payload.role !== 'admin') {
      return NextResponse.json({ error: 'Chỉ admin mới được phép truy cập.' }, { status: 403 });
    }
    await dbConnect();
    const results = await TestResult.find({});
    return NextResponse.json({
      results: results.map(r => ({
        id: r._id,
        userId: r.userId,
        personalityType: r.personalityType,
        careerRecommendations: r.careerRecommendations,
        timestamp: r.createdAt
      }))
    });
  } catch (error) {
    console.error('Error fetching all test results:', error);
    return NextResponse.json({ error: 'Failed to fetch all test results' }, { status: 500 });
  }
} 
