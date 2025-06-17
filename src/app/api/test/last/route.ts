import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import TestResult from '@/models/TestResult';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET() {
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
    const userId = payload.payload.id;
    await dbConnect();
    const result = await TestResult.findOne({ userId });
    if (!result) {
      return NextResponse.json({ error: 'Chưa có kết quả.' }, { status: 404 });
    }
    return NextResponse.json({
      id: result._id,
      personalityType: result.personalityType,
      careerRecommendations: result.careerRecommendations,
      timestamp: result.createdAt
    });
  } catch (error) {
    console.error('Error fetching last test result:', error);
    return NextResponse.json({ error: 'Failed to fetch last test result' }, { status: 500 });
  }
} 
