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

// interface TestHistoryDocument {
//   _id: {
//     toString: () => string;
//   };
//   personalityType: string;
//   scores: Record<string, number>;
//   percentages: Record<string, number>;
//   careerRecommendations: string[];
//   totalQuestions: number;
//   createdAt: Date;
// }

export async function GET(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUser(request);
    
    await dbConnect();
    
    // Lấy lịch sử test thực tế từ database
    const { TestResult } = await import('@/models');
    const testHistory = await TestResult.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    // Transform data to match expected format
    const formattedHistory = testHistory.map((result) => ({
      id: String(result._id),
      personalityType: result.personalityType,
      type: result.personalityType, // For compatibility
      scores: result.scores,
      percentages: result.percentages,
      careerRecommendations: result.careerRecommendations,
      totalQuestions: result.totalQuestions,
      createdAt: result.createdAt,
      timestamp: result.createdAt
    }));

    return NextResponse.json(formattedHistory);
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
