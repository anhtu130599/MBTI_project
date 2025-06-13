import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Question from '@/models/Question';

export async function GET() {
  try {
    await dbConnect();
    
    const [totalQuestions, categoryStats] = await Promise.all([
      Question.countDocuments({ isActive: true }),
      Question.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$category', count: { $sum: 1 } } }
      ])
    ]);

    const categories = categoryStats.reduce((acc, cat) => {
      acc[cat._id] = cat.count;
      return acc;
    }, {});

    return NextResponse.json({
      success: true,
      data: {
        totalQuestions,
        categories: {
          EI: categories.EI || 0,
          SN: categories.SN || 0,
          TF: categories.TF || 0,
          JP: categories.JP || 0
        },
        estimatedTime: Math.ceil(totalQuestions * 1.5) // 1.5 phút/câu
      }
    });
  } catch (error) {
    console.error('Error fetching question stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch question statistics' },
      { status: 500 }
    );
  }
} 