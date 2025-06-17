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

    // Mock data for test results over the last 7 days
    // TODO: Replace with actual test results when TestResult model is implemented
    const mockTestResults = [
      { name: '2025-01-20', value: 12 },
      { name: '2025-01-21', value: 15 },
      { name: '2025-01-22', value: 8 },
      { name: '2025-01-23', value: 20 },
      { name: '2025-01-24', value: 18 },
      { name: '2025-01-25', value: 25 },
      { name: '2025-01-26', value: 22 },
    ];

    return NextResponse.json(mockTestResults);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
} 
