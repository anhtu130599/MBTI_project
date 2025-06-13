import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
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

    await dbConnect();

    const User = (await import('@/models/User')).default;
    const Question = (await import('@/models/Question')).default;
    const PersonalityType = (await import('@/models/PersonalityType')).default;
    const Career = (await import('@/models/Career')).default;

    // Get current date for recent stats
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [
      totalUsers,
      totalQuestions,
      totalPersonalityTypes,
      totalCareers,
      recentUsers,
      totalUsersLastMonth
    ] = await Promise.all([
      User.countDocuments(),
      Question.countDocuments({ isActive: true }),
      PersonalityType.countDocuments(),
      Career.countDocuments(),
      User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      User.countDocuments({ createdAt: { $lt: thirtyDaysAgo } })
    ]);

    // Calculate growth percentage
    const growthPercentage = totalUsersLastMonth > 0 
      ? Math.round((recentUsers / totalUsersLastMonth) * 100)
      : 0;

    // Mock test data (will be real when test results collection exists)
    const totalTestsCompleted = Math.floor(totalUsers * 1.5); // Estimate
    const recentTestsCount = Math.floor(recentUsers * 2); // Estimate

    return NextResponse.json({
      totalUsers,
      totalTestsCompleted,
      totalQuestions,
      totalPersonalityTypes,
      totalCareers,
      recentTestsCount,
      growthPercentage
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
} 
