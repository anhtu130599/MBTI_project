import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import dbConnect from '@/lib/mongodb';
import { TestResult } from '@/models';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Hàm lấy thông tin nghề nghiệp phù hợp từ database dựa trên loại tính cách
async function getCareerRecommendations(personalityType: string): Promise<string[]> {
  try {
    const Career = (await import('@/models/Career')).default;
    const careers = await Career.find({
      personalityTypes: { $in: [personalityType] }
    }).select('title').sort({ title: 1 }).limit(10);
    
    return careers.map(career => career.title);
  } catch (error) {
    console.error('Error fetching career recommendations from database:', error);
    // Fallback to static data if database query fails
    const fallbackCareers: Record<string, string[]> = {
      'INTJ': ['Systems Engineer', 'Software Developer', 'Business Analyst', 'Financial Advisor', 'Scientist'],
      'INTP': ['Software Developer', 'Data Scientist', 'Architect', 'Professor', 'Research Scientist'],
      'ENTJ': ['Executive', 'Entrepreneur', 'Lawyer', 'Management Consultant', 'Project Manager'],
      'ENTP': ['Entrepreneur', 'Creative Director', 'Lawyer', 'Marketing Strategist', 'Systems Analyst'],
      'INFJ': ['Counselor', 'HR Manager', 'Writer', 'Psychologist', 'Professor'],
      'INFP': ['Writer', 'Graphic Designer', 'Psychologist', 'Social Worker', 'HR Specialist'],
      'ENFJ': ['Teacher', 'HR Director', 'Marketing Manager', 'Public Relations Specialist', 'Non-profit Director'],
      'ENFP': ['Journalist', 'Advertising Creative', 'Consultant', 'Event Planner', 'Psychologist'],
      'ISTJ': ['Accountant', 'Auditor', 'Financial Analyst', 'Project Manager', 'Quality Assurance Specialist'],
      'ISFJ': ['Nurse', 'Elementary Teacher', 'Administrative Assistant', 'Social Worker', 'HR Specialist'],
      'ESTJ': ['Sales Manager', 'Project Manager', 'Business Administrator', 'Police Officer', 'Judge'],
      'ESFJ': ['Nurse', 'Teacher', 'Sales Representative', 'Event Coordinator', 'HR Specialist'],
      'ISTP': ['Engineer', 'Mechanic', 'Pilot', 'Forensic Scientist', 'Carpenter'],
      'ISFP': ['Artist', 'Designer', 'Veterinarian', 'Chef', 'Physical Therapist'],
      'ESTP': ['Sales Representative', 'Marketing Executive', 'Entrepreneur', 'Firefighter', 'Paramedic'],
      'ESFP': ['Event Planner', 'Travel Agent', 'Sales Representative', 'Performer', 'Child Care Provider']
    };
    
    return fallbackCareers[personalityType] || ['Career information not available for this type'];
  }
}

export async function POST(request: NextRequest) {
  try {
    // Kiểm tra authentication
    const cookieStore = cookies();
    const token = cookieStore.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: 'Bạn cần đăng nhập để lưu kết quả test.', requireLogin: true },
        { status: 401 }
      );
    }

    let userId;
    try {
      const payload = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
      userId = payload.payload.id || payload.payload.userId;
    } catch {
      return NextResponse.json(
        { error: 'Token không hợp lệ. Vui lòng đăng nhập lại.', requireLogin: true },
        { status: 401 }
      );
    }

    // Lấy dữ liệu từ request
    const data = await request.json();
    
    if (!data.testResult) {
      return NextResponse.json(
        { error: 'Không tìm thấy dữ liệu test để lưu.' },
        { status: 400 }
      );
    }

    const { testResult, answers } = data;

    // Kết nối database và lưu kết quả
    await dbConnect();
    
    // Lấy gợi ý nghề nghiệp từ database
    const careerRecommendations = await getCareerRecommendations(testResult.type);
    
    const savedResult = await TestResult.create({
      userId,
      personalityType: testResult.type,
      scores: testResult.scores,
      percentages: testResult.percentages,
      careerRecommendations: careerRecommendations,
      answers: answers || {},
      totalQuestions: testResult.total_questions || 0
    });

    console.log('✅ Đã lưu kết quả test thủ công với ID:', savedResult._id);

    return NextResponse.json({
      success: true,
      message: 'Kết quả đã được lưu vào lịch sử tài khoản thành công!',
      id: savedResult._id,
      timestamp: savedResult.createdAt
    });

  } catch (error) {
    console.error('Error saving test result:', error);
    return NextResponse.json(
      { error: 'Có lỗi xảy ra khi lưu kết quả. Vui lòng thử lại.' },
      { status: 500 }
    );
  }
} 