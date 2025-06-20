import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { verifyAdminAuth } from '@/shared/utils/auth';

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdminAuth(request);
    if (!authResult.success) {
      console.log('Admin auth failed:', authResult.error);
      return NextResponse.json(
        { message: authResult.error },
        { status: authResult.status }
      );
    }

    console.log('Admin authenticated:', authResult.username, 'role:', authResult.role);

    await dbConnect();

    const User = (await import('@/models/User')).default;
    const Question = (await import('@/core/infrastructure/database/models/Question')).default;
    const PersonalityType = (await import('@/core/infrastructure/database/models/PersonalityType')).default;
    const Career = (await import('@/core/infrastructure/database/models/Career')).default;

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
      Question.countDocuments({}),
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

    const stats = {
      totalUsers,
      totalTestsCompleted,
      totalQuestions,
      totalPersonalityTypes,
      totalCareers,
      recentTestsCount,
      growthPercentage
    };

    console.log('Admin stats fetched successfully:', stats);

    return NextResponse.json(stats);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    console.error('Admin stats error:', error);
    return NextResponse.json(
      { message },
      { status: 500 }
    );
  }
} 
