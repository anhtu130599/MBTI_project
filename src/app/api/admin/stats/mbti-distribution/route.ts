import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    let payload;
    try {
      payload = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    } catch {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (payload.payload.role !== 'admin') {
      return NextResponse.json(
        { message: 'Forbidden' },
        { status: 403 }
      );
    }

    // Mock data for MBTI distribution
    // TODO: Replace with actual data when TestResult model is implemented
    const mockMbtiDistribution = [
      { name: 'INTJ', value: 25 },
      { name: 'INFP', value: 22 },
      { name: 'ENFP', value: 18 },
      { name: 'INTP', value: 15 },
      { name: 'ENTJ', value: 12 },
      { name: 'INFJ', value: 10 },
      { name: 'ENFJ', value: 8 },
      { name: 'ENTP', value: 6 },
    ];

    return NextResponse.json(mockMbtiDistribution);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
} 
