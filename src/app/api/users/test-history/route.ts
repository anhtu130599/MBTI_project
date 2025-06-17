import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

async function getAuthenticatedUser(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  if (!token) {
    throw new Error('Unauthorized');
  }

  try {
    const payload = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    return payload.payload.userId as string;
  } catch {
    throw new Error('Unauthorized');
  }
}

interface TestHistoryItem {
  _id: string;
  personalityType: string;
  createdAt: string;
}

export async function GET(request: NextRequest) {
  try {
    await getAuthenticatedUser(request);
    
    await dbConnect();
    
    // For now, return empty array since we don't have test results collection yet
    // TODO: Replace with actual TestResult model when implemented
    const testHistory: TestHistoryItem[] = [];
    
    // Example of how it would work with actual TestResult model:
    // const TestResult = (await import('@/models/TestResult')).default;
    // const testHistory = await TestResult.find({ userId })
    //   .sort({ createdAt: -1 })
    //   .lean();

    return NextResponse.json(testHistory);
  } catch (e) {
    const error = e as Error;
    console.error('Get test history error:', error);
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 
